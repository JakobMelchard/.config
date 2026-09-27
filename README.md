# .config

Org-wide lint, format and release configuration. Private. Repos copy what they use with `config-sync` (JakobMelchard/bin); nothing here is imported over the network at build time, so private-dependency auth never enters the picture.

| Source | Copied to | Referenced from |
|--------|-----------|-----------------|
| `eslint/base.js` | `.config/eslint.base.js` | `eslint.config.js`: `import base from './.config/eslint.base.js'; export default [...base, …]` |
| `prettier/prettierrc.json` | `.config/prettier.json` | `package.json`: `"prettier": "./.config/prettier.json"` |
| `tsconfig/base.json` | `.config/tsconfig.base.json` | `tsconfig.json`: `"extends": "./.config/tsconfig.base.json"` |
| `ruff/ruff.toml` | `.config/ruff.toml` | `pyproject.toml`: `[tool.ruff] extend = ".config/ruff.toml"` |
| `gitleaks/gitleaks.toml` | `.gitleaks.toml` | picked up by the hooks and the `gitleaks` action |
| `editorconfig/editorconfig` | `.editorconfig` | editors |

`examples` in `manifest.json` are copied only on `config-sync --examples` (release-please, renovate) — those are per-repo files, seeded once.

The org Renovate preset lives in the public `JakobMelchard/.github` repo (`renovate/default.json`: `config:best-practices`, digest-pinned actions and images, automerge for digest/patch bumps). `renovate/default.json` here is only the seed that `config-sync --examples` drops into a new repo as `renovate.json`; it extends `github>JakobMelchard/.github//renovate/default`. Public and private consumers read the same preset, so nothing is inlined anymore.

## Rules

- Change here, then `config-sync` in the consumer. Consumer copies carry a header and are not edited in place.
- Anything repo-specific (globals, per-directory rules, `target-version`) lives in the consumer's own file that extends the copy.
- House style: 2-space, no semicolons, single quotes, trailing commas, 100 columns. JSDoc on every exported function.
