import { useEffect, useRef, useState } from 'react';

/** Ilyen sűrűn frissül a hátralévő idő és a session sáv. */
const TICK_MS = 250;

type SessionTimer = {
  /** Eltelt idő másodpercben, a `totalSeconds`-nél megáll. */
  elapsed: number;
  /** Hátralévő idő másodpercben. */
  remaining: number;
  /** 0 és 1 közötti kitöltöttség a session sávhoz. */
  ratio: number;
  /** `true`, amint letelt a gyakorlat. */
  finished: boolean;
};

/**
 * A gyakorlat visszaszámlálója. Az eltelt időt **időbélyegből** számolja, nem
 * a tickeket adja össze, így egy akadó tick nem csúsztatja el a végét.
 *
 * Ez nem az animációt hajtja (azt a `useBreathingCycle` teszi a UI szálon),
 * csak a feliratot és a sávot.
 */
export function useSessionTimer(totalSeconds: number, running: boolean): SessionTimer {
  const [elapsed, setElapsed] = useState(0);
  /** A már „bezsákolt” idő — szünet közben is ennyinél tart a gyakorlat. */
  const accumulated = useRef(0);

  useEffect(() => {
    if (!running) {
      return;
    }

    const startedAt = Date.now();
    const base = accumulated.current;

    const advance = () => {
      const next = Math.min(totalSeconds, base + (Date.now() - startedAt) / 1000);
      accumulated.current = next;
      setElapsed(next);
    };

    const tick = setInterval(advance, TICK_MS);

    return () => {
      clearInterval(tick);
      advance();
    };
  }, [running, totalSeconds]);

  return {
    elapsed,
    remaining: Math.max(0, totalSeconds - elapsed),
    ratio: totalSeconds > 0 ? Math.min(1, elapsed / totalSeconds) : 0,
    finished: elapsed >= totalSeconds,
  };
}

/** Másodperc → `m:ss` (a design felirata: „2:30 maradt”). */
export function formatDuration(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = `${whole % 60}`.padStart(2, '0');
  return `${minutes}:${rest}`;
}
