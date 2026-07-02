/* ──────────────────────────────────────────────────────────────
   useWorkTimer — AI Face-Tracking Stopwatch
   Manages the dynamic duty tracking based on active face presence.
   Caps at 8 hours of active duty time.
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect, useCallback, useRef } from "react";

export interface WorkTimerState {
  isRunning: boolean;
  isPaused: boolean;
  isDutyCompleted: boolean;
  elapsedSeconds: number;          // Total active tracked seconds today
  totalRemainingSeconds: number;   // Total remaining active working seconds today
  formattedTime: string;           // HH:MM:SS
  formattedRemaining: string;
  progressPercent: number;         // 0-100
}

const TOTAL_DUTY_SECONDS = 8 * 3600; // 8 hours

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function useWorkTimer(
  isActive: boolean, // If true, the timer ticks (face detected + camera on)
  initialElapsed: number = 0, // Initial active seconds fetched from backend
  onDutyComplete?: () => void
): WorkTimerState {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsed);
  const [isDutyCompleted, setIsDutyCompleted] = useState(false);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const hasTriggeredEndRef = useRef(false);

  // Sync state if initialElapsed is loaded async
  useEffect(() => {
    if (initialElapsed > 0 && elapsedSeconds === 0) {
      setElapsedSeconds(initialElapsed);
      if (initialElapsed >= TOTAL_DUTY_SECONDS) {
        setIsDutyCompleted(true);
        if (!hasTriggeredEndRef.current) {
          hasTriggeredEndRef.current = true;
          onDutyComplete?.();
        }
      }
    }
  }, [initialElapsed]);

  const tick = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastTickRef.current) / 1000;
    
    if (isActive && !isDutyCompleted) {
      setElapsedSeconds(prev => {
        const next = prev + delta;
        if (next >= TOTAL_DUTY_SECONDS) {
          setIsDutyCompleted(true);
          if (!hasTriggeredEndRef.current) {
            hasTriggeredEndRef.current = true;
            onDutyComplete?.();
          }
          return TOTAL_DUTY_SECONDS;
        }
        return next;
      });
    }
    
    lastTickRef.current = now;
  }, [isActive, isDutyCompleted, onDutyComplete]);

  useEffect(() => {
    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);

  const isRunning = isActive && !isDutyCompleted;
  const isPaused = !isActive && !isDutyCompleted;
  
  const totalRemaining = Math.max(0, TOTAL_DUTY_SECONDS - elapsedSeconds);
  const progress = Math.min(100, (elapsedSeconds / TOTAL_DUTY_SECONDS) * 100);

  return {
    isRunning,
    isPaused,
    isDutyCompleted,
    elapsedSeconds,
    totalRemainingSeconds: totalRemaining,
    formattedTime: formatTime(elapsedSeconds),
    formattedRemaining: formatTime(totalRemaining),
    progressPercent: progress,
  };
}
