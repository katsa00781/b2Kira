# Prompt sablonok – Doboz Légzés

Minden Claude Code prompt így kezdődjön:

> **Olvasd el a CLAUDE.md-et és kövesd szigorúan.**

---

## UI képernyő építése

```
Olvasd el a CLAUDE.md-et és a docs/design-tokens.md-et, és kövesd szigorúan.

Implementáld a [képernyő neve] képernyőt a design-reference/00-teljes-canvas.html
[N]. képernyője alapján, pontosan. A színeket a constants/colors.ts-ből használd.

Navigáció: [pl. "a CTA gomb vigyen a /session route-ra"].
Ne változtasd meg: [mit ne bántson].
```

## Karakter komponens

```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.

Építsd meg a components/characters/[Név].tsx komponenst a
design-reference/[Név].html geometriája alapján, React Native View elemekből.
Ne használj képet vagy SVG-t.

Propok: mood ('happy' | 'breathing'), scale (0.5–1.5).
Alap doboz 90×90, a scale transform-mal skálázza az egészet.

Csak ezt az egy karaktert csináld meg, a többihez ne nyúlj.
```

## Animáció

```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.

Implementáld a [animáció neve] animációt react-native-reanimated-tel,
useSharedValue + withTiming/withSequence/withRepeat használatával.

Az animáció NE menjen át React state-en — a JS szál akadása nem ronthatja
el a ritmust.

Pontos időzítés és értékek: docs/design-tokens.md, "A légzőgyakorlat animáció" szakasz.
```

## State integráció

```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.

Integráld a [feature] state-et. Tárold a [adatot] Zustand-dal,
@react-native-async-storage/async-storage perzisztenciával.

Viselkedési szabály: [pl. "ha a gyereknek még nincs profilja, irányítsd a
regisztráció képernyőre"].

A meglévő UI-t pontosan őrizd meg.
```

## Supabase bekötés

```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.

Kösd be a [feature] Supabase szinkronját a breathing_[tábla] táblához.

Szabályok:
- A UI ne várjon hálózatra, a lokális state az igazság
- Nincs net → a művelet a lokális sorba kerül, később szinkronizál
- Csak breathing_ prefixű táblákhoz nyúlj
- Generált típusokat használj a types/supabase.ts-ből
```

## Konkrét hiba javítása

```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.

A [dolog] [tényleges viselkedés]. Helyes viselkedés: [elvárt viselkedés].
Semmilyen más viselkedést vagy layoutot ne változtass meg.
```

## Design egyeztetés (ha valami nem stimmel)

```
Olvasd el a docs/design-tokens.md-et.

Hasonlítsd össze a [fájl] jelenlegi értékeit a designban megadottakkal.
Listázd az eltéréseket táblázatban (elem | jelenlegi | design szerinti),
de még NE javíts semmit.
```

## Gyerek-tesztelés utáni finomhangolás

```
Olvasd el a CLAUDE.md-et és kövesd szigorúan.

A gyerekem kipróbálta, ez a visszajelzés: [mit mondott / mit csinált].

Javasolj 2-3 konkrét változtatást, amit ez indokol. Előbb írd le a javaslatot,
és csak a jóváhagyásom után implementáld.
```
