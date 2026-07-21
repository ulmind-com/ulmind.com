/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — API Client
   Centralised fetch wrapper with JWT auto-attach & 401 handling
   ────────────────────────────────────────────────────────────── */


// Use local backend in dev mode if VITE_API_URL is set, otherwise fallback to production
export const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV) return "/api/v1";
  return "https://ulmind-backend-5ww9.onrender.com/api/v1";
};

export const getWsBaseUrl = () => {
  if (import.meta.env.PROD) return "wss://ulmind-backend-5ww9.onrender.com/ws";
  return import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
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

  // Global success FX is now handled centrally by the fetch interceptor
  // installed in AdminActionProvider (see actionFx.installFetchFx), so we
  // no longer fire it here — that avoids double-firing the overlay.

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

/** The four CRM record types, each backed by its own collection. */
export type CrmResource = "activities" | "meetings" | "contracts" | "documents";

/** Optionally scoped to one client — used by the client profile tabs. */
const crmQuery = (clientId?: string) =>
  clientId ? `?client_id=${encodeURIComponent(clientId)}` : "";

export const getCrmRecordsAPI = async (resource: CrmResource, clientId?: string): Promise<any[]> => {
  const res = await authFetch(`/crm/${resource}${crmQuery(clientId)}`);
  if (!res.ok) throw new Error(`Failed to fetch ${resource}`);
  return res.json();
};

export const createCrmRecordAPI = async (resource: CrmResource, data: any): Promise<any> => {
  const res = await authFetch(`/crm/${resource}`, { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await readError(res, `Failed to create ${resource}`));
  return res.json();
};

export const updateCrmRecordAPI = async (resource: CrmResource, id: string, data: any): Promise<any> => {
  const res = await authFetch(`/crm/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await readError(res, `Failed to update ${resource}`));
  return res.json();
};

export const deleteCrmRecordAPI = async (resource: CrmResource, id: string): Promise<void> => {
  const res = await authFetch(`/crm/${resource}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readError(res, `Failed to delete ${resource}`));
};

/** FastAPI returns {detail: "..."} on failure; surface it instead of a generic message. */
const readError = async (res: Response, fallback: string): Promise<string> => {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
    if (Array.isArray(body?.detail)) return body.detail.map((d: any) => d.msg).join(", ");
  } catch { /* non-JSON body */ }
  return fallback;
};

export const getCrmActivitiesAPI = (clientId?: string) => getCrmRecordsAPI("activities", clientId);
export const getCrmMeetingsAPI = (clientId?: string) => getCrmRecordsAPI("meetings", clientId);
export const getCrmContractsAPI = (clientId?: string) => getCrmRecordsAPI("contracts", clientId);
export const getCrmDocumentsAPI = (clientId?: string) => getCrmRecordsAPI("documents", clientId);

/* Invoices/payments live in the Finance section of this file — see
   getInvoicesAPI / getPaymentsAPI below, which take an optional clientId. */

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

/** Edit a client's core details. Only the keys sent are written server-side,
 *  so crm_data (notes, contracts, …) is never disturbed by an edit. */
export const updateClientAPI = async (id: string, data: Partial<Client>): Promise<Client> => {
  const res = await authFetch(`/clients/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await readError(res, "Failed to update client"));
  return res.json();
};

export const deleteClientCRMDataAPI = async (id: string, field: string, item_id: string): Promise<Client> => {
  const res = await authFetch(`/clients/${id}/crm_data/${field}/${item_id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readError(res, `Failed to delete ${field}`));
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

export const createPmTaskAPI = async (data: any): Promise<any> => {
  const res = await authFetch("/pm/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create task");
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

export const deletePmTaskAPI = async (id: string): Promise<any> => {
  const res = await authFetch(`/pm/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
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

export const searchProjectsAPI = async (q: string): Promise<any[]> => {
  const res = await authFetch(`/projects/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("Failed to search projects");
  return res.json();
};

export const getProjectTaskStatsAPI = async (id: string): Promise<any> => {
  const res = await authFetch(`/projects/${id}/task-stats`);
  if (!res.ok) throw new Error("Failed to fetch task stats");
  return res.json();
};

export const getProjectFinanceAPI = async (id: string): Promise<any> => {
  const res = await authFetch(`/projects/${id}/finance`);
  if (!res.ok) throw new Error("Failed to fetch project finance");
  return res.json();
};

export const createProjectAPI = async (data: any): Promise<any> => {
  const res = await authFetch("/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create project");
  }
  return res.json();
};

export const updateProjectAPI = async (id: string, data: any): Promise<any> => {
  const res = await authFetch(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update project");
  }
  return res.json();
};

export const deleteProjectAPI = async (id: string): Promise<any> => {
  const res = await authFetch(`/projects/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete project");
  }
  return res.json();
};

// ─── ENTERPRISE TASK APIs ────────────────────────────────────────────────────

export const getTasksAPI = async (projectId?: string): Promise<any[]> => {
  const url = projectId ? `/tasks/?project_id=${projectId}` : "/tasks/";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createTaskAPI = async (data: any): Promise<any> => {
  const res = await authFetch("/tasks/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create task");
  }
  return res.json();
};

export const updateTaskAPI = async (id: string, data: any): Promise<any> => {
  const res = await authFetch(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update task");
  }
  return res.json();
};

export const deleteTaskAPI = async (id: string): Promise<void> => {
  const res = await authFetch(`/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
};

export const notifyTaskAssigneeAPI = async (id: string): Promise<any> => {
  const res = await authFetch(`/tasks/${id}/notify`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to send notification");
  return res.json();
};

export const sendTaskSmsAPI = async (id: string): Promise<any> => {
  const res = await authFetch(`/pm/tasks/${id}/sms`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to send SMS");
  return res.json();
};

export const searchEmployeesAPI = async (q?: string): Promise<any[]> => {
  const url = q ? `/tasks/employees/search?q=${encodeURIComponent(q)}` : "/tasks/employees/search";
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to search employees");
  return res.json();
};

// ─── AUDIT & ACTIVITY FEED APIs ──────────────────────────────────────────────

export const getAuditLogsAPI = async (limit = 100, skip = 0, action?: string): Promise<any[]> => {
  let url = `/audit/?limit=${limit}&skip=${skip}`;
  if (action) url += `&action=${encodeURIComponent(action)}`;
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
};

export const getActivityFeedAPI = async (limit = 50, skip = 0): Promise<any[]> => {
  const res = await authFetch(`/audit/activity-feed?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch activity feed");
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

/** clientId narrows the list to one client — used by the CRM views. */
export const getInvoicesAPI = async (clientId?: string): Promise<any[]> => {
  const res = await authFetch(`/finance/invoices${crmQuery(clientId)}`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
};

export const getPaymentsAPI = async (clientId?: string): Promise<any[]> => {
  const res = await authFetch(`/finance/payments${crmQuery(clientId)}`);
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

export interface Monitor {
  id: string;
  friendly_name: string;
  url: string;
  type: number;
  sub_type: string;
  keyword_type: number;
  keyword_value: string;
  status: number; // 0=Paused, 1=Not Checked, 2=Up, 8=Seems Down, 9=Down
  all_time_uptime_ratio: string;
  custom_uptime_ratio: string;
}

export const fetchMonitorsAPI = async (): Promise<Monitor[]> => {
  const res = await authFetch("/cron-monitor/monitors");
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch cron monitors");
  }
  const data = await res.json();
  return data.monitors;
};

// ═══════════════════════════════════════════════════════════════
//  CMS - WEBSITE CONTENT APIs
// ═══════════════════════════════════════════════════════════════

export interface WebsiteStat {
  _id: string;
  value: string;
  label: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  username: string;
  body: string;
  rating: number;
  order: number;
  img?: { url: string; public_id: string };
}

export interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  timeline: string;
  teamSize: string;
  demoUrl?: string;
  githubUrl?: string;
  languages: string[];
  technologies: string[];
  order: number;
  image?: { url: string; public_id: string };
}

export const uploadCmsImageAPI = async (file: File): Promise<{ url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await authFetch("/website-content/upload-image", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Image upload failed");
  return res.json();
};

// --- Stats ---
export const getWebsiteStatsAPI = async (): Promise<WebsiteStat[]> => {
  const res = await authFetch("/website-content/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};
export const createWebsiteStatAPI = async (data: Partial<WebsiteStat>) => {
  const res = await authFetch("/website-content/stats", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create stat");
  return res.json();
};
export const updateWebsiteStatAPI = async (id: string, data: Partial<WebsiteStat>) => {
  const res = await authFetch(`/website-content/stats/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update stat");
  return res.json();
};
export const deleteWebsiteStatAPI = async (id: string) => {
  const res = await authFetch(`/website-content/stats/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete stat");
  return res.json();
};

// --- Testimonials ---
export const getTestimonialsAPI = async (): Promise<Testimonial[]> => {
  const res = await authFetch("/website-content/testimonials");
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
};
export const createTestimonialAPI = async (data: Partial<Testimonial>) => {
  const res = await authFetch("/website-content/testimonials", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create testimonial");
  return res.json();
};
export const updateTestimonialAPI = async (id: string, data: Partial<Testimonial>) => {
  const res = await authFetch(`/website-content/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update testimonial");
  return res.json();
};
export const deleteTestimonialAPI = async (id: string) => {
  const res = await authFetch(`/website-content/testimonials/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete testimonial");
  return res.json();
};

// --- Projects ---
export const getPortfolioProjectsAPI = async (): Promise<PortfolioProject[]> => {
  const res = await authFetch("/website-content/projects");
  if (!res.ok) throw new Error("Failed to fetch portfolio projects");
  return res.json();
};
export const createPortfolioProjectAPI = async (data: Partial<PortfolioProject>) => {
  const res = await authFetch("/website-content/projects", { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
};
export const updatePortfolioProjectAPI = async (id: string, data: Partial<PortfolioProject>) => {
  const res = await authFetch(`/website-content/projects/${id}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
};
export const deletePortfolioProjectAPI = async (id: string) => {
  const res = await authFetch(`/website-content/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
};

export const getInfraAPI = async (search = "", skip = 0, limit = 100) => {
  const res = await authFetch(`/pm-infra?search=${encodeURIComponent(search)}&skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch infrastructure data");
  return res.json();
};
export const createInfraAPI = async (payload: any) => {
  const res = await authFetch("/pm-infra", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create infrastructure entry");
  return res.json();
};
export const updateInfraAPI = async (id: string, payload: any) => {
  const res = await authFetch(`/pm-infra/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update infrastructure entry");
  return res.json();
};
export const deleteInfraAPI = async (id: string) => {
  const res = await authFetch(`/pm-infra/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete infrastructure entry");
  return res.json();
};
