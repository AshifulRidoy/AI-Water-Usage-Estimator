import type { ReactElement } from "react";
import { useSettings } from "../../popup/hooks/useSettings";
import { useAppliedTheme } from "../../popup/hooks/useAppliedTheme";
import { ToggleRow } from "../components/ToggleRow";
import { SelectRow } from "../components/SelectRow";
import { Spinner } from "../../ui/Spinner";
import type { ThemeMode, WaterUnit } from "../../shared/types";

export function SettingsPage(): ReactElement {
  const { settings, loading, updateSettings } = useSettings();
  useAppliedTheme(settings.theme);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--aiwe-title)" }}>Settings</h1>

      <div
        style={{
          background: "var(--aiwe-card-bg)",
          borderRadius: "var(--aiwe-radius-lg)",
          boxShadow: "var(--aiwe-shadow)",
          padding: "8px 20px",
          marginTop: 16,
        }}
      >
        <ToggleRow
          label="Enable extension"
          checked={settings.enabled}
          onChange={(enabled) => void updateSettings({ enabled })}
        />
        <ToggleRow
          label="Show tooltip on hover"
          checked={settings.showTooltip}
          onChange={(showTooltip) => void updateSettings({ showTooltip })}
        />
        <ToggleRow
          label="Show confidence level"
          checked={settings.showConfidence}
          onChange={(showConfidence) => void updateSettings({ showConfidence })}
        />
        <ToggleRow
          label="Debug logging"
          checked={settings.debugMode}
          onChange={(debugMode) => void updateSettings({ debugMode })}
        />

        <SelectRow
          label="Theme"
          value={settings.theme}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" },
          ]}
          onChange={(value) => void updateSettings({ theme: value as ThemeMode })}
        />

        <SelectRow
          label="Water units"
          value={settings.units.water}
          options={[
            { value: "mL", label: "Milliliters (mL)" },
            { value: "L", label: "Liters (L)" },
            { value: "flOz", label: "US fl oz" },
          ]}
          onChange={(value) =>
            void updateSettings({ units: { ...settings.units, water: value as WaterUnit } })
          }
        />
      </div>

      <p style={{ marginTop: 20 }}>
        <a href="methodology.html" target="_blank" rel="noreferrer">
          View methodology &amp; research sources →
        </a>
      </p>
    </div>
  );
}
