import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-purple-50">
      <Text className="font-baloo-extrabold text-[24px] text-text-heading">
        Doboz Légzés
      </Text>
      {/* Fejlesztői link – az 5. szakaszban a valódi kezdőképernyő váltja le. */}
      <Link href="/scratch-characters">
        <Text className="font-nunito-bold text-[13px] text-purple-600">
          Karakter teszt →
        </Text>
      </Link>
    </View>
  );
}
