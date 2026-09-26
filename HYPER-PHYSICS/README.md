# Hyper Physics

Physics as a map of connected concepts, in the spirit of Rod Nave's HyperPhysics — with
every formula turned into a calculator, simulations to play with, and practice with
worked solutions. The structure is inspired by HyperPhysics; all text, questions and
simulations here are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-PHYSICS/>. No installation, no network.

## What is in it

**258 concepts** in 10 branches and 39 topics, with **711 live formulas**, **82 simulations**
(used 167 times across the pages), **1160 quiz questions** and **523 worked examples**.

| Branch | Concepts | Topics |
|---|---:|---|
| Mechanics | 71 | describing motion · forces and Newton's laws · work and energy · momentum and collisions · rotation · gravitation · oscillations · fluids · elasticity |
| Electricity & Magnetism | 46 | electrostatics · DC circuits · magnetism · induction · alternating current · electromagnetic waves |
| Light & Vision | 23 | geometric optics · wave optics · vision and colour |
| Heat & Thermodynamics | 23 | temperature and heat · heat transfer · gases and kinetic theory · laws of thermodynamics |
| Sound & Hearing | 18 | waves · sound · hearing and music (several simulations play real sound) |
| Relativity | 17 | special relativity · general relativity |
| Quantum Physics | 20 | birth of quantum physics · atoms · quantum mechanics |
| Nuclear & Particle Physics | 18 | the nucleus · radioactivity · nuclear reactions · particle physics |
| Condensed Matter | 9 | solids and electrons · magnetism and superconductivity |
| Astrophysics | 13 | the Sun and planets · stars · cosmology |

## A concept page

- **The map** — what it is part of, what it builds on, what it leads to, what it contains;
  every bubble is a link. Prerequisites in Hyper Math appear as dashed bubbles and open there.
- **Understand** — the explanation, key ideas, common mix-ups, a step-by-step derivation,
  where you meet it in real life.
- **Formulas** — each one a calculator: click any symbol (in the list or in the formula) to
  solve for it; type values in any unit or drag the sliders; the rearranged formula and
  any other roots are shown; **Graph** plots one variable against another; **Practice** asks a
  fresh problem from that formula with a worked solution.
- **Simulation**, **Worked examples** (revealed step by step), **Practice** (quick check,
  generated problems, flashcards), **Connections**, and **your notes**.

Elsewhere: the whole-discipline **map**, the **formula sheet**, **practice** (daily review,
by branch, formula drill, flashcards), **tools** (function plotter, calculator with the
constants, unit converter, constants, symbol glossary, A–Z index), **progress** and
**learning paths** (`#/path/<concept>`: the prerequisites in study order).

## Files

```
index.html          loads the engine (../HYPER-CORE), the content and the simulations
content/outline.js  the root, branches and topics, with the planned concepts
content/*.js        one file per topic
sims/*.js           the simulations
catalog.js          generated: titles for links from Hyper Math (HYPER-CORE/tools/catalog.js)
```

To add or change content, read `../HYPER-CORE/AUTHORING.md`, then check:

```bash
node HYPER-CORE/tools/validate.js HYPER-PHYSICS
node HYPER-CORE/tools/simtest.js HYPER-PHYSICS
node HYPER-CORE/tools/catalog.js --all
```
