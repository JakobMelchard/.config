# .config

Org lint, format and design-token configuration. Public.

JS repos install the npm package and extend it; nothing is copied:

```sh
npm i -D @jakobmelchard/config
```

| Export | Use |
|--------|-----|
| `@jakobmelchard/config/eslint` | `import base from '@jakobmelchard/config/eslint'; export default [...base, ...]` |
| `@jakobmelchard/config/prettier` | `"prettier": "@jakobmelchard/config/prettier"` in `package.json` |
| `@jakobmelchard/config/tsconfig` | `"extends": "@jakobmelchard/config/tsconfig"` |
| `@jakobmelchard/config/tokens.css`, `tokens-dark.css` | CSS `@import` or bundler; see Design tokens |
| `@jakobmelchard/config/tokens.swift` | not imported: copy from `node_modules/@jakobmelchard/config/tokens/` |

The consumer installs the peers `eslint`, `@eslint/js`, `eslint-plugin-jsdoc` (and `globals` for its own blocks).

Ruff, gitleaks, editorconfig, swift-format, release-please and Renovate files are rendered by `JakobMelchard/template`, updated by Renovate's copier manager. This repo no longer syncs them.

## Design tokens

`tokens/tokens.json` is the single source. `tokens/build_tokens.py` (stdlib python3) writes the
committed outputs next to it; CI regenerates them and fails on a diff. Edit `tokens.json`, run
`python3 tokens/build_tokens.py`, never edit outputs.

| Output | Contents |
|--------|----------|
| `tokens.css` | custom properties per theme, plus space, radius and font |
| `tokens-dark.css` | the same, dark only |
| `tokens.swift` | `enum GeneratedTokens`: dark colours and px radii |

Web UIs import the CSS from the package; Apple apps copy `tokens.swift` from `node_modules/@jakobmelchard/config/tokens/`.

## Release

release-please keeps a release PR open. Merging it tags `v<version>`; `publish.yml` stages the
package on npmjs.org (trusted publishing) and the owner approves it. Consumers bump the ref.

House style: 2-space, no semicolons, single quotes, trailing commas, 100 columns, JSDoc on exported functions.
Repo-specific rules live in the consumer's own file that extends the base.
