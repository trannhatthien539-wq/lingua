import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Circle,
  Flame,
  GraduationCap,
  Layers,
  LoaderCircle,
  PlayCircle,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import StudyHistoryChart from "../../components/ui/StudyHistoryChart";
import TodayPlanCard from "../../components/TodayPlanCard";
import NavIcon from "../../components/ui/NavIcon";
import GoalRing from "../../components/ui/GoalRing";
import useCloudDoc from "../../hooks/useCloudDoc";
import useDailyGoal from "../../hooks/useDailyGoal";
import useGrammarProgress from "../../hooks/useGrammarProgress";
import useSkillsProgress from "../../hooks/useSkillsProgress";
import useVocabularyCards from "../../hooks/useVocabularyCards";
import useVstepProgress from "../../hooks/useVstepProgress";
import { listeningLessons } from "../../data/skills/listening";
import { readingPassages } from "../../data/skills/reading";
import { navigationItems } from "../../data/navigation";
import { registry as vstepRegistry } from "../../data/vstep/metadata";
import { openItem } from "../../services/deepLink";
import { getHistoryDays, historyChangedEvent, loadHistory, recentHistory } from "../../services/historyService";
import { summarize } from "../../services/gamification";
import { createStarterPackDeck } from "../../services/starterPackService";
import { toast } from "../../services/toast";
import { userDocKeys } from "../../services/userDocService";

/** Các khu vực học hiện trên trang chủ (lấy icon + màu từ `navigationItems`). */
const AREA_IDS = ["vocabulary", "grammar", "skills", "vstep", "writing", "progress"];

const AREA_METADATA = {
  vocabulary: {
    badge: "1.000+ từ",
    teaser: "1.000 từ cốt lõi · Flashcard SRS 3D · Phát âm chuẩn IPA",
  },
  grammar: {
    badge: "30 bài",
    teaser: "Lộ trình A1–C1 · 12 thì & cấu trúc · Trắc nghiệm & sổ câu sai",
  },
  skills: {
    badge: "4 kỹ năng",
    teaser: "Nghe · Đọc · Nói có chấm phát âm · Viết & luyện câu",
  },
  vstep: {
    badge: "10 đề thi",
    teaser: "Bộ đề 4 kỹ năng chuẩn B1–C1 · Chấm điểm và xem lại chi tiết",
  },
  writing: {
    badge: "AI chữa bài",
    teaser: "Phân tích ngữ pháp · Chỉ rõ lỗi sai · Gợi ý câu mẫu nâng điểm",
  },
  progress: {
    badge: "Thành tựu",
    teaser: "Cấp bậc XP · Chuỗi ngày · Bộ sưu tập huy hiệu và báo cáo",
  },
};

const CEFR_LADDER = [
  { id: "A1", label: "Vỡ lòng" },
  { id: "A2", label: "Sơ cấp" },
  { id: "B1", label: "Trung cấp" },
  { id: "B2", label: "Trung cấp trên" },
  { id: "C1", label: "Cao cấp" },
  { id: "C2", label: "Thành thạo" },
];

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const weekdayOf = (dateKey) => WEEKDAYS[new Date(`${dateKey}T00:00:00`).getDay()] || "";
const shortLabel = (label = "") => label.replace(/\s*\(.*?\)\s*/g, " ").trim();

const greetingByHour = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Chào buổi sáng";
  if (hour < 14) return "Chào buổi trưa";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

function QuickStat({ icon, color, colorDark, label, value, note, onClick, loading = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="panel panel-interactive group flex min-h-[92px] items-start gap-3 p-3.5 text-left"
    >
      <NavIcon icon={icon} color={color} darkColor={colorDark} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        {loading ? (
          <span className="skeleton mt-1.5 block h-6 w-12 rounded-md" />
        ) : (
          <p className="metric mt-0.5 text-2xl text-slate-900 dark:text-white">{value}</p>
        )}
        <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{note}</p>
      </div>
      <ArrowRight size={14} className="mt-1 hidden shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400 sm:block" />
    </button>
  );
}

function FirstRunCard({ busy, onStarterPack, onCreateDeck }) {
  return (
    <section className="panel relative overflow-hidden p-5 sm:p-6" aria-labelledby="first-run-title">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden="true" />
      <div className="relative flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-indigo-500/25 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
          <BookOpen size={21} />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">Bắt đầu thư viện</p>
          <h3 id="first-run-title" className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
            Thư viện từ vựng đang trống
          </h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Chọn cách bắt đầu phù hợp. Lingua chỉ tạo dữ liệu khi bạn chủ động chọn — không tự nạp hàng nghìn thẻ.
          </p>
        </div>
      </div>
      <div className="relative mt-4 grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={onStarterPack}
          disabled={busy}
          className="btn-primary min-h-[56px] justify-start px-4 text-left disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? <LoaderCircle size={18} className="shrink-0 animate-spin" /> : <Sparkles size={18} className="shrink-0" />}
          <span className="min-w-0">
            <span className="block text-sm font-bold">Nạp bộ từ vựng khởi đầu</span>
            <span className="mt-0.5 block text-[11px] font-medium opacity-80">50 thẻ mẫu A1 · có thể xoá bất cứ lúc nào</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onCreateDeck}
          className="btn-secondary min-h-[56px] justify-start px-4 text-left"
        >
          <Plus size={18} className="shrink-0" />
          <span className="min-w-0">
            <span className="block text-sm font-bold">Tạo bộ từ mới / Nhập thẻ riêng</span>
            <span className="mt-0.5 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Tự đặt tên bộ và thêm từ của bạn</span>
          </span>
        </button>
      </div>
    </section>
  );
}

function StatTile({ icon: Icon, color, label, value, note }) {
  return (
    <div className="panel-flat flex items-start gap-2.5 p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border" style={{ backgroundColor: `${color}14`, borderColor: `${color}28`, color }}>
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="metric text-lg text-slate-900 dark:text-white">{value}</p>
        {note && <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{note}</p>}
      </div>
    </div>
  );
}

function CriterionCard({ done, icon: Icon, iconClass, title, value, unit, hint, cta, onAction }) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-4 transition-colors ${
        done
          ? "border-emerald-500/30 bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08]"
          : "border-slate-200/80 bg-white/70 dark:border-white/[0.08] dark:bg-white/[0.02]"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Icon size={16} className={iconClass} />
            <span className="truncate">{title}</span>
          </span>
          {done ? <CheckCircle2 size={16} className="shrink-0 text-emerald-500" /> : <Circle size={15} className="shrink-0 text-slate-300 dark:text-slate-600" />}
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="metric text-xl text-slate-900 dark:text-white">{value}</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{unit}</span>
        </div>
        <p className={`mt-1 text-[11px] font-semibold ${done ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>{hint}</p>
      </div>
      <button type="button" onClick={onAction} className="btn-secondary mt-3 h-9 w-full justify-center text-[11px] font-bold">
        {cta} <ArrowRight size={13} />
      </button>
    </div>
  );
}

/**
 * Trang chủ: bảng điều khiển học tập.
 * Mục tiêu là trả lời thật nhanh 3 câu: hôm nay cần làm gì, đang ở đâu, và học tiếp ở đâu.
 */
export default function HomeHub({ user, streak, onNavigate }) {
  const { progress: grammarProgress, total: grammarTotal } = useGrammarProgress();
  const { progress: skillsProgress } = useSkillsProgress();
  const { attempts: vstepAttempts } = useVstepProgress();
  const { target } = useDailyGoal();
  const { value: writingDoc } = useCloudDoc(userDocKeys.writing, { initial: {} });
  const { cards, loading: cardsLoading, reload: reloadCards } = useVocabularyCards({ user });
  const [days, setDays] = useState(() => getHistoryDays());
  const [starterBusy, setStarterBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      loadHistory().then((value) => {
        if (active) setDays({ ...value });
      }).catch(() => {});
    };
    refresh();
    window.addEventListener(historyChangedEvent, refresh);
    return () => {
      active = false;
      window.removeEventListener(historyChangedEvent, refresh);
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
  const { stats, xp, level, achievements } = summary;
  const earnedCount = achievements.filter((achievement) => achievement.earned).length;
  const goalToday = stats.goal.today;
  const goalPercent = target ? Math.min(100, Math.round((goalToday / target) * 100)) : 0;
  const week = useMemo(() => recentHistory(7, days), [days]);
  const weekMax = Math.max(1, ...week.map((day) => day.reviewed));
  const displayName = (user?.displayName || "").trim().split(" ").slice(-1)[0];
  const areas = AREA_IDS.map((id) => navigationItems.find((item) => item.id === id)).filter(Boolean);

  // Tiến độ từng khu vực học cho lưới thẻ.
  const areaStats = useMemo(() => {
    const build = (done, total, unit) => {
      if (total <= 0) return { percent: 0, label: `Chưa có ${unit}` };
      const percent = Math.min(100, Math.round((done / total) * 1000) / 10);
      return { percent, label: `${done}/${total} ${unit}` };
    };
    const skillsDone = stats.skills.listening + stats.skills.reading;
    const vstepDone = new Set(vstepAttempts.map((attempt) => attempt.examId).filter(Boolean)).size;
    return {
      vocabulary: build(stats.cards.mastered, stats.cards.total, "từ"),
      grammar: build(stats.grammar.passed, stats.grammar.total, "bài"),
      skills: build(skillsDone, listeningLessons.length + readingPassages.length, "bài"),
      vstep: build(vstepDone, vstepRegistry.length, "đề"),
      writing: writingDoc?.result
        ? { percent: 100, label: "Đã chấm 1 bài" }
        : { percent: 0, label: "Chưa có bài nào" },
      progress: build(earnedCount, achievements.length, "huy hiệu"),
    };
  }, [stats, earnedCount, achievements, vstepAttempts, writingDoc]);

  const cefrInfo = useMemo(() => {
    const vstepBest = Number(stats?.vstep?.best) || 0;
    const grammarPassed = Number(stats?.grammar?.passed) || 0;
    const cardsMastered = Number(stats?.cards?.mastered) || 0;

    let currentCefr = "A2";
    let currentCefrLabel = "Sơ cấp (Elementary)";
    let nextCefr = "B1";
    let nextCefrLabel = "Trung cấp (Intermediate)";
    let targetGrammar = 5;
    let targetCards = 50;
    let targetVstep = "4.0";
    let targetVstepScore = 4.0;

    if (vstepBest >= 8.5 || (grammarPassed >= 25 && cardsMastered >= 500)) {
      currentCefr = "C1";
      currentCefrLabel = "Cao cấp (Advanced)";
      nextCefr = "C2";
      nextCefrLabel = "Thông thạo (Proficiency)";
      targetGrammar = 30;
      targetCards = 1000;
      targetVstep = "9.5";
      targetVstepScore = 9.5;
    } else if (vstepBest >= 6.0 || (grammarPassed >= 15 && cardsMastered >= 200)) {
      currentCefr = "B2";
      currentCefrLabel = "Trung cấp trên (Upper-Intermediate)";
      nextCefr = "C1";
      nextCefrLabel = "Cao cấp (Advanced)";
      targetGrammar = 25;
      targetCards = 500;
      targetVstep = "8.5";
      targetVstepScore = 8.5;
    } else if (vstepBest >= 4.0 || (grammarPassed >= 5 && cardsMastered >= 50)) {
      currentCefr = "B1";
      currentCefrLabel = "Trung cấp (Intermediate)";
      nextCefr = "B2";
      nextCefrLabel = "Trung cấp trên (Upper-Intermediate)";
      targetGrammar = 15;
      targetCards = 200;
      targetVstep = "6.0";
      targetVstepScore = 6.0;
    }

    const cardsRemaining = Math.max(0, targetCards - cardsMastered);
    const grammarRemaining = Math.max(0, targetGrammar - grammarPassed);
    const vstepReached = vstepBest >= targetVstepScore;
    const criteriaCompletedCount =
      (grammarRemaining === 0 ? 1 : 0) +
      (cardsRemaining === 0 ? 1 : 0) +
      (vstepReached ? 1 : 0);

    return {
      currentCefr,
      currentCefrLabel,
      nextCefr,
      nextCefrLabel,
      currentLevelIndex: CEFR_LADDER.findIndex((lvl) => lvl.id === currentCefr),
      nextLevelIndex: CEFR_LADDER.findIndex((lvl) => lvl.id === nextCefr),
      targetGrammar,
      targetCards,
      targetVstep,
      cardsRemaining,
      grammarRemaining,
      vstepReached,
      cardsMastered,
      grammarPassed,
      vstepBest,
      criteriaCompletedCount,
      criteriaPercent: Math.round((criteriaCompletedCount / 3) * 100),
    };
  }, [stats]);

  const startPractice = () => {
    openItem({ tab: "vocabulary", type: "practice" });
    onNavigate?.("vocabulary");
  };
  const handleStarterPack = async () => {
    if (starterBusy) return;
    setStarterBusy(true);
    try {
      const result = await createStarterPackDeck();
      toast.success(result.existing
        ? "Bộ từ khởi đầu đã có trong thư viện của bạn."
        : `Đã nạp ${result.cards.length} thẻ từ vựng khởi đầu.`);
      reloadCards();
    } catch (error) {
      toast.error(error.message || "Không thể nạp bộ từ khởi đầu. Vui lòng thử lại.");
    } finally {
      setStarterBusy(false);
    }
  };
  const openNewDeck = () => {
    openItem({ tab: "vocabulary", type: "new-deck" });
    onNavigate?.("vocabulary");
  };
  const dueCount = stats.cards.due;
  const freshCount = stats.cards.fresh;
  const primaryLabel = dueCount > 0
    ? `Ôn ${Math.min(dueCount, 50)} thẻ đến hạn`
    : freshCount > 0
      ? `Học ${Math.min(freshCount, 50)} thẻ mới`
      : "Thêm từ mới";

  return (
    <div className="space-y-5">
      {/* Hero: lời chào + mục tiêu + nhịp học 7 ngày */}
      <section className="home-hero relative overflow-hidden rounded-[28px] border border-slate-200/80 p-5 text-slate-900 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:text-white sm:p-7">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[rgba(var(--accent),0.12)] blur-3xl dark:bg-[rgba(var(--accent),0.18)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[rgba(var(--accent-2),0.10)] blur-3xl" aria-hidden="true" />
        <div className="surface-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

        <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_306px] lg:items-stretch">
          <div className="flex min-w-0 flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-white/10 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              {greetingByHour()}{displayName ? `, ${displayName}` : ""} · Hôm nay
            </div>

            <h2 className="mt-3 max-w-xl font-display text-[1.65rem] font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl sm:leading-[1.12]">
              Học đều đặn.{" "}
              <span className="text-gradient">
                Bứt phá mỗi ngày.
              </span>
            </h2>
            <p className="mt-2 hidden max-w-lg text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:block sm:text-sm">
              Một phiên ngắn mỗi ngày, đúng thẻ cần ôn — thói quen nhỏ tạo nên phản xạ tiếng Anh.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={dueCount > 0 ? startPractice : () => onNavigate?.("vocabulary")}
                className="btn-primary min-h-[44px] px-5 text-xs font-bold shadow-md"
              >
                <PlayCircle size={16} />{primaryLabel}
              </button>
              <button type="button" onClick={() => onNavigate?.("grammar")} className="btn-secondary min-h-[44px] px-4 text-xs font-bold">
                <GraduationCap size={16} />Học ngữ pháp
              </button>
              <button type="button" onClick={() => onNavigate?.("vstep")} className="btn-secondary min-h-[44px] px-4 text-xs font-bold">
                <Award size={16} />Luyện VSTEP
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Zap size={13} className="text-[rgb(var(--accent))]" /> Cấp {level.level} · {xp} XP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flame size={13} className="text-amber-500" /> {stats.streak.current > 0 ? `${stats.streak.current} ngày liên tiếp` : "Chưa có chuỗi"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Target size={13} className="text-emerald-500" /> {goalToday}/{target} lượt ôn hôm nay
              </span>
            </div>
          </div>

          {/* Thẻ mục tiêu ngày */}
          <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 text-slate-900 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Mục tiêu hôm nay</p>
                <p className="mt-1 font-display text-lg font-bold">{goalToday}/{target} lượt ôn</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {goalPercent >= 100 ? "Đã đạt mục tiêu 🎉" : `Còn ${Math.max(0, target - goalToday)} lượt nữa`}
                </p>
              </div>
              <GoalRing value={goalPercent} size={70} stroke={7} label="Mục tiêu hôm nay">
                <span className="metric text-base text-slate-900 dark:text-white">{goalPercent}%</span>
              </GoalRing>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-200/70 pt-3 text-center dark:border-white/10">
              <div>
                <p className="metric text-base text-slate-900 dark:text-white">{stats.cards.due}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Cần ôn</p>
              </div>
              <div>
                <p className="metric text-base text-slate-900 dark:text-white">{stats.cards.mastered}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Đã thuộc</p>
              </div>
              <div>
                <p className="metric text-base text-slate-900 dark:text-white">{earnedCount}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Huy hiệu</p>
              </div>
            </div>

            <div className="mt-3 hidden border-t border-slate-200/70 pt-3 dark:border-white/10 sm:block">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <span>7 ngày qua</span>
                <span>{stats.last7.reviewed} lượt</span>
              </div>
              <div className="mt-2 flex h-9 items-end gap-1.5" role="img" aria-label={`Hoạt động 7 ngày: ${week.map((day) => `${weekdayOf(day.date)} ${day.reviewed} lượt`).join(", ")}`}>
                {week.map((day) => (
                  <div
                    key={day.date}
                    className="group flex h-full flex-1 flex-col justify-end"
                    title={`${weekdayOf(day.date)} ${day.label}: ${day.reviewed} lượt ôn, ${day.correct} đúng`}
                  >
                    <div
                      className={`w-full rounded-t-[4px] transition-all ${day.reviewed > 0 ? "bg-gradient-to-t from-[rgba(var(--accent),0.7)] to-[rgb(var(--accent-2))]" : "bg-slate-200 dark:bg-white/10"}`}
                      style={{ height: `${Math.max(day.reviewed ? 14 : 6, Math.round((day.reviewed / weekMax) * 100))}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 flex gap-1.5 text-center text-[9px] font-bold text-slate-600 dark:text-slate-400">
                {week.map((day) => <span key={day.date} className="flex-1">{weekdayOf(day.date)}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {!cardsLoading && cards.length === 0 && (
        <FirstRunCard busy={starterBusy} onStarterPack={handleStarterPack} onCreateDeck={openNewDeck} />
      )}

      {/* 4 chỉ số nhanh */}
      {(cardsLoading || cards.length > 0) && <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Chỉ số nhanh hôm nay">
        <QuickStat icon={CalendarCheck} color="#B45309" colorDark="#FCD34D" label="Cần ôn hôm nay" value={stats.cards.due} note={stats.cards.due > 0 ? `${Math.min(stats.cards.due, 50)} thẻ mỗi phiên` : "Không có thẻ quá hạn"} loading={cardsLoading} onClick={startPractice} />
        <QuickStat icon={Sparkles} color="#4F46E5" colorDark="#A5B4FC" label="Thẻ mới" value={stats.cards.fresh} note="chưa từng học" loading={cardsLoading} onClick={() => onNavigate?.("vocabulary")} />
        <QuickStat icon={Flame} color="#BE123C" colorDark="#FDA4AF" label="Từ hay quên" value={stats.cards.leeches} note="quên ≥ 4 lần" loading={cardsLoading} onClick={() => onNavigate?.("vocabulary")} />
        <QuickStat icon={TrendingUp} color="#047857" colorDark="#6EE7B7" label="Đã thuộc" value={stats.cards.mastered} note={`${stats.cards.total} thẻ trong thư viện`} loading={cardsLoading} onClick={() => onNavigate?.("progress")} />
      </section>}

      {/* Khu vực học tập */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Tiếp tục học</p>
            <h3 className="mt-0.5 font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">Khu vực học tập</h3>
          </div>
          <p className="hidden text-xs font-semibold text-slate-500 dark:text-slate-400 sm:block">6 phân khu kiến thức cốt lõi</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map((area) => {
            const stat = areaStats[area.id] || { percent: 0, label: "" };
            const meta = AREA_METADATA[area.id] || { badge: "", teaser: area.description };
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onNavigate?.(area.id)}
                className="group panel panel-interactive relative flex flex-col overflow-hidden p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <NavIcon icon={area.icon} color={area.color} darkColor={area.colorDark} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-display text-sm font-bold text-slate-900 dark:text-white">{area.label}</p>
                      <ArrowRight size={13} className="text-slate-300 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-slate-600" />
                    </div>
                    <span className="tone-text mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ '--tone': area.color, '--tone-dark': area.colorDark, backgroundColor: `${area.color}15`, border: `1px solid ${area.color}30` }}>
                      {meta.badge}
                    </span>
                  </div>
                  <span className="metric tone-text shrink-0 text-sm" style={{ '--tone': area.color, '--tone-dark': area.colorDark }}>{Math.round(stat.percent)}%</span>
                </div>

                <p className="mt-3 line-clamp-2 min-h-[2.25rem] text-xs leading-relaxed text-slate-600 dark:text-slate-300">{meta.teaser}</p>

                <div className="mt-auto pt-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>{stat.label}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{stat.percent}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${stat.percent}%`, backgroundColor: area.color }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Lộ trình CEFR */}
      <section className="panel overflow-hidden p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Lộ trình CEFR</p>
            <h3 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
              Lên bậc {cefrInfo.nextCefr} · {shortLabel(cefrInfo.nextCefrLabel)}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Hoàn thành 3 tiêu chí để mở khoá bậc tiếp theo.</p>
          </div>
          <span className="chip border border-indigo-500/25 bg-indigo-500/10 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300">
            {cefrInfo.criteriaCompletedCount}/3 tiêu chí · {cefrInfo.criteriaPercent}%
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/60 p-3 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <div className="flex min-w-0 items-start justify-between gap-0.5 sm:gap-1">
              {CEFR_LADDER.map((step, index) => {
                const isPast = index < cefrInfo.currentLevelIndex;
                const isCurrent = index === cefrInfo.currentLevelIndex;
                const isTarget = index === cefrInfo.nextLevelIndex;
                return (
                  <div key={step.id} className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      <div className={`h-1 flex-1 rounded-full ${index === 0 ? "invisible" : index <= cefrInfo.currentLevelIndex ? "bg-emerald-500" : index === cefrInfo.nextLevelIndex ? "bg-[rgba(var(--accent),0.35)] dark:bg-[rgba(var(--accent),0.5)]" : "bg-slate-200 dark:bg-white/10"}`} />
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-black transition-all sm:h-8 sm:w-8 sm:rounded-xl sm:text-xs ${
                          isCurrent
                            ? "scale-110 border-2 border-emerald-600 bg-emerald-700 text-white shadow-[0_0_12px_rgba(4,120,87,0.45)]"
                            : isTarget
                              ? "scale-105 border-2 border-indigo-500/40 bg-indigo-500/15 text-indigo-700 dark:border-indigo-300/40 dark:bg-indigo-400/15 dark:text-indigo-200"
                              : isPast
                                ? "border border-emerald-600/30 bg-emerald-100 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200"
                                : "bg-slate-100 text-slate-600 dark:bg-white/[0.05] dark:text-slate-300"
                        }`}
                      >
                        {step.id}
                      </span>
                      <div className={`h-1 flex-1 rounded-full ${index === CEFR_LADDER.length - 1 ? "invisible" : index < cefrInfo.currentLevelIndex ? "bg-emerald-500" : index === cefrInfo.currentLevelIndex ? "bg-gradient-to-r from-emerald-500 to-[rgb(var(--accent-2))]" : "bg-slate-200 dark:bg-white/10"}`} />
                    </div>
                    <span className={`mt-1.5 whitespace-nowrap text-[9px] font-bold sm:text-[10px] ${isCurrent ? "text-emerald-700 dark:text-emerald-300" : isTarget ? "text-indigo-700 dark:text-indigo-300" : isPast ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-300"}`}>
                      {isCurrent ? "Hiện tại" : isTarget ? "Mục tiêu" : step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[rgb(var(--accent-2))] to-[rgb(var(--accent))] transition-all duration-500" style={{ width: `${cefrInfo.criteriaPercent}%` }} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <CriterionCard
            done={cefrInfo.grammarRemaining === 0}
            icon={GraduationCap}
            iconClass="text-violet-500"
            title="Ngữ pháp trọng điểm"
            value={`${cefrInfo.grammarPassed}/${cefrInfo.targetGrammar}`}
            unit="bài"
            hint={cefrInfo.grammarRemaining === 0 ? "Đã đủ tiêu chuẩn ngữ pháp" : `Còn thiếu ${cefrInfo.grammarRemaining} bài`}
            cta={cefrInfo.grammarRemaining === 0 ? "Ôn lại" : "Học bài tiếp"}
            onAction={() => onNavigate?.("grammar")}
          />
          <CriterionCard
            done={cefrInfo.cardsRemaining === 0}
            icon={Layers}
            iconClass="text-sky-500"
            title="Kho từ vựng cốt lõi"
            value={`${cefrInfo.cardsMastered}/${cefrInfo.targetCards}`}
            unit="từ"
            hint={cefrInfo.cardsRemaining === 0 ? "Đã đủ vốn từ chuẩn" : `Còn thiếu ${cefrInfo.cardsRemaining} từ`}
            cta={cefrInfo.cardsRemaining === 0 ? "Mở kho từ" : "Học từ mới"}
            onAction={() => onNavigate?.("vocabulary")}
          />
          <CriterionCard
            done={cefrInfo.vstepReached}
            icon={Award}
            iconClass="text-rose-500"
            title="Điểm VSTEP thực chiến"
            value={cefrInfo.vstepBest ? Number(cefrInfo.vstepBest).toFixed(1) : "0.0"}
            unit="/ 10 điểm"
            hint={cefrInfo.vstepReached ? `Đã đạt ngưỡng ${cefrInfo.nextCefr}` : `Mục tiêu ≥ ${cefrInfo.targetVstep}`}
            cta={cefrInfo.vstepReached ? "Luyện đề nâng cao" : "Thi thử VSTEP"}
            onAction={() => onNavigate?.("vstep")}
          />
        </div>
      </section>

      {/* Kế hoạch hôm nay + phong độ */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        <TodayPlanCard cards={cards} target={target} goalToday={goalToday} streak={streak} onNavigate={onNavigate} />

        <section className="panel space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <TrendingUp size={14} className="text-[rgb(var(--accent))]" />
                Phong độ học tập
              </p>
              <h3 className="mt-0.5 font-display text-lg font-bold">Thống kê tổng quan</h3>
            </div>
            <button type="button" onClick={() => onNavigate?.("progress")} className="btn-secondary h-9 px-3 text-xs font-semibold">
              Chi tiết<ArrowRight size={13} />
            </button>
          </div>

          <StudyHistoryChart days={14} />

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <StatTile icon={Layers} color="#0EA5E9" label="Từ vựng đã thuộc" value={`${stats.cards.mastered}/${stats.cards.total}`} />
            <StatTile icon={GraduationCap} color="#8B5CF6" label="Ngữ pháp đã qua" value={`${stats.grammar.passed}/${stats.grammar.total}`} />
            <StatTile icon={Award} color="#F43F5E" label="Đề thi VSTEP" value={`${stats.vstep.attempts} đề`} />
            <StatTile icon={Trophy} color="#10B981" label="Độ chính xác" value={`${stats.accuracy}%`} />
          </div>
        </section>
      </div>

      {/* Gợi ý nhỏ ở cuối trang */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 text-xs text-slate-500 backdrop-blur-md dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-slate-400">
        <span className="inline-flex items-center gap-2">
          <BookOpen size={14} className="text-[rgb(var(--accent))]" />
          Mẹo: nhấn <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold dark:border-white/15 dark:bg-white/10">Ctrl</kbd> + <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold dark:border-white/15 dark:bg-white/10">K</kbd> để tìm nhanh bất kỳ bài học nào.
        </span>
        <span className="font-semibold">Tiến bộ 1% mỗi ngày là đủ.</span>
      </div>
    </div>
  );
}
