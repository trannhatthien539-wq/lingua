const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
const GROQ_MODEL = "llama-3.3-70b-versatile";

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
    : "https://api.groq.com/openai/v1/chat/completions";
  const body = isGemini
    ? {
        contents: [{ parts: [{ text: prompt }] }],
        ...(json ? { generationConfig: { responseMimeType: "application/json" } } : {}),
      }
    : {
        model: GROQ_MODEL,
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
        ...(json ? { response_format: { type: "json_object" } } : {}),
      };
  const headers = {
    "Content-Type": "application/json",
    ...(isGemini ? {} : { Authorization: `Bearer ${apiKey}` }),
  };
  const response = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
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

export async function requestAi(providerId, apiKey, prompt, { json = false } = {}) {
  if (!apiKey?.trim()) throw new Error("Chưa có API key. Hãy lưu API key trước khi sử dụng AI.");
  const normalizedProvider = providerId === "groq" ? "groq" : "gemini";
  const models = normalizedProvider === "gemini" ? GEMINI_MODELS : [GROQ_MODEL];
  let lastError;
  for (const model of models) {
    try {
      return await requestModel(normalizedProvider, apiKey.trim(), prompt, json, model);
    } catch (error) {
      lastError = error;
      if (normalizedProvider !== "gemini" || ![404, 429, 500].includes(error.status)) break;
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
