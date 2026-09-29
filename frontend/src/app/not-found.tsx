import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested could not be found.",
};

export default function NotFound() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-lg">
        <h1 className="text-40 font-semibold text-ink mb-4">
          Page not found
        </h1>
        <p className="text-16 text-muted mb-8">
          The page you requested does not exist or has moved. Please check the
          URL or use one of the links below.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-16 font-medium rounded-sm bg-primary text-white border border-primary hover:bg-primary-hover transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Return to home
          </Link>
          <Link
            href="/forecast"
            className="inline-flex items-center gap-2 px-6 py-3 text-16 font-medium rounded-sm bg-surface text-primary border border-primary hover:bg-paper transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            View forecast
          </Link>
        </div>
      </div>
    </div>
  );
}
