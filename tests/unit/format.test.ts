import { describe, expect, it } from "vitest";
import { formatCarbonG, formatEnergyWh, formatWaterML } from "../../src/shared/utils/format";
import { convertCarbon, convertEnergy, convertWater } from "../../src/shared/utils/units";

describe("formatWaterML", () => {
  it("shows the minimum display floor below 0.1 mL, never 0 mL", () => {
    expect(formatWaterML(0.02)).toBe("\u2248 <0.1 mL");
  });

  it("rounds to 1 decimal within normal range", () => {
    expect(formatWaterML(18.44)).toBe("\u2248 18.4 mL");
  });

  it("auto-converts to liters above 1000 mL", () => {
    expect(formatWaterML(1250)).toBe("\u2248 1.25 L");
  });

  it("always includes the approx prefix", () => {
    expect(formatWaterML(5)).toMatch(/^\u2248/);
  });
});

describe("formatEnergyWh / formatCarbonG", () => {
  it("rounds energy to 2 decimals", () => {
    expect(formatEnergyWh(0.1257)).toBe("\u2248 0.13 Wh");
  });

  it("rounds carbon to 2 decimals", () => {
    expect(formatCarbonG(0.0912)).toBe("\u2248 0.09 g");
  });
});

describe("unit conversions", () => {
  it("converts water mL -> L -> flOz correctly", () => {
    expect(convertWater(1000, "L")).toBe(1);
    expect(convertWater(2000, "mL")).toBe(2000);
    expect(convertWater(29.5735, "flOz")).toBeCloseTo(1, 5);
  });

  it("converts energy Wh -> kWh", () => {
    expect(convertEnergy(1000, "kWh")).toBe(1);
  });

  it("converts carbon g -> kg", () => {
    expect(convertCarbon(1000, "kg")).toBe(1);
  });
});
