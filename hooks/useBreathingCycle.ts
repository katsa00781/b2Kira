import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Easing,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { boxPattern, cycleSeconds, type BreathPattern } from '@/data/phases';

type BreathingCycle = {
  /** Az aktuális ciklusidő 0 és a ciklus hossza között. Ez hajt mindent. */
  cycleTime: SharedValue<number>;
  /** 0.55 – 1.00. A doboz mérete és a karakter is ebből skálázódik. */
  scale: SharedValue<number>;
  /** A minta aktuális fázisa. Csak fázisváltáskor változik, nem képkockánként. */
  phase: number;
  /** Hány teljes ciklus futott le indulás óta. */
  cycles: number;
};

/**
 * A légzés ritmusa. Egyetlen lineáris „óra” fut a UI szálon
 * (`withTiming` + `withRepeat`), a méret és a fázis ebből származik — így a
 * JS szál akadása nem tudja elrontani a 4-4-4-4 ütemet (D-001).
 *
 * `running === false` esetén az animáció **ott áll meg, ahol van**, és a
 * folytatás onnan indul tovább.
 *
 * A `pattern` alapértelmezésben a doboz légzés — az orr/száj gyakorlat és a
 * vezetett belégzés ugyanezt a motort kapja más mintával (D-054).
 */
export function useBreathingCycle(
  running: boolean,
  pattern: BreathPattern = boxPattern
): BreathingCycle {
  const cycleTime = useSharedValue(0);
  const [phase, setPhase] = useState(0);
  const [cycles, setCycles] = useState(0);

  const { phaseSeconds, keyframeSeconds, keyframeValues } = pattern;
  const phaseCount = pattern.labels.length;
  const total = cycleSeconds(pattern);

  const scale = useDerivedValue(() =>
    interpolate(cycleTime.value, keyframeSeconds, keyframeValues)
  );

  /**
   * A ciklus akkor telt le, amikor a fázis az utolsóról visszafordul az
   * elsőre. A `withRepeat` belső callbackje ismétlésenként nem megbízható,
   * a fázisváltás viszont igen — és úgyis megvan.
   */
  const previousPhase = useRef(0);
  const applyPhase = useCallback(
    (next: number) => {
      if (next === 0 && previousPhase.current === phaseCount - 1) {
        setCycles((value) => value + 1);
      }
      previousPhase.current = next;
      setPhase(next);
    },
    [phaseCount]
  );

  // A fázisváltás az egyetlen dolog, ami React state-be kerül (ciklusonként
  // néhányszor) — a felirat, a pöttyök és a doboz színe ebből rajzolódik.
  useAnimatedReaction(
    () => phaseAt(cycleTime.value, phaseSeconds, phaseCount),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(applyPhase)(current);
      }
    }
  );

  useEffect(() => {
    if (!running) {
      cancelAnimation(cycleTime);
      return;
    }

    // Előbb a megkezdett ciklus fut végig (szünet után innen folytatódik),
    // és csak utána indul a végtelen ismétlés a ciklus elejéről.
    const remainingSeconds = Math.max(0, total - cycleTime.value);

    cycleTime.value = linearToCycleEnd(total, remainingSeconds, (completed) => {
      'worklet';
      if (!completed) {
        return;
      }
      cycleTime.value = 0;
      cycleTime.value = withRepeat(linearToCycleEnd(total, total), -1, false);
    });

    return () => cancelAnimation(cycleTime);
  }, [running, cycleTime, total]);

  return { cycleTime, scale, phase, cycles };
}

/** A ciklus végéig tartó egyenletes futás, `durationSeconds` alatt. */
function linearToCycleEnd(
  total: number,
  durationSeconds: number,
  onDone?: (completed?: boolean) => void
) {
  'worklet';
  return withTiming(
    total,
    {
      duration: durationSeconds * 1000,
      easing: Easing.linear,
    },
    onDone
  );
}

/** Ciklusidő → fázisindex. A ciklus legvégén az utolsó fázis marad. */
function phaseAt(cycleTime: number, phaseSeconds: number, phaseCount: number): number {
  'worklet';
  return Math.min(phaseCount - 1, Math.floor(cycleTime / phaseSeconds));
}
