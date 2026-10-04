# Hyper Optics — authoring guide

This is the guide for writing a topic of Hyper Optics. Read **`HYPER-CORE/AUTHORING.md` first, lines 1–290**
(the format of a concept, text and TeX, the backslash trap, formulas as calculators, examples and quizzes,
simulations and the kit) and its last section, *Checking your work*. The sections in between belong to other
apps. This file adds what is special here: the `terms` of every page, the optics engine and the drawing kit,
and the rules of the subject. Then read the three reference pages and their simulations —
`content/reference.js` and `sims/reference.js` — they set the depth, tone and layout.

Plain JavaScript, no build step, no libraries, no network at run time. **All text must be original**: write
every explanation, example and question yourself; do not fetch or paraphrase any web page, book or catalogue.
Standard physics, formulas, constants and published dimensions (a flange distance, a thread) are of course fine.

## Who reads it, and what a page is for

Dany asked for an app in which people **"start understanding terms and ways to understand how optical systems
and optical terms work"**. The reader is an intelligent person — an engineer, a technician, a photographer, a
student, someone who has just been handed a lens catalogue or an optician's prescription — who meets the
vocabulary of optics and wants to know what each term means, what it is for, and how the parts fit together.
So every concept page has, besides the explanation, key ideas, mix-ups, formulas, examples and quiz of any
Hyper page:

1. **Terms** (`terms: [...]`, 3–7 per page): the vocabulary the page introduces, each with a definition of one
   to three sentences that stands on its own, and the other names and abbreviations it goes by. They are shown
   on the page ("Terms on this page"), gathered into the **Optics dictionary** (Tools), and found by the search
   box. Abbreviations matter: AOI, FOV, EFL, BFL, NA, MTF, OD, AR, PBS, CRA … put them in `also`.
   ```js
   terms: [
     { term: 'Flange focal distance', also: ['FFD', 'flange back', 'register'],
       def: 'The distance from the mounting flange of a lens to the image plane. Lens and camera must be built to the same value.' },
     …
   ]
   ```
   Define a term on the page where it *belongs*; elsewhere, link to that page. If an abbreviation has two
   meanings (AOI: angle of incidence on a coating page, area of interest on a sensor page), each page defines
   its own sense and says so.
2. **A simulation** (`sim: 'id'`): optics is visual, and every page shows its idea. One simulation may serve
   two or three pages through `params` (`sim: { id: 'xx-lens', params: { mode: 'virtual' } }`); a topic of
   twelve pages needs about eight to ten simulations. Use the engine (`kit.optics`) for every number and the
   drawing kit (`kit.osym`) for every lens, ray and beam — never re-derive Snell's law or draw a lens by hand.
3. **Real numbers.** Typical values with their units, in a table where there are several: indices, focal
   lengths, f-numbers, pixel sizes, lumens per watt, dioptres, micrometres. Say where a number comes from
   ("typical of…", the standard that fixes it). A page about a *thing* (a mount, a lamp, a connector, a test
   chart) gives its dimensions and what fits what; a page about a *method* says what is measured, with what,
   and what the result looks like.
4. **Where you meet it** (`applications: [...]`, 3–5 items) and, where the idea has a story, `history`.
5. **Sources** (`sources: [...]`, 2–4): the textbook chapter, handbook or standard behind the page. Cite only
   what you are sure exists: a book and chapter (Hecht, *Optics*; Born and Wolf, *Principles of Optics*; Smith,
   *Modern Optical Engineering*; Jenkins and White, *Fundamentals of Optics*; Saleh and Teich, *Fundamentals of
   Photonics*; Greivenkamp, *Field Guide to Geometrical Optics*; Kingslake, *Lens Design Fundamentals*;
   Macleod, *Thin-Film Optical Filters*; Siegman, *Lasers*; Wyszecki and Stiles, *Color Science*; Atchison and
   Smith, *Optics of the Human Eye*; Holst, *CCD Arrays, Cameras and Displays*; the *Handbook of Optics*), or a
   standard by number when you are sure of it (ISO 10110, ISO 12233, EMVA 1288, IEC 60825-1, ISO 8980,
   ISO 13666, CIE 15). Never invent a title, a chapter number or a standard number.

The validator warns when a page has no simulation, fewer than two terms, no applications or no sources.

A body runs **1800–3500 characters** with `###` subheadings: the idea and a concrete picture first, then the
formula, then what it means with numbers, then the subtleties and what it is confused with. British spelling
(colour, fibre, centre, metre, grey) with *-ize* (polarize, polarization, optimize). End with a `> [!key]`
callout that states the page in two sentences.

## Files

```
HYPER-OPTICS/
  content/outline.js            the branches, topics and planned concepts (do not edit)
  content/reference.js          the three reference concepts: snells-law, the-f-number, c-mount (do not edit)
  content/<topic>.js            your concepts                                   ← you write
  sims/reference.js             ref-snell, ref-fnumber, ref-cmount (do not edit)
  sims/<topic>.js               your simulations                                ← you write
  AUTHORING.md                  this file
HYPER-CORE/js/optics.js         kit.optics — materials, surfaces, paraxial optics, ray tracing, lens library
HYPER-CORE/js/optics-wave.js    kit.optics — thin films, diffraction, MTF, Gaussian beams, lasers, polarization
HYPER-CORE/js/optics-vision.js  kit.optics — light and lamps, colour, cameras, the eye, scanning, shaping, fibres
HYPER-CORE/js/opticsym.js       kit.osym   — drawing lenses, mirrors, rays, beams, waves, spectra
HYPER-CORE/tools/test-optics.js the engine's tests: 439 short examples of every function in use
```

Write only `content/<topic>.js` and `sims/<topic>.js` for your topic id. Do not edit the outline, the reference
files, anything in `HYPER-CORE`, `index.html`, or another writer's files; the integrator wires your files in.
Wrap the sims file in `(function () { 'use strict'; … })();`. Every simulation id starts with your **topic
code** (given in your brief), e.g. `tl-ray-diagram`.

**Ids.** Use the ids of your topic's `plan` in the outline, exactly. Concepts already written in
`content/reference.js` (`snells-law`, `the-f-number`, `c-mount`) are not to be written again. Link freely to
any planned id of the whole outline — `[[depth-of-field]]`, `[[the-airy-disk|Airy disc]]` — whether or not it
is written yet. Links to other apps (check the id exists in that app's `catalog.js`; the validator warns):

- `physics:` reflection plane-mirrors spherical-mirrors refraction total-internal-reflection dispersion
  thin-lenses lensmakers-equation magnification optical-instruments huygens-principle double-slit
  thin-film-interference single-slit-diffraction diffraction-grating resolution polarization brewsters-angle
  the-eye vision-correction color-vision color-mixing light-intensity electromagnetic-waves em-spectrum
  superposition blackbody-radiation photon photoelectric-effect lasers semiconductors pn-junction
- `math:` trig-functions inverse-trig similar-triangles conic-sections parabola ellipse matrices
  matrix-multiplication complex-numbers fourier-series logarithms logarithmic-scales normal-distribution
- `electronics:` leds photodiodes optocouplers optoelectronics transimpedance noise-snr sampling-nyquist adc pwm
- `projections:` the-camera-model field-of-view-and-focal-length camera-obscura fisheye-projections
  rectilinear-lens photography-lenses-and-projections tilt-shift-and-view-cameras cinema-and-anamorphic-lenses
  camera-calibration-and-homography anamorphosis photogrammetry augmented-and-virtual-reality
- `feynman:` least-time origin-of-refractive-index partial-reflection color-vision-feyn polarization-feyn
- `ergonomics:` lighting-levels glare-colour visual-ergonomics displays-design
- `motors:` incremental-encoders absolute-encoders servo-motors · `chemistry:` beer-lambert atomic-spectra ·
  `biology:` microscopy · `medicine:` vision

Use two to four **prerequisites** per page (they draw the concept map), mostly from your own topic and the
ones before it in the outline.

## Conventions

- **Wavelengths are in nanometres**, in air: 550 nm (green, the eye's peak, the default), 587.6 nm (helium d,
  the reference line of glass catalogues), 632.8 nm (helium–neon), 1064 nm, 1550 nm. Infrared in µm where
  that is the custom (10.6 µm).
- **Angles from the normal**, in degrees in the text and in controls, in radians inside `kit.optics`
  (`O.rad(deg)`, `O.deg(rad)`).
- **Signs.** For single lenses and mirrors use the "real is positive" lens equation
  $1/s_o + 1/s_i = 1/f$ (object distance positive in front, image distance positive behind a lens / in front
  of a mirror, $f > 0$ converging, $m = -s_i/s_o$) and say so on the page. Lens *prescriptions* and ray-transfer
  matrices use the Cartesian convention of lens-design software: light left to right, a radius positive when
  its centre of curvature is to the right, thicknesses measured to the next surface.
- **Symbols**: $n$ index, $V$ or $\nu_d$ Abbe number, $f$ focal length, $N$ f-number (not "F", not "f/#" in
  formulas), NA, $D$ aperture diameter, $P$ or $F$ power in dioptres (D), $m$ lateral magnification, $M$
  angular magnification, $\lambda$ wavelength, $R$ reflectance or radius (say which), $T$ transmittance,
  $\theta$ angles, $w_0$ beam waist, $z_R$ Rayleigh range, $\Phi$ flux, $E$ illuminance or irradiance, $L$
  luminance or radiance, $I$ intensity. Keep symbols distinct inside one formula (the validator warns).
- **Quantities for formulas** (`q:`): `length` (m, mm, µm, nm), `angle` (°, rad, mrad, µrad, ′, ″), `optpower`
  (D), `frequency` (Hz … THz), `energy` (J, eV), `power` (W, mW), `intensity` (W/m², mW/cm², W/cm², kW/cm² …
  for irradiance), `fluence` (J/cm²), `luminousflux` (lm), `luminousint` (cd, mcd), `illuminance` (lx, klx, fc),
  `luminance` (cd/m², nit), `efficacy` (lm/W), `radiance`, `radintensity` (W/sr), `solidangle` (sr),
  `spatialfreq` (lp/mm, cycles/mm), `angfreq` (cycles/°), `wavenumber` (lines/mm, 1/cm), `responsivity` (A/W),
  `lumexposure` (lx·s), `attenuation` (dB/km), `gain` (dB), `time` (s, ms, µs, ns, ps, fs), `ratio` (%),
  `temperature` (K), `prism` (Δ). Indices, f-numbers, magnifications, optical densities, Abbe numbers and
  counts have no `q`. Constants: `c`, `h`, `kB`, `sigma`, `bW`, `qe`, `Km` (683 lm/W).
  A variable may not be called `e` or `pi`. Empirical formulas with mixed units (a Hofstetter formula in years
  and dioptres) declare their variables with `q: false, unit: 'D'` so that no conversion is applied.
- **Names, not brands.** Describe technologies, standards and generic part types; do not promote makers or
  product lines. Glass type names (N-BK7, N-SF11, fused silica) and mount names (C-mount, F-mount, EF, E, Z) are
  the vocabulary and are fine. Never name `kit.optics`, a function or a `.js` file in reader-facing text (the
  validator warns): say "the ray bench", "the simulation below".

## The optics engine — `kit.optics` (`const O = kit.optics`)

Everything is tested in `HYPER-CORE/tools/test-optics.js`; read it for one-line examples of each call.
Wavelengths always in **nm**; angles in **radians**; lengths in metres unless stated (lens prescriptions and
camera functions in mm, pixel pitch in µm, layer thicknesses in nm).

**Wavelengths and materials**
```js
O.rad(deg)  O.deg(rad)  O.clamp  O.sinc  O.c
O.LINES                      // { F: 486.13, d: 587.56, C: 656.27, e: 546.07, g, h, i, D, r, s, t } nm
O.BANDS                      // [[id, name, from nm, to nm] …]: UV-C … far infrared     O.colourName(nm) -> 'green'
O.photonEnergy(nm) -> eV     O.frequency(nm) -> Hz
O.index('N-BK7', 550)        // refractive index; material id, a number (taken as is) or { nd, vd }
O.abbe('N-SF11')             // { nd, vd, nF, nC }      O.groupIndex(mat, nm)      O.glassCode(mat) -> '517642'
O.MATERIALS[id]              // { name, kind: 'glass'|'crystal'|'plastic'|'liquid'|'gas'|'ir'|'eye', range: [nm, nm], density, cte, dndt, note }
  // ids: air vacuum water N-BK7 N-K5 N-BAK4 N-SK16 N-SK2 N-LAK9 N-FK51A N-BAF10 F2 F5 N-SF5 N-SF10 N-SF11 N-SF6
  //      fused-silica CaF2 MgF2 sapphire diamond calcite-o calcite-e quartz-o quartz-e PMMA PC PS COP CR-39 trivex
  //      hi-1.60 hi-1.67 hi-1.74 crown-1.523 silicon germanium ZnSe ZnS cornea aqueous eye-lens vitreous
O.metalIndex('aluminium', 550) -> { n, k }      // aluminium silver gold copper chromium (approximate)
```

**One surface**
```js
O.snell(n1, n2, t1) -> t2 (NaN beyond the critical angle)   O.criticalAngle(n1, n2)   O.brewster(n1, n2)
O.fresnel(n1, n2, t1) -> { Rs, Rp, R (unpolarized), Ts, Tp, T, t2, tir, phaseS, phaseP, rs, rp }   // n2 may be { n, k }
O.normalR(n1, n2)            // reflectance head-on; n2 may be a metal's { n, k }
O.apparentDepth(d, nObject, nViewer)      O.plateShift(t, n, t1)       // sideways shift of a ray through a plate
     // note: O.index('air', nm) is 1.000277 — pass the number 1 where a textbook means "air = 1"
O.prism(n, apex, t1) -> { r1, r2, exit, delta, tir }      O.minDeviation(n, apex)      O.prismIndex(apex, dmin)
O.rainbow(n, order) -> { angle, incidence, deviation }    // order 1 (42°) or 2 (51°)
```

**Thin lenses and matrices**
```js
O.thinLens(f, so) -> { si, m, real, upright }             // real-is-positive; also O.mirrorImage(f, so)
O.lensmaker(n, R1, R2, d) -> f        O.twoLenses(f1, f2, d) -> { f, bfd, ffd, afocal }
O.shapeFactor(R1, R2)   O.bestFormShape(n)
const A = O.abcd;  A.free(d)  A.lens(f)  A.surface(n1, n2, R)  A.mirror(R)
A.mul(first, second, …)  A.apply(M, [y, u])  A.cardinal(M) -> { efl, bfd, ffd, Hfront, Hrear, afocal }  A.image(M, so) -> { si, m }
```

**Lens systems: exact ray tracing** (`const S = O.sys`)
```js
// a system: surfaces in order; R radius (0 = flat), t distance to the next surface, n the medium AFTER the surface,
// sd semi-diameter, k conic constant, A aspheric terms, stop: true on the aperture stop, mirror: true to reflect
const sys = { surfaces: [{ R: 62.8, t: 4, n: 'N-BK7', sd: 12.7, stop: true }, { R: -45.7, t: 2.5, n: 'N-SF5', sd: 12.7 }, { R: -128.2, n: 1, sd: 12.7 }],
              object: Infinity /* or the object distance */ };
O.lens('achromat')           // a library system (a fresh copy each call; its title is O.lens(id).name; the ids are Object.keys(O.LENSES)): biconvex plano-convex convex-plano-reversed
                             //   best-form meniscus biconcave achromat cooke-triplet double-gauss parabolic-mirror
                             //   spherical-mirror cassegrain eye      (all f = 100 mm except the triplet 50, the mirrors 1000, the eye)
O.design.singlet({ f, glass, q, D, t })   O.design.achromat({ f, D, crown, flint }) -> a system with .feasible (false when the two glasses are too alike: it then returns a singlet), .D (the diameter it could make), .dV, .powers
O.design.newtonian({ f, D })
O.design.cassegrain({ f1, m, b, D })   O.design.twoLens({ f1, f2, d })   O.design.zoom2(f1, f2, F) -> { d, bfd }
S.paraxial(sys, nm) -> { efl, bfd, ffd, zImage, m, epd, zEP, zXP, xpd, fno, fnoWorking, na, Hfront, Hrear, length, zs, stop, telecentricObject, telecentricImage }
     // z positions are measured from the first vertex; ffd is the distance of the front focal point in front of it. A stop at a focal plane
     // puts a pupil at infinity (zEP or zXP = Infinity, telecentric… = true); S.aim and S.fan2d handle it for a finite object
     // rays are aimed at the real stop (S.aim), so a bundle fills the stop exactly; rays cut off by another rim come back with ok: false, why: 'vignetted'
S.trace(sys, { p: [x, y, z], d: [l, m, n] }, nm) -> { pts, d, p, ok, why: ''|'miss'|'vignetted'|'tir', at }
S.aim(sys, px, py, field)                // a ray through the pupil point (px, py in −1…1); field: angle (rad) or object height
S.fan2d(sys, { nm, n, field, fill, zStart, zEnd }) -> [{ pts: [[z, y] …], ok }]    // meridional rays, ready to draw
S.spot(sys, { nm, field, rings, z }) -> { pts: [[x, y] …], cx, cy, rms, geo, n }  S.bestFocus(sys, { nm, field }) -> { z, rms, shift }
S.lsa(sys, nm, n) -> [[zone, dz] …]      S.rayFan(sys, { nm, field }) -> [[py, dy] …]      S.chromaticShift(sys, [nm …]) -> [[nm, dz] …]
S.seidel(sys, { nm, field }) -> { S1 spherical, S2 coma, S3 astigmatism, S4 Petzval, S5 distortion, C1, C2, W040 …, lsa, petzvalRadius }
S.vertices(sys)  S.indices(sys, nm)  S.sag(surface, r)  S.elements(sys)  S.scale(sys, k)  S.withFocal(sys, f)  S.at(trace, z)  S.axisCrossing(trace)
```

**Thin films, interference, diffraction, MTF**
```js
O.film.stack({ n0: 1, ns: 'N-BK7', layers: [{ n: 'MgF2', d: 99.6 /* nm */ }] }, nm, theta, pol) -> { R, T, A, Rs, Rp, Ts, Tp }
O.film.spectrum(def, lo, hi, steps, theta) -> [{ nm, R, T, Rs, Rp }]      O.film.quarterWave(n, nm) -> thickness in nm
O.film.design(id, nm0, ns)   // uncoated mgf2 vcoat bbar hr hr4 bandpass longpass shortpass splitter splitter30 aluminium enhancedAl silver gold
O.film.COATING_MATERIALS     // MgF2 SiO2 Al2O3 HfO2 ZrO2 Ta2O5 TiO2 ZnS … with n
O.etalon({ R, d, nm, n, theta }) -> { T, finesse, fsrNm, fsrHz, fwhmNm }
O.besselJ0(x)  O.besselJ1(x)  O.jinc(x)  O.fresnelCS(x) -> [C, S]
const D = O.diff;  D.singleSlit(a, nm, theta)  D.doubleSlit(a, d, nm, theta)  D.nSlits(N, a, d, nm, theta)      // relative intensity
D.airy(x)  D.encircled(x)  D.airyRadius(nm, N) -> m  D.rayleighAngle(nm, D) -> rad  D.abbe(nm, NA)  D.dawes(D)
D.grating({ linesPerMm, nm, thetaI, m }) -> rad or NaN   D.gratingOrders({…})   D.resolvingPower(m, N)   D.angularDispersion({…})   D.littrow({…})
D.fresnelNumber(a, L, nm)  D.knifeEdge(u)  D.coherenceLength(nm, dnm)  D.fringeSpacing(nm, d, L)  D.twoBeam(I1, I2, phase, gamma)  D.visibility  D.zoneRadius(k, f, nm)
const M = O.mtf;  M.cutoff(nm, N) -> cycles/mm   M.diffraction(nu, nm, N)   M.pixel(nu, pitchUm)   M.motion(nu, blurMm)   M.defocus(nu, blurMm)
M.gaussian(nu, sigmaMm)   M.nyquist(pitchUm)   M.system(nu, [f1, f2 …])   M.mtf50(f, max)   M.contrast(max, min)   M.usaf(group, element) -> lp/mm
```

**Beams, lasers, polarization**
```js
const B = O.beam;  B.rayleigh(w0, nm, M2)  B.w(z, w0, nm, M2)  B.R(z, …)  B.divergence(w0, nm, M2)  B.gouy  B.bpp
B.focus({ w, f, nm, M2 }) -> { w0, zR, dof }   B.lens({ w0, s, f, nm }) -> { w0, s, m }   B.train({ w0, z0, nm, M2 }, [{ z, f }]) -> { w(z), segments }
B.throughAperture(a, w)   B.peakIrradiance(P, w)
const L = O.laser;  L.g(len, R)  L.stable(g1, g2)  L.modeSpacing(len)  L.cavityWaist(len, R1, R2, nm)  L.thresholdGain
L.CLASSES  L.classOf(watts)  L.mpe(t) -> { H, E }  L.nohd(P, divergence, a, mpe)  L.od(exposure, limit)
O.LASERS  // [{ id, name, family: 'gas'|'solid'|'semiconductor'|'fibre'|'liquid', nm: […], mode, power, pump, uses }]   O.laserById('hene')
const P = O.pol;  P.vec('H'|'V'|'D'|'A'|'R'|'L'| angle)  P.polarizer(t)  P.retarder(delta, t)  P.qwp(t)  P.hwp(t)  P.rotator(t)
P.apply(M, v)  P.chain(v, [M …])  P.intensity(v)  P.stokes(v) -> [S0, S1, S2, S3]  P.ellipse(v) -> { azimuth, ellipticity, handed }
P.malus(t)  P.dop(S)  P.mueller.polarizer(t) / .retarder(delta, t) / .depolarizer(f) / .apply(M, S)  P.byReflection(n1, n2, t1)  P.retardance(d, dn, nm)
```

**Light, colour, lamps**
```js
const Ph = O.photo;  Ph.V(nm)  Ph.Vscotopic(nm)  Ph.efficacy(nm) -> lm/W  Ph.planck(nm, T)  Ph.wien(T) -> nm  Ph.ler(spectrum) -> lm per optical watt
Ph.illuminance(cd, d, theta)  Ph.solidAngle(half)  Ph.candelaFromLumens(lm, half)  Ph.luminanceOfSurface(E, rho)  Ph.etendue(area, half, n)
Ph.imageIlluminance(L, N, T, m, theta)  Ph.LEVELS  Ph.LUMINANCES
Ph.spectrum('led-warm') -> function of nm     // incandescent halogen candle sun daylight xenon led-warm led-neutral led-cool fluorescent cfl mercury
                                              // metal-halide sodium-hp sodium-lp led-red led-amber led-green led-blue led-rgb led-uv led-ir laser-red laser-green hene equal
O.LAMPS   // [{ id, name, family, efficacy: [lo, hi] lm/W, cct, cri, life, start, spectrum, note }]     O.BASES (E27 GU10 G13 …)     O.BULBS (A60, MR16, T8 …)
O.DETECTORS   // [{ id, name, range: [nm, nm], peak, note }]: eye silicon pmt germanium ingaas pbs insb mct bolometer thermopile
const Cl = O.colour;  Cl.cmf(nm) -> [x̄, ȳ, z̄]  Cl.locus(nm) -> [x, y]  Cl.xyz(spectrum) -> [X, Y, Z]  Cl.xy(XYZ)  Cl.toRgb(XYZ)  Cl.fit(linear, 1)  Cl.srgb(linear) -> [r, g, b]  Cl.css(linear)
Cl.wavelength(nm) -> [r, g, b]   Cl.nmCss(nm, alpha)   Cl.cct(x, y)   Cl.cctDuv(x, y) -> { cct, duv, white }   Cl.planckXY(T)   Cl.lab(XYZ)   Cl.fromLab(lab)   Cl.deltaE(lab1, lab2)   Cl.mix([[r,g,b] …])
     // use Cl.cctDuv when a light may not be white (a coloured LED, a laser, a sodium lamp): Cl.cct gives a number for anything;  Ph.SOURCES[id].invisible marks the UV and IR sources
Cl.munsell(hue 0…100, value, chroma) -> { rgb, inGamut }   Cl.munsellParse('5R 4/14')   Cl.munsellName(h, V, C)   Cl.MUNSELL_HUES   (approximate: via CIELAB)
Cl.cvd([r, g, b], 'protan'|'deutan'|'tritan'|'achroma', severity 0…1) -> [r, g, b]     Cl.CVD_INFO
O.od(T)  O.transmittance(od)  O.beer(alpha, d)  O.dB(ratio)
```

**Cameras, the eye, scanning, shaping, fibres**
```js
const C = O.cam;  C.SENSORS  C.sensor('2/3"') -> { w, h, diag, crop }   C.MOUNTS  C.mount('C') -> { ffd, fit, throat, sensor, use }   C.adapter(lens, body)
C.fov({ f, sensor, distance }) -> { h, v, d (rad), W, Hh, m }   C.focalFor(w, W, dist)   C.coc(diag)   C.hyperfocal(f, N, c)   C.dof({ f, N, s, c }) -> { near, far, total, H }
C.dofMacro(N, c, m)  C.depthOfFocus(N, c)  C.magnification(f, s)  C.extension(f, m)  C.workingFNumber(N, m)  C.ev(N, t, iso)  C.exposureTime(N, ev, iso)  C.STOPS
C.photons({ lux, t, pitch })  C.snr({ photons, qe, read, dark, t })  C.dynamicRange(fullWell, read)  C.dataRate(w, h, bits, fps)  C.motionBlur(v, t, m, pitch)
C.lineRate  C.distortion(r, k1, k2)  C.cos4(theta)  C.pixelsOnTarget  C.digitalZoom(w, h, z, f)  C.resample(samples, n, 'nearest'|'linear'|'cubic')
const E = O.eye;  E.DATA  E.FIELD  E.CONES  E.accommodation(age) -> { min, avg, max }  E.farPoint(K)  E.nearPoint(K, A)  E.vertex(F, d1, d2)
E.transpose({ sph, cyl, axis })  E.sphericalEquivalent  E.meridian(rx, deg)  E.prentice(F, cm)  E.letterHeight(d, denominator)  E.logmar  E.snellen
E.blurAngle(D, pupilMm)  E.acuityFromDefocus(D)  E.pupil(cd/m²)  E.csf(cpd)  E.diffractionLimitCpd  E.spectacleMag  E.pal(x, y, { add, corridor }) -> { add, cyl }
const Sc = O.scan;  Sc.galvoOptical  Sc.polygon({ facets, rpm })  Sc.resolvableSpots(theta, D, nm)  Sc.fTheta  Sc.fTan  Sc.aod({ df, v, D, nm })
Sc.triangulation({ z, p, f, b })  Sc.tof(t)  Sc.tofResolution(dt)  Sc.phaseRange(fmod)  Sc.dpiPitch(dpi)  Sc.confocalAxial(nm, NA)  Sc.depthFromDisparity
const Sh = O.shape;  Sh.fanAngle(D, f)  Sh.lineProfile(u, 'gaussian'|'powell')  Sh.axicon({ alpha, n, w, nm })  Sh.superGaussian(r, w, order)  Sh.homogenizer(p, fLA, fFL)
Sh.doeAngle(m, d, nm)  Sh.maxConcentration(theta, n, dim)  Sh.cpc(a, theta)  Sh.fresnelFacet(r, f, n)  Sh.pinhole(nm, f, w)  Sh.expander(f1, f2)
const F = O.fibre;  F.na(n1, n2)  F.acceptance(na)  F.V(a, nm, na)  F.modes(V)  F.cutoff(a, na)  F.mfd(a, V)  F.loss(dBkm, km)  F.modalDispersion  F.TYPES  F.CONNECTORS  F.POLISH
```

If something you need is missing or looks wrong, do **not** work around it silently and do not edit the
engine: write what you needed in your report. A small helper local to your sims file is fine.

## Drawing — `kit.osym` (`const S = kit.osym`)

Every function takes the canvas context first. Colours come from the theme; pass `nm` to colour light by its
wavelength. Positions are canvas pixels. `sims/reference.js` shows them in use.

```js
S.nm(nm, alpha) -> css colour            S.glass(alpha)  S.edge()  S.metal()      // theme-aware tints
const m = S.map(st, zMin, zMax, yHalf, { left, right, top, bottom, stretch })   // optical coordinates -> pixels: m.X(z), m.Y(y), m.s, m.sy, m.y0
     // stretch: 4 lets heights be drawn up to 4× larger than lengths (long thin systems); say so on the figure (m.stretch is the factor used)
S.axis(ctx, x1, y, x2)                                         // the optical axis (chain line)
S.ray(ctx, [[x, y], …], { nm | color, width, alpha, arrows, dash, extend })     S.virtual(ctx, x1, y1, x2, y2)   // dashed back-projection
S.normal(ctx, x, y, angle, len)   S.angle(ctx, x, y, r, a0, a1, 'θ')   S.dim(ctx, x1, y1, x2, y2, 'f = 100 mm')   S.text(ctx, str, x, y, { size, color, align })
S.lens(ctx, x, y, h, { f } | { R1, R2, t })                    // a glass element with real surfaces; x is its front vertex
S.thinLens(ctx, x, y, h, f, { foci, label })                   // the textbook symbol: arrows out (converging) or in (diverging)
S.mirror(ctx, x, y, h, { R, back })   S.flatMirror(ctx, x1, y1, x2, y2)
S.system(ctx, sys, m)   S.rays(ctx, O.sys.fan2d(sys, {…}), m, { nm })           // a whole prescription and its rays under a map
S.stop(ctx, x, y, h, gap)   S.screen(ctx, x, y, h, { label })   S.sensor(ctx, x, y, h)   S.object(ctx, x, y, h, { dash, label })   // the object/image arrow
S.eye(ctx, x, y, r, { dir })   S.source(ctx, x, y, { kind: 'point'|'bulb'|'led'|'laser'|'sun'|'candle' })
S.prism(ctx, x, y, size, apex) -> corners   S.block(ctx, x, y, w, h)   S.poly(ctx, pts)   S.splitter(ctx, x, y, size)   S.plate(ctx, x, y, len, angle)
S.polarizer(ctx, x, y, h, angle)   S.grating(ctx, x, y, h)   S.slits(ctx, x, y, h, [[y1, y2] …])   S.fibre(ctx, pts)
S.beam(ctx, x1, x2, y, x => halfWidth, { nm })   S.wave(ctx, x1, y1, x2, y2, { wavelength, amp, phase, nm })   S.wavefronts(ctx, cx, cy, r0, dr, n, a0, a1)
S.spectrum(ctx, x, y, w, h, 380, 780, { ticks: true })          // the visible spectrum as a bar
S.fringes(ctx, x, y, w, h, u => intensity, { nm })              // a striped pattern on a screen (u from 0 to 1)
S.cells(ctx, x, y, w, h, nx, ny, (u, v) => intensity | [r, g, b])   // a picture made of cells (a sensor's pixels, a colour chart)
S.image(ctx, x, y, w, h, nx, ny, (u, v) => intensity | [r, g, b], { nm, gamma, smooth, key, id })   // a smooth picture of nx × ny pixels (round fringes, an Airy pattern, speckle, a blurred scene)
     // pass key: a string of everything the picture depends on (e.g. [V.nm, V.N, V.mode].join()) and it is recomputed only when the key changes —
     // essential in a loop that runs every frame; id tells two pictures of the same size on one stage apart
S.spot(ctx, spot, cx, cy, half, scale, { airy })                // a spot diagram from O.sys.spot
```

## Simulations — what a good one looks like here

Everything in `HYPER-CORE/AUTHORING.md` applies (`kit.stage`, `kit.controls`, `kit.readout`, `kit.loop`,
`kit.drag`, `kit.plot`, theme colours only, both themes, no libraries, `mount` must not throw).

- **Static pictures redraw on demand**: build the loop, call `loop.once()` after every control change and on
  resize (`st.onResize(() => loop.once())`), as the three reference sims do. Run the loop continuously
  (`loop.start()`) only when something moves by itself — a wave travelling, a polygon spinning, a shutter
  curtain crossing.
- **Show the light.** Rays coloured by wavelength, as bright as they are; lenses as glass; the image where it
  forms. Label what is drawn; put the numbers in the read-out with units.
- **Let the reader pull something** with `kit.drag`: the object, a lens, a mirror, the stop, the incoming ray.
- **One idea per simulation**, three to six controls, and a blurb with a *Try this* list of three or four
  things to do and what to notice.
- For a pattern on a screen (fringes, an Airy disc, a spectrum, an eye chart blurred, a sensor's pixels) use
  `S.fringes`, `S.cells` or `S.spectrum`; for a graph beside the picture use `kit.plot`.
- **Honest physics.** Trace real rays through real surfaces (`O.sys`) when the page is about aberrations,
  pupils, f-number or a lens form; use the thin-lens formulas (`O.thinLens`) when it is about the lens equation.
  Say in the blurb when a picture is schematic.
- Perception pages (illusions, colour appearance, acuity) *are* the demonstration: draw the figure and give
  the reader the control that reveals the truth (slide the arrowheads away, cover the surround, show the ruler).

## Rules of the subject

- **Laser and light safety.** Wherever a page invites the reader to use a laser, a strong LED, UV or the Sun,
  give the hazard in a `> [!warn]` callout: never look into a beam or its specular reflection; laser classes and
  eyewear are explained in [[laser-safety-classes]] and [[laser-eye-hazards-and-eyewear]]; never view the Sun
  through any instrument without a certified solar filter over the front; UV-C and UV-B injure eyes and skin.
  Do not give instructions for defeating interlocks, building or modifying lasers above Class 2, or pointing
  lasers at aircraft, vehicles or people.
- **Eyes and health — explain, never diagnose or prescribe.** The pages on vision, deficiencies, optometry,
  spectacles, contact lenses and surgery say how things work, what is measured and what the numbers mean; they
  do not tell the reader what they have or what to buy or do. Treatment decisions belong with an optometrist
  or ophthalmologist. Where a condition can threaten sight, give the warning signs in a `> [!warn]` callout
  ending "seek urgent eye care" (sudden loss of vision, flashes and floaters, a curtain over the view, a painful
  red eye, haloes with headache and nausea). Prevalence and risk figures are approximate and dated ("WHO
  estimate, 2019"). People-first language ("a person with low vision", "colour-vision deficiency" rather than
  "colour blind people"). Figures are schematic, never graphic.
- **Standards and numbers are quoted as typical and dated**, never reproduced wholesale.
- **Mains lamps and high voltages**: discharge lamps, flash units and laser power supplies hold dangerous
  voltages; relamping and repair follow the maker's instructions; mercury lamps are disposed of as hazardous
  waste.

## Checks you must run (0 errors required; read the warnings)

```
node --check HYPER-OPTICS/content/<topic>.js
node HYPER-CORE/tools/validate.js HYPER-OPTICS --only content/<topic>.js,sims/<topic>.js
node HYPER-CORE/tools/simtest.js HYPER-OPTICS --only sims/<topic>.js
```

Notes about *planned concepts not written yet* are expected. Fix every error and every warning that is yours
(no simulation, fewer than two terms, no applications, no sources, a symbol missing from a formula's tex, a
short body, a formula that does not solve back). To look at a page before it is wired in:
`http://localhost:8172/HYPER-OPTICS/index.html?extra=content/<topic>.js,sims/<topic>.js#/c/<id>` — but other
writers share the browser, so the two command-line checks are what must pass; do not start or stop servers.

Write the content file **in parts** (create it with the first three or four concepts, then append the rest
with further edits) rather than in one enormous write, and run `node --check` as you go.

## Tools to link to

`[the ray bench](#/tools/bench)` (lenses, mirrors and stops on an axis), `#/tools/lenslab` (real prescriptions:
layout, spots, ray fans, Seidel sums, glass), `#/tools/camera` (sub-pages `fov`, `dof`, `sensor`, `mounts`,
`exposure`, `mtf`), `#/tools/coatings` (`stack`, `fresnel`, `glass`, `filters`), `#/tools/colour` (`spectrum`,
`cie`, `munsell`, `mixing`, `deficiency`), `#/tools/eyelab` (`eye`, `prescription`, `acuity`, `progressive`),
`#/tools/beams` (`gaussian`, `resonator`, `diffraction`, `grating`, `lasers`), `#/tools/illusions`,
`#/tools/dictionary`.
