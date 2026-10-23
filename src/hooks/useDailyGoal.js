import { createContext, createElement, useCallback, useContext, useMemo } from "react";
import useCloudDoc from "./useCloudDoc";
import { userDocKeys } from "../services/userDocService";

/** Mục tiêu học mỗi ngày (số lượt ôn). Lưu theo tài khoản qua user_state. */
export const GOAL_PRESETS = [10, 20, 30, 50];
export const DEFAULT_DAILY_GOAL = 20;

const DailyGoalContext = createContext(null);

const clampTarget = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return DEFAULT_DAILY_GOAL;
  return Math.min(500, Math.round(number));
};

function useDailyGoalState() {
  const { value, setValue, ready, reload } = useCloudDoc(userDocKeys.goal, {
    initial: { target: DEFAULT_DAILY_GOAL },
    normalize: (payload, current) => ({ target: clampTarget(payload?.target ?? current?.target) }),
  });
  const target = clampTarget(value?.target);
  const setGoal = useCallback((next) => setValue({ target: clampTarget(next) }), [setValue]);
  return useMemo(() => ({ target, setGoal, ready, reload }), [target, setGoal, ready, reload]);
}

/**
 * Một provider duy nhất ở gốc app. Nhờ vậy đổi mục tiêu ở Progress sẽ cập nhật
 * ngay Sidebar, Home và mọi widget đang dùng cùng context, không cần tải lại.
 */
export function DailyGoalProvider({ children }) {
  const goal = useDailyGoalState();
  return createElement(DailyGoalContext.Provider, { value: goal }, children);
}

export default function useDailyGoal() {
  const goal = useContext(DailyGoalContext);
  if (!goal) throw new Error("useDailyGoal phải nằm trong <DailyGoalProvider>.");
  return goal;
}
