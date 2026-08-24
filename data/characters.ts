/**
 * A négy választható karakter katalógusa. Hardcoded tartalom — az adatbázis
 * csak azt tárolja, melyiket választotta a gyerek.
 *
 * A chip színpárok a `docs/design-tokens.md` „Karakterek" táblájából valók,
 * mindegyik `135deg` irányú gradiens (bal felső → jobb alsó).
 */
import { colors } from '@/constants/colors';

export type CharacterId = 'bunny' | 'panda' | 'monkey' | 'lion';

export type Character = {
  id: CharacterId;
  /** Magyar név – a gyerek ezt hallja/olvassa, ha valahol meg kell nevezni. */
  name: string;
  /** A kezdőképernyő 36×36-os választó chipjének gradiense. */
  chipColors: readonly [string, string];
};

export const characters: readonly Character[] = [
  {
    id: 'bunny',
    name: 'Nyuszi',
    chipColors: [colors.pink['200'], colors.pink['300']],
  },
  {
    id: 'panda',
    name: 'Panda',
    chipColors: [colors.character.panda.chip, colors.character.panda.patch],
  },
  {
    id: 'monkey',
    name: 'Majom',
    chipColors: [colors.character.monkey.muzzle, colors.character.monkey.fur],
  },
  {
    id: 'lion',
    name: 'Oroszlán',
    chipColors: [colors.amber['300'], colors.amber['600']],
  },
] as const;

/** Alapértelmezett karakter, ha a gyerek még nem választott. */
export const defaultCharacterId: CharacterId = 'bunny';
