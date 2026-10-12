# Copilot — Panelize library

This repository is the **Panelize library**, not an application.

- Follow [`AGENTS.md`](../AGENTS.md). Public API is `src/index.ts`. Theme API is `src/theme/index.ts`. Do not re-export `src/theme/internal.ts`.
- Do not take over the host styled-components `ThemeProvider`. Do not set `html` / `body` CSS.
- There is no app in this repo. A visual sandbox is the contributor’s own host that imports `'panelize'` from **`dist/`** (`file:…/panelize`). Do not Vite-alias library `src/` (duplicate React breaks hooks).
- Component behavior contracts: `maintainers/components.md`.
- Public change: update `README.md`, `examples/panelize.theme.md`, and JSDoc on exported prop types. Composition or agent surface: `llms.txt`, `docs/`, then `npm run llms-full`.
- Agents **building apps with** Panelize: [`llms.txt`](../llms.txt) and [`docs/composition.md`](../docs/composition.md). Do not invent MUI `Stack` / `sx` patterns.
- Prettier: no semicolons, single quotes (including JSX), trailing commas, print width 100. Imports: `~/src/...`, `simple-import-sort` order.
