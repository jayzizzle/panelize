# Changelog

All notable changes to Panelize are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Panelize is `0.x`: a minor release may change the public API.

## [Unreleased]

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

[Unreleased]: https://github.com/jayzizzle/panelize/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/jayzizzle/panelize/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/jayzizzle/panelize/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/jayzizzle/panelize/releases/tag/v0.1.0
