import { useRef, useState } from "react";
import { BellRing, CloudDownload, CloudUpload, RefreshCw, ShieldCheck } from "lucide-react";
import SyncStatusBadge from "./ui/SyncStatusBadge";
import { downloadBackup, importBackup } from "../services/backupService";
import {
  notificationPermission,
  reminderBody,
  requestNotificationPermission,
  showStudyNotification,
} from "../services/reminderService";
import { requestDataRefresh } from "../services/syncStatus";
import { notifyReminderChanged } from "../services/reminderService";
import { reloadHistory } from "../services/historyService";

const permissionLabels = {
  granted: "Trình duyệt đã cho phép thông báo.",
  denied: "Trình duyệt đang chặn thông báo. Hãy bật lại trong cài đặt trang web.",
  default: "Cần bạn cho phép để hiện thông báo nhắc học.",
  unsupported: "Thiết bị/trình duyệt này không hỗ trợ thông báo.",
};

export default function AccountDataPanel({ user, streak, reminderSettings, onUpdateReminder }) {
  const [permission, setPermission] = useState(notificationPermission);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const fileRef = useRef(null);

  const settings = reminderSettings || { enabled: false, time: "20:00" };

  const flash = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 4200);
  };

  const toggleReminder = async (enabled) => {
    if (!enabled) {
      await onUpdateReminder({ enabled: false }).catch(() => flash("Không thể lưu cài đặt nhắc học."));
      return;
    }
    const result = permission === "granted" ? "granted" : await requestNotificationPermission();
    setPermission(result);
    if (result !== "granted") {
      flash(permissionLabels[result] || permissionLabels.default);
      return;
    }
    await onUpdateReminder({ enabled: true }).catch(() => flash("Không thể lưu cài đặt nhắc học."));
    flash(`Đã bật nhắc học lúc ${settings.time}.`);
  };

  const testNotification = async () => {
    const result = permission === "granted" ? "granted" : await requestNotificationPermission();
    setPermission(result);
    if (result !== "granted") {
      flash(permissionLabels[result] || permissionLabels.default);
      return;
    }
    const shown = await showStudyNotification("Đến giờ học rồi! 📚", reminderBody(streak));
    flash(shown ? "Đã gửi thông báo thử." : "Không thể hiện thông báo trên thiết bị này.");
  };

  const syncNow = async () => {
    setBusy("sync");
    try {
      const requested = requestDataRefresh();
      await reloadHistory();
      flash(requested ? "Đã tải lại dữ liệu mới nhất." : "Thiết bị đang ngoại tuyến, chưa thể đồng bộ.");
    } finally {
      setBusy("");
    }
  };

  const exportAll = async () => {
    setBusy("export");
    try {
      const result = await downloadBackup();
      flash(`Đã xuất ${result.decks} bộ thẻ và ${result.cards} từ vựng cùng cài đặt học tập.`);
    } catch (error) {
      flash(error.message || "Không thể xuất dữ liệu.");
    } finally {
      setBusy("");
    }
  };

  const restoreFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy("import");
    try {
      const backup = JSON.parse(await file.text());
      const result = await importBackup(backup);
      await reloadHistory();
      if (backup.reminder) notifyReminderChanged(backup.reminder);
      requestDataRefresh();
      flash(`Đã khôi phục: thêm ${result.decks} bộ thẻ, ${result.cards} từ vựng, ${result.docs} nhóm cài đặt.`);
    } catch (error) {
      flash(error.message || "File sao lưu không hợp lệ.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="mt-5 space-y-4 border-t border-ink/[0.08] pt-5 dark:border-white/[0.08]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold">
          <ShieldCheck size={15} className="text-sage" />
          Trạng thái đồng bộ
        </div>
        <div className="flex items-center gap-2">
          <SyncStatusBadge user={user} />
          <button
            type="button"
            onClick={syncNow}
            disabled={busy === "sync"}
            className="flex items-center gap-1.5 rounded-lg border border-ink/10 px-3 py-2 text-[11px] font-bold disabled:opacity-50 dark:border-white/10"
          >
            <RefreshCw size={13} className={busy === "sync" ? "animate-spin" : ""} />
            Đồng bộ lại
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-ink/[0.08] p-4 dark:border-white/[0.08]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-bold">
            <BellRing size={16} /> Nhắc học hằng ngày
          </p>
          <button
            type="button"
            onClick={() => toggleReminder(!settings.enabled)}
            role="switch"
            aria-checked={Boolean(settings.enabled)}
            className={`relative h-6 w-11 rounded-full transition ${settings.enabled ? "bg-lime" : "bg-ink/15 dark:bg-white/20"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all dark:bg-[#202724] ${settings.enabled ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold">
            Giờ nhắc
            <input
              type="time"
              value={settings.time || "20:00"}
              onChange={(event) => onUpdateReminder({ time: event.target.value }).catch(() => flash("Không thể lưu giờ nhắc."))}
              className="rounded-lg border border-ink/10 bg-transparent px-2.5 py-2 text-xs outline-none dark:border-white/10"
            />
          </label>
          <button
            type="button"
            onClick={testNotification}
            className="rounded-lg border border-ink/10 px-3 py-2 text-[11px] font-bold dark:border-white/10"
          >
            Thử thông báo
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-5 text-ink/45 dark:text-white/45">
          {permissionLabels[permission] || permissionLabels.default} Thông báo chỉ hiện khi Lingua đang mở (tab hoặc PWA đang chạy).
        </p>
      </div>

      <div className="rounded-xl border border-ink/[0.08] p-4 dark:border-white/[0.08]">
        <p className="flex items-center gap-2 text-sm font-bold">
          <CloudDownload size={16} /> Sao lưu &amp; khôi phục
        </p>
        <p className="mt-2 text-[11px] leading-5 text-ink/45 dark:text-white/45">
          File sao lưu gồm bộ thẻ, tiến độ từ vựng, kế hoạch học, mindmap, bản nháp ngữ pháp, nhắc học và streak.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportAll}
            disabled={busy === "export"}
            className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-xs font-bold text-white disabled:opacity-50 dark:bg-lime dark:text-ink"
          >
            <CloudDownload size={15} />
            {busy === "export" ? "Đang xuất..." : "Xuất toàn bộ dữ liệu"}
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={restoreFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy === "import"}
            className="flex items-center gap-2 rounded-xl border border-ink/10 px-3 py-2.5 text-xs font-bold disabled:opacity-50 dark:border-white/10"
          >
            <CloudUpload size={15} />
            {busy === "import" ? "Đang khôi phục..." : "Nhập bản sao lưu"}
          </button>
        </div>
      </div>

      {message && (
        <p className="rounded-xl bg-ink/[0.05] px-3 py-2.5 text-xs leading-5 dark:bg-white/10" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
