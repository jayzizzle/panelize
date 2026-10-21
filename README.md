# Panelize

[![CI](https://github.com/jayzizzle/panelize/actions/workflows/ci.yml/badge.svg)](https://github.com/jayzizzle/panelize/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A React layout kit. You compose screens from named boxes and type — not from a className soup.

## Install

```sh
npm install panelize react react-dom styled-components
```

Peer dependencies: `react` and `react-dom` 19, `styled-components` 6. Panelize ships ESM and CJS builds with TypeScript types. It is client-side UI (the build carries `'use client'`); the host owns styled-components server rendering.

## Quick start

1. Give the shell a height in host CSS. The library never touches `html` / `body`.

```css
html,
body,
#root {
  height: 100%;
  margin: 0;
}
```

2. Load the fonts you want (see [Fonts](#fonts)), wrap the app once, and compose a view.

```tsx
import { Button, Heading, Panel, PanelizeProvider, Panels, Row, Rows, Text } from 'panelize'

export function App() {
  return (
    <PanelizeProvider mode='dark'>
      <Panels fill>
        <Panel variant='muted' padding='base'>
          <Rows>
            <Row>
              <Heading level={1}>Hello</Heading>
            </Row>
            <Row>
              <Text muted>Your first Panelize view.</Text>
            </Row>
            <Row>
              <Button label='Continue' />
            </Row>
          </Rows>
        </Panel>
      </Panels>
    </PanelizeProvider>
  )
}
```

With no `theme` prop the provider uses `defaultTheme`. To set colors, brand, and type, see [Theme](#theme).

## Using an AI agent?

Panelize ships docs written for coding agents (`llms.txt` and `docs/`). Installing the package puts them in `node_modules`, but agents do not look there on their own. Point them at it once, from your project root:

```sh
npx panelize init-agents
```

This adds a short Panelize section to `AGENTS.md`, a file most coding agents read. The section tells the agent to read `node_modules/panelize/llms.txt` and `docs/composition.md` before writing UI, so it stays current when you upgrade the package. If `AGENTS.md` already exists, your content is left alone and only the section between the `<!-- panelize:start -->` and `<!-- panelize:end -->` lines is added or updated. Commit the result.

| Option      | Also writes                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `--cursor`  | `.cursor/rules/panelize.mdc`, pulled in by the agent when the task is building or editing UI (`--force` overwrites a file that differs) |
| `--claude`  | `CLAUDE.md` containing an `@AGENTS.md` import, for Claude Code                                                                          |
| `--copilot` | `.github/copilot-instructions.md`                                                                                                       |
| `--all`     | all of the above                                                                                                                        |
| `--dry-run` | Writes nothing; prints what would change                                                                                                |

Prefer to do it by hand, or use a tool with no instructions file? Paste the section from [`examples/AGENTS.md`](examples/AGENTS.md) into its instructions or system prompt.

## Next.js (App Router)

Panelize is client UI with `'use client'` in the bundle, so you can import it from Server Components. styled-components needs its official registry, or server-rendered pages arrive **unstyled** and flash on hydrate.

```tsx
// app/registry.tsx
'use client'
import { useServerInsertedHTML } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }: { children: ReactNode }) {
  const [sheet] = useState(() => new ServerStyleSheet())
  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement()
    sheet.instance.clearTag()
    return <>{styles}</>
  })
  if (typeof window !== 'undefined') return <>{children}</>
  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
}
```

Wrap `children` in `app/layout.tsx` with it, then use `PanelizeProvider` inside. If TypeScript complains about `stylis`, add `@types/stylis`. Host CSS for `html` / `body` height still applies.

## Fonts

Type tokens use `family`: `base` (Open Sans), `display` (Montserrat), `mono` (system stack). **The library does not load font files.** Load them in the host, or override the stacks with `createPanelizeTheme({ fontFamilies })`.

```html
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;700;800&family=Open+Sans:wght@400;700;800&display=swap"
  rel="stylesheet"
/>
```

Open Sans has no weight 100; Montserrat does. Without the files, the browser falls back to `sans-serif`.

## Goals

The layout primitives — `Panels`, `Panel`, `Rows` / `Row`, `Cols` / `Col`, `Grid` / `Cell`, `Div` — are the building blocks for app and site views, and for the custom components those views are made of. `Text`, `Heading`, `Span`, and `TextLink` sit with them: copy is part of the map.

The JSX should read as the picture. A column of rows, a sidebar beside a scrolling pane, a title then a muted line then two buttons — you should know **where** things sit without opening the browser. That only holds if the tree stays small and the vocabulary stays small (`fill` vs `flex`, `stack` as “at most this wide”). It is **layout-semantic**, not HTML landmarks (`header` / `nav` still belong to the host).

Appearance is not a pile of color props on every box. **`createPanelizeTheme`** is how you author schemes (`dark` / `light`), panel surfaces (`muted` / `base` / `highlighted`), brand, and type. **`PanelizeProvider`** puts that object on the tree. **`usePanelizeTheme`** is how views and custom components stay on the same colors — the active scheme’s surfaces, plus shared brand and status — so building UI stays standardized. Nested `Panel` variants publish `--panelize-*` so children inherit the surface they sit on.

Forms, buttons, and chips ship with the package so a host can use a complete kit. They are bonus. The core is panels, tracks, grid, and text.

This README is the human usage guide. Hover a component in the IDE for props.

You pass a theme object in. The library does not read a config file from disk, does not take over the host’s styled-components `ThemeProvider`, and does not set `html` / `body`.

```tsx
<Panels fill scroll='vertical'>
  <Panel variant='muted' minHeight='100%'>
    <Rows minHeight='100%' gap='base' alignX='center' alignY='center'>
      <Row>
        <Heading level={1} uppercase color='primary'>
          Panelize
        </Heading>
      </Row>
      <Row>
        <Text muted>A React panel layout library.</Text>
      </Row>
      <Row>
        <Cols gap='small'>
          <Col>
            <Button label='Deploy now' />
          </Col>
          <Col>
            <Button outline label='Details' />
          </Col>
        </Cols>
      </Row>
    </Rows>
  </Panel>
</Panels>
```

That tree is the picture: a full-bleed muted panel, a centered column, a title, a muted line, two actions in a row.

Every public component accepts React `style` and a `css` string (appended last, including `:hover`). `NumberInput` inherits those from `Input`.

Full theme keys: `examples/panelize.theme.md`.

## What it is not

- **Not HTML landmarks.** `Panels` / `Panel` are layout, not `header` / `nav` / `main`. Add those in the host.
- **Not a runtime linter.** It does not warn when you break the composition rules (`Row` outside `Rows`, and so on). Follow them anyway; that is how the tree stays readable.
- **Not a global style layer.** No CSS reset, no `html` / `body` rules, no takeover of the host’s styled-components `ThemeProvider`.
- **Not a font loader or a scheme toggle.** The host loads fonts and owns `mode` state.

## Stability

Panelize is `0.x`. The public API (`src/index.ts`) can still change in a minor release. Pin an exact version in production and read the [changelog](CHANGELOG.md) before upgrading.

## Browser support

Evergreen browsers: **Chrome / Edge 119+, Safari 16.5+, Firefox 121+**. The floor comes from CSS the components use: container queries (`stack`), `color-mix()` (chips, switches, fields), `:user-invalid` (field validation), and `:has()` (`Label`).

`Heading` and `Label` also use `text-box: trim-both cap alphabetic` to hug glyphs. Chrome 133+ and Safari 18.2+ support it. Firefox does not yet, so there the box keeps its normal line-height padding. Layout still works; spacing is slightly looser. Older browsers lose the features above rather than the layout.

## Documentation

| For                        | Read                                                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Composition rules          | [`docs/composition.md`](docs/composition.md)                                                                                           |
| Copyable layouts           | [`docs/recipes.md`](docs/recipes.md)                                                                                                   |
| Every export at a glance   | [`docs/components.md`](docs/components.md)                                                                                             |
| Shell, layout, text, theme | [`docs/shell.md`](docs/shell.md), [`docs/layout.md`](docs/layout.md), [`docs/text.md`](docs/text.md), [`docs/theme.md`](docs/theme.md) |
| Forms and value ownership  | [`docs/forms.md`](docs/forms.md)                                                                                                       |
| Per-control behavior       | [`docs/controls.md`](docs/controls.md)                                                                                                 |
| Accessibility              | [`docs/accessibility.md`](docs/accessibility.md)                                                                                       |
| Every theme key            | [`examples/panelize.theme.md`](examples/panelize.theme.md)                                                                             |
| Props                      | Hover in the IDE, or `dist/index.d.ts`                                                                                                 |

## For agents

**Using Panelize in an app:** read [`llms.txt`](llms.txt) then [`docs/composition.md`](docs/composition.md). After `npm install panelize`, those files are `node_modules/panelize/llms.txt` (export `panelize/llms.txt`) and `node_modules/panelize/docs/`. One-file dump: `llms-full.txt`.

Set up the **host** project with `npx panelize init-agents` (see [Using an AI agent?](#using-an-ai-agent)). The drop-in files are `node_modules/panelize/examples/AGENTS.md` and `examples/cursor-rule.mdc`.

Copyable layouts (page, sidebar, centered card, form, dashboard grid): [`docs/recipes.md`](docs/recipes.md). One line per export: [`docs/components.md`](docs/components.md).

**Changing this library:** [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`AGENTS.md`](AGENTS.md).

## Theme

Export a **stable** object and wrap the tree once. Omit any key to keep the library default.

```ts
import { createPanelizeTheme } from 'panelize'

export const panelizeTheme = createPanelizeTheme({
  colors: {
    dark: {
      app: { background: '#121212', text: '#e8e8e8' },
      muted: {
        background: '#222222',
        text: { base: '#fafafa', muted: '#9a9a9a', highlighted: '#ffffff' },
      },
    },
    // Omit a scheme or variant to keep the library default.
  },
  brand: { primary: '#ff9f2e' },
})
```

```tsx
<PanelizeProvider theme={panelizeTheme} mode={mode}>
  <Panels fill>
    <Panel variant='muted'>
      <Text>Uses your muted background and text</Text>
    </Panel>
  </Panels>
</PanelizeProvider>
```

Without a provider, panels still render using `defaultTheme` (`mode` `dark`).

Author schemes as `createPanelizeTheme({ colors: { dark, light } })`. After create, **`theme.colors` is the active slice** (`muted` / `base` / `highlighted` / `app`) — not `{ dark, light }`. Both maps are `theme.colorSchemes`. `PanelizeProvider` `mode` (default `dark`) picks which slice is active. `usePanelizeTheme().colors` is that slice; `.mode` is the name. Surfaces belong **under** a scheme (`colors.dark.muted`). A top-level `colors.muted` is ignored. `dark` is a scheme, not a panel variant. `borderColor` is a surface (`muted` / `base` / `highlighted`), brand (`primary`), status (`danger`), or raw CSS. Brand and status are shared. Hosts own toggle state — there is no library toggle. `prefers-color-scheme` is host-side, not a `mode` value. The returned object from `createPanelizeTheme` always has `mode: 'dark'`; the provider prop is what the tree uses.

Each panel variant has `background`, `border`, and `text.base` / `text.muted` / `text.highlighted`. The panel’s CSS `color` is `text.base` (`--panelize-text`). Brand (`primary` / `secondary` / `accent`) and status (`danger` / `warning` / `success` / `info`) are global, shared across schemes. Each slot is `{ base, hover, active }`. A hex fills all three (hover lighter, active darker). `Text` / `Button` `color="primary"` uses **base**; `color="danger"` uses `status.danger.base`. Hover/active are for `TextLink` and `Button`. Library `brand.secondary` / `accent` follow `primary` until the host sets them. Status slots do not follow a primary. Filled `Button` ink stays `palette.black`. There is no `subtle` — `Chip` already mixes chroma into `--panelize-bg`. Warning `#ffd60a` as small type on a light panel is weak; filled Button and Chip tint are the intended uses.

`colors.app` is optional per scheme. `PanelizeProvider` always wraps the tree (CSS `color-scheme` from `mode`). If you pass `app.background` and/or `app.text`, those become `--panelize-app-bg` / `--panelize-app-text` on that wrapper. It does not set `html` / `body`.

```tsx
<Panels>
  <Panel variant='muted'>
    <Text>Muted</Text>
  </Panel>
  <Panel variant='base'>
    <Text>Base</Text>
  </Panel>
  <Panel variant='highlighted'>
    <Text>Highlighted</Text>
  </Panel>
</Panels>
```

CSS variables on the panel: `--panelize-bg`, `--panelize-text`, `--panelize-text-muted`, `--panelize-text-highlighted`. Nested panels and non-Panel children share them.

## Color bank

One export: `palette`. Not a theme key — cite it when you author a theme or pass `color={palette.gray.dark}` on `Text`. Hue ramps (`palette.red`, …) will use the same five **names** later.

`palette.gray[0]`–`[6]` is a 7-step even-L\* ramp (black → white). Names alias those steps. `palette.black` / `palette.white` are `[0]` / `[6]`. Adjacent steps are **not** a text-on-fill pair — skip at least one.

| Token             | Hex       | Alias           |
| ----------------- | --------- | --------------- |
| `palette.gray[0]` | `#000000` | `palette.black` |
| `palette.gray[1]` | `#292929` | `extraDark`     |
| `palette.gray[2]` | `#4e4e4e` | `dark`          |
| `palette.gray[3]` | `#777777` | `base`          |
| `palette.gray[4]` | `#a2a2a2` | `light`         |
| `palette.gray[5]` | `#d0d0d0` | `extraLight`    |
| `palette.gray[6]` | `#ffffff` | `palette.white` |

```ts
import { createPanelizeTheme, palette } from 'panelize'

createPanelizeTheme({
  colors: {
    dark: {
      muted: {
        background: palette.gray.extraDark,
        text: { base: palette.white, muted: palette.gray.base, highlighted: palette.white },
        border: palette.gray.dark,
      },
    },
  },
})
```

## Layout

`fill` sizes to the parent. On default (absolute) `Panels` that is `inset: 0`, not `height` / `width` 100% — percentage fill on an overlay creates a page scrollbar. Everywhere else (`relative` `Panels`, `Panel`, `Rows`, `Cols`, `Grid`, `Div`) `fill` is 100%. `Row` / `Col` also take `fill`: theme `height` / `width` `auto` counts as a size, so `Row fill` is width 100% (height stays auto) and `Col fill` is height 100% (width stays auto) unless you set that axis. Layout boxes are `border-box`, so padding sits inside `fill`. Explicit `width` / `height` override `fill` on that axis. `flex` grows in a flex parent (`flex: 1 1 0%`) and can shrink below content (`min-width` / `min-height` 0) so a nested scrolling pane works. That is not `fill`. `Panel`, `Row`, `Col`, and `Div` are `flex-shrink: 0` until `flex`.

`Panels` defaults to a **column** (`absolute`; `relative` opt-in). `horizontal` is a row (sidebar + main). `Panel`, `Rows`, `Cols`, `Grid`, and `Div` stay `relative`. Overlay shells belong on `Panels`, not `Rows fill`.

A filled shell needs a viewport-tall host (`html` / `body` / `#root { height: 100% }`). For a long in-flow page, drop `height` and keep `min-height: 100%`.

Page (scroll the shell). Default column — do not add `horizontal`. Inner `fill` locks height and the surface will not grow; `minHeight="100%"` fills a short window. `Panel` / `Row` / `Col` / `Div` do not shrink in a flex parent unless `flex`. Center on inner `Rows`, not on the scrolling `Panels`.

```tsx
<Panels fill scroll='vertical'>
  <Panel variant='muted' minHeight='100%'>
    <Rows gap='small'>
      <Row>
        <Heading level={1}>Title</Heading>
      </Row>
      <Row>
        <Text muted>Page copy…</Text>
      </Row>
    </Rows>
  </Panel>
</Panels>
```

Split (scroll the **pane**, not the outer `Panels`). Omit `horizontal` and the panes stack. `stack` is for this row: at most this wide → column. `fill` on the main pane fights the sidebar (`flex` instead).

```tsx
<Panels horizontal fill stack='sm'>
  <Panel variant='muted' width='12rem'>
    <Text>Nav</Text>
  </Panel>
  <Panel variant='base' flex scroll='vertical'>
    <Text>Main</Text>
  </Panel>
</Panels>
```

`scroll` is only on `Panels` and `Panel`. `scroll="vertical"` clips x (`overflow-x: hidden`). A horizontal bar is `scroll="horizontal"` / `"both"`, and only if a child is actually wider than the box.

`gap` is on `Panels`, `Rows`, `Cols`, and `Grid`. `fill` is on those plus `Panel`, `Row`, `Col`, and `Div` — not on `Cell`. `width` / `height` are on the same set. Omit means unset, except `Row` height and `Col` width default to theme `auto`. Size limits (`minWidth`, …) are on every layout component including `Cell`.

`Div` is a catch-all box (spacing, size, border, `fill` / `flex`). It does not set `background` or `color`.

`alignX` / `alignY` are **screen** axes. They place **this box** in its parent. Track omit: flex cross `stretch` / main `start`; `Grid` `stretch` / `stretch`. Child omit: inherit. Unused flex axis is a no-op. `space-*` is flex main; `baseline` is flex cross.

`placeX` / `placeY` place **contents** inside `Col` / `Row` / `Cell` / `Panel` / `Div`. Omit both = block flow. Either one makes that box a flex container (`Col` / `Panel` / `Div` / `Cell` column; `Row` row). Use them to center one child (an image, a custom widget), not to stack two siblings — those still go in a track.

`wrap` is on `Rows` / `Cols` (not `Grid`). `stack` is on `horizontal` `Panels` / `Cols` / `Grid`: **at most** this wide → column. Not Tailwind `md:` (and-up). Default `Panels` is already a column (`stack` there is ignored). `stackCols` is column count while stacked (default 1). `spanX` / `spanY` are on `Cell`; `stack` forces `spanX` to 1.

Each tree below stands alone. Every track sits inside a `Panel`, and every `Panel` inside a `Panels`.

```tsx
<Panels fill alignX='center' alignY='center'>
  <Panel>
    <Text>Centered</Text>
  </Panel>
</Panels>
```

```tsx
<Panels horizontal fill stack='sm'>
  <Panel>
    <Text>Nav</Text>
  </Panel>
  <Panel flex>
    <Text>Main</Text>
  </Panel>
</Panels>
```

```tsx
<Panels fill>
  <Panel>
    <Rows wrap gap='small' alignX='center' alignY='space-between'>
      <Row height='4rem'>
        <Text>One</Text>
      </Row>
      <Row height='4rem'>
        <Text>Two</Text>
      </Row>
    </Rows>
  </Panel>
</Panels>
```

```tsx
<Panels fill>
  <Panel>
    <Cols stack='sm' gap='small'>
      <Col width='12rem'>
        <Text>Side</Text>
      </Col>
      <Col flex>
        <Text>Main</Text>
      </Col>
    </Cols>
  </Panel>
</Panels>
```

```tsx
<Panels fill>
  <Panel>
    <Grid numCols={3} stackCols={2} gap='small' stack='sm'>
      <Cell>
        <Text>A</Text>
      </Cell>
      <Cell spanX={2}>
        <Text>B</Text>
      </Cell>
    </Grid>
  </Panel>
</Panels>
```

Color/background inherit from the parent `Panel`. Directional borders are on every layout box, including tracks (`Panels` / `Rows` / `Cols` / `Grid`).

## Space

One rem scale for padding, margin, and gap. `Button` uses the same tokens for `padding` / `paddingX` / `paddingY` (no margin — use a layout parent).

| Token        | Default   |
| ------------ | --------- |
| `none`       | `0rem`    |
| `extraSmall` | `0.25rem` |
| `small`      | `0.5rem`  |
| `base`       | `1rem`    |
| `large`      | `1.5rem`  |
| `extraLarge` | `2rem`    |

Library default is `none` when no prop is set. Token or raw CSS length — not a unitless number. Per-side order: `padding` (or theme) → `paddingX` / `paddingY` → `paddingTop` / … (same for margin on layout).

```tsx
<Panels>
  <Panel padding='small' width='12rem'>
    <Text>Padding small, 12rem wide</Text>
  </Panel>
  <Panel paddingX='small' paddingTop='1rem'>
    <Button paddingX='small' paddingY='extraSmall' label='Compact' />
  </Panel>
</Panels>
```

## Borders

Same token **names** as space. Width is **px**. Radius is **rem**. Library default is `none`. Color comes from the variant (`usePanelizeTheme().colors.muted.border`). Override with `borderColor`: panel surface (`muted` / `base` / `highlighted`), brand (`primary`), status (`danger`), or CSS. `base` is the panel `base` border, not a brand slot. `dark` / `light` are schemes, not border colors.

Every layout box (`Panels` / `Panel` / `Rows` / `Row` / `Cols` / `Col` / `Grid` / `Cell` / `Div`) takes the same width cascade as padding: `borderWidth` → `borderX` / `borderY` → `borderTop` / `borderRight` / `borderBottom` / `borderLeft`. One `borderColor` paints every side that has width. A border is box chrome, not a surface — `variant` / fill stay on `Panel`. Default width is `none`.

| Token        | Width  | Radius     |
| ------------ | ------ | ---------- |
| `none`       | `0`    | `0`        |
| `extraSmall` | `1px`  | `0.125rem` |
| `small`      | `2px`  | `0.25rem`  |
| `base`       | `4px`  | `0.5rem`   |
| `large`      | `8px`  | `0.75rem`  |
| `extraLarge` | `12px` | `1rem`     |

```tsx
<Panels>
  <Panel variant='muted' borderWidth='extraSmall' borderRadius='small'>
    <Text>Outlined, rounded</Text>
  </Panel>
  <Panel borderWidth='extraSmall' borderColor='highlighted'>
    <Rows>
      <Row borderBottom='extraSmall' borderColor='primary'>
        <Text>Section</Text>
      </Row>
      <Row>
        <Text>Next</Text>
      </Row>
    </Rows>
  </Panel>
</Panels>
```

## Type

`Text` is a `<p>`. `Heading` is `h1`–`h6` (`level` required). `Span` is a `<span>`. `TextLink` is an `<a>`. None is a layout shell. Size/weight are **type** tokens, not space.

Color from the nearest `Panel`: omit = `text.base`; `muted` / `highlighted`; `color="primary"` (or `secondary` / `accent`) = brand **base**; `color="danger"` (or `warning` / `success` / `info`) = status **base**; raw CSS on `color` wins. If both flags, `highlighted` wins.

`Span` nested in `Text` / `Span`: omit size/weight/`family` → inherit that line; omit color → CSS `inherit`. Standalone omit size/weight/`family` → `defaults.text` and `base`.

`TextLink` default rest/hover/active is `brand.primary`. Nested omit size/weight/`family` → inherit. `hoverUnderline` default `false`. `:focus-visible` is `currentColor`. `defaults.textLink.hover: 'inherit'` uses panel `text.base`.

`Heading` `level` picks the tag. Omit `size` = `defaults.heading.size[level]` (UA rem: `2` / `1.5` / `1.17` / `1` / `0.83` / `0.67`). Instance `size` overrides. Omit `weight` = `bold`. Omit `family` = `display`. Hosts change the bank in `createPanelizeTheme`. No UA heading margin; the line box hugs the glyphs (`line-height: 1`). Put spacing on the parent (`gap` on `Rows` / `Cols`, or margin or padding on a `Row` / `Col`), not on `Heading`.

`align` is `text-align` (`start` / `end` / `center` / `justify`). Omit = unset. It is not place — `alignX` / `alignY` stay on the wrapper. A `Text` / `Heading` is a block as wide as its parent when the row stretches, so `alignX` on the `Row` will not move the glyphs.

Family is a token prop: `base` (Open Sans), `display` (Montserrat), `mono` (system stack). Not CSS `display`. `Text` / `Button` / `Chip` omit = `base`. The library does not load font files. `lineHeight` is unitless `1.2`. `uppercase` is a bool. Omit `weight` on `Text` = `base` (`400`) so parent weight does not leak.

| `size`       | Default    | `weight` | CSS |
| ------------ | ---------- | -------- | --- |
| `extraSmall` | `0.75rem`  | `thin`   | 100 |
| `small`      | `0.875rem` | `base`   | 400 |
| `base`       | `1rem`     | `bold`   | 700 |
| `large`      | `1.25rem`  | `heavy`  | 800 |
| `extraLarge` | `1.5rem`   |          |     |

```tsx
<Panels fill>
  <Panel>
    <Rows gap='small'>
      <Row>
        <Heading level={1}>Title</Heading>
      </Row>
      <Row>
        <Text family='display' size='large' weight='bold' uppercase>
          Display
        </Text>
      </Row>
      <Row>
        <Text muted size='small' align='center'>
          Nested <Span weight='bold'>bold</Span> and <TextLink href='/docs'>Docs</TextLink>
        </Text>
      </Row>
    </Rows>
  </Panel>
</Panels>
```

## Controls

Forms, buttons, and chips are bonus. Each takes `color`, `style`, and `css`; the wrapper places them. Full behavior notes: [`docs/controls.md`](docs/controls.md). Value ownership and validation: [`docs/forms.md`](docs/forms.md).

Each snippet below lists separate examples of one control; they are not one tree. In a view, every control sits in a `Row` / `Col` / `Cell`, and a label with its field is a `Rows` of two `Row`s (see [Form fields](docs/recipes.md#form-fields)).

### Button

`<button>` with a filled brand slot by default; `outline` for a hollow one. Caption via `label`. Details: [`docs/controls.md`](docs/controls.md#button).

```tsx
<Button label='Deploy now' />
<Button outline label='Details' />
<Button color='secondary' label='Secondary' />
<Button color='danger' outline label='Delete' />
<Button fill label='Stretch' />
<Button disabled label='Disabled' />
<Button css='letter-spacing: 0.08em' label='Custom css' />
<Button background='highlighted' ink='primary' label='Custom paint' />
<Button
  outline
  ink={{ base: 'primary', hover: 'highlighted', active: 'highlighted' }}
  label='Ghost'
/>
```

### Chip

`<span>` badge tinted from a brand or status slot. Not a button. Details: [`docs/controls.md`](docs/controls.md#chip).

```tsx
<Chip label='New' />
<Chip color='secondary' label='Beta' />
<Chip color='success' label='Live' />
<Chip borderWidth='extraSmall' borderColor='accent' label='Stroke' />
<Chip background='highlighted' ink='primary' label='Painted' />
```

### Input

Native `<input>`. Rest chrome comes from the nearest `Panel`; `color` is the **focus** accent only. Details: [`docs/controls.md`](docs/controls.md#input).

```tsx
<Input placeholder='Focus me' aria-label='Focus me' fill />
<Input color='accent' placeholder='Accent focus' aria-label='Accent focus' />
<Input background='highlighted' ink='primary' borderRadius='extraSmall' aria-label='Painted' />
<Input borderColor='primary' aria-label='Primary rest border' />
<Input disabled placeholder='Disabled' aria-label='Disabled' />
```

### NumberInput

`Input` locked to `type="number"`. Read `event.currentTarget.valueAsNumber`. Details: [`docs/controls.md`](docs/controls.md#numberinput).

```tsx
<Rows gap='extraSmall'>
  <Row>
    <Label htmlFor='count' label='Count' />
  </Row>
  <Row>
    <NumberInput id='count' min={0} max={100} step={1} defaultValue={1} fill />
  </Row>
</Rows>
<NumberInput min={0} step='any' placeholder='Amount' aria-label='Amount' />
```

### Textarea

Same chrome as `Input`, as a `<textarea>`. Resize is off until `resize`. Details: [`docs/controls.md`](docs/controls.md#textarea).

```tsx
<Textarea placeholder='Notes' aria-label='Notes' fill />
<Textarea resize placeholder='Drag me' aria-label='Drag me' />
<Textarea color='secondary' rows={6} placeholder='Longer' aria-label='Longer' />
```

### Select

Custom listbox (not a native `<select>`) with a portal menu, `clearable`, `required`, `emptyOption`, and keyboard support. Details: [`docs/controls.md`](docs/controls.md#select).

```tsx
<Rows gap='extraSmall'>
  <Row>
    <Label htmlFor='country' label='Country' />
  </Row>
  <Row>
    <Select
      id='country'
      placeholder='Select country'
      value={country}
      onChange={setCountry}
      clearable
      selectedAtTop
      emptyOption
      fill
    >
      <Option value='us'>United States</Option>
      <Option value='mx'>Mexico</Option>
    </Select>
  </Row>
</Rows>
```

### MultiSelect

Custom multi listbox. Shows `N selected`; the menu stays open while toggling. Details: [`docs/controls.md`](docs/controls.md#multiselect).

```tsx
<Rows gap='extraSmall'>
  <Row>
    <Label htmlFor='countries' label='Countries' />
  </Row>
  <Row>
    <MultiSelect
      id='countries'
      placeholder='Select countries'
      value={countries}
      onChange={setCountries}
      clearable
      selectedAtTop
      fill
    >
      <Option value='us'>United States</Option>
      <Option value='ca'>Canada</Option>
      <Option value='jp'>Japan</Option>
    </MultiSelect>
  </Row>
</Rows>
```

### Switch

`<input role="switch">`. Wrap it in a `Label` of the same `size`. Details: [`docs/controls.md`](docs/controls.md#switch).

```tsx
<Label htmlFor='auto-save'>
  <Switch
    id='auto-save'
    defaultChecked
    onChange={(event) => setAutoSave(event.currentTarget.checked)}
  />{' '}
  Auto-save drafts
</Label>
<Switch color='secondary' defaultChecked aria-label='Secondary' />
<Switch size='large' color='accent' borderRadius='small' aria-label='Accent' />
<Switch color='success' defaultChecked aria-label='Live' />
<Switch disabled aria-label='Off and disabled' />
```

### Checkbox

`<input type="checkbox">` with `indeterminate` and `hideCheckIcon`. Wrap it in a `Label` of the same `size`. Details: [`docs/controls.md`](docs/controls.md#checkbox).

```tsx
<Label htmlFor='sms'>
  <Checkbox
    id='sms'
    defaultChecked
    onChange={(event) => setSms(event.currentTarget.checked)}
  />{' '}
  SMS notifications
</Label>
<Checkbox color='secondary' defaultChecked aria-label='Secondary' />
<Checkbox color='accent' aria-label='Accent' />
<Checkbox indeterminate aria-label='Select all' />
<Checkbox hideCheckIcon defaultChecked aria-label='Fill only' />
<Checkbox disabled aria-label='Off and disabled' />
<Checkbox defaultChecked disabled aria-label='On and disabled' />
```

### Radio

`<input type="radio">`; the host owns the group. Wrap it in a `Label` of the same `size`. Details: [`docs/controls.md`](docs/controls.md#radio).

```tsx
<Label htmlFor='hobby' size='small'>
  <Radio
    id='hobby'
    name='plan'
    value='hobby'
    size='small'
    defaultChecked
    onChange={(event) => setPlan(event.currentTarget.value)}
  />{' '}
  Hobby — Free
</Label>
<Radio name='plan' value='pro' color='secondary' aria-label='Pro' />
<Radio name='plan' value='team' color='accent' aria-label='Team' />
<Radio name='plan' value='enterprise' disabled aria-label='Enterprise' />
```

### Label

`<label>` with `Text`-like ink. Wrap `Switch` / `Checkbox` / `Radio` in it. Details: [`docs/controls.md`](docs/controls.md#label).

```tsx
<Rows gap='extraSmall'>
  <Row>
    <Label htmlFor='email' label='Email' />
  </Row>
  <Row>
    <Input id='email' type='email' />
  </Row>
</Rows>
<Label htmlFor='sms' size='small'>
  <Checkbox id='sms' size='small' /> SMS notifications
</Label>
<Label htmlFor='docs'>
  Read the <TextLink href='/docs'>docs</TextLink>
</Label>
```

## Contributing

Humans and agents changing this library: [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE)
