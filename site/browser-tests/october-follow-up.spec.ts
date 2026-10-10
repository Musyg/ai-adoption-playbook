import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const storageKey = "ai-adoption-playbook:project-dossier:v1";
for (const locale of ["en", "fr"] as const) {
  const fr = locale === "fr", root = fr ? "/fr/" : "/";
  test(`${locale} combined functions persist and add evaluations without changing authority`, async ({ page }) => {
    await page.goto(root + "#guided-start");
    await page.locator(".guide-audiences button").first().click();
    await page.locator(".guide-next").click();
    await page.locator(".guide-patterns button").nth(1).click();
    const extras = page.locator("#guided-start .additional-patterns");
    await extras.locator("summary").click();
    await extras.getByRole("checkbox", { name: "Conversation", exact: true }).check();
    await expect(page.locator(".guide-patterns button").nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(extras).toContainText(fr ? "permissions" : "permissions");
    await page.goto(root + "#lifecycle-workbench");
    const workbench = page.locator("#lifecycle-workbench");
    await expect(workbench).toBeVisible();
    await workbench.locator('[name="project"]').fill("Combined functions");
    await expect.poll(() => page.evaluate((key) => {
      const dossier = JSON.parse(localStorage.getItem(key) ?? "null");
      return dossier?.context;
    }, storageKey)).toMatchObject({ use_pattern: "retrieval", additional_use_patterns: ["conversation"], work_mode: "agent", architecture: "workflow", autonomy_level: 2 });
    await workbench.locator(".artifact-router button").nth(2).click();
    const guidance = workbench.locator(".artifact-pattern-note");
    await expect(guidance.locator("li")).toHaveCount(2);
    await expect(guidance).toContainText(fr ? "transfert" : "handoff");
    await page.reload();
    await expect(workbench.locator(".lifecycle-context")).toContainText("Conversation");
    const downloadPromise = page.waitForEvent("download");
    await workbench.getByRole("button", { name: fr ? /Exporter le JSON/ : /Export JSON/ }).click();
    const download = await downloadPromise;
    const savedPath = await download.path();
    expect(savedPath).not.toBeNull();
    await workbench.getByLabel(fr ? "Importer un JSON" : "Import JSON", { exact: true }).setInputFiles(savedPath!);
    await expect(workbench).toContainText(fr ? "Dossier importé" : "Dossier imported");
    await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.context.additional_use_patterns, storageKey)).toEqual(["conversation"]);
  });

  test(`${locale} optional outcomes are labelled, separate and saved`, async ({ page }) => {
    await page.goto(root + "#lifecycle-workbench");
    const workbench = page.locator("#lifecycle-workbench");
    await workbench.locator(".lifecycle-nav button").nth(8).click();
    const notebook = workbench.locator(".outcome-notebook");
    await notebook.locator("summary").click();
    await notebook.getByRole("button").click();
    await expect(notebook.locator('[name="outcomeBasis"]')).toHaveValue(fr ? "Démonstration, pas une observation" : "Demonstration, not an observation");
    await expect(notebook.locator("output")).toContainText("-15 min");
    await expect(notebook.locator("output")).toContainText("-5 CHF");
    await expect(notebook.locator("output")).toContainText(fr ? "4 points de pourcentage" : "4 percentage points");
    await notebook.locator('[name="outcomeQualityAfter"]').fill("101");
    await expect(notebook.locator("output li").last()).toContainText(fr ? "à compléter" : "not entered");
    await notebook.locator('[name="outcomeQualityAfter"]').fill("94");
    await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.fields.outcomeBasis, storageKey)).toContain(fr ? "Démonstration" : "Demonstration");
    const button = notebook.getByRole("button");
    await button.hover();
    const colors = await button.evaluate((element) => ({ text: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor }));
    expect(colors.text).not.toBe(colors.background);
    expect((await new AxeBuilder({ page }).include(".outcome-notebook").analyze()).violations).toEqual([]);
    await page.reload();
    await notebook.locator("summary").click();
    await expect(workbench.locator('[name="outcomeCostUnit"]')).toHaveValue(fr ? "CHF / cas accepté" : "CHF / accepted case");
  });
}
