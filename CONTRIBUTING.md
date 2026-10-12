# Contributing

This repo is the **Panelize library**. There is no app in-tree. To look at UI, create your own sandbox that depends on this package’s published shape (`dist/`).

## Humans

1. Use Node 22 or newer (`.nvmrc`; the test tooling needs it), then `npm install` here. The published package has no Node requirement and loads on Node 20 and up.
2. `npm run dev` (`vite build --watch`) so `dist/` stays current, or `npm run build` once. `npm run dev` rebuilds JavaScript only; after you change a prop type, run `npm run build:types`.
3. Make a sandbox host (Vite + React is enough) with `"panelize": "file:../panelize"` (path as needed). Import from `'panelize'`. Wrap with `PanelizeProvider`. Do not alias this repo’s `src/`, and dedupe `react`, `react-dom`, and `styled-components` to the host’s copies.
4. Before a PR run `npm run check`. It runs lint, Prettier, tests, build, a load check of the ESM and CJS bundles, and a check of the published type resolution.

| Script                | What it does                                                                       |
| --------------------- | ---------------------------------------------------------------------------------- |
| `npm run check`       | Everything CI runs                                                                 |
| `npm test`            | Vitest (jsdom) in `tests/`                                                         |
| `npm run test:dist`   | Loads `dist/` as ESM and CJS (run after `npm run build`)                           |
| `npm run build:types` | Rebuilds only `dist/index.d.ts` / `.d.cts` (the watch build does not update types) |
| `npm run llms-full`   | Rebuilds `llms-full.txt` from `llms.txt` and `docs/`                               |
| `npm run format`      | Prettier                                                                           |

## Agents

If an agent is writing the change, it must follow [`AGENTS.md`](AGENTS.md) (how to maintain this library). Composition rules for **using** Panelize live in [`llms.txt`](llms.txt) and [`docs/composition.md`](docs/composition.md) — do not fork those rules into this file.

GitHub Copilot in this repo: [`.github/copilot-instructions.md`](.github/copilot-instructions.md). Cursor: [`.cursor/rules/maintain-panelize.mdc`](.cursor/rules/maintain-panelize.mdc).

## Public API

Exports: `src/index.ts`. Theme: `src/theme/index.ts`. Changing a public component, prop, token, or theme key means updating the docs list in `AGENTS.md` (README, example theme, JSDoc, `llms.txt` / `docs/` + `npm run llms-full` when composition or the agent surface changes).

## Conduct and security

Be kind: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Report vulnerabilities privately: [`SECURITY.md`](SECURITY.md).

## Pull requests

- User-visible changes get a line under `[Unreleased]` in [`CHANGELOG.md`](CHANGELOG.md).
- Keep a change to one concern. Add or update a test in `tests/` when behavior changes.
- Match the style in `AGENTS.md` (Prettier, `~/src/...` imports, `simple-import-sort`).
