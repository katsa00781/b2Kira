import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Checkbox } from '@/components/Checkbox';
import { FormMessage } from '@/components/FormMessage';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { gradients } from '@/constants/colors';
import { contentMaxWidth, s } from '@/constants/layout';
import { usePressed } from '@/hooks/usePressed';
import { signUp } from '@/lib/auth';

type Feedback = { tone: 'error' | 'success'; message: string };

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [busy, setBusy] = useState(false);
  // A `Pressable` `style` propja nem lehet függvény — lásd D-026.
  const loginLink = usePressed();

  async function handleSignUp() {
    setBusy(true);
    setFeedback(null);

    const result = await signUp({ childName, childAge, email, password, consent });

    if (!result.ok) {
      setFeedback({ tone: 'error', message: result.message });
      setBusy(false);
      return;
    }

    // Megerősítő levél esetén itt maradunk; ha van már session, a guard visz tovább.
    if (result.message) {
      setFeedback({ tone: 'success', message: result.message });
      setBusy(false);
    }
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
            Hozzunk létre fiókot!
          </Text>
          <Text style={styles.lead} className="font-nunito-semibold text-text-subtle">
            Csak pár adat, és kezdhettek is
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
            <TextField
              label="Szülő e-mail címe"
              placeholder="szulo@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <TextField
              label="Jelszó"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              secureTextEntry
              textContentType="newPassword"
            />
          </View>

          <View style={styles.consent}>
            <Checkbox
              checked={consent}
              onChange={setConsent}
              label="Elfogadom, hogy a szülő felügyeli a fiókot és a beállításokat."
            />
          </View>

          <View style={styles.footer}>
            {feedback ? <FormMessage tone={feedback.tone} message={feedback.message} /> : null}

            <PrimaryButton
              label={busy ? 'Fiók létrehozása…' : 'Fiók létrehozása'}
              onPress={handleSignUp}
              variant="green"
              disabled={busy}
            />

            <Pressable
              accessibilityRole="link"
              hitSlop={{ top: 14, bottom: 14 }}
              onPress={() => router.push('/login')}
              {...loginLink.pressHandlers}
              style={loginLink.pressed && styles.pressed}
            >
              <Text style={styles.subtitle} className="font-nunito-semibold text-text-subtle">
                Van már fiókod?{' '}
                <Text className="font-nunito-bold text-green-700">Bejelentkezés</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/** A design keretében a tartalom 72 / 26 / 32 px-re van a képernyő szélétől. */
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
  subtitle: { fontSize: s(13) },
  form: { marginTop: s(24), gap: s(12) },
  consent: { marginTop: s(18) },
  footer: { marginTop: s(26), alignItems: 'center', gap: s(14) },
  pressed: { opacity: 0.6 },
});
