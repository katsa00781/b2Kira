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
- [ ] Lint + typecheck script bekötése (`npm run lint`, `npm run typecheck`)
- [x] `CLAUDE.md`, `docs/`, `design-reference/`, `supabase/` bemásolása a projekt gyökerébe
- [ ] Push GitHubra (privát repó)

## 1. Supabase alapok

- [ ] `0001_breathing_schema.sql` átolvasása, majd futtatása a familyBudget projekten
- [ ] SQL editorban ellenőrizni: a 4 tábla létrejött, RLS mindegyiken bekapcsolva
- [ ] `lib/supabase.ts` – kliens AsyncStorage session perzisztenciával
- [ ] Típusgenerálás: `supabase gen types typescript --project-id eguhipjgnhbajbmnrskm > types/supabase.ts`
- [ ] Kézi próba: egy teszt user regisztrálása, `breathing_children` sor beszúrása, majd
      ellenőrizni, hogy **másik** userrel nem látszik

## 2. Karakterek

- [ ] `components/characters/Bunny.tsx` a `design-reference/Bunny.html` geometriája alapján
- [ ] Panda, Monkey, Lion ugyanígy
- [ ] `mood: 'happy' | 'breathing'` és `scale: number` prop mindegyiken
- [ ] `data/characters.ts` – id, magyar név, chip gradiens színek
- [ ] Ellenőrzés: egy scratch képernyőn mind a 4 karakter megjelenik, `scale` csúszkával

> Ez a legkényesebb rész. Egyesével csináld, karakterenként külön prompt, külön commit.

## 3. Design rendszer komponensek

- [ ] `PrimaryButton` (lila + zöld variáns, gradiens, árnyék)
- [ ] `TextField` (címke + input, placeholder szín, árnyék)
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

## ÉÉÉÉ-HH-NN – (első bejegyzés helye)

Még nincs bejegyzés. Az első a 0. Setup szakasz lezárása után kerül ide.

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

<!-- ÚJ DÖNTÉSEK IDE, ALULRA, NÖVEKVŐ SORSZÁMMAL -->

