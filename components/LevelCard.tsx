import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors, gradients } from '@/constants/colors';
import { s } from '@/constants/layout';
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
        <Text style={styles.title} className="font-baloo-extrabold text-text-heading">
          {level}. szint — {levelName}
        </Text>
        <Text style={styles.subtitle} className="font-nunito-semibold text-text-subtle">
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
    gap: s(12),
    backgroundColor: colors.white,
    borderRadius: s(20),
    paddingVertical: s(16),
    paddingHorizontal: s(18),
    boxShadow: shadows.card,
  },
  title: { fontSize: s(14) },
  subtitle: { fontSize: s(12) },
  badge: {
    width: s(44),
    height: s(44),
    borderRadius: s(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeBox: {
    width: s(18),
    height: s(18),
    borderRadius: s(6),
    borderWidth: s(3),
    borderColor: colors.white,
  },
  texts: { flex: 1, gap: s(2) },
});
