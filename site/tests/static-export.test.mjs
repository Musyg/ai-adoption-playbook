import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticRoot = path.join(siteRoot, "static-dist");

for (const [relative, language, title, visibleCopy] of [
  ["index.html", "en", "AI Adoption Playbook: pilots, agents and governance", "Choose the smallest AI system"],
  [path.join("fr", "index.html"), "fr", "Playbook d’adoption de l’IA : pilotes, agents et gouvernance", "Choisir le système IA le plus simple"],
]) {
  test(`exports a neutral ${language} static document`, async () => {
    const html = await readFile(path.join(staticRoot, relative), "utf8");
    assert.match(html, new RegExp(`<html lang="${language}"`));
    assert.match(html, new RegExp(`<title>${title}</title>`));
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
    assert.match(html, /type="application\/ld\+json"/);
    assert.match(html, /"@type": "CreativeWork"/);
    assert.match(html, /"dateModified": "2026-08-20"/);
    assert.match(html, /\/assets\//);
    assert.match(html, /\/favicon\.svg/);
    assert.match(html, /data-prerendered="true"/);
    assert.match(html, /data-prerendered="true"><div class="page-shell"/);
    assert.match(html, /id="guided-start"/);
    assert.match(html, /class="guide-chapter" id="concept-library"/);
    assert.match(html, /class="guide-chapter" id="operational-workspace"/);
    assert.match(html, /class="guide-chapter" id="implementation-library"/);
    assert.match(html, /class="chapter-router/);
    assert.match(html, /id="case-library"/);
    assert.match(html, /Choose what you need now|Choisissez ce dont vous avez besoin maintenant/);
    assert.match(html, /Previous topic|Sujet précédent/);
    assert.match(html, /id="use-patterns"/);
    assert.match(html, /id="non-agentic-cases"/);
    assert.match(html, /id="integration-levels"/);
    assert.match(html, /Switzerland \+ EU|Suisse \+ UE/);
    assert.match(html, /SYNTHETIC EVIDENCE BOUNDARY|FRONTIÈRE DES PREUVES SYNTHÉTIQUES/);
    assert.match(html, new RegExp(visibleCopy));
    assert.match(html, /Atelier Horizon/);
    assert.doesNotMatch(html, /Loading the interactive|Chargement du playbook/);
    assert.doesNotMatch(html, /rel="canonical"|hreflang=|rel="sitemap"|property="og:url"/);
    assert.doesNotMatch(html, /musyg\.github\.io|chatgpt\.site|localhost|\u2014/);
    assert.doesNotMatch(html, /\/_next\//);
  });
}

test("keeps the route heading hierarchies aligned", async () => {
  const extractHeadings = (html) => [...html.matchAll(/<h([1-3])\b[^>]*>[\s\S]*?<\/h\1>/gi)].map((match) => match[1]);
  const english = await readFile(path.join(staticRoot, "index.html"), "utf8");
  const french = await readFile(path.join(staticRoot, "fr", "index.html"), "utf8");
  const englishHeadings = extractHeadings(english);
  const frenchHeadings = extractHeadings(french);

  assert.ok(englishHeadings.length >= 90);
  assert.deepEqual(frenchHeadings, englishHeadings);
  assert.match(english, /Move from AI interest to a system you can trust\./);
  assert.doesNotMatch(english, /Passez de l’intérêt pour l’IA/);
  assert.match(french, /Passez de l’intérêt pour l’IA à un système digne de confiance\./);
  assert.doesNotMatch(french, /Move from AI interest to a system you can trust\./);
});

test("copies public assets and ships the provider-neutral interactive client", async () => {
  const rootHtml = await readFile(path.join(staticRoot, "index.html"), "utf8");
  const scriptPath = rootHtml.match(/<script type="module" crossorigin src="([^"]+)"/)?.[1];
  assert.ok(scriptPath, "Vite client entry is present");
  const client = await readFile(path.join(staticRoot, scriptPath.replace(/^\//, "")), "utf8");
  assert.match(client, /Propose a pilot on GitHub/);
  assert.match(client, /Proposer un pilote sur GitHub/);
  assert.match(client, /control-crosswalk\.v1\.json/);
  assert.match(client, /issues\/new\?template=field-pilot-en\.yml/);
  assert.match(client, /issues\/new\?template=field-pilot-fr\.yml/);
  assert.match(client, /scrollIntoView/);
  assert.doesNotMatch(client, /musyg\.github\.io|chatgpt\.site/);

  await Promise.all([
    access(path.join(staticRoot, "favicon.svg")),
    access(path.join(staticRoot, "og.png")),
    access(path.join(staticRoot, "data", "control-crosswalk.v1.json")),
    access(path.join(staticRoot, "data", "control-crosswalk.schema.json")),
  ]);
  await assert.rejects(access(path.join(staticRoot, ".nojekyll")));
  await assert.rejects(access(path.join(staticRoot, "sitemap.xml")));
});
