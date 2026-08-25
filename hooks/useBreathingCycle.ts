import { useEffect, useState } from 'react';
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

import {
  CYCLE_SECONDS,
  PHASE_COUNT,
  PHASE_SECONDS,
  SCALE_KEYFRAME_SECONDS,
  SCALE_KEYFRAME_VALUES,
} from '@/data/phases';

type BreathingCycle = {
  /** Az aktuális ciklusidő 0 és 16 mp között. Ez hajt mindent. */
  cycleTime: SharedValue<number>;
  /** 0.55 – 1.00. A doboz mérete és a karakter is ebből skálázódik. */
  scale: SharedValue<number>;
  /** 0–3. Csak fázisváltáskor változik, nem minden képkockán. */
  phase: number;
};

/**
 * A légzés ritmusa. Egyetlen lineáris „óra” fut a UI szálon
 * (`withTiming` + `withRepeat`), a méret és a fázis ebből származik — így a
 * JS szál akadása nem tudja elrontani a 4-4-4-4 ütemet (D-001).
 *
 * `running === false` esetén az animáció **ott áll meg, ahol van**, és a
 * folytatás onnan indul tovább.
 */
export function useBreathingCycle(running: boolean): BreathingCycle {
  const cycleTime = useSharedValue(0);
  const [phase, setPhase] = useState(0);

  const scale = useDerivedValue(() =>
    interpolate(cycleTime.value, SCALE_KEYFRAME_SECONDS, SCALE_KEYFRAME_VALUES)
  );

  // A fázisváltás az egyetlen dolog, ami React state-be kerül (16 mp-enként
  // négyszer) — a felirat, a pöttyök és a doboz színe ebből rajzolódik.
  useAnimatedReaction(
    () => phaseAt(cycleTime.value),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setPhase)(current);
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
    const remainingSeconds = Math.max(0, CYCLE_SECONDS - cycleTime.value);

    cycleTime.value = linearToCycleEnd(remainingSeconds, (completed) => {
      'worklet';
      if (!completed) {
        return;
      }
      cycleTime.value = 0;
      cycleTime.value = withRepeat(linearToCycleEnd(CYCLE_SECONDS), -1, false);
    });

    return () => cancelAnimation(cycleTime);
  }, [running, cycleTime]);

  return { cycleTime, scale, phase };
}

/** A ciklus végéig tartó egyenletes futás, `durationSeconds` alatt. */
function linearToCycleEnd(durationSeconds: number, onDone?: (completed?: boolean) => void) {
  'worklet';
  return withTiming(
    CYCLE_SECONDS,
    {
      duration: durationSeconds * 1000,
      easing: Easing.linear,
    },
    onDone
  );
}

/** Ciklusidő → fázisindex. A ciklus legvégén (pontosan 16 mp) a 3. fázis marad. */
function phaseAt(cycleTime: number): number {
  'worklet';
  return Math.min(PHASE_COUNT - 1, Math.floor(cycleTime / PHASE_SECONDS));
}
