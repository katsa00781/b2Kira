import { useEffect, useRef } from 'react';

import { phaseLabels } from '@/data/phases';
import { impactLight, impactMedium, notifySuccess } from '@/lib/haptics';
import { playPhaseSound, prepareSounds, releaseSounds } from '@/lib/sounds';
import { speak, stopSpeaking } from '@/lib/speech';
import { useSettingsStore } from '@/store/useSettingsStore';

/**
 * A gyakorlat visszajelzései: hang, beszéd és rezgés a **fázisváltás**
 * pillanatában — nem a folyamatos animációhoz kötve (CLAUDE.md).
 *
 * A kapcsolókat a fázisváltáskor olvassuk ki a store-ból (`getState`), nem
 * feliratkozással: így a beállítás azonnal érvényes, de a kapcsolgatás nem
 * indít el újra egy hangot vagy mondatot (D-032).
 *
 * Szünetkor (`active === false`) a félbehagyott mondat elhallgat, folytatáskor
 * viszont nem ismételjük meg — a következő fázisváltásnál jön a következő.
 */
type FeedbackOptions = {
  /** Amit a fázisváltáskor kimond. Alapértelmezés: a doboz légzés felirata. */
  label?: string;
  /**
   * Melyik fázis hangja szóljon (0 be · 1 tart · 2 ki · 3 tart). Más
   * gyakorlatnál a minta `colorPhase` leképezése adja meg.
   */
  soundPhase?: number;
};

export function useSessionFeedback(
  phase: number,
  active: boolean,
  options: FeedbackOptions = {}
): void {
  const lastPhase = useRef<number | null>(null);

  const label = options.label ?? phaseLabels[phase];
  const soundPhase = options.soundPhase ?? phase;

  useEffect(() => {
    if (!active) {
      stopSpeaking();
      return;
    }

    if (lastPhase.current === phase) {
      return;
    }
    lastPhase.current = phase;

    const { soundOn, voiceOn, hapticsOn } = useSettingsStore.getState();

    if (hapticsOn) {
      // A belégzés indítja a ciklust, ezért az erősebb.
      if (soundPhase === 0) {
        impactMedium();
      } else {
        impactLight();
      }
    }

    if (soundOn) {
      playPhaseSound(soundPhase);
    }

    if (voiceOn) {
      speak(label);
    }
    // A felirat és a hang a fázisból következik — csak fázisváltáskor futunk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, active]);

  usePreparedFeedback();
}

/**
 * Indulás: az audio session beáll, a három lejátszó pedig előre betöltődik.
 * Enélkül a fázisváltás pillanatában létrehozott lejátszó lemaradhat a saját
 * négymásodperces ablakáról, mert a WAV még a dev szerverről tölt (D-048).
 * A képernyő elhagyásakor ne beszéljen tovább, és a lejátszók is dőljenek le.
 *
 * Minden gyakorlat képernyő ezt használja, a fázisváltásos és a
 * „Kész” gombos is.
 */
export function usePreparedFeedback(): void {
  useEffect(() => {
    void prepareSounds();

    return () => {
      stopSpeaking();
      releaseSounds();
    };
  }, []);
}

/**
 * Vezetett belégzés indul: ugyanaz a visszajelzés, mint a ciklus belégzés
 * fázisánál. Külön, mert az „egy levegővel” gyakorlatoknál nincs körbeforgó
 * fázis, amihez kötni lehetne.
 */
export function notifyBreathIn(label: string): void {
  const { soundOn, voiceOn, hapticsOn } = useSettingsStore.getState();

  if (hapticsOn) {
    impactMedium();
  }
  if (soundOn) {
    playPhaseSound(0);
  }
  if (voiceOn) {
    speak(label);
  }
}

/** A gyakorlat végi visszajelzés. Külön, mert nem fázisváltáshoz kötődik. */
export function notifySessionFinished(): void {
  if (useSettingsStore.getState().hapticsOn) {
    notifySuccess();
  }
}
