import { useEffect, useState } from "react";

export type ThemeMode = "day" | "night";
const KEY = "juliana-os:theme";

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("day", mode === "day");
  root.classList.toggle("night", mode === "night");
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("night");

  useEffect(() => {
    const saved = (typeof window !== "undefined" ? localStorage.getItem(KEY) : null) as ThemeMode | null;
    let initial: ThemeMode = "night";
    if (saved === "day" || saved === "night") {
      initial = saved;
    } else if (typeof window !== "undefined") {
      const h = new Date().getHours();
      initial = h >= 6 && h < 18 ? "day" : "night";
    }
    setMode(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === "day" ? "night" : "day";
    setMode(next);
    applyTheme(next);
    if (typeof window !== "undefined") localStorage.setItem(KEY, next);
  };

  return { mode, toggle };
}
