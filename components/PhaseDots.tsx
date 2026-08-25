import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { PHASE_COUNT, phaseLabels } from '@/data/phases';

type PhaseDotsProps = {
  /** 0–3, az aktuális fázis indexe. */
  phase: number;
};

/**
 * Négy pötty a doboz alatt, az aktív fázis kiemelve
 * (`00-teljes-canvas.html`, 4. képernyő).
 */
export function PhaseDots({ phase }: PhaseDotsProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`${phaseLabels[phase]} – ${phase + 1}. fázis a ${PHASE_COUNT}-ből`}
      style={styles.row}
    >
      {Array.from({ length: PHASE_COUNT }, (_, index) => (
        <View
          key={index}
          style={[styles.dot, index === phase ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: { backgroundColor: colors.green['700'] },
  dotInactive: { backgroundColor: colors.green['50'] },
});
