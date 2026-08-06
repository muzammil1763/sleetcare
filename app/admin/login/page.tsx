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
    setError(""); setLoading(true);
    try {
      const vRes = await fetch("/api/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const vData = await vRes.json();
      if (!vRes.ok || !vData.success) { setError(vData.error || "Invalid credentials."); setLoading(false); return; }
      const res = await signIn("credentials", { ...form, redirect: false });
      if (res?.error) { setError("Authentication failed. Please try again."); setLoading(false); return; }
      const url = callbackUrl.startsWith("http") ? new URL(callbackUrl).pathname : callbackUrl;
      router.push(url); router.refresh();
    } catch { setError("Something went wrong."); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-body), Jost, system-ui, sans-serif" }}>

      {/* ── Left panel — navy brand ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center p-16 overflow-hidden bg-[#1e2a5e]">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(200,208,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,208,240,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[160px]"
          style={{ background: "radial-gradient(circle, #8fa0d8, transparent)" }} />
        {/* Corner marks */}
        {["top-8 left-8","top-8 right-8","bottom-8 left-8","bottom-8 right-8"].map(pos => (
          <div key={pos} className={`absolute ${pos} opacity-20`}>
            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-px bg-[#8fa0d8]" />
              <div className="w-4 h-px bg-[#8fa0d8]" />
            </div>
          </div>
        ))}

        <div className="relative z-10 text-center max-w-sm">
          {/* Logo */}
          <img src="/logo.png" alt="Sleet Care" className="h-20 w-auto mx-auto mb-8" />

          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="flex-1 h-px bg-[#8fa0d8]/30" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#8fa0d8]/60">Admin Console</span>
            <div className="flex-1 h-px bg-[#8fa0d8]/30" />
          </div>

          <p className="text-[#c8d0f0]/70 text-sm leading-relaxed mb-12">
            Manage your products, orders, customers and store settings from a single secure dashboard.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { value: "50+",  label: "Products" },
              { value: "10K+", label: "Customers" },
              { value: "100%", label: "Natural" },
            ].map(s => (
              <div key={s.label} className="border border-[#8fa0d8]/20 bg-[#8fa0d8]/5 p-4">
                <div className="text-xl text-white mb-1" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>{s.value}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-[#8fa0d8]/50">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#8fa0d8]/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8fa0d8] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8fa0d8]" />
            </span>
            <span className="text-[9px] text-[#8fa0d8]/60 uppercase tracking-[0.2em]">System operational</span>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f7f8fc] relative">
        <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#5a6380] hover:text-[#1e2a5e] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to site
        </Link>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <img src="/logo.png" alt="Sleet Care" className="h-14 w-auto mx-auto mb-3" />
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#8fa0d8]">Admin Console</p>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-3">Admin Access</p>
            <h2 className="text-[#1e2a5e] leading-tight mb-2" style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "36px", fontWeight: 400 }}>
              Sign In
            </h2>
            <p className="text-sm font-light text-[#5a6380]">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa0d8]" />
                <Input type="email" required autoComplete="email" placeholder="admin@sleetcare.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="pl-10 border-[#dde2f0] rounded-none focus:border-[#1e2a5e] bg-white text-[#1e2a5e] placeholder:text-[#8fa0d8] text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa0d8]" />
                <Input type={showPw ? "text" : "password"} required autoComplete="current-password" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="pl-10 pr-10 border-[#dde2f0] rounded-none focus:border-[#1e2a5e] bg-white text-[#1e2a5e] text-sm" />
                <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa0d8] hover:text-[#5a6380] transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign in to Admin"}
            </button>
          </form>

          {/* Credentials hint */}
          <div className="mt-8 p-5 border border-[#dde2f0] bg-white">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#8fa0d8] mb-3">Default Credentials</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-light text-[#5a6380]">Email</span>
                <span className="text-[11px] font-medium text-[#1e2a5e]">admin@sleetcare.com</span>
              </div>
              <div className="w-full h-px bg-[#dde2f0]" />
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-light text-[#5a6380]">Password</span>
                <span className="text-[11px] font-medium text-[#1e2a5e]">admin123</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] font-light text-[#8fa0d8]">Unauthorized access is strictly prohibited.</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1e2a5e]"><Loader2 className="w-6 h-6 animate-spin text-[#8fa0d8]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
