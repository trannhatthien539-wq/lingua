import { loadUserDoc, readCachedUserDoc, saveUserDoc, userDocKeys } from "./userDocService";
import { normalizeReminder } from "../utils/reminderSchedule";

/**
 * Nhắc học hằng ngày bằng Web Notification.
 * Lưu ý: thông báo của web chỉ hiện khi app còn mở (tab hoặc PWA đang chạy) vì chưa có push server.
 * Trên APK, `services/localNotifications.js` lên lịch thông báo của hệ điều hành.
 *
 * Chuẩn hoá giờ / tính thời điểm nhắc nằm ở `src/utils/reminderSchedule.js` (thuần, có test).
 */
export * from "../utils/reminderSchedule";

/**
 * Đọc cấu hình nhắc học: bản trên đám mây (nếu có) hoặc bản trên thiết bị.
 *
 * Không ném lỗi ra ngoài: mất mạng hoặc bị chặn quyền thì giữ bản đã lưu trên thiết bị
 * (trước đây lỗi đọc bị coi như "chưa có" nên ô Giờ nhắc nhảy về 20:00 như bị reset).
 */
export const loadReminder = async () => {
  try {
    const doc = await loadUserDoc(userDocKeys.reminder);
    if (doc?.payload) return normalizeReminder(doc.payload);
  } catch (error) {
    console.warn("Lingua: không tải được cấu hình nhắc học từ đám mây, dùng bản trên thiết bị.", error);
  }
  return normalizeReminder(readCachedUserDoc(userDocKeys.reminder));
};

export const saveReminder = (settings) => saveUserDoc(userDocKeys.reminder, normalizeReminder(settings));

export const reminderChangedEvent = "lingua:reminder-changed";
export const notifyReminderChanged = (settings) => {
  window.dispatchEvent(new CustomEvent(reminderChangedEvent, { detail: normalizeReminder(settings) }));
};

export const notificationSupported = () => typeof window !== "undefined" && "Notification" in window;
export const notificationPermission = () => (notificationSupported() ? Notification.permission : "unsupported");

export const requestNotificationPermission = async () => {
  if (!notificationSupported()) return "unsupported";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
};

const iconUrl = () => `${import.meta.env.BASE_URL}icons/icon-192.svg`;

export const showStudyNotification = async (title, body) => {
  if (notificationPermission() !== "granted") return false;
  const options = { body, icon: iconUrl(), badge: iconUrl(), tag: "lingua-study-reminder" };
  try {
    const registration = await navigator.serviceWorker?.getRegistration?.();
    if (registration?.showNotification) {
      await registration.showNotification(title, options);
      return true;
    }
  } catch {
    // Trình duyệt không cho dùng service worker -> dùng Notification trực tiếp.
  }
  try {
    new Notification(title, options);
    return true;
  } catch {
    return false;
  }
};

