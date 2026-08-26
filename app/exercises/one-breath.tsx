import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BACK_BUTTON_SIZE, BackButton } from '@/components/BackButton';
import { BreathingBox } from '@/components/BreathingBox';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { gradients } from '@/constants/colors';
import { contentMaxWidth, s } from '@/constants/layout';
import { inhalePattern, oneBreathSet } from '@/data/oneBreath';
import { useGuidedInhale } from '@/hooks/useGuidedInhale';
import {
  notifyBreathIn,
  notifySessionFinished,
  usePreparedFeedback,
} from '@/hooks/useSessionFeedback';
import { usePressed } from '@/hooks/usePressed';
import { speak } from '@/lib/speech';
import { syncPendingSessions } from '@/lib/sync';
import { useChildStore } from '@/store/useChildStore';
import { useSessionStore } from '@/store/useSessionStore';
import { useSettingsStore } from '@/store/useSettingsStore';

/**
 * 3. és 4. gyakorlat: a hét napjai, illetve a szótagsorok **egy levegővel**
 * (`/exercises/one-breath?key=weekdays|syllables`).
 *
 * Soronként két lépés: vezetett belégzés, majd a sor nagyban a képernyőn, és a
 * gyerek nyom „Kész”-t, amikor elmondta. **Nincs stopper, nincs számolás,
 * nincs értékelés** — a továbblépés üteme teljesen a gyereké (D-055).
 */
export default function OneBreathScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { key } = useLocalSearchParams<{ key?: string }>();

  const set = oneBreathSet(key);

  const characterId = useChildStore((state) => state.characterId);
  const recordSession = useSessionStore((state) => state.recordSession);
  const voiceOn = useSettingsStore((state) => state.voiceOn);
  const { pressed, pressHandlers } = usePressed();

  /** Hányadik sornál tartunk, és épp levegőt veszünk-e hozzá. */
  const [index, setIndex] = useState(0);
  const [breathing, setBreathing] = useState(true);
  const [finished, setFinished] = useState(false);

  const item = set.items[index];

  const startSpeaking = useCallback(() => setBreathing(false), []);
  const scale = useGuidedInhale(breathing && !finished, startSpeaking);

  // Az audio session és a lejátszók előre betöltve (D-048).
  usePreparedFeedback();

  // Minden új sor egy új belégzéssel indul — ez az egyetlen hangjelzés.
  useEffect(() => {
    if (breathing && !finished) {
      notifyBreathIn(inhalePattern.labels[0]);
    }
  }, [breathing, finished, index]);

  // A gyakorlat alatt ne aludjon el a képernyő.
  useKeepAwake();

  // Mérünk, de csak a naplónak: a képernyőn soha nem jelenik meg idő (D-055).
  const startedAt = useRef(Date.now());
  const doneRef = useRef(0);
  const endedRef = useRef(false);

  const endSession = useCallback(
    (completed: boolean) => {
      if (endedRef.current) {
        return;
      }
      endedRef.current = true;
      recordSession({
        exerciseKey: set.key,
        durationSeconds: (Date.now() - startedAt.current) / 1000,
        cyclesCompleted: doneRef.current,
        completed,
        characterId,
      });

      // Best-effort feltöltés. Nincs net → marad a sorban, a UI nem várja meg.
      void syncPendingSessions();
    },
    [recordSession, characterId, set.key]
  );

  // Kilépés bármilyen úton (vissza gomb, swipe): a részleges gyakorlat mentődik.
  const endSessionRef = useRef(endSession);
  useEffect(() => {
    endSessionRef.current = endSession;
  }, [endSession]);
  useEffect(() => () => endSessionRef.current(false), []);

  const handleDone = useCallback(() => {
    const next = index + 1;
    doneRef.current = next;

    if (next >= set.items.length) {
      setFinished(true);
      notifySessionFinished();
      endSession(true);
      router.back();
      return;
    }

    setIndex(next);
    setBreathing(true);
  }, [index, set.items.length, endSession, router]);

  return (
    <LinearGradient
      colors={gradients.greenScreen.colors}
      locations={gradients.greenScreen.locations}
      style={styles.screen}
    >
      <View style={[styles.content, { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) }]}>
        <View className="flex-row items-center justify-between">
          <BackButton variant="green" onPress={() => router.back()} />

          <Text style={styles.header} className="font-nunito-bold text-green-500">
            {set.title}
          </Text>

          {/* A felirat így marad középen, a vissza gombbal szemben. */}
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.stage} className="flex-1 items-center justify-center">
          <Text style={styles.prompt} className="text-center font-baloo-extrabold text-green-700">
            {breathing ? inhalePattern.labels[0] : set.instruction}
          </Text>

          <BreathingBox scale={scale} phase={inhalePattern.colorPhase[0]} characterId={characterId} />

          {/* A sor csak akkor jelenik meg, amikor mondani kell — belégzés
              közben ne vonja el a figyelmet a levegővételről. A hely előre le
              van foglalva, hogy a szöveg megjelenésekor ne ugorjon a layout. */}
          <View style={styles.itemSlot}>
            {breathing ? null : (
              <Text
                style={styles.item}
                className="text-center font-baloo-extrabold text-text-heading"
              >
                {item}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <ProgressBar progress={index / set.items.length} variant="green" />

          {voiceOn && !breathing ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hallgasd meg"
              onPress={() => speak(item)}
              {...pressHandlers}
              // A `style` itt nem lehet függvény — lásd D-026.
              style={[styles.listen, pressed && styles.pressed]}
            >
              <Text style={styles.listenLabel} className="font-nunito-bold text-green-500">
                Hallgasd meg
              </Text>
            </Pressable>
          ) : null}

          <PrimaryButton label="Kész" onPress={handleDone} variant="green" disabled={breathing} />
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
  stage: { gap: s(24) },
  footer: { gap: s(10) },
  header: { flexShrink: 1, fontSize: s(13) },
  headerSpacer: { width: BACK_BUTTON_SIZE },
  prompt: { fontSize: s(22), letterSpacing: 0.5 },
  /** Három sornyi hely a leghosszabb sornak (a hét napjai). */
  itemSlot: { minHeight: s(96), justifyContent: 'center' },
  item: { fontSize: s(24), lineHeight: s(32) },
  listen: { alignSelf: 'center', paddingVertical: s(6), paddingHorizontal: s(12) },
  listenLabel: { fontSize: s(13) },
  pressed: { opacity: 0.6 },
});
