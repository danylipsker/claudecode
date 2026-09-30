/* The Puzzle Cabinet · engines/tangram.js
 *
 * Tangram: seven pieces cut from a square — two large triangles, a medium
 * one, two small ones, a square and a parallelogram — to be laid, without
 * overlapping, over a silhouette. Pieces turn in steps of 45° and may be
 * turned over.
 *
 * Units: the whole set makes a 4 × 4 square. Local piece shapes are below.
 * data: {
 *   pieces: [[type, x, y, rot, flip], ...]   the solution (and so the silhouette)
 *   set: 'tangram' (default)                  other sets may be added in SETS
 *   show: 'outline' | 'filled'                how the silhouette is drawn
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;

  const SETS = {
    tangram: {
      name: 'Tangram',
      types: {
        LT: { poly: [[0, 0], [4, 0], [2, 2]], color: '#ff6b6b', n: 2, name: 'large triangle' },
        MT: { poly: [[0, 0], [2, 0], [0, 2]], color: '#ffb057', n: 1, name: 'medium triangle' },
        ST: { poly: [[0, 0], [2, 0], [1, 1]], color: '#38d9d3', n: 2, name: 'small triangle' },
        SQ: { poly: [[1, 0], [2, 1], [1, 2], [0, 1]], color: '#ffd166', n: 1, name: 'square' },
        PA: { poly: [[0, 0], [2, 0], [3, 1], [1, 1]], color: '#b388ff', n: 1, name: 'parallelogram' }
      },
      // the pieces packed in their box, as they come
      box: [['LT', 0, 0, 0, 0], ['LT', 0, 4, 270, 0], ['MT', 4, 4, 180, 0], ['ST', 4, 0, 90, 0], ['ST', 3, 3, 180, 0], ['SQ', 2, 1, 0, 0], ['PA', 0, 4, 180, 1]],
      step: 45
    }
  };

  function centred(poly) {
    const c = G.centroid(poly);
    return { poly: poly.map((p) => [p[0] - c[0], p[1] - c[1]]), c };
  }

  // a placement [type, x, y, rot, flip] (x, y = where the local origin goes) as a world polygon
  function placeRaw(set, pl) {
    const t = set.types[pl[0]];
    return G.placePoly(t.poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] });
  }

  function silhouette(p) {
    const set = SETS[p.data.set || 'tangram'];
    return p.data.pieces.map((pl) => placeRaw(set, pl));
  }

  // points of the silhouette's outline (corners a piece can snap to without giving away the inside)
  function outlinePoints(polys) {
    const pts = [];
    const seen = new Set();
    const inside = (q) => polys.some((pl) => G.pointInPoly(q, pl));
    polys.forEach((pl) => pl.forEach((v) => {
      const k = Math.round(v[0] * 1000) + ',' + Math.round(v[1] * 1000);
      if (seen.has(k)) return;
      seen.add(k);
      let out = false;
      for (let a = 0; a < 8 && !out; a++) {
        const r = 0.06, q = [v[0] + Math.cos(a * Math.PI / 4 + 0.2) * r, v[1] + Math.sin(a * Math.PI / 4 + 0.2) * r];
        if (!inside(q)) out = true;
      }
      if (out) pts.push(v);
    }));
    return pts;
  }

  C.engine({
    id: 'tangram',
    name: 'Tangram',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe'],
    workbench: { vertexSnap: true, rotStep: 45, snapPx: 13 },
    about: 'Cover the dark silhouette with all seven pieces, without overlaps. **Drag** a piece to move it; its corners snap to the silhouette and to other pieces. **Turn** it with the round handle, the ⟲ ⟳ buttons, the **R** key or Shift + wheel (45° at a time). **Turn it over** with ⇋ or **X** — the parallelogram needs this. Build the figure on the silhouette, or beside it: both count.',

    verify(p) {
      const d = p.data;
      const set = SETS[d.set || 'tangram'];
      if (!set) return { ok: false, err: 'unknown set' };
      if (!d.pieces || !d.pieces.length) return { ok: false, err: 'no pieces' };
      const need = {};
      for (const k in set.types) need[k] = set.types[k].n;
      for (const pl of d.pieces) {
        if (!set.types[pl[0]]) return { ok: false, err: 'unknown piece ' + pl[0] };
        need[pl[0]]--;
      }
      for (const k in need) if (need[k] !== 0) return { ok: false, err: 'wrong number of ' + k };
      const polys = silhouette(p);
      const over = G.overlapArea(polys, 260);
      const total = polys.reduce((s, q) => s + G.absArea(q), 0);
      if (over > total * 0.004) return { ok: false, err: 'pieces overlap (' + over.toFixed(3) + ')' };
      return { ok: true };
    },

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data;
      const set = SETS[d.set || 'tangram'];
      const target = silhouette(p);
      const tb = G.bbox(target);
      // centre the silhouette on the origin
      const off = [-tb.cx, -tb.cy];
      const tpoly = target.map((pl) => pl.map((q) => [q[0] + off[0], q[1] + off[1]]));
      const tbox = G.bbox(tpoly);
      const outline = outlinePoints(tpoly);

      const bg = wb.layer('bg');
      const sil = ctx.s('g', { class: 'tg-sil' + (d.show === 'outline' ? ' outline' : '') }, bg);
      tpoly.forEach((pl) => ctx.s('path', { d: C.pathOf(pl) }, sil));
      const hintG = ctx.s('g', { class: 'tg-hint' }, wb.layer('top'));

      // the tray: the pieces laid out loosely beside the silhouette (below it on narrow screens),
      // each turned a little differently, so nothing starts already solved
      const narrow = wb.size().w < 600;
      const rng = C.rng(p.id + ':tray');
      const trayW = narrow ? Math.max(8, tbox.w) : 8.6;
      const trayX = narrow ? tbox.cx - trayW / 2 : tbox.x1 + 1.6;
      const order = set.box.map((pl, i) => i);
      rng.shuffle(order);
      const place = [];
      let cx = 0, cy = 0, rowH = 0;
      order.forEach((i) => {
        const pl = set.box[i];
        const t = set.types[pl[0]];
        const rot = Math.round(rng() * 7) * 45;
        const flip = pl[0] === 'PA' ? rng() < 0.5 : false;
        const cp = centred(t.poly);
        const b = G.bbox([G.placePoly(cp.poly, { x: 0, y: 0, rot, flip })]);
        if (cx > 0 && cx + b.w > trayW) { cx = 0; cy += rowH + 0.45; rowH = 0; }
        place.push({ i, pl, t, cp, rot, flip, x: cx - b.x0, y: cy - b.y0 });
        cx += b.w + 0.45;
        rowH = Math.max(rowH, b.h);
      });
      const trayH = cy + rowH;
      const trayY = narrow ? tbox.y1 + 1.6 : tbox.cy - trayH / 2;
      ctx.s('rect', { x: trayX - 0.35, y: trayY - 0.35, width: trayW + 0.7, height: trayH + 0.7, rx: 0.3, class: 'tg-tray' }, bg);

      const pieces = [];
      place.sort((u, v) => u.i - v.i).forEach((q) => {
        const o = wb.add({
          id: 'pc' + q.i, kind: 'piece', name: cap(q.t.name), shape: { poly: q.cp.poly },
          x: trayX + q.x, y: trayY + q.y, rot: q.rot, flip: q.flip,
          fill: q.t.color, stroke: 'rgba(0,0,0,.35)', sw: 0.035,
          rotate: set.step, flipable: true, data: { type: q.pl[0] }
        });
        pieces.push(o);
      });

      const all = tpoly.concat([[[trayX - 0.35, trayY - 0.35], [trayX + trayW + 0.35, trayY + trayH + 0.35]]]);
      const bb = G.bbox(all);
      wb.setBounds({ x0: bb.x0 - 0.8, y0: bb.y0 - 0.8, x1: bb.x1 + 0.8, y1: bb.y1 + 0.8 }, 0.06);
      wb.handlers.snapTargets = () => outline;
      wb.handlers.toolSnap = () => outline;

      function userPolys() { return pieces.map((o) => wb.worldPoly(o)); }

      function check() {
        const up = userPolys();
        const total = up.reduce((s, q) => s + G.absArea(q), 0);
        const over = G.overlapArea(up, 200);
        if (over > total * 0.01) return { solved: false, msg: 'Two pieces overlap.' };
        let r = G.compareShapes(up, tpoly, { res: 200 });
        let beside = false;
        if (r.iou < 0.95) { const r2 = G.compareShapes(up, tpoly, { res: 200, align: 'bbox' }); if (r2.iou > r.iou) { r = r2; beside = true; } }
        if (r.iou >= 0.95 && r.missing < 0.04) return { solved: true, msg: beside ? 'Built beside the silhouette — that counts.' : 'Every corner in place.' };
        return { solved: false, msg: r.iou > 0.8 ? 'Nearly: ' + Math.round(r.missing * 100) + '% of the silhouette is still uncovered.' : 'The pieces do not cover the silhouette yet.' };
      }

      // which piece should go where: match the solution placements to the pieces of the same type
      function plan() {
        const out = [];
        const used = new Set();
        d.pieces.forEach((pl) => {
          const t = set.types[pl[0]];
          const cp = centred(t.poly);
          const world = G.placePoly(t.poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] }).map((q) => [q[0] + off[0], q[1] + off[1]]);
          const c = G.centroid(world);
          let best = null, bd = Infinity;
          pieces.forEach((o) => {
            if (used.has(o.id) || o.data.type !== pl[0]) return;
            const dd = G.dist([o.x, o.y], c);
            if (dd < bd) { bd = dd; best = o; }
          });
          used.add(best.id);
          out.push({ o: best, x: c[0], y: c[1], rot: G.normDeg(pl[3]), flip: !!pl[4], world, cp });
        });
        return out;
      }
      function placed(o, target) {
        return G.compareShapes([wb.worldPoly(o)], [target], { res: 60 }).iou > 0.9;
      }

      return {
        check,
        hint(n) {
          const pl = plan();
          const up = userPolys();
          // a piece not yet where it belongs
          const todo = pl.filter((t) => !up.some((q) => G.compareShapes([q], [t.world], { res: 60 }).iou > 0.9));
          if (!todo.length) return 'All the pieces are where they belong — press Check.';
          const order = ['LT', 'MT', 'PA', 'SQ', 'ST'];
          todo.sort((a, b) => order.indexOf(a.o.data.type) - order.indexOf(b.o.data.type));
          const t = todo[0];
          return {
            text: 'The ' + set.types[t.o.data.type].name + ' goes where the dashed outline shows' + (t.flip !== !!t.o.flip && t.o.data.type === 'PA' ? ' — turned over' : '') + '.',
            show() {
              hintG.innerHTML = '';
              ctx.s('path', { d: C.pathOf(t.world), class: 'tg-hintpoly' }, hintG);
              clearTimeout(this._t);
              setTimeout(() => { hintG.innerHTML = ''; }, 4500);
            }
          };
        },
        solve() {
          const pl = plan();
          // turn over the pieces that need it first, then glide everything home
          pl.forEach((t) => { if (!!t.o.flip !== t.flip) { t.o.flip = t.flip; t.o.rot = G.normDeg(-t.o.rot); wb.renderObj(t.o); } });
          const from = pl.map((t) => ({ x: t.o.x, y: t.o.y, rot: t.o.rot }));
          C.tween(C.anim(900), (e) => {
            pl.forEach((t, i) => {
              let dr = G.normDeg(t.rot - from[i].rot); if (dr > 180) dr -= 360;
              wb.update(t.o, { x: from[i].x + (t.x - from[i].x) * e, y: from[i].y + (t.y - from[i].y) * e, rot: from[i].rot + dr * e });
            });
          }, () => ctx.changed('solve'));
        },
        destroy() { wb.handlers.snapTargets = null; }
      };
    },

    thumb(p) {
      const polys = silhouette(p);
      const b = G.bbox(polys);
      const pad = 0.5;
      let s = '<svg viewBox="' + (b.x0 - pad) + ' ' + (b.y0 - pad) + ' ' + (b.w + 2 * pad) + ' ' + (b.h + 2 * pad) + '" preserveAspectRatio="xMidYMid meet"><g fill="var(--ink-2)" stroke="var(--ink-2)" stroke-width=".04" stroke-linejoin="round">';
      polys.forEach((pl) => { s += '<path d="' + C.pathOf(pl) + '"/>'; });
      return s + '</g></svg>';
    }
  });

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  C.tangramSets = SETS;
  C.tangramSilhouette = silhouette;

  C.css('tangram', `
    .tg-sil { opacity: .3; }
    .tg-sil path { fill: var(--ink-2); stroke: var(--ink-2); stroke-width: .04; stroke-linejoin: round; }
    [data-theme="light"] .tg-sil { opacity: .42; }
    .tg-sil.outline { opacity: .7; }
    .tg-sil.outline path { fill: none; }
    .tg-tray { fill: none; stroke: var(--line); stroke-width: .05; stroke-dasharray: .2 .15; }
    .tg-hintpoly { fill: rgba(255, 209, 102, .15); stroke: var(--gold); stroke-width: .07; stroke-dasharray: .18 .12; animation: tgpulse 1s ease-in-out infinite; }
    @keyframes tgpulse { 50% { opacity: .45; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
