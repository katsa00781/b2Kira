import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

import { CHARACTER_SIZE, type CharacterProps } from './types';

/**
 * Nyuszi karakter. A geometria a `design-reference/Bunny.html`-ből származik,
 * 1:1-ben. A HTML `content-box` méretezést használ, ezért a keretes elemeknél
 * a méret itt a kerettel együtt szerepel (pl. 22+3+3 = 28). Lásd D-009.
 */
export function Bunny({ scale }: CharacterProps) {
  return (
    <View style={[styles.root, { transform: [{ scale }] }]}>
      <View style={[styles.ear, styles.earLeft]}>
        <View style={styles.earInner} />
      </View>
      <View style={[styles.ear, styles.earRight]}>
        <View style={styles.earInner} />
      </View>

      <View style={styles.head} />

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

const c = colors.character.bunny;

const styles = StyleSheet.create({
  root: {
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE,
  },
  ear: {
    position: 'absolute',
    top: -38,
    width: 28,
    height: 50,
    backgroundColor: c.fur,
    borderWidth: 3,
    borderColor: c.outline,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  earLeft: {
    left: 6,
    transform: [{ rotate: '-14deg' }],
  },
  earRight: {
    right: 6,
    transform: [{ rotate: '14deg' }],
  },
  earInner: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 7,
    right: 7,
    backgroundColor: c.inner,
    borderRadius: 10,
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
    width: 16,
    height: 12,
    backgroundColor: c.cheek,
    borderRadius: '50%',
    opacity: 0.8,
  },
  cheekLeft: { left: 6 },
  cheekRight: { right: 6 },
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
