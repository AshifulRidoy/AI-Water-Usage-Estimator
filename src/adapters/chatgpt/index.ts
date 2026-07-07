// ChatGPT adapter. DOM selectors are isolated here per architecture.md —
// "Adding a new provider should require: 1. Create adapter 2. Register adapter
// 3. Provide selectors. No other code changes." If chatgpt.com changes its DOM,
// only this file needs updating.
import type { AIProviderAdapter, ExtractedExchange } from "../adapter.interface";
import { getCleanText, hashText, observeUntilSettled } from "../shared";

// Selectors are intentionally conservative/attribute-based where possible,
// since class names on chatgpt.com change frequently.
const SELECTORS = {
  turnContainer: "[data-message-author-role]",
  assistantTurn: '[data-message-author-role="assistant"]',
  userTurn: '[data-message-author-role="user"]',
  conversationRoot: "main",
};

export const ChatGPTAdapter: AIProviderAdapter = {
  name: "chatgpt",

  matches(url: string): boolean {
    return /^https:\/\/(chatgpt\.com|chat\.openai\.com)\//.test(url);
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
    // Streaming indicator on chatgpt.com typically disables the composer's
    // stop/submit button; absence of any "stop generating" affordance implies done.
    return !document.querySelector('[data-testid="stop-button"]');
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
