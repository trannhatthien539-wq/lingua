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
    ? "border-warn/30 bg-warnbg text-warn dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-200"
    : status.error
      ? "border-danger/30 bg-dangerbg text-danger dark:border-dangerfgdark/40 dark:bg-dangerdark dark:text-dangerfgdark"
      : "border-ink/10 bg-slab text-ink/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70";

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
        className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition ${tone}`}
        title="Trạng thái đồng bộ dữ liệu"
        aria-label="Trạng thái đồng bộ dữ liệu"
      >
        <span className={`h-2 w-2 rounded-full ${!status.online ? "bg-warn" : status.pending > 0 ? "animate-pulse bg-sage" : status.error ? "bg-danger" : "bg-ok"}`} />
        {compact ? null : <span className="whitespace-nowrap">{label}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-[70] w-72 rounded-xl border border-ink/10 bg-slab p-4 text-xs shadow-soft dark:border-white/10 dark:bg-dark2">
          <p className="font-display text-sm font-bold">Đồng bộ dữ liệu</p>
          <p className="mt-1.5 leading-5 text-ink/70 dark:text-white/70">
            {user
              ? "Bộ thẻ, streak, kế hoạch và mindmap được lưu trên tài khoản của bạn."
              : "Bạn đang dùng chế độ Khách. Dữ liệu chỉ nằm trên thiết bị này."}
          </p>
          <ul className="mt-3 space-y-1 text-ink/70 dark:text-white/70">
            <li>Trạng thái: <b>{status.online ? "Có mạng" : "Ngoại tuyến"}</b></li>
            <li>Đang chờ lưu: <b>{status.pending}</b></li>
            <li>Lần đồng bộ gần nhất: <b>{status.lastSyncedAt ? formatTime(status.lastSyncedAt) : "—"}</b></li>
          </ul>
          {status.error && <p className="mt-3 rounded-lg bg-dangerbg px-2.5 py-2 leading-5 text-danger dark:bg-dangerdark dark:text-dangerfgdark">{status.error}</p>}
          {message && <p className="mt-3 rounded-lg bg-ink/[0.06] px-2.5 py-2 leading-5 dark:bg-white/10">{message}</p>}
          <button
            type="button"
            onClick={resync}
            disabled={busy || !status.online}
            className="btn-primary mt-3 h-11 w-full text-xs"
          >
            {busy ? "Đang đồng bộ..." : "Đồng bộ lại ngay"}
          </button>
        </div>
      )}
    </div>
  );
}
