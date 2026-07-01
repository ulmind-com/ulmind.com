/* ──────────────────────────────────────────────────────────────
   Hardware Monitoring — API Client
   API functions for employee CRUD, QR auth, monitoring, analytics
   ────────────────────────────────────────────────────────────── */

import { getBaseUrl } from "./api";

const BASE = getBaseUrl();

// ─── Token helpers for HW sessions ────────────────────────────
export const getHWToken = (): string | null => localStorage.getItem("ulmind_hw_token");
export const setHWToken = (token: string) => localStorage.setItem("ulmind_hw_token", token);
export const clearHWToken = () => localStorage.removeItem("ulmind_hw_token");

export const getHWSession = (): string | null => localStorage.getItem("ulmind_hw_session");
export const setHWSession = (id: string) => localStorage.setItem("ulmind_hw_session", id);
export const clearHWSession = () => localStorage.removeItem("ulmind_hw_session");

export const getHWEmployee = (): any | null => {
  const data = localStorage.getItem("ulmind_hw_employee");
  return data ? JSON.parse(data) : null;
};
export const setHWEmployee = (emp: any) => localStorage.setItem("ulmind_hw_employee", JSON.stringify(emp));
export const clearHWEmployee = () => localStorage.removeItem("ulmind_hw_employee");

// ─── Auth-aware fetch for HW endpoints ────────────────────────
const hwFetch = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getHWToken() || localStorage.getItem("ulmind_admin_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers,
    mode: "cors",
    credentials: "omit",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || err.message || `HTTP ${res.status}`);
  }
  return res.json();
};


// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE CRUD
// ═══════════════════════════════════════════════════════════════

export const createEmployee = (data: {
  name: string;
  email: string;
  designation: string;
  employee_id: string;
  phone?: string;
  department?: string;
}) => hwFetch("/hw/employees", { method: "POST", body: JSON.stringify(data) });

export const listEmployees = () => hwFetch("/hw/employees");

export const getEmployee = (id: string) => hwFetch(`/hw/employees/${id}`);

export const updateEmployee = (id: string, data: any) =>
  hwFetch(`/hw/employees/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteEmployee = (id: string) =>
  hwFetch(`/hw/employees/${id}`, { method: "DELETE" });

export const regenerateQR = (id: string) =>
  hwFetch(`/hw/employees/${id}/regenerate-qr`, { method: "POST" });


// ═══════════════════════════════════════════════════════════════
//  QR AUTH
// ═══════════════════════════════════════════════════════════════

export const qrLogin = (qrPayload: string, deviceInfo?: string) =>
  hwFetch("/hw/auth/qr-login", {
    method: "POST",
    body: JSON.stringify({
      qr_payload: qrPayload,
      device_info: deviceInfo || navigator.userAgent,
      user_agent: navigator.userAgent,
    }),
  });

export const qrLogout = (sessionId: string) =>
  hwFetch("/hw/auth/qr-logout", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId }),
  });

export const startLunchBreak = (sessionId: string) =>
  hwFetch("/hw/auth/lunch-break", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId }),
  });

export const getSession = (sessionId: string) =>
  hwFetch(`/hw/session/${sessionId}`);

export const getSchedule = () => hwFetch("/hw/schedule");


// ═══════════════════════════════════════════════════════════════
//  MONITORING
// ═══════════════════════════════════════════════════════════════

export const logMonitoringEvent = (event: {
  session_id: string;
  employee_id: string;
  employee_db_id?: string;
  event_type: string;
  confidence?: number;
  details?: any;
}) => hwFetch("/hw/monitor/event", { method: "POST", body: JSON.stringify(event) });

export const logMonitoringEventsBatch = (events: any[]) =>
  hwFetch("/hw/monitor/events/batch", { method: "POST", body: JSON.stringify({ events }) });

export const getMonitoringEvents = (employeeId: string, params?: {
  session_id?: string;
  event_type?: string;
  severity?: string;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.session_id) searchParams.set("session_id", params.session_id);
  if (params?.event_type) searchParams.set("event_type", params.event_type);
  if (params?.severity) searchParams.set("severity", params.severity);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return hwFetch(`/hw/monitor/events/${employeeId}${qs ? `?${qs}` : ""}`);
};

export const sendHeartbeat = (data: {
  session_id: string;
  employee_id: string;
  camera_state?: string;
  face_detected?: boolean;
  is_active?: boolean;
  detection_summary?: any;
}) => hwFetch("/hw/monitor/heartbeat", { method: "POST", body: JSON.stringify(data) });

export const updateCameraStatus = (data: {
  session_id: string;
  employee_id: string;
  camera_state: string;
  details?: string;
}) => hwFetch("/hw/monitor/camera-status", { method: "POST", body: JSON.stringify(data) });

export const updateInternetStatus = (data: {
  session_id: string;
  employee_id: string;
  is_online: boolean;
}) => hwFetch("/hw/monitor/internet-status", { method: "POST", body: JSON.stringify(data) });

export const getLiveStatus = () => hwFetch("/hw/monitor/live-status");


// ═══════════════════════════════════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════════════════════════════════

export const getProductivityScore = (employeeDbId: string, date?: string) => {
  const qs = date ? `?date=${date}` : "";
  return hwFetch(`/hw/analytics/productivity/${employeeDbId}${qs}`);
};

export const getSalaryRecommendation = (employeeDbId: string, month?: string) => {
  const qs = month ? `?month=${month}` : "";
  return hwFetch(`/hw/analytics/salary-recommendation/${employeeDbId}${qs}`);
};

export const getDailyReport = (employeeDbId: string, date?: string) => {
  const qs = date ? `?date=${date}` : "";
  return hwFetch(`/hw/analytics/daily-report/${employeeDbId}${qs}`);
};

export const getLeaderboard = (date?: string) => {
  const qs = date ? `?date=${date}` : "";
  return hwFetch(`/hw/analytics/leaderboard${qs}`);
};
