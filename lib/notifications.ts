/**
 * Napi helyi emlékeztető a gyakorlásra (`expo-notifications`).
 *
 * Csak **helyi** értesítés, nincs push, nincs szerver, nincs token — a gyerek
 * adata sehova nem kerül ki. Az értesítés szövege a gyerek nevét sem
 * tartalmazza (CLAUDE.md, „Gyerekadat-elvek”), és a beszédéről vagy a
 * teljesítményéről sem szól, csak hív egy közös levegővételre.
 *
 * Minden hívás best-effort: ha az engedély hiányzik vagy a modul nem érhető el
 * (pl. Expo Go korlát), csendben továbbmegyünk — a gyakorlat enélkül is megy.
 */
import * as Notifications from 'expo-notifications';

/** Egyetlen ütemezett emlékeztetőnk van, ezzel az azonosítóval. */
const REMINDER_ID = 'doboz-legzes.daily-reminder';

const REMINDER_TITLE = 'Doboz Légzés 🌸';
const REMINDER_BODY = 'Van kedved egy jó nagy levegőhöz? Csak pár perc.';

/**
 * Engedélykérés. `true`, ha az értesítés küldhető.
 *
 * A rendszer csak egyszer kérdez rá; ha a szülő korábban elutasította, ez
 * `false`-szal tér vissza, és nem nyaggatjuk tovább.
 */
async function ensurePermission(prompt: boolean): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      return true;
    }

    // Indításkor sosem kérdezünk — a gyerek nézi a képernyőt (D-047).
    if (!prompt || !current.canAskAgain) {
      return false;
    }

    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
}

/**
 * Beállítja (vagy törli) a napi emlékeztetőt.
 *
 * Mindig előbb töröljük a korábbit, hogy időpontváltáskor ne torlódjanak.
 * `time` formátuma `HH:MM`, a gyerek helyi ideje szerint.
 *
 * `prompt` csak a beállítás képernyőről igaz — az engedélyt a **szülő** kapja
 * meg kérdésként, a szülői zár mögött, nem a gyerek app indításkor (D-047).
 */
export async function scheduleDailyReminder(
  enabled: boolean,
  time: string,
  { prompt = false }: { prompt?: boolean } = {}
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => {});

    if (!enabled) {
      return;
    }

    const granted = await ensurePermission(prompt);
    if (!granted) {
      return;
    }

    const { hour, minute } = parseTime(time);

    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: { title: REMINDER_TITLE, body: REMINDER_BODY, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch {
    // Nincs engedély, nincs modul, bármi: emlékeztető nélkül is működik az app.
  }
}

/** `HH:MM` → óra és perc. Hibás értéknél a design alapértéke (17:30). */
export function parseTime(time: string): { hour: number; minute: number } {
  const [rawHour, rawMinute] = time.split(':');
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    return { hour: 17, minute: 30 };
  }

  return {
    hour: Math.min(23, Math.max(0, hour)),
    minute: Math.min(59, Math.max(0, minute)),
  };
}

/** Óra és perc → `HH:MM`. */
export function formatTime(hour: number, minute: number): string {
  return `${`${hour}`.padStart(2, '0')}:${`${minute}`.padStart(2, '0')}`;
}
