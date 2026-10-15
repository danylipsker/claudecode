/* HYPER-CORE · ui/water-anomalies.js — Tools → Anomalies (#/tools/anomalies/<dashboard|list>)
 *
 *   dashboard  one property of water against temperature — density, expansion, heat capacity, compressibility,
 *              viscosity, speed of sound, dielectric constant, surface tension, vapour pressure, thermal conductivity,
 *              ion product — with the line a "normal" liquid would follow and the temperatures where water turns
 *   list       the anomalies as cards: what a normal liquid does, what water does, the number, the reason
 *
 * The physics is kit.water; shared helpers T.util.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, W = H.water;
  const T = H.waterTools = H.waterTools || {};
  const f = T.util.f;
  const TABS = [['dashboard', 'Property against temperature'], ['list', 'The list of anomalies']];

  T.anomalies = function (el, params, sub) {
    const t = T.util.subtabs(el, 'anomalies', TABS, sub, 'The "normal liquid" lines are the simplest trends — a straight thermal expansion, a flat heat capacity, an Arrhenius viscosity — fitted to water\'s own behaviour between 60 and 100 °C, where it is least strange, and extrapolated downwards. Supercooled values below 0 °C are from measurements on droplets and emulsions and are approximate.');
    ({ dashboard, list })[t.tab](t.body, params);
  };
  T.anomalies.tabs = TABS.map(t => t[0]);

  const label = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: K.colors().muted }, o));

  /* the properties: id, label, unit, fn(T °C), range, decimals, the "normal" line, marks of interest */
  const PROPS = [
    { id: 'density', name: 'Density', unit: 'kg/m³', fn: t => W.density(t), lo: -30, hi: 100, d: 2, normal: t => W.density(100) * (1 + 8.5e-4 * (100 - t)), note: 'A normal liquid shrinks steadily as it cools. Water stops shrinking at 3.98 °C and then swells; the solid is lighter still.', marks: [[W.TMAX, 'maximum']], prop: 'density' },
    { id: 'expansion', name: 'Thermal expansion coefficient', unit: 'ppm/K', fn: t => W.expansion(t) * 1e6, lo: -30, hi: 100, d: 0, normal: t => 850, note: 'Negative below 3.98 °C: warm the water and it shrinks. Ordinary liquids sit near +1,000 ppm/K at every temperature.', marks: [[W.TMAX, 'zero']], prop: 'expansion' },
    { id: 'cp', name: 'Specific heat capacity', unit: 'J/(kg·K)', fn: t => W.heatCapacity(t), lo: -30, hi: 100, d: 0, normal: t => 4200, note: 'Twice any common liquid, with a minimum near 35 °C and a climb towards a divergence when supercooled.', marks: [[35, 'minimum']], prop: 'cp' },
    { id: 'kappa', name: 'Isothermal compressibility', unit: '10⁻¹⁰/Pa', fn: t => W.compressibility(t) * 1e10, lo: -30, hi: 100, d: 2, normal: t => 4.41 + 0.004 * (t - 46), note: 'Hardest to squeeze at 46 °C; easier to compress on cooling below it, which no ordinary liquid does.', marks: [[46, 'minimum']], prop: 'kappa' },
    { id: 'viscosity', name: 'Viscosity', unit: 'mPa·s', fn: t => W.viscosity(t) * 1e3, lo: -20, hi: 100, d: 3, normal: t => 0.282 * Math.exp(1750 * (1 / (t + 273.15) - 1 / 373.15)), note: 'Rises faster than an Arrhenius law on cooling — the network stiffens. Under pressure, below 33 °C, it falls (not shown here).', marks: [[33, 'pressure anomaly below']], prop: 'viscosity', log: true },
    { id: 'sound', name: 'Speed of sound', unit: 'm/s', fn: t => W.speedOfSound(t), lo: -15, hi: 100, d: 1, normal: t => 1555 - 2.4 * (t - 74) * (t > 74 ? 1 : -1) * -1 + 0 * t, note: 'Rises with temperature to a maximum of 1,555 m/s at 74 °C, then falls. In most liquids it falls all the way.', marks: [[74, 'maximum']], prop: 'sound' },
    { id: 'eps', name: 'Dielectric constant', unit: '', fn: t => W.dielectric(t), lo: -30, hi: 100, d: 1, normal: t => 25, note: 'About 80: the force between two charges in water is divided by 80. Ethanol gives 25, hexane 2. Not an anomaly of shape but of size.', marks: [[25, '78.3']], prop: 'eps' },
    { id: 'sigma', name: 'Surface tension', unit: 'mN/m', fn: t => W.surfaceTension(t) * 1e3, lo: -30, hi: 100, d: 2, normal: t => 25, note: 'Three times an ordinary liquid\'s; a molecule at the surface loses hydrogen bonds. Falls almost linearly with temperature.', marks: [[20, '72.7']], prop: 'sigma' },
    { id: 'vapour', name: 'Vapour pressure', unit: 'kPa', fn: t => W.vapourPressure(t) / 1e3, lo: -30, hi: 100, d: 3, normal: t => W.vapourPressure(t) / 1e3 * 0 + 101.325 * Math.exp(4200 * (1 / 373.15 - 1 / (t + 273.15))), note: 'Follows Clausius–Clapeyron closely; the anomaly is in the number, not the shape — the latent heat is the highest of any common liquid.', marks: [[100, 'boils']], prop: 'vapour', log: true },
    { id: 'k', name: 'Thermal conductivity', unit: 'W/(m·K)', fn: t => W.thermalConductivity(t), lo: -20, hi: 100, d: 3, normal: t => 0.15, note: 'Four times an ordinary liquid\'s, and it rises with temperature while most liquids\' falls.', marks: [[25, '0.607']], prop: 'k' },
    { id: 'pkw', name: 'pKw (ion product)', unit: '', fn: t => W.pKw(t), lo: 0, hi: 100, d: 2, normal: t => 14, note: 'Neutral pH is pKw/2: 7.47 at 0 °C, 7.00 at 25 °C, 6.13 at 100 °C — hot pure water is not acidic, it is neutral at a lower pH.', marks: [[25, '14.00']], prop: 'eps' }
  ];

  function dashboard(el, params) {
    const L = T.util.lab(el, 'Pick a property. The solid line is water; the dashed line is what a well-behaved liquid would do, fitted to water between 60 and 100 °C and extrapolated downwards. The markers are the temperatures where water turns.', 0.5, { minH: 260, maxH: 420 });
    const ctl = K.controls(L.side, [
      { id: 'prop', type: 'select', label: 'Property', options: PROPS.map(p => [p.name, p.id]), value: params && params.prop && PROPS.some(p => p.id === params.prop) ? params.prop : 'density' },
      { id: 'T', label: 'Read at', min: -30, max: 100, step: 0.5, value: 25, unit: '°C' },
      { id: 'normal', type: 'check', label: 'Show the "normal liquid" line', value: true },
      { id: 'super', type: 'check', label: 'Include supercooled water (below 0 °C)', value: true }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['v', 'Water'], ['n', 'A normal liquid would give'], ['dev', 'Deviation'], ['note', '']]);
    const plot = K.plot(L.under, { x: { label: 'temperature (°C)' }, y: { label: '' }, legend: true }, 260);
    function draw() {
      const p = PROPS.find(q => q.id === V.prop);
      const lo = V.super ? p.lo : Math.max(0, p.lo), hi = p.hi;
      const pts = [], nrm = [];
      for (let t = lo; t <= hi; t += 0.5) { pts.push([t, p.fn(t)]); nrm.push([t, p.normal(t)]); }
      const Tc = Math.max(lo, Math.min(hi, V.T));
      const v = p.fn(Tc), n = p.normal(Tc);
      const ser = [{ pts, label: 'water' }];
      if (V.normal) ser.push({ pts: nrm, label: 'a normal liquid', dash: true });
      plot.set({ series: ser, x: { label: 'temperature (°C)', min: lo, max: hi }, y: { label: p.name + (p.unit ? ' (' + p.unit + ')' : ''), log: !!p.log }, vlines: p.marks.map(m => ({ x: m[0], label: m[1] })).concat([{ x: Tc, label: Tc + ' °C' }]), marks: [{ x: Tc, y: v, label: f(v, p.d) + ' ' + p.unit }] });
      ro.set('v', f(v, p.d) + ' ' + p.unit + ' at ' + Tc + ' °C');
      ro.set('n', f(n, p.d) + ' ' + p.unit);
      ro.set('dev', (v - n >= 0 ? '+' : '−') + f(Math.abs(v - n), p.d) + ' ' + p.unit + ' (' + (v - n >= 0 ? '+' : '−') + f(Math.abs((v / n - 1) * 100), 1) + ' %)');
      ro.set('note', p.note);
      // the stage: a strip of the anomaly cards for this property, as a quick visual
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      const cards = W.ANOMALIES.filter(a => a.prop === p.prop);
      label(c, cards.length + ' anomal' + (cards.length === 1 ? 'y' : 'ies') + ' of this kind', 12, 16, { color: C.text, size: 13, weight: 650 });
      const ch = Math.max(44, (Hh - 36) / Math.max(1, cards.length) - 6);
      cards.forEach((a, i) => {
        const y = 30 + i * (ch + 6);
        c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 1;
        c.fillRect(12, y, Wd - 24, ch); c.strokeRect(12.5, y + 0.5, Wd - 25, ch - 1);
        c.fillStyle = K.hue(212); c.fillRect(12, y, 4, ch);
        label(c, a.name, 24, y + 15, { color: C.text, size: 12.5, weight: 650 });
        label(c, a.value, 24, y + 31, { size: 11, color: C.accent });
        if (ch > 56) label(c, a.why.length > 90 ? a.why.slice(0, 88) + '…' : a.why, 24, y + 47, { size: 10.5 });
      });
    }
    L.st.onResize(draw);
    draw();
  }

  function list(el) {
    const groupsAll = [['Density and volume', ['density-max', 'ice-floats', 'negative-slope', 'expansion', 'polyamorph']], ['Melting, boiling and heat', ['bp', 'mp', 'lv', 'lf', 'cp', 'cp-min', 'k']], ['Squeezing, flowing, sounding', ['kappa-min', 'visc-pressure', 'sound-max', 'sigma']], ['Charge and isotopes', ['eps', 'proton', 'd2o']], ['Cold, pressure and the contested', ['supercooled', 'hot-ice', 'mpemba']]];
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">More than seventy properties of water are listed as anomalous in the physical-chemistry literature; these are the ones that matter most, each with what a well-behaved liquid would do, what water does, the number, and the reason — which is always, in the end, the hydrogen bond. Click a card for the property on the dashboard.</p><div class="abar"></div><div class="alist"></div>';
    const ctl = K.controls(ui.$('.abar', el), [{ id: 'g', type: 'select', label: 'Show', options: [['All groups', 'all']].concat(groupsAll.map(g => [g[0], g[0]])), value: 'all' }], () => draw());
    const V = ctl.values;
    function draw() {
    const groups = groupsAll.filter(g => V.g === 'all' || g[0] === V.g);
    ui.$('.alist', el).innerHTML = groups.map(([title, ids]) => '<h3 style="margin:18px 0 8px;font-size:17px">' + esc(title) + '</h3><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:10px">' +
        ids.map(id => W.ANOMALIES.find(a => a.id === id)).filter(Boolean).map(a => '<a class="dict-e" href="#/tools/anomalies/dashboard?prop=' + encodeURIComponent({ density: 'density', expansion: 'expansion', cp: 'cp', kappa: 'kappa', viscosity: 'viscosity', sound: 'sound', eps: 'eps', sigma: 'sigma', vapour: 'vapour', melting: 'density', k: 'k' }[a.prop] || 'density') + '" style="display:block;text-decoration:none;color:inherit"><b>' + esc(a.name) + '</b><p style="margin:4px 0 2px"><span class="muted">A normal liquid:</span> ' + esc(a.normal) + '</p><p style="margin:2px 0"><span class="muted">Water:</span> ' + esc(a.water) + '</p><p style="margin:2px 0;color:var(--accent)">' + esc(a.value) + '</p><p style="margin:2px 0 0"><span class="muted">Why:</span> ' + esc(a.why) + '</p></a>').join('') + '</div>').join('') +
      '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + ['the-list-of-anomalies', 'density-and-expansion-anomalies', 'heat-capacity-and-compressibility-anomalies', 'viscosity-and-diffusion-under-pressure', 'two-liquids-in-one', 'the-strange-reason'].map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.nodes.has(id) ? H.titleOf(id) : id) + '</a>').join('') + '</div>';
    }
    draw();
  }
})();
