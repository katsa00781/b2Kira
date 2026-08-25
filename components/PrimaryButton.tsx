import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';

import { gradients } from '@/constants/colors';
import { s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { usePressed } from '@/hooks/usePressed';

export type PrimaryButtonVariant = 'purple' | 'green';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  /** `purple` – bejelentkezés és CTA; `green` – regisztráció. */
  variant?: PrimaryButtonVariant;
  disabled?: boolean;
};

/**
 * A design elsődleges gombja (`00-teljes-canvas.html`, 1. és 2. képernyő):
 * teljes szélesség, pill forma, 135°-os gradiens, színenkénti árnyék.
 */
export function PrimaryButton({
  label,
  onPress,
  variant = 'purple',
  disabled = false,
}: PrimaryButtonProps) {
  const gradient = variant === 'purple' ? gradients.primaryButton : gradients.greenButton;
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[
        styles.root,
        variant === 'purple' ? styles.shadowPurple : styles.shadowGreen,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={gradient.colors}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={styles.fill}
      >
        <Text style={styles.label} className="text-center font-baloo-extrabold text-white">
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

/** `linear-gradient(135deg, …)` = bal felső sarokból a jobb alsóba. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    borderRadius: 999,
  },
  fill: {
    borderRadius: 999,
    paddingVertical: s(16),
    paddingHorizontal: s(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: s(17) },
  shadowPurple: { boxShadow: shadows.buttonPurple },
  shadowGreen: { boxShadow: shadows.buttonGreen },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
