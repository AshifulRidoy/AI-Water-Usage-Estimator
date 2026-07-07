import { describe, expect, it } from "vitest";
import { getProviderLabel } from "../../src/shared/constants/providers";

describe("getProviderLabel", () => {
  it("maps known provider ids to their display names", () => {
    expect(getProviderLabel("chatgpt")).toBe("ChatGPT");
    expect(getProviderLabel("claude")).toBe("Claude");
    expect(getProviderLabel("gemini")).toBe("Gemini");
  });

  it("falls back to a generic label for unknown providers", () => {
    expect(getProviderLabel("unknown")).toBe("Unknown AI");
  });
});
