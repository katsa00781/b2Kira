import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton, BACK_BUTTON_SIZE } from '@/components/BackButton';
import { BreathingBox } from '@/components/BreathingBox';
import { PauseButton } from '@/components/PauseButton';
import { PhaseDots } from '@/components/PhaseDots';
import { ProgressBar } from '@/components/ProgressBar';
import { gradients } from '@/constants/colors';
import { contentMaxWidth, s } from '@/constants/layout';
import {
  BREATH_SECONDS,
  TOTAL_ROUNDS,
  comboAt,
  noseMouthPattern,
} from '@/data/noseMouth';
import { useBreathingCycle } from '@/hooks/useBreathingCycle';
import { notifySessionFinished, useSessionFeedback } from '@/hooks/useSessionFeedback';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { syncPendingSessions } from '@/lib/sync';
import { useChildStore } from '@/store/useChildStore';
import { useSessionStore } from '@/store/useSessionStore';

/**
 * 2. gyakorlat: orron/szájon be- és kilégzés négy kombinációban (D-054).
 *
 * A négy kombináció **folyamatosan váltakozik**: minden be-ki légzés után a
 * következő jön, a négy együtt egy kör, és a kör megy 4-szer.
 *
 * A gyakorlat képernyő (`app/session.tsx`) felépítését követi, hogy a gyereknek
 * ismerős legyen — csak a fejlécben a visszaszámláló helyett az aktuális
 * kombináció áll, és a számlálás bent marad: a képernyőn nincs kiírt
 * „5/16", csak a néma alsó sáv.
 */
export default function NoseMouthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const characterId = useChildStore((state) => state.characterId);
  const recordSession = useSessionStore((state) => state.recordSession);

  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const running = !paused && !finished;

  const { scale, phase, cycles } = useBreathingCycle(running, noseMouthPattern);
  const { elapsed, ratio } = useSessionTimer(TOTAL_SECONDS, running);

  const combo = comboAt(cycles);
  const label = combo.labels[phase] ?? combo.labels[0];

  // Hang, beszéd és rezgés a fázisváltásokhoz. A kimondott szöveg a
  // kombinációé („Szájon ki”), a hang a be-/kilégzés meglévő effektje.
  useSessionFeedback(phase, running, {
    label,
    soundPhase: noseMouthPattern.colorPhase[phase],
  });

  // A gyakorlat alatt ne aludjon el a képernyő.
  useKeepAwake();

  // A lezáráskor a legfrissebb eltelt idő és körszám kell, a callback
  // closure-je viszont régi értéket látna — ezért refben is vezetjük.
  const elapsedRef = useRef(0);
  const cyclesRef = useRef(0);
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);
  useEffect(() => {
    cyclesRef.current = cycles;
  }, [cycles]);

  const endedRef = useRef(false);

  const endSession = useCallback(
    (completed: boolean) => {
      if (endedRef.current) {
        return;
      }
      endedRef.current = true;
      recordSession({
        exerciseKey: 'nose-mouth',
        durationSeconds: elapsedRef.current,
        cyclesCompleted: cyclesRef.current,
        completed,
        characterId,
      });

      // Best-effort feltöltés. Nincs net → marad a sorban, a UI nem várja meg.
      void syncPendingSessions();
    },
    [recordSession, characterId]
  );

  // Kilépés bármilyen úton (vissza gomb, swipe): a részleges gyakorlat mentődik.
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

  // Megvan mind a 16 légzés (4 kör): lezárjuk és visszamegyünk.
  useEffect(() => {
    if (finished || cycles < TOTAL_ROUNDS) {
      return;
    }
    setFinished(true);
    notifySessionFinished();
    endSession(true);
    router.back();
  }, [cycles, finished, endSession, router]);

  return (
    <LinearGradient
      colors={gradients.greenScreen.colors}
      locations={gradients.greenScreen.locations}
      style={styles.screen}
    >
      <View style={[styles.content, { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) }]}>
        <View className="flex-row items-center justify-between">
          <BackButton variant="green" onPress={() => router.back()} />

          <Text style={styles.combo} className="font-nunito-bold text-green-500">
            {combo.title}
          </Text>

          {/* A felirat így marad középen, a vissza gombbal szemben. */}
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.stage} className="flex-1 items-center justify-center">
          <Text style={styles.phaseLabel} className="font-baloo-extrabold text-green-700">
            {label}
          </Text>

          <BreathingBox
            scale={scale}
            phase={noseMouthPattern.colorPhase[phase]}
            characterId={characterId}
          />

          <PhaseDots phase={phase} count={noseMouthPattern.labels.length} label={label} />
        </View>

        <View style={styles.footer}>
          <ProgressBar progress={ratio} variant="green" />
          <PauseButton paused={paused} onPress={() => setPaused((value) => !value)} />
        </View>
      </View>
    </LinearGradient>
  );
}

/** 16 légzés × (4 mp be + 4 mp ki) = 128 mp. Csak a haladásjelző sávhoz kell. */
const TOTAL_SECONDS = TOTAL_ROUNDS * BREATH_SECONDS * 2;

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
  combo: { flexShrink: 1, fontSize: s(13) },
  headerSpacer: { width: BACK_BUTTON_SIZE },
  phaseLabel: { fontSize: s(22), letterSpacing: 0.5 },
});
