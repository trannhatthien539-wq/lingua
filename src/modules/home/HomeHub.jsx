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
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import StudyIllustration from "../../components/StudyIllustration";
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
  const [loading, setLoading] = useState(true);
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

    return {
      currentCefr,
      currentCefrLabel,
      nextCefr,
      nextCefrLabel,
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
      {/* Hero Banner: Clean & Compact Linear Aurora */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] p-4 text-white shadow-[0_20px_60px_-15px_rgba(99,102,241,0.2)] backdrop-blur-2xl sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between sm:gap-6">
          {/* Cột 1: Chào hỏi & Mục tiêu hôm nay */}
          <div className="min-w-0 max-w-md flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-bold text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
              {greetingByHour()}{displayName ? `, ${displayName}` : ''}
            </div>
            
            <h2 className="mt-2 font-display text-2xl font-black tracking-tight sm:text-3xl">
              Hôm nay học gì?
            </h2>

            <div className="mt-4 max-w-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-1.5"><Target size={14} className="text-emerald-400" />Mục tiêu hôm nay</span>
                <span className="font-mono text-emerald-300">{goalToday}/{target} lượt ôn</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 shadow-[0_0_12px_rgba(52,211,153,0.5)] transition-all duration-500" style={{ width: `${goalPercent}%` }} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate?.("vocabulary")}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-5 text-xs font-bold text-slate-950 shadow-[0_0_16px_rgba(52,211,153,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlayCircle size={16} />Ôn từ vựng
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("vstep")}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98]"
              >
                <Award size={16} />Luyện VSTEP
              </button>
            </div>
          </div>

          {/* Cột 2 (Giữa): Trình độ CEFR & Lộ trình lên cấp (Gọn gàng & Tinh tế) */}
          <div className="w-full flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-white backdrop-blur-md sm:p-3.5 lg:max-w-md xl:max-w-lg">
            {/* Dòng tiêu đề: Bậc hiện tại & Mục tiêu */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300 border border-emerald-500/30 text-[11px]">
                  Bậc {cefrInfo.currentCefr}
                </span>
                <span className="text-slate-300 text-[11px] sm:text-xs">
                  {cefrInfo.currentCefrLabel.replace(/\s*\(.*?\)/, "")}
                </span>
                <span className="text-slate-500 text-xs">→</span>
                <span className="font-bold text-indigo-300 text-[11px] sm:text-xs">
                  Mục tiêu {cefrInfo.nextCefr}
                </span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400">
                {cefrInfo.criteriaCompletedCount}/3 điều kiện
              </span>
            </div>

            {/* Thanh tiến độ mảnh */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-indigo-400 transition-all duration-500"
                style={{ width: `${cefrInfo.criteriaPercent}%` }}
              />
            </div>

            {/* 3 Thẻ điều kiện mini gọn gàng */}
            <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:gap-2">
              {/* 1. Ngữ pháp */}
              <button
                type="button"
                onClick={() => onNavigate?.("grammar")}
                className={`group flex flex-col justify-between rounded-xl p-1.5 sm:p-2 text-left transition-all ${
                  cefrInfo.grammarRemaining === 0
                    ? "bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15"
                    : "bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                  <span className="truncate">Ngữ pháp</span>
                  {cefrInfo.grammarRemaining === 0 ? (
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  ) : (
                    <ArrowRight size={11} className="text-slate-500 shrink-0 group-hover:text-white group-hover:translate-x-0.5 transition" />
                  )}
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-white">
                  {cefrInfo.grammarPassed}/{cefrInfo.targetGrammar}
                  <span className="text-[10px] font-normal text-slate-400 ml-0.5">bài</span>
                </div>
                <div className="mt-1 text-[10px] truncate">
                  {cefrInfo.grammarRemaining === 0 ? (
                    <span className="font-semibold text-emerald-400">Đã đạt ✓</span>
                  ) : (
                    <span className="font-medium text-amber-300 group-hover:text-amber-200">
                      Thiếu {cefrInfo.grammarRemaining} <span className="hidden sm:inline">bài</span> →
                    </span>
                  )}
                </div>
              </button>

              {/* 2. Từ vựng */}
              <button
                type="button"
                onClick={() => onNavigate?.("vocabulary")}
                className={`group flex flex-col justify-between rounded-xl p-1.5 sm:p-2 text-left transition-all ${
                  cefrInfo.cardsRemaining === 0
                    ? "bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15"
                    : "bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                  <span className="truncate">Từ vựng</span>
                  {cefrInfo.cardsRemaining === 0 ? (
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  ) : (
                    <ArrowRight size={11} className="text-slate-500 shrink-0 group-hover:text-white group-hover:translate-x-0.5 transition" />
                  )}
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-white">
                  {cefrInfo.cardsMastered}/{cefrInfo.targetCards}
                  <span className="text-[10px] font-normal text-slate-400 ml-0.5">từ</span>
                </div>
                <div className="mt-1 text-[10px] truncate">
                  {cefrInfo.cardsRemaining === 0 ? (
                    <span className="font-semibold text-emerald-400">Đã đạt ✓</span>
                  ) : (
                    <span className="font-medium text-amber-300 group-hover:text-amber-200">
                      Thiếu {cefrInfo.cardsRemaining} <span className="hidden sm:inline">từ</span> →
                    </span>
                  )}
                </div>
              </button>

              {/* 3. VSTEP */}
              <button
                type="button"
                onClick={() => onNavigate?.("vstep")}
                className={`group flex flex-col justify-between rounded-xl p-1.5 sm:p-2 text-left transition-all ${
                  cefrInfo.vstepReached
                    ? "bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15"
                    : "bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                  <span className="truncate">VSTEP</span>
                  {cefrInfo.vstepReached ? (
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  ) : (
                    <ArrowRight size={11} className="text-slate-500 shrink-0 group-hover:text-white group-hover:translate-x-0.5 transition" />
                  )}
                </div>
                <div className="mt-1 font-mono text-xs font-bold text-white">
                  {cefrInfo.vstepBest ? Number(cefrInfo.vstepBest).toFixed(1) : "0.0"}
                  <span className="text-[10px] font-normal text-slate-400 ml-0.5">/10</span>
                </div>
                <div className="mt-1 text-[10px] truncate">
                  {cefrInfo.vstepReached ? (
                    <span className="font-semibold text-emerald-400">Đã đạt ✓</span>
                  ) : (
                    <span className="font-medium text-amber-300 group-hover:text-amber-200">
                      Cần ≥ {cefrInfo.targetVstep} →
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Cột 3: Hình minh họa */}
          <div className="hidden shrink-0 xl:block">
            <StudyIllustration className="w-[160px] lg:w-[180px] opacity-90 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Bento Grid: Khu vực học tập */}
      <section className="space-y-3">
        <h3 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">Khu vực học tập</h3>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const stat = areaStats[area.id] || { percent: 0, label: "" };
            const Icon = area.icon;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onNavigate?.(area.id)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-left shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.15)] dark:border-white/[0.08] dark:bg-[#111827]/70 dark:hover:border-indigo-500/50 dark:hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5)]"
              >
                <div className="relative z-10 flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/20 shadow-md transition-transform duration-200 group-hover:scale-105" style={{ backgroundColor: area.color, color: '#FFFFFF' }}>
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-sm font-bold text-slate-900 dark:text-white">{area.label}</p>
                      <ArrowRight size={14} className="text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 dark:text-slate-500" />
                    </div>
                  </div>
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

      <TodayPlanCard cards={cards} target={target} goalToday={goalToday} streak={streak} onNavigate={onNavigate} />

      {/* Bảng Chỉ số, Trình độ & Lộ trình Thăng cấp */}
      <section className="panel p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow flex items-center gap-2">
            <Trophy size={14} className="text-amber-500" />
            Trình độ &amp; Tổng quan tiến độ
          </p>
          <button type="button" onClick={() => onNavigate?.("progress")} className="btn-secondary h-8 px-3 text-xs font-semibold">
            Chi tiết<ArrowRight size={13} />
          </button>
        </div>

        {loading && !cards.length ? (
          <p className="mt-3 text-xs text-slate-400">Đang tải số liệu…</p>
        ) : null}

        {/* Khung Trình độ hiện tại & Lộ trình nâng cấp trình tiếp theo */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.06] via-slate-500/[0.02] to-emerald-500/[0.04] p-4 sm:p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.02]">
          {/* Hàng 1: Trình độ CEFR & Cấp độ Gamification */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-4 ring-indigo-500/10">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-black text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    Bậc {cefrInfo.currentCefr}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {cefrInfo.currentCefrLabel}
                  </span>
                </div>
                <h4 className="mt-1 font-display text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                  Cấp {level.level}: {level.title}
                </h4>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
              <span className="chip bg-white/90 font-mono text-xs font-bold text-indigo-600 shadow-2xs dark:bg-white/10 dark:text-indigo-400">
                {xp} XP
              </span>
              {level.nextAt ? (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Mục tiêu Cấp {level.level + 1}: <strong className="text-slate-700 dark:text-slate-200">{level.nextAt} XP</strong>
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Đã đạt cấp tối đa</span>
              )}
            </div>
          </div>

          {/* Hàng 2: Thanh tiến độ thăng cấp */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-indigo-500" />
                {nextLevelTitle ? `Tiến độ lên Cấp ${level.level + 1} (${nextLevelTitle})` : "Đã đạt cấp tối đa"}
              </span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">{level.percent}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 shadow-sm transition-all duration-500"
                style={{ width: `${level.percent}%` }}
              />
            </div>
          </div>

          {/* Hàng 3: CẦN HỌC GÌ ĐỂ LÊN CẤP TIẾP THEO */}
          <div className="mt-5 border-t border-slate-200/60 pt-4 dark:border-white/[0.08]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                🎯 Cần học gì để nâng cấp trình tiếp theo?
              </p>
              {level.toNext > 0 && (
                <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  Còn thiếu {level.toNext} XP
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Cột 1: Nhiệm vụ tích lũy XP thăng Cấp */}
              <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3.5 backdrop-blur-xs dark:border-white/5 dark:bg-white/[0.02]">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  ⚡ Nâng Cấp {level.level + 1} {nextLevelTitle ? `(${nextLevelTitle})` : ''}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                  Tích lũy thêm {level.toNext} XP bằng các hoạt động nhanh:
                </p>
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Layers size={13} className="text-teal-500" />
                      Ôn ~{Math.max(1, Math.ceil(level.toNext / 5))} thẻ từ vựng (+5 XP)
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate?.("vocabulary")}
                      className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Ôn ngay
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <GraduationCap size={13} className="text-purple-500" />
                      Vượt ~{Math.max(1, Math.ceil(level.toNext / 30))} bài ngữ pháp (+30 XP)
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate?.("grammar")}
                      className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Học bài
                    </button>
                  </div>
                </div>
              </div>

              {/* Cột 2: Điều kiện nâng bậc CEFR */}
              <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3.5 backdrop-blur-xs dark:border-white/5 dark:bg-white/[0.02]">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  🎓 Điều kiện đạt Bậc {cefrInfo.nextCefr} ({cefrInfo.nextCefrLabel})
                </p>
                <div className="mt-2.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      {cefrInfo.cardsRemaining === 0 ? (
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Circle size={13} className="text-slate-400 shrink-0" />
                      )}
                      Từ vựng: {cefrInfo.cardsMastered}/{cefrInfo.targetCards} từ
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {cefrInfo.cardsRemaining === 0 ? "Đã đạt" : `Thiếu ${cefrInfo.cardsRemaining} từ`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      {cefrInfo.grammarRemaining === 0 ? (
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Circle size={13} className="text-slate-400 shrink-0" />
                      )}
                      Ngữ pháp: {cefrInfo.grammarPassed}/{cefrInfo.targetGrammar} bài
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {cefrInfo.grammarRemaining === 0 ? "Đã đạt" : `Thiếu ${cefrInfo.grammarRemaining} bài`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      {cefrInfo.vstepReached ? (
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Circle size={13} className="text-slate-400 shrink-0" />
                      )}
                      Điểm VSTEP: {cefrInfo.vstepBest}/10 (Mục tiêu {cefrInfo.targetVstep})
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate?.("vstep")}
                      className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      {cefrInfo.vstepReached ? "Luyện thêm" : "Thi thử"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lưới các chỉ số tổng quan */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatTile icon={Star} color="#f59e0b" label={`Cấp ${level.level} · ${level.title}`} value={`${xp} XP`} />
          <StatTile icon={Flame} color="#f97316" label="Chuỗi học" value={`${stats.streak.current} ngày`} />
          <StatTile icon={Layers} color="#06b6d4" label="Từ vựng" value={`${stats.cards.mastered}/${stats.cards.total}`} />
          <StatTile icon={GraduationCap} color="#a855f7" label="Ngữ pháp" value={`${stats.grammar.passed}/${stats.grammar.total}`} />
          <StatTile icon={Award} color="#ef4444" label="Đề VSTEP" value={`${stats.vstep.attempts} đề`} />
          <StatTile icon={Trophy} color="#10b981" label="Độ chính xác" value={`${stats.accuracy}%`} />
        </div>

        <div className="mt-4">
          <StudyHistoryChart days={14} />
        </div>
      </section>
    </div>
  );
}
