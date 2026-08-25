import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StickerTile } from '@/components/StickerTile';
import { colors } from '@/constants/colors';
import { contentMaxWidth, s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { SESSIONS_PER_LEVEL } from '@/data/levels';
import { STICKER_COUNT, nextSticker, stickers, unlockedCount } from '@/data/stickers';
import { usePressed } from '@/hooks/usePressed';
import { activeStreakDays, useChildStore } from '@/store/useChildStore';

/**
 * Matricagyűjtemény (`00-teljes-canvas.html`, 5. képernyő): 3×3 rács, fölötte a
 * napi sorozat, alatta a következő matrica kártyája.
 *
 * A designban nincs vissza gomb — mivel a tab sáv rejtve van (D-025), a
 * gyereknek enélkül nem lenne útja vissza, ezért felkerült egy (D-042).
 */
export default function StickersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { pressed, pressHandlers } = usePressed();

  // 3 egyenlő oszlop, 14-es közökkel (design). A tartalom szélessége adott,
  // ezért kiszámolható — `onLayout`-tal egy képkockányit ugrálna a lap.
  const columnWidth =
    (Math.min(width, contentMaxWidth ?? width) - 2 * SCREEN_PADDING - 2 * GRID_GAP) / 3;

  const completedSessions = useChildStore((state) => state.completedSessions);
  const streakDays = useChildStore((state) => state.streakDays);
  const lastSessionDate = useChildStore((state) => state.lastSessionDate);

  const earned = unlockedCount(completedSessions, SESSIONS_PER_LEVEL);
  const streak = activeStreakDays({ streakDays, lastSessionDate });
  const next = nextSticker(completedSessions, SESSIONS_PER_LEVEL);
  const remaining = SESSIONS_PER_LEVEL - (completedSessions % SESSIONS_PER_LEVEL);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vissza"
            hitSlop={5}
            onPress={() => router.back()}
            {...pressHandlers}
            // A `style` itt nem lehet függvény — lásd D-026.
            style={[styles.backButton, pressed && styles.pressed]}
          >
            <View style={styles.backArrow} />
          </Pressable>

          <Text style={styles.title} className="font-baloo-extrabold text-text-heading">
            Matricagyűjteményem
          </Text>
        </View>

        <View style={styles.streakRow}>
          <LinearGradient
            colors={STREAK_GRADIENT}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={styles.streakDiamond}
          />
          <Text style={styles.streakLabel} className="font-nunito-bold text-text-subtle">
            {streakLabel(streak)}
          </Text>
        </View>

        <View style={styles.grid}>
          {stickers.map((sticker, index) => (
            <View key={sticker.key} style={{ width: columnWidth }}>
              <StickerTile sticker={index < earned ? sticker : null} />
            </View>
          ))}
        </View>

        <View style={styles.nextCard}>
          <LinearGradient
            colors={NEXT_BADGE_GRADIENT}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={styles.nextBadge}
          />
          <View style={styles.nextTexts}>
            <Text style={styles.nextTitle} className="font-baloo-extrabold text-text-heading">
              {next ? `Következő jelvény: ${next.name}` : 'Minden matrica megvan!'}
            </Text>
            <Text style={styles.nextSub} className="font-nunito-semibold text-text-subtle">
              {next
                ? `Még ${remaining} gyakorlat kell hozzá`
                : `Mind a ${STICKER_COUNT} összegyűlt — szuper vagy!`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/** A sorozat felirata. 0 napnál a design szövege bátorításnak nem működne. */
function streakLabel(streak: number): string {
  return streak === 0
    ? 'Kezdj új sorozatot ma!'
    : `${streak} napos sorozat — ne hagyd abba!`;
}

/** `linear-gradient(135deg, …)` = bal felső sarokból a jobb alsóba. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const STREAK_GRADIENT = [colors.amber['500'], colors.pink['500']] as const;
const NEXT_BADGE_GRADIENT = [colors.green['300'], colors.green['400']] as const;

/** A design keretében a tartalom 62 / 22 / 28 px-re van a képernyő szélétől. */
const BOTTOM_PADDING = s(28);
const SCREEN_PADDING = s(22);
/** `grid-template-columns:repeat(3,1fr); gap:14px` a designból. */
const GRID_GAP = s(14);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.screen.stickers },
  content: {
    flexGrow: 1,
    // iPaden középre igazított, korlátozott szélességű oszlop (D-035).
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    paddingTop: s(62),
    paddingHorizontal: SCREEN_PADDING,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  title: { flexShrink: 1, fontSize: s(22) },
  backButton: {
    width: s(34),
    height: s(34),
    borderRadius: s(34) / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.chip,
  },
  backArrow: {
    width: s(10),
    height: s(10),
    borderLeftWidth: s(3),
    borderBottomWidth: s(3),
    borderColor: colors.purple['600'],
    transform: [{ rotate: '45deg' }],
    marginLeft: s(3),
  },
  pressed: { opacity: 0.6 },

  streakRow: {
    marginTop: s(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  streakDiamond: {
    width: s(22),
    height: s(22),
    borderRadius: s(6),
    transform: [{ rotate: '45deg' }],
  },
  streakLabel: { flexShrink: 1, fontSize: s(13) },

  grid: {
    marginTop: s(20),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },

  nextCard: {
    marginTop: s(24),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    backgroundColor: colors.white,
    borderRadius: s(18),
    padding: s(16),
    boxShadow: shadows.card,
  },
  nextBadge: {
    width: s(40),
    height: s(40),
    borderRadius: s(40) / 2,
  },
  nextTexts: { flex: 1, gap: s(2) },
  nextTitle: { fontSize: s(13) },
  nextSub: { fontSize: s(12) },
});
