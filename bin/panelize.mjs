#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const START = '<!-- panelize:start -->'
const END = '<!-- panelize:end -->'

const USAGE = `Usage: panelize init-agents [options]

Adds Panelize agent instructions to the project in the current directory.
Run it from your project root (the folder with package.json).

By default it writes a Panelize section into AGENTS.md. Existing content outside
the section is never touched, and re-running updates only the section.

Options:
  --cursor    also write .cursor/rules/panelize.mdc
  --claude    also write CLAUDE.md (imports AGENTS.md)
  --copilot   also write .github/copilot-instructions.md
  --all       --cursor --claude --copilot
  --force     overwrite an existing .cursor/rules/panelize.mdc that differs
  --dry-run   print what would change and write nothing
  --help      show this message
`

const flags = new Set(['--cursor', '--claude', '--copilot', '--all', '--force', '--dry-run'])

function fail(message) {
  console.error(message)
  process.exit(1)
}

const [command, ...args] = process.argv.slice(2)
if (!command || command === '--help' || command === '-h' || args.includes('--help')) {
  console.log(USAGE)
  process.exit(command ? 0 : 1)
}
if (command !== 'init-agents') fail(`Unknown command "${command}".\n\n${USAGE}`)
const unknown = args.find((arg) => !flags.has(arg))
if (unknown) fail(`Unknown option "${unknown}".\n\n${USAGE}`)

const has = (flag) => args.includes(flag)
const all = has('--all')
const dryRun = has('--dry-run')
const cwd = process.cwd()
if (!existsSync(join(cwd, 'package.json'))) {
  fail('No package.json in this directory. Run this from your project root.')
}

const read = (path) => readFileSync(path, 'utf8')
const packaged = (file) => read(join(packageRoot, file))

function write(path, text) {
  if (dryRun) return
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

// Insert or replace the marked Panelize section in a Markdown file.
function mergeSection(file, body) {
  const path = join(cwd, file)
  const section = `${START}\n${body.trim()}\n${END}\n`
  if (!existsSync(path)) {
    write(path, section)
    return 'created'
  }
  const current = read(path)
  const eol = current.includes('\r\n') ? '\r\n' : '\n'
  const text = section.replace(/\n/g, eol)
  const start = current.indexOf(START)
  const end = current.indexOf(END)
  if (start === -1 && end === -1) {
    write(path, current.trim() ? `${current.trimEnd()}${eol}${eol}${text}` : text)
    return 'appended'
  }
  if (start === -1 || end < start) {
    throw new Error(`${file} has a damaged Panelize section (check the ${START} / ${END} lines)`)
  }
  const tail = current.slice(end + END.length).replace(/^\r?\n/, '')
  const next = current.slice(0, start) + text + tail
  if (next === current) return 'unchanged'
  write(path, next)
  return 'updated'
}

// Write a whole file. A different existing file is left alone unless --force.
function writeWhole(file, body) {
  const path = join(cwd, file)
  if (!existsSync(path)) {
    write(path, body)
    return 'created'
  }
  if (read(path) === body) return 'unchanged'
  if (!has('--force')) return 'skipped (exists and differs; use --force to overwrite)'
  write(path, body)
  return 'overwritten'
}

const agents = packaged('examples/AGENTS.md')
const steps = [['AGENTS.md', () => mergeSection('AGENTS.md', agents)]]
if (all || has('--cursor')) {
  const rule = () => writeWhole('.cursor/rules/panelize.mdc', packaged('examples/cursor-rule.mdc'))
  steps.push(['.cursor/rules/panelize.mdc', rule])
}
if (all || has('--claude')) steps.push(['CLAUDE.md', () => mergeSection('CLAUDE.md', '@AGENTS.md')])
if (all || has('--copilot')) {
  steps.push([
    '.github/copilot-instructions.md',
    () => mergeSection('.github/copilot-instructions.md', agents),
  ])
}

let failed = false
for (const [file, run] of steps) {
  try {
    console.log(`${run()}  ${file}${dryRun ? '  (dry run)' : ''}`)
  } catch (error) {
    failed = true
    console.error(`error    ${file}: ${error.message}`)
  }
}
if (!failed && !dryRun) console.log('\nCommit these files so everyone on the project gets them.')
process.exit(failed ? 1 : 0)
