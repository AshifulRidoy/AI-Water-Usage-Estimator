// Typed message router for the background service worker. Per architecture.md
// "Messaging": "Use message passing only. Never access storage directly from
// popup. Popup requests data from background. Background returns state."
import { getSettings, updateSettings } from "../storage/settings";
import { getStatistics, recordEstimate, resetStatistics } from "../storage/statistics";
import { logError } from "../shared/utils/logger";
import type { ExtensionMessage, ExtensionMessageResponse } from "../shared/types";

export async function handleMessage(
  message: ExtensionMessage,
): Promise<ExtensionMessageResponse> {
  try {
    switch (message.type) {
      case "GET_SETTINGS":
        return { ok: true, data: await getSettings() };

      case "SET_SETTINGS":
        return { ok: true, data: await updateSettings(message.payload) };

      case "GET_STATISTICS":
        return { ok: true, data: await getStatistics() };

      case "RECORD_ESTIMATE":
        return {
          ok: true,
          data: await recordEstimate(message.payload.entry, message.payload.estimate),
        };

      case "RESET_STATISTICS":
        return { ok: true, data: await resetStatistics() };

      default:
        return { ok: false, error: "Unknown message type" };
    }
  } catch (error) {
    logError("Message handling failed", error);
    return { ok: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
