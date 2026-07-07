import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

// Manifest V3, least-privilege permissions per architecture.md "Security" section:
// - no host permissions beyond the three supported AI sites
// - no "tabs" or "webRequest" — the extension never inspects network traffic
// - storage is local-only ("storage"), never "unlimitedStorage" (not needed for text stats)
export default defineManifest({
  manifest_version: 3,
  name: "AI Water Usage Estimator",
  description:
    "Estimates the water, energy, and carbon footprint of your AI chat usage on ChatGPT, Claude, and Gemini. Local-first, no tracking.",
  version: pkg.version,
  icons: {
    16: "public/icons/icon16.png",
    48: "public/icons/icon48.png",
    128: "public/icons/icon128.png",
  },
  action: {
    default_popup: "popup.html",
    default_icon: {
      16: "public/icons/icon16.png",
      48: "public/icons/icon48.png",
      128: "public/icons/icon128.png",
    },
  },
  options_page: "options.html",
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: [
        "https://chatgpt.com/*",
        "https://chat.openai.com/*",
        "https://claude.ai/*",
        "https://gemini.google.com/*",
      ],
      js: ["src/content/index.ts"],
      css: ["src/ui/theme.css"],
      run_at: "document_idle",
    },
  ],
  permissions: ["storage"],
  host_permissions: [
    "https://chatgpt.com/*",
    "https://chat.openai.com/*",
    "https://claude.ai/*",
    "https://gemini.google.com/*",
  ],
});
