import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";
import { dayKeyOf, previousDayKey, addDaysToKey } from "../utils/day.js";

const GUEST_STREAK_KEY = "lingua-study-streak";
export const emptyStreak = { currentStreak: 0, lastActiveDate: null, totalSessions: 0, streakFreezes: 1 };

export const todayKey = () => dayKeyOf();
export const yesterdayKey = () => previousDayKey();
export const twoDaysAgoKey = () => addDaysToKey(dayKeyOf(), -2);

export function calculateNextStreak(
  current = {},
  today = todayKey(),
  yesterday = yesterdayKey(),
  twoDaysAgo = twoDaysAgoKey()
) {
  const currentStreak = Number(current.currentStreak) || 0;
  const lastActiveDate = current.lastActiveDate || null;
  const totalSessions = Number(current.totalSessions) || 0;
  let streakFreezes = current.streakFreezes !== undefined ? Number(current.streakFreezes) : 1;

  // Đã học hôm nay rồi -> giữ nguyên
  if (lastActiveDate === today) {
    return {
      ...current,
      currentStreak,
      lastActiveDate: today,
      totalSessions,
      streakFreezes,
      freezeUsedToday: false,
    };
  }

  // Học liên tiếp ngày hôm qua -> tăng chuỗi
  if (lastActiveDate === yesterday) {
    const nextStreak = currentStreak + 1;
    // Cứ mỗi 7 ngày đạt được, thưởng thêm 1 khiên bảo vệ (tối đa 2 khiên)
    if (nextStreak % 7 === 0 && streakFreezes < 2) {
      streakFreezes += 1;
    }
    return {
      ...current,
      currentStreak: nextStreak,
      lastActiveDate: today,
      totalSessions: totalSessions + 1,
      streakFreezes,
      freezeUsedToday: false,
    };
  }

  // Bỏ lỡ đúng 1 ngày (lần học trước là 2 ngày trước) NHƯNG còn Khiên bảo vệ -> Cứu chuỗi!
  if (lastActiveDate === twoDaysAgo && streakFreezes > 0) {
    return {
      ...current,
      currentStreak: currentStreak + 1,
      lastActiveDate: today,
      totalSessions: totalSessions + 1,
      streakFreezes: streakFreezes - 1,
      lastFreezeUsed: yesterday,
      freezeUsedToday: true,
    };
  }

  // Bỏ lỡ nhiều ngày hoặc không còn khiên -> reset về ngày 1
  return {
    ...current,
    currentStreak: 1,
    lastActiveDate: today,
    totalSessions: totalSessions + 1,
    streakFreezes: Math.max(1, streakFreezes),
    freezeUsedToday: false,
  };
}

export function readGuestStreak() {
  try {
    const saved = JSON.parse(localStorage.getItem(GUEST_STREAK_KEY) || "{}");
    return {
      ...emptyStreak,
      ...saved,
      currentStreak: saved.currentStreak ?? saved.current ?? 0,
      lastActiveDate: saved.lastActiveDate ?? saved.lastDate ?? null,
      streakFreezes: saved.streakFreezes ?? 1,
    };
  } catch {
    return emptyStreak;
  }
}

export async function updateUserStreak(userId = auth.currentUser?.uid) {
  if (!userId) {
    const current = readGuestStreak();
    const next = calculateNextStreak(current);
    localStorage.setItem(GUEST_STREAK_KEY, JSON.stringify(next));
    return next;
  }

  try {
    const statsRef = doc(db, "users", userId);
    const snapshot = await getDoc(statsRef);
    const stored = snapshot.exists() ? { ...emptyStreak, ...snapshot.data() } : emptyStreak;
    const next = calculateNextStreak(stored);

    await setDoc(
      statsRef,
      {
        currentStreak: next.currentStreak,
        lastActiveDate: next.lastActiveDate,
        totalSessions: next.totalSessions,
        streakFreezes: next.streakFreezes,
        lastFreezeUsed: next.lastFreezeUsed || null,
      },
      { merge: true }
    );
    return next;
  } catch (error) {
    console.error("Lingua streak update error", error);
    throw new Error("Không thể cập nhật chuỗi học tập. Vui lòng thử lại sau.", { cause: error });
  }
}

export async function getUserStreak(userId = auth.currentUser?.uid) {
  if (!userId) return readGuestStreak();
  try {
    const snapshot = await getDoc(doc(db, "users", userId));
    return snapshot.exists() ? { ...emptyStreak, ...snapshot.data() } : emptyStreak;
  } catch (error) {
    console.error("Lingua streak read error", error);
    throw new Error("Không thể tải chuỗi học tập. Vui lòng thử lại sau.", { cause: error });
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
