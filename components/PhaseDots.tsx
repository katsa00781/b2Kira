import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';
import { PHASE_COUNT, phaseLabels } from '@/data/phases';

type PhaseDotsProps = {
  /** Az aktuális fázis indexe. */
  phase: number;
  /** Hány fázisból áll a minta. Alapértelmezésben a doboz légzés négye. */
  count?: number;
  /** Az aktuális fázis felirata a képernyőolvasónak. */
  label?: string;
};

/**
 * Pöttyök a doboz alatt, az aktív fázis kiemelve
 * (`00-teljes-canvas.html`, 4. képernyő). A doboz légzésnél négy, más
 * gyakorlatnál annyi, ahány fázisa van a mintának.
 */
export function PhaseDots({ phase, count = PHASE_COUNT, label }: PhaseDotsProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`${label ?? phaseLabels[phase]} – ${phase + 1}. fázis a ${count}-ből`}
      style={styles.row}
    >
      {Array.from({ length: count }, (_, index) => (
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
    gap: s(8),
  },
  dot: {
    width: s(10),
    height: s(10),
    borderRadius: s(10) / 2,
  },
  dotActive: { backgroundColor: colors.green['700'] },
  dotInactive: { backgroundColor: colors.green['50'] },
});
