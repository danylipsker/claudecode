# Hyper Chemistry

General chemistry as a map of connected concepts — the fourth Hyper app, on the same
engine as Hyper Physics, Hyper Math and Hyper Electronics (`../HYPER-CORE`). The physics
underneath (quantum mechanics, thermodynamics, nuclear physics) is linked into Hyper
Physics, the mathematics into Hyper Math, cells and sensors into Hyper Electronics. All
text, questions and simulations are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-CHEMISTRY/>. No installation, no network.

## What is in it

**146 concepts** in 11 branches and 30 topics, with **362 formula calculators**,
**73 simulations** (used 137 times across the pages), **715 quiz questions** and
**313 worked examples**.

| Branch | Concepts | Topics |
|---|---:|---|
| Atoms and the Periodic Table | 18 | atomic structure · electrons in atoms · periodicity · nuclear chemistry |
| Bonding and Structure | 19 | ionic and metallic · covalent · molecular shape and orbitals · intermolecular forces · coordination |
| Reactions and Stoichiometry | 12 | the mole · chemical reactions · solution stoichiometry |
| States of Matter and Solutions | 17 | gases · liquids, solids and phase changes · solutions |
| Thermochemistry and Thermodynamics | 9 | thermochemistry · entropy and free energy |
| Chemical Kinetics | 10 | reaction rates · mechanisms and catalysis |
| Chemical Equilibrium | 11 | the equilibrium constant · solubility equilibria |
| Acids and Bases | 12 | acids, bases and pH · buffers and titrations |
| Electrochemistry | 13 | oxidation and reduction · electrochemical cells · electrolysis |
| Organic Chemistry | 18 | structure and naming · organic reactions · molecules of life |
| Analytical Chemistry | 7 | uncertainty, gravimetry, Beer–Lambert, IR, NMR, mass spectrometry, chromatography |

## Chemistry the engine understands

- **The elements** (`HYPER-CORE/js/chem.js`): all 118, with atomic masses,
  electronegativity, ionisation energy, covalent radius, oxidation states, electron
  configurations (with the exceptions such as Cr and Cu) and CPK colours. Every page and
  simulation reads them from here, so they agree with the periodic table.
- **Tools → Periodic table**: colour the table by category, block or any property, search
  it, click an element for its card. (It is in the other Hyper apps too, linking here.)
- **Tools → Molar mass & equations**: molar mass and percentage composition of any formula
  (brackets, hydrates, charges), and an exact equation balancer (integer linear algebra,
  ions and electrons included).
- **Chemical notation** in every text and formula: `\ce{2H2 + O2 -> 2H2O}`, charges, states,
  isotopes, hydrates, bonds, arrows with conditions.
- **Molecules in 3-D** (`HYPER-CORE/js/molecule.js`) that you turn with the mouse:
  ball-and-stick or space-filling, lone pairs, bond angles.

Simulations were checked against theory and data beyond the headless test: the pH
curves come from the exact charge balance, the gas piston's wall pressure from PV = nRT,
effusion from Graham's law, the phase diagrams from accurate fits for water and CO₂, the
VSEPR lab's angles from electron pairs repelling on a sphere, the Daniell cell's voltage
from the Nernst equation, and the enzyme animation from Michaelis–Menten.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js` (branches, topics, planned
concepts), `content/reference.js` (the limiting reagent: the reference page authors
followed), `sims/reference.js` (a reacting flask and the VSEPR lab), one `content/*.js`
per topic, `sims/*.js`, and a generated `catalog.js`. See `../HYPER-CORE/AUTHORING.md`
(the section "Chemistry: formulas, elements and molecules"), and run

```bash
node HYPER-CORE/tools/test-chem.js
node HYPER-CORE/tools/validate.js HYPER-CHEMISTRY --final
node HYPER-CORE/tools/simtest.js HYPER-CHEMISTRY
node HYPER-CORE/tools/catalog.js --all
```
