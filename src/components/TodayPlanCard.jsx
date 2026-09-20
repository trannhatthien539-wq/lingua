import { useMemo } from "react";
import { AlertTriangle, CalendarCheck, Flame, GraduationCap, Layers, PlayCircle, Target, TrendingUp } from "lucide-react";
import useGrammarProgress from "../hooks/useGrammarProgress";
import useMistakeBank from "../hooks/useMistakeBank";
import useVstepProgress from "../hooks/useVstepProgress";
import { isDue, isLeech } from "../utils/srs";

const DOMAIN_LABELS = {
  listening: "Nghe",
  reading: "Đọc",
  writing: "Viết",
  speaking: "Nói",
};

const averageBySkill = (attempts = []) => {
  const totals = {};
  attempts.forEach((attempt) => {
    Object.entries(attempt.scores || {}).forEach(([skill, score]) => {
      if (typeof score !== "number") return;
      const entry = totals[skill] || { sum: 0, count: 0 };
      entry.sum += score;
      entry.count += 1;
      totals[skill] = entry;
    });
  });
  return Object.entries(totals)
    .filter(([, entry]) => entry.count > 0)
    .map(([skill, entry]) => ({ skill, value: entry.sum / entry.count }))
    .sort((first, second) => first.value - second.value);
};

function PlanRow({ icon: Icon, toneClass = "bg-sage/15 text-sage", title, detail, action, onAction }) {
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClass}`}>
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-xs text-ink/60 dark:text-white/60">{detail}</span>
      </span>
      {action && (
        <button type="button" onClick={onAction} className="btn-secondary min-h-[36px] px-3 text-xs">
          <PlayCircle size={14} />{action}
        </button>
      )}
    </li>
  );
}

/**
 * “Hôm nay học gì”: gợi ý việc cần làm dựa trên dữ liệu thật (thẻ đến hạn, thẻ hay quên,
 * câu sai, kỹ năng VSTEP yếu nhất, mục tiêu và chuỗi ngày học).
 * Mỗi dòng có nút nhảy thẳng đến đúng khu vực.
 */
export default function TodayPlanCard({ cards = [], target = 0, goalToday = 0, streak, onNavigate }) {
  const { mistakes: grammarMistakes } = useGrammarProgress();
  const { mistakes: bankMistakes, stats } = useMistakeBank();
  const { attempts } = useVstepProgress();

  // Thẻ đã học (không phải thẻ mới) mà đã tới ngày ôn — không tính thẻ mới để tránh trùng với dòng "học thẻ mới".
  const due = useMemo(
    () => cards.filter((card) => card.status && card.status !== "new" && isDue(card)).length,
    [cards],
  );
  const leeches = useMemo(() => cards.filter((card) => isLeech(card)).length, [cards]);
  const newest = useMemo(
    () => cards.filter((card) => card.status === "new" && !card.lastStudiedDate).length,
    [cards],
  );

  const mistakeTotal = grammarMistakes.length + bankMistakes.length;
  const weakest = useMemo(() => averageBySkill(attempts)[0] || null, [attempts]);
  const mistakeTarget = useMemo(() => {
    const bySource = stats.bySource || {};
    if ((bySource.vstep || 0) > 0) return "vstep";
    if ((bySource.listening || 0) > 0 || (bySource.reading || 0) > 0) return "skills";
    return "grammar";
  }, [stats]);

  const goalPercent = target ? Math.min(100, Math.round((goalToday / target) * 100)) : 0;
  const streakDays = streak?.currentStreak || 0;

  const rows = [
    due > 0 && {
      key: "due",
      icon: CalendarCheck,
      toneClass: "bg-sage/15 text-sage",
      title: `Ôn ${due} thẻ đã đến hạn`,
      detail: "Ôn hết thẻ đến hạn để không quên từ đã học.",
      action: "Ôn ngay",
      onAction: () => onNavigate?.("vocabulary"),
    },
    newest > 0 && {
      key: "new",
      icon: Layers,
      toneClass: "bg-lime/25 text-ink dark:text-lime",
      title: `Học ${Math.min(newest, 10)} thẻ mới`,
      detail: `${newest} từ chưa từng được học trong thư viện của bạn.`,
      action: "Học từ mới",
      onAction: () => onNavigate?.("vocabulary"),
    },
    leeches > 0 && {
      key: "leech",
      icon: AlertTriangle,
      toneClass: "bg-warnbg text-warn",
      title: `${leeches} từ hay quên cần chú ý`,
      detail: "Những từ này bạn đã quên nhiều lần — nên học bằng flashcard hoặc đặt câu.",
      action: "Xem lại",
      onAction: () => onNavigate?.("vocabulary"),
    },
    mistakeTotal > 0 && {
      key: "mistakes",
      icon: TrendingUp,
      toneClass: "bg-dangerbg text-danger dark:text-dangerfgdark",
      title: `Luyện lại ${mistakeTotal} câu sai`,
      detail: `Ngữ pháp ${grammarMistakes.length} · Nghe/Đọc/VSTEP ${bankMistakes.length}. Sổ câu sai nằm trong tab Tiến độ.`,
      action: "Luyện lại",
      onAction: () => onNavigate?.(mistakeTarget),
    },
    weakest && weakest.value < 7 && {
      key: "vstep",
      icon: GraduationCap,
      toneClass: "bg-sage/15 text-sage",
      title: `Kỹ năng ${DOMAIN_LABELS[weakest.skill] || weakest.skill} còn yếu (${weakest.value.toFixed(1)}/10)`,
      detail: "Làm thêm một đề VSTEP hoặc luyện riêng kỹ năng này.",
      action: "Thi thử",
      onAction: () => onNavigate?.("vstep"),
    },
    target > 0 && {
      key: "goal",
      icon: Target,
      toneClass: "bg-lime/25 text-ink dark:text-lime",
      title: goalPercent >= 100 ? "Đã đạt mục tiêu hôm nay 🎉" : `Mục tiêu hôm nay: ${goalToday}/${target} lượt ôn`,
      detail: goalPercent >= 100 ? "Giỏi lắm! Học thêm chút nữa nếu bạn còn thời gian." : `Còn ${Math.max(0, target - goalToday)} lượt nữa để đạt mục tiêu.`,
      action: goalPercent >= 100 ? null : "Học tiếp",
      onAction: () => onNavigate?.("vocabulary"),
    },
    streakDays > 0 && {
      key: "streak",
      icon: Flame,
      toneClass: "bg-warnbg text-warn",
      title: `Chuỗi ${streakDays} ngày học`,
      detail: streakDays >= 7 ? "Bạn đang giữ phong độ rất tốt!" : "Học hôm nay để giữ chuỗi nhé.",
      action: null,
    },
  ].filter(Boolean);

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Kế hoạch hôm nay</p>
          <h3 className="mt-1 font-display text-lg font-bold">Hôm nay học gì?</h3>
        </div>
        {target > 0 && (
          <span className={`chip ${goalPercent >= 100 ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-lime text-ink"}`}>
            {goalToday}/{target} lượt ôn
          </span>
        )}
      </div>
      {rows.length ? (
        <ul className="mt-4 space-y-2">
          {rows.map((row) => (
            <PlanRow
              key={row.key}
              icon={row.icon}
              toneClass={row.toneClass}
              title={row.title}
              detail={row.detail}
              action={row.action}
              onAction={row.onAction}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink/60 dark:text-white/60">
          Chưa có gì đến hạn. Thêm từ vựng mới hoặc làm một đề để hệ thống gợi ý kế hoạch tiếp theo.
        </p>
      )}
    </section>
  );
}
