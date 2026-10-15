import { relative } from 'node:path'

const quote = (files) => files.map((file) => JSON.stringify(file)).join(' ')
const isLlmsSource = (file) => /^(llms\.txt|docs\/[^/]+\.md)$/.test(relative(process.cwd(), file))

export default {
  '*.{ts,tsx}': (files) => [`eslint --fix ${quote(files)}`, `prettier --write ${quote(files)}`],
  // One rule, run in order: format first, then rebuild llms-full.txt from the formatted sources.
  '*.{md,json,mjs,css,yml,txt}': (files) => {
    const formattable = files.filter((file) => !file.endsWith('.txt'))
    const commands = formattable.length ? [`prettier --write ${quote(formattable)}`] : []
    if (files.some(isLlmsSource)) commands.push('npm run llms-full', 'git add llms-full.txt')
    return commands
  },
}
