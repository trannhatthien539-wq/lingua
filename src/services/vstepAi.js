import { normalizeProvider, parseAiJson, requestAi } from "./aiService";

/**
 * Chấm Writing/Speaking VSTEP bằng AI (Gemini/Groq/DeepSeek).
 * Trả về cùng một cấu trúc để UI không phải xử lý riêng từng provider.
 */

const clamp = (value, min, max) => Math.min(Math.max(Number(value) || 0, min), max);
const round1 = (value) => Math.round(clamp(value, 0, 10) * 10) / 10;

const writingPrompt = ({ exam, task, text }) => `Bạn là giám khảo chấm thi VSTEP (${exam.level}).
Chấm bài Writing Task ${task.task} dưới đây theo 4 tiêu chí, mỗi tiêu chí tối đa 2.5 điểm:
1) Task fulfilment (hoàn thành yêu cầu đề)
2) Coherence & cohesion (mạch lạc, từ nối)
3) Vocabulary (từ vựng, độ chính xác)
4) Grammar (ngữ pháp, độ đa dạng cấu trúc)

Đề bài: ${task.prompt}
Yêu cầu số từ: tối thiểu ${task.minWords} từ.

Bài làm của học viên:
"""
${text}
"""

Chỉ trả về JSON hợp lệ theo schema:
{"criteria":[{"name":"Task fulfilment","score":0,"comment":"nhận xét ngắn bằng tiếng Việt"}],
 "score10":0,
 "strengths":["điểm mạnh bằng tiếng Việt"],
 "improvements":["lỗi cần sửa, nêu rõ câu sai và cách sửa, tiếng Việt"],
 "rewritten":"bản viết lại tham khảo bằng tiếng Anh, cùng độ dài"}
Không markdown, không giải thích ngoài JSON.`;

const speakingPrompt = ({ exam, part, transcript }) => `Bạn là giám khảo chấm phần Nói VSTEP (${exam.level}).
Đây là bản ghi lời nói (speech-to-text, có thể sai chính tả) của học viên cho ${part.title}.

Yêu cầu của phần thi: ${part.instruction}
${part.situation ? `Tình huống: ${part.situation}` : ""}
${part.topic ? `Chủ đề: ${part.topic}` : ""}

Bản ghi lời nói:
"""
${transcript}
"""

Chấm theo 3 tiêu chí, mỗi tiêu chí tối đa 3.33 điểm (làm tròn): Fluency & coherence, Vocabulary & grammar, Task fulfilment/content.
Chỉ trả về JSON hợp lệ theo schema:
{"criteria":[{"name":"Fluency & coherence","score":0,"comment":"nhận xét tiếng Việt"}],
 "score10":0,
 "strengths":["..."],
 "improvements":["..."],
 "sampleUpgrade":"bản nói mẫu tốt hơn bằng tiếng Anh, ngắn gọn"}
Không markdown, không giải thích ngoài JSON.`;

const normaliseCriteria = (criteria = [], max = 2.5) =>
  (Array.isArray(criteria) ? criteria : [])
    .filter((item) => item && item.name)
    .map((item) => ({
      name: String(item.name),
      score: Math.round(clamp(item.score, 0, max) * 10) / 10,
      comment: String(item.comment || ""),
    }));

const textList = (value) => (Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : []);

export async function gradeWritingTask({ provider, apiKey, exam, task, text }) {
  if (!text?.trim()) throw new Error("Bạn chưa viết gì để chấm.");
  const raw = await requestAi(normalizeProvider(provider), apiKey, writingPrompt({ exam, task, text }), { json: true });
  const parsed = parseAiJson(raw) || {};
  const criteria = normaliseCriteria(parsed.criteria, 2.5);
  const score10 = criteria.length
    ? round1(criteria.reduce((total, item) => total + item.score, 0))
    : round1(parsed.score10);
  return {
    score10,
    criteria,
    strengths: textList(parsed.strengths),
    improvements: textList(parsed.improvements),
    rewritten: String(parsed.rewritten || ""),
  };
}

export async function gradeSpeakingPart({ provider, apiKey, exam, part, transcript }) {
  if (!transcript?.trim()) throw new Error("Chưa có bản ghi lời nói để chấm.");
  const raw = await requestAi(normalizeProvider(provider), apiKey, speakingPrompt({ exam, part, transcript }), { json: true });
  const parsed = parseAiJson(raw) || {};
  const criteria = normaliseCriteria(parsed.criteria, 3.34);
  const score10 = criteria.length
    ? round1(criteria.reduce((total, item) => total + item.score, 0) * (10 / (criteria.length * 3.34)))
    : round1(parsed.score10);
  return {
    score10,
    criteria,
    strengths: textList(parsed.strengths),
    improvements: textList(parsed.improvements),
    rewritten: String(parsed.sampleUpgrade || ""),
  };
}
