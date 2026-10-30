import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  Flame,
  LoaderCircle,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import StudyHistoryChart from "../../components/ui/StudyHistoryChart";
import TodayPlanCard from "../../components/TodayPlanCard";
import MistakeBankCard from "../../components/MistakeBankCard";
import CollapsibleCard from "../../components/ui/CollapsibleCard";
import SectionHeader from "../../components/ui/SectionHeader";
import useSectionState from "../../hooks/useSectionState";
import useGrammarProgress from "../../hooks/useGrammarProgress";
import useSkillsProgress from "../../hooks/useSkillsProgress";
import useVstepProgress from "../../hooks/useVstepProgress";
import useDailyGoal, { GOAL_PRESETS } from "../../hooks/useDailyGoal";
import useVocabularyCards from "../../hooks/useVocabularyCards";
import { getHistoryDays, historyChangedEvent, loadHistory, recentHistory } from "../../services/historyService";
import { levelFor, summarize } from "../../services/gamification";

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
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="metric mt-1.5 text-2xl text-slate-900 dark:text-white">{value}</p>
      {note && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{note}</p>}
    </div>
  );
}

function AchievementItem({ achievement }) {
  const Icon = ACHIEVEMENT_ICONS[achievement.icon] || Award;
  return (
    <li className={`rounded-xl border p-3 transition-colors ${achievement.earned ? "border-amber-500/30 bg-amber-500/[0.06]" : "border-slate-200/70 opacity-70 dark:border-white/[0.08]"}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-lg ${achievement.earned ? "border border-amber-500/30 bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-slate-100 text-slate-400 dark:bg-white/10 dark:text-white/50"}`}>
        <Icon size={17} />
      </span>
      <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">{achievement.label}</p>
      <p className="mt-0.5 text-xs leading-4 text-slate-500 dark:text-slate-400">{achievement.detail}</p>
    </li>
  );
}

/** Trang Tiến độ: mục tiêu ngày, XP/cấp độ, huy hiệu và thống kê gộp mọi module. */
export default function ProgressHub({ user, streak, onNavigate }) {
  const { progress: grammarProgress, total: grammarTotal } = useGrammarProgress();
  const { progress: skillsProgress } = useSkillsProgress();
  const { attempts: vstepAttempts } = useVstepProgress();
  const { target, setGoal } = useDailyGoal();
  const [days, setDays] = useState(() => getHistoryDays());
  // Một query duy nhất cho toàn bộ thẻ, dùng chung với Trang chủ/widget.
  const { cards, loading } = useVocabularyCards({ user });
  const [showUnearned, setShowUnearned] = useState(false);
  const [statsOpen, toggleStats] = useSectionState("progress-detailed-stats", false);

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
  const earned = achievements.filter((achievement) => achievement.earned);
  const unearned = achievements.filter((achievement) => !achievement.earned);
  const last14 = useMemo(() => recentHistory(14, days), [days]);
  const bestWeek = last14.reduce((best, day) => Math.max(best, day.reviewed), 0);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Tiến độ học tập"
        meta={`${earned.length}/${achievements.length} huy hiệu · ${stats.activeDays} ngày có học`}
        action={
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-secondary h-10 px-3.5 text-xs font-semibold"
          >
            <Award size={15} />
            Xuất báo cáo
          </button>
        }
      />

      <div className="flex items-center gap-3">
        <span className="shrink-0 text-[11px] font-bold text-slate-600 dark:text-slate-300">Cấp {level.level}</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${level.percent}%` }}
          />
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {level.nextAt ? `Còn ${level.toNext} XP` : "Cấp cao nhất"}
        </span>
      </div>

      <TodayPlanCard
        cards={cards}
        target={target}
        goalToday={stats.goal.today}
        onNavigate={onNavigate}
        onSetGoal={setGoal}
        goalPresets={GOAL_PRESETS}
      />

      <div className="grid grid-cols-3 gap-2.5">
        <div className="panel-flat p-3 text-center">
          <Flame size={16} className="mx-auto text-amber-500" />
          <p className="metric mt-1 text-lg text-slate-900 dark:text-white">{stats.streak.current}</p>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Chuỗi ngày</p>
        </div>
        <div className="panel-flat p-3 text-center">
          <CalendarCheck size={16} className="mx-auto text-indigo-500" />
          <p className="metric mt-1 text-lg text-slate-900 dark:text-white">{stats.activeDays}</p>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Ngày có học</p>
        </div>
        <div className="panel-flat p-3 text-center">
          <Target size={16} className="mx-auto text-emerald-500" />
          <p className="metric mt-1 text-lg text-slate-900 dark:text-white">{stats.accuracy}%</p>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Tỷ lệ nhớ</p>
        </div>
      </div>

      <MistakeBankCard />

      <section className="panel p-5 print-report">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Huy hiệu <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">({earned.length}/{achievements.length})</span>
            </h3>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Mở khoá bằng cách học đều mỗi ngày</p>
        </div>

        {earned.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {earned.map((achievement) => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            Chưa có huy hiệu nào. Học bài đầu tiên để bắt đầu mở khoá.
          </p>
        )}

        {unearned.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowUnearned((value) => !value)}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              aria-expanded={showUnearned}
            >
              {showUnearned ? "Ẩn huy hiệu chưa mở" : `Xem ${unearned.length} huy hiệu chưa mở`}
              <ChevronDown size={14} className={`transition-transform ${showUnearned ? "rotate-180" : ""}`} />
            </button>
            {showUnearned && (
              <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {unearned.map((achievement) => (
                  <AchievementItem key={achievement.id} achievement={achievement} />
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <CollapsibleCard
        id="progress-detailed-stats"
        icon={BarChart3}
        title="Thống kê chi tiết"
        description="14 chỉ số gộp từ mọi module và lịch sử 14 ngày."
        badge={<span className="chip bg-slate-100 text-[11px] font-bold text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{stats.reviewed} lượt ôn</span>}
        open={statsOpen}
        onToggle={toggleStats}
        className="print-report"
      >
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <LoaderCircle size={15} className="animate-spin" />Đang tải dữ liệu từ vựng…
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
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

        <div className="mt-5 border-t border-slate-200/70 pt-4 dark:border-white/[0.08]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Lịch sử 14 ngày</p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Ngày tốt nhất: {bestWeek} lượt ôn</p>
          </div>
          <div className="mt-3">
            <StudyHistoryChart days={14} />
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
}
