// Central logger. Per architecture.md "Logging": verbose in development,
// errors-only in production, with a configurable debug mode.
/// <reference types="vite/client" />
let debugModeEnabled = false;

export function setDebugMode(enabled: boolean): void {
  debugModeEnabled = enabled;
}

const isDev = import.meta.env?.DEV ?? false;

export function logDebug(message: string, ...details: unknown[]): void {
  if (isDev || debugModeEnabled) {
    // eslint-disable-next-line no-console
    console.debug(`[AI Water Estimator] ${message}`, ...details);
  }
}

export function logError(message: string, error?: unknown): void {
  // Errors are always logged, even in production, per architecture.md.
  // eslint-disable-next-line no-console
  console.error(`[AI Water Estimator] ${message}`, error);
}
