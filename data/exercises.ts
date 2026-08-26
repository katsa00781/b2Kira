/**
 * A gyakorlatok katalógusa. Hardcoded tartalom (CLAUDE.md `data/`) — az
 * adatbázis csak azt tárolja, melyik kulcsot végezte el a gyerek.
 *
 * A négy gyakorlat a **logopédus feladatlapjáról** való
 * (`docs/legzogyakorlatok-2026-08-26.md`), nem mi találtuk ki őket. Ugyanaz a
 * szabály él rájuk, mint a doboz légzés 4-4-4-4 ritmusára: a paramétereiket
 * (ismétlésszám, másodpercek, szótagsorok) engedély nélkül nem variáljuk.
 *
 * **A lista csak azokat a gyakorlatokat tartalmazza, amelyeknek már van
 * képernyője** — így minden commit önmagában működik.
 */
import type Ionicons from '@expo/vector-icons/Ionicons';
import type { Href } from 'expo-router';
import type { ComponentProps } from 'react';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

/** Ez kerül a `breathing_sessions.exercise_key`-be (D-057). */
export type ExerciseKey = 'box' | 'nose-mouth' | 'weekdays' | 'syllables';

export type Exercise = {
  key: ExerciseKey;
  /** Rövid, gyerekbarát cím a kártyán. */
  title: string;
  /** Egy sor arról, mi történik — a gyerek nem olvas sokat. */
  subtitle: string;
  icon: IoniconName;
  /** Ide navigál a kártya. */
  route: Href;
};

export const exercises: readonly Exercise[] = [
  {
    key: 'box',
    title: 'Doboz légzés',
    subtitle: 'Be – tartsd – ki – tartsd, a dobozzal együtt',
    icon: 'square-outline',
    route: '/session',
  },
  {
    key: 'nose-mouth',
    title: 'Orr és száj',
    subtitle: 'Négyféle be- és kilégzés, sorban',
    icon: 'swap-horizontal-outline',
    route: '/exercises/nose-mouth',
  },
  {
    key: 'weekdays',
    title: 'A hét napjai',
    subtitle: 'Egy levegővel, elejétől a végéig',
    icon: 'calendar-outline',
    route: '/exercises/one-breath?key=weekdays',
  },
  {
    key: 'syllables',
    title: 'Szótagok',
    subtitle: 'Pá-pá-pá, bá-bá-bá — egy levegővel',
    icon: 'chatbubbles-outline',
    route: '/exercises/one-breath?key=syllables',
  },
] as const;
