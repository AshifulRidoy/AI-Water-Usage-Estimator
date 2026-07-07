// Token estimation. Per ESTIMATION.md:
//   Estimated Tokens = Characters ÷ CharactersPerToken (default 4, configurable)
// Preferred: provider tokenizer (future). Fallback: character heuristic (always available).
import { DEFAULT_CONFIG } from "../shared/constants/config";
import type { TokenizerKind } from "../shared/types";

export interface TokenEstimate {
  tokens: number;
  kind: TokenizerKind;
}

/** Character-based heuristic tokenizer. Always available, used as the fallback. */
export function estimateTokensFromCharacters(
  text: string,
  charactersPerToken: number = DEFAULT_CONFIG.CHARACTERS_PER_TOKEN,
): TokenEstimate {
  if (!text) return { tokens: 0, kind: "heuristic" };
  const tokens = Math.ceil(text.length / charactersPerToken);
  return { tokens, kind: "heuristic" };
}

/**
 * Primary entry point used by content scripts. Attempts a provider tokenizer
 * (see tokenizer/providers, currently unimplemented placeholders for v2) and
 * falls back to the character heuristic — the fallback is always available
 * per architecture.md "Tokenizer" section.
 */
export function estimateTokens(text: string, provider?: string): TokenEstimate {
  const providerTokenizer = getProviderTokenizer(provider);
  if (providerTokenizer) {
    try {
      return providerTokenizer(text);
    } catch {
      // Never let a provider tokenizer failure break estimation — fall through.
    }
  }
  return estimateTokensFromCharacters(text);
}

// Placeholder registry for future provider-specific tokenizers (v2, per PRD "Future").
// Returns undefined today, meaning the heuristic fallback is always used in v1.
function getProviderTokenizer(_provider?: string): ((text: string) => TokenEstimate) | undefined {
  return undefined;
}
