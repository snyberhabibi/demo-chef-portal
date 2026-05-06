import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Lora } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast-provider";
import { I18nProvider } from "@/lib/i18n";
import { DesignModeProvider } from "@/lib/design-mode";
import { DesignModeToggle } from "@/components/ui/design-mode-toggle";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#331f2e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Yalla Bites — Chef Portal",
  description: "Manage your kitchen, menu, orders, and flash sales — all in one place.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Yalla Bites Chef Portal",
    startupImage: "/icons/icon-512.png",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${lora.variable}`} style={{ height: "100dvh" }}>
      <body className="flex flex-col" style={{ minHeight: "100dvh" }}><I18nProvider><DesignModeProvider><ToastProvider>{children}<ServiceWorkerRegister /><InstallPrompt /><DesignModeToggle /></ToastProvider></DesignModeProvider></I18nProvider></body>
    </html>
  );
}
