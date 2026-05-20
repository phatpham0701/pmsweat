import { useEffect, useState, useCallback } from "react";

type Mode = "light" | "dark" | "system";
const KEY = "pm_sweat_theme";

function apply(mode: Mode) {
  const root = document.documentElement;
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}

export function useTheme() {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(KEY) as Mode | null) ?? "system";
  });

  useEffect(() => {
    apply(mode);
    localStorage.setItem(KEY, mode);
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [mode]);

  const setTheme = useCallback((m: Mode) => setMode(m), []);
  return { mode, setTheme };
}

export function ThemeBootstrap() {
  useTheme();
  return null;
}
