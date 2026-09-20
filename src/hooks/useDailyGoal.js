import { useCallback } from "react";
import useCloudDoc from "./useCloudDoc";
import { userDocKeys } from "../services/userDocService";

/** Mục tiêu học mỗi ngày (số lượt ôn). Lưu theo tài khoản qua user_state. */
export const GOAL_PRESETS = [10, 20, 30, 50];
export const DEFAULT_DAILY_GOAL = 20;

const clampTarget = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return DEFAULT_DAILY_GOAL;
  return Math.min(500, Math.round(number));
};

export default function useDailyGoal() {
  const { value, setValue, ready, reload } = useCloudDoc(userDocKeys.goal, {
    initial: { target: DEFAULT_DAILY_GOAL },
    normalize: (payload, current) => ({ target: clampTarget(payload?.target ?? current?.target) }),
  });
  const target = clampTarget(value?.target);
  const setGoal = useCallback((next) => setValue({ target: clampTarget(next) }), [setValue]);
  return { target, setGoal, ready, reload };
}
