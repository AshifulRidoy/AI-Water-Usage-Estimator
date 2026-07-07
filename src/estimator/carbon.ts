// Carbon (g) = Energy (Wh) × CarbonFactor   (ESTIMATION.md "Carbon Estimation")
import type { EstimationConfig } from "./constants";

export function estimateCarbonGrams(energyWh: number, config: EstimationConfig): number {
  return energyWh * config.CARBON_PER_WH;
}
