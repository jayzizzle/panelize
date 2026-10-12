import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const files = [
  'llms.txt',
  'docs/composition.md',
  'docs/shell.md',
  'docs/layout.md',
  'docs/text.md',
  'docs/theme.md',
  'docs/forms.md',
  'docs/accessibility.md',
  'docs/controls.md',
  'docs/components.md',
  'docs/recipes.md',
  'examples/panelize.theme.md',
]

const unlisted = readdirSync(join(root, 'docs'))
  .map((name) => `docs/${name}`)
  .filter((file) => file.endsWith('.md') && !files.includes(file))
if (unlisted.length > 0) {
  throw new Error(`Add to build-llms-full.mjs files: ${unlisted.join(', ')}`)
}

const body = files
  .map((file) => `<!-- ${file} -->\n\n${readFileSync(join(root, file), 'utf8').trim()}`)
  .join('\n\n---\n\n')

writeFileSync(join(root, 'llms-full.txt'), `${body}\n`)
