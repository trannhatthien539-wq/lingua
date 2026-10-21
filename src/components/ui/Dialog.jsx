import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** Modal dùng chung: Escape, focus trap, trả focus và khoá scroll nền. */
export default function Dialog({
  children,
  onClose,
  ariaLabel,
  ariaLabelledBy,
  className = "",
  overlayClassName = "fixed inset-0 z-[100] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm",
  closeOnBackdrop = true,
  initialFocusRef,
}) {
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const initialFocusRefValue = useRef(initialFocusRef);
  onCloseRef.current = onClose;
  initialFocusRefValue.current = initialFocusRef;

  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      const target = initialFocusRefValue.current?.current || panelRef.current?.querySelector("[autofocus]") || panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
      target?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((element) => !element.hasAttribute("disabled") && element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
    };
  }, []);

  return (
    <div className={overlayClassName} onMouseDown={(event) => closeOnBackdrop && event.target === event.currentTarget && onCloseRef.current()}>
      <section ref={panelRef} tabIndex={-1} className={className} role="dialog" aria-modal="true" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
        {children}
      </section>
    </div>
  );
}
