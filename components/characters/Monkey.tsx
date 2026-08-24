import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

import { CHARACTER_SIZE, type CharacterProps } from './types';

/**
 * Majom karakter. A geometria a `design-reference/Monkey.html`-ből származik,
 * 1:1-ben. A fülek keretével együtt 26+6 = 32 szélesek. Lásd D-009.
 */
export function Monkey({ scale }: CharacterProps) {
  return (
    <View style={[styles.root, { transform: [{ scale }] }]}>
      <View style={[styles.ear, styles.earLeft]} />
      <View style={[styles.ear, styles.earRight]} />

      <View style={styles.head} />
      <View style={styles.muzzle} />

      <View style={[styles.eye, styles.eyeLeft]} />
      <View style={[styles.eye, styles.eyeRight]} />

      <View style={styles.nose} />
      <View style={[styles.mouth, styles.mouthLeft]} />
      <View style={[styles.mouth, styles.mouthRight]} />
    </View>
  );
}

const c = colors.character.monkey;

const styles = StyleSheet.create({
  root: {
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE,
  },
  ear: {
    position: 'absolute',
    top: 20,
    width: 32,
    height: 36,
    backgroundColor: c.fur,
    borderWidth: 3,
    borderColor: c.outline,
    borderRadius: '50%',
  },
  earLeft: { left: -16 },
  earRight: { right: -16 },
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
  muzzle: {
    position: 'absolute',
    top: 20,
    left: 14,
    width: 62,
    height: 52,
    backgroundColor: c.muzzle,
    borderTopLeftRadius: '50%',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '46%',
    borderBottomLeftRadius: '46%',
  },
  eye: {
    position: 'absolute',
    top: 32,
    width: 11,
    height: 11,
    backgroundColor: c.eye,
    borderRadius: 5.5,
  },
  eyeLeft: { left: 24 },
  eyeRight: { right: 24 },
  nose: {
    position: 'absolute',
    top: 47,
    left: 41,
    width: 8,
    height: 6,
    backgroundColor: c.nose,
    borderRadius: '50%',
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
