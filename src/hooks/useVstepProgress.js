import { useCallback } from "react";
import useCloudDoc from "./useCloudDoc";
import { userDocKeys } from "../services/userDocService";

const MAX_ATTEMPTS = 30;
const empty = { attempts: [], drafts: {} };

const normalize = (payload, current) => {
  const base = current || empty;
  if (!payload || typeof payload !== "object") return base;
  return {
    attempts: Array.isArray(payload.attempts)
      ? payload.attempts
          .filter((item) => item && typeof item === "object" && item.examId)
          .slice(-MAX_ATTEMPTS)
      : [],
    drafts: payload.drafts && typeof payload.drafts === "object" ? payload.drafts : {},
  };
};

/** Tiến độ VSTEP: lịch sử các lần thi và bản nháp Writing (lưu theo tài khoản). */
export default function useVstepProgress() {
  const { value, setValue, reload, ready } = useCloudDoc(userDocKeys.vstep, { initial: empty, normalize });
  const progress = value || empty;

  /** Lưu một lần thi đã hoàn thành. */
  const recordAttempt = useCallback(
    (attempt) => {
      setValue((current) => {
        const state = current || empty;
        const entry = {
          examId: attempt.examId,
          examTitle: attempt.examTitle || attempt.examId,
          level: attempt.level || "B1",
          at: attempt.at || new Date().toISOString(),
          scores: attempt.scores || {},
          average: Number(attempt.average) || 0,
          band: attempt.band || "",
          durationSeconds: Number(attempt.durationSeconds) || 0,
        };
        return { ...state, attempts: [...state.attempts, entry].slice(-MAX_ATTEMPTS) };
      });
    },
    [setValue],
  );

  /** Lưu bản nháp Writing của một đề (theo task) để không mất bài khi thoát. */
  const saveDraft = useCallback(
    (examId, taskId, text) => {
      setValue((current) => {
        const state = current || empty;
        return { ...state, drafts: { ...state.drafts, [`${examId}:${taskId}`]: text } };
      });
    },
    [setValue],
  );

  const attemptFor = useCallback(
    (examId) => progress.attempts.filter((item) => item.examId === examId),
    [progress.attempts],
  );

  const bestFor = useCallback(
    (examId) => {
      const list = attemptFor(examId);
      return list.reduce((best, item) => (!best || item.average > best.average ? item : best), null);
    },
    [attemptFor],
  );

  const clearHistory = useCallback(() => setValue((current) => ({ ...(current || empty), attempts: [] })), [setValue]);

  return { progress, attempts: progress.attempts, drafts: progress.drafts, recordAttempt, saveDraft, attemptFor, bestFor, clearHistory, ready, reload };
}
