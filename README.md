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
| `@jakobmelchard/config/tsconfig` | `tsconfig.json` / `jsconfig.json`: `"extends": "@jakobmelchard/config/tsconfig"` |

Peer deps the consumer installs: `eslint`, `@eslint/js`, `eslint-plugin-jsdoc` (and `globals` for its own blocks). Renovate
bumps the version range.

Releasing: release-please keeps a release PR open; merging it tags `v<version>` as melchbot,
`.github/workflows/publish.yml` stages it on npmjs.org through trusted publishing, and the owner approves it (2FA).

Tools without a remote-extends mechanism are still copied with `config-sync` (JakobMelchard/bin), refreshed by `fleet-sync`:

| Source | Copied to | Referenced from |
|--------|-----------|-----------------|
| `ruff/ruff.toml` | `.config/ruff.toml` | `pyproject.toml`: `[tool.ruff] extend = ".config/ruff.toml"` |
| `gitleaks/gitleaks.toml` | `.gitleaks.toml` | picked up by the hooks and the `gitleaks` action |
| `editorconfig/editorconfig` | `.editorconfig` | editors |
| `swift-format/swift-format.json` | `.swift-format` | `swift-format` finds it from the repo root (hooks and `xcode.yml`) |

`examples` in `manifest.json` are copied only on `config-sync --examples` (release-please, renovate) — those are per-repo files, seeded once.

The org Renovate preset lives in the public `JakobMelchard/.github` repo (`renovate/default.json`: `config:best-practices`, digest-pinned actions and images, automerge for digest/patch bumps). `renovate/default.json` here is only the seed that `config-sync --examples` drops into a new repo as `renovate.json`; it extends `github>JakobMelchard/.github//renovate/default`. Public and private consumers read the same preset, so nothing is inlined anymore.

## Design tokens

`tokens/tokens.json` is the one source of the org palette (the JakobMelchard Design System artifact).
`tokens/build_tokens.py` (stdlib python3) generates the consumer files next to it, which are committed; CI
regenerates them and fails on a diff. **Never edit the outputs by hand**: change `tokens.json`, run
`python3 tokens/build_tokens.py`, commit as `feat:` (or `fix:`), release, then bump the ref in the consumers.

| Output | What | Opt-in file |
|--------|------|-------------|
| `tokens/tokens.css` | CSS custom properties per theme (`:root` and `[data-theme='dark']`, `[data-theme='light']`, each with its `color-scheme`) plus space, radius and font variables. No reset: bring your own. | `.config/tokens.path` |
| `tokens/tokens.swift` | `enum GeneratedTokens`: dark-theme colours (`Color(hex:)`, the consumer supplies that initializer) and px radii | `.config/tokens-swift.path` |

Only targets with a consumer exist (attach for Swift; Kotlin and Android went with zmxdroid). Add one to the
generator when a repo needs it.

Web UIs vendor `tokens.css`, since embedded assets (Go `go:embed`, a Python package's static dir) and offline PWA
shells need it inside the repo and same-origin. Opt in with a repo-local `.config/tokens.path` whose first line
is the destination, e.g. `internal/ui/static/tokens.css`; `config-sync tokens --ref v<x.y.z>` then writes it
with a `/* VENDORED from ... @<version> */` header and `config-sync --check` fails on drift without writing
(the org `tokens-check` action runs that in CI). `tokens.swift` works the same way through
`.config/tokens-swift.path` and a `//` header. JS repos can instead import the CSS from the package as
`@jakobmelchard/config/tokens.css`.

`opt_in` in `manifest.json` lists such sources: each is copied only into repos that carry the named file.

## Rules

- Change here, bump `version` in `package.json`, tag `v<x.y.z>` on `main`, then bump the tag in JS consumers; `config-sync` for
  the copied files. Consumer copies carry a header and are not edited in place.
- Anything repo-specific (globals, per-directory rules, `target-version`) lives in the consumer's own file that extends the base.
- House style: 2-space, no semicolons, single quotes, trailing commas, 100 columns. JSDoc on every exported function.
