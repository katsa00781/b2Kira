/**
 * Fejlesztői önteszt a visszajelzési csatornákra. Csak `__DEV__`-ben fut, a
 * gyakorlat indulásakor egyszer, és a Metro konzolra írja, mi működik az
 * **adott eszközön** — Expo Go-ban a szimulátor és a fizikai iPhone nem
 * ugyanaz (D-048).
 *
 * Két menetben mér: induláskor egy pillanatkép, majd `DELAY_MS` múlva még
 * egy. A második a lényeg — a hangfájl Expo Go-ban a Metro dev szerverről
 * tölt, tehát induláskor a „még nincs betöltve" állapot **normális**, és csak
 * a késleltetett mérés mondja meg, hogy betöltődött-e valaha.
 *
 * A gyerek ebből semmit nem lát és nem hall.
 */
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Dimensions, Platform } from 'react-native';

import { phaseSounds } from '@/constants/sounds';
import { isTablet } from '@/constants/layout';
import { useSettingsStore } from '@/store/useSettingsStore';

import { devLog } from './devWarn';
import { ensureAudioMode, loadedPlayers, playTestTone } from './sounds';

/** Ennyi idő alatt egy pár kilobájtos WAV-nak le kell jönnie a dev szerverről. */
const DELAY_MS = 3000;

/**
 * Hurkolt hangpróba a késleltetett mérés után. Ha a hang megvan és nem tér
 * vissza, ez az első, ami törölhető.
 */
const TEST_TONE = true;
const TEST_TONE_MS = 6000;

export async function logFeedbackDiagnostics(): Promise<void> {
  if (!__DEV__) {
    return;
  }

  const { width, height } = Dimensions.get('screen');
  const lines: string[] = [
    `platform: ${Platform.OS} ${Platform.Version} · ${isTablet ? 'IPAD (tablet méret)' : 'telefon méret'} · ${width}×${height}`,
  ];

  const { soundOn, voiceOn, hapticsOn } = useSettingsStore.getState();
  lines.push(`kapcsolók: hang=${soundOn} beszéd=${voiceOn} rezgés=${hapticsOn}`);

  lines.push(await checkAudio());
  lines.push(await checkSpeech());
  lines.push(await checkHaptics());

  console.log(`[visszajelzés-teszt]\n  ${lines.join('\n  ')}`);

  setTimeout(() => {
    void logSecondPass();
  }, DELAY_MS);
}

/** A késleltetett mérés: betöltődött-e a hang, és beszél-e tényleg. */
async function logSecondPass(): Promise<void> {
  const lines: string[] = [];

  const player = loadedPlayers().get(phaseSounds[0]);
  if (!player) {
    lines.push('hang: a lejátszó eltűnt (a képernyőt közben elhagyták?)');
  } else {
    const status = player.currentStatus;
    lines.push(
      `hang: betöltve=${player.isLoaded} hossz=${player.duration}s szól=${player.playing}`
    );
    lines.push(
      `hang részletek: állapot=${status.playbackState} időzár=${status.timeControlStatus} várakozás oka=${status.reasonForWaitingToPlay} némítva=${status.mute} pufferel=${status.isBuffering}`
    );
  }

  try {
    lines.push(`beszéd: éppen beszél=${await Speech.isSpeakingAsync()}`);
  } catch (error) {
    lines.push(`beszéd: nem kérdezhető le — ${message(error)}`);
  }

  console.log(`[visszajelzés-teszt · ${DELAY_MS / 1000} mp múlva]\n  ${lines.join('\n  ')}`);

  if (TEST_TONE) {
    devLog(
      'hangpróba',
      `MOST ${TEST_TONE_MS / 1000} mp-ig szól egy hurkolt hang teljes hangerőn — nyomd meg közben a hangerő gombot, és nézd meg, a MÉDIA csúszka jön-e fel, és hol áll`
    );
    playTestTone(TEST_TONE_MS);
  }
}

async function checkAudio(): Promise<string> {
  try {
    await ensureAudioMode();
  } catch (error) {
    return `hang: az audio session nem állt be — ${message(error)}`;
  }

  const player = loadedPlayers().get(phaseSounds[0]);
  if (!player) {
    return 'hang: a lejátszó nem jött létre (hiányzó vagy nem dekódolható WAV?)';
  }

  return `hang: lejátszó kész, betöltve=${player.isLoaded} hossz=${player.duration}s hangerő=${player.volume}`;
}

async function checkSpeech(): Promise<string> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const hungarian = voices.filter((voice) => voice.language.toLowerCase().startsWith('hu'));

    return hungarian.length > 0
      ? `beszéd: ${hungarian.length} magyar hang (${hungarian.map((voice) => voice.name).join(', ')})`
      : `beszéd: NINCS magyar hang telepítve az eszközön (összesen ${voices.length} hang) — a mondatok némák maradhatnak`;
  } catch (error) {
    return `beszéd: a hanglista nem kérdezhető le — ${message(error)}`;
  }
}

async function checkHaptics() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Figyelem: a hívás iPaden és kikapcsolt rendszerrezgésnél is „lefut".
    return 'rezgés: a hívás lefutott (ez még nem jelenti, hogy érezni is)';
  } catch (error) {
    return `rezgés: a hívás elszállt — ${message(error)}`;
  }
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
