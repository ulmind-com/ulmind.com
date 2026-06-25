/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Manager Tracking API Client
   Centralised API functions for Manager Tracking & Workforce
   Intelligence module. Uses existing authFetch from api.ts.
   ────────────────────────────────────────────────────────────── */

import { authFetch } from "./api";

// ═══════════════════════════════════════════════════════════════
//  WORKFORCE DASHBOARD
// ═══════════════════════════════════════════════════════════════

export interface WorkforceDashboard {
  online_employees: number;
  offline_employees: number;
  active_employees: number;
  idle_employees: number;
  on_break: number;
  overtime: number;
  on_leave: number;
  running_tasks: number;
  delayed_tasks: number;
  blocked_tasks: number;
  completed_today: number;
  upcoming_deadlines: number;
  team_productivity: number;
  avg_response_time_hours: number;
  avg_completion_time_hours: number;
  total_working_hours_today: number;
}

export const getWorkforceDashboardAPI = async (): Promise<WorkforceDashboard> => {
  const res = await authFetch("/manager/workforce-dashboard");
  if (!res.ok) throw new Error("Failed to fetch workforce dashboard");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE LIVE MONITORING
// ═══════════════════════════════════════════════════════════════

export interface EmployeeLiveStatus {
  employee_id: string;
  employee_name: string;
  email: string;
  designation: string;
  team: string;
  profile_photo: string | null;
  status: string;
  current_project: string | null;
  current_task: string | null;
  current_page: string | null;
  browser: string;
  device: string;
  os: string;
  login_time: string | null;
  session_duration_minutes: number;
  last_activity: string | null;
  ip_address: string | null;
  active_minutes: number;
  idle_minutes: number;
}

export const getEmployeesLiveAPI = async (): Promise<EmployeeLiveStatus[]> => {
  const res = await authFetch("/manager/employees/live");
  if (!res.ok) throw new Error("Failed to fetch live employees");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEE PROFILE & TIMELINE
// ═══════════════════════════════════════════════════════════════

export const getEmployeeProfileAPI = async (id: string): Promise<any> => {
  const res = await authFetch(`/manager/employees/${id}/profile`);
  if (!res.ok) throw new Error("Failed to fetch employee profile");
  return res.json();
};

export const getEmployeeTimelineAPI = async (id: string): Promise<any[]> => {
  const res = await authFetch(`/manager/employees/${id}/timeline`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  PRODUCTIVITY INTELLIGENCE
// ═══════════════════════════════════════════════════════════════

export interface ProductivityScore {
  employee_id: string;
  employee_name: string;
  productivity_score: number;
  efficiency_score: number;
  workload_percent: number;
  capacity_percent: number;
  task_completion_rate: number;
  deadline_accuracy: number;
  delay_frequency: number;
  avg_completion_hours: number;
  response_time_hours: number;
  quality_score: number;
  performance_level: string;
}

export const getProductivityAPI = async (id: string): Promise<ProductivityScore> => {
  const res = await authFetch(`/manager/productivity/${id}`);
  if (!res.ok) throw new Error("Failed to fetch productivity");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  ENTERPRISE TASKS
// ═══════════════════════════════════════════════════════════════

export interface EnterpriseTask {
  _id: string;
  title: string;
  description?: string;
  project_id?: string;
  project_name?: string;
  client_id?: string;
  client_name?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  assigned_by?: string;
  assigned_by_name?: string;
  priority: string;
  stage: string;
  review_status: string;
  start_date?: string;
  due_date?: string;
  estimated_hours: number;
  actual_hours: number;
  completion_percent: number;
  dependencies: string[];
  subtasks: any[];
  comments: any[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const getManagerTasksAPI = async (filters?: Record<string, string>): Promise<EnterpriseTask[]> => {
  const params = new URLSearchParams(filters || {});
  const url = params.toString() ? `/manager/tasks?${params}` : "/manager/tasks";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createManagerTaskAPI = async (data: any): Promise<EnterpriseTask> => {
  const res = await authFetch("/manager/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create task");
  }
  return res.json();
};

export const updateManagerTaskAPI = async (id: string, data: any): Promise<EnterpriseTask> => {
  const res = await authFetch(`/manager/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update task");
  }
  return res.json();
};

export const deleteManagerTaskAPI = async (id: string): Promise<void> => {
  const res = await authFetch(`/manager/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
};

export const addTaskCommentAPI = async (id: string, data: { content: string; mentions?: string[] }): Promise<any> => {
  const res = await authFetch(`/manager/tasks/${id}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
};

export const addSubtaskAPI = async (id: string, data: { title: string; assigned_to?: string }): Promise<any> => {
  const res = await authFetch(`/manager/tasks/${id}/subtasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add subtask");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  TIME TRACKING
// ═══════════════════════════════════════════════════════════════

export const startTimerAPI = async (data: { employee_id: string; task_id?: string }): Promise<any> => {
  const res = await authFetch("/manager/time-tracking/start", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to start timer");
  }
  return res.json();
};

export const pauseTimerAPI = async (data: { employee_id: string }): Promise<any> => {
  const res = await authFetch("/manager/time-tracking/pause", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to pause timer");
  return res.json();
};

export const resumeTimerAPI = async (data: { employee_id: string }): Promise<any> => {
  const res = await authFetch("/manager/time-tracking/resume", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to resume timer");
  return res.json();
};

export const stopTimerAPI = async (data: { employee_id: string; notes?: string }): Promise<any> => {
  const res = await authFetch("/manager/time-tracking/stop", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to stop timer");
  return res.json();
};

export const getTimesheetsAPI = async (id: string): Promise<any[]> => {
  const res = await authFetch(`/manager/time-tracking/${id}`);
  if (!res.ok) throw new Error("Failed to fetch timesheets");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  SMART ALERTS
// ═══════════════════════════════════════════════════════════════

export interface SmartAlert {
  _id: string;
  alert_type: string;
  severity: string;
  employee_id: string | null;
  employee_name: string;
  title: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
}

export const getSmartAlertsAPI = async (): Promise<SmartAlert[]> => {
  const res = await authFetch("/manager/alerts");
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════════════════════════════════

export interface ManagerAnalytics {
  task_completion_trend: { date: string; completed: number }[];
  tasks_by_stage: { stage: string; count: number }[];
  tasks_by_priority: { priority: string; count: number }[];
  employee_workload: { name: string; tasks: number }[];
  attendance_trend: { date: string; present: number; absent: number; leave: number }[];
  hours_per_employee: { name: string; hours: number }[];
}

export const getManagerAnalyticsAPI = async (): Promise<ManagerAnalytics> => {
  const res = await authFetch("/manager/analytics");
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};
