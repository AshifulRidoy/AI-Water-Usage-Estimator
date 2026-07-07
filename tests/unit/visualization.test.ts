import { describe, expect, it } from "vitest";
import { computeFillPercent, splitWaterValue } from "../../src/shared/utils/visualization";

describe("computeFillPercent", () => {
  it("returns 0 when value is 0", () => {
    expect(computeFillPercent(0, 1000)).toBe(0);
  });

  it("returns a proportional ratio within range", () => {
    expect(computeFillPercent(250, 1000)).toBe(0.25);
  });

  it("clamps at 1 when value exceeds the reference", () => {
    expect(computeFillPercent(5000, 1000)).toBe(1);
  });

  it("never returns a negative percent for negative values", () => {
    expect(computeFillPercent(-50, 1000)).toBe(0);
  });

  it("returns 0 when reference is 0 or negative (avoids divide-by-zero)", () => {
    expect(computeFillPercent(100, 0)).toBe(0);
    expect(computeFillPercent(100, -10)).toBe(0);
  });
});

describe("splitWaterValue", () => {
  it("shows the minimum-display floor below 0.1 mL", () => {
    expect(splitWaterValue(0.02)).toEqual({ amount: "<0.1", unit: "mL" });
  });

  it("keeps mL within normal range, rounded to 1 decimal", () => {
    expect(splitWaterValue(18.44)).toEqual({ amount: "18.4", unit: "mL" });
  });

  it("auto-converts to liters above 1000 mL", () => {
    expect(splitWaterValue(46000)).toEqual({ amount: "46", unit: "L" });
  });
});
