import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { shadows } from '@/constants/shadows';
import { usePressed } from '@/hooks/usePressed';

export type SegmentedOption<T> = {
  value: T;
  label: string;
};

type SegmentedChoiceProps<T extends string | number> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * Vízszintes választó egyenlő szélességű elemekből
 * (`00-teljes-canvas.html`, 6. képernyő – „Gyakorlat hossza").
 *
 * A design 10 px-es függőleges paddingja ~38 px magas elemet ad; a `hitSlop`
 * ezt látvány nélkül 46 px-re növeli, hogy a 44 pt-os célterület meglegyen.
 */
export function SegmentedChoice<T extends string | number>({
  options,
  value,
  onChange,
}: SegmentedChoiceProps<T>) {
  return (
    <View className="flex-row gap-[8px]">
      {options.map((option) => (
        <Segment
          key={option.value}
          label={option.label}
          selected={option.value === value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}

type SegmentProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

function Segment({ label, selected, onSelect }: SegmentProps) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      hitSlop={HIT_SLOP}
      onPress={onSelect}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.item, selected ? styles.itemSelected : styles.itemIdle, pressed && styles.pressed]}
    >
      <Text
        className="text-center font-nunito-bold text-[13px]"
        style={{ color: selected ? colors.white : colors.text.muted }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const HIT_SLOP = { top: 4, bottom: 4 } as const;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
  },
  itemSelected: {
    backgroundColor: colors.purple['600'],
  },
  itemIdle: {
    backgroundColor: colors.white,
    boxShadow: shadows.segment,
  },
  pressed: { opacity: 0.7 },
});
