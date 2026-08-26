import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, gradients } from '@/constants/colors';
import { s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import type { Exercise } from '@/data/exercises';
import { usePressed } from '@/hooks/usePressed';

type ExerciseCardProps = {
  exercise: Exercise;
  onPress: () => void;
};

/**
 * Egy gyakorlat kártyája a választó képernyőn. A szintkártya
 * (`components/LevelCard.tsx`) formáját követi: fehér lap, 44×44-es lila
 * gradiens ikon, cím és egy soros magyarázat.
 */
export function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${exercise.title}. ${exercise.subtitle}`}
      onPress={onPress}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.card, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradients.levelBadge.colors}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={styles.badge}
      >
        <Ionicons name={exercise.icon} size={s(22)} color={colors.white} />
      </LinearGradient>

      <View style={styles.texts}>
        <Text style={styles.title} className="font-baloo-extrabold text-text-heading">
          {exercise.title}
        </Text>
        <Text style={styles.subtitle} className="font-nunito-semibold text-text-subtle">
          {exercise.subtitle}
        </Text>
      </View>

      <View style={styles.chevron} />
    </Pressable>
  );
}

/** `linear-gradient(135deg, …)` = bal felső sarokból a jobb alsóba. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    backgroundColor: colors.white,
    borderRadius: s(20),
    paddingVertical: s(16),
    paddingHorizontal: s(18),
    boxShadow: shadows.card,
  },
  badge: {
    width: s(44),
    height: s(44),
    borderRadius: s(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, gap: s(2) },
  title: { fontSize: s(14) },
  subtitle: { fontSize: s(12) },
  /** Jobbra mutató nyíl, a vissza gomb nyilának tükörképe. */
  chevron: {
    width: s(9),
    height: s(9),
    borderRightWidth: s(3),
    borderTopWidth: s(3),
    borderColor: colors.purple['400'],
    transform: [{ rotate: '45deg' }],
    marginRight: s(3),
  },
  pressed: { opacity: 0.85 },
});
