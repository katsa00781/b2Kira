/**
 * A lezárt gyakorlatok lokális naplója. A gyakorlat mindig lokálisan záródik
 * (offline-first, CLAUDE.md), a Supabase írás utólag, best-effort történik —
 * ezt a sort a `lib/sync.ts` üríti.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CharacterId } from '@/data/characters';
import type { ExerciseKey } from '@/data/exercises';
import { CYCLE_SECONDS } from '@/data/phases';
import { useChildStore } from '@/store/useChildStore';

/** Egy megszakított vagy befejezett gyakorlat, a `breathing_sessions` alakjában. */
export type PendingSession = {
  /**
   * Kliensen generált uuid. Ez megy fel a `breathing_sessions.id`-ba is, így
   * egy megismételt feltöltés nem hoz létre duplikátumot (D-039).
   */
  id: string;
  /** Melyik gyakorlat volt (D-057). */
  exerciseKey: ExerciseKey;
  /** ISO időbélyeg, a gyakorlat indulása. */
  startedAt: string;
  durationSeconds: number;
  /**
   * Befejezett ismétlések száma: a doboz légzésnél a 16 mp-es ciklusok, a
   * többi gyakorlatnál a végigvitt körök vagy sorok.
   */
  cyclesCompleted: number;
  /** `true`, ha a gyerek végigcsinálta a beállított hosszt. */
  completed: boolean;
  characterId: CharacterId;
};

type SessionRecord = {
  exerciseKey: ExerciseKey;
  durationSeconds: number;
  completed: boolean;
  characterId: CharacterId;
  /**
   * Befejezett ismétlések. A doboz légzés nem adja meg — ott az eltelt időből
   * jön ki, mert a ciklus mindig pontosan 16 mp.
   */
  cyclesCompleted?: number;
};

type SessionState = {
  /** Még fel nem szinkronizált gyakorlatok, időrendben. */
  pending: PendingSession[];
  /** Lezárja a gyakorlatot: sorba teszi, és ha kész lett, számolja is. */
  recordSession: (record: SessionRecord) => void;
  /** A sikeresen feltöltött sorok eltávolítása. Hívja: `lib/sync.ts`. */
  clearPending: (ids: string[]) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      pending: [],

      recordSession: ({ exerciseKey, durationSeconds, completed, characterId, cyclesCompleted }) => {
        const seconds = Math.max(0, Math.round(durationSeconds));

        // A 0 mp-es „gyakorlat" (a gyerek azonnal visszalépett) nem gyakorlat.
        if (seconds === 0) {
          return;
        }

        const session: PendingSession = {
          id: createSessionId(),
          exerciseKey,
          startedAt: new Date(Date.now() - seconds * 1000).toISOString(),
          durationSeconds: seconds,
          cyclesCompleted: cyclesCompleted ?? Math.floor(seconds / CYCLE_SECONDS),
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
      version: 2,
      /**
       * 0 → 1: a 0. verzió id-je `${Date.now()}-${random}` alakú volt, ami nem
       * uuid. Ilyen sorral a feltöltés `invalid input syntax`-ra futna, és —
       * mivel egy kötegben megy minden — **örökre megakasztaná a sort**. Ezért
       * a régi id-ket új uuid-ra cseréljük. Ezek a sorok még sosem voltak fenn,
       * tehát duplikátum nem keletkezhet belőle.
       *
       * 1 → 2: a `exerciseKey` mező előtt csak doboz légzés létezett.
       */
      migrate: (persisted, version) => {
        const state = persisted as { pending?: PendingSession[] };

        if (version === 0 && state.pending) {
          state.pending = state.pending.map((session) =>
            UUID_PATTERN.test(session.id) ? session : { ...session, id: createSessionId() }
          );
        }

        if (version < 2 && state.pending) {
          state.pending = state.pending.map((session) => ({ ...session, exerciseKey: 'box' }));
        }

        return state as SessionState;
      },
    }
  )
);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * UUID v4 `Math.random`-ból. A `breathing_sessions.id` uuid típusú, és ezt a
 * kliensen generált id-t küldjük fel, hogy a feltöltés ismételhető legyen.
 *
 * Kriptográfiai erősség itt nem kell (az id csak azonosít, nem véd semmit),
 * ezért nem hoztunk be külön uuid könyvtárat — lásd D-039.
 */
function createSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
