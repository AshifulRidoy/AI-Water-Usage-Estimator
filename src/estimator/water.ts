// Water (mL) = Energy (Wh) × WaterUsageFactor   (ESTIMATION.md "Water Estimation")
import type { EstimationConfig } from "./constants";

export function estimateWaterML(energyWh: number, config: EstimationConfig): number {
  return energyWh * config.WATER_PER_WH;
}
