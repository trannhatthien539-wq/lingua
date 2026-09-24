/**
 * Mẫu Cloud Function làm proxy cho API AI (tuỳ chọn).
 *
 * Vì sao cần: mặc định app gọi Gemini/Groq trực tiếp bằng API key của người dùng.
 * Nếu bạn muốn người dùng KHÔNG cần dán key, hãy deploy function này và đặt
 * biến môi trường khi build web:
 *
 *   VITE_AI_PROXY_URL=https://<region>-<project>.cloudfunctions.net/aiProxy
 *
 * Khi có VITE_AI_PROXY_URL, `src/services/aiService.js` sẽ gửi
 * { provider, prompt, json } tới URL đó và không cần API key phía client.
 *
 * Deploy:
 *   cd functions && npm install
 *   firebase functions:secrets:set GEMINI_API_KEY
 *   firebase functions:secrets:set GROQ_API_KEY
 *   firebase functions:secrets:set DEEPSEEK_API_KEY
 *   firebase deploy --only functions
 */
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const geminiKey = defineSecret("GEMINI_API_KEY");
const groqKey = defineSecret("GROQ_API_KEY");
const deepseekKey = defineSecret("DEEPSEEK_API_KEY");

const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
const GROQ_MODEL = "llama-3.3-70b-versatile";
const DEEPSEEK_MODEL = "deepseek-chat";

// Giới hạn đơn giản theo IP để tránh bị lạm dụng (đủ dùng cho quy mô nhỏ).
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const hits = new Map();
const MAX_TRACKED_IPS = 5000;
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/trannhatthien539-wq\.github\.io$/,
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  /^capacitor:\/\/localhost$/,
];

const isAllowedOrigin = (origin) => !origin || ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));

const cleanupHits = (now) => {
  for (const [ip, timestamps] of hits) {
    const recent = timestamps.filter((time) => now - time < WINDOW_MS);
    if (recent.length) hits.set(ip, recent);
    else hits.delete(ip);
  }
  while (hits.size > MAX_TRACKED_IPS) hits.delete(hits.keys().next().value);
};

const rateLimited = (ip) => {
  const now = Date.now();
  cleanupHits(now);
  const recent = hits.get(ip) || [];
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
};

const callGemini = async (apiKey, model, prompt, json) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        ...(json ? { generationConfig: { responseMimeType: "application/json" } } : {}),
      }),
    },
  );
  const payload = await response.json();
  if (!response.ok) throw Object.assign(new Error(payload?.error?.message || `HTTP ${response.status}`), { status: response.status });
  return payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
};

const callOpenAiCompatible = async (apiKey, endpoint, model, prompt, json) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw Object.assign(new Error(payload?.error?.message || `HTTP ${response.status}`), { status: response.status });
  return payload?.choices?.[0]?.message?.content?.trim() || "";
};

const callGroq = (apiKey, prompt, json) => callOpenAiCompatible(apiKey, "https://api.groq.com/openai/v1/chat/completions", GROQ_MODEL, prompt, json);
const callDeepSeek = (apiKey, prompt, json) => callOpenAiCompatible(apiKey, "https://api.deepseek.com/chat/completions", DEEPSEEK_MODEL, prompt, json);

exports.aiProxy = onRequest(
  {
    secrets: [geminiKey, groqKey, deepseekKey],
    cors: [/^https:\/\/trannhatthien539-wq\.github\.io$/, /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/, /^capacitor:\/\/localhost$/],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request, response) => {
    const origin = request.get("origin") || "";
    if (!isAllowedOrigin(origin)) {
      response.status(403).json({ error: { message: "Origin không được phép." } });
      return;
    }
    if (request.method !== "POST") {
      response.status(405).json({ error: { message: "Chỉ hỗ trợ POST." } });
      return;
    }
    const forwardedFor = String(request.headers["x-forwarded-for"] || "");
    const ip = forwardedFor.split(",")[0].trim() || request.ip || "unknown";
    if (rateLimited(String(ip))) {
      response.status(429).json({ error: { message: "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau một phút." } });
      return;
    }
    const { provider = "gemini", prompt, json = false } = request.body || {};
    if (!prompt || typeof prompt !== "string" || prompt.length > 20_000) {
      response.status(400).json({ error: { message: "Thiếu prompt hoặc prompt quá dài." } });
      return;
    }
    try {
      if (provider === "groq") {
        response.json({ text: await callGroq(groqKey.value(), prompt, json) });
        return;
      }
      if (provider === "deepseek") {
        response.json({ text: await callDeepSeek(deepseekKey.value(), prompt, json) });
        return;
      }
      if (provider !== "gemini") {
        response.status(400).json({ error: { message: "Provider AI không được hỗ trợ." } });
        return;
      }
      let lastError;
      for (const model of GEMINI_MODELS) {
        try {
          response.json({ text: await callGemini(geminiKey.value(), model, prompt, json) });
          return;
        } catch (error) {
          lastError = error;
          if (![404, 429, 500].includes(error.status)) break;
        }
      }
      throw lastError || new Error("Không gọi được model AI.");
    } catch (error) {
      response.status(error.status && error.status >= 400 && error.status < 600 ? error.status : 500).json({
        error: { message: error.message || "Lỗi máy chủ AI." },
      });
    }
  },
);
