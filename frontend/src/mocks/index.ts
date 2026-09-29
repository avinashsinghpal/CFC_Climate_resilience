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
} from "@/types";

// ---- Sensors ----
export const mockSensors: Sensor[] = [
  {
    id: "SPS30-DEMO-001",
    model: "Sensirion SPS30",
    protocol: "LoRaWAN",
    status: "online",
    area: "Andheri East",
    city: "Mumbai",
    lat: 19.1136,
    lng: 72.8697,
    firmware: "3.2.1",
    batteryPercent: 82,
    lastSeen: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    latestReading: {
      id: "rdg-001",
      sensorId: "SPS30-DEMO-001",
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      pm25: 47.3,
      pm10: 68.1,
      temperature: 29.4,
      humidity: 71,
      aqiValue: 79,
      aqiCategory: "Satisfactory",
    },
  },
  {
    id: "SPS30-DEMO-002",
    model: "Sensirion SPS30",
    protocol: "NB-IoT",
    status: "online",
    area: "Bandra West",
    city: "Mumbai",
    lat: 19.0596,
    lng: 72.8295,
    firmware: "3.2.1",
    batteryPercent: 61,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    latestReading: {
      id: "rdg-002",
      sensorId: "SPS30-DEMO-002",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      pm25: 28.1,
      pm10: 44.6,
      temperature: 28.8,
      humidity: 74,
      aqiValue: 47,
      aqiCategory: "Good",
    },
  },
  {
    id: "SPS30-DEMO-003",
    model: "Sensirion SPS30",
    protocol: "LoRaWAN",
    status: "delayed",
    area: "Dharavi",
    city: "Mumbai",
    lat: 19.0376,
    lng: 72.8545,
    firmware: "3.1.9",
    batteryPercent: 38,
    lastSeen: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    latestReading: {
      id: "rdg-003",
      sensorId: "SPS30-DEMO-003",
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      pm25: 112.4,
      pm10: 163.2,
      temperature: 30.1,
      humidity: 68,
      aqiValue: 164,
      aqiCategory: "Moderate",
    },
  },
  {
    id: "SPS30-DEMO-004",
    model: "Sensirion SPS30",
    protocol: "NB-IoT",
    status: "online",
    area: "Connaught Place",
    city: "Delhi",
    lat: 28.6328,
    lng: 77.2197,
    firmware: "3.2.1",
    batteryPercent: 77,
    lastSeen: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    latestReading: {
      id: "rdg-004",
      sensorId: "SPS30-DEMO-004",
      timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      pm25: 187.9,
      pm10: 244.3,
      temperature: 27.2,
      humidity: 55,
      aqiValue: 263,
      aqiCategory: "Poor",
    },
  },
  {
    id: "SPS30-DEMO-005",
    model: "Sensirion SPS30",
    protocol: "LoRaWAN",
    status: "offline",
    area: "Rohini",
    city: "Delhi",
    lat: 28.7495,
    lng: 77.0619,
    firmware: "3.0.4",
    batteryPercent: 5,
    lastSeen: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    latestReading: {
      id: "rdg-005",
      sensorId: "SPS30-DEMO-005",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      pm25: 210.5,
      pm10: 287.1,
      temperature: 26.8,
      humidity: 58,
      aqiValue: 310,
      aqiCategory: "Very Poor",
    },
  },
  {
    id: "SPS30-DEMO-006",
    model: "Sensirion SPS30",
    protocol: "NB-IoT",
    status: "online",
    area: "Koramangala",
    city: "Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    firmware: "3.2.1",
    batteryPercent: 91,
    lastSeen: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    latestReading: {
      id: "rdg-006",
      sensorId: "SPS30-DEMO-006",
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      pm25: 35.6,
      pm10: 52.3,
      temperature: 22.4,
      humidity: 63,
      aqiValue: 59,
      aqiCategory: "Satisfactory",
    },
  },
  {
    id: "SPS30-DEMO-007",
    model: "Sensirion SPS30",
    protocol: "LoRaWAN",
    status: "online",
    area: "Salt Lake",
    city: "Kolkata",
    lat: 22.5726,
    lng: 88.4148,
    firmware: "3.2.0",
    batteryPercent: 55,
    lastSeen: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    latestReading: {
      id: "rdg-007",
      sensorId: "SPS30-DEMO-007",
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      pm25: 78.4,
      pm10: 101.2,
      temperature: 31.5,
      humidity: 82,
      aqiValue: 113,
      aqiCategory: "Moderate",
    },
  },
  {
    id: "SPS30-DEMO-014",
    model: "Sensirion SPS30",
    protocol: "NB-IoT",
    status: "online",
    area: "Anna Nagar",
    city: "Chennai",
    lat: 13.0837,
    lng: 80.2102,
    firmware: "3.2.1",
    batteryPercent: 68,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    latestReading: {
      id: "rdg-014",
      sensorId: "SPS30-DEMO-014",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      pm25: 53.2,
      pm10: 74.8,
      temperature: 33.1,
      humidity: 79,
      aqiValue: 88,
      aqiCategory: "Satisfactory",
    },
  },
];

// ---- Sensor 24h readings for chart ----
function generateReadingHistory(sensorId: string, basePm25: number): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  for (let i = 23; i >= 0; i--) {
    const noise = (Math.random() - 0.5) * basePm25 * 0.3;
    const pm25 = Math.max(5, basePm25 + noise);
    const pm10 = pm25 * 1.4 + Math.random() * 10;
    const aqi = Math.round((pm25 / 60) * 100);
    readings.push({
      id: `${sensorId}-h${i}`,
      sensorId,
      timestamp: new Date(now - i * 3600 * 1000).toISOString(),
      pm25: Math.round(pm25 * 10) / 10,
      pm10: Math.round(pm10 * 10) / 10,
      temperature: 25 + Math.random() * 8,
      humidity: 55 + Math.random() * 30,
      aqiValue: Math.min(500, aqi),
      aqiCategory: aqi <= 50 ? "Good" : aqi <= 100 ? "Satisfactory" : aqi <= 200 ? "Moderate" : aqi <= 300 ? "Poor" : "Very Poor",
    });
  }
  return readings;
}

export const mockSensorReadings: Record<string, SensorReading[]> = {
  "SPS30-DEMO-001": generateReadingHistory("SPS30-DEMO-001", 47),
  "SPS30-DEMO-002": generateReadingHistory("SPS30-DEMO-002", 28),
  "SPS30-DEMO-003": generateReadingHistory("SPS30-DEMO-003", 112),
  "SPS30-DEMO-004": generateReadingHistory("SPS30-DEMO-004", 188),
  "SPS30-DEMO-005": generateReadingHistory("SPS30-DEMO-005", 210),
  "SPS30-DEMO-006": generateReadingHistory("SPS30-DEMO-006", 36),
  "SPS30-DEMO-007": generateReadingHistory("SPS30-DEMO-007", 78),
  "SPS30-DEMO-014": generateReadingHistory("SPS30-DEMO-014", 53),
};

// ---- Citizen reports ----
export const mockReports: CitizenReport[] = [
  {
    id: "RPT-2024-001",
    pollutionType: "open_waste_burning",
    description: "Large pile of municipal waste being burned near the railway track. Thick black smoke visible from at least 500 metres.",
    lat: 19.104,
    lng: 72.865,
    status: "acknowledged",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    area: "Andheri East, Mumbai",
  },
  {
    id: "RPT-2024-002",
    pollutionType: "construction_dust",
    description: "Construction site on the main road has no dust suppression. Dust is settling on neighbouring houses.",
    lat: 28.631,
    lng: 77.218,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    area: "Connaught Place, Delhi",
  },
  {
    id: "RPT-2024-003",
    pollutionType: "vehicle_smoke",
    description: "Overloaded truck emitting dense black exhaust at the toll plaza.",
    lat: 12.934,
    lng: 77.621,
    status: "resolved",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    area: "Koramangala, Bengaluru",
  },
  {
    id: "RPT-2024-004",
    pollutionType: "industrial_emission",
    description: "Factory chimney discharging without scrubber in the afternoon hours.",
    lat: 13.082,
    lng: 80.209,
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    area: "Anna Nagar, Chennai",
  },
];

// ---- Forecast ----
function generateForecast(horizonHours: number, basePm25: number): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const now = Date.now();
  for (let i = 0; i <= horizonHours; i += 3) {
    // Simulate diurnal pattern: worse at morning rush and evening
    const hourOfDay = (new Date(now + i * 3600 * 1000).getHours() + 5.5) % 24;
    const diurnal = 1 + 0.4 * Math.sin(((hourOfDay - 8) * Math.PI) / 12);
    const trend = 1 + (i / horizonHours) * 0.2;
    const noise = (Math.random() - 0.5) * 15;
    const pm25 = Math.max(8, basePm25 * diurnal * trend + noise);
    const uncertainty = pm25 * 0.15 + i * 0.2;
    const aqi = Math.round((pm25 / 250) * 400);
    points.push({
      timestamp: new Date(now + i * 3600 * 1000).toISOString(),
      pm25: Math.round(pm25 * 10) / 10,
      pm25Low: Math.round(Math.max(5, pm25 - uncertainty) * 10) / 10,
      pm25High: Math.round((pm25 + uncertainty) * 10) / 10,
      aqiValue: Math.min(500, aqi),
      aqiCategory: aqi <= 50 ? "Good" : aqi <= 100 ? "Satisfactory" : aqi <= 200 ? "Moderate" : aqi <= 300 ? "Poor" : "Very Poor",
    });
  }
  return points;
}

export const mockForecast72h = generateForecast(72, 140);
export const mockForecast96h = generateForecast(96, 140);

export const mockForecastDrivers: ForecastDriver[] = [
  { name: "Wind speed", value: "3.2", unit: "m/s", level: 32 },
  { name: "Relative humidity", value: "68", unit: "%", level: 68 },
  { name: "Traffic index", value: "0.74", unit: "(normalised)", level: 74 },
  { name: "Dust loading", value: "Medium", unit: "", level: 50 },
  { name: "Mixing layer height", value: "820", unit: "m", level: 41 },
];

export const mockSatelliteGrid: SatelliteGrid = {
  layer: "aod",
  cells: (() => {
    const cells = [];
    // 8x8 grid over northern India
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        cells.push({
          lat: 22 + i * 1.2,
          lng: 74 + j * 1.5,
          value: 0.1 + Math.random() * 0.8,
        });
      }
    }
    return cells;
  })(),
  minValue: 0.1,
  maxValue: 0.9,
};

// ---- Integrity ledger ----
const sampleHashes = [
  "a3f8c2e1d4b6a9f0e7c3b1a8d5f2c9e6b3a0d7f4c1e8b5a2d9f6c3e0b7a4d1f8",
  "b7d4a1e8c5f2a9d6b3e0c7f4a1d8e5b2c9f6a3d0e7b4c1f8a5d2e9b6c3f0a7d4",
  "c1e8b5d2f9a6c3e0d7b4a1f8e5c2d9b6a3f0e7c4b1d8a5f2c9e6b3d0a7f4c1e8",
  "d5f2c9e6b3a0d7f4c1e8b5a2d9f6c3e0b7a4d1f8a5d2e9b6c3f0a7d4e1b8c5f2",
  "e9b6c3f0a7d4e1b8c5f2a9d6b3e0c7f4a1d8e5b2c9f6a3d0e7b4c1f8a5d2e9b6",
  "f3d0a7e4b1c8f5d2a9b6e3c0f7a4d1b8e5c2f9a6d3b0e7c4a1f8d5b2e9c6f3a0",
];

export const mockLedgerRecords: LedgerRecord[] = mockSensors.slice(0, 6).map((sensor, idx) => ({
  id: `LDG-${String(idx + 1).padStart(4, "0")}`,
  sensorId: sensor.id,
  timestamp: new Date(Date.now() - idx * 3600 * 1000).toISOString(),
  readingHash: sampleHashes[idx],
  proofStatus: (["Verified", "Verified", "Pending", "Verified", "Failed", "Verified"] as const)[idx],
  anchorReference: `0x${sampleHashes[idx].slice(0, 40)}`,
  pm25: sensor.latestReading?.pm25 ?? 50,
}));

// ---- Federated nodes ----
export const mockFederatedNodes: FederatedNode[] = [
  { id: "NODE-MH-01", name: "Maharashtra West Zone", region: "Maharashtra", currentRound: 47, lastUpdate: new Date(Date.now() - 3600000).toISOString(), status: "active", nodeType: "State ICCC" },
  { id: "NODE-DL-01", name: "Delhi NCT Zone", region: "Delhi", currentRound: 47, lastUpdate: new Date(Date.now() - 1800000).toISOString(), status: "active", nodeType: "State ICCC" },
  { id: "NODE-KA-01", name: "Karnataka South Zone", region: "Karnataka", currentRound: 46, lastUpdate: new Date(Date.now() - 7200000).toISOString(), status: "syncing", nodeType: "State ICCC" },
  { id: "NODE-TN-01", name: "Tamil Nadu North Zone", region: "Tamil Nadu", currentRound: 47, lastUpdate: new Date(Date.now() - 900000).toISOString(), status: "active", nodeType: "State ICCC" },
  { id: "NODE-WB-01", name: "West Bengal Zone", region: "West Bengal", currentRound: 44, lastUpdate: new Date(Date.now() - 86400000).toISOString(), status: "inactive", nodeType: "Industrial Zone" },
  { id: "NODE-GJ-01", name: "Gujarat Industrial Corridor", region: "Gujarat", currentRound: 47, lastUpdate: new Date(Date.now() - 2700000).toISOString(), status: "active", nodeType: "Industrial Zone" },
];

// ---- Anomaly alerts ----
export const mockAlerts: AnomalyAlert[] = [
  { id: "ALT-001", type: "PM2.5 spike", location: "Dharavi, Mumbai", severity: "critical", detectedAt: new Date(Date.now() - 10 * 60000).toISOString(), sensorId: "SPS30-DEMO-003", pm25: 312.4, lat: 19.0376, lng: 72.8545 },
  { id: "ALT-002", type: "PM10 elevated", location: "Connaught Place, Delhi", severity: "high", detectedAt: new Date(Date.now() - 25 * 60000).toISOString(), sensorId: "SPS30-DEMO-004", pm25: 187.9, lat: 28.6328, lng: 77.2197 },
  { id: "ALT-003", type: "Sensor offline", location: "Rohini, Delhi", severity: "medium", detectedAt: new Date(Date.now() - 8 * 3600000).toISOString(), sensorId: "SPS30-DEMO-005", pm25: 210.5, lat: 28.7495, lng: 77.0619 },
  { id: "ALT-004", type: "PM2.5 elevated", location: "Salt Lake, Kolkata", severity: "medium", detectedAt: new Date(Date.now() - 45 * 60000).toISOString(), sensorId: "SPS30-DEMO-007", pm25: 78.4, lat: 22.5726, lng: 88.4148 },
  { id: "ALT-005", type: "Industrial emission", location: "Anna Nagar, Chennai", severity: "high", detectedAt: new Date(Date.now() - 60 * 60000).toISOString(), sensorId: "SPS30-DEMO-014", pm25: 143.2, lat: 13.0837, lng: 80.2102 },
];

// ---- Tickets ----
export const mockTickets: Ticket[] = [
  {
    id: "SR-2024-00421",
    serviceCode: "AQI-SPRAY",
    status: "in_progress",
    lat: 19.0376,
    lng: 72.8545,
    description: "PM2.5 exceeded 300 micrograms/m3 for 45 minutes. Water sprinkler deployment requested for Dharavi sector.",
    requestedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    assignedICCC: "Mumbai West ICCC",
    triggerSensorId: "SPS30-DEMO-003",
    triggerPm25: 312.4,
    suggestedResource: "Water sprinkler",
    statusHistory: [
      { status: "open", timestamp: new Date(Date.now() - 10 * 60000).toISOString(), note: "Auto-generated from sensor alert ALT-001." },
      { status: "assigned", timestamp: new Date(Date.now() - 7 * 60000).toISOString(), note: "Assigned to Mumbai West ICCC field team." },
      { status: "in_progress", timestamp: new Date(Date.now() - 5 * 60000).toISOString(), note: "Sprinkler truck dispatched." },
    ],
  },
  {
    id: "SR-2024-00418",
    serviceCode: "AQI-ENFORCE",
    status: "open",
    lat: 28.6328,
    lng: 77.2197,
    description: "PM2.5 at 187.9 and PM10 at 244.3. Enforcement team requested to inspect construction sites in the area.",
    requestedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    assignedICCC: "Delhi Central ICCC",
    triggerSensorId: "SPS30-DEMO-004",
    triggerPm25: 187.9,
    suggestedResource: "Enforcement team",
    statusHistory: [
      { status: "open", timestamp: new Date(Date.now() - 25 * 60000).toISOString(), note: "Auto-generated from sensor alert ALT-002." },
    ],
  },
  {
    id: "SR-2024-00402",
    serviceCode: "AQI-SWEEP",
    status: "closed",
    lat: 22.5726,
    lng: 88.4148,
    description: "Mechanised sweeping requested following elevated PM10 readings in Salt Lake sector.",
    requestedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    assignedICCC: "Kolkata North ICCC",
    triggerSensorId: "SPS30-DEMO-007",
    triggerPm25: 78.4,
    suggestedResource: "Mechanised sweeper",
    statusHistory: [
      { status: "open", timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), note: "Auto-generated from sensor alert." },
      { status: "assigned", timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), note: "Assigned to Kolkata North ICCC." },
      { status: "in_progress", timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), note: "Sweeper deployed." },
      { status: "closed", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), note: "Work completed. Follow-up reading: PM10 at 82.1." },
    ],
  },
  {
    id: "SR-2024-00395",
    serviceCode: "AQI-ENFORCE",
    status: "assigned",
    lat: 13.0837,
    lng: 80.2102,
    description: "Industrial emission reported near Anna Nagar industrial zone. Inspection of factory chimney scrubbers required.",
    requestedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60000).toISOString(),
    assignedICCC: "Chennai North ICCC",
    triggerSensorId: "SPS30-DEMO-014",
    triggerPm25: 143.2,
    suggestedResource: "Enforcement team",
    statusHistory: [
      { status: "open", timestamp: new Date(Date.now() - 60 * 60000).toISOString(), note: "Auto-generated from sensor alert ALT-005." },
      { status: "assigned", timestamp: new Date(Date.now() - 40 * 60000).toISOString(), note: "Assigned to Chennai North ICCC." },
    ],
  },
];

// ---- Alert rules ----
export const mockAlertRules: AlertRule[] = [
  { id: "RULE-001", pollutant: "PM2.5", threshold: 250, unit: "micrograms/m3", duration: "30 minutes", action: "Raise ticket AQI-SPRAY, notify ICCC" },
  { id: "RULE-002", pollutant: "PM10", threshold: 350, unit: "micrograms/m3", duration: "30 minutes", action: "Raise ticket AQI-SWEEP, notify ICCC" },
  { id: "RULE-003", pollutant: "PM2.5", threshold: 150, unit: "micrograms/m3", duration: "60 minutes", action: "Raise ticket AQI-ENFORCE, alert field team" },
  { id: "RULE-004", pollutant: "AQI", threshold: 300, unit: "(index value)", duration: "15 minutes", action: "Send advisory to municipal commissioner" },
  { id: "RULE-005", pollutant: "PM2.5", threshold: 400, unit: "micrograms/m3", duration: "10 minutes", action: "Raise critical alert, engage emergency response" },
];
