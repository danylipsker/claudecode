# Sokoban

Push every crate onto a glowing pad. One page, [sokoban.html](sokoban.html), with no build step:
open it from disk, from the repository's apps page, or from GitHub Pages.

## The level library

**Levels** (key `L`) opens the library. Every collection is in it:

| Collection | Levels | Where the levels come from |
|---|---:|---|
| Classic | 16 | written into the page, each with a verified par |
| Microban | 155 | inside the page, from [niveles.txt](niveles.txt) |
| Boxoban Hard | 3,332 | inside the page, packed |
| Boxoban Medium | 500,000 | downloaded a set of 1,000 at a time |
| Boxoban Unfiltered | 1,001,000 | downloaded a set of 1,000 at a time |

The first three play with no connection at all. The two large Boxoban collections are far too big
to ship (171 MB as text), so each set of 1,000 is fetched the first time it is opened, from the
public [DeepMind repository](https://github.com/google-deepmind/boxoban-levels) (jsDelivr as a
fallback), and then kept on the device in IndexedDB, so it opens at once and offline afterwards.
On a local development server the game reads the dataset from `boxoban-levels-master/` instead.

In the library: the chips switch collection, the slider and ◀ ▶ step through the sets of a large
one, **Go** jumps to a level number, and **Random** picks a level not yet solved. **Open File…**
(key `O`) still plays any Sokoban text file and adds it as one more collection.

The address names the level (`sokoban.html#hard/1234`), so a bookmark or a shared link returns to
it. Each collection keeps its own solved marks and where it was left.

## Phones and offline

Served over http(s) (GitHub Pages, or `node scripts/serve.js` from the repository root), the page
registers [sw.js](sw.js), which keeps the page for offline use, and [pwa.json](pwa.json), which
lets a phone add it to the home screen as an app. Add `?nosw` to the address to skip the service
worker while developing.

## Tools

- `node tools/embed-levels.js` writes Microban and Boxoban Hard into `sokoban.html`. Rerun it after
  changing `niveles.txt`. It needs the dataset unzipped at `boxoban-levels-master/` (gitignored).
  Boxoban levels are stored 22 bytes each: the 64 inner cells of the walled 10 × 10 board, three to
  a byte in base 5. `unpackLevels()` in the page is the other half.
- `node tools/make-icons.js` draws the PNG app icons from the same shapes as [icon.svg](icon.svg).

## Credits

Microban by David W. Skinner. Boxoban levels by DeepMind (Guez, Mirza, Gregor, Kabra et al., 2018),
Apache License 2.0.
