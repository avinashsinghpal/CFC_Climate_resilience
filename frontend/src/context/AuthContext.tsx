"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, UserRole } from "@/types";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  getStoredToken,
  clearAuthSession,
} from "@/lib/api";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    role?: UserRole;
    error?: string;
  }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<{
    success: boolean;
    role?: UserRole;
    error?: string;
  }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setRole(currentUser.role);
        setToken(getStoredToken());
      } else {
        setUser(null);
        setRole(null);
        setToken(null);
      }
    } catch {
      setUser(null);
      setRole(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await loginUser(credentials);
      setUser(res.user);
      setRole(res.user.role);
      setToken(res.access_token);
      return { success: true, role: res.user.role };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Login failed";
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    setIsLoading(true);
    try {
      const res = await registerUser(userData);
      setUser(res.user);
      setRole(res.user.role);
      setToken(res.access_token);
      return { success: true, role: res.user.role };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Registration failed";
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setRole(null);
      setToken(null);
      clearAuthSession();
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
