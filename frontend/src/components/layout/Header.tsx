"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogIn, UserPlus, LogOut, Shield, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isAuthenticated, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Compute navigation links based on user role
  let navLinks: { href: string; label: string }[] = [];

  if (role === "OFFICIAL") {
    navLinks = [
      { href: "/dashboard/official", label: "Dashboard" },
      { href: "/forecast", label: "Forecast" },
      { href: "/sensors", label: "Sensors" },
      { href: "/alerts", label: "Alerts" },
      { href: "/report", label: "Reports" },
      { href: "/integrity", label: "Data integrity" },
    ];
  } else if (role === "PUBLIC") {
    navLinks = [
      { href: "/dashboard/public", label: "Dashboard" },
      { href: "/report", label: "Report pollution" },
    ];
  } else {
    // Unauthenticated / Landing page: strictly empty, only Sign in and Register shown
    navLinks = [];
  }


  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-border/60 sticky top-0 z-40 transition-all duration-300">
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
                  "relative px-3 py-1.5 text-14 font-medium rounded-sm transition-all duration-200",
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

          {/* Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3">
                    {/* Role badge */}
                    <span
                      className={[
                        "inline-flex items-center gap-1 px-2 py-0.5 text-12 font-medium rounded-sm border",
                        role === "OFFICIAL"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-blue-50 text-blue-900 border-blue-200",
                      ].join(" ")}
                    >
                      {role === "OFFICIAL" ? (
                        <Shield size={12} className="text-emerald-700" />
                      ) : (
                        <User size={12} className="text-blue-700" />
                      )}
                      {role === "OFFICIAL" ? "Official" : "Citizen"}
                    </span>

                    {/* User name */}
                    <span className="text-14 font-medium text-ink max-w-[120px] truncate" title={user.name}>
                      {user.name}
                    </span>

                    {/* Logout button */}
                    <button
                      onClick={handleLogout}
                      className="p-1.5 text-muted hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                      title="Log out"
                      aria-label="Log out"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-14 font-medium text-ink hover:text-primary rounded-sm transition-colors"
                    >
                      <LogIn size={15} />
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-14 font-medium bg-primary text-white hover:bg-primary-hover rounded-sm transition-colors"
                    >
                      <UserPlus size={15} />
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

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
            className="md:hidden border-t border-border py-3 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={[
                  "block px-4 py-2.5 text-16 font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted hover:text-ink hover:bg-paper",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth actions */}
            <div className="pt-3 mt-3 border-t border-border px-4">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "inline-flex items-center gap-1 px-2 py-0.5 text-12 font-medium rounded-sm border",
                        role === "OFFICIAL"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-blue-50 text-blue-900 border-blue-200",
                      ].join(" ")}
                    >
                      {role === "OFFICIAL" ? "Official" : "Citizen"}
                    </span>
                    <span className="text-14 font-medium text-ink truncate">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="inline-flex items-center gap-1 text-14 text-red-700 hover:underline"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 py-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 text-14 font-medium border border-border rounded-sm hover:bg-paper"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 text-14 font-medium bg-primary text-white rounded-sm hover:bg-primary-hover"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

