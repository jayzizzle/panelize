# Theme and hooks

Appearance comes from the theme, not one-off color props on every box. That is how views stay standardized.

## `createPanelizeTheme`

Author schemes, surfaces, brand, type, and component defaults. Export a **stable** object. Omit any key to keep the library default. Full keys: [examples/panelize.theme.md](../examples/panelize.theme.md). Frozen gray bank: `palette` from `'panelize'` (not a theme key).

```ts
import { createPanelizeTheme, palette } from 'panelize'

export const panelizeTheme = createPanelizeTheme({
  colors: {
    dark: {
      app: { background: palette.gray.extraDark, text: palette.gray.extraLight },
      muted: {
        background: palette.gray.dark,
        text: { base: palette.white, muted: palette.gray.base, highlighted: palette.white },
      },
    },
  },
  brand: { primary: '#ff9f2e' },
})
```

`colors: { dark, light }` are schemes. After create, **`theme.colors` is the active slice** (`muted` / `base` / `highlighted` / `app`) — not `{ dark, light }`. Both maps are `theme.colorSchemes`. Surfaces belong under a scheme (`colors.dark.muted`). A top-level `colors.muted` is ignored. `dark` is a scheme, not a panel variant.

Brand (`primary` / `secondary` / `accent`) and status (`danger` / `warning` / `success` / `info`) are global, shared across schemes. Library `secondary` / `accent` follow `primary` until set. Status does not follow `primary`. Hosts set their brand kit here; the library defaults stay neutral.

## `PanelizeProvider`

Puts that object on the tree and wraps a canvas (`color-scheme` from `mode`; optional `app` paint). `mode` (`dark` default) selects the slice. Hosts own the toggle — there is no library toggle. `prefers-color-scheme` is host-side.

Do **not** take over the host’s styled-components `ThemeProvider`. Do **not** set `html` / `body`.

Without a provider, components still render using `defaultTheme` (`mode` `dark`). Always wrap a real host.

```tsx
<PanelizeProvider theme={panelizeTheme} mode={mode}>
  {children}
</PanelizeProvider>
```

## `usePanelizeTheme`

**Use this in views and custom components** that need colors, space, or type from the kit. `.colors` is the current scheme’s surfaces. `.mode` is `'dark'` | `'light'`. `.brand` / `.status` are the shared slots. `.space` / `.fontSizes` / … are the scales.

Do not invent a parallel palette in a custom component. Read the theme (or inherit `--panelize-*` from the nearest `Panel`). Nested `Panel` `variant` changes the CSS variables for descendants.

```tsx
function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = usePanelizeTheme()
  return (
    <Div padding='small' borderWidth='extraSmall' borderColor={colors.base.border}>
      <Rows>
        <Row>
          <Text muted size='small'>
            {label}
          </Text>
        </Row>
        <Row>
          <Text highlighted>{value}</Text>
        </Row>
      </Rows>
    </Div>
  )
}
```

Place `Stat` in a `Col` / `Row` / `Cell` / `Panel`. `Stat` does not take `alignX`.

## Recipes

Author the theme once in the host, export a stable object, and pass `mode` from wherever the host keeps its color-scheme state. The library has no toggle and does not read `prefers-color-scheme`.

**Brand kit.** `secondary` and `accent` follow `primary` until set. Status colors do not follow brand.

```ts
export const panelizeTheme = createPanelizeTheme({
  brand: {
    primary: '#6d5dfc',
    secondary: '#00b8a9',
    accent: { base: '#f9c80e', hover: '#ffd84d' },
  },
  status: { danger: '#d64550' },
})
```

**Both schemes.** Author `dark` and `light` surfaces together. Omit any surface to keep the default.

```ts
createPanelizeTheme({
  colors: {
    dark: { app: { background: '#0e0e10', text: '#ececec' } },
    light: {
      app: { background: '#ffffff', text: '#1a1a1a' },
      muted: {
        background: '#f3f3f5',
        text: { base: '#1a1a1a', muted: '#6b6b73', highlighted: '#000000' },
      },
    },
  },
})
```

**Fonts and type scale.** The library does not load font files. Point the tokens at what the host loads.

```ts
createPanelizeTheme({
  fontFamilies: { base: 'Inter, sans-serif', display: '"Fraunces", serif' },
  fontSizes: { base: '1.0625rem' },
})
```

**Component defaults.** Change a control everywhere instead of on every instance. `defaults.textarea` and `defaults.select` start from the merged `defaults.input`.

```ts
createPanelizeTheme({
  defaults: {
    button: { borderRadius: 'small', paddingX: 'large' },
    input: { borderRadius: 'small' },
    select: { listMaxHeight: '12rem' },
  },
})
```

**Custom component on the theme.** Read `usePanelizeTheme` or inherit `--panelize-*` from the nearest `Panel`; do not hard-code hexes. See `Stat` above.
