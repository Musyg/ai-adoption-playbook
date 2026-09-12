import { expect, test } from "@playwright/test";

test("editorial links, anchors and language choice work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:43118/copilot-vs-business-agent/");
    await expect(page.locator(".geo-answer")).toBeVisible();
    await page.locator('.geo-rail a[href="#sources"]').click();
    await expect(page).toHaveURL(/#sources$/);
    await expect(page.locator("#sources")).toBeInViewport();
    await page.locator(".geo-header .lang").click();
    await expect(page).toHaveURL(/\/fr\/copilote-ou-agent-metier\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator(".geo-answer")).toBeVisible();
    await page.locator('.geo-related a').first().click();
    await expect(page.locator(".geo-page h1")).toBeVisible();
    await page.locator(".geo-actions a").first().click();
    await expect(page).toHaveURL(/\/fr\/$/);
    await expect(page.locator("#guided-start")).toBeVisible();
  } finally {
    await context.close();
  }
});

for (const locale of ["en", "fr"]) {
  test(`${locale} split client loads without hydration errors and retains interaction`, async ({ page }) => {
    const errors: string[] = [];
    const scripts: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(request.url());
    });
    await page.goto(locale === "fr" ? "/fr/#calibrator" : "/#calibrator");
    await expect(page.locator("#calibrator")).toBeVisible();
    for (const chunk of ["react-vendor-", "evidence-data-", "project-workspace-"]) {
      expect(scripts.some((url) => url.includes(chunk)), chunk).toBe(true);
    }
    // Opening another chapter tests an event handler, not just prerendered HTML.
    await page.locator("#implementation-library > summary").click();
    await expect(page.locator("#implementation-library")).toHaveAttribute("open", "");
    expect(errors).toEqual([]);
  });
}
