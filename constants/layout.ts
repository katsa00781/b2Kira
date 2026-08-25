/**
 * Eszközméret-skálázás. A design egyetlen méretben készült — 390 pt széles
 * telefon, álló módban (`docs/design-tokens.md`) —, iPaden ezt arányosan
 * nagyítjuk fel. Lásd D-035.
 *
 * A szorzó **modul szintű konstans**, nem hook: így használható
 * `StyleSheet.create`-ben is, és nem okoz újrarenderelést forgatáskor.
 */
import { Dimensions } from 'react-native';

/** A design szélessége. Minden vízszintes érték ehhez készült. */
const BASE_WIDTH = 390;

/**
 * A legmagasabb képernyő (a gyakorlat) tartalma ~500 pt, plusz tartalék a
 * státuszsávnak és a home indicatornak. **Fekvő módban a képernyő rövidebb
 * oldala a magasság**, ezért a magasság a szűk keresztmetszet, nem a szélesség
 * — a szorzót ebből számoljuk.
 */
const BASE_HEIGHT = 560;

/** A 13"-es iPadeken a további nagyítás már csak nagy, nem jobb. */
const MAX_SCALE = 1.6;

const { width, height } = Dimensions.get('screen');

/**
 * A fizikai képernyő rövidebb oldala. Elforgatáskor nem változik, ezért a
 * nagyítás is állandó marad — a layout nem ugrik át más méretre forgatáskor.
 */
const shortSide = Math.min(width, height);

/** 1.0 minden iPhone-on; 1.0 fölött iPaden (iPad 6: ~1.37). */
export const uiScale = Math.min(Math.max(shortSide / BASE_HEIGHT, 1), MAX_SCALE);

/** Igaz, ha a képernyő elbírja a nagyítást — a gyakorlatban: iPad. */
export const isTablet = uiScale > 1;

/**
 * Design pt → eszköz pt.
 *
 * Szándékosan **nem kerekít**: telefonon a szorzó pontosan 1.0, így az `s()`
 * az azonosság — a designban szereplő törtértékek (`12.5`, `6.5`) is
 * változatlanul mennek át, a telefonos megjelenés bitre ugyanaz marad.
 */
export function s(value: number): number {
  return value * uiScale;
}

/**
 * A tartalomoszlop maximális szélessége iPaden: a design szélessége, arányosan
 * nagyítva, középre igazítva. Enélkül fekvő módban egy közel 1000 pt széles
 * beviteli mező lenne. Telefonon `undefined` — ott a képernyő adja a
 * szélességet, így a telefonos megjelenés bitre változatlan marad.
 */
export const contentMaxWidth = isTablet ? s(BASE_WIDTH) : undefined;
