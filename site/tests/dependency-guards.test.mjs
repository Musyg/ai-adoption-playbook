import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const fromFastGlob = createRequire(require.resolve("fast-glob"));
const fromMicromatch = createRequire(fromFastGlob.resolve("micromatch"));
const braces = fromMicromatch("braces");
const braceMetadata = fromMicromatch("braces/package.json");
const { MAX_DEPTH } = fromMicromatch("braces/lib/constants.js");

test("the installed braces alias is the exact reviewed depth-guard backport", () => {
  assert.equal(braceMetadata.name, "@dieub/braces-depth-guard");
  assert.equal(braceMetadata.version, "3.0.3-pn.0");
  assert.equal(MAX_DEPTH, 100);
});

test("normal build patterns retain expansion and compilation behavior", () => {
  assert.deepEqual(braces.expand("app/{en,fr}/*.{ts,tsx}"), [
    "app/en/*.ts", "app/en/*.tsx", "app/fr/*.ts", "app/fr/*.tsx",
  ]);
  assert.deepEqual(braces.expand("file-{01..03}.md"), [
    "file-01.md", "file-02.md", "file-03.md",
  ]);
  assert.deepEqual(braces("app/{en,fr}"), ["app/(en|fr)"]);
});

test("string parsing rejects nesting just above the documented depth bound", () => {
  const nested = "{".repeat(MAX_DEPTH + 1) + "a,b" + "}".repeat(MAX_DEPTH + 1);
  for (const operation of [braces.parse, braces.compile, braces.expand, braces]) {
    assert.throws(() => operation(nested), /exceeds max depth/);
  }
});

test("a caller cannot raise or disable the hard depth bound", () => {
  const nested = "(".repeat(MAX_DEPTH + 1) + "x" + ")".repeat(MAX_DEPTH + 1);
  for (const maxDepth of [101, Infinity, NaN]) {
    assert.throws(() => braces.parse(nested, { maxDepth }), /exceeds max depth/);
  }
});

test("direct AST traversal is bounded independently of parsing", () => {
  let ast = { type: "text", value: "x" };
  for (let depth = 0; depth < MAX_DEPTH + 2; depth++) {
    const parent = { type: "paren", nodes: [ast] };
    ast.parent = parent;
    ast = parent;
  }
  const root = { type: "root", nodes: [ast] };
  ast.parent = root;
  for (const operation of [braces.compile, braces.expand, braces.stringify]) {
    assert.throws(() => operation(root), /exceeds max depth/);
  }
});

test("both lint and Vite glob chains resolve the reviewed guarded implementation", () => {
  const fromLint = createRequire(require.resolve("@next/eslint-plugin-next"));
  const fromVinext = createRequire(import.meta.resolve("vinext"));
  const fromCommonJs = createRequire(fromVinext.resolve("vite-plugin-commonjs"));
  const fromDynamicImport = createRequire(fromCommonJs.resolve("vite-plugin-dynamic-import"));
  for (const consumer of [fromLint, fromDynamicImport]) {
    const fromGlob = createRequire(consumer.resolve("fast-glob"));
    const fromMatch = createRequire(fromGlob.resolve("micromatch"));
    assert.equal(fromMatch("braces/package.json").name, braceMetadata.name);
    assert.equal(fromMatch("braces/package.json").version, braceMetadata.version);
    assert.equal(fromMatch("braces/lib/constants.js").MAX_DEPTH, 100);
  }
});
