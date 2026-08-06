"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
}

const TAGLINES = [
  "Pure ingredients, honestly sourced…",
  "Formulated with dermatologists…",
  "Cruelty-free, every batch…",
  "Natural skincare, loading…",
  "Good skin starts here…",
];

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [tagline, setTagline] = useState(TAGLINES[0]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setVisible(true);
      setProgress(0);
      setTagline(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 88) { clearInterval(interval); return 88; }
          return prev + Math.random() * 14;
        });
      }, 120);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      const fadeTimer = setTimeout(() => setVisible(false), 400);
      const hideTimer = setTimeout(() => { setShowLoader(false); setProgress(0); }, 700);
      return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
    }
  }, [isLoading]);

  if (!showLoader) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0, backgroundColor: "#1e2a5e" }}
    >
      {/* Soft radial glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[180px]"
        style={{ background: "radial-gradient(circle, #8fa0d8, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[120px]"
        style={{ background: "radial-gradient(circle, #c8d0f0, transparent)" }} />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(200,208,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,208,240,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center px-8">

        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Sleet Care"
            className="h-20 w-auto mb-6"
          />

          {/* Decorative line under logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-px bg-[#8fa0d8]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#8fa0d8]/60" />
            <div className="w-10 h-px bg-[#8fa0d8]/50" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[#8fa0d8] text-[10px] tracking-[0.3em] uppercase mb-10 text-center">
          {tagline}
        </p>

        {/* Progress bar */}
        <div className="w-56 relative mb-5">
          {/* Track */}
          <div className="w-full h-px bg-[#8fa0d8]/20 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4a5fa8, #c8d0f0)",
              }}
            />
            {/* Shimmer */}
            <div
              className="absolute top-0 h-full w-16 transition-all duration-300 ease-out"
              style={{
                left: `${Math.max(0, progress - 8)}%`,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />
          </div>
          {/* Glow dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ease-out shadow-lg"
            style={{
              left: `calc(${progress}% - 4px)`,
              backgroundColor: "#c8d0f0",
              boxShadow: "0 0 8px 2px rgba(200,208,240,0.6)",
            }}
          />
        </div>

        {/* Percentage */}
        <p className="text-[#c8d0f0]/40 text-[10px] tracking-[0.3em] mb-10">
          {Math.round(progress)}%
        </p>

        {/* Animated dots */}
        <div className="flex gap-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: "#8fa0d8",
                opacity: 0.4,
                animation: `loading-bounce 1.4s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations — soft leaf motif */}
      {[
        "top-8 left-8",
        "top-8 right-8",
        "bottom-8 left-8",
        "bottom-8 right-8",
      ].map((pos) => (
        <div key={pos} className={`absolute ${pos} opacity-15`}>
          <div className="flex flex-col gap-1.5">
            <div className="w-8 h-px bg-[#8fa0d8]" />
            <div className="w-4 h-px bg-[#8fa0d8]" />
          </div>
        </div>
      ))}

      {/* Bottom tagline */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[#8fa0d8]/25 text-[9px] tracking-[0.4em] uppercase">
          100% Natural · Cruelty Free · Dermatologist Tested
        </p>
      </div>
    </div>
  );
}
