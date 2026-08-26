import { StyleSheet, Text, View } from 'react-native';

import { s } from '@/constants/layout';

type OneBreathSequenceProps = {
  items: readonly string[];
  /** Az aktuális sor indexe. */
  index: number;
};

/**
 * A szótagsorok egymás után, hogy a gyerek lássa, hol tart és mi jön
 * (`/exercises/one-breath?key=syllables`). Az aktuális sor nagyban és
 * kiemelve, előtte és utána két-két szomszéd halványan.
 *
 * Csak ablakot mutat, nem a teljes tíz sort: így a magassága állandó, és
 * kisebb telefonon (iPhone SE) sem tolja ki a dobozt a képernyőről.
 */
export function OneBreathSequence({ items, index }: OneBreathSequenceProps) {
  // Az ablak mindig ugyanannyi sor, a lista elején és végén is — ezért a
  // kezdőpontot betoljuk, ahelyett hogy egyszerűen `index - NEIGHBOURS` lenne.
  const start = Math.max(0, Math.min(index - NEIGHBOURS, items.length - WINDOW));
  const window = items.slice(start, start + WINDOW);

  return (
    <View style={styles.list}>
      {window.map((item, offset) => {
        const position = start + offset;
        const current = position === index;

        return (
          <Text
            key={position}
            numberOfLines={1}
            style={[styles.row, current ? styles.current : styles.other]}
            className={
              current
                ? 'text-center font-baloo-extrabold text-text-heading'
                : 'text-center font-nunito-semibold text-text-subtle'
            }
          >
            {item}
          </Text>
        );
      })}
    </View>
  );
}

/** Hány szomszéd látszik az aktuális sor előtt és után. */
const NEIGHBOURS = 2;
const WINDOW = NEIGHBOURS * 2 + 1;

const styles = StyleSheet.create({
  list: { alignSelf: 'stretch', gap: s(2) },
  row: { width: '100%' },
  current: { fontSize: s(24), lineHeight: s(32) },
  other: { fontSize: s(14), lineHeight: s(22) },
});
