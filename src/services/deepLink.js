/**
 * Mở một mục cụ thể (bài ngữ pháp, bài nghe, từ vựng...) từ tìm kiếm toàn cục.
 *
 * Module đích được lazy-load nên có thể mount SAU khi sự kiện được bắn ra.
 * Vì vậy yêu cầu được lưu lại và module đích tự `consumePendingItem` khi mount.
 */
export const OPEN_ITEM_EVENT = "lingua:open-item";

let pending = null;

export const isPotentialItem = (value) =>
  Boolean(value && typeof value === "object" && typeof value.tab === "string");

/** Điều hướng tới tab và ghi nhớ mục cần mở. */
export const openItem = ({ tab, itemId = null, type = "item", query = "" }) => {
  pending = { tab, itemId, type, query };
  window.dispatchEvent(new CustomEvent(OPEN_ITEM_EVENT, { detail: pending }));
};

/** Đọc và xoá yêu cầu đang chờ (dùng trong useEffect khi module mount). */
export const consumePendingItem = (tab) => {
  if (!pending || (tab && pending.tab !== tab)) return null;
  const value = pending;
  pending = null;
  return value;
};

/** Xem trước mà không xoá — dùng khi cần kiểm tra trong effect theo dõi. */
export const peekPendingItem = (tab) => (!pending || (tab && pending.tab !== tab) ? null : pending);

export const subscribeOpenItem = (handler) => {
  window.addEventListener(OPEN_ITEM_EVENT, handler);
  return () => window.removeEventListener(OPEN_ITEM_EVENT, handler);
};
