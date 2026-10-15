/* HYPER-WATER · sims/the-ice-that-floats.js — the simulations of the topic "The ice that floats" (topic code ice-).
 *   ice-density-curve   density against temperature: water's maximum at 3.98 °C against a "normal liquid", with a
 *                       salinity slider (salt moves the maximum below the freezing point) and heavy water
 *   ice-lake-seasons    a one-dimensional lake through the year (schematic): autumn turnover, winter inverse
 *                       stratification under the ice, spring turnover, summer stratification; salt water and the
 *                       thought experiment of ice that sinks
 *   ice-burst-pipe      water freezing in a closed pipe: the pressure the ice can reach along the melting curve
 *                       against the strength of the pipe wall
 *   ice-snowflake       a six-fold crystal grown by a hexagonal cellular model (Reiter's rules, schematic), with the
 *                       Nakaya habit diagram and the water-saturation line from the engine
 *   ice-slippery        the quasi-liquid layer against temperature (schematic power law) and what a skate's pressure
 *                       can and cannot do (melting slope from the engine)
 *   ice-droplets        supercooled droplets cooling until they freeze: classical nucleation theory for pure water,
 *                       ice-nucleating particles, the freezing spectrum
 *   ice-glacier         a glacier deforming under Glen's flow law: the velocity profile, the stakes drawn forward
 *   ice-mpemba          two cooling curves under Newton's law, with evaporation and supercooling switches (schematic)
 * Numbers come from kit.water wherever the engine has them; the models written here are labelled schematic.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MLEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function dateOf(day) {
    let d = Math.floor(((day % 365) + 365) % 365);
    for (let i = 0; i < 12; i++) { if (d < MLEN[i]) return (d + 1) + ' ' + MONTHS[i]; d -= MLEN[i]; }
    return '31 Dec';
  }
  /* a colour for a water temperature: pale ice-blue at 0, deep blue at 4 °C (the densest), then teal, yellow, red */
  const RAMP = [[-2, [214, 238, 255]], [0, [188, 226, 252]], [4, [28, 84, 196]], [8, [70, 160, 200]], [14, [150, 205, 150]], [19, [236, 205, 80]], [26, [228, 96, 52]]];
  function tcol(T, a) {
    let i = 0;
    while (i < RAMP.length - 2 && T > RAMP[i + 1][0]) i++;
    const t0 = RAMP[i][0], c0 = RAMP[i][1], t1 = RAMP[i + 1][0], c1 = RAMP[i + 1][1], f = clamp((T - t0) / (t1 - t0), 0, 1);
    return 'rgba(' + [0, 1, 2].map(k => Math.round(lerp(c0[k], c1[k], f))).join(',') + ',' + (a == null ? 1 : a) + ')';
  }
  function legend(c, kit, x, y, w, labelT) {
    const C = kit.colors();
    for (let i = 0; i < w; i++) { c.fillStyle = tcol(lerp(-1, 24, i / w)); c.fillRect(x + i, y, 1.5, 9); }
    for (const T of labelT) { const px = x + (T + 1) / 25 * w; c.fillStyle = C.text; c.fillRect(px, y + 9, 1, 3); kit.label(c, T + ' °C', px, y + 14, { size: 10, color: C.muted, align: 'center', baseline: 'top' }); }
  }

  /* ================================================================ the density curve */
  Hyper.sim('ice-density-curve', {
    title: 'Water is densest at 4 °C',
    blurb: `Density against temperature. The dashed line is a **normal liquid** that keeps shrinking as it cools; water follows it down to 3.98 °C and then turns back, so that the coldest water (0 °C) is *lighter* than water at 4 °C. The hump is tiny — 0.13 kg/m³ out of 1,000 — but it decides which water sinks.

**Try this**
- Untick *zoom* to see the whole curve beside the normal liquid; tick it to magnify the hump, where the vertical scale spans a few hundredths of a per cent.
- Add **salt**: the maximum moves down by 0.22 K for every g/kg while the freezing point falls by only 0.054 K. Above about 24.5 g/kg the maximum lies *below* the freezing point, and sea water (35 g/kg) never reaches it. (The shift of the maximum is a fitted model, schematic beyond the sea-water value of about −3.5 °C.)
- Switch to **heavy water**: its maximum is at 11.2 °C and it freezes at 3.8 °C, so it freezes before it reaches its hump.
- Slide the marker and watch the sign of the expansion coefficient change at the maximum.`,
    mount(box, kit, params) {
      const W = kit.water;
      const plotEl = document.createElement('div');
      plotEl.style.padding = '6px 10px 10px';
      box.stage.appendChild(plotEl);
      const plot = kit.plot(plotEl, { x: { label: 'temperature (°C)' }, y: { label: 'density (kg/m³)' }, legend: true }, 340);
      const ctl = kit.controls(box.side, [
        { id: 'S', label: 'Salt in the water', min: 0, max: 40, step: 0.5, value: params.salinity != null ? params.salinity : 0, unit: 'g/kg' },
        { id: 'T', label: 'Marker', min: -5, max: 30, step: 0.1, value: params.T != null ? params.T : 10, unit: '°C' },
        { id: 'zoom', type: 'check', label: 'Zoom on the maximum', value: params.zoom != null ? !!params.zoom : true },
        { id: 'normal', type: 'check', label: 'Show a normal liquid', value: true },
        { id: 'd2o', type: 'check', label: 'Heavy water instead (D₂O)', value: !!params.d2o }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rho', 'Density at the marker'], ['alpha', 'Expansion coefficient there'], ['tmax', 'Temperature of maximum density'], ['tf', 'Freezing point'], ['verdict', 'Which comes first']]);
      const rhoOf = (T, S) => V.d2o ? W.densityD2O(T) : W.density(T + 0.2169 * S) + 0.76 * S;
      const tmax = S => V.d2o ? W.D2O.Tmax : W.TMAX - 0.2169 * S;
      const tfz = S => V.d2o ? W.D2O.mp : -0.0543 * S;
      function draw() {
        const S = V.d2o ? 0 : V.S, C = kit.colors();
        const Tm = tmax(S), Tfz = tfz(S);
        const x0 = V.zoom ? Math.min(-2, Tfz - 0.5, Tm - 3) : -5, x1 = V.zoom ? Math.max(12, Tm + 6) : 30, n = 140;
        const pts = [], normal = [];
        /* the normal liquid keeps the density of this liquid at 20 °C and contracts on cooling at the rate water
           expands at 20 °C: it never turns back */
        const r20 = rhoOf(20, S), a20 = W.expansion(20);
        for (let i = 0; i <= n; i++) {
          const T = x0 + (x1 - x0) * i / n;
          pts.push([T, rhoOf(T, S)]);
          normal.push([T, r20 * Math.exp(a20 * (20 - T))]);
        }
        let ymin = Infinity, ymax = -Infinity;
        for (const p of pts) { ymin = Math.min(ymin, p[1]); ymax = Math.max(ymax, p[1]); }
        if (V.zoom) { const pad = Math.max(0.02, (ymax - ymin) * 0.2); ymin -= pad; ymax += pad; }
        else if (V.normal) for (const p of normal) { ymin = Math.min(ymin, p[1]); ymax = Math.max(ymax, p[1]); }
        const series = [{ pts, label: V.d2o ? 'heavy water' : S > 0 ? 'water with ' + S + ' g/kg salt' : 'water', color: C.accent }];
        if (V.normal && !V.zoom) series.push({ pts: normal, label: 'a normal liquid', dash: true, color: C.muted });
        const marks = [{ x: V.T, y: rhoOf(V.T, S), label: V.T.toFixed(1) + ' °C' }];
        const vlines = [{ x: Tm, label: 'maximum ' + Tm.toFixed(2) + ' °C' }, { x: Tfz, label: 'freezes ' + Tfz.toFixed(2) + ' °C' }].filter(v => v.x >= x0 && v.x <= x1);
        plot.set({ series, x: { label: 'temperature (°C)', min: x0, max: x1 }, y: { label: 'density (kg/m³)', min: ymin, max: ymax }, marks, vlines });
        const h = 0.05, a = -(rhoOf(V.T + h, S) - rhoOf(V.T - h, S)) / (2 * h) / rhoOf(V.T, S);
        ro.set('rho', rhoOf(V.T, S).toFixed(3) + ' kg/m³');
        ro.set('alpha', (a * 1e6).toFixed(1) + ' ppm/K ' + (a < -1e-9 ? '(shrinks on warming)' : a > 1e-9 ? '(expands on warming)' : '(at the maximum)'));
        ro.set('tmax', Tm.toFixed(2) + ' °C');
        ro.set('tf', Tfz.toFixed(2) + ' °C');
        ro.set('verdict', Tm > Tfz ? 'the maximum, at ' + Tm.toFixed(1) + ' °C, comes first' : 'freezing, at ' + Tfz.toFixed(1) + ' °C: the maximum is never reached');
      }
      draw();
    }
  });

  /* ================================================================ a lake through the year */
  /* A one-dimensional lake of N layers (schematic): each layer has a temperature and a salinity; the surface layer
     exchanges heat with the air; an ice lid grows by Stefan's law through snow and ice and melts in spring; layers
     that come out denser than the layer below mix with it (convective adjustment), the top few are stirred by the
     wind while the lake is open, and heat creeps between layers by a small eddy diffusion. Density of the water uses
     the engine, shifted for salt. */
  const LAKE = { cw: 4186, rw: 1000, ri: 917, Lf: 333.55e3, ki: 2.2, hex: 25, snowR: 0.25, Kd: 2e-6 };
  function lakeRho(W, T, S) { return W.density(T + 0.2169 * S) + 0.76 * S; }
  function airTemp(d) { return 6 - 16 * Math.cos(TAU * (d - 15) / 365) + 2.2 * Math.sin(d * 0.93) + 1.5 * Math.sin(d * 2.1); }
  function newLake(N, depth, S0) {
    return { N, depth, dz: depth / N, T: new Float64Array(N).fill(10), S: new Float64Array(N).fill(S0), h: 0, pile: 0, day: 0 };
  }
  function liveLayers(m) { return m.N - Math.min(m.N, Math.ceil(m.pile / m.dz - 1e-9)); }
  function stepLake(W, m, dt, o) {
    const N = m.N, dz = m.dz, T = m.T, S = m.S, L = LAKE;
    const M = liveLayers(m);
    if (M <= 0) { m.day += dt / 86400; return; }
    const ta = airTemp(m.day), Kd = L.Kd * dt / (dz * dz);
    const nT = Float64Array.from(T), nS = Float64Array.from(S);
    let qpile = 0;
    for (let i = 0; i < M; i++) {
      const a = i > 0 ? i - 1 : i, b = i < M - 1 ? i + 1 : i;
      const bT = i < M - 1 ? T[i + 1] : (m.pile > 0 ? Math.min(0, -0.0543 * S[i]) : T[i]);
      nT[i] += Kd * (T[a] - T[i] + bT - T[i]);
      nS[i] += Kd * (S[a] - S[i] + S[b] - S[i]);
      if (i === M - 1 && m.pile > 0) qpile = L.rw * L.cw * Kd * dz * (T[i] - bT) / dt;
    }
    for (let i = 0; i < M; i++) { T[i] = nT[i]; S[i] = nS[i]; }
    const tf = -0.0543 * S[0];
    if (m.h > 0 && !o.sink) {
      const q = (tf - ta) / (m.h / L.ki + 1 / L.hex + L.snowR);
      const qw = L.rw * L.cw * L.Kd * (T[0] - tf) / dz;
      let dh = ((q >= 0 ? q : q * 2.5) - qw) * dt / (L.ri * L.Lf);
      dh = Math.max(dh, -m.h);
      S[0] += (L.ri / L.rw) * (dh / dz) * (S[0] - 0.14 * S[0]);
      m.h += dh; T[0] = tf;
      if (m.h <= 1e-4) m.h = 0;
    } else {
      T[0] += L.hex * (ta - T[0]) * dt / (L.rw * L.cw * dz);
      if (T[0] < tf) {
        const dh = (tf - T[0]) * L.rw * L.cw * dz / (L.ri * L.Lf);
        T[0] = tf;
        if (o.sink) m.pile += dh; else { m.h += dh; S[0] += (L.ri / L.rw) * (dh / dz) * (S[0] - 0.14 * S[0]); }
      }
    }
    if (o.sink && m.pile > 0 && qpile > 0) m.pile = Math.max(0, m.pile - qpile * dt / (L.ri * L.Lf));
    const M2 = liveLayers(m);
    if (m.h <= 0 && M2 > 0) {
      const k = Math.min(M2, Math.max(1, Math.round((o.wind == null ? 0.3 : o.wind) * 0.3 * N)));
      let t = 0, s = 0;
      for (let i = 0; i < k; i++) { t += T[i]; s += S[i]; }
      t /= k; s /= k;
      for (let i = 0; i < k; i++) { T[i] = t; S[i] = s; }
    }
    for (let pass = 0; pass < 60; pass++) {
      let moved = false;
      for (let i = 0; i < M2 - 1; i++) {
        if (lakeRho(W, T[i], S[i]) > lakeRho(W, T[i + 1], S[i + 1]) + 1e-7) {
          const t = (T[i] + T[i + 1]) / 2, s = (S[i] + S[i + 1]) / 2;
          T[i] = T[i + 1] = t; S[i] = S[i + 1] = s; moved = true;
        }
      }
      if (!moved) break;
    }
    m.day += dt / 86400;
  }

  Hyper.sim('ice-lake-seasons', {
    title: 'A lake through the year',
    blurb: `A lake from the side, in a **schematic one-dimensional model**: layers that mix whenever the upper one is denser than the one below, heated and cooled from the surface by the air, with an ice lid that grows in winter and melts in spring. The colours are temperatures: pale = near 0 °C, **deep blue = 4 °C, the densest water**, then warm greens, yellows and reds. The curves on the right show air, surface and bottom temperature through the year.

**Try this**
- Watch the autumn: as the surface cools to 4 °C it sinks and the whole lake mixes (*turnover*). Colder surface water is lighter and stays on top — the lake freezes from the top, with 4 °C water at the bottom beneath a 0 °C lid.
- In spring the lid melts, the surface warms to 4 °C and sinks: the second turnover. Then the summer layers pile up, warm over cold.
- Tick **If ice sank**: new ice falls to the bottom, the surface stays bare and keeps freezing, and the pile is hard to melt — run a few winters.
- Raise the **salt** to 35 g/kg: no 4 °C layer ever forms and the whole column keeps overturning until it reaches −1.9 °C; the ice that forms rejects salt downward.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const START = { winter: 28, spring: 105, summer: 200, autumn: 295 };
      const ctl = kit.controls(box.side, [
        { id: 'depth', label: 'Depth of the lake', min: 5, max: 40, step: 1, value: params.depth || 20, unit: 'm' },
        { id: 'S', label: 'Salt in the water', min: 0, max: 35, step: 0.5, value: params.salinity || 0, unit: 'g/kg' },
        { id: 'wind', label: 'Wind stirring', min: 0, max: 1, step: 0.05, value: 0.3 },
        { id: 'speed', label: 'Time', min: 2, max: 80, step: 1, value: 28, unit: 'days/s' },
        { id: 'sink', type: 'check', label: 'If ice sank (thought experiment)', value: !!params.sink },
        { id: 'run', type: 'check', label: 'Running', value: true },
        { type: 'buttons', items: [{ id: 'winter', label: 'Winter' }, { id: 'spring', label: 'Spring' }, { id: 'summer', label: 'Summer' }, { id: 'autumn', label: 'Autumn', primary: true }] }
      ], (id) => {
        if (START[id] != null) { target = START[id]; rebuild(); }
        else if (id === 'depth' || id === 'S' || id === 'sink') { target = lake ? lake.day % 365 : target; rebuild(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['date', 'Date'], ['air', 'Air temperature'], ['ts', 'Surface water'], ['tb', 'Bottom water'], ['ice', 'Ice'], ['state', 'The lake is in']]);
      let lake = null, target = START[params.season] != null ? START[params.season] : 295, hist = [];
      function rebuild() {
        lake = newLake(20, V.depth, V.S);
        const o = { wind: V.wind, sink: V.sink };
        hist = [];
        const end = 365 * 2 + target;
        for (let k = 0; lake.day < end && k < 20000; k++) { stepLake(W, lake, 21600, o); record(); }
      }
      function record() {
        const d = Math.floor(lake.day % 365), M = liveLayers(lake);
        hist[d] = [lake.T[0], M > 0 ? lake.T[M - 1] : -0.0543 * lake.S[0], airTemp(lake.day)];
      }
      rebuild();
      let acc = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.run) {
          acc += Math.min(dt, 0.05) * V.speed * 4;
          const o = { wind: V.wind, sink: V.sink };
          let n = 0;
          while (acc >= 1 && n < 40) { stepLake(W, lake, 21600, o); record(); acc -= 1; n++; }
          if (n === 40) acc = 0;
        }
        const m = lake, N = m.N, M = liveLayers(m);
        const lx = 52, lw = Math.min(Wd * 0.4, 250), top = 64, bot = Hh - 52, lh = bot - top, ly = i => top + lh * i / N;
        /* sky and air */
        const ta = airTemp(m.day);
        c.fillStyle = ta < 0 ? 'rgba(180,200,230,0.18)' : 'rgba(255,220,120,0.14)';
        c.fillRect(lx - 30, 8, lw + 60, top - 8);
        kit.label(c, 'air ' + ta.toFixed(1) + ' °C', lx + lw / 2, 22, { size: 12, color: ta < 0 ? C.accent : C.warn, align: 'center', weight: 650 });
        /* the lake */
        for (let i = 0; i < N; i++) {
          if (i >= M) { c.fillStyle = 'rgba(235,245,255,0.95)'; c.fillRect(lx, ly(i), lw, lh / N + 0.6); continue; }
          c.fillStyle = tcol(m.T[i]); c.fillRect(lx, ly(i), lw, lh / N + 0.6);
          if (m.S[i] > 0.5) { c.fillStyle = 'rgba(255,255,255,' + (0.25 * m.S[i] / 40) + ')'; c.fillRect(lx, ly(i), lw, lh / N + 0.6); }
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(lx, top - 2); c.lineTo(lx, bot); c.lineTo(lx + lw, bot); c.lineTo(lx + lw, top - 2); c.stroke();
        if (m.h > 0) {
          const ih = Math.max(5, Math.min(30, m.h / m.depth * lh * 6));
          c.fillStyle = 'rgba(236,246,255,0.96)'; c.fillRect(lx - 4, top - ih, lw + 8, ih);
          c.strokeStyle = C.accent; c.lineWidth = 1; c.strokeRect(lx - 4, top - ih, lw + 8, ih);
          kit.label(c, 'ice ' + (m.h * 100).toFixed(0) + ' cm (drawn thicker)', lx + lw + 12, top - ih / 2, { size: 11, color: C.muted, baseline: 'middle' });
        }
        /* layer temperatures at a few depths */
        for (const i of [0, Math.floor(N / 2), N - 1]) {
          const ii = Math.min(i, Math.max(0, M - 1));
          kit.label(c, (M > 0 ? m.T[ii] : 0).toFixed(1) + ' °C', lx + lw + 10, ly(i) + lh / N / 2, { size: 11, color: C.text, baseline: 'middle' });
        }
        kit.label(c, '0 m', lx - 6, top, { size: 10, color: C.muted, align: 'right', baseline: 'middle' });
        kit.label(c, m.depth + ' m', lx - 6, bot, { size: 10, color: C.muted, align: 'right', baseline: 'middle' });
        /* a fish near the bottom, where it lives in winter */
        if (M > 2) {
          const fy = ly(M - 2) + lh / N / 2, fx = lx + lw * 0.5 + 18 * Math.sin(m.day * 0.7);
          c.fillStyle = 'rgba(20,30,60,0.85)'; c.beginPath(); c.ellipse(fx, fy, 9, 4, 0, 0, TAU); c.fill();
          c.beginPath(); c.moveTo(fx - 8, fy); c.lineTo(fx - 15, fy - 4); c.lineTo(fx - 15, fy + 4); c.closePath(); c.fill();
        }
        if (M <= 0) kit.label(c, 'frozen solid', lx + lw / 2, (top + bot) / 2, { size: 14, color: C.bad, align: 'center', weight: 700 });
        else if (m.pile > 0) kit.label(c, 'ice on the bottom: ' + m.pile.toFixed(1) + ' m', lx + lw / 2, bot - 8, { size: 11, color: C.text, align: 'center', baseline: 'bottom', weight: 650 });
        legend(c, kit, lx, Hh - 30, Math.min(lw, 200), [0, 4, 10, 20]);
        /* the year, on the right */
        const gx = lx + lw + 78, gw = Wd - gx - 18, gy = 40, gh = Hh - 110;
        if (gw > 80) {
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
          const Tmin = -14, Tmax = 26, yy = T => gy + gh * (1 - (T - Tmin) / (Tmax - Tmin)), xx = d => gx + gw * d / 365;
          c.strokeStyle = C.faint; c.setLineDash([3, 3]);
          for (const T of [0, 4]) { c.beginPath(); c.moveTo(gx, yy(T)); c.lineTo(gx + gw, yy(T)); c.stroke(); }
          c.setLineDash([]);
          kit.label(c, '4 °C', gx + 3, yy(4) - 2, { size: 10, color: C.muted, baseline: 'bottom' });
          kit.label(c, '0 °C', gx + 3, yy(0) - 2, { size: 10, color: C.muted, baseline: 'bottom' });
          [[2, C.faint, 'air'], [0, C.warn, 'surface'], [1, C.accent, 'bottom']].forEach(([k, col, name], row) => {
            c.strokeStyle = col; c.lineWidth = k === 2 ? 1 : 2; c.beginPath(); let started = false;
            for (let d = 0; d < 365; d++) { const hd = hist[d]; if (!hd) { started = false; continue; } const x = xx(d), y = yy(clamp(hd[k], Tmin, Tmax)); if (started) c.lineTo(x, y); else { c.moveTo(x, y); started = true; } }
            c.stroke();
            kit.label(c, name, gx + gw - 6, gy + 10 + row * 13, { size: 10.5, color: col, align: 'right' });
          });
          const cx = xx(m.day % 365); c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, gy); c.lineTo(cx, gy + gh); c.stroke();
          for (let i = 0; i < 12; i += 2) kit.label(c, MONTHS[i], xx(MLEN.slice(0, i).reduce((a, b) => a + b, 0) + 15), gy + gh + 4, { size: 10, color: C.muted, align: 'center', baseline: 'top' });
          kit.label(c, 'temperature through the year (°C)', gx, gy - 8, { size: 10.5, color: C.muted, baseline: 'bottom' });
        }
        kit.label(c, 'schematic one-dimensional model', 14, Hh - 6, { size: 10, color: C.faint, baseline: 'bottom' });
        /* readouts */
        const Ts = m.T[0], Tb = M > 0 ? m.T[M - 1] : 0;
        ro.set('date', dateOf(m.day) + ', year ' + (Math.floor(m.day / 365) - 1));
        ro.set('air', ta.toFixed(1) + ' °C');
        ro.set('ts', Ts.toFixed(2) + ' °C');
        ro.set('tb', Tb.toFixed(2) + ' °C');
        ro.set('ice', M <= 0 ? 'solid to the bottom' : m.h > 0 ? (m.h * 100).toFixed(0) + ' cm on top' : m.pile > 0 ? m.pile.toFixed(1) + ' m on the bottom' : 'none');
        const dT = Ts - Tb;
        ro.set('state', M <= 0 ? 'a solid block' : m.h > 0 ? 'winter inverse stratification (cold lid, warmer bottom)' : Math.abs(dT) < 0.7 ? ((m.day % 365) > 182 ? 'autumn turnover (mixed)' : 'spring turnover (mixed)') : dT > 0 ? 'summer stratification (warm over cold)' : 'inverse stratification (cold over warm)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ice in a closed pipe */
  Hyper.sim('ice-burst-pipe', {
    title: 'Ice in a closed pipe',
    blurb: `Water freezing in a pipe, bottle or crack that cannot give way. Freezing wants 9 % more room; with none, the ice and the water left over push on the wall — but never harder than the **melting curve** allows, because squeezed ice melts. At −10 °C that ceiling is 110 MPa, over a thousand atmospheres. The wall is the only thing that decides whether the container survives.

**Try this**
- Choose the glass bottle, no free room, and cool from 0 °C: the melting curve climbs by about 135 bar for every kelvin at first, so a quarter of a kelvin below freezing already exceeds what glass can take.
- Switch to the steel pipe: it holds for the whole range of the curve.
- Give the water **room**: with 5 % of the volume free as air (or a flexible wall), the pressure is capped near 100 MPa, and at 9 % it is hardly more than atmospheric. That is why a half-full bottle survives the freezer and a brim-full one does not.
- The graph shows the two limits: the melting curve (dotted) and the pressure the confined ice can actually reach (solid), against the wall's strength (horizontal line). A schematic model: a real wall also stretches, and a pipe usually bursts where a plug of ice has trapped water against a closed tap.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 190, maxH: 250 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)', reverse: true }, y: { label: 'pressure (MPa)', min: 0 }, legend: true }, 250);
      const MAT = [['Glass bottle (about 3 MPa)', 3], ['PVC pipe (about 8 MPa)', 8], ['Granite crack (about 12 MPa)', 12], ['Copper pipe, 15 mm (about 20 MPa)', 20], ['Cast-iron pipe (about 30 MPa)', 30], ['Steel pipe (about 100 MPa)', 100]];
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature of the ice', min: -22, max: 0, step: 0.1, value: params.T != null ? params.T : -8, unit: '°C' },
        { id: 'pb', type: 'select', label: 'The container', options: MAT, value: params.pb || 20 },
        { id: 'air', label: 'Free room inside (air, flexible wall)', min: 0, max: 9, step: 0.25, value: params.air != null ? params.air : 1, unit: '%' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Pressure of the ice (gauge)'], ['pm', 'Ceiling: melting-curve pressure'], ['x', 'Fraction frozen'], ['pb', 'Strength of the container'], ['verdict', 'Result']]);
      const KEFF = 2.5e9, DV = 0.0907;   // effective stiffness of the water–ice mixture (schematic), expansion on freezing
      const pMelt = T => T >= -0.001 ? 0 : Math.max(0, W.meltingPressure(clamp(T, -21.98, 0) + 273.15) - 101325);
      const cap = a => KEFF * Math.max(0, DV - a / 100);
      const pOf = (T, a) => Math.min(pMelt(T), cap(a));
      const xOf = (T, a) => { const pm = pMelt(T), c = cap(a); return pm <= c ? clamp((pm / KEFF + a / 100) / DV, 0, 1) : 1; };
      let pBurst = 0, tBurst = null;
      function update() {
        const C = kit.colors(), a = V.air;
        pBurst = V.pb * 1e6; tBurst = null;
        for (let T = 0; T >= -22; T -= 0.02) if (pOf(T, a) >= pBurst) { tBurst = T; break; }
        const melt = [], real = [];
        for (let i = 0; i <= 80; i++) { const T = -22 * i / 80; melt.push([T, pMelt(T) / 1e6]); real.push([T, pOf(T, a) / 1e6]); }
        plot.set({ series: [{ pts: melt, label: 'melting curve (the ceiling)', dash: true, color: C.muted }, { pts: real, label: 'pressure the ice reaches', color: C.accent }],
          x: { label: 'temperature (°C)', reverse: true, min: -22, max: 0 }, y: { label: 'pressure (MPa)', min: 0, max: 230 },
          hlines: [{ y: V.pb, label: 'wall strength ' + V.pb + ' MPa' }], marks: [{ x: V.T, y: pOf(V.T, a) / 1e6, label: (pOf(V.T, a) / 1e6).toFixed(1) + ' MPa' }] });
        ro.set('p', (pOf(V.T, a) / 1e6).toFixed(1) + ' MPa (' + (pOf(V.T, a) / 1e5).toFixed(0) + ' bar)');
        ro.set('pm', (pMelt(V.T) / 1e6).toFixed(1) + ' MPa at ' + V.T.toFixed(1) + ' °C');
        ro.set('x', (100 * xOf(V.T, a)).toFixed(0) + ' %');
        ro.set('pb', V.pb + ' MPa');
        ro.set('verdict', tBurst == null ? 'never bursts in this range' : pOf(V.T, a) >= pBurst ? 'BURST, from ' + tBurst.toFixed(1) + ' °C downward' : 'intact; it will burst at ' + tBurst.toFixed(1) + ' °C');
      }
      update();
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const a = V.air, p = pOf(V.T, a), x = xOf(V.T, a), burst = p >= V.pb * 1e6;
        const cx = Math.min(Wd * 0.28, 150), cy = Hh / 2, R0 = Math.min(Hh * 0.42, 90);
        const wall = 4 + 7 * Math.log10(1 + V.pb / 3);
        const Ri = R0 - wall;
        c.beginPath(); c.arc(cx, cy, R0, 0, TAU); c.fillStyle = C.faint; c.fill();
        c.beginPath(); c.arc(cx, cy, Ri, 0, TAU); c.fillStyle = 'rgba(70,150,235,0.55)'; c.fill();
        // ice grows from the wall inwards: an annulus
        const rIn = Ri * Math.sqrt(Math.max(0, 1 - x));
        c.beginPath(); c.arc(cx, cy, Ri, 0, TAU); c.arc(cx, cy, Math.max(0, rIn), 0, TAU, true); c.fillStyle = 'rgba(236,246,255,0.95)'; c.fill();
        if (a > 0.2) { c.beginPath(); c.arc(cx, cy, Math.max(1, Ri * Math.sqrt(a / 100) * 1.2), 0, TAU); c.fillStyle = 'rgba(40,50,80,0.7)'; c.fill(); }
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, R0, 0, TAU); c.stroke();
        if (burst) {
          c.strokeStyle = C.bad; c.lineWidth = 3;
          for (const ang of [0.5, 2.3, 4.0]) { c.beginPath(); c.moveTo(cx + (Ri - 2) * Math.cos(ang), cy + (Ri - 2) * Math.sin(ang)); c.lineTo(cx + (R0 + 12) * Math.cos(ang + 0.08), cy + (R0 + 12) * Math.sin(ang + 0.08)); c.stroke(); }
        }
        kit.label(c, 'cross-section of the container', cx, Hh - 8, { size: 11, color: C.muted, align: 'center', baseline: 'bottom' });
        kit.label(c, 'ice ' + (100 * x).toFixed(0) + ' %', cx, cy - R0 - 8, { size: 11.5, color: C.text, align: 'center', baseline: 'bottom' });
        // pressure gauge: bar against the wall strength, on a log scale from 0.1 to 300 MPa
        const gx = cx + R0 + 60, gw = Wd - gx - 20, gy = cy - 12;
        if (gw > 60) {
          const lx = v => gx + gw * clamp((Math.log10(Math.max(v, 0.1)) + 1) / 3.5, 0, 1);
          c.fillStyle = C.faint; c.fillRect(gx, gy, gw, 24);
          c.fillStyle = burst ? C.bad : C.accent; c.fillRect(gx, gy, lx(p / 1e6) - gx, 24);
          c.fillStyle = C.text; c.fillRect(lx(V.pb) - 1, gy - 8, 3, 40);
          kit.label(c, 'wall ' + V.pb + ' MPa', lx(V.pb), gy - 12, { size: 11, color: C.text, align: 'center', baseline: 'bottom' });
          kit.label(c, 'ice pressure ' + (p / 1e6).toFixed(1) + ' MPa', gx, gy + 40, { size: 11.5, color: burst ? C.bad : C.text, weight: 650 });
          for (const v of [0.1, 1, 10, 100]) kit.label(c, v + '', lx(v), gy + 62, { size: 10, color: C.muted, align: 'center' });
          kit.label(c, 'MPa, logarithmic', gx + gw, gy + 76, { size: 10, color: C.faint, align: 'right' });
          if (burst) kit.label(c, 'the container fails', gx, gy - 34, { size: 13, color: C.bad, weight: 700 });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a snowflake grows */
  /* Reiter's cellular model of snow-crystal growth (2005; Gravner and Griffeath's variants), on a hexagonal grid
     in axial coordinates. Each cell holds a vapour/ice mass s. A cell is *receptive* if it is frozen (s >= 1) or has a
     frozen neighbour. Receptive cells do not diffuse: they keep their mass and gain gamma (the vapour that settles).
     Other cells diffuse: s relaxes towards the mean of its six neighbours with weight alpha/2. The boundary is held
     at the background vapour density beta. The mapping from temperature and humidity to (beta, gamma) is schematic. */
  const HEX_NB = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];
  function makeFlake(R) {
    const N = 2 * R + 1, g = { R, N, s: new Float64Array(N * N), fr: new Uint8Array(N * N), inside: new Uint8Array(N * N), edge: new Uint8Array(N * N), u: new Float64Array(N * N), v: new Float64Array(N * N), out: new Float64Array(N * N), count: 0, touched: false };
    for (let q = -R; q <= R; q++) for (let r = -R; r <= R; r++) {
      const i = (q + R) * N + (r + R), d = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
      g.inside[i] = d <= R ? 1 : 0; g.edge[i] = d === R ? 1 : 0;
    }
    return g;
  }
  function seedFlake(g, beta) {
    g.s.fill(beta); g.fr.fill(0); g.count = 1; g.touched = false;
    const c = g.R * g.N + g.R; g.s[c] = 1; g.fr[c] = 1;
  }
  function stepFlake(g, alpha, beta, gamma) {
    const R = g.R, N = g.N, s = g.s, fr = g.fr, u = g.u, v = g.v, out = g.out, ins = g.inside;
    for (let q = -R; q <= R; q++) for (let r = -R; r <= R; r++) {
      const i = (q + R) * N + (r + R);
      if (!ins[i]) { u[i] = 0; v[i] = 0; continue; }
      let rc = fr[i];
      if (!rc) for (let k = 0; k < 6; k++) { const j = (q + HEX_NB[k][0] + R) * N + (r + HEX_NB[k][1] + R); if (ins[j] && fr[j]) { rc = 1; break; } }
      if (rc) { v[i] = s[i] + gamma; u[i] = 0; } else { u[i] = s[i]; v[i] = 0; }
    }
    for (let q = -R; q <= R; q++) for (let r = -R; r <= R; r++) {
      const i = (q + R) * N + (r + R);
      if (!ins[i]) continue;
      if (g.edge[i]) { out[i] = beta; continue; }
      let a = 0;
      for (let k = 0; k < 6; k++) a += u[(q + HEX_NB[k][0] + R) * N + (r + HEX_NB[k][1] + R)];
      out[i] = v[i] + u[i] + alpha / 2 * (a / 6 - u[i]);
    }
    let cnt = 0;
    for (let i = 0; i < N * N; i++) {
      if (!ins[i]) continue;
      s[i] = out[i];
      if (s[i] >= 1) { fr[i] = 1; if (g.edge[i]) g.touched = true; }
      cnt += fr[i];
    }
    g.count = cnt;
  }
  /* the water-saturation line of the Nakaya diagram: how far above ice saturation (per cent) air in equilibrium with
     liquid droplets lies at temperature T */
  function waterSat(W, T) { return 100 * (W.vapourPressure(T) / W.sublimationPressure(T) - 1); }
  function habit(T, s) {
    const peak = 0.55 + 0.55 * Math.exp(-Math.pow((T + 15) / 6, 2));
    if (T > -4) {
      const f = clamp(s / 16, 0, 1) * peak;
      return { h: 'plate', f, name: f < 0.25 ? 'thin hexagonal plate' : f < 0.5 ? 'sectored plate' : 'stellar plate' };
    }
    if (T > -10) return { h: 'column', f: clamp(s / 16, 0, 1), name: s < 4 ? 'solid prism (column)' : s < 11 ? 'hollow column' : 'needle' };
    if (T > -22) {
      const f = clamp(s / 16, 0, 1) * peak;
      return { h: 'plate', f, name: f < 0.25 ? 'simple hexagonal plate' : f < 0.5 ? 'sectored plate' : f < 0.75 ? 'stellar plate' : 'fern-like stellar dendrite' };
    }
    if (s < 8) return { h: 'column', f: clamp(s / 16, 0, 1), name: 'column or bullet' };
    return { h: 'plate', f: clamp(s / 24, 0, 1) * 0.6, name: s < 14 ? 'thick sectored plate' : 'thick stellar plate' };
  }

  Hyper.sim('ice-snowflake', {
    title: 'A snowflake grows',
    blurb: `A crystal growing from vapour on a **hexagonal grid**, in a schematic cellular model (Reiter's rules): vapour diffuses, settles on the crystal's edge, and the tips — which meet the most vapour — run ahead and branch. Because the grid is hexagonal, *every* arm grows alike and the flake has six-fold symmetry; the arms need no way to "talk" to one another — each feels the same air.

The diagram on the right is **Nakaya's**: which shape grows depends on the temperature and on how supersaturated the air is. The dashed curve is where air is saturated with respect to liquid water (computed from the vapour pressures of water and ice), roughly where a cloud's droplets feed the crystals.

**Try this**
- Start at −15 °C with plenty of vapour: a branched dendrite. Lower the vapour to nothing much: a plain hexagonal plate.
- Move to −5 °C: the shape switches to a **column** or needle, a different habit that the plate-growth model cannot make — drawn here side-on.
- Press *New crystal* at the same settings: the speed and the habit are the same, and all six arms of one flake match.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Air temperature', min: -40, max: -0.5, step: 0.5, value: params.T != null ? params.T : -15, unit: '°C' },
        { id: 's', label: 'Vapour above ice saturation', min: 0, max: 40, step: 0.5, value: params.s != null ? params.s : 12, unit: '%' },
        { id: 'speed', label: 'Growth speed', min: 1, max: 30, step: 1, value: 8, unit: 'steps/frame' },
        { type: 'buttons', items: [{ id: 'new', label: 'New crystal', primary: true }] }
      ], (id) => { if (id !== 'speed') start(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['habit', 'Shape that grows'], ['wsat', 'Water saturation at this temperature'], ['size', 'Crystal'], ['note', 'Note']]);
      const R = 40, g = makeFlake(R);
      let hab = habit(V.T, V.s), beta = 0.4, gamma = 0.001, prog = 0;
      function start() {
        hab = habit(V.T, V.s);
        beta = 0.4; gamma = Math.exp(lerp(Math.log(0.012), Math.log(3e-5), hab.f));
        seedFlake(g, beta); prog = 0;
      }
      start();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const half = Math.min(Wd * 0.5, Hh) / 2 - 8, cx = half + 10, cy = Hh / 2;
        if (hab.h === 'plate') {
          if (!g.touched) for (let k = 0; k < V.speed; k++) { stepFlake(g, 1, beta, gamma); if (g.touched) break; }
          const cs = half / (R * Math.sqrt(3)) * 0.98, sq = Math.sqrt(3);
          c.fillStyle = C.dark ? 'rgba(190,225,255,0.95)' : 'rgba(40,110,190,0.9)';
          c.beginPath();
          for (let q = -R; q <= R; q++) for (let r = -R; r <= R; r++) {
            const i = (q + R) * g.N + (r + R);
            if (!g.fr[i]) continue;
            const px = cx + cs * sq * (q + r / 2), py = cy + cs * 1.5 * r, rr = cs * 1.02;
            for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + k * Math.PI / 3, X = px + rr * Math.cos(an), Y = py + rr * Math.sin(an); if (k) c.lineTo(X, Y); else c.moveTo(X, Y); }
            c.closePath();
          }
          c.fill();
        } else {
          prog = Math.min(1, prog + Math.min(dt, 0.05) * V.speed * 0.012);
          const needle = hab.name === 'needle', hollow = hab.name === 'hollow column' || hab.name === 'column or bullet';
          const Lmax = half * 1.7, w = needle ? Lmax * 0.035 : Lmax * (0.2 + 0.1 * (1 - hab.f)), len = Lmax * (0.12 + 0.88 * prog), ww = w * (0.35 + 0.65 * Math.sqrt(prog));
          const x0 = cx - len / 2, x1 = cx + len / 2;
          c.fillStyle = C.dark ? 'rgba(190,225,255,0.92)' : 'rgba(60,130,200,0.85)';
          c.beginPath(); c.moveTo(x0, cy - ww / 2); c.lineTo(x1, cy - ww / 2); c.lineTo(x1 + ww * 0.25, cy); c.lineTo(x1, cy + ww / 2); c.lineTo(x0, cy + ww / 2); c.lineTo(x0 - ww * 0.25, cy); c.closePath(); c.fill();
          c.strokeStyle = C.bg2; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, cy - ww * 0.17); c.lineTo(x1, cy - ww * 0.17); c.moveTo(x0, cy + ww * 0.17); c.lineTo(x1, cy + ww * 0.17); c.stroke();
          if (hollow) {
            c.fillStyle = C.dark ? 'rgba(13,16,32,0.85)' : 'rgba(255,255,255,0.9)'; const hl = len * 0.22;
            c.beginPath(); c.moveTo(x1 - hl, cy - ww * 0.22); c.lineTo(x1 + ww * 0.1, cy - ww * 0.22); c.lineTo(x1 + ww * 0.1, cy + ww * 0.22); c.lineTo(x1 - hl, cy + ww * 0.22); c.closePath(); c.fill();
            c.beginPath(); c.moveTo(x0 + hl, cy - ww * 0.22); c.lineTo(x0 - ww * 0.1, cy - ww * 0.22); c.lineTo(x0 - ww * 0.1, cy + ww * 0.22); c.lineTo(x0 + hl, cy + ww * 0.22); c.closePath(); c.fill();
          }
          kit.label(c, 'side view of a prism growing along its hexagonal axis', cx, Hh - 12, { size: 11, color: C.muted, align: 'center', baseline: 'bottom' });
        }
        /* the Nakaya diagram */
        const gx = Math.max(cx + half + 40, Wd * 0.56), gw = Wd - gx - 14, gy = 34, gh = Hh - 100;
        if (gw > 110) {
          const TX = T => gx + gw * clamp(-T / 40, 0, 1), SY = s => gy + gh * (1 - clamp(s / 40, 0, 1));
          const bands = [[0, -4, 'plates'], [-4, -10, 'columns, needles'], [-10, -22, 'plates, dendrites'], [-22, -40, 'columns, plates']];
          bands.forEach(([a, b, name], i) => {
            c.fillStyle = i % 2 ? 'rgba(224,160,48,0.16)' : 'rgba(110,140,255,0.16)'; c.fillRect(TX(a), gy, TX(b) - TX(a), gh);
            if (i > 0) kit.label(c, name, (TX(a) + TX(b)) / 2, gy + gh + 4, { size: 10, color: C.muted, align: 'center', baseline: 'top' });
          });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
          c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([5, 3]); c.beginPath();
          for (let k = 0; k <= 40; k++) { const T = -0.2 - k, y = SY(waterSat(W, T)); if (k) c.lineTo(TX(T), y); else c.moveTo(TX(T), y); }
          c.stroke(); c.setLineDash([]);
          kit.label(c, 'saturated for liquid water', TX(-24), SY(30), { size: 10, color: C.warn });
          c.beginPath(); c.arc(TX(V.T), SY(V.s), 6, 0, TAU); c.fillStyle = C.bad; c.fill();
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
          kit.label(c, 'temperature (°C): 0 to −40', gx + gw / 2, gy + gh + 26, { size: 10.5, color: C.muted, align: 'center', baseline: 'top' });
          kit.label(c, 'vapour above ice saturation (%)', gx, gy - 10, { size: 10.5, color: C.muted, baseline: 'bottom' });
          for (const s of [0, 20, 40]) kit.label(c, String(s), gx - 5, SY(s), { size: 9.5, color: C.muted, align: 'right', baseline: 'middle' });
          kit.label(c, "Nakaya's diagram (schematic)", gx + gw, gy - 10, { size: 10.5, color: C.faint, align: 'right', baseline: 'bottom' });
        }
        ro.set('habit', hab.name + ' (' + hab.h + ' habit)');
        ro.set('wsat', waterSat(W, V.T).toFixed(1) + ' % above ice saturation');
        ro.set('size', hab.h === 'plate' ? g.count + ' cells frozen' : Math.round(prog * 100) + ' % grown');
        ro.set('note', V.s > waterSat(W, V.T) + 0.5 ? 'above water saturation: a cloud would be forming droplets here' : g.touched && hab.h === 'plate' ? 'reached the edge of the model: press New crystal' : 'growing');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ why ice is slippery */
  /* The quasi-liquid layer: d = 0.37 nm + A((-T)^(-1/3) - 40^(-1/3)), a power law of the kind predicted for premelting
     by dispersion forces, with A = 5 nm K^(1/3), so that it falls to one molecular bilayer (0.37 nm, "none") at -40 °C.
     Measurements of the thickness near 0 °C differ by an order of magnitude between techniques; this is a schematic. */
  const QLL_A = 5, BILAYER = 0.37;
  function qllNm(T) { const dT = Math.max(0.05, -T); return BILAYER + Math.max(0, QLL_A * (Math.pow(dT, -1 / 3) - Math.pow(40, -1 / 3))); }

  Hyper.sim('ice-slippery', {
    title: 'The skin on the ice',
    blurb: `A cut through the surface of ice. Below the top few molecular layers the molecules sit in the ordered lattice; at the surface they cannot hold four neighbours and **melt first**, leaving a liquid-like film whose thickness grows as the melting point is approached. The skate rides on it. The layers shown are counted from the (schematic) thickness; the ice moves under the blade at the chosen speed.

The bars compare two ways of making that film: the **pressure** of the blade, which lowers the melting point by 0.0074 K per bar (computed from the melting curve), and the **cold** it has to overcome. Pressure only matters when the ice is barely below freezing.

**Try this**
- Set −10 °C and a 75 kg skater on 1 cm² of blade: pressure melting could drop the melting point by about half a kelvin — a twentieth of the cold. The slipperiness cannot come from that.
- Make the blade very narrow (0.1 cm²): pressure now lowers it by several kelvin, but few skates are that sharp, and the ice would simply flow.
- Go to −40 °C: the film is a single bilayer and ice grips.
- Raise the speed: friction heating (μ m g v) joins in; the readout shows how much ice the heat melts each second.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)', reverse: true }, y: { label: 'liquid-like film (nm)', min: 0 }, legend: true }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature of the ice', min: -40, max: -0.1, step: 0.1, value: params.T != null ? params.T : -5, unit: '°C' },
        { id: 'm', label: 'Mass of the skater', min: 40, max: 120, step: 1, value: 75, unit: 'kg' },
        { id: 'A', label: 'Contact area of the blade', min: 0.1, max: 10, step: 0.1, value: 1, unit: 'cm²', log: true },
        { id: 'v', label: 'Speed', min: 0, max: 15, step: 0.5, value: 6, unit: 'm/s' },
        { id: 'mu', label: 'Friction coefficient', min: 0.003, max: 0.2, step: 0.001, value: 0.02, log: true }
      ], () => curve());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Liquid-like film (schematic)'], ['p', 'Pressure under the blade'], ['dTm', 'Melting point lowered by pressure'], ['need', 'Cold to overcome'], ['share', 'Pressure melting accounts for'], ['heat', 'Friction heat (μ m g v)'], ['melt', 'Ice melted by it']]);
      function curve() {
        const C = kit.colors(), pts = [];
        for (let i = 0; i <= 80; i++) { const T = -40 + 39.9 * i / 80; pts.push([T, qllNm(T)]); }
        plot.set({ series: [{ pts, label: 'film thickness (schematic power law)', color: C.accent }], x: { label: 'temperature (°C)', reverse: true, min: -40, max: 0 }, y: { label: 'liquid-like film (nm)', min: 0 }, marks: [{ x: V.T, y: qllNm(V.T), label: qllNm(V.T).toFixed(1) + ' nm' }] });
      }
      curve();
      let phase = 0, clock = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        phase += Math.min(dt, 0.05) * V.v; clock += Math.min(dt, 0.05) * 0.5;
        const d = qllNm(V.T), layers = Math.round(d / BILAYER);
        const nShow = clamp(layers, 0, 12);
        const colW = 15, rowH = 11, surfY = Hh * 0.36;
        const x0 = 14, x1 = Wd * 0.62;
        // the blade
        const bladeW = Math.min(110, (x1 - x0) * 0.4), bx = (x0 + x1) / 2 - bladeW / 2, by = surfY - 6;
        c.fillStyle = C.muted; c.fillRect(bx, by - 40, bladeW, 40);
        c.fillStyle = C.text; c.fillRect(bx - 4, by - 4, bladeW + 8, 4);
        kit.label(c, 'blade', bx + bladeW / 2, by - 46, { size: 11, color: C.muted, align: 'center', baseline: 'bottom' });
        // the molecules: rows from the surface down; the top nShow rows are liquid-like (disordered, always moving)
        const shift = (phase * 6) % colW;
        for (let j = 0; j < 21; j++) {
          const y = surfY + j * rowH + rowH / 2;
          if (y > Hh - 70) break;
          const liquid = j < nShow;
          for (let i = -1; i < Math.ceil((x1 - x0) / colW) + 1; i++) {
            let x = x0 + i * colW + (j % 2 ? colW / 2 : 0) - shift, yy = y;
            if (liquid) {
              const t = phase * 0.4 + clock;
              x += 4.5 * Math.sin(i * 12.989 + j * 78.233 + t * (1.3 + (j % 3) * 0.4));
              yy += 3.5 * Math.cos(i * 4.17 + j * 9.31 + t * 1.7);
            }
            if (x < x0 - 2 || x > x1 + 2) continue;
            c.beginPath(); c.arc(x, yy, 3.3, 0, TAU);
            c.fillStyle = liquid ? 'rgba(70,150,235,0.85)' : (C.dark ? 'rgba(210,235,255,0.9)' : 'rgba(30,80,160,0.9)'); c.fill();
          }
        }
        kit.label(c, layers > 12 ? 'liquid-like layers: more than 12 (' + d.toFixed(1) + ' nm)' : 'liquid-like layers: ' + layers, x1 + 10, surfY + Math.max(1, nShow) * rowH / 2, { size: 11.5, color: C.accent, baseline: 'middle', weight: 650 });
        kit.label(c, 'ordered ice lattice', x1 + 10, surfY + (nShow + 4) * rowH, { size: 11, color: C.muted, baseline: 'middle' });
        // the bars
        const p = V.m * W.g / (V.A * 1e-4), dTm = Math.max(0, 273.15 - W.meltingPoint(p + 101325).T), need = -V.T;
        const bx0 = 14, bw = Wd - 28, by0 = Hh - 52, scale = bw / Math.max(need * 1.05, dTm * 1.05, 1);
        kit.label(c, 'cold to overcome: ' + need.toFixed(1) + ' K', bx0, by0 - 3, { size: 10.5, color: C.text, baseline: 'bottom' });
        c.fillStyle = C.faint; c.fillRect(bx0, by0, need * scale, 10);
        kit.label(c, 'what the blade\'s pressure can lower the melting point by: ' + (dTm < 0.1 ? dTm.toFixed(3) : dTm.toFixed(2)) + ' K', bx0, by0 + 26, { size: 10.5, color: C.text, baseline: 'bottom' });
        c.fillStyle = C.accent; c.fillRect(bx0, by0 + 29, Math.min(bw, dTm * scale), 10);
        const P = V.mu * V.m * W.g * V.v;
        ro.set('d', d.toFixed(2) + ' nm (' + layers + ' layers)');
        ro.set('p', (p / 1e6).toFixed(2) + ' MPa (' + (p / 1e5).toFixed(0) + ' bar)');
        ro.set('dTm', dTm.toFixed(3) + ' K');
        ro.set('need', need.toFixed(1) + ' K');
        ro.set('share', (100 * Math.min(1, dTm / need)).toFixed(1) + ' % of the cold');
        ro.set('heat', P.toFixed(1) + ' W');
        ro.set('melt', (P / W.LATENT_FUSION * 1e6).toFixed(0) + ' mg per second');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ supercooled droplets */
  /* Classical nucleation theory for pure water (the formulas on the page): critical radius r* = 2 σ T_m /(ρ_i L ΔT),
     barrier ΔG* = 16π σ³ T_m² / (3 (ρ_i L ΔT)²), rate per volume J = J0 exp(−ΔG* ÷ kT) with a prefactor J0 of about
     1e41 per m³ per second (of the order n kT/h). σ is the ice–water interfacial energy, about 27.5 mN/m (estimates
     run from 20 to 35). With these values a 10 µm droplet cooled at 5 K/min freezes near −37 °C, as measured. */
  const NUC = { sigma: 0.0275, Tm: 273.15, L: 333.55e3, rhoI: 917, J0: 1e41, kB: 1.380649e-23, mw: 0.018015268 / 6.02214076e23 };
  function nuc(T) {
    const dT = Math.max(0.5, -T), Tk = NUC.Tm + Math.min(T, -0.5);
    const r = 2 * NUC.sigma * NUC.Tm / (NUC.rhoI * NUC.L * dT);
    const dG = 16 * Math.PI * Math.pow(NUC.sigma, 3) * NUC.Tm * NUC.Tm / (3 * Math.pow(NUC.L * NUC.rhoI * dT, 2));
    return { r, dG, kT: NUC.kB * Tk, ratio: dG / (NUC.kB * Tk), n: 4 / 3 * Math.PI * r * r * r * NUC.rhoI / NUC.mw, J: NUC.J0 * Math.exp(-dG / (NUC.kB * Tk)) };
  }
  function gauss(rnd) { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rnd()); }

  Hyper.sim('ice-droplets', {
    title: 'Droplets that will not freeze',
    blurb: `A tray of 144 droplets cooled steadily from +4 °C. Pure, clean water does not freeze at 0 °C: ice needs a **nucleus** — a cluster of molecules in the ice arrangement big enough to keep growing — and at small supercooling the chance that thermal jostling builds one is negligible. A droplet is a liquid-blue disc until it freezes, then it turns white. A dark speck marks a droplet that carries an **ice-nucleating particle**.

**Try this**
- No particles: nothing freezes until about −35 to −38 °C, then the whole tray goes within a degree or two. That is *homogeneous* nucleation, and the reason is the readout: the critical nucleus shrinks from 5 nm at −10 °C to 1.3 nm at −38 °C and the barrier from hundreds of thermal energies to about sixty.
- Shrink the droplets to 1 µm (a cloud droplet): they supercool further, because each has a hundred times less chance per second.
- Add *silver iodide* or the *bacterial protein* and watch the carriers freeze at −5 or −2 °C, long before the rest.
- Cool faster and the whole curve shifts colder; the freezing spectrum is statistical, not a fixed temperature. (Schematic prefactor: the rate law is the real form, its absolute scale is chosen to match the measured −37 °C.)`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220, maxH: 300 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)', reverse: true }, y: { label: 'frozen (%)', min: 0, max: 100 }, legend: true }, 230);
      const NUCL = [['None: pure, clean water', 'none'], ['Mineral dust (active near −15 °C)', 'dust'], ['Silver iodide (near −5 °C)', 'agi'], ['Bacterial protein, Pseudomonas syringae (near −2 °C)', 'bact']];
      const TACT = { dust: [-15, 2.5], agi: [-5, 1], bact: [-2, 0.6] };
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Droplet diameter', min: 1, max: 100, step: 1, value: params.d || 10, unit: 'µm', log: true },
        { id: 'rate', label: 'Cooling rate', min: 0.5, max: 30, step: 0.5, value: 5, unit: 'K/min', log: true },
        { id: 'type', type: 'select', label: 'Nucleating particles', options: NUCL, value: params.type || 'none' },
        { id: 'frac', label: 'Droplets with a particle', min: 0, max: 100, step: 5, value: 30, unit: '%' },
        { type: 'buttons', items: [{ id: 'go', label: 'Cool again', primary: true }] }
      ], (id) => { restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Temperature of the tray'], ['fz', 'Frozen'], ['t50', 'Half frozen at'], ['r', 'Critical nucleus radius'], ['n', 'Molecules in the nucleus'], ['dg', 'Barrier ΔG* ÷ kT']]);
      const NX = 16, NY = 9, ND = NX * NY;
      let drops = [], T = 4, pts = [], t50 = null, lastPt = 5, seed = 1;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      function restart() {
        seed = 12345 + Math.floor(Math.random() * 1e6); drops = []; T = 4; pts = []; t50 = null; lastPt = 5;
        const act = TACT[V.type];
        for (let i = 0; i < ND; i++) {
          const carrier = !!act && rnd() * 100 < V.frac;
          drops.push({ frozen: false, carrier, Tact: carrier ? act[0] + act[1] * gauss(rnd) : -99, Tf: null });
        }
      }
      restart();
      const vol = () => Math.PI / 6 * Math.pow(V.d * 1e-6, 3);
      function theory() {
        const out = [], r = V.rate / 60; let integ = 0, prev = 0;
        for (let i = 0; i <= 130; i++) {
          const TT = -0.5 - i * 0.4, J = nuc(TT).J * vol();
          if (i > 0) integ += 0.5 * (prev + J) * 0.4 / r;
          prev = J;
          out.push([TT, 100 * (1 - Math.exp(-integ))]);
        }
        return out;
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const rate = V.rate / 60, TSCALE = 40;
        if (T > -50) {
          let sim = Math.min(dt, 0.05) * TSCALE, n = 0;
          while (sim > 1e-9 && n < 400 && T > -50) {
            const h = Math.min(sim, 0.25); sim -= h; n++;
            T -= rate * h;
            const J = nuc(T).J * vol(), p = 1 - Math.exp(-J * h);
            for (const q of drops) {
              if (q.frozen) continue;
              if (q.carrier && T <= q.Tact) { q.frozen = true; q.Tf = T; }
              else if (T < -5 && rnd() < p) { q.frozen = true; q.Tf = T; }
            }
          }
          const fz = drops.filter(q => q.frozen).length / ND * 100;
          if (t50 == null && fz >= 50) t50 = T;
          if (lastPt - T >= 0.25 || pts.length === 0) { pts.push([T, fz]); lastPt = T; }
        }
        const fz = drops.filter(q => q.frozen).length / ND * 100;
        /* the tray */
        const tx = 54, tw = Wd - tx - 16, th = Hh - 40, cw = tw / NX, chh = th / NY, rad = Math.min(cw, chh) * 0.38 * (0.55 + 0.45 * Math.log10(V.d) / 2);
        for (let k = 0; k < ND; k++) {
          const q = drops[k], x = tx + (k % NX + 0.5) * cw, y = 10 + (Math.floor(k / NX) + 0.5) * chh;
          c.beginPath(); c.arc(x, y, Math.max(2, rad), 0, TAU);
          c.fillStyle = q.frozen ? 'rgba(250,252,255,0.98)' : 'rgba(70,150,235,0.8)'; c.fill();
          c.strokeStyle = q.frozen ? C.accent : 'rgba(40,90,170,0.7)'; c.lineWidth = 1; c.stroke();
          if (q.carrier) { c.beginPath(); c.arc(x + rad * 0.25, y - rad * 0.2, Math.max(1, rad * 0.22), 0, TAU); c.fillStyle = 'rgba(30,30,50,0.9)'; c.fill(); }
        }
        kit.wsym.thermometer(c, 22, 8, Hh - 22, clamp(T, -45, 5), { min: -45, max: 5 });
        kit.label(c, 'tray of ' + ND + ' droplets, diameter ' + V.d + ' µm', tx, Hh - 8, { size: 11, color: C.muted, baseline: 'bottom' });
        const C2 = kit.colors();
        plot.set({ series: [{ pts: pts.length ? pts : [[4, 0]], label: 'frozen in this tray', color: C2.accent }, { pts: theory(), label: 'pure water, theory', dash: true, color: C2.muted }], x: { label: 'temperature (°C)', reverse: true, min: -50, max: 5 }, y: { label: 'frozen (%)', min: 0, max: 100 } });
        const nn = nuc(Math.min(T, -0.5));
        ro.set('T', T.toFixed(1) + ' °C');
        ro.set('fz', fz.toFixed(0) + ' % of the droplets');
        ro.set('t50', t50 == null ? 'not yet' : t50.toFixed(1) + ' °C');
        ro.set('r', (nn.r * 1e9).toFixed(2) + ' nm');
        ro.set('n', nn.n < 1e5 ? Math.round(nn.n).toLocaleString('en') : nn.n.toExponential(1));
        ro.set('dg', nn.ratio.toFixed(0));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a glacier flows */
  /* Glen's flow law for a parallel-sided slab: strain rate = A τ^n with n = 3. With basal shear stress
     τ_b = ρ g H sin(α) the deformation velocity at height z above the bed is
       u(z) = (2A/(n+1)) (ρ g sin α)^n [H^(n+1) − (H − z)^(n+1)].
     A follows an Arrhenius law anchored at 3.5e-25 Pa^-3 s^-1 at −10 °C with activation energies of 60 kJ/mol below
     −10 °C and 115 kJ/mol above (Cuffey and Paterson's values), giving 2.4e-24 at 0 °C. */
  const YR = 3.15576e7;
  function glenA(Tc) {
    const Tk = clamp(Tc, -40, 0) + 273.15, Q = Tc > -10 ? 115e3 : 60e3;
    return 3.5e-25 * Math.exp(Q / 8.314462618 * (1 / 263.15 - 1 / Tk));
  }
  function glenU(A, H, alpha, z) {
    const n = 3, k = 917 * 9.80665 * Math.sin(alpha * Math.PI / 180);
    return 2 * A / (n + 1) * Math.pow(k, n) * (Math.pow(H, n + 1) - Math.pow(Math.max(0, H - z), n + 1)) * YR;   // m/yr
  }

  Hyper.sim('ice-glacier', {
    title: 'A glacier flows',
    blurb: `A slab of ice on a slope, drawn along the slope. A vertical line of stakes is planted through it (a borehole) and the picture follows how the line bends as the ice **creeps**: slowly at the bed, fastest at the surface. Faint curves are earlier times; the bright one is now. The arrows on the left are the velocity profile.

Glen's law makes the flow wildly sensitive: strain rate goes as the *cube* of the stress, so doubling the thickness multiplies the surface speed by $2^4 = 16$, and warming the ice towards 0 °C speeds it several times over.

**Try this**
- Double the thickness and read the surface speed: about 16 times faster.
- Warm the ice from −20 °C to 0 °C: the rate factor rises about twenty-fold.
- Add **basal sliding** (water at the bed, which needs the bed at the pressure-melting point): the whole line shifts bodily, which is how fast glaciers move metres per day.
- Watch the readout *Ice at the bed*: under 1,000 m of ice the melting point is about −0.7 °C, so a glacier that is slightly sub-zero all the way down can still have a wet bed. (Deformation by Glen's law only; a parallel-sided slab, schematic for a real valley.)`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Thickness of the ice', min: 20, max: 1500, step: 5, value: params.H || 200, unit: 'm', log: true },
        { id: 'alpha', label: 'Slope of the surface and bed', min: 0.5, max: 25, step: 0.5, value: params.alpha || 5, unit: '°' },
        { id: 'T', label: 'Temperature of the ice', min: -30, max: 0, step: 0.5, value: params.T != null ? params.T : -2, unit: '°C' },
        { id: 'slide', label: 'Sliding at the bed', min: 0, max: 300, step: 5, value: params.slide || 0, unit: 'm/yr' }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tau', 'Shear stress at the bed'], ['A', 'Rate factor A'], ['us', 'Surface speed, deformation'], ['tot', 'Surface speed, total'], ['te', 'Time to move 1.2 thicknesses'], ['pb', 'Pressure at the bed'], ['bed', 'Ice at the bed'], ['note', 'Note']]);
      let phase = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const H = V.H, al = V.alpha, A = glenA(V.T), us = glenU(A, H, al, H), tot = us + V.slide;
        const tE = tot > 1e-9 ? 1.2 * H / tot : 1e9;
        phase += Math.min(dt, 0.05) * 0.12;
        const f = phase % 1;
        const sc = Math.min(0.4 * Hh / H, 3), cx = Wd * 0.32, cy = Hh * 0.62;
        c.save();
        c.translate(cx, cy); c.rotate(al * Math.PI / 180);
        const Lw = Wd * 1.2;
        c.fillStyle = C.faint; c.fillRect(-Lw / 2, 0, Lw, Hh);
        c.fillStyle = 'rgba(214,236,255,' + (C.dark ? '0.30' : '0.75') + ')'; c.fillRect(-Lw / 2, -H * sc, Lw, H * sc);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-Lw / 2, 0); c.lineTo(Lw / 2, 0); c.stroke();
        c.strokeStyle = C.accent; c.beginPath(); c.moveTo(-Lw / 2, -H * sc); c.lineTo(Lw / 2, -H * sc); c.stroke();
        // the borehole at several times
        const x0 = 0, nz = 36;
        const line = (t, col, w) => {
          c.strokeStyle = col; c.lineWidth = w; c.beginPath();
          for (let k = 0; k <= nz; k++) { const z = H * k / nz, x = x0 + (glenU(A, H, al, z) + V.slide) * t * sc; const y = -z * sc; k ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
        };
        for (const q of [0, 0.25, 0.5, 0.75, 1]) line(q * tE, C.faint, 1);
        line(f * tE, C.warn, 2.6);
        c.fillStyle = C.warn; c.beginPath(); c.arc(x0 + (us + V.slide) * f * tE * sc, -H * sc, 4, 0, TAU); c.fill();
        // the velocity profile at the left
        const ux = -0.22 * Wd * 0.7, umax = Math.max(tot, 1e-9);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(ux, 0); c.lineTo(ux, -H * sc); c.stroke();
        for (let k = 0; k <= 6; k++) {
          const z = H * k / 6, u = glenU(A, H, al, z) + V.slide, len = 0.17 * Wd * u / umax;
          if (len > 1) kit.arrow(c, ux, -z * sc, ux + len, -z * sc, C.accent, 1.6);
        }
        kit.label(c, 'velocity profile', ux, -H * sc - 14, { size: 11, color: C.muted, align: 'center', baseline: 'bottom' });
        c.restore();
        kit.label(c, 'ice, ' + H.toFixed(0) + ' m thick, on a ' + al + '° slope', 14, 20, { size: 12, color: C.text, weight: 650 });
        kit.label(c, 'borehole drawn at 0, ¼, ½, ¾ and the full time of ' + (tE < 1e8 ? (tE < 10 ? tE.toFixed(1) : tE.toFixed(0)) + ' years' : '—'), 14, 38, { size: 11, color: C.muted });
        const tau = 917 * 9.80665 * H * Math.sin(al * Math.PI / 180), pb = 917 * 9.80665 * H * Math.cos(al * Math.PI / 180);
        const Tm = W.meltingPoint(pb + 101325).T - 273.15;
        ro.set('tau', (tau / 1e3).toFixed(0) + ' kPa');
        ro.set('A', A.toExponential(1) + ' Pa⁻³ s⁻¹');
        ro.set('us', us.toFixed(us < 10 ? 2 : 0) + ' m/yr');
        ro.set('tot', tot.toFixed(tot < 10 ? 2 : 0) + ' m/yr');
        ro.set('te', tE < 1e8 ? (tE < 10 ? tE.toFixed(1) : tE.toFixed(0)) + ' years' : 'never');
        ro.set('pb', (pb / 1e6).toFixed(2) + ' MPa');
        ro.set('bed', V.T >= Tm ? 'at the melting point, ' + Tm.toFixed(2) + ' °C: wet, can slide' : 'frozen to the bed (melting point ' + Tm.toFixed(2) + ' °C)');
        ro.set('note', tau > 200e3 ? 'a stress this high is unusual: real glaciers thin and flatten until τ is 50–150 kPa' : tau < 20e3 ? 'very low stress: this ice would barely move' : 'a typical glacier stress');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the Mpemba effect */
  /* Two samples of 200 g in a freezer at T_env, cooled by Newton's law (heat loss h·A·(T − T_env), h·A = 0.4 W/K),
     optionally evaporating from an open surface (mass flux = k · A · (ρ_vapour at the surface − ρ_vapour in the
     freezer), vapour density from the engine's vapour pressure; the latent heat leaves with the vapour), and
     optionally supercooling: each sample stays liquid below 0 °C until it reaches its own random nucleation
     temperature, then freezes instantly as far as the supercooling allows (cp ΔT / L of the water), the rest at
     0 °C as the heat is taken away. Schematic: no convection, a uniform temperature, no dissolved gas. */
  function mpSample(T0, Tn) { return { T: T0, m: 0.2, x: 0, Tn, state: 0, tStart: null, tSolid: null, lost: 0 }; }
  function mpStep(W, s, t, dt, o) {
    const cw = 4186, ci = 2050, hA = 0.4;
    let q = hA * (s.T - o.Tenv);
    if (o.evap > 0 && s.state === 0) {
      const rs = W.vapourPressure(s.T) * W.M * 1e-3 / (W.R * (s.T + 273.15));
      const mdot = o.evap * 0.002 * 0.0028 * Math.max(0, rs - 0.001);
      s.m -= mdot * dt; s.lost += mdot * dt; q += mdot * W.latentVaporisation(s.T);
    }
    if (s.state === 0) {
      s.T -= q * dt / (s.m * cw);
      if (s.T <= s.Tn) { s.tStart = t; s.state = 1; s.x = Math.min(1, cw * (0 - s.Tn) / W.LATENT_FUSION); s.T = 0; }
    } else if (s.state === 1) {
      s.x += hA * (0 - o.Tenv) * dt / (s.m * W.LATENT_FUSION); s.T = 0;
      if (s.x >= 1) { s.state = 2; s.tSolid = t; }
    } else s.T -= q * dt / (s.m * ci);
  }
  function mpPair(W, o, rnd) {
    const sup = (extra) => o.sup > 0 ? -clamp(o.sup - extra + o.spread * gauss(rnd), 0.2, 20) : 0;
    return [mpSample(o.Th, sup(o.hotBonus)), mpSample(o.Tw, sup(0))];
  }

  Hyper.sim('ice-mpemba', {
    title: 'Hot or warm: which freezes first?',
    blurb: `Two beakers of 200 g in a freezer, one hot, one warm. The curves are temperature against time. This is a **schematic model**, built to see which of the proposed explanations can possibly work — and it is deliberately honest: the effect is contested, and in careful experiments it is not reliably found.

With everything off, Newton's law gives the answer every physicist expects: the warm sample freezes first, because the hot one must pass through the warm one's starting temperature. Switch on the candidate causes.

**Try this**
- Turn **evaporation** on and up: the hot beaker loses a few per cent of its mass and a good part of its heat — it closes the gap but, in this model, does not overtake.
- Turn **supercooling** on: each sample freezes at its own random temperature below 0 °C. Press *Cool again* repeatedly — sometimes the order changes, by luck.
- Make the hot sample a **better nucleator** (it freezes at a warmer temperature, for whatever reason: dissolved gas, convection currents, the vessel): now it can win, and *Run 100 trials* shows how often.
- Change the *judge*: "starts freezing" and "solid all through" can give different winners — one reason experiments disagree.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190, maxH: 250 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'time (min)', min: 0 }, y: { label: 'temperature (°C)' }, legend: true }, 250);
      const ctl = kit.controls(box.side, [
        { id: 'Th', label: 'Hot sample starts at', min: 50, max: 99, step: 1, value: 90, unit: '°C' },
        { id: 'Tw', label: 'Warm sample starts at', min: 10, max: 45, step: 1, value: 35, unit: '°C' },
        { id: 'Tenv', label: 'Freezer', min: -30, max: -5, step: 1, value: -18, unit: '°C' },
        { id: 'evapOn', type: 'check', label: 'Evaporation from the open top', value: params.evap != null ? !!params.evap : false },
        { id: 'evap', label: 'Draught over the surface', min: 1, max: 10, step: 0.5, value: 4 },
        { id: 'supOn', type: 'check', label: 'Supercooling before freezing', value: !!params.sup },
        { id: 'sup', label: 'Typical supercooling', min: 1, max: 15, step: 0.5, value: 6, unit: 'K' },
        { id: 'bonus', label: 'Hot sample nucleates warmer by', min: 0, max: 10, step: 0.5, value: 0, unit: 'K' },
        { id: 'judge', type: 'select', label: 'Count as finished when', options: [['it starts freezing (reaches its freezing temperature)', 'start'], ['it is solid all through', 'solid']], value: 'solid' },
        { id: 'speed', label: 'Time', min: 5, max: 120, step: 5, value: 40, unit: 'min/s' },
        { type: 'buttons', items: [{ id: 'go', label: 'Cool again', primary: true }, { id: 'trials', label: 'Run 100 trials' }] }
      ], (id) => { if (id === 'trials') runTrials(); else if (id !== 'speed') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['Th', 'Hot sample'], ['Tw', 'Warm sample'], ['loss', 'Hot sample lost by evaporation'], ['res', 'Result so far'], ['tr', 'Trials']]);
      const opts = () => ({ Tenv: V.Tenv, evap: V.evapOn ? V.evap : 0, sup: V.supOn ? V.sup : 0, spread: 2.5, Th: V.Th, Tw: V.Tw, hotBonus: V.supOn ? V.bonus : 0 });
      let pair, t = 0, hh = [], ww = [], seed = 99, trialText = 'press "Run 100 trials"';
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      function restart() { seed = 777 + Math.floor(Math.random() * 1e6); pair = mpPair(W, opts(), rnd); t = 0; hh = [[0, V.Th]]; ww = [[0, V.Tw]]; }
      function runTrials() {
        let hotFirst = 0, n = 100;
        const o = opts();
        for (let k = 0; k < n; k++) {
          const p = mpPair(W, o, rnd);
          let tt = 0;
          while (tt < 8 * 3600 && !(p[0].tSolid != null && p[1].tSolid != null)) { mpStep(W, p[0], tt, 20, o); mpStep(W, p[1], tt, 20, o); tt += 20; }
          const a = V.judge === 'start' ? p[0].tStart : p[0].tSolid, b = V.judge === 'start' ? p[1].tStart : p[1].tSolid;
          if (a != null && (b == null || a < b)) hotFirst++;
        }
        trialText = 'the hot sample finished first in ' + hotFirst + ' of ' + n;
      }
      restart();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H, o = opts();
        let sim = Math.min(dt, 0.05) * V.speed * 60, n = 0;
        while (sim > 1e-9 && n < 400 && t < 8 * 3600 && !(pair[0].tSolid != null && pair[1].tSolid != null && pair[0].T < o.Tenv + 2 && pair[1].T < o.Tenv + 2)) {
          const h = Math.min(sim, 10); sim -= h; n++;
          mpStep(W, pair[0], t, h, o); mpStep(W, pair[1], t, h, o); t += h;
          if (!hh.length || t - hh[hh.length - 1][0] * 60 >= 30) { hh.push([t / 60, pair[0].T]); ww.push([t / 60, pair[1].T]); }
        }
        /* the beakers */
        const bw = Math.min(100, Wd * 0.14), bh = Hh - 58, gap = (Wd - 2 * bw) / 3;
        [[pair[0], gap, 'hot', C.bad], [pair[1], 2 * gap + bw, 'warm', C.warn]].forEach(([s, x, name, col]) => {
          const fill = 0.7 * s.m / 0.2, frozen = s.state === 2 ? 1 : s.state === 1 ? s.x : 0;
          S.beaker(c, x, 16, bw, bh, fill, { liquid: frozen > 0.99 ? 'rgba(236,246,255,0.92)' : frozen > 0 ? 'rgba(190,225,250,0.75)' : 'rgba(70,150,235,0.5)', label: name + ' · ' + (s.m * 1000).toFixed(0) + ' g' });
          S.thermometer(c, x + bw + 22, 16, bh, clamp(s.T, -20, 100), { min: -20, max: 100, color: col });
          if (s.state === 0 && s.T > 60) for (let i = 0; i < 3; i++) kit.label(c, '~', x + bw * (0.25 + 0.25 * i), 10 - 6 * Math.sin(t * 0.002 + i), { size: 14, color: C.muted, align: 'center' });
        });
        plot.set({ series: [{ pts: hh, label: 'hot sample', color: C.bad }, { pts: ww, label: 'warm sample', color: C.warn }], x: { label: 'time (min)', min: 0, max: Math.max(60, t / 60) }, y: { label: 'temperature (°C)', min: Math.min(-20, o.Tenv - 2), max: 100 }, hlines: [{ y: 0, label: '0 °C' }] });
        const a = V.judge === 'start' ? pair[0].tStart : pair[0].tSolid, b = V.judge === 'start' ? pair[1].tStart : pair[1].tSolid;
        ro.set('t', (t / 60).toFixed(0) + ' min');
        ro.set('Th', pair[0].T.toFixed(1) + ' °C' + (pair[0].state === 1 ? ' (freezing, ' + (100 * pair[0].x).toFixed(0) + ' % ice)' : pair[0].state === 2 ? ' (solid)' : ''));
        ro.set('Tw', pair[1].T.toFixed(1) + ' °C' + (pair[1].state === 1 ? ' (freezing, ' + (100 * pair[1].x).toFixed(0) + ' % ice)' : pair[1].state === 2 ? ' (solid)' : ''));
        ro.set('loss', (pair[0].lost * 1000).toFixed(1) + ' g (' + (pair[0].lost / 0.2 * 100).toFixed(1) + ' %)');
        ro.set('res', a != null && b != null ? (a < b ? 'the HOT sample finished first, by ' : 'the warm sample finished first, by ') + (Math.abs(a - b) / 60).toFixed(0) + ' min' : a != null ? 'the hot sample finished; the warm one has not' : b != null ? 'the warm sample finished; the hot one has not' : 'neither has finished');
        ro.set('tr', trialText);
      }, box.stage);
      loop.start();
    }
  });
})();
