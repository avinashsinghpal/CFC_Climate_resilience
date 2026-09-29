import type { Metadata } from "next";
import ReportClient from "./ReportClient";

export const metadata: Metadata = {
  title: "Report pollution",
  description:
    "Submit a geo-tagged citizen pollution report. Your location is blurred before storage to protect your privacy.",
};

export default function ReportPage() {
  return <ReportClient />;
}
