/**
 * Trạng thái đồng bộ dùng chung cho toàn app:
 * - theo dõi online/offline
 * - đếm số thao tác ghi đang chờ ("Đang lưu...")
 * - phát sự kiện `lingua:data-refresh` để các module tải lại dữ liệu từ đám mây
 */
const listeners = new Set();

const state = {
  online: typeof navigator === "undefined" ? true : navigator.onLine !== false,
  pending: 0,
  lastSyncedAt: null,
  error: "",
};

const emit = () => listeners.forEach((listener) => listener({ ...state }));

const setState = (patch) => {
  Object.assign(state, patch);
  emit();
};

export const getSyncStatus = () => ({ ...state });

export const subscribeSyncStatus = (listener) => {
  listeners.add(listener);
  listener({ ...state });
  return () => listeners.delete(listener);
};

export const refreshRequestedEvent = "lingua:data-refresh";

export const requestDataRefresh = () => {
  if (typeof window === "undefined") return false;
  if (!state.online) {
    setState({ error: "Thiết bị đang ngoại tuyến. Hãy kết nối mạng rồi thử lại." });
    return false;
  }
  setState({ error: "" });
  window.dispatchEvent(new Event(refreshRequestedEvent));
  return true;
};

/** Bọc mọi thao tác ghi để UI biết đang lưu / lỗi / lần đồng bộ gần nhất. */
export const trackPendingWrite = async (operation) => {
  setState({ pending: state.pending + 1, error: "" });
  try {
    const result = await operation();
    setState({ lastSyncedAt: Date.now(), online: true });
    return result;
  } catch (error) {
    setState({ error: error?.message || "Không thể đồng bộ dữ liệu." });
    throw error;
  } finally {
    setState({ pending: Math.max(0, state.pending - 1) });
  }
};

export const markSynced = () => setState({ lastSyncedAt: Date.now(), error: "" });
export const reportSyncError = (message) => setState({ error: message || "Không thể đồng bộ dữ liệu." });

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    setState({ online: true, error: "" });
    requestDataRefresh();
  });
  window.addEventListener("offline", () => setState({ online: false }));
}
