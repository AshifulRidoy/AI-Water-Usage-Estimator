// Global test setup: provides a minimal in-memory mock of chrome.storage.local
// so storage/* modules can be unit tested without a real browser.
import { vi } from "vitest";

function createChromeStorageMock() {
  let store: Record<string, unknown> = {};

  return {
    storage: {
      local: {
        get: vi.fn((keys?: string | string[] | null) => {
          if (!keys) return Promise.resolve({ ...store });
          const keyList = Array.isArray(keys) ? keys : [keys];
          const result: Record<string, unknown> = {};
          for (const k of keyList) result[k] = store[k];
          return Promise.resolve(result);
        }),
        set: vi.fn((items: Record<string, unknown>) => {
          store = { ...store, ...items };
          return Promise.resolve();
        }),
        remove: vi.fn((keys: string | string[]) => {
          const keyList = Array.isArray(keys) ? keys : [keys];
          for (const k of keyList) delete store[k];
          return Promise.resolve();
        }),
        clear: vi.fn(() => {
          store = {};
          return Promise.resolve();
        }),
      },
    },
    runtime: {
      sendMessage: vi.fn(),
      onMessage: { addListener: vi.fn(), removeListener: vi.fn() },
      lastError: undefined,
    },
  };
}

(globalThis as unknown as { chrome: unknown }).chrome = createChromeStorageMock();
