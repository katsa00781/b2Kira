/**
 * A gyerek profilja: név, életkor, választott karakter, befejezett gyakorlatok
 * és a napi sorozat. Ez a kezdőképernyő egyetlen adatforrása.
 *
 * Offline-first (CLAUDE.md): a képernyő mindig a perzisztált lokális állapotból
 * rajzolódik, a Supabase-ből érkező adat utólag, best-effort módon frissíti.
 * Lásd docs/feature-tasks.md – D-024.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CharacterId } from '@/data/characters';
import { defaultCharacterId } from '@/data/characters';
import { SESSIONS_PER_LEVEL } from '@/data/levels';
import type { StickerKey } from '@/data/stickers';
import { stickers, unlockedCount } from '@/data/stickers';
import { fetchChildProfile, saveCharacter } from '@/lib/child';

type ChildState = {
  /** `null`, amíg a Supabase profil nem töltődött be (pl. új eszközön). */
  childId: string | null;
  name: string;
  age: number | null;
  characterId: CharacterId;
  /** Befejezett gyakorlatok száma — ebből jön a szint és a matricák. */
  completedSessions: number;
  streakDays: number;
  /** `YYYY-MM-DD`, a gyerek helyi ideje szerint. */
  lastSessionDate: string | null;
  /**
   * A most feloldott matrica kulcsa, amíg a kezdőképernyő meg nem ünnepelte.
   * Azért store-ban van és nem navigációs paraméterben, mert a gyakorlat
   * képernyő azonnal visszalép — az ünneplés a kezdőképernyőn jelenik meg.
   */
  justUnlocked: StickerKey | null;

  /**
   * A regisztrációkor (vagy a profil létrehozó képernyőn) megadott név és
   * életkor. Azonnal, hálózat nélkül is: a `breathing_children` sor utólag,
   * best-effort jön létre, de a gyerek addig is a nevén van szólítva.
   * Lásd docs/feature-tasks.md – D-050.
   */
  setChild: (child: { name: string; age: number }) => void;
  setCharacter: (characterId: CharacterId) => void;
  /**
   * Egy befejezett gyakorlat: szintet és sorozatot lép. A megszakított
   * gyakorlat nem számít bele — a gyereknek attól még nincs rossz napja.
   */
  registerCompletedSession: () => void;
  /** Az ünneplés lefutott, ne jelenjen meg újra. */
  clearJustUnlocked: () => void;
  /**
   * Frissítés a szerverről. Hiba esetén nem nyúl a lokális állapothoz.
   * `true`, ha a szerver megerősítette, hogy **nincs** gyerek profil — erre a
   * kezdőképernyő a profil létrehozására irányít (D-050). Offline vagy hibás
   * lekérdezésnél `false`, mert olyankor nem tudjuk.
   */
  syncFromServer: () => Promise<boolean>;
  /** Kijelentkezéskor (10. szakasz) ürítjük — a gyerek adata ne maradjon ott. */
  clear: () => void;
};

const initialState = {
  childId: null,
  name: '',
  age: null,
  characterId: defaultCharacterId,
  completedSessions: 0,
  streakDays: 0,
  lastSessionDate: null,
  justUnlocked: null,
} satisfies Omit<
  ChildState,
  | 'setChild'
  | 'setCharacter'
  | 'registerCompletedSession'
  | 'clearJustUnlocked'
  | 'syncFromServer'
  | 'clear'
>;

export const useChildStore = create<ChildState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setChild: ({ name, age }) => set({ name, age }),

      setCharacter: (characterId) => {
        set({ characterId });

        const { childId } = get();
        if (childId) {
          void saveCharacter(childId, characterId);
        }
      },

      registerCompletedSession: () => {
        set((state) => {
          const completedSessions = state.completedSessions + 1;

          // Minden 5. gyakorlat old fel egy matricát, a katalógus sorrendjében.
          const before = unlockedCount(state.completedSessions, SESSIONS_PER_LEVEL);
          const after = unlockedCount(completedSessions, SESSIONS_PER_LEVEL);
          const justUnlocked = after > before ? (stickers[after - 1]?.key ?? null) : state.justUnlocked;

          const today = dateKey();

          if (state.lastSessionDate === today) {
            return { completedSessions, justUnlocked };
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const continued = state.lastSessionDate === dateKey(yesterday);

          return {
            completedSessions,
            justUnlocked,
            streakDays: continued ? state.streakDays + 1 : 1,
            lastSessionDate: today,
          };
        });
      },

      clearJustUnlocked: () => set({ justUnlocked: null }),

      syncFromServer: async () => {
        const result = await fetchChildProfile();
        if (result.status !== 'ok') {
          return result.status === 'missing';
        }

        const { profile } = result;

        set((state) => ({
          childId: profile.id,
          name: profile.name,
          age: profile.age,
          // A karaktert a gyerek épp most is átállíthatta offline, ezért a
          // szerver értéke csak akkor számít, ha még nincs lokális profilunk.
          characterId: state.childId ? state.characterId : profile.characterId,
          // A lokálisan lezárt, még fel nem szinkronizált gyakorlatok se vesszenek el.
          completedSessions: Math.max(state.completedSessions, profile.completedSessions),
          streakDays: Math.max(state.streakDays, profile.streakDays),
          lastSessionDate: laterDate(state.lastSessionDate, profile.lastSessionDate),
        }));

        return false;
      },

      clear: () => set({ ...initialState }),
    }),
    {
      name: 'doboz-legzes.child',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/** `YYYY-MM-DD` a gyerek helyi ideje szerint (nem UTC). */
export function dateKey(date: Date = new Date()): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * A megjelenítendő sorozat. A tárolt `streakDays` csak akkor él, ha ma vagy
 * tegnap volt gyakorlat — kihagyott nap után a sorozat 0-ra áll.
 */
export function activeStreakDays(state: Pick<ChildState, 'streakDays' | 'lastSessionDate'>): number {
  if (!state.lastSessionDate) {
    return 0;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isRecent =
    state.lastSessionDate === dateKey() || state.lastSessionDate === dateKey(yesterday);

  return isRecent ? state.streakDays : 0;
}

function laterDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}
