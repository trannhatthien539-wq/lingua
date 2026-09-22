import { Check, PlayCircle } from "lucide-react";
import NavIcon from "../ui/NavIcon";

/**
 * Danh sách bài học dạng thẻ cho các tab Kỹ năng — cùng kiểu với danh sách bài ở
 * tab Ngữ pháp / danh sách bộ thẻ ở tab Từ vựng: chỉ hiện tiêu đề + thông tin ngắn,
 * **bấm vào mới mở nội dung bài**, bài đã làm hiện điểm cao nhất.
 *
 * `items`: `{ id, index, title, level?, tag?, meta?, summary?, result?, chip? }`
 */
export default function SkillLessonList({ icon, color = "#14d4f4", actionLabel = "Học bài", items, onOpen }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="panel flex flex-col border-b-4 p-4" style={{ borderBottomColor: color }}>
          <div className="flex items-start gap-3">
            <NavIcon icon={icon} color={color} size="md" />
            <div className="min-w-0 flex-1">
              <p className="eyebrow">
                Bài {item.index}
                {item.level ? ` · ${item.level}` : ""}
                {item.tag ? ` · ${item.tag}` : ""}
              </p>
              <h4 className="mt-1 font-display text-base font-bold">{item.title}</h4>
              {item.meta && <p className="mt-0.5 text-xs text-ink/60 dark:text-white/60">{item.meta}</p>}
            </div>
            {item.result ? (
              <span className="chip shrink-0 bg-okbg text-ok dark:bg-okdark dark:text-okfgdark">
                <Check size={13} className="mr-1" />{item.result.best}/{item.result.total}
              </span>
            ) : (
              <span className="chip shrink-0 bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60">{item.chip || "Chưa làm"}</span>
            )}
          </div>
          {item.summary && <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/70 dark:text-white/70">{item.summary}</p>}
          <div className="mt-auto pt-3">
            <button type="button" onClick={() => onOpen(item.id)} className={item.result ? "btn-secondary px-4" : "btn-primary px-4"}>
              <PlayCircle size={16} />{item.result ? "Làm lại" : actionLabel}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
