import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors, gradients } from '@/constants/colors';
import { shadows } from '@/constants/shadows';

type LevelCardProps = {
  level: number;
  levelName: string;
  /** Hány gyakorlat van meg a következő matricáig szükséges `goal`-ból. */
  done: number;
  goal: number;
};

/**
 * Szintkártya a kezdőképernyőn (`00-teljes-canvas.html`, 3. képernyő):
 * fehér kártya, 44×44-es lila gradiens ikon, szint és a matricáig hátralévő út.
 */
export function LevelCard({ level, levelName, done, goal }: LevelCardProps) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradients.levelBadge.colors}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={styles.badge}
      >
        <View style={styles.badgeBox} />
      </LinearGradient>

      <View style={styles.texts}>
        <Text className="font-baloo-extrabold text-[14px] text-text-heading">
          {level}. szint — {levelName}
        </Text>
        <Text className="font-nunito-semibold text-[12px] text-text-subtle">
          {done}/{goal} gyakorlat a következő matricáig
        </Text>
      </View>
    </View>
  );
}

/** `linear-gradient(135deg, …)` = bal felső sarokból a jobb alsóba. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    boxShadow: shadows.card,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeBox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: colors.white,
  },
  texts: { flex: 1, gap: 2 },
});
