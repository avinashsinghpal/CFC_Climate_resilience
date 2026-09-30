// Sensor types
export type SensorProtocol = "LoRaWAN" | "NB-IoT";
export type SensorStatus = "online" | "delayed" | "offline";

export interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: string;
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  aqiValue: number;
  aqiCategory: AqiCategory;
}

export interface Sensor {
  id: string;
  model: string;
  protocol: SensorProtocol;
  status: SensorStatus;
  area: string;
  city: string;
  lat: number;
  lng: number;
  firmware: string;
  batteryPercent: number;
  lastSeen: string;
  latestReading?: SensorReading;
}

// AQI
export type AqiCategory =
  | "Good"
  | "Satisfactory"
  | "Moderate"
  | "Poor"
  | "Very Poor"
  | "Severe";

// Citizen reports
export type PollutionType =
  | "open_waste_burning"
  | "crop_burning"
  | "construction_dust"
  | "industrial_emission"
  | "vehicle_smoke"
  | "other";

export type ReportStatus = "pending" | "acknowledged" | "resolved";

export interface CitizenReport {
  id: string;
  pollutionType: PollutionType;
  description: string;
  lat: number;
  lng: number;
  status: ReportStatus;
  createdAt: string;
  area: string;
}

// Forecast
export interface ForecastPoint {
  timestamp: string;
  pm25: number;
  pm25Low: number;
  pm25High: number;
  aqiValue: number;
  aqiCategory: AqiCategory;
}

export interface ForecastDriver {
  name: string;
  value: string;
  level: number; // 0 to 100
  unit: string;
}

export interface SatelliteGrid {
  layer: "aod" | "no2";
  cells: Array<{
    lat: number;
    lng: number;
    value: number;
  }>;
  minValue: number;
  maxValue: number;
}

// Integrity ledger
export type ProofStatus = "Verified" | "Pending" | "Failed";

export interface LedgerRecord {
  id: string;
  sensorId: string;
  timestamp: string;
  readingHash: string;
  proofStatus: ProofStatus;
  anchorReference: string;
  pm25: number;
}

// Federated learning
export type NodeStatus = "active" | "syncing" | "inactive";

export interface FederatedNode {
  id: string;
  name: string;
  region: string;
  currentRound: number;
  lastUpdate: string;
  status: NodeStatus;
  nodeType: string;
}

// Alerts and tickets
export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "assigned" | "in_progress" | "closed";

export interface AnomalyAlert {
  id: string;
  type: string;
  location: string;
  severity: AlertSeverity;
  detectedAt: string;
  sensorId: string;
  pm25: number;
  lat: number;
  lng: number;
}

export interface TicketStatusChange {
  status: TicketStatus;
  timestamp: string;
  note: string;
}

export interface Ticket {
  id: string;
  serviceCode: string;
  status: TicketStatus;
  lat: number;
  lng: number;
  description: string;
  requestedAt: string;
  updatedAt: string;
  assignedICCC: string;
  triggerSensorId: string;
  triggerPm25: number;
  suggestedResource: string;
  statusHistory: TicketStatusChange[];
}

// Alert rules
export interface AlertRule {
  id: string;
  pollutant: string;
  threshold: number;
  unit: string;
  duration: string;
  action: string;
}

// User & Authentication types
export type UserRole = "PUBLIC" | "OFFICIAL";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

