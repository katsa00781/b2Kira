import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

import { CHARACTER_SIZE, type CharacterProps } from './types';

/**
 * Panda karakter. A geometria a `design-reference/Panda.html`-ből származik,
 * 1:1-ben. Lásd D-009 a méret- és árnyékkonverzióról.
 */
export function Panda({ scale }: CharacterProps) {
  return (
    <View style={[styles.root, { transform: [{ scale }] }]}>
      <View style={[styles.ear, styles.earLeft]} />
      <View style={[styles.ear, styles.earRight]} />

      <View style={styles.head} />

      <View style={[styles.patch, styles.patchLeft]} />
      <View style={[styles.patch, styles.patchRight]} />
      <View style={[styles.eye, styles.eyeLeft]} />
      <View style={[styles.eye, styles.eyeRight]} />

      <View style={styles.nose} />
      <View style={styles.philtrum} />
      <View style={[styles.mouth, styles.mouthLeft]} />
      <View style={[styles.mouth, styles.mouthRight]} />
    </View>
  );
}

const c = colors.character.panda;

const styles = StyleSheet.create({
  root: {
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE,
  },
  ear: {
    position: 'absolute',
    top: -14,
    width: 30,
    height: 30,
    backgroundColor: c.patch,
    borderRadius: 15,
  },
  earLeft: { left: -4 },
  earRight: { right: -4 },
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
  patch: {
    position: 'absolute',
    top: 24,
    width: 22,
    height: 26,
    backgroundColor: c.patch,
    borderRadius: '50%',
  },
  patchLeft: {
    left: 10,
    transform: [{ rotate: '-8deg' }],
  },
  patchRight: {
    right: 10,
    transform: [{ rotate: '8deg' }],
  },
  eye: {
    position: 'absolute',
    top: 34,
    width: 9,
    height: 9,
    backgroundColor: c.eye,
    borderRadius: 4.5,
  },
  eyeLeft: { left: 17 },
  eyeRight: { right: 17 },
  nose: {
    position: 'absolute',
    top: 46,
    left: 41,
    width: 8,
    height: 6,
    backgroundColor: c.patch,
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
