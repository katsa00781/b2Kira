import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import type { Sticker } from '@/data/stickers';

type StickerCelebrationProps = {
  sticker: Sticker;
  /** Az animáció végén hívjuk — ekkor törlődik a `justUnlocked` a store-ból. */
  onDone: () => void;
};

/** Megjelenés, kitartás, eltűnés — összesen ennyi ideig látszik. */
const FADE_MS = 260;
const HOLD_MS = 2600;

/**
 * Rövid ünneplés egy új matrica feloldásakor, a kezdőképernyő tetején.
 *
 * Nem modal és nem kér érintést (CLAUDE.md: „ne legyen tolakodó modal”) —
 * magától megjelenik, kivár, majd eltűnik. A gyerek közben bármit csinálhat.
 */
export function StickerCelebration({ sticker, onDone }: StickerCelebrationProps) {
  const progress = useSharedValue(0);

  // Halványodás és egy apró felfelé csúszás.
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -8 }],
  }));

  useEffect(() => {
    progress.value = withSequence(
      withTiming(1, { duration: FADE_MS, easing: Easing.out(Easing.quad) }),
      withDelay(HOLD_MS, withTiming(0, { duration: FADE_MS, easing: Easing.in(Easing.quad) }))
    );

    const timer = setTimeout(onDone, FADE_MS + HOLD_MS + FADE_MS);
    return () => clearTimeout(timer);
  }, [progress, onDone]);

  return (
    <Animated.View pointerEvents="none" style={[styles.wrapper, fadeStyle]}>
      <View accessibilityRole="alert" style={styles.card}>
        <LinearGradient
          colors={sticker.colors}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.badge}
        >
          <Ionicons name={sticker.icon} size={s(20)} color={sticker.iconColor} />
        </LinearGradient>

        <View style={styles.texts}>
          <Text style={styles.title} className="font-baloo-extrabold text-text-heading">
            Új matrica: {sticker.name}!
          </Text>
          <Text style={styles.sub} className="font-nunito-semibold text-text-subtle">
            Bekerült a gyűjteményedbe 🎉
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

/** `linear-gradient(135deg, …)` = bal felső sarokból a jobb alsóba. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const styles = StyleSheet.create({
  wrapper: { marginTop: s(12) },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    backgroundColor: colors.white,
    borderRadius: s(18),
    padding: s(12),
    boxShadow: shadows.card,
  },
  badge: {
    width: s(36),
    height: s(36),
    borderRadius: s(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, gap: s(2) },
  title: { fontSize: s(14) },
  sub: { fontSize: s(12) },
});
