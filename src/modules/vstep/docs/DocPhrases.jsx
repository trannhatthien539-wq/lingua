import { useState } from "react";
import { AlertTriangle, MessageSquareQuote, PenLine } from "lucide-react";
import { commonMistakes, speakingPhrases, writingPhrases } from "../../../data/vstep/phrases";

const TABS = [
  { id: "writing", label: "Mẫu câu Viết", icon: PenLine },
  { id: "speaking", label: "Mẫu câu Nói", icon: MessageSquareQuote },
  { id: "mistakes", label: "Lỗi thường gặp", icon: AlertTriangle },
];

/** Sổ tay mẫu câu Writing/Speaking + danh sách lỗi người Việt hay mắc. */
export default function DocPhrases() {
  const [tab, setTab] = useState("writing");
  const groups = tab === "writing" ? writingPhrases : tab === "speaking" ? speakingPhrases : [];

  return (
    <div className="space-y-4">
      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Sổ tay mẫu câu</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={tab === item.id}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition ${tab === item.id ? "bg-lime text-ink" : "border border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70"}`}
            >
              <item.icon size={15} />{item.label}
            </button>
          ))}
        </div>
      </section>

      {tab !== "mistakes" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {groups.map((group) => (
            <section key={group.id} className="panel p-5">
              <p className="font-display font-bold">{group.title}</p>
              <ul className="mt-3 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.en} className="rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
                    <p className="text-sm font-semibold leading-6">{item.en}</p>
                    <p className="mt-1 text-xs leading-5 text-ink/70 dark:text-white/70">{item.vi}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {tab === "mistakes" && (
        <section className="panel p-5">
          <p className="eyebrow">Lỗi thường gặp ({commonMistakes.length})</p>
          <ul className="mt-3 space-y-2">
            {commonMistakes.map((item) => (
              <li key={item.wrong} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
                <p className="text-sm text-danger dark:text-dangerfgdark">✗ {item.wrong}</p>
                <p className="mt-1 text-sm font-semibold text-sage">✓ {item.right}</p>
                {item.note && <p className="mt-1 text-xs leading-5 text-ink/70 dark:text-white/70">{item.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
