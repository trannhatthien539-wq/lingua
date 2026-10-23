/**
 * Gemini proxy: the shared key stays in Firebase Secret Manager and never
 * reaches the browser. This endpoint is only used when a user has no own key.
 *
 * Deploy:
 *   firebase functions:secrets:set GEMINI_API_KEY
 *   firebase deploy --only functions:aiProxy
 */
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const geminiKey = defineSecret("GEMINI_API_KEY");
const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-2.5-flash"];
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_TRACKED_IPS = 5000;
const hits = new Map();
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/trannhatthien539-wq\.github\.io$/,
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  /^capacitor:\/\/localhost$/,
];

const isAllowedOrigin = (origin) =>
  Boolean(origin) && ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));

const rateLimited = (ip) => {
  const now = Date.now();
  for (const [trackedIp, timestamps] of hits) {
    const recent = timestamps.filter((time) => now - time < WINDOW_MS);
    if (recent.length) hits.set(trackedIp, recent);
    else hits.delete(trackedIp);
  }
  while (hits.size > MAX_TRACKED_IPS) hits.delete(hits.keys().next().value);

  const recent = hits.get(ip) || [];
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
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
  if (!response.ok) {
    throw Object.assign(new Error(payload?.error?.message || `HTTP ${response.status}`), {
      status: response.status,
    });
  }
  return payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
};

exports.aiProxy = onRequest(
  {
    region: "us-central1",
    maxInstances: 2,
    secrets: [geminiKey],
    cors: ALLOWED_ORIGIN_PATTERNS,
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
    if (rateLimited(String(request.ip || "unknown"))) {
      response.status(429).json({ error: { message: "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau một phút." } });
      return;
    }

    const { provider = "gemini", prompt, json = false } = request.body || {};
    if (provider !== "gemini") {
      response.status(400).json({ error: { message: "Proxy dự phòng chỉ hỗ trợ Gemini. Provider khác cần API key cá nhân." } });
      return;
    }
    if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 20_000) {
      response.status(400).json({ error: { message: "Thiếu prompt hoặc prompt quá dài." } });
      return;
    }

    try {
      let lastError;
      for (const model of GEMINI_MODELS) {
        try {
          response.json({ text: await callGemini(geminiKey.value(), model, prompt, Boolean(json)) });
          return;
        } catch (error) {
          lastError = error;
          if (![404, 429, 500].includes(error.status)) break;
        }
      }
      throw lastError || new Error("Không gọi được model Gemini.");
    } catch (error) {
      response.status(error.status && error.status >= 400 && error.status < 600 ? error.status : 500).json({
        error: { message: error.message || "Lỗi máy chủ AI." },
      });
    }
  },
);
