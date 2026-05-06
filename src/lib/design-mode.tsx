"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DesignMode = "a" | "b";

const DesignModeContext = createContext<{
  mode: DesignMode;
  setMode: (mode: DesignMode) => void;
  toggle: () => void;
}>({
  mode: "b",
  setMode: () => {},
  toggle: () => {},
});

export function DesignModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DesignMode>(() => {
    if (typeof window === "undefined") return "b";
    return (localStorage.getItem("design-mode") as DesignMode) || "b";
  });

  useEffect(() => {
    localStorage.setItem("design-mode", mode);
    document.documentElement.setAttribute("data-design-mode", mode);
  }, [mode]);

  const toggle = () => setMode(m => m === "a" ? "b" : "a");

  return (
    <DesignModeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </DesignModeContext.Provider>
  );
}

export function useDesignMode() {
  return useContext(DesignModeContext);
}
