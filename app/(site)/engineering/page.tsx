"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Redirect to services — engineering is not relevant for skincare brand
export default function Engineering() {
  if (typeof window !== "undefined") {
    window.location.replace("/services");
  }
  return (
    <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-light text-[#5a6380] mb-4">Redirecting to Services…</p>
        <Link href="/services">
          <button className="flex items-center gap-2 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#2d3a8c] transition-colors mx-auto">
            Go to Services <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
