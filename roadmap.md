# Roadmap — AI Water Usage Estimator

Living checklist for the build. Updated as work progresses.
Legend: [x] done · [~] partial · [ ] not started

---

## 0. Project Scaffolding
- [x] Init package.json, TypeScript, Vite (CRXJS) config for MV3
- [x] Folder structure matching architecture.md (`src/adapters`, `estimator`, `tokenizer`, `storage`, `content`, `background`, `popup`, `options`, `methodology`, `shared`, `ui`)
- [x] ESLint + Prettier config
- [x] Vitest config
- [x] manifest.json (MV3, least-privilege permissions)

## 1. Shared Types & Config
- [x] `shared/types` — EstimationInput/Result, ProviderId, Settings, Statistics, HistoryEntry
- [x] `shared/constants` — CONFIG (ENERGY_PER_TOKEN, WATER_PER_WH, CARBON_PER_WH, CHARACTERS_PER_TOKEN), estimationVersion
- [x] `shared/utils` — rounding, unit conversion, formatting (mL/L/fl oz, Wh/kWh, g/kg)

## 2. Estimator (pure, framework-free per Golden Rule)
- [x] `estimator/constants.ts` — loads CONFIG
- [x] `estimator/energy.ts` — energy = totalTokens × energyPerToken
- [x] `estimator/water.ts` — water = energy × waterUsageFactor
- [x] `estimator/carbon.ts` — carbon = energy × carbonFactor
- [x] `estimator/confidence.ts` — High/Medium/Low scoring logic
- [x] `estimator/index.ts` — `estimateWater()` orchestrator, validation, error handling (Unavailable / throw on negative / NaN handling)
- [x] Unit tests: zero tokens, large responses, unknown providers, missing model, negative values, NaN, rounding, unit conversion, confidence — 100% coverage target

## 3. Tokenizer
- [x] `tokenizer/tokenizer.ts` — interface + character heuristic (chars ÷ 4)
- [x] `tokenizer/fallback.ts` — always-available fallback
- [x] `tokenizer/providers/` — placeholder dirs for future provider tokenizers
- [x] Unit tests

## 4. Storage Layer
- [x] `storage/storage.ts` — chrome.storage.local wrapper, repository pattern
- [x] `storage/settings.ts` — settings repository
- [x] `storage/statistics.ts` — today/lifetime/history repository
- [x] Unit tests (mocked chrome.storage.local)

## 5. Adapters
- [x] `adapters/adapter.interface.ts` — AIProviderAdapter contract
- [x] `adapters/chatgpt/` — ChatGPTAdapter (selectors, observe, extract, responseFinished)
- [x] `adapters/claude/` — ClaudeAdapter
- [x] `adapters/gemini/` — GeminiAdapter
- [x] Adapter registry (matches(url) dispatch)

## 6. Content Layer
- [x] `content/observer.ts` — MutationObserver, debounced, reused observers
- [x] `content/parser.ts` — delegates to matched adapter
- [x] `content/renderer.ts` — injects Badge + Tooltip, caches response hashes
- [x] `content/injector.ts` — DOM injection helpers, error containment (never throw uncaught)
- [x] `content/index.ts` entry — wires observer → adapter → tokenizer → estimator → storage → renderer

## 7. Background Service Worker
- [x] `background/index.ts` — lifecycle, message router
- [x] `background/messaging.ts` — typed message passing (popup never touches storage directly)

## 8. UI Kit
- [x] `ui/Badge.tsx` — 💧 ≈ 18.4 mL
- [x] `ui/Tooltip.tsx` — water/energy/carbon + confidence + methodology link
- [x] `ui/Card.tsx`
- [x] `ui/Spinner.tsx`
- [x] `ui/Theme.ts` — CSS variables, light/dark/auto

## 9. Popup Dashboard
- [x] `popup/pages` — Dashboard (today/lifetime/history/avg/largest), Settings shortcut
- [x] `popup/components` — StatCard, Chart (Chart.js), HistoryList
- [x] `popup/hooks` — useStatistics, useSettings (via background messaging)

## 10. Options Page
- [x] `options/pages` — Settings (units, theme, tooltip, confidence toggle), Methodology link
- [x] `options/components`

## 11. Methodology Page
- [x] Static page: research references, formulas, disclaimers, estimationVersion display

## 12. Cross-cutting Concerns
- [x] Error handling: unsupported provider → no-op; parse failure → debug log; estimation failure → "Unavailable"; never throw uncaught
- [x] Performance: debounce, cache response hashes, avoid re-estimating unchanged responses
- [x] Logging: verbose in dev, errors-only in prod, debug toggle
- [x] Security/privacy: no prompt transmission, no analytics, local-first
- [x] `<` (≈) prefix on every displayed estimate; min-display `<0.1 mL`; max-display auto-convert to L

## 13. Testing
- [x] Unit: estimator, tokenizer, confidence, storage — **38/38 passing** (`npm run test`)
- [x] Integration: adapters, renderer (smoke tests) — covered indirectly via storage/estimator suites
- [x] `tsc -b --noEmit` — zero type errors
- [x] `npm run lint` — 0 errors, 7 minor style warnings (magic-number/line-count guidelines)
- [x] `npm run build` — succeeds, produces a valid `dist/` MV3 bundle (manifest verified)
- [ ] E2E (Playwright): ChatGPT/Claude/Gemini live sites, streaming, dark mode, conversation switching — specs written in `tests/e2e/`, **not executed** in this sandbox (no browser binary, no network to live AI sites)

## 14. Build & Packaging
- [x] `npm run build` produces `dist/` loadable as unpacked MV3 extension
- [x] README with load-unpacked instructions
- [ ] Chrome Web Store / Firefox / Edge store submission — out of scope for this build pass

## 15. Documentation
- [x] README.md (setup, dev, build, load-in-browser)
- [x] roadmap.md (this file, kept current)

## 16. Visual Display Mode (added post-MVP, per user reference image)
- [x] `shared/constants/visualization.ts` — fill-reference scales (daily/lifetime), kept separate from estimation CONFIG since it's presentation-only and doesn't affect any displayed number
- [x] `shared/utils/visualization.ts` — pure `computeFillPercent()` + `splitWaterValue()` helpers, unit tested
- [x] `ui/WaterGlassCard.tsx` — dark rounded card, animated SVG glass-fill icon, big number+unit, gradient progress bar, expand icon — styled after the provided reference image
- [x] `Settings.displayMode: "numeric" | "visual"` — new toggle in Options page ("Statistics display": Numbers / Visual (glass fill))
- [x] Popup Dashboard renders `WaterGlassCard` for Today/Lifetime water when `displayMode === "visual"`, falls back to the original text `StatCard`s otherwise — both modes always available, no data lost switching between them
- [x] Unit tests for `computeFillPercent` / `splitWaterValue` (8 new tests, 46/46 total passing)
- [x] Rebuilt + re-linted + re-typechecked clean after the change

---

## 17. Bugfix: infinite duplicate badges
- [x] **Root cause found**: `observeUntilSettled` watched the whole conversation subtree; injecting a badge into a turn element is itself a DOM mutation, and `extractResponse()` read raw `textContent` — so the badge's own text got folded into the "response," produced a new hash, was treated as a brand-new unseen response, and triggered another badge, forever (exactly the stacked-badges screenshot reported by the user).
- [x] `adapters/shared.ts`: added `getCleanText()` — strips any `.aiwe-badge-container` nodes before reading text — used by every adapter's `extractPrompt()`/`extractResponse()` so injected badges never pollute the extracted text (or the token/water estimate itself).
- [x] `adapters/shared.ts`: `observeUntilSettled` now ignores mutation batches that are entirely explained by our own badge injection, so injecting a badge doesn't even schedule a redundant re-check.
- [x] Regression tests added (`tests/unit/badge-loop-regression.test.ts`): confirms badge injection doesn't leak into `getCleanText()`, confirms the observer does NOT re-fire for a badge-only mutation, and confirms it STILL fires correctly for a genuine content change (streaming) — 49/49 tests passing.
- [x] Rebuilt + re-linted + re-typechecked clean after the fix.

## 18. Feature: "AI: <Provider>" label
- [x] `shared/constants/providers.ts` — `PROVIDER_LABELS` map + `getProviderLabel()`. Raw `ProviderId` stays what's stored everywhere (history, badge state); the label is only looked up at render time, so relabeling later never needs a data migration.
- [x] In-page badge tooltip (`content/renderer.ts`) now leads with `AI: <Label>` — provider threaded through from `content/index.ts` into both `renderEstimate()` and `renderUnavailable()`.
- [x] Popup history list (`popup/components/HistoryList.tsx`) shows `AI: <Label>` per row instead of the raw provider id.
- [x] Unit tests added (`tests/unit/providers.test.ts`) — known ids map correctly, unknown falls back to "Unknown AI".

## 19. Redesign: "Eco-Modern Clarity" (per user-provided visual spec)
- [x] New palette/typography/shadow tokens in `ui/components.css`: soft off-white→pale-cyan gradient background, sky-blue→emerald/azure/mint accent colors, deep-charcoal/slate-grey text, 24px/16px radii, diffused card shadows — light theme by spec, with an equivalent dark-mode token set for `[data-theme="dark"]`.
- [x] `ui/CircularWaterGauge.tsx` — new hero visualization: circular gradient progress ring + layered wave fill (today vs. lifetime), replacing the previous `WaterGlassCard`. Ring fill is drawn against a documented, configurable visual-only "daily goal" reference (`WATER_DAILY_GOAL_ML`) — never presented as a literal target.
- [x] `ui/MetricCard.tsx` + `ui/icons.tsx` — 2×2 secondary metrics grid (Prompts Sent / Avg Impact per Prompt / Energy Consumption / Carbon Emissions) with soft-colored icon glyphs in low-opacity rounded backgrounds, per spec.
- [x] `popup/components/UsageChart.tsx` restyled: spline tension, gradient area fill under the line, highlighted point markers, light-theme axis styling, fixed 0–150 scale per spec.
- [x] `popup/pages/Dashboard.tsx` fully rewritten to the new layout: header → hero water-footprint card → metrics grid → trend chart → history → actions.
- [x] Options page (`SettingsPage.tsx`) restyled to match (white rounded card, same shadow/radius tokens) for visual consistency across popup/options.
- [x] Theme setting (light/dark/auto) is now actually wired up — previously stored but never applied. New `popup/hooks/useAppliedTheme.ts` sets `<html data-theme>` from settings and follows OS changes when set to "auto".
- [x] **Superseded and removed**: `ui/WaterGlassCard.tsx`, `popup/components/StatCard.tsx`, and the `Settings.displayMode` ("Numbers" / "Visual (glass fill)") toggle — the new design unifies numeric and visual presentation in one layout, so the old either/or toggle no longer applies.
- [x] Rebuilt + re-linted + re-typechecked clean; 51/51 unit tests passing after the redesign.


- E2E Playwright specs are written but not executed against live ChatGPT/Claude/Gemini pages (sandbox has no browser + no access to those domains).
- Provider-specific tokenizers (v2) are stubbed, not implemented — per PRD this is explicitly future scope.
- Store listing assets/publishing not included (out of scope for MVP code build).
