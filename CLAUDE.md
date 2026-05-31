# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based 2v2 tournament matchup maker. Players are added, all possible 2-person team combinations are generated (combinatorics), and fixtures are created ensuring no team shares a player with its opponent. Scores are entered per fixture. Persistence is via `localStorage` only — no backend.

## Commands

```bash
npm start        # webpack-dev-server with HMR, opens browser automatically
npm run build    # production bundle → dist/app.bundle.js
npm run watch    # webpack watch mode (no dev server)
```

There are no tests (`npm test` exits with error by design).

> `npm run server` references a `server.js` that does not exist — ignore it.

## Architecture

All source lives in `src/`. The build entry is `src/index.js`; output is `dist/app.bundle.js`.

### Module responsibilities

| File | Role |
|------|------|
| `src/modules/dbadapter.js` | `localStorage` CRUD wrapper — the single source of truth. Tables: `user`, `team`, `fixture`. |
| `src/modules/user.js` | Player management. Requires ≥ 4 users before teams can be generated. |
| `src/modules/team.js` | Team generation using C(N,2) combinatorics. Each team has exactly 2 `members` (user IDs). |
| `src/modules/fixture.js` | Fixture generation (no shared players between home/away) and score recording. |
| `src/modules/render.js` | Low-level DOM helpers: `element()`, `updateElement()`, `deleteElements()`. |
| `src/modules/utils.js` | `binomial(n, k)` and a `alert()` background-flash feedback utility. |
| `src/index.js` | App bootstrap: wires jQuery event delegation, calls `render()` on each module. |

### Data flow

1. `DbAdapter.initDb()` seeds or rehydrates `localStorage` on load.
2. Each module reads/writes exclusively through `DbAdapter` (`getData`, `setData`, `updateData`).
3. UI is rendered imperatively via `render.js` helpers — **no React/Redux** despite what the README says; the actual implementation uses jQuery + direct DOM manipulation.
4. Events are delegated in `index.js` using jQuery class selectors (e.g. `.user-btn`, `.fixture-btn`).

### Team generation algorithm

When "GENERATE TEAMS and FIXTURES" is clicked, `Team.generateTeams(User)` computes all C(N,2) pairs. The intended "fair sort" order (documented as "RÄTTVIS SORTERING" in `TODO.md`) interleaves pairs so each player faces diverse opponents across consecutive fixtures — this is not yet implemented (`Team.shuffle()` is a stub).

### Fixture generation algorithm

`Fixture.generateFixtures(Team)` iterates every team as "home" and finds valid "away" teams by checking that no `members` overlap. The pairing pattern is documented with a loop diagram in `TODO.md`.

## Known gaps / stubs

- `Team.shuffle()` — not implemented; fair-sort order is stubbed.
- `Fixture.updateScoreboard()` — score aggregation per user/team is incomplete (TODOs inside).
- `lodash` is imported in `user.js` (`_.clone`) but is absent from `package.json` — add it if extending that module.
- `entityId` type inconsistency in `dbadapter.js`: sometimes passed as string, sometimes int; coercion happens implicitly.
- `utils.binomial()` has float-precision drift for larger inputs (e.g. C(25,4) ≈ 12649.9999…) — round the result if used for counts.

## Webpack / build notes

- Webpack 3.x — APIs differ from Webpack 5. Don't apply v5 patterns without upgrading.
- HMR is enabled in dev server; CSS is inlined via `style-loader`.
- `CleanWebpackPlugin` clears `dist/` on each build.
