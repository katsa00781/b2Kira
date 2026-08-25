import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterPicker } from '@/components/CharacterPicker';
import { characterComponents } from '@/components/characters';
import { GearButton } from '@/components/GearButton';
import { LevelCard } from '@/components/LevelCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { StickerCelebration } from '@/components/StickerCelebration';
import { StreakChip } from '@/components/StreakChip';
import { Twinkles } from '@/components/Twinkles';
import { gradients } from '@/constants/colors';
import { contentMaxWidth, s, uiScale } from '@/constants/layout';
import { SESSIONS_PER_LEVEL, levelProgress } from '@/data/levels';
import { stickers } from '@/data/stickers';
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
  const justUnlocked = useChildStore((state) => state.justUnlocked);
  const clearJustUnlocked = useChildStore((state) => state.clearJustUnlocked);

  // A képernyő a lokális állapotból már kirajzolódott, ez csak utólag frissít.
  useEffect(() => {
    void syncFromServer();
  }, [syncFromServer]);

  const Character = characterComponents[characterId];
  const level = levelProgress(completedSessions);
  const streak = activeStreakDays({ streakDays, lastSessionDate });
  const unlocked = stickers.find((sticker) => sticker.key === justUnlocked) ?? null;

  const dismissCelebration = useCallback(() => clearJustUnlocked(), [clearJustUnlocked]);

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
            className="font-baloo-bold text-text-heading"
          >
            Szia{name ? `, ${name}` : ''}! 🌸
          </Text>
          <View style={styles.headerActions}>
            <StreakChip days={streak} />
            {/* A beállítások képernyő a 10. szakaszban készül el, addig nem visz sehova. */}
            <GearButton />
          </View>
        </View>

        <View style={styles.hero}>
          <Character mood="happy" scale={uiScale} />
          <Text style={styles.prompt} className="text-center font-baloo-bold text-text-heading">
            Készen állsz egy jó nagy levegőre?
          </Text>
          <CharacterPicker value={characterId} onChange={setCharacter} />
        </View>

        <View style={styles.levelCard}>
          <LevelCard
            level={level.level}
            levelName={level.name}
            done={level.done}
            goal={SESSIONS_PER_LEVEL}
            onPress={() => router.push('/stickers')}
          />
        </View>
        <View style={styles.levelProgress}>
          <ProgressBar progress={level.ratio} variant="purple" />
        </View>

        {unlocked ? (
          <StickerCelebration sticker={unlocked} onDone={dismissCelebration} />
        ) : null}

        <View style={styles.footer} className="mt-auto">
          <Text style={styles.tip} className="text-center font-nunito-semibold text-text-subtle">
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
const BOTTOM_PADDING = s(28);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flex: 1,
    // iPaden középre igazított, korlátozott szélességű oszlop (D-035).
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    paddingTop: s(62),
    paddingHorizontal: s(22),
  },
  /** Hosszú név se tolja ki a streak chipet és a fogaskereket. */
  greeting: { flexShrink: 1, fontSize: s(20) },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  hero: { marginTop: s(22), alignItems: 'center', gap: s(12) },
  prompt: { fontSize: s(15) },
  levelCard: { marginTop: s(22) },
  levelProgress: { marginTop: s(8) },
  footer: { gap: s(10) },
  tip: { fontSize: s(12.5) },
});
