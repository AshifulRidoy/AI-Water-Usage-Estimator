// Low-level DOM injection helpers. Per architecture.md "Error Handling":
// content-layer failures must never throw uncaught — every export here
// swallows and logs instead of throwing.
import { logDebug } from "../shared/utils/logger";

const BADGE_CONTAINER_CLASS = "aiwe-badge-container";

/** Finds (or is given) the assistant turn element and returns a place to inject the badge. */
export function ensureBadgeContainer(turnElement: Element, responseId: string): HTMLElement | undefined {
  try {
    const existing = turnElement.querySelector<HTMLElement>(
      `.${BADGE_CONTAINER_CLASS}[data-response-id="${responseId}"]`,
    );
    if (existing) return existing;

    const container = document.createElement("div");
    container.className = BADGE_CONTAINER_CLASS;
    container.setAttribute("data-response-id", responseId);
    turnElement.appendChild(container);
    return container;
  } catch (error) {
    logDebug("Failed to inject badge container", error);
    return undefined;
  }
}

export function clearContainer(container: HTMLElement): void {
  try {
    container.innerHTML = "";
  } catch (error) {
    logDebug("Failed to clear badge container", error);
  }
}
