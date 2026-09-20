import { useEffect, useState } from "react";

/**
 * Nút "Cài app" (Add to Home Screen).
 * Chrome/Edge phát `beforeinstallprompt`; iOS Safari không có sự kiện này nên
 * hiển thị hướng dẫn "Chia sẻ → Thêm vào màn hình chính".
 */
export default function useInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState(null);
  const [installed, setInstalled] = useState(
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.("(display-mode: standalone)")?.matches),
  );
  const [lastResult, setLastResult] = useState("");

  useEffect(() => {
    const handlePrompt = (event) => {
      event.preventDefault();
      setDeferredEvent(event);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setDeferredEvent(null);
      setLastResult("accepted");
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredEvent) return false;
    deferredEvent.prompt();
    const choice = await deferredEvent.userChoice;
    setDeferredEvent(null);
    setLastResult(choice?.outcome || "");
    return choice?.outcome === "accepted";
  };

  const isIos = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

  return {
    canInstall: Boolean(deferredEvent),
    installed,
    isIos,
    lastResult,
    promptInstall,
  };
}
