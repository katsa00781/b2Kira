/**
 * 3. és 4. gyakorlat a logopédus lapjáról: a hét napjai, illetve a
 * szótagsorozatok **egy levegővel** (`docs/legzogyakorlatok-2026-08-26.md`).
 *
 * A két gyakorlat mechanikája azonos — vezetett belégzés, majd a gyerek egy
 * kilégzéssel elmondja a sort —, ezért közös képernyőt kapnak.
 *
 * **Itt semmit nem mérünk**: nincs stopper, nincs számolás, nincs értékelés.
 * A gyerek maga lép tovább, amikor kész (D-055).
 */
import type { BreathPattern } from '@/data/phases';

export type OneBreathKey = 'weekdays' | 'syllables';

export type OneBreathSet = {
  key: OneBreathKey;
  /** Képernyő cím. */
  title: string;
  /** Amit a gyereknek mondunk, mielőtt levegőt vesz. */
  instruction: string;
  /** Sorok, mindegyik egy levegővel. A lap sorrendjében. */
  items: readonly string[];
};

/** A vezetett belégzés hossza másodpercben — a doboz légzés alapüteme. */
export const INHALE_SECONDS = 4;

/**
 * Egyfázisú minta: a doboz 4 mp alatt nő teljes méretűre, majd ott marad,
 * amíg a gyerek mondja a sort. A `colorPhase` a belégzés fázisára mutat, így
 * a szín és a hang a meglévő tokenekből jön (D-058).
 */
export const inhalePattern: BreathPattern = {
  phaseSeconds: INHALE_SECONDS,
  labels: ['Vegyél egy nagy levegőt'],
  keyframeSeconds: [0, INHALE_SECONDS],
  keyframeValues: [0.55, 1],
  colorPhase: [0],
};

/** A hét napjai egy sorban, ahogy a gyerek mondja. */
const WEEKDAYS = 'hétfő, kedd, szerda, csütörtök, péntek, szombat, vasárnap';

export const oneBreathSets: Record<OneBreathKey, OneBreathSet> = {
  weekdays: {
    key: 'weekdays',
    title: 'A hét napjai',
    instruction: 'Mondd el egy levegővel!',
    // Háromszor ugyanaz a sor: a lapon egy feladat, de egy kör kevés lenne.
    items: [WEEKDAYS, WEEKDAYS, WEEKDAYS],
  },
  syllables: {
    key: 'syllables',
    title: 'Szótagok',
    instruction: 'Mondd el egy levegővel!',
    items: [
      'pápápápá',
      'papapa',
      'pepepe',
      'bábábábá',
      'mámámámá',
      'mamama',
      'tátátátá',
      'dádádádá',
      'kákákáká',
      'gágágágá',
    ],
  },
};

/**
 * Útvonal-paraméter → gyakorlat. Ismeretlen kulcsnál a szótagsor jön, hogy egy
 * elgépelt link se vezessen üres képernyőre.
 */
export function oneBreathSet(key: string | undefined): OneBreathSet {
  return key === 'weekdays' ? oneBreathSets.weekdays : oneBreathSets.syllables;
}
