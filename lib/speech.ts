/**
 * Magyar hangos útmutatás (`expo-speech`). A fázis feliratát mondja ki,
 * lassan — CLAUDE.md „Hang, beszéd, haptika”.
 *
 * Fontos: minden mondat előtt `stop()`, hogy a mondatok ne torlódjanak
 * egymásra, ha a gyerek szünetel és folytat, vagy gyorsan ki-be kapcsolja
 * a beszédet.
 */
import * as Speech from 'expo-speech';

import { devLog, devWarn } from './devWarn';

const OPTIONS: Speech.SpeechOptions = {
  language: 'hu-HU',
  rate: 0.85,
  pitch: 1,
};

export function speak(text: string): void {
  try {
    Speech.stop();
    Speech.speak(text, __DEV__ ? { ...OPTIONS, ...devCallbacks(text) } : OPTIONS);
  } catch (error) {
    // Ha az eszközön nincs magyar hang, a gyakorlat menjen tovább némán.
    devWarn('beszéd', error);
  }
}

/** Szünetkor és a képernyő elhagyásakor. */
export function stopSpeaking(): void {
  try {
    Speech.stop();
  } catch (error) {
    // Ugyanaz: a leállítás hibája se akassza meg a gyakorlatot.
    devWarn('beszéd', error);
  }
}

/** Fejlesztői mérés: az `expo-speech` maga jelzi, elindult-e a mondat. */
function devCallbacks(text: string): Speech.SpeechOptions {
  return {
    onStart: () => devLog('beszéd', `elindult: „${text}”`),
    onDone: () => devLog('beszéd', `kimondva: „${text}”`),
    onError: (error) => devWarn('beszéd', error),
  };
}
