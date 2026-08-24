/**
 * Színek egyetlen forrása. Az értékek a `docs/design-tokens.md`-ből származnak,
 * a nyers paletta a `constants/palette.json`-ban van, hogy a `tailwind.config.js`
 * is ugyanazt olvassa (NativeWind osztálynevek: `bg-purple-50`, `text-text-heading`).
 *
 * Komponensbe hex értéket soha ne írj — mindig innen hivatkozz.
 */
import palette from './palette.json';

export const colors = palette;

/** A négy légzésfázis doboz-színe. Sorrend = fázis index. */
export const phaseColors = [
  palette.amber['500'], // 0 – Lélegezz be
  palette.pink['500'], // 1 – Tartsd
  palette.green['300'], // 2 – Lélegezz ki
  palette.blue['300'], // 3 – Tartsd
] as const;

/** Gradiensek `expo-linear-gradient`-hez: colors + locations párban. */
export const gradients = {
  /** Bejelentkezés, Kezdőképernyő háttere */
  purpleScreen: {
    colors: ['#FBF2FF', '#F3E9FF', palette.purple['100']] as const,
    locations: [0, 0.45, 1] as const,
  },
  /** Regisztráció, Légzőgyakorlat háttere */
  greenScreen: {
    colors: [palette.green.bg, palette.blue['50'], palette.purple['50']] as const,
    locations: [0, 0.6, 1] as const,
  },
  /** Elsődleges (lila) gomb */
  primaryButton: {
    colors: [palette.pink['400'], palette.purple['400']] as const,
  },
  /** Regisztráció (zöld) gomb */
  greenButton: {
    colors: [palette.blue['300'], palette.green['500']] as const,
  },
  /** Session progress bar kitöltése */
  sessionProgress: {
    colors: [palette.green['300'], palette.green['500']] as const,
  },
} as const;
