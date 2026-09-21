import { useCallback, useEffect, useRef, useState } from "react";
import {
  defaultReminder,
  isReminderDue,
  loadReminder,
  normalizeReminder,
  notifyReminderChanged,
  reminderBody,
  reminderChangedEvent,
  saveReminder,
  showStudyNotification,
  todayKey,
} from "../services/reminderService";
import { readCachedUserDoc, userDocKeys } from "../services/userDocService";
import { refreshRequestedEvent } from "../services/syncStatus";
import { nativeNotificationsAvailable, syncNativeReminder } from "../services/localNotifications";

const CHECK_INTERVAL = 60_000;

/**
 * Tải cấu hình nhắc học và tự hiện thông báo khi tới giờ.
 *
 * - Trên web: kiểm tra mỗi phút khi app còn mở.
 * - Trên APK: hệ điều hành lên lịch hằng ngày (nhắc được cả khi app đã đóng); trạng thái
 *   `native.status` được trả về để Cài đặt hiển thị (biết vì sao không có thông báo).
 *
 * Cấu hình được đọc lại khi đổi tài khoản (`user`) và khi bấm "Đồng bộ lại", không bao giờ
 * tự nhảy về mặc định khi đọc lỗi.
 */
export default function useStudyReminder(streak, user) {
  // Hiển thị ngay bản trên thiết bị để ô "Giờ nhắc" không nháy về 20:00 trong lúc chờ mạng.
  const [settings, setSettings] = useState(() => normalizeReminder(readCachedUserDoc(userDocKeys.reminder)));
  const [ready, setReady] = useState(false);
  const [native, setNative] = useState({ status: "unknown", time: null });
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const reload = useCallback(async () => {
    const next = await loadReminder();
    setSettings(next);
    setReady(true);
    return next;
  }, []);

  useEffect(() => {
    let active = true;
    reload().catch(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [reload, user?.uid]);

  useEffect(() => {
    const handle = (event) => {
      if (event.detail) {
        const next = normalizeReminder(event.detail);
        settingsRef.current = next;
        setSettings(next);
      } else {
        reload().catch(() => {});
      }
    };
    window.addEventListener(reminderChangedEvent, handle);
    window.addEventListener(refreshRequestedEvent, handle);
    return () => {
      window.removeEventListener(reminderChangedEvent, handle);
      window.removeEventListener(refreshRequestedEvent, handle);
    };
  }, [reload]);

  const nativeAvailable = nativeNotificationsAvailable();

  // Trên thiết bị: lên lịch thông báo hằng ngày của hệ điều hành ngay khi đã đọc xong cấu hình.
  useEffect(() => {
    // Nếu chạy trước khi đọc xong, mỗi lần mở app sẽ "huỷ lịch" bằng giá trị mặc định.
    if (!nativeAvailable || !ready) return undefined;
    let active = true;
    syncNativeReminder(settingsRef.current, streak)
      .then((result) => {
        if (active) setNative(result);
      })
      .catch(() => {
        if (active) setNative({ status: "error", time: settingsRef.current.time });
      });
    return () => {
      active = false;
    };
    // Chỉ lên lịch lại khi giờ / bật-tắt / chuỗi ngày đổi (không phụ thuộc identity của object).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nativeAvailable, ready, settings.enabled, settings.time, streak?.currentStreak]);

  // Không có lịch của hệ điều hành (web, hoặc thiết bị chưa lên lịch được) thì nhắc trong lúc
  // app đang mở để không "im lặng" hoàn toàn.
  const nativeScheduled = nativeAvailable && native.status === "scheduled";

  useEffect(() => {
    if (!ready || nativeScheduled || !settings.enabled) return undefined;
    let cancelled = false;
    const check = async () => {
      if (cancelled || !isReminderDue(settings)) return;
      const shown = await showStudyNotification("Đến giờ học rồi! 📚", reminderBody(streak));
      if (!shown || cancelled) return;
      const next = { ...settings, lastNotifiedDate: todayKey() };
      settingsRef.current = next;
      setSettings(next);
      await saveReminder(next).catch(() => {});
    };
    check();
    const interval = window.setInterval(check, CHECK_INTERVAL);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [ready, nativeScheduled, settings, streak]);

  const updateSettings = useCallback(async (changes) => {
    const current = settingsRef.current;
    // Đổi giờ hoặc bật/tắt thì cho phép nhắc lại trong ngày; nếu không, thông báo đã hiện hôm nay
    // sẽ bị "khoá" và bạn không thấy nhắc nữa dù vừa đổi giờ.
    const resetDay = "time" in changes || "enabled" in changes;
    const next = normalizeReminder({
      ...current,
      ...changes,
      lastNotifiedDate: resetDay ? null : current.lastNotifiedDate,
    });
    settingsRef.current = next;
    setSettings(next);
    notifyReminderChanged(next);
    await saveReminder(next);
    return next;
  }, []);

  return {
    settings,
    updateSettings,
    reload,
    ready,
    /** 'scheduled' | 'cancelled' | 'denied' | 'unsupported' | 'error' | 'unknown' */
    native,
    nativeAvailable,
    defaultTime: defaultReminder.time,
  };
}
