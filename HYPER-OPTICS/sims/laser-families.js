/* HYPER-OPTICS · sims/laser-families.js — the families of lasers (prefix lz-).
 *   lz-map        the laser map in three views: the families on one wavelength axis, the common lines, the uses (power against wavelength)
 *   lz-discharge  a gas-discharge tube: electrons, excited atoms, spontaneous light, and the beam that appears above threshold
 *   lz-hene       the helium–neon laser: the energy transfer between helium and neon, and the modes under the Doppler-broadened gain
 *   lz-molecular  the carbon dioxide level ladder (nitrogen transfers its energy) and the excimer's potential curves
 *   lz-gain       the gain bandwidth of solid-state media and the shortest pulse each can make
 *   lz-diode      the elliptical, astigmatic beam of a diode laser and its spot on a screen
 *   lz-tuning     wavelength against temperature of a diode laser (mode hops), and the match to the absorption line of a pumped crystal
 *   lz-vcsel      the mirrors of a VCSEL: the reflectance of a stack of quarter-wave pairs against what the short gain region demands
 *   lz-fibre      a double-clad fibre laser: the pump absorbed along the fibre, the signal growing, the brightness gained
 *   lz-shg        second-harmonic generation: matched, mismatched and quasi-phase-matched growth, and the ladder of harmonics
 *   lz-target     what a target does to a laser line: metals absorb differently at each wavelength; windows pass or absorb
 * Wavelengths, photon energies, mode spacings, beam widths and mirror stacks come from kit.optics; the drawing is kit.osym.
 * Where a picture is schematic (level energies, the potential curves, pumping models) its blurb says so.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * Math.PI;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const vis = nm => nm >= 380 && nm <= 780;
  const nmText = nm => nm >= 1000 ? (nm / 1000).toFixed(nm >= 10000 ? 1 : 2) + ' µm' : (Math.abs(nm - Math.round(nm)) < 0.05 ? String(Math.round(nm)) : nm.toFixed(1)) + ' nm';
  const FAM = [['gas', 'Gas'], ['solid', 'Solid-state'], ['semiconductor', 'Semiconductor'], ['fibre', 'Fibre'], ['liquid', 'Dye (liquid)']];
  const famIdx = f => Math.max(0, FAM.findIndex(x => x[0] === f));
  const famName = f => FAM[famIdx(f)][1];
  const short = l => l.name.replace(/ \(.*\)$/, '');
  /* a dot in the colour of the wavelength; a ring when the light is invisible */
  function marker(c, S, C, x, y, r, nm, line) {
    c.beginPath(); c.arc(x, y, r, 0, TAU);
    if (vis(nm)) { c.fillStyle = S.nm(nm); c.fill(); if (line) { c.lineWidth = 1.4; c.strokeStyle = line; c.stroke(); } }
    else { c.fillStyle = C.bg2; c.fill(); c.lineWidth = 1.6; c.strokeStyle = S.nm(nm); c.stroke(); }
  }

  /* the common laser lines, for the map: wavelength, name, family, how it is made, what it does */
  const LINES = [
    { nm: 193, name: 'ArF excimer', fam: 'gas', how: 'argon fluoride excimer, pulsed discharge', uses: 'Chip lithography (immersion scanners) and laser eye surgery.' },
    { nm: 248, name: 'KrF excimer', fam: 'gas', how: 'krypton fluoride excimer, pulsed discharge', uses: 'Lithography of larger features, annealing, micromachining of polymers.' },
    { nm: 266, name: 'Nd:YAG, 4th harmonic', fam: 'solid', how: 'infrared doubled twice (1064 → 532 → 266 nm)', uses: 'Inspection of masks and wafers, micromachining, spectroscopy.' },
    { nm: 308, name: 'XeCl excimer', fam: 'gas', how: 'xenon chloride excimer, pulsed discharge', uses: 'Annealing silicon for displays, skin phototherapy.' },
    { nm: 325, name: 'Helium–cadmium', fam: 'gas', how: 'cadmium vapour in a helium discharge, continuous', uses: 'Lithography of gratings and masks, fluorescence, inspection.' },
    { nm: 355, name: 'Nd:YAG, 3rd harmonic', fam: 'solid', how: 'the sum of 1064 and 532 nm in a crystal', uses: 'Marking glass and plastics, cutting thin films, drilling circuit boards.' },
    { nm: 405, name: 'Blue-violet diode', fam: 'semiconductor', how: 'InGaN laser diode', uses: 'Blu-ray discs, fluorescence microscopy, resin 3-D printing.' },
    { nm: 450, name: 'Blue diode', fam: 'semiconductor', how: 'InGaN laser diode', uses: 'Projectors, welding of copper, stage lighting.' },
    { nm: 488, name: 'Argon ion, blue', fam: 'gas', how: 'argon-ion discharge (or a diode-pumped semiconductor laser)', uses: 'Confocal microscopy, flow cytometry.' },
    { nm: 514.5, name: 'Argon ion, green', fam: 'gas', how: 'argon-ion discharge', uses: 'Light shows, retinal treatment, spectroscopy.' },
    { nm: 532, name: 'Nd:YVO₄, doubled', fam: 'solid', how: 'infrared 1064 nm doubled in a crystal', uses: 'Green pointers, particle image velocimetry, holography, retinal treatment.' },
    { nm: 543.5, name: 'Helium–neon, green', fam: 'gas', how: 'neon transition in a helium–neon discharge', uses: 'Fluorescence microscopy, interferometry, teaching.' },
    { nm: 632.8, name: 'Helium–neon, red', fam: 'gas', how: 'neon transition in a helium–neon discharge', uses: 'Interferometry, alignment, length standards, holography, teaching.' },
    { nm: 650, name: 'Red diode', fam: 'semiconductor', how: 'AlGaInP laser diode', uses: 'DVD drives, pointers, barcode scanners, level lines.' },
    { nm: 694.3, name: 'Ruby', fam: 'solid', how: 'chromium ions in sapphire, flash-lamp pumped', uses: 'Holography of large scenes, tattoo removal; the first laser, 1960.' },
    { nm: 755, name: 'Alexandrite', fam: 'solid', how: 'chromium ions in chrysoberyl, flash-lamp or diode pumped', uses: 'Hair and tattoo removal.' },
    { nm: 780, name: 'Infrared diode', fam: 'semiconductor', how: 'AlGaAs laser diode', uses: 'CD drives, older laser printers, atomic physics with rubidium.' },
    { nm: 808, name: 'Pump diode', fam: 'semiconductor', how: 'AlGaAs diode bars and stacks', uses: 'Pumping Nd:YAG and Nd:YVO₄ lasers, hair removal.' },
    { nm: 850, name: 'VCSEL', fam: 'semiconductor', how: 'vertical-cavity surface-emitting diode', uses: 'Short data links on multimode fibre, optical mice.' },
    { nm: 905, name: 'Pulsed diode', fam: 'semiconductor', how: 'laser diode driven with nanosecond pulses', uses: 'Lidar and handheld laser rangefinders.' },
    { nm: 940, name: 'VCSEL array', fam: 'semiconductor', how: 'arrays of surface emitters', uses: 'Face recognition, time-of-flight sensing, infrared illumination.' },
    { nm: 976, name: 'Pump diode', fam: 'semiconductor', how: 'InGaAs laser diode', uses: 'Pumping ytterbium and erbium fibre lasers and amplifiers.' },
    { nm: 1064, name: 'Nd:YAG', fam: 'solid', how: 'neodymium ions in YAG, diode or lamp pumped', uses: 'Marking, welding, rangefinding, gravitational-wave detectors.' },
    { nm: 1070, name: 'Ytterbium fibre', fam: 'fibre', how: 'ytterbium-doped fibre, diode pumped', uses: 'Cutting, welding and marking of metals.' },
    { nm: 1310, name: 'Telecom diode', fam: 'semiconductor', how: 'InGaAsP laser diode', uses: 'Fibre links in the zero-dispersion window, optical coherence tomography.' },
    { nm: 1550, name: 'Telecom diode / Er fibre', fam: 'semiconductor', how: 'InGaAsP laser diode; erbium-doped fibre for amplifiers and lidar', uses: 'Long-distance fibre links, eye-safer lidar.' },
    { nm: 1940, name: 'Thulium fibre', fam: 'fibre', how: 'thulium-doped fibre, diode pumped', uses: 'Soft-tissue surgery, welding of clear plastics.' },
    { nm: 2940, name: 'Er:YAG', fam: 'solid', how: 'erbium ions in YAG, pulsed', uses: 'Dentistry and skin resurfacing: water absorbs it strongly.' },
    { nm: 3391, name: 'Helium–neon, infrared', fam: 'gas', how: 'neon transition in a helium–neon discharge', uses: 'Methane sensing and frequency standards.' },
    { nm: 4500, name: 'Quantum cascade', fam: 'semiconductor', how: 'quantum cascade laser (electrons stepping down a staircase of wells)', uses: 'Mid-infrared gas sensing.' },
    { nm: 10600, name: 'Carbon dioxide', fam: 'gas', how: 'molecular discharge in carbon dioxide, nitrogen and helium', uses: 'Cutting and engraving of non-metals, welding, surgery.' }
  ];
  /* uses: typical optical output (continuous, or average for pulsed lasers), to the order of magnitude */
  const USES = [
    { name: 'Laser pointer, red', nm: 650, p: 1e-3, fam: 'semiconductor', how: 'red laser diode', note: 'Class 2: 1 mW or less.' },
    { name: 'Laser pointer, green', nm: 532, p: 5e-3, fam: 'solid', how: 'diode-pumped Nd:YVO₄, frequency-doubled', note: 'Class 3R pointers are limited to 5 mW; the infrared must be filtered out.' },
    { name: 'Barcode scanner', nm: 650, p: 1e-3, fam: 'semiconductor', how: 'red laser diode', note: 'Class 1 or 2; the beam sweeps a line across the code.' },
    { name: 'Laser level', nm: 635, p: 1e-3, fam: 'semiconductor', how: 'red laser diode', note: 'Class 2 line and dot projectors: 1 mW or less.' },
    { name: 'Blu-ray drive', nm: 405, p: 5e-3, fam: 'semiconductor', how: 'blue-violet laser diode', note: 'A few milliwatts to read; tens of milliwatts, in pulses, to write.' },
    { name: 'Laser printer', nm: 780, p: 5e-3, fam: 'semiconductor', how: 'infrared laser diode', note: 'Sealed inside the machine, so Class 1 for the user.' },
    { name: 'Optical mouse', nm: 850, p: 5e-4, fam: 'semiconductor', how: 'VCSEL', note: 'Well under a milliwatt.' },
    { name: 'Data-centre link', nm: 850, p: 1e-3, fam: 'semiconductor', how: 'VCSEL', note: 'About a milliwatt or less per fibre.' },
    { name: 'Long-haul fibre link', nm: 1550, p: 2e-3, fam: 'semiconductor', how: 'telecom laser diode', note: 'A few milliwatts, then optical amplifiers along the way.' },
    { name: 'Interferometer, alignment', nm: 632.8, p: 2e-3, fam: 'gas', how: 'helium–neon laser', note: 'A milliwatt or two: Class 2 or 3R.' },
    { name: 'Automotive lidar', nm: 905, p: 2e-2, fam: 'semiconductor', how: 'pulsed laser diode', note: 'Pulses of tens of watts at the peak, tens of milliwatts on average.' },
    { name: 'Gas sensor', nm: 4500, p: 5e-2, fam: 'semiconductor', how: 'quantum cascade laser', note: 'Tens of milliwatts, tuned to an absorption line of the gas.' },
    { name: 'Laser marking', nm: 1064, p: 20, fam: 'fibre', how: 'pulsed fibre laser (a master oscillator and a fibre amplifier)', note: 'Nanosecond pulses; 20 to 50 W on average.' },
    { name: 'Eye surgery (LASIK)', nm: 193, p: 0.3, fam: 'gas', how: 'argon fluoride excimer laser', note: 'Pulses of about a millijoule, hundreds of times a second.' },
    { name: 'Retinal treatment', nm: 532, p: 0.5, fam: 'solid', how: 'frequency-doubled Nd:YVO₄', note: 'Tenths of a watt, in pulses of tens of milliseconds.' },
    { name: 'Multiphoton microscope', nm: 800, p: 1.5, fam: 'solid', how: 'titanium–sapphire laser', note: 'Femtosecond pulses; about a watt on average.' },
    { name: 'Light-show projector', nm: 520, p: 3, fam: 'semiconductor', how: 'red, green and blue laser diodes', note: 'A few watts in all: Class 4.' },
    { name: 'Chip lithography', nm: 193, p: 60, fam: 'gas', how: 'argon fluoride excimer laser', note: 'Kilohertz pulses; tens of watts on average at the source.' },
    { name: 'Cutting acrylic and wood', nm: 10600, p: 60, fam: 'gas', how: 'sealed carbon dioxide laser', note: 'Desktop engravers and cutters use tubes of 40 to 100 W.' },
    { name: 'Gravitational-wave detector', nm: 1064, p: 100, fam: 'solid', how: 'Nd:YAG oscillator with amplifiers', note: 'Tens to hundreds of watts of an extremely quiet, single-frequency beam.' },
    { name: 'Thick-plate cutting, CO₂', nm: 10600, p: 4000, fam: 'gas', how: 'fast-flow carbon dioxide laser', note: 'Several kilowatts.' },
    { name: 'Car-body welding', nm: 1030, p: 6000, fam: 'solid', how: 'thin-disk Yb:YAG laser', note: 'Several kilowatts (thin-disk or fibre lasers).' },
    { name: 'Sheet-metal cutting', nm: 1070, p: 8000, fam: 'fibre', how: 'ytterbium fibre laser', note: 'One to tens of kilowatts.' }
  ];

  /* ================================================================ the laser map */
  Hyper.sim('lz-map', {
    title: 'The laser map: families, lines and uses',
    blurb: `Lasers differ in what makes the light, and the gain medium decides the wavelength. One logarithmic axis, from the ultraviolet to the infrared, holds them all. A dot has the colour of its light; a **ring** is light you cannot see. Click a row or a dot to read the details.

**Try this**
- *Families*: the gas lasers cover the widest range, from 193 nm to 10.6 µm; the diodes crowd the near infrared; the fibre lasers sit in a narrow strip around 1 to 2 µm. Pick a family in the second control to highlight it.
- *Common lines*: from 193 nm to 10.6 µm, thirty-one lines you will meet. Notice how many of them are one of three infrared lines doubled or tripled in a crystal (532, 355 and 266 nm come from 1064 nm).
- *Uses*: power against wavelength. The machines that cut and weld sit at the top, in the kilowatts, at 1 µm and at 10.6 µm; the pointers, scanners and data links sit at the bottom, in milliwatts. The dashed lines show where the laser safety classes begin (they apply to visible, continuous beams only).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 500, maxH: 650 });
      let sel = null, rows = [], dots = [];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['The families, by gain medium', 'families'], ['The common lines and what they do', 'lines'], ['Uses: power against wavelength', 'uses']], value: params.view || 'families' },
        { id: 'fam', type: 'select', label: 'Highlight a family', options: [['All', 'all']].concat(FAM.map(f => [f[1], f[0]])), value: 'all' }
      ], id => { if (id === 'view') { sel = null; showSel(); } loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Selected'], ['nm', 'Wavelength'], ['e', 'Photon energy'], ['fam', 'Family'], ['how', 'How the light is made'], ['p', 'Typical power'], ['uses', 'Used for']]);
      const NM0 = 180, NM1 = 12000, LN = Math.log(NM1 / NM0);
      const pw = p => p < 1 ? (p * 1000 >= 1 ? p * 1000 : (p * 1000).toFixed(1)) + ' mW' : p >= 1000 ? p / 1000 + ' kW' : p + ' W';
      function showSel() {
        ro.show('p', V.view !== 'lines'); ro.show('e', true);
        if (!sel) { for (const k of ['nm', 'e', 'fam', 'how', 'p', 'uses']) ro.set(k, '—'); ro.set('name', 'click a row or a dot'); return; }
        if (sel.laser) {
          const l = sel.laser;
          ro.set('name', short(l)); ro.set('nm', l.nm.map(nmText).join(' · ') + '  (first = strongest)'); ro.set('e', O.photonEnergy(l.nm[0]).toFixed(3) + ' eV at ' + nmText(l.nm[0]));
          ro.set('fam', famName(l.family)); ro.set('how', 'pumped by ' + l.pump + ' · ' + l.mode); ro.set('p', l.power); ro.set('uses', l.uses);
        } else if (sel.line) {
          const l = sel.line;
          ro.set('name', l.name); ro.set('nm', nmText(l.nm) + ' (' + (vis(l.nm) ? O.colourName(l.nm) : 'invisible: ' + O.colourName(l.nm)) + ')'); ro.set('e', O.photonEnergy(l.nm).toFixed(3) + ' eV');
          ro.set('fam', famName(l.fam)); ro.set('how', l.how); ro.set('uses', l.uses);
        } else {
          const u = sel.use;
          ro.set('name', u.name); ro.set('nm', nmText(u.nm) + ' (' + (vis(u.nm) ? O.colourName(u.nm) : 'invisible: ' + O.colourName(u.nm)) + ')'); ro.set('e', O.photonEnergy(u.nm).toFixed(3) + ' eV');
          ro.set('fam', famName(u.fam)); ro.set('how', u.how); ro.set('p', pw(u.p)); ro.set('uses', u.note);
        }
      }
      showSel();
      // the wavelength strip: the visible spectrum painted on a logarithmic axis, shaded ultraviolet and infrared at its ends
      function strip(c, C, x0, x1, X, by, bh) {
        c.save(); c.globalAlpha = 0.5; c.fillStyle = S.nm(300); c.fillRect(x0, by, X(380) - x0, bh); c.fillStyle = S.nm(1000); c.fillRect(X(780), by, x1 - X(780), bh); c.restore();
        for (let x = Math.round(X(380)); x < Math.round(X(780)); x++) { c.fillStyle = S.nm(NM0 * Math.exp((x + 0.5 - x0) / (x1 - x0) * LN)); c.fillRect(x, by, 1.6, bh); }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0 + 0.5, by + 0.5, x1 - x0 - 1, bh - 1);
        for (const [nm, s] of [[200, '200 nm'], [300, '300'], [400, '400'], [500, '500'], [700, '700'], [1000, '1 µm'], [2000, '2'], [5000, '5'], [10000, '10 µm']]) {
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(X(nm), by + bh); c.lineTo(X(nm), by + bh + 4); c.stroke();
          kit.label(c, s, X(nm), by + bh + 13, { align: 'center', size: 10, color: C.muted });
        }
        kit.label(c, 'ultraviolet', X(255), by - 8, { align: 'center', size: 10, color: C.faint });
        kit.label(c, 'visible', (X(380) + X(780)) / 2, by + bh / 2, { align: 'center', size: 10, color: '#111', weight: 650 });
        kit.label(c, 'infrared', X(2800), by - 8, { align: 'center', size: 10, color: C.faint });
      }
      // the families and the common lines, one row each
      function drawRows(c, C, W, Hh) {
        const x0 = clamp(W * 0.23, 100, 175) + 6, x1 = W - 14, X = nm => x0 + (x1 - x0) * Math.log(nm / NM0) / LN;
        const by = 46, bh = 14;
        strip(c, C, x0, x1, X, by, bh);
        let items = [];
        if (V.view === 'families') FAM.forEach(f => { items.push({ head: f }); O.LASERS.forEach((l, i) => { if (l.family === f[0]) items.push({ laser: l, fam: f[0], nm: l.nm }); }); });
        else items = LINES.map(l => ({ line: l, fam: l.fam, nm: [l.nm] }));
        const top = by + bh + 26, rowH = clamp((Hh - top - 6) / items.length, 11, 22);
        for (const nm of [200, 300, 400, 500, 700, 1000, 2000, 5000, 10000]) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(nm), top - 2); c.lineTo(X(nm), top + rowH * items.length); c.stroke(); }
        rows = [];
        items.forEach((it, k) => {
          const y = top + rowH * (k + 0.5), f = it.head ? it.head[0] : it.fam, a = V.fam !== 'all' && V.fam !== f ? 0.28 : 1;
          const colour = C.series[famIdx(f) % C.series.length];
          c.save(); c.globalAlpha = a;
          if (it.head) {
            const all = O.LASERS.filter(l => l.family === f).flatMap(l => l.nm), lo = Math.min(...all), hi = Math.max(...all);
            c.fillStyle = colour; c.globalAlpha = a * 0.4; c.fillRect(X(lo), y - 4, Math.max(3, X(hi) - X(lo)), 8); c.globalAlpha = a;
            kit.label(c, it.head[1].toUpperCase(), 10, y, { size: 10.5, weight: 700, color: colour });
          } else {
            const on = sel && ((sel.laser && sel.laser === it.laser) || (sel.line && sel.line === it.line));
            if (on) { c.save(); c.globalAlpha = 0.16; c.fillStyle = C.accent; c.fillRect(6, y - rowH / 2, x1 - 6 + 8, rowH); c.restore(); }
            const nm0 = it.nm[0], nameTxt = it.laser ? short(it.laser) : it.line.name;
            kit.label(c, nameTxt.length > 26 ? nameTxt.slice(0, 25) + '…' : nameTxt, 14, y, { size: 11, color: on ? C.text : C.muted, weight: on ? 700 : 500 });
            if (it.line) kit.label(c, nmText(nm0), X(nm0) + (X(nm0) < (x0 + x1) / 2 ? 9 : -9), y, { size: 10, color: C.faint, align: X(nm0) < (x0 + x1) / 2 ? 'left' : 'right' });
            it.nm.slice().reverse().forEach((nm, j, a) => marker(c, S, C, X(nm), y, j === a.length - 1 ? 5 : 3, nm, j === a.length - 1 ? C.text : null));
            rows.push({ y0: y - rowH / 2, y1: y + rowH / 2, laser: it.laser, line: it.line });
          }
          c.restore();
        });
      }
      // power against wavelength, one dot per use
      function drawUses(c, C, W, Hh) {
        const x0 = 62, x1 = W - 14, X = nm => x0 + (x1 - x0) * Math.log(nm / NM0) / LN;
        const by = 40, bh = 12, top = by + bh + 34, bot = Hh - 14, LP0 = -4, LP1 = 5;
        const Y = p => top + (bot - top) * (1 - (Math.log10(p) - LP0) / (LP1 - LP0));
        strip(c, C, x0, x1, X, by, bh);
        FAM.forEach((f, i) => { const lx = x0 + i * Math.min(120, (x1 - x0) / 5); c.fillStyle = C.series[i % C.series.length]; c.fillRect(lx, 8, 9, 9); kit.label(c, f[1], lx + 13, 13, { size: 10.5, color: C.muted }); });
        for (let e = LP0; e <= LP1; e++) {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, Y(Math.pow(10, e))); c.lineTo(x1, Y(Math.pow(10, e))); c.stroke();
          kit.label(c, pw(Math.pow(10, e)), x0 - 6, Y(Math.pow(10, e)), { align: 'right', size: 10, color: C.muted });
        }
        for (const nm of [200, 300, 400, 500, 700, 1000, 2000, 5000, 10000]) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(X(nm), top); c.lineTo(X(nm), bot); c.stroke(); }
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1;
        for (const [p, s] of [[1e-3, 'class 2 up to 1 mW'], [5e-3, 'class 3R up to 5 mW'], [0.5, 'class 3B up to 500 mW, class 4 above']]) { c.beginPath(); c.moveTo(x0, Y(p)); c.lineTo(x1, Y(p)); c.stroke(); kit.label(c, s + ' (visible, continuous)', x1 - 4, Y(p) - 7, { align: 'right', size: 9.5, color: C.warn }); }
        c.restore();
        dots = []; const taken = [];
        USES.forEach(u => dots.push({ x: X(u.nm), y: Y(u.p), u }));
        for (const d of dots) {
          const dim = V.fam !== 'all' && d.u.fam !== V.fam, on = sel && sel.use === d.u;
          c.save(); if (dim) c.globalAlpha = 0.25;
          c.beginPath(); c.arc(d.x, d.y, 6, 0, TAU); c.fillStyle = C.series[famIdx(d.u.fam) % C.series.length]; c.fill(); c.lineWidth = 1.3; c.strokeStyle = C.bg2; c.stroke();
          if (on) { c.beginPath(); c.arc(d.x, d.y, 10, 0, TAU); c.lineWidth = 2; c.strokeStyle = C.text; c.stroke(); }
          c.restore();
        }
        // names beside the dots where they fit without covering another name
        for (const d of dots.slice().sort((a, b) => (sel && sel.use === b.u ? 1 : 0) - (sel && sel.use === a.u ? 1 : 0))) {
          const w = d.u.name.length * 5.5, hh = 11;
          for (const [rx, ry, al] of [[d.x + 9, d.y, 'left'], [d.x - 9, d.y, 'right'], [d.x, d.y - 14, 'center'], [d.x, d.y + 14, 'center']]) {
            const L = al === 'left' ? rx : al === 'right' ? rx - w : rx - w / 2;
            if (L < x0 - 4 || L + w > W - 2 || ry < top - 6 || ry > bot + 4) continue;
            if (taken.some(t => L < t[0] + t[2] && L + w > t[0] && ry - hh / 2 < t[1] + t[3] && ry + hh / 2 > t[1])) continue;
            taken.push([L, ry - hh / 2, w, hh]);
            if (!(V.fam !== 'all' && d.u.fam !== V.fam)) kit.label(c, d.u.name, rx, ry, { align: al, size: 9.5, color: sel && sel.use === d.u ? C.text : C.muted, weight: sel && sel.use === d.u ? 700 : 500 });
            break;
          }
        }
        kit.label(c, 'typical output power: continuous, or the average for pulsed lasers', x0, bot + 1, { size: 10, color: C.faint, baseline: 'bottom' });
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (V.view === 'uses') drawUses(c, C, st.W, st.H); else drawRows(c, C, st.W, st.H);
      }, box.stage);
      kit.click(st, p => {
        if (V.view === 'uses') {
          let best = null, bd = 18; for (const d of dots) { const q = Math.hypot(d.x - p.x, d.y - p.y); if (q < bd) { bd = q; best = d; } }
          if (best) { sel = { use: best.u }; showSel(); loop.once(); }
        } else {
          const r = rows.find(q => p.y >= q.y0 && p.y < q.y1);
          if (r) { sel = r.laser ? { laser: r.laser } : { line: r.line }; showSel(); loop.once(); }
        }
      }, p => V.view === 'uses' ? dots.some(d => Math.hypot(d.x - p.x, d.y - p.y) < 18) : rows.some(q => p.y >= q.y0 && p.y < q.y1));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a gas-discharge tube */
  const GAS = {
    hene: { name: 'Helium–neon', glow: [255, 120, 70], nm: 632.8, gmax: 0.08, R: 98, line: '632.8 nm, red (also 543.5, 594.1, 611.9, 1152 and 3391 nm)', fill: 'helium and neon, about 3 mbar in all (five to ten parts helium to one of neon)', drive: 'a few kilovolts to strike the discharge, then one or two kilovolts at a few milliamperes; no cooling', eff: 'under 0.1 %' },
    argon: { name: 'Argon ion', glow: [110, 150, 255], nm: 488.0, gmax: 0.35, R: 90, line: '488.0 and 514.5 nm are the strongest (also 457.9, 476.5, 496.5 and lines near 351 nm)', fill: 'argon, ionised and excited by a very high current in a narrow bore', drive: 'tens of amperes; most of the power is heat, carried away by water (small tubes: air)', eff: 'below 0.1 %' },
    co2: { name: 'Carbon dioxide', glow: [200, 140, 235], nm: 10600, gmax: 0.5, R: 80, line: '10.6 µm, with a second band near 9.6 µm: infrared, invisible', fill: 'carbon dioxide mixed with nitrogen and helium', drive: 'a direct-current or radio-frequency discharge; the gas must be cooled, since most of the power is heat', eff: '10 to 20 %' }
  };
  const gthOf = R => Math.sqrt(1 / (R * 0.999)) - 1;               // the single-pass gain at which two passes just make up the mirror losses
  const rawOut = (gmax, I, R) => { const g = gmax * I, th = gthOf(R); return g > th ? (g - th) * (1 - R) : 0; };
  const bestOut = {};
  for (const k of Object.keys(GAS)) { let m = 0; for (let R = 0.3; R < 0.9995; R += 0.002) m = Math.max(m, rawOut(GAS[k].gmax, 1, R)); bestOut[k] = m; }

  Hyper.sim('lz-discharge', {
    title: 'A gas-discharge laser: from glow to beam',
    blurb: `A sealed tube of gas with an electrode at each end, and a mirror at each end of the tube. Electrons run down the tube, strike atoms and leave them excited; the excited atoms give their light away. Most of it flies out through the walls as glow. Only the light that runs along the axis is caught between the mirrors and can grow.

The pictured gain is **schematic**: the real numbers differ from tube to tube, but the lesson is real: a gas has little gain per pass, so a laser appears only above a threshold, and only with good mirrors.

**Try this**
- Raise the current slowly. Below threshold you see only the glow; above it the beam appears and grows with the current.
- Lower the output mirror's reflectivity. The tube needs more current to lase, and at some point no current is enough. In this picture the helium–neon tube, with its feeble gain, gives up below about 86 %, the argon-ion tube below about 55 %, and the carbon dioxide tube still lases at 50 %: more gain can afford to give more of the light away.
- Switch to carbon dioxide: the glow is visible, the beam is not. It is infrared at 10.6 µm.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 420 });
      const g0 = GAS[params.gas] ? params.gas : 'hene';
      let el = [], at = [], ph = [], acc = 0, B = 0, clk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'gas', type: 'select', label: 'The gas', options: Object.keys(GAS).map(k => [GAS[k].name, k]), value: g0 },
        { id: 'I', label: 'Discharge current', min: 0, max: 100, step: 1, value: 70, unit: '% of the maximum' },
        { id: 'R', label: 'Output mirror reflectivity', min: 50, max: 99.9, step: 0.1, value: GAS[g0].R, unit: '%' }
      ], (id, v) => { if (id === 'gas') { ctl.set('R', GAS[v].R); el = []; at = []; ph = []; B = 0; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['line', 'Lines'], ['gain', 'Gain per pass (schematic)'], ['need', 'Gain needed to lase'], ['state', 'The tube is'], ['out', 'Beam, against the best this tube gives'], ['fill', 'Gas'], ['drive', 'Drive and cooling'], ['eff', 'Plug efficiency']]);
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, G = GAS[V.gas];
        const cy = Hh * 0.45, tx0 = 70, tx1 = W - 96, half = Math.min(34, Hh * 0.1);
        const I = V.I / 100, R = V.R / 100, g = G.gmax * I, gth = gthOf(R), lasing = g > gth;
        const target = clamp(rawOut(G.gmax, I, R) / bestOut[V.gas], 0, 1);
        B += (target - B) * (1 - Math.exp(-dt / 0.3));
        clk += dt;
        const rgb = G.glow.join(',');
        if (dt > 0) {
          acc = Math.min(acc + I * 22 * dt, 3);
          while (acc >= 1 && el.length < 70) { el.push({ x: tx0 + 16, y: cy + (Math.random() * 2 - 1) * half * 0.8, E: 0, thr: 0.7 + Math.random() * 0.7 }); acc -= 1; }
          for (const e of el) {
            e.E += dt * 1.5; e.x += dt * (70 + 120 * e.E);
            if (e.E > e.thr) { e.E = 0; e.thr = 0.7 + Math.random() * 0.7; if (Math.random() < 0.75 && at.length < 90) at.push({ x: e.x, y: e.y, t: 0, life: 0.3 + Math.random() * 0.5 }); }
          }
          el = el.filter(e => e.x < tx1 - 14);
          for (const a of at) a.t += dt;
          for (const a of at) if (a.t > a.life) { const ang = Math.random() * TAU; ph.push({ x: a.x, y: a.y, vx: 240 * Math.cos(ang), vy: 240 * Math.sin(ang), t: 0 }); }
          at = at.filter(a => a.t <= a.life);
          for (const p of ph) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; }
          ph = ph.filter(p => p.t < 0.4 && Math.abs(p.y - cy) < half + 10 && p.x > tx0 && p.x < tx1);
        }
        // the tube, glowing with the gas
        c.fillStyle = 'rgba(' + rgb + ',' + (0.04 + 0.2 * I) + ')'; c.fillRect(tx0, cy - half, tx1 - tx0, 2 * half);
        c.strokeStyle = C.muted; c.lineWidth = 1.4; c.strokeRect(tx0 + 0.5, cy - half + 0.5, tx1 - tx0, 2 * half);
        c.fillStyle = C.muted; c.fillRect(tx0 - 8, cy - 10, 8, 20); c.fillRect(tx1, cy - 10, 8, 20);
        kit.label(c, 'cathode (−)', tx0 + 4, cy + half + 15, { size: 11, color: C.muted });
        kit.label(c, 'anode (+)', tx1 - 4, cy + half + 15, { align: 'right', size: 11, color: C.muted });
        kit.arrow(c, tx0 + 90, cy + half + 15, tx0 + 150, cy + half + 15, C.faint, 1.2, 7);
        kit.label(c, 'electrons', tx0 + 156, cy + half + 15, { size: 10.5, color: C.faint });
        // the mirrors
        c.fillStyle = C.accent; c.fillRect(tx0 - 18, cy - half - 8, 4, 2 * half + 16); c.fillRect(tx1 + 14, cy - half - 8, 4, 2 * half + 16);
        kit.label(c, 'rear mirror 99.9 %', tx0 - 18, cy - half - 18, { size: 10.5, color: C.muted });
        kit.label(c, 'output mirror ' + V.R.toFixed(1) + ' %', tx1 + 18, cy - half - 18, { align: 'right', size: 10.5, color: C.muted });
        // light, atoms, electrons
        for (const p of ph) { c.strokeStyle = 'rgba(' + rgb + ',' + (0.9 * (1 - p.t / 0.4)) + ')'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * 0.04, p.y - p.vy * 0.04); c.stroke(); }
        for (const a of at) { c.beginPath(); c.arc(a.x, a.y, 3.4, 0, TAU); c.fillStyle = 'rgba(' + rgb + ',' + (1 - 0.5 * a.t / a.life) + ')'; c.fill(); }
        for (const e of el) { c.beginPath(); c.arc(e.x, e.y, 1.8, 0, TAU); c.fillStyle = C.text; c.fill(); }
        // the beam, between the mirrors and out of the output mirror
        const bc = vis(G.nm) ? S.nm(G.nm) : 'rgb(190,70,70)', bv = Math.sqrt(B);
        if (bv > 0.01) {
          c.save(); c.strokeStyle = bc; c.lineCap = 'round'; if (!vis(G.nm)) c.setLineDash([7, 5]);
          c.globalAlpha = 0.15 + 0.6 * bv; c.lineWidth = 2 + 3 * bv; c.beginPath(); c.moveTo(tx0 - 14, cy); c.lineTo(tx1 + 14, cy); c.stroke();
          c.globalAlpha = 0.25 + 0.75 * bv; c.lineWidth = 1.5 + 3.5 * bv; c.beginPath(); c.moveTo(tx1 + 18, cy); c.lineTo(W - 8, cy); c.stroke();
          c.setLineDash([]); c.globalAlpha = bv;
          for (let i = 0; i < 12; i++) { const x = tx0 + ((i * (tx1 - tx0) / 12 + clk * 160) % (tx1 - tx0)); c.beginPath(); c.arc(x, cy, 1.5 + 1.5 * bv, 0, TAU); c.fillStyle = bc; c.fill(); }
          c.restore();
          kit.label(c, vis(G.nm) ? 'laser beam' : 'laser beam: invisible infrared', W - 12, cy - 14, { align: 'right', size: 11, color: C.text, weight: 650 });
        }
        // the key
        const ky = Hh - 30;
        c.beginPath(); c.arc(16, ky, 1.8, 0, TAU); c.fillStyle = C.text; c.fill(); kit.label(c, 'an electron', 26, ky, { size: 10.5, color: C.muted });
        c.beginPath(); c.arc(112, ky, 3.4, 0, TAU); c.fillStyle = 'rgba(' + rgb + ',1)'; c.fill(); kit.label(c, 'an excited atom or molecule', 122, ky, { size: 10.5, color: C.muted });
        c.strokeStyle = 'rgba(' + rgb + ',1)'; c.beginPath(); c.moveTo(286, ky); c.lineTo(298, ky - 4); c.stroke(); kit.label(c, 'spontaneous light, lost through the wall', 304, ky, { size: 10.5, color: C.muted });
        kit.label(c, 'Only light along the axis is caught between the mirrors.', 16, Hh - 12, { size: 10.5, color: C.faint });
        ro.set('line', G.line);
        ro.set('gain', (g * 100).toFixed(1) + ' % at this current');
        ro.set('need', (gth * 100).toFixed(2) + ' % (set by the mirrors)');
        ro.set('state', lasing ? 'above threshold: the beam grows' : I > 0 ? 'below threshold: glow only' : 'off');
        ro.set('out', Math.round(100 * B) + ' %');
        ro.set('fill', G.fill); ro.set('drive', G.drive); ro.set('eff', G.eff);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ the helium–neon laser */
  const EN = { heS1: 20.61, heS3: 19.82, ne3s: 20.66, ne2s: 19.78, ne1s: 16.7, ne2pLo: 18.4, ne2pHi: 19.0 };   // eV: helium metastables and neon levels (the 1s and 2p groups are rounded)
  const HENE_LINES = [[632.8, '3s'], [543.5, '3s'], [594.1, '3s'], [611.9, '3s'], [1152, '2s'], [3391, '3s']];
  Hyper.sim('lz-hene', {
    title: 'Inside the helium–neon laser',
    blurb: `Two views of one laser. **Energy transfer** shows why the gas is a mixture: helium is the cheap, long-lived store of energy, neon does the radiating. **Modes** shows why the beam is so pure: a Doppler-broadened gain line about 1.5 GHz wide, and the few cavity modes that fit under it.

The level energies are rounded and the picture is schematic; the photon energy is exact for the line you pick, and the lower level is found from it by energy conservation.

**Try this**
- *Energy transfer*: watch one packet of energy travel from the electrons, to helium, to neon, to a photon. Choose the 3391 nm line: its photon is a fifth as energetic and the lower level is nearly as high as the upper one.
- *Modes*: with a 30 cm tube two or three modes lase. Shorten the tube to 15 cm and only one or two modes fit under the gain curve; lengthen it to 1 m and nine or ten appear.
- Tick *the tube warms up*: its length changes by a fraction of a micrometre, the comb of modes slides across the gain curve, and modes appear and vanish. That is the familiar wobble of the output of a helium–neon laser in its first minutes.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 480 });
      let clk = 0, off = 0.3;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Energy transfer', 'levels'], ['Modes under the gain curve', 'modes']], value: params.view || 'levels' },
        { id: 'line', type: 'select', label: 'The line', options: [['Red, 632.8 nm', 632.8], ['Green, 543.5 nm', 543.5], ['Yellow, 594.1 nm', 594.1], ['Orange, 611.9 nm', 611.9], ['Infrared, 1152 nm', 1152], ['Infrared, 3391 nm', 3391]], value: 632.8 },
        { id: 'L', label: 'Length of the tube', min: 10, max: 100, step: 1, value: params.L || 30, unit: 'cm' },
        { id: 'g0', label: 'Gain at the line centre, as a multiple of the losses', min: 0.8, max: 4, step: 0.05, value: 1.8 },
        { id: 'T', label: 'Temperature of the neon gas', min: 300, max: 600, step: 10, value: 400, unit: 'K' },
        { id: 'warm', type: 'check', label: 'The tube warms up (its length drifts)', value: true }
      ], () => sync());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Photon'], ['b', 'Upper level → lower level'], ['c', 'Notice'], ['dop', 'Doppler width of the gain line'], ['fsr', 'Spacing of the cavity modes'], ['modes', 'Modes lasing'], ['spread', 'Spread of the lasing modes'], ['coh', 'Coherence length'], ['tube', 'Drift of the comb']]);
      function drawLevels(c, C, W, Hh) {
        const nm = V.line, row = HENE_LINES.find(l => l[0] === nm) || HENE_LINES[0], viaS2 = row[1] === '2s';
        const up = viaS2 ? EN.ne2s : EN.ne3s, Eph = O.photonEnergy(nm), low = up - Eph, heM = viaS2 ? EN.heS3 : EN.heS1;
        const top = 30, bot = Hh - 46, Y = e => bot - (bot - top) * e / 22, bw = Math.min(104, W * 0.17), xHe = W * 0.2, xNe = W * 0.58;
        const lc = vis(nm) ? S.nm(nm) : 'rgb(200,80,80)';
        const lev = (x, e, col, w) => { c.strokeStyle = col; c.lineWidth = w || 2; c.beginPath(); c.moveTo(x, Y(e)); c.lineTo(x + bw, Y(e)); c.stroke(); };
        kit.label(c, 'HELIUM', xHe + bw / 2, 12, { align: 'center', size: 11, weight: 700, color: C.accent });
        kit.label(c, 'NEON', xNe + bw / 2, 12, { align: 'center', size: 11, weight: 700, color: C.warn });
        c.strokeStyle = C.grid; c.lineWidth = 1; for (let e = 0; e <= 20; e += 5) { c.beginPath(); c.moveTo(24, Y(e)); c.lineTo(W - 10, Y(e)); c.stroke(); kit.label(c, e + ' eV', 4, Y(e) - 7, { size: 9.5, color: C.faint }); }
        // helium
        lev(xHe, 0, C.muted); lev(xHe, EN.heS3, C.accent); lev(xHe, EN.heS1, C.accent);
        kit.label(c, 'ground', xHe - 6, Y(0), { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, '2³S  19.8 eV', xHe - 6, Y(EN.heS3) + 6, { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, '2¹S  20.6 eV', xHe - 6, Y(EN.heS1) - 5, { align: 'right', size: 10.5, color: C.muted });
        // neon
        lev(xNe, 0, C.muted); lev(xNe, EN.ne1s, C.muted); lev(xNe, EN.ne3s, C.warn); lev(xNe, EN.ne2s, C.warn);
        c.fillStyle = 'rgba(224,160,48,0.22)'; c.fillRect(xNe, Y(EN.ne2pHi), bw, Y(EN.ne2pLo) - Y(EN.ne2pHi));
        for (const e of [18.38, 18.56, 18.64, 18.70, 18.97]) lev(xNe, e, C.muted, 1);
        kit.label(c, 'ground', xNe + bw + 6, Y(0), { size: 10.5, color: C.muted });
        kit.label(c, '1s  ≈ 16.7 eV', xNe + bw + 6, Y(EN.ne1s), { size: 10.5, color: C.muted });
        kit.label(c, '2p  ≈ 18.4–19.0 eV', xNe + bw + 6, Y(18.7) + 2, { size: 10.5, color: C.muted });
        kit.label(c, '2s  ≈ 19.8 eV', xNe + bw + 6, Y(EN.ne2s) + 6, { size: 10.5, color: C.muted });
        kit.label(c, '3s  ≈ 20.7 eV', xNe + bw + 6, Y(EN.ne3s) - 8, { size: 10.5, color: C.muted });
        lev(xNe, low, lc, 2.4);
        // the transition: a wavy arrow from the upper to the lower level
        const em = [0, 1, 2, 3, 4].map(k => { const p = ((clk / 7 + k / 5) % 1); return p >= 0.52 && p < 0.64 ? Math.sin(PI * (p - 0.52) / 0.12) : 0; });
        const strength = Math.max(...em), ax = xNe + bw * 0.5;
        c.save(); c.strokeStyle = lc; c.lineWidth = 2; c.globalAlpha = 0.3 + 0.7 * strength; c.beginPath();
        const y1 = Y(up) + 2, y2 = Y(low) - 3, n = Math.max(6, Math.round(Math.abs(y2 - y1) / 4));
        for (let i = 0; i <= n; i++) { const u = i / n, x = ax + 4 * Math.sin(u * TAU * Math.max(1, Math.abs(y2 - y1) / 18)), y = y1 + (y2 - y1) * u; i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke(); c.restore();
        kit.arrow(c, ax, y2 - 5, ax, y2 + 2, lc, 2, 7);
        // the packets of energy
        const ease = u => u * u * (3 - 2 * u), lerp = (a, b, u) => a + (b - a) * u;
        const cx1 = xHe + bw / 2, cx2 = xNe + bw / 2;
        for (let k = 0; k < 5; k++) {
          const ph = (clk / 7 + k / 5) % 1;
          let x, y, col = C.accent;
          if (ph < 0.16) { x = cx1; y = lerp(Y(0), Y(heM), ease(ph / 0.16)); }
          else if (ph < 0.3) { x = cx1 + Math.sin(clk * 9 + k) * 2; y = Y(heM); }
          else if (ph < 0.44) { const u = ease((ph - 0.3) / 0.14); x = lerp(cx1 + bw * 0.5, cx2 - bw * 0.5, u); y = lerp(Y(heM), Y(up), u); }
          else if (ph < 0.52) { x = cx2 + Math.sin(clk * 9 + k) * 2; y = Y(up); col = lc; }
          else if (ph < 0.64) { x = cx2; y = lerp(Y(up), Y(low), ease((ph - 0.52) / 0.12)); col = lc; }
          else if (ph < 0.76) { x = cx2; y = lerp(Y(low), Y(EN.ne1s), ease((ph - 0.64) / 0.12)); col = C.muted; }
          else { x = cx2; y = lerp(Y(EN.ne1s), Y(0), ease((ph - 0.76) / 0.24)); col = C.muted; }
          if (ph < 0.3 || ph >= 0.44) { c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fillStyle = col; c.fill(); c.lineWidth = 1.2; c.strokeStyle = C.bg2; c.stroke(); }
          else { c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fillStyle = C.accent; c.fill(); }
        }
        kit.label(c, 'electrons lift helium', xHe + bw / 2, Y(0) - 12, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'a collision hands the energy to neon', (xHe + bw + xNe) / 2, Y(heM) - 20, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'photon', ax + 11, (Y(up) + Y(low)) / 2, { size: 10.5, color: lc, weight: 650 });
        kit.label(c, 'quick decay', xNe + bw + 6, (Y(18.7) + Y(EN.ne1s)) / 2 + 8, { size: 10, color: C.faint });
        kit.label(c, 'then the wall of the tube takes the neon back to its ground state', (xNe + xHe) / 2, Hh - 30, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'helium has no 632.8 nm transition: it only stores and passes on energy', (xNe + xHe) / 2, Hh - 14, { align: 'center', size: 10.5, color: C.faint });
        ro.set('a', Eph.toFixed(3) + ' eV = ' + nmText(nm) + (vis(nm) ? '' : ' (invisible)'));
        ro.set('b', up.toFixed(2) + ' eV → ' + low.toFixed(2) + ' eV (the lower level, found by energy conservation)');
        ro.set('c', nm === 632.8 ? 'the red line: the strongest visible one' : nm === 3391 ? 'a high-gain infrared line the mirrors of a red tube do not reflect' : nm === 1152 ? 'the first line ever seen from a gas laser (1960)' : 'a weaker line, needing mirrors made for it');
      }
      function drawModes(c, C, W, Hh) {
        const Lm = V.L / 100, fsr = O.laser.modeSpacing(Lm) / 1e9, nu0 = O.c / 632.8e-9;
        const dD = 7.16e-7 * nu0 * Math.sqrt(V.T / 20.18) / 1e9;           // Doppler width (FWHM) of the neon line, GHz
        const SPAN = 3, x0 = 52, x1 = W - 16, top = 34, bot = Hh - 62, gtop = Math.max(V.g0 * 1.15, 1.6);
        const X = f => x0 + (x1 - x0) * (f + SPAN) / (2 * SPAN), Y = g => bot - (bot - top) * g / gtop, G = f => V.g0 * Math.exp(-4 * Math.LN2 * (f / dD) * (f / dD));
        // gain curve and the losses
        c.beginPath(); for (let i = 0; i <= 120; i++) { const f = -SPAN + 2 * SPAN * i / 120; i ? c.lineTo(X(f), Y(G(f))) : c.moveTo(X(f), Y(G(f))); }
        c.lineTo(X(SPAN), bot); c.lineTo(X(-SPAN), bot); c.closePath(); c.fillStyle = 'rgba(224,160,48,0.14)'; c.fill();
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 120; i++) { const f = -SPAN + 2 * SPAN * i / 120; i ? c.lineTo(X(f), Y(G(f))) : c.moveTo(X(f), Y(G(f))); } c.stroke();
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.bad; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x0, Y(1)); c.lineTo(x1, Y(1)); c.stroke(); c.restore();
        kit.label(c, 'losses: the gain a mode needs', x1 - 4, Y(1) + 11, { align: 'right', size: 10.5, color: C.bad });
        kit.label(c, 'gain of the neon (Doppler-broadened)', X(0), Y(V.g0) - 10, { align: 'center', size: 10.5, color: C.warn });
        // the modes of the cavity
        const kmax = Math.ceil(SPAN / fsr) + 1, lasing = [];
        for (let k = -kmax; k <= kmax; k++) {
          const f = (k + off) * fsr; if (f < -SPAN || f > SPAN) continue;
          const g = G(f), on = g >= 1;
          if (on) lasing.push(f);
          c.strokeStyle = on ? S.nm(632.8) : C.faint; c.lineWidth = on ? 3 : 1; c.beginPath(); c.moveTo(X(f), bot); c.lineTo(X(f), Y(Math.max(g, 0.02))); c.stroke();
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, bot); c.lineTo(x1, bot); c.stroke();
        for (let f = -SPAN; f <= SPAN; f++) { c.beginPath(); c.moveTo(X(f), bot); c.lineTo(X(f), bot + 4); c.stroke(); kit.label(c, f === 0 ? 'line centre' : (f > 0 ? '+' : '−') + Math.abs(f), X(f), bot + 14, { align: 'center', size: 10, color: C.muted }); }
        kit.label(c, 'frequency from the centre of the neon line (GHz)', (x0 + x1) / 2, bot + 29, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'thick red stems: modes that lase · thin stems: modes the gain cannot support', (x0 + x1) / 2, bot + 46, { align: 'center', size: 10.5, color: C.faint });
        // the mode spacing, marked
        if (fsr < SPAN) { const f0 = (Math.floor(-0.5 * SPAN / fsr) + off) * fsr; c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(f0), top + 6); c.lineTo(X(f0 + fsr), top + 6); c.stroke(); kit.label(c, 'c/2L = ' + (fsr * 1000).toFixed(0) + ' MHz', X(f0 + fsr / 2), top + 17, { align: 'center', size: 10, color: C.muted }); }
        const n = lasing.length, sp = n > 1 ? Math.max(...lasing) - Math.min(...lasing) : 0;
        ro.set('tube', 'a change of the tube length by half a wavelength (0.316 µm) slides the comb by one spacing');
        ro.set('dop', dD.toFixed(2) + ' GHz (FWHM, from the gas temperature)');
        ro.set('fsr', (fsr * 1000).toFixed(0) + ' MHz for a ' + V.L + ' cm tube');
        ro.set('modes', n === 0 ? 'none: the gain is below the losses' : String(n));
        ro.set('spread', n > 1 ? sp.toFixed(2) + ' GHz' : n === 1 ? 'a single line' : '—');
        ro.set('coh', n > 1 ? (O.c / (sp * 1e9)).toFixed(2) + ' m  (c ÷ spread)' : n === 1 ? 'hundreds of metres (limited by drift, not by the line)' : '—');
      }
      const loop = kit.loop(dt => {
        clk += dt; if (V.view === 'modes' && V.warm) off = (off + dt * 0.22) % 1;
        const c = st.begin(), C = kit.colors();
        if (V.view === 'levels') drawLevels(c, C, st.W, st.H); else drawModes(c, C, st.W, st.H);
      }, box.stage);
      function sync() {
        const m = V.view === 'modes';
        ctl.show('line', !m); for (const id of ['L', 'g0', 'T', 'warm']) ctl.show(id, m);
        for (const k of ['a', 'b', 'c']) ro.show(k, !m); for (const k of ['dop', 'fsr', 'modes', 'spread', 'coh', 'tube']) ro.show(k, m);
        if (V.view === 'levels' || V.warm) loop.start(); else { loop.stop(); loop.once(); }
      }
      st.onResize(() => loop.once());
      sync();
    }
  });

  /* ================================================================ CO2 levels and excimer curves */
  const tfmt = s => s < 1e-12 ? (s * 1e15).toFixed(s * 1e15 < 10 ? 1 : 0) + ' fs' : s < 1e-9 ? (s * 1e12).toFixed(s * 1e12 < 10 ? 1 : 0) + ' ps' : (s * 1e9).toFixed(1) + ' ns';
  const WN = 1.239841984e-4;                                               // eV per cm⁻¹
  const EXC = { 193: ['Ar', 'F', 'ArF'], 248: ['Kr', 'F', 'KrF'], 308: ['Xe', 'Cl', 'XeCl'], 351: ['Xe', 'F', 'XeF'] };
  Hyper.sim('lz-molecular', {
    title: 'Molecular lasers: the CO₂ level ladder and the excimer curves',
    blurb: `Two gas lasers whose light comes from molecules rather than atoms. **Carbon dioxide**: its vibrations are the levels; nitrogen, which is excited easily by the discharge, passes its energy to the CO₂ molecule by collision. **Excimer**: a molecule that exists only while it is excited, so its lower level is always empty.

The level energies of CO₂ and nitrogen are the spectroscopic values (cm⁻¹); the excimer curves are **schematic**, but their photon energies are the true ones for each wavelength.

**Try this**
- *Carbon dioxide*: the photon (about 0.12 eV) carries only 41 % of the 0.29 eV the upper level stored: the rest is heat. That is why a CO₂ laser needs cooling, and why its efficiency (10 to 20 %) is high for a gas laser and no higher.
- Switch between the two bands: the lower level changes by only 100 cm⁻¹, and the wavelength moves from 10.4 to 9.4 µm (the strongest lines are at 10.6 and 9.6 µm).
- *Excimer*: watch the molecule vibrate in its bound excited state, emit the photon, and fly apart on the repulsive ground-state curve. Compare the photon energies with the 3.6 eV that a carbon–carbon bond needs: 193 nm light breaks bonds directly, which is how it cuts tissue and etches polymers without heating them.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 480 });
      let clk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Carbon dioxide: the level ladder', 'co2'], ['Excimer: the potential curves', 'excimer']], value: params.view || 'co2' },
        { id: 'band', type: 'select', label: 'The band', options: [['10.6 µm (to the level 10⁰0)', 'a'], ['9.6 µm (to the level 02⁰0)', 'b']], value: 'a' },
        { id: 'mol', type: 'select', label: 'The excimer', options: [['ArF, 193 nm', 193], ['KrF, 248 nm', 248], ['XeCl, 308 nm', 308], ['XeF, 351 nm', 351]], value: 193 }
      ], () => sync());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Photon'], ['b', 'Upper level'], ['c', 'Efficiency limit'], ['d', 'In practice'], ['e', 'Gas'], ['f', 'A carbon–carbon bond (3.6 eV)'], ['g', 'Pulses']]);
      const ease = u => u * u * (3 - 2 * u), lerp = (a, b, u) => a + (b - a) * u;
      function drawCO2(c, C, W, Hh) {
        const top = 34, bot = Hh - 56, Y = k => bot - (bot - top) * k / 2500, bw = Math.min(110, W * 0.18), xN = W * 0.16, xC = W * 0.56;
        const low = V.band === 'a' ? 1388 : 1286, up = 2349, cen = 1e7 / (up - low), Eph = (up - low) * WN, lc = 'rgb(200,80,80)';
        const lev = (x, k, col, w) => { c.strokeStyle = col; c.lineWidth = w || 2; c.beginPath(); c.moveTo(x, Y(k)); c.lineTo(x + bw, Y(k)); c.stroke(); };
        kit.label(c, 'NITROGEN', xN + bw / 2, 12, { align: 'center', size: 11, weight: 700, color: C.accent });
        kit.label(c, 'CARBON DIOXIDE', xC + bw / 2, 12, { align: 'center', size: 11, weight: 700, color: C.warn });
        c.strokeStyle = C.grid; c.lineWidth = 1; for (let k = 0; k <= 2000; k += 500) { c.beginPath(); c.moveTo(30, Y(k)); c.lineTo(W - 10, Y(k)); c.stroke(); kit.label(c, k + '', 4, Y(k) - 7, { size: 9.5, color: C.faint }); }
        kit.label(c, 'cm⁻¹', 4, Y(2500) + 4, { size: 9.5, color: C.faint });
        lev(xN, 0, C.muted); lev(xN, 2331, C.accent);
        kit.label(c, 'v = 0', xN - 6, Y(0), { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, 'v = 1  2331', xN - 6, Y(2331), { align: 'right', size: 10.5, color: C.muted });
        lev(xC, 0, C.muted); lev(xC, 667, C.warn, 1.6); lev(xC, 1286, V.band === 'b' ? C.warn : C.muted, V.band === 'b' ? 2.6 : 1.4); lev(xC, 1388, V.band === 'a' ? C.warn : C.muted, V.band === 'a' ? 2.6 : 1.4); lev(xC, up, C.warn, 2.6);
        kit.label(c, 'ground (00⁰0)', xC + bw + 6, Y(0), { size: 10.5, color: C.muted });
        kit.label(c, 'bending (01¹0)  667', xC + bw + 6, Y(667), { size: 10.5, color: C.muted });
        kit.label(c, '02⁰0  1286', xC + bw + 6, Y(1286) + 7, { size: 10.5, color: C.muted });
        kit.label(c, '10⁰0  1388', xC + bw + 6, Y(1388) - 6, { size: 10.5, color: C.muted });
        kit.label(c, 'upper laser level (00¹0)  2349', xC + bw + 6, Y(up) - 2, { size: 10.5, color: C.warn, weight: 650 });
        // the transition
        const em = [0, 1, 2, 3].map(k => { const p = (clk / 8 + k / 4) % 1; return p >= 0.42 && p < 0.55 ? Math.sin(PI * (p - 0.42) / 0.13) : 0; });
        const ax = xC + bw * 0.5, y1 = Y(up) + 2, y2 = Y(low) - 3, n = 22;
        c.save(); c.strokeStyle = lc; c.lineWidth = 2; c.globalAlpha = 0.3 + 0.7 * Math.max(...em); c.setLineDash([6, 3]); c.beginPath();
        for (let i = 0; i <= n; i++) { const u = i / n, x = ax + 4 * Math.sin(u * TAU * 4), y = y1 + (y2 - y1) * u; i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke(); c.restore();
        kit.arrow(c, ax, y2 - 5, ax, y2 + 2, lc, 2, 7);
        kit.label(c, nmText(cen) + ' (infrared)', ax + 12, (y1 + y2) / 2, { size: 10.5, color: lc, weight: 650 });
        // the packets
        for (let k = 0; k < 4; k++) {
          const p = (clk / 8 + k / 4) % 1; let x, y, col = C.accent;
          if (p < 0.14) { x = xN + bw / 2; y = lerp(Y(0), Y(2331), ease(p / 0.14)); }
          else if (p < 0.22) { x = xN + bw / 2 + Math.sin(clk * 8 + k) * 2; y = Y(2331); }
          else if (p < 0.34) { const u = ease((p - 0.22) / 0.12); x = lerp(xN + bw, xC, u); y = lerp(Y(2331), Y(up), u); }
          else if (p < 0.42) { x = xC + bw / 2 + Math.sin(clk * 8 + k) * 2; y = Y(up); col = C.warn; }
          else if (p < 0.55) { x = xC + bw / 2; y = lerp(Y(up), Y(low), ease((p - 0.42) / 0.13)); col = lc; }
          else if (p < 0.7) { x = xC + bw / 2; y = lerp(Y(low), Y(667), ease((p - 0.55) / 0.15)); col = C.muted; }
          else { x = xC + bw / 2; y = lerp(Y(667), Y(0), ease((p - 0.7) / 0.3)); col = C.muted; }
          c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fillStyle = col; c.fill(); c.lineWidth = 1.2; c.strokeStyle = C.bg2; c.stroke();
        }
        kit.label(c, 'electrons excite nitrogen', xN + bw / 2, Y(0) - 12, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'collision: nearly resonant', (xN + bw + xC) / 2, Y(2331) - 20, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'collisions, helped by helium, empty the lower levels', (xN + xC) / 2 + 40, Hh - 30, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'the rest of the energy leaves as heat', (xN + xC) / 2 + 40, Hh - 14, { align: 'center', size: 10.5, color: C.faint });
        ro.set('a', nmText(cen) + ' band centre (strongest line ' + (V.band === 'a' ? '10.6' : '9.6') + ' µm), ' + Eph.toFixed(3) + ' eV');
        ro.set('b', up + ' cm⁻¹ = ' + (up * WN).toFixed(3) + ' eV (nitrogen v = 1 lies only 18 cm⁻¹ below)');
        ro.set('c', (100 * (up - low) / up).toFixed(0) + ' % (photon energy ÷ upper-level energy)');
        ro.set('d', '10 to 20 % of the electrical power');
        ro.set('e', 'carbon dioxide, nitrogen and helium');
        ro.set('f', '—'); ro.set('g', 'continuous, or pulsed');
      }
      function drawExcimer(c, C, W, Hh) {
        const nm = V.mol, Eph = O.photonEnergy(nm), M = EXC[nm], x0 = 54, x1 = W - 16, top = 26, bot = Hh - 74, EMAX = 11, re = 0.26;
        const X = r => x0 + (x1 - x0) * (r - 0.15) / 0.55, Y = e => bot - (bot - top) * e / EMAX;
        const Vl = r => 1.6 * Math.exp(-(r - 0.2) / 0.05), Emin = Eph + Vl(re), Vu = r => Emin + 3 * Math.pow(1 - Math.exp(-9 * (r - re)), 2);
        const lc = vis(nm) ? S.nm(nm) : 'rgb(140,80,190)';
        c.strokeStyle = C.grid; c.lineWidth = 1; for (let e = 0; e <= 10; e += 2) { c.beginPath(); c.moveTo(x0, Y(e)); c.lineTo(x1, Y(e)); c.stroke(); kit.label(c, e + ' eV', x0 - 6, Y(e), { align: 'right', size: 9.5, color: C.faint }); }
        const curve = (f, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); let on = false; for (let i = 0; i <= 140; i++) { const r = 0.15 + 0.55 * i / 140, e = f(r); if (e > EMAX) { on = false; continue; } on ? c.lineTo(X(r), Y(e)) : c.moveTo(X(r), Y(e)); on = true; } c.stroke(); };
        curve(Vl, C.muted, 2.4); curve(Vu, C.warn, 2.4);
        kit.label(c, 'excited state: bound (the two atoms attract each other)', X(0.33), Y(Vu(0.55)) - 4, { size: 10.5, color: C.warn });
        kit.label(c, 'ground state: repulsive (no molecule)', X(0.40), Y(Vl(0.4)) - 14, { size: 10.5, color: C.muted });
        kit.label(c, 'distance between the two atoms (schematic)', (x0 + x1) / 2, bot + 12, { align: 'center', size: 10.5, color: C.faint });
        // the cycle: vibrate in the well, emit, fly apart
        const ph = (clk / 6) % 1;
        let r, e, flash = 0, side = 'u';
        if (ph < 0.55) { r = re + 0.012 + 0.032 * Math.sin(TAU * 5 * ph / 0.55); e = Vu(r); }
        else if (ph < 0.64) { r = re + 0.012; e = lerp(Vu(r), Vl(r), ease((ph - 0.55) / 0.09)); flash = Math.sin(PI * (ph - 0.55) / 0.09); side = ph < 0.595 ? 'u' : 'l'; }
        else { const u = (ph - 0.64) / 0.36; r = re + 0.012 + 0.45 * u * u; e = Vl(r); side = 'l'; }
        if (flash > 0) { const rr = re + 0.012; c.save(); c.strokeStyle = lc; c.lineWidth = 2.4; c.globalAlpha = flash; c.beginPath(); for (let i = 0; i <= 24; i++) { const u = i / 24, yy = lerp(Y(Vu(rr)), Y(Vl(rr)), u), xx = X(rr) + 5 * Math.sin(u * TAU * 3); i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); c.restore(); }
        c.beginPath(); c.arc(X(r), Y(e), 5.5, 0, TAU); c.fillStyle = side === 'u' ? C.warn : C.muted; c.fill(); c.lineWidth = 1.2; c.strokeStyle = C.bg2; c.stroke();
        const re2 = re + 0.012;
        c.save(); c.strokeStyle = lc; c.lineWidth = 1.4; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(re2) + 22, Y(Vu(re2))); c.lineTo(X(re2) + 22, Y(Vl(re2))); c.stroke(); c.restore();
        kit.label(c, nmText(nm) + '  ' + Eph.toFixed(2) + ' eV', X(re2) + 28, (Y(Vu(re2)) + Y(Vl(re2))) / 2, { size: 11, color: C.text, weight: 650 });
        // the two atoms
        const ay = Hh - 30, ax0 = x0 + 18, rad = 11;
        for (const [x, nme, col] of [[ax0, M[0], C.accent], [ax0 + (X(r) - X(0.15)) + 24, M[1], C.warn]]) { c.beginPath(); c.arc(x, ay, rad, 0, TAU); c.fillStyle = col; c.globalAlpha = 0.85; c.fill(); c.globalAlpha = 1; kit.label(c, nme, x, ay, { align: 'center', size: 11, weight: 700, color: '#111' }); }
        kit.label(c, side === 'u' ? 'bound while excited' : 'the atoms fly apart: the lower level is empty', ax0 + (X(0.7) - X(0.15)) * 0.55, Hh - 12, { size: 10.5, color: C.faint, align: 'center' });
        ro.set('a', nmText(nm) + ', ' + Eph.toFixed(2) + ' eV (' + M[2] + ')'); ro.set('b', 'the excited molecule, (' + M[0] + M[1] + ')*, which does not exist in the ground state');
        ro.set('c', '—'); ro.set('d', 'a few per cent of the electrical power');
        ro.set('e', 'a rare gas and a halogen donor in a buffer gas (neon or helium) at several bar');
        ro.set('f', Eph >= 3.59 ? 'one photon carries enough to break it' : 'one photon falls just short (a bond needs 3.59 eV)');
        ro.set('g', 'about 10 to 30 ns, up to several kilohertz');
      }
      const loop = kit.loop(dt => {
        clk += dt;
        const c = st.begin(), C = kit.colors();
        if (V.view === 'co2') drawCO2(c, C, st.W, st.H); else drawExcimer(c, C, st.W, st.H);
      }, box.stage);
      function sync() {
        const co = V.view === 'co2';
        ctl.show('band', co); ctl.show('mol', !co);
        for (const k of ['c', 'f', 'g']) ro.show(k, true);
        ro.show('c', co); ro.show('f', !co); ro.show('g', !co);
        loop.start();
      }
      st.onResize(() => loop.once());
      sync();
    }
  });

  /* ================================================================ gain bandwidth of solid-state media */
  const MEDIA = [
    { name: 'Ruby', host: 'Cr³⁺ in sapphire', nm: 694.3, dl: 0.5, life: 'about 3 ms', tune: 'fixed line' },
    { name: 'Nd:YAG', host: 'Nd³⁺ in yttrium aluminium garnet', nm: 1064.2, dl: 0.45, life: 'about 230 µs', tune: 'fixed line' },
    { name: 'Nd:glass (phosphate)', host: 'Nd³⁺ in a phosphate glass', nm: 1054, dl: 20, life: 'about 0.3 ms', tune: 'some tens of nanometres' },
    { name: 'Yb:YAG', host: 'Yb³⁺ in YAG', nm: 1030, dl: 9, life: 'about 1 ms', tune: 'some tens of nanometres' },
    { name: 'Ti:sapphire', host: 'Ti³⁺ in sapphire', nm: 795, dl: 230, life: 'about 3 µs', tune: 'roughly 700 to 1000 nm in practice (gain from 660 to 1180 nm)' }
  ];
  const niceStep = (span, n) => { const raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p; };
  Hyper.sim('lz-gain', {
    title: 'Gain bandwidth and the shortest pulse',
    blurb: `A mode-locked laser makes a short pulse by locking together every cavity mode inside its gain bandwidth. The wider the gain, the shorter the pulse that can be built: for a Gaussian pulse, **duration × bandwidth ≥ 0.44**.

The curves are Gaussians drawn from the widths quoted in the table (typical, at room temperature); real gain curves are not exactly Gaussian, and real lasers use only part of their bandwidth.

**Try this**
- Pick Nd:YAG: a gain line half a nanometre wide cannot make a pulse shorter than a few picoseconds. Pick titanium–sapphire: 230 nm of gain, and a pulse of a few femtoseconds is possible, only a couple of cycles of light long.
- Lower the share of the bandwidth that the laser uses: the shortest pulse grows in proportion.
- Compare the lifetimes in the read-out. A medium with a long lifetime (Nd:YAG, ruby) stores energy for a Q-switched pulse; one with a short lifetime (titanium–sapphire) must be pumped by another laser, and lives by speed.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340, maxH: 460 });
      let rows = [];
      const ctl = kit.controls(box.side, [
        { id: 'med', type: 'select', label: 'The gain medium', options: MEDIA.map((m, i) => [m.name, i]), value: params.med != null ? params.med : 4 },
        { id: 'share', label: 'Share of the gain bandwidth the laser uses', min: 5, max: 100, step: 1, value: 50, unit: '%' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['host', 'The medium'], ['bw', 'Gain bandwidth'], ['t', 'Shortest pulse'], ['cyc', 'Cycles of light in it'], ['tune', 'Tunable range'], ['life', 'Upper-state lifetime']]);
      const dnu = m => O.c * m.dl * 1e-9 / Math.pow(m.nm * 1e-9, 2);      // Hz
      const tmin = (m, share) => 0.441 / (dnu(m) * share / 100);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, m = MEDIA[V.med] || MEDIA[4], lc = S.nm(m.nm);
        const wl = Math.max(W * 0.58, 280), x0 = 46, x1 = wl - 10, ph = (Hh - 50) / 2;
        // the gain curve on a window one and a half bandwidths wide each side of the line
        const lo = m.nm - 1.6 * m.dl, hi = m.nm + 1.6 * m.dl, X = n => x0 + (x1 - x0) * (n - lo) / (hi - lo), Yg = g => 24 + ph * (1 - g);
        const gauss = n => Math.exp(-4 * Math.LN2 * Math.pow((n - m.nm) / m.dl, 2));
        c.beginPath(); for (let i = 0; i <= 160; i++) { const n = lo + (hi - lo) * i / 160; i ? c.lineTo(X(n), Yg(gauss(n))) : c.moveTo(X(n), Yg(gauss(n))); }
        c.lineTo(x1, Yg(0)); c.lineTo(x0, Yg(0)); c.closePath(); c.fillStyle = vis(m.nm) ? S.nm(m.nm, 0.3) : 'rgba(200,80,80,0.25)'; c.fill();
        c.strokeStyle = vis(m.nm) ? lc : 'rgb(200,80,80)'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 160; i++) { const n = lo + (hi - lo) * i / 160; i ? c.lineTo(X(n), Yg(gauss(n))) : c.moveTo(X(n), Yg(gauss(n))); } c.stroke();
        c.save(); c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(m.nm - m.dl / 2), Yg(0.5)); c.lineTo(X(m.nm + m.dl / 2), Yg(0.5)); c.stroke(); c.restore();
        kit.label(c, 'FWHM ' + (m.dl < 1 ? m.dl.toFixed(2) : m.dl.toFixed(0)) + ' nm', X(m.nm + m.dl / 2) + 6, Yg(0.5), { size: 10.5, color: C.muted });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, Yg(0)); c.lineTo(x1, Yg(0)); c.stroke();
        const ns = niceStep(hi - lo, 5);
        for (let n = Math.ceil(lo / ns) * ns; n <= hi; n += ns) { c.beginPath(); c.moveTo(X(n), Yg(0)); c.lineTo(X(n), Yg(0) + 4); c.stroke(); kit.label(c, (+n.toPrecision(5)) + '', X(n), Yg(0) + 13, { align: 'center', size: 10, color: C.muted }); }
        kit.label(c, 'wavelength (nm): the gain of ' + m.name, (x0 + x1) / 2, 11, { align: 'center', size: 11, color: C.text, weight: 650 });
        // the shortest pulse: a Gaussian envelope, with the carrier wave when it can be counted
        const Tp = tmin(m, V.share), tper = m.nm * 1e-9 / O.c, cycles = Tp / tper, py0 = 24 + ph + 46, pH = ph - 24;
        const Xt = t => x0 + (x1 - x0) * (t + 2 * Tp) / (4 * Tp), env = t => Math.exp(-2 * Math.LN2 * Math.pow(t / Tp, 2)); // field envelope; intensity is its square
        c.beginPath(); for (let i = 0; i <= 200; i++) { const t = -2 * Tp + 4 * Tp * i / 200, y = py0 + pH * (1 - env(t) * env(t)); i ? c.lineTo(Xt(t), y) : c.moveTo(Xt(t), y); }
        c.lineTo(x1, py0 + pH); c.lineTo(x0, py0 + pH); c.closePath(); c.fillStyle = 'rgba(224,160,48,0.18)'; c.fill();
        c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); for (let i = 0; i <= 200; i++) { const t = -2 * Tp + 4 * Tp * i / 200, y = py0 + pH * (1 - env(t) * env(t)); i ? c.lineTo(Xt(t), y) : c.moveTo(Xt(t), y); } c.stroke();
        if (cycles < 40) { c.strokeStyle = vis(m.nm) ? lc : 'rgb(200,80,80)'; c.lineWidth = 1.2; c.beginPath(); for (let i = 0; i <= 600; i++) { const t = -2 * Tp + 4 * Tp * i / 600, y = py0 + pH * (1 - 0.5 * (1 + env(t) * Math.cos(TAU * t / tper))); i ? c.lineTo(Xt(t), y) : c.moveTo(Xt(t), y); } c.stroke(); }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, py0 + pH); c.lineTo(x1, py0 + pH); c.stroke();
        for (const k of [-1, 0, 1]) kit.label(c, k === 0 ? '0' : (k < 0 ? '−' : '+') + tfmt(Tp), Xt(k * Tp), py0 + pH + 13, { align: 'center', size: 10, color: C.muted });
        kit.label(c, 'the shortest pulse (intensity' + (cycles < 40 ? ' and the field of the light' : '') + ')', (x0 + x1) / 2, py0 - 12, { align: 'center', size: 11, color: C.text, weight: 650 });
        // all the media, by shortest pulse
        const bx0 = wl + 100, bx1 = W - 20, bw = bx1 - bx0, lt = s => Math.log10(s * 1e15) / 5;   // 1 fs … 100 ps
        kit.label(c, 'shortest pulse of each medium', (wl + W) / 2 + 20, 11, { align: 'center', size: 11, color: C.text, weight: 650 });
        rows = [];
        MEDIA.forEach((q, i) => {
          const y = 40 + i * (Hh - 80) / MEDIA.length + 12, t = tmin(q, V.share), on = i === V.med;
          if (on) { c.save(); c.globalAlpha = 0.16; c.fillStyle = C.accent; c.fillRect(wl + 6, y - 16, W - wl - 10, 32); c.restore(); }
          kit.label(c, q.name.replace(' (phosphate)', ''), wl + 12, y - 5, { size: 10.5, color: on ? C.text : C.muted, weight: on ? 700 : 500 });
          kit.label(c, tfmt(t), wl + 12, y + 8, { size: 10, color: C.faint });
          c.fillStyle = on ? C.warn : C.faint; c.fillRect(bx0, y - 5, Math.max(2, bw * clamp(lt(t), 0.02, 1)), 10);
          rows.push({ y0: y - 16, y1: y + 16, i });
        });
        for (const [s, lab] of [[1e-15, '1 fs'], [1e-14, '10 fs'], [1e-13, '100 fs'], [1e-12, '1 ps'], [1e-11, '10 ps']]) kit.label(c, lab, bx0 + bw * lt(s), Hh - 10, { align: 'center', size: 9.5, color: C.faint });
        ro.set('host', m.host); ro.set('bw', m.dl + ' nm = ' + (dnu(m) / 1e12).toFixed(dnu(m) < 1e12 ? 2 : 0) + ' THz');
        ro.set('t', tfmt(Tp) + ' (0.44 ÷ the bandwidth used)'); ro.set('cyc', cycles < 1e4 ? cycles.toFixed(cycles < 10 ? 1 : 0) + ' cycles of ' + nmText(m.nm) + ' light' : 'thousands of cycles');
        ro.set('tune', m.tune); ro.set('life', m.life);
      }, box.stage);
      kit.click(st, p => { const r = rows.find(q => p.y >= q.y0 && p.y < q.y1 && p.x > st.W * 0.58); if (r) { ctl.set('med', r.i); loop.once(); } }, p => p.x > st.W * 0.58 && rows.some(q => p.y >= q.y0 && p.y < q.y1));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the beam of a diode laser */
  Hyper.sim('lz-diode', {
    title: 'The beam of a diode laser: elliptical and astigmatic',
    blurb: `The light leaves a spot about a micrometre high and a few micrometres wide. A beam that starts that small must spread: the narrow direction (the **fast axis**) spreads by 30° or more, the wide one (the **slow axis**) by 8° to 12°. Two views of the same beam share one scale, and the picture on the right is the spot on a screen.

The widths are Gaussian beam widths (the 1/e² half-width, full divergence quoted as FWHM). The slow axis of a real diode seems to start a little behind the facet: that offset is the **astigmatism**.

**Try this**
- Move the screen away: the spot becomes an ellipse, about three times taller than wide. A circular lens cannot make it round.
- Make the emitting spot taller (2 µm): the fast axis spreads less. Make the stripe narrower: the slow axis spreads more. A small source means a wide beam.
- Change the colour: the shorter the wavelength, the less the beam spreads from the same spot.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', type: 'select', label: 'The diode', options: [['Blue-violet, 405 nm', 405], ['Red, 650 nm', 650], ['Near infrared, 808 nm', 808], ['Pump, 980 nm', 980]], value: params.nm || 808 },
        { id: 'hf', label: 'Height of the emitting spot (fast axis)', min: 0.5, max: 2, step: 0.05, value: 1.0, unit: 'µm' },
        { id: 'wd', label: 'Width of the stripe (slow axis)', min: 1.5, max: 10, step: 0.1, value: 3, unit: 'µm' },
        { id: 'ast', label: 'Astigmatism: the slow axis starts behind the facet by', min: 0, max: 30, step: 1, value: 10, unit: 'µm' },
        { id: 'z', label: 'Distance from the facet', min: 0.1, max: 100, value: 10, log: true, sig: 2, unit: 'mm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fast', 'Fast axis: full divergence (FWHM)'], ['slow', 'Slow axis: full divergence (FWHM)'], ['zr', 'Rayleigh range, fast · slow'], ['spot', 'Spot at the screen (1/e² width)'], ['ell', 'Ellipticity at the screen']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, nm = V.nm, lam = nm * 1e-9;
        const w0f = V.hf * 0.5e-6, w0s = V.wd * 0.5e-6, z = V.z * 1e-3, a = V.ast * 1e-6;
        const wf = O.beam.w(z, w0f, nm, 1), ws = O.beam.w(z + a, w0s, nm, 1);               // 1/e² half-widths at the screen, m
        const thf = O.beam.divergence(w0f, nm, 1), ths = O.beam.divergence(w0s, nm, 1);       // 1/e² half-angles, rad
        const wl = Math.max(W * 0.6, 300), x0 = 30, x1 = wl - 14, ph = (Hh - 50) / 2, hmax = Math.max(wf, ws, 1e-9) * 1.1 * 1e3;      // mm
        const lc = vis(nm) ? nm : 700;
        const panel = (yc, w0, zoff, label, tag) => {
          const s = (ph / 2 - 6) / hmax, X = zz => x0 + (x1 - x0) * zz / V.z;                // zz in mm
          S.beam(c, x0, x1, yc, x => { const zz = (x - x0) / (x1 - x0) * z; return O.beam.w(zz + zoff, w0, nm, 1) * 1e3 * s; }, { nm: lc, alpha: 0.35 });
          S.axis(c, x0 - 12, yc, x1 + 6);
          c.fillStyle = C.muted; c.fillRect(x0 - 16, yc - 7, 16, 14); c.fillStyle = vis(nm) ? S.nm(nm) : C.bad; c.fillRect(x0 - 2, yc - 1.5, 3, 3);
          kit.label(c, label, x0, yc - ph / 2 + 2, { size: 11, color: C.text, weight: 650 });
          kit.label(c, tag, x1, yc - ph / 2 + 2, { align: 'right', size: 10.5, color: C.muted });
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x1, yc - ph / 2 + 14); c.lineTo(x1, yc + ph / 2 - 6); c.stroke();
          return s;
        };
        const yc1 = 22 + ph / 2, yc2 = 22 + ph + 20 + ph / 2;
        const s1 = panel(yc1, w0f, 0, 'fast axis: side view', '2w = ' + (2 * wf * 1e3).toFixed(2) + ' mm');
        panel(yc2, w0s, a, 'slow axis: top view', '2w = ' + (2 * ws * 1e3).toFixed(2) + ' mm');
        kit.label(c, 'distance from the facet: 0 → ' + V.z + ' mm', (x0 + x1) / 2, Hh - 8, { align: 'center', size: 10.5, color: C.faint });
        // the spot on a screen: a Gaussian ellipse, tall in the fast axis
        const Q = Math.min(W - wl - 24, Hh - 90), qx = wl + 10 + (W - wl - 20 - Q) / 2, qy = 46, ext = 1.7 * Math.max(wf, ws);
        S.image(c, qx, qy, Q, Q, 56, 56, (u, v) => { const x = (u - 0.5) * 2 * ext, y = (v - 0.5) * 2 * ext; return Math.exp(-2 * (x * x / (ws * ws) + y * y / (wf * wf))); }, { nm: lc, key: [wf.toFixed(7), ws.toFixed(7), nm].join(), id: 'diode', gamma: 0.8 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(qx + 0.5, qy + 0.5, Q - 1, Q - 1);
        kit.label(c, 'the spot on a screen', qx + Q / 2, qy - 14, { align: 'center', size: 11, color: C.text, weight: 650 });
        kit.label(c, (2 * ws * 1e3).toFixed(2) + ' mm wide × ' + (2 * wf * 1e3).toFixed(2) + ' mm tall', qx + Q / 2, qy + Q + 14, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'fast axis is vertical', qx + Q / 2, qy + Q + 28, { align: 'center', size: 10, color: C.faint });
        const fw = thf * 1.1774 * 180 / PI, sw = ths * 1.1774 * 180 / PI;
        ro.set('fast', fw.toFixed(1) + '°'); ro.set('slow', sw.toFixed(1) + '°');
        ro.set('zr', (O.beam.rayleigh(w0f, nm, 1) * 1e6).toFixed(1) + ' µm · ' + (O.beam.rayleigh(w0s, nm, 1) * 1e6).toFixed(1) + ' µm');
        ro.set('spot', (2 * ws * 1e3).toFixed(2) + ' × ' + (2 * wf * 1e3).toFixed(2) + ' mm at ' + V.z.toFixed(V.z < 10 ? 1 : 0) + ' mm');
        ro.set('ell', (wf / ws).toFixed(2) + ' : 1' + (wf / ws > 1.5 ? ' (a circular lens will not make it round)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ wavelength against temperature */
  const DIODES = { 650: { kg: 0.22, name: 'red' }, 808: { kg: 0.27, name: 'near infrared' }, 980: { kg: 0.33, name: 'pump' } };
  const PH0 = 0.37;                                                          // where a cavity mode sits in its spacing at 25 °C (arbitrary but fixed)
  Hyper.sim('lz-tuning', {
    title: 'A diode laser and the temperature: drift, hops and the absorption line',
    blurb: `The wavelength of a diode laser follows its temperature in two ways at once. The **gain peak** (set by the semiconductor's band gap) moves at about 0.3 nm per kelvin; the **cavity modes** (set by the optical length of the chip) move five times more slowly, at about 0.06 nm per kelvin. The laser sits on the mode nearest the gain peak, so it creeps along with its mode, then hops to the next one: a staircase.

The drift rates are typical values (they differ from one diode to another by 20 % or so). In a real diode the hop has some hysteresis: it hops a little later on the way up than on the way down.

**Try this**
- *Fabry–Perot*: slide the temperature slowly and watch the bold mode creep, then jump. A longer chip has more closely spaced modes and smaller hops.
- *DFB*: a grating picks one mode, and the wavelength drifts smoothly at the slow rate, without hops. That is the diode to use when the wavelength must be exact.
- *The pump* view: a diode bar must sit on a narrow absorption line of the crystal it pumps. Warm it until the bar's emission lies on the line and the absorbed share is at its maximum: that is why pump diodes are held at a set temperature by a thermoelectric cooler.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const pump = !!params.pump;
      const st = kit.stage(box.stage, { aspect: pump ? 0.5 : 0.46, minH: 260, maxH: pump ? 380 : 340 });
      const defs = pump ? [{ id: 'T', label: 'Temperature of the diode bar', min: 10, max: 60, step: 0.5, value: 25, unit: '°C' }] : [
        { id: 'nm', type: 'select', label: 'The diode (at 25 °C)', options: [['Red, 650 nm', 650], ['Near infrared, 808 nm', 808], ['Pump, 980 nm', 980]], value: params.nm || 808 },
        { id: 'kind', type: 'select', label: 'Type', options: [['Fabry–Perot (cleaved facets)', 'fp'], ['DFB (a grating selects the mode)', 'dfb']], value: params.kind || 'fp' },
        { id: 'L', label: 'Length of the chip', min: 0.3, max: 2, step: 0.05, value: 0.5, unit: 'mm' },
        { id: 'T', label: 'Temperature', min: 10, max: 60, step: 0.1, value: 25, unit: '°C' }
      ];
      const ctl = kit.controls(box.side, defs, () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, pump ? [['em', 'Emission of the bar (centre)'], ['line', 'Absorption line of Nd:YAG'], ['ov', 'Effective absorption (against the peak value)'], ['T0', 'Temperature that centres it']] : [['g', 'Gain peak'], ['lam', 'The laser'], ['fsr', 'Spacing of the cavity modes'], ['rates', 'Drift: gain peak · cavity mode'], ['hops', 'Hops per kelvin (the plot shows 10 K)']]);
      const plot = pump ? null : kit.plot(box.stage, { x: { label: 'temperature (°C)', min: 10, max: 60 }, y: { label: 'laser wavelength (nm)' }, series: [] }, 190);
      // the laser's wavelength at temperature T for the chosen diode
      const par = () => { const l0 = pump ? 805 : V.nm, kg = pump ? 0.28 : DIODES[V.nm].kg; return { l0, kg, km: 7.5e-5 * l0, fsr: l0 * l0 / (2 * 4.2 * (pump ? 1 : V.L) * 1e6), dfb: !pump && V.kind === 'dfb' }; };
      const lamAt = (T, p) => { const dT = T - 25; if (p.dfb) return p.l0 + p.km * dT; const m = Math.round((p.kg - p.km) * dT / p.fsr - PH0); return p.l0 + (m + PH0) * p.fsr + p.km * dT; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, p = par(), dT = V.T - 25;
        const lo = pump ? 800 : p.l0 - 8, hi = pump ? 816 : p.l0 + 12, x0 = 24, x1 = W - 20, by = Hh - 38, top = 30, X = n => x0 + (x1 - x0) * (n - lo) / (hi - lo), Y = u => by - (by - top) * u;
        const gp = p.l0 + p.kg * dT;
        if (pump) {
          const sA = 1.5 / 2.355, sS = 2.0 / 2.355, line = 808.6;
          const A = n => Math.exp(-0.5 * Math.pow((n - line) / sA, 2)), Sx = n => Math.exp(-0.5 * Math.pow((n - gp) / sS, 2));
          const fill = (f, col) => { c.beginPath(); for (let i = 0; i <= 200; i++) { const n = lo + (hi - lo) * i / 200; i ? c.lineTo(X(n), Y(f(n))) : c.moveTo(X(n), Y(f(n))); } c.lineTo(x1, by); c.lineTo(x0, by); c.closePath(); c.fillStyle = col; c.fill(); };
          fill(A, 'rgba(34,179,122,0.28)'); fill(n => Sx(n) * 0.85, 'rgba(224,60,50,0.35)');
          c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 200; i++) { const n = lo + (hi - lo) * i / 200; i ? c.lineTo(X(n), Y(A(n))) : c.moveTo(X(n), Y(A(n))); } c.stroke();
          c.strokeStyle = 'rgb(224,70,60)'; c.beginPath(); for (let i = 0; i <= 200; i++) { const n = lo + (hi - lo) * i / 200; i ? c.lineTo(X(n), Y(Sx(n) * 0.85)) : c.moveTo(X(n), Y(Sx(n) * 0.85)); } c.stroke();
          kit.label(c, 'absorption line of the crystal (schematic: about 1.5 nm wide)', X(line) + 12, Y(1) + 4, { size: 10.5, color: C.ok });
          kit.label(c, 'emission of the diode bar (about 2 nm wide)', X(gp), Y(0.85) - 14, { align: 'center', size: 10.5, color: 'rgb(224,70,60)' });
          const ov = sA / Math.sqrt(sA * sA + sS * sS) * Math.exp(-0.5 * Math.pow(gp - line, 2) / (sA * sA + sS * sS));
          ro.set('em', gp.toFixed(2) + ' nm (805 nm at 25 °C, drifting 0.28 nm/K)'); ro.set('line', '808.6 nm'); ro.set('ov', (100 * ov).toFixed(0) + ' % (the most this bar can reach: ' + (100 * sA / Math.sqrt(sA * sA + sS * sS)).toFixed(0) + ' %)');
          ro.set('T0', (25 + (line - 805) / 0.28).toFixed(1) + ' °C');
        } else {
          // the gain curve, the cavity modes, the lasing mode
          const g = n => Math.exp(-4 * Math.LN2 * Math.pow((n - gp) / 25, 2));
          c.beginPath(); for (let i = 0; i <= 160; i++) { const n = lo + (hi - lo) * i / 160; i ? c.lineTo(X(n), Y(0.9 * g(n))) : c.moveTo(X(n), Y(0.9 * g(n))); }
          c.lineTo(x1, by); c.lineTo(x0, by); c.closePath(); c.fillStyle = 'rgba(224,160,48,0.16)'; c.fill();
          c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); for (let i = 0; i <= 160; i++) { const n = lo + (hi - lo) * i / 160; i ? c.lineTo(X(n), Y(0.9 * g(n))) : c.moveTo(X(n), Y(0.9 * g(n))); } c.stroke();
          const lasing = lamAt(V.T, p);
          if (!p.dfb) {
            const dense = (x1 - x0) * p.fsr / (hi - lo) < 2.5;
            c.strokeStyle = C.faint; c.lineWidth = 1; c.globalAlpha = dense ? 0.4 : 0.8; c.beginPath();
            for (let m = Math.ceil((lo - p.l0 - p.km * dT) / p.fsr - PH0); ; m++) { const n = p.l0 + (m + PH0) * p.fsr + p.km * dT; if (n > hi) break; c.moveTo(X(n), by); c.lineTo(X(n), Y(0.9 * g(n) * 0.6)); }
            c.stroke(); c.globalAlpha = 1;
          }
          c.strokeStyle = vis(lasing) ? S.nm(lasing) : 'rgb(200,70,70)'; c.lineWidth = 3.4; c.beginPath(); c.moveTo(X(lasing), by); c.lineTo(X(lasing), Y(0.95)); c.stroke();
          kit.label(c, p.dfb ? 'the DFB laser' : 'the lasing mode', X(lasing), Y(0.95) - 9, { align: 'center', size: 10.5, color: C.text, weight: 650 });
          kit.label(c, 'gain peak', X(gp), Y(0.9) + 14, { align: 'center', size: 10.5, color: C.warn });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, by); c.lineTo(x1, by); c.stroke();
          ro.set('g', gp.toFixed(2) + ' nm'); ro.set('lam', lasing.toFixed(3) + ' nm'); ro.set('fsr', p.dfb ? 'not used: the grating fixes the mode' : p.fsr.toFixed(3) + ' nm (n = 4.2 assumed, group index)');
          ro.set('rates', p.kg.toFixed(2) + ' · ' + p.km.toFixed(3) + ' nm per K');
          ro.set('hops', p.dfb ? 'none' : ((p.kg - p.km) / p.fsr).toFixed(1) + ' per kelvin');
          const T0 = V.T - 5, pts = [], gpts = []; for (let T = T0; T <= T0 + 10.001; T += 0.05) { pts.push([T, lamAt(T, p)]); gpts.push([T, p.l0 + p.kg * (T - 25)]); }
          plot.set({ x: { label: 'temperature (°C): a window of 10 K about the setting', min: T0, max: T0 + 10 }, y: { label: 'wavelength (nm)', min: p.l0 + p.kg * (T0 - 25) - 0.5, max: p.l0 + p.kg * (T0 + 10 - 25) + 0.5 }, series: [{ pts, label: 'the laser', color: C.accent, width: 2.4 }, { pts: gpts, label: 'gain peak', color: C.warn, dash: [5, 4] }], marks: [{ x: V.T, y: lasing, label: 'now' }] });
        }
        for (let n = Math.ceil(lo / 2) * 2; n <= hi; n += pump ? 4 : 4) { c.strokeStyle = C.axis; c.beginPath(); c.moveTo(X(n), by); c.lineTo(X(n), by + 4); c.stroke(); kit.label(c, n + '', X(n), by + 13, { align: 'center', size: 10, color: C.muted }); }
        kit.label(c, 'wavelength (nm)', (x0 + x1) / 2, by + 29, { align: 'center', size: 10.5, color: C.faint });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the mirrors of a VCSEL */
  Hyper.sim('lz-vcsel', {
    title: 'The mirrors of a VCSEL',
    blurb: `A vertical-cavity laser has a gain region only a few tens of nanometres thick: a light wave passes it so quickly that it gains less than 1 %. The mirrors must lose even less. They are stacks of quarter-wave layers of two semiconductors (a **distributed Bragg reflector**): each interface reflects a little, and all the reflections add in phase.

The graph shows the light that gets through a mirror (log scale). The red line is what the gain region can tolerate. A stack works only when its dip, at the design wavelength, is below that line.

**Try this**
- With 22 pairs the mirror loses about 0.5 % and the laser works. Take the pairs down to 15: the mirror loses about 4 %, far above the line.
- Lower the contrast between the two indices: the mirror needs many more pairs, and its stop band, where it reflects well, narrows.
- Fewer quantum wells, or a lower gain: the line drops and the mirrors must be better still.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 280, maxH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'nm', type: 'select', label: 'Design wavelength', options: [['850 nm (data links, mice)', 850], ['940 nm (sensing)', 940]], value: params.nm || 850 },
        { id: 'N', label: 'Pairs of layers in the mirror', min: 4, max: 40, step: 1, value: 22 },
        { id: 'nH', label: 'Index of the high-index layer', min: 3.3, max: 3.7, step: 0.01, value: 3.5 },
        { id: 'nL', label: 'Index of the low-index layer', min: 2.8, max: 3.3, step: 0.01, value: 3.0 },
        { id: 'qw', label: 'Quantum wells (8 nm each)', min: 1, max: 5, step: 1, value: 3 },
        { id: 'g', label: 'Material gain at threshold', min: 500, max: 5000, step: 100, value: 2000, unit: 'cm⁻¹' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['R', 'Mirror reflectance at the design wavelength'], ['need', 'Reflectance the gain demands'], ['v', 'The stack is'], ['band', 'Stop band (where it reflects well)'], ['thick', 'Thickness of one mirror'], ['mode', 'Cavity modes']]);
      const plot = kit.plot(box.stage, { x: { label: 'wavelength (nm)' }, y: { label: 'light through the mirror (%)', log: true, min: 0.01, max: 100 }, series: [] }, 200);
      let cacheKey = '', pts = [], Rc = 0;
      const stack = () => {
        const key = [V.nm, V.N, V.nH, V.nL].join();
        if (key !== cacheKey) {
          cacheKey = key; const lay = [];
          for (let i = 0; i < V.N; i++) { lay.push({ n: V.nL, d: V.nm / (4 * V.nL) }); lay.push({ n: V.nH, d: V.nm / (4 * V.nH) }); }
          const def = { n0: V.nH, ns: V.nH, layers: lay };
          Rc = O.film.stack(def, V.nm).R; pts = [];
          for (let i = 0; i <= 140; i++) { const nm = V.nm * (0.82 + 0.36 * i / 140), R = O.film.stack(def, nm).R; pts.push([nm, Math.max(1e-4, 100 * (1 - R))]); }
        }
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        stack();
        const d = V.qw * 8e-9, Rneed = Math.exp(-2 * V.g * 100 * d), ok = Rc >= Rneed;
        const stop = 4 * V.nm / PI * Math.asin((V.nH - V.nL) / (V.nH + V.nL)), tN = V.N * (V.nm / (4 * V.nL) + V.nm / (4 * V.nH));
        // the cross-section, to scale in the vertical direction
        const total = 2 * tN + 600, sc = (Hh - 54) / total, cx = Math.min(W * 0.3, 190), wx = Math.min(150, W * 0.28);
        let y = 30;
        const band = (t, n) => { const h = Math.max(0.6, t * sc); c.fillStyle = n === V.nH ? (C.dark ? 'rgb(130,160,230)' : 'rgb(90,120,200)') : (C.dark ? 'rgb(70,90,150)' : 'rgb(170,190,235)'); c.fillRect(cx - wx / 2, y, wx, h + 0.4); y += h; };
        const y0 = y;
        for (let i = 0; i < V.N; i++) { band(V.nm / (4 * V.nL), V.nL); band(V.nm / (4 * V.nH), V.nH); }
        const yTop = y; c.fillStyle = 'rgba(224,160,48,0.55)'; const hc = Math.max(5, 250 * sc); c.fillRect(cx - wx / 2, y, wx, hc);
        for (let i = 0; i < V.qw; i++) { c.fillStyle = C.bad; c.fillRect(cx - wx / 2, y + hc * (0.5 + (i - (V.qw - 1) / 2) * 0.2) - 0.8, wx, 1.6); }
        y += hc; const yCav = y;
        for (let i = 0; i < V.N; i++) { band(V.nm / (4 * V.nL), V.nL); band(V.nm / (4 * V.nH), V.nH); }
        c.fillStyle = C.faint; c.fillRect(cx - wx / 2, y, wx, 14); kit.label(c, 'substrate', cx, y + 22, { align: 'center', size: 10, color: C.faint });
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(cx - wx / 2 + 0.5, y0 + 0.5, wx - 1, y - y0 - 1);
        S.ray(c, [[cx, y0 - 2], [cx, 8]], { color: C.bad, width: 3, arrows: true, minArrow: 10 });
        kit.label(c, 'light out', cx + 14, 12, { size: 10.5, color: C.bad });
        kit.label(c, 'top mirror: ' + V.N + ' pairs', cx + wx / 2 + 8, (y0 + yTop) / 2, { size: 10.5, color: C.muted });
        kit.label(c, 'one wavelength thick: the gain region', cx + wx / 2 + 8, (yTop + yCav) / 2 - 2, { size: 10.5, color: C.warn });
        kit.label(c, 'with ' + V.qw + ' quantum well' + (V.qw > 1 ? 's' : ''), cx + wx / 2 + 8, (yTop + yCav) / 2 + 11, { size: 10, color: C.faint });
        kit.label(c, 'bottom mirror', cx + wx / 2 + 8, (yCav + y) / 2, { size: 10.5, color: C.muted });
        kit.label(c, 'layers drawn to scale in thickness; the cavity is about a quarter of a micrometre', Math.min(W - 10, cx + wx / 2 + 8 + 330), Hh - 10, { align: 'right', size: 10, color: C.faint });
        // the verdict at the right
        const vx = Math.max(cx + wx / 2 + 250, W * 0.62);
        if (vx < W - 80) { kit.label(c, 'mirror: ' + (100 * Rc).toFixed(2) + ' %', vx, 60, { size: 13, color: ok ? C.ok : C.bad, weight: 700 }); kit.label(c, 'needed: ' + (100 * Rneed).toFixed(2) + ' %', vx, 80, { size: 13, color: C.text, weight: 700 }); kit.label(c, ok ? 'the laser can work' : 'the mirror leaks too much', vx, 100, { size: 11.5, color: ok ? C.ok : C.bad }); }
        ro.set('R', (100 * Rc).toFixed(2) + ' %  (loss ' + (100 * (1 - Rc)).toFixed(2) + ' %)');
        ro.set('need', (100 * Rneed).toFixed(2) + ' %  (R = e^(−2gd) with the field doubled at the wells)');
        ro.set('v', ok ? 'good enough' : 'not good enough: add pairs or raise the contrast');
        ro.set('band', stop.toFixed(0) + ' nm wide (about ' + (100 * stop / V.nm).toFixed(0) + ' % of the wavelength)');
        ro.set('thick', (tN / 1000).toFixed(2) + ' µm');
        ro.set('mode', 'one: the spacing (about 100 nm) is wider than the gain');
        const dip = Math.max(1e-4, 100 * (1 - Rneed));
        plot.set({ x: { label: 'wavelength (nm)', min: V.nm * 0.82, max: V.nm * 1.18 }, y: { label: 'light through the mirror (%)', log: true, min: 0.01, max: 100 }, series: [{ pts, label: 'the stack', color: C.accent, width: 2.4 }], hlines: [{ y: dip, label: 'the most the gain tolerates', color: C.bad }], vlines: [{ x: V.nm, label: 'design wavelength' }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a double-clad fibre laser */
  Hyper.sim('lz-fibre', {
    title: 'A fibre laser: pump absorbed along the fibre, signal growing',
    blurb: `A double-clad fibre guides two lights. The pump (from diodes, poor beam quality) travels in the large inner cladding and crosses the small doped core again and again, giving its energy to the ytterbium ions. The signal grows in the core and has a clean, single-mode beam. The fibre is a **brightness converter**.

The cross-section on the right is to scale: the core really is that small a part of the cladding, so the pump is absorbed slowly, metres at a time. The growth of the signal is **schematic** (the pump absorbed, times a fixed efficiency); a real design needs rate equations. Both lights are invisible infrared, drawn in colours that separate them.

**Try this**
- Make the cladding smaller (125 µm) at fixed core: the pump is absorbed over a much shorter fibre.
- Make the fibre too short: pump comes out of the far end, wasted. Too long: a few metres of fibre only add loss.
- Raise the beam-quality number M²: the brightness gain falls, but it stays enormous.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250, maxH: 340 });
      let clk = 0;
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Pump power launched', min: 10, max: 3000, value: 1000, log: true, sig: 3, unit: 'W' },
        { id: 'dc', label: 'Core diameter', min: 6, max: 40, step: 1, value: 20, unit: 'µm' },
        { id: 'dd', label: 'Inner cladding diameter', min: 125, max: 600, step: 5, value: 400, unit: 'µm' },
        { id: 'Lf', label: 'Length of the fibre', min: 1, max: 60, value: 15, log: true, sig: 3, unit: 'm' },
        { id: 'ac', label: 'Pump absorption of the doped core alone', min: 100, max: 2000, value: 600, log: true, sig: 3, unit: 'dB/m' },
        { id: 'M2', label: 'Beam quality M² of the signal', min: 1.02, max: 10, value: 1.1, log: true, sig: 3 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['acl', 'Pump absorption along the fibre'], ['L90', 'Length that absorbs 90 %'], ['abs', 'Pump absorbed'], ['out', 'Signal out (schematic)'], ['bpp', 'Beam parameter product: pump · signal'], ['br', 'Brightness gained']]);
      const plot = kit.plot(box.stage, { x: { label: 'distance along the fibre (m)' }, y: { label: 'power (W)' }, series: [] }, 150);
      const ETA = 0.78;                                              // overall: quantum defect 976 → 1070 nm (91 %) times the share that reaches the output
      const loop = kit.loop(dt => {
        clk += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const alc = V.ac * Math.pow(V.dc / V.dd, 2), Lf = V.Lf, ab = z => 1 - Math.pow(10, -alc * z / 10), absTot = ab(Lf), out = ETA * V.P * absTot;
        const xa = 36, xb = W - 36, Lpx = xb - xa, cy = 66, hC = 52, hc = Math.max(1.6, hC * V.dc / V.dd), insetR = 36, ix = W - insetR - 20, iy = Hh - insetR - 16;
        // the fibre
        c.fillStyle = S.glass(0.22); c.fillRect(xa, cy - hC / 2, Lpx, hC); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.strokeRect(xa + 0.5, cy - hC / 2 + 0.5, Lpx - 1, hC - 1);
        // the signal in the core: brighter along the way
        for (let i = 0; i < 60; i++) { const u0 = i / 60, u1 = (i + 1) / 60, p = ETA * ab(Lf * (u0 + u1) / 2) / ETA; c.fillStyle = 'rgba(229,72,77,' + (0.18 + 0.8 * p) + ')'; c.fillRect(xa + Lpx * u0, cy - hc / 2, Lpx / 60 + 0.6, hc); }
        for (let k = 0; k < 8; k++) { const u = (clk * 0.35 + k / 8) % 1; c.beginPath(); c.arc(xa + Lpx * u, cy, Math.max(1.6, hc / 2 + 0.6), 0, TAU); c.fillStyle = 'rgba(255,200,200,' + (0.2 + 0.7 * ab(Lf * u)) + ')'; c.fill(); }
        // the pump rays, zig-zagging across the cladding and fading as they are absorbed
        for (let k = 0; k < 11; k++) {
          const u = (clk * 0.12 + k / 11) % 1, fade = Math.pow(10, -alc * Lf * u / 10), tri = q => { const f = ((q % 1) + 1) % 1; return 4 * Math.abs(f - 0.5) - 1; };
          const x1 = xa + Lpx * u, y1 = cy + hC / 2 * 0.94 * tri(u * 9 + k * 0.173), x2 = xa + Lpx * (u + 0.012), y2 = cy + hC / 2 * 0.94 * tri((u + 0.012) * 9 + k * 0.173);
          c.strokeStyle = 'rgba(224,160,48,' + (0.15 + 0.8 * fade) + ')'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x1, y1); c.lineTo(Math.min(x2, xb), y2); c.stroke();
        }
        // the Bragg gratings that serve as mirrors, the pump coming in, the beam going out
        for (const [x, lab, al] of [[xa + 6, 'high reflector', 'left'], [xb - 18, 'output coupler', 'right']]) { c.strokeStyle = C.accent; c.lineWidth = 1.4; c.beginPath(); for (let i = 0; i < 6; i++) { c.moveTo(x + i * 2.4, cy - hC / 2 + 4); c.lineTo(x + i * 2.4, cy + hC / 2 - 4); } c.stroke(); kit.label(c, lab, al === 'left' ? x - 4 : x + 14, cy + hC / 2 + 12, { align: al, size: 10.5, color: C.muted }); }
        kit.arrow(c, xa - 28, cy, xa - 4, cy, C.warn, 2.2, 8); kit.label(c, 'pump', xa - 30, cy - 12, { size: 10.5, color: C.warn });
        kit.arrow(c, xb + 4, cy, xb + 28, cy, C.bad, 2.4, 8); kit.label(c, 'signal', xb + 4, cy - 12, { size: 10.5, color: C.bad });
        kit.label(c, 'pump (amber) and signal (red): both invisible infrared, drawn in colours that separate them', xa, 14, { size: 10.5, color: C.faint });
        // the cross-section to scale
        c.beginPath(); c.arc(ix, iy, insetR, 0, TAU); c.fillStyle = S.glass(0.3); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.2; c.stroke();
        c.beginPath(); c.arc(ix, iy, Math.max(1.2, insetR * V.dc / V.dd), 0, TAU); c.fillStyle = C.bad; c.fill();
        kit.label(c, 'to scale: core ' + V.dc + ' µm in a ' + V.dd + ' µm cladding', ix - insetR - 10, iy - 4, { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, 'area ratio ' + (Math.pow(V.dd / V.dc, 2)).toFixed(0) + ' : 1', ix - insetR - 10, iy + 10, { align: 'right', size: 10.5, color: C.muted });
        // numbers
        const bppP = V.dd / 2 / 1000 * 460, bppS = O.beam.bpp(V.dc * 0.5e-6, 1070, V.M2) * 1e6, gain = (out / V.P) * Math.pow(bppP / bppS, 2);
        ro.set('acl', alc.toFixed(2) + ' dB/m (core absorption × area ratio)');
        ro.set('L90', (10 / alc).toFixed(1) + ' m  (this fibre: ' + Lf.toFixed(Lf < 10 ? 1 : 0) + ' m)');
        ro.set('abs', (100 * absTot).toFixed(1) + ' %' + (absTot < 0.9 ? ' (too short: pump wasted)' : ''));
        ro.set('out', out.toFixed(out < 10 ? 1 : 0) + ' W (' + Math.round(100 * ETA * absTot) + ' % of the pump)');
        ro.set('bpp', bppP.toFixed(0) + ' · ' + bppS.toFixed(2) + ' mm·mrad (pump filling a 0.46 NA cladding)');
        ro.set('br', gain >= 1000 ? 'about ' + (Math.round(gain / 100) * 100).toLocaleString('en-GB') + ' times' : gain.toFixed(0) + ' times');
        const pp = [], ps = []; for (let i = 0; i <= 60; i++) { const z = Lf * i / 60; pp.push([z, V.P * (1 - ab(z))]); ps.push([z, ETA * V.P * ab(z)]); }
        plot.set({ x: { label: 'distance along the fibre (m)', min: 0, max: Lf }, y: { label: 'power (W)', min: 0, max: V.P * 1.05 }, series: [{ pts: pp, label: 'pump left', color: C.warn, width: 2.2 }, { pts: ps, label: 'signal (schematic)', color: C.bad, width: 2.2 }] });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ second-harmonic generation */
  Hyper.sim('lz-shg', {
    title: 'Frequency doubling: why phase matching matters',
    blurb: `A crystal makes light of twice the frequency by letting two photons of the laser combine into one. The new light is made all along the crystal; it adds up only if it stays in step with the light made earlier. In an ordinary material the two colours travel at different speeds, so the new light is made in step for one **coherence length** and then out of step, and the harmonic grows and shrinks again.

Three crystals are drawn: one with **no phase matching** (a glass-like material), one **phase-matched** (the light stays in step all along), and one **quasi-phase-matched** (the crystal's nonlinear sign is flipped every coherence length, as in periodically poled crystals). The conversion saturates as the pump is used up: tanh² of the amplitude.

**Try this**
- Raise the pump strength: the phase-matched crystal converts nearly everything within about ten coherence lengths; the unmatched one never exceeds a fraction of a per cent.
- Compare the quasi-phase-matched curve with the phase-matched one: slower, because only 2/π of the amplitude is gained, but just as complete if the crystal is long enough.
- Change the fundamental and read the coherence length of fused silica: tens of micrometres at best, which is why a thin slice of glass makes essentially no green light.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 150, maxH: 220 });
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'The fundamental laser', options: [['Nd:YAG or Nd:YVO₄, 1064 nm', 1064], ['Yb:YAG or ytterbium fibre, 1030 nm', 1030], ['Ti:sapphire, 800 nm', 800], ['Erbium fibre, 1550 nm', 1550]], value: params.f || 1064 },
        { id: 'gam', label: 'Pump strength (growth per coherence length)', min: 0.01, max: 0.3, value: 0.1, log: true, sig: 2 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['chain', 'The harmonics'], ['Lc', 'Coherence length in fused silica (no phase matching)'], ['qpm', 'Poling period if the crystal were like glass'], ['end', 'Converted after 20 coherence lengths']]);
      const plot = kit.plot(box.stage, { x: { label: 'distance in the crystal, in coherence lengths', min: 0, max: 20 }, y: { label: 'share of the pump converted (%)', min: 0, max: 100 }, series: [] }, 230);
      // the quasi-phase-matched amplitude: the sign of the drive flips every coherence length, summed numerically
      const DU = 0.025, NQ = 800, qre = new Float64Array(NQ + 1), qim = new Float64Array(NQ + 1);
      for (let i = 1; i <= NQ; i++) { const u = (i - 0.5) * DU, d = Math.floor(u) % 2 === 0 ? 1 : -1; qre[i] = qre[i - 1] + d * Math.cos(PI * u) * DU; qim[i] = qim[i - 1] + d * Math.sin(PI * u) * DU; }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, f = V.f;
        const cols = [1, 2, 3, 4, 5], names = ['fundamental', 'second harmonic', 'third harmonic', 'fourth harmonic', 'fifth harmonic'], how = ['', 'ω + ω', 'ω + 2ω', '2ω + 2ω', 'ω + 4ω'];
        cols.forEach((n, i) => {
          const nm = f / n, x = W * (0.1 + 0.2 * i), y = 44;
          marker(c, S, C, x, y, 17, nm, C.text);
          kit.label(c, nmText(nm), x, y + 30, { align: 'center', size: 12, color: C.text, weight: 650 });
          kit.label(c, n === 1 ? 'ω' : n + 'ω', x, y - 28, { align: 'center', size: 11, color: C.muted, weight: 700 });
          kit.label(c, names[i], x, y + 46, { align: 'center', size: 10, color: C.muted });
          kit.label(c, (O.photonEnergy(nm)).toFixed(2) + ' eV' + (how[i] ? '  (' + how[i] + ')' : ''), x, y + 59, { align: 'center', size: 10, color: C.faint });
        });
        const g = V.gam, pm = [], mm = [], qq = [];
        for (let u = 0; u <= 20.001; u += 0.1) {
          const i = Math.min(NQ, Math.round(u / DU)), A = Math.hypot(qre[i], qim[i]);
          pm.push([u, 100 * Math.pow(Math.tanh(g * u), 2)]); mm.push([u, 100 * Math.pow(Math.tanh(g * 2 * Math.abs(Math.sin(PI * u / 2)) / PI), 2)]); qq.push([u, 100 * Math.pow(Math.tanh(g * A), 2)]);
        }
        plot.set({ x: { label: 'distance in the crystal, in coherence lengths', min: 0, max: 20 }, y: { label: 'share of the pump converted (%)', min: 0, max: 100 }, series: [{ pts: pm, label: 'phase-matched', color: C.ok, width: 2.4 }, { pts: qq, label: 'quasi-phase-matched', color: C.accent, width: 2.2 }, { pts: mm, label: 'not phase-matched', color: C.bad, width: 2.2 }] });
        const n1 = O.index('fused-silica', f), n2 = O.index('fused-silica', f / 2), Lc = f / 1000 / (4 * (n2 - n1));
        ro.set('chain', [1, 2, 3, 4, 5].map(n => nmText(f / n).replace(' nm', '')).join(' → ') + ' nm');
        ro.set('Lc', Lc.toFixed(1) + ' µm  (λ ÷ 4(n₂ω − nω), n = ' + n1.toFixed(4) + ' and ' + n2.toFixed(4) + ')');
        ro.set('qpm', (2 * Lc).toFixed(0) + ' µm (twice the coherence length; real crystals differ)');
        ro.set('end', 'phase-matched ' + pm[pm.length - 1][1].toFixed(0) + ' % · quasi ' + qq[qq.length - 1][1].toFixed(0) + ' % · unmatched ' + Math.max(...mm.map(p => p[1])).toFixed(2) + ' % at most');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ what a target does to a laser line */
  const WINDOWS = ['fused-silica', 'N-BK7', 'PMMA', 'PC', 'water', 'sapphire', 'CaF2', 'silicon', 'germanium', 'ZnSe', 'ZnS'];
  const METALS = [['aluminium', 'Aluminium'], ['copper', 'Copper'], ['gold', 'Gold'], ['silver', 'Silver']];
  const METAL_NOTE = {
    aluminium: 'reflects nearly everything from 355 to 1064 nm: a few per cent are absorbed until the surface begins to melt or oxidise',
    copper: 'absorbs the green and the ultraviolet well but hardly anything at 1064 nm: the reason copper is welded with green and blue lasers',
    gold: 'absorbs blue and green light, reflects red and infrared: the colour of gold',
    silver: 'the best reflector of green and infrared; it absorbs near 350 nm, where its reflectance has a notch'
  };
  Hyper.sim('lz-target', {
    title: 'What a target does to a laser line',
    blurb: `Choosing a laser starts with the target: the light must be **absorbed** to heat, cut or mark it, or **transmitted** to pass through a window to something behind. Two views, both from the engine's tables.

*Metals*: the share of the light a flat metal surface absorbs (one minus the reflectance at normal incidence), against wavelength. These are values for clean, cold surfaces; a rough, oxidised, hot or molten surface absorbs much more. *Windows*: the range of wavelengths each material passes (the bar), and whether the chosen line falls inside it.

**Try this**
- *Metals*: select copper and read the three lines. Then select silver: at 532 nm it reflects almost everything.
- *Windows*: choose 10.6 µm (carbon dioxide). Glass, plastic and water absorb it, so it cuts them; zinc selenide and germanium pass it, so lenses for these lasers are made from them.
- Choose 1064 nm: the shaded band is the part of the spectrum the eye focuses onto the retina. A 1064 nm beam is invisible but still in it.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Metals: how much they absorb', 'metals'], ['Windows: what passes through', 'windows']], value: params.view || 'metals' },
        { id: 'metal', type: 'select', label: 'The metal', options: METALS.map(m => [m[1], m[0]]), value: 'copper' },
        { id: 'line', type: 'select', label: 'The laser line', options: [[ '193 nm  ArF excimer', 193], ['248 nm  KrF excimer', 248], ['355 nm  Nd:YAG, tripled', 355], ['532 nm  Nd:YAG, doubled', 532], ['1064 nm  Nd:YAG', 1064], ['1550 nm  erbium fibre', 1550], ['2940 nm  Er:YAG', 2940], ['10.6 µm  carbon dioxide', 10600]], value: params.line || 10600 }
      ], () => { sync(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a355', 'Absorbed at 355 nm'], ['a532', 'Absorbed at 532 nm'], ['a1064', 'Absorbed at 1064 nm'], ['note', 'In words'], ['eye', 'In the eye'], ['pass', 'Passes through'], ['stop', 'Absorbed or reflected']]);
      const curves = {}; for (const [id] of METALS) { curves[id] = []; for (let nm = 300; nm <= 2000; nm += 10) curves[id].push([nm, 1 - O.normalR(1, O.metalIndex(id, nm))]); }
      function sync() { const m = V.view === 'metals'; ctl.show('metal', m); ctl.show('line', !m); for (const k of ['a355', 'a532', 'a1064', 'note']) ro.show(k, m); for (const k of ['pass', 'stop']) ro.show(k, !m); }
      const eyeText = nm => nm < 400 ? 'ultraviolet: absorbed in the cornea and the lens, not focused onto the retina' : nm <= 1400 ? 'in the retinal hazard region: focused onto the retina, even if the eye cannot see it' : 'absorbed in the cornea and the fluid of the eye: little reaches the retina, but the cornea can burn';
      function drawMetals(c, C, W, Hh) {
        const x0 = 52, x1 = W - 16, top = 34, bot = Hh - 52, X = n => x0 + (x1 - x0) * (n - 300) / 1700, Y = a => bot - (bot - top) * a;
        c.fillStyle = 'rgba(128,128,128,0.10)'; c.fillRect(X(380), top, X(780) - X(380), bot - top); kit.label(c, 'visible', (X(380) + X(780)) / 2, top + 8, { align: 'center', size: 10, color: C.faint });
        c.strokeStyle = C.grid; c.lineWidth = 1; for (let a = 0; a <= 1.001; a += 0.2) { c.beginPath(); c.moveTo(x0, Y(a)); c.lineTo(x1, Y(a)); c.stroke(); kit.label(c, Math.round(a * 100) + ' %', x0 - 6, Y(a), { align: 'right', size: 10, color: C.muted }); }
        for (const [nm, lab] of [[355, '355'], [532, '532'], [1064, '1064']]) { c.save(); c.setLineDash([4, 4]); c.strokeStyle = vis(nm) ? S.nm(nm) : C.muted; c.lineWidth = 1.4; c.beginPath(); c.moveTo(X(nm), top); c.lineTo(X(nm), bot); c.stroke(); c.restore(); kit.label(c, lab + ' nm', X(nm), bot + 13, { align: 'center', size: 10.5, color: C.muted }); }
        METALS.forEach(([id, name], i) => {
          const on = id === V.metal, col = C.series[i % C.series.length];
          c.strokeStyle = col; c.lineWidth = on ? 3 : 1.4; c.globalAlpha = on ? 1 : 0.55; c.beginPath(); curves[id].forEach((p, j) => j ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke(); c.globalAlpha = 1;
          kit.label(c, name, x0 + 6 + i * 92, 18, { size: 11, color: col, weight: on ? 700 : 500 });
        });
        for (const nm of [355, 532, 1064]) { const a = 1 - O.normalR(1, O.metalIndex(V.metal, nm)); c.beginPath(); c.arc(X(nm), Y(a), 5, 0, TAU); c.fillStyle = C.text; c.fill(); kit.label(c, (100 * a).toFixed(a < 0.1 ? 1 : 0) + ' %', X(nm) + 8, Y(a) - 9, { size: 11, color: C.text, weight: 700 }); }
        kit.label(c, 'wavelength (nm)', (x0 + x1) / 2, bot + 30, { align: 'center', size: 10.5, color: C.faint });
        for (const nm of [400, 800, 1200, 1600, 2000]) { c.strokeStyle = C.axis; c.beginPath(); c.moveTo(X(nm), bot); c.lineTo(X(nm), bot + 4); c.stroke(); kit.label(c, nm + '', X(nm), bot + 40, { align: 'center', size: 9.5, color: C.faint }); }
        for (const nm of [355, 532, 1064]) ro.set('a' + nm, (100 * (1 - O.normalR(1, O.metalIndex(V.metal, nm)))).toFixed(1) + ' %');
        ro.set('note', METAL_NOTE[V.metal]);
        kit.label(c, 'absorbed share of the light; at 10.6 µm every clean metal above reflects more than 95 %', x0, Hh - 6, { size: 10, color: C.faint });
      }
      function drawWindows(c, C, W, Hh) {
        const x0 = clamp(W * 0.2, 96, 150), x1 = W - 14, LO = 150, HI = 22000, X = n => x0 + (x1 - x0) * Math.log(n / LO) / Math.log(HI / LO);
        const top = 40, rowH = (Hh - top - 34) / WINDOWS.length;
        c.fillStyle = 'rgba(224,160,48,0.14)'; c.fillRect(X(400), top - 6, X(1400) - X(400), rowH * WINDOWS.length + 6);
        kit.label(c, 'reaches the retina', (X(400) + X(1400)) / 2, top - 14, { align: 'center', size: 10, color: C.warn });
        for (const [nm, s] of [[200, '200 nm'], [300, '300'], [500, '500'], [1000, '1 µm'], [2000, '2'], [5000, '5'], [10000, '10 µm']]) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(nm), top); c.lineTo(X(nm), top + rowH * WINDOWS.length); c.stroke(); kit.label(c, s, X(nm), top + rowH * WINDOWS.length + 12, { align: 'center', size: 10, color: C.muted }); }
        const through = [], blocked = [];
        WINDOWS.forEach((id, i) => {
          const m = O.MATERIALS[id], y = top + rowH * (i + 0.5), pass = V.line >= m.range[0] && V.line <= m.range[1];
          (pass ? through : blocked).push(m.name.replace(/ \(.*\)$/, ''));
          kit.label(c, m.name.replace(/ \(.*\)$/, '').replace('Crystal ', ''), 8, y, { size: 10.5, color: pass ? C.text : C.muted, weight: pass ? 650 : 500 });
          c.fillStyle = pass ? C.ok : C.faint; c.globalAlpha = pass ? 0.8 : 0.45; c.fillRect(X(m.range[0]), y - rowH * 0.28, X(Math.min(HI, m.range[1])) - X(m.range[0]), rowH * 0.56); c.globalAlpha = 1;
        });
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = vis(V.line) ? S.nm(V.line) : C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(V.line), top - 6); c.lineTo(X(V.line), top + rowH * WINDOWS.length); c.stroke(); c.restore();
        kit.label(c, nmText(V.line), X(V.line) + (X(V.line) > (x0 + x1) / 2 ? -6 : 6), top - 14 + (X(V.line) > X(400) && X(V.line) < X(1400) ? 12 : 0), { align: X(V.line) > (x0 + x1) / 2 ? 'right' : 'left', size: 11, color: C.text, weight: 700 });
        kit.label(c, 'green bars: the line falls inside the range the material passes (grey: it does not)', x0, Hh - 6, { size: 10, color: C.faint });
        ro.set('eye', eyeText(V.line)); ro.set('pass', through.length ? through.join(', ') : 'none of these'); ro.set('stop', blocked.length ? blocked.join(', ') : 'none of these');
      }
      const loop = kit.loop(() => { const c = st.begin(), C = kit.colors(); if (V.view === 'metals') drawMetals(c, C, st.W, st.H); else drawWindows(c, C, st.W, st.H); }, box.stage);
      st.onResize(() => loop.once());
      sync();
      loop.once();
    }
  });
})();
