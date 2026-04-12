/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — API Client
   Centralised fetch wrapper with JWT auto-attach & 401 handling
   ────────────────────────────────────────────────────────────── */

const BASE_URL = "https://ulmind-backend.onrender.com/api/v1";

// ─── Token helpers ────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem("ulmind_admin_token");
export const setToken = (token: string) => localStorage.setItem("ulmind_admin_token", token);
export const clearToken = () => localStorage.removeItem("ulmind_admin_token");

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
    window.location.href = "/admin/login";
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
