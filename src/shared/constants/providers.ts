// Human-readable display names for each provider id. The raw id (ProviderId)
// is what gets stored (history, badges' internal state) — this map is only
// consulted at render time, so relabeling later never requires a data migration.
import type { ProviderId } from "../types";

export const PROVIDER_LABELS: Record<ProviderId, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  unknown: "Unknown AI",
};

export function getProviderLabel(provider: ProviderId): string {
  return PROVIDER_LABELS[provider] ?? PROVIDER_LABELS.unknown;
}
