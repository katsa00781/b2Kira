import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/constants/colors';
import { contentMaxWidth, s } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { usePressed } from '@/hooks/usePressed';

type ParentGateProps = {
  /** A helyes válasz után hívjuk — ekkor jelenik meg a beállítás képernyő. */
  onUnlock: () => void;
  onCancel: () => void;
};

/**
 * Szülői zár a beállítások előtt (CLAUDE.md: „egyszerű matematikai kérdés, nem
 * PIN”). Egy 7–9 éves gyereknek egy kétjegyű szorzás elég akadály, a szülőnek
 * pedig nem kell jelszót megjegyeznie.
 *
 * Rossz válasznál nincs „elrontottad” hangulat és nincs próbálkozás-limit —
 * csak új feladatot kap, és mehet tovább.
 */
export function ParentGate({ onUnlock, onCancel }: ParentGateProps) {
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState(false);

  // Új kérdés minden körben. A `round` a memo kulcsa.
  const question = useMemo(() => createQuestion(), [round]); // eslint-disable-line react-hooks/exhaustive-deps

  function answer(value: number) {
    if (value === question.answer) {
      onUnlock();
      return;
    }

    setWrong(true);
    setRound((current) => current + 1);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title} className="text-center font-baloo-extrabold text-text-heading">
          Szülői zár
        </Text>
        <Text style={styles.lead} className="text-center font-nunito-semibold text-text-subtle">
          A beállítások a szülőké. Válaszolj a kérdésre a folytatáshoz.
        </Text>

        <View style={styles.card}>
          <Text style={styles.question} className="text-center font-baloo-extrabold text-text-heading">
            Mennyi {question.a} × {question.b}?
          </Text>

          <View style={styles.options}>
            {question.options.map((option) => (
              <AnswerButton key={option} label={option} onPress={() => answer(option)} />
            ))}
          </View>
        </View>

        {wrong ? (
          <Text style={styles.retry} className="text-center font-nunito-semibold text-text-subtle">
            Nem talált — itt egy másik kérdés.
          </Text>
        ) : null}

        <View style={styles.cancel}>
          <PrimaryButton label="Mégsem" onPress={onCancel} variant="purple" />
        </View>
      </View>
    </View>
  );
}

function AnswerButton({ label, onPress }: { label: number; onPress: () => void }) {
  const { pressed, pressHandlers } = usePressed();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}`}
      onPress={onPress}
      {...pressHandlers}
      // A `style` itt nem lehet függvény — lásd D-026.
      style={[styles.option, pressed && styles.optionPressed]}
    >
      <Text style={styles.optionLabel} className="text-center font-baloo-extrabold text-purple-600">
        {label}
      </Text>
    </Pressable>
  );
}

type Question = { a: number; b: number; answer: number; options: number[] };

/** Két egyjegyű szám szorzata, három válaszlehetőséggel. */
function createQuestion(): Question {
  const a = 3 + Math.floor(Math.random() * 7); // 3–9
  const b = 3 + Math.floor(Math.random() * 7); // 3–9
  const answer = a * b;

  const options = new Set<number>([answer]);
  while (options.size < 3) {
    const offset = 1 + Math.floor(Math.random() * 9);
    const wrong = Math.random() < 0.5 ? answer + offset : answer - offset;
    if (wrong > 0) {
      options.add(wrong);
    }
  }

  return { a, b, answer, options: shuffle([...options]) };
}

function shuffle(values: number[]): number[] {
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.screen.settings, justifyContent: 'center' },
  content: {
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: s(22),
    gap: s(12),
  },
  title: { fontSize: s(22) },
  lead: { fontSize: s(13) },
  card: {
    marginTop: s(10),
    backgroundColor: colors.white,
    borderRadius: s(18),
    padding: s(18),
    gap: s(18),
    boxShadow: shadows.card,
  },
  question: { fontSize: s(20) },
  options: { flexDirection: 'row', gap: s(8) },
  option: {
    flex: 1,
    paddingVertical: s(14),
    borderRadius: s(14),
    backgroundColor: colors.purple['100'],
  },
  optionPressed: { opacity: 0.7 },
  optionLabel: { fontSize: s(17) },
  retry: { fontSize: s(12) },
  cancel: { marginTop: s(10) },
});
