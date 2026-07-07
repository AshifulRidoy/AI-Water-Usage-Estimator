// Statistics repository. Per architecture.md "Storage Schema" -> statistics/history.
// Owns today/lifetime totals and the history log; the only writer of RECORD_ESTIMATE.
import { storageGet, storageSet } from "./storage";
import type { DailyTotals, EstimationResult, HistoryEntry, Statistics } from "../shared/types";

const STATISTICS_KEY = "statistics";
const MAX_HISTORY_ENTRIES = 1000;

function todayISO(now: number = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

function emptyDailyTotals(date: string): DailyTotals {
  return { date, water: 0, energy: 0, carbon: 0, prompts: 0 };
}

function freshStatistics(): Statistics {
  return {
    today: emptyDailyTotals(todayISO()),
    lifetime: { water: 0, energy: 0, carbon: 0, prompts: 0, largestPromptWater: 0 },
    history: [],
  };
}

// Exported for callers (e.g. popup hooks) that want a zero-value placeholder
// before the real statistics load. Always returns a fresh, independent object.
export function getDefaultStatistics(): Statistics {
  return freshStatistics();
}

export async function getStatistics(): Promise<Statistics> {
  const stored = await storageGet<Statistics>(STATISTICS_KEY);
  if (!stored) return freshStatistics();

  // Roll the "today" bucket over if the stored date is stale.
  const currentDate = todayISO();
  if (stored.today.date !== currentDate) {
    stored.today = emptyDailyTotals(currentDate);
  }
  return stored;
}

async function saveStatistics(stats: Statistics): Promise<void> {
  await storageSet(STATISTICS_KEY, stats);
}

export async function recordEstimate(
  entry: HistoryEntry,
  estimate: EstimationResult,
): Promise<Statistics> {
  const stats = await getStatistics();

  stats.today.water += estimate.waterML;
  stats.today.energy += estimate.energyWh;
  stats.today.carbon += estimate.carbonGrams;
  stats.today.prompts += 1;

  stats.lifetime.water += estimate.waterML;
  stats.lifetime.energy += estimate.energyWh;
  stats.lifetime.carbon += estimate.carbonGrams;
  stats.lifetime.prompts += 1;
  stats.lifetime.largestPromptWater = Math.max(
    stats.lifetime.largestPromptWater,
    estimate.waterML,
  );

  stats.history.push(entry);
  if (stats.history.length > MAX_HISTORY_ENTRIES) {
    stats.history = stats.history.slice(-MAX_HISTORY_ENTRIES);
  }

  await saveStatistics(stats);
  return stats;
}

export async function resetStatistics(): Promise<Statistics> {
  const fresh = freshStatistics();
  await saveStatistics(fresh);
  return fresh;
}
