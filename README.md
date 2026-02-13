# Arcade Hub

Arcade Hub is a React + Vite + TypeScript arcade product with a neon UI, shared game engine utilities, and 9 playable mini-games.

## Included Games

- Neon Dodger
- Asteroids Pulse
- Brick Breaker Blitz
- Void Survival
- Rhythm Tap
- Precision Runner
- Fusion 2048
- Memory Match
- Pong Neon (Single Player + Two Player Duel)

## Core Architecture

- `src/games/registry.ts`: central game metadata + component registry.
- `src/engine/`: shared engine utilities.
  - `input.ts`: low-latency keyboard + virtual touch input manager.
  - `audio.ts`: WebAudio SFX + lightweight synth music.
  - `particles.ts`: quality-scaled particle bursts.
  - `fps.ts`: rolling-average FPS meter.
  - `math.ts`: deterministic random + collision helpers.
  - `storage.ts`: localStorage settings, high scores, progress.
  - `daily.ts`: fixed-seed daily challenge picker.
  - `achievements.ts`: local achievement unlock rules.
- `src/components/GamePlayer.tsx`: shared in-game shell (tutorial, pause, restart, quit, FPS, mobile controls).

## How to Add a New Game

1. Create a game component in `src/games/` that accepts `GameComponentProps`.
2. Add metadata + thumbnail + controls/tutorial copy in `src/games/registry.ts`.
3. Use `onScore`, `onFps`, and `onGameOver` callbacks from `GameComponentProps`.
4. Use shared engine utilities (`InputManager`, `AudioManager`, `ParticleSystem`) instead of duplicating game loop services.
5. Verify it supports at least 2 difficulties and works on mobile (touch controls or tap/swipe interactions).

## Local Development

```bash
npm install
npm run dev
```

## Unit Tests

```bash
npm run test
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

No server runtime is required.
