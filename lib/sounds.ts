/**
 * Halk hangeffektek a fázisváltásokhoz (`expo-audio`).
 *
 * Két szabály CLAUDE.md-ből:
 * - **Néma módban ne szóljon** (`playsInSilentMode: false`) — a haptika viszont
 *   akkor is megy, arról a `lib/haptics.ts` gondoskodik.
 * - **Hiányzó vagy hibás hangfájl ne dobjon hibát** — ilyenkor a gyakorlat
 *   némán fut tovább.
 *
 * A lejátszók lustán jönnek létre és megmaradnak: egy 4 mp-enkénti hangnál
 * az újra-létrehozás fölösleges késleltetés lenne.
 */
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import { phaseSounds, sounds, type SoundName } from '@/constants/sounds';

/** A hangok halkak maguktól is, ez csak a biztonsági plafon. */
const VOLUME = 0.7;

const players = new Map<SoundName, AudioPlayer>();
let audioModeReady = false;

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
    void player.seekTo(0);
    player.play();
  } catch {
    // Némán tovább.
  }
}

/** A képernyő elhagyásakor: a lejátszók natív oldala is felszabadul. */
export function releaseSounds(): void {
  for (const player of players.values()) {
    try {
      player.remove();
    } catch {
      // Némán tovább.
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
    ensureAudioMode();
    const player = createAudioPlayer(sounds[name]);
    player.volume = VOLUME;
    players.set(name, player);
    return player;
  } catch {
    // Hiányzó vagy nem dekódolható fájl: nincs hang, de nincs hiba sem.
    return null;
  }
}

function ensureAudioMode(): void {
  if (audioModeReady) {
    return;
  }
  audioModeReady = true;

  void setAudioModeAsync({
    // iOS néma kapcsoló: a hang elnémul, a rezgés megy tovább.
    playsInSilentMode: false,
    // Rövid effektek — ne szakítsák meg, amit a szülő épp hallgat.
    interruptionMode: 'mixWithOthers',
    shouldPlayInBackground: false,
  }).catch(() => {
    // Némán tovább.
  });
}
