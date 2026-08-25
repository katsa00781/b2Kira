/**
 * A `breathing_settings` sor olvasása és írása.
 *
 * A sort a séma triggere hozza létre a gyerekkel együtt, ezért itt csak
 * olvasunk és frissítünk. Minden hívás best-effort: hiba esetén csendben
 * továbbmegyünk, a lokális állapot marad az igazság (offline-first).
 */
import type { SessionLengthKey } from '@/data/sessionLengths';
import { defaultSessionKey } from '@/data/sessionLengths';
import type { SettingsSnapshot } from '@/store/useSettingsStore';
import { DEFAULT_REMINDER_TIME } from '@/store/useSettingsStore';

import { supabase } from './supabase';

const LENGTH_KEYS: readonly SessionLengthKey[] = ['short', 'medium', 'long'];

function toLengthKey(value: string): SessionLengthKey {
  return LENGTH_KEYS.find((key) => key === value) ?? defaultSessionKey;
}

/** A Postgres `time` oszlop `HH:MM:SS` alakban jön; nekünk `HH:MM` kell. */
function toReminderTime(value: string | null): string {
  return value ? value.slice(0, 5) : DEFAULT_REMINDER_TIME;
}

export async function fetchSettings(childId: string): Promise<SettingsSnapshot | null> {
  try {
    const { data, error } = await supabase
      .from('breathing_settings')
      .select('sound_on, voice_on, haptics_on, reminder_on, reminder_time, session_length_key')
      .eq('child_id', childId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      soundOn: data.sound_on,
      voiceOn: data.voice_on,
      hapticsOn: data.haptics_on,
      reminderOn: data.reminder_on,
      reminderTime: toReminderTime(data.reminder_time),
      sessionLengthKey: toLengthKey(data.session_length_key),
    };
  } catch {
    return null;
  }
}

export async function saveSettings(
  childId: string,
  settings: SettingsSnapshot
): Promise<void> {
  try {
    await supabase
      .from('breathing_settings')
      .update({
        sound_on: settings.soundOn,
        voice_on: settings.voiceOn,
        haptics_on: settings.hapticsOn,
        reminder_on: settings.reminderOn,
        reminder_time: `${settings.reminderTime}:00`,
        session_length_key: settings.sessionLengthKey,
        updated_at: new Date().toISOString(),
      })
      .eq('child_id', childId);
  } catch {
    // A szülő a beállítást lokálisan már látja érvényesnek.
  }
}
