import { useEffect, useMemo, useState } from "react";
import { Check, Headphones, Volume2, X } from "lucide-react";
import StudySummary from "./StudySummary";
import { getPlayableAudio, sanitizeCard } from "../../utils/sanitizeCard";

const mismatch = (actual, expected) => { const first = Math.max([...expected].findIndex((letter, index) => actual[index]?.toLowerCase() !== letter.toLowerCase()), 0); return `${actual.slice(0, first)}${actual[first] || "_"} → ${expected[first] || ""}`; };

export default function SpellerView({ deck, cards, onClose, onChangeMode, onUpdateCard, onStudyActivity }) {
  const safeCards = useMemo(() => cards.map(sanitizeCard), [cards]);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [results, setResults] = useState([]);
  const [startedAt] = useState(Date.now());
  const card = safeCards[index];
  const complete = index >= safeCards.length;

  useEffect(() => { if (card) getPlayableAudio(card)(); }, [card]);
  const submit = async (event) => {
    event.preventDefault();
    if (!card) return;
    const correct = value.trim().toLowerCase() === card.word.toLowerCase();
    if (!correct) { setFeedback(`Chưa đúng: ${mismatch(value.trim(), card.word)}. Hãy gõ lại.`); return; }
    setFeedback(""); setResults((current) => [...current, { word: card.word, correct: true }]);
    await onUpdateCard(card.id, { status: "mastered", reviewDate: new Date(Date.now() + 7 * 86400000).toISOString() });
    if (index + 1 >= safeCards.length) await onStudyActivity?.();
    setIndex((current) => current + 1); setValue("");
  };
  if (complete) return <StudySummary title={`Speller · ${deck.title}`} score={results.length} total={safeCards.length} duration={`${Math.round((Date.now() - startedAt) / 1000)}s`} onReplay={() => { setIndex(0); setResults([]); }} onChangeMode={onChangeMode} onClose={onClose} />;
  return <div className="fixed inset-0 z-[90] overflow-y-auto bg-[#f5f7f3] p-5 text-ink dark:bg-[#121715] dark:text-white sm:p-10"><div className="mx-auto max-w-2xl"><header className="flex items-center justify-between"><div><p className="eyebrow">Spelling & Dictation · {deck.title}</p><p className="mt-1 text-sm font-bold">Từ {index + 1}/{safeCards.length}</p></div><button onClick={onClose} aria-label="Đóng"><X size={19} /></button></header><div className="mt-4 h-2 rounded-full bg-ink/10 dark:bg-white/10"><div className="h-full rounded-full bg-sage transition-all" style={{ width: `${(index / safeCards.length) * 100}%` }} /></div><section className="panel mt-10 p-8 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lime text-ink"><Headphones size={24} /></div><p className="eyebrow mt-5">Nghe và gõ lại</p><button onClick={getPlayableAudio(card)} className="mt-5 flex mx-auto items-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-ink"><Volume2 size={17} />Phát lại âm thanh</button><p className="mt-7 text-lg font-bold">{card.meaning}</p><p className="mt-2 text-sm text-sage">{card.ipa || "IPA chưa có"}</p><form onSubmit={submit} className="mx-auto mt-8 flex max-w-md gap-2"><input autoFocus value={value} onChange={(event) => setValue(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-transparent px-4 py-3 text-sm outline-none dark:border-white/10" placeholder="Gõ từ tiếng Anh..." /><button className="rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink">Kiểm tra</button></form>{feedback && <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-red-600 dark:text-red-300"><X size={16} />{feedback}</p>}{!feedback && value && <p className="mt-4 text-xs text-ink/40 dark:text-white/40"><Check size={13} className="mr-1 inline" />Nhấn Enter để kiểm tra</p>}</section></div></div>;
}
