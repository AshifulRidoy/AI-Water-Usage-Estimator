import { useEffect } from "react";
import { resolveAutoTheme } from "../../ui/Theme";
import type { Settings } from "../../shared/types";

/** Applies settings.theme (light/dark/auto) to <html data-theme="..."> for the CSS variables in components.css to pick up. */
export function useAppliedTheme(theme: Settings["theme"]): void {
  useEffect(() => {
    const resolved = theme === "auto" ? resolveAutoTheme() : theme;
    document.documentElement.dataset.theme = resolved;

    if (theme !== "auto") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      document.documentElement.dataset.theme = resolveAutoTheme();
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);
}
