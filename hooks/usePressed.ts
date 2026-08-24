import { useState } from 'react';

/**
 * Lenyomott állapot `Pressable`-höz.
 *
 * A `style={({ pressed }) => …}` függvény alakot **nem** használhatjuk: a
 * NativeWind interop elnyeli, és akkor a komponens teljes stílusa elveszik
 * (háttér, keret, méret) — nem csak a lenyomott állapot. Lásd D-026.
 */
export function usePressed() {
  const [pressed, setPressed] = useState(false);

  return {
    pressed,
    /** Terítsd szét a `Pressable`-ön: `{...pressHandlers}`. */
    pressHandlers: {
      onPressIn: () => setPressed(true),
      onPressOut: () => setPressed(false),
    },
  };
}
