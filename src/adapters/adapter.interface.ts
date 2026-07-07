// Adapter contract. Per architecture.md "Adapter Pattern":
// adapters know DOM selectors/containers/streaming behavior and NEVER perform
// calculations. Every provider (chatgpt/claude/gemini, and future ones) implements this.
import type { ProviderId } from "../shared/types";

export interface ExtractedExchange {
  promptText?: string;
  responseText: string;
  responseId: string;
  model?: string;
}

export interface AIProviderAdapter {
  readonly name: ProviderId;

  /** Whether this adapter should activate for the given page URL. */
  matches(url: string): boolean;

  /**
   * Starts observing the page for new exchanges. Returns an unsubscribe function.
   * Implementations must debounce internally and must never poll.
   */
  observe(onExchange: (exchange: ExtractedExchange) => void): () => void;

  /** Extracts the most recent user prompt text, if identifiable. */
  extractPrompt(): string | undefined;

  /** Extracts the most recent assistant response text. */
  extractResponse(): string | undefined;

  /** Returns the DOM element of the most recent assistant turn, for badge injection. */
  getResponseElement(): Element | undefined;

  /** Returns true once streaming for the current response has completed. */
  responseFinished(): boolean;
}
