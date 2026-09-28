# .config

Org-wide lint, format and release configuration. Public.

JS repos install it as a package and extend it; nothing is copied:

```sh
npm i -D github:JakobMelchard/.config#v1.0.0        # package @jakobmelchard/config
```

| Export | Referenced from |
|--------|-----------------|
| `@jakobmelchard/config/eslint` | `eslint.config.js`: `import base from '@jakobmelchard/config/eslint'; export default [...base, …]` |
| `@jakobmelchard/config/prettier` | `package.json`: `"prettier": "@jakobmelchard/config/prettier"` |
| `@jakobmelchard/config/tsconfig` | `tsconfig.json` / `jsconfig.json`: `"extends": "@jakobmelchard/config/tsconfig"` |

Peer deps the consumer installs: `eslint`, `@eslint/js`, `eslint-plugin-jsdoc` (and `globals` for its own blocks). Bump by
moving the tag in `package.json`; Renovate tracks `github:` tags.

Tools without a remote-extends mechanism are still copied with `config-sync` (JakobMelchard/bin), refreshed by `fleet-sync`:

| Source | Copied to | Referenced from |
|--------|-----------|-----------------|
| `ruff/ruff.toml` | `.config/ruff.toml` | `pyproject.toml`: `[tool.ruff] extend = ".config/ruff.toml"` |
| `gitleaks/gitleaks.toml` | `.gitleaks.toml` | picked up by the hooks and the `gitleaks` action |
| `editorconfig/editorconfig` | `.editorconfig` | editors |

`examples` in `manifest.json` are copied only on `config-sync --examples` (release-please, renovate) — those are per-repo files, seeded once.

The org Renovate preset lives in the public `JakobMelchard/.github` repo (`renovate/default.json`: `config:best-practices`, digest-pinned actions and images, automerge for digest/patch bumps). `renovate/default.json` here is only the seed that `config-sync --examples` drops into a new repo as `renovate.json`; it extends `github>JakobMelchard/.github//renovate/default`. Public and private consumers read the same preset, so nothing is inlined anymore.

## Rules

- Change here, bump `version` in `package.json`, tag `v<x.y.z>` on `main`, then bump the tag in JS consumers; `config-sync` for
  the copied files. Consumer copies carry a header and are not edited in place.
- Anything repo-specific (globals, per-directory rules, `target-version`) lives in the consumer's own file that extends the base.
- House style: 2-space, no semicolons, single quotes, trailing commas, 100 columns. JSDoc on every exported function.
