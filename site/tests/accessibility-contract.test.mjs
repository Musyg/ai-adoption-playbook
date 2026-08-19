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
  assert.match(styles, /\.calibrator-levels button\[aria-pressed="true"\] span \{ color: var\(--paper\); \}/);
  assert.match(styles, /\.pilot-roadmap li\[data-current="true"\] span \{ color: var\(--paper\); \}/);
  assert.match(styles, /\.field-pilot-form input, \.field-pilot-form select, \.field-pilot-form textarea \{ background: var\(--surface\); border: 1px solid var\(--line\);/);
  assert.match(styles, /\.sector-grid > a \{ background: var\(--surface\); border: 1px solid var\(--line\);/);
  assert.match(styles, /\.public-lead \{ background: var\(--surface\); border: 1px solid var\(--line\);/);
  assert.match(styles, /\.path-card\[data-active="true"\] :is\(\.path-number, \.path-copy, \.path-horizon\) \{ color: var\(--dark-text\); \}/);
});
