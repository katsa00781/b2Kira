import { Tabs } from 'expo-router';

/**
 * A designban egyetlen képernyőn sincs alsó tab bar: a kezdőképernyő a hub,
 * onnan nyílik a matricagyűjtemény és a szülői beállítások. A `(tabs)` csoport
 * megmarad (CLAUDE.md mappastruktúra), csak a sáv nem jelenik meg — lásd D-025.
 */
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={() => null}>
      <Tabs.Screen name="index" options={{ title: 'Kezdés' }} />
    </Tabs>
  );
}
