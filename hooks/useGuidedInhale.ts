import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  runOnJS,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { INHALE_SECONDS, inhalePattern } from '@/data/oneBreath';

const [MIN_SCALE, MAX_SCALE] = inhalePattern.keyframeValues;

/**
 * Egyetlen vezetett belégzés: a doboz `INHALE_SECONDS` alatt egyenletesen nő
 * teljes méretűre, majd **ott marad**, amíg a gyerek egy levegővel elmondja a
 * sort. A körbeforgó `useBreathingCycle`-lel szemben ez egyszer fut le.
 *
 * `active` visszaállásakor a következő sorhoz újraindul az elejéről.
 */
export function useGuidedInhale(active: boolean, onDone: () => void): SharedValue<number> {
  const scale = useSharedValue(MIN_SCALE);

  useEffect(() => {
    if (!active) {
      return;
    }

    scale.value = MIN_SCALE;
    scale.value = withTiming(
      MAX_SCALE,
      { duration: INHALE_SECONDS * 1000, easing: Easing.linear },
      (completed) => {
        'worklet';
        if (completed) {
          runOnJS(onDone)();
        }
      }
    );

    return () => cancelAnimation(scale);
  }, [active, scale, onDone]);

  return scale;
}
