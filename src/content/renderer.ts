// Renders the inline badge + tooltip for a response. Uses plain DOM (not React)
// for performance — a full React root per response would add unnecessary
// overhead for what's essentially static, cheap-to-update markup (architecture.md
// "Performance": minimize DOM mutations, <10ms calculation budget).
import { ensureBadgeContainer } from "./injector";
import { formatWaterBadge, formatCarbonG, formatEnergyWh } from "../shared/utils/format";
import { getProviderLabel } from "../shared/constants/providers";
import { logDebug } from "../shared/utils/logger";
import type { EstimationResult, ProviderId } from "../shared/types";

// Simple cache so an unchanged response is never re-rendered (architecture.md "Caching").
const lastRenderedByResponseId = new Map<string, string>();

export interface RenderOptions {
  showTooltip: boolean;
  showConfidence: boolean;
}

function buildTooltipContent(
  provider: ProviderId,
  result: EstimationResult,
  showConfidence: boolean,
): string {
  const lines = [
    `AI: ${getProviderLabel(provider)}`,
    `Water: ${formatWaterBadge(result.waterML)}`,
    `Energy: ${formatEnergyWh(result.energyWh)}`,
    `Carbon: ${formatCarbonG(result.carbonGrams)}`,
  ];
  if (showConfidence) lines.push(`Confidence: ${result.confidence}`);
  lines.push("Estimated, not measured. See Methodology.");
  return lines.join("\n");
}

export function renderEstimate(
  turnElement: Element,
  responseId: string,
  provider: ProviderId,
  result: EstimationResult,
  options: RenderOptions,
): void {
  try {
    const cacheKey = `${responseId}:${result.waterML}`;
    if (lastRenderedByResponseId.get(responseId) === cacheKey) return; // unchanged, skip
    lastRenderedByResponseId.set(responseId, cacheKey);

    const container = ensureBadgeContainer(turnElement, responseId);
    if (!container) return;

    container.textContent = formatWaterBadge(result.waterML);
    container.setAttribute("role", "status");
    container.setAttribute(
      "aria-label",
      `Estimated water usage for this ${getProviderLabel(provider)} response`,
    );

    if (options.showTooltip) {
      container.title = buildTooltipContent(provider, result, options.showConfidence);
    } else {
      container.removeAttribute("title");
    }
  } catch (error) {
    logDebug("Failed to render estimate badge", error);
  }
}

/** Renders the "Unavailable" state per architecture.md "Error Handling". */
export function renderUnavailable(
  turnElement: Element,
  responseId: string,
  provider: ProviderId,
): void {
  try {
    const container = ensureBadgeContainer(turnElement, responseId);
    if (!container) return;
    container.textContent = "\u{1F4A7} Unavailable";
    container.title = `AI: ${getProviderLabel(provider)}\nThis response's water usage could not be estimated.`;
  } catch (error) {
    logDebug("Failed to render unavailable state", error);
  }
}
