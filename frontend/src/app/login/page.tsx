import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the Federated Climate Action Platform.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[440px] mx-auto px-4 py-20 text-center text-muted">
          Loading login portal...
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
