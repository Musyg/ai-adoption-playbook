import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { ESLint } from "eslint";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";

const require = createRequire(import.meta.url);
const modern = require("minimatch-modern");

// Test the packages' real resolution paths, including TypeScript's named API.
test("every lint consumer resolves the callable facade over the patched upstream engine", () => {
  for (const consumer of ["eslint", "@eslint/config-array", "@eslint/eslintrc", "eslint-plugin-react", "eslint-plugin-jsx-a11y", "@typescript-eslint/typescript-estree"]) {
    const fromConsumer = createRequire(require.resolve(consumer));
    const match = fromConsumer("minimatch");
    assert.equal(typeof match, "function", consumer);
    assert.equal(match, modern.minimatch, consumer);
    assert.equal(match.minimatch, modern.minimatch, consumer);
    assert.equal(match.Minimatch, modern.Minimatch, consumer);
    assert.equal(match("app/fr/page.tsx", "app/{en,fr}/**/*.tsx"), true);
    assert.equal(match("app/fr/page.js", "app/{en,fr}/**/*.tsx"), false);
    assert.equal(new match.Minimatch("**/*.tsx", { dot: true }).match(".hidden/page.tsx"), true);
  }
});

test("the lock contains only the reviewed upstream minimatch and its compatible dependencies", () => {
  const lock = JSON.parse(readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"));
  const engines = Object.entries(lock.packages).filter(([key, value]) => key.endsWith("/minimatch-modern") || value.name === "minimatch" || key.endsWith("/minimatch") && !value.link);
  assert.ok(engines.length > 0);
  for (const [key, value] of engines) {
    assert.equal(value.version, "11.0.3", key);
    assert.match(value.resolved, /\/minimatch-11\.0\.3\.tgz$/);
    assert.ok(value.integrity.startsWith("sha512-"));
  }
  assert.equal(require("@isaacs/nonrecursive-glob-match/package.json").version, "1.0.3");
  assert.equal(require("brace-expansion/package.json").version, "5.0.12");
  assert.equal(require("balanced-match/package.json").version, "4.0.4");
});

test("globparts amplification at optimization level 2 stays bounded in a separate process", () => {
  const result = spawnSync(process.execPath, ["-e", `
    const assert = require('node:assert/strict');
    const { Minimatch } = require('minimatch-modern');
    const matcher = new Minimatch('**/../'.repeat(24) + 'target', {
      optimizationLevel: 2, braceExpandMax: 32,
    });
    assert.ok(matcher.globParts.length <= 32);
    assert.equal(typeof matcher.match('target'), 'boolean');
  `], { cwd: new URL("../", import.meta.url), timeout: 5000, encoding: "utf8" });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

test("React and a11y wildcard rules still report violations rather than throwing or silently passing", async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [{
      files: ["**/*.jsx"],
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      plugins: { react, "jsx-a11y": jsxA11y },
      rules: {
        "react/forbid-component-props": ["error", { forbid: [{ propNamePattern: "data-*" }] }],
        "jsx-a11y/control-has-associated-label": ["error", { controlComponents: ["Custom*"] }],
      },
    }],
  });
  const [bad] = await eslint.lintText('const element = <button><CustomControl data-test="x" /></button>;', { filePath: "app/security-fixture.jsx" });
  assert.deepEqual(bad.messages.map(message => message.ruleId).sort(), ["jsx-a11y/control-has-associated-label", "react/forbid-component-props"]);
  const [good] = await eslint.lintText('const element = <button aria-label="Save"><CustomControl /></button>;', { filePath: "app/security-fixture.jsx" });
  assert.deepEqual(good.messages, []);
});
