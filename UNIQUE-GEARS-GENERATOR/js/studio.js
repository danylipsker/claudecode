/* studio.js — the workbench: pick a shape, get its mate, watch them run. */
'use strict';

const S = {
  shapeId: 'square',
  vals: {},
  smooth: 0.10,
  formulaSrc: '1 + 0.3*cos(3*t)',
  formulaFn: null,
  mode: 'roll',            /* roll | mesh */
  mateLobes: 4,            /* m : symmetry order wanted on gear 2 */
  ratioFree: 1,            /* used when gear 1 is round */
  z2: 18,                  /* mate tooth count for the involute preset */
  autoA: true,
  aManual: 2.4,
  teeth: { Z: 24, h: 0.055, profile: 'trapezoid', phase: 0 },
  clearance: 0.25,         /* root clearance, as a fraction of tooth height */
  frame: 'world',          /* world | g1 | g2 */
  ov: {
    grid: true, centrodes: true, pitch: true, contact: true, normals: true,
    path: true, sliding: false, ghosts: false, labels: true, blank: false
  },
  anim: { on: true, speed: 0.55, phi1: 0 },
  N: 1080, M: 1080
};

let model = null, view = null, needRebuild = true, lastT = 0;
const $ = (id) => document.getElementById(id);

/* ══════════════════════════════════════════════════════════ model ═══ */

function currentDef() { return SHAPE_BY_ID[S.shapeId]; }

function defaultVals(def) {
  const v = {};
  for (const p of def.params) v[p.k] = p.val;
  return v;
}

/** Symmetry order of gear 1's pitch curve, declared by the shape when it knows. */
function symOf(def, vals, centrode) {
  if (def.symOf) return def.symOf(vals);
  if (isRound(centrode)) return 0;
  return symmetryOrder(centrode);
}

function ratioInfo(def, vals, centrode) {
  if (def.special === 'involute') {
    return { kind: 'teeth', ratio: Math.round(vals.z) / Math.max(4, Math.round(S.z2)), sym: Math.round(vals.z) };
  }
  const n = symOf(def, vals, centrode);
  if (n === 0) return { kind: 'free', ratio: clamp(S.ratioFree, 0.12, 8), sym: 0 };
  return { kind: 'lobes', n, m: Math.max(1, Math.round(S.mateLobes)), ratio: n / Math.max(1, Math.round(S.mateLobes)), sym: n };
}

function rebuild() {
  const def = currentDef(), N = S.N, M = S.M;
  const extra = { formula: S.formulaFn };
  const built = buildShape(def, S.vals, N, S.smooth, extra);

  /* An involute gear supplies its own toothed profile; its pitch curve is a
     circle. Every other shape IS its own pitch curve until teeth are added. */
  let centrode1, profile1, meta = built.r.meta || null;
  if (def.special === 'involute') {
    centrode1 = new Float64Array(N).fill(meta ? meta.rp : rMax(built.r) * 0.9);
    profile1 = built.r;
  } else {
    centrode1 = built.r;
    profile1 = S.mode === 'mesh'
      ? addTeeth(centrode1, Math.round(S.teeth.Z), S.teeth.h, S.teeth.profile, S.teeth.phase, N)
      : centrode1;
  }

  const hasTeeth = profile1 !== centrode1;
  const hRef = hasTeeth ? (def.special === 'involute' ? S.vals.m : S.teeth.h) : 0;

  /* A real gear is cut by a tool taller than the gear it makes: that extra
     height is what leaves clearance at the bottom of the finished root. Ours
     is the same trick — sweep a gear 1 whose tips are extended by the
     clearance, while gear 1 itself keeps its true profile. The extension
     ramps in from the pitch line, so the working flanks are untouched. */
  let cutter1 = profile1;
  const clr = hasTeeth ? S.clearance * hRef : 0;
  if (clr > 0) {
    cutter1 = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const u = clamp((profile1[i] - centrode1[i]) / hRef, 0, 1);
      cutter1[i] = profile1[i] + clr * u * u * (3 - 2 * u);
    }
  }

  const ri = ratioInfo(def, S.vals, centrode1);
  const top = rMax(centrode1), topP = rMax(profile1);

  /* The centre distance only has to clear the PITCH curve — tooth tips are
     meant to reach past it, into the other gear's roots. */
  let a, aSolved = solveCenterDistance(centrode1, ri.ratio);
  if (S.autoA) { a = aSolved; }
  else { a = Math.max(S.aManual, top * 1.002); }

  const law = buildLaw(centrode1, a);
  const mate = mateCentrode(centrode1, a, M, law);
  const span = TAU / Math.max(1e-6, law.ratio);
  const steps = clamp(Math.round(span / TAU * 340), 220, 760);
  const conj = conjugate(cutter1, law, a, M, span, steps);

  /* Gear 2's tip is capped at its own pitch curve plus one tooth height. The
     material above that is only "somewhere gear 1 never went" — keeping it
     would just jam gear 2's tips into gear 1's roots. */
  const blank = a - rMin(cutter1);
  const r2 = Float64Array.from(conj.r);
  for (let i = 0; i < M; i++) {
    const cap = hasTeeth ? Math.min(blank, mate.r[i] + hRef) : blank;
    r2[i] = clamp(r2[i], 1e-3, cap);
  }

  model = {
    def, N, M, a, aSolved, law, ri, centrode1, profile1, cutter1, hRef, r2, mate, conj, meta,
    top, topP, span, steps, blank,
    degenerate: built.degenerate
  };
  model.dr2 = dPolarWide(r2, Math.max(2, Math.round(M / 340)));
  model.dc1 = dPolarWide(centrode1, Math.max(2, Math.round(N / 340)));

  /* ── diagnostics ──
     The interference check compares the mate the rolling ODE asks for against
     the mate the sweep can actually deliver. That only means anything while
     gear 1 IS its pitch curve: once teeth exist, gear 2's roots are supposed
     to sit inside its pitch curve, and the difference is tooth depth rather
     than interference. So it is reported for the Roll case only. */
  const nr = nearestRatio(law.ratio, 12);
  const closeErrDeg = Math.abs(law.total - TAU * nr.n / nr.d) * DEG;
  let interf = 0;
  if (!hasTeeth) for (let i = 0; i < M; i++) interf = Math.max(interf, mate.r[i] - conj.r[i]);
  model.diag = {
    ratio: law.ratio, nr, closeErrDeg, hasTeeth,
    closes: closeErrDeg < 0.35,
    interference: hasTeeth ? null : interf,
    interfPct: hasTeeth ? null : interf / a * 100,
    mateTeeth: !hasTeeth ? null
      : def.special === 'involute' ? Math.round(S.z2) : Math.round(S.teeth.Z) / law.ratio,
    tooClose: a <= top * 1.0005,
    coverage: conj.coverage
  };

  /* ── curves for the plots ── */
  const K = 200, pr = { phi: [], k: [], slide: [], press: [], nc: [] }, path = [];
  for (let i = 0; i < K; i++) {
    const p = span * i / (K - 1);
    const q = probe(model, p);
    pr.phi.push(p); pr.k.push(q.k);
    pr.slide.push(q.slide == null ? 0 : q.slide);
    pr.press.push(q.pressure == null ? NaN : q.pressure);
    pr.nc.push(q.live ? q.live.length : 0);
    /* the path of contact is where load-carrying contact actually happens,
       gathered in world coordinates as we sweep */
    if (q.live) for (const c of q.live) path.push(c.C);
  }
  model.curves = pr;
  /* contact ratio: how many tooth pairs are carrying load on average */
  model.diag.contactRatio = pr.nc.reduce((a, b) => a + b, 0) / K;

  /* Sliding and pressure angle repeat once per tooth, so sampling them over
     the whole cycle just aliases. Resolve one tooth engagement instead. */
  const z2 = model.diag.mateTeeth;
  model.toothSpan = hasTeeth && z2 >= 2 ? span / z2 : span;
  if (model.toothSpan < span * 0.999) {
    const t = { slide: [], press: [] };
    for (let i = 0; i < 160; i++) {
      const q = probe(model, model.toothSpan * i / 159);
      t.slide.push(q.slide == null ? 0 : q.slide);
      t.press.push(q.pressure == null ? NaN : q.pressure);
    }
    model.tcurves = t;
  } else model.tcurves = { slide: pr.slide, press: pr.press };

  model.path = path;

  needRebuild = false;
  refreshPanels();
  return model;
}

function scheduleRebuild() { needRebuild = true; }

/* ══════════════════════════════════════════════════════════ render ═══ */

const COL = {
  g1: '#ffb020', g1f: 'rgba(255,176,32,.13)', g1s: 'rgba(255,176,32,.55)',
  g2: '#2ec4b6', g2f: 'rgba(46,196,182,.13)', g2s: 'rgba(46,196,182,.55)',
  pitch: '#a78bfa', contact: '#ff5c7a', slide: '#5b8dff', dim: '#6b7488'
};

function rotAbout(p, ang, c) {
  if (!ang) return p;
  const co = Math.cos(ang), si = Math.sin(ang);
  const x = p[0] - c[0], y = p[1] - c[1];
  return [c[0] + co * x - si * y, c[1] + si * x + co * y];
}

function render() {
  if (!model || !view) return;
  const m = model, phi1 = S.anim.phi1, phi2 = m.law.phi2(phi1), a = m.a;

  /* Optional ride-along frames: spin the whole world so one gear sits still. */
  let Rg = 0, Cg = [0, 0];
  if (S.frame === 'g2') { Rg = -phi2; Cg = [a, 0]; }
  else if (S.frame === 'g1') { Rg = phi1; Cg = [0, 0]; }
  const mw = (p) => rotAbout(p, Rg, Cg);

  const O1 = mw([0, 0]), O2 = mw([a, 0]);
  const c = view.begin();

  if (S.ov.grid) grid(view, 'rgba(255,255,255,.035)', 'rgba(255,255,255,.07)');

  /* envelope family: gear 1 seen from gear 2, the curves the mate envelopes */
  if (S.ov.ghosts) {
    const nG = 44, stepK = m.conj.steps / nG;
    c.save(); c.globalAlpha = 0.34;
    for (let g = 0; g < nG; g++) {
      const k = Math.round(g * stepK) % m.conj.steps;
      const gp1 = m.conj.frames[k], gp2 = m.law.phi2(gp1);
      /* place gear 1 where it was at gp1, then carry it by gear 2's motion */
      const rot = -gp1 + (phi2 - gp2) + Rg;
      const cen = mw(rotAbout([0, 0], phi2 - gp2, [a, 0]));
      strokePolar(view, m.profile1, rot, cen[0], cen[1], 'rgba(255,176,32,.30)', 1);
    }
    c.restore();
  }

  /* blank circles */
  if (S.ov.blank) {
    circle(view, O1, m.topP, null, 'rgba(255,176,32,.22)', 1, [3, 4]);
    circle(view, O2, rMax(m.r2), null, 'rgba(46,196,182,.22)', 1, [3, 4]);
  }

  /* the two bodies */
  fillPolar(view, m.profile1, -phi1 + Rg, O1[0], O1[1], COL.g1f, COL.g1, 1.7);
  fillPolar(view, m.r2, phi2 + Rg, O2[0], O2[1], COL.g2f, COL.g2, 1.7);

  /* pitch curves */
  if (S.ov.centrodes) {
    strokePolar(view, m.centrode1, -phi1 + Rg, O1[0], O1[1], COL.g1s, 1.2, [5, 4]);
    strokePolar(view, m.mate.r, phi2 + Rg, O2[0], O2[1], COL.g2s, 1.2, [5, 4]);
  }

  /* line of centres */
  line(view, O1, O2, 'rgba(255,255,255,.16)', 1, [6, 5]);
  axle(view, O1, COL.g1);
  axle(view, O2, COL.g2);

  const q = probe(m, phi1);

  /* path of contact */
  if (S.ov.path && m.path.length) {
    c.save();
    c.fillStyle = 'rgba(255,92,122,.5)';
    for (let i = 0; i < m.path.length; i++) {
      const p = mw(m.path[i]);
      c.beginPath(); c.arc(view.x(p[0]), view.y(p[1]), 1.5, 0, TAU); c.fill();
    }
    c.restore();
  }

  /* the pitch point — the fixed point of the whole theory */
  if (S.ov.pitch) {
    const P = mw(q.P);
    dot(view, P, 4.6, COL.pitch, '#1a1030');
    /* only caption it when there is room; on a small view it lands on top
       of gear 1's own label */
    if (S.ov.labels && Math.abs(q.rp1) * view.scale > 54) {
      label(view, P, 'pitch point', COL.pitch, -9, -13, null, 'right');
    }
  }

  /* contacts, common normals, sliding.
     Live contacts carry load; grazing ones are tips brushing the roots they
     cut, and are drawn faintly so they read as different. */
  const slideScale = 0.30 / Math.max(0.2, Math.max(...m.tcurves.slide));
  for (const ct of q.contacts) {
    const C = mw(ct.C);
    const n = rotAbout(ct.n, Rg, [0, 0]);
    if (S.ov.normals && ct.live) {
      const L = m.a * 0.55;
      line(view, [C[0] - n[0] * L, C[1] - n[1] * L], [C[0] + n[0] * L, C[1] + n[1] * L],
        'rgba(255,92,122,.42)', 1, [4, 4]);
    }
    if (S.ov.contact) {
      if (ct.live) dot(view, C, 3.6, COL.contact, 'rgba(10,12,18,.9)');
      else dot(view, C, 2.2, 'rgba(255,92,122,.28)');
    }
    if (S.ov.sliding && ct.live && ct.slide > 1e-6) {
      const vs = rotAbout(ct.vs, Rg, [0, 0]);
      arrow(view, C, [vs[0] * slideScale, vs[1] * slideScale], COL.slide, 1.8, 7);
    }
  }
  if (S.ov.labels) {
    label(view, O1, 'gear 1', COL.g1, 0, -14, '11.5px "Segoe UI",system-ui,sans-serif', 'center');
    label(view, O2, 'gear 2', COL.g2, 0, -14, '11.5px "Segoe UI",system-ui,sans-serif', 'center');
  }

  updateLive(q);
}

/* Set while the canvas has not been laid out yet, so the frame loop can try
   again. Fitting against a 1x1 canvas yields a scale near zero and the gears
   end up invisible, which is exactly what happened on a cold load. */
let fitPending = true;

function fitView() {
  if (!model || !view) return;
  view.resize();
  if (view.w < 40 || view.h < 40) { fitPending = true; return; }
  const a = model.a, r1 = model.topP, r2 = rMax(model.r2);
  const pad = Math.max(r1, r2) * 1.12;
  view.fit([-r1 * 1.12, -pad, a + r2 * 1.12, pad], 0.07);
  if (fitPending) { fitPending = false; applyNarrow(); }
}

/* The panel overlays the stage below this width, so it starts hidden there.
   Decided from a media query rather than a one-shot innerWidth read at start-up,
   which can be taken before the window has settled. */
const narrowMQ = window.matchMedia('(max-width: 880px)');
function applyNarrow() {
  const el = document.getElementById('sideL');
  if (el) el.classList.toggle('hide', narrowMQ.matches);
}

/* ══════════════════════════════════════════════════════ animation ═══ */

function frame(t) {
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0);
  lastT = t;
  if (needRebuild) { try { rebuild(); } catch (e) { console.error(e); needRebuild = false; } }
  if (S.anim.on && model) {
    S.anim.phi1 = (S.anim.phi1 + dt * S.anim.speed) % (model.span || TAU);
  }
  view.resize();
  if (fitPending) fitView();
  render();
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════════════════════════════ panels ═══ */

function refreshPanels() {
  buildParams();
  updateReadout();
  updatePlots();
  updateAlerts();
  syncPairingUI();
}

function updateLive(q) {
  if (!model) return;
  const set = (id, v, cls) => {
    const el = $(id); if (!el) return;
    el.textContent = v;
    if (cls !== undefined) el.className = 'v ' + (cls || '');
  };
  set('lvPhi', (wrap(S.anim.phi1) * DEG).toFixed(1) + '°', 'g1');
  set('lvPhi2', (wrap(q.phi2) * DEG).toFixed(1) + '°', 'g2');
  set('lvK', q.k.toFixed(4));
  set('lvRp', q.rp1.toFixed(3) + ' / ' + q.rp2.toFixed(3));
  set('lvSlide', q.slide == null ? '—' : q.slide.toFixed(3));
  set('lvPress', q.pressure == null ? '—' : q.pressure.toFixed(1) + '°');
  /* shown relative to the centre distance, so the number means the same
     thing whatever scale the shapes are drawn at */
  set('lvMiss', q.miss == null ? '—' : (q.miss / model.a).toExponential(1) + ' × a',
    q.miss == null ? '' : (q.miss < model.a * 8e-3 ? 'ok' : 'warn'));
  set('lvContacts', (q.live ? q.live.length : 0) +
    (q.contacts.length > (q.live ? q.live.length : 0) ? ' (+' + (q.contacts.length - q.live.length) + ' grazing)' : ''));
  updatePlots(true);
}

function updateReadout() {
  const m = model, d = m.diag;
  const set = (id, v, cls) => { const el = $(id); if (el) { el.textContent = v; if (cls !== undefined) el.className = 'v ' + (cls || ''); } };
  set('roRatio', d.ratio.toFixed(5), 'g2');
  set('roRatioF', d.closes ? d.nr.n + ' : ' + d.nr.d : '—', d.closes ? 'ok' : 'bad');
  set('roA', m.a.toFixed(4));
  set('roSym', m.ri.sym === 0 ? 'round' : String(m.ri.sym), 'g1');
  set('roR1', rMin(m.centrode1).toFixed(3) + ' – ' + rMax(m.centrode1).toFixed(3), 'g1');
  set('roR2', rMin(m.mate.r).toFixed(3) + ' – ' + rMax(m.mate.r).toFixed(3), 'g2');
  set('roClose', d.closeErrDeg < 0.01 ? '< 0.01°' : d.closeErrDeg.toFixed(2) + '°',
    d.closes ? 'ok' : 'bad');
  /* the same slot carries whichever check is meaningful for the current mode */
  const lblI = $('roInterfLbl');
  if (d.hasTeeth) {
    if (lblI) lblI.textContent = 'contact ratio';
    set('roInterf', d.contactRatio.toFixed(2), d.contactRatio >= 1.15 ? 'ok' : d.contactRatio >= 1 ? 'warn' : 'bad');
  } else {
    if (lblI) lblI.textContent = 'interference removed';
    set('roInterf', d.interfPct.toFixed(2) + ' %', d.interfPct < 0.15 ? 'ok' : d.interfPct < 1.5 ? 'warn' : 'bad');
  }
  set('roTeeth', d.mateTeeth == null ? '—' : d.mateTeeth.toFixed(2),
    d.mateTeeth == null ? '' : (Math.abs(d.mateTeeth - Math.round(d.mateTeeth)) < 0.02 ? 'ok' : 'warn'));
  const kmin = Math.min(...m.curves.k), kmax = Math.max(...m.curves.k);
  set('roKrange', kmin.toFixed(3) + ' – ' + kmax.toFixed(3));
}

let plotT = 0;
function updatePlots(liveOnly) {
  if (!model) return;
  const now = performance.now();
  if (liveOnly && now - plotT < 60) return;
  plotT = now;
  const m = model, cur = wrap(S.anim.phi1) / m.span;
  const tcur = (wrap(S.anim.phi1) % m.toothSpan) / m.toothSpan;
  plot($('plotK'), [{ data: m.curves.k, color: COL.g2, fill: 'rgba(46,196,182,.10)' }],
    { cursor: cur, note: 'ratio ω₂/ω₁' });
  plot($('plotSlide'), [{ data: m.tcurves.slide, color: COL.slide, fill: 'rgba(91,141,255,.10)' }],
    { cursor: tcur, lo: 0, note: 'sliding speed' });
  const pr = m.tcurves.press.filter(v => !isNaN(v));
  /* fixed 0-90 axis: a pressure angle lives in that range, and auto-scaling
     turns a constant 20 degrees (or rolling contact's 90) into visual noise */
  plot($('plotPress'), [{ data: m.tcurves.press.map(v => isNaN(v) ? (pr[0] || 0) : v), color: COL.contact }],
    { cursor: tcur, lo: 0, hi: 90, note: 'pressure angle °' });
  const lbl = m.toothSpan < m.span * 0.999 ? 'over one tooth' : 'over one cycle';
  $('lblSlide').textContent = lbl; $('lblPress').textContent = lbl;
}

function updateAlerts() {
  const b = $('banner'); b.innerHTML = '';
  const m = model, d = m.diag;
  const add = (cls, ic, html, btn, fn) => {
    const el = document.createElement('div');
    el.className = 'alert ' + cls;
    el.innerHTML = '<span class="ic">' + ic + '</span><span>' + html + '</span>';
    if (btn) {
      const bt = document.createElement('button'); bt.textContent = btn;
      bt.onclick = fn; el.appendChild(bt);
    }
    b.appendChild(el);
  };

  if (m.degenerate) add('bad', '!', 'This shape reaches zero or negative radius. It cannot turn about that centre — clamped so you can still see it.');
  if (d.tooClose) add('bad', '!', 'The gears overlap: the centre distance is smaller than gear 1&rsquo;s outer radius.', 'Fix', () => { S.autoA = true; scheduleRebuild(); });

  if (!d.closes) {
    add('', '↻', 'The mate does not close up: gear 2 turns <b>' + d.ratio.toFixed(4) +
      '</b> times per turn of gear 1, so its two ends miss by <b>' + d.closeErrDeg.toFixed(1) +
      '°</b>. Only whole-number lobe counts can close.',
      'Solve centre distance', () => { S.autoA = true; scheduleRebuild(); });
  } else if (d.hasTeeth && d.contactRatio < 1) {
    add('', '⚠', 'Contact ratio is <b>' + d.contactRatio.toFixed(2) +
      '</b>: for part of every cycle nothing is touching, so the drive would rattle. Use more teeth, or taller ones.');
  } else if (!d.hasTeeth && d.interfPct > 1.5) {
    add('bad', '✖', 'Interference: gear 1 sweeps <b>' + d.interfPct.toFixed(1) +
      '%</b> of the centre distance into where the ideal mate should be, so the real mate has been cut away. ' +
      'Soften the corners or use fewer lobes on gear 2.',
      'Smooth it', () => { S.smooth = Math.min(0.5, S.smooth + 0.09); scheduleRebuild(); });
  } else if (!d.hasTeeth && d.interfPct > 0.15) {
    add('', '⚠', 'Slight undercut: <b>' + d.interfPct.toFixed(2) + '%</b> of the ideal mate had to be removed for clearance.');
  }

  if (S.mode === 'mesh' && d.mateTeeth != null && Math.abs(d.mateTeeth - Math.round(d.mateTeeth)) > 0.02) {
    const want = Math.round(d.mateTeeth);
    add('', '#', 'Gear 2 works out to <b>' + d.mateTeeth.toFixed(2) + '</b> teeth. For the teeth to line up every turn it must be a whole number.',
      'Use ' + want, () => {
        S.teeth.Z = Math.max(3, Math.round(want * model.law.ratio));
        scheduleRebuild();
      });
  }
}

/* ══════════════════════════════════════════════════════════════ UI ═══ */

function tile(def) {
  const el = document.createElement('div');
  el.className = 'tile' + (def.id === S.shapeId ? ' sel' : '');
  el.title = def.name + ' — ' + def.blurb;
  const cv = document.createElement('canvas');
  cv.width = 96; cv.height = 96;
  el.appendChild(cv);
  const sp = document.createElement('span'); sp.textContent = def.name;
  el.appendChild(sp);
  /* thumbnail: the shape at its default parameters */
  const c = cv.getContext('2d');
  const vals = defaultVals(def);
  let r;
  try {
    r = buildShape(def, vals, 240, def.special === 'drawn' ? 0.1 : 0.05,
      { formula: (t) => 1 + 0.3 * Math.cos(3 * t) }).r;
  } catch (e) { r = new Float64Array(240).fill(1); }
  const top = rMax(r), s = 38 / top;
  c.translate(48, 48);
  c.beginPath();
  for (let i = 0; i <= 240; i++) {
    const t = (i % 240) * TAU / 240, rr = r[i % 240];
    const X = rr * Math.cos(t) * s, Y = -rr * Math.sin(t) * s;
    if (i === 0) c.moveTo(X, Y); else c.lineTo(X, Y);
  }
  c.closePath();
  c.fillStyle = def.id === S.shapeId ? 'rgba(255,176,32,.20)' : 'rgba(255,255,255,.055)';
  c.fill();
  c.strokeStyle = def.id === S.shapeId ? '#ffb020' : '#7b8499';
  c.lineWidth = 1.5; c.stroke();
  c.beginPath(); c.arc(0, 0, 1.8, 0, TAU); c.fillStyle = '#98a1b5'; c.fill();

  el.onclick = () => selectShape(def.id);
  return el;
}

function buildGallery() {
  const g = $('gallery'); g.innerHTML = '';
  for (const def of SHAPES) g.appendChild(tile(def));
}

function selectShape(id) {
  S.shapeId = id;
  const def = SHAPE_BY_ID[id];
  S.vals = defaultVals(def);
  if (def.special === 'formula') compileFormula();
  /* a sensible starting mate for the new symmetry */
  const probe1 = buildShape(def, S.vals, 360, S.smooth, { formula: S.formulaFn }).r;
  const n = symOf(def, S.vals, probe1);
  if (n > 0) S.mateLobes = n;
  S.autoA = true;
  $('shapeBlurb').textContent = def.blurb;
  $('customFormula').style.display = def.special === 'formula' ? '' : 'none';
  $('customDraw').style.display = def.special === 'drawn' ? '' : 'none';
  buildGallery();
  scheduleRebuild();
  setTimeout(() => { if (model) fitView(); }, 30);
}

function sliderRow(p, get, set, fmt) {
  const row = document.createElement('div'); row.className = 'row';
  const lab = document.createElement('label');
  lab.textContent = p.label; lab.title = p.tip || p.label;
  const rng = document.createElement('input');
  rng.type = 'range'; rng.min = p.min; rng.max = p.max; rng.step = p.step; rng.value = get();
  const num = document.createElement('input');
  num.type = 'text'; num.className = 'num'; num.value = (fmt || ((v) => v))(get());
  rng.oninput = () => { set(parseFloat(rng.value)); num.value = (fmt || ((v) => v))(get()); scheduleRebuild(); };
  num.onchange = () => {
    const v = parseFloat(num.value);
    if (isFinite(v)) { set(clamp(v, p.min, p.max)); rng.value = get(); }
    num.value = (fmt || ((v2) => v2))(get());
    scheduleRebuild();
  };
  row.append(lab, rng, num);
  return row;
}

const fmt3 = (v) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(3).replace(/0+$/, '').replace(/\.$/, ''));
const fmtInt = (v) => String(Math.round(v));

function buildParams() {
  const host = $('params');
  const def = currentDef();
  const sig = def.id + '|' + def.params.map(p => p.k).join(',');
  if (host.dataset.sig === sig) return;      /* keep DOM stable while dragging */
  host.dataset.sig = sig;
  host.innerHTML = '';
  for (const p of def.params) {
    host.appendChild(sliderRow(p,
      () => S.vals[p.k],
      (v) => { S.vals[p.k] = v; },
      p.step >= 1 ? fmtInt : fmt3));
  }
  host.appendChild(sliderRow(
    { k: 'smooth', label: 'Smoothing', min: 0, max: 0.5, step: 0.005, tip: 'Rounds every corner. A corner with no radius is a corner no mate can follow.' },
    () => S.smooth, (v) => { S.smooth = v; }, fmt3));
}

function syncPairingUI() {
  const ri = model.ri;
  $('rowLobes').style.display = ri.kind === 'lobes' ? '' : 'none';
  $('rowFree').style.display = ri.kind === 'free' ? '' : 'none';
  $('rowZ2').style.display = ri.kind === 'teeth' ? '' : 'none';
  $('ratioTxt').innerHTML = ri.kind === 'lobes'
    ? '<b>' + ri.n + '</b> lobes on gear 1 &rarr; <b>' + ri.m + '</b> on gear 2, so gear 2 turns <b>' + (ri.n / ri.m).toFixed(3) + '&times;</b>'
    : ri.kind === 'teeth'
      ? '<b>' + Math.round(S.vals.z) + '</b> teeth &rarr; <b>' + Math.round(S.z2) + '</b> teeth, ratio <b>' + ri.ratio.toFixed(3) + '</b>'
      : 'Gear 1 is round: any ratio closes.';
  /* keep the inputs in step with the state, so a value set from anywhere
     other than its own slider still shows up */
  $('lobesRng').value = S.mateLobes; $('lobesNum').value = Math.round(S.mateLobes);
  $('freeRng').value = S.ratioFree; $('freeNum').value = S.ratioFree.toFixed(3);
  $('z2Rng').value = S.z2; $('z2Num').value = Math.round(S.z2);
  $('autoA').checked = S.autoA;
  $('tZRng').value = S.teeth.Z; $('tZNum').value = Math.round(S.teeth.Z);
  $('tHRng').value = S.teeth.h; $('tHNum').value = S.teeth.h.toFixed(3);
  $('tCRng').value = S.clearance; $('tCNum').value = S.clearance.toFixed(3);
  $('tProfile').value = S.teeth.profile;

  /* keep the slider's range around whatever the solved distance turned out
     to be, so manual mode always starts somewhere useful */
  const sl = $('aSlider');
  sl.min = (model.top * 1.01).toFixed(3);
  sl.max = (Math.max(model.aSolved, model.a) * 2.2 + model.top).toFixed(3);
  sl.value = model.a;
  $('aNum').value = model.a.toFixed(3);
  sl.disabled = S.autoA;
  $('aNum').disabled = S.autoA;
  /* the tooth-shape controls belong to the generic path; an involute gear
     brings its own tooth form, but still wants a clearance */
  const inv = currentDef().special === 'involute';
  $('teethSect').style.display = (S.mode === 'mesh' || inv) ? '' : 'none';
  $('teethRows').style.display = inv ? 'none' : '';
  $('rowProfile').style.display = inv ? 'none' : '';
}

function compileFormula() {
  const err = $('formulaErr');
  try {
    S.formulaFn = compilePolar(S.formulaSrc);
    err.textContent = '';
  } catch (e) {
    err.textContent = e.message;
    if (!S.formulaFn) S.formulaFn = (t) => 1 + 0.3 * Math.cos(3 * t);
  }
  scheduleRebuild();
}

function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ── drawing a shape by hand ─────────────────────────────────────── */
let drawing = false;
function bindDrawTool() {
  view.onDown = (e) => {
    if (currentDef().special !== 'drawn' || !$('drawArm').classList.contains('on')) return false;
    drawing = true; paintAt(e); return true;
  };
  view.onMove = (e) => { if (drawing) paintAt(e); };
  view.onUp = () => { drawing = false; };
}
function paintAt(e) {
  const rect = view.cv.getBoundingClientRect();
  const x = view.wx(e.clientX - rect.left), y = view.wy(e.clientY - rect.top);
  const rad = Math.hypot(x, y), th = Math.atan2(y, x);
  if (rad < 0.03) return;
  Drawn.paint(th, rad / (S.vals.R || 1), 0.10);
  scheduleRebuild();
}

/* ══════════════════════════════════════════════════════════════ go ═══ */

function initStudio() {
  const def = SHAPE_BY_ID[S.shapeId];
  S.vals = defaultVals(def);
  compileFormula();
  $('shapeBlurb').textContent = def.blurb;

  view = new View($('cv'));
  bindDrawTool();
  buildGallery();
  rebuild();
  view.resize();
  fitView();

  /* ── collapsible sections ── */
  document.querySelectorAll('.sect>h3').forEach(h => {
    h.onclick = () => h.parentElement.classList.toggle('closed');
  });

  /* ── mode ── */
  document.querySelectorAll('[data-mode]').forEach(b => {
    b.onclick = () => {
      S.mode = b.dataset.mode;
      document.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x === b));
      scheduleRebuild();
    };
  });
  document.querySelectorAll('[data-frame]').forEach(b => {
    b.onclick = () => {
      S.frame = b.dataset.frame;
      document.querySelectorAll('[data-frame]').forEach(x => x.classList.toggle('on', x === b));
    };
  });

  /* ── pairing ── */
  $('lobesRng').oninput = (e) => { S.mateLobes = parseInt(e.target.value, 10); $('lobesNum').value = S.mateLobes; scheduleRebuild(); };
  $('lobesNum').onchange = (e) => { S.mateLobes = clamp(parseInt(e.target.value, 10) || 1, 1, 16); $('lobesRng').value = S.mateLobes; scheduleRebuild(); };
  $('freeRng').oninput = (e) => { S.ratioFree = parseFloat(e.target.value); $('freeNum').value = S.ratioFree.toFixed(3); scheduleRebuild(); };
  $('freeNum').onchange = (e) => { const v = parseFloat(e.target.value); if (isFinite(v)) { S.ratioFree = clamp(v, 0.12, 8); $('freeRng').value = S.ratioFree; } scheduleRebuild(); };
  $('z2Rng').oninput = (e) => { S.z2 = parseInt(e.target.value, 10); $('z2Num').value = S.z2; scheduleRebuild(); };
  $('z2Num').onchange = (e) => { S.z2 = clamp(parseInt(e.target.value, 10) || 12, 4, 80); $('z2Rng').value = S.z2; scheduleRebuild(); };

  $('autoA').onchange = (e) => { S.autoA = e.target.checked; if (!S.autoA) S.aManual = model.a; scheduleRebuild(); };
  $('aSlider').oninput = (e) => { S.aManual = parseFloat(e.target.value); $('aNum').value = S.aManual.toFixed(3); scheduleRebuild(); };
  $('aNum').onchange = (e) => { const v = parseFloat(e.target.value); if (isFinite(v)) S.aManual = v; scheduleRebuild(); };
  $('solveA').onclick = () => { S.autoA = true; $('autoA').checked = true; scheduleRebuild(); toast('Centre distance solved so the pair closes exactly.'); };

  /* ── teeth ── */
  const bindT = (rng, num, key, int, lo, hi) => {
    $(rng).oninput = (e) => { S.teeth[key] = parseFloat(e.target.value); $(num).value = int ? Math.round(S.teeth[key]) : S.teeth[key].toFixed(3); scheduleRebuild(); };
    $(num).onchange = (e) => { const v = parseFloat(e.target.value); if (isFinite(v)) { S.teeth[key] = clamp(v, lo, hi); $(rng).value = S.teeth[key]; } scheduleRebuild(); };
  };
  bindT('tZRng', 'tZNum', 'Z', true, 3, 90);
  bindT('tHRng', 'tHNum', 'h', false, 0, 0.3);
  bindT('tPRng', 'tPNum', 'phase', false, 0, 1);
  $('tProfile').onchange = (e) => { S.teeth.profile = e.target.value; scheduleRebuild(); };
  $('tCRng').oninput = (e) => { S.clearance = parseFloat(e.target.value); $('tCNum').value = S.clearance.toFixed(3); scheduleRebuild(); };
  $('tCNum').onchange = (e) => { const v = parseFloat(e.target.value); if (isFinite(v)) { S.clearance = clamp(v, 0, 0.5); $('tCRng').value = S.clearance; } scheduleRebuild(); };

  /* ── overlays ── */
  document.querySelectorAll('[data-ov]').forEach(cb => {
    cb.checked = !!S.ov[cb.dataset.ov];
    cb.onchange = () => { S.ov[cb.dataset.ov] = cb.checked; };
  });

  /* ── custom shape inputs ── */
  $('formulaSrc').value = S.formulaSrc;
  $('formulaSrc').oninput = (e) => { S.formulaSrc = e.target.value; compileFormula(); };
  $('drawArm').onclick = () => {
    $('drawArm').classList.toggle('on');
    toast($('drawArm').classList.contains('on') ? 'Drag on the canvas around gear 1’s axle to sketch its outline.' : 'Sketching off.');
  };
  $('drawReset').onclick = () => { Drawn.reset(0.9); scheduleRebuild(); };
  $('drawRound').onclick = () => { Drawn.reset(0.9); scheduleRebuild(); toast('Reset to a circle.'); };

  /* ── HUD ── */
  $('play').onclick = () => togglePlay();
  $('stepB').onclick = () => { S.anim.on = false; syncPlay(); S.anim.phi1 -= model.span / 180; };
  $('stepF').onclick = () => { S.anim.on = false; syncPlay(); S.anim.phi1 += model.span / 180; };
  $('speed').oninput = (e) => { S.anim.speed = parseFloat(e.target.value); };
  $('fit').onclick = () => fitView();
  const toggleL = () => $('sideL').classList.toggle('hide');
  $('togL').onclick = toggleL;
  $('togL2').onclick = toggleL;
  $('togR').onclick = () => $('sideR').classList.toggle('hide');
  /* on a narrow screen the panel covers the stage, so start with the view */
  narrowMQ.addEventListener('change', applyNarrow);
  syncPlay();

  /* ── keyboard ── */
  window.addEventListener('keydown', (e) => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (!$('studio').classList.contains('on')) return;
    const k = e.key;
    if (k === ' ') { e.preventDefault(); togglePlay(); }
    else if (k === 'ArrowRight') { S.anim.on = false; syncPlay(); S.anim.phi1 += model.span / (e.shiftKey ? 720 : 120); }
    else if (k === 'ArrowLeft') { S.anim.on = false; syncPlay(); S.anim.phi1 -= model.span / (e.shiftKey ? 720 : 120); }
    else if (k === 'f' || k === 'F') fitView();
    else if (k === 'g' || k === 'G') { S.ov.ghosts = !S.ov.ghosts; document.querySelector('[data-ov=ghosts]').checked = S.ov.ghosts; }
    else if (k === 'c' || k === 'C') { S.ov.centrodes = !S.ov.centrodes; document.querySelector('[data-ov=centrodes]').checked = S.ov.centrodes; }
    else if (k === 'n' || k === 'N') { S.ov.normals = !S.ov.normals; document.querySelector('[data-ov=normals]').checked = S.ov.normals; }
    else if (k === '?' || k === '/') openHelp();
  });

  window.addEventListener('resize', () => { view.resize(); });
  requestAnimationFrame(frame);
}

function togglePlay() { S.anim.on = !S.anim.on; syncPlay(); }
function syncPlay() {
  const b = $('play');
  b.classList.toggle('on', S.anim.on);
  b.innerHTML = S.anim.on
    ? '<svg width="13" height="13" viewBox="0 0 12 12"><rect x="2" y="1.5" width="3" height="9" fill="currentColor"/><rect x="7" y="1.5" width="3" height="9" fill="currentColor"/></svg>'
    : '<svg width="13" height="13" viewBox="0 0 12 12"><path d="M3 1.5 L10 6 L3 10.5 Z" fill="currentColor"/></svg>';
  b.title = S.anim.on ? 'Pause (space)' : 'Play (space)';
}
