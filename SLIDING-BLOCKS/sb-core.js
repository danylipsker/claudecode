/* Sliding Blocks · sb-core.js
 * The puzzle model and the solver, shared by the page and by tools/*.js.
 *
 * A puzzle is one line of text:   family|name|board|goal|par|options
 *
 *   family   G Gridlock, K Klotski, R Release, O Order
 *   board    rows split by "/": "." floor, "#" wall, any other character is
 *            a piece (every cell holding that character is one piece)
 *   goal     "A@x,y"  piece A with its top-left corner at column x, row y;
 *            or a pattern in rows like the board: a class character in each
 *            cell that must hold a piece of that class, "?" where anything goes
 *   par      the fewest moves, as found by the solver
 *   options  separated by spaces:
 *              x:r2        a gate in the rim: side (t r b l) and the row or
 *                          column where it starts; the goal piece leaves by it
 *              c:AB=r;CD=b piece classes: A and B are class r, C and D class b
 *                          (pieces of one class and one shape can swap places)
 *              n           the pieces show their characters as labels
 *              z:rows      depths, as in Panex: a digit for each cell (rows
 *                          split by "/"); a piece may stand on a cell only if
 *                          its level is at least that digit. A piece's level
 *                          is its digit (1-9) or its letter's place in the
 *                          alphabet (a = 1)
 *
 * In Gridlock a piece only slides along its length. Everywhere else a piece
 * slides in any direction. A move is one piece moved any distance, around
 * corners too: the usual count for sliding block puzzles (it makes the
 * classic L'Âne Rouge 81 moves).
 */
(function (root) {
  "use strict";

  const FAMILIES = {
    G: { key: "G", id: "gridlock", name: "Gridlock", hero: true },
    K: { key: "K", id: "klotski", name: "Klotski", hero: true },
    R: { key: "R", id: "release", name: "Release", hero: true },
    O: { key: "O", id: "order", name: "Order", hero: false }
  };

  const DX = [0, 1, 0, -1];
  const DY = [-1, 0, 1, 0];

  /* ---------- parsing ---------- */

  function parse(text) {
    const parts = text.split("|");
    const fam = parts[0];
    const rows = parts[2].split("/");
    const h = rows.length;
    const w = Math.max.apply(null, rows.map(r => r.length));
    const wall = new Uint8Array(w * h);
    const cellsOf = new Map();

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const c = rows[y][x] || "#";
        if (c === "#") wall[y * w + x] = 1;
        else if (c !== ".") {
          if (!cellsOf.has(c)) cellsOf.set(c, []);
          cellsOf.get(c).push([x, y]);
        }
      }
    }

    const opts = { gate: null, classes: {}, labels: false, zone: null };
    for (const o of (parts[5] || "").split(" ")) {
      if (!o) continue;
      if (o === "n") opts.labels = true;
      else if (o.startsWith("z:")) {
        const zr = o.slice(2).split("/");
        opts.zone = new Uint8Array(w * h);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) opts.zone[y * w + x] = +((zr[y] || "")[x] || 0);
      }
      else if (o.startsWith("x:")) opts.gate = { side: o[2], at: +o.slice(3) };
      else if (o.startsWith("c:")) {
        for (const g of o.slice(2).split(";")) {
          const [chars, cls] = g.split("=");
          for (const ch of chars) opts.classes[ch] = cls;
        }
      }
    }

    const pieces = [];
    for (const [ch, cells] of cellsOf) {
      let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
      for (const [x, y] of cells) {
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
      const pw = maxX - minX + 1, ph = maxY - minY + 1;
      const shape = cells.map(([x, y]) => [x - minX, y - minY])
        .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
      pieces.push({
        ch, x: minX, y: minY, w: pw, h: ph, shape,
        // Gridlock vehicles run along their length only.
        axis: fam === "G" ? (pw > ph ? 1 : ph > pw ? 2 : 0) : 0,
        cls: opts.classes[ch] || "",
        hero: false,
        label: opts.labels ? ch : "",
        level: levelOf(ch)
      });
    }

    const goal = { type: "", hero: -1, x: 0, y: 0, pattern: null };
    const at = /^(.)@(\d+),(\d+)$/.exec(parts[3]);
    if (at) {
      goal.type = "at";
      goal.hero = pieces.findIndex(p => p.ch === at[1]);
      goal.x = +at[2];
      goal.y = +at[3];
      if (goal.hero >= 0) pieces[goal.hero].hero = true;
    } else {
      goal.type = "pattern";
      const g = parts[3].split("/");
      goal.pattern = [];
      const used = new Set();
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const c = (g[y] || "")[x] || "?";
          if (c === "?" || c === "#") continue;
          goal.pattern.push([y * w + x, c]);
          used.add(c);
        }
      }
      // A piece named in the pattern by its own character is its own class.
      for (const p of pieces) if (!p.cls && used.has(p.ch)) p.cls = p.ch;
    }

    return {
      text, fam, name: parts[1] || "", w, h, wall, pieces, goal,
      par: parts[4] === "" || parts[4] == null ? null : +parts[4],
      gate: opts.gate,
      zone: opts.zone
    };
  }

  function levelOf(ch) {
    const d = "123456789".indexOf(ch);
    if (d >= 0) return d + 1;
    const l = "abcdefghi".indexOf(ch);
    return l >= 0 ? l + 1 : 99;
  }

  // May piece p stand on cell c, as far as walls and depths go?
  const allowed = (puz, p, c) => !puz.wall[c] && !(puz.zone && puz.zone[c] > p.level);

  const shapeKey = p => p.shape.map(c => c[0] + "," + c[1]).join(";");

  /* ---------- the solver's model ---------- *
   * The solver keeps a state as the top-left cell index of every piece, in
   * "slot" order: pieces that can swap places without anyone noticing (same
   * shape, same way of moving, same class) sit in neighbouring slots and are
   * kept sorted, so all their orderings are one state.
   */
  function Model(puz) {
    const W = puz.w, H = puz.h, n = puz.pieces.length;
    // Under depths, pieces of different levels are never alike.
    const groupOf = puz.pieces.map(p =>
      shapeKey(p) + "|" + p.axis + "|" + (p.hero ? "@" + p.ch : p.cls) + (puz.zone ? "|" + p.level : ""));
    const groupIds = [...new Set(groupOf)];
    const order = puz.pieces.map((p, i) => i)
      .sort((a, b) => groupIds.indexOf(groupOf[a]) - groupIds.indexOf(groupOf[b]) || a - b);

    const slotGroupStart = new Int32Array(n);
    const slotGroupEnd = new Int32Array(n);
    for (let s = 0; s < n; ) {
      let e = s;
      while (e < n && groupOf[order[e]] === groupOf[order[s]]) e++;
      for (let k = s; k < e; k++) { slotGroupStart[k] = s; slotGroupEnd[k] = e; }
      s = e;
    }

    // Classes as small numbers, for the pattern goal.
    const clsIds = new Map();
    const clsOf = order.map(i => {
      const c = puz.pieces[i].cls;
      if (!c) return -1;
      if (!clsIds.has(c)) clsIds.set(c, clsIds.size);
      return clsIds.get(c);
    });

    const slots = order.map((i, s) => {
      const p = puz.pieces[i];
      const offs = p.shape.map(([x, y]) => y * W + x);
      // Anchors where the piece fits the board, ignoring other pieces.
      const fits = new Uint8Array(W * H);
      for (let ay = 0; ay + p.h <= H; ay++) {
        for (let ax = 0; ax + p.w <= W; ax++) {
          const a = ay * W + ax;
          if (offs.every(o => allowed(puz, p, a + o))) fits[a] = 1;
        }
      }
      // For each direction, the cells that lead the piece that way.
      const front = [0, 1, 2, 3].map(d => {
        const set = new Set(p.shape.map(c => c[0] + "," + c[1]));
        return p.shape
          .filter(([x, y]) => !set.has((x + DX[d]) + "," + (y + DY[d])))
          .map(([x, y]) => (y + DY[d]) * W + (x + DX[d]));
      });
      const dirs = p.axis === 1 ? [1, 3] : p.axis === 2 ? [0, 2] : [0, 1, 2, 3];
      return { piece: i, offs, fits, front, dirs, w: p.w, h: p.h, cls: clsOf[s] };
    });

    let goalTest;
    if (puz.goal.type === "at") {
      const heroSlot = order.indexOf(puz.goal.hero);
      const target = puz.goal.y * W + puz.goal.x;
      goalTest = st => st[heroSlot] === target;
    } else {
      const cells = puz.goal.pattern.map(([c, k]) => [c, clsIds.has(k) ? clsIds.get(k) : -2]);
      const occ = new Int16Array(W * H);
      goalTest = st => {
        occ.fill(-1);
        for (let s = 0; s < n; s++) {
          const k = slots[s].cls;
          if (k < 0) continue;
          for (const o of slots[s].offs) occ[st[s] + o] = k;
        }
        for (const [c, k] of cells) if (occ[c] !== k) return false;
        return true;
      };
    }

    const occ = new Int16Array(W * H);
    const seen = new Int32Array(W * H);
    let stamp = 0;
    const queue = new Int32Array(W * H);

    function fill(st) {
      occ.fill(-1);
      for (let c = 0; c < W * H; c++) if (puz.wall[c]) occ[c] = -2;
      for (let s = 0; s < n; s++) for (const o of slots[s].offs) occ[st[s] + o] = s;
    }

    // Every anchor slot s can reach in one move, by any path, others still.
    // `occ` must hold the state; it is left as it was.
    function reach(st, s, out) {
      const sl = slots[s];
      const a0 = st[s];
      if (++stamp > 2e9) { seen.fill(0); stamp = 1; }
      seen[a0] = stamp;
      let head = 0, tail = 0;
      queue[tail++] = a0;
      for (const o of sl.offs) occ[a0 + o] = -1;
      while (head < tail) {
        const a = queue[head++];
        const ax = a % W, ay = (a - ax) / W;
        for (const d of sl.dirs) {
          const bx = ax + DX[d], by = ay + DY[d];
          if (bx < 0 || by < 0 || bx + sl.w > W || by + sl.h > H) continue;
          const b = by * W + bx;
          if (seen[b] === stamp || !sl.fits[b]) continue;
          let free = true;
          for (const f of sl.front[d]) if (occ[a + f] !== -1) { free = false; break; }
          if (!free) continue;
          seen[b] = stamp;
          queue[tail++] = b;
          out.push(b);
        }
      }
      for (const o of sl.offs) occ[a0 + o] = s;
    }

    // Keep slot s in order within its group after it changed.
    function settle(st, s) {
      const lo = slotGroupStart[s], hi = slotGroupEnd[s];
      while (s > lo && st[s - 1] > st[s]) { const t = st[s]; st[s] = st[s - 1]; st[s - 1] = t; s--; }
      while (s + 1 < hi && st[s + 1] < st[s]) { const t = st[s]; st[s] = st[s + 1]; st[s + 1] = t; s++; }
    }

    // The canonical state of piece positions given in piece order.
    function fromPieces(pos) {
      const st = order.map(i => pos[i]);
      for (let s = 0; s < n; s++) settle(st, s);
      return st;
    }

    const key = st => String.fromCharCode.apply(null, st);
    const unkey = k => { const st = new Array(k.length); for (let i = 0; i < k.length; i++) st[i] = k.charCodeAt(i); return st; };

    // Calls visit(slot, from, to, nextState) for every move from `st`.
    function moves(st, visit) {
      fill(st);
      const out = [];
      for (let s = 0; s < n; s++) {
        out.length = 0;
        reach(st, s, out);
        for (const b of out) {
          const nx = st.slice();
          nx[s] = b;
          settle(nx, s);
          visit(s, st[s], b, nx);
        }
      }
    }

    return { puz, W, H, n, order, slots, groupStart: slotGroupStart, groupEnd: slotGroupEnd, goalTest, key, unkey, moves, fromPieces, fill, reach, occ };
  }

  /* ---------- searches ---------- */

  // Breadth-first from `start` to a goal. Returns { dist, path } where path
  // lists [slot-anchor-from, anchor-to] moves in canonical terms, or null.
  function solve(model, start, limit) {
    limit = limit || 5e6;
    const k0 = model.key(start);
    if (model.goalTest(start)) return { dist: 0, path: [], explored: 1 };
    const parent = new Map([[k0, null]]);
    let frontier = [start];
    let depth = 0;
    while (frontier.length && parent.size < limit) {
      depth++;
      const next = [];
      for (const st of frontier) {
        const pk = model.key(st);
        let found = null;
        model.moves(st, (s, a, b, nx) => {
          if (found) return;
          const k = model.key(nx);
          if (parent.has(k)) return;
          parent.set(k, [pk, a, b]);
          if (model.goalTest(nx)) found = k;
          else next.push(nx);
        });
        if (found) {
          const path = [];
          for (let k = found; parent.get(k); k = parent.get(k)[0]) {
            const [, a, b] = parent.get(k);
            path.push([a, b]);
          }
          return { dist: depth, path: path.reverse(), explored: parent.size };
        }
      }
      frontier = next;
    }
    return null;
  }

  // Every state that can be reached from `start`, as keys, in BFS order.
  function component(model, start, limit) {
    limit = limit || 3e6;
    const seen = new Map([[model.key(start), 0]]);
    const list = [model.key(start)];
    for (let i = 0; i < list.length; i++) {
      if (list.length > limit) return null;
      const st = model.unkey(list[i]);
      model.moves(st, (s, a, b, nx) => {
        const k = model.key(nx);
        if (!seen.has(k)) { seen.set(k, list.length); list.push(k); }
      });
    }
    return list;
  }

  // Distance to the nearest goal for every state of a component (keys).
  // Returns a Map key -> distance; states with no goal are absent.
  function distances(model, keys) {
    const dist = new Map();
    let frontier = [];
    for (const k of keys) {
      if (model.goalTest(model.unkey(k))) { dist.set(k, 0); frontier.push(k); }
    }
    let d = 0;
    while (frontier.length) {
      d++;
      const next = [];
      for (const k of frontier) {
        model.moves(model.unkey(k), (s, a, b, nx) => {
          const nk = model.key(nx);
          if (!dist.has(nk)) { dist.set(nk, d); next.push(nk); }
        });
      }
      frontier = next;
    }
    return dist;
  }

  /* The same search in slices, so a page stays responsive: step(ms) works
   * for about ms milliseconds and returns null while unfinished, then
   * { dist, path } as solve() does, or { dist: -1 } when no goal can be
   * reached. Path entries are [slot, from, to, key after the move]: the slot
   * names the group of alike pieces, from picks the one of them to move. */
  function Search(model, start, limit) {
    limit = limit || 4e6;
    const parent = new Map([[model.key(start), null]]);
    let frontier = [start], next = [], i = 0, depth = 0, result = null;
    if (model.goalTest(start)) result = { dist: 0, path: [] };

    function finish(k) {
      const path = [];
      for (; parent.get(k); k = parent.get(k)[0]) {
        const [, s, a, b] = parent.get(k);
        path.push([s, a, b, k]);
      }
      result = { dist: path.length, path: path.reverse() };
    }

    function step(ms) {
      if (result) return result;
      const until = Date.now() + (ms || 12);
      while (!result) {
        if (i >= frontier.length) {
          if (!next.length || parent.size > limit) { result = { dist: -1 }; break; }
          frontier = next; next = []; i = 0; depth++;
        }
        const st = frontier[i++];
        const pk = model.key(st);
        let found = null;
        model.moves(st, (s, a, b, nx) => {
          if (found) return;
          const k = model.key(nx);
          if (parent.has(k)) return;
          parent.set(k, [pk, s, a, b]);
          if (model.goalTest(nx)) found = k;
          else next.push(nx);
        });
        if (found) { finish(found); break; }
        if ((i & 63) === 0 && Date.now() > until) break;
      }
      return result;
    }
    return { step, get explored() { return parent.size; } };
  }

  /* ---------- shapes for drawing ---------- */

  // The outline of a set of cells as closed loops of corner points,
  // clockwise on screen (y down), collinear points removed.
  function outline(cells) {
    const has = new Set(cells.map(c => c[0] + "," + c[1]));
    const inSet = (x, y) => has.has(x + "," + y);
    const edges = new Map(); // "x,y" start -> list of [x2, y2]
    const add = (x1, y1, x2, y2) => {
      const k = x1 + "," + y1;
      if (!edges.has(k)) edges.set(k, []);
      edges.get(k).push([x2, y2]);
    };
    for (const [x, y] of cells) {
      if (!inSet(x, y - 1)) add(x, y, x + 1, y);
      if (!inSet(x + 1, y)) add(x + 1, y, x + 1, y + 1);
      if (!inSet(x, y + 1)) add(x + 1, y + 1, x, y + 1);
      if (!inSet(x - 1, y)) add(x, y + 1, x, y);
    }
    const loops = [];
    for (;;) {
      let startKey = null;
      for (const [k, list] of edges) if (list.length) { startKey = k; break; }
      if (!startKey) break;
      const pts = [];
      let [cx, cy] = startKey.split(",").map(Number);
      let pdx = 0, pdy = 0;
      for (let guard = 0; guard < 10000; guard++) {
        const list = edges.get(cx + "," + cy);
        if (!list || !list.length) break;
        // At a pinch point prefer the right turn, so loops stay apart.
        let pick = 0;
        if (list.length > 1) {
          const rx = -pdy, ry = pdx;
          const j = list.findIndex(([x, y]) => x - cx === rx && y - cy === ry);
          if (j >= 0) pick = j;
        }
        const [nx, ny] = list.splice(pick, 1)[0];
        pts.push([cx, cy]);
        pdx = nx - cx; pdy = ny - cy;
        cx = nx; cy = ny;
        if (cx + "," + cy === startKey) break;
      }
      // Drop points in the middle of straight runs.
      const out = pts.filter((p, i) => {
        const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length];
        return !((a[0] === p[0] && p[0] === b[0]) || (a[1] === p[1] && p[1] === b[1]));
      });
      loops.push(out);
    }
    return loops;
  }

  // An SVG path for cells drawn at `size` px a cell, shrunk by `gap` px on
  // every side, with corners rounded by `r` (inner corners by r / 2).
  function roundedPath(cells, size, gap, r) {
    let d = "";
    for (const loop of outline(cells)) {
      const m = loop.length;
      const pts = loop.map((p, i) => {
        const a = loop[(i + m - 1) % m], b = loop[(i + 1) % m];
        const d1 = [Math.sign(p[0] - a[0]), Math.sign(p[1] - a[1])];
        const d2 = [Math.sign(b[0] - p[0]), Math.sign(b[1] - p[1])];
        // Each edge moves inward by gap: inward is the right-hand side.
        const nx = -d1[1] - d2[1], ny = d1[0] + d2[0];
        const convex = d1[0] * d2[1] - d1[1] * d2[0] > 0;
        return { x: p[0] * size + gap * nx, y: p[1] * size + gap * ny, d1, d2, convex };
      });
      pts.forEach((p, i) => {
        const rr = p.convex ? r : r / 2;
        const ax = p.x - p.d1[0] * rr, ay = p.y - p.d1[1] * rr;
        const bx = p.x + p.d2[0] * rr, by = p.y + p.d2[1] * rr;
        d += (i ? "L" : "M") + f2(ax) + " " + f2(ay) + "Q" + f2(p.x) + " " + f2(p.y) + " " + f2(bx) + " " + f2(by);
      });
      d += "Z";
    }
    return d;
  }
  const f2 = v => Math.round(v * 100) / 100;

  const api = { FAMILIES, DX, DY, parse, Model, solve, component, distances, Search, outline, roundedPath, shapeKey, allowed };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SB = api;
})(typeof self !== "undefined" ? self : this);
