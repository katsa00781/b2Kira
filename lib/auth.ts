/**
 * Szülői auth (Supabase e-mail + jelszó) és a hozzá tartozó gyerek profil.
 *
 * A képernyők csak ezeket a függvényeket hívják, hogy az űrlap-ellenőrzés és a
 * magyar hibaüzenetek egy helyen legyenek — az `app/` mappában a CLAUDE.md
 * szerint nincs üzleti logika.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from './supabase';

/**
 * Minden művelet ugyanezt adja vissza. A `message` mindig kész magyar mondat,
 * amit a képernyő változtatás nélkül kiír. Sikernél csak akkor van üzenet, ha
 * a szülőnek tennie is kell valamit (pl. megnyitni a levelet).
 */
export type AuthResult = { ok: true; message?: string } | { ok: false; message: string };

/** A Supabase auth és postgrest hibáinak közös, minimális alakja. */
type SupabaseErrorLike = { code?: string; name?: string; status?: number; message: string };

export type SignUpParams = {
  childName: string;
  /** Az űrlapról nyersen, szövegként — itt lesz belőle szám. */
  childAge: string;
  email: string;
  password: string;
  /** „Elfogadom, hogy a szülő felügyeli a fiókot…" */
  consent: boolean;
};

type PendingChild = { name: string; age: number };

/**
 * A gyerek profilját csak bejelentkezett állapotban lehet beszúrni (RLS), a
 * regisztráció viszont e-mail megerősítést kér — ezért a név és az életkor
 * addig a telefonon vár. Lásd D-021.
 */
const PENDING_CHILD_KEY = 'doboz-legzes.pending-child';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
/** A `breathing_children.age` oszlop check megkötése. */
const MIN_AGE = 3;
const MAX_AGE = 18;

const NETWORK_MESSAGE = 'Úgy tűnik, nincs internet. Nézd meg a kapcsolatot, és próbáld újra!';
const GENERIC_MESSAGE = 'Valami félrement. Próbáld újra kicsit később!';

/** Supabase hibakód → barátságos magyar mondat. */
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Nem stimmel az e-mail cím vagy a jelszó. Próbáld újra!',
  email_not_confirmed: 'Előbb erősítsd meg az e-mail címedet – küldtünk rá egy levelet.',
  user_already_exists: 'Ezzel az e-mail címmel már van fiók. Jelentkezz be!',
  email_exists: 'Ezzel az e-mail címmel már van fiók. Jelentkezz be!',
  email_address_invalid: 'Ez az e-mail cím nem tűnik érvényesnek.',
  weak_password: `A jelszó legyen legalább ${MIN_PASSWORD_LENGTH} karakter hosszú.`,
  over_email_send_rate_limit: 'Túl sok levelet kértünk rövid idő alatt. Várj pár percet!',
  over_request_rate_limit: 'Túl sok próbálkozás. Várj pár percet, és próbáld újra!',
  validation_failed: 'Nézd át a megadott adatokat.',
  signup_disabled: 'Most nem lehet új fiókot létrehozni.',
  user_banned: 'Ez a fiók le van tiltva.',
};

function isNetworkError(error: SupabaseErrorLike): boolean {
  return (
    error.name === 'AuthRetryableFetchError' ||
    error.status === 0 ||
    error.message.includes('Network request failed') ||
    error.message.includes('Failed to fetch')
  );
}

function toMessage(error: SupabaseErrorLike): string {
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  if (isNetworkError(error)) {
    return NETWORK_MESSAGE;
  }
  return GENERIC_MESSAGE;
}

/** Szülői bejelentkezés. Siker után a függő gyerek profil is létrejön. */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  const address = email.trim();

  if (!address || !password) {
    return { ok: false, message: 'Töltsd ki az e-mail címet és a jelszót.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email: address, password });

  if (error) {
    return { ok: false, message: toMessage(error) };
  }

  await ensureChildProfile();
  return { ok: true };
}

/** Regisztráció: szülői fiók + a gyerek profilja (név, életkor). */
export async function signUp({
  childName,
  childAge,
  email,
  password,
  consent,
}: SignUpParams): Promise<AuthResult> {
  const name = childName.trim();
  const age = Number.parseInt(childAge, 10);
  const address = email.trim();

  if (!name) {
    return { ok: false, message: 'Írd be a gyermek nevét.' };
  }
  if (!Number.isFinite(age) || age < MIN_AGE || age > MAX_AGE) {
    return { ok: false, message: `Az életkor ${MIN_AGE} és ${MAX_AGE} év között lehet.` };
  }
  if (!EMAIL_PATTERN.test(address)) {
    return { ok: false, message: 'Ez az e-mail cím nem tűnik érvényesnek.' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `A jelszó legyen legalább ${MIN_PASSWORD_LENGTH} karakter hosszú.`,
    };
  }
  if (!consent) {
    return { ok: false, message: 'A folytatáshoz pipáld ki a szülői felügyeletet.' };
  }

  const { data, error } = await supabase.auth.signUp({ email: address, password });

  if (error) {
    return { ok: false, message: toMessage(error) };
  }

  await savePendingChild({ name, age });

  // Ha a projekt e-mail megerősítést kér, itt még nincs session — a profil a
  // szülő első bejelentkezésekor jön létre.
  if (!data.session) {
    return {
      ok: true,
      message: `Elküldtük a megerősítő levelet a(z) ${address} címre. Nyisd meg, aztán jelentkezz be!`,
    };
  }

  await ensureChildProfile();
  return { ok: true };
}

/** „Elfelejtett jelszó?" – visszaállító levél a megadott címre. */
export async function resetPassword(email: string): Promise<AuthResult> {
  const address = email.trim();

  if (!EMAIL_PATTERN.test(address)) {
    return { ok: false, message: 'Írd be a szülő e-mail címét, és küldünk rá egy levelet.' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(address);

  if (error) {
    return { ok: false, message: toMessage(error) };
  }

  return { ok: true, message: `Elküldtük a levelet a(z) ${address} címre.` };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Ha van bejelentkezett szülő és a telefonon vár egy regisztrációkor megadott
 * gyerek, létrehozza a `breathing_children` sort. Best-effort: hálózati hiba
 * esetén csendben visszalép, a függő adat megmarad a következő próbához.
 */
export async function ensureChildProfile(): Promise<void> {
  try {
    const pending = await readPendingChild();
    if (!pending) {
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const parentId = sessionData.session?.user.id;
    if (!parentId) {
      return;
    }

    const { data: existing, error: selectError } = await supabase
      .from('breathing_children')
      .select('id')
      .eq('parent_id', parentId)
      .limit(1);

    if (selectError) {
      return;
    }

    if (existing.length > 0) {
      await clearPendingChild();
      return;
    }

    const { error: insertError } = await supabase
      .from('breathing_children')
      .insert({ parent_id: parentId, name: pending.name, age: pending.age });

    if (!insertError) {
      await clearPendingChild();
    }
  } catch {
    // Offline-first: a profil létrehozása sosem akaszthatja meg a belépést.
  }
}

async function savePendingChild(child: PendingChild): Promise<void> {
  await AsyncStorage.setItem(PENDING_CHILD_KEY, JSON.stringify(child));
}

async function readPendingChild(): Promise<PendingChild | null> {
  const raw = await AsyncStorage.getItem(PENDING_CHILD_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'name' in parsed &&
      'age' in parsed &&
      typeof parsed.name === 'string' &&
      typeof parsed.age === 'number'
    ) {
      return { name: parsed.name, age: parsed.age };
    }
  } catch {
    // Sérült adat – nincs mit tenni vele.
  }

  await clearPendingChild();
  return null;
}

async function clearPendingChild(): Promise<void> {
  await AsyncStorage.removeItem(PENDING_CHILD_KEY);
}
