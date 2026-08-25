import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { usePressed } from '@/hooks/usePressed';

/**
 * A kezdőképernyő fogaskerék gombja (`00-teljes-canvas.html`, 3. képernyő):
 * 34×34 fehér kör, benne egy körvonalból és négy kis nyúlványból rajzolt
 * fogaskerék. Kép asset nincs hozzá, a design is CSS-ből rajzolja.
 */
export function GearButton({ onPress }: { onPress?: () => void }) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Szülői beállítások"
      disabled={!onPress}
      hitSlop={5}
      onPress={onPress}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.button, pressed && styles.pressed]}
    >
      <View style={styles.gear}>
        <View style={styles.ring} />
        <View style={[styles.tooth, styles.toothVertical, styles.toothTop]} />
        <View style={[styles.tooth, styles.toothVertical, styles.toothBottom]} />
        <View style={[styles.tooth, styles.toothHorizontal, styles.toothLeft]} />
        <View style={[styles.tooth, styles.toothHorizontal, styles.toothRight]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: s(34),
    height: s(34),
    borderRadius: s(34) / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.chip,
  },
  pressed: { opacity: 0.6 },
  gear: { width: s(16), height: s(16) },
  ring: {
    position: 'absolute',
    top: s(3),
    right: s(3),
    bottom: s(3),
    left: s(3),
    borderRadius: s(5),
    borderWidth: s(2),
    borderColor: colors.text.muted,
  },
  tooth: {
    position: 'absolute',
    borderRadius: s(1),
    backgroundColor: colors.text.muted,
  },
  toothVertical: { width: s(3), height: s(4), left: s(6.5) },
  toothHorizontal: { width: s(4), height: s(3), top: s(6.5) },
  toothTop: { top: -s(1) },
  toothBottom: { bottom: -s(1) },
  toothLeft: { left: -s(1) },
  toothRight: { right: -s(1) },
});
