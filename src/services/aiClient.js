const GEMINI_MODEL = 'gemini-3.6-flash'

const providers = {
  gemini: {
    endpoint: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
  },
  groq: {
    model: 'llama-3.3-70b-versatile',
    endpoint: () => 'https://api.groq.com/openai/v1/chat/completions',
  },
}

const httpErrorMessages = {
  400: 'API Key không hợp lệ hoặc model không đúng',
  403: 'API Key không hợp lệ hoặc model không đúng',
  404: 'Không tìm thấy model hoặc endpoint AI. Hãy kiểm tra cấu hình provider.',
  429: 'Hạn mức API miễn phí tạm thời hết, thử lại sau 30s',
  500: 'Dịch vụ AI đang gặp sự cố máy chủ. Vui lòng thử lại sau.',
}

function getErrorMessage(status, payload) {
  return httpErrorMessages[status] || payload?.error?.message || `AI trả về lỗi HTTP ${status}. Vui lòng thử lại.`
}

async function readPayload(response) {
  const rawBody = await response.text()
  if (!rawBody) return {}
  try {
    return JSON.parse(rawBody)
  } catch {
    return { rawBody }
  }
}

function getResponseText(providerId, payload) {
  if (providerId === 'gemini') {
    return payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
  }
  return payload?.choices?.[0]?.message?.content?.trim()
}

export async function requestAi(providerId, apiKey, prompt, { json = false } = {}) {
  if (!apiKey?.trim()) throw new Error('Chưa có API key. Hãy lưu API key trước khi sử dụng AI.')
  const provider = providers[providerId] || providers.gemini
  const isGemini = providerId === 'gemini'
  const body = isGemini
    ? {
        contents: [{ parts: [{ text: prompt }] }],
        ...(json ? { generationConfig: { responseMimeType: 'application/json' } } : {}),
      }
    : {
        model: provider.model,
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }],
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      }
  const headers = {
    'Content-Type': 'application/json',
    ...(isGemini ? {} : { Authorization: `Bearer ${apiKey}` }),
  }

  let response
  let payload
  try {
    response = await fetch(provider.endpoint(apiKey), { method: 'POST', headers, body: JSON.stringify(body) })
    payload = await readPayload(response)
  } catch {
    throw new Error('Không thể kết nối tới dịch vụ AI. Hãy kiểm tra mạng và thử lại.')
  }

  if (!response.ok) throw new Error(getErrorMessage(response.status, payload))
  const text = getResponseText(providerId, payload)
  if (!text) throw new Error('AI không trả về nội dung. Vui lòng thử lại với prompt khác.')
  return text
}

export function parseAiJson(value) {
  const cleaned = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const start = Math.min(...[cleaned.indexOf('{'), cleaned.indexOf('[')].filter((index) => index >= 0))
  const end = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'))
  if (!Number.isInteger(start) || start < 0 || end < start) throw new Error('AI không trả về dữ liệu JSON hợp lệ.')
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    throw new Error('AI trả về JSON không hợp lệ. Vui lòng thử lại.')
  }
}

export { GEMINI_MODEL }