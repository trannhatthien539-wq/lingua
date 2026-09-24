import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Award, Flame, GraduationCap, Layers, PlayCircle, Star, Target, Trophy } from "lucide-react";
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
import { summarize } from "../../services/gamification";
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

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl border-2 border-[#4cb102] bg-gradient-to-br from-[#58cc02] to-[#43a302] p-4 text-white shadow-soft sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-white/85 sm:text-xs sm:tracking-[0.14em]">{greetingByHour()}{displayName ? `, ${displayName}` : ''} 👋</p>
            <h2 className="mt-1 font-display text-xl font-bold leading-tight sm:mt-1.5 sm:text-3xl">Hôm nay học gì?</h2>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:flex sm:flex-wrap">
              <span className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl bg-black/20 px-2 py-1.5 text-[11px] font-bold sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm"><Flame size={14} className="shrink-0 text-[#ffd900] sm:h-4 sm:w-4" /><span className="truncate">{stats.streak.current > 0 ? `Streaks: ${stats.streak.current} ngày` : 'Streaks: Chưa bắt đầu'}</span></span>
              <span className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl bg-black/20 px-2 py-1.5 text-[11px] font-bold sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm"><Star size={14} className="shrink-0 text-[#ffd900] sm:h-4 sm:w-4" /><span className="truncate">Cấp {level.level} · {level.title}</span></span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/85 sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-6">
              {goalPercent >= 100
                ? "Bạn đã đạt mục tiêu hôm nay 🎉 Học thêm chút nữa nếu còn thời gian nhé."
                : `Còn ${Math.max(0, target - goalToday)} lượt ôn nữa để hoàn thành mục tiêu hôm nay.`}
            </p>
            <div className="mt-3 max-w-xl sm:mt-5">
              <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.04em] text-white/90 sm:text-xs sm:tracking-[0.06em]">
                <span className="inline-flex min-w-0 items-center gap-1"><Target size={13} />Mục tiêu hôm nay</span>
                <span className="shrink-0">{goalToday}/{target} lượt ôn</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/25 sm:mt-2 sm:h-3">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${goalPercent}%` }} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={() => onNavigate?.("vocabulary")}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-white px-2 text-[11px] font-black uppercase tracking-[0.03em] text-[#3f9c02] shadow-[0_4px_0_0_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 sm:min-h-[48px] sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-sm sm:tracking-[0.06em]"
              ><PlayCircle size={17} />Học ngay</button>
              <button
                type="button"
                onClick={() => onNavigate?.("vstep")}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-white/60 px-2 text-[11px] font-bold uppercase tracking-[0.03em] text-white transition hover:bg-white/10 sm:min-h-[48px] sm:gap-2 sm:rounded-2xl sm:px-5 sm:text-sm sm:tracking-[0.06em]"
              ><Award size={17} />Thi VSTEP</button>
            </div>
          </div>
          {/* Minh hoạ bên phải: ẩn trên điện thoại để banner gọn, hiện từ md trở lên */}
          <div className="hidden shrink-0 md:block">
            <StudyIllustration className="w-[220px] lg:w-[260px]" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-bold">Khu vực học</h3>
          <span className="text-xs font-semibold text-ink/55 dark:text-white/55">Bấm để vào thẳng khu vực đó</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const stat = areaStats[area.id] || { percent: 0, label: "" };
            const Icon = area.icon;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onNavigate?.(area.id)}
                className="panel group relative flex flex-col gap-3 overflow-hidden border-b-4 p-4 text-left transition hover:-translate-y-1 hover:shadow-[0_14px_28px_-10px_rgba(24,32,29,0.22)] dark:hover:shadow-[0_14px_28px_-10px_rgba(0,0,0,0.5)]"
                style={{ borderBottomColor: area.color }}
              >
                {/* Watermark icon mờ theo chủ đề, chìm ở góc phải trên */}
                <Icon
                  size={104}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-5 -top-6 opacity-[0.08] transition-transform duration-300 group-hover:-rotate-6"
                  style={{ color: area.color }}
                />
                <span className="relative flex items-start gap-3">
                  <NavIcon icon={area.icon} color={area.color} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold">{area.label}</span>
                    <span className="block text-xs leading-5 text-ink/60 dark:text-white/60">{area.description}</span>
                  </span>
                  <ArrowRight size={18} className="mt-1 shrink-0 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink/60 dark:text-white/30" />
                </span>
                <span className="relative mt-auto block space-y-1.5">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                    <span className="block h-full rounded-full" style={{ width: `${stat.percent}%`, backgroundColor: area.color }} />
                  </span>
                  <span className="block text-xs font-semibold text-ink/55 dark:text-white/55">{stat.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <TodayPlanCard cards={cards} target={target} goalToday={goalToday} streak={streak} onNavigate={onNavigate} />

      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow flex items-center gap-2"><Trophy size={14} className="text-[#ffc800]" />Tổng quan tiến độ</p>
          <button type="button" onClick={() => onNavigate?.("progress")} className="btn-secondary px-4 text-xs">
            Xem chi tiết<ArrowRight size={14} />
          </button>
        </div>
        {loading && !cards.length ? (
          <p className="mt-3 text-sm text-ink/60 dark:text-white/60">Đang tải số liệu học tập…</p>
        ) : null}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatTile icon={Star} color="#ffc800" label={`Cấp ${level.level} · ${level.title}`} value={`${xp} XP`} note={level.nextAt ? `Còn ${level.toNext} XP để lên cấp ${level.level + 1}` : "Đã đạt cấp cao nhất"} />
          <StatTile icon={Flame} color="#ff9600" label="Chuỗi ngày học" value={`${stats.streak.current} ngày`} note={`Tổng ${stats.streak.totalSessions} phiên học`} />
          <StatTile icon={Layers} color="#1cb0f6" label="Từ vựng" value={`${stats.cards.mastered}/${stats.cards.total}`} note={`Đã thuộc · ${stats.cards.due} thẻ đến hạn`} />
          <StatTile icon={GraduationCap} color="#ce82ff" label="Bài ngữ pháp" value={`${stats.grammar.passed}/${stats.grammar.total}`} note="Đạt bài kiểm tra cuối bài" />
          <StatTile icon={Award} color="#ff4b4b" label="Đề VSTEP đã thi" value={`${stats.vstep.attempts} đề`} note={stats.vstep.band ? `Bậc cao nhất ${stats.vstep.band} · ${stats.vstep.best}/10` : "Chưa có kết quả"} />
          <StatTile icon={Trophy} color="#58cc02" label="Huy hiệu" value={`${earnedCount}/${achievements.length}`} note={`Tỷ lệ nhớ đúng ${stats.accuracy}%`} />
        </div>
        <StudyHistoryChart days={14} />
      </section>
    </div>
  );
}
