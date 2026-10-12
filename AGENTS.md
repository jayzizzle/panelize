# Panelize — agent notes

This file is for **maintaining the library**. Humans: [`CONTRIBUTING.md`](CONTRIBUTING.md). Agents **building apps with Panelize** start at [`llms.txt`](llms.txt) and [`docs/composition.md`](docs/composition.md).

A React + TypeScript layout library. Layout primitives (`Panels` / `Panel` / `Rows` / `Cols` / `Grid` / `Cell` / `Div`) are the building blocks for views and custom components. Appearance comes from `createPanelizeTheme` + `PanelizeProvider`, not one-off color props. Do not take over the host app’s styled-components `ThemeProvider`. Do not set `html` / `body` CSS from the library. `createPanelizeTheme({ colors: { dark, light } })` authors schemes; returned `colors` is the active slice (`muted` / `base` / `highlighted` / `app`), both maps are `colorSchemes`. `PanelizeProvider` `mode` (`dark` default) selects the slice and always wraps a canvas (`color-scheme`; `app` paint optional). Brand and status are shared across schemes. No library scheme toggle — hosts pass `mode`. `dark` is a scheme, not a panel variant.

## Docs (required on every public change)

If you add or change a **public** component, prop, token, or theme key, update **all** of:

1. `README.md` — usage, vocabulary, caveats (not an exhaustive key dump).
2. `examples/panelize.theme.md` — **every** key `createPanelizeTheme` accepts. New theme keys go here in the sample object.
3. JSDoc on exported prop types (IDE hover is the API).
4. `llms.txt` and `docs/` when composition rules or the public surface agents should use change. A new public component also gets a row in `docs/components.md`. Then `npm run llms-full` (CI fails if `llms-full.txt` is stale).

Do not let README, the example theme, `defaultTheme`, and `docs/` / `llms.txt` drift. Published package includes `llms.txt`, `llms-full.txt`, `docs/`, `README.md`, `LICENSE`, and `examples/` (not only `dist/`).

## Code

- Prettier: no semicolons, single quotes (including JSX), trailing commas, print width 100. Imports use `~/src/...` (no relative `../`). Sort with ESLint `simple-import-sort` (React/packages → `theme/internal` → `theme` → other `~/`). Do not use the editor’s Organize Imports — it fights that grouping.
- Public exports: `src/index.ts`. Public theme: `src/theme/index.ts`. Styled CSS helpers: `src/theme/internal.ts` only — do not re-export them from the package entry.
- Copy an existing primitive (`Panel`, `Row`, `Cols`, `Grid`, `Div`) instead of inventing a new pattern. `takeBoxLayout` for padding/margin and size limits. Every public component takes React `style` and `css?: string` (appended last on the styled sheet).

## Sandbox (your host)

This repo is the library only. There is no app in-tree. To see UI, make your own host (Vite + React is enough) that depends on `"panelize": "file:../panelize"` (or the npm package). That resolves through `exports` to **`dist/`** (`panelize.es.js` + `index.d.ts`). Do **not** Vite-alias `panelize` at this repo’s `src/` — the sandbox must consume the published shape, same as a real host.

**Serve (two processes):**

1. Here: `npm run build` once, or `npm run dev` (`vite build --watch`) so `dist` stays current.
2. In your host: import from `'panelize'`, wrap with `PanelizeProvider`, set `html` / `body` / `#root` height in **host** CSS (the library does not set those).

After a library change, wait for `dist` to rebuild (watch) or run `npm run build` before expecting the host to update.

Dedupe `react` / `react-dom` / `styled-components` to the host’s `node_modules`. A second copy via aliasing Panelize source breaks hooks.

## Layout vocabulary

The prop table (`fill`, `flex`, `alignX` / `alignY`, `scroll`, `stack`, `gap`, spans, borders, tokens) is [`docs/layout.md`](docs/layout.md) and [`docs/shell.md`](docs/shell.md). Do not copy it here. Change the behavior and those docs together.

## Color bank

Frozen `palette` in `src/theme/color.ts`. `palette.gray[0]`–`[6]` is a 7-step even-L\* ramp (`#000000` … `#ffffff`). Names `extraDark` \| `dark` \| `base` \| `light` \| `extraLight` alias `[1]`–`[5]`. `black` / `white` = `[0]` / `[6]`. Import `{ palette }` from `'panelize'`. Not a `createPanelizeTheme` key. Adjacent steps are not text-on-fill pairs (skip one). Hue ramps later use the same five names. Do not duplicate these hexes in components — use `palette`.

## Component contracts

Text primitives and every control (`Text`, `Heading`, `Span`, `TextLink`, `Label`, `Button`, `Chip`, `Input`, `NumberInput`, `Textarea`, `Select`, `MultiSelect`, `Switch`, `Checkbox`, `Radio`) have a contract in [`maintainers/components.md`](maintainers/components.md). Read the entry before changing one. Update it with the same docs checklist as above.

Rules that apply to all of them:

- Color comes from the nearest `Panel` (`--panelize-*`). `color="primary"` / `secondary` / `accent` is `brand.*.base`; `danger` / `warning` / `success` / `info` is `status.*.base`. Raw CSS `color` wins.
- None is a layout shell: no `fill` / `flex` / layout padding. Padding on controls is chrome. The wrapper places them.
- Library does not load font files.
