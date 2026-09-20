/* lab.js — three sandboxes that each isolate one mechanism:
 *   1. the envelope condition, as an actual pair of partial derivatives
 *   2. rack generation, where undercut comes from
 *   3. the inverse problem: draw the ratio you want, get the gears
 */
'use strict';

/* ════════════════════════════════════ 1. the envelope condition ═══ */

function labEnvelope(cv, ctls, out) {
  const st = { phi: 1.1, s: 0.18, scan: true, shape: 'square' };
  let P = null;
  const build = () => {
    const vals = st.shape === 'square' ? { R: 1, n: 6 } : { A: 1, e: 0.35 };
    P = quickPair(st.shape, vals, { m: st.shape === 'square' ? 4 : 1, N: 480, M: 480, steps: 260 });
  };
  build();

  /* q(s, phi): gear-1 point s, seen from gear 2, at time phi */
  const q = (s, phi) => {
    const th = s * TAU, rr = rAt(P.prof1, th), phi2 = P.law.phi2(phi);
    const bx = rr * Math.cos(th), by = rr * Math.sin(th);
    const c1 = Math.cos(-phi), s1 = Math.sin(-phi);
    const wx = c1 * bx - s1 * by, wy = s1 * bx + c1 * by;
    const vx = wx - P.a, vy = wy;
    const c2 = Math.cos(-phi2), s2 = Math.sin(-phi2);
    return [c2 * vx - s2 * vy, s2 * vx + c2 * vy];
  };
  const cross = (s, phi) => {
    const h = 3e-4;
    const a0 = q(s - h, phi), a1 = q(s + h, phi);
    const b0 = q(s, phi - h), b1 = q(s, phi + h);
    const ds = [(a1[0] - a0[0]) / (2 * h), (a1[1] - a0[1]) / (2 * h)];
    const dp = [(b1[0] - b0[0]) / (2 * h), (b1[1] - b0[1]) / (2 * h)];
    return { ds, dp, z: ds[0] * dp[1] - ds[1] * dp[0] };
  };

  const sel = document.createElement('select');
  [['square', 'Rounded square'], ['ellipseF', 'Ellipse']].forEach(([k, n]) => {
    const o = document.createElement('option'); o.value = k; o.textContent = n; sel.appendChild(o);
  });
  sel.onchange = () => { st.shape = sel.value; build(); };
  const r0 = document.createElement('div'); r0.className = 'row'; r0.appendChild(sel); ctls.appendChild(r0);
  ctl(ctls, 'Time φ₁', 0, 6.28, 0.01, st.phi, (v) => { st.phi = v; });
  const sCtl = ctl(ctls, 'Point s', 0, 1, 0.001, st.s, (v) => { st.s = v; });
  ctlToggle(ctls, 'Sweep s automatically', true, (v) => { st.scan = v; });

  new Fig(cv, (F) => {
    const v = F.v, c = v.begin();
    if (st.scan) { st.s = (st.s + 0.0023) % 1; sCtl.set(st.s); }
    /* gear 1 sits a whole centre distance away in this frame, so the box has
       to reach that far or the interesting half of it falls off the canvas */
    const R2 = (P.a + rMax(P.prof1)) * 1.02;
    v.fit([-R2, -R2, R2, R2], 0.03);

    /* gear 1, in gear 2's frame, coloured by the sign of the cross product */
    const K = 300;
    for (let i = 0; i < K; i++) {
      const s0 = i / K, s1 = (i + 1) / K;
      const p0 = q(s0, st.phi), p1 = q(s1, st.phi);
      const z = cross((s0 + s1) / 2, st.phi).z;
      c.beginPath(); c.moveTo(v.x(p0[0]), v.y(p0[1])); c.lineTo(v.x(p1[0]), v.y(p1[1]));
      c.strokeStyle = z > 0 ? 'rgba(91,141,255,.9)' : 'rgba(255,176,32,.9)';
      c.lineWidth = 2.2; c.stroke();
    }
    fillPolar(v, P.r2, 0, 0, 0, 'rgba(46,196,182,.10)', 'rgba(46,196,182,.75)', 1.6);
    axle(v, [0, 0], '#2ec4b6');

    /* the two partial derivatives at the chosen point */
    const pt = q(st.s, st.phi), cr = cross(st.s, st.phi);
    const n1 = Math.hypot(cr.ds[0], cr.ds[1]) || 1, n2 = Math.hypot(cr.dp[0], cr.dp[1]) || 1;
    const L = R2 * 0.33;
    arrow(v, pt, [cr.ds[0] / n1 * L, cr.ds[1] / n1 * L], '#3ccf8e', 2.1, 8);
    arrow(v, pt, [cr.dp[0] / n2 * L, cr.dp[1] / n2 * L], '#ff5c7a', 2.1, 8);
    dot(v, pt, 4.2, '#e7eaf2', '#0c0f16');
    label(v, pt, '∂q/∂s', '#3ccf8e', 10 + cr.ds[0] / n1 * L * v.scale * 0 + 4, -12);
    label(v, pt, '∂q/∂φ₁', '#ff5c7a', 10, 14);

    const norm = cr.z / (n1 * n2);
    out.innerHTML =
      '<div class="kv"><span class="k">∂q/∂s × ∂q/∂φ₁</span><span class="v ' +
      (Math.abs(norm) < 0.04 ? 'ok' : '') + '">' + cr.z.toFixed(4) + '</span></div>' +
      '<div class="kv"><span class="k">normalised (sin of the angle)</span><span class="v ' +
      (Math.abs(norm) < 0.04 ? 'ok' : '') + '">' + norm.toFixed(4) + '</span></div>' +
      '<div class="kv"><span class="k">status</span><span class="v ' +
      (Math.abs(norm) < 0.04 ? 'ok' : 'warn') + '">' +
      (Math.abs(norm) < 0.04 ? 'touching — this is the envelope' : 'sweeping through') + '</span></div>';
  });
}

/* ═══════════════════════════════════════ 2. rack and undercut ═══ */

function labRack(cv, ctls, out) {
  const st = { z: 12, alpha: 20, x: 0, show: true };
  const m = 0.18;
  let R = null;

  /* The basic rack. The side facing the blank is the one that cuts, so it
     carries the 1.25 m height that becomes the gear's ROOT depth; the side
     facing away is 1.0 m and sets where the gear's TIP ends up. Flanks are
     straight at the pressure angle and cross the pitch line a quarter pitch
     either side of the tooth centre, giving the standard half-pitch tooth. */
  const rackPoly = (alpha, shift) => {
    const p = Math.PI * m, ta = Math.tan(alpha / DEG);
    const hA = 1.25 * m, hD = 1.0 * m, pts = [];
    for (let k = -3; k <= 3; k++) {
      const c = k * p;
      pts.push([c - p / 2, -hD], [c - p / 4 - hD * ta, -hD]);
      pts.push([c - p / 4 + hA * ta, hA], [c + p / 4 - hA * ta, hA]);
      pts.push([c + p / 4 + hD * ta, -hD], [c + p / 2, -hD]);
    }
    /* positive profile shift pulls the cutter AWAY from the blank centre,
       which here means downward, since the blank sits above the rack. */
    return pts.map(q => [q[0], q[1] - shift * m]);
  };

  const build = () => {
    const z = Math.round(st.z), rp = m * z / 2, rb = rp * Math.cos(st.alpha / DEG);
    const M = 1200, bin = TAU / M;
    const gen = new Float64Array(M).fill(Infinity);
    const rack = rackPoly(st.alpha, st.x);
    const steps = 900, pitchLen = Math.PI * m;
    /* The blank rolls on the rack. The blank turns to orientation -phi, so its
       pitch-circle surface at the contact point moves in -x at rp per unit phi,
       and the rack slides the same way for the contact not to slip.
       The cutter is periodic, so the slide is reduced modulo one pitch —
       otherwise it walks a whole circumference away and cuts nothing. */
    for (let k = 0; k < steps; k++) {
      const phi = (k / steps) * TAU;
      const slide = -((rp * phi) % pitchLen);
      const co = Math.cos(phi), si = Math.sin(phi);
      let prev = null;
      for (const q0 of rack) {
        const wx = q0[0] + slide, wy = q0[1] - rp;   /* rack point in the world */
        const bx = co * wx - si * wy, by = si * wx + co * wy;  /* → blank body frame */
        if (prev) rasterEdge(prev[0], prev[1], bx, by, gen, null, 0, bin);
        prev = [bx, by];
      }
    }
    const blank = rp + m * (1 + st.x);
    for (let i = 0; i < M; i++) gen[i] = Math.min(isFinite(gen[i]) ? gen[i] : blank, blank);
    /* Compare against the involute the rack is trying to cut. Only for the
       dashed overlay does the phase matter, and that is found by best fit
       over one tooth pitch, so it cannot be thrown off by a phase mistake. */
    const raw = involuteProfile({ z, m, alpha: st.alpha, x: st.x }, M);
    let bestD = 0, bestE = Infinity;
    for (let k = 0; k < 240; k++) {
      const d = k / 240 * TAU / z;
      let e = 0;
      for (let i = 0; i < M; i += 3) { const dv = rAt(raw, i * TAU / M - d) - gen[i]; e += dv * dv; }
      if (e < bestE) { bestE = e; bestD = d; }
    }
    const ideal = rotatePolar(raw, bestD);

    /* Undercut, measured properly: how much TOOTH THICKNESS the cutter took
       out of the flank, against the exact involute thickness at that radius.
       Both crossings are located so the answer does not depend on knowing
       exactly where the tooth centre is. */
    const al = st.alpha / DEG, invf = (A) => Math.tan(A) - A;
    const exactHalf = (r) =>
      (Math.PI / 2 + 2 * st.x * Math.tan(al)) / z + invf(al) - invf(Math.acos(clamp(rb / r, -1, 1)));
    let thC = 0, peak = -1;
    for (let i = 0; i < M; i++) if (gen[i] > peak) { peak = gen[i]; thC = i * TAU / M; }
    const crossAt = (r, dir) => {
      const step = TAU / M;
      for (let k = 1; k < M / 2; k++) {
        const v0 = rAt(gen, thC + dir * (k - 1) * step), v1 = rAt(gen, thC + dir * k * step);
        if (v0 >= r && v1 < r) return (k - 1 + (v0 - r) / (v0 - v1)) * step;
      }
      return NaN;
    };
    const baseFull = 2 * exactHalf(rb * 1.002);
    let lostMax = 0, reach = 1;
    for (let f = 1.002; f <= 1.3; f += 0.006) {
      const r = rb * f;
      if (r > blank * 0.99) break;
      const full = crossAt(r, 1) + crossAt(r, -1);
      if (!isFinite(full)) continue;
      const lost = 2 * exactHalf(r) - full;
      if (lost > lostMax) lostMax = lost;
      if (lost > baseFull * 0.01) reach = f;
    }
    const pct = lostMax / baseFull * 100;
    const cut = reach > 1.001;
    const zmin = 2 * (1 - st.x) / Math.pow(Math.sin(al), 2);
    R = { gen, ideal, rp, rb, blank, z, pct, reach, zmin };
    out.innerHTML =
      '<div class="kv"><span class="k">teeth</span><span class="v">' + z + '</span></div>' +
      '<div class="kv"><span class="k">undercut limit 2(1−x)/sin²α</span><span class="v">' + zmin.toFixed(1) + '</span></div>' +
      '<div class="kv"><span class="k">tooth thickness lost</span><span class="v ' +
      (cut ? (pct > 8 ? 'bad' : 'warn') : 'ok') + '">' + (cut ? pct.toFixed(1) + ' %' : 'none') + '</span></div>' +
      '<div class="kv"><span class="k">undercut reaches</span><span class="v">' +
      (cut ? reach.toFixed(2) + ' × base radius' : '—') + '</span></div>' +
      '<div class="kv"><span class="k">verdict</span><span class="v ' + (cut ? 'bad' : 'ok') + '">' +
      (cut ? 'undercut' : 'clean') + '</span></div>';
  };
  build();

  ctl(ctls, 'Teeth', 6, 30, 1, st.z, (v) => { st.z = v; build(); }, fmtInt);
  ctl(ctls, 'Pressure angle', 14, 28, 0.5, st.alpha, (v) => { st.alpha = v; build(); });
  ctl(ctls, 'Profile shift x', -0.3, 0.8, 0.01, st.x, (v) => { st.x = v; build(); });
  ctlToggle(ctls, 'Show the cutter', true, (v) => { st.show = v; });

  new Fig(cv, (F) => {
    const v = F.v, c = v.begin();
    const rp = R.rp, top = R.blank * 1.35;
    v.fit([-top, -top * 1.15, top, top * 0.75], 0.06);
    const phi = (F.t * 0.28) % TAU;

    /* world view: the blank turns to -phi, the cutter slides past underneath */
    fillPolar(v, R.gen, -phi, 0, 0, 'rgba(46,196,182,.14)', '#2ec4b6', 1.8);
    strokePolar(v, R.ideal, -phi, 0, 0, 'rgba(255,176,32,.55)', 1.2, [4, 4]);
    circle(v, [0, 0], rp, null, 'rgba(167,139,250,.45)', 1, [5, 4]);
    circle(v, [0, 0], R.rb, null, 'rgba(255,255,255,.18)', 1, [2, 3]);

    if (st.show) {
      const rack = rackPoly(st.alpha, st.x);
      const slide = -((rp * phi) % (Math.PI * m));
      c.beginPath();
      rack.forEach((q0, i) => {
        const x = q0[0] + slide, y = q0[1] - rp;
        i ? c.lineTo(v.x(x), v.y(y)) : c.moveTo(v.x(x), v.y(y));
      });
      c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 1.4; c.stroke();
      line(v, [-R.blank * 1.4, -rp], [R.blank * 1.4, -rp], 'rgba(167,139,250,.35)', 1, [5, 4]);
    }
    axle(v, [0, 0], '#2ec4b6');
    const ctx = v.ctx;
    ctx.font = '11px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#6b7488';
    ctx.fillText('dashed amber = the involute the rack is trying to cut', 10, 8);
  });
}

/* ══════════════════════════════════ 3. design the ratio itself ═══ */

function labRatio(cv, ctls, out) {
  const NK = 128;
  const st = { k: new Float64Array(NK).fill(1), turns: 1, a: 2.2, painting: false };
  let P = null;

  const presets = {
    constant: (u) => 1,
    sine: (u) => 1 + 0.55 * Math.cos(u * TAU),
    two: (u) => (u < 0.5 ? 1.7 : 0.6),
    quick: (u) => 0.55 + 1.5 * Math.pow(Math.max(0, Math.sin(u * Math.PI)), 3),
    ramp: (u) => 0.5 + 1.6 * u
  };
  const setPreset = (name) => {
    for (let i = 0; i < NK; i++) st.k[i] = Math.max(0.08, presets[name]((i + 0.5) / NK));
    build();
  };

  const build = () => {
    /* normalise so the pair closes: the integral of k must be 2*pi*turns */
    let sum = 0;
    for (let i = 0; i < NK; i++) sum += st.k[i];
    const mean = sum / NK, scale = st.turns / mean;
    const N = 480, c1 = new Float64Array(N), a = st.a;
    for (let i = 0; i < N; i++) {
      const kk = Math.max(0.03, rAt(st.k, i * TAU / N) * scale);
      c1[i] = a * kk / (1 + kk);
    }
    const law = buildLaw(c1, a);
    const M = 480;
    const mate = mateCentrode(c1, a, M, law);
    const span = TAU / Math.max(1e-6, law.ratio);
    const conj = conjugate(c1, law, a, M, span, 280);
    P = { c1, prof1: c1, a, law, mate, conj, span, M, r2: conj.r, ratio: law.ratio };
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < N; i++) { const kk = c1[i] / (a - c1[i]); lo = Math.min(lo, kk); hi = Math.max(hi, kk); }
    out.innerHTML =
      '<div class="kv"><span class="k">gear 2 turns per turn of gear 1</span><span class="v g2">' + law.ratio.toFixed(4) + '</span></div>' +
      '<div class="kv"><span class="k">ratio swing</span><span class="v">' + lo.toFixed(3) + ' – ' + hi.toFixed(3) + '</span></div>' +
      '<div class="kv"><span class="k">gear 1 radius</span><span class="v g1">' + rMin(c1).toFixed(3) + ' – ' + rMax(c1).toFixed(3) + '</span></div>' +
      '<div class="kv"><span class="k">closes</span><span class="v ok">exactly, by construction</span></div>';
  };
  setPreset('sine');

  /* the ratio strip: drag to draw */
  const strip = document.createElement('canvas');
  strip.style.cssText = 'width:100%;height:74px;display:block;background:#0d1017;border:1px solid #2a3040;border-radius:7px;margin-bottom:9px;cursor:crosshair;touch-action:none';
  ctls.appendChild(strip);
  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.innerHTML = '<b>Drag on the strip</b> to draw the gear ratio you want across one turn of gear 1. The shapes that deliver it appear above.';
  ctls.appendChild(hint);

  const paint = (e) => {
    const r = strip.getBoundingClientRect();
    const u = clamp((e.clientX - r.left) / r.width, 0, 1);
    const val = clamp((1 - (e.clientY - r.top) / r.height) * 2.4 + 0.08, 0.1, 2.4);
    const c = u * NK;
    for (let k = -3; k <= 3; k++) {
      const i = Math.round(c) + k; if (i < 0 || i >= NK) continue;
      const w = Math.max(0, 1 - Math.abs(k) / 3.5);
      st.k[i] = lerp(st.k[i], val, w * w);
    }
    build();
  };
  strip.addEventListener('pointerdown', (e) => { st.painting = true; strip.setPointerCapture(e.pointerId); paint(e); });
  strip.addEventListener('pointermove', (e) => { if (st.painting) paint(e); });
  strip.addEventListener('pointerup', () => { st.painting = false; });
  strip.addEventListener('pointercancel', () => { st.painting = false; });

  const bar = document.createElement('div'); bar.className = 'btnrow';
  [['Constant', 'constant'], ['Sine', 'sine'], ['Two-speed', 'two'], ['Quick return', 'quick']]
    .forEach(([n, k]) => ctlButton(bar, n, () => setPreset(k)));
  ctls.appendChild(bar);
  ctl(ctls, 'Turns of gear 2', 1, 4, 1, st.turns, (v) => { st.turns = v; build(); }, fmtInt);
  ctl(ctls, 'Centre distance', 1.4, 4, 0.02, st.a, (v) => { st.a = v; build(); });

  /* draw the strip each frame so the cursor tracks the animation */
  const drawStrip = (phase) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = strip.getBoundingClientRect();
    const w = Math.round(r.width), h = Math.round(r.height);
    if (strip.width !== w * dpr) { strip.width = w * dpr; strip.height = h * dpr; }
    const c = strip.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
    let sum = 0; for (let i = 0; i < NK; i++) sum += st.k[i];
    const scale = st.turns / (sum / NK);
    c.strokeStyle = '#2a3040'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, h - h / 2.4); c.lineTo(w, h - h / 2.4); c.stroke();
    c.beginPath();
    for (let i = 0; i < NK; i++) {
      const X = i / (NK - 1) * w, Y = h - (st.k[i] * scale) / 2.4 * h;
      i ? c.lineTo(X, Y) : c.moveTo(X, Y);
    }
    c.strokeStyle = '#2ec4b6'; c.lineWidth = 1.8; c.stroke();
    c.lineTo(w, h); c.lineTo(0, h); c.closePath();
    c.fillStyle = 'rgba(46,196,182,.12)'; c.fill();
    c.strokeStyle = 'rgba(231,234,242,.5)'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(phase * w, 0); c.lineTo(phase * w, h); c.stroke();
    c.font = '9.5px "Segoe UI",system-ui,sans-serif'; c.fillStyle = '#6b7488';
    c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('ω₂/ω₁', 4, 3);
    c.textAlign = 'right'; c.fillText('one turn of gear 1', w - 4, 3);
  };

  new Fig(cv, (F) => {
    const v = F.v; v.begin();
    fitPair(v, P);
    const phi1 = (F.t * 0.4) % P.span;
    drawPair(v, P, phi1, { centrodes: false });
    const rp = rAt(P.c1, phi1);
    dot(v, [rp, 0], 4.4, '#a78bfa', '#1a1030');
    drawStrip(wrap(phi1) / TAU);
  });
}

/* ── assemble the Lab tab ────────────────────────────────────────── */

const LABS = [
  {
    id: 'lab-env', title: 'The envelope condition, live',
    sub: 'Gear 1 drawn in gear 2’s frame, coloured by the sign of ∂q/∂s × ∂q/∂φ₁. Where the sign flips, the two partial derivatives line up, the curve stops sweeping and starts touching — and that point is on the mate.',
    build: labEnvelope
  },
  {
    id: 'lab-rack', title: 'Rack generation and undercut',
    sub: 'One straight-sided cutter makes every involute gear of a given module. Drop the tooth count below 2(1−x)/sin²α and the cutter’s corner starts eating the flank it just cut. Profile shift pulls it back out.',
    build: labRack
  },
  {
    id: 'lab-ratio', title: 'Inverse design: draw the ratio',
    sub: 'The forward problem is shape → ratio. This is the other way round: draw the speed ratio you want across one turn, and the pitch curves that deliver it are computed from r₁ = a·k/(1+k), rescaled so the pair closes.',
    build: labRatio
  }
];

function buildLab() {
  const host = document.getElementById('labgrid');
  host.innerHTML = '';
  for (const L of LABS) {
    const card = document.createElement('div'); card.className = 'labcard'; card.id = L.id;
    const h = document.createElement('h3'); h.textContent = L.title;
    const s = document.createElement('div'); s.className = 'sub'; s.textContent = L.sub;
    const cv = document.createElement('canvas');
    const ctl0 = document.createElement('div'); ctl0.className = 'ctl';
    const out = document.createElement('div');
    out.style.cssText = 'margin-top:11px;border-top:1px solid #232838;padding-top:8px';
    card.append(h, s, cv, ctl0);
    host.appendChild(card);
    /* controls first, readout underneath — build() appends into ctl0 */
    setTimeout(() => {
      try { L.build(cv, ctl0, out); } catch (e) { console.error(L.id, e); }
      ctl0.appendChild(out);
    }, 0);
  }
}
