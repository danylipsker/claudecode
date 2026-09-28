# Hyper Ergonomics

Designing for people — the fourteenth Hyper app, on the same engine as the others (`../HYPER-CORE`).
Body sizes and how they spread; the dimensions of furniture, rooms, workplaces, machines and
vehicles; posture, lifting and carrying; noise, vibration, heat, cold, light and air; the mind at
work; shift work and the organisation of work — at home and in public buildings, in offices,
workshops, the military and the field. People differ in size, weight, strength and age, so every
recommendation is given as a **range**, with the user who limits it, what it protects or makes
possible, and where it stops working. All text, questions and simulations are original; standards
are described and cited, not copied.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-ERGONOMICS/>. No installation, no network.

> The body data in this app are representative, rounded values for adults, for learning and first
> estimates. A real product or workplace needs data for its own users, the standards and laws that
> apply where it is used, and a trial with real people. The pages explain; they are not medical
> advice. Military pages cover human factors only.

## What is in it

**132 concepts** in 14 branches and 21 topics, with **320 formula calculators**,
**133 simulations** (used 163 times across the pages), **629 quiz questions**,
**271 worked examples** and **241 problems**. **694 recommended ranges** sit in "Recommended ranges"
panels on 131 pages, each tagged with its setting — workshop and industry 304, home and public 214,
office 180, field work 178, military 148, health care 141, vehicles 104, schools 57, everywhere 72.

| Branch | Concepts | Topics |
|---|---:|---|
| What Ergonomics Is | 11 | principles · methods |
| Anthropometry: Measuring People | 13 | body dimensions · human variation |
| Biomechanics and Posture | 7 | the body as a machine |
| Manual Handling | 7 | lifting, carrying, pushing |
| Office and Computer Workstations | 11 | the seated workstation · layout |
| Furniture and Living Spaces | 12 | furniture · buildings |
| Workshops and Industrial Work | 14 | the workshop · organising work |
| Machinery Design | 13 | machines and operators · controls and displays |
| The Physical Environment | 12 | noise and vibration · climate, light and air |
| Cognitive Ergonomics | 7 | the mind at work |
| Vehicles and Transport | 6 | vehicles |
| Military Ergonomics | 6 | military human factors |
| Field and Outdoor Work | 7 | working in the field |
| Healthcare, Education and Services | 6 | special settings |

## Tools

- **Dimension finder** (Tools → Dimension finder): every recommended range in the app in one
  table — dimension, range, the user who sets it, why, its limits and source — searchable and
  filtered by setting.
- **Body sizes**: how a dimension spreads among women and men and how many people a clearance, a
  reach or an adjustable range accommodates; one person of any sex and percentile beside another,
  every dimension, drawn to scale.
- **Workstation fitter**: seat, desk, keyboard and screen heights for one person and the adjustment
  range the whole range of users needs; standing work heights for precision, light and heavy work.
- **Lifting**: the revised NIOSH lifting equation with each multiplier shown; the energy cost of
  carrying a load (Pandolf).
- **Noise, vibration & climate**: a day's noise exposure (EU, OSHA, NIOSH) and hearing protectors;
  hand-arm and whole-body vibration A(8); thermal comfort (PMV/PPD); heat stress (WBGT); wind chill;
  lighting levels and the number of luminaires.

The models are `HYPER-CORE/js/ergo.js` (`kit.ergo`: representative anthropometry, percentiles and
mixed populations, manikin link lengths, workstation rules, NIOSH, noise and vibration dose, PMV/PPD,
WBGT, wind chill, Pandolf, Fitts and Hick, stairs, lighting), tested by
`HYPER-CORE/tools/test-ergo.js`. The pages' own simulations add models of spinal loading, reach over
guards, alarm audibility, room acoustics, seat vibration, the body clock and more.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (designing for a
range: the reference page the authors followed), `sims/reference.js` (who fits a design; a chair and
desk fitted to a person), one `content/*.js` per topic group, `sims/*.js`, and a generated
`catalog.js`. Run

```bash
node HYPER-CORE/tools/test-ergo.js
node HYPER-CORE/tools/validate.js HYPER-ERGONOMICS --final
node HYPER-CORE/tools/simtest.js HYPER-ERGONOMICS
node HYPER-CORE/tools/catalog.js --all
```
