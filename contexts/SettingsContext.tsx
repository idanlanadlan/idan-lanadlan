"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS } from "@/lib/db";

const SettingsContext = createContext<Record<string, string>>(DEFAULT_SETTINGS);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
