// Adapter registry: dispatches on the current page URL to find a matching
// adapter. Per architecture.md "Error Handling": "If provider unsupported ->
// Do nothing" — getAdapterForUrl returns undefined and callers no-op.
import type { AIProviderAdapter } from "./adapter.interface";
import { ChatGPTAdapter } from "./chatgpt";
import { ClaudeAdapter } from "./claude";
import { GeminiAdapter } from "./gemini";

const ADAPTERS: AIProviderAdapter[] = [ChatGPTAdapter, ClaudeAdapter, GeminiAdapter];

export function getAdapterForUrl(url: string): AIProviderAdapter | undefined {
  return ADAPTERS.find((adapter) => adapter.matches(url));
}

export { ADAPTERS };
