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
import Script from "next/script";

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
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','1626447845566585');
          fbq('track','PageView');
        `}</Script>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1626447845566585&ev=PageView&noscript=1" alt="" />
        </noscript>
      </head>
      <body>
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
