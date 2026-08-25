import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BreathingBox } from '@/components/BreathingBox';
import { PauseButton } from '@/components/PauseButton';
import { PhaseDots } from '@/components/PhaseDots';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, gradients } from '@/constants/colors';
import { shadows } from '@/constants/shadows';
import { phaseLabels } from '@/data/phases';
import { defaultSessionSeconds } from '@/data/sessionLengths';
import { useBreathingCycle } from '@/hooks/useBreathingCycle';
import { usePressed } from '@/hooks/usePressed';
import { formatDuration, useSessionTimer } from '@/hooks/useSessionTimer';
import { useChildStore } from '@/store/useChildStore';
import { useSessionStore } from '@/store/useSessionStore';

/**
 * Élő légzőgyakorlat (`00-teljes-canvas.html`, 4. képernyő). A ritmust a
 * `useBreathingCycle` hajtja a UI szálon, a visszaszámlálót a
 * `useSessionTimer`. A képernyő elhagyása mindig lezárja a gyakorlatot —
 * a részleges is elmentődik, megerősítő kérdés nélkül.
 */
export default function SessionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { pressed, pressHandlers } = usePressed();

  const characterId = useChildStore((state) => state.characterId);
  const recordSession = useSessionStore((state) => state.recordSession);

  // A hosszt a 10. szakasz beállítás képernyője fogja adni.
  const totalSeconds = defaultSessionSeconds;

  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const running = !paused && !finished;

  const { scale, phase } = useBreathingCycle(running);
  const { elapsed, remaining, ratio } = useSessionTimer(totalSeconds, running);

  // A gyakorlat alatt ne aludjon el a képernyő.
  useKeepAwake();

  // A lezáráskor a legfrissebb eltelt idő kell, a callback closure-je viszont
  // régi értéket látna — ezért refben is vezetjük.
  const elapsedRef = useRef(0);
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  const endedRef = useRef(false);

  const endSession = useCallback(
    (completed: boolean) => {
      if (endedRef.current) {
        return;
      }
      endedRef.current = true;
      recordSession({
        durationSeconds: elapsedRef.current,
        completed,
        characterId,
      });
    },
    [recordSession, characterId]
  );

  // Kilépés bármilyen úton (vissza gomb, swipe): a részleges session mentődik.
  // A refen keresztül, hogy ezt tényleg csak a képernyő elhagyása futtassa.
  const endSessionRef = useRef(endSession);
  useEffect(() => {
    endSessionRef.current = endSession;
  }, [endSession]);
  useEffect(() => () => endSessionRef.current(false), []);

  // Háttérbe kerüléskor magától szünetel — a gyerek úgysem látja.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setPaused(true);
      }
    });

    return () => subscription.remove();
  }, []);

  // Letelt az idő: lezárjuk és visszamegyünk. Az ünneplés a 9. szakaszban jön.
  useEffect(() => {
    if (finished || elapsed < totalSeconds) {
      return;
    }
    setFinished(true);
    endSession(true);
    router.back();
  }, [elapsed, totalSeconds, finished, endSession, router]);

  return (
    <LinearGradient
      colors={gradients.greenScreen.colors}
      locations={gradients.greenScreen.locations}
      style={styles.screen}
    >
      <View style={[styles.content, { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) }]}>
        <View className="flex-row items-center justify-between">
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

          <Text className="font-nunito-bold text-[13px] text-green-500">
            {formatDuration(remaining)} maradt
          </Text>

          {/* A felirat így marad középen, a vissza gombbal szemben. */}
          <View style={styles.headerSpacer} />
        </View>

        <View className="flex-1 items-center justify-center gap-[24px]">
          <Text style={styles.phaseLabel} className="font-baloo-extrabold text-[22px] text-green-700">
            {phaseLabels[phase]}
          </Text>

          <BreathingBox scale={scale} phase={phase} characterId={characterId} />

          <PhaseDots phase={phase} />
        </View>

        <View className="gap-[10px]">
          <ProgressBar progress={ratio} variant="green" />
          <PauseButton paused={paused} onPress={() => setPaused((value) => !value)} />
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
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.backButton,
  },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: colors.green['500'],
    transform: [{ rotate: '45deg' }],
    marginLeft: 3,
  },
  headerSpacer: { width: 34 },
  phaseLabel: { letterSpacing: 0.5 },
  pressed: { opacity: 0.6 },
});
