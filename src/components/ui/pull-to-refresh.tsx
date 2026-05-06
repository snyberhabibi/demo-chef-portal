"use client";
import { useState, useRef, useCallback } from "react";

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pullDistance = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY.current === 0) return;
    const currentY = e.touches[0].clientY;
    pullDistance.current = currentY - startY.current;
    if (pullDistance.current > 10 && containerRef.current?.scrollTop === 0) {
      setPulling(true);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pulling && pullDistance.current > 60) {
      setRefreshing(true);
      setPulling(false);
      // Reload the page
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      setPulling(false);
    }
    startY.current = 0;
    pullDistance.current = 0;
  }, [pulling]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: "relative" }}
    >
      {(pulling || refreshing) && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px 0",
          fontSize: 13,
          color: "var(--color-brown-soft-2)",
          fontWeight: 500,
        }}>
          {refreshing ? "Refreshing..." : "Pull to refresh"}
        </div>
      )}
      {children}
    </div>
  );
}
