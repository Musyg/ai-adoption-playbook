import assert from "node:assert/strict";
import test from "node:test";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  documents, downloads, documentForSource, documentPath, alternateDocument, libraryPath,
} from "../app/document-manifest.mjs";
import {
  loadDocument, compileMarkdown, rewriteDocumentLink, libraryBody, documentBody,
} from "../scripts/document-reader.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const compiled = Promise.all(documents.map(loadDocument));
const ids = (html) => [...html.matchAll(/\bid="([^"]*)"/g)].map((match) => match[1]);
const links = (html) => [...html.matchAll(/\bhref="([^"]*)"/g)].map((match) => match[1].replaceAll("&amp;", "&"));
const en = documentForSource("docs/security.md");
const fr = documentForSource("docs/security.fr.md");

test("publication manifest contains only the agreed document families and explicit exceptions", () => {
  const expected = { tracks: 12, sectors: 10, examples: 22, templates: 22, references: 18, docs: 22, "field-notes": 2, controls: 1 };
  assert.equal(documents.length, 109);
  assert.equal(new Set(documents.map((doc) => doc.source)).size, documents.length);
  assert.equal(new Set(documents.map((doc) => doc.path)).size, documents.length);
  for (const [category, count] of Object.entries(expected)) {
    assert.equal(documents.filter((doc) => doc.category === category).length, count, category);
  }
  const methods = new Set(["ai-use-patterns", "evaluations-and-gates", "field-pilot-cohort", "field-pilot-protocol", "legal-switzerland-eu", "maturity-model", "project-dossier", "risk-autonomy", "security", "task-time-evidence", "universal-process"]);
  for (const doc of documents) {
    assert.ok(Object.hasOwn(expected, doc.category));
    assert.ok(!doc.source.includes(".."));
    assert.ok(doc.source.startsWith(`${doc.category}/`));
    if (doc.category === "docs") assert.ok(methods.has(path.basename(doc.source).replace(/(?:\.fr)?\.md$/, "")), doc.source);
  }
  for (const source of ["HANDOFF.md", "ROADMAP.md", "site/README.md", "docs/loading-review.md", "docs/loading-review.fr.md", "docs/reader-clarity-review.md", "docs/reader-clarity-review.fr.md", "work/private.md", ".github/PULL_REQUEST_TEMPLATE/field-report.md"]) {
    assert.equal(documentForSource(source), undefined, source);
    assert.throws(() => documentPath(source), /not approved/i);
  }
  assert.deepEqual([...downloads].sort(), ["field-notes/index.json", "templates/ai-system-register.csv"]);
});

test("language pairs are reciprocal and the French-only controls document has no invented English twin", () => {
  for (const doc of documents) {
    assert.ok(doc.path.startsWith(libraryPath(doc.locale)), doc.source);
    const alternate = alternateDocument(doc);
    if (doc.source === "controls/README.md") {
      assert.equal(doc.locale, "fr");
      assert.equal(alternate, undefined);
      continue;
    }
    assert.ok(alternate, doc.source);
    assert.notEqual(alternate.locale, doc.locale);
    assert.equal(alternateDocument(alternate), doc);
    assert.equal(alternate.id, doc.id);
  }
  assert.equal(alternateDocument(documentForSource("examples/en/rag-policy-assistant.md")).source, "examples/fr/assistant-rag-procedures.md");
  assert.equal(alternateDocument(documentForSource("field-notes/README.md")).source, "field-notes/README.fr.md");
});

test("every compiled document preserves its exact Markdown source and exposes unique section anchors", async () => {
  for (const doc of await compiled) {
    assert.equal(doc.markdown, await readFile(path.join(root, doc.source), "utf8"), doc.source);
    assert.ok(doc.title.trim().length > 0, doc.source);
    const anchors = ids(doc.html);
    assert.equal(new Set(anchors).size, anchors.length, `${doc.source}: duplicate anchors`);
    for (const heading of doc.headings) assert.ok(anchors.includes(heading.id), `${doc.source}#${heading.id}`);
    assert.ok(documentBody(doc).includes(doc.html), `${doc.source}: full compiled body must remain present`);
  }
  await assert.rejects(loadDocument({ ...en }), /allowlist/);
  await assert.rejects(loadDocument({ ...en, source: "HANDOFF.md" }), /allowlist/);
});

test("the complete document and library link graph closes, including accented anchors and downloads", async () => {
  const loaded = await compiled;
  const pages = new Map(loaded.map((doc) => [doc.path, { html: documentBody(doc), source: doc.source }]));
  for (const locale of ["en", "fr"]) pages.set(libraryPath(locale), { html: await libraryBody(locale), source: `library:${locale}` });
  for (const [pagePath, page] of pages) {
    for (const href of links(page.html)) {
      if (/^https?:\/\//.test(href) || href.startsWith("mailto:")) continue;
      const url = new URL(href, `https://guide.example${pagePath}`);
      const target = pages.get(url.pathname);
      if (target) {
        if (url.hash) assert.ok(ids(target.html).includes(decodeURIComponent(url.hash.slice(1))), `${page.source} -> ${href}: missing anchor`);
      } else if (url.pathname.startsWith("/downloads/")) {
        const source = url.pathname.slice("/downloads/".length);
        assert.ok(documents.some((doc) => doc.source === source) || downloads.includes(source), href);
        await access(path.join(root, source));
      } else if (url.pathname.startsWith("/data/")) {
        await access(path.join(root, "site/public", url.pathname.slice(1)));
      } else {
        assert.ok(["/", "/fr/"].includes(url.pathname), `${page.source} -> ${href}: unknown local target`);
      }
    }
  }
});

test("relative, repository-absolute, translated and data links resolve to their public destinations", () => {
  assert.equal(rewriteDocumentLink("../references/sources.fr.md#sécurité", fr), "/fr/bibliotheque/references-sources/#sécurité");
  assert.equal(rewriteDocumentLink("https://github.com/Musyg/ai-adoption-playbook/blob/main/docs/security.fr.md#test", en), `${fr.path}#test`);
  assert.equal(rewriteDocumentLink("../../templates/", documentForSource("examples/en/tpe-customer-requests.md")), "/library/#templates");
  assert.equal(rewriteDocumentLink("../site/public/data/project-dossier.schema.json", en), "/data/project-dossier.schema.json");
  assert.equal(rewriteDocumentLink("../templates/ai-system-register.csv", fr), "/downloads/templates/ai-system-register.csv");
  assert.equal(rewriteDocumentLink("../.github/PULL_REQUEST_TEMPLATE/field-report.md", en), "https://github.com/Musyg/ai-adoption-playbook/blob/main/.github/PULL_REQUEST_TEMPLATE/field-report.md");
  assert.equal(rewriteDocumentLink("https://example.org/study?q=ai#results", fr), "https://example.org/study?q=ai#results");
  for (const href of ["../HANDOFF.md", "../../private.md", "../docs/loading-review.md", "../work/internal.md"]) assert.throws(() => rewriteDocumentLink(href, en), /Unapproved document link/);
});

test("GFM preserves tables, read-only checkboxes, nested lists, code and Unicode heading anchors", () => {
  const output = compileMarkdown("# Démonstration\n\n## Sécurité\n\n## Sécurité\n\n| Sujet | Valeur |\n| --- | --- |\n| A | B |\n\n- [ ] À faire\n- [x] Fait\n\n1. Parent\n   - Enfant\n\n> Citation\n\n```text\nAAP-<FAMILLE>-<NUMÉRO>\n```\n\nPlaceholder AAP-<FAMILLE>-<NUMÉRO>.", fr);
  assert.equal(output.title, "Démonstration");
  assert.deepEqual(output.headings.map((heading) => heading.id), ["sécurité", "sécurité-1"]);
  assert.match(output.html, /class="document-table"[^>]*tabindex="0"/);
  assert.match(output.html, /<table>/);
  assert.match(output.html, /<th>Sujet<\/th>/);
  const checkboxes = output.html.match(/<input\b[^>]*>/g) || [];
  assert.equal(checkboxes.length, 2);
  assert.ok(checkboxes.every((tag) => /type="checkbox"/.test(tag) && /disabled/.test(tag)));
  assert.equal(checkboxes.filter((tag) => /checked/.test(tag)).length, 1);
  assert.match(output.html, /<ol>[\s\S]*<ul>[\s\S]*Enfant/);
  assert.match(output.html, /<blockquote>/);
  assert.match(output.html, /<pre><code>AAP-&lt;FAMILLE&gt;-&lt;NUMÉRO&gt;/);
  assert.match(output.html, /Placeholder AAP-&lt;FAMILLE&gt;-&lt;NUMÉRO&gt;/);
});

test("raw HTML remains inert and unapproved URL schemes cannot become active links or images", () => {
  const output = compileMarkdown('# Safety\n\n<script>sample</script>\n\n<div onclick="sample">literal</div>\n\n[unsafe](javascript:void(0)) [data](data:text/plain,sample) [relative](//example.org) [safe](https://example.org)\n\n![image](javascript:void(0))', en);
  assert.doesNotMatch(output.html, /<(?:script|div)\b/i);
  assert.doesNotMatch(output.html, /\b(?:href|src)="(?:javascript:|data:|\/\/)/i);
  assert.doesNotMatch(output.html, /<[^>]+\bonclick=/i);
  assert.match(output.html, /&lt;script&gt;sample&lt;\/script&gt;/);
  assert.match(output.html, /href="https:\/\/example\.org"/);
  // Ambiguous entity-encoded destinations are rejected before rendering.
  assert.throws(() => compileMarkdown("# Safety\n\n[encoded](jav&#x61;script:void(0))", en), /Unapproved document link/);
});
