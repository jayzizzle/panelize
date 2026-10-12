import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import * as panelize from '~/src'

const root = resolve(import.meta.dirname, '..')
const read = (file: string) => readFileSync(join(root, file), 'utf8')
const docs = readdirSync(join(root, 'docs')).filter((name) => name.endsWith('.md'))

describe('docs', () => {
  it('docs/components.md lists every component and theme export', () => {
    const components = read('docs/components.md')
    const names = Object.keys(panelize).filter(
      (name) =>
        /^[A-Z]/.test(name) ||
        ['createPanelizeTheme', 'usePanelizeTheme', 'defaultTheme', 'palette'].includes(name),
    )
    const missing = names.filter((name) => !components.includes(`\`${name}`))
    expect(missing).toEqual([])
  })

  it('llms.txt links every docs page', () => {
    const llms = read('llms.txt')
    const missing = docs.filter((name) => !llms.includes(`docs/${name}`))
    expect(missing).toEqual([])
  })

  it('relative markdown links resolve', () => {
    const files = [
      'README.md',
      'llms.txt',
      'CONTRIBUTING.md',
      'AGENTS.md',
      ...docs.map((name) => `docs/${name}`),
    ]
    const broken: string[] = []
    for (const file of files) {
      for (const [, target] of read(file).matchAll(/\]\(((?!https?:|#|mailto:)[^)\s]+)\)/g)) {
        const path = target.split('#')[0]
        if (path && !existsSync(resolve(root, dirname(file), path)))
          broken.push(`${file} → ${target}`)
      }
    }
    expect(broken).toEqual([])
  })
})
