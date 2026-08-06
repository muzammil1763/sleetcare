"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const pathname = usePathname();

  // Mark as initialized after first render
  useEffect(() => {
    setHasInitialized(true);
  }, []);

  // Only show progress bar on navigation, not initial load
  useEffect(() => {
    if (hasInitialized) {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 50);

      // Complete after route change
      const timer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }, 600);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [pathname, hasInitialized]);

  if (!isLoading || !hasInitialized) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 transition-all duration-300 ease-out shadow-lg shadow-sky-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}