// The estimation engine's public entry point: estimateWater().
//
// Golden Rule (ESTIMATION.md): this module and everything it calls must stay
// independent of Browser/DOM/React/Chrome APIs/Storage/UI. Pure input -> calc -> output.
//
// Error handling contract (ESTIMATION.md "Error Handling" / "Validation Rules"):
//   - missing required field (provider/tokenizer/timestamp) or NaN token count -> "unavailable" outcome
//   - negative token count -> throws EstimationValidationError (caller must catch)
//   - otherwise -> deterministic "ok" outcome
import { ESTIMATION_VERSION, getConfig } from "./constants";
import { estimateEnergyWh } from "./energy";
import { estimateWaterML } from "./water";
import { estimateCarbonGrams } from "./carbon";
import { scoreConfidence } from "./confidence";
import { EstimationValidationError } from "./errors";
import type { EstimationInput, EstimationOutcome } from "../shared/types";

function isMissingRequiredField(input: EstimationInput): string | undefined {
  if (!input.provider) return "provider is required";
  if (!input.tokenizer) return "tokenizer is required";
  if (!input.timestamp) return "timestamp is required";
  return undefined;
}

function hasInvalidNumber(input: EstimationInput): boolean {
  return Number.isNaN(input.inputTokens) || Number.isNaN(input.outputTokens);
}

function hasNegativeTokens(input: EstimationInput): boolean {
  return input.inputTokens < 0 || input.outputTokens < 0;
}

/**
 * Deterministic estimation: same input always produces the same output.
 * Never touches DOM/storage/UI — pure calculation only.
 */
export function estimateWater(input: EstimationInput): EstimationOutcome {
  const missingField = isMissingRequiredField(input);
  if (missingField) {
    return { status: "unavailable", reason: missingField };
  }

  if (hasInvalidNumber(input)) {
    return { status: "unavailable", reason: "token counts must be valid numbers" };
  }

  if (hasNegativeTokens(input)) {
    throw new EstimationValidationError("token counts must be >= 0");
  }

  const totalTokens = input.inputTokens + input.outputTokens;
  const config = getConfig(input.provider);

  const energyWh = estimateEnergyWh(totalTokens, config);
  const waterML = estimateWaterML(energyWh, config);
  const carbonGrams = estimateCarbonGrams(energyWh, config);
  const confidence = scoreConfidence({
    provider: input.provider,
    model: input.model,
    tokenizer: input.tokenizer,
  });

  return {
    status: "ok",
    result: {
      waterML,
      energyWh,
      carbonGrams,
      confidence,
      estimationVersion: ESTIMATION_VERSION,
    },
  };
}

export { EstimationValidationError } from "./errors";
export { scoreConfidence } from "./confidence";
export { getConfig, ESTIMATION_VERSION } from "./constants";
