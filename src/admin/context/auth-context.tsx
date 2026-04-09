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

  const login = async (payload: LoginPayload) => {
    const data = await loginAPI(payload);
    // Backend may return token in different shapes — handle both
    const jwt = data.access_token || data.token || data;
    if (typeof jwt === "string") {
      setToken(jwt);
      setTokenState(jwt);
    } else if (jwt.access_token) {
      setToken(jwt.access_token);
      setTokenState(jwt.access_token);
    }

    // Fetch user profile after login
    const me = await getMeAPI();
    setUser(me);

    return { mustChangePassword: me.must_change_password };
  };

  const logout = () => {
    clearToken();
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
