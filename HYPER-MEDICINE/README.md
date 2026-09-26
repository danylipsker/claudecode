# Hyper Medicine

The human body in health and disease — the sixth Hyper app, on the same engine as Hyper
Physics, Math, Electronics, Chemistry and Finances (`../HYPER-CORE`). How every system works,
what goes wrong and why, how illness is diagnosed and treated, how to read the evidence, how
to stay well, and what to do in an emergency. All text, questions and simulations are
original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-MEDICINE/>. No installation, no network.

> For learning only: the pages explain; they do not diagnose, prescribe or replace a
> clinician who knows the patient. In an emergency, call your local emergency number.

## What is in it

**165 concepts** in 15 branches and 30 topics, with **345 formula calculators**,
**108 simulations** (used 159 times across the pages), **821 quiz questions** and
**365 worked examples and case vignettes**.

| Branch | Concepts | Topics |
|---|---:|---|
| How the Body Works | 11 | cells and tissues · homeostasis |
| Heart and Circulation | 13 | the heart · blood vessels and pressure · heart and vessel disease |
| Lungs and Breathing | 11 | how breathing works · lung disease |
| Blood and Immunity | 10 | blood · the immune system |
| Kidneys and Urinary System | 10 | how the kidneys work · kidney and urinary disease |
| Digestion, Liver and Nutrition | 12 | digestion · nutrition · digestive disease |
| Hormones and Metabolism | 11 | hormones · glucose and diabetes |
| Brain and Nerves | 15 | nerve cells · the brain and senses · neurological disease |
| Mind and Mental Health | 11 | wellbeing and stress · mental disorders · getting help |
| Infection and Infectious Disease | 11 | microbes and infection · infectious diseases |
| Cancer | 10 | what cancer is · finding and treating cancer |
| Medicines and Treatment | 8 | how medicines work, drug levels, dosing principles, trials, pain relief, anaesthesia |
| Diagnosis and Evidence | 10 | examining a patient · evidence and uncertainty |
| Prevention and Life Stages | 12 | healthy living · public health · life stages |
| Emergencies and First Aid | 10 | the first minutes, CPR and the defibrillator, choking, bleeding, burns, heart attack and stroke, anaphylaxis, poisoning, injuries, heat and cold |

## Tools

- **Body map** (Tools → Body map): the organs drawn front-on, coloured by system; click one
  for what it does, a few numbers, and the pages about it.
- **Medical calculators** (Tools → Medical calculators): body size and energy (BMI, BSA,
  ideal weight, energy use); kidney function (eGFR by CKD-EPI 2021 and creatinine clearance,
  in mg/dL or µmol/L); blood pressure in the American and European categories, QTc and
  exercise zones; the anion gap, corrected calcium and a lab-unit converter; what a test
  result means, drawn as 1 000 people; treatment benefit (absolute risk, NNT) as 100 people;
  maintenance fluids, drip rates and the Parkland formula.

The physiology and formulas behind them and the simulations are `HYPER-CORE/js/medicine.js`
(a synthetic ECG in eleven rhythms, the Hodgkin–Huxley neuron, oxygen saturation, drug
levels, Bayes, an SIR epidemic, the clinical formulas), tested by
`HYPER-CORE/tools/test-medicine.js` against published values.

## How the content was written

Every page follows the safety rules in `../HYPER-CORE/AUTHORING.md` (section "Medicine: the
body, units and safety"): explain, never diagnose or prescribe; emergency warning signs in a
callout ending with "call your local emergency number"; medicines by generic name and never
with doses; first aid according to the current ERC/AHA resuscitation guidelines; numbers with
their source and date, laboratory values in both unit systems; safe messaging on suicide
with crisis lines; people-first language. Illustrative models are labelled as such.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (blood
pressure: the reference page the authors followed), `sims/reference.js` (a cuff measurement
with Korotkoff sounds and an ECG monitor), one `content/*.js` per topic, `sims/*.js`, and a
generated `catalog.js`. Run

```bash
node HYPER-CORE/tools/test-medicine.js
node HYPER-CORE/tools/validate.js HYPER-MEDICINE --final
node HYPER-CORE/tools/simtest.js HYPER-MEDICINE
node HYPER-CORE/tools/catalog.js --all
```
