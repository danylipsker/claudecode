/* The Puzzle Cabinet · engines/soma.js
 *
 * Soma and other polycube puzzles: build a figure of cubes in 3D from pieces
 * made of cubes joined face to face. The figure waits on the table as
 * see-through ghost cubes (or as a shell without its cube lines, or only as
 * its three shadows on two walls and the floor); the pieces lie around it.
 * Pick a piece up, slide it, lift it, turn it about any of the three axes and
 * drop it in; the pieces snap to the grid of cubes.
 *
 * data: {
 *   pieces: ['V', 'L', 'T', 'Z', 'A', 'B', 'P'],   names from Cabinet.Polycube.LIB (or 'x,y,z'-less layer strings)
 *   sol:    '0033|…/…',     the figure, layers from the bottom up ('/'), rows from the back ('|'),
 *                           each cube marked with the index of its piece in one solution ('.' = empty)
 *   show:   'cells' | 'shell' | 'views'     how the figure is shown (default 'cells')
 *   given:  [2, 5]          optional: these pieces start in place and stay there
 *   any:    true            optional: not every piece is needed (the figure is smaller than the set)
 * }
 * With show 'views' the figure must be the only one its three shadows allow
 * (verify checks that every cube the shadows permit is in the figure).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const PC = () => C.Polycube;

  const MODES = { cells: 1, shell: 1, views: 1 };
  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const numw = (n) => NUMW[n] || String(n);

  /* ---------- the puzzle read from its data ---------- */

  function model(p) {
    const P = PC(), d = p.data || {};
    const entries = P.parse(d.sol || '');
    const specs = d.pieces || [];
    const libColors = specs.map((s) => P.LIB[s] && P.LIB[s].color);
    const distinct = libColors.every((c) => c) && new Set(libColors).size === libColors.length;
    const pieces = specs.map((spec, i) => {
      const lib = P.LIB[spec];
      const raw = P.pieceCells(spec);
      return {
        i, spec, raw,
        base: raw.length ? P.pivoted(raw) : [],
        label: (d.labels && d.labels[i]) || (lib ? lib.label : String(i + 1)),
        name: lib ? lib.name : 'piece ' + (i + 1),
        color: distinct ? lib.color : P.PALETTE[i % P.PALETTE.length]
      };
    });
    const byPiece = pieces.map(() => []), bad = [];
    entries.forEach((e) => {
      const i = P.CH.indexOf(e.ch);
      if (i >= 0 && i < pieces.length) byPiece[i].push(e.c);
      else bad.push(e.ch);
    });
    // the same label twice (identical pieces): number them
    const seen = {};
    pieces.forEach((pc) => { seen[pc.label] = (seen[pc.label] || 0) + 1; });
    const count = {};
    pieces.forEach((pc) => { if (seen[pc.label] > 1) { count[pc.label] = (count[pc.label] || 0) + 1; pc.tag = pc.label + count[pc.label]; } else pc.tag = pc.label; });
    return {
      cells: entries.map((e) => e.c), pieces, byPiece, bad,
      show: d.show || 'cells', given: (d.given || []).slice(), any: !!d.any
    };
  }

  // where the pieces wait: lying low around the figure (in front and to the left when the walls are up)
  function layout(m) {
    const P = PC();
    const fb = P.bbox(m.cells);
    const views = m.show === 'views';
    const used = new Set();
    const block = (x, z) => used.has(x + ',' + z);
    for (let x = fb.lo[0] - 1; x <= fb.hi[0] + 1; x++) for (let z = fb.lo[2] - 1; z <= fb.hi[2] + 1; z++) used.add(x + ',' + z);
    const cx = (fb.lo[0] + fb.hi[0] + 1) / 2, cz = (fb.lo[2] + fb.hi[2] + 1) / 2;
    const home = [];
    const R = 7 + Math.ceil(Math.sqrt(m.pieces.length)) * 2;
    m.pieces.forEach((pc, i) => {
      // the lowest orientation, long side across
      let best = null;
      P.orients(pc.base).forEach((o) => {
        const b = P.bbox(o.cells);
        const score = b.size[1] * 100 - b.size[0] * 3 + b.size[2];
        if (!best || score < best.score) best = { o, b, score };
      });
      const o = best.o, b = best.b;
      const foot = [];
      const fs = new Set();
      o.cells.forEach((c) => { const k = (c[0] - b.lo[0]) + ',' + (c[2] - b.lo[2]); if (!fs.has(k)) { fs.add(k); foot.push([c[0] - b.lo[0], c[2] - b.lo[2]]); } });
      let spot = null;
      for (let x = fb.lo[0] - R; x <= fb.hi[0] + R; x++) {
        for (let z = fb.lo[2] - R; z <= fb.hi[2] + R; z++) {
          if (views && !(z > fb.hi[2] + 1 || x + b.size[0] - 1 < fb.lo[0] - 1)) continue;
          if (views && (z < fb.lo[2] - 1 || x + b.size[0] - 1 > fb.hi[0] + 1)) continue;
          let ok = true;
          for (const f of foot) {
            for (let dx = -1; dx <= 1 && ok; dx++) for (let dz = -1; dz <= 1 && ok; dz++) if (block(x + f[0] + dx, z + f[1] + dz)) ok = false;
            if (!ok) break;
          }
          if (!ok) continue;
          const mx = x + b.size[0] / 2 - cx, mz = z + b.size[2] / 2 - cz;
          const d = Math.max(Math.abs(mx), Math.abs(mz)) * 1.4 + Math.hypot(mx, mz) - mz * 0.25 + i * 0.001;
          if (!spot || d < spot.d) spot = { x, z, d };
        }
      }
      if (!spot) spot = { x: fb.hi[0] + 3 + i * 4, z: fb.hi[2] + 3 };
      foot.forEach((f) => used.add((spot.x + f[0]) + ',' + (spot.z + f[1])));
      home[i] = { ri: o.ri, t: [spot.x - b.lo[0], -b.lo[1], spot.z - b.lo[2]] };
    });
    // the table: everything, with a margin
    let x0 = fb.lo[0], x1 = fb.hi[0], z0 = fb.lo[2], z1 = fb.hi[2];
    m.pieces.forEach((pc, i) => {
      P.place(pc.base, home[i].ri, home[i].t).forEach((c) => {
        x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]); z0 = Math.min(z0, c[2]); z1 = Math.max(z1, c[2]);
      });
    });
    const area = { x0: x0 - 1, x1: x1 + 1, z0: z0 - 1, z1: z1 + 1, h: Math.max(fb.hi[1] + 1, 3) + 3 };
    if (views) { area.z0 = fb.lo[2] - 1; area.x1 = fb.hi[0] + 1; }
    return { home, area, fb };
  }

  /* ---------- checking a puzzle ---------- */

  function verify(p) {
    const P = PC(), d = p.data;
    if (!d || !Array.isArray(d.pieces) || !d.pieces.length || typeof d.sol !== 'string') return { ok: false, err: 'pieces and sol are needed' };
    if (d.show && !MODES[d.show]) return { ok: false, err: 'show must be cells, shell or views' };
    if (d.pieces.length > P.CH.length) return { ok: false, err: 'too many pieces' };
    const m = model(p);
    for (const pc of m.pieces) {
      if (!pc.raw.length) return { ok: false, err: 'unknown piece ' + pc.spec };
      if (!P.connected(pc.raw)) return { ok: false, err: 'piece ' + pc.spec + ' is not in one part' };
    }
    if (m.bad.length) return { ok: false, err: 'the solution marks cells with ' + m.bad.slice(0, 3).join(' ') };
    if (!m.cells.length) return { ok: false, err: 'the figure is empty' };
    let usedN = 0;
    for (const pc of m.pieces) {
      const cells = m.byPiece[pc.i];
      if (!cells.length) { if (!m.any) return { ok: false, err: 'piece ' + pc.spec + ' is not used' }; continue; }
      usedN++;
      if (!P.fit(pc.base, cells)) return { ok: false, err: 'the cells marked ' + P.CH[pc.i] + ' are not the ' + pc.spec + ' piece' };
    }
    if (m.any && usedN === m.pieces.length) return { ok: false, err: 'any is set but every piece is used' };
    if (!P.connected(m.cells)) return { ok: false, err: 'the figure is not in one part' };
    for (const g of m.given) {
      if (!(g >= 0 && g < m.pieces.length) || !m.byPiece[g].length) return { ok: false, err: 'given piece ' + g + ' is not in the solution' };
    }
    if (m.given.length >= m.pieces.length) return { ok: false, err: 'every piece is given' };
    if (m.show === 'views' && P.hull(m.cells).length !== m.cells.length) return { ok: false, err: 'the three views allow more cubes than the figure has' };
    return { ok: true };
  }

  /* ---------- making new puzzles ---------- */

  const STONES = ['Agate', 'Amber', 'Basalt', 'Beryl', 'Calcite', 'Chalk', 'Cinnabar', 'Coral', 'Dolomite', 'Feldspar', 'Flint', 'Galena', 'Garnet', 'Gneiss', 'Granite',
    'Gypsum', 'Jade', 'Jasper', 'Lapis', 'Malachite', 'Marble', 'Mica', 'Obsidian', 'Onyx', 'Opal', 'Porphyry', 'Pumice', 'Pyrite', 'Quartz', 'Sandstone',
    'Schist', 'Serpentine', 'Shale', 'Slate', 'Talc', 'Topaz', 'Tourmaline', 'Travertine', 'Tuff', 'Zircon', 'Azurite', 'Citrine', 'Fluorite', 'Hematite', 'Jet', 'Moonstone', 'Olivine', 'Peridot'];
  const WOODS = ['Alder', 'Ash', 'Aspen', 'Balsa', 'Beech', 'Birch', 'Boxwood', 'Cedar', 'Cherry', 'Cypress', 'Ebony', 'Elm', 'Hazel', 'Holly', 'Juniper', 'Larch',
    'Linden', 'Maple', 'Oak', 'Olive', 'Pear', 'Pine', 'Plum', 'Poplar', 'Rowan', 'Spruce', 'Teak', 'Walnut', 'Willow', 'Yew', 'Hornbeam', 'Chestnut', 'Sycamore', 'Mahogany', 'Acacia', 'Hickory'];
  const SOMA = ['V', 'L', 'T', 'Z', 'A', 'B', 'P'];
  const TETRA = ['I4', 'O4', 'L', 'T', 'Z', 'A', 'B', 'P'];
  const PENTA = ['F5', 'I5', 'L5', 'N5', 'P5', 'T5', 'U5', 'V5', 'W5', 'X5', 'Y5', 'Z5'].concat(Array.from({ length: 17 }, (_, i) => 'Q' + (i + 1)));

  function listNames(m, idx) {
    const names = idx.map((i) => 'the ' + m[i]);
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  }

  // a figure grown from the pieces (so it can be built); keys in their set order
  function grown(rng, keys, opts) {
    const P = PC();
    const shapes = keys.map((k) => P.pivoted(P.pieceCells(k)));
    for (let tries = 0; tries < 12; tries++) {
      const g = P.grow(rng, shapes, opts);
      if (!g) continue;
      if (opts.views && P.hull(g.cells).length !== g.cells.length) continue;
      return { keys, sol: P.solString(shapes, g.place), cells: g.cells };
    }
    return null;
  }

  // a figure whose three shadows fix it: heights min(a[x], b[z]) on a footprint, solved by exact cover
  function shadowFigure(rng, keys, total, nodeLimit) {
    const P = PC();
    const shapes = keys.map((k) => P.pivoted(P.pieceCells(k)));
    for (let tries = 0; tries < 400; tries++) {
      const W = rng.range(2, 5), D = rng.range(2, 5), H = rng.range(2, 4);
      const a = [], b = [];
      for (let x = 0; x < W; x++) a.push(rng.range(1, H));
      for (let z = 0; z < D; z++) b.push(rng.range(1, H));
      a[rng.int(W)] = H; b[rng.int(D)] = H;
      const cells = [];
      for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
        if (rng() < 0.12 && !(a[x] === H && b[z] === H)) continue;
        const h = Math.min(a[x], b[z]);
        for (let y = 0; y < h; y++) cells.push([x, y, z]);
      }
      if (cells.length !== total || !P.connected(cells)) continue;
      if (P.hull(cells).length !== cells.length) continue;
      const r = P.solve(cells, shapes, { max: 1, nodeLimit: nodeLimit || 6e4, shuffle: rng });
      if (!r.sols.length) continue;
      const place = keys.map((k, i) => r.sols[0][i]);
      return { keys, sol: P.solString(shapes, place), cells };
    }
    return null;
  }

  // about how many essentially different ways a figure can be built (counting stops at max)
  function distinctWays(cells, keys, max) {
    const P = PC();
    const shapes = keys.map((k) => P.pivoted(P.pieceCells(k)));
    const r = P.solve(cells, shapes, { max: max || 400, nodeLimit: 1.5e5 });
    return { n: r.sols.length / P.symmetries(cells), capped: r.aborted || r.sols.length >= (max || 400) };
  }

  function generate(rng, level, fam) {
    const P = PC();
    const packing = fam && fam.id === 'polycube-packing';
    let f = null, show = 'cells', title, text;
    if (!packing) {
      if (level === 1) {
        const two = rng.shuffle(SOMA.slice(1)).slice(0, 2);
        f = grown(rng, SOMA.filter((k) => k === 'V' || two.includes(k)), { maxH: 2, maxW: 3, maxD: 3, spread: 0.1 });
      } else if (level === 2) {
        if (rng() < 0.5) {
          const pick = rng.shuffle(SOMA.slice()).slice(0, 5);
          f = grown(rng, SOMA.filter((k) => pick.includes(k)), { maxH: 3, maxW: 4, maxD: 3, spread: 0.2 });
        } else f = grown(rng, SOMA, { maxH: 3, maxW: 4, maxD: 4, spread: 0.2 });
      } else if (level === 3 || level === 4) {
        // grown until the number of ways to build it is in the level's band
        const band = level === 3 ? [20, 400] : [1, 30];
        for (let k = 0; k < 14 && !f; k++) {
          const g = grown(rng, SOMA, { maxH: 3 + rng.int(2), maxW: 4 + rng.int(2), maxD: 4 + rng.int(2), spread: level === 3 ? 0.75 : 1 });
          if (!g) continue;
          const w = distinctWays(g.cells, SOMA, level === 3 ? 450 : 150);
          if (!w.capped && w.n >= band[0] && w.n <= band[1]) f = g;
          else if (level === 4 && k >= 6 && !w.capped && w.n <= 120) { f = g; show = 'shell'; }
        }
      } else { f = shadowFigure(rng, SOMA, 27); show = 'views'; }
      if (!f || f.keys.length < 2) return null;
      title = 'The ' + rng.pick(STONES);
      const all = f.keys.length === 7;
      text = show === 'views'
        ? 'Only the three shadows of this figure are shown: front, side and top. Work out its shape, then build it with all seven Soma pieces.'
        : (all ? 'Build the figure with all seven Soma pieces.' : 'Build the figure with ' + listNames(f.keys, f.keys.map((k, i) => i)) + ' pieces of the Soma set.') +
          (show === 'shell' ? ' This time the figure is a smooth shell: count the cubes yourself.' : '');
    } else {
      if (level === 1) {
        const pool = ['D2', 'I3', 'V', 'L', 'T', 'Z', 'O4', 'A', 'B', 'P'];
        const n = rng.range(2, 3);
        const keys = rng.shuffle(pool.slice()).slice(0, n);
        f = grown(rng, keys, { maxH: 2, maxW: 3, maxD: 3, spread: 0.1 });
      } else if (level === 2) {
        f = grown(rng, rng.shuffle(TETRA.slice()).slice(0, 4), { maxH: 3, maxW: 4, maxD: 3, spread: 0.15 });
      } else if (level === 3) {
        const keys = rng.shuffle(TETRA.slice()).slice(0, 4).concat(rng.shuffle(PENTA.slice()).slice(0, 2));
        f = grown(rng, keys, { maxH: 3, maxW: 4, maxD: 4, spread: 0.3 });
      } else if (level === 4) {
        const keys = rng.shuffle(PENTA.slice()).slice(0, rng.range(6, 7));
        f = grown(rng, keys, { maxH: 3, maxW: 5, maxD: 4, spread: 0.45 });
        if (f && rng() < 0.4) show = 'shell';
      } else {
        const boxes = [[5, 2, 3], [5, 3, 3], [5, 2, 5], [5, 3, 4]];
        const bx = rng.pick(boxes), n = bx[0] * bx[1] * bx[2] / 5;
        const cells = [];
        for (let y = 0; y < bx[1]; y++) for (let z = 0; z < bx[2]; z++) for (let x = 0; x < bx[0]; x++) cells.push([x, y, z]);
        for (let k = 0; k < 6 && !f; k++) {
          const keys = rng.shuffle(PENTA.slice()).slice(0, n);
          const shapes = keys.map((kk) => P.pivoted(P.pieceCells(kk)));
          const r = P.solve(cells, shapes, { max: 1, nodeLimit: 4e4, shuffle: rng });
          if (r.sols.length) f = { keys, sol: P.solString(shapes, keys.map((kk, i) => r.sols[0][i])), cells, box: bx };
        }
        if (!f) f = grown(rng, rng.shuffle(PENTA.slice()).slice(0, 8), { maxH: 3, maxW: 5, maxD: 4, spread: 0.3 });
      }
      if (!f) return null;
      title = 'The ' + rng.pick(WOODS) + (f.box ? ' Box' : ' Block');
      const n = f.keys.length, cubes = f.cells.length;
      text = f.box
        ? 'Pack ' + numw(n) + ' pentacubes into a ' + f.box[0] + ' × ' + f.box[1] + ' × ' + f.box[2] + ' box.'
        : 'Build the figure of ' + cubes + ' cubes with these ' + numw(n) + ' pieces.' + (show === 'shell' ? ' The figure is a smooth shell: count the cubes yourself.' : '');
    }
    const data = { pieces: f.keys, sol: f.sol };
    if (show !== 'cells') data.show = show;
    return { title, text, data, diff: level };
  }

  /* ---------- a small picture of the figure (isometric) ---------- */

  function isoSVG(cells, opts) {
    opts = opts || {};
    const P = PC();
    const set = new Set(cells.map(P.K));
    const has = (x, y, z) => set.has(x + ',' + y + ',' + z);
    const c30 = 0.8660254;
    const X = (x, y, z) => (x + z) * c30, Y = (x, y, z) => (z - x) * 0.5 - y;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    cells.forEach((c) => {
      for (let i = 0; i < 8; i++) {
        const p = [c[0] + (i & 1), c[1] + ((i >> 1) & 1), c[2] + ((i >> 2) & 1)];
        const sx = X(p[0], p[1], p[2]), sy = Y(p[0], p[1], p[2]);
        if (sx < x0) x0 = sx; if (sx > x1) x1 = sx; if (sy < y0) y0 = sy; if (sy > y1) y1 = sy;
      }
    });
    const pad = 0.3;
    const order = cells.slice().sort((a, b) => (b[0] - b[1] - b[2]) - (a[0] - a[1] - a[2]));
    const pt = (x, y, z) => (X(x, y, z)).toFixed(3) + ',' + (Y(x, y, z)).toFixed(3);
    const col = opts.colors || {};
    let s = '<svg viewBox="' + (x0 - pad).toFixed(2) + ' ' + (y0 - pad).toFixed(2) + ' ' + (x1 - x0 + 2 * pad).toFixed(2) + ' ' + (y1 - y0 + 2 * pad).toFixed(2) + '" preserveAspectRatio="xMidYMid meet"><g stroke="rgba(10,20,40,.55)" stroke-width="' + (opts.sw || 0.05) + '" stroke-linejoin="round">';
    order.forEach((c) => {
      const [x, y, z] = c;
      const k = P.K(c);
      const cc = col[k] || null;
      const top = cc ? cc[0] : '#9fe6ee', left = cc ? cc[1] : '#57bccb', right = cc ? cc[2] : '#2f8797';
      if (!has(x, y + 1, z)) s += '<path fill="' + top + '" d="M' + pt(x, y + 1, z) + 'L' + pt(x + 1, y + 1, z) + 'L' + pt(x + 1, y + 1, z + 1) + 'L' + pt(x, y + 1, z + 1) + 'Z"/>';
      if (!has(x - 1, y, z)) s += '<path fill="' + left + '" d="M' + pt(x, y, z) + 'L' + pt(x, y, z + 1) + 'L' + pt(x, y + 1, z + 1) + 'L' + pt(x, y + 1, z) + 'Z"/>';
      if (!has(x, y, z + 1)) s += '<path fill="' + right + '" d="M' + pt(x, y, z + 1) + 'L' + pt(x + 1, y, z + 1) + 'L' + pt(x + 1, y + 1, z + 1) + 'L' + pt(x, y + 1, z + 1) + 'Z"/>';
    });
    return s + '</g></svg>';
  }

  // the three shadows side by side (for figures given only by their views)
  function viewsSVG(cells) {
    const P = PC(), v = P.views(cells), b = P.bbox(cells);
    const W = b.size[0], H = b.size[1], D = b.size[2];
    const gap = 1;
    let s = '<svg viewBox="-0.5 -0.5 ' + (W + D + W + 2 * gap + 1) + ' ' + (Math.max(H, D) + 1) + '" preserveAspectRatio="xMidYMid meet"><g stroke="rgba(10,20,40,.5)" stroke-width="0.06">';
    const sq = (x, y, fill) => { s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + fill + '"/>'; };
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (v.front.has((x + b.lo[0]) + ',' + (y + b.lo[1]))) sq(x, Math.max(H, D) - 1 - y, '#57bccb');
    for (let z = 0; z < D; z++) for (let y = 0; y < H; y++) if (v.side.has((z + b.lo[2]) + ',' + (y + b.lo[1]))) sq(W + gap + z, Math.max(H, D) - 1 - y, '#2f8797');
    for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) if (v.top.has((x + b.lo[0]) + ',' + (z + b.lo[2]))) sq(W + D + 2 * gap + x, Math.max(H, D) - D + z, '#9fe6ee');
    return s + '</g></svg>';
  }

  function thumb(p) {
    const m = model(p);
    if (m.show === 'views') return viewsSVG(m.cells);
    return isoSVG(m.cells);
  }

  /* ---------- colours ---------- */

  function hexRGB(h) {
    h = String(h || '').trim();
    if (h[0] !== '#') {
      const mm = /rgba?\(([^)]+)\)/.exec(h);
      return mm ? mm[1].split(',').slice(0, 3).map(Number) : [128, 128, 160];
    }
    h = h.slice(1);
    if (h.length === 3) h = h.split('').map((x) => x + x).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function toHex(c) { return '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  function mix(a, b, t) { const A = hexRGB(a), B = hexRGB(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); }
  function shades(c) { return [mix(c, '#ffffff', 0.28), c, mix(c, '#000000', 0.3)]; }

  /* ---------- icons for the control pad ---------- */

  const ARROWS = {
    away: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    near: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    lift: '<path d="M12 16V4M7.5 8.5 12 4l4.5 4.5M5 20h14"/>',
    lower: '<path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M5 20h14"/>',
    drop: '<path d="M12 3v9M8.5 8.5 12 12l3.5-3.5"/><path d="M6 15h12v5H6z" opacity=".6"/>',
    tray: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'
  };
  // a small cube with a curved arrow about one axis, drawn in the view of the pad (x right, y up, z toward you)
  function rotIcon(axis, sign) {
    const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
    const eye = norm([0.5, 0.55, 1]), f = mul(eye, -1), r = norm(cross(f, [0, 1, 0])), u = cross(r, f);
    const pr = (p) => [12 + dot(p, r), 12.5 - dot(p, u)];
    const fmt = (q) => q[0].toFixed(2) + ' ' + q[1].toFixed(2);
    const a = norm(axis);
    const e1 = norm(Math.abs(a[1]) < 0.9 ? cross([0, 1, 0], a) : cross([1, 0, 0], a)), e2 = cross(a, e1);
    const R = 8.3;
    const at = (th) => add(mul(e1, Math.cos(th) * R), mul(e2, Math.sin(th) * R));
    let the = 0, bv = -Infinity;
    for (let k = 0; k < 72; k++) { const th = k * Math.PI / 36; const v = dot(at(th), eye) - 0.35 * dot(at(th), u); if (v > bv) { bv = v; the = th; } }
    the += sign * 0.35;
    const ths = the - sign * 4.6;
    let d = '';
    for (let k = 0; k <= 40; k++) { const q = pr(at(ths + (the - ths) * k / 40)); d += (k ? 'L' : 'M') + fmt(q); }
    const end = pr(at(the)), prev = pr(at(the - sign * 0.12));
    let tx = end[0] - prev[0], ty = end[1] - prev[1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const arm = (ang) => { const c = Math.cos(ang), s = Math.sin(ang); return [end[0] + (-tx * c + ty * s) * 3.6, end[1] + (-ty * c - tx * s) * 3.6]; };
    const h1 = arm(0.6), h2 = arm(-0.6);
    // the cube: its outline and the three edges at the corner nearest you
    const s = 2.7, corners = [];
    for (let i = 0; i < 8; i++) corners.push(pr([(i & 1 ? 1 : -1) * s, (i & 2 ? 1 : -1) * s, (i & 4 ? 1 : -1) * s]));
    const hullIdx = [1, 3, 2, 6, 4, 5];
    let cube = 'M' + hullIdx.map((i) => fmt(corners[i])).join('L') + 'Z';
    cube += 'M' + fmt(corners[7]) + 'L' + fmt(corners[3]) + 'M' + fmt(corners[7]) + 'L' + fmt(corners[5]) + 'M' + fmt(corners[7]) + 'L' + fmt(corners[6]);
    return '<path d="' + cube + '" opacity=".5" stroke-width="1.4"/><path d="' + d + '"/><path d="M' + fmt(h1) + 'L' + fmt(end) + 'L' + fmt(h2) + '"/>';
  }
  let ICONS = null;
  function icons() {
    if (ICONS) return ICONS;
    ICONS = Object.assign({}, ARROWS, {
      Q: rotIcon([0, 1, 0], 1), E: rotIcon([0, 1, 0], -1),
      R: rotIcon([1, 0, 0], -1), F: rotIcon([1, 0, 0], 1),
      T: rotIcon([0, 0, 1], 1), G: rotIcon([0, 0, 1], -1)
    });
    return ICONS;
  }
  const svgIcon = (inner) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';

  /* ---------- cubes as one mesh: only the faces on the outside ---------- */

  const DIRV = { px: [1, 0, 0], nx: [-1, 0, 0], py: [0, 1, 0], ny: [0, -1, 0], pz: [0, 0, 1], nz: [0, 0, -1] };
  function quadOf(d, x0, y0, z0, x1, y1, z1) {
    switch (d) {
      case 'px': return [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]];
      case 'nx': return [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]];
      case 'py': return [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]];
      case 'ny': return [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]];
      case 'pz': return [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
      default: return [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]];
    }
  }
  // cells -> { verts, faces, colors, faceCell, faceDir, decals }; opts: { solid: Set of keys that hide faces, color(ci, dir), decal(ci, dir), inset }
  function cubeMesh(cells, opts) {
    opts = opts || {};
    const K = PC().K;
    const solid = opts.solid || new Set(cells.map(K));
    const g = opts.inset || 0;
    const verts = [], faces = [], colors = [], faceCell = [], faceDir = [], decals = {};
    cells.forEach((c, ci) => {
      for (const d in DIRV) {
        const n = DIRV[d];
        if (solid.has((c[0] + n[0]) + ',' + (c[1] + n[1]) + ',' + (c[2] + n[2]))) continue;
        const b = verts.length;
        quadOf(d, c[0] + g, c[1] + g, c[2] + g, c[0] + 1 - g, c[1] + 1 - g, c[2] + 1 - g).forEach((q) => verts.push(q));
        faces.push([b, b + 1, b + 2, b + 3]);
        colors.push(opts.color ? opts.color(ci, d) : '#8f9bff');
        faceCell.push(ci);
        faceDir.push(d);
        const dc = opts.decal && opts.decal(ci, d);
        if (dc) decals[faces.length - 1] = dc;
      }
    });
    return { verts, faces, colors, faceCell, faceDir, decals, cells };
  }
  // the outside of a figure as large flat rectangles (no cube lines): one quad per maximal rectangle in each plane
  function shellMesh(cells, solid) {
    const K = PC().K;
    const verts = [], faces = [];
    const groups = {};
    cells.forEach((c) => {
      for (const d in DIRV) {
        const n = DIRV[d];
        if (solid.has((c[0] + n[0]) + ',' + (c[1] + n[1]) + ',' + (c[2] + n[2]))) continue;
        const ax = n[0] ? 0 : n[1] ? 1 : 2;
        const plane = c[ax] + (n[ax] > 0 ? 1 : 0);
        const key = d + ':' + plane;
        const u = ax === 0 ? 1 : 0, w = ax === 2 ? 1 : 2;
        (groups[key] = groups[key] || { d, ax, plane, u, w, set: new Map() }).set.set(c[u] + ',' + c[w], [c[u], c[w]]);
      }
    });
    Object.values(groups).forEach((gr) => {
      const left = new Map(gr.set);
      const sorted = Array.from(left.values()).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
      for (const s of sorted) {
        if (!left.has(s[0] + ',' + s[1])) continue;
        let w = 1;
        while (left.has((s[0] + w) + ',' + s[1])) w++;
        let h = 1;
        for (;;) {
          let ok = true;
          for (let i = 0; i < w; i++) if (!left.has((s[0] + i) + ',' + (s[1] + h))) { ok = false; break; }
          if (!ok) break;
          h++;
        }
        for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) left.delete((s[0] + i) + ',' + (s[1] + j));
        // a box spanning the rectangle, flat in the face's plane, then its one face
        const lo = [0, 0, 0], hi = [0, 0, 0];
        lo[gr.ax] = hi[gr.ax] = gr.plane;
        lo[gr.u] = s[0]; hi[gr.u] = s[0] + w;
        lo[gr.w] = s[1]; hi[gr.w] = s[1] + h;
        const q = quadOf(gr.d, lo[0], lo[1], lo[2], hi[0], hi[1], hi[2]);
        const b = verts.length;
        q.forEach((p) => verts.push(p));
        faces.push([b, b + 1, b + 2, b + 3]);
      }
    });
    return { verts, faces };
  }

  /* ---------- playing ---------- */

  function mount(ctx, p) {
    const P = PC(), M4 = C.M4, V3 = C.V3, wb = ctx.wb;
    const m = model(p);
    const L = layout(m);
    const N = m.pieces.length, mode = m.show, area = L.area, fb = L.fb;
    const K = P.K;
    const figSet = new Set(m.cells.map(K));
    const figViews = P.views(m.cells);
    const bases = m.pieces.map((pc) => pc.base);
    const solPl = m.pieces.map((pc, i) => (m.byPiece[i].length ? P.fit(pc.base, m.byPiece[i]) : null));
    const locked = new Set(m.given);
    const labelCell = m.pieces.map((pc) => pc.base.findIndex((c) => !c[0] && !c[1] && !c[2]));
    const figC = [(fb.lo[0] + fb.hi[0] + 1) / 2, (fb.lo[1] + fb.hi[1] + 1) / 2, (fb.lo[2] + fb.hi[2] + 1) / 2];
    const homeOf = (i) => (locked.has(i) ? solPl[i] : L.home[i]);
    const startState = () => m.pieces.map((pc, i) => { const h = homeOf(i); return [h.ri, h.t[0], h.t[1], h.t[2]]; });
    let st = startState();
    let sel = -1, busy = false, exploded = false, ghostOn = true, hintMark = null, flash = null, pendingT = 0, camTouched = false;
    const timers = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
    const pname = (i) => 'the **' + m.pieces[i].tag + '** piece';
    const pnameP = (i) => 'the ' + m.pieces[i].tag + ' piece';
    const capit = (t) => t.charAt(0).toUpperCase() + t.slice(1);

    const cellsOf = (i, s) => { s = s || st[i]; return P.place(bases[i], s[0], [s[1], s[2], s[3]]); };
    const same = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];

    function analyse() {
      const occ = new Map();
      const pcs = st.map((s, i) => cellsOf(i));
      pcs.forEach((cells, i) => cells.forEach((c) => { const k = K(c); const a = occ.get(k); if (a) a.push(i); else occ.set(k, [i]); }));
      const info = pcs.map((cells) => {
        let inF = 0, over = 0;
        const bad = cells.map((c) => {
          const k = K(c), inside = figSet.has(k), ov = occ.get(k).length > 1;
          if (inside) inF++;
          if (ov) over++;
          return ov ? 2 : inside ? 0 : 1;
        });
        return { cells, bad, inF, over, n: cells.length, inside: inF === cells.length, ok: inF === cells.length && over === 0 };
      });
      let covered = 0, empty = 0;
      m.cells.forEach((c) => { const a = occ.get(K(c)); if (a && a.length === 1) covered++; if (!a) empty++; });
      const stickOut = [], unused = [], placed = [], overlapping = [];
      info.forEach((x, i) => {
        if (x.inF > 0 && !x.inside) stickOut.push(i);
        if (x.inF === 0) unused.push(i);
        if (x.ok) placed.push(i);
        if (x.over && x.inF > 0) overlapping.push(i);
      });
      const solved = covered === m.cells.length && !stickOut.length && !overlapping.length && (m.any || !unused.length);
      return { occ, info, covered, empty, stickOut, unused, placed, overlapping, solved };
    }

    /* ----- the stage ----- */

    wb.host.classList.add('sm-stage');
    const v = wb.use3D({ down: onDown, move: onMove, up: onUp, onPick: onTap, orbit: onOrbit, hover: onHover });
    wb.set3D(true);
    const DEF_CAM = mode === 'views' ? { yaw: -40, pitch: 34 } : { yaw: -30, pitch: 36 };
    v.cam.yaw = DEF_CAM.yaw;
    v.cam.pitch = DEF_CAM.pitch;

    function theme() {
      let cs = null;
      try { cs = root.getComputedStyle(wb.host); } catch (e) { cs = null; }
      const tok = (n, d) => { const s = cs && cs.getPropertyValue(n).trim(); return s || d; };
      const light = (root.document && root.document.documentElement.getAttribute('data-theme')) === 'light';
      const board = tok('--board', '#1b2040'), accent = tok('--accent', '#6c7bff');
      const sil = light ? mix(accent, '#000000', 0.05) : mix(accent, '#ffffff', 0.3);
      return {
        light,
        floor: board,
        floor2: mix(board, light ? '#000000' : '#ffffff', 0.035),
        mat: mode === 'views' ? mix(board, sil, light ? 0.45 : 0.55) : mix(board, accent, light ? 0.16 : 0.26),
        grid: light ? 'rgba(40,40,70,.16)' : 'rgba(255,255,255,.1)',
        wall: mix(board, light ? '#000000' : '#ffffff', light ? 0.05 : 0.07),
        ghost: light ? '#5a6390' : '#b9c3ff',
        ghostLine: light ? 'rgba(50,58,110,.55)' : 'rgba(210,218,255,.55)',
        sil,
        good: tok('--green', '#4ecb8d'),
        red: '#ff4d4d',
        gold: tok('--gold', '#ffd166')
      };
    }

    let pieceMeshes = [];
    let explodeOff = [];
    let hintMesh = null, pulseRaf = 0, pulseT0 = 0;
    // the hint's outline breathes for a few seconds so the eye finds it
    function pulse() {
      pulseRaf = 0;
      if (!hintMesh) return;
      const t = (now() - pulseT0) / 1000;
      hintMesh.alpha = t < 5 ? 0.45 + 0.3 * Math.sin(t * 5.5) : 0.5;
      v.render();
      if (t < 5) pulseRaf = root.requestAnimationFrame(pulse);
    }
    function startPulse() { pulseT0 = now(); if (!pulseRaf) pulseRaf = root.requestAnimationFrame(pulse); }
    const figFoot = figViews.top;

    function rebuild() {
      const a = analyse();
      const T = theme();
      v.clear();
      // the table, with the figure's footprint as a mat
      {
        const verts = [], faces = [], colors = [];
        for (let x = area.x0; x <= area.x1; x++) {
          for (let z = area.z0; z <= area.z1; z++) {
            const b = verts.length;
            verts.push([x, 0, z], [x, 0, z + 1], [x + 1, 0, z + 1], [x + 1, 0, z]);
            faces.push([b, b + 1, b + 2, b + 3]);
            colors.push(figFoot.has(x + ',' + z) ? T.mat : ((x + z) & 1 ? T.floor : T.floor2));
          }
        }
        v.add({ verts, faces, colors, stroke: T.grid, lw: 1, bias: 1e5, pickable: false });
      }
      if (mode === 'views') buildWalls(T, a);
      // shadows on the table
      a.info.forEach((x, i) => {
        const cols = new Set();
        x.cells.forEach((c) => cols.add(c[0] + ',' + c[2]));
        const verts = [], faces = [];
        const off = exploded && explodeOff[i] ? explodeOff[i] : [0, 0, 0];
        cols.forEach((k) => {
          const [cx, cz] = k.split(',').map(Number);
          const x0 = cx + 0.05 + off[0], z0 = cz + 0.05 + off[2], x1 = cx + 0.95 + off[0], z1 = cz + 0.95 + off[2], y = 0.012;
          const b = verts.length;
          verts.push([x0, y, z0], [x0, y, z1], [x1, y, z1], [x1, y, z0]);
          faces.push([b, b + 1, b + 2, b + 3]);
        });
        const isSel = i === sel;
        v.add({ verts, faces, color: isSel ? T.gold : '#000000', alpha: isSel ? 0.42 : (T.light ? 0.13 : 0.24), stroke: false, bias: 5e4, pickable: false });
      });
      // the figure's ghost: the cubes still empty
      if (mode !== 'views' && ghostOn) {
        const empty = m.cells.filter((c) => !a.occ.has(K(c)));
        if (empty.length) {
          if (mode === 'shell') {
            const sm = shellMesh(empty, figSet);
            v.add({ verts: sm.verts, faces: sm.faces, color: T.ghost, alpha: 0.3, stroke: false, pickable: false });
          } else {
            const gm = cubeMesh(empty, { solid: figSet, color: () => T.ghost });
            v.add(Object.assign(gm, { alpha: 0.17, stroke: T.ghostLine, lw: 1.1, pickable: false }));
          }
        }
      }
      // the pieces
      explodeOff = [];
      if (exploded) {
        a.info.forEach((x, i) => {
          if (!x.inF) return;
          const c = [0, 1, 2].map((k) => x.cells.reduce((s, q) => s + q[k] + 0.5, 0) / x.n);
          const d = [c[0] - figC[0], (c[1] - figC[1]) * 0.8, c[2] - figC[2]];
          const l = Math.hypot(d[0], d[1], d[2]) || 1;
          const k = 1.1 + 1.1 / l;
          explodeOff[i] = [d[0] * k, Math.max(-0.2, d[1] * k) + 0.6 + c[1] * 0.35, d[2] * k];
        });
      }
      pieceMeshes = a.info.map((x, i) => {
        const pc = m.pieces[i];
        const showOut = mode !== 'views' && x.inF > 0;
        const gm = cubeMesh(x.cells, {
          color: (ci) => (x.bad[ci] === 2 || (x.bad[ci] === 1 && showOut) ? mix(pc.color, T.red, 0.72) : pc.color),
          decal: (ci) => (ci === labelCell[i] ? { text: pc.tag, color: 'rgba(15,18,40,.55)', size: pc.tag.length > 1 ? 0.42 : 0.56 } : null)
        });
        const mesh = v.add(Object.assign(gm, { id: 'pc' + i, pc: i, lw: 1.2 }));
        if (locked.has(i)) { mesh.colors = mesh.colors.map((c) => mix(c, '#8a8f9e', 0.35)); mesh.stroke = 'rgba(0,0,0,.6)'; }
        if (i === sel) { mesh.selected = true; mesh.selColor = T.gold; }
        if (flash && flash.i === i) { mesh.selected = true; mesh.selColor = flash.color || T.red; }
        return mesh;
      });
      // where the piece you hold would land if you dropped it now
      if (sel >= 0 && !busy && !locked.has(sel) && !exploded) {
        const land = landing(sel);
        if (land && land[2] !== st[sel][2]) {
          const cells = cellsOf(sel, land);
          const fits = mode !== 'views' && cells.every((c) => figSet.has(K(c)));
          const gm = cubeMesh(cells, { color: () => m.pieces[sel].color });
          v.add(Object.assign(gm, { alpha: 0.22, stroke: fits ? T.good : (T.light ? 'rgba(30,30,60,.45)' : 'rgba(255,255,255,.45)'), lw: 1.4, pickable: false }));
        }
      }
      // a hint: where one more piece can go
      hintMesh = null;
      if (hintMark) {
        const gm = cubeMesh(hintMark.cells, { color: () => m.pieces[hintMark.i].color });
        hintMesh = v.add(Object.assign(gm, { alpha: 0.5, stroke: T.gold, lw: 2.4, pickable: false, bias: -0.05 }));
      }
      applyAnims(now());
      v.render();
      syncUI(a);
      return a;
    }

    function buildWalls(T, a) {
      const H = Math.max(fb.hi[1] + 2, 3);
      const zw = area.z0, xw = area.x1 + 1;
      // the back wall (front view) and the right wall (side view), seen from inside only
      const bw = { verts: [], faces: [] }, sw = { verts: [], faces: [] };
      for (let x = area.x0; x <= area.x1; x++) for (let y = 0; y < H; y++) {
        const b = bw.verts.length;
        bw.verts.push([x, y, zw], [x + 1, y, zw], [x + 1, y + 1, zw], [x, y + 1, zw]);
        bw.faces.push([b, b + 1, b + 2, b + 3]);
      }
      for (let z = area.z0; z <= area.z1; z++) for (let y = 0; y < H; y++) {
        const b = sw.verts.length;
        sw.verts.push([xw, y, z], [xw, y, z + 1], [xw, y + 1, z + 1], [xw, y + 1, z]);
        sw.faces.push([b, b + 1, b + 2, b + 3]);
      }
      v.add(Object.assign(bw, { color: T.wall, stroke: T.grid, lw: 1, bias: 4e4, pickable: false }));
      v.add(Object.assign(sw, { color: T.wall, stroke: T.grid, lw: 1, bias: 4e4, pickable: false }));
      // the silhouettes
      const fq = { verts: [], faces: [] }, sq = { verts: [], faces: [] };
      figViews.front.forEach((k) => {
        const [x, y] = k.split(',').map(Number), b = fq.verts.length, z = zw + 0.02;
        fq.verts.push([x, y, z], [x + 1, y, z], [x + 1, y + 1, z], [x, y + 1, z]);
        fq.faces.push([b, b + 1, b + 2, b + 3]);
      });
      figViews.side.forEach((k) => {
        const [z, y] = k.split(',').map(Number), b = sq.verts.length, x = xw - 0.02;
        sq.verts.push([x, y, z], [x, y, z + 1], [x, y + 1, z + 1], [x, y + 1, z]);
        sq.faces.push([b, b + 1, b + 2, b + 3]);
      });
      const silLine = T.light ? 'rgba(20,24,60,.35)' : 'rgba(255,255,255,.35)';
      v.add(Object.assign(fq, { color: T.sil, alpha: 0.8, stroke: silLine, lw: 1, bias: 3e4, pickable: false }));
      v.add(Object.assign(sq, { color: T.sil, alpha: 0.8, stroke: silLine, lw: 1, bias: 3e4, pickable: false }));
      // your shadows, from the cubes inside the figure's box
      const pv = buildProjection(a);
      const mk = (list, plane) => {
        const good = { verts: [], faces: [] }, bad = { verts: [], faces: [] };
        list.forEach(([p, q, ok]) => {
          const tg = ok ? good : bad, b = tg.verts.length, g = 0.2;
          if (plane === 'front') tg.verts.push([p + g, q + g, zw + 0.04], [p + 1 - g, q + g, zw + 0.04], [p + 1 - g, q + 1 - g, zw + 0.04], [p + g, q + 1 - g, zw + 0.04]);
          else tg.verts.push([xw - 0.04, q + g, p + g], [xw - 0.04, q + g, p + 1 - g], [xw - 0.04, q + 1 - g, p + 1 - g], [xw - 0.04, q + 1 - g, p + g]);
          tg.faces.push([b, b + 1, b + 2, b + 3]);
        });
        if (good.faces.length) v.add(Object.assign(good, { color: T.good, alpha: 0.85, stroke: false, bias: 2e4, pickable: false }));
        if (bad.faces.length) v.add(Object.assign(bad, { color: T.red, alpha: 0.9, stroke: false, bias: 2e4, pickable: false }));
      };
      mk(pv.front, 'front');
      mk(pv.side, 'side');
    }

    // the shadows your cubes cast (only cubes inside the figure's box count)
    function buildProjection(a) {
      const front = new Map(), side = new Map(), top = new Map();
      a.info.forEach((x) => x.cells.forEach((c) => {
        if (c[0] < fb.lo[0] - 0 || c[0] > fb.hi[0] || c[2] < fb.lo[2] || c[2] > fb.hi[2]) return;
        front.set(c[0] + ',' + c[1], [c[0], c[1], figViews.front.has(c[0] + ',' + c[1])]);
        side.set(c[2] + ',' + c[1], [c[2], c[1], figViews.side.has(c[2] + ',' + c[1])]);
        top.set(c[0] + ',' + c[2], [c[0], c[2], figViews.top.has(c[0] + ',' + c[2])]);
      }));
      return { front: Array.from(front.values()), side: Array.from(side.values()), top: Array.from(top.values()) };
    }

    /* ----- smooth motion: every change is drawn as a short glide or turn ----- */

    const now = () => (root.performance ? root.performance.now() : Date.now());
    const anims = new Map();
    let raf = 0;
    const ease = (t) => 0.5 - Math.cos(t * Math.PI) / 2;
    function startAnim(i, from, to, opts) {
      opts = opts || {};
      const dur = opts.dur || C.anim(from[0] === to[0] ? 110 : 190);
      const q = P.MUL[to[0]][P.INV[from[0]]];
      const aa = P.axisAngle(q);
      const cOld = [from[1] + 0.5, from[2] + 0.5, from[3] + 0.5], cNew = [to[1] + 0.5, to[2] + 0.5, to[3] + 0.5];
      // a glide that is still under way carries on from where the piece is now
      const prev = anims.get(i);
      let carry = [0, 0, 0];
      if (prev && prev.move && from[0] === to[0]) {
        const t = Math.min(1, (now() - prev.t0) / prev.dur), e = ease(t);
        carry = V3.mul(prev.d, 1 - e);
      }
      const lift = opts.lift || 0;
      const a = { t0: now(), dur, move: from[0] === to[0] && !lift };
      if (a.move) {
        a.d = V3.add(V3.sub(cOld, cNew), carry);
        a.f = (e) => M4.translate(a.d[0] * (1 - e), a.d[1] * (1 - e), a.d[2] * (1 - e));
      } else {
        a.f = (e) => {
          const c = V3.lerp(cOld, cNew, e);
          const off = [c[0] - cNew[0], c[1] - cNew[1] + lift * Math.sin(Math.PI * e), c[2] - cNew[2]];
          return M4.mul(M4.translate(off[0], off[1], off[2]), M4.rotate(-(1 - e) * aa.deg, aa.axis, cNew));
        };
      }
      anims.set(i, a);
      if (!raf) raf = root.requestAnimationFrame(tick);
    }
    function tick() {
      raf = 0;
      applyAnims(now());
      v.render();
      if (anims.size) raf = root.requestAnimationFrame(tick);
    }
    function applyAnims(t) {
      pieceMeshes.forEach((mesh, i) => {
        let M = null;
        const a = anims.get(i);
        if (a) {
          const k = Math.min(1, (t - a.t0) / a.dur);
          if (k >= 1) anims.delete(i);
          else M = a.f(ease(k));
        }
        const off = exploded && explodeOff[i];
        if (off) M = M4.mul(M4.translate(off[0], off[1], off[2]), M || M4.id());
        mesh.m = M || M4.id();
      });
    }

    /* ----- the controls on the stage: piece chips at the top, a pad at the bottom ----- */

    const IC = icons();
    const chipBar = ctx.h('div.sm-chips');
    const chips = m.pieces.map((pc, i) => {
      const b = ctx.h('button.sm-chip' + (locked.has(i) ? '.locked' : ''), {
        type: 'button', tabindex: '-1',
        title: pc.name + (locked.has(i) ? ' — fixed in place' : ' — click to pick it up' + (i < 9 ? ' (key ' + (i + 1) + ')' : ''))
      }, pc.tag);
      b.style.setProperty('--c', pc.color);
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); if (locked.has(i)) { ctx.toast('The ' + pc.tag + ' piece is fixed in place.'); return; } select(sel === i ? -1 : i); });
      chipBar.appendChild(b);
      return b;
    });
    if (N > 10) chipBar.classList.add('many');
    const pad = ctx.h('div.sm-pad');
    const padTitle = ctx.h('div.sm-pad-title');
    const padGrid = ctx.h('div.sm-pad-grid');
    let padOpen = true;
    try { padOpen = C.store.get('soma-pad', true) !== false; } catch (e) { padOpen = true; }
    const padToggle = ctx.h('button.sm-pad-fold', { type: 'button', tabindex: '-1', title: 'Fold the pad away (the keys still work)' });
    const setPad = (on) => {
      padOpen = on;
      pad.classList.toggle('folded', !on);
      padToggle.innerHTML = on ? '&#x2212;' : '+';
      padToggle.title = on ? 'Fold the pad away (the keys still work)' : 'Show the pad of moves';
      try { C.store.set('soma-pad', on); } catch (e) { /* no storage */ }
    };
    padToggle.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); setPad(!padOpen); });
    pad.append(ctx.h('div.sm-pad-head', padTitle, padToggle), padGrid);
    setPad(padOpen);
    const padBtns = [];
    function padBtn(cmd, icon, keyLabel, title, row, col, repeat, wide) {
      const b = ctx.h('button.sm-btn' + (wide ? '.wide' : ''), { type: 'button', tabindex: '-1', title, 'aria-label': title });
      b.innerHTML = svgIcon(icon) + '<kbd>' + keyLabel + '</kbd>';
      b.style.gridRow = String(row);
      b.style.gridColumn = String(col);
      let rep = 0, rep2 = 0;
      const stop = () => { clearTimeout(rep); clearInterval(rep2); rep = rep2 = 0; };
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        run(cmd);
        if (repeat) { stop(); rep = setTimeout(() => { rep2 = setInterval(() => run(cmd), 150); }, 380); }
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((n) => b.addEventListener(n, stop));
      b.stopRepeat = stop;
      padGrid.appendChild(b);
      padBtns.push(b);
      return b;
    }
    padBtn('away', IC.away, 'W', 'Move away from you (W or ↑)', 1, 2, true);
    padBtn('left', IC.left, 'A', 'Move left (A or ←)', 2, 1, true);
    padBtn('near', IC.near, 'S', 'Move toward you (S or ↓)', 2, 2, true);
    padBtn('right', IC.right, 'D', 'Move right (D or →)', 2, 3, true);
    padBtn('up', IC.lift, 'PgUp', 'Lift it one cube (PgUp or Shift+↑)', 1, 5, true);
    padBtn('down', IC.lower, 'PgDn', 'Lower it one cube (PgDn or Shift+↓)', 2, 5, true);
    padBtn('Q', IC.Q, 'Q', 'Spin it anticlockwise, seen from above (Q)', 1, 7);
    padBtn('E', IC.E, 'E', 'Spin it clockwise, seen from above (E)', 2, 7);
    padBtn('R', IC.R, 'R', 'Tip it away from you (R)', 1, 8);
    padBtn('F', IC.F, 'F', 'Tip it toward you (F)', 2, 8);
    padBtn('T', IC.T, 'T', 'Roll it to the left (T)', 1, 9);
    padBtn('G', IC.G, 'G', 'Roll it to the right (G)', 2, 9);
    padBtn('drop', IC.drop, 'Enter', 'Drop it: let it fall until it rests (Enter or Space)', 1, 11, false, true);
    padBtn('tray', IC.tray, 'Bksp', 'Put it back on the table where it started (Backspace)', 2, 11, false, true);
    wb.host.append(chipBar, pad);

    // the side panel: view buttons, the three views, the pieces, the keys
    const btnView = ctx.h('button.btn.small', { type: 'button', title: 'Look from the usual angle again (0)', onclick: (e) => { e.currentTarget.blur(); resetView(); } }, 'Reset view');
    const btnExp = ctx.h('button.btn.small', { type: 'button', title: 'Pull the pieces in the figure apart to look inside (X)', onclick: (e) => { e.currentTarget.blur(); toggleExplode(); } }, 'Exploded view');
    const btnGhost = mode === 'views' ? null : ctx.h('button.btn.small', { type: 'button', title: 'Hide or show the see-through figure (H)', onclick: (e) => { e.currentTarget.blur(); toggleGhost(); } }, 'Hide the figure');
    const viewsBox = mode === 'views' ? ctx.h('div.sm-views') : null;
    const pieceList = ctx.h('div.sm-plist');
    const pieceRows = m.pieces.map((pc, i) => {
      const cols = {};
      const nc = P.norm(pc.raw);
      nc.forEach((c) => { cols[K(c)] = shades(pc.color); });
      const row = ctx.h('button.sm-prow' + (locked.has(i) ? '.locked' : ''), { type: 'button', tabindex: '-1', title: locked.has(i) ? 'Fixed in place' : 'Pick it up' });
      row.innerHTML = '<span class="sm-pic">' + isoSVG(nc, { colors: cols, sw: 0.04 }) + '</span><span class="sm-pname"><b>' + C.esc(pc.tag) + '</b> ' + C.esc(pc.name.replace(/^[^·]*·\s*/, '')) + '</span><span class="sm-pstate"></span>';
      row.addEventListener('click', () => { row.blur(); if (locked.has(i)) { ctx.toast('That piece is fixed in place.'); return; } select(i); });
      pieceList.appendChild(row);
      return row;
    });
    const keysBox = ctx.h('details.sm-keys');
    keysBox.innerHTML = '<summary>Keys</summary><div class="sm-keygrid">' + [
      ['Tab, 1–9', 'pick up a piece'], ['Esc', 'put it down'],
      ['← → ↑ ↓ or W A S D', 'slide it (as you see it)'], ['PgUp PgDn', 'lift, lower'],
      ['Q E', 'spin anticlockwise, clockwise'], ['R F', 'tip away, toward you'], ['T G', 'roll left, right'],
      ['Enter, Space', 'drop it'], ['Backspace', 'back to the table'],
      ['0', 'reset the view'], ['X', 'exploded view'], ['H', 'hide the figure']
    ].map((r) => '<kbd>' + r[0] + '</kbd><span>' + r[1] + '</span>').join('') + '</div>';
    ctx.panel.appendChild(ctx.h('div.sm-panel',
      ctx.h('div.sm-row', btnView, btnExp, btnGhost),
      viewsBox, pieceList, keysBox));

    if (!p.goal) {
      const all = m.any ? '' : ' with all ' + numw(N) + ' pieces';
      ctx.setGoal(mode === 'views'
        ? 'Build the one figure that casts these three shadows — on the back wall, the side wall and the table —' + all + '.'
        : mode === 'shell' ? 'Fill the see-through figure' + all + ', every cube exactly once.'
          : 'Fill every ghost cube of the figure' + (m.any ? ' (you choose which pieces)' : all) + ', each cube exactly once.');
    }

    // a cube inside the figure's box (all the views puzzles tell you: the figure itself stays hidden)
    const inBox = (c) => c[0] >= fb.lo[0] && c[0] <= fb.hi[0] && c[1] <= fb.hi[1] && c[2] >= fb.lo[2] && c[2] <= fb.hi[2];
    function syncUI(a) {
      const hidden = mode === 'views';
      chips.forEach((b, i) => {
        b.classList.toggle('sel', i === sel);
        b.classList.toggle('done', !hidden && a.info[i].ok);
        b.classList.toggle('bad', hidden ? a.info[i].over > 0 : a.info[i].inF > 0 && !a.info[i].ok);
      });
      pieceRows.forEach((r, i) => {
        r.classList.toggle('sel', i === sel);
        const x = a.info[i];
        r.querySelector('.sm-pstate').textContent = locked.has(i) ? 'fixed' : hidden ? (x.over ? 'overlaps' : x.cells.every(inBox) ? 'in the box' : '')
          : x.ok ? '✓ in place' : x.inF > 0 ? 'sticks out' : '';
      });
      pad.classList.toggle('off', sel < 0);
      if (sel < 0) padTitle.innerHTML = '<span class="muted">Click a piece to pick it up — or press Tab</span>';
      else {
        const x = a.info[sel], pc = m.pieces[sel];
        const high = Math.min.apply(null, x.cells.map((c) => c[1])) > 0, land = high ? landing(sel) : null;
        const loose = land && land[2] !== st[sel][2] ? '<em>in the air — Enter drops it</em>' : high ? '<em>resting on another piece</em>' : '<em>on the table</em>';
        const where = x.over && (x.inF || hidden) ? '<em class="bad">overlaps another piece</em>'
          : hidden ? (x.cells.every(inBox) ? '<em>in the box</em>' : x.cells.some(inBox) ? '<em>partly in the box</em>' : loose)
            : x.ok ? '<em class="ok">in the figure</em>' : x.inF > 0 ? '<em class="bad">sticks out</em>' : loose;
        padTitle.innerHTML = '<i style="background:' + pc.color + '"></i><b>' + C.esc(pc.tag) + '</b> ' + where;
      }
      btnExp.classList.toggle('on', exploded);
      if (btnGhost) btnGhost.textContent = ghostOn ? 'Hide the figure' : 'Show the figure';
      if (viewsBox) drawViews(a);
      if (busy || a.solved) return;
      if (hidden) {
        let n = 0;
        a.info.forEach((x) => x.cells.forEach((c) => { if (inBox(c)) n++; }));
        ctx.say(n ? C.plural(n, 'cube') + ' of your ' + m.cells.length + ' in the figure\'s box. Compare the dots with the views.' : 'Work out the figure from its three shadows, then build it in the box by the two walls.');
      } else if (m.any) ctx.say(a.empty ? C.plural(a.empty, 'cube') + ' of the figure still empty.' : 'Every cube is filled — is anything sticking out?');
      else ctx.say(a.placed.length || locked.size ? C.plural(a.placed.length, 'piece') + ' of ' + N + ' in place' + (a.empty ? ', ' + C.plural(a.empty, 'cube') + ' still empty.' : '.') : 'Build the figure: pick up a piece, move it in, turn it to fit.');
    }

    // the three views in the side panel, with your cubes' shadows over them
    function drawViews(a) {
      const pv = buildProjection(a);
      const W = fb.size[0], H = fb.size[1], D = fb.size[2];
      const S = 14, gap = 22, pad0 = 4;
      const tall = Math.max(H, D);
      const Wt = (W + D + W) * S + 2 * gap + 2 * pad0, Ht = tall * S + 26 + pad0;
      let s = '<svg viewBox="0 0 ' + Wt + ' ' + Ht + '" class="sm-vsvg">';
      const panel = (ox, cols, rows, has, mine, label, flipY) => {
        s += '<text x="' + (ox + cols * S / 2) + '" y="' + (Ht - 6) + '" text-anchor="middle" class="sm-vlab">' + label + '</text>';
        const oy = pad0 + (tall - rows) * S;
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
          const y = flipY ? oy + (rows - 1 - j) * S : oy + j * S;
          s += '<rect x="' + (ox + i * S) + '" y="' + y + '" width="' + S + '" height="' + S + '" class="' + (has(i, j) ? 'sm-vf' : 'sm-ve') + '"/>';
        }
        mine.forEach(([i, j, ok]) => {
          const y = flipY ? oy + (rows - 1 - j) * S : oy + j * S;
          s += '<circle cx="' + (ox + i * S + S / 2) + '" cy="' + (y + S / 2) + '" r="' + (S * 0.26) + '" class="' + (ok ? 'sm-vok' : 'sm-vbad') + '"/>';
        });
      };
      panel(pad0, W, H, (i, j) => figViews.front.has((i + fb.lo[0]) + ',' + (j + fb.lo[1])), pv.front.map(([x, y, ok]) => [x - fb.lo[0], y - fb.lo[1], ok]), 'front', true);
      panel(pad0 + W * S + gap, D, H, (i, j) => figViews.side.has((i + fb.lo[2]) + ',' + (j + fb.lo[1])), pv.side.map(([z, y, ok]) => [z - fb.lo[2], y - fb.lo[1], ok]), 'side', true);
      panel(pad0 + (W + D) * S + 2 * gap, W, D, (i, j) => figViews.top.has((i + fb.lo[0]) + ',' + (j + fb.lo[2])), pv.top.map(([x, z, ok]) => [x - fb.lo[0], z - fb.lo[2], ok]), 'top', false);
      viewsBox.innerHTML = s + '</svg><div class="sm-vnote">Dots are the shadows of your cubes: <span class="ok">green</span> inside a view, <span class="bad">red</span> outside.</div>';
    }

    /* ----- moving pieces ----- */

    function inArea(cells) {
      return cells.every((c) => c[0] >= area.x0 && c[0] <= area.x1 && c[2] >= area.z0 && c[2] <= area.z1 && c[1] >= 0 && c[1] <= area.h);
    }
    function othersOcc(i) {
      const s = new Set();
      st.forEach((x, j) => { if (j !== i) cellsOf(j).forEach((c) => s.add(K(c))); });
      return s;
    }
    const collides = (i, s, occ) => cellsOf(i, s).some((c) => occ.has(K(c)));
    // shift a turned piece back onto the table (above the floor, inside the edges)
    function fitIn(i, s) {
      s = s.slice();
      const cs = cellsOf(i, s), b = P.bbox(cs);
      if (b.lo[1] < 0) s[2] -= b.lo[1];
      if (b.lo[0] < area.x0) s[1] += area.x0 - b.lo[0];
      if (b.hi[0] > area.x1) s[1] -= b.hi[0] - area.x1;
      if (b.lo[2] < area.z0) s[3] += area.z0 - b.lo[2];
      if (b.hi[2] > area.z1) s[3] -= b.hi[2] - area.z1;
      return inArea(cellsOf(i, s)) ? s : null;
    }
    function commit(i, s, opts) {
      const old = st[i];
      if (same(old, s)) return false;
      st[i] = s;
      startAnim(i, old, s, opts);
      if (hintMark && hintMark.i === i && P.keyOf(cellsOf(i)) === P.keyOf(hintMark.cells)) {
        hintMark = null;
        later(() => ctx.toast('That is the spot.'), C.anim(200));
      }
      rebuild();
      return true;
    }
    function scheduleChanged() {
      clearTimeout(pendingT);
      pendingT = setTimeout(() => { pendingT = 0; ctx.changed('move'); }, 380);
    }
    function flushChanged() {
      clearTimeout(pendingT);
      pendingT = 0;
      ctx.changed('move');
    }
    const canAct = () => !busy && sel >= 0 && !locked.has(sel);
    function needPiece() { ctx.toast('Pick up a piece first: click it, or press Tab.'); }

    function nudge(d) {
      if (!canAct()) { if (!busy) needPiece(); return; }
      const s = st[sel].slice();
      s[1] += d[0]; s[2] += d[1]; s[3] += d[2];
      if (!inArea(cellsOf(sel, s))) { ctx.toast(d[1] < 0 ? 'It is on the table already.' : d[1] > 0 ? 'That is high enough.' : 'That is the edge of the table.'); return; }
      if (commit(sel, s)) { ctx.sfx('tap'); scheduleChanged(); }
    }
    function turnSel(q) {
      if (!canAct()) { if (!busy) needPiece(); return; }
      const s0 = st[sel];
      const s = fitIn(sel, [P.MUL[q][s0[0]], s0[1], s0[2], s0[3]]);
      if (!s) { ctx.toast('No room to turn it here.'); return; }
      if (!commit(sel, s)) ctx.toast('It looks the same turned that way.');
      else { ctx.sfx('tap'); scheduleChanged(); }
    }
    // where piece i comes to rest if let go: out of anything it overlaps, then down until it sits on something
    function landing(i) {
      const occ = othersOcc(i);
      let s = st[i].slice(), guard = 0;
      while (collides(i, s, occ) && guard++ < 40) s[2]++;
      for (;;) {
        const t = s.slice();
        t[2]--;
        if (cellsOf(i, t).some((c) => c[1] < 0) || collides(i, t, occ)) break;
        s = t;
      }
      return inArea(cellsOf(i, s)) ? s : null;
    }
    function dropSel() {
      if (!canAct()) { if (!busy) needPiece(); return; }
      const i = sel, s = landing(i);
      if (!s) { ctx.toast('There is no room above it.'); return; }
      if (commit(i, s, { dur: C.anim(Math.min(420, 90 + 70 * Math.abs(s[2] - st[i][2]))) })) { ctx.sfx('snap'); flushChanged(); }
      else ctx.toast('It is resting already.');
    }
    function traySel() {
      if (!canAct()) { if (!busy) needPiece(); return; }
      const h = L.home[sel];
      if (commit(sel, [h.ri, h.t[0], h.t[1], h.t[2]], { lift: 1.6, dur: C.anim(420) })) { ctx.sfx('tap'); flushChanged(); }
    }
    // where a piece lands if it is let down from above at (x, z)
    function restAt(i, ri, x, z, occ, topY) {
      const s = [ri, x, 0, z];
      const low = Math.min.apply(null, cellsOf(i, s).map((c) => c[1]));
      s[2] = topY - low;
      for (;;) {
        const t = s.slice();
        t[2]--;
        if (cellsOf(i, t).some((c) => c[1] < 0) || collides(i, t, occ)) break;
        s[2] = t[2];
      }
      return s;
    }

    // the directions as you see them: the table axis nearest to "right" and to "away from you"
    function camAxes() {
      const B = v.basis();
      let fh = [B.f[0], 0, B.f[2]];
      if (Math.hypot(fh[0], fh[2]) < 0.15) fh = [B.u[0], 0, B.u[2]];
      const fa = Math.abs(fh[0]) > Math.abs(fh[2]) ? 0 : 2, fs = Math.sign(fh[fa]) || 1;
      const ra = fa === 0 ? 2 : 0, rs = Math.sign(B.r[ra]) || 1;
      return { fa, fs, ra, rs };
    }
    function dirOf(cmd) {
      const a = camAxes(), d = [0, 0, 0];
      if (cmd === 'right') d[a.ra] = a.rs;
      else if (cmd === 'left') d[a.ra] = -a.rs;
      else if (cmd === 'away') d[a.fa] = a.fs;
      else if (cmd === 'near') d[a.fa] = -a.fs;
      else if (cmd === 'up') d[1] = 1;
      else if (cmd === 'down') d[1] = -1;
      return d;
    }
    function turnOf(cmd) {
      const a = camAxes();
      if (cmd === 'Q') return P.turn(1, 1);
      if (cmd === 'E') return P.turn(1, -1);
      // +90 about +axis(ra) carries the top toward axis(ra) × up
      const k = [0, 0, 0];
      k[a.ra] = 1;
      const top = V3.cross(k, [0, 1, 0]);
      const away = top[a.fa] * a.fs > 0;
      if (cmd === 'R') return P.turn(a.ra, away ? 1 : -1);
      if (cmd === 'F') return P.turn(a.ra, away ? -1 : 1);
      if (cmd === 'T') return P.turn(a.fa, -a.fs);
      return P.turn(a.fa, a.fs);
    }
    function run(cmd) {
      if (busy) return;
      if (cmd === 'drop') return dropSel();
      if (cmd === 'tray') return traySel();
      if ('QERFTG'.includes(cmd)) return turnSel(turnOf(cmd));
      return nudge(dirOf(cmd));
    }

    function select(i) {
      if (busy) return;
      if (i >= 0 && locked.has(i)) return;
      if (i === sel) return;
      sel = i;
      rebuild();
      if (i >= 0) ctx.sfx('tap');
    }
    function cycle(dir) {
      const free = m.pieces.map((pc, i) => i).filter((i) => !locked.has(i));
      if (!free.length) return;
      // pieces not yet in place first
      const a = analyse();
      const order = free.filter((i) => !a.info[i].ok).concat(free.filter((i) => a.info[i].ok));
      const at = order.indexOf(sel);
      select(order[at < 0 ? (dir > 0 ? 0 : order.length - 1) : (at + dir + order.length) % order.length]);
    }

    /* ----- the mouse: drag a piece across the table, drag elsewhere to look around ----- */

    let drag = null;
    function rayAtY(pt, Y) {
      const B = v.basis();
      const focal = (v.h / 2) / Math.tan(v.cam.fov * Math.PI / 360);
      const dir = V3.add(B.f, V3.add(V3.mul(B.r, (pt[0] - v.w / 2) / focal), V3.mul(B.u, -(pt[1] - v.h / 2) / focal)));
      if (Math.abs(dir[1]) < 1e-4) return null;
      const t = (Y - B.e[1]) / dir[1];
      if (!(t > 0) || t > 400) return null;
      return V3.add(B.e, V3.mul(dir, t));
    }
    function onDown(hit, ev, pt) {
      if (busy || !hit || !hit.mesh || hit.mesh.pc == null) return false;
      const i = hit.mesh.pc;
      if (locked.has(i)) return false;
      const cells = cellsOf(i);
      const cell = cells[hit.cell] || cells[0];
      const Y = cell[1] + (hit.dir === 'py' ? 1 : 0.5);
      const occ = othersOcc(i);
      let topY = 0;
      occ.forEach((k) => { const y = +k.split(',')[1] + 1; if (y > topY) topY = y; });
      drag = { i, s0: st[i].slice(), Y, P0: rayAtY(pt, Y), moved: false, occ, topY, wasSel: sel === i };
      if (sel !== i) { sel = i; rebuild(); ctx.sfx('tap'); }
      return true;
    }
    function onMove(ev, pt) {
      if (!drag || !drag.P0) return;
      const q = rayAtY(pt, drag.Y);
      if (!q) return;
      const dx = Math.round(q[0] - drag.P0[0]), dz = Math.round(q[2] - drag.P0[2]);
      if (!drag.moved && !dx && !dz) return;
      let s = restAt(drag.i, drag.s0[0], drag.s0[1] + dx, drag.s0[3] + dz, drag.occ, drag.topY);
      if (!inArea(cellsOf(drag.i, s))) {
        // keep it on the table: slide along the edge
        const b = P.bbox(cellsOf(drag.i, s));
        let ex = 0, ez = 0;
        if (b.lo[0] < area.x0) ex = area.x0 - b.lo[0];
        if (b.hi[0] > area.x1) ex = area.x1 - b.hi[0];
        if (b.lo[2] < area.z0) ez = area.z0 - b.lo[2];
        if (b.hi[2] > area.z1) ez = area.z1 - b.hi[2];
        s = restAt(drag.i, drag.s0[0], drag.s0[1] + dx + ex, drag.s0[3] + dz + ez, drag.occ, drag.topY);
        if (!inArea(cellsOf(drag.i, s))) return;
      }
      if (same(s, st[drag.i])) return;
      drag.moved = true;
      commit(drag.i, s, { dur: C.anim(80) });
    }
    function onUp() {
      const d = drag;
      drag = null;
      if (!d) return;
      if (d.moved) { ctx.sfx('snap'); flushChanged(); }
    }
    function onTap(hit) {
      if (busy) return;
      if (hit && hit.mesh && hit.mesh.pc != null && locked.has(hit.mesh.pc)) { ctx.toast('The ' + m.pieces[hit.mesh.pc].tag + ' piece is fixed in place.'); return; }
      if (sel >= 0) select(-1);
    }
    // the pointer shows what a drag will do: a hand over a piece you can move, the usual grab elsewhere
    function onHover(hit) {
      const free = hit && hit.mesh && hit.mesh.pc != null && !locked.has(hit.mesh.pc) && !busy;
      v.canvas.style.cursor = free ? 'pointer' : '';
    }
    function onOrbit(cam) {
      camTouched = true;
      if (cam.pitch < 6 || cam.pitch > 86) { cam.pitch = Math.max(6, Math.min(86, cam.pitch)); v.render(); }
    }

    function resetView() {
      v.cam.yaw = DEF_CAM.yaw;
      v.cam.pitch = DEF_CAM.pitch;
      frame();
      rebuild();
      camTouched = false;
    }
    // fit the table into the part of the stage between the piece chips and the pad
    function frame() {
      const H = Math.max(fb.hi[1] + 1, 2), pts = [];
      [area.x0, area.x1 + 1].forEach((x) => [area.z0, area.z1 + 1].forEach((z) => pts.push([x, 0, z])));
      [fb.lo[0], fb.hi[0] + 1].forEach((x) => [fb.lo[2], fb.hi[2] + 1].forEach((z) => pts.push([x, H, z])));
      if (mode === 'views') {
        const WH = Math.max(fb.hi[1] + 2, 3);
        pts.push([area.x0, WH, area.z0], [area.x1 + 1, WH, area.z0], [area.x1 + 1, WH, area.z1 + 1]);
      }
      v.cam.target = [(area.x0 + area.x1 + 1) / 2, H / 3, (area.z0 + area.z1 + 1) / 2];
      v.cam.dist = Math.hypot(area.x1 - area.x0 + 1, area.z1 - area.z0 + 1) * 1.3 + 4;
      const top = (chipBar.offsetHeight || 34) + 16, bottom = (pad.offsetHeight || 60) + 18;
      const availW = Math.max(120, v.w - 24), availH = Math.max(100, v.h - top - bottom);
      const focal = (v.h / 2) / Math.tan(v.cam.fov * Math.PI / 360);
      for (let it = 0; it < 6; it++) {
        const B = v.basis();
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        pts.forEach((q) => {
          const s = v.project(q, B);
          if (s[0] < x0) x0 = s[0]; if (s[0] > x1) x1 = s[0]; if (s[1] < y0) y0 = s[1]; if (s[1] > y1) y1 = s[1];
        });
        const k = Math.max((x1 - x0) / availW, (y1 - y0) / availH);
        const dx = (x0 + x1) / 2 - v.w / 2, dy = (y0 + y1) / 2 - (top + availH / 2);
        v.cam.target = V3.add(v.cam.target, V3.sub(V3.mul(B.r, dx / focal * v.cam.dist), V3.mul(B.u, dy / focal * v.cam.dist)));
        v.cam.dist = Math.max(3, v.cam.dist * (0.25 + 0.75 * k));
      }
    }
    function toggleExplode() { exploded = !exploded; rebuild(); }
    function toggleGhost() { ghostOn = !ghostOn; rebuild(); }

    // fit the camera once the stage has its size (and again on resizes until the user turns the view)
    const ro = root.ResizeObserver ? new root.ResizeObserver(() => { if (!camTouched) { v.resize(); resetView(); } }) : null;
    if (ro) ro.observe(wb.host);

    /* ----- hints: solve again from the pieces that are already right ----- */

    function fixedNow(a, skip) {
      const fixed = {};
      a.info.forEach((x, i) => { if (x.ok && i !== skip) fixed[i] = x.cells; });
      return fixed;
    }
    function showFlash(i, color) {
      flash = { i, color };
      rebuild();
      later(() => { if (flash && flash.i === i) { flash = null; rebuild(); } }, 2600);
    }
    function hint() {
      const a = analyse();
      if (a.solved) return 'It is finished — every cube is filled.';
      if (a.overlapping.length) {
        const i = a.overlapping[0];
        return { text: 'Two pieces share a cube: ' + pname(i) + ' overlaps another (the red cubes). Pull one of them out first.', show() { showFlash(i); } };
      }
      const fixed = fixedNow(a);
      const nFixed = Object.keys(fixed).length;
      const r = P.solve(m.cells, bases, { fixed, any: m.any, nodeLimit: 4e5 });
      if (r.sols.length) {
        const s = r.sols[0];
        const free = Object.keys(s).map(Number);
        // the piece you are holding, if it has a place; else the lowest piece still to go
        let i = free.includes(sel) && !a.info[sel].ok ? sel : -1;
        if (i < 0) {
          let best = Infinity;
          free.forEach((j) => {
            const cs = P.place(bases[j], s[j].ri, s[j].t);
            const y = Math.min.apply(null, cs.map((c) => c[1])) * 100 + cs.reduce((t, c) => t + c[1], 0) / cs.length - cs.length * 0.01;
            if (y < best) { best = y; i = j; }
          });
        }
        if (i < 0) return null;
        const cells = P.place(bases[i], s[i].ri, s[i].t);
        const out = a.stickOut.filter((j) => j !== i);
        return {
          text: (out.length ? 'First, ' + pname(out[0]) + ' sticks out of the figure. ' : '') +
            (nFixed ? 'With what you have built, ' + pname(i) : capit(pname(i))) + ' can go where the gold outline shows' + (m.any ? '' : ' — and the rest can still be finished around it') + '.',
          show() { hintMark = { i, cells }; if (!locked.has(i)) sel = i; rebuild(); startPulse(); }
        };
      }
      if (!r.aborted && nFixed) {
        // which placed piece stands in the way of every solution?
        const ids = Object.keys(fixed).map(Number);
        for (const j of ids) {
          const r2 = P.solve(m.cells, bases, { fixed: fixedNow(a, j), any: m.any, nodeLimit: 1.5e5 });
          if (r2.sols.length) {
            return { text: 'The figure cannot be finished with ' + pname(j) + ' where it is now (flashing). Take it out and try it elsewhere.', show() { showFlash(j); } };
          }
        }
        return 'The pieces already in place cannot all stay: no way to finish from here. Take out two or three of them — perhaps start again from the bottom.';
      }
      // the search was too long: compare with the solution we know
      const wrong = [];
      a.info.forEach((x, i) => { if (x.ok && !locked.has(i) && (!solPl[i] || P.keyOf(x.cells) !== P.keyOf(P.place(bases[i], solPl[i].ri, solPl[i].t)))) wrong.push(i); });
      if (wrong.length) return { text: 'In the solution I know, ' + pname(wrong[0]) + ' goes somewhere else. (There may be other solutions — it is just a big search.)', show() { showFlash(wrong[0], '#ffb057'); } };
      const next = m.pieces.map((pc, i) => i).find((i) => solPl[i] && !a.info[i].ok);
      if (next == null) return null;
      const cells = P.place(bases[next], solPl[next].ri, solPl[next].t);
      return { text: capit(pname(next)) + ' can go where the gold outline shows.', show() { hintMark = { i: next, cells }; if (!locked.has(next)) sel = next; rebuild(); startPulse(); } };
    }

    /* ----- the solution: the pieces fly into place one by one ----- */

    function solveAll() {
      if (busy) return;
      const a = analyse();
      let target = null;
      const fixed = fixedNow(a);
      let r = P.solve(m.cells, bases, { fixed, any: m.any, nodeLimit: 4e5 });
      if (r.sols.length) { target = r.sols[0]; for (const i in fixed) target[i] = { ri: st[i][0], t: [st[i][1], st[i][2], st[i][3]] }; }
      if (!target) {
        const lk = {};
        locked.forEach((i) => { lk[i] = cellsOf(i); });
        r = P.solve(m.cells, bases, { fixed: lk, any: m.any, nodeLimit: 1e6 });
        if (r.sols.length) { target = r.sols[0]; locked.forEach((i) => { target[i] = solPl[i]; }); }
      }
      if (!target) { target = {}; solPl.forEach((s, i) => { if (s) target[i] = s; }); }
      const moves = [];
      m.pieces.forEach((pc, i) => {
        let to = null;
        if (target[i]) to = [target[i].ri, target[i].t[0], target[i].t[1], target[i].t[2]];
        else if (a.info[i].inF > 0) { const h = L.home[i]; to = [h.ri, h.t[0], h.t[1], h.t[2]]; }
        if (to && !same(to, st[i])) moves.push({ i, to, away: !target[i] });
      });
      const low = (mv) => Math.min.apply(null, cellsOf(mv.i, mv.to).map((c) => c[1]));
      moves.sort((x, y) => (y.away - x.away) || (low(x) - low(y)) || (x.i - y.i));
      busy = true;
      sel = -1;
      hintMark = null;
      flash = null;
      exploded = false;
      clearTimeout(pendingT);
      let k = 0;
      const next = () => {
        if (k >= moves.length) {
          busy = false;
          rebuild();
          ctx.changed('solve');
          return;
        }
        const mv = moves[k++];
        const old = st[mv.i];
        st[mv.i] = mv.to;
        startAnim(mv.i, old, mv.to, { lift: 2.2, dur: C.anim(640) });
        rebuild();
        later(next, C.anim(340));
      };
      rebuild();
      next();
    }

    /* ----- the keyboard ----- */

    function key(ev) {
      if (ev.type !== 'keydown') return false;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
      const k = ev.key, low = k.length === 1 ? k.toLowerCase() : k;
      const MOVE = { ArrowUp: 'away', ArrowDown: 'near', ArrowLeft: 'left', ArrowRight: 'right', w: 'away', s: 'near', a: 'left', d: 'right' };
      if (busy) return !!(MOVE[low] || 'qerftg'.includes(low) || k === 'PageUp' || k === 'PageDown' || k === 'Tab');
      if (k === 'Tab') { cycle(ev.shiftKey ? -1 : 1); return true; }
      if (/^[1-9]$/.test(k)) {
        const i = +k - 1;
        if (i < N) { if (locked.has(i)) ctx.toast('The ' + m.pieces[i].tag + ' piece is fixed in place.'); else select(i); return true; }
        return false;
      }
      if (k === 'Escape') { if (sel >= 0) { select(-1); return true; } return false; }
      if (low === 'x') { toggleExplode(); return true; }
      if (low === 'h' && mode !== 'views') { toggleGhost(); return true; }
      if (k === '0' || k === 'Home') { resetView(); return true; }
      if (k === 'PageUp' || k === 'PageDown') { run(k === 'PageUp' ? 'up' : 'down'); return true; }
      if ((k === 'ArrowUp' || k === 'ArrowDown') && ev.shiftKey) { run(k === 'ArrowUp' ? 'up' : 'down'); return true; }
      if (MOVE[low]) { run(MOVE[low]); return true; }
      if (low.length === 1 && 'qerftg'.includes(low)) { run(low.toUpperCase()); return true; }
      if (k === 'Enter' || k === ' ') { if (sel < 0) return false; run('drop'); return true; }
      if (k === 'Backspace' || k === 'Delete') { if (sel < 0) return false; run('tray'); return true; }
      return false;
    }

    rebuild();
    resetView();

    return {
      noMoves: true,
      check(manual) {
        const a = analyse();
        if (a.solved) return { solved: true, msg: m.any ? 'The figure is complete.' : 'All ' + numw(N) + ' pieces fit: the figure is complete.' };
        if (!manual) return { solved: false };
        if (a.overlapping.length) return { solved: false, msg: 'Two pieces share a cube (shown in red).' };
        if (mode === 'views') return { solved: false, msg: 'Not yet: compare the shadows of your cubes with the three views.' };
        if (a.stickOut.length) return { solved: false, msg: capit(pnameP(a.stickOut[0])) + ' sticks out of the figure.' };
        if (!m.any && a.unused.length && !a.empty) return { solved: false, msg: 'Some pieces are still on the table.' };
        return { solved: false, msg: C.plural(a.empty, 'cube') + ' of the figure ' + (a.empty === 1 ? 'is' : 'are') + ' still empty.' };
      },
      hint() { return hint(); },
      solve() { solveAll(); },
      getState() { return { s: st.map((x) => x.slice()) }; },
      setState(s) {
        if (!s || !Array.isArray(s.s) || s.s.length !== N || !s.s.every((x) => Array.isArray(x) && x.length === 4 && x[0] >= 0 && x[0] < 24)) return;
        clearTimeout(pendingT);
        pendingT = 0;
        anims.clear();
        st = s.s.map((x, i) => (locked.has(i) ? startState()[i] : x.slice()));
        hintMark = null;
        flash = null;
        rebuild();
      },
      reset() { sel = -1; hintMark = null; exploded = false; rebuild(); },
      key,
      destroy() {
        if (raf) root.cancelAnimationFrame(raf);
        if (pulseRaf) root.cancelAnimationFrame(pulseRaf);
        raf = pulseRaf = 0;
        hintMesh = null;
        clearTimeout(pendingT);
        timers.forEach((t) => clearTimeout(t));
        padBtns.forEach((b) => b.stopRepeat());
        if (ro) ro.disconnect();
        chipBar.remove();
        pad.remove();
        wb.host.classList.remove('sm-stage');
      }
    };
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'soma',
    name: 'Soma and polycubes',
    tools: [],
    deps: ['js/lib/dlx.js', 'js/lib/polycube.js'],
    noMoves: true,
    about: '**Pick up a piece** by clicking it, by its letter at the top of the table, or with Tab or a number key. ' +
      '**Slide it** with the arrow keys or W A S D — they follow your view, so ← always goes left on the screen — and **lift or lower it** with PgUp and PgDn. ' +
      '**Turn it** a quarter turn at a time: Q and E spin it about the upright axis, R and F tip it away from you or toward you, T and G roll it to the left or right. ' +
      'Enter (or Space) **drops** it until it rests; Backspace puts it back on the table. The same moves are on the pad at the bottom of the table.\n\n' +
      'You can also **drag a piece** with the mouse: it slides across the table and rides on top of whatever is below. Drag anywhere else to look around, right-drag (or Shift-drag) to slide the view, and use the wheel or two fingers to zoom. 0 resets the view, X pulls the finished part apart, H hides the see-through figure.\n\n' +
      'Cubes turn **red** where a piece sticks out of the figure or two pieces overlap. The puzzle is solved when every cube of the figure is filled exactly once.',
    verify,
    generate,
    mount,
    thumb
  });

  C.soma = { model, layout, verify, generate, grown, shadowFigure, isoSVG, viewsSVG, SOMA, TETRA, PENTA, STONES, WOODS };

  C.css('soma', `
    .sm-stage .wb-tools { display: none; }
    .sm-stage .wb-toast { bottom: 118px; }
    .sm-chips { position: absolute; left: 10px; top: 10px; right: 160px; z-index: 5; display: flex; flex-wrap: wrap; gap: 6px; pointer-events: none; }
    .sm-chip {
      pointer-events: auto; position: relative; min-width: 32px; height: 32px; padding: 0 7px; border-radius: 9px;
      border: 2px solid rgba(0, 0, 0, .28); background: var(--c); color: rgba(12, 14, 30, .78);
      font: 800 14px "Segoe UI", system-ui, sans-serif; cursor: pointer; box-shadow: 0 3px 10px var(--shadow);
      transition: transform .12s, box-shadow .12s;
    }
    .sm-chip:hover { transform: translateY(-2px); }
    .sm-chip.sel { outline: 3px solid var(--gold); outline-offset: 2px; transform: translateY(-2px); }
    .sm-chip.done::after, .sm-chip.bad::after {
      position: absolute; right: -6px; top: -7px; width: 15px; height: 15px; border-radius: 50%;
      font: 800 10px/15px "Segoe UI", system-ui, sans-serif; color: #fff; text-align: center;
    }
    .sm-chip.done::after { content: '✓'; background: var(--green); }
    .sm-chip.bad::after { content: '!'; background: var(--red); }
    .sm-chip.locked { opacity: .5; cursor: default; filter: saturate(.5); }
    .sm-pad {
      position: absolute; left: 10px; bottom: 10px; z-index: 5; padding: 6px 8px 8px; border-radius: 13px;
      background: color-mix(in srgb, var(--panel) 93%, transparent); border: 1px solid var(--line); box-shadow: 0 8px 22px var(--shadow);
    }
    .sm-chips.many { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: thin; padding: 3px 2px 6px; }
    .sm-chips.many::-webkit-scrollbar { height: 4px; }
    .sm-chips.many::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }
    .sm-chips.many .sm-chip { min-width: 30px; height: 28px; padding: 0 5px; font-size: 12px; flex: 0 0 auto; }
    .sm-pad-head { display: flex; align-items: center; gap: 6px; margin: 0 0 5px; }
    .sm-pad.folded .sm-pad-head { margin: 0; }
    .sm-pad.folded .sm-pad-grid { display: none; }
    .sm-pad-fold { margin-left: auto; width: 22px; height: 20px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel-2); color: var(--muted); font: 700 13px/1 "Segoe UI", system-ui, sans-serif; cursor: pointer; padding: 0; flex: 0 0 auto; }
    .sm-pad-fold:hover { color: var(--text); border-color: var(--accent); }
    .sm-pad-title { font-size: .78rem; min-height: 1.35em; margin: 0 2px; display: flex; align-items: center; gap: 6px; white-space: nowrap; overflow: hidden; }
    .sm-pad-title i { width: 11px; height: 11px; border-radius: 3px; flex: 0 0 auto; }
    .sm-pad-title em { font-style: normal; color: var(--muted); }
    .sm-pad-title em.ok { color: var(--green); }
    .sm-pad-title em.bad { color: var(--red); }
    .sm-pad-grid { display: grid; grid-template-columns: 38px 38px 38px 6px 42px 6px 38px 38px 38px 6px 52px; grid-template-rows: 40px 40px; gap: 4px; }
    .sm-btn {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; padding: 0;
      border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: 9px; cursor: pointer;
      touch-action: manipulation; transition: background .1s, border-color .1s, transform .06s;
    }
    .sm-btn:hover { border-color: var(--accent); background: var(--panel-3); }
    .sm-btn:active { transform: translateY(1px); background: var(--accent); color: #fff; }
    .sm-btn svg { width: 21px; height: 21px; }
    .sm-btn kbd { font: 700 9px/1 "Segoe UI", system-ui, sans-serif; color: var(--muted); letter-spacing: .02em; }
    .sm-btn:active kbd { color: rgba(255, 255, 255, .8); }
    .sm-pad.off .sm-btn { opacity: .42; }
    .sm-panel { display: flex; flex-direction: column; gap: 10px; width: 100%; }
    .sm-row { display: flex; flex-wrap: wrap; gap: 6px; }
    .sm-row .btn.on { border-color: var(--accent); color: var(--accent); }
    .sm-plist { display: flex; flex-direction: column; gap: 3px; }
    .sm-prow {
      display: grid; grid-template-columns: 44px 1fr auto; align-items: center; gap: 8px; padding: 3px 8px 3px 4px; border-radius: 9px;
      border: 1px solid transparent; background: transparent; color: var(--text); font: inherit; font-size: .82rem; text-align: left; cursor: pointer;
    }
    .sm-prow:hover { background: var(--panel-2); }
    .sm-prow.sel { border-color: var(--gold); background: var(--panel-2); }
    .sm-prow.locked { opacity: .6; cursor: default; }
    .sm-pic { width: 44px; height: 32px; display: grid; place-items: center; }
    .sm-pic svg { width: 44px; height: 32px; }
    .sm-pname b { display: inline-block; min-width: 1.3em; }
    .sm-pstate { font-size: .72rem; color: var(--green); white-space: nowrap; }
    .sm-keys summary { cursor: pointer; font-size: .8rem; color: var(--muted); }
    .sm-keygrid { display: grid; grid-template-columns: auto 1fr; gap: 4px 10px; margin-top: 7px; font-size: .78rem; align-items: center; }
    .sm-keygrid kbd { font: 600 .72rem "Segoe UI", system-ui, sans-serif; background: var(--panel-2); border: 1px solid var(--line); border-radius: 6px; padding: 1px 6px; justify-self: start; white-space: nowrap; }
    .sm-views { background: var(--board); border: 1px solid var(--line); border-radius: 10px; padding: 8px; }
    .sm-vsvg { width: 100%; height: auto; display: block; max-height: 200px; }
    .sm-vf { fill: var(--accent); opacity: .55; stroke: var(--board); stroke-width: 1.2; }
    .sm-ve { fill: none; stroke: var(--grid-2); stroke-width: .8; stroke-dasharray: 2 2; }
    .sm-vok { fill: var(--green); }
    .sm-vbad { fill: var(--red); }
    .sm-vlab { font: 600 11px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .sm-vnote { font-size: .72rem; color: var(--muted); margin-top: 4px; }
    .sm-vnote .ok { color: var(--green); } .sm-vnote .bad { color: var(--red); }
    @media (max-width: 640px) {
      .sm-chips { left: 6px; top: 6px; right: 150px; gap: 4px; }
      .sm-chip { min-width: 28px; height: 28px; font-size: 13px; }
      .sm-pad { left: 4px; right: 4px; bottom: 4px; padding: 4px 5px 5px; }
      .sm-pad-grid { grid-template-columns: repeat(3, 1fr) 2px 1.1fr 2px repeat(3, 1fr) 2px 1.3fr; grid-template-rows: 36px 36px; gap: 3px; }
      .sm-btn svg { width: 18px; height: 18px; }
      .sm-stage .wb-toast { bottom: 104px; }
    }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
