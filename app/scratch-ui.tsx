/**
 * FEJLESZTŐI SEGÉDKÉPERNYŐ – nem része a késznek szánt appnak.
 * A design rendszer hat komponensét mutatja egy helyen, hogy éles eszközön
 * ellenőrizhető legyen a gradiens, az árnyék és az animáció.
 * Ship előtt törlendő (lásd `docs/feature-tasks.md` – „Ship előtt").
 */
import { Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { SegmentedChoice } from '@/components/SegmentedChoice';
import { TextField } from '@/components/TextField';
import { ToggleRow } from '@/components/ToggleRow';
import { Twinkles } from '@/components/Twinkles';
import { colors } from '@/constants/colors';
import { shadows } from '@/constants/shadows';
import { useSettingsStore } from '@/store/useSettingsStore';

const LENGTH_OPTIONS = [
  { value: 60, label: '1 perc' },
  { value: 150, label: '2-3 perc' },
  { value: 300, label: '5 perc' },
] as const;

export default function ScratchUiScreen() {
  const [name, setName] = useState('');
  const [progress, setProgress] = useState(0.6);
  // A három visszajelzés-kapcsoló már a valódi store-ból jön: a 10. szakasz
  // beállítás képernyőjéig ez az egyetlen hely, ahol ki-be lehet kapcsolni őket.
  const settings = useSettingsStore();
  const [length, setLength] = useState<number>(150);

  return (
    <SafeAreaView style={styles.screen}>
      <Twinkles variant="home" />
      <ScrollView contentContainerClassName="gap-[18px] px-[22px] pb-[28px]">
        <Link href="/" className="py-2">
          <Text className="font-nunito-bold text-[13px] text-text-muted">← Vissza</Text>
        </Link>

        <Text className="font-baloo-extrabold text-[22px] text-text-heading">
          Design rendszer teszt
        </Text>

        <TextField
          label="Gyermek neve"
          placeholder="Zoé"
          value={name}
          onChangeText={setName}
        />
        <TextField label="Jelszó" placeholder="••••••••" secureTextEntry />

        <View className="gap-[8px]">
          <Text className="font-nunito-bold text-[13px] text-text-muted">
            ProgressBar – {Math.round(progress * 100)}%
          </Text>
          <ProgressBar progress={progress} variant="purple" />
          <ProgressBar progress={progress} variant="green" />
          <SegmentedChoice
            options={PROGRESS_STEPS}
            value={progress}
            onChange={setProgress}
          />
        </View>

        <View style={styles.card}>
          <ToggleRow
            label="Hangeffektek"
            sub="Játékos hangok a gyakorlat közben"
            value={settings.soundOn}
            onValueChange={settings.setSoundOn}
          />
          <ToggleRow
            label="Hangos útmutatás"
            sub="Barátságos hang vezeti a légzést"
            value={settings.voiceOn}
            onValueChange={settings.setVoiceOn}
          />
          <ToggleRow
            label="Rezgés"
            sub="Finom rezgés minden fázisváltásnál"
            value={settings.hapticsOn}
            onValueChange={settings.setHapticsOn}
            showDivider={false}
          />
        </View>

        <View className="gap-[8px]">
          <Text className="font-nunito-bold text-[14px] text-text-body">Gyakorlat hossza</Text>
          <SegmentedChoice options={LENGTH_OPTIONS} value={length} onChange={setLength} />
        </View>

        <PrimaryButton label="Bejelentkezés" onPress={() => {}} />
        <PrimaryButton label="Fiók létrehozása" variant="green" onPress={() => {}} />
        <PrimaryButton label="Letiltva" onPress={() => {}} disabled />
      </ScrollView>
    </SafeAreaView>
  );
}

const PROGRESS_STEPS = [
  { value: 0, label: '0%' },
  { value: 0.6, label: '60%' },
  { value: 1, label: '100%' },
] as const;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.purple['50'],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    boxShadow: shadows.input,
  },
});
