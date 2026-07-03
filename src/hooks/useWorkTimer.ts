/* ──────────────────────────────────────────────────────────────
   useWorkTimer — AI Face-Tracking Stopwatch
   Manages the dynamic duty tracking based on active face presence.
   Ticks only while `isActive` (face present, not sleeping, camera on,
   not on lunch). Caps at 8 hours of active duty time.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect, useCallback, useRef } from "react";

export type PauseReason = "away" | "sleeping" | "lunch" | "camera" | "offline" | null;

export interface WorkTimerState {
  isRunning: boolean;
  isPaused: boolean;
  isDutyCompleted: boolean;
  pauseReason: PauseReason;        // why the timer is currently paused (null when running)
  elapsedSeconds: number;          // Total active tracked seconds today
  totalRemainingSeconds: number;   // Total remaining active working seconds today
  formattedTime: string;           // HH:MM:SS
  formattedRemaining: string;
  progressPercent: number;         // 0-100
}

const TOTAL_DUTY_SECONDS = 8 * 3600; // 8 hours

function formatTime(totalSeconds: number): string {
  const t = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function useWorkTimer(
  isActive: boolean,                   // If true, the timer ticks (face + no sleep + camera on + not lunch)
  initialElapsed: number = 0,          // Initial active seconds fetched from backend (resume after re-login)
  onDutyComplete?: () => void,
  pauseReason: PauseReason = null      // Why the timer is paused (only meaningful when !isActive)
): WorkTimerState {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsed);
  const [isDutyCompleted, setIsDutyCompleted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const hasTriggeredEndRef = useRef(false);

  // Always read the freshest isActive/completed inside the interval without
  // resubscribing every render (avoids drift from stale closures).
  const isActiveRef = useRef(isActive);
  const isDutyCompletedRef = useRef(isDutyCompleted);
  const onCompleteRef = useRef(onDutyComplete);
  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);
  useEffect(() => { isDutyCompletedRef.current = isDutyCompleted; }, [isDutyCompleted]);
  useEffect(() => { onCompleteRef.current = onDutyComplete; }, [onDutyComplete]);

  const completeDuty = useCallback(() => {
    setIsDutyCompleted(true);
    if (!hasTriggeredEndRef.current) {
      hasTriggeredEndRef.current = true;
      onCompleteRef.current?.();
    }
  }, []);

  // Sync when the authoritative resume value arrives from the backend
  // (fetched async after mount, and again on each re-login). Jump UP to it —
  // the backend is the source of truth for time already accumulated today,
  // and the local timer may have ticked a few seconds before the fetch
  // resolved. Never jump down, so live ticks are preserved and re-login
  // resumes exactly where the day left off instead of restarting at zero.
  useEffect(() => {
    if (initialElapsed > 0) {
      setElapsedSeconds(prev => Math.max(prev, initialElapsed));
      if (initialElapsed >= TOTAL_DUTY_SECONDS) completeDuty();
    }
  }, [initialElapsed, completeDuty]);

  // Single 1s ticker for the whole lifetime of the hook. Only advances the
  // counter while active — pausing is simply "don't add this second".
  useEffect(() => {
    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (isActiveRef.current && !isDutyCompletedRef.current) {
        setElapsedSeconds(prev => {
          const next = prev + delta;
          if (next >= TOTAL_DUTY_SECONDS) {
            completeDuty();
            return TOTAL_DUTY_SECONDS;
          }
          return next;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [completeDuty]);

  const isRunning = isActive && !isDutyCompleted;
  const isPaused = !isActive && !isDutyCompleted;

  const totalRemaining = Math.max(0, TOTAL_DUTY_SECONDS - elapsedSeconds);
  const progress = Math.min(100, (elapsedSeconds / TOTAL_DUTY_SECONDS) * 100);

  return {
    isRunning,
    isPaused,
    isDutyCompleted,
    pauseReason: isPaused ? (pauseReason ?? "away") : null,
    elapsedSeconds,
    totalRemainingSeconds: totalRemaining,
    formattedTime: formatTime(elapsedSeconds),
    formattedRemaining: formatTime(totalRemaining),
    progressPercent: progress,
  };
}
