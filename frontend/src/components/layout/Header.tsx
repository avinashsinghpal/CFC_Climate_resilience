"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/forecast", label: "Forecast" },
  { href: "/sensors", label: "Sensors" },
  { href: "/report", label: "Report pollution" },
  { href: "/alerts", label: "Alerts" },
  { href: "/integrity", label: "Data integrity" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-surface/85 backdrop-blur-md border-b border-border/50 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Wordmark */}
          <Link
            href="/"
            className="text-16 font-semibold text-ink hover:text-primary transition-colors duration-[120ms] shrink-0"
            aria-label="Federated Climate Action Platform, home"
          >
            Federated Climate Action Platform
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={[
                  "relative px-4 py-2 text-14 font-medium rounded-sm transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  pathname === link.href
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted hover:text-ink hover:bg-paper/80",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="md:hidden border-t border-border py-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={[
                  "block px-4 py-3 text-16 font-medium transition-colors duration-[120ms]",
                  pathname === link.href
                    ? "text-primary bg-green-50"
                    : "text-muted hover:text-ink hover:bg-paper",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
