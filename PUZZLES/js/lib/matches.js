/* The Puzzle Cabinet · js/lib/matches.js
 *
 * What the two matchstick engines (matchsticks, matcheq) share: the look of a
 * match (a wooden stick with a red-brown head, lit from the top left, with a
 * soft shadow), the matchbox that holds taken-away and spare matches, a glide
 * animation for a match settling into place, and small SVG helpers for the
 * family-page pictures.
 *
 * A match is a workbench piece of type 'match': its pivot is the middle of
 * the stick, the stick lies along the local x axis and the head is at +x.
 * Length on the table: 1 world unit (drawn a little shorter, so matches that
 * meet end to end show a hairline gap, as real ones do).
 *
 * Node-safe: nothing here touches the page until install() is called.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;
  const K = C.matchKit = {};

  K.LEN = 0.93;       // drawn length of a match
  K.W = 0.078;        // drawn thickness
  const LIGHT = G.norm([-0.45, -0.9]);   // light comes from the top left

  /* ---------- drawing on the workbench ---------- */

  // gradients, a shadow blur and the 'match' piece type, once per workbench
  K.install = function (wb) {
    if (wb.__matchKit) return wb.__matchKit;
    const id = wb.id + '-mk';
    const S = (t, a, p) => C.s(t, a, p);
    const defs = wb.defs;
    const lin = (gid, stops) => {
      const g = S('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      stops.forEach((s) => S('stop', { offset: s[0], 'stop-color': s[1] }, g));
    };
    lin(id + '-w', [[0, '#fbe3b0'], [0.3, '#ebc584'], [0.75, '#d49f5c'], [1, '#a8733b']]);
    lin(id + '-wr', [[0, '#a8733b'], [0.25, '#d49f5c'], [0.7, '#ebc584'], [1, '#fbe3b0']]);
    const rad = (gid, cy) => {
      const g = S('radialGradient', { id: gid, cx: 0.4, cy, r: 0.78, fx: 0.4, fy: cy }, defs);
      [[0, '#f0735a'], [0.35, '#c4321f'], [0.8, '#7a1a10'], [1, '#521009']].forEach((s) => S('stop', { offset: s[0], 'stop-color': s[1] }, g));
    };
    rad(id + '-h', 0.3);
    rad(id + '-hr', 0.7);
    const f = S('filter', { id: id + '-s', x: '-20%', y: '-150%', width: '140%', height: '400%' }, defs);
    S('feGaussianBlur', { stdDeviation: 0.018 }, f);

    const L = K.LEN, W = K.W, hl = L / 2;
    wb.type('match', {
      poly() { return [[-hl, -W / 2 - 0.01], [hl + 0.02, -W / 2 - 0.01], [hl + 0.02, W / 2 + 0.01], [-hl, W / 2 + 0.01]]; },
      draw(g, o) {
        const rot = o.rot || 0;
        const up = G.rot([0, -1], rot);
        const lit = up[0] * LIGHT[0] + up[1] * LIGHT[1] > -0.05;
        const off = G.rot([0.026, 0.042], -rot);
        if (!(o.data && o.data.noShadow)) {
          S('rect', { x: -hl + off[0], y: -W / 2 + off[1], width: L + 0.02, height: W, rx: W / 2, class: 'mk-shadow', filter: 'url(#' + id + '-s)' }, g);
        }
        const body = S('rect', { x: -hl, y: -W / 2, width: L - 0.03, height: W, rx: 0.016, class: 'mk-body', fill: o.fill || 'url(#' + id + (lit ? '-w' : '-wr') + ')' }, g);
        if (o.fill) body.setAttribute('fill-opacity', 0.9);
        S('line', { x1: -hl + 0.05, y1: (lit ? 1 : -1) * W * 0.18, x2: hl - 0.2, y2: (lit ? 1 : -1) * W * 0.12, class: 'mk-grain' }, g);
        S('line', { x1: -hl + 0.02, y1: (lit ? -1 : 1) * W * 0.3, x2: hl - 0.14, y2: (lit ? -1 : 1) * W * 0.3, class: 'mk-shine' }, g);
        S('ellipse', { cx: hl - 0.064, cy: 0, rx: 0.068, ry: W * 0.8, class: 'mk-head', fill: 'url(#' + id + (lit ? '-h' : '-hr') + ')' }, g);
        S('ellipse', { cx: hl - 0.075, cy: (lit ? -1 : 1) * W * 0.32, rx: 0.024, ry: 0.01, class: 'mk-glint' }, g);
        // the grab area: a little wider than the stick (no stroke: the workbench makes hit strokes clickable)
        S('rect', { class: 'wb-hit', x: -hl + 0.02, y: -0.15, width: L - 0.02, height: 0.3, 'stroke-width': 0 }, g);
      }
    });
    wb.__matchKit = { id };
    return wb.__matchKit;
  };

  // a ghost of a match (where a dragged match will land, or a hint's destination)
  K.ghost = function (parent, a, b, cls) {
    const mid = G.mid(a, b), ang = G.angle(G.sub(b, a));
    const g = C.s('g', { class: 'mk-ghost ' + (cls || ''), transform: 'translate(' + C.fmtNum(mid[0]) + ' ' + C.fmtNum(mid[1]) + ') rotate(' + C.fmtNum(ang) + ')' }, parent);
    C.s('rect', { x: -K.LEN / 2, y: -K.W / 2 - 0.012, width: K.LEN, height: K.W + 0.024, rx: 0.04 }, g);
    return g;
  };

  // the angle of a segment, turned by 180° if that is nearer the angle the match has now (so its head stays put)
  K.facing = function (ang, cur) {
    const a = G.normDeg(ang), b = G.normDeg(ang + 180);
    const d = (x) => { let t = Math.abs(G.normDeg(x) - G.normDeg(cur || 0)); return t > 180 ? 360 - t : t; };
    return d(a) <= d(b) ? a : b;
  };

  // glide a piece from an earlier placement to where it is now (o.x, o.y, o.rot already final)
  const anims = {};
  K.glide = function (wb, o, from, ms, done) {
    K.stop(o.id);
    if (!o.el) { if (done) done(); return; }
    ms = C.anim(ms == null ? 170 : ms);
    const to = { x: o.x, y: o.y, rot: o.rot || 0 };
    let dr = G.normDeg(to.rot - (from.rot || 0)); if (dr > 180) dr -= 360;
    const t0 = (root.performance ? root.performance.now() : Date.now());
    const lift = Math.min(0.08, 0.02 + G.dist([from.x, from.y], [to.x, to.y]) * 0.015);
    const rec = anims[o.id] = { done, stop: false };
    const frame = (now) => {
      if (rec.stop) return;
      const el = wb.get(o.id) === o ? o.el : null;
      if (!el) { delete anims[o.id]; return; }
      const k = ms <= 0 ? 1 : Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      if (k < 1) {
        const t = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, rot: (from.rot || 0) + dr * e, scale: 1 + lift * Math.sin(Math.PI * k) };
        el.setAttribute('transform', G.svgTransform(t));
        root.requestAnimationFrame(frame);
      } else {
        delete anims[o.id];
        wb.place(o);
        if (done) done();
      }
    };
    const t = { x: from.x, y: from.y, rot: from.rot || 0 };
    o.el.setAttribute('transform', G.svgTransform(t));
    root.requestAnimationFrame(frame);
  };
  K.stop = function (id) { const r = anims[id]; if (r) { r.stop = true; delete anims[id]; } };
  K.busy = function () { return Object.keys(anims).length > 0; };

  // the matchbox: an open drawer of a matchbox with a striking strip
  K.tray = function (parent, box, label, sub) {
    const S = (t, a, p) => C.s(t, a, p);
    const g = S('g', { class: 'mk-tray' }, parent);
    S('rect', { x: box.x + 0.05, y: box.y + 0.08, width: box.w, height: box.h, rx: 0.1, class: 'mk-tray-shadow' }, g);
    S('rect', { x: box.x, y: box.y, width: box.w, height: box.h, rx: 0.1, class: 'mk-tray-out' }, g);
    S('rect', { x: box.x + 0.09, y: box.y + 0.09, width: box.w - 0.18, height: box.h - 0.18, rx: 0.05, class: 'mk-tray-in' }, g);
    // the striker along the bottom edge
    S('rect', { x: box.x + 0.14, y: box.y + box.h - 0.075, width: box.w - 0.28, height: 0.05, rx: 0.02, class: 'mk-striker' }, g);
    K.text(g, box.x + box.w / 2, box.y - 0.14, label, 0.24, 'mk-tray-label');
    if (sub) K.text(g, box.x + box.w / 2, box.y + box.h + 0.3, sub, 0.2, 'mk-tray-sub');
    return g;
  };

  // text on the table at a size in world units (drawn scaled up, so the browser never clamps a tiny font)
  K.text = function (parent, x, y, str, size, cls, anchor) {
    const k = size / 20;
    const t = C.s('text', { x: C.fmtNum(x / k), y: C.fmtNum(y / k), transform: 'scale(' + k + ')', class: cls || '', 'text-anchor': anchor || 'middle', 'font-size': 20 }, parent);
    t.textContent = str;
    return t;
  };
  // where the i-th of n matches lies in the box (horizontal, heads alternating)
  K.traySpot = function (box, i, n) {
    const inner = box.h - 0.34;
    const step = n <= 1 ? 0 : Math.min(0.21, inner / Math.max(1, n - 1));
    const y0 = box.y + box.h / 2 - step * (n - 1) / 2;
    return { x: box.x + box.w / 2 + (i % 2 ? 0.04 : -0.04), y: y0 + i * step, rot: i % 2 ? 180 : 0 };
  };

  /* ---------- pictures for the family pages ---------- */

  // one match from a to b (head at b) as SVG markup; s = thickness scale
  K.svgMatch = function (a, b, s) {
    s = s || 1;
    const d = G.sub(b, a), len = G.len(d) || 1, u = [d[0] / len, d[1] / len];
    const a1 = [a[0] + u[0] * 0.04, a[1] + u[1] * 0.04], b1 = [b[0] - u[0] * 0.1, b[1] - u[1] * 0.1];
    const h = [b[0] - u[0] * 0.07, b[1] - u[1] * 0.07];
    const f = C.fmtNum;
    return '<line x1="' + f(a1[0]) + '" y1="' + f(a1[1]) + '" x2="' + f(b1[0]) + '" y2="' + f(b1[1]) + '" stroke="#e2b36e" stroke-width="' + f(0.1 * s) + '" stroke-linecap="round"/>' +
      '<circle cx="' + f(h[0]) + '" cy="' + f(h[1]) + '" r="' + f(0.075 * s) + '" fill="#c0392b"/>';
  };
  K.svgOpen = function (b, pad) {
    const f = C.fmtNum;
    return '<svg viewBox="' + f(b.x0 - pad) + ' ' + f(b.y0 - pad) + ' ' + f(b.w + 2 * pad) + ' ' + f(b.h + 2 * pad) + '" preserveAspectRatio="xMidYMid meet">';
  };

  /* ---------- styles ---------- */

  C.css('matchkit', `
    .k-match .mk-shadow { fill: rgba(0, 0, 0, .5); }
    [data-theme="light"] .k-match .mk-shadow { fill: rgba(60, 40, 10, .38); }
    .k-match .mk-body { stroke: rgba(70, 40, 10, .45); stroke-width: .008; }
    .k-match .mk-grain { stroke: rgba(130, 80, 30, .28); stroke-width: .007; stroke-linecap: round; }
    .k-match .mk-shine { stroke: rgba(255, 255, 255, .28); stroke-width: .01; stroke-linecap: round; }
    .k-match .mk-head { stroke: rgba(40, 5, 0, .5); stroke-width: .008; }
    .k-match .mk-glint { fill: rgba(255, 255, 255, .5); }
    .k-match.drag .mk-shadow { opacity: 0; }
    .k-match.sel .mk-body { stroke: var(--accent); stroke-width: .018; }
    .wb-obj.k-match.sel { filter: none; }
    .wb-obj.k-match.drag { filter: none; }
    .k-match.mk-hint .mk-body, .k-match.mk-hint .mk-head { stroke: var(--gold); stroke-width: .03; animation: mkpulse .7s ease-in-out infinite; }
    .k-match.mk-wrong .mk-body { stroke: var(--red); stroke-width: .03; }
    .k-match.fixed { cursor: default; }
    @keyframes mkpulse { 50% { stroke-opacity: .25; } }
    .mk-ghost rect { fill: rgba(255, 209, 102, .16); stroke: var(--gold); stroke-width: .022; stroke-dasharray: .07 .05; }
    .mk-ghost.hint rect { fill: rgba(78, 203, 141, .16); stroke: var(--green); animation: mkpulse .8s ease-in-out infinite; }
    .mk-ghost.back rect { fill: none; stroke: var(--muted); stroke-dasharray: .04 .06; }
    .mk-tray-shadow { fill: rgba(0, 0, 0, .3); }
    .mk-tray-out { fill: #d9c49a; stroke: #8c6d3f; stroke-width: .025; }
    .mk-tray-in { fill: #4a3320; stroke: #2e1f12; stroke-width: .02; }
    [data-theme="light"] .mk-tray-in { fill: #5a3e26; }
    .mk-striker { fill: #7a3b22; opacity: .85; }
    .mk-tray.hot .mk-tray-out { stroke: var(--gold); stroke-width: .06; }
    .mk-tray-label { font-weight: 600; font-family: "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .mk-tray-sub { font-weight: 600; font-family: "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
