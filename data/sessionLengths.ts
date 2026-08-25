/**
 * A választható gyakorlathosszok (`docs/design-tokens.md` – „Session”, és a
 * 6. képernyő szegmens választója).
 *
 * A `key` a `breathing_settings.session_length_key` oszlop értéke — a séma
 * `short | medium | long`-ot enged, ezért a kliens is ezt a három kulcsot
 * használja, nem a másodperceket.
 */

export type SessionLengthKey = 'short' | 'medium' | 'long';

export type SessionLength = {
  key: SessionLengthKey;
  /** A választó felirata. */
  label: string;
  seconds: number;
};

export const sessionLengths: readonly SessionLength[] = [
  { key: 'short', label: '1 perc', seconds: 60 },
  { key: 'medium', label: '2-3 perc', seconds: 150 },
  { key: 'long', label: '5 perc', seconds: 300 },
] as const;

/** A design alapértelmezett hossza: 150 mp, kb. 9 ciklus. */
export const defaultSessionKey: SessionLengthKey = 'medium';
export const defaultSessionSeconds = 150;

/** Kulcs → másodperc. Ismeretlen kulcsnál az alapértelmezett hossz. */
export function sessionSeconds(key: SessionLengthKey): number {
  return sessionLengths.find((length) => length.key === key)?.seconds ?? defaultSessionSeconds;
}
