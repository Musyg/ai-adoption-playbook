import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesRoot = path.join(siteRoot, "pages-dist");
const basePath = "/ai-adoption-playbook";

for (const [relative, language] of [["index.html", "en"], [path.join("fr", "index.html"), "fr"]]) {
  test(`exports a deployable ${language} GitHub Pages document`, async () => {
    const html = await readFile(path.join(pagesRoot, relative), "utf8");
    assert.match(html, new RegExp(`${basePath}/_next/`));
    assert.match(html, new RegExp(`${basePath}/data/control-crosswalk\\.v1\\.json`));
    assert.match(html, new RegExp(`${basePath}/data/control-crosswalk\\.schema\\.json`));
    assert.match(html, new RegExp(`${basePath}/favicon\\.svg`));
    assert.match(html, new RegExp(`https://musyg\\.github\\.io${basePath}/og\\.png`));
    assert.doesNotMatch(html, /(?:href|src)="\/(?:_next|data)\//);
    assert.match(html, /Propose a pilot on GitHub|Proposer un pilote sur GitHub/i);

    if (language === "en") {
      assert.match(html, new RegExp(`href="${basePath}/fr/"`));
    } else {
      assert.match(html, new RegExp(`href="${basePath}/"`));
    }
  });
}

test("copies every public GitHub Pages asset", async () => {
  await Promise.all([
    access(path.join(pagesRoot, ".nojekyll")),
    access(path.join(pagesRoot, "favicon.svg")),
    access(path.join(pagesRoot, "og.png")),
    access(path.join(pagesRoot, "data", "control-crosswalk.v1.json")),
    access(path.join(pagesRoot, "data", "control-crosswalk.schema.json")),
  ]);
});
