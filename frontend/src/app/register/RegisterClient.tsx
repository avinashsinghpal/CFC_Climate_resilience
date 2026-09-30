"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCheck, ShieldAlert, UserPlus, AlertCircle, Building2, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

export default function RegisterClient() {
  const router = useRouter();
  const { register, user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [role, setRole] = useState<UserRole>("PUBLIC");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "OFFICIAL") {
        router.replace("/dashboard/official");
      } else {
        router.replace("/dashboard/public");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Registration failed. Please try again.");
      return;
    }

    // Redirect to the appropriate dashboard
    if (result.role === "OFFICIAL") {
      router.push("/dashboard/official");
    } else {
      router.push("/dashboard/public");
    }
  };

  return (
    <div className="max-w-[520px] mx-auto px-4 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-primary/10 text-primary mb-4">
          <UserPlus size={28} />
        </div>
        <h1 className="text-28 font-bold text-ink mb-2">
          Create an Account
        </h1>
        <p className="text-14 text-muted">
          Join the Federated Climate Action Platform to monitor and act on local air quality.
        </p>
      </div>

      {/* Registration Card */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-sm shadow-sm">
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm text-14 flex items-start gap-3"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-semibold">Registration failed</p>
              <p className="text-14">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Role Selection */}
          <div>
            <label className="block text-14 font-medium text-ink mb-2">
              Register as <span className="text-red-700">*</span>
            </label>
            <div
              role="radiogroup"
              aria-label="Register as"
              className="grid grid-cols-2 gap-3"
            >
              {/* Public User */}
              <button
                type="button"
                role="radio"
                aria-checked={role === "PUBLIC"}
                onClick={() => setRole("PUBLIC")}
                className={[
                  "p-4 rounded-sm border text-left transition-all duration-[120ms]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  role === "PUBLIC"
                    ? "border-primary bg-primary/5 text-ink ring-1 ring-primary"
                    : "border-border bg-surface text-muted hover:border-ink/40 hover:bg-paper",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <User
                    size={18}
                    className={role === "PUBLIC" ? "text-primary" : "text-muted"}
                  />
                  <span className="font-semibold text-14 text-ink">
                    Public User
                  </span>
                </div>
                <p className="text-12 text-muted leading-tight">
                  Citizen reporting & hyper-local incident tracking
                </p>
              </button>

              {/* Official User */}
              <button
                type="button"
                role="radio"
                aria-checked={role === "OFFICIAL"}
                onClick={() => setRole("OFFICIAL")}
                className={[
                  "p-4 rounded-sm border text-left transition-all duration-[120ms]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  role === "OFFICIAL"
                    ? "border-primary bg-primary/5 text-ink ring-1 ring-primary"
                    : "border-border bg-surface text-muted hover:border-ink/40 hover:bg-paper",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2
                    size={18}
                    className={role === "OFFICIAL" ? "text-primary" : "text-muted"}
                  />
                  <span className="font-semibold text-14 text-ink">
                    Official
                  </span>
                </div>
                <p className="text-12 text-muted leading-tight">
                  Municipal authority, ICCC operator & sensor fleet
                </p>
              </button>
            </div>
          </div>

          <Input
            id="register-name"
            label="Full name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />

          <Input
            id="register-email"
            label="Email address"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              role === "OFFICIAL"
                ? "officer@city.gov.in"
                : "jane.doe@example.com"
            }
          />

          <Input
            id="register-password"
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            hint="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Input
            id="register-confirm-password"
            label="Confirm password"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserCheck size={18} />
                Register as {role === "OFFICIAL" ? "Official" : "Public User"}
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-14 text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-focus transition-colors"
            >
              Sign in here &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
