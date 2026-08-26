/**
 * 2. gyakorlat a logopédus lapjáról: be- és kilégzés négy orr/száj
 * kombinációban (`docs/legzogyakorlatok-2026-08-26.md`).
 *
 * A lapon nincs időzítés, ezért a doboz légzés ismerős 4 mp-es alapütemét
 * visszük tovább, tartás nélkül: 4 mp be, 4 mp ki. **A négy kombináció
 * folyamatosan váltakozik** — a négy együtt egy kör —, és ez a kör megy
 * 4-szer egymás után. Lásd D-054.
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

/** Ennyiszer megy végig a gyerek a négy kombináción. */
export const SEQUENCE_REPEATS = 4;

/** A négy kombináció a lap sorrendjében. Egy kör = mind a négy, sorban. */
export const noseMouthCombos: readonly NoseMouthCombo[] = [
  { title: 'Orron be, orron ki', labels: ['Orron be', 'Orron ki'] },
  { title: 'Orron be, szájon ki', labels: ['Orron be', 'Szájon ki'] },
  { title: 'Szájon be, szájon ki', labels: ['Szájon be', 'Szájon ki'] },
  { title: 'Szájon be, orron ki', labels: ['Szájon be', 'Orron ki'] },
] as const;

/** Az összes légzés: 4 kombináció × 4 kör = 16. */
export const TOTAL_ROUNDS = noseMouthCombos.length * SEQUENCE_REPEATS;

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

/**
 * Hányadik kombinációnál tart a gyerek a letelt légzések után. Minden légzés
 * után a következő kombináció jön, a negyedik után pedig kezdődik elölről.
 */
export function comboAt(completedBreaths: number): NoseMouthCombo {
  return noseMouthCombos[completedBreaths % noseMouthCombos.length];
}
