"use client";

import Link from "next/link";
import { Shield, BarChart3, Antenna, Ticket, Database } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { buttonLinkClasses } from "@/components/ui/Button";

export default function OfficialDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-surface border border-border p-8 rounded-sm shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-12 font-medium bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-sm mb-2">
              <Shield size={13} />
              Verified Official Account
            </span>
            <h1 className="text-28 font-bold text-ink">
              Command Center: {user?.name || "Officer"}
            </h1>
            <p className="text-14 text-muted mt-1">
              Signed in as {user?.email} &bull; Municipal Operations
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-14 text-muted mb-6">
            Your authenticated session is active with verified role: <strong className="text-ink">OFFICIAL</strong>. You have full access to municipal platform modules:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/forecast"
              className="p-5 border border-border rounded-sm hover:border-primary/40 hover:bg-paper transition-all group"
            >
              <div className="inline-flex p-2.5 rounded-sm bg-primary/10 text-primary mb-3 group-hover:scale-105 transition-transform">
                <BarChart3 size={20} />
              </div>
              <h3 className="font-semibold text-16 text-ink mb-1">Forecast Ensemble</h3>
              <p className="text-12 text-muted">72-96 hour AI forecasts and satellite downscaling</p>
            </Link>

            <Link
              href="/sensors"
              className="p-5 border border-border rounded-sm hover:border-primary/40 hover:bg-paper transition-all group"
            >
              <div className="inline-flex p-2.5 rounded-sm bg-primary/10 text-primary mb-3 group-hover:scale-105 transition-transform">
                <Antenna size={20} />
              </div>
              <h3 className="font-semibold text-16 text-ink mb-1">Sensor Fleet</h3>
              <p className="text-12 text-muted">Real-time SPS30 telemetry across LoRaWAN & NB-IoT</p>
            </Link>

            <Link
              href="/alerts"
              className="p-5 border border-border rounded-sm hover:border-primary/40 hover:bg-paper transition-all group"
            >
              <div className="inline-flex p-2.5 rounded-sm bg-primary/10 text-primary mb-3 group-hover:scale-105 transition-transform">
                <Ticket size={20} />
              </div>
              <h3 className="font-semibold text-16 text-ink mb-1">Alerts & Tickets</h3>
              <p className="text-12 text-muted">Automated Open311 tickets and ICCC routing</p>
            </Link>

            <Link
              href="/integrity"
              className="p-5 border border-border rounded-sm hover:border-primary/40 hover:bg-paper transition-all group"
            >
              <div className="inline-flex p-2.5 rounded-sm bg-primary/10 text-primary mb-3 group-hover:scale-105 transition-transform">
                <Database size={20} />
              </div>
              <h3 className="font-semibold text-16 text-ink mb-1">Integrity Ledger</h3>
              <p className="text-12 text-muted">zk-SNARK proof verification and federated nodes</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
