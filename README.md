# Doboz Légzés – projekt előkészítő csomag

Ez a mappa a fejlesztés indulásához szükséges dokumentációt tartalmazza. Másold be
egy az egyben az új Expo projekt gyökerébe.

```
CLAUDE.md                          # ezt olvassa Claude Code minden prompt előtt
docs/
  design-tokens.md                 # színek, tipográfia, spacing, animáció specifikáció
  feature-tasks.md                 # sprint feladatlista + munkanapló + döntésnapló
  prompt-sablonok.md               # kész promptok a fejlesztéshez
supabase/
  migrations/
    0001_breathing_schema.sql      # a 4 breathing_ tábla + RLS (MÉG NINCS lefuttatva)
design-reference/
  00-teljes-canvas.html            # a 6 képernyő eredeti forrása
  Bunny.html Panda.html
  Monkey.html Lion.html            # a 4 karakter pontos CSS geometriája
```

## Indulás

```bash
npx create-expo-app@latest doboz-legzes -t expo-template-blank-typescript
cd doboz-legzes
# ide másold be ennek a mappának a tartalmát
```

Utána nyisd meg Claude Code-ban, és az első prompt:

> Olvasd el a CLAUDE.md-et és a docs/feature-tasks.md-et és kövesd szigorúan. Kezdd a 0. Setup szakasszal.

## Amit még el kell döntened / meg kell csinálnod

- **Az SQL migráció még nincs lefuttatva.** Olvasd át, mielőtt ráengeded a familyBudget
  adatbázisra. A meglévő táblákhoz nem nyúl, csak új `breathing_` prefixű táblákat hoz létre.
- **Hangfájlok** – 2-3 halk, rövid hang kell fázisváltáshoz (`assets/sounds/`).
  Ingyenes forrás: freesound.org, vagy generálhatod is.
- **App ikon és splash** – a design canvasban nincs. A Bunny karakterből érdemes kiindulni.
- **Apple Developer fiók** – TestFlighthez kell (99 USD/év). Enélkül Expo Go-val
  tesztelhetsz a saját telefonodon, ami v1-hez bőven elég.

## Design research (opcionális, de segít)

Ha finomítani akarod a designt, mielőtt kódolsz:

- Pinterest: `kids breathing app UI`, `calm app for children` → 15 referencia
- Dribbble: ugyanez → 10 referencia
- Mobbin: valós app flow-k (Headspace Kids, Breathe, Moshi)
