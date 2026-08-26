/**
 * A gyerek profiljának olvasása és írása a `breathing_children` táblán.
 *
 * Minden hívás best-effort: hálózati vagy jogosultsági hiba esetén csendben
 * visszalép (`status: 'unknown'`, illetve semmi), mert az app offline-first —
 * a kezdőképernyő a lokálisan tárolt adatból már megjelent, mire ez lefut.
 */
import type { CharacterId } from '@/data/characters';
import { defaultCharacterId } from '@/data/characters';

import { supabase } from './supabase';

export type ChildProfile = {
  id: string;
  name: string;
  age: number | null;
  characterId: CharacterId;
  streakDays: number;
  /** `YYYY-MM-DD`, a gyerek helyi ideje szerint. */
  lastSessionDate: string | null;
  completedSessions: number;
};

/**
 * A profil lekérdezésének kimenete. A „nincs sor" és a „nem értük el a
 * szervert" eset **nem** ugyanaz: az elsőre a kezdőképernyő a profil
 * létrehozására irányít, a másodikra offline-first módon nem csinál semmit.
 * Lásd docs/feature-tasks.md – D-050.
 */
export type ChildProfileResult =
  | { status: 'ok'; profile: ChildProfile }
  /** A szerver válaszolt: ehhez a szülőhöz nincs `breathing_children` sor. */
  | { status: 'missing' }
  /** Nincs bejelentkezett szülő, vagy a lekérdezés elhasalt (pl. nincs net). */
  | { status: 'unknown' };

const CHARACTER_IDS: readonly CharacterId[] = ['bunny', 'panda', 'monkey', 'lion'];

function toCharacterId(value: string): CharacterId {
  const known = CHARACTER_IDS.find((id) => id === value);
  return known ?? defaultCharacterId;
}

/** A bejelentkezett szülő első gyerekének profilja, a befejezett gyakorlatok számával. */
export async function fetchChildProfile(): Promise<ChildProfileResult> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const parentId = sessionData.session?.user.id;
    if (!parentId) {
      return { status: 'unknown' };
    }

    const { data, error } = await supabase
      .from('breathing_children')
      .select('id, name, age, character_id, streak_days, last_session_date')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { status: 'unknown' };
    }

    if (!data) {
      return { status: 'missing' };
    }

    return {
      status: 'ok',
      profile: {
        id: data.id,
        name: data.name,
        age: data.age,
        characterId: toCharacterId(data.character_id),
        streakDays: data.streak_days,
        lastSessionDate: data.last_session_date,
        completedSessions: await countCompletedSessions(data.id),
      },
    };
  } catch {
    return { status: 'unknown' };
  }
}

/** A választott karakter mentése. A UI nem várja meg — offline is működik. */
export async function saveCharacter(childId: string, characterId: CharacterId): Promise<void> {
  try {
    await supabase
      .from('breathing_children')
      .update({ character_id: characterId })
      .eq('id', childId);
  } catch {
    // A lokális választás akkor is érvényes marad, ha ez nem ment át.
  }
}

async function countCompletedSessions(childId: string): Promise<number> {
  const { count, error } = await supabase
    .from('breathing_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', childId)
    .eq('completed', true);

  return error ? 0 : (count ?? 0);
}

/**
 * A sorozat felvitele a `breathing_children`-re. A `completed_sessions` nincs
 * külön oszlopban — azt a `countCompletedSessions()` számolja a session
 * sorokból —, de a streak csak lokálisan létezne, ha nem küldenénk fel.
 *
 * Best-effort, mint minden más ebben a fájlban.
 */
export async function saveProgress(
  childId: string,
  progress: { streakDays: number; lastSessionDate: string | null }
): Promise<void> {
  try {
    await supabase
      .from('breathing_children')
      .update({
        streak_days: progress.streakDays,
        last_session_date: progress.lastSessionDate,
      })
      .eq('id', childId);
  } catch {
    // A lokális állapot marad az igazság, legközelebb újra próbáljuk.
  }
}
