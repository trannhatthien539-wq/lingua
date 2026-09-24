import { useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, Send, Settings2, Sparkles, Trash2, X } from "lucide-react";
import { canUseAi, requestAi } from "../services/aiService";
import { toast } from "../services/toast";

const PROVIDER_STORAGE = "lingua-ai-provider";
const MAX_MESSAGES = 40;

const QUICK_PROMPTS = [
  "Giải thích ngắn gọn sự khác nhau giữa thì hiện tại hoàn thành và quá khứ đơn, kèm 3 ví dụ B1.",
  "Sửa lỗi trong câu sau và giải thích: I have went to Ha Noi last year.",
  "Viết một đoạn 80 từ về sở thích của tôi ở trình độ B1, kèm 5 cụm từ hữu ích.",
  "Tạo 5 câu hỏi Speaking Part 1 về chủ đề công việc kèm câu trả lời mẫu ngắn.",
];

const storageKey = (user) => `lingua-tutor-chat-${user?.uid || "guest"}`;

const readConversation = (user) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(user)) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((message) => message && typeof message.content === "string" && message.role).slice(-MAX_MESSAGES)
      : [];
  } catch {
    return [];
  }
};

/**
 * Prompt gửi AI = chỉ dẫn hệ thống + 6 tin nhắn gần nhất + câu hỏi mới.
 * Trước đây phần "Lịch sử gần đây" được ráp rời ở `send()` và trong này có một biến
 * `history` không dùng — nay gộp về một chỗ để ngữ cảnh luôn khớp với câu hỏi.
 */
const buildPrompt = (messages, question) =>
  [
    "Bạn là gia sư tiếng Anh kiên nhẫn cho người Việt đang học trình độ B1.",
    "Trả lời bằng tiếng Việt, ngắn gọn (tối đa 200 từ), ví dụ tiếng Anh phải kèm nghĩa tiếng Việt.",
    "Nếu học viên viết sai, hãy chỉ rõ lỗi và đưa câu đúng. Không markdown phức tạp, dùng gạch đầu dòng.",
  ].join(" ") +
  `\n\nLịch sử gần đây:\n${messages
    .slice(-6)
    .map((message) => `${message.role === "user" ? "Học viên" : "Gia sư"}: ${message.content}`)
    .join("\n")}\n\nCâu hỏi mới nhất: ${question}`;


/** Gia sư AI: hội thoại hỏi đáp dùng chung API key/provider với các tính năng AI khác. */
export default function AiTutorPanel({ apiKey, user, onClose, onOpenSettings }) {
  const [messages, setMessages] = useState(() => readConversation(user));
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const provider = localStorage.getItem(PROVIDER_STORAGE) || "gemini";
  const ready = canUseAi(apiKey, provider);

  useEffect(() => {
    setMessages(readConversation(user));
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(user), JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {
      // localStorage đầy hoặc bị chặn — bỏ qua.
    }
  }, [messages, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text) => {
    const question = String(text || "").trim();
    if (!question || busy) return;
    if (!ready) {
      toast.error("Hãy lưu API key trong Cài đặt → API trước khi chat với gia sư.");
      return;
    }
    setInput("");
    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setBusy(true);
    try {
      const answer = await requestAi(
        provider,
        apiKey,
        buildPrompt(messages, question),
      );
      setMessages((current) => [...current, { role: "assistant", content: answer }].slice(-MAX_MESSAGES));
    } catch (error) {
      toast.error(error.message || "Không thể kết nối gia sư AI.");
      setMessages(messages);
    } finally {
      setBusy(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    try {
      localStorage.removeItem(storageKey(user));
    } catch {
      // bỏ qua
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-end bg-ink/30 p-0 backdrop-blur-sm sm:p-5 dark:bg-black/50" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="panel flex h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-b-none sm:h-[min(640px,88vh)] sm:rounded-2xl" role="dialog" aria-modal="true" aria-label="Gia sư AI">
        <header className="flex items-center justify-between gap-3 border-b border-ink/[0.08] px-4 py-3 dark:border-white/[0.08]">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-ink"><Bot size={19} /></span>
            <div className="min-w-0">
              <p className="truncate font-display font-bold">Gia sư AI</p>
              <p className="truncate text-xs text-ink/55 dark:text-white/55">Hỏi ngữ pháp, sửa câu, xin ví dụ</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearConversation} disabled={!messages.length} className="icon-btn" aria-label="Xoá hội thoại" title="Xoá hội thoại"><Trash2 size={17} /></button>
            <button onClick={onClose} className="icon-btn" aria-label="Đóng gia sư"><X size={18} /></button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {!messages.length && (
            <div className="rounded-xl bg-ink/[0.04] p-4 dark:bg-white/[0.06]">
              <p className="text-sm font-bold">Bạn cần hỏi gì?</p>
              <p className="mt-1 text-xs leading-5 text-ink/60 dark:text-white/60">Gia sư sẽ trả lời bằng tiếng Việt, kèm ví dụ tiếng Anh và sửa lỗi giúp bạn.</p>
              <div className="mt-3 flex flex-col gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button key={prompt} onClick={() => send(prompt)} className="rounded-xl border border-ink/10 px-3 py-2.5 text-left text-xs font-semibold transition hover:bg-lime/20 dark:border-white/10">
                    <Sparkles size={13} className="mr-1.5 inline" />{prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === "user" ? "bg-ink text-white dark:bg-lime dark:text-ink" : "bg-ink/[0.06] dark:bg-white/10"}`}>
                {message.content}
              </p>
            </div>
          ))}
          {busy && <p className="flex items-center gap-2 text-xs text-ink/55 dark:text-white/55"><LoaderCircle size={14} className="animate-spin" />Gia sư đang trả lời…</p>}
        </div>

        {!ready && (
          <div className="mx-4 mb-2 flex items-center gap-2 rounded-xl border border-warn/40 bg-warn/10 px-3 py-2 text-xs">
            <Settings2 size={14} />
            <span className="flex-1">Chưa có API key nên gia sư chưa hoạt động.</span>
            {onOpenSettings && <button onClick={onOpenSettings} className="font-bold underline">Mở cài đặt</button>}
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 border-t border-ink/[0.08] p-3 dark:border-white/[0.08]"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Nhập câu hỏi của bạn… (Enter để gửi)"
            className="field max-h-32 min-h-[44px] resize-none py-2.5 text-sm"
            aria-label="Câu hỏi cho gia sư AI"
          />
          <button disabled={busy || !input.trim()} className="btn-primary h-11 shrink-0 px-4" aria-label="Gửi câu hỏi"><Send size={16} /></button>
        </form>
      </section>
    </div>
  );
}
