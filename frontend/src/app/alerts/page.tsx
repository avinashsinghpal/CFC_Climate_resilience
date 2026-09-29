import type { Metadata } from "next";
import AlertsClient from "./AlertsClient";

export const metadata: Metadata = {
  title: "Alerts and tickets",
  description:
    "Live anomaly feed and Open311-compatible service tickets raised automatically when air quality thresholds are exceeded.",
};

export default function AlertsPage() {
  return <AlertsClient />;
}
