# Components

One line per export from `'panelize'`. Prop details are in the exported prop types (IDE hover) and the [README](../README.md). Layout props are in [layout](layout.md). Every component takes React `style` and `css?: string` (appended last).

## Layout

| Component | Element        | Direct parent | Notes                                                                                    |
| --------- | -------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `Panels`  | `div`          | any           | View shell. Children: only `Panel`. `fill`, `horizontal`, `relative`, `scroll`, `stack`. |
| `Panel`   | `div`          | `Panels`      | Section. `variant` `muted` / `base` / `highlighted`. Publishes `--panelize-*`.           |
| `Rows`    | `div` (column) | any           | Children: two or more `Row`. `gap`, `wrap`, `alignX` / `alignY`.                         |
| `Row`     | `div`          | `Rows`        | `height` defaults to `auto`.                                                             |
| `Cols`    | `div` (row)    | any           | Children: two or more `Col`. `gap`, `wrap`, `stack`.                                     |
| `Col`     | `div`          | `Cols`        | `width` defaults to `auto`.                                                              |
| `Grid`    | `div` (grid)   | any           | Children: two or more `Cell`. `numCols`, `numRows`, `stack`, `stackCols`.                |
| `Cell`    | `div`          | `Grid`        | `spanX` / `spanY`. No `width` / `height` / `fill`.                                       |
| `Div`     | `div`          | any           | Catch-all wrapper. No background or color.                                               |

## Type

| Component  | Element   | Notes                                                                                                     |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `Text`     | `p`       | `muted` / `highlighted` / `color` / `size` / `weight` / `family` / `italic` / `underlined` / `uppercase`. |
| `Heading`  | `h1`–`h6` | Required `level`. Same type props as `Text`.                                                              |
| `Span`     | `span`    | Inline. Inherits size / weight / family from a parent `Text` / `Span`.                                    |
| `TextLink` | `a`       | `color`, `hover`, `hoverUnderline`. Native `href`.                                                        |
| `Label`    | `label`   | `label` or `children`, `htmlFor`. Wrap `Switch` / `Checkbox` / `Radio`.                                   |

`color` on type and controls: `primary` / `secondary` / `accent` (brand), `danger` / `warning` / `success` / `info` (status), or raw CSS.

## Controls

None is a layout shell. The wrapper (`Row` / `Col` / `Cell` / `Panel` / `Div`) places them.

| Component     | Element                        | Value API                                 | Notes                                                                       |
| ------------- | ------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------- |
| `Button`      | `button`                       | `onClick`                                 | `label` or `children`. `color`, `outline`, `size`, `fill`, `disabled`.      |
| `Chip`        | `span`                         | none                                      | Badge, not a button. `label`, `color`.                                      |
| `Input`       | `input`                        | `value` / `onChange`                      | `color` is focus chroma. `ink` is text. Needs `Label` or `aria-label`.      |
| `NumberInput` | `input[type=number]`           | `value` / `onChange` (string)             | Use `event.currentTarget.valueAsNumber`.                                    |
| `Textarea`    | `textarea`                     | `value` / `onChange`                      | `resize` opt-in, `rows` default 3.                                          |
| `Select`      | custom listbox                 | `value: string` / `onChange(value)`       | `options` and/or `Option` children. `clearable`, `required`, `emptyOption`. |
| `MultiSelect` | custom multi listbox           | `value: string[]` / `onChange(value)`     | Count caption. Menu stays open while toggling.                              |
| `Option`      | child of selects               | `value`                                   | Label is `children`.                                                        |
| `Switch`      | `input[checkbox][role=switch]` | `checked` / `onChange`                    | `color` is the on track.                                                    |
| `Checkbox`    | `input[checkbox]`              | `checked` / `onChange`                    | `indeterminate`, `hideCheckIcon`.                                           |
| `Radio`       | `input[radio]`                 | `name` / `value` / `checked` / `onChange` | Host owns the group.                                                        |

`Switch` / `Checkbox` / `Radio` and their `Label` share one `size`. These three have no `fill`, `label`, or `children`.

## Theme

| Export                           | Purpose                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `createPanelizeTheme(overrides)` | Merge overrides onto the defaults. Keys: [theme keys](../examples/panelize.theme.md). |
| `PanelizeProvider`               | `theme` (optional) and `mode` `dark` (default) / `light`.                             |
| `usePanelizeTheme()`             | Active `colors`, `mode`, `brand`, `status`, scales, `defaults`.                       |
| `defaultTheme`                   | What components use without a provider.                                               |
| `palette`                        | Frozen gray ramp: `gray[0]`–`[6]`, `black`, `white`, `extraDark` … `extraLight`.      |

Tokens: space / border / radius `none` | `extraSmall` | `small` | `base` | `large` | `extraLarge`. Font size `extraSmall` … `extraLarge`. Weight `thin` | `base` | `bold` | `heavy`. Family `base` | `display` | `mono`. Breakpoints `sm` | `md` | `lg`.
