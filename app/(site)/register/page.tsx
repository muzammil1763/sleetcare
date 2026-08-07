"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast({ title: "Account created!", description: "Please sign in." });
      router.push("/login?registered=true");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo.png" alt="Sleet Care" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <h1 className="font-display text-3xl text-[#1e2a5e] mb-2">Create account</h1>
          <p className="text-sm font-light text-[#5a6380]">Join Sleet Care to track your orders and routine</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#dde2f0] p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Full Name</Label>
              <Input required {...field("name")} placeholder="Jane Doe"
                className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" disabled={loading} />
            </div>
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Email Address</Label>
              <Input required type="email" {...field("email")} placeholder="jane@email.com"
                className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" disabled={loading} />
            </div>
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Password</Label>
              <div className="relative">
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  {...field("password")}
                  placeholder="Enter password"
                  minLength={6}
                  className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa0d8] hover:text-[#1e2a5e] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] font-light text-[#8fa0d8] mt-1.5">At least 6 characters</p>
            </div>
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Confirm Password</Label>
              <div className="relative">
                <Input
                  required
                  type={showConfirm ? "text" : "password"}
                  {...field("confirmPassword")}
                  placeholder="Repeat password"
                  className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa0d8] hover:text-[#1e2a5e] transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-[#dde2f0] text-center text-sm font-light text-[#5a6380]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2d3a8c] hover:text-[#1e2a5e] font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs font-light text-[#8fa0d8] mt-6">
          <Link href="/" className="hover:text-[#1e2a5e] transition-colors">← Back to Sleet Care</Link>
        </p>
      </div>
    </div>
  );
}
