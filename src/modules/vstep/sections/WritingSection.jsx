import { useState } from "react";
import { Check, Lightbulb, PenLine, Quote } from "lucide-react";

const countWords = (value = "") => (value.trim() ? value.trim().split(/\s+/).length : 0);

/** Phần Viết: 2 task của VSTEP, có đếm từ, checklist tự chấm và bài mẫu (chỉ hiện khi xem lại). */
export default function WritingSection({ exam, writings = {}, onWrite, mode = "exam", review = null, checks, onCheck }) {
  const tasks = exam.writing?.tasks || [];
  const [activeId, setActiveId] = useState(tasks[0]?.id);
  const [localChecked, setLocalChecked] = useState({});
  const task = tasks.find((item) => item.id === activeId) || tasks[0];
  const [showModel, setShowModel] = useState(false);
  // State có thể do component cha giữ (để tính điểm) hoặc tự giữ (chế độ luyện).
  const checked = checks || localChecked;

  if (!task) return <p className="text-sm text-ink/60 dark:text-white/60">Đề này chưa có phần Viết.</p>;

  const text = writings[task.id] || "";
  const words = countWords(text);
  const enough = words >= task.minWords;
  const doneChecks = (task.checklist || []).filter((item) => checked[`${task.id}:${item.label}`]).length;
  const feedback = review?.writing?.[task.id];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tasks.map((item) => {
          const itemWords = countWords(writings[item.id] || "");
          const ok = itemWords >= item.minWords;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => { setActiveId(item.id); setShowModel(false); }}
              aria-current={item.id === task.id ? "true" : undefined}
              className={`flex min-h-[44px] min-w-max items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition ${item.id === task.id ? "bg-lime text-ink" : "text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]"}`}
            >
              {item.title}
              <span className={`chip ${ok ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60"}`}>{itemWords} từ</span>
            </button>
          );
        })}
      </div>

      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Writing Task {task.task}</p>
            <p className="mt-2 text-sm font-semibold leading-6">{task.prompt}</p>
          </div>
          <span className={`chip ${enough ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-warnbg text-warn"}`}>
            {words}/{task.minWords} từ
          </span>
        </div>
        {task.tips?.length > 0 && mode !== "exam" && (
          <ul className="mt-4 space-y-1.5 rounded-xl bg-lime/15 p-3 text-xs leading-5">
            {task.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0" />{tip}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel p-4 sm:p-5">
        <label className="eyebrow flex items-center gap-2" htmlFor={`vstep-w-${task.id}`}><PenLine size={14} />Bài làm của bạn</label>
        <textarea
          id={`vstep-w-${task.id}`}
          value={text}
          readOnly={mode === "review"}
          onChange={(event) => onWrite(task.id, event.target.value)}
          rows={14}
          placeholder="Viết bài của bạn ở đây…"
          className="field mt-2 min-h-[280px] resize-y font-sans leading-7"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ink/60 dark:text-white/60">
            {enough ? "Đã đủ số từ tối thiểu." : `Cần thêm ${Math.max(0, task.minWords - words)} từ nữa.`} Bài được lưu tự động.
          </p>
          {mode === "review" && <span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{doneChecks}/{task.checklist?.length || 0} mục đạt</span>}
        </div>
      </section>

      {mode !== "exam" && (
        <section className="panel p-4 sm:p-5">
          <p className="eyebrow">Tự chấm theo checklist</p>
          <ul className="mt-3 space-y-2">
            {(task.checklist || []).map((item) => {
              const key = `${task.id}:${item.label}`;
              return (
                <li key={key}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/[0.08] p-3 text-sm dark:border-white/[0.08]">
                    <input
                      type="checkbox"
                      checked={Boolean(checked[key])}
                      onChange={(event) => (onCheck
                        ? onCheck(key, event.target.checked)
                        : setLocalChecked((current) => ({ ...current, [key]: event.target.checked })))}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-lime"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{item.label}</span>
                      {item.hint && <span className="mt-0.5 block text-xs text-ink/60 dark:text-white/60">{item.hint}</span>}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {feedback && (
        <section className="panel p-4 sm:p-5">
          <p className="eyebrow">Nhận xét của AI</p>
          <p className="mt-2 font-display text-2xl font-bold">{feedback.score10}/10</p>
          {feedback.criteria?.length > 0 && (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {feedback.criteria.map((item) => (
                <li key={item.name} className="rounded-xl bg-ink/[0.04] p-3 text-sm dark:bg-white/[0.06]">
                  <p className="font-bold">{item.name}: {item.score}/2.5</p>
                  <p className="mt-1 text-xs leading-5 text-ink/70 dark:text-white/70">{item.comment}</p>
                </li>
              ))}
            </ul>
          )}
          {feedback.strengths?.length > 0 && (
            <div className="mt-3 rounded-xl border border-ok/40 bg-okbg/40 p-3 text-sm dark:bg-okdark/30">
              <p className="font-bold">Điểm mạnh</p>
              <ul className="mt-1 list-disc pl-5 text-xs leading-5">{feedback.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          {feedback.improvements?.length > 0 && (
            <div className="mt-3 rounded-xl border border-warn/40 bg-warnbg/40 p-3 text-sm">
              <p className="font-bold">Cần sửa</p>
              <ul className="mt-1 list-disc pl-5 text-xs leading-5">{feedback.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          {feedback.rewritten && (
            <details className="mt-3 rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
              <summary className="cursor-pointer text-xs font-bold uppercase tracking-wide text-ink/60 dark:text-white/60">Bản viết lại tham khảo</summary>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{feedback.rewritten}</p>
            </details>
          )}
        </section>
      )}

      {mode === "review" && (
        <section className="panel p-4 sm:p-5">
          <button type="button" onClick={() => setShowModel((value) => !value)} className="btn-secondary px-4">
            <Quote size={16} />{showModel ? "Ẩn bài mẫu" : "Xem bài mẫu"}
          </button>
          {showModel && (
            <div className="mt-4 rounded-xl border border-sage/40 bg-sage/10 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink/60 dark:text-white/60"><Check size={14} />Bài mẫu</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{task.model}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
