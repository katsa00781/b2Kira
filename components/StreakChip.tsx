import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
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
      <Text className="font-baloo-extrabold text-[14px] text-text-heading">{days}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    boxShadow: shadows.chip,
  },
  diamond: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.amber['500'],
    transform: [{ rotate: '45deg' }],
  },
});
