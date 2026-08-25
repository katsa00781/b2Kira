/**
 * Szülői beállítások: a három visszajelzés-kapcsoló, a napi emlékeztető és a
 * gyakorlat hossza.
 *
 * A kapcsolók **azonnal** érvényesek: a gyakorlat közben is átállíthatók,
 * mert a visszajelzés a fázisváltás pillanatában olvassa ki az állapotot
 * (`hooks/useSessionFeedback.ts`).
 *
 * Offline-first (CLAUDE.md): a lokális állapot az igazság, a
 * `breathing_settings` írása utólag, best-effort történik.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SessionLengthKey } from '@/data/sessionLengths';
import { defaultSessionKey } from '@/data/sessionLengths';

/** `HH:MM` a gyerek helyi ideje szerint — ez megy a `reminder_time` oszlopba. */
export type ReminderTime = string;

/** A design szerinti alapérték (`00-teljes-canvas.html`, 6. képernyő). */
export const DEFAULT_REMINDER_TIME: ReminderTime = '17:30';

export type SettingsSnapshot = {
  soundOn: boolean;
  voiceOn: boolean;
  hapticsOn: boolean;
  reminderOn: boolean;
  reminderTime: ReminderTime;
  sessionLengthKey: SessionLengthKey;
};

type SettingsState = SettingsSnapshot & {
  setSoundOn: (soundOn: boolean) => void;
  setVoiceOn: (voiceOn: boolean) => void;
  setHapticsOn: (hapticsOn: boolean) => void;
  setReminderOn: (reminderOn: boolean) => void;
  setReminderTime: (reminderTime: ReminderTime) => void;
  setSessionLengthKey: (sessionLengthKey: SessionLengthKey) => void;
  /** A szerverről érkező értékek átvétele (csak induláskor, lásd D-045). */
  applyServerSettings: (settings: SettingsSnapshot) => void;
};

const initialState: SettingsSnapshot = {
  // Alapból mindhárom megy — a gyerek így kapja a legtöbb támpontot.
  soundOn: true,
  voiceOn: true,
  hapticsOn: true,
  reminderOn: true,
  reminderTime: DEFAULT_REMINDER_TIME,
  sessionLengthKey: defaultSessionKey,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setSoundOn: (soundOn) => set({ soundOn }),
      setVoiceOn: (voiceOn) => set({ voiceOn }),
      setHapticsOn: (hapticsOn) => set({ hapticsOn }),
      setReminderOn: (reminderOn) => set({ reminderOn }),
      setReminderTime: (reminderTime) => set({ reminderTime }),
      setSessionLengthKey: (sessionLengthKey) => set({ sessionLengthKey }),

      applyServerSettings: (settings) => set({ ...settings }),
    }),
    {
      name: 'doboz-legzes.settings',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      /** A 0. verzió csak a három kapcsolót ismerte, a többi mező hiányzik. */
      migrate: (persisted) => ({ ...initialState, ...(persisted as Partial<SettingsSnapshot>) }),
    }
  )
);

/** A store aktuális, szerverre küldhető pillanatképe. */
export function settingsSnapshot(): SettingsSnapshot {
  const {
    soundOn,
    voiceOn,
    hapticsOn,
    reminderOn,
    reminderTime,
    sessionLengthKey,
  } = useSettingsStore.getState();

  return { soundOn, voiceOn, hapticsOn, reminderOn, reminderTime, sessionLengthKey };
}
