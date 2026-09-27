# Hyper Pharmaceutics

From molecule to medicine — the tenth Hyper app, on the same engine as the others (`../HYPER-CORE`).
What a medicine is and how it is made and regulated; physical pharmacy (solubility, ionisation,
partition, particles, surfaces and flow); drug stability and shelf life; biopharmaceutics and
bioavailability; pharmacokinetics and pharmacodynamics; tablets, capsules and modified release;
liquids and semisolids; sterile products; advanced delivery (inhalers, nanomedicines, lipid
nanoparticles, biologics, vaccines, depots, 3-D printing); pharmacy calculations; medicines by class;
quality and safety. All text, questions and simulations are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-PHARMACEUTICS/>. No installation, no network.

> For learning. The drugs in the examples, calculators and simulations are hypothetical; real
> preparation and dosing follow the product information and local protocols, with an independent
> check by a qualified person. Nothing here is advice to start, stop or change a medicine.

## What is in it

**129 concepts** in 13 branches and 20 topics, with **402 formula calculators**,
**96 simulations** (used 126 times across the pages), **645 quiz questions**,
**290 worked examples** and **188 problems**.

| Branch | Concepts | Topics |
|---|---:|---|
| Foundations | 7 | medicines and their making |
| Physical Pharmacy | 14 | solubility and ionisation · particles, surfaces and flow |
| Drug Stability | 7 | stability and shelf life |
| Biopharmaceutics | 11 | getting into the body · bioavailability and equivalence |
| Pharmacokinetics | 18 | the basic parameters · models and dosing · special situations |
| Pharmacodynamics | 9 | how drugs act |
| Solid Dosage Forms | 11 | powders and tablets · capsules and modified release |
| Liquids and Semisolids | 8 | liquid dosage forms · skin and other routes |
| Sterile Products | 8 | sterile products and parenterals |
| Advanced Drug Delivery | 8 | new ways to deliver |
| Pharmaceutical Calculations | 9 | calculations |
| Medicines by Class | 10 | medicine classes |
| Quality, Safety and Regulation | 9 | quality · safety |

## Tools

- **Pharmacy calculations** (Tools → Pharmacy calculations): strength and dilution (C₁V₁ = C₂V₂,
  % w/v and ratio strength, serial dilutions); alligation; isotonicity by sodium chloride equivalents
  and by freezing point; mmol, mEq and mOsm of common salts; infusion and drip rates; the F₀ of a
  moist-heat cycle with its log reduction and sterility assurance level.
- **Formulation** (Tools → Formulation): the pH–solubility profile of a weak acid or base with pH_max,
  log D and the BCS solubility verdict; a powder dissolving by Noyes–Whitney; release models (zero and
  first order, Higuchi, Korsmeyer–Peppas, Hixson–Crowell, Weibull) fitted to your data, and f₂;
  Arrhenius shelf life from accelerated data and the mean kinetic temperature; powder flow (Carr,
  Hausner, angle of repose) and tablet tensile strength; HLB blending and Stokes creaming.
- **Pharmacokinetics** (Tools → Pharmacokinetics): dosing regimens (IV, oral, short infusion) against a
  target window; non-compartmental analysis of your own data; two-compartment kinetics; saturable
  (Michaelis–Menten) elimination; the bioequivalence 90 % confidence interval (paired or 2×2
  crossover); dose–response with antagonists, and the therapeutic index.

The models are `HYPER-CORE/js/pharma.js` (`kit.pharma`) with the drug-level functions of
`HYPER-CORE/js/medicine.js`, tested by `HYPER-CORE/tools/test-pharma.js`; the tools are
`HYPER-CORE/js/ui/pharmatools.js`.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (shelf life and the
Arrhenius equation: the reference page the authors followed), `sims/reference.js` (an accelerated
stability study fitted to Arrhenius, and a powder dissolving in a dissolution vessel), one
`content/*.js` per topic group, `sims/*.js`, and a generated `catalog.js`. Run

```bash
node HYPER-CORE/tools/test-pharma.js
node HYPER-CORE/tools/validate.js HYPER-PHARMACEUTICS --final
node HYPER-CORE/tools/simtest.js HYPER-PHARMACEUTICS
node HYPER-CORE/tools/catalog.js --all
```
