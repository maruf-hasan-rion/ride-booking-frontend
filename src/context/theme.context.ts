import { type Theme } from "@/providers/theme.provider";
import { createContext } from "react";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};
export const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);
