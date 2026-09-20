import { useState } from "react";
import { BookOpen, CalendarCheck, CheckCircle2, Clock3, GraduationCap, ListChecks, Target } from "lucide-react";
import { examDayChecklist, scoringNotes, studyPlanWeeks, vstepIntro, vstepLevels, vstepSkills } from "../../../data/vstep/handbook";

/** Sổ tay VSTEP: format đề, cách tính điểm, mẹo từng kỹ năng, kế hoạch học và checklist ngày thi. */
export default function DocHandbook() {
  const [skillId, setSkillId] = useState(vstepSkills[0].id);
  const skill = vstepSkills.find((item) => item.id === skillId) || vstepSkills[0];

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <p className="eyebrow flex items-center gap-2"><GraduationCap size={14} />VSTEP là gì</p>
        <p className="mt-2 text-sm leading-7 text-ink/80 dark:text-white/80">{vstepIntro}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {vstepLevels.map((level) => (
            <div key={level.id} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
              <p className="font-display font-bold">{level.name}</p>
              <p className="mt-1 text-xs leading-5 text-ink/70 dark:text-white/70">{level.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <p className="eyebrow flex items-center gap-2"><Clock3 size={14} />Cấu trúc đề thi</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-4">
          {vstepSkills.map((item) => (
            <li key={item.id} className="rounded-xl bg-ink/[0.04] p-3 text-sm dark:bg-white/[0.06]">
              <p className="font-bold">{item.name}</p>
              <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{item.minutes} phút</p>
              <p className="text-xs text-ink/60 dark:text-white/60">{item.questions}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {vstepSkills.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSkillId(item.id)}
              aria-pressed={skillId === item.id}
              className={`min-h-[44px] min-w-max rounded-xl px-3.5 text-sm font-bold transition ${skillId === item.id ? "bg-lime text-ink" : "text-ink/70 hover:bg-ink/[0.05] dark:text-white/70"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-ink/[0.08] p-4 dark:border-white/[0.08]">
          <ul className="space-y-2 text-sm">
            {skill.parts.map((part) => (
              <li key={part.name} className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-bold">{part.name}</span>
                <span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{part.questions}</span>
                <span className="text-xs leading-5 text-ink/70 dark:text-white/70">{part.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink/60 dark:text-white/60"><Target size={13} />Mẹo làm bài</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-6">
            {skill.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2"><span className="text-sage">•</span>{tip}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel p-5">
        <p className="eyebrow flex items-center gap-2"><ListChecks size={14} />Cách tính điểm</p>
        <ul className="mt-2 space-y-1.5 text-sm leading-6">
          {scoringNotes.map((note) => (
            <li key={note} className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-sage" />{note}</li>
          ))}
        </ul>
      </section>

      <section className="panel p-5">
        <p className="eyebrow flex items-center gap-2"><BookOpen size={14} />Lộ trình 9 tuần</p>
        <ol className="mt-3 space-y-2">
          {studyPlanWeeks.map((week) => (
            <li key={week.week} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
              <p className="text-sm font-bold">{week.week} · {week.focus}</p>
              <ul className="mt-1 list-disc pl-5 text-xs leading-6 text-ink/70 dark:text-white/70">
                {week.tasks.map((task) => <li key={task}>{task}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel p-5">
        <p className="eyebrow flex items-center gap-2"><CalendarCheck size={14} />Checklist ngày thi</p>
        <ul className="mt-2 space-y-1.5 text-sm leading-6">
          {examDayChecklist.map((item) => (
            <li key={item} className="flex items-start gap-2"><span className="text-sage">✓</span>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
