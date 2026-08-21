import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [playbook, styles] = await Promise.all([
  readFile(path.join(siteRoot, "app", "Playbook.tsx"), "utf8"),
  readFile(path.join(siteRoot, "app", "globals.css"), "utf8"),
]);

test("interactive cards do not claim list semantics without list items", () => {
  assert.match(playbook, /<div className="path-grid">/);
  assert.doesNotMatch(playbook, /<div className="path-grid" role="list">/);
});

test("the brand accessible name matches its visible label", () => {
  assert.match(playbook, /<a className="brand" href="#top">/);
  assert.doesNotMatch(playbook, /<a className="brand"[^>]*aria-label=/);
});

test("theme-aware surfaces preserve readable control contrast", () => {
  assert.match(styles, /\.evidence-controls \{ background: var\(--surface\); color: var\(--ink\);/);
  assert.match(styles, /\.evidence-controls input \{ background: var\(--paper\); border: 1px solid var\(--line\); color: var\(--ink\);/);
  assert.match(styles, /\.calibrator-levels button:hover \{ background: var\(--dark\); border-color: var\(--blue\); color: var\(--dark-text\);/);
  assert.match(styles, /\.calibrator-levels button:hover :is\(strong, span\) \{ color: var\(--dark-text\); \}/);
  assert.match(styles, /\.calibrator-levels button\[aria-pressed="true"\] span, \.calibrator-levels button\[aria-pressed="true"\]:hover span \{ color: var\(--blue\); \}/);
  assert.match(styles, /\.pilot-roadmap li\[data-current="true"\] span \{ color: var\(--paper\); \}/);
  assert.match(styles, /\.field-pilot-form input, \.field-pilot-form select, \.field-pilot-form textarea \{ background: var\(--surface\); border: 1px solid var\(--line\);/);
  assert.match(styles, /\.sector-grid > a \{ background: var\(--surface\); border: 1px solid var\(--line\);/);
  assert.match(styles, /\.public-lead \{ background: var\(--surface\); border: 1px solid var\(--line\);/);
  assert.match(styles, /\.path-card\[data-active="true"\] :is\(\.path-number, \.path-copy, \.path-horizon\) \{ color: var\(--dark-text\); \}/);
  assert.match(styles, /\.use-pattern-grid button:hover \{ background: var\(--surface\); box-shadow: inset 4px 0 0 var\(--blue-deep\); \}/);
  assert.match(styles, /\.use-pattern-grid button:focus-visible, \.jurisdiction-options button:focus-visible \{ outline: 3px solid var\(--blue-deep\);/);
  assert.match(styles, /\.use-pattern-grid button\[aria-pressed="true"\] \{ background: var\(--surface\);/);
  assert.match(styles, /\.non-agentic-grid article:hover \{ border-color: var\(--blue-deep\);/);
  assert.match(styles, /\.non-agentic-footer a:focus-visible \{ outline-color: var\(--blue-deep\); \}/);
  assert.match(styles, /\.guide-choice-grid > button\[aria-pressed="true"\] \{ background: var\(--surface\); border-color: var\(--blue-deep\);/);
  assert.match(styles, /\[hidden\] \{ display: none !important; \}/);
  assert.match(styles, /\.chapter-router nav button\[aria-pressed="true"\] span \{ color: var\(--paper\); \}/);
  assert.match(styles, /\.chapter-router nav button\[aria-pressed="true"\] small \{ color: var\(--paper\); \}/);
  assert.match(styles, /\.concept-tip > summary \{[^}]*cursor: pointer;/);
  assert.match(styles, /\.guide-chapter > summary \{[^}]*cursor: pointer;/);
});

test("the portfolio palette keeps blue as an accent on neutral surfaces", () => {
  assert.doesNotMatch(styles, /#f3c969|#ffad9f/i);
  assert.match(styles, /\.evidence-warning \{ background: var\(--surface\); border-left: 4px solid var\(--blue-deep\); color: var\(--ink\);/);
  assert.match(styles, /\.dossier-status \{[^}]*background: var\(--surface\); border-left: 4px solid var\(--blue-deep\); color: var\(--ink\);/);
  assert.match(styles, /\.dossier-missing \{[^}]*background: var\(--surface\); border-left: 4px solid var\(--blue-deep\); color: var\(--ink\);/);
  assert.match(styles, /\.field-pilot-status \{ background: var\(--surface\); border-left: 4px solid var\(--blue-deep\); color: var\(--ink\);/);
  assert.match(styles, /\.task-time-mode-effect \{ background: #fff; border: 1px solid #d9dedc; border-left: 4px solid #0067b8;/);
});
