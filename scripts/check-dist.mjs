import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)

for (const file of [
  'dist/panelize.es.js',
  'dist/panelize.cjs',
  'dist/index.d.ts',
  'dist/index.d.cts',
]) {
  if (!existsSync(join(root, file))) throw new Error(`Missing ${file}. Run npm run build first.`)
}

const esm = await import(join(root, 'dist/panelize.es.js'))
const cjs = require(join(root, 'dist/panelize.cjs'))

const esmKeys = Object.keys(esm).sort()
const cjsKeys = Object.keys(cjs)
  .filter((key) => key !== 'default')
  .sort()
if (JSON.stringify(esmKeys) !== JSON.stringify(cjsKeys)) {
  throw new Error('ESM and CJS builds export different names')
}
for (const name of ['Panels', 'Panel', 'PanelizeProvider', 'createPanelizeTheme', 'palette']) {
  if (!(name in esm)) throw new Error(`Missing export ${name}`)
}
console.log(`dist ok: ${esmKeys.length} exports in both ESM and CJS`)
