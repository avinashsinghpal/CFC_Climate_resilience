import type { Metadata } from "next";
import ForecastClient from "./ForecastClient";

export const metadata: Metadata = {
  title: "Forecast",
  description:
    "72 to 96 hour air quality forecast for Indian cities, with confidence range, satellite layer, and suggested municipal actions.",
};

export default function ForecastPage() {
  return <ForecastClient />;
}
