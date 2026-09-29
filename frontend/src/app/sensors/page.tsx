import type { Metadata } from "next";
import SensorsClient from "./SensorsClient";

export const metadata: Metadata = {
  title: "Sensors",
  description:
    "View all low-cost air quality sensors on a map and table. Filter by protocol, status and city. Click a sensor for details and 24-hour history.",
};

export default function SensorsPage() {
  return <SensorsClient />;
}
