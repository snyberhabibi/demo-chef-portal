"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Check } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Toast {
  id: number;
  message: string;
  undoAction?: () => void;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, undoAction?: () => void) => void;
}

const MAX_MESSAGE_LENGTH = 40;

const ToastContext = createContext<ToastContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const toast = useCallback(
    (message: string, undoAction?: () => void) => {
      const id = nextId.current++;
      const truncated =
        message.length > MAX_MESSAGE_LENGTH
          ? message.slice(0, MAX_MESSAGE_LENGTH - 1) + "\u2026"
          : message;

      setToasts((prev) => {
        const next = [...prev, { id, message: truncated, undoAction }];
        // Stack max 3
        if (next.length > 3) return next.slice(next.length - 3);
        return next;
      });

      // Auto-dismiss: 6s for toasts with undo, 4s for success
      const duration = undoAction ? 6000 : 4000;
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Toast container + individual toast                                 */
/* ------------------------------------------------------------------ */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        .toast-anchor {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: calc(100% - 32px);
          max-width: 420px;
          pointer-events: none;
        }
        @media (min-width: 1024px) {
          .toast-anchor {
            left: auto;
            right: 24px;
            transform: none;
          }
        }
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }
      `}</style>
      <div className="toast-anchor" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
}

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: "#fff",
        borderRadius: 12,
        borderLeft: "4px solid var(--color-sage)",
        boxShadow:
          "0 8px 24px rgba(51,31,46,0.10), 0 2px 6px rgba(51,31,46,0.04)",
        pointerEvents: "auto",
        animation: t.exiting
          ? "toastSlideOut 0.2s ease-in forwards"
          : mounted
          ? "none"
          : "toastSlideIn 0.25s ease-out forwards",
        opacity: mounted && !t.exiting ? 1 : undefined,
        transform: mounted && !t.exiting ? "translateY(0)" : undefined,
      }}
    >
      {/* Check icon */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "var(--color-sage-soft)",
          color: "var(--color-sage-deep)",
          flexShrink: 0,
        }}
      >
        <Check size={14} strokeWidth={3} />
      </span>

      {/* Message */}
      <span
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
          color: "var(--color-brown)",
        }}
      >
        {t.message}
      </span>

      {/* Optional Undo link */}
      {t.undoAction && (
        <button
          onClick={() => {
            t.undoAction?.();
            onDismiss(t.id);
          }}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-red)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Undo
        </button>
      )}
    </div>
  );
}
