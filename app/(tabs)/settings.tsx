import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ParentGate } from '@/components/ParentGate';
import { SegmentedChoice } from '@/components/SegmentedChoice';
import { ToggleRow } from '@/components/ToggleRow';
import { colors } from '@/constants/colors';
import { contentMaxWidth, s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import type { SessionLengthKey } from '@/data/sessionLengths';
import { sessionLengths } from '@/data/sessionLengths';
import { signOut } from '@/lib/auth';
import { formatTime, parseTime, scheduleDailyReminder } from '@/lib/notifications';
import { pushSettings } from '@/lib/sync';
import { usePressed } from '@/hooks/usePressed';
import { useSettingsStore } from '@/store/useSettingsStore';

/**
 * Szülői beállítások (`00-teljes-canvas.html`, 6. képernyő).
 *
 * A képernyő szülői zár mögött van (CLAUDE.md) — előbb egy matematikai kérdés
 * jön, és csak a helyes válasz után látszik bármi.
 *
 * Eltérés a designtól: négy kapcsoló van három helyett (a rezgés is
 * kapcsolható, D-043), és az alsó gomb felirata „Kijelentkezés” (D-044).
 */
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <ParentGate onUnlock={() => setUnlocked(true)} onCancel={() => router.back()} />;
  }

  return <SettingsContent insets={insets} onBack={() => router.back()} />;
}

type SettingsContentProps = {
  insets: { bottom: number };
  onBack: () => void;
};

function SettingsContent({ insets, onBack }: SettingsContentProps) {
  const { pressed, pressHandlers } = usePressed();

  const soundOn = useSettingsStore((state) => state.soundOn);
  const voiceOn = useSettingsStore((state) => state.voiceOn);
  const hapticsOn = useSettingsStore((state) => state.hapticsOn);
  const reminderOn = useSettingsStore((state) => state.reminderOn);
  const reminderTime = useSettingsStore((state) => state.reminderTime);
  const sessionLengthKey = useSettingsStore((state) => state.sessionLengthKey);

  const setSoundOn = useSettingsStore((state) => state.setSoundOn);
  const setVoiceOn = useSettingsStore((state) => state.setVoiceOn);
  const setHapticsOn = useSettingsStore((state) => state.setHapticsOn);
  const setReminderOn = useSettingsStore((state) => state.setReminderOn);
  const setReminderTime = useSettingsStore((state) => state.setReminderTime);
  const setSessionLengthKey = useSettingsStore((state) => state.setSessionLengthKey);

  const [editingTime, setEditingTime] = useState(false);

  // Minden változtatás után újraütemezzük az emlékeztetőt, és felküldjük a
  // beállításokat. Mindkettő best-effort, a UI nem várja meg.
  useEffect(() => {
    // Itt szabad engedélyt kérni: a szülő van a képernyőn, a zár mögött.
    void scheduleDailyReminder(reminderOn, reminderTime, { prompt: true });
  }, [reminderOn, reminderTime]);

  useEffect(() => {
    void pushSettings();
  }, [soundOn, voiceOn, hapticsOn, reminderOn, reminderTime, sessionLengthKey]);

  function shiftTime(minutes: number) {
    const { hour, minute } = parseTime(reminderTime);
    const total = (hour * 60 + minute + minutes + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    setReminderTime(formatTime(Math.floor(total / 60), total % 60));
  }

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
            onPress={onBack}
            {...pressHandlers}
            // A `style` itt nem lehet függvény — lásd D-026.
            style={[styles.backButton, pressed && styles.pressed]}
          >
            <View style={styles.backArrow} />
          </Pressable>

          <Text style={styles.title} className="font-baloo-extrabold text-text-heading">
            Szülői beállítások
          </Text>
        </View>

        <View style={styles.card}>
          <ToggleRow
            label="Hangeffektek"
            sub="Játékos hangok a gyakorlat közben"
            value={soundOn}
            onValueChange={setSoundOn}
          />
          <ToggleRow
            label="Hangos útmutatás"
            sub="Barátságos hang vezeti a légzést"
            value={voiceOn}
            onValueChange={setVoiceOn}
          />
          {/* A designban nincs, de a CLAUDE.md szerint kapcsolható (D-043). */}
          <ToggleRow
            label="Rezgés"
            sub="Finom rezzenés a fázisváltásoknál"
            value={hapticsOn}
            onValueChange={setHapticsOn}
          />
          <ToggleRow
            label="Napi emlékeztető"
            sub="Értesítés a gyakorlás idejéről"
            value={reminderOn}
            onValueChange={setReminderOn}
            showDivider={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel} className="font-nunito-bold text-text-body">
            Gyakorlat hossza
          </Text>
          <SegmentedChoice
            options={sessionLengths.map((length) => ({ value: length.key, label: length.label }))}
            value={sessionLengthKey}
            onChange={(value: SessionLengthKey) => setSessionLengthKey(value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel} className="font-nunito-bold text-text-body">
            Napi emlékeztető
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Emlékeztető ideje: ${reminderTime}`}
            accessibilityHint="Megnyitja az időpont állítását"
            onPress={() => setEditingTime((value) => !value)}
            style={styles.timeCard}
          >
            <Text style={styles.timeValue} className="font-nunito-bold text-text-heading">
              {reminderTime}
            </Text>
            <Text style={styles.timeHint} className="font-nunito-semibold text-text-subtle">
              Minden nap
            </Text>
          </Pressable>

          {/* A designban nincs időválasztó, csak a kártya — lásd D-045. */}
          {editingTime ? (
            <View style={styles.stepper}>
              <StepButton icon="remove" label="15 perccel korábbra" onPress={() => shiftTime(-15)} />
              <Text style={styles.stepperValue} className="text-center font-baloo-extrabold text-text-heading">
                {reminderTime}
              </Text>
              <StepButton icon="add" label="15 perccel későbbre" onPress={() => shiftTime(15)} />
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={() => void signOut()}
            style={styles.signOut}
          >
            <Text style={styles.signOutLabel} className="text-center font-baloo-extrabold text-purple-600">
              Kijelentkezés
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

type StepButtonProps = {
  icon: 'add' | 'remove';
  label: string;
  onPress: () => void;
};

function StepButton({ icon, label, onPress }: StepButtonProps) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.stepButton, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={s(20)} color={colors.purple['600']} />
    </Pressable>
  );
}

const MINUTES_PER_DAY = 24 * 60;

/** A design keretében a tartalom 62 / 22 / 28 px-re van a képernyő szélétől. */
const BOTTOM_PADDING = s(28);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.screen.settings },
  content: {
    flexGrow: 1,
    // iPaden középre igazított, korlátozott szélességű oszlop (D-035).
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    paddingTop: s(62),
    paddingHorizontal: s(22),
    gap: s(18),
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

  card: {
    backgroundColor: colors.white,
    borderRadius: s(18),
    paddingVertical: s(4),
    paddingHorizontal: s(16),
    boxShadow: shadows.input,
  },

  section: { gap: s(8) },
  sectionLabel: { fontSize: s(14) },

  timeCard: {
    backgroundColor: colors.white,
    borderRadius: s(14),
    paddingVertical: s(14),
    paddingHorizontal: s(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: shadows.input,
  },
  timeValue: { fontSize: s(15) },
  timeHint: { fontSize: s(12) },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  stepButton: {
    width: s(48),
    height: s(44),
    borderRadius: s(14),
    backgroundColor: colors.purple['100'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { flex: 1, fontSize: s(17) },

  footer: { marginTop: 'auto' },
  signOut: {
    borderRadius: 999,
    paddingVertical: s(14),
    paddingHorizontal: s(14),
    backgroundColor: colors.purple['100'],
  },
  signOutLabel: { fontSize: s(14) },
});
