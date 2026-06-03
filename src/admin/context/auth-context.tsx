/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Auth Context
   JWT-based auth state management for the admin panel
   ────────────────────────────────────────────────────────────── */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loginAPI,
  getMeAPI,
  setToken,
  getToken,
  clearToken,
  getSessionId,
  setSessionId,
  clearSessionId,
  logoutAPI,
  heartbeatAPI,
  type AdminUser,
  type LoginPayload,
} from "../lib/api";

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<{ mustChangePassword: boolean }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Fetch user profile on mount if token exists
  const refreshUser = useCallback(async () => {
    const currentToken = getToken();
    if (!currentToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await getMeAPI();
      setUser(me);
      setTokenState(currentToken);
    } catch {
      // Token is invalid
      clearToken();
      setUser(null);
      setTokenState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Heartbeat mechanism
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAuthenticated) {
      const sessionId = getSessionId();
      if (sessionId) {
        // Send immediate heartbeat on mount/auth
        heartbeatAPI(sessionId).catch(() => {});
        // Then every 30 seconds
        interval = setInterval(() => {
          heartbeatAPI(sessionId).catch(() => {});
        }, 30000);
      }
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Before unload beacon
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionId = getSessionId();
      if (sessionId) {
        // Use sendBeacon or standard fetch keepalive if possible
        navigator.sendBeacon(`https://ulmind-backend.onrender.com/api/v1/auth/logout`, JSON.stringify({ session_id: sessionId }));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const login = async (payload: LoginPayload) => {
    const data = await loginAPI(payload);
    // Backend may return token in different shapes — handle both
    const jwt = data.access_token || data.token || data;
    if (typeof jwt === "string") {
      setToken(jwt);
      setTokenState(jwt);
    } else if (jwt.access_token) {
      setTokenState(jwt.access_token);
    }
    
    if (data.session_id) {
      setSessionId(data.session_id);
    }

    // Fetch user profile after login
    const me = await getMeAPI();
    setUser(me);

    return { mustChangePassword: me.must_change_password };
  };

  const logout = async () => {
    const sessionId = getSessionId();
    if (sessionId) {
      try {
        await logoutAPI(sessionId);
      } catch (err) {
        console.error(err);
      }
    }
    clearToken();
    clearSessionId();
    setUser(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
