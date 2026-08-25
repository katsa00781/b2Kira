import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import type { Sticker } from '@/data/stickers';

type StickerTileProps = {
  /** `null` = zárolt slot: lakat, tömör lila háttér, „Zárolva” felirat. */
  sticker: Sticker | null;
};

/**
 * Egy csempe a 3×3-as matricarácsból (`00-teljes-canvas.html`, 5. képernyő):
 * négyzetes kártya 20-as radiusszal, benne az ikon, alatta a név.
 *
 * A designban az alakok CSS-ből épülnek (`clip-path` is), amit a React Native
 * nem tud — ezért `@expo/vector-icons` ikonok. Lásd D-041.
 */
export function StickerTile({ sticker }: StickerTileProps) {
  const locked = sticker === null;

  return (
    <View style={styles.root}>
      <View
        accessibilityRole="image"
        accessibilityLabel={locked ? 'Zárolt matrica' : `${sticker.name} matrica, megvan`}
        style={[styles.tile, locked ? styles.tileLocked : styles.tileEarned]}
      >
        {locked ? (
          <Ionicons name="lock-closed" size={s(22)} color={colors.lock.shape} style={styles.lock} />
        ) : (
          <LinearGradient
            colors={sticker.colors}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={styles.fill}
          >
            <Ionicons name={sticker.icon} size={s(sticker.iconSize)} color={sticker.iconColor} />
          </LinearGradient>
        )}
      </View>

      <Text
        numberOfLines={1}
        style={[styles.label, locked ? styles.labelLocked : styles.labelEarned]}
        className="text-center font-nunito-bold"
      >
        {locked ? 'Zárolva' : sticker.name}
      </Text>
    </View>
  );
}

/** `linear-gradient(135deg, …)` = bal felső sarokból a jobb alsóba. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: s(6) },
  tile: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: s(20),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** A zárolt csempének a designban nincs árnyéka. */
  tileLocked: { backgroundColor: colors.lock.bg },
  tileEarned: { boxShadow: shadows.sticker },
  fill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lock: { opacity: 0.6 },
  label: { fontSize: s(11) },
  labelEarned: { color: colors.text.subtle },
  labelLocked: { color: colors.lock.text },
});
