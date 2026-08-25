import { StyleSheet, Text, View } from 'react-native';

import { s } from '@/constants/layout';

type FormMessageProps = {
  /** `error` – rózsaszín kártya; `success` – zöld kártya. */
  tone: 'error' | 'success';
  message: string;
};

/**
 * Űrlap visszajelzés az elsődleges gomb fölött. A designban nincs hibaállapot,
 * ezért a két kártya színe a meglévő palettából jött — lásd D-020.
 */
export function FormMessage({ tone, message }: FormMessageProps) {
  const isError = tone === 'error';

  return (
    <View
      accessibilityRole="alert"
      style={styles.card}
      className={isError ? 'bg-pink-150' : 'bg-green-100'}
    >
      <Text
        style={styles.message}
        className={`text-center font-nunito-semibold ${
          isError ? 'text-pink-600' : 'text-green-700'
        }`}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: s(14),
    paddingHorizontal: s(16),
    paddingVertical: s(12),
  },
  message: { fontSize: s(12) },
});
