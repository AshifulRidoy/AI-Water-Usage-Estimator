import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, getSettings, updateSettings } from "../../src/storage/settings";
import { getStatistics, recordEstimate, resetStatistics } from "../../src/storage/statistics";
import type { EstimationResult, HistoryEntry } from "../../src/shared/types";

beforeEach(async () => {
  await chrome.storage.local.clear();
});

describe("settings repository", () => {
  it("returns defaults when nothing is stored", async () => {
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("merges partial updates without clobbering unrelated fields", async () => {
    await updateSettings({ theme: "dark" });
    const settings = await updateSettings({ units: { water: "L", energy: "Wh", carbon: "g" } });
    expect(settings.theme).toBe("dark");
    expect(settings.units.water).toBe("L");
  });
});

describe("statistics repository", () => {
  const fakeEstimate: EstimationResult = {
    waterML: 18.4,
    energyWh: 0.13,
    carbonGrams: 0.09,
    confidence: "High",
    estimationVersion: "1.0.0",
  };
  const fakeEntry: HistoryEntry = {
    date: new Date().toISOString().slice(0, 10),
    provider: "claude",
    water: fakeEstimate.waterML,
    tokens: 300,
  };

  it("starts at zero", async () => {
    const stats = await getStatistics();
    expect(stats.lifetime.water).toBe(0);
    expect(stats.history).toHaveLength(0);
  });

  it("accumulates today + lifetime totals and appends history", async () => {
    await recordEstimate(fakeEntry, fakeEstimate);
    const stats = await recordEstimate(fakeEntry, fakeEstimate);

    expect(stats.today.water).toBeCloseTo(36.8, 5);
    expect(stats.lifetime.prompts).toBe(2);
    expect(stats.history).toHaveLength(2);
  });

  it("tracks the largest single prompt", async () => {
    await recordEstimate(fakeEntry, { ...fakeEstimate, waterML: 5 });
    const stats = await recordEstimate(fakeEntry, { ...fakeEstimate, waterML: 50 });
    expect(stats.lifetime.largestPromptWater).toBe(50);
  });

  it("resets all totals and history", async () => {
    await recordEstimate(fakeEntry, fakeEstimate);
    const stats = await resetStatistics();
    expect(stats.lifetime.water).toBe(0);
    expect(stats.history).toHaveLength(0);
  });
});
