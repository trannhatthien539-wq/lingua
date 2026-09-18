import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, Undo2, X } from "lucide-react";
import { subscribeToast } from "../../services/toast";

const MAX_VISIBLE = 3;

const tones = {
  success: { wrap: "border-ok/25 bg-okbg text-ok dark:border-okfgdark/25 dark:bg-okdark dark:text-okfgdark", icon: CheckCircle2 },
  error: { wrap: "border-danger/25 bg-dangerbg text-danger dark:border-dangerfgdark/25 dark:bg-dangerdark dark:text-dangerfgdark", icon: AlertCircle },
  info: { wrap: "border-ink/10 bg-slab text-ink dark:border-white/10 dark:bg-dark2 dark:text-white", icon: Info },
};

export default function Toaster() {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());

  useEffect(
    () =>
      subscribeToast((item) => {
        setItems((current) => [...current.filter((existing) => existing.id !== item.id), item].slice(-MAX_VISIBLE));
        if (item.duration > 0) {
          const timer = window.setTimeout(() => {
            setItems((current) => current.filter((existing) => existing.id !== item.id));
            timers.current.delete(item.id);
          }, item.duration);
          timers.current.set(item.id, timer);
        }
      }),
    [],
  );

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    },
    [],
  );

  const dismiss = (id) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  };

  if (!items.length) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-24 z-[130] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
      role="region"
      aria-label="Thông báo"
    >
      {items.map((item) => {
        const tone = tones[item.tone] || tones.info;
        const Icon = tone.icon;
        return (
          <div
            key={item.id}
            role={item.tone === "error" ? "alert" : "status"}
            aria-live={item.tone === "error" ? "assertive" : "polite"}
            className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold shadow-soft backdrop-blur ${tone.wrap}`}
          >
            <Icon size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p className="min-w-0 flex-1 leading-5">{item.message}</p>
            {item.action && (
              <button
                type="button"
                onClick={() => {
                  dismiss(item.id);
                  item.action.onClick?.();
                }}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold underline decoration-2 underline-offset-2"
              >
                <Undo2 size={13} />
                {item.action.label || "Hoàn tác"}
              </button>
            )}
            <button type="button" onClick={() => dismiss(item.id)} className="-mr-1 shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100" aria-label="Đóng thông báo">
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
