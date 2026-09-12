import assert from "node:assert/strict";
import test from "node:test";
import { formatLocalizedNumber } from "../app/format-number.mjs";

test("number formatting is stable across server and browser locale data", () => {
  assert.equal(formatLocalizedNumber(100000, "fr"), "100\u202f000");
  assert.equal(formatLocalizedNumber(100000, "en"), "100,000");
  assert.equal(formatLocalizedNumber(1234.56, "fr", { maximumFractionDigits: 1 }), "1\u202f234,6");
  assert.equal(formatLocalizedNumber(-1234.56, "en", { maximumFractionDigits: 1 }), "-1,234.6");
  assert.equal(formatLocalizedNumber(0, "fr"), "0");
  assert.equal(formatLocalizedNumber(10.12, "fr", { maximumFractionDigits: 0 }), "10");
});
