const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
const GROQ_MODEL = "llama-3.3-70b-versatile";
// DeepSeek dùng API tương thích OpenAI (deepseek-chat = V3, deepseek-reasoner = R1).
const DEEPSEEK_MODEL = "deepseek-chat";

/** Danh sách provider + model dùng thử lần lượt (chỉ Gemini mới thử nhiều model). */
const AI_PROVIDERS = {
  gemini: { models: GEMINI_MODELS },
  groq: { models: [GROQ_MODEL] },
  deepseek: { models: [DEEPSEEK_MODEL] },
};

const OPENAI_COMPATIBLE_ENDPOINTS = {
  groq: "https://api.groq.com/openai/v1/chat/completions",
  deepseek: "https://api.deepseek.com/chat/completions",
};

/** Tự cắt kết nối sau 30 giây — tránh để người dùng chờ vô hạn khi mạng yếu (spinner quay mãi). */
const REQUEST_TIMEOUT_MS = 30000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error(`Yêu cầu AI quá ${REQUEST_TIMEOUT_MS / 1000} giây. Mạng có vẻ chậm, vui lòng thử lại.`);
      // Đánh dấu 408 để requestAi dừng thử model tiếp theo và giữ nguyên thông báo này.
      timeoutError.status = 408;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/** Chuẩn hoá id provider, mặc định về gemini. */
export const normalizeProvider = (providerId) =>
  providerId === "groq" || providerId === "deepseek" ? providerId : "gemini";

export const generateSmartVocabularyPrompt = (topic, level, amount, existingWords = []) =>
  `Bạn là giáo viên tiếng Anh. Tạo đúng ${amount} từ vựng theo chủ đề "${topic}" ở trình độ ${level}. TẤT CẢ TỪ PHẢI MỚI VÀ TUYỆT ĐỐI KHÔNG TRÙNG LẶP VỚI CÁC TỪ SAU ĐÂY: ${existingWords.join(", ") || "(chưa có từ nào)"}. Chỉ trả về JSON hợp lệ theo schema {"cards":[{"word":"...","ipa":"...","meaning":"nghĩa tiếng Việt","example":"câu ví dụ tiếng Anh"}]}. Không markdown.`;

const httpErrorMessages = {
  400: "API Key không hợp lệ hoặc model không đúng.",
  403: "API Key không có quyền dùng dịch vụ AI này.",
  404: "Không tìm thấy model AI. Hệ thống sẽ thử model dự phòng.",
  429: "Hạn mức AI tạm thời hết. Vui lòng thử lại sau 30 giây.",
  500: "Dịch vụ AI đang gặp sự cố máy chủ. Vui lòng thử lại sau.",
};

async function readPayload(response) {
  const rawBody = await response.text();
  if (!rawBody) return {};
  try {
    return JSON.parse(rawBody);
  } catch {
    return { rawBody };
  }
}

function getResponseText(providerId, payload) {
  if (providerId === "gemini") {
    return payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  }
  return payload?.choices?.[0]?.message?.content?.trim();
}

function getErrorMessage(status, payload) {
  return httpErrorMessages[status] || payload?.error?.message || `AI trả về lỗi HTTP ${status}. Vui lòng thử lại.`;
}

async function requestModel(providerId, apiKey, prompt, json, model) {
  const isGemini = providerId === "gemini";
  const endpoint = isGemini
    ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
    : OPENAI_COMPATIBLE_ENDPOINTS[providerId];
  const body = isGemini
    ? {
        contents: [{ parts: [{ text: prompt }] }],
        ...(json ? { generationConfig: { responseMimeType: "application/json" } } : {}),
      }
    : {
        model,
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
        ...(json ? { response_format: { type: "json_object" } } : {}),
      };
  const headers = {
    "Content-Type": "application/json",
    ...(isGemini ? {} : { Authorization: `Bearer ${apiKey}` }),
  };
  const response = await fetchWithTimeout(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
  const payload = await readPayload(response);
  if (!response.ok) {
    const error = new Error(getErrorMessage(response.status, payload));
    error.status = response.status;
    throw error;
  }
  const text = getResponseText(providerId, payload);
  if (!text) throw new Error("AI không trả về nội dung. Vui lòng thử lại với prompt khác.");
  return text;
}

/**
 * Chế độ proxy (tuỳ chọn): nếu cấu hình `VITE_AI_PROXY_URL`, mọi yêu cầu AI đi qua
 * máy chủ của bạn (xem `functions/index.js`) nên người dùng không cần dán API key.
 */
const PROXY_URL = (import.meta.env?.VITE_AI_PROXY_URL || "").trim();
export const hasAiProxy = () => Boolean(PROXY_URL);

/**
 * Production chỉ dùng proxy hoặc key cá nhân. `fallbackKeys` là tuỳ chọn dành cho test/internal
 * và không được đọc từ biến VITE_* vì mọi VITE_* đều có thể bị đọc từ bundle công khai.
 */
export const canUseAi = (apiKey) => Boolean(PROXY_URL) || Boolean(apiKey?.trim());

async function requestViaProxy(providerId, prompt, json) {
  const response = await fetchWithTimeout(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: providerId, prompt, json }),
  });
  const payload = await readPayload(response);
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `Máy chủ AI trả về lỗi HTTP ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  const text = String(payload?.text || getResponseText(providerId, payload) || "").trim();
  if (!text) throw new Error("Máy chủ AI không trả về nội dung. Vui lòng thử lại.");
  return text;
}

/** `fallbackKeys` chỉ dành cho test/internal; production không nạp key từ VITE_* hay bundle. */
export async function requestAi(providerId, apiKey, prompt, { json = false, fallbackKeys = [] } = {}) {
  const normalizedProvider = normalizeProvider(providerId);
  if (PROXY_URL) return requestViaProxy(normalizedProvider, prompt, json);
  const personalKey = apiKey?.trim() || "";
  // Gemini: key cá nhân (nếu có) xếp trước, rồi đến key dự phòng; key nào
  // sai/hết quyền/bị rate-limit thì bỏ qua, tự chuyển sang key kế tiếp.
  const keys =
    normalizedProvider === "gemini"
      ? [...new Set([personalKey, ...fallbackKeys].filter(Boolean))]
      : [personalKey];
  if (!keys[0]) throw new Error("Chưa có API key. Hãy lưu API key trước khi sử dụng AI.");
  const models = AI_PROVIDERS[normalizedProvider].models;
  let lastError;
  for (const [keyIndex, key] of keys.entries()) {
    const isLastKey = keyIndex === keys.length - 1;
    for (const model of models) {
      try {
        return await requestModel(normalizedProvider, key, prompt, json, model);
      } catch (error) {
        lastError = error;
        // Key hiện tại không dùng được và vẫn còn key sau → chuyển key ngay.
        if ([400, 401, 403, 429].includes(error.status) && !isLastKey) break;
        // Giữ hành vi cũ: Gemini thử model kế tiếp khi gặp 404/429/500 (đến key cuối).
        if (normalizedProvider === "gemini" && [404, 429, 500].includes(error.status)) continue;
        // Timeout (408), lỗi 4xx còn lại và lỗi mạng: đổi key/model không cứu được.
        if (error.status) throw error;
        throw new Error("Không thể kết nối tới dịch vụ AI. Hãy kiểm tra mạng và thử lại.", { cause: error });
      }
    }
  }
  if (lastError?.status) throw lastError;
  throw new Error("Không thể kết nối tới dịch vụ AI. Hãy kiểm tra mạng và thử lại.");
}

export function parseAiJson(value) {
  const cleaned = String(value || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const starts = [cleaned.indexOf("{"), cleaned.indexOf("[")].filter((index) => index >= 0);
  const start = starts.length ? Math.min(...starts) : -1;
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  if (start < 0 || end < start) throw new Error("AI không trả về dữ liệu JSON hợp lệ.");
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    throw new Error("AI trả về JSON không hợp lệ. Vui lòng thử lại.");
  }
}

export { GEMINI_MODELS };
