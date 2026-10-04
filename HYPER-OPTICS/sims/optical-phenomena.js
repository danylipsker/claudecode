/* HYPER-OPTICS · sims/optical-phenomena.js — simulations of the topic "Phenomena and optical tricks".
 *   ph-mirage       rays through layers of air of different temperature: the hot-road, cold-sea and layered-inversion mirages
 *   ph-halo         the ice-crystal halo (prism, minimum deviation, sun dogs) and the corona of a water cloud
 *   ph-sky          Rayleigh scattering: the colour of the sky and of the Sun against its height, haze and clouds
 *   ph-flash        refraction at the horizon pulls the colours apart (the green flash); why stars twinkle and planets do not
 *   ph-pane         a half-silvered pane between two rooms: Pepper's ghost and the one-way mirror
 *   ph-stereo       a stereoscopic screen: disparity, vergence and the accommodation conflict
 *   ph-lenticular   a lenticular sheet with its strips, and a single-image random-dot stereogram
 *   ph-hologram     a hologram as a window: parallax, a broken plate, the fringe spacing that must be recorded
 *   ph-iridescence  thin films, a layered stack and a disc: colour that comes from structure
 *   ph-artefacts    the wagon wheel on film, a propeller under a rolling shutter, the spikes of an iris
 *   ph-moon         the Moon at the horizon and high up: the same angle, a different look
 * The numbers come from kit.optics (Snell's law, the film and Fresnel code, the diffraction and colour tables); the
 * drawing from kit.osym. What the engine does not cover (the layered-air ray trace, the stereogram, the shutter
 * geometry) is computed here and said so in the blurb.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const mix = (a, b, t) => a + (b - a) * t;
  const pct = x => (100 * x).toFixed(x < 0.1 ? 2 : 1) + ' %';
  // a small seeded generator, so a random picture is the same every time it is drawn
  const rng = seed => { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  // a pane for a kit.plot below the stage
  const plotBox = (box, kit, opts, h) => { const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb); return kit.plot(gb, opts, h); };

  /* ================================================================ a mirage */
  // Rays are traced from the eye through 3000 horizontal layers of air whose index follows the temperature profile; at each
  // layer boundary Snell's law (O.snell) gives the new angle, and a ray that cannot cross is turned back, the way the gradient
  // turns it (the turn is given the horizontal run a smooth gradient would give it). The Earth is flattened with the usual
  // modified index n·(1 + z/R), so the ground is a straight line and an ordinary ray curves slightly upwards.
  Hyper.sim('ph-mirage', {
    title: 'A mirage: rays through layers of air',
    blurb: `Rays are followed **backwards from the eye** through 3000 thin layers of air, whose index comes from the temperature profile (the small plot). At each boundary Snell's law gives the new direction; a ray too shallow to cross is turned back. The strip on the right is what the eye sees at each angle of elevation (magnified to fit the object): blue is sky, grey is ground or sea, and the orange-to-yellow strip is the object, **dark at its foot and light at its top**, so an upside-down image shows light below dark.

**Try this**
- *Hot road*: the post (4 m tall, 1.5 km away) appears twice, once upright and once upside down below it, and sky shows in the road beneath. Slide the strength to 0 and the second image goes.
- Raise the eye height: the mirage needs rays that skim the road, so it fades.
- *Cold sea*: a mast 25 m tall at 30 km is hidden below the horizon in ordinary air. Bring the strength up from 0 and it appears, lifted into view.
- *Layered inversion* (the eye on a ship's bridge, 22 m up): the ship is stretched, and an upright and an upside-down image can appear together.

The vertical scale is greatly exaggerated (the figure says by how much), and the temperature profiles are idealized: "strength 1" is a typical step of 30 K for the road, 3 K for the sea, 3.5 K for the layers.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 440 });
      const plot = plotBox(box, kit, { x: { label: 'temperature (°C)' }, y: { label: 'height (m)', min: 0 }, legend: false, series: [] }, 150);
      const PRE = {
        road: { dT: 30, D: 1.5, he: 1.7, ho: 4, name: 'a post 4 m tall' },
        sea: { dT: 3, D: 30, he: 5, ho: 25, name: 'a mast 25 m tall' },
        fata: { dT: 3.5, D: 50, he: 22, ho: 30, name: 'a ship 30 m tall' },
        normal: { dT: 0, D: 24, he: 5, ho: 25, name: 'a mast 25 m tall' }
      };
      const mode0 = PRE[params.mode] ? params.mode : 'road';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Situation', options: [['Hot road: inferior mirage', 'road'], ['Cold sea: superior mirage', 'sea'], ['Layered inversion: Fata Morgana', 'fata'], ['Ordinary air', 'normal']], value: mode0 },
        { id: 'k', label: 'Strength of the temperature step (1 = typical)', min: 0, max: 2.5, step: 0.05, value: mode0 === 'normal' ? 0 : 1 },
        { id: 'D', label: 'Distance to the object', min: 0.2, max: 80, value: PRE[mode0].D, log: true, sig: 2, unit: 'km' },
        { id: 'he', label: 'Height of the eye', min: 0.5, max: 30, step: 0.1, value: PRE[mode0].he, unit: 'm' },
        { type: 'buttons', items: [{ id: 'typical', label: 'Typical values for this situation' }] }
      ], (id) => {
        if (id === 'mode' || id === 'typical') { const p = PRE[V.mode]; ctl.set('k', V.mode === 'normal' ? 0 : 1); ctl.set('D', p.D); ctl.set('he', p.he); }
        ctl.show('k', V.mode !== 'normal');
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dT', 'Temperature step ΔT'], ['n', 'Index of the air at the ground'], ['dn', 'Index change across the layer'], ['turn', 'Largest grazing angle turned back'], ['img', 'Images of the object'], ['hor', 'Horizon in ordinary air']]);
      const RE = 6.371e6, K = 3000, N = 170, n0 = O.index('air', 550) - 1;
      const sig = x => 1 / (1 + Math.exp(-x));
      const temp = (z, mode, dT) => mode === 'road' ? 30 + dT * Math.exp(-z / 0.35)
        : mode === 'sea' ? dT * (1 - Math.exp(-z / 15))
        : mode === 'fata' ? dT * (0.55 * sig((z - 18) / 4) + 0.45 * sig((z - 45) / 5))
        : 15 - 0.0065 * z;
      // pieces of a run of heights that rise or fall by more than tol: -> [{ from, to, dir }] (dir -1: height falls as the list goes on)
      const pieces = (zs, tol) => {
        const out = []; let start = 0, ext = zs[0], extI = 0, dir = 0;
        for (let i = 1; i < zs.length; i++) {
          if (dir === 0) { if (Math.abs(zs[i] - zs[start]) > tol) { dir = Math.sign(zs[i] - zs[start]); ext = zs[i]; extI = i; } }
          else if ((zs[i] - ext) * dir > 0) { ext = zs[i]; extI = i; }
          else if ((ext - zs[i]) * dir > tol) { out.push({ from: start, to: extI, dir }); start = extI; dir = -dir; ext = zs[i]; extI = i; }
        }
        out.push({ from: start, to: dir === 0 ? zs.length - 1 : extI, dir: dir || 1 });
        return out;
      };
      // the heavy part: thousands of layer crossings, done only when an input changes
      let state = null;
      const compute = () => {
        const P = PRE[V.mode], Dm = V.D * 1000, he = V.he, ho = P.ho, dT = V.k * P.dT;
        const zTop = V.mode === 'road' ? Math.max(ho * 1.6, he * 2, 6) : Math.max(ho * 1.6, he * 2, 70), dz = zTop / K;
        // the index of each layer (flat-Earth form)
        const nl = new Float64Array(K);
        for (let k = 0; k < K; k++) { const z = (k + 0.5) * dz; nl[k] = (1 + n0 * Math.exp(-z / 8430) * 288.15 / (temp(z, V.mode, dT) + 273.15)) * (1 + z / RE); }
        const trace = (alpha, rec) => {
          let up = alpha >= 0, th = Math.PI / 2 - Math.abs(alpha), k = clamp(Math.floor(he / dz), 0, K - 1), z = he, x = 0;
          const pts = rec ? [[0, z]] : null;
          for (let step = 0; step < 40000; step++) {
            const tn = Math.tan(th), zb = up ? (k + 1) * dz : k * dz, dx = Math.abs(zb - z) * tn;
            if (x + dx >= Dm) { const zz = z + (up ? 1 : -1) * (Dm - x) / tn; if (rec) pts.push([Dm, zz]); return { zD: zz, hit: 'far', pts }; }
            x += dx; z = zb; if (rec && step % 3 === 0) pts.push([x, z]);
            const kn = up ? k + 1 : k - 1;
            if (kn < 0) { if (rec) pts.push([x, z]); return { hit: 'ground', pts }; }
            if (kn >= K) { const zz = z + (Dm - x) / Math.tan(th); if (rec) pts.push([Dm, zz]); return { zD: zz, hit: 'far', pts }; }
            const t2 = O.snell(nl[k], nl[kn], th);
            if (Number.isNaN(t2)) {
              // turned back: a smooth gradient takes a horizontal run of 2·grazing angle ÷ curvature to do it
              const ab = Math.PI / 2 - th, kap = Math.abs(nl[kn] - nl[k]) / dz / nl[k];
              x += 2 * Math.tan(ab) / Math.max(kap, 1e-12);
              if (rec) pts.push([Math.min(x, Dm), z]);
              if (x >= Dm) return { zD: z, hit: 'far', pts };
              up = !up;
            } else { th = t2; k = kn; }
          }
          return { hit: 'lost', pts };
        };
        const classify = a => { const r = trace(a, false); let kind = 'ground', f = 0; if (r.hit === 'far') { if (r.zD < 0) kind = 'ground'; else if (r.zD <= ho) { kind = 'object'; f = r.zD / ho; } else kind = 'sky'; } return { a, kind, f, zD: r.zD }; };
        const sag = Dm / (2 * RE / 0.86), a0 = -he / Dm - sag, a1 = (ho - he) / Dm - sag, span = a1 - a0;
        let aLo = a0 - 0.9 * span - 0.8 * sag, aHi = a1 + 0.6 * span + 0.8 * sag;
        if (V.mode === 'road') aLo = Math.min(aLo, -0.5 * D2R);
        // a sweep of N rays; the heights at the object are smoothed with a 5-point median (the layered model is a little jittery near the horizon)
        const sweep = (hi, lo) => {
          const r = []; for (let i = 0; i < N; i++) r.push(classify(hi + (lo - hi) * i / (N - 1)));
          const raw = r.map(q => q.zD);
          r.forEach((q, i) => {
            if (!Number.isFinite(q.zD)) return;
            const w = []; for (let j = Math.max(0, i - 2); j <= Math.min(N - 1, i + 2); j++) if (Number.isFinite(raw[j])) w.push(raw[j]);
            if (w.length >= 3) { w.sort((a, b) => a - b); q.zD = w[w.length >> 1]; q.kind = q.zD < 0 ? 'ground' : q.zD <= ho ? 'object' : 'sky'; q.f = q.kind === 'object' ? q.zD / ho : 0; }
          });
          return r;
        };
        const wide = sweep(aHi, aLo); let cls = wide;
        const hits = wide.filter(q => q.kind === 'object');
        if (hits.length) {                       // look closer: a window around the images
          const w = hits[0].a - hits[hits.length - 1].a, pad = Math.max(0.3 * w, 2 * (aHi - aLo) / N), nHi = Math.min(aHi, hits[0].a + pad), nLo = Math.max(aLo, hits[hits.length - 1].a - pad);
          if (nHi - nLo < 0.8 * (aHi - aLo)) { aHi = nHi; aLo = nLo; cls = sweep(aHi, aLo); }
        }
        // the paths to draw: a few faint ones from the wide sweep, and the ones that reach the object
        const showPaths = wide.map((q, i) => i).filter(i => i % 14 === 0 && wide[i].kind !== 'object').map(i => ({ pts: trace(wide[i].a, true).pts, kind: wide[i].kind }));
        const objs = cls.map((q, i) => i).filter(i => cls[i].kind === 'object');
        const pickPaths = objs.filter((i, j) => objs.length <= 9 || j % Math.ceil(objs.length / 9) === 0).map(i => ({ pts: trace(cls[i].a, true).pts }));
        // the images: runs of 'object', cut where the height reverses, counted if they are not slivers
        let up = 0, inv = 0;
        const runs = []; let cur = null;
        cls.forEach(q => { if (q.kind === 'object') { if (!cur) { cur = []; runs.push(cur); } cur.push(q.zD); } else cur = null; });
        for (const r of runs) for (const pc of pieces(r, 0.2 * ho)) if (Math.abs(r[pc.to] - r[pc.from]) >= 0.4 * ho) { if (pc.dir < 0) up++; else inv++; }
        const zv = Math.max(ho, he) * 1.25, n0g = nl[0] / (1 + 0.5 * dz / RE), dnTop = nl[Math.min(K - 1, Math.round(2 * zv / dz))] / (1 + 2 * zv / RE);
        return { key: [V.mode, V.k, V.D, V.he].join(), P, Dm, he, ho, dT, wide, cls, aHi, aLo, a0, a1, zv, showPaths, pickPaths, up, inv, n0g, dn: Math.abs(n0g - dnTop) };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (!state || state.key !== [V.mode, V.k, V.D, V.he].join()) state = compute();
        const { P, Dm, he, ho, dT, cls, aHi, aLo, a0, a1, zv, showPaths, pickPaths, up, inv, n0g, dn } = state;
        // the figure: ground at the bottom, eye at the left, the object at the right edge of the left panel
        const pl = 14, pr = Math.round(W * 0.64), pt = 34, pb = Hh - 30, ph = pb - pt, pw = pr - pl;
        const sx = pw / Dm, sy = ph / zv;
        const X = x => pl + x * sx, Y = z => pb - z * sy;
        c.save(); c.beginPath(); c.rect(pl, pt, pw + 4, ph); c.clip();
        // the temperature as a tint of the air: warm orange, cold blue
        const tcol = z => { const T = temp(z, V.mode, dT), u = clamp((T - 15) / 30, -1, 1); return u > 0 ? 'rgba(230,120,40,' + (0.22 * u) + ')' : 'rgba(80,140,230,' + (0.2 * -u) + ')'; };
        for (let i = 0; i < 40; i++) { const z0 = zv * i / 40; c.fillStyle = tcol(z0); c.fillRect(pl, Y(z0 + zv / 40), pw, ph / 40 + 1); }
        // rays: faint ones from the wide sweep, then the ones that reach the object
        for (const r of showPaths) S.ray(c, r.pts.map(p => [X(p[0]), Y(p[1])]), { color: r.kind === 'sky' ? C.accent : C.faint, width: 1, alpha: 0.5, arrows: false });
        for (const r of pickPaths) S.ray(c, r.pts.map(p => [X(p[0]), Y(p[1])]).reverse(), { color: C.warn, width: 1.5, arrows: true, minArrow: 80 });
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(pl, pb); c.lineTo(pr, pb); c.stroke();
        // the object and the eye
        const ox = Math.min(X(Dm), pr - 2); c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(ox, pb); c.lineTo(ox, Y(ho)); c.stroke();
        S.eye(c, pl + 5, Y(he), 5, { dir: 1 });
        kit.label(c, P.name + ', ' + kit.fmt(V.D, 2) + ' km', pr - 4, pt - 12, { align: 'right', color: C.muted, size: 11.5 });
        kit.label(c, 'height × ' + Math.round(sy / sx), pl, pt - 12, { color: C.faint, size: 11 });
        // the view of the eye
        const vx = Math.round(W * 0.7), vw = W - vx - 12;
        kit.label(c, 'what the eye sees', vx + vw / 2, pt - 12, { align: 'center', color: C.muted, size: 11.5 });
        const strip = ph / N + 0.8;
        for (let i = 0; i < N; i++) {
          const q = cls[i], y = pt + ph * i / N;
          c.fillStyle = q.kind === 'sky' ? (C.dark ? '#4f78c4' : '#9dc0f0') : q.kind === 'object' ? 'rgb(' + Math.round(mix(150, 252, q.f)) + ',' + Math.round(mix(60, 205, q.f)) + ',' + Math.round(mix(46, 90, q.f)) + ')' : (C.dark ? '#3a4153' : '#8e96a8');
          c.fillRect(vx, y, vw, strip);
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(vx, pt, vw, ph);
        // where the foot and the top would be seen in ordinary air
        const ymark = a => pt + ph * (aHi - a) / (aHi - aLo);
        c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.text; c.lineWidth = 1;
        for (const a of [a0, a1]) { const y = ymark(a); if (y > pt && y < pb) { c.beginPath(); c.moveTo(vx - 5, y); c.lineTo(vx + vw + 5, y); c.stroke(); } }
        c.restore();
        kit.label(c, 'dashed: ordinary air', vx + vw, pb + 14, { align: 'right', color: C.faint, size: 10.5 });
        kit.label(c, (aHi * R2D >= 0 ? '+' : '') + (aHi * R2D).toFixed(3) + '°', vx - 4, pt + 6, { align: 'right', color: C.faint, size: 10 });
        kit.label(c, (aLo * R2D).toFixed(3) + '°', vx - 4, pb - 6, { align: 'right', color: C.faint, size: 10 });
        // the profile of the air
        const pts = []; for (let i = 0; i <= 60; i++) { const z = Math.max(zv * 1.2, 4) * i / 60; pts.push([temp(z, V.mode, dT), z]); }
        plot.set({ series: [{ pts, color: C.warn, width: 2 }], hlines: [{ y: he, label: 'eye' }], y: { label: 'height (m)', min: 0, max: Math.max(zv * 1.2, 4) } });
        ro.set('dT', V.mode === 'normal' ? 'none (−6.5 K per km)' : dT.toFixed(1) + ' K');
        ro.set('n', n0g.toFixed(6));
        ro.set('dn', dn.toExponential(1));
        ro.set('turn', dn > 1e-9 ? (Math.sqrt(2 * dn) * R2D).toFixed(2) + '°' : 'none');
        ro.set('img', up + inv === 0 ? 'none: out of sight' : (up + inv) + ' (' + up + ' upright, ' + inv + ' inverted)');
        ro.set('hor', (3.86 * Math.sqrt(he)).toFixed(1) + ' km  (3.86√h)');
      }, box.stage);
      ctl.show('k', V.mode !== 'normal');
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ halos and coronas */
  const iceN = (O, nm) => O.index('water', nm) - 0.0239;                // ice: n = 1.309 at 589 nm, with the dispersion of water
  Hyper.sim('ph-halo', {
    title: 'Halos and coronas: ice prisms and water droplets',
    blurb: `**Halo mode.** A ray crosses a prism of ice (60° between the faces of a hexagonal crystal, or 90° between a side face and an end face). The plot shows how much the prism turns it, for every angle of incidence: the curve is *flat at the bottom*, so crystals at many orientations all send light to nearly the same angle, and it piles up there. The picture on the right is the sky around the Sun built from those edges, with the sun dogs of plate crystals at the Sun's height.

**Corona mode.** A thin cloud of equal droplets diffracts the light: rings whose size is inversely proportional to the droplet size.

**Try this**
- Drag the incidence slider through the minimum: the deviation stops changing. Switch to *white light*: red has the smaller deviation, so it forms the inner edge of the ring.
- Choose the 90° prism: the ring jumps to 46° and becomes fainter.
- Lift the Sun: the sun dogs slide outwards, from 21.8° at the horizon to 32° at 50°.
- In corona mode shrink the droplets: the rings widen. Add a spread of sizes and they blur away.

Ice is modelled with n = 1.309 at 589 nm and the dispersion of water; the rings are schematic in brightness.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Cl = O.colour;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320, maxH: 420 });
      const plot = plotBox(box, kit, { x: { label: 'angle (°)' }, y: { label: 'deviation (°)' }, legend: false, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Halo: ice crystals', 'halo'], ['Corona: water droplets', 'corona']], value: params.mode || 'halo' },
        { id: 'A', type: 'select', label: 'Prism in the crystal', options: [['60°: two side faces (22° halo)', 60], ['90°: side and end face (46° halo)', 90]], value: params.A || 60 },
        { id: 'inc', label: 'Angle of incidence on the first face', min: 20, max: 88, step: 0.5, value: params.inc || 50, unit: '°' },
        { id: 'white', type: 'check', label: 'White light (red, green, blue)', value: params.white !== false },
        { id: 'sun', label: 'Elevation of the Sun (for the sun dogs)', min: 0, max: 60, step: 1, value: params.sun != null ? params.sun : 10, unit: '°' },
        { id: 'dia', label: 'Droplet diameter', min: 5, max: 60, value: params.dia || 20, log: true, sig: 2, unit: 'µm' },
        { id: 'spread', label: 'Spread of droplet sizes', min: 0, max: 0.6, step: 0.02, value: params.spread != null ? params.spread : 0.1 }
      ], () => { modeUi(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Prism angle'], ['dmin', 'Minimum deviation (550 nm)'], ['edge', 'Inner edge: red · blue'], ['now', 'Deviation of the ray drawn'], ['dog', 'Sun dog from the Sun'], ['c1', 'First dark ring (blue · green · red)']]);
      const modeUi = () => {
        const h = V.mode === 'halo';
        for (const id of ['A', 'inc', 'white', 'sun']) ctl.show(id, h);
        for (const id of ['dia', 'spread']) ctl.show(id, !h);
        for (const k of ['a', 'dmin', 'edge', 'now', 'dog']) ro.show(k, h);
        ro.show('c1', !h);
      };
      const NM = [650, 550, 450], RMAX = 50, KR = 200;
      // radial profile of the halo: colour against angle, built from the minimum-deviation edge of every wavelength
      const haloProfile = () => {
        const lams = []; for (let nm = 400; nm <= 700; nm += 12.5) lams.push(nm);
        const e22 = lams.map(nm => O.deg(O.minDeviation(iceN(O, nm), O.rad(60)))), e46 = lams.map(nm => O.deg(O.minDeviation(iceN(O, nm), O.rad(90))));
        const wt = lams.map(nm => O.photo.planck(nm, 5778)), xw = Cl.xyz(nm => O.photo.planck(nm, 5778), true), yw = xw[1], white = Cl.toRgb(xw.map(v => v / yw)), out = [];
        for (let k = 0; k < KR; k++) {
          const r = (k + 0.5) * RMAX / KR; let X = 0, Y = 0, Z = 0;
          lams.forEach((nm, j) => { let I = 0; if (r >= e22[j]) I += Math.exp(-(r - e22[j]) / 1.4); if (r >= e46[j]) I += 0.1 * Math.exp(-(r - e46[j]) / 3); if (I > 0) { const m = Cl.cmf(nm); X += I * wt[j] * m[0]; Y += I * wt[j] * m[1]; Z += I * wt[j] * m[2]; } });
          const lin = Cl.toRgb([X / yw, Y / yw, Z / yw]);
          out.push(lin.map((v, i) => Math.max(0, v) / white[i] * 0.09));
        }
        return out;
      };
      let haloP = null;
      const cor = { key: null, prof: null, pts: null };
      // the corona: colour against angle, the Airy pattern of a droplet averaged over the sizes present and over the colours
      const coronaProfile = (d, spread) => {
        const lams = []; for (let nm = 400; nm <= 700; nm += 12.5) lams.push(nm);
        const zs = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2], ws = zs.map(z => Math.exp(-z * z / 2)), sw = ws.reduce((a, b) => a + b, 0);
        const wt = lams.map(nm => O.photo.planck(nm, 5778)), xw = Cl.xyz(nm => O.photo.planck(nm, 5778), true), yw = xw[1], white = Cl.toRgb(xw.map(v => v / yw)), out = [], RM = 9;
        for (let k = 0; k < KR; k++) {
          const th = (k + 0.5) * RM / KR * D2R; let X = 0, Y = 0, Z = 0;
          lams.forEach((nm, j) => {
            let I = 0; zs.forEach((z, q) => { const dd = d * Math.exp(spread * z) * 1e-6; I += ws[q] * O.diff.airy(Math.PI * dd * Math.sin(th) / (nm * 1e-9)); }); I /= sw;
            const m = Cl.cmf(nm); X += I * wt[j] * m[0]; Y += I * wt[j] * m[1]; Z += I * wt[j] * m[2];
          });
          out.push(Cl.toRgb([X / yw, Y / yw, Z / yw]).map((v, i) => Math.max(0, v) / white[i]));
        }
        return out;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const isHalo = V.mode === 'halo';
        const lw = Math.round(W * 0.5) - 8, rx = Math.round(W * 0.5) + 4, rw = W - rx - 8, side = Math.min(rw, Hh - 40), sx0 = rx + (rw - side) / 2, sy0 = 28;
        if (isHalo) {
          // ---- the crystal: a prism seen along its edge
          const A = V.A * D2R, size = Math.min(lw * 0.36, Hh * 0.34), cx = lw * 0.5, cy = Hh * 0.5;
          const P = S.prism(c, cx, cy, size, A), E = [(P[0][0] + P[2][0]) / 2, (P[0][1] + P[2][1]) / 2];
          const dir = a => [Math.cos(a), -Math.sin(a)];
          const t1 = V.inc * D2R, rows = V.white ? NM : [550];
          let nowDelta = NaN, tirAny = false;
          for (const nm of rows) {
            const pr = O.prism(iceN(O, nm), A, t1);
            const din = dir(-A / 2 + t1), a0 = [E[0] - din[0] * size * 0.9, E[1] - din[1] * size * 0.9];
            if (pr.tir) {
              // the ray reaches the second face and is reflected inside
              const dd = dir(-A / 2 + pr.r1), q = hit(E, dd, P[0], P[1]);
              S.ray(c, [a0, E, q], { nm, width: 2, arrows: false });
              tirAny = true; continue;
            }
            const dd = dir(-A / 2 + pr.r1), q = hit(E, dd, P[0], P[1]), dout = dir(A / 2 - pr.exit);
            S.ray(c, [a0, E, q, [q[0] + dout[0] * size * 1.0, q[1] + dout[1] * size * 1.0]], { nm, width: 2, arrows: false });
            if (nm === 550 || !V.white) nowDelta = pr.delta;
          }
          const mid = dir(-A / 2 + t1); c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(E[0], E[1]); c.lineTo(E[0] + mid[0] * size * 1.9, E[1] + mid[1] * size * 1.9); c.stroke(); c.restore();
          kit.label(c, 'ice crystal, edge-on', lw / 2, 14, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, tirAny ? 'totally reflected inside' : 'dashed: no prism', lw / 2, Hh - 12, { align: 'center', color: tirAny ? C.warn : C.faint, size: 11 });
          // ---- the sky round the Sun
          if (!haloP) haloP = haloProfile();
          const sky = [38, 66, 116];
          S.image(c, sx0, sy0, side, side, 150, 150, (u, v) => {
            const x = (u - 0.5) * 2 * RMAX, y = (v - 0.5) * 2 * RMAX, r = Math.hypot(x, y), k = Math.min(KR - 1, Math.floor(r / RMAX * KR)), g = haloP[k], glare = 255 * Math.exp(-r / 2.2);
            const f = r < RMAX ? 1 : 0.7;
            return [sky[0] * f + 255 * g[0] * 1.5 + glare, sky[1] * f + 255 * g[1] * 1.5 + glare, sky[2] * f + 255 * g[2] * 1.5 + glare];
          }, { key: 'halo', id: 'halo' });
          const ps = side / (2 * RMAX), scx = sx0 + side / 2, scy = sy0 + side / 2;
          const e = V.sun * D2R, neff = Math.sqrt(1.309 * 1.309 - Math.sin(e) ** 2) / Math.cos(e), sin30 = neff * 0.5;
          let dogAng = NaN;
          if (sin30 < 1) { const dAz = O.minDeviation(neff, O.rad(60)); dogAng = Math.acos(Math.sin(e) ** 2 + Math.cos(e) ** 2 * Math.cos(dAz)) * R2D; }
          if (!Number.isNaN(dogAng)) for (const s of [-1, 1]) {
            const gx = scx + s * dogAng * ps;
            c.save(); c.globalCompositeOperation = 'lighter';
            for (const [off, col, rr] of [[-0.5, 'rgba(255,90,60,0.55)', 2.2], [0, 'rgba(255,240,210,0.7)', 2.4], [0.9, 'rgba(120,170,255,0.35)', 2.6]]) {
              const gg = c.createRadialGradient(gx - s * off * ps, scy, 0, gx - s * off * ps, scy, rr * ps);
              gg.addColorStop(0, col); gg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gg; c.fillRect(gx - s * off * ps - rr * ps, scy - rr * ps, 2 * rr * ps, 2 * rr * ps);
            }
            c.restore();
          }
          S.source(c, scx, scy, { kind: 'sun', size: 9, color: '#fff3c0' });
          // the rings of the labels
          const d22 = O.deg(O.minDeviation(iceN(O, 550), O.rad(60))), d46 = O.deg(O.minDeviation(iceN(O, 550), O.rad(90)));
          c.save(); c.strokeStyle = 'rgba(255,255,255,0.35)'; c.setLineDash([3, 4]); c.lineWidth = 1;
          for (const rr of [d22, d46]) { c.beginPath(); c.arc(scx, scy, rr * ps, 0, TAU); c.stroke(); }
          c.restore();
          kit.label(c, Math.round(d22) + '°', scx + d22 * ps * 0.72 + 3, scy - d22 * ps * 0.72 - 4, { color: '#e9edf8', size: 11 });
          kit.label(c, Math.round(d46) + '°', scx + d46 * ps * 0.72 + 3, scy - d46 * ps * 0.72 - 4, { color: '#e9edf8', size: 11 });
          kit.label(c, 'sky round the Sun (flat map)', rx + rw / 2, 14, { align: 'center', color: C.muted, size: 11.5 });
          // the plot of the deviation curve
          const n550 = iceN(O, 550), pts = [];
          for (let i = 0; i <= 80; i++) { const t = (20 + 68 * i / 80) * D2R, q = O.prism(n550, A, t); if (!q.tir) pts.push([t * R2D, q.delta * R2D]); }
          const dmin = O.minDeviation(n550, A) * R2D;
          plot.set({ series: [{ pts, color: C.accent, width: 2 }], legend: false, x: { label: 'angle of incidence (°)', min: 20, max: 88 }, y: { label: 'deviation (°)', min: Math.floor(dmin - 3), max: Math.ceil(dmin + 40) }, vlines: [{ x: V.inc }], hlines: [{ y: dmin, label: 'minimum ' + dmin.toFixed(1) + '°' }], marks: [] });
          const eR = O.minDeviation(iceN(O, 650), A) * R2D, eB = O.minDeviation(iceN(O, 450), A) * R2D;
          ro.set('a', V.A + '°  (n = ' + n550.toFixed(3) + ')');
          ro.set('dmin', dmin.toFixed(1) + '°');
          ro.set('edge', eR.toFixed(1) + '° · ' + eB.toFixed(1) + '°');
          ro.set('now', Number.isNaN(nowDelta) ? 'none: totally reflected' : (nowDelta * R2D).toFixed(1) + '°');
          ro.set('dog', Number.isNaN(dogAng) ? 'none: the Sun is too high' : dogAng.toFixed(1) + '°  (Sun at ' + V.sun + '°)');
        } else {
          // ---- a thin cloud of droplets (drawn to scale: 1.2 px per µm) and the corona
          const dpx = V.dia * 1.2, gap = Math.max(dpx * 1.7, 9), rnd = rng(11);
          c.save(); c.beginPath(); c.rect(8, 28, lw - 8, Hh - 56); c.clip();
          c.strokeStyle = S.edge(); c.fillStyle = S.glass(0.3); c.lineWidth = 1;
          for (let y = 28 + gap / 2; y < Hh - 28 + gap; y += gap) for (let x = 8 + gap / 2; x < lw + gap; x += gap) {
            const jx = x + (rnd() - 0.5) * gap * 0.5, jy = y + (rnd() - 0.5) * gap * 0.5, r = dpx / 2 * Math.exp(V.spread * (rnd() + rnd() + rnd() - 1.5) * 1.2);
            c.beginPath(); c.arc(jx, jy, Math.max(1.2, r), 0, TAU); c.fill(); c.stroke();
          }
          c.restore();
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(14, Hh - 14); c.lineTo(14 + 20 * 1.2, Hh - 14); c.stroke();
          kit.label(c, '20 µm', 14 + 12 + 6, Hh - 14, { color: C.text, size: 11 });
          kit.label(c, 'droplets, to scale', lw / 2, 14, { align: 'center', color: C.muted, size: 11 });
          const ckey = V.dia.toFixed(3) + '|' + V.spread;
          if (cor.key !== ckey) { cor.key = ckey; cor.prof = coronaProfile(V.dia, V.spread); cor.pts = null; }
          const prof = cor.prof;
          S.image(c, sx0, sy0, side, side, 150, 150, (u, v) => {
            const x = (u - 0.5) * 2 * 9, y = (v - 0.5) * 2 * 9, r = Math.hypot(x, y), k = Math.min(KR - 1, Math.floor(r / 9 * KR)), g = prof[k];
            return [clamp(255 * Math.pow(g[0], 0.42), 0, 255), clamp(255 * Math.pow(g[1], 0.42), 0, 255), clamp(255 * Math.pow(g[2], 0.42), 0, 255)];
          }, { key: 'cor|' + V.dia.toFixed(2) + '|' + V.spread, id: 'cor' });
          kit.label(c, 'the corona, ±9°', rx + rw / 2, 14, { align: 'center', color: C.muted, size: 11.5 });
          if (!cor.pts) cor.pts = [[650, C.bad], [550, C.ok], [450, C.accent]].map(([nm, col]) => {
            const arr = []; for (let i = 0; i <= 120; i++) { const th = (0.04 + 9 * i / 120) * D2R; let I = 0, ws = 0; for (let z = -2; z <= 2; z += 0.5) { const w = Math.exp(-z * z / 2), dd = V.dia * Math.exp(V.spread * z) * 1e-6; I += w * O.diff.airy(Math.PI * dd * Math.sin(th) / (nm * 1e-9)); ws += w; } arr.push([th * R2D, I / ws]); }
            return { pts: arr, color: col, width: 1.8, label: nm + ' nm' };
          });
          plot.set({ series: cor.pts, legend: true, x: { label: 'angle from the Sun (°)', min: 0, max: 9 }, y: { label: 'intensity', min: 0, max: 0.06 }, vlines: [], hlines: [], marks: [] });
          ro.set('c1', NM.slice().reverse().map(nm => O.deg(Math.asin(clamp(1.22 * nm * 1e-9 / (V.dia * 1e-6), 0, 1))).toFixed(1) + '°').join(' · '));
        }
      }, box.stage);
      // where a ray inside the crystal meets the second face
      function hit(E, d, P0, P1) {
        const ex = P1[0] - P0[0], ey = P1[1] - P0[1], det = d[0] * ey - d[1] * ex || 1e-12, t = ((P0[0] - E[0]) * ey - (P0[1] - E[1]) * ex) / det;
        return [E[0] + d[0] * t, E[1] + d[1] * t];
      }
      modeUi();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the colour of the sky */
  // Rayleigh optical depth of the whole atmosphere at sea level (the standard fit, wavelength in µm) and the Kasten–Young air mass
  const tauR = nm => { const u = nm / 1000; return 0.008569 * Math.pow(u, -4) * (1 + 0.0113 * Math.pow(u, -2) + 0.00013 * Math.pow(u, -4)); };
  const airMass = h => 1 / (Math.sin(h * D2R) + 0.50572 * Math.pow(h + 6.07995, -1.6364));
  Hyper.sim('ph-sky', {
    title: 'The blue sky and the red Sun',
    blurb: `Sunlight is scattered by the air, and scattered light is blue; what the beam keeps on its way down is the light that was not scattered, and it reddens as the path grows. The picture is a view from the ground: zenith at the top, horizon at the bottom, the Sun at the elevation you choose. The graph shows the spectra behind the colours.

**Try this**
- Move the Sun from overhead to the horizon: the Sun turns from white to yellow, orange and red as the *air mass* grows to 38 and the blue is scattered out.
- Raise the haze: the Sun reddens faster and the sky turns milky.
- Change the scatterer to *cloud droplets*: the exponent becomes 0, every colour is scattered alike, and the sky goes white and grey.
- Watch the numbers: at the horizon only 0.02 % of the 450 nm light survives, against 15 % at 650 nm.

Schematic: the sky colour is a single-scattering estimate (looking away from the Sun) that takes no account of ozone or multiple scattering, so the twilight sky is only approximate. The Sun is drawn larger than life.`,
    mount(box, kit, params) {
      const O = kit.optics, Cl = O.colour, Ph = O.photo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 400 });
      const plot = plotBox(box, kit, { x: { label: 'wavelength (nm)', min: 380, max: 720 }, y: { label: 'power (rel.)', min: 0 }, legend: true, series: [] }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Elevation of the Sun', min: 0, max: 90, step: 1, value: params.h != null ? params.h : 40, unit: '°' },
        { id: 'sc', type: 'select', label: 'What scatters the light', options: [['Air molecules: 1/λ⁴ (clean air)', 4], ['Haze particles: about 1/λ¹·³', 1.3], ['Cloud droplets: all colours alike', 0]], value: params.sc != null ? params.sc : 4 },
        { id: 'aer', label: 'Haze in the path (optical depth at 550 nm)', min: 0, max: 0.8, step: 0.02, value: params.aer != null ? params.aer : 0.05 },
        { type: 'buttons', items: [{ id: 'noon', label: 'Noon' }, { id: 'aft', label: 'Late afternoon' }, { id: 'set', label: 'Sunset', primary: true }] }
      ], id => { if (id === 'noon') ctl.set('h', 90); if (id === 'aft') ctl.set('h', 20); if (id === 'set') ctl.set('h', 0); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Air mass of the Sun'], ['b', 'Sun\'s 450 nm light left'], ['r', 'Sun\'s 650 nm light left'], ['ratio', 'Blue scattered, against red'], ['tau', 'Air above you: τ at 450 · 550 · 650 nm']]);
      const SUN = nm => Ph.planck(nm, 5778);
      const exBlue = (nm, a) => a * Math.pow(550 / nm, 1.3);
      // the colour of a spectrum, as a display colour; the zenith at noon in clean air is the reference for brightness
      const lamList = []; for (let nm = 390; nm <= 710; nm += 10) lamList.push(nm);
      const tint = (fn, scale, bright) => { const X = Cl.xyz(fn, true), lin = Cl.toRgb(X.map(v => v / scale * 0.42 * bright)); return Cl.css(Cl.fit(lin)); };
      const refY = Cl.xyz(nm => SUN(nm) * (1 - Math.exp(-tauR(nm))), true)[1];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const h = V.h, ms = airMass(h), n = V.sc, a = V.aer;
        const tauS0 = n === 4 ? 1 : n === 1.3 ? 0.3 : 6;                         // optical depth of the scatterers at 550 nm, straight up
        const tauS = nm => n === 4 ? tauR(nm) : tauS0 * Math.pow(550 / nm, n);
        const ext = nm => tauR(nm) + exBlue(nm, a);                               // what takes light out of the direct beam
        const bright = h <= 0 ? 0.28 : 0.28 + 0.72 * Math.pow(Math.sin(h * D2R), 0.55);
        const gy = Math.round(Hh * 0.88), NB = 30;
        // the sky: bands from the zenith (top) to the horizon
        for (let i = 0; i < NB; i++) {
          const e = 90 - 90 * (i + 0.5) / NB, mv = airMass(Math.max(0.5, e));
          const col = tint(nm => SUN(nm) * Math.exp(-ext(nm) * ms * 0.15) * (1 - Math.exp(-tauS(nm) * mv)), refY, bright);
          c.fillStyle = col; c.fillRect(0, gy * i / NB, W, gy / NB + 1);
        }
        // the Sun and its glow
        const sx = W * 0.3, sy = gy * (1 - h / 90), sunLin = Cl.fit(Cl.toRgb(Cl.xyz(nm => SUN(nm) * Math.exp(-ext(nm) * ms), true).map((v, i, arr) => v / arr[1])), 1);
        const sunCss = Cl.css(sunLin), glow = Cl.css(sunLin, 0.0);
        const gr = c.createRadialGradient(sx, sy, 4, sx, sy, Math.min(W, Hh) * 0.5);
        gr.addColorStop(0, Cl.css(sunLin, 0.65)); gr.addColorStop(1, glow); c.fillStyle = gr; c.fillRect(0, 0, W, gy);
        c.fillStyle = sunCss; c.beginPath(); c.arc(sx, sy, 11, 0, TAU); c.fill();
        // the ground
        c.fillStyle = C.dark ? '#10151f' : '#4a5440'; c.fillRect(0, gy, W, Hh - gy);
        c.beginPath(); c.moveTo(0, gy); for (let x = 0; x <= W; x += 12) c.lineTo(x, gy - 7 * Math.abs(Math.sin(x * 0.021 + 1)) - 3 * Math.sin(x * 0.07)); c.lineTo(W, gy); c.closePath(); c.fill();
        kit.label(c, 'zenith', W - 10, 12, { align: 'right', color: '#e9edf8', size: 11 });
        kit.label(c, 'horizon', W - 10, gy - 12, { align: 'right', color: '#e9edf8', size: 11 });
        kit.label(c, 'sky colour in the direction away from the Sun', 10, Hh - 8, { color: '#e9edf8', size: 11 });
        // the spectra
        const lam = []; for (let nm = 380; nm <= 720; nm += 10) lam.push(nm);
        const top = Math.max(...lam.map(SUN));
        plot.set({
          x: { label: 'wavelength (nm)', min: 380, max: 720 }, y: { label: 'power (rel.)', min: 0, max: 1.1 }, legend: true,
          series: [
            { pts: lam.map(nm => [nm, SUN(nm) / top]), color: C.faint, width: 1.6, dash: true, label: 'sunlight above the air' },
            { pts: lam.map(nm => [nm, SUN(nm) * Math.exp(-ext(nm) * ms) / top]), color: C.warn, width: 2.2, label: 'the Sun, seen from here' },
            { pts: lam.map(nm => [nm, 0.5 * Math.pow(550 / nm, n) * SUN(nm) / SUN(550)]), color: C.accent, width: 2, label: 'scattered light (shape)' }
          ]
        });
        const Tb = Math.exp(-ext(450) * ms), Tr = Math.exp(-ext(650) * ms);
        ro.set('m', ms.toFixed(ms < 10 ? 2 : 1));
        ro.set('b', pct(Tb));
        ro.set('r', pct(Tr));
        ro.set('ratio', n === 0 ? 'the same (×1.0)' : '× ' + Math.pow(650 / 450, n).toFixed(1));
        ro.set('tau', tauR(450).toFixed(3) + ' · ' + tauR(550).toFixed(3) + ' · ' + tauR(650).toFixed(3));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the green flash and twinkling */
  // Refraction by Sæmundsson's formula (true altitude, arcminutes), scaled by (n − 1) of air for each colour.
  const refr = hTrue => 1.02 / Math.tan((hTrue + 10.3 / (hTrue + 5.11)) * D2R);
  // Bennett's formula for the same thing against the apparent altitude (for the plot)
  const refrApp = hApp => 1 / Math.tan((hApp + 7.31 / (hApp + 4.4)) * D2R);
  Hyper.sim('ph-flash', {
    title: 'The green flash and the twinkling of stars',
    blurb: `**Flash.** The air bends sunlight more for blue than for red, so near the horizon the Sun is really a stack of coloured discs, the blue one highest. Each colour is drawn separately here (red, green and blue, with the strength the air leaves them: the blue is mostly scattered away) and added up. The *colour offsets are exaggerated* by the slider; the flattening of the Sun by refraction is true to scale. The last sliver of the Sun to vanish is the highest: green.

**Twinkle.** Turbulent cells in the air make a pattern of bright and dark patches, about 7 cm across, that slides over the ground in the wind. A point source shows the whole pattern; a source wider than about 1.5 arc-seconds smears it out; a large telescope averages many patches. The graph is the brightness record for the source and aperture you choose.

**Try this**
- Flash: lower the Sun's altitude to −0.8° with the offsets at 20×: red sets first, then yellow, then a thin green rim remains. Add haze and the green fades.
- Twinkle: leave the source at 0.05″ (a star) and the eye's 7 mm pupil: strong flicker. Press *Jupiter* (about 40″): steady.
- Open the aperture to 300 mm: even a star steadies, as in a telescope.

The twinkling record is schematic (a spectrum of patches with the right scale, scaled so a star flickers by about 30 % to the naked eye); the refraction is the standard formula scaled by the index of air for each colour.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310, maxH: 400 });
      const plot = plotBox(box, kit, { x: { label: 'angle' }, y: { label: 'y' }, legend: false, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['The green flash', 'flash'], ['Twinkling: star and planet', 'twinkle']], value: params.mode || 'flash' },
        { id: 'h', label: 'Sun\'s true altitude (centre)', min: -1.3, max: 0.5, step: 0.01, value: params.h != null ? params.h : -0.45, unit: '°' },
        { id: 'ex', label: 'Exaggerate the colour offsets', min: 1, max: 40, value: params.ex || 15, log: true, sig: 2, unit: '×' },
        { id: 'aer', label: 'Haze (optical depth at 550 nm)', min: 0, max: 0.6, step: 0.02, value: params.aer != null ? params.aer : 0.05 },
        { id: 'th', label: 'Angular size of the source', min: 0.01, max: 60, value: params.th || 0.05, log: true, sig: 2, unit: '″' },
        { id: 'ap', label: 'Aperture of the eye or telescope', min: 7, max: 1000, value: params.ap || 7, log: true, sig: 2, unit: 'mm' },
        { id: 'hh', label: 'Height of the turbulent layer', min: 1, max: 15, step: 0.5, value: 10, unit: 'km' },
        { type: 'buttons', items: [{ id: 'star', label: 'A star' }, { id: 'mars', label: 'Mars (6″)' }, { id: 'jup', label: 'Jupiter (40″)', primary: true }] }
      ], id => {
        if (id === 'star') { ctl.set('th', 0.05); ctl.set('ap', 7); }
        if (id === 'mars') ctl.set('th', 6);
        if (id === 'jup') ctl.set('th', 40);
        modeUi(); loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ref', 'Refraction of the Sun\'s centre'], ['disp', 'Blue above red (true scale)'], ['green', 'Green rim above red limb'], ['flat', 'Height of the Sun'], ['F', 'Size of the flickering patches'], ['sig', 'Brightness flicker'], ['cell', 'Smallest source that steadies it']]);
      const modeUi = () => {
        const f = V.mode === 'flash';
        for (const id of ['h', 'ex', 'aer']) ctl.show(id, f);
        for (const id of ['th', 'ap', 'hh', 'star', 'mars', 'jup']) ctl.show(id, !f);
        for (const k of ['ref', 'disp', 'green', 'flat']) ro.show(k, f);
        for (const k of ['F', 'sig', 'cell']) ro.show(k, !f);
        tw.key = null;
        if (f) loop.stop(); else loop.start();
      };
      const nAir = nm => (O.index('air', nm) - 1) / (O.index('air', 550) - 1);
      const COL = [[650, '255,40,20'], [540, '40,255,60'], [455, '50,90,255']];
      // the twinkling spectrum: components of a pattern of patches whose scale is the Fresnel scale of the layer
      const rnd = rng(5), M = 56, comp = [];
      for (let j = 0; j < M; j++) comp.push({ u: 0.12 * Math.pow(60, j / (M - 1)), ph: rnd() * TAU });        // u = spatial frequency × Fresnel scale
      let ref = null;
      const tw = { key: null, lv: null, gain: 0, sig: 0 }, WIND = 10;
      const level = (th, ap, hh) => {
        const lam = 550e-9, Fs = Math.sqrt(lam * hh * 1000), out = [];
        let s2 = 0;
        for (const q of comp) {
          const f = q.u / Fs, w = Math.pow(f, -8 / 3) * Math.pow(Math.sin(Math.PI * q.u * q.u), 2) * f;        // Kolmogorov, weak scintillation: f^(−8/3) sin²(π λ h f²)
          const src = O.jinc(Math.PI * f * (th * Math.PI / 648000) * hh * 1000), apf = O.jinc(Math.PI * f * ap * 1e-3);
          out.push({ f, w: w * src * src * apf * apf });
          s2 += w * src * src * apf * apf;
        }
        return { out, s2 };
      };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'flash') {
          const hz = Math.round(Hh * 0.62), ppd = Math.min(W * 0.5, Hh * 0.55) / 0.53 * 0.85;      // pixels per degree: the Sun is 0.53° across
          const cx = W * 0.5, h = V.h, limb = 16 / 60;
          // sky and sea
          const sk = c.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, C.dark ? '#0d1530' : '#27406e'); sk.addColorStop(1, 'rgb(150,70,40)'); c.fillStyle = sk; c.fillRect(0, 0, W, hz);
          // each colour: an ellipse whose vertical size is the refracted size of the disc, centred on its refracted position
          c.save(); c.beginPath(); c.rect(0, 0, W, hz); c.clip(); c.globalCompositeOperation = 'lighter';
          const imgs = COL.map(([nm, rgb]) => {
            const f = nAir(nm), aTop = h + limb + refr(h + limb) * f / 60, aBot = h - limb + refr(h - limb) * f / 60, aC = h + refr(h) * f / 60;
            const m = airMass(Math.max(0.3, aC)), T = Math.exp(-(tauR(nm) + V.aer * Math.pow(550 / nm, 1.3)) * m);
            return { nm, rgb, aTop, aBot, aC, T };
          });
          const Tmax = Math.max(...imgs.map(q => q.T));
          const aG = imgs[1].aC;
          for (const q of imgs) {
            const off = (q.aC - aG) * (V.ex - 1), vr = Math.max(0.01, (q.aTop - q.aBot) / 2) * ppd, yc = hz - (q.aC + off) * ppd, w = Math.pow(q.T / Tmax, 0.4);
            c.fillStyle = 'rgba(' + q.rgb + ',' + (0.9 * w).toFixed(3) + ')';
            c.beginPath(); c.ellipse(cx, yc, limb * ppd, vr, 0, 0, TAU); c.fill();
          }
          c.restore();
          // the sea
          c.fillStyle = C.dark ? '#050912' : '#13203a'; c.fillRect(0, hz, W, Hh - hz);
          c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, hz); c.lineTo(W, hz); c.stroke();
          kit.label(c, 'horizon', 8, hz + 12, { color: '#e9edf8', size: 11 });
          kit.label(c, 'colour offsets × ' + kit.fmt(V.ex, 2), W - 8, 14, { align: 'right', color: '#e9edf8', size: 11 });
          kit.label(c, 'the Sun (32′ across, drawn to scale)', 8, 14, { color: '#e9edf8', size: 11 });
          const dispArc = refr(h) * (nAir(450) - nAir(650)) * 60, greenCap = (imgs[1].aTop - imgs[0].aTop) * 3600;
          ro.set('ref', refr(h).toFixed(1) + '′ at true altitude ' + h.toFixed(2) + '°');
          ro.set('disp', dispArc.toFixed(0) + '″ (450 against 650 nm)');
          ro.set('green', greenCap.toFixed(0) + '″ of sky');
          ro.set('flat', ((imgs[1].aTop - imgs[1].aBot) * 60).toFixed(1) + '′ against 32′ wide');
          const pts = []; for (let a = 0; a <= 10; a += 0.25) pts.push([a, refrApp(a) * (nAir(450) - nAir(650)) * 60]);
          const happ = imgs[1].aC;
          plot.set({ series: [{ pts, color: C.accent, width: 2 }], legend: false, x: { label: 'apparent altitude (°)', min: 0, max: 10 }, y: { label: 'blue − red (″)', min: 0 }, vlines: happ > 0 ? [{ x: Math.min(happ, 10) }] : [], hlines: [], marks: [] });
        } else {
          // ---- a star or a planet: the brightness record (recomputed only when an input changes)
          const key = [V.th, V.ap, V.hh].join();
          if (tw.key !== key) {
            tw.key = key; tw.lv = level(V.th, V.ap, V.hh);
            if (!ref) ref = level(0.001, 7, 10).s2;
            tw.gain = 0.3 / Math.sqrt(ref / 2); tw.sig = tw.gain * Math.sqrt(tw.lv.s2 / 2);
            const pts = [], span = 0.3;
            for (let i = 0; i <= 300; i++) { const tt = span * i / 300; let I = 1; for (let k = 0; k < M; k++) I += tw.gain * Math.sqrt(tw.lv.out[k].w) * Math.cos(TAU * tw.lv.out[k].f * WIND * tt + comp[k].ph); pts.push([tt * 1000, Math.max(0, I)]); }
            plot.set({ series: [{ pts, color: C.warn, width: 1.6 }], legend: false, x: { label: 'time (ms)', min: 0, max: 300 }, y: { label: 'brightness', min: 0, max: 2 }, vlines: [], hlines: [{ y: 1 }], marks: [] });
          }
          // the source, with the flicker slowed 25 times
          const sky = c.createLinearGradient(0, 0, 0, Hh); sky.addColorStop(0, '#02040a'); sky.addColorStop(1, '#0b1226'); c.fillStyle = sky; c.fillRect(0, 0, W, Hh);
          const ts = (t || 0) / 25;
          let I = 1; for (let k = 0; k < M; k++) I += tw.gain * Math.sqrt(tw.lv.out[k].w) * Math.cos(TAU * tw.lv.out[k].f * WIND * ts + comp[k].ph);
          const rad = 4 + 7 * Math.log10(1 + V.th / 3), b = clamp(I / 1.6, 0.05, 1);
          const g = c.createRadialGradient(W / 2, Hh / 2, 0, W / 2, Hh / 2, rad * 5); g.addColorStop(0, 'rgba(255,248,230,' + (0.9 * b).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,248,230,0)'); c.fillStyle = g; c.fillRect(W / 2 - rad * 5, Hh / 2 - rad * 5, rad * 10, rad * 10);
          c.fillStyle = 'rgba(255,250,240,' + b.toFixed(3) + ')'; c.beginPath(); c.arc(W / 2, Hh / 2, rad, 0, TAU); c.fill();
          kit.label(c, 'the source as seen (flicker slowed 25 times)', W / 2, 16, { align: 'center', color: '#c9d0e8', size: 11.5 });
          kit.label(c, V.th < 1.5 ? 'point-like: twinkles' : 'extended: steady', W / 2, Hh - 16, { align: 'center', color: '#c9d0e8', size: 12 });
          const Fs = Math.sqrt(550e-9 * V.hh * 1000);
          ro.set('F', (Fs * 100).toFixed(1) + ' cm  (√(λh))');
          ro.set('sig', (100 * tw.sig).toFixed(tw.sig < 0.1 ? 1 : 0) + ' % (rms)');
          ro.set('cell', (Fs / (V.hh * 1000) * 206265).toFixed(1) + '″  (Fresnel scale ÷ h)');
        }
      }, box.stage);
      modeUi();
      st.onResize(() => loop.once());
      loop.once();
    }
  });


  /* ================================================================ a partly reflecting pane */
  // a person drawn from above-the-head simply: a head and shoulders silhouette
  const person = (c, x, y, h) => { c.beginPath(); c.arc(x, y - h * 0.62, h * 0.17, 0, TAU); c.moveTo(x - h * 0.28, y); c.quadraticCurveTo(x - h * 0.3, y - h * 0.4, x, y - h * 0.42); c.quadraticCurveTo(x + h * 0.3, y - h * 0.4, x + h * 0.28, y); c.closePath(); };
  const greyOf = (L, ref, dark) => { const v = clamp(Math.pow(Math.max(L, 0) / Math.max(ref, 1e-9), 0.42), 0, 1), k = dark ? 1 : 0.92; return 'rgb(' + Math.round(v * 225 * k + 6) + ',' + Math.round(v * 232 * k + 8) + ',' + Math.round(v * 250 * k + 14) + ')'; };
  Hyper.sim('ph-pane', {
    title: 'A partly reflecting pane: Pepper\'s ghost and the one-way mirror',
    blurb: `A pane that reflects a fraction *R* of the light and passes the rest is a mirror and a window at once. What you see through it is the **sum** of the light of your own side, reflected, and the light of the other side, transmitted. Which one wins is decided by the brightness of the two sides, not by any one-way property of the glass.

**Try this**
- *Pepper's ghost*: the hidden room is lit at 1000 cd/m², the stage at 20. The audience sees a translucent ghost on the stage. Raise the stage lights to 500 and the ghost disappears into the scenery.
- Make the pane *beam-splitter glass* (30 %): the ghost is brighter, but the stage behind it is dimmer.
- *Two-way mirror*: from the bright room the pane is a mirror (you see yourself); from the dark room it is a window. Light the dark room up to equal the bright one and both sides see both.
- The same pane with the two rooms swapped in brightness swaps the roles.

The pane is taken as lossless (it transmits 1 − R); real metal coatings also absorb a little. Brightness in the pictures is compressed the way the eye does it, relative to the brightest area.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320, maxH: 430 });
      const mode0 = params.mode === 'oneway' ? 'oneway' : 'pepper';
      const DEF = { pepper: { R: 10, La: 1000, Lb: 20 }, oneway: { R: 50, La: 500, Lb: 5 } };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Arrangement', options: [['Pepper\'s ghost: pane at 45° in front of a stage', 'pepper'], ['Two-way mirror between two rooms', 'oneway']], value: mode0 },
        { id: 'R', label: 'Reflectance of the pane', min: 3, max: 90, step: 1, value: params.R || DEF[mode0].R, unit: '%' },
        { id: 'La', label: 'Lit side: hidden room, or bright room', min: 5, max: 5000, value: params.La || DEF[mode0].La, log: true, sig: 2, unit: 'cd/m²' },
        { id: 'Lb', label: 'Other side: the stage, or dark room', min: 0.5, max: 2000, value: params.Lb || DEF[mode0].Lb, log: true, sig: 2, unit: 'cd/m²' },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear glass (10 %)' }, { id: 'split', label: 'Glass 30/70' }, { id: 'half', label: 'Half-silvered (50 %)', primary: true }, { id: 'swap', label: 'Swap the two brightnesses' }] }
      ], id => {
        if (id === 'mode') { const d = DEF[V.mode]; ctl.set('R', d.R); ctl.set('La', d.La); ctl.set('Lb', d.Lb); }
        if (id === 'clear') ctl.set('R', 10); if (id === 'split') ctl.set('R', 30); if (id === 'half') ctl.set('R', 50);
        if (id === 'swap') { const a = V.La, b = V.Lb; ctl.set('La', clamp(b, 5, 5000)); ctl.set('Lb', clamp(a, 0.5, 2000)); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'Reflected light of the lit side, R·L'], ['s', 'Transmitted light of the other side, T·L'], ['c', 'Ratio of the two'], ['v', 'What you see'], ['stop', 'Light lost by what is seen through (stops)']]);
      const verdict = c => c > 10 ? 'only the reflection (a mirror)' : c > 3 ? 'a clear reflection, the far side faint' : c > 1 ? 'both: a translucent ghost' : c > 0.33 ? 'the far side, with a faint reflection' : 'only the far side (a window)';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const R = V.R / 100, T = 1 - R, La = V.La, Lb = V.Lb, pep = V.mode === 'pepper';
        const lw = Math.round(W * 0.56) - 6, rx = lw + 12, rw = W - rx - 8;
        const dark = C.dark;
        if (pep) {
          // ---- seen from above: audience on the left, the stage on the right, the hidden room below, the pane at 45°
          const ey = Hh * 0.36, px = lw * 0.4, d = Hh * 0.3;
          // the stage and the hidden room
          c.fillStyle = S.glass(0.05); c.fillRect(px + 8, ey - Hh * 0.28, lw - px - 10, Hh * 0.56);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(px + 8, ey - Hh * 0.28, lw - px - 10, Hh * 0.56);
          c.fillStyle = 'rgba(255,225,120,' + (0.1 + 0.35 * clamp(Math.log10(La) / 3.7, 0, 1)) + ')'; c.fillRect(px - 60, ey + Hh * 0.17, 120, Hh * 0.46);
          c.strokeStyle = C.faint; c.strokeRect(px - 60, ey + Hh * 0.17, 120, Hh * 0.46);
          kit.label(c, 'stage', lw - 8, ey - Hh * 0.28 + 11, { align: 'right', color: C.muted, size: 11 });
          kit.label(c, 'hidden room', px, ey + Hh * 0.17 + 12, { align: 'center', color: C.muted, size: 11 });
          // the pane
          S.plate(c, px, ey, Hh * 0.46, -Math.PI / 4, { t: 4 });
          // the actor in the hidden room and the virtual image on the stage
          c.fillStyle = C.warn; person(c, px, ey + d + 12, 36); c.fill();
          c.save(); c.globalAlpha = 0.5; c.fillStyle = C.accent; person(c, px + d, ey + 12, 36); c.fill(); c.restore();
          kit.label(c, 'virtual image', px + d, ey + 20, { align: 'center', color: C.accent, size: 11 });
          // the eye and the rays
          const ex = 22; S.eye(c, ex, ey, 7, { dir: 1 });
          S.ray(c, [[px, ey + d - 12], [px, ey], [ex + 8, ey]], { color: C.warn, width: 1.6, arrows: true, minArrow: 60 });
          S.virtual(c, px, ey, px + d - 14, ey);
          kit.label(c, 'audience', ex, ey - 16, { align: 'center', color: C.muted, size: 11 });
          // what the audience sees
          const ghost = R * La, back = T * Lb, ref = ghost + back;
          const bx = rx, by = 30, bw = rw, bh = Math.min(Hh - 60, rw * 0.9);
          kit.label(c, 'what the audience sees', bx + bw / 2, 15, { align: 'center', color: C.muted, size: 11.5 });
          c.fillStyle = greyOf(back * 0.35, ref, dark); c.fillRect(bx, by, bw, bh * 0.62);
          c.fillStyle = greyOf(back * 0.6, ref, dark); c.fillRect(bx, by + bh * 0.62, bw, bh * 0.38);
          // a chair behind
          const chair = () => { c.beginPath(); c.rect(bx + bw * 0.58, by + bh * 0.42, bw * 0.2, bh * 0.07); c.rect(bx + bw * 0.58, by + bh * 0.2, bw * 0.03, bh * 0.29); c.rect(bx + bw * 0.62, by + bh * 0.49, bw * 0.02, bh * 0.2); c.rect(bx + bw * 0.74, by + bh * 0.49, bw * 0.02, bh * 0.2); };
          c.fillStyle = greyOf(back, ref, dark); chair(); c.fill();
          // the ghost: reflected light added to whatever is behind it
          c.save(); person(c, bx + bw * 0.36, by + bh * 0.84, bh * 0.9); c.clip();
          c.fillStyle = greyOf(ghost + back * 0.35, ref, dark); c.fillRect(bx, by, bw, bh * 0.62);
          c.fillStyle = greyOf(ghost + back * 0.6, ref, dark); c.fillRect(bx, by + bh * 0.62, bw, bh * 0.38);
          c.fillStyle = greyOf(ghost + back, ref, dark); chair(); c.fill();
          c.restore();
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
          const ratio = ghost / back;
          ro.set('g', ghost.toFixed(ghost < 10 ? 1 : 0) + ' cd/m²  (' + V.R + ' % of the hidden room)');
          ro.set('s', back.toFixed(back < 10 ? 1 : 0) + ' cd/m²  (' + Math.round(T * 100) + ' % of the stage)');
          ro.set('c', ratio.toFixed(ratio < 10 ? 2 : 0) + ' : 1');
          ro.set('v', verdict(ratio));
          ro.set('stop', (-Math.log2(T)).toFixed(2));
        } else {
          // ---- two rooms seen from above, the pane between them, and the two views
          const mx = lw * 0.5, top = 26, bot = Hh * 0.56;
          c.fillStyle = 'rgba(255,225,120,' + (0.08 + 0.4 * clamp(Math.log10(La) / 3.7, 0, 1)) + ')'; c.fillRect(8, top, mx - 8, bot - top);
          c.fillStyle = 'rgba(255,225,120,' + (0.08 + 0.4 * clamp(Math.log10(Lb) / 3.7, 0, 1)) + ')'; c.fillRect(mx, top, lw - mx, bot - top);
          c.strokeStyle = C.faint; c.strokeRect(8, top, lw - 8, bot - top);
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(mx, top); c.lineTo(mx, bot); c.stroke();
          kit.label(c, 'lit room', mx / 2, top + 12, { align: 'center', color: C.text, size: 11 }); kit.label(c, kit.fmt(La, 2) + ' cd/m²', mx / 2, top + 26, { align: 'center', color: C.muted, size: 10.5 });
          kit.label(c, 'other room', mx + (lw - mx) / 2, top + 12, { align: 'center', color: C.text, size: 11 }); kit.label(c, kit.fmt(Lb, 2) + ' cd/m²', mx + (lw - mx) / 2, top + 26, { align: 'center', color: C.muted, size: 10.5 });
          c.fillStyle = C.warn; person(c, mx * 0.5, (top + bot) / 2 + 22, 44); c.fill();
          c.fillStyle = C.accent; person(c, mx + (lw - mx) * 0.5, (top + bot) / 2 + 22, 44); c.fill();
          kit.label(c, 'pane', mx, bot + 12, { align: 'center', color: C.muted, size: 11 });
          // the views: viewer in the lit room, viewer in the other room
          const Lref = Math.max(R * La, T * La, R * Lb, T * Lb, T * La);
          const view = (y0, hh, reflect, through, title, lab) => {
            const bx = rx, bw = rw;
            c.fillStyle = greyOf(reflect * 0.3 + through * 0.3, Lref, dark); c.fillRect(bx, y0, bw, hh);
            c.fillStyle = greyOf(reflect, Lref, dark); person(c, bx + bw * 0.3, y0 + hh * 0.92, hh * 1.0); c.fill();
            c.fillStyle = greyOf(through, Lref, dark); person(c, bx + bw * 0.7, y0 + hh * 0.92, hh * 1.0); c.fill();
            c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, y0, bw, hh);
            kit.label(c, title, bx + bw / 2, y0 - 8, { align: 'center', color: C.muted, size: 11 });
            kit.label(c, lab[0], bx + bw * 0.3, y0 + hh + 8, { align: 'center', color: C.faint, size: 10 }); kit.label(c, lab[1], bx + bw * 0.7, y0 + hh + 8, { align: 'center', color: C.faint, size: 10 });
          };
          const vh = (Hh - 84) / 2 - 8;
          view(34, vh, R * La, T * Lb, 'seen from the lit room', ['you', 'beyond']);
          view(34 + vh + 38, vh, R * Lb, T * La, 'seen from the other room', ['beyond', 'you']);
          const cA = R * La / (T * Lb), cB = R * Lb / (T * La);
          ro.set('g', 'lit room, reflected: ' + (R * La).toFixed(R * La < 10 ? 1 : 0) + ' cd/m²');
          ro.set('s', 'other room, through: ' + (T * Lb).toFixed(T * Lb < 10 ? 1 : 0) + ' cd/m²');
          ro.set('c', 'reflection : view through = ' + (cA < 10 ? cA.toFixed(2) : cA.toFixed(0)) + ' : 1 (lit side), ' + (cB < 10 ? cB.toFixed(2) : cB.toFixed(0)) + ' : 1 (other side)');
          ro.set('v', 'lit side: ' + verdict(cA) + '. Other side: ' + verdict(cB));
          ro.set('stop', (-Math.log2(T)).toFixed(2));
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ a stereoscopic screen */
  Hyper.sim('ph-stereo', {
    title: 'A stereoscopic screen: disparity and the focus conflict',
    blurb: `A top view of a viewer, a 3-D screen and a point that is meant to float in space. The two lines of sight to the point cross the screen at two places: those are where the left-eye image (red) and the right-eye image (cyan, as in an anaglyph) must be drawn. The dashed arc is where the eyes must *focus*: always on the screen.

**Try this**
- Drag the point (or use the sliders) to the screen plane: the two images coincide and the conflict is zero.
- Pull it in front of the screen: the images cross over (negative parallax) and the eyes converge more than they focus.
- Push it far behind: the images separate by up to the eye separation, never more.
- Press *Phone* and *Cinema*: the images are about as far apart, but the mismatch in dioptres is over 40 times larger on the phone.

The eye separation is greatly exaggerated in the drawing so that the geometry is visible; the numbers are exact.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Distance of the screen', min: 0.3, max: 20, value: params.D || 2.5, log: true, sig: 2, unit: 'm' },
        { id: 'Z', label: 'Distance of the virtual point', min: 0.2, max: 30, value: params.Z || 1.5, log: true, sig: 2, unit: 'm' },
        { id: 'e', label: 'Eye separation', min: 55, max: 72, step: 1, value: params.e || 63, unit: 'mm' },
        { id: 'ana', type: 'check', label: 'Colour the two images (red and cyan)', value: true },
        { type: 'buttons', items: [{ id: 'phone', label: 'Phone (0.4 m)' }, { id: 'tv', label: 'Television (2.5 m)' }, { id: 'cin', label: 'Cinema (15 m)', primary: true }] }
      ], id => {
        if (id === 'phone') { ctl.set('D', 0.4); ctl.set('Z', 0.25); }
        if (id === 'tv') { ctl.set('D', 2.5); ctl.set('Z', 1.5); }
        if (id === 'cin') { ctl.set('D', 15); ctl.set('Z', 10); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Separation of the two images, p'], ['sign', 'The point is'], ['v', 'Vergence angle of the eyes'], ['disp', 'Disparity against the screen'], ['dd', 'Mismatch of convergence and focus'], ['ok', 'Within the usual comfort guide (±1°)?']]);
      let geo = null;
      kit.drag(st, {
        hover: true,
        hit: p => geo && Math.hypot(p.x - geo.x, p.y - geo.y) < 18 ? 'pt' : null,
        move: (w, p) => { if (!geo) return; const r = clamp((geo.yEye - p.y) / geo.Dpx, 0.05, 40); ctl.set('Z', clamp(V.D * r, 0.2, 30)); loop.once(); }
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const e = V.e / 1000, D = V.D, Z = V.Z, cx = W / 2, yEye = Hh - 44, Dpx = (Hh - 44 - 66) * 0.72, epx = Math.min(70, W * 0.1), sc = Dpx / D;
        const yScr = yEye - Dpx, zpx = Dpx * Z / D, yP = yEye - zpx, drawP = yP > 24;
        // the focus arc and the screen
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = C.ok; c.lineWidth = 1.4; c.beginPath(); c.arc(cx, yEye, Dpx, -Math.PI * 0.66, -Math.PI * 0.34); c.stroke(); c.restore();
        c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(cx - W * 0.4, yScr); c.lineTo(cx + W * 0.4, yScr); c.stroke();
        kit.label(c, 'screen, ' + kit.fmt(D, 2) + ' m', cx + W * 0.4, yScr + 16, { align: 'right', color: C.muted, size: 11.5 });
        kit.label(c, 'focus (accommodation)', cx - W * 0.4, yScr + 22, { color: C.ok, size: 11 });
        // the eyes
        const xl = cx - epx / 2, xr = cx + epx / 2;
        for (const ex of [xl, xr]) { c.save(); c.translate(ex, yEye); c.rotate(Math.PI / 2); S.eye(c, 0, 0, 9, { dir: -1 }); c.restore(); }
        kit.label(c, 'L', xl, yEye + 20, { align: 'center', color: C.muted, size: 11 }); kit.label(c, 'R', xr, yEye + 20, { align: 'center', color: C.muted, size: 11 });
        // the images on the screen: the left eye's line crosses the screen a fraction D/Z of the way from the left eye to the point
        const px = cx, ptY = drawP ? yP : 24, f = D / Z, pPix = clamp(epx * (1 - f), -W * 0.4, W * 0.4);
        const plx = cx - pPix / 2, prx = cx + pPix / 2;
        const colL = V.ana ? '#e5484d' : C.accent, colR = V.ana ? '#18b8c9' : C.accent;
        const t = (yEye - ptY) / (yEye - yScr);
        S.ray(c, [[xl, yEye - 9], [xl + (plx - xl) * t, ptY]], { color: colL, width: 1.5, arrows: false });
        S.ray(c, [[xr, yEye - 9], [xr + (prx - xr) * t, ptY]], { color: colR, width: 1.5, arrows: false });
        if (drawP) { kit.dot(c, px, yP, 7, C.warn, C.text); kit.label(c, 'virtual point, ' + kit.fmt(Z, 2) + ' m', px + 12, yP - 6, { color: C.warn, size: 11.5 }); geo = { x: px, y: yP, yEye, Dpx }; }
        else { kit.arrow(c, px, 40, px, 22, C.warn, 2.4, 9); kit.label(c, 'far beyond the picture', px + 12, 30, { color: C.warn, size: 11.5 }); geo = { x: px, y: 30, yEye, Dpx }; }
        kit.dot(c, plx, yScr, 5, colL, C.text); kit.dot(c, prx, yScr, 5, colR, C.text);
        const pEff = e * (Z - D) / Z, sgn = pEff > 1e-6 ? 'behind the screen' : pEff < -1e-6 ? 'in front of the screen' : 'on the screen';
        kit.label(c, 'left eye image', cx - Math.abs(pPix) / 2 - 8, yScr - 16, { align: 'right', color: colL, size: 11 });
        kit.label(c, 'right eye image', cx + Math.abs(pPix) / 2 + 8, yScr - 16, { align: 'left', color: colR, size: 11 });
        kit.label(c, 'eye separation exaggerated', 8, Hh - 10, { color: C.faint, size: 10.5 });
        // numbers
        const v = 2 * Math.atan(e / (2 * Z)), disp = 2 * Math.atan(e / (2 * Z)) - 2 * Math.atan(e / (2 * D)), dd = 1 / Z - 1 / D;
        ro.set('p', (pEff * 1000).toFixed(Math.abs(pEff) < 0.1 ? 1 : 0) + ' mm' + (pEff < -1e-6 ? '  (crossed)' : ''));
        ro.set('sign', sgn + (Math.abs(pEff) > e * 0.97 ? ' (at the limit: the eyes parallel)' : ''));
        ro.set('v', (v * R2D).toFixed(v * R2D < 1 ? 2 : 1) + '°');
        ro.set('disp', (disp * R2D >= 0 ? '+' : '') + (disp * R2D).toFixed(2) + '°');
        ro.set('dd', Math.abs(dd).toFixed(Math.abs(dd) < 0.1 ? 3 : 2) + ' D');
        ro.set('ok', Math.abs(disp * R2D) <= 1.0 ? 'yes' : 'no: ' + Math.abs(disp * R2D).toFixed(1) + '°');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });


  /* ================================================================ lenticular pictures and random-dot stereograms */
  // A single-image random-dot stereogram by the standard linking method (Thimbleby, Inglis and Witten): pixels that the two
  // eyes must see as one point are tied together, then free pixels are filled with random dots. z: 0 far … 1 near.
  const sirds = (nx, ny, E, mu, zOf, seed) => {
    const buf = new Uint8Array(nx * ny), rnd = rng(seed), same = new Int32Array(nx);
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) same[x] = x;
      for (let x = 0; x < nx; x++) {
        const z = zOf(x / nx, y / ny), s = Math.round((1 - mu * z) * E / (2 - mu * z));
        let left = x - ((s + (s & y & 1)) >> 1), right = left + s;
        if (left >= 0 && right < nx) {
          let k = same[left];
          while (k !== left && k !== right) { if (k < right) left = k; else { left = right; right = k; } k = same[left]; }
          same[left] = right;
        }
      }
      for (let x = nx - 1; x >= 0; x--) buf[y * nx + x] = same[x] === x ? (rnd() < 0.5 ? 0 : 1) : buf[y * nx + same[x]];
    }
    return buf;
  };
  const SHAPES = {
    pyr: (u, v) => { const dx = (u - 0.5) * 1.7, dy = v - 0.5; return clamp(1 - Math.max(Math.abs(dx), Math.abs(dy)) / 0.3, 0, 1); },
    disc: (u, v) => { const dx = (u - 0.5) * 1.7, dy = v - 0.5; return clamp((0.28 - Math.hypot(dx, dy)) / 0.03, 0, 1); },
    steps: (u, v) => Math.abs(v - 0.5) > 0.3 ? 0 : u < 0.22 ? 0 : u < 0.38 ? 0.33 : u < 0.54 ? 0.66 : u < 0.7 ? 1 : 0,
    ripple: (u, v) => { const r = Math.hypot((u - 0.5) * 1.7, v - 0.5); return r > 0.42 ? 0 : 0.5 + 0.5 * Math.cos(r * 28); }
  };
  Hyper.sim('ph-lenticular', {
    title: 'A lenticular sheet and a random-dot stereogram',
    blurb: `**Lenticular sheet.** Under every tiny cylindrical lens lie *N* thin strips, one from each of *N* pictures. A lens sends the strip it covers at one angle to one direction, so from each direction the eye sees a different picture, the same one under every lens. With two pictures the print *flips*; with many views taken from neighbouring positions, your two eyes see neighbouring views and the print is in 3-D. The right-hand picture is what you would see.

**Random-dot stereogram.** There is no sheet: each row repeats its dots at a distance that depends on the depth. Look *through* the picture, at something far behind it, until the two guide dots become three; the shape then floats.

**Try this**
- Lenticular: drag the viewer angle (or the slider) across the sheet: the view number steps from 1 to N. With *N = 2* the print flips between two pictures.
- Move the viewer back until the eyes see the *same* view: the 3-D is lost. Move in and the eyes see views two apart: stronger depth, until it jumps.
- Make the sheet thicker against the pitch: the viewing angle narrows.
- Stereogram: change the shape or the depth; raise the repeat distance and the picture needs a more distant gaze.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 340, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Lenticular sheet', 'lens'], ['Random-dot stereogram', 'dots']], value: params.mode || 'lens' },
        { id: 'N', label: 'Views under each lens', min: 2, max: 12, step: 1, value: params.N || 6 },
        { id: 'ratio', label: 'Sheet thickness ÷ pitch', min: 1.6, max: 4, step: 0.05, value: params.ratio || 1.75 },
        { id: 'pitch', label: 'Lens pitch', min: 80, max: 800, step: 10, value: params.pitch || 340, unit: 'µm' },
        { id: 'mat', type: 'select', label: 'Sheet material', options: [['Acrylic (PMMA)', 'PMMA'], ['Polycarbonate', 'PC']], value: 'PMMA' },
        { id: 'ang', label: 'Viewer\'s direction', min: -40, max: 40, step: 0.5, value: params.ang != null ? params.ang : 8, unit: '°' },
        { id: 'dist', label: 'Viewing distance', min: 0.2, max: 2, step: 0.05, value: 0.5, unit: 'm' },
        { id: 'shape', type: 'select', label: 'Hidden shape', options: [['Pyramid', 'pyr'], ['Raised disc', 'disc'], ['Three steps', 'steps'], ['Ripples', 'ripple']], value: 'pyr' },
        { id: 'depth', label: 'Depth (strength μ)', min: 0.1, max: 0.5, step: 0.02, value: 0.33 },
        { id: 'E', label: 'Repeat distance of the background', min: 60, max: 150, step: 2, value: 110, unit: 'px' }
      ], () => { modeUi(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lpi', 'Lenses per inch'], ['view', 'Total viewing angle'], ['each', 'Angle covered by one view'], ['now', 'Your view'], ['eyes', 'Your two eyes see views'], ['see', 'Lens visible from here?'], ['rep', 'Repeat distance, far · near'], ['gaze', 'Gaze beyond the screen']]);
      const modeUi = () => {
        const l = V.mode === 'lens';
        for (const id of ['N', 'ratio', 'pitch', 'mat', 'ang', 'dist']) ctl.show(id, l);
        for (const id of ['shape', 'depth', 'E']) ctl.show(id, !l);
        for (const k of ['lpi', 'view', 'each', 'now', 'eyes', 'see']) ro.show(k, l);
        for (const k of ['rep', 'gaze']) ro.show(k, !l);
      };
      kit.drag(st, { hover: true, hit: p => V.mode === 'lens' && p.x < st.W * 0.56 && p.y < st.H * 0.6 ? 'v' : null, move: (w, p) => { const a = Math.atan2(p.x - st.W * 0.28, st.H * 0.36 - p.y) * R2D; ctl.set('ang', clamp(Math.round(a * 2) / 2, -40, 40)); loop.once(); } });
      // the picture of one view: a near disc, a middle square and a far triangle, shifted by the viewpoint
      const viewPic = (c, x, y, w, h, k, N, C, dim) => {
        const s = (k - (N - 1) / 2) / Math.max(1, (N - 1) / 2);       // −1 … +1 across the views
        c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
        c.fillStyle = C.dark ? '#1b2340' : '#dfe6f7'; c.fillRect(x, y, w, h);
        if (N === 2) {                                                 // a flip: two different pictures
          c.fillStyle = k === 0 ? '#e5484d' : '#18b8c9'; c.fillRect(x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.8);
          kit.label(c, k === 0 ? 'A' : 'B', x + w / 2, y + h / 2, { align: 'center', color: '#fff', size: Math.round(h * 0.55), weight: 700 });
        } else {
          c.fillStyle = '#6a8ad8'; c.beginPath(); c.moveTo(x + w * (0.5 - s * 0.03), y + h * 0.12); c.lineTo(x + w * (0.76 - s * 0.03), y + h * 0.7); c.lineTo(x + w * (0.24 - s * 0.03), y + h * 0.7); c.closePath(); c.fill();
          c.fillStyle = '#3fae7a'; c.fillRect(x + w * (0.34 - s * 0.1), y + h * 0.42, w * 0.3, h * 0.34);
          c.fillStyle = '#e5484d'; c.beginPath(); c.arc(x + w * (0.5 - s * 0.24), y + h * 0.58, h * 0.2, 0, TAU); c.fill();
        }
        c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, y, w, h);
      };
      let dotKey = '', dots = null;
      const NX = 240, NY = 140;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'lens') {
          const n = O.index(V.mat, 550), t = V.ratio * V.pitch * 1e-3, pitch = V.pitch * 1e-3, f = t / n, thMax = Math.atan(pitch / 2 / f), N = Math.round(V.N);
          const th = V.ang * D2R, each = 2 * thMax / N;
          // ---- three lenses and the strips under them, to scale in the ratio thickness : pitch; the viewer is above
          const lw = Math.round(W * 0.56), yTop = Hh * 0.36, pp = Math.min(lw / 3.6, Hh * 0.48 / V.ratio), tt = pp * V.ratio, x0 = lw / 2 - 1.5 * pp, yBot = yTop + tt;
          const Rl = tt * (n - 1) / n, fpx = tt / n, kView = clamp(Math.floor((th + thMax) / each), 0, N - 1);
          const aa = Math.asin(clamp(pp / 2 / Rl, 0, 1)), sag = Rl - Rl * Math.cos(aa);
          for (let i = 0; i < 3; i++) {
            const lx = x0 + i * pp, cx = lx + pp / 2;
            c.fillStyle = S.glass(0.3); c.strokeStyle = S.edge(); c.lineWidth = 1.3;
            c.beginPath(); c.moveTo(lx, yBot); c.lineTo(lx, yTop + sag); c.arc(cx, yTop + Rl, Rl, -Math.PI / 2 - aa, -Math.PI / 2 + aa); c.lineTo(lx + pp, yBot); c.closePath(); c.fill(); c.stroke();
            for (let j = 0; j < N; j++) {                                  // the strips: one per view, left to right in the order seen from the right to the left
              const sxj = lx + pp * (N - 1 - j) / N;
              c.fillStyle = 'hsl(' + Math.round(360 * j / N) + ',70%,' + (C.dark ? 58 : 50) + '%)'; c.fillRect(sxj + 0.5, yBot + 1, Math.max(1, pp / N - 1), 9);
              if (j === kView) { c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(sxj + 0.5, yBot + 1, Math.max(1, pp / N - 1), 9); }
            }
          }
          // the rays: parallel rays from the viewer's direction, each bent to its strip
          const L0 = Hh * 0.3, vx = lw / 2 + Math.sin(th) * L0, vy = yTop - Math.cos(th) * L0;
          for (let i = 0; i < 3; i++) {
            const cx = x0 + i * pp + pp / 2, sx = clamp(cx - fpx * Math.tan(th), x0 + i * pp + 1, x0 + i * pp + pp - 1);
            S.ray(c, [[cx + Math.sin(th) * L0 * 0.8, yTop - Math.cos(th) * L0 * 0.8], [cx, yTop], [sx, yBot]], { color: C.warn, width: 1.6, arrows: false });
          }
          kit.dot(c, vx, vy, 6, C.warn, C.text);
          kit.label(c, 'viewer (drag)', vx + 10, vy - 6, { color: C.warn, size: 11 });
          kit.label(c, 'sheet and lenses to scale', lw / 2, Hh - 12, { align: 'center', color: C.muted, size: 11 });
          // ---- what is seen
          const rx = lw + 14, rw = W - rx - 8, vh = Math.min(rw * 0.7, Hh * 0.46);
          viewPic(c, rx, 32, rw, vh, kView, N, C);
          kit.label(c, 'what you see: view ' + (kView + 1) + ' of ' + N, rx + rw / 2, 18, { align: 'center', color: C.muted, size: 11.5 });
          const ipd = 0.063, dth = 2 * Math.atan(ipd / 2 / V.dist), kL = clamp(Math.floor((th - dth / 2 + thMax) / each), 0, N - 1), kR = clamp(Math.floor((th + dth / 2 + thMax) / each), 0, N - 1);
          const tw = (rw - 8) / 2, ty = 32 + vh + 30;
          viewPic(c, rx, ty, tw, tw * 0.7, kL, N, C); viewPic(c, rx + tw + 8, ty, tw, tw * 0.7, kR, N, C);
          kit.label(c, 'left eye', rx + tw / 2, ty - 8, { align: 'center', color: C.muted, size: 11 }); kit.label(c, 'right eye', rx + tw + 8 + tw / 2, ty - 8, { align: 'center', color: C.muted, size: 11 });
          ro.set('lpi', (25400 / V.pitch).toFixed(0));
          ro.set('view', (2 * thMax * R2D).toFixed(0) + '°  (n = ' + n.toFixed(2) + ')');
          ro.set('each', (each * R2D).toFixed(1) + '°');
          ro.set('now', 'view ' + (kView + 1) + (Math.abs(th) > thMax ? ' (outside the zone)' : ''));
          ro.set('eyes', kL === kR ? (kL + 1) + ' and ' + (kR + 1) + ': the same, so flat' : (kL + 1) + ' and ' + (kR + 1) + (Math.abs(kR - kL) === 1 ? ': neighbours, so 3-D' : ': ' + Math.abs(kR - kL) + ' apart'));
          ro.set('see', (2 * Math.atan(pitch / 2 / V.dist) * R2D * 60 > 1 ? 'yes: ' : 'no: ') + (2 * Math.atan(pitch / 2 / V.dist) * R2D * 60).toFixed(1) + '′ per lens (the eye resolves about 1′)');
        } else {
          // ---- the stereogram
          const key = [V.shape, V.depth, V.E].join();
          if (key !== dotKey) { dotKey = key; dots = sirds(NX, NY, V.E, V.depth, SHAPES[V.shape], 7); }
          const w = Math.min(W - 16, (Hh - 70) * NX / NY), h = w * NY / NX, x0 = (W - w) / 2, y0 = 36;
          S.image(c, x0, y0, w, h, NX, NY, (u, v) => { const i = Math.min(NX - 1, Math.floor(u * NX)), j = Math.min(NY - 1, Math.floor(v * NY)); return dots[j * NX + i] ? [235, 235, 245] : [24, 28, 50]; }, { key, id: 'sirds', smooth: false });
          // the two guide dots, as far apart as the background repeats
          const sFar = Math.round(V.E / 2), gx = x0 + w / 2, gs = w / NX;
          c.fillStyle = C.warn; for (const s of [-1, 1]) { c.beginPath(); c.arc(gx + s * sFar * gs / 2, y0 - 14, 5, 0, TAU); c.fill(); }
          kit.label(c, 'look through it until the dots become three', W / 2, 14, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'nearer = smaller repeat of the dots', W / 2, y0 + h + 16, { align: 'center', color: C.muted, size: 11 });
          const sNear = Math.round((1 - V.depth) * V.E / (2 - V.depth));
          ro.set('rep', sFar + ' · ' + sNear + ' px (' + (sFar * gs).toFixed(0) + ' · ' + (sNear * gs).toFixed(0) + ' on screen)');
          ro.set('gaze', 'the screen\'s repeat of ' + (sFar * gs * 0.264).toFixed(0) + ' mm (at 96 dpi) puts the fused plane behind it');
        }
      }, box.stage);
      modeUi();
      st.onResize(() => loop.once());
      loop.once();
    }
  });


  /* ================================================================ a hologram as a window */
  Hyper.sim('ph-hologram', {
    title: 'A hologram is a window: parallax, a broken plate and the fringes',
    blurb: `The plate replays the light of a scene, so it works like a *window* onto three points at different depths behind it. Look from different heights (drag the eye): the near point slides past the far one, as in a real scene. Cover part of the plate: you still see the whole scene, but only through the opening, from a narrower range of positions. A photograph (mode *photograph*) shows one fixed view whatever you do.

The bottom of the picture is the *recording*: two beams, the light of the object and a reference beam, meet on the plate at an angle and make fringes. The finer the fringes, the more resolution the plate needs.

**Try this**
- Drag the eye up and down: in *hologram* mode the three points shift against each other; in *photograph* mode they do not.
- Narrow the open window to 10 mm: the scene is the same, but you see it only from a small range of heights; outside it the points disappear.
- Raise the angle between the beams to 60°: the fringe spacing falls to 633 nm and the plate needs about 1600 lines/mm. Tick *reflection hologram*: the fringes become layers 211 nm apart, over 4700 per mm.

Schematic: the lateral scale is stretched 3 times. The fringe numbers are exact for plane waves.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 350, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Record and view a', options: [['Hologram', 'holo'], ['Photograph', 'photo']], value: params.view || 'holo' },
        { id: 'ye', label: 'Height of the eye', min: -80, max: 80, step: 1, value: params.ye != null ? params.ye : 25, unit: 'mm' },
        { id: 'w', label: 'Open window of the plate', min: 5, max: 100, step: 1, value: params.w || 100, unit: 'mm' },
        { id: 'th', label: 'Angle between object and reference beams', min: 10, max: 180, step: 1, value: params.th || 30, unit: '°' },
        { id: 'lam', type: 'select', label: 'Laser', options: [['Helium–neon, 632.8 nm', 632.8], ['Green, 532 nm', 532], ['Blue, 457 nm', 457]], value: 632.8 },
        { id: 'refl', type: 'check', label: 'Reflection hologram (beams from opposite sides)', value: !!params.refl }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vis', 'Points you can see'], ['sep', 'Near and far points apart (view angle)'], ['fr', 'Fringe spacing'], ['res', 'Lines per millimetre in the plate'], ['n', 'Fringes in a 4 µm window']]);
      const PTS = [{ z: 80, y: 28, col: '#e5484d', name: 'near' }, { z: 200, y: -12, col: '#2fb36e', name: 'middle' }, { z: 420, y: 14, col: '#4d79e0', name: 'far' }];
      const DE = 500;                                                  // distance of the eye in front of the plate, mm
      let plan = null;
      kit.drag(st, { hover: true, hit: p => plan && p.x < plan.lw ? 'e' : null, move: (w, p) => { if (!plan) return; ctl.set('ye', clamp(Math.round((plan.yc - p.y) / plan.sy), -80, 80)); loop.once(); } });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const lw = Math.round(W * 0.6), kx = (lw - 24) / (DE + 440), xp = 12 + DE * kx, yc = Hh * 0.33, sy = kx * 3;
        plan = { lw, yc, sy };
        const ye = V.ye, holo = V.view === 'holo', half = V.w / 2;
        // the plate, with its covered parts
        c.strokeStyle = C.text; c.lineWidth = 5; c.beginPath(); c.moveTo(xp, yc - 50 * sy); c.lineTo(xp, yc + 50 * sy); c.stroke();
        c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(xp, yc - half * sy); c.lineTo(xp, yc + half * sy); c.stroke();
        c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(xp, yc - half * sy); c.lineTo(xp, yc + half * sy); c.stroke();
        if (V.w < 100) { c.fillStyle = C.faint; c.fillRect(xp - 3, yc - 50 * sy, 6, (50 - half) * sy); c.fillRect(xp - 3, yc + half * sy, 6, (50 - half) * sy); }
        kit.label(c, 'plate', xp, yc - 50 * sy - 12, { align: 'center', color: C.muted, size: 11 });
        // the eye
        const exp = 12, eyp = yc - ye * sy; S.eye(c, exp, eyp, 7, { dir: 1 });
        kit.label(c, 'eye (drag)', 4, eyp - 16, { align: 'left', color: C.warn, size: 11 });
        // the three points behind the plate, the rays to the eye
        let seen = 0; const apparent = [];
        for (const P of PTS) {
          const X = xp + P.z * kx, Y = yc - P.y * sy;
          const yHit = P.y + (ye - P.y) * P.z / (P.z + DE), open = !holo || Math.abs(yHit) <= half;
          const hx = xp, hy = yc - yHit * sy;
          c.save(); c.setLineDash(open ? [] : [3, 4]); c.strokeStyle = P.col; c.globalAlpha = open ? 0.9 : 0.35; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(X, Y); c.lineTo(hx, hy); c.lineTo(exp + 8, eyp); c.stroke(); c.restore();
          c.fillStyle = P.col; c.globalAlpha = 1; c.beginPath(); c.arc(X, Y, 5.5, 0, TAU); c.fill();
          kit.label(c, P.name, X + 9, Y + 4, { color: P.col, size: 10.5 });
          if (open) seen++;
          apparent.push({ P, open, a: Math.atan((P.y - (holo ? ye : 0)) / (P.z + DE)) });
        }
        kit.label(c, 'seen from above', 10, Hh * 0.62, { color: C.faint, size: 10.5 });
        // what the eye sees
        const rx = lw + 12, rw = W - rx - 8, vy = 30, vh = Math.min(Hh * 0.34, rw * 0.6);
        c.fillStyle = C.dark ? '#1b2340' : '#dfe6f7'; c.fillRect(rx, vy, rw, vh); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(rx, vy, rw, vh);
        kit.label(c, 'what you see', rx + rw / 2, 15, { align: 'center', color: C.muted, size: 11.5 });
        const K = rw * 3.2;
        for (const q of apparent.slice().reverse()) {
          const x = rx + rw / 2 - q.a * K * 1.0, r = 8 + 18 * (1 - q.P.z / 500);
          c.save(); c.beginPath(); c.rect(rx, vy, rw, vh); c.clip();
          if (q.open) { c.fillStyle = q.P.col; c.globalAlpha = 0.9; c.beginPath(); c.arc(x, vy + vh / 2, r, 0, TAU); c.fill(); }
          else { c.strokeStyle = q.P.col; c.setLineDash([3, 3]); c.beginPath(); c.arc(x, vy + vh / 2, r, 0, TAU); c.stroke(); }
          c.restore();
        }
        kit.label(c, holo ? 'dotted: hidden' : 'a photograph', rx + rw / 2, vy + vh + 14, { align: 'center', color: C.faint, size: 10.5 });
        // the recording: fringes in a 4 µm window
        const lam = V.lam, nEm = 1.5, th = V.th * D2R;
        const Lam = V.refl ? lam / (2 * nEm) : lam / (2 * Math.sin(th / 2));
        const fy = vy + vh + 40, fw = rw, fh = Math.min(46, Hh - fy - 30);
        kit.label(c, 'recording, 4 µm wide', rx + rw / 2, fy - 8, { align: 'center', color: C.muted, size: 10.5 });
        const nf = 4000 / Lam;
        S.fringes(c, rx, fy, fw, fh, u => 0.5 * (1 + Math.cos(TAU * u * nf)), { nm: lam, gamma: 0.8, vertical: !!V.refl });
        kit.label(c, V.refl ? 'layers (reflection)' : 'fringes (transmission)', rx + rw / 2, fy + fh + 12, { align: 'center', color: C.faint, size: 10.5 });
        // the numbers
        const dth = (apparent[0].a - apparent[2].a) * R2D;
        ro.set('vis', seen + ' of 3');
        ro.set('sep', holo ? (dth >= 0 ? '+' : '') + dth.toFixed(1) + '° (changes as you move)' : (dth >= 0 ? '+' : '') + dth.toFixed(1) + '° (never changes)');
        ro.set('fr', Lam.toFixed(0) + ' nm' + (V.refl ? '  (λ ÷ 2n, n = 1.5)' : '  (λ ÷ 2 sin(θ/2))'));
        ro.set('res', (1e6 / Lam).toFixed(0) + ' lines/mm (a film emulsion gives 100–200)');
        ro.set('n', nf.toFixed(1));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ iridescence */
  Hyper.sim('ph-iridescence', {
    title: 'Colour from structure: films, layers and a disc',
    blurb: `None of these surfaces has a pigment. **Soap film** and **oil on water**: light reflected from the two faces of a film a few hundred nanometres thick adds or cancels, colour by colour, so the colour depends on the thickness and the angle. **Layered stack**: eight pairs of thin layers (cuticle, index 1.56, and air) reflect one band strongly, like the scales of a blue butterfly. **Disc**: the tracks are a grating that sends each wavelength in its own direction.

The big swatch is the colour of the reflection in daylight; the bar below is the colour for every thickness (or angle); the graph is the reflectance spectrum.

**Try this**
- Soap film: slide the thickness from 0. At 0 the film is black (the two reflections cancel). Then come the first-order colours, then the pastel higher orders as the colours mix.
- Tilt the view from 0° to 60°: every colour moves towards the blue, and the dashed spectrum shows the same curve shifted.
- Oil on water: the same story, with a different surface under the film.
- Stack: the blue changes to violet as you tilt. *Disc*: the colours fan out over about 14° to 28° for a CD.

Colours are computed from the daylight spectrum, brightened for the thin films (their reflectance is only a few per cent); the stack's dimensions are illustrative.`,
    mount(box, kit, params) {
      const O = kit.optics, Cl = O.colour, F = O.film;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320, maxH: 420 });
      const plot = plotBox(box, kit, { x: { label: 'wavelength (nm)', min: 380, max: 750 }, y: { label: 'reflected (%)', min: 0 }, legend: true, series: [] }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Surface', options: [['Soap film in air (n = 1.33)', 'soap'], ['Oil film on water (n = 1.47)', 'oil'], ['Layered stack (butterfly style)', 'stack'], ['Compact disc and its relatives', 'disc']], value: params.mode || 'soap' },
        { id: 'd', label: 'Thickness of the film', min: 0, max: 1500, step: 5, value: params.d != null ? params.d : 320, unit: 'nm' },
        { id: 'scale', label: 'Layer thickness (1 = as drawn)', min: 0.6, max: 1.5, step: 0.02, value: 1 },
        { id: 'pitch', type: 'select', label: 'Track pitch', options: [['CD: 1600 nm', 1600], ['DVD: 740 nm', 740], ['Blu-ray: 320 nm', 320]], value: 1600 },
        { id: 'ang', label: 'Angle of viewing from the normal', min: 0, max: 80, step: 1, value: params.ang != null ? params.ang : 0, unit: '°' }
      ], () => { modeUi(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pk', 'Strongest reflection at'], ['R', 'Reflectance there'], ['col', 'Colour of the light'], ['sh', 'Shift against 0°']]);
      const modeUi = () => {
        const f = V.mode === 'soap' || V.mode === 'oil';
        ctl.show('d', f); ctl.show('scale', V.mode === 'stack'); ctl.show('pitch', V.mode === 'disc');
      };
      const E = O.photo.spectrum('daylight');
      const lams = []; for (let nm = 380; nm <= 750; nm += 10) lams.push(nm);
      const cm = lams.map(nm => Cl.cmf(nm)), ew = lams.map(nm => E(nm));
      const Yw = lams.reduce((s, nm, i) => s + ew[i] * cm[i][1], 0);
      const colourOf = (Rfn, gain) => { let X = 0, Y = 0, Z = 0; lams.forEach((nm, i) => { const r = Rfn(nm) * ew[i]; X += r * cm[i][0]; Y += r * cm[i][1]; Z += r * cm[i][2]; }); return Cl.css(Cl.fit(Cl.toRgb([X / Yw * gain, Y / Yw * gain, Z / Yw * gain]))); };
      const def = (mode, d, scale) => {
        if (mode === 'soap') return { n0: 1, ns: 1, layers: [{ n: 1.33, d }] };
        if (mode === 'oil') return { n0: 1, ns: 'water', layers: [{ n: 1.47, d }] };
        const layers = []; for (let i = 0; i < 8; i++) { layers.push({ n: 1.56, d: 85 * scale }); layers.push({ n: 1, d: 110 * scale }); }
        return { n0: 1, ns: 1.56, layers };
      };
      let cache = { key: '' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const mode = V.mode, film = mode !== 'disc', th = V.ang * D2R, p = V.pitch;
        const key = [mode, V.d, V.scale, V.ang, p].join();
        if (cache.key !== key) {
          const gain = mode === 'stack' ? 1 : 3.2, strip = [], N = 90;
          if (film) {
            const Rof = (d, a, scale) => nm => F.stack(def(mode, d, scale), nm, a).R;
            for (let i = 0; i < N; i++) strip.push(mode === 'stack' ? colourOf(Rof(0, 80 * i / (N - 1) * D2R, V.scale), gain) : colourOf(Rof(1500 * i / (N - 1), th, 1), gain));
            const spec = a => { const out = []; for (let nm = 380; nm <= 750; nm += 5) out.push([nm, 100 * F.stack(def(mode, V.d, V.scale), nm, a).R]); return out; };
            cache = { key, strip, swatch: colourOf(Rof(V.d, th, V.scale), gain), s0: spec(0), s1: spec(th) };
            let pk = cache.s1[0]; for (const q of cache.s1) if (q[1] > pk[1]) pk = q;
            let pk0 = cache.s0[0]; for (const q of cache.s0) if (q[1] > pk0[1]) pk0 = q;
            cache.pk = pk; cache.pk0 = pk0;
          } else {
            const lamAt = a => p * Math.sin(a), colAt = a => { const l = lamAt(a); return l >= 380 && l <= 750 ? O.colour.nmCss(l) : (C.dark ? '#1a2036' : '#cfd5e6'); };
            for (let i = 0; i < N; i++) strip.push(colAt(80 * i / (N - 1) * D2R));
            cache = { key, strip, swatch: colAt(th) };
          }
        }
        const sw = Math.min(Hh * 0.46, W * 0.3), sx0 = W * 0.5 - sw / 2 + W * 0.12, sy0 = 26;
        c.fillStyle = cache.swatch; c.fillRect(sx0, sy0, sw, sw); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(sx0, sy0, sw, sw);
        kit.label(c, 'what you see', sx0 + sw / 2, 14, { align: 'center', color: C.muted, size: 11.5 });
        // the geometry: daylight in, the reflection out at the same angle (the film), or the first order (the disc)
        const gx = W * 0.2, gy = sy0 + sw * 0.78, L = sw * 0.75;
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(gx - L * 0.8, gy); c.lineTo(gx + L * 0.8, gy); c.stroke();
        S_ray(c, [[gx - Math.sin(film ? th : 0) * L, gy - Math.cos(film ? th : 0) * L], [gx, gy]], C.warn);
        S_ray(c, [[gx, gy], [gx + Math.sin(th) * L, gy - Math.cos(th) * L]], film ? C.warn : cache.swatch);
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx, gy - L); c.stroke(); c.restore();
        kit.label(c, film ? 'light in, reflection out' : 'first order out', gx, gy + 18, { align: 'center', color: C.muted, size: 10.5 });
        kit.label(c, V.ang + '°', gx + 6, gy - L * 0.55, { color: C.text, size: 11 });
        // the bar of colours
        const bx = 16, bw = W - 32, by = sy0 + sw + 34, bh = Math.min(26, Hh - by - 38);
        for (let i = 0; i < cache.strip.length; i++) { c.fillStyle = cache.strip[i]; c.fillRect(bx + bw * i / cache.strip.length, by, bw / cache.strip.length + 1, bh); }
        const frac = film ? (mode === 'stack' ? V.ang / 80 : V.d / 1500) : V.ang / 80;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx + bw * frac, by - 4); c.lineTo(bx + bw * frac, by + bh + 4); c.stroke();
        kit.label(c, film && mode !== 'stack' ? 'thickness 0 → 1500 nm' : 'viewing angle 0° → 80°', bx, by + bh + 14, { color: C.muted, size: 11 });
        if (film) {
          plot.set({ series: [{ pts: cache.s1, color: C.accent, width: 2, label: V.ang + '°' }, { pts: cache.s0, color: C.faint, width: 1.5, dash: true, label: '0°' }], legend: true, x: { label: 'wavelength (nm)', min: 380, max: 750 }, y: { label: 'reflected (%)', min: 0 }, hlines: [], vlines: [], marks: [] });
          ro.set('pk', cache.pk[0] + ' nm');
          ro.set('R', cache.pk[1].toFixed(1) + ' %');
          ro.set('col', O.colourName(cache.pk[0]));
          ro.set('sh', (cache.pk[0] - cache.pk0[0]) + ' nm (' + cache.pk0[0] + ' nm at 0°)');
        } else {
          const pts = []; for (let a = 0; a <= 80; a += 2) pts.push([a, p * Math.sin(a * D2R)]);
          plot.set({ series: [{ pts, color: C.accent, width: 2 }], legend: false, x: { label: 'viewing angle (°)', min: 0, max: 80 }, y: { label: 'λ (nm)', min: 0, max: 1600 }, hlines: [{ y: 380 }, { y: 750 }], vlines: [{ x: V.ang }], marks: [] });
          const lam = p * Math.sin(th), lo = O.diff.grating({ linesPerMm: 1e6 / p, nm: 380, thetaI: 0, m: 1 }), hi = O.diff.grating({ linesPerMm: 1e6 / p, nm: 750, thetaI: 0, m: 1 });
          ro.set('pk', lam >= 380 && lam <= 750 ? lam.toFixed(0) + ' nm' : lam.toFixed(0) + ' nm (outside the visible)');
          ro.set('R', 'first order at m = 1');
          ro.set('col', lam >= 380 && lam <= 750 ? O.colourName(lam) : 'none');
          ro.set('sh', Number.isNaN(lo) ? 'no visible first order' : (lo * R2D).toFixed(1) + '° (violet) to ' + (Number.isNaN(hi) ? 'beyond 90°' : (hi * R2D).toFixed(1) + '° (red)'));
        }
      }, box.stage);
      const S_ray = (c, pts, color) => kit.osym.ray(c, pts, { color, width: 2.2, arrows: false });
      modeUi();
      st.onResize(() => loop.once());
      loop.once();
    }
  });


  /* ================================================================ camera artefacts */
  Hyper.sim('ph-artefacts', {
    title: 'Camera artefacts: the wagon wheel, the bent propeller and the starburst',
    blurb: `**Wagon wheel.** A film samples a turning wheel 24 (or 25, 30, 60) times a second. A wheel with *N* identical spokes looks the same after a turn of 1/N, so what the camera can tell is only the *remainder*: the apparent rate is the spoke rate N·f minus the whole number of frame rates that brings it into ±½ of the frame rate. It can freeze or run backwards.

**Rolling shutter.** A CMOS sensor reads its rows one after another. A propeller turns while the frame is being read, so each row sees the blades at a different angle: the blades bend into spirals. A global shutter exposes all rows at once.

**Starburst.** The straight edges of an iris spread each bright point into streaks at right angles to the edges. An iris with an *even* number of blades gives as many spikes as blades; an *odd* number gives twice as many.

**Try this**
- Wheel: 12 spokes, 24 fps: at exactly 2 turns a second the wheel stands still on film. At 1.9 turns a second the real wheel (left) goes forwards but the film (right) shows it creeping *backwards*; at 2.1 it creeps forwards, slowly.
- Propeller: raise the readout time; the bend grows. With the speed at 0 the two images agree.
- Starburst: step the blade count from 5 to 6, 7 and 8, and count the spikes.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 320, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['The wagon wheel on film', 'wagon'], ['A propeller under a rolling shutter', 'rolling'], ['The starburst of an iris', 'star']], value: params.mode || 'wagon' },
        { id: 'N', label: 'Spokes in the wheel', min: 3, max: 24, step: 1, value: 12 },
        { id: 'fr', label: 'Wheel turns per second', min: 0, max: 5, step: 0.05, value: params.fr != null ? params.fr : 1.9, unit: 'rev/s' },
        { id: 'fps', type: 'select', label: 'Frames per second of the camera', options: [['24', 24], ['25', 25], ['30', 30], ['60', 60]], value: 24 },
        { id: 'rps', label: 'Propeller turns per second', min: 0, max: 60, step: 1, value: params.rps != null ? params.rps : 25, unit: 'rev/s' },
        { id: 'T', label: 'Readout time of the frame', min: 1, max: 30, step: 0.5, value: 12, unit: 'ms' },
        { id: 'bl', label: 'Blades of the propeller', min: 2, max: 5, step: 1, value: 3 },
        { id: 'nb', label: 'Blades of the iris', min: 3, max: 12, step: 1, value: params.nb || 7 },
        { id: 'round', type: 'check', label: 'Round (curved) blades', value: false }
      ], () => { modeUi(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Spokes passing per second, N·f'], ['b', 'Apparent spoke rate'], ['c', 'The camera shows the wheel'], ['d', 'Turn during one readout'], ['e', 'Blades'], ['f', 'Spikes']]);
      const modeUi = () => {
        const w = V.mode === 'wagon', r = V.mode === 'rolling', s = V.mode === 'star';
        for (const id of ['N', 'fr', 'fps']) ctl.show(id, w);
        for (const id of ['rps', 'T', 'bl']) ctl.show(id, r);
        for (const id of ['nb', 'round']) ctl.show(id, s);
        ro.show('a', w); ro.show('b', w); ro.show('c', w); ro.show('d', r); ro.show('e', s); ro.show('f', s);
        if (s) loop.stop(); else loop.start();
      };
      const wheel = (c, C, x, y, R, N, phi) => {
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(x, y, R, 0, TAU); c.stroke();
        c.lineWidth = 2; c.beginPath(); for (let k = 0; k < N; k++) { const a = phi + TAU * k / N; c.moveTo(x + Math.cos(a) * R * 0.12, y + Math.sin(a) * R * 0.12); c.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R); } c.stroke();
        c.fillStyle = C.accent; c.beginPath(); c.arc(x, y, R * 0.1, 0, TAU); c.fill();
      };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (V.mode === 'wagon') {
          const R = Math.min(W * 0.2, Hh * 0.34), y = Hh * 0.48, fs = +V.fps, N = Math.round(V.N);
          const phi = TAU * V.fr * t, frame = Math.floor(t * fs), phiF = TAU * V.fr * frame / fs;
          wheel(c, C, W * 0.26, y, R, N, phi); wheel(c, C, W * 0.74, y, R, N, phiF);
          kit.label(c, 'the wheel itself', W * 0.26, y - R - 18, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'what the camera records, ' + fs + ' fps', W * 0.74, y - R - 18, { align: 'center', color: C.muted, size: 11.5 });
          const fsp = N * V.fr, k = Math.round(fsp / fs), fa = fsp - k * fs;
          const state = Math.abs(fa) < 0.02 ? 'standing still' : fa > 0 ? 'turning forwards, ' + (fa / N).toFixed(2) + ' rev/s' : 'turning BACKWARDS, ' + (-fa / N).toFixed(2) + ' rev/s';
          kit.label(c, 'frames: ' + frame, W * 0.74, y + R + 20, { align: 'center', color: C.faint, size: 11 });
          kit.label(c, state, W * 0.74, y + R + 38, { align: 'center', color: Math.abs(fa) < 0.02 ? C.warn : fa > 0 ? C.ok : C.bad, size: 12.5, weight: 650 });
          ro.set('a', fsp.toFixed(1) + ' per s');
          ro.set('b', fa.toFixed(2) + ' per s  (N f − ' + k + ' × ' + fs + ')');
          ro.set('c', state);
        } else if (V.mode === 'rolling') {
          const R = Math.min(W * 0.2, Hh * 0.36), NX = 96, NY = 96, bl = Math.round(V.bl), om = TAU * V.rps, Tr = V.T / 1000, phi0 = om * 0.02 * Math.floor(t / 0.02);
          const draw = (x0, rolling, title) => {
            S.image(c, x0, Hh * 0.5 - R, 2 * R, 2 * R, NX, NY, (u, v) => {
              const x = (u - 0.5) * 2, y = (v - 0.5) * 2, r = Math.hypot(x, y);
              if (r > 1) return [0, 0, 0];
              const ph = phi0 + (rolling ? om * Tr * v : 0), psi = Math.atan2(y, x);
              for (let k = 0; k < bl; k++) {
                let d = (psi - ph - TAU * k / bl) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU;
                if (r > 0.1 && Math.abs(d) * r <= 0.17 * (1 - 0.55 * r)) return [235, 240, 250];
              }
              return r < 0.12 ? [235, 240, 250] : [26, 32, 56];
            }, { key: [rolling, V.rps, V.T, bl, Math.round(phi0 * 1000)].join(), id: rolling ? 'roll' : 'glob' });
            kit.label(c, title, x0 + R, Hh * 0.5 - R - 14, { align: 'center', color: C.muted, size: 11.5 });
          };
          draw(W * 0.26 - R, false, 'global shutter: every row at once');
          draw(W * 0.74 - R, true, 'rolling shutter: row by row');
          kit.label(c, 'top row first', W * 0.74, Hh * 0.5 + R + 14, { align: 'center', color: C.faint, size: 10.5 });
          ro.set('d', (V.rps * Tr * 360).toFixed(0) + '° (' + (V.rps * Tr).toFixed(2) + ' turns)');
        } else {
          // ---- the starburst: the spikes of an N-sided aperture
          const n = Math.round(V.nb), spikes = V.round ? 0 : (n % 2 === 0 ? n : 2 * n);
          const rnd = rng(3), lights = []; for (let i = 0; i < 6; i++) lights.push({ x: 0.1 + 0.8 * rnd(), y: 0.15 + 0.7 * rnd(), b: 0.5 + 0.5 * rnd() });
          c.fillStyle = '#05070f'; c.fillRect(0, 0, W, Hh);
          c.save(); c.globalCompositeOperation = 'lighter';
          for (const L of lights) {
            const x = L.x * W, y = L.y * Hh, len = Math.min(W, Hh) * 0.3 * L.b;
            const g = c.createRadialGradient(x, y, 0, x, y, 14 * L.b + 4); g.addColorStop(0, 'rgba(255,250,235,0.95)'); g.addColorStop(1, 'rgba(255,250,235,0)'); c.fillStyle = g; c.fillRect(x - 24, y - 24, 48, 48);
            const seen = []; if (!V.round) for (let k = 0; k < n; k++) { const a0 = TAU * k / n - Math.PI / 2; for (const aa of [a0, a0 + Math.PI]) { const key = Math.round(((aa % TAU) + TAU) % TAU * 1000); if (!seen.includes(key)) seen.push(key); } }
            for (const key of seen) {
              const a = key / 1000, x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, gg = c.createLinearGradient(x, y, x2, y2);
              gg.addColorStop(0, 'rgba(255,248,230,0.7)'); gg.addColorStop(1, 'rgba(255,248,230,0)');
              c.strokeStyle = gg; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke();
            }
          }
          c.restore();
          // the aperture
          const ax = W - 52, ay = 50, ar = 34;
          c.strokeStyle = C.accent; c.lineWidth = 2; c.fillStyle = 'rgba(255,255,255,0.12)'; c.beginPath();
          if (V.round) c.arc(ax, ay, ar, 0, TAU); else for (let k = 0; k < n; k++) { const a = TAU * k / n + Math.PI / n - Math.PI / 2; k ? c.lineTo(ax + Math.cos(a) * ar, ay + Math.sin(a) * ar) : c.moveTo(ax + Math.cos(a) * ar, ay + Math.sin(a) * ar); }
          c.closePath(); c.fill(); c.stroke();
          kit.label(c, 'the iris', ax, ay + ar + 14, { align: 'center', color: '#9aa3c0', size: 11 });
          ro.set('e', V.round ? 'round: no straight edges' : n + (n % 2 ? ' (odd)' : ' (even)'));
          ro.set('f', V.round ? '0: no spikes' : spikes + (n % 2 ? ' (twice the blades)' : ' (as many as blades)'));
        }
      }, box.stage);
      modeUi();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the Moon illusion */
  Hyper.sim('ph-moon', {
    title: 'The Moon illusion: the same angle, a different look',
    blurb: `Two views of the Moon, drawn at the same scale: low over a landscape and high in an empty sky. Both discs are the same number of pixels across, because the Moon subtends the same angle. The ring is a **coin held at arm's length**: choose its size until it just covers the Moon in both views.

**Try this**
- Set the coin to the size the read-out gives: it fits both Moons exactly, so the angle is the same.
- Tick *remove the landscape*: with nothing to compare it with, the low Moon looks no bigger than the high one (that is what a tube or a cut-out does).
- Raise *how much farther the horizon sky seems*: the dashed ring is the size the Moon would seem to have if size and distance cues were balanced, which is the leading account.
- Switch the distance to perigee and apogee: the Moon changes by about 14 % in size, more than the 1.7 % between horizon and zenith, but nobody notices it.

The Moon is truly 1.7 % *farther* away when it is on the horizon (by about one Earth radius), so it is a little *smaller* there; refraction flattens it by about a sixth vertically but does not make it bigger.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320, maxH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'dist', type: 'select', label: 'Moon\'s distance', options: [['Mean, 384 400 km', 384400], ['Perigee (closest), 356 500 km', 356500], ['Apogee (farthest), 406 700 km', 406700]], value: 384400 },
        { id: 'coin', label: 'Coin diameter', min: 4, max: 14, step: 0.1, value: params.coin || 6.4, unit: 'mm' },
        { id: 'arm', label: 'Eye to the coin', min: 40, max: 90, step: 1, value: 70, unit: 'cm' },
        { id: 'k', label: 'How much farther the horizon sky seems', min: 1, max: 3, step: 0.05, value: params.k || 1.5, unit: '×' },
        { id: 'land', type: 'check', label: 'Remove the landscape', value: false },
        { id: 'flat', type: 'check', label: 'Show the flattening by refraction (true size)', value: false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Angular size of the Moon'], ['coin', 'Coin that just covers it'], ['cang', 'Angle of your coin'], ['hor', 'Horizon Moon: distance against zenith'], ['hsize', 'Horizon Moon: size against zenith'], ['flat', 'Refraction: height ÷ width at the horizon'], ['perc', 'Perceived size of the horizon Moon']]);
      const MR = 3474.8, RE = 6371;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const d = V.dist, ang = 2 * Math.atan(MR / 2 / d) * R2D, FOV = 8, pw = Math.floor((W - 24) / 2), ppd = pw / FOV, mr = ang / 2 * ppd;
        const coinAng = 2 * Math.atan(V.coin / 2 / (V.arm * 10)) * R2D, cr = coinAng / 2 * ppd;
        // the flattening of the Moon at the horizon by refraction (the formula of the Sun's setting, 0.52° disc)
        const hT = -0.5, half = ang / 2, vert = (hT + half + refr(hT + half) / 60) - (hT - half + refr(hT - half) / 60);
        const flat = vert / ang;
        const panel = (x0, low) => {
          c.save(); c.beginPath(); c.rect(x0, 8, pw, Hh - 16); c.clip();
          const hz = Hh * 0.8, g = c.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, low ? '#1a2552' : '#0b1030'); g.addColorStop(1, low ? '#7a5a52' : '#16204a'); c.fillStyle = g; c.fillRect(x0, 8, pw, Hh - 16);
          const mx = x0 + pw / 2 + (low ? -pw * 0.1 : pw * 0.05), my = low ? hz - 1.6 * ppd : Hh * 0.38;
          if (low && !V.land) {
            c.fillStyle = C.dark ? '#0a0e1a' : '#2b3040'; c.fillRect(x0, hz, pw, Hh - hz);
            // trees and a house in rows: the nearer, the larger (the cues of distance)
            for (let row = 0; row < 3; row++) for (let i = 0; i < 6 - row; i++) {
              const s = 1.3 - row * 0.4, x = x0 + (i + 0.5 + row * 0.3) * pw / (6 - row), y = hz + (2 - row) * 6 + 4;
              c.fillStyle = row === 0 ? '#06080f' : row === 1 ? '#0e1424' : '#1a2238'; c.beginPath(); c.moveTo(x, y - 52 * s); c.lineTo(x + 18 * s, y); c.lineTo(x - 18 * s, y); c.closePath(); c.fill();
            }
            c.fillStyle = '#0e1424'; c.fillRect(x0 + pw * 0.62, hz - 10, 36, 20); c.beginPath(); c.moveTo(x0 + pw * 0.62 - 4, hz - 10); c.lineTo(x0 + pw * 0.62 + 18, hz - 26); c.lineTo(x0 + pw * 0.62 + 40, hz - 10); c.closePath(); c.fill();
          }
          // the Moon (flattened when asked)
          c.fillStyle = '#f3ecd0'; c.beginPath(); c.ellipse(mx, my, mr, low && V.flat ? mr * flat : mr, 0, 0, TAU); c.fill();
          // the coin ring and the perceived size
          c.strokeStyle = '#7bdc9c'; c.lineWidth = 1.6; c.beginPath(); c.arc(mx, my, cr, 0, TAU); c.stroke();
          if (low) { c.save(); c.setLineDash([4, 3]); c.strokeStyle = '#e0a030'; c.lineWidth = 1.4; c.beginPath(); c.arc(mx, my, mr * V.k, 0, TAU); c.stroke(); c.restore(); }
          c.restore();
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, 8, pw, Hh - 16);
          kit.label(c, low ? 'near the horizon' : 'high in the sky', x0 + pw / 2, 22, { align: 'center', color: '#c9d0e8', size: 11.5 });
        };
        panel(8, true); panel(W - 8 - pw, false);
        kit.label(c, 'green: coin ' + V.coin.toFixed(1) + ' mm at ' + V.arm + ' cm  ·  amber: perceived size', W / 2, Hh - 6, { align: 'center', color: C.muted, size: 10.5 });
        const dist0 = d - RE, dist1 = Math.sqrt(d * d - RE * RE);
        ro.set('ang', ang.toFixed(3) + '° (' + (ang * 60).toFixed(1) + '′)');
        ro.set('coin', (2 * V.arm * 10 * Math.tan(ang / 2 * D2R)).toFixed(1) + ' mm at ' + V.arm + ' cm');
        ro.set('cang', coinAng.toFixed(3) + '°' + (Math.abs(coinAng - ang) < 0.005 ? '  (a fit)' : coinAng > ang ? '  (too big)' : '  (too small)'));
        ro.set('hor', (100 * (dist1 / dist0 - 1)).toFixed(1) + ' % farther');
        ro.set('hsize', (100 * (1 - dist0 / dist1)).toFixed(1) + ' % smaller');
        ro.set('flat', (100 * flat).toFixed(0) + ' % (vertical squashed)');
        ro.set('perc', '× ' + V.k.toFixed(2) + ' if size follows apparent distance');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
