# Dependency security maintenance

## 10 October 2026

The locked dependency audit reported ten affected packages, several inheriting
the same advisory through the build-tool dependency tree. This change preserves
the framework, application behavior and the full CI audit gate.

Compatible transitive fixes are pinned in npm overrides:

- `brace-expansion` 1.1.21 and 5.0.12, preserving each consumer's major version;
- `fast-uri` 3.1.8;
- `source-map-js` 1.2.2, including the production dependency via PostCSS.

### Temporary braces backport

Upstream `braces` 3.0.3 has no released fix for
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
Rather than suppress this advisory or downgrade the framework, the build tools
resolve an exact reviewed derivative:
`npm:@dieub/braces-depth-guard@3.0.3-pn.0`.

Its published artifact was compared with the published upstream 3.0.3 tarball.
The runtime diff adds a hard maximum nesting/traversal depth of 100 to parsing,
compilation, expansion and stringification. The entry point, utilities and MIT
license are unchanged; package metadata and README explicitly identify the fork.
There are no installation hooks. The lockfile records the registry SHA-512
integrity; this bootstrap release does **not** claim OIDC provenance.

- [Derivative source](https://github.com/dieub/braces-depth-guard)
- [Original depth-guard proposal](https://github.com/micromatch/braces/pull/72)
- Reviewed artifact integrity:
  `sha512-2d7F2tzyJQMbFhXcA274fgBz5T3uByP5AWlkjnEqXGDpBHCcw7GjuW2mFgXF04yQ3QeCpLXJ9XstRSHHjS4/5w==`

`tests/dependency-guards.test.mjs` checks the installed identity, normal glob
behavior, bounded rejection and the actual fast-glob/micromatch resolution path.
Renaming alone is not remediation: these code-review and regression checks are
required in addition to `npm audit`. This is not a general guarantee against all
regular-expression or expansion resource exhaustion. Reassess the override when
an upstream fix or a compatible dependency-chain replacement is available.


## 2 November 2026: minimatch and entities

[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
flags minimatch versions below 11.0.1. The reviewed upstream engine is pinned to
11.0.3, with `@isaacs/nonrecursive-glob-match` 1.0.3, `brace-expansion` 5.0.12
and the locked compatible `balanced-match` 4.0.4. Node 22 satisfies their engines.
The previous React 19.3.1 peer alignment and all other security overrides remain.

A direct override from minimatch 3 to 11 would break ESLint 9's default imports
and callable CommonJS uses in `eslint-plugin-react` and `eslint-plugin-jsx-a11y`.
`vendor/minimatch-compat` is a private local facade, resolved by the root
`minimatch` dev dependency and its `$minimatch` override. It exports the callable
upstream function with the upstream named exports attached. Every consumer,
including typescript-eslint, delegates matching to the **unmodified** registry
package aliased as `minimatch-modern` (11.0.3). No vulnerable matching code is
vendored or retained, and no advisory is suppressed. The registry alias and its
transitive dependencies retain SHA-512 integrity entries in the npm lock.

This is a compatibility bridge for the APIs used by the current tree, not a
complete emulation of minimatch 3: removed `makeRe`, `regexp`, `matchOne`, `AST`
and other internals are not restored. Reassess it when changing lint consumers;
remove it when all consumers support upstream's current exports directly.
`tests/minimatch-security.test.mjs` checks actual consumer resolution, callable
and named APIs, glob behavior, bounded optimization-level-2 amplification in a
process with a timeout, and React/a11y wildcard rules with positive and negative
cases. The normal lint, build, Node and browser suites remain required.

[entities 9.0.0 release notes](https://github.com/fb55/entities/releases/tag/v9.0.0)
remove streaming decoder/table exports, change encoding output, extend attribute
escaping and remove the deprecated `getCodePoint` export. The application's only
direct use is synchronous `decodeHTML` in `scripts/document-reader.mjs`; that API
is unchanged. The document-library regression checks decoded accented/numeric
heading labels, duplicate anchors and inert encoded markup. Keep htmlparser2 and
dom-serializer on their own compatible entities 8.x dependency: do **not** add a
global entities 9 override. The major upgrade is validated separately in PR #80.
