import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./polaris.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { AuthProvider } from "@/components/providers";
import { PostHogProvider } from "@/lib/providers/posthog-provider";
import { LoadingProvider } from "@/contexts/loading-context";
import { ErrorHandlerProvider } from "@/lib/providers/error-handler-provider";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { LoadingOverlay } from "@/components/shared/loading-overlay";
import { ToastProvider } from "@/components/polaris";
import { ToastBridge } from "@/components/ui/toast-bridge";
import { TranslationPrevention } from "@/components/shared/translation-prevention";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yalla Bites Chef Portal",
  description: "Chef Portal for Yalla Bites",
  icons: {
    icon: "/images/icon01.svg",
    shortcut: "/images/icon01.svg",
    apple: "/images/icon01.svg",
  },
  other: {
    "google": "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
        translate="no"
      >
        <TranslationPrevention />
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <PostHogProvider>
                <LoadingProvider>
                  <ErrorHandlerProvider>
                    <ToastProvider position="top-center">
                      <ToastBridge />
                      {children}
                      <LoadingOverlay />
                    </ToastProvider>
                  </ErrorHandlerProvider>
                </LoadingProvider>
              </PostHogProvider>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
