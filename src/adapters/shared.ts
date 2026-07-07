// Shared helpers used by every provider adapter. Kept out of adapter.interface.ts
// so the contract itself stays a pure type definition.

const BADGE_CONTAINER_SELECTOR = ".aiwe-badge-container";

/** Cheap, fast, deterministic string hash — used as the responseId for caching/dedup. */
export function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (Math.imul(31, hash) + text.charCodeAt(i)) | 0;
  }
  return `h${hash}_${text.length}`;
}

/**
 * Reads an element's text content with any of our own injected badge/tooltip
 * nodes stripped out first. Without this, injecting a badge into a turn
 * element changes that turn's textContent, which would otherwise look like
 * "the response changed" on the very next mutation — see observeUntilSettled.
 */
export function getCleanText(element: Element): string {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll(BADGE_CONTAINER_SELECTOR).forEach((node) => node.remove());
  return clone.textContent?.trim() ?? "";
}

function isBadgeElement(node: Node): boolean {
  return node instanceof Element && node.matches(BADGE_CONTAINER_SELECTOR);
}

function isInsideBadge(node: Node): boolean {
  const el = node instanceof Element ? node : node.parentElement;
  return el ? el.closest(BADGE_CONTAINER_SELECTOR) !== null : false;
}

/**
 * True if every mutation record is entirely explained by our own badge
 * injection — either the mutation happened inside an existing badge
 * container (e.g. setting its text), or the only nodes added/removed *are*
 * badge containers themselves (e.g. the initial appendChild into a turn).
 */
function isSelfCausedMutation(mutations: MutationRecord[]): boolean {
  return mutations.every((mutation) => {
    if (isInsideBadge(mutation.target)) return true;

    const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
    if (changedNodes.length === 0) return false;
    return changedNodes.every((node) => isBadgeElement(node) || isInsideBadge(node));
  });
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

/**
 * Watches a container element for mutations and invokes `onSettled` once the
 * text content stops changing for `quietMs` — a simple, DOM-agnostic way to
 * detect "streaming response finished" without polling.
 *
 * Mutations caused solely by our own badge injection are ignored, so
 * rendering a badge never re-triggers itself (see getCleanText for the
 * matching fix on the read side).
 */
export function observeUntilSettled(
  container: Element,
  onSettled: (text: string) => void,
  quietMs = 800,
): () => void {
  const debounced = debounce((text: string) => onSettled(text), quietMs);

  const observer = new MutationObserver((mutations) => {
    if (isSelfCausedMutation(mutations)) return;
    debounced(getCleanText(container));
  });

  observer.observe(container, { childList: true, subtree: true, characterData: true });

  // Fire once immediately in case content is already present and static.
  debounced(getCleanText(container));

  return () => observer.disconnect();
}
