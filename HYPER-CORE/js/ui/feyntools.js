/* HYPER-CORE · ui/feyntools.js
 *
 * The Tools pages of Hyper Feynman.
 *
 *   #/tools/arrows/<mirror|glass>   QED's arrows: every point of a mirror reflects — the arrows add up to the
 *                                   reflection, the ends cancel, scraping the mirror makes a grating; a glass sheet's
 *                                   two arrows and the reflection against thickness
 *   #/tools/slits                   the two-slit experiment in real units: electrons, neutrons, photons or C60
 *                                   molecules; de Broglie wavelength, fringe spacing and hits building the pattern
 *   #/tools/spacetime               a Minkowski diagram: your events in two frames, light cones, simultaneity, the
 *                                   invariant interval, the twin paradox
 *   #/tools/fields                  field lines and equipotentials of charges you place, or the field of currents
 *   #/tools/wells                   stationary states of 1-D potentials, and wave packets meeting them
 *
 * The physics is HYPER-CORE/js/quantum.js (kit.qm, tested by tools/test-quantum.js).
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, Q = () => H.qm;
  const n3 = (x, d) => Number.isFinite(x) ? U.fmt(x, d || 4) : '—';
  const f1 = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';
  const font = () => getComputedStyle(document.body).fontFamily;

  /* ---------------------------------------------------------------- form, layout, plots */
  // fields: [id, label, value, kind, extra]; kind 'q' (extra = [quantity, unit]: value in the quantity's base unit),
  // 'n' (a plain number, extra = unit label), 'range' (extra = [min, max, step]), 'sel', 'check', 'sep'
  function form(el, fields, onChange) {
    el.innerHTML = fields.map(([id, label, value, kind, extra]) => {
      if (kind === 'sep') return '<div class="msep">' + esc(label) + '</div>';
      if (kind === 'check') return '<label class="mfield mcheck"><input type="checkbox" data-f="' + id + '"' + (value ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
      if (kind === 'sel') return '<label class="mfield"><span>' + esc(label) + '</span><select class="inp" data-f="' + id + '">' + extra.map(([v, t]) => '<option value="' + esc(String(v)) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
      if (kind === 'range') return '<label class="mfield"><span>' + esc(label) + ' <b class="rv" data-rv="' + id + '"></b></span><input type="range" data-f="' + id + '" min="' + extra[0] + '" max="' + extra[1] + '" step="' + extra[2] + '" value="' + value + '"></label>';
      const q = kind === 'q' ? H.units.Q[extra[0]] : null;
      const unit = q ? '<select class="munit" data-u="' + id + '">' + q.units.map(u => '<option' + (u[0] === extra[1] ? ' selected' : '') + '>' + esc(u[0]) + '</option>').join('') + '</select>' : (extra ? '<i>' + esc(extra) + '</i>' : '');
      return '<label class="mfield"><span>' + esc(label) + '</span><span class="minp"><input class="inp" inputmode="decimal" data-f="' + id + '" value="' + esc(String(value)) + '">' + unit + '</span></label>';
    }).join('');
    const defs = Object.fromEntries(fields.map(f => [f[0], f]));
    const read = () => {
      const v = {};
      el.querySelectorAll('[data-f]').forEach(inp => {
        const id = inp.dataset.f, d = defs[id];
        if (d[3] === 'sel') { v[id] = inp.value; return; }
        if (d[3] === 'check') { v[id] = inp.checked; return; }
        if (d[3] === 'range') { v[id] = +inp.value; const rv = el.querySelector('[data-rv="' + id + '"]'); if (rv) rv.textContent = inp.value; return; }
        let x = NaN;
        try { x = H.expr.evaluate(H.expr.parse(U.cleanNum(inp.value) || 'nan'), {}); } catch (e) { x = NaN; }
        inp.classList.toggle('bad', !Number.isFinite(x));
        if (d[3] === 'q') x = H.units.toSI(x, d[4][0], el.querySelector('[data-u="' + id + '"]').value);
        v[id] = x;
      });
      return v;
    };
    el.querySelectorAll('[data-u]').forEach(sel => {
      let prev = sel.value;
      sel.addEventListener('change', () => {
        const id = sel.dataset.u, q = defs[id][4][0], inp = el.querySelector('[data-f="' + id + '"]');
        const x = parseFloat(U.cleanNum(inp.value));
        if (Number.isFinite(x)) inp.value = String(Number(H.units.convert(x, q, prev, sel.value).toPrecision(5)));
        prev = sel.value;
        onChange(read());
      });
    });
    el.addEventListener('input', () => onChange(read()));
    el.addEventListener('change', e => { if (!e.target.dataset.u) onChange(read()); });
    return read;
  }
  const stat = (label, value, sub, cls) => '<div class="mstat' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span><b>' + value + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
  function layout(el, intro) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') +
      '<div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div><div class="mextra"></div></div></div>';
    return { form: ui.$('.mform', el), stats: ui.$('.mstats', el), plot: ui.$('.mplot', el), extra: ui.$('.mextra', el) };
  }
  function plotIn(el, opts, h) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '8px';
    const cv = document.createElement('canvas'); cv.className = 'plot'; cv.style.height = (h || 240) + 'px';
    box.appendChild(cv); el.appendChild(box);
    const p = new H.Plot(cv, opts || {});
    ui.onLeave(() => p.destroy());
    return p;
  }
  // a canvas that redraws itself with draw(ctx, w, h) on demand and on resize; animate(fn) runs fn(dt) each frame while the page is shown
  function canvasIn(el, h, draw) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '6px';
    const cv = document.createElement('canvas'); cv.style.cssText = 'display:block;width:100%;height:' + h + 'px;touch-action:none';
    box.appendChild(cv); el.appendChild(box);
    const paint = () => {
      const w = cv.clientWidth || 600, dpr = window.devicePixelRatio || 1;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
      draw(c, w, h);
    };
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => paint()); ro.observe(cv); ui.onLeave(() => ro.disconnect()); }
    let raf = 0, alive = true, last = 0;
    const animate = fn => {
      const tick = now => { if (!alive) return; const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now; fn(dt); paint(); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    };
    ui.onLeave(() => { alive = false; cancelAnimationFrame(raf); });
    return { cv, paint, animate, get w() { return cv.clientWidth || 600; }, h };
  }
  function subtabs(el, base, TABS, sub, note) {
    const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' +
      (note ? '<p class="small faint mt">' + note + '</p>' : '');
    return { tab, body: ui.$('.mbody', el) };
  }
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';
  const arrowHead = (c, x0, y0, x1, y1, col, w) => {
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w || 2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.min(9, Math.hypot(x1 - x0, y1 - y0) * 0.45);
    if (L < 2) return;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - L * Math.cos(a - 0.4), y1 - L * Math.sin(a - 0.4)); c.lineTo(x1 - L * Math.cos(a + 0.4), y1 - L * Math.sin(a + 0.4)); c.closePath(); c.fill();
  };

  /* ================================================================ QED ARROWS */
  const ARROWS = [['mirror', 'Every point of a mirror'], ['glass', 'A sheet of glass']];
  function arrows(el, params, sub) {
    const T = subtabs(el, 'arrows', ARROWS, sub, 'Drawn to scale except the wavelength, which is enlarged thousands of times so the arrows can be seen turning. In QED\'s picture each path gets an arrow; the arrows add head to tail; the square of the final arrow gives the probability.');
    ({ mirror: aMirror, glass: aGlass })[T.tab](T.body);
  }
  function aMirror(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Light from S reaches the detector P by bouncing off every point of the mirror, not just the middle. Each path gets an arrow turned by the time it takes; the arrows are added head to tail below. Near the middle the times hardly change, so neighbouring arrows point the same way and build up the reflection; towards the ends the times change fast, the arrows curl round and cancel.' + link('every-path-counts') + link('arrow-rule') + '</p>' +
      '<div class="mcv" style="margin-bottom:12px"></div><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el);
    const read = form(fEl, [['lam', 'Wavelength (enlarged)', 14, 'range', [6, 40, 1]], ['px', 'Detector position along the mirror', 200, 'range', [-260, 260, 5]], ['strips', 'Mirror strips shown', 36, 'range', [12, 80, 2]],
      ['scrape', 'Mirror', 'full', 'sel', [['full', 'the whole mirror'], ['middle', 'only the part near equal angles'], ['ends', 'only the far right end'], ['grating', 'the far right end, scraped into a grating']]]], () => calc());
    let S = null;
    const cv = canvasIn(ui.$('.mcv', el), 380, (c, w, h) => {
      if (!S) return;
      // drawn in a 640 × 380 frame, scaled to fit the canvas
      const sc = Math.min(1, w / 640, h / 380); c.save(); c.translate((w - 640 * sc) / 2, 0); c.scale(sc, sc);
      const C = ui.colors(), cx = 320, my = 250, sx = cx + S.src[0], sy = my - S.src[1] * 1, dx = cx + S.det[0], dy = my - S.det[1];
      c.font = '12px ' + font();
      // the mirror, point by point, coloured by the direction of each point's arrow (grey where scraped away)
      for (const p of S.pts) { c.fillStyle = p.on ? 'hsl(' + (((p.phase * 180 / Math.PI) % 360 + 360) % 360) + ' 70% 55%)' : C.border; c.fillRect(cx + p.x - 0.4, my, 1.2, 8); }
      // a few paths
      c.strokeStyle = C.faint; c.lineWidth = 1;
      for (let i = 0; i < S.pts.length; i += 50) { const p = S.pts[i]; if (!p.on) continue; c.beginPath(); c.moveTo(sx, sy); c.lineTo(cx + p.x, my); c.lineTo(dx, dy); c.stroke(); }
      c.fillStyle = C.text; c.beginPath(); c.arc(sx, sy, 6, 0, 6.283); c.fill(); c.fillText('S', sx - 14, sy - 6);
      c.fillStyle = C.accent; c.beginPath(); c.arc(dx, dy, 6, 0, 6.283); c.fill(); c.fillText('P', dx + 10, dy - 6);
      c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 300, my); c.lineTo(cx + 300, my); c.stroke();
      c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText('mirror — the colour shows the direction of each point\'s arrow', cx, my + 26); c.textAlign = 'left';
      // the arrows, head to tail, top-left
      const k = Math.min(110 / Math.max(0.1, S.span), 900);
      const ox = 40, oy = 110; let x = ox, y = oy;
      c.fillStyle = C.muted; c.fillText('the arrows added', ox - 20, 18);
      for (const z of S.stripArrows) { const nx = x + z.re * k, ny = y - z.im * k; arrowHead(c, x, y, nx, ny, 'hsl(' + (((Math.atan2(z.im, z.re) * 180 / Math.PI) % 360 + 360) % 360) + ' 70% 50%)', 1.4); x = nx; y = ny; }
      arrowHead(c, ox, oy, x, y, C.text, 3);
      c.restore();
    });
    const pl = plotIn(ui.$('.mplot', el), { x: { label: 'where the light hits the mirror (px from the middle)', min: -300, max: 300 }, y: { label: 'time taken (arbitrary units)' } }, 190);
    function calc() {
      const v = read(), Qm = Q(), src = [-200, 150], det = [v.px, 150], n = 1200;
      const m = Qm.mirrorPaths({ src, det, y: 0, x0: -300, x1: 300, n, lambda: v.lam });
      const spec = (v.px + src[0]) / 2;
      // which points of the mirror are kept: for the grating, of the far right end keep only the bits whose arrows point within 90° of the first one's
      const end = m.pts.find(p => p.x > 170), refPh = end ? end.phase : 0;
      for (const p of m.pts) p.on = v.scrape === 'middle' ? Math.abs(p.x - spec) < 90 : v.scrape === 'ends' ? p.x > 170 : v.scrape === 'grating' ? p.x > 170 && Math.cos(p.phase - refPh) > 0 : true;
      const N = v.strips, per = n / N, strips = [];
      for (let k = 0; k < N; k++) {
        const pts = m.pts.slice(Math.round(k * per), Math.round((k + 1) * per)).filter(p => p.on);
        if (pts.length) strips.push(Qm.arrowSum(pts.map(p => p.z)).total);
      }
      const tot = Qm.arrowSum(strips).total, kept = m.pts.filter(p => p.on).length / n;
      const full = Qm.mirrorPaths({ src, det: [200, 150], y: 0, x0: -300, x1: 300, n, lambda: v.lam }).total;
      const span = Math.max(...strips.map(z => Qm.abs(z)), 1e-9) * 6;
      S = { src, det, pts: m.pts, stripArrows: strips, span };
      const P = Qm.abs2(tot) / Qm.abs2(full);
      stats.innerHTML = stat('Probability of reaching P', f1(100 * P, 1) + ' %', 'relative to the whole mirror with P at the mirror-image angle', 'big') +
        stat('Equal angles at', f1(spec, 0) + ' px', 'the point where the time is least') + stat('Mirror kept', f1(100 * kept, 0) + ' %', v.scrape === 'grating' ? 'the end strips whose arrows pointed the other way are scraped off, so the rest no longer cancel' : v.scrape === 'ends' ? 'alone, the end of the mirror reflects almost nothing: its arrows curl round' : '');
      const tim = m.pts.filter((_, i) => i % 6 === 0).map(p => [p.x, p.L]);
      pl.set({ series: [{ pts: tim, label: 'time ∝ path length' }], vlines: [{ x: spec, label: 'least time' }] });
      cv.paint();
    }
    calc();
  }
  function aGlass(el) {
    const L = layout(el, 'Light reflecting from a sheet of glass has two arrows: one for the front surface (turned half a turn — it reflects from a denser medium) and one for the back surface, turned further by the extra time the light spends crossing the glass twice. Each has length 0.2 (4 % alone). Depending on the thickness they add to 0.4 (16 %) or cancel (0 %). The exact result, with light bouncing back and forth inside, is close.' + link('partial-reflection') + link('photons-as-particles'));
    const pl = plotIn(L.plot, { x: { label: 'thickness of the glass (nm)', min: 0 }, y: { label: 'reflected (%)', min: 0, max: 17 } }, 220);
    const read = form(L.form, [['d', 'Thickness', 100, 'q', ['length', 'nm']], ['lam', 'Wavelength', 550, 'q', ['length', 'nm']], ['n', 'Refractive index', 1.5, 'n']], v => calc(v));
    let last = null;
    const cv = canvasIn(L.extra, 200, (c, w) => {
      if (!last) return;
      const C = ui.colors(), cx = w / 2, cy = 100, k = 220;
      c.font = '12px ' + font(); c.fillStyle = C.muted; c.textAlign = 'center';
      c.strokeStyle = C.border; c.beginPath(); c.arc(cx, cy, 0.2 * k, 0, 6.283); c.stroke();
      const z1 = { re: -last.r, im: 0 }, z2 = Q().polar(last.r, last.ph);
      const ax = cx + z1.re * k, ay = cy - z1.im * k, bx = ax + z2.re * k, by = ay - z2.im * k;
      arrowHead(c, cx, cy, ax, ay, 'hsl(210 85% 55%)', 2.6); arrowHead(c, ax, ay, bx, by, 'hsl(22 90% 55%)', 2.6); arrowHead(c, cx, cy, bx, by, C.text, 3.2);
      c.fillStyle = 'hsl(210 85% 55%)'; c.fillText('front surface', cx - 0.2 * k, cy + 24);
      c.fillStyle = 'hsl(22 90% 55%)'; c.fillText('back surface', (ax + bx) / 2, Math.min(ay, by) - 10);
      c.fillStyle = C.text; c.fillText('total arrow² = ' + f1(100 * last.P, 1) + ' %', cx, 190);
    });
    function calc(v) {
      if (!(v.d >= 0 && v.lam > 0 && v.n > 1)) { L.stats.innerHTML = '<p class="muted">Enter a thickness, a wavelength and an index above 1.</p>'; return; }
      const Qm = Q(), r = (v.n - 1) / (v.n + 1), ph = 4 * Math.PI * v.n * v.d / v.lam, P = Qm.glassSimple({ n: v.n, d: v.d, lambda: v.lam }), E = Qm.glassExact({ n: v.n, d: v.d, lambda: v.lam });
      last = { r, ph, P };
      L.stats.innerHTML = stat('Reflection, two arrows', f1(100 * P, 2) + ' %', 'QED\'s picture: |−r + r e^{iδ}|²', 'big') + stat('Reflection, exact', f1(100 * E, 2) + ' %', 'with all the bounces inside the glass') +
        stat('One surface alone', f1(100 * r * r, 2) + ' %', 'r = (n − 1)/(n + 1) = ' + f1(r, 3)) + stat('Extra turn of the back arrow', f1((ph * 180 / Math.PI) % 360, 0) + '°', 'the round trip 2nd is ' + f1(2 * v.n * v.d * 1e9, 0) + ' nm = ' + f1(2 * v.n * v.d / v.lam, 2) + ' wavelengths');
      const top = Math.max(4 * v.lam / (4 * v.n) * 1.05, v.d * 1.2), s1 = [], s2 = [];
      for (let i = 0; i <= 400; i++) { const d = top * i / 400; s1.push([d * 1e9, 100 * Qm.glassSimple({ n: v.n, d, lambda: v.lam })]); s2.push([d * 1e9, 100 * Qm.glassExact({ n: v.n, d, lambda: v.lam })]); }
      pl.set({ series: [{ pts: s1, label: 'two arrows (QED)' }, { pts: s2, label: 'exact thin film', dash: [5, 4] }], marks: [{ x: v.d * 1e9, y: 100 * P, label: 'this sheet' }] });
      cv.paint();
    }
    calc(read());
  }


  /* ================================================================ THE TWO-SLIT LAB */
  // [label, mass kg (0 for a photon)]
  const PARTICLES = { electron: ['Electron', 9.1093837015e-31], neutron: ['Neutron', 1.67492749804e-27], helium: ['Helium atom', 6.6464731e-27], c60: ['C₆₀ molecule (a buckyball)', 720 * 1.66053906660e-27], photon: ['Photon (light)', 0] };
  function slits(el) {
    const L = layout(el, 'The two-slit experiment with real particles and real sizes. The wavelength comes from the momentum, λ = h/p; the pattern on the screen is |φ₁ + φ₂|², the interference of the two slits inside the envelope of each slit\'s own diffraction. The dots arrive one at a time.' + link('bullets-waves-electrons') + link('watching-electrons') + link('uncertainty-feyn'));
    const read = form(L.form, [['kind', 'Particle', 'electron', 'sel', Object.entries(PARTICLES).map(([k, p]) => [k, p[0]])], ['E', 'Kinetic energy (photon: its energy)', 50, 'q', ['energy', 'keV']],
      ['d', 'Distance between the slits', 1, 'q', ['length', 'µm']], ['a', 'Width of each slit', 0.3, 'q', ['length', 'µm']], ['Ls', 'Slits to screen', 1, 'q', ['length', 'm']],
      ['open', 'Slits open', 'both', 'sel', [['both', 'both'], ['one', 'one']]], ['rate', 'Arrivals per second', 80, 'range', [1, 500, 1]]], v => calc(v));
    const pl = plotIn(L.plot, { x: { label: 'position on the screen (µm)' }, y: { label: 'relative probability', min: 0 } }, 200);
    let S = null, hits = [], acc = 0;
    const cv = canvasIn(L.extra, 150, (c, w, h) => {
      if (!S) return;
      const C = ui.colors();
      c.fillStyle = C.dark ? '#0b0f1a' : '#1b2233'; c.fillRect(0, 0, w, h - 24);
      c.fillStyle = 'hsl(150 90% 70% / .85)';
      for (let i = 0; i < hits.length; i++) { const u = hits[i]; c.fillRect(w / 2 + u.x * (w / 2) / S.half - 0.8, 6 + u.y * (h - 40), 1.6, 1.6); }
      c.fillStyle = C.muted; c.font = '12px ' + font(); c.textAlign = 'left';
      c.fillText(hits.length + ' arrived' + (hits.length >= 3000 ? ' (showing the last 3000)' : ''), 6, h - 8);
      c.textAlign = 'right'; c.fillText('screen width shown: ' + n3(2 * S.half, 3) + ' µm', w - 6, h - 8);
    });
    function calc(v) {
      const Qm = Q(), m = PARTICLES[v.kind][1];
      if (!(v.E > 0 && v.d > 0 && v.a > 0 && v.a < v.d && v.Ls > 0)) { L.stats.innerHTML = '<p class="muted">Positive sizes, with the slits narrower than their spacing.</p>'; S = null; return; }
      const p = m > 0 ? Math.sqrt(v.E * v.E + 2 * v.E * m * Qm.c * Qm.c) / Qm.c : v.E / Qm.c, lam = Qm.h / p;
      const f = Qm.slits({ n: v.open === 'both' ? 2 : 1, d: v.d, a: v.a, lambda: lam, L: v.Ls });
      const env = v.Ls * Math.tan(Math.asin(Math.min(0.999, lam / v.a))), half = Math.max(1.3 * env, 3 * lam * v.Ls / v.d) * 1e6;
      S = { half, f };
      const spacing = lam * v.Ls / v.d, speed = m > 0 ? p / Math.sqrt(m * m + p * p / (Qm.c * Qm.c)) : Qm.c;
      L.stats.innerHTML = stat('Wavelength λ = h/p', n3(lam * 1e12, 4) + ' pm', n3(lam * 1e9, 3) + ' nm', 'big') + stat('Fringe spacing λL/d', n3(spacing * 1e6, 4) + ' µm', v.open === 'both' ? 'about ' + f1(2 * v.d / v.a, 0) + ' fringes inside the central envelope' : 'one slit: no two-slit fringes') +
        stat('Momentum', n3(p, 4) + ' kg·m/s', m > 0 ? 'speed ' + n3(speed / Qm.c, 3) + ' c' : 'a photon: p = E/c') + stat('Width of the central envelope', n3(2 * env * 1e6, 4) + ' µm', '2Lλ/a, to the first zeros of each slit\'s diffraction');
      const pts = []; for (let i = 0; i <= 600; i++) { const x = -half + 2 * half * i / 600; pts.push([x, f(x * 1e-6)]); }
      pl.set({ series: [{ pts, label: v.open === 'both' ? '|φ₁ + φ₂|²' : 'one slit', fill: true }] });
      S.draw = Qm.sampler(u => f(u * 1e-6), -half, half, Qm.rng(7));
      hits = [];
      cv.paint();
    }
    calc(read());
    cv.animate(dt => {
      if (!S) return;
      acc += dt * read().rate;
      const R = Math.random;
      while (acc >= 1) { hits.push({ x: S.draw(), y: R() }); acc--; }
      if (hits.length > 3000) hits.splice(0, hits.length - 3000);
    });
  }

  /* ================================================================ SPACETIME */
  const PRESETS = {
    lightning: ['Lightning at both ends of a train', 'A, 0, -3\nB, 0, 3\nmiddle sees both, 3, 0'],
    causal: ['Cause and effect', 'cause, 0, 0\neffect, 4, 2\nelsewhere, 1, 4'],
    twins: ['The twin paradox (travel at the speed set below)', ''],
    custom: ['Your own events', 'E1, 1, 2\nE2, 3, -1']
  };
  function spacetime(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">A space-time diagram with time going up (as ct, so light travels at 45°) and space across. The grey axes are yours; the coloured, tilted axes belong to an observer moving at speed β = v/c. Lines of equal time for the mover tilt: events simultaneous for you are not simultaneous for them. The interval c²t² − x² between two events is the same for everyone.' +
      link('spacetime-geometry') + link('lorentz-transformation-feyn') + link('simultaneity-feyn') + '</p><div class="mcv" style="margin-bottom:12px"></div><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mextra"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el), extra = ui.$('.mextra', el);
    const top = document.createElement('div'); top.className = 'mform'; fEl.appendChild(top);
    const read = form(top, [['preset', 'Example', 'lightning', 'sel', Object.entries(PRESETS).map(([k, p]) => [k, p[0]])], ['beta', 'Speed of the moving observer β = v/c', 0.5, 'range', [-0.95, 0.95, 0.01]],
      ['grid', 'Show the moving observer\'s grid', true, 'check'], ['hyp', 'Show the invariant hyperbolae', true, 'check']], () => calc());
    const wrap = document.createElement('label'); wrap.className = 'mfield';
    wrap.innerHTML = '<span>Events: name, ct, x (units of your choice, c = 1)</span><textarea class="inp" rows="6" spellcheck="false" style="width:100%;height:auto;font-family:var(--font-mono);font-size:13px"></textarea>';
    fEl.appendChild(wrap);
    const ta = ui.$('textarea', wrap);
    let lastPreset = null, ev = [];
    ta.addEventListener('input', () => calc());
    const cv = canvasIn(ui.$('.mcv', el), 440, (c, w, h) => {
      const v = read(), C = ui.colors(), R = 6, s = Math.min(w, h) / (2 * R + 1), cx = w / 2, cy = h / 2, X = x => cx + x * s, Y = t => cy - t * s, b = v.beta, g = 1 / Math.sqrt(1 - b * b);
      c.font = '12px ' + font();
      // your grid and axes
      c.strokeStyle = C.border; c.lineWidth = 1;
      for (let k = -R; k <= R; k++) { c.beginPath(); c.moveTo(X(k), Y(-R)); c.lineTo(X(k), Y(R)); c.stroke(); c.beginPath(); c.moveTo(X(-R), Y(k)); c.lineTo(X(R), Y(k)); c.stroke(); }
      c.strokeStyle = C.muted; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(-R), Y(0)); c.lineTo(X(R), Y(0)); c.moveTo(X(0), Y(-R)); c.lineTo(X(0), Y(R)); c.stroke();
      c.fillStyle = C.muted; c.fillText('x', X(R) - 10, Y(0) - 6); c.fillText('ct', X(0) + 6, Y(R) + 12);
      // the light cone
      c.strokeStyle = 'hsl(48 95% 55%)'; c.lineWidth = 1.5; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(X(-R), Y(-R)); c.lineTo(X(R), Y(R)); c.moveTo(X(-R), Y(R)); c.lineTo(X(R), Y(-R)); c.stroke(); c.setLineDash([]);
      // hyperbolae of constant interval
      if (v.hyp) {
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (const k of [1, 2, 3, 4, 5]) for (const sg of [1, -1]) {
          c.beginPath(); for (let i = -60; i <= 60; i++) { const u = i / 20, t = sg * k * Math.cosh(u), x = k * Math.sinh(u); if (Math.abs(x) > R || Math.abs(t) > R) continue; c.lineTo(X(x), Y(t)); } c.stroke();
          c.beginPath(); for (let i = -60; i <= 60; i++) { const u = i / 20, x = sg * k * Math.cosh(u), t = k * Math.sinh(u); if (Math.abs(x) > R || Math.abs(t) > R) continue; c.lineTo(X(x), Y(t)); } c.stroke();
        }
      }
      // the moving observer's axes (ct′ along x = βct, x′ along ct = βx) and grid
      const col = C.accent;
      if (v.grid) {
        c.strokeStyle = 'hsl(22 85% 55% / .25)'; c.lineWidth = 1;
        for (let k = -R * 2; k <= R * 2; k++) {
          // lines of constant x′ = k: x = k/γ + βct ; lines of constant t′ = k: ct = k/γ + βx
          c.beginPath(); c.moveTo(X(k / g + b * -R), Y(-R)); c.lineTo(X(k / g + b * R), Y(R)); c.stroke();
          c.beginPath(); c.moveTo(X(-R), Y(k / g + b * -R)); c.lineTo(X(R), Y(k / g + b * R)); c.stroke();
        }
      }
      c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath(); c.moveTo(X(-R * b), Y(-R)); c.lineTo(X(R * b), Y(R)); c.moveTo(X(-R), Y(-R * b)); c.lineTo(X(R), Y(R * b)); c.stroke();
      c.fillStyle = col; c.fillText('ct′', X(R * b) + 6, Y(R) + 12); c.fillText('x′', X(R) - 16, Y(R * b) - 6);
      // the twin's journey, or the events
      if (v.preset === 'twins') {
        const T = 5, xm = b * T;
        c.strokeStyle = 'hsl(150 70% 45%)'; c.lineWidth = 3; c.beginPath(); c.moveTo(X(0), Y(-T)); c.lineTo(X(xm), Y(0)); c.lineTo(X(0), Y(T)); c.stroke();
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(X(0), Y(-T)); c.lineTo(X(0), Y(T)); c.stroke();
        c.fillStyle = C.text; c.fillText('stay-at-home twin', X(0) + 8, Y(-T) + 14); c.fillStyle = 'hsl(150 70% 40%)'; c.fillText('travelling twin', X(xm) + 8, Y(0));
      }
      for (const e of ev) {
        c.fillStyle = C.text; c.beginPath(); c.arc(X(e.x), Y(e.t), 5, 0, 6.283); c.fill();
        c.fillText(e.name, X(e.x) + 8, Y(e.t) - 6);
        // its moving-frame time, as a line of equal t′ through it
        c.strokeStyle = 'hsl(22 85% 55% / .7)'; c.setLineDash([3, 3]); c.beginPath(); const tp = g * (e.t - b * e.x);
        c.moveTo(X(-R), Y(tp / g + b * -R)); c.lineTo(X(R), Y(tp / g + b * R)); c.stroke(); c.setLineDash([]);
      }
    });
    function calc() {
      const v = read();
      if (v.preset !== lastPreset) { ta.value = PRESETS[v.preset][1]; lastPreset = v.preset; wrap.hidden = v.preset === 'twins'; }
      ev = ta.value.split('\n').map(l => l.split(',').map(s => s.trim())).filter(r => r.length >= 3 && Number.isFinite(+r[1]) && Number.isFinite(+r[2])).map(r => ({ name: r[0], t: +r[1], x: +r[2] }));
      const Lz = Q().lorentz(v.beta), g = Lz.gamma;
      if (v.preset === 'twins') {
        const T = 5, b = Math.abs(v.beta), home = 2 * T, away = 2 * T * Math.sqrt(1 - b * b);
        stats.innerHTML = stat('Stay-at-home twin ages', f1(home, 2), 'time units along a straight world line') + stat('Travelling twin ages', f1(away, 2), 'each leg: ' + f1(T, 1) + ' × √(1 − β²)', 'big') +
          stat('Difference', f1(home - away, 2), 'the straight world line between two events has the longest proper time') + stat('γ', f1(g, 3), '1/√(1 − β²)');
        extra.innerHTML = '';
      } else {
        stats.innerHTML = stat('γ', f1(g, 4), 'moving clocks run slow by this factor', 'big') + stat('Moving observer\'s axes', 'tilted by ' + f1(Math.atan(Math.abs(v.beta)) * 180 / Math.PI, 1) + '°', 'both towards the light line');
        const rows = ev.map(e => { const tp = Lz.t(e.x, e.t), xp = Lz.x(e.x, e.t), s2 = e.t * e.t - e.x * e.x; return '<tr><td style="text-align:left">' + esc(e.name) + '</td><td>' + f1(e.t, 2) + '</td><td>' + f1(e.x, 2) + '</td><td>' + f1(tp, 2) + '</td><td>' + f1(xp, 2) + '</td><td>' + f1(s2, 2) + (Math.abs(s2) < 1e-9 ? ' (light-like)' : s2 > 0 ? ' (time-like)' : ' (space-like)') + '</td></tr>'; });
        extra.innerHTML = ev.length ? '<div class="simtable mt"><table class="ftable"><thead><tr><th style="text-align:left">Event</th><th>ct</th><th>x</th><th>ct′</th><th>x′</th><th>c²t² − x² from the origin</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' +
          (ev.length >= 2 ? '<p class="small muted">Order in time for you: ' + ev.slice().sort((a, b) => a.t - b.t).map(e => esc(e.name)).join(' → ') + '; for the moving observer: ' + ev.slice().sort((a, b) => Lz.t(a.x, a.t) - Lz.t(b.x, b.t)).map(e => esc(e.name)).join(' → ') + '.</p>' : '') : '';
      }
      cv.paint();
    }
    calc();
  }


  /* ================================================================ FIELD LINES */
  const FPRESETS = {
    dipole: ['A dipole', [[-1.5, 0, 1], [1.5, 0, -1]]], pair: ['Two equal charges', [[-1.5, 0, 1], [1.5, 0, 1]]], quad: ['A quadrupole', [[-1.3, -1.3, 1], [1.3, 1.3, 1], [-1.3, 1.3, -1], [1.3, -1.3, -1]]],
    plates: ['A capacitor (two rows of charges)', [...Array(9)].map((_, i) => [-2.4 + 0.6 * i, 1.2, 1]).concat([...Array(9)].map((_, i) => [-2.4 + 0.6 * i, -1.2, -1]))],
    unequal: ['Charges +2 and −1', [[-1.2, 0, 2], [1.2, 0, -1]]], wires: ['Currents: two parallel wires', []], antiwires: ['Currents: opposite wires', []]
  };
  function fields(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Field lines start on positive charges and end on negative ones; their density shows the strength of the field, and they cross the equipotentials at right angles. Click in the picture to add a charge (or a current) of the chosen sign, or remove the nearest one. For currents the lines of B circle the wires and never end — the field has no divergence but plenty of curl.' +
      link('em-introduction') + link('gauss-law-feyn') + link('vector-calculus-fields') + '</p><div class="mcv" style="margin-bottom:12px"></div><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el);
    const read = form(fEl, [['preset', 'Start from', 'dipole', 'sel', Object.entries(FPRESETS).map(([k, p]) => [k, p[0]])], ['click', 'A click', '1', 'sel', [['1', 'adds +1'], ['-1', 'adds −1'], ['2', 'adds +2'], ['0', 'removes the nearest']]],
      ['lines', 'Field lines per unit charge', 12, 'range', [4, 24, 2]], ['eq', 'Show equipotentials', true, 'check'], ['arrows', 'Show field arrows', false, 'check']], () => { const v = read(); if (v.preset !== lastPreset) load(v.preset); cv.paint(); });
    let items = [], lastPreset = null, hover = null, mode = 'charges';
    function load(p) {
      lastPreset = p; mode = p === 'wires' || p === 'antiwires' ? 'currents' : 'charges';
      items = mode === 'currents' ? (p === 'wires' ? [{ x: -1.4, y: 0, q: 1 }, { x: 1.4, y: 0, q: 1 }] : [{ x: -1.4, y: 0, q: 1 }, { x: 1.4, y: 0, q: -1 }]) : FPRESETS[p][1].map(([x, y, q]) => ({ x, y, q }));
    }
    const R = 5;
    const cv = canvasIn(ui.$('.mcv', el), 440, (c, w, h) => {
      const v = read(), C = ui.colors(), Qm = Q(), s = Math.min(w, h) / (2 * R), cx = w / 2, cy = h / 2, X = x => cx + x * s, Y = y => cy - y * s, ymax = h / (2 * s), xmax = w / (2 * s);
      const qs = items.map(i => ({ x: i.x, y: i.y, q: i.q })), ws = items.map(i => ({ x: i.x, y: i.y, I: i.q }));
      const F = mode === 'charges' ? (x, y) => Qm.efield(qs, x, y) : (x, y) => Qm.wireB(ws, x, y);
      c.font = '12px ' + font();
      // equipotentials: contour the potential on a grid (marching squares, straight segments)
      if (v.eq && mode === 'charges' && qs.length) {
        const nx = 120, ny = Math.round(nx * h / w), gx = i => -xmax + 2 * xmax * i / nx, gy = j => -ymax + 2 * ymax * j / ny, V = [];
        for (let j = 0; j <= ny; j++) { const row = []; for (let i = 0; i <= nx; i++) row.push(Qm.potential(qs, gx(i), gy(j))); V.push(row); }
        c.strokeStyle = 'hsl(200 60% 55% / .55)'; c.lineWidth = 1;
        for (const lev of [-3, -2, -1.4, -1, -0.7, -0.45, -0.25, -0.1, 0, 0.1, 0.25, 0.45, 0.7, 1, 1.4, 2, 3]) {
          c.beginPath();
          for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
            const a = V[j][i] - lev, b = V[j][i + 1] - lev, d = V[j + 1][i] - lev, e = V[j + 1][i + 1] - lev, pts = [];
            const edge = (p, q, x0, y0, x1, y1) => { if ((p < 0) !== (q < 0)) { const t = p / (p - q); pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]); } };
            edge(a, b, gx(i), gy(j), gx(i + 1), gy(j)); edge(b, e, gx(i + 1), gy(j), gx(i + 1), gy(j + 1)); edge(e, d, gx(i + 1), gy(j + 1), gx(i), gy(j + 1)); edge(d, a, gx(i), gy(j + 1), gx(i), gy(j));
            if (pts.length >= 2) { c.moveTo(X(pts[0][0]), Y(pts[0][1])); c.lineTo(X(pts[1][0]), Y(pts[1][1])); }
            if (pts.length === 4) { c.moveTo(X(pts[2][0]), Y(pts[2][1])); c.lineTo(X(pts[3][0]), Y(pts[3][1])); }
          }
          c.stroke();
        }
      }
      // field arrows on a coarse grid
      if (v.arrows) {
        for (let y = -ymax + 0.4; y < ymax; y += 0.6) for (let x = -xmax + 0.4; x < xmax; x += 0.6) {
          const f = F(x, y), m = Math.hypot(f.x, f.y); if (!(m > 0)) continue;
          const L = Math.min(0.45, 0.12 + 0.25 * Math.log10(1 + m * 10)) * s;
          arrowHead(c, X(x) - f.x / m * L / 2, Y(y) + f.y / m * L / 2, X(x) + f.x / m * L / 2, Y(y) - f.y / m * L / 2, C.faint, 1);
        }
      }
      // field lines
      c.strokeStyle = C.text; c.lineWidth = 1.3;
      const out = (x, y) => Math.abs(x) > xmax + 1 || Math.abs(y) > ymax + 1;
      const near = (x, y, sign) => items.some(i => (sign == null || Math.sign(i.q) === sign) && Math.hypot(x - i.x, y - i.y) < 0.1);
      if (mode === 'charges') {
        const net = qs.reduce((a, q) => a + q.q, 0), from = net >= 0 ? 1 : -1;
        for (const q of qs) {
          if (Math.sign(q.q) !== from) continue;
          const n = Math.max(2, Math.round(v.lines * Math.abs(q.q)));
          for (let k = 0; k < n; k++) {
            const a = 2 * Math.PI * (k + 0.5) / n, pts = Qm.traceField(F, q.x + 0.12 * Math.cos(a), q.y + 0.12 * Math.sin(a), { step: 0.04, max: 900, backward: from < 0, stop: (x, y) => out(x, y) || near(x, y, -from) });
            c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))); c.stroke();
            if (pts.length > 40) { const m = Math.floor(pts.length / 3), [x0, y0] = pts[m], [x1, y1] = pts[m + 1]; const dir = from < 0 ? -1 : 1; arrowHead(c, X(x0), Y(y0), X(x0) + dir * (X(x1) - X(x0)) * 6, Y(y0) + dir * (Y(y1) - Y(y0)) * 6, C.text, 1.3); }
          }
        }
      } else {
        for (const wv of ws) for (const r0 of [0.35, 0.7, 1.1, 1.6, 2.3]) {
          const pts = Qm.traceField(F, wv.x + r0, wv.y, { step: 0.04, max: 1500, stop: (x, y) => out(x, y) });
          c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))); c.stroke();
        }
      }
      // the charges or wires
      for (const i of items) {
        const pos = i.q > 0;
        c.fillStyle = pos ? 'hsl(0 75% 55%)' : 'hsl(215 80% 55%)'; c.beginPath(); c.arc(X(i.x), Y(i.y), 9 + 2 * Math.min(3, Math.abs(i.q) - 1), 0, 6.283); c.fill();
        c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(mode === 'currents' ? (pos ? '•' : '×') : (pos ? '+' : '−') + (Math.abs(i.q) !== 1 ? Math.abs(i.q) : ''), X(i.x), Y(i.y) + 1);
        c.textAlign = 'left'; c.textBaseline = 'alphabetic';
      }
      if (hover) { c.strokeStyle = C.accent; c.beginPath(); c.arc(X(hover.x), Y(hover.y), 4, 0, 6.283); c.stroke(); }
      const net = items.reduce((a, i) => a + i.q, 0);
      stats.innerHTML = (mode === 'charges' ? stat('Net charge', String(net), net === 0 ? 'every line that leaves returns: the flux through a surface round everything is zero' : 'the flux through a surface round everything ∝ ' + net) : stat('Currents', items.map(i => i.q > 0 ? 'out of the page' : 'into the page').join(', '), 'B circles each wire; ∮B·ds ∝ the current enclosed')) +
        (hover ? stat(mode === 'charges' ? 'Field and potential here' : 'Field here', 'E = ' + n3(Math.hypot(F(hover.x, hover.y).x, F(hover.x, hover.y).y), 3) + (mode === 'charges' ? ', V = ' + n3(Qm.potential(qs, hover.x, hover.y), 3) : ''), 'in units with k = 1, distances as drawn') : '');
    });
    const toWorld = e => { const r = cv.cv.getBoundingClientRect(), s = Math.min(r.width, cv.h) / (2 * R); return { x: (e.clientX - r.left - r.width / 2) / s, y: -(e.clientY - r.top - cv.h / 2) / s }; };
    cv.cv.addEventListener('click', e => {
      const p = toWorld(e), q = +read().click;
      if (q === 0) { if (items.length) { let bi = 0; items.forEach((it, i) => { if (Math.hypot(it.x - p.x, it.y - p.y) < Math.hypot(items[bi].x - p.x, items[bi].y - p.y)) bi = i; }); items.splice(bi, 1); } }
      else items.push({ x: p.x, y: p.y, q: mode === 'currents' ? Math.sign(q) : q });
      cv.paint();
    });
    cv.cv.addEventListener('pointermove', e => { hover = toWorld(e); cv.paint(); });
    cv.cv.addEventListener('pointerleave', () => { hover = null; cv.paint(); });
    load('dipole'); cv.paint();
  }

  /* ================================================================ QUANTUM WELLS */
  const WELLS = {
    box: ['Infinite box (the walls of the grid)', () => 0], harmonic: ['Harmonic oscillator', (x, V0, w) => 0.5 * Math.pow((x - 10) / (w / 4), 2) * 2],
    finite: ['Finite square well', (x, V0, w) => Math.abs(x - 10) < w / 2 ? 0 : V0], double: ['Double well', (x, V0, w) => { const u = (x - 10) / (w / 2); return V0 * Math.pow(u * u - 1, 2); }],
    step: ['A step', (x, V0) => x > 10 ? V0 : 0], barrier: ['A barrier', (x, V0, w) => Math.abs(x - 10) < w / 8 ? V0 : 0],
    lattice: ['A row of atoms (periodic wells)', (x, V0, w) => (Math.abs(x - 10) < 8 ? V0 * (1 - Math.pow(Math.cos(Math.PI * (x - 10) / (w / 4)), 2)) : V0)]
  };
  function wells(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Stationary states of a particle in one dimension, in units where ħ = m = 1: the energies are the levels at which a wave function fits the potential with the right number of wiggles, dying away where the particle has too little energy to go. Or send a wave packet and watch it reflect, tunnel and spread.' +
      link('schrodinger-equation-feyn') + link('tunnelling-feyn') + link('electrons-in-crystals') + '</p><div class="mcv" style="margin-bottom:12px"></div><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el);
    const read = form(fEl, [['kind', 'Potential', 'finite', 'sel', Object.entries(WELLS).map(([k, p]) => [k, p[0]])], ['mode', 'Show', 'states', 'sel', [['states', 'stationary states'], ['beat', 'a mixture of the two lowest states (it sloshes)'], ['packet', 'a wave packet sent from the left']]],
      ['V0', 'Height of the potential', 3, 'range', [0.2, 12, 0.1]], ['w', 'Width', 6, 'range', [1, 16, 0.5]], ['n', 'Number of states', 5, 'range', [1, 10, 1]], ['k0', 'Packet momentum k₀ (energy k₀²/2)', 2.2, 'range', [0.3, 5, 0.1]]], () => reset());
    let S = null, t = 0;
    function reset() {
      const v = read(), Qm = Q(), Vf = x => WELLS[v.kind][1](x, v.V0, v.w);
      t = 0;
      if (v.mode === 'packet') {
        const w = Qm.wave1d({ N: 800, L: 20, V: Vf, dt: 0.004 }).setGaussian({ x0: 4, sigma: 0.7, k0: v.k0 });
        S = { mode: 'packet', w, Vf, E: v.k0 * v.k0 / 2 + 1 / (8 * 0.49) };
      } else {
        const e = Qm.eigen1d(Vf, { N: 500, L: 20, count: v.mode === 'beat' ? 2 : v.n });
        S = { mode: v.mode, e, Vf };
      }
      stats.innerHTML = S.mode === 'packet' ? '' : stat('Energies', S.e.E.slice(0, 6).map(E => f1(E, 3)).join(', '), 'ħ = m = 1; lowest first', 'big') + (S.e.E.length > 1 ? stat('Spacing of the two lowest', f1(S.e.E[1] - S.e.E[0], 4), S.mode === 'beat' ? 'sloshing period 2π/ΔE = ' + f1(2 * Math.PI / (S.e.E[1] - S.e.E[0]), 2) : 'in a double well this is the tunnelling splitting') : '');
    }
    const cv = canvasIn(ui.$('.mcv', el), 420, (c, w, h) => {
      if (!S) return;
      const C = ui.colors(), v = read(), X = x => 20 + (w - 40) * x / 20, emax = S.mode === 'packet' ? Math.max(v.V0, S.E) * 1.5 : Math.max(...S.e.E) * 1.25 + 0.5, Y = E => h - 24 - (h - 44) * E / emax;
      c.font = '12px ' + font();
      // the potential
      c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 400; i++) { const x = 20 * i / 400; c.lineTo(X(x), Y(Math.min(emax, S.Vf(x)))); } c.stroke();
      c.fillStyle = C.muted; c.fillText('V(x)', X(0.3), Y(Math.min(emax, S.Vf(0.3))) - 6);
      if (S.mode === 'states') {
        const amp = (h - 44) / emax * 0.9 * (emax / (S.e.E.length + 1)) / 1.2;
        S.e.E.forEach((E, k) => {
          const col = C.series[k % C.series.length];
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(0), Y(E)); c.lineTo(X(20), Y(E)); c.stroke(); c.setLineDash([]);
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); S.e.psi[k].forEach((p, j) => { const x = S.e.x[j]; j ? c.lineTo(X(x), Y(E) - p * amp * 0.35) : c.moveTo(X(x), Y(E) - p * amp * 0.35); }); c.stroke();
          c.fillStyle = col; c.fillText('n = ' + (k + 1) + '  E = ' + f1(E, 3), X(20) - 110, Y(E) - 4);
        });
      } else if (S.mode === 'beat') {
        const [E0, E1] = S.e.E, p0 = S.e.psi[0], p1 = S.e.psi[1], q = [];
        for (let j = 0; j < p0.length; j++) { const re = (p0[j] * Math.cos(E0 * t) + p1[j] * Math.cos(E1 * t)) / Math.SQRT2, im = -(p0[j] * Math.sin(E0 * t) + p1[j] * Math.sin(E1 * t)) / Math.SQRT2; q.push(re * re + im * im); }
        const top = Math.max(...q), base = (E0 + E1) / 2;
        c.fillStyle = C.accent; c.globalAlpha = 0.3; c.beginPath(); c.moveTo(X(0), Y(base)); q.forEach((p, j) => c.lineTo(X(S.e.x[j]), Y(base) - p / top * 120)); c.lineTo(X(20), Y(base)); c.fill(); c.globalAlpha = 1;
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); q.forEach((p, j) => j ? c.lineTo(X(S.e.x[j]), Y(base) - p / top * 120) : c.moveTo(X(S.e.x[j]), Y(base) - p / top * 120)); c.stroke();
        c.fillStyle = C.text; c.fillText('|ψ|² of (ψ₁ + ψ₂)/√2 at t = ' + f1(t, 1), X(0.5), 16);
      } else {
        const p = S.w.prob(), top = Math.max(0.3, ...p), base = Y(S.E);
        c.strokeStyle = C.faint; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(0), base); c.lineTo(X(20), base); c.stroke(); c.setLineDash([]);
        c.strokeStyle = 'hsl(210 85% 55% / .6)'; c.lineWidth = 1; c.beginPath(); for (let j = 0; j < p.length; j++) { const y = base - S.w.re[j] / Math.sqrt(top) * 60; j ? c.lineTo(X(S.w.x[j]), y) : c.moveTo(X(S.w.x[j]), y); } c.stroke();
        c.fillStyle = C.accent; c.globalAlpha = 0.35; c.beginPath(); c.moveTo(X(0), base); for (let j = 0; j < p.length; j++) c.lineTo(X(S.w.x[j]), base - p[j] / top * 120); c.lineTo(X(20), base); c.fill(); c.globalAlpha = 1;
        let right = 0; for (let j = 0; j < p.length; j++) if (S.w.x[j] > 10 + v.w / 8 + 0.2) right += p[j] * S.w.dx;
        stats.innerHTML = stat('Beyond the middle', f1(100 * right, 1) + ' %', 'the probability the particle has got past x = 10', 'big') + stat('Mean energy', f1(S.E, 2), 'k₀²/2 plus the spread of the packet; the potential height is ' + f1(v.V0, 1)) +
          (v.kind === 'barrier' ? stat('Plane-wave transmission', f1(100 * Q().barrierT({ E: v.k0 * v.k0 / 2, V0: v.V0, a: v.w / 4 }), 1) + ' %', 'exact result for a single energy k₀²/2') : '');
        c.fillStyle = C.text; c.fillText('|ψ|² (shaded) and the real part of ψ; t = ' + f1(t, 2), X(0.5), 16);
      }
    });
    reset();
    cv.animate(dt => {
      if (!S) return;
      if (S.mode === 'beat') t += dt * 2;
      if (S.mode === 'packet') { S.w.step(Math.max(1, Math.round(dt / S.w.dt / 2))); t += Math.max(1, Math.round(dt / S.w.dt / 2)) * S.w.dt; if (t > 14) reset(); }
    });
  }

  H.feynTools = { arrows, slits, spacetime, fields, wells };
})();
