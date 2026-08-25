import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';
import { usePressed } from '@/hooks/usePressed';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** A négyzet melletti szöveg, két sorig. */
  label: string;
};

/** 18×18 a designból (`00-teljes-canvas.html`, 2. képernyő). */
const BOX_SIZE = s(18);

/**
 * Pipálható négyzet a regisztrációhoz. A designban csak a bepipált állapot
 * szerepel (tömör zöld), az üres állapot fehér + halvány lila keret — lásd D-020.
 * A teljes sor érintésre reagál, így a célterület 44 pt fölött van (D-017).
 */
export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8 }}
      onPress={() => onChange(!checked)}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.box, checked ? styles.boxChecked : styles.boxEmpty]}>
        {checked ? <Ionicons name="checkmark" size={s(13)} color={colors.white} /> : null}
      </View>
      <Text style={styles.label} className="flex-1 font-nunito-semibold text-text-label">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
  },
  label: { fontSize: s(12) },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: s(6),
    marginTop: s(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxEmpty: {
    backgroundColor: colors.white,
    borderWidth: s(2),
    borderColor: colors.toggle.off,
  },
  boxChecked: {
    backgroundColor: colors.green['500'],
  },
  pressed: { opacity: 0.7 },
});
