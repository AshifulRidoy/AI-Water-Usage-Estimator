import { test, expect } from "./fixtures";

// Requires: npm run build first, and network access to chatgpt.com with a
// logged-in session. Not runnable in the build sandbox — see roadmap.md.
test.describe("ChatGPT integration", () => {
  test("shows a water badge after a response completes", async ({ context }) => {
    const page = await context.newPage();
    await page.goto("https://chatgpt.com/");
    await page.getByRole("textbox").fill("Say hello in one sentence.");
    await page.keyboard.press("Enter");

    const badge = page.locator(".aiwe-badge-container").last();
    await expect(badge).toBeVisible({ timeout: 20_000 });
    await expect(badge).toContainText("mL");
  });
});
