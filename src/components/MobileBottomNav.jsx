import { useState } from 'react';
import { LayoutGrid, X } from 'lucide-react';
import NavIcon from './ui/NavIcon';
import { navigationItems } from '../data/navigation';

/** 5 tab chính luôn hiện dưới đáy; các tab còn lại nằm trong nút “Thêm”. */
const PRIMARY_TABS = ['home', 'vocabulary', 'grammar', 'skills', 'vstep'];
const MORE_COLOR = '#a08bd6';

/**
 * Thanh điều hướng dưới cho điện thoại (kiểu Duolingo: icon nhiều màu + nhãn in hoa).
 * Trước đây hiện cả 9 tab nên 3 tab cuối (Todo, Sơ đồ, Cài đặt) bị khuất, phải vuốt ngang mới thấy.
 * Nay chỉ hiện 5 tab chính + nút “Thêm” mở bảng trượt lên — mọi mục đều bấm được, không cần vuốt.
 */
export default function MobileBottomNav({ activeTab, onTabChange }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const items = navigationItems;
  const primary = PRIMARY_TABS.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  const extra = items.filter((item) => !PRIMARY_TABS.includes(item.id));
  const extraActive = extra.some((item) => item.id === activeTab);

  const selectTab = (id) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10);
    setMoreOpen(false);
    onTabChange(id);
  };

  const tabClass = (active) => `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-0.5 py-1 text-[10px] font-bold tracking-tight transition-all duration-200 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`;
  const iconClass = (active) => `grid h-9 w-10 place-items-center rounded-xl transition-all duration-200 ${active ? 'bg-indigo-50/90 text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-400' : ''}`;

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
              {extra.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTab(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex h-12 items-center gap-3 rounded-xl border px-3 text-left transition-all ${active ? 'border-indigo-500/40 bg-indigo-50/90 text-indigo-600 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-400' : 'border-slate-200/80 bg-slate-50/60 text-slate-700 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300'}`}
                  >
                    <NavIcon icon={item.icon} color={item.color} size="sm" active={active} />
                    <span className="min-w-0 truncate text-[13px] font-bold tracking-tight">{item.shortLabel || item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-50 flex items-center gap-0.5 border-t border-slate-200/80 bg-white/80 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0B0F17]/85 md:hidden"
        aria-label="Điều hướng mobile"
      >
        {primary.map((item) => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} type="button" onClick={() => selectTab(item.id)} className={tabClass(active)} aria-current={active ? 'page' : undefined}>
              <span className={iconClass(active)}><NavIcon icon={item.icon} color={item.color} size="sm" active={active} /></span>
              <span className="max-w-full truncate">{item.shortLabel || item.label}</span>
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
          <span className={iconClass(extraActive)}><NavIcon icon={LayoutGrid} color={MORE_COLOR} size="sm" active={extraActive} /></span>
          <span className="max-w-full truncate">Thêm</span>
        </button>
      </nav>
    </>
  );
}

