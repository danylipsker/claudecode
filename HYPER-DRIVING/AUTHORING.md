# Hyper Driving — writing the content

This guide is for everyone who writes or edits the course: lessons, practice
questions, troubleshooting trees, glossary terms, facts. Read it whole before
writing. The reference chapter is `content/il/he/lessons/speed-distance.json`
with its questions in `content/il/he/questions/speed-distance.json` — copy its
shape, depth and tone.

## 1. Who reads this

Israeli learner drivers (from 16), and experienced drivers moving up to a
motorcycle, a truck or a bus licence. They study on a phone, in short sessions,
for the theory test (מבחן התאוריה) and for real driving. They need:

- **the law** — exactly right, with the regulation it comes from;
- **understanding** — why the rule exists, what happens if you ignore it;
- **terminology** — the correct Hebrew term *and* the English one, and the
  jargon they will hear from instructors and mechanics;
- **practice** — many questions like the real test, each with an explanation.

## 2. Files

One chapter = one lessons file and one questions file per language:

```
content/il/he/lessons/<chapter>.json     { "chapter", "title", "summary", "lessons": [...] }
content/il/he/questions/<chapter>.json   { "chapter", "questions": [...] }
content/il/he/trees/<name>.json          { "trees": [...] }        (troubleshooting only)
```

Chapter ids are fixed in `content/il/course.json`. Write Hebrew now; English
comes later in `content/il/en/...` with the **same ids**, same option order and
same `answer`.

Never edit shared files (`facts.json`, `glossary.json`, `figures.json`,
`signs.json`, `course.json`, `manifest.json`). What you need to add goes into
**draft files** next to them — the validator reads them as if merged, and the
editor merges them later:

```
content/il/_new-facts-<chapter>.json     { "facts": [ … ], "offences": [ … ] }
content/il/_new-terms-<chapter>.json     { "terms": [ … ] }
content/il/_new-figures-<chapter>.json   { "figures": { "<id>": { … } } }
```

### A lesson

```json
{
  "id": "sd-limits",                 // <chapter prefix>-<topic>, lowercase-kebab, unique in the pack
  "title": "המהירות המרבית המותרת",
  "summary": "one sentence: what the reader will know after this lesson",
  "licence": ["heavy"],              // omit = every licence class (see §7)
  "terms": ["urban-road", "expressway"],   // glossary ids the lesson teaches (shown under the lesson)
  "signs": ["426"],                  // sign numbers the lesson teaches (shown as cards)
  "body": "markup text (§3)",
  "keyPoints": ["3–6 short sentences a reader should remember", "…"]
}
```

A lesson is 350–900 words: a short opening that says why it matters, the
content in sections (`# heading`), at least one callout, and key points.
Chapters have 4–7 lessons.

### A question

```json
{
  "id": "q-sd-013",                  // q-<chapter prefix>-NNN
  "lesson": "sd-stopping",           // the lesson that teaches it (required)
  "licence": ["heavy"],              // omit = every class
  "sign": "302",                     // optional: show this sign above the question
  "fig": "stopping-sight",           // optional: a figure above the question
  "facts": ["speed.urban"],          // facts the question depends on (so a law change flags it)
  "q": "question text (inline markup)",
  "options": ["…", "…", "…", "…"],   // exactly 4
  "answer": 2,                       // index of the correct option (vary it: 0–3 evenly)
  "fixed": false,                    // true only when order matters ("all of the above")
  "explain": "why the answer is right, 1–3 sentences, with the regulation"
}
```

## 3. Markup

Blocks, one per line or paragraph:

| Write | Get |
|---|---|
| blank line | new paragraph |
| `# Title` / `## Sub` | section headings |
| `- item` / `1. item` | lists (indent 2 spaces to continue an item) |
| `\| a \| b \|` then `\|---\|---\|` | a table (first row = header) |
| `:::law` … `:::` | callout: **law** (the rule, with its regulation), **warn**, **danger**, **tip**, **remember**, **example**, **note**, **tech** (how it works inside), **fine** (fines/points). An optional title may follow: `:::tip כלל אצבע` |
| `---` | a rule |
| `[[fig:id]]` | a figure from figures.json (own line) |
| `[[widget:name key=value]]` | an interactive widget (own line, §6) |
| `[[signs:301,302,303]]` | a row of sign cards (own line) |

Inline:

| Write | Get |
|---|---|
| `**bold**`, `==highlight==` | emphasis |
| `[[term:clutch]]`, `[[term:clutch\|המצמד]]` | a glossary term chip (tap → Hebrew, English, definition, jargon) |
| `[[sign:302]]`, `[[sign:302\|text]]`, `[[sign:302\|icon]]` | a sign with its name / your text / icon only |
| `[[dash:oil-pressure]]`, `[[dash:oil-pressure\|icon]]` | a dashboard warning light |
| `[[lesson:id\|text]]`, `[[chapter:id\|text]]`, `[[tree:id\|text]]` | links |
| `{{fact:speed.urban}}` | the legal value with its unit: "50 קמ״ש" |
| `{{fact:speed.urban\|n}}` | the number only: "50" |
| `{{fine:phone-handheld}}` / `{{points:phone-handheld}}` | an offence's fine ("1,000 ₪") / points ("10") |

**Hebrew prefixes go inside the chip**: write `[[term:urban-road|בדרך עירונית]]`,
never `ב[[term:urban-road|דרך עירונית]]` — a letter outside the chip breaks
onto its own line.

Use a term chip the **first time** a term appears in a lesson (and in key
points), not every time.

## 4. Numbers from the law are never typed

Every speed, distance, age, time limit, alcohol limit, fine and point count
comes from `content/il/facts.json` through `{{fact:…}}`, `{{fine:…}}` or
`{{points:…}}`. When the Ministry changes a law it changes one value, and
every lesson and question follows — including scheduled changes that take
effect on a future date. A typed "50 קמ״ש" would silently become wrong.

- Find ids: `grep -n "speed\." content/il/facts.json`, or search the Hebrew label.
- Only **numeric** facts (and short codes like emergency numbers) go inline.
  Facts whose value is a code (`"mandatory"`, `"nonurban"`) are records for
  the editor — write the rule in words and cite the regulation.
- A number you need is missing? Look it up in the law (§8), then add it to
  `_new-facts-<chapter>.json` in the same shape as facts.json:
  `{ "id", "value", "unit", "label": {"he","en"}, "source": {"title","url","clause"}, "confidence", "notes" }`.
  Units: kmh, m, km, cm, mm, s, min, h, days, months, years, kg, t, kw, hp, cc,
  bar, points, ils, passengers, db, mps2 (m/s²), count, percent,
  ym ([years, months]), range, text. A value may be `{"he": …, "en": …}` when
  it is words ("1 בנובמבר עד 31 במרץ").
- The same goes for numbers written as words: "אחת לשנתיים", "חודשיים" become
  "אחת ל-{{fact:…}}", "{{fact:…}}" when the number is a legal value.
- Facts work in lesson **titles and summaries** too; there they are shown as
  plain text with the value filled in.
- Physics and engineering numbers that are not law (μ of a wet road, typical
  oil-change interval, 25 m per second at 90 km/h) are written normally.
- Offence questions: fine and points always via `{{fine:id}}` / `{{points:id}}`.
- What stays typed, on purpose: the bands that define an offence (a speed
  excess of 21–30 km/h, an overload of 10–15%, a child aged 3–8 — they are
  part of the offence's own id and title); sign numbers and the values a sign
  itself shows or defines; dates of history ("from 1 January 2016"); worked
  examples; and technical codes (12 V, 5W-30, 205/55R16).

## 5. Hebrew: register, terms, spelling

**Register.** Clear, correct, modern Hebrew; friendly but not slangy. Rules in
impersonal form — „חובה לעצור”, „אסור לעקוף”, „יש להאט”, „הנהג חייב…”. When
addressing the reader, use the plural imperative („האטו”, „בדקו”) — the
gender-neutral convention of Israeli interfaces. Short sentences; one idea per
sentence; examples from Israeli roads (כביש 6, נתיבי איילון, הגשם הראשון,
שרב, שיטפונות בנחלים, מעבר חצייה ליד בית ספר).

**Terminology.** The glossary (`content/il/glossary.json`) is the authority.
Use its preferred Hebrew term (`term.he`). Jargon (`alt.he`: קלאץ׳, גיר,
סטרטר, ג׳ק, וינקר) may appear once in brackets to connect it to the proper
term: „[[term:clutch|המצמד]] („קלאץ׳”)”. Legal distinctions are exact:
עצירה / העמדה / חנייה are three different things; „דרך” ≠ „כביש”; „רכב מנועי”,
„משקל כולל מותר”, „דרך שאינה עירונית” as the law writes them.

A term you need is not in the glossary? Add it to `_new-terms-<chapter>.json`:

```json
{ "id": "engine-braking", "cat": "manoeuvre", "group": "road",
  "term": { "he": "בלימת מנוע", "en": "engine braking" },
  "niqqud": { "he": "בְּלִימַת מָנוֹעַ" },          // only if sure
  "alt": { "he": ["ירידה בהילוך"], "en": [] },
  "usage": { "he": "official" },                    // official | common | jargon | none
  "def": { "he": "1–2 plain sentences", "en": "same in English" },
  "law": { "he": "תקנות התעבורה, תקנה …" },         // if the law defines it
  "see": ["gearbox"] }
```

If Hebrew has **no** word for the concept, `term.he` holds the English word and
`usage.he` is `"none"` — the app shows it with a "no Hebrew term yet" flag
until the Ministry supplies one. Do not invent Hebrew terms.

**Spelling.** Full spelling without niqqud (כתיב מלא) as the Academy writes it:
חנייה, חצייה, תנועה, מהירות, תאוריה (gov.il spelling), רישיון. Abbreviations
take gershayim ״ and geresh ׳ — **never ASCII quotes**: קמ״ש, ק״ג, ס״מ, מ״מ,
מד״א, ש״ח; ג׳ק, קלאץ׳, צ׳יפ. Quotation marks in Hebrew text: „…”. Numbers are
digits. Dashes: „—” between clauses.

**Own words.** Never copy text from the regulations, the Ministry's question
bank, books or websites. Read the source, then explain it yourself. You may
quote a short phrase of the law that is itself the rule's name („מהירות
סבירה”). Every legal claim names its source in brackets: (תקנה 51),
(פקודת התעבורה, סעיף 64ב).

## 6. Figures and widgets

Widgets (interactive, localized by the app): `stopping-distance` (speed,
reaction), `speed-energy` (speed), `following-distance` (speed, gap),
`traffic-light`, `four-stroke` (type=diesel), `blind-spots` (vehicle=car|truck|bus),
`tyre-code` (code). Place one where it explains the text — not decoration.

A static diagram (a junction, a sign situation, a parking manoeuvre, the parts
of a brake) goes into `_new-figures-<chapter>.json`:

```json
{ "figures": { "rw-t-junction": { "kind": "svg",
  "caption": { "he": "…", "en": "…" },
  "labels": { "you": { "he": "אתם", "en": "you" } },
  "svg": "<svg viewBox=\"0 0 400 260\" xmlns=\"http://www.w3.org/2000/svg\">… <text …>{{label:you}}</text> …</svg>" } } }
```

SVG rules: a `viewBox`, no width/height, no scripts, no external images;
colours that work on light and dark (asphalt #474C55, lines #fff, cars
#4d8dff / #d9534f / #f0b429, grass #3f7d4e, text #9aa4b8); every word through
`{{label:key}}` so it can be translated. Roads in Israel drive on the **right**.
Check your SVG by eye: `node tools/sheet.js` renders signs; for a figure,
open the lesson in the app (see §9).

## 7. Licence classes

Classes: B (private car), A2 / A1 / A (motorcycles), C1 / C / CE (trucks),
D1 / D2 / D3 / D (taxis, minibuses, buses), 1 (tractor). Groups:
`car`, `moto`, `heavy`, `bus`, `tractor`, `professional` (heavy + bus),
`motor` (all but motorcycles and tractors). Tag a lesson or question only when
it is **specific** to some classes (truck air brakes → `["heavy"]`,
counter-steering on a motorcycle → `["moto"]`). General rules carry no tag.
A B-licence learner sees only untagged items and items tagged for B.

## 8. Sources and accuracy

Law, in Hebrew, current (downloaded from Hebrew Wikisource):

```
C:\Users\Dany\AppData\Local\Temp\claude\C--Users-Dany-source-claudecode\ed771638-df0a-48be-9282-53dcae28a9d3\scratchpad\research\src\takanot.txt   תקנות התעבורה, תשכ״א-1961 (1.3 MB — grep, never read whole)
…\research\src\pkuda.txt       פקודת התעבורה [נוסח חדש]
…\research\fines-order.txt     צו התעבורה (עבירות קנס)
…\research\sched6.txt          התוספת השישית (points)
…\research\signs-clean.txt     לוח התמרורים המשולב (text)
```

Grep for the rule (`grep -n "עקיפה" takanot.txt`), read the regulation, then
write. Regulation numbers: `{{ח:סעיף|51|…}}` in the file = תקנה 51.

Signs: the Ministry's sign chart `luach-tamrurim-2021.pdf` (beside this file)
is the authority for a sign's picture, name and meaning. The app shows its
pictures (`sign-art.json`, traced in `DRIVING-SIGNS/`); a sign's name and
meaning in `signs.json` must say what the chart's row for that number says —
wheel counts, sign ranges and "right or left, respectively" pairs included.
The letter פ after a number marks a light-emitting sign (chart, page 2): same
meaning as the base number, name "… (תמרור פולט אור)". After renaming a sign,
run `python DRIVING-SIGNS/_tools/sync_names.py`, then
`node tools/import-sign-art.js` and `node tools/publish.js`.

The official theory question bank is at `…\research\theory.json`
(data.gov.il). Use it **only** to see which topics the real test covers and
how deep — never copy or paraphrase its questions; write your own.

Vehicle technology: accurate, practical, conservative. When a procedure can
hurt someone (jump-starting, a hot radiator, a jacked-up car, a high-voltage
EV system, a fire), the safe way comes first, in a `:::danger` or `:::warn`
callout. Emergencies: personal safety first, then call — police
{{fact:emergency.police}}, מד״א {{fact:emergency.mda}}, fire and rescue
{{fact:emergency.fire_and_rescue}}. Technical intervals are "typical — the
manufacturer's handbook decides".

If you are not sure a rule is current, say so in your report — do not guess.

## 9. Questions that teach

- Four options, one clearly right. Wrong options are **plausible**: the
  common misconception, the neighbouring value (another fact), the rule for
  another vehicle or road type. No jokes, no absurd options.
- Mix: facts (what is the limit), rules (who gives way), situations (what
  do you do now), understanding (why), signs (`"sign": "…"` + „מה משמעות
  התמרור?” or a situation using the sign), vehicle knowledge.
- Avoid „כל התשובות נכונות” / „אף תשובה” — if you must, `"fixed": true`.
- Answers spread evenly over positions 0–3; options of similar length.
- The explanation says why the right answer is right (and, when useful, why
  the tempting wrong one is wrong) and cites the regulation.
- About 25 questions per chapter (specialised chapters 15–20), covering every
  lesson.
- Numbers in questions: the right answer and the explanation take the value
  from a fact; a wrong option that is another real legal value is that fact
  (the neighbouring value); an invented wrong number is typed. Two facts can
  share a value (non-urban and heavy-vehicle limits are both 80 km/h), so
  pick neighbours that differ.
- The validator compares the options as they read — today and on every
  scheduled change date — and reports two options that would read the same,
  with the date. That is how a law change that collides with a typed wrong
  answer is caught before it reaches learners.
- A scenario number ("a truck of 14,000 kg", "speeding by 35 km/h") stays
  typed, but list the threshold it depends on in the question's `facts`, so
  the editor's fact table shows the question under that fact.
- Worked physics uses the speed it was worked out for ("at 50 km/h … about
  28 m"), never `{{fact:speed.urban}}` — a change in the law must not change
  the physics.
- Never write the unit after a fact (`{{fact:x}} נקודות` prints "12 נקודות
  נקודות"); after גיל / age use `{{fact:x|n}}` ("מגיל 17", "age 17"). The
  validator reports both.

## 10. Troubleshooting trees

A tree walks from a symptom to a diagnosis by questions. Example:
`content/il/he/trees/wont-start.json`.

```json
{ "trees": [ {
  "id": "engine-overheating", "group": "מנוע וקירור",
  "title": "המנוע מתחמם", "summary": "one line",
  "vehicles": ["car", "truck", "bus", "motorcycle"],
  "safety": "markup — what never to do (shown first, in red)",
  "start": "n1",
  "nodes": {
    "n1": { "q": "question (inline markup)", "text": "optional explanation", "options": [ { "label": "answer", "next": "n2" }, { "label": "…", "next": "r-fan" } ] },
    "r-fan": { "result": "the diagnosis", "severity": "stop | soon | ok",
               "text": "why (markup)", "actions": ["step 1", "step 2"], "lesson": "eg-cooling" }
  } } ] }
```

Every node is reachable, every `next` exists, every leaf has `result`,
`severity` and `actions`. 2–4 options per question; 6–15 nodes per tree. Stay
within what a driver can safely observe or check.

## 11. Checking your work

From the `HYPER-DRIVING` folder:

```
node tools/validate.js --grep "<chapter prefix or id>"     # errors and warnings for your files
node tools/validate.js --warnings --grep "<prefix>"
```

Zero errors before you finish. Warnings about ASCII quotes in your text must be
fixed. The validator also checks every term, sign, fact, lesson and figure
reference and that the markup renders.

To see a lesson in the app: the dev server is `node ../scripts/serve.js . 8173`
(run from HYPER-DRIVING) → `http://localhost:8173/#/lesson/<id>`. (Optional; the
validator is what must pass.)
