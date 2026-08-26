/**
 * 2. gyakorlat a logopédus lapjáról: be- és kilégzés négy orr/száj
 * kombinációban (`docs/legzogyakorlatok-2026-08-26.md`).
 *
 * A lapon nincs időzítés és ismétlésszám, ezért a doboz légzés ismerős 4 mp-es
 * alapütemét visszük tovább, tartás nélkül: 4 mp be, 4 mp ki, kombinációnként
 * 3 kör. **Ez a szám a logopédus megerősítésére vár, addig sem variáljuk**
 * — lásd D-054.
 */
import type { BreathPattern } from '@/data/phases';

export type NoseMouthCombo = {
  /** A fejlécben álló összefoglaló: „Orron be, szájon ki”. */
  title: string;
  /** A két fázis felirata: ez látszik nagyban és ez hangzik el. */
  labels: readonly [string, string];
};

/** Egy be- és egy kilégzés hossza másodpercben. */
export const BREATH_SECONDS = 4;

/** Ennyi kört megy a gyerek egy kombinációból. */
export const ROUNDS_PER_COMBO = 3;

/** A négy kombináció a lap sorrendjében. */
export const noseMouthCombos: readonly NoseMouthCombo[] = [
  { title: 'Orron be, orron ki', labels: ['Orron be', 'Orron ki'] },
  { title: 'Orron be, szájon ki', labels: ['Orron be', 'Szájon ki'] },
  { title: 'Szájon be, szájon ki', labels: ['Szájon be', 'Szájon ki'] },
  { title: 'Szájon be, orron ki', labels: ['Szájon be', 'Orron ki'] },
] as const;

/** Az összes kör: 4 kombináció × 3 kör = 12. */
export const TOTAL_ROUNDS = noseMouthCombos.length * ROUNDS_PER_COMBO;

/**
 * A légzésminta: két fázis, tartás nélkül. A `colorPhase` a doboz légzés
 * belégzés- és kilégzés-fázisára mutat, így a szín, az árnyék és a hang is a
 * meglévő tokenekből jön (D-058).
 */
export const noseMouthPattern: BreathPattern = {
  phaseSeconds: BREATH_SECONDS,
  // A feliratot a képernyő az aktuális kombinációból veszi, ezért itt csak a
  // fázisok száma számít.
  labels: ['Lélegezz be', 'Lélegezz ki'],
  keyframeSeconds: [0, BREATH_SECONDS, BREATH_SECONDS * 2],
  keyframeValues: [0.55, 1, 0.55],
  colorPhase: [0, 2],
};

/** Hányadik kombinációnál tart a gyerek a letelt körök után. */
export function comboAt(completedRounds: number): NoseMouthCombo {
  const index = Math.min(
    noseMouthCombos.length - 1,
    Math.floor(completedRounds / ROUNDS_PER_COMBO)
  );
  return noseMouthCombos[index];
}
