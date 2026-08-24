import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors, gradients } from '@/constants/colors';

export type ProgressBarVariant = 'purple' | 'green';

type ProgressBarProps = {
  /** 0 és 1 közötti kitöltöttség. A kívül eső értékeket levágja. */
  progress: number;
  /** `purple` – kezdőképernyő szintkártya; `green` – gyakorlat session sávja. */
  variant?: ProgressBarVariant;
};

/**
 * 8 px magas pill alakú sáv, 90°-os gradiens kitöltéssel
 * (`00-teljes-canvas.html`, 3. és 4. képernyő).
 */
export function ProgressBar({ progress, variant = 'purple' }: ProgressBarProps) {
  const filled = Math.min(1, Math.max(0, progress));
  const isPurple = variant === 'purple';
  const gradient = isPurple ? gradients.levelProgress : gradients.sessionProgress;

  return (
    <View style={[styles.track, isPurple ? styles.trackPurple : styles.trackGreen]}>
      <LinearGradient
        colors={gradient.colors}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={[styles.fill, { width: `${filled * 100}%` }]}
      />
    </View>
  );
}

/** `linear-gradient(90deg, …)` = balról jobbra. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 0 } as const;

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  trackPurple: { backgroundColor: colors.purple['150'] },
  trackGreen: { backgroundColor: colors.green['50'] },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
