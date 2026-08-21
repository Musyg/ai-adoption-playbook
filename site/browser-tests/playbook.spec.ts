import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const locales = [
  { path: "/", lang: "en", title: "AI Adoption Playbook: pilots, agents and governance", heading: "Move from AI interest to a system you can trust." },
  { path: "/fr/", lang: "fr", title: "Playbook d’adoption de l’IA : pilotes, agents et gouvernance", heading: "Passez de l’intérêt pour l’IA à un système digne de confiance." },
] as const;

for (const locale of locales) {
  test(`${locale.lang} static route is complete and provider neutral`, async ({ page }) => {
    await page.goto(locale.path);

    await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    await expect(page).toHaveTitle(locale.title);
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

test("lifecycle workbench reveals one phase and derives decision guidance", async ({ page, context }) => {
  test.setTimeout(60_000);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator("#implementation-library > summary").click();
  await page.locator("#implementation-library > .guide-chapter-content > .chapter-router nav button").nth(2).click();

  const workbench = page.locator("#lifecycle-workbench");
  await expect(workbench).toBeVisible();
  await expect(workbench.locator(".lifecycle-nav button")).toHaveCount(12);
  await expect(workbench.locator(".lifecycle-phase")).toHaveAttribute("data-phase", "0");
  await expect(workbench.locator(".lifecycle-phase h4")).toHaveText("Mandate");

  await workbench.locator('[name="project"]').fill("North workshop");
  await workbench.locator('[name="owner"]').fill("Operations owner");
  await workbench.locator('[name="problem"]').fill("Accepted requests wait too long for a reviewed answer.");
  await workbench.locator('[name="affected"]').fill("Customers and operations staff");
  await workbench.locator('[name="decisionDate"]').fill("2026-10-01");
  await expect(workbench.locator(".lifecycle-head output strong")).toHaveText("1/12");

  await workbench.locator('.lifecycle-nav button[data-phase="1"]').click();
  await workbench.locator('[name="baselineVolume"]').fill("40");
  await workbench.locator('[name="baselineMinutes"]').fill("60");
  await workbench.locator('[name="baselineOutcome"]').fill("Reviewed answer");
  await workbench.locator('[name="baselineErrors"]').fill("8");
  await expect(workbench.locator(".lifecycle-result strong")).toHaveText("40.0 h");

  await workbench.locator('.lifecycle-nav button[data-phase="4"]').evaluate((element) => (element as HTMLButtonElement).click());
  await workbench.locator('[name="riskImpact"]').selectOption("high");
  await workbench.locator('[name="dataSensitivity"]').selectOption("sensitive");
  await workbench.locator('[name="externalInteraction"]').selectOption("yes");
  await workbench.locator('[name="automatedDecision"]').selectOption("yes");
  await workbench.locator('[name="sectorDuty"]').fill("Applicable sector duties under review");
  await expect(workbench.locator(".lifecycle-guidance output strong")).toHaveText("R3");
  await expect(workbench.locator(".lifecycle-guidance")).toContainText("Switzerland");
  await expect(workbench.locator(".lifecycle-guidance")).toContainText("European Union");

  await workbench.locator('.lifecycle-nav button[data-phase="7"]').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(workbench.locator('.security-builder input[name="SEC-SENSITIVE"]')).toHaveCount(1);
  await expect(workbench.locator('.security-builder input[name="SEC-RETRIEVAL"]')).toHaveCount(1);
  await expect(workbench.locator('.security-builder input[name="SEC-ACTION"]')).toHaveCount(1);
  await expect(workbench.locator('.security-builder input[name="SEC-INDEPENDENT"]')).toHaveCount(1);

  const securityChecks = workbench.locator(".security-builder input");
  for (let index = 0; index < await securityChecks.count(); index += 1) await securityChecks.nth(index).check();
  await expect(workbench.locator('.lifecycle-nav button[data-phase="7"]')).toHaveAttribute("data-complete", "true");
  await workbench.getByRole("button", { name: "Copy the working plan" }).click();
  await expect(workbench.getByRole("button", { name: "Working plan copied" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("4. Risk and legal route · COMPLETE");
});

test("local project dossier persists, exports, imports, and resets safely", async ({ page }) => {
  test.setTimeout(60_000);
  const storageKey = "ai-adoption-playbook:project-dossier:v1";
  const openWorkbench = async () => {
    await page.locator("#implementation-library > summary").click();
    await page.locator("#implementation-library > .guide-chapter-content > .chapter-router nav button").nth(2).click();
    await expect(page.locator("#lifecycle-workbench")).toBeVisible();
  };

  await page.goto("/");
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload();
  await openWorkbench();

  let workbench = page.locator("#lifecycle-workbench");
  await expect(workbench.locator(".project-dossier-manager")).toHaveAttribute("data-dossier-state", "new");
  await workbench.locator('[name="project"]').fill("Project North");
  await workbench.locator('[name="owner"]').fill("Operations owner");
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.fields?.project, storageKey)).toBe("Project North");
  await expect(workbench.locator(".project-dossier-manager")).toHaveAttribute("data-dossier-state", "saved");

  await workbench.locator('.lifecycle-nav button[data-phase="4"]').evaluate((element) => (element as HTMLButtonElement).click());
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.active_phase, storageKey)).toBe(4);
  await page.reload();
  await openWorkbench();
  workbench = page.locator("#lifecycle-workbench");
  await expect(workbench.locator(".lifecycle-phase")).toHaveAttribute("data-phase", "4");
  await workbench.locator('.lifecycle-nav button[data-phase="0"]').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(workbench.locator('[name="project"]')).toHaveValue("Project North");
  await expect(workbench.getByText("Local dossier resumed.")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await workbench.getByRole("button", { name: "Export JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("ai-adoption-project-project-north.json");

  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null"), storageKey);
  const imported = {
    ...stored,
    dossier_id: "AAP-import-0001",
    updated_at: new Date().toISOString(),
    context: {
      organization_type: "public",
      use_pattern: "conversation",
      jurisdiction: "EU",
      integration_level: "copilot",
      autonomy_level: 1,
      risk_level: 2,
    },
    active_phase: 0,
    fields: { ...stored.fields, project: "Imported public assistant" },
  };
  await workbench.locator(".dossier-file-input").setInputFiles({
    name: "project-dossier.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(imported)),
  });
  await expect(workbench.getByText("Dossier imported and guide context restored.")).toBeVisible();
  await expect(workbench.locator(".lifecycle-context")).toContainText("Public service");
  await expect(workbench.locator(".lifecycle-context")).toContainText("Conversation");
  await expect(workbench.locator(".lifecycle-context")).toContainText("European Union");
  await expect(workbench.locator('[name="project"]')).toHaveValue("Imported public assistant");

  const invalid = { ...imported, schema_version: "9.0.0", fields: { project: "Must not replace current work" } };
  await workbench.locator(".dossier-file-input").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(invalid)),
  });
  await expect(workbench.getByText("This file is not a compatible project dossier. Your current work was not changed.")).toBeVisible();
  await expect(workbench.locator('[name="project"]')).toHaveValue("Imported public assistant");

  await workbench.getByRole("button", { name: "Start a new dossier" }).click();
  await expect(workbench.locator('[name="project"]')).toHaveValue("");
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey)).toBeNull();
  await expect(workbench.locator(".project-dossier-manager")).toHaveAttribute("data-dossier-state", "new");
});

test("rendered page has no automatic axe violations", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  for (const chapter of ["concept-library", "operational-workspace", "implementation-library"]) {
    await page.locator(`#${chapter} > summary`).click();
  }
  await page.locator(".guide-chapter-content [hidden]").evaluateAll((elements) => elements.forEach((element) => element.removeAttribute("hidden")));
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test("large surfaces stay neutral and button hovers stay within the portfolio palette", async ({ page }, testInfo) => {
  await page.goto("/");

  if (!testInfo.project.name.startsWith("mobile")) {
    for (const selector of [".hero-actions .primary", ".hero-actions .secondary", ".site-header .lang"]) {
      const control = page.locator(selector);
      await control.hover();
      const colors = await control.evaluate((element) => {
        const style = getComputedStyle(element);
        return { background: style.backgroundColor, color: style.color, border: style.borderColor };
      });
      expect(colors.background).not.toBe("rgb(28, 159, 255)");
      expect(colors.color).not.toBe("rgb(28, 159, 255)");
    }
  }

  await page.locator("details").evaluateAll((elements) => elements.forEach((element) => element.setAttribute("open", "")));
  await page.locator("[hidden]").evaluateAll((elements) => elements.forEach((element) => element.removeAttribute("hidden")));
  const largeOffPaletteSurfaces = await page.locator("body").evaluate((body) => {
    const prohibited = new Set([
      "rgb(28, 159, 255)",
      "rgb(0, 103, 184)",
      "rgb(0, 138, 255)",
      "rgb(117, 199, 255)",
      "rgb(231, 245, 255)",
      "rgb(232, 245, 255)",
      "rgb(243, 201, 105)",
      "rgb(255, 173, 159)",
    ]);

    return [...body.querySelectorAll("*")].flatMap((element) => {
      const rect = element.getBoundingClientRect();
      const area = Math.max(0, rect.width) * Math.max(0, rect.height);
      const background = getComputedStyle(element).backgroundColor;
      if (area < 12_000 || !prohibited.has(background)) return [];
      return [{ tag: element.tagName.toLowerCase(), id: element.id, className: element.className, background, area: Math.round(area) }];
    });
  });

  expect(largeOffPaletteSurfaces).toEqual([]);
});
