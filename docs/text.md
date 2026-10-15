# Text

Visible copy must use a type primitive so it inherits the nearest `Panel` (`--panelize-text`, muted, highlighted) and theme type tokens.

| Component  | Element   | Notes                                                                                                                         |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Text`     | `p`       | Body. Omit color → panel `text.base`.                                                                                         |
| `Heading`  | `h1`–`h6` | Required `level` `1`–`6`. Omit `size` → theme heading size for that level. Omit `weight` → `bold`. Omit `family` → `display`. |
| `Span`     | `span`    | Nested in `Text` / `Span`: omit size/weight/`family` → inherit. Omit color → CSS `inherit`.                                   |
| `TextLink` | `a`       | Default chroma `primary`. Nested omit size/weight/`family` → inherit.                                                         |
| `Label`    | `label`   | Caption for controls. Prefer `label` prop; `htmlFor` + control `id`. Wrap `Switch` / `Checkbox` / `Radio`.                    |

None of these is a layout shell: no `fill` / `flex` / padding. Spacing belongs on the parent: `gap` on `Rows` / `Cols` / `Grid`, or margin or padding on a `Row` / `Col` / `Cell` / `Div`.

`muted` / `highlighted` use the panel `text` object. `color='primary'` / `secondary` / `accent` → `brand.*.base`. `color='danger'` / `warning` / `success` / `info` → `status.*.base`. Raw CSS `color` wins. If both flags, `highlighted` wins.

Size: `fontSizes` tokens or CSS. Weight: omit on `Text` = `base` (400). Family: `base` / `display` / `mono`. The library does not load font files.

```tsx
<Heading level={1} uppercase color='primary'>
  Panelize
</Heading>
<Text muted size='small'>
  Nested <Span weight='bold'>bold</Span> and <TextLink href='/docs'>Docs</TextLink>
</Text>
```
