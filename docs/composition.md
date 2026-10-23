# Composition

Build views and custom components from layout primitives. The JSX should read as the picture without opening the browser.

## Pairing (bidirectional)

| Item    | Direct parent                                             | That parent’s direct children           |
| ------- | --------------------------------------------------------- | --------------------------------------- |
| `Panel` | `Panels`, or a `Cell` / `Col` / `Row` for its own surface | `Panels`: only `Panel` (one is allowed) |
| `Row`   | `Rows`                                                    | only `Row`, **two or more**             |
| `Col`   | `Cols`                                                    | only `Col`, **two or more**             |
| `Cell`  | `Grid`                                                    | only `Cell`, **two or more**            |

`Row` must not sit on `Panel`, `Div`, `Col`, `Cell`, or `Grid`. Same idea for `Col` and `Cell`. Fragments and `.map` still have to produce those children.

A `Panel` normally sits under `Panels`. It may also sit inside a `Cell`, `Col`, or `Row` when that spot needs its own surface (`variant`), as a dashboard tile does. If the content can use the surrounding surface, skip the `Panel` and put `Rows` / `Cols` straight in the `Cell`.

Custom components are **not** substitutes for `Row` / `Col` / `Cell`. Build them from primitives, then place the custom component inside a `Row`, `Col`, `Cell`, `Panel`, or `Div`.

## Shell → sections → tracks

1. `Panels` — outer shell of the view (`fill`, `scroll`, column vs `horizontal`).
2. `Panel` — sections (surfaces). One is fine. Several for nav + main, or stacked regions.
3. Inside a `Panel`: `Rows` / `Cols` / `Grid` / `Div` / nested `Panels` / type / controls / custom components.

A `Panel` is an **open** section. It is not a homogeneous track.

**One item** goes straight in the `Panel` or a `Div`. Do not wrap it in `Rows` of one `Row` (or `Cols` of one `Col`, or `Grid` of one `Cell`).

**Two or more items** (a heading, a line of copy, a button) belong in a track: `Rows` when they stack, `Cols` when they sit side by side, `Grid` when they sit in two dimensions. The track owns order, `gap`, and alignment. Loose siblings in a `Panel` or `Div` leave that to chance and make the JSX stop reading as the picture. The same goes for a `Div` with two or more children.

## Who positions

The wrapper layout box owns place. Set `alignX` / `alignY`, `flex`, `fill`, `gap`, `width` / `height` on the layout primitives — not on `Text`, `Button`, or a custom widget so it can “nudge itself.” `alignX` / `alignY` place **this box** in its parent. `placeX` / `placeY` on `Col` / `Row` / `Cell` / `Panel` / `Div` place **contents** inside that box (one child, or a nested track). Tracks (`Panels` / `Rows` / `Cols` / `Grid`) have no `place*`. `align` on type is `text-align` (glyphs in the line), not place.

`Text` / `Heading` / `Span` / `TextLink` / `Label` are not layout shells (no `fill` / `flex` / padding). Controls may take `fill` to stretch the control itself; the parent still decides where the control sits.

## Type

Visible writing uses `Text`, `Heading`, `Span`, `TextLink`, or `Label`. Bare strings in a `Panel` / `Row` / `Col` / `Div` do not pick up `--panelize-text` / muted / highlighted.

## Good

```tsx
<Panels fill scroll='vertical'>
  <Panel variant='muted' minHeight='100%'>
    <Rows minHeight='100%' gap='base' alignX='center' alignY='center'>
      <Row>
        <Heading level={1} color='primary'>
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

Column of rows, last row is two columns of buttons. The `Cols` gap and the `Row` place the buttons; the buttons do not.

One section, one heading — no `Rows`:

```tsx
<Panels fill>
  <Panel variant='base' padding='base'>
    <Heading level={2}>Account</Heading>
  </Panel>
</Panels>
```

One section, several items — a `Rows` with one `Row` each:

```tsx
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
```

## Bad

Each block is wrong. The comment says why.

```tsx
// Row is not a direct child of Rows
<Panel>
  <Row>
    <Text>Hello</Text>
  </Row>
</Panel>
```

```tsx
// Rows of one Row: put the content in the Panel or a Div
<Rows>
  <Row>
    <Text>Hello</Text>
  </Row>
</Rows>
```

```tsx
// Col is not a Rows child
<Rows>
  <Col>
    <Text>Hello</Text>
  </Col>
  <Row>
    <Text>World</Text>
  </Row>
</Rows>
```

```tsx
// Two or more items loose in a Panel: put them in Rows (stacked) or Cols (side by side)
<Panel>
  <Heading level={1}>Hello</Heading>
  <Text muted>Your first Panelize view.</Text>
  <Button label='Continue' />
</Panel>
```

```tsx
// Same for a Div with two or more children
<Div>
  <Text muted>Users</Text>
  <Heading level={3}>1,204</Heading>
</Div>
```

```tsx
// Copy is not in a type primitive, so it misses --panelize-text
<Panel>Hello</Panel>
```

```tsx
// A control positions itself. Button has no alignX
<Col>
  <Button alignX='center' label='Save' />
</Col>
```

Center the **box** with `alignX` on the wrapper (`Cols`, `Row`, `Panel`), not on `Button`. Center **contents** with `placeX` / `placeY` on that wrapper.

## Which primitive?

| You want                    | Use                                                             |
| --------------------------- | --------------------------------------------------------------- |
| The outer frame of a view   | `Panels`                                                        |
| A surface (nav, main, card) | `Panel`                                                         |
| A vertical list of bands    | `Rows` of two or more `Row`                                     |
| A horizontal list of items  | `Cols` of two or more `Col`                                     |
| A two-dimensional layout    | `Grid` of two or more `Cell`                                    |
| One wrapper or one band     | `Div`, or the `Panel` itself                                    |
| Two or more items in a box  | `Rows` / `Cols` / `Grid`, not loose in the box                  |
| Center one child in a slot  | `placeX` / `placeY` on `Col` / `Row` / `Cell` / `Panel` / `Div` |
| Words on screen             | `Text` / `Heading` / `Span` / `TextLink` / `Label`              |
| Copyable starting points    | [recipes](recipes.md)                                           |
