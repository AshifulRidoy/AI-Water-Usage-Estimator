// Content script entry point. Wires:
//   adapter (DOM) -> tokenizer -> estimator -> storage (via background) -> renderer
// Per architecture.md "Response Flow" and "Error Handling": unsupported
// providers no-op silently, parse failures are debug-logged, estimation
// failures render "Unavailable", and nothing here ever throws uncaught.
import { getAdapterForUrl } from "../adapters/registry";
import { startObserving } from "./observer";
import { parseExchange } from "./parser";
import { renderEstimate, renderUnavailable } from "./renderer";
import { estimateTokens } from "../tokenizer/tokenizer";
import { estimateWater } from "../estimator";
import { sendExtensionMessage } from "../shared/utils/messaging-client";
import { logDebug, logError, setDebugMode } from "../shared/utils/logger";
import type { ExtractedExchange } from "../adapters/adapter.interface";
import type { HistoryEntry, ProviderId, Settings } from "../shared/types";

async function handleExchange(
  provider: ProviderId,
  exchange: ExtractedExchange,
  settings: Settings,
): Promise<void> {
  const parsed = parseExchange(provider, exchange);
  if (!parsed) return; // already processed, or no adapter matched

  const responseElement = adapterRef?.getResponseElement();
  if (!responseElement) {
    logDebug("No response element found to attach badge to");
    return;
  }

  try {
    const inputTokens = parsed.promptText ? estimateTokens(parsed.promptText, provider) : {
      tokens: 0,
      kind: "heuristic" as const,
    };
    const outputTokens = estimateTokens(parsed.responseText, provider);

    const outcome = estimateWater({
      provider: parsed.provider,
      model: parsed.model,
      inputTokens: inputTokens.tokens,
      outputTokens: outputTokens.tokens,
      tokenizer: outputTokens.kind,
      timestamp: parsed.timestamp,
    });

    if (outcome.status === "unavailable") {
      logDebug("Estimation unavailable", outcome.reason);
      renderUnavailable(responseElement, parsed.responseId, provider);
      return;
    }

    renderEstimate(responseElement, parsed.responseId, provider, outcome.result, {
      showTooltip: settings.showTooltip,
      showConfidence: settings.showConfidence,
    });

    const entry: HistoryEntry = {
      date: new Date(parsed.timestamp).toISOString().slice(0, 10),
      provider: parsed.provider,
      water: outcome.result.waterML,
      tokens: inputTokens.tokens + outputTokens.tokens,
    };

    await sendExtensionMessage({
      type: "RECORD_ESTIMATE",
      payload: { entry, estimate: outcome.result },
    });
  } catch (error) {
    // estimator throws EstimationValidationError for negative tokens — never
    // let that (or anything else) escape the content script uncaught.
    logError("Estimation failed unexpectedly", error);
    renderUnavailable(responseElement, parsed.responseId, provider);
  }
}

let adapterRef: ReturnType<typeof getAdapterForUrl>;

async function init(): Promise<void> {
  const adapter = getAdapterForUrl(window.location.href);
  if (!adapter) return; // Unsupported provider: do nothing (architecture.md).
  adapterRef = adapter;

  const settingsResponse = await sendExtensionMessage({ type: "GET_SETTINGS" });
  const settings: Settings | undefined =
    settingsResponse.ok && settingsResponse.data && "enabled" in settingsResponse.data
      ? (settingsResponse.data as Settings)
      : undefined;

  if (!settings || !settings.enabled) return;
  setDebugMode(settings.debugMode);

  startObserving(adapter, (exchange) => {
    void handleExchange(adapter.name, exchange, settings);
  });
}

void init();
