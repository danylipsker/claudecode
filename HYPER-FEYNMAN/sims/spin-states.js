/* HYPER-FEYNMAN · sims/spin-states.js — simulations for Spin and two-state systems (content/spin-states.js).
 *   spin-sg-one     Feynman's spin-one filters S, T, U in a row: block beams, turn T and U, count the atoms
 *   spin-sg-half    spin one-half filters: crossed filters, and the filter at 90° that lets atoms through
 *   spin-stationary a stationary state's turning arrow, and two energies beating in a box
 *   spin-flipflop   the Hamiltonian matrix of two coupled states: the probability sloshing at 2A/h
 *   spin-ammonia    the ammonia molecule: nitrogen up or down, its two levels in an electric field
 *   spin-maser      the ammonia maser: sorting the beam, stimulated emission in the cavity, the resonance
 *   spin-h2plus     the hydrogen molecular ion: bonding and antibonding clouds and their energy curves
 *   spin-benzene    two equivalent structures (benzene, a dye) flip-flopping, and their stationary mixture
 *   spin-hyperfine  hydrogen's four spin states and their energies in a magnetic field; the 21-cm line
 *   spin-galaxy     a radio telescope looking through a rotating galaxy: the 21-cm spectrum becomes a map
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2, DEG = Math.PI / 180;
  // physical constants (SI) and handy combinations
  const H_EVS = 4.135667696e-15;          // Planck constant in eV·s
  const HBAR_EVS = H_EVS / TAU;           // ħ in eV·s

  /* ---------------------------------------------------------------- shared drawing helpers */
  function fit(st, W0, H0) { const s = Math.min(st.W / W0, st.H / H0); return { s, ox: (st.W - W0 * s) / 2, oy: (st.H - H0 * s) / 2 }; }
  function fam() { return getComputedStyle(document.body).fontFamily || 'sans-serif'; }
  function txt(c, s, x, y, col, size, align, weight, base) {
    c.font = (weight || 500) + ' ' + (size || 12) + 'px ' + fam();
    c.fillStyle = col; c.textAlign = align || 'center'; c.textBaseline = base || 'middle'; c.fillText(s, x, y);
  }
  function rrect(c, x, y, w, h, r) {
    const q = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath(); c.moveTo(x + q, y); c.arcTo(x + w, y, x + w, y + h, q); c.arcTo(x + w, y + h, x, y + h, q);
    c.arcTo(x, y + h, x, y, q); c.arcTo(x, y, x + w, y, q); c.closePath();
  }
  function arrowTo(c, x0, y0, x1, y1, col, w, head) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0), hl = Math.min(head || 8, L * 0.6);
    if (L < 0.5) return;
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w || 2; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - hl * 0.7 * Math.cos(a), y1 - hl * 0.7 * Math.sin(a)); c.stroke();
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - hl * Math.cos(a - 0.42), y1 - hl * Math.sin(a - 0.42));
    c.lineTo(x1 - hl * Math.cos(a + 0.42), y1 - hl * Math.sin(a + 0.42)); c.closePath(); c.fill();
  }
  // a dial showing which way a filter is turned (0° = its + direction points up)
  function dial(c, x, y, r, ang, col, ring) {
    c.strokeStyle = ring; c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    arrowTo(c, x - r * 0.75 * Math.sin(ang), y + r * 0.75 * Math.cos(ang), x + r * 0.85 * Math.sin(ang), y - r * 0.85 * Math.cos(ang), col, 1.8, 6);
  }
  const pc = (v, d) => (100 * v).toFixed(d == null ? 1 : d) + ' %';
  const sgn = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);

  /* ================================================================ spin-sg-one */
  const OPEN_OPTS = [['+ only', '+'], ['0 only', '0'], ['− only', '-'], ['+ and 0', '+0'], ['+ and −', '+-'], ['0 and −', '0-'], ['all three (wide open)', '+0-']];
  const openSet = s => [s.indexOf('+') >= 0, s.indexOf('0') >= 0, s.indexOf('-') >= 0];
  const openStr = m => (m[0] ? '+' : '') + (m[1] ? '0' : '') + (m[2] ? '-' : '');
  const matVec = (M, v) => M.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
  const BEAM_NAMES = ['+', '0', '−'];

  Hyper.sim('spin-sg-one', {
    title: 'Spin one: a chain of Stern–Gerlach filters',
    blurb: `Feynman's thought experiment, built. An oven sends out spin-one atoms in every state. Each filter — S, T and U — splits the beam into three (+, 0, −) with a non-uniform magnetic field, lets through the beams whose masks are open, and joins them again. T and U can be turned about the beam axis (the dials show how far). An atom inside a filter with several beams open is drawn faintly in each of them: nobody can say which beam it took. The small numbers beside the beams of T and U are the probabilities for an atom arriving there; the graph shows the fraction reaching the end as T is turned.

**Try this**
- It starts with S passing +, T turned by 90° with its 0 beam blocked, and U passing −: a quarter of the atoms leaving S arrive. **Click the mask on T's 0 beam** to open it — the arrivals stop. A wide-open filter does nothing: its three ways add back to "a + atom is never −".
- Look at the read-out *Ways through T*: the [[?amplitude|amplitudes]] of the open paths and their [[?sum]]: +¼ − ½ + ¼ = 0.
- Remove U and let T pass *+ only*: turn T from 0° to 180° and compare the count with ((1 + cos α)/2)².
- With T wide open, turn it to any angle: nothing changes — the curve lies on the dashed line "T removed".
- Let T pass *0 only* at 90°: half of S's atoms pass T, and U (passing −) takes half of those.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1965);
      const W0 = 780, H0 = 330, MID = 178, OFF = 42, SPEED = 150;
      const APPS = [{ key: 'S', x: 92, w: 170 }, { key: 'T', x: 322, w: 170 }, { key: 'U', x: 552, w: 170 }];
      const OVEN = 50, DET = 752;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'S', type: 'select', label: 'S lets through', options: OPEN_OPTS, value: '+' },
        { id: 'T', type: 'select', label: 'T lets through', options: OPEN_OPTS.concat([['T removed', 'x']]), value: '+-' },
        { id: 'alpha', label: 'T turned by α', min: 0, max: 180, step: 1, value: 90, unit: '°' },
        { id: 'U', type: 'select', label: 'U lets through', options: OPEN_OPTS.concat([['U removed', 'x']]), value: '-' },
        { id: 'gamma', label: 'U turned by γ', min: 0, max: 180, step: 1, value: 0, unit: '°' },
        { id: 'rate', label: 'Atoms per second from the oven', min: 2, max: 200, step: 1, value: 40 },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the counts', primary: true }] }
      ], id => { if (id !== 'rate') { clearCounts(); updatePlot(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pred', 'Predicted: reach the end (of atoms leaving S)'], ['count', 'Counted'], ['amps', '⟨+T|+S⟩, ⟨0T|+S⟩, ⟨−T|+S⟩'], ['ways', 'Ways through T (amplitudes)']]);
      const plot = kit.plot(gb, { x: { label: 'α, angle of T (°)', min: 0, max: 180 }, y: { label: 'fraction reaching the end', min: 0, max: 1 }, legend: true }, 170);

      // the filters present, in order: { app, a (rad), m [open +, 0, −] }
      function chain(al, noT) {
        const fs = [{ app: 0, a: 0, m: openSet(V.S) }];
        if (V.T !== 'x' && !noT) fs.push({ app: 1, a: al * DEG, m: openSet(V.T) });
        if (V.U !== 'x') fs.push({ app: 2, a: V.gamma * DEG, m: openSet(V.U) });
        return fs;
      }
      // the fraction of atoms leaving S that reach the end: amplitudes carried through, blocked beams set to zero
      function predict(al, noT) {
        const fs = chain(al, noT); let out = 0, leave = 0;
        for (let k = 0; k < 3; k++) {
          if (!fs[0].m[k]) continue;
          leave += 1 / 3;
          let v = [0, 0, 0]; v[k] = 1;
          for (let i = 1; i < fs.length; i++) { v = matVec(Q.spinOneD(fs[i].a - fs[i - 1].a), v); v = v.map((x, j) => fs[i].m[j] ? x : 0); }
          out += (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) / 3;
        }
        return leave > 0 ? out / leave : 0;
      }
      function updatePlot() {
        const pts = [], none = [];
        for (let a = 0; a <= 180; a += 2) { pts.push([a, predict(a)]); none.push([a, predict(a, true)]); }
        const series = [{ pts, label: 'predicted, T as set', width: 2.2 }, { pts: none, label: 'T removed', dash: [5, 4], width: 1.4 }];
        plot.set({ series, marks: V.T === 'x' ? [] : [{ x: V.alpha, y: predict(V.alpha), label: 'now' }] });
      }
      let atoms = [], flashes = [], acc = 0, left = 0, arrived = 0;
      function clearCounts() { atoms = []; flashes = []; left = 0; arrived = 0; }

      // an atom's journey, decided when it leaves the oven: in each filter it either passes (weights over the open beams)
      // or is stopped at the mask of one blocked beam
      function makeAtom() {
        const fs = chain(V.alpha), plan = [null, null, null];
        const k = Math.min(2, Math.floor(R() * 3));
        if (!fs[0].m[k]) { plan[0] = { stop: k }; return { x: OVEN, plan, leftS: false }; }
        plan[0] = { w: [k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0] };
        let v = [0, 0, 0]; v[k] = 1;
        for (let i = 1; i < fs.length; i++) {
          const u = matVec(Q.spinOneD(fs[i].a - fs[i - 1].a), v), p = u.map(x => x * x), m = fs[i].m;
          let pass = m.every(Boolean) ? 1 : p.reduce((s, x, j) => s + (m[j] ? x : 0), 0);
          if (pass > 1e-12 && R() < pass) {
            plan[fs[i].app] = { w: p.map((x, j) => m[j] ? x / pass : 0) };
            const n = Math.sqrt(pass); v = u.map((x, j) => m[j] ? x / n : 0);
          } else {
            let r = R() * Math.max(1e-12, 1 - pass), j = -1;
            for (let q = 0; q < 3; q++) { if (m[q]) continue; j = q; r -= p[q]; if (r <= 0) break; }
            plan[fs[i].app] = { stop: Math.max(0, j) };
            return { x: OVEN, plan, leftS: false };
          }
        }
        return { x: OVEN, plan, leftS: false };
      }
      const offOf = j => j === 0 ? -OFF : j === 2 ? OFF : 0;
      function beamY(ap, j, x) {
        const u = (x - ap.x) / ap.w, off = offOf(j);
        if (u <= 0 || u >= 1) return MID;
        if (u < 0.3) return MID + off * u / 0.3;
        if (u < 0.7) return MID + off;
        return MID + off * (1 - u) / 0.3;
      }
      let view = { s: 1, ox: 0, oy: 0 };
      const toV = p => ({ x: (p.x - view.ox) / view.s, y: (p.y - view.oy) / view.s });
      const maskAt = p => {
        const q = toV(p);
        for (let a = 0; a < 3; a++) {
          const ap = APPS[a], key = ap.key;
          if (V[key] === 'x') continue;
          for (let j = 0; j < 3; j++) if (Math.abs(q.x - (ap.x + ap.w / 2)) < 14 && Math.abs(q.y - (MID + offOf(j))) < 14) return { key, j };
        }
        return null;
      };
      kit.click(st, p => {
        const hit = maskAt(p);
        if (!hit) return;
        const m = openSet(V[hit.key]); m[hit.j] = !m[hit.j];
        if (!m.some(Boolean)) return;
        ctl.set(hit.key, openStr(m)); clearCounts(); updatePlot();
      }, p => !!maskAt(p));
      updatePlot();

      const loop = kit.loop(dt => {
        acc += dt * V.rate;
        let k = 0; while (acc >= 1 && k < 50) { atoms.push(makeAtom()); acc -= 1; k++; }
        if (acc > 3) acc = 0;
        // move the atoms; stop them at blocked masks, count them at the end
        const keep = [];
        for (const at of atoms) {
          at.x += SPEED * dt;
          let gone = false;
          // an atom that left S is counted once its fate is known (stopped by T or U, or arrived)
          for (let a = 0; a < 3 && !gone; a++) {
            const pl = at.plan[a], ap = APPS[a];
            if (pl && pl.stop != null && at.x >= ap.x + ap.w / 2) { flashes.push({ x: ap.x + ap.w / 2, y: MID + offOf(pl.stop), t: 0, bad: true }); gone = true; if (a > 0) left++; }
          }
          if (!gone && at.x >= DET) { arrived++; left++; flashes.push({ x: DET, y: MID, t: 0 }); gone = true; }
          if (!gone) keep.push(at);
        }
        atoms = keep;
        for (const f of flashes) f.t += dt;
        flashes = flashes.filter(f => f.t < 0.5);

        // read-outs
        const fsNow = chain(V.alpha), sOpen = fsNow[0].m.filter(Boolean).length;
        ro.set('pred', pc(predict(V.alpha)));
        ro.set('count', left ? arrived + ' of ' + left + ' = ' + pc(arrived / left) : '—');
        const D = Q.spinOneD(V.alpha * DEG);
        ro.set('amps', sgn(D[0][0]) + ', ' + sgn(D[1][0]) + ', ' + sgn(D[2][0]));
        let ways = '—';
        if (V.T !== 'x' && V.U !== 'x' && sOpen === 1 && openSet(V.U).filter(Boolean).length === 1) {
          const k0 = fsNow[0].m.indexOf(true), jU = openSet(V.U).indexOf(true), mT = openSet(V.T), D2 = Q.spinOneD((V.gamma - V.alpha) * DEG);
          let sum = 0; const parts = [];
          for (let j = 0; j < 3; j++) {
            const amp = D2[jU][j] * D[j][k0];
            if (mT[j]) { sum += amp; parts.push(BEAM_NAMES[j] + ': ' + sgn(amp)); } else parts.push(BEAM_NAMES[j] + ': blocked');
          }
          ways = parts.join(', ') + ' → sum ' + sgn(sum);
        }
        ro.set('ways', ways);

        // drawing
        const c = st.begin(), C = kit.colors();
        view = fit(st, W0, H0);
        c.save(); c.translate(view.ox, view.oy); c.scale(view.s, view.s);
        const col = [C.hue(22), C.muted, C.hue(212)];
        // the axis of the beam
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(OVEN, MID); c.lineTo(DET, MID); c.stroke(); c.setLineDash([]);
        // oven and detector
        c.fillStyle = C.hue(10, 0.85); rrect(c, 8, MID - 22, OVEN - 8, 44, 6); c.fill();
        txt(c, 'oven', 29, MID + 36, C.muted, 11);
        c.fillStyle = C.surface2 || C.bg; c.strokeStyle = C.text; c.lineWidth = 1.5; rrect(c, DET, MID - 26, 20, 52, 4); c.fill(); c.stroke();
        txt(c, 'counter', DET + 10, MID + 40, C.muted, 11); txt(c, String(arrived), DET + 10, MID - 38, C.text, 13, 'center', 700);
        // the three filters
        let stateAmp = null;       // the (normalised) state arriving at the current filter, for the labels
        const sm = openSet(V.S); if (sm.filter(Boolean).length === 1) { stateAmp = [0, 0, 0]; stateAmp[sm.indexOf(true)] = 1; }
        let prevA = 0;
        for (let a = 0; a < 3; a++) {
          const ap = APPS[a], key = ap.key, present = V[key] !== 'x', ang = a === 0 ? 0 : a === 1 ? V.alpha * DEG : V.gamma * DEG;
          if (!present) {
            c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([4, 4]); rrect(c, ap.x - 4, MID - 70, ap.w + 8, 140, 10); c.stroke(); c.setLineDash([]);
            txt(c, key + ' removed', ap.x + ap.w / 2, MID - 84, C.faint, 12);
            continue;
          }
          const m = openSet(V[key]);
          c.fillStyle = C.surface || C.bg; c.strokeStyle = C.border || C.faint; c.lineWidth = 1.2; rrect(c, ap.x - 4, MID - 70, ap.w + 8, 140, 10); c.fill(); c.stroke();
          // the magnets that split and rejoin, drawn as pale wedges
          // the magnets that split and rejoin the beams: a sharp pole above, a flat one below (a strongly non-uniform field)
          c.fillStyle = C.hue(260, 0.16);
          for (const [u0, u1] of [[0.04, 0.26], [0.74, 0.96]]) {
            c.beginPath(); c.moveTo(ap.x + ap.w * u0, MID - 66); c.lineTo(ap.x + ap.w * u1, MID - 66); c.lineTo(ap.x + ap.w * (u0 + u1) / 2, MID - 52); c.closePath(); c.fill();
            c.fillRect(ap.x + ap.w * u0, MID + 60, ap.w * (u1 - u0), 6);
          }
          // amplitudes into this filter's beams for the labels
          let probs = null;
          if (stateAmp) {
            const u = a === 0 ? stateAmp.slice() : matVec(Q.spinOneD(ang - prevA), stateAmp);
            probs = u.map(x => x * x);
            const pass = probs.reduce((s, x, j) => s + (m[j] ? x : 0), 0);
            stateAmp = pass > 1e-9 ? u.map((x, j) => m[j] ? x / Math.sqrt(pass) : 0) : null;
          }
          prevA = ang;
          for (let j = 0; j < 3; j++) {
            const off = offOf(j), xm = ap.x + ap.w / 2;
            c.strokeStyle = m[j] ? col[j] : C.faint; c.lineWidth = m[j] ? 2 : 1.2; c.globalAlpha = m[j] ? 0.75 : 0.6;
            c.beginPath(); c.moveTo(ap.x, MID); c.lineTo(ap.x + 0.3 * ap.w, MID + off); c.lineTo(ap.x + 0.7 * ap.w, MID + off); c.lineTo(ap.x + ap.w, MID); c.stroke();
            c.globalAlpha = 1;
            if (!m[j]) { c.fillStyle = C.text; rrect(c, xm - 4, MID + off - 10, 8, 20, 2); c.fill(); }
            else { c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xm - 5, MID + off - 10); c.lineTo(xm - 5, MID + off - 6); c.moveTo(xm - 5, MID + off + 6); c.lineTo(xm - 5, MID + off + 10); c.moveTo(xm + 5, MID + off - 10); c.lineTo(xm + 5, MID + off - 6); c.moveTo(xm + 5, MID + off + 6); c.lineTo(xm + 5, MID + off + 10); c.stroke(); }
            txt(c, BEAM_NAMES[j], ap.x + 0.18 * ap.w, MID + off * 0.62 + (j === 1 ? -9 : 0), col[j], 12, 'center', 700);
            if (probs && a > 0) txt(c, pc(probs[j], 0), ap.x + 0.66 * ap.w, MID + off - 11, m[j] ? C.text : C.faint, 10.5);
          }
          dial(c, ap.x + 14, MID - 86, 11, ang, C.accent, C.faint);
          txt(c, a === 0 ? 'S (upright)' : key + ' turned ' + Math.round(ang / DEG) + '°', ap.x + 32, MID - 86, C.text, 12.5, 'left', 600);
        }
        // atoms: a dot in each open beam it may be in, faint where the chance is small
        for (const at of atoms) {
          let drawn = false;
          for (let a = 0; a < 3; a++) {
            const ap = APPS[a], pl = at.plan[a];
            if (at.x <= ap.x || at.x >= ap.x + ap.w || !pl) continue;
            drawn = true;
            if (pl.stop != null) { c.fillStyle = col[pl.stop]; c.beginPath(); c.arc(at.x, beamY(ap, pl.stop, at.x), 3.4, 0, TAU); c.fill(); }
            else for (let j = 0; j < 3; j++) if (pl.w[j] > 1e-3) { c.globalAlpha = 0.25 + 0.75 * pl.w[j]; c.fillStyle = col[j]; c.beginPath(); c.arc(at.x, beamY(ap, j, at.x), 3.4, 0, TAU); c.fill(); }
            c.globalAlpha = 1;
          }
          if (!drawn) { c.fillStyle = C.text; c.beginPath(); c.arc(at.x, MID, 3.2, 0, TAU); c.fill(); }
        }
        for (const f of flashes) {
          const a = 1 - f.t / 0.5;
          c.fillStyle = f.bad ? 'hsl(0 70% 55% / ' + (0.6 * a) + ')' : 'hsl(48 100% 60% / ' + a + ')';
          c.beginPath(); c.arc(f.x, f.y, 3 + 7 * (1 - a), 0, TAU); c.fill();
        }
        txt(c, 'Click a mask to open or block a beam', W0 / 2, H0 - 10, C.muted, 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ spin-sg-half */
  Hyper.sim('spin-sg-half', {
    title: 'Spin one-half: crossed filters and the filter between',
    blurb: `Spin-one-half atoms — silver, as in Stern and Gerlach's experiment — pass a row of filters. Each splits the beam in two, blocks its − beam and passes its + beam; the dial above each filter shows the direction it is turned to. An atom passes a filter turned by θ from the one before with probability cos²(θ/2): the half angle that marks spin one-half. The graph shows the fraction of atoms leaving S that pass the last filter U.

**Try this**
- It starts crossed — S at 0°, U at 180° — with one filter at 90° between them: a quarter of the atoms leaving S get through. Set the number of middle filters to 0: none do.
- With one middle filter, sweep its angle: the curve is sin²θ/4 — zero at 0° and 180°, largest at 90° and 270°.
- Add middle filters (spaced evenly): two give 42 %, nine give 78 %. Many small turns lead the spin round from up to down.
- With no middle filter, turn U: the fraction is cos²(γ/2) — one half at 90°, zero at 180°, all again at 360°. (The [[?amplitude]] at 360° is −1; only interference could show the sign.)`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1922);
      const W0 = 780, H0 = 300, MID = 170, OFF = 34, SPEED = 170, OVEN = 50, DET = 752, X0 = 78, X1 = 730;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Filters between S and U', min: 0, max: 9, step: 1, value: 1 },
        { id: 'theta', label: 'Angle of the middle filter (when there is one)', min: 0, max: 360, step: 1, value: 90, unit: '°' },
        { id: 'gamma', label: 'Angle of the last filter U', min: 0, max: 360, step: 1, value: 180, unit: '°' },
        { id: 'rate', label: 'Atoms per second from the oven', min: 2, max: 200, step: 1, value: 50 },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the counts', primary: true }] }
      ], id => { if (id !== 'rate') { atoms = []; left = 0; arrived = 0; updatePlot(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['steps', 'Each step passes'], ['pred', 'Predicted: pass U (of atoms leaving S)'], ['count', 'Counted'], ['none', 'Without middle filters, cos²(γ/2)']]);
      const plot = kit.plot(gb, { x: { label: 'angle of the middle filter θ (°)', min: 0, max: 360 }, y: { label: 'fraction passing U', min: 0, max: 1 }, legend: true }, 170);

      const angles = () => {
        const n = Math.round(V.N), g = V.gamma, list = [0];
        if (n === 1) list.push(V.theta);
        else for (let i = 1; i <= n; i++) list.push(g * i / (n + 1));
        list.push(g);
        return list;
      };
      const stepP = (a, b) => Q.spinHalfP((b - a) * DEG);
      const predictList = L => { let p = 1; for (let i = 1; i < L.length; i++) p *= stepP(L[i - 1], L[i]); return p; };
      function updatePlot() {
        const n = Math.round(V.N), g = V.gamma;
        if (n === 1) {
          const pts = [], none = [];
          for (let t = 0; t <= 360; t += 3) { pts.push([t, predictList([0, t, g])]); none.push([t, predictList([0, g])]); }
          plot.set({ x: { label: 'angle of the middle filter θ (°)', min: 0, max: 360 }, series: [{ pts, label: 'one middle filter at θ', width: 2.2 }, { pts: none, label: 'no middle filter', dash: [5, 4] }], marks: [{ x: V.theta, y: predictList(angles()), label: 'now' }] });
        } else {
          const pts = [];
          for (let k = 0; k <= 20; k++) { const L = [0]; for (let i = 1; i <= k; i++) L.push(g * i / (k + 1)); L.push(g); pts.push([k, predictList(L)]); }
          plot.set({ x: { label: 'number of evenly spaced middle filters N', min: 0, max: 20 }, series: [{ pts, label: 'N filters from S to U', dots: 3, width: 1.4 }], marks: [{ x: n, y: predictList(angles()), label: 'now' }] });
        }
      }
      let atoms = [], flashes = [], acc = 0, left = 0, arrived = 0;
      // positions of the filters along the beam
      const layout = n => { const slot = (X1 - X0) / n, w = Math.min(120, slot * 0.8); return Array.from({ length: n }, (_, i) => ({ x: X0 + slot * i + (slot - w) / 2, w })); };
      function makeAtom() {
        const L = angles(), plan = [];
        // S: an unpolarised atom is + or − for S with even chances
        if (R() >= 0.5) { plan.push('stop'); return { x: OVEN, plan, n: L.length, leftS: false }; }
        plan.push('pass');
        for (let i = 1; i < L.length; i++) {
          if (R() < stepP(L[i - 1], L[i])) plan.push('pass'); else { plan.push('stop'); break; }
        }
        return { x: OVEN, plan, n: L.length, leftS: false };
      }
      const beamY = (ap, up, x) => {
        const u = (x - ap.x) / ap.w, off = up ? -OFF : OFF;
        if (u <= 0 || u >= 1) return MID;
        if (u < 0.3) return MID + off * u / 0.3;
        if (u < 0.7) return MID + off;
        return MID + off * (1 - u) / 0.3;
      };
      updatePlot();

      const loop = kit.loop(dt => {
        const L = angles(), aps = layout(L.length);
        acc += dt * V.rate;
        let k = 0; while (acc >= 1 && k < 50) { atoms.push(makeAtom()); acc -= 1; k++; }
        if (acc > 3) acc = 0;
        const keep = [];
        for (const at of atoms) {
          at.x += SPEED * dt;
          if (at.n !== L.length) continue;                      // the row changed: drop atoms from the old one
          let gone = false;
          for (let i = 0; i < aps.length && !gone; i++) if (at.plan[i] === 'stop' && at.x >= aps[i].x + aps[i].w / 2) { flashes.push({ x: aps[i].x + aps[i].w / 2, y: MID + OFF, t: 0, bad: true }); gone = true; if (i > 0) left++; }
          if (!gone && at.x >= DET) { arrived++; left++; flashes.push({ x: DET, y: MID, t: 0 }); gone = true; }
          if (!gone) keep.push(at);
        }
        atoms = keep;
        for (const f of flashes) f.t += dt;
        flashes = flashes.filter(f => f.t < 0.5);

        const steps = []; for (let i = 1; i < L.length; i++) steps.push(stepP(L[i - 1], L[i]).toFixed(2));
        ro.set('steps', steps.length > 5 ? steps.slice(0, 4).join(' × ') + ' × … (' + steps.length + ' steps)' : steps.join(' × '));
        ro.set('pred', pc(predictList(L)));
        ro.set('count', left ? arrived + ' of ' + left + ' = ' + pc(arrived / left) : '—');
        ro.set('none', pc(predictList([0, V.gamma])));

        const c = st.begin(), C = kit.colors(), v = fit(st, W0, H0);
        c.save(); c.translate(v.ox, v.oy); c.scale(v.s, v.s);
        const cUp = C.hue(22), cDn = C.hue(212);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(OVEN, MID); c.lineTo(DET, MID); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.hue(10, 0.85); rrect(c, 8, MID - 22, OVEN - 8, 44, 6); c.fill();
        txt(c, 'oven', 29, MID + 36, C.muted, 11);
        c.fillStyle = C.surface2 || C.bg; c.strokeStyle = C.text; c.lineWidth = 1.5; rrect(c, DET, MID - 26, 20, 52, 4); c.fill(); c.stroke();
        txt(c, String(arrived), DET + 10, MID - 38, C.text, 13, 'center', 700); txt(c, 'counter', DET + 10, MID + 40, C.muted, 11);
        for (let i = 0; i < aps.length; i++) {
          const ap = aps[i], xm = ap.x + ap.w / 2;
          c.fillStyle = C.surface || C.bg; c.strokeStyle = C.border || C.faint; c.lineWidth = 1.2; rrect(c, ap.x - 3, MID - 56, ap.w + 6, 112, 8); c.fill(); c.stroke();
          for (const up of [true, false]) {
            const off = up ? -OFF : OFF;
            c.strokeStyle = up ? cUp : C.faint; c.lineWidth = up ? 2 : 1.2; c.globalAlpha = 0.75;
            c.beginPath(); c.moveTo(ap.x, MID); c.lineTo(ap.x + 0.3 * ap.w, MID + off); c.lineTo(ap.x + 0.7 * ap.w, MID + off); c.lineTo(ap.x + ap.w, MID); c.stroke(); c.globalAlpha = 1;
          }
          c.fillStyle = C.text; rrect(c, xm - 3.5, MID + OFF - 9, 7, 18, 2); c.fill();
          const lab = i === 0 ? 'S' : i === aps.length - 1 ? 'U' : String(i);
          dial(c, xm, MID - 76, Math.min(12, ap.w * 0.28), L[i] * DEG, C.accent, C.faint);
          txt(c, lab, xm, MID - 100, C.text, 12, 'center', 700);
          txt(c, Math.round(L[i]) + '°', xm, MID + 70, C.muted, 11);
          if (i > 0) txt(c, pc(stepP(L[i - 1], L[i]), 0), ap.x - (ap.x - (aps[i - 1].x + aps[i - 1].w)) / 2, MID + 88, C.muted, 10);
        }
        for (const at of atoms) {
          let y = MID, inside = -1;
          for (let i = 0; i < aps.length; i++) if (at.x > aps[i].x && at.x < aps[i].x + aps[i].w) inside = i;
          let colr = C.text;
          if (inside >= 0) { const up = at.plan[inside] === 'pass'; y = beamY(aps[inside], up, at.x); colr = up ? cUp : cDn; }
          c.fillStyle = colr; c.beginPath(); c.arc(at.x, y, 3.2, 0, TAU); c.fill();
        }
        for (const f of flashes) {
          const a = 1 - f.t / 0.5;
          c.fillStyle = f.bad ? 'hsl(0 70% 55% / ' + (0.6 * a) + ')' : 'hsl(48 100% 60% / ' + a + ')';
          c.beginPath(); c.arc(f.x, f.y, 3 + 7 * (1 - a), 0, TAU); c.fill();
        }
        txt(c, 'each filter passes its + beam (up along its dial) and blocks its − beam', W0 / 2, H0 - 10, C.muted, 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ spin-stationary */
  const ME = 9.1093837015e-31, HP = 6.62607015e-34, QE = 1.602176634e-19;
  const boxE1 = Lnm => HP * HP / (8 * ME * Math.pow(Lnm * 1e-9, 2)) / QE;     // eV

  Hyper.sim('spin-stationary', {
    title: 'Turning arrows: stationary states and beats',
    blurb: `An electron in a box a fraction of a nanometre wide. Each stationary state has an [[?amplitude]] that turns like a clock hand, e^{−iEt/ħ}, at its own rate E/h — shown on the left, at the point of the box marked by the dashed line. Mix two states and add their arrows head to tail: the [[?absolute-square|square of the total]] is the probability density there. The box on the right shows the whole cloud; the graph follows the average position ⟨x⟩ and the density at the marker in time. The clock runs in slow motion: femtoseconds per second.

**Try this**
- Set the share of state B to 0: one stationary state. Its arrow spins, but the cloud never moves — it is *stationary*.
- Back to a half-and-half mix of levels 1 and 2: the cloud sloshes from wall to wall once every h/(E₂ − E₁) = 1.32 fs, the [[?rotating-arrow|arrows]] beating in and out of step.
- Mix levels 1 and 3: both states are symmetric about the centre, so ⟨x⟩ stays in the middle — yet the cloud still breathes.
- Widen the box: all energies fall as 1/L², and the sloshing slows down.
- Drag the marker (or its slider): where one state's arrow is short (near its node), the total hardly changes.`,
    mount(box, kit) {
      const W0 = 780, H0 = 350, NX = 160;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'na', label: 'State A: level n', min: 1, max: 4, step: 1, value: 1 },
        { id: 'nb', label: 'State B: level n', min: 1, max: 4, step: 1, value: 2 },
        { id: 'w', label: 'Share of state B, |b|²', min: 0, max: 1, step: 0.01, value: 0.5 },
        { id: 'L', label: 'Width of the box', min: 0.3, max: 1.5, step: 0.05, value: 0.6, unit: 'nm' },
        { id: 'x0', label: 'Marker position (fraction of the box)', min: 0.02, max: 0.98, step: 0.01, value: 0.25 },
        { id: 'speed', label: 'Slow motion', min: 0.05, max: 2, value: 0.25, log: true, sig: 2, unit: 'fs per s' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the clock', primary: true }] }
      ], id => { if (id === 'restart' || id === 'na' || id === 'nb' || id === 'L' || id === 'w') { t = 0; hist = []; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Energies E_A, E_B'], ['f', 'Arrow frequencies E/h'], ['beat', 'Beat period h/ΔE'], ['lam', 'Light of that frequency, hc/ΔE'], ['xm', 'Average position ⟨x⟩ now']]);
      const plot = kit.plot(gb, { x: { label: 'time (fs)' }, y: { label: 'fraction', min: 0, max: 1 }, legend: true }, 160);
      let t = 0, hist = [], frame = 0;
      const BX0 = 330, BX1 = 760, BASE = 300, TOP = 60;
      let view = { s: 1, ox: 0, oy: 0 };
      kit.drag(st, {
        hit: p => { const x = (p.x - view.ox) / view.s, y = (p.y - view.oy) / view.s; const mx = BX0 + V.x0 * (BX1 - BX0); return Math.abs(x - mx) < 12 && y > TOP - 10 && y < BASE + 10 ? 1 : null; },
        move: (k, p) => { const x = (p.x - view.ox) / view.s; ctl.set('x0', Math.max(0.02, Math.min(0.98, (x - BX0) / (BX1 - BX0)))); },
        hover: true
      });

      const loop = kit.loop(dt => {
        t += dt * V.speed;                             // femtoseconds
        const na = Math.round(V.na), nb = Math.round(V.nb), same = na === nb;
        const E1 = boxE1(V.L), Ea = na * na * E1, Eb = nb * nb * E1;
        const b = same ? 0 : Math.sqrt(V.w), a = same ? 1 : Math.sqrt(1 - V.w);
        const tsec = t * 1e-15, pa = -Ea * tsec / HBAR_EVS, pb = -Eb * tsec / HBAR_EVS;   // phases of the two arrows
        const norm = Math.sqrt(2);                     // ψ_n(u) = √2 sin(nπu), u = x/L, so ∫ψ² du = 1
        const psi = (n, u) => norm * Math.sin(n * Math.PI * u);
        // the cloud on a grid, and its mean
        const rho = new Float64Array(NX + 1), re = new Float64Array(NX + 1);
        let xm = 0, sum = 0;
        for (let i = 0; i <= NX; i++) {
          const u = i / NX, A1 = a * psi(na, u), B1 = b * psi(nb, u);
          const zr = A1 * Math.cos(pa) + B1 * Math.cos(pb), zi = A1 * Math.sin(pa) + B1 * Math.sin(pb);
          rho[i] = zr * zr + zi * zi; re[i] = zr; sum += rho[i]; xm += u * rho[i];
        }
        xm = sum > 0 ? xm / sum : 0.5;
        const u0 = V.x0, A0 = a * psi(na, u0), B0 = b * psi(nb, u0);
        const zA = { re: A0 * Math.cos(pa), im: A0 * Math.sin(pa) }, zB = { re: B0 * Math.cos(pb), im: B0 * Math.sin(pb) };
        const rho0 = Math.pow(zA.re + zB.re, 2) + Math.pow(zA.im + zB.im, 2);
        // history for the graph
        hist.push([t, xm, rho0 / 4]); if (hist.length > 600) hist.shift();
        if ((frame++ % 4) === 0) {
          const dE = Math.abs(Eb - Ea), Tb = dE > 0 ? H_EVS / dE * 1e15 : 4, win = Math.max(1, Math.min(40, 3 * Tb));
          const pts = hist.filter(p => p[0] >= t - win);
          plot.set({ x: { label: 'time (fs)', min: Math.max(0, t - win), max: Math.max(win, t) }, series: [{ pts: pts.map(p => [p[0], p[1]]), label: '⟨x⟩ / L, average position' }, { pts: pts.map(p => [p[0], p[2]]), label: 'density at the marker (× L/4)' }] });
        }
        const dE = Math.abs(Eb - Ea);
        ro.set('E', same ? Ea.toFixed(2) + ' eV (one state)' : Ea.toFixed(2) + ' eV, ' + Eb.toFixed(2) + ' eV');
        ro.set('f', (Ea / H_EVS / 1e12).toFixed(0) + ' THz' + (same ? '' : ', ' + (Eb / H_EVS / 1e12).toFixed(0) + ' THz'));
        ro.set('beat', same || V.w === 0 || V.w === 1 ? 'no beat: stationary' : (H_EVS / dE * 1e15).toFixed(2) + ' fs');
        ro.set('lam', same ? '—' : (1239.84 / dE).toFixed(0) + ' nm');
        ro.set('xm', (xm * V.L).toFixed(3) + ' nm (' + (100 * xm).toFixed(0) + ' % across)');

        // drawing
        const c = st.begin(), C = kit.colors();
        view = fit(st, W0, H0);
        c.save(); c.translate(view.ox, view.oy); c.scale(view.s, view.s);
        const colA = C.hue(22), colB = C.hue(160);
        // the arrows at the marker
        const cx = 140, cy = 128, R0 = 44;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(cx - 120, cy); c.lineTo(cx + 120, cy); c.moveTo(cx, cy - 105); c.lineTo(cx, cy + 105); c.stroke();
        c.beginPath(); c.arc(cx, cy, R0 * Math.SQRT2, 0, TAU); c.setLineDash([2, 4]); c.stroke(); c.setLineDash([]);
        const ax = cx + R0 * zA.re, ay = cy - R0 * zA.im, bx = ax + R0 * zB.re, by = ay - R0 * zB.im;
        arrowTo(c, cx, cy, ax, ay, colA, 2.6); arrowTo(c, ax, ay, bx, by, colB, 2.6); arrowTo(c, cx, cy, bx, by, C.text, 2.2);
        txt(c, 'amplitude at the marker', cx, 14, C.muted, 11.5);
        txt(c, 'A: n = ' + na, 20, 262, colA, 12, 'left', 700); txt(c, 'B: n = ' + nb + (same ? ' (same)' : ''), 20, 280, colB, 12, 'left', 700);
        txt(c, 'total² = ' + rho0.toFixed(2) + ' / L', 20, 298, C.text, 12, 'left');
        txt(c, 'Re and Im of the arrows', cx, 240, C.faint, 10.5);
        // the energy ladder
        const lx = 190, ly0 = 330, lyTop = 250, Emax = 16 * E1;
        for (let n = 1; n <= 4; n++) {
          const y = ly0 - (ly0 - lyTop) * n * n * E1 / Emax, on = n === na || n === nb;
          c.strokeStyle = n === na ? colA : n === nb ? colB : C.faint; c.lineWidth = on ? 2.4 : 1; c.beginPath(); c.moveTo(lx, y); c.lineTo(lx + 60, y); c.stroke();
          txt(c, 'n=' + n, lx + 66, y, on ? C.text : C.faint, 10, 'left');
        }
        // the box and its cloud
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(BX0, TOP - 20); c.lineTo(BX0, BASE); c.lineTo(BX1, BASE); c.lineTo(BX1, TOP - 20); c.stroke();
        const ymax = 4.2, sc = (BASE - TOP) / ymax;
        c.fillStyle = C.hue(265, 0.35); c.beginPath(); c.moveTo(BX0, BASE);
        for (let i = 0; i <= NX; i++) c.lineTo(BX0 + (BX1 - BX0) * i / NX, BASE - sc * Math.min(ymax, rho[i]));
        c.lineTo(BX1, BASE); c.closePath(); c.fill();
        c.strokeStyle = C.hue(265); c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= NX; i++) { const x = BX0 + (BX1 - BX0) * i / NX, y = BASE - sc * Math.min(ymax, rho[i]); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath();
        const mid = BASE - sc * 2.1;
        for (let i = 0; i <= NX; i++) { const x = BX0 + (BX1 - BX0) * i / NX, y = mid - sc * 0.45 * re[i]; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke(); c.setLineDash([]);
        txt(c, 'probability density |ψ|²', BX0 + 8, TOP - 30, C.hue(265), 11.5, 'left', 600);
        txt(c, 'dashed: real part of ψ', BX1 - 8, TOP - 30, C.muted, 10.5, 'right');
        // the marker and the mean position
        const mx = BX0 + V.x0 * (BX1 - BX0);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(mx, TOP - 12); c.lineTo(mx, BASE); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.text; c.beginPath(); c.arc(mx, TOP - 12, 5, 0, TAU); c.fill();
        const xmx = BX0 + xm * (BX1 - BX0);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(xmx, BASE + 4); c.lineTo(xmx - 7, BASE + 16); c.lineTo(xmx + 7, BASE + 16); c.closePath(); c.fill();
        txt(c, '⟨x⟩', xmx, BASE + 28, C.accent, 11);
        txt(c, '0', BX0, BASE + 14, C.muted, 10.5); txt(c, V.L.toFixed(2) + ' nm', BX1, BASE + 14, C.muted, 10.5);
        txt(c, 't = ' + t.toFixed(2) + ' fs', BX1, H0 - 8, C.muted, 11, 'right');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ spin-flipflop */
  const HBAR_UEV_NS = HBAR_EVS * 1e6 * 1e9;      // ħ in µeV·ns (0.658)

  // the stationary states of [[m + d/2, −A], [−A, m − d/2]]: { lo: [a1, a2], hi: [a1, a2], w } (real, normalised)
  function eig2(d, A) {
    const w = Math.sqrt(d * d / 4 + A * A);
    if (A < 1e-9) return d >= 0 ? { lo: [0, 1], hi: [1, 0], w } : { lo: [1, 0], hi: [0, 1], w };
    const vec = lam => { const a2 = (d / 2 - lam) / A, n = Math.sqrt(1 + a2 * a2); return [1 / n, a2 / n]; };
    return { lo: vec(-w), hi: vec(w), w };
  }

  Hyper.sim('spin-flipflop', {
    title: 'The Hamiltonian matrix: two coupled states',
    blurb: `Two base states, 1 and 2, and the Hamiltonian [[?matrix]] that tells their amplitudes how to change: iħ dC/dt = HC. The diagonal holds the energies the states would have alone (their mean E₀ and difference δ); the corner elements −A couple them. The circles show the two amplitudes C₁ and C₂ as [[?rotating-arrow|turning arrows]] and the bars their probabilities; on the right, the energy levels with and without coupling, and what each stationary state is made of.

**Try this**
- Start in state 1 with δ = 0: the probability swings completely to state 2 and back, at 2A/h. Double A: twice as fast.
- Raise δ: the swing becomes faster but smaller — at δ = 2A only half the probability crosses (4A²/(δ² + 4A²)).
- Start in a stationary state: the arrows keep turning, together, and the probabilities never change.
- Change E₀: both arrows spin faster or slower, but the probabilities are untouched — only energy differences matter.
- Set A to 0: the states are no longer coupled, and nothing flows.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 780, H0 = 330;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'A', label: 'Coupling A', min: 0, max: 20, step: 0.1, value: 5, unit: 'µeV' },
        { id: 'd', label: 'Energy difference δ = H₁₁ − H₂₂', min: -40, max: 40, step: 0.5, value: 0, unit: 'µeV' },
        { id: 'E0', label: 'Common energy E₀', min: 0, max: 40, step: 0.5, value: 10, unit: 'µeV' },
        { id: 'start', type: 'select', label: 'Start in', options: [['state 1', 's1'], ['state 2', 's2'], ['stationary state I (lower)', 'lo'], ['stationary state II (upper)', 'hi']], value: 's1' },
        { id: 'speed', label: 'Slow motion', min: 0.02, max: 1, value: 0.1, log: true, sig: 2, unit: 'ns per s' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], id => { if (id !== 'speed' && id !== 'E0') t = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lev', 'Stationary energies E_I, E_II'], ['split', 'Splitting √(δ² + 4A²)'], ['freq', 'Swing frequency ΔE/h'], ['pmax', 'Largest P₂ from state 1'], ['now', 'Now: P₁, P₂']]);
      const plot = kit.plot(gb, { x: { label: 'time (ns)' }, y: { label: 'probability', min: 0, max: 1 }, legend: true }, 160);
      let t = 0, frame = 0;
      const Hm = () => [[V.E0 + V.d / 2, -V.A], [-V.A, V.E0 - V.d / 2]];
      const c0 = () => { const e = eig2(V.d, V.A); return V.start === 's1' ? [1, 0] : V.start === 's2' ? [0, 1] : V.start === 'lo' ? e.lo : e.hi; };

      const loop = kit.loop(dt => {
        t += dt * V.speed;
        const H = Hm(), init = c0(), e = eig2(V.d, V.A), split = 2 * e.w;
        const [C1, C2] = Q.evolve2(H, init, t, HBAR_UEV_NS), P1 = Q.abs2(C1), P2 = Q.abs2(C2);
        if ((frame++ % 3) === 0) {
          const per = split > 1e-6 ? 4.135667696 / split : 5, win = Math.max(0.5, Math.min(20, 3 * per)), t0 = Math.max(0, t - win), t1 = Math.max(win, t);
          const p1 = [], p2 = [];
          for (let i = 0; i <= 200; i++) { const tt = t0 + (t1 - t0) * i / 200; if (tt > t + 1e-12) break; const z = Q.evolve2(H, init, tt, HBAR_UEV_NS); p1.push([tt, Q.abs2(z[0])]); p2.push([tt, Q.abs2(z[1])]); }
          plot.set({ x: { label: 'time (ns)', min: t0, max: t1 }, series: [{ pts: p1, label: 'P₁ = |C₁|²' }, { pts: p2, label: 'P₂ = |C₂|²' }] });
        }
        const Elo = V.E0 - e.w, Ehi = V.E0 + e.w;
        ro.set('lev', Elo.toFixed(2) + ' and ' + Ehi.toFixed(2) + ' µeV');
        ro.set('split', split.toFixed(2) + ' µeV');
        ro.set('freq', split > 1e-6 ? (split / 4.135667696).toFixed(2) + ' GHz (period ' + (4.135667696 / split).toFixed(3) + ' ns)' : 'no coupling, no swing');
        const pm = 4 * V.A * V.A + V.d * V.d > 0 ? 4 * V.A * V.A / (4 * V.A * V.A + V.d * V.d) : 0;
        ro.set('pmax', pc(pm));
        ro.set('now', P1.toFixed(3) + ', ' + P2.toFixed(3));

        const c = st.begin(), C = kit.colors(), v = fit(st, W0, H0);
        c.save(); c.translate(v.ox, v.oy); c.scale(v.s, v.s);
        const col1 = C.hue(22), col2 = C.hue(212);
        // the matrix
        const mx = 20, my = 70;
        txt(c, 'H =', mx, my + 40, C.text, 16, 'left', 600);
        c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(mx + 46, my); c.lineTo(mx + 40, my); c.lineTo(mx + 40, my + 80); c.lineTo(mx + 46, my + 80); c.stroke();
        c.beginPath(); c.moveTo(mx + 204, my); c.lineTo(mx + 210, my); c.lineTo(mx + 210, my + 80); c.lineTo(mx + 204, my + 80); c.stroke();
        txt(c, (V.E0 + V.d / 2).toFixed(1), mx + 85, my + 20, col1, 14, 'center', 700); txt(c, (-V.A).toFixed(1), mx + 165, my + 20, C.accent, 14, 'center', 700);
        txt(c, (-V.A).toFixed(1), mx + 85, my + 60, C.accent, 14, 'center', 700); txt(c, (V.E0 - V.d / 2).toFixed(1), mx + 165, my + 60, col2, 14, 'center', 700);
        txt(c, 'µeV', mx + 125, my + 100, C.muted, 11);
        txt(c, 'diagonal: energies alone', mx + 125, my + 124, C.muted, 10.5); txt(c, 'corners: the coupling −A', mx + 125, my + 140, C.muted, 10.5);
        txt(c, 'iħ dCᵢ/dt = Σ Hᵢⱼ Cⱼ', mx + 125, 30, C.text, 13, 'center', 600);
        // the two amplitudes
        const circ = (x, y, z, P, col, name) => {
          const r = 52;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
          c.beginPath(); c.moveTo(x - r - 6, y); c.lineTo(x + r + 6, y); c.moveTo(x, y - r - 6); c.lineTo(x, y + r + 6); c.stroke();
          arrowTo(c, x, y, x + r * z.re, y - r * z.im, col, 3);
          const bx = x + r + 22, bh = 2 * r;
          c.strokeStyle = C.faint; c.strokeRect(bx, y - r, 14, bh);
          c.fillStyle = col; c.fillRect(bx, y + r - bh * P, 14, bh * P);
          txt(c, name, x, y - r - 16, col, 13, 'center', 700);
          txt(c, (100 * P).toFixed(0) + ' %', bx + 7, y + r + 14, C.text, 11);
        };
        circ(330, 110, C1, P1, col1, 'C₁ (state 1)');
        circ(330, 250, C2, P2, col2, 'C₂ (state 2)');
        // the levels
        const lx = 520, lw = 70, Emin = Math.min(Elo, V.E0 - Math.abs(V.d) / 2) - 3, Emax = Math.max(Ehi, V.E0 + Math.abs(V.d) / 2) + 3;
        const yOf = E => 290 - 240 * (E - Emin) / Math.max(1e-6, Emax - Emin);
        c.setLineDash([5, 4]); c.lineWidth = 1.6;
        c.strokeStyle = col1; c.beginPath(); c.moveTo(lx, yOf(V.E0 + V.d / 2)); c.lineTo(lx + lw, yOf(V.E0 + V.d / 2)); c.stroke();
        c.strokeStyle = col2; c.beginPath(); c.moveTo(lx, yOf(V.E0 - V.d / 2)); c.lineTo(lx + lw, yOf(V.E0 - V.d / 2)); c.stroke();
        c.setLineDash([]);
        txt(c, 'H₁₁', lx - 6, yOf(V.E0 + V.d / 2) - (V.d >= 0 ? 7 : -7), col1, 10.5, 'right'); txt(c, 'H₂₂', lx - 6, yOf(V.E0 - V.d / 2) + (V.d >= 0 ? 7 : -7), col2, 10.5, 'right');
        const x2 = lx + lw + 50;
        for (const [E, vec, nm] of [[Elo, e.lo, 'I'], [Ehi, e.hi, 'II']]) {
          const y = yOf(E);
          c.strokeStyle = C.text; c.lineWidth = 2.6; c.beginPath(); c.moveTo(x2, y); c.lineTo(x2 + lw, y); c.stroke();
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(lx + lw, yOf(V.E0 + V.d / 2)); c.lineTo(x2, y); c.moveTo(lx + lw, yOf(V.E0 - V.d / 2)); c.lineTo(x2, y); c.stroke(); c.setLineDash([]);
          const p1 = vec[0] * vec[0];
          c.fillStyle = col1; c.fillRect(x2 + lw + 8, y - 5, 50 * p1, 10); c.fillStyle = col2; c.fillRect(x2 + lw + 8 + 50 * p1, y - 5, 50 * (1 - p1), 10);
          txt(c, nm, x2 + lw / 2, y + (nm === 'I' ? 12 : -12), C.text, 11.5, 'center', 700);
        }
        txt(c, 'alone', lx + lw / 2, 312, C.muted, 11); txt(c, 'coupled', x2 + lw / 2, 312, C.muted, 11); txt(c, 'made of 1 | 2', x2 + lw + 33, 312, C.muted, 10.5);
        txt(c, 't = ' + t.toFixed(3) + ' ns', W0 - 10, 18, C.muted, 11, 'right');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ammonia */
  const NH3_A = 49.36;                            // µeV: 2A = 98.7 µeV, 23.87 GHz
  const NH3_MU = 1.47 * 3.33564e-30;              // C·m
  const muE_ueV = kVcm => NH3_MU * kVcm * 1e5 / QE * 1e6;   // μℰ in µeV for ℰ in kV/cm
  const HBAR_UEV_PS = HBAR_EVS * 1e6 * 1e12;      // ħ in µeV·ps (658)
  // a molecule drawn from the side: three hydrogens in a tilted triangle, nitrogen above or below
  function drawNH3(c, x, y, s, pUp, C) {
    const Hs = [[-1, 0.28], [1, 0.28], [0.1, -0.34]].map(([a, b]) => [x + 42 * s * a, y + 30 * s * b]);
    const Ns = [[x, y - 46 * s, pUp], [x, y + 46 * s, 1 - pUp]];
    // the plane of the hydrogens
    c.fillStyle = C.hue(200, 0.08); c.strokeStyle = C.faint; c.lineWidth = 1;
    c.beginPath(); c.moveTo(Hs[0][0], Hs[0][1]); c.lineTo(Hs[1][0], Hs[1][1]); c.lineTo(Hs[2][0], Hs[2][1]); c.closePath(); c.fill(); c.stroke();
    for (const [nx, ny, p] of Ns) {
      if (p < 0.01) continue;
      c.globalAlpha = 0.15 + 0.85 * p;
      c.strokeStyle = C.muted; c.lineWidth = 4 * s;
      for (const h of Hs) { c.beginPath(); c.moveTo(nx, ny); c.lineTo(h[0], h[1]); c.stroke(); }
      c.fillStyle = '#3a5cf0'; c.beginPath(); c.arc(nx, ny, 17 * s, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.font = 700 + ' ' + Math.round(13 * s) + 'px ' + fam(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('N', nx, ny);
      c.globalAlpha = 1;
    }
    for (const h of Hs) { c.fillStyle = '#e9ecf2'; c.strokeStyle = '#8890a8'; c.lineWidth = 1.2; c.beginPath(); c.arc(h[0], h[1], 11 * s, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#333'; c.font = 600 + ' ' + Math.round(10 * s) + 'px ' + fam(); c.fillText('H', h[0], h[1]); }
  }

  Hyper.sim('spin-ammonia', {
    title: 'The ammonia molecule: two states and an electric field',
    blurb: `The nitrogen of NH₃ can be on either side of the plane of the three hydrogens: state 1 (up) or state 2 (down), coupled by tunnelling with amplitude −A. The ghost images show the probability of each; the circles show the two [[?amplitude|amplitudes]] turning. An electric field ℰ adds ±μℰ to the two energies. The graph shows the two stationary energies E₀ ± √(A² + μ²ℰ²) against the field — Feynman's two-state model, with A = 49.4 µeV (the 23.87 GHz line) and μ = 1.47 D.

**Try this**
- Start with the nitrogen up in zero field: it tunnels down and back up, every 41.9 ps — at 23.87 GHz.
- Raise the field: the swing gets smaller and faster; above about 30 kV/cm the nitrogen hardly leaves the side the field favours.
- Start in stationary state I or II: in zero field the nitrogen is half up, half down, and stays so. In a strong field the stationary states themselves become nearly "up" and "down".
- Follow the graph: near zero field the levels move quadratically ([[?small-approximation]]), in strong fields linearly.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 780, H0 = 320;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'Ef', label: 'Electric field ℰ', min: 0, max: 60, step: 0.5, value: 0, unit: 'kV/cm' },
        { id: 'start', type: 'select', label: 'Start with', options: [['nitrogen up (state 1)', 's1'], ['stationary state I (upper)', 'I'], ['stationary state II (lower)', 'II']], value: 's1' },
        { id: 'speed', label: 'Slow motion', min: 1, max: 50, value: 8, log: true, sig: 2, unit: 'ps per s' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], id => { if (id !== 'speed') { t = 0; hist = []; } if (id === 'Ef') updatePlot(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['me', 'μℰ'], ['split', 'Splitting 2√(A² + μ²ℰ²)'], ['comp', 'Stationary states: chance of N up (I, II)'], ['swing', 'Swing from "N up": period, largest change'], ['now', 'Now: N up, N down']]);
      const plot = kit.plot(gb, { x: { label: 'electric field ℰ (kV/cm)', min: 0, max: 60 }, y: { label: 'energy − E₀ (µeV)' }, legend: true }, 170);
      let t = 0, hist = [];
      function updatePlot() {
        const up = [], dn = [], l1 = [], l2 = [];
        for (let e = 0; e <= 60; e += 1) { const m = muE_ueV(e), w = Math.sqrt(NH3_A * NH3_A + m * m); up.push([e, w]); dn.push([e, -w]); l1.push([e, m]); l2.push([e, -m]); }
        const m = muE_ueV(V.Ef), w = Math.sqrt(NH3_A * NH3_A + m * m);
        plot.set({ series: [{ pts: up, label: 'state I (upper)', width: 2.2 }, { pts: dn, label: 'state II (lower)', width: 2.2 }, { pts: l1, label: '±μℰ (no tunnelling)', dash: [5, 4], width: 1.2 }, { pts: l2, dash: [5, 4], width: 1.2 }],
          marks: [{ x: V.Ef, y: w, label: 'I' }, { x: V.Ef, y: -w, label: 'II' }], vlines: [{ x: V.Ef, label: 'now' }] });
      }
      updatePlot();
      const loop = kit.loop(dt => {
        t += dt * V.speed;
        const m = muE_ueV(V.Ef), H = [[m, -NH3_A], [-NH3_A, -m]], e = eig2(2 * m, NH3_A);
        const init = V.start === 's1' ? [1, 0] : V.start === 'I' ? e.hi : e.lo;
        const [C1, C2] = Q.evolve2(H, init, t, HBAR_UEV_PS), P1 = Q.abs2(C1), P2 = Q.abs2(C2);
        hist.push([t, P1]); if (hist.length > 400) hist.shift();
        const w = e.w, per = 4.135667696e3 / (2 * w);                  // ps, from h = 4135.667696 µeV·ps
        ro.set('me', m.toFixed(1) + ' µeV (A = ' + NH3_A.toFixed(1) + ' µeV)');
        ro.set('split', (2 * w).toFixed(1) + ' µeV = ' + (2 * w / 4.135667696).toFixed(2) + ' GHz');
        ro.set('comp', pc(e.hi[0] * e.hi[0], 0) + ', ' + pc(e.lo[0] * e.lo[0], 0));
        ro.set('swing', per.toFixed(1) + ' ps, ' + pc(NH3_A * NH3_A / (w * w), 0));
        ro.set('now', P1.toFixed(3) + ', ' + P2.toFixed(3));

        const c = st.begin(), C = kit.colors(), v = fit(st, W0, H0);
        c.save(); c.translate(v.ox, v.oy); c.scale(v.s, v.s);
        // the field
        const fx = 40, fl = Math.min(110, 2 * V.Ef);
        if (V.Ef > 0) { arrowTo(c, fx, 230, fx, 230 - 20 - fl, C.hue(48), 3); txt(c, 'ℰ', fx + 14, 230 - 24 - fl / 2, C.hue(48), 14, 'left', 700); }
        c.strokeStyle = C.hue(48, 0.5); c.lineWidth = 3; c.beginPath(); c.moveTo(20, 40); c.lineTo(290, 40); c.moveTo(20, 280); c.lineTo(290, 280); c.stroke();
        txt(c, '+', 300, 40, C.muted, 14); txt(c, '−', 300, 280, C.muted, 14);
        drawNH3(c, 160, 160, 1.2, P1, C);
        txt(c, 'state 1: N up', 160, 60, C.hue(22), 12, 'center', 600); txt(c, 'state 2: N down', 160, 262, C.hue(212), 12, 'center', 600);
        // the amplitudes
        const circ = (x, y, z, P, col, name) => {
          const r = 42;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
          arrowTo(c, x, y, x + r * z.re, y - r * z.im, col, 2.8);
          c.strokeStyle = C.faint; c.strokeRect(x + r + 14, y - r, 12, 2 * r);
          c.fillStyle = col; c.fillRect(x + r + 14, y + r - 2 * r * P, 12, 2 * r * P);
          txt(c, name, x, y - r - 12, col, 12, 'center', 700);
        };
        circ(380, 90, C1, P1, C.hue(22), 'C₁  N up');
        circ(380, 230, C2, P2, C.hue(212), 'C₂  N down');
        // the recent history of P(N up)
        const gx = 490, gy = 50, gw = 270, gh = 200, tw = Math.max(20, Math.min(400, 3 * per));
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        c.strokeStyle = C.hue(22); c.lineWidth = 2; c.beginPath();
        let first = true;
        for (const [tt, p] of hist) { if (tt < t - tw) continue; const x = gx + gw * (1 - (t - tt) / tw), y = gy + gh * (1 - p); if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y); }
        c.stroke();
        txt(c, 'chance that N is up, last ' + tw.toFixed(0) + ' ps', gx + gw / 2, gy - 12, C.muted, 11);
        txt(c, '1', gx - 8, gy, C.muted, 10, 'right'); txt(c, '0', gx - 8, gy + gh, C.muted, 10, 'right');
        txt(c, 't = ' + t.toFixed(1) + ' ps', gx + gw, gy + gh + 16, C.muted, 11, 'right');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ spin-maser */
  Hyper.sim('spin-maser', {
    title: 'The ammonia maser',
    blurb: `A beam of ammonia molecules leaves the nozzle, half in the upper state I (orange) and half in the lower state II (blue). In the separator the electric field is zero on the axis and grows outwards: upper-state molecules are pushed towards weak field — onto the axis — and lower-state ones away from it, into the electrodes. The sorted beam enters a cavity resonant at 23.87 GHz, whose field makes each upper molecule drop to the lower state with probability sin²(μℰ₀T/ħ) (drawn as its colour changing), handing a photon to the field. Lower-state molecules that get in absorb instead. The graph is the resonance: the chance of a drop against how far the cavity is tuned from the line. Motion is enormously slowed; the cavity is 12 cm long.

**Try this**
- Turn the separator off: equal numbers of both states reach the cavity, absorption cancels emission, and the net output is about zero.
- With the separator on, find the cavity field ℰ₀ that makes every upper molecule drop (about 0.17 V/m at 600 m/s). Double it: the molecules drop and climb back — fewer photons.
- Slow the molecules down: they spend longer in the cavity, a weaker field suffices, and the resonance on the graph gets narrower — about 1/T wide.
- Detune the cavity by 5 kHz or more: the drops stop. That sharpness is why the maser is a clock.`,
    mount(box, kit) {
      const R = kit.qm.rng(1954), W0 = 780, H0 = 300, MID = 150;
      const NOZ = 30, S0 = 90, S1 = 330, CAV0 = 410, CAV1 = 640, END = 775, AP = 26, ELEC = 42, LCAV = 0.12;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'sep', label: 'Separator voltage (relative)', min: 0, max: 1, step: 0.01, value: 0.8 },
        { id: 'E0', label: 'Cavity field ℰ₀', min: 0, max: 0.5, step: 0.005, value: 0.17, unit: 'V/m' },
        { id: 'v', label: 'Molecule speed', min: 200, max: 900, step: 10, value: 600, unit: 'm/s' },
        { id: 'det', label: 'Cavity tuned off the line by', min: -20, max: 20, step: 0.5, value: 0, unit: 'kHz' },
        { id: 'rate', label: 'Molecules drawn per second', min: 5, max: 80, step: 1, value: 30 },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the counts', primary: true }] }
      ], id => { if (id === 'clear') { emitted = 0; absorbed = 0; inI = 0; inII = 0; } else if (id !== 'rate') { emitted = 0; absorbed = 0; inI = 0; inII = 0; updatePlot(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Time in the cavity T = 12 cm / v'], ['ang', 'Turning angle μℰ₀T/ħ'], ['P', 'Chance an upper molecule drops'], ['in', 'Entered the cavity: upper / lower'], ['net', 'Photons: emitted − absorbed']]);
      const plot = kit.plot(gb, { x: { label: 'cavity tuned off 23.870 GHz by (kHz)', min: -20, max: 20 }, y: { label: 'chance of a drop', min: 0, max: 1 } }, 160);
      // Rabi's formula for the drop probability after time T, detuned by df (Hz)
      const dropP = (E0, T, df) => { const W = 2 * NH3_MU * E0 / (HP / TAU), d = TAU * df, We = Math.sqrt(W * W + d * d); return We > 0 ? W * W / (We * We) * Math.pow(Math.sin(We * T / 2), 2) : 0; };
      function updatePlot() {
        const T = LCAV / V.v, pts = [];
        for (let f = -20; f <= 20.001; f += 0.25) pts.push([f, dropP(V.E0, T, f * 1e3)]);
        plot.set({ series: [{ pts, label: 'drop probability', width: 2.2 }], marks: [{ x: V.det, y: dropP(V.E0, T, V.det * 1e3), label: 'now' }] });
      }
      updatePlot();
      let mols = [], photons = [], flashes = [], acc = 0, emitted = 0, absorbed = 0, inI = 0, inII = 0, tt = 0;
      const loop = kit.loop(dt => {
        tt += dt;
        const pxs = V.v * 0.35, T = LCAV / V.v, P = dropP(V.E0, T, V.det * 1e3);
        const K = Math.pow(2.4 * V.sep, 2);      // focusing strength of the separator as drawn (schematic), 1/s²
        acc += dt * V.rate;
        let k = 0; while (acc >= 1 && k < 20) { mols.push({ x: NOZ, y: MID + (R() - 0.5) * 16, vy: (R() - 0.5) * 30, up: R() < 0.5, cav: false, out: false, p: 0 }); acc -= 1; k++; }
        if (acc > 3) acc = 0;
        const keep = [], n = Math.max(1, Math.ceil(dt / 0.01)), h = dt / n;
        for (const m of mols) {
          let gone = false;
          for (let s = 0; s < n && !gone; s++) {
            const inSep = m.x > S0 && m.x < S1, dy = m.y - MID;
            if (inSep) m.vy += (m.up ? -K : K) * dy * h;           // upper state pushed towards the axis, lower outwards
            m.x += pxs * h; m.y += m.vy * h;
            if (inSep && Math.abs(m.y - MID) > ELEC) { flashes.push({ x: m.x, y: m.y, t: 0 }); gone = true; }
            if (!gone && !m.cav && m.x >= CAV0) {
              if (Math.abs(m.y - MID) > AP) { flashes.push({ x: CAV0, y: m.y, t: 0 }); gone = true; }
              else { m.cav = true; if (m.up) inI++; else inII++; m.drop = R() < P; }
            }
            if (!gone && m.cav && !m.out && m.x >= CAV1) {
              m.out = true;
              if (m.drop) {
                if (m.up) { emitted++; photons.push({ x: CAV0 + (CAV1 - CAV0) * (0.3 + 0.4 * R()), y: MID - 50, t: 0 }); }
                else absorbed++;
                m.up = !m.up;
              }
            }
            if (m.x > END) gone = true;
          }
          if (!gone) keep.push(m);
        }
        mols = keep;
        for (const p of photons) p.t += dt; photons = photons.filter(p => p.t < 1.2);
        for (const f of flashes) f.t += dt; flashes = flashes.filter(f => f.t < 0.4);
        const W = 2 * NH3_MU * V.E0 / (HP / TAU);
        ro.set('T', (T * 1e3).toFixed(3) + ' ms');
        ro.set('ang', (W * T / 2).toFixed(2) + ' rad' + (Math.abs(W * T / 2 - Math.PI / 2) < 0.08 ? ' ≈ π/2: every molecule drops' : ''));
        ro.set('P', pc(P));
        ro.set('in', inI + ' / ' + inII);
        ro.set('net', emitted + ' − ' + absorbed + ' = ' + (emitted - absorbed));

        const c = st.begin(), C = kit.colors(), v = fit(st, W0, H0);
        c.save(); c.translate(v.ox, v.oy); c.scale(v.s, v.s);
        const cI = C.hue(22), cII = C.hue(212);
        // nozzle, separator electrodes (the field grows away from the axis), cavity
        c.fillStyle = C.muted; c.beginPath(); c.moveTo(4, MID - 22); c.lineTo(NOZ, MID - 5); c.lineTo(NOZ, MID + 5); c.lineTo(4, MID + 22); c.closePath(); c.fill();
        txt(c, 'NH₃ in', 16, MID + 36, C.muted, 11);
        for (const sgn2 of [-1, 1]) {
          c.fillStyle = V.sep > 0 ? C.hue(48, 0.25 + 0.5 * V.sep) : C.faint;
          rrect(c, S0, MID + sgn2 * ELEC + (sgn2 < 0 ? -12 : 0), S1 - S0, 12, 5); c.fill();
          for (let x = S0 + 14; x < S1; x += 26) { c.strokeStyle = C.hue(48, 0.25 * V.sep); c.lineWidth = 1; c.beginPath(); c.moveTo(x, MID + sgn2 * 8); c.lineTo(x, MID + sgn2 * (ELEC - 2)); c.stroke(); }
        }
        txt(c, 'state separator: field 0 on the axis, strong near the electrodes', (S0 + S1) / 2, MID - ELEC - 26, C.muted, 11);
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(CAV0, MID - AP); c.lineTo(CAV0, MID - 58); c.lineTo(CAV1, MID - 58); c.lineTo(CAV1, MID - AP); c.moveTo(CAV0, MID + AP); c.lineTo(CAV0, MID + 58); c.lineTo(CAV1, MID + 58); c.lineTo(CAV1, MID + AP); c.stroke();
        // the cavity's oscillating field (a standing wave, amplitude ∝ ℰ₀)
        const amp = Math.min(1, V.E0 / 0.3) * 40 * Math.sin(tt * 6);
        c.strokeStyle = C.hue(300, 0.5); c.lineWidth = 1.5; c.beginPath();
        for (let x = CAV0; x <= CAV1; x += 4) { const y = MID - amp * Math.sin(Math.PI * (x - CAV0) / (CAV1 - CAV0)); if (x === CAV0) c.moveTo(x, y); else c.lineTo(x, y); }
        c.stroke();
        txt(c, 'cavity at 23.87 GHz (12 cm)', (CAV0 + CAV1) / 2, MID + 74, C.muted, 11);
        // output guide
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(505, MID - 58); c.lineTo(505, 8); c.moveTo(545, MID - 58); c.lineTo(545, 8); c.stroke();
        txt(c, 'microwaves out', 560, 16, C.muted, 11, 'left');
        for (const p of photons) {
          const y = MID - 60 - 120 * p.t, a = 1 - p.t / 1.2;
          c.strokeStyle = 'hsl(300 80% 65% / ' + a + ')'; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 20; i++) { const yy = y - i, xx = 525 + 5 * Math.sin(i * 0.9); if (i) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
          c.stroke();
        }
        // molecules: in the cavity an upper molecule is a mixture, drawn by its chance of having dropped so far
        for (const m of mols) {
          let pDrop = 0;
          if (m.cav && !m.out) { const tin = (m.x - CAV0) / (CAV1 - CAV0) * T; pDrop = dropP(V.E0, tin, V.det * 1e3); }
          const a = m.up ? cI : cII, b = m.up ? cII : cI;
          c.globalAlpha = 1 - pDrop; c.fillStyle = a; c.beginPath(); c.arc(m.x, m.y, 3.6, 0, TAU); c.fill();
          if (pDrop > 0.01) { c.globalAlpha = pDrop; c.fillStyle = b; c.beginPath(); c.arc(m.x, m.y, 3.6, 0, TAU); c.fill(); }
          c.globalAlpha = 1;
        }
        for (const f of flashes) { const a = 1 - f.t / 0.4; c.fillStyle = 'hsl(0 70% 55% / ' + (0.5 * a) + ')'; c.beginPath(); c.arc(f.x, f.y, 3 + 5 * (1 - a), 0, TAU); c.fill(); }
        txt(c, '● upper state I', 20, H0 - 14, cI, 11.5, 'left', 600); txt(c, '● lower state II', 140, H0 - 14, cII, 11.5, 'left', 600);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ spin-h2plus */
  const HARTREE = 27.211386, A0 = 0.529177;       // eV, Å
  // the two-state (LCAO) energies of H₂⁺ relative to a hydrogen atom and a bare proton far apart, in eV, at separation D (Å):
  // base states = hydrogen 1s orbitals on each proton; overlap S, and the integrals J, K in hartree units
  function h2plus(D) {
    const R = D / A0, eR = Math.exp(-R);
    const S = eR * (1 + R + R * R / 3), J = -(1 - (1 + R) * Math.exp(-2 * R)) / R, K = -(1 + R) * eR;
    return { S, bond: (1 / R + (J + K) / (1 + S)) * HARTREE, anti: (1 / R + (J - K) / (1 - S)) * HARTREE };
  }

  Hyper.sim('spin-h2plus', {
    title: 'The hydrogen molecular ion: a bond from one electron',
    blurb: `Two protons share one electron. The base states are "the electron in its ground state around proton 1" and "around proton 2". The stationary states are their sum (bonding: the two clouds add between the protons) and their difference (antibonding: they cancel on the midplane, orange and blue showing the two signs of the amplitude). The graph shows both energies — including the protons' repulsion — against the separation, measured from a hydrogen atom and a proton far apart. The energies are the simplest two-state estimate; the exact bond (1.06 Å, 2.79 eV) is marked for comparison.

**Try this**
- Slide the separation: the bonding curve has a minimum near 1.3 Å — a bond. The antibonding curve only falls with distance: that state flies apart.
- Pull the protons far apart: the two energies meet — the coupling A dies away roughly as [[?exponential|e^{−D/a₀}]].
- Choose *electron placed on proton 1*: the cloud hops to proton 2 and back. Close together it takes a fraction of a femtosecond; at 4 Å, about fifteen femtoseconds.
- Compare the clouds: in the antibonding state there is a node — zero probability — on the plane halfway between the protons.`,
    mount(box, kit) {
      const W0 = 780, H0 = 300, HX0 = 16, HY0 = 16, HW = 500, HH = 272, PXA = 60, GW = 125, GH = 68;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Separation of the protons D', min: 0.4, max: 5, step: 0.01, value: 1.32, unit: 'Å' },
        { id: 'mode', type: 'select', label: 'Show', options: [['bonding state (the sum)', 'bond'], ['antibonding state (the difference)', 'anti'], ['electron placed on proton 1 (hops)', 'hop']], value: 'bond' },
        { id: 'speed', label: 'Slow motion', min: 0.01, max: 5, value: 0.05, log: true, sig: 2, unit: 'fs per s' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Put the electron on proton 1 again', primary: true }] }
      ], id => { if (id === 'D') { build(); updatePlot(); } if (id !== 'speed') t = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['bond', 'Bonding energy (vs H + p far apart)'], ['anti', 'Antibonding energy'], ['split', 'Splitting 2A'], ['hop', 'Hop time h/4A'], ['p1', 'Now: near proton 1, near proton 2']]);
      const plot = kit.plot(gb, { x: { label: 'separation D (Å)', min: 0.4, max: 5 }, y: { label: 'energy (eV)', min: -3.5, max: 6 }, legend: true }, 170);
      const off = document.createElement('canvas'); off.width = GW; off.height = GH;
      const octx = off.getContext('2d'), img = octx.createImageData(GW, GH);
      const fa = new Float64Array(GW * GH), fb = new Float64Array(GW * GH), phi0 = 1 / Math.sqrt(Math.PI * A0 * A0 * A0);
      let E = h2plus(V.D), t = 0;
      function build() {
        E = h2plus(V.D);
        for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
          const x = ((i + 0.5) / GW - 0.5) * HW / PXA, y = ((j + 0.5) / GH - 0.5) * HH / PXA;
          fa[j * GW + i] = phi0 * Math.exp(-Math.hypot(x + V.D / 2, y) / A0);
          fb[j * GW + i] = phi0 * Math.exp(-Math.hypot(x - V.D / 2, y) / A0);
        }
      }
      function updatePlot() {
        const b = [], a = [];
        for (let d = 0.4; d <= 5.001; d += 0.04) { const e = h2plus(d); b.push([d, e.bond]); a.push([d, Math.min(7, e.anti)]); }
        const e = h2plus(V.D);
        plot.set({ series: [{ pts: b, label: 'bonding (sum)', width: 2.2 }, { pts: a, label: 'antibonding (difference)', width: 2.2 }, { pts: [[0.4, 0], [5, 0]], label: 'H + p⁺ far apart', dash: [5, 4], width: 1 }],
          marks: [{ x: V.D, y: e.bond, label: 'now' }, { x: V.D, y: Math.min(7, e.anti) }, { x: 1.06, y: -2.79, label: 'exact bond' }], vlines: [{ x: V.D }] });
      }
      build(); updatePlot();
      const loop = kit.loop(dt => {
        t += dt * V.speed;
        const dE = E.anti - E.bond, ph = dE > 0 ? (dE / 2) * t * 1e-15 / HBAR_EVS : 0, ca = Math.cos(ph), sa = Math.sin(ph);
        const c2 = ca * ca, s2 = sa * sa, nb = 1 / Math.sqrt(2 * (1 + E.S)), na = 1 / Math.sqrt(Math.max(1e-9, 2 * (1 - E.S))), ref = phi0 * phi0;
        const d = img.data;
        for (let k = 0; k < GW * GH; k++) {
          let rho, r, g, b;
          if (V.mode === 'hop') { rho = fa[k] * fa[k] * c2 + fb[k] * fb[k] * s2; r = 170; g = 90; b = 255; }
          else { const psi = V.mode === 'bond' ? (fa[k] + fb[k]) * nb : (fa[k] - fb[k]) * na; rho = psi * psi; if (psi >= 0) { r = 255; g = 140; b = 40; } else { r = 60; g = 130; b = 255; } }
          d[4 * k] = r; d[4 * k + 1] = g; d[4 * k + 2] = b; d[4 * k + 3] = Math.round(255 * Math.min(1, 1.15 * Math.sqrt(rho / ref)));
        }
        octx.putImageData(img, 0, 0);
        ro.set('bond', E.bond.toFixed(2) + ' eV');
        ro.set('anti', E.anti.toFixed(2) + ' eV');
        ro.set('split', dE.toFixed(2) + ' eV');
        ro.set('hop', dE > 0 ? (H_EVS / (2 * dE) * 1e15).toFixed(3) + ' fs' : '—');
        ro.set('p1', V.mode === 'hop' ? pc(c2, 0) + ', ' + pc(s2, 0) : '50 %, 50 % (stationary)');

        const c = st.begin(), C = kit.colors(), v = fit(st, W0, H0);
        c.save(); c.translate(v.ox, v.oy); c.scale(v.s, v.s);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(HX0, HY0, HW, HH);
        c.imageSmoothingEnabled = true; c.drawImage(off, HX0, HY0, HW, HH);
        const cx = HX0 + HW / 2, cy = HY0 + HH / 2;
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx, HY0 + 6); c.lineTo(cx, HY0 + HH - 6); c.stroke(); c.setLineDash([]);
        for (const sx of [-1, 1]) { const px = cx + sx * V.D / 2 * PXA; c.fillStyle = '#d33'; c.beginPath(); c.arc(px, cy, 6, 0, TAU); c.fill(); txt(c, '+', px, cy, '#fff', 11, 'center', 700); txt(c, sx < 0 ? 'proton 1' : 'proton 2', px, cy + 20, C.text, 11); }
        // a scale bar of one ångström
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(HX0 + 16, HY0 + HH - 14); c.lineTo(HX0 + 16 + PXA, HY0 + HH - 14); c.stroke();
        txt(c, '1 Å', HX0 + 16 + PXA / 2, HY0 + HH - 26, C.text, 11);
        txt(c, V.mode === 'bond' ? 'bonding: φ₁ + φ₂' : V.mode === 'anti' ? 'antibonding: φ₁ − φ₂ (orange +, blue −)' : 'electron started on proton 1', HX0 + 10, HY0 + 14, C.text, 12, 'left', 600);
        // the levels at this separation
        const lx = 560, lw = 90, yOf = e => 150 - 22 * Math.max(-5, Math.min(6, e));
        c.strokeStyle = C.faint; c.setLineDash([5, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(lx, yOf(0)); c.lineTo(lx + lw, yOf(0)); c.stroke(); c.setLineDash([]);
        txt(c, 'H + p⁺ apart', lx + lw + 6, yOf(0), C.muted, 10.5, 'left');
        c.strokeStyle = 'rgb(255 140 40)'; c.lineWidth = 3; c.beginPath(); c.moveTo(lx, yOf(E.bond)); c.lineTo(lx + lw, yOf(E.bond)); c.stroke();
        c.strokeStyle = 'rgb(60 130 255)'; c.beginPath(); c.moveTo(lx, yOf(E.anti)); c.lineTo(lx + lw, yOf(E.anti)); c.stroke();
        txt(c, 'bonding ' + E.bond.toFixed(2) + ' eV', lx + lw / 2, yOf(E.bond) + 13, C.text, 11);
        txt(c, 'antibonding ' + (E.anti > 6 ? '> 6' : E.anti.toFixed(2)) + ' eV', lx + lw / 2, yOf(E.anti) - 12, C.text, 11);
        txt(c, 'D = ' + V.D.toFixed(2) + ' Å', lx + lw / 2, 22, C.text, 13, 'center', 700);
        if (V.mode === 'hop') txt(c, 't = ' + t.toFixed(3) + ' fs', lx + lw / 2, 282, C.muted, 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ spin-benzene */
  // wavelength (nm) to an sRGB triple, 380–780 nm (a common piecewise approximation); null outside
  function waveRGB(l) {
    let r = 0, g = 0, b = 0;
    if (l < 380 || l > 780) return null;
    if (l < 440) { r = (440 - l) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = (510 - l) / 20; }
    else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = (645 - l) / 65; } else r = 1;
    return [Math.round(255 * r), Math.round(255 * g), Math.round(255 * b)];
  }
  function hueOf(rgb) {
    const [r, g, b] = rgb.map(x => x / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (d === 0) return 0;
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60; return h < 0 ? h + 360 : h;
  }

  Hyper.sim('spin-benzene', {
    title: 'Two equivalent structures: benzene and a dye',
    blurb: `A molecule that can be drawn in two equivalent ways is a two-state system. **Benzene**: the two Kekulé structures, with the double bonds in alternate places. **A dye**: a chain whose positive charge can sit on the nitrogen at either end. The second line of each double bond is drawn as strongly as the probability of that structure; the circles show the two [[?amplitude|amplitudes]], and the levels on the right show E₀ ∓ A.

**Try this**
- Start in structure 1: the double bonds flicker from one set of places to the other and back, at 2A/h — about once every 1.3 fs for A = 1.6 eV.
- Start in *the sum*: every bond is half double, all the time — benzene's six equal bonds. This stationary state lies A below either structure: the resonance energy.
- Switch to the dye and change A: light of energy 2A flips it between the sum and the difference. The swatch shows the colour it absorbs, and the colour it looks.
- Make A small: the absorption moves into the infrared; large, into the ultraviolet — a colourless molecule.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 780, H0 = 300;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 230 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Molecule', options: [['benzene: two Kekulé structures', 'benz'], ['a dye: the charge at either end', 'dye']], value: 'benz' },
        { id: 'A', label: 'Coupling A', min: 0.5, max: 2.5, step: 0.01, value: 1.6, unit: 'eV' },
        { id: 'start', type: 'select', label: 'Start in', options: [['structure 1', 's1'], ['the sum (lower stationary state)', 'sum'], ['the difference (upper stationary state)', 'diff']], value: 's1' },
        { id: 'speed', label: 'Slow motion', min: 0.05, max: 2, value: 0.3, log: true, sig: 2, unit: 'fs per s' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], id => { if (id !== 'speed' && id !== 'A') t = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['split', 'Splitting 2A'], ['per', 'Flip-flop period h/2A'], ['extra', 'Resonance energy / light absorbed'], ['now', 'Now: structure 1, structure 2']]);
      let t = 0;
      const loop = kit.loop(dt => {
        t += dt * V.speed;
        const A = V.A, init = V.start === 's1' ? [1, 0] : V.start === 'sum' ? [Math.SQRT1_2, Math.SQRT1_2] : [Math.SQRT1_2, -Math.SQRT1_2];
        const [C1, C2] = Q.evolve2([[0, -A], [-A, 0]], init, t * 1e-15, HBAR_EVS), P1 = Q.abs2(C1), P2 = Q.abs2(C2);
        const lam = 1239.84 / (2 * A), rgb = waveRGB(lam);
        ro.set('split', (2 * A).toFixed(2) + ' eV');
        ro.set('per', (H_EVS / (2 * A) * 1e15).toFixed(2) + ' fs');
        ro.set('extra', V.mode === 'benz' ? 'A = ' + A.toFixed(2) + ' eV = ' + (A * 96.485).toFixed(0) + ' kJ/mol' : 'hc/2A = ' + lam.toFixed(0) + ' nm' + (rgb ? '' : lam < 380 ? ' (ultraviolet)' : ' (infrared)'));
        ro.set('now', P1.toFixed(3) + ', ' + P2.toFixed(3));

        const c = st.begin(), C = kit.colors(), v = fit(st, W0, H0);
        c.save(); c.translate(v.ox, v.oy); c.scale(v.s, v.s);
        const col1 = C.hue(22), col2 = C.hue(212);
        const bond = (x1, y1, x2, y2, p, col, cxr, cyr) => {
          c.strokeStyle = C.text; c.lineWidth = 2.6; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
          // the second line of a double bond, towards (cxr, cyr), as strong as the probability of the structure that has it
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = cxr - mx, dy = cyr - my, dl = Math.hypot(dx, dy) || 1, ox = 8 * dx / dl, oy = 8 * dy / dl;
          c.globalAlpha = Math.max(0, Math.min(1, p)); c.strokeStyle = col; c.lineWidth = 3;
          c.beginPath(); c.moveTo(x1 + 0.2 * (x2 - x1) + ox, y1 + 0.2 * (y2 - y1) + oy); c.lineTo(x1 + 0.8 * (x2 - x1) + ox, y1 + 0.8 * (y2 - y1) + oy); c.stroke();
          c.globalAlpha = 1;
        };
        const atom = (x, y, s, fill, lab) => { c.fillStyle = fill; c.beginPath(); c.arc(x, y, 12, 0, TAU); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1; c.stroke(); txt(c, s, x, y, lab || '#fff', 11, 'center', 700); };
        if (V.mode === 'benz') {
          const cx = 175, cy = 150, r = 78, P = [];
          for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + k * Math.PI / 3; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
          for (let k = 0; k < 6; k++) { const [x, y] = P[k], hx = cx + (r + 38) * (x - cx) / r, hy = cy + (r + 38) * (y - cy) / r; c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(hx, hy); c.stroke(); atom(hx, hy, 'H', '#e9ecf2', '#333'); }
          for (let k = 0; k < 6; k++) { const a = P[k], b = P[(k + 1) % 6]; bond(a[0], a[1], b[0], b[1], k % 2 === 0 ? P1 : P2, k % 2 === 0 ? col1 : col2, cx, cy); }
          for (const [x, y] of P) atom(x, y, 'C', '#555');
          txt(c, 'C₆H₆', cx, cy, C.muted, 13, 'center', 600);
        } else {
          const xs = [50, 95, 140, 185, 230, 275, 320], ys = xs.map((_, i) => i % 2 ? 170 : 130);
          for (let k = 0; k < 6; k++) bond(xs[k], ys[k], xs[k + 1], ys[k + 1], k % 2 === 0 ? P1 : P2, k % 2 === 0 ? col1 : col2, (xs[k] + xs[k + 1]) / 2, k % 2 === 0 ? 250 : 50);
          for (let i = 0; i < 7; i++) atom(xs[i], ys[i], i === 0 || i === 6 ? 'N' : 'C', i === 0 || i === 6 ? '#3a5cf0' : '#555');
          txt(c, 'R₂', 22, 112, C.muted, 12); txt(c, 'R₂', 350, 112, C.muted, 12);
          c.globalAlpha = Math.max(0.05, P1); txt(c, '⊕', 50, 102, col1, 20, 'center', 700);
          c.globalAlpha = Math.max(0.05, P2); txt(c, '⊕', 320, 102, col2, 20, 'center', 700); c.globalAlpha = 1;
          txt(c, 'a two-ended dye (schematic): the charge sits on one nitrogen or the other', 185, 250, C.muted, 11);
          // colour swatches
          const sw = (x, lab, fill) => { c.fillStyle = fill; rrect(c, x, 262, 70, 24, 5); c.fill(); c.strokeStyle = C.faint; c.stroke(); txt(c, lab, x + 35, 294, C.muted, 10.5); };
          if (rgb) { sw(90, 'absorbs', 'rgb(' + rgb.join(',') + ')'); sw(200, 'looks', 'hsl(' + ((hueOf(rgb) + 180) % 360) + ' 70% 55%)'); }
          else { txt(c, lam < 380 ? 'absorbs in the ultraviolet: colourless' : 'absorbs in the infrared: nearly colourless', 185, 275, C.text, 12); }
        }
        // the two amplitudes
        const circ = (x, y, z, P, col, name) => {
          const rr = 34;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(x, y, rr, 0, TAU); c.stroke();
          arrowTo(c, x, y, x + rr * z.re, y - rr * z.im, col, 2.6);
          c.strokeStyle = C.faint; c.strokeRect(x + rr + 10, y - rr, 10, 2 * rr); c.fillStyle = col; c.fillRect(x + rr + 10, y + rr - 2 * rr * P, 10, 2 * rr * P);
          txt(c, name, x, y - rr - 12, col, 11.5, 'center', 700);
        };
        circ(450, 85, C1, P1, col1, 'structure 1'); circ(450, 215, C2, P2, col2, 'structure 2');
        // levels
        const lx = 570, lw = 70, yOf = e => 150 - 38 * e;
        c.strokeStyle = C.faint; c.setLineDash([5, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(lx, yOf(0)); c.lineTo(lx + lw, yOf(0)); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(lx, yOf(-A)); c.lineTo(lx + lw, yOf(-A)); c.moveTo(lx, yOf(A)); c.lineTo(lx + lw, yOf(A)); c.stroke();
        txt(c, 'E₀ (one structure)', lx + lw + 6, yOf(0), C.muted, 10.5, 'left');
        txt(c, 'E₀ − A (sum)', lx + lw + 6, yOf(-A), C.text, 10.5, 'left'); txt(c, 'E₀ + A (difference)', lx + lw + 6, yOf(A), C.text, 10.5, 'left');
        arrowTo(c, lx + lw / 2, yOf(-A), lx + lw / 2, yOf(A), rgb && V.mode === 'dye' ? 'rgb(' + rgb.join(',') + ')' : C.accent, 2);
        txt(c, '2A', lx + lw / 2 - 8, yOf(0), C.text, 11, 'right', 700);
        txt(c, 't = ' + t.toFixed(2) + ' fs', W0 - 10, H0 - 10, C.muted, 11, 'right');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ spin-hyperfine */
  const HF_A = 1.468575;                                        // µeV: 4A = 5.8743 µeV = h × 1420.406 MHz
  const MU_E = 9.2847647e-24 * 1e-3 / QE * 1e6;                 // |μe| in µeV per mT
  const MU_P = 1.41060680e-26 * 1e-3 / QE * 1e6;                // μp in µeV per mT
  const H_UEV_MHZ = H_EVS * 1e6 * 1e6;                          // h in µeV per MHz (4.1357e-3)
  // the four stationary states of H = A σe·σp − μe σe·B − μp σp·B (electron moment opposite its spin), B in mT
  function hyperfine(B) {
    const b = (MU_E + MU_P) * B, W = Math.sqrt(4 * HF_A * HF_A + b * b), bd = (MU_E - MU_P) * B;
    const up = [2 * HF_A, W - b], lo = [2 * HF_A, -(W + b)], n1 = Math.hypot(up[0], up[1]), n2 = Math.hypot(lo[0], lo[1]);
    return [
      { name: 'I', E: HF_A + bd, mix: null, cfg: '++' },
      { name: 'II', E: HF_A - bd, mix: null, cfg: '−−' },
      { name: 'III', E: -HF_A + W, mix: [up[0] / n1, up[1] / n1] },
      { name: 'IV', E: -HF_A - W, mix: [lo[0] / n2, lo[1] / n2] }
    ];
  }

  Hyper.sim('spin-hyperfine', {
    title: 'Hydrogen\'s four spin states and the 21-cm line',
    blurb: `The electron (blue) and the proton (red) of a hydrogen atom each have spin one-half, up or down: four base states, ++, +−, −+, −− (electron first). With H = A σₑ·σₚ three stationary states share the energy A (the triplet) and one lies at −3A (the singlet); the jump between them is the 1420 MHz, 21-cm line. A magnetic field B adds each spin's magnetic energy. The pictures show what each stationary state is made of; the graph shows the four energies against the field.

**Try this**
- At B = 0: states I, II and III sit together at A (total spin 1); IV lies 4A = 5.87 µeV below. III and IV are the sum and the difference of +− and −+: a two-state system inside the four.
- Raise the field to 50 mT, then 150 mT: two levels move in straight lines, two curve. In a strong field the levels pair off by the electron's spin — the electron's magnet is 658 times the proton's.
- Watch the right-hand panel: an atom put in +− is not stationary. At B = 0 its spins swap, +− → −+ → +−, at 1420 MHz — the flip-flop of [[hamiltonian-matrix]] again. In a strong field the swap stalls.`,
    mount(box, kit) {
      const Q = kit.qm, W0 = 780, H0 = 320;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'B', label: 'Magnetic field B', min: 0, max: 150, step: 0.5, value: 0, unit: 'mT' },
        { id: 'speed', label: 'Slow motion (swap panel)', min: 0.02, max: 2, value: 0.2, log: true, sig: 2, unit: 'ns per s' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Put the atom in +− again', primary: true }] }
      ], id => { if (id === 'B') updatePlot(); if (id !== 'speed') { t = 0; hist = []; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Energies I, II, III, IV (µeV)'], ['line', 'III → IV line (21 cm at B = 0)'], ['x', 'Field strength x = (|μe| + μp)B/2A'], ['now', 'Swap panel now: P(+−), P(−+)']]);
      const plot = kit.plot(gb, { x: { label: 'magnetic field B (mT)', min: 0, max: 150 }, y: { label: 'energy (µeV)' }, legend: true }, 170);
      let t = 0, hist = [];
      function updatePlot() {
        const s = [[], [], [], []];
        for (let B = 0; B <= 150.001; B += 1.5) hyperfine(B).forEach((q, i) => s[i].push([B, q.E]));
        const now = hyperfine(V.B);
        plot.set({ series: s.map((pts, i) => ({ pts, label: ['I: ++', 'II: −−', 'III: +− and −+ (upper)', 'IV: +− and −+ (lower)'][i], width: 2 })), marks: now.map(q => ({ x: V.B, y: q.E, label: q.name })), vlines: [{ x: V.B }] });
      }
      updatePlot();
      const loop = kit.loop(dt => {
        t += dt * V.speed;
        const S = hyperfine(V.B);
        // the +−/−+ block, started in +−: [[−A + b', 2A], [2A, −A − b']] with b' = (|μe| + μp)B
        const bb = (MU_E + MU_P) * V.B, z = Q.evolve2([[-HF_A + bb, 2 * HF_A], [2 * HF_A, -HF_A - bb]], [1, 0], t, HBAR_EVS * 1e6 * 1e9);
        const Ppm = Q.abs2(z[0]), Pmp = Q.abs2(z[1]);
        hist.push([t, Ppm]); if (hist.length > 300) hist.shift();
        const fLine = (S[2].E - S[3].E) / H_UEV_MHZ;
        ro.set('E', S.map(q => q.E.toFixed(2)).join(', '));
        ro.set('line', fLine.toFixed(1) + ' MHz, λ = ' + (29979.2458 / fLine).toFixed(1) + ' cm');
        ro.set('x', ((MU_E + MU_P) * V.B / (2 * HF_A)).toFixed(2));
        ro.set('now', Ppm.toFixed(3) + ', ' + Pmp.toFixed(3));

        const c = st.begin(), C = kit.colors(), v = fit(st, W0, H0);
        c.save(); c.translate(v.ox, v.oy); c.scale(v.s, v.s);
        const cE = C.hue(212), cP = 'hsl(0 70% 55%)';
        // the levels at this field
        const rng = Math.max(6, ...S.map(q => Math.abs(q.E))) + 1, yOf = E => 165 - 125 * E / rng, lx = 30, lw = 90;
        for (const q of S) {
          c.strokeStyle = C.text; c.lineWidth = 2.6; c.beginPath(); c.moveTo(lx, yOf(q.E)); c.lineTo(lx + lw, yOf(q.E)); c.stroke();
        }
        // labels spread apart so they never overlap
        const order = S.map((q, i) => i).sort((a, b) => S[b].E - S[a].E); let lastY = -1e9;
        for (const i of order) { let y = yOf(S[i].E); if (y - lastY < 13) y = lastY + 13; lastY = y; txt(c, S[i].name + '  ' + S[i].E.toFixed(2), lx + lw + 6, y, C.text, 11, 'left'); }
        arrowTo(c, lx + lw * 0.3, yOf(S[2].E), lx + lw * 0.3, yOf(S[3].E), C.hue(300), 2);
        txt(c, fLine.toFixed(0) + ' MHz', lx + lw * 0.3 - 6, (yOf(S[2].E) + yOf(S[3].E)) / 2, C.hue(300), 11, 'right', 700);
        txt(c, 'energies (µeV) at B = ' + V.B.toFixed(1) + ' mT', lx + 70, 18, C.muted, 11);
        // what each state is made of: electron (blue) and proton (red) with their spins
        const pair = (x, y, cfg, alpha) => {
          c.globalAlpha = alpha;
          const se = cfg[0] === '+' ? -1 : 1, sp = cfg[1] === '+' ? -1 : 1;
          c.fillStyle = cE; c.beginPath(); c.arc(x, y, 7, 0, TAU); c.fill(); arrowTo(c, x, y - se * 13, x, y + se * 13, cE, 2.2, 6);
          c.fillStyle = cP; c.beginPath(); c.arc(x + 26, y, 7, 0, TAU); c.fill(); arrowTo(c, x + 26, y - sp * 13, x + 26, y + sp * 13, cP, 2.2, 6);
          c.globalAlpha = 1;
        };
        const px = 300;
        S.forEach((q, i) => {
          const y = 48 + i * 68;
          txt(c, q.name, px - 30, y, C.text, 13, 'center', 700);
          if (!q.mix) { pair(px, y, q.cfg === '++' ? '++' : '--', 1); txt(c, q.cfg, px + 58, y, C.text, 12, 'left'); }
          else {
            const a = q.mix[0], b = q.mix[1];
            pair(px, y, '+-', Math.max(0.12, a * a)); txt(c, (a >= 0 ? '' : '−') + Math.abs(a).toFixed(2) + ' (+−)', px + 50, y - 10, C.text, 11, 'left');
            pair(px + 130, y, '-+', Math.max(0.12, b * b)); txt(c, (b >= 0 ? '+ ' : '− ') + Math.abs(b).toFixed(2) + ' (−+)', px + 180, y - 10, C.text, 11, 'left');
          }
        });
        txt(c, 'electron ●', px + 10, H0 - 12, cE, 11, 'center', 600); txt(c, 'proton ●', px + 90, H0 - 12, cP, 11, 'center', 600);
        // the swap panel: an atom put in +− at t = 0
        const gx = 600, gy = 60, gw = 160, gh = 110;
        txt(c, 'started in +−', gx + gw / 2, 22, C.text, 12, 'center', 600);
        pair(gx + 20, 44, '+-', Math.max(0.1, Ppm)); pair(gx + 100, 44, '-+', Math.max(0.1, Pmp));
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(gx, gy + 20, gw, gh);
        const tw = Math.max(0.5, Math.min(20, 3000 * H_UEV_MHZ / Math.max(1e-6, S[2].E - S[3].E)));   // three swap periods, ns
        c.strokeStyle = C.hue(22); c.lineWidth = 2; c.beginPath(); let first = true;
        for (const [tt, p] of hist) { if (tt < t - tw) continue; const x = gx + gw * (1 - (t - tt) / tw), y = gy + 20 + gh * (1 - p); if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y); }
        c.stroke();
        txt(c, 'P(+−) over the last ' + tw.toFixed(1) + ' ns', gx + gw / 2, gy + gh + 34, C.muted, 10.5);
        txt(c, 't = ' + t.toFixed(2) + ' ns', gx + gw, gy + gh + 52, C.muted, 10.5, 'right');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ spin-galaxy */
  Hyper.sim('spin-galaxy', {
    title: 'Mapping the galaxy with the 21-cm line',
    blurb: `A model Milky Way seen from the north: hydrogen clouds along four spiral arms, all circling the centre clockwise at 220 km/s (a flat rotation curve), with the Sun 8.2 kpc from the centre. Longitude l is measured from the direction of the centre, towards the direction the Sun is moving. Point the radio telescope along a galactic longitude l: every cloud in the beam sends the 1420.406 MHz line, shifted by its speed along the line of sight ([[physics:doppler-effect|Doppler]]; 4.74 kHz per km/s). The graph is the spectrum: a peak for each arm crossed. Assuming the rotation curve, each peak's velocity gives a distance — and the right-hand map fills in.

**Try this**
- Look along l = 30°: several peaks. The highest velocity comes from the tangent point, where the line of sight passes closest to the centre: V₀(1 − sin l) = 110 km/s.
- Press *Scan the whole sky* and compare the map built from the line with the true clouds. Inside the Sun's orbit each velocity fits two distances (hollow dots) — the near–far ambiguity that astronomers had to break by other means.
- Look towards the centre (l = 0°) or away from it (l = 180°): all the gas moves across the line of sight, every peak sits at 0 km/s, and no distance can be found.
- In the second and third quadrants (90° < l < 270°) the velocities change sign: gas outside the Sun's orbit.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1951), W0 = 780, H0 = 330;
      const V0 = 220, R0 = 8.2, KMS_KHZ = 1420405.751768 / 299792.458;   // kHz of shift per km/s
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'l', label: 'Galactic longitude l of the telescope', min: 0, max: 360, step: 1, value: 30, unit: '°' },
        { id: 'truth', type: 'check', label: 'Show the true clouds on the map', value: false },
        { type: 'buttons', items: [{ id: 'scan', label: 'Scan the whole sky', primary: true }, { id: 'clear', label: 'Clear the map' }] }
      ], id => { if (id === 'scan') { scanL = 0; } if (id === 'clear') { mapPts = []; scanL = null; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tan', 'Tangent-point velocity V₀(1 − sin l)'], ['peaks', 'Peaks at (km/s)'], ['freq', 'Strongest peak observed at'], ['n', 'Points on the map']]);
      const plot = kit.plot(gb, { x: { label: 'line-of-sight velocity (km/s); frequency = 1420.406 MHz − 4.74 kHz × v', min: -150, max: 150 }, y: { label: '21-cm intensity (relative)', min: 0 } }, 170);
      // the hydrogen: clouds along four logarithmic spiral arms (pitch 12°), plus some between them; positions in kpc
      const clouds = [], b = Math.tan(12 * DEG);
      for (let k = 0; k < 4; k++) for (let i = 0; i < 90; i++) {
        const r = 3 + 12 * R(), th = Math.log(r / 3) / b + k * Math.PI / 2;
        clouds.push({ x: r * Math.cos(th) + 0.35 * Q.gauss(R), y: r * Math.sin(th) + 0.35 * Q.gauss(R), w: 0.5 + R() });
      }
      for (let i = 0; i < 70; i++) { const r = 2 + 13 * Math.sqrt(R()), th = TAU * R(); clouds.push({ x: r * Math.cos(th), y: r * Math.sin(th), w: 0.3 + 0.4 * R() }); }
      const sun = { x: 0, y: -R0 };
      // seen from the north: the disc turns clockwise, l = 0° points at the centre and l = 90° (to the left) is where the Sun
      // is heading; each cloud's line-of-sight velocity is its velocity minus the Sun's, along the direction from the Sun
      const vel = (x, y) => { const r = Math.hypot(x, y) || 1; return { x: V0 * y / r, y: -V0 * x / r }; };
      const vs = vel(sun.x, sun.y);
      for (const cl of clouds) {
        const dx = cl.x - sun.x, dy = cl.y - sun.y, d = Math.hypot(dx, dy) || 1e-6, vc = vel(cl.x, cl.y);
        cl.d = d; cl.lon = Math.atan2(-dx, dy); cl.vr = ((vc.x - vs.x) * dx + (vc.y - vs.y) * dy) / d;
      }
      const NV = 301, SIGV = 6, BEAM = 2 * DEG;
      function spectrum(lDeg) {
        const s = new Float64Array(NV), l = lDeg * DEG;
        for (const cl of clouds) {
          let da = cl.lon - l; da = Math.atan2(Math.sin(da), Math.cos(da));
          if (Math.abs(da) > 2.5 * BEAM) continue;
          const g = cl.w * Math.exp(-0.5 * Math.pow(da / BEAM, 2));
          const j0 = Math.max(0, Math.floor(cl.vr + 150 - 4 * SIGV)), j1 = Math.min(NV - 1, Math.ceil(cl.vr + 150 + 4 * SIGV));
          for (let j = j0; j <= j1; j++) s[j] += g * Math.exp(-0.5 * Math.pow((j - 150 - cl.vr) / SIGV, 2));
        }
        return s;
      }
      function peaks(s) {
        let mx = 0; for (const v of s) mx = Math.max(mx, v);
        const out = [];
        for (let j = 2; j < NV - 2; j++) if (s[j] > 0.2 * mx && s[j] >= s[j - 1] && s[j] >= s[j + 1] && s[j] >= s[j - 2] && s[j] >= s[j + 2]) { if (!out.length || j - 150 - out[out.length - 1].v > 8) out.push({ v: j - 150, a: s[j] }); }
        return out;
      }
      // distances along the line of sight that give velocity v in the flat-rotation model (none near l = 0° or 180°)
      function distances(lDeg, v) {
        const sl = Math.sin(lDeg * DEG), cl = Math.cos(lDeg * DEG);
        if (Math.abs(sl) < 0.17) return [];
        const den = 1 + v / (V0 * sl); if (den <= 0.05) return [];
        const Rg = R0 / den, disc = Rg * Rg - R0 * R0 * sl * sl;
        if (disc < 0) return [];
        const q = Math.sqrt(disc), ds = [R0 * cl + q, R0 * cl - q].filter(d => d > 0);
        return ds.map(d => ({ d, amb: ds.length > 1 }));
      }
      let mapPts = [], scanL = null, lastL = null, spec = null, pk = [];
      const addLine = lDeg => { const s = spectrum(lDeg); for (const p of peaks(s)) for (const r of distances(lDeg, p.v)) mapPts.push({ x: sun.x - r.d * Math.sin(lDeg * DEG), y: sun.y + r.d * Math.cos(lDeg * DEG), amb: r.amb }); };
      const loop = kit.loop(dt => {
        if (scanL != null) { for (let k = 0; k < 3 && scanL <= 359; k++) { addLine(scanL); scanL += 2; } if (scanL > 359) scanL = null; }
        if (lastL !== V.l) {
          lastL = V.l; spec = spectrum(V.l); pk = peaks(spec);
          plot.set({ series: [{ pts: Array.from(spec, (y, j) => [j - 150, y]), label: 'spectrum', width: 2, fill: true }], marks: pk.map(p => ({ x: p.v, y: p.a, label: (p.v > 0 ? '+' : '') + p.v })) });
        }
        const sl = Math.sin(V.l * DEG);
        ro.set('tan', V.l > 0 && V.l < 90 ? (V0 * (1 - sl)).toFixed(0) + ' km/s' : V.l > 270 && V.l < 360 ? (-V0 * (1 + sl)).toFixed(0) + ' km/s' : 'no tangent point (looking outwards)');
        ro.set('peaks', pk.length ? pk.map(p => (p.v > 0 ? '+' : '') + p.v).join(', ') : '—');
        const top = pk.length ? pk.reduce((a, p) => p.a > a.a ? p : a, pk[0]) : null;
        ro.set('freq', top ? (1420.405752 - top.v * KMS_KHZ / 1000).toFixed(4) + ' MHz (' + (top.v > 0 ? 'receding' : top.v < 0 ? 'approaching' : 'at rest') + ')' : '—');
        ro.set('n', String(mapPts.length));

        const c = st.begin(), C = kit.colors(), v = fit(st, W0, H0);
        c.save(); c.translate(v.ox, v.oy); c.scale(v.s, v.s);
        const S = 9.2, g1 = { x: 175, y: 172 }, g2 = { x: 590, y: 172 };
        const P = (g, x, y) => [g.x + S * x, g.y - S * y];
        const disc = (g, title) => {
          c.fillStyle = C.hue(230, 0.07); c.beginPath(); c.arc(g.x, g.y, 16 * S, 0, TAU); c.fill();
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.arc(g.x, g.y, R0 * S, 0, TAU); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.hue(48); c.beginPath(); c.arc(g.x, g.y, 5, 0, TAU); c.fill();
          const [sx, sy] = P(g, sun.x, sun.y); c.fillStyle = C.hue(40); c.beginPath(); c.arc(sx, sy, 5, 0, TAU); c.fill(); txt(c, 'Sun', sx + 9, sy + 8, C.text, 10.5, 'left');
          txt(c, title, g.x, 12, C.text, 12, 'center', 600);
        };
        disc(g1, 'the model galaxy (hydrogen clouds)');
        for (const cl of clouds) { const [x, y] = P(g1, cl.x, cl.y); c.fillStyle = C.hue(200, 0.25 + 0.4 * cl.w); c.beginPath(); c.arc(x, y, 1.6 + cl.w, 0, TAU); c.fill(); }
        // rotation arrows
        for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.3, r = 13 * S; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.arc(g1.x, g1.y, r, -a - 0.35, -a, false); c.stroke(); const ex = g1.x + r * Math.cos(-a), ey = g1.y + r * Math.sin(-a); arrowTo(c, ex + 6 * Math.sin(-a), ey - 6 * Math.cos(-a), ex, ey, C.muted, 1.5, 6); }
        // the beam
        const [sx, sy] = P(g1, sun.x, sun.y), L = 26 * S, lr = V.l * DEG;
        c.fillStyle = C.hue(300, 0.18); c.beginPath(); c.moveTo(sx, sy);
        c.lineTo(sx - L * Math.sin(lr - BEAM * 1.5), sy - L * Math.cos(lr - BEAM * 1.5)); c.lineTo(sx - L * Math.sin(lr + BEAM * 1.5), sy - L * Math.cos(lr + BEAM * 1.5)); c.closePath(); c.fill();
        c.strokeStyle = C.hue(300); c.lineWidth = 1.2; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx - L * Math.sin(lr), sy - L * Math.cos(lr)); c.stroke();
        txt(c, 'l = ' + Math.round(V.l) + '°', sx - 40 * Math.sin(lr) + 14, sy - 40 * Math.cos(lr), C.hue(300), 11, 'left', 700);
        // the map from the line
        disc(g2, 'the map from the 21-cm line');
        if (V.truth) for (const cl of clouds) { const [x, y] = P(g2, cl.x, cl.y); c.fillStyle = C.faint; c.beginPath(); c.arc(x, y, 1.2, 0, TAU); c.fill(); }
        for (const p of mapPts) {
          const [x, y] = P(g2, p.x, p.y);
          if (Math.abs(x - g2.x) > 17 * S || Math.abs(y - g2.y) > 17 * S) continue;
          if (p.amb) { c.strokeStyle = C.warn || C.accent; c.lineWidth = 1; c.beginPath(); c.arc(x, y, 2.2, 0, TAU); c.stroke(); }
          else { c.fillStyle = C.accent; c.beginPath(); c.arc(x, y, 2.2, 0, TAU); c.fill(); }
        }
        if (scanL != null) txt(c, 'scanning l = ' + scanL + '°', g2.x, H0 - 10, C.muted, 11);
        txt(c, '5 kpc', 40, H0 - 22, C.text, 10.5); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(18, H0 - 10); c.lineTo(18 + 5 * S, H0 - 10); c.stroke();
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
