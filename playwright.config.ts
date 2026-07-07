import { defineConfig } from "@playwright/test";

// NOTE: These E2E specs require loading the built extension into a real
// Chromium instance and navigating to the live chatgpt.com/claude.ai/gemini
// domains. That's not possible in this build sandbox (no browser binary,
// no network access to those domains) — see roadmap.md "Known Limitations".
// The specs are written and ready to run in a normal dev environment via
// `npm run test:e2e` after `npm run build`.
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    headless: false, // MV3 extensions require a headed context in Chromium
  },
});
