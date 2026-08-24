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
          <Text className="font-baloo-extrabold text-[24px] text-text-heading">
            Hozzunk létre fiókot!
          </Text>
          <Text className="mt-[4px] font-nunito-semibold text-[13px] text-text-subtle">
            Csak pár adat, és kezdhettek is
          </Text>

          <View className="mt-[24px] gap-[12px]">
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

          <View className="mt-[18px]">
            <Checkbox
              checked={consent}
              onChange={setConsent}
              label="Elfogadom, hogy a szülő felügyeli a fiókot és a beállításokat."
            />
          </View>

          <View className="mt-[26px] items-center gap-[14px]">
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
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text className="font-nunito-semibold text-[13px] text-text-subtle">
                Van már fiókod? <Text className="font-nunito-bold text-green-700">Bejelentkezés</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/** A design keretében a tartalom 72 / 26 / 32 px-re van a képernyő szélétől. */
const BOTTOM_PADDING = 32;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingTop: 72,
    paddingHorizontal: 26,
  },
  pressed: { opacity: 0.6 },
});
