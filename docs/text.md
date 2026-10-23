# Text

Visible copy must use a type primitive so it inherits the nearest `Panel` (`--panelize-text`, muted, highlighted) and theme type tokens.

| Component  | Element   | Notes                                                                                                                   |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Text`     | `p`       | Body. Omit color → panel `text.base`. `align` is `text-align`.                                                          |
| `Heading`  | `h1`–`h6` | Required `level` `1`–`6`. Same type props as `Text`, including `align`. Omit `size` → theme size for that level.        |
| `Span`     | `span`    | Nested in `Text` / `Span`: omit size/weight/`family` → inherit. Omit color → CSS `inherit`. `align` is `text-align`.    |
| `TextLink` | `a`       | Default chroma `primary`. Nested omit size/weight/`family` → inherit. `align` is `text-align`.                          |
| `Label`    | `label`   | Caption for controls. Prefer `label` prop; `htmlFor` + control `id`. Wrap `Switch` / `Checkbox` / `Radio`. `align` too. |

None of these is a layout shell: no `fill` / `flex` / padding. Spacing belongs on the parent: `gap` on `Rows` / `Cols` / `Grid`, or margin or padding on a `Row` / `Col` / `Cell` / `Div`.

`align` is `text-align` (`start` / `end` / `center` / `justify`). Omit = unset. It is not place — `alignX` / `alignY` stay on the wrapper. A stretched `Text` / `Heading` is as wide as its parent, so `alignX` on the `Row` will not move the glyphs; set `align` on the type. `Span` and `TextLink` are inline, so `align` only shows when the box is wider than the glyphs.

`muted` / `highlighted` use the panel `text` object. `color='primary'` / `secondary` / `accent` → `brand.*.base`. `color='danger'` / `warning` / `success` / `info` → `status.*.base`. Raw CSS `color` wins. If both flags, `highlighted` wins.

Size: `fontSizes` tokens or CSS. Weight: omit on `Text` = `base` (400). Family: `base` / `display` / `mono`. The library does not load font files.

```tsx
<Panels fill>
  <Panel>
    <Rows gap='small'>
      <Row>
        <Heading level={1} uppercase color='primary' align='center'>
          Panelize
        </Heading>
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
