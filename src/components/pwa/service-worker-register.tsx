"use client";

import { useEffect, useState, useCallback } from "react";

export function ServiceWorkerRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [showUpdate, setShowUpdate] = useState(false);

  const handleUpdate = useCallback(() => {
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

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[SW] Registered:", registration.scope);

        // If a waiting worker already exists on load
        if (registration.waiting && !sessionStorage.getItem("sw-update-dismissed")) {
          setWaitingWorker(registration.waiting);
          setShowUpdate(true);
        }

        // Listen for new service workers installing
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            // New SW installed and waiting to activate
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller &&
              !sessionStorage.getItem("sw-update-dismissed")
            ) {
              setWaitingWorker(newWorker);
              setShowUpdate(true);
            }
          });
        });

        // Check for updates every 60 seconds
        setInterval(() => registration.update(), 60 * 1000);
      })
      .catch((err) => {
        console.log("[SW] Registration failed:", err);
      });

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
    };
  }, []);

  const dismiss = useCallback(() => {
    setShowUpdate(false);
    sessionStorage.setItem("sw-update-dismissed", "1");
  }, []);

  if (!showUpdate) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
        left: "16px",
        right: "16px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "14px",
        background: "#331f2e",
        color: "#faf9f6",
        fontSize: "14px",
        fontWeight: 500,
        boxShadow:
          "0 8px 24px rgba(51,31,46,0.2), 0 2px 8px rgba(51,31,46,0.1)",
        animation: "fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <span>Update available</span>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          onClick={dismiss}
          aria-label="Dismiss update"
          style={{
            background: "transparent",
            color: "rgba(250,249,246,0.6)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap",
            minHeight: "36px",
          }}
        >
          Later
        </button>
        <button
          onClick={handleUpdate}
          style={{
            background: "#e54141",
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
          Refresh
        </button>
      </div>
    </div>
  );
}
