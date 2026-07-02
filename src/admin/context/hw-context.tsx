/* ──────────────────────────────────────────────────────────────
   Hardware Monitoring — React Context
   Manages HW session state, employee data, and monitoring (Background)
   ────────────────────────────────────────────────────────────── */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  getHWToken, setHWToken, clearHWToken,
  getHWSession, setHWSession, clearHWSession,
  getHWEmployee, setHWEmployee, clearHWEmployee,
  qrLogout,
  startLunchBreak,
  sendHeartbeat,
  logMonitoringEvent,
  updateInternetStatus,
  getSession
} from "../lib/hw-api";
import { useCamera } from "../../hooks/useCamera";
import { useAIDetection } from "../../hooks/useAIDetection";
import { useWorkTimer } from "../../hooks/useWorkTimer";
import { playAlertBeep } from "../lib/beep";
import { toast } from "sonner";

interface HWEmployee {
  _id: string;
  name: string;
  email: string;
  designation: string;
  employee_id: string;
  [key: string]: any;
}

interface HWContextType {
  employee: HWEmployee | null;
  sessionId: string | null;
  token: string | null;
  isLoggedIn: boolean;
  sessionStart: Date | null;
  sessionType: string | null;
  schedule: any;
  setSession: (data: any) => void;
  logout: () => Promise<void>;
  triggerLunchBreak: () => Promise<void>;
  stream: MediaStream | null;
  isCameraOn: boolean;
  isModelLoaded: boolean;
  isDetecting: boolean;
  lastResult: any;
  timer: any;
}

const HWContext = createContext<HWContextType | null>(null);

export const useHW = () => {
  const ctx = useContext(HWContext);
  if (!ctx) throw new Error("useHW must be used within HWProvider");
  return ctx;
};

export const HWProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employee, setEmployeeState] = useState<HWEmployee | null>(getHWEmployee());
  const [sessionId, setSessionIdState] = useState<string | null>(getHWSession());
  const [token, setTokenState] = useState<string | null>(getHWToken());
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [sessionType, setSessionType] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any>(null);

  const isLoggedIn = !!token && !!sessionId && !!employee;

  // Restore session start from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ulmind_hw_session_start");
    if (stored) setSessionStart(new Date(stored));
    const storedType = localStorage.getItem("ulmind_hw_session_type");
    if (storedType) setSessionType(storedType);
    const storedSchedule = localStorage.getItem("ulmind_hw_schedule");
    if (storedSchedule) setSchedule(JSON.parse(storedSchedule));
  }, []);

  const setSession = useCallback((data: any) => {
    setHWToken(data.token);
    setHWSession(data.session_id);
    setHWEmployee(data.employee);
    setTokenState(data.token);
    setSessionIdState(data.session_id);
    setEmployeeState(data.employee);
    setSessionStart(new Date(data.session_start));
    setSessionType(data.session_type);
    setSchedule(data.session_schedule);

    localStorage.setItem("ulmind_hw_session_start", data.session_start);
    localStorage.setItem("ulmind_hw_session_type", data.session_type);
    localStorage.setItem("ulmind_hw_schedule", JSON.stringify(data.session_schedule));
  }, []);

  const logout = useCallback(async () => {
    if (sessionId) {
      try {
        await qrLogout(sessionId);
      } catch (e) {
        console.error("Logout error:", e);
      }
    }
    clearHWToken();
    clearHWSession();
    clearHWEmployee();
    localStorage.removeItem("ulmind_hw_session_start");
    localStorage.removeItem("ulmind_hw_session_type");
    localStorage.removeItem("ulmind_hw_schedule");
    setTokenState(null);
    setSessionIdState(null);
    setEmployeeState(null);
    setSessionStart(null);
    setSessionType(null);
  }, [sessionId]);

  const triggerLunchBreak = useCallback(async () => {
    if (sessionId) {
      try {
        await startLunchBreak(sessionId);
        setSessionType("lunch");
        localStorage.setItem("ulmind_hw_session_type", "lunch");
      } catch (e) {
        console.error("Lunch break error:", e);
      }
    }
  }, [sessionId]);

  // ─── BACKGROUND MONITORING LOGIC ───
  const { videoRef, stream, isCameraOn, startCamera, stopCamera } = useCamera();
  const { isModelLoaded, lastResult, startDetection, stopDetection, isDetecting } = useAIDetection(3000);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevEventRef = useRef<string>("");
  const lastEventTimeRef = useRef<number>(0);

  const [initialActiveSeconds, setInitialActiveSeconds] = useState(0);

  useEffect(() => {
    if (sessionId) {
      getSession(sessionId).then(res => {
        if (res.status === "success" && res.session) {
          setInitialActiveSeconds(res.session.total_active_seconds || 0);
        }
      }).catch(console.error);
    }
  }, [sessionId]);

  const isActive = !!(isLoggedIn && isCameraOn && lastResult?.faceDetected);

  const timer = useWorkTimer(
    isActive,
    initialActiveSeconds,
    () => {
      toast("8-hour duty completed!", { icon: "🎉" });
      setTimeout(() => logout(), 5000);
    }
  );

  // Internet monitoring
  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      if (sessionId && employee) {
        updateInternetStatus({ session_id: sessionId, employee_id: employee.employee_id, is_online: true }).catch(() => {});
      }
    };
    const onOffline = () => {
      setIsOnline(false);
      toast.warning("Internet disconnected!");
      if (sessionId && employee) {
        updateInternetStatus({ session_id: sessionId, employee_id: employee.employee_id, is_online: false }).catch(() => {});
      }
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [sessionId, employee]);

  // Start camera
  useEffect(() => {
    if (isLoggedIn && !timer.isLunchBreak && !timer.isAfterHours) {
      startCamera();
    }
    return () => {
      stopCamera();
      stopDetection();
    };
  }, [isLoggedIn, timer.isLunchBreak, timer.isAfterHours]);

  // Start AI detection
  useEffect(() => {
    if (isCameraOn && videoRef.current && isModelLoaded && !isDetecting) {
      startDetection(videoRef.current);
    }
  }, [isCameraOn, isModelLoaded]);

  // Handle detection results & event logging
  useEffect(() => {
    if (!lastResult || !sessionId || !employee) return;
    const now = Date.now();

    let eventType = "";
    let severity = "info";

    if (lastResult.cameraCovered) {
      eventType = "camera_covered";
      severity = "critical";
    } else if (lastResult.cameraFrozen) {
      eventType = "camera_frozen";
      severity = "warning";
    } else if (lastResult.lowLight) {
      eventType = "camera_low_light";
      severity = "warning";
    } else if (!lastResult.faceDetected) {
      eventType = "face_absent";
      severity = "warning";
    } else if (lastResult.lookingAway) {
      eventType = "looking_away";
      severity = "info";
    } else {
      eventType = "active_working";
    }

    if (eventType !== prevEventRef.current || now - lastEventTimeRef.current > 30000) {
      prevEventRef.current = eventType;
      lastEventTimeRef.current = now;

      if (eventType !== "active_working") {
        logMonitoringEvent({
          session_id: sessionId,
          employee_id: employee.employee_id,
          employee_db_id: employee._id,
          event_type: eventType,
          confidence: lastResult.confidence,
          details: {
            face_detected: lastResult.faceDetected,
            person_count: lastResult.personCount,
          },
        }).catch(() => {});

        if (severity !== "info") {
          const alertMessages: Record<string, string> = {
            camera_covered: "⚠️ Camera is covered!",
            camera_frozen: "⚠️ Camera appears frozen",
            face_absent: "👤 Face not detected",
            looking_away: "👁 Looking away from screen",
            camera_low_light: "🔆 Low light detected",
          };
          if (severity === "critical") {
            toast.error(alertMessages[eventType] || eventType);
            playAlertBeep();
          } else {
            toast.warning(alertMessages[eventType] || eventType);
          }
        }
      }
    }
  }, [lastResult, sessionId, employee]);

  // Heartbeat
  useEffect(() => {
    if (!sessionId || !employee) return;
    heartbeatRef.current = setInterval(() => {
      sendHeartbeat({
        session_id: sessionId,
        employee_id: employee.employee_id,
        camera_state: isCameraOn ? "on" : "off",
        face_detected: lastResult?.faceDetected ?? false,
        is_active: lastResult?.faceDetected ?? false,
        detection_summary: {
          face_present_seconds: lastResult?.faceDetected ? 10 : 0,
          active_seconds: lastResult?.faceDetected ? 10 : 0,
          idle_seconds: !lastResult?.faceDetected ? 10 : 0,
          absent_seconds: !lastResult?.faceDetected ? 10 : 0,
          current_event: prevEventRef.current,
          mobile_detected: lastResult?.mobileDetected ?? false,
          sleeping_detected: lastResult?.sleepingDetected ?? false,
        },
      }).catch(() => {});
    }, 10000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [sessionId, employee, isCameraOn, lastResult]);

  return (
    <HWContext.Provider value={{
      employee,
      sessionId,
      token,
      isLoggedIn,
      sessionStart,
      sessionType,
      schedule,
      setSession,
      logout,
      triggerLunchBreak,
      stream,
      isCameraOn,
      isModelLoaded,
      isDetecting,
      lastResult,
      timer,
    }}>
      {children}
      {/* Hidden video element to keep camera active globally */}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        playsInline
        muted
        autoPlay
      />
    </HWContext.Provider>
  );
};
