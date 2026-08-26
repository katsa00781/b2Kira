# Doboz Légzés – CLAUDE.md

## Szerepkör

Te egy tapasztalt Expo és React Native mérnök vagy, aki segít megépíteni a **Doboz Légzés**
alkalmazást. Írj tiszta, egyszerű, karbantartható kódot. A világosságot részesítsd előnyben
a felesleges absztrakciókkal szemben.

---

## Projekt áttekintés

**Doboz Légzés** – vidám, karakteres mobilalkalmazás, amely 7–9 éves gyerekeknek segít
megtanulni és rendszeresen gyakorolni a doboz légzést (4-4-4-4 ritmus), játékos vizuális
vezetéssel és matricagyűjtéssel.

**Fontos kontextus:** ez nem egy általunk kitalált vagy internetről összeválogatott
technika — a doboz légzést a gyerek **logopédusa adta fel otthoni gyakorlásra**
(a gyerek dadogással foglalkozik). Az app ezt a konkrét, terapeuta által kiadott
feladatot digitalizálja játékosan. Ez két dolgot jelent a fejlesztésre nézve:

1. A `docs/design-tokens.md`-ben rögzített 4-4-4-4 időzítés **nem szabad, hogy
   "javítva" vagy variálva legyen** engedély nélkül — ha a logopédus nem másképp
   kérte, a pontos ritmus a lényeg, nem egy általunk jobbnak vélt tempó.
2. A gyakorlat közben **fokozottan kerülendő minden időnyomást vagy teljesítmény-
   visszajelzést sugalló elem** (lásd lent, „Kire tervezünk") — ez itt nem csak
   UX-preferencia, hanem összhangban van azzal, amit a logopédiai szakirodalom is
   mond: a dadogó gyereknek kifejezetten árt a beszéd/légzés körüli pluszfeszültség.

Lásd a döntést részletesen: `docs/feature-tasks.md`, Döntésnapló `D-003`.

A logopédus 2026-08-26-án egy négy gyakorlatból álló lapot adott
(`docs/legzogyakorlatok-2026-08-26.md`), ezért az app azóta **gyakorlatkatalógust**
kezel, nem egyetlen gyakorlatot — lásd lent, „Gyakorlatkatalógus".

Az app a következőket tartalmazza:

- Szülői bejelentkezés és regisztráció (Supabase Auth)
- Gyerek profil: név, életkor, választható állatkarakter
- Élő légzőgyakorlat: animált doboz + a karakter együtt lélegzik, fázisonkénti szín- és feliratváltás
- Hangeffektek, haptikus visszajelzés és magyar hangos útmutatás fázisváltáskor
- Matricagyűjtemény és napi sorozat (streak)
- Szülői beállítások: hangok, gyakorlat hossza, napi emlékeztető, szülői zár

Az implementáció legyen egyszerű és olvasható.

### Kire tervezünk

A felhasználó egy **7–9 éves gyerek**, aki tud olvasni, de nem szívesen olvas sokat.
Ezért:

- Minden szöveg magyar, rövid, tegező, bátorító. Sose ijesztő, sose kioktató.
- A gombok nagyok, minimum 44×44 pt tap target.
- A gyakorlat képernyőn a gyerek nem olvas — a **szín, a méret és a hang** vezeti.
- Semmi időnyomás, semmi „elrontottad" visszajelzés. A megszakított gyakorlat is oké.
- A gyerek dadogással foglalkozik, ez a gyakorlat a logopédusa által kiadott
  feladat. Az app hangja, szövege és visszajelzései **soha ne utaljanak a
  gyerek beszédére, dadogására vagy teljesítményére** — a fókusz mindig a
  légzésen és a játékos élményen van, nem azon, hogy ez "miért" fontos.

### Gyerekadat-elvek

- A gyerek neve és életkora az egyetlen személyes adat, amit tárolunk róla.
- Analitikába vagy hibajelentésbe a gyerek neve **soha** nem kerülhet bele.
- A szülői beállítások mögé szülői zár kerül (egyszerű matematikai kérdés, nem PIN).
- Az appban nincs reklám, nincs külső link, nincs vásárlás.

---

## Tech stack

- Expo (SDK 54) + React Native
- TypeScript (strict)
- Expo Router (file-based routing)
- NativeWind (styling, Tailwind szintaxis)
- Zustand (globális state)
- AsyncStorage (perzisztencia, offline cache)
- react-native-reanimated (légzés animáció)
- Supabase (`@supabase/supabase-js`) – auth + adatbázis
- expo-haptics, expo-audio, expo-speech
- @expo-google-fonts/baloo-2, @expo-google-fonts/nunito

Új könyvtárat ne adj hozzá engedély nélkül. Ha indokolt lenne, javasold és kérdezz rá.
Célszám: **max 10 fő dependency.**

### Supabase

- Projekt: **familyBudget**, ref `eguhipjgnhbajbmnrskm`, régió `eu-central-1`
- A táblák ugyanabban a `public` sémában vannak, `breathing_` prefixszel:
  `breathing_children`, `breathing_sessions`, `breathing_stickers`, `breathing_settings`
- A séma és az RLS policy-k: `supabase/migrations/0001_breathing_schema.sql`
- **Soha ne nyúlj a familyBudget pénzügyi tábláihoz** (`products`, `receipts`, `invoices`,
  `budget_plans`, stb.). Ez az app csak a `breathing_` táblákat írja és olvassa.
- Auth: e-mail + jelszó, `supabase.auth`. Ne építs egyedi auth megoldást.
- A kliensben csak az anon (publishable) kulcs használható, `.env`-ből
  (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`). Service role kulcs
  **soha** nem kerülhet a kliens bundle-be.

### Offline-first

A gyerek gyakorolhasson net nélkül is. Ezért:

1. A gyakorlat mindig lokálisan indul és lokálisan záródik (Zustand + AsyncStorage).
2. A Supabase írás **utólag, best-effort** történik. Ha nincs net, a session bekerül egy
   lokális sorba, és a következő sikeres kapcsolatnál szinkronizálódik.
3. A UI soha ne várjon hálózatra. Ne legyen loading spinner a gyakorlat indításánál.

---

## Fejlesztési filozófia

Feature-by-feature építés. Minden feature esetén:

1. Olvasd el ezt a fájlt először
2. Tartsd az implementációt egyszerűnek
3. Kerüld a túlbonyolítást
4. Az olvasható kódot részesítsd előnyben az okossal szemben
5. Először a legkisebb működő verziót építsd meg
6. Csak akkor refaktorálj, ha ismétlés jelenik meg

---

## Döntési szabályok

Ha valami nem egyértelmű, javasold a jobb megközelítést, ne találgass.
Ha egy új könyvtár segítene, indokold meg és kérdezz rá mielőtt hozzáadod.
Meglévő UI-t ne változtass meg engedély nélkül.
Ha egy design érték hiányzik a `docs/design-tokens.md`-ből, **kérdezz rá** — ne közelíts.

---

## Mappastruktúra

```
app/
  (auth)/
    login.tsx
    register.tsx
  (tabs)/
    index.tsx          # kezdőképernyő
    stickers.tsx       # matricagyűjtemény
    settings.tsx       # szülői beállítások
  exercises/
    index.tsx          # gyakorlatválasztó
    nose-mouth.tsx     # orr/száj kombinációk
    one-breath.tsx     # a hét napjai / szótagsorok egy levegővel
  session.tsx          # doboz légzés (teljes képernyő, nincs tab bar)
  _layout.tsx
components/
  characters/          # Bunny, Panda, Monkey, Lion
  BreathingBox.tsx
  PhaseDots.tsx
  StickerTile.tsx
  ProgressBar.tsx
  PrimaryButton.tsx
  TextField.tsx
  ToggleRow.tsx
  SegmentedChoice.tsx
  Twinkles.tsx
constants/
  colors.ts
  typography.ts
  images.ts
data/
  stickers.ts
  characters.ts
  sessionLengths.ts
  exercises.ts         # gyakorlatkatalógus
  phases.ts            # doboz légzés + a BreathPattern típus
  noseMouth.ts
  oneBreath.ts
hooks/
  useBreathingCycle.ts
  useGuidedInhale.ts
  useSessionTimer.ts
lib/
  supabase.ts
  sync.ts
  speech.ts
  haptics.ts
store/
  useChildStore.ts
  useSessionStore.ts
  useSettingsStore.ts
types/
assets/
  images/
  sounds/
docs/
  design-tokens.md
supabase/
  migrations/
```

**app/** – csak route-ok és képernyők. Komponenseket és üzleti logikát ne tartalmazzon.

**components/** – újrafelhasználható UI elemek. Akkor hozz létre komponenst, ha
több helyen újra van használva, átláthatóbbá teszi a képernyőt, vagy önálló UI koncepciót
képvisel. Példák: `BreathingBox`, `StickerTile`, `ToggleRow`, `PrimaryButton`.

**data/** – hardcoded tartalom, típusosan. A matricakatalógus, a karakterlista és a
gyakorlathossz-opciók itt élnek, **nem** az adatbázisban.

**store/** – Zustand store-ok. Példa state mezők: `child`, `character`, `phaseIndex`,
`sessionElapsed`, `paused`, `soundOn`, `voiceOn`, `hapticsOn`, `streakDays`, `unlockedStickers`.
AsyncStorage-gal perzisztálva.

**lib/** – külső service helperek (`supabase.ts`, `sync.ts`). Titkos kulcsokat soha ne tárolj itt.

---

## UI szabályok

- A designt **pontosan** replikáld. A forrás: `docs/design-tokens.md` és
  `design-reference/00-teljes-canvas.html`.
- Layout, spacing, padding, betűméret, hierarchia, színek, border-radius, árnyékok,
  igazítás és arányok mind egyezzenek.
- Ne approximálj, ne egyszerűsíts engedély nélkül.
- A színeket **mindig** a `constants/colors.ts`-ből használd, sose írj be hex értéket
  komponensbe.

### A képernyők

Az első hat képernyő a designból van, az utolsó három a logopédus lapjához
készült, design referencia nélkül, kizárólag meglévő tokenekből (D-058).

| # | Route | Leírás |
|---|---|---|
| 1 | `app/(auth)/login.tsx` | Szülői bejelentkezés. Bunny karakter, e-mail + jelszó, „Elfelejtett jelszó?", lila gradiens gomb. |
| 2 | `app/(auth)/register.tsx` | Regisztráció: gyermek neve, életkora, szülő e-mail, jelszó, szülői felügyelet checkbox. Zöld gradiens gomb. |
| 3 | `app/(tabs)/index.tsx` | Kezdőképernyő: üdvözlés, streak chip, beállítás ikon, nagy karakter, karakterválasztó, szintkártya + progress, napi tipp, CTA. |
| 4 | `app/session.tsx` | Élő gyakorlat: vissza gomb, hátralévő idő, fázis felirat, animált doboz + karakter, fázispöttyök, session bar, Szünet gomb. |
| 5 | `app/(tabs)/stickers.tsx` | 3×3 matricarács, streak sor, „következő jelvény" kártya. |
| 6 | `app/(tabs)/settings.tsx` | 3 kapcsoló, gyakorlathossz választó, napi emlékeztető idő, szülői zár gomb. |
| 7 | `app/exercises/index.tsx` | Gyakorlatválasztó: a négy gyakorlat kártyaként. A kezdőképernyő CTA-ja ide visz (D-053). |
| 8 | `app/exercises/nose-mouth.tsx` | Orron/szájon be- és kilégzés 4 kombinációja (D-054). |
| 9 | `app/exercises/one-breath.tsx` | A hét napjai / szótagsorok egy levegővel, „Kész" gombbal (D-055). |

---

## Gyakorlatkatalógus

A négy gyakorlat a **logopédus feladatlapjáról** való
(`docs/legzogyakorlatok-2026-08-26.md`), nem mi találtuk ki őket. A katalógus
hardcoded: `data/exercises.ts`, a paraméterek pedig `data/phases.ts`,
`data/noseMouth.ts` és `data/oneBreath.ts` fájlokban, egy-egy helyen.

| Kulcs | Gyakorlat | Paraméterek |
|---|---|---|
| `box` | Doboz légzés | 4 fázis × 4 mp, a beállított hosszig |
| `nose-mouth` | Orr/száj kombinációk | 4 mp be / 4 mp ki, a 4 kombináció sorban, 4× |
| `weekdays` | A hét napjai egy levegővel | vezetett belégzés + 3 sor, méricskélés nélkül |
| `syllables` | Szótagsorok egy levegővel | 10 sor egymás után, egy körben (p–b–m–t–d–k–g) |

**Ugyanaz a szabály él mindegyikre, ami a 4-4-4-4-re:** ezek terapeuta által
kiadott feladatok, a másodperceket, az ismétlésszámot és a szótagsorokat
engedély nélkül **nem** „javítjuk" és nem variáljuk. A 2. gyakorlat ütemezése
ráadásul még a logopédus megerősítésére vár (D-054).

A 3. és 4. gyakorlat **beszédes**. Ott semmit nem mérünk: nincs stopper, nincs
számolás, nincs értékelés, a gyerek maga lép tovább (D-055). A `sessionLengthKey`
beállítás csak a doboz légzésre vonatkozik.

Minden befejezett gyakorlat egyformán lépteti a sorozatot, a szintet és a
matricákat (D-056), és a `breathing_sessions.exercise_key` őrzi, melyik volt
(D-057).

---

## A légzőgyakorlat – kritikus rész

Ez az app lényege. A pontos értékek a `docs/design-tokens.md`-ben vannak. Röviden:

```
4 fázis × 4 mp, 16 mp / ciklus
0 "Lélegezz be"  scale 0.55 → 1.00   #FFB347
1 "Tartsd"       scale 1.00          #FF8FA3
2 "Lélegezz ki"  scale 1.00 → 0.55   #94E3C9
3 "Tartsd"       scale 0.55          #8FD3E8
```

Szabályok:

- **Reanimated `useSharedValue` + `withTiming`/`withSequence`/`withRepeat`** hajtsa az
  animációt, UI szálon. `setInterval` + `setState` **tilos** az animációhoz — a designban
  csak azért van úgy, mert az böngészőben fut.
- A doboz mérete és a karakter `scale` propja **ugyanabból** a shared value-ból jöjjön,
  hogy garantáltan szinkronban legyenek.
- A fázisváltás (nem a folyamatos animáció) triggereli a hangot, a haptikát és a beszédet.
- A képernyő maradjon ébren a gyakorlat alatt (`expo-keep-awake`).
- Háttérbe kerüléskor (`AppState`) a gyakorlat automatikusan szünetel.
- A `Szünet` megnyomásakor az animáció ott áll meg, ahol van — ne ugorjon vissza a fázis elejére.

---

## Hang, beszéd, haptika

- **Haptika** (`expo-haptics`): minden fázisváltásnál `ImpactFeedbackStyle.Light`.
  Belégzés kezdetén `Medium`. Gyakorlat végén `NotificationFeedbackType.Success`.
- **Hangeffekt** (`expo-audio`): halk, rövid hangok fázisváltáskor. Az `assets/sounds/`
  mappából. Ha a hangfájl hiányzik, az app **ne dobjon hibát** — csendben menjen tovább.
- **Beszéd** (`expo-speech`): magyar (`language: 'hu-HU'`), lassú (`rate: 0.85`).
  A fázis feliratát mondja ki: „Lélegezz be", „Tartsd", „Lélegezz ki", „Tartsd".
  Új fázis előtt mindig `Speech.stop()`, hogy ne torlódjanak.
- Mindhárom külön kapcsolható a beállításokban, és a kapcsoló azonnal érvényes —
  ne kelljen újraindítani a gyakorlatot.
- **Néma módban is szól** (iOS silent switch): az audio session `.playback`
  kategóriát kap (`playsInSilentMode: true`). A vezető hang a gyakorlat része, nem
  játékhang — a gyerek ne veszítse el csak azért, mert a szülő telefonja néma volt.
  Ha a szülő csendet akar, a beállításokban külön kikapcsolhatja. Lásd D-049.
- A rezgés iOS-en néma módban a rendszer „Rezgés” beállításán múlik; ezt az app
  nem tudja felülírni, és nem is próbálja.

---

## Matricák és streak

- A matricakatalógus **hardcoded**, `data/stickers.ts`-ben (kulcs, magyar név, alak, színek).
  Az adatbázis csak azt tárolja, melyik kulcs mikor oldódott fel.
- Matrica feloldás: minden **5. befejezett gyakorlat** old fel egy újat, a katalógus
  sorrendjében. A feloldott matricákat a `stickers` képernyő mutatja, a többi zárolt.
- Streak: naptári napokban számol, a gyerek helyi idejében. Egy nap akkor számít, ha
  legalább egy gyakorlat **befejeződött**. Kihagyott nap → a streak 0-ra áll.
- Feloldáskor rövid ünneplő visszajelzés a gyakorlat végén. Ne legyen tolakodó modal.

---

## Styling szabályok

Használj NativeWind osztályokat. StyleSheet-et csak akkor használj, ha `className`-mel
nem megoldható.

**StyleSheet kivételek (ezekhez ne használj `className`-t):**

- SafeAreaView
- KeyboardAvoidingView
- Modal
- Animated.View / Reanimated.View
- Runtime-ban számított dinamikus stílusok (pl. a légződoboz mérete)
- Platform-specifikus stílusok
- Pressable / TouchableOpacity pressed state
- Árnyékok (platform-függők)
- Gradiensek (`expo-linear-gradient`)

---

## Kép szabályok

Centralizált image importot használj:

1. Ellenőrizd, hogy létezik-e `constants/images.ts`
2. Ha nem, hozd létre
3. Minden app képet ott importálj
4. A centralizált objektumon keresztül használd őket

```ts
import appIcon from "@/assets/images/icon.png";
export const images = { appIcon };
```

```tsx
<Image source={images.appIcon} />
```

Képeket ne importálj közvetlenül képernyőkben vagy komponensekben.

**Fontos:** a designban a négy karakter **tiszta CSS-ből** épül, nincs kép asset.
React Nativeben is `<View>` elemekből építsd őket (`borderRadius`, `transform`), a
`design-reference/Bunny.html`, `Panda.html`, `Monkey.html`, `Lion.html` geometriája alapján.
Ne cserélj képre engedély nélkül.

---

## State management

- **Zustand** – globális kliens state (gyerek profil, beállítások, matricák)
- **Lokális state** – átmeneti UI state
- **Reanimated shared value** – animációs state, ez **soha** ne menjen React state-be
- **AsyncStorage** – perzisztencia, `zustand/middleware` `persist`-tel

---

## TypeScript szabályok

- Strict mode
- `any` tiltott
- Tartsd a típusokat egyszerűnek és olvashatónak
- A Supabase típusokat generáld (`supabase gen types typescript`), ne kézzel írd

---

## Feature implementáció

Minden feature esetén:

1. Olvasd el ezt a fájlt
2. Azonosítsd az érintett fájlokat
3. Tartsd a változtatásokat fókuszáltan
4. Ne írj át nem érintett kódot
5. Kövesd a meglévő mintákat
6. Győződj meg róla, hogy a feature end-to-end működik
7. Javítsd a lint és type hibákat befejezés előtt
8. Vezesd át a `docs/feature-tasks.md`-t (pipa + munkanapló bejegyzés)
9. Készíts commitot

---

## Munkanapló és commitok

**A `docs/feature-tasks.md` a projekt egyetlen közös emlékezete.** Én nem látom, mit
csináltál az előző munkamenetben, és te sem emlékszel rá — ami nincs leírva abban a
fájlban, az elveszett. Ezért minden befejezett feladat után **kötelező** átvezetni.

### Feladat lezárásakor mindig

1. **Pipáld ki** az elvégzett sort a `docs/feature-tasks.md`-ben (`- [ ]` → `- [x]`)
2. **Írj munkanapló bejegyzést** a fájl végén lévő „Munkanapló" szakaszba:
   dátum, mit csináltál, mely fájlokat érintetted, mi az, ami még nyitva maradt
3. **Ha döntést hoztál** — bármit, ami nem triviális és később megkérdőjelezhető —
   vedd fel a „Döntésnapló" szakaszba: mi volt a döntés, miért, mi volt a másik opció
4. **Commitolj**, mielőtt a következő feladatba kezdesz

### Mi számít döntésnek

Rögzítsd, ha:

- eltértél a designtól vagy a `docs/design-tokens.md`-től (és miért)
- könyvtárat adtál hozzá vagy vetettél el
- adatszerkezetet, séma- vagy store-alakot választottál
- ismert korlátozással vagy ismert hibával engedtél tovább egy feature-t
- workaroundot építettél be (pl. platform bug, TTS minőség, animációs trükk)

Egy döntés egy bekezdés. Ne írj esszét, de a **miért** mindig legyen benne.

### Commit szabályok

- **Egy feladat = egy commit.** Ne gyűjts össze több feature-t egy commitba.
- A `docs/feature-tasks.md` frissítése **ugyanabba a commitba** menjen, mint a kód.
- Commit üzenet magyarul, jelen időben, egy sor, prefixszel:

```
setup: NativeWind konfigurálása
feat: Bunny karakter komponens
feat: légzőgyakorlat képernyő reanimated animációval
fix: a doboz radiusa nem követte a méretet szünet után
db: breathing_ táblák migrációja
docs: munkanapló és döntésnapló átvezetése
chore: lint hibák javítása
```

- Ha a commit döntést is tartalmaz, a törzsében hivatkozz rá:
  `Döntés: lásd docs/feature-tasks.md – D-004`
- **Ne pusholj** magadtól, csak ha kérem.
- Ne commitolj félkész, nem forduló kódot. Ha elakadtál, inkább írd be a munkanaplóba,
  hogy hol tartasz, és azt commitold.

### Munkamenet indításakor

Először olvasd el a `docs/feature-tasks.md` **munkanaplóját és döntésnaplóját**, hogy
tudd, hol tartunk és milyen döntések élnek már. Ne kezdj új feladatba anélkül, hogy
ezt megnézted volna.

---

## Titkok és biztonság

- Titkos kulcsokat soha ne tegyél kliens kódba
- Csak `EXPO_PUBLIC_` prefixű, anon szintű kulcs kerülhet a bundle-be
- A `.env` a `.gitignore`-ban, a `.env.example` viszont commitolva
- Az RLS policy-k a védelem, nem a kliens kód — soha ne feltételezd, hogy a kliens
  szűrése elég

---

## Autentikáció

Supabase Auth (e-mail + jelszó). Ne építs egyedi auth megoldást.

- A session `AsyncStorage`-ban perzisztálódik, a szülőnek ne kelljen újra bejelentkeznie
- Regisztrációkor egy tranzakcióban jön létre a user és a `breathing_children` sor
- Bejelentkezés után, ha nincs gyerek profil, irányíts a profil létrehozására
- Kijelentkezés csak a szülői zár mögül érhető el

---

## Kommunikáció

Légy tömör. Magyarul írj. Magyarázd el mi változott és hogyan lehet tesztelni.

---

## Emlékeztető

**Minden feature ELŐTT:**

- Olvasd el ezt a fájlt
- Nézd meg a `docs/design-tokens.md`-t
- Olvasd el a `docs/feature-tasks.md` munkanaplóját és döntésnaplóját
- Kövesd szigorúan
- Tiszta, egyszerű kódot írj
- A UI-t pontosan replikáld a design alapján

**Minden feature UTÁN — kihagyás nélkül:**

- Pipáld ki az elvégzett sort a `docs/feature-tasks.md`-ben
- Írd be a munkanapló bejegyzést (mit, mely fájlokban, mi maradt nyitva)
- Ha döntés született, vedd fel a döntésnaplóba (mi, miért, mi volt az alternatíva)
- Commitolj — egy feladat, egy commit, a doksi frissítésével együtt

Ha ezt kihagyod, a következő munkamenet vakon indul. Ez nem opcionális lépés.
