import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticRoot = path.join(siteRoot, "static-dist");
const publicUrl = "https://musyg.github.io/ai-adoption-playbook";
const basePath = "/ai-adoption-playbook/";
const articles = JSON.parse(await readFile(path.join(siteRoot, "app", "geo-pages.json"), "utf8"));

async function exported(relativePath) {
  return readFile(path.join(staticRoot, relativePath), "utf8");
}

function assertHostedPaths(html, label) {
  const localPaths = [...html.matchAll(/\b(?:href|src)="(\/[^"]*)"/g)].map((match) => match[1]);
  assert.ok(localPaths.length > 0, `${label} contains local assets or links`);
  for (const localPath of localPaths) {
    assert.ok(localPath.startsWith(basePath), `${label} escapes the GitHub Pages base path: ${localPath}`);
  }
}

test("publishes host-ready metadata and base-aware assets", async () => {
  const [root, french] = await Promise.all([exported("index.html"), exported(path.join("fr", "index.html"))]);

  assert.match(root, /<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/);
  assert.match(root, new RegExp(`<link rel="canonical" href="${publicUrl}/"`));
  assert.match(root, new RegExp(`<link rel="alternate" hreflang="fr" href="${publicUrl}/fr/"`));
  assert.match(root, new RegExp(`<link rel="sitemap" type="application/xml" href="${publicUrl}/sitemap\\.xml"`));
  assert.match(root, new RegExp(`<meta property="og:url" content="${publicUrl}/"`));
  assert.match(root, new RegExp(`<meta property="og:image" content="${publicUrl}/og\\.png"`));
  assert.match(root, /<script type="module" crossorigin src="\/ai-adoption-playbook\/assets\//);
  assert.match(root, /<link rel="icon" href="\/ai-adoption-playbook\/favicon\.svg"/);
  assert.doesNotMatch(root, /noindex, nofollow/);

  assert.match(french, new RegExp(`<link rel="canonical" href="${publicUrl}/fr/"`));
  assert.match(french, new RegExp(`<link rel="alternate" hreflang="en" href="${publicUrl}/"`));
  assertHostedPaths(root, "root document");
  assertHostedPaths(french, "alternate route document");
});

test("publishes every guide below the approved base path", async () => {
  const route = articles.find((candidate) => candidate.locale === "en");
  assert.ok(route, "at least one guide route is registered");
  const html = await exported(path.join(route.slug, "index.html"));
  assert.match(html, new RegExp(`<link rel="canonical" href="${publicUrl}/${route.slug}/"`));
  assert.match(html, new RegExp(`"url":"${publicUrl}/${route.slug}/"`));
  assertHostedPaths(html, "guide document");
});

test("publishes a complete sitemap and bypasses Jekyll processing", async () => {
  const sitemap = await exported("sitemap.xml");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.equal(locations.length, 14);
  assert.equal(new Set(locations).size, 14);
  assert.ok(locations.every((location) => location.startsWith(`${publicUrl}/`)));
  assert.ok(locations.includes(`${publicUrl}/`));
  assert.ok(locations.includes(`${publicUrl}/fr/`));
  await access(path.join(staticRoot, ".nojekyll"));
});
