import { expect, test } from "@playwright/test";

const chapterSections = ".geo-library, .use-patterns, .non-agentic-cases, .integration-guide, .calibrator, .pilot-planner, .evidence-gate, .operations, .decision-dossier, .field-pilot, .paths, .sector-lenses, .method, .worked-case, .sme-case, .mission-case, .public-case, .solo-case, .agent-case, .agency-case, .controls, .control-crosswalk, .toolkit, .ladder-section";

for (const route of ["/", "/fr/"]) {
  test(`${route} chapter content keeps its width on large desktop screens`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-light", "Explicit desktop viewport regression");
    await page.goto(route);
    await page.locator("#implementation-library > summary").click();

    for (const width of [1920, 2560, 3840, 1440, 1280]) {
      await page.setViewportSize({ width, height: 1080 });
      const sections = await page.locator(chapterSections).evaluateAll((elements) => elements.map((element) => ({
        id: element.id,
        nested: Boolean(element.closest(".guide-chapter-content")),
        left: getComputedStyle(element).paddingLeft,
        right: getComputedStyle(element).paddingRight,
      })));
      expect(sections.length).toBeGreaterThan(20);
      for (const section of sections) {
        expect(section.nested, section.id).toBe(true);
        expect(section.left, `${section.id} at ${width}px`).toBe("40px");
        expect(section.right, `${section.id} at ${width}px`).toBe("40px");
      }

      // Check local geometry: overflow:clip on ancestors can hide this bug
      // from a document-level horizontal-overflow assertion.
      for (const selector of ["#paths .section-heading", ".path-grid", ".selected-plan"]) {
        const bounds = await page.locator(selector).evaluate((element) => {
          const parent = element.getBoundingClientRect();
          return {
            width: parent.width,
            children: [...element.children].map((child) => {
              const box = child.getBoundingClientRect();
              return { left: box.left - parent.left, right: box.right - parent.right };
            }),
          };
        });
        expect(bounds.width, `${selector} at ${width}px`).toBeGreaterThan(1050);
        for (const child of bounds.children) {
          expect(child.left, `${selector} left edge at ${width}px`).toBeGreaterThanOrEqual(-1);
          expect(child.right, `${selector} right edge at ${width}px`).toBeLessThanOrEqual(1);
        }
      }
    }
  });
}
