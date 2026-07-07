// Settings repository. Per architecture.md "Storage Schema" -> settings.
import { storageGet, storageSet } from "./storage";
import type { Settings } from "../shared/types";

const SETTINGS_KEY = "settings";

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  units: { water: "mL", energy: "Wh", carbon: "g" },
  theme: "auto",
  showTooltip: true,
  showConfidence: true,
  debugMode: false,
};

export async function getSettings(): Promise<Settings> {
  const stored = await storageGet<Settings>(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = {
    ...current,
    ...patch,
    units: { ...current.units, ...patch.units },
  };
  await storageSet(SETTINGS_KEY, next);
  return next;
}
