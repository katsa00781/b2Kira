import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';

import { gradients } from '@/constants/colors';
import { shadows } from '@/constants/shadows';

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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
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
        <Text className="text-center font-baloo-extrabold text-[17px] text-white">{label}</Text>
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowPurple: { boxShadow: shadows.buttonPurple },
  shadowGreen: { boxShadow: shadows.buttonGreen },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
