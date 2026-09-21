import { useEffect, useRef, useState } from "react";
import { BellRing, CloudDownload, CloudUpload, Database, Grid2x2, RefreshCw, ShieldCheck } from "lucide-react";
import CollapsibleCard from "./ui/CollapsibleCard";
import SyncStatusBadge from "./ui/SyncStatusBadge";
import useSectionState from "../hooks/useSectionState";
import { downloadBackup, importBackup } from "../services/backupService";
import {
  describeNextReminder,
  normalizeTime,
  notificationPermission,
  reminderBody,
  requestNotificationPermission,
  showStudyNotification,
  notifyReminderChanged,
} from "../services/reminderService";
import {
  nativeNotificationsAvailable,
  requestNativePermission,
  sendNativeTestNotification,
} from "../services/localNotifications";
import { requestDataRefresh } from "../services/syncStatus";
import { readWidgetStatus, readWidgetSummary, widgetStatsChangedEvent } from "../services/widgetBridge";
import { reloadHistory } from "../services/historyService";

const permissionLabels = {
  granted: "Trình duyệt đã cho phép thông báo.",
  denied: "Trình duyệt đang chặn thông báo. Hãy bật lại trong cài đặt trang web.",
  default: "Cần bạn cho phép để hiện thông báo nhắc học.",
  unsupported: "Thiết bị/trình duyệt này không hỗ trợ thông báo.",
};

/** Trạng thái lịch thông báo của hệ điều hành trên APK (để biết vì sao không có thông báo). */
const nativeStatusLabels = {
  scheduled: "Hệ điều hành đã lên lịch nhắc hằng ngày — thông báo vẫn hiện dù bạn đã đóng app.",
  denied: "Android đang chặn thông báo của Lingua. Hãy bật lại ở Cài đặt → Ứng dụng → Lingua → Thông báo.",
  unsupported: "APK này chưa kèm plugin thông báo. Hãy cài bản APK mới nhất.",
  error: "Không lên lịch được thông báo trên thiết bị này.",
  cancelled: "Nhắc học đang tắt.",
  unknown: "Đang thiết lập lịch thông báo...",
};

export default function AccountDataPanel({ user, streak, reminderSettings, onUpdateReminder, reminderNative }) {
  const [open, toggleSection] = useSectionState("data", false);
  const [permission, setPermission] = useState(notificationPermission);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const [widgetStatus, setWidgetStatus] = useState(readWidgetStatus);
  const fileRef = useRef(null);

  const settings = reminderSettings || { enabled: false, time: "20:00" };
  const [widgetSummary, setWidgetSummary] = useState(readWidgetSummary);

  // Cập nhật phần xem trước mỗi khi số liệu thẻ đổi (VocabularyHub ghi lại).
  useEffect(() => {
    const sync = () => {
      setWidgetSummary(readWidgetSummary());
      setWidgetStatus(readWidgetStatus());
    };
    window.addEventListener(widgetStatsChangedEvent, sync);
    return () => window.removeEventListener(widgetStatsChangedEvent, sync);
  }, []);

  const isDevice = nativeNotificationsAvailable();

  const flash = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 4200);
  };

  /** Xin quyền thông báo: bản APK dùng quyền của hệ điều hành, web dùng Notification API. */
  const ensurePermission = async () => {
    if (isDevice) {
      const result = await requestNativePermission();
      setPermission(result === "granted" ? "granted" : result);
      return result;
    }
    const result = permission === "granted" ? "granted" : await requestNotificationPermission();
    setPermission(result);
    return result;
  };

  const toggleReminder = async (enabled, timeOverride) => {
    const time = timeOverride || settings.time;
    if (!enabled) {
      await onUpdateReminder({ enabled: false }).catch(() => flash("Không thể lưu cài đặt nhắc học."));
      return;
    }
    const result = await ensurePermission();
    if (result !== "granted") {
      flash(permissionLabels[result] || permissionLabels.default);
      return;
    }
    await onUpdateReminder({ enabled: true }).catch(() => flash("Không thể lưu cài đặt nhắc học."));
    flash(`Đã bật nhắc học lúc ${time}${isDevice ? " (thông báo của hệ điều hành)" : ""}.`);
  };

  /**
   * Chọn giờ nhắc = muốn được nhắc: lưu giờ, và nếu nhắc học đang tắt thì xin quyền + bật luôn.
   * Hộp chọn giờ của Android trả về chuỗi rỗng khi người dùng bấm huỷ — bỏ qua để không ghi
   * đè bằng giá trị rỗng (trước đây làm ô giờ nhảy về 20:00 như bị reset).
   */
  const changeTime = async (value) => {
    const time = normalizeTime(value);
    if (!time || time === settings.time) return;
    try {
      await onUpdateReminder({ time });
    } catch {
      flash("Không thể lưu giờ nhắc.");
      return;
    }
    if (!settings.enabled) await toggleReminder(true, time);
    else flash(`Đã đổi giờ nhắc thành ${time} hằng ngày.`);
  };

  const testNotification = async () => {
    const result = await ensurePermission();
    if (result !== "granted") {
      flash(permissionLabels[result] || permissionLabels.default);
      return;
    }
    if (isDevice) {
      const scheduled = await sendNativeTestNotification(streak);
      flash(scheduled ? "Thông báo thử sẽ hiện sau 5 giây (bạn có thể thoát app)." : "Không thể lên lịch thông báo trên thiết bị này.");
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
    <CollapsibleCard
      id="settings-data"
      icon={Database}
      eyebrow="Dữ liệu"
      title="Đồng bộ, nhắc học & sao lưu"
      description="Trạng thái đám mây, nhắc học hằng ngày, xuất và khôi phục dữ liệu"
      open={open}
      onToggle={toggleSection}
    >
    <div className="space-y-4">
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
            className="btn-secondary h-11 px-3.5 text-xs"
          >
            <RefreshCw size={14} className={busy === "sync" ? "animate-spin" : ""} />
            Đồng bộ lại
          </button>
        </div>
      </div>

      <div className="panel-flat p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-bold">
            <BellRing size={16} /> Nhắc học hằng ngày
          </p>
          <button
            type="button"
            onClick={() => toggleReminder(!settings.enabled)}
            role="switch"
            aria-checked={Boolean(settings.enabled)}
            aria-label="Bật nhắc học hằng ngày"
            className="flex h-11 w-14 shrink-0 items-center"
          >
            <span className={`relative h-7 w-12 rounded-full transition ${settings.enabled ? "bg-lime" : "bg-ink/15 dark:bg-white/25"}`}>
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-slab shadow transition-all dark:bg-dark3 ${settings.enabled ? "left-[22px]" : "left-0.5"}`} />
            </span>
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold">
            Giờ nhắc
            <input
              type="time"
              value={settings.time || "20:00"}
              onChange={(event) => changeTime(event.target.value)}
              className="h-11 rounded-xl border border-ink/10 bg-transparent px-2.5 text-sm outline-none dark:border-white/10"
            />
          </label>
          <button
            type="button"
            onClick={testNotification}
            className="btn-secondary h-11 px-3.5 text-xs"
          >
            Thử thông báo
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-ink/60 dark:text-white/55">
          {settings.enabled ? `Lần nhắc tới: ${describeNextReminder(settings) || "chưa xác định"}. ` : "Chọn giờ để Lingua bật nhắc học và xin quyền thông báo. "}
          {isDevice ? nativeStatusLabels[reminderNative?.status] || nativeStatusLabels.unknown : permissionLabels[permission] || permissionLabels.default}
        </p>
        {!isDevice && (
          <p className="mt-1 text-xs leading-5 text-ink/60 dark:text-white/55">
            Trên web, thông báo chỉ hiện khi Lingua đang mở (tab hoặc PWA đang chạy).
          </p>
        )}
        {isDevice && reminderNative?.status === "denied" && (
          <p className="mt-1 text-xs leading-5 text-danger">
            Lingua cũng sẽ thử nhắc ngay trong lúc app đang mở, nhưng cách chắc chắn nhất là bật quyền
            thông báo cho Lingua trong cài đặt Android.
          </p>
        )}
      </div>

      <div className="panel-flat p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Grid2x2 size={16} /> Widget màn hình chính
        </p>
        {widgetSummary ? (
          <div className="mt-2 rounded-xl border border-ink/[0.08] bg-ink/[0.03] p-3 dark:border-white/[0.08] dark:bg-white/[0.05]">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55 dark:text-white/55">{widgetSummary.title}</p>
            <p className="mt-1 font-display text-base font-bold text-sage">{widgetSummary.primary}</p>
            <p className="mt-0.5 text-xs text-ink/80 dark:text-white/80">{widgetSummary.secondary}</p>
            <p className="text-xs text-ink/65 dark:text-white/65">{widgetSummary.tertiary}</p>
            {widgetSummary.progressMax > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15">
                  <span
                    className="block h-full rounded-full bg-sage"
                    style={{ width: `${Math.round((Math.min(widgetSummary.progressValue, widgetSummary.progressMax) / widgetSummary.progressMax) * 100)}%` }}
                  />
                </span>
                <span className="text-[11px] font-semibold text-ink/60 dark:text-white/60">
                  {widgetSummary.progressValue}/{widgetSummary.progressMax}
                </span>
              </div>
            )}
            <p className="mt-1 text-[11px] text-ink/50 dark:text-white/50">{widgetSummary.footer}</p>
            <p className="mt-1 text-[11px] text-ink/50 dark:text-white/50">
              Nút trên widget: Ôn ngay · Ngữ pháp · VSTEP · Tiến độ
            </p>
          </div>
        ) : (
          <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/55">
            Mở tab Từ vựng một lần để Lingua tính số thẻ đến hạn và gửi ra widget.
          </p>
        )}
        {isDevice && (
          <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/55">
            {widgetStatus?.ok
              ? `Đã gửi nội dung ra widget${widgetStatus.at ? ` ${new Date(widgetStatus.at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : ""}.`
              : `Chưa gửi được ra widget: ${widgetStatus?.error || "đang chờ dữ liệu"}.`}
          </p>
        )}
        <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/55">
          Trên app Android: giữ vào chỗ trống ở màn hình chính → <strong>Widgets</strong> → <strong>Lingua</strong> → kéo widget ra. Widget tự cập nhật mỗi 30 phút và ngay khi bạn học trong app.
        </p>
      </div>

      <div className="panel-flat p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <CloudDownload size={16} /> Sao lưu &amp; khôi phục
        </p>
        <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/55">
          File sao lưu gồm bộ thẻ, tiến độ từ vựng, kế hoạch học, mindmap, bản nháp ngữ pháp, nhắc học và streak.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportAll}
            disabled={busy === "export"}
            className="btn-primary px-4 text-xs"
          >
            <CloudDownload size={16} />
            {busy === "export" ? "Đang xuất..." : "Xuất toàn bộ dữ liệu"}
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={restoreFile} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy === "import"}
            className="btn-secondary px-4 text-xs"
          >
            <CloudUpload size={16} />
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
    </CollapsibleCard>
  );
}
