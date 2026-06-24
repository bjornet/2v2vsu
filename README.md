# 2v2vsu

Browser-based matchup maker for small group 2v2 tournaments (FIFA, padel, ping-pong doubles, etc.). Add players, get all team pairings generated automatically, play every match, track scores, see standings — no account or server needed.

## Prerequisites

- **Node.js** (for npm and shadow-cljs)
- **Java 11+** (required by the ClojureScript compiler at build time only)

## Development

```bash
npm install   # first run: also downloads Clojars deps (~50 MB) into ~/.m2
npm start     # hot-reload dev server at http://localhost:3000
```

First `npm install` fetches shadow-cljs, Reagent, and ClojureScript from Clojars. Subsequent starts use the local `~/.m2` cache and are much faster.

## Production build

```bash
npm run build   # compiles to public/js/main.js (advanced optimisation)
```

Serve the `public/` directory with any static file host.

## Deploy with Docker (no Java required on host)

```bash
docker build -t 2v2vsu .
docker run -p 8080:80 2v2vsu
# → http://localhost:8080
```

## Tech

- **ClojureScript** + **Reagent** (React) — functional UI, no manual DOM
- **shadow-cljs** — build tool, hot reload
- **localStorage** — persistence, no backend
