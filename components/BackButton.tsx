import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { usePressed } from '@/hooks/usePressed';

type BackButtonProps = {
  onPress: () => void;
  /** A képernyő háttere szerint: lila képernyőn `purple`, zöldön `green`. */
  variant?: 'purple' | 'green';
};

/**
 * Fehér kör, benne balra mutató nyíl — ugyanaz a gomb, ami a matricagyűjtemény
 * és a gyakorlat képernyő tetején is ül (D-042). A gyakorlat-képernyőkön ez az
 * egyetlen kiút, mert a tab sáv rejtve van (D-025).
 */
export function BackButton({ onPress, variant = 'purple' }: BackButtonProps) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Vissza"
      hitSlop={5}
      onPress={onPress}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.button, variant === 'green' && styles.buttonGreen, pressed && styles.pressed]}
    >
      <View style={[styles.arrow, variant === 'green' && styles.arrowGreen]} />
    </Pressable>
  );
}

/** A gomb átmérője — a fejléc többi eleme is ehhez igazodik. */
export const BACK_BUTTON_SIZE = s(34);

const styles = StyleSheet.create({
  button: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: BACK_BUTTON_SIZE / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.chip,
  },
  buttonGreen: { boxShadow: shadows.backButton },
  arrow: {
    width: s(10),
    height: s(10),
    borderLeftWidth: s(3),
    borderBottomWidth: s(3),
    borderColor: colors.purple['600'],
    transform: [{ rotate: '45deg' }],
    marginLeft: s(3),
  },
  arrowGreen: { borderColor: colors.green['500'] },
  pressed: { opacity: 0.6 },
});
