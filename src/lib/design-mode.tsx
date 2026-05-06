"use client";
import { createContext, useContext, ReactNode } from "react";

// Mode B is the only design. This context exists for future use
// but always returns "b" now.
type DesignMode = "b";

const DesignModeContext = createContext<{
  mode: DesignMode;
}>({
  mode: "b",
});

export function DesignModeProvider({ children }: { children: ReactNode }) {
  return (
    <DesignModeContext.Provider value={{ mode: "b" }}>
      {children}
    </DesignModeContext.Provider>
  );
}

export function useDesignMode() {
  return useContext(DesignModeContext);
}
