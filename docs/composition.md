# Composition

Build views and custom components from layout primitives. The JSX should read as the picture without opening the browser.

## Pairing (bidirectional)

| Item    | Direct parent | That parent’s direct children |
| ------- | ------------- | ----------------------------- |
| `Panel` | `Panels`      | only `Panel` (one is allowed) |
| `Row`   | `Rows`        | only `Row`, **two or more**   |
| `Col`   | `Cols`        | only `Col`, **two or more**   |
| `Cell`  | `Grid`        | only `Cell`, **two or more**  |

`Row` must not sit on `Panel`, `Div`, `Col`, `Cell`, or `Grid`. Same idea for `Col` and `Cell`. Fragments and `.map` still have to produce those children.

Custom components are **not** substitutes for `Row` / `Col` / `Cell`. Build them from primitives, then place the custom component inside a `Row`, `Col`, `Cell`, `Panel`, or `Div`.

## Shell → sections → tracks

1. `Panels` — outer shell of the view (`fill`, `scroll`, column vs `horizontal`).
2. `Panel` — sections (surfaces). One is fine. Several for nav + main, or stacked regions.
3. Inside a `Panel`: `Rows` / `Cols` / `Grid` / `Div` / nested `Panels` / type / controls / custom components.

A `Panel` is an **open** section. It is not a homogeneous track.

If there is only one band of content, do not wrap it in `Rows` of one `Row` (or `Cols` of one `Col`, or `Grid` of one `Cell`). Put that content in the `Panel` or a `Div`.

## Who positions

The wrapper layout box owns place. Set `alignX` / `alignY`, `flex`, `fill`, `gap`, `width` / `height` on `Panels`, `Panel`, `Rows`, `Row`, `Cols`, `Col`, `Grid`, `Cell`, or `Div` — not on `Text`, `Button`, or a custom widget so it can “nudge itself.”

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
// Copy is not in a type primitive, so it misses --panelize-text
<Panel>Hello</Panel>
```

```tsx
// A control positions itself. Button has no alignX
<Col>
  <Button alignX='center' label='Save' />
</Col>
```

Center with `alignX` on the wrapper (`Cols`, `Row`, `Panel`), not on `Button`.

## Which primitive?

| You want                    | Use                                                |
| --------------------------- | -------------------------------------------------- |
| The outer frame of a view   | `Panels`                                           |
| A surface (nav, main, card) | `Panel`                                            |
| A vertical list of bands    | `Rows` of two or more `Row`                        |
| A horizontal list of items  | `Cols` of two or more `Col`                        |
| A two-dimensional layout    | `Grid` of two or more `Cell`                       |
| One wrapper or one band     | `Div`, or the `Panel` itself                       |
| Words on screen             | `Text` / `Heading` / `Span` / `TextLink` / `Label` |
| Copyable starting points    | [recipes](recipes.md)                              |
