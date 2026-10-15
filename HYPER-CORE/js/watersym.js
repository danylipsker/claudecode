/* HYPER-CORE · watersym.js — drawing water, for the simulations of Hyper Water (kit.wsym).
 *
 *   const S = kit.wsym;
 *   S.molecule(ctx, x, y, { angle, scale, charges, labels, alpha, lone })   a bent H₂O: angle = direction of the bisector (rad), scale = px per Å
 *   S.hbond(ctx, x1, y1, x2, y2, { color, alpha, width })                   a dashed hydrogen bond
 *   S.makeNetwork(n, W, H, scale, seed)   [{ x, y, a, vx, vy, va }]  random molecules in a box (positions in px, a = orientation)
 *   S.stepNetwork(net, dt, { T, W, H, scale })   jiggle them: Brownian motion scaled by temperature, with soft repulsion and a pull between
 *                                                partners that can bond; keeps them in the box
 *   S.bondsOf(net, scale)                  the bonds [i, j, k]: donor i's hydrogen k points at acceptor j, close enough and aligned
 *   S.network(ctx, net, { scale, T, bonds, highlight })   draws the bonds then the molecules
 *   S.iceLattice(ctx, cx, cy, a, rings, { angle, molecules, color })   the hexagonal (basal-plane) lattice of ice Ih, `rings` hexagons across
 *   S.snowflake(ctx, cx, cy, r, complexity, { color, seed })             a six-fold dendrite
 *   S.drop(ctx, x, y, r, { color, highlight })                            a shaded drop
 *   S.beaker(ctx, x, y, w, h, fill, { color, label, liquid })             a beaker filled to `fill` (0..1)
 *   S.thermometer(ctx, x, y, h, T, { min, max, color, label })            a thermometer reading T °C
 *   S.waves(ctx, x0, y, x1, amp, phase, { color, n })                     a wavy surface line
 *   S.molColor()  { O, H, bond }                                         the CPK-ish colours used here
 * Everything draws in the theme's colours where a colour is not given; oxygen is CPK red, hydrogen white-grey.
 */
(function () {
  'use strict';
  const H = typeof Hyper !== 'undefined' ? Hyper : (window.Hyper = window.Hyper || {});
  const S = {};
  const TAU = Math.PI * 2;
  const HALF = 104.45 / 2 * Math.PI / 180;      // half the H–O–H angle
  const colors = () => (H.ui && H.ui.colors ? H.ui.colors() : { text: '#ccc', muted: '#999', faint: '#666', accent: '#4aa3ff', bg2: '#222', surface: '#333', ok: '#3c6', bad: '#e55', warn: '#eb4' });
  S.molColor = () => ({ O: '#e8503a', H: '#e9eef3', Hstroke: '#9aa4ad', bond: '#777' });

  /* ---------------------------------------------------------------- one molecule */
  S.molecule = function (ctx, x, y, o) {
    o = o || {};
    const sc = o.scale || 18, a = o.angle || 0, cc = S.molColor(), alpha = o.alpha == null ? 1 : o.alpha;
    const rO = 0.42 * sc, rH = 0.26 * sc, L = 0.96 * sc;       // oxygen and hydrogen radii (drawn smaller than van der Waals), O–H length
    const hx1 = x + L * Math.cos(a - HALF), hy1 = y + L * Math.sin(a - HALF);
    const hx2 = x + L * Math.cos(a + HALF), hy2 = y + L * Math.sin(a + HALF);
    ctx.save();
    ctx.globalAlpha = alpha;
    // bonds
    ctx.strokeStyle = cc.bond; ctx.lineWidth = Math.max(1, 0.14 * sc); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(hx1, hy1); ctx.moveTo(x, y); ctx.lineTo(hx2, hy2); ctx.stroke();
    // lone pairs: two small lobes on the far side
    if (o.lone) {
      ctx.fillStyle = 'rgba(120,170,255,0.35)';
      for (const s of [-1, 1]) {
        const la = a + Math.PI + s * 0.95, lx = x + 0.75 * sc * Math.cos(la), ly = y + 0.75 * sc * Math.sin(la);
        ctx.beginPath(); ctx.ellipse(lx, ly, 0.34 * sc, 0.2 * sc, la, 0, TAU); ctx.fill();
      }
    }
    // hydrogens, then oxygen on top
    for (const [hx, hy] of [[hx1, hy1], [hx2, hy2]]) {
      ctx.fillStyle = cc.H; ctx.beginPath(); ctx.arc(hx, hy, rH, 0, TAU); ctx.fill();
      ctx.strokeStyle = cc.Hstroke; ctx.lineWidth = 1; ctx.stroke();
    }
    const g = ctx.createRadialGradient ? ctx.createRadialGradient(x - rO * 0.35, y - rO * 0.35, rO * 0.1, x, y, rO) : null;
    if (g && g.addColorStop) { g.addColorStop(0, '#ff8a70'); g.addColorStop(1, cc.O); ctx.fillStyle = g; } else ctx.fillStyle = cc.O;
    ctx.beginPath(); ctx.arc(x, y, rO, 0, TAU); ctx.fill();
    if (o.charges) {
      const C = colors();
      ctx.font = Math.max(9, 0.5 * sc) + 'px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = C.text;
      ctx.fillText('δ−', x - 0.9 * sc * Math.cos(a), y - 0.9 * sc * Math.sin(a));
      for (const [hx, hy] of [[hx1, hy1], [hx2, hy2]]) ctx.fillText('δ+', hx + 0.55 * sc * Math.cos(Math.atan2(hy - y, hx - x)), hy + 0.55 * sc * Math.sin(Math.atan2(hy - y, hx - x)));
    }
    if (o.labels) {
      ctx.font = Math.max(8, 0.42 * sc) + 'px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff'; ctx.fillText('O', x, y);
      ctx.fillStyle = '#333'; ctx.fillText('H', hx1, hy1); ctx.fillText('H', hx2, hy2);
    }
    ctx.restore();
    return { O: [x, y], H: [[hx1, hy1], [hx2, hy2]], lone: [[x + 0.75 * sc * Math.cos(a + Math.PI - 0.95), y + 0.75 * sc * Math.sin(a + Math.PI - 0.95)], [x + 0.75 * sc * Math.cos(a + Math.PI + 0.95), y + 0.75 * sc * Math.sin(a + Math.PI + 0.95)]] };
  };

  S.hbond = function (ctx, x1, y1, x2, y2, o) {
    o = o || {};
    ctx.save();
    ctx.strokeStyle = o.color || colors().accent; ctx.globalAlpha = o.alpha == null ? 0.8 : o.alpha;
    ctx.lineWidth = o.width || 1.6; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  };

  /* ---------------------------------------------------------------- a flickering network */
  function rng(seed) { let s = (seed == null ? 12345 : seed) >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  S.makeNetwork = function (n, W, Hh, scale, seed) {
    const r = rng(seed), net = [];
    const sc = scale || 18;
    // start on a jittered grid so molecules do not overlap
    const cols = Math.max(1, Math.round(Math.sqrt(n * W / Math.max(1, Hh)))), rows = Math.max(1, Math.ceil(n / cols));
    for (let i = 0; i < n; i++) {
      const cx = ((i % cols) + 0.5) * W / cols, cy = (Math.floor(i / cols) + 0.5) * Hh / rows;
      net.push({ x: cx + (r() - 0.5) * 0.4 * W / cols, y: cy + (r() - 0.5) * 0.4 * Hh / rows, a: r() * TAU, vx: 0, vy: 0, va: 0, sc });
    }
    net.rng = r;
    return net;
  };
  /* the geometry of a possible bond between molecule i (donor hydrogen) and j (acceptor oxygen) */
  function hOf(m, k) { return [m.x + 0.96 * m.sc * Math.cos(m.a + (k ? HALF : -HALF)), m.y + 0.96 * m.sc * Math.sin(m.a + (k ? HALF : -HALF))]; }
  S.bondsOf = function (net, scale) {
    const sc = scale || (net[0] && net[0].sc) || 18, out = [], max = 2.2 * sc;
    for (let i = 0; i < net.length; i++) for (let j = 0; j < net.length; j++) {
      if (i === j) continue;
      const a = net[i], b = net[j];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d > max || d < 1.2 * sc) continue;
      // a hydrogen of a must point at the oxygen of b, and b's lone-pair side must face a
      for (let k = 0; k < 2; k++) {
        const h = hOf(a, k), hd = Math.hypot(b.x - h[0], b.y - h[1]);
        const toH = Math.atan2(h[1] - a.y, h[0] - a.x), toB = Math.atan2(dy, dx);
        let da = Math.abs(((toH - toB) % TAU + TAU) % TAU); if (da > Math.PI) da = TAU - da;
        const back = Math.atan2(-dy, -dx), lone = b.a + Math.PI;
        let db = Math.abs(((back - lone) % TAU + TAU) % TAU); if (db > Math.PI) db = TAU - db;
        if (hd < 1.4 * sc && da < 0.5 && db < 1.3) { out.push([i, j, k]); break; }
      }
    }
    return out;
  };
  S.stepNetwork = function (net, dt, o) {
    o = o || {};
    const T = o.T == null ? 25 : o.T, sc = o.scale || (net[0] && net[0].sc) || 18, W = o.W || 400, Hh = o.H || 300;
    const r = net.rng || (net.rng = rng(7));
    const kT = Math.max(0.05, (T + 273.15) / 298.15);          // thermal agitation relative to 25 °C
    const jig = 40 * sc * kT, damp = Math.exp(-6 * dt);
    const bonds = S.bondsOf(net, sc);
    const pull = new Map();
    for (const [i, j] of bonds) { pull.set(i, (pull.get(i) || 0) + 1); pull.set(j, (pull.get(j) || 0) + 1); }
    for (let i = 0; i < net.length; i++) {
      const m = net[i];
      // random kicks
      m.vx += (r() - 0.5) * jig * dt * 2; m.vy += (r() - 0.5) * jig * dt * 2; m.va += (r() - 0.5) * 30 * kT * dt;
      // soft repulsion from neighbours; attraction along bonds
      for (let j = 0; j < net.length; j++) {
        if (j === i) continue;
        const n = net[j], dx = n.x - m.x, dy = n.y - m.y, d = Math.hypot(dx, dy) || 1e-6;
        if (d < 1.5 * sc) { const f = (1.5 * sc - d) * 60; m.vx -= f * dx / d * dt; m.vy -= f * dy / d * dt; }
      }
    }
    for (const [i, j, k] of bonds) {
      const a = net[i], b = net[j], h = hOf(a, k);
      const dx = b.x - h[0], dy = b.y - h[1], d = Math.hypot(dx, dy) || 1e-6, f = (d - 0.9 * sc) * 25 / Math.max(0.3, kT);
      a.vx += f * dx / d * dt; a.vy += f * dy / d * dt; b.vx -= f * dx / d * dt; b.vy -= f * dy / d * dt;
      // turn the acceptor so its lone pairs face the donor, gently
      const want = Math.atan2(a.y - b.y, a.x - b.x) + Math.PI;
      let da = ((want - b.a) % TAU + TAU) % TAU; if (da > Math.PI) da -= TAU;
      b.va += da * 2 * dt;
    }
    for (const m of net) {
      m.vx *= damp; m.vy *= damp; m.va *= damp;
      m.x += m.vx * dt; m.y += m.vy * dt; m.a += m.va * dt;
      if (m.x < 0.6 * sc) { m.x = 0.6 * sc; m.vx = Math.abs(m.vx); } if (m.x > W - 0.6 * sc) { m.x = W - 0.6 * sc; m.vx = -Math.abs(m.vx); }
      if (m.y < 0.6 * sc) { m.y = 0.6 * sc; m.vy = Math.abs(m.vy); } if (m.y > Hh - 0.6 * sc) { m.y = Hh - 0.6 * sc; m.vy = -Math.abs(m.vy); }
      if (!Number.isFinite(m.x)) m.x = W / 2; if (!Number.isFinite(m.y)) m.y = Hh / 2; if (!Number.isFinite(m.a)) m.a = 0;
    }
    return bonds;
  };
  S.network = function (ctx, net, o) {
    o = o || {};
    const sc = o.scale || (net[0] && net[0].sc) || 18;
    const bonds = o.bonds || S.bondsOf(net, sc);
    for (const [i, j, k] of bonds) { const h = hOf(net[i], k); S.hbond(ctx, h[0], h[1], net[j].x, net[j].y, { alpha: 0.7 }); }
    for (let i = 0; i < net.length; i++) S.molecule(ctx, net[i].x, net[i].y, { angle: net[i].a, scale: sc, alpha: o.highlight && o.highlight !== i ? 0.35 : 1 });
    return bonds;
  };

  /* ---------------------------------------------------------------- ice */
  /* the basal plane of ice Ih: a honeycomb of oxygens, bond length a (px); `rings` = hexagons from centre to edge */
  S.iceLattice = function (ctx, cx, cy, a, rings, o) {
    o = o || {};
    const C = colors(), col = o.color || C.accent, rot = o.angle || 0;
    const pts = [], seen = new Set();
    const R = rings == null ? 3 : rings;
    // honeycomb vertices as two interleaved triangular sublattices
    for (let i = -R - 1; i <= R + 1; i++) for (let j = -R - 1; j <= R + 1; j++) {
      const bx = a * Math.sqrt(3) * (i + j / 2), by = a * 1.5 * j;
      for (const s of [0, 1]) {
        const px = bx, py = by + (s ? a : 0);
        if (Math.hypot(px, py) > R * a * Math.sqrt(3) + 0.5 * a) continue;
        const key = Math.round(px * 10) + ',' + Math.round(py * 10);
        if (seen.has(key)) continue; seen.add(key);
        pts.push([cx + px * Math.cos(rot) - py * Math.sin(rot), cy + px * Math.sin(rot) + py * Math.cos(rot)]);
      }
    }
    ctx.save();
    ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.8;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (Math.abs(d - a) < 0.05 * a) { ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
    for (const p of pts) {
      if (o.molecules) S.molecule(ctx, p[0], p[1], { angle: Math.atan2(p[1] - cy, p[0] - cx) + 0.5, scale: a * 0.42 });
      else { ctx.fillStyle = S.molColor().O; ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(2, a * 0.14), 0, TAU); ctx.fill(); }
    }
    ctx.restore();
    return pts;
  };
  S.snowflake = function (ctx, cx, cy, r, complexity, o) {
    o = o || {};
    const C = colors(), col = o.color || C.accent, rr = rng(o.seed == null ? 3 : o.seed);
    const k = complexity == null ? 0.5 : complexity;
    const arms = [];
    const n = 2 + Math.round(k * 4);
    for (let i = 0; i < n; i++) arms.push({ at: 0.25 + 0.7 * (i / n) + 0.05 * rr(), len: (0.15 + 0.35 * rr()) * r * (1 - 0.5 * i / n), ang: 1.05 });
    ctx.save();
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, r / 30); ctx.lineCap = 'round';
    for (let s = 0; s < 6; s++) {
      const a = s * Math.PI / 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); ctx.stroke();
      for (const b of arms) {
        const bx = cx + r * b.at * Math.cos(a), by = cy + r * b.at * Math.sin(a);
        for (const sg of [-1, 1]) {
          ctx.beginPath(); ctx.moveTo(bx, by);
          ctx.lineTo(bx + b.len * Math.cos(a + sg * b.ang), by + b.len * Math.sin(a + sg * b.ang)); ctx.stroke();
        }
      }
    }
    // a hexagonal plate at the centre
    ctx.beginPath();
    for (let s = 0; s < 6; s++) { const a = s * Math.PI / 3 + Math.PI / 6, px = cx + 0.18 * r * Math.cos(a), py = cy + 0.18 * r * Math.sin(a); s ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.stroke();
    ctx.restore();
  };

  /* ---------------------------------------------------------------- glassware */
  S.drop = function (ctx, x, y, r, o) {
    o = o || {};
    const C = colors();
    ctx.save();
    const g = ctx.createRadialGradient ? ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r) : null;
    if (g && g.addColorStop) { g.addColorStop(0, o.highlight || 'rgba(190,225,255,0.95)'); g.addColorStop(1, o.color || 'rgba(60,140,230,0.85)'); ctx.fillStyle = g; } else ctx.fillStyle = o.color || C.accent;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.restore();
  };
  S.beaker = function (ctx, x, y, w, h, fill, o) {
    o = o || {};
    const C = colors();
    const f = Math.max(0, Math.min(1, fill == null ? 0.6 : fill));
    ctx.save();
    if (f > 0) {
      ctx.fillStyle = o.liquid || 'rgba(70,150,235,0.45)';
      ctx.fillRect(x + 2, y + h - f * h, w - 4, f * h - 2);
      S.waves(ctx, x + 2, y + h - f * h, x + w - 2, 1.5, 0, { color: o.liquid || 'rgba(70,150,235,0.8)', n: 3 });
    }
    ctx.strokeStyle = o.color || C.text; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x, y); ctx.moveTo(x + w, y); ctx.lineTo(x + w + 4, y); ctx.stroke();
    // graduations
    ctx.strokeStyle = o.color || C.muted; ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + w - 10, y + h * i / 5); ctx.lineTo(x + w - 2, y + h * i / 5); ctx.stroke(); }
    if (o.label) { ctx.fillStyle = C.text; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(o.label, x + w / 2, y + h + 6); }
    ctx.restore();
  };
  S.thermometer = function (ctx, x, y, h, T, o) {
    o = o || {};
    const C = colors(), min = o.min == null ? -20 : o.min, max = o.max == null ? 100 : o.max;
    const t = Math.max(0, Math.min(1, (T - min) / (max - min)));
    const w = 10, bulb = 9, top = y, bottom = y + h - bulb;
    ctx.save();
    ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.fillStyle = C.surface || 'rgba(128,128,128,0.2)';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, top, w, bottom - top, w / 2) : ctx.rect(x - w / 2, top, w, bottom - top); ctx.fill(); ctx.stroke();
    const col = o.color || (T <= 0 ? C.accent : T >= 60 ? C.bad : C.warn);
    ctx.fillStyle = col;
    const fillTop = bottom - t * (bottom - top - 6);
    ctx.fillRect(x - 3, fillTop, 6, bottom - fillTop);
    ctx.beginPath(); ctx.arc(x, bottom + bulb - 2, bulb, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = C.faint;
    for (let i = 0; i <= 10; i++) { const yy = bottom - i / 10 * (bottom - top - 6); ctx.beginPath(); ctx.moveTo(x + w / 2, yy); ctx.lineTo(x + w / 2 + (i % 5 ? 3 : 6), yy); ctx.stroke(); }
    ctx.fillStyle = C.text; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText((o.label || '') + (Math.round(T * 10) / 10) + ' °C', x + w / 2 + 9, fillTop);
    ctx.restore();
  };
  S.waves = function (ctx, x0, y, x1, amp, phase, o) {
    o = o || {};
    const n = o.n || 4, C = colors();
    ctx.save();
    ctx.strokeStyle = o.color || C.accent; ctx.lineWidth = o.width || 1.5;
    ctx.beginPath();
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const x = x0 + (x1 - x0) * i / steps, yy = y + amp * Math.sin((i / steps) * n * TAU + (phase || 0));
      i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
    }
    ctx.stroke();
    ctx.restore();
  };

  H.wsym = S;
})();
