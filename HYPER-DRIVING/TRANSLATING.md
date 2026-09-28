# Hyper Driving — translating the course

The Hebrew course (`content/il/he/…`) is the source. A translation is a second
set of files with **the same structure and the same ids** in
`content/il/<lang>/…` — for English, `content/il/en/lessons/<chapter>.json`,
`content/il/en/questions/<chapter>.json`, `content/il/en/trees/<name>.json`.
Read `AUTHORING.md` first (markup, facts, terms); this guide adds what is
special to translating.

## 1. What stays exactly the same

- Every `id`, the order of lessons, the order of questions, every node id and
  `next` of a tree.
- In questions: `options` in **the same order**, `answer` (same index),
  `lesson`, `licence`, `sign`, `fig`, `facts`, `fixed`, `shuffled`.
- In lessons: `licence`, `terms`, `signs`.
- Every reference in the text, character for character: `{{fact:…}}`,
  `{{fine:…}}`, `{{points:…}}`, `[[sign:…]]`, `[[signs:…]]`, `[[dash:…]]`,
  `[[lesson:…]]`, `[[chapter:…]]`, `[[tree:…]]`, `[[fig:…]]`,
  `[[widget:… …]]`. Only the **display text** after `|` is translated:
  `[[term:clutch|המצמד]]` → `[[term:clutch|the clutch]]`,
  `[[lesson:sd-limits|המהירות המרבית]]` → `[[lesson:sd-limits|the speed limits]]`.
  `[[sign:302|icon]]` keeps `icon`.
- The block structure: the same headings (`#`), lists, tables (same number of
  columns and rows), callouts (`:::law`, `:::warn`, … with a translated title
  if the Hebrew one had a title) and the same number of key points.
- A legal number is never typed — it stays a `{{fact:…}}`.

The validator compares every translated lesson, question and tree with the
Hebrew one and reports a missing or extra id, a changed answer, a different
number of options, and references that are not the same set.

## 2. English

- **British spelling and road vocabulary** (tyre, kerb, bonnet, give way,
  junction, roundabout, overtake, carriageway; say "truck", as the Israeli
  licence classes do). Units stay metric (they come from the facts).
- Clear, plain English for learners — many readers are not native speakers:
  short sentences, active voice, one idea per sentence. Translate the meaning,
  not the words; keep every fact, rule, reason, example and warning.
- Address the reader as "you" ("slow down", "check the mirror"); rules in
  plain imperative or "you must / must not".
- **Terminology from the glossary** (`content/il/glossary.json`, `term.en` and
  `alt.en`): use the glossary's English term for every concept that has one,
  so the whole course speaks with one vocabulary. Grep for the term id or the
  Hebrew word.
- Israeli legal names in English:

  | Hebrew | English |
  |---|---|
  | פקודת התעבורה | the Traffic Ordinance |
  | תקנות התעבורה | the Traffic Regulations |
  | תקנה 51 / תקנות 69–72 | regulation 51 / regulations 69–72 (in brackets: "(reg. 51)", "(regs. 69–72)") |
  | סעיף 64ב לפקודה | section 64B of the Ordinance |
  | צו התעבורה (עבירות קנס) | the Traffic Order (Fixed-Fine Offences) |
  | התוספת השישית | the Sixth Schedule |
  | חוק העונשין | the Penal Law |
  | חוק הפרות תעבורה מינהליות | the Administrative Traffic Violations Law |
  | משרד התחבורה והבטיחות בדרכים | the Ministry of Transport and Road Safety |
  | רשות הרישוי | the Licensing Authority |
  | הרשות הלאומית לבטיחות בדרכים | the National Road Safety Authority |
  | מד״א / מגן דוד אדום | Magen David Adom (MDA), Israel's ambulance service |
  | כבאות והצלה | Fire and Rescue Services |
  | רישיון רכב | vehicle licence (registration) |
  | רישיון נהיגה | driving licence |
  | ביטוח חובה | compulsory insurance |
  | מבחן תאוריה / מבחן מעשי | theory test / practical driving test |
  | מבחן רישוי תקופתי ("טסט") | the periodic vehicle test (annual inspection) |
  | נהג חדש / מלווה | new driver / accompanying driver |
  | עצירה / העמדה / חנייה | stopping / standing / parking (keep the three apart exactly as the Hebrew does) |
  | דרך עירונית / דרך שאינה עירונית / דרך מהירה | urban road / non-urban road / expressway |

- **Hebrew terms are useful to English readers in Israel** (police officers,
  instructors and mechanics speak Hebrew). Where the Hebrew text explains a
  Hebrew term or jargon, keep that knowledge: "the clutch (Hebrew: מצמד;
  in the workshop „קלאץ׳”)". Do not add Hebrew to every term — the app already
  shows the Hebrew term beside each term chip.
- Hebrew typography rules (gershayim, „…”) do not apply to English; use
  ordinary English punctuation with typographic quotes “…” and ’.
- Place names in their usual English spelling (Tel Aviv, Beersheba, Route 6,
  the Ayalon Highway, the Arava, the Golan).

## 3. Files and checking

Write each chapter's two files (lessons, questions) — and for the
troubleshooting chapter the tree files — into `content/il/en/…`. A chapter
file keeps `chapter` and translates `title` and `summary`.

```
node tools/validate.js --grep "en lesson <prefix>-"
node tools/validate.js --grep "en question q-<prefix>-"
node tools/validate.js --warnings --grep "en "
```

Zero errors, and no parity warnings for your files.
