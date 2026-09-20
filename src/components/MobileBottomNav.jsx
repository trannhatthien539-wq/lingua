import { useState } from 'react';
import { BookOpen, CalendarDays, GitBranch, GraduationCap, Headphones, LayoutGrid, PenLine, Settings2, Trophy, X } from 'lucide-react';
import { navigationItems } from '../data/navigation';

const iconById = {
  vocabulary: BookOpen,
  grammar: GraduationCap,
  skills: Headphones,
  vstep: GraduationCap,
  writing: PenLine,
  progress: Trophy,
  planner: CalendarDays,
  mindmap: GitBranch,
  settings: Settings2,
};

/** 5 tab chính luôn hiện dưới đáy; các tab còn lại nằm trong nút “Thêm”. */
const PRIMARY_TABS = ['vocabulary', 'grammar', 'skills', 'vstep', 'progress'];

/**
 * Thanh điều hướng dưới cho điện thoại.
 * Trước đây hiện cả 9 tab nên 3 tab cuối (Todo, Sơ đồ, Cài đặt) bị khuất, phải vuốt ngang mới thấy.
 * Nay chỉ hiện 5 tab chính + nút “Thêm” mở bảng trượt lên — mọi mục đều bấm được, không cần vuốt.
 */
export default function MobileBottomNav({ activeTab, onTabChange }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const items = navigationItems.filter((item) => iconById[item.id]);
  const primary = PRIMARY_TABS.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  const extra = items.filter((item) => !PRIMARY_TABS.includes(item.id));
  const extraActive = extra.some((item) => item.id === activeTab);

  const selectTab = (id) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10);
    setMoreOpen(false);
    onTabChange(id);
  };

  const tabClass = (active) => `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1 text-[11px] font-bold transition ${active ? 'text-ink dark:text-lime' : 'text-ink/60 dark:text-white/60'}`;
  const iconClass = (active) => `grid h-9 w-11 place-items-center rounded-xl transition ${active ? 'bg-lime text-ink' : ''}`;

  return (
    <>
      {moreOpen && (
        <div className="no-print fixed inset-0 z-[60] md:hidden">
          <button type="button" onClick={() => setMoreOpen(false)} className="absolute inset-0 h-full w-full bg-ink/40 backdrop-blur-[2px]" aria-label="Đóng bảng chọn mục" />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-ink/10 bg-slab p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-soft dark:border-white/10 dark:bg-dark2">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Mục khác</p>
              <button type="button" onClick={() => setMoreOpen(false)} className="icon-btn h-9 w-9" aria-label="Đóng">
                <X size={16} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {extra.map(({ id, label, description, shortLabel }) => {
                const Icon = iconById[id];
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectTab(id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[64px] items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition ${active ? 'border-lime bg-lime/15' : 'border-ink/[0.08] hover:bg-ink/[0.04] dark:border-white/[0.08] dark:hover:bg-white/[0.06]'}`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? 'bg-lime text-ink' : 'bg-ink/[0.05] text-ink/70 dark:bg-white/10 dark:text-white/70'}`}>
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">{shortLabel || label}</span>
                      <span className="block truncate text-xs text-ink/60 dark:text-white/55">{description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-50 flex items-center gap-0.5 border-t border-ink/10 bg-slab/95 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-md dark:border-white/10 dark:bg-dark1/95 md:hidden"
        aria-label="Điều hướng mobile"
      >
        {primary.map(({ id, label, shortLabel }) => {
          const Icon = iconById[id];
          const active = activeTab === id;
          return (
            <button key={id} type="button" onClick={() => selectTab(id)} className={tabClass(active)} aria-current={active ? 'page' : undefined}>
              <span className={iconClass(active)}><Icon size={19} strokeWidth={active ? 2.4 : 1.8} /></span>
              <span className="max-w-full truncate">{shortLabel || label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((value) => !value)}
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          className={tabClass(extraActive)}
        >
          <span className={iconClass(extraActive)}><LayoutGrid size={19} strokeWidth={extraActive ? 2.4 : 1.8} /></span>
          <span className="max-w-full truncate">Thêm</span>
        </button>
      </nav>
    </>
  );
}

