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

  setCharacter: (characterId: CharacterId) => void;
  /**
   * Egy befejezett gyakorlat: szintet és sorozatot lép. A megszakított
   * gyakorlat nem számít bele — a gyereknek attól még nincs rossz napja.
   */
  registerCompletedSession: () => void;
  /** Frissítés a szerverről. Hiba esetén nem nyúl a lokális állapothoz. */
  syncFromServer: () => Promise<void>;
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
} satisfies Omit<
  ChildState,
  'setCharacter' | 'registerCompletedSession' | 'syncFromServer' | 'clear'
>;

export const useChildStore = create<ChildState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCharacter: (characterId) => {
        set({ characterId });

        const { childId } = get();
        if (childId) {
          void saveCharacter(childId, characterId);
        }
      },

      registerCompletedSession: () => {
        set((state) => {
          const today = dateKey();

          if (state.lastSessionDate === today) {
            return { completedSessions: state.completedSessions + 1 };
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const continued = state.lastSessionDate === dateKey(yesterday);

          return {
            completedSessions: state.completedSessions + 1,
            streakDays: continued ? state.streakDays + 1 : 1,
            lastSessionDate: today,
          };
        });
      },

      syncFromServer: async () => {
        const profile = await fetchChildProfile();
        if (!profile) {
          return;
        }

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
