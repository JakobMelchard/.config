import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const outs = ['tokens.css', 'tokens-dark.css', 'tokens.swift']
const read = (f) => readFileSync(new URL(`../tokens/${f}`, import.meta.url), 'utf8')

test('generator reproduces the committed token files', () => {
  const before = outs.map(read)
  execFileSync('python3', [new URL('../tokens/build_tokens.py', import.meta.url).pathname])
  assert.deepEqual(outs.map(read), before)
})

test('tokens-dark.css has no light block', () => {
  assert.doesNotMatch(read('tokens-dark.css'), /data-theme='light'/)
})

test('package ships the generated files', () => {
  const out = execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' })
  const paths = JSON.parse(out)[0].files.map((f) => f.path)
  for (const f of outs) assert.ok(paths.includes(`tokens/${f}`), f)
  for (const f of ['eslint/base.js', 'prettier/prettierrc.json', 'tsconfig/base.json'])
    assert.ok(paths.includes(f), f)
})
