/**
 * Formatting utilities for dates, numbers and IDs.
 */

/**
 * Format a date-time string in IST.
 */
export function formatDatetime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Format a date only in IST.
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Relative time string (e.g. "3 minutes ago").
 */
export function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
  return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
}

/**
 * Format a number with up to N decimal places, without trailing zeros.
 */
export function formatNum(value: number, decimals: number = 1): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Truncate a hash to the first N and last M characters.
 */
export function truncateHash(hash: string, prefix: number = 8, suffix: number = 6): string {
  if (hash.length <= prefix + suffix + 3) return hash;
  return `${hash.slice(0, prefix)}...${hash.slice(-suffix)}`;
}

/**
 * Format pollution type label.
 */
export function pollutionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    open_waste_burning: "Open waste burning",
    crop_burning: "Crop burning",
    construction_dust: "Construction dust",
    industrial_emission: "Industrial emission",
    vehicle_smoke: "Vehicle smoke",
    other: "Other",
  };
  return labels[type] ?? type;
}

/**
 * Format ticket status label.
 */
export function ticketStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: "Open",
    assigned: "Assigned",
    in_progress: "In progress",
    closed: "Closed",
  };
  return labels[status] ?? status;
}

/**
 * Format alert severity label.
 */
export function severityLabel(severity: string): string {
  const labels: Record<string, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };
  return labels[severity] ?? severity;
}
