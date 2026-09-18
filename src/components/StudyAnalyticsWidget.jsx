import StudyHistoryChart from './ui/StudyHistoryChart';

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

export default function StudyAnalyticsWidget({ cards = [], streak }) {
  const today = dayKey(new Date());
  const mastered = cards.filter((card) => card.status === 'mastered').length;
  const learning = cards.filter((card) => card.status === 'learning').length;
  const fresh = cards.filter((card) => card.status === 'new' || !card.status).length;
  const total = cards.length || 1;
  const studiedToday = cards.filter((card) => card.lastStudiedDate === today).length;
  const masteredPercent = cards.length ? Math.round((mastered / cards.length) * 100) : 0;
  return <section className="panel border-zinc-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#202724]"><div className="flex items-center justify-between gap-3"><div><p className="eyebrow">Tổng quan</p><h2 className="mt-1 font-display text-lg font-bold text-zinc-900 dark:text-white">Tiến độ học tập</h2></div><span className="rounded-full bg-lime px-3 py-1.5 text-xs font-bold text-ink">{streak?.currentStreak || 0} ngày streak</span></div><div className="mt-5 flex items-end justify-between gap-4"><div><p className="font-display text-3xl font-bold text-zinc-900 dark:text-white">{masteredPercent}%</p><p className="mt-1 text-xs text-zinc-500">đã ghi nhớ trong bộ này</p></div><p className="text-right text-xs font-semibold text-zinc-500">{studiedToday} từ học hôm nay</p></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"><div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${masteredPercent}%` }} /></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-zinc-500"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />Đã thuộc {mastered}</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-400" />Đang học {learning}</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-zinc-300" />Chưa học {fresh}</span></div><StudyHistoryChart /></section>;
}
