import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import { buttonLinkClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Access Restricted",
  description: "Official credentials required to view this area.",
};

export default function UnauthorizedPage() {
  return (
    <div className="max-w-[560px] mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-amber-100 text-amber-800 mb-6">
        <ShieldAlert size={36} />
      </div>

      <h1 className="text-28 font-bold text-ink mb-3">
        Official Access Required
      </h1>

      <p className="text-16 text-muted mb-8 leading-relaxed">
        The page you requested is part of the municipal command center and is restricted to verified <strong>Official</strong> accounts.
      </p>

      <div className="bg-surface border border-border p-6 rounded-sm mb-8 text-left">
        <h2 className="text-16 font-semibold text-ink mb-2">
          What can you do?
        </h2>
        <ul className="text-14 text-muted space-y-2 list-disc list-inside">
          <li>If you are a citizen, explore public features and submit pollution reports from the <strong>Citizen Dashboard</strong>.</li>
          <li>If you are a municipal officer or ICCC operator, please <strong>log in with your official account</strong>.</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/dashboard/public"
          className={buttonLinkClasses("primary", "md")}
        >
          <ArrowLeft size={16} />
          Go to Citizen Dashboard
        </Link>
        <Link
          href="/login"
          className={buttonLinkClasses("secondary", "md")}
        >
          <LogIn size={16} />
          Log in with Official Account
        </Link>
        <Link
          href="/"
          className={buttonLinkClasses("ghost", "md")}
        >
          <Home size={16} />
          Home
        </Link>
      </div>
    </div>
  );
}
