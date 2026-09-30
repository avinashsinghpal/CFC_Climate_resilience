import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account on the Federated Climate Action Platform.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[520px] mx-auto px-4 py-20 text-center text-muted">
          Loading registration portal...
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
