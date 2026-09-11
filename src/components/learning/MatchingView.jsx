import { useEffect, useMemo, useState } from "react";
import { Check, Clock3, X } from "lucide-react";
import StudySummary from "./StudySummary";
import { sanitizeCard } from "../../utils/sanitizeCard";

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export default function MatchingView({ deck, cards, onClose, onChangeMode, onUpdateCard, onStudyActivity }) {
  const [round, setRound] = useState(0);
  const selectedCards = useMemo(() => shuffle(cards.map(sanitizeCard)).slice(0, 6), [cards, round]);
  const tiles = useMemo(() => shuffle([...selectedCards.map((card) => ({ id: `${card.id}-word`, pairId: card.id, label: card.word, type: "word" })), ...selectedCards.map((card) => ({ id: `${card.id}-meaning`, pairId: card.id, label: card.meaning, type: "meaning" }))]), [selectedCards]);
  const [first, setFirst] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const complete = matched.length === selectedCards.length && selectedCards.length > 0;

  useEffect(() => { const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000); return () => window.clearInterval(timer); }, [startedAt]);
  const choose = (tile) => {
    if (matched.includes(tile.pairId) || wrong.length || first?.id === tile.id) return;
    if (!first) return setFirst(tile);
    if (first.pairId === tile.pairId && first.type !== tile.type) {
      setMatched((current) => [...current, tile.pairId]); setFirst(null);
      const card = selectedCards.find((item) => item.id === tile.pairId);
      if (card) onUpdateCard(card.id, { status: "mastered", reviewDate: new Date(Date.now() + 7 * 86400000).toISOString() }).catch(() => {});
      if (matched.length + 1 === selectedCards.length) onStudyActivity?.();
    } else {
      setWrong([first.id, tile.id]); window.setTimeout(() => { setWrong([]); setFirst(null); }, 650);
    }
  };
  if (complete) return <StudySummary title={`Matching · ${deck.title}`} score={matched.length} total={selectedCards.length} duration={`${elapsed}s`} onReplay={() => { setRound((value) => value + 1); setFirst(null); setMatched([]); setWrong([]); setStartedAt(Date.now()); setElapsed(0); }} onChangeMode={onChangeMode} onClose={onClose} />;
  return <div className="fixed inset-0 z-[90] overflow-y-auto bg-[#f5f7f3] p-5 text-ink dark:bg-[#121715] dark:text-white sm:p-10"><div className="mx-auto max-w-3xl"><header className="flex items-center justify-between"><div><p className="eyebrow">Speed Matching · {deck.title}</p><p className="mt-1 text-sm font-bold">Ghép đúng {matched.length}/{selectedCards.length}</p></div><div className="flex items-center gap-3"><span className="flex items-center gap-1 text-sm font-bold text-sage"><Clock3 size={16} />{elapsed}s</span><button onClick={onClose} aria-label="Đóng"><X size={19} /></button></div></header><div className="mt-4 h-2 rounded-full bg-ink/10 dark:bg-white/10"><div className="h-full rounded-full bg-sage transition-all" style={{ width: `${selectedCards.length ? (matched.length / selectedCards.length) * 100 : 0}%` }} /></div><section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">{tiles.map((tile) => <button key={tile.id} disabled={matched.includes(tile.pairId)} onClick={() => choose(tile)} className={`min-h-24 rounded-2xl border-2 p-4 text-sm font-bold transition ${matched.includes(tile.pairId) ? "border-emerald-400 bg-emerald-100 text-emerald-700 opacity-40" : wrong.includes(tile.id) ? "animate-[quiz-shake_360ms_ease-in-out] border-red-400 bg-red-50 text-red-700" : first?.id === tile.id ? "border-sage bg-lime text-ink" : "border-ink/10 bg-white hover:border-sage dark:border-white/10 dark:bg-[#202724]"}`}><span className="block text-[10px] uppercase tracking-wider opacity-45">{tile.type === "word" ? "Từ" : "Nghĩa"}</span>{tile.label}</button>)}</section><p className="mt-6 text-center text-xs text-ink/40 dark:text-white/40">Chọn một từ tiếng Anh, sau đó chọn nghĩa tương ứng.</p></div></div>;
}
