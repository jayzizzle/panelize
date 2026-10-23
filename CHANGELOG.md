# Changelog

All notable changes to Panelize are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Panelize is `0.x`: a minor release may change the public API.

## [Unreleased]

## [0.1.4] - 2026-10-22

### Added

- Type primitives (`Text`, `Heading`, `Span`, `TextLink`, `Label`) take `align` (`start` / `end` / `center` / `justify`) for `text-align`. Omit = unset. Not layout `alignX` / `alignY`.
- Item boxes (`Col`, `Row`, `Cell`, `Panel`, `Div`) take `placeX` / `placeY` to place contents inside the box. Omit both = block flow. Either one makes the box a flex container (`Col` / `Panel` / `Div` / `Cell` column; `Row` row). Not `alignX` / `alignY` (those place the box in its parent).

### Changed

- The agent templates (`examples/AGENTS.md`, `examples/cursor-rule.mdc`) mention `placeX` / `placeY`. Re-run `npx panelize init-agents` after upgrading to refresh a project's section.

## [0.1.3] - 2026-10-14

Docs only. No change to the components, props, or theme.

### Changed

- Docs: two or more items in a `Panel` or `Div` now belong in `Rows` / `Cols` / `Grid`, not as loose siblings. Added the rule to `docs/composition.md`, `llms.txt`, and the agent templates. README and `docs/` examples now show whole trees (`Panels` > `Panel` > track), label-and-field pairs as `Rows`, and wrapping `Label`s for `Switch` / `Checkbox`. A `Panel` may sit in a `Cell` / `Col` / `Row` when that spot needs its own surface. Fixed a few contradictions (`gap` is not on `Div`, `Row`, or `Col`; the dashboard recipe said `stack='sm'` but used `md`; `docs/controls.md` was missing from the README table). JSDoc text and examples on `Panel` and `Div` changed.
- A new test checks every `tsx` example in the README, `llms.txt`, and `docs/` against these rules.
- Contributors: a pre-commit hook (Husky + lint-staged) lints and formats staged files and keeps `llms-full.txt` in sync with `llms.txt` and `docs/`. Pull requests into `main` need CI to pass.

## [0.1.2] - 2026-10-12

No change to the components, props, or theme.

### Added

- `npx panelize init-agents` adds a Panelize section to a project’s `AGENTS.md` so coding agents read `llms.txt` and `docs/composition.md`. It never overwrites existing content and re-running updates only its own section. `--cursor`, `--claude`, `--copilot`, and `--all` write tool-specific files; `--dry-run` previews.

### Changed

- `examples/AGENTS.md` is now a `##` section meant to be merged into an existing `AGENTS.md`.
- `examples/cursor-rule.mdc` no longer sets `alwaysApply: true`. The agent pulls it in when the task is building or editing UI.
- README and `llms.txt` lead with the agent setup step; links to maintainer files in `llms.txt` now point at GitHub.

## [0.1.1] - 2026-10-12

### Changed

- Releases are published through npm trusted publishing with staged releases. No library code changed.

## [0.1.0] - 2026-10-11

First public release.

### Added

- **Layout.** `Panels`, `Panel`, `Rows` / `Row`, `Cols` / `Col`, `Grid` / `Cell`, and `Div`. Shared vocabulary: `fill`, `flex`, `width` / `height`, `alignX` / `alignY`, `gap`, `wrap`, `stack` / `stackCols`, `scroll`, `horizontal`, `relative`, `numCols` / `numRows`, `spanX` / `spanY`, and directional space and border props.
- **Type.** `Text`, `Heading` (`level` 1–6), `Span`, `TextLink`, and `Label`, reading color from the nearest `Panel`.
- **Controls.** `Button`, `Chip`, `Input`, `NumberInput`, `Textarea`, `Select` / `Option`, `MultiSelect`, `Switch`, `Checkbox`, and `Radio`.
- **Theme.** `createPanelizeTheme`, `PanelizeProvider` (`mode` `dark` / `light`), `usePanelizeTheme`, `defaultTheme`, and the frozen `palette` gray ramp. Surfaces `muted` / `base` / `highlighted`, shared brand and status slots, and per-component `defaults`.
- **Escape hatches.** Every component takes React `style` and a `css` string appended last.
- **Agent docs.** `llms.txt`, `llms-full.txt`, `docs/` (composition, recipes, components, shell, layout, text, theme, forms, controls, accessibility), and host templates in `examples/` (`cursor-rule.mdc`, `AGENTS.md`).
- **Package.** ESM and CJS builds, one bundled `index.d.ts` / `index.d.cts`, source maps, and a `'use client'` banner. Peers: `react` 19, `react-dom` 19, `styled-components` 6.

### Known limitations

- `MultiSelect` shows an English-only count (`N selected`).
- `Select` and `MultiSelect` have no optgroups, native fallback, or typing into the field.
- `Heading` and `Label` use `text-box: trim-both`, which Firefox does not support yet. Spacing there is slightly looser.
- The library does not load font files and has no scheme toggle. The host owns both.
- Next.js App Router needs the styled-components registry (see the README).

[Unreleased]: https://github.com/jayzizzle/panelize/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/jayzizzle/panelize/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/jayzizzle/panelize/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/jayzizzle/panelize/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/jayzizzle/panelize/releases/tag/v0.1.0
