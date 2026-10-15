## Panelize (UI)

This app builds views with [Panelize](https://github.com/jayzizzle/panelize).

- Before writing JSX, read `node_modules/panelize/llms.txt` and `node_modules/panelize/docs/composition.md`. Copyable trees: `node_modules/panelize/docs/recipes.md`.
- Import from `'panelize'`. Wrap the app once with `PanelizeProvider`.
- Host CSS owns `html` / `body` / `#root` height. The library does not set them.
- Follow the pairing rules: `Panels` > `Panel`; `Rows` > `Row`; `Cols` > `Col`; `Grid` > `Cell`. Two or more per track. A `Panel` may also sit in a `Cell` / `Col` / `Row` when that spot needs its own surface.
- Two or more items in a `Panel` or `Div` go in `Rows` (stacked), `Cols` (side by side), or `Grid`, not as loose siblings. One item goes straight in.
- The wrapper places things. Controls and type do not take `alignX` / `flex` / padding to position themselves.
