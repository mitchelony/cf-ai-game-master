# cf_ai_game_master

`cf_ai_game_master` is a Cloudflare-native AI game prototype: a deterministic text adventure engine wrapped in a Cloudflare Agent, with a React debug client and Workers AI narration layered on top.

The project is intentionally split into two parts:
- a deterministic game engine that owns truth
- an AI narration layer that rewrites outcomes into richer prose without changing state

That separation is the core design choice of the app.

## What It Does

The app lets a player:
- start or resume a named game session
- inspect the current location
- talk to visible NPCs
- move between connected locations
- rest or request status/recap/help

Under the hood:
- turns are resolved deterministically by the engine
- session state is stored in a Cloudflare Agent backed by Durable Objects
- Workers AI rewrites successful turn summaries into short narrative text
- the React frontend talks to the Agent through `useAgent()`

## Why It Is Built This Way

This project is designed to satisfy the assignment requirements while keeping the architecture coherent:

- `LLM`: provided by Workers AI via `env.AI.run(...)`
- `workflow / coordination`: provided by the Agent and the turn pipeline
- `user input`: provided by the React frontend
- `memory / state`: provided by Agent state on Durable Objects

The engine remains the source of truth for:
- action validation
- turn progression
- state changes
- event logging

The model is only used for narration. If AI fails, the app falls back to deterministic text instead of corrupting state or crashing the turn flow.

## Architecture

### 1. Deterministic engine

The engine lives under [src/game](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/game) and handles:
- world templates and schemas
- session bootstrap
- action validation
- turn orchestration
- state updates
- event log generation

Important entry points:
- [buildSession.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/game/engine/bootstrap/buildSession.ts)
- [turnLoop.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/game/engine/turn/turnLoop.ts)
- [resolveAction.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/game/engine/turn/resolveAction.ts)

### 2. Cloudflare Agent

The Agent lives in [GameMasterAgent.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/agent/GameMasterAgent.ts).

Responsibilities:
- own a single `SessionState`
- start or reset a session
- expose callable methods to the client
- run turns through the engine
- persist session state between calls
- narrate successful outcomes with Workers AI

The Worker entry point is [server.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/server.ts), which exports the Agent and routes Agent traffic through `routeAgentRequest(...)`.

### 3. React client

The frontend uses:
- [useGameSession.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/app/hooks/useGameSession.ts)
- [GameScreen.tsx](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/app/screens/GameScreen.tsx)

The hook connects to the Agent with `useAgent()` and calls:
- `getState()`
- `startSession()`
- `runTurn()`
- `resetSession()`

### 4. Workers AI narration

Narration is built from:
- [narrateTurn.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/agent/prompts/narrateTurn.ts)
- [src/agent/tools/narrateTurn.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/src/agent/tools/narrateTurn.ts)

Flow:
1. engine resolves a turn deterministically
2. Agent attempts to narrate the result with Workers AI
3. if narration fails, deterministic text is returned instead

## Local Development

### Requirements

- Node `20+`
- npm
- Cloudflare account access for Workers AI calls in local development

### Install

```bash
npm install
```

### Generate Worker types

```bash
npx wrangler types
```

### Run locally

You need two servers:

Terminal 1:
```bash
npx wrangler dev
```

Terminal 2:
```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

### Important local-dev note

The app uses a split local setup:
- Vite frontend on `localhost:5173`
- Wrangler Worker/Agent runtime on `127.0.0.1:8787`

[vite.config.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/vite.config.ts) proxies `/agents/*` HTTP and WebSocket traffic from Vite to Wrangler. Without that proxy, the React client cannot connect to the Agent in development.

## Build

```bash
npx tsc -b
npm run build
```

## Cloudflare Configuration

Cloudflare config lives in [wrangler.jsonc](/Users/MAC/Documents/GitHub/cf-ai-game-master/wrangler.jsonc).

It includes:
- `nodejs_compat`
- `ai.binding = "AI"`
- Durable Object binding for `GameMasterAgent`
- SQLite Durable Object migration

Generated Worker types are written to [worker-configuration.d.ts](/Users/MAC/Documents/GitHub/cf-ai-game-master/worker-configuration.d.ts).

## Current Features

- deterministic session bootstrap
- deterministic turn handling
- event log tracking
- readable debug UI
- Agent-backed session persistence
- Workers AI narration with fallback
- stable named Agent instance for local testing

## Known Limitations

- the UI is still a debug harness, not a final game interface
- inventory and location presentation are still basic
- narration quality is intentionally constrained and can still be somewhat generic
- event log entries remain deterministic engine text; AI narration is shown in the response panel
- local Workers AI calls use real Cloudflare account resources
