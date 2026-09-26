# HYPER-CORE — the engine behind the Hyper apps

Hyper Physics, Hyper Math — and later Hyper Electronics and Hyper Chemistry — are one
engine with different content. This folder is the engine: the concept graph, a TeX to
MathML renderer, an expression engine that solves any formula for any variable, units
and constants, the calculators, concept maps, simulations kit, practice and progress.

Plain JavaScript and CSS: no build step, no libraries, no network. A discipline is a
folder beside this one with an `index.html` that loads the engine and its own content.

## Why separate apps with one engine

Each discipline is its own app, with its own home page, map, formula sheet and
progress, so it stays focused and fast. But they share everything else, and they link
into each other: a physics page lists `math:vectors` as a prerequisite and the link
opens Hyper Math on that page; each app loads the other's `catalog.js`, so those links
carry real titles and the search box finds concepts in both. A new discipline costs
only its content.

## Files

| File | What it does |
|---|---|
| `js/hyper.js` | Namespace, registry (`Hyper.add`, `Hyper.sim`, `Hyper.catalog`), the graph (children, "leads to", branches, reading order, learning paths), utilities |
| `js/tex.js` | TeX subset → MathML, drawn natively by the browser. Every symbol carries `data-k` so formulas can be highlighted and clicked |
| `js/expr.js` | Expression parser (implicit multiplication, functions), compiler, symbolic isolation of a variable, TeX output, numeric root finder, answer equivalence |
| `js/units.js` | 90 quantities with their units (SI plus common alternatives) and 45 physical constants |
| `js/text.js` | The content's Markdown dialect: inline/display math, `[[concept]]` links, callouts, tables |
| `js/formula.js` | A formula as a calculator: solve for any variable, all roots in a range, generated practice problems with worked solutions |
| `js/ui/app.js` | Shell, router, contents tree, search, link previews, saved progress, theme, home page, shortcuts |
| `js/ui/concept.js` | The concept page: map, explanation, formulas, simulations, examples, practice, connections |
| `js/ui/calc.js` | The formula card (calculator, sliders, units, relationship graph, inline practice) |
| `js/ui/map.js` | The local concept map on every page, and the zoomable radial map of the whole discipline |
| `js/ui/practice.js` | Questions (multiple choice, true/false, typed expressions, numbers with units), sessions, flashcards, daily review |
| `js/ui/views.js` | Formula sheet, tools (function plotter, calculator, unit converter, constants, symbol glossary, A–Z index), progress, learning paths |
| `js/ui/plot.js` | A canvas plotter (nice ticks, log axes, hover read-out) |
| `js/ui/simkit.js` | The kit simulations are built with, and the card they live in |
| `css/hyper.css` | The look: light and dark themes, discipline and branch hues, responsive down to phones |
| `AUTHORING.md` | How to write content: schema, text, TeX, formulas, quizzes, simulations |

## Tools

```bash
node HYPER-CORE/tools/test-core.js                    # unit tests of the engine (TeX, expressions, units, formulas)
node HYPER-CORE/tools/validate.js HYPER-PHYSICS       # checks all content: links, TeX, formulas solve both ways, quizzes
node HYPER-CORE/tools/simtest.js HYPER-PHYSICS        # runs every simulation headless, every control to its ends
node HYPER-CORE/tools/catalog.js --all                # regenerates each discipline's catalog.js (titles for cross-links)
```

`validate.js --final` also requires every planned concept to exist; `--only a.js,b.js`
limits the report to some files.

## Adding a discipline

1. Add it to `Hyper.DISCIPLINES` in `js/hyper.js` (id, title, folder, hue, `ready: true`)
   and to the folder maps in `tools/validate.js` and `tools/catalog.js`.
2. Copy `HYPER-MATH/index.html` into the new folder and change the discipline id and
   the content scripts.
3. Write `content/outline.js` (root, branches with `icon` and `hue`, topics with `plan`)
   and the content files, following `AUTHORING.md`.
4. Run the validator and the simulation test; run `catalog.js --all` so the other apps
   can link to the new one.

## Progress and privacy

Progress (visited pages, answers, bookmarks) is kept in the browser's `localStorage`
under `hyper:<discipline>`; the theme under `hyper:settings`. Nothing leaves the page.
The Progress view exports and imports it as JSON.
