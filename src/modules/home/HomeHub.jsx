import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Flame,
  GraduationCap,
  Headphones,
  Layers,
  LoaderCircle,
  PenLine,
  PlayCircle,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import StudyHistoryChart from "../../components/ui/StudyHistoryChart";
import useDailyGoal from "../../hooks/useDailyGoal";
import useGrammarProgress from "../../hooks/useGrammarProgress";
import useVstepProgress from "../../hooks/useVstepProgress";
import useVocabularyCards from "../../hooks/useVocabularyCards";
import { openItem } from "../../services/deepLink";
import { getHistoryDays, historyChangedEvent, loadHistory } from "../../services/historyService";
import { computeStats } from "../../services/gamification";
import { toast } from "../../services/toast";

const CEFR_LEVELS = [
  { id: "A1", label: "Vỡ lòng" },
  { id: "A2", label: "Sơ cấp" },
  { id: "B1", label: "Trung cấp" },
  { id: "B2", label: "Trung cấp trên" },
  { id: "C1", label: "Cao cấp" },
  { id: "C2", label: "Thành thạo" },
];

const greetingByHour = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Chào buổi sáng";
  if (hour < 14) return "Chào buổi trưa";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

function FirstRunCard({ busy, onStarterPack, onCreateDeck }) {
  return (
    <section className="panel relative overflow-hidden p-5 sm:p-6" aria-labelledby="first-run-title">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden="true" />
      <div className="relative flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-indigo-500/25 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
          <BookOpen size={21} />
        </span>
        <div className="min-w-0">
          <h3 id="first-run-title" className="font-display text-base font-bold text-slate-900 dark:text-white">
            Thư viện từ vựng đang trống
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Chọn cách bắt đầu để thêm từ vựng vào tài khoản.
          </p>
        </div>
      </div>
      <div className="relative mt-4 grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={onStarterPack}
          disabled={busy}
          className="btn-primary min-h-[44px] justify-start px-4 text-xs font-bold disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? <LoaderCircle size={16} className="shrink-0 animate-spin" /> : <Sparkles size={16} className="shrink-0" />}
          <span>Nạp 50 từ khởi đầu (A1)</span>
        </button>
        <button
          type="button"
          onClick={onCreateDeck}
          className="btn-secondary min-h-[44px] justify-start px-4 text-xs font-semibold"
        >
          <Plus size={16} className="shrink-0" />
          <span>Tạo bộ từ mới / Nhập thẻ</span>
        </button>
      </div>
    </section>
  );
}

function CefrProgressCard({ stats, onNavigate }) {
  const vstepBest = Number(stats.vstep.best) || 0;
  const grammarPassed = Number(stats.grammar.passed) || 0;
  const cardsMastered = Number(stats.cards.mastered) || 0;
  let currentLevel = "A2";
  let targetGrammar = 5;
  let targetCards = 50;
  let targetVstep = 4;

  if (vstepBest >= 8.5 || (grammarPassed >= 25 && cardsMastered >= 500)) {
    currentLevel = "C1";
    targetGrammar = 30;
    targetCards = 1000;
    targetVstep = 9.5;
  } else if (vstepBest >= 6 || (grammarPassed >= 15 && cardsMastered >= 200)) {
    currentLevel = "B2";
    targetGrammar = 25;
    targetCards = 500;
    targetVstep = 8.5;
  } else if (vstepBest >= 4 || (grammarPassed >= 5 && cardsMastered >= 50)) {
    currentLevel = "B1";
    targetGrammar = 15;
    targetCards = 200;
    targetVstep = 6;
  }

  const currentLevelIndex = CEFR_LEVELS.findIndex((level) => level.id === currentLevel);
  const nextLevel = CEFR_LEVELS[Math.min(currentLevelIndex + 1, CEFR_LEVELS.length - 1)];
  const criteria = [
    {
      title: "Ngữ pháp",
      value: `${grammarPassed}/${targetGrammar}`,
      unit: "bài",
      percent: Math.min(100, Math.round((grammarPassed / targetGrammar) * 100)),
      done: grammarPassed >= targetGrammar,
      icon: GraduationCap,
      action: grammarPassed >= targetGrammar ? "Ôn lại" : "Học",
      destination: "grammar",
    },
    {
      title: "Từ vựng",
      value: `${cardsMastered}/${targetCards}`,
      unit: "từ",
      percent: Math.min(100, Math.round((cardsMastered / targetCards) * 100)),
      done: cardsMastered >= targetCards,
      icon: Layers,
      action: cardsMastered >= targetCards ? "Mở kho" : "Học",
      destination: "vocabulary",
    },
    {
      title: "Điểm VSTEP",
      value: vstepBest.toFixed(1),
      unit: "/ 10",
      percent: Math.min(100, Math.round((vstepBest / targetVstep) * 100)),
      done: vstepBest >= targetVstep,
      icon: Award,
      action: vstepBest >= targetVstep ? "Luyện đề" : "Thi thử",
      destination: "vstep",
    },
  ];
  const completed = criteria.filter((criterion) => criterion.done).length;
  const progressPercent = Math.round(criteria.reduce((total, criterion) => total + criterion.percent, 0) / criteria.length);

  return (
    <section className="panel p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Lộ trình CEFR</p>
          <h3 className="mt-0.5 font-display text-base font-black text-slate-900 sm:text-lg dark:text-white">
            {currentLevel} → {nextLevel.id} · {nextLevel.label}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{completed}/3 tiêu chí</span>
          <span className="font-mono text-base font-black text-indigo-600 sm:text-lg dark:text-indigo-400">{progressPercent}%</span>
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        Đạt 3 tiêu chí để lên {nextLevel.id}
      </p>

      <div className="mt-2.5 sm:mt-3 divide-y divide-slate-100 dark:divide-white/[0.06]">
        {criteria.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onNavigate?.(item.destination)}
            className="group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors active:bg-slate-100/70 sm:gap-3 sm:py-2.5 dark:active:bg-white/[0.05]"
          >
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
              item.done
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400"
            }`}>
              {item.done ? <CheckCircle2 size={16} /> : <item.icon size={16} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                <span className="shrink-0 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  {item.value} <span className="font-normal text-slate-400">{item.unit}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.done ? "bg-emerald-500" : "bg-indigo-500/80"}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
            <ArrowRight size={14} className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default function HomeHub({ user, streak, onNavigate }) {
  const { target } = useDailyGoal();
  const { progress: grammarProgress, total: grammarTotal } = useGrammarProgress();
  const { attempts: vstepAttempts } = useVstepProgress();
  const { cards, loading: cardsLoading, reload: reloadCards } = useVocabularyCards({ user });
  const [days, setDays] = useState(() => getHistoryDays());
  const [starterBusy, setStarterBusy] = useState(false);
  const displayName = (user?.displayName || "").trim().split(" ").slice(-1)[0];
  const stats = useMemo(
    () => computeStats({
      days,
      streak,
      cards,
      grammar: { ...grammarProgress, total: grammarTotal },
      goal: { target },
      vstep: { attempts: vstepAttempts },
    }),
    [days, streak, cards, grammarProgress, grammarTotal, target, vstepAttempts],
  );
  const goalToday = stats.goal.today;
  const goalPercent = target ? Math.min(100, Math.round((goalToday / target) * 100)) : 0;
  const dueCount = stats.cards.due;
  const freshCount = stats.cards.fresh;
  const primaryLabel = cardsLoading
    ? "Đang tải thư viện…"
    : dueCount > 0
      ? `Ôn ${Math.min(dueCount, 50)} thẻ đến hạn`
      : freshCount > 0
        ? "Học từ mới"
        : cards.length === 0
          ? "Khám phá từ vựng"
          : "Học ngữ pháp";
  const primaryAction = dueCount > 0
    ? () => {
      openItem({ tab: "vocabulary", type: "practice" });
      onNavigate?.("vocabulary");
    }
    : () => onNavigate?.(cards.length === 0 || freshCount > 0 ? "vocabulary" : "grammar");

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

  const handleStarterPack = async () => {
    if (starterBusy) return;
    setStarterBusy(true);
    try {
      const { createStarterPackDeck } = await import("../../services/starterPackService");
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

  const quickModules = [
    {
      id: "vocabulary",
      label: "Từ vựng SRS",
      desc: dueCount > 0 ? `${dueCount} thẻ đến hạn` : "Thẻ nhớ lặp lại",
      icon: BookOpen,
      color: "#0284c7",
      badge: dueCount > 0 ? `${dueCount} thẻ` : null,
    },
    {
      id: "grammar",
      label: "Ngữ pháp",
      desc: "30 chủ điểm",
      icon: GraduationCap,
      color: "#7c3aed",
      badge: `${grammarProgress.passed || 0}/30`,
    },
    {
      id: "skills",
      label: "4 Kỹ năng",
      desc: "Nghe · Nói · Đọc · Viết",
      icon: Headphones,
      color: "#0891b2",
    },
    {
      id: "vstep",
      label: "Thi VSTEP",
      desc: "Đề B1–C1",
      icon: Award,
      color: "#e11d48",
    },
    {
      id: "writing",
      label: "Sửa bài AI",
      desc: "Chấm điểm & sửa câu",
      icon: PenLine,
      color: "#d97706",
    },
    {
      id: "planner",
      label: "Kế hoạch",
      desc: "Lịch học & mục tiêu",
      icon: CalendarDays,
      color: "#9333ea",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Hero Banner: Aurora Glass Command Center */}
      <section className="home-hero relative overflow-hidden rounded-2xl border border-slate-200/80 p-4 text-slate-900 shadow-xl backdrop-blur-3xl dark:border-white/10 dark:text-white sm:rounded-[28px] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[rgba(var(--accent),0.20)] blur-3xl dark:bg-[rgba(var(--accent),0.25)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[rgba(14,165,233,0.15)] blur-3xl" aria-hidden="true" />
        <div className="surface-dots pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

        <div className="relative z-10 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {greetingByHour()}{displayName ? `, ${displayName}` : ""}
              </div>
              <div className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300 lg:hidden">
                <Flame size={12} className="text-amber-500" />
                <span>{streak?.currentStreak > 0 ? `${streak.currentStreak} ngày` : "0 ngày"}</span>
              </div>
            </div>

            <h2 className="mt-2 font-display text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              Hôm nay học gì?
            </h2>

            {/* Tiến độ mục tiêu tích hợp gọn gàng cho điện thoại */}
            <div className="mt-3 rounded-xl border border-slate-200/80 bg-white/70 p-3 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] lg:hidden">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">
                  Mục tiêu hôm nay: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{goalToday}/{target}</strong> lượt
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">{goalPercent}%</span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10"
                role="progressbar"
                aria-label="Tiến độ mục tiêu hôm nay"
                aria-valuenow={goalPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                {goalPercent >= 100 ? "Đã đạt mục tiêu hôm nay 🎉" : `Còn ${Math.max(0, target - goalToday)} lượt để hoàn thành`}
              </p>
            </div>

            {/* Nút hành động chính */}
            <div className="mt-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={primaryAction}
                disabled={cardsLoading}
                className="btn-primary min-h-[44px] w-full justify-center px-5 text-sm font-bold shadow-lg shadow-indigo-500/25 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {cardsLoading ? <LoaderCircle size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                <span>{primaryLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("grammar")}
                className="btn-secondary min-h-[44px] w-full justify-center px-4 text-sm font-bold sm:w-auto"
              >
                <GraduationCap size={18} />
                <span>Ngữ pháp</span>
              </button>
            </div>
          </div>

          {/* Ô tiến độ mục tiêu & chuỗi học (chỉ hiện trên desktop) */}
          <div className="hidden w-full rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] lg:block lg:max-w-[270px]">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mục tiêu hôm nay</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                <Flame size={12} className="text-amber-500" />
                {streak?.currentStreak > 0 ? `${streak.currentStreak} ngày` : "Bắt đầu"}
              </span>
            </div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="metric font-display text-2xl font-black text-slate-900 dark:text-white">
                {goalToday}<span className="text-sm font-normal text-slate-500"> / {target} lượt</span>
              </p>
              <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">{goalPercent}%</span>
            </div>
            <div
              className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10"
              role="progressbar"
              aria-label="Tiến độ mục tiêu hôm nay"
              aria-valuenow={goalPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-700" style={{ width: `${goalPercent}%` }} />
            </div>
            <p className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {goalPercent >= 100 ? "Đã đạt mục tiêu hôm nay 🎉" : `Còn ${Math.max(0, target - goalToday)} lượt để đạt mục tiêu`}
            </p>
          </div>
        </div>
      </section>

      {/* Lối tắt truy cập nhanh các mục học tập */}
      <section aria-label="Khám phá nhanh">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 sm:gap-3">
          {quickModules.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate?.(item.id)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white/70 p-3 text-left shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.08]"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                  style={{ backgroundColor: `${item.color}18`, color: item.color }}
                >
                  <item.icon size={16} />
                </span>
                {item.badge && (
                  <span
                    className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="mt-2.5 min-w-0">
                <p className="truncate font-display text-xs font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {!cardsLoading && cards.length === 0 && (
        <FirstRunCard busy={starterBusy} onStarterPack={handleStarterPack} onCreateDeck={openNewDeck} />
      )}

      {/* Bố cục 2 cột cân đối: Lộ trình CEFR & Phong độ học tập */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 sm:gap-5">
        {/* Cột trái: Lộ trình CEFR */}
        <div className="lg:col-span-7">
          <CefrProgressCard stats={stats} onNavigate={onNavigate} />
        </div>

        {/* Cột phải: Phong độ học tập 7-14 ngày & Chỉ số */}
        <div className="lg:col-span-5">
          <section className="panel space-y-3.5 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                <TrendingUp size={16} className="text-[rgb(var(--accent))]" />
                <span className="sm:hidden">Thống kê 7 ngày</span>
                <span className="hidden sm:inline">Thống kê 14 ngày</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigate?.("progress")}
                className="btn-secondary h-7 px-2.5 text-[11px] font-semibold"
              >
                Chi tiết <ArrowRight size={11} />
              </button>
            </div>

            <StudyHistoryChart days={14} />
          </section>
        </div>
      </div>
    </div>
  );
}
