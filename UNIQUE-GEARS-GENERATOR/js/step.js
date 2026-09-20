/* step.js — writes AP214 STEP solids for the gear pair.
 *
 * A gear here is a prism: a closed planar profile swept along Z, optionally
 * with a bore through the middle. Rather than emit one planar face per
 * profile segment (thousands of faces, megabytes, and a feature tree no one
 * wants), each side wall is a single SURFACE_OF_LINEAR_EXTRUSION over one
 * closed B_SPLINE_CURVE_WITH_KNOTS. That is three faces per body, a small
 * file, and real curved geometry a CAD system can select and fillet.
 *
 * The curve is written in the unclamped-uniform form used for periodic
 * B-splines: for degree p and n distinct control points, the control list is
 * wrapped by repeating the first p points, and the knots run 0 .. n+2p at
 * multiplicity one, so the valid domain [p, n+p] covers the loop exactly once.
 */
'use strict';

/* ── cubic interpolation ──────────────────────────────────────────────
 * A uniform cubic B-spline passes through (P[i-1] + 4P[i] + P[i+1]) / 6 at
 * each knot, so interpolating a closed set of samples means solving a cyclic
 * tridiagonal system with rows [1 4 1] / 6. Sherman-Morrison turns that into
 * two ordinary tridiagonal solves.
 */
function solveCyclicTridiagonal(n, a, b, c, d) {
  /* a: sub-diagonal, b: diagonal, c: super-diagonal (scalars here), d: rhs */
  if (n < 3) return d.slice();
  const solveTri = (rhs) => {
    const cp = new Float64Array(n), dp = new Float64Array(n);
    const bb = new Float64Array(n).fill(b);
    bb[0] = b - c;                 /* Sherman-Morrison correction */
    bb[n - 1] = b - a * c / c;     /* = b - a, with gamma = c below */
    cp[0] = c / bb[0]; dp[0] = rhs[0] / bb[0];
    for (let i = 1; i < n; i++) {
      const m = bb[i] - a * cp[i - 1];
      cp[i] = c / m;
      dp[i] = (rhs[i] - a * dp[i - 1]) / m;
    }
    const x = new Float64Array(n);
    x[n - 1] = dp[n - 1];
    for (let i = n - 2; i >= 0; i--) x[i] = dp[i] - cp[i] * x[i + 1];
    return x;
  };
  const u = new Float64Array(n);
  u[0] = c; u[n - 1] = a;
  const y = solveTri(d), q = solveTri(u);
  /* v = [1, 0, ..., 0, 1] ; factor = (v.y) / (1 + v.q) */
  const num = y[0] + (a / c) * y[n - 1];
  const den = 1 + q[0] + (a / c) * q[n - 1];
  const f = num / den;
  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) x[i] = y[i] - f * q[i];
  return x;
}

/** Control points of a closed uniform cubic B-spline through `pts`. */
function cubicControlPoints(pts) {
  const n = pts.length;
  if (n < 4) return pts.map(p => p.slice());
  const out = new Array(n);
  for (const k of [0, 1]) {
    const d = new Float64Array(n);
    for (let i = 0; i < n; i++) d[i] = 6 * pts[i][k];
    const x = solveCyclicTridiagonal(n, 1, 4, 1, d);
    for (let i = 0; i < n; i++) {
      if (!out[i]) out[i] = [0, 0];
      out[i][k] = x[i];
    }
  }
  return out;
}

/**
 * de Boor evaluation. The seam vertex of a closed edge has to sit exactly on
 * the curve; for a cubic the control points are not on it, so the start point
 * is evaluated rather than guessed.
 */
function deBoor(cps, degree, knots, u) {
  const p = degree;
  let k = p;
  while (k < cps.length - 1 && knots[k + 1] <= u) k++;
  const d = [];
  for (let j = 0; j <= p; j++) d.push(cps[j + k - p].slice());
  for (let r = 1; r <= p; r++) {
    for (let j = p; j >= r; j--) {
      const lo = knots[j + k - p], hi = knots[j + 1 + k - r];
      const a = hi === lo ? 0 : (u - lo) / (hi - lo);
      d[j] = [d[j - 1][0] * (1 - a) + d[j][0] * a, d[j - 1][1] * (1 - a) + d[j][1] * a];
    }
  }
  return d[p];
}

/* ── STEP writer ─────────────────────────────────────────────────── */

class Step {
  constructor(name) {
    this.lines = [];
    this.id = 0;
    this.name = name || 'model';
  }
  /** Append one entity, return its #id. */
  e(body) {
    const id = ++this.id;
    this.lines.push('#' + id + '=' + body + ';');
    return '#' + id;
  }
  pt(x, y, z) { return this.e(`CARTESIAN_POINT('',(${num(x)},${num(y)},${num(z)}))`); }
  dir(x, y, z) { return this.e(`DIRECTION('',(${num(x)},${num(y)},${num(z)}))`); }
  axis(p, ax, ref) { return this.e(`AXIS2_PLACEMENT_3D('',${p},${ax},${ref})`); }
}

/** STEP reals must always carry a decimal point. */
function num(v) {
  if (!isFinite(v)) v = 0;
  if (Math.abs(v) < 1e-11) return '0.';
  let s = v.toPrecision(12).replace(/0+$/, '');
  if (!/[.E]/i.test(s)) s += '.';
  if (/\.$/.test(s) === false && /\./.test(s) === false) s += '.';
  return s.replace(/\.$/, '.');
}

/**
 * One closed profile loop, extruded from z=0 to z=h, as three faces.
 * `outward` says whether the loop runs counter-clockwise (an outer wall) or
 * clockwise (a bore), which decides which way the faces look.
 * Returns the ids of the three ADVANCED_FACEs.
 */
function signedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const q = pts[i], w = pts[(i + 1) % pts.length];
    a += q[0] * w[1] - w[0] * q[1];
  }
  return a / 2;
}

function extrudeLoop(S, pts, h, degree, outward) {
  /* Winding alone decides which way the wall faces: an outer wall runs
     counter-clockwise, a bore runs clockwise, and then the extruded
     surface's own normal (C' x Z) already points out of the material, so
     every face is written same-sense. Normalising here means a caller — or
     a user-drawn profile — cannot get it backwards. */
  if (outward === (signedArea(pts) < 0)) pts = pts.slice().reverse();
  const n = pts.length, p = degree;
  const cps = cubicOrLinearControls(pts, p);

  /* control points at both levels */
  const mk = (z) => cps.map(q => S.pt(q[0], q[1], z));
  const cpBot = mk(0), cpTop = mk(h);

  const m = cps.length;
  const knots = [], mult = [];
  for (let i = 0; i <= m + p; i++) { knots.push(i); mult.push(1); }
  const spline = (list) => S.e(
    `B_SPLINE_CURVE_WITH_KNOTS('',${p},(${list.join(',')}),.UNSPECIFIED.,.T.,.F.,` +
    `(${mult.join(',')}),(${knots.map(k => num(k)).join(',')}),.UNSPECIFIED.)`);
  const curveBot = spline(cpBot), curveTop = spline(cpTop);

  /* the seam sits where the curve starts: parameter u = p, evaluated */
  const seamXY = deBoor(cps, p, knots, p);
  const sBot = S.pt(seamXY[0], seamXY[1], 0), sTop = S.pt(seamXY[0], seamXY[1], h);
  const vBot = S.e(`VERTEX_POINT('',${sBot})`), vTop = S.e(`VERTEX_POINT('',${sTop})`);

  const zUp = S.dir(0, 0, 1);
  const seamLine = S.e(`LINE('',${sBot},${S.e(`VECTOR('',${zUp},1.)`)})`);

  const eBot = S.e(`EDGE_CURVE('',${vBot},${vBot},${curveBot},.T.)`);
  const eTop = S.e(`EDGE_CURVE('',${vTop},${vTop},${curveTop},.T.)`);
  const eSeam = S.e(`EDGE_CURVE('',${vBot},${vTop},${seamLine},.T.)`);

  const oe = (edge, sense) => S.e(`ORIENTED_EDGE('',*,*,${edge},${sense ? '.T.' : '.F.'})`);

  /* side wall: bottom loop, up the seam, back along the top, down the seam */
  const sideLoop = S.e(`EDGE_LOOP('',(${[oe(eBot, true), oe(eSeam, true), oe(eTop, false), oe(eSeam, false)].join(',')}))`);
  const sideSurf = S.e(`SURFACE_OF_LINEAR_EXTRUSION('',${curveBot},${S.e(`VECTOR('',${zUp},1.)`)})`);
  const sideFace = S.e(`ADVANCED_FACE('',(${S.e(`FACE_OUTER_BOUND('',${sideLoop},.T.)`)}),${sideSurf},.T.)`);

  const botLoop = S.e(`EDGE_LOOP('',(${oe(eBot, false)}))`);
  const topLoop = S.e(`EDGE_LOOP('',(${oe(eTop, true)}))`);
  return { sideFace, botLoop, topLoop, curveBot, curveTop };
}

function cubicOrLinearControls(pts, p) {
  const base = p >= 3 ? cubicControlPoints(pts) : pts.map(q => q.slice());
  const out = base.map(q => q.slice());
  for (let i = 0; i < p; i++) out.push(base[i % base.length].slice());
  return out;
}

/**
 * A prism body: outer profile, optional bore, from z=0 to z=h.
 * Returns the MANIFOLD_SOLID_BREP id.
 */
function prismBody(S, outer, bore, h, degree, label) {
  const faces = [];
  const O = extrudeLoop(S, outer, h, degree, true);
  faces.push(O.sideFace);

  let I = null;
  if (bore && bore.length >= 4) {
    I = extrudeLoop(S, bore, h, degree, false);
    faces.push(I.sideFace);
  }

  /* end caps: outer bound plus, when there is a bore, an inner bound */
  const zUp = S.dir(0, 0, 1), xAx = S.dir(1, 0, 0);
  const planeAt = (z) => S.e(`PLANE('',${S.axis(S.pt(0, 0, z), zUp, xAx)})`);

  const bBounds = [S.e(`FACE_OUTER_BOUND('',${O.botLoop},.T.)`)];
  const tBounds = [S.e(`FACE_OUTER_BOUND('',${O.topLoop},.T.)`)];
  if (I) {
    bBounds.push(S.e(`FACE_BOUND('',${I.botLoop},.T.)`));
    tBounds.push(S.e(`FACE_BOUND('',${I.topLoop},.T.)`));
  }
  faces.push(S.e(`ADVANCED_FACE('',(${bBounds.join(',')}),${planeAt(0)},.F.)`));
  faces.push(S.e(`ADVANCED_FACE('',(${tBounds.join(',')}),${planeAt(h)},.T.)`));

  const shell = S.e(`CLOSED_SHELL('',(${faces.join(',')}))`);
  return S.e(`MANIFOLD_SOLID_BREP('${label}',${shell})`);
}

/**
 * Build a complete STEP file.
 * `bodies` is [{ outer, bore, label }] with points already in millimetres.
 */
function buildStep(bodies, thickness, degree, productName) {
  const S = new Step(productName);
  const breps = bodies.map(b => prismBody(S, b.outer, b.bore, thickness, degree, b.label));

  const origin = S.pt(0, 0, 0), zUp = S.dir(0, 0, 1), xAx = S.dir(1, 0, 0);
  const place = S.axis(origin, zUp, xAx);

  const lenUnit = S.e('( LENGTH_UNIT() NAMED_UNIT(*) SI_UNIT(.MILLI.,.METRE.) )');
  const angUnit = S.e('( NAMED_UNIT(*) PLANE_ANGLE_UNIT() SI_UNIT($,.RADIAN.) )');
  const srUnit = S.e('( NAMED_UNIT(*) SI_UNIT($,.STERADIAN.) SOLID_ANGLE_UNIT() )');
  const unc = S.e(`UNCERTAINTY_MEASURE_WITH_UNIT(LENGTH_MEASURE(1.E-07),${lenUnit},'distance_accuracy_value','confusion accuracy')`);
  const ctx = S.e('( GEOMETRIC_REPRESENTATION_CONTEXT(3) ' +
    `GLOBAL_UNCERTAINTY_ASSIGNED_CONTEXT((${unc})) ` +
    `GLOBAL_UNIT_ASSIGNED_CONTEXT((${lenUnit},${angUnit},${srUnit})) ` +
    "REPRESENTATION_CONTEXT('','3D') )");

  const shapeRep = S.e(`ADVANCED_BREP_SHAPE_REPRESENTATION('${productName}',(${[place].concat(breps).join(',')}),${ctx})`);

  const appCtx = S.e("APPLICATION_CONTEXT('core data for automotive mechanical design processes')");
  S.e(`APPLICATION_PROTOCOL_DEFINITION('international standard','automotive_design',2000,${appCtx})`);
  const prodCtx = S.e(`PRODUCT_CONTEXT('',${appCtx},'mechanical')`);
  const prod = S.e(`PRODUCT('${productName}','${productName}','',(${prodCtx}))`);
  const pdf = S.e(`PRODUCT_DEFINITION_FORMATION('','',${prod})`);
  const pdCtx = S.e(`PRODUCT_DEFINITION_CONTEXT('part definition',${appCtx},'design')`);
  const pd = S.e(`PRODUCT_DEFINITION('design','',${pdf},${pdCtx})`);
  const pds = S.e(`PRODUCT_DEFINITION_SHAPE('','',${pd})`);
  S.e(`SHAPE_DEFINITION_REPRESENTATION(${pds},${shapeRep})`);
  const mech = S.e("MECHANICAL_CONTEXT('',#" + appCtx.slice(1) + ",'mechanical')");
  S.e(`PRODUCT_RELATED_PRODUCT_CATEGORY('part','',(${prod}))`);
  void mech;

  const stamp = new Date().toISOString().replace(/\.\d+Z$/, '');
  return [
    'ISO-10303-21;',
    'HEADER;',
    "FILE_DESCRIPTION(('" + productName + "'),'2;1');",
    "FILE_NAME('" + productName + ".step','" + stamp + "',('Unique Gears'),(''),'Unique Gears conjugate shape workbench','',''); ",
    "FILE_SCHEMA(('AUTOMOTIVE_DESIGN { 1 0 10303 214 1 1 1 1 }'));",
    'ENDSEC;',
    'DATA;',
    S.lines.join('\n'),
    'ENDSEC;',
    'END-ISO-10303-21;',
    ''
  ].join('\n');
}
