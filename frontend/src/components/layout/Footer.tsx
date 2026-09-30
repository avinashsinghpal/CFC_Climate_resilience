import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-16 font-semibold text-ink mb-2">
              Federated Climate Action Platform
            </p>
            <p className="text-14 text-muted">
              A prototype for hyper-local air quality monitoring and automated
              response in Indian municipalities.
            </p>
            <p className="text-14 text-muted mt-2 font-medium">
              Prototype. Not for operational use.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-14 font-semibold text-ink mb-3 uppercase tracking-wide">
              Pages
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/login", label: "Sign In" },
                  { href: "/register", label: "Register" },
                  { href: "/terms", label: "Terms & Methodology" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-14 text-muted hover:text-ink transition-colors duration-[120ms]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-14 font-semibold text-ink mb-3 uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-14 text-muted hover:text-ink transition-colors duration-[120ms]"
                >
                  Terms and Conditions
                </Link>
              </li>
            </ul>
            <p className="text-14 text-muted mt-6">
              Map data: OpenStreetMap contributors.
            </p>
            <p className="text-14 text-muted">
              Satellite data: Sentinel-5P TROPOMI (ESA/Copernicus).
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-14 text-muted">
            Prototype status: All backend endpoints return 501 Not Implemented.
            No real sensor readings, forecasts or integrity records are shown.
          </p>
        </div>
      </div>
    </footer>
  );
}
