import type { Metadata } from "next";
import IntegrityClient from "./IntegrityClient";

export const metadata: Metadata = {
  title: "Data integrity",
  description:
    "View the data integrity ledger with sensor reading hashes, zk-SNARK proof status, and federated learning node status.",
};

export default function IntegrityPage() {
  return <IntegrityClient />;
}
