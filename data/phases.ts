/**
 * A 4-4-4-4 doboz légzés fázisai. **Ez a ritmus a gyerek logopédusától kapott
 * feladat** — a másodperceket és a `scale` értékeket engedély nélkül nem
 * változtatjuk meg (CLAUDE.md, D-003). Forrás: `docs/design-tokens.md`.
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
