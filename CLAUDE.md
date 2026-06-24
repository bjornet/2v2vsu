# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based 2v2 tournament matchup maker. Players are added, all possible 2-person team combinations are generated (combinatorics), and fixtures are created ensuring no team shares a player with its opponent. Scores are entered per fixture. Persistence is via `localStorage` only — no backend.

## Commands

```bash
npm install            # install shadow-cljs, react, react-dom
npm start              # shadow-cljs watch: hot-reload dev server at localhost:3000
npm run build          # shadow-cljs release: production build → public/js/main.js
```

Requires **Java 11+** and internet access to [Clojars](https://repo.clojars.org) for the first run (downloads shadow-cljs AOT JAR, Reagent, ClojureScript). Subsequent runs use the local `~/.m2` cache.

There are no tests.

## Architecture

The app is written in **ClojureScript** using **Reagent** (React wrapper) and built with **shadow-cljs**. All source lives in `src/app/`. Static assets (HTML, CSS) are in `public/`.

### Namespace responsibilities

| Namespace | File | Role |
|---|---|---|
| `app.core` | `src/app/core.cljs` | Entry point: calls `init-db!`, mounts Reagent root component. |
| `app.db` | `src/app/db.cljs` | Single Reagent atom holding all state. `init-db!` hydrates from `localStorage`; `add-watch` persists on every change. |
| `app.user` | `src/app/user.cljs` | `add-user!`, `edit-user!`, `user-section` Reagent component. |
| `app.team` | `src/app/team.cljs` | `generate-teams!` (C(n,2) via `math.combinatorics`), `shuffle-teams!`, `no-member-overlap?`, `team-section` component. |
| `app.fixture` | `src/app/fixture.cljs` | `generate-fixtures!` (`:when` guard on overlap), `update-fixture!`, scoreboard, `fixture-section` component. |
| `app.combinatorics` | `src/app/combinatorics.cljs` | Pure math: `binomial` (integer, no float drift), `pairs` wrapper around `clojure.math.combinatorics/combinations`. |
| `app.ui` | `src/app/ui.cljs` | `alert-flash!` using native JS interop. |

### Data flow

1. `app.db/init-db!` reads three `localStorage` keys (`users`, `teams`, `fixtures`) and resets the single `app-state` atom.
2. An `add-watch` on `app-state` serializes the atom to JSON and writes it back to `localStorage` on every `swap!`.
3. Reagent components (`user-section`, `team-section`, `fixture-section`) dereference `app-state` and re-render automatically when it changes.
4. All mutations go through `swap! db/app-state` — no separate DB adapter, no manual DOM calls.

### State shape

```clojure
{:users    [{:id 1 :name "Gisela"} ...]
 :teams    [{:id 1 :name "Team 1" :members [1 2] :order 1} ...]
 :fixtures [{:id 1 :home-id 1 :away-id 3 :home-goals nil :away-goals nil} ...]}
```

### Team generation

`app.team/generate-teams!` calls `clojure.math.combinatorics/combinations` on the user list to produce all C(n,2) pairs, then maps each pair to a team map. This replaces the index-arithmetic loop from the original JS version with a one-liner.

### Fixture generation

`app.fixture/generate-fixtures!` uses a `for` comprehension with `:when (no-member-overlap? home away)`. The overlap check is `(empty? (clojure.set/intersection ...))`. Because `:when` filters lazily, there are no null-propagation risks (a bug present in the original JS version).

### Scoreboard

`app.fixture/scoreboard` is a pure `reduce` over scored fixtures that computes played/goals/points per team and renders a sorted table. This was a TODO stub in the original JS version — it is now fully implemented.

## Build notes

- `shadow-cljs.edn` is the single build config. Output goes to `public/js/main.js`; the dev server serves `public/` at port 3000.
- `deps.edn` declares ClojureScript library dependencies for editor tooling (REPL, linting).
- `public/styles.css` holds all styles. CSS class names (`member-1`…`member-8`, `.fixture-label`, etc.) are referenced as strings in Hiccup and must stay in sync with the stylesheet.
- No webpack, no jQuery, no lodash, no mathjs — all eliminated by the ClojureScript port.
