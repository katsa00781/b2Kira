/**
 * Halk hangeffektek a fázisváltásokhoz (`expo-audio`).
 *
 * Két szabály:
 * - **Néma módban is szól** (`playsInSilentMode: true`, tehát `.playback`
 *   kategória) — a gyerek akkor is kapja a vezető hangot, ha a szülő telefonja
 *   épp néma. Ez tudatos eltérés a CLAUDE.md eredeti szabályától, lásd D-049.
 * - **Hiányzó vagy hibás hangfájl ne dobjon hibát** — ilyenkor a gyakorlat
 *   némán fut tovább (D-034), de `__DEV__`-ben legalább naplózzuk (D-048).
 *
 * A lejátszók a gyakorlat indulásakor, **előre** jönnek létre és megmaradnak:
 * Expo Go-ban a WAV a Metro dev szerverről töltődik le hálózaton át, ezért a
 * fázisváltás pillanatában létrehozott lejátszó könnyen lemarad a saját
 * négymásodperces ablakáról (D-048).
 */
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import { phaseSounds, sounds, type SoundName } from '@/constants/sounds';

import { devWarn } from './devWarn';

/** A hangok halkak maguktól is, ez csak a biztonsági plafon. */
const VOLUME = 0.7;

const players = new Map<SoundName, AudioPlayer>();
let audioModePromise: Promise<void> | null = null;

/**
 * A gyakorlat indulásakor: audio session beállítása és a lejátszók előre
 * betöltése. Akkor is lefut, ha a hangeffekt ki van kapcsolva — az audio
 * session a beszédre is érvényes, azt pedig külön kapcsoló szabályozza.
 */
export async function prepareSounds(): Promise<void> {
  await ensureAudioMode();

  for (const name of Object.keys(sounds) as SoundName[]) {
    getPlayer(name);
  }
}

/** Egy fázisváltás hangja. Ismeretlen fázisnál nem csinál semmit. */
export function playPhaseSound(phase: number): void {
  const name = phaseSounds[phase];
  if (!name) {
    return;
  }

  const player = getPlayer(name);
  if (!player) {
    return;
  }

  try {
    // Az előző lejátszás közben is jöhet új fázis — mindig az elejéről.
    player.seekTo(0).catch((error: unknown) => devWarn('hang', error));
    player.play();
  } catch (error) {
    devWarn('hang', error);
  }
}

/** A képernyő elhagyásakor: a lejátszók natív oldala is felszabadul. */
export function releaseSounds(): void {
  for (const player of players.values()) {
    try {
      player.remove();
    } catch (error) {
      devWarn('hang', error);
    }
  }
  players.clear();
}

function getPlayer(name: SoundName): AudioPlayer | null {
  const existing = players.get(name);
  if (existing) {
    return existing;
  }

  try {
    void ensureAudioMode();
    const player = createAudioPlayer(sounds[name]);
    player.volume = VOLUME;
    players.set(name, player);
    return player;
  } catch (error) {
    // Hiányzó vagy nem dekódolható fájl: nincs hang, de nincs hiba sem.
    devWarn('hang', error);
    return null;
  }
}

/** Az audio session egyszer áll be, és a hívók megvárhatják. */
function ensureAudioMode(): Promise<void> {
  audioModePromise ??= setAudioModeAsync({
    // iOS néma kapcsolónál is szóljon — a vezető hang a gyakorlat része (D-049).
    playsInSilentMode: true,
    // Rövid effektek — ne szakítsák meg, amit a szülő épp hallgat.
    interruptionMode: 'mixWithOthers',
    shouldPlayInBackground: false,
  }).catch((error: unknown) => {
    devWarn('hang', error);
  });

  return audioModePromise;
}
