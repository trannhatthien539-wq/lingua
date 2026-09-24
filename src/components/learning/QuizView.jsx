import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, X } from "lucide-react";
import StudySummary from "./StudySummary";
import { getPlayableAudio, sanitizeCard } from "../../utils/sanitizeCard";
import { addDaysKey, dateKey } from "../../utils/srs";

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const uniqueMeanings = (items) => items.filter((item, index, all) => all.findIndex((candidate) => candidate.trim().toLowerCase() === item.trim().toLowerCase()) === index);

export default function QuizView({ deck, cards, onClose, onChangeMode, onUpdateCard, onStudyActivity }) {
  const safeCards = useMemo(() => cards.map(sanitizeCard), [cards]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [startedAt] = useState(Date.now());
  const advanceTimerRef = useRef(null);
  const card = safeCards[index];
  const options = useMemo(() => {
    if (!card) return [];
    const distractors = uniqueMeanings(safeCards.filter((item) => item.id !== card.id).map((item) => item.meaning)).slice(0, 3);
    return shuffle(uniqueMeanings([card.meaning, ...distractors]));
  }, [card, safeCards]);
  const complete = index >= safeCards.length;
  // Dọn timer chuyển câu khi đóng bài để không set state sau khi unmount.
  useEffect(() => () => window.clearTimeout(advanceTimerRef.current), []);

  const choose = (option) => {
    if (selected || !card) return;
    const correct = option === card.meaning;
    setSelected(option);
    setResults((current) => [...current, { word: card.word, correct }]);
    const interval = correct ? 5 : 1;
    onUpdateCard(card.id, { status: correct ? "mastered" : "learning", interval, nextReviewDate: addDaysKey(interval), lastStudiedDate: dateKey(), repetition: correct ? Number(card.repetition || 0) + 1 : 0 }).catch(() => {});
    // Ghi nhận hoạt động học ngay khi trả lời câu cuối thay vì đặt trong setTimeout,
    // để đóng bài trong 800ms đầu cũng không mất tiến độ; timer chỉ hoãn chuyển câu.
    if (index + 1 >= safeCards.length) Promise.resolve(onStudyActivity?.()).catch(() => {});
    window.clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = window.setTimeout(() => {
      setIndex((current) => current + 1);
      setSelected(null);
    }, 800);
  };

  if (complete) {
    const correct = results.filter((result) => result.correct).length;
    return <StudySummary title={`Quiz · ${deck.title}`} score={correct} total={safeCards.length} duration={`${Math.round((Date.now() - startedAt) / 1000)}s`} mistakes={results.filter((result) => !result.correct).map((result) => result.word)} onReplay={() => { setIndex(0); setResults([]); }} onChangeMode={onChangeMode} onClose={onClose} />;
  }

  return <div className="fixed inset-0 z-[90] overflow-y-auto bg-mist p-5 text-ink dark:bg-dark1 dark:text-white sm:p-10"><div className="mx-auto max-w-3xl"><header className="flex items-center justify-between"><div><p className="eyebrow">Trắc nghiệm · {deck.title}</p><p className="mt-1 text-sm font-bold">Câu {index + 1}/{safeCards.length}</p></div><button onClick={onClose} className="icon-btn" aria-label="Đóng"><X size={19} /></button></header><div className="mt-4 h-2 rounded-full bg-ink/10 dark:bg-white/10"><div className="h-full rounded-full bg-sage transition-all" style={{ width: `${(index / safeCards.length) * 100}%` }} /></div><section className="panel mt-10 p-8 text-center"><p className="eyebrow">Chọn nghĩa đúng</p><div className="mt-5 flex items-center justify-center gap-3"><h2 className="font-display text-4xl font-bold">{card.word}</h2><button onClick={getPlayableAudio(card)} className="grid h-10 w-10 place-items-center rounded-xl bg-lime text-ink" aria-label="Phát âm"><Volume2 size={17} /></button></div><p className="mt-3 text-sm text-sage">{card.ipa || "IPA chưa có"}</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{options.map((option, optionIndex) => { const isCorrect = option === card.meaning; const isSelected = selected === option; return <button key={`${option}-${optionIndex}`} disabled={Boolean(selected)} onClick={() => choose(option)} className={`rounded-xl border-2 p-4 text-left text-sm font-bold transition ${!selected ? "border-ink/10 hover:border-sage dark:border-white/10" : isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200" : isSelected ? "animate-[quiz-shake_360ms_ease-in-out] border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-200" : "border-ink/10 opacity-50 dark:border-white/10"}`}><span className="mr-2 text-ink/35 dark:text-white/35">{optionIndex + 1}</span>{option}</button>; })}</div></section></div></div>;
}
