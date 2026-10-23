import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  createDebouncedSync,
  getUserDocOwner,
  getUserDocStore,
  loadUserDoc,
  subscribeUserDocOwner,
} from "../services/userDocService";
import { refreshRequestedEvent, reportSyncError } from "../services/syncStatus";

/**
 * Đồng bộ một "tài liệu" trạng thái của module với đám mây (kèm bản trên thiết bị).
 *
 * - Mọi hook cùng `key` dùng chung một external store theo chủ sở hữu, nên hai nơi
 *   như Sidebar và Home luôn thấy cùng một giá trị ngay lập tức.
 * - `initial`: giá trị hiển thị ngay từ localStorage để không phải chờ mạng.
 * - `normalize`: chuẩn hoá payload tải về trước khi dùng.
 * - Tự tải lại khi có sự kiện `lingua:data-refresh` (nút "Đồng bộ lại" hoặc khi có mạng lại).
 */
export default function useCloudDoc(key, { initial, normalize, select, debounce = 900 } = {}) {
  const uid = useSyncExternalStore(subscribeUserDocOwner, getUserDocOwner, () => null);
  const store = useMemo(() => getUserDocStore(key, uid), [key, uid]);
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const syncer = useMemo(() => createDebouncedSync(key, debounce), [key, debounce]);

  const initialRef = useRef(initial);
  const normalizeRef = useRef(normalize);
  const selectRef = useRef(select);
  const lastSavedRef = useRef(null);
  initialRef.current = initial;
  normalizeRef.current = normalize;
  selectRef.current = select;

  const hydrate = useCallback(
    async ({ silent = false, force = false } = {}) => {
      try {
        const doc = await loadUserDoc(key, { force });
        const current = store.getSnapshot();
        if (doc && doc.payload !== undefined) {
          const currentValue = current.value !== undefined ? current.value : initialRef.current;
          const nextValue = normalizeRef.current
            ? normalizeRef.current(doc.payload, currentValue)
            : doc.payload;
          const updatedAt = Number(doc.updatedAt) || Date.now();

          // Nếu người dùng vừa sửa trong lúc mạng đang tải, giữ bản mới hơn.
          if (!current.updatedAt || updatedAt >= current.updatedAt) {
            store.setValue(nextValue, { ready: true, updatedAt });
            const payload = selectRef.current ? selectRef.current(nextValue) : nextValue;
            lastSavedRef.current = JSON.stringify(payload ?? null);
          } else {
            store.markReady();
          }
        } else {
          store.markReady();
        }
      } catch (error) {
        if (!silent) reportSyncError(error?.message);
        store.markReady();
      }
    },
    [key, store],
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const handleRefresh = () => hydrate({ silent: true, force: true });
    window.addEventListener(refreshRequestedEvent, handleRefresh);
    return () => window.removeEventListener(refreshRequestedEvent, handleRefresh);
  }, [hydrate]);

  useEffect(() => {
    syncer.attach();
    return () => syncer.dispose();
  }, [syncer]);

  const setValue = useCallback(
    (next) => {
      const current = store.getSnapshot().value ?? initialRef.current;
      const resolved = typeof next === "function" ? next(current) : next;
      const payload = selectRef.current ? selectRef.current(resolved) : resolved;
      const serialized = JSON.stringify(payload ?? null);

      store.setValue(resolved, { ready: true, updatedAt: Date.now() });
      // Bỏ qua các thay đổi không ảnh hưởng dữ liệu lưu (ví dụ đồng hồ Pomodoro chạy từng giây).
      if (serialized === lastSavedRef.current) return;
      lastSavedRef.current = serialized;
      syncer.schedule(payload);
    },
    [store, syncer],
  );

  const value = snapshot.value !== undefined ? snapshot.value : initialRef.current;
  return { value, setValue, ready: snapshot.ready, reload: () => hydrate({ force: true }) };
}
