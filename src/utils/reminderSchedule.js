/**
 * Phần "thuần" của nhắc học hằng ngày: chuẩn hoá giờ, tính lúc nào cần nhắc.
 *
 * Tách khỏi `services/reminderService.js` (phần đó cần firebase + DOM) để:
 * - test được bằng Node (`tests/reminderSchedule.test.js`),
 * - dùng chung cho cả thông báo của web lẫn lịch của hệ điều hành trên APK.
 */
export const DEFAULT_REMINDER_TIME = "20:00";

/** Cấu hình mặc định khi người dùng chưa từng đặt nhắc học. */
export const defaultReminder = { enabled: false, time: DEFAULT_REMINDER_TIME, lastNotifiedDate: null };

/**
 * Chuẩn hoá "HH:mm"; trả `null` nếu giá trị trống/sai.
 * Quan trọng: hộp chọn giờ của Android có thể trả về chuỗi rỗng khi người dùng bấm huỷ,
 * nếu lưu chuỗi rỗng thì ô nhập sẽ hiện lại "20:00" như bị reset.
 */
export const normalizeTime = (time) => {
  const match = String(time ?? "").trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours > 23 || minutes > 59) return null;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/** Giờ dùng để hiển thị (luôn có giá trị hợp lệ). */
export const formatTime = (time) => normalizeTime(time) || DEFAULT_REMINDER_TIME;

/** Tách "HH:mm" thành số giờ/phút. */
export const timeParts = (time = DEFAULT_REMINDER_TIME) => {
  const [hour, minute] = formatTime(time).split(":").map(Number);
  return { hour, minute };
};

/** Chỉnh cấu hình nhắc học về dạng an toàn (dùng cho cả đọc và ghi). */
export const normalizeReminder = (payload, base = defaultReminder) => {
  const source = payload && typeof payload === "object" ? payload : {};
  const lastNotifiedDate = typeof source.lastNotifiedDate === "string" ? source.lastNotifiedDate : null;
  return {
    enabled: Boolean(source.enabled),
    time: normalizeTime(source.time) || formatTime(base?.time),
    lastNotifiedDate,
  };
};

/** Khoá ngày theo giờ địa phương (YYYY-MM-DD). */
export const todayKey = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

export const minutesNow = (date = new Date()) => date.getHours() * 60 + date.getMinutes();

export const minutesOf = (time = DEFAULT_REMINDER_TIME) => {
  const { hour, minute } = timeParts(time);
  return hour * 60 + minute;
};

/** Đã tới giờ nhắc hôm nay và hôm nay chưa nhắc hay chưa. */
export const isReminderDue = (settings, now = new Date()) =>
  Boolean(settings?.enabled) &&
  settings.lastNotifiedDate !== todayKey(now) &&
  minutesNow(now) >= minutesOf(settings.time);

/**
 * Lúc nào sẽ nhắc tiếp theo (dùng để hiển thị trong Cài đặt).
 * Trả `null` khi nhắc học đang tắt.
 */
export const nextReminderAt = (settings, now = new Date()) => {
  if (!settings?.enabled) return null;
  const { hour, minute } = timeParts(settings.time);
  const at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
  if (isReminderDue(settings, now)) return at;
  if (at.getTime() > now.getTime()) return at;
  at.setDate(at.getDate() + 1);
  return at;
};

/** Mô tả ngắn "hôm nay lúc 20:00" / "mai lúc 20:00" / "trong ít phút tới" cho phần Cài đặt. */
export const describeNextReminder = (settings, now = new Date()) => {
  if (!settings?.enabled) return "";
  if (isReminderDue(settings, now)) return "trong ít phút tới";
  const at = nextReminderAt(settings, now);
  if (!at) return "";
  const sameDay = todayKey(at) === todayKey(now);
  const hh = String(at.getHours()).padStart(2, "0");
  const mm = String(at.getMinutes()).padStart(2, "0");
  return sameDay ? `hôm nay lúc ${hh}:${mm}` : `mai lúc ${hh}:${mm}`;
};

/** Nội dung thông báo nhắc học (dựa trên chuỗi ngày học). */
export const reminderBody = (streak) =>
  streak?.currentStreak
    ? `Bạn đang giữ chuỗi ${streak.currentStreak} ngày học. Ôn vài từ để không đứt chuỗi nhé!`
    : "Học vài từ hôm nay để bắt đầu chuỗi ngày học của bạn nhé!";
