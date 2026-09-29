# Hyper Driving — תאוריה, תמרורים והכרת הרכב

A driving-theory study app: traffic law, road signs, good driving practice and
technical knowledge of the vehicle (cars, motorcycles, trucks, buses — how the
key components work, maintenance, troubleshooting, handling faults on the
road), with practice questions and mock exams. Hebrew first, English next,
any language later. Built to become an Android and iOS app, and to let a
transport authority change the law in it without an app release.

Open `index.html` through any web server (`node ../scripts/serve.js . 8173`
from this folder, then http://localhost:8173). Plain HTML/CSS/JS, no build step.

## What is in it

| Screen | |
|---|---|
| Learn | 17 theory chapters (road, licensing, signs, markings and lights, right of way, speed, lanes and overtaking, parking, special roads, vulnerable users, weather, the driver, passengers, defensive driving, accidents, enforcement, eco-driving) |
| Signs | the whole official sign table (series 100–900 and the symbol appendix) with the pictures of the Ministry's sign chart, traced to vectors; search, sign pages, recognition drill |
| Vehicle | 16 technical chapters, dashboard warning lights, troubleshooting decision trees, a maintenance schedule, interactive tools (4-stroke and diesel engine, stopping distance, speed and energy, blind spots, tyre code, traffic-light cycle, following distance) |
| Practice | mock exam (size, time and pass mark come from the law's facts), practice by topic, spaced repetition (Leitner), mistakes, sign and warning-light drills, Hebrew↔English term flashcards |
| Glossary | ~600 terms: the official Hebrew term, the English term, the jargon of instructors and mechanics, definitions in both languages; terms that have no Hebrew word yet are flagged |
| Updates | content version, update check, "what changed", upcoming law changes, notices from the authority |
| Settings | language, licence class (B, A2/A1/A, C1/C/C+E, D1–D, tractor), theme, text size, English terms beside Hebrew ones, niqqud |

Every lesson and question is tagged by licence class where it matters, so a
B learner and a bus driver each see their own material.

## Architecture

```
index.html, sw.js, pwa.json, icon.svg      the app shell, offline service worker, install manifest
css/drive.css                              one stylesheet; logical properties → RTL and LTR from the same rules
js/config.js        build settings: languages, jurisdictions, update URLs, trusted signing keys
js/core.js          helpers, storage (localStorage / IndexedDB), events, router, settings, formatting
js/i18n.js          interface strings (he, en); a pack may override any
js/content.js       loads a pack (bundled / downloaded / editor draft), indexes it, facts with dated changes, search
js/markup.js        the lesson text language (AUTHORING.md §3)
js/glyphs.js, signs.js, dash.js    pictograms, the sign renderer, the warning-light renderer
js/widgets.js       interactive diagrams
js/quiz.js          question pools, exams, drills, Leitner progress
js/update.js        signed content updates
js/check.js         content rules shared by the editor and tools/validate.js
js/views.js, editor.js, app.js     screens, the authority's content editor, start-up
content/il/         the Israeli content pack (see below)
tools/              publish (manifest, signing), keygen, validate, sheet (render signs to PNG), merge-drafts
```

### The content pack — everything that can change is data

`content/il/manifest.json` lists the pack's files with a SHA-256 of each
(canonical JSON) and, for a published update, the authority's signature.

| File | Holds |
|---|---|
| `facts.json` | every legal number — speeds, ages, alcohol limits, distances, exam rules — and every offence's fine and points, each with its source (regulation, URL), confidence and optional dated changes `"changes": [{"from": "2027-01-01", "value": 40}]` |
| `signs.json` | the sign table: number, series, names, meanings, and a **drawing** (shape, colours, pictogram items, glyphs) for a sign without a picture |
| `sign-art.json` | the signs' **pictures**, by sign number: the Ministry's sign chart (2021) traced to vector outlines (`DRIVING-SIGNS/`, imported by `tools/import-sign-art.js`); 391 of the 401 signs have one |
| `dash.json` | dashboard lights: colour, glyph, severity, names, meaning, action |
| `glossary.json` | bilingual terms |
| `course.json`, `licences.json`, `exam.json` | chapter order and sections; licence classes and groups; exam weights |
| `figures.json` | diagrams: raw SVG with translatable labels, or a built-in widget with parameters |
| `maintenance.json`, `notices.json`, `changelog.json` | schedule, authority announcements, release notes |
| `he/lessons/<chapter>.json`, `he/questions/…`, `he/trees/…` | the Hebrew text; `en/…` the English, same ids |

Text never contains a legal number: lessons write `{{fact:speed.urban}}` and
questions `{{fine:phone-handheld}}`. Changing one value in `facts.json`
changes every lesson, question, widget and exam rule that uses it, in every
language, and a change can be published ahead of the date it takes effect —
the app switches on that date and marks the value as "about to change".

### How a law change reaches learners

1. Authority staff turn on **editor mode** (Settings) and open the **content
   editor**: legal values, fines and points (with scheduled changes and a
   list of every lesson/question that uses each value), notices, lessons and
   questions side by side in each language with a live preview, signs with
   their pictures (replace one from an SVG file) and drawing. Edits are a local draft shown in the app at once.
2. **Check** (every reference, question, tree and translation) → **Export
   update file**.
3. Test: Updates → "Load an update file" (editor mode accepts unsigned files).
4. Sign and publish: `node tools/publish.js --bundle update-….json --key keys/il.private.jwk --out <web folder>`.
   `tools/keygen.js` makes the key pair once; the public key goes into
   `js/config.js` (`trustedKeys`), the private key never leaves the authority.
5. Set `updateUrl` in `js/config.js` to the published `manifest.json`. Apps
   check on start (every `checkEveryHours`), download only changed files,
   verify every hash and the ECDSA P-256 signature, store the pack in
   IndexedDB, and show learners what changed.

A tampered or unsigned pack is refused; a pack for a newer content format
asks for an app update; "Go back to the built-in content" is always there.

Another country = another folder `content/<code>/` and an entry in
`config.js`; another language = `<lang>/…` files and an `i18n.js` block.

## Checking content

```
node tools/validate.js              errors + warning summary (includes writers' draft files)
node tools/validate.js --release    exactly what ships; the manifest must match the disk
node tools/publish.js               rebuild content/il/manifest.json after editing files
node tools/sheet.js signs --series 100 --out _sheets/s100.png     look at signs (--drawn: their drawings)
node tools/import-sign-art.js       DRIVING-SIGNS/*.svg → content/il/sign-art.json (then publish.js)
node tools/merge-drafts.js --apply  fold writers' drafts into the shared files
```

Writers: read `AUTHORING.md`. The course plan is `content/il/_plan.md`;
drawing signs: `content/il/_work/README.md`.

## To Android and iOS

The app is a self-contained web app (this folder, no external requests), so
it wraps as is with [Capacitor](https://capacitorjs.com):

```
npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Hyper Driving" il.gov.mot.hyperdriving --web-dir .
npx cap add android && npx cap add ios        # iOS needs a Mac with Xcode
npx cap sync && npx cap open android
```

(Better: copy the app files into a `www/` folder at build time and point
`--web-dir` there, so tools and content drafts are not shipped.) Inside the
native shell the service worker is not needed — files are local; content
updates work the same way (fetch + IndexedDB). The layout is mobile-first
(bottom tab bar, safe-area insets, 44 px touch targets) and follows the
system's light/dark theme. Store icons are generated from `icon.svg`.

## Sources and status

Legal values come from the current texts of פקודת התעבורה, תקנות התעבורה,
צו התעבורה (עבירות קנס) and the combined sign table (לוח התמרורים), each fact
with its clause and a confidence level; `openQuestions` in `facts.json` lists
what still needs confirmation by the Ministry. All lessons and questions are
original writing — nothing is copied from the Ministry's question bank.
This app does not replace official publications: where they differ, the law
decides.
