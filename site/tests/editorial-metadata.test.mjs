import assert from "node:assert/strict";
import test from "node:test";
import { authorFor, formatEditorialDate, homeModified } from "../app/editorial-metadata.mjs";

test("formats editorial dates independently of build date, timezone and ICU", () => {
  assert.equal(formatEditorialDate("2026-09-12", "fr"), "12 septembre 2026");
  assert.equal(formatEditorialDate("2024-02-29", "en"), "29 February 2024");
  assert.equal(formatEditorialDate("2025-01-01", "fr"), "1 janvier 2025");
  for (const invalid of ["2026-02-29", "2026-13-01", "2026-04-31", "2026-9-12", "today", ""]) {
    assert.throws(() => formatEditorialDate(invalid, "en"), /Invalid editorial date/);
  }
  for (const [locale, date] of Object.entries(homeModified)) assert.ok(formatEditorialDate(date, locale));
});

test("identifies the same person across both languages", () => {
  const en = authorFor("en");
  const fr = authorFor("fr");
  assert.equal(en["@type"], "Person");
  assert.equal(en["@id"], fr["@id"]);
  assert.equal(en.name, "Gilles Musy");
  assert.equal(en.alternateName, "Musyg");
  assert.equal(en.url, "https://musyg.com/about/");
  assert.equal(fr.url, "https://musyg.com/fr/a-propos/");
  assert.deepEqual(en.sameAs, ["https://github.com/Musyg"]);
});
