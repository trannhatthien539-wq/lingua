import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const GUEST_STREAK_KEY = "lingua-study-streak";
const emptyStreak = { currentStreak: 0, lastActiveDate: null, totalSessions: 0 };

const todayKey = () => new Date().toISOString().split("T")[0];
const yesterdayKey = () => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().split("T")[0];
};

export function readGuestStreak() {
  try {
    const saved = JSON.parse(localStorage.getItem(GUEST_STREAK_KEY) || "{}");
    return { ...emptyStreak, ...saved, currentStreak: saved.currentStreak ?? saved.current ?? 0, lastActiveDate: saved.lastActiveDate ?? saved.lastDate ?? null };
  } catch {
    return emptyStreak;
  }
}

export async function updateUserStreak(userId = auth.currentUser?.uid) {
  if (!userId) {
    const current = readGuestStreak();
    const today = todayKey();
    const next = current.lastActiveDate === today
      ? current
      : { ...current, currentStreak: current.lastActiveDate === yesterdayKey() ? current.currentStreak + 1 : 1, lastActiveDate: today, totalSessions: current.totalSessions + 1 };
    localStorage.setItem(GUEST_STREAK_KEY, JSON.stringify(next));
    return next;
  }

  try {
    const statsRef = doc(db, "users", userId);
    const snapshot = await getDoc(statsRef);
    const stored = snapshot.exists() ? { ...emptyStreak, ...snapshot.data() } : emptyStreak;
    const today = todayKey();
    const next = stored.lastActiveDate === today
      ? stored
      : {
          ...stored,
          currentStreak: stored.lastActiveDate === yesterdayKey() ? stored.currentStreak + 1 : 1,
          lastActiveDate: today,
          totalSessions: (stored.totalSessions || 0) + 1,
        };

    await setDoc(statsRef, { currentStreak: next.currentStreak, lastActiveDate: next.lastActiveDate, totalSessions: next.totalSessions }, { merge: true });
    return next;
  } catch (error) {
    console.error("Lingua streak update error", error);
    throw new Error("Không thể cập nhật chuỗi học tập. Vui lòng thử lại sau.");
  }
}

export async function getUserStreak(userId = auth.currentUser?.uid) {
  if (!userId) return readGuestStreak();
  try {
    const snapshot = await getDoc(doc(db, "users", userId));
    return snapshot.exists() ? { ...emptyStreak, ...snapshot.data() } : emptyStreak;
  } catch (error) {
    console.error("Lingua streak read error", error);
    throw new Error("Không thể tải chuỗi học tập. Vui lòng thử lại sau.");
  }
}

/** Khôi phục streak từ file sao lưu, chỉ ghi đè khi dữ liệu trong file cao hơn. */
export async function restoreUserStreak(imported = {}) {
  const current = await getUserStreak();
  const next = {
    currentStreak: Math.max(Number(current.currentStreak) || 0, Number(imported.currentStreak) || 0),
    totalSessions: Math.max(Number(current.totalSessions) || 0, Number(imported.totalSessions) || 0),
    lastActiveDate: current.lastActiveDate || imported.lastActiveDate || null,
  };
  const userId = auth.currentUser?.uid;
  if (!userId) {
    localStorage.setItem(GUEST_STREAK_KEY, JSON.stringify(next));
    return next;
  }
  await setDoc(doc(db, "users", userId), next, { merge: true });
  return next;
}
