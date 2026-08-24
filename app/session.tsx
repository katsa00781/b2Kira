import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, gradients } from '@/constants/colors';
import { shadows } from '@/constants/shadows';

/**
 * FEJLESZTŐI PLACEHOLDER. A valódi légzőgyakorlat a 6. szakaszban készül el,
 * és ez a fájl akkor teljesen lecserélődik. Most csak azért van itt, hogy a
 * kezdőképernyő CTA gombja tényleg vezessen valahova — és hogy a két scratch
 * képernyő elérhető maradjon (ship előtt mindkettő törlendő).
 */
export default function SessionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <LinearGradient
      colors={gradients.greenScreen.colors}
      locations={gradients.greenScreen.locations}
      style={styles.screen}
    >
      <View style={[styles.content, { paddingBottom: Math.max(BOTTOM_PADDING, insets.bottom) }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Vissza"
          hitSlop={5}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <View style={styles.backArrow} />
        </Pressable>

        <View className="flex-1 items-center justify-center gap-[12px]">
          <Text className="text-center font-baloo-extrabold text-[22px] text-green-700">
            Itt jön a légzőgyakorlat
          </Text>
          <Text className="text-center font-nunito-semibold text-[13px] text-text-subtle">
            A 6. szakasz építi meg ezt a képernyőt.
          </Text>

          <Link href="/scratch-characters" className="mt-[18px]">
            <Text className="font-nunito-bold text-[13px] text-purple-600">Karakter teszt →</Text>
          </Link>
          <Link href="/scratch-ui">
            <Text className="font-nunito-bold text-[13px] text-purple-600">
              Design rendszer teszt →
            </Text>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

const BOTTOM_PADDING = 28;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flex: 1,
    paddingTop: 62,
    paddingHorizontal: 22,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.backButton,
  },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: colors.green['500'],
    transform: [{ rotate: '45deg' }],
    marginLeft: 3,
  },
  pressed: { opacity: 0.6 },
});
