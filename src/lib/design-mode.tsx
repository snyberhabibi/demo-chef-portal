"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type DemoMode = "active" | "new-applicant";

const DesignModeContext = createContext<{
  mode: "b";
  demoMode: DemoMode;
  setDemoMode: (mode: DemoMode) => void;
  isNewApplicant: boolean;
}>({
  mode: "b",
  demoMode: "active",
  setDemoMode: () => {},
  isNewApplicant: false,
});

export function DesignModeProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState<DemoMode>("active");

  // Support ?demo=new-applicant URL param
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const demoParam = params.get("demo");
    if (demoParam === "new-applicant") {
      setDemoMode("new-applicant");
    }
  }, []);

  return (
    <DesignModeContext.Provider
      value={{
        mode: "b",
        demoMode,
        setDemoMode,
        isNewApplicant: demoMode === "new-applicant",
      }}
    >
      {children}
    </DesignModeContext.Provider>
  );
}

export function useDesignMode() {
  return useContext(DesignModeContext);
}
