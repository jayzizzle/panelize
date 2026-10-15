# Layout vocabulary

Space / size / border tokens: `none` | `extraSmall` | `small` | `base` | `large` | `extraLarge`. Breakpoints: `sm` | `md` | `lg`. Token or CSS length — not a unitless number. Boxes are `border-box`.

| Prop                      | Meaning                                                                                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fill`                    | Size to parent. Absolute `Panels`: `inset: 0`. Else height / width 100%. `Row` theme height `auto` → width 100% only. `Col` theme width `auto` → height 100% only. Explicit `width` / `height` win. Not on `Cell`. |
| `width` / `height`        | All layout except `Cell`. `Div` omit = unset.                                                                                                                                                                      |
| `flex`                    | `flex: 1 1 0%` plus `min-width` / `min-height` 0 (nested `scroll` can shrink). Not `fill`. `Panel` / `Row` / `Col` / `Div` are `flex-shrink: 0` until `flex`.                                                      |
| `alignX` / `alignY`       | Screen axes. Set on the **wrapper**. Track omit: flex cross `stretch` / main `start`; `Grid` `stretch` / `stretch`. Child omit: inherit.                                                                           |
| `gap`                     | `Panels`, `Rows`, `Cols`, `Grid`.                                                                                                                                                                                  |
| `wrap`                    | `Rows` / `Cols`. Not `stack`. Not `Grid`.                                                                                                                                                                          |
| `stack`                   | `horizontal` `Panels` / `Cols` / `Grid`. Container query, **at most** this wide → column.                                                                                                                          |
| `stackCols`               | `Grid` + `stack`: column count while stacked. Default 1.                                                                                                                                                           |
| `numCols` / `numRows`     | `Grid` only. Equal `minmax(0, 1fr)` tracks.                                                                                                                                                                        |
| `spanX` / `spanY`         | `Cell` only. Default 1. `stack` forces `spanX` to 1 when `stackCols` is 1.                                                                                                                                         |
| `scroll`                  | `Panels` / `Panel` only. See [shell](shell.md).                                                                                                                                                                    |
| `relative` / `horizontal` | `Panels` only.                                                                                                                                                                                                     |

## `Div`

Catch-all box (spacing, size, border, `fill` / `flex`). No background or color of its own. Use it when you need one wrapper and a `Rows` of one `Row` would be wrong. It holds **one** item. Two or more go in `Rows` / `Cols` / `Grid`. Direct children: anything except a stray `Row` / `Col` / `Cell` (those still belong under their tracks). No `gap`; spacing between items comes from the track.

## Tracks

Each tree stands alone. A track sits inside a `Panel`, and a `Panel` inside a `Panels`.

```tsx
<Panels fill>
  <Panel>
    <Rows gap='small' alignX='center'>
      <Row>
        <Text>One</Text>
      </Row>
      <Row>
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

`Cell` has no `width` / `height` / `fill`. Size comes from the grid tracks and `spanX` / `spanY`. `Cell` is `min-width` / `min-height` 0 so content can shrink.

## Borders

Every layout box. Width cascade like padding: `borderWidth` → `borderX` / `Y` → side. `borderColor` is surface, brand, or status — not a `Panel` `variant`. Default width `none`.
