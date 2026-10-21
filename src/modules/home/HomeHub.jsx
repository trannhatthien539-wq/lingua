import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Award, Flame, GraduationCap, Layers, PlayCircle, Star, Target, Trophy } from "lucide-react";
import StudyHistoryChart from "../../components/ui/StudyHistoryChart";
import TodayPlanCard from "../../components/TodayPlanCard";
import NavIcon from "../../components/ui/NavIcon";
import useDailyGoal from "../../hooks/useDailyGoal";
import useGrammarProgress from "../../hooks/useGrammarProgress";
import useSkillsProgress from "../../hooks/useSkillsProgress";
import useVstepProgress from "../../hooks/useVstepProgress";
import { navigationItems } from "../../data/navigation";
import { dataService } from "../../services/dataService";
import { getHistoryDays, loadHistory } from "../../services/historyService";
import { summarize } from "../../services/gamification";
import { refreshRequestedEvent } from "../../services/syncStatus";
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
  const displayName = (user?.displayName || "").trim().split(" ").slice(-1)[0];
  const areas = AREA_IDS.map((id) => navigationItems.find((item) => item.id === id)).filter(Boolean);

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border-2 border-[#4cb102] bg-gradient-to-br from-[#58cc02] to-[#43a302] p-5 text-white shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/85">{greetingByHour()}{displayName ? `, ${displayName}` : ''} 👋</p>
            <h2 className="mt-1.5 font-display text-2xl font-bold sm:text-3xl">Hôm nay học gì?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
              {goalPercent >= 100
                ? "Bạn đã đạt mục tiêu hôm nay 🎉 Học thêm chút nữa nếu còn thời gian nhé."
                : `Còn ${Math.max(0, target - goalToday)} lượt ôn nữa để hoàn thành mục tiêu hôm nay.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-black/20 px-3 py-2 text-sm font-bold">
              <Flame size={16} className="text-[#ffd900]" />{stats.streak.current} ngày
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-black/20 px-3 py-2 text-sm font-bold">
              <Star size={16} className="text-[#ffd900]" />Cấp {level.level} · {level.title}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.06em] text-white/90">
            <span className="inline-flex items-center gap-1.5"><Target size={14} />Mục tiêu hôm nay</span>
            <span>{goalToday}/{target} lượt ôn</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/25">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${goalPercent}%` }} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate?.("vocabulary")}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold uppercase tracking-[0.06em] text-[#3f9c02] shadow-[0_4px_0_0_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
          >
            <PlayCircle size={18} />Học ngay
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.("vstep")}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-white/60 px-5 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-white/10"
          >
            <Award size={18} />Thi thử VSTEP
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-bold">Khu vực học</h3>
          <span className="text-xs font-semibold text-ink/55 dark:text-white/55">Bấm để vào thẳng khu vực đó</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => onNavigate?.(area.id)}
              className="panel group flex items-center gap-3 border-b-4 p-4 text-left transition hover:-translate-y-0.5"
              style={{ borderBottomColor: area.color }}
            >
              <NavIcon icon={area.icon} color={area.color} size="lg" />
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-bold">{area.label}</span>
                <span className="block text-xs leading-5 text-ink/60 dark:text-white/60">{area.description}</span>
              </span>
              <ArrowRight size={18} className="shrink-0 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink/60 dark:text-white/30" />
            </button>
          ))}
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
