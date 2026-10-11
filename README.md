# .config

Org lint, format and tsconfig bases. Public. Design tokens live in `@jakobmelchard/web`.

JS repos install the npm package and extend it; nothing is copied:

```sh
npm i -D @jakobmelchard/config
```

| Export | Use |
|--------|-----|
| `@jakobmelchard/config/eslint` | `import base from '@jakobmelchard/config/eslint'; export default [...base, ...]` |
| `@jakobmelchard/config/prettier` | `"prettier": "@jakobmelchard/config/prettier"` in `package.json` |
| `@jakobmelchard/config/tsconfig` | `"extends": "@jakobmelchard/config/tsconfig"` |

The consumer installs the peers `eslint`, `@eslint/js`, `eslint-plugin-jsdoc` (and `globals` for its own blocks).

Ruff, gitleaks, editorconfig, swift-format, release-please and Renovate files are rendered by `JakobMelchard/template`, updated by Renovate's copier manager. This repo no longer syncs them.

## Release

release-please keeps a release PR open. Merging it tags `v<version>`; `publish.yml` stages the
package on npmjs.org (trusted publishing) and the owner approves it. Consumers bump the ref.

House style: 2-space, no semicolons, single quotes, trailing commas, 100 columns, JSDoc on exported functions.
Repo-specific rules live in the consumer's own file that extends the base.
