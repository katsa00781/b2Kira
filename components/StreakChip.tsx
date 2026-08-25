import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';

/**
 * Napi sorozat a kezdőképernyő fejlécében (`00-teljes-canvas.html`, 3. képernyő):
 * fehér pill, benne egy 45°-kal elforgatott narancs rombusz és a napok száma.
 */
export function StreakChip({ days }: { days: number }) {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${days} napos sorozat`}
      style={styles.chip}
    >
      <View style={styles.diamond} />
      <Text style={styles.days} className="font-baloo-extrabold text-text-heading">
        {days}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingVertical: s(6),
    paddingHorizontal: s(12),
    boxShadow: shadows.chip,
  },
  days: { fontSize: s(14) },
  diamond: {
    width: s(16),
    height: s(16),
    borderRadius: s(4),
    backgroundColor: colors.amber['500'],
    transform: [{ rotate: '45deg' }],
  },
});
