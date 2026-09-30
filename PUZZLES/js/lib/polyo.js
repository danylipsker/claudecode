/* The Puzzle Cabinet · js/lib/polyo.js
 *
 * Polyominoes: shapes made of unit squares joined edge to edge. Shared by the
 * polyomino and divide engines and by their generators.
 *
 * Cells are [x, y] integer pairs (x to the right, y down); cell (x, y) is the
 * unit square [x, x+1] × [y, y+1].
 *
 *   Polyo.parse(rows)          ['##.', '.##'] or '##.|.##' -> cells ('.' and ' ' are empty)
 *   Polyo.grid(rows)           -> Map 'x,y' -> the character there
 *   Polyo.norm(cells)          moved so the smallest x and y are 0, sorted by row then column
 *   Polyo.key(cells)           a string naming the normalised cells
 *   Polyo.T[i]                 the 8 symmetries of the square, i = flip·4 + rot/90, the same
 *                              turn and mirror as the workbench's { rot, flip } placement
 *   Polyo.orient(cells, i)     the cells under symmetry i, normalised
 *   Polyo.orients(cells, free) the distinct orientations [{ cells, t, key }] (free: turning over allowed)
 *   Polyo.canon(cells, free)   the canonical key: equal for congruent shapes
 *   Polyo.outline(cells)       boundary loops [[x, y], ...] (corners only; holes run the other way)
 *   Polyo.innerEdges(cells)    the unit segments between two cells of the shape
 *   Polyo.components(cells)    the connected pieces
 *   Polyo.holes(cells)         true when the shape encloses empty squares
 *   Polyo.LIB                  the named pieces: name -> { rows, color, full }
 *   Polyo.pack(spec)           exact cover of a region by pieces (js/lib/dlx.js)
 *   Polyo.divide(cells, k)     the ways to cut a shape into k congruent pieces
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};
  const K = (x, y) => x + ',' + y;

  function parse(rows) {
    if (typeof rows === 'string') rows = rows.split('|');
    const out = [];
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) { const ch = r[x]; if (ch !== '.' && ch !== ' ') out.push([x, y]); }
    });
    return out;
  }

  function grid(rows) {
    if (typeof rows === 'string') rows = rows.split('|');
    const m = new Map();
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) { const ch = r[x]; if (ch !== '.' && ch !== ' ') m.set(K(x, y), ch); }
    });
    return m;
  }

  function bbox(cells) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const c of cells) {
      if (c[0] < x0) x0 = c[0]; if (c[0] > x1) x1 = c[0];
      if (c[1] < y0) y0 = c[1]; if (c[1] > y1) y1 = c[1];
    }
    return { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }

  function norm(cells) {
    let mx = Infinity, my = Infinity;
    for (const c of cells) { if (c[0] < mx) mx = c[0]; if (c[1] < my) my = c[1]; }
    return cells.map((c) => [c[0] - mx, c[1] - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  }

  function key(cells) { return norm(cells).map((c) => c[0] + '.' + c[1]).join(' '); }

  // cells as rows of text: ch(cell) gives the character (default '#')
  function toRows(cells, ch) {
    const b = bbox(cells);
    const rows = [];
    for (let y = 0; y < b.h; y++) rows.push(new Array(b.w).fill('.'));
    cells.forEach((c) => { rows[c[1] - b.y0][c[0] - b.x0] = ch ? ch(c) : '#'; });
    return rows.map((r) => r.join(''));
  }

  const T = [
    (x, y) => [x, y], (x, y) => [-y, x], (x, y) => [-x, -y], (x, y) => [y, -x],
    (x, y) => [-x, y], (x, y) => [-y, -x], (x, y) => [x, -y], (x, y) => [y, x]
  ];
  // a cell under symmetry i (turning the cell's centre, so squares stay squares)
  function tcell(c, i) {
    const p = T[i](2 * c[0] + 1, 2 * c[1] + 1);
    return [(p[0] - 1) / 2, (p[1] - 1) / 2];
  }
  function orient(cells, i) { return norm(cells.map((c) => tcell(c, i))); }

  function orients(cells, free) {
    const out = [], seen = new Set();
    const n = free === false ? 4 : 8;
    for (let i = 0; i < n; i++) {
      const o = orient(cells, i), k = key(o);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ cells: o, t: i, key: k });
    }
    return out;
  }

  function canon(cells, free) {
    let best = null;
    const n = free === false ? 4 : 8;
    for (let i = 0; i < n; i++) {
      const k = key(orient(cells, i));
      if (best === null || k < best) best = k;
    }
    return best;
  }

  // which symmetry i takes shape a onto shape b (both any position)? -1 if none
  function matchT(a, b, free) {
    const kb = key(b);
    const n = free === false ? 4 : 8;
    for (let i = 0; i < n; i++) if (key(orient(a, i)) === kb) return i;
    return -1;
  }

  // the boundary as closed loops of corner points; the outside runs clockwise
  // on screen (y down), holes the other way, so an even-odd fill is right
  function outline(cells) {
    const set = new Set(cells.map((c) => K(c[0], c[1])));
    const edges = [];
    for (const c of cells) {
      const x = c[0], y = c[1];
      if (!set.has(K(x, y - 1))) edges.push([x, y, x + 1, y]);
      if (!set.has(K(x + 1, y))) edges.push([x + 1, y, x + 1, y + 1]);
      if (!set.has(K(x, y + 1))) edges.push([x + 1, y + 1, x, y + 1]);
      if (!set.has(K(x - 1, y))) edges.push([x, y + 1, x, y]);
    }
    const from = new Map();
    edges.forEach((e, i) => { const k = K(e[0], e[1]); if (!from.has(k)) from.set(k, []); from.get(k).push(i); });
    const used = new Uint8Array(edges.length);
    const loops = [];
    for (let s = 0; s < edges.length; s++) {
      if (used[s]) continue;
      const pts = [];
      let i = s;
      while (i >= 0 && !used[i]) {
        used[i] = 1;
        const e = edges[i];
        pts.push([e[0], e[1]]);
        const dx = e[2] - e[0], dy = e[3] - e[1];
        const cand = (from.get(K(e[2], e[3])) || []).filter((j) => !used[j]);
        let best = -1, bs = -9;
        // where two squares touch only at a corner, turn right: each keeps its own loop
        for (const j of cand) {
          const f = edges[j], cr = dx * (f[3] - f[1]) - dy * (f[2] - f[0]);
          const sc = cr > 0 ? 2 : cr === 0 ? 1 : 0;
          if (sc > bs) { bs = sc; best = j; }
        }
        i = best;
      }
      loops.push(corners(pts));
    }
    return loops;
  }
  function corners(pts) {
    const n = pts.length, out = [];
    for (let i = 0; i < n; i++) {
      const a = pts[(i + n - 1) % n], b = pts[i], c = pts[(i + 1) % n];
      if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) !== 0) out.push(b);
    }
    return out.length ? out : pts;
  }

  // the unit segments between two cells of the shape: [[x0, y0, x1, y1], ...]
  function innerEdges(cells) {
    const set = new Set(cells.map((c) => K(c[0], c[1])));
    const out = [];
    for (const c of cells) {
      const x = c[0], y = c[1];
      if (set.has(K(x + 1, y))) out.push([x + 1, y, x + 1, y + 1]);
      if (set.has(K(x, y + 1))) out.push([x, y + 1, x + 1, y + 1]);
    }
    return out;
  }

  function components(cells) {
    const set = new Map(cells.map((c) => [K(c[0], c[1]), c]));
    const seen = new Set();
    const out = [];
    for (const c of cells) {
      const k0 = K(c[0], c[1]);
      if (seen.has(k0)) continue;
      const comp = [], stack = [c];
      seen.add(k0);
      while (stack.length) {
        const q = stack.pop();
        comp.push(q);
        for (const d of NB) {
          const k = K(q[0] + d[0], q[1] + d[1]);
          if (set.has(k) && !seen.has(k)) { seen.add(k); stack.push(set.get(k)); }
        }
      }
      out.push(comp);
    }
    return out;
  }
  const NB = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function connected(cells) { return cells.length > 0 && components(cells).length === 1; }

  function holes(cells) {
    const b = bbox(cells);
    const set = new Set(cells.map((c) => K(c[0], c[1])));
    const W = b.w + 2, H = b.h + 2;
    const seen = new Uint8Array(W * H);
    const stack = [[0, 0]];
    seen[0] = 1;
    let reach = 0;
    while (stack.length) {
      const q = stack.pop();
      reach++;
      for (const d of NB) {
        const x = q[0] + d[0], y = q[1] + d[1];
        if (x < 0 || y < 0 || x >= W || y >= H || seen[y * W + x]) continue;
        if (set.has(K(x - 1 + b.x0, y - 1 + b.y0))) continue;
        seen[y * W + x] = 1;
        stack.push([x, y]);
      }
    }
    return reach !== W * H - cells.length;
  }

  /* ---------- the named pieces ---------- */

  const LIB = {};
  function lib(name, rows, color, full) { LIB[name] = { name, rows, color, full: full || name, cells: norm(parse(rows)) }; }
  // Golomb's letters for the twelve pentominoes, each drawn to look like its letter
  lib('F', '.##|##.|.#.', '#ff6b6b', 'F pentomino');
  lib('I', '#|#|#|#|#', '#ffa94d', 'I pentomino');
  lib('L', '#.|#.|#.|##', '#ffd43b', 'L pentomino');
  lib('N', '.#|##|#.|#.', '#a9e34b', 'N pentomino');
  lib('P', '##|##|#.', '#51cf66', 'P pentomino');
  lib('T', '###|.#.|.#.', '#20c997', 'T pentomino');
  lib('U', '#.#|###', '#3bc9db', 'U pentomino');
  lib('V', '#..|#..|###', '#4dabf7', 'V pentomino');
  lib('W', '#..|##.|.##', '#748ffc', 'W pentomino');
  lib('X', '.#.|###|.#.', '#b197fc', 'X pentomino');
  lib('Y', '.#|##|.#|.#', '#f783ac', 'Y pentomino');
  lib('Z', '##.|.#.|.##', '#e8a87c', 'Z pentomino');
  // the five tetrominoes, three trominoes and smaller
  lib('I4', '####', '#66d9e8', 'straight tetromino');
  lib('O4', '##|##', '#ffe066', 'square tetromino');
  lib('T4', '###|.#.', '#cc5de8', 'T tetromino');
  lib('L4', '#.|#.|##', '#ff922b', 'L tetromino');
  lib('S4', '.##|##.', '#69db7c', 'skew tetromino');
  lib('I3', '###', '#74c0fc', 'straight tromino');
  lib('L3', '#.|##', '#ff8787', 'L tromino');
  lib('I2', '##', '#ffd8a8', 'domino');
  lib('o1', '#', '#e9ecef', 'monomino');

  // the 35 free hexominoes, found by growing the pentominoes, named H1 … H35 in a fixed order
  (function () {
    const five = ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((n) => LIB[n].cells);
    const seen = new Map();
    five.forEach((p) => {
      const set = new Set(p.map((c) => K(c[0], c[1])));
      p.forEach((c) => NB.forEach((d) => {
        const q = [c[0] + d[0], c[1] + d[1]];
        if (set.has(K(q[0], q[1]))) return;
        const h = p.concat([q]);
        const k = canon(h);
        if (!seen.has(k)) seen.set(k, h);
      }));
    });
    const keys = Array.from(seen.keys()).sort();
    keys.forEach((k, i) => {
      // lay each one down wider than tall, the way it rests in the box
      let cells = seen.get(k);
      const b = bbox(cells);
      if (b.h > b.w) cells = orient(cells, 1);
      const hue = Math.round((i * 360 / 35 + 8) % 360);
      lib('H' + (i + 1), toRows(cells).join('|'), hsl(hue, 72, 66), 'hexomino ' + (i + 1));
    });
  })();

  function hsl(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const hex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
    return '#' + hex(f(0)) + hex(f(8)) + hex(f(4));
  }

  // a piece given by name ('F', 'T4', 'H12') or by its rows ('##.|.##')
  function piece(spec, i) {
    if (LIB[spec]) return LIB[spec];
    const cells = norm(parse(spec));
    return { name: spec, rows: spec, cells, color: EXTRA[(i || 0) % EXTRA.length], full: 'piece of ' + cells.length };
  }
  const EXTRA = ['#ff8787', '#ffa94d', '#ffd43b', '#a9e34b', '#51cf66', '#20c997', '#3bc9db', '#4dabf7', '#748ffc', '#b197fc', '#f783ac', '#e8a87c'];

  /* ---------- exact cover: pieces into a region ---------- */

  /* spec = {
   *   region: cells, pieces: [cells, ...],
   *   fixed: [{ piece, cells }]  pieces already in place (their squares are taken)
   *   max, nodeLimit, shuffle    passed to DLX
   * }
   * -> { sols: [[{ piece, cells, t }], ...], aborted }
   * If the pieces have more squares than the free region, pieces become optional. */
  function pack(spec) {
    const DLX = C.DLX;
    const taken = new Set(), fixedP = new Set();
    (spec.fixed || []).forEach((f) => { fixedP.add(f.piece); f.cells.forEach((c) => taken.add(K(c[0], c[1]))); });
    const col = new Map();
    let n = 0;
    spec.region.forEach((c) => { const k = K(c[0], c[1]); if (!taken.has(k) && !col.has(k)) col.set(k, n++); });
    const cellsN = n;
    let area = 0;
    const pcol = [];
    spec.pieces.forEach((pc, i) => { if (!fixedP.has(i)) { pcol[i] = n++; area += pc.length; } });
    if (area < cellsN) return { sols: [], aborted: false };
    const rows = [], meta = [];
    const shapes = new Map();
    spec.pieces.forEach((pc, i) => {
      if (fixedP.has(i)) return;
      const ok = shapes.get(pc) || orients(pc, spec.free);
      shapes.set(pc, ok);
      ok.forEach((o) => {
        const a = o.cells[0];
        col.forEach((ci, k) => {
          const xy = k.split(','), dx = +xy[0] - a[0], dy = +xy[1] - a[1];
          const r = [];
          for (const c of o.cells) {
            const cc = col.get(K(c[0] + dx, c[1] + dy));
            if (cc == null) return;
            r.push(cc);
          }
          r.push(pcol[i]);
          rows.push(r);
          meta.push({ piece: i, t: o.t, cells: o.cells.map((c) => [c[0] + dx, c[1] + dy]) });
        });
      });
    });
    const exact = area === cellsN;
    const res = DLX.solve({
      primary: exact ? n : cellsN, secondary: exact ? 0 : n - cellsN,
      rows, max: spec.max || 1, nodeLimit: spec.nodeLimit || 2e6, shuffle: spec.shuffle
    });
    return { sols: res.map((s) => s.map((ri) => meta[ri])), aborted: !!res.aborted, nodes: res.nodes };
  }

  /* ---------- dividing a shape into k congruent pieces ---------- */

  /* Every piece containing the first square (top row, leftmost) is tried: its
   * shape must tile the whole figure. Returns one entry per piece shape that
   * works: [{ key, part, count, sol }], count = the number of cuttings found
   * (up to opts.limit), sol = one cutting as a list of cell lists.
   *   opts.free     turning pieces over allowed (default true)
   *   opts.limit    count cuttings up to this many (default 1: just whether it works)
   *   opts.maxShapes stop after this many working shapes (default all)
   *   opts.visitLimit give up enumerating after this many candidate pieces (result.aborted) */
  function divide(cells, k, opts) {
    opts = opts || {};
    const N = cells.length;
    const out = [];
    out.aborted = false;
    if (k < 1 || N % k) return out;
    const n = N / k;
    const free = opts.free !== false;
    const set = new Map(cells.map((c) => [K(c[0], c[1]), c]));
    const first = cells.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0])[0];
    const cand = new Map(); // canon key -> a piece
    const visitLimit = opts.visitLimit || 4e6;
    let visits = 0;
    const inP = new Set(), marked = new Set([K(first[0], first[1])]);
    const P = [];
    const complementOk = () => {
      if (k === 1) return true;
      const rest = cells.filter((c) => !inP.has(K(c[0], c[1])));
      return components(rest).every((comp) => comp.length % n === 0);
    };
    (function grow(untried) {
      while (untried.length) {
        if (visits > visitLimit) { out.aborted = true; return; }
        const c = untried.pop();
        const kc = K(c[0], c[1]);
        visits++;
        P.push(c); inP.add(kc);
        if (P.length === n) {
          const key2 = canon(P, free);
          if (!cand.has(key2) && complementOk()) cand.set(key2, P.slice());
        } else {
          const fresh = [];
          for (const d of NB) {
            const q = set.get(K(c[0] + d[0], c[1] + d[1]));
            if (!q) continue;
            const kq = K(q[0], q[1]);
            if (marked.has(kq)) continue;
            marked.add(kq);
            fresh.push(q);
          }
          grow(untried.concat(fresh));
          fresh.forEach((q) => marked.delete(K(q[0], q[1])));
        }
        P.pop(); inP.delete(kc);
      }
    })([first]);
    for (const [kk, part] of cand) {
      // every copy is the same piece, so DLX counts cuttings, not labellings
      const res = tile(cells, part, free, opts.limit || 1, opts.nodeLimit);
      if (res.count) {
        out.push({ key: kk, part: norm(part), count: res.count, sol: res.sol, capped: res.capped });
        if (opts.maxShapes && out.length >= opts.maxShapes) break;
      }
    }
    return out;
  }

  // tile a figure with copies of one piece: { count (up to limit), sol }
  function tile(cells, part, free, limit, nodeLimit) {
    const col = new Map();
    cells.forEach((c, i) => col.set(K(c[0], c[1]), i));
    const rows = [], meta = [];
    orients(part, free).forEach((o) => {
      const a = o.cells[0];
      cells.forEach((c) => {
        const dx = c[0] - a[0], dy = c[1] - a[1];
        const r = [];
        for (const q of o.cells) {
          const cc = col.get(K(q[0] + dx, q[1] + dy));
          if (cc == null) return;
          r.push(cc);
        }
        rows.push(r);
        meta.push(o.cells.map((q) => [q[0] + dx, q[1] + dy]));
      });
    });
    const res = C.DLX.solve({ primary: cells.length, rows, max: limit || 1, nodeLimit: nodeLimit || 3e6 });
    return { count: res.length, sol: res.length ? res[0].map((ri) => meta[ri]) : null, capped: res.length >= (limit || 1) || !!res.aborted, all: res.map((s) => s.map((ri) => meta[ri])) };
  }

  /* ---------- growing a compact board from pieces ---------- */

  /* Lay the pieces down one after another, each touching the ones before,
   * preferring spots that share many edges and keep the bounding box small
   * and near the wanted aspect. The union is the board, the way the pieces
   * were laid is a solution.
   *   shapes: [cells, ...]   rng: C.rng
   *   opts.aspect (width / height, default 1), opts.beta (greed, default 1.3), opts.boxW
   * -> { region, placements: [{ piece, cells }] } moved to the origin, or null */
  function grow(shapes, rng, opts) {
    opts = opts || {};
    const occ = new Map();
    const placements = [];
    const order = rng.shuffle(shapes.map((s, i) => i));
    const aspect = opts.aspect || 1;
    let box = null;
    const put = (i, cells) => {
      cells.forEach((c) => occ.set(K(c[0], c[1]), i));
      placements.push({ piece: i, cells });
      box = box ? bbox(cells.concat([[box.x0, box.y0], [box.x1, box.y1]])) : bbox(cells);
    };
    for (let n = 0; n < order.length; n++) {
      const i = order[n];
      const ors = orients(shapes[i]);
      if (!n) { put(i, rng.pick(ors).cells); continue; }
      const frontier = new Map();
      occ.forEach((v, k) => {
        const xy = k.split(',').map(Number);
        NB.forEach((d) => { const q = [xy[0] + d[0], xy[1] + d[1]]; const kq = K(q[0], q[1]); if (!occ.has(kq)) frontier.set(kq, q); });
      });
      const cands = [], seen = new Set();
      frontier.forEach((e) => {
        ors.forEach((o) => o.cells.forEach((c) => {
          const dx = e[0] - c[0], dy = e[1] - c[1];
          const sk = o.key + '@' + dx + ',' + dy;
          if (seen.has(sk)) return;
          seen.add(sk);
          const cells = o.cells.map((q) => [q[0] + dx, q[1] + dy]);
          if (cells.some((q) => occ.has(K(q[0], q[1])))) return;
          let contact = 0;
          cells.forEach((q) => NB.forEach((d) => { if (occ.has(K(q[0] + d[0], q[1] + d[1]))) contact++; }));
          const b = bbox(cells.concat([[box.x0, box.y0], [box.x1, box.y1]]));
          const grown = b.w * b.h - box.w * box.h;
          const shapeBad = Math.abs(b.w - b.h * aspect) / Math.max(b.w, b.h);
          cands.push({ cells, score: contact * 2 - grown * (opts.boxW == null ? 0.35 : opts.boxW) - shapeBad * 4 });
        }));
      });
      if (!cands.length) return null;
      cands.sort((a, b) => b.score - a.score);
      const top = cands[0].score, beta = opts.beta || 1.3;
      const w = cands.map((c) => Math.exp(beta * (c.score - top)));
      let r = rng() * w.reduce((s, v) => s + v, 0);
      let pick = cands[0];
      for (let k = 0; k < cands.length; k++) { r -= w[k]; if (r <= 0) { pick = cands[k]; break; } }
      put(i, pick.cells);
    }
    const region = Array.from(occ.keys()).map((k) => k.split(',').map(Number));
    const b = bbox(region);
    const sh = (c) => [c[0] - b.x0, c[1] - b.y0];
    return {
      region: region.map(sh),
      placements: placements.map((pl) => ({ piece: pl.piece, cells: pl.cells.map(sh) })).sort((a, c) => a.piece - c.piece)
    };
  }

  // lay a board on its side when it is taller than wide (screens are landscape)
  function landscape(region, placements) {
    const b = bbox(region);
    if (b.h <= b.w) return { region, placements };
    const f = (c) => [c[1] - b.y0, b.x1 - c[0]];
    return { region: region.map(f), placements: (placements || []).map((pl) => Object.assign({}, pl, { cells: pl.cells.map(f) })) };
  }

  const MARK = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // the rows of a solution: each square marked with its piece's number ('0'-'9', 'a'-'z', 'A'-'Z')
  function solRows(region, placements, marks) {
    marks = marks || MARK;
    const mark = new Map();
    placements.forEach((pl) => pl.cells.forEach((c) => mark.set(K(c[0], c[1]), marks[pl.piece])));
    const b = bbox(region);
    const rows = [];
    for (let y = b.y0; y <= b.y1; y++) {
      let r = '';
      for (let x = b.x0; x <= b.x1; x++) r += mark.get(K(x, y)) || '.';
      rows.push(r);
    }
    return rows;
  }

  /* ---------- words for a set of pieces ---------- */

  const PENT = ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const TET = ['I4', 'O4', 'T4', 'L4', 'S4'];
  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one'];
  function joinAnd(list) { return list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1]; }
  function describe(names) {
    if (names.length === 12 && PENT.every((n) => names.includes(n))) return 'all twelve pentominoes';
    if (names.every((n) => PENT.includes(n))) return 'the ' + joinAnd(names.slice().sort()) + ' pentomino' + (names.length > 1 ? 'es' : '');
    if (names.every((n) => /^H\d+$/.test(n))) return names.length === 1 ? 'this hexomino' : 'these ' + NUMW[names.length] + ' hexominoes';
    const cnt = new Map();
    names.forEach((n) => cnt.set(n, (cnt.get(n) || 0) + 1));
    const parts = [];
    if (TET.every((n) => cnt.get(n) && cnt.get(n) === cnt.get('I4'))) {
      const m = cnt.get('I4');
      parts.push(m === 1 ? 'one of each of the five tetrominoes' : NUMW[m] + ' sets of the five tetrominoes');
      TET.forEach((n) => cnt.delete(n));
    }
    const pents = Array.from(cnt.keys()).filter((n) => PENT.includes(n)).sort();
    if (pents.length) { parts.push('the ' + joinAnd(pents) + ' pentomino' + (pents.length > 1 ? 'es' : '')); pents.forEach((n) => cnt.delete(n)); }
    cnt.forEach((m, n) => {
      const full = LIB[n] ? LIB[n].full : 'piece';
      parts.push(m === 1 ? (/^hexomino/.test(full) ? 'hexomino ' + n.slice(1) : 'the ' + full) : NUMW[m] + ' ' + full.replace(/o$/, 'oe') + 's');
    });
    return joinAnd(parts);
  }

  C.Polyo = { K, NB, parse, grid, bbox, norm, key, toRows, T, tcell, orient, orients, canon, matchT, outline, innerEdges, components, connected, holes, LIB, PENT, TET, NUMW, piece, hsl, pack, divide, tile, grow, landscape, solRows, describe, joinAnd, MARK };
})(typeof window !== 'undefined' ? window : globalThis);
