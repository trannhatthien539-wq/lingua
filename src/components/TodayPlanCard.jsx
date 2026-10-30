import { useMemo, useState } from "react";
import { AlertTriangle, CalendarCheck, GraduationCap, Layers, PlayCircle, TrendingUp } from "lucide-react";
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
    <li className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-3 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.03]">
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
        <button type="button" onClick={onAction} className="btn-secondary min-h-[38px] shrink-0 px-3 text-xs font-semibold sm:min-h-[34px]">
          <PlayCircle size={14} />{action}
        </button>
      )}
    </li>
  );
}

/**
 * “Hôm nay học gì”: gợi ý việc cần làm dựa trên dữ liệu thật (thẻ đến hạn, thẻ hay quên,
 * câu sai, kỹ năng VSTEP yếu nhất). Mục tiêu ngày được gộp ngay trong thẻ này để tránh
 * một card mục tiêu trùng lặp ở trang Tiến độ.
 */
export default function TodayPlanCard({
  cards = [],
  target = 0,
  goalToday = 0,
  onNavigate,
  maxItems,
  showGoal = true,
  onSetGoal,
  goalPresets = [],
}) {
  const { mistakes: grammarMistakes } = useGrammarProgress();
  const { mistakes: bankMistakes, stats } = useMistakeBank();
  const { attempts } = useVstepProgress();
  const [goalOpen, setGoalOpen] = useState(false);
  const [customGoal, setCustomGoal] = useState("");

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
    mistakeTotal > 0 && {
      key: "mistakes",
      icon: TrendingUp,
      toneClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25",
      title: `Luyện lại ${mistakeTotal} câu sai`,
      detail: `Ngữ pháp ${grammarMistakes.length} · Nghe/Đọc/VSTEP ${bankMistakes.length}.`,
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
    leeches > 0 && {
      key: "leech",
      icon: AlertTriangle,
      toneClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25",
      title: `${leeches} từ hay quên cần chú ý`,
      detail: "Những từ này bạn đã quên nhiều lần — nên học bằng flashcard hoặc đặt câu.",
      action: "Xem lại",
      onAction: () => onNavigate?.("vocabulary"),
    },
  ].filter(Boolean);
  const visibleRows = Number.isFinite(maxItems) ? rows.slice(0, maxItems) : rows;

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
          Nhiệm vụ hôm nay
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {visibleRows.length} việc cần làm
        </span>
      </div>

      {showGoal && target > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Mục tiêu hôm nay</p>
            <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {goalToday}/{target} · {goalPercent}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${goalPercent >= 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          {onSetGoal && (
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {goalPercent >= 100 ? "Đã đạt mục tiêu hôm nay" : `Còn ${Math.max(0, target - goalToday)} lượt ôn`}
              </p>
              <button
                type="button"
                onClick={() => setGoalOpen((value) => !value)}
                className="text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                aria-expanded={goalOpen}
              >
                {goalOpen ? "Đóng" : "Đổi mục tiêu"}
              </button>
            </div>
          )}
          {goalOpen && onSetGoal && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-slate-200/70 pt-2.5 dark:border-white/[0.08]">
              {goalPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSetGoal(preset)}
                  aria-pressed={target === preset}
                  className={`h-8 rounded-lg px-2.5 text-[11px] font-bold transition ${
                    target === preset
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  {preset}
                </button>
              ))}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const value = Number(customGoal);
                  if (!value || value <= 0) return;
                  onSetGoal(value);
                  setCustomGoal("");
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  value={customGoal}
                  onChange={(event) => setCustomGoal(event.target.value)}
                  inputMode="numeric"
                  placeholder="Tự nhập"
                  className="h-8 w-20 rounded-lg border border-slate-200 bg-transparent px-2 text-[11px] outline-none focus:border-indigo-400 dark:border-white/15"
                  aria-label="Mục tiêu tùy chỉnh"
                />
                <button type="submit" className="h-8 rounded-lg px-2.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-white/[0.06]">
                  Lưu
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {rows.length ? (
        <ul className="mt-4 space-y-2">
          {visibleRows.map((row) => (
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
              className="btn-secondary h-9 px-3.5 text-xs font-bold"
            >
              Học từ mới
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("grammar")}
              className="btn-secondary h-9 px-3.5 text-xs font-bold"
            >
              Luyện ngữ pháp
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
