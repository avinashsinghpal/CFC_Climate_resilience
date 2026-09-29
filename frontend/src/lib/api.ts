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
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    });
    if (res.status === 501) {
      return { data: null as unknown as T, isMock: true };
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return { data, isMock: false };
  } catch {
    return { data: null as unknown as T, isMock: true };
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
