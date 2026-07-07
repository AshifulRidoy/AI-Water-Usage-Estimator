// Background service worker entry point. Owns storage/settings/calculations
// per architecture.md high-level architecture diagram. Stateless beyond the
// storage repositories themselves — safe to be evicted/restarted by the browser.
import { handleMessage } from "./messaging";
import type { ExtensionMessage } from "../shared/types";

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse);
  return true; // keep the message channel open for the async response
});

chrome.runtime.onInstalled.addListener(() => {
  // No telemetry, no network calls — purely local initialization hook.
  // (Intentionally left minimal; defaults are lazily created by the storage
  // repositories on first read.)
});
