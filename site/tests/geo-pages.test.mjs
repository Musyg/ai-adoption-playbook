import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesRoot = path.join(siteRoot, "pages-dist");
const canonicalBase = "https://musyg.github.io/ai-adoption-playbook";
const articles = JSON.parse(await readFile(path.join(siteRoot, "app", "geo-pages.json"), "utf8"));

function articlePath(article) {
  return article.locale === "fr" ? `/fr/${article.slug}/` : `/${article.slug}/`;
}

function exportedPath(article) {
  return article.locale === "fr"
    ? path.join(pagesRoot, "fr", article.slug, "index.html")
    : path.join(pagesRoot, article.slug, "index.html");
}

test("publishes six paired GEO intents with bounded evidence", () => {
  assert.equal(articles.length, 12);
  assert.equal(new Set(articles.map((article) => article.id)).size, 6);
  assert.equal(new Set(articles.map((article) => articlePath(article))).size, 12);

  for (const article of articles) {
    const pair = articles.find((candidate) => candidate.id === article.id && candidate.locale !== article.locale);
    assert.ok(pair, `missing alternate for ${article.id}/${article.locale}`);
    assert.ok(article.answer.split(/\s+/).length >= 45, `answer is too short for ${article.slug}`);
    assert.equal(article.sources.length, 3, `source count differs for ${article.slug}`);
    assert.equal(article.relatedIds.length, 3, `related count differs for ${article.slug}`);
    assert.doesNotMatch(JSON.stringify(article), /\u2014/);
  }
});

test("server-renders every GEO route with route-specific metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("geo-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  for (const article of articles) {
    const pathname = articlePath(article).slice(0, -1);
    const response = await worker.fetch(
      new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, new RegExp(article.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, new RegExp(article.answer.slice(0, 45).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, new RegExp(`${canonicalBase}${articlePath(article)}`.replaceAll("/", "\\/")));
    assert.doesNotMatch(html, /property="og:image"/);
    assert.doesNotMatch(html, /name="twitter:image"/);
  }
});

test("exports every GEO route as crawlable GitHub Pages HTML", async () => {
  for (const article of articles) {
    const html = await readFile(exportedPath(article), "utf8");
    const pair = articles.find((candidate) => candidate.id === article.id && candidate.locale !== article.locale);
    assert.match(html, new RegExp(`<html lang="${article.locale}"`));
    assert.match(html, new RegExp(`<title>${article.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</title>`));
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalBase}${articlePath(article)}`));
    assert.match(html, new RegExp(`hreflang="${pair.locale}" href="${canonicalBase}${articlePath(pair)}`));
    assert.match(html, /"@type":"Article"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.match(html, /data-prerendered="true"><div class="geo-page"/);
    assert.match(html, new RegExp(article.answer.slice(0, 45).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, /href="\/ai-adoption-playbook\//);
    assert.doesNotMatch(html, /property="og:image"/);
    assert.doesNotMatch(html, /name="twitter:image"/);
    assert.doesNotMatch(html, /localhost|\u2014/);
  }

  const sitemap = await readFile(path.join(pagesRoot, "sitemap.xml"), "utf8");
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 14);
  for (const article of articles) assert.match(sitemap, new RegExp(`${canonicalBase}${articlePath(article)}`.replaceAll("/", "\\/")));
});
