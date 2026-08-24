/**
 * FEJLESZTŐI SEGÉDKÉPERNYŐ – nem része a késznek szánt appnak.
 * A négy karaktert mutatja egyszerre, állítható `scale` és `mood` mellett,
 * hogy a geometria éles eszközön ellenőrizhető legyen.
 * Ship előtt törlendő (lásd `docs/feature-tasks.md` – „Ship előtt").
 */
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { characterComponents } from '@/components/characters';
import type { CharacterMood } from '@/components/characters';
import { colors } from '@/constants/colors';
import { usePressed } from '@/hooks/usePressed';
import { characters } from '@/data/characters';

const MIN_SCALE = 0.5;
const MAX_SCALE = 1.5;
const STEP = 0.05;

/** A légzésanimáció két szélső értéke – ezeket látja a gyerek a gyakorlaton. */
const PRESETS = [0.55, 1] as const;

export default function ScratchCharactersScreen() {
  const [scale, setScale] = useState(1);
  const [mood, setMood] = useState<CharacterMood>('happy');

  const step = (delta: number) => {
    const next = Math.round((scale + delta) * 100) / 100;
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, next)));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View className="flex-1 px-[22px] pb-[28px]">
        <Link href="/" className="py-2">
          <Text className="font-nunito-bold text-[13px] text-text-muted">← Vissza</Text>
        </Link>

        <Text className="font-baloo-extrabold text-[22px] text-text-heading">
          Karakter teszt
        </Text>

        <View className="mt-[14px] flex-row items-center gap-[10px]">
          <ControlButton label="−" onPress={() => step(-STEP)} />
          <Text className="font-baloo-extrabold text-[17px] text-text-heading">
            {scale.toFixed(2)}
          </Text>
          <ControlButton label="+" onPress={() => step(STEP)} />
          {PRESETS.map((preset) => (
            <ControlButton
              key={preset}
              label={preset.toFixed(2)}
              active={scale === preset}
              onPress={() => setScale(preset)}
            />
          ))}
          <ControlButton
            label={mood}
            active={mood === 'breathing'}
            onPress={() => setMood(mood === 'happy' ? 'breathing' : 'happy')}
          />
        </View>

        <View className="mt-[18px] flex-1 flex-row flex-wrap items-center justify-center">
          {characters.map((character) => {
            const Character = characterComponents[character.id];
            return (
              <View key={character.id} style={styles.cell}>
                <View style={styles.stage}>
                  <Character mood={mood} scale={scale} />
                </View>
                <Text className="font-nunito-bold text-[11px] text-text-subtle">
                  {character.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function ControlButton({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      onPress={onPress}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.button, active && styles.buttonActive, pressed && styles.buttonPressed]}
    >
      <Text
        className="font-nunito-bold text-[13px]"
        style={{ color: active ? colors.white : colors.text.muted }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.purple['50'],
  },
  cell: {
    width: '50%',
    alignItems: 'center',
    gap: 8,
  },
  /** 160×160-as színpad, hogy a kilógó fülek és a sörény is elférjen. */
  stage: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  buttonActive: {
    backgroundColor: colors.purple['600'],
  },
  buttonPressed: {
    opacity: 0.6,
  },
});
