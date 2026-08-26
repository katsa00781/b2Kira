import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAuthSession } from '@/hooks/useAuthSession';
import { ensureChildProfile } from '@/lib/auth';
import { scheduleDailyReminder } from '@/lib/notifications';
import { pullSettings, syncPendingSessions } from '@/lib/sync';
import { useSettingsStore } from '@/store/useSettingsStore';

import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  const { session, ready } = useAuthSession();
  const segments = useSegments();
  const router = useRouter();

  const fontsSettled = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (fontsSettled && ready) {
      SplashScreen.hideAsync();
    }
  }, [fontsSettled, ready]);

  // Auth guard: bejelentkezés nélkül csak az (auth) csoport érhető el, és
  // bejelentkezve nincs mit keresni a bejelentkező képernyőn.
  useEffect(() => {
    if (!ready) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/login');
    } else if (session && inAuthGroup) {
      router.replace('/');
    }
  }, [ready, session, segments, router]);

  // A lokálisan lezárt gyakorlatok feltöltése. Hálózatot nem figyelünk
  // (D-038): indításkor és minden előtérbe kerüléskor próbálkozunk, ez fedi
  // azt, ahogy az appot valójában használják.
  const signedIn = Boolean(session);
  useEffect(() => {
    if (!ready || !signedIn) {
      return;
    }

    // A regisztrációkor megadott gyerek profilja itt is újra próbálkozik, ha
    // korábban nem sikerült felvinni (pl. nem volt net) — D-050.
    void ensureChildProfile();
    void syncPendingSessions();

    // A szerver beállításai csak indításkor jönnek át (D-046), utána az
    // emlékeztetőt a rendszerben is újraütemezzük.
    void pullSettings().then(() => {
      const { reminderOn, reminderTime } = useSettingsStore.getState();
      return scheduleDailyReminder(reminderOn, reminderTime);
    });

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncPendingSessions();
      }
    });

    return () => subscription.remove();
  }, [ready, signedIn]);

  if (!fontsSettled || !ready) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
