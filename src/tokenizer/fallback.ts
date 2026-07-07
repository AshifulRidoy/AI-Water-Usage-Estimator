// Explicit fallback module, kept separate per architecture.md folder structure
// (`tokenizer/fallback.ts`). Re-exports the character heuristic so callers can
// depend on "the fallback" without knowing about the primary tokenizer.
export { estimateTokensFromCharacters as fallbackTokenize } from "./tokenizer";
