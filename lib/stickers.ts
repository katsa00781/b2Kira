/**
 * A feloldott matricák felvitele a `breathing_stickers` táblára.
 *
 * A katalógus a kliensben van (`data/stickers.ts`), az adatbázis csak azt
 * tárolja, melyik kulcs mikor oldódott fel (CLAUDE.md). A feloldottság
 * forrása a befejezett gyakorlatok száma, ezért ez a tábla gyakorlatilag
 * egy másolat — best-effort írjuk, olvasni nem olvassuk vissza.
 */
import type { StickerKey } from '@/data/stickers';

import { supabase } from './supabase';

/**
 * A `unique (child_id, sticker_key)` megszorítás miatt az `ignoreDuplicates`
 * elég: a már meglévő sor `earned_at`-jét nem írjuk felül, tehát a megszerzés
 * eredeti ideje megmarad.
 */
export async function saveUnlockedStickers(
  childId: string,
  keys: readonly StickerKey[]
): Promise<void> {
  if (keys.length === 0) {
    return;
  }

  try {
    await supabase
      .from('breathing_stickers')
      .upsert(
        keys.map((key) => ({ child_id: childId, sticker_key: key })),
        { onConflict: 'child_id,sticker_key', ignoreDuplicates: true }
      );
  } catch {
    // Nincs net: a gyerek a matricáit lokálisan így is látja.
  }
}
