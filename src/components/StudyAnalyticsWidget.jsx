import { useMemo } from 'react';

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

export default function StudyAnalyticsWidget({ cards = [], streak }) {
  const today = dayKey(new Date());
  const mastered = cards.filter((card) => card.status === 'mastered').length;
  const learning = cards.filter((card) => card.status === 'learning').length;
  const fresh = cards.filter((card) => card.status === 'new' || !card.status).length;
  const total = cards.length || 1;
  const studiedToday = cards.filter((card) => card.reviewDate?.slice(0, 10) === today || card.nextReviewDate === today).length;
  const heatmap = useMemo(() => Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - index));
    const active = streak?.lastActiveDate === dayKey(date) || (streak?.currentStreak > 0 && index >= 28 - streak.currentStreak);
    return { key: dayKey(date), active };
  }), [streak]);

  return <section className="panel border-zinc-200/80 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#202724]
  "><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Study analytics</p><h2 className="mt-1 font-display text-lg font-bold text-zinc-900 dark:text-white">Tiến độ học tập</h2></div><span className="text-xs font-semibold text-zinc-500">{streak?.currentStreak || 0} ngày liên tiếp</span></div><div className="mt-4 flex flex-wrap items-center gap-1.5" aria-label="Hoạt động 4 tuần gần đây">{heatmap.map((cell) => <span key={cell.key} title={cell.key} className={`h-3.5 w-3.5 rounded-[3px] ${cell.active ? 'bg-teal-600' : 'bg-zinc-200 dark:bg-white/10'}`} />)}</div><div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"><div className="flex h-full"><span className="bg-emerald-500" style={{ width: `${mastered / total * 100}%` }} /><span className="bg-amber-400" style={{ width: `${learning / total * 100}%` }} /><span className="bg-zinc-300 dark:bg-zinc-600" style={{ width: `${fresh / total * 100}%` }} /></div></div><div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-zinc-500"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />Đã thuộc {mastered}</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />Đang học {learning}</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-zinc-300" />Từ mới {fresh}</span></div><div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-xl bg-zinc-50 p-3 dark:bg-white/5"><p className="text-xl font-bold text-zinc-900 dark:text-white">{studiedToday}</p><p className="mt-1 text-[10px] font-semibold text-zinc-500">Học hôm nay</p></div><div className="rounded-xl bg-zinc-50 p-3 dark:bg-white/5"><p className="text-xl font-bold text-zinc-900 dark:text-white">{streak?.totalSessions || 0}</p><p className="mt-1 text-[10px] font-semibold text-zinc-500">Phiên tập trung</p></div><div className="rounded-xl bg-zinc-50 p-3 dark:bg-white/5"><p className="text-xl font-bold text-teal-700 dark:text-teal-300">{cards.length ? Math.round((mastered / cards.length) * 100) : 0}%</p><p className="mt-1 text-[10px] font-semibold text-zinc-500">Tỷ lệ nhớ</p></div></div></section>;
}
