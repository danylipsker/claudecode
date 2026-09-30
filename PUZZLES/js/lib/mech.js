/* The Puzzle Cabinet · js/lib/mech.js
 *
 * Small shared helpers for the machine engines (gears, pipes, pulleys):
 * exact fractions, reading typed numbers, checking a numeric answer,
 * curved direction arrows, metal and wood gradients, and an animation clock.
 * Loads in node (no DOM at load time).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const M = C.mech = C.mech || {};

  /* ---------- exact fractions: [numerator, denominator], denominator > 0 ---------- */

  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; }
  function fr(n, d) {
    if (d == null) d = 1;
    if (Array.isArray(n)) return fr(n[0], n[1]);
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
      // decimals: scale up to whole numbers
      let k = 1;
      while ((!Number.isInteger(n * k) || !Number.isInteger(d * k)) && k < 1e6) k *= 10;
      n = Math.round(n * k); d = Math.round(d * k);
    }
    if (d === 0) throw new Error('fraction with zero denominator');
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d);
    return [n / g, d / g];
  }
  const F = {
    fr,
    gcd,
    add: (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]),
    sub: (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]),
    mul: (a, b) => fr(a[0] * b[0], a[1] * b[1]),
    div: (a, b) => fr(a[0] * b[1], a[1] * b[0]),
    neg: (a) => [-a[0], a[1]],
    abs: (a) => [Math.abs(a[0]), a[1]],
    eq: (a, b) => a[0] === b[0] && a[1] === b[1],
    zero: (a) => a[0] === 0,
    sign: (a) => Math.sign(a[0]),
    num: (a) => a[0] / a[1],
    isInt: (a) => a[1] === 1,
    // "45/2"
    str: (a) => a[1] === 1 ? String(a[0]) : a[0] + '/' + a[1],
    // "22½", "13⅓", "3/7"
    nice(a) {
      if (a[1] === 1) return String(a[0]);
      const VUL = { '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾', '1/5': '⅕', '2/5': '⅖', '3/5': '⅗', '4/5': '⅘', '1/6': '⅙', '5/6': '⅚', '1/8': '⅛', '3/8': '⅜', '5/8': '⅝', '7/8': '⅞' };
      const s = Math.sign(a[0]), n = Math.abs(a[0]), w = Math.floor(n / a[1]), r = n % a[1];
      const v = VUL[r + '/' + a[1]];
      if (v) return (s < 0 ? '−' : '') + (w ? w : '') + v;
      return (s < 0 ? '−' : '') + (w ? w + ' ' : '') + r + '/' + a[1];
    },
    // the value as a friendly decimal if it has one, else null
    dec(a) {
      let d = a[1];
      while (d % 2 === 0) d /= 2;
      while (d % 5 === 0) d /= 5;
      if (d !== 1) return null;
      return String(Math.round(a[0] / a[1] * 1e6) / 1e6);
    }
  };
  M.F = F;

  // "45/2 (= 22.5)" or "40/3 (about 13.33)" — for explanations
  M.fracText = function (a) {
    if (a[1] === 1) return String(a[0]);
    const d = F.dec(a);
    return F.nice(a) + (d ? ' (= ' + d + ')' : ' (about ' + (Math.round(a[0] / a[1] * 100) / 100) + ')');
  };

  /* ---------- reading what people type ---------- */

  const VULGAR = { '½': 0.5, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 0.25, '¾': 0.75, '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8, '⅙': 1 / 6, '⅚': 5 / 6, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 };
  M.readNum = function (s) {
    s = String(s == null ? '' : s).trim().toLowerCase()
      .replace(/[−–—]/g, '-').replace(/,(?=\d{3}\b)/g, '').replace(/,/g, '.')
      .replace(/^(about|roughly|exactly|approx\.?)\s+/, '')
      .replace(/\s*(rpm|r\.p\.m\.?|turns?|revs?|revolutions?|times|kg|n|newtons?|cm|mm|m|metres?|meters?|seconds?|s|min|x|×)\.?$/g, '')
      .trim();
    if (!s) return NaN;
    let m;
    const vul = /^(-?)(\d*)\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])$/.exec(s);
    if (vul) return (vul[1] ? -1 : 1) * ((vul[2] ? +vul[2] : 0) + VULGAR[vul[3]]);
    if ((m = /^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s))) return (+m[1]) + (m[1].startsWith('-') ? -1 : 1) * (+m[2]) / (+m[3]);
    if ((m = /^(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(s))) return (+m[1]) / (+m[2]);
    if (/^-?\d*\.?\d+$/.test(s)) return +s;
    if (C.evaluate) { try { const v = C.evaluate(s, {}); if (typeof v === 'number' && isFinite(v)) return v; } catch (e) { /* not a sum */ } }
    return NaN;
  };

  // does the typed value match the fraction? decimals rounded to 2 places are fine for thirds and the like
  M.matches = function (v, a) {
    const t = a[0] / a[1];
    if (isNaN(v)) return false;
    if (Math.abs(v - t) <= 1e-9 * Math.max(1, Math.abs(t))) return true;
    if (F.dec(a) == null && Math.abs(v - t) < 0.0051 * Math.max(1, Math.abs(t) / 100)) return true;
    return false;
  };

  /* ---------- drawing helpers (strings, so thumbnails can use them too) ---------- */

  const r3 = (v) => Math.round(v * 1000) / 1000;
  M.r3 = r3;
  M.pt = (c, r, deg) => [c[0] + r * Math.cos(deg * Math.PI / 180), c[1] + r * Math.sin(deg * Math.PI / 180)];

  // a curved arrow around c at radius r, from angle a0 turning `sweep` degrees (positive = clockwise on screen)
  M.arcArrow = function (c, r, a0, sweep, head) {
    head = head || r * 0.28;
    const a1 = a0 + sweep;
    const p0 = M.pt(c, r, a0), p1 = M.pt(c, r, a1 - Math.sign(sweep) * (head / r) * 57.3 * 0.6);
    const large = Math.abs(sweep) > 180 ? 1 : 0, sw = sweep > 0 ? 1 : 0;
    const arc = 'M' + r3(p0[0]) + ' ' + r3(p0[1]) + 'A' + r3(r) + ' ' + r3(r) + ' 0 ' + large + ' ' + sw + ' ' + r3(p1[0]) + ' ' + r3(p1[1]);
    // the head: a triangle pointing along the tangent at a1
    const tip = M.pt(c, r, a1);
    const back = a1 - Math.sign(sweep) * (head / r) * 57.3;
    const b1 = M.pt(c, r + head * 0.55, back), b2 = M.pt(c, r - head * 0.55, back);
    const hd = 'M' + r3(tip[0]) + ' ' + r3(tip[1]) + 'L' + r3(b1[0]) + ' ' + r3(b1[1]) + 'L' + r3(b2[0]) + ' ' + r3(b2[1]) + 'Z';
    return { arc, head: hd };
  };

  // a straight arrow from a to b
  M.arrow = function (a, b, head) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    head = head || L * 0.3;
    const bx = b[0] - ux * head, by = b[1] - uy * head;
    return {
      line: 'M' + r3(a[0]) + ' ' + r3(a[1]) + 'L' + r3(bx + ux * head * 0.3) + ' ' + r3(by + uy * head * 0.3),
      head: 'M' + r3(b[0]) + ' ' + r3(b[1]) + 'L' + r3(bx - uy * head * 0.5) + ' ' + r3(by + ux * head * 0.5) + 'L' + r3(bx + uy * head * 0.5) + ' ' + r3(by - ux * head * 0.5) + 'Z'
    };
  };

  // metals, wood, rope: gradient definitions (ids prefixed so several boards can live on one page)
  M.MATS = {
    brass: ['#f3d27a', '#d4a13f', '#94681c', '#6e4c12'],
    steel: ['#e9eef6', '#b3bdcc', '#76839a', '#4d586b'],
    copper: ['#f2b58c', '#cc7a48', '#8c4520', '#6a3216'],
    bronze: ['#e4c08a', '#b98a4c', '#7c5627', '#5b3e1a'],
    iron: ['#8a93a6', '#5a6275', '#383e4e', '#262a36'],
    wood: ['#f0c98a', '#d9a05b', '#a86f32', '#7a4d1f'],
    glass: ['rgba(200,230,255,.18)', 'rgba(160,200,255,.08)', 'rgba(120,160,220,.05)', 'rgba(120,160,220,.4)']
  };
  M.defs = function (parent, uid) {
    let s = '';
    for (const k in M.MATS) {
      const c = M.MATS[k];
      s += '<radialGradient id="' + uid + '-' + k + '" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".55" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></radialGradient>';
      s += '<linearGradient id="' + uid + '-' + k + 'L" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".5" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient>';
    }
    s += '<linearGradient id="' + uid + '-waterL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8f5"/><stop offset="1" stop-color="#2a86c8"/></linearGradient>';
    const d = C.s('defs', null, parent);
    d.innerHTML = s;
    return d;
  };
  M.edge = (k) => (M.MATS[k] || M.MATS.steel)[3];

  /* ---------- an animation clock ---------- */

  // fn(t seconds since start, dt) -> false to stop. Returns { stop(), running() }.
  M.ticker = function (fn) {
    let raf = 0, t0 = 0, last = 0, on = true;
    const step = (now) => {
      if (!on) return;
      if (!t0) { t0 = now; last = now; }
      const t = (now - t0) / 1000, dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      let keep = true;
      try { keep = fn(t, dt) !== false; } catch (e) { on = false; throw e; }
      if (keep && on) raf = root.requestAnimationFrame(step); else on = false;
    };
    raf = root.requestAnimationFrame(step);
    return { stop() { on = false; if (raf && root.cancelAnimationFrame) root.cancelAnimationFrame(raf); }, running: () => on };
  };

  M.ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - Math.cos(Math.PI * t) / 2);
  M.letter = (i) => String.fromCharCode(65 + i);
  M.uid = (() => { let n = 0; return (p) => (p || 'mx') + (++n) + '-' + Math.floor(Math.random() * 1e6).toString(36); })();
})(typeof window !== 'undefined' ? window : globalThis);
