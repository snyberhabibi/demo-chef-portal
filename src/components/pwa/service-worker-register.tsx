"use client";

import { useEffect, useState, useCallback } from "react";

export function ServiceWorkerRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [showUpdate, setShowUpdate] = useState(false);

  const applyUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  }, [waitingWorker]);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    // Listen for controller change (new SW took over) and reload
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    );

    let registration: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        registration = reg;
        console.log("[SW] Registered:", reg.scope);

        // If a waiting worker already exists on load — auto-apply it
        // (user already "refreshed" by reopening the app)
        if (reg.waiting && navigator.serviceWorker.controller) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
          return;
        }

        // Listen for new service workers installing
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(newWorker);
              setShowUpdate(true);
            }
          });
        });

        // Check for updates every 60 seconds
        setInterval(() => reg.update(), 60 * 1000);
      })
      .catch((err) => {
        console.log("[SW] Registration failed:", err);
      });

    // Auto-check for updates when app comes back from background
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && registration) {
        registration.update();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
      document.addEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!showUpdate) return null;

  // Simple, non-dismissable update banner — just tap to refresh
  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
        left: "16px",
        right: "16px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "14px",
        background: "#352431",
        color: "#faf9f6",
        fontSize: "14px",
        fontWeight: 500,
        boxShadow:
          "0 8px 24px rgba(53,36,49,0.25), 0 2px 8px rgba(53,36,49,0.1)",
        animation: "fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <span>New version available</span>
      <button
        onClick={applyUpdate}
        style={{
          background: "#df4746",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          minHeight: "36px",
        }}
      >
        Update
      </button>
    </div>
  );
}
