/**
 * Halk hangeffektek a fázisváltásokhoz (`expo-audio`).
 *
 * Két szabály CLAUDE.md-ből:
 * - **Néma módban ne szóljon** (`playsInSilentMode: false`) — a haptika viszont
 *   akkor is megy, arról a `lib/haptics.ts` gondoskodik.
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

import { devLog, devWarn } from './devWarn';

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
    reportPlayback(name, player);
  } catch (error) {
    devWarn('hang', error);
  }
}

/** Fejlesztői mérés: a `play()` után negyed másodperccel szól-e valóban. */
function reportPlayback(name: SoundName, player: AudioPlayer): void {
  if (!__DEV__) {
    return;
  }

  setTimeout(() => {
    const status = player.currentStatus;
    devLog(
      'hang',
      `${name} · szól=${player.playing} betöltve=${player.isLoaded} időzár=${status.timeControlStatus} várakozás=${status.reasonForWaitingToPlay}`
    );
  }, 250);
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

/** Csak a diagnosztikának: a már létrehozott lejátszók. */
export function loadedPlayers(): ReadonlyMap<SoundName, AudioPlayer> {
  return players;
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
export function ensureAudioMode(): Promise<void> {
  audioModePromise ??= setAudioModeAsync({
    // iOS néma kapcsoló: a hang elnémul, a rezgés megy tovább.
    playsInSilentMode: false,
    // Rövid effektek — ne szakítsák meg, amit a szülő épp hallgat.
    interruptionMode: 'mixWithOthers',
    shouldPlayInBackground: false,
  }).catch((error: unknown) => {
    devWarn('hang', error);
  });

  return audioModePromise;
}

/**
 * Fejlesztői hangpróba: hurkolt, teljes hangerejű lejátszás `durationMs`-ig.
 *
 * A fázishangok 0,34 mp-esek — annyi idő alatt az iOS hangerő-HUD-ja fel se
 * jön, tehát a **média** csúszka állását nem lehet ellenőrizni gyakorlat
 * közben. Ez a hurok elég hosszú hozzá. Csak `__DEV__`-ben szól.
 */
export function playTestTone(durationMs: number): void {
  if (!__DEV__) {
    return;
  }

  const player = getPlayer('exhale');
  if (!player) {
    return;
  }

  try {
    player.loop = true;
    player.volume = 1;
    player.seekTo(0).catch((error: unknown) => devWarn('hang', error));
    player.play();

    setTimeout(() => {
      try {
        player.pause();
        player.loop = false;
        player.volume = VOLUME;
      } catch (error) {
        devWarn('hang', error);
      }
    }, durationMs);
  } catch (error) {
    devWarn('hang', error);
  }
}
