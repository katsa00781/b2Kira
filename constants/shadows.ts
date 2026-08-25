/**
 * Árnyékok egyetlen forrása. Az értékek a `docs/design-tokens.md` „Árnyékok"
 * táblájából és a `design-reference/00-teljes-canvas.html`-ből származnak.
 *
 * Az offset és a blur iPaden arányosan nagyobb (`constants/layout.ts`, D-035),
 * hogy a felnagyított kártyák alatt ne maradjon vékony az árnyék.
 *
 * A formátum a React Native 0.81 `boxShadow` stringje — ugyanaz a megközelítés,
 * mint a karaktereknél (lásd D-009): a design CSS értékei (offset, blur, alfa)
 * 1:1-ben átjönnek, közelítés nélkül. A színek a `palette.json` `shadow`
 * csoportjából jönnek, hogy komponensbe ne kelljen rgba értéket írni.
 */
import { phaseColors } from './colors';
import { s } from './layout';
import palette from './palette.json';

const shadowColors = palette.shadow;

/**
 * A légződoboz árnyéka fázisonként: `0 8px 24px {szín}55`
 * (`docs/design-tokens.md`). Az `55` = 33% átlátszatlanság.
 */
export const phaseBoxShadows = phaseColors.map((color) => `0 ${s(8)}px ${s(24)}px ${color}55`);

export const shadows = {
  /** Input mező és kis kártya */
  input: `0 ${s(3)}px ${s(10)}px ${shadowColors.input}`,
  /** Kártya (szintkártya, matrica alatti jelvénykártya) */
  card: `0 ${s(4)}px ${s(14)}px ${shadowColors.card}`,
  /** Chip, avatar, beállítás ikon */
  chip: `0 ${s(2)}px ${s(8)}px ${shadowColors.chip}`,
  /** Kezdőképernyő karakterválasztó chipje */
  characterChip: `0 ${s(2)}px ${s(6)}px ${shadowColors.characterChip}`,
  /** Elsődleges (lila) gomb */
  buttonPurple: `0 ${s(8)}px ${s(20)}px ${shadowColors.buttonPurple}`,
  /** Zöld gomb (regisztráció) */
  buttonGreen: `0 ${s(8)}px ${s(20)}px ${shadowColors.buttonGreen}`,
  /** Szünet gomb a gyakorlat képernyőn */
  buttonPause: `0 ${s(6)}px ${s(16)}px ${shadowColors.buttonGreen}`,
  /** Matrica csempe */
  sticker: `0 ${s(4)}px ${s(10)}px ${shadowColors.sticker}`,
  /** Kapcsoló gombja */
  knob: `0 ${s(1)}px ${s(3)}px ${shadowColors.knob}`,
  /** Szegmens választó nem aktív eleme */
  segment: `0 ${s(2)}px ${s(6)}px ${shadowColors.input}`,
  /** Vissza gomb a gyakorlat képernyőn */
  backButton: `0 ${s(2)}px ${s(6)}px ${shadowColors.backButton}`,
} as const;
