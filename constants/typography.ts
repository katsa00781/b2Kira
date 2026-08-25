/**
 * Tipográfiai szerepek a `docs/design-tokens.md` és a
 * `design-reference/00-teljes-canvas.html` alapján.
 *
 * A méretek iPaden arányosan nagyobbak (`constants/layout.ts`, D-035).
 *
 * A betűsúlyt a betűcsalád hordozza (nem `fontWeight`), mert a Google Fonts
 * csomagok külön fájlként töltik be a súlyokat.
 */

import { s } from './layout';

export const fonts = {
  balooBold: 'Baloo2_700Bold',
  balooExtraBold: 'Baloo2_800ExtraBold',
  nunitoSemiBold: 'Nunito_600SemiBold',
  nunitoBold: 'Nunito_700Bold',
} as const;

export const typography = {
  /** Képernyő cím – „Doboz Légzés", „Hozzunk létre fiókot!" */
  screenTitle: { fontFamily: fonts.balooExtraBold, fontSize: s(24) },
  /** Fázis felirat a gyakorlat képernyőn */
  phaseLabel: { fontFamily: fonts.balooExtraBold, fontSize: s(22), letterSpacing: 0.5 },
  /** Kezdőképernyő üdvözlés – „Szia, Zoé!" */
  greeting: { fontFamily: fonts.balooBold, fontSize: s(20) },
  /** Elsődleges gomb felirata */
  buttonPrimary: { fontFamily: fonts.balooExtraBold, fontSize: s(17) },
  /** Kártya cím (nagy) */
  cardTitle: { fontFamily: fonts.balooExtraBold, fontSize: s(15) },
  /** Kérdés a CTA fölött – „Készen állsz egy jó nagy levegőre?" */
  prompt: { fontFamily: fonts.balooBold, fontSize: s(15) },
  /** Másodlagos gomb felirata, streak szám */
  buttonSecondary: { fontFamily: fonts.balooExtraBold, fontSize: s(14) },
  /** Kártya cím (kicsi) */
  cardTitleSmall: { fontFamily: fonts.balooExtraBold, fontSize: s(13) },

  /** Input mező szövege */
  input: { fontFamily: fonts.nunitoSemiBold, fontSize: s(14) },
  /** Input címke */
  inputLabel: { fontFamily: fonts.nunitoBold, fontSize: s(12) },
  /** Beállítás sor címkéje */
  settingLabel: { fontFamily: fonts.nunitoBold, fontSize: s(14) },
  /** Szekció felirat, timer */
  sectionLabel: { fontFamily: fonts.nunitoBold, fontSize: s(13) },
  /** Alcím, segédszöveg */
  subtitle: { fontFamily: fonts.nunitoSemiBold, fontSize: s(13) },
  /** Apró segédszöveg, checkbox felirat */
  hint: { fontFamily: fonts.nunitoSemiBold, fontSize: s(12) },
  /** Matrica felirat */
  stickerLabel: { fontFamily: fonts.nunitoBold, fontSize: s(11) },
} as const;
