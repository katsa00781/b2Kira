import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { characterComponents } from '@/components/characters';
import { colors, phaseBoxColors } from '@/constants/colors';
import { s, uiScale } from '@/constants/layout';
import { phaseBoxShadows } from '@/constants/shadows';
import type { CharacterId } from '@/data/characters';

type BreathingBoxProps = {
  /** 0.55 – 1.00, a `useBreathingCycle` közös shared value-ja. */
  scale: SharedValue<number>;
  /**
   * 0–3, a doboz légzés fázisindexe: ez adja a doboz színét és árnyékát. Más
   * gyakorlat a mintája `colorPhase` leképezését adja át, hogy ne kelljen új
   * design értéket kitalálni (D-058).
   */
  phase: number;
  characterId: CharacterId;
};

/**
 * A gyakorlat közepe: statikus 220×220-as keret, benne az együtt lélegző
 * doboz és a karakter (`docs/design-tokens.md` – „A légzőgyakorlat animáció”).
 *
 * A doboz mérete, radiusa és a karakter nagyítása **ugyanabból** a shared
 * value-ból jön, ezért nem tudnak elcsúszni egymástól.
 */
export const BreathingBox = memo(function BreathingBox({
  scale,
  phase,
  characterId,
}: BreathingBoxProps) {
  const Character = characterComponents[characterId];

  // A worklet a lokális konstanst zárja be, nem a modul importját.
  const device = uiScale;

  // méret = 100 + scale * 100 → 155 … 200 (iPaden arányosan nagyobb),
  // a radius a méret 22%-a
  const boxStyle = useAnimatedStyle(() => {
    const size = (100 + scale.value * 100) * device;
    return { width: size, height: size, borderRadius: size * 0.22 };
  });

  // A légzés nagyítása és az eszköz nagyítása egymásra épül.
  const characterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * device }],
  }));

  return (
    <View style={styles.root}>
      <View style={styles.frame} />

      <Animated.View style={[styles.box, { boxShadow: phaseBoxShadows[phase] }, boxStyle]}>
        <LinearGradient
          colors={phaseBoxColors[phase]}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.boxFill}
        />
      </Animated.View>

      {/* A karakter a doboz fölött van, és ugyanazt a nagyítást kapja. */}
      <Animated.View style={[styles.character, characterStyle]}>
        <Character mood="breathing" scale={1} />
      </Animated.View>
    </View>
  );
});

/** `linear-gradient(135deg, …)` = bal felső sarokból a jobb alsóba. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const FRAME_SIZE = s(220);

const styles = StyleSheet.create({
  root: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    position: 'absolute',
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: s(36),
    borderWidth: s(6),
    borderColor: colors.green['50'],
  },
  box: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
  },
  boxFill: {
    width: '100%',
    height: '100%',
  },
  character: {
    zIndex: 2,
  },
});
