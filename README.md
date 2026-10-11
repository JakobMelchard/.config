# .config

Org-wide lint, format and release configuration. Public.

JS repos install it as a package and extend it; nothing is copied:

```sh
npm i -D @jakobmelchard/config        # from npmjs.org
```

| Export | Referenced from |
|--------|-----------------|
| `@jakobmelchard/config/eslint` | `eslint.config.js`: `import base from '@jakobmelchard/config/eslint'; export default [...base, …]` |
| `@jakobmelchard/config/prettier` | `package.json`: `"prettier": "@jakobmelchard/config/prettier"` |
| `@jakobmelchard/config/tokens.css` | a bundler or CSS `@import`; see [Design tokens](#design-tokens) |
| `@jakobmelchard/config/tokens-dark.css` | the same, dark theme only |
| `@jakobmelchard/config/tsconfig` | `tsconfig.json` / `jsconfig.json`: `"extends": "@jakobmelchard/config/tsconfig"` |

Peer deps the consumer installs: `eslint`, `@eslint/js`, `eslint-plugin-jsdoc` (and `globals` for its own blocks). Renovate
bumps the version range.

Releasing: release-please keeps a release PR open; merging it tags `v<version>` as melchbot,
`.github/workflows/publish.yml` stages it on npmjs.org through trusted publishing, and the owner approves it (2FA).

Ruff, gitleaks, editorconfig, swift-format, release-please and Renovate files are rendered by `JakobMelchard/template`; Renovate's copier manager carries updates. This repo no longer syncs them; existing copies remain static until a repo adopts the template.

## Design tokens

`tokens/tokens.json` is the one source of the org palette (the JakobMelchard Design System artifact).
`tokens/build_tokens.py` (stdlib python3) generates the consumer files next to it, which are committed; CI
regenerates them and fails on a diff. **Never edit the outputs by hand**: change `tokens.json`, run
`python3 tokens/build_tokens.py`, commit as `feat:` (or `fix:`), release, then bump the ref in the consumers.

| Output | What |
|--------|------|
| `tokens/tokens.css` | CSS custom properties per theme (`:root` and `[data-theme='dark']`, `[data-theme='light']`, each with its `color-scheme`) plus space, radius and font variables. No reset: bring your own. |
| `tokens/tokens-dark.css` | the same without the `[data-theme='light']` block, for UIs that never switch theme |
| `tokens/tokens.swift` | `enum GeneratedTokens`: dark-theme colours (`Color(hex:)`, the consumer supplies that initializer) and px radii |

Only targets with a consumer exist (attach for Swift; Kotlin and Android went with zmxdroid). Add one to the
generator when a repo needs it.

Web UIs import the CSS from the package (`@jakobmelchard/config/tokens.css`) or copy it from `node_modules/@jakobmelchard/config/tokens/`.
Apple apps copy `tokens/tokens.swift` the same way.

## Rules

- Change here, merge the release-please PR (it bumps `version` and tags `v<x.y.z>`), then bump the version in JS consumers.
- Anything repo-specific (globals, per-directory rules, `target-version`) lives in the consumer's own file that extends the base.
- House style: 2-space, no semicolons, single quotes, trailing commas, 100 columns. JSDoc on every exported function.
