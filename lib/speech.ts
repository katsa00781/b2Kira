/**
 * Magyar hangos útmutatás (`expo-speech`). A fázis feliratát mondja ki,
 * lassan — CLAUDE.md „Hang, beszéd, haptika”.
 *
 * Fontos: minden mondat előtt `stop()`, hogy a mondatok ne torlódjanak
 * egymásra, ha a gyerek szünetel és folytat, vagy gyorsan ki-be kapcsolja
 * a beszédet.
 */
import * as Speech from 'expo-speech';

const OPTIONS: Speech.SpeechOptions = {
  language: 'hu-HU',
  rate: 0.85,
  pitch: 1,
};

export function speak(text: string): void {
  try {
    Speech.stop();
    Speech.speak(text, OPTIONS);
  } catch {
    // Ha az eszközön nincs magyar hang, a gyakorlat menjen tovább némán.
  }
}

/** Szünetkor és a képernyő elhagyásakor. */
export function stopSpeaking(): void {
  try {
    Speech.stop();
  } catch {
    // Ugyanaz: a leállítás hibája se akassza meg a gyakorlatot.
  }
}
