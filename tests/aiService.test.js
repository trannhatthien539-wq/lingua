import test from "node:test";
import assert from "node:assert/strict";
import { canUseAi, requestAi } from "../src/services/aiService.js";

const withMockFetch = async (handler, run) => {
  const original = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
};

const geminiText = (text) => ({
  ok: true,
  status: 200,
  text: async () => JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }),
});

const geminiError = (status) => ({
  ok: false,
  status,
  text: async () => JSON.stringify({ error: { message: `Lỗi giả lập HTTP ${status}.` } }),
});

test("requestAi dùng key dự phòng khi chưa có key cá nhân", async () => {
  const calls = [];
  const answer = await withMockFetch(
    async (url) => {
      calls.push(String(url));
      return geminiText("Xin chào từ key dự phòng");
    },
    () => requestAi("gemini", "", "hi", { fallbackKeys: ["fallback-a"] }),
  );
  assert.equal(answer, "Xin chào từ key dự phòng");
  assert.equal(calls.length, 1);
  assert.match(calls[0], /key=fallback-a/);
});

test("key bị 429 (rate-limit) tự chuyển sang key dự phòng kế tiếp", async () => {
  const calls = [];
  const answer = await withMockFetch(
    async (url) => {
      calls.push(String(url));
      return calls.length === 1 ? geminiError(429) : geminiText("Đã đổi key thành công");
    },
    () => requestAi("gemini", "", "hi", { fallbackKeys: ["key-het-han", "key-moi"] }),
  );
  assert.equal(answer, "Đã đổi key thành công");
  assert.equal(calls.length, 2);
  assert.match(calls[0], /key=key-het-han/);
  assert.match(calls[1], /key=key-moi/);
});

test("key cá nhân không hợp lệ (400) rơi về key dự phòng", async () => {
  const calls = [];
  const answer = await withMockFetch(
    async (url) => {
      calls.push(String(url));
      return calls.length === 1 ? geminiError(400) : geminiText("Fallback cứu trợ");
    },
    () => requestAi("gemini", "personal-key-sai", "hi", { fallbackKeys: ["fallback-b"] }),
  );
  assert.equal(answer, "Fallback cứu trợ");
  assert.match(calls[0], /personal-key-sai/);
  assert.match(calls[1], /key=fallback-b/);
});

test("hết key thì ném lỗi rate-limit cuối cùng", async () => {
  await assert.rejects(
    withMockFetch(async () => geminiError(429), () => requestAi("gemini", "", "hi", { fallbackKeys: ["only-key"] })),
    /Hạn mức AI tạm thời hết/,
  );
});

test("không có key nào thì báo chưa có API key", async () => {
  await assert.rejects(
    withMockFetch(
      async () => {
        throw new Error("không được gọi fetch khi thiếu key");
      },
      () => requestAi("gemini", "", "hi"),
    ),
    /Chưa có API key/,
  );
});

test("canUseAi tính key cá nhân ở mọi provider", () => {
  assert.equal(canUseAi("sk-personal", "deepseek"), true);
  assert.equal(canUseAi("   ", "groq"), false);
  // node --test không nạp env Vite nên không có key dự phòng → gemini không key = false.
  assert.equal(canUseAi("", "gemini"), false);
});