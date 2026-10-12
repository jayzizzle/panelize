import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const cli = join(root, 'bin/panelize.mjs')
const example = (file: string) => readFileSync(join(root, 'examples', file), 'utf8')
const START = '<!-- panelize:start -->'
const END = '<!-- panelize:end -->'

let dir: string
const run = (...args: string[]) =>
  spawnSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8' })
const file = (name: string) => join(dir, name)
const text = (name: string) => readFileSync(file(name), 'utf8')

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'panelize-init-'))
  writeFileSync(file('package.json'), '{}')
})
afterEach(() => rmSync(dir, { recursive: true, force: true }))

describe('panelize init-agents', () => {
  it('creates AGENTS.md with the marked section and nothing else', () => {
    const result = run('init-agents')
    expect(result.status).toBe(0)
    expect(text('AGENTS.md')).toBe(`${START}\n${example('AGENTS.md').trim()}\n${END}\n`)
    expect(existsSync(file('CLAUDE.md'))).toBe(false)
    expect(existsSync(file('.cursor'))).toBe(false)
  })

  it('appends to an existing AGENTS.md and keeps its content', () => {
    writeFileSync(file('AGENTS.md'), '# Mine\n\nKeep this.\n')
    expect(run('init-agents').status).toBe(0)
    const out = text('AGENTS.md')
    expect(out.startsWith('# Mine\n\nKeep this.\n\n' + START)).toBe(true)
    expect(out.endsWith(END + '\n')).toBe(true)
  })

  it('is idempotent and updates only the marked section', () => {
    writeFileSync(file('AGENTS.md'), `# Mine\n\n${START}\nold\n${END}\n\n## After\n`)
    expect(run('init-agents').stdout).toContain('updated')
    const once = text('AGENTS.md')
    expect(once).toContain('# Mine')
    expect(once).toContain('## After')
    expect(once).not.toContain('\nold\n')
    expect(run('init-agents').stdout).toContain('unchanged')
    expect(text('AGENTS.md')).toBe(once)
  })

  it('preserves CRLF line endings', () => {
    writeFileSync(file('AGENTS.md'), '# Mine\r\n')
    run('init-agents')
    expect(text('AGENTS.md').replace(/\r\n/g, '')).not.toContain('\n')
  })

  it('refuses a damaged section and leaves the file alone', () => {
    writeFileSync(file('AGENTS.md'), `${START}\nhalf\n`)
    const result = run('init-agents')
    expect(result.status).toBe(1)
    expect(text('AGENTS.md')).toBe(`${START}\nhalf\n`)
  })

  it('writes the tool files only when asked', () => {
    expect(run('init-agents', '--all').status).toBe(0)
    expect(text('.cursor/rules/panelize.mdc')).toBe(example('cursor-rule.mdc'))
    expect(text('CLAUDE.md')).toContain('@AGENTS.md')
    expect(text('.github/copilot-instructions.md')).toContain(example('AGENTS.md').trim())
  })

  it('does not overwrite a different Cursor rule without --force', () => {
    mkdirSync(file('.cursor/rules'), { recursive: true })
    writeFileSync(file('.cursor/rules/panelize.mdc'), 'mine')
    expect(run('init-agents', '--cursor').stdout).toContain('skipped')
    expect(text('.cursor/rules/panelize.mdc')).toBe('mine')
    run('init-agents', '--cursor', '--force')
    expect(text('.cursor/rules/panelize.mdc')).toBe(example('cursor-rule.mdc'))
  })

  it('writes nothing on --dry-run', () => {
    const result = run('init-agents', '--all', '--dry-run')
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('dry run')
    expect(existsSync(file('AGENTS.md'))).toBe(false)
    expect(existsSync(file('.cursor'))).toBe(false)
  })

  it('needs a package.json and rejects unknown input', () => {
    rmSync(file('package.json'))
    expect(run('init-agents').status).toBe(1)
    writeFileSync(file('package.json'), '{}')
    expect(run('init-agents', '--nope').status).toBe(1)
    expect(run('nope').status).toBe(1)
    expect(run().status).toBe(1)
    expect(run('--help').status).toBe(0)
  })
})
