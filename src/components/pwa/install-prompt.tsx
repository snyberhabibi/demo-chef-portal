"use client";

import { useState, useEffect } from "react";
import { X, Share, Plus, Bell } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check if already installed as standalone
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !(window as any).MSStream;
    setIsIOS(ios);

    // Check notification permission
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }

    // Listen for Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Show prompt after a delay if not installed and not dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (!standalone && !dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android/Chrome — use native prompt
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
    // iOS shows instructions instead
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);

      // Show a test notification
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification("Yalla Bites Chef Portal", {
          body: "Notifications are enabled! You'll get alerts for new orders.",
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-128.png",
        } as NotificationOptions);
      }
    }
  };

  const dismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Don't show if already installed or user dismissed
  if (isStandalone || !showPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: 16,
        right: 16,
        zIndex: 100,
        maxWidth: 400,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 16,
        padding: 20,
        boxShadow:
          "0 8px 32px rgba(51,31,46,0.15), 0 2px 8px rgba(51,31,46,0.08)",
        border: "1px solid rgba(51,31,46,0.08)",
        animation: "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Close button */}
      <button
        onClick={dismiss}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "var(--color-brown-soft-2)",
        }}
      >
        <X size={18} />
      </button>

      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <img
          src="/icons/icon-128.png"
          alt="Yalla Bites Chef Portal"
          style={{ width: 48, height: 48, borderRadius: 12 }}
        />
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--color-brown)",
            }}
          >
            Add Yalla Bites Chef Portal to Home Screen
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--color-brown-soft)",
              marginTop: 2,
            }}
          >
            Get the full app experience
          </div>
        </div>
      </div>

      {isIOS ? (
        /* iOS instructions */
        <div>
          <div
            style={{
              fontSize: 13,
              color: "var(--color-brown-soft)",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "var(--color-cream-deep)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-brown)",
                  flexShrink: 0,
                }}
              >
                1
              </span>
              <span>
                Tap the{" "}
                <Share
                  size={14}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    color: "var(--color-red)",
                  }}
                />{" "}
                <strong>Share</strong> button in Safari
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "var(--color-cream-deep)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-brown)",
                  flexShrink: 0,
                }}
              >
                2
              </span>
              <span>
                Scroll down and tap{" "}
                <Plus
                  size={14}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    color: "var(--color-red)",
                  }}
                />{" "}
                <strong>Add to Home Screen</strong>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "var(--color-cream-deep)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-brown)",
                  flexShrink: 0,
                }}
              >
                3
              </span>
              <span>
                Tap <strong>Add</strong> — done!
              </span>
            </div>
          </div>

          {/* Notification opt-in for iOS 16.4+ */}
          {!notificationsEnabled && "Notification" in window && (
            <button
              onClick={enableNotifications}
              className="btn btn-dark btn-block"
              style={{ marginTop: 4 }}
            >
              <Bell size={16} style={{ marginRight: 8 }} />
              Enable Order Notifications
            </button>
          )}

          {notificationsEnabled && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "var(--color-sage-light)",
                borderRadius: 8,
                fontSize: 13,
                color: "var(--color-sage-deep)",
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              <Bell size={14} />
              Notifications enabled
            </div>
          )}
        </div>
      ) : (
        /* Android/Chrome — use native install */
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {!notificationsEnabled && "Notification" in window && (
            <button
              onClick={enableNotifications}
              className="btn btn-ghost"
              style={{ flex: 1 }}
            >
              <Bell size={16} style={{ marginRight: 6 }} />
              Notifications
            </button>
          )}
          <button
            onClick={handleInstall}
            className="btn btn-red btn-pill"
            style={{ flex: 1 }}
          >
            Install App
          </button>
        </div>
      )}
    </div>
  );
}
