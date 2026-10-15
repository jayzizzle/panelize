import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const files = [
  'README.md',
  'llms.txt',
  ...readdirSync(join(root, 'docs'))
    .filter((name) => name.endsWith('.md'))
    .map((name) => `docs/${name}`),
]

const trackFor = { Row: 'Rows', Col: 'Cols', Cell: 'Grid' } as const

type Element = ts.JsxElement | ts.JsxSelfClosingElement

const isElement = (node: ts.Node): node is Element =>
  ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)

const tagName = (element: Element) =>
  (ts.isJsxElement(element) ? element.openingElement.tagName : element.tagName).getText()

function parentTag(node: ts.Node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (isElement(parent)) return tagName(parent)
  }
  return null
}

function childCount(element: ts.JsxElement) {
  return element.children.filter((child) => !(ts.isJsxText(child) && !child.getText().trim()))
}

/** Snippets that start with a comment are deliberate counter-examples or non-JSX files. */
function composableBlocks(text: string) {
  return [...text.matchAll(/```tsx\n([\s\S]*?)```/g)]
    .map(([, code]) => code)
    .filter((code) => !code.trimStart().startsWith('//'))
}

function problemsIn(code: string) {
  const declaration = /^\s*(function|import|export|const)\b/.test(code)
  const source = declaration ? code : `const tree = (<>\n${code}\n</>)`
  const file = ts.createSourceFile(
    'snippet.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const problems: string[] = []

  const visit = (node: ts.Node) => {
    if (isElement(node)) {
      const name = tagName(node)
      const children = ts.isJsxElement(node) ? childCount(node) : []
      if ((name === 'Panel' || name === 'Div') && children.length > 1) {
        problems.push(`${name} has ${children.length} loose children; use Rows / Cols / Grid`)
      }
      if (['Rows', 'Cols', 'Grid'].includes(name) && children.length === 1) {
        if (ts.isJsxElement(children[0]) || ts.isJsxSelfClosingElement(children[0])) {
          problems.push(`${name} has one child; put it in the parent instead`)
        }
      }
      if (name in trackFor) {
        const expected = trackFor[name as keyof typeof trackFor]
        if (parentTag(node) !== expected)
          problems.push(`${name} is not directly inside ${expected}`)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  return problems
}

describe('doc examples follow the composition rules', () => {
  it.each(files)('%s', (name) => {
    const text = readFileSync(join(root, name), 'utf8')
    const found = composableBlocks(text).flatMap((code) =>
      problemsIn(code).map((problem) => `${problem}\n${code.trim().split('\n')[0]}`),
    )
    expect(found).toEqual([])
  })
})
