/* export.js — take the pair out of the browser.
 *
 * 2D: SVG and DXF, both in millimetres.
 * 3D: STEP solids (see step.js), and a PowerShell script that drives an
 *     installed SOLIDWORKS to save native .sldprt / .sldasm (see swscript.js —
 *     those two formats are proprietary and cannot be written from a page).
 * Plus the raw JSON and a PNG of the canvas.
 */
'use strict';

const EX = {
  format: 'svg',
  scale: 50,        /* millimetres per app length unit */
  bodies: 'both',   /* both | g1 | g2 */
  thickness: 10,    /* mm */
  bore: 0,          /* mm diameter, 0 = none */
  points: 480,
  /* Polyline walls by default. Measured against SOLIDWORKS 2020: a cubic
     wall through 180 or 360 points on a toothed gear arrives as loose
     SURFACES that will not knit into a solid, because the interpolating
     spline overshoots in the sharp tooth roots; at 720 points it knits.
     A polyline always knits, and its chord error at 480 points on a 130 mm
     gear is about 2 microns, so nothing is really lost. */
  smooth: false,
  pitch: false      /* include the pitch curves in 2D output */
};

const FORMATS = [
  { id: 'svg', label: 'SVG', ext: 'svg', kind: '2d', blurb: 'Flat outlines in millimetres, one path per curve. Opens anywhere; good for laser cutting or dropping into a drawing.' },
  { id: 'dxf', label: 'DXF', ext: 'dxf', kind: '2d', blurb: 'R2000 DXF in millimetres, on separate layers. This is the one to use for 2D CAM and for sketching over in CAD.' },
  { id: 'step', label: 'STEP', ext: 'step', kind: '3d', blurb: 'AP214 solids, extruded to the thickness you set. Each body is three faces — two caps and one swept wall — so the file stays small and imports as a single solid.' },
  { id: 'sw', label: 'SOLIDWORKS', ext: 'ps1', kind: '3d', blurb: 'A script that drives your installed SOLIDWORKS and saves real .sldprt parts plus a meshed .sldasm assembly. The geometry travels inside the script.' },
  { id: 'json', label: 'JSON', ext: 'json', kind: 'data', blurb: 'Every number: parameters, both outlines, both pitch curves, and the diagnostics.' },
  { id: 'png', label: 'PNG', ext: 'png', kind: 'data', blurb: 'A snapshot of the canvas exactly as it looks now, including whichever overlays are switched on.' }
];

/* ── geometry helpers ────────────────────────────────────────────── */

function download(name, text, mime) {
  const blob = text instanceof Blob ? text : new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 600);
}

/** Polar array resampled to n points, in millimetres, optionally shifted. */
function polarPoints(r, scale, n, cx) {
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const t = i * TAU / n, rr = rAt(r, t) * scale;
    out[i] = [(cx || 0) + rr * Math.cos(t), rr * Math.sin(t)];
  }
  return out;
}

/** A bore, as a closed polygon in millimetres. */
function borePoints(diaMM, cx) {
  const n = 96, R = diaMM / 2, out = new Array(n);
  for (let i = 0; i < n; i++) {
    const t = i * TAU / n;
    out[i] = [(cx || 0) + R * Math.cos(t), R * Math.sin(t)];
  }
  return out;
}

/** What the current options ask for, in millimetres. */
function exportPlan() {
  const m = model, s = EX.scale, n = clamp(Math.round(EX.points), 48, 2000);
  const want1 = EX.bodies !== 'g2', want2 = EX.bodies !== 'g1';
  const list = [];
  if (want1) list.push({
    key: 'g1', label: 'gear1', cx: 0,
    outline: polarPoints(m.profile1, s, n, 0),
    pitch: polarPoints(m.centrode1, s, n, 0),
    rMin: rMin(m.profile1) * s, rMax: rMax(m.profile1) * s
  });
  if (want2) list.push({
    key: 'g2', label: 'gear2', cx: m.a * s,
    outline: polarPoints(m.r2, s, n, m.a * s),
    pitch: polarPoints(m.mate.r, s, n, m.a * s),
    rMin: rMin(m.r2) * s, rMax: rMax(m.r2) * s
  });
  const boreOK = EX.bore > 0 && list.every(g => EX.bore / 2 < g.rMin * 0.92);
  for (const g of list) g.bore = boreOK ? borePoints(EX.bore, g.cx) : null;
  return {
    gears: list, centre: m.a * s, boreOK, n,
    boreDia: boreOK ? EX.bore : 0, withPitch: EX.pitch,
    ratio: m.law.ratio, thickness: EX.thickness, degree: EX.smooth ? 3 : 1
  };
}

/* ── SVG ─────────────────────────────────────────────────────────── */

function svgText(P) {
  const pad = 6;
  let minX = Infinity, maxX = -Infinity, maxY = 0;
  for (const g of P.gears) {
    minX = Math.min(minX, g.cx - g.rMax); maxX = Math.max(maxX, g.cx + g.rMax);
    maxY = Math.max(maxY, g.rMax);
  }
  minX -= pad; maxX += pad; maxY += pad;
  const W = maxX - minX, H = 2 * maxY;
  const path = (pts) => 'M' + pts.map(p => p[0].toFixed(4) + ',' + (-p[1]).toFixed(4)).join('L') + 'Z';

  const body = [];
  for (const g of P.gears) {
    body.push(`  <path id="${g.label}" d="${path(g.outline)}" stroke="#111"/>`);
    if (g.bore) body.push(`  <circle id="${g.label}-bore" cx="${g.cx.toFixed(4)}" cy="0" r="${(P.boreDia / 2).toFixed(4)}" stroke="#111"/>`);
    if (P.withPitch) body.push(`  <path id="${g.label}-pitch" d="${path(g.pitch)}" stroke="#888" stroke-dasharray="2,1.5"/>`);
    body.push(`  <circle cx="${g.cx.toFixed(4)}" cy="0" r="0.6" stroke="#c00"/>`);
  }
  const svg =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W.toFixed(2)}mm" height="${H.toFixed(2)}mm" ` +
    `viewBox="${minX.toFixed(3)} ${(-maxY).toFixed(3)} ${W.toFixed(3)} ${H.toFixed(3)}">\n` +
    '<g fill="none" stroke-width="0.35" vector-effect="non-scaling-stroke">\n' +
    body.join('\n') + '\n</g>\n' +
    `<!-- Unique Gears. centre distance ${P.centre.toFixed(4)} mm, ratio ${P.ratio.toFixed(6)} -->\n` +
    '</svg>\n';
  return svg;
}

function exportSVG() {
  const P = exportPlan();
  download(exportName('svg'), svgText(P), 'image/svg+xml');
  toast('SVG written, centre distance ' + P.centre.toFixed(2) + ' mm.');
}

/* ── DXF ─────────────────────────────────────────────────────────── */

function dxfText(P) {
  const L = [];
  const put = (code, val) => { L.push(String(code), String(val)); };

  put(0, 'SECTION'); put(2, 'HEADER');
  put(9, '$ACADVER'); put(1, 'AC1015');
  put(9, '$INSUNITS'); put(70, 4);                  /* millimetres */
  put(9, '$EXTMIN'); put(10, -200); put(20, -200); put(30, 0);
  put(9, '$EXTMAX'); put(10, 400); put(20, 200); put(30, 0);
  put(0, 'ENDSEC');

  /* a real TABLES section with the layers declared — some importers drop
     entities whose layer was never defined */
  const layers = [];
  for (const g of P.gears) {
    layers.push(g.label.toUpperCase());
    if (g.bore) layers.push(g.label.toUpperCase() + '-BORE');
    if (P.withPitch) layers.push(g.label.toUpperCase() + '-PITCH');
  }
  layers.push('AXLES');
  put(0, 'SECTION'); put(2, 'TABLES');
  put(0, 'TABLE'); put(2, 'LAYER'); put(70, layers.length);
  for (const nm of layers) {
    put(0, 'LAYER'); put(2, nm); put(70, 0); put(62, 7); put(6, 'CONTINUOUS');
  }
  put(0, 'ENDTAB'); put(0, 'ENDSEC');

  put(0, 'SECTION'); put(2, 'ENTITIES');
  const poly = (pts, layer) => {
    put(0, 'LWPOLYLINE'); put(8, layer);
    put(100, 'AcDbEntity'); put(100, 'AcDbPolyline');
    put(90, pts.length); put(70, 1);
    for (const p of pts) { put(10, p[0].toFixed(5)); put(20, p[1].toFixed(5)); }
  };
  const circleE = (cx, cy, r, layer) => {
    put(0, 'CIRCLE'); put(8, layer);
    put(10, cx.toFixed(5)); put(20, cy.toFixed(5)); put(30, '0.0'); put(40, r.toFixed(5));
  };
  for (const g of P.gears) {
    poly(g.outline, g.label.toUpperCase());
    if (g.bore) circleE(g.cx, 0, P.boreDia / 2, g.label.toUpperCase() + '-BORE');
    if (P.withPitch) poly(g.pitch, g.label.toUpperCase() + '-PITCH');
    circleE(g.cx, 0, Math.max(0.5, P.centre * 0.004), 'AXLES');
  }
  put(0, 'ENDSEC'); put(0, 'EOF');
  return { text: L.join('\r\n') + '\r\n', layers };
}

function exportDXF() {
  const P = exportPlan(), out = dxfText(P);
  download(exportName('dxf'), out.text, 'application/dxf');
  toast('DXF written in millimetres, ' + out.layers.length + ' layers.');
}

/* ── STEP ────────────────────────────────────────────────────────── */

function stepTextFor(P, name) {
  const bodies = P.gears.map(g => ({ outer: g.outline, bore: g.bore, label: g.label }));
  return buildStep(bodies, P.thickness, P.degree, name);
}

function exportSTEP() {
  const P = exportPlan();
  if (EX.bore > 0 && !P.boreOK) { toast('That bore is too big for the smaller gear — reduce it.'); return; }
  const text = stepTextFor(P, baseName());
  download(exportName('step'), text, 'application/step');
  toast('STEP written — ' + P.gears.length + ' solid' + (P.gears.length > 1 ? 's' : '') +
    ', ' + EX.thickness + ' mm thick, ' + (text.length / 1024).toFixed(0) + ' kB.');
}

/* ── SOLIDWORKS ──────────────────────────────────────────────────── */

function exportSolidWorks() {
  const m = model;
  const saved = EX.bodies;
  EX.bodies = 'both';
  const P = exportPlan();
  EX.bodies = saved;
  if (EX.bore > 0 && !P.boreOK) { toast('That bore is too big for the smaller gear — reduce it.'); return; }

  /* each part is modelled about its own origin, and the assembly puts them
     a centre distance apart — so gear 2's points are shifted back here */
  const g2 = P.gears[1];
  const local2 = {
    outline: g2.outline.map(p => [p[0] - g2.cx, p[1]]),
    bore: g2.bore ? g2.bore.map(p => [p[0] - g2.cx, p[1]]) : null,
    label: 'gear2'
  };
  const s1 = buildStep([{ outer: P.gears[0].outline, bore: P.gears[0].bore, label: 'gear1' }],
    EX.thickness, EX.smooth ? 3 : 1, baseName() + '-1');
  const s2 = buildStep([{ outer: local2.outline, bore: local2.bore, label: 'gear2' }],
    EX.thickness, EX.smooth ? 3 : 1, baseName() + '-2');

  const script = buildSolidWorksScript({
    gear1Step: s1, gear2Step: s2,
    centreDistanceMM: P.centre.toFixed(6),
    baseName: baseName(),
    thicknessMM: EX.thickness, boreMM: EX.bore,
    summary: summaryLine()
  });
  download(exportName('ps1'), script, 'text/plain');
  toast('Script written (' + (script.length / 1024).toFixed(0) + ' kB). Run it and SOLIDWORKS does the rest.');
}

/* ── JSON / PNG ──────────────────────────────────────────────────── */

function exportJSON() {
  const m = model, P = exportPlan();
  const data = {
    generator: 'Unique Gears — conjugate shape workbench',
    created: new Date().toISOString(),
    units: 'millimetres',
    shape: { id: S.shapeId, name: m.def.name, params: S.vals, smoothing: S.smooth },
    pairing: {
      mode: S.mode,
      ratio_gear2_turns_per_gear1_turn: m.law.ratio,
      symmetry_gear1: m.ri.sym,
      mate_lobes: m.ri.kind === 'lobes' ? m.ri.m : null,
      centre_distance: P.centre,
      centre_distance_solved: S.autoA
    },
    teeth: m.diag.hasTeeth ? {
      count_gear1: Math.round(S.teeth.Z),
      count_gear2: m.diag.mateTeeth == null ? null : +m.diag.mateTeeth.toFixed(4),
      height: S.teeth.h * EX.scale, profile: S.teeth.profile,
      clearance_fraction: S.clearance
    } : null,
    diagnostics: {
      closure_error_deg: m.diag.closeErrDeg,
      interference_pct_of_centre_distance: m.diag.interfPct,
      contact_ratio: m.diag.contactRatio,
      ratio_min: Math.min(...m.curves.k),
      ratio_max: Math.max(...m.curves.k)
    },
    samples: P.n,
    gear1_profile_xy: P.gears[0] && P.gears[0].key === 'g1' ? round5(P.gears[0].outline) : null,
    gear1_pitch_xy: P.gears[0] && P.gears[0].key === 'g1' ? round5(P.gears[0].pitch) : null,
    gear2_profile_xy: round5((P.gears.find(g => g.key === 'g2') || {}).outline),
    gear2_pitch_xy: round5((P.gears.find(g => g.key === 'g2') || {}).pitch)
  };
  download(exportName('json'), JSON.stringify(data, null, 1), 'application/json');
  toast('JSON written with both outlines and the pitch curves.');
}
const round5 = (pts) => pts ? pts.map(p => [+p[0].toFixed(5), +p[1].toFixed(5)]) : null;

function exportPNG() {
  const cv = document.getElementById('cv');
  const tmp = document.createElement('canvas');
  tmp.width = cv.width; tmp.height = cv.height;
  const c = tmp.getContext('2d');
  c.fillStyle = '#12151d'; c.fillRect(0, 0, tmp.width, tmp.height);
  c.drawImage(cv, 0, 0);
  tmp.toBlob((b) => { download(exportName('png'), b); toast('Snapshot saved.'); });
}

/* ── naming and summary ──────────────────────────────────────────── */

function baseName() {
  const m = model;
  const bits = ['gear', m.def.id];
  if (m.ri.kind === 'lobes') bits.push(m.ri.n + 'x' + m.ri.m);
  else if (m.ri.kind === 'teeth') bits.push(Math.round(S.vals.z) + 'x' + Math.round(S.z2));
  else bits.push('ratio' + model.law.ratio.toFixed(2));
  return bits.join('-').replace(/[^a-zA-Z0-9.-]/g, '');
}
function exportName(ext) { return baseName() + '.' + ext; }

function summaryLine() {
  const m = model, P = exportPlan();
  return m.def.name + ' pair, ratio ' + m.law.ratio.toFixed(4) +
    ', centre distance ' + P.centre.toFixed(3) + ' mm' +
    (m.diag.hasTeeth && m.diag.mateTeeth ? ', ' + Math.round(S.teeth.Z) + ' and ' + Math.round(m.diag.mateTeeth) + ' teeth' : '') +
    (EX.thickness ? ', ' + EX.thickness + ' mm thick' : '') +
    (EX.bore > 0 ? ', ' + EX.bore + ' mm bore' : '');
}

/* ══════════════════════════════════════════════════ the dialog ═══ */

function fmtDef() { return FORMATS.find(f => f.id === EX.format) || FORMATS[0]; }

function openExport() {
  if (!model) return;
  buildExportUI();
  document.getElementById('exportModal').classList.add('on');
}
function closeExport() { document.getElementById('exportModal').classList.remove('on'); }

function buildExportUI() {
  const tabs = document.getElementById('exFormats');
  if (!tabs.childElementCount) {
    for (const f of FORMATS) {
      const b = document.createElement('button');
      b.textContent = f.label; b.dataset.fmt = f.id;
      b.onclick = () => { EX.format = f.id; buildExportUI(); };
      tabs.appendChild(b);
    }
  }
  [...tabs.children].forEach(b => b.classList.toggle('on', b.dataset.fmt === EX.format));

  const def = fmtDef();
  document.getElementById('exBlurb').textContent = def.blurb;
  const is3d = def.kind === '3d';
  document.getElementById('ex3d').style.display = is3d ? '' : 'none';
  /* the SOLIDWORKS route always needs both, because it builds the assembly */
  document.getElementById('exBodiesRow').style.display =
    (def.id === 'png' || def.id === 'sw') ? 'none' : '';
  document.getElementById('exPitchRow').style.display = (def.kind === '2d') ? '' : 'none';
  document.getElementById('exScaleRow').style.display = (def.id === 'png') ? 'none' : '';
  document.getElementById('exSwNote').style.display = def.id === 'sw' ? '' : 'none';
  document.getElementById('exGo').textContent = def.id === 'sw' ? 'Download script' : 'Download ' + def.label;

  /* keep the controls showing the state */
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.value = v; };
  set('exScale', EX.scale); set('exThick', EX.thickness); set('exBore', EX.bore); set('exPoints', EX.points);
  document.getElementById('exSmooth').checked = EX.smooth;
  document.getElementById('exPitch').checked = EX.pitch;
  document.querySelectorAll('[data-bodies]').forEach(b => b.classList.toggle('on', b.dataset.bodies === EX.bodies));

  updateExportSummary();
}

function updateExportSummary() {
  if (!model) return;
  const P = exportPlan(), def = fmtDef();
  const rows = [];
  const kv = (k, v, cls) => rows.push(`<div class="kv"><span class="k">${k}</span><span class="v ${cls || ''}">${v}</span></div>`);
  kv('file', exportName(def.ext));
  kv('centre distance', P.centre.toFixed(3) + ' mm');
  for (const g of P.gears) {
    kv(g.label + ' outside ⌀', (g.rMax * 2).toFixed(2) + ' mm', g.key === 'g1' ? 'g1' : 'g2');
  }
  if (def.kind === '3d') {
    kv('thickness', EX.thickness + ' mm');
    if (EX.bore > 0) kv('bore ⌀', P.boreOK ? EX.bore + ' mm' : EX.bore + ' mm — too big', P.boreOK ? '' : 'bad');
    kv('wall', EX.smooth ? 'cubic B-spline' : 'polyline (exact)');
    kv('profile points', String(P.n));
    kv('faces per body', String(EX.bore > 0 && P.boreOK ? 4 : 3));
    if (EX.smooth && P.n < 720) {
      kv('warning', 'too few points for a cubic wall', 'bad');
    } else {
      /* chord error of a polyline wall, at the largest radius present */
      const R = Math.max(...P.gears.map(g => g.rMax));
      const err = R * (1 - Math.cos(Math.PI / P.n));
      kv('chord error', (err * 1000).toFixed(1) + ' µm', err < 0.01 ? 'ok' : 'warn');
    }
  }
  if (def.kind === '2d') kv('profile points', String(P.n === 360 ? P.n : P.n));
  document.getElementById('exSummary').innerHTML = rows.join('');
}

function runExport() {
  const id = EX.format;
  try {
    if (id === 'svg') exportSVG();
    else if (id === 'dxf') exportDXF();
    else if (id === 'step') exportSTEP();
    else if (id === 'sw') exportSolidWorks();
    else if (id === 'json') exportJSON();
    else if (id === 'png') exportPNG();
  } catch (e) {
    console.error(e);
    toast('That export failed: ' + e.message);
    return;
  }
  closeExport();
}

function bindExportUI() {
  const num = (id, key, lo, hi, int) => {
    const el = document.getElementById(id);
    el.onchange = el.oninput = () => {
      const v = parseFloat(el.value);
      if (isFinite(v)) EX[key] = int ? Math.round(clamp(v, lo, hi)) : clamp(v, lo, hi);
      updateExportSummary();
    };
  };
  num('exScale', 'scale', 0.01, 10000);
  num('exThick', 'thickness', 0.1, 1000);
  num('exBore', 'bore', 0, 10000);
  num('exPoints', 'points', 48, 2000, true);
  document.getElementById('exSmooth').onchange = (e) => {
    EX.smooth = e.target.checked;
    /* a cubic wall needs dense sampling or CAD will not knit it — see the
       comment on EX.smooth */
    if (EX.smooth && EX.points < 720) {
      EX.points = 720;
      document.getElementById('exPoints').value = 720;
      toast('Raised to 720 points: a smooth wall needs dense sampling to stay knittable.');
    }
    updateExportSummary();
  };
  document.getElementById('exPitch').onchange = (e) => { EX.pitch = e.target.checked; };
  document.querySelectorAll('[data-bodies]').forEach(b => {
    b.onclick = () => { EX.bodies = b.dataset.bodies; buildExportUI(); };
  });
  document.getElementById('exGo').onclick = runExport;
  document.getElementById('exClose').onclick = closeExport;
  document.getElementById('exportModal').onclick = (e) => { if (e.target.id === 'exportModal') closeExport(); };
}
