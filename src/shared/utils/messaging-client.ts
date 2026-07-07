// Thin client wrapper around chrome.runtime.sendMessage. Used by content
// scripts, popup, and options — none of which touch chrome.storage.local
// directly, per architecture.md "Messaging".
import { logError } from "./logger";
import type { ExtensionMessage, ExtensionMessageResponse } from "../types";

export async function sendExtensionMessage(
  message: ExtensionMessage,
): Promise<ExtensionMessageResponse> {
  try {
    return await chrome.runtime.sendMessage(message);
  } catch (error) {
    logError("Failed to reach background service worker", error);
    return { ok: false, error: "Failed to reach background service worker" };
  }
}
