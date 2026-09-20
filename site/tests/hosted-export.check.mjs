import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { authorFor, formatEditorialDate, homeModified } from "../app/editorial-metadata.mjs";

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
  for (const [locale, html] of [["en", root], ["fr", french]]) {
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(schemas.length, 1);
    const schema = JSON.parse(schemas[0][1]);
    assert.equal(schema.dateModified, homeModified[locale]);
    assert.deepEqual(schema.author, authorFor(locale));
    assert.ok(html.includes(`href="${authorFor(locale).url}" rel="author"`));
  }
});

test("server article metadata agrees with hosted export without duplicate images", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const handleRequest = typeof worker === "function" ? worker : (request) => worker.fetch(request,
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} });
  for (const article of articles) {
    const route = `/${article.locale === "fr" ? "fr/" : ""}${article.slug}`;
    const response = await handleRequest(new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }));
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /name="author" content="Gilles Musy"/);
    assert.ok(html.includes(`content="${article.dateModified}"`));
    assert.ok(html.includes(authorFor(article.locale).url));
    for (const name of ["og:image", "twitter:image"]) {
      assert.equal((html.match(new RegExp(`(?:property|name)="${name}"`, "g")) || []).length, 1);
    }
    assert.ok(html.includes(`${publicUrl}/og.png`));
  }
});

test("publishes every guide below the approved base path", async () => {
  for (const article of articles) {
    const route = `${article.locale === "fr" ? "fr/" : ""}${article.slug}/`;
    const html = await exported(path.join(route, "index.html"));
    assert.match(html, new RegExp(`<link rel="canonical" href="${publicUrl}/${route}"`));
    assert.match(html, new RegExp(`"url":"${publicUrl}/${route}"`));
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(schemas.length, 1);
    const schema = JSON.parse(schemas[0][1]);
    assert.equal(schema.dateModified, article.dateModified);
    assert.deepEqual(schema.author, authorFor(article.locale));
    assert.ok(html.includes(`<time dateTime="${article.dateModified}">${formatEditorialDate(article.dateModified, article.locale)}</time>`));
    assert.ok(html.includes(`href="${authorFor(article.locale).url}" rel="author"`));
    for (const [attribute, name] of [["property", "og:image"], ["name", "twitter:image"]]) {
      assert.equal((html.match(new RegExp(`${attribute}="${name}"`, "g")) || []).length, 1);
      assert.ok(html.includes(`<meta ${attribute}="${name}" content="${publicUrl}/og.png"`));
    }
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.doesNotMatch(html, /<script\b(?![^>]*type="application\/ld\+json")|rel="modulepreload"/i);
    assertHostedPaths(html, route);
  }
});

test("publishes a complete sitemap and bypasses Jekyll processing", async () => {
  const sitemap = await exported("sitemap.xml");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.equal(locations.length, 14);
  assert.equal(new Set(locations).size, 14);
  assert.ok(locations.every((location) => location.startsWith(`${publicUrl}/`)));
  assert.ok(locations.includes(`${publicUrl}/`));
  assert.ok(locations.includes(`${publicUrl}/fr/`));
  for (const entry of [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)]) {
    const url = entry[1].match(/<loc>([^<]+)<\/loc>/)[1];
    const article = articles.find((item) => url === `${publicUrl}/${item.locale === "fr" ? "fr/" : ""}${item.slug}/`);
    const expected = article ? article.dateModified : homeModified[url.endsWith("/fr/") ? "fr" : "en"];
    assert.ok(entry[1].includes(`<lastmod>${expected}</lastmod>`), url);
  }
  await access(path.join(staticRoot, ".nojekyll"));
});
