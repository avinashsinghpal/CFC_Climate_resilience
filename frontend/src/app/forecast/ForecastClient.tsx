"use client";

import { useState, useEffect } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { MockDataBanner } from "@/components/ui/Banner";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { AqiBadge } from "@/components/ui/Badge";
import { getForecast, getForecastDrivers, getSatelliteGrid } from "@/lib/api";
import { formatNum } from "@/lib/format";
import type { ForecastPoint, ForecastDriver } from "@/types";
import { AQI_BANDS, getAqiBand } from "@/lib/aqi";

const LOCATION_OPTIONS = [
  { value: "delhi", label: "Delhi NCT" },
  { value: "mumbai", label: "Mumbai" },
  { value: "bengaluru", label: "Bengaluru" },
  { value: "kolkata", label: "Kolkata" },
  { value: "chennai", label: "Chennai" },
];

const HORIZON_OPTIONS = [
  { value: "72", label: "72 hours" },
  { value: "96", label: "96 hours" },
];

const SAT_LAYER_OPTIONS = [
  { value: "aod", label: "Aerosol Optical Depth (AOD)" },
  { value: "no2", label: "NO2 concentration" },
];

const MODEL_DETAILS = [
  {
    name: "Swin Transformer v2 Large",
    role: "Spatial downscaling of Sentinel-5P satellite data from 7 km to sub-km resolution using vision transformer attention.",
  },
  {
    name: "ST-GCN",
    role: "Spatio-temporal graph convolutional network that captures traffic topology and temporal sensor correlations.",
  },
  {
    name: "AirDDE",
    role: "Physics-guided advection-diffusion-emission model that constrains the neural forecast with atmospheric transport equations.",
  },
];

const RECOMMENDED_ACTIONS = [
  "Deploy water sprinklers to major dust-prone corridors identified by the forecast model.",
  "Coordinate with traffic management to introduce odd-even vehicle restrictions if AQI is forecast to exceed 300.",
  "Issue public health advisory for sensitive groups (elderly, children, those with respiratory conditions).",
  "Pre-position mechanised sweepers in zones forecast to reach Severe category.",
  "Notify construction site operators of upcoming high-pollution window and request dust suppression.",
];

function formatChartTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, "0");
  const day = d.toLocaleDateString("en-IN", { weekday: "short" });
  return `${day} ${h}h`;
}

export default function ForecastClient() {
  const [location, setLocation] = useState("delhi");
  const [horizon, setHorizon] = useState<72 | 96>(72);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);
  const [drivers, setDrivers] = useState<ForecastDriver[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [satLayer, setSatLayer] = useState<"aod" | "no2">("aod");
  const [satData, setSatData] = useState<number[][]>([]);
  const [satMin, setSatMin] = useState(0);
  const [satMax, setSatMax] = useState(1);

  const nowIndex = 0; // First point is "now"

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [forecastResult, driverResult] = await Promise.all([
        getForecast(horizon),
        getForecastDrivers(),
      ]);
      setForecastData(forecastResult.data);
      setDrivers(driverResult.data);
      setIsMock(forecastResult.isMock);
      setLoading(false);
    }
    load();
  }, [horizon, location]);

  useEffect(() => {
    async function loadSat() {
      const result = await getSatelliteGrid(satLayer);
      if (result.data) {
        // Build 8x8 grid
        const grid: number[][] = [];
        for (let i = 0; i < 8; i++) {
          grid[i] = [];
          for (let j = 0; j < 8; j++) {
            grid[i][j] = result.data.cells[i * 8 + j]?.value ?? 0;
          }
        }
        setSatData(grid);
        setSatMin(result.data.minValue);
        setSatMax(result.data.maxValue);
      }
    }
    loadSat();
  }, [satLayer]);

  const chartData = forecastData.map((pt) => ({
    ...pt,
    label: formatChartTime(pt.timestamp),
  }));

  // Reactive 24h average (first 8 points, 3h intervals)
  const reactive24hAvg =
    forecastData.slice(0, 8).reduce((a, p) => a + p.pm25, 0) / Math.max(1, Math.min(8, forecastData.length));

  const forecastPeak = Math.max(...forecastData.map((p) => p.pm25));
  const forecastPeakCategory = getAqiBand(forecastPeak).category;

  function satColor(value: number): string {
    const normalised = (value - satMin) / Math.max(0.001, satMax - satMin);
    // Brown-yellow scale for AOD, blue-red for NO2
    if (satLayer === "aod") {
      const r = Math.round(30 + normalised * 180);
      const g = Math.round(100 - normalised * 60);
      const b = Math.round(20);
      return `rgb(${r},${g},${b})`;
    } else {
      const r = Math.round(normalised * 200);
      const g = 40;
      const b = Math.round(200 - normalised * 150);
      return `rgb(${r},${g},${b})`;
    }
  }

  return (
    <>
      {isMock && (
        <MockDataBanner>
          Sample data. This is a prototype and the forecast values are not real.
        </MockDataBanner>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-28 font-semibold text-ink mb-2">
          Air quality forecast
        </h1>
        <p className="text-16 text-muted mb-6">
          Predicted PM2.5 and AQI for the selected location, with a shaded
          confidence range. The forecast horizon is 72 to 96 hours.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="w-48">
            <Select
              id="forecast-location"
              label="Location"
              options={LOCATION_OPTIONS}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              id="forecast-horizon"
              label="Horizon"
              options={HORIZON_OPTIONS}
              value={String(horizon)}
              onChange={(e) => setHorizon(Number(e.target.value) as 72 | 96)}
            />
          </div>
        </div>

        {/* Main forecast chart */}
        <div className="border border-border rounded-sm bg-surface p-6 mb-6">
          <h2 className="text-20 font-semibold text-ink mb-1">
            PM2.5 forecast ({horizon} hours)
          </h2>
          <p className="text-14 text-muted mb-4">
            Shaded area shows the 15% confidence interval. AQI band backgrounds
            indicate category thresholds.
          </p>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="relative">
              {/* AQI band background labels */}
              <div className="absolute right-0 top-0 flex flex-col items-end gap-1 z-10 pointer-events-none pr-1">
                {AQI_BANDS.slice(0, 4).map((b) => (
                  <span
                    key={b.category}
                    className="text-14 font-medium"
                    style={{ color: b.textColor }}
                  >
                    {b.category}
                  </span>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="confRange"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1F4D3A"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#1F4D3A"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="#D9D5CB"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#55605A" }}
                    interval={Math.floor(chartData.length / 8)}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#55605A" }}
                    label={{
                      value: "ug/m3",
                      angle: -90,
                      position: "insideLeft",
                      offset: 16,
                      style: { fontSize: 11, fill: "#55605A" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #D9D5CB",
                      borderRadius: "2px",
                      fontSize: "12px",
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(val: any, name: any) => {
                      const labels: Record<string, string> = {
                        pm25: "PM2.5 (ug/m3)",
                        pm25High: "Upper bound",
                        pm25Low: "Lower bound",
                      };
                      return [typeof val === "number" ? formatNum(val, 1) : String(val), labels[String(name)] ?? String(name)];
                    }}
                  />
                  {/* AQI threshold lines */}
                  <ReferenceLine
                    y={60}
                    stroke="#6B9E3A"
                    strokeDasharray="4 3"
                    label={{ value: "Satisfactory (60)", fontSize: 10, fill: "#6B9E3A" }}
                  />
                  <ReferenceLine
                    y={90}
                    stroke="#C68A1A"
                    strokeDasharray="4 3"
                    label={{ value: "Moderate (90)", fontSize: 10, fill: "#C68A1A" }}
                  />
                  <ReferenceLine
                    y={nowIndex}
                    stroke="#B4530A"
                    strokeWidth={2}
                    label={{ value: "Now", fontSize: 10, fill: "#B4530A" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pm25High"
                    stroke="none"
                    fill="url(#confRange)"
                    name="Upper bound"
                  />
                  <Area
                    type="monotone"
                    dataKey="pm25Low"
                    stroke="none"
                    fill="#FFFFFF"
                    name="Lower bound"
                  />
                  <Line
                    type="monotone"
                    dataKey="pm25"
                    stroke="#1F4D3A"
                    strokeWidth={2}
                    dot={false}
                    name="PM2.5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Comparison strip */}
        <div className="border border-border rounded-sm bg-surface p-6 mb-6">
          <h2 className="text-20 font-semibold text-ink mb-1">
            Reactive vs. forecast response
          </h2>
          <p className="text-14 text-muted mb-4">
            Comparison between a 24-hour reactive average approach and the
            forecast-based approach, showing when each would trigger a response.
          </p>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-paper border border-border rounded-sm p-4">
                <p className="text-14 font-medium text-muted mb-1">
                  Reactive 24-hour average
                </p>
                <p className="text-28 font-semibold font-mono text-ink">
                  {formatNum(reactive24hAvg)} ug/m3
                </p>
                <p className="text-14 text-muted mt-1">
                  Response triggered after threshold is exceeded.
                </p>
                <AqiBadge category={getAqiBand(reactive24hAvg).category} />
              </div>
              <div className="bg-paper border border-border rounded-sm p-4">
                <p className="text-14 font-medium text-muted mb-1">
                  Forecast peak (next {horizon} hours)
                </p>
                <p className="text-28 font-semibold font-mono text-ink">
                  {formatNum(forecastPeak)} ug/m3
                </p>
                <p className="text-14 text-muted mt-1">
                  Resources pre-positioned before the peak.
                </p>
                <AqiBadge category={forecastPeakCategory} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Satellite panel */}
          <div className="border border-border rounded-sm bg-surface p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-20 font-semibold text-ink">
                Satellite layer
              </h2>
              <div className="w-56">
                <Select
                  id="sat-layer"
                  label="Layer"
                  options={SAT_LAYER_OPTIONS}
                  value={satLayer}
                  onChange={(e) => setSatLayer(e.target.value as "aod" | "no2")}
                />
              </div>
            </div>
            <p className="text-14 text-muted mb-3">
              Source: Sentinel-5P TROPOMI (ESA/Copernicus). Data downscaled
              from 7 km to sub-km resolution using the Swin Transformer model.
              Sample values only.
            </p>
            {satData.length > 0 ? (
              <div aria-label={`Satellite heatmap showing ${satLayer === "aod" ? "Aerosol Optical Depth" : "NO2 concentration"}`}>
                <svg
                  viewBox="0 0 160 160"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  className="border border-border rounded-sm"
                >
                  {satData.map((row, i) =>
                    row.map((val, j) => (
                      <rect
                        key={`${i}-${j}`}
                        x={j * 20}
                        y={i * 20}
                        width={20}
                        height={20}
                        fill={satColor(val)}
                        opacity={0.8}
                      >
                        <title>{`Row ${i + 1}, Col ${j + 1}: ${val.toFixed(3)}`}</title>
                      </rect>
                    ))
                  )}
                </svg>
                <p className="text-14 text-muted mt-2">
                  8x8 grid. Low value: light, high value: dark.
                  {satLayer === "aod" ? " AOD range: 0.1 to 0.9." : " NO2 (sample)."}
                </p>
              </div>
            ) : (
              <Skeleton className="h-40 w-full" />
            )}
          </div>

          {/* Drivers panel */}
          <div className="border border-border rounded-sm bg-surface p-6">
            <h2 className="text-20 font-semibold text-ink mb-4">
              Forecast drivers
            </h2>
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <ul className="space-y-4">
                {drivers.map((driver) => (
                  <li key={driver.name}>
                    <div className="flex justify-between text-14 mb-1">
                      <span className="font-medium text-ink">{driver.name}</span>
                      <span className="font-mono text-muted">
                        {driver.value}
                        {driver.unit ? ` ${driver.unit}` : ""}
                      </span>
                    </div>
                    <div
                      className="h-2 bg-paper border border-border rounded-sm overflow-hidden"
                      role="meter"
                      aria-valuenow={driver.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${driver.name}: ${driver.level}%`}
                    >
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${driver.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Model details */}
        <div className="border border-border rounded-sm bg-surface p-6 mb-6">
          <h2 className="text-20 font-semibold text-ink mb-4">
            Model details
          </h2>
          <p className="text-14 text-muted mb-4">
            The forecast is produced by a three-model ensemble. No performance
            claims are made for this prototype.
          </p>
          <div className="table-scroll-container">
            <table className="w-full text-14 border-collapse" aria-label="Model details">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted w-48">
                    Model
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODEL_DETAILS.map((m) => (
                  <tr key={m.name} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-ink font-medium align-top">
                      {m.name}
                    </td>
                    <td className="px-4 py-3 text-muted leading-relaxed">
                      {m.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended actions */}
        <div className="border border-border rounded-sm bg-surface p-6">
          <h2 className="text-20 font-semibold text-ink mb-2">
            Suggested actions for the forecast window
          </h2>
          <p className="text-14 text-muted mb-4">
            These are suggestions based on the forecast. Final decisions rest
            with the municipal officer.
          </p>
          <ul className="space-y-3">
            {RECOMMENDED_ACTIONS.map((action) => (
              <li key={action} className="flex items-start gap-3">
                <span
                  className="mt-1.5 w-2 h-2 bg-primary rounded-sm shrink-0"
                  aria-hidden="true"
                />
                <span className="text-14 text-muted">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
