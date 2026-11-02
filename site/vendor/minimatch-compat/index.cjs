"use strict";

// ESLint 9 and the React/a11y plugins expect require("minimatch") to be
// callable. Keep that entry point while delegating every match to upstream.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- The legacy consumers require a synchronous CommonJS entry point.
const modern = require("minimatch-modern");
module.exports = Object.assign(modern.minimatch, modern);
