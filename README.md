# AI Water Usage Estimator

A browser extension that estimates the water, energy, and carbon footprint of your AI chat
usage on ChatGPT, Claude, and Gemini — displayed inline after every response, with a
popup dashboard, settings, and a methodology page. Local-first: no accounts, no cloud sync,
no telemetry, no backend.

Built per `PRD.md`, `PLAN.md`, `architecture.md`, and `ESTIMATION.md`. See `roadmap.md` for
the full build checklist and known limitations.

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

This starts Vite in watch/HMR mode via the CRXJS plugin. Load the `dist/` folder as an
unpacked extension (see below) and it will hot-reload as you edit.

## Build

```bash
npm run build
```

Produces a complete, loadable extension in `dist/`.

## Load the extension in Chrome/Edge/Brave

1. Run `npm run build` (or `npm run dev` for a live-reloading dev build).
2. Open `chrome://extensions` (or the equivalent in your browser).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `dist/` folder.
5. Visit chatgpt.com, claude.ai, or gemini.google.com and send a message — a small
   💧 badge should appear under the response.

## Tests

```bash
npm run test        # unit tests (Vitest) — estimator, tokenizer, confidence, storage
npm run lint         # ESLint
npm run test:e2e     # Playwright E2E specs (requires a live browser + network access
                      # to the AI sites; not runnable in fully sandboxed CI — see roadmap.md)
```

## Project layout

See `architecture.md` for the full rationale. Short version:

- `src/estimator/` — pure calculation engine (no DOM/browser/storage dependencies)
- `src/tokenizer/` — token counting (character-heuristic fallback; provider tokenizers are v2)
- `src/storage/` — chrome.storage.local repositories (settings, statistics)
- `src/adapters/` — one folder per AI site, isolating DOM selectors
- `src/content/` — observer/parser/renderer wiring adapters → estimator → storage → UI
- `src/background/` — service worker + typed message router
- `src/popup/`, `src/options/`, `src/methodology/` — the three extension pages
- `src/ui/` — shared React components + theme

## Privacy & security

- No prompts or responses are ever transmitted anywhere.
- No analytics, telemetry, or tracking of any kind.
- Only `storage` permission plus host access to the three supported AI sites.
- All calculations run locally in the content script / background service worker.

## Status

MVP scope from `PLAN.md` is implemented: inline badge, popup dashboard (today/lifetime/
history/trend chart), settings page, methodology page, and adapters for ChatGPT, Claude,
and Gemini. See `roadmap.md` for the itemized checklist and what's explicitly out of
scope for this pass (provider-specific tokenizers, live E2E runs, store submission).
