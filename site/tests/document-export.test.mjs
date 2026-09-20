import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { documents, libraryPath, downloads } from "../app/document-manifest.mjs";

test("all approved documents export without JavaScript and downloads preserve source bytes", async () => {
  for (const doc of documents) {
    const html = await readFile(path.join("static-dist", doc.path, "index.html"), "utf8");
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, doc.source);
    assert.match(html, new RegExp(`<html lang="${doc.locale}"`));
    assert.doesNotMatch(html, /<script\b(?![^>]*type="application\/ld\+json")|rel="modulepreload"/);
    const [original, download] = await Promise.all([readFile(path.join("..", doc.source)), readFile(path.join("static-dist/downloads", doc.source))]);
    assert.deepEqual(download, original, doc.source);
    for (const link of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const target = link[1].endsWith("/") ? `${link[1]}index.html` : link[1];
      await access(path.join("static-dist", target));
    }
  }
  for (const source of downloads) assert.deepEqual(await readFile(path.join("static-dist/downloads", source)), await readFile(path.join("..", source)));
});

test("both library indexes expose every localized document and homes no longer send readers to Markdown on GitHub", async () => {
  for (const locale of ["en", "fr"]) {
    const html = await readFile(path.join("static-dist", libraryPath(locale), "index.html"), "utf8");
    for (const doc of documents.filter((item) => item.locale === locale)) assert.ok(html.includes(`href="${doc.path}"`), doc.source);
    const home = await readFile(path.join("static-dist", locale === "fr" ? "fr" : "", "index.html"), "utf8");
    assert.doesNotMatch(home, /href="https:\/\/github.com\/Musyg\/ai-adoption-playbook\/blob\/main\//);
    assert.ok(home.includes(`href="${libraryPath(locale)}"`));
  }
});
