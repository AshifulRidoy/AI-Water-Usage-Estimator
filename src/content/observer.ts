// Content-script observer. Owns the single MutationObserver-driven subscription
// for the active page's adapter. Per architecture.md "Performance": debounce
// updates, never poll DOM, reuse observers.
import type { AIProviderAdapter, ExtractedExchange } from "../adapters/adapter.interface";

export interface ObserverHandle {
  stop: () => void;
}

/**
 * Starts observation using the given adapter. Returns a handle to stop it
 * (e.g. on navigation away, per SPA route changes within these single-page apps).
 */
export function startObserving(
  adapter: AIProviderAdapter,
  onExchange: (exchange: ExtractedExchange) => void,
): ObserverHandle {
  const stop = adapter.observe(onExchange);
  return { stop };
}
