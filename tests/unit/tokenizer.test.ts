import { describe, expect, it } from "vitest";
import { estimateTokens, estimateTokensFromCharacters } from "../../src/tokenizer/tokenizer";
import { fallbackTokenize } from "../../src/tokenizer/fallback";

describe("estimateTokensFromCharacters", () => {
  it("returns 0 tokens for empty string", () => {
    expect(estimateTokensFromCharacters("").tokens).toBe(0);
  });

  it("divides character count by charactersPerToken (default 4), rounding up", () => {
    expect(estimateTokensFromCharacters("abcd").tokens).toBe(1);
    expect(estimateTokensFromCharacters("abcde").tokens).toBe(2);
    expect(estimateTokensFromCharacters("a".repeat(400)).tokens).toBe(100);
  });

  it("respects a configurable charactersPerToken", () => {
    expect(estimateTokensFromCharacters("abcdefgh", 2).tokens).toBe(4);
  });

  it("always reports kind 'heuristic'", () => {
    expect(estimateTokensFromCharacters("hello").kind).toBe("heuristic");
  });
});

describe("estimateTokens (public entry point)", () => {
  it("falls back to heuristic tokenizer since no provider tokenizers are wired yet", () => {
    const result = estimateTokens("hello world", "claude");
    expect(result.kind).toBe("heuristic");
  });
});

describe("fallbackTokenize", () => {
  it("is always available and matches the character heuristic", () => {
    expect(fallbackTokenize("test").tokens).toBe(estimateTokensFromCharacters("test").tokens);
  });
});
