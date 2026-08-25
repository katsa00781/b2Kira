import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';

type Twinkle = {
  top: number;
  left?: number;
  right?: number;
  size: number;
  color: string;
  /** Egy teljes oda-vissza ciklus hossza ms-ban (a CSS `twinkle` animációból). */
  duration: number;
  delay: number;
};

/**
 * A pöttyök pozíciója képernyőnként más, ezért itt van preset-be szedve.
 * Az értékek a design telefonméretében vannak; a nagyítás renderkor történik
 * (`00-teljes-canvas.html`, 1. és 3. képernyő). A `twinkle` keyframe
 * 0.35 → 1 → 0.35 opacitás, ezért a félidő animálódik oda-vissza.
 */
const PRESETS = {
  login: [
    {
      top: 70,
      right: 34,
      size: 12,
      color: colors.amber['400'],
      duration: 2400,
      delay: 0,
    },
    {
      top: 140,
      left: 28,
      size: 9,
      color: colors.green['300'],
      duration: 3000,
      delay: 500,
    },
  ],
  home: [
    {
      top: 60,
      right: 30,
      size: 14,
      color: colors.amber['400'],
      duration: 2400,
      delay: 0,
    },
    {
      top: 120,
      left: 24,
      size: 10,
      color: colors.green['300'],
      duration: 3000,
      delay: 500,
    },
    {
      top: 40,
      left: 120,
      size: 8,
      color: colors.pink['300'],
      duration: 2000,
      delay: 1000,
    },
  ],
} as const satisfies Record<string, readonly Twinkle[]>;

export type TwinklesVariant = keyof typeof PRESETS;

const MIN_OPACITY = 0.35;

/**
 * Animált díszpöttyök a lila képernyők hátterében. Nem fog el érintést,
 * a képernyő gyökeréhez képest abszolút pozicionált.
 */
export function Twinkles({ variant }: { variant: TwinklesVariant }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {PRESETS[variant].map((twinkle, index) => (
        <TwinkleDot key={index} twinkle={twinkle} />
      ))}
    </View>
  );
}

function TwinkleDot({ twinkle }: { twinkle: Twinkle }) {
  const opacity = useSharedValue(MIN_OPACITY);

  useEffect(() => {
    opacity.value = withDelay(
      twinkle.delay,
      withRepeat(
        withTiming(1, {
          duration: twinkle.duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, [opacity, twinkle.delay, twinkle.duration]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          top: s(twinkle.top),
          left: twinkle.left === undefined ? undefined : s(twinkle.left),
          right: twinkle.right === undefined ? undefined : s(twinkle.right),
          width: s(twinkle.size),
          height: s(twinkle.size),
          borderRadius: s(twinkle.size) / 2,
          backgroundColor: twinkle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: { position: 'absolute' },
});
