import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const locale of [
  { path: "/", warning: "demonstration scenarios", extra: "Extra human minutes not already counted", copy: "Copy the pilot brief", plan: /Build the test plan/, verification: "Cautious: extra review minutes per case", local: "Local demonstration selected" },
  { path: "/fr/", warning: "scénarios de démonstration", extra: "Minutes humaines supplémentaires non déjà comptées", copy: "Copier la fiche de pilote", plan: /Construire le plan de test/, verification: "Prudent : minutes de relecture supplémentaires par cas", local: "Démonstration locale choisie" },
]) {
  test(locale.path + " editable scenarios retain explicit assumptions and readable controls", async ({ context, page }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(locale.path + "#calibrator");
    const calibrator = page.locator("#calibrator");
    await calibrator.locator(".task-time-sensitivity > summary").click();
    await calibrator.locator(".task-time-sensitivity select").selectOption("local");
    await calibrator.locator(".task-time-demo-toggle input").check();
    await calibrator.locator('.task-time-sensitivity input[type="number"]').first().fill("12");
    await expect(calibrator.locator(".calibrator-result-head small")).toContainText(locale.warning);
    const points = calibrator.locator('[data-range="low"] strong, [data-range="central"] strong, [data-range="high"] strong');
    await expect(points).toHaveCount(3);
    const values = (await points.allTextContents()).map(text => Number(text.replace("%", "").replace(",", ".")));
    expect(values[0]).toBeLessThan(values[1]);
    expect(values[1]).toBeLessThan(values[2]);
    await expect(calibrator.locator(".task-time-source-range")).toContainText(locale.local);
    await calibrator.locator(".task-time-eval-help > summary").click();
    await expect(calibrator.locator(".task-time-eval-help li")).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    const accessibility = await new AxeBuilder({ page }).include("#calibrator").analyze();
    expect(accessibility.violations).toEqual([]);
    await page.locator("#operational-router").getByRole("button", { name: locale.plan }).click();
    await page.getByRole("button", { name: locale.copy }).click();
    const brief = await page.evaluate(() => navigator.clipboard.readText());
    expect(brief).toContain(locale.verification + ": 12 min");
    expect(brief).toContain(locale.extra + ": 0 min");
  });
}

test("source coverage adjustments stay attached to the selected task", async ({ page }) => {
  await page.goto("/#calibrator");
  const calibrator = page.locator("#calibrator");
  await page.getByLabel("What work do you want to estimate?").selectOption("professional_writing");
  await calibrator.locator(".task-time-evidence-detail details > summary").click();
  await expect(calibrator.locator(".task-time-evidence-detail")).toContainText("When the work was observed");
  await expect(calibrator.locator(".task-time-evidence-detail")).toContainText("ChatGPT");
  await calibrator.locator(".task-time-components > summary").nth(2).click();
  await page.getByLabel("Extra human minutes not already counted").fill("5");
  await page.getByLabel("Setup minutes already included in the study time").fill("3");
  await expect(calibrator.locator('[data-metric="recurring-time"] strong')).toHaveText("38 min");
  await calibrator.locator(".task-time-sensitivity > summary").click();
  await page.getByLabel("What should guide the calculation?").selectOption("local");
  await expect(page.getByLabel("Setup minutes already included in the study time")).toHaveCount(0);
  await expect(calibrator.locator(".task-time-source-range")).toContainText("its percentage is not used");
  await page.getByLabel("What should guide the calculation?").selectOption("source");
  await expect(page.getByLabel("Setup minutes already included in the study time")).toHaveValue("3");
  await page.getByLabel("What work do you want to estimate?").selectOption("software_greenfield");
  await expect(page.getByLabel("Setup minutes already included in the study time")).toHaveValue("0");
});
