import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/constants/colors';
import { s } from '@/constants/layout';
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
    <View style={styles.field}>
      <Text style={styles.label} className="font-nunito-bold text-text-label">
        {label}
      </Text>
      <TextInput
        className="bg-white font-nunito-semibold text-text-body"
        placeholderTextColor={colors.text.placeholder}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: s(6) },
  label: { fontSize: s(12) },
  input: {
    borderRadius: s(14),
    paddingHorizontal: s(16),
    paddingVertical: s(14),
    fontSize: s(14),
    boxShadow: shadows.input,
  },
});
