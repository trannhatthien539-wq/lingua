import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, CalendarCheck, Flame, LoaderCircle, Sparkles, Star, Target, TrendingUp, Trophy } from "lucide-react";
import ModuleHero from "../../components/ui/ModuleHero";
import StudyHistoryChart from "../../components/ui/StudyHistoryChart";
import TodayPlanCard from "../../components/TodayPlanCard";
import MistakeBankCard from "../../components/MistakeBankCard";
import useGrammarProgress from "../../hooks/useGrammarProgress";
import useSkillsProgress from "../../hooks/useSkillsProgress";
import useVstepProgress from "../../hooks/useVstepProgress";
import useDailyGoal, { GOAL_PRESETS } from "../../hooks/useDailyGoal";
import { dataService } from "../../services/dataService";
import { getHistoryDays, historyChangedEvent, loadHistory, recentHistory } from "../../services/historyService";
import { levelFor, summarize } from "../../services/gamification";
import { refreshRequestedEvent } from "../../services/syncStatus";
import { toast } from "../../services/toast";

const ACHIEVEMENT_ICONS = {
  sprout: Star,
  repeat: TrendingUp,
  zap: TrendingUp,
  check: Award,
  crown: Trophy,
  flame: Flame,
  book: BookOpen,
  graduation: BookOpen,
  headphones: Award,
  target: Target,
  pen: Award,
  sparkles: Sparkles,
  shield: Award,
  calendar: CalendarCheck,
  library: BookOpen,
};

function StatTile({ label, value, note }) {
  return (
    <div className="panel-flat p-3.5">
      <p className="text-xs font-semibold text-ink/60 dark:text-white/60">{label}</p>
      <p className="metric mt-1.5 text-2xl">{value}</p>
      {note && <p className="mt-0.5 text-xs text-ink/50 dark:text-white/50">{note}</p>}
    </div>
  );
}

/** Trang Tiến độ: mục tiêu ngày, XP/cấp độ, huy hiệu và thống kê gộp mọi module. */
export default function ProgressHub({ user, streak, onNavigate }) {
  const { progress: grammarProgress, total: grammarTotal } = useGrammarProgress();
  const { progress: skillsProgress } = useSkillsProgress();
  const { attempts: vstepAttempts } = useVstepProgress();
  const { target, setGoal } = useDailyGoal();
  const [days, setDays] = useState(() => getHistoryDays());
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [customGoal, setCustomGoal] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const decks = await dataService.getDecks();
        const lists = await Promise.all(decks.map((deck) => dataService.getCards(deck.id)));
        if (active) setCards(lists.flat());
      } catch (error) {
        if (active) toast.error(error.message || "Không thể tải dữ liệu từ vựng.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user?.uid, reloadToken]);

  useEffect(() => {
    let active = true;
    loadHistory().then((value) => {
      if (active) setDays(value);
    });
    const sync = () => setDays(getHistoryDays());
    window.addEventListener(historyChangedEvent, sync);
    return () => {
      active = false;
      window.removeEventListener(historyChangedEvent, sync);
    };
  }, []);

  useEffect(() => {
    const reload = () => setReloadToken((value) => value + 1);
    window.addEventListener(refreshRequestedEvent, reload);
    return () => window.removeEventListener(refreshRequestedEvent, reload);
  }, []);

  const summary = useMemo(
    () => summarize({
      days,
      streak,
      cards,
      grammar: { ...grammarProgress, total: grammarTotal },
      skills: skillsProgress,
      goal: { target },
      vstep: { attempts: vstepAttempts },
    }),
    [days, streak, cards, grammarProgress, grammarTotal, skillsProgress, target, vstepAttempts],
  );
  const { stats, xp, achievements } = summary;
  const level = levelFor(xp);
  const earnedCount = achievements.filter((achievement) => achievement.earned).length;
  const goalPercent = target ? Math.min(100, Math.round((stats.goal.today / target) * 100)) : 0;
  const last14 = useMemo(() => recentHistory(14, days), [days]);
  const bestWeek = last14.reduce((best, day) => Math.max(best, day.reviewed), 0);

  return (
    <div className="space-y-5">
      <ModuleHero
        icon={Trophy}
        eyebrow="Tiến độ & thành tích"
        title="Toàn cảnh hành trình học"
        description="Theo dõi XP, chuỗi ngày, mục tiêu ôn tập và những kỷ lục bạn đã tạo."
        accent="#ffc800"
        deep="#b88900"
        illustration="progress"
        progress={level.percent}
        progressLabel={`Tiến độ lên cấp ${level.level + 1}`}
        stats={[{ label: 'Cấp hiện tại', value: `${level.level}` }, { label: 'XP tích lũy', value: xp }, { label: 'Huy hiệu', value: `${earnedCount}/${achievements.length}` }]}
        action="Xuất báo cáo"
        onAction={() => window.print()}
        className="no-print"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <TodayPlanCard
          cards={cards}
          target={target}
          goalToday={stats.goal.today}
          streak={streak}
          onNavigate={onNavigate}
        />
        <section className="panel p-5 print-report">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Mục tiêu hôm nay</p>
              <h3 className="mt-1 font-display text-lg font-bold">{stats.goal.today}/{target} lượt ôn</h3>
            </div>
            <span className={`chip ${goalPercent >= 100 ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-lime text-ink"}`}>
              {goalPercent}%
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <div className={`h-full rounded-full transition-all duration-500 ${goalPercent >= 100 ? "bg-ok" : "bg-sage"}`} style={{ width: `${goalPercent}%` }} />
          </div>
          <p className="mt-3 text-xs text-ink/60 dark:text-white/60">
            {goalPercent >= 100
              ? "Đã đạt mục tiêu hôm nay. Nghỉ ngơi hoặc học thêm cho vui nhé!"
              : `Còn ${Math.max(0, target - stats.goal.today)} lượt ôn nữa để đạt mục tiêu.`}
          </p>
          <div className="no-print mt-4 flex flex-wrap items-center gap-2">
            {GOAL_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setGoal(preset)}
                aria-pressed={target === preset}
                className={`min-h-[40px] rounded-xl px-3.5 text-xs font-bold transition ${target === preset ? "bg-lime text-ink" : "border border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"}`}
              >
                {preset} lượt/ngày
              </button>
            ))}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const value = Number(customGoal);
                if (!value || value <= 0) return;
                setGoal(value);
                setCustomGoal("");
              }}
              className="flex items-center gap-2"
            >
              <input
                value={customGoal}
                onChange={(event) => setCustomGoal(event.target.value)}
                inputMode="numeric"
                placeholder="Tùy chỉnh"
                className="h-10 w-24 rounded-xl border border-ink/10 bg-transparent px-3 text-xs outline-none dark:border-white/15"
                aria-label="Mục tiêu tùy chỉnh"
              />
              <button className="btn-ghost h-10 px-3 text-xs">Lưu</button>
            </form>
          </div>
        </section>

        <section className="panel p-5 print-report">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Cấp độ</p>
              <h3 className="mt-1 font-display text-lg font-bold">Cấp {level.level} · {level.title}</h3>
            </div>
            <span className="chip bg-lime text-ink">{xp} XP</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${level.percent}%` }} />
          </div>
          <p className="mt-3 text-xs text-ink/60 dark:text-white/60">
            {level.nextAt ? `Còn ${level.toNext} XP để lên cấp ${level.level + 1}.` : "Bạn đã đạt cấp cao nhất — quá đỉnh!"}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
              <p className="metric text-lg">{stats.streak.current}</p>
              <p className="text-xs text-ink/55 dark:text-white/55">Chuỗi ngày</p>
            </div>
            <div className="rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
              <p className="metric text-lg">{stats.activeDays}</p>
              <p className="text-xs text-ink/55 dark:text-white/55">Ngày có học</p>
            </div>
            <div className="rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
              <p className="metric text-lg">{stats.accuracy}%</p>
              <p className="text-xs text-ink/55 dark:text-white/55">Tỷ lệ nhớ</p>
            </div>
          </div>
        </section>
      </div>

      <MistakeBankCard />

      <section className="panel p-5 print-report">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-sage" />
            <h3 className="font-display text-lg font-bold">Huy hiệu ({earnedCount}/{achievements.length})</h3>
          </div>
          <p className="text-xs text-ink/55 dark:text-white/55">Mở khoá bằng cách học đều mỗi ngày</p>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {achievements.map((achievement) => {
            const Icon = ACHIEVEMENT_ICONS[achievement.icon] || Award;
            return (
              <li key={achievement.id} className={`rounded-xl border p-3 ${achievement.earned ? "border-sage/50 bg-sage/10" : "border-ink/[0.08] opacity-60 dark:border-white/[0.08]"}`}>
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${achievement.earned ? "bg-lime text-ink" : "bg-ink/[0.06] text-ink/50 dark:bg-white/10 dark:text-white/50"}`}>
                  <Icon size={17} />
                </span>
                <p className="mt-2 text-sm font-bold">{achievement.label}</p>
                <p className="mt-0.5 text-xs leading-4 text-ink/60 dark:text-white/60">{achievement.detail}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel p-5 print-report">
        <p className="eyebrow">Thống kê gộp</p>
        {loading ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-ink/60 dark:text-white/60"><LoaderCircle size={15} className="animate-spin" />Đang tải dữ liệu từ vựng…</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            <StatTile label="Tổng lượt ôn" value={stats.reviewed} note={`7 ngày: ${stats.last7.reviewed}`} />
            <StatTile label="Từ đã thuộc" value={stats.cards.mastered} note={`/${stats.cards.total} thẻ`} />
            <StatTile label="Cần ôn hôm nay" value={stats.cards.due} note="thẻ đến hạn" />
            <StatTile label="Từ hay quên" value={stats.cards.leeches} note="quên ≥ 4 lần" />
            <StatTile label="Ngữ pháp đạt" value={`${stats.grammar.passed}/${stats.grammar.total}`} note="bài kiểm tra ≥ 80%" />
            <StatTile label="Nghe · Đọc" value={`${stats.skills.listening} · ${stats.skills.reading}`} note="bài đã làm" />
            <StatTile label="Luyện câu" value={`${stats.skills.sentenceAccuracy}%`} note={`${stats.skills.sentenceAttempted} câu`} />
            <StatTile label="Thi thử tốt nhất" value={stats.skills.mockBest} note={`${stats.skills.mockCount} lần thi`} />
            <StatTile label="Đề VSTEP đã thi" value={stats.vstep.attempts} note="đủ 4 kỹ năng" />
            <StatTile label="VSTEP cao nhất" value={stats.vstep.best ? `${stats.vstep.best}/10` : "—"} note={stats.vstep.band ? `mức ${stats.vstep.band}` : "chưa có kết quả"} />
            <StatTile label="Ngày học tốt nhất" value={stats.bestDay} note="lượt ôn/ngày" />
            <StatTile label="Buổi học" value={stats.sessions} note="phiên hoàn thành" />
            <StatTile label="Đúng 7 ngày qua" value={`${stats.last7.accuracy}%`} note={`${stats.last7.activeDays} ngày có học`} />
            <StatTile label="Từ đã học" value={Math.max(0, stats.cards.total - stats.cards.fresh)} note={`${stats.cards.fresh} từ chưa học`} />
          </div>
        )}
        <p className="mt-4 text-xs text-ink/55 dark:text-white/55">Ngày tốt nhất trong 2 tuần gần đây: {bestWeek} lượt ôn.</p>
      </section>

      <section className="panel p-5 print-report">
        <p className="eyebrow">Lịch sử học</p>
        <div className="mt-3"><StudyHistoryChart days={14} /></div>
      </section>
    </div>
  );
}
