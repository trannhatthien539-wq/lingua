import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Flame,
  GraduationCap,
  Layers,
  LoaderCircle,
  PlayCircle,
  Plus,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import StudyHistoryChart from "../../components/ui/StudyHistoryChart";
import useDailyGoal from "../../hooks/useDailyGoal";
import useGrammarProgress from "../../hooks/useGrammarProgress";
import useVstepProgress from "../../hooks/useVstepProgress";
import useVocabularyCards from "../../hooks/useVocabularyCards";
import { openItem } from "../../services/deepLink";
import { getHistoryDays, historyChangedEvent, loadHistory } from "../../services/historyService";
import { computeStats } from "../../services/gamification";
import { createStarterPackDeck } from "../../services/starterPackService";
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

function StatTile({ icon: Icon, color, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-white/20">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-xs"
        style={{
          background: `linear-gradient(135deg, ${color}25, ${color}10)`,
          border: `1px solid ${color}35`,
          color
        }}
      >
        <Icon size={18} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="metric text-base leading-tight text-slate-900 dark:text-white">{value}</p>
        <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
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
    <section className="panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-xs text-indigo-600 dark:text-indigo-400">Lộ trình trình độ</p>
          <h3 className="mt-1 font-display text-lg font-black text-slate-900 dark:text-white">
            Mục tiêu {nextLevel.id} · {nextLevel.label}
          </h3>
        </div>
        <span className="chip border border-indigo-500/30 bg-indigo-500/15 font-mono text-xs font-bold text-indigo-700 shadow-xs dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-300">
          {completed}/3 đạt · {progressPercent}%
        </span>
      </div>

      {/* Stepper thang bậc CEFR */}
      <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/70 p-3.5 backdrop-blur-md dark:border-white/[0.06] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between gap-1">
          {CEFR_LEVELS.map((level, index) => {
            const isPast = index < currentLevelIndex;
            const isCurrent = index === currentLevelIndex;
            const isTarget = index === currentLevelIndex + 1;
            return (
              <div key={level.id} className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <div className={`h-1 flex-1 rounded-full ${index === 0 ? "invisible" : index <= currentLevelIndex ? "bg-emerald-500" : "bg-slate-200 dark:bg-white/10"}`} />
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs font-black transition-all ${
                      isCurrent
                        ? "scale-110 border-2 border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                        : isTarget
                          ? "scale-105 border-2 border-indigo-500 bg-indigo-500/20 text-indigo-700 dark:text-indigo-200"
                          : isPast
                            ? "border border-emerald-600/30 bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-400 dark:bg-white/[0.05] dark:text-slate-500"
                    }`}
                  >
                    {level.id}
                  </span>
                  <div className={`h-1 flex-1 rounded-full ${index === CEFR_LEVELS.length - 1 ? "invisible" : index < currentLevelIndex ? "bg-emerald-500" : index === currentLevelIndex ? "bg-gradient-to-r from-emerald-500 to-indigo-500" : "bg-slate-200 dark:bg-white/10"}`} />
                </div>
                <span className={`mt-1.5 text-[10px] font-bold ${isCurrent ? "text-emerald-600 dark:text-emerald-400" : isTarget ? "text-indigo-600 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500"}`}>
                  {level.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Tiêu chí dạng thanh tiến độ ngang */}
      <div className="mt-4 space-y-3">
        {criteria.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-white/70 p-3 backdrop-blur-md transition-all hover:border-slate-300 hover:shadow-xs dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-white/15"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3.5">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-xs ${
                item.done
                  ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400"
                  : "bg-indigo-500/15 text-indigo-600 border border-indigo-500/30 dark:text-indigo-400"
              }`}>
                {item.done ? <CheckCircle2 size={18} /> : <item.icon size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    {item.value} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.(item.destination)}
              className="btn-secondary h-8 shrink-0 px-3 text-xs font-bold"
            >
              {item.action} <ArrowRight size={12} />
            </button>
          </div>
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

  return (
    <div className="space-y-5">
      {/* Hero Banner: Aurora Glass Command Center */}
      <section className="home-hero relative overflow-hidden rounded-[28px] border border-slate-200/80 p-6 text-slate-900 shadow-xl backdrop-blur-3xl dark:border-white/10 dark:text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[rgba(var(--accent),0.20)] blur-3xl dark:bg-[rgba(var(--accent),0.25)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[rgba(14,165,233,0.15)] blur-3xl" aria-hidden="true" />
        <div className="surface-dots pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              {greetingByHour()}{displayName ? `, ${displayName}` : ""}
            </div>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Hôm nay học gì?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Duy trì nhịp học mỗi ngày để đạt chuẩn CEFR và bứt phá mục tiêu của bạn.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={primaryAction}
                disabled={cardsLoading}
                className="btn-primary min-h-[48px] px-6 text-sm font-bold shadow-lg shadow-indigo-500/25 disabled:cursor-wait disabled:opacity-70"
              >
                {cardsLoading ? <LoaderCircle size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                <span>{primaryLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("grammar")}
                className="btn-secondary min-h-[48px] px-5 text-sm font-bold"
              >
                <GraduationCap size={18} />
                <span>Luyện ngữ pháp</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("vstep")}
                className="btn-secondary min-h-[48px] px-5 text-sm font-bold"
              >
                <Award size={18} />
                <span>Thi thử VSTEP</span>
              </button>
            </div>
          </div>

          {/* Ô tiến độ mục tiêu & chuỗi học */}
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] lg:max-w-[280px]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mục tiêu hôm nay</p>
                <p className="mt-1 font-display text-sm font-bold text-slate-900 dark:text-white">{goalToday} / {target} <span className="text-xs font-normal text-slate-500">lượt</span></p>
              </div>
              <span className="metric font-display text-2xl font-black text-indigo-600 dark:text-indigo-400">{goalPercent}%</span>
            </div>
            <div
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10"
              role="progressbar"
              aria-label="Tiến độ mục tiêu hôm nay"
              aria-valuenow={goalPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 transition-all duration-700" style={{ width: `${goalPercent}%` }} />
            </div>
            <div className="mt-3.5 flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-white/[0.08]">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Flame size={15} className="text-amber-500 animate-pulse" />
                {streak?.currentStreak > 0 ? `Chuỗi ${streak.currentStreak} ngày` : "Bắt đầu chuỗi"}
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {goalPercent >= 100 ? "Hoàn thành! 🎉" : "Đang tiến hành"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {!cardsLoading && cards.length === 0 && (
        <FirstRunCard busy={starterBusy} onStarterPack={handleStarterPack} onCreateDeck={openNewDeck} />
      )}

      {/* Bố cục 2 cột cân đối: Lộ trình CEFR & Phong độ học tập */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* Cột trái: Lộ trình CEFR */}
        <div className="lg:col-span-7">
          <CefrProgressCard stats={stats} onNavigate={onNavigate} />
        </div>

        {/* Cột phải: Phong độ học tập 14 ngày & Chỉ số */}
        <div className="lg:col-span-5">
          <section className="panel space-y-3.5 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900 dark:text-white">
                <TrendingUp size={16} className="text-[rgb(var(--accent))]" />
                Thống kê 14 ngày
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

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <StatTile icon={Layers} color="#0EA5E9" label="Đã thuộc" value={`${stats.cards.mastered}/${stats.cards.total}`} />
              <StatTile icon={GraduationCap} color="#8B5CF6" label="Ngữ pháp" value={`${stats.grammar.passed}/${stats.grammar.total}`} />
              <StatTile icon={Award} color="#F43F5E" label="Đề VSTEP" value={`${stats.vstep.attempts} đề`} />
              <StatTile icon={Trophy} color="#10B981" label="Chính xác" value={`${stats.accuracy}%`} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
