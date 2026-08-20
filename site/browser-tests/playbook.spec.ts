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
  await page.locator("#implementation-library > summary").click();
  const cards = page.locator(".path-card");
  await expect(cards).toHaveCount(5);

  const target = cards.nth(2);
  await target.click();
  await expect(target).toHaveAttribute("aria-pressed", "true");
  expect(await cards.evaluateAll((items) => items.filter((item) => item.getAttribute("aria-pressed") === "true").length)).toBe(1);
});

test("use pattern and jurisdiction update the evidence profile", async ({ page }) => {
  await page.goto("/");
  await page.locator("#concept-library > summary").click();

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
  await page.locator("#operational-workspace > summary").click();

  await expect(page.locator(".calibrator-result-head strong")).toContainText("20–50%");
  await page.getByLabel("Low effect hypothesis").fill("10");
  await page.getByLabel("High effect hypothesis").fill("20");

  await expect(page.locator(".calibrator-result-head strong")).toContainText("10–20%");
  await expect(page.locator(".calibrator-equation")).toContainText("7–14%");

  await page.getByRole("button", { name: /Orchestrated agency/ }).click();
  await expect(page.locator(".calibrator-result-head strong")).toContainText("35–70%");
});

test("guided start reveals one decision at a time and builds a plain-language route", async ({ page }) => {
  await page.goto("/");

  const initialScreens = await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
  expect(initialScreens).toBeLessThan(6);
  await expect(page.locator(".guide-patterns")).toHaveCount(0);

  const chapters = page.locator("details.guide-chapter");
  await expect(chapters).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) await expect(chapters.nth(index)).not.toHaveAttribute("open", "");

  await expect(page.locator(".guide-audiences button")).toHaveCount(5);
  await page.locator(".concept-tip > summary").click();
  await expect(page.locator(".concept-tip [role='note']")).toContainText("An independent professional can decide");
  await page.locator(".guide-audiences button").nth(2).click();
  await page.locator(".guided-controls .guide-next").click();

  await expect(page.locator(".guide-patterns button")).toHaveCount(7);
  await page.locator(".guide-patterns button").nth(4).click();
  await page.locator(".guided-controls .guide-next").click();

  await page.locator(".guide-levels button").first().click();
  await page.locator(".guided-controls .guide-next").click();
  await page.locator(".guide-jurisdictions button").first().click();
  await page.locator(".guided-controls .guide-next").click();

  await expect(page.locator(".guided-result")).toContainText("SME");
  await expect(page.locator(".guided-result")).toContainText("Conversation");
  await expect(page.locator(".guided-result")).toContainText("It prepares, you act");
  await expect(page.locator(".guided-result")).toContainText("Switzerland");
});

test("chapter routers reveal one topic at a time and restore deep links", async ({ page }) => {
  await page.goto("/");

  await page.locator("#concept-library > summary").click();
  await expect(page.locator("#use-patterns")).toBeVisible();
  await expect(page.locator("#geo-library")).toBeHidden();
  await page.locator("#concept-library .chapter-router nav button").nth(2).click();
  await expect(page.locator("#non-agentic-cases")).toBeVisible();
  await expect(page.locator("#use-patterns")).toBeHidden();
  await page.locator("#concept-library .chapter-stepper button").last().click();
  await expect(page.locator("#integration-levels")).toBeVisible();

  await page.locator("#operational-workspace > summary").click();
  await expect(page.locator("#calibrator")).toBeVisible();
  await page.locator("#operational-workspace .chapter-router nav button").nth(1).click();
  await expect(page.locator("#pilot-plan")).toBeVisible();
  await expect(page.locator("#calibrator")).toBeHidden();
  await page.locator("#operational-workspace .chapter-stepper button").last().click();
  await expect(page.locator("#evidence-gate")).toBeVisible();

  await page.locator("#implementation-library > summary").click();
  await expect(page.locator("#paths")).toBeVisible();
  await page.locator("#implementation-library > .guide-chapter-content > .chapter-router nav button").nth(3).click();
  await expect(page.locator("#case-library")).toBeVisible();
  await expect(page.locator("#case")).toBeVisible();
  await page.locator("#case-library .case-router nav button").last().click();
  await expect(page.locator("#agency-case")).toBeVisible();
  await expect(page.locator("#case")).toBeHidden();
  await expect(page.locator("#case-library .chapter-stepper button").last()).toBeDisabled();
  await page.locator("#case-library .chapter-stepper button").first().click();
  await expect(page.locator("#agent-case")).toBeVisible();

  await page.goto("/#agent-case");
  await expect(page.locator("#implementation-library")).toHaveAttribute("open", "");
  await expect(page.locator("#case-library")).toBeVisible();
  await expect(page.locator("#agent-case")).toBeVisible();
  await expect(page.locator("#agency-case")).toBeHidden();
});

test("rendered page has no automatic axe violations", async ({ page }) => {
  await page.goto("/");
  for (const chapter of ["concept-library", "operational-workspace", "implementation-library"]) {
    await page.locator(`#${chapter} > summary`).click();
  }
  await page.locator(".guide-chapter-content [hidden]").evaluateAll((elements) => elements.forEach((element) => element.removeAttribute("hidden")));
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
