"use client";

import { type ReactNode } from "react";

interface BannerProps {
  children: ReactNode;
}

export function MockDataBanner({ children }: BannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-amber-50 border-b border-amber-300 px-4 py-2 text-sm text-amber-900"
    >
      <span className="font-medium">Sample data.</span>{" "}
      {children ?? "This is a prototype and the values are not real measurements."}
    </div>
  );
}

interface NotEnabledBannerProps {
  feature?: string;
}

export function NotEnabledBanner({ feature }: NotEnabledBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-sm border border-border bg-surface p-4 text-sm text-muted"
    >
      <span className="font-medium text-ink">
        {feature ?? "This feature"} is not enabled in this prototype.
      </span>{" "}
      The endpoint exists and is documented, but returns 501 Not Implemented.
    </div>
  );
}
