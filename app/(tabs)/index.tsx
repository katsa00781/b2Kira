import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterPicker } from '@/components/CharacterPicker';
import { characterComponents } from '@/components/characters';
import { GearButton } from '@/components/GearButton';
import { LevelCard } from '@/components/LevelCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { StreakChip } from '@/components/StreakChip';
import { Twinkles } from '@/components/Twinkles';
import { gradients } from '@/constants/colors';
import { SESSIONS_PER_LEVEL, levelProgress } from '@/data/levels';
import { tipOfTheDay } from '@/data/tips';
import { activeStreakDays, useChildStore } from '@/store/useChildStore';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const name = useChildStore((state) => state.name);
  const characterId = useChildStore((state) => state.characterId);
  const completedSessions = useChildStore((state) => state.completedSessions);
  const streakDays = useChildStore((state) => state.streakDays);
  const lastSessionDate = useChildStore((state) => state.lastSessionDate);
  const setCharacter = useChildStore((state) => state.setCharacter);
  const syncFromServer = useChildStore((state) => state.syncFromServer);

  // A képernyő a lokális állapotból már kirajzolódott, ez csak utólag frissít.
  useEffect(() => {
    void syncFromServer();
  }, [syncFromServer]);

  const Character = characterComponents[characterId];
  const level = levelProgress(completedSessions);
  const streak = activeStreakDays({ streakDays, lastSessionDate });

  return (
    <LinearGradient
      colors={gradients.purpleScreen.colors}
      locations={gradients.purpleScreen.locations}
      style={styles.screen}
    >
      <Twinkles variant="home" />

      <View style={[styles.content, { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) }]}>
        <View className="flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            style={styles.greeting}
            className="font-baloo-bold text-[20px] text-text-heading"
          >
            Szia{name ? `, ${name}` : ''}! 🌸
          </Text>
          <View className="flex-row items-center gap-[8px]">
            <StreakChip days={streak} />
            {/* A beállítások képernyő a 10. szakaszban készül el, addig nem visz sehova. */}
            <GearButton />
          </View>
        </View>

        <View className="mt-[22px] items-center gap-[12px]">
          <Character mood="happy" scale={1} />
          <Text className="text-center font-baloo-bold text-[15px] text-text-heading">
            Készen állsz egy jó nagy levegőre?
          </Text>
          <CharacterPicker value={characterId} onChange={setCharacter} />
        </View>

        <View className="mt-[22px]">
          <LevelCard
            level={level.level}
            levelName={level.name}
            done={level.done}
            goal={SESSIONS_PER_LEVEL}
          />
        </View>
        <View className="mt-[8px]">
          <ProgressBar progress={level.ratio} variant="purple" />
        </View>

        <View className="mt-auto gap-[10px]">
          <Text className="text-center font-nunito-semibold text-[12.5px] text-text-subtle">
            Mai tipp: {tipOfTheDay()}
          </Text>
          <PrimaryButton
            label="Kezdjük a gyakorlást →"
            onPress={() => router.push('/session')}
            variant="purple"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

/** A design keretében a tartalom 62 / 22 / 28 px-re van a képernyő szélétől. */
const BOTTOM_PADDING = 28;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flex: 1,
    paddingTop: 62,
    paddingHorizontal: 22,
  },
  /** Hosszú név se tolja ki a streak chipet és a fogaskereket. */
  greeting: { flexShrink: 1 },
});
