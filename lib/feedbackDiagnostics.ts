/**
 * Fejlesztői önteszt a visszajelzési csatornákra. Csak `__DEV__`-ben fut, a
 * gyakorlat indulásakor egyszer, és a Metro konzolra írja, mi működik az
 * **adott eszközön** — Expo Go-ban a szimulátor és a fizikai iPhone nem
 * ugyanaz (D-048).
 *
 * Azért kell, mert mind a három csatorna némán bukik (D-034): eszközön
 * enélkül semmi nem különbözteti meg a „ki van kapcsolva” esetet a
 * „nincs meg a natív modul” és a „nincs magyar hang” esettől.
 *
 * A gyerek ebből semmit nem lát és nem hall.
 */
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

import { phaseSounds } from '@/constants/sounds';
import { useSettingsStore } from '@/store/useSettingsStore';

import { ensureAudioMode, loadedPlayers } from './sounds';

export async function logFeedbackDiagnostics(): Promise<void> {
  if (!__DEV__) {
    return;
  }

  const lines: string[] = [`platform: ${Platform.OS} ${Platform.Version}`];

  const { soundOn, voiceOn, hapticsOn } = useSettingsStore.getState();
  lines.push(`kapcsolók: hang=${soundOn} beszéd=${voiceOn} rezgés=${hapticsOn}`);

  lines.push(await checkAudio());
  lines.push(await checkSpeech());
  lines.push(await checkHaptics());

  console.log(`[visszajelzés-teszt]\n  ${lines.join('\n  ')}`);
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
    return 'rezgés: a hívás lefutott (szimulátoron ettől még nem érezni)';
  } catch (error) {
    return `rezgés: a hívás elszállt — ${message(error)}`;
  }
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
