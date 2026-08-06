"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "@/components/ui/loading-screen";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading on initial mount
  const [hasInitialized, setHasInitialized] = useState(false);
  const pathname = usePathname();

  // Handle initial page load only once
  useEffect(() => {
    if (!hasInitialized) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasInitialized(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasInitialized]);

  // Handle route changes (but not initial load)
  useEffect(() => {
    if (hasInitialized) {
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [pathname, hasInitialized]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      <LoadingScreen isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  );
}