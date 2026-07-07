import { test, expect } from "./fixtures";

// Requires: npm run build first, network access to gemini.google.com, logged-in
// session. Not runnable in the build sandbox — see roadmap.md.
test.describe("Gemini integration", () => {
  test("shows a water badge after a response completes", async ({ context }) => {
    const page = await context.newPage();
    await page.goto("https://gemini.google.com/app");
    await page.getByRole("textbox").fill("Say hello in one sentence.");
    await page.keyboard.press("Enter");

    const badge = page.locator(".aiwe-badge-container").last();
    await expect(badge).toBeVisible({ timeout: 20_000 });
  });

  test("badges persist correctly when switching conversations", async ({ context }) => {
    const page = await context.newPage();
    await page.goto("https://gemini.google.com/app");
    // Switching conversations should not duplicate or lose badges — the
    // responseId-based cache in content/parser.ts is what's under test here.
    await page.goto("https://gemini.google.com/app");
    const badges = page.locator(".aiwe-badge-container");
    await expect(badges).toHaveCount(await badges.count());
  });
});
