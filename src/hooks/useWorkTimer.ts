/* ──────────────────────────────────────────────────────────────
   useWorkTimer — Smart Work Timer Hook
   Manages the 10-1, 2-7 duty schedule with auto transitions
   ────────────────────────────────────────────────────────────── */

import { useState, useEffect, useCallback, useRef } from "react";

export interface WorkTimerState {
  isRunning: boolean;
  isPaused: boolean;
  isLunchBreak: boolean;
  isAfterHours: boolean;
  isBeforeHours: boolean;
  currentSegment: "morning" | "lunch" | "afternoon" | "off";
  elapsedSeconds: number;          // Total working seconds today
  segmentElapsedSeconds: number;   // Seconds in current segment
  segmentRemainingSeconds: number; // Remaining in current segment
  totalRemainingSeconds: number;   // Total remaining working seconds today
  morningElapsed: number;
  afternoonElapsed: number;
  formattedTime: string;           // HH:MM:SS
  formattedRemaining: string;
  progressPercent: number;         // 0-100
}

interface WorkTimerConfig {
  morningStart: number; // hour (10)
  morningEnd: number;   // hour (13)
  afternoonStart: number; // hour (14)
  afternoonEnd: number;   // hour (19)
}

const DEFAULT_CONFIG: WorkTimerConfig = {
  morningStart: 10,
  morningEnd: 13,
  afternoonStart: 14,
  afternoonEnd: 19,
};

const TOTAL_DUTY_SECONDS = 8 * 3600; // 8 hours

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getCurrentSegment(config: WorkTimerConfig): "morning" | "lunch" | "afternoon" | "off" {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeDecimal = hour + minute / 60;

  if (timeDecimal >= config.morningStart && timeDecimal < config.morningEnd) return "morning";
  if (timeDecimal >= config.morningEnd && timeDecimal < config.afternoonStart) return "lunch";
  if (timeDecimal >= config.afternoonStart && timeDecimal < config.afternoonEnd) return "afternoon";
  return "off";
}

export function useWorkTimer(
  config: WorkTimerConfig = DEFAULT_CONFIG,
  sessionStartTime?: Date | null,
  onLunchBreak?: () => void,
  onDayEnd?: () => void,
  testMode = false,
): WorkTimerState {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [morningElapsed, setMorningElapsed] = useState(0);
  const [afternoonElapsed, setAfternoonElapsed] = useState(0);
  const [currentSegment, setCurrentSegment] = useState<"morning" | "lunch" | "afternoon" | "off">("off");
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const hasTriggeredLunchRef = useRef(false);
  const hasTriggeredEndRef = useRef(false);
  const testModeRef = useRef(testMode);
  testModeRef.current = testMode;

  const tick = useCallback(() => {
    const now = Date.now();
    // Test mode forces an always-running "afternoon" segment so the timer
    // and camera monitoring can be demoed outside real duty hours.
    const segment = testModeRef.current ? "afternoon" : getCurrentSegment(config);
    setCurrentSegment(segment);

    if (segment === "morning" || segment === "afternoon") {
      const delta = (now - lastTickRef.current) / 1000;
      setElapsedSeconds(prev => prev + delta);

      if (segment === "morning") {
        setMorningElapsed(prev => prev + delta);
      } else {
        setAfternoonElapsed(prev => prev + delta);
      }
      setIsRunning(true);
      hasTriggeredLunchRef.current = false;
      hasTriggeredEndRef.current = false;
    } else if (segment === "lunch") {
      setIsRunning(false);
      if (!hasTriggeredLunchRef.current) {
        hasTriggeredLunchRef.current = true;
        onLunchBreak?.();
      }
    } else if (segment === "off") {
      setIsRunning(false);
      const nowDate = new Date();
      const hour = nowDate.getHours();
      if (hour >= config.afternoonEnd && !hasTriggeredEndRef.current) {
        hasTriggeredEndRef.current = true;
        onDayEnd?.();
      }
    }

    lastTickRef.current = now;
  }, [config, onLunchBreak, onDayEnd]);

  useEffect(() => {
    // Calculate initial elapsed if session already started
    if (sessionStartTime) {
      const now = new Date();
      const start = new Date(sessionStartTime);
      const initialElapsed = Math.max(0, (now.getTime() - start.getTime()) / 1000);

      // Calculate how much was in morning vs afternoon
      const morningSeconds = config.morningEnd * 3600 - config.morningStart * 3600; // 3 hours max
      const startHour = start.getHours() + start.getMinutes() / 60;

      if (startHour < config.morningEnd) {
        const morningWorked = Math.min(morningSeconds, Math.max(0, 
          (Math.min(now.getHours() + now.getMinutes() / 60, config.morningEnd) - Math.max(startHour, config.morningStart)) * 3600
        ));
        setMorningElapsed(morningWorked);

        const currentHour = now.getHours() + now.getMinutes() / 60;
        if (currentHour >= config.afternoonStart) {
          const afterWorked = Math.max(0,
            (Math.min(currentHour, config.afternoonEnd) - config.afternoonStart) * 3600
          );
          setAfternoonElapsed(afterWorked);
          setElapsedSeconds(morningWorked + afterWorked);
        } else {
          setElapsedSeconds(morningWorked);
        }
      } else if (startHour >= config.afternoonStart) {
        const currentHour = now.getHours() + now.getMinutes() / 60;
        const afterWorked = Math.max(0,
          (Math.min(currentHour, config.afternoonEnd) - Math.max(startHour, config.afternoonStart)) * 3600
        );
        setAfternoonElapsed(afterWorked);
        setElapsedSeconds(afterWorked);
      }
    }

    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick, sessionStartTime, config]);

  const segment = testMode ? "afternoon" : getCurrentSegment(config);
  const isLunchBreak = !testMode && segment === "lunch";
  const isAfterHours = !testMode && segment === "off" && new Date().getHours() >= config.afternoonEnd;
  const isBeforeHours = !testMode && segment === "off" && new Date().getHours() < config.morningStart;
  const isPaused = isLunchBreak;

  // Segment timing
  const morningDuration = (config.morningEnd - config.morningStart) * 3600;
  const afternoonDuration = (config.afternoonEnd - config.afternoonStart) * 3600;
  let segmentElapsed = 0;
  let segmentTotal = 0;

  if (segment === "morning") {
    segmentElapsed = morningElapsed;
    segmentTotal = morningDuration;
  } else if (segment === "afternoon") {
    segmentElapsed = afternoonElapsed;
    segmentTotal = afternoonDuration;
  }

  const segmentRemaining = Math.max(0, segmentTotal - segmentElapsed);
  const totalRemaining = Math.max(0, TOTAL_DUTY_SECONDS - elapsedSeconds);
  const progress = Math.min(100, (elapsedSeconds / TOTAL_DUTY_SECONDS) * 100);

  return {
    isRunning,
    isPaused,
    isLunchBreak,
    isAfterHours,
    isBeforeHours,
    currentSegment: segment,
    elapsedSeconds,
    segmentElapsedSeconds: segmentElapsed,
    segmentRemainingSeconds: segmentRemaining,
    totalRemainingSeconds: totalRemaining,
    morningElapsed,
    afternoonElapsed,
    formattedTime: formatTime(elapsedSeconds),
    formattedRemaining: formatTime(totalRemaining),
    progressPercent: progress,
  };
}
