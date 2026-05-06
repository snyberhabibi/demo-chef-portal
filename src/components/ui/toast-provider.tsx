"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  undoAction?: () => void;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, variantOrUndo?: ToastVariant | (() => void), undoAction?: () => void) => void;
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
    (message: string, variantOrUndo?: ToastVariant | (() => void), undoAction?: () => void) => {
      const id = nextId.current++;
      const truncated =
        message.length > MAX_MESSAGE_LENGTH
          ? message.slice(0, MAX_MESSAGE_LENGTH - 1) + "\u2026"
          : message;

      // Resolve overloaded signature
      let variant: ToastVariant = "success";
      let undo: (() => void) | undefined = undoAction;
      if (typeof variantOrUndo === "function") {
        undo = variantOrUndo;
      } else if (typeof variantOrUndo === "string") {
        variant = variantOrUndo;
      }

      setToasts((prev) => {
        const next = [...prev, { id, message: truncated, variant, undoAction: undo }];
        // Stack max 3
        if (next.length > 3) return next.slice(next.length - 3);
        return next;
      });

      // Auto-dismiss: 4s for toasts with undo, 2.5s for others
      const duration = undo ? 4000 : 2500;
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
          top: calc(16px + env(safe-area-inset-top, 0px));
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

/* ------------------------------------------------------------------ */
/*  Variant styling                                                    */
/* ------------------------------------------------------------------ */
const variantStyles: Record<
  ToastVariant,
  { borderColor: string; bg: string; iconBg: string; iconColor: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    borderColor: "var(--color-sage)",
    bg: "rgba(121,173,99,0.04)",
    iconBg: "var(--color-sage-soft)",
    iconColor: "var(--color-sage-deep)",
    Icon: CheckCircle2,
  },
  error: {
    borderColor: "var(--color-red)",
    bg: "rgba(229,65,65,0.04)",
    iconBg: "var(--color-red-soft)",
    iconColor: "var(--color-red-deep)",
    Icon: XCircle,
  },
  warning: {
    borderColor: "var(--color-orange)",
    bg: "rgba(252,157,53,0.06)",
    iconBg: "var(--color-orange-soft)",
    iconColor: "var(--color-orange-text)",
    Icon: AlertTriangle,
  },
  info: {
    borderColor: "var(--color-brown-soft-2)",
    bg: "rgba(51,31,46,0.03)",
    iconBg: "var(--color-cream-sunken)",
    iconColor: "var(--color-brown-soft)",
    Icon: Info,
  },
};

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const v = variantStyles[t.variant];

  // Swipe-to-dismiss handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    if (toastRef.current && Math.abs(diff) > 10) {
      toastRef.current.style.transform = `translateX(${diff}px)`;
      toastRef.current.style.opacity = `${1 - Math.abs(diff) / 200}`;
    }
  };
  const onTouchEnd = () => {
    const diff = currentX.current - startX.current;
    if (Math.abs(diff) > 80) {
      onDismiss(t.id);
    } else if (toastRef.current) {
      toastRef.current.style.transform = "translateX(0)";
      toastRef.current.style.opacity = "1";
    }
    startX.current = 0;
    currentX.current = 0;
  };

  return (
    <div
      ref={toastRef}
      role="status"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={() => onDismiss(t.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: "#fff",
        borderRadius: 14,
        border: "none",
        boxShadow:
          "0 6px 20px rgba(53,36,49,0.12), 0 2px 6px rgba(53,36,49,0.04)",
        pointerEvents: "auto",
        cursor: "pointer",
        transition: "transform 0.15s ease, opacity 0.15s ease",
        animation: t.exiting
          ? "toastSlideOut 0.2s ease-in forwards"
          : mounted
          ? "none"
          : "toastSlideIn 0.25s ease-out forwards",
        opacity: mounted && !t.exiting ? 1 : undefined,
      }}
    >
      {/* Variant icon */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: v.iconBg,
          color: v.iconColor,
          flexShrink: 0,
        }}
      >
        <v.Icon size={14} strokeWidth={3} />
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
