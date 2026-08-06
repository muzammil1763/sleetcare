"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const validateRes = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const validateData = await validateRes.json();
      if (!validateRes.ok || !validateData.success) {
        setError(validateData.error || "Invalid credentials or insufficient access.");
        setLoading(false);
        return;
      }
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        setError("Authentication failed. Please try again.");
        setLoading(false);
        return;
      }
      const redirectUrl = callbackUrl.startsWith("http")
        ? new URL(callbackUrl).pathname
        : callbackUrl;
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "var(--font-body), Jost, system-ui, sans-serif" }}
    >
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center p-16 overflow-hidden bg-[#2E2820]">
        {/* Grid texture */}
        <div className="absolute inset-0 grid-bg opacity-20" />
        {/* Warm glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#B8897A]/10 blur-[120px]" />

        {/* Corner marks */}
        {[
          "top-8 left-8",
          "top-8 right-8",
          "bottom-8 left-8",
          "bottom-8 right-8",
        ].map((pos) => (
          <div key={pos} className={`absolute ${pos} flex flex-col gap-1 opacity-30 ${pos.includes("right") ? "items-end" : ""}`}>
            <div className={`h-px bg-[#C4B5A5] ${pos.includes("bottom") ? "w-4" : "w-8"}`} />
            <div className={`h-px bg-[#C4B5A5] ${pos.includes("bottom") ? "w-8" : "w-4"}`} />
          </div>
        ))}

        <div className="relative z-10 text-center max-w-sm">
          {/* Brand mark */}
          <div className="flex items-end justify-center gap-1.5 mb-8">
            <div className="w-0.5 h-10 bg-[#B8897A]" />
            <div className="w-0.5 h-14 bg-[#C4B5A5]" />
            <div className="w-0.5 h-7 bg-[#B8897A]/60" />
          </div>

          <h1
            className="text-[#F8F5F0] tracking-[0.35em] uppercase mb-2"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "32px",
              fontWeight: 400,
            }}
          >
            MAJESTIC
          </h1>
          <p className="text-[#C4B5A5] tracking-[0.5em] uppercase text-[10px] mb-8">
            WOMEN
          </p>

          <div className="w-12 h-px bg-[#C4B5A5]/40 mx-auto mb-8" />

          <p className="text-[#C4B5A5]/70 text-sm leading-relaxed mb-12">
            Manage your collections, orders, customers and store settings from a single secure dashboard.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { value: "12+",  label: "Suits" },
              { value: "6",    label: "Collections" },
              { value: "100%", label: "Premium" },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-[#C4B5A5]/15 bg-[#C4B5A5]/5 p-4"
              >
                <div
                  className="text-xl text-[#F8F5F0] mb-1"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  {s.value}
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-[#C4B5A5]/50">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C4B5A5]/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8897A] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B8897A]" />
            </span>
            <span className="text-[9px] text-[#C4B5A5]/60 uppercase tracking-[0.2em]">
              System operational
            </span>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8F5F0] relative">
        <Link
          href="/"
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#7A6E64] hover:text-[#2E2820] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to site
        </Link>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex items-end gap-1">
              <div className="w-0.5 h-6 bg-[#B8897A]" />
              <div className="w-0.5 h-8 bg-[#C4B5A5]" />
            </div>
            <div>
              <div
                className="tracking-[0.25em] uppercase text-[#2E2820]"
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontSize: "18px",
                }}
              >
                MAJESTIC
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#7A6E64]">
                Admin Console
              </div>
            </div>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B8897A] mb-3">
              Admin Access
            </p>
            <h2
              className="text-[#2E2820] leading-tight mb-2"
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: "36px",
                fontWeight: 400,
              }}
            >
              Sign In
            </h2>
            <p className="text-sm font-light text-[#7A6E64]">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#7A6E64] mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5A5]" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@majestic.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10 border-[#E8E0D5] rounded-none focus:border-[#2E2820] bg-white text-[#2E2820] placeholder:text-[#C4B5A5] text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#7A6E64] mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5A5]" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-10 pr-10 border-[#E8E0D5] rounded-none focus:border-[#2E2820] bg-white text-[#2E2820] text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4B5A5] hover:text-[#7A6E64] transition"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2E2820] text-[#F8F5F0] text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#4A4038] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign in to Admin"
              )}
            </button>
          </form>

          {/* Credentials hint */}
          <div className="mt-8 p-5 border border-[#E8E0D5] bg-white">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#C4B5A5] mb-3">
              Default Credentials
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-light text-[#7A6E64]">Email</span>
                <span className="text-[11px] font-medium text-[#2E2820]">
                  admin@majestic.com
                </span>
              </div>
              <div className="w-full h-px bg-[#E8E0D5]" />
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-light text-[#7A6E64]">Password</span>
                <span className="text-[11px] font-medium text-[#2E2820]">admin123</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] font-light text-[#C4B5A5]">
            Unauthorized access is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2E2820]">
          <Loader2 className="w-6 h-6 animate-spin text-[#C4B5A5]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
