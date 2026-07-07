import { describe, expect, it } from "vitest";
import { estimateWater, EstimationValidationError, getConfig } from "../../src/estimator";
import type { EstimationInput } from "../../src/shared/types";

function baseInput(overrides: Partial<EstimationInput> = {}): EstimationInput {
  return {
    provider: "claude",
    model: "claude-sonnet-5",
    inputTokens: 100,
    outputTokens: 200,
    tokenizer: "provider",
    timestamp: Date.now(),
    ...overrides,
  };
}

describe("estimateWater", () => {
  it("is deterministic: same input -> same output", () => {
    const input = baseInput();
    const a = estimateWater(input);
    const b = estimateWater(input);
    expect(a).toEqual(b);
  });

  it("handles zero tokens", () => {
    const outcome = estimateWater(baseInput({ inputTokens: 0, outputTokens: 0 }));
    expect(outcome.status).toBe("ok");
    if (outcome.status === "ok") {
      expect(outcome.result.waterML).toBe(0);
      expect(outcome.result.energyWh).toBe(0);
      expect(outcome.result.carbonGrams).toBe(0);
    }
  });

  it("handles large responses", () => {
    const outcome = estimateWater(baseInput({ inputTokens: 50_000, outputTokens: 100_000 }));
    expect(outcome.status).toBe("ok");
    if (outcome.status === "ok") {
      const config = getConfig("claude");
      const expectedEnergy = 150_000 * config.ENERGY_PER_TOKEN;
      expect(outcome.result.energyWh).toBeCloseTo(expectedEnergy, 10);
    }
  });

  it("computes water/energy/carbon from configurable constants", () => {
    const outcome = estimateWater(baseInput({ inputTokens: 100, outputTokens: 100 }));
    const config = getConfig("claude");
    if (outcome.status === "ok") {
      const energy = 200 * config.ENERGY_PER_TOKEN;
      expect(outcome.result.energyWh).toBeCloseTo(energy, 10);
      expect(outcome.result.waterML).toBeCloseTo(energy * config.WATER_PER_WH, 10);
      expect(outcome.result.carbonGrams).toBeCloseTo(energy * config.CARBON_PER_WH, 10);
    } else {
      throw new Error("expected ok outcome");
    }
  });

  it("returns unavailable for unknown/missing provider", () => {
    const outcome = estimateWater(baseInput({ provider: "" }));
    expect(outcome.status).toBe("unavailable");
  });

  it("treats an unrecognized provider string as low confidence, not an error", () => {
    const outcome = estimateWater(baseInput({ provider: "some-new-ai", model: undefined }));
    expect(outcome.status).toBe("ok");
    if (outcome.status === "ok") expect(outcome.result.confidence).toBe("Low");
  });

  it("returns unavailable when model is missing (still ok, but confidence drops)", () => {
    const outcome = estimateWater(baseInput({ model: undefined }));
    expect(outcome.status).toBe("ok");
    if (outcome.status === "ok") expect(outcome.result.confidence).toBe("Medium");
  });

  it("throws EstimationValidationError for negative input tokens", () => {
    expect(() => estimateWater(baseInput({ inputTokens: -1 }))).toThrow(
      EstimationValidationError,
    );
  });

  it("throws EstimationValidationError for negative output tokens", () => {
    expect(() => estimateWater(baseInput({ outputTokens: -5 }))).toThrow(
      EstimationValidationError,
    );
  });

  it("returns unavailable for NaN token counts", () => {
    const outcome = estimateWater(baseInput({ inputTokens: NaN }));
    expect(outcome.status).toBe("unavailable");
  });

  it("returns unavailable when tokenizer is missing", () => {
    const outcome = estimateWater(baseInput({ tokenizer: undefined }));
    expect(outcome.status).toBe("unavailable");
  });

  it("returns unavailable when timestamp is missing", () => {
    const outcome = estimateWater(baseInput({ timestamp: undefined }));
    expect(outcome.status).toBe("unavailable");
  });

  it("stamps every result with the current estimationVersion", () => {
    const outcome = estimateWater(baseInput());
    if (outcome.status === "ok") {
      expect(outcome.result.estimationVersion).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });
});
