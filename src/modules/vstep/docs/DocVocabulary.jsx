import { useMemo, useState } from "react";
import { BookOpen, LoaderCircle, Search, Sparkles, Volume2 } from "lucide-react";
import { vocabularyItems, vocabularyTopics } from "../../../data/vstep/vocabulary/topics";
import { createDeckFromVocabularyTopic } from "../../../services/vstepDeck";
import { speakText } from "../../../utils/speech";
import { toast } from "../../../services/toast";

const LEVELS = ["all", "B1", "B2", "C1"];

/** Từ vựng VSTEP theo chủ đề + nút tạo bộ flashcard để học bằng SRS. */
export default function DocVocabulary() {
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(vocabularyTopics[0]?.id || null);
  const [busy, setBusy] = useState("");

  const topics = useMemo(() => (level === "all" ? vocabularyTopics : vocabularyTopics.filter((topic) => topic.level === level)), [level]);
  const term = query.trim().toLowerCase();
  const results = useMemo(
    () => (term ? vocabularyItems.filter((item) => `${item.word} ${item.vi}`.toLowerCase().includes(term)).slice(0, 40) : []),
    [term],
  );

  const addDeck = async (topic) => {
    setBusy(topic.id);
    try {
      const { count } = await createDeckFromVocabularyTopic(topic.id);
      toast.success(`Đã tạo bộ “VSTEP · ${topic.title}” với ${count} từ. Mở tab Từ vựng để học.`);
    } catch (error) {
      toast.error(error.message || "Không thể tạo bộ thẻ.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <p className="eyebrow flex items-center gap-2"><BookOpen size={14} />Từ vựng theo chủ đề</p>
        <p className="mt-2 text-sm leading-6 text-ink/70 dark:text-white/70">
          {vocabularyItems.length} từ ở {vocabularyTopics.length} chủ đề. Tạo bộ flashcard để học bằng lặp lại ngắt quãng (SRS) ngay trong tab Từ vựng.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {LEVELS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLevel(item)}
              aria-pressed={level === item}
              className={`min-h-[40px] rounded-xl px-3.5 text-xs font-bold transition ${level === item ? "bg-lime text-ink" : "border border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70"}`}
            >
              {item === "all" ? "Tất cả" : item === "B1" ? "B1" : item === "B2" ? "B2" : "C1"}
            </button>
          ))}
          <label className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/50 dark:text-white/50" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm từ hoặc nghĩa…" className="field py-2.5 pl-9 text-sm" />
          </label>
        </div>
      </section>

      {term ? (
        <section className="panel p-5">
          <p className="eyebrow">Kết quả cho “{query}”</p>
          {results.length ? (
            <ul className="mt-3 divide-y divide-ink/[0.07] dark:divide-white/[0.07]">
              {results.map((item) => (
                <li key={item.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5">
                  <button type="button" onClick={() => speakText(item.word)} className="inline-flex items-center gap-1.5 font-bold">
                    <Volume2 size={14} className="text-sage" />{item.word}
                  </button>
                  <span className="text-xs text-sage">{item.ipa}</span>
                  <span className="text-sm">{item.vi}</span>
                  <span className="chip bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60">{item.topic}</span>
                  <span className="w-full text-xs leading-5 text-ink/60 dark:text-white/60">{item.example}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink/60 dark:text-white/60">Không tìm thấy từ phù hợp.</p>
          )}
        </section>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {topics.map((topic) => {
            const words = vocabularyItems.filter((item) => item.topicId === topic.id);
            const open = openId === topic.id;
            return (
              <section key={topic.id} className="panel p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button type="button" onClick={() => setOpenId(open ? null : topic.id)} className="min-w-0 flex-1 text-left">
                    <p className="font-display font-bold">{topic.title}</p>
                    <p className="mt-0.5 text-xs text-ink/60 dark:text-white/60">{words.length} từ · mức {topic.level}</p>
                  </button>
                  <button type="button" onClick={() => addDeck(topic)} disabled={busy === topic.id} className="btn-secondary px-3 text-xs">
                    {busy === topic.id ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}Tạo bộ thẻ
                  </button>
                </div>
                {open && (
                  <ul className="mt-3 space-y-2 border-t border-ink/[0.08] pt-3 dark:border-white/[0.08]">
                    {words.map((item) => (
                      <li key={item.id} className="text-sm">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <button type="button" onClick={() => speakText(item.word)} className="inline-flex items-center gap-1 font-bold">
                            <Volume2 size={13} className="text-sage" />{item.word}
                          </button>
                          <span className="text-xs text-sage">{item.ipa}</span>
                          <span>— {item.vi}</span>
                        </div>
                        <p className="mt-0.5 text-xs leading-5 text-ink/60 dark:text-white/60">{item.example}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
