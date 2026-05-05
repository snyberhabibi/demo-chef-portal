"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[SW] Registered:", registration.scope);

        // Check for updates every 60 seconds
        setInterval(() => registration.update(), 60 * 1000);
      })
      .catch((err) => {
        console.log("[SW] Registration failed:", err);
      });
  }, []);

  return null;
}
