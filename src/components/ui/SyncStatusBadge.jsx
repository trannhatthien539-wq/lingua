import { useCallback, useEffect, useState } from "react";
import { refreshRequestedEvent, subscribeSyncStatus } from "../../services/syncStatus";
import { hasGuestVocabulary, readGuestLibrary } from "../../services/dataService";
import { syncVocabulary } from "../../services/vocabularySync";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

export default function SyncStatusBadge({ user, compact = false }) {
  const [status, setStatus] = useState({ online: true, pending: 0, lastSyncedAt: null, error: "" });

  useEffect(() => subscribeSyncStatus(setStatus), []);

  const tone = !status.online
    ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200"
    : status.error
      ? "border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200"
      : "border-ink/10 bg-white text-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60";

  const label = !status.online
    ? "Ngoại tuyến"
    : status.pending > 0
      ? "Đang lưu..."
      : status.error
        ? "Lỗi đồng bộ"
        : status.lastSyncedAt
          ? `Đã lưu ${formatTime(status.lastSyncedAt)}`
          : user
            ? "Đã đồng bộ"
            : "Lưu trên thiết bị";

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const resync = useCallback(async () => {
    setBusy(true);
    setMessage("");
    try {
      if (user && hasGuestVocabulary()) await syncVocabulary(readGuestLibrary());
      window.dispatchEvent(new Event(refreshRequestedEvent));
      setMessage("Đã tải lại dữ liệu mới nhất.");
    } catch (error) {
      setMessage(error.message || "Không thể đồng bộ. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }, [user]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-bold transition ${tone}`}
        title="Trạng thái đồng bộ dữ liệu"
        aria-label="Trạng thái đồng bộ dữ liệu"
      >
        <span className={`h-2 w-2 rounded-full ${!status.online ? "bg-amber-500" : status.pending > 0 ? "animate-pulse bg-sky-500" : status.error ? "bg-red-500" : "bg-emerald-500"}`} />
        {compact ? null : <span className="whitespace-nowrap">{label}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-[70] w-64 rounded-xl border border-ink/10 bg-white p-4 text-xs shadow-xl dark:border-white/10 dark:bg-[#202724]">
          <p className="font-display text-sm font-bold">Đồng bộ dữ liệu</p>
          <p className="mt-1.5 leading-5 text-ink/55 dark:text-white/55">
            {user
              ? "Bộ thẻ, streak, kế hoạch và mindmap được lưu trên tài khoản của bạn."
              : "Bạn đang dùng chế độ Khách. Dữ liệu chỉ nằm trên thiết bị này."}
          </p>
          <ul className="mt-3 space-y-1 text-ink/55 dark:text-white/55">
            <li>Trạng thái: <b>{status.online ? "Có mạng" : "Ngoại tuyến"}</b></li>
            <li>Đang chờ lưu: <b>{status.pending}</b></li>
            <li>Lần đồng bộ gần nhất: <b>{status.lastSyncedAt ? formatTime(status.lastSyncedAt) : "—"}</b></li>
          </ul>
          {status.error && <p className="mt-3 rounded-lg bg-red-500/10 px-2.5 py-2 leading-5 text-red-600 dark:text-red-300">{status.error}</p>}
          {message && <p className="mt-3 rounded-lg bg-ink/[0.06] px-2.5 py-2 leading-5 dark:bg-white/10">{message}</p>}
          <button
            type="button"
            onClick={resync}
            disabled={busy || !status.online}
            className="mt-3 w-full rounded-lg bg-ink px-3 py-2.5 text-xs font-bold text-white disabled:opacity-50 dark:bg-lime dark:text-ink"
          >
            {busy ? "Đang đồng bộ..." : "Đồng bộ lại ngay"}
          </button>
        </div>
      )}
    </div>
  );
}
