import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  Flame,
  GraduationCap,
  Layers,
  PlayCircle,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import StudyHistoryChart from "../../components/ui/StudyHistoryChart";
import TodayPlanCard from "../../components/TodayPlanCard";
import NavIcon from "../../components/ui/NavIcon";
import useCloudDoc from "../../hooks/useCloudDoc";
import useDailyGoal from "../../hooks/useDailyGoal";
import useGrammarProgress from "../../hooks/useGrammarProgress";
import useSkillsProgress from "../../hooks/useSkillsProgress";
import useVstepProgress from "../../hooks/useVstepProgress";
import { listeningLessons } from "../../data/skills/listening";
import { readingPassages } from "../../data/skills/reading";
import { navigationItems } from "../../data/navigation";
import { registry as vstepRegistry } from "../../data/vstep/metadata";
import { dataService } from "../../services/dataService";
import { getHistoryDays, loadHistory } from "../../services/historyService";
import { levelFor, summarize } from "../../services/gamification";
import { refreshRequestedEvent } from "../../services/syncStatus";
import { userDocKeys } from "../../services/userDocService";
import { toast } from "../../services/toast";

/** Các khu vực học hiện trên trang chủ (lấy icon + màu từ `navigationItems`). */
const AREA_IDS = ["vocabulary", "grammar", "skills", "vstep", "writing", "progress"];

const AREA_METADATA = {
  vocabulary: {
    badge: "1.000+ từ",
    teaser: "1.000 từ cốt lõi · Lật thẻ SRS 3D · Phát âm chuẩn IPA",
  },
  grammar: {
    badge: "30+ bài",
    teaser: "Lộ trình A1–C1 · 12 thì & cấu trúc · Trắc nghiệm & Sơ đồ cây",
  },
  skills: {
    badge: "4 kỹ năng",
    teaser: "Luyện Nghe, Đọc, Nói có AI chấm phản xạ · Luyện câu đa dạng",
  },
  vstep: {
    badge: "10 đề thi",
    teaser: "Bộ đề 4 kỹ năng chuẩn B1–C1 · Hướng dẫn giải & chấm điểm chi tiết",
  },
  writing: {
    badge: "AI Chữa bài",
    teaser: "Phân tích ngữ pháp, chỉ rõ lỗi sai & câu mẫu nâng cấp điểm số",
  },
  progress: {
    badge: "Thành tựu",
    teaser: "Theo dõi cấp bậc XP · Chuỗi ngày liên tiếp & Bộ sưu tập huy hiệu",
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

const greetingByHour = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Chào buổi sáng";
  if (hour < 14) return "Chào buổi trưa";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

function StatTile({ icon: Icon, color, label, value, note }) {
  return (
    <div className="panel flex items-start gap-3 p-3.5">
      <NavIcon icon={Icon} color={color} size="sm" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-ink/60 dark:text-white/60">{label}</p>
        <p className="metric text-xl">{value}</p>
        {note && <p className="mt-0.5 text-xs text-ink/50 dark:text-white/50">{note}</p>}
      </div>
    </div>
  );
}

/**
 * Trang chủ kiểu Duolingo: lời chào + chuỗi ngày + cấp độ + mục tiêu ngày,
 * các khu vực học (từ vựng, ngữ pháp, kỹ năng, VSTEP…), gợi ý “hôm nay học gì”
 * và bảng tổng quan tiến độ.
 */
export default function HomeHub({ user, streak, onNavigate }) {
  const { progress: grammarProgress, total: grammarTotal } = useGrammarProgress();
  const { progress: skillsProgress } = useSkillsProgress();
  const { attempts: vstepAttempts } = useVstepProgress();
  const { target } = useDailyGoal();
  const { value: writingDoc } = useCloudDoc(userDocKeys.writing, { initial: {} });
  const [days, setDays] = useState(() => getHistoryDays());
  const [cards, setCards] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

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
    return () => {
      active = false;
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
  const { stats, xp, level, achievements } = summary;
  const earnedCount = achievements.filter((achievement) => achievement.earned).length;
  const goalToday = stats.goal.today;
  const goalPercent = target ? Math.min(100, Math.round((goalToday / target) * 100)) : 0;

  // Tiến độ từng khu vực học cho lưới thẻ (thanh mini + nhãn “x/y • %”).
  const areaStats = useMemo(() => {
    const build = (done, total, unit) => {
      if (total <= 0) return { percent: 0, label: `Chưa có ${unit}` };
      const percent = Math.min(100, Math.round((done / total) * 1000) / 10);
      return { percent, label: `${done}/${total} ${unit} • ${percent}%` };
    };
    const skillsDone = stats.skills.listening + stats.skills.reading;
    const vstepDone = new Set(vstepAttempts.map((attempt) => attempt.examId).filter(Boolean)).size;
    return {
      vocabulary: build(stats.cards.mastered, stats.cards.total, "từ"),
      grammar: build(stats.grammar.passed, stats.grammar.total, "bài"),
      skills: build(skillsDone, listeningLessons.length + readingPassages.length, "bài"),
      vstep: build(vstepDone, vstepRegistry.length, "đề"),
      writing: writingDoc?.result
        ? { percent: 100, label: "Đã chấm 1 bài • 100%" }
        : { percent: 0, label: "Chưa có bài nào được chấm" },
      progress: build(earnedCount, achievements.length, "huy hiệu"),
    };
  }, [stats, earnedCount, achievements, vstepAttempts, writingDoc]);
  const displayName = (user?.displayName || "").trim().split(" ").slice(-1)[0];
  const areas = AREA_IDS.map((id) => navigationItems.find((item) => item.id === id)).filter(Boolean);

  const nextLevelTitle = useMemo(() => {
    if (!level?.nextAt) return null;
    return levelFor(level.nextAt)?.title || null;
  }, [level?.nextAt]);

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
    const criteriaPercent = Math.round((criteriaCompletedCount / 3) * 100);
    const currentLevelIndex = CEFR_LADDER.findIndex((lvl) => lvl.id === currentCefr);
    const nextLevelIndex = CEFR_LADDER.findIndex((lvl) => lvl.id === nextCefr);

    return {
      currentCefr,
      currentCefrLabel,
      nextCefr,
      nextCefrLabel,
      currentLevelIndex,
      nextLevelIndex,
      targetGrammar,
      targetCards,
      targetVstep,
      targetVstepScore,
      cardsRemaining,
      grammarRemaining,
      vstepReached,
      cardsMastered,
      grammarPassed,
      vstepBest,
      criteriaCompletedCount,
      criteriaPercent,
    };
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Hero Banner: Không gian Chào Mừng & Động Lực Học Tập */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 text-white shadow-xl backdrop-blur-2xl sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Cột Trái: Lời chào, Sứ mệnh & Nút hành động nhanh */}
          <div className="min-w-0 max-w-xl flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-bold text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
              {greetingByHour()}{displayName ? `, ${displayName}` : ''} • Hôm nay
            </div>

            <h2 className="mt-3 font-display text-2xl font-black tracking-tight sm:text-4xl sm:leading-tight">
              Học đều đặn. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">Bứt phá mỗi ngày.</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Xây dựng thói quen tiếng Anh vững chắc theo chu kỳ ghi nhớ khoa học, từ từ vựng cốt lõi đến kỹ năng phản xạ VSTEP.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate?.("vocabulary")}
                className="btn-primary min-h-[44px] px-5 text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlayCircle size={16} />Ôn từ vựng ngay
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("grammar")}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98]"
              >
                <GraduationCap size={16} />Bài ngữ pháp
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("vstep")}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98]"
              >
                <Award size={16} />Luyện VSTEP
              </button>
            </div>
          </div>

          {/* Cột Phải: Thẻ Nhịp Điệu & Mục Tiêu Ngày */}
          <div className="w-full lg:max-w-xs xl:max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white backdrop-blur-md shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                  <Flame size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chuỗi ngày</p>
                  <p className="font-display text-sm font-bold text-white">
                    {stats.streak.current > 0 ? `${stats.streak.current} ngày liên tiếp` : 'Chưa kích hoạt'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cấp độ</p>
                <p className="font-mono text-sm font-bold text-indigo-300">Cấp {level.level} ({xp} XP)</p>
                {nextLevelTitle && (
                  <p className="truncate text-[10px] text-slate-400" title={`Cấp kế tiếp: ${nextLevelTitle}`}>
                    Tiếp: {nextLevelTitle}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-1.5"><Target size={14} className="text-emerald-400" />Mục tiêu hôm nay</span>
                <span className="font-mono text-emerald-300">{goalToday}/{target} lượt ôn</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${goalPercent}%`, background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))' }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>{goalPercent >= 100 ? '🎉 Đạt mục tiêu ngày!' : `Còn ${Math.max(0, target - goalToday)} lượt ôn`}</span>
                <span className="font-mono font-bold text-slate-300">{goalPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lộ Trình Thăng Bậc CEFR: Độc lập, Rõ ràng & Trực quan */}
      <section className="panel overflow-hidden p-5 sm:p-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-emerald-500/[0.04] backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-black text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30">
                Bậc hiện tại: {cefrInfo.currentCefr}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {cefrInfo.currentCefrLabel.replace(/\s*\(.*?\)/, "")}
              </span>
              <span className="text-slate-400 text-xs">➔</span>
              <span className="rounded-lg bg-indigo-500/15 px-2.5 py-0.5 font-mono text-xs font-black text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/30">
                Mục tiêu thăng bậc: {cefrInfo.nextCefr}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {cefrInfo.nextCefrLabel.replace(/\s*\(.*?\)/, "")}
              </span>
            </div>
            <h3 className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">
              Lộ trình nâng cấp lên Bậc {cefrInfo.nextCefr} ({cefrInfo.nextCefrLabel})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="chip bg-indigo-50 font-mono text-xs font-bold text-indigo-600 dark:bg-white/10 dark:text-indigo-400">
              {cefrInfo.criteriaCompletedCount}/3 tiêu chí đạt chuẩn ({cefrInfo.criteriaPercent}%)
            </span>
          </div>
        </div>

        {/* Thước đo mốc CEFR Stepper trực quan */}
        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/60 p-3.5 backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.02]">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 sm:pb-0">
            {CEFR_LADDER.map((step, idx) => {
              const isPast = idx < cefrInfo.currentLevelIndex;
              const isCurrent = idx === cefrInfo.currentLevelIndex;
              const isTarget = idx === cefrInfo.nextLevelIndex;
              return (
                <div key={step.id} className="flex min-w-[64px] flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <div className={`h-1 flex-1 rounded-full ${idx === 0 ? 'invisible' : idx <= cefrInfo.currentLevelIndex ? 'bg-emerald-500' : idx === cefrInfo.nextLevelIndex ? 'bg-indigo-300 dark:bg-indigo-700' : 'bg-slate-200 dark:bg-white/10'}`} />
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl font-mono text-xs font-black transition-all ${
                        isCurrent
                          ? 'border-2 border-emerald-400 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-110'
                          : isTarget
                          ? 'border-2 border-indigo-400 bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 scale-105'
                          : isPast
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-100 text-slate-400 dark:bg-white/[0.05] dark:text-slate-500'
                      }`}
                    >
                      {step.id}
                    </span>
                    <div className={`h-1 flex-1 rounded-full ${idx === CEFR_LADDER.length - 1 ? 'invisible' : idx < cefrInfo.currentLevelIndex ? 'bg-emerald-500' : idx === cefrInfo.currentLevelIndex ? 'bg-gradient-to-r from-emerald-500 to-indigo-400' : 'bg-slate-200 dark:bg-white/10'}`} />
                  </div>
                  <span className={`mt-1.5 text-[11px] font-bold ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : isTarget ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`}>
                    {isCurrent ? 'Hiện tại' : isTarget ? 'Mục tiêu' : step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Thanh tiến độ tiêu chí */}
        <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-500"
            style={{ width: `${cefrInfo.criteriaPercent}%` }}
          />
        </div>

        {/* 3 Trụ Cột Điều Kiện Thăng Hạng */}
        <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
          {/* Trụ 1: Ngữ Pháp */}
          <div
            className={`flex flex-col justify-between rounded-2xl p-4 transition-all border ${
              cefrInfo.grammarRemaining === 0
                ? "border-emerald-500/30 bg-emerald-500/[0.06] dark:bg-emerald-500/10"
                : "border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <GraduationCap size={16} className="text-violet-500" />
                  Ngữ pháp trọng điểm
                </span>
                {cefrInfo.grammarRemaining === 0 ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Circle size={16} className="text-slate-400" />
                )}
              </div>
              <div className="mt-3 font-mono text-xl font-black text-slate-900 dark:text-white">
                {cefrInfo.grammarPassed}/{cefrInfo.targetGrammar}
                <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">bài học</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {cefrInfo.grammarRemaining === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Đã đủ tiêu chuẩn ngữ pháp</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Còn thiếu {cefrInfo.grammarRemaining} bài</span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("grammar")}
              className="mt-4 btn-secondary w-full justify-center text-xs h-9 font-bold"
            >
              {cefrInfo.grammarRemaining === 0 ? "Ôn lại ngữ pháp" : "Học bài tiếp theo"} <ArrowRight size={13} />
            </button>
          </div>

          {/* Trụ 2: Từ Vựng */}
          <div
            className={`flex flex-col justify-between rounded-2xl p-4 transition-all border ${
              cefrInfo.cardsRemaining === 0
                ? "border-emerald-500/30 bg-emerald-500/[0.06] dark:bg-emerald-500/10"
                : "border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Layers size={16} className="text-sky-500" />
                  Kho từ vựng cốt lõi
                </span>
                {cefrInfo.cardsRemaining === 0 ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Circle size={16} className="text-slate-400" />
                )}
              </div>
              <div className="mt-3 font-mono text-xl font-black text-slate-900 dark:text-white">
                {cefrInfo.cardsMastered}/{cefrInfo.targetCards}
                <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">từ đã thuộc</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {cefrInfo.cardsRemaining === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Đã đủ vốn từ vựng chuẩn</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Còn thiếu {cefrInfo.cardsRemaining} từ vựng</span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("vocabulary")}
              className="mt-4 btn-secondary w-full justify-center text-xs h-9 font-bold"
            >
              {cefrInfo.cardsRemaining === 0 ? "Mở kho từ" : "Nạp từ vựng"} <ArrowRight size={13} />
            </button>
          </div>

          {/* Trụ 3: VSTEP */}
          <div
            className={`flex flex-col justify-between rounded-2xl p-4 transition-all border ${
              cefrInfo.vstepReached
                ? "border-emerald-500/30 bg-emerald-500/[0.06] dark:bg-emerald-500/10"
                : "border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Award size={16} className="text-rose-500" />
                  Điểm VSTEP thực chiến
                </span>
                {cefrInfo.vstepReached ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Circle size={16} className="text-slate-400" />
                )}
              </div>
              <div className="mt-3 font-mono text-xl font-black text-slate-900 dark:text-white">
                {cefrInfo.vstepBest ? Number(cefrInfo.vstepBest).toFixed(1) : "0.0"}
                <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">/ 10 điểm</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {cefrInfo.vstepReached ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Đã đạt ngưỡng Bậc {cefrInfo.nextCefr}</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">Mục tiêu ≥ {cefrInfo.targetVstep} ({cefrInfo.targetVstepScore}đ)</span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("vstep")}
              className="mt-4 btn-secondary w-full justify-center text-xs h-9 font-bold"
            >
              {cefrInfo.vstepReached ? "Luyện đề nâng cao" : "Thi thử VSTEP"} <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid: Khu vực học tập chính */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Khu vực học tập
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            6 phân khu kiến thức cốt lõi
          </span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const stat = areaStats[area.id] || { percent: 0, label: "" };
            const meta = AREA_METADATA[area.id] || { badge: "", teaser: area.description };
            const Icon = area.icon;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onNavigate?.(area.id)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-left shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.15)] dark:border-white/[0.08] dark:bg-[#111827]/70 dark:hover:border-indigo-500/50 dark:hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5)]"
              >
                <div>
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border shadow-sm transition-transform duration-200 group-hover:scale-105"
                        style={{
                          backgroundColor: `${area.color}15`,
                          borderColor: `${area.color}35`,
                          color: area.color,
                        }}
                      >
                        <Icon size={22} strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-display text-sm font-bold text-slate-900 dark:text-white">{area.label}</p>
                          <ArrowRight size={13} className="text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 dark:text-slate-500" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{area.description}</p>
                      </div>
                    </div>
                    {meta.badge && (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: `${area.color}15`,
                          color: area.color,
                          border: `1px solid ${area.color}35`,
                        }}
                      >
                        {meta.badge}
                      </span>
                    )}
                  </div>

                  <p className="relative z-10 mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                    {meta.teaser}
                  </p>
                </div>

                <div className="relative z-10 mt-4 border-t border-slate-100 pt-2.5 dark:border-white/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>{stat.label}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{stat.percent}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${stat.percent}%`, backgroundColor: area.color }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2 Cột Đối Xứng: Kế Hoạch Hôm Nay & Biểu Đồ Phong Độ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Cột 1: Kế Hoạch & Gợi Ý Hành Động Hôm Nay */}
        <div>
          <TodayPlanCard cards={cards} target={target} goalToday={goalToday} streak={streak} onNavigate={onNavigate} />
        </div>

        {/* Cột 2: Biểu Đồ Phong Độ & Chỉ Số Tổng Quan */}
        <section className="panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="eyebrow flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-500" />
              Phong độ học tập &amp; Thống kê
            </p>
            <button type="button" onClick={() => onNavigate?.("progress")} className="btn-secondary h-8 px-3 text-xs font-semibold">
              Chi tiết<ArrowRight size={13} />
            </button>
          </div>

          <StudyHistoryChart days={14} />

          {/* Lưới 4 chỉ số tổng quan cốt lõi */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
            <StatTile icon={Layers} color="#0EA5E9" label="Từ vựng đã thuộc" value={`${stats.cards.mastered}/${stats.cards.total}`} />
            <StatTile icon={GraduationCap} color="#8B5CF6" label="Ngữ pháp đã qua" value={`${stats.grammar.passed}/${stats.grammar.total}`} />
            <StatTile icon={Award} color="#F43F5E" label="Đề thi VSTEP" value={`${stats.vstep.attempts} đề`} />
            <StatTile icon={Trophy} color="#10B981" label="Độ chính xác" value={`${stats.accuracy}%`} />
          </div>
        </section>
      </div>
    </div>
  );
}
