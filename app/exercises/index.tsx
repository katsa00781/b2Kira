import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { ExerciseCard } from '@/components/ExerciseCard';
import { Twinkles } from '@/components/Twinkles';
import { gradients } from '@/constants/colors';
import { contentMaxWidth, s } from '@/constants/layout';
import { exercises } from '@/data/exercises';

/**
 * Gyakorlatválasztó. A kezdőképernyő CTA-ja ide visz, innen indul mind a négy
 * gyakorlat, amit a logopédus a feladatlapon adott
 * (`docs/legzogyakorlatok-2026-08-26.md`, D-053).
 *
 * A kezdőképernyő lila világát viszi tovább, hogy a gyereknek ne legyen
 * törés a két képernyő között.
 */
export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient
      colors={gradients.purpleScreen.colors}
      locations={gradients.purpleScreen.locations}
      style={styles.screen}
    >
      <Twinkles variant="home" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) },
        ]}
      >
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />

          <Text style={styles.title} className="font-baloo-extrabold text-text-heading">
            Mit gyakoroljunk?
          </Text>
        </View>

        <Text style={styles.lead} className="font-nunito-semibold text-text-subtle">
          Válassz egyet — mindegyik jó választás.
        </Text>

        <View style={styles.list}>
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.key}
              exercise={exercise}
              onPress={() => router.push(exercise.route)}
            />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

/** A design keretében a tartalom 62 / 22 / 28 px-re van a képernyő szélétől. */
const BOTTOM_PADDING = s(28);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flexGrow: 1,
    // iPaden középre igazított, korlátozott szélességű oszlop (D-035).
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    paddingTop: s(62),
    paddingHorizontal: s(22),
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  title: { flexShrink: 1, fontSize: s(22) },
  lead: { marginTop: s(10), fontSize: s(13) },
  list: { marginTop: s(22), gap: s(14) },
});
