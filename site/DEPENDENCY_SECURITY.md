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
