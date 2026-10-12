# Accessibility

What Panelize does for you, and what the host must still do.

## Names

Every control needs an accessible name. Use a `Label` with `htmlFor` matching the control `id`, or wrap the control in a `Label`. With no visible text, use `aria-label`. A `placeholder` is not a name.

- `Input` / `NumberInput` / `Textarea` / `Select` / `MultiSelect`: `Label htmlFor` + `id`, else `aria-label`.
- `Switch` / `Checkbox` / `Radio`: wrap in a `Label` (same `size`). These have no `label` prop.
- `Button`: `label`, or `children` with text. Icon-only: `aria-label`.
- `Chip` is not interactive. Do not use it as a button.

## Structure

- `Heading` needs `level` and renders `h1`–`h6`. Pick the level for the document outline, not for size (`size` is separate).
- `Panels` / `Panel` / `Rows` / `Cols` / `Grid` are plain `div`s. They add no landmarks or roles. Wrap them in `header` / `nav` / `main` / `section` in the host.
- Copy goes in `Text` / `Heading` / `Span` / `TextLink` / `Label` (real `p` / `h*` / `span` / `a` / `label`).

## Keyboard

| Control               | Keys                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `Select`              | Arrows move, Enter / Space pick, Home / End, type-ahead, Escape closes, Backspace / Delete clears when `clearable`, Tab leaves and closes |
| `MultiSelect`         | Same, but Enter / Space toggle. Type-ahead on a closed field opens and highlights                                                         |
| `Switch` / `Checkbox` | Space toggles                                                                                                                             |
| `Radio`               | Arrow keys move within a `name` group                                                                                                     |
| `Button` / `TextLink` | Native                                                                                                                                    |

Disabled options are skipped. Escape is handled on the trigger, not on `window`.

## Roles and state

- `Select` / `MultiSelect`: trigger is `role='combobox'` with `aria-haspopup='listbox'`, `aria-expanded`, and `aria-autocomplete='none'`. The menu is `role='listbox'` with `role='option'` rows. The listbox is labelled by the control only when you set `id`. `readOnly` sets `aria-readonly`.
- `Switch` is `input[type=checkbox][role=switch]`.
- Invalid fields: set `aria-invalid='true'`. The library paints it and `:user-invalid`. Link the error text with `aria-describedby`.

## Focus and contrast

- Focus is `:focus-visible` only: fields ring and glow in their `color`, `TextLink` uses a `currentColor` outline, switches / checkboxes / radios glow in the on-state chroma.
- `disabled` controls dim and are not focusable. `readOnly` on `Select` / `MultiSelect` stays full contrast.
- Contrast is the host’s job. The default theme is dark first. `palette` adjacent steps are **not** a safe text-on-fill pair; skip a step. Default `warning` (`#ffd60a`) is weak as small text on light panels. Check any custom `createPanelizeTheme` colors.
- `PanelizeProvider` sets CSS `color-scheme` from `mode` so native scrollbars and form chrome match. Respecting `prefers-color-scheme` or `prefers-reduced-motion` is host-side.
