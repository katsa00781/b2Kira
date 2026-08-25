/**
 * Haptikus visszajelzés (CLAUDE.md „Hang, beszéd, haptika”).
 * Minden hívás néma módban is megy — a rezgés nem függ a néma kapcsolótól.
 *
 * A `expo-haptics` nem minden eszközön (szimulátor, web, olcsóbb Android)
 * érhető el, ezért minden hívás elnyeli a hibát: a gyakorlat sose álljon meg
 * azért, mert nem tudott rezegni.
 */
import * as Haptics from 'expo-haptics';

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
  } catch {
    // Némán tovább — lásd a fájl fejlécét.
  }
}
