import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormMessage } from '@/components/FormMessage';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { gradients } from '@/constants/colors';
import { contentMaxWidth, s } from '@/constants/layout';
import { createChildProfile } from '@/lib/auth';

/**
 * Gyerek profil létrehozása bejelentkezett szülőnek.
 *
 * Akkor jelenik meg, ha a szerver megerősítette, hogy ehhez a fiókhoz nincs
 * `breathing_children` sor — például mert a szülő egy korábbi fiókkal lépett
 * be, vagy új eszközön nincs függő adat. Enélkül a kezdőképernyő örökre
 * „Szia! 🌸"-t köszönne, név nélkül. Lásd docs/feature-tasks.md – D-050.
 *
 * A design ezt a képernyőt nem rajzolja meg; a regisztráció vizuális nyelvét
 * követi (zöld gradiens, ugyanazok a mezők és gomb).
 */
export default function ChildProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    setBusy(true);
    setError(null);

    const result = await createChildProfile(childName, childAge);

    if (!result.ok) {
      setError(result.message);
      setBusy(false);
      return;
    }

    router.replace('/');
  }

  return (
    <LinearGradient
      colors={gradients.greenScreen.colors}
      locations={gradients.greenScreen.locations}
      style={styles.screen}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title} className="font-baloo-extrabold text-text-heading">
            Ki fog gyakorolni?
          </Text>
          <Text style={styles.lead} className="font-nunito-semibold text-text-subtle">
            Írd be a gyermeked nevét és életkorát
          </Text>

          <View style={styles.form}>
            <TextField
              label="Gyermek neve"
              placeholder="Zoé"
              value={childName}
              onChangeText={setChildName}
              autoCapitalize="words"
            />
            <TextField
              label="Gyermek életkora"
              placeholder="7 éves"
              value={childAge}
              onChangeText={setChildAge}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.footer}>
            {error ? <FormMessage tone="error" message={error} /> : null}

            <PrimaryButton
              label={busy ? 'Mentés…' : 'Kezdhetjük!'}
              onPress={handleSave}
              variant="green"
              disabled={busy}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/** A regisztráció keretével egyező padding: 72 / 26 / 32 (D-022). */
const BOTTOM_PADDING = s(32);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flexGrow: 1,
    // iPaden középre igazított, korlátozott szélességű oszlop (D-035).
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    paddingTop: s(72),
    paddingHorizontal: s(26),
  },
  title: { fontSize: s(24) },
  lead: { marginTop: s(4), fontSize: s(13) },
  form: { marginTop: s(24), gap: s(12) },
  footer: { marginTop: s(26), alignItems: 'center', gap: s(14) },
});
