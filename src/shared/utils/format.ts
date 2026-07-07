// Display formatting per ESTIMATION.md:
// - always prefix with "≈"
// - water: 1 decimal, <0.1 mL floor, auto-convert to L above 1000 mL
// - energy: 2 decimals; carbon: 2 decimals
import {
  APPROX_PREFIX,
  CARBON_DECIMALS,
  ENERGY_DECIMALS,
  MAX_DISPLAY_WATER_ML,
  MIN_DISPLAY_WATER_ML,
  WATER_DECIMALS,
} from "../constants/display";
import { roundTo } from "./rounding";

const ML_PER_L = 1000;

/** Formats a water value (given in mL) into the display string, handling min/max/auto-convert. */
export function formatWaterML(valueML: number): string {
  if (valueML < MIN_DISPLAY_WATER_ML) {
    return `${APPROX_PREFIX} <${MIN_DISPLAY_WATER_ML} mL`;
  }
  if (valueML > MAX_DISPLAY_WATER_ML) {
    const liters = roundTo(valueML / ML_PER_L, 2);
    return `${APPROX_PREFIX} ${liters} L`;
  }
  return `${APPROX_PREFIX} ${roundTo(valueML, WATER_DECIMALS)} mL`;
}

export function formatEnergyWh(valueWh: number): string {
  return `${APPROX_PREFIX} ${roundTo(valueWh, ENERGY_DECIMALS)} Wh`;
}

export function formatCarbonG(valueG: number): string {
  return `${APPROX_PREFIX} ${roundTo(valueG, CARBON_DECIMALS)} g`;
}

/** Compact badge text, e.g. "💧 ≈ 18.4 mL" */
export function formatWaterBadge(valueML: number): string {
  return `\u{1F4A7} ${formatWaterML(valueML)}`;
}
