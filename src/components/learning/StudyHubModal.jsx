import { BookOpen, Brain, Headphones, Keyboard, Sparkles, X } from "lucide-react";

const modes = [
  { id: "flashcard", icon: BookOpen, title: "Flashcard SRS", text: "Lật thẻ và lên lịch ôn tập 1, 3 hoặc 7 ngày." },
  { id: "quiz", icon: Brain, title: "Trắc nghiệm", text: "Chọn nghĩa đúng để luyện phản xạ nhận diện từ." },
  { id: "speller", icon: Headphones, title: "Spelling & Dictation", text: "Nghe phát âm và gõ lại từ thật chính xác." },
  { id: "matching", icon: Keyboard, title: "Speed Matching", text: "Nối từ với nghĩa trong thời gian ngắn nhất." },
];

export default function StudyHubModal({ deck, cards, onSelect, onClose }) {
  const progress = cards.length ? Math.round((cards.filter((card) => card.status === "mastered").length / cards.length) * 100) : 0;
  const [primary, ...secondary] = modes;
  return <div className="fixed inset-0 z-[85] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"><section className="panel w-full max-w-xl p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">Bắt đầu học · {deck.title}</p><h2 className="mt-1 font-display text-2xl font-bold">Bạn muốn học thế nào?</h2><p className="mt-2 text-sm text-ink/50 dark:text-white/50">{cards.length} thẻ · {progress}% đã thuộc</p></div><button onClick={onClose} aria-label="Đóng"><X size={18} /></button></div><button onClick={() => onSelect(primary.id)} className="mt-6 flex w-full items-center gap-4 rounded-2xl bg-ink p-5 text-left text-white transition hover:-translate-y-0.5 dark:bg-lime dark:text-ink"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lime text-ink dark:bg-ink dark:text-lime"><Sparkles size={21} /></div><div className="min-w-0 flex-1"><p className="text-lg font-bold">{primary.title}</p><p className="mt-1 text-sm text-white/65 dark:text-ink/65">{primary.text}</p></div><span className="text-sm font-bold">Bắt đầu</span></button><div className="mt-5 border-t border-ink/10 pt-4 dark:border-white/10"><p className="text-xs font-bold text-ink/45 dark:text-white/45">Hoặc chọn cách luyện khác</p><div className="mt-3 divide-y divide-ink/10 dark:divide-white/10">{secondary.map(({ id, icon: Icon, title, text }) => <button key={id} onClick={() => onSelect(id)} className="flex w-full items-center gap-3 py-3 text-left transition hover:text-sage"><Icon size={18} className="shrink-0 text-sage" /><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{title}</span><span className="block truncate text-xs text-ink/50 dark:text-white/50">{text}</span></span></button>)}</div></div></section></div>;
}
