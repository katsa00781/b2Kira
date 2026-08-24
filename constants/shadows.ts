/**
 * Árnyékok egyetlen forrása. Az értékek a `docs/design-tokens.md` „Árnyékok"
 * táblájából és a `design-reference/00-teljes-canvas.html`-ből származnak.
 *
 * A formátum a React Native 0.81 `boxShadow` stringje — ugyanaz a megközelítés,
 * mint a karaktereknél (lásd D-009): a design CSS értékei (offset, blur, alfa)
 * 1:1-ben átjönnek, közelítés nélkül. A színek a `palette.json` `shadow`
 * csoportjából jönnek, hogy komponensbe ne kelljen rgba értéket írni.
 */
import palette from './palette.json';

const s = palette.shadow;

export const shadows = {
  /** Input mező és kis kártya */
  input: `0 3px 10px ${s.input}`,
  /** Kártya (szintkártya, matrica alatti jelvénykártya) */
  card: `0 4px 14px ${s.card}`,
  /** Chip, avatar, beállítás ikon */
  chip: `0 2px 8px ${s.chip}`,
  /** Kezdőképernyő karakterválasztó chipje */
  characterChip: `0 2px 6px ${s.characterChip}`,
  /** Elsődleges (lila) gomb */
  buttonPurple: `0 8px 20px ${s.buttonPurple}`,
  /** Zöld gomb (regisztráció) */
  buttonGreen: `0 8px 20px ${s.buttonGreen}`,
  /** Szünet gomb a gyakorlat képernyőn */
  buttonPause: `0 6px 16px ${s.buttonGreen}`,
  /** Matrica csempe */
  sticker: `0 4px 10px ${s.sticker}`,
  /** Kapcsoló gombja */
  knob: `0 1px 3px ${s.knob}`,
  /** Szegmens választó nem aktív eleme */
  segment: `0 2px 6px ${s.input}`,
  /** Vissza gomb a gyakorlat képernyőn */
  backButton: `0 2px 6px ${s.backButton}`,
} as const;
