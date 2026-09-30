"use client";

import Link from "next/link";
import { User, PlusCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { buttonLinkClasses } from "@/components/ui/Button";

export default function PublicDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-surface border border-border p-8 rounded-sm shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-12 font-medium bg-blue-50 text-blue-900 border border-blue-200 rounded-sm mb-2">
              <User size={13} />
              Public User Account
            </span>
            <h1 className="text-28 font-bold text-ink">
              Welcome back, {user?.name || "Citizen"}
            </h1>
            <p className="text-14 text-muted mt-1">
              Signed in as {user?.email} &bull; Citizen Portal
            </p>
          </div>

          <Link
            href="/report"
            className={buttonLinkClasses("primary", "md")}
          >
            <PlusCircle size={16} />
            Report Pollution
          </Link>
        </div>

        <div className="mt-6 text-14 text-muted">
          <p className="mb-4">
            Your authenticated session is active with verified role: <strong className="text-ink">PUBLIC</strong>.
          </p>
          <div className="p-4 bg-paper border border-border rounded-sm">
            <h2 className="font-semibold text-ink text-14 mb-1">
              Citizen Reporting Access
            </h2>
            <p className="text-14 text-muted mb-3">
              You have access to report hyper-local pollution incidents, track submitted sightings, and access general air quality advisories. Official municipal controls (forecast ensemble, telemetry sensors, and automated ICCC ticket dispatch) are restricted to official municipal accounts.
            </p>
            <Link
              href="/report"
              className="inline-flex items-center text-14 font-medium text-primary hover:underline"
            >
              Go to Pollution Reporting Form <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
