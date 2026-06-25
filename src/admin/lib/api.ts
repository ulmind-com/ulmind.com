/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — API Client
   Centralised fetch wrapper with JWT auto-attach & 401 handling
   ────────────────────────────────────────────────────────────── */

// Use production backend by default to avoid local connection refused errors if backend is not running
export const getBaseUrl = () => {
  if (import.meta.env.PROD) return "https://ulmind-backend.onrender.com/api/v1";
  return import.meta.env.VITE_API_URL || "https://ulmind-backend.onrender.com/api/v1";
};

export const getWsBaseUrl = () => {
  if (import.meta.env.PROD) return "wss://ulmind-backend.onrender.com/ws";
  return import.meta.env.VITE_WS_URL || "wss://ulmind-backend.onrender.com/ws";
};

const BASE_URL = getBaseUrl();

// ─── Token helpers ────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem("ulmind_admin_token");
export const setToken = (token: string) => localStorage.setItem("ulmind_admin_token", token);
export const clearToken = () => localStorage.removeItem("ulmind_admin_token");

export const getSessionId = (): string | null => localStorage.getItem("ulmind_admin_session");
export const setSessionId = (id: string) => localStorage.setItem("ulmind_admin_session", id);
export const clearSessionId = () => localStorage.removeItem("ulmind_admin_session");

// ─── Auth-aware fetch ─────────────────────────────────────────
export const authFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type if body is NOT FormData (multipart handles itself)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    mode: "cors",
    credentials: "omit",
  });

  // Auto-logout on 401
  if (res.status === 401) {
    clearToken();
    clearSessionId();
    window.location.href = "/";
    throw new Error("Session expired");
  }

  return res;
};

// ═══════════════════════════════════════════════════════════════
//  AUTH APIs
// ═══════════════════════════════════════════════════════════════

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  role: string;
  status: string;
  must_change_password: boolean;
  profile_photo?: {
    url: string;
    public_id: string;
  };
  full_name?: string;
  position?: string;
  experience?: string;
  specialization?: string[];
  linkedin_url?: string;
  x_url?: string;
  github_url?: string;
}

export const updateProfileAPI = async (payload: Partial<AdminUser>) => {
  const res = await authFetch("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (Array.isArray(err.detail)) {
      throw new Error(err.detail.map((e: any) => e.msg).join(", "));
    }
    throw new Error(err.detail || "Profile update failed");
  }
  return res.json();
};

export const loginAPI = async (payload: LoginPayload) => {
  const reqBody = {
    username: payload.email,
    password: payload.password
  };
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
    mode: "cors",
    credentials: "omit",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    let errMsg = "Login failed";
    if (typeof err.detail === "string") {
      errMsg = err.detail;
    } else if (Array.isArray(err.detail)) {
      errMsg = err.detail.map((e: any) => e.msg).join(", ");
    }
    throw new Error(errMsg);
  }
  return res.json();
};

export const logoutAPI = async (session_id: string) => {
  const res = await authFetch("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ session_id }),
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
};

export const getMeAPI = async (): Promise<AdminUser> => {
  const res = await authFetch("/auth/me");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const changePasswordAPI = async (payload: {
  current_password: string;
  new_password: string;
}) => {
  const res = await authFetch("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Password change failed");
  }
  return res.json();
};

export const updateProfilePhotoAPI = async (file: File): Promise<AdminUser> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await authFetch("/auth/me/profile-photo", {
    method: "PATCH",
    body: formData,
  });
  if (!res.ok) throw new Error("Photo upload failed");
  return res.json();
};

export const deleteProfilePhotoAPI = async (): Promise<AdminUser> => {
  const res = await authFetch("/auth/me/profile-photo", {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Photo deletion failed");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  STATS APIs
// ═══════════════════════════════════════════════════════════════

export const getKpiStats = async () => {
  const res = await authFetch("/stats/kpi");
  if (!res.ok) throw new Error("Failed to fetch KPI stats");
  return res.json();
};

export const getChartStats = async (period: string = "monthly") => {
  const res = await authFetch(`/stats/charts?period=${period}`);
  if (!res.ok) throw new Error("Failed to fetch chart stats");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  ANALYTICS APIs
// ═══════════════════════════════════════════════════════════════

export interface PageVisit {
  page: string;
  visits: number;
  unique_sessions: number;
}

export interface PageTimeSpent {
  page: string;
  total_time_seconds: number;
  avg_time_seconds: number;
}

export interface AnalyticsReport {
  period: string;
  total_pageviews: number;
  top_pages_by_visits: PageVisit[];
  top_pages_by_time_spent: PageTimeSpent[];
}

export const getAnalyticsReport = async (
  period: string = "7d",
  limit: number = 10
): Promise<AnalyticsReport> => {
  const res = await authFetch(`/analytics/report?period=${period}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  TRACKING / VISITORS APIs
// ═══════════════════════════════════════════════════════════════

export const getTrackingData = async (limit: number = 100, skip: number = 0) => {
  const res = await authFetch(`/track/?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch tracking data");
  return res.json();
};

export const heartbeatAPI = async (session_id: string) => {
  const res = await authFetch("/activity/heartbeat", {
    method: "POST",
    body: JSON.stringify({ session_id }),
  });
  if (!res.ok) throw new Error("Heartbeat failed");
  return res.json();
};

export const getSessionsAPI = async () => {
  const res = await authFetch("/activity/sessions");
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  CRM / CLIENT APIs
// ═══════════════════════════════════════════════════════════════

export interface Client {
  _id: string;
  companyName: string;
  contactName?: string;
  contactEmail: string;
  phone?: string;
  industry?: string;
  assigned_manager?: string;
  revenue: number;
  lifetime_value: number;
  address?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  crm_data: {
    stage: string;
    tags: string[];
    notes?: {
      id: string;
      content: string;
      author_id: string;
      created_at: string;
    }[];
    contracts?: {
      id: string;
      title: string;
      file_url: string;
      status: string;
      created_at: string;
      expires_at: string | null;
    }[];
    contacts?: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      role: string;
      created_at: string;
    }[];
    projects?: {
      id: string;
      name: string;
      status: string;
      deadline?: string;
      created_at: string;
    }[];
    invoices?: {
      id: string;
      invoice_number: string;
      amount: number;
      status: string;
      due_date: string;
      created_at: string;
    }[];
    documents?: {
      id: string;
      title: string;
      file_url: string;
      created_at: string;
    }[];
    meetings?: {
      id: string;
      title: string;
      scheduled_at: string;
      status: string;
      notes?: string;
      created_at: string;
    }[];
    activity_logs?: {
      id: string;
      action: string;
      description: string;
      created_at: string;
    }[];
    last_contacted_at?: string | null;
  };
}

export const getClientsAPI = async (): Promise<Client[]> => {
  const res = await authFetch("/clients/");
  if (!res.ok) throw new Error("Failed to fetch clients");
  return res.json();
};

export const getCrmDashboardAPI = async (): Promise<any> => {
  const res = await authFetch("/crm/dashboard");
  if (!res.ok) throw new Error("Failed to fetch CRM dashboard");
  return res.json();
};

export const getCrmActivitiesAPI = async (): Promise<any[]> => {
  const res = await authFetch("/crm/activities");
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
};

export const getCrmMeetingsAPI = async (): Promise<any[]> => {
  const res = await authFetch("/crm/meetings");
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
};

export const getCrmContractsAPI = async (): Promise<any[]> => {
  const res = await authFetch("/crm/contracts");
  if (!res.ok) throw new Error("Failed to fetch contracts");
  return res.json();
};

export const getCrmDocumentsAPI = async (): Promise<any[]> => {
  const res = await authFetch("/crm/documents");
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
};

export const getClientAPI = async (id: string): Promise<Client> => {
  const res = await authFetch(`/clients/${id}`);
  if (!res.ok) throw new Error("Failed to fetch client");
  return res.json();
};

export const createClientAPI = async (payload: { companyName: string; contactEmail: string }): Promise<Client> => {
  const res = await authFetch("/clients/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create client");
  return res.json();
};

export const updateClientStageAPI = async (id: string, stage: string): Promise<Client> => {
  const res = await authFetch(`/clients/${id}/stage?stage=${encodeURIComponent(stage)}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to update client stage");
  return res.json();
};

export const addClientCRMDataAPI = async (id: string, field: string, data: any): Promise<Client> => {
  const res = await authFetch(`/clients/${id}/crm_data/${field}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to add ${field}`);
  return res.json();
};

export const updateClientCRMDataAPI = async (id: string, field: string, item_id: string, data: any): Promise<Client> => {
  const res = await authFetch(`/clients/${id}/crm_data/${field}/${item_id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update ${field}`);
  return res.json();
};

export const updateClientStatusAPI = async (id: string, status: string): Promise<Client> => {
  const res = await authFetch(`/clients/${id}/status?status=${encodeURIComponent(status)}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to update client status");
  return res.json();
};

export const deleteClientAPI = async (id: string): Promise<void> => {
  const res = await authFetch(`/clients/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete client");
};

export const addClientNoteAPI = async (id: string, content: string, author_id: string): Promise<Client> => {
  const res = await authFetch(`/clients/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ content, author_id }),
  });
  if (!res.ok) throw new Error("Failed to add client note");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  TEAM APIs
// ═══════════════════════════════════════════════════════════════

export const listTeamAPI = async (): Promise<AdminUser[]> => {
  const res = await authFetch("/team/");
  if (!res.ok) throw new Error("Failed to fetch team members");
  return res.json();
};

export const createTeamMemberAPI = async (payload: any): Promise<AdminUser> => {
  const res = await authFetch("/team/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (Array.isArray(err.detail)) {
      throw new Error(err.detail.map((e: any) => e.msg).join(", "));
    }
    throw new Error(err.detail || "Failed to create team member");
  }
  return res.json();
};

export const getTeamMemberAPI = async (id: string): Promise<AdminUser> => {
  const res = await authFetch(`/team/${id}`);
  if (!res.ok) throw new Error("Failed to fetch team member");
  return res.json();
};

export const updateTeamMemberAPI = async (id: string, payload: any): Promise<AdminUser> => {
  const res = await authFetch(`/team/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (Array.isArray(err.detail)) {
      throw new Error(err.detail.map((e: any) => e.msg).join(", "));
    }
    throw new Error(err.detail || "Failed to update team member");
  }
  return res.json();
};

export const deleteTeamMemberAPI = async (id: string) => {
  const res = await authFetch(`/team/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete team member");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  OFFERS APIs
// ═══════════════════════════════════════════════════════════════

export interface Offer {
  _id: string;
  title: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  image: { url: string; public_id: string } | null;
  createdAt: string;
  updatedAt: string;
}

export const listAllOffersAPI = async (): Promise<Offer[]> => {
  const res = await authFetch("/offers/");
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
};

export const createOfferAPI = async (formData: FormData): Promise<Offer> => {
  const res = await authFetch("/offers/", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (Array.isArray(err.detail)) {
      throw new Error(err.detail.map((e: any) => e.msg).join(", "));
    }
    throw new Error(err.detail || "Failed to create offer");
  }
  return res.json();
};

export const updateOfferAPI = async (id: string, payload: any): Promise<Offer> => {
  const res = await authFetch(`/offers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update offer");
  }
  return res.json();
};

export const updateOfferImageAPI = async (id: string, file: File): Promise<Offer> => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await authFetch(`/offers/${id}/image`, {
    method: "PATCH",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update offer image");
  return res.json();
};

export const deleteOfferAPI = async (id: string) => {
  const res = await authFetch(`/offers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete offer");
  return res.json();
};


// ═══════════════════════════════════════════════════════════════
//  FORGOT PASSWORD — OTP FLOW
// ═══════════════════════════════════════════════════════════════

export const forgotPasswordAPI = async (email: string) => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    mode: "cors",
    credentials: "omit",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((e: any) => e.msg).join(", ")
        : "Failed to send OTP";
    throw new Error(msg);
  }
  return data;
};

export const verifyOTPAPI = async (email: string, otp: string) => {
  const res = await fetch(`${BASE_URL}/auth/verify-reset-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
    mode: "cors",
    credentials: "omit",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((e: any) => e.msg).join(", ")
        : "Invalid OTP";
    throw new Error(msg);
  }
  return data as { success: boolean; reset_token: string };
};

export const resetPasswordAPI = async (reset_token: string, new_password: string) => {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset_token, new_password }),
    mode: "cors",
    credentials: "omit",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((e: any) => e.msg).join(", ")
        : "Password reset failed";
    throw new Error(msg);
  }
  return data as { success: boolean; message: string };
};

// ═══════════════════════════════════════════════════════════════
//  PROJECT MANAGEMENT ENTERPRISE API
// ═══════════════════════════════════════════════════════════════

export const getPmDashboardAPI = async (): Promise<any> => {
  const res = await authFetch("/pm/dashboard");
  if (!res.ok) throw new Error("Failed to fetch PM dashboard");
  return res.json();
};

export const getPmTasksAPI = async (projectId?: string): Promise<any[]> => {
  const url = projectId ? `/pm/tasks?project_id=${projectId}` : "/pm/tasks";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const updatePmTaskAPI = async (id: string, data: any): Promise<any> => {
  const res = await authFetch(`/pm/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

export const getPmMilestonesAPI = async (projectId?: string): Promise<any[]> => {
  const url = projectId ? `/pm/milestones?project_id=${projectId}` : "/pm/milestones";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch milestones");
  return res.json();
};

export const getPmTimeLogsAPI = async (projectId?: string): Promise<any[]> => {
  const url = projectId ? `/pm/time-logs?project_id=${projectId}` : "/pm/time-logs";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch time logs");
  return res.json();
};

export const getPmFilesAPI = async (projectId?: string): Promise<any[]> => {
  const url = projectId ? `/pm/files?project_id=${projectId}` : "/pm/files";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json();
};

export const getPmFeedbackAPI = async (projectId?: string): Promise<any[]> => {
  const url = projectId ? `/pm/feedback?project_id=${projectId}` : "/pm/feedback";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return res.json();
};

export const getPmExpensesAPI = async (projectId?: string): Promise<any[]> => {
  const url = projectId ? `/pm/expenses?project_id=${projectId}` : "/pm/expenses";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
};

export const getProjectsAPI = async (): Promise<any[]> => {
  const res = await authFetch("/projects/");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export const getProjectAPI = async (id: string): Promise<any> => {
  const res = await authFetch(`/projects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  FINANCE ENTERPRISE API
// ═══════════════════════════════════════════════════════════════

export const getFinanceDashboardAPI = async (): Promise<any> => {
  const res = await authFetch("/finance/dashboard");
  if (!res.ok) throw new Error("Failed to fetch finance dashboard");
  return res.json();
};

export const getInvoicesAPI = async (): Promise<any[]> => {
  const res = await authFetch("/finance/invoices");
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
};

export const getPaymentsAPI = async (): Promise<any[]> => {
  const res = await authFetch("/finance/payments");
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
};

export const getExpensesAPI = async (): Promise<any[]> => {
  const res = await authFetch("/finance/expenses");
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
};

export const getOutstandingInvoicesAPI = async (): Promise<any[]> => {
  const res = await authFetch("/finance/outstanding");
  if (!res.ok) throw new Error("Failed to fetch outstanding invoices");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  TEAM ENTERPRISE API
// ═══════════════════════════════════════════════════════════════

export const getTeamHRDashboardAPI = async (): Promise<any> => {
  const res = await authFetch("/team-hr/dashboard");
  if (!res.ok) throw new Error("Failed to fetch team dashboard");
  return res.json();
};

export const getTeamAttendanceAPI = async (employeeId?: string): Promise<any[]> => {
  const url = employeeId ? `/team-hr/attendance?employee_id=${employeeId}` : "/team-hr/attendance";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
};

export const getTeamWorkLogsAPI = async (employeeId?: string): Promise<any[]> => {
  const url = employeeId ? `/team-hr/work-logs?employee_id=${employeeId}` : "/team-hr/work-logs";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch work logs");
  return res.json();
};

export const getTeamPerformanceAPI = async (employeeId?: string): Promise<any[]> => {
  const url = employeeId ? `/team-hr/performance?employee_id=${employeeId}` : "/team-hr/performance";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch performance");
  return res.json();
};

export const getTeamLeavesAPI = async (employeeId?: string): Promise<any[]> => {
  const url = employeeId ? `/team-hr/leaves?employee_id=${employeeId}` : "/team-hr/leaves";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch leaves");
  return res.json();
};

export const getTeamPayrollAPI = async (employeeId?: string): Promise<any[]> => {
  const url = employeeId ? `/team-hr/payroll?employee_id=${employeeId}` : "/team-hr/payroll";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch payroll");
  return res.json();
};

// ═══════════════════════════════════════════════════════════════
//  DELETE REQUESTS API
// ═══════════════════════════════════════════════════════════════

export interface DeleteRequest {
  _id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  item_type: string;
  item_description: string;
  endpoint: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export const createDeleteRequestAPI = async (payload: { item_type: string; item_description: string; endpoint: string }) => {
  const res = await authFetch("/delete-requests/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create delete request");
  return res.json();
};

export const getDeleteRequestsAPI = async (status?: string): Promise<{ data: DeleteRequest[], pagination: any }> => {
  const url = status ? `/delete-requests/?status_filter=${status}` : `/delete-requests/`;
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch delete requests");
  return res.json();
};

export const updateDeleteRequestStatusAPI = async (id: string, status: "approved" | "rejected") => {
  const res = await authFetch(`/delete-requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update delete request status");
  return res.json();
};
