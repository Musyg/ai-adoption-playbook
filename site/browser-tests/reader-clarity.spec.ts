import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const locale of ["en", "fr"] as const) {
  const path = locale === "fr" ? "/fr/" : "/";

  test(`${locale} design choices are progressive, explained and revisitable`, async ({ page }) => {
    await page.goto(path + "#guided-start");
    const next = page.locator(".guided-controls .guide-next");
    await page.locator(".guide-audiences button").first().click();
    await next.click();
    const task = page.locator(".guide-patterns button").nth(1);
    await expect(task.locator("strong")).toContainText(locale === "en" ? "your documents" : "vos documents");
    await task.click();
    await next.click();
    await expect(page.locator(".guide-design-choices fieldset:visible")).toHaveCount(1);
    await expect(page.locator(".guide-architectures")).not.toBeVisible();
    await expect(next).toBeDisabled();
    await page.locator(".reader-choice-help summary").click();
    await expect(page.locator(".reader-choice-help details")).toContainText(locale === "en" ? "provisional" : "provisoire");
    await page.locator(".guide-levels button").first().click();
    await expect(page.locator(".reader-choice-help > p")).toContainText(locale === "en" ? "send it yourself" : "envoyez vous-même");
    await next.click();
    await expect(page.locator(".guide-levels")).not.toBeVisible();
    await expect(next).toBeDisabled();
    await page.locator(".guide-architectures button").nth(1).click();
    await next.click();
    await page.locator(".guide-autonomy button").nth(1).click();
    await page.locator(".guided-controls .guide-back").click();
    await expect(page.locator(".guide-architectures button").nth(1)).toHaveAttribute("aria-pressed", "true");
    await next.click();
    await expect(page.locator(".guide-autonomy button").nth(1)).toHaveAttribute("aria-pressed", "true");
    await page.locator(".guide-design-progress button").nth(2).hover();
    expect((await new AxeBuilder({ page }).include("#guided-start").analyze()).violations).toEqual([]);
    await page.locator(".guide-design-choices").screenshot({ path: test.info().outputPath("design-choices.png") });
    await next.click();
    const both = page.locator(".guide-jurisdictions button").last();
    await expect(both.locator("span")).toHaveText(locale === "en" ? "CH + EU" : "CH + UE");
    await both.click();
    await next.click();
    await expect(page.locator(".guided-result")).toContainText(locale === "en" ? "Tool-assisted workflow" : "Processus outillé");
    await expect(page.locator(".guided-result")).not.toContainText("Baseline et unité");
  });

  test(`${locale} monthly summary distinguishes saved, added and unavailable time`, async ({ page }) => {
    await page.goto(path + "#calibrator");
    const calc = page.locator("#calibrator");
    await calc.getByRole("button", { name: locale === "en" ? /Copilot 01/ : /Copilote 01/ }).click();
    const summary = calc.locator('[data-metric="whole-summary"]');
    await expect(summary).toContainText(locale === "en" ? "11.9 hours would be saved" : "11,9 heures seraient économisées");
    await expect(summary).toContainText(locale === "en" ? "28.1 hours of human work" : "28,1 heures de travail humain");
    await expect(summary).toContainText(locale === "en" ? "not an observed result" : "pas un résultat observé");
    await summary.getByRole("button").hover();
    await summary.screenshot({ path: test.info().outputPath("monthly-summary.png") });
    await expect(calc.locator('[data-metric="recurring-time"]')).not.toBeVisible();
    await calc.locator(".reader-case-details > summary").click();
    await expect(calc.locator('[data-metric="recurring-time"]')).toBeVisible();
    await summary.getByRole("button").click();
    await expect(calc.locator(".task-time-sensitivity")).toHaveAttribute("open", "");
    await expect(calc.locator(".task-time-sensitivity > summary")).toBeFocused();
    await calc.locator(".task-time-sensitivity select").selectOption("local");
    await calc.locator(".task-time-demo-toggle input").check();
    await expect(calc.locator('[data-range="low"]')).toBeVisible();
    await expect(calc.locator('[data-range="high"]')).toBeVisible();
    await calc.locator(".task-time-components > summary").first().click();
    await calc.getByLabel(locale === "en" ? "Verification" : "Vérification", { exact: true }).fill("100");
    await expect(summary).toContainText(locale === "en" ? "hours would be added" : "heures seraient ajoutées");
    await calc.getByLabel(locale === "en" ? "Share of cases AI can actually handle" : "Part des cas que l’IA peut réellement traiter").fill("0");
    await expect(summary).toContainText(locale === "en" ? "cannot be estimated" : "ne permettent pas d’estimer");
    await expect(summary).not.toContainText(locale === "en" ? "hours would be saved" : "heures seraient économisées");
    expect((await new AxeBuilder({ page }).include("#calibrator").analyze()).violations).toEqual([]);
  });

  test(`${locale} equal ranges collapse and optional feedback is separate`, async ({ page }) => {
    await page.goto(path + "#calibrator");
    const headline = await page.locator(".calibrator-result-head strong").textContent();
    await page.locator("#operational-router nav button").nth(2).click();
    const planned = page.locator("#evidence-gate .evidence-impact p strong").nth(2);
    await expect(planned).toHaveText(headline ?? "");
    await page.locator("#operational-router nav button").nth(5).click();
    await expect(page.locator("#field-pilot .section-heading")).toContainText(locale === "en" ? "do not require a contribution" : "ne nécessitent aucune contribution");
    await page.goto(path + "#geo-library");
    await expect(page.locator(".reader-topic-links button")).toHaveCount(4);
    await page.locator(".reader-topic-links button").first().click();
    await expect(page.locator("#use-patterns")).toBeVisible();
    await expect(page.locator(".use-pattern-grid button").nth(1)).toHaveAttribute("aria-pressed", "true");
  });
}
