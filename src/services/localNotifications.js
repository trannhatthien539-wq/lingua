/**
 * Nhắc học trên app APK bằng Local Notifications (không cần server).
 *
 * Trên web, `reminderService` chỉ hiện thông báo khi app còn mở. Trên thiết bị (Capacitor),
 * plugin này cho phép lên lịch thông báo hằng ngày để nhắc học kể cả khi app đã đóng.
 *
 * Plugin chỉ được nạp động (dynamic import) nên bundle web không phình thêm.
 */
import { isCapacitor } from "./platform";

const NOTIFICATION_ID = 1001;
const CHANNEL_ID = "lingua-reminder";

const loadPlugin = async () => {
  if (!isCapacitor()) return null;
  try {
    const module = await import("@capacitor/local-notifications");
    return module.LocalNotifications || null;
  } catch (error) {
    console.warn("Không nạp được plugin thông báo cục bộ.", error);
    return null;
  }
};

export const nativeNotificationsAvailable = () => isCapacitor();

const parseTime = (time = "20:00") => {
  const [hour, minute] = String(time).split(":");
  const hours = Number(hour);
  const minutes = Number(minute);
  return {
    hour: Number.isFinite(hours) ? Math.min(23, Math.max(0, hours)) : 20,
    minute: Number.isFinite(minutes) ? Math.min(59, Math.max(0, minutes)) : 0,
  };
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

/**
 * Đồng bộ lịch nhắc học với thiết bị: bật thì lên lịch hằng ngày, tắt thì huỷ.
 * Trả về `'scheduled' | 'cancelled' | 'unsupported' | 'denied'`.
 */
export const syncNativeReminder = async (settings, streak) => {
  const plugin = await loadPlugin();
  if (!plugin) return "unsupported";

  try {
    await plugin.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
  } catch {
    // Chưa có lịch nào thì bỏ qua.
  }

  if (!settings?.enabled) return "cancelled";

  const permission = await requestNativePermission();
  if (permission !== "granted") return "denied";

  const { hour, minute } = parseTime(settings.time);

  try {
    // Android 8+ cần channel để thông báo hiện đúng kiểu.
    if (plugin.createChannel) {
      await plugin.createChannel({
        id: CHANNEL_ID,
        name: "Nhắc học",
        description: "Thông báo nhắc học hằng ngày của Lingua",
        importance: 4,
        visibility: 1,
      });
    }
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
    return "scheduled";
  } catch (error) {
    console.warn("Không lên lịch được thông báo nhắc học.", error);
    return "unsupported";
  }
};

/** Gửi thử một thông báo cục bộ sau 5 giây để kiểm tra quyền và kênh thông báo. */
export const sendNativeTestNotification = async (streak) => {
  const plugin = await loadPlugin();
  if (!plugin) return false;
  const permission = await requestNativePermission();
  if (permission !== "granted") return false;
  try {
    await plugin.schedule({
      notifications: [
        {
          id: NOTIFICATION_ID + 1,
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
