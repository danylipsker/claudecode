/* learn.js — the guided tour. Every chapter carries a live figure that runs
 * on the same engine as the workbench, so nothing here is an illustration of
 * the theory: it IS the theory, computed on the spot.
 */
'use strict';

/* ── figure framework ─────────────────────────────────────────────── */

const FIGS = [];

class Fig {
  constructor(cv, draw) {
    this.cv = cv; this.v = new View(cv, { interactive: false });
    this.draw = draw; this.t = 0; this.vis = false; this.st = {};
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { this.vis = es[0].isIntersecting; }, { rootMargin: '150px' }).observe(cv);
    } else this.vis = true;
    FIGS.push(this);
  }
}

let figLast = 0;
function figLoop(now) {
  const dt = Math.min(0.05, (now - figLast) / 1000 || 0);
  figLast = now;
  const active = document.getElementById('learn').classList.contains('on') ||
    document.getElementById('lab').classList.contains('on');
  if (active) {
    for (const f of FIGS) {
      if (!f.vis) continue;
      f.t += dt;
      f.v.resize();
      try { f.draw(f, dt); } catch (e) { /* a figure must never take the page down */ }
    }
  }
  requestAnimationFrame(figLoop);
}

/* ── small control builders ───────────────────────────────────────── */

function ctl(host, label, min, max, step, val, fn, fmt) {
  const row = document.createElement('div'); row.className = 'row';
  const l = document.createElement('label'); l.textContent = label;
  const r = document.createElement('input');
  r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = val;
  const n = document.createElement('input');
  n.type = 'text'; n.className = 'num'; n.value = (fmt || fmt3)(val);
  r.oninput = () => { const v = parseFloat(r.value); n.value = (fmt || fmt3)(v); fn(v); };
  row.append(l, r, n);
  host.appendChild(row);
  return { row, set: (v) => { r.value = v; n.value = (fmt || fmt3)(v); fn(v); } };
}

function ctlToggle(host, label, val, fn) {
  const l = document.createElement('label'); l.className = 'chk';
  const i = document.createElement('input'); i.type = 'checkbox'; i.checked = val;
  i.onchange = () => fn(i.checked);
  l.append(i, document.createTextNode(label));
  host.appendChild(l);
  return i;
}

function ctlButton(host, label, fn) {
  const b = document.createElement('button'); b.className = 'tbtn'; b.textContent = label;
  b.onclick = fn; host.appendChild(b); return b;
}

/* ── a compact pair builder for the figures ───────────────────────── */

function quickPair(id, vals, o) {
  o = o || {};
  const def = SHAPE_BY_ID[id];
  const N = o.N || 520, M = o.M || 520;
  const c1 = buildShape(def, vals, N, o.smooth == null ? 0.08 : o.smooth, { formula: o.formula }).r;
  const sym = def.symOf ? def.symOf(vals) : (isRound(c1) ? 0 : symmetryOrder(c1));
  const ratio = o.ratio != null ? o.ratio : (sym || 1) / (o.m || sym || 1);
  const a = o.a != null ? Math.max(o.a, rMax(c1) * 1.001) : solveCenterDistance(c1, ratio);
  const law = buildLaw(c1, a);
  const mate = mateCentrode(c1, a, M, law);
  const prof1 = o.teeth ? addTeeth(c1, o.teeth.Z, o.teeth.h, o.teeth.profile || 'trapezoid', o.teeth.phase || 0, N) : c1;
  const span = TAU / Math.max(1e-6, law.ratio);
  const conj = conjugate(prof1, law, a, M, span, o.steps || 280);
  /* `profile1` is the name contactsNow() expects; `prof1` is the short one
     the figures use for drawing. Same array. */
  return { def, sym, c1, prof1, profile1: prof1, a, law, mate, conj, span, N, M, r2: conj.r, ratio: law.ratio };
}

/** Draw a meshing pair the way the studio does, minus the chrome. */
function drawPair(v, P, phi1, opt) {
  opt = opt || {};
  const phi2 = P.law.phi2(phi1), a = P.a;
  fillPolar(v, P.prof1, -phi1, 0, 0, 'rgba(255,176,32,.13)', '#ffb020', 1.6);
  fillPolar(v, opt.r2 || P.r2, phi2, a, 0, 'rgba(46,196,182,.13)', '#2ec4b6', 1.6);
  if (opt.centrodes) {
    strokePolar(v, P.c1, -phi1, 0, 0, 'rgba(255,176,32,.5)', 1.1, [5, 4]);
    strokePolar(v, P.mate.r, phi2, a, 0, 'rgba(46,196,182,.5)', 1.1, [5, 4]);
  }
  line(v, [0, 0], [a, 0], 'rgba(255,255,255,.15)', 1, [6, 5]);
  axle(v, [0, 0], '#ffb020'); axle(v, [a, 0], '#2ec4b6');
  return phi2;
}

function fitPair(v, P, pad) {
  const r1 = rMax(P.prof1), r2 = rMax(P.r2), h = Math.max(r1, r2) * 1.1;
  v.fit([-r1 * 1.1, -h, P.a + r2 * 1.1, h], pad == null ? 0.07 : pad);
}

/* ══════════════════════════════════════════════════ the chapters ═══ */

const CHAPTERS = [
  /* ─────────────────────────────────────────────────────────── 1 ── */
  {
    id: 'question', nav: 'The question', tag: 'The problem',
    title: 'What can mesh with what?',
    html: `
<p>Two shapes are pinned to two fixed axles. Turn one, and you want the other to turn with it —
<b>always touching, never overlapping</b>. That is the entire problem.</p>
<p>Circles are easy, so easy that we stop noticing there was a question. But hand someone a square
and ask what shape it drives, and the honest first answer is: it is not obvious that anything does.</p>
<p>The figure shows the naive guess — pair a square with another square. Drag the centre distance
and watch the two failure modes chase each other: at some angles the shapes <b style="color:#ff5c7a">bite into
each other</b>, at others they <b>come apart</b> and nothing is transmitted at all.</p>
<p>So the question sharpens. Given a shape and a centre distance, is there a mate? And if there is,
is there a recipe that finds it rather than a lucky guess?</p>`,
    cap: 'Red marks penetration. Both squares turn at the same speed — which is exactly the assumption that fails.',
    fig(host, ctls) {
      const cv = host;
      const st = { a: 2.1, pen: 0, gap: 0 };
      let P = null;
      const build = () => {
        const def = SHAPE_BY_ID.square, vals = { R: 1, n: 6 };
        const c1 = buildShape(def, vals, 420, 0.06, {}).r;
        P = { c1, a: st.a };
      };
      build();
      ctl(ctls, 'Centre dist.', 2.02, 3.2, 0.01, st.a, (v) => { st.a = v; build(); });
      const f = new Fig(cv, (F) => {
        const v = F.v, c = v.begin();
        const r = P.c1, M = r.length, a = P.a;
        const phi = F.t * 0.55;
        v.fit([-1.25, -1.45, a + 1.25, 1.45], 0.06);
        /* gear 2 is a copy of gear 1 turning at the same speed, the other way */
        line(v, [0, 0], [a, 0], 'rgba(255,255,255,.15)', 1, [6, 5]);
        fillPolar(v, r, -phi, 0, 0, 'rgba(255,176,32,.13)', '#ffb020', 1.6);
        fillPolar(v, r, phi + Math.PI, a, 0, 'rgba(46,196,182,.13)', '#2ec4b6', 1.6);
        /* penetration: sample gear 2's boundary and test it against gear 1 */
        let pen = 0, gap = Infinity, penPts = [];
        for (let i = 0; i < M; i += 2) {
          const psi = i * TAU / M, rr = r[i];
          const x = rr * Math.cos(psi + phi + Math.PI) + a, y = rr * Math.sin(psi + phi + Math.PI);
          const d = Math.hypot(x, y), th = Math.atan2(y, x);
          const bound = rAt(r, th + phi);      /* gear 1's boundary in that direction */
          const over = bound - d;
          if (over > 0) { pen = Math.max(pen, over); penPts.push([x, y]); }
          gap = Math.min(gap, d - bound);
        }
        for (const p of penPts) dot(v, p, 2.2, 'rgba(255,92,122,.85)');
        axle(v, [0, 0], '#ffb020'); axle(v, [a, 0], '#2ec4b6');
        const ctx = v.ctx;
        ctx.font = '11.5px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = pen > 1e-3 ? '#ff5c7a' : '#3ccf8e';
        ctx.fillText(pen > 1e-3 ? 'overlapping by ' + pen.toFixed(3) : 'no overlap', 10, 8);
        ctx.fillStyle = gap > 1e-3 ? '#e8a33d' : '#6b7488';
        ctx.fillText(gap > 1e-3 ? 'and a gap of ' + gap.toFixed(3) + ' — not touching' : 'touching', 10, 24);
      });
      return f;
    }
  },

  /* ─────────────────────────────────────────────────────────── 2 ── */
  {
    id: 'rolling', nav: 'Rolling', tag: 'The key idea',
    title: 'Forget teeth. Roll one curve on another.',
    html: `
<p>The trick is to stop thinking about the outlines and think about <b>rolling</b>. Imagine a curve
glued to each axle, and imagine those two curves rolling on each other with no slipping at all,
like two odd-shaped wheels pressed together. These curves are called <b>centrodes</b>, or
pitch curves.</p>
<p>Rolling contact has two consequences, and everything else in this app follows from them:</p>
<ul>
<li>The curves touch <b>on the line joining the axles</b>. Nowhere else — if they touched off the
line, one of them would have to be moving through the other.</li>
<li>At that point both surfaces move at the <b>same speed</b>, because they are not slipping:
<var>ω</var><sub>1</sub><var>r</var><sub>1</sub> = <var>ω</var><sub>2</sub><var>r</var><sub>2</sub>.</li>
</ul>
<p>Since the touching point is on the line of centres, the two radii add up to the centre
distance: <var>r</var><sub>1</sub> + <var>r</var><sub>2</sub> = <var>a</var>. Put those together and
the mate is no longer a mystery — it is a differential equation:</p>
<div class="eq">
<span class="b">dφ₂</span> ⁄ <span class="a">dφ₁</span>
&nbsp;=&nbsp; <span class="a">r₁(φ₁)</span> ⁄ ( <var>a</var> − <span class="a">r₁(φ₁)</span> )
<span class="sm">how fast gear 2 turns, per unit turn of gear 1</span>
</div>
<p>Integrate it and you know where gear 2 is pointing at every moment. The mate's own radius at that
moment is just <var>a</var> − <var>r</var><sub>1</sub>. That is the whole construction.</p>
<p>The tick marks in the figure sit at equal <b>arc length</b> along both curves. Watch them stay
paired as the shapes turn: that is what "no slipping" looks like.</p>`,
    cap: 'Contact stays on the dashed line of centres, and the tick marks never drift apart.',
    fig(host, ctls) {
      const st = { A: 0.3, N: 3 };
      let P = null;
      const build = () => { P = quickPair('lobed', { R: 1, N: st.N, A: st.A, q: 1 }, { m: st.N, N: 420, M: 420, steps: 200 }); };
      build();
      ctl(ctls, 'Lobe depth', 0, 0.45, 0.005, st.A, (v) => { st.A = v; build(); });
      ctl(ctls, 'Lobes', 1, 6, 1, st.N, (v) => { st.N = v; build(); }, fmtInt);
      return new Fig(host, (F) => {
        const v = F.v; v.begin();
        fitPair(v, P);
        const phi1 = (F.t * 0.5) % P.span;
        const phi2 = drawPair(v, P, phi1, { centrodes: false });
        /* equal-arc-length tick marks on both curves */
        const marks = 28;
        const A1 = arcLength(P.c1), A2 = arcLength(P.mate.r);
        for (const [r, arc, rot, cx, col] of [[P.c1, A1, -phi1, 0, '#ffb020'], [P.mate.r, A2, phi2, P.a, '#2ec4b6']]) {
          for (let k = 0; k < marks; k++) {
            const target = arc.L * k / marks;
            let i = 0; while (i < r.length && arc.s[i] < target) i++;
            const th = i * TAU / r.length;
            const co = Math.cos(rot), si = Math.sin(rot);
            const bx = r[i % r.length] * Math.cos(th), by = r[i % r.length] * Math.sin(th);
            const X = cx + co * bx - si * by, Y = si * bx + co * by;
            const L = Math.hypot(X - cx, Y), ux = (X - cx) / L, uy = Y / L;
            line(v, [X - ux * 0.045, Y - uy * 0.045], [X + ux * 0.03, Y + uy * 0.03], col, 1.3);
          }
        }
        const rp = rAt(P.c1, phi1);
        dot(v, [rp, 0], 4.4, '#a78bfa', '#1a1030');
        label(v, [rp, 0], 'contact', '#a78bfa', 8, -11);
      });
    }
  },

  /* ─────────────────────────────────────────────────────────── 3 ── */
  {
    id: 'closure', nav: 'Closing up', tag: 'The catch',
    title: 'The mate has to close up — and usually it does not',
    html: `
<p>Integrate the rolling equation all the way round one turn of gear 1 and you get the total angle
gear 2 swept:</p>
<div class="eq">
Θ(<var>a</var>) &nbsp;=&nbsp; ∮ <span class="a">r₁</span> ⁄ ( <var>a</var> − <span class="a">r₁</span> ) &nbsp;<span class="a">dφ₁</span>
<span class="sm">gear 2's total rotation per full turn of gear 1</span>
</div>
<p>Here is the catch. Gear 2's outline is traced out as it turns. If Θ is not a whole number of
turns, the end of that trace <b>does not meet the beginning</b> — you get a spiral, not a closed
curve, and there is no gear 2 at all.</p>
<p>So Θ must equal 2π<var>N</var> for a whole number <var>N</var>. You do not get to choose the
centre distance freely: <b>the centre distance is determined by the ratio you want.</b> Luckily
Θ shrinks steadily as <var>a</var> grows, so there is exactly one <var>a</var> for each ratio, and a
few lines of bisection find it.</p>
<p>One more constraint hides behind this. If gear 1 has <var>n</var>-fold symmetry, the only ratios
that can close are <var>n</var>⁄<var>m</var> for whole <var>m</var> — and gear 2 comes out with
<var>m</var>-fold symmetry. A square (<var>n</var> = 4) can drive a four-lobed mate, a three-lobed
one, a two, or a single big egg. Nothing in between.</p>
<p>Drag the centre distance below and watch the trace fail to close. Then press solve.</p>`,
    cap: 'The teal curve is gear 2 being traced. The red wedge is how badly it misses itself.',
    fig(host, ctls) {
      const st = { a: 2.3, m: 4 };
      let c1 = null, law = null, sol = 0;
      const build = () => {
        c1 = buildShape(SHAPE_BY_ID.square, { R: 1, n: 6 }, 420, 0.07, {}).r;
        sol = solveCenterDistance(c1, 4 / st.m);
        law = buildLaw(c1, Math.max(st.a, rMax(c1) * 1.01));
      };
      build();
      const aCtl = ctl(ctls, 'Centre dist.', 1.6, 4.2, 0.005, st.a, (v) => { st.a = v; build(); });
      ctl(ctls, 'Gear 2 lobes', 1, 6, 1, st.m, (v) => { st.m = v; build(); }, fmtInt);
      ctlButton(ctls, 'Solve for closure', () => { aCtl.set(sol); });
      return new Fig(host, (F) => {
        const v = F.v, c = v.begin();
        const a = Math.max(st.a, rMax(c1) * 1.01);
        const R2 = a - rMin(c1);
        v.fit([-R2 * 1.15, -R2 * 1.15, R2 * 1.15, R2 * 1.15], 0.08);
        /* trace gear 2's outline directly from the ODE */
        const K = 700;
        c.beginPath();
        for (let i = 0; i <= K; i++) {
          const p = TAU * i / K, psi = Math.PI - law.phi2(p), rr = a - rAt(c1, p);
          const X = rr * Math.cos(psi), Y = rr * Math.sin(psi);
          if (i === 0) c.moveTo(v.x(X), v.y(Y)); else c.lineTo(v.x(X), v.y(Y));
        }
        c.strokeStyle = '#2ec4b6'; c.lineWidth = 2; c.stroke();
        /* the gap between the trace's two ends */
        const rr0 = a - rAt(c1, 0), psiEnd = Math.PI - law.total;
        const err = angDiff(Math.PI, psiEnd);
        const p0 = [rr0 * Math.cos(Math.PI), rr0 * Math.sin(Math.PI)];
        const p1 = [rr0 * Math.cos(psiEnd), rr0 * Math.sin(psiEnd)];
        const closed = Math.abs(err) * DEG < 0.4;
        if (!closed) {
          c.beginPath();
          c.moveTo(v.x(0), v.y(0)); c.lineTo(v.x(p0[0]), v.y(p0[1]));
          c.arc(v.x(0), v.y(0), rr0 * v.scale, -Math.PI, -psiEnd, err > 0);
          c.closePath();
          c.fillStyle = 'rgba(255,92,122,.22)'; c.fill();
          c.strokeStyle = 'rgba(255,92,122,.75)'; c.lineWidth = 1.4; c.stroke();
        }
        dot(v, p0, 4, '#e7eaf2'); dot(v, p1, 4, closed ? '#3ccf8e' : '#ff5c7a');
        axle(v, [0, 0], '#2ec4b6');
        const ctx = v.ctx;
        ctx.font = '11.5px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = closed ? '#3ccf8e' : '#ff5c7a';
        ctx.fillText('Θ = ' + (law.ratio).toFixed(4) + ' turns' + (closed ? '  — closes' : '  — misses by ' + Math.abs(err * DEG).toFixed(1) + '°'), 10, 8);
        ctx.fillStyle = '#6b7488';
        ctx.fillText('closing centre distance a = ' + sol.toFixed(4), 10, 24);
      });
    }
  },

  /* ─────────────────────────────────────────────────────────── 4 ── */
  {
    id: 'pitchpoint', nav: 'Pitch point', tag: 'The law of gearing',
    title: 'Everything passes through the pitch point',
    html: `
<p>The place where the centrodes touch has a name: the <b>pitch point</b>. It is the instantaneous
centre of the relative motion — the one point where the two bodies are, for that instant, not moving
relative to each other at all.</p>
<p>That gives the single most useful statement in gear theory, usually called the
<b>law of gearing</b>:</p>
<div class="eq">
At every instant, the <b>common normal</b> at the point of contact<br>must pass through the pitch point.
<span class="sm">Willis, 1841 — and the test your mate has to pass</span>
</div>
<p>The reason is short. The two surfaces must neither separate nor interpenetrate, so their
velocities must agree <b>along the normal</b>. Work that condition out and it says precisely that the
normal line hits the line of centres at the point dividing it in the ratio of the angular speeds —
which is the pitch point.</p>
<p>This is a test you can apply to any proposed pair, and it is what the workbench reports as
<b>normal-through-pitch error</b>. For a correct conjugate mate that number sits at the noise
floor. For a wrong one it does not.</p>
<p>Turn on <b>break the law</b> below to replace the proper mate with a plain circle of the right
average size. The normal immediately stops hitting the pitch point, and the output speed starts to
wander.</p>`,
    cap: 'The dashed red line is the common normal. The violet dot is the pitch point.',
    fig(host, ctls) {
      const st = { broken: false, e: 0.34 };
      let P = null, fake = null, fakeD = null, fakeObj = null;
      const build = () => {
        P = quickPair('ellipseF', { A: 1, e: st.e }, { m: 1, N: 460, M: 460, steps: 260 });
        fake = new Float64Array(P.M).fill((rMin(P.mate.r) + rMax(P.mate.r)) / 2);
        fakeD = dPolar(fake);
        /* kept around so contactsNow can reuse its scratch buffers */
        fakeObj = { profile1: P.prof1, law: P.law, a: P.a, M: P.M, r2: fake };
      };
      build();
      ctl(ctls, 'Eccentricity', 0.05, 0.6, 0.005, st.e, (v) => { st.e = v; build(); });
      ctlToggle(ctls, 'Break the law (use a circle instead)', false, (v) => { st.broken = v; });
      return new Fig(host, (F) => {
        const v = F.v; v.begin();
        fitPair(v, P);
        const phi1 = (F.t * 0.45) % P.span;
        const r2 = st.broken ? fake : P.r2;
        const phi2 = drawPair(v, P, phi1, { centrodes: true, r2 });
        const rp = rAt(P.c1, phi1);
        /* contact + normal, taken from whichever gear 2 we are showing */
        const M = P.M, dr = st.broken ? fakeD : (P._d || (P._d = dPolarWide(P.r2, 3)));
        const bins = contactsNow(st.broken ? fakeObj : P, phi1);
        for (const ct of bins.slice(0, 3)) {
          const psi = ct.psi;
          const C = body2ToWorld(rAt(r2, psi), psi, phi2, P.a);
          const nb = normalAtAngle(r2, dr, psi);
          const co = Math.cos(phi2), si = Math.sin(phi2);
          const n = [co * nb[0] - si * nb[1], si * nb[0] + co * nb[1]];
          line(v, [C[0] - n[0] * 2.2, C[1] - n[1] * 2.2], [C[0] + n[0] * 2.2, C[1] + n[1] * 2.2],
            'rgba(255,92,122,.6)', 1.3, [5, 4]);
          dot(v, C, 3.6, '#ff5c7a', 'rgba(10,12,18,.9)');
          const miss = Math.abs(n[0] * (0 - C[1]) - n[1] * (rp - C[0]));
          const ctx = v.ctx;
          ctx.font = '11.5px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
          ctx.fillStyle = miss < 0.01 ? '#3ccf8e' : '#ff5c7a';
          ctx.fillText('normal misses pitch point by ' + miss.toFixed(4), 10, 8);
          break;
        }
        dot(v, [rp, 0], 4.6, '#a78bfa', '#1a1030');
        label(v, [rp, 0], 'P', '#a78bfa', 9, -10, '12px "Segoe UI",system-ui,sans-serif');
      });
    }
  },

  /* ─────────────────────────────────────────────────────────── 5 ── */
  {
    id: 'envelope', nav: 'Envelopes', tag: 'The tool',
    title: 'Envelopes: the curve a family of curves draws',
    html: `
<p>Step away from gears for a moment. Take a ladder and slide it down a wall — foot out, top down —
and draw the ladder in every position. You never drew a curve, yet a curve is unmistakably there:
a sharp <b>astroid</b> that every single ladder position just touches.</p>
<p>That curve is the <b>envelope</b> of the family. Formally, if a family of curves is
<var>F</var>(<var>x</var>, <var>y</var>, <var>t</var>) = 0 with <var>t</var> labelling the member,
the envelope is the set of points where a member touches its neighbour — which happens exactly when
the member and its rate of change in <var>t</var> vanish together:</p>
<div class="eq">
<var>F</var>(<var>x</var>,<var>y</var>,<var>t</var>) = 0 &nbsp;&nbsp;and&nbsp;&nbsp;
∂<var>F</var> ⁄ ∂<var>t</var> = 0
<span class="sm">on the curve, and stationary as the family moves — solve both, eliminate t</span>
</div>
<p>The <b>partial</b> derivative matters here. ∂<var>F</var>/∂<var>t</var> holds the point still and
asks how the family sweeps past it. Where that is zero, neighbouring members of the family cross at
the same place to first order — the family stops moving sideways and instead just grazes. Points
where ∂<var>F</var>/∂<var>t</var> ≠ 0 are swept straight through, so no curve can be tangent there.</p>
<p>For the ladder of length <var>L</var> at angle <var>t</var>, <var>F</var> =
<var>x</var>/(<var>L</var>cos <var>t</var>) + <var>y</var>/(<var>L</var>sin <var>t</var>) − 1.
Setting <var>F</var> = ∂<var>F</var>/∂<var>t</var> = 0 and eliminating <var>t</var> gives
<var>x</var><sup>2/3</sup> + <var>y</var><sup>2/3</sup> = <var>L</var><sup>2/3</sup>.</p>`,
    cap: 'Every member of the family touches the envelope exactly once — at the point where ∂F/∂t = 0.',
    fig(host, ctls) {
      const st = { n: 26, which: 0, show: true, t: 0.7 };
      const names = ['Sliding ladder → astroid', 'Moving circles → cardioid-like caustic', 'Normals of a parabola → its evolute'];
      const sel = document.createElement('select');
      names.forEach((n, i) => { const o = document.createElement('option'); o.value = i; o.textContent = n; sel.appendChild(o); });
      sel.onchange = () => { st.which = +sel.value; };
      const r0 = document.createElement('div'); r0.className = 'row'; r0.appendChild(sel);
      ctls.appendChild(r0);
      ctl(ctls, 'Family size', 6, 70, 1, st.n, (v) => { st.n = v; }, fmtInt);
      ctl(ctls, 'Highlight t', 0.03, 1.53, 0.005, st.t, (v) => { st.t = v; });
      ctlToggle(ctls, 'Show the family', true, (v) => { st.show = v; });

      /* member(t) returns a polyline; envelope() returns the exact curve */
      const member = (w, t) => {
        const pts = [];
        if (w === 0) { pts.push([Math.cos(t), 0], [0, Math.sin(t)]); }
        else if (w === 1) {
          const cx = Math.cos(t), cy = Math.sin(t), rad = 0.5 * (1 + Math.cos(t));
          for (let i = 0; i <= 48; i++) { const u = i / 48 * TAU; pts.push([cx + rad * Math.cos(u), cy + rad * Math.sin(u)]); }
        } else {
          const x = (t - 0.78) * 2.2, y = x * x * 0.5;
          const nx = -x, ny = 1, L = Math.hypot(nx, ny);
          pts.push([x - nx / L * 1.6, y - ny / L * 1.6], [x + nx / L * 1.6, y + ny / L * 1.6]);
        }
        return pts;
      };
      const envelope = (w) => {
        const pts = [];
        if (w === 0) for (let i = 0; i <= 90; i++) { const t = i / 90 * Math.PI / 2; pts.push([Math.pow(Math.cos(t), 3), Math.pow(Math.sin(t), 3)]); }
        else if (w === 1) for (let i = 0; i <= 200; i++) {
          const t = i / 200 * TAU;
          /* envelope of circles centred on the unit circle with radius (1+cos t)/2 */
          const rad = 0.5 * (1 + Math.cos(t));
          pts.push([Math.cos(t) * (1 + rad), Math.sin(t) * (1 + rad)]);
        }
        else for (let i = 0; i <= 120; i++) {
          const x = (i / 120 - 0.5) * 3.2;
          pts.push([-x * x * x * 0.5, 0.5 * x * x + 1]);   /* evolute of y = x²/2 */
        }
        return pts;
      };
      return new Fig(host, (F) => {
        const v = F.v, c = v.begin();
        const w = st.which;
        v.fit(w === 0 ? [-0.15, -0.15, 1.25, 1.25] : w === 1 ? [-2.4, -2.4, 2.4, 2.4] : [-2.6, -0.4, 2.6, 3.2], 0.08);
        grid(v, 'rgba(255,255,255,.035)', 'rgba(255,255,255,.08)');
        if (st.show) {
          for (let i = 0; i < st.n; i++) {
            const t = w === 0 ? 0.04 + (i + 0.5) / st.n * (Math.PI / 2 - 0.08)
              : w === 1 ? i / st.n * TAU : (i + 0.5) / st.n;
            const pts = member(w, t);
            c.beginPath();
            pts.forEach((p, k) => k ? c.lineTo(v.x(p[0]), v.y(p[1])) : c.moveTo(v.x(p[0]), v.y(p[1])));
            c.strokeStyle = 'rgba(255,176,32,.30)'; c.lineWidth = 1; c.stroke();
          }
        }
        const env = envelope(w);
        c.beginPath();
        env.forEach((p, k) => k ? c.lineTo(v.x(p[0]), v.y(p[1])) : c.moveTo(v.x(p[0]), v.y(p[1])));
        c.strokeStyle = '#2ec4b6'; c.lineWidth = 2.4; c.stroke();
        /* the highlighted member and its point of tangency */
        const th = w === 0 ? st.t : w === 1 ? st.t / 1.53 * TAU : st.t / 1.53;
        const hp = member(w, th);
        c.beginPath();
        hp.forEach((p, k) => k ? c.lineTo(v.x(p[0]), v.y(p[1])) : c.moveTo(v.x(p[0]), v.y(p[1])));
        c.strokeStyle = '#ffb020'; c.lineWidth = 2; c.stroke();
        if (w === 0) {
          const P = [Math.pow(Math.cos(th), 3), Math.pow(Math.sin(th), 3)];
          dot(v, P, 4.4, '#ff5c7a', 'rgba(10,12,18,.9)');
          label(v, P, '∂F/∂t = 0', '#ff5c7a', 9, -11);
        }
      });
    }
  },

  /* ─────────────────────────────────────────────────────────── 6 ── */
  {
    id: 'conjugate', nav: 'The construction', tag: 'The answer', tagClass: 'g',
    title: 'Gear 2 is the envelope of gear 1',
    html: `
<p>Now put the two ideas together, and the recipe falls out.</p>
<p>Sit on gear 2. From there, gear 1 is not a fixed shape — it swings around and spins, tracing a
whole <b>family</b> of positions in your frame. Gear 2 is allowed to occupy any point that gear 1
never visits, and it should be as large as possible so that it actually touches. So:</p>
<div class="eq">
gear 2 &nbsp;=&nbsp; the <b>envelope</b> of gear 1, seen from gear 2's frame
<span class="sm">equivalently: the blank, minus everything gear 1 ever sweeps through</span>
</div>
<p>Written out, a point <b>p</b> on gear 1 appears in gear 2's frame at</p>
<div class="eq">
<b>q</b>(<var>s</var>, <span class="a">φ₁</span>) = R(−<span class="b">φ₂</span>) [ R(−<span class="a">φ₁</span>) <b>p</b>(<var>s</var>) − <b>a</b> ]
<span class="sm">s runs along gear 1's outline, φ₁ drives the motion, φ₂ comes from the rolling ODE</span>
</div>
<p>and the envelope condition — the same ∂<var>F</var>/∂<var>t</var> = 0 as before, now written for a
parametrised family — is that the two partial derivatives become parallel:</p>
<div class="eq">
∂<b>q</b>/∂<var>s</var> &nbsp;×&nbsp; ∂<b>q</b>/∂<span class="a">φ₁</span> &nbsp;=&nbsp; 0
<span class="sm">the point stops moving across the curve and starts sliding along it — that is contact</span>
</div>
<p>This app does not solve that cross-product symbolically. It does the equivalent and far more
robust thing: it sweeps gear 1 through a full cycle and keeps, for every direction out of gear 2's
axle, the <b>nearest</b> gear-1 boundary it ever saw. That pointwise minimum <em>is</em> the envelope,
and it is also exactly what a gear shaper cutter physically does to a blank. Undercut, clearance and
interference then come out of the arithmetic instead of having to be special-cased.</p>
<p>Slide the family size up and watch the mate appear out of nothing.</p>`,
    cap: 'Faint amber: gear 1 at many instants, in gear 2’s frame. Teal: the envelope — gear 2.',
    fig(host, ctls) {
      const st = { n: 30, shape: 'square', reveal: 1 };
      let P = null;
      const build = () => {
        const vals = st.shape === 'square' ? { R: 1, n: 6 } : st.shape === 'poly' ? { R: 1, N: 3 } : { R: 1, N: 5, A: 0.3, q: 1 };
        P = quickPair(st.shape, vals, { m: st.shape === 'poly' ? 3 : st.shape === 'square' ? 4 : 5, N: 420, M: 420, steps: 260 });
      };
      build();
      const sel = document.createElement('select');
      [['square', 'Rounded square'], ['poly', 'Triangle'], ['lobed', 'Five lobes']].forEach(([k, n]) => {
        const o = document.createElement('option'); o.value = k; o.textContent = n; sel.appendChild(o);
      });
      sel.onchange = () => { st.shape = sel.value; build(); };
      const r0 = document.createElement('div'); r0.className = 'row'; r0.appendChild(sel); ctls.appendChild(r0);
      ctl(ctls, 'Family size', 1, 90, 1, st.n, (v) => { st.n = v; }, fmtInt);
      return new Fig(host, (F) => {
        const v = F.v, c = v.begin();
        const R2 = rMax(P.r2) * 1.25;
        v.fit([-R2, -R2, R2, R2], 0.07);
        /* everything drawn in gear 2's own frame: gear 2 sits still */
        c.save(); c.globalAlpha = 0.9;
        const nG = Math.round(st.n);
        for (let g = 0; g < nG; g++) {
          const k = Math.round(g / nG * P.conj.steps) % P.conj.steps;
          const p1 = P.conj.frames[k], p2 = P.law.phi2(p1);
          const cen = rotAbout([0, 0], -p2, [P.a, 0]);
          const cc = [cen[0] - P.a, cen[1]];
          strokePolar(v, P.prof1, -p1 - p2, cc[0], cc[1], 'rgba(255,176,32,.34)', 1);
        }
        c.restore();
        fillPolar(v, P.r2, 0, 0, 0, 'rgba(46,196,182,.15)', '#2ec4b6', 2);
        axle(v, [0, 0], '#2ec4b6');
        const ctx = v.ctx;
        ctx.font = '11.5px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = '#6b7488';
        ctx.fillText(nG + ' position' + (nG > 1 ? 's' : '') + ' of gear 1, in gear 2’s frame', 10, 8);
      });
    }
  },

  /* ─────────────────────────────────────────────────────────── 7 ── */
  {
    id: 'sliding', nav: 'Sliding', tag: 'Consequences',
    title: 'Rolling at one point, sliding everywhere else',
    html: `
<p>The centrodes roll. The <b>tooth surfaces</b> mostly do not.</p>
<p>At the contact point, gear 1's material is moving at <var>v</var><sub>1</sub> = <var>ω</var><sub>1</sub> × <var>r</var><sub>1</sub>
and gear 2's at <var>v</var><sub>2</sub> = <var>ω</var><sub>2</sub> × <var>r</var><sub>2</sub>. These agree along the
normal — they must, or the surfaces would separate or interpenetrate — but they do not agree along
the tangent. The difference is the <b>sliding velocity</b>:</p>
<div class="eq">
<b>v</b><sub>slide</sub> = <b>v</b><sub>1</sub> − <b>v</b><sub>2</sub>
<span class="sm">always tangent to both surfaces, and zero only at the pitch point</span>
</div>
<p>It vanishes exactly at the pitch point and grows roughly in proportion to how far along the
tooth you are from it. This single fact explains a lot of practical gear design:</p>
<ul>
<li>Wear and pitting concentrate away from the pitch line, not on it.</li>
<li>Short, stubby teeth slide less than tall ones — which is one reason tooth height is limited.</li>
<li>Non-circular gears slide more, because the pitch point runs up and down the line of centres.</li>
</ul>
<p>Blue arrows are the sliding velocity. Watch one shrink to nothing as its contact point crosses
the pitch point, then grow again pointing the other way.</p>`,
    cap: 'Amber and teal arrows are the two material velocities; blue is their difference.',
    fig(host, ctls) {
      const st = { h: 0.07, Z: 16 };
      let P = null;
      const build = () => {
        P = quickPair('circle', { R: 1 }, { ratio: 1, N: 520, M: 520, steps: 300, smooth: 0, teeth: { Z: st.Z, h: st.h, profile: 'trapezoid' } });
      };
      build();
      ctl(ctls, 'Tooth height', 0.01, 0.16, 0.002, st.h, (v) => { st.h = v; build(); });
      ctl(ctls, 'Teeth', 8, 30, 1, st.Z, (v) => { st.Z = v; build(); }, fmtInt);
      return new Fig(host, (F) => {
        const v = F.v; v.begin();
        const a = P.a;
        v.fit([a / 2 - 0.85, -0.85, a / 2 + 0.85, 0.85], 0.05);
        const phi1 = (F.t * 0.35) % P.span;
        const phi2 = drawPair(v, P, phi1, { centrodes: true });
        const k = P.law.k(phi1), M = P.M;
        for (const ct of contactsNow(P, phi1)) {
          const C = body2ToWorld(rAt(P.r2, ct.psi), ct.psi, phi2, a);
          if (Math.abs(C[1]) > 0.75 || C[0] < a / 2 - 0.8 || C[0] > a / 2 + 0.8) continue;
          const v1 = [C[1], -C[0]];                       /* ω1 = −1 */
          const v2 = [-k * C[1], k * (C[0] - a)];          /* ω2 = +k */
          const vs = [v1[0] - v2[0], v1[1] - v2[1]];
          const s = 0.26;
          arrow(v, C, [v1[0] * s, v1[1] * s], 'rgba(255,176,32,.85)', 1.5, 6);
          arrow(v, C, [v2[0] * s, v2[1] * s], 'rgba(46,196,182,.85)', 1.5, 6);
          arrow(v, C, [vs[0] * s * 2, vs[1] * s * 2], '#5b8dff', 2.1, 7);
          dot(v, C, 3, '#ff5c7a');
        }
        const rp = rAt(P.c1, phi1);
        dot(v, [rp, 0], 4.6, '#a78bfa', '#1a1030');
        label(v, [rp, 0], 'no sliding here', '#a78bfa', 9, -12);
      });
    }
  },

  /* ─────────────────────────────────────────────────────────── 8 ── */
  {
    id: 'teeth', nav: 'Teeth', tag: 'Making it real',
    title: 'Why teeth, and where they come from',
    html: `
<p>Two rolling centrodes transmit motion only through friction, and friction gives up the moment you
ask for torque. Teeth replace friction with geometry: they make slipping impossible instead of
merely undesirable.</p>
<p>There is a sharper way to see why. Contact can only push along the <b>common normal</b>, and for
two curves rolling on each other that normal runs along the line of centres — straight through both
axles. A force through an axle has no moment arm about it, so it produces <b>no torque at all</b>.
That is what the workbench means when it reports a pressure angle of 90° in Roll mode: the contact
is perfect, and perfectly useless for driving anything. Teeth tilt that normal away from the line of
centres, and the tilt is exactly the pressure angle.</p>
<p>The construction barely changes. Put teeth on gear 1 by <b>offsetting its pitch curve along its
own normal</b>, with the teeth spaced evenly in <b>arc length</b> rather than in angle — that is what
keeps them the same size all the way round a non-circular gear. Then run the same envelope sweep.</p>
<p>And here is the part worth pausing on: <b>you never design gear 2's teeth.</b> They fall out of the
envelope, already the right shape, already in the right places, already the right count. The
arithmetic is forced — since the centrodes roll without slipping, equal arc lengths pass the contact
point on both, so gear 2 ends up with</p>
<div class="eq">
<var>Z</var><sub>2</sub> = <var>Z</var><sub>1</sub> ⁄ ratio
<span class="sm">which has to be a whole number, or the teeth will not line up on the second turn</span>
</div>
<p>Change the tooth shape on gear 1 below — sine, trapezoid, square, round pins — and gear 2 answers
each time without being asked. A square-toothed gear gets a mate with the negative of that shape;
round pins get a mate that is a classic lantern-pinion profile. None of it is designed. It is all
the same minimum.</p>`,
    cap: 'Only gear 1 is designed. Gear 2 is whatever is left after gear 1 sweeps through it.',
    fig(host, ctls) {
      const st = { prof: 'trapezoid', Z: 12, h: 0.075, shape: 'ellipseF' };
      let P = null;
      const build = () => {
        const vals = st.shape === 'ellipseF' ? { A: 1, e: 0.3 } : { R: 1, n: 6 };
        P = quickPair(st.shape, vals, {
          m: st.shape === 'ellipseF' ? 1 : 4, N: 620, M: 620, steps: 330,
          teeth: { Z: st.Z, h: st.h, profile: st.prof }
        });
      };
      build();
      const sel = document.createElement('select');
      [['trapezoid', 'Trapezoid (rack-like)'], ['sine', 'Sine'], ['square', 'Square'], ['triangle', 'Triangle'], ['pin', 'Round pins']]
        .forEach(([k, n]) => { const o = document.createElement('option'); o.value = k; o.textContent = n; sel.appendChild(o); });
      sel.value = st.prof;
      sel.onchange = () => { st.prof = sel.value; build(); };
      const r0 = document.createElement('div'); r0.className = 'row'; r0.appendChild(sel); ctls.appendChild(r0);
      const sel2 = document.createElement('select');
      [['ellipseF', 'On an ellipse'], ['square', 'On a rounded square']].forEach(([k, n]) => {
        const o = document.createElement('option'); o.value = k; o.textContent = n; sel2.appendChild(o);
      });
      sel2.onchange = () => { st.shape = sel2.value; build(); };
      const r1 = document.createElement('div'); r1.className = 'row'; r1.appendChild(sel2); ctls.appendChild(r1);
      ctl(ctls, 'Teeth', 6, 28, 1, st.Z, (v) => { st.Z = v; build(); }, fmtInt);
      ctl(ctls, 'Height', 0.02, 0.14, 0.002, st.h, (v) => { st.h = v; build(); });
      return new Fig(host, (F) => {
        const v = F.v; v.begin();
        fitPair(v, P);
        const phi1 = (F.t * 0.32) % P.span;
        drawPair(v, P, phi1, { centrodes: true });
        const ctx = v.ctx;
        ctx.font = '11.5px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = '#6b7488';
        const z2 = st.Z / P.ratio;
        ctx.fillText('Z₁ = ' + st.Z + '   →   Z₂ = ' + z2.toFixed(2) +
          (Math.abs(z2 - Math.round(z2)) < 0.02 ? '  ✓' : '  — not a whole number'), 10, 8);
      });
    }
  },

  /* ─────────────────────────────────────────────────────────── 9 ── */
  {
    id: 'fails', nav: 'When it fails', tag: 'Limits',
    title: 'Shapes that cannot be geared',
    html: `
<p>The construction always returns <em>something</em>. That something is not always a gear. Four
distinct ways it goes wrong, all visible in the workbench:</p>
<ul>
<li><b>Not star-shaped.</b> If a ray from the axle crosses the outline more than once, the shape has
an overhang that no rotation can present to a mate. Polar <var>r</var>(<var>θ</var>) is not even
well defined.</li>
<li><b>Failure to close.</b> Covered in chapter 3 — the wrong centre distance leaves a spiral.</li>
<li><b>Interference and undercut.</b> The ideal mate from the rolling ODE says one thing; the
envelope sweep says gear 1 has already swept through part of it. The sweep wins, because it is
physical. What is left is a mate that is cut away near the roots — exactly the undercut that plagues
small involute pinions.</li>
<li><b>Sharp corners.</b> A corner has no well-defined normal, so the law of gearing has nothing to
say there. The envelope handles it, but the mate acquires a matching sharp feature and the contact
stress goes through the roof.</li>
</ul>
<p>The figure shows the third case. The dashed curve is the ideal mate the ODE asks for; the solid
one is what the sweep can actually deliver. The shaded band between them is material that gear 1
would have collided with. Deepen the star's valleys and watch the band open up.</p>`,
    cap: 'Dashed: the ideal rolling mate. Solid: what survives the sweep. Red: the difference.',
    fig(host, ctls) {
      const st = { k: 0.45, N: 5, sm: 0.03 };
      let P = null;
      const build = () => { P = quickPair('star', { R: 1, N: st.N, k: st.k }, { m: st.N, N: 460, M: 460, steps: 280, smooth: st.sm }); };
      build();
      ctl(ctls, 'Valley depth', 0.25, 0.95, 0.01, st.k, (v) => { st.k = v; build(); });
      ctl(ctls, 'Points', 3, 9, 1, st.N, (v) => { st.N = v; build(); }, fmtInt);
      ctl(ctls, 'Smoothing', 0, 0.35, 0.005, st.sm, (v) => { st.sm = v; build(); });
      return new Fig(host, (F) => {
        const v = F.v, c = v.begin();
        const R2 = Math.max(rMax(P.mate.r), rMax(P.r2)) * 1.2;
        v.fit([-R2, -R2, R2, R2], 0.07);
        /* the band between the ideal mate and the achievable one */
        c.beginPath();
        polarSubPath(v, P.mate.r, 0, 0, 0);
        polarSubPath(v, P.r2, 0, 0, 0);
        c.fillStyle = 'rgba(255,92,122,.28)'; c.fill('evenodd');
        strokePolar(v, P.mate.r, 0, 0, 0, 'rgba(46,196,182,.65)', 1.4, [5, 4]);
        fillPolar(v, P.r2, 0, 0, 0, 'rgba(46,196,182,.10)', '#2ec4b6', 2);
        axle(v, [0, 0], '#2ec4b6');
        let worst = 0;
        for (let i = 0; i < P.M; i++) worst = Math.max(worst, P.mate.r[i] - P.r2[i]);
        const ctx = v.ctx;
        ctx.font = '11.5px "Segoe UI",system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = worst / P.a > 0.015 ? '#ff5c7a' : worst / P.a > 0.0015 ? '#e8a33d' : '#3ccf8e';
        ctx.fillText('removed by interference: ' + (worst / P.a * 100).toFixed(2) + '% of the centre distance', 10, 8);
      });
    }
  },

  /* ────────────────────────────────────────────────────────── 10 ── */
  {
    id: 'involute', nav: 'The involute', tag: 'The special case', tagClass: 'a',
    title: 'Why almost every real gear is an involute',
    html: `
<p>Everything so far works for any ratio, constant or not. Industry, though, almost always wants a
<b>constant</b> ratio — and among the infinitely many tooth shapes that deliver one, a single family
won.</p>
<p>Take the curve traced by the end of a string unwound from a circle: the <b>involute</b>. Use it as
a tooth flank and the law of gearing is satisfied in the strongest possible way — the common normal
is not merely passing through the pitch point, it is <b>the same straight line at every instant</b>,
tangent to both base circles. That line is the <b>line of action</b>, and the angle it makes with the
pitch tangent is the <b>pressure angle</b>, constant by construction.</p>
<p>The consequences are what made it universal:</p>
<ul>
<li><b>Centre distance does not matter.</b> Pull the axles apart and the pitch circles grow, the
pressure angle rises — and the ratio does not budge. No other profile forgives assembly error like
that.</li>
<li><b>One cutter makes every gear</b> of a given module, because the involute is generated by a
straight-sided rack. That is also why undercut appears on small tooth counts: the rack's corner
sweeps into the flank below the base circle.</li>
<li>Contact runs along a straight line, so load direction is constant and bearings see a steady force.</li>
</ul>
<p>Pick the involute gear in the workbench and generate its conjugate. The sweep returns another
involute gear — it was never told to. Then drag the centre distance off its nominal value and watch
the ratio plot stay perfectly flat.</p>`,
    cap: 'The straight red line of action is tangent to both base circles and never moves.',
    fig(host, ctls) {
      const st = { z1: 12, z2: 20, al: 20 };
      let P = null, meta = null;
      const build = () => {
        const vals = { z: st.z1, m: 0.16, alpha: st.al, x: 0 };
        const prof = involuteProfile(vals, 620);
        meta = prof.meta;
        const c1 = new Float64Array(620).fill(meta.rp);
        const ratio = st.z1 / st.z2;
        const a = solveCenterDistance(c1, ratio);
        const law = buildLaw(c1, a);
        const span = TAU / law.ratio;
        const conj = conjugate(prof, law, a, 620, span, 360);
        P = { c1, prof1: prof, a, law, mate: mateCentrode(c1, a, 620, law), conj, span, M: 620, r2: conj.r, ratio: law.ratio };
      };
      build();
      ctl(ctls, 'Teeth, gear 1', 8, 24, 1, st.z1, (v) => { st.z1 = v; build(); }, fmtInt);
      ctl(ctls, 'Teeth, gear 2', 10, 36, 1, st.z2, (v) => { st.z2 = v; build(); }, fmtInt);
      ctl(ctls, 'Pressure angle', 14, 28, 0.5, st.al, (v) => { st.al = v; build(); });
      return new Fig(host, (F) => {
        const v = F.v; v.begin();
        fitPair(v, P, 0.05);
        const phi1 = (F.t * 0.3) % P.span;
        const phi2 = drawPair(v, P, phi1, { centrodes: true });
        /* base circles and the line of action tangent to both */
        const al = st.al / DEG, rb1 = meta.rb, rb2 = (P.a - meta.rp) * Math.cos(al);
        circle(v, [0, 0], rb1, null, 'rgba(255,176,32,.35)', 1, [3, 3]);
        circle(v, [P.a, 0], rb2, null, 'rgba(46,196,182,.35)', 1, [3, 3]);
        const rp = meta.rp;
        /* the line of action passes through the pitch point at angle al from the pitch tangent */
        const P0 = [rp, 0], dx = Math.sin(al), dy = Math.cos(al);
        const L = Math.max(rp, P.a - rp) * 1.15;
        line(v, [P0[0] - dx * L, P0[1] - dy * L], [P0[0] + dx * L, P0[1] + dy * L], 'rgba(255,92,122,.8)', 1.6);
        dot(v, P0, 4.6, '#a78bfa', '#1a1030');
        label(v, P0, 'line of action, ' + st.al.toFixed(1) + '°', '#ff5c7a', 10, 14);
      });
    }
  }
];

/* ── build the Learn tab ─────────────────────────────────────────── */

function buildLearn() {
  const host = document.getElementById('chapters');
  const toc = document.getElementById('toc');
  host.innerHTML = ''; toc.innerHTML = '';

  CHAPTERS.forEach((ch, i) => {
    const b = document.createElement('button');
    b.textContent = (i + 1) + '. ' + ch.nav;
    b.onclick = () => {
      document.getElementById(ch.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    toc.appendChild(b);

    const sec = document.createElement('section');
    sec.className = 'chap'; sec.id = ch.id;
    const left = document.createElement('div');
    left.innerHTML = '<span class="tag ' + (ch.tagClass || '') + '">' + ch.tag + '</span>' +
      '<h2 class="ch"><span class="chnum">' + (i + 1) + '</span>' + ch.title + '</h2>' + ch.html;
    const right = document.createElement('div');
    const figbox = document.createElement('div'); figbox.className = 'fig';
    const cv = document.createElement('canvas');
    const ctls = document.createElement('div'); ctls.className = 'figctl';
    figbox.append(cv, ctls);
    right.appendChild(figbox);
    if (ch.cap) {
      const cap = document.createElement('div'); cap.className = 'figcap'; cap.textContent = ch.cap;
      right.appendChild(cap);
    }
    if (ch.id === 'conjugate' || ch.id === 'involute') {
      const t = document.createElement('button');
      t.className = 'tryit';
      t.innerHTML = '&rarr; Open this in the workbench';
      t.onclick = () => {
        showTab('studio');
        if (ch.id === 'involute') selectShape('involute'); else selectShape('square');
        if (ch.id === 'conjugate') { S.ov.ghosts = true; document.querySelector('[data-ov=ghosts]').checked = true; }
      };
      right.appendChild(t);
    }
    sec.append(left, right);
    host.appendChild(sec);
    /* the figure builds itself once the canvas is in the document */
    setTimeout(() => { try { ch.fig(cv, ctls); } catch (e) { console.error(ch.id, e); } }, 0);
  });

  /* highlight the chapter in view */
  if ('IntersectionObserver' in window) {
    const btns = [...toc.children];
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        const i = CHAPTERS.findIndex(c => c.id === e.target.id);
        btns.forEach((b, k) => b.classList.toggle('on', k === i));
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    CHAPTERS.forEach(c => { const el = document.getElementById(c.id); if (el) io.observe(el); });
  }
}
