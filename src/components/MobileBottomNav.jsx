import { BookOpen, CalendarDays, GitBranch, GraduationCap, Headphones, PenLine, Settings2, Trophy } from 'lucide-react';
import { navigationItems } from '../data/navigation';

const iconById = {
  vocabulary: BookOpen,
  grammar: GraduationCap,
  skills: Headphones,
  writing: PenLine,
  progress: Trophy,
  planner: CalendarDays,
  mindmap: GitBranch,
  settings: Settings2,
};

export default function MobileBottomNav({ activeTab, onTabChange }) {
  const items = navigationItems.filter((item) => iconById[item.id]);

  const selectTab = (id) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10);
    onTabChange(id);
  };

  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-50 flex items-center gap-0.5 overflow-x-auto border-t border-ink/10 bg-slab/95 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-md dark:border-white/10 dark:bg-dark1/95 md:hidden" aria-label="Điều hướng mobile">
      {items.map(({ id, label, shortLabel }) => {
        const Icon = iconById[id];
        const active = activeTab === id;
        return <button key={id} onClick={() => selectTab(id)} className={`flex min-w-[62px] flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1 text-xs font-bold transition ${active ? 'text-ink dark:text-lime' : 'text-ink/60 dark:text-white/60'}`} aria-current={active ? 'page' : undefined}>
          <span className={`grid h-9 w-11 place-items-center rounded-xl transition ${active ? 'bg-lime text-ink' : ''}`}><Icon size={19} strokeWidth={active ? 2.4 : 1.8} /></span>
          <span className="max-w-full truncate">{shortLabel || label}</span>
        </button>;
      })}
    </nav>
  );
}
