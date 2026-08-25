/**
 * A lezárt gyakorlatok lokális naplója. A gyakorlat mindig lokálisan záródik
 * (offline-first, CLAUDE.md), a Supabase írás utólag, best-effort történik —
 * ezt a sort a 8. szakasz `lib/sync.ts`-e fogja üríteni.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CharacterId } from '@/data/characters';
import { CYCLE_SECONDS } from '@/data/phases';
import { useChildStore } from '@/store/useChildStore';

/** Egy megszakított vagy befejezett gyakorlat, a `breathing_sessions` alakjában. */
export type PendingSession = {
  /** Lokális id — ez véd a dupla feltöltés ellen (8. szakasz). */
  id: string;
  /** ISO időbélyeg, a gyakorlat indulása. */
  startedAt: string;
  durationSeconds: number;
  cyclesCompleted: number;
  /** `true`, ha a gyerek végigcsinálta a beállított hosszt. */
  completed: boolean;
  characterId: CharacterId;
};

type SessionRecord = {
  durationSeconds: number;
  completed: boolean;
  characterId: CharacterId;
};

type SessionState = {
  /** Még fel nem szinkronizált gyakorlatok, időrendben. */
  pending: PendingSession[];
  /** Lezárja a gyakorlatot: sorba teszi, és ha kész lett, számolja is. */
  recordSession: (record: SessionRecord) => void;
  /** A sikeresen feltöltött sorok eltávolítása (8. szakasz). */
  clearPending: (ids: string[]) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      pending: [],

      recordSession: ({ durationSeconds, completed, characterId }) => {
        const seconds = Math.max(0, Math.round(durationSeconds));

        // A 0 mp-es „gyakorlat" (a gyerek azonnal visszalépett) nem gyakorlat.
        if (seconds === 0) {
          return;
        }

        const session: PendingSession = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          startedAt: new Date(Date.now() - seconds * 1000).toISOString(),
          durationSeconds: seconds,
          cyclesCompleted: Math.floor(seconds / CYCLE_SECONDS),
          completed,
          characterId,
        };

        set((state) => ({ pending: [...state.pending, session] }));

        if (completed) {
          useChildStore.getState().registerCompletedSession();
        }
      },

      clearPending: (ids) =>
        set((state) => ({ pending: state.pending.filter((item) => !ids.includes(item.id)) })),
    }),
    {
      name: 'doboz-legzes.sessions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
