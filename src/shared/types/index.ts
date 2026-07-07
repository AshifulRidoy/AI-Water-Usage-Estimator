// Shared type definitions used across estimator, tokenizer, storage, content, and UI layers.
// Kept dependency-free (no DOM, no chrome.* types) so the estimator/tokenizer can stay pure.

export type ProviderId = "chatgpt" | "claude" | "gemini" | "unknown";

export type TokenizerKind = "provider" | "heuristic";

export type ConfidenceLevel = "High" | "Medium" | "Low";

// --- Estimation engine (per ESTIMATION.md) ---------------------------------

export interface EstimationInput {
  provider: string;
  model?: string;
  inputTokens: number;
  outputTokens: number;
  tokenizer: TokenizerKind;
  timestamp: number;
}

export interface EstimationResult {
  waterML: number;
  energyWh: number;
  carbonGrams: number;
  confidence: ConfidenceLevel;
  estimationVersion: string;
}

// Discriminated union so callers must handle the "Unavailable" case explicitly,
// per ESTIMATION.md "Error Handling" (invalid/NaN input -> Unavailable, never crash UI).
export type EstimationOutcome =
  | { status: "ok"; result: EstimationResult }
  | { status: "unavailable"; reason: string };

// --- Response flow data (architecture.md "Water Estimator" input) ----------

export interface ResponseData {
  provider: ProviderId;
  model?: string;
  promptText?: string;
  responseText: string;
  responseId: string; // stable hash/id used for caching + dedup
  timestamp: number;
}

// --- Settings / Storage schema (architecture.md "Storage Schema") ----------

export type ThemeMode = "light" | "dark" | "auto";
export type WaterUnit = "mL" | "L" | "flOz";
export type EnergyUnit = "Wh" | "kWh";
export type CarbonUnit = "g" | "kg";

export interface Settings {
  enabled: boolean;
  units: {
    water: WaterUnit;
    energy: EnergyUnit;
    carbon: CarbonUnit;
  };
  theme: ThemeMode;
  showTooltip: boolean;
  showConfidence: boolean;
  debugMode: boolean;
}

export interface HistoryEntry {
  date: string; // ISO date (yyyy-mm-dd)
  provider: ProviderId;
  water: number; // mL, full precision
  tokens: number;
}

export interface DailyTotals {
  date: string;
  water: number;
  energy: number;
  carbon: number;
  prompts: number;
}

export interface Statistics {
  today: DailyTotals;
  lifetime: {
    water: number;
    energy: number;
    carbon: number;
    prompts: number;
    largestPromptWater: number;
  };
  history: HistoryEntry[];
}

// --- Messaging (background <-> content/popup) ------------------------------

export type ExtensionMessage =
  | { type: "GET_SETTINGS" }
  | { type: "SET_SETTINGS"; payload: Partial<Settings> }
  | { type: "GET_STATISTICS" }
  | { type: "RECORD_ESTIMATE"; payload: { entry: HistoryEntry; estimate: EstimationResult } }
  | { type: "RESET_STATISTICS" };

export type ExtensionMessageResponse =
  | { ok: true; data?: Settings | Statistics }
  | { ok: false; error: string };
