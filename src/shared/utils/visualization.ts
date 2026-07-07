// Pure helpers for the visual (glass-fill) display mode. Kept separate from
// format.ts since these are graphic-proportion concerns, not text formatting.
import { MAX_DISPLAY_WATER_ML, MIN_DISPLAY_WATER_ML } from "../constants/display";
import { roundTo } from "./rounding";

const ML_PER_L = 1000;
const WATER_DECIMALS = 1;

/** Clamps value/reference into a 0..1 fill ratio for the glass graphic. */
export function computeFillPercent(valueML: number, referenceML: number): number {
  if (referenceML <= 0) return 0;
  const ratio = valueML / referenceML;
  return Math.min(1, Math.max(0, ratio));
}

export interface SplitWaterValue {
  amount: string;
  unit: "mL" | "L";
}

/** Splits a raw mL value into a big-number + unit pair for the glass card, auto-converting to L. */
export function splitWaterValue(valueML: number): SplitWaterValue {
  if (valueML < MIN_DISPLAY_WATER_ML) {
    return { amount: `<${MIN_DISPLAY_WATER_ML}`, unit: "mL" };
  }
  if (valueML > MAX_DISPLAY_WATER_ML) {
    return { amount: String(roundTo(valueML / ML_PER_L, 2)), unit: "L" };
  }
  return { amount: String(roundTo(valueML, WATER_DECIMALS)), unit: "mL" };
}
