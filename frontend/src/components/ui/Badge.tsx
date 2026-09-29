import { type AqiCategory } from "@/types";
import { getAqiBand } from "@/lib/aqi";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "aqi" | "status" | "severity";
  aqiCategory?: AqiCategory;
  className?: string;
}

const statusColors: Record<string, string> = {
  online: "bg-green-50 text-green-800 border-green-200",
  delayed: "bg-amber-50 text-amber-800 border-amber-200",
  offline: "bg-red-50 text-red-800 border-red-200",
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  acknowledged: "bg-blue-50 text-blue-800 border-blue-200",
  resolved: "bg-green-50 text-green-800 border-green-200",
  open: "bg-amber-50 text-amber-800 border-amber-200",
  assigned: "bg-blue-50 text-blue-800 border-blue-200",
  in_progress: "bg-sky-50 text-sky-800 border-sky-200",
  closed: "bg-gray-50 text-gray-700 border-gray-200",
  Verified: "bg-green-50 text-green-800 border-green-200",
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Failed: "bg-red-50 text-red-800 border-red-200",
  active: "bg-green-50 text-green-800 border-green-200",
  syncing: "bg-blue-50 text-blue-800 border-blue-200",
  inactive: "bg-gray-50 text-gray-700 border-gray-200",
  low: "bg-amber-50 text-amber-800 border-amber-200",
  medium: "bg-orange-50 text-orange-800 border-orange-200",
  high: "bg-red-50 text-red-800 border-red-200",
  critical: "bg-red-100 text-red-900 border-red-300",
};

export function Badge({
  children,
  variant = "default",
  aqiCategory,
  className = "",
}: BadgeProps) {
  let colorClass = "bg-paper text-muted border-border";

  if (variant === "aqi" && aqiCategory) {
    const band = getAqiBand(0);
    void band;
    const map: Record<AqiCategory, string> = {
      Good: "bg-green-50 text-green-800 border-green-200",
      Satisfactory: "bg-lime-50 text-lime-800 border-lime-200",
      Moderate: "bg-amber-50 text-amber-800 border-amber-200",
      Poor: "bg-orange-50 text-orange-800 border-orange-200",
      "Very Poor": "bg-red-50 text-red-800 border-red-200",
      Severe: "bg-red-100 text-red-900 border-red-300",
    };
    colorClass = map[aqiCategory];
  } else if (variant === "status" || variant === "severity") {
    const key = String(children).toLowerCase().replace(/\s+/g, "_");
    colorClass = statusColors[key] ?? statusColors[String(children)] ?? colorClass;
  }

  return (
    <span
      className={[
        "inline-block px-2 py-0.5 text-14 font-medium border rounded-sm",
        colorClass,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

// AQI badge shorthand
export function AqiBadge({ category }: { category: AqiCategory }) {
  return (
    <Badge variant="aqi" aqiCategory={category}>
      {category}
    </Badge>
  );
}
