/* HYPER-CORE · ui/optics-bench.js — Tools → Ray bench (#/tools/bench/<lenses|mirror|prism>)
 *
 *   lenses   an optical bench: an object and up to four elements (thin lenses, an aperture stop, a screen or a sensor)
 *            in a row. Drag the object and the elements along the axis, set focal lengths and diameters, pick a
 *            preset (camera, magnifier, projector, telescopes, microscope, relay, beam expander, telephoto).
 *            Principal rays from the tip of the object and a cone of marginal rays from its foot are traced through
 *            every element and clipped by the apertures; every image, the pupils, the stop and the focal length of
 *            the whole train are worked out with the ray-transfer matrices (O.abcd).
 *   mirror   one curved mirror: the three principal rays and the image (O.mirrorImage); or a parallel beam traced
 *            exactly (O.sys.trace) to show the caustic of a sphere against the perfect focus of a paraboloid.
 *   prism    exact refraction and partial reflection (O.snell, O.fresnel, O.prism) through a prism, a right-angle
 *            prism, a plate or a semicircular block, in one wavelength or in white light split into colours.
 *
 * Local helpers (the engine has no 2-D tracer for flat and round faces, and no multi-element thin-lens trace):
 * solve() / runRay() for the ideal thin-lens train, hitSurf() for the principal rays on a mirror, tracePrism() for glass blocks.
 * All controls go through kit.controls and all pointer work through kit.drag, so the headless test can drive them.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, O = H.optics, S = H.osym, A = O.abcd;
  const T = H.opticsTools = H.opticsTools || {};
  const TABS = [['lenses', 'Lenses on a bench'], ['mirror', 'A curved mirror'], ['prism', 'Prisms and blocks']];
  T.bench = function (el, params, sub) {
    const t = T.util.subtabs(el, 'bench', TABS, sub, 'Lenses here are ideal thin lenses (a ray’s slope changes by −y/f); mirrors and glass blocks are traced exactly, surface by surface.');
    ({ lenses, mirror, prism })[t.tab](t.body);
  };
  T.bench.tabs = TABS.map(t => t[0]);

  /* ---------------------------------------------------------------- small helpers */
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI, fin = Number.isFinite;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const num = (x, d) => { if (!fin(x)) return '—'; d = d == null ? 1 : d; const r = +x.toFixed(d); return (r < 0 ? '−' : '') + Math.abs(r).toFixed(d); };
  const mm = (x, d) => Number.isNaN(x) ? '—' : !fin(x) ? 'at infinity' : num(x, d == null ? (Math.abs(x) < 10 ? 2 : 1) : d) + ' mm';
  const deg = (rad, d) => num(rad * R2D, d == null ? 1 : d) + '°';
  const txt = (c, s, x, y, o) => S.text(c, s, x, y, Object.assign({ size: 11.5 }, o || {}));
  const polyPath = (c, pts) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); };
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const dotp = (a, b) => a[0] * b[0] + a[1] * b[1];
  const snapTo = (x, step) => +(Math.round(x / step) * step).toFixed(4);

  /* ================================================================ 1 · lenses on a bench */
  const KINDS = [['Empty slot (nothing there)', 'empty'], ['Converging lens', 'conv'], ['Diverging lens', 'div'], ['Aperture stop (iris)', 'stop'], ['Screen', 'screen'], ['Image sensor', 'sensor']];
  const KNAME = { conv: 'converging lens', div: 'diverging lens', stop: 'aperture stop', screen: 'screen', sensor: 'sensor' };
  const isLens = k => k === 'conv' || k === 'div';
  const isEnd = k => k === 'screen' || k === 'sensor';
  const E = (k, x, f, D) => ({ k, x, f: f || 100, D: D || 40 });         // an element; f is the size of the focal length, k gives its sign
  const PRESETS = {
    start: { name: 'One lens and a screen', view: [-190, 340], obj: { inf: false, x: -150, h: 15, ang: 4 },
      els: [E('conv', 0, 60, 40), E('screen', 100), E('empty', 200), E('empty', 240)],
      note: 'The object is two and a half focal lengths in front of the lens, so the image forms real and upside down between one and two focal lengths behind it. Slide the screen to find it, or press the button that moves the screen to the image. Drag the object towards the lens and watch the image run away.' },
    camera: { name: 'A camera', view: [-110, 210], obj: { inf: true, x: -300, h: 10, ang: 5 },
      els: [E('conv', 0, 50, 30), E('stop', -14, 100, 10), E('sensor', 50), E('empty', 120)],
      note: 'A distant scene sends parallel beams, one for each direction. The lens brings each beam to its own point on the sensor, a distance f behind it. The iris in front sets how wide each beam may be, which is the f-number. Widen it and the cone of light grows; close it and the image gets dimmer.' },
    magnifier: { name: 'A magnifier', view: [-220, 300], obj: { inf: false, x: -35, h: 8, ang: 4 },
      els: [E('conv', 0, 50, 60), E('empty', 100), E('empty', 140), E('empty', 180)],
      note: 'An object nearer the lens than its focal length gives no real image. The rays leave the lens still spreading, and the eye follows them back to a larger, upright, virtual image drawn dashed. The closer the object is to the focal point, the bigger the image becomes.' },
    projector: { name: 'A projector', view: [-90, 420], obj: { inf: false, x: -60, h: 12, ang: 4 },
      els: [E('conv', 0, 50, 36), E('screen', 300), E('empty', 120), E('empty', 160)],
      note: 'A slide just beyond the focal point of the lens is thrown onto a distant screen, enlarged and upside down. The nearer the slide is to the focal point, the farther away and bigger the picture; move the screen and it blurs.' },
    kepler: { name: 'A Keplerian telescope', view: [-60, 380], obj: { inf: true, x: -300, h: 10, ang: 2 },
      els: [E('conv', 0, 200, 50), E('conv', 240, 40, 30), E('empty', 330), E('empty', 350)],
      note: 'Two converging lenses with their focal points on top of each other. Parallel light goes in and parallel light comes out, but at a steeper angle: the angular magnification is minus the ratio of the focal lengths, so the view is upside down. The small bright disc where the beam narrows is the exit pupil, where the eye belongs.' },
    galileo: { name: 'A Galilean telescope', view: [-60, 300], obj: { inf: true, x: -300, h: 10, ang: 2 },
      els: [E('conv', 0, 200, 50), E('div', 160, 40, 24), E('empty', 260), E('empty', 280)],
      note: 'A converging objective and a diverging eyepiece, set apart by the difference of their focal lengths. The beam never comes to a focus inside, so the instrument is short and the view stays upright. The price is a small field of view and no real exit pupil.' },
    microscope: { name: 'A compound microscope', view: [-40, 320], obj: { inf: false, x: -16.5, h: 1.2, ang: 4 },
      els: [E('conv', 0, 15, 12), E('conv', 190, 30, 24), E('empty', 250), E('empty', 270)],
      note: 'A short objective makes a real, enlarged image just inside the focal length of the eyepiece. The eyepiece acts as a magnifier on that image, so the two magnifications multiply. Look at the total magnification and at the dashed final image.' },
    relay: { name: 'A 4f relay', view: [-130, 460], obj: { inf: false, x: -100, h: 10, ang: 4 },
      els: [E('conv', 0, 100, 50), E('conv', 200, 100, 50), E('screen', 300), E('empty', 340)],
      note: 'With the object in the front focal plane of the first lens, the beam in between is parallel, and the second lens, two focal lengths away, puts an image of the same size in its own back focal plane. Between the lenses is the place for a filter or a stop. The first image is at infinity.' },
    expander: { name: 'A beam expander', view: [-60, 230], obj: { inf: true, x: -300, h: 10, ang: 0 },
      els: [E('div', 0, 30, 14), E('conv', 60, 90, 40), E('stop', -15, 100, 8), E('empty', 150)],
      note: 'A parallel beam leaves as a parallel beam of a different width: here three times wider, because the focal lengths are in the ratio one to three. The iris at the front is the beam. The same train used backwards narrows a beam.' },
    telephoto: { name: 'A telephoto pair', view: [-130, 360], obj: { inf: true, x: -300, h: 10, ang: 4 },
      els: [E('conv', 0, 100, 40), E('div', 70, 50, 30), E('sensor', 145), E('empty', 200)],
      note: 'A positive lens followed by a negative one behaves like one long lens whose rear principal plane lies far in front of the glass. Show the principal planes: the equivalent focal length is 250 mm, yet the sensor is only 145 mm from the front lens.' }
  };
  const PRESET_LIST = [['One lens and a screen', 'start'], ['A camera', 'camera'], ['A magnifier', 'magnifier'], ['A projector', 'projector'], ['A Keplerian telescope', 'kepler'], ['A Galilean telescope', 'galileo'],
    ['A compound microscope', 'microscope'], ['A 4f relay', 'relay'], ['A beam expander', 'expander'], ['A telephoto pair', 'telephoto'], ['Your own arrangement', 'custom']];
  function preset(id) {
    const p = PRESETS[id] || PRESETS.start;
    return { id: PRESETS[id] ? id : 'start', name: p.name, note: p.note, obj: Object.assign({}, p.obj), els: p.els.map(e => Object.assign({}, e)), view: { x0: p.view[0], span: p.view[1] } };
  }

  /* the matrix of lenses[0..k] with the free spaces between them (first vertex to last vertex) */
  function sysMat(lenses, k) {
    const parts = [];
    for (let i = 0; i <= k; i++) { if (i) parts.push(A.free(lenses[i].x - lenses[i - 1].x)); parts.push(A.lens(lenses[i].fs)); }
    return parts.length ? A.mul.apply(null, parts) : [[1, 0], [0, 1]];
  }

  /* Everything about the train that is not drawing. M = { obj, els, view }.
     Elements to the left of a finite object, and everything behind the first screen, are left out of the light path. */
  function solve(M, ignoreScreens) {
    const o = M.obj, inf = o.inf, xo = inf ? -Infinity : o.x;
    const all = M.els.map((e, i) => Object.assign({ slot: i + 1, fs: e.k === 'conv' ? e.f : e.k === 'div' ? -e.f : 0 }, e)).filter(e => e.k !== 'empty');
    const live = all.filter(e => e.x > xo + 1e-9).sort((a, b) => a.x - b.x || a.slot - b.slot);
    const cut = live.findIndex(e => isEnd(e.k));
    const items = ignoreScreens ? live.filter(e => !isEnd(e.k)) : cut < 0 ? live : live.slice(0, cut + 1);
    const lenses = items.filter(e => isLens(e.k));
    const screen = !ignoreScreens && items.length && isEnd(items[items.length - 1].k) ? items[items.length - 1] : null;
    const R = { inf, xo, h: o.h, tn: Math.tan(o.ang * D2R), items, dead: all.filter(e => !items.includes(e)), lenses, screen, images: [] };
    // the aperture stop: the element that limits the cone from the axial object point (or the beam of a distant object)
    let x = inf ? 0 : xo, y = inf ? 1 : 0, u = inf ? 0 : 1, best = Infinity;
    for (const e of items) { y += u * (e.x - x); x = e.x; e.hy = y; if (e.fs) u -= y / e.fs; }
    R.stop = null;
    for (const e of items) if ((isLens(e.k) || e.k === 'stop') && Math.abs(e.hy) > 1e-12) { const r = e.D / 2 / Math.abs(e.hy); if (r < best - 1e-12) { best = r; R.stop = e; } }
    R.marg = R.stop ? best : Infinity;              // the marginal slope (near object) or the height of the marginal ray at the first element (distant object)
    // images: after each lens, from the matrix of the lenses so far
    const m = lenses.length;
    for (let k = 0; k < m; k++) {
      const Mk = sysMat(lenses, k), Lk = lenses[k];
      let si = NaN, mag = NaN, yi = NaN, atInf = false;
      if (!inf) {
        const Tm = A.mul(A.free(lenses[0].x - xo), Mk);
        if (Math.abs(Tm[1][1]) < 1e-9) atInf = true; else { si = -Tm[0][1] / Tm[1][1]; mag = Tm[0][0] + si * Tm[1][0]; yi = mag * o.h; }
      } else if (Math.abs(Mk[1][0]) < 1e-12) atInf = true;
      else { si = -Mk[0][0] / Mk[1][0]; const u0 = -R.tn; yi = Mk[0][1] * u0 + Mk[1][1] * u0 * si; }
      const nextX = k + 1 < m ? lenses[k + 1].x : screen ? screen.x : Infinity;
      const xi = atInf ? Infinity : Lk.x + si;
      R.images.push({ k, lens: Lk, si, xi, mag, y: yi, atInf, real: !atInf && si > 0, virtual: !atInf && si < 0, inter: !atInf && si > 0 && xi > nextX + 1e-9, last: k === m - 1,
        upright: inf ? (R.tn !== 0 ? yi > 0 : null) : mag > 0 });
    }
    if (m) {
      R.Mt = sysMat(lenses, m - 1); R.card = A.cardinal(R.Mt);
      R.afocal = !!R.card.afocal || Math.abs(R.card.efl) > 1e5;
    }
    // pupils: the stop seen through the lenses in front of it (entrance) and behind it (exit)
    if (R.stop) {
      const si = items.indexOf(R.stop), before = items.slice(0, si).filter(e => isLens(e.k)), after = items.slice(si + 1).filter(e => isLens(e.k));
      if (!before.length) R.EP = { x: R.stop.x, D: R.stop.D };
      else {
        const parts = [];
        before.forEach((e, i) => { if (i) parts.push(A.free(e.x - before[i - 1].x)); parts.push(A.lens(e.fs)); });
        parts.push(A.free(R.stop.x - before[before.length - 1].x));
        const Mp = A.mul.apply(null, parts);
        R.EP = Math.abs(Mp[0][0]) < 1e-9 ? { x: Infinity, D: NaN } : { x: before[0].x + Mp[0][1] / Mp[0][0], D: R.stop.D / Math.abs(Mp[0][0]) };
      }
      if (!after.length) R.XP = { x: R.stop.x, D: R.stop.D };
      else {
        const Tm = A.mul(A.free(after[0].x - R.stop.x), sysMat(after, after.length - 1));
        if (Math.abs(Tm[1][1]) < 1e-9) R.XP = { x: Infinity, D: NaN };
        else { const s = -Tm[0][1] / Tm[1][1]; R.XP = { x: after[after.length - 1].x + s, D: R.stop.D * Math.abs(Tm[0][0] + s * Tm[1][0]) }; }
      }
      if (R.card && !R.afocal && fin(R.EP.D)) R.fno = Math.abs(R.card.efl) / R.EP.D;
      const last = R.images[m - 1];
      if (R.fno && last && last.real && fin(R.XP.x) && fin(R.XP.D) && R.XP.D > 1e-9) R.fnoWork = Math.abs(last.xi - R.XP.x) / R.XP.D;
    }
    // angular magnification: of an afocal train, or the magnifying power of a train whose last image is virtual
    if (R.card && R.afocal) R.ang = R.Mt[1][1];
    else if (!inf && m && R.images[m - 1] && (R.images[m - 1].virtual || R.images[m - 1].atInf) && Math.abs(o.h) > 1e-9) {
      const parts = [A.free(lenses[0].x - xo)];
      for (let i = 0; i < m - 1; i++) { parts.push(A.lens(lenses[i].fs)); parts.push(A.free(lenses[i + 1].x - lenses[i].x)); }
      const Tm = A.mul.apply(null, parts);
      if (Math.abs(Tm[0][1]) > 1e-12) { const u0 = -Tm[0][0] * o.h / Tm[0][1]; R.ang = -(Tm[1][0] * o.h + Tm[1][1] * u0) * 250 / o.h; }
    }
    return R;
  }

  /* one ray through the train: y0, u0 at x0; -> { pts, passed (elements cleared), blocked, hit (the screen) }; apertures clip it unless noBlock */
  function runRay(R, x0, y0, u0, xEnd, noBlock) {
    const pts = [[x0, y0]];
    let x = x0, y = y0, u = u0;
    for (let i = 0; i < R.items.length; i++) {
      const e = R.items[i];
      y += u * (e.x - x); x = e.x; pts.push([x, y]);
      if (isEnd(e.k)) return { pts, passed: i, blocked: null, hit: e };
      if (!noBlock && Math.abs(y) > e.D / 2 * (1 + 1e-9)) return { pts, passed: i, blocked: e, hit: null };
      if (e.fs) u -= y / e.fs;
    }
    y += u * (xEnd - x); pts.push([xEnd, y]);
    return { pts, passed: R.items.length, blocked: null, hit: null };
  }

  /* the half-height of an element on the stage, in pixels */
  function extent(G, e) {
    const half = G.plotH / 2 - 6;
    return isLens(e.k) ? e.D / 2 * G.sy : e.k === 'stop' ? Math.min(half, Math.max(e.D / 2 * G.sy + 16, G.Ym * G.sy * 1.25)) : e.k === 'screen' ? Math.min(half, G.Ym * G.sy * 1.1) : Math.min(half, G.Ym * G.sy * 0.7);
  }

  function drawElement(G, e, sel) {
    const { c, C } = G, ex = G.X(e.x), h = extent(G, e);
    if (isLens(e.k)) S.thinLens(c, ex, G.cy, h, e.fs, { foci: G.V.showF ? Math.abs(e.fs) * G.sx : 0 });
    else if (e.k === 'stop') S.stop(c, ex, G.cy, h, e.D / 2 * G.sy);
    else if (e.k === 'screen') S.screen(c, ex, G.cy, h);
    else S.sensor(c, ex, G.cy, h);
    // the tag under it: its slot number (lit when it is the one being edited) and what it is; below the markers of the stray rays
    const ty = G.cy + Math.min(h * 1.22 + 18, G.plotH / 2 + 6);
    const name = isLens(e.k) ? 'f ' + (e.k === 'conv' ? '+' : '−') + num(e.f, e.f < 10 ? 1 : 0) : e.k === 'stop' ? 'Ø ' + num(e.D, 1) : e.k === 'screen' ? 'screen' : 'sensor';
    c.save(); c.beginPath(); c.arc(ex - 18, ty, 9, 0, TAU); c.fillStyle = sel ? C.accent : C.surface; c.fill(); c.strokeStyle = sel ? C.accent : C.faint; c.lineWidth = 1.2; c.stroke(); c.restore();
    txt(c, String(e.slot), ex - 18, ty + 0.5, { color: sel ? C.bg2 : C.text, size: 11, weight: 700 });
    txt(c, name, ex - 5, ty + 0.5, { color: sel ? C.text : C.muted, align: 'left', weight: sel ? 650 : 500 });
    if (G.R.stop === e && G.R.items.length > 1) txt(c, 'aperture stop', ex - 5, ty + 15, { color: C.warn, size: 10.5, align: 'left' });
  }

  /* the rays of the train: principal rays from the tip, the cone from the foot, back-projections to virtual images */
  function drawRays(G) {
    const { c, C, R, M, V } = G, span = M.view.span, xEnd = M.view.x0 + span * 1.02, NM_TIP = 600, NM_CONE = 495;
    const P = pts => pts.map(p => [G.X(p[0]), G.Y(p[1])]);
    const out = { spot: NaN };
    const show = (res, o) => {
      if (res.blocked) {
        S.ray(c, P(res.pts), { color: C.faint, width: 1, dash: [4, 3], arrows: false });
        const q = res.pts[res.pts.length - 1], px = G.X(q[0]), py = G.Y(q[1]);
        c.save(); c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px - 4, py - 4); c.lineTo(px + 4, py + 4); c.moveTo(px - 4, py + 4); c.lineTo(px + 4, py - 4); c.stroke(); c.restore();
      } else S.ray(c, P(res.pts), o);
    };
    // a ray after a lens that spreads is traced back, dashed, to the virtual image it seems to come from
    const back = (res, tipOf) => {
      for (const im of R.images) {
        if (!im.virtual) continue;
        const j = R.items.indexOf(im.lens);
        if (j < 0 || j >= res.passed) continue;
        const q = res.pts[j + 1], t = tipOf(im);
        if (fin(t[0]) && fin(t[1])) S.virtual(c, G.X(q[0]), G.Y(q[1]), G.X(t[0]), G.Y(t[1]));
      }
    };
    const cone = run => {
      const up = run(1), lo = up.pts.map(p => [p[0], -p[1]]);
      if (V.showC) {
        c.save(); polyPath(c, P(up.pts).concat(P(lo).reverse())); c.fillStyle = S.nm(NM_CONE, 0.14); c.fill(); c.restore();
        for (const f of [0.5, 0, -0.5]) { const r = run(f); S.ray(c, P(r.pts), { nm: NM_CONE, width: 1, alpha: 0.4, arrows: false }); }
        S.ray(c, P(up.pts), { nm: NM_CONE, width: 1.5 }); S.ray(c, P(lo), { nm: NM_CONE, width: 1.5 });
        if (fin(R.marg)) for (const f of [1.2, -1.2]) { const r = run(f); if (r.blocked) show(r, {}); }      // just outside the cone: the rays the apertures stop
        back(up, im => [im.xi, 0]); back({ pts: lo, passed: up.passed }, im => [im.xi, 0]);
      }
      if (up.hit) out.spot = 2 * Math.abs(up.pts[up.pts.length - 1][1]);
    };
    if (!R.inf) {
      const first = R.lenses[0], s = (first ? first.x : R.xo + 0.4 * span) - R.xo, h = R.h;
      const um = fin(R.marg) ? Math.min(R.marg, 20) : 0.12;
      cone(f => runRay(R, R.xo, 0, f * um, xEnd, Math.abs(f) <= 1));
      if (V.showP) {
        // parallel to the axis; the chief ray, aimed at the centre of the entrance pupil (which is the centre of the first lens when there is no separate stop); through the front focal point
        const se = (R.EP && fin(R.EP.x) ? R.EP.x : first ? first.x : R.xo + 0.4 * span) - R.xo, us = [0];
        if (Math.abs(se) > 1e-6) us.push(-h / se);
        if (first && Math.abs(first.fs - s) > 1e-6) us.push((h * first.fs / (first.fs - s) - h) / s);
        for (const u of us) { const r = runRay(R, R.xo, h, u, xEnd, false); show(r, { nm: NM_TIP, width: 1.7 }); if (!r.blocked) back(r, im => [im.xi, im.y]); }
      }
    } else {
      const x1 = R.lenses[0] ? R.lenses[0].x : R.items[0] ? R.items[0].x : M.view.x0 + span / 2;
      const xr = R.EP && fin(R.EP.x) ? R.EP.x : x1;                    // the heights of the rays are given in the plane of the entrance pupil
      const xs = Math.min(M.view.x0 - 0.02 * span, x1 - 0.1 * span, xr - 0.1 * span), u0 = -R.tn;
      const from = (ys, u, nb) => runRay(R, xs, ys - u * (xr - xs), u, xEnd, nb);
      const mg = fin(R.marg) ? Math.min(R.marg, 400) : 0.5 * G.Ym;
      cone(f => from(mg * f, 0, Math.abs(f) <= 1));
      if (V.showP) for (const ys of [0, 0.8 * mg, -0.8 * mg]) { const r = from(ys, u0, false); show(r, { nm: NM_TIP, width: 1.7 }); if (!r.blocked) back(r, im => [im.xi, im.y]); }
    }
    return out;
  }

  /* the readouts of the train */
  function report(ro, G, flash) {
    const { R, M } = G, ims = R.images, last = ims[ims.length - 1];
    const kindOf = e => 'element ' + e.slot + ' (' + KNAME[e.k] + ')';
    ro.set('efl', !R.card ? '—' : R.afocal ? 'none: the train is afocal' : mm(R.card.efl) + (R.card.efl < 0 ? ' (diverging)' : ''));
    ro.set('bfd', !R.card || R.afocal ? '—' : mm(R.card.bfd) + (R.card.bfd < 0 ? ' (inside the train: virtual focus)' : ' behind the last lens'));
    ro.set('mag', !last ? 'no lens in the light path' : R.inf ? (last.atInf ? 'the image is at infinity' : 'image height ' + mm(last.y, 2) + (R.tn ? (last.y < 0 ? ' (inverted)' : ' (upright)') : '') + ' for ' + num(M.obj.ang, 1) + '°')
      : last.atInf ? 'the image is at infinity' : '×' + num(last.mag, 2) + (last.mag < 0 ? ' (inverted)' : ' (upright)'));
    const seen = R.afocal && R.inf && M.obj.ang > 0 && R.ang != null ? ' · ' + num(M.obj.ang, 1) + '° in, ' + num(Math.atan(R.ang * Math.tan(M.obj.ang * D2R)) * R2D, 1) + '° out' : '';
    ro.set('ang', R.ang == null ? '—' : '×' + num(R.ang, 2) + (R.afocal ? (R.ang < 0 ? ' (the view is inverted)' : ' (the view is upright)') + seen : ' (against the object at 250 mm)'));
    for (let k = 0; k < 4; k++) {
      const im = ims[k]; ro.show('i' + (k + 1), !!im);
      if (!im) continue;
      const kind = im.atInf ? 'at infinity: the light leaves parallel' : 'x = ' + num(im.xi, 1) + ' mm · ' + (im.virtual ? 'virtual' : 'real') + (fin(im.mag) ? ' · ×' + num(im.mag, 2) : '') + (im.upright == null ? '' : im.upright ? ' · upright' : ' · inverted') + (im.inter ? ' · caught by the next element first' : '');
      ro.set('i' + (k + 1), 'after element ' + im.lens.slot + ': ' + kind);
    }
    ro.set('stop', R.stop ? kindOf(R.stop) + ', Ø ' + num(R.stop.D, 1) + ' mm' : 'none: nothing narrows the beam');
    ro.set('ep', R.EP ? (fin(R.EP.x) ? 'at x = ' + num(R.EP.x, 1) + ' mm, Ø ' + num(R.EP.D, 1) + ' mm' : 'at infinity (telecentric)') : '—');
    ro.set('xp', R.XP ? (fin(R.XP.x) ? 'at x = ' + num(R.XP.x, 1) + ' mm, Ø ' + num(R.XP.D, 1) + ' mm' : 'at infinity (telecentric)') : '—');
    ro.set('fno', R.fno && R.card.efl > 0 ? 'f/' + num(R.fno, R.fno < 10 ? 2 : 1) + (R.fnoWork ? ' (working f/' + num(R.fnoWork, R.fnoWork < 10 ? 2 : 1) + ')' : '') : R.afocal ? 'none: no focal length' : '—');
    let sc = flash || '';
    if (!sc) {
      if (!R.screen) sc = last && last.real && !last.inter ? 'no screen: the image forms at x = ' + num(last.xi, 1) + ' mm' : 'no screen in the light path';
      else if (!last) sc = 'no lens: the screen just catches the light';
      else if (last.atInf) sc = 'the image is at infinity: the screen sees a blur';
      else {
        const dz = R.screen.x - last.xi, blur = G.spot;
        sc = Math.abs(dz) < 0.3 || (fin(blur) && blur < 0.15) ? 'in focus' + (fin(blur) ? ' (blur Ø ' + num(blur, 2) + ' mm)' : '')
          : 'out of focus: the image is ' + num(Math.abs(dz), 1) + ' mm ' + (dz > 0 ? 'in front of' : 'behind') + ' it' + (fin(blur) ? ', blur Ø ' + num(blur, 1) + ' mm' : '');
      }
    }
    ro.set('screen', sc);
  }

  function lenses(el) {
    const L = T.util.lab(el, 'Build an optical train: an object and up to four elements on one axis. Drag the object and the elements along the bench, drag the empty space to slide the view, and choose a preset to see a real instrument.', 0.52);
    let M = preset('start'), sel = 1, base = 'start', flash = '', lay = null, pan = null;
    const ctl = K.controls(L.side, [
      { id: 'preset', type: 'select', label: 'Start from', options: PRESET_LIST, value: 'start' },
      { id: 'sel', type: 'select', label: 'Edit', options: [['The object', 0], ['Element 1', 1], ['Element 2', 2], ['Element 3', 3], ['Element 4', 4]], value: 1 },
      { id: 'okind', type: 'select', label: 'The object is', options: [['An arrow at a finite distance', 'near'], ['A distant scene (parallel beams)', 'far']], value: 'near' },
      { id: 'oh', label: 'Object height', min: 1, max: 60, step: 0.5, value: 15, unit: 'mm' },
      { id: 'oang', label: 'Field angle of the distant scene', min: 0, max: 10, step: 0.5, value: 4, unit: '°' },
      { id: 'etype', type: 'select', label: 'This element is', options: KINDS, value: 'conv' },
      { id: 'f', label: 'Focal length (size)', min: 3, max: 500, value: 60, log: true, sig: 3, unit: 'mm' },
      { id: 'D', label: 'Diameter', min: 2, max: 120, value: 40, log: true, sig: 3, unit: 'mm' },
      { id: 'pos', label: 'Position on the bench', min: -800, max: 1200, step: 0.5, value: 0, unit: 'mm' },
      { id: 'zoom', label: 'Bench length shown', min: 40, max: 2500, value: 340, log: true, sig: 3, unit: 'mm' },
      { id: 'vz', label: 'Stretch the heights', min: 0.3, max: 4, value: 1, log: true, sig: 2, fmt: v => '× ' + K.fmt(v, 2) },
      { id: 'showP', type: 'check', label: 'Principal rays from the tip of the object', value: true },
      { id: 'showC', type: 'check', label: 'Cone of light from the foot of the object', value: true },
      { id: 'showF', type: 'check', label: 'Focal points of each lens', value: true },
      { id: 'showH', type: 'check', label: 'Principal planes and focal points of the whole train', value: false },
      { id: 'showE', type: 'check', label: 'Mark the entrance and exit pupils', value: false },
      { type: 'buttons', items: [{ id: 'focus', label: 'Move the screen to the image', primary: true }, { id: 'fit', label: 'Fit the view' }, { id: 'reset', label: 'Back to the preset' }] }
    ], onChange);
    const V = ctl.values;
    const ro = K.readout(L.side, [['efl', 'Equivalent focal length'], ['bfd', 'Back focal distance'], ['mag', 'Magnification'], ['ang', 'Angular magnification'], ['i1', 'Image 1'], ['i2', 'Image 2'], ['i3', 'Image 3'], ['i4', 'Image 4'],
      ['stop', 'Aperture stop'], ['ep', 'Entrance pupil'], ['xp', 'Exit pupil'], ['fno', 'f-number'], ['screen', 'On the screen']]);
    L.under.innerHTML = '<div class="bnote small muted" style="margin:6px 0 0"></div>' + T.util.more(['the-thin-lens-equation', 'real-and-virtual-images', 'lens-ray-diagrams', 'combining-thin-lenses', 'cardinal-points', 'aperture-stop', 'entrance-and-exit-pupils', 'chief-and-marginal-rays', 'the-f-number', 'ray-transfer-matrices', 'the-magnifier', 'the-compound-microscope', 'refracting-telescopes', 'telephoto-lens']);
    const noteEl = ui.$('.bnote', L.under);

    function markCustom() { if (M.id !== 'custom') { M.id = 'custom'; ctl.set('preset', 'custom'); } }
    function showRows() {
      const e = M.els[sel - 1], isObj = sel === 0;
      ctl.show('okind', isObj); ctl.show('oh', isObj && !M.obj.inf); ctl.show('oang', isObj && M.obj.inf);
      ctl.show('etype', !isObj); ctl.show('f', !isObj && isLens(e.k)); ctl.show('D', !isObj && (isLens(e.k) || e.k === 'stop'));
      ctl.show('pos', isObj ? !M.obj.inf : true);
    }
    function sync() {
      const e = M.els[sel - 1];
      ctl.set('preset', M.id); ctl.set('sel', sel);
      ctl.set('okind', M.obj.inf ? 'far' : 'near'); ctl.set('oh', M.obj.h); ctl.set('oang', M.obj.ang);
      if (e) { ctl.set('etype', e.k); ctl.set('f', e.f); ctl.set('D', e.D); }
      ctl.set('pos', sel === 0 ? M.obj.x : e.x); ctl.set('zoom', M.view.span);
      noteEl.innerHTML = '<b>' + esc(M.name) + '.</b> ' + esc(M.note);
      showRows();
    }
    function fit() {
      const xs = M.els.filter(e => e.k !== 'empty').map(e => e.x);
      if (!M.obj.inf) xs.push(M.obj.x);
      const r = solve(M), last = r.images[r.images.length - 1];
      if (last && fin(last.xi) && Math.abs(last.xi) < 3000) xs.push(last.xi);
      if (!xs.length) return;
      const lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs), span = clamp((hi - lo) * 1.25 + 40, 40, 2500);
      M.view.span = span; M.view.x0 = (lo + hi) / 2 - span / 2;
      ctl.set('zoom', span);
    }
    function focusScreen() {
      const r = solve(M, true), last = r.images[r.images.length - 1];
      if (!last) { flash = 'There is no lens in the light path to form an image.'; return false; }
      if (!last.real || last.atInf) { flash = last.atInf ? 'The image is at infinity: no screen can catch it.' : 'The image is virtual: a screen cannot show it (an eye or a camera lens can).'; return false; }
      let slot = M.els.findIndex(e => isEnd(e.k));
      if (slot < 0) slot = M.els.findIndex(e => e.k === 'empty');
      if (slot < 0) slot = 3;
      const e = M.els[slot];
      if (!isEnd(e.k)) e.k = 'screen';
      e.x = clamp(snapTo(last.xi, 0.1), -800, 1200); sel = slot + 1;
      if (e.x > M.view.x0 + M.view.span * 0.97) { M.view.span = (e.x - M.view.x0) * 1.08; }
      markCustom(); sync(); return true;
    }
    function onChange(id, v) {
      const e = M.els[sel - 1];
      let edit = true;
      switch (id) {
        case 'preset': if (v !== 'custom') { base = v; M = preset(v); sel = 1; sync(); } edit = false; break;
        case 'sel': sel = +v; sync(); edit = false; break;
        case 'okind': M.obj.inf = v === 'far'; break;
        case 'oh': M.obj.h = v; break;
        case 'oang': M.obj.ang = v; break;
        case 'etype': if (e) e.k = v; break;
        case 'f': if (e) e.f = v; break;
        case 'D': if (e) e.D = v; break;
        case 'pos': if (sel === 0) M.obj.x = v; else if (e) e.x = v; break;
        case 'zoom': { const mid = M.view.x0 + M.view.span / 2; M.view.span = v; M.view.x0 = mid - v / 2; edit = false; break; }
        case 'focus': focusScreen(); edit = false; break;
        case 'fit': fit(); edit = false; break;
        case 'reset': M = preset(base); sel = 1; sync(); edit = false; break;
        default: edit = false;
      }
      if (edit) markCustom();
      if (id === 'etype' || id === 'okind') showRows();
      draw();
    }

    function draw() {
      const R = solve(M), c = L.st.begin(), C = K.colors(), W = L.st.W, Hh = L.st.H;
      const padL = 14, top = 38, bottom = 50, plotW = W - 2 * padL, plotH = Hh - top - bottom, cy = top + plotH / 2;
      const span = M.view.span, sx = plotW / span, X = x => padL + (x - M.view.x0) * sx;
      // the vertical scale: tall enough for the lenses, the object and the images, stretched against the horizontal one
      let Ym = 6;
      for (const e of R.items.concat(R.dead)) if (isLens(e.k) || e.k === 'stop') Ym = Math.max(Ym, e.D / 2);
      if (!R.inf) Ym = Math.max(Ym, M.obj.h);
      const base0 = Ym;
      for (const im of R.images) if (fin(im.y)) Ym = Math.max(Ym, Math.min(Math.abs(im.y), 2.5 * base0));
      const sy = plotH / 2 * 0.8 / Ym * V.vz, Y = y => cy - clamp(y, -1e5, 1e5) * sy;
      const G = { c, C, R, M, V, X, Y, sx, sy, cy, W, Hh, top, plotH, Ym, spot: NaN };
      lay = { X, sx, sy, cy, padL, top, plotH, W, Hh, els: [], obj: null };
      // the ruler
      const step = H.niceStep(span, 8);
      c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(padL, Hh - 30); c.lineTo(W - padL, Hh - 30);
      const ticks = [];
      for (let t = Math.ceil(M.view.x0 / step) * step, n = 0; t <= M.view.x0 + span && n < 60; t += step, n++) { ticks.push(t); c.moveTo(X(t), Hh - 30); c.lineTo(X(t), Hh - 25); }
      c.stroke(); c.restore();
      for (const t of ticks) txt(c, num(t, step < 1 ? 1 : 0), X(t), Hh - 15, { color: C.muted, size: 10.5 });
      txt(c, M.name, padL + 2, 16, { align: 'left', color: C.text, weight: 650, size: 13 });
      const ex = sy / sx;
      txt(c, W < 620 ? 'heights ×' + num(ex, ex < 10 ? 1 : 0) : 'positions in mm · heights drawn ×' + num(ex, ex < 10 ? 1 : 0) + ' against distances', W - padL, 16, { align: 'right', color: C.faint, size: 10.5 });
      // the scene, clipped to the bench
      c.save(); c.beginPath(); c.rect(0, top - 18, W, plotH + 36); c.clip();
      S.axis(c, 0, cy, W);
      c.globalAlpha = 0.3;
      for (const e of R.dead) { drawElement(G, e, false); }
      c.globalAlpha = 1;
      const rr = drawRays(G); G.spot = rr.spot;
      for (const e of R.items) { drawElement(G, e, sel === e.slot); }
      for (const e of R.dead) lay.els.push({ slot: e.slot, px: X(e.x), ext: extent(G, e) });
      for (const e of R.items) lay.els.push({ slot: e.slot, px: X(e.x), ext: extent(G, e) });
      // the object
      if (!R.inf) {
        S.object(c, X(R.xo), cy, M.obj.h * sy, { color: C.accent, label: 'object' });
        if (sel === 0) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 1; c.setLineDash([3, 3]); c.strokeRect(X(R.xo) - 12, cy - M.obj.h * sy - 10, 24, M.obj.h * sy + 22); c.restore(); }
        lay.obj = { px: X(R.xo), tip: cy - M.obj.h * sy };
      } else txt(c, M.obj.ang === 0 ? 'parallel light from a distant scene, along the axis' : 'light from a distant scene, ' + num(M.obj.ang, 1) + '° above the axis', padL + 4, top - 8, { align: 'left', color: sel === 0 ? C.accent : C.muted });
      // the images
      for (const im of R.images) {
        if (!fin(im.xi) || !fin(im.y) || Math.abs(im.xi) > 1e5) continue;
        const cap = plotH / 2 - 4, big = Math.abs(im.y * sy) > cap;
        S.object(c, X(im.xi), cy, clamp(im.y * sy, -cap, cap), { color: im.last ? C.ok : C.warn, dash: !im.real || im.inter, label: (im.last ? 'final image' : 'image ' + (im.k + 1)) + (big ? ' (cut off: ×' + num(Math.abs(im.mag), 0) + ')' : '') });
        if (im.real && !im.inter && im.last && !(R.screen && Math.abs(R.screen.x - im.xi) < 0.5 / sx)) {
          c.save(); c.strokeStyle = C.ok; c.globalAlpha = 0.6; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X(im.xi), top); c.lineTo(X(im.xi), top + plotH); c.stroke(); c.restore();
          txt(c, 'image plane: a screen goes here', X(im.xi), top + 4, { color: C.ok, size: 10.5 });
        }
      }
      // where the whole train focuses, and its principal planes
      if (V.showH && R.card && !R.afocal) {
        const x1 = R.lenses[0].x, x2 = R.lenses[R.lenses.length - 1].x, hh = Ym * sy * 0.9;
        const xH1 = x1 + R.card.Hfront, xH2 = x2 + R.card.Hrear, xF2 = x2 + R.card.bfd;
        const marks = [[Math.abs(X(xH1) - X(xH2)) < 8 ? 'H H′' : 'H', xH1, true], ['H′', xH2, true], ['F', x1 - R.card.ffd, false], ['F′', xF2, false]];
        // the same train as one ideal lens: a parallel ray turns at the rear principal plane, and f is measured from there
        if (R.inf && fin(R.marg)) for (const sg of [1, -1]) S.virtual(c, X(xH2), Y(sg * Math.min(R.marg, 400)), X(xF2), Y(0), { color: C.warn });
        S.dim(c, X(xH2), cy + hh * 0.8, X(xF2), cy + hh * 0.8, 'f = ' + num(R.card.efl, 1) + ' mm', { off: 12, color: C.warn, textColor: C.warn });
        for (const [name, x, plane] of marks) {
          if (!fin(x) || (name === 'H′' && marks[0][0] === 'H H′')) continue;
          if (plane) { c.save(); c.strokeStyle = C.warn; c.globalAlpha = 0.8; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(X(x), cy - hh); c.lineTo(X(x), cy + hh); c.stroke(); c.restore(); txt(c, name, X(x), cy - hh - 9, { color: C.warn, weight: 650 }); }
          else { K.dot(c, X(x), cy, 4, C.warn); txt(c, name, X(x), cy + 14, { color: C.warn, weight: 650 }); }
        }
      }
      if (V.showE) for (const [name, p] of [['EP', R.EP], ['XP', R.XP]]) {
        if (!p || !fin(p.x) || !fin(p.D)) continue;
        const px = X(p.x), hh = p.D / 2 * sy;
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(px, cy - hh); c.lineTo(px, cy + hh); c.moveTo(px - 4, cy - hh); c.lineTo(px + 4, cy - hh); c.moveTo(px - 4, cy + hh); c.lineTo(px + 4, cy + hh); c.stroke(); c.restore();
        txt(c, name, px + 12, cy - hh - 4, { color: C.accent, weight: 650, size: 10.5 });
      }
      // an eye, when there is nothing to catch the light
      if (R.lenses.length && !R.screen) {
        const lastX = R.lenses[R.lenses.length - 1].x, atXP = R.XP && fin(R.XP.x) && R.XP.x > lastX + 1e-6 && X(R.XP.x) < W - 20;
        S.eye(c, atXP ? X(R.XP.x) + 10 : X(lastX) + 42, cy, 13, { dir: -1 });
      }
      c.restore();
      report(ro, G, flash); flash = '';
    }

    K.drag(L.st, {
      hover: true,
      hit: p => {
        if (!lay || p.y < lay.top - 20 || p.y > lay.top + lay.plotH + 20) return null;
        let best = null, bd = 14;
        for (const e of lay.els) { const d = Math.abs(p.x - e.px); if (d < bd && Math.abs(p.y - lay.cy) < e.ext + 22) { bd = d; best = 'e' + e.slot; } }
        if (best) return best;
        if (lay.obj && Math.abs(p.x - lay.obj.px) < 14 && p.y > lay.obj.tip - 14 && p.y < lay.cy + 22) return 'o';
        return 'pan';
      },
      start: (w, p) => {
        if (w === 'pan') { pan = { x: p.x, x0: M.view.x0 }; return; }
        const s = w === 'o' ? 0 : +w.slice(1);
        if (s !== sel) { sel = s; sync(); }
      },
      move: (w, p) => {
        if (!lay) return;
        if (w === 'pan') { if (pan) { M.view.x0 = pan.x0 - (p.x - pan.x) / lay.sx; } draw(); return; }
        const step = H.niceStep(M.view.span, 400), x = clamp(snapTo(M.view.x0 + (p.x - lay.padL) / lay.sx, step), -800, 1200);
        if (w === 'o') M.obj.x = x; else M.els[+w.slice(1) - 1].x = x;
        ctl.set('pos', x); markCustom(); draw();
      }
    });
    L.st.onResize(draw); T.util.onTheme(draw);
    sync(); draw();
  }
  /* ================================================================ 2 · a curved mirror */
  function mirror(el) {
    const L = T.util.lab(el, 'One curved mirror. First the image it makes, built from the three rays everyone draws; then a parallel beam traced ray by ray over the true surface, to see why telescope mirrors are parabolic and not spherical.', 0.56);
    let lay = null;
    const ctl = K.controls(L.side, [
      { id: 'mode', type: 'select', label: 'Show', options: [['The image, built from three rays', 'rays'], ['A parallel beam, traced exactly', 'beam']], value: 'rays' },
      { id: 'kind', type: 'select', label: 'Mirror', options: [['Concave (a cave: it gathers light)', 'cc'], ['Convex (a dome: it spreads light)', 'cx']], value: 'cc' },
      { id: 'R', label: 'Radius of curvature R', min: 60, max: 340, step: 1, value: 200, unit: 'mm' },
      { id: 'shape', type: 'select', label: 'Surface', options: [['Spherical', 'sph'], ['Parabolic', 'par']], value: 'sph' },
      { id: 'so', label: 'Object distance', min: 15, max: 330, step: 1, value: 260, unit: 'mm' },
      { id: 'h', label: 'Object height', min: 4, max: 50, step: 1, value: 24, unit: 'mm' },
      { id: 'N', label: 'Speed of the mirror (f-number)', min: 0.7, max: 8, value: 1, log: true, sig: 2, fmt: v => 'f/' + K.fmt(v, 2) },
      { id: 'tilt', label: 'Tilt of the beam', min: 0, max: 6, step: 0.25, value: 0, unit: '°' },
      { id: 'which', type: 'select', label: 'Mirrors shown', options: [['Sphere and paraboloid, one above the other', 'both'], ['Sphere only', 'sph'], ['Paraboloid only', 'par']], value: 'both' },
      { id: 'nr', label: 'Rays', min: 7, max: 41, step: 2, value: 21 },
      { type: 'html', html: 'Drag the object arrow (its tip changes the height). In the beam view, drag up or down on the left to tilt the beam.' }
    ], () => { showRows(); draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['f', 'Focal length f = R/2'], ['u', 'Object distance'], ['v', 'Image distance'], ['m', 'Magnification'], ['nat', 'The image is'], ['hh', 'Image height'], ['note', 'Rays'],
      ['bf', 'Mirror'], ['bs', 'Sphere: marginal rays'], ['bsb', 'Sphere: blur at the focus'], ['bsm', 'Sphere: best focus'], ['bp', 'Paraboloid: blur at the focus']]);
    L.under.innerHTML = T.util.more(['curved-mirrors', 'the-mirror-equation', 'mirror-ray-diagrams', 'parabolic-and-elliptical-mirrors', 'spherical-mirror-aberration', 'coma', 'reflecting-telescopes']);
    const blur = d => !fin(d) ? '—' : d < 0.001 ? 'a point (under 1 µm)' : d < 1 ? num(d * 1000, 0) + ' µm' : num(d, 2) + ' mm';
    const unit = v => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };

    function showRows() {
      const rays = V.mode === 'rays';
      for (const id of ['kind', 'shape', 'so', 'h']) ctl.show(id, rays);
      for (const id of ['N', 'tilt', 'which', 'nr']) ctl.show(id, !rays);
      for (const k of ['u', 'v', 'm', 'nat', 'hh', 'note']) ro.show(k, rays);
      ro.show('f', true);
      for (const k of ['bf', 'bs', 'bsb', 'bsm', 'bp']) ro.show(k, !rays);
    }

    /* ---- the image from three rays */
    function drawImage() {
      const c = L.st.begin(), C = K.colors(), W = L.st.W, Hh = L.st.H;
      const conc = V.kind === 'cc', Rr = V.R, f = (conc ? 1 : -1) * Rr / 2, so = V.so, h = V.h;
      const m = S.map(L.st, -360, 180, 135, { left: 20, right: 20, top: 30, bottom: 44 });
      const k = V.shape === 'par' ? -1 : 0, cv = 1 / (conc ? -Rr : Rr), a = Math.min(0.9 * Rr, 120);
      const sag = y => { const q = 1 - (1 + k) * cv * cv * y * y; return q <= 0 ? NaN : cv * y * y / (1 + Math.sqrt(q)); };
      // where a ray p + t·d (p = [z, y]) meets the surface: Newton's method from the plane of the vertex
      const hitSurf = (p, d) => {
        if (Math.abs(d[0]) < 1e-9) return null;
        let t = -p[0] / d[0];
        for (let i = 0; i < 40; i++) {
          const y = p[1] + t * d[1], s = sag(y); if (!fin(s)) return null;
          const q = Math.sqrt(1 - (1 + k) * cv * cv * y * y), gp = d[0] - cv * y / q * d[1];
          if (Math.abs(gp) < 1e-12) return null;
          const dt = (p[0] + t * d[0] - s) / gp; t -= dt; if (Math.abs(dt) < 1e-10) break;
        }
        const y = p[1] + t * d[1];
        return t > 0 && Math.abs(y) <= a ? [p[0] + t * d[0], y] : null;
      };
      const im = O.mirrorImage(f, so), fi = Math.abs(im.si) > 1e9 || !fin(im.si) ? NaN : im.si;     // image distance, NaN when at infinity
      const px = q => [m.X(q[0]), m.Y(q[1])];
      lay = { m, so, h };
      c.save(); c.beginPath(); c.rect(0, 10, W, Hh - 20); c.clip();
      S.axis(c, 0, m.y0, W);
      S.mirror(c, m.X(0), m.y0, a * m.s, { R: (conc ? -Rr : Rr) * m.s, k });
      const tip = [-so, h], I = fin(fi) ? [-fi, im.m * h] : null;
      // the three principal rays: parallel to the axis, aimed at the focal point, aimed at the vertex
      const dF = [-f + so, -h], aimF = dF[0] < 0 ? [-dF[0], -dF[1]] : dF;
      const rays = [[[1, 0], 'parallel'], [aimF, 'focus'], [[so, -h], 'vertex']];
      let missed = '';
      for (const [d, name] of rays) {
        const Hp = hitSurf(tip, d);
        if (!Hp) { missed = name === 'focus' ? 'the ray through the focal point misses the mirror' : 'a ray misses the mirror'; continue; }
        S.ray(c, [px(tip), px(Hp)], { nm: 600, width: 1.8 });
        let dir;
        if (I) dir = im.real ? unit([I[0] - Hp[0], I[1] - Hp[1]]) : unit([Hp[0] - I[0], Hp[1] - I[1]]);
        else dir = unit([-so, -h]);                                   // object at the focal point: the reflected rays are parallel
        if (I && im.real) S.ray(c, [px(Hp), px(I)], { nm: 600, width: 1.8, extend: 80 });
        else { S.ray(c, [px(Hp), px([Hp[0] + dir[0] * 700, Hp[1] + dir[1] * 700])], { nm: 600, width: 1.8 }); if (I) S.virtual(c, px(Hp)[0], px(Hp)[1], px(I)[0], px(I)[1]); }
      }
      // object, image, focal point, centre of curvature
      S.object(c, m.X(-so), m.y0, h * m.s, { color: C.accent, label: 'object' });
      if (I) S.object(c, m.X(I[0]), m.y0, clamp(I[1] * m.s, -Hh, Hh), { color: C.ok, dash: !im.real, label: im.real ? 'real image' : 'virtual image' });
      for (const [name, z] of [['F', -f], ['C', conc ? -Rr : Rr]]) { K.dot(c, m.X(z), m.y0, 3.5, C.warn); txt(c, name, m.X(z), m.y0 + 15, { color: C.warn, weight: 650 }); }
      S.dim(c, m.X(-so), m.y0 + 40, m.X(0), m.y0 + 40, 'object distance ' + num(so, 0) + ' mm', { off: 12 });
      if (I && fin(fi) && m.X(I[0]) < W - 24) S.dim(c, Math.min(m.X(0), m.X(I[0])), m.y0 + 72, Math.max(m.X(0), m.X(I[0])), m.y0 + 72, 'image distance ' + num(Math.abs(fi), 0) + ' mm', { off: 12 });
      else if (I && fin(fi)) txt(c, 'the virtual image is ' + num(Math.abs(fi), 0) + ' mm behind the mirror, off the picture to the right', W - 20, Hh - 18, { align: 'right', color: C.ok });
      c.restore();
      txt(c, (conc ? 'Concave' : 'Convex') + ' mirror, ' + (V.shape === 'par' ? 'parabolic' : 'spherical') + ', R = ' + num(Rr, 0) + ' mm', 22, 16, { align: 'left', color: C.text, weight: 650, size: 13 });
      // readouts
      const size = !I ? '—' : Math.abs(im.m) < 0.995 ? 'smaller' : Math.abs(im.m) > 1.005 ? 'larger' : 'the same size';
      ro.set('f', (f > 0 ? '+' : '−') + num(Math.abs(f), 1) + ' mm (' + (conc ? 'converging' : 'diverging') + ')');
      ro.set('u', mm(so, 0));
      ro.set('v', !I ? 'at infinity: the reflected rays leave parallel' : num(Math.abs(fi), 1) + ' mm ' + (im.real ? 'in front of the mirror' : 'behind the mirror'));
      ro.set('m', !I ? 'no image forms' : '×' + num(im.m, 2));
      ro.set('nat', !I ? 'at infinity' : (im.real ? 'real' : 'virtual') + ', ' + (im.upright ? 'upright' : 'inverted') + ', ' + size);
      ro.set('hh', !I ? '—' : mm(Math.abs(im.m * h), 1));
      ro.set('note', missed || 'all three reach the mirror');
    }

    /* ---- a parallel beam traced exactly: caustic of a sphere against the focus of a paraboloid */
    function drawBeam() {
      const c = L.st.begin(), C = K.colors(), W = L.st.W, Hh = L.st.H, nm = 550;
      const f = V.R / 2, D = f / V.N, tilt = V.tilt * D2R, shapes = V.which === 'both' ? ['sph', 'par'] : [V.which], nP = shapes.length;
      lay = { beam: true, W, Hh };
      const calc = shapes.map(sh => {
        const sys = O.design.newtonian({ f, D, k: sh === 'par' ? -1 : 0 }), par = O.sys.paraxial(sys, nm);
        return { sh, sys, par, spot: O.sys.spot(sys, { nm, field: tilt, rings: 6, z: par.zImage, par }), bf: O.sys.bestFocus(sys, { nm, field: tilt, rings: 4 }) };
      });
      // one scale for every focus box, so that sphere and paraboloid can be compared: half its width in mm
      const hw = Math.max(0.004, 1.3 * Math.max.apply(null, calc.map(k => k.spot.geo)));
      const airy = O.diff.airyRadius(nm, V.N) * 1e3;
      calc.forEach((k, i) => {
        const { sh, sys, par, spot, bf } = k, zF = par.zImage, ph = Hh / nP, ins = Math.max(24, Math.min(76, ph / 2 - 38));
        const top = i * ph + 26, bottom = (nP - 1 - i) * ph + 12;
        const m = S.map(L.st, -1.65 * f, 0.12 * f, D / 2 * 1.12 + 1.5 * f * Math.tan(tilt), { left: 2 * ins + 48, right: 16, top, bottom });
        const px = q => [m.X(q[0]), m.Y(q[1])];
        c.save(); c.beginPath(); c.rect(0, top - 20, W, ph); c.clip();
        S.axis(c, 0, m.y0, W);
        S.mirror(c, m.X(0), m.y0, D / 2 * m.s, { R: -2 * f * m.s, k: sh === 'par' ? -1 : 0 });
        const fan = O.sys.fan2d(sys, { nm, n: V.nr, field: tilt, fill: 0.98, zStart: -1.55 * f, zEnd: -1.45 * f });
        fan.forEach((r, j) => S.ray(c, r.pts.map(px), { nm: 505, width: 1, alpha: 0.5, arrows: j % 4 === 0 && V.nr < 30 }));
        // the caustic: where neighbouring reflected rays cross
        const line = [];
        for (let j = 0; j + 1 < fan.length; j++) {
          const a = fan[j].tr, b = fan[j + 1].tr; if (!a.ok || !b.ok) continue;
          const p = [a.p[2], a.p[1]], d = [a.d[2], a.d[1]], q = [b.p[2], b.p[1]], e = [b.d[2], b.d[1]], den = cross(d, e);
          if (Math.abs(den) < 1e-9) continue;
          const t = cross([q[0] - p[0], q[1] - p[1]], e) / den, pt = [p[0] + t * d[0], p[1] + t * d[1]];
          if (pt[0] < 0 && pt[0] > -2.2 * f && Math.abs(pt[1]) < D) line.push(px(pt));
        }
        if (line.length > 1) S.ray(c, line, { color: C.warn, width: 2.6, arrows: false });
        // the paraxial focus and the best focus
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(m.X(zF), m.Y(D / 2 * 1.05)); c.lineTo(m.X(zF), m.Y(-D / 2 * 1.05)); c.stroke(); c.restore();
        K.dot(c, m.X(zF), m.y0, 3.5, C.ok);
        txt(c, 'paraxial focus', m.X(zF), m.Y(-D / 2 * 1.05) + 11, { color: C.ok, size: 10.5 });
        if (Math.abs(bf.shift) > 0.004 * f) { c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(m.X(bf.z), m.Y(D * 0.1)); c.lineTo(m.X(bf.z), m.Y(-D * 0.1)); c.stroke(); c.restore(); txt(c, 'best focus', m.X(bf.z), m.Y(D * 0.1) - 9, { color: C.accent, size: 10.5 }); }
        // the focus, magnified: where the rays land on the paraxial focal plane, against the Airy disc
        const ix = 16 + ins + 4;
        c.fillStyle = C.surface; c.fillRect(ix - ins, m.y0 - ins, 2 * ins, 2 * ins);
        S.spot(c, spot, ix, m.y0, ins, ins / hw, { airy, nm: 550 });
        txt(c, 'the focus, magnified', ix, m.y0 - ins - 9, { color: C.muted, size: 10.5 });
        txt(c, 'box ' + blur(2 * hw) + ' across', ix, m.y0 + ins + 10, { color: C.faint, size: 10 });
        c.restore();
        txt(c, sh === 'par' ? 'Paraboloid: every ray of the on-axis beam goes through the same point' : 'Sphere: the outer rays cross the axis early; the bright curve is their envelope, the caustic', 22, top - 10, { align: 'left', color: C.text, weight: 650, size: 12 });
        // the numbers
        const diam = 2 * spot.rms;
        if (sh === 'sph') {
          const mg = O.sys.trace(sys, O.sys.aim(sys, 0, 0.98, 0, par, nm), nm), cr = tilt === 0 && mg.ok ? O.sys.axisCrossing(mg) - zF : NaN;
          ro.set('bs', tilt !== 0 ? 'meaningful for an on-axis beam only' : fin(cr) ? 'cross ' + num(cr, 2) + ' mm closer to the mirror than the paraxial focus' : '—');
          ro.set('bsb', blur(diam) + (tilt ? ' (RMS, with the tilt)' : ' (RMS diameter)'));
          ro.set('bsm', fin(bf.shift) ? num(Math.abs(bf.shift), 2) + ' mm ' + (bf.shift > 0 ? 'closer to the mirror than' : 'farther from the mirror than') + ' the paraxial focus, blur ' + blur(2 * bf.rms) : '—');
        } else ro.set('bp', blur(diam) + (tilt ? ' (RMS, with the tilt: coma)' : ' (RMS diameter)'));
        if (i === 0) ro.set('bf', 'f = ' + num(f, 1) + ' mm, aperture Ø ' + num(D, 1) + ' mm, f/' + num(V.N, 2));
      });
      ro.show('bs', shapes.includes('sph')); ro.show('bsb', shapes.includes('sph')); ro.show('bsm', shapes.includes('sph')); ro.show('bp', shapes.includes('par'));
      ro.set('f', '+' + num(f, 1) + ' mm (R = ' + num(V.R, 0) + ' mm)');
    }

    function draw() { if (V.mode === 'rays') drawImage(); else drawBeam(); }
    K.drag(L.st, {
      hover: true,
      hit: p => {
        if (!lay) return null;
        if (lay.beam) return p.x < lay.W * 0.3 ? 'tilt' : null;
        const x = lay.m.X(-lay.so), tipY = lay.m.Y(lay.h);
        if (Math.hypot(p.x - x, p.y - tipY) < 14) return 'tip';
        return Math.abs(p.x - x) < 12 && p.y > tipY - 14 && p.y < lay.m.y0 + 14 ? 'body' : null;
      },
      move: (w, p) => {
        if (!lay) return;
        if (w === 'tilt') ctl.set('tilt', clamp(Math.round(Math.abs(lay.Hh / 2 - p.y) / (lay.Hh / 2) * 8 * 4) / 4, 0, 6));
        else if (w === 'tip') ctl.set('h', clamp(Math.round(lay.m.Yi(p.y)), 4, 50));
        else ctl.set('so', clamp(Math.round(-lay.m.Z(p.x)), 15, 330));
        draw();
      }
    });
    L.st.onResize(draw); T.util.onTheme(draw);
    showRows(); draw();
  }

  /* ================================================================ 3 · prisms and blocks */
  const MATS = [['Crown glass (N-BK7)', 'N-BK7'], ['Dense flint glass (N-SF11)', 'N-SF11'], ['Fused silica', 'fused-silica'], ['Acrylic (PMMA)', 'PMMA'], ['Polycarbonate', 'PC'], ['Water', 'water'], ['Sapphire', 'sapphire'], ['Diamond', 'diamond']];
  const SHAPES = [['Prism (apex angle adjustable)', 'prism'], ['Right-angle prism', 'right'], ['Parallel plate', 'plate'], ['Semicircular block', 'semi']];
  const SHAPE_ANGLE = { prism: 60, right: 0, plate: 40, semi: 30 };
  const WHITE = [410, 450, 490, 530, 570, 610, 650, 690];
  const FAR = 400, PLATE_T = 30;

  /* a block of glass for the tracer: faces (straight { a, b } or round { c, r, a0, a1 }), its outline, and where the beam is aimed:
     A is the point it meets, Nin the direction that is "straight in" at that point (angles are measured from it) */
  function shapeOf(kind, apex, s) {
    const poly = (P, e) => {
      const faces = P.map((p, i) => ({ a: p, b: P[(i + 1) % P.length] })), f = faces[e], dx = f.b[0] - f.a[0], dy = f.b[1] - f.a[1], l = Math.hypot(dx, dy);
      return { faces, outline: P, A: [f.a[0] + s * dx, f.a[1] + s * dy], Nin: [-dy / l, dx / l] };
    };
    if (kind === 'prism') { const a = apex * D2R, hgt = 60 * Math.cos(a / 2), b = 60 * Math.sin(a / 2); return Object.assign(poly([[-b, 0], [b, 0], [0, hgt]], 2), { c: [0, hgt / 2] }); }
    if (kind === 'right') return Object.assign(poly([[-25, -25], [25, -25], [-25, 25]], 2), { c: [-8, -8] });
    if (kind === 'plate') return Object.assign(poly([[-PLATE_T / 2, -45], [PLATE_T / 2, -45], [PLATE_T / 2, 45], [-PLATE_T / 2, 45]], 3), { c: [0, 0] });
    const r = 36, outline = [];
    for (let i = 0; i <= 48; i++) { const t = Math.PI / 2 + Math.PI * i / 48; outline.push([r * Math.cos(t), r * Math.sin(t)]); }
    return { faces: [{ c: [0, 0], r, a0: Math.PI / 2, a1: 3 * Math.PI / 2 }, { a: [0, -r], b: [0, r] }], outline, A: [0, 0], Nin: [1, 0], c: [-12, 0] };
  }
  /* where the ray p + t·d first meets a face (t > 0): { t, pt, n (outward normal) } or null */
  function hitFace(f, p, d) {
    if (f.r == null) {
      const e = [f.b[0] - f.a[0], f.b[1] - f.a[1]], den = cross(d, e);
      if (Math.abs(den) < 1e-12) return null;
      const ap = [f.a[0] - p[0], f.a[1] - p[1]], t = cross(ap, e) / den, u = cross(ap, d) / den, l = Math.hypot(e[0], e[1]);
      return t < 1e-7 || u < -1e-9 || u > 1 + 1e-9 ? null : { t, pt: [p[0] + t * d[0], p[1] + t * d[1]], n: [e[1] / l, -e[0] / l] };
    }
    const q = [p[0] - f.c[0], p[1] - f.c[1]], B = dotp(q, d), disc = B * B - (dotp(q, q) - f.r * f.r);
    if (disc < 0) return null;
    for (const t of [-B - Math.sqrt(disc), -B + Math.sqrt(disc)]) {
      if (t < 1e-7) continue;
      const pt = [p[0] + t * d[0], p[1] + t * d[1]];
      let rel = Math.atan2(pt[1] - f.c[1], pt[0] - f.c[0]) - f.a0; while (rel < 0) rel += TAU; while (rel >= TAU) rel -= TAU;
      if (rel <= f.a1 - f.a0 + 1e-9) return { t, pt, n: [(pt[0] - f.c[0]) / f.r, (pt[1] - f.c[1]) / f.r] };
    }
    return null;
  }
  /* trace one ray through a block of index n: every surface splits it into a refracted and a reflected ray (Fresnel), total reflection
     where Snell's law has no answer. -> { segs: [{ a, b, w (share of the light), main }], hits (along the main path), dEnd } */
  function tracePrism(sh, n, p0, d0, refl) {
    const segs = [], hits = [];
    let dEnd = null;
    const walk = (p, d, w, depth, main) => {
      let best = null;
      sh.faces.forEach((f, i) => { const h = hitFace(f, p, d); if (h && (!best || h.t < best.t)) { best = h; best.face = i; } });
      if (!best || depth > 14) { segs.push({ a: p, b: [p[0] + d[0] * FAR, p[1] + d[1] * FAR], w, main }); if (main && !best) dEnd = d; return; }
      segs.push({ a: p, b: best.pt, w, main });
      const entering = dotp(d, best.n) < 0, Nf = entering ? best.n : [-best.n[0], -best.n[1]];       // Nf points back towards the ray
      const n1 = entering ? 1 : n, n2 = entering ? n : 1, ci = clamp(-dotp(d, Nf), 0, 1), fr = O.fresnel(n1, n2, Math.acos(ci));
      const dr = [d[0] + 2 * ci * Nf[0], d[1] + 2 * ci * Nf[1]], hit = { face: best.face, pt: best.pt, Nf, ti: Math.acos(ci), tir: fr.tir, t2: fr.t2, n1, n2, R: fr.tir ? 1 : fr.R, d, dr, dt: null };
      if (main) hits.push(hit);
      if (fr.tir) { walk(best.pt, dr, w, depth + 1, main); return; }
      const ct = Math.cos(fr.t2), r = n1 / n2;
      hit.dt = [r * d[0] + (r * ci - ct) * Nf[0], r * d[1] + (r * ci - ct) * Nf[1]];
      walk(best.pt, hit.dt, w * (1 - fr.R), depth + 1, main);
      if (refl && w * fr.R > 0.004 && depth < 6) walk(best.pt, dr, w * fr.R, depth + 1, false);
    };
    walk(p0, d0, 1, 0, true);
    return { segs, hits, dEnd };
  }

  function prism(el) {
    const L = T.util.lab(el, 'Light meets glass: at every surface part of it is reflected and the rest bends by Snell’s law, unless the angle is too steep and all of it is reflected. Turn the beam by dragging the source, change the glass, and switch on white light to see the colours separate.', 0.56);
    let lay = null;
    const ctl = K.controls(L.side, [
      { id: 'shape', type: 'select', label: 'Shape of the glass', options: SHAPES, value: 'prism' },
      { id: 'mat', type: 'select', label: 'Material', options: MATS, value: 'N-SF11' },
      { id: 'apex', label: 'Apex angle of the prism', min: 20, max: 90, step: 1, value: 60, unit: '°' },
      { id: 'angle', label: 'Angle of the incoming ray', min: -85, max: 85, step: 0.5, value: 60, unit: '°' },
      { id: 's', label: 'Where the ray meets the first face', min: 0.15, max: 0.85, step: 0.01, value: 0.5, fmt: v => num(v * 100, 0) + ' % of the way down' },
      { id: 'white', type: 'check', label: 'White light (all the colours)', value: true },
      { id: 'nm', label: 'Wavelength of the single colour', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
      { id: 'refl', type: 'check', label: 'Show the partial reflections', value: true },
      { id: 'marks', type: 'check', label: 'Show the normals and the angles', value: true },
      { type: 'html', html: 'Drag the light source, or the incoming ray, to turn the beam. The angle is measured from the normal to the surface it first meets.' }
    ], onChange);
    const V = ctl.values;
    const ro = K.readout(L.side, [['n', 'Refractive index'], ['crit', 'Critical angle, glass to air'], ['dev', 'Total deviation of the beam'], ['dmin', 'Minimum deviation'], ['tir', 'Total internal reflection'], ['shift', 'Sideways shift'], ['spread', 'Spread of the colours']]);
    L.under.innerHTML = '<div class="bplot"></div><div class="btab"></div>' + T.util.more(['snells-law', 'refraction-at-a-flat-surface', 'critical-angle-and-total-internal-reflection', 'fresnel-reflection', 'prism-deviation', 'dispersion-and-the-spectrum', 'prism-types', 'optical-glass']);
    const plotEl = ui.$('.bplot', L.under), tabEl = ui.$('.btab', L.under);
    const plot = K.plot(plotEl, { x: { label: 'Angle of incidence on the first face (°)', min: 0, max: 90 }, y: { label: 'Deviation (°)' }, legend: true }, 190);
    const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
    const cv = v => Math.atan2(-v[1], v[0]);                               // a world direction as a canvas angle

    function showRows() { ctl.show('apex', V.shape === 'prism'); ctl.show('s', V.shape !== 'semi'); ctl.show('nm', !V.white); }
    function onChange(id, v) {
      if (id === 'shape') ctl.set('angle', SHAPE_ANGLE[v] != null ? SHAPE_ANGLE[v] : 30);
      showRows(); draw();
    }

    function draw() {
      const c = L.st.begin(), C = K.colors(), W = L.st.W, Hh = L.st.H;
      const sh = shapeOf(V.shape, V.apex, V.s), nms = V.white ? WHITE : [V.nm], refNm = V.white ? 550 : V.nm, LS = 62;
      const nOf = nm => O.index(V.mat, nm), d0 = rot(sh.Nin, V.angle * D2R), S0 = [sh.A[0] - d0[0] * LS, sh.A[1] - d0[1] * LS];
      const sc = Math.min(W / 172, Hh / 104), xc = sh.c[0], yc = sh.c[1];
      const X = x => W / 2 + sc * (x - xc), Y = y => Hh / 2 - sc * (y - yc), P = q => [X(q[0]), Y(q[1])];
      lay = { sc, xc, yc, W, Hh, A: sh.A, Nin: sh.Nin, S0 };
      const ref = tracePrism(sh, nOf(refNm), S0, d0, V.refl);
      const runs = nms.map(nm => nm === refNm ? ref : tracePrism(sh, nOf(nm), S0, d0, false));
      // the glass, then the light
      S.poly(c, sh.outline.map(P));
      c.save(); c.beginPath(); c.rect(0, 0, W, Hh); c.clip();
      for (const sg of ref.segs) if (!sg.main && V.refl) S.ray(c, [P(sg.a), P(sg.b)], { nm: refNm, width: 1, alpha: clamp(0.18 + 4 * sg.w, 0.18, 0.7), arrows: false });
      // the colours add up to white where they still overlap (on the dark theme; on the light one they are drawn over each other)
      c.save();
      if (V.white && C.dark) c.globalCompositeOperation = 'lighter';
      runs.forEach((r, j) => r.segs.forEach((sg, i) => {
        if (!sg.main || (V.white && i === 0)) return;
        S.ray(c, [P(sg.a), P(sg.b)], { nm: nms[j], width: V.white ? 2.4 : 2.6, alpha: 0.9, arrows: !V.white });
      }));
      c.restore();
      const first = ref.segs[0];
      if (V.white) S.ray(c, [P(first.a), P(first.b)], { color: C.text, width: 2.6 });
      S.source(c, P(S0)[0], P(S0)[1], { kind: V.white ? 'bulb' : 'laser', dir: cv(d0), color: V.white ? C.text : S.nm(V.nm), size: 13 });
      if (V.marks) ref.hits.slice(0, 3).forEach(h => {
        const q = P(h.pt);
        S.normal(c, q[0], q[1], cv(h.Nf), 30);
        if (h.ti > 0.03) S.angle(c, q[0], q[1], 24, cv(h.Nf), cv([-h.d[0], -h.d[1]]), num(h.ti * R2D, 0) + '°');
        if (h.tir) txt(c, 'total internal reflection', q[0] + 10, q[1] + 24, { color: C.warn, weight: 650, align: 'left' });
        else if (h.t2 > 0.03) S.angle(c, q[0], q[1], 34, cv([-h.Nf[0], -h.Nf[1]]), cv(h.dt), num(h.t2 * R2D, 0) + '°');
      });
      K.dot(c, P(sh.A)[0], P(sh.A)[1], 3, C.accent);
      c.restore();
      txt(c, O.MATERIALS[V.mat].name + ' · n = ' + num(nOf(refNm), 3) + (V.white ? ' for green light' : ''), W / 2, Hh - 14, { color: C.muted });
      txt(c, 'light: ' + (V.white ? 'white' : num(V.nm, 0) + ' nm (' + O.colourName(V.nm) + ')'), 14, 16, { align: 'left', color: C.text, weight: 650, size: 13 });
      // the numbers
      const devOf = r => r.dEnd ? Math.abs(Math.atan2(cross(d0, r.dEnd), dotp(d0, r.dEnd))) : NaN;
      const n = nOf(refNm), A = V.apex * D2R, crit = O.criticalAngle(n, 1), tirAt = ref.hits.findIndex(h => h.tir), dv = devOf(ref);
      ro.set('n', num(n, 4) + ' at ' + num(refNm, 0) + ' nm');
      ro.set('crit', fin(crit) ? deg(crit, 1) : '—');
      ro.set('dev', ref.dEnd ? deg(dv, 1) : 'the beam stays inside (trapped by total reflection)');
      ro.set('dmin', V.shape !== 'prism' ? '—' : n * Math.sin(A / 2) >= 1 ? 'none: no ray can leave this prism' : deg(O.minDeviation(n, A), 1) + ' at an incidence of ' + deg(Math.asin(n * Math.sin(A / 2)), 1));
      ro.set('tir', tirAt < 0 ? 'no' : 'yes, at surface ' + (tirAt + 1) + ' (incidence ' + deg(ref.hits[tirAt].ti, 1) + ')');
      ro.set('shift', V.shape === 'plate' ? mm(O.plateShift(PLATE_T, n, Math.abs(V.angle) * D2R), 2) : '—');
      ro.set('spread', V.white ? (runs[0].dEnd && runs[runs.length - 1].dEnd ? deg(Math.abs(devOf(runs[0]) - devOf(runs[runs.length - 1])), 2) + ' from violet to red' : '—') : 'switch on white light');
      tabEl.innerHTML = '<h4 style="margin:10px 0 4px;font-size:13px">Surface by surface, for ' + (V.white ? 'green light' : num(V.nm, 0) + ' nm') + '</h4>' + T.util.table(['Surface met', 'Angle of incidence', 'What the beam does', 'Reflected'],
        ref.hits.slice(0, 8).map((h, i) => [String(i + 1), deg(h.ti, 1), h.tir ? 'totally reflected (steeper than ' + deg(crit, 1) + ')' : 'bent to ' + deg(h.t2, 1) + ' (n ' + num(h.n1, 3) + ' to ' + num(h.n2, 3) + ')', h.tir ? '100 %' : num(h.R * 100, 1) + ' %']));
      // the deviation of a prism against the angle of incidence
      plotEl.style.display = V.shape === 'prism' ? '' : 'none';
      if (V.shape === 'prism') {
        const series = (V.white ? [450, 550, 650] : [V.nm]).map(nm => {
          const pts = []; for (let a = 0; a <= 89; a++) { const r = O.prism(nOf(nm), A, a * D2R); if (!r.tir && fin(r.delta)) pts.push([a, r.delta * R2D]); }
          return { pts, color: S.nm(nm), label: num(nm, 0) + ' nm', width: 2 };
        });
        const cur = O.prism(n, A, Math.abs(V.angle) * D2R), marks = [];
        if (!cur.tir && fin(cur.delta) && V.angle >= 0) marks.push({ x: V.angle, y: cur.delta * R2D, label: 'now', color: C.text });
        if (n * Math.sin(A / 2) < 1) marks.push({ x: Math.asin(n * Math.sin(A / 2)) * R2D, y: O.minDeviation(n, A) * R2D, label: 'minimum', color: C.warn });
        plot.set({ series, marks, x: { label: 'Angle of incidence on the first face (°)', min: 0, max: 90 }, y: { label: 'Deviation (°)' }, legend: series.length > 1 });
      }
    }

    K.drag(L.st, {
      hover: true,
      hit: p => {
        if (!lay) return null;
        const s0 = [lay.W / 2 + lay.sc * (lay.S0[0] - lay.xc), lay.Hh / 2 - lay.sc * (lay.S0[1] - lay.yc)], a = [lay.W / 2 + lay.sc * (lay.A[0] - lay.xc), lay.Hh / 2 - lay.sc * (lay.A[1] - lay.yc)];
        if (Math.hypot(p.x - s0[0], p.y - s0[1]) < 26) return 'src';
        const e = [a[0] - s0[0], a[1] - s0[1]], l2 = dotp(e, e) || 1, t = clamp(dotp([p.x - s0[0], p.y - s0[1]], e) / l2, 0, 1);
        return Math.hypot(p.x - s0[0] - t * e[0], p.y - s0[1] - t * e[1]) < 9 ? 'src' : null;
      },
      move: (w, p) => {
        if (!lay) return;
        const q = [lay.xc + (p.x - lay.W / 2) / lay.sc, lay.yc - (p.y - lay.Hh / 2) / lay.sc], v = [lay.A[0] - q[0], lay.A[1] - q[1]], l = Math.hypot(v[0], v[1]);
        if (l < 1e-6) return;
        const d = [v[0] / l, v[1] / l], th = Math.atan2(cross(lay.Nin, d), dotp(lay.Nin, d)) * R2D;
        ctl.set('angle', clamp(Math.round(th * 2) / 2, -85, 85)); draw();
      }
    });
    L.st.onResize(draw); T.util.onTheme(draw);
    showRows(); draw();
  }
})();
