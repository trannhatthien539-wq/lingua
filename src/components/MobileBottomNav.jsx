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

  const tabClass = (active) => `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-0.5 py-1 text-[9px] font-bold uppercase tracking-normal transition ${active ? 'text-[#1899d6] dark:text-[#84d8ff]' : 'text-ink/50 dark:text-white/50'}`;
  const iconClass = (active) => `grid h-10 w-11 place-items-center rounded-2xl transition ${active ? 'bg-[#ddf4ff] dark:bg-[#1cb0f6]/25' : ''}`;

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
                    className={`flex min-h-[64px] items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition ${active ? 'border-[#84d8ff] bg-[#ddf4ff] dark:border-[#1cb0f6]/50 dark:bg-[#1cb0f6]/20' : 'border-ink/[0.08] hover:bg-ink/[0.04] dark:border-white/[0.08] dark:hover:bg-white/[0.06]'}`}
                  >
                    <NavIcon icon={item.icon} color={item.color} size="sm" />
                    <span className="min-w-0">
                      <span className={`block truncate text-[13px] font-bold uppercase tracking-[0.04em] ${active ? 'text-[#1899d6] dark:text-[#84d8ff]' : ''}`}>{item.shortLabel || item.label}</span>
                      <span className="block truncate text-xs text-ink/60 dark:text-white/55">{item.description}</span>
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
        {primary.map((item) => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} type="button" onClick={() => selectTab(item.id)} className={tabClass(active)} aria-current={active ? 'page' : undefined}>
              <span className={iconClass(active)}><NavIcon icon={item.icon} color={item.color} size="sm" /></span>
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
          <span className={iconClass(extraActive)}><NavIcon icon={LayoutGrid} color={MORE_COLOR} size="sm" /></span>
          <span className="max-w-full truncate">Thêm</span>
        </button>
      </nav>
    </>
  );
}

