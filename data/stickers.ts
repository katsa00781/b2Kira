/**
 * A matricakatalógus. Hardcoded, típusosan (CLAUDE.md) — az adatbázis csak azt
 * tárolja, melyik kulcs mikor oldódott fel.
 *
 * **A sorrend a feloldás sorrendje**: minden 5. befejezett gyakorlat oldja fel
 * a következőt. A színek a `constants/colors.ts`-ből jönnek, hex értéket ide se
 * írunk.
 *
 * Az első öt matrica a designból van (`docs/design-tokens.md`, „Matricák”), a
 * másik négy a mi kiegészítésünk — lásd docs/feature-tasks.md, D-040.
 */
import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import { colors } from '@/constants/colors';

export type StickerKey =
  | 'heart'
  | 'star'
  | 'leaf'
  | 'sun'
  | 'drop'
  | 'cloud'
  | 'moon'
  | 'sparkle'
  | 'balloon';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type Sticker = {
  /** Ez kerül a `breathing_stickers.sticker_key`-be. */
  key: StickerKey;
  /** Magyar név a csempe alatt. */
  name: string;
  icon: IoniconName;
  /** A designban minden alak más méretű, ezt megtartjuk. */
  iconSize: number;
  iconColor: string;
  /** 135°-os háttérgradiens. */
  colors: readonly [string, string];
};

export const stickers: readonly Sticker[] = [
  {
    key: 'heart',
    name: 'Szívecske',
    icon: 'heart',
    iconSize: 24,
    iconColor: colors.pink['600'],
    colors: [colors.pink['150'], colors.pink['250']],
  },
  {
    key: 'star',
    name: 'Csillagfény',
    icon: 'star',
    iconSize: 26,
    iconColor: colors.purple['700'],
    colors: [colors.purple['200'], colors.purple['400']],
  },
  {
    key: 'leaf',
    name: 'Levélke',
    icon: 'leaf',
    iconSize: 26,
    iconColor: colors.green['600'],
    colors: [colors.green['100'], colors.green['300']],
  },
  {
    key: 'sun',
    name: 'Napsugár',
    icon: 'sunny',
    iconSize: 24,
    iconColor: colors.amber['700'],
    colors: [colors.amber['200'], colors.amber['400']],
  },
  {
    key: 'drop',
    name: 'Vízcsepp',
    icon: 'water',
    iconSize: 26,
    iconColor: colors.blue['700'],
    colors: [colors.blue['100'], colors.blue['300']],
  },
  // ---- innentől a mi kiegészítésünk (D-040)
  {
    key: 'cloud',
    name: 'Felhőcske',
    icon: 'cloud',
    iconSize: 26,
    iconColor: colors.blue['700'],
    colors: [colors.blue['50'], colors.blue['100']],
  },
  {
    key: 'moon',
    name: 'Holdacska',
    icon: 'moon',
    iconSize: 24,
    iconColor: colors.purple['700'],
    colors: [colors.purple['100'], colors.purple['150']],
  },
  {
    key: 'sparkle',
    name: 'Csillagpor',
    icon: 'sparkles',
    iconSize: 24,
    iconColor: colors.pink['600'],
    colors: [colors.amber['200'], colors.pink['200']],
  },
  {
    key: 'balloon',
    name: 'Lufi',
    icon: 'balloon',
    iconSize: 24,
    iconColor: colors.green['600'],
    colors: [colors.green.bg, colors.green['400']],
  },
];

/** A designban 9 slot van, és pontosan ennyi matricánk is van. */
export const STICKER_COUNT = stickers.length;

/**
 * Hány matrica van meg `completedSessions` befejezett gyakorlat után.
 * Minden 5. gyakorlat old fel egyet, a katalógus sorrendjében.
 */
export function unlockedCount(completedSessions: number, perSticker: number): number {
  const completed = Math.max(0, Math.floor(completedSessions));
  return Math.min(Math.floor(completed / perSticker), STICKER_COUNT);
}

/** A soron következő, még zárolt matrica. `null`, ha már mind megvan. */
export function nextSticker(completedSessions: number, perSticker: number): Sticker | null {
  return stickers[unlockedCount(completedSessions, perSticker)] ?? null;
}
