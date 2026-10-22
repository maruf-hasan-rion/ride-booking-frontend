import { ThemeProviderContext } from "@/context/theme.context";
import { useCallback, useEffect, useMemo, useState } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

const isTheme = (value: string | null): value is Theme =>
  value === "dark" || value === "light" || value === "system";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;

    const savedTheme = window.localStorage.getItem(storageKey);
    return isTheme(savedTheme) ? savedTheme : defaultTheme;
  });

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      window.localStorage.setItem(storageKey, nextTheme);
      setThemeState(nextTheme);
    },
    [storageKey]
  );

  useEffect(() => {
    const rootElement = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyThemeClass = (nextTheme: "light" | "dark") => {
      rootElement.classList.remove("light", "dark");
      rootElement.classList.add(nextTheme);
    };

    if (theme === "system") {
      const applySystemTheme = () =>
        applyThemeClass(mediaQuery.matches ? "dark" : "light");

      applySystemTheme();
      mediaQuery.addEventListener("change", applySystemTheme);
      return () => mediaQuery.removeEventListener("change", applySystemTheme);
    }

    applyThemeClass(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
