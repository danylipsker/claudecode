/* HYPER-ERGONOMICS · sims/organisation.js — simulations for organising work.
 *   or-roster        a shift roster over four weeks: shifts on a 24-h grid, quick returns, runs of nights, early starts,
 *                    free weekends and a relative risk index from Folkard and Tucker's trends
 *   or-body-clock    a week of shifts through a simplified three-process model of alertness (sleep pressure + body clock)
 *   or-breaks        fatigue through a shift under different break schedules (a qualitative model) and the risk trend
 *                    between breaks (Tucker, Folkard and Macdonald)
 *   or-vigilance     a monitoring task: detection falls with time on watch; rotating the watcher restores it
 *   or-work-rest     energy expenditure against the worker's aerobic capacity (Murrell) and heat (NIOSH REL/RAL):
 *                    how many minutes of each hour can be work
 *   or-rotation      four workers, four stations: noise dose, vibration A(8) and body-region loads under rotation plans
 *   or-job-strain    Karasek's demand–control plane with support, and Siegrist's effort–reward balance
 *   or-participation who takes part in a redesign workshop, and which problems of a work cell they can find
 *   or-ageing        the ageing worker: near point, light, hearing thresholds (ISO 7029:2000), strength and aerobic capacity
 * Illustrative models where noted; representative data only — not for real designs or individual advice.
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const onTheme = fn => { document.addEventListener('hyper:theme', fn); return () => document.removeEventListener('hyper:theme', fn); };
  const hhmm = h => { h = ((h % 24) + 24) % 24; let H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { H = (H + 1) % 24; M = 0; } return String(H).padStart(2, '0') + ':' + String(M).padStart(2, '0'); };
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const f1 = v => (Math.round(v * 10) / 10).toFixed(1);
  const rr = (c, x, y, w, h, r) => { r = Math.max(0, Math.min(r, w / 2, h / 2)); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  // a small seeded random number generator
  const rng = seed => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };

  /* ================================================================ or-roster */
  const SHIFT_HUE = { M: 40, A: 200, N: 270, D: 140 };
  const SHIFT_NAME = { M: 'morning', A: 'afternoon', N: 'night', D: 'day' };
  const ROSTERS = {
    days: { name: 'Day work, Monday to Friday (8 h)', cycle: 'DDDDD--', len: 8 },
    wkBack: { name: 'Weekly rotation, backward: nights, afternoons, mornings (8 h)', cycle: 'NNNNN--AAAAA--MMMMM--', len: 8 },
    wkFwd: { name: 'Weekly rotation, forward: mornings, afternoons, nights (8 h)', cycle: 'MMMMM--AAAAA--NNNNN--', len: 8 },
    fastFwd: { name: 'Fast forward rotation 2-2-2 (8 h)', cycle: 'MMAANN--', len: 8 },
    fastBack: { name: 'Fast backward rotation 2-2-2 (8 h)', cycle: 'NNAAMM--', len: 8 },
    dn12: { name: '12 h: 2 days, 2 nights, 4 off', cycle: 'DDNN----', len: 12 },
    dn12long: { name: '12 h: 4 days, 4 off, 4 nights, 4 off', cycle: 'DDDD----NNNN----', len: 12 },
    perm: { name: 'Permanent nights, 5 on, 2 off (8 h)', cycle: 'NNNNN--', len: 8 }
  };
  // approximate trends from Folkard and Tucker (2003): by shift, by consecutive night, by shift length (8 h = 1)
  const RISK_TYPE = { M: 1, D: 1, A: 1.18, N: 1.30 }, RISK_NIGHTS = [1, 1.06, 1.17, 1.36];
  const riskLen = L => 1 + 0.0675 * Math.max(0, L - 8);
  function buildRoster(key, t0, over) {
    const R = ROSTERS[key], twelve = R.len === 12, L = R.len + over, n = R.cycle.length;
    const startH = ch => twelve ? (ch === 'N' ? t0 + 13 : t0 + 1) : ch === 'D' ? t0 + 2 : ch === 'M' ? t0 : ch === 'A' ? t0 + 8 : t0 + 16;
    const shifts = [];
    let run = 0;
    for (let d = -2 * n; d < 28 + n; d++) {
      const ch = R.cycle[((d % n) + n) % n];
      if (ch === '-') { run = 0; continue; }
      run = ch === 'N' ? run + 1 : 0;
      const s = d * 24 + startH(ch);
      shifts.push({ d, ch, s, e: s + L, L, run });
    }
    return shifts;
  }
  function rosterStats(sh, thr) {
    const inWin = x => x.s >= 0 && x.s < 28 * 24;
    const out = { hours: 0, nights: 0, maxRun: 0, quick: [], minRest: Infinity, early: 0, trough: 0, risk: 0, n: 0, free: 0 };
    sh.forEach((x, i) => {
      const nx = sh[i + 1];
      if (nx && inWin(nx)) { const r = nx.s - x.e; if (r < out.minRest) out.minRest = r; if (r < thr) out.quick.push({ a: x.e, b: nx.s, r }); }
      if (!inWin(x)) return;
      out.n++; out.hours += x.L;
      if (x.ch === 'N') { out.nights++; out.maxRun = Math.max(out.maxRun, x.run); }
      if (x.ch !== 'N' && (x.s % 24) < 7 - 1e-9) out.early++;
      for (let k = Math.floor(x.s / 24); k <= Math.floor(x.e / 24); k++) out.trough += Math.max(0, Math.min(x.e, k * 24 + 6) - Math.max(x.s, k * 24 + 2));
      out.risk += RISK_TYPE[x.ch] * (x.ch === 'N' ? RISK_NIGHTS[Math.min(4, Math.max(1, x.run)) - 1] : 1) * riskLen(x.L);
    });
    for (let w = 0; w < 4; w++) { const a = (7 * w + 5) * 24, b = (7 * w + 7) * 24; if (!sh.some(x => x.s < b && x.e > a)) out.free++; }
    out.risk = out.n ? out.risk / out.n : 1;
    return out;
  }

  Hyper.sim('or-roster', {
    title: 'A shift roster, four weeks at a glance',
    blurb: `Each row is a day, each column an hour from midnight to midnight; coloured bars are shifts, the shaded band is the night and its darker part the body clock's low point (02:00–06:00). Red lines mark rests shorter than the limit you set (11 h in the EU). The read-outs count what drives fatigue: quick returns, runs of nights, early starts, hours in the low point and free weekends. The risk index multiplies the approximate trends Folkard and Tucker found — by shift, by consecutive night and by shift length — relative to an 8-h morning shift.

**Try this**
- Compare *Fast forward* with *Fast backward* 2-2-2: the same hours, but backward rotation leaves two 8-h rests in every cycle.
- Choose *12 h: 4 days, 4 off, 4 nights, 4 off*: the fourth night in a row drives the risk index up. Compare *2 days, 2 nights, 4 off* at the same weekly hours.
- Add 2 h of overtime to any roster: rests shrink, the risk index climbs and quick returns appear.
- Move the morning start from 06:00 to 05:00: count the early starts — and think of the sleep before them.
- *Permanent nights*: 20 h a week in the low point, and the Friday night reaches into every Saturday — few people ever adapt to it.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 400 });
      const ctl = kit.controls(box.side, [
        { id: 'pat', type: 'select', label: 'Roster', options: Object.keys(ROSTERS).map(k => [ROSTERS[k].name, k]), value: (params && params.pattern) || 'fastFwd' },
        { id: 't0', label: 'Morning shift starts at', min: 4, max: 9, step: 0.5, value: 6, fmt: v => hhmm(v) },
        { id: 'over', label: 'Overtime added to each shift', min: 0, max: 4, step: 0.5, value: 0, unit: 'h' },
        { id: 'thr', label: 'Mark rests shorter than', min: 8, max: 16, step: 0.5, value: 11, unit: 'h' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['wk', 'Average weekly hours'], ['nights', 'Night shifts in 4 weeks'], ['run', 'Longest run of nights'], ['quick', 'Short rests'], ['early', 'Starts before 07:00'], ['trough', 'Hours worked 02:00–06:00, per week'], ['free', 'Free weekends (of 4)'], ['risk', 'Relative risk index']]);
      function draw() {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H;
        const sh = buildRoster(V.pat, V.t0, V.over), S = rosterStats(sh, V.thr);
        const R0 = ROSTERS[V.pat], nOn = R0.cycle.replace(/-/g, '').length;
        ro.set('wk', f1(7 * nOn * (R0.len + V.over) / R0.cycle.length) + ' h (7·n·L/c: ' + nOn + ' shifts in ' + R0.cycle.length + ' days)');
        ro.set('nights', String(S.nights));
        ro.set('run', S.maxRun ? S.maxRun + (S.maxRun > 3 ? ' — long: risk climbs night by night' : '') : 'none');
        ro.set('quick', S.quick.length ? S.quick.length + ' under ' + V.thr + ' h (shortest ' + f1(S.minRest) + ' h)' : 'none (shortest rest ' + f1(Number.isFinite(S.minRest) ? S.minRest : 0) + ' h)');
        ro.set('early', String(S.early));
        ro.set('trough', f1(S.trough / 4) + ' h');
        ro.set('free', String(S.free));
        ro.set('risk', S.risk.toFixed(2) + ' × an 8-h morning shift' + (V.over + ROSTERS[V.pat].len > 12 ? ' (beyond 12 h: extrapolated)' : ''));
        const x0 = 62, x1 = Wd - 12, y0 = 28, y1 = Hh - 40, rh = (y1 - y0) / 28;
        const X = h => x0 + (h / 24) * (x1 - x0);
        c.font = '11px ' + font();
        // day rows, week tints, weekends
        for (let d = 0; d < 28; d++) {
          const y = y0 + d * rh;
          c.fillStyle = d % 7 >= 5 ? C.hue(140, 0.08) : Math.floor(d / 7) % 2 ? C.hue(215, 0.04) : 'rgba(0,0,0,0)';
          c.fillRect(x0, y, x1 - x0, rh);
          kit.label(c, DAYS[d % 7] + ' ' + (d + 1), x0 - 6, y + rh / 2, { size: Math.min(11, rh * 0.8), color: d % 7 >= 5 ? C.ok : C.muted, align: 'right', baseline: 'middle' });
        }
        // the night and the body clock's low point
        c.fillStyle = C.hue(250, 0.08); c.fillRect(X(0), y0, X(6) - X(0), y1 - y0);
        c.fillStyle = C.hue(250, 0.12); c.fillRect(X(2), y0, X(6) - X(2), y1 - y0);
        c.fillStyle = C.hue(250, 0.06); c.fillRect(X(22), y0, X(24) - X(22), y1 - y0);
        // hour grid
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let h = 0; h <= 24; h += 3) {
          c.beginPath(); c.moveTo(X(h), y0); c.lineTo(X(h), y1); c.stroke();
          kit.label(c, h === 24 ? '24' : String(h).padStart(2, '0'), X(h), y0 - 9, { size: 10.5, color: C.muted, align: 'center', baseline: 'middle' });
        }
        c.strokeStyle = C.axis;
        for (let w = 0; w <= 4; w++) { c.beginPath(); c.moveTo(x0 - 50, y0 + w * 7 * rh); c.lineTo(x1, y0 + w * 7 * rh); c.stroke(); }
        // shifts, split at midnight
        sh.forEach(x => {
          let a = x.s;
          while (a < x.e - 1e-9) {
            const d = Math.floor(a / 24 + 1e-9), b = Math.min(x.e, (d + 1) * 24);
            if (d >= 0 && d < 28) {
              const y = y0 + d * rh + Math.max(1, rh * 0.14), h = Math.max(2, rh * 0.72), xa = X(a - d * 24), xb = X(b - d * 24);
              c.fillStyle = C.hue(SHIFT_HUE[x.ch], 0.85); rr(c, xa, y, Math.max(1, xb - xa), h, 3); c.fill();
              if (xb - xa > 16 && rh > 9) kit.label(c, x.ch, (xa + xb) / 2, y + h / 2, { size: Math.min(10.5, rh * 0.62), color: C.bg2, align: 'center', baseline: 'middle', weight: 'bold' });
            }
            a = b;
          }
        });
        // short rests
        S.quick.forEach(q => {
          let a = q.a, first = true;
          while (a < q.b - 1e-9) {
            const d = Math.floor(a / 24 + 1e-9), b = Math.min(q.b, (d + 1) * 24);
            if (d >= 0 && d < 28) {
              const y = y0 + d * rh + rh / 2;
              c.strokeStyle = C.bad; c.lineWidth = 2.5; c.setLineDash([5, 3]);
              c.beginPath(); c.moveTo(X(a - d * 24), y); c.lineTo(X(b - d * 24), y); c.stroke(); c.setLineDash([]);
              if (first) kit.label(c, f1(q.r) + ' h', X(a - d * 24) + 3, y - rh * 0.1, { size: 10.5, color: C.bad, baseline: 'bottom', bg: C.bg2 });
            }
            first = false; a = b;
          }
        });
        // legend
        const ly = Hh - 18; let lx = x0;
        const key = (col, text, line) => {
          if (line) { c.strokeStyle = col; c.lineWidth = 2.5; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(lx, ly); c.lineTo(lx + 18, ly); c.stroke(); c.setLineDash([]); }
          else { c.fillStyle = col; rr(c, lx, ly - 6, 18, 12, 3); c.fill(); }
          kit.label(c, text, lx + 23, ly, { size: 11, color: C.muted, baseline: 'middle' });
          lx += 30 + c.measureText(text).width + 8;
        };
        const used = new Set(ROSTERS[V.pat].cycle.replace(/-/g, '').split(''));
        ['M', 'A', 'N', 'D'].filter(k => used.has(k)).forEach(k => key(C.hue(SHIFT_HUE[k], 0.85), SHIFT_NAME[k] + (k === 'D' && ROSTERS[V.pat].len === 12 ? ' (12 h)' : '')));
        key(C.hue(250, 0.25), '02:00–06:00 low point');
        key(C.bad, 'rest < ' + V.thr + ' h', true);
      }
      st.onResize(() => draw());
      draw();
      return onTheme(draw);
    }
  });

  /* ================================================================ or-body-clock */
  // a simplified three-process model (Åkerstedt and Folkard, 1997): sleep pressure S falls exponentially while awake
  // (towards 2.4, rate 0.0353/h) and recovers during sleep (towards 14.3, rate 0.381/h); the circadian part is
  // C = 2.5 cos(2π(t − 16.8 − δ)/24); alertness = S + C. Group averages, not a prediction for one person.
  const CLOCK_WEEKS = {
    dayWork: { name: 'Day work, 08:00–16:00', week: 'DDDDD--' },
    mornings: { name: 'Early shifts, 06:00–14:00', week: 'MMMMM--' },
    nights8: { name: 'Five night shifts, 22:00–06:00', week: 'NNNNN--' },
    nights12: { name: 'Four 12-h nights, 19:00–07:00', week: 'XXXX---' },
    fastFwd: { name: 'Fast forward: 2 early, 2 late, 2 nights', week: 'MMAANN-' },
    fastBack: { name: 'Fast backward: 2 nights, 2 late, 2 early', week: 'NNAAMM-' }
  };
  const CLOCK_SH = { D: [8, 8], M: [6, 8], A: [14, 8], N: [22, 8], X: [19, 12] };
  const wrap12 = h => { h = ((h + 12) % 24 + 24) % 24 - 12; return h; };
  function clockRun(o) {
    const shiftOf = d => {
      if (d < 0 || d > 7) return null;
      const ch = o.week[d % 7]; if (ch === '-') return null;
      const [s, L] = CLOCK_SH[ch];
      return { ch, start: d * 24 + s, end: d * 24 + s + L, sH: s, night: ch === 'N' || ch === 'X' };
    };
    // sleep episodes
    let eps = [];
    for (let d = -3; d <= 7; d++) {
      const today = shiftOf(d), tom = shiftOf(d + 1), y = shiftOf(d - 1);
      if (y && y.night) { const s0 = y.end + 1, more = today && today.night; eps.push([s0, s0 + (more ? o.daySleep : Math.min(o.daySleep, 4))]); }
      if (today && today.night) { if (o.nap) eps.push([today.start - 3.5, today.start - 2]); continue; }
      const early = tom && !tom.night && tom.sH < 7;
      const bed = today && today.ch === 'A' ? today.end + 1.5 : d * 24 + (early ? 22.5 : 23);
      let wake = tom && !tom.night && tom.sH <= 9 ? tom.start - 1 : bed + 8;
      if (wake - bed > 9) wake = bed + 9;
      if (wake > bed) eps.push([bed, wake]);
    }
    eps.sort((a, b) => a[0] - b[0]);
    const merged = [];
    eps.forEach(e => { const l = merged[merged.length - 1]; if (l && e[0] <= l[1]) l[1] = Math.max(l[1], e[1]); else merged.push(e.slice()); });
    eps = merged;
    const work = []; for (let d = 0; d < 7; d++) { const s = shiftOf(d); if (s) work.push(s); }
    const asleep = t => eps.some(e => t >= e[0] && t < e[1]);
    const atWork = t => work.find(w => t >= w.start && t < w.end) || null;
    const dt = 0.05, tStart = -72, n = Math.round((168 - tStart) / dt);
    let S = 13, delta = 0, lastDay = Math.floor(tStart / 24), lastWake = tStart;
    const pts = [], endAwake = [];
    for (let i = 0; i <= n; i++) {
      const t = tStart + i * dt, day = Math.floor(t / 24 + 1e-9);
      if (day !== lastDay) {
        lastDay = day;
        if (o.adapt) {
          let best = null;
          eps.forEach(e => { if (e[0] >= t - 24 && e[0] < t && (!best || e[1] - e[0] > best[1] - best[0])) best = e; });
          if (best && best[1] - best[0] >= 3) { const target = wrap12((best[0] + best[1]) / 2 - 3), diff = wrap12(target - delta); delta += clamp(diff, -0.75, 1.0); }
        }
      }
      const sl = asleep(t), C = 2.5 * Math.cos(2 * Math.PI * (t - 16.8 - delta) / 24), w = atWork(t);
      if (sl) lastWake = t;
      if (t >= 0 && t <= 168) pts.push({ t, S, C, A: S + C, sl, w: !!w });
      if (w && Math.abs(t + dt - w.end) < dt / 2) endAwake.push(t + dt - lastWake);
      S = sl ? 14.3 - (14.3 - S) * Math.exp(-0.381 * dt) : 2.4 + (S - 2.4) * Math.exp(-0.0353 * dt);
    }
    return { pts, eps, work, delta, endAwake, dt };
  }
  let clockBase = null;
  const clockBaseline = () => {
    if (clockBase) return clockBase;
    const r = clockRun({ week: CLOCK_WEEKS.dayWork.week, daySleep: 6, nap: false, adapt: false });
    let lo = Infinity; r.pts.forEach(p => { if (!p.sl && p.t >= 24 && p.t < 120) lo = Math.min(lo, p.A); });
    clockBase = { run: r, bed: lo };
    return clockBase;
  };

  Hyper.sim('or-body-clock', {
    title: 'The body clock through a week of shifts',
    blurb: `Alertness in a simplified three-process model: a sleep pressure that drains while awake and refills during sleep, plus a daily body-clock swing with its low point in the early morning. The top strip shows work (orange) and sleep (blue); the curve is alertness. The dashed line is the lowest level a day worker reaches — at bedtime. Where the curve dips below it during work it turns red. The model describes group averages with the parameters commonly quoted for it; it is not a prediction for any one person.

**Try this**
- Start with *Day work*: alertness stays high at work and dips only before bed.
- *Five night shifts*: on the first night, awake since the morning, alertness is below the day worker's bedtime level for almost the whole shift and lowest near 06:00. Read *Longest time awake*.
- Tick *Nap before each night shift*: the dip on the first night is shallower.
- Shorten the day sleep from 7 h to 4.5 h: the deficit builds night after night.
- Tick *Body clock adapts* (up to about an hour a day later): after four or five nights it has moved part-way — and the days off pull it back.
- *Fast backward*: the rest between the late and the early shift is short, and the early shift after it starts sleepy.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'pat', type: 'select', label: 'Week of shifts', options: Object.keys(CLOCK_WEEKS).map(k => [CLOCK_WEEKS[k].name, k]), value: (params && params.pattern) || 'nights8' },
        { id: 'daySleep', label: 'Day sleep after a night shift', min: 3, max: 8, step: 0.5, value: 6, unit: 'h' },
        { id: 'nap', type: 'check', label: 'Nap (1.5 h) before each night shift', value: false },
        { id: 'adapt', type: 'check', label: 'Body clock adapts (up to about 1 h a day later)', value: false },
        { id: 'base', type: 'check', label: 'Show a day worker for comparison', value: true }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['low', 'Lowest alertness at work'], ['below', 'Work time below a day worker\'s bedtime level'], ['sleep', 'Sleep in the week'], ['awake', 'Longest time awake at the end of a shift'], ['clock', 'Body clock shifted by']]);
      function draw() {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H, B = clockBaseline();
        const r = clockRun({ week: CLOCK_WEEKS[V.pat].week, daySleep: V.daySleep, nap: V.nap, adapt: V.adapt });
        const thr = B.bed;
        let low = Infinity, lowT = 0, below = 0, sleep = 0;
        r.pts.forEach(p => { if (p.w && p.A < low) { low = p.A; lowT = p.t; } if (p.w && p.A < thr) below += r.dt; if (p.sl && p.t < 168) sleep += r.dt; });
        ro.set('low', Number.isFinite(low) ? f1(low) + ' at ' + DAYS[Math.floor(lowT / 24) % 7] + ' ' + hhmm(lowT) + ' (day worker at bedtime: ' + f1(thr) + ')' : '—');
        ro.set('below', f1(below) + ' h');
        ro.set('sleep', f1(sleep) + ' h (8 h a night would be 56 h)');
        ro.set('awake', r.endAwake.length ? f1(Math.max(...r.endAwake)) + ' h' : '—');
        ro.set('clock', V.adapt ? (r.delta >= 0 ? f1(r.delta) + ' h later' : f1(-r.delta) + ' h earlier') + ' than a day worker\'s' : 'not modelled (most night workers barely adapt)');
        const x0 = 46, x1 = Wd - 12, yS = 26, hS = 16, yc0 = yS + hS + 14, yc1 = Hh - 22;
        const X = t => x0 + t / 168 * (x1 - x0), Y = a => yc1 - clamp(a, 0, 17) / 17 * (yc1 - yc0);
        c.font = '11px ' + font();
        // nights shaded, day grid
        for (let d = 0; d < 7; d++) {
          c.fillStyle = C.hue(250, 0.08); c.fillRect(X(d * 24), yS, X(d * 24 + 6) - X(d * 24), yc1 - yS);
          c.fillRect(X(d * 24 + 22), yS, X(d * 24 + 24) - X(d * 24 + 22), yc1 - yS);
          kit.label(c, DAYS[d], (X(d * 24) + X(d * 24 + 24)) / 2, 11, { size: 11.5, color: d >= 5 ? C.ok : C.text, align: 'center', baseline: 'middle', weight: '600' });
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(d * 24), yS); c.lineTo(X(d * 24), yc1); c.stroke();
          [6, 12, 18].forEach(h => { c.beginPath(); c.moveTo(X(d * 24 + h), yc1); c.lineTo(X(d * 24 + h), yc1 + 4); c.stroke(); });
        }
        // sleep and work strip
        c.fillStyle = C.surface2; c.fillRect(x0, yS, x1 - x0, hS);
        r.eps.forEach(e => { const a = clamp(e[0], 0, 168), b = clamp(e[1], 0, 168); if (b > a) { c.fillStyle = C.hue(225, 0.7); c.fillRect(X(a), yS, X(b) - X(a), hS); } });
        r.work.forEach(w => { const a = clamp(w.start, 0, 168), b = clamp(w.end, 0, 168); if (b > a) { c.fillStyle = C.hue(30, 0.9); c.fillRect(X(a), yS + 3, X(b) - X(a), hS - 6); } });
        // axis
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, yc0); c.lineTo(x0, yc1); c.lineTo(x1, yc1); c.stroke();
        [0, 5, 10, 15].forEach(a => kit.label(c, String(a), x0 - 5, Y(a), { size: 10.5, color: C.muted, align: 'right', baseline: 'middle' }));
        kit.label(c, 'alertness (model units)', x0 + 4, yc0 + 2, { size: 10.5, color: C.muted, baseline: 'top' });
        // threshold
        c.strokeStyle = C.warn; c.setLineDash([6, 4]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, Y(thr)); c.lineTo(x1, Y(thr)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'day worker at bedtime', x1 - 4, Y(thr) - 3, { size: 10.5, color: C.warn, align: 'right', baseline: 'bottom', bg: C.bg2 });
        // day worker for comparison
        if (V.base && V.pat !== 'dayWork') {
          c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath();
          B.run.pts.forEach((p, i) => i ? c.lineTo(X(p.t), Y(p.A)) : c.moveTo(X(p.t), Y(p.A))); c.stroke(); c.setLineDash([]);
        }
        // alertness
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        r.pts.forEach((p, i) => i ? c.lineTo(X(p.t), Y(p.A)) : c.moveTo(X(p.t), Y(p.A))); c.stroke();
        c.strokeStyle = C.bad; c.lineWidth = 3.5;
        for (let i = 1; i < r.pts.length; i++) {
          const p = r.pts[i], q = r.pts[i - 1];
          if (p.w && q.w && p.A < thr) { c.beginPath(); c.moveTo(X(q.t), Y(q.A)); c.lineTo(X(p.t), Y(p.A)); c.stroke(); }
        }
        if (Number.isFinite(low)) { kit.dot(c, X(lowT), Y(low), 4, C.bad); }
        // legend
        const ly = Hh - 8;
        c.fillStyle = C.hue(225, 0.7); c.fillRect(x0, ly - 5, 12, 8); kit.label(c, 'sleep', x0 + 16, ly - 1, { size: 10.5, color: C.muted, baseline: 'middle' });
        c.fillStyle = C.hue(30, 0.9); c.fillRect(x0 + 60, ly - 5, 12, 8); kit.label(c, 'work', x0 + 76, ly - 1, { size: 10.5, color: C.muted, baseline: 'middle' });
        kit.label(c, 'shaded: 22:00–06:00', x0 + 120, ly - 1, { size: 10.5, color: C.muted, baseline: 'middle' });
      }
      st.onResize(() => draw());
      draw();
      return onTheme(draw);
    }
  });

  /* ================================================================ or-breaks */
  // a qualitative fatigue model: while working, dF/dt = (a·k/60)(1 + 0.3 F) per minute — fatigue builds faster when it
  // is already high (Rohmert's observation); while resting F decays as e^(−t/τ). Units are arbitrary: compare schedules.
  // Risk trend between breaks of 10 min or more: 1 + t/75 min, i.e. about double from the first to the last half hour
  // of a 2-h spell (Tucker, Folkard and Macdonald, 2003).
  const microPlan = () => { const b = [[120, 15], [240, 30], [360, 15]]; for (let m = 20; m < 480; m += 20) if (m % 120) b.push([m, 1]); return b.sort((p, q) => p[0] - q[0]); };
  const BREAK_PLANS = {
    lunch: { name: 'Lunch only (30 min after 4 h of work)', short: 'lunch only', b: [[240, 30]] },
    long: { name: 'Two 30-min breaks, after 3 h and 6 h', short: 'two 30s', b: [[180, 30], [360, 30]] },
    classic: { name: 'Two 15-min breaks and a 30-min lunch', short: '15 + 30 + 15', b: [[120, 15], [240, 30], [360, 15]] },
    hourly: { name: 'Lunch and 5 min every hour (the same 60 min)', short: '5 min hourly', b: [[60, 5], [120, 5], [180, 5], [240, 30], [300, 5], [360, 5], [420, 5]] },
    extra: { name: 'Two 15s, lunch and 5 min in the other hours', short: '15s + 5s', b: [[60, 5], [120, 15], [180, 5], [240, 30], [300, 5], [360, 15], [420, 5]] },
    micro: { name: 'Two 15s, lunch and a 1-min pause every 20 min', short: '+ 1-min pauses', b: microPlan() },
    ocra: { name: 'Lunch and 10 min after every 50 min', short: '10 per 50', b: [[50, 10], [100, 10], [150, 10], [200, 10], [240, 30], [290, 10], [340, 10], [390, 10], [440, 10]] }
  };
  const BREAK_TASKS = {
    screen: { name: 'Keyboard and mouse work', a: 0.5, tau: 4 },
    assembly: { name: 'Repetitive assembly (hands and shoulders)', a: 0.7, tau: 6 },
    heavy: { name: 'Heavy manual work', a: 0.9, tau: 12 },
    monitor: { name: 'Monitoring a screen for rare events', a: 0.6, tau: 8 }
  };
  function runBreaks(planKey, taskKey, k) {
    const P = BREAK_PLANS[planKey], T = BREAK_TASKS[taskKey], dt = 0.25;
    const segs = []; let w = 0;
    P.b.forEach(([at, len]) => { if (at > w) segs.push({ work: true, dur: at - w }); segs.push({ work: false, dur: len }); w = at; });
    if (w < 480) segs.push({ work: true, dur: 480 - w });
    // `since` is the effective time since a proper break: a break of 15 min or more resets it, a break of 5–15 min
    // resets it in proportion (an assumption: the studies looked at 15-min breaks), shorter pauses not at all
    let F = 0, clock = 0, since = 0, sum = 0, nWork = 0, peak = 0, longest = 0, rest = 0;
    const pts = [[8, 0]], risk = [];
    segs.forEach(s => {
      const n = Math.round(s.dur / dt);
      if (!s.work) { rest += s.dur; if (s.dur >= 5) { longest = Math.max(longest, since); since *= 1 - Math.min(1, s.dur / 15); risk.push(null); } }
      for (let i = 0; i < n; i++) {
        if (s.work) { F += (T.a * k / 60) * (1 + 0.3 * F) * dt; sum += F; nWork++; since += dt; }
        else { F *= Math.exp(-dt / T.tau); if (s.dur < 5) since += dt; }
        clock += dt; peak = Math.max(peak, F);
        if (i % 4 === 3) { pts.push([8 + clock / 60, F]); if (s.work || s.dur < 5) risk.push([8 + clock / 60, 1 + since / 75]); }
      }
    });
    longest = Math.max(longest, since);
    return { segs, pts, risk, peak, end: F, mean: nWork ? sum / nWork : 0, rest, span: clock, longest, riskEnd: 1 + longest / 75 };
  }

  Hyper.sim('or-breaks', {
    title: 'Fatigue through a shift: when to take the breaks',
    blurb: `Eight hours of work, broken up by different break schedules. Fatigue builds while working — faster when it is already high — and recovers exponentially during rest, fastest at the start. The model is qualitative: its units are arbitrary, so compare the schedules rather than read the numbers. The thin red line above each timeline is the trend in incident risk through each spell of work — about double from the first to the last half hour of a 2-h spell between 15-min breaks, after Tucker, Folkard and Macdonald; shorter breaks are assumed to reset it in part, and spells longer than 2 h are extrapolated.

**Try this**
- Compare *Two 15-min breaks and a 30-min lunch* with *Lunch and 5 min every hour*: the same 60 min of rest, but the hourly pauses keep the peaks lower.
- *Lunch only* or *Two 30-min breaks*: long spells let fatigue run away — look at the bars.
- Add 5-min breaks to the classic schedule (as in NIOSH's field study): more rest, lower fatigue, a little later finish.
- Choose *Heavy manual work*: recovery is slower (a longer time constant), so short pauses help less and longer breaks matter more.
- Raise the intensity: every schedule suffers, but the long spells suffer most.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 280 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const planOpts = Object.keys(BREAK_PLANS).map(k => [BREAK_PLANS[k].name, k]);
      const ctl = kit.controls(box.side, [
        { id: 'plan', type: 'select', label: 'Break schedule', options: planOpts, value: 'hourly' },
        { id: 'cmp', type: 'select', label: 'Compare with', options: planOpts, value: 'classic' },
        { id: 'task', type: 'select', label: 'Task', options: Object.keys(BREAK_TASKS).map(k => [BREAK_TASKS[k].name, k]), value: 'assembly' },
        { id: 'k', label: 'Intensity of the work', min: 0.5, max: 2, step: 0.05, value: 1, fmt: v => '× ' + v.toFixed(2) }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rest', 'Total rest'], ['span', 'The shift runs'], ['peak', 'Peak fatigue (model units)'], ['end', 'At the end of the shift'], ['mean', 'Average while working'], ['spell', 'Longest effective spell since a 15-min break'], ['risk', 'Risk trend at the end of that spell']]);
      const plot = kit.plot(gb, { x: { label: 'time of day (h)', min: 8, max: 18 }, y: { label: 'fatigue (model units)', min: 0 }, legend: true }, 190);
      function band(c, C, r, x0, x1, y, h, X, label) {
        kit.label(c, label, x0, y - 4, { size: 11, color: C.muted, baseline: 'bottom' });
        let t = 0;
        r.segs.forEach(s => {
          const xa = X(8 + t / 60), xb = X(8 + (t + s.dur) / 60);
          c.fillStyle = s.work ? C.hue(215, 0.55) : C.ok; c.fillRect(xa, y, Math.max(1, xb - xa), h);
          if (!s.work && s.dur >= 5 && xb - xa > 14) kit.label(c, String(s.dur), (xa + xb) / 2, y + h / 2, { size: 10, color: C.bg2, align: 'center', baseline: 'middle', weight: 'bold' });
          t += s.dur;
        });
        // risk trend sparkline above the band (1 to 3 ×)
        c.strokeStyle = C.bad; c.lineWidth = 1.3; c.beginPath(); let pen = false;
        r.risk.forEach(p => { if (!p) { pen = false; return; } const yy = y - 2 - (p[1] - 1) / 2 * 14; if (pen) c.lineTo(X(p[0]), yy); else { c.moveTo(X(p[0]), yy); pen = true; } });
        c.stroke();
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H;
        const r = runBreaks(V.plan, V.task, V.k), q = runBreaks(V.cmp, V.task, V.k);
        const all = Object.keys(BREAK_PLANS).map(key => ({ key, r: runBreaks(key, V.task, V.k) }));
        const tEnd = Math.max(r.span, q.span, ...all.map(a => a.r.span));
        ro.set('rest', Math.round(r.rest) + ' min (' + Math.round(100 * r.rest / (480 + r.rest)) + ' % of the time at work)');
        ro.set('span', '08:00 to ' + hhmm(8 + r.span / 60));
        ro.set('peak', f1(r.peak) + ' (compare: ' + f1(q.peak) + ')');
        ro.set('end', f1(r.end));
        ro.set('mean', f1(r.mean) + ' (compare: ' + f1(q.mean) + ')');
        ro.set('spell', Math.round(r.longest) + ' min' + (r.longest > 120 ? ' — beyond the 2-h spells studied' : ''));
        ro.set('risk', '× ' + r.riskEnd.toFixed(2) + ' of the level just after a break' + (r.longest > 120 ? ' (extrapolated)' : ''));
        c.font = '11px ' + font();
        const x0 = 12, x1 = Wd - 12, X = h => x0 + (h - 8) / (tEnd / 60) * (x1 - x0);
        band(c, C, r, x0, x1, 40, 20, X, 'This schedule — ' + BREAK_PLANS[V.plan].short);
        band(c, C, q, x0, x1, 96, 20, X, 'Compare — ' + BREAK_PLANS[V.cmp].short);
        for (let h = 8; h <= 8 + tEnd / 60 + 1e-9; h++) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(X(h), 120); c.lineTo(X(h), 124); c.stroke(); kit.label(c, String(h).padStart(2, '0'), X(h), 132, { size: 10, color: C.muted, align: 'center', baseline: 'middle' }); }
        // peak fatigue of every schedule
        const yb = 150, rowH = Math.max(12, Math.min(20, (Hh - yb - 8) / all.length)), lw = Math.min(150, Wd * 0.28), bx0 = x0 + lw, bx1 = x1 - 44, pmax = Math.max(...all.map(a => a.r.peak), 0.1);
        kit.label(c, 'Peak fatigue with each schedule', x0, yb - 6, { size: 11, color: C.muted, baseline: 'bottom' });
        all.forEach((a, i) => {
          const y = yb + i * rowH, cur = a.key === V.plan, cmp = a.key === V.cmp;
          kit.label(c, BREAK_PLANS[a.key].short, bx0 - 6, y + rowH / 2, { size: 10.5, color: cur ? C.text : C.muted, align: 'right', baseline: 'middle', weight: cur ? 'bold' : 'normal' });
          c.fillStyle = cur ? C.accent : cmp ? C.hue(28, 0.8) : C.hue(215, 0.3);
          c.fillRect(bx0, y + 2, Math.max(1, (bx1 - bx0) * a.r.peak / pmax), rowH - 4);
          kit.label(c, f1(a.r.peak) + ' · ' + Math.round(a.r.rest) + "'", bx0 + (bx1 - bx0) * a.r.peak / pmax + 4, y + rowH / 2, { size: 10, color: C.muted, baseline: 'middle' });
        });
        plot.set({ series: [{ pts: r.pts, label: BREAK_PLANS[V.plan].short }, { pts: q.pts, label: BREAK_PLANS[V.cmp].short, dash: [5, 4] }], x: { label: 'time of day (h)', min: 8, max: 8 + tEnd / 60 }, y: { label: 'fatigue (model units)', min: 0 }, marks: [{ x: r.pts.reduce((m, p) => p[1] > m[1] ? p : m, [8, 0])[0], y: r.peak, label: 'peak ' + f1(r.peak) }] });
      }
      st.onResize(() => draw());
      draw();
      return onTheme(draw);
    }
  });

  /* ================================================================ or-vigilance */
  // an illustrative model of the vigilance decrement: detection p(t) = p0 − Δ(1 − e^(−t/τ)), with t the time on watch;
  // most of the drop comes in the first 15–30 min; changing task resets t. Numbers are illustrative.
  const VIG = {
    easy: { name: 'Easy: clear targets', p0: 0.97, d: 0.05, tau: 20 },
    typical: { name: 'Typical: faint targets', p0: 0.92, d: 0.15, tau: 15 },
    hard: { name: 'Hard: faint, rare targets', p0: 0.85, d: 0.25, tau: 12 }
  };
  const vigP = (o, night, t) => { const d = o.d * (night ? 1.3 : 1), p0 = o.p0 - (night ? 0.04 : 0); return clamp(p0 - d * (1 - Math.exp(-t / o.tau)), 0, 1); };

  Hyper.sim('or-vigilance', {
    title: 'Watching for rare targets',
    blurb: `A four-hour session of monitoring — radar, X-ray baggage, CCTV, a process screen. Targets appear at random; each is caught with a chance that falls with the time the watcher has spent on watch, most of it in the first quarter to half hour. Rotating the watcher to another task and back restores it. The curve below shows the chance of detection through the session (the dashed line: no rotation). The model and its numbers are illustrative; real decrements depend on the task, the target rate and the person.

**Try this**
- Set the rotation to 240 min (no rotation) and let it run: misses gather in the later hours.
- Rotate every 20–30 min: the sawtooth stays near the top and the expected misses fall.
- Make the task *Hard*: the gain from rotating is largest where detection is difficult.
- Tick *Night*: every curve drops — shorter watches matter more at night.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'task', type: 'select', label: 'Task', options: Object.keys(VIG).map(k => [VIG[k].name, k]), value: 'typical' },
        { id: 'rot', label: 'Change of task after', min: 10, max: 240, step: 5, value: 120, unit: 'min' },
        { id: 'rate', label: 'Targets per hour', min: 5, max: 60, step: 1, value: 20 },
        { id: 'night', type: 'check', label: 'Night (early-morning hours)', value: false },
        { id: 'speed', label: 'Speed (session minutes per second)', min: 1, max: 30, step: 1, value: 6 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the session', primary: true }] }
      ], id => { if (id === 'restart' || id === 'task' || id === 'rot' || id === 'night') restart(); updPlot(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Time into the session'], ['watch', 'Time on this watch'], ['p', 'Chance of detection now'], ['n', 'Detected / missed so far'], ['avg', 'Session average (model)'], ['miss', 'Expected misses per 100 targets']]);
      const plot = kit.plot(gb, { x: { label: 'time into the session (min)', min: 0, max: 240 }, y: { label: 'chance of detection (%)', min: 50, max: 100 }, legend: true }, 170);
      let T = 0, hit = 0, miss = 0, blips = [], R = rng(11);
      function restart() { T = 0; hit = 0; miss = 0; blips = []; R = rng(11); }
      const onWatch = t => t % V.rot;
      function sessionAvg(rot) { let s = 0; for (let t = 0; t < 240; t += 0.5) s += vigP(VIG[V.task], V.night, t % rot); return s / 480; }
      function updPlot() {
        const pts = [], flat = [];
        for (let t = 0; t <= 240; t += 1) { pts.push([t, 100 * vigP(VIG[V.task], V.night, t % V.rot)]); flat.push([t, 100 * vigP(VIG[V.task], V.night, t)]); }
        plot.set({ series: [{ pts, label: 'change after ' + V.rot + ' min' }, { pts: flat, label: 'no change', dash: [5, 4] }], vlines: [{ x: Math.min(240, T), label: 'now' }] });
      }
      const loop = kit.loop(dt => {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H, o = VIG[V.task];
        const dT = dt * V.speed;
        // new targets: a Poisson process at V.rate per hour
        if (dT > 0) {
          let lam = V.rate / 60 * dT;
          while (lam > 0) { const step = Math.min(lam, 0.2); if (R() < step) { const tw = onWatch(T), ok = R() < vigP(o, V.night, tw); ok ? hit++ : miss++; blips.push({ t: T, a: R() * 2 * Math.PI, r: 0.2 + 0.75 * R(), ok }); } lam -= step; }
          T += dT;
          if (T >= 240) { restart(); }
          if (Math.floor(T) !== Math.floor(T - dT)) updPlot();
        }
        blips = blips.filter(b => T - b.t < 25 && T >= b.t);
        const tw = onWatch(T), p = vigP(o, V.night, tw), avg = sessionAvg(V.rot);
        ro.set('T', Math.floor(T) + ' of 240 min');
        ro.set('watch', Math.floor(tw) + ' min (changes every ' + V.rot + ' min)');
        ro.set('p', Math.round(100 * p) + ' %');
        ro.set('n', hit + ' / ' + miss);
        ro.set('avg', Math.round(100 * avg) + ' % (no change: ' + Math.round(100 * sessionAvg(240)) + ' %)');
        ro.set('miss', f1(100 * (1 - avg)) + ' (no change: ' + f1(100 * (1 - sessionAvg(240))) + ')');
        // the scope
        const R0 = Math.max(20, Math.min(Hh * 0.42, Wd * 0.26)), cx = R0 + 24, cy = Hh / 2;
        c.fillStyle = C.dark ? '#0b1a12' : '#e8f3ec'; c.beginPath(); c.arc(cx, cy, R0, 0, 6.283); c.fill();
        c.strokeStyle = C.hue(140, 0.45); c.lineWidth = 1;
        [0.33, 0.66, 1].forEach(f => { c.beginPath(); c.arc(cx, cy, R0 * f, 0, 6.283); c.stroke(); });
        c.beginPath(); c.moveTo(cx - R0, cy); c.lineTo(cx + R0, cy); c.moveTo(cx, cy - R0); c.lineTo(cx, cy + R0); c.stroke();
        const sw = (T * 2 * Math.PI / 1.5) % (2 * Math.PI);
        c.strokeStyle = C.hue(140, 0.9); c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + R0 * Math.cos(sw), cy + R0 * Math.sin(sw)); c.stroke();
        blips.forEach(b => {
          const x = cx + b.r * R0 * Math.cos(b.a), y = cy + b.r * R0 * Math.sin(b.a), age = (T - b.t) / 25;
          c.globalAlpha = clamp(1 - age, 0.15, 1);
          if (b.ok) { kit.dot(c, x, y, 4, C.ok); c.strokeStyle = C.ok; c.beginPath(); c.arc(x, y, 8, 0, 6.283); c.stroke(); }
          else { c.strokeStyle = C.bad; c.lineWidth = 2.2; c.beginPath(); c.moveTo(x - 5, y - 5); c.lineTo(x + 5, y + 5); c.moveTo(x + 5, y - 5); c.lineTo(x - 5, y + 5); c.stroke(); }
          c.globalAlpha = 1;
        });
        // the watch timer and the detection gauge
        const gx = cx + R0 + 40, gw = Math.max(60, Wd - gx - 20);
        kit.label(c, 'Time on this watch', gx, cy - 62, { size: 11.5, color: C.muted, baseline: 'bottom' });
        c.fillStyle = C.surface2; c.fillRect(gx, cy - 56, gw, 14);
        c.fillStyle = C.hue(215, 0.7); c.fillRect(gx, cy - 56, gw * clamp(tw / V.rot, 0, 1), 14);
        kit.label(c, Math.floor(tw) + ' / ' + V.rot + ' min', gx + gw, cy - 60, { size: 11, color: C.muted, align: 'right', baseline: 'bottom' });
        kit.label(c, 'Chance of catching the next target', gx, cy - 8, { size: 11.5, color: C.muted, baseline: 'bottom' });
        c.fillStyle = C.surface2; c.fillRect(gx, cy - 2, gw, 18);
        c.fillStyle = p > 0.85 ? C.ok : p > 0.75 ? C.warn : C.bad; c.fillRect(gx, cy - 2, gw * p, 18);
        kit.label(c, Math.round(100 * p) + ' %', gx + gw * p - 4, cy + 7, { size: 11.5, color: C.bg2, align: 'right', baseline: 'middle', weight: 'bold' });
        kit.label(c, 'caught ' + hit + '   missed ' + miss, gx, cy + 38, { size: 12, color: C.text, baseline: 'middle' });
        kit.label(c, 'green: caught · red ×: missed', gx, cy + 58, { size: 10.5, color: C.muted, baseline: 'middle' });
      }, box.stage);
      updPlot();
      loop.start();
      st.onResize(() => loop.once());
      return onTheme(() => loop.once());
    }
  });

  /* ================================================================ or-work-rest */
  // Energy: aerobic capacity from sex, age (−1 % a year after 25), fitness and body mass (≈ 44 and 36 mL/(kg·min) at 25
  // for average men and women); 20.2 kJ per litre of oxygen; Murrell's rest R = 60 (M − S)/(M − 105) per hour.
  // Heat: NIOSH (2016) REL 56.7 − 11.5 log10 M (acclimatised), RAL 59.9 − 14.1 log10 M, with the hour's time-weighted
  // metabolic rate and WBGT; seated rest at 115 W. Heart rate from %HRR ≈ %VO2R, HRmax = 208 − 0.7 age, resting 70.
  const WR_TASKS = [['Seated light work (≈ 180 W)', 180], ['Moderate: steady arm work, walking (≈ 300 W)', 300], ['High: carrying, shovelling, sawing (≈ 415 W)', 415], ['Very high: fast digging, climbing (≈ 520 W)', 520], ['Bursts of extreme work (≈ 650 W)', 650]];
  const MR = 105, MSEAT = 115;
  const wbgtLim = (M, accl) => accl ? 56.7 - 11.5 * Math.log10(M) : 59.9 - 14.1 * Math.log10(M);
  function workRest(V) {
    const rel = (V.sex === 'm' ? 44 : 36) * (V.age > 25 ? 1 - 0.01 * (V.age - 25) : 1) * V.fit;
    const vo2 = rel * V.mass / 1000, cap = vo2 * 20.2 * 1000 / 60;
    const S = V.rule === 'murrell' ? 350 : cap / 3;
    const rE = V.M > S ? 60 * (V.M - S) / (V.M - MR) : 0, rM = V.M > 350 ? 60 * (V.M - 350) / (V.M - MR) : 0;
    const xE = clamp(1 - rE / 60, 0, 1);
    const g = x => wbgtLim(MSEAT + (V.M - MSEAT) * x, V.accl) - (V.Wr + (V.Ww - V.Wr) * x);
    let xH;
    if (g(1) >= 0) xH = 1; else if (g(0) < 0) xH = 0;
    else { let lo = 0, hi = 1; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (g(m) >= 0) lo = m; else hi = m; } xH = lo; }
    const x = Math.min(xE, xH);
    const hrMax = 208 - 0.7 * V.age, hr = 70 + (hrMax - 70) * clamp((V.M - MR) / Math.max(1, cap - MR), 0, 1);
    return { rel, vo2, cap, S, rE, rM, xE, xH, x, hr, hrMax, share: V.M / cap, lim: wbgtLim(V.M, V.accl), Mbar: MSEAT + (V.M - MSEAT) * x, Wbar: V.Wr + (V.Ww - V.Wr) * x };
  }
  const regimen = x => { const m = x * 60; return m >= 57 ? 'continuous work' : m >= 45 ? '45 min work / 15 min rest' : m >= 30 ? '30 min work / 30 min rest' : m >= 15 ? '15 min work / 45 min rest' : m > 0 ? 'under 15 min of work an hour — change the task' : 'no work: rest in a cooler place'; };

  Hyper.sim('or-work-rest', {
    title: 'How much of each hour can be work?',
    blurb: `A worker, a task and a climate. The ring is one hour: the coloured part is the work that the worker's energy budget and the heat allow, the rest is rest. On energy, Murrell's rest allowance brings the hour's average down to what can be sustained — a third of *this* worker's aerobic capacity, or Murrell's fixed 350 W. On heat, the NIOSH limit falls with the logarithm of the metabolic rate; the hour's average WBGT and metabolic rate must stay under it. The stricter of the two sets the schedule. Aerobic capacity is estimated from average values for the sex, age, fitness and body mass — real people vary widely.

**Try this**
- *Very high* work (520 W): change the worker from a 25-year-old man to a 55-year-old woman — the rest needed climbs from about a quarter to three quarters of the hour. Switch the rule to Murrell's 350 W: the fixed standard hides the difference.
- Moderate work (300 W), WBGT 30 °C at work and at rest: about half an hour of work. Cool the rest area to 25 °C: about 47 min.
- Untick *Acclimatised*: the limit drops by about 3 °C — new workers need a lighter first week.
- Read the heart rate: a sustainable shift keeps it within about 30–40 beats a minute of resting on average.`,
    mount(box, kit, params) {
      const heat = params && params.mode === 'heat';
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 270 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'task', type: 'select', label: 'Task', options: WR_TASKS, value: heat ? 300 : 520 },
        { id: 'M', label: 'Metabolic rate while working', min: 120, max: 700, step: 5, value: heat ? 300 : 520, unit: 'W' },
        { id: 'sex', type: 'select', label: 'Worker', options: [['Man', 'm'], ['Woman', 'f']], value: 'm' },
        { id: 'age', label: 'Age', min: 20, max: 65, step: 1, value: heat ? 40 : 25, unit: 'yr' },
        { id: 'fit', type: 'select', label: 'Fitness', options: [['Low', 0.8], ['Average', 1], ['High', 1.2]], value: 1 },
        { id: 'mass', label: 'Body mass', min: 45, max: 120, step: 1, value: 85, unit: 'kg' },
        { id: 'rule', type: 'select', label: 'Sustainable level', options: [['A third of this worker\'s capacity', 'third'], ['Murrell\'s 350 W for everyone', 'murrell']], value: 'third' },
        { id: 'Ww', label: 'WBGT where they work', min: 15, max: 36, step: 0.5, value: heat ? 30 : 22, unit: '°C' },
        { id: 'Wr', label: 'WBGT where they rest', min: 15, max: 36, step: 0.5, value: heat ? 30 : 22, unit: '°C' },
        { id: 'accl', type: 'check', label: 'Acclimatised to the heat', value: true }
      ], (id, v) => {
        if (id === 'task') ctl.set('M', v);
        if (id === 'sex') ctl.set('mass', v === 'm' ? 85 : 68);
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cap', 'Aerobic capacity (estimate)'], ['share', 'Work as a share of capacity'], ['hr', 'Heart rate while working (estimate)'], ['rE', 'Rest needed for energy'], ['lim', 'WBGT limit for continuous work'], ['xH', 'Work the heat allows'], ['sched', 'Each hour']]);
      const plot = kit.plot(gb, { x: { label: 'metabolic rate, averaged over the hour (W)', min: 100, max: 700 }, y: { label: 'WBGT (°C)', min: 15, max: 40 }, legend: true }, 200);
      function draw() {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H, r = workRest(V);
        ro.set('cap', r.vo2.toFixed(2) + ' L/min (' + Math.round(r.rel) + ' mL/(kg·min)) ≈ ' + Math.round(r.cap) + ' W');
        ro.set('share', Math.round(100 * r.share) + ' %' + (r.share <= 0.34 ? ' — sustainable all shift' : r.share <= 0.5 ? ' — needs rest in every hour' : ' — heavy: long rests or a lighter task'));
        ro.set('hr', Math.round(r.hr) + ' beats/min (max ≈ ' + Math.round(r.hrMax) + ')');
        ro.set('rE', Math.round(r.rE) + ' min per hour' + (V.rule === 'third' ? ' (Murrell\'s 350 W would say ' + Math.round(r.rM) + ')' : ''));
        ro.set('lim', r.lim.toFixed(1) + ' °C (' + (V.accl ? 'NIOSH REL, acclimatised' : 'NIOSH RAL, not acclimatised') + ')');
        ro.set('xH', r.xH >= 0.999 ? 'the whole hour' : r.xH <= 0 ? 'none — even resting here is too hot' : Math.round(60 * r.xH) + ' min per hour');
        ro.set('sched', 'up to ' + Math.round(60 * r.x) + ' min of work: ' + regimen(r.x) + ' (' + (r.xE < r.xH ? 'energy' : r.xH < 1 ? 'heat' : 'neither') + ' limits)');
        c.font = '11px ' + font();
        // the hour ring
        const Rr = Math.max(26, Math.min(Hh * 0.34, Wd * 0.15)), cx = Rr + 22, cy = Hh / 2 + 6;
        c.lineWidth = Math.max(10, Rr * 0.32);
        c.strokeStyle = C.ok; c.beginPath(); c.arc(cx, cy, Rr, 0, 6.283); c.stroke();
        if (r.x > 0) { c.strokeStyle = r.xE < r.xH ? C.accent : C.hue(20, 0.9); c.beginPath(); c.arc(cx, cy, Rr, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * r.x); c.stroke(); }
        for (let m = 0; m < 60; m += 15) { const a = -Math.PI / 2 + m / 60 * 2 * Math.PI; c.strokeStyle = C.bg2; c.lineWidth = 2; c.beginPath(); c.moveTo(cx + (Rr - 8) * Math.cos(a), cy + (Rr - 8) * Math.sin(a)); c.lineTo(cx + (Rr + 8) * Math.cos(a), cy + (Rr + 8) * Math.sin(a)); c.stroke(); }
        kit.label(c, Math.round(60 * r.x) + ' min', cx, cy - 7, { size: 15, color: C.text, align: 'center', baseline: 'middle', weight: 'bold' });
        kit.label(c, 'work', cx, cy + 10, { size: 11, color: C.muted, align: 'center', baseline: 'middle' });
        kit.label(c, 'one hour', cx, 12, { size: 11.5, color: C.muted, align: 'center', baseline: 'middle' });
        // energy bar
        const bx = cx + Rr + 40, bw = Math.max(80, Wd - bx - 24), e1 = Math.max(r.cap, V.M) * 1.08, EX = w => bx + bw * w / e1;
        let y = 30;
        kit.label(c, 'Energy: the task against this worker\'s capacity', bx, y - 6, { size: 11.5, color: C.text, baseline: 'bottom', weight: '600' });
        c.fillStyle = C.surface2; c.fillRect(bx, y, EX(r.cap) - bx, 20); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, y, EX(r.cap) - bx, 20);
        c.fillStyle = r.share <= 0.34 ? C.ok : r.share <= 0.5 ? C.warn : C.bad; c.fillRect(bx, y + 4, EX(V.M) - bx, 12);
        const mark = (w, text, col, below) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(EX(w), y - 3); c.lineTo(EX(w), y + 23); c.stroke(); kit.label(c, text, EX(w), below ? y + 34 : y + 46, { size: 10.5, color: col, align: 'center', baseline: 'middle', bg: C.bg2 }); };
        mark(r.cap / 3, '⅓ capacity ' + Math.round(r.cap / 3) + ' W', C.accent, true);
        mark(350, 'Murrell 350 W', C.muted, false);
        kit.label(c, 'task ' + V.M + ' W · capacity ' + Math.round(r.cap) + ' W', bx, y + 62, { size: 11, color: C.muted, baseline: 'middle' });
        // heat bar
        y = Math.max(y + 96, Hh * 0.56);
        const T0 = 15, T1 = 38, TX = t => bx + bw * (t - T0) / (T1 - T0);
        kit.label(c, 'Heat: WBGT against the limit', bx, y - 6, { size: 11.5, color: C.text, baseline: 'bottom', weight: '600' });
        const grad = c.createLinearGradient ? c.createLinearGradient(bx, 0, bx + bw, 0) : null;
        if (grad && grad.addColorStop) { grad.addColorStop(0, C.hue(200, 0.35)); grad.addColorStop(0.5, C.hue(48, 0.35)); grad.addColorStop(1, C.hue(0, 0.45)); c.fillStyle = grad; } else c.fillStyle = C.surface2;
        c.fillRect(bx, y, bw, 16);
        for (let t = 15; t <= 35; t += 5) kit.label(c, t + '°', TX(t), y + 26, { size: 10, color: C.muted, align: 'center', baseline: 'middle' });
        const tick = (t, text, col, up) => { const xx = TX(clamp(t, T0, T1)); c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(xx, y - 4); c.lineTo(xx, y + 20); c.stroke(); kit.label(c, text, xx, up ? y - 16 : y + 40, { size: 10.5, color: col, align: 'center', baseline: 'middle', bg: C.bg2 }); };
        tick(r.lim, 'limit ' + r.lim.toFixed(1), C.bad, false);
        tick(V.Ww, 'work ' + V.Ww, C.text, true);
        if (Math.abs(V.Wr - V.Ww) >= 1) tick(V.Wr, 'rest ' + V.Wr, C.ok, true);
        plot.set({
          series: [
            { pts: Array.from({ length: 61 }, (_, i) => { const M = 100 + i * 10; return [M, wbgtLim(M, true)]; }), label: 'limit, acclimatised (REL)' },
            { pts: Array.from({ length: 61 }, (_, i) => { const M = 100 + i * 10; return [M, wbgtLim(M, false)]; }), label: 'not acclimatised (RAL)', dash: [5, 4] }
          ],
          marks: [{ x: V.M, y: V.Ww, label: 'working' }, { x: MSEAT, y: V.Wr, label: 'resting' }, { x: r.Mbar, y: r.Wbar, label: 'hour average' }]
        });
      }
      st.onResize(() => draw());
      draw();
      return onTheme(draw);
    }
  });

  /* ================================================================ or-rotation */
  // four stations with illustrative exposures: noise in dB(A), hand-arm vibration in m/s² (trigger time = time at the
  // station) and a 0–10 load score for the back, shoulders and hands (7 or more = high)
  const STATIONS = [
    { id: 'G', name: 'Grinding castings', noise: 95, vib: 4.0, load: [3, 5, 8], hue: 10 },
    { id: 'O', name: 'Overhead bolting', noise: 88, vib: 2.5, load: [3, 8, 7], hue: 40 },
    { id: 'P', name: 'Palletising boxes', noise: 80, vib: 0, load: [8, 4, 3], hue: 200 },
    { id: 'I', name: 'Visual inspection', noise: 76, vib: 0, load: [2, 2, 2], hue: 150 }
  ];
  const REGIONS = ['back', 'shoulders', 'hands'];
  const ROT_PLANS = {
    none: { name: 'No rotation: everyone keeps one station', f: w => w },
    all2: { name: 'Every 2 h through all four stations', f: (w, h) => (w + Math.floor(h / 2)) % 4 },
    all1: { name: 'Every hour through all four stations', f: (w, h) => (w + h) % 4 },
    same: { name: 'Grinding ↔ bolting and palletising ↔ inspection, every 2 h', f: (w, h) => { const alt = Math.floor(h / 2) % 2, s = (w + alt) % 2; return w < 2 ? (s ? 1 : 0) : (s ? 3 : 2); } },
    diff: { name: 'Grinding ↔ inspection and palletising ↔ bolting, every 2 h', f: (w, h) => { const alt = Math.floor(h / 2) % 2, s = (w + alt) % 2; return w < 2 ? (s ? 3 : 0) : (s ? 1 : 2); } }
  };
  function rotation(V) {
    const S = STATIONS.map(s => ({ ...s, load: s.load.slice() }));
    if (V.quiet) { S[0].noise = 87; S[0].vib = 1.5; }
    if (V.lift) S[2].load[0] = 4;
    if (V.balancer) { S[1].load[1] = 5; S[1].load[2] = 5; }
    const W = [0, 1, 2, 3].map(w => {
      const hrs = []; for (let h = 0; h < 8; h++) hrs.push(ROT_PLANS[V.plan].f(w, h));
      const lex = 10 * Math.log10(hrs.reduce((a, i) => a + Math.pow(10, S[i].noise / 10), 0) / 8);
      const a8 = Math.sqrt(hrs.reduce((a, i) => a + S[i].vib * S[i].vib, 0) / 8);
      const avg = [0, 1, 2].map(r => hrs.reduce((a, i) => a + S[i].load[r], 0) / 8);
      const run = [0, 1, 2].map(r => { let best = 0, cur = 0; hrs.forEach(i => { cur = S[i].load[r] >= 7 ? cur + 1 : 0; best = Math.max(best, cur); }); return best; });
      return { hrs, lex, a8, avg, run, grinds: hrs.includes(0) };
    });
    return { S, W };
  }

  Hyper.sim('or-rotation', {
    title: 'Rotating four workers through four stations',
    blurb: `Four workers, four stations and an 8-h day. Each station has a noise level, a hand-arm vibration level and a load score for the back, shoulders and hands (illustrative values; 7 or more is a high load). Choose a rotation plan and read, for every worker, the daily noise exposure $L_{EX,8h}$ (energy-averaged), the vibration exposure A(8) (root-mean-square over 8 h) and the average load on each body region. Then fix the tasks themselves and compare.

**Try this**
- *No rotation*: the grinder carries 95 dB(A) and 4 m/s² all day; the palletiser's back is loaded all day.
- *Every 2 h through all four*: each A(8) falls to about 2.4 m/s², just below the 2.5 action value — but all four workers now exceed 85 dB(A), and four people use the grinder.
- *Grinding ↔ bolting*: both tasks load the hands heavily — read the longest run of high-load hours: 8 h, the same as no rotation.
- *Grinding ↔ inspection*: a pairing that loads different regions — the hands get two hours off in every four.
- *Tool balancer*: lowers the bolting loads on the shoulders and hands.
- Tick *Quieter, low-vibration grinder* and *Lift table at palletising*: fixing the tasks lowers every worker's exposure, whatever the rotation.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'plan', type: 'select', label: 'Rotation plan', options: Object.keys(ROT_PLANS).map(k => [ROT_PLANS[k].name, k]), value: 'all2' },
        { id: 'quiet', type: 'check', label: 'Quieter, low-vibration grinder (87 dB(A), 1.5 m/s²)', value: false },
        { id: 'lift', type: 'check', label: 'Lift table and vacuum lifter at palletising', value: false },
        { id: 'balancer', type: 'check', label: 'Tool balancer and lower bolting height', value: false }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n85', 'Workers above 85 dB(A)'], ['lex', 'Highest noise exposure'], ['n25', 'Workers above 2.5 m/s² A(8)'], ['a8', 'Highest vibration exposure'], ['grind', 'People who use the grinder'], ['load', 'Heaviest average body-region load'], ['run', 'Longest run of high-load hours on one region']]);
      function draw() {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H, R = rotation(V);
        const n85 = R.W.filter(w => Math.round(w.lex * 10) > 850).length, n25 = R.W.filter(w => Math.round(w.a8 * 100) > 250).length;
        let worst = { v: 0 }, runW = { v: 0 };
        R.W.forEach((w, i) => { w.avg.forEach((v, r) => { if (v > worst.v) worst = { v, i, r }; }); w.run.forEach((v, r) => { if (v > runW.v) runW = { v, i, r }; }); });
        ro.set('n85', n85 + ' of 4');
        ro.set('lex', Math.max(...R.W.map(w => w.lex)).toFixed(1) + ' dB(A)');
        ro.set('n25', n25 + ' of 4');
        ro.set('a8', Math.max(...R.W.map(w => w.a8)).toFixed(2) + ' m/s²');
        ro.set('grind', String(R.W.filter(w => w.grinds).length));
        ro.set('load', f1(worst.v) + ' / 10 — worker ' + (worst.i + 1) + ', ' + REGIONS[worst.r]);
        ro.set('run', runW.v ? runW.v + ' h — worker ' + (runW.i + 1) + ', ' + REGIONS[runW.r] : 'none');
        c.font = '11px ' + font();
        // station cards
        const pad = 10, cw = (Wd - 2 * pad - 3 * 8) / 4, ch = Math.min(112, Hh * 0.27);
        R.S.forEach((s, i) => {
          const x = pad + i * (cw + 8), y = 6;
          c.fillStyle = C.surface2; rr(c, x, y, cw, ch, 6); c.fill();
          c.fillStyle = C.hue(s.hue, 0.85); rr(c, x, y, cw, 20, 6); c.fill(); c.fillRect(x, y + 12, cw, 8);
          kit.label(c, s.id + ' · ' + s.name, x + 6, y + 10, { size: 11, color: C.bg2, baseline: 'middle', weight: 'bold' });
          kit.label(c, s.noise + ' dB(A) · ' + s.vib.toFixed(1) + ' m/s²', x + 6, y + 32, { size: 10.5, color: C.text, baseline: 'middle' });
          REGIONS.forEach((reg, r) => {
            const yy = y + 48 + r * Math.min(18, (ch - 54) / 3), bw = cw - 70, v = s.load[r];
            kit.label(c, reg, x + 6, yy, { size: 10, color: C.muted, baseline: 'middle' });
            c.fillStyle = C.bg2; c.fillRect(x + 62, yy - 4, bw, 8);
            c.fillStyle = v >= 7 ? C.bad : v >= 5 ? C.warn : C.ok; c.fillRect(x + 62, yy - 4, bw * v / 10, 8);
          });
        });
        // schedule grid and per-worker results
        const gy = ch + 34, rowH = Math.max(34, Math.min(64, (Hh - gy - 10) / 4)), lx = pad + 58, cellW = Math.max(14, Math.min(34, (Wd * 0.46 - lx) / 8));
        const rx = lx + 8 * cellW + 18, rw = Wd - rx - pad;
        for (let h = 0; h < 8; h++) kit.label(c, String(8 + h).padStart(2, '0'), lx + h * cellW + cellW / 2, gy - 10, { size: 10, color: C.muted, align: 'center', baseline: 'middle' });
        kit.label(c, 'noise LEX,8h', rx, gy - 10, { size: 10.5, color: C.muted, baseline: 'middle' });
        kit.label(c, 'A(8)', rx + rw * 0.45, gy - 10, { size: 10.5, color: C.muted, baseline: 'middle' });
        kit.label(c, 'back · shoulders · hands', rx + rw * 0.7, gy - 10, { size: 10.5, color: C.muted, baseline: 'middle' });
        R.W.forEach((w, i) => {
          const y = gy + i * rowH, cy = y + rowH / 2;
          kit.label(c, 'Worker ' + (i + 1), pad, cy, { size: 11, color: C.text, baseline: 'middle' });
          w.hrs.forEach((s, h) => { c.fillStyle = C.hue(R.S[s].hue, 0.8); c.fillRect(lx + h * cellW + 1, y + 4, cellW - 2, rowH - 8); kit.label(c, R.S[s].id, lx + h * cellW + cellW / 2, cy, { size: 11, color: C.bg2, align: 'center', baseline: 'middle', weight: 'bold' }); });
          // noise bar: 70–100 dB(A)
          const nb = rw * 0.4, NX = L => rx + nb * clamp((L - 70) / 30, 0, 1);
          c.fillStyle = C.surface2; c.fillRect(rx, cy - 7, nb, 14);
          c.fillStyle = w.lex > 87 ? C.bad : w.lex > 85 ? C.hue(20, 0.9) : w.lex > 80 ? C.warn : C.ok; c.fillRect(rx, cy - 7, NX(w.lex) - rx, 14);
          [80, 85, 87].forEach(L => { c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(NX(L), cy - 10); c.lineTo(NX(L), cy + 10); c.stroke(); });
          kit.label(c, w.lex.toFixed(1), rx + nb + 3, cy, { size: 10.5, color: C.text, baseline: 'middle' });
          // vibration bar: 0–5 m/s²
          const vx = rx + rw * 0.45, vb = rw * 0.18, AX = a => vx + vb * clamp(a / 5, 0, 1);
          c.fillStyle = C.surface2; c.fillRect(vx, cy - 7, vb, 14);
          c.fillStyle = w.a8 > 5 ? C.bad : w.a8 > 2.5 ? C.hue(20, 0.9) : C.ok; c.fillRect(vx, cy - 7, AX(w.a8) - vx, 14);
          c.strokeStyle = C.text; c.beginPath(); c.moveTo(AX(2.5), cy - 10); c.lineTo(AX(2.5), cy + 10); c.stroke();
          kit.label(c, w.a8.toFixed(1), vx + vb + 3, cy, { size: 10.5, color: C.text, baseline: 'middle' });
          // region averages
          const sx = rx + rw * 0.7, sw = Math.max(16, Math.min(34, (rw * 0.3 - 8) / 3));
          w.avg.forEach((v, r) => { c.fillStyle = v >= 6 ? C.bad : v >= 4.5 ? C.warn : C.ok; rr(c, sx + r * (sw + 3), cy - 10, sw, 20, 4); c.fill(); kit.label(c, f1(v), sx + r * (sw + 3) + sw / 2, cy, { size: 10, color: C.bg2, align: 'center', baseline: 'middle', weight: 'bold' }); });
        });
        kit.label(c, 'noise marks: 80 · 85 · 87 dB(A)   vibration mark: 2.5 m/s²', pad, Hh - 8, { size: 10, color: C.muted, baseline: 'middle' });
      }
      st.onResize(() => draw());
      draw();
      return onTheme(draw);
    }
  });

  /* ================================================================ or-job-strain */
  // scores from 1 to 10, the middle at 5.5; the job presets are illustrative, not survey results
  const JOBS = {
    call: { name: 'Call-centre agent: scripted and monitored', D: 8, C: 2.5, S: 4, E: 8, R: 4 },
    line: { name: 'Machine-paced assembly line', D: 7, C: 2, S: 5, E: 7, R: 4.5 },
    nurse: { name: 'Nurse on a short-staffed ward', D: 9, C: 5, S: 4.5, E: 9, R: 5 },
    engineer: { name: 'Design engineer', D: 7, C: 8, S: 6.5, E: 7, R: 7.5 },
    guard: { name: 'Security guard on a quiet night', D: 2.5, C: 3, S: 3, E: 3, R: 3.5 },
    soldier: { name: 'Soldier on a long patrol in a close unit', D: 8.5, C: 5.5, S: 8.5, E: 9, R: 6.5 },
    farmer: { name: 'Farmer working alone', D: 7, C: 8.5, S: 3, E: 8, R: 5 }
  };
  const quadrant = (D, Cn) => D >= 5.5 ? (Cn >= 5.5 ? 'active' : 'high strain') : (Cn >= 5.5 ? 'low strain' : 'passive');

  Hyper.sim('or-job-strain', {
    title: 'Demands, control, support — effort and reward',
    blurb: `Two models of work stress side by side. Left, Karasek's plane: demands up, control to the right. High demands with little control is **high strain**; the same demands with plenty of control is **active** work, where people learn. The dot's size shows support from colleagues and supervisors; a red dashed ring marks high strain with little support ("iso-strain"). Right, Siegrist's balance: effort on one pan, rewards — pay, recognition, security, prospects — on the other. The jobs and their scores are illustrative.

**Try this**
- *Call-centre agent*: high strain and effort outweighing reward. Press *More control* twice — the dot moves to *active* without any cut in workload.
- *Machine-paced line*: compare *Fewer demands* with *More control* — both leave high strain, but by different routes.
- *Nurse on a short-staffed ward*: add support and reward; watch the ring and the balance.
- *Security guard on a quiet night*: low strain is not the goal — *passive* jobs bring boredom and lost skills. What would enrich it?
- *Soldier on a long patrol*: very high demands, but support from a close unit — the iso-strain ring does not appear.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      let trail = [];
      const ctl = kit.controls(box.side, [
        { id: 'job', type: 'select', label: 'Job', options: Object.keys(JOBS).map(k => [JOBS[k].name, k]), value: 'call' },
        { id: 'D', label: 'Demands (workload, time pressure)', min: 1, max: 10, step: 0.5, value: JOBS.call.D },
        { id: 'C', label: 'Control (over pace, methods, schedule)', min: 1, max: 10, step: 0.5, value: JOBS.call.C },
        { id: 'S', label: 'Support (colleagues, supervisors)', min: 1, max: 10, step: 0.5, value: JOBS.call.S },
        { id: 'E', label: 'Effort', min: 1, max: 10, step: 0.5, value: JOBS.call.E },
        { id: 'R', label: 'Reward (pay, recognition, security, prospects)', min: 1, max: 10, step: 0.5, value: JOBS.call.R },
        { type: 'buttons', items: [{ id: 'moreC', label: 'More control' }, { id: 'lessD', label: 'Fewer demands' }, { id: 'moreS', label: 'More support' }, { id: 'moreR', label: 'More reward' }] }
      ], (id, v) => {
        const bump = (k, dv) => { trail.push([V.C, V.D]); if (trail.length > 6) trail.shift(); ctl.set(k, clamp(V[k] + dv, 1, 10)); };
        if (id === 'job') { const j = JOBS[v]; ['D', 'C', 'S', 'E', 'R'].forEach(k => ctl.set(k, j[k])); trail = []; }
        if (id === 'moreC') bump('C', 2);
        if (id === 'lessD') { bump('D', -2); ctl.set('E', clamp(V.E - 1, 1, 10)); }
        if (id === 'moreS') { trail.push([V.C, V.D]); ctl.set('S', clamp(V.S + 2, 1, 10)); }
        if (id === 'moreR') ctl.set('R', clamp(V.R + 2, 1, 10));
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['q', 'Quadrant'], ['dc', 'Demands ÷ control'], ['s', 'Support'], ['eri', 'Effort–reward ratio'], ['try', 'What to try']]);
      function draw() {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H;
        const q = quadrant(V.D, V.C), iso = q === 'high strain' && V.S < 5.5, eri = V.E / V.R;
        ro.set('q', q + (iso ? ', with little support (iso-strain)' : ''));
        ro.set('dc', (V.D / V.C).toFixed(2));
        ro.set('s', V.S >= 5.5 ? 'good (' + V.S + ')' : 'low (' + V.S + ')');
        ro.set('eri', eri.toFixed(2) + (eri > 1 ? ' — effort outweighs reward' : ' — balanced'));
        const tips = [];
        if (q === 'high strain') tips.push('more control (buffers, a say over pace and methods) or fewer demands');
        if (iso || (q !== 'low strain' && V.S < 5.5)) tips.push('more support');
        if (eri > 1) tips.push('more reward: recognition, fair pay, security, prospects');
        if (q === 'passive') tips.push('enrich the job: variety, decisions, learning');
        ro.set('try', tips.length ? tips.join('; ') : 'keep it: demanding enough, with control, support and reward');
        c.font = '11px ' + font();
        // Karasek's plane
        const s = Math.max(120, Math.min(Hh - 44, Wd * 0.52)), px0 = 44, py0 = 12, X = v => px0 + (v - 1) / 9 * s, Y = v => py0 + s - (v - 1) / 9 * s;
        const quad = (x0, y0, x1, y1, col, text) => { c.fillStyle = col; c.fillRect(X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1)); kit.label(c, text, (X(x0) + X(x1)) / 2, (Y(y0) + Y(y1)) / 2, { size: 12, color: C.muted, align: 'center', baseline: 'middle', weight: '600' }); };
        quad(1, 5.5, 5.5, 10, C.hue(0, 0.14), 'HIGH STRAIN');
        quad(5.5, 5.5, 10, 10, C.hue(215, 0.12), 'ACTIVE');
        quad(1, 1, 5.5, 5.5, C.hue(260, 0.08), 'PASSIVE');
        quad(5.5, 1, 10, 5.5, C.hue(140, 0.12), 'LOW STRAIN');
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(X(1), Y(10), s, s);
        kit.arrow(c, X(8.6), Y(2.4), X(2.6), Y(8.4), C.hue(0, 0.35), 2);
        kit.label(c, 'risk of strain', X(4.2), Y(6.3), { size: 10.5, color: C.bad, align: 'center', baseline: 'middle', bg: C.bg2 });
        kit.arrow(c, X(2.4), Y(2.4), X(8.4), Y(8.4), C.hue(215, 0.35), 2);
        kit.label(c, 'learning, motivation', X(7.1), Y(6.3), { size: 10.5, color: C.accent, align: 'center', baseline: 'middle', bg: C.bg2 });
        kit.label(c, 'control →', X(10), py0 + s + 14, { size: 11, color: C.muted, align: 'right', baseline: 'middle' });
        c.save(); c.translate(px0 - 16, Y(10)); c.rotate(-Math.PI / 2); kit.label(c, '← demands', 0, 0, { size: 11, color: C.muted, align: 'right', baseline: 'middle' }); c.restore();
        // the trail and the job
        trail.forEach((p, i) => { c.globalAlpha = 0.25 + 0.5 * i / Math.max(1, trail.length); kit.dot(c, X(p[0]), Y(p[1]), 4, C.muted); c.globalAlpha = 1; });
        if (trail.length) { const p = trail[trail.length - 1]; kit.arrow(c, X(p[0]), Y(p[1]), X(V.C), Y(V.D), C.muted, 1.5); }
        const rad = 5 + V.S * 1.3, col = q === 'high strain' ? C.bad : q === 'active' ? C.accent : q === 'passive' ? C.hue(260, 0.9) : C.ok;
        kit.dot(c, X(V.C), Y(V.D), rad, col);
        if (iso) { c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.lineWidth = 2; c.beginPath(); c.arc(X(V.C), Y(V.D), rad + 6, 0, 6.283); c.stroke(); c.setLineDash([]); }
        // Siegrist's balance
        const bx0 = px0 + s + 30, bw = Wd - bx0 - 16;
        if (bw > 80) {
          const cx = bx0 + bw / 2, cy = Hh * 0.52, L = Math.min(bw * 0.42, 150), th = clamp(Math.atan((V.E - V.R) / 8), -0.35, 0.35);
          kit.label(c, 'Effort and reward', cx, 16, { size: 12, color: C.text, align: 'center', baseline: 'middle', weight: '600' });
          c.fillStyle = C.muted; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - 14, cy + 26); c.lineTo(cx + 14, cy + 26); c.closePath(); c.fill();
          const lx = cx - L * Math.cos(th), ly = cy + L * Math.sin(th), rx2 = cx + L * Math.cos(th), ry = cy - L * Math.sin(th);
          c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(lx, ly); c.lineTo(rx2, ry); c.stroke();
          const pan = (x, y, n, colr, text) => {
            c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 22, y + 30); c.moveTo(x, y); c.lineTo(x + 22, y + 30); c.stroke();
            c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 28, y + 30); c.lineTo(x + 28, y + 30); c.stroke();
            const k = Math.round(n);
            for (let i = 0; i < k; i++) { c.fillStyle = colr; c.fillRect(x - 20 + (i % 4) * 10.5, y + 20 - Math.floor(i / 4) * 9, 9, 8); }
            kit.label(c, text + ' ' + n, x, y + 46, { size: 11.5, color: colr, align: 'center', baseline: 'middle', weight: '600' });
          };
          pan(lx, ly, V.E, C.hue(20, 0.9), 'effort');
          pan(rx2, ry, V.R, C.ok, 'reward');
          kit.label(c, 'ratio ' + eri.toFixed(2) + (eri > 1 ? ' — imbalance' : ''), cx, cy + 82, { size: 12, color: eri > 1 ? C.bad : C.ok, align: 'center', baseline: 'middle', weight: 'bold' });
        }
      }
      st.onResize(() => draw());
      draw();
      return onTheme(draw);
    }
  });

  /* ================================================================ or-participation */
  // an invented work cell and its problems; each role's chance of noticing each problem is illustrative
  const ROLES = [
    ['small', 'Operator, day shift — small (5th-percentile woman)'],
    ['tall', 'Operator, day shift — tall (95th-percentile man)'],
    ['night', 'Operator, night shift'],
    ['maint', 'Maintenance technician'],
    ['clean', 'Cleaner'],
    ['lead', 'Team leader'],
    ['eng', 'Process engineer'],
    ['ergo', 'Ergonomist'],
    ['mgr', 'Manager (from the office)']
  ];
  const PROBLEMS = [
    { t: 'Top shelf of parts out of reach', x: 0.88, y: 0.32, p: { small: 0.8, ergo: 0.5, tall: 0.05 } },
    { t: 'Knees hit the underside of the bench', x: 0.52, y: 0.55, p: { tall: 0.8, ergo: 0.4 } },
    { t: 'Afternoon glare from the skylight on the screen', x: 0.66, y: 0.22, p: { small: 0.4, tall: 0.4, lead: 0.3, ergo: 0.3 } },
    { t: 'Lights dimmed at night to save energy', x: 0.36, y: 0.2, p: { night: 0.8, clean: 0.2 } },
    { t: 'Guard must be removed to clear jams', x: 0.16, y: 0.38, p: { small: 0.5, tall: 0.5, night: 0.5, maint: 0.6, eng: 0.2 } },
    { t: 'Filter change needs a ladder behind the machine', x: 0.06, y: 0.2, p: { maint: 0.8 } },
    { t: 'Grease points under the conveyor out of reach', x: 0.5, y: 0.08, p: { maint: 0.6, clean: 0.3 } },
    { t: 'Wet floor by the washer; cleaning during the shift', x: 0.86, y: 0.84, p: { clean: 0.8, night: 0.3 } },
    { t: 'Parts bin behind the operator: a 90° twist', x: 0.44, y: 0.68, p: { small: 0.5, tall: 0.5, night: 0.5, ergo: 0.7, eng: 0.2 } },
    { t: 'Torque tool jolts the wrist', x: 0.6, y: 0.44, p: { small: 0.6, tall: 0.4, night: 0.5, ergo: 0.3 } },
    { t: 'Compressor noise masks the line-stop alarm', x: 0.08, y: 0.84, p: { night: 0.6, small: 0.3, tall: 0.3, maint: 0.3, ergo: 0.3 } },
    { t: 'Confusing label-printer menu: wrong labels', x: 0.74, y: 0.52, p: { small: 0.4, tall: 0.4, night: 0.4, lead: 0.5, eng: 0.2, mgr: 0.1 } },
    { t: 'Cycle time too tight when variants mix', x: 0.32, y: 0.48, p: { small: 0.5, tall: 0.5, night: 0.5, lead: 0.6, eng: 0.3, mgr: 0.15 } },
    { t: 'Pallets left on the wrong side at night', x: 0.36, y: 0.86, p: { night: 0.7, lead: 0.2 } },
    { t: 'Emergency stop hidden when the door is open', x: 0.22, y: 0.62, p: { maint: 0.4, ergo: 0.3, eng: 0.2, small: 0.2, tall: 0.2 } },
    { t: 'Nobody knows where to report near misses', x: 0.62, y: 0.9, p: { small: 0.3, tall: 0.3, night: 0.4, clean: 0.3, lead: 0.2, mgr: 0.1 } }
  ];

  Hyper.sim('or-participation', {
    title: 'Who finds the problems in a work cell?',
    blurb: `A work cell with sixteen problems, seen from above. Each kind of person notices some of them with some chance — the small operator meets the high shelf, the night shift the dim lights, the maintenance technician the filter behind the machine, the cleaner the wet floor. Pick the team for a redesign workshop: the shade of each marker is the chance that someone in the team finds that problem, and a dashed red ring marks problems nobody in the team ever meets. *Hold a workshop* draws one possible outcome. The graph compares the team with the classic usability curve $1 - (1 - 0.31)^n$ for testers who all meet every problem. The cell, the problems and the chances are invented for the exercise.

**Try this**
- Start with the manager and the process engineer: most markers are ringed red — no number of office visits will find them.
- Add the small operator and the night-shift operator: whole groups of problems appear.
- Add the maintenance technician and the cleaner: the problems of servicing and cleaning are theirs.
- Compare a team of four well-chosen people with nine: the right mix beats the head count.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      let drawn = null, seed = 5;
      const ctl = kit.controls(box.side, ROLES.map(([id, label]) => ({ id, type: 'check', label, value: id === 'eng' || id === 'mgr' })).concat([
        { type: 'buttons', items: [{ id: 'run', label: 'Hold a workshop', primary: true }, { id: 'clear', label: 'Show chances' }] }
      ]), id => {
        if (id === 'run') { const r = rng(seed++ * 7919); drawn = PROBLEMS.map(pb => ROLES.some(([k]) => V[k] && r() < (pb.p[k] || 0))); }
        else if (id === 'clear') drawn = null;
        else drawn = null;
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['team', 'Team size'], ['exp', 'Expected share of problems found'], ['none', 'Problems nobody in the team meets'], ['found', 'Found in this workshop'], ['ref', 'Testers who meet every problem (p = 31 %)']]);
      const plot = kit.plot(gb, { x: { label: 'people taking part', min: 0, max: 10 }, y: { label: 'problems found (%)', min: 0, max: 100 }, legend: true }, 170);
      function draw() {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H;
        const team = ROLES.filter(([k]) => V[k]).map(([k]) => k), n = team.length;
        const q = PROBLEMS.map(pb => 1 - team.reduce((a, k) => a * (1 - (pb.p[k] || 0)), 1));
        const exp = q.reduce((a, b) => a + b, 0) / q.length, none = q.filter(v => v <= 0).length;
        ro.set('team', n + (n ? '' : ' — tick some people'));
        ro.set('exp', Math.round(100 * exp) + ' %');
        ro.set('none', none + ' of ' + PROBLEMS.length);
        ro.set('found', drawn ? drawn.filter(Boolean).length + ' of ' + PROBLEMS.length : 'press Hold a workshop');
        ro.set('ref', Math.round(100 * (1 - Math.pow(0.69, n))) + ' % for ' + n);
        const ref = []; for (let k = 0; k <= 10; k++) ref.push([k, 100 * (1 - Math.pow(0.69, k))]);
        plot.set({ series: [{ pts: ref, label: 'testers who meet every problem', dash: [5, 4] }], marks: [{ x: n, y: 100 * exp, label: 'this team ' + Math.round(100 * exp) + ' %' }] });
        c.font = '11px ' + font();
        // the cell, seen from above
        const cw = Math.min(Wd * 0.56, (Hh - 20) * 1.25), chh = cw * 0.8, x0 = 10, y0 = 10, X = u => x0 + u * cw, Y = v => y0 + v * chh;
        c.fillStyle = C.surface2; c.fillRect(x0, y0, cw, chh); c.strokeStyle = C.text; c.lineWidth = 3; c.strokeRect(x0, y0, cw, chh);
        c.fillStyle = C.bg2; c.fillRect(X(0.44), y0 + chh - 2, cw * 0.12, 5); kit.label(c, 'door', X(0.5), y0 + chh - 8, { size: 9.5, color: C.muted, align: 'center', baseline: 'middle' });
        const part = (u, v, w, h, text, hue) => { c.fillStyle = C.hue(hue, 0.28); c.strokeStyle = C.hue(hue, 0.9); c.lineWidth = 1.2; c.fillRect(X(u), Y(v), w * cw, h * chh); c.strokeRect(X(u), Y(v), w * cw, h * chh); kit.label(c, text, X(u + w / 2), Y(v + h / 2), { size: 9.5, color: C.muted, align: 'center', baseline: 'middle' }); };
        part(0.2, 0.03, 0.6, 0.1, 'conveyor', 40);
        part(0.03, 0.26, 0.2, 0.26, 'machine + guard', 10);
        part(0.36, 0.38, 0.34, 0.14, 'workbench', 200);
        part(0.82, 0.18, 0.13, 0.36, 'shelving', 150);
        part(0.76, 0.72, 0.2, 0.16, 'washer', 190);
        part(0.03, 0.74, 0.13, 0.18, 'compressor', 0);
        part(0.24, 0.74, 0.22, 0.16, 'pallets', 30);
        c.setLineDash([4, 4]); c.strokeStyle = C.hue(48, 0.9); c.strokeRect(X(0.56), Y(0.16), cw * 0.2, chh * 0.12); c.setLineDash([]);
        kit.label(c, 'skylight', X(0.66), Y(0.12), { size: 9.5, color: C.muted, align: 'center', baseline: 'middle' });
        // the problems
        PROBLEMS.forEach((pb, i) => {
          const x = X(pb.x), y = Y(pb.y), r = Math.max(8, Math.min(12, cw / 34));
          if (drawn) { c.fillStyle = drawn[i] ? C.ok : C.bg2; }
          else { c.fillStyle = q[i] > 0 ? C.hue(215, 0.15 + 0.8 * q[i]) : C.bg2; }
          c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill();
          c.strokeStyle = q[i] > 0 ? C.accent : C.bad; c.lineWidth = 1.5; if (q[i] <= 0) c.setLineDash([3, 2]);
          c.beginPath(); c.arc(x, y, r, 0, 6.283); c.stroke(); c.setLineDash([]);
          kit.label(c, String(i + 1), x, y, { size: 10, color: drawn ? (drawn[i] ? C.bg2 : C.muted) : q[i] > 0.5 ? C.bg2 : C.text, align: 'center', baseline: 'middle', weight: 'bold' });
        });
        // the list
        const lx = x0 + cw + 14, lw = Wd - lx - 6;
        if (lw > 90) {
          const lh = Math.min(19, (Hh - 20) / PROBLEMS.length), fs = Math.max(8.5, Math.min(11, lh * 0.62));
          PROBLEMS.forEach((pb, i) => {
            const y = 14 + i * lh, ok = drawn ? drawn[i] : null, col = q[i] <= 0 ? C.bad : ok === true ? C.ok : ok === false ? C.muted : C.text;
            const tag = q[i] <= 0 ? 'nobody meets it' : drawn ? (ok ? 'found' : 'missed') : Math.round(100 * q[i]) + ' %';
            let text = (i + 1) + '. ' + pb.t;
            const maxW = lw - 70; while (c.measureText(text).width > maxW && text.length > 8) text = text.slice(0, -2);
            if (text !== (i + 1) + '. ' + pb.t) text += '…';
            kit.label(c, text, lx, y, { size: fs, color: col, baseline: 'middle' });
            kit.label(c, tag, Wd - 8, y, { size: fs, color: col, align: 'right', baseline: 'middle', weight: '600' });
          });
        }
      }
      st.onResize(() => draw());
      draw();
      return onTheme(draw);
    }
  });

  /* ================================================================ or-ageing */
  // Near vision: Hofstetter (1950), average amplitude 18.5 − 0.3 age, least 15 − 0.25 age (dioptres), levelling off
  // near 0.75 D. Light at the retina: a smooth curve through about a third at 60 against 20 (Weale). Hearing: median
  // threshold shift α (age − 18)² dB, ISO 7029:2000 coefficients. Grip strength: about 24 % below peak at 65 (British
  // norms, Dodds et al. 2014); aerobic capacity about −10 % a decade after 25. Averages only — people vary widely.
  const ISO7029 = { f: [125, 250, 500, 1000, 1500, 2000, 3000, 4000, 6000, 8000], m: [0.003, 0.003, 0.0035, 0.004, 0.0055, 0.007, 0.0115, 0.016, 0.018, 0.022], w: [0.003, 0.003, 0.0035, 0.004, 0.005, 0.006, 0.0075, 0.009, 0.012, 0.015] };
  const shift7029 = (sex, age, i) => (sex === 'm' ? ISO7029.m : ISO7029.w)[i] * Math.pow(Math.max(0, age - 18), 2);
  const ampAcc = (age, least) => Math.max(0.75, least ? 15 - 0.25 * age : 18.5 - 0.3 * age);
  const retina = age => age <= 20 ? 1 : Math.exp(-Math.log(3) * (age - 20) / 40);
  const gripRel = age => age <= 35 ? 1 : clamp(1 - 0.005 * (age - 35) - 0.0001 * Math.pow(age - 35, 2), 0.4, 1);
  const aeroRel = age => age <= 25 ? 1 : clamp(1 - 0.01 * (age - 25), 0.3, 1);

  Hyper.sim('or-ageing', {
    title: 'The ageing worker: eyes, ears and strength',
    blurb: `A worker reads a label at a bench while an alarm sounds. Move the age: the eye's focusing power shrinks (Hofstetter's formulas), so the band of sharp vision — green on the sight line — slides away from the label; less light reaches the retina (about a third at 60 against 20); high tones fade (median values of ISO 7029:2000, shown below as the loss from age 18); grip strength and aerobic capacity fall. Then answer with design: reading glasses, more light, a lower-pitched alarm. These are averages — people of the same age differ widely.

**Try this**
- Age 45, label at 400 mm: sharp, at the limit of comfort (half the focusing power). Tick *Least able for this age*: now it is tiring; move to 52 and it blurs.
- Age 55: add +1.5 D reading glasses. The label is sharp — but a screen at 800 mm is now out of range: the reason for screen glasses and lower screens with progressive lenses.
- Age 60 at 500 lx: read how much light is needed to see as well as at 20 — then raise the illuminance (with glare controlled).
- Set the alarm to 4 kHz and the age to 65: compare the loss at 4 kHz with 1 kHz. Move the alarm down to 1 kHz.
- Compare a man and a woman of 60: in the medians of ISO 7029, men lose more at high frequencies.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 20, max: 70, step: 1, value: 45, unit: 'yr' },
        { id: 'sex', type: 'select', label: 'Worker', options: [['Man', 'm'], ['Woman', 'f']], value: 'm' },
        { id: 'least', type: 'check', label: 'Least able for this age (not the average)', value: false },
        { id: 'D', label: 'Distance to the label', min: 250, max: 1200, step: 10, value: 400, unit: 'mm' },
        { id: 'add', label: 'Reading glasses', min: 0, max: 3, step: 0.25, value: 0, fmt: v => v ? '+' + v.toFixed(2) + ' D' : 'none' },
        { id: 'lux', label: 'Illuminance on the label', min: 100, max: 1500, step: 25, value: 500, unit: 'lx' },
        { id: 'fq', type: 'select', label: 'Alarm frequency', options: [['500 Hz', 500], ['1 kHz', 1000], ['2 kHz', 2000], ['3 kHz', 3000], ['4 kHz', 4000], ['6 kHz', 6000], ['8 kHz', 8000]], value: 4000 }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['amp', 'Focusing power'], ['range', 'Sharp from'], ['task', 'The label'], ['light', 'Light reaching the retina'], ['need', 'To see as at 20 under 500 lx'], ['hear', 'Median hearing loss since 18'], ['body', 'Grip strength · aerobic capacity']]);
      const plot = kit.plot(gb, { x: { label: 'frequency (Hz)', min: 125, max: 8000, log: true }, y: { label: 'hearing loss since age 18 (dB)', min: 0, max: 80, reverse: true }, legend: true }, 180);
      function draw() {
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H;
        const A = ampAcc(V.age, V.least), near = 1000 / (A + V.add), far = V.add > 0 ? 1000 / V.add : Infinity;
        const need = 1000 / V.D - V.add, inFocus = V.D >= near - 1e-9 && V.D <= far + 1e-9, comfy = need <= A / 2;
        const err = V.D < near ? 1000 / V.D - (A + V.add) : V.D > far ? V.add - 1000 / V.D : 0;
        const f = retina(V.age), fi = ISO7029.f.indexOf(+V.fq), fiSafe = fi < 0 ? 7 : fi;
        const lossF = shift7029(V.sex, V.age, fiSafe), loss4 = shift7029(V.sex, V.age, 7), loss1 = shift7029(V.sex, V.age, 3);
        ro.set('amp', A.toFixed(2) + ' D (' + (V.least ? 'least able' : 'average') + ' at ' + V.age + ')' + (V.add ? ' + ' + V.add.toFixed(2) + ' D glasses' : ''));
        ro.set('range', Math.round(near) + ' mm to ' + (Number.isFinite(far) ? Math.round(far) + ' mm' : 'far away'));
        ro.set('task', !inFocus ? (V.D < near ? 'blurred — closer than the near point' : 'blurred — beyond the glasses\' far limit') : comfy || need <= 0 ? 'sharp and comfortable' : 'sharp, but tiring — uses ' + Math.round(100 * need / A) + ' % of the focusing power');
        ro.set('light', Math.round(100 * f) + ' % of a 20-year-old\'s — ' + V.lux + ' lx looks like ' + Math.round(V.lux * f) + ' lx at 20');
        ro.set('need', Math.round(500 / f) + ' lx (glare controlled)');
        ro.set('hear', f1(loss1) + ' dB at 1 kHz · ' + f1(loss4) + ' dB at 4 kHz · ' + f1(lossF) + ' dB at the alarm');
        ro.set('body', Math.round(100 * gripRel(V.age)) + ' % of peak · ' + Math.round(100 * aeroRel(V.age)) + ' % of the value at 25');
        c.font = '11px ' + font();
        // side view: the eye, the sight line, the sharp band and the label
        const vx0 = 16, vw = Wd * 0.6, sx = 1300, Xm = mm => vx0 + 40 + mm / sx * (vw - 60), ey = Hh * 0.5;
        const headR = Math.max(16, Math.min(30, Hh * 0.09));
        c.fillStyle = V.sex === 'm' ? C.hue(215, 0.85) : C.hue(330, 0.85);
        c.beginPath(); c.arc(Xm(0) - headR * 0.6, ey, headR, 0, 6.283); c.fill();
        kit.dot(c, Xm(0), ey, 3.5, C.bg2);
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.lineWidth = 1; c.beginPath(); c.moveTo(Xm(0), ey); c.lineTo(Xm(sx), ey); c.stroke(); c.setLineDash([]);
        const a = clamp(near, 0, sx), b = clamp(Number.isFinite(far) ? far : sx, 0, sx);
        if (b > a) { c.fillStyle = C.hue(140, 0.35); c.fillRect(Xm(a), ey - 9, Xm(b) - Xm(a), 18); }
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(Xm(a), ey - 13); c.lineTo(Xm(a), ey + 13); c.stroke();
        kit.label(c, 'near point ' + Math.round(near) + ' mm', Xm(a), ey + 24, { size: 10.5, color: C.ok, align: 'center', baseline: 'middle', bg: C.bg2 });
        if (Number.isFinite(far) && far <= sx) { c.beginPath(); c.moveTo(Xm(b), ey - 13); c.lineTo(Xm(b), ey + 13); c.stroke(); kit.label(c, 'far limit ' + Math.round(far), Xm(b), ey + 40, { size: 10.5, color: C.ok, align: 'center', baseline: 'middle', bg: C.bg2 }); }
        for (let mm = 0; mm <= 1200; mm += 200) kit.label(c, String(mm), Xm(mm), Hh - 10, { size: 9.5, color: C.muted, align: 'center', baseline: 'middle' });
        kit.label(c, 'mm from the eye', Xm(sx), Hh - 10, { size: 9.5, color: C.muted, align: 'right', baseline: 'middle' });
        // the lamp and the label
        const lx = Xm(V.D), lh = Math.max(40, Hh * 0.32), bright = clamp(V.lux * f / 500, 0.1, 1.6);
        c.strokeStyle = C.hue(48, clamp(0.2 + 0.5 * V.lux / 1500, 0.2, 0.7)); c.lineWidth = 1;
        for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(lx, 14); c.lineTo(lx + k * 12, ey - lh / 2 - 4); c.stroke(); }
        c.fillStyle = C.hue(48, 0.95); c.beginPath(); c.arc(lx, 12, 7, Math.PI, 0); c.fill();
        c.fillStyle = C.dark ? 'rgba(255,255,255,' + clamp(0.08 + 0.35 * bright, 0.08, 0.6).toFixed(2) + ')' : 'rgba(255,255,240,' + clamp(0.35 + 0.4 * bright, 0.35, 1).toFixed(2) + ')';
        c.fillRect(lx - 3, ey - lh / 2, 6, lh);
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(lx - 3, ey - lh / 2, 6, lh);
        // what the worker sees: a magnified label, blurred by the focus error and dimmed by the light
        const bx = Wd * 0.6 + 12, bw = Wd - bx - 12, by = 12, bh = Math.max(40, Hh * 0.3);
        if (bw > 70) {
          c.fillStyle = C.dark ? '#1c1c1c' : '#fbfbf5'; c.fillRect(bx, by, bw, bh); c.strokeStyle = C.axis; c.strokeRect(bx, by, bw, bh);
          const blur = Math.min(8, Math.abs(err) * 3.5), ink = clamp(0.25 + 0.55 * bright, 0.2, 0.95);
          c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = 'bold ' + Math.round(Math.min(bh * 0.34, bw * 0.13)) + 'px ' + font();
          const txt = 'LOT 4711-B';
          const n = blur > 0.3 ? 7 : 1;
          for (let k = 0; k < n; k++) {
            const ang = k / n * 2 * Math.PI, ox = n > 1 ? blur * Math.cos(ang) : 0, oy = n > 1 ? blur * Math.sin(ang) : 0;
            c.fillStyle = (C.dark ? 'rgba(235,235,235,' : 'rgba(20,20,20,') + (ink / (n > 1 ? 2.2 : 1)).toFixed(2) + ')';
            c.fillText(txt, bx + bw / 2 + ox, by + bh / 2 + oy);
          }
          c.textAlign = 'left'; c.font = '11px ' + font();
          kit.label(c, 'what they see', bx, by + bh + 12, { size: 10.5, color: C.muted, baseline: 'middle' });
          // bars: light at the retina, grip, aerobic capacity
          const bars = [['light at the retina', f], ['grip strength', gripRel(V.age)], ['aerobic capacity', aeroRel(V.age)]];
          const y0 = by + bh + 30, gap = Math.max(26, Math.min(34, (Hh - y0 - 8) / 3));
          bars.forEach(([name, v], i) => {
            const y = y0 + i * gap;
            kit.label(c, name + ' ' + Math.round(100 * v) + ' %', bx, y, { size: 10.5, color: C.text, baseline: 'middle' });
            c.fillStyle = C.surface2; c.fillRect(bx, y + 8, bw, 9);
            c.fillStyle = v > 0.8 ? C.ok : v > 0.6 ? C.warn : C.bad; c.fillRect(bx, y + 8, bw * v, 9);
          });
        }
        const pts = ISO7029.f.map((fr, i) => [fr, shift7029(V.sex, V.age, i)]), other = ISO7029.f.map((fr, i) => [fr, shift7029(V.sex === 'm' ? 'f' : 'm', V.age, i)]);
        const young = ISO7029.f.map((fr, i) => [fr, shift7029(V.sex, 30, i)]);
        plot.set({ series: [{ pts, label: (V.sex === 'm' ? 'man' : 'woman') + ', ' + V.age, dots: true }, { pts: other, label: (V.sex === 'm' ? 'woman' : 'man') + ', ' + V.age, dash: [5, 4] }, { pts: young, label: 'age 30', dash: [5, 4] }], vlines: [{ x: +V.fq, label: 'alarm' }] });
      }
      st.onResize(() => draw());
      draw();
      return onTheme(draw);
    }
  });
})();
