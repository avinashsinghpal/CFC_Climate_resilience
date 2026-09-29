import type { Metadata } from "next";
import Link from "next/link";
import { Antenna, BarChart3, ShieldCheck, Ticket } from "lucide-react";
import { buttonLinkClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Hyper-local air quality readings, 72 to 96 hour forecasts, and automatic service tickets for Indian municipalities.",
};

const features = [
  {
    icon: Antenna,
    title: "Smart sensors and citizen reporting",
    description:
      "Low-cost Sensirion SPS30 particulate sensors deployed over LoRaWAN and NB-IoT networks provide continuous PM2.5 and PM10 readings. Citizens can submit geo-tagged pollution sightings through a web form.",
    href: "/sensors",
    linkLabel: "View sensors",
  },
  {
    icon: BarChart3,
    title: "72 to 96 hour air quality forecast",
    description:
      "A three-model ensemble (Swin Transformer v2, ST-GCN, AirDDE) combines sensor data, traffic patterns, and Sentinel-5P satellite imagery to produce a forecast with a confidence range.",
    href: "/forecast",
    linkLabel: "View forecast",
  },
  {
    icon: ShieldCheck,
    title: "Data integrity and federated learning",
    description:
      "Every sensor reading is hashed, verified with zk-SNARK proofs, and anchored on Polygon zkEVM. Model training is federated: raw readings stay at the edge and only model weights are shared.",
    href: "/integrity",
    linkLabel: "View integrity ledger",
  },
  {
    icon: Ticket,
    title: "Automatic service tickets",
    description:
      "When thresholds are breached, the platform raises Open311-compatible service tickets and routes them to the appropriate Integrated Command and Control Centre (ICCC) without manual intervention.",
    href: "/alerts",
    linkLabel: "View alerts and tickets",
  },
];

const prdFacts = [
  {
    figure: "62%",
    context:
      "of the Indian population lives outside a 50 km radius of any Continuous Ambient Air Quality Monitoring Station (CAAQMS).",
  },
  {
    figure: "~Rs 1.5 Crore",
    context:
      "is the approximate capital cost of a single regulatory-grade monitoring site, making wide-scale deployment cost-prohibitive.",
  },
  {
    figure: "72 to 96 hours",
    context:
      "is the forecast horizon the platform targets, giving municipal officers enough lead time to pre-position resources.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Premium Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="relative bg-[#0F291E] text-white overflow-hidden"
      >
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djIwaC0ydi0yMEgxdjJoMzV2MjBoMnYtMjBoMjB2LTJoLTIwVjFIMzZ2MjBIMXYyaDM1eiIvPjwvZz48L2c+PC9zdmc+')] pointer-events-none" />
        <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[100%] bg-white/5 blur-3xl rounded-full mix-blend-overlay pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-8"
            >
              Hyper-local readings, <br className="hidden md:block" />
              <span className="text-emerald-300">96-hour forecasts,</span> and
              <br className="hidden md:block" /> automatic tickets.
            </h1>
            <p className="text-lg md:text-xl mb-10 text-emerald-50/80 max-w-2xl font-light leading-relaxed">
              A prototype platform for Indian municipalities combining low-cost sensors, citizen
              reports, and satellite data to provide actionable intelligence before pollution peaks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/forecast"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-sm bg-white text-[#0F291E] hover:bg-emerald-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F291E]"
              >
                View forecast
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-sm bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F291E]"
              >
                Report pollution
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Hover Effects */}
      <section
        aria-labelledby="features-heading"
        className="bg-paper"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl mb-16">
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold text-ink mb-4 tracking-tight"
            >
              Integrated capabilities
            </h2>
            <p className="text-lg text-muted">
              Four specialized modules designed for municipal air quality management, working together seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative bg-surface p-8 sm:p-10 rounded-sm shadow-sm hover:shadow-xl border border-border/60 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
                     <Icon size={120} strokeWidth={1} />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={28} strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-bold text-ink mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-base text-muted leading-relaxed mb-8 flex-grow">
                      {feature.description}
                    </p>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center text-sm font-semibold text-primary hover:text-focus transition-colors duration-200 mt-auto"
                    >
                      {feature.linkLabel} <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Background / PRD facts with Dark Glassmorphism */}
      <section
        aria-labelledby="background-heading"
        className="bg-[#0A1A14] text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <h2
              id="background-heading"
              className="text-3xl font-bold mb-4 tracking-tight"
            >
              The challenge
            </h2>
            <p className="text-lg text-emerald-100/70 max-w-2xl">
              The following figures are from the product requirements document. They explain why the platform exists, not as performance claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {prdFacts.map((fact, index) => (
              <div
                key={fact.figure}
                className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-sm hover:bg-white/10 transition-colors duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-4xl md:text-5xl font-bold font-mono text-emerald-400 mb-6">
                  {fact.figure}
                </p>
                <p className="text-base text-emerald-50/80 leading-relaxed mb-6">
                  {fact.context}
                </p>
                <p className="text-sm text-emerald-50/40 italic">
                  From the product requirements.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data flow diagram */}
      <section
        aria-labelledby="dataflow-heading"
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2
          id="dataflow-heading"
          className="text-28 font-semibold text-ink mb-2"
        >
          How data flows
        </h2>
        <p className="text-16 text-muted mb-8">
          A high-level overview of how sensor readings move from the field to
          action. The integrity ledger records every step in parallel.
        </p>

        <div className="overflow-x-auto border border-border rounded-sm bg-surface p-6">
          <svg
            viewBox="0 0 860 300"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Data flow diagram showing sensors, citizen reports, and Sentinel-5P satellite feeding into edge processing, then forecast model, then alerts and tickets. A parallel integrity ledger records each stage."
            className="max-w-full"
            style={{ minWidth: "540px" }}
          >
            <defs>
              <marker
                id="arr"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill="#D9D5CB" />
              </marker>
            </defs>

            {/* Sources */}
            <rect x="10" y="15" width="130" height="44" rx="2" fill="#F6F4EF" stroke="#D9D5CB" strokeWidth="1" />
            <text x="75" y="33" textAnchor="middle" fontSize="12" fill="#16201C" fontFamily="inherit" fontWeight="500">Low-cost sensors</text>
            <text x="75" y="50" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">SPS30, LoRaWAN/NB-IoT</text>

            <rect x="10" y="85" width="130" height="44" rx="2" fill="#F6F4EF" stroke="#D9D5CB" strokeWidth="1" />
            <text x="75" y="103" textAnchor="middle" fontSize="12" fill="#16201C" fontFamily="inherit" fontWeight="500">Citizen reports</text>
            <text x="75" y="120" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">Web form, geo-tagged</text>

            <rect x="10" y="155" width="130" height="44" rx="2" fill="#F6F4EF" stroke="#D9D5CB" strokeWidth="1" />
            <text x="75" y="173" textAnchor="middle" fontSize="12" fill="#16201C" fontFamily="inherit" fontWeight="500">Sentinel-5P</text>
            <text x="75" y="190" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">TROPOMI satellite</text>

            {/* Lines to edge */}
            <line x1="140" y1="37" x2="218" y2="107" stroke="#D9D5CB" strokeWidth="1.5" markerEnd="url(#arr)" />
            <line x1="140" y1="107" x2="218" y2="107" stroke="#D9D5CB" strokeWidth="1.5" markerEnd="url(#arr)" />
            <line x1="140" y1="177" x2="218" y2="117" stroke="#D9D5CB" strokeWidth="1.5" markerEnd="url(#arr)" />

            {/* Edge processing */}
            <rect x="220" y="80" width="140" height="60" rx="2" fill="#EDF5F0" stroke="#1F4D3A" strokeWidth="1.5" />
            <text x="290" y="103" textAnchor="middle" fontSize="12" fill="#16201C" fontFamily="inherit" fontWeight="600">Edge processing</text>
            <text x="290" y="120" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">Normalise, hash,</text>
            <text x="290" y="134" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">filter outliers</text>

            <line x1="360" y1="110" x2="438" y2="110" stroke="#D9D5CB" strokeWidth="1.5" markerEnd="url(#arr)" />

            {/* Forecast */}
            <rect x="440" y="80" width="140" height="60" rx="2" fill="#EDF5F0" stroke="#1F4D3A" strokeWidth="1.5" />
            <text x="510" y="103" textAnchor="middle" fontSize="12" fill="#16201C" fontFamily="inherit" fontWeight="600">Forecast model</text>
            <text x="510" y="120" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">Swin-T v2, ST-GCN,</text>
            <text x="510" y="134" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">AirDDE ensemble</text>

            <line x1="580" y1="110" x2="658" y2="110" stroke="#D9D5CB" strokeWidth="1.5" markerEnd="url(#arr)" />

            {/* Alerts */}
            <rect x="660" y="80" width="140" height="60" rx="2" fill="#EDF5F0" stroke="#1F4D3A" strokeWidth="1.5" />
            <text x="730" y="103" textAnchor="middle" fontSize="12" fill="#16201C" fontFamily="inherit" fontWeight="600">Alerts and tickets</text>
            <text x="730" y="120" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">Open311 tickets,</text>
            <text x="730" y="134" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">ICCC routing</text>

            {/* Integrity ledger */}
            <rect x="220" y="215" width="580" height="52" rx="2" fill="#F6F4EF" stroke="#D9D5CB" strokeWidth="1" strokeDasharray="5,3" />
            <text x="510" y="237" textAnchor="middle" fontSize="12" fill="#16201C" fontFamily="inherit" fontWeight="600">Integrity ledger (parallel to every stage)</text>
            <text x="510" y="253" textAnchor="middle" fontSize="11" fill="#55605A" fontFamily="inherit">zk-SNARK proofs anchored on Polygon zkEVM. Federated model training: weights only, no raw data.</text>

            {/* Dashed lines to ledger */}
            <line x1="290" y1="140" x2="290" y2="215" stroke="#D9D5CB" strokeWidth="1" strokeDasharray="4,3" />
            <line x1="510" y1="140" x2="510" y2="215" stroke="#D9D5CB" strokeWidth="1" strokeDasharray="4,3" />
            <line x1="730" y1="140" x2="730" y2="215" stroke="#D9D5CB" strokeWidth="1" strokeDasharray="4,3" />
          </svg>
        </div>
      </section>
    </>
  );
}
