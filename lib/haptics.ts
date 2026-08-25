/**
 * Haptikus visszajelzés (CLAUDE.md „Hang, beszéd, haptika”).
 * A rezgés nem a mi audio session-ünkön múlik, hanem az iOS rendszerszintű
 * „Rezgés” beállításán: ha az néma módban tiltva van, a hívás hibátlanul
 * lefut, és mégsem érezni semmit. Ezt az app nem tudja felülírni.
 *
 * A `expo-haptics` nem minden eszközön (szimulátor, web, olcsóbb Android)
 * érhető el, ezért minden hívás elnyeli a hibát: a gyakorlat sose álljon meg
 * azért, mert nem tudott rezegni.
 */
import * as Haptics from 'expo-haptics';

import { devWarn } from './devWarn';

/** A belégzés kezdete erősebb — ez az egyetlen fázis, amit „elindítunk”. */
export function impactMedium(): void {
  void run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

/** A többi fázisváltás finom koppintás. */
export function impactLight(): void {
  void run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** A gyakorlat végén. */
export function notifySuccess(): void {
  void run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

async function run(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch (error) {
    // Némán tovább — lásd a fájl fejlécét. Fejlesztés közben viszont látszik.
    devWarn('rezgés', error);
  }
}
