import StudyHistoryChart from './ui/StudyHistoryChart';

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

export default function StudyAnalyticsWidget({ cards = [], streak, dueCount = 0, deckTitle = '', onStartToday }) {
  const today = dayKey(new Date());
  const mastered = cards.filter((card) => card.status === 'mastered').length;
  const learning = cards.filter((card) => card.status === 'learning').length;
  const fresh = cards.filter((card) => card.status === 'new' || !card.status).length;
  const studiedToday = cards.filter((card) => card.lastStudiedDate === today).length;
  const masteredPercent = cards.length ? Math.round((mastered / cards.length) * 100) : 0;
  const hasProgress = mastered + learning > 0 || (streak?.currentStreak || 0) > 0;

  // Người mới: chỉ một việc, một nút — thay vì bốn ô số liệu đều bằng 0.
  if (!hasProgress) {
    const firstSession = dueCount || cards.length;
    return (
      <section className="panel p-5">
        <p className="eyebrow">Việc hôm nay</p>
        <h2 className="mt-2 font-display text-xl font-bold">
          {firstSession ? `Học ${firstSession} từ trong “${deckTitle}”` : 'Chọn một bộ thẻ để bắt đầu'}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-ink/70 dark:text-white/70">
          Khoảng 5 phút. Trả lời đúng, Lingua sẽ giãn lịch ôn ra 5 ngày.
        </p>
        <button onClick={onStartToday} disabled={!cards.length} className="btn-primary mt-4 w-full sm:w-auto">
          Bắt đầu học
        </button>
      </section>
    );
  }

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Tổng quan</p>
          <h2 className="mt-1 font-display text-lg font-bold">Tiến độ học tập</h2>
        </div>
        {streak?.currentStreak > 0 && <span className="chip bg-lime text-ink">{streak.currentStreak} ngày chuỗi</span>}
      </div>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="metric text-3xl">{masteredPercent}%</p>
          <p className="mt-1 text-xs text-ink/60 dark:text-white/55">đã thuộc trong bộ này</p>
        </div>
        <p className="text-right text-xs font-semibold text-ink/60 dark:text-white/55">{studiedToday} từ học hôm nay</p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
        <div className="h-full rounded-full bg-sage transition-all duration-500" style={{ width: `${masteredPercent}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-ink/60 dark:text-white/55">
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-ok" />Đã thuộc {mastered}</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-lime" />Đang học {learning}</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-ink/20 dark:bg-white/30" />Chưa học {fresh}</span>
      </div>
      <StudyHistoryChart />
    </section>
  );
}
