import { BookOpen, Brain, Headphones, Keyboard, X } from "lucide-react";

const modes = [
  { id: "flashcard", icon: BookOpen, title: "Flashcard SRS", text: "Lật thẻ và lên lịch ôn tập 1, 3 hoặc 7 ngày." },
  { id: "quiz", icon: Brain, title: "Trắc nghiệm", text: "Chọn nghĩa đúng để luyện phản xạ nhận diện từ." },
  { id: "speller", icon: Headphones, title: "Spelling & Dictation", text: "Nghe phát âm và gõ lại từ thật chính xác." },
  { id: "matching", icon: Keyboard, title: "Speed Matching", text: "Nối từ với nghĩa trong thời gian ngắn nhất." },
];

export default function StudyHubModal({ deck, cards, onSelect, onClose }) {
  const progress = cards.length ? Math.round((cards.filter((card) => card.status === "mastered").length / cards.length) * 100) : 0;
  return <div className="fixed inset-0 z-[85] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"><section className="panel w-full max-w-2xl p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">Study hub · {deck.title}</p><h2 className="mt-1 font-display text-2xl font-bold">Chọn chế độ luyện tập</h2><p className="mt-2 text-sm text-ink/50 dark:text-white/50">{cards.length} thẻ · {progress}% đã thuộc</p></div><button onClick={onClose} aria-label="Đóng"><X size={18} /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{modes.map(({ id, icon: Icon, title, text }) => <button key={id} onClick={() => onSelect(id)} className="group rounded-2xl border border-ink/10 p-4 text-left transition hover:-translate-y-0.5 hover:border-sage hover:shadow-lg dark:border-white/10"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-lime text-ink"><Icon size={19} /></div><div className="min-w-0 flex-1"><p className="font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-ink/50 dark:text-white/50">{text}</p></div></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10"><div className="h-full rounded-full bg-sage" style={{ width: `${progress}%` }} /></div></button>)}</div></section></div>;
}
