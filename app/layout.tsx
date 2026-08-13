import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { AppStoreProvider } from "@/store/AppStore";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import LoadingProvider from "@/components/providers/loading-provider";
import TopProgressBar from "@/components/ui/top-progress-bar";
import { generateSEO } from "@/lib/seo";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/structured-data";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import { Suspense } from "react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  ...generateSEO(),
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/logo.png',
    apple:    '/logo.png',
    other: [
      { rel: 'mask-icon', url: '/logo.png', color: '#1e2a5e' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <OrganizationSchema />
        <WebsiteSchema />
        {/* Meta Pixel — loads once, tracks route changes via FacebookPixel component */}
      </head>
      <body>
        <Suspense>
          <FacebookPixel />
        </Suspense>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <AppStoreProvider>
              <TooltipProvider>
                <LoadingProvider>
                  <TopProgressBar />
                  <Toaster />
                  <Sonner />
                  {children}
                </LoadingProvider>
              </TooltipProvider>
            </AppStoreProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
