import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bunny } from '@/components/characters';
import { FormMessage } from '@/components/FormMessage';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { Twinkles } from '@/components/Twinkles';
import { gradients } from '@/constants/colors';
import { contentMaxWidth, s, uiScale } from '@/constants/layout';
import { usePressed } from '@/hooks/usePressed';
import { resetPassword, signIn } from '@/lib/auth';

type Feedback = { tone: 'error' | 'success'; message: string };

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [busy, setBusy] = useState(false);
  // A `Pressable` `style` propja nem lehet függvény — lásd D-026.
  const forgotten = usePressed();
  const registerLink = usePressed();

  async function handleSignIn() {
    setBusy(true);
    setFeedback(null);

    const result = await signIn(email, password);

    // Sikeres belépésnél az auth guard visz tovább, addig marad a „…" felirat.
    if (!result.ok) {
      setFeedback({ tone: 'error', message: result.message });
      setBusy(false);
    }
  }

  async function handleForgottenPassword() {
    setBusy(true);
    setFeedback(null);

    const result = await resetPassword(email);

    setFeedback({
      tone: result.ok ? 'success' : 'error',
      message: result.ok ? (result.message ?? '') : result.message,
    });
    setBusy(false);
  }

  return (
    <LinearGradient
      colors={gradients.purpleScreen.colors}
      locations={gradients.purpleScreen.locations}
      style={styles.screen}
    >
      <Twinkles variant="login" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <View style={[styles.content, { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) }]}>
          <View style={styles.header}>
            <Bunny mood="happy" scale={uiScale} />
            <Text style={styles.title} className="font-baloo-extrabold text-text-heading">
              Doboz Légzés
            </Text>
            <Text style={styles.subtitle} className="text-center font-nunito-semibold text-text-subtle">
              Lélegezz és játssz a barátaiddal!
            </Text>
          </View>

          <View style={styles.form}>
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
              autoComplete="current-password"
              secureTextEntry
              textContentType="password"
            />
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              hitSlop={{ top: 12, bottom: 12, left: 12 }}
              onPress={handleForgottenPassword}
              {...forgotten.pressHandlers}
              style={[styles.forgotten, forgotten.pressed && styles.pressed]}
            >
              <Text style={styles.forgottenLabel} className="font-nunito-bold text-purple-600">
                Elfelejtett jelszó?
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer} className="mt-auto">
            {feedback ? <FormMessage tone={feedback.tone} message={feedback.message} /> : null}

            <PrimaryButton
              label={busy ? 'Bejelentkezés…' : 'Bejelentkezés'}
              onPress={handleSignIn}
              variant="purple"
              disabled={busy}
            />

            <Pressable
              accessibilityRole="link"
              hitSlop={{ top: 14, bottom: 14 }}
              onPress={() => router.push('/register')}
              {...registerLink.pressHandlers}
              style={registerLink.pressed && styles.pressed}
            >
              <Text style={styles.subtitle} className="font-nunito-semibold text-text-subtle">
                Nincs még fiókod?{' '}
                <Text className="font-nunito-bold text-purple-600">Regisztrálj</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/** A design keretében a tartalom 72 / 26 / 32 px-re van a képernyő szélétől. */
const BOTTOM_PADDING = s(32);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flex: 1,
    // iPaden középre igazított, korlátozott szélességű oszlop (D-035).
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    paddingTop: s(72),
    paddingHorizontal: s(26),
  },
  header: { alignItems: 'center', gap: s(10) },
  title: { fontSize: s(24) },
  subtitle: { fontSize: s(13) },
  form: { marginTop: s(32), gap: s(12) },
  forgottenLabel: { fontSize: s(12) },
  footer: { alignItems: 'center', gap: s(14) },
  forgotten: { alignSelf: 'flex-end' },
  pressed: { opacity: 0.6 },
});
