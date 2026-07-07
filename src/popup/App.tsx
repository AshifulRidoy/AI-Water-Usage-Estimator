import type { ReactElement } from "react";
import { Dashboard } from "./pages/Dashboard";
import { useSettings } from "./hooks/useSettings";
import { useAppliedTheme } from "./hooks/useAppliedTheme";

export function App(): ReactElement {
  const { settings } = useSettings();
  useAppliedTheme(settings.theme);

  return <Dashboard />;
}
