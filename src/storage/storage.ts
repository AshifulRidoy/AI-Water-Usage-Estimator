// Low-level chrome.storage.local wrapper. Per architecture.md "Storage":
// "Never accessed directly by UI. Always use repository methods." This file
// is the only place that talks to chrome.storage.local directly; settings.ts
// and statistics.ts are the repositories built on top of it.

export async function storageGet<T>(key: string): Promise<T | undefined> {
  const result = await chrome.storage.local.get(key);
  return result[key] as T | undefined;
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  await chrome.storage.local.set({ [key]: value });
}

export async function storageRemove(key: string): Promise<void> {
  await chrome.storage.local.remove(key);
}
