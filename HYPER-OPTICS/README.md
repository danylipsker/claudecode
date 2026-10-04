# Hyper Optics

Light and everything built to handle it — the sixteenth Hyper app, on the same engine as the others
(`../HYPER-CORE`). Rays, reflection, refraction and Snell's law; lenses, stops, the f-number, aberrations
and the doublets and triplets that correct them; interference, diffraction, gratings and polarization;
glasses, coatings, filters, beam splitters and the catalogue parts; cameras, CCD and CMOS sensors, the C,
CS, F and other mounts, field of view, focus, optical and digital zoom, shutters and MTF; lamps, bulbs,
bases, ferrules, illumination and optical fibres; lasers, their families, Gaussian beams and the shaping
of a beam into points, lines and patterns; the eye, its deficiencies, the optometrist's methods,
spectacles and multifocal lenses; colour and the Munsell system; instruments, scanners and optical
measurement; illusions and phenomena; and a last branch that reads whole optical systems part by part.

It is written for people who meet the words before the physics. Every page has a **Terms on this page**
panel, and the terms of all pages make one searchable **Optics dictionary** (2,848 terms with their
other names and abbreviations — AOI in its three meanings, OD, MTF, NA, EFL, BFL …).

Every concept page gives the idea in plain words, **formula calculators** that solve for any variable
with units, a **simulation** to play with, worked examples, a quiz with explained answers, where the
thing is used, its history and sources.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-OPTICS/>. No installation, no network.

## What is in it

**503 concepts** in 11 branches and 42 topics, with **1,562 formula calculators**, **478 simulations**
(used 529 times), **2,515 quiz questions**, **975 worked examples** and **2,848 dictionary terms** — all
original text.

| Branch | Concepts | Topics |
|---|---:|---|
| Light and Rays | 34 | what light is · reflection and mirrors · refraction and Snell's law |
| Lenses and Image Formation | 60 | thin lenses and images · stops, pupils and first-order optics (the f-number) · aberrations · correcting aberrations · lens families (doublets, triplets, double Gauss, zoom, telecentric) |
| Waves, Interference and Diffraction | 35 | interference · diffraction and gratings · polarization |
| Materials, Coatings and Components | 37 | optical materials · coatings and filters · optical components (windows, mirrors, prisms, beam splitters, mounts) |
| Cameras, Sensors and Lenses | 72 | the camera (exposure, shutters) · image sensors (CCD, CMOS) · field of view, focus and zoom · lens mounts and lens data (C, CS, S, F and others) · image quality and MTF · machine vision |
| Light Sources and Illumination | 47 | measuring light · lamp families (bulbs, bases, LEDs) · illumination optics (reflectors, light guides, ferrules) · optical fibres |
| Lasers and Beam Shaping | 48 | how lasers work (and laser safety) · laser families · Gaussian beams · shaping beams (points, lines, flat tops, diffractive elements, pattern projectors) |
| The Eye and Vision | 66 | the eye as an optical system · colour (CIE, Munsell) · visual deficiencies · the optometrist's methods · spectacles and contact lenses (bifocal, progressive) |
| Instruments and Scanning | 48 | optical instruments · scanning devices · scanners at work · measuring with light, measuring optics |
| Illusions and Phenomena | 24 | visual illusions · phenomena and optical tricks |
| Optical Systems at Work | 32 | how to read an optical system · everyday systems · industrial and scientific systems |

The pages about the eye, its conditions and its examination explain how things work; they say so, and
they are not medical advice.

### The labs (Tools)

- **Ray bench** — lenses on a bench with exact ray tracing, a curved mirror, and prisms and blocks.
- **Lens lab** — the layout and rays of real prescriptions (singlets, achromat, Cooke triplet, double
  Gauss, mirrors, the eye), their aberrations, bending a singlet, and an achromat designer.
- **Camera & lens** — field of view, depth of field, sensors and pixels, lens mounts and adapters,
  exposure, MTF and sampling.
- **Coatings & glass** — a coating designer (the thin-film stack and its spectrum), reflection at a
  surface, the glass map, filters and optical density.
- **Colour lab** — a light and its spectrum, the chromaticity diagram, the Munsell wheel, mixing, and
  colour-vision deficiency.
- **Eye & glasses** — the eye and its correction, reading a prescription, acuity and blur, progressive
  lenses, the field of view.
- **Lasers & beams** — the Gaussian beam, the laser cavity, slits and apertures, the diffraction grating,
  shaping a beam, laser families and safety.
- **Illusions** — 27 figures in seven groups, each with a control that proves the illusion.
- **Optics dictionary** — every term of every page, with its other names, searchable.

## How it is built

The discipline shares the engine in `../HYPER-CORE`. The optics code is on `Hyper.optics` (`kit.optics`
in a simulation), in three files, with a drawing kit for optical figures:

| File | What it holds |
|---|---|
| `HYPER-CORE/js/optics.js` | materials and dispersion, Snell and Fresnel, thin lenses, ray matrices, the exact ray tracer for lens prescriptions (pupils, spot diagrams, Seidel sums), designs and a small lens library |
| `HYPER-CORE/js/optics-wave.js` | thin-film stacks, diffraction and gratings, MTF, Gaussian beams, laser cavities and safety, polarization (Jones, Stokes, Mueller) |
| `HYPER-CORE/js/optics-vision.js` | colour (CIE, CIELAB, Munsell, colour-vision deficiency), photometry and light sources, lamps and bases, cameras and mounts, the eye and spectacles, scanning, beam shaping, fibres |
| `HYPER-CORE/js/opticsym.js` | `kit.osym`: lenses, mirrors, rays, prisms, stops, sensors, beams, spectra, fringes |
| `HYPER-CORE/js/ui/optics-*.js`, `optictools.js` | the labs and the dictionary |

Conventions: wavelengths in nanometres, angles in radians inside the code, prescriptions in millimetres.
Writers' rules, the engine reference and the content format are in [AUTHORING.md](AUTHORING.md).

A concept may carry `terms: [{ term, also: [...], def }]`; these make the panel on the page, the
dictionary and the search index.

## Checks

From the repository root:

```bash
node HYPER-CORE/tools/test-optics.js
```

```bash
node HYPER-CORE/tools/labtest.js
```

```bash
node HYPER-CORE/tools/validate.js HYPER-OPTICS --final
```

```bash
node HYPER-CORE/tools/simtest.js HYPER-OPTICS
```

`validate` and `simtest` take `--only <topic>` (for example `--only polarization`) to check one topic.
After adding or removing a page, regenerate the catalog that the other apps use for cross-links:

```bash
node HYPER-CORE/tools/catalog.js --all
```

In a browser, `HYPER-CORE/tools/selftest-browser.js` visits every page and mounts every simulation.

## What to know

- Numbers on the pages come from the engine or from checked calculations. Several simulations use
  simplified models (a schematic spectrum, a typical lamp, a model progressive lens); their captions say so.
- Typical figures (damage thresholds, lamp efficacies, clinical ranges, prevalence) are given as typical
  and are not a substitute for a data sheet or a clinician.
- The engine's white-LED spectra, scotopic curve and "daylight" source are simple approximations; pages
  that need better use their own models and say so.
- Laser-safety numbers are calculated for visible continuous light only; other cases are described in text.
- Sources are cited by author and title. They were written from the writers' knowledge of the literature
  and have not been checked line by line against the publications.
