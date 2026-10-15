# Forms, buttons, chips (bonus)

Core is layout + text. These controls exist so a host can ship a complete kit. Still compose them **inside** a `Panel` / `Row` / `Col` / `Cell` / `Div`. One control sits directly in its wrapper; several go in a `Rows` / `Cols`. The wrapper places them.

Per-control behavior notes: [controls](controls.md). Full prop list: exported types in `node_modules/panelize/dist/index.d.ts` (JSDoc on every prop). Human detail: [README.md](../README.md). Copyable field layout: [recipes](recipes.md#form-fields). Keyboard and labelling rules: [accessibility](accessibility.md).

- `Button` — `label` preferred; `children` win. `color` is the chroma slot. `outline` stays hollow. `fill` stretches the button, not a panel.
- `Chip` — badge, not a button. No hover.
- `Input` / `NumberInput` / `Textarea` — field chrome. Instance `color` is **focus** chroma, not glyph ink (`ink`). Prefer `Label` + `htmlFor`.
- `Select` / `MultiSelect` — custom listboxes, not native `<select>`. Host `value` / `onChange`. `MultiSelect` is a count in the field (`N selected`), not chips.
- `Switch` / `Checkbox` / `Radio` — wrap with `Label` (same `size`). Empty checkbox/radio stroke follows the label (`currentColor`).
- `Label` — type-like ink; not a layout shell.

Do not add `alignX` / `flex` / padding-as-layout on these to position them. Use a `Col` / `Row` / `Div`.

## Value ownership

The host owns every value. Nothing here keeps state you did not ask for.

| Control               | Controlled                                                                                      | Uncontrolled     |
| --------------------- | ----------------------------------------------------------------------------------------------- | ---------------- |
| `Input` etc.          | `value` + `onChange(event)`                                                                     | `defaultValue`   |
| `NumberInput`         | `value` + `onChange(event)`; read `event.currentTarget.valueAsNumber` (the `value` is a string) | `defaultValue`   |
| `Select`              | `value: string` + `onChange(value: string)`                                                     | not offered      |
| `MultiSelect`         | `value: string[]` + `onChange(value: string[])`                                                 | not offered      |
| `Switch` / `Checkbox` | `checked` + `onChange(event)`                                                                   | `defaultChecked` |
| `Radio`               | `name` + `value` + `checked` + `onChange(event)`                                                | `defaultChecked` |

`Select` / `MultiSelect` call `onChange` with plain values, not events. Cleared is `''` (`Select`) or `[]` (`MultiSelect`). A `value` that has no matching option is still shown.

## `Select` and `MultiSelect`

```tsx
<Rows gap='extraSmall'>
  <Row>
    <Label htmlFor='country' label='Country' />
  </Row>
  <Row>
    <Select id='country' value={country} onChange={setCountry} placeholder='Choose' clearable>
      <Option value='us'>United States</Option>
      <Option value='mx' disabled>
        Mexico
      </Option>
    </Select>
  </Row>
</Rows>
```

- Options: `<Option value>` children and/or `options={[{ value, label, disabled? }]}`. Children win on a duplicate `value`.
- The menu renders in a portal on `document.body` (`position: fixed`). A scrolling `Panels` does not clip it. It sits at `defaults.select.listZIndex` (default 1100); raise that in the theme if a host overlay covers it.
- `clearable` shows ×. `required` blocks an empty value and disables clearing. `selectedAtTop` lists the selected option(s) first. `Select` also has `emptyOption`. `readOnly` opens to inspect without changing.
- `name` writes hidden input(s) so a native `<form>` submits the value. `MultiSelect` writes one input per value.
- `open` / `onOpenChange` control the menu. Omit for internal state.
- `MultiSelect` stays open while toggling and shows `N selected`. The caption is English-only.
- No native fallback, optgroups, or typing into the field.

## `Switch`, `Checkbox`, `Radio`

Wrap the control in a `Label` and give both the same `size`. A sibling caption works only with `htmlFor`, and a `disabled` control then cannot dim its label.

```tsx
<Label size='small'>
  <Checkbox size='small' checked={agree} onChange={(e) => setAgree(e.currentTarget.checked)} /> I
  agree
</Label>
```

`Checkbox` supports `indeterminate` (the native property; it does not set `checked`). A `Radio` group shares `name`; the host decides which `value` is checked.

## Validation

`Input` / `NumberInput` / `Textarea` / `Select` paint `status.danger` for `:user-invalid` (after the user edits) and for `aria-invalid='true'`. Set `aria-invalid` yourself for submit-time errors. Show the message in a `Text color='danger'` and tie it to the field with `aria-describedby`.
