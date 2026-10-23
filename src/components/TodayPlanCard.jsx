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

function PlanRow({ icon: Icon, toneClass = "bg-[rgba(var(--accent),0.12)] text-[rgb(var(--accent))]", title, detail, action, onAction }) {
  return (
    <li className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/60 bg-white/50 px-3.5 py-3 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#111827]/50">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${toneClass}`}>
          <Icon size={16} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</span>
          {detail && <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">{detail}</span>}
        </span>
      </div>
      {action && (
        <button type="button" onClick={onAction} className="btn-secondary h-8 shrink-0 px-3 text-xs font-semibold">
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
      toneClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25",
      title: `Ôn ${due} thẻ đã đến hạn`,
      detail: "Ôn hết thẻ đến hạn để không quên từ đã học.",
      action: "Ôn ngay",
      onAction: () => onNavigate?.("vocabulary"),
    },
    newest > 0 && {
      key: "new",
      icon: Layers,
      toneClass: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25",
      title: `Học ${Math.min(newest, 10)} thẻ mới`,
      detail: `${newest} từ chưa từng được học trong thư viện của bạn.`,
      action: "Học từ mới",
      onAction: () => onNavigate?.("vocabulary"),
    },
    leeches > 0 && {
      key: "leech",
      icon: AlertTriangle,
      toneClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25",
      title: `${leeches} từ hay quên cần chú ý`,
      detail: "Những từ này bạn đã quên nhiều lần — nên học bằng flashcard hoặc đặt câu.",
      action: "Xem lại",
      onAction: () => onNavigate?.("vocabulary"),
    },
    mistakeTotal > 0 && {
      key: "mistakes",
      icon: TrendingUp,
      toneClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25",
      title: `Luyện lại ${mistakeTotal} câu sai`,
      detail: `Ngữ pháp ${grammarMistakes.length} · Nghe/Đọc/VSTEP ${bankMistakes.length}. Sổ câu sai nằm trong tab Tiến độ.`,
      action: "Luyện lại",
      onAction: () => onNavigate?.(mistakeTarget),
    },
    weakest && weakest.value < 7 && {
      key: "vstep",
      icon: GraduationCap,
      toneClass: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25",
      title: `Kỹ năng ${DOMAIN_LABELS[weakest.skill] || weakest.skill} còn yếu (${weakest.value.toFixed(1)}/10)`,
      detail: "Làm thêm một đề VSTEP hoặc luyện riêng kỹ năng này.",
      action: "Thi thử",
      onAction: () => onNavigate?.("vstep"),
    },
    target > 0 && {
      key: "goal",
      icon: Target,
      toneClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
      title: goalPercent >= 100 ? "Đã đạt mục tiêu hôm nay 🎉" : `Mục tiêu hôm nay: ${goalToday}/${target} lượt ôn`,
      detail: goalPercent >= 100 ? "Giỏi lắm! Học thêm chút nữa nếu bạn còn thời gian." : `Còn ${Math.max(0, target - goalToday)} lượt nữa để đạt mục tiêu.`,
      action: goalPercent >= 100 ? null : "Học tiếp",
      onAction: () => onNavigate?.("vocabulary"),
    },
    streakDays > 0 && {
      key: "streak",
      icon: Flame,
      toneClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25",
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
          <span className={`chip ${goalPercent >= 100 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold" : "bg-[rgba(var(--accent),0.12)] text-[rgb(var(--accent))] border border-[rgba(var(--accent),0.3)] font-bold"}`}>
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
        <div className="mt-4 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 p-5 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CalendarCheck size={24} />
          </div>
          <h4 className="mt-3 font-display text-base font-bold text-slate-900 dark:text-white">
            Bạn đã sẵn sàng cho hôm nay!
          </h4>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Không có thẻ nào bị quá hạn. Hãy khám phá thêm từ vựng mới hoặc làm một bài tập ngữ pháp nhé.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate?.("vocabulary")}
              className="btn-secondary text-xs h-9 font-bold px-3.5"
            >
              Học từ mới
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("grammar")}
              className="btn-secondary text-xs h-9 font-bold px-3.5"
            >
              Luyện ngữ pháp
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
