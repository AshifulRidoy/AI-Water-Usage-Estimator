// Response parser. Delegates all DOM knowledge to the matched adapter (content
// layer "Never performs calculations", architecture.md). Owns the response-hash
// cache so unchanged responses are never re-processed (architecture.md "Caching").
import type { ExtractedExchange } from "../adapters/adapter.interface";
import type { ProviderId, ResponseData } from "../shared/types";

const seenResponseIds = new Set<string>();

export function parseExchange(
  provider: ProviderId,
  exchange: ExtractedExchange,
): ResponseData | undefined {
  if (seenResponseIds.has(exchange.responseId)) {
    return undefined; // Already processed — avoid recalculating unchanged responses.
  }
  seenResponseIds.add(exchange.responseId);

  return {
    provider,
    model: exchange.model,
    promptText: exchange.promptText,
    responseText: exchange.responseText,
    responseId: exchange.responseId,
    timestamp: Date.now(),
  };
}
