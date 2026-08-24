/**
 * Napi tippek. Hét tipp, a hét napja szerint váltakozik — így minden nap
 * ugyanaz a mondat fogadja a gyereket, de a héten belül változik.
 *
 * Szabály (CLAUDE.md – „Kire tervezünk”): rövid, tegező, bátorító mondat,
 * ami a légzésről és a játékról szól. Beszédre, dadogásra vagy
 * teljesítményre egyik tipp sem utalhat.
 */

/** A tömb indexe = `Date.getDay()`, tehát a 0. elem a vasárnapi tipp. */
const tips: readonly string[] = [
  'lefekvés előtt is jólesik egy kör 🌙',
  'fújd el a lufit lassan, mint a szél 🎈',
  'ülj kényelmesen, a vállad legyen laza 🧸',
  'tedd a tenyered a hasadra, és érezd, ahogy emelkedik 🤲',
  'csukd be a szemed, ha úgy kényelmesebb 😌',
  'számolj magadban a dobozzal együtt 🔢',
  'hívd a kedvenc plüssödet is a gyakorláshoz 🐻',
] as const;

/** A mai naphoz tartozó tipp szövege (a „Mai tipp:” előtag nélkül). */
export function tipOfTheDay(date: Date = new Date()): string {
  return tips[date.getDay()];
}
