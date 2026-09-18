import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createDebouncedSync, loadUserDoc } from "../services/userDocService";
import { refreshRequestedEvent, reportSyncError } from "../services/syncStatus";

/**
 * Đồng bộ một "tài liệu" trạng thái của module với đám mây (kèm bản trên thiết bị).
 *
 * - `initial`: giá trị hiển thị ngay từ localStorage để không phải chờ mạng.
 * - `normalize`: chuẩn hoá payload tải về trước khi dùng.
 * - Tự tải lại khi có sự kiện `lingua:data-refresh` (nút "Đồng bộ lại" hoặc khi có mạng lại).
 */
export default function useCloudDoc(key, { initial, normalize, select, debounce = 900 } = {}) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  const versionRef = useRef(0);
  const skipNextSaveRef = useRef(false);
  const lastSavedRef = useRef(null);
  const syncer = useMemo(() => createDebouncedSync(key, debounce), [key, debounce]);
  const normalizeRef = useRef(normalize);
  const selectRef = useRef(select);
  normalizeRef.current = normalize;
  selectRef.current = select;

  const hydrate = useCallback(
    async ({ silent = false } = {}) => {
      try {
        const doc = await loadUserDoc(key);
        if (doc?.payload && Number(doc.updatedAt) > versionRef.current) {
          versionRef.current = Number(doc.updatedAt);
          skipNextSaveRef.current = true;
          setValue((current) => (normalizeRef.current ? normalizeRef.current(doc.payload, current) : doc.payload));
        }
      } catch (error) {
        if (!silent) reportSyncError(error?.message);
      } finally {
        setReady(true);
      }
    },
    [key],
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const handleRefresh = () => hydrate({ silent: true });
    window.addEventListener(refreshRequestedEvent, handleRefresh);
    return () => window.removeEventListener(refreshRequestedEvent, handleRefresh);
  }, [hydrate]);

  useEffect(() => {
    if (!ready) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    const payload = selectRef.current ? selectRef.current(value) : value;
    const serialized = JSON.stringify(payload ?? null);
    // Bỏ qua các thay đổi không ảnh hưởng dữ liệu lưu (ví dụ đồng hồ Pomodoro chạy từng giây).
    if (serialized === lastSavedRef.current) return;
    lastSavedRef.current = serialized;
    versionRef.current = Date.now();
    syncer.schedule(payload);
  }, [ready, syncer, value]);

  return { value, setValue, ready, reload: hydrate };
}
