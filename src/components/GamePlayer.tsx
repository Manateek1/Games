import { useEffect, useMemo, useRef, useState } from "react";
import { AudioManager } from "../engine/audio";
import { InputManager } from "../engine/input";
import { TouchControls } from "./TouchControls";
import type { AppSettings, Difficulty, GameDefinition, GameResult } from "../types/arcade";

interface GamePlayerProps {
  game: GameDefinition;
  difficulty: Difficulty;
  mode: string;
  seed: number;
  settings: AppSettings;
  bestScore: number;
  tutorialOpenByDefault: boolean;
  onSettingsChange: (next: AppSettings) => void;
  onTutorialDismiss: () => void;
  onQuit: () => void;
  onComplete: (result: GameResult) => void;
}

export const GamePlayer = ({
  game,
  difficulty,
  mode,
  seed,
  settings,
  bestScore,
  tutorialOpenByDefault,
  onSettingsChange,
  onTutorialDismiss,
  onQuit,
  onComplete,
}: GamePlayerProps): React.JSX.Element => {
  const inputRef = useRef(new InputManager());
  const audioRef = useRef(new AudioManager());
  const submittedRef = useRef(false);

  const [runId, setRunId] = useState(0);
  const [score, setScore] = useState(0);
  const [fps, setFps] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(tutorialOpenByDefault);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);

  useEffect(() => {
    setTutorialOpen(tutorialOpenByDefault);
  }, [tutorialOpenByDefault, game.id]);

  useEffect(() => {
    const input = inputRef.current;
    input.attach();
    const interval = window.setInterval(() => {
      if (input.consumePress("pause")) {
        setPaused((value) => !value);
      }
    }, 32);

    return () => {
      window.clearInterval(interval);
      input.detach();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.setEnabled(settings.sound);
    audio.setMusicEnabled(settings.music);
  }, [settings.sound, settings.music]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!settings.music) {
      audio.stopMusic();
      return;
    }

    if (!paused && !tutorialOpen && !finalResult) {
      audio.startMusic(seed);
    } else {
      audio.stopMusic();
    }
  }, [settings.music, paused, tutorialOpen, finalResult, seed]);

  useEffect(() => {
    return () => {
      audioRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (!finalResult || submittedRef.current) {
      return;
    }
    submittedRef.current = true;
    onComplete(finalResult);
  }, [finalResult, onComplete]);

  const effectivePause = paused || tutorialOpen || Boolean(finalResult);

  const restart = (): void => {
    submittedRef.current = false;
    setRunId((value) => value + 1);
    setScore(0);
    setFps(0);
    setPaused(false);
    setFinalResult(null);
  };

  const dismissTutorial = async (): Promise<void> => {
    onTutorialDismiss();
    setTutorialOpen(false);
    await audioRef.current.unlock();
    audioRef.current.ui();
  };

  const componentKey = useMemo(() => `${game.id}-${difficulty}-${mode}-${seed}-${runId}`, [
    game.id,
    difficulty,
    mode,
    seed,
    runId,
  ]);
  const GameComponent = game.component;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-300/20 bg-[#070c22]/85 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl text-white">{game.title}</h2>
          <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
            {difficulty}
          </span>
          {game.modes && (
            <span className="rounded-full border border-orange-300/35 px-3 py-1 text-xs uppercase tracking-[0.2em] text-orange-100">
              {mode}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-cyan-100">
          <span>Score: <strong className="text-white">{score}</strong></span>
          <span>Best: <strong className="text-white">{bestScore}</strong></span>
          {settings.showFps && <span>FPS: <strong className="text-white">{fps.toFixed(0)}</strong></span>}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="arcade-btn-secondary px-4 py-2" onClick={() => setPaused((value) => !value)}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button type="button" className="arcade-btn-secondary px-4 py-2" onClick={restart}>
            Restart
          </button>
          <button type="button" className="arcade-btn-secondary px-4 py-2" onClick={onQuit}>
            Quit
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-[#030513] p-3">
        <GameComponent
          key={componentKey}
          gameId={game.id}
          difficulty={difficulty}
          mode={mode}
          seed={seed}
          settings={settings}
          paused={effectivePause}
          input={inputRef.current}
          audio={audioRef.current}
          onScore={setScore}
          onFps={setFps}
          onPauseToggle={() => setPaused((value) => !value)}
          onGameOver={(result) => {
            setFinalResult(result);
            setPaused(true);
            audioRef.current.hit();
          }}
        />

        {paused && !finalResult && !tutorialOpen && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-[#020713]/78">
            <div className="w-[min(480px,90%)] space-y-4 rounded-2xl border border-cyan-300/30 bg-[#06102a] p-5 text-cyan-100">
              <h3 className="font-display text-3xl text-white">Paused</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="arcade-btn-secondary"
                  onClick={() => onSettingsChange({ ...settings, showFps: !settings.showFps })}
                >
                  FPS {settings.showFps ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  className="arcade-btn-secondary"
                  onClick={() => onSettingsChange({ ...settings, sound: !settings.sound })}
                >
                  Sound {settings.sound ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  className="arcade-btn-secondary"
                  onClick={() => onSettingsChange({ ...settings, music: !settings.music })}
                >
                  Music {settings.music ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  className="arcade-btn-secondary"
                  onClick={() => onSettingsChange({ ...settings, reducedMotion: !settings.reducedMotion })}
                >
                  Motion {settings.reducedMotion ? "Reduced" : "Full"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="arcade-btn-primary" onClick={() => setPaused(false)}>
                  Resume
                </button>
                <button type="button" className="arcade-btn-secondary" onClick={restart}>
                  Restart
                </button>
                <button type="button" className="arcade-btn-secondary" onClick={onQuit}>
                  Quit to Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {finalResult && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[#010714]/84">
            <div className="w-[min(460px,90%)] space-y-3 rounded-2xl border border-cyan-300/35 bg-[#06122e] p-6 text-center">
              <p className="arcade-kicker">Run Complete</p>
              <h3 className="font-display text-4xl text-white">{finalResult.won ? "Victory" : "Game Over"}</h3>
              <p className="text-cyan-100">Score: <strong className="text-white">{finalResult.score}</strong></p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button type="button" className="arcade-btn-primary" onClick={restart}>
                  Play Again
                </button>
                <button type="button" className="arcade-btn-secondary" onClick={onQuit}>
                  Back to Library
                </button>
              </div>
            </div>
          </div>
        )}

        {tutorialOpen && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[#01040f]/85">
            <div className="w-[min(560px,92%)] space-y-3 rounded-2xl border border-cyan-300/35 bg-[#061125] p-6">
              <p className="arcade-kicker">First-Time Tutorial</p>
              <h3 className="font-display text-3xl text-white">{game.title}</h3>
              <ul className="space-y-2 text-cyan-100/90">
                {game.tutorial.map((line) => (
                  <li key={line} className="rounded-lg border border-cyan-300/20 bg-[#0c1534] px-3 py-2">
                    {line}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <button type="button" className="arcade-btn-primary" onClick={() => void dismissTutorial()}>
                  Start Run
                </button>
                <button type="button" className="arcade-btn-secondary" onClick={onQuit}>
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {game.usesCanvas && (
        <TouchControls
          input={inputRef.current}
          onPause={() => setPaused((value) => !value)}
          mode={game.id === "pong-neon" && mode === "duel" ? "pong-duel" : "default"}
        />
      )}
    </section>
  );
};
