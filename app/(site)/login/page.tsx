"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast({ title: "Account created!", description: "Please sign in." });
    }
  }, [searchParams]);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        toast({ title: "Error", description: "Invalid email or password", variant: "destructive" });
        return;
      }
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role === "Admin") {
        toast({ title: "Admin Account", description: "Please use the admin login page.", variant: "destructive" });
        await signOut({ redirect: false });
        return;
      }
      const callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl) {
        const url = new URL(callbackUrl, window.location.origin);
        router.push(url.pathname);
      } else {
        router.push("/profile");
      }
      toast({ title: "Welcome back!" });
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
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
          <h1 className="font-display text-3xl text-[#1e2a5e] mb-2">Welcome back</h1>
          <p className="text-sm font-light text-[#5a6380]">Sign in to your Sleet Care account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#dde2f0] p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa0d8]" />
                <Input required type="email" {...field("email")} placeholder="jane@email.com"
                  className="pl-10 border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" disabled={loading} />
              </div>
            </div>
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa0d8]" />
                <Input required type={showPassword ? "text" : "password"} {...field("password")} placeholder="••••••••"
                  className="pl-10 pr-10 border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa0d8] hover:text-[#1e2a5e] transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-[#dde2f0] text-center text-sm font-light text-[#5a6380]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#2d3a8c] hover:text-[#1e2a5e] font-medium transition-colors">
              Create one
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

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f7f8fc]"><Loader2 className="w-8 h-8 animate-spin text-[#1e2a5e]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
