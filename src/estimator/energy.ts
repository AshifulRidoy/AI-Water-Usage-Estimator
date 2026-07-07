// Energy (Wh) = Total Tokens × EnergyPerToken   (ESTIMATION.md "Energy Estimation")
import type { EstimationConfig } from "./constants";

export function estimateEnergyWh(totalTokens: number, config: EstimationConfig): number {
  return totalTokens * config.ENERGY_PER_TOKEN;
}
