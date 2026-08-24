import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { shadows } from '@/constants/shadows';

type ToggleRowProps = {
  label: string;
  /** Egysoros magyarázat a címke alatt. */
  sub: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** A kártya utolsó sora alatt a designban nincs elválasztó vonal. */
  showDivider?: boolean;
};

/** A kapcsoló gombjának útja: 44 − 2×3 padding − 20 gomb = 18 px. */
const KNOB_TRAVEL = 18;
const DURATION = 200;

/**
 * Beállítás sor kapcsolóval (`00-teljes-canvas.html`, 6. képernyő).
 * A teljes sor érintésre reagál, nem csak a 44×26-os kapcsoló – így a
 * célterület bőven 44 pt fölött van.
 */
export function ToggleRow({
  label,
  sub,
  value,
  onValueChange,
  showDivider = true,
}: ToggleRowProps) {
  const on = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    on.value = withTiming(value ? 1 : 0, { duration: DURATION });
  }, [on, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      on.value,
      [0, 1],
      [colors.toggle.off, colors.purple['600']]
    ),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: on.value * KNOB_TRAVEL }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => [
        styles.row,
        showDivider && styles.divider,
        pressed && styles.pressed,
      ]}
    >
      <View className="gap-[2px]">
        <Text className="font-nunito-bold text-[14px] text-text-body">{label}</Text>
        <Text className="font-nunito-semibold text-[12px] text-text-subtle">{sub}</Text>
      </View>

      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.purple['75'],
  },
  pressed: { opacity: 0.7 },
  track: {
    width: 44,
    height: 26,
    borderRadius: 999,
    padding: 3,
    justifyContent: 'center',
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    boxShadow: shadows.knob,
  },
});
