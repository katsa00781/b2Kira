import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { shadows } from '@/constants/shadows';
import type { Character, CharacterId } from '@/data/characters';
import { characters } from '@/data/characters';
import { usePressed } from '@/hooks/usePressed';

type CharacterPickerProps = {
  value: CharacterId;
  onChange: (characterId: CharacterId) => void;
};

/**
 * Karakterválasztó a kezdőképernyőn (`00-teljes-canvas.html`, 3. képernyő):
 * négy 36×36-os kör, 135°-os gradienssel, a kiválasztotton 3 px lila keret.
 */
export function CharacterPicker({ value, onChange }: CharacterPickerProps) {
  return (
    <View style={styles.row}>
      {characters.map((character) => (
        <CharacterChip
          key={character.id}
          character={character}
          selected={character.id === value}
          onSelect={() => onChange(character.id)}
        />
      ))}
    </View>
  );
}

type CharacterChipProps = {
  character: Character;
  selected: boolean;
  onSelect: () => void;
};

function CharacterChip({ character, selected, onSelect }: CharacterChipProps) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={character.name}
      // A design 36 px-es chipje kisebb a 44 pt-os célterületnél (D-017).
      hitSlop={4}
      onPress={onSelect}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipPlain,
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={character.chipColors}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={styles.fill}
      />
    </Pressable>
  );
}

/** `linear-gradient(135deg, …)` = bal felső sarokból a jobb alsóba. */
const GRADIENT_START = { x: 0, y: 0 } as const;
const GRADIENT_END = { x: 1, y: 1 } as const;

const CHIP_SIZE = 36;
const BORDER_WIDTH = 3;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  chip: {
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    borderRadius: CHIP_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    overflow: 'hidden',
    boxShadow: shadows.characterChip,
  },
  chipSelected: { borderColor: colors.purple['600'] },
  chipPlain: { borderColor: 'transparent' },
  fill: {
    flex: 1,
    borderRadius: CHIP_SIZE / 2 - BORDER_WIDTH,
  },
  pressed: { opacity: 0.8 },
});
