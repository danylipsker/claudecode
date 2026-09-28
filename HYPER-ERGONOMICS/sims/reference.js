/* HYPER-ERGONOMICS · sims/reference.js — reference simulations for Hyper Ergonomics authors.
 *   ref-percentiles  a body dimension's spread for men, women and a mixed population; a design range, a clearance or a
 *                    reach limit; the share accommodated, shaded on the curves and shown on a crowd of random people
 *   ref-seat-fit     a manikin of any sex and percentile at an adjustable chair and a desk: thighs, feet, elbows and
 *                    eyes against the seat, the desk and the screen, with the recommended settings
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';

  Hyper.sim('ref-percentiles', {
    title: 'Who fits the design?',
    blurb: `Pick a body dimension and a design limit, and see how many people it fits. The curves are the spread of the dimension among men and among women (and the two together); the shaded part is the share the design accommodates. Below, a crowd of random people from the same population: green fits, red does not.

**Try this**
- Stature, *Clearance*, 1870 mm: that is the 95th-percentile man — about 5 % of men and almost no women are taller. Add 30 mm of shoes and watch who ducks.
- Popliteal height, *Adjustable range*, 375 to 485 mm (a 400–510 mm chair less 25 mm of shoe): about nine in ten of the mixed crowd fit. Narrow it to a fixed seat, 425 ± 25 mm, and only about half do.
- Vertical grip reach, *Reach*: set the shelf at 1770 mm. The 5th-percentile woman just reaches it; move the share of men down to 0 % and see who is left out.
- Hip breadth sitting: here women are the larger group — the limiting user is not always a man.`,
    mount(box, kit) {
      const E = kit.ergo, U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const cbox = document.createElement('div'), rbox = document.createElement('div'); box.side.appendChild(cbox); box.side.appendChild(rbox);
      const dims = Object.keys(E.DIMS);
      let V = null, ctl = null, dim = 'stature', mode = 'clear', share = 50, seed = 7, crowd = [];
      const D = () => E.DIMS[dim];
      const nice = v => D().unit === 'kg' ? Math.round(v) : Math.round(v / 5) * 5;
      function build() {
        const d = D(), lo = Math.min(d.m[0], d.f[0]) - 3.5 * Math.max(d.m[1], d.f[1]), hi = Math.max(d.m[0], d.f[0]) + 3.5 * Math.max(d.m[1], d.f[1]);
        const step = d.unit === 'kg' ? 1 : hi - lo > 400 ? 5 : 1;
        const lower = nice(E.pct(dim, 'f', 5)), upper = nice(E.pct(dim, 'm', 95));
        cbox.innerHTML = '';
        ctl = kit.controls(cbox, [
          { id: 'dim', type: 'select', label: 'Body dimension', options: dims.map(k => [E.DIMS[k].name, k]), value: dim },
          { id: 'mode', type: 'select', label: 'Design case', options: [['Clearance — people must be smaller than the limit', 'clear'], ['Reach — people must be larger than the limit', 'reach'], ['Adjustable range — between two limits', 'range']], value: mode },
          { id: 'lo', label: 'Lower limit', min: Math.floor(lo), max: Math.ceil(hi), step, value: lower, unit: d.unit },
          { id: 'hi', label: 'Upper limit', min: Math.floor(lo), max: Math.ceil(hi), step, value: upper, unit: d.unit },
          { id: 'allow', label: 'Allowance added to the body (shoes, clothing)', min: 0, max: d.unit === 'kg' ? 15 : 80, step: 1, value: 0, unit: d.unit },
          { id: 'share', label: 'Share of men among the users', min: 0, max: 100, step: 1, value: share, unit: '%' },
          { type: 'buttons', items: [{ id: 'crowd', label: 'A new crowd' }, { id: 'classic', label: '5th woman – 95th man' }] }
        ], (id, v) => {
          if (id === 'dim') { dim = v; setTimeout(build, 0); return; }
          if (id === 'mode') { mode = v; showRows(); }
          if (id === 'share') { share = v; makeCrowd(); }
          if (id === 'crowd') { seed++; makeCrowd(); }
          if (id === 'classic') { ctl.set('lo', nice(E.pct(dim, 'f', 5))); ctl.set('hi', nice(E.pct(dim, 'm', 95))); }
          draw();
        });
        V = ctl.values;
        showRows(); makeCrowd(); draw();
      }
      function showRows() { ctl.show('lo', mode !== 'clear'); ctl.show('hi', mode !== 'reach'); }
      const ro = kit.readout(rbox, [['m', 'Men accommodated'], ['f', 'Women accommodated'], ['all', 'All users accommodated'], ['pl', 'Lower limit is the…'], ['pu', 'Upper limit is the…'], ['c', 'Crowd']]);
      function makeCrowd() {
        const r = U.rng(seed * 7919 + 13), gauss = () => { let u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
        crowd = [];
        for (let i = 0; i < 40; i++) { const sex = r() * 100 < share ? 'm' : 'f'; crowd.push({ sex, zs: gauss(), zd: dim === 'stature' ? null : gauss() }); }
        crowd.forEach(p => { if (p.zd == null) p.zd = p.zs; });
        crowd.sort((a, b) => (E.DIMS.stature[a.sex][0] + a.zs * E.DIMS.stature[a.sex][1]) - (E.DIMS.stature[b.sex][0] + b.zs * E.DIMS.stature[b.sex][1]));
      }
      const limits = () => ({ a: mode === 'clear' ? -Infinity : V.lo, b: mode === 'reach' ? Infinity : V.hi });
      const fits = x => { const L = limits(); return x + V.allow >= L.a && x + V.allow <= L.b; };
      const share1 = sex => { const L = limits(), [mu, sd] = D()[sex]; return E.phi((L.b - V.allow - mu) / sd) - E.phi((L.a - V.allow - mu) / sd); };
      const rank = x => { const w = share / 100; return 100 * (w * E.phi((x - V.allow - D().m[0]) / D().m[1]) + (1 - w) * E.phi((x - V.allow - D().f[0]) / D().f[1])); };
      const ord = p => { const r = Math.round(p); if (p < 0.5) return 'below the 1st'; if (p > 99.5) return 'above the 99th'; const s = (r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'; return r + s; };
      function draw() {
        if (!V) return;
        const d = D(), w = share / 100, C = kit.colors(), L = limits();
        if (mode === 'range' && V.lo > V.hi) { const t = V.lo; ctl.set('lo', V.hi); ctl.set('hi', t); }
        const sm = share1('m'), sf = share1('f'), sAll = w * sm + (1 - w) * sf;
        ro.set('m', kit.pct(sm, 1)); ro.set('f', kit.pct(sf, 1)); ro.set('all', kit.pct(sAll, 1) + ' (' + share + ' % men)');
        ro.show('pl', mode !== 'clear'); ro.show('pu', mode !== 'reach');
        ro.set('pl', ord(rank(V.lo)) + ' percentile of these users');
        ro.set('pu', ord(rank(V.hi)) + ' percentile of these users');
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '12px ' + font();
        // the distributions
        const x0 = 50, x1 = W - 20, yb = Hh * 0.52, yt = 22;
        const lo = Math.min(d.m[0], d.f[0]) - 3.5 * Math.max(d.m[1], d.f[1]), hi = Math.max(d.m[0], d.f[0]) + 3.5 * Math.max(d.m[1], d.f[1]);
        const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
        const pdf = (v, mu, sd) => Math.exp(-0.5 * Math.pow((v - mu) / sd, 2)) / (sd * Math.sqrt(2 * Math.PI));
        const N = 240; let pmax = 0;
        for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; pmax = Math.max(pmax, pdf(v, d.m[0], d.m[1]) * Math.max(w, 0.5), pdf(v, d.f[0], d.f[1]) * Math.max(1 - w, 0.5)); }
        const Y = p => yb - p / pmax * (yb - yt) * 0.95;
        const curve = (mu, sd, k, col, fill) => {
          c.beginPath();
          for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; const y = Y(k * pdf(v, mu, sd)); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); }
          c.strokeStyle = col; c.lineWidth = 2; c.stroke();
          if (fill) {
            c.beginPath(); let first = true;
            for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; if (!fits(v)) continue; const y = Y(k * pdf(v, mu, sd)); if (first) { c.moveTo(X(v), yb); first = false; } c.lineTo(X(v), y); }
            for (let i = N; i >= 0; i--) { const v = lo + (hi - lo) * i / N; if (fits(v)) { c.lineTo(X(v), yb); break; } }
            c.closePath(); c.fillStyle = fill; c.fill();
          }
        };
        const colM = C.hue(215, 1), colF = C.hue(330, 1);
        curve(d.f[0], d.f[1], 1 - w, colF, C.hue(330, 0.18)); curve(d.m[0], d.m[1], w, colM, C.hue(215, 0.18));
        c.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; const y = Y(w * pdf(v, d.m[0], d.m[1]) + (1 - w) * pdf(v, d.f[0], d.f[1])); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); }
        c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center';
        const stepT = Hyper.niceStep(hi - lo, 7);
        for (let v = Math.ceil(lo / stepT) * stepT; v <= hi; v += stepT) { c.fillText(String(Math.round(v)), X(v), yb + 15); c.beginPath(); c.moveTo(X(v), yb); c.lineTo(X(v), yb + 4); c.stroke(); }
        c.fillText(d.name + ' (' + d.unit + ')' + (V.allow ? ' — shown without the ' + V.allow + ' ' + d.unit + ' allowance' : ''), (x0 + x1) / 2, yb + 30);
        const lim = (v, lab) => { const x = X(v - V.allow); if (x < x0 || x > x1) return; c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(x, yt - 6); c.lineTo(x, yb); c.stroke(); kit.label(c, lab, x, yt - 10, { align: 'center', size: 11.5, color: C.bad }); };
        if (mode !== 'clear') lim(V.lo, 'lower ' + V.lo); if (mode !== 'reach') lim(V.hi, 'upper ' + V.hi);
        c.textAlign = 'left'; c.fillStyle = colM; c.fillText('men', x0 + 4, yt + 4); c.fillStyle = colF; c.fillText('women', x0 + 44, yt + 4); c.fillStyle = C.muted; c.fillText('all (dashed)', x0 + 100, yt + 4);
        // the crowd
        const cy = Hh - 12, top = yb + 44, hMax = cy - top, n = crowd.length, gap = (x1 - x0) / n;
        let ok = 0;
        crowd.forEach((p, i) => {
          const S = E.DIMS.stature[p.sex][0] + p.zs * E.DIMS.stature[p.sex][1], x = d[p.sex][0] + p.zd * d[p.sex][1], f = fits(x);
          if (f) ok++;
          const h = hMax * S / 2000, cx = x0 + gap * (i + 0.5), col = f ? C.ok : C.bad, hr = h * 0.065;
          c.strokeStyle = col; c.fillStyle = col; c.lineWidth = Math.max(1.5, gap * 0.12);
          c.beginPath(); c.arc(cx, cy - h + hr, hr, 0, 6.283); c.fill();
          const neck = cy - h + 2 * hr, hip = cy - h * 0.47, sh = neck + h * 0.05, wd = gap * (p.sex === 'm' ? 0.26 : 0.22);
          c.beginPath(); c.moveTo(cx, neck); c.lineTo(cx, hip); c.moveTo(cx, hip); c.lineTo(cx - wd * 0.6, cy); c.moveTo(cx, hip); c.lineTo(cx + wd * 0.6, cy);
          c.moveTo(cx - wd, sh + h * 0.3); c.lineTo(cx, sh); c.lineTo(cx + wd, sh + h * 0.3); c.stroke();
          if (p.sex === 'f') { c.beginPath(); c.moveTo(cx, hip - h * 0.08); c.lineTo(cx - wd * 0.7, hip + h * 0.08); c.lineTo(cx + wd * 0.7, hip + h * 0.08); c.closePath(); c.fill(); }
        });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, cy); c.lineTo(x1, cy); c.stroke();
        ro.set('c', ok + ' of ' + n + ' fit (a random crowd, sorted by height)');
      }
      build();
      st.onResize(() => draw());
      document.addEventListener('hyper:theme', draw);
      return () => document.removeEventListener('hyper:theme', draw);
    }
  });

  Hyper.sim('ref-seat-fit', {
    title: 'Fitting a chair and a desk to a person',
    blurb: `A seated person — any sex, any percentile — at an adjustable chair and a desk, seen from the side. The body is built from the representative dimensions of that percentile. Move the chair and the desk and watch the thighs, feet, elbows and eyes; the readings compare them with the recommended settings.

**Try this**
- Take a 5th-percentile woman at a fixed 740 mm desk. Fit the chair to her legs: her elbows fall well below the desk. Fit the chair to the desk instead: her feet leave the floor — she needs a footrest. That is why a fixed desk height fits only the tall.
- Take a 95th-percentile man at the same desk: his thighs barely clear the underside.
- Press *Fit the chair* and *Fit the desk* for each person: note how far the recommended desk heights spread from the smallest to the largest user — the range a sit–stand desk must cover.
- Raise the screen until its top line is above the eyes: the neck tips back. Keep the top of the screen at or a little below eye height.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: v => Math.round(v) + (Math.round(v) % 10 === 1 && Math.round(v) !== 11 ? 'st' : Math.round(v) % 10 === 2 && Math.round(v) !== 12 ? 'nd' : Math.round(v) % 10 === 3 && Math.round(v) !== 13 ? 'rd' : 'th') },
        { id: 'seat', label: 'Seat height (top of the cushion)', min: 340, max: 580, step: 5, value: 450, unit: 'mm' },
        { id: 'desk', label: 'Desk height (top of the work surface)', min: 580, max: 860, step: 5, value: 740, unit: 'mm' },
        { id: 'screen', label: 'Top of the screen above the desk', min: 250, max: 600, step: 5, value: 420, unit: 'mm' },
        { id: 'foot', label: 'Footrest height', min: 0, max: 150, step: 5, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'fitChair', label: 'Fit the chair', primary: true }, { id: 'fitDesk', label: 'Fit the desk' }, { id: 'fitAll', label: 'Chair to desk + footrest' }] }
      ], id => {
        const w = ws();
        if (id === 'fitChair') { ctl.set('seat', Math.round(w.seat / 5) * 5); ctl.set('foot', 0); }
        if (id === 'fitDesk') ctl.set('desk', Math.round((V.seat + person().elbowRest) / 5) * 5);
        if (id === 'fitAll') { const s = Math.round((V.desk - person().elbowRest) / 5) * 5; ctl.set('seat', s); ctl.set('foot', Math.max(0, Math.min(150, Math.round((s - w.seat) / 5) * 5))); }
        draw();
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['seat', 'Seat for these legs'], ['legs', 'Legs'], ['desk', 'Desk for these elbows'], ['arms', 'Arms'], ['knee', 'Thigh clearance'], ['eyes', 'Eyes and screen']]);
      const person = () => E.person({ sex: V.sex, p: V.p });
      const ws = () => E.workstation(person());
      function draw() {
        const P = person(), w = E.workstation(P), C = kit.colors(), shoe = 25;
        // body geometry (mm): feet on the footrest or floor, shank = popliteal + shoe, thigh = buttock–popliteal
        const floor = V.foot, seat = V.seat, needShank = P.popliteal + shoe, thighL = P.buttockPopliteal, gap = seat - floor - needShank;
        const hipX = 0, hipY = seat + 90;                                    // the hip joint sits about 90 mm above the seat surface
        let kneeX, kneeY, footY;
        if (gap >= 0) { kneeX = hipX + thighL; kneeY = seat + 10; footY = floor + gap; }                     // feet dangle by `gap`
        else { const rise = -gap; kneeY = seat + 10 + rise; kneeX = hipX + Math.sqrt(Math.max(0, thighL * thighL - rise * rise)); footY = floor; }   // knees pushed up
        const shoulderY = seat + P.shoulderHeightSit, elbowY = seat + P.elbowRest, eyeY = seat + P.eyeHeightSit, headTop = seat + P.sittingHeight;
        const foreL = P.stature * 0.146, handL = P.handLength, deskFront = hipX + P.buttockKnee - 60;
        // the forearm reaches forward to the desk surface
        const dy = V.desk + 20 - elbowY, ang = Math.asin(Math.max(-0.95, Math.min(0.95, dy / (foreL + handL * 0.5))));
        const shoulderLift = Math.max(0, dy - 0.25 * (foreL + handL * 0.5));
        const elbowX = hipX + 40, handX = elbowX + (foreL + handL * 0.5) * Math.cos(ang), handY = elbowY + shoulderLift + (foreL + handL * 0.5) * Math.sin(ang);
        // readouts
        const suffix = p => { const r = Math.round(p); return r + ((r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'); };
        ro.set('who', suffix(V.p) + '-percentile ' + (V.sex === 'm' ? 'man' : 'woman') + ', ' + Math.round(P.stature) + ' mm, ' + Math.round(P.weight) + ' kg');
        ro.set('seat', Math.round(w.seat) + ' mm (popliteal ' + Math.round(P.popliteal) + ' + shoe 25)');
        ro.set('legs', gap > 40 ? 'feet ' + Math.round(gap) + ' mm off the ' + (V.foot ? 'footrest' : 'floor') + ': the seat edge presses the thighs — lower the seat or add a footrest' : gap > 10 ? 'slight pressure under the thighs' : gap < -40 ? 'knees ' + Math.round(-gap) + ' mm high: weight on the buttocks, hips flexed — raise the seat' : 'feet flat, thighs about horizontal — good');
        ro.set('desk', Math.round(seat + P.elbowRest) + ' mm (elbow rest height ' + Math.round(P.elbowRest) + ' mm above the seat)');
        ro.set('arms', dy > 60 ? 'desk ' + Math.round(dy - 20) + ' mm above the elbows: shoulders raised — raise the seat or lower the desk' : dy < -80 ? 'desk ' + Math.round(-dy + 20) + ' mm below the elbows: leaning forward — raise the desk' : 'forearms about horizontal — good');
        const underside = V.desk - 30, thighTop = Math.max(kneeY, seat) + P.thighClearance;
        ro.set('knee', underside - thighTop < 20 ? 'only ' + Math.round(underside - thighTop) + ' mm under the desk — too tight' : Math.round(underside - thighTop) + ' mm between thighs and desk');
        const scrTop = V.desk + V.screen, de = scrTop - eyeY;
        ro.set('eyes', de > 30 ? 'screen top ' + Math.round(de) + ' mm above the eyes: the head tips back — lower it' : de < -250 ? 'screen far below the eyes: the neck bends — raise it' : 'screen top ' + (de >= 0 ? Math.round(de) + ' mm above' : Math.round(-de) + ' mm below') + ' eye height — good');
        // drawing: 1 mm = k px, the floor at the bottom
        const c = st.begin(), W = st.W, Hh = st.H, k = Math.min((Hh - 30) / 1900, (W - 40) / 1500), ox = W * 0.28, oy = Hh - 18;
        const px = x => ox + x * k, py = y => oy - y * k;
        c.lineCap = 'round'; c.lineJoin = 'round';
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, py(0)); c.lineTo(W, py(0)); c.stroke();
        // chair: gas lift, seat, backrest
        c.strokeStyle = C.muted; c.lineWidth = 6; c.beginPath(); c.moveTo(px(-60), py(0) - 2); c.lineTo(px(160), py(0) - 2); c.moveTo(px(50), py(0)); c.lineTo(px(50), py(seat - 40)); c.stroke();
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(px(-60), py(seat), (P.buttockPopliteal + 20) * k, 40 * k); c.strokeRect(px(-60), py(seat), (P.buttockPopliteal + 20) * k, 40 * k);
        c.fillRect(px(-110), py(seat + 560), 45 * k, 420 * k); c.strokeRect(px(-110), py(seat + 560), 45 * k, 420 * k);
        // footrest
        if (V.foot > 0) { c.fillStyle = C.faint; c.fillRect(px(thighL - 120), py(V.foot), 360 * k, V.foot * k); }
        // desk with the screen
        const dX = deskFront;
        c.fillStyle = C.surface2; c.fillRect(px(dX), py(V.desk), 800 * k, 30 * k); c.strokeRect(px(dX), py(V.desk), 800 * k, 30 * k);
        c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(px(dX + 760), py(V.desk - 30)); c.lineTo(px(dX + 760), py(0)); c.stroke();
        c.fillStyle = C.text; c.fillRect(px(dX + 480), py(V.desk + V.screen), 22 * k, (V.screen - 60) * k);
        c.fillRect(px(dX + 470), py(V.desk + 20), 60 * k, 20 * k);
        // eye line
        c.setLineDash([5, 5]); c.strokeStyle = C.hue(48, 0.9); c.lineWidth = 1.2; c.beginPath(); c.moveTo(px(90), py(eyeY)); c.lineTo(px(dX + 520), py(eyeY)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'eye height', px(dX + 530), py(eyeY), { size: 11, color: C.muted });
        // the body
        const skin = V.sex === 'm' ? C.hue(215, 0.95) : C.hue(330, 0.95);
        c.strokeStyle = skin; c.lineWidth = Math.max(4, 100 * k);
        c.beginPath(); c.moveTo(px(hipX), py(hipY)); c.lineTo(px(kneeX), py(kneeY)); c.lineTo(px(kneeX + 10), py(footY + shoe + 40)); c.stroke();
        c.lineWidth = Math.max(3, 70 * k); c.beginPath(); c.moveTo(px(kneeX), py(footY + 40)); c.lineTo(px(kneeX + 170), py(footY + 20)); c.stroke();
        c.lineWidth = Math.max(5, 150 * k); c.beginPath(); c.moveTo(px(hipX - 20), py(hipY)); c.lineTo(px(hipX - 30), py(shoulderY)); c.stroke();
        c.lineWidth = Math.max(3, 70 * k); c.beginPath(); c.moveTo(px(hipX - 30), py(shoulderY + shoulderLift)); c.lineTo(px(elbowX), py(elbowY + shoulderLift)); c.lineTo(px(handX), py(handY)); c.stroke();
        c.fillStyle = skin; c.beginPath(); c.arc(px(hipX - 10), py(headTop - 115), 105 * k, 0, 6.283); c.fill();
        c.fillStyle = C.bg2; c.beginPath(); c.arc(px(hipX + 55), py(eyeY), Math.max(1.5, 12 * k), 0, 6.283); c.fill();
        // warnings on the drawing
        if (gap > 40) kit.label(c, 'feet off the ' + (V.foot ? 'footrest' : 'floor'), px(kneeX + 30), py(footY / 2 + floor / 2 + 10), { size: 11.5, color: C.bad, bg: C.bg2 });
        if (dy > 60) kit.label(c, 'shoulders raised', px(hipX - 30), py(shoulderY + shoulderLift + 60), { size: 11.5, color: C.bad, align: 'center', bg: C.bg2 });
        kit.label(c, 'seat ' + V.seat + ' mm · desk ' + V.desk + ' mm', 10, 16, { size: 12, color: C.muted });
      }
      st.onResize(() => draw());
      document.addEventListener('hyper:theme', draw);
      draw();
      return () => document.removeEventListener('hyper:theme', draw);
    }
  });
})();
