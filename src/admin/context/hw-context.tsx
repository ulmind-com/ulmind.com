/* ──────────────────────────────────────────────────────────────
   Hardware Monitoring — React Context
   Manages HW session state, employee data, and monitoring
   ────────────────────────────────────────────────────────────── */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  getHWToken, setHWToken, clearHWToken,
  getHWSession, setHWSession, clearHWSession,
  getHWEmployee, setHWEmployee, clearHWEmployee,
  qrLogout,
  startLunchBreak,
} from "../lib/hw-api";

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
  setSession: (data: {
    token: string;
    session_id: string;
    employee: HWEmployee;
    session_start: string;
    session_type: string;
    session_schedule: any;
  }) => void;
  logout: () => Promise<void>;
  triggerLunchBreak: () => Promise<void>;
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

  const setSession = useCallback((data: {
    token: string;
    session_id: string;
    employee: HWEmployee;
    session_start: string;
    session_type: string;
    session_schedule: any;
  }) => {
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
    }}>
      {children}
    </HWContext.Provider>
  );
};
