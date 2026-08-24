import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useAuthSession } from '@/hooks/useAuthSession';

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
