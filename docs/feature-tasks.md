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
- [x] `ProgressBar` (gradiens kitöltés)
- [x] `Twinkles` (animált díszpöttyök a lila képernyőkhöz)
- [x] `ToggleRow` (kapcsoló + címke + alcím)
- [x] `SegmentedChoice` (gyakorlathossz választó)

## 4. Auth képernyők (1–2. képernyő)

- [x] `app/(auth)/login.tsx` – design szerint pontosan
- [x] `app/(auth)/register.tsx` – design szerint pontosan
- [x] Supabase e-mail/jelszó bejelentkezés és regisztráció bekötése
- [x] Regisztrációkor `breathing_children` sor létrehozása (név + életkor)
- [x] „Elfelejtett jelszó?" – Supabase `resetPasswordForEmail`, magyar visszajelzéssel
- [x] Regisztráció checkbox („Elfogadom, hogy a szülő felügyeli a fiókot") kötelező mező
- [x] Hibaüzenetek magyarul, barátságosan (nem „Invalid credentials")
- [x] Session perzisztencia: app újraindítás után bejelentkezve marad
- [x] Auth guard: bejelentkezés nélkül a `(tabs)` nem érhető el

## 5. Kezdőképernyő (3. képernyő)

- [x] `app/(tabs)/index.tsx` – design szerint pontosan
- [x] `store/useChildStore.ts` – gyerek profil, karakter, szint, streak, Zustand + persist
- [x] Karakterválasztó működik, a választás azonnal látszik és perzisztálódik
- [x] Szintkártya és progress bar valós adatból (befejezett gyakorlatok száma)
- [x] Napi tipp: 7 tipp `data/`-ban, a hét napja szerint váltakozik
- [x] CTA gomb navigál a `session` képernyőre

## 6. Légzőgyakorlat (4. képernyő) — **a projekt szíve**

- [x] `hooks/useBreathingCycle.ts` – Reanimated shared value, 4×4 mp, `withRepeat`
- [x] `components/BreathingBox.tsx` – animált méret, radius és szín
- [x] `components/PhaseDots.tsx`
- [x] Karakter a doboz fölött, **ugyanabból** a shared value-ból skálázva
- [x] Fázisfelirat váltása
- [x] Session timer, hátralévő idő `m:ss`, alsó progress bar
- [x] Szünet / Folytatás – ott áll meg, ahol van
- [x] `expo-keep-awake` a gyakorlat alatt
- [x] `AppState` háttérbe kerüléskor automatikus szünet
- [x] Vissza gomb: megerősítés nélkül kilép, a részleges session elmentődik

> **Teszt:** 5 percen át fusson, és a 4-4-4-4 ritmus a végén is pontos legyen.
> Ha csúszik, az animáció valahol React state-en megy át — javítsd.

## 7. Hang, beszéd, haptika

- [x] `lib/haptics.ts` – fázisváltás visszajelzés
- [x] `lib/speech.ts` – `expo-speech`, `hu-HU`, `rate: 0.85`, előző mondat leállítása
- [x] `assets/sounds/` – 2-3 halk hang, `expo-audio` lejátszás
- [x] Hiányzó hangfájl ne dobjon hibát
- [x] iOS néma kapcsoló: hang néma, haptika megy
- [x] Mindhárom külön kapcsolható, azonnali hatállyal

> **Teszt a gyerekkel:** ha csukott szemmel is tudja követni, jó. Ha nézni kell hozzá a
> képernyőt, a hang túl halk vagy túl késői.

## 7.5. iPad támogatás és fekvő tájolás

- [x] `constants/layout.ts` – eszközfüggő nagyítás: `uiScale`, `s()`, `contentMaxWidth`
- [x] Tipográfia és árnyékok a szorzóra kötve (`constants/typography.ts`, `constants/shadows.ts`)
- [x] Komponensméretek és képernyő-paddingek átvezetve a szorzóra
- [x] `app.json`: iPaden mind a négy tájolás, iPhone-on marad az álló zár
- [x] `requireFullScreen` – nincs Split View, az ablak mindig a teljes képernyő
- [x] A tartalomoszlop iPaden a design szélességére korlátozva, középre igazítva
- [ ] Teszt éles iPad 6. generáción, fekvő és álló módban (TestFlight buildből)

> **Teszt:** a gyakorlat képernyő fekvőben is elférjen vágás nélkül, és a doboz
> érezhetően nagyobb legyen, mint telefonon. A telefonos megjelenés **ne**
> változzon egy pixelt se.

## 8. Session mentés és offline sor

- [x] Gyakorlat végén `breathing_sessions` sor beszúrása
- [x] Nincs net → lokális sorba kerül AsyncStorage-ba
- [x] `lib/sync.ts` – app indításkor és előtérbe kerüléskor kiüríti a sort
- [x] Duplikáció elleni védelem (kliensen generált uuid + `ignoreDuplicates`)

> A „net visszatérésekor" trigger helyett app indítás + előtérbe kerülés +
> gyakorlat vége hármas fut, hogy ne kelljen új könyvtár — lásd D-038.

## 9. Matricák és streak (5. képernyő)

- [x] `data/stickers.ts` – 9 matrica katalógus (5 a designból, 4 a mienk – D-040)
- [x] `app/(tabs)/stickers.tsx` – 3×3 rács, feloldott és zárolt állapot
- [x] Feloldási logika: minden 5. befejezett gyakorlat
- [x] Streak számítás naptári napokban, helyi idő szerint (az 5. szakaszból)
- [x] „Következő jelvény" kártya valós adatból
- [x] Ünneplő visszajelzés feloldáskor (rövid, nem modal)
- [x] A feloldott kulcsok és a streak felmegy a szerverre

## 10. Szülői beállítások (6. képernyő)

- [x] `app/(tabs)/settings.tsx` – design szerint (két eltéréssel: D-043, D-044)
- [x] **4** kapcsoló → `store/useSettingsStore.ts` + `breathing_settings` szinkron
- [x] Gyakorlathossz: 1 perc / 2-3 perc / 5 perc (60 / 150 / 300 mp)
- [x] Napi emlékeztető idő választó (15 perces léptető – D-045)
- [x] `expo-notifications` – napi helyi értesítés a beállított időpontban
- [x] Szülői zár: matematikai kérdés a beállítások előtt
- [x] Kijelentkezés a szülői zár mögött

---

## Ship előtt

- [ ] Teljes flow tesztelése éles iPhone-on: regisztráció → gyakorlat → matrica → beállítás
- [ ] Edge case-ek: nincs net, lassú net, hosszú gyerek név, 0 befejezett gyakorlat,
      minden matrica feloldva, app háttérbe kerül gyakorlat közben, telefon elforgatása
- [ ] Kisebb képernyő teszt (iPhone SE) – nem csúszik-e ki a doboz
- [ ] Lint + typecheck hibák nélkül
- [ ] CodeRabbit code review az AI által írt feature-ökre
- [ ] Dev utilities eltávolítása (teszt gombok, `console.log`-ok, mock data)
- [x] Analitika: **gyereknév és e-mail soha ne kerüljön eventbe**
- [x] Secrets ellenőrzése: kliens bundle + teljes git history
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

## 2026-08-26 – Alkalmazás ikon a megadott SVG-ből

**Mit:** Az `assets/images/app-icon.svg` (lila-rózsaszín gradiens, fehér doboz
keret, sárga pötty a tetején, zöld karikás fehér kör középen) lett az app ikonja
az Expo sablon kék nyíl placeholderje helyett. Az Expo ikonként **csak PNG-t**
fogad, ezért az SVG-t 1024×1024-re raszterizáltam.

*Raszterizálás:* headless Chrome-mal, nem ImageMagickkel. A gépen lévő
ImageMagick nem librsvg-vel fordult (`magick -list delegate` szerint az `svg`
delegate `rsvg-convert`-et hívna, ami nincs telepítve), a beépített MSVG
renderer pedig a `gradientUnits="userSpaceOnUse"` gradienseket és a
`stroke="url(#boxStroke)"` hivatkozást nem adja vissza helyesen. A Chrome
pontosan azt rajzolja, amit a böngésző. Új dependency nem kellett.

*Négy variáns készült, mind ugyanabból a geometriából:*
- `icon.png` – iOS és a fő ikon. **Teli négyzet, lekerekítés nélkül** (D-051).
- `android-icon-background.png` – csak a gradiens és a lágy fénykör.
- `android-icon-foreground.png` – csak a jel, átlátszó háttéren.
- `android-icon-monochrome.png` – egyszínű fehér sziluett a témázott ikonhoz.
- `favicon.png` – 48×48, a lekerekített változatból.

Az `app.json`-ban az `adaptiveIcon.backgroundColor` a sablon `#E6F4FE`-jéről a
gradiens középértékére (`#DCA0E5`) váltott, hogy a tartalék háttér se lógjon ki.

**Fájlok:** app.json, assets/images/app-icon.svg (a forrás, a repóban marad),
assets/images/icon.png, assets/images/android-icon-background.png,
assets/images/android-icon-foreground.png,
assets/images/android-icon-monochrome.png, assets/images/favicon.png,
docs/feature-tasks.md

**Tesztelve:** `npx expo config --json` mind az öt útvonalat feloldja. Az
`icon.png` és az Android háttér `magick identify` szerint **alfa csatorna
nélküli** (`srgb`, `alpha=Undefined`) — ez iOS-en követelmény. Az Android
előteret a rendszer kör maszkjával kivágva is megnéztem (középső 66,7% + kör):
a jel nem lóg ki, a doboz sarka a biztonságos sugáron belül marad (a lekerekítés
miatt a tényleges legkülső pont ~314 px a 341 px-es határ helyett).
**Éles eszközön még nincs megnézve** — az ikon csak natív buildben (EAS) látszik,
Expo Go-ban nem.

**Nyitva maradt:**
- Az ikon valódi ellenőrzése EAS buildből, a telefon kezdőképernyőjén.
- **A `splash-icon.png` továbbra is az Expo sablon képe.** Az indítóképernyő
  tehát nem illik az ikonhoz. Ugyanebből az SVG-ből egy perc alatt kitehető,
  de ez külön kérés — szóljatok, ha kell.
- **Az app neve a telefonon `b2kira`**, mert az `app.json` `name` mezője ez.
  Az ikon alatt ez fog állni, nem az, hogy „Doboz Légzés". Szándékos-e?
- Az iOS 18 sötét és tónusos ikonvariánsa (`ios.icon` objektum alak) nincs
  megadva; a rendszer a világos ikonból generálja.

## 2026-08-26 – fix: a gyerek neve nem jelent meg a kezdőképernyő üdvözlésében

**Mit:** A kezdőképernyő „Szia, [név]! 🌸" üdvözlése névtelen maradt. Két, egymást
erősítő ok volt, mindkettő javítva.

*1. A név csak a szerverről jött.* A `signUp()` a nevet és az életkort kizárólag
AsyncStorage-ba tette (`doboz-legzes.pending-child`, D-021), a `useChildStore`-ba
soha — oda csak a `syncFromServer()` írt, a `breathing_children` sorból. Amíg tehát
a sor nem jött létre (e-mail megerősítés, nincs net, RLS), az üdvözlés név nélkül
maradt, holott a szülő az imént írta be. Ez ellentmond az offline-first elvnek is:
a UI hálózatra várt egy olyan adatért, ami már a kezében volt. Mostantól a `signUp()`
azonnal a store-ba is beírja a nevet (`setChild`), a szerver oldali sor pedig
utólag, best-effort jön létre, ahogy eddig.

*2. Nem volt hova irányítani, ha nincs profil.* Az adatbázisban a
`breathing_children` tábla **üres**, és az `auth.users`-ben 2025 óta nincs új
felhasználó — tehát a szülő egy meglévő (familyBudget) fiókkal jelentkezett be, nem
az app regisztrációján át. Ilyenkor nincs függő adat a telefonon, az
`ensureChildProfile()` csendben visszalép, és a gyerek neve sehol nem kérhető be.
Ezt a hiányt a munkanapló kétszer is rögzítette („A profil létrehozó képernyő
továbbra is hiányzik"), a CLAUDE.md pedig elő is írja: „Bejelentkezés után, ha
nincs gyerek profil, irányíts a profil létrehozására". Elkészült az `app/child-profile.tsx`
(D-050): név + életkor, a regisztráció vizuális nyelvén.

A megkülönböztetéshez a `fetchChildProfile()` mostantól nem `null`-t ad vissza
mindenre, hanem `ok` / `missing` / `unknown` státuszt — a „nincs sor" és a „nem
értük el a szervert" eset nem ugyanaz: az elsőre irányítunk, a másodikra
offline-first módon nem csinálunk semmit.

Két kapcsolódó hiba is javítva menet közben: a `signOut()` eddig nem ürítette a
`useChildStore`-t (a gyerek neve és haladása ottmaradt a következő bejelentkezőnek
— a store saját kommentje szerint is ez lett volna a dolga), és a függő gyerek
profil csak be- vagy kijelentkezéskor próbálkozott újra, indításkor nem.

**Fájlok:** app/child-profile.tsx (új), app/(tabs)/index.tsx, app/_layout.tsx,
lib/auth.ts, lib/child.ts, store/useChildStore.ts, docs/feature-tasks.md

**Tesztelve:** `npm run typecheck` és `npm run lint` hibátlan. Az iOS production
export lefut (4,76 MB Hermes bytecode), és a bundle tartalmazza az új képernyő
szövegeit és a `child-profile` route-ot (a nem ASCII stringek UTF-16-ban, ahogy a
Hermes tárolja). A `breathing_children` RLS insert policy-ját lekérdeztem:
`with_check (parent_id = auth.uid())`, tehát a bejelentkezett szülő a saját sorát
beszúrhatja — a képernyő működni fog. **Éles eszközön még nincs végigjátszva.**

**Nyitva maradt:**
- A teljes folyamat éles iPhone-on: bejelentkezés a meglévő fiókkal → profil
  képernyő → név → kezdőképernyő. Ez a javítás lényege, ezt kell látni.
- A profil képernyőn nincs kilépési út (se vissza gomb, se kijelentkezés). Ez
  szándékos — profil nélkül nincs mit mutatni —, de ha a szülő mégis rossz
  fiókba lépett be, csak az app törlésével tud kiszállni.
- Több gyerek egy fiók alatt továbbra sem támogatott (a séma bírja, a UI nem);
  a képernyő mindig az elsőt hozza létre.
- A profil képernyő nincs a designban. Ha kell hozzá pontos canvas, szólj, és
  hozzáigazítom.

## 2026-08-26 – Ship előtt: titok- és analitika-ellenőrzés

**Mit:** A „Ship előtt" lista titok-tétele lezárva. Az 1. szakaszban már volt
egy ilyen ellenőrzés, de az a **mai kód előtti** bundle-re vonatkozott, ezért
mindent újrafuttattam a jelenlegi állapoton.

*Production bundle* (`npx expo export --platform ios`, 4,75 MB Hermes bytecode
— mellesleg ez az első alkalom, hogy a production export végigfut ezen a
projekten, a 0. szakasz óta nyitott Hermes export kérdés tehát megválaszolva):
a bundle-ben **egyetlen JWT** van, a payloadja
`{"iss":"supabase","ref":"eguhipjgnhbajbmnrskm","role":"anon"}` — vagyis csak
az anon kulcs, ahogy kell. `service_role` és `SUPABASE_SERVICE` minta nulla
találat. Az egyetlen `sb_secret_` találat a `supabase-js` saját
kulcsformátum-ellenőrző konstansa, nem érték.

*Teljes git history* (minden commit, minden fájl): JWT-szerű token (`eyJ…`)
nulla találat; a `service_role` szó csak a `docs/feature-tasks.md` korábbi
audit-bejegyzésében fordul elő, prózaként. A `.env` soha nem volt commitolva
(a `.gitignore` fedi), a `.env.example` pedig üres kulcsértékkel van benne.

*Forráskód:* beégetett kulcs vagy Supabase URL sehol; a kliens kizárólag a
`process.env.EXPO_PUBLIC_*` értékekből dolgozik (`lib/supabase.ts`).

*Analitika:* a tétel triviálisan teljesül, és ez így is marad, amíg valaki
nem tesz be analitikát: a projektben **nincs** analitika vagy hibajelentő
könyvtár (se Sentry, se Firebase, se PostHog…), és a `supabase-js` kliensen
kívül **egyetlen saját hálózati hívás sincs** — nincs `fetch`, nincs `axios`.
A gyerek neve tehát nem tud sehova kikerülni. Ha később bekerül analitika, ez a
tétel újranyitandó.

**Menet közben talált tétel:** a `console.*` és mock-adat átvizsgálás tiszta —
az egyetlen `console.warn` a `lib/devWarn.ts`-ben van, `__DEV__` mögött. **A két
`scratch-*` képernyő viszont benne van a production bundle-ben**
(`scratch-ui.tsx`, `scratch-characters.tsx`), route-ként elérhetően. Ez a
„Dev utilities eltávolítása" tétel, ami még nyitva van — a törlésük a szülő
döntése, mert amíg eszközön tesztel, még használhatja őket.

**Fájlok:** docs/feature-tasks.md (kód nem változott)

**Tesztelve:** a fenti keresések a mai HEAD-en és a belőle exportált production
bundle-ön futottak.

**Nyitva maradt:**
- A „Lint + typecheck hibák nélkül" tétel **szándékosan nincs kipipálva**: most
  hibátlan, de ez ship előtt újra ellenőrzendő gate, nem egyszer megszerezhető
  pipa.
- A dev utilities tétel a scratch képernyők miatt nyitva.

**Commit:** chore: ship előtti titok- és analitika-ellenőrzés

## 2026-08-25 – fix: iOS Expo Go — fizikai iPhone-on se hang, se rezgés

**Mit:** Bejelentés: a gyakorlat alatt **fizikai iPhone-on, Expo Go-ban se hang,
se rezgés** nincs (csengő módban, tehát nem a néma kapcsoló), miközben a
macOS szimulátorban a hang szólt.

Ami az átvizsgálásból **kizárható**: a `breathing_settings` tábla üres, tehát a
szerver nem kapcsolhatta ki a csatornákat; a store alapértéke mind a háromra
`true`; a `ToggleRow`, a beállítás képernyő és a `fetchSettings` mezőnév-
párosítása helyes; a három WAV szabályos 16 bites, 22 050 Hz-es PCM;
az `expo-audio`, `expo-speech` és `expo-haptics` verziója pontosan az, amit az
SDK 54-es Expo Go tartalmaz.

Ami **megmaradt gyanúnak**, és amiért eddig semmi nyoma nem volt: mind a három
csatorna némán bukik (D-034), így eszközön semmi nem különbözteti meg a
„nincs natív modul", a „nincs magyar hang" és a „nem is futott le" esetet.
Ezért ez a commit **először láthatóvá teszi a hibát**, és közben kijavítja a
lejátszási lánc két valódi törékenységét (D-048):

1. `lib/devWarn.ts` (új): `__DEV__`-ben a Metro konzolra írja, ami élesben
   némán elbukna. Élesben a viselkedés változatlan, D-034 érvényben marad.
2. `lib/feedbackDiagnostics.ts` (új): a gyakorlat indulásakor egyszer lefutó
   önteszt — kiírja a kapcsolók állását, hogy az audio session beállt-e, hogy
   a lejátszó betöltődött-e (hossz, hangerő), hogy van-e **magyar hang** az
   eszközön, és hogy a haptika hívása lefut-e. Csak `__DEV__`-ben, a gyerek
   ebből semmit nem lát.
3. `prepareSounds()`: az audio session most **megvárható** és a gyakorlat
   indulásakor áll be (eddig a legelső lejátszás pillanatában, fire-and-forget
   módon), és a három lejátszó **előre betöltődik**. Eszközön ez valódi
   különbség: Expo Go-ban a WAV a Metro dev szerverről jön hálózaton át, így a
   fázisváltás pillanatában létrehozott lejátszó lemaradhat a saját
   négymásodperces ablakáról. A szimulátoron (localhost) ez sosem látszik.
4. Az audio session akkor is beáll, ha a hangeffekt ki van kapcsolva — az
   `expo-speech` ugyanazt a megosztott iOS audio session-t használja, tehát a
   beszédre is hatással van.

**Fájlok:** lib/devWarn.ts (új), lib/sounds.ts, lib/haptics.ts, lib/speech.ts,
hooks/useSessionFeedback.ts, CLAUDE.md, docs/feature-tasks.md

**Tesztelve:** fizikai iPhone-on, Expo Go alatt, több cikluson át. A trace
szerint a fázisváltás 4 másodpercenként pontosan elsül, a lejátszó valóban szól
(`szól=true`, `időzár=playing`), és a beszéd le is fut (`onStart` → `onDone`).
A `.playback` kategóriára váltás után **a szülő meg is hallotta a hangot és a
magyar beszédet**. `npm run typecheck` és `npm run lint` hibátlan.

**Nyitva maradt:**
- **A gyökérok nincs megerősítve.** A következő lépés: elindítani a gyakorlatot
  a fizikai iPhone-on, és a Metro terminálban elolvasni a
  `[visszajelzés-teszt]` blokkot. Ez négy irányt választ szét: (a) a kapcsolók
  ki vannak kapcsolva; (b) a natív modul hiányzik vagy hibát dob; (c) nincs
  magyar hang telepítve; (d) minden lefut, tehát eszközoldali beállítás a ludas.
- **Eszközoldali gyanú, amit a kód nem tud javítani:** a média hangerő nullán
  (a `.ambient` kategória a média csúszkát használja, és nem a csengőét), és
  az iOS `Beállítások → Hangok és rezgés → Rendszerrezgés` kikapcsolt állapota
  — ez utóbbi némán letiltja az összes `expo-haptics` hívást.
- A `playsInSilentMode: false` marad (a szülő döntése, 2026-08-25): néma
  kapcsolónál iOS `.ambient` kategóriát kapunk, ami a **beszédet is** elnémítja,
  nem csak a hangeffektet. Rezgés ilyenkor is van.
- A diagnosztika ideiglenes: ha a hiba megvan és nem tér vissza, a
  `lib/feedbackDiagnostics.ts` és a `useSessionFeedback`-beli hívása törölhető.
  A `devWarn` maradhat, az önmagában hasznos.

**Commit:** fix: az iOS-en néma visszajelzés diagnosztikája és a lejátszási lánc előtöltése

### Frissítés – a diagnosztika eredménye és a hang oka

Az eszközön (iPhone, 414×896, iOS 26.4.2) lefuttatott önteszt szerint **minden
ép**: a kapcsolók bekapcsolva, a WAV betöltődik (0,34 mp, nincs némítva,
`readyToPlay`), és van magyar hang az eszközön (Tünde). Vagyis se hiányzó
natív modul, se hiányzó TTS hang, se le nem töltődő asset.

**A hang oka megvan: a telefon néma módban volt.** A hangerő-csúszka mellett
az áthúzott piros csengő ikon jelezte. Néma kapcsolónál iOS `.ambient`
kategóriát kapunk (`playsInSilentMode: false`), ami a hangeffektet **és a
beszédet is** elnémítja — az `expo-speech` ugyanazt a megosztott audio
session-t használja. Ez tehát **szabályos működés**, nem hiba: a CLAUDE.md
kifejezetten ezt kéri, és a szülő 2026-08-25-én meg is erősítette, hogy a
szabály maradjon.

**Ez a magyarázat viszont megdőlt:** a szülő szerint a telefon nem volt néma
módban. A hangerő-HUD áthúzott csengője a **csengőhangerőt** mutatja nullán,
az pedig a médiacsatornát nem érinti — az `.ambient` lejátszás a média
csúszkán szól.

### A fázisszintű nyomkövetés eredménye: az app oldala hibátlan

A trace az eszközön, több cikluson át, hiánytalan: 4 másodpercenként pontosan
elsül a fázisváltás (`[fázis] 0 → 1 → 2 → 3`, mind a három kapcsoló `true`),
a lejátszó **valóban szól** (`szól=true`, `időzár=playing`, `várakozás=unknown`),
és a beszéd nemcsak elindul, hanem le is fut (`onStart` → `onDone` minden
mondatra). Tehát nincs kódhiba a visszajelzési láncban: a hang elhagyja az
appot, és az iOS némítja el a kimenet előtt.

Amit a trace **nem tud** megkülönböztetni: néma kapcsoló, nullán álló
médiahangerő és máshova (Bluetooth) irányított kimenet — mindhárom esetben a
lejátszó ugyanígy `playing`-et jelent, és a beszéd ugyanígy `onDone`-nal zárul.
Kimeneti útvonalat és rendszerhangerőt az `expo-audio` nem ad vissza, Expo
Go-ban pedig natív modult nem lehet alátenni.

Ezért került be a **hurkolt hangpróba** (`playTestTone`, `TEST_TONE` kapcsoló
a `lib/feedbackDiagnostics.ts`-ben): a fázishangok 0,34 mp-esek, annyi idő
alatt az iOS hangerő-HUD-ja fel se jön, tehát gyakorlat közben a média csúszka
állását nem lehet ellenőrizni. A hangpróba 6 mp-ig, teljes hangerőn szól.

### Lezárás: a telefon néma módban volt

A `__DEV__`-ben futtatott kísérlet (`playsInSilentMode: true`, tehát `.playback`
kategória `.ambient` helyett) egy körben eldöntötte: **azonnal megjött a hang**.
A telefon néma módban volt, és az `.ambient` kategóriát az iOS néma kapcsolója
elnémítja — a hangeffektet és a beszédet is, mert az `expo-speech` ugyanazt a
megosztott session-t használja. A lejátszó ettől még `playing`-et jelent, a
média hangerő-csúszka is feljön, és a hangerő-HUD áthúzott csengője is
megtévesztő volt: mindez néma módban is pontosan így néz ki. **Kódhiba nem
volt.**

A szülő döntése nyomán (2026-08-26) a szabály megváltozott: az app mostantól
**néma módban is szól** (D-049). A `CLAUDE.md` „Hang, beszéd, haptika"
szakasza ennek megfelelően át lett írva.

A rezgés ugyanennek a következménye: iOS-en néma módban a rendszerszintű
„Rezgés" beállítás dönt, és ha az tiltja, az `expo-haptics` hívás hibátlanul
lefut, mégsem érezni semmit. Ezt az app nem tudja felülírni, és nem is
próbálja — a `lib/haptics.ts` fejléce ezt most már pontosan írja le.

**A diagnosztika visszavéve.** A `lib/feedbackDiagnostics.ts`, a hurkolt
hangpróba, a fázisszintű nyomkövetés és a `devLog` törölve — a hiba megvan, és
a CLAUDE.md az egyszerűséget kéri. Ha újra kell, a git history-ból előhozható
(`a723309`, `cce941a`). **Ami maradt, mert önmagában is jobb:** a `devWarn`
(`__DEV__`-ben látszik, ami élesben némán bukik) és a `prepareSounds()`
előtöltés.

**Ami nyitva maradt:** semmi lényeges. A telefon hangerő-állításkor rezeg,
tehát a Taptic Engine működik, és az `impactAsync` sem dob hibát — de a
gyakorlat alatt nem érezhető. Ennek a mérésére került be a fázisszintű
nyomkövetés (`devLog`): a fázisváltás minden lépése, a `play()` utáni tényleges
lejátszási állapot, és az `expo-speech` `onStart`/`onDone`/`onError`
visszahívásai. Ez választja szét, hogy a fázisváltás **egyáltalán elsül-e** az
eszközön, vagy csak a megszólalás marad el.

## 2026-08-25 – 10. Szülői beállítások

**Mit:** Elkészült a beállítás képernyő, a szülői zárral együtt. A képernyőre
csak egy matematikai kérdés helyes megválaszolása után lehet belépni
(`components/ParentGate.tsx`): két 3–9 közötti szám szorzata, három
válaszlehetőséggel. Rossz válasznál nincs „elrontottad” hangulat és nincs
próbálkozás-limit, csak új feladat jön.

A `useSettingsStore` kibővült az emlékeztetővel és a gyakorlathosszal, és
kapott egy `version: 1` migrációt, mert a korábbi verzió csak a három
kapcsolót ismerte. A gyakorlat hossza mostantól tényleg érvényesül: a
`session.tsx` a store-ból veszi, de **a gyakorlat indulásakor rögzíti**, hogy
egy menet közbeni átállítás ne rántsa ki a visszaszámlálót a gyerek alól.

Az emlékeztető `expo-notifications`-szel, kizárólag **helyi** értesítésként:
nincs push, nincs token, nincs szerver. Az értesítés szövege nem tartalmazza a
gyerek nevét, és nem utal a beszédére vagy a teljesítményére.

Új dependency: `expo-notifications` (a feladatlista nevesíti).

**Fájlok:** app/(tabs)/settings.tsx (új), components/ParentGate.tsx (új),
lib/notifications.ts (új), lib/settings.ts (új), store/useSettingsStore.ts,
data/sessionLengths.ts, lib/sync.ts, app/_layout.tsx, app/session.tsx,
app/(tabs)/_layout.tsx, app/(tabs)/index.tsx, package.json,
docs/feature-tasks.md

**Tesztelve:** iPad mini szimulátor (Expo Go) és valódi Supabase.
- **Szülői zár:** hideg indításból a `/settings` route-ra lépve a zár jelenik
  meg („Mennyi 5 × 4?”, három válasz: 12, 27, 20), a beállítások nem látszanak.
- **Beállítás képernyő:** mind a négy kapcsoló (Hangeffektek, Hangos útmutatás,
  Rezgés, Napi emlékeztető), a „Gyakorlat hossza” szegmens választó a
  `2-3 perc`-en, a 17:30-as emlékeztető kártya és a „Kijelentkezés” gomb a
  design szerint jelenik meg.
- **Szerver szinkron, valódi klienssel, RLS alatt** (teszt fiókkal, utána
  törölve): a séma triggere létrehozta a `breathing_settings` sort az
  alapértékekkel; a módosított beállítás (hang ki, rezgés ki, 07:15,
  `long`) hiba nélkül felment és **ugyanúgy olvasható vissza**; érvénytelen
  hossz-kulcsot a séma `23514`-gyel elutasít; idegen `child_id`-vel az
  update egyetlen sort sem érint.

**Menet közben javított hiba:** az emlékeztető engedélykérése eredetileg **app
indításkor**, a kezdőképernyőn, a gyerek előtt ugrott fel. Ez rossz — az
engedélyt a szülőnek kell megkapnia, a zár mögött. Javítva: indításkor csak
akkor ütemezünk, ha az engedély már megvan, és **soha nem kérdezünk**;
kérdezni csak a beállítás képernyő szabad (D-047).

`npm run typecheck` és `npm run lint` hibátlan.

**Nyitva maradt:**
- **Az `expo-notifications` Expo Go-ban figyelmeztet** („functionality is not
  fully supported in Expo Go”). A helyi értesítés ütemezése lefut, de hogy a
  17:30-as értesítés **tényleg megérkezik-e**, azt csak dev buildben vagy
  TestFlighten lehet igazolni — szimulátoron nem vártuk ki.
- Az `app.json`-ba nem került `expo-notifications` config plugin. Helyi
  értesítéshez iOS-en nem kötelező, de EAS build előtt érdemes átnézni
  (ikon, hang, Android csatorna).
- **A szülői zár minden belépéskor kérdez**, nincs „ne kérdezd 5 percig”
  emlékezés. Egyszerűbb, és a szülő ritkán megy be.
- A zár válaszlehetőségei között a helyes válasz mindig szerepel — egy
  ügyesebb 9 éves kitalálhatja. A CLAUDE.md kifejezetten „egyszerű matematikai
  kérdést, nem PIN-t” kért, tehát ez tudatos.
- A teljes kör (bejelentkezés → beállítás → gyakorlat) továbbra sincs
  végigjátszva a futó appban, ugyanazon auth ok miatt, mint a 8–9. szakasznál.

**Commit:** feat: szülői beállítások, szülői zár és napi emlékeztető

## 2026-08-25 – 9. Matricák és streak

**Mit:** Elkészült a matricagyűjtemény (5. képernyő) és a hozzá tartozó
feloldási logika. A katalógus hardcoded (`data/stickers.ts`), 9 matricával: az
első öt a designból való, a másik négyet mi tettük hozzá, mert a design a
6–9. slotot csak névtelen „Zárolva" placeholderként rajzolja (D-040). A
feloldottság **kizárólag a befejezett gyakorlatok számából** származik —
minden 5. gyakorlat old fel egyet, a katalógus sorrendjében —, így nem tud
elcsúszni egy külön tárolt listától.

Az alakok `@expo/vector-icons` ikonok, nem CSS-ből épített `View`-k: a design a
csillagot `clip-path`-tal rajzolja, amit a React Native nem támogat (D-041).
Új dependency nem kellett, az `@expo/vector-icons` már a projekt része.

A designban nincs link a matricákhoz és nincs vissza gomb sem — mivel a tab
sáv rejtve van (D-025), mindkettőt pótolni kellett: a kezdőképernyő
szintkártyája nyitja a gyűjteményt, a gyűjtemény tetején pedig van vissza
gomb (D-042).

Az ünneplés a kezdőképernyőn jelenik meg, nem a gyakorlat képernyőn: a
gyakorlat vége azonnal visszalép, ezért a feloldott kulcs a store-ban utazik
(`justUnlocked`), és a kezdőképernyő mutatja meg. Nem modal, nem kér
érintést — megjelenik, 2,6 mp-et kivár, majd magától eltűnik.

A `lib/sync.ts` mostantól a feloldott kulcsokat és a sorozatot is felviszi
(`breathing_stickers`, `breathing_children`) — ezzel a 8. szakasz nyitott
pontja („a streak nem megy fel") is lezárult.

Egy design érték hiányzott a palettából: a csillag matrica gradiensének
kezdőszíne (`#E4D9FF`), ez bekerült `purple.200` néven.

**Fájlok:** data/stickers.ts (új), components/StickerTile.tsx (új),
components/StickerCelebration.tsx (új), lib/stickers.ts (új),
app/(tabs)/stickers.tsx (új), app/(tabs)/_layout.tsx, app/(tabs)/index.tsx,
components/LevelCard.tsx, store/useChildStore.ts, lib/child.ts, lib/sync.ts,
constants/palette.json, docs/feature-tasks.md

**Tesztelve:**

*Feloldási logika* — 18 határeset, mind rendben: 0/4 gyakorlat → 0 matrica;
5 → 1; 9 → még mindig 1; 10 → 2; 23 → 4; 45 → mind a 9; 60 → nem megy 9 fölé;
negatív input → 0. A „következő matrica" 0-nál Szívecske, 23-nál Vízcsepp,
44-nél Lufi, 45-nél `null`. A „még N gyakorlat" 23-nál 2, 20-nál 5, 24-nél 1.
Az ünneplés pontosan az 5., 10., 15., … 45. gyakorlatnál sül el.

*Képernyő, iPad mini szimulátoron, Expo Go* — 23 befejezett gyakorlatra
állított demó állapottal: a rács 4 feloldott (Szívecske, Csillagfény, Levélke,
Napsugár) és 5 zárolt csempét mutat, három egyenlő oszlopban, 14-es közökkel.
A sorozat sor „5 napos sorozat — ne hagyd abba!", a kártya „Következő jelvény:
Vízcsepp / Még 2 gyakorlat kell hozzá" — mind valós adatból. Fekvő és álló
módban is helyes. Az ünneplő kártya („Új matrica: Napsugár! / Bekerült a
gyűjteményedbe 🎉") a szintkártya alatt jelenik meg, a matrica saját
gradiensével. Menet közben az is igazolódott, hogy a `clearJustUnlocked()`
tényleg lefut és perzisztálódik: egy második betöltésnél már nem jött elő.

*Szerver szinkron, valódi `supabase-js` klienssel, valódi RLS alatt* (teszt
fiókkal, ami utána törölve lett): 4 matrica feltöltve → 4 sor; ugyanaz a 4 +
egy új újraküldve → **5 sor, duplikátum nélkül**; a már meglévő sor
`earned_at`-je **nem íródott felül**; a streak és a `last_session_date`
felment a `breathing_children`-re; idegen `child_id`-vel a beszúrás
`42501`-gyel elutasítva. A teszt fiók és minden teszt sor törölve, az
adatbázis üresen maradt.

`npm run typecheck` és `npm run lint` hibátlan.

**Nyitva maradt:**
- **A teljes kör a futó appban nincs végigjátszva** (gyakorlat → 5. befejezés →
  ünneplés → gyűjtemény → szerver), mert ahhoz be kell tudni jelentkezni; a
  részeket külön-külön viszont igazoltuk. Ugyanaz a nyitott pont, mint a
  8. szakasznál: e-mail megerősítés vagy saját SMTP kell hozzá.
- **A 9. matrica „Lufi" lett „Hullámocska" helyett.** A tervezett névhez nincs
  hullám ikon az Ionicons készletben; a lufi viszont illik az app saját
  képnyelvéhez („fújd el a lufit lassan" – napi tipp). A színek a tervezettek
  maradtak.
- A `breathing_stickers` tábla csak írásra van használva, olvasásra nem — a
  gyűjtemény a lokális `completedSessions`-ből rajzolódik. Eszközváltáskor a
  matricák a session sorokból állnak helyre (a `countCompletedSessions()`
  révén), a `breathing_stickers` ehhez ma nem járul hozzá.
- A gyűjtemény képernyő nincs a szülői zár mögött — a 10. szakasz témája.

**Commit:** feat: matricagyűjtemény, feloldás és ünneplés

## 2026-08-25 – 8. Session mentés és offline sor

**Mit:** A lezárt gyakorlatok felkerülnek a `breathing_sessions` táblára. Az új
`lib/sync.ts` üríti a `useSessionStore.pending` sort: egyetlen kötegelt
`upsert`, `ignoreDuplicates` mellett. A gyakorlat továbbra is **mindig
lokálisan záródik**, a feltöltés utólag, best-effort — a UI sosem várja meg, és
hiba esetén nem jelez semmit.

A duplikáció elleni védelem: a `recordSession` mostantól **uuid v4-et** generál
lokálisan, és ez az id megy fel a `breathing_sessions.id`-ba is. Egy megismételt
feltöltés így ütközik a primary keyre, és `ignoreDuplicates` mellett egyszerűen
kimarad (D-039). A store kapott egy `version: 1` migrációt, mert a korábbi
`${Date.now()}-${random}` id **nem** uuid, és egy ilyen sor `invalid input
syntax`-ra futva örökre megakasztotta volna a kötegelt feltöltést.

Három ponton fut a szinkron: app indításkor, minden előtérbe kerüléskor
(`AppState`), és minden gyakorlat végén. Hálózatot nem figyelünk, mert az új
könyvtárat jelentett volna (D-038).

**Fájlok:** lib/sync.ts (új), store/useSessionStore.ts, app/_layout.tsx,
app/session.tsx, docs/feature-tasks.md

**Tesztelve:** valódi Supabase projekten (`eguhipjgnhbajbmnrskm`), ideiglenes
teszt fiókkal és gyerek profillal, **valódi `supabase-js` klienssel és valódi
RLS alatt** (nem szimulált JWT-vel):
1. Bejelentkezés a teszt szülővel → OK.
2. A `fetchChildProfile()` gyerek-lekérdezése → megtalálta a profilt.
3. Két várakozó gyakorlat (egy befejezett 150 mp, egy megszakított 40 mp),
   kliensen generált uuid id-kkel.
4. 1. feltöltés → 2 sor.
5. **2. feltöltés ugyanazokkal az id-kkel** (mintha a sor nem ürült volna) →
   a táblában **továbbra is 2 sor**, duplikátum nincs.
6. A `countCompletedSessions()` 1 befejezettet ad vissza — a megszakított nem
   számít bele, ahogy kell.
7. **RLS:** idegen `child_id`-vel a beszúrás `42501`-gyel elutasítva.
8. **Offline eset:** elérhetetlen hosttal az `uploadSessions()` üres listát ad,
   tehát a sor **nem ürül** — a gyakorlat nem vész el.

Előtte SQL-ből, `authenticated` szerepben is le lett futtatva ugyanez: 5
beszúrási kísérletből 2 körben 3 különböző sor keletkezett.

A teszt fiók, a gyerek profil és minden teszt sor **törölve**; az adatbázis
ugyanabban az állapotban maradt, mint a munka előtt (0 sor mind a négy
`breathing_` táblában).

`npm run typecheck` és `npm run lint` hibátlan, a Metro bundle (1591 modul)
hiba nélkül fordul.

**Nyitva maradt:**
- **A teljes kliensút a futó appban nincs végigkattintva.** A szinkron
  meghívása (`app/_layout.tsx`, `app/session.tsx`) csak fordítási szinten
  igazolt; a `lib/sync.ts` belső logikáját viszont a fenti teszt 1:1-ben
  ugyanazzal a klienssel és lekérdezésekkel futtatta. Az appban való
  végigjátszáshoz be kell tudni jelentkezni, ahhoz pedig vagy saját SMTP kell,
  vagy az e-mail megerősítés ideiglenes kikapcsolása (a 0./1. szakasz óta
  nyitott pont).
- **A `breathing_children.streak_days` és `last_session_date` nem megy fel.**
  A `registerCompletedSession` csak lokálisan lép, a szerveren ez a két oszlop
  0/üres marad. A `completedSessions` ettől függetlenül helyes, mert azt a
  `countCompletedSessions()` a session sorokból számolja. A streak szerver
  oldali vezetése a 9. szakaszé.
- **Egy „mérgezett" sor megakasztaná a köteget:** ha egy sor tartósan
  visszautasításra kerül (pl. a gyerek profilt szerver oldalon törölték), a
  köteg minden alkalommal elhasal, és a sor nem ürül. Soronkénti feltöltésre
  vagy a sor méretének korlátozására nincs védelem — v1-ben tudatosan nem
  bonyolítottuk (D-039).

**Commit:** feat: session feltöltés és offline sor

## 2026-08-25 – 7.5. iPad támogatás és fekvő tájolás

**Mit:** Az app iPaden is használható, és iPaden **fekvő módban is** — ezt a
gyerek kérte, mert fekve akarja használni. A telepítés TestFlighten keresztül
lesz, a cél eszköz egy **6. generációs iPad** (1024×768 pt, iPadOS 17.7).

A design egyetlen méretben készült (390 pt széles telefon, álló), ezért kellett
egy skálázási réteg: az új `constants/layout.ts` a képernyő **rövidebb**
oldalából számol egy `uiScale` szorzót, és minden méret az `s()` függvényen megy
át — padding, betűméret, gap, légződoboz, karakter, árnyék-offset. Fekvő módban
a rövidebb oldal a magasság, ezért abból számolunk (D-035). A szorzó modul
szintű konstans, nem hook: forgatáskor **nem változik**, tehát a layout nem
ugrik át más méretre, amikor a gyerek megfordítja a táblagépet. Telefonon a
szorzó pontosan 1.0.

A tartalom iPaden egy `contentMaxWidth` széles, középre igazított oszlopba
került — enélkül fekvőben egy közel 1000 pt széles beviteli mező lenne.

A tájolás iPhone-on marad álló (`orientation: "portrait"`), iPaden mind a négy
irány engedélyezett az `ios.infoPlist` `UISupportedInterfaceOrientations~ipad`
kulcsával (D-036). Emellett `requireFullScreen: true`, tehát iPaden nincs Split
View — részben mert gyerekappnál nem szerencsés, részben mert így az ablak
mérete garantáltan megegyezik a képernyőével, amire a szorzó épül (D-037).

Az `app.json` megkapta a `bundleIdentifier`-t (`com.kacsorzsolt.dobozlegzes`),
mert EAS buildhez és TestFlighthez kötelező. **Ha más bundle id kell, ez az
egyetlen hely, ahol át kell írni** — még nem futott EAS build.

**Fájlok:** constants/layout.ts (új), constants/typography.ts,
constants/shadows.ts, components/BreathingBox.tsx, PhaseDots.tsx,
ProgressBar.tsx, PauseButton.tsx, PrimaryButton.tsx, TextField.tsx,
FormMessage.tsx, StreakChip.tsx, GearButton.tsx, LevelCard.tsx,
CharacterPicker.tsx, Checkbox.tsx, ToggleRow.tsx, SegmentedChoice.tsx,
Twinkles.tsx, app/session.tsx, app/(tabs)/index.tsx, app/(auth)/login.tsx,
app/(auth)/register.tsx, app.json, docs/feature-tasks.md

**Tesztelve:** iPad mini (A17 Pro) szimulátor, Expo Go, SDK 54.
Az iPad mini rövidebb oldala 744 pt — **szigorúbb eset, mint a cél iPad 6**
(768 pt), tehát ami itt elfér, ott is elfér.
- **Álló mód:** a bejelentkező képernyő arányosan felnagyítva jelenik meg, a
  tartalom középre igazított oszlopban (518 pt a 744-ből), a Bunny, a
  tipográfia és a gombok együtt nőttek. Semmi nem lóg ki.
- **Fekvő mód:** a készüléket elforgatva az app **együtt fordul** (a Simulator
  ablaka 707×545-re vált, az app tartalma vele), tehát a `~ipad` tájolás
  Expo Go-ban is érvényesül. A gyakorlat képernyő fekvőben **hiánytalanul
  elfér**: vissza gomb, „2:09 maradt", „Lélegezz be" felirat, a narancs
  légződoboz kerettel és a karakterrel, a négy fázispötty, a session sáv és a
  „Szünet" gomb — a tartalom kb. 646 pt-ot foglal a 744-ből, semmi nem vágódik
  le. A doboz kerete mérve ~302 pt (telefonon 220), tehát a nagyítás a
  számított 1,329-es szorzót adja. Az iPad 6 szorzója 1,371 lesz, a gyakorlat
  képernyő tartalma ott kb. 683 pt a 768-ból.
- **iPhone 17 szimulátor:** a bejelentkező képernyő a régi, telefonos
  méretében jelenik meg — teljes szélességű mezők, nincs oszlopkorlát. A
  szorzó minden iPhone-on (SE 375, 17 402, Pro Max 440) pontosan 1.000, tehát
  az `s()` az azonosság és egyetlen design érték sem változik.
- `npm run typecheck` és `npm run lint` hibátlan. A Metro bundle (1585 modul)
  hiba nélkül fordul.

**Nyitva maradt:**
- **Éles iPad 6-on még nincs kipróbálva** — a szimulátorlistában nincs ilyen
  régi modell, ezért iPad minivel helyettesítettük. A 6. generációs iPad A10-es
  processzora lassabb; a reanimated légzésanimáció UI szálon fut, tehát
  elvben nem érintett, de **méréssel még nem igazoltuk**.
- **TestFlighthez még hiányzik:** Apple Developer Program tagság, EAS build
  konfiguráció (`eas.json`), és a `bundleIdentifier` jóváhagyása. EAS build
  eddig egyáltalán nem futott ezen a projekten (lásd a 0. szakasz nyitott
  pontját a Hermes export hibáról — az EAS saját toolchainnel fordít, ezért
  ott várhatóan nem jelentkezik, de ez sincs igazolva).
- Az `app.json` neve továbbra is `b2kira`, nem „Doboz Légzés". TestFlight
  előtt érdemes átírni (ez a 0. szakasz óta nyitott pont).
- A két `scratch-*` képernyő nem kapott skálázást — dev eszközök, a „Ship
  előtt" listán amúgy is törlésre vannak jelölve.
- A matrica- és beállítás képernyő (9. és 10. szakasz) még nem létezik; azokat
  eleve `s()`-sel kell megírni.

**Commit:** feat: iPad támogatás arányos nagyítással és fekvő tájolással

## 2026-08-25 – 7. Hang, beszéd, haptika

**Mit:** A gyakorlat megszólalt. A három visszajelzési csatorna a
**fázisváltás** pillanatához kötve fut (nem a folyamatos animációhoz), egyetlen
helyről: `hooks/useSessionFeedback.ts`. Rezgés — belégzés kezdetén `Medium`, a
másik három váltásnál `Light`, a gyakorlat végén `Success` —, halk hangeffekt
és magyar beszéd (`hu-HU`, `rate: 0.85`, minden mondat előtt `Speech.stop()`).

A három kapcsoló az új `store/useSettingsStore.ts`-ben él (persist
AsyncStorage-dzsel, alapból mindhárom bekapcsolva). A hook a fázisváltáskor
`getState()`-tel olvassa ki őket, nem feliratkozással: így a kapcsoló azonnal
érvényes, de a kapcsolgatás önmagában nem indít el hangot vagy mondatot
(D-032). A beállítás képernyő a 10. szakaszé, addig a `scratch-ui` képernyő
három kapcsolója már a valódi store-ra megy.

A hangok `assets/sounds/`-ban: emelkedő `inhale.wav`, rövid `hold.wav`,
ereszkedő `exhale.wav` — generált, halk szinusz hangok, ideiglenesnek szánva
(D-033). A lejátszás `expo-audio`-val, `playsInSilentMode: false` és
`mixWithOthers` mellett: iOS néma kapcsolónál a hang elnémul, a rezgés megy
tovább. Hiányzó vagy hibás hangfájl, hiányzó haptika és hiányzó magyar TTS hang
esetén mind a három csatorna némán továbbenged — a gyakorlat sose álljon meg
azért, mert nem tudott megszólalni (D-034).

Új dependency: `expo-audio`, `expo-speech` (mindkettő a CLAUDE.md tech stackjében
nevesítve van).

**Fájlok:** hooks/useSessionFeedback.ts, lib/haptics.ts, lib/speech.ts,
lib/sounds.ts, constants/sounds.ts, store/useSettingsStore.ts,
assets/sounds/inhale.wav, assets/sounds/hold.wav, assets/sounds/exhale.wav,
app/session.tsx, app/scratch-ui.tsx, app.json, package.json, docs/feature-tasks.md

**Tesztelve:** iOS szimulátor (iPhone 17, iOS 26), Expo Go, ideiglenes
naplózással mérve. A visszajelzés **pontosan 4,00 mp-enként** sül el, sorban
`Lélegezz be` → `Tartsd` → `Lélegezz ki` → `Tartsd` (mért időbélyegek:
…19.362 / …23.401 / …27.399 / …31.401 / …35.412), és a beszéd tényleg szól
(`Speech.isSpeakingAsync() === true` minden fázisváltás után 400 ms-mal).
Háttérbe küldés: a visszajelzés azonnal elhallgat, visszatéréskor szünetel és
nem ismétli meg a fázist. A három kapcsolót futó gyakorlat közben átállítva
mindegyik **a következő fázisváltásnál** azonnal érvényesült, újraindítás
nélkül, és visszakapcsolva újra megszólalt. `expo-audio` hibát egyszer sem
dobott. `npm run typecheck` és `npm run lint` hibátlan.

**Nyitva maradt:**
- **A hangok generált placeholderek** (D-033) — éles eszközön, gyerekkel még
  nincsenek kipróbálva. A feladatlista tesztje („ha csukott szemmel is tudja
  követni, jó") még nem futott le. A hangerő (`VOLUME = 0.7` a `lib/sounds.ts`-ben)
  és maguk a hangok cserélhetők a többi kód érintése nélkül.
- **Haptika szimulátoron nem mérhető** — az `expo-haptics` hívások lefutnak,
  de rezgés nincs; éles iPhone-on még ellenőrizendő.
- A magyar TTS hang minősége csak szimulátoron hallgatva; éles eszközön
  (ahol más hangkészlet lehet telepítve) még nem.
- A beállítás képernyő (10. szakasz) még nincs meg, addig a kapcsolók csak a
  `scratch-ui` képernyőn érhetők el, ami ship előtt törlendő.
- Szünet után nem ismételjük meg az aktuális fázis mondatát — szándékos, de
  gyerekkel érdemes megnézni, nem hiányzik-e.

## 2026-08-25 – 6. Légzőgyakorlat (4. képernyő)

**Mit:** Elkészült a projekt szíve: az élő 4-4-4-4 gyakorlat a canvas 4.
képernyője alapján. A ritmust egyetlen lineáris „ciklus-óra" hajtja a UI
szálon (`useBreathingCycle`, shared value 0 → 16 mp), és **ebből az egyetlen
értékből** jön a doboz mérete, a radiusa és a karakter nagyítása is, így nem
tudnak elcsúszni (D-027). React state-be csak a fázisindex kerül, 16 mp-enként
négyszer — ez váltja a feliratot, a doboz színét és a pöttyöket.

A visszaszámláló külön hook (`useSessionTimer`), és időbélyegből számol, nem a
tickeket adja össze, így egy akadó tick nem csúsztatja el a végét. A `Szünet`
`cancelAnimation`-nel ott állítja meg az animációt, ahol van, a `Folytatás`
pedig a megkezdett ciklust futtatja végig, és csak utána tér vissza a ciklus
elejére — nem ugrik vissza a fázis elejére.

A lezárt gyakorlatok lokálisan mentődnek (`store/useSessionStore.ts`, persist
AsyncStorage-dzsel) — a részleges is, megerősítő kérdés nélkül, a képernyő
elhagyásakor. A befejezett gyakorlat lépteti a `useChildStore`
`completedSessions` és `streakDays` értékét is, így a kezdőképernyő
szintkártyája és a streak chip végre él (D-030). A feltöltés a 8. szakaszé,
addig a sor csak gyűlik. Új dependency: `expo-keep-awake` (a feladatlista
6. szakasza nevezi meg — D-031).

**Fájlok:** app/session.tsx, hooks/useBreathingCycle.ts, hooks/useSessionTimer.ts,
components/BreathingBox.tsx, components/PhaseDots.tsx, components/PauseButton.tsx,
data/phases.ts, data/sessionLengths.ts, store/useSessionStore.ts,
store/useChildStore.ts, constants/colors.ts, constants/shadows.ts,
package.json, docs/feature-tasks.md

**Tesztelve:** iOS szimulátor (iPhone 17, iOS 26), Expo Go, képernyőképekkel
ellenőrizve: mind a négy fázis a helyes színnel és felirattal, a doboz 155 →
200 px között lélegzik a 220-as kereten belül, a karakter vele skálázódik, a
pöttyök követik a fázist. **A ritmus pontos:** 48 mp (3 teljes ciklus) múlva
ugyanaz a fázis és ugyanaz a dobozméret, csúszás nélkül. A szünet a pink
„Tartsd" fázisban megállt (doboz és sáv befagyott, a gomb „Folytatás" lett),
folytatáskor onnan ment tovább. Háttérbe küldés (Beállítások app) →
visszatéréskor szünetel. A lezárás naplózva: befejezett gyakorlat
`completed:true` + gyerek profil léptetve, kilépéskor 8 mp-es `completed:false`
sor a lokális sorban. `npm run typecheck` és `npm run lint` hibátlan.

**Nyitva maradt:**
- **Hang, beszéd, haptika még nincs** (7. szakasz) — a fázisváltás pillanata
  ott van a kódban (`phase` state), csak rá kell akasztani.
- A gyakorlat hossza fixen 150 mp; a választó a 10. szakaszban jön
  (`data/sessionLengths.ts` már megvan, a három opcióval).
- A gyakorlat végén nincs ünneplés, csak visszalép a kezdőképernyőre (D-029) —
  a matrica-ünneplés a 9. szakasz feladata.
- Éles iPhone-on (nem szimulátoron) még nincs megnézve, és a feladatlista
  5 perces futásteszt-e sem futott végig — a 48 mp-es mérés viszont pontos volt.
- A két scratch képernyő (`scratch-characters`, `scratch-ui`) mostantól nem
  érhető el sehonnan, mert a placeholder linkjei eltűntek a `session.tsx`-ből.
  Ship előtt törlendők.

## 2026-08-25 – fix: a `Pressable` `style` függvényét elnyeli a NativeWind

**Mit:** A kezdőképernyőn nem lehetett karaktert választani: a négy chip
egyáltalán nem látszott. Kiderült, hogy nem a választó a hibás, hanem egy
projekt szintű probléma: ha a `Pressable` `style` propja **függvény**
(`style={({ pressed }) => …}`), a NativeWind interop elnyeli, és a komponens
**teljes** stílusa elveszik — nem csak a lenyomott állapot, hanem a méret, a
háttér és a keret is. Ezért volt láthatatlan a chip (nem volt mérete, így a
gradiens sem kapott helyet) és a fogaskerék fehér köre, és ezért nem volt
lila keret a kiválasztott karakteren.

Mind a 11 érintett hely átállt statikus `style` tömbre; a lenyomott állapotot
az új `hooks/usePressed.ts` adja (`onPressIn`/`onPressOut` + lokális state).
Ez már commitolt komponenseket is javít, amiken eddig észrevétlenül hiányzott
a stílus: `PrimaryButton` (árnyék, teljes szélesség), `Checkbox` (a sor
elrendezése), `SegmentedChoice` (kiválasztott elem háttere), `ToggleRow`,
valamint a bejelentkezés „Elfelejtett jelszó?" jobbra igazítása. Lásd D-026.

**Fájlok:** hooks/usePressed.ts, components/CharacterPicker.tsx,
GearButton.tsx, PrimaryButton.tsx, Checkbox.tsx, SegmentedChoice.tsx,
ToggleRow.tsx, app/(auth)/login.tsx, app/(auth)/register.tsx,
app/session.tsx, app/scratch-characters.tsx, docs/feature-tasks.md

**Tesztelve:** **iOS szimulátoron, Expo Go-val** (iPhone 17, iOS 26) —
ez az első alkalom, hogy az app futott. A karakterválasztás végig kipróbálva:
koppintásra átvált a nagy karakter, a lila keret követi, és app-újraindítás
után is megmarad (a Zustand `persist` működik). A regisztráció és a
bejelentkezés képernyő is helyreállt. `npm run typecheck` és `npm run lint`
hibátlan.

**Hasznos a következő munkamenetnek:** a szimulátor működik fejlesztői
ellenőrzésre. `npx expo start`, `xcrun simctl openurl booted
"exp://127.0.0.1:8081"`, képernyőkép `xcrun simctl io booted screenshot`.
Az auth guard mögötti képernyőket ideiglenesen az `(auth)` csoportba tett
re-export route-tal lehet megnézni bejelentkezés nélkül.

**Nyitva maradt:**
- A `Twinkles` pöttyök helye a designhoz képest eszközön ellenőrizve: a
  402×874-es kerethez igazított értékek iPhone 17-en jól néznek ki.
- A szimulátoron a Supabase hívások nem futottak le (nincs bejelentkezve),
  így a `syncFromServer` éles adattal még nincs kipróbálva.

**Commit:** fix: a Pressable style függvényét elnyeli a NativeWind interop

## 2026-08-25 – 5. Kezdőképernyő (3. képernyő)

**Mit:** Elkészült a kezdőképernyő a canvas 3. képernyője alapján: üdvözlés,
streak chip, fogaskerék, nagy karakter, karakterválasztó, szintkártya +
progress bar, napi tipp és a CTA gomb. Az adatok a `store/useChildStore.ts`-ből
jönnek (Zustand + `persist` AsyncStorage-dzsel), a Supabase frissítés utólag,
best-effort módon fut a `lib/child.ts`-en keresztül — a képernyő sosem vár
hálózatra (D-024).

Négy új komponens: `StreakChip`, `GearButton` (a fogaskerék CSS-ből rajzolva,
kép asset nélkül), `CharacterPicker` (4 × 36 px chip, aktív 3 px lila kerettel,
`hitSlop`-pal 44 pt — D-017) és `LevelCard`. Két új adatfájl: `data/levels.ts`
(szint = minden 5. befejezett gyakorlat, 8 szintnév — D-023) és `data/tips.ts`
(7 tipp, `Date.getDay()` szerint váltakozva).

A tab bar el van rejtve: a designban egyik képernyőn sincs alsó sáv, a
kezdőképernyő a hub (D-025). Új dependency: `zustand` (a CLAUDE.md tech
stackjében eleve szerepel).

**Fájlok:** app/(tabs)/index.tsx, app/(tabs)/_layout.tsx, app/session.tsx,
components/StreakChip.tsx, components/GearButton.tsx,
components/CharacterPicker.tsx, components/LevelCard.tsx, constants/colors.ts,
data/levels.ts, data/tips.ts, lib/child.ts, store/useChildStore.ts,
package.json, docs/feature-tasks.md

**Tesztelve:** `npm run typecheck` és `npm run lint` hibátlan. Az iOS
production export lefut (4,42 MB Hermes bytecode), és a bundle tartalmazza az
új szövegeket („Felhő-ösvény", „Készen állsz egy jó nagy levegőre?", „Mai
tipp", a napi tippeket) és a store perzisztencia kulcsát
(`doboz-legzes.child`). **Éles iPhone-on Expo Go-val még nincs megnézve.**

**Nyitva maradt:**
- Az `app/session.tsx` egyelőre **fejlesztői placeholder** — a 6. szakasz
  cseréli le. A két scratch képernyő linkje ide költözött, mert a valódi
  kezdőképernyőn nincs helye. Ship előtt mindhárom törlendő.
- A fogaskerék és a streak chip még nem navigál (a beállítások és a matricák
  képernyő a 9–10. szakaszban készül el). A gomb `disabled`, nem ad hamis
  visszajelzést.
- Ha nincs gyerek profil (új eszköz, még nincs `breathing_children` sor), az
  üdvözlés „Szia! 🌸". A profil létrehozó képernyő továbbra is hiányzik.
- A persist rehidratálása aszinkron: elméletileg egy pillanatra a név nélküli
  üdvözlés villanhat fel. AsyncStorage-ból ez pár ms, eszközön ellenőrizendő.
- A `streakDays` értéket még senki nem növeli — a gyakorlat lezárása (6. és 8.
  szakasz) fogja. Addig a chip 0-t mutat; a „kihagyott nap → 0" logika
  (`activeStreakDays`) viszont már benne van.
- Eszközön ellenőrizendő: a 62 px-es felső padding, a karakter és a kártyák
  együtt kis képernyőn (iPhone SE) — a design 402×874-hez van igazítva.

## 2026-08-25 – 4. Auth képernyők (1–2. képernyő)

**Mit:** Elkészült a bejelentkezés és a regisztráció a canvas 1. és 2.
képernyője alapján, bekötött Supabase auth-tal. A két képernyő csak
megjelenítés: az űrlap-ellenőrzés, a Supabase hívások és a magyar
hibaüzenetek a `lib/auth.ts`-ben vannak (`signIn`, `signUp`,
`resetPassword`, `signOut`, `ensureChildProfile`), a bejelentkezett állapot
pedig a `hooks/useAuthSession.ts`-ben. Az auth guard a gyökér layoutban ül:
amíg a tárolt session be nem töltődött, semmi nem renderelődik, utána
session nélkül `/login`-ra, session-nel a `(tabs)`-ra irányít (D-019).

Két új komponens: `Checkbox` (18×18, a designban csak bepipálva szerepel,
az üres állapot fehér + `toggle.off` keret) és `FormMessage` (hiba- és
sikerkártya az elsődleges gomb fölött). Mindkettő a designból hiányzó
állapot, rákérdezés után – lásd D-020. A töltés a gomb feliratában látszik
(„Bejelentkezés…"), a `PrimaryButton` nem kapott új propot.

A gyerek profilja nem a regisztrációkor jön létre, hanem a megerősített
e-mail utáni első belépéskor: a projekten be van kapcsolva az e-mail
megerősítés, tehát a `signUp` után nincs session, RLS mellett pedig nem
lehet beszúrni. A név és az életkor addig AsyncStorage-ban vár (D-021).

**Fájlok:** app/(auth)/_layout.tsx, app/(auth)/login.tsx,
app/(auth)/register.tsx, app/_layout.tsx, components/Checkbox.tsx,
components/FormMessage.tsx, hooks/useAuthSession.ts, lib/auth.ts,
docs/feature-tasks.md

**Tesztelve:** `npm run typecheck` és `npm run lint` hibátlan. Az iOS
production export lefut (4,37 MB Hermes bytecode), és a bundle tartalmazza
mindkét képernyő szövegeit (a Hermes a nem ASCII stringeket UTF-16-ban
tárolja, ezért `grep -a` helyett bájtszintű kereséssel ellenőriztem).
A Supabase auth végpontjait `curl`-lel próbáltam a projekt anon kulcsával:
a hibakódok (`invalid_credentials`, `over_email_send_rate_limit`) pontosan
azok, amikre a `lib/auth.ts` fordítása épül. **Éles iPhone-on Expo Go-val
még nincs megnézve.**

**Nyitva maradt:**
- **A Supabase beépített SMTP-je kb. 2 levél/óra** — a regisztrációs próba
  már most `over_email_send_rate_limit`-be futott. Éles használat előtt
  saját SMTP kell (vagy a Dashboardon kikapcsolható az e-mail megerősítés,
  akkor a `signUp` rögtön ad session-t, és a profil azonnal létrejön).
- A jelszó-visszaállító levél linkje jelenleg a Supabase alap oldalára
  visz, nem az appba. Deep link (`b2kira://`) és „új jelszó" képernyő még
  nincs — ez a 10. szakasz szülői zár körébe illik majd.
- Ha valaki bejelentkezik, de nincs gyerek profilja **és** nincs függő
  adat a telefonon (pl. új eszközön), most nincs hova irányítani. A profil
  létrehozó képernyő az 5. szakasz `useChildStore`-jával jön.
- Eszközön ellenőrizendő: a 72 px-es felső padding az iPhone állapotsáv
  alatt (D-022), a billentyűzet fölé csúszó gomb (`KeyboardAvoidingView`),
  és hogy a regisztráció görgethető marad-e kis képernyőn.

**Commit:** feat: bejelentkezés és regisztráció Supabase auth-tal

## 2026-08-25 – 3. Design rendszer komponensek

**Mit:** Elkészült mind a hat design rendszer komponens a
`design-reference/00-teljes-canvas.html` értékeiből 1:1-ben: `PrimaryButton`
(lila/zöld gradiens variáns, pill forma, variánsonkénti árnyék, `disabled`
állapot), `TextField` (címke + fehér input kártya, 14-es radius, placeholder
szín), `ProgressBar` (8 px pill, lila és zöld variáns, 90°-os gradiens
kitöltés), `Twinkles` (animált díszpöttyök Reanimated `withRepeat`-tel,
`login` és `home` preset), `ToggleRow` (44×26-os animált kapcsoló,
címke + alcím, elválasztó vonal) és `SegmentedChoice` (egyenlő szélességű
választó, generikus `string | number` értékkel — így a gyakorlathossz
másodpercben tárolható).

Mellé két közös dolog: a `constants/shadows.ts` a `docs/design-tokens.md`
„Árnyékok" táblájából (`boxShadow` stringek, a színek a `palette.json` új
`shadow` csoportjában — D-015), és a `gradients.levelProgress` bejegyzés a
`colors.ts`-ben. Új dependency: `expo-linear-gradient` (D-014, engedéllyel).
Ellenőrzésre `app/scratch-ui.tsx` fejlesztői képernyő készült, linkkel a
kezdőképernyő placeholderéről.

**Fájlok:** components/PrimaryButton.tsx, TextField.tsx, ProgressBar.tsx,
Twinkles.tsx, ToggleRow.tsx, SegmentedChoice.tsx, constants/shadows.ts,
constants/palette.json, constants/colors.ts, app/scratch-ui.tsx,
app/(tabs)/index.tsx, package.json

**Tesztelve:** `npm run typecheck` és `npm run lint` hibátlan. Az iOS
production export (`npx expo export --platform ios --clear`) lefut, 3,76 MB
Hermes bytecode; a bundle-ben benne van mind a hat komponens szövege
(`Hangeffektek`, `Gyakorlat hossza`, `Design rendszer teszt`) és a natív
`ExpoLinearGradient` modul. **Éles iPhone-on Expo Go-val még nincs megnézve.**

**Nyitva maradt:**
- **Eszközön ellenőrizendő:** (1) a gradiensek iránya (135° a gombokon, 90° a
  progress baron); (2) a `boxShadow` stringek megjelenése — ugyanaz a kérdés,
  mint a karaktereknél; (3) a `Twinkles` pöttyök pozíciója valódi képernyőn
  (a design 402×874-es kerethez van igazítva, iPhone SE-n magasabbra
  csúszhatnak); (4) a `ToggleRow` gombjának 18 px-es útja.
- A `PrimaryButton` nem ismer „betöltés" állapotot, csak `disabled`-et. Ha az
  auth képernyőkön kell spinner, az külön kör.
- A `ProgressBar` nem animálja a kitöltést (a design `.1s linear` átmenetet
  használ a session sávon). A gyakorlat képernyő úgyis Reanimated shared
  value-ból fogja hajtani, ott dől el, kell-e külön animált variáns.
- A szülői beállítások kártyája, a matrica csempe és a session szünet gombja
  még nincs komponensben — azok a saját képernyőjük szakaszában készülnek.
- Az `app/scratch-ui.tsx` és a kezdőképernyőre tett link **fejlesztői
  segédlet, ship előtt törlendő**.

**Commitok:** `feat: PrimaryButton komponens`, `feat: TextField komponens`,
`feat: ProgressBar komponens`, `feat: Twinkles animált díszpöttyök`,
`feat: ToggleRow komponens`, `feat: SegmentedChoice komponens`,
`chore: design rendszer scratch képernyő`


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

## D-014 – `expo-linear-gradient` a gradiensekhez

**Dátum:** 2026-08-25
**Döntés:** felvettük az `expo-linear-gradient` csomagot (`npx expo install`,
SDK 54-kompatibilis verzió), engedélykéréssel.
**Miért:** a designban gradiens van az elsődleges gombokon
(`135deg,#FF9FCB,#C9A6F5` és `135deg,#8FD3E8,#6BAF9A`), mindkét progress
bar kitöltésén (`90deg`), a karakterválasztó chipeken, a matricákon és a
szintkártya ikonján — ez a design egyik hordozó eleme, nem díszítés. A
React Native `View` nem tud gradienst. A `CLAUDE.md` styling szakasza maga
nevezi meg ezt a csomagot, és a `constants/colors.ts` `gradients` objektuma
már eleve `colors` + `locations` párokban készült hozzá.
**Alternatíva:** tömör szín közelítés (a `CLAUDE.md` „ne approximálj"
szabályába ütközik, és a gombok látványosan másképp néznének ki), vagy
`react-native-svg` (nagyobb könyvtár, natív modul ugyanúgy).
**Következmény:** natív modul, de Expo Go SDK 54 tartalmazza, tehát a
fejlesztői tesztelést nem töri el. A dependency szám 1-gyel nőtt.
**Visszavonható?** Igen, de csak a gradiensek feladásával együtt.

## D-015 – Az árnyékok `constants/shadows.ts`-ben, `boxShadow` stringként

**Dátum:** 2026-08-25
**Döntés:** a `docs/design-tokens.md` „Árnyékok" táblája a
`constants/shadows.ts`-be került kész `boxShadow` stringként (pl.
`0 8px 20px rgba(199,140,220,.4)`), a rgba színek pedig a `palette.json` új
`shadow` csoportjába.
**Miért:** ugyanaz a logika, mint a karaktereknél (D-009): a `boxShadow`
string a design offset/blur/alfa értékeit 1:1-ben átveszi, míg a
`shadowRadius`-ra átszámolás közelítés lenne. Az árnyékszínek palettába
emelése pedig azért kell, hogy a `CLAUDE.md` szabálya („komponensbe hex
értéket soha ne írj") az rgba árnyékokra is teljesüljön, és egy helyen
lehessen mind a hetet átnézni.
**Alternatíva:** minden komponensben helyben megírt `boxShadow` string
(ismétlés, és a token tábla elveszne), vagy platformonkénti
`shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` + `elevation`
(közelítés, és négyszer annyi sor).
**Visszavonható?** Igen, a `shadows` objektum egy helyen cserélhető a
platform-specifikus négyesre, ha eszközön a `boxShadow` nem jönne be.

## D-016 – Az input mezőbe beírt szöveg színe `text.body`

**Dátum:** 2026-08-25
**Döntés:** a `TextField` beírt szövege `#3E3556` (`text.body`), a
placeholder marad `#C3B8DC` (`text.placeholder`).
**Miért:** a designban minden input kitöltött értéke placeholder-színű, mert
a canvas csak makett — ott nincs külön „beírt" állapot. Ez az egy érték
hiányzott a design tokenekből, ezért rá lett kérdezve, és a válasz a
`text.body` lett: ez adja a legjobb kontrasztot, és élesen elválik a
placeholdertől.
**Alternatíva:** `text.heading` (`#5B3E8C`, lilás, gyengébb kontraszt) vagy
a placeholder szín megtartása (olvashatatlan lenne).
**Visszavonható?** Igen, egyetlen osztálynév a `TextField`-ben.

## D-017 – A 44 pt-os célterület a design méreteinek megváltoztatása nélkül

**Dátum:** 2026-08-25
**Döntés:** a `ToggleRow`-ban a **teljes sor** kattintható, nem csak a 44×26-os
kapcsoló; a `SegmentedChoice` elemei a design 10 px-es paddingját tartják, és
`hitSlop`-pal (4 px fent-lent) érik el a 44 pt-ot.
**Miért:** a `CLAUDE.md` minimum 44×44 pt tap targetet ír elő, a design
viszont ennél alacsonyabb elemeket rajzol (kapcsoló 26 px, szegmens ~38 px).
A méret növelése látható eltérés lenne a designtól, amit engedélyhez köt a
`CLAUDE.md`; a nagyobb érintési terület viszont láthatatlan.
**Alternatíva:** a komponensek magasítása (design eltérés), vagy a 44 pt
szabály feladása ezeken az elemeken (a gyerek nehezebben találná el — a
beállítások ugyan szülői képernyő, de a szabály nem tesz kivételt).
**Visszavonható?** Igen, a `hitSlop` és a sor-`Pressable` külön-külön szűkíthető.

## D-018 – A `Twinkles` pöttyök pozíciója a komponensben, presetként

**Dátum:** 2026-08-25
**Döntés:** a díszpöttyök koordinátái, méretei, színei és időzítései a
`Twinkles.tsx`-ben élnek `login` / `home` preset néven; a képernyő csak
`variant`-ot ad át.
**Miért:** a két lila képernyő más-más pöttykiosztást használ (2 és 3 pötty,
eltérő pozíció és méret), ez pedig design adat, nem képernyő logika — a
`CLAUDE.md` szerint az `app/` mappa csak route és képernyő, üzleti logika és
tartalom nem. Egy szabadon átadható `dots` tömb ugyanezt a design adatot
szórná szét a képernyőkbe.
**Alternatíva:** `dots` prop (rugalmasabb, de a design értékek a képernyőkbe
kerülnének), vagy egyetlen közös kiosztás mindkét képernyőre (eltérés a
designtól).
**Visszavonható?** Igen, a preset kivezethető propba, ha később kell egy
harmadik lila képernyő saját kiosztással.

## D-019 – Az auth guard imperatív átirányítás, nem `Stack.Protected`

**Dátum:** 2026-08-25
**Döntés:** a gyökér layout (`app/_layout.tsx`) egy `useEffect`-ben nézi meg a
session-t és a `useSegments()` első elemét, és `router.replace`-szel irányít
(`/login`, illetve `/`). Amíg a tárolt session be nem töltődött (`ready`),
a layout `null`-t ad vissza, tehát nem villan fel rossz képernyő.
**Miért:** az expo-router 6 `Stack.Protected` deklaratív, de a kizárt
képernyőket egyszerűen kiveszi a navigátorból (`useSortedScreens`). Kijelentkezett
állapotban így a `(tabs)/index` — vagyis a „/" útvonal — megszűnik, és nem tudtam
eszköz nélkül biztosan megmondani, hogy a router a `(auth)/login`-ra esik-e vissza,
vagy az Unmatched képernyőre. Márpedig ez pont a leggyakoribb eset: az első indítás.
Az imperatív változatnál a „/" mindig létező route-ra fut, és onnan lép tovább.
**Alternatíva:** `Stack.Protected` guardokkal (kevesebb kód, nincs egy frame-nyi
átmenet) — eszközön kipróbálva bármikor visszaváltható. Illetve `app/index.tsx`
átirányító route: ez ütközne a `(tabs)/index.tsx`-szel, mindkettő a „/" útvonal.
**Visszavonható?** Igen, a két `useEffect` helyett két `Stack.Protected` blokk.

## D-020 – A designból hiányzó auth állapotok (üres checkbox, üzenet, töltés)

**Dátum:** 2026-08-25
**Döntés:** három érték hiányzott a designból, mindhármat rákérdezés után
rögzítettük. (1) Az üres checkbox fehér, 2 px `toggle.off` (#DDD3EE) kerettel,
bepipálva `green.500` + fehér pipa. (2) A hiba- és sikerüzenet kártya az
elsődleges gomb fölött, 14-es radiusszal: hiba `pink.150` háttér + `pink.600`
szöveg, siker `green.100` + `green.700`, Nunito 12/600. (3) Hálózati hívás
alatt a gomb felirata kap egy „…"-t és `disabled` lesz.
**Miért:** a canvas csak a kész, hibátlan állapotot rajzolja, és a palettában
nincs piros — a rózsaszín/zöld páros a meglévő tokenekből jön, tehát nem
kellett új színt kitalálni. A töltésjelzés így nem igényel új design elemet
és a `PrimaryButton` sem bővült.
**Következmény:** két új komponens, ami nincs a `CLAUDE.md` listájában:
`components/Checkbox.tsx` és `components/FormMessage.tsx`. Mindkettő önálló UI
koncepció és mindkét auth képernyőn (illetve később a szülői záron) újra
használható, ezért nem a képernyőkbe került.
**Alternatíva:** natív `Alert` a hibákra (kilóg a képernyő hangulatából),
spinner a gombban (új, designban nem szereplő elem).
**Visszavonható?** Igen, mindhárom egy-egy komponensben van.

## D-021 – A gyerek profil a megerősítés utáni első belépéskor jön létre

**Dátum:** 2026-08-25
**Döntés:** a regisztráció a gyerek nevét és életkorát AsyncStorage-ba teszi
(`doboz-legzes.pending-child`), és a `breathing_children` sor akkor jön létre,
amikor a szülő először sikeresen belép (`ensureChildProfile()` a `signIn`-ből).
A művelet best-effort: hálózati hiba esetén a függő adat megmarad a következő
próbáig, és soha nem akasztja meg a belépést.
**Miért:** a `CLAUDE.md` „egy tranzakcióban jön létre a user és a
breathing_children sor" előírását kliensből nem lehet szó szerint teljesíteni,
ráadásul a projekten **be van kapcsolva az e-mail megerősítés** (a `/auth/v1/signup`
`over_email_send_rate_limit`-tel válaszol, tehát ténylegesen levelet küld). A
`signUp` így nem ad session-t, session nélkül pedig az RLS (`parent_id = auth.uid()`)
helyesen tiltja a beszúrást. Az adat a telefonon vár — a gyerek neve amúgy is
lokálisan tárolódik majd a `useChildStore`-ban.
**Alternatíva:** (1) a nevet és az életkort `signUp` `options.data`-ba tenni és
adatbázis triggerrel létrehozni a sort — a gyerek neve bekerülne az auth
felhasználó metaadatai közé, ami a gyerekadat-elvek ellen megy; (2) az e-mail
megerősítés kikapcsolása a Dashboardon — ez a szülő címének ellenőrzését adná
fel; (3) Edge Function service role kulccsal — új mozgó alkatrész egy sorért.
**Ismert korlát:** ha a szülő új eszközön lép be először, a függő adat nincs meg,
így nem jön létre profil. A „nincs gyerek profil → irányíts a létrehozására"
ágat az 5. szakasz építi meg.
**Visszavonható?** Igen, ha az e-mail megerősítés kikapcsol: akkor a `signUp`
után rögtön van session, és a meglévő `ensureChildProfile()` azonnal lefut.

## D-022 – Az auth képernyők paddingje fix 72 / 26 / 32, csak alul enged a safe area

**Dátum:** 2026-08-25
**Döntés:** a két auth képernyő a design keretének paddingjét használja
(`72` fent, `26` oldalt, `32` lent), `SafeAreaView` nélkül. Az alsó padding
egyetlen kivétel: `Math.max(32, insets.bottom)`.
**Miért:** a canvas 402×874-es kerete a teljes iPhone képernyő, az állapotsávval
együtt — a 72 px tehát már eleve alatta van. Ha `SafeAreaView`-t tennénk alá,
a felső inset (~59 pt) hozzáadódna, és a tartalom láthatóan lejjebb csúszna a
designhoz képest. Alul viszont a 32 px a home indicator sávjába lóg (iPhone 16
Pro: 34 pt), ezért ott a nagyobb érték nyer — ez 2 px eltérés, cserébe a
„Nincs még fiókod?" sor nem kerül a csík alá.
**Alternatíva:** teljes `SafeAreaView` (látható eltérés a designtól minden
képernyőn), vagy szigorúan 32 px alul (a footer szöveg a home indicator alá
kerülne, és a designban is csak azért fér el, mert az egy makett).
**Visszavonható?** Igen, képernyőnként egy `paddingBottom` sor.

## D-023 – A szintnevek a `data/levels.ts`-ben, nyolc név után ismétlődnek

**Dátum:** 2026-08-25
**Döntés:** a designban csak a „2. szint — Felhő-ösvény" felirat szerepel, a
többi szint nevét mi adtuk hozzá: nyolc, azonos hangulatú magyar név
(`Szellő-`, `Felhő-`, `Napsugár-`, `Szivárvány-`, `Hold-`, `Csillag-`,
`Hullám-`, `Álom-ösvény`). A 8. fölött a lista utolsó neve marad. A szint
számítása: `szint = floor(befejezett / 5) + 1`.
**Miért:** a design értéke (2. szint, „3/5 gyakorlat a következő matricáig",
60%-os progress) csak akkor jön ki, ha egy szint = 5 befejezett gyakorlat,
vagyis a szintlépés és a matrica-feloldás ugyanaz az esemény. A neveket
rákérdezés után adtuk hozzá (a `CLAUDE.md` tiltja a hiányzó design értékek
kitalálását), a felhasználó választotta ezt az opciót.
**Alternatíva:** csak a szám kiírása („2. szint") — egyszerűbb, de a design
mutatja a nevet, tehát látható eltérés lenne.
**Visszavonható?** Igen, egyetlen tömb a `data/levels.ts`-ben.

## D-024 – A kezdőképernyő a lokális store-ból rajzol, a szerver csak felülír

**Dátum:** 2026-08-25
**Döntés:** a `useChildStore` (Zustand + `persist`, AsyncStorage) tárolja a
gyerek profilját (`childId`, név, életkor, karakter, befejezett gyakorlatok,
streak, utolsó gyakorlat napja). A képernyő ebből renderel azonnal, és
mountkor indít egy `syncFromServer()`-t. Az összefésülés nem felülírás:
a befejezett gyakorlatok és a streak `Math.max(lokális, szerver)`, az utolsó
dátumból a későbbi nyer, a karakter pedig csak akkor jön a szerverről, ha még
nincs lokális profil (`childId === null`).
**Miért:** offline-first (`CLAUDE.md`) — a UI nem várhat hálózatra, és a
lokálisan lezárt, még fel nem szinkronizált gyakorlatok nem tűnhetnek el egy
régebbi szerverállapot miatt. A karakterválasztás a gyerek friss szándéka,
ezért az sosem íródik vissza a szerver értékére.
**Alternatíva:** a szerver mint egyedüli igazság (offline üres képernyő,
elveszne a helyi haladás), vagy csak lokális tárolás (eszközcserénél minden
elveszne). A `zustand` nem új könyvtár-döntés: a `CLAUDE.md` tech stackje
eleve előírja.
**Visszavonható?** Igen, az összefésülés egyetlen `set()` a store-ban.

## D-025 – Nincs alsó tab bar, a kezdőképernyő a hub

**Dátum:** 2026-08-25
**Döntés:** a `(tabs)` csoport megmarad (a `CLAUDE.md` mappastruktúrája így
írja elő), de a tab bar el van rejtve (`tabBar={() => null}`). A navigáció a
kezdőképernyőről indul: a fogaskerék a szülői beállításokra, a streak chip a
matricagyűjteményre visz majd, onnan vissza gombbal.
**Miért:** a canvas mind a hat képernyője teljes magasságban rajzol, egyiken
sincs alsó sáv, és a kezdőképernyő CTA gombja pont a képernyő alján ül — egy
tab bar eltakarná vagy feljebb tolná. A designtól való eltérést a `CLAUDE.md`
engedélyhez köti; rákérdezés után a felhasználó ezt választotta.
**Alternatíva:** látható 3 fülű tab bar (kényelmesebb navigáció, de az alsó
padding és a CTA pozíciója is változna mind a három fő képernyőn).
**Visszavonható?** Igen, egyetlen sor az `app/(tabs)/_layout.tsx`-ben — a
kezdőképernyő gombjai és a tab bar meg is férnének egymás mellett.

## D-026 – A `Pressable` `style` propja soha nem lehet függvény

**Dátum:** 2026-08-25
**Döntés:** ebben a projektben a `Pressable` `style`-ja mindig statikus tömb
(`style={[styles.x, pressed && styles.pressed]}`), a lenyomott állapot pedig a
`hooks/usePressed.ts`-ből jön (`onPressIn`/`onPressOut` + lokális state). A
`style={({ pressed }) => …}` alak tiltott.
**Miért:** a NativeWind (`react-native-css-interop`) a saját JSX interopján
átvezeti minden RN komponens propjait, és a függvény alakú `style`-t elnyeli:
a komponens **egyetlen** stílusa sem érvényesül — se méret, se háttér, se
keret. Ez némán történik, nincs hiba és nincs figyelmeztetés, ezért négy
komponens hetekig hibás lehetett volna. Szimulátoron mérve: statikus
`style`-lal a 34×34-es fehér kör kirajzolódik, függvénnyel nem. Nem a React
Compiler okozza — kikapcsolva is ugyanaz (ezért maradt bekapcsolva).
**Alternatíva:** (1) `className`-es `active:` variáns — a `CLAUDE.md` a
lenyomott állapotot kifejezetten StyleSheet-hez köti; (2) `TouchableOpacity`
(beépített `activeOpacity`) — több helyen kellene komponenst cserélni, és az
RN elavultnak tekinti; (3) NativeWind verzióváltás — nagyobb kockázat egy
működő projektben.
**Visszavonható?** Igen, de csak akkor érdemes, ha a NativeWind javítja az
interopot — addig a függvény alakú `style` visszatérése azonnal láthatatlan
UI-t okoz.

## D-027 – Egyetlen lineáris ciklus-óra hajtja a légzést

**Dátum:** 2026-08-25
**Döntés:** a `useBreathingCycle` egy darab shared value-t futtat 0-tól 16-ig
egyenletesen (`withTiming` + `Easing.linear`, majd `withRepeat`), és ebből
`interpolate`-tel jön a `scale`, egy osztással pedig a fázisindex. A doboz
mérete, a radiusa és a karakter nagyítása mind ennek az egy értéknek a
származéka.
**Miért:** így fizikailag lehetetlen, hogy a doboz és a karakter elcsússzon
egymástól vagy a fázisfelirattól, és a 4-4-4-4 ütem egyetlen helyen van
leírva. A szünet is triviális: `cancelAnimation` megállítja az órát ott,
ahol épp van, a folytatás pedig a hátralévő időre indít újra.
**Alternatíva:** négy külön `withTiming` egy `withSequence`-ben, fázisonként
külön callbackkel. Fázisonként olvashatóbb lenne, de a szünet és a folytatás
kezelése („melyik fázis közepén álltunk meg?") jóval bonyolultabb, és a
fázisváltás idejét külön kellene nyilvántartani.
**Visszavonható?** Igen, a hook cseréje elég — a képernyő csak `scale`-t és
`phase`-t lát belőle.

## D-028 – A karaktert `Animated.View` skálázza, nem a `scale` propja

**Dátum:** 2026-08-25
**Döntés:** a gyakorlat képernyőn a karakter `scale={1}` propot kap, és egy
köré tett `Animated.View` végzi a nagyítást a közös shared value-ból.
**Miért:** a `CharacterProps.scale` sima `number`, azaz React state-en
keresztül frissülne — másodpercenként 60 újrarenderelés, pont az, amit a
`CLAUDE.md` tilt. Az `Animated.View` transzformja a UI szálon fut, és
ugyanazt a látványt adja (a karakter a saját középpontja körül nagyítódik).
**Alternatíva:** a `scale` prop `SharedValue`-vá alakítása mind a négy
karakterben. Az egész karakterkészletet át kellene írni, a kezdőképernyőn
viszont sima számra van szükség — két alak, két hibalehetőség.
**Visszavonható?** Igen, de nincs rá ok.

## D-029 – A gyakorlat vége egyelőre csak visszalépés

**Dátum:** 2026-08-25
**Döntés:** amikor letelik az idő, a gyakorlat lezárul, elmentődik, és a
képernyő visszalép a kezdőképernyőre. Nincs záró képernyő, nincs modal.
**Miért:** a designban nincs záró állapot, a `CLAUDE.md` szerint pedig nem
approximálunk engedély nélkül. Az ünneplő visszajelzés amúgy is a 9. szakasz
feladata (matrica feloldás), ott lesz mihez kötni.
**Alternatíva:** saját ünneplő képernyő már most. Kockázat, hogy a 9.
szakaszban kétféle záró élmény lenne, és hogy olyan szöveget találnánk ki,
ami teljesítményérzetet kelt a gyerekben.
**Visszavonható?** Igen, egyetlen `useEffect` az `app/session.tsx`-ben.

## D-030 – A lezárt gyakorlatok lokális sora és a gyerek profil léptetése

**Dátum:** 2026-08-25
**Döntés:** a `store/useSessionStore.ts` egy `pending` tömbben tárolja a
lezárt gyakorlatokat (`id`, `startedAt`, `durationSeconds`, `cyclesCompleted`,
`completed`, `characterId`), lokális id-val. A befejezett gyakorlat ugyanitt
lépteti a `useChildStore` `completedSessions` / `streakDays` értékét is.
**Miért:** a mezők a `breathing_sessions` tábla alakját követik, így a 8.
szakasz szinkronja már csak egy `insert` lesz, a lokális id pedig eleve a
duplikáció elleni védelem. A store-ból hívott store-hívás azért van, mert a
„befejeztem egy gyakorlatot" egyetlen esemény — a képernyőnek nem kell két
külön lépést helyes sorrendben meghívnia.
**Alternatíva:** (1) a képernyő hívja mindkét store-t — a második hívás
könnyen elmaradna a 8–10. szakaszban; (2) minden a child store-ban — akkor a
szinkronizálandó sor és a gyerek profilja keveredne össze.
**Visszavonható?** Igen, a `pending` sorai még nem mentek fel sehova.

## D-031 – `expo-keep-awake` a gyakorlat idejére

**Dátum:** 2026-08-25
**Döntés:** hozzáadtuk az `expo-keep-awake` csomagot, és a gyakorlat képernyő
a `useKeepAwake()` hookkal tartja ébren a kijelzőt.
**Miért:** a gyerek 2,5 percig nem nyúl a képernyőhöz, az iOS pedig alapból
elsötétítené — pont a vizuális vezetés veszne el. A feladatlista 6. szakasza
eleve ezt a csomagot nevezi meg.
**Alternatíva:** globális `activateKeepAwakeAsync` az app indulásakor —
felesleges akkumulátorhasználat az összes többi képernyőn.
**Visszavonható?** Igen, a hook egyetlen sor.

## D-032 – A kapcsolókat a fázisváltás olvassa ki, nem feliratkozás

**Dátum:** 2026-08-25
**Döntés:** a `hooks/useSessionFeedback.ts` a `soundOn` / `voiceOn` /
`hapticsOn` értékeket a fázisváltás pillanatában, `useSettingsStore.getState()`-tel
olvassa ki, nem Zustand selectorral iratkozik fel rájuk.
**Miért:** így a beállítás azonnal érvényes (a legközelebbi fázisváltás már az új
értéket látja, legfeljebb 4 mp múlva), de a kapcsolgatás önmagában nem indít el
hangot vagy mondatot.
**Alternatíva:** selector — ez viszont a kapcsolókat is beteszi a visszajelzés
effektjének függőségi listájába, így egyetlen kapcsolóállítás a fázis közepén
újra lejátszaná a hangot és újramondatná a feliratot.
**Ismert korlátozás:** a futó fázis visszajelzését egy kikapcsolás nem szakítja
félbe, csak a következőt hagyja el.
**Visszavonható?** Igen, egyetlen hookon belüli olvasás.

## D-033 – A fázishangok generált szinusz hangok, ideiglenesen

**Dátum:** 2026-08-25
**Döntés:** az `assets/sounds/` három WAV fájlja (emelkedő `inhale`, rövid
`hold`, ereszkedő `exhale`) generált, halk szinusz hang halk oktávval és lágy
be-/kicsengéssel — nem hangkönyvtárból származó felvétel.
**Miért:** a designban nincs megadva hang, letöltött asset pedig licenc- és
minőségkérdés is lenne, amit nem akartunk megkérdezés nélkül eldönteni. Így a
teljes lánc (lejátszás, néma mód, kapcsoló, időzítés) kipróbálható, a fájlok
pedig bármikor kicserélhetők ugyanezen a néven, kódmódosítás nélkül.
**Alternatíva:** hang nélkül hagyni a szakaszt — akkor a lejátszási lánc maradt
volna teszteletlen.
**Nyitva:** a végleges hangokat a gyerekkel való próba után érdemes kiválasztani.

## D-034 – Minden visszajelzési csatorna némán bukik

**Dátum:** 2026-08-25
**Döntés:** a hang, a beszéd és a haptika minden hívása elnyeli a hibát
(`try/catch`, illetve `.catch()`), és a létre nem hozható lejátszó `null`-t ad
vissza kivétel helyett.
**Miért:** CLAUDE.md ezt kifejezetten kéri a hangfájlra, de ugyanez a helyzet a
másik kettővel: a szimulátoron nincs rezgés, egy eszközön hiányozhat a magyar
TTS hang, egy hívás beleeshet egy hangmegszakításba. Az, hogy a doboz lélegzik,
fontosabb, mint hogy megszólal-e hozzá bármi — a gyereket sose állítsa meg egy
hibás visszajelzés, és ne dobjon rá piros hibaképernyőt.
**Alternatíva:** a hibák felszínre hozása naplózással — de a gyakorlat képernyőn
ennek nincs címzettje, a szülő úgyse látná.
**Visszavonható?** Igen, de csak akkor, ha van hova jelenteni a hibát.

## D-035 – iPad: arányos nagyítás modul szintű szorzóval, nem hookkal

**Dátum:** 2026-08-25
**Döntés:** a design egyetlen méretben készült (390 pt széles telefon, álló).
iPaden ezt **arányosan felnagyítjuk** egy `constants/layout.ts`-ben számolt
`uiScale` szorzóval, és minden méret az `s()` függvényen megy át (padding,
betűméret, doboz, karakter, árnyék-offset). A szorzó a képernyő **rövidebb**
oldalából jön (`shortSide / 560`, 1.0 és 1.6 közé vágva), mert fekvő módban a
rövidebb oldal a magasság — ott a legszűkebb a hely, nem a szélességnél.
A tartalom ezen felül egy `contentMaxWidth` széles, középre igazított oszlopba
kerül, hogy fekvőben ne legyen egy közel 1000 pt széles beviteli mező.
**Miért modul szintű konstans és nem `useWindowDimensions` hook:** (1) így
használható `StyleSheet.create`-ben, ami a fájlok betöltésekor fut egyszer;
(2) a `Dimensions.get('screen')` rövidebb oldala forgatáskor nem változik, tehát
a layout **nem ugrik át más méretre**, amikor a gyerek megfordítja a táblagépet;
(3) nincs újrarenderelés forgatáskor. Telefonon a szorzó pontosan 1.0, tehát a
telefonos megjelenés bitre változatlan.
**Alternatíva 1:** a gyökér `View`-ra tett `transform: [{ scale }]` — sokkal
kisebb diff lett volna, de a felskálázott réteg szövege elmosódik.
**Alternatíva 2:** telefonszélességű oszlop középen, nagyítás nélkül — nulla
design-eltérés, de iPaden minden apró marad, márpedig a gyerek pont azt nézi
messziről. Elvetve.
**Következmény:** a design px értékei sok helyen átkerültek NativeWind
`className`-ből `StyleSheet`-be, mert egy `text-[22px]` osztály nem tud
futásidőben skálázódni. Ez a CLAUDE.md styling szabályainak „runtime-ban
számított dinamikus stílusok" kivétele alá esik.
**Az `s()` szándékosan nem kerekít:** az első változat `Math.round`-ot használt,
de a designban vannak törtértékek (a napi tipp `12.5`, a fogaskerék `6.5`), és
azokat telefonon is átírta volna 13-ra, illetve 7-re. Kerekítés nélkül a
szorzó 1.0 mellett az `s()` az azonosság, tehát a telefonos megjelenés
igazolhatóan bitre változatlan. iPaden a törtpontos méret nem gond, a React
Native subpixel elrendezést használ.
**Visszavonható?** Igen: `MAX_SCALE = 1` mellett minden visszaáll a telefonos
méretre, kódváltoztatás nélkül.

## D-036 – Fekvő tájolás csak iPaden, iPhone-on marad az álló zár

**Dátum:** 2026-08-25
**Döntés:** iPaden mind a négy tájolás engedélyezett, iPhone-on marad a
`portrait` zár. Megvalósítás: az `app.json` `orientation: "portrait"` mezője az
iPhone-t zárja, az `ios.infoPlist` `UISupportedInterfaceOrientations~ipad`
kulcsa pedig iPaden mind a négy irányt felsorolja. iOS a `~ipad` változatot
részesíti előnyben táblagépen, tehát a kettő nem ütközik.
**Miért:** a gyerek fekve, fekvő módban akarja használni az iPadet — ezt kérte
a szülő. Telefon fekvő módra viszont a design nem készült: a 62–72 px-es felső
padding és a függőleges stackek 390×844-ből 844×390-be nem férnek bele, az
auth képernyők pedig előhívott billentyűzettel használhatatlanok lennének.
**Alternatíva:** `orientation: "default"`, azaz mindenhol szabad forgatás —
ehhez mind a hat képernyőnek kellene egy telefon-fekvő változat is. Ez a
munkát megduplázná olyan esetre, amit senki nem használ.
**Visszavonható?** Igen, egy sor az `app.json`-ban.

## D-037 – iPaden nincs Split View (`requireFullScreen: true`)

**Dátum:** 2026-08-25
**Döntés:** az app iPaden mindig teljes képernyős, a többfeladatos Split View és
Slide Over ki van kapcsolva.
**Miért:** két oka van. Egy: gyerekappnál nem szerencsés, ha a gyakorlat közben
félrehúzható és fél képernyőn fut — a légzőgyakorlat a teljes figyelmet kéri.
Kettő: technikai — Split View-ban az **ablak** mérete eltér a **képernyő**
méretétől, a D-035 szerinti szorzó viszont a képernyőből számol egyszer,
betöltéskor. Teljes képernyős módban a kettő garantáltan megegyezik, tehát a
nagyítás mindig helyes.
**Alternatíva:** multitasking engedése és a szorzó `useWindowDimensions`-ből
számolása. Működne, de forgatáskor és ablakméretezéskor újrarenderelne, és a
D-035-ben leírt „ne ugorjon a layout" előny elveszne.
**Mellékhatás:** az Expo alapból (multitasking mellett) magától beírja a négy
iPad tájolást; `requireFullScreen: true` esetén ezt már **nekünk kell**
megadnunk az `ios.infoPlist`-ben — ezért van ott kézzel (lásd D-036).
**Visszavonható?** Igen, de akkor a szorzót hookra kell cserélni.

## D-038 – A szinkron nem figyeli a hálózatot, három ponton fut

**Dátum:** 2026-08-25
**Döntés:** a feltöltési sort app indításkor, minden előtérbe kerüléskor
(`AppState` → `active`) és minden gyakorlat végén próbáljuk üríteni. A hálózat
állapotát **nem** figyeljük.
**Miért:** a feladatlista eredetileg „net visszatérésekor" triggert kért, ahhoz
viszont a `@react-native-community/netinfo` kellett volna. A CLAUDE.md célszáma
max 10 fő dependency, jelenleg 20-nál tartunk — egy újat csak akkor éri meg
felvenni, ha valódi különbséget hoz. Itt nem hoz: a tipikus eset az, hogy a
gyerek offline gyakorol, bezárja az appot, és később wifin nyitja ki újra — ezt
az indítás és az előtérbe kerülés lefedi.
**Alternatíva:** NetInfo felvétele. Pontosabb triggert adna arra az egy esetre,
amikor az app végig nyitva van, és közben jön vissza a kapcsolat.
**Ismert korlát:** ha az app nyitva marad, és eközben tér vissza a net, a
szinkron csak a következő előtérbe kerüléskor fut le. A gyakorlat addig is
biztonságban van a lokális sorban.
**Visszavonható?** Igen, a NetInfo utólag bármikor hozzáadható egy negyedik
triggerként, a `syncPendingSessions()` változtatása nélkül.

## D-039 – Kliensen generált uuid a session id-je, kötegelt `upsert`

**Dátum:** 2026-08-25
**Döntés:** a `recordSession` uuid v4-et generál `Math.random`-ból, és ez az id
megy fel a `breathing_sessions.id`-ba. A feltöltés egyetlen kötegelt `upsert`,
`onConflict: 'id'` és `ignoreDuplicates: true` mellett.
**Miért:** így a feltöltés **idempotens**: ha a válasz elveszik, és a sor nem
ürül, a következő próbálkozás ugyanazokkal az id-kkel megy fel, és a már meglévő
sorok kimaradnak. Nem kellett hozzá sémamódosítás (külön `client_id` oszlop),
mert a tábla `id`-je amúgy is uuid.
**Miért `Math.random` és nem `expo-crypto`:** az id csak azonosít, nem véd
semmit — kriptográfiai erősség nem szükséges, és így nem kellett új könyvtár.
**Alternatíva 1:** `client_id text unique` oszlop migrációval. Ugyanezt tudná,
de fölösleges sémamódosítás.
**Alternatíva 2:** soronkénti feltöltés. Robusztusabb lenne (egy hibás sor nem
akasztja meg a többit), de több kérés, és tipikusan 1–3 sor vár a sorban.
**Ismert korlát:** egy tartósan visszautasított sor megakasztja az egész
köteget. V1-ben ezt elfogadjuk.
**Következmény:** a store `version: 1` migrációt kapott, mert a korábbi
id-formátum nem uuid, és egyetlen ilyen sor örökre megakasztotta volna a
feltöltést.
**Visszavonható?** Igen, de a már feltöltött sorok id-jét nem lehet utólag
megváltoztatni.

## D-040 – 9 matrica: 5 a designból, 4 a mienk

**Dátum:** 2026-08-25
**Döntés:** a katalógus 9 matricát tartalmaz. Az első öt a designból van
(Szívecske, Csillagfény, Levélke, Napsugár, Vízcsepp), a másik négyet
(Felhőcske, Holdacska, Csillagpor, Lufi) mi tettük hozzá, kizárólag a meglévő
palettából — egyetlen új hex érték kellett, a csillag gradiensének kezdőszíne
(`#E4D9FF`), ami a `docs/design-tokens.md` matrica-táblájában szerepel, csak a
`palette.json`-ból hiányzott.
**Miért:** a design 9 slotot rajzol, de csak ötöt nevez meg — a maradék négy
névtelen „Zárolva" placeholder. Ha ennél maradunk, 25 befejezett gyakorlat
után a gyerek örökre négy lakattal néz szembe, és a gyűjtés elveszti az
értelmét. Kilenc matricával 45 gyakorlatig van mit gyűjteni.
**Precedens:** a szintneveket ugyanígy mi adtuk hozzá (D-023).
**Alternatíva:** maradni öt matricánál, a többi slot végleg zárolt. Design-hű,
de a feature lényegét rontja el.
**Visszavonható?** Igen, de ha egy matrica már fel volt oldva valakinél, a
kulcsa benne marad a `breathing_stickers`-ben.

## D-041 – A matrica-alakok ikonok, nem CSS-ből épített View-k

**Dátum:** 2026-08-25
**Döntés:** mind a 9 matrica alakja `@expo/vector-icons` (Ionicons) ikon.
**Miért:** a design a csillagot `clip-path: polygon(...)`-nal rajzolja, amit a
React Native **nem támogat**. A szív, levél, kör és csepp ugyan felépíthető
lenne `borderRadius` + `transform`-ból 1:1-ben, de akkor a csillag kilógna a
sorból (két egymásra forgatott háromszögből csak hatszög-szerű csillag jön ki),
és a négy új matricához (felhő, hold, szikra, lufi) is közelítés kellene. Az
ikonkészlettel minden alak éles és egységes, bármilyen méretben — ami iPaden
(D-035) külön számít.
**Miért nem új könyvtár:** az `@expo/vector-icons` már dependency, a `Checkbox`
pipája is ezt használja.
**Alternatíva:** `react-native-svg` — pontos, tetszőleges alak, de új
könyvtár, és a CLAUDE.md célszáma max 10 fő dependency.
**Ismert eltérés:** a szív és a levél formája az Ionicons változata, nem
bitre a design CSS-e. A méretek, színek és a csempe geometriája viszont
pontosan a designból jönnek.
**Visszavonható?** Igen, a `StickerTile` egyetlen komponens.

## D-042 – Navigáció a gyűjteményhez: a szintkártya, és van vissza gomb

**Dátum:** 2026-08-25
**Döntés:** a kezdőképernyő szintkártyája megnyitja a matricagyűjteményt, a
gyűjtemény tetején pedig van egy vissza gomb.
**Miért:** a design egyik képernyőjén sincs link a matricákhoz, és a
gyűjteményen nincs vissza gomb sem — a mockup képernyőnként külön létezik. Mivel
a tab sáv rejtve van (D-025), enélkül a gyűjtemény elérhetetlen lenne, oda
kerülve pedig a gyerek beragadna. A szintkártya azért jó belépő, mert a saját
szövege szól a matricákról („3/5 gyakorlat a következő matricáig”).
**Alternatíva:** a streak chip vagy egy új gomb a kezdőképernyőn — utóbbi új,
designban nem szereplő elem lenne.
**Eltérés a designtól:** a gyűjtemény címe mellé bekerült egy 34×34-es vissza
gomb, ugyanolyan, mint a gyakorlat képernyőn. A kártya megjelenése nem
változott, csak érinthető lett.
**Visszavonható?** Igen.

## D-043 – Négy kapcsoló három helyett: a rezgés is kapcsolható

**Dátum:** 2026-08-25
**Döntés:** a beállítás kártyában négy kapcsoló van — Hangeffektek, Hangos
útmutatás, **Rezgés**, Napi emlékeztető.
**Miért:** a design három kapcsolót rajzol (hang, beszéd, emlékeztető), a
CLAUDE.md viszont a „Hang, beszéd, haptika” szakaszban kimondja: „Mindhárom
külön kapcsolható a beállításokban.” A `breathing_settings.haptics_on` oszlop
is erre vár. A CLAUDE.md a mérvadó, tehát a rezgés kapott egy saját sort.
**Alternatíva:** maradni háromnál — design-hű, de a haptika kapcsolhatatlan
lenne, és az oszlop használatlan maradna.
**Eltérés a designtól:** a kártya egy sorral magasabb.
**Visszavonható?** Igen, egy `ToggleRow` törlése.

## D-044 – Az alsó gomb „Kijelentkezés”, nem „Szülői zár kezelése”

**Dátum:** 2026-08-25
**Döntés:** a design alsó gombjának helyén, ugyanabban a stílusban
(lila pill, `purple.100` háttér) a „Kijelentkezés” áll.
**Miért:** a CLAUDE.md szerint „Kijelentkezés csak a szülői zár mögül érhető
el”, de a designban nincs kijelentkezés gomb. A „Szülői zár kezelése” viszont
funkció nélkül maradna: a zár egy fix matematikai kérdés, nincs rajta mit
konfigurálni.
**Alternatíva:** megtartani mindkettőt, és a zárat ki-be kapcsolhatóvá tenni —
ez új funkció lenne, ami nincs a feladatlistán, és gyengítené is a zárat.
**Visszavonható?** Igen.

## D-045 – Az emlékeztető ideje 15 perces léptetővel, nem rendszer-időválasztóval

**Dátum:** 2026-08-25
**Döntés:** az emlékeztető kártyája a designnak megfelelően néz ki (bal oldalt
az idő, jobbra „Minden nap”), és érintésre alatta nyílik egy `− idő +` sor,
15 perces lépésekkel.
**Miért:** a design csak a nyugalmi állapotot rajzolja, időválasztót nem. Egy
rendszer-időválasztóhoz a `@react-native-community/datetimepicker` kellene,
ami újabb dependency (a CLAUDE.md célszáma max 10 fő; jelenleg 21-nél tartunk).
Egy naponta egyszeri emlékeztetőhöz a negyedórás pontosság bőven elég.
**Alternatíva 1:** `datetimepicker` — pontosabb, natív érzet, +1 könyvtár.
**Alternatíva 2:** néhány előre megadott időpont szegmens választóban —
kevesebb szabadság, és nem fér ki szépen.
**Eltérés a designtól:** csak nyitott állapotban, a kártya nyugalmi képe
változatlan.
**Visszavonható?** Igen.

## D-046 – A szerver beállításai csak app indításkor írják felül a lokálisat

**Dátum:** 2026-08-25
**Döntés:** a `pullSettings()` egyszer fut, app indításkor, és **csak akkor**
ír, ha tényleg van szerver oldali sor. A beállítás képernyőn minden
változtatás azonnal felmegy (`pushSettings()`), de vissza már nem olvasunk.
**Miért:** offline-first. Ha minden szinkronkor visszaolvasnánk, egy offline
indítás vagy egy lassú válasz visszaállíthatná a szülő imént megváltoztatott
beállítását. Egy eszközzel (v1) a lokális állapot a megbízhatóbb.
**Alternatíva:** kétirányú szinkron időbélyeggel (`updated_at`) — pontosabb
több eszköznél, de v1-ben egy gyerek egy eszközön gyakorol.
**Ismert korlát:** ha a szülő két eszközön állít be különbözőt, az utoljára
indított eszköz állapota nyer.
**Visszavonható?** Igen.

## D-047 – Értesítési engedélyt csak a szülői zár mögül kérünk

**Dátum:** 2026-08-25
**Döntés:** app indításkor a napi emlékeztetőt csak akkor ütemezzük be, ha az
értesítési engedély **már megvan**; engedélyt kérni kizárólag a beállítás
képernyőről szabad (`scheduleDailyReminder(..., { prompt: true })`).
**Miért:** az első változatban az indításkori újraütemezés felhozta a rendszer
engedélykérő ablakát a **kezdőképernyőn, a gyerek előtt** — ezt szimulátoron
láttuk meg. Egy 7–9 éves gyereknek nem kell rendszerpárbeszéddel szembesülnie,
és a döntés amúgy is a szülőé.
**Alternatíva:** engedélyt kérni az első gyakorlat után — még mindig a gyerek
képernyőjén jönne fel.
**Következmény:** ha a szülő sosem nyitja meg a beállításokat, az emlékeztető
alapból be van kapcsolva a store-ban, de értesítés nem megy ki, mert nincs
engedély. Ez tudatos: inkább néma, mint tolakodó.
**Visszavonható?** Igen, egy paraméter.

## D-048 – A visszajelzési csatornák `__DEV__`-ben naplóznak, és a hangok előre töltődnek

**Dátum:** 2026-08-25
**Döntés:** a hang, a beszéd és a rezgés élesben továbbra is **némán bukik**
(D-034), de `__DEV__`-ben a `lib/devWarn.ts`-en keresztül a konzolra ír, és a
gyakorlat indulásakor lefut egy önteszt (`lib/feedbackDiagnostics.ts`). Ezen
kívül az audio session megvárható lett, és a három lejátszó a gyakorlat
indulásakor, előre jön létre — nem a fázisváltás pillanatában.
**Miért:** egy fizikai iPhone-on Expo Go alatt se hang, se rezgés nem volt,
miközben a szimulátorban szólt — és a D-034-es néma bukás miatt **semmilyen
nyom nem maradt** arról, melyik csatorna hol állt meg. A néma bukás a gyerek
szempontjából továbbra is helyes, a fejlesztés szempontjából viszont vakká tesz.
Az előtöltés önmagában is valódi javítás: Expo Go-ban a WAV a dev szerverről
tölt hálózaton át, és a fázisváltás pillanatában létrehozott lejátszó
lemaradhat a saját négymásodperces ablakáról — pont az a különbség, ami
localhoston (szimulátor) sosem jelentkezik.
**Alternatíva:** a hibákat élesben is felszínre hozni — ezt a D-034 elveti, és
jó okkal: a gyakorlat képernyőn a hibaüzenetnek nincs címzettje.
**Visszavonható?** Igen. A diagnosztika ideiglenes, a gyökérok megerősítése
után törölhető; a `devWarn` és az előtöltés viszont maradjon.

## D-049 – Az app néma módban is szól

**Dátum:** 2026-08-26
**Döntés:** az audio session `playsInSilentMode: true` (iOS `.playback`
kategória), tehát a hangeffekt **és** a magyar beszéd a néma kapcsoló ellenére
is hallható. Ez tudatos eltérés a CLAUDE.md eredeti szabályától („néma módban a
hang ne szóljon"), a `CLAUDE.md` szövege át is lett írva.
**Miért:** a szabályt eredetileg úgy fogalmaztuk meg, mintha játékhangokról
lenne szó. A gyakorlatban viszont az derült ki, hogy néma módban a gyerek a
**vezető magyar hangot** is elveszíti, magyarázat nélkül — az `expo-speech`
ugyanazt a megosztott iOS audio session-t használja, mint a hangeffektek. Egy
logopédus által kiadott, hanggal vezetett légzőgyakorlatnál ez nem apró
kényelmetlenség: a szülő nem tudja, miért néma az app, a gyerek meg csak annyit
tapasztal, hogy nem szól hozzá senki.
**Alternatíva 1:** maradni a néma működésnél, és a szülőre bízni, hogy csengő
módba tegye a telefont — elvetve, mert semmi nem jelzi neki, hogy ez a baj.
**Alternatíva 2:** csak a beszéd szóljon néma módban, a hangeffekt ne — **nem
megvalósítható** tisztán: a két csatorna ugyanazon az audio session-ön osztozik,
a néma kapcsoló állását pedig Expo Go-ban JS-ből nem lehet lekérdezni.
**Következmény:** ha a szülő azért némította le a telefont, mert csendet akar,
az app ettől még megszólal. Ezt a beállításokban tudja kezelni: a „Hangeffektek"
és a „Hangos útmutatás" kapcsoló külön-külön kikapcsolható.
**Visszavonható?** Igen, egyetlen mező a `lib/sounds.ts`-ben.

## D-050 – A gyerek neve lokálisan is tárolódik, és van profil létrehozó képernyő

**Dátum:** 2026-08-26
**Döntés:** (1) a regisztrációkor megadott név és életkor **azonnal** a
`useChildStore`-ba kerül, nem csak a `pending-child` AsyncStorage kulcsba; (2) a
`fetchChildProfile()` háromállapotú eredményt ad (`ok` / `missing` / `unknown`);
(3) ha a szerver megerősíti, hogy nincs gyerek profil **és** lokálisan sincs név,
a kezdőképernyő az új `app/child-profile.tsx`-re irányít.
**Miért:** a D-021 a nevet a szerver oldali sor létrejöttéig a telefonon tartotta,
de sosem tette be a store-ba — így a kezdőképernyő üdvözlése a hálózatra várt egy
adatra, amit a szülő az előbb gépelt be. Ez az offline-first elv megsértése volt
(„a UI soha ne várjon hálózatra"). A D-021 maga is rögzítette a másik ágat ismert
korlátként: „ha a szülő új eszközön lép be először, a függő adat nincs meg, így
nem jön létre profil" — ez most nem elméleti eset, hanem a valóság: a
`breathing_children` üres, mert a szülő egy meglévő fiókkal lépett be.
A háromállapotú eredmény azért kell, mert a „nincs sor" és a „nincs net" eddig
ugyanúgy `null` volt, és offline soha nem szabad profil képernyőre dobni a szülőt.
**Alternatíva 1:** a nevet a szülői beállításokban kérni be — a szülői zár mögött
van, és a gyerek addig névtelen üdvözlést lát, ráadásul semmi nem jelzi, hol
javíthatja.
**Alternatíva 2:** a nevet a `signUp` `options.data`-jába tenni és triggerrel
létrehozni a sort — a D-021 ezt már elvetette, mert a gyerek neve bekerülne az
auth felhasználó metaadatai közé, ami a gyerekadat-elvek ellen megy.
**Eltérés a designtól:** a `child-profile` a **7. képernyő**, a canvas nem
rajzolja meg. Ezért nem is talál ki új design értéket: a regisztráció keretét
(zöld gradiens, 72/26/32 padding), mezőit és gombját használja újra, két mezőre
szűkítve. A CLAUDE.md viszont kifejezetten előírja („Bejelentkezés után, ha nincs
gyerek profil, irányíts a profil létrehozására"), és a munkanapló kétszer is
nyitott tételként tartotta számon.
**Mellékesen javítva:** a `signOut()` mostantól üríti a `useChildStore`-t (a
store kommentje szerint is ez lett volna a dolga), és a függő gyerek profil app
indításkor is újra próbálkozik, nem csak be- vagy kijelentkezéskor.
**Ismert korlát:** a profil képernyőről nincs kiút — profil nélkül nincs mit
mutatni, de rossz fiókba belépve a szülő csak az app törlésével tud kiszállni.
**Visszavonható?** Igen. A képernyő és az irányítás egy-egy blokk; a `setChild`
hívások viszont maradjanak, azok önmagukban is helyes javítások.

## D-051 – Az iOS ikon teli négyzet, a lekerekítést a rendszer adja

**Dátum:** 2026-08-26
**Döntés:** a megadott `app-icon.svg` háttere `rx="224"`-gyel lekerekített, az
ebből készült `icon.png`-ben viszont a háttér **teljes, lekerekítés nélküli
négyzet**. A többi elem (gradiens, fénykör, doboz keret, pöttyök) pixelre
ugyanaz.
**Miért:** az iOS a saját squircle maszkját teszi az ikonra. Ha a PNG sarka
átlátszó, az iOS azt **feketére** tölti, és mivel a squircle a sarkoknál kicsit
kijjebb ér, mint egy sima lekerekített téglalap, egy vékony fekete sarok-sáv
látszana. Az App Store ráadásul alfa csatornás ikont nem is fogad el. Teli
négyzettel a végeredmény pont az, amit az SVG szánt — a lekerekítést a rendszer
rajzolja, a saját pontos formájával.
**Alternatíva:** az SVG-t változatlanul raszterizálni és a sarkokat egy
háttérszínre lapítani — nem működik, mert a gradiens miatt minden saroknak más
színe van, tehát nincs egyetlen jó tartalék szín.
**Eltérés a megadott forrástól:** csak a háttér `rx` értéke, és csak az
`icon.png`-ben. A `favicon.png` megtartja a lekerekítést, mert a böngésző nem
maszkol.
**Raszterizálás:** headless Chrome (`--headless --screenshot
--window-size=1024,1024`), mert a gépen az ImageMagick librsvg nélkül fordult,
és a belső MSVG renderere a `userSpaceOnUse` gradienseket rosszul adja vissza.
Ez fejlesztői eszköz, nem dependency — a repóba csak a kész PNG-k kerülnek, a
forrás SVG mellé.
**Visszavonható?** Igen, az SVG a repóban marad, bármikor újrarajzolható.

<!-- ÚJ DÖNTÉSEK IDE, ALULRA, NÖVEKVŐ SORSZÁMMAL -->
