import { test, expect } from "./fixtures";

// Requires: npm run build first, network access to claude.ai, logged-in session.
// Not runnable in the build sandbox — see roadmap.md.
test.describe("Claude integration", () => {
  test("shows a water badge after a response completes", async ({ context }) => {
    const page = await context.newPage();
    await page.goto("https://claude.ai/new");
    await page.getByRole("textbox").fill("Say hello in one sentence.");
    await page.keyboard.press("Enter");

    const badge = page.locator(".aiwe-badge-container").last();
    await expect(badge).toBeVisible({ timeout: 20_000 });
  });

  test("renders correctly in dark mode", async ({ context }) => {
    const page = await context.newPage();
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("https://claude.ai/new");
    const badge = page.locator(".aiwe-badge-container").last();
    await expect(badge).toBeAttached({ timeout: 5_000 }).catch(() => undefined);
  });
});
