import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const locales = [
  { path: "/", lang: "en", heading: "Move from AI interest to a system you can trust." },
  { path: "/fr/", lang: "fr", heading: "Passez de l’intérêt pour l’IA à un système digne de confiance." },
] as const;

for (const locale of locales) {
  test(`${locale.lang} static route is complete and provider neutral`, async ({ page }) => {
    await page.goto(locale.path);

    await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(locale.heading);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('link[rel="sitemap"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);

    const providerReferences = await page.locator("html").evaluate((root) =>
      /musyg\.github\.io|chatgpt\.site/i.test(root.outerHTML),
    );
    expect(providerReferences).toBe(false);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("audience selection updates the active decision path", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".path-card");
  await expect(cards).toHaveCount(5);

  const target = cards.nth(2);
  await target.click();
  await expect(target).toHaveAttribute("aria-pressed", "true");
  expect(await cards.evaluateAll((items) => items.filter((item) => item.getAttribute("aria-pressed") === "true").length)).toBe(1);
});

test("use pattern and jurisdiction update the evidence profile", async ({ page }) => {
  await page.goto("/");

  await page.locator(".use-pattern-grid button").first().click();
  await expect(page.locator(".use-pattern-detail")).toContainText("Accepted quality");
  await page.locator(".jurisdiction-options button").first().click();
  await expect(page.locator(".crosswalk-summary p").nth(3)).toContainText("Generation");
  await expect(page.locator(".crosswalk-summary p").nth(4)).toContainText("Switzerland");
  await expect(page.locator(".crosswalk-controls details")).toHaveCount(19);
  await expect(page.getByText("AAP-TRN-004", { exact: true })).toHaveCount(0);

  await page.locator(".jurisdiction-options button").nth(1).click();
  await expect(page.locator(".crosswalk-controls details")).toHaveCount(20);
  await expect(page.getByText("AAP-TRN-004", { exact: true })).toHaveCount(1);
});

test("non-agentic cases expose four distinct evidence contracts", async ({ page }) => {
  await page.goto("/");

  const cards = page.locator(".non-agentic-grid article");
  await expect(cards).toHaveCount(4);
  await expect(cards.nth(0)).toContainText("A1");
  await expect(cards.nth(1)).toContainText("A0");
  await expect(cards.nth(2)).toContainText("No account");
  await expect(cards.nth(3)).toContainText("0 publishing rights");

  const caseLinks = page.locator(".non-agentic-footer a");
  await expect(caseLinks).toHaveCount(4);
  await expect(caseLinks.nth(0)).toHaveAttribute("href", /examples\/en\/rag-policy-assistant\.md$/);
  await expect(caseLinks.nth(1)).toHaveAttribute("href", /examples\/en\/predictive-demand-forecast\.md$/);
  await expect(caseLinks.nth(2)).toHaveAttribute("href", /examples\/en\/external-customer-chatbot\.md$/);
  await expect(caseLinks.nth(3)).toHaveAttribute("href", /examples\/en\/multimodal-catalog-accessibility\.md$/);
});

test("calibrator treats low and high effects as editable hypotheses", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".calibrator-result-head strong")).toContainText("20–50%");
  await page.getByLabel("Low effect hypothesis").fill("10");
  await page.getByLabel("High effect hypothesis").fill("20");

  await expect(page.locator(".calibrator-result-head strong")).toContainText("10–20%");
  await expect(page.locator(".calibrator-equation")).toContainText("7–14%");

  await page.getByRole("button", { name: /Orchestrated agency/ }).click();
  await expect(page.locator(".calibrator-result-head strong")).toContainText("35–70%");
});

test("rendered page has no automatic axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
