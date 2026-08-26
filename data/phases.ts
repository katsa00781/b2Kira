/**
 * A 4-4-4-4 doboz légzés fázisai. **Ez a ritmus a gyerek logopédusától kapott
 * feladat** — a másodperceket és a `scale` értékeket engedély nélkül nem
 * változtatjuk meg (CLAUDE.md, D-003). Forrás: `docs/design-tokens.md`.
 *
 * A lap többi gyakorlata is ugyanezt a motort használja, más `BreathPattern`-nel
 * (`data/noseMouth.ts`, `data/oneBreath.ts`) — lásd D-054.
 */

/** Egy fázis hossza másodpercben. */
export const PHASE_SECONDS = 4;

/** A négy fázis felirata, a fázis indexének sorrendjében. */
export const phaseLabels = ['Lélegezz be', 'Tartsd', 'Lélegezz ki', 'Tartsd'] as const;

export const PHASE_COUNT = phaseLabels.length;

/** Egy teljes ciklus hossza másodpercben (4 × 4 = 16). */
export const CYCLE_SECONDS = PHASE_SECONDS * PHASE_COUNT;

/**
 * A doboz és a karakter `scale` értéke a cikluson belüli időhöz kötve.
 * 0–4 mp: 0.55 → 1.00 · 4–8 mp: 1.00 · 8–12 mp: 1.00 → 0.55 · 12–16 mp: 0.55
 */
export const SCALE_KEYFRAME_SECONDS: readonly number[] = [0, 4, 8, 12, 16];
export const SCALE_KEYFRAME_VALUES: readonly number[] = [0.55, 1, 1, 0.55, 0.55];

/**
 * Egy légzésminta: hány fázis, mennyi ideig, milyen felirattal, és hogyan
 * nagyítson közben a doboz. A `useBreathingCycle` ebből dolgozik.
 */
export type BreathPattern = {
  /** Minden fázis ilyen hosszú. */
  phaseSeconds: number;
  /** Fázisonként a felirat, ez hangzik el és ez látszik nagyban. */
  labels: readonly string[];
  /** A `scale` töréspontjai a cikluson belüli időhöz kötve. */
  keyframeSeconds: readonly number[];
  keyframeValues: readonly number[];
  /**
   * Pattern-fázis → a doboz légzés fázisindexe (0 be · 1 tart · 2 ki · 3 tart).
   * Innen jön a doboz színe, az árnyéka és a hangeffekt — így új gyakorlathoz
   * nem kell új design értéket kitalálni (D-058).
   */
  colorPhase: readonly number[];
};

/** A doboz légzés mintája: 4 fázis × 4 mp. */
export const boxPattern: BreathPattern = {
  phaseSeconds: PHASE_SECONDS,
  labels: phaseLabels,
  keyframeSeconds: SCALE_KEYFRAME_SECONDS,
  keyframeValues: SCALE_KEYFRAME_VALUES,
  colorPhase: [0, 1, 2, 3],
};

/** Egy teljes ciklus hossza a mintából. */
export function cycleSeconds(pattern: BreathPattern): number {
  return pattern.phaseSeconds * pattern.labels.length;
}
