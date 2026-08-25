/**
 * Fejlesztés közbeni figyelmeztetés.
 *
 * A visszajelzési csatornák élesben **némán buknak** (D-034) — ez a gyerek
 * miatt jó, de fejlesztés közben pont ezért nem derül ki, ha egy eszközön
 * meg se szólalnak. `__DEV__`-ben ezért kiírjuk a Metro konzolra, élesben
 * viszont továbbra sem történik semmi.
 */
export function devWarn(area: string, error: unknown): void {
  if (__DEV__) {
    console.warn(`[${area}] ${error instanceof Error ? error.message : String(error)}`);
  }
}
