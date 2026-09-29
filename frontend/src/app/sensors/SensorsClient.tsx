"use client";

import { useState, useEffect } from "react";
import { MockDataBanner } from "@/components/ui/Banner";
import { Select } from "@/components/ui/Select";
import { Badge, AqiBadge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSensors, getSensorReadings } from "@/lib/api";
import { formatDatetime, relativeTime, formatNum } from "@/lib/format";
import type { Sensor, SensorReading } from "@/types";
import { Battery, Wifi, Clock, Cpu } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AQI_BANDS } from "@/lib/aqi";

const PROTOCOL_OPTIONS = [
  { value: "all", label: "All protocols" },
  { value: "LoRaWAN", label: "LoRaWAN" },
  { value: "NB-IoT", label: "NB-IoT" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "online", label: "Online" },
  { value: "delayed", label: "Delayed" },
  { value: "offline", label: "Offline" },
];

const AREA_OPTIONS = [
  { value: "all", label: "All cities" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" },
  { value: "Bengaluru", label: "Bengaluru" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Chennai", label: "Chennai" },
];

// Leaflet map - dynamic import to avoid SSR issues
import dynamic from "next/dynamic";
const SensorMap = dynamic(() => import("@/components/map/SensorMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-paper flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [protocol, setProtocol] = useState("all");
  const [status, setStatus] = useState("all");
  const [area, setArea] = useState("all");
  const [sortKey, setSortKey] = useState<"id" | "aqiValue" | "status">("aqiValue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [readingsLoading, setReadingsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await getSensors({ protocol, status, area });
        setSensors(result.data);
        setIsMock(result.isMock);
      } catch {
        setError("Failed to load sensors. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [protocol, status, area]);

  async function openSensor(sensor: Sensor) {
    setSelectedSensor(sensor);
    setReadingsLoading(true);
    const result = await getSensorReadings(sensor.id);
    setReadings(result.data);
    setReadingsLoading(false);
  }

  function handleSort(key: typeof sortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...sensors].sort((a, b) => {
    let av = 0, bv = 0;
    if (sortKey === "aqiValue") {
      av = a.latestReading?.aqiValue ?? 0;
      bv = b.latestReading?.aqiValue ?? 0;
    } else if (sortKey === "id") {
      return sortDir === "asc"
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    } else if (sortKey === "status") {
      return sortDir === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const sortIndicator = (col: typeof sortKey) => {
    if (sortKey !== col) return <span className="ml-1 text-muted opacity-40">-</span>;
    return <span className="ml-1">{sortDir === "asc" ? "+" : "-"}</span>;
  };

  const chartData = readings.map((r) => ({
    time: new Date(r.timestamp).getHours() + "h",
    pm25: r.pm25,
    pm10: r.pm10,
  }));

  return (
    <>
      {isMock && (
        <MockDataBanner>
          Sample data. This is a prototype and the values are not real measurements.
        </MockDataBanner>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-28 font-semibold text-ink mb-2">Sensor network</h1>
        <p className="text-16 text-muted mb-6">
          Low-cost Sensirion SPS30 particulate sensors deployed over LoRaWAN
          and NB-IoT. Click a row or map marker to view sensor detail.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-48">
            <Select
              id="filter-protocol"
              label="Protocol"
              options={PROTOCOL_OPTIONS}
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select
              id="filter-status"
              label="Status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select
              id="filter-area"
              label="City"
              options={AREA_OPTIONS}
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div role="alert" className="border border-red-300 bg-red-50 p-4 rounded-sm text-14 text-red-800 mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-0 border border-border rounded-sm overflow-hidden">
          {/* Map */}
          <div className="h-72 lg:h-[520px] lg:w-1/2 bg-paper">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <SensorMap
                sensors={sorted}
                selectedId={selectedSensor?.id}
                onSelectSensor={openSensor}
              />
            )}
          </div>

          {/* Table */}
          <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-border overflow-hidden flex flex-col">
            {/* AQI legend */}
            <div className="px-4 py-3 border-b border-border bg-paper flex flex-wrap gap-3">
              {AQI_BANDS.map((band) => (
                <span key={band.category} className="flex items-center gap-1.5 text-14">
                  <span
                    className="inline-block w-3 h-3 rounded-sm border"
                    style={{ background: band.color, borderColor: band.color }}
                    aria-hidden="true"
                  />
                  <span style={{ color: band.textColor }}>{band.category}</span>
                </span>
              ))}
            </div>

            <div className="overflow-auto flex-1">
              {loading ? (
                <div className="p-4"><Skeleton className="h-64 w-full" /></div>
              ) : sorted.length === 0 ? (
                <EmptyState title="No sensors match filters" description="Try adjusting the protocol, status or city filter." />
              ) : (
                <table className="w-full text-14 border-collapse" aria-label="Sensor list">
                  <thead>
                    <tr className="border-b border-border bg-paper sticky top-0">
                      <th className="px-4 py-3 text-left font-medium text-muted">
                        <button
                          onClick={() => handleSort("id")}
                          className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                          Sensor ID {sortIndicator("id")}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted">Area</th>
                      <th className="px-4 py-3 text-left font-medium text-muted">
                        <button
                          onClick={() => handleSort("status")}
                          className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                          Status {sortIndicator("status")}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-muted">
                        <button
                          onClick={() => handleSort("aqiValue")}
                          className="hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                          AQI {sortIndicator("aqiValue")}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-muted">PM2.5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((s) => (
                      <tr
                        key={s.id}
                        className={[
                          "border-b border-border cursor-pointer transition-colors duration-[120ms]",
                          selectedSensor?.id === s.id
                            ? "bg-green-50"
                            : "hover:bg-paper",
                        ].join(" ")}
                        onClick={() => openSensor(s)}
                        aria-selected={selectedSensor?.id === s.id}
                      >
                        <td className="px-4 py-3 font-mono text-ink">{s.id}</td>
                        <td className="px-4 py-3 text-muted">
                          {s.area}, {s.city}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="status">{s.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {s.latestReading ? (
                            <AqiBadge category={s.latestReading.aqiCategory} />
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {s.latestReading
                            ? `${formatNum(s.latestReading.pm25)}`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <p className="text-14 text-muted mt-2">
          Showing {sorted.length} sensor{sorted.length !== 1 ? "s" : ""}. PM2.5 in micrograms/m3.
        </p>
      </div>

      {/* Sensor detail drawer */}
      <Drawer
        open={!!selectedSensor}
        onClose={() => setSelectedSensor(null)}
        title={selectedSensor?.id ?? ""}
      >
        {selectedSensor && (
          <div className="space-y-6">
            {/* Status row */}
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="status">{selectedSensor.status}</Badge>
              <span className="text-14 text-muted">
                {selectedSensor.protocol}
              </span>
              {selectedSensor.latestReading && (
                <AqiBadge
                  category={selectedSensor.latestReading.aqiCategory}
                />
              )}
            </div>

            {/* Location */}
            <div>
              <p className="text-14 font-medium text-ink">Location</p>
              <p className="text-14 text-muted">
                {selectedSensor.area}, {selectedSensor.city}
              </p>
              <p className="text-14 font-mono text-muted">
                {formatNum(selectedSensor.lat, 4)},{" "}
                {formatNum(selectedSensor.lng, 4)}
              </p>
            </div>

            {/* Readings */}
            {selectedSensor.latestReading && (
              <div>
                <p className="text-14 font-medium text-ink mb-3">
                  Latest readings
                </p>
                <dl className="grid grid-cols-2 gap-3">
                  {[
                    { label: "PM2.5", value: `${formatNum(selectedSensor.latestReading.pm25)} ug/m3` },
                    { label: "PM10", value: `${formatNum(selectedSensor.latestReading.pm10)} ug/m3` },
                    { label: "Temperature", value: `${formatNum(selectedSensor.latestReading.temperature, 1)} deg C` },
                    { label: "Humidity", value: `${formatNum(selectedSensor.latestReading.humidity, 0)}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-paper border border-border rounded-sm p-3">
                      <dt className="text-14 text-muted">{label}</dt>
                      <dd className="text-16 font-semibold font-mono text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Device info */}
            <div>
              <p className="text-14 font-medium text-ink mb-3">Device</p>
              <ul className="space-y-2 text-14">
                <li className="flex items-center gap-2 text-muted">
                  <Cpu size={14} aria-hidden="true" />
                  Model: {selectedSensor.model}
                </li>
                <li className="flex items-center gap-2 text-muted">
                  <Cpu size={14} aria-hidden="true" />
                  Firmware: {selectedSensor.firmware}
                </li>
                <li className="flex items-center gap-2 text-muted">
                  <Wifi size={14} aria-hidden="true" />
                  Protocol: {selectedSensor.protocol}
                </li>
                <li className="flex items-center gap-2 text-muted">
                  <Battery size={14} aria-hidden="true" />
                  Battery: {selectedSensor.batteryPercent}%
                </li>
                <li className="flex items-center gap-2 text-muted">
                  <Clock size={14} aria-hidden="true" />
                  Last seen: {relativeTime(selectedSensor.lastSeen)} ({formatDatetime(selectedSensor.lastSeen)})
                </li>
              </ul>
            </div>

            {/* 24h chart */}
            <div>
              <p className="text-14 font-medium text-ink mb-3">
                PM2.5 last 24 hours (micrograms/m3)
              </p>
              {readingsLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
                  >
                    <CartesianGrid stroke="#D9D5CB" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11, fill: "#55605A" }}
                      interval={5}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#55605A" }} />
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #D9D5CB",
                        borderRadius: "2px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      stroke="#1F4D3A"
                      strokeWidth={1.5}
                      dot={false}
                      name="PM2.5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
