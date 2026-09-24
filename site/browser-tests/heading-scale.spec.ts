import { expect, test, type Page, type TestInfo } from "@playwright/test";

function widthsFor(testInfo: TestInfo) {
  if (testInfo.project.name === "mobile-light") return [320, 390];
  return testInfo.project.name === "desktop-dark" ? [1440] : [1440, 1920];
}

async function fontSize(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
}

async function expectScale(page: Page, width: number, label: string, reader = false) {
  const mobile = width <= 680;
  const headings = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((elements) => elements
    .filter((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden")
    .map((element) => ({
      tag: element.tagName,
      text: element.textContent?.trim(),
      size: parseFloat(getComputedStyle(element).fontSize),
      prose: Boolean(element.closest(".document-prose")),
      overflow: element.scrollWidth - element.clientWidth,
    })));
  expect(headings.length, label).toBeGreaterThan(0);
  for (const heading of headings) {
    const context = `${label} ${width}px ${heading.tag} ${heading.text}`;
    let maximum = mobile ? 24 : 28;
    if (heading.tag === "H1") maximum = reader ? (mobile ? 32 : 58) : (mobile ? 36 : 64);
    if (heading.tag === "H2") maximum = heading.prose ? (mobile ? 26 : 36) : (mobile ? 28 : 38);
    expect(heading.size, context).toBeLessThanOrEqual(maximum + 0.01);
    expect(heading.overflow, `${context} horizontal text overflow`).toBeLessThanOrEqual(1);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, `${label} ${width}px document overflow`).toBeLessThanOrEqual(1);
}

const sectionIds = [
  "guided-start", "geo-library", "use-patterns", "non-agentic-cases", "integration-levels",
  "calibrator", "pilot-plan", "evidence-gate", "operations", "decision-dossier", "field-pilot",
  "paths", "sectors", "method", "case", "sme-case", "mission-case", "public-case", "solo-case",
  "agent-case", "agency-case", "controls", "control-crosswalk", "toolkit",
];

for (const locale of ["en", "fr"] as const) {
  const home = locale === "fr" ? "/fr/" : "/";
  const library = locale === "fr" ? "/fr/bibliotheque/" : "/library/";
  const article = locale === "fr" ? "/fr/copilote-ou-agent-metier/" : "/copilot-vs-business-agent/";

  test(`${locale} heading scale stays compact on landing, editorial, library and reader pages`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    for (const width of widthsFor(testInfo)) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of [home, article, library, `${library}examples-tpe-customer-requests/`]) {
        await page.goto(route);
        const reader = route.startsWith(library);
        await expectScale(page, width, route, reader);
        if (reader) {
          expect(await fontSize(page, "h1"), `${route} unchanged reader H1`).toBe(width <= 680 ? 32 : 58);
          const headingSelector = route === library ? ".document-index h2" : ".document-prose h2";
          expect(await fontSize(page, headingSelector), `${route} compact H2 wins cascade`).toBe(width <= 680 ? 26 : 36);
        }
      }
      await page.goto(`${library}templates-evaluation-plan/`);
      for (const [selector, size] of [[".document-prose h3", 23], [".document-prose h4", 19]] as const) {
        // The source document may not contain every depth, but existing levels
        // must retain the reader's previous compact scale.
        if (await page.locator(selector).count()) expect(await fontSize(page, selector)).toBe(size);
      }
    }
  });

  test(`${locale} chapter states and all selected paths retain heading hierarchy`, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    for (const width of widthsFor(testInfo)) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(home);
      for (const id of sectionIds) {
        await page.goto(`${home}#${id}`);
        await expect(page.locator(`#${id}`)).toBeVisible();
        await expectScale(page, width, `#${id}`);
      }

      await page.goto(`${home}#paths`);
      const paths = page.locator(".path-grid button");
      expect(await paths.count()).toBeGreaterThan(1);
      for (let index = 0; index < await paths.count(); index += 1) {
        await paths.nth(index).click();
        await expect(paths.nth(index)).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(".plan-intro h3")).toHaveText((await paths.nth(index).locator(".path-title").textContent())!);
        expect(await fontSize(page, ".plan-intro h3"), `selected path ${index} at ${width}px`).toBeLessThan(await fontSize(page, "#paths-title"));
        await expectScale(page, width, `selected path ${index}`);
      }

      // Compact operational labels are not enlarged by the new heading scale.
      await page.goto(`${home}#pilot-plan`);
      expect(await fontSize(page, ".pilot-decision-board h3")).toBe(16);
      await page.goto(`${home}#operations`);
      expect(await fontSize(page, ".operation-monitoring h3")).toBe(14);
    }
  });
}
