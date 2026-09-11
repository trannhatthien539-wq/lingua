import { BookOpen, CheckSquare, GitBranch, Settings, Timer } from 'lucide-react';
import { navigationItems } from '../data/navigation';

const iconById = {
  vocabulary: BookOpen,
  grammar: CheckSquare,
  planner: Timer,
  mindmap: GitBranch,
  settings: Settings,
};

export default function MobileBottomNav({ activeTab, onTabChange }) {
  const items = navigationItems.filter((item) => iconById[item.id]);

  const selectTab = (id) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10);
    onTabChange(id);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-zinc-200 bg-white/90 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md dark:border-white/10 dark:bg-[#151a18]/90 md:hidden" aria-label="Điều hướng mobile">
      {items.map(({ id, label }) => {
        const Icon = iconById[id];
        const active = activeTab === id;
        return <button key={id} onClick={() => selectTab(id)} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1 text-[10px] font-bold transition ${active ? 'text-ink dark:text-lime' : 'text-ink/45 dark:text-white/45'}`} aria-current={active ? 'page' : undefined}>
          <span className={`grid h-8 w-10 place-items-center rounded-xl ${active ? 'bg-lime text-ink' : ''}`}><Icon size={18} strokeWidth={active ? 2.4 : 1.8} /></span>
          <span className="max-w-full truncate">{label}</span>
        </button>;
      })}
    </nav>
  );
}
