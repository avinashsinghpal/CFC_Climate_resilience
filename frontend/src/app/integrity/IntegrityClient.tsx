"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Upload } from "lucide-react";
import { MockDataBanner, NotEnabledBanner } from "@/components/ui/Banner";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import { getLedgerRecords, getFederatedNodes, verifyRecord } from "@/lib/api";
import { formatDatetime, truncateHash } from "@/lib/format";
import type { LedgerRecord, FederatedNode, ProofStatus } from "@/types";
import { mockSensors } from "@/mocks";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="ml-1 text-muted hover:text-ink transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm p-0.5"
      aria-label="Copy hash to clipboard"
    >
      {copied ? (
        <Check size={12} aria-hidden="true" className="text-green-700" />
      ) : (
        <Copy size={12} aria-hidden="true" />
      )}
    </button>
  );
}

function LedgerTab({
  records,
  loading,
}: {
  records: LedgerRecord[];
  loading: boolean;
}) {
  const [sensorFilter, setSensorFilter] = useState("all");
  const sensorOptions = [
    { value: "all", label: "All sensors" },
    ...mockSensors.map((s) => ({ value: s.id, label: s.id })),
  ];

  const filtered =
    sensorFilter === "all"
      ? records
      : records.filter((r) => r.sensorId === sensorFilter);

  const proofColors: Record<ProofStatus, string> = {
    Verified: "bg-green-50 text-green-800 border-green-200",
    Pending: "bg-amber-50 text-amber-800 border-amber-200",
    Failed: "bg-red-50 text-red-800 border-red-200",
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="w-56">
          <Select
            id="ledger-sensor-filter"
            label="Sensor"
            options={sensorOptions}
            value={sensorFilter}
            onChange={(e) => setSensorFilter(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="table-scroll-container border border-border rounded-sm">
          <table
            className="w-full text-14 border-collapse"
            aria-label="Ledger records"
          >
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Sensor ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  PM2.5
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Hash
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Proof status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">
                  Anchor
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec) => (
                <tr
                  key={rec.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-ink">{rec.sensorId}</td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {formatDatetime(rec.timestamp)}
                  </td>
                  <td className="px-4 py-3 font-mono text-ink">
                    {rec.pm25} ug/m3
                  </td>
                  <td className="px-4 py-3 font-mono text-muted">
                    <span className="flex items-center gap-1">
                      <span title={rec.readingHash}>
                        {truncateHash(rec.readingHash)}
                      </span>
                      <CopyButton text={rec.readingHash} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-14 font-medium border rounded-sm ${proofColors[rec.proofStatus]}`}
                    >
                      {rec.proofStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted text-14">
                    <span title={rec.anchorReference}>
                      {truncateHash(rec.anchorReference, 6, 4)}
                    </span>
                    <CopyButton text={rec.anchorReference} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function VerifyTab() {
  const [hashInput, setHashInput] = useState("");
  const [fileError, setFileError] = useState("");
  const [result, setResult] = useState<{
    valid: boolean;
    checks: string[];
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!hashInput.trim()) return;
    setLoading(true);
    const res = await verifyRecord(hashInput);
    setResult(res.data);
    setSubmitted(true);
    setLoading(false);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setFileError("Only JSON reading files are accepted.");
      return;
    }
    setFileError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        setHashInput(parsed.readingHash ?? "");
      } catch {
        setFileError("Could not parse the file as JSON.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="max-w-lg">
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label
            htmlFor="hash-input"
            className="block text-14 font-medium text-ink mb-1"
          >
            Reading hash or anchor reference
          </label>
          <textarea
            id="hash-input"
            className="w-full px-3 py-2 font-mono text-14 text-ink bg-surface border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-focus"
            rows={3}
            placeholder="Paste a 64-character SHA-256 hash..."
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="reading-file"
            className="block text-14 font-medium text-ink mb-1"
          >
            Or upload a reading JSON file
          </label>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 text-14 font-medium text-primary border border-primary rounded-sm hover:bg-paper transition-colors duration-[120ms] cursor-pointer focus-visible:outline-none">
              <Upload size={14} aria-hidden="true" />
              Choose file
              <input
                id="reading-file"
                type="file"
                accept=".json"
                className="sr-only"
                onChange={handleFile}
              />
            </label>
            {fileError && (
              <p className="text-14 text-red-700">{fileError}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={!hashInput.trim() || loading}
        >
          {loading ? "Checking..." : "Verify record"}
        </Button>
      </form>

      {submitted && result && (
        <div className="mt-6">
          <NotEnabledBanner feature="Record verification" />
          <div className="mt-4 border border-border rounded-sm p-4 bg-paper">
            <h3 className="text-16 font-semibold text-ink mb-3">
              Checks performed (stub)
            </h3>
            <ul className="space-y-2">
              {result.checks.map((check) => (
                <li key={check} className="text-14 text-muted flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5" aria-hidden="true">-</span>
                  {check}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function EvidenceTab() {
  return (
    <div className="max-w-lg space-y-4">
      <p className="text-16 text-muted">
        Generate a cryptographically verifiable evidence bundle for tribunal
        submission. Bundles include raw readings, zk-SNARK proofs, and anchor
        references.
      </p>
      <div className="w-56">
        <Select
          id="evidence-sensor"
          label="Sensor"
          options={[
            { value: "all", label: "All sensors" },
            ...mockSensors.map((s) => ({ value: s.id, label: s.id })),
          ]}
          value="all"
          onChange={() => {}}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="bundle-date-from" className="block text-14 font-medium text-ink mb-1">
            From date
          </label>
          <input
            id="bundle-date-from"
            type="date"
            className="w-full px-3 py-2 text-14 bg-surface border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>
        <div>
          <label htmlFor="bundle-date-to" className="block text-14 font-medium text-ink mb-1">
            To date
          </label>
          <input
            id="bundle-date-to"
            type="date"
            className="w-full px-3 py-2 text-14 bg-surface border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>
      </div>
      <div>
        <Button variant="secondary" disabled>
          Prepare bundle for tribunal submission
        </Button>
        <p className="text-14 text-muted mt-2">
          Bundle preparation is disabled in this prototype. In production, this
          would generate a signed ZIP with readings, proofs, and a cover sheet.
        </p>
      </div>
    </div>
  );
}

function FederatedTab({
  nodes,
  loading,
}: {
  nodes: FederatedNode[];
  loading: boolean;
}) {
  const statusColors: Record<string, string> = {
    active: "bg-green-50 text-green-800 border-green-200",
    syncing: "bg-blue-50 text-blue-800 border-blue-200",
    inactive: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div>
      <div className="border border-border rounded-sm bg-amber-50 p-4 mb-6 text-14 text-amber-900 max-w-2xl">
        <strong>How federated learning works:</strong> Raw sensor readings
        never leave the edge node. Each participating city or industrial zone
        trains a local model update and sends only the model weights to the
        central server. The server aggregates the weights (using FedAvg) and
        broadcasts the improved global model. Individual readings remain private
        at the edge.
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="table-scroll-container border border-border rounded-sm">
          <table
            className="w-full text-14 border-collapse"
            aria-label="Federated learning nodes"
          >
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="px-4 py-3 text-left font-medium text-muted">Node</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Region</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Type</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Current round</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Last update</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => (
                <tr key={node.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-ink">{node.id}</td>
                  <td className="px-4 py-3 text-muted">{node.name}</td>
                  <td className="px-4 py-3 text-muted">{node.nodeType}</td>
                  <td className="px-4 py-3 font-mono text-right text-ink">
                    {node.currentRound}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {formatDatetime(node.lastUpdate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-14 font-medium border rounded-sm ${statusColors[node.status] ?? ""}`}
                    >
                      {node.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function IntegrityClient() {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [nodes, setNodes] = useState<FederatedNode[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [nodesLoading, setNodesLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [recResult, nodeResult] = await Promise.all([
        getLedgerRecords(),
        getFederatedNodes(),
      ]);
      setRecords(recResult.data);
      setNodes(nodeResult.data);
      setIsMock(recResult.isMock || nodeResult.isMock);
      setRecordsLoading(false);
      setNodesLoading(false);
    }
    load();
  }, []);

  const tabs = [
    { id: "ledger", label: "Ledger records" },
    { id: "verify", label: "Verify a record" },
    { id: "evidence", label: "Evidence bundle" },
    { id: "federated", label: "Federated learning" },
  ];

  return (
    <>
      {isMock && (
        <MockDataBanner>
          Sample data. Hashes and proofs shown are synthetic and not
          cryptographically valid.
        </MockDataBanner>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-28 font-semibold text-ink mb-2">
          Data integrity
        </h1>
        <p className="text-16 text-muted mb-2">
          Every sensor reading is hashed, verified with a zk-SNARK proof, and
          anchored on Polygon zkEVM. This makes the data auditable without
          requiring trust in any single organisation.
        </p>
        <div className="border border-border rounded-sm bg-paper p-4 mb-6 text-14 text-muted max-w-2xl">
          <strong className="text-ink">About zk-SNARK proofs:</strong> A
          zero-knowledge Succinct Non-interactive ARgument of Knowledge allows
          one party to prove to another that a statement is true without
          revealing any information beyond the validity of the statement. Here,
          the proof shows that the sensor reading hash is valid and was produced
          by an authorised device, without exposing raw calibration data.
        </div>

        <Tabs tabs={tabs} defaultTab="ledger">
          {(activeTab) => {
            if (activeTab === "ledger")
              return <LedgerTab records={records} loading={recordsLoading} />;
            if (activeTab === "verify") return <VerifyTab />;
            if (activeTab === "evidence") return <EvidenceTab />;
            if (activeTab === "federated")
              return <FederatedTab nodes={nodes} loading={nodesLoading} />;
            return null;
          }}
        </Tabs>
      </div>
    </>
  );
}
