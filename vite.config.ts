import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";

// Vite + CRXJS build config for the MV3 extension.
// crx() handles manifest generation, HMR for content scripts, and
// correct bundling of background service worker + content scripts + pages.
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: "popup.html",
        options: "options.html",
        methodology: "methodology.html",
      },
    },
  },
});
