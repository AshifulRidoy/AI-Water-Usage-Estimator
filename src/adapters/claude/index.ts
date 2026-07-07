// Claude (claude.ai) adapter. See chatgpt/index.ts for the pattern this follows.
import type { AIProviderAdapter, ExtractedExchange } from "../adapter.interface";
import { getCleanText, hashText, observeUntilSettled } from "../shared";

const SELECTORS = {
  humanTurn: '[data-testid="user-message"]',
  assistantTurn: '[data-testid="assistant-message"], .font-claude-message',
  conversationRoot: "main",
  streamingIndicator: '[data-is-streaming="true"]',
};

export const ClaudeAdapter: AIProviderAdapter = {
  name: "claude",

  matches(url: string): boolean {
    return /^https:\/\/claude\.ai\//.test(url);
  },

  extractPrompt(): string | undefined {
    const turns = document.querySelectorAll(SELECTORS.humanTurn);
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
