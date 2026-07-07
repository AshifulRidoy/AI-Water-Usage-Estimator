// Confidence scoring per ESTIMATION.md "Confidence Scoring":
//   High   = known provider && known tokenizer && known model
//   Medium = known provider && known tokenizer && unknown model
//   Low    = unknown provider || character heuristic || unknown model (fallback bucket)
import type { ConfidenceLevel, TokenizerKind } from "../shared/types";

const KNOWN_PROVIDERS = new Set(["chatgpt", "claude", "gemini"]);

export interface ConfidenceInputs {
  provider: string;
  model?: string;
  tokenizer: TokenizerKind;
}

export function scoreConfidence({ provider, model, tokenizer }: ConfidenceInputs): ConfidenceLevel {
  const knownProvider = KNOWN_PROVIDERS.has(provider);
  const knownTokenizer = tokenizer === "provider";
  const knownModel = Boolean(model);

  if (knownProvider && knownTokenizer && knownModel) return "High";
  if (knownProvider && knownTokenizer) return "Medium";
  return "Low";
}
