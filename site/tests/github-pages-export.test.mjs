import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesRoot = path.join(siteRoot, "pages-dist");
const basePath = "/ai-adoption-playbook";

for (const [relative, language, title] of [
  ["index.html", "en", "AI Adoption Playbook"],
  [path.join("fr", "index.html"), "fr", "Playbook d’adoption de l’IA"],
]) {
  test(`exports a deployable ${language} GitHub Pages document`, async () => {
    const html = await readFile(path.join(pagesRoot, relative), "utf8");
    assert.match(html, new RegExp(`<html lang="${language}"`));
    assert.match(html, new RegExp(`<title>${title}</title>`));
    assert.match(html, new RegExp(`${basePath}/assets/`));
    assert.match(html, new RegExp(`${basePath}/favicon\\.svg`));
    assert.match(html, new RegExp(`https://musyg\\.github\\.io${basePath}/og\\.png`));
    assert.doesNotMatch(html, /\/_next\//);
    assert.doesNotMatch(html, /localhost/);
  });
}

test("copies public assets and ships the interactive client", async () => {
  const rootHtml = await readFile(path.join(pagesRoot, "index.html"), "utf8");
  const scriptPath = rootHtml.match(/<script type="module" crossorigin src="([^"]+)"/)?.[1];
  assert.ok(scriptPath, "Vite client entry is present");
  const client = await readFile(path.join(pagesRoot, scriptPath.slice(`${basePath}/`.length)), "utf8");
  assert.match(client, /Propose a pilot on GitHub/);
  assert.match(client, /Proposer un pilote sur GitHub/);
  assert.match(client, /control-crosswalk\.v1\.json/);
  assert.match(client, /issues\/new\?template=field-pilot\.yml/);
  assert.match(client, /\/ai-adoption-playbook/);

  await Promise.all([
    access(path.join(pagesRoot, ".nojekyll")),
    access(path.join(pagesRoot, "favicon.svg")),
    access(path.join(pagesRoot, "og.png")),
    access(path.join(pagesRoot, "data", "control-crosswalk.v1.json")),
    access(path.join(pagesRoot, "data", "control-crosswalk.schema.json")),
  ]);
});
