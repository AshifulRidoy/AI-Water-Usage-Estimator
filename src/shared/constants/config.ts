// Central, single source of truth for all configurable estimation constants.
// ESTIMATION.md: "Never hardcode this value" / "All values should be loaded
// from one configuration file." Every constant here is a rough, published-research
// based approximation — NOT a measurement. See methodology page for citations.

export const ESTIMATION_VERSION = "1.0.0";

export interface EstimationConfig {
  /** Watt-hours consumed per token of input+output, blended estimate across providers. */
  ENERGY_PER_TOKEN: number;
  /** Milliliters of water (on/off-site) per watt-hour of datacenter energy. */
  WATER_PER_WH: number;
  /** Grams of CO2 per watt-hour of datacenter energy (grid-average estimate). */
  CARBON_PER_WH: number;
  /** Fallback heuristic: characters per token when no tokenizer is available. */
  CHARACTERS_PER_TOKEN: number;
}

// Version 1 defaults. These are deliberately conservative, published-research-based
// approximations (see METHODOLOGY). They are the single place to tune the model.
export const DEFAULT_CONFIG: EstimationConfig = {
  ENERGY_PER_TOKEN: 0.0003, // Wh/token
  WATER_PER_WH: 1.8, // mL/Wh
  CARBON_PER_WH: 0.4, // gCO2/Wh
  CHARACTERS_PER_TOKEN: 4,
};

// Provider-specific overrides are intentionally NOT populated in v1.
// Per ESTIMATION.md "Provider Defaults": "The estimator should remain
// provider-independent" in v1; per-provider tuning is v2 scope.
export const PROVIDER_CONFIG_OVERRIDES: Partial<Record<string, Partial<EstimationConfig>>> = {};

export function getConfig(provider?: string): EstimationConfig {
  const override = provider ? PROVIDER_CONFIG_OVERRIDES[provider] : undefined;
  return { ...DEFAULT_CONFIG, ...override };
}
