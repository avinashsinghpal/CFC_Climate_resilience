"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MockDataBanner, NotEnabledBanner } from "@/components/ui/Banner";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getAlerts, getTickets, getAlertRules } from "@/lib/api";
import {
  formatDatetime,
  relativeTime,
  severityLabel,
  ticketStatusLabel,
  formatNum,
} from "@/lib/format";
import { getSensorReadings } from "@/lib/api";
import type { AnomalyAlert, Ticket, AlertRule, SensorReading } from "@/types";

const ICCC_ROUTING = [
  { area: "Mumbai West", zones: ["Andheri", "Bandra", "Dharavi"], iccc: "Mumbai West ICCC" },
  { area: "Delhi Central", zones: ["Connaught Place", "Karol Bagh"], iccc: "Delhi Central ICCC" },
  { area: "Delhi North", zones: ["Rohini", "Pitampura"], iccc: "Delhi North ICCC" },
  { area: "Bengaluru South", zones: ["Koramangala", "HSR Layout"], iccc: "Bengaluru South ICCC" },
  { area: "Kolkata North", zones: ["Salt Lake", "Dumdum"], iccc: "Kolkata North ICCC" },
  { area: "Chennai North", zones: ["Anna Nagar", "Ambattur"], iccc: "Chennai North ICCC" },
];

const severityOrder: Record<string, number> = {
  critical: 4, high: 3, medium: 2, low: 1,
};

function AlertFeed({ alerts, onSelect, selectedId }: {
  alerts: AnomalyAlert[];
  onSelect: (a: AnomalyAlert) => void;
  selectedId?: string;
}) {
  const severityColor: Record<string, string> = {
    low: "border-l-amber-400",
    medium: "border-l-orange-400",
    high: "border-l-red-500",
    critical: "border-l-red-700",
  };

  return (
    <ul className="space-y-2" aria-label="Anomaly alert feed">
      {alerts.map((alert) => (
        <li key={alert.id}>
          <button
            className={[
              "w-full text-left border border-border rounded-sm p-3 bg-surface",
              "border-l-4 transition-colors duration-[120ms]",
              "hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              severityColor[alert.severity] ?? "border-l-border",
              selectedId === alert.id ? "bg-paper" : "",
            ].join(" ")}
            onClick={() => onSelect(alert)}
            aria-label={`${alert.severity} alert: ${alert.type} at ${alert.location}`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-14 font-semibold text-ink">
                {alert.type}
              </span>
              <Badge variant="severity">{severityLabel(alert.severity)}</Badge>
            </div>
            <p className="text-14 text-muted">{alert.location}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-14 font-mono text-muted">
                PM2.5: {alert.pm25} ug/m3
              </span>
              <span className="text-14 text-muted">
                {relativeTime(alert.detectedAt)}
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function TicketTimeline({ history }: { history: Ticket["statusHistory"] }) {
  const statusColor: Record<string, string> = {
    open: "bg-amber-400",
    assigned: "bg-blue-400",
    in_progress: "bg-sky-400",
    closed: "bg-green-500",
  };

  return (
    <ol className="relative border-l border-border ml-4 space-y-4" aria-label="Ticket status history">
      {history.map((h, i) => (
        <li key={i} className="pl-6 relative">
          <span
            className={`absolute -left-2 w-4 h-4 rounded-sm ${statusColor[h.status] ?? "bg-border"}`}
            aria-hidden="true"
          />
          <p className="text-14 font-medium text-ink">
            {ticketStatusLabel(h.status)}
          </p>
          <p className="text-14 text-muted">{h.note}</p>
          <p className="text-14 text-muted">{formatDatetime(h.timestamp)}</p>
        </li>
      ))}
    </ol>
  );
}

export default function AlertsClient() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<AnomalyAlert | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketReadings, setTicketReadings] = useState<SensorReading[]>([]);
  const [editRuleDrawer, setEditRuleDrawer] = useState(false);
  const [editRuleNotEnabled, setEditRuleNotEnabled] = useState(false);
  const [icccArea, setIcccArea] = useState(ICCC_ROUTING[0]);

  useEffect(() => {
    async function load() {
      const [alertResult, ticketResult, ruleResult] = await Promise.all([
        getAlerts(),
        getTickets(),
        getAlertRules(),
      ]);
      setAlerts(
        [...alertResult.data].sort(
          (a, b) =>
            (severityOrder[b.severity] ?? 0) - (severityOrder[a.severity] ?? 0)
        )
      );
      setTickets(ticketResult.data);
      setRules(ruleResult.data);
      setIsMock(alertResult.isMock || ticketResult.isMock);
      setLoading(false);
    }
    load();
  }, []);

  async function openTicket(ticket: Ticket) {
    setSelectedTicket(ticket);
    const result = await getSensorReadings(ticket.triggerSensorId);
    setTicketReadings(result.data.slice(-12));
  }

  const filteredTickets =
    statusFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "open", label: "Open" },
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In progress" },
    { value: "closed", label: "Closed" },
  ];

  const ticketChartData = ticketReadings.map((r) => ({
    time: new Date(r.timestamp).getHours() + "h",
    pm25: r.pm25,
  }));

  const ticketStatusStyle: Record<string, string> = {
    open: "bg-amber-50 text-amber-800 border-amber-200",
    assigned: "bg-blue-50 text-blue-800 border-blue-200",
    in_progress: "bg-sky-50 text-sky-800 border-sky-200",
    closed: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <>
      {isMock && (
        <MockDataBanner>
          Sample data. These alerts and tickets are synthetic.
        </MockDataBanner>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-28 font-semibold text-ink mb-2">
          Alerts and tickets
        </h1>
        <p className="text-16 text-muted mb-6">
          Real-time anomaly feed and Open311-compatible service tickets raised
          by the platform.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Alert feed */}
          <div className="lg:col-span-1">
            <h2 className="text-20 font-semibold text-ink mb-4">
              Live anomaly feed
            </h2>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <AlertFeed
                alerts={alerts}
                onSelect={setSelectedAlert}
                selectedId={selectedAlert?.id}
              />
            )}
          </div>

          {/* Ticket table */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-20 font-semibold text-ink">
                Service tickets
              </h2>
              <div className="w-44">
                <Select
                  id="ticket-status-filter"
                  label="Filter by status"
                  options={STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="table-scroll-container border border-border rounded-sm">
                <table
                  className="w-full text-14 border-collapse"
                  aria-label="Service tickets"
                >
                  <thead>
                    <tr className="border-b border-border bg-paper">
                      <th className="px-4 py-3 text-left font-medium text-muted whitespace-nowrap">
                        SR ID
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted">
                        ICCC
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-muted">
                        Raised
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b border-border last:border-0 cursor-pointer hover:bg-paper transition-colors duration-[120ms]"
                        onClick={() => openTicket(ticket)}
                        aria-label={`Ticket ${ticket.id}, status: ${ticket.status}`}
                      >
                        <td className="px-4 py-3 font-mono text-ink whitespace-nowrap">
                          {ticket.id}
                        </td>
                        <td className="px-4 py-3 text-muted font-mono">
                          {ticket.serviceCode}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 text-14 font-medium border rounded-sm ${ticketStatusStyle[ticket.status] ?? ""}`}
                          >
                            {ticketStatusLabel(ticket.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {ticket.assignedICCC}
                        </td>
                        <td className="px-4 py-3 text-muted whitespace-nowrap">
                          {relativeTime(ticket.requestedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Rules panel */}
        <div className="border border-border rounded-sm bg-surface p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-20 font-semibold text-ink">Alert rules</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditRuleDrawer(true)}
            >
              Edit rules
            </Button>
          </div>
          <p className="text-14 text-muted mb-4">
            Thresholds that trigger automatic ticket creation. Editing is
            disabled in this prototype.
          </p>
          <div className="table-scroll-container">
            <table
              className="w-full text-14 border-collapse"
              aria-label="Alert rules"
            >
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Pollutant
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted">
                    Threshold
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-ink">
                      {rule.pollutant}
                    </td>
                    <td className="px-4 py-3 font-mono text-right text-ink">
                      {rule.threshold}
                    </td>
                    <td className="px-4 py-3 text-muted">{rule.unit}</td>
                    <td className="px-4 py-3 text-muted">{rule.duration}</td>
                    <td className="px-4 py-3 text-muted">{rule.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ICCC routing card */}
        <div className="border border-border rounded-sm bg-surface p-6">
          <h2 className="text-20 font-semibold text-ink mb-4">
            ICCC routing
          </h2>
          <p className="text-14 text-muted mb-4">
            Shows which ICCC receives alerts for a selected area.
          </p>
          <div className="flex flex-wrap gap-4 items-start">
            <div className="w-56">
              <Select
                id="iccc-area-select"
                label="Select area"
                options={ICCC_ROUTING.map((r) => ({
                  value: r.area,
                  label: r.area,
                }))}
                value={icccArea.area}
                onChange={(e) => {
                  const found = ICCC_ROUTING.find(
                    (r) => r.area === e.target.value
                  );
                  if (found) setIcccArea(found);
                }}
              />
            </div>
            <div className="flex-1 border border-border rounded-sm p-4 bg-paper">
              <p className="text-14 text-muted mb-1">Zones covered</p>
              <p className="text-16 font-medium text-ink">
                {icccArea.zones.join(", ")}
              </p>
              <p className="text-14 text-muted mt-2 mb-1">Routes to</p>
              <p className="text-20 font-semibold text-primary">
                {icccArea.iccc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket detail drawer */}
      <Drawer
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.id ?? ""}
        width="w-full max-w-xl"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 items-center">
              <span
                className={`inline-block px-2 py-0.5 text-14 font-medium border rounded-sm ${ticketStatusStyle[selectedTicket.status] ?? ""}`}
              >
                {ticketStatusLabel(selectedTicket.status)}
              </span>
              <span className="text-14 font-mono text-muted">
                {selectedTicket.serviceCode}
              </span>
            </div>

            <div>
              <p className="text-14 font-medium text-ink mb-1">Description</p>
              <p className="text-14 text-muted">{selectedTicket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-14">
              <div>
                <p className="text-muted">Assigned ICCC</p>
                <p className="font-medium text-ink">{selectedTicket.assignedICCC}</p>
              </div>
              <div>
                <p className="text-muted">Trigger sensor</p>
                <p className="font-mono text-ink">{selectedTicket.triggerSensorId}</p>
              </div>
              <div>
                <p className="text-muted">Trigger PM2.5</p>
                <p className="font-mono text-ink">
                  {formatNum(selectedTicket.triggerPm25)} ug/m3
                </p>
              </div>
              <div>
                <p className="text-muted">Suggested resource</p>
                <p className="font-medium text-ink">{selectedTicket.suggestedResource}</p>
              </div>
              <div>
                <p className="text-muted">Coordinates</p>
                <p className="font-mono text-ink">
                  {selectedTicket.lat.toFixed(4)}, {selectedTicket.lng.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-muted">Raised at</p>
                <p className="text-ink">{formatDatetime(selectedTicket.requestedAt)}</p>
              </div>
            </div>

            {/* Triggering readings chart */}
            <div>
              <p className="text-14 font-medium text-ink mb-2">
                Triggering sensor readings (PM2.5, ug/m3)
              </p>
              {ticketChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart
                    data={ticketChartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
                  >
                    <CartesianGrid stroke="#D9D5CB" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11, fill: "#55605A" }}
                      interval={2}
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
                      stroke="#C05A1F"
                      strokeWidth={1.5}
                      dot={false}
                      name="PM2.5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-28 w-full" />
              )}
            </div>

            {/* Timeline */}
            <div>
              <p className="text-14 font-medium text-ink mb-3">
                Status history
              </p>
              <TicketTimeline history={selectedTicket.statusHistory} />
            </div>
          </div>
        )}
      </Drawer>

      {/* Alert detail drawer */}
      <Drawer
        open={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.type ?? "Alert"}
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge variant="severity">{severityLabel(selectedAlert.severity)}</Badge>
              <span className="text-14 text-muted">
                {selectedAlert.sensorId}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-14">
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="text-ink font-medium">{selectedAlert.location}</dd>
              </div>
              <div>
                <dt className="text-muted">Detected</dt>
                <dd className="text-ink">{formatDatetime(selectedAlert.detectedAt)}</dd>
              </div>
              <div>
                <dt className="text-muted">PM2.5</dt>
                <dd className="font-mono text-ink">{formatNum(selectedAlert.pm25)} ug/m3</dd>
              </div>
              <div>
                <dt className="text-muted">Coordinates</dt>
                <dd className="font-mono text-ink">
                  {selectedAlert.lat.toFixed(4)}, {selectedAlert.lng.toFixed(4)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Drawer>

      {/* Edit rule drawer */}
      <Drawer
        open={editRuleDrawer}
        onClose={() => {
          setEditRuleDrawer(false);
          setEditRuleNotEnabled(false);
        }}
        title="Edit alert rules"
      >
        <div className="space-y-4">
          <p className="text-16 text-muted">
            Select a rule to modify its threshold, duration or action.
          </p>
          {editRuleNotEnabled && (
            <NotEnabledBanner feature="Rule editing" />
          )}
          <ul className="space-y-3">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="border border-border rounded-sm p-4 bg-paper"
              >
                <p className="text-14 font-medium text-ink">
                  {rule.pollutant} &gt; {rule.threshold} {rule.unit}
                </p>
                <p className="text-14 text-muted">Duration: {rule.duration}</p>
                <p className="text-14 text-muted">Action: {rule.action}</p>
              </li>
            ))}
          </ul>
          <Button
            variant="primary"
            onClick={() => setEditRuleNotEnabled(true)}
          >
            Save changes
          </Button>
        </div>
      </Drawer>
    </>
  );
}
