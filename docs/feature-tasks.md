# Feature task lista – Doboz Légzés v1

A sorrend számít. Minden feature után teszteld éles iPhone-on Expo Go-val, mielőtt
továbbmész. Ne kezdj bele a következőbe, amíg az előző nem működik.

> **Ez a fájl egyben munkanapló is.** Minden elvégzett feladat után ki kell pipálni a
> sort, be kell írni a munkanapló bejegyzést a fájl végére, és commitolni kell.
> A részletes szabályok a `CLAUDE.md` „Munkanapló és commitok" szakaszában vannak.

---

## ✅ Lezárt kérdés – a doboz légzés a logopédus által kiadott feladat

**Státusz:** LEZÁRVA (2026-08-24). Lásd `D-003` a Döntésnaplóban.

Korábban itt egy nyitott kérdés szerepelt: a dadogásra ténylegesen használt
logopédiai technikák (lágy hangindítás, nyújtott beszéd, könnyű artikulációs
érintés) a kutatás szerint nem légzésforma-gyakorlatok, ezért felmerült, hogy a
doboz légzés esetleg nem a megfelelő irány, és meg kellett volna kérdezni a
gyerek logopédusát, mielőtt bármilyen dadogás-specifikus tartalmat beépítünk.

**A válasz megvan:** a doboz légzést maga a logopédus adta fel gyakorlásra a
gyereknek. Ez azt jelenti, hogy az app eddigi és jelenlegi iránya — a
`docs/design-tokens.md`-ben rögzített pontos 4-4-4-4 ritmus — **helyes és
terapeuta által jóváhagyott**, nem kell más technikára váltani.

**Fontos, ami emiatt megváltozik a fejlesztésben:**
- Az app most már nem "általános nyugtató légzés-app", hanem **kifejezetten
  ehhez a gyerekhez, az ő logopédusi feladatához igazított gyakorló eszköz.**
  Ez erősíti (nem gyengíti) az eddigi szabályt: a `docs/design-tokens.md`-ben
  rögzített időzítést és ritmust **még szigorúbban** tilos "javítani" vagy
  variálni engedély nélkül — ez most már nem csak design-hűség kérdése, hanem
  a kiadott terápiás feladatnak való megfelelés kérdése is.
- Érdemes **rákérdezni a logopédusnál** (nem blokkoló, de hasznos lenne
  tudni): pontosan 4-4-4-4 másodperces ütemet kért-e, vagy más számot; naponta
  hányszor kéri a gyakorlást; van-e olyan szempont (pl. hangos számolás,
  konkrét testtartás), amit ő maga használ, és amit érdemes lenne az appban is
  megjeleníteni.
- A `CLAUDE.md` „Projekt áttekintés" és „Kire tervezünk" szakaszát érdemes
  frissíteni úgy, hogy explicit említse: az app egy logopédus által kiadott
  otthoni gyakorlófeladatot támogat. (Ez még nincs átvezetve — ha szeretnéd,
  szólj, és megcsinálom.)

**Korábbi kutatási források** (továbbra is hasznos háttér, ha később bármilyen
más logopédiai elemet — pl. hangindítást — is be akarnátok építeni):
- [Dadogás gyerekkorban – Dr. Pukoli Dániel](https://www.drpukolidaniel.hu/dadogas-gyerekkorban-okok-fajtak-kezeles-es-otthoni-segitseg/) — óv az ad-hoc légzési utasításoktól, egyéni logopédusi javaslatot javasol
- [Öt légzőgyakorlat nyugtalan gyermekek lecsillapítására – Logopédia mindenkinek](https://logopedia-mindenkinek.blog.hu/2020/02/16/5legzogyakorlat) — általános nyugtató gyakorlatok
- [Speech Therapy for Stuttering: Exercises – Speech And Language Kids](https://www.speechandlanguagekids.com/stuttering-therapy-activity-ideas/) — fluency shaping technikák (easy onset, prolonged speech, light contact)

---

## 0. Setup (egyszeri)

- [x] Expo projekt: `npx create-expo-app@latest doboz-legzes -t expo-template-blank-typescript`
- [x] `git init`, első commit: `init`
- [x] `.env` és `.env.example` létrehozása, `.env` a `.gitignore`-ba
- [x] NativeWind telepítése és konfigurálása (`tailwind.config.js`, `babel.config.js`, `global.css`)
- [x] Expo Router bekötése (`app/_layout.tsx`, `expo-router/entry`)
- [x] `react-native-reanimated` telepítése + babel plugin (**legyen a plugin lista utolsó eleme**)
- [x] Betűtípusok: `@expo-google-fonts/baloo-2`, `@expo-google-fonts/nunito`, `expo-font`
- [x] `constants/colors.ts` és `constants/typography.ts` a `docs/design-tokens.md` alapján
- [x] `constants/images.ts` létrehozása (üresen is)
- [x] Lint + typecheck script bekötése (`npm run lint`, `npm run typecheck`)
- [x] `CLAUDE.md`, `docs/`, `design-reference/`, `supabase/` bemásolása a projekt gyökerébe
- [ ] Push GitHubra (privát repó)

## 1. Supabase alapok

- [x] `0001_breathing_schema.sql` átolvasása, majd futtatása a familyBudget projekten
- [x] SQL editorban ellenőrizni: a 4 tábla létrejött, RLS mindegyiken bekapcsolva
- [x] `lib/supabase.ts` – kliens AsyncStorage session perzisztenciával
- [x] Típusgenerálás: `supabase gen types typescript --project-id eguhipjgnhbajbmnrskm > types/supabase.ts`
- [x] Kézi próba: egy teszt user regisztrálása, `breathing_children` sor beszúrása, majd
      ellenőrizni, hogy **másik** userrel nem látszik

## 2. Karakterek

- [x] `components/characters/Bunny.tsx` a `design-reference/Bunny.html` geometriája alapján
- [x] Panda, Monkey, Lion ugyanígy
- [x] `mood: 'happy' | 'breathing'` és `scale: number` prop mindegyiken
- [x] `data/characters.ts` – id, magyar név, chip gradiens színek
- [x] Ellenőrzés: egy scratch képernyőn mind a 4 karakter megjelenik, `scale` csúszkával

> Ez a legkényesebb rész. Egyesével csináld, karakterenként külön prompt, külön commit.

## 3. Design rendszer komponensek

- [x] `PrimaryButton` (lila + zöld variáns, gradiens, árnyék)
- [x] `TextField` (címke + input, placeholder szín, árnyék)
- [ ] `ProgressBar` (gradiens kitöltés)
- [ ] `Twinkles` (animált díszpöttyök a lila képernyőkhöz)
- [ ] `ToggleRow` (kapcsoló + címke + alcím)
- [ ] `SegmentedChoice` (gyakorlathossz választó)

## 4. Auth képernyők (1–2. képernyő)

- [ ] `app/(auth)/login.tsx` – design szerint pontosan
- [ ] `app/(auth)/register.tsx` – design szerint pontosan
- [ ] Supabase e-mail/jelszó bejelentkezés és regisztráció bekötése
- [ ] Regisztrációkor `breathing_children` sor létrehozása (név + életkor)
- [ ] „Elfelejtett jelszó?" – Supabase `resetPasswordForEmail`, magyar visszajelzéssel
- [ ] Regisztráció checkbox („Elfogadom, hogy a szülő felügyeli a fiókot") kötelező mező
- [ ] Hibaüzenetek magyarul, barátságosan (nem „Invalid credentials")
- [ ] Session perzisztencia: app újraindítás után bejelentkezve marad
- [ ] Auth guard: bejelentkezés nélkül a `(tabs)` nem érhető el

## 5. Kezdőképernyő (3. képernyő)

- [ ] `app/(tabs)/index.tsx` – design szerint pontosan
- [ ] `store/useChildStore.ts` – gyerek profil, karakter, szint, streak, Zustand + persist
- [ ] Karakterválasztó működik, a választás azonnal látszik és perzisztálódik
- [ ] Szintkártya és progress bar valós adatból (befejezett gyakorlatok száma)
- [ ] Napi tipp: 7 tipp `data/`-ban, a hét napja szerint váltakozik
- [ ] CTA gomb navigál a `session` képernyőre

## 6. Légzőgyakorlat (4. képernyő) — **a projekt szíve**

- [ ] `hooks/useBreathingCycle.ts` – Reanimated shared value, 4×4 mp, `withRepeat`
- [ ] `components/BreathingBox.tsx` – animált méret, radius és szín
- [ ] `components/PhaseDots.tsx`
- [ ] Karakter a doboz fölött, **ugyanabból** a shared value-ból skálázva
- [ ] Fázisfelirat váltása
- [ ] Session timer, hátralévő idő `m:ss`, alsó progress bar
- [ ] Szünet / Folytatás – ott áll meg, ahol van
- [ ] `expo-keep-awake` a gyakorlat alatt
- [ ] `AppState` háttérbe kerüléskor automatikus szünet
- [ ] Vissza gomb: megerősítés nélkül kilép, a részleges session elmentődik

> **Teszt:** 5 percen át fusson, és a 4-4-4-4 ritmus a végén is pontos legyen.
> Ha csúszik, az animáció valahol React state-en megy át — javítsd.

## 7. Hang, beszéd, haptika

- [ ] `lib/haptics.ts` – fázisváltás visszajelzés
- [ ] `lib/speech.ts` – `expo-speech`, `hu-HU`, `rate: 0.85`, előző mondat leállítása
- [ ] `assets/sounds/` – 2-3 halk hang, `expo-audio` lejátszás
- [ ] Hiányzó hangfájl ne dobjon hibát
- [ ] iOS néma kapcsoló: hang néma, haptika megy
- [ ] Mindhárom külön kapcsolható, azonnali hatállyal

> **Teszt a gyerekkel:** ha csukott szemmel is tudja követni, jó. Ha nézni kell hozzá a
> képernyőt, a hang túl halk vagy túl késői.

## 8. Session mentés és offline sor

- [ ] Gyakorlat végén `breathing_sessions` sor beszúrása
- [ ] Nincs net → lokális sorba kerül AsyncStorage-ba
- [ ] `lib/sync.ts` – app indításkor és net visszatérésekor kiüríti a sort
- [ ] Duplikáció elleni védelem (lokális id)

## 9. Matricák és streak (5. képernyő)

- [ ] `data/stickers.ts` – 9 matrica katalógus a design szerint
- [ ] `app/(tabs)/stickers.tsx` – 3×3 rács, feloldott és zárolt állapot
- [ ] Feloldási logika: minden 5. befejezett gyakorlat
- [ ] Streak számítás naptári napokban, helyi idő szerint
- [ ] „Következő jelvény" kártya valós adatból
- [ ] Ünneplő visszajelzés feloldáskor (rövid, nem modal)

## 10. Szülői beállítások (6. képernyő)

- [ ] `app/(tabs)/settings.tsx` – design szerint pontosan
- [ ] 3 kapcsoló → `store/useSettingsStore.ts` + `breathing_settings` szinkron
- [ ] Gyakorlathossz: 1 perc / 2-3 perc / 5 perc (60 / 150 / 300 mp)
- [ ] Napi emlékeztető idő választó
- [ ] `expo-notifications` – napi helyi értesítés a beállított időpontban
- [ ] Szülői zár: egyszerű matematikai kérdés (pl. „Mennyi 7 × 8?") a beállítások előtt
- [ ] Kijelentkezés a szülői zár mögött

---

## Ship előtt

- [ ] Teljes flow tesztelése éles iPhone-on: regisztráció → gyakorlat → matrica → beállítás
- [ ] Edge case-ek: nincs net, lassú net, hosszú gyerek név, 0 befejezett gyakorlat,
      minden matrica feloldva, app háttérbe kerül gyakorlat közben, telefon elforgatása
- [ ] Kisebb képernyő teszt (iPhone SE) – nem csúszik-e ki a doboz
- [ ] Lint + typecheck hibák nélkül
- [ ] CodeRabbit code review az AI által írt feature-ökre
- [ ] Dev utilities eltávolítása (teszt gombok, `console.log`-ok, mock data)
- [ ] Analitika: **gyereknév és e-mail soha ne kerüljön eventbe**
- [ ] Secrets ellenőrzése: kliens bundle + teljes git history
- [ ] RLS újraellenőrzése: két külön fiókkal, hogy A ne lássa B gyerekének adatait
- [ ] EAS Build production binary, tesztelés éles eszközön
- [ ] TestFlight feltöltés

---

## Amit v1-be szándékosan NEM teszünk bele

- Több gyerek profil egy fiók alatt (a séma bírja, de a UI nem kezeli)
- Egyéb légzéstechnikák (4-7-8, hasi légzés)
- Statisztika / grafikon képernyő a szülőnek
- Android kiadás (Expo bírja, de a tesztelés iOS-en fókuszál)
- Testreszabható matricák, karakter-boltok, in-app vásárlás
- Offline hangcsomag magyar TTS-hez

---
---

# Munkanapló

Minden befejezett feladat után ide kerül egy bejegyzés, **legfelülre** (fordított
időrend, a legfrissebb legyen elöl). Ugyanabba a commitba, mint a kód.

Sablon:

```
## ÉÉÉÉ-HH-NN – [feladat neve]

**Mit:** egy-két mondat arról, mi készült el.
**Fájlok:** app/session.tsx, hooks/useBreathingCycle.ts, components/BreathingBox.tsx
**Tesztelve:** iPhone 13, Expo Go — 5 perces session, ritmus pontos
**Nyitva maradt:** a szünet gomb után az első fázis 200 ms-ot csúszik
**Commit:** feat: légzőgyakorlat képernyő reanimated animációval
```

<!-- ÚJ BEJEGYZÉSEK IDE, LEGFELÜLRE -->

## 2026-08-25 – fix: „private properties are not supported" (Hermes)

**Mit:** A production build `Syntax error: private properties are not supported`
hibával elhasalt. Nem a mi kódunk okozta: a `react-native/src/private/webapis/
geometry/DOMRectReadOnly.js` `#private` osztálymezőket használ, és a projektben a
`babel-preset-expo@57.0.8` volt telepítve (az SDK 55+ presetje), ami már nem
fordítja le ezt a szintaxist, mert újabb Hermes-t feltételez. Az SDK 54 `hermesc`-je
viszont nem ismeri a privát mezőket, így a bytecode fordítás hasalt el. A preset
verziója az Expo 54-hez lett igazítva (`~54.0.12`), és ezzel a hiba megszűnt.
Ez lezárja a 0. Setup bejegyzés két nyitott pontját (a sikertelen `expo export`-ot
és a `babel-preset-expo` verzióeltérést). Lásd D-013.

**Fájlok:** package.json, package-lock.json

**Tesztelve:**
- `npx expo export --platform ios --clear` most **lefut**: 3,73 MB Hermes bytecode
  (`.hbc`) készül. Előtte ugyanez a parancs hibalistával állt le.
- A javítás után a dev bundle is rendben (`dev=true`, 8,9 MB, HTTP 200), és
  `this.#` privát mező **0 db** maradt benne.
- **A reanimated worklet plugin a régebbi presettel is aktív** (`__workletHash`
  466 példányban a bundle-ben) — a D-004 döntés tehát továbbra is érvényes,
  nem kell kézzel felvenni a plugint.
- NativeWind is fordul (`#F3EEFA`, `#5B3E8C` benne a bundle-ben), a karakterkód
  szintén (`boxShadow`, `skewY`).
- `npm run typecheck` és `npm run lint` hibátlan.

**Nyitva maradt:** semmi ehhez a hibához. A `npm install` továbbra is jelez
néhány audit figyelmeztetést a fejlesztői függőségekben, ezekhez nem nyúltam.

**Commit:** `fix: babel-preset-expo az Expo 54-hez igazítva`


## 2026-08-25 – 2. Karakterek

**Mit:** Elkészült mind a négy karakter (`Bunny`, `Panda`, `Monkey`, `Lion`) tiszta
`<View>` geometriából, a `design-reference/*.html` értékeiből 1:1-ben átszámolva.
Mindegyik a specifikált `{ mood, scale }` propot kapja. A karakterszínek bekerültek
a `constants/palette.json`-be (`character.bunny…lion`), így komponensben egyetlen
hex érték sincs. Mellé a `data/characters.ts` katalógus (id, magyar név, chip
gradiens színpár) és egy `characterComponents` id→komponens map, hogy a képernyők
ne ágazzanak négyfelé. A `mood` prop egyelőre nem változtat a rajzon (D-011).
Ellenőrzésre készült egy fejlesztői `app/scratch-characters.tsx` képernyő, ami
mind a négy karaktert egyszerre mutatja állítható `scale`-lel (0.5–1.5) és
`mood`-dal; a kezdőképernyő placeholderére került hozzá egy ideiglenes link.

**Fájlok:** components/characters/Bunny.tsx, Panda.tsx, Monkey.tsx, Lion.tsx,
components/characters/types.ts, components/characters/index.ts,
data/characters.ts, constants/palette.json, app/scratch-characters.tsx,
app/(tabs)/index.tsx

**Tesztelve:** `npm run typecheck` és `npm run lint` hibátlan. A Metro iOS
production bundle (`dev=false&minify=true`, 2,4 MB) hiba nélkül lefordul, a
karakterkód (`boxShadow` ×28, `skewY` ×10, a katalógus nevei) benne van.
**Éles iPhone-on Expo Go-val még nincs megnézve — ez a következő lépés**, és
kifejezetten a lentebb felsorolt három RN-specifikus dolgot kell megnézni rajta.

**Nyitva maradt:**
- **Eszközön ellenőrizendő (nem tudtam szimulátor nélkül):** (1) a százalékos
  `borderRadius` (pofik, orr, panda szemfolt, majom pofa) valóban ellipszist
  rajzol-e; (2) a `boxShadow` string megjelenik-e (új architektúra kell hozzá,
  Expo Go SDK 54-en alapértelmezett); (3) az oroszlán sörény cikkelyei
  (`skewY` + `overflow: hidden`) jól vágódnak-e körre. Ha bármelyik nem jó,
  a D-009 / D-010 bejegyzés írja le, mi a visszaút.
- A karakterek **magyar nevei** (Nyuszi, Panda, Majom, Oroszlán) nem szerepelnek
  a designban, én választottam őket. A UI-ban jelenleg sehol nem látszanak (a
  chip csak szín), szóval szabadon átírhatók.
- A `mood` prop nem csinál semmit (D-011). Ha a `breathing` állapotban mást
  szeretnél (pl. csukott szem), az egy külön design döntés.
- Az `app/scratch-characters.tsx` és a kezdőképernyőre tett „Karakter teszt →"
  link **fejlesztői segédlet, ship előtt törlendő** (a „Ship előtt" lista
  „Dev utilities eltávolítása" sora fedi).
- A bunny orra a designban elliptikus sarkú (`50% / 60% 40%`), RN-ben ez nem
  kifejezhető, sima `50%` lett — 8×6 px-en nem látszik, de rögzítve van.

**Commitok:** `feat: Bunny karakter komponens`, `feat: Panda karakter komponens`,
`feat: Monkey karakter komponens`, `feat: Lion karakter komponens`,
`feat: karakter katalógus és közös index`, `chore: karakter scratch képernyő`


## 2026-08-24 – 1. Supabase alapok

**Mit:** A `breathing_` séma lefutott a familyBudget projekten (`0001`), majd egy
követő migráció (`0002`) szűkítette a két saját `SECURITY DEFINER` függvény
EXECUTE jogát. Elkészült a Supabase kliens AsyncStorage session-perzisztenciával
és előtér-függő token frissítéssel, valamint a generált — `breathing_` táblákra
szűkített — típusfájl. Két új dependency: `@supabase/supabase-js` és
`@react-native-async-storage/async-storage` (mindkettő a CLAUDE.md tech stack
listáján szerepel).

**Fájlok:** supabase/migrations/0001_breathing_schema.sql,
supabase/migrations/0002_breathing_function_grants.sql, lib/supabase.ts,
types/supabase.ts, package.json, package-lock.json

**Tesztelve:**
- Séma: mind a 4 tábla létrejött, RLS mindegyiken `true`, a policy-k a helyükön
  (children 4 db, sessions/stickers/settings 1-1 `for all`).
- **RLS izoláció, két külön fiókkal** (szimulált JWT claim-mel, lásd lentebb):
  A beszúrt gyereket/session-t/matricát → látja a sajátját; a trigger
  automatikusan létrehozta a `breathing_settings` sort `medium` alapértékkel.
  B mind a négy táblában **0 sort** lát, id szerint sem éri el A gyerekét,
  `insert`-je A `parent_id`-jával és A gyerekéhez RLS hibára fut (42501),
  `update`/`delete`-je 0 sort érint. Az `anon` szerep szintén 0 sort lát.
  A tesztadat és a két teszt auth user utána törölve, az adatbázis üresen maradt.
- A jogszűkítés után újra ellenőrizve, hogy a tulajdonos továbbra is ír és olvas
  mind a négy táblát (a policy-k a `breathing_owns_child`-ot hívják).
- Kliens: `npm run typecheck` és `npm run lint` hibátlan. Metro iOS dev bundle
  (8,9 MB) hiba nélkül lefordul a klienssel együtt — a supabase-js és az
  AsyncStorage feloldódik. **A bundle-ben csak az anon kulcs van benne**
  (a benne talált egyetlen JWT payload-ja `"role":"anon"`), service role kulcs
  vagy `sb_secret_` minta nincs.

**Nyitva maradt:**
- **A signUp-ot nem sikerült éles hálózaton kipróbálni:** a projekt beépített
  SMTP-je `email rate limit exceeded` hibát ad (az e-mail megerősítés be van
  kapcsolva, és az óránkénti keret elfogyott). Ezért az RLS-t a policy szintjén,
  `set local role authenticated` + `set_config('request.jwt.claims', …)`
  szimulációval ellenőriztem, ami pontosabb is, de a **valódi signUp →
  bejelentkezés → PostgREST kör még nincs végigjátszva.** Ez a 4. szakaszban
  (auth képernyők) úgyis sorra kerül; addigra érdemes vagy saját SMTP-t
  beállítani, vagy a Supabase Auth beállításaiban kikapcsolni az e-mail
  megerősítést tesztidőre.
- A `types/supabase.ts` szűrt fájl: újragenerálás után a szűrést kézzel újra el
  kell végezni (lásd D-007). Automatizáló script nincs hozzá.
- Az Expo figyelmeztet, hogy a `babel-preset-expo@57.0.8` helyett `~54.0.10`
  lenne az elvárt verzió. Nem nyúltam hozzá, mert a 0. szakaszban ezzel épült
  minden és működik — de a következő `npx expo install --fix` ezt átírja.
- `react-native-url-polyfill` nincs telepítve, és a supabase-js sem húzza be.
  A dev bundle lefordul nélküle; ha éles eszközön URL-lel kapcsolatos hibát
  látnánk, ez az első gyanúsított.

**Commitok:** `db: breathing_ táblák migrációja a familyBudget projekten`,
`feat: Supabase kliens és generált típusok`


## 2026-08-24 – 0. Setup szakasz

**Mit:** A projekt alapja készen áll. Az Expo SDK 54 sablon demo tartalma
(explore/modal képernyők, themed komponensek, react-logo assetek,
`reset-project` script) törölve. NativeWind 4.2.6 bekötve (babel jsxImportSource,
metro `withNativeWind`, `global.css`, tailwind config), Baloo 2 és Nunito
betűtípusok betöltése a root layoutban splash screennel, design tokenek
(`constants/palette.json`, `colors.ts`, `typography.ts`, `images.ts`),
`.env` + `.env.example` a Supabase anon kulccsal, `npm run lint` és
`npm run typecheck` scriptek.

**Fájlok:** app/_layout.tsx, app/(tabs)/_layout.tsx, app/(tabs)/index.tsx,
babel.config.js, metro.config.js, tailwind.config.js, global.css,
nativewind-env.d.ts, constants/palette.json, constants/colors.ts,
constants/typography.ts, constants/images.ts, package.json, eslint.config.js,
.gitignore, .env.example

**Tesztelve:** `npm run typecheck` és `npm run lint` hibátlan. Metro dev bundle
(iOS, `expo start` + bundle letöltés) sikeresen fordul, a NativeWind osztályok
lefordulnak: a `bg-purple-50` és `text-text-heading` értékei (`#f3eefa`,
`#5b3e8c`) benne vannak a bundle-ben, a Baloo betűcsalád is. A reanimated
worklet babel plugin aktív (babel transzformáció ellenőrizve).
**Éles iPhone-on Expo Go-val még nincs tesztelve — ez a következő lépés előtt
esedékes.**

**Nyitva maradt:**
- **Push GitHubra** (privát repó) – nem futtattam, engedélyre vár, és nincs
  beállítva remote.
- `npx expo export --platform ios` (production Hermes bytecode) elhasal
  „private properties are not supported" hibával. **Nem a mi kódunk okozza** —
  a hiba a NativeWind bekötése *előtt*, a sablon állapotában is reprodukálható,
  a mellékelt `hermesc` nem tudja fordítani egy függőség privát mezőit.
  Expo Go / dev bundle működik, ez csak az EAS build előtt lesz releváns
  (az EAS saját toolchainnel fordít).
- `app.json` még a sablon `b2kira` nevét és `userInterfaceStyle: "automatic"`
  beállítást tartalmazza. A design csak világos módra készült — érdemes lesz
  `"light"`-ra állítani és a nevet „Doboz Légzés"-re cserélni, de ez nem volt
  a 0. szakasz feladatlistáján, ezért nem nyúltam hozzá.
- A projekt gyökerében volt egy `feature-tasks.md`, ami bájtra azonos volt a
  `docs/feature-tasks.md`-del. Töröltem, hogy ne váljon szét a két másolat —
  az egyetlen érvényes példány a `docs/` alatti.

**Commitok:** `chore: Expo sablon boilerplate eltávolítása`,
`docs: CLAUDE.md, docs, design-reference és supabase bemásolása a repóba`,
`setup: .env és .env.example a Supabase kulcsoknak`,
`setup: NativeWind konfigurálása`,
`setup: Baloo 2 és Nunito betűtípusok betöltése`,
`setup: design tokenek – colors, typography, images`,
`setup: lint és typecheck script bekötése`

---
---

# Döntésnapló

Ide kerül minden nem triviális döntés, amit később meg lehetne kérdőjelezni.
Sorszámozva (`D-001`, `D-002`, …), hogy commit üzenetből hivatkozni lehessen rá.

**Mit kell rögzíteni:** eltérés a designtól, könyvtár hozzáadása vagy elvetése,
adatszerkezet- és sémaválasztás, ismert korlátozással továbbengedett feature,
workaround (platform bug, TTS minőség, animációs trükk).

**Egy döntés egy bekezdés.** A *miért* mindig legyen benne, és az is, hogy mi volt
a másik szóba jöhető opció.

Sablon:

```
## D-00N – [rövid cím]
**Dátum:** ÉÉÉÉ-HH-NN
**Döntés:** mit választottunk.
**Miért:** az indok.
**Alternatíva:** mit vetettünk el, és mi lett volna vele a baj.
**Visszavonható?** igen / nem — ha nem, miért nem.
```

---

## D-001 – Reanimated az animációhoz `setInterval` helyett

**Dátum:** 2026-08-24
**Döntés:** a légzésanimációt `react-native-reanimated` shared value hajtja, nem
`setInterval` + React state.
**Miért:** a 4-4-4-4 ritmus pontossága az app egyetlen valódi funkciója. A JS szál
akadása állapotfrissítéses megoldásnál látható csúszást okoz, és a gyerek pont a
ritmust követné.
**Alternatíva:** a designban szereplő 100 ms-os `setInterval`. Böngészőben működik,
telefonon hosszabb session alatt elcsúszik.
**Visszavonható?** Igen, de akkor a session hosszát 1 percre kell csökkenteni.

## D-002 – `breathing_` prefixű táblák a familyBudget public sémájában

**Dátum:** 2026-08-24
**Döntés:** a négy tábla a meglévő familyBudget projekt `public` sémájába kerül,
`breathing_` prefixszel.
**Miért:** így a meglévő Supabase kliens és MCP konfiguráció változtatás nélkül látja
őket, és nem kell külön projektet fenntartani.
**Alternatíva:** külön `breathing` séma — tisztább szétválasztás, de a PostgREST
expose-t és a klienst külön konfigurálni kellene.
**Visszavonható?** Igen, de a migráció után táblaátnevezéssel jár.

## D-003 – A doboz légzés marad az egyetlen technika, mert a logopédus adta fel

**Dátum:** 2026-08-24
**Döntés:** az app v1 kizárólag a 4-4-4-4 doboz légzést tartalmazza, más
logopédiai technikát (hangindítás, nyújtott beszéd, stb.) nem építünk bele.
**Miért:** felmerült, hogy a doboz légzés esetleg nem a dadogásra ténylegesen
használt technika (a szakirodalom szerint a dadogás-specifikus módszerek
inkább hangindításról és beszédtempóról szólnak, nem légzésformáról), ezért
utánanéztünk. Kiderült, hogy nem kell választani: **a gyerek logopédusa saját
maga adta fel gyakorlásra a doboz légzést.** Az app tehát egy konkrét,
terapeuta által kiadott otthoni feladatot digitalizál — nem egy általunk
kitalált vagy internetről összeválogatott technikát.
**Alternatíva:** dadogás-specifikus fluency shaping technikák (lágy
hangindítás, nyújtott beszéd) beépítése — elvetve, mert nincs rá szükség, és
mert ezek erősen egyéniek, csak a logopédus konkrét instrukciója alapján
lenne szabad beépíteni őket.
**Következmény:** a `docs/design-tokens.md`-ben rögzített 4-4-4-4 időzítés
mostantól nem csak design-hűségi, hanem terápiás-megfelelési kérdés is —
módosítani csak akkor szabad, ha a logopédus kifejezetten másképp kéri.
**Visszavonható?** Igen, ha a logopédus a jövőben más gyakorlatot ír elő —
akkor ez a döntés felülíródik egy új bejegyzéssel.

## D-004 – A reanimated babel plugint nem adjuk hozzá kézzel

**Dátum:** 2026-08-24
**Döntés:** a `babel.config.js` csak a `babel-preset-expo` (jsxImportSource:
nativewind) és a `nativewind/babel` preseteket tartalmazza; a reanimated /
worklets babel plugint nem soroljuk fel külön.
**Miért:** az SDK 54-es `babel-preset-expo` a `react-native-worklets/plugin`-t
automatikusan bekapcsolja, ha a könyvtár telepítve van (lásd az Expo v54
reanimated doksit). Ellenőriztem: a plugin ténylegesen fut a fordítás során.
Kézzel felvéve duplán futna, ami hibát vagy néma félrefordítást okozhat.
**Alternatíva:** a feature-tasks.md eredeti sora szerint kézzel a plugin lista
utolsó elemeként felvenni – ez az SDK 53 és korábbi verziók előírása volt.
**Visszavonható?** Igen, ha egy jövőbeli SDK megint kéri a kézi felvételt.

## D-005 – A színpaletta `constants/palette.json`-ben, nem közvetlenül a colors.ts-ben

**Dátum:** 2026-08-24
**Döntés:** a nyers hex értékek a `constants/palette.json`-ben élnek. Ezt
importálja a `constants/colors.ts` (típusosan, ezt használja a kód) és ezt
`require`-öli a `tailwind.config.js` (ebből lesznek a NativeWind osztályok).
**Miért:** a CLAUDE.md két szabálya csak így teljesül egyszerre: „a színeket
mindig a constants/colors.ts-ből használd" és „használj NativeWind
osztályokat". A tailwind config Node-ban fut, TypeScript fájlt nem tud
beolvasni, ezért kell egy mindkettő által olvasható, nyers adatformátum.
Így a `bg-purple-50` és a `colors.purple['50']` garantáltan ugyanaz az érték.
**Alternatíva:** a palettát kétszer leírni (colors.ts + tailwind.config.js) –
elvetve, mert egy design token módosítása így csendben szétcsúszhatna. Másik
alternatíva: nincs tailwind színtéma, minden szín `style` propon megy – ez a
NativeWind osztályok nagy részét használhatatlanná tenné.
**Visszavonható?** Igen, a JSON bármikor beolvasztható a colors.ts-be, ha a
tailwind témát elhagyjuk.

## D-006 – Az Expo sablon demo tartalmának törlése

**Dátum:** 2026-08-24
**Döntés:** a `create-expo-app` tabs sablonjának demo része (explore és modal
képernyő, themed-text / themed-view / parallax-scroll-view / hello-wave /
collapsible / icon-symbol / haptic-tab komponensek, `use-color-scheme` hookok,
`constants/theme.ts`, react-logo assetek, `reset-project` script) törölve; a
router egy minimális Stack + egy Tabs képernyőre csökkent.
**Miért:** a CLAUDE.md kötött mappastruktúrát ír elő, és a sablon `constants/theme.ts`-e
ütközött volna a design tokenekkel (két, egymásnak ellentmondó színforrás).
A demo komponensek sötét/világos témát kezelnek, amire ennek az appnak nincs
szüksége.
**Alternatíva:** meghagyni és fokozatosan lecserélni – elvetve, mert a
félig-meddig ottfelejtett sablonkód pont a „két színforrás" hibát okozza,
amire a CLAUDE.md külön kitér.
**Visszavonható?** Igen, a törölt fájlok a git történetben megvannak
(`9313cda` előtti állapot).

## D-007 – A generált Supabase típusok csak a `breathing_` táblákat tartalmazzák

**Dátum:** 2026-08-24
**Döntés:** a `types/supabase.ts` a `supabase gen types` teljes kimenetének
szűrt változata: csak a négy `breathing_` tábla és a `breathing_owns_child`
függvény marad benne. A familyBudget pénzügyi tábláinak (`products`,
`receipts`, `invoices`, `budget_plans`, …) típusai és a `Constants` enum
blokk kimaradnak.
**Miért:** a teljes kimenet 1878 sor, ebből ~1650 sor idegen tábla. A CLAUDE.md
szerint ez az app **soha** nem nyúlhat a pénzügyi táblákhoz — ha a típusuk
nincs a `Database` típusban, akkor a `supabase.from('receipts')` már
fordítási hibát ad, nem csak konvenció tiltja. A típus így egyben védőkorlát is.
**Alternatíva:** a teljes kimenet változatlan beírása (ezt írja a task lista
sora). Elvetve: 58 KB idegen típus, és a tiltott táblák így csábítóan
autocomplete-elnének.
**Következmény:** újragenerálás után a szűrést újra el kell végezni. A fájl
fejlécében ez ki van írva.
**Visszavonható?** Igen, bármikor újragenerálható szűrés nélkül.

## D-008 – A `breathing_` SECURITY DEFINER függvények EXECUTE joga szűkítve

**Dátum:** 2026-08-24
**Döntés:** a migráció lefuttatása után a Supabase security linter két
figyelmeztetést dobott a saját függvényeinkre (`0028` és `0029`): a
`breathing_create_default_settings()` és a `breathing_owns_child(uuid)`
`SECURITY DEFINER` függvény a PostgREST `/rest/v1/rpc/...` végponton át
bejelentkezés nélkül is hívható volt. Egy külön migrációban
(`0002_breathing_function_grants.sql`) visszavontuk az alapértelmezett
PUBLIC EXECUTE jogot: a trigger függvényről mindenkiről, a segédfüggvényről
`public`-ról és `anon`-ról, `authenticated`-nek pedig explicit `grant`.
Emellett a `breathing_touch_updated_at()` kapott egy `set search_path = public`
sort (linter `0011`), ez a 0001-be visszavezetve.
**Miért:** RLS a védelem, de a felesleges támadási felület akkor is felesleges.
A trigger függvényt sosem kell kívülről hívni; a segédfüggvényt viszont igen,
mert az RLS policy kifejezés a **lekérdező szerepében** fut, tehát az
`authenticated` szerepnek kell rá EXECUTE jog — ezt éles próbával
ellenőriztem a szűkítés után (a tulajdonos továbbra is ír és olvas mind a
négy táblát).
**Alternatíva:** figyelmen kívül hagyni a linter figyelmeztetést (a tényleges
kockázat kicsi: a trigger függvény RPC-ből hibát dob, a segédfüggvény anonként
mindig `false`-t ad). Elvetve, mert a javítás két sor és nem jár kockázattal.
**Megjegyzés:** a `0029`-es figyelmeztetés a `breathing_owns_child`-ra
**szándékosan megmarad**, mert az `authenticated` jogosultság funkcionálisan
szükséges. A többi listázott figyelmeztetés a familyBudget régi függvényeire
vonatkozik, azokhoz nem nyúltunk.
**Visszavonható?** Igen, egy `grant execute ... to public` visszaállítja.

## D-009 – A karakterek CSS→React Native konverziójának szabályai

**Dátum:** 2026-08-25
**Döntés:** a `design-reference/*.html` karaktergeometriáját négy fix szabállyal
fordítottam át: (1) a HTML `content-box`-ot használ, ezért a keretes elemeknél a
kerettel megnövelt méret került a RN stílusba (pl. a nyuszifül `22×44` + `3px`
keret → `28×50`); (2) az árnyékok a RN 0.81 új architektúrás `boxShadow`
stringjével mennek (`0 6px 14px <szín>`), nem `shadowColor`/`shadowOffset`/
`elevation` négyessel; (3) a nem négyzetes ellipszisek (pofik, orr, panda
szemfolt, majom pofa) százalékos `borderRadius`-t kapnak, a négyzetesek konkrét
számot; (4) a geometria `StyleSheet`-ben van, nem NativeWind osztályokban.
**Miért:** (1) enélkül minden keretes elem 6 px-szel kisebb lenne a designnál.
(2) a `boxShadow` a design CSS értékeit 1:1-ben átveszi (blur, offset, alfa),
míg a `shadowRadius` átváltása közelítés lett volna, amit a CLAUDE.md tilt.
(3) a RN a sima `borderRadius`-t nem négyzetes dobozon lekerekített
téglalappá vágja vissza, nem ellipszissé — a százalék az egyetlen pontos út.
(4) a karakterek fél pixeles (`2.5`, `8.5`) értékekkel, negatív pozíciókkal,
százalékos radiusszal és transzformokkal dolgoznak; ezek NativeWind arbitrary
értékként olvashatatlanok és a `rounded-[50%]` fordítása nem garantált, a
CLAUDE.md pedig pont ilyen esetre engedi a StyleSheet-et.
**Alternatíva:** `shadowColor`/`shadowRadius` átszámolás (blur/2 hüvelykujjszabály)
és számított radiusok — mindkettő közelítés. Illetve `react-native-svg` a teljes
geometriára: pontos lenne, de új könyvtár, és a CLAUDE.md kifejezetten `<View>`
elemekből kéri a karaktereket.
**Ismert korlát:** a nyuszi orrának elliptikus sarkait (`50% 50% 50% 50% /
60% 60% 40% 40%`) a RN nem tudja, ott sima `50%` lett. 8×6 px-en nem látszik.
**Visszavonható?** Igen. Ha az eszközön a `boxShadow` vagy a százalékos radius
nem működne, elemenként visszaváltható a `shadow*` négyesre, illetve a
százalék helyett a legnagyobb oldal fele adja a legjobb közelítést.

## D-010 – Az oroszlán sörénye négy elforgatott cikkely, nem `conic-gradient`

**Dátum:** 2026-08-25
**Döntés:** a `Lion.html` sörénye `conic-gradient(#E8A33D,#D98A26, …)` nyolc
váltakozó megállóval. React Nativeben ehelyett egy `#E8A33D` alapkör van, rajta
négy `#D98A26` cikkely (45°-os szeletek, `rotate` + `skewY(45deg)` párossal
kirajzolva, a kör `overflow: 'hidden'`-nel vágva).
**Miért:** a React Nativenek nincs kúpos gradiense, és az `expo-linear-gradient`
sem tud ilyet. A nyolc váltakozó megálló pontosan nyolc 45°-os szeletet jelent,
amiből négy az alapszín — így a minta ugyanaz, csak az átmenetek élesek a lágy
helyett. Egy sörényen ez inkább előny.
**Alternatíva:** `react-native-svg` (pontos kúpos gradiens, de új könyvtár egy
dekoratív körért); vagy egyszínű sörény (a designtól látható eltérés).
**Visszavonható?** Igen, a `MANE_WEDGES` tömb kiürítésével azonnal egyszínű
sörény marad.

## D-011 – A `mood` prop egyelőre nem változtat a karakterek rajzán

**Dátum:** 2026-08-25
**Döntés:** mind a négy karakter fogadja a `mood: 'happy' | 'breathing'` propot,
de ugyanúgy rajzolódik mindkét értéknél.
**Miért:** a `design-reference` karakterfájljai a `mood`-ot deklarálják, de
sehol nem használják — a `00-teljes-canvas.html` a kezdőképernyőn `happy`,
a gyakorlaton `breathing` értékkel hívja őket, és a két képernyőn a karakter
azonos. Kitalálni egy „lélegző arcot" a designtól való eltérés lenne, amit a
CLAUDE.md engedélyhez köt.
**Alternatíva:** elhagyni a propot — elvetve, mert a `docs/design-tokens.md`
kiírja a szerződést, és a hívó képernyők már így vannak megírva a designban.
**Visszavonható?** Igen, a prop megvan, csak a stílusváltást kell beletenni.

## D-012 – A scratch képernyőn gomb-lépegető van, nem csúszka

**Dátum:** 2026-08-25
**Döntés:** az `app/scratch-characters.tsx` a `scale`-t `−`/`+` gombokkal
(0.05-ös lépés) és két gyorsválasztóval (0.55 és 1.00) állítja, nem csúszkával.
**Miért:** a csúszkához `@react-native-community/slider` kellene, ami új
dependency egy ship előtt úgyis törlendő fejlesztői képernyő kedvéért. A két
gyorsválasztó ráadásul pont a légzésanimáció két szélső értéke, tehát a
tényleges ellenőrzési feladatra jobb is, mint a folytonos húzás.
**Alternatíva:** a slider könyvtár telepítése (engedélyköteles, és a max 10
dependency célszámot fogyasztja), vagy `PanResponder`-es saját csúszka
(felesleges kód egy eldobható képernyőn).
**Visszavonható?** Igen, de a képernyő amúgy is törlésre van ítélve ship előtt.

## D-013 – A `babel-preset-expo` az Expo SDK verziójához van kötve

**Dátum:** 2026-08-25
**Döntés:** a `babel-preset-expo` devDependency `~54.0.12`-re rögzítve, azaz
együtt mozog az `expo@54`-gyel. Korábban `^57.0.8` volt.
**Miért:** a preset dönti el, milyen JS szintaxist kell lefordítani, és ezt az
adott SDK Hermes motorjához méretezi. Az 57-es preset (SDK 55+) már nem
transzpilálja a `#private` osztálymezőket, mert az újabb Hermes tudja őket — az
SDK 54 `hermesc`-je viszont nem, ezért a React Native saját
`DOMRectReadOnly.js`-én elhasalt a production build. A preset és az SDK verziója
nem opcionálisan, hanem szükségszerűen tartozik össze.
**Alternatíva:** maradni az 57-esnél és a hiányzó transzformokat kézzel felvenni
a `babel.config.js`-be (`@babel/plugin-transform-private-properties` stb.) —
elvetve, mert ez csak ezt az egy tünetet kezelné, és a preset többi célzása
(target, importok) továbbra is rossz SDK-hoz szólna.
**Következmény:** SDK frissítéskor a presetet is emelni kell. Erre a
`npx expo install --check` figyelmeztet.
**Ellenőrizve:** a régebbi preset mellett is aktív a
`react-native-worklets/plugin` (a bundle-ben `__workletHash` szerepel), tehát a
D-004 döntés érvényben marad.
**Visszavonható?** Igen, de csak SDK 55-re lépéssel együtt van értelme.

<!-- ÚJ DÖNTÉSEK IDE, ALULRA, NÖVEKVŐ SORSZÁMMAL -->

