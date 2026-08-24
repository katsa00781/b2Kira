import { Text, View } from 'react-native';

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
      className={`w-full rounded-[14px] px-4 py-[12px] ${isError ? 'bg-pink-150' : 'bg-green-100'}`}
    >
      <Text
        className={`text-center font-nunito-semibold text-[12px] ${
          isError ? 'text-pink-600' : 'text-green-700'
        }`}
      >
        {message}
      </Text>
    </View>
  );
}
