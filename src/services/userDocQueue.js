/**
 * Hàng đợi ghi có debounce cho tài liệu người dùng.
 *
 * Điểm quan trọng: `ownerUid` được khóa NGAY khi lệnh ghi được xếp hàng. Lúc flush
 * không bao giờ đọc lại `auth.currentUser`, nên một lệnh đã xếp hàng cho tài khoản A
 * sẽ không thể bị ghi nhầm sang tài khoản B nếu người dùng đăng xuất/đổi tài khoản
 * trước khi hết thời gian debounce.
 *
 * Module này cố ý không import Firebase để có thể viết unit test độc lập.
 */

const queues = new Set();

const defaultTimers = {
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (id) => clearTimeout(id),
};

/**
 * @param {object} options
 * @param {string} options.key Khóa tài liệu (goal, history, …).
 * @param {number} [options.delay] Thời gian debounce (ms).
 * @param {(payload: unknown, ownerUid: string | null, updatedAt: number) => Promise<unknown>} options.save
 * @param {() => string | null} [options.ownerOf] Đọc owner hiện tại đúng một lần lúc schedule.
 * @param {{setTimeout: Function, clearTimeout: Function}} [options.timers]
 */
export function createOwnerPinnedQueue({
  key,
  delay = 900,
  save,
  ownerOf = () => null,
  timers = defaultTimers,
}) {
  let timer = null;
  let pending = null;
  let disposed = false;

  const clearTimer = () => {
    if (timer === null) return;
    timers.clearTimeout(timer);
    timer = null;
  };

  const flush = async () => {
    clearTimer();
    if (!pending) return null;
    const job = pending;
    pending = null;
    return save(job.payload, job.ownerUid, job.updatedAt);
  };

  const cancel = () => {
    clearTimer();
    pending = null;
  };

  const schedule = (payload) => {
    if (disposed) return;
    const ownerUid = ownerOf() ?? null;
    const updatedAt = Date.now();

    // Nếu hàng đợi còn dữ liệu của owner khác (ví dụ vừa đổi tài khoản), ghi nốt
    // dữ liệu đó với đúng owner cũ trước khi thay bằng lệnh mới. Tuyệt đối không
    // trộn payload của hai tài khoản vào cùng một lần ghi.
    if (pending && pending.ownerUid !== ownerUid) {
      const previous = pending;
      pending = null;
      clearTimer();
      Promise.resolve(save(previous.payload, previous.ownerUid, previous.updatedAt)).catch(() => {});
    }

    pending = { payload, ownerUid, updatedAt };
    clearTimer();
    timer = timers.setTimeout(() => {
      flush().catch(() => {
        // Lỗi đã được ghi nhận vào trạng thái đồng bộ; bản local vẫn còn.
      });
    }, delay);
  };

  const api = {
    key,
    schedule,
    flush,
    cancel,
    /** Rời khỏi registry khi hook/module không còn dùng nữa. */
    dispose: () => {
      disposed = true;
      clearTimer();
      queues.delete(api);
    },
    get pending() {
      return pending;
    },
  };

  queues.add(api);
  return api;
}

/** Flush toàn bộ hàng đợi đang đăng ký (dùng trước khi sign-out). */
export const flushAllDocQueues = () =>
  Promise.allSettled([...queues].map((queue) => queue.flush()));

/** Hủy toàn bộ lệnh đang chờ mà không ghi (dùng sau khi đã đổi tài khoản). */
export const cancelAllDocQueues = () => {
  for (const queue of queues) queue.cancel();
};

export const docQueueCount = () => queues.size;
