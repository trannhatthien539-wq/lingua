import { useCallback, useEffect, useState } from "react";
import {
  defaultReminder,
  isReminderDue,
  loadReminder,
  notifyReminderChanged,
  reminderBody,
  reminderChangedEvent,
  saveReminder,
  showStudyNotification,
  todayKey,
} from "../services/reminderService";

const CHECK_INTERVAL = 60_000;

/** Tải cấu hình nhắc học và tự hiện thông báo khi tới giờ (chỉ khi app đang mở). */
export default function useStudyReminder(streak) {
  const [settings, setSettings] = useState(defaultReminder);

  const reload = useCallback(async () => {
    try {
      setSettings(await loadReminder());
    } catch {
      setSettings(defaultReminder);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const handle = (event) => {
      if (event.detail) setSettings({ ...defaultReminder, ...event.detail });
      else reload();
    };
    window.addEventListener(reminderChangedEvent, handle);
    return () => window.removeEventListener(reminderChangedEvent, handle);
  }, [reload]);

  useEffect(() => {
    if (!settings.enabled) return undefined;
    let cancelled = false;
    const check = async () => {
      if (cancelled || !isReminderDue(settings)) return;
      const shown = await showStudyNotification("Đến giờ học rồi! 📚", reminderBody(streak));
      if (!shown || cancelled) return;
      const next = { ...settings, lastNotifiedDate: todayKey() };
      setSettings(next);
      await saveReminder(next).catch(() => {});
    };
    check();
    const interval = window.setInterval(check, CHECK_INTERVAL);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [settings, streak]);

  const updateSettings = useCallback(
    async (changes) => {
      const next = { ...settings, ...changes };
      setSettings(next);
      notifyReminderChanged(next);
      await saveReminder(next);
      return next;
    },
    [settings],
  );

  return { settings, updateSettings, reload };
}
