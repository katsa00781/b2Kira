/**
 * Szülői beállítások. Egyelőre csak a három visszajelzés-kapcsoló él —
 * a gyakorlathossz, a napi emlékeztető és a `breathing_settings` szinkron
 * a 10. szakaszban jön hozzá.
 *
 * A kapcsolók **azonnal** érvényesek: a gyakorlat közben is átállíthatók,
 * mert a visszajelzés a fázisváltás pillanatában olvassa ki az állapotot
 * (`hooks/usePhaseFeedback.ts`).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  /** Halk hangeffekt fázisváltáskor. */
  soundOn: boolean;
  /** Magyar hangos útmutatás (a fázis feliratát mondja ki). */
  voiceOn: boolean;
  /** Rezgés fázisváltáskor és a gyakorlat végén. */
  hapticsOn: boolean;

  setSoundOn: (soundOn: boolean) => void;
  setVoiceOn: (voiceOn: boolean) => void;
  setHapticsOn: (hapticsOn: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Alapból mindhárom megy — a gyerek így kapja a legtöbb támpontot.
      soundOn: true,
      voiceOn: true,
      hapticsOn: true,

      setSoundOn: (soundOn) => set({ soundOn }),
      setVoiceOn: (voiceOn) => set({ voiceOn }),
      setHapticsOn: (hapticsOn) => set({ hapticsOn }),
    }),
    {
      name: 'doboz-legzes.settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
