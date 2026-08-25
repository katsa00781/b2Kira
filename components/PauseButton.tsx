import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';

import { gradients } from '@/constants/colors';
import { s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { usePressed } from '@/hooks/usePressed';

type PauseButtonProps = {
  paused: boolean;
  onPress: () => void;
};

/**
 * A gyakorlat képernyő alsó gombja (`00-teljes-canvas.html`, 4. képernyő).
 * Szünetben a felirat és a gradiens is vált. Kisebb, mint a `PrimaryButton`
 * (14 px padding, 15 px felirat), ezért külön komponens.
 */
export function PauseButton({ paused, onPress }: PauseButtonProps) {
  const { pressed, pressHandlers } = usePressed();
  const label = paused ? 'Folytatás' : 'Szünet';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.root, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={paused ? gradients.resumeButton.colors : gradients.pauseButton.colors}
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
    boxShadow: shadows.buttonPause,
  },
  fill: {
    borderRadius: 999,
    paddingVertical: s(14),
    paddingHorizontal: s(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: s(15) },
  pressed: { opacity: 0.85 },
});
