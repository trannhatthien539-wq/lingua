import { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, LoaderCircle, Send, Settings2, Sparkles, Trash2, X } from "lucide-react";
import { canUseAi, requestAi } from "../services/aiService";
import { toast } from "../services/toast";
import Dialog from "./ui/Dialog";

const PROVIDER_STORAGE = "lingua-ai-provider";
const MAX_MESSAGES = 40;

const SCENARIOS = [
  { id: "free", label: "💬 Hỏi đáp tự do", desc: "Hỏi ngữ pháp, tra từ, sửa câu" },
  { id: "interview", label: "💼 Phỏng vấn xin việc", desc: "Đóng vai nhà tuyển dụng" },
  { id: "travel", label: "✈️ Du lịch & Sân bay", desc: "Check-in, khách sạn, hỏi đường" },
  { id: "restaurant", label: "🍽️ Nhà hàng & Gọi món", desc: "Đặt bàn và gọi món" },
  { id: "daily", label: "☕ Giao tiếp hằng ngày", desc: "Trò chuyện tự nhiên như bạn bè" },
];

const LEVELS = [
  { id: "A2", label: "A2 · Sơ cấp" },
  { id: "B1", label: "B1 · Trung cấp" },
  { id: "B2", label: "B2 · Nâng cao" },
];

const QUICK_PROMPTS = [
  "Giải thích ngắn gọn sự khác nhau giữa thì hiện tại hoàn thành và quá khứ đơn, kèm 3 ví dụ B1.",
  "Sửa lỗi trong câu sau và giải thích: I have went to Ha Noi last year.",
  "Viết một đoạn 80 từ về sở thích của tôi ở trình độ B1, kèm 5 cụm từ hữu ích.",
  "Tạo 5 câu hỏi Speaking Part 1 về chủ đề công việc kèm câu trả lời mẫu ngắn.",
];

const QUICK_CHIPS = [
  { label: "🔍 Sửa lỗi câu", text: "Hãy sửa lỗi và phân tích câu sau: " },
  { label: "✍️ Đặt 3 ví dụ", text: "Hãy đặt 3 câu ví dụ thực tế chuẩn B1-B2 với cụm từ: " },
  { label: "⚖️ Phân biệt ngữ pháp", text: "Giải thích ngắn gọn điểm khác biệt giữa 2 cấu trúc: " },
  { label: "🌐 Dịch tự nhiên", text: "Dịch câu này sang tiếng Anh tự nhiên như người bản xứ: " },
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
 * Prompt gửi AI: chỉ dẫn hệ thống theo tình huống + trình độ + 6 tin nhắn gần nhất + câu hỏi mới.
 */
const buildPrompt = (messages, question, scenario = "free", level = "B1") => {
  const scenarioInstructions = {
    free: "Bạn là gia sư tiếng Anh kiên nhẫn cho người Việt. Trả lời bằng tiếng Việt, ngắn gọn (tối đa 200 từ), ví dụ tiếng Anh kèm nghĩa tiếng Việt. Nếu học viên viết sai, hãy chỉ rõ lỗi và đưa câu đúng.",
    interview: "Bạn là người phỏng vấn tuyển dụng bằng tiếng Anh. Đóng vai chuyên nghiệp, hỏi từng câu một, nhận xét ngắn câu trả lời của ứng viên kèm sửa lỗi ngữ pháp/từ vựng (nếu có, bằng tiếng Việt ngắn gọn).",
    travel: "Bạn là nhân viên lễ tân sân bay/khách sạn quốc tế. Đóng vai bằng tiếng Anh giao tiếp với du khách, hỗ trợ chu đáo và sửa cách diễn đạt chưa tự nhiên nếu cần.",
    restaurant: "Bạn là bồi bàn trong nhà hàng Âu Mỹ. Đóng vai bằng tiếng Anh chào khách, tư vấn thực đơn, order món và phản hồi thân thiện.",
    daily: "Bạn là người bạn bản xứ đang trò chuyện thân mật bằng tiếng Anh. Chia sẻ tự nhiên, dùng collocations chuẩn và chỉ ra cách nói tự nhiên hơn.",
  };

  const instruction = scenarioInstructions[scenario] || scenarioInstructions.free;
  const levelRule = `Trình độ mục tiêu của học viên là ${level}. Hãy điều chỉnh độ khó từ vựng và câu trả lời tương ứng.`;

  return [
    instruction,
    levelRule,
    "Không dùng markdown quá phức tạp, dùng gạch đầu dòng rõ ràng.",
  ].join(" ") +
  `\n\nLịch sử gần đây:\n${messages
    .slice(-6)
    .map((message) => `${message.role === "user" ? "Học viên" : "Gia sư"}: ${message.content}`)
    .join("\n")}\n\nCâu nói/câu hỏi mới nhất: ${question}`;
};

/** Gia sư AI: hội thoại hỏi đáp theo ngữ cảnh thực tế & trình độ. */
export default function AiTutorPanel({ apiKey, user, onClose, onOpenSettings }) {
  const [messages, setMessages] = useState(() => readConversation(user));
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [scenario, setScenario] = useState("free");
  const [level, setLevel] = useState("B1");
  const [showConfig, setShowConfig] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
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
        buildPrompt(messages, question, scenario, level),
      );
      setMessages((current) => [...current, { role: "assistant", content: answer }].slice(-MAX_MESSAGES));
    } catch (error) {
      toast.error(error.message || "Không thể kết nối gia sư AI.");
      // Giữ tin nhắn của người học và thêm thông báo lỗi trong chat để không làm mất ngữ cảnh
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `⚠️ Không thể gửi yêu cầu: ${error.message || "Lỗi máy chủ AI"}. Vui lòng thử lại.`,
          isError: true,
        },
      ]);
      // Phục hồi lại câu hỏi vào ô nhập để người dùng có thể gửi lại dễ dàng
      setInput(question);
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

  const currentScenario = SCENARIOS.find((item) => item.id === scenario) || SCENARIOS[0];

  return (
    <Dialog onClose={onClose} ariaLabel="Gia sư AI" overlayClassName="fixed inset-0 z-[95] flex items-end justify-end bg-ink/30 p-0 backdrop-blur-sm sm:p-5 dark:bg-black/50" className="panel flex h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-b-none sm:h-[min(640px,88vh)] sm:rounded-2xl">
      <header className="flex items-center justify-between gap-3 border-b border-ink/[0.08] px-4 py-3 dark:border-white/[0.08]">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Bot size={19} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-display font-bold">Gia sư AI</p>
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="chip border border-indigo-500/25 bg-indigo-500/10 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20"
              >
                {currentScenario.label} · {level} <ChevronDown size={11} className="inline" />
              </button>
            </div>
            <p className="truncate text-xs text-ink/55 dark:text-white/55">{currentScenario.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={clearConversation} disabled={!messages.length} className="icon-btn" aria-label="Xoá hội thoại" title="Xoá hội thoại"><Trash2 size={17} /></button>
          <button onClick={onClose} className="icon-btn" aria-label="Đóng gia sư"><X size={18} /></button>
        </div>
      </header>

      {/* Bộ chọn Tình huống & Trình độ */}
      {showConfig && (
        <div className="border-b border-indigo-500/15 bg-indigo-500/[0.05] p-3 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200">Chọn tình huống luyện tập:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setScenario(item.id);
                  setShowConfig(false);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  scenario === item.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "border border-slate-200 bg-white/80 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Trình độ:</span>
            {LEVELS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLevel(item.id)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  level === item.id
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto p-4 sm:p-5">
        {!messages.length && (
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={16} />
              <p className="font-display text-sm font-bold">Gia sư AI đồng hành cùng bạn</p>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {currentScenario.desc}. Bạn có thể hỏi ngữ pháp, bắt đầu một đoạn hội thoại hoặc xin ví dụ.
            </p>
            <div className="mt-3.5 flex flex-col gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="rounded-xl border border-slate-200/80 bg-white/60 p-3 text-left text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-400/50 hover:bg-white hover:text-indigo-600 active:scale-[0.99] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
                >
                  <Sparkles size={13} className="mr-1.5 inline text-emerald-500" />{prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-xs leading-6 sm:text-sm shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_4px_16px_rgba(16,185,129,0.25)] rounded-tr-sm"
                  : message.isError
                    ? "border border-rose-300/60 bg-rose-50/80 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 rounded-tl-sm"
                    : "border border-slate-200/80 bg-white/80 text-slate-800 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 rounded-tl-sm"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-500 dark:text-slate-400 backdrop-blur-md">
            <LoaderCircle size={14} className="animate-spin text-emerald-500" />Gia sư đang suy nghĩ…
          </div>
        )}
      </div>

      {!ready && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-xl border border-warn/40 bg-warn/10 px-3 py-2 text-xs">
          <Settings2 size={14} />
          <span className="flex-1">Chưa có API key nên gia sư chưa hoạt động.</span>
          {onOpenSettings && <button onClick={onOpenSettings} className="font-bold underline">Mở cài đặt</button>}
        </div>
      )}

      <div className="flex items-center gap-1.5 overflow-x-auto px-3.5 py-2 scrollbar-none border-t border-ink/[0.06] bg-slate-50/50 dark:bg-white/[0.02] dark:border-white/[0.06]">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Gợi ý:</span>
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            disabled={busy}
            onClick={() => {
              setInput(chip.text);
              inputRef.current?.focus();
            }}
            className="chip shrink-0 cursor-pointer border border-slate-200/80 bg-white/80 text-[11px] font-semibold text-slate-700 shadow-2xs backdrop-blur-xs transition hover:border-indigo-400 hover:bg-white hover:text-indigo-600 active:scale-95 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 p-3"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Nhập câu hỏi hoặc câu thoại của bạn… (Enter để gửi)"
          className="field max-h-32 min-h-[44px] resize-none py-2.5 text-sm"
          aria-label="Câu hỏi cho gia sư AI"
        />
        <button disabled={busy || !input.trim()} className="btn-primary h-11 shrink-0 px-4" aria-label="Gửi câu hỏi"><Send size={16} /></button>
      </form>
    </Dialog>
  );
}
