import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/constants/colors';
import { shadows } from '@/constants/shadows';

type TextFieldProps = Omit<TextInputProps, 'placeholderTextColor'> & {
  /** A mező fölötti címke – „Szülő e-mail címe", „Gyermek neve". */
  label: string;
};

/**
 * Címkés beviteli mező a design 1. és 2. képernyőjéről: fehér kártya,
 * 14-es radius, halvány lila árnyék.
 *
 * A beírt szöveg színe `text.body`; a designban minden mező kitöltött értéke
 * placeholder-színű, mert az csak makett (lásd D-016).
 */
export function TextField({ label, ...inputProps }: TextFieldProps) {
  return (
    <View className="gap-[6px]">
      <Text className="font-nunito-bold text-[12px] text-text-label">{label}</Text>
      <TextInput
        className="rounded-[14px] bg-white px-4 py-[14px] font-nunito-semibold text-[14px] text-text-body"
        placeholderTextColor={colors.text.placeholder}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { boxShadow: shadows.input },
});
