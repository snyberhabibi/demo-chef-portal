"use client";

export default function OfflinePage() {
  return (
    <div className="text-center max-w-sm mx-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/icon-192.png"
        alt="Yalla Bites"
        width={96}
        height={96}
        className="mx-auto mb-6 rounded-2xl"
      />
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "#331f2e", fontFamily: "var(--font-display, sans-serif)" }}
      >
        You&apos;re offline
      </h1>
      <p className="text-base mb-8" style={{ color: "#5a4658" }}>
        Check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-transform active:scale-95"
        style={{
          backgroundColor: "#e54141",
          borderColor: "#c93232",
          boxShadow:
            "0 0 0 1px rgba(229,65,65,0.1), 0 4px 12px rgba(229,65,65,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
          minHeight: "44px",
        }}
      >
        Retry
      </button>
    </div>
  );
}
