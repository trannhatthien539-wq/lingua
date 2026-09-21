/**
 * Nhắc học trên app APK bằng Local Notifications (không cần server).
 *
 * Trên web, `reminderService` chỉ hiện thông báo khi app còn mở. Trên thiết bị (Capacitor),
 * plugin này cho phép lên lịch thông báo hằng ngày để nhắc học kể cả khi app đã đóng.
 *
 * Plugin chỉ được nạp động (dynamic import) nên bundle web không phình thêm.
 */
import { isCapacitor } from "./platform";
import { formatTime, timeParts } from "../utils/reminderSchedule";

const NOTIFICATION_ID = 1001;
const TEST_NOTIFICATION_ID = 1002;
const CHANNEL_ID = "lingua-reminder";

const loadPlugin = async () => {
  if (!nativeNotificationsAvailable()) return null;
  try {
    const module = await import("@capacitor/local-notifications");
    return module.LocalNotifications || null;
  } catch (error) {
    console.warn("Không nạp được plugin thông báo cục bộ.", error);
    return null;
  }
};

export const nativeNotificationsAvailable = () => {
  if (!isCapacitor()) return false;
  // Chỉ dùng khi plugin thực sự có trên thiết bị (đề phòng APK cũ chưa `cap sync`).
  return window.Capacitor?.isPluginAvailable?.("LocalNotifications") ?? true;
};

export const requestNativePermission = async () => {
  const plugin = await loadPlugin();
  if (!plugin) return "unsupported";
  try {
    const result = await plugin.checkPermissions();
    if (result?.display === "granted") return "granted";
    const requested = await plugin.requestPermissions();
    return requested?.display === "granted" ? "granted" : "denied";
  } catch {
    return "denied";
  }
};

const buildBody = (streak) =>
  streak?.currentStreak > 0
    ? `Bạn đang có chuỗi ${streak.currentStreak} ngày. Vào học 15 phút để giữ chuỗi nhé!`
    : "Vào học 15 phút để bắt đầu chuỗi ngày học của bạn!";

const ensureChannel = async (plugin) => {
  // Android 8+ cần channel để thông báo hiện đúng kiểu.
  if (!plugin.createChannel) return;
  try {
    await plugin.createChannel({
      id: CHANNEL_ID,
      name: "Nhắc học",
      description: "Thông báo nhắc học hằng ngày của Lingua",
      importance: 4,
      visibility: 1,
    });
  } catch (error) {
    console.warn("Lingua: không tạo được kênh thông báo.", error);
  }
};

/**
 * Đồng bộ lịch nhắc học với thiết bị: bật thì lên lịch hằng ngày, tắt thì huỷ.
 * Trả về `{ status, time }` với `status` là
 * `'scheduled' | 'cancelled' | 'unsupported' | 'denied' | 'error'`.
 *
 * Không bao giờ ném lỗi — Cài đặt hiển thị đúng `status` để biết vì sao không có thông báo.
 */
export const syncNativeReminder = async (settings, streak) => {
  const plugin = await loadPlugin();
  if (!plugin) return { status: "unsupported", time: null };

  if (!settings?.enabled) {
    try {
      await plugin.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
    } catch {
      // Chưa có lịch nào thì bỏ qua.
    }
    return { status: "cancelled", time: null };
  }

  const time = formatTime(settings.time);
  const permission = await requestNativePermission();
  if (permission !== "granted") return { status: "denied", time };

  const { hour, minute } = timeParts(settings.time);

  try {
    await ensureChannel(plugin);
    // Huỷ lịch cũ trước khi đặt lịch mới (cùng id nên lịch mới sẽ thay lịch cũ).
    await plugin.cancel({ notifications: [{ id: NOTIFICATION_ID }] }).catch(() => {});
    await plugin.schedule({
      notifications: [
        {
          id: NOTIFICATION_ID,
          title: "Đến giờ học rồi! 📚",
          body: buildBody(streak),
          channelId: CHANNEL_ID,
          schedule: { on: { hour, minute }, allowWhileIdle: true, repeats: true },
        },
      ],
    });
    return { status: "scheduled", time };
  } catch (error) {
    console.warn("Không lên lịch được thông báo nhắc học.", error);
    return { status: "error", time };
  }
};

/** Đọc lịch thông báo mà hệ điều hành đang giữ (dùng cho phần chẩn đoán trong Cài đặt). */
export const readNativeSchedule = async () => {
  const plugin = await loadPlugin();
  if (!plugin?.getPending) return null;
  try {
    const pending = await plugin.getPending();
    const list = Array.isArray(pending?.notifications) ? pending.notifications : [];
    const reminder = list.find((item) => item?.id === NOTIFICATION_ID) || null;
    return { count: list.length, scheduled: Boolean(reminder), at: reminder?.schedule?.at || null };
  } catch {
    return null;
  }
};

/** Gửi thử một thông báo cục bộ sau 5 giây để kiểm tra quyền và kênh thông báo. */
export const sendNativeTestNotification = async (streak) => {
  const plugin = await loadPlugin();
  if (!plugin) return false;
  const permission = await requestNativePermission();
  if (permission !== "granted") return false;
  try {
    await ensureChannel(plugin);
    await plugin.schedule({
      notifications: [
        {
          id: TEST_NOTIFICATION_ID,
          title: "Đến giờ học rồi! 📚",
          body: buildBody(streak),
          channelId: CHANNEL_ID,
          schedule: { at: new Date(Date.now() + 5000) },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
};
