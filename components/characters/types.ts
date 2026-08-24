/**
 * A négy karakter (Bunny, Panda, Monkey, Lion) közös prop-szerződése.
 * Forrás: `docs/design-tokens.md` – „Karakterek”.
 */

export type CharacterMood = 'happy' | 'breathing';

export type CharacterProps = {
  /**
   * A design két hangulatot jelöl, de a referencia (`design-reference/*.html`)
   * mindkettőt ugyanúgy rajzolja — a prop megvan, a megjelenést egyelőre nem
   * változtatja. Lásd D-011.
   */
  mood: CharacterMood;
  /** 0.5 – 1.5. A 90×90-es dobozt skálázza, a középpontja körül. */
  scale: number;
};

/** Minden karakter ekkora dobozban él, a `scale` ezt nagyítja. */
export const CHARACTER_SIZE = 90;
