/**
 * A választható gyakorlathosszok (`docs/design-tokens.md` – „Session”, és a
 * 6. képernyő szegmens választója). A választót a 10. szakasz (szülői
 * beállítások) köti be; addig a gyakorlat az alapértelmezett hosszal indul.
 */

export type SessionLength = {
  /** A választó felirata. */
  label: string;
  seconds: number;
};

export const sessionLengths: readonly SessionLength[] = [
  { label: '1 perc', seconds: 60 },
  { label: '2-3 perc', seconds: 150 },
  { label: '5 perc', seconds: 300 },
] as const;

/** A design alapértelmezett hossza: 150 mp, kb. 9 ciklus. */
export const defaultSessionSeconds = 150;
