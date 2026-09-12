import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const locales = [
  { path: "/", lang: "en", title: "AI Adoption Playbook: pilots, agents and governance", heading: "Move from AI interest to a system you can trust.", changeHeading: "See what changed before yesterday’s decision becomes today’s assumption.", emptyReference: "No reference dossier loaded" },
  { path: "/fr/", lang: "fr", title: "Playbook d’adoption de l’IA : pilotes, agents et gouvernance", heading: "Passez de l’intérêt pour l’IA à un système digne de confiance.", changeHeading: "Voir ce qui a changé avant qu’une ancienne décision devienne une hypothèse silencieuse.", emptyReference: "Aucun dossier de référence chargé" },
] as const;

for (const locale of locales) {
  test(`${locale.lang} static route is complete and provider neutral`, async ({ page }) => {
    await page.goto(locale.path);

    await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    await expect(page).toHaveTitle(locale.title);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(locale.heading);
    await expect(page.locator("#change-review-title")).toHaveText(locale.changeHeading);
    await expect(page.locator(".change-review-empty")).toContainText(locale.emptyReference);
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

test("all editorial routes remain readable and explain their notation", async ({ page }) => {
  const routes = [
    "/copilot-vs-business-agent/",
    "/business-agent-roi/",
    "/business-agent-pilot/",
    "/ai-agent-governance/",
    "/orchestrated-ai-agency/",
    "/business-agent-small-business-case/",
    "/fr/copilote-ou-agent-metier/",
    "/fr/roi-agent-metier/",
    "/fr/piloter-agent-metier/",
    "/fr/gouvernance-agents-ia/",
    "/fr/agence-ia-orchestree/",
    "/fr/cas-agent-ia-pme/",
  ];

  for (const route of routes) {
    await page.goto(route);
    const headings = await page.locator("h1, h2").allTextContents();
    expect(headings.length).toBeGreaterThan(1);
    expect(headings[0].trim()).not.toBe(headings[1].trim());
    await expect(page.locator(".geo-notation")).toContainText(/A0 (?:to|à) A4/);
    await expect(page.locator(".geo-notation")).toContainText(/R0 (?:to|à) R3/);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(1);
  }
});

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
  await expect(page.locator(".crosswalk-controls details")).toHaveCount(21);
  await expect(page.getByText("AAP-TRN-004", { exact: true })).toHaveCount(0);

  await page.locator(".jurisdiction-options button").nth(1).click();
  await expect(page.locator(".crosswalk-controls details")).toHaveCount(22);
  await expect(page.getByText("AAP-TRN-004", { exact: true })).toHaveCount(1);

  await page.locator(".use-pattern-grid button").nth(3).click();
  await expect(page.getByLabel("What work do you want to estimate?")).toHaveValue("predictive_decision_support");
  await expect(page.locator(".task-time-evidence-detail")).toContainText("DeepMind reports better algorithms");
  await expect(page.locator(".task-time-source-range")).toContainText("not added to your estimate");

  await page.locator(".use-pattern-grid button").nth(5).click();
  await expect(page.getByLabel("What work do you want to estimate?")).toHaveValue("multimodal_review");
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

test("task-time calibrator turns transferable evidence and human work into a net range", async ({ page }) => {
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();

  await expect(page.getByLabel("What work do you want to estimate?")).toHaveValue("information_synthesis");
  await expect(page.locator(".task-time-evidence-detail")).toContainText("Legora reports checking 41 documents");
  await expect(page.locator(".task-time-source-range")).toContainText("TT-2026-LEGORA-DOCUMENT-REVIEW");
  await expect(page.locator(".task-time-source-range")).toContainText("remain visible for information");
  await expect(page.locator(".calibrator-result-head small")).toContainText("starting scenario to verify");
  await expect(page.locator('.calibrator-result-grid p[data-metric="recurring-time"]')).toContainText("33 min");
  await expect(page.locator('.calibrator-result-grid p[data-metric="setup"]')).toContainText("7.1 min");
  await expect(page.locator('.calibrator-result-grid p[data-range="local"]')).toContainText("Your starting scenario");
  await expect(page.locator('.calibrator-result-grid p[data-range="local"]')).toContainText("the selected study does not provide a reliable range");
  await expect(page.locator('.calibrator-result-grid p[data-range="low"]')).toHaveCount(0);

  await page.getByRole("button", { name: /Strong automation 03/ }).click();
  await expect(page.locator('.calibrator-result-grid p[data-metric="recurring-time"]')).toContainText("33 min");
  await expect(page.locator('.calibrator-result-grid p[data-metric="setup"]')).toContainText("21.4 min");
  await expect(page.locator('.calibrator-result-grid p[data-metric="net-time"]')).toContainText("54.4 min");
  await expect(page.locator(".task-time-mode-effect")).toContainText("does not add a fixed productivity bonus");

  await page.getByLabel("What work do you want to estimate?").selectOption("predictive_decision_support");
  await expect(page.locator(".task-time-evidence-detail")).toContainText("DeepMind reports better algorithms");
  await expect(page.locator(".task-time-source-range")).toContainText("not added to your estimate");
  await expect(page.locator(".calibrator-result-head small")).toContainText("starting scenario to verify");

  await page.getByLabel("What work do you want to estimate?").selectOption("professional_writing");
  await page.getByRole("button", { name: /Copilot 01/ }).click();
  await expect(page.locator(".task-time-evidence-detail")).toContainText("people completed one defined writing task about 40% faster");
  await expect(page.locator(".task-time-source-range")).toContainText("TT-2023-NOY-ZHANG-WRITING");
  await expect(page.locator(".task-time-source-range")).toContainText("40%");
  await expect(page.locator(".calibrator-result-head small")).toContainText("starting estimate based on a similar study");
  await expect(page.locator(".calibrator-result-head")).toContainText("complete workload");
  await expect(page.locator(".calibrator-result-head strong")).toContainText("26.3%");
  await expect(page.locator('.calibrator-result-grid p[data-range="local"]')).toContainText("26.3%");
  await expect(page.locator('.calibrator-result-grid p[data-metric="net-time"]')).toContainText("37.6% net saving on each eligible case");

  await page.locator(".task-time-components > summary").first().click();
  await page.getByLabel("Verification").fill("70");
  await expect(page.locator(".calibrator-result-head strong")).toContainText("-");
  await expect(page.locator(".task-time-negative")).toContainText("consumes more human time");

  await page.getByLabel("What work do you want to estimate?").selectOption("software_mature_repo");
  await expect(page.locator(".task-time-evidence-detail")).toContainText("Experienced developers took 19% longer");
  await expect(page.locator(".task-time-source-range")).toContainText("TT-2025-METR-MATURE-REPOS");
  await expect(page.locator(".task-time-source-range")).toContainText("-39–-19–-2%");

  await page.getByLabel("Share of cases AI can actually handle").fill("0");
  await expect(page.locator(".calibrator-result-head strong")).toHaveText("n/a");
  await expect(page.locator(".calibrator-equation")).toContainText("No net range is calculated at 0% eligibility");

  const operationalRouter = page.locator("#operational-router");
  await operationalRouter.getByRole("button", { name: /Build the test plan/ }).click();
  await expect(page.locator("#pilot-plan .pilot-specs p").filter({ hasText: "Live collection at this volume" }).locator("strong")).toHaveText("n/a");
  await operationalRouter.getByRole("button", { name: /Enter observed results/ }).click();
  await expect(page.locator("#evidence-gate .evidence-impact p").filter({ hasText: "Planning envelope" }).locator("strong")).toHaveText("n/a");
});

test("task-time explanation separates the user's input from the study value", async ({ page }) => {
  for (const route of ["/", "/fr/"]) {
    await page.goto(route);
    await page.locator("#operational-workspace > summary").click();
    const calibrator = page.locator("#calibrator");
    await calibrator.getByLabel(route === "/" ? "What work do you want to estimate?" : "Quel travail voulez-vous estimer ?").selectOption("knowledge_analysis");
    const explanation = calibrator.locator(".task-time-mode-effect");
    if (route === "/") {
      await expect(explanation).toContainText("you entered this much remaining human work: 33 min");
      await expect(explanation).toContainText("study implies this much remaining human work: 44.9 min");
      await expect(explanation).toContainText("After applying your coverage settings, the human work retained is: 44.9 min");
    } else {
      await expect(explanation).toContainText("vous avez indiqué ce temps humain restant : 33 min");
      await expect(explanation).toContainText("étude comparable suggère ce temps humain restant : 44,9 min");
      await expect(explanation).toContainText("Après application de vos réglages de périmètre, le temps humain retenu est : 44,9 min");
    }
  }
});

test("an invalid complete-workload denominator never becomes a zero planning range", async ({ page }) => {
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const calibrator = page.locator("#calibrator");
  await calibrator.getByLabel("Total human hours per month for all cases").fill("1");
  await expect(calibrator.locator(".calibrator-result-head strong")).toHaveText("n/a");
  await expect(calibrator.locator(".task-time-negative")).toContainText("eligible cases already account for more baseline time");

  const router = page.locator("#operational-router");
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await expect(page.locator("#evidence-gate .evidence-impact p").filter({ hasText: "Planning envelope" }).locator("strong")).toHaveText("n/a");
});

test("changing a valid design to an incompatible mode blocks freeze and export", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  await page.locator("#calibrator").getByRole("button", { name: /Copilot 01/ }).click();
  await expect(page.locator("#calibrator .calibrator-coherence-gate")).toContainText("A copilot keeps a person as the operator");
  const router = page.locator("#operational-router");
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.locator("#pilot-system-version").fill("Incompatible demonstration");
  await expect(page.locator(".planning-coherence-gate")).toContainText("A copilot keeps a person as the operator");
  await expect(page.getByRole("button", { name: "Freeze hypothesis v1" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Copy the pilot brief" })).toBeDisabled();
});

test("a transferable but imperfectly matched study stays usable and names every adjustment", async ({ page }) => {
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const calibrator = page.locator("#calibrator");
  await calibrator.getByLabel("What work do you want to estimate?").selectOption("professional_writing");

  const evidence = calibrator.locator(".task-time-evidence-detail");
  await expect(evidence.locator(".task-time-evidence-plain span")).toHaveText("USABLE WITH ADJUSTMENTS");
  await expect(evidence.locator(".task-time-evidence-plain p")).toContainText("differences below must be checked during your pilot");
  await expect(evidence.locator(".task-time-evidence-plain em")).toContainText("different way of sharing work");
  await expect(evidence.locator(".task-time-evidence-plain em")).toContainText("different action boundary");
  await expect(calibrator.locator(".task-time-source-range")).toHaveAttribute("data-transferable", "true");
});

test("demonstration results stay editable and cannot authorize a real decision", async ({ page }) => {
  await page.goto("/#evidence-gate");
  await page.getByRole("button", { name: "Load a demonstration result" }).click();

  const verdict = page.locator(".evidence-verdict");
  await expect(verdict).toContainText("SIMULATED RESULT · NOT AN AUTHORIZATION");
  await expect(verdict).toContainText("Replace them with observations before making a real decision");
  const totalRequests = page.getByLabel("All requests observed in the same period");
  await expect(totalRequests).not.toHaveValue("0");
  await totalRequests.fill("50");
  await expect(totalRequests).toHaveValue("50");
  await expect(verdict).toContainText("SIMULATED RESULT · NOT AN AUTHORIZATION");
  await expect(page.locator(".evidence-prerequisite input")).toBeDisabled();
  await expect(page.locator("#evidence-gate .evidence-footer button")).toBeDisabled();
});

test("a real operating card requires the frozen version, named owners, fallback, and containment rehearsal", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const router = page.locator("#operational-router");
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.locator("#pilot-system-version").fill("Support workflow v3 · model release 2026-08");
  await page.getByRole("button", { name: "Freeze hypothesis v1" }).click();
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.getByLabel("All requests observed in the same period").fill("40");
  await page.getByLabel("Eligible cases run in bounded live mode").fill("28");
  await page.getByLabel("Human active-time reduction on accepted outputs").fill("30");
  await page.getByLabel("Outputs accepted after defined review").fill("95");
  await page.getByLabel("Total baseline human time for all observed requests").fill("2400");
  await page.getByLabel("Total human time with AI for all observed requests").fill("1600");
  await page.getByLabel("Complete effect and approval trace").fill("100");
  await page.locator(".evidence-prerequisite input").check();
  await router.getByRole("button", { name: /Operate within the proof/ }).click();

  const copy = page.getByRole("button", { name: "Copy the operating card" });
  await expect(copy).toBeDisabled();
  await page.getByLabel("Workflow owner").fill("Operations lead");
  await page.getByLabel("Reachable incident owner").fill("Incident lead");
  const reviewDate = page.getByLabel("Next formal reassessment");
  const minimumReviewDate = await reviewDate.getAttribute("min");
  expect(minimumReviewDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  const dayBefore = new Date(`${minimumReviewDate!}T12:00:00Z`);
  dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);
  const laterReview = new Date(`${minimumReviewDate!}T12:00:00Z`);
  laterReview.setUTCDate(laterReview.getUTCDate() + 30);
  await reviewDate.fill(dayBefore.toISOString().slice(0, 10));
  await page.getByLabel("The manual fallback is reachable and has been tried").check();
  await page.getByLabel("The suspension and containment procedure has been rehearsed").check();
  await expect(copy).toBeDisabled();
  await reviewDate.fill(laterReview.toISOString().slice(0, 10));
  await expect(copy).toBeEnabled();
  await copy.click();
  const operatingCard = await page.evaluate(() => navigator.clipboard.readText());
  expect(operatingCard).toMatch(/Configuration ID: [0-9a-f-]{36}/);
  expect(operatingCard).toContain("Use pattern: Retrieval");
  expect(operatingCard).toContain("Territory: Switzerland + EU");
  expect(operatingCard).toContain("Evaluated system and workflow version: Support workflow v3 · model release 2026-08");
  expect(operatingCard).toContain("Manual fallback tried: yes");
  expect(operatingCard).toContain("Suspension and containment rehearsed: yes");
});

test("language switch preserves the current topic and editable scenario", async ({ page }) => {
  await page.goto("/#calibrator");
  await page.getByLabel("What work do you want to estimate?").selectOption("professional_writing");
  await page.getByLabel("Human minutes without AI").fill("90");
  await page.locator(".task-time-components > summary").first().click();
  await page.getByLabel("Verification").fill("23");
  await page.locator(".task-time-sensitivity > summary").click();
  await page.getByLabel("What should guide the calculation?").selectOption("local");
  await page.getByLabel("Use three editable demonstration scenarios").check();
  await page.getByLabel("Cautious: extra review minutes per case").fill("12");
  await page.locator(".site-header .lang").click();

  await expect(page).toHaveURL(/\/fr\/#calibrator$/);
  await expect(page.getByLabel("Quel travail voulez-vous estimer ?")).toHaveValue("professional_writing");
  await expect(page.getByLabel("Minutes humaines sans IA")).toHaveValue("90");
  await expect(page.getByLabel("Vérification", { exact: true })).toHaveValue("23");
  await expect(page.locator(".task-time-sensitivity select")).toHaveValue("local");
  await expect(page.locator(".task-time-demo-toggle input")).toBeChecked();
  await expect(page.locator('.task-time-sensitivity input[type="number"]').first()).toHaveValue("12");
  await expect(page.locator(".calibrator-result-head small")).toContainText("scénarios de démonstration");
  await expect(page.locator("#operational-workspace")).toHaveAttribute("open", "");
  await expect(page.locator("#calibrator")).toBeVisible();
});

test("language switch preserves the frozen evidence identity and operating controls", async ({ page }) => {
  const longVersion = `Support workflow v3 · ${"verified-component-".repeat(7)}`;
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const router = page.locator("#operational-router");
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.locator("#pilot-system-version").fill(longVersion);
  await page.getByRole("button", { name: "Freeze hypothesis v1" }).click();
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.getByLabel("All requests observed in the same period").fill("40");
  await page.getByLabel("Eligible cases run in bounded live mode").fill("28");
  await page.getByLabel("Total baseline human time for all observed requests").fill("2400");
  await page.getByLabel("Total human time with AI for all observed requests").fill("1600");
  await page.getByLabel("Outputs accepted after defined review").fill("95");
  await page.getByLabel("Complete effect and approval trace").fill("100");
  await page.locator(".evidence-prerequisite input").check();
  await router.getByRole("button", { name: /Prepare field feedback/ }).click();
  const identityText = await page.getByLabel("System + workflow version").locator("..").locator("small").innerText();
  const configurationId = identityText.replace("Locked to ", "");
  expect(configurationId).toMatch(/^[0-9a-f-]{36}$/);

  await router.getByRole("button", { name: /Operate within the proof/ }).click();
  await page.getByLabel("Workflow owner").fill("Operations lead");
  await page.getByLabel("Reachable incident owner").fill("Incident lead");
  await page.getByLabel("Next formal reassessment").fill("2026-10-01");
  await page.getByLabel("The manual fallback is reachable and has been tried").check();
  await page.getByLabel("The suspension and containment procedure has been rehearsed").check();
  await page.locator(".site-header .lang").click();

  await expect(page).toHaveURL(/\/fr\/#operations$/);
  await expect(page.getByLabel("Responsable du processus")).toHaveValue("Operations lead");
  await expect(page.getByLabel("Responsable d’incident joignable")).toHaveValue("Incident lead");
  await expect(page.getByLabel("Prochaine réévaluation formelle")).toHaveValue("2026-10-01");
  await expect(page.getByLabel("La solution de repli manuelle est accessible et a été essayée")).toBeChecked();
  await expect(page.getByLabel("La procédure d’arrêt et de confinement a été répétée")).toBeChecked();
  await router.getByRole("button", { name: /Préparer le retour terrain/ }).click();
  const fieldVersion = page.locator("#field-pilot").getByLabel("Version du système et du processus");
  await expect(fieldVersion).toHaveValue(longVersion);
  await expect(fieldVersion.locator("..").locator("small")).toContainText(configurationId);
});

for (const beginnerLocale of [
  {
    path: "/",
    verdict: "EXAMPLE ONLY · NOT USED IN THE CALCULATION",
    summary: "No one measured the complete work before and after, so these figures do not enter your calculation.",
    use: "The figure remains visible for context, but it is not added to your estimated saving.",
    details: "See what was measured and what it does not prove",
    measured: "The study did not time people completing the same task with and without AI.",
    gradeHelp: "What do A to E mean?",
    gradeMeaning: "Synthetic estimate or planning assumption",
    calculation: "See the exact calculation",
  },
  {
    path: "/fr/",
    verdict: "EXEMPLE SEULEMENT · NON UTILISÉ DANS LE CALCUL",
    summary: "Personne n’a mesuré le travail complet avant et après, donc ces chiffres n’entrent pas dans votre calcul.",
    use: "Le chiffre reste visible pour vous informer, mais il n’est pas ajouté au gain estimé.",
    details: "Voir ce qui a été mesuré et ce que cela ne prouve pas",
    measured: "L’étude n’a pas chronométré des personnes réalisant la même tâche avec et sans IA.",
    gradeHelp: "Que signifient les lettres A à E ?",
    gradeMeaning: "Estimation synthétique ou hypothèse de planification",
    calculation: "Voir le calcul exact",
  },
] as const) {
  test(`${beginnerLocale.path} evidence starts with a beginner verdict and keeps methodology optional`, async ({ page }) => {
    await page.goto(beginnerLocale.path);
    await page.locator("#operational-workspace > summary").click();
    const evidence = page.locator(".task-time-evidence-detail");
    await page.locator('.task-time-evidence-options input[value="TT-2025-ANTHROPIC-MODEL-ESTIMATE"]').check();
    await expect(evidence.locator(".task-time-evidence-plain span")).toHaveText(beginnerLocale.verdict);
    await expect(evidence.locator(".task-time-evidence-plain strong")).toContainText(beginnerLocale.summary);
    await expect(evidence.locator(".task-time-evidence-plain p")).toHaveText(beginnerLocale.use);

    const methodology = evidence.locator("> details");
    await expect(methodology).not.toHaveAttribute("open", "");
    await methodology.locator("summary").click();
    await expect(methodology).toContainText(beginnerLocale.measured);

    const gradeHelp = page.locator(".task-time-grade-help");
    await gradeHelp.locator("summary").click();
    await expect(gradeHelp).toContainText(beginnerLocale.gradeMeaning);

    const calculation = page.locator(".calibrator-equation-details");
    await expect(calculation).not.toHaveAttribute("open", "");
    await expect(calculation.locator("summary")).toContainText(beginnerLocale.calculation);
  });
}

test("zero eligibility keeps the recurring assumption separate from unavailable setup allocation", async ({ page }) => {
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  await page.getByLabel("Share of cases AI can actually handle").fill("0");

  await expect(page.locator(".task-time-mode-effect")).toContainText("33 min");
  await expect(page.locator(".task-time-mode-effect")).toContainText("45%");
  await expect(page.locator(".task-time-mode-effect")).toContainText("Setup per case and the net result remain unavailable");
  await expect(page.locator('.calibrator-result-grid p[data-metric="recurring-time"] strong')).toHaveText("33 min");
  await expect(page.locator('.calibrator-result-grid p[data-metric="recurring-gain"] strong')).toHaveText("45%");
  await expect(page.locator('.calibrator-result-grid p[data-metric="setup"] strong')).toHaveText("n/a");
  await expect(page.locator('.calibrator-result-grid p[data-metric="net-time"] strong')).toHaveText("n/a");
});

for (const zeroEligibilityLocale of [
  {
    path: "/",
    eligible: "Share of cases AI can actually handle",
    plan: /Build the test plan/,
    freeze: "Freeze hypothesis v1",
    panel: /Prepare field feedback/,
    download: "Download the local draft",
    wholeRange: "Exact whole-workload range, low / central / high: n/a · no eligible case",
    eligibleRange: "Exact eligible-case range, low / central / high: n/a · no eligible case",
    setup: "Setup allocation: 40 h / 12 months = n/a · no eligible case",
    falseZero: "= 0 min/eligible case",
  },
  {
    path: "/fr/",
    eligible: "Part des cas que l’IA peut réellement traiter",
    plan: /Construire le plan de test/,
    freeze: "Figer l’hypothèse v1",
    panel: /Préparer le retour terrain/,
    download: "Télécharger le brouillon local",
    wholeRange: "Fourchette exacte sur toute la charge, basse / centrale / haute: n/a · aucun cas éligible",
    eligibleRange: "Fourchette exacte par cas éligible, basse / centrale / haute: n/a · aucun cas éligible",
    setup: "Répartition de la mise en place: 40 h / 12 mois = n/a · aucun cas éligible",
    falseZero: "= 0 min/cas éligible",
  },
] as const) {
  test(`${zeroEligibilityLocale.path} export preserves unavailable ranges at zero eligibility`, async ({ page }) => {
    await page.goto(zeroEligibilityLocale.path);
    await page.locator("#operational-workspace > summary").click();
    await page.getByLabel(zeroEligibilityLocale.eligible).fill("0");
    const router = page.locator("#operational-router");
    await router.getByRole("button", { name: zeroEligibilityLocale.plan }).click();
    await page.locator("#pilot-system-version").fill("Demonstration workflow v1");
    await page.getByRole("button", { name: zeroEligibilityLocale.freeze }).click();
    await router.getByRole("button", { name: zeroEligibilityLocale.panel }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: zeroEligibilityLocale.download }).click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).not.toBeNull();
    const report = await readFile(path!, "utf8");
    expect(report).toContain(zeroEligibilityLocale.wholeRange);
    expect(report).toContain(zeroEligibilityLocale.eligibleRange);
    expect(report).toContain(zeroEligibilityLocale.setup);
    expect(report).not.toContain("0 / 0 / 0%");
    expect(report).not.toContain(zeroEligibilityLocale.falseZero);
  });
}

test("whole-workload result uses total observed human time and rejects a positive gain at zero accepted outputs", async ({ page }) => {
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const router = page.locator("#operational-router");
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.locator("#pilot-system-version").fill("Demonstration workflow v1");
  await page.getByRole("button", { name: "Freeze hypothesis v1" }).click();
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.getByLabel("All requests observed in the same period").fill("40");
  await page.getByLabel("Eligible cases run in bounded live mode").fill("40");
  await page.getByLabel("Total baseline human time for all observed requests").fill("1200");
  await page.getByLabel("Total human time with AI for all observed requests").fill("600");
  await page.getByLabel("Outputs accepted after defined review").fill("0");
  await page.locator(".evidence-prerequisite input").check();
  await expect(page.locator('#evidence-gate .evidence-impact p[data-metric="raw-whole-load"] strong')).toHaveText("50%");
  await expect(page.locator('#evidence-gate .evidence-impact p[data-metric="decision-whole-load"] strong')).toHaveText("0%");
  await expect(page.locator("#evidence-gate .evidence-ledger li").filter({ hasText: "Value on accepted cases" })).toContainText("n/a");
  await expect(page.locator("#evidence-gate .evidence-impact p").filter({ hasText: "Human hours projected" }).locator("strong")).toHaveText("0 h");
  await page.getByLabel("Outputs accepted after defined review").fill("93");
  await page.locator(".evidence-prerequisite input").check();
  await expect(page.locator('#evidence-gate .evidence-impact p[data-metric="decision-whole-load"] strong')).toHaveText("50%");
});

for (const zeroAcceptanceLocale of [
  { path: "/", plan: /Build the test plan/, freeze: "Freeze hypothesis v1", evidence: /Enter observed results/, baseline: "Total baseline human time for all observed requests", ai: "Total human time with AI for all observed requests", quality: "Outputs accepted after defined review", panel: /Prepare field feedback/, download: "Download the local draft", raw: "Raw calculation: (1200 − 600) / 1200 = 50%", adjusted: "Decision-adjusted whole-workload reduction: 0%", reason: "capped at 0% because no output was accepted" },
  { path: "/fr/", plan: /Construire le plan de test/, freeze: "Figer l’hypothèse v1", evidence: /Saisir les résultats observés/, baseline: "Temps humain initial total pour toutes les demandes observées", ai: "Temps humain total avec IA pour toutes les demandes observées", quality: "Sorties acceptées après la revue définie", panel: /Préparer le retour terrain/, download: "Télécharger le brouillon local", raw: "Calcul brut: (1200 − 600) / 1200 = 50%", adjusted: "Réduction sur toute la charge retenue pour la décision: 0%", reason: "plafonnée à 0 %, car aucune sortie n’a été acceptée" },
] as const) {
  test(`${zeroAcceptanceLocale.path} export separates raw time change from the zero-acceptance decision result`, async ({ page }) => {
    await page.goto(zeroAcceptanceLocale.path);
    await page.locator("#operational-workspace > summary").click();
    const router = page.locator("#operational-router");
    await router.getByRole("button", { name: zeroAcceptanceLocale.plan }).click();
    await page.locator("#pilot-system-version").fill("Demonstration workflow v1");
    await page.getByRole("button", { name: zeroAcceptanceLocale.freeze }).click();
    await router.getByRole("button", { name: zeroAcceptanceLocale.evidence }).click();
    await page.getByLabel(zeroAcceptanceLocale.baseline).fill("1200");
    await page.getByLabel(zeroAcceptanceLocale.ai).fill("600");
    await page.getByLabel(zeroAcceptanceLocale.quality).fill("0");
    await router.getByRole("button", { name: zeroAcceptanceLocale.panel }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: zeroAcceptanceLocale.download }).click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).not.toBeNull();
    const report = await readFile(path!, "utf8");
    expect(report).toContain(zeroAcceptanceLocale.raw);
    expect(report).toContain(zeroAcceptanceLocale.adjusted);
    expect(report).toContain(zeroAcceptanceLocale.reason);
  });
}

test("evidence from v1 cannot authorize a changed v2 configuration without explicit reconfirmation", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const router = page.locator("#operational-router");
  const calibrator = page.locator("#calibrator");
  await calibrator.getByLabel("What work do you want to estimate?").selectOption("professional_writing");
  await calibrator.getByRole("button", { name: /Copilot 01/ }).click();
  await page.locator("#operational-router").getByRole("button", { name: /Prepare field feedback/ }).click();
  await page.locator("#field-pilot").getByLabel("Exact action boundary").selectOption("1");
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.locator("#pilot-system-version").fill("Demonstration workflow v1");
  await page.getByRole("button", { name: "Freeze hypothesis v1" }).click();
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.getByLabel("All requests observed in the same period").fill("40");
  await page.getByLabel("Eligible cases run in bounded live mode").fill("28");
  await page.getByLabel("Human active-time reduction on accepted outputs").fill("30");
  await page.getByLabel("Outputs accepted after defined review").fill("95");
  await page.getByLabel("Total baseline human time for all observed requests").fill("2400");
  await page.getByLabel("Total human time with AI for all observed requests").fill("1600");
  await page.getByLabel("Complete effect and approval trace").fill("100");
  await page.locator(".evidence-prerequisite input").check();
  await page.getByRole("button", { name: "Copy the gate decision" }).click();
  const v1Memo = await page.evaluate(() => navigator.clipboard.readText());
  const v1Configuration = v1Memo.match(/Configuration ID: ([0-9a-f-]{36})/)?.[1];
  expect(v1Configuration).toBeTruthy();
  expect(v1Memo).toContain("Evaluated system and workflow version: Demonstration workflow v1");

  await page.locator("#concept-library > summary").click();
  await page.locator(".use-pattern-grid button").first().click();
  await page.locator(".jurisdiction-options button").nth(1).click();
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.locator("#pilot-system-version").fill("Demonstration workflow v2");
  await page.getByRole("button", { name: "Freeze recalibration v2" }).click();
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await expect(page.locator(".evidence-prerequisite input")).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Copy the gate decision" })).toBeDisabled();
  await router.getByRole("button", { name: /Operate within the proof/ }).click();
  await expect(page.getByRole("button", { name: "Copy the operating card" })).toBeDisabled();

  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.locator(".evidence-prerequisite input").check();
  await page.getByRole("button", { name: "Copy the gate decision" }).click();
  const v2Memo = await page.evaluate(() => navigator.clipboard.readText());
  const v2Configuration = v2Memo.match(/Configuration ID: ([0-9a-f-]{36})/)?.[1];
  expect(v2Configuration).toBeTruthy();
  expect(v2Configuration).not.toBe(v1Configuration);
  expect(v2Memo).toContain("Use pattern: Generation");
  expect(v2Memo).toContain("Territory: European Union");
  expect(v2Memo).toContain("Evaluated system and workflow version: Demonstration workflow v2");

  await router.getByRole("button", { name: /Operate within the proof/ }).click();
  await page.getByLabel("Workflow owner").fill("Operations lead");
  await page.getByLabel("Reachable incident owner").fill("Incident lead");
  const reviewDate = page.getByLabel("Next formal reassessment");
  const minimumReviewDate = await reviewDate.getAttribute("min");
  const laterReview = new Date(`${minimumReviewDate!}T12:00:00Z`);
  laterReview.setUTCDate(laterReview.getUTCDate() + 30);
  await reviewDate.fill(laterReview.toISOString().slice(0, 10));
  await page.getByLabel("The manual fallback is reachable and has been tried").check();
  await page.getByLabel("The suspension and containment procedure has been rehearsed").check();
  await page.getByRole("button", { name: "Copy the operating card" }).click();
  const v2OperatingCard = await page.evaluate(() => navigator.clipboard.readText());
  expect(v2OperatingCard).toContain(`Configuration ID: ${v2Configuration}`);
  expect(v2OperatingCard).toContain("Use pattern: Generation");
  expect(v2OperatingCard).toContain("Territory: European Union");
  expect(v2OperatingCard).toContain("Evaluated system and workflow version: Demonstration workflow v2");

  await router.getByRole("button", { name: /Prepare field feedback/ }).click();
  await expect(page.locator(".planning-freeze-warning")).toContainText("Comparison locked to evaluated v2");
  const fieldDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download the local draft" }).click();
  const fieldReportPath = await (await fieldDownload).path();
  expect(fieldReportPath).not.toBeNull();
  const fieldReport = await readFile(fieldReportPath!, "utf8");
  expect(fieldReport).toContain("## Evaluated frozen hypothesis");
  expect(fieldReport).toContain(`Snapshot identity: ${v2Configuration} · v2`);
  expect(fieldReport).toContain("### Original v1 planning reference");
  expect(fieldReport).toContain(`Snapshot identity: ${v1Configuration} · v1`);
});

test("field comparison rounds negative half-values exactly as the interface displays them", async ({ page }) => {
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const router = page.locator("#operational-router");
  const calibrator = page.locator("#calibrator");
  await calibrator.locator(".task-time-components > summary").first().click();
  await calibrator.getByLabel("Verification").fill("42");
  await calibrator.getByLabel("One-off setup effort").fill("0");
  await expect(calibrator.locator(".calibrator-result-head strong")).toHaveText("0%");

  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.locator("#pilot-system-version").fill("Demonstration workflow v1");
  await page.getByRole("button", { name: "Freeze hypothesis v1" }).click();
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.getByLabel("Eligible cases run in bounded live mode").fill("40");
  await page.getByLabel("All requests observed in the same period").fill("40");
  await page.getByLabel("Total baseline human time for all observed requests").fill("2000");
  await page.getByLabel("Total human time with AI for all observed requests").fill("2001");
  await page.getByLabel("Outputs accepted after defined review").fill("95");
  await page.getByLabel("Complete effect and approval trace").fill("100");
  await page.locator(".evidence-prerequisite input").check();
  await router.getByRole("button", { name: /Prepare field feedback/ }).click();

  const evidence = page.locator("#field-pilot .field-pilot-evidence");
  await expect(evidence.getByText("OBSERVED WHOLE LOAD").locator("..").locator("strong")).toHaveText("-0.1%");
  await expect(evidence.getByText("RANGE CHECK").locator("..").locator("strong")).toHaveText("BELOW");
});

test("copied pilot brief preserves the human-time and setup assumptions", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const calibrator = page.locator("#calibrator");
  await calibrator.getByLabel("What work do you want to estimate?").selectOption("professional_writing");
  await calibrator.getByRole("button", { name: /Copilot 01/ }).click();
  await calibrator.locator(".task-time-components > summary").first().click();
  await calibrator.getByLabel("Preparation and context").fill("7");
  await calibrator.getByLabel("Supervision").fill("6");
  await calibrator.getByLabel("Verification").fill("18");
  await calibrator.getByLabel("Corrections").fill("4");
  await calibrator.getByLabel("Cases needing exception work").fill("25");
  await calibrator.getByLabel("Minutes per exception").fill("12");

  await page.locator("#operational-router").getByRole("button", { name: /Prepare field feedback/ }).click();
  await page.locator("#field-pilot").getByLabel("Exact action boundary").selectOption("1");
  await page.locator("#operational-router").getByRole("button", { name: /Build the test plan/ }).click();
  await page.getByRole("button", { name: "Copy the pilot brief" }).click();
  const brief = await page.evaluate(() => navigator.clipboard.readText());
  expect(brief).toContain("Work mode: Copilot");
  expect(brief).toContain("Architecture: Tool-assisted workflow");
  expect(brief).toContain("Exact action boundary: A1 · research or draft");
  expect(brief).toContain("Transfer contract: professional_writing · copilot · reviewed · mixed");
  expect(brief).toContain("Net method: greater of adjusted source residual and local human-work floor, plus extra work absent from both and local amortized setup");
  expect(brief).toContain("Human-work floor: 7 prep + 6 supervision + 18 verification + 4 correction + 3 expected exceptions = 38 min/case");
  expect(brief).toContain("Exception assumption: 25% of eligible cases · 12 min each");
  expect(brief).toContain("Setup allocation: 8 h over 12 months");
});

for (const fieldLocale of [
  { path: "/", task: "What work do you want to estimate?", level: /Copilot 01/, plan: /Build the test plan/, freeze: "Freeze hypothesis v1", evidence: /Enter observed results/, baseline: "Total baseline human time for all observed requests", ai: "Total human time with AI for all observed requests", panel: /Prepare field feedback/, download: "Download the local draft", planned: "PLANNING RESULT", observed: "OBSERVED WHOLE LOAD", hypothesis: "Evaluated frozen hypothesis", recalibration: "Observation and recalibration", volume: "40 cases/month", denominator: "1200 − 771", risk: "R1 · assistance with review" },
  { path: "/fr/", task: "Quel travail voulez-vous estimer ?", level: /Copilote 01/, plan: /Construire le plan de test/, freeze: "Figer l’hypothèse v1", evidence: /Saisir les résultats observés/, baseline: "Temps humain initial total pour toutes les demandes observées", ai: "Temps humain total avec IA pour toutes les demandes observées", panel: /Préparer le retour terrain/, download: "Télécharger le brouillon local", planned: "RÉSULTAT DE PLANIFICATION", observed: "CHARGE TOTALE OBSERVÉE", hypothesis: "Hypothèse figée évaluée", recalibration: "Observation et recalibrage", volume: "40 cas/mois", denominator: "1200 − 771", risk: "R1 · assistance avec relecture" },
] as const) {
  test(`${fieldLocale.path} field draft keeps the extrapolated range beside the observation`, async ({ page }) => {
    await page.goto(fieldLocale.path);
    await page.locator("#operational-workspace > summary").click();
    await page.locator("#calibrator").getByLabel(fieldLocale.task).selectOption("professional_writing");
    await page.locator("#calibrator").getByRole("button", { name: fieldLocale.level }).click();
    const router = page.locator("#operational-router");
    await router.getByRole("button", { name: fieldLocale.panel }).click();
    await page.locator("#field-pilot .field-pilot-selects select").nth(3).selectOption("1");
    await router.getByRole("button", { name: fieldLocale.plan }).click();
    await page.locator("#pilot-system-version").fill("Demonstration workflow v1");
    await page.getByRole("button", { name: fieldLocale.freeze }).click();
    await router.getByRole("button", { name: fieldLocale.evidence }).click();
    await page.getByRole("button", { name: /Load a demonstration result|Charger un résultat de démonstration/ }).click();
    await page.getByLabel(fieldLocale.baseline).fill("1200");
    await page.getByLabel(fieldLocale.ai).fill("771");
    await page.locator(".evidence-prerequisite input").check();
    await router.getByRole("button", { name: fieldLocale.panel }).click();

    const evidence = page.locator("#field-pilot .field-pilot-evidence");
    await expect(evidence).toContainText(fieldLocale.planned);
    await expect(evidence).toContainText(fieldLocale.observed);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: fieldLocale.download }).click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).not.toBeNull();
    const report = await readFile(path!, "utf8");
    expect(report).toContain(fieldLocale.hypothesis);
    expect(report).toContain("TT-2023-NOY-ZHANG-WRITING");
    expect(report).toContain(fieldLocale.recalibration);
    expect(report).toContain(fieldLocale.volume);
    expect(report).toContain(fieldLocale.denominator);
    expect(report).toContain(fieldLocale.risk);
    expect(report).toContain("1.0.0 · 2026-09-05");
  });
}

test("any field-report mutation invalidates confirmation and all six publication checks", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  const router = page.locator("#operational-router");
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.locator("#pilot-system-version").fill("Demonstration workflow v1");
  await page.getByRole("button", { name: "Freeze hypothesis v1" }).click();
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.getByRole("button", { name: "Load a demonstration result" }).click();
  await page.locator(".evidence-prerequisite input").check();
  await router.getByRole("button", { name: /Prepare field feedback/ }).click();

  await page.getByLabel("Non-identifying project alias").fill("Workshop North");
  await expect(page.locator("#field-pilot").getByLabel("System + workflow version")).toHaveValue("Demonstration workflow v1");
  await page.getByLabel("Exact workflow observed").fill("One bounded request from intake to reviewed output.");
  await page.getByLabel("Observation start").fill("2026-08-01");
  await page.getByLabel("Observation end").fill("2026-08-21");
  await page.getByLabel("Why observation differs from the hypothesis").fill("The measured case mix had more exceptions than the planning sample.");
  await page.getByLabel("Hypothesis and decision after observation").fill("Retain v1; no recalibration required.");
  await page.getByLabel("Where the result may transfer").fill("Same bounded workflow, permissions, review gate, and operator profile.");
  await page.getByLabel("What this result does not prove").fill("It does not prove gains for another workflow, model, or autonomy level.");
  const confirmation = page.locator(".field-pilot-evidence-confirm input");
  const reviewChecks = page.locator(".field-pilot-checklist input");
  const approveCurrentReport = async () => {
    await router.getByRole("button", { name: /Enter observed results/ }).click();
    const observationConfirmation = page.locator(".evidence-prerequisite input");
    if (!(await observationConfirmation.isChecked())) await observationConfirmation.check();
    await router.getByRole("button", { name: /Prepare field feedback/ }).click();
    await confirmation.check();
    for (let index = 0; index < 6; index += 1) await reviewChecks.nth(index).check();
    await expect(page.locator(".field-pilot-status")).toContainText("READY FOR INDEPENDENT REVIEW");
    await expect(page.locator(".field-pilot-status strong")).toHaveText("16/16");
  };
  const expectReviewInvalidated = async () => {
    await expect(confirmation).not.toBeChecked();
    await expect(reviewChecks).toHaveCount(6);
    for (let index = 0; index < 6; index += 1) await expect(reviewChecks.nth(index)).not.toBeChecked();
  };
  await approveCurrentReport();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download the local draft" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const readyReport = await readFile(path!, "utf8");
  expect(readyReport).not.toContain("[TO COMPLETE]");
  expect(readyReport).toContain("## Evaluated frozen hypothesis");
  expect(readyReport).toContain("Hypothesis and decision after observation: Retain v1; no recalibration required.");
  expect(readyReport).not.toContain("Original v1 planning reference");

  await page.locator("#concept-library > summary").click();
  await page.locator("#use-patterns .jurisdiction-options button").first().click();
  await router.getByRole("button", { name: /Prepare field feedback/ }).click();
  await expectReviewInvalidated();
  await expect(page.locator(".field-pilot-evidence-confirm input")).toBeDisabled();
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.getByRole("button", { name: "Freeze recalibration v2" }).click();
  await approveCurrentReport();

  await page.locator("#use-patterns .use-pattern-grid button").first().click();
  await router.getByRole("button", { name: /Prepare field feedback/ }).click();
  await expectReviewInvalidated();
  await expect(confirmation).toBeDisabled();
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.getByRole("button", { name: "Freeze recalibration v3" }).click();
  await approveCurrentReport();

  await page.locator("#implementation-library > summary").click();
  await page.locator("#paths .path-card").nth(1).click();
  await router.getByRole("button", { name: /Prepare field feedback/ }).click();
  await expectReviewInvalidated();
  await expect(confirmation).toBeDisabled();
  await router.getByRole("button", { name: /Build the test plan/ }).click();
  await page.getByRole("button", { name: "Freeze recalibration v4" }).click();
  await approveCurrentReport();

  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.getByLabel("Total baseline human time for all observed requests").fill("1300");
  await router.getByRole("button", { name: /Prepare field feedback/ }).click();
  await expectReviewInvalidated();

  await expect(confirmation).toBeDisabled();
  await router.getByRole("button", { name: /Enter observed results/ }).click();
  await page.locator(".evidence-prerequisite input").check();
  await router.getByRole("button", { name: /Prepare field feedback/ }).click();
  await confirmation.check();
  await expect(page.locator(".field-pilot-status")).not.toContainText("READY FOR INDEPENDENT REVIEW");
  await expect(page.locator(".field-pilot-status strong")).toHaveText("10/16");
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

  const workModes = page.locator(".guide-levels button");
  const architectures = page.locator(".guide-architectures button");
  const actionBoundaries = page.locator(".guide-autonomy button");
  const designNext = page.locator(".guided-controls .guide-next");
  await workModes.first().click();
  await architectures.first().click();
  await actionBoundaries.nth(4).click();
  const hardBlocker = page.locator(".design-coherence-blocker");
  await expect(hardBlocker).toContainText("A copilot keeps a person as the operator");
  await expect(hardBlocker).toContainText("One model without connected tools cannot perform an A2 to A4 action");
  await expect(hardBlocker.locator("input")).toHaveCount(0);
  await expect(designNext).toBeDisabled();
  await workModes.nth(1).click();
  await architectures.nth(2).click();
  await expect(page.locator(".design-coherence-a4")).toContainText("A4 is disabled by default");
  await expect(designNext).toBeDisabled();
  await page.locator(".design-coherence-a4 input").check();
  await expect(designNext).toBeEnabled();
  await workModes.nth(2).click();
  await expect(actionBoundaries.nth(4)).toHaveAttribute("aria-pressed", "true");
  await expect(architectures.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(designNext).toBeDisabled();
  await actionBoundaries.first().click();
  await expect(page.locator(".design-coherence")).toContainText("Strong automation at A0 or A1");
  await page.locator(".design-coherence input").check();
  await expect(designNext).toBeEnabled();
  await workModes.first().click();
  await expect(actionBoundaries.first()).toHaveAttribute("aria-pressed", "true");
  await architectures.first().click();
  await actionBoundaries.nth(1).click();
  await expect(workModes.first()).toHaveAttribute("aria-pressed", "true");
  await expect(architectures.first()).toHaveAttribute("aria-pressed", "true");
  await expect(designNext).toBeEnabled();
  await designNext.click();
  await page.locator(".guide-jurisdictions button").first().click();
  await page.locator(".guided-controls .guide-next").click();

  await expect(page.locator(".guided-result")).toContainText("SME");
  await expect(page.locator(".guided-result")).toContainText("Conversation");
  await expect(page.locator(".guided-result")).toContainText("Copilot");
  await expect(page.locator(".guided-result")).toContainText("One model or assistant");
  await expect(page.locator(".guided-result")).toContainText("A1");
  await expect(page.locator(".guided-result")).toContainText("Switzerland");
});

test("A4 adds its autonomy controls to the lifecycle and keeps the security phase incomplete until checked", async ({ page }) => {
  await page.goto("/");
  await page.locator(".guide-audiences button").first().click();
  await page.locator(".guided-controls .guide-next").click();
  await page.locator(".guide-patterns button").last().click();
  await page.locator(".guided-controls .guide-next").click();
  await page.locator(".guide-levels button").nth(1).click();
  await page.locator(".guide-architectures button").nth(2).click();
  await page.locator(".guide-autonomy button").nth(4).click();
  await page.locator(".design-coherence-a4 input").check();

  await page.locator("#implementation-library > summary").click();
  await page.locator("#implementation-library > .guide-chapter-content > .chapter-router nav button").nth(2).click();
  const workbench = page.locator("#lifecycle-workbench");
  await workbench.locator('.lifecycle-nav button[data-phase="7"]').click();

  for (const controlId of ["SEC-ACTION", "SEC-EFFECT", "SEC-AUTONOMY", "SEC-A4"]) {
    await expect(workbench.locator(`.security-builder input[name="${controlId}"]`)).toHaveCount(1);
  }
  await expect(workbench.locator(".lifecycle-phase footer p")).toHaveAttribute("data-ready", "false");
  const controls = workbench.locator(".security-builder input");
  for (let index = 0; index < await controls.count(); index += 1) await controls.nth(index).check();
  await expect(workbench.locator(".lifecycle-phase footer p")).toHaveAttribute("data-ready", "true");
});

test("the lifecycle separates the selected architecture from the simpler recommended start", async ({ page }) => {
  await page.goto("/");
  await page.locator("#operational-workspace > summary").click();
  await page.locator("#operational-router").getByRole("button", { name: /Prepare field feedback/ }).click();
  await page.locator("#field-pilot").getByLabel("Work mode").selectOption("agency");
  await page.locator("#field-pilot").getByLabel("Architecture").selectOption("agency");

  await page.locator("#implementation-library > summary").click();
  await page.locator("#implementation-library > .guide-chapter-content > .chapter-router nav button").nth(2).click();
  const workbench = page.locator("#lifecycle-workbench");
  await workbench.locator('.lifecycle-nav button[data-phase="5"]').click();
  const result = workbench.locator(".lifecycle-result");
  await expect(result).toContainText("Selected design: Retrieval · Orchestrated agent team");
  await expect(result).toContainText("Recommended starting design: Start with one bounded business agent");
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
  await expect(page.locator(".case-evidence-boundary")).toContainText("calls this grade E");
  await expect(page.locator(".case-evidence-boundary .button")).toHaveAttribute("href", "#calibrator");
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
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("R3 · rights, health, employment, public authority");
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("A2 · action after explicit approval");
});

test("connected project records stay linked, editable, and persistent", async ({ page }) => {
  test.setTimeout(60_000);
  const storageKey = "ai-adoption-playbook:project-dossier:v1";
  const openWorkbench = async () => {
    const library = page.locator("#implementation-library");
    if (!(await library.evaluate((element) => (element as HTMLDetailsElement).open))) await library.locator(":scope > summary").click();
    const workbench = page.locator("#lifecycle-workbench");
    if (!(await workbench.isVisible())) await library.locator(":scope > .guide-chapter-content > .chapter-router nav button").nth(2).click();
    await expect(page.locator("#lifecycle-workbench")).toBeVisible();
  };

  await page.goto("/");
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload();
  await openWorkbench();
  let workbench = page.locator("#lifecycle-workbench");
  const artifacts = workbench.locator(".project-artifacts-workbench");
  await expect(artifacts.locator(".artifact-router button")).toHaveCount(4);
  await workbench.locator('[name="project"]').fill("Linked project name");
  await workbench.locator('[name="owner"]').fill("Operations owner");
  await workbench.locator('[name="problem"]').fill("Observed delay in the current process");
  await workbench.locator('[name="affected"]').fill("Customers and operations staff");
  await workbench.locator('[name="decisionDate"]').fill("2026-09-30");

  const linkedName = artifacts.locator('[name="artifact-system_register-name"]');
  await expect(linkedName).toHaveValue("Linked project name");
  await expect(artifacts.locator('[data-field="name"]')).toHaveAttribute("data-mode", "linked");
  await artifacts.locator('[name="artifact-system_register-system_id"]').fill("AI-042");
  await linkedName.fill("Approved register name");
  await workbench.locator('[name="project"]').fill("Changed guide name");
  await expect(linkedName).toHaveValue("Approved register name");
  await artifacts.locator('[data-field="name"]').getByRole("button", { name: "Use linked value" }).click();
  await expect(linkedName).toHaveValue("Changed guide name");

  await artifacts.locator('button[data-artifact="risk_assessment"]').evaluate((element) => (element as HTMLButtonElement).click());
  await artifacts.locator('[name="artifact-risk_assessment-retention_transfers"]').fill("30 days in Switzerland; no supplier reuse");
  await artifacts.locator('[name="artifact-risk_assessment-harm_scenarios"]').fill("Incorrect answer could delay a customer request");

  await artifacts.locator('button[data-artifact="evaluation_plan"]').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(artifacts.locator(".artifact-pattern-note")).toContainText("retrieval coverage");
  await artifacts.locator('[name="artifact-evaluation_plan-test_provenance"]').fill("Authorized frozen cases v1");

  await artifacts.locator('button[data-artifact="implementation_checklist"]').evaluate((element) => (element as HTMLButtonElement).click());
  const mandateTask = artifacts.locator('article[data-task="phase:0"]');
  await expect(mandateTask).toHaveAttribute("data-status", "done");
  await mandateTask.getByRole("combobox", { name: /Status:/ }).selectOption("in_progress");
  await mandateTask.getByRole("textbox", { name: /Owner:/ }).fill("Programme lead");
  await mandateTask.getByLabel(/Due date:/).fill("2026-09-15");
  await mandateTask.getByRole("textbox", { name: /Evidence reference:/ }).fill("MANDATE-042");

  await expect.poll(() => page.evaluate((key) => {
    const dossier = JSON.parse(localStorage.getItem(key) ?? "null");
    return {
      schema: dossier?.schema_version,
      systemId: dossier?.artifacts?.system_register?.fields?.system_id?.value,
      retention: dossier?.artifacts?.risk_assessment?.fields?.retention_transfers?.value,
      taskStatus: dossier?.artifacts?.implementation_checklist?.items?.["phase:0"]?.status,
      taskMode: dossier?.artifacts?.implementation_checklist?.items?.["phase:0"]?.status_mode,
    };
  }, storageKey)).toEqual({ schema: "0.5.0", systemId: "AI-042", retention: "30 days in Switzerland; no supplier reuse", taskStatus: "in_progress", taskMode: "manual" });

  await page.reload();
  await openWorkbench();
  workbench = page.locator("#lifecycle-workbench");
  await expect(workbench.locator('[name="artifact-system_register-system_id"]')).toHaveValue("AI-042");
  await workbench.locator('button[data-artifact="risk_assessment"]').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(workbench.locator('[name="artifact-risk_assessment-retention_transfers"]')).toHaveValue("30 days in Switzerland; no supplier reuse");
  await workbench.locator('button[data-artifact="implementation_checklist"]').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(workbench.locator('article[data-task="phase:0"]')).toHaveAttribute("data-status", "in_progress");
  await expect(workbench.locator('article[data-task="phase:0"]')).toContainText("Status set manually.");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("local project dossier persists, exports, imports, and resets safely", async ({ page }) => {
  test.setTimeout(60_000);
  const storageKey = "ai-adoption-playbook:project-dossier:v1";
  const openWorkbench = async () => {
    const library = page.locator("#implementation-library");
    if (!(await library.evaluate((element) => (element as HTMLDetailsElement).open))) await library.locator(":scope > summary").click();
    const workbench = page.locator("#lifecycle-workbench");
    if (!(await workbench.isVisible())) await library.locator(":scope > .guide-chapter-content > .chapter-router nav button").nth(2).click();
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
      work_mode: "copilot",
      architecture: "model",
      autonomy_level: 1,
      risk_level: 2,
    },
    active_phase: 0,
    fields: { ...stored.fields, project: "Imported public assistant" },
  };
  await workbench.locator(".project-dossier-manager .dossier-file-input").setInputFiles({
    name: "project-dossier.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(imported)),
  });
  await expect(workbench.getByText("Dossier imported and guide context restored.")).toBeVisible();
  await expect(workbench.locator(".lifecycle-context")).toContainText("Public service");
  await expect(workbench.locator(".lifecycle-context")).toContainText("Conversation");
  await expect(workbench.locator(".lifecycle-context")).toContainText("European Union");
  await expect(workbench.locator('[name="project"]')).toHaveValue("Imported public assistant");

  const legacyContext = { ...imported.context, integration_level: imported.context.work_mode } as Partial<typeof imported.context> & { integration_level: string };
  delete legacyContext.work_mode;
  const legacyDossier = { ...imported, context: legacyContext };
  delete legacyDossier.change_review;
  delete (legacyDossier.context as Partial<typeof imported.context>).architecture;
  await workbench.locator(".project-dossier-manager .dossier-file-input").setInputFiles({
    name: "legacy-project-dossier.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ ...legacyDossier, schema_version: "0.2.0" })),
  });
  await expect(workbench.getByText("Older dossier updated to the current project-record format.")).toBeVisible();
  await expect(workbench.locator('[name="project"]')).toHaveValue("Imported public assistant");
  await expect.poll(() => page.evaluate((key) => {
    const dossier = JSON.parse(localStorage.getItem(key) ?? "null");
    return {
      schema: dossier?.schema_version,
      project: dossier?.fields?.project,
      artifactGroups: Object.keys(dossier?.artifacts ?? {}).sort(),
    };
  }, storageKey)).toEqual({
    schema: "0.5.0",
    project: "Imported public assistant",
    artifactGroups: ["evaluation_plan", "implementation_checklist", "risk_assessment", "system_register"],
  });

  const invalid = { ...imported, schema_version: "9.0.0", fields: { project: "Must not replace current work" } };
  await workbench.locator(".project-dossier-manager .dossier-file-input").setInputFiles({
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

test("change review compares one dossier version and reopens stale decisions", async ({ page }) => {
  test.setTimeout(60_000);
  const storageKey = "ai-adoption-playbook:project-dossier:v1";
  const openWorkbench = async () => {
    const library = page.locator("#implementation-library");
    if (!(await library.evaluate((element) => (element as HTMLDetailsElement).open))) await library.locator(":scope > summary").click();
    const workbench = page.locator("#lifecycle-workbench");
    if (!(await workbench.isVisible())) await library.locator(":scope > .guide-chapter-content > .chapter-router nav button").nth(2).evaluate((element) => (element as HTMLButtonElement).click());
    await expect(page.locator("#lifecycle-workbench")).toBeVisible();
  };

  await page.goto("/");
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload();
  await openWorkbench();
  let workbench = page.locator("#lifecycle-workbench");
  await workbench.locator('[name="project"]').fill("Reference service assistant");
  await workbench.locator('[name="owner"]').fill("Service owner");
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.fields?.project, storageKey)).toBe("Reference service assistant");
  const baseline = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null"), storageKey);
  const referenceBaseline = {
    ...baseline,
    context: { ...baseline.context, autonomy_level: 1, risk_level: 0 },
  };

  await workbench.locator('[name="project"]').fill("Current service assistant");
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.fields?.project, storageKey)).toBe("Current service assistant");
  const review = workbench.locator(".change-review-workbench");
  await review.locator(".dossier-file-input").setInputFiles({
    name: "reference-project-dossier.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(referenceBaseline)),
  });
  await expect(review.getByText("Reference loaded. Review every changed decision before closing the comparison.")).toBeVisible();
  await review.locator('button[data-change="context:autonomy_level"]').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(review.locator('article[data-change="context:autonomy_level"] .change-values section').nth(0)).toContainText("A1 · research or draft");
  await expect(review.locator('article[data-change="context:autonomy_level"] .change-values section').nth(1)).toContainText("A2 · action after explicit approval");
  await review.locator('button[data-change="context:risk_level"]').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(review.locator('article[data-change="context:risk_level"] .change-values section').nth(0)).toContainText("R0 · internal and easily checked");
  await expect(review.locator('article[data-change="context:risk_level"] .change-values section').nth(1)).toContainText("R1 · assistance with review");
  await review.locator('button[data-change="lifecycle:project"]').evaluate((element) => (element as HTMLButtonElement).click());
  let change = review.locator('article[data-change="lifecycle:project"]');
  await expect(change.locator(".change-values section").nth(0)).toContainText("Reference service assistant");
  await expect(change.locator(".change-values section").nth(1)).toContainText("Current service assistant");
  await change.getByRole("combobox", { name: /Project decision:/ }).selectOption("accepted");
  await change.getByRole("textbox", { name: /Owner:/ }).fill("Programme owner");
  await change.getByLabel(/Due date:/).fill("2026-10-01");
  await change.getByRole("textbox", { name: /Evidence reference:/ }).fill("CHANGE-001");
  await change.getByRole("textbox", { name: /Decision note:/ }).fill("Name change only; scope unchanged.");

  await expect.poll(() => page.evaluate((key) => {
    const dossier = JSON.parse(localStorage.getItem(key) ?? "null");
    return {
      schema: dossier?.schema_version,
      baseline: dossier?.change_review?.baseline?.dossier_id,
      decision: dossier?.change_review?.items?.["lifecycle:project"]?.decision,
      evidence: dossier?.change_review?.items?.["lifecycle:project"]?.evidence_ref,
    };
  }, storageKey)).toEqual({ schema: "0.5.0", baseline: baseline.dossier_id, decision: "accepted", evidence: "CHANGE-001" });

  await page.reload();
  await openWorkbench();
  workbench = page.locator("#lifecycle-workbench");
  const restoredReview = workbench.locator(".change-review-workbench");
  await restoredReview.locator('button[data-change="lifecycle:project"]').evaluate((element) => (element as HTMLButtonElement).click());
  change = restoredReview.locator('article[data-change="lifecycle:project"]');
  await expect(change.getByRole("combobox", { name: /Project decision:/ })).toHaveValue("accepted");
  await expect(change.getByRole("textbox", { name: /Evidence reference:/ })).toHaveValue("CHANGE-001");

  await workbench.locator('[name="project"]').fill("Current service assistant v2");
  await expect(change.getByRole("combobox", { name: /Project decision:/ })).toHaveValue("pending");
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.change_review?.items?.["lifecycle:project"]?.decision, storageKey)).toBe("pending");

  await restoredReview.locator(".dossier-file-input").setInputFiles({
    name: "different-project.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ ...baseline, dossier_id: "AAP-other-0001" })),
  });
  await expect(restoredReview.getByText("Choose an earlier export with the same dossier ID. A different project cannot be treated as a version.")).toBeVisible();
  await expect(restoredReview.locator('article[data-change="lifecycle:project"]')).toBeVisible();
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
});

test("rendered page has no automatic axe violations", async ({ page }) => {
  test.setTimeout(90_000);
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

    await page.locator("#operational-workspace > summary").click();
    const modeButton = page.locator("#calibrator").getByRole("button", { name: /Copilot 01/ });
    await modeButton.hover();
    await page.waitForTimeout(250);
    const modeColors = await modeButton.evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      label: getComputedStyle(element.querySelector("strong")!).color,
      code: getComputedStyle(element.querySelector("span")!).color,
    }));
    expect(modeColors).toEqual({
      background: "rgb(15, 18, 22)",
      label: "rgb(241, 245, 247)",
      code: "rgb(241, 245, 247)",
    });
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
