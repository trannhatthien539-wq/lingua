/**
 * Hệ thống thông báo dùng chung: mọi module gọi `toast.success/error/info/undo`
 * thay vì tự dựng banner riêng. `Toaster` trong App sẽ hiển thị.
 */
const listeners = new Set();
let counter = 0;

const emit = (item) => {
  listeners.forEach((listener) => listener(item));
};

export const subscribeToast = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const showToast = ({ message, tone = "info", action, duration = 3500 }) => {
  if (!message) return null;
  const item = { id: (counter += 1), message: String(message), tone, action, duration };
  emit(item);
  return item.id;
};

const withDefaults = (tone, defaultDuration) => (message, options = {}) =>
  showToast({ ...options, message, tone, duration: options.duration ?? defaultDuration });

export const toast = {
  success: withDefaults("success", 3200),
  error: withDefaults("error", 5200),
  info: withDefaults("info", 3600),
  /** Thông báo có hành động, ví dụ "Hoàn tác" — để lâu hơn cho người dùng kịp bấm. */
  undo: (message, action) => showToast({ message, tone: "info", action, duration: 10000 }),
};
