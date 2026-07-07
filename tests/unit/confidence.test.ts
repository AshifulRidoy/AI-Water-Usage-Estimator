import { describe, expect, it } from "vitest";
import { scoreConfidence } from "../../src/estimator/confidence";

describe("scoreConfidence", () => {
  it("returns High for known provider + known tokenizer + known model", () => {
    expect(
      scoreConfidence({ provider: "chatgpt", model: "gpt-5", tokenizer: "provider" }),
    ).toBe("High");
  });

  it("returns Medium for known provider + known tokenizer + unknown model", () => {
    expect(scoreConfidence({ provider: "gemini", tokenizer: "provider" })).toBe("Medium");
  });

  it("returns Low for unknown provider", () => {
    expect(scoreConfidence({ provider: "some-obscure-ai", tokenizer: "provider" })).toBe("Low");
  });

  it("returns Low for character heuristic tokenizer even with known provider/model", () => {
    expect(
      scoreConfidence({ provider: "claude", model: "sonnet", tokenizer: "heuristic" }),
    ).toBe("Low");
  });
});
