# Shell (`Panels` / `Panel`)

`Panels` is the outer shell of a view. Setting it up well matters more than any control.

Default `Panels` is an **absolute** column (`inset` when `fill`). `relative` opt-in. `horizontal` is a row (sidebar + main). Overlay shells belong on `Panels`, not `Rows fill`.

Direct children: only `Panel`. **One `Panel` is allowed.** Nested shells: a `Panel` may contain another `Panels`. A `Panel` may also sit inside a `Cell` / `Col` / `Row` when that spot needs its own surface (`variant`).

`Panel` is a section (surface). `variant` is `muted` / `base` / `highlighted` (default `base`). It publishes `--panelize-bg`, `--panelize-text`, `--panelize-text-muted`, `--panelize-text-highlighted`, `--panelize-border`. Nested panels and children share those. `dark` / `light` are schemes on the provider, not panel variants. `placeX` / `placeY` place contents inside the `Panel` (one child, or a nested track). They do not replace `alignX` / `alignY` on `Panels`.

## Host height

A filled shell needs a viewport-tall host:

```css
html,
body,
#root {
  height: 100%;
}
```

The library does not set `html` / `body`. For a long in-flow document, drop host `height` and use `min-height: 100%`.

## Page (scroll the shell)

Default column — do not add `horizontal`. Do not put `fill` on the inner `Panel` (that locks height). Use `minHeight='100%'` so a short window still paints. Do not center on the scrolling `Panels`; center on inner `Rows`.

```tsx
<Panels fill scroll='vertical'>
  <Panel variant='muted' minHeight='100%' padding='base'>
    <Rows gap='small'>
      <Row>
        <Heading level={1}>Title</Heading>
      </Row>
      <Row>
        <Text muted>Long page copy…</Text>
      </Row>
    </Rows>
  </Panel>
</Panels>
```

## Split (scroll the pane)

`horizontal` + `fill` on `Panels`. `scroll` on the pane `Panel`, not the outer shell. Sidebar: `width`. Main: `flex` (not `fill` — `fill` fights the sidebar). `stack` on this row: **at most** this wide → column (not Tailwind `md:` and-up).

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

## `scroll`

Only on `Panels` and `Panel`. `vertical` clips x. `horizontal` / `both` need a child actually wider than the box (`width` / `minWidth` on children). Nested `scroll` in a split needs `flex` on the pane (`min-width` / `min-height` 0) so it can shrink.

`Panel` / `Row` / `Col` / `Div` are `flex-shrink: 0` until `flex`.
