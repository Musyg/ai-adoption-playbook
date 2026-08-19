import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesRoot = path.join(siteRoot, "pages-dist");
const basePath = "/ai-adoption-playbook";

for (const [relative, language, title, canonical, visibleCopy] of [
  ["index.html", "en", "AI Adoption Playbook: pilots, agents and governance", "https://musyg.github.io/ai-adoption-playbook/", "Choose the smallest AI system"],
  [path.join("fr", "index.html"), "fr", "Playbook d’adoption de l’IA : pilotes, agents et gouvernance", "https://musyg.github.io/ai-adoption-playbook/fr/", "Choisir le système IA le plus simple"],
]) {
  test(`exports a deployable ${language} GitHub Pages document`, async () => {
    const html = await readFile(path.join(pagesRoot, relative), "utf8");
    assert.match(html, new RegExp(`<html lang="${language}"`));
    assert.match(html, new RegExp(`<title>${title}</title>`));
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}"`));
    assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="fr"/);
    assert.match(html, /hreflang="x-default"/);
    assert.match(html, /type="application\/ld\+json"/);
    assert.match(html, /"@type": "CreativeWork"/);
    assert.match(html, new RegExp(`${basePath}/assets/`));
    assert.match(html, new RegExp(`${basePath}/favicon\\.svg`));
    assert.match(html, new RegExp(`https://musyg\\.github\\.io${basePath}/og\\.png`));
    assert.match(html, /data-prerendered="true"/);
    assert.match(html, /data-prerendered="true"><div class="page-shell"/);
    assert.match(html, /id="integration-levels"/);
    assert.match(html, new RegExp(visibleCopy));
    assert.match(html, /Atelier Horizon/);
    assert.doesNotMatch(html, /Loading the interactive|Chargement du playbook/);
    assert.doesNotMatch(html, /\u2014/);
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
  assert.match(client, /issues\/new\?template=field-pilot-en\.yml/);
  assert.match(client, /issues\/new\?template=field-pilot-fr\.yml/);
  assert.match(client, /\/ai-adoption-playbook/);
  assert.match(client, /scrollIntoView/);

  await Promise.all([
    access(path.join(pagesRoot, ".nojekyll")),
    access(path.join(pagesRoot, "favicon.svg")),
    access(path.join(pagesRoot, "og.png")),
    access(path.join(pagesRoot, "sitemap.xml")),
    access(path.join(pagesRoot, "data", "control-crosswalk.v1.json")),
    access(path.join(pagesRoot, "data", "control-crosswalk.schema.json")),
  ]);

  const sitemap = await readFile(path.join(pagesRoot, "sitemap.xml"), "utf8");
  assert.match(sitemap, /https:\/\/musyg\.github\.io\/ai-adoption-playbook\//);
  assert.match(sitemap, /https:\/\/musyg\.github\.io\/ai-adoption-playbook\/fr\//);
  assert.match(sitemap, /hreflang="x-default"/);
});
