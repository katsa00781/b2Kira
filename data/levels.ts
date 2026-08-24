/**
 * Szintek: minden 5. befejezett gyakorlat old fel egy matricát, és egyben
 * szintet is lép a gyerek (a design szerint „2. szint — Felhő-ösvény”,
 * alatta „3/5 gyakorlat a következő matricáig”).
 *
 * A designban csak a 2. szint neve szerepel, a többit mi adtuk hozzá —
 * lásd docs/feature-tasks.md, D-023.
 */

/** Ennyi befejezett gyakorlat kell egy matricához és egy szintlépéshez. */
export const SESSIONS_PER_LEVEL = 5;

/**
 * Szintnevek sorrendben. A 8. fölött a lista utolsó neve marad — a v1-ben
 * úgysem jut el idáig senki, és jobb, mint kifogyni a névből.
 */
export const levelNames: readonly string[] = [
  'Szellő-ösvény',
  'Felhő-ösvény',
  'Napsugár-ösvény',
  'Szivárvány-ösvény',
  'Hold-ösvény',
  'Csillag-ösvény',
  'Hullám-ösvény',
  'Álom-ösvény',
] as const;

export type LevelProgress = {
  /** 1-től indul. */
  level: number;
  name: string;
  /** Hány gyakorlat van meg az aktuális szinten (0 … SESSIONS_PER_LEVEL-1). */
  done: number;
  /** 0 és 1 közötti kitöltöttség a progress barhoz. */
  ratio: number;
};

/** Befejezett gyakorlatok száma → szint, szintnév és a szinten belüli haladás. */
export function levelProgress(completedSessions: number): LevelProgress {
  const completed = Math.max(0, Math.floor(completedSessions));
  const index = Math.floor(completed / SESSIONS_PER_LEVEL);
  const done = completed % SESSIONS_PER_LEVEL;

  return {
    level: index + 1,
    name: levelNames[Math.min(index, levelNames.length - 1)],
    done,
    ratio: done / SESSIONS_PER_LEVEL,
  };
}
