# Hyper Feynman

The physics Richard Feynman taught, made visible — the twelfth Hyper app, on the same engine as the others
(`../HYPER-CORE`). It follows *The Feynman Lectures on Physics* (Caltech, 1961–63), *The Character of
Physical Law* (the Messenger Lectures, 1964) and *QED: The Strange Theory of Light and Matter* (1985), with
his famous talks: atoms and energy, least action, symmetry, relativity, oscillations and waves, light,
heat and chance, electromagnetism and Maxwell's equations, matter, quantum behaviour, quantum mechanics at
work, QED's arrows, and his frontiers — nanotechnology, quantum computers, the Challenger O-ring.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-FEYNMAN/>. No installation, no network.

> Hyper Feynman is an independent study companion. It is not affiliated with or endorsed by Caltech, the
> Feynman estate or the publishers of Feynman's books, and it quotes none of them: all explanations,
> pictures and exercises are original. Every page ends with **Where Feynman tells it** — the book, volume
> and chapter to read next. Caltech publishes *The Feynman Lectures on Physics* free to read online at
> <https://www.feynmanlectures.caltech.edu>.

## What is in it

**146 concepts** in 15 branches and 27 topics, with **498 formula calculators**,
**175 simulations** (used 181 times across the pages — every concept has at least one),
**727 quiz questions**, **393 worked examples** and **290 problems**.

| Branch | Concepts | Topics |
|---|---:|---|
| Feynman's Way of Thinking | 9 | how physics works · the scientific attitude |
| Motion, Energy and Gravitation | 12 | energy and motion · gravitation |
| The Principle of Least Action | 8 | least time and least action · the sum over paths |
| Symmetry and Conservation | 6 | symmetry and conservation |
| Space, Time and Relativity | 10 | special relativity · space-time |
| Rotation, Oscillations and Waves | 12 | rotation and oscillators · waves and sound |
| Light and Vision | 10 | optics and radiation · seeing |
| Heat, Chance and the Arrow of Time | 10 | atoms and chance · thermodynamics and time |
| Electromagnetism: Fields | 10 | electrostatics · magnetism and induction |
| Maxwell's Equations | 9 | Maxwell's equations and their consequences |
| Inside Matter | 8 | crystals, magnets and solids · fluids |
| Quantum Behaviour | 9 | the two-slit experiment · amplitudes |
| Quantum Mechanics at Work | 15 | spin and two-state systems · waves in matter |
| QED: The Strange Theory of Light and Matter | 10 | photons and arrows · electrons and their interactions |
| Feynman's Frontiers | 8 | Feynman's ideas and life |

## Every math term explained

Mathematical terms in the text are clickable: a dotted term opens a card saying **what it means** and **how to
deal with it**, with a small example and a link to the matching page of Hyper Math. Every formula card also
lists the operators it contains (∫, ∂, ∇·, ∇×, e^{iθ}, ⟨χ|φ⟩ …) as chips that open the same cards, and
Tools → Math terms is the whole dictionary (113 terms). The dictionary is shared by all the Hyper apps.

## Tools

- **QED arrows**: light reflects from every point of a mirror — the arrows for all the paths are added
  head to tail; the ends of the mirror cancel, and scraping them into a grating brings the reflection back;
  a sheet of glass with QED's two arrows against the exact result.
- **Two-slit lab**: electrons, neutrons, helium atoms, C₆₀ molecules or photons at real sizes and energies;
  the de Broglie wavelength, fringe spacing and envelope, and dots arriving one at a time.
- **Spacetime**: a Minkowski diagram with a boost, your own events in both frames, light cones, invariant
  hyperbolae, the relativity of simultaneity and the twin paradox.
- **Field lines**: click to place charges or currents; field lines, equipotentials and the field at the pointer.
- **Quantum wells**: stationary states of boxes, wells, double wells, steps, barriers and a row of atoms; a
  mixture of two states sloshing; a wave packet reflecting and tunnelling.

The physics is `HYPER-CORE/js/quantum.js` (`kit.qm`), tested by `HYPER-CORE/tools/test-quantum.js`; the
dictionary is `HYPER-CORE/js/glossary.js`; the tools are `HYPER-CORE/js/ui/feyntools.js` and `ui/terms.js`.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (bullets, waves and
electrons: the reference page the authors followed), `sims/reference.js` (the two-slit experiment with
bullets, waves and electrons one at a time, and the two arrows being added), one `content/*.js` per topic
group, `sims/*.js`, and a generated `catalog.js`. Run

```bash
node HYPER-CORE/tools/test-quantum.js
node HYPER-CORE/tools/validate.js HYPER-FEYNMAN --final
node HYPER-CORE/tools/simtest.js HYPER-FEYNMAN
node HYPER-CORE/tools/catalog.js --all
```
