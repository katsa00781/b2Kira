/**
 * A lokálisan lezárt gyakorlatok feltöltése a `breathing_sessions` táblára.
 *
 * Offline-first (CLAUDE.md): a gyakorlat mindig lokálisan záródik, ez a modul
 * csak utólag, best-effort próbálja felvinni. Ami nem megy át, marad a sorban
 * (`useSessionStore.pending`), és a következő alkalommal újra próbálkozik.
 *
 * **A UI soha nem várja meg ezt a modult**, és hiba esetén sem jelez semmit —
 * a gyereknek nem dolga tudni, hogy volt-e net.
 */
import { SESSIONS_PER_LEVEL } from '@/data/levels';
import { stickers, unlockedCount } from '@/data/stickers';
import { useChildStore } from '@/store/useChildStore';
import { useSessionStore, type PendingSession } from '@/store/useSessionStore';

import { saveProgress } from './child';
import { saveUnlockedStickers } from './stickers';
import { supabase } from './supabase';

/** Egyszerre csak egy futás — az indítás és az előtérbe kerülés egybeeshet. */
let running = false;

/**
 * Kiüríti a feltöltési sort, és felviszi a sorozatot meg a feloldott
 * matricákat. Mindig csendben tér vissza.
 *
 * Hívási pontok (D-038): app indítás, előtérbe kerülés, gyakorlat vége.
 */
export async function syncPendingSessions(): Promise<void> {
  if (running) {
    return;
  }

  const { pending } = useSessionStore.getState();
  const child = useChildStore.getState();

  // Ha nincs se feltöltendő gyakorlat, se haladás, nincs mit tenni.
  if (pending.length === 0 && child.completedSessions === 0) {
    return;
  }

  running = true;

  try {
    const childId = await resolveChildId();
    if (!childId) {
      return;
    }

    if (pending.length > 0) {
      const uploaded = await uploadSessions(childId, pending);
      if (uploaded.length > 0) {
        useSessionStore.getState().clearPending(uploaded);
      }
    }

    // A sorozat és a matricák a session sorokból nem jönnek ki maguktól.
    const progress = useChildStore.getState();
    await saveProgress(childId, {
      streakDays: progress.streakDays,
      lastSessionDate: progress.lastSessionDate,
    });

    const earned = unlockedCount(progress.completedSessions, SESSIONS_PER_LEVEL);
    await saveUnlockedStickers(
      childId,
      stickers.slice(0, earned).map((sticker) => sticker.key)
    );
  } catch {
    // Nincs net, lejárt token, bármi: a sor marad, legközelebb újra megy.
  } finally {
    running = false;
  }
}

/**
 * A gyerek id-je. Új eszközön még nincs meg lokálisan, ilyenkor egyszer
 * megpróbáljuk lehúzni a profilt — ha az sem megy, nincs mit feltölteni.
 */
async function resolveChildId(): Promise<string | null> {
  const local = useChildStore.getState().childId;
  if (local) {
    return local;
  }

  await useChildStore.getState().syncFromServer();
  return useChildStore.getState().childId;
}

/**
 * Egyetlen kötegelt `upsert`. A sorok id-je a kliensen generált uuid, és
 * `ignoreDuplicates` mellett a már felvitt sor egyszerűen kimarad — így egy
 * megismételt feltöltés nem hoz létre duplikátumot (D-039).
 *
 * Egy köteg, egy kérés: tipikusan 1–3 sor várakozik. Ha a köteg elhasal,
 * egyetlen sort sem törlünk a sorból.
 */
async function uploadSessions(childId: string, pending: PendingSession[]): Promise<string[]> {
  const rows = pending.map((session) => ({
    id: session.id,
    child_id: childId,
    started_at: session.startedAt,
    duration_seconds: session.durationSeconds,
    cycles_completed: session.cyclesCompleted,
    completed: session.completed,
    character_id: session.characterId,
  }));

  const { error } = await supabase
    .from('breathing_sessions')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: true });

  return error ? [] : pending.map((session) => session.id);
}
