/**
 * A hangeffektek egyetlen belépési pontja — a képek szabályához hasonlóan
 * (`constants/images.ts`) komponensben és képernyőn nincs közvetlen `require`.
 *
 * Halk, rövid hangok: az emelkedő a belégzés, az ereszkedő a kilégzés, a
 * rövid koppanás a két tartás. A lejátszás a `lib/sounds.ts`-ben van, és
 * hiányzó vagy hibás fájl esetén némán továbbmegy.
 */

export const sounds = {
  inhale: require('@/assets/sounds/inhale.wav'),
  hold: require('@/assets/sounds/hold.wav'),
  exhale: require('@/assets/sounds/exhale.wav'),
};

export type SoundName = keyof typeof sounds;

/** Fázisindex → hang. 0 belégzés · 1 tartás · 2 kilégzés · 3 tartás. */
export const phaseSounds: readonly SoundName[] = ['inhale', 'hold', 'exhale', 'hold'];
