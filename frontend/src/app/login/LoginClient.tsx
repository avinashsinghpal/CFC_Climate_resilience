"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LogIn, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "OFFICIAL") {
        router.replace(redirectParam || "/dashboard/official");
      } else {
        // Public user
        const target = redirectParam && !redirectParam.includes("official") && !redirectParam.includes("alerts") && !redirectParam.includes("sensors") && !redirectParam.includes("forecast") && !redirectParam.includes("integrity")
          ? redirectParam
          : "/dashboard/public";
        router.replace(target);
      }
    }
  }, [authLoading, isAuthenticated, user, redirectParam, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Authentication failed. Please verify your credentials.");
      return;
    }

    // Role-based redirect
    if (result.role === "OFFICIAL") {
      router.push(redirectParam || "/dashboard/official");
    } else {
      const target = redirectParam && !redirectParam.includes("official") && !redirectParam.includes("alerts") && !redirectParam.includes("sensors") && !redirectParam.includes("forecast") && !redirectParam.includes("integrity")
        ? redirectParam
        : "/dashboard/public";
      router.push(target);
    }
  };

  return (
    <div className="max-w-[460px] mx-auto px-4 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-primary/10 text-primary mb-4">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-28 font-bold text-ink mb-2">
          Sign In
        </h1>
        <p className="text-14 text-muted">
          Access your citizen dashboard or municipal control center.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-sm shadow-sm">
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm text-14 flex items-start gap-3"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-semibold">Sign in failed</p>
              <p className="text-14">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            id="login-email"
            label="Email address"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="citizen@example.com or officer@city.gov.in"
          />

          <Input
            id="login-password"
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn size={18} />
                Sign in
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-14 text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-focus transition-colors"
            >
              Register here &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
