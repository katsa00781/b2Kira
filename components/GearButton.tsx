import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.chip,
  },
  pressed: { opacity: 0.6 },
  gear: { width: 16, height: 16 },
  ring: {
    position: 'absolute',
    top: 3,
    right: 3,
    bottom: 3,
    left: 3,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.text.muted,
  },
  tooth: {
    position: 'absolute',
    borderRadius: 1,
    backgroundColor: colors.text.muted,
  },
  toothVertical: { width: 3, height: 4, left: 6.5 },
  toothHorizontal: { width: 4, height: 3, top: 6.5 },
  toothTop: { top: -1 },
  toothBottom: { bottom: -1 },
  toothLeft: { left: -1 },
  toothRight: { right: -1 },
});
