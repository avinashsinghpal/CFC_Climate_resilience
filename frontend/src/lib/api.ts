/**
 * API client for the Federated Climate Action Platform.
 *
 * When NEXT_PUBLIC_USE_MOCKS=true (or the backend returns 501),
 * mock data is returned instead. Every function that returns mock data
 * adds isMock=true so the UI can show the sample data banner.
 */

import type {
  Sensor,
  SensorReading,
  CitizenReport,
  ForecastPoint,
  ForecastDriver,
  SatelliteGrid,
  LedgerRecord,
  FederatedNode,
  AnomalyAlert,
  Ticket,
  AlertRule,
  PollutionType,
  User,
  UserRole,
  AuthResponse,
} from "@/types";

import {
  mockSensors,
  mockSensorReadings,
  mockReports,
  mockForecast72h,
  mockForecast96h,
  mockForecastDrivers,
  mockSatelliteGrid,
  mockLedgerRecords,
  mockFederatedNodes,
  mockAlerts,
  mockTickets,
  mockAlertRules,
} from "@/mocks";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://climate-resilience-backend-hnry.onrender.com";

// --- Token & Cookie Management for Next.js and API Client ---

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fcap_token");
}

export function setAuthSession(token: string, role: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("fcap_token", token);
  localStorage.setItem("fcap_role", role);
  // Also set cookie so Next.js middleware can inspect session at edge
  const maxAge = 86400 * 7; // 7 days
  document.cookie = `fcap_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `fcap_role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("fcap_token");
  localStorage.removeItem("fcap_role");
  document.cookie = "fcap_token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "fcap_role=; path=/; max-age=0; SameSite=Lax";
}

interface ApiResult<T> {
  data: T;
  isMock: boolean;
  error?: string;
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  if (USE_MOCKS) {
    return { data: null as unknown as T, isMock: true };
  }
  try {
    const token = getStoredToken();
    const authHeaders: Record<string, string> = {};
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...(options?.headers ?? {}),
      },
    });

    if (res.status === 501) {
      return { data: null as unknown as T, isMock: true };
    }
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return { data, isMock: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Request failed";
    return { data: null as unknown as T, isMock: true, error: message };
  }
}

// --- Authentication Endpoints ---

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail || "Registration failed");
  }

  setAuthSession(data.access_token, data.user.role);
  return data;
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail || "Login failed");
  }

  setAuthSession(data.access_token, data.user.role);
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getStoredToken();
  if (!token && typeof window !== "undefined") {
    // Check if token exists in cookie
    const match = document.cookie.match(/fcap_token=([^;]+)/);
    if (!match) return null;
  }

  const tokenToUse = token || (typeof window !== "undefined" ? document.cookie.match(/fcap_token=([^;]+)/)?.[1] : null);
  if (!tokenToUse) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenToUse}`,
      },
    });

    if (!res.ok) {
      clearAuthSession();
      return null;
    }

    const user: User = await res.json();
    return user;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignore network error on logout
  } finally {
    clearAuthSession();
  }
}


// --- Sensors ---

export async function getSensors(filters?: {
  protocol?: string;
  status?: string;
  area?: string;
}): Promise<ApiResult<Sensor[]>> {
  const result = await apiFetch<Sensor[]>("/api/sensors");
  if (result.isMock) {
    let sensors = [...mockSensors];
    if (filters?.protocol && filters.protocol !== "all") {
      sensors = sensors.filter((s) => s.protocol === filters.protocol);
    }
    if (filters?.status && filters.status !== "all") {
      sensors = sensors.filter((s) => s.status === filters.status);
    }
    if (filters?.area && filters.area !== "all") {
      sensors = sensors.filter((s) =>
        s.city.toLowerCase().includes(filters.area!.toLowerCase())
      );
    }
    return { data: sensors, isMock: true };
  }
  return result;
}

export async function getSensorReadings(
  sensorId: string
): Promise<ApiResult<SensorReading[]>> {
  const result = await apiFetch<SensorReading[]>(
    `/api/sensors/${sensorId}/readings`
  );
  if (result.isMock) {
    return {
      data: mockSensorReadings[sensorId] ?? [],
      isMock: true,
    };
  }
  return result;
}

// --- Reports ---

export interface ReportSubmission {
  pollutionType: PollutionType;
  description: string;
  lat: number;
  lng: number;
  blurredLat: number;
  blurredLng: number;
  consentGiven: boolean;
}

export async function submitReport(
  payload: ReportSubmission
): Promise<ApiResult<{ id: string }>> {
  const result = await apiFetch<{ id: string }>("/api/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (result.isMock) {
    return {
      data: { id: `RPT-DEMO-${Date.now()}` },
      isMock: true,
    };
  }
  return result;
}

export async function getRecentReports(): Promise<ApiResult<CitizenReport[]>> {
  const result = await apiFetch<CitizenReport[]>("/api/reports");
  if (result.isMock) {
    return { data: mockReports, isMock: true };
  }
  return result;
}

// --- Forecast ---

export async function getForecast(
  horizonHours: 72 | 96,
  lat?: number,
  lng?: number
): Promise<ApiResult<ForecastPoint[]>> {
  void lat; void lng;
  const result = await apiFetch<ForecastPoint[]>(
    `/api/forecast?horizon=${horizonHours}`
  );
  if (result.isMock) {
    return {
      data: horizonHours === 96 ? mockForecast96h : mockForecast72h,
      isMock: true,
    };
  }
  return result;
}

export async function getForecastDrivers(): Promise<ApiResult<ForecastDriver[]>> {
  const result = await apiFetch<ForecastDriver[]>("/api/forecast");
  if (result.isMock) {
    return { data: mockForecastDrivers, isMock: true };
  }
  return result;
}

export async function getSatelliteGrid(
  layer: "aod" | "no2"
): Promise<ApiResult<SatelliteGrid>> {
  void layer;
  const result = await apiFetch<SatelliteGrid>("/api/forecast/satellite");
  if (result.isMock) {
    return { data: { ...mockSatelliteGrid, layer }, isMock: true };
  }
  return result;
}

// --- Integrity ---

export async function getLedgerRecords(filters?: {
  sensorId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<ApiResult<LedgerRecord[]>> {
  void filters;
  const result = await apiFetch<LedgerRecord[]>("/api/integrity/records");
  if (result.isMock) {
    return { data: mockLedgerRecords, isMock: true };
  }
  return result;
}

export async function verifyRecord(
  hashOrFile: string
): Promise<ApiResult<{ valid: boolean; checks: string[] }>> {
  void hashOrFile;
  const result = await apiFetch<{ valid: boolean; checks: string[] }>(
    "/api/integrity/verify",
    { method: "POST", body: JSON.stringify({ hash: hashOrFile }) }
  );
  if (result.isMock) {
    return {
      data: {
        valid: false,
        checks: ["Hash match: not checked (prototype)", "Proof valid: not checked", "Anchored on-chain: not checked"],
      },
      isMock: true,
    };
  }
  return result;
}

// --- Federated ---

export async function getFederatedNodes(): Promise<ApiResult<FederatedNode[]>> {
  const result = await apiFetch<FederatedNode[]>("/api/federated/nodes");
  if (result.isMock) {
    return { data: mockFederatedNodes, isMock: true };
  }
  return result;
}

// --- Alerts and tickets ---

export async function getAlerts(): Promise<ApiResult<AnomalyAlert[]>> {
  const result = await apiFetch<AnomalyAlert[]>("/api/alerts");
  if (result.isMock) {
    return { data: mockAlerts, isMock: true };
  }
  return result;
}

export async function getTickets(filters?: {
  status?: string;
}): Promise<ApiResult<Ticket[]>> {
  void filters;
  const result = await apiFetch<Ticket[]>("/api/tickets");
  if (result.isMock) {
    return { data: mockTickets, isMock: true };
  }
  return result;
}

export async function getTicket(id: string): Promise<ApiResult<Ticket>> {
  const result = await apiFetch<Ticket>(`/api/tickets/${id}`);
  if (result.isMock) {
    const ticket = mockTickets.find((t) => t.id === id);
    return {
      data: ticket ?? mockTickets[0],
      isMock: true,
    };
  }
  return result;
}

export async function getAlertRules(): Promise<ApiResult<AlertRule[]>> {
  const result = await apiFetch<AlertRule[]>("/api/rules");
  if (result.isMock) {
    return { data: mockAlertRules, isMock: true };
  }
  return result;
}
