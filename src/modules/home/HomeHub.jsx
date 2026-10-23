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
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/60 p-2.5 backdrop-blur-md dark:border-white/[0.06] dark:bg-white/[0.02]">
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${color}18`, color }}
      >
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="metric text-sm leading-tight text-slate-900 dark:text-white">{value}</p>
        <p className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">{label}</p>
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
          className="btn-primary min-h-[52px] justify-start px-4 text-left disabled:cursor-wait disabled:opacity-70"
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
          className="btn-secondary min-h-[52px] justify-start px-4 text-left"
        >
          <Plus size={18} className="shrink-0" />
          <span className="min-w-0">
            <span className="block text-sm font-bold">Tạo bộ từ mới / Nhập thẻ</span>
            <span className="mt-0.5 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Tự đặt tên bộ và thêm từ của bạn</span>
          </span>
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
      title: "Ngữ pháp trọng điểm",
      value: `${grammarPassed}/${targetGrammar}`,
      unit: "bài",
      percent: Math.min(100, Math.round((grammarPassed / targetGrammar) * 100)),
      done: grammarPassed >= targetGrammar,
      icon: GraduationCap,
      action: grammarPassed >= targetGrammar ? "Ôn lại" : "Học bài tiếp",
      destination: "grammar",
    },
    {
      title: "Kho từ vựng cốt lõi",
      value: `${cardsMastered}/${targetCards}`,
      unit: "từ",
      percent: Math.min(100, Math.round((cardsMastered / targetCards) * 100)),
      done: cardsMastered >= targetCards,
      icon: Layers,
      action: cardsMastered >= targetCards ? "Mở kho từ" : "Học từ mới",
      destination: "vocabulary",
    },
    {
      title: "Điểm VSTEP thực chiến",
      value: vstepBest.toFixed(1),
      unit: `/ 10đ (mục tiêu ≥ ${targetVstep.toFixed(1)})`,
      percent: Math.min(100, Math.round((vstepBest / targetVstep) * 100)),
      done: vstepBest >= targetVstep,
      icon: Award,
      action: vstepBest >= targetVstep ? "Luyện đề" : "Thi thử VSTEP",
      destination: "vstep",
    },
  ];
  const completed = criteria.filter((criterion) => criterion.done).length;
  const progressPercent = Math.round(criteria.reduce((total, criterion) => total + criterion.percent, 0) / criteria.length);

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Lộ trình chuẩn hóa</p>
          <h3 className="mt-0.5 font-display text-base font-bold text-slate-900 dark:text-white">
            Mục tiêu bậc {nextLevel.id} · {nextLevel.label}
          </h3>
        </div>
        <span className="chip border border-indigo-500/25 bg-indigo-500/10 font-mono text-[11px] font-bold text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300">
          {completed}/3 tiêu chí · {progressPercent}%
        </span>
      </div>

      {/* Stepper thang bậc CEFR */}
      <div className="mt-3.5 rounded-xl border border-slate-200/70 bg-white/60 p-2.5 backdrop-blur-xs dark:border-white/[0.06] dark:bg-white/[0.02]">
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
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] font-black transition-transform ${
                      isCurrent
                        ? "scale-105 border-2 border-emerald-600 bg-emerald-600 text-white shadow-xs"
                        : isTarget
                          ? "border-2 border-indigo-500/40 bg-indigo-500/15 text-indigo-700 dark:text-indigo-200"
                          : isPast
                            ? "border border-emerald-600/30 bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"
                            : "bg-slate-100 text-slate-500 dark:bg-white/[0.05] dark:text-slate-400"
                    }`}
                  >
                    {level.id}
                  </span>
                  <div className={`h-1 flex-1 rounded-full ${index === CEFR_LEVELS.length - 1 ? "invisible" : index < currentLevelIndex ? "bg-emerald-500" : index === currentLevelIndex ? "bg-gradient-to-r from-emerald-500 to-indigo-500" : "bg-slate-200 dark:bg-white/10"}`} />
                </div>
                <span className={`mt-1 text-[9px] font-bold ${
                  isCurrent ? "text-emerald-700 dark:text-emerald-300" : isTarget ? "text-indigo-700 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500"
                }`}>
                  {isCurrent ? "Hiện tại" : isTarget ? "Mục tiêu" : level.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Tiêu chí dạng thanh tiến độ ngang gọn gàng */}
      <div className="mt-3.5 space-y-2.5">
        {criteria.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-2.5 backdrop-blur-xs transition-colors hover:border-slate-300/80 dark:border-white/[0.06] dark:bg-white/[0.02]"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                item.done
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
              }`}>
                {item.done ? <CheckCircle2 size={16} /> : <item.icon size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                  <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                    {item.value} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[rgb(var(--accent))] transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.(item.destination)}
              className="btn-secondary h-7 shrink-0 px-2.5 text-[11px] font-semibold"
            >
              {item.action} <ArrowRight size={11} />
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
      {/* Hero Banner: Tinh gọn, rõ trọng tâm học hôm nay */}
      <section className="home-hero relative overflow-hidden rounded-[24px] border border-slate-200/80 p-5 text-slate-900 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:text-white sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(var(--accent),0.12)] blur-3xl dark:bg-[rgba(var(--accent),0.18)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[rgba(var(--accent-2),0.10)] blur-3xl" aria-hidden="true" />
        <div className="surface-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {greetingByHour()}{displayName ? `, ${displayName}` : ""}
            </p>
            <h2 className="mt-1 font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-[1.75rem]">
              Hôm nay mình học gì?
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Kiên trì ôn tập mỗi ngày để tiến bộ tự nhiên và vững chắc.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={primaryAction}
                disabled={cardsLoading}
                className="btn-primary min-h-[44px] px-4 text-xs font-bold shadow-md disabled:cursor-wait disabled:opacity-70"
              >
                {cardsLoading ? <LoaderCircle size={15} className="animate-spin" /> : <PlayCircle size={15} />}
                {primaryLabel}
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("grammar")}
                className="btn-secondary min-h-[44px] px-3.5 text-xs font-semibold"
              >
                <GraduationCap size={15} />
                Luyện ngữ pháp
              </button>
            </div>
          </div>

          {/* Ô tiến độ mục tiêu & chuỗi học */}
          <div className="w-full rounded-2xl border border-slate-200/80 bg-white/70 p-3.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05] sm:max-w-[260px]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Mục tiêu hôm nay</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{goalToday}/{target} lượt ôn</p>
              </div>
              <span className="metric text-lg text-slate-900 dark:text-white">{goalPercent}%</span>
            </div>
            <div
              className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10"
              role="progressbar"
              aria-label="Tiến độ mục tiêu hôm nay"
              aria-valuenow={goalPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[rgb(var(--accent))] transition-all" style={{ width: `${goalPercent}%` }} />
            </div>
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <Flame size={13} className="text-amber-500" />
              {streak?.currentStreak > 0 ? `Chuỗi ${streak.currentStreak} ngày học liên tục` : "Bắt đầu chuỗi học hôm nay"}
            </p>
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
              <div>
                <p className="eyebrow flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[rgb(var(--accent))]" />
                  Phong độ học tập
                </p>
                <h3 className="mt-0.5 font-display text-base font-bold text-slate-900 dark:text-white">Thống kê 14 ngày</h3>
              </div>
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
              <StatTile icon={Layers} color="#0EA5E9" label="Từ vựng đã thuộc" value={`${stats.cards.mastered}/${stats.cards.total}`} />
              <StatTile icon={GraduationCap} color="#8B5CF6" label="Ngữ pháp đã qua" value={`${stats.grammar.passed}/${stats.grammar.total}`} />
              <StatTile icon={Award} color="#F43F5E" label="Đề thi VSTEP" value={`${stats.vstep.attempts} đề`} />
              <StatTile icon={Trophy} color="#10B981" label="Độ chính xác" value={`${stats.accuracy}%`} />
            </div>
          </section>
        </div>
      </div>

      {/* Mẹo nhỏ tinh gọn ở chân trang */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-2.5 text-xs text-slate-500 backdrop-blur-md dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-slate-400">
        <span className="inline-flex items-center gap-2">
          <BookOpen size={14} className="text-[rgb(var(--accent))]" />
          Nhấn <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold dark:border-white/15 dark:bg-white/10">Ctrl</kbd> + <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold dark:border-white/15 dark:bg-white/10">K</kbd> để tìm kiếm nhanh mọi bài học.
        </span>
        <span className="font-semibold text-slate-600 dark:text-slate-300">Tiến bộ 1% mỗi ngày là đủ.</span>
      </div>
    </div>
  );
}
