// Unit conversion helpers per ESTIMATION.md "Unit Conversion" table.
import type { CarbonUnit, EnergyUnit, WaterUnit } from "../types";

const ML_PER_L = 1000;
const ML_PER_FL_OZ = 29.5735;
const WH_PER_KWH = 1000;
const G_PER_KG = 1000;

export function convertWater(valueML: number, unit: WaterUnit): number {
  switch (unit) {
    case "L":
      return valueML / ML_PER_L;
    case "flOz":
      return valueML / ML_PER_FL_OZ;
    case "mL":
    default:
      return valueML;
  }
}

export function convertEnergy(valueWh: number, unit: EnergyUnit): number {
  return unit === "kWh" ? valueWh / WH_PER_KWH : valueWh;
}

export function convertCarbon(valueG: number, unit: CarbonUnit): number {
  return unit === "kg" ? valueG / G_PER_KG : valueG;
}
