import { loadUserDoc, saveUserDoc, userDocKeys } from "./userDocService";

/**
 * Nhắc học hằng ngày bằng Web Notification.
 * Lưu ý: thông báo chỉ hiện khi app còn mở (tab hoặc PWA đang chạy) vì chưa có push server.
 */
export const defaultReminder = { enabled: false, time: "20:00", lastNotifiedDate: null };

export const loadReminder = async () => ({
  ...defaultReminder,
  ...((await loadUserDoc(userDocKeys.reminder))?.payload || {}),
});

export const saveReminder = (settings) => saveUserDoc(userDocKeys.reminder, settings);

export const reminderChangedEvent = "lingua:reminder-changed";
export const notifyReminderChanged = (settings) => {
  window.dispatchEvent(new CustomEvent(reminderChangedEvent, { detail: settings }));
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

export const todayKey = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

export const minutesNow = (date = new Date()) => date.getHours() * 60 + date.getMinutes();

export const minutesOf = (time = "20:00") => {
  const [hours, minutes] = String(time).split(":").map(Number);
  return (Number.isFinite(hours) ? hours : 20) * 60 + (Number.isFinite(minutes) ? minutes : 0);
};

export const isReminderDue = (settings, now = new Date()) =>
  Boolean(settings?.enabled) &&
  settings.lastNotifiedDate !== todayKey(now) &&
  minutesNow(now) >= minutesOf(settings.time);

export const reminderBody = (streak) =>
  streak?.currentStreak
    ? `Bạn đang giữ chuỗi ${streak.currentStreak} ngày học. Ôn vài từ để không đứt chuỗi nhé!`
    : "Học vài từ hôm nay để bắt đầu chuỗi ngày học của bạn nhé!";
