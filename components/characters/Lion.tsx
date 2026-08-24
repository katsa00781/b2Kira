import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

import { CHARACTER_SIZE, type CharacterProps } from './types';

/** A sörény cikkelyeinek elfordulása – 4 sötét cikkely 45°-onként. Lásd D-010. */
const MANE_WEDGES = ['0deg', '90deg', '180deg', '270deg'] as const;

/**
 * Oroszlán karakter. A geometria a `design-reference/Lion.html`-ből származik.
 * A sörény ott `conic-gradient`, amire a React Native-nek nincs megfelelője —
 * itt négy elforgatott cikkely adja ki ugyanazt a váltakozó mintát (D-010).
 */
export function Lion({ scale }: CharacterProps) {
  return (
    <View style={[styles.root, { transform: [{ scale }] }]}>
      <View style={styles.mane}>
        {MANE_WEDGES.map((rotate) => (
          <View
            key={rotate}
            style={[styles.wedgeLayer, { transform: [{ rotate }, { skewY: '45deg' }] }]}
          >
            <View style={styles.wedge} />
          </View>
        ))}
      </View>

      <View style={styles.head} />
      <View style={[styles.ear, styles.earLeft]} />
      <View style={[styles.ear, styles.earRight]} />

      <View style={[styles.eye, styles.eyeLeft]} />
      <View style={[styles.eye, styles.eyeRight]} />
      <View style={[styles.cheek, styles.cheekLeft]} />
      <View style={[styles.cheek, styles.cheekRight]} />

      <View style={styles.nose} />
      <View style={styles.philtrum} />
      <View style={[styles.mouth, styles.mouthLeft]} />
      <View style={[styles.mouth, styles.mouthRight]} />
    </View>
  );
}

const c = colors.character.lion;

/** A sörény köre: `inset:-18px` a 90×90-es dobozon → 126×126. */
const MANE_SIZE = CHARACTER_SIZE + 36;

const styles = StyleSheet.create({
  root: {
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE,
  },
  mane: {
    position: 'absolute',
    top: -18,
    left: -18,
    width: MANE_SIZE,
    height: MANE_SIZE,
    backgroundColor: c.outline,
    borderRadius: MANE_SIZE / 2,
    overflow: 'hidden',
  },
  wedgeLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MANE_SIZE,
    height: MANE_SIZE,
  },
  wedge: {
    position: 'absolute',
    top: MANE_SIZE / 2,
    left: MANE_SIZE / 2,
    width: MANE_SIZE / 2,
    height: MANE_SIZE / 2,
    backgroundColor: c.maneDark,
  },
  head: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: c.fur,
    borderWidth: 3,
    borderColor: c.outline,
    borderRadius: CHARACTER_SIZE / 2,
    boxShadow: `0 6px 14px ${c.shadow}`,
  },
  ear: {
    position: 'absolute',
    top: -12,
    width: 26,
    height: 26,
    backgroundColor: c.fur,
    borderWidth: 3,
    borderColor: c.outline,
    borderRadius: 13,
  },
  earLeft: { left: 6 },
  earRight: { right: 6 },
  eye: {
    position: 'absolute',
    top: 32,
    width: 11,
    height: 11,
    backgroundColor: c.eye,
    borderRadius: 5.5,
  },
  eyeLeft: { left: 16 },
  eyeRight: { right: 16 },
  cheek: {
    position: 'absolute',
    top: 38,
    width: 14,
    height: 11,
    backgroundColor: c.cheek,
    borderRadius: '50%',
    opacity: 0.9,
  },
  cheekLeft: { left: 8 },
  cheekRight: { right: 8 },
  nose: {
    position: 'absolute',
    top: 46,
    left: 41,
    width: 8,
    height: 6,
    backgroundColor: c.nose,
    borderRadius: '50%',
  },
  philtrum: {
    position: 'absolute',
    top: 53,
    left: 45,
    width: 2,
    height: 8,
    backgroundColor: c.line,
  },
  mouth: {
    position: 'absolute',
    top: 59,
    width: 10,
    height: 8.5,
    borderBottomWidth: 2.5,
    borderBottomColor: c.line,
    borderBottomLeftRadius: '50%',
    borderBottomRightRadius: '50%',
  },
  mouthLeft: { left: 33 },
  mouthRight: { left: 47 },
});
