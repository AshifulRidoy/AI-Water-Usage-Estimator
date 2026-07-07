// Theme tokens as CSS variables. Per architecture.md "Theme": light/dark/auto,
// CSS variables only, no inline styles.
export const THEME_CSS_VARS = {
  light: {
    "--aiwe-bg": "#ffffff",
    "--aiwe-fg": "#1a1a1a",
    "--aiwe-muted": "#6b7280",
    "--aiwe-accent": "#0ea5e9",
    "--aiwe-border": "#e5e7eb",
    "--aiwe-card-bg": "#f9fafb",
  },
  dark: {
    "--aiwe-bg": "#111827",
    "--aiwe-fg": "#f3f4f6",
    "--aiwe-muted": "#9ca3af",
    "--aiwe-accent": "#38bdf8",
    "--aiwe-border": "#374151",
    "--aiwe-card-bg": "#1f2937",
  },
} as const;

export type ThemeName = keyof typeof THEME_CSS_VARS;

export function applyTheme(target: HTMLElement, theme: ThemeName): void {
  const vars = THEME_CSS_VARS[theme];
  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value);
  }
}

export function resolveAutoTheme(): ThemeName {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}
