# Doboz Légzés – Design tokenek

Minden érték a csatolt design canvasból van kiolvasva. **Ne találj ki új értéket** — ha
valami hiányzik, kérdezz rá, ne közelíts.

---

## Színpaletta

### Lila (elsődleges brand)

| Token | Hex | Használat |
|---|---|---|
| `purple.900` | `#5B3E8C` | Fő címsorok, kártyák címe |
| `purple.700` | `#6A44B0` | Csillag matrica ikon |
| `purple.600` | `#8B5FD9` | Aktív állapot, linkek, kapcsoló ON, kiválasztott chip |
| `purple.400` | `#C9A6F5` | Gradiens vég, ikon háttér |
| `purple.150` | `#EEE3FB` | Progress bar sáv háttere |
| `purple.100` | `#EFE6FE` | Másodlagos gomb háttér, gradiens alja |
| `purple.75` | `#F1ECFA` | Sor elválasztó vonal |
| `purple.50` | `#F3EEFA` | Canvas háttér, gradiens alja |
| `lock.bg` | `#EDE7F6` | Zárolt matrica háttér |
| `lock.shape` | `#C9BEDD` | Zárolt matrica lakat (opacity .6) |
| `lock.text` | `#B7AACB` | Zárolt matrica felirat |
| `toggle.off` | `#DDD3EE` | Kapcsoló OFF sín |

### Szöveg

| Token | Hex | Használat |
|---|---|---|
| `text.heading` | `#5B3E8C` | H1/H2, Baloo 2 |
| `text.body` | `#3E3556` | Beállítás sor címke |
| `text.label` | `#7A6C99` | Input címke |
| `text.muted` | `#8B7AA8` | Szekció felirat, ikon stroke |
| `text.subtle` | `#9A8CB8` | Alcím, segédszöveg |
| `text.placeholder` | `#C3B8DC` | Input placeholder |

### Rózsaszín (energia / belégzés-tartás)

`#FF9FCB` · `#FFAFD1` · `#FFD3E8` · `#FF8FA3` · `#FFD9E8` · `#FFB6D9` · `#C6497D` (szív ikon) · `#F3D8EE` (nyuszi körvonal)

### Zöld / türkiz (nyugalom, gyakorlat képernyő)

| Token | Hex | Használat |
|---|---|---|
| `green.700` | `#3E7C68` | Fázis felirat, aktív pötty |
| `green.600` | `#3E8C6C` | Levél matrica |
| `green.500` | `#6BAF9A` | Regisztráció gomb, timer szöveg |
| `green.400` | `#5FC7A6` | Jelvény gradiens |
| `green.300` | `#94E3C9` | Kilégzés doboz, csillag pötty |
| `green.100` | `#D3F5E8` | Matrica háttér |
| `green.50` | `#DCEFE8` | Statikus doboz keret, inaktív pötty |
| `green.bg` | `#EAF7F2` | Gradiens teteje |

### Kék

`#8FD3E8` (2. tartás fázis) · `#CFF0FF` · `#2E7FA0` (vízcsepp) · `#EDF4FB` (gradiens közép)

### Sárga / narancs

`#FFD97A` (csillogó pötty) · `#FFB347` (belégzés doboz, streak) · `#FFE9BF` · `#B9832A` (nap matrica) · `#FBD98C` / `#E8A33D` (oroszlán)

---

## Képernyő-hátterek

| Képernyő | Háttér |
|---|---|
| Bejelentkezés, Kezdőképernyő | `linear-gradient(180deg,#FBF2FF 0%,#F3E9FF 45%,#EFE6FE 100%)` |
| Regisztráció, Légzőgyakorlat | `linear-gradient(180deg,#EAF7F2 0%,#EDF4FB 60%,#F3EEFA 100%)` |
| Matricák | `#FBF6FF` (tömör) |
| Szülői beállítások | `#F7F5FC` (tömör) |

---

## Tipográfia

Két betűtípus, Google Fontsról (`@expo-google-fonts/baloo-2`, `@expo-google-fonts/nunito`).

**Baloo 2** – címsorok, gombok, számok:

| Szerep | Méret | Súly |
|---|---|---|
| Képernyő cím | 22–24 | 800 |
| Kezdőképernyő üdvözlés | 20 | 700 |
| Fázis felirat (Lélegezz be) | 22 | 800, letter-spacing .5 |
| Elsődleges gomb | 17 | 800 |
| Másodlagos gomb | 14–15 | 800 |
| Kártya cím | 13–15 | 800 |

**Nunito** – minden más:

| Szerep | Méret | Súly |
|---|---|---|
| Input mező szöveg | 14 | 600 |
| Input címke | 12 | 700 |
| Beállítás sor címke | 14 | 700 |
| Alcím / segédszöveg | 12–13 | 600 |
| Matrica felirat | 11 | 700 |
| Timer / szekció felirat | 13 | 700 |

---

## Spacing és forma

- Képernyő padding: `62px 22px 28px` (fő képernyők), `72px 26px 32px` (auth képernyők)
- Elem-köz (`gap`): 6 · 8 · 10 · 12 · 14 · 18 · 22 · 24 · 26 · 32
- Radius: `999` pill (gombok, chipek, progress), `20` kártya/matrica, `18` beállítás kártya, `14` input, `12` chip, `50%` avatar
- Matrica rács: 3 oszlop, `gap: 14`, `aspect-ratio: 1`

### Árnyékok

```
input / kis kártya   0 3px 10px rgba(180,150,220,.15)
kártya               0 4px 14px rgba(180,150,220,.20)
chip / avatar        0 2px  8px rgba(180,150,220,.25)
elsődleges gomb      0 8px 20px rgba(199,140,220,.40)
zöld gomb            0 8px 20px rgba(120,180,160,.35)
matrica              0 4px 10px rgba(0,0,0,.08)
karakter             0 6px 14px rgba(200,160,210,.30)
```

React Nativeben ezeket platformonként kell megadni (iOS `shadowColor/Offset/Opacity/Radius`,
Android `elevation`), NativeWind `className`-mel **ne**.

---

## A légzőgyakorlat animáció – pontos specifikáció

Ez a design szíve, ezt kell 1:1-ben visszaadni.

```
Fázisok (mind 4 másodperc):
  0  "Lélegezz be"   scale: 0.55 → 1.00   szín: #FFB347
  1  "Tartsd"        scale: 1.00          szín: #FF8FA3
  2  "Lélegezz ki"   scale: 1.00 → 0.55   szín: #94E3C9
  3  "Tartsd"        scale: 0.55          szín: #8FD3E8

Egy teljes ciklus: 16 mp.
```

- Külső **statikus** keret: `220 × 220`, `borderRadius: 36`, `border: 6px solid #DCEFE8`
- Belső **animált** doboz: `méret = 100 + scale * 100` → **155 px … 200 px**
- A doboz radiusa együtt mozog: `borderRadius = méret * 0.22`
- Doboz háttér: `linear-gradient(135deg, {szín}CC, {szín})`
- Doboz árnyék: `0 8px 24px {szín}55`
- A karakter a doboz **fölött** (`zIndex: 2`), `scale` propot ugyanazt kapja
- Alul 4 fázispötty: `10 × 10`, aktív `#3E7C68`, inaktív `#DCEFE8`, `.3s` átmenet

**Fejlesztési megjegyzés:** a designban 100 ms-os `setInterval` hajtja az animációt.
React Nativeben ezt **ne** másold — `react-native-reanimated` `withTiming` /
`withSequence` kell, hogy a JS szál akadása ne rontsa el a légzés ritmusát.

### Session

- Alapértelmezett hossz: **150 mp** (kb. 9 ciklus)
- Hátralévő idő formátum: `m:ss`
- Session progress bar: `height: 8`, háttér `#DCEFE8`, kitöltés `linear-gradient(90deg,#94E3C9,#6BAF9A)`
- Szünet gomb: `Szünet` / `Folytatás`, háttér vált `#8FD3E8→#6BAF9A` ↔ `#94E3C9→#6BAF9A`

---

## Karakterek

Négy karakter: **Bunny, Panda, Monkey, Lion**. A designban mindegyik **tiszta CSS-ből**
épül (kör, ellipszis, forgatott téglalapok) — **nincs kép asset**. React Nativeben
ugyanígy `<View>` elemekből kell felépíteni őket, `borderRadius` és `transform` értékekkel.
A pontos geometriát lásd: `design-reference/Bunny.html` stb.

Mindegyik két propot kap:

```ts
type CharacterProps = {
  mood: 'happy' | 'breathing';
  scale: number; // 0.5 – 1.5
};
```

Alap méret: `90 × 90` px doboz, a `scale` transzformmal skálázva.

Választó chip színek a kezdőképernyőn (36×36 kör, aktív keret `3px #8B5FD9`):

| Karakter | Gradiens |
|---|---|
| bunny | `135deg, #FFD3E8, #FFAFD1` |
| panda | `135deg, #F2F2F2, #3A3A3A` |
| monkey | `135deg, #F3DCB8, #B98559` |
| lion | `135deg, #FBD98C, #E8A33D` |

---

## Matricák

9 slot, ebből a designban 5 feloldott, 4 zárolt.

| Név | Alak | Háttér gradiens | Ikon szín |
|---|---|---|---|
| Szívecske | szív | `#FFD9E8 → #FFB6D9` | `#C6497D` |
| Csillagfény | csillag | `#E4D9FF → #C9A6F5` | `#6A44B0` |
| Levélke | levél | `#D3F5E8 → #94E3C9` | `#3E8C6C` |
| Napsugár | kör | `#FFE9BF → #FFD97A` | `#B9832A` |
| Vízcsepp | csepp | `#CFF0FF → #8FD3E8` | `#2E7FA0` |
| Zárolva ×4 | lakat | `#EDE7F6` tömör | `#C9BEDD` @ .6 |

---

## Animált díszek

A lila képernyőkön abszolút pozicionált „csillogó" pöttyök, `twinkle` animációval:

```
#FFD97A  12–14 px   2.4s ease-in-out infinite
#94E3C9   9–10 px   3.0s ease-in-out infinite  .5s delay
#FFAFD1      8 px   2.0s ease-in-out infinite  1s delay
```
