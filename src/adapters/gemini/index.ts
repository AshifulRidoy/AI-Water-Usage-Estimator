// Gemini (gemini.google.com) adapter. See chatgpt/index.ts for the pattern this follows.
import type { AIProviderAdapter, ExtractedExchange } from "../adapter.interface";
import { getCleanText, hashText, observeUntilSettled } from "../shared";

const SELECTORS = {
  userTurn: "user-query .query-text",
  assistantTurn: "model-response .response-content, message-content",
  conversationRoot: "chat-window, main",
  streamingIndicator: ".loading-indicator, [data-streaming='true']",
};

export const GeminiAdapter: AIProviderAdapter = {
  name: "gemini",

  matches(url: string): boolean {
    return /^https:\/\/gemini\.google\.com\//.test(url);
  },

  extractPrompt(): string | undefined {
    const turns = document.querySelectorAll(SELECTORS.userTurn);
    const last = turns[turns.length - 1];
    return last ? getCleanText(last) || undefined : undefined;
  },

  extractResponse(): string | undefined {
    const turns = document.querySelectorAll(SELECTORS.assistantTurn);
    const last = turns[turns.length - 1];
    return last ? getCleanText(last) || undefined : undefined;
  },

  getResponseElement(): Element | undefined {
    const turns = document.querySelectorAll(SELECTORS.assistantTurn);
    return turns[turns.length - 1] || undefined;
  },

  responseFinished(): boolean {
    return !document.querySelector(SELECTORS.streamingIndicator);
  },

  observe(onExchange: (exchange: ExtractedExchange) => void): () => void {
    const root = document.querySelector(SELECTORS.conversationRoot) ?? document.body;

    return observeUntilSettled(root, () => {
      if (!this.responseFinished()) return;
      const responseText = this.extractResponse();
      if (!responseText) return;

      onExchange({
        promptText: this.extractPrompt(),
        responseText,
        responseId: hashText(responseText),
      });
    });
  },
};
