import { useEffect, useRef } from 'react';

import { phaseLabels } from '@/data/phases';
import { devLog } from '@/lib/devWarn';
import { logFeedbackDiagnostics } from '@/lib/feedbackDiagnostics';
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
export function useSessionFeedback(phase: number, active: boolean): void {
  const lastPhase = useRef<number | null>(null);

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

    // Fejlesztői mérés: enélkül nem látszik, hogy a fázisváltás egyáltalán
    // elsül-e az eszközön, vagy csak a megszólalás marad el.
    devLog('fázis', `${phase} · hang=${soundOn} beszéd=${voiceOn} rezgés=${hapticsOn}`);

    if (hapticsOn) {
      // A belégzés indítja a ciklust, ezért az erősebb.
      if (phase === 0) {
        impactMedium();
      } else {
        impactLight();
      }
    }

    if (soundOn) {
      playPhaseSound(phase);
    }

    if (voiceOn) {
      speak(phaseLabels[phase]);
    }
  }, [phase, active]);

  // Indulás: az audio session beáll, a három lejátszó pedig előre betöltődik.
  // Enélkül a fázisváltás pillanatában létrehozott lejátszó lemaradhat a saját
  // négymásodperces ablakáról, mert a WAV még a dev szerverről tölt (D-048).
  // A képernyő elhagyásakor ne beszéljen tovább, és a lejátszók is dőljenek le.
  useEffect(() => {
    void prepareSounds();
    void logFeedbackDiagnostics();

    return () => {
      stopSpeaking();
      releaseSounds();
    };
  }, []);
}

/** A gyakorlat végi visszajelzés. Külön, mert nem fázisváltáshoz kötődik. */
export function notifySessionFinished(): void {
  if (useSettingsStore.getState().hapticsOn) {
    notifySuccess();
  }
}
