import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["en", "fr"]) {
  const root = locale === "fr" ? "/fr/bibliotheque/" : "/library/";
  test(`${locale} library reading, cross-links, language switch and template download`, async ({ page }) => {
    await page.goto(root);
    await expect(page.locator("h1")).toHaveText(locale === "fr" ? "Bibliothèque du guide" : "Guide library");
    await page.locator(`.document-index a[href="${root}tracks-independent/"]`).click();
    await expect(page.locator("h1")).toContainText(locale === "fr" ? "indépendant" : "Independent");
    await page.locator(`.document-prose a[href="${root}templates-mandate/"]`).first().click();
    await expect(page.locator(".document-prose")).toBeVisible();
    const download = page.waitForEvent("download");
    await page.locator("a[download]").click();
    expect((await download).suggestedFilename()).toBe(locale === "fr" ? "mandate.fr.md" : "mandate.md");
    await page.locator(".geo-header .lang").click();
    await expect(page).toHaveURL(new RegExp(`${locale === "fr" ? "/library/" : "/fr/bibliotheque/"}templates-mandate/`));
  });

  test(`${locale} document layout and accessibility work without JavaScript`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.name === "mobile-light" ? { width: 393, height: 851 } : { width: 1920, height: 1080 } });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:43118${root}examples-tpe-customer-requests/`);
    await expect(page.locator(".document-prose")).toBeVisible();
    const sizes = await page.evaluate(() => ({ width: innerWidth, doc: document.documentElement.scrollWidth, content: document.querySelector(".geo-content")!.getBoundingClientRect().width }));
    expect(sizes.doc).toBeLessThanOrEqual(sizes.width);
    expect(sizes.content).toBeGreaterThan(300);
    await page.locator(".document-toc a").first().click();
    expect(new URL(page.url()).hash.length).toBeGreaterThan(1);
    await context.close();
  });

  test(`${locale} library and table document have no serious accessibility violations`, async ({ page }) => {
    for (const route of [root, `${root}templates-evaluation-plan/`]) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter((item) => ["critical", "serious"].includes(item.impact || ""))).toEqual([]);
    }
  });

  test(`${locale} print output stays legible regardless of screen theme`, async ({ page }) => {
    await page.goto(`${root}templates-evaluation-plan/`);
    await page.emulateMedia({ media: "print", colorScheme: "dark" });
    await expect(page.locator(".document-page")).toHaveCSS("color", "rgb(0, 0, 0)");
    await expect(page.locator(".document-page")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.locator(".document-toc")).toBeHidden();
    await expect(page.locator(".document-prose")).toBeVisible();
    await expect(page.locator(".document-table table").first()).toHaveCSS("table-layout", "fixed");
  });
}
