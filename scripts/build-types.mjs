import { execFileSync } from 'node:child_process'
import { copyFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

// One self-contained declaration file. Per-file declarations use extensionless relative
// imports, which TypeScript `node16` / `nodenext` consumers cannot resolve.
execFileSync(
  'npx',
  [
    'dts-bundle-generator',
    '--project',
    'tsconfig.app.json',
    '--no-check',
    '--export-referenced-types=false',
    '-o',
    'dist/index.d.ts',
    'src/index.ts',
  ],
  { cwd: root, stdio: 'inherit' },
)
copyFileSync(join(dist, 'index.d.ts'), join(dist, 'index.d.cts'))
rmSync(join(dist, 'components'), { recursive: true, force: true })
rmSync(join(dist, 'theme'), { recursive: true, force: true })
