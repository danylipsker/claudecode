/* Curves Workshop · tools/test-kit.js — unit checks of the geometry helpers, the curves and the renderer.
 *
 *   node tools/test-kit.js
 */
const C = require('./load')({ figures: [], noSections: true });
const g = C.g, K = C.curves;
let n = 0, bad = 0;
const near = (a, b, eps) => Math.abs(a - b) <= (eps || 1e-6);
function t(name, cond) { n++; if (!cond) { bad++; console.log('FAIL ' + name); } }

/* geometry */
t('dist', near(g.dist({ x: 0, y: 0 }, { x: 3, y: 4 }), 5));
t('lineLine', (() => { const p = g.lineLine({ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 }, { x: 2, y: 0 }); return near(p.x, 1) && near(p.y, 1); })());
t('lineLine parallel', g.lineLine({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }) === null);
t('segSeg none', g.segSeg({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: -1 }, { x: 2, y: 1 }) === null);
t('foot', (() => { const f = g.foot({ x: 3, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 }); return near(f.x, 3) && near(f.y, 0); })());
t('reflect', (() => { const r = g.reflect({ x: 3, y: 5 }, { x: 0, y: 0 }, { x: 10, y: 0 }); return near(r.x, 3) && near(r.y, -5); })());
t('lineCircle 2', g.lineCircle({ x: -5, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 0 }, 2).length === 2);
t('lineCircle tangent', g.lineCircle({ x: -5, y: 2 }, { x: 5, y: 2 }, { x: 0, y: 0 }, 2).length === 1);
t('lineCircle none', g.lineCircle({ x: -5, y: 3 }, { x: 5, y: 3 }, { x: 0, y: 0 }, 2).length === 0);
t('circleCircle', (() => { const p = g.circleCircle({ x: 0, y: 0 }, 5, { x: 6, y: 0 }, 5); return p.length === 2 && near(p[0].x, 3) && near(Math.abs(p[0].y), 4); })());
t('circleCircle apart', g.circleCircle({ x: 0, y: 0 }, 1, { x: 6, y: 0 }, 1).length === 0);
t('tangentPoints', (() => { const p = g.tangentPoints({ x: 10, y: 0 }, { x: 0, y: 0 }, 5); return p.length === 2 && near(g.dist(p[0], { x: 0, y: 0 }), 5) && near(g.dot(g.sub(p[0], { x: 0, y: 0 }), g.sub(p[0], { x: 10, y: 0 })), 0, 1e-6); })());
t('circumcenter', (() => { const c = g.circumcenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }); return near(c.x, 2) && near(c.y, 1.5); })());
t('angle ccw', near(g.angle({ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }), Math.PI / 2));
t('inversion', (() => { const q = g.inversion({ x: 2, y: 0 }, { x: 0, y: 0 }, 4); return near(q.x, 2) && near(q.y, 0); })());
t('inversion 2', (() => { const q = g.inversion({ x: 4, y: 0 }, { x: 0, y: 0 }, 4); return near(q.x, 1); })());
t('curvature of circle', near(Math.abs(g.curvature(K.circle(10), 1)), 0.1, 1e-3));
t('center of curvature of circle', (() => { const c = g.centerOfCurvature(K.circle(10), 0.7); return near(c.x, 0, 1e-2) && near(c.y, 0, 1e-2); })());
t('arcLength of circle', near(g.arcLength(K.circle(10), 0, 2 * Math.PI, 2000), 2 * Math.PI * 10, 1e-2));

/* curves */
t('astroid = hypocycloid a/4', (() => { const a = 100, A = K.astroid(a), H = K.hypocycloid(a, a / 4); for (let i = 0; i < 20; i++) { const s = i * 0.3, p = A(s), q = H(s); if (!near(p[0], q[0], 1e-6) || !near(p[1], q[1], 1e-6)) return false; } return true; })());
t('cardioid = epicycloid a', (() => { const a = 50, Cd = K.cardioid(a), E = K.epicycloid(a, a); for (let i = 0; i < 20; i++) { const s = i * 0.3, p = Cd(s), q = E(s); if (!near(p[0], q[0], 1e-6) || !near(p[1], q[1], 1e-6)) return false; } return true; })());
t('nephroid = epicycloid 2a,a', (() => { const a = 50, N = K.nephroid(a), E = K.epicycloid(2 * a, a); for (let i = 0; i < 20; i++) { const s = i * 0.3, p = N(s), q = E(s); if (!near(p[0], q[0], 1e-6) || !near(p[1], q[1], 1e-6)) return false; } return true; })());
t('deltoid = hypocycloid 3a,a', (() => { const a = 50, D = K.deltoid(a), H = K.hypocycloid(3 * a, a); for (let i = 0; i < 20; i++) { const s = i * 0.3, p = D(s), q = H(s); if (!near(p[0], q[0], 1e-6) || !near(p[1], q[1], 1e-6)) return false; } return true; })());
t('cissoid equation', (() => { const a = 10, p = K.cissoid(a)(0.7); return near(p[1] * p[1] * (2 * a - p[0]), p[0] ** 3, 1e-6); })());
t('witch equation', (() => { const a = 10, p = K.witch(a)(0.4); return near(p[1] * (p[0] * p[0] + 4 * a * a), 8 * a ** 3, 1e-6); })());
t('folium equation', (() => { const a = 10, p = K.folium(a)(0.6); return near(p[0] ** 3 + p[1] ** 3, 3 * a * p[0] * p[1], 1e-6); })());
t('lemniscate equation', (() => { const a = 10, p = K.lemniscateParam(a)(0.5), r2 = p[0] ** 2 + p[1] ** 2; return near(r2 * r2, a * a * (p[0] ** 2 - p[1] ** 2), 1e-6); })());
t('strophoid equation', (() => { const a = 10, p = K.strophoid(a)(0.5); return near(p[1] * p[1] * (a - p[0]), p[0] * p[0] * (a + p[0]), 1e-5) || near(p[1] * p[1] * (a + p[0]), p[0] * p[0] * (a - p[0]), 1e-5); })());
t('tractrix tangent length', (() => { const a = 10, f = K.tractrix(a), s = 0.6, p = f(s), fr = g.frenet(f, s); const tx = p[0] - p[1] * fr.T.x / fr.T.y; return near(Math.hypot(tx - p[0], p[1]), a, 1e-3); })());
t('catenary', near(K.catenary(10)(0)[1], 10));
t('euler spiral starts flat', (() => { const p = K.euler(50)(1); return p[0] > 0.99 && Math.abs(p[1]) < 0.01; })());
t('pursuit samples', K.pursuit(2)[0][0] === 1);

/* a figure through the renderer */
const fig = C.figure({ id: 'fig-999', section: 'astroid', page: 1, title: 'test', build(k) {
  const O = k.pt(0, 0); k.given('g', () => { k.circle(O, 50); k.point(O, 'O'); k.axes(O, { x: [-60, 60], y: [-60, 60] }); });
  k.step('straightedge', 's', () => { k.line(O, k.pt(1, 1)); k.seg(O, k.pt(50, 0)); });
  k.step('pencil', 'p', () => { k.curve(K.astroid(50), [0, 2 * Math.PI]); });
} });
const sc = C.build(fig);
t('scene steps', sc.steps.length === 3);
t('bounds', sc.bounds.x0 < -50 && sc.bounds.x1 > 60);
const svg = C.svg(sc, { standalone: true });
t('svg has groups', (svg.match(/<g class="step"/g) || []).length === 3);
t('svg no NaN', !/NaN/.test(svg));
t('svg standalone', svg.startsWith('<?xml') && svg.includes('<style>'));
t('svg upTo', (C.svg(sc, { upTo: 0 }).match(/<g class="step"/g) || []).length === 1);
const T = C.targets(sc);
t('targets', T.length === 3 && T[0].t === 'line' && T[2].t === 'curve');
t('richText sub', C.richText('P_1') === 'P<tspan baseline-shift="sub" font-size="70%">1</tspan>');
t('bad point throws', (() => { try { C.build(C.figure({ id: 'fig-998', section: 'astroid', page: 1, title: 'x', build(k) { k.given('g', () => k.seg({ x: NaN, y: 0 }, { x: 1, y: 1 })); } })); return false; } catch (e) { return /bad point/.test(e.message); } })());

console.log(n + ' checks, ' + bad + ' failed');
process.exit(bad ? 1 : 0);
