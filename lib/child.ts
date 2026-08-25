/**
 * A gyerek profiljának olvasása és írása a `breathing_children` táblán.
 *
 * Minden hívás best-effort: hálózati vagy jogosultsági hiba esetén csendben
 * `null`-lal (illetve semmivel) tér vissza, mert az app offline-first — a
 * kezdőképernyő a lokálisan tárolt adatból már megjelent, mire ez lefut.
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

const CHARACTER_IDS: readonly CharacterId[] = ['bunny', 'panda', 'monkey', 'lion'];

function toCharacterId(value: string): CharacterId {
  const known = CHARACTER_IDS.find((id) => id === value);
  return known ?? defaultCharacterId;
}

/** A bejelentkezett szülő első gyerekének profilja, a befejezett gyakorlatok számával. */
export async function fetchChildProfile(): Promise<ChildProfile | null> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const parentId = sessionData.session?.user.id;
    if (!parentId) {
      return null;
    }

    const { data, error } = await supabase
      .from('breathing_children')
      .select('id, name, age, character_id, streak_days, last_session_date')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      age: data.age,
      characterId: toCharacterId(data.character_id),
      streakDays: data.streak_days,
      lastSessionDate: data.last_session_date,
      completedSessions: await countCompletedSessions(data.id),
    };
  } catch {
    return null;
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
