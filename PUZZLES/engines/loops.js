/* The Puzzle Cabinet · engines/loops.js
 *
 * Loop and region pencil puzzles, in the manner of Simon Tatham's collection:
 *
 *   slither   Slitherlink (Tatham's Loopy): one loop along the grid lines;
 *             a number counts the sides of its square the loop uses
 *   masyu     Masyu (Tatham's Pearl): one loop through cell centres; black
 *             pearls turn with straight legs, white pearls go straight and
 *             the loop turns beside them
 *   hashi     Hashiwokakero (Tatham's Bridges): islands joined by single and
 *             double bridges into one connected group
 *   nurikabe  numbered islands in one connected sea without 2×2 pools
 *   kakuro    cross sums: runs of different digits with given totals
 *
 * Gestures follow Tatham: click an edge for a line, right-click for a cross,
 * drag to draw a run of lines; drag from island to island for a bridge; click
 * a cell to shade it, right-click for a dot. Every puzzle has one solution,
 * proved by verify(); the hints explain the next forced step and highlight it.
 * The reasoning lives in js/lib/loops-logic.js (Cabinet.loopsLogic).
 *
 * data (see tools/gen/loops.js):
 *   { kind: 'slither', w, h, clues: ['3.2.', …], sol: ['.##.', …] }        sol: the cells inside the loop
 *   { kind: 'masyu', w, h, grid: ['..w.b', …], sol: ['.##', …] }           sol: (h-1)×(w-1) squares between cell centres inside the loop
 *   { kind: 'hashi', w, h, grid: ['2.3..', …], sol: [[a, b, n], …] }       islands a < b in reading order, n bridges
 *   { kind: 'nurikabe', w, h, grid: ['2..', …], sol: ['.#.', …] }          numbers 1-9, a-z = 10-35; '#' sea
 *   { kind: 'kakuro', w, h, grid: ['#..', …], clues: [[cell, down, across], …], sol: ['#12', …] }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const LG = () => C.loopsLogic;
  const S = 40;                        // world units per cell

  const KINDS = { slither: 'Slitherlink', masyu: 'Masyu', hashi: 'Bridges', nurikabe: 'Nurikabe', kakuro: 'Kakuro' };
  const FAMILY_KIND = { slitherlink: 'slither', masyu: 'masyu', 'bridges-hashi': 'hashi', nurikabe: 'nurikabe', kakuro: 'kakuro' };
  function currentKind() {
    try {
      const hash = root.location && root.location.hash || '';
      let m = /#\/p\/([\w-]+)/.exec(hash);
      const p = m && C.byId[m[1]];
      if (p && p.data && p.data.kind) return p.data.kind;
      m = /#\/[xf]\/([\w-]+)/.exec(hash);
      return m ? FAMILY_KIND[m[1]] : null;
    } catch (e) { return null; }
  }

  const ABOUT = {
    slither: 'Draw **one closed loop** along the dotted lines. It never branches and never crosses itself. A number says how many of the four sides of its square the loop uses; squares without a number may use any.\n\n**Click** an edge to draw a line, **right-click** to cross it out (an edge you know is empty); do it again to clear. **Drag** from dot to dot to draw a whole run in one go (drag back to take it up again); right-drag crosses out a run. On a touch screen a **long press** crosses out, or switch the tap in the panel. Numbers fade when they have their lines and turn red when they have too many or can no longer get enough; dead ends, branches and stray small loops show in red. **Keys:** arrows move a cursor dot, **Shift+arrow** draws or rubs out the edge that way, **X+arrow** crosses it out.',
    masyu: 'Draw **one closed loop** through the centres of the cells, moving only up, down, left and right, never crossing or touching itself. It passes through **every pearl**. On a **black** pearl the loop turns, and on both sides it runs straight on through the next cell. Through a **white** pearl the loop goes straight, and it turns in the cell just before or just after the pearl (or both).\n\n**Drag** from cell to cell to draw the loop (drag back to take it up); drag over a line again to rub it out. **Click** the edge between two cells to draw or clear that step, **right-click** (or right-drag) to cross it out. On a touch screen a **long press** crosses out. Unhappy pearls turn red. **Keys:** arrows move a cursor, **Shift+arrow** draws that way, **X+arrow** crosses out.',
    hashi: 'Join all the islands into **one connected group** with bridges. Bridges run straight across or down, may not cross each other or pass over an island, and at most **two** bridges join the same pair of islands. The number on an island is how many bridges end there.\n\n**Drag** from an island towards a neighbour to lay a bridge; do it again for a double bridge, a third time to take them up. Clicking on a bridge does the same. **Right-drag** (or right-click a bridge) takes the bridges away, or marks an empty lane as *no bridge*. On a touch screen a **long press** does what the right button does. Islands turn gold when they have all their bridges and red when they have too many. **Keys:** arrows move between islands, **Shift+arrow** lays a bridge that way, **X+arrow** marks *no bridge*.',
    nurikabe: '**Shade** cells to make the sea. Every number stands in an **island** of unshaded cells of exactly that size, with just one number in each island; two islands never touch at their sides (corners are fine). The sea is **all one piece**, and it never forms a **2×2 pool** of shaded cells.\n\n**Click** a cell to shade it, **right-click** to put a dot (a cell you know is land); do it again to clear. **Drag** along a row or column to shade or dot a run. On a touch screen switch the tap between *Sea* and *Land* in the panel. Pools, crowded islands and numbers that can no longer be satisfied turn red; finished islands fade. **Keys:** arrows, **Enter** = sea, **Space** = land, **Backspace** clears.',
    kakuro: 'Fill every white cell with a digit **1 to 9**. A number above a diagonal is the total of the run of white cells to its right; a number below the diagonal, the total of the run below it. **No digit twice in one run.**\n\nClick a cell (or move with the **arrow keys**) and type a digit; type it again or press **Backspace** to rub it out. **Space** (or ✎) switches to small pencil marks; **Shift+digit** always pencils. The panel shows every way to make the runs through the selected cell, with the ones that no longer fit struck out. Repeated digits and wrong totals turn red; finished totals fade. **Hints** point to a cell that can be worked out and say why; ask again and the digit is written in.'
  };
  const ABOUT_ALL = 'Five kinds of pencil puzzle share this drawer: loops to draw (Slitherlink, Masyu), bridges to build (Bridges), a sea to shade (Nurikabe) and sums to fill (Kakuro). The *How to* tab of each puzzle tells its rules and gestures; the right button (or a long press) always makes the "no" mark.';

  const GOALS = {
    slither: 'One closed loop along the lines; every number counts the sides of its square that the loop uses.',
    masyu: 'One closed loop through every pearl: turn on black (straight on both sides), go straight through white (and turn next to it).',
    hashi: 'Bridge every island to the others: each gets exactly its number of bridges, none cross, all connected.',
    nurikabe: 'Every number in an island of its size; the sea connected, with no 2×2 pools.',
    kakuro: 'Digits 1–9, no repeats in a run, every run adding up to its total.'
  };

  function textFor(d) {
    if (d.kind === 'slither') return 'Draw a single closed loop along the dotted lines of this ' + d.w + '×' + d.h + ' grid, never crossing or branching. Each number says how many of the four sides of its square the loop uses.';
    if (d.kind === 'masyu') return 'Draw a single closed loop through the centres of the cells, moving up, down, left and right, that passes through every pearl. It turns on a black pearl and runs straight through the next cell on both sides; it goes straight through a white pearl and turns in a cell right before or after it.';
    if (d.kind === 'hashi') return 'Join the islands with bridges, straight across or down, into one connected group. No bridge crosses another, at most two join any pair of islands, and each island gets exactly as many bridges as its number.';
    if (d.kind === 'nurikabe') return 'Shade cells to make a sea. Each number lies in an island of unshaded cells of that size, one number per island, and islands never touch side by side. The sea is all one piece with no 2×2 pools.';
    return 'Fill the white cells with the digits 1 to 9 so that each run adds up to the total shown beside it — the number above a diagonal for the run to its right, below it for the run downwards — with no digit twice in a run.';
  }

  /* ---------- the puzzle as numbers (cached per data object) ---------- */

  const cache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function model(d) {
    if (cache && cache.has(d)) return cache.get(d);
    const L = LG();
    let m = null;
    if (d.kind === 'slither') {
      const P = L.slPrep(d.w, d.h, d.clues);
      const inR = new Uint8Array(d.w * d.h);
      for (let i = 0; i < d.w * d.h; i++) inR[i] = d.sol[Math.floor(i / d.w)][i % d.w] === '#' ? 1 : 0;
      m = { kind: d.kind, P, inR, sol: L.slLoopOf(P, inR) };
    } else if (d.kind === 'masyu') {
      const P = L.maPrep(d.w, d.h, d.grid);
      const fw = d.w - 1, faces = new Uint8Array(fw * (d.h - 1));
      for (let i = 0; i < faces.length; i++) faces[i] = d.sol[Math.floor(i / fw)][i % fw] === '#' ? 1 : 0;
      m = { kind: d.kind, P, faces, sol: L.maLoopOf(P, faces) };
    } else if (d.kind === 'hashi') {
      const P = L.hsPrep(d.w, d.h, d.grid);
      const sol = new Int8Array(P.NB), at = {};
      P.B.forEach((B, id) => { at[B.a + ',' + B.b] = id; });
      let bad = false;
      (d.sol || []).forEach(([a, b, n]) => { const id = at[Math.min(a, b) + ',' + Math.max(a, b)]; if (id == null) bad = true; else sol[id] = n; });
      m = { kind: d.kind, P, sol, bad };
    } else if (d.kind === 'nurikabe') {
      const P = L.nkPrep(d.w, d.h, d.grid);
      const sol = new Int8Array(P.N);
      for (let i = 0; i < P.N; i++) sol[i] = d.sol[Math.floor(i / d.w)][i % d.w] === '#' ? 1 : 0;
      m = { kind: d.kind, P, sol };
    } else if (d.kind === 'kakuro') {
      const P = L.kkPrep(d.w, d.h, d.grid, d.clues);
      const sol = new Int8Array(P.N);
      for (let i = 0; i < P.N; i++) { const ch = d.sol[Math.floor(i / d.w)][i % d.w]; sol[i] = ch >= '1' && ch <= '9' ? +ch : 0; }
      m = { kind: d.kind, P, sol };
    }
    if (cache && m) cache.set(d, m);
    return m;
  }

  /* ---------- verify (node) ---------- */

  const rowsOk = (rows, w, h, re) => Array.isArray(rows) && rows.length === h && rows.every((r) => typeof r === 'string' && r.length === w && re.test(r));

  function verify(p) {
    const d = p.data, L = LG();
    if (!L) return { ok: false, err: 'js/lib/loops-logic.js is not loaded' };
    if (!d || !KINDS[d.kind]) return { ok: false, err: 'data.kind must be one of ' + Object.keys(KINDS).join(', ') };
    const w = d.w, h = d.h;
    if (!(w >= 2 && w <= 30 && h >= 2 && h <= 30)) return { ok: false, err: 'w and h must be 2..30' };
    if (d.kind === 'slither') {
      if (!rowsOk(d.clues, w, h, /^[.0-3]+$/)) return { ok: false, err: 'clues must be ' + h + ' rows of ' + w + ' of . 0 1 2 3' };
      if (!rowsOk(d.sol, w, h, /^[.#]+$/)) return { ok: false, err: 'sol must be ' + h + ' rows of . and #' };
    } else if (d.kind === 'masyu') {
      if (!rowsOk(d.grid, w, h, /^[.wb]+$/)) return { ok: false, err: 'grid must be ' + h + ' rows of ' + w + ' of . w b' };
      if (!rowsOk(d.sol, w - 1, h - 1, /^[.#]+$/)) return { ok: false, err: 'sol must be ' + (h - 1) + ' rows of ' + (w - 1) + ' of . and #' };
    } else if (d.kind === 'hashi') {
      if (!rowsOk(d.grid, w, h, /^[.1-8]+$/)) return { ok: false, err: 'grid must be ' + h + ' rows of ' + w + ' of . and 1-8' };
      if (!Array.isArray(d.sol) || d.sol.some((x) => !Array.isArray(x) || x.length !== 3 || !(x[2] === 1 || x[2] === 2))) return { ok: false, err: 'sol must be a list of [a, b, 1|2]' };
    } else if (d.kind === 'nurikabe') {
      if (!rowsOk(d.grid, w, h, /^[.1-9a-z]+$/)) return { ok: false, err: 'grid must be ' + h + ' rows of ' + w + ' of . 1-9 a-z' };
      if (!rowsOk(d.sol, w, h, /^[.#]+$/)) return { ok: false, err: 'sol must be ' + h + ' rows of . and #' };
    } else {
      if (!rowsOk(d.grid, w, h, /^[.#]+$/)) return { ok: false, err: 'grid must be ' + h + ' rows of ' + w + ' of . and #' };
      if (!rowsOk(d.sol, w, h, /^[#1-9]+$/)) return { ok: false, err: 'sol must be ' + h + ' rows of # and 1-9' };
      if (!Array.isArray(d.clues)) return { ok: false, err: 'clues must be a list of [cell, down, across]' };
    }
    const m = model(d), P = m.P;
    if (d.kind === 'slither' || d.kind === 'masyu') {
      if (!L.loopValid(P, m.sol)) return { ok: false, err: 'the stored loop breaks the rules' };
      let r = L.loopSolve(P, 3);
      if (!r.done) r = L.loopSolve(P, 4, null, 900);
      if (r.done) {
        for (let e = 0; e < P.E; e++) if (r.v[e] !== m.sol[e]) return { ok: false, err: 'logic finds a different loop' };
        return { ok: true };
      }
      const c = L.loopCount(P, null, 2, 300000);
      if (!c.aborted && c.count === 1) return { ok: true, warn: 'unique, but logic alone does not finish it' };
      return { ok: false, err: c.aborted ? 'logic cannot finish it and counting gave up' : c.count ? 'more than one loop fits' : 'no loop fits' };
    }
    if (d.kind === 'hashi') {
      if (m.bad) return { ok: false, err: 'the solution names a bridge that cannot exist' };
      if (P.K < 2) return { ok: false, err: 'at least two islands are needed' };
      if (!L.hsValid(P, m.sol)) return { ok: false, err: 'the stored bridges break the rules' };
      const r = L.hsSolve(P, 3);
      if (r.done) {
        for (let b = 0; b < P.NB; b++) if (r.S.lo[b] !== m.sol[b]) return { ok: false, err: 'logic finds different bridges' };
        return { ok: true };
      }
      const c = L.hsCount(P, 2, 200000);
      if (!c.aborted && c.count === 1) return { ok: true, warn: 'unique, but logic alone does not finish it' };
      return { ok: false, err: c.aborted ? 'counting gave up' : c.count ? 'more than one way to build the bridges' : 'no solution' };
    }
    if (d.kind === 'nurikabe') {
      if (!P.nums.length) return { ok: false, err: 'no numbers' };
      if (!L.nkValid(P, m.sol)) return { ok: false, err: 'the stored solution breaks the rules' };
      const r = L.nkSolve(P, 3);
      if (r.done) {
        for (let i = 0; i < P.N; i++) if (r.v[i] !== m.sol[i]) return { ok: false, err: 'logic finds a different solution' };
        return { ok: true };
      }
      const c = L.nkCount(P, 2, 100000);
      if (!c.aborted && c.count === 1) return { ok: true, warn: 'unique, but logic alone does not finish it' };
      return { ok: false, err: c.aborted ? 'counting gave up' : c.count ? 'more than one solution' : 'no solution' };
    }
    // kakuro
    for (let i = 0; i < P.N; i++) if ((d.grid[Math.floor(i / w)][i % w] === '#') !== (m.sol[i] === 0)) return { ok: false, err: 'sol does not match the grid at cell ' + i };
    for (const i of P.whites) if (P.runOf[i * 2] < 0 || P.runOf[i * 2 + 1] < 0) return { ok: false, err: 'the white cell at ' + L.cellName(i, w) + ' needs an across and a down total' };
    for (const R of P.runs) if (R.cells.length < 2) return { ok: false, err: 'a run of one cell at ' + L.cellName(R.clue, w) };
    if (!L.kkValid(P, m.sol)) return { ok: false, err: 'the stored digits do not make the totals' };
    const r = L.kkSolve(P, 3);
    if (r.done) {
      for (const i of P.whites) if (r.digits[i] !== m.sol[i]) return { ok: false, err: 'logic finds different digits' };
      return { ok: true };
    }
    const c = L.kkCount(P, 2, 100000);
    if (!c.aborted && c.count === 1) return { ok: true, warn: 'unique, but logic alone does not finish it' };
    return { ok: false, err: c.aborted ? 'counting gave up' : c.count ? 'more than one solution' : 'no solution' };
  }

  /* ---------- family pictures ---------- */

  const f = (x) => C.fmtNum(x);
  function thumb(p) {
    const d = p.data, m = model(d);
    if (!m) return '';
    const w = d.w, h = d.h;
    const cs = Math.min(148 / w, 110 / h);
    const gx = (160 - w * cs) / 2, gy = (120 - h * cs) / 2;
    const X = (c) => f(gx + c * cs), Y = (r) => f(gy + r * cs);
    let out = '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet">';
    const txt = (x, y, t, size, fill, weight) => '<text x="' + f(x) + '" y="' + f(y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + f(size) + '" font-weight="' + (weight || 700) + '" font-family="Segoe UI, system-ui, sans-serif" fill="' + fill + '">' + t + '</text>';
    const solved = C.progress && C.progress.solved && C.progress.solved(p.id);
    if (d.kind === 'slither') {
      out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="var(--cell)" rx="2"/>';
      if (solved) {
        for (let i = 0; i < w * h; i++) if (m.inR[i]) out += '<rect x="' + X(i % w) + '" y="' + Y(Math.floor(i / w)) + '" width="' + f(cs + 0.3) + '" height="' + f(cs + 0.3) + '" fill="var(--accent)" opacity=".18"/>';
        let dd = '';
        const P = m.P;
        for (let e = 0; e < P.E; e++) if (m.sol[e]) { const a = P.ea[e], b = P.eb[e]; dd += 'M' + X(a % P.NW) + ' ' + Y(Math.floor(a / P.NW)) + 'L' + X(b % P.NW) + ' ' + Y(Math.floor(b / P.NW)); }
        out += '<path d="' + dd + '" stroke="var(--ink)" stroke-width="' + f(Math.max(1.4, cs * 0.14)) + '" stroke-linecap="round" fill="none"/>';
      }
      for (let r = 0; r <= h; r++) for (let c = 0; c <= w; c++) out += '<circle cx="' + X(c) + '" cy="' + Y(r) + '" r="' + f(Math.max(0.7, cs * 0.07)) + '" fill="var(--ink-2)"/>';
      for (let i = 0; i < w * h; i++) { const ch = d.clues[Math.floor(i / w)][i % w]; if (ch !== '.') out += txt(gx + (i % w + 0.5) * cs, gy + (Math.floor(i / w) + 0.5) * cs, ch, cs * 0.62, 'var(--ink)'); }
      return out + '</svg>';
    }
    if (d.kind === 'masyu') {
      out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="var(--cell)" rx="2"/>';
      let gl = '';
      for (let c = 1; c < w; c++) gl += 'M' + X(c) + ' ' + Y(0) + 'V' + Y(h);
      for (let r = 1; r < h; r++) gl += 'M' + X(0) + ' ' + Y(r) + 'H' + X(w);
      out += '<path d="' + gl + '" stroke="var(--grid-2)" stroke-width=".6" fill="none"/>';
      if (solved) {
        let dd = '';
        const P = m.P;
        for (let e = 0; e < P.E; e++) if (m.sol[e]) { const a = P.ea[e], b = P.eb[e]; dd += 'M' + f(gx + (a % w + 0.5) * cs) + ' ' + f(gy + (Math.floor(a / w) + 0.5) * cs) + 'L' + f(gx + (b % w + 0.5) * cs) + ' ' + f(gy + (Math.floor(b / w) + 0.5) * cs); }
        out += '<path d="' + dd + '" stroke="var(--accent)" stroke-width="' + f(Math.max(1.4, cs * 0.16)) + '" stroke-linecap="round" fill="none"/>';
      }
      for (let i = 0; i < w * h; i++) {
        const ch = d.grid[Math.floor(i / w)][i % w];
        if (ch === '.') continue;
        out += '<circle cx="' + f(gx + (i % w + 0.5) * cs) + '" cy="' + f(gy + (Math.floor(i / w) + 0.5) * cs) + '" r="' + f(cs * 0.33) + '" fill="' + (ch === 'b' ? '#1d2030' : '#fbfbf7') + '" stroke="' + (ch === 'b' ? '#8a90ab' : '#2b2e40') + '" stroke-width="' + f(Math.max(0.8, cs * 0.06)) + '"/>';
      }
      return out + '</svg>';
    }
    if (d.kind === 'hashi') {
      const P = m.P;
      out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="var(--water)" opacity=".35" rx="4"/>';
      const cx = (a) => gx + (P.isl[a].c + 0.5) * cs, cy = (a) => gy + (P.isl[a].r + 0.5) * cs;
      if (solved) {
        P.B.forEach((B, id) => {
          const n = m.sol[id];
          if (!n) return;
          const off = n === 2 ? cs * 0.12 : 0, ox = B.dir ? off : 0, oy = B.dir ? 0 : off;
          for (const k of n === 2 ? [-1, 1] : [0]) out += '<line x1="' + f(cx(B.a) + ox * k) + '" y1="' + f(cy(B.a) + oy * k) + '" x2="' + f(cx(B.b) + ox * k) + '" y2="' + f(cy(B.b) + oy * k) + '" stroke="var(--ink)" stroke-width="' + f(Math.max(1, cs * 0.08)) + '"/>';
        });
      }
      P.isl.forEach((I, a) => {
        out += '<circle cx="' + f(cx(a)) + '" cy="' + f(cy(a)) + '" r="' + f(cs * 0.42) + '" fill="var(--cell)" stroke="var(--ink)" stroke-width="' + f(Math.max(0.8, cs * 0.07)) + '"/>';
        out += txt(cx(a), cy(a) + 0.5, I.k, cs * 0.55, 'var(--ink)');
      });
      return out + '</svg>';
    }
    if (d.kind === 'nurikabe') {
      out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="var(--cell)"/>';
      for (let i = 0; i < w * h; i++) {
        const r = Math.floor(i / w), c = i % w, ch = d.grid[r][c];
        if (solved && m.sol[i]) out += '<rect x="' + X(c) + '" y="' + Y(r) + '" width="' + f(cs + 0.3) + '" height="' + f(cs + 0.3) + '" fill="#2d5a86"/>';
        if (ch !== '.') out += txt(gx + (c + 0.5) * cs, gy + (r + 0.5) * cs, (ch <= '9' ? ch : String(ch.charCodeAt(0) - 87)), cs * 0.6, 'var(--ink)');
      }
      let gl = '';
      for (let c = 1; c < w; c++) gl += 'M' + X(c) + ' ' + Y(0) + 'V' + Y(h);
      for (let r = 1; r < h; r++) gl += 'M' + X(0) + ' ' + Y(r) + 'H' + X(w);
      out += '<path d="' + gl + '" stroke="var(--grid-2)" stroke-width=".6" fill="none"/><rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>';
      return out + '</svg>';
    }
    // kakuro
    const P = m.P;
    for (let i = 0; i < w * h; i++) {
      const r = Math.floor(i / w), c = i % w;
      if (P.white[i]) {
        out += '<rect x="' + X(c) + '" y="' + Y(r) + '" width="' + f(cs) + '" height="' + f(cs) + '" fill="var(--cell)" stroke="var(--grid-2)" stroke-width=".6"/>';
        if (solved) out += txt(gx + (c + 0.5) * cs, gy + (r + 0.5) * cs, m.sol[i], cs * 0.62, 'var(--accent)', 600);
      } else {
        out += '<rect x="' + X(c) + '" y="' + Y(r) + '" width="' + f(cs) + '" height="' + f(cs) + '" fill="#23263a"/>';
        const cl = P.clueAt[i];
        if (cl) {
          out += '<path d="M' + X(c) + ' ' + Y(r) + 'L' + X(c + 1) + ' ' + Y(r + 1) + '" stroke="#8a90ab" stroke-width=".7"/>';
          if (cl[0]) out += txt(gx + (c + 0.3) * cs, gy + (r + 0.72) * cs, cl[0], cs * 0.3, '#fff', 600);
          if (cl[1]) out += txt(gx + (c + 0.72) * cs, gy + (r + 0.3) * cs, cl[1], cs * 0.3, '#fff', 600);
        }
      }
    }
    return out + '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.4"/></svg>';
  }

  /* ---------- Endless drawers ---------- */

  // [w, h, logic level] choices per drawer level
  const PLANS = {
    slither: [null, [[5, 5, 1], [6, 6, 1]], [[7, 7, 2], [6, 6, 2]], [[8, 8, 2], [10, 10, 2]], [[7, 7, 3], [8, 8, 3]], [[10, 10, 3]]],
    masyu: [null, [[6, 6, 1], [7, 7, 1]], [[8, 8, 1], [7, 7, 2]], [[6, 6, 3], [7, 7, 3]], [[8, 8, 3]], [[10, 10, 3]]],
    hashi: [null, [[7, 7, 1]], [[7, 7, 2], [9, 9, 1]], [[10, 10, 2], [9, 9, 2]], [[13, 13, 2], [10, 10, 3]], [[13, 13, 3]]],
    nurikabe: [null, [[5, 5, 1], [6, 6, 1]], [[7, 7, 2], [6, 6, 2]], [[8, 8, 2], [9, 9, 2]], [[8, 8, 3], [9, 9, 3]], [[9, 9, 3], [10, 10, 3]]],
    kakuro: [null, [[5, 5, 1], [6, 6, 1]], [[7, 7, 2], [6, 6, 2]], [[8, 8, 2], [7, 7, 2]], [[9, 9, 2], [10, 10, 2]], [[12, 12, 2]]]
  };
  const now = () => (root.performance && root.performance.now ? root.performance.now() : Date.now());

  // make one puzzle of a kind; returns { data, diff, grade } or null
  function makeOne(kind, w, h, lv, rng, budget) {
    const L = LG();
    if (kind === 'slither') { const r = L.slMake(w, h, rng, lv, { budget }); return r && { diff: r.diff, grade: r.grade, data: { kind, w, h, clues: r.clues, sol: r.sol } }; }
    if (kind === 'masyu') { const r = L.maMake(w, h, rng, lv, { budget }); return r && { diff: r.diff, grade: r.grade, data: { kind, w, h, grid: r.grid, sol: r.sol } }; }
    if (kind === 'hashi') { const r = L.hsMake(w, h, rng, lv, { budget }); return r && { diff: r.diff, grade: r.grade, data: { kind, w, h, grid: r.grid, sol: r.sol } }; }
    if (kind === 'nurikabe') { const r = L.nkMake(w, h, rng, lv, { budget }); return r && { diff: r.diff, grade: r.grade, data: { kind, w, h, grid: r.grid, sol: r.sol } }; }
    const r = L.kkMake(w, h, rng, lv, { budget });
    return r && { diff: r.diff, grade: r.grade, data: { kind, w, h, grid: r.grid, clues: r.clues, sol: r.sol } };
  }
  const ENDLESS_TITLE = { slither: 'Loop', masyu: 'String of Pearls', hashi: 'Archipelago', nurikabe: 'Islands', kakuro: 'Cross Sums' };

  function generate(rng, level, fam) {
    const kind = FAMILY_KIND[fam && fam.id] || 'slither';
    const plan = PLANS[kind][Math.max(1, Math.min(5, level))];
    const t0 = now(), budget = level >= 5 ? 3200 : level >= 4 ? 2400 : 1400;
    let best = null;
    while (now() - t0 < budget) {
      // running late with nothing to show: fall back on the next level down, which is quicker to make
      const pl = !best && level > 1 && now() - t0 > budget * 0.55 ? PLANS[kind][level - 1] : plan;
      const [w, h, lv] = pl[rng.int(pl.length)];
      const got = makeOne(kind, w, h, lv, rng, budget - (now() - t0));
      if (!got) continue;
      if (!best || Math.abs(got.diff - level) < Math.abs(best.diff - level)) best = got;
      if (got.diff === level) break;
    }
    if (!best) return null;
    const d = best.data;
    return { title: ENDLESS_TITLE[kind] + ' ' + d.w + '×' + d.h, text: textFor(d), diff: best.diff, data: d };
  }

  /* ---------- shared bits of the boards ---------- */

  function timersFor() {
    const list = [];
    return { later(fn, ms) { const t = setTimeout(fn, ms); list.push(t); return t; }, clear() { list.forEach(clearTimeout); } };
  }
  const buzz = () => { try { if (root.navigator && root.navigator.vibrate) root.navigator.vibrate(12); } catch (e) { /* no buzz */ } };
  const SOLVED = {
    slither: ['One loop, every number satisfied.', 'Round and round and home again.', 'A perfect fence: not a line too many.', 'The loop is closed — and so is the case.'],
    masyu: ['Every pearl on the string.', 'A necklace fit for a queen.', 'Black pearls turning, white pearls sailing straight.', 'Strung without a slip.'],
    hashi: ['Every island is on the map.', 'All bridges built, not one too many.', 'The ferrymen are out of work.', 'One archipelago, happily connected.'],
    nurikabe: ['Every island in its place, and the sea all one.', 'Land ho! Every island accounted for.', 'Not a puddle too many.', 'The sea flows all the way round.'],
    kakuro: ['Every total adds up.', 'The books are balanced.', 'Sums and no repeats: done.', 'Cross sums, happy totals.']
  };
  const solvedMsg = (kind, p) => { const a = SOLVED[kind]; return a[(C.hash(p.id) >>> 3) % a.length]; };
  // what the puzzle asks of the solver, in words (after solving or revealing)
  const PLAIN = {
    slither: 'the plain rules: each number\'s count, two lines at every dot the loop visits, one single loop',
    masyu: 'the plain rules: every pearl on the loop, turns on black, straight through white, one single loop',
    hashi: 'counting what each island still needs against what its neighbours can take',
    nurikabe: 'the plain rules: finished islands are walled in, cells between islands are sea, pools are broken up, the sea stays in one piece'
  };
  const PATTERN = {
    slither: 'a few classic patterns (a 3 in a corner, 3s side by side or corner to corner, what a line entering a 1, 2 or 3 at a corner forces)',
    masyu: 'a few classic patterns (black pearls side by side, three white pearls in a row)',
    hashi: 'the rule that no group of islands may close itself off from the rest',
    nurikabe: 'weighing every way an island could still grow'
  };
  function explainGrade(kind, g) {
    if (!g || !g.done) return '';
    let t = 'Every step of this puzzle can be reasoned out, with no guessing. It needs ' + PLAIN[kind];
    if (g.top >= 2 && g.l2) t += '; also ' + PATTERN[kind];
    t += '.';
    if (g.l3) t += ' Along the way it needs ' + count(g.l3, '"suppose…" check') + ': try a mark, follow the rules, and watch something break.';
    return t;
  }
  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const count = (n, one, many) => (WORDS[n] || String(n)) + ' ' + (n === 1 ? one : (many || one + 's'));
  // the tap switch for touch screens, and a tip, in the side panel
  function tapPanel(ctx, labels, tip, onChange) {
    const btns = labels.map((label, k) => ctx.h('button.lp-segb' + (k === 0 ? '.on' : ''), { type: 'button', onclick: () => { btns.forEach((b, j) => b.classList.toggle('on', j === k)); onChange(k === 1); } }, label));
    const box = ctx.h('div.lp-panel', ctx.h('div.lp-seg', ctx.h('span.lp-segl', 'Tap:'), btns[0], btns[1]), ctx.h('div.lp-tip', tip));
    ctx.panel.appendChild(box);
    return box;
  }

  /* =====================================================================
   *  LOOPS: Slitherlink and Masyu
   * ===================================================================== */

  function mountLoop(ctx, p, m) {
    const wb = ctx.wb, L = LG(), s = ctx.s, P = m.P;
    const SL = P.kind === 'slither', kind = P.kind, w = P.w, h = P.h, E = P.E, NN = P.N;
    const nx = (n) => (SL ? (n % P.NW) * S : (n % w) * S + S / 2);
    const ny = (n) => (SL ? Math.floor(n / P.NW) * S : Math.floor(n / w) * S + S / 2);
    const W = w * S, H = h * S;
    const st = new Int8Array(E).fill(-1);          // -1 nothing, 0 cross, 1 line
    const ui = { tapCross: false };
    let won = false, pending = null, shown = null, drag = null, xKey = false, tipShown = false, hovE = -1;
    const T = timersFor();
    const cur = { n: SL ? Math.floor(h / 2) * P.NW + Math.floor(w / 2) : Math.floor(h / 2) * w + Math.floor(w / 2), on: false };

    ctx.setGoal(p.goal || GOALS[kind]);
    wb.setBounds({ x0: -S * 0.45, y0: -S * 0.45, x1: W + S * 0.45, y1: H + S * 0.45 }, 0.04);

    const G = s('g', { class: 'lp lp-' + kind }, wb.layer('board'));
    const bgG = s('g', null, G), cellG = s('g', null, G);
    const fillG = s('g', { class: 'lp-nohit lp-fill' }, G), zoneG = s('g', { class: 'lp-nohit' }, G), gridG = s('g', { class: 'lp-nohit' }, G);
    const crossG = s('g', { class: 'lp-nohit' }, G), lineG = s('g', { class: 'lp-nohit lp-lines' }, G);
    const dotG = s('g', { class: 'lp-nohit' }, G), errG = s('g', { class: 'lp-nohit' }, G), textG = s('g', { class: 'lp-nohit' }, G);
    const topG = s('g', { class: 'lp-nohit' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const hovEl = s('line', { class: 'lp-hov' }, topG);
    const curEl = s('circle', { r: SL ? 8 : S * 0.42, class: 'lp-cursor' }, topG);
    hovEl.style.display = 'none';

    s('rect', { x: -S * 0.32, y: -S * 0.32, width: W + S * 0.64, height: H + S * 0.64, rx: 10, class: 'lp-boardbg' }, bgG);
    for (let i = 0; i < w * h; i++) s('rect', { x: (i % w) * S, y: Math.floor(i / w) * S, width: S, height: S, class: 'lp-cell', 'data-key': 'c' + i }, cellG);
    if (!SL) {
      let gl = '';
      for (let c = 1; c < w; c++) gl += 'M' + c * S + ' 0V' + H;
      for (let r = 1; r < h; r++) gl += 'M0 ' + r * S + 'H' + W;
      s('path', { d: gl, class: 'lp-grid' }, gridG);
      s('rect', { x: 0, y: 0, width: W, height: H, rx: 2, class: 'lp-frame' }, gridG);
    }
    const lineEls = [], crossEls = [];
    for (let e = 0; e < E; e++) {
      const x1 = nx(P.ea[e]), y1 = ny(P.ea[e]), x2 = nx(P.eb[e]), y2 = ny(P.eb[e]);
      const ln = s('line', { x1, y1, x2, y2, class: 'lp-line' }, lineG);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, k = S * 0.085;
      const cr = s('path', { d: 'M' + (mx - k) + ' ' + (my - k) + 'L' + (mx + k) + ' ' + (my + k) + 'M' + (mx + k) + ' ' + (my - k) + 'L' + (mx - k) + ' ' + (my + k), class: 'lp-cross' }, crossG);
      ln.style.display = 'none'; cr.style.display = 'none';
      lineEls.push(ln); crossEls.push(cr);
    }
    const dotEls = [];
    if (SL) for (let n = 0; n < NN; n++) dotEls.push(s('circle', { cx: nx(n), cy: ny(n), r: 3.1, class: 'lp-dot' }, dotG));
    else for (let n = 0; n < NN; n++) if (!P.pearl[n]) s('circle', { cx: nx(n), cy: ny(n), r: 1.4, class: 'lp-centre' }, dotG);
    const clueEls = {}, pearlEls = {};
    if (SL) for (const c of P.clueCells) clueEls[c] = s('text', { x: (c % w) * S + S / 2, y: Math.floor(c / w) * S + S / 2 + 1, class: 'lp-clue', text: String(P.clue[c]) }, textG);
    else for (const n of P.pearls) pearlEls[n] = s('circle', { cx: nx(n), cy: ny(n), r: S * 0.3, class: 'lp-pearl ' + (P.pearl[n] === 2 ? 'black' : 'white') }, dotG);

    /* ---------- what the marks say ---------- */

    const deg = new Uint8Array(NN), unk = new Uint8Array(NN), errE = new Uint8Array(E), errN = new Uint8Array(NN);
    const sig = new Array(E).fill(''), dsig = new Array(NN).fill('');
    let A = null;
    function pearlBad(n) {
      const on = [0, 0, 0, 0];
      let possible = 0;
      for (let dd = 0; dd < 4; dd++) { const e = P.nbrE[n * 4 + dd]; if (e >= 0 && st[e] === 1) on[dd] = 1; if (e >= 0 && st[e] !== 0) possible++; }
      if (possible < 2) return true;
      const straightAt = (x, dd) => { const e = P.nbrE[x * 4 + dd]; return e >= 0 && st[e] === 1; };
      const blockedAt = (x, dd) => { const e = P.nbrE[x * 4 + dd]; return e < 0 || st[e] === 0; };
      if (P.pearl[n] === 2) {
        if ((on[0] && on[2]) || (on[1] && on[3])) return true;
        for (let dd = 0; dd < 4; dd++) {
          if (!on[dd]) continue;
          const x = P.nbrN[n * 4 + dd];
          if (blockedAt(x, dd) || (deg[x] === 2 && !straightAt(x, dd))) return true;
        }
        return false;
      }
      if ((on[0] || on[2]) && (on[1] || on[3])) return true;
      if (on[0] + on[1] + on[2] + on[3] === 2) {
        const d1 = on[0] ? 0 : 3, d2 = on[0] ? 2 : 1;
        if (straightAt(P.nbrN[n * 4 + d1], d1) && straightAt(P.nbrN[n * 4 + d2], d2)) return true;
      }
      return false;
    }
    function analyse() {
      deg.fill(0); unk.fill(0); errE.fill(0); errN.fill(0);
      let lines = 0;
      for (let e = 0; e < E; e++) {
        const a = P.ea[e], b = P.eb[e];
        if (st[e] === 1) { deg[a]++; deg[b]++; lines++; } else if (st[e] === -1) { unk[a]++; unk[b]++; }
      }
      let branches = 0, deads = 0;
      for (let n = 0; n < NN; n++) {
        if (deg[n] > 2) { errN[n] = 1; branches++; } else if (deg[n] === 1 && !unk[n]) { errN[n] = 1; deads++; }
      }
      const comp = new Int32Array(NN).fill(-1), comps = [];
      for (let n = 0; n < NN; n++) {
        if (!deg[n] || comp[n] >= 0) continue;
        const cc = { closed: true, size: 0 };
        const stack = [n];
        comp[n] = comps.length;
        while (stack.length) {
          const x = stack.pop();
          cc.size++;
          if (deg[x] !== 2) cc.closed = false;
          for (let dd = 0; dd < 4; dd++) { const e = P.nbrE[x * 4 + dd]; if (e < 0 || st[e] !== 1) continue; const y = P.nbrN[x * 4 + dd]; if (comp[y] < 0) { comp[y] = comps.length; stack.push(y); } }
        }
        comps.push(cc);
      }
      const loops = comps.filter((c) => c.closed).length;
      if (comps.length > 1) for (let e = 0; e < E; e++) if (st[e] === 1 && comps[comp[P.ea[e]]].closed) errE[e] = 1;
      let badClues = 0, wrongClues = 0, badPearls = 0, pearlsOn = 0;
      if (SL) {
        for (const c of P.clueCells) {
          let on = 0, u = 0;
          for (let q = 0; q < 4; q++) { const x = st[P.cellE[c * 4 + q]]; if (x === 1) on++; else if (x === -1) u++; }
          const k = P.clue[c], bad = on > k || on + u < k;
          clueEls[c].classList.toggle('bad', bad);
          clueEls[c].classList.toggle('done', on === k && !bad && (k > 0 || u === 0));
          if (bad) badClues++;
          if (on !== k) wrongClues++;
        }
      } else {
        for (const n of P.pearls) {
          const bad = pearlBad(n);
          pearlEls[n].classList.toggle('bad', bad);
          pearlEls[n].classList.toggle('on', deg[n] === 2 && !bad);
          if (bad) badPearls++;
          if (deg[n] === 2) pearlsOn++;
        }
      }
      A = { lines, branches, deads, comps: comps.length, loops, badClues, wrongClues, badPearls, pearlsOn };
      return A;
    }
    function lineVals() { const v = new Int8Array(E); for (let e = 0; e < E; e++) v[e] = st[e] === 1 ? 1 : 0; return v; }
    function evaluate() {
      if (L.loopValid(P, lineVals())) return { solved: true, msg: solvedMsg(kind, p) };
      const a = A || analyse();
      if (!a.lines) return { solved: false, msg: 'Nothing is drawn yet. ' + (SL ? 'A good place to start: a 0, or a 3 in a corner.' : 'A good place to start: a pearl near the edge.') };
      if (a.branches) return { solved: false, msg: 'The loop may not branch: ' + (SL ? 'a dot' : 'a cell') + ' has more than two lines.' };
      if (a.loops && a.comps > 1) return { solved: false, msg: 'There is more than one loop — the stray one is shown in red.' };
      if (a.comps > 1) return { solved: false, msg: 'The lines are still in ' + a.comps + ' pieces; they have to join into one loop.' };
      if (!a.loops) return { solved: false, msg: 'The loop is not closed yet.' };
      if (SL) return { solved: false, msg: 'The loop is closed, but ' + count(a.wrongClues, 'number does', 'numbers do') + ' not have the right count of lines.' };
      const off = P.pearls.length - a.pearlsOn;
      return { solved: false, msg: off ? 'The loop is closed, but it misses ' + count(off, 'pearl') + '.' : 'The loop passes every pearl, but ' + count(a.badPearls, 'pearl is', 'pearls are') + ' not happy.' };
    }

    /* ---------- drawing ---------- */

    function refresh() {
      const a = analyse();
      for (let e = 0; e < E; e++) {
        const key = st[e] + ':' + errE[e];
        if (sig[e] === key) continue;
        sig[e] = key;
        lineEls[e].style.display = st[e] === 1 ? '' : 'none';
        lineEls[e].setAttribute('class', 'lp-line' + (errE[e] ? ' err' : ''));
        crossEls[e].style.display = st[e] === 0 ? '' : 'none';
      }
      if (SL) {
        for (let n = 0; n < NN; n++) {
          const cls = 'lp-dot' + (errN[n] ? ' err' : deg[n] ? ' on' : '');
          if (dsig[n] !== cls) { dsig[n] = cls; dotEls[n].setAttribute('class', cls); }
        }
      } else {
        while (errG.firstChild) errG.removeChild(errG.firstChild);
        for (let n = 0; n < NN; n++) if (errN[n]) s('circle', { cx: nx(n), cy: ny(n), r: S * 0.22, class: 'lp-errnode' }, errG);
      }
      if (SL) ctx.stat('Numbers happy', (P.clueCells.length - a.wrongClues) + ' of ' + P.clueCells.length);
      else ctx.stat('Pearls on the loop', a.pearlsOn + ' of ' + P.pearls.length);
      if (shown) pruneHint();
      if (won && !evaluate().solved) setWon(false);
    }

    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
      while (fillG.firstChild) fillG.removeChild(fillG.firstChild);
      if (!on) return;
      const cx = W / 2, cy = H / 2, far = Math.hypot(cx, cy) || 1;
      if (SL) {
        for (let i = 0; i < w * h; i++) {
          if (!m.inR[i]) continue;
          const x = (i % w) * S, y = Math.floor(i / w) * S;
          const el = s('rect', { x, y, width: S + 0.5, height: S + 0.5, class: 'lp-in' }, fillG);
          el.style.animationDelay = (0.05 + 0.7 * Math.hypot(x + S / 2 - cx, y + S / 2 - cy) / far).toFixed(3) + 's';
        }
      } else {
        const fw = w - 1;
        for (let i = 0; i < m.faces.length; i++) {
          if (!m.faces[i]) continue;
          const x = (i % fw) * S + S / 2, y = Math.floor(i / fw) * S + S / 2;
          const el = s('rect', { x, y, width: S + 0.5, height: S + 0.5, class: 'lp-in' }, fillG);
          el.style.animationDelay = (0.05 + 0.7 * Math.hypot(x + S / 2 - cx, y + S / 2 - cy) / far).toFixed(3) + 's';
        }
      }
    }

    /* ---------- hints on the board ---------- */

    function clearHint() {
      shown = null;
      while (hintG.firstChild) hintG.removeChild(hintG.firstChild);
    }
    function edgeLine(e, cls, parent) { return s('line', { x1: nx(P.ea[e]), y1: ny(P.ea[e]), x2: nx(P.eb[e]), y2: ny(P.eb[e]), class: cls }, parent || hintG); }
    function edgeCross(e, cls, parent) {
      const mx = (nx(P.ea[e]) + nx(P.eb[e])) / 2, my = (ny(P.ea[e]) + ny(P.eb[e])) / 2, k = S * 0.11;
      return s('path', { d: 'M' + (mx - k) + ' ' + (my - k) + 'L' + (mx + k) + ' ' + (my + k) + 'M' + (mx + k) + ' ' + (my - k) + 'L' + (mx - k) + ' ' + (my + k), class: cls }, parent || hintG);
    }
    function markFocus(fc, cls) {
      if (!fc) return;
      (fc.cells || []).forEach((c) => {
        if (SL) s('rect', { x: (c % w) * S + 3, y: Math.floor(c / w) * S + 3, width: S - 6, height: S - 6, rx: 6, class: 'lp-hcell ' + cls }, hintG);
        else s('circle', { cx: nx(c), cy: ny(c), r: S * 0.43, class: 'lp-hring ' + cls }, hintG);
      });
      (fc.nodes || []).forEach((n) => s('circle', { cx: nx(n), cy: ny(n), r: SL ? 9 : S * 0.43, class: 'lp-hring ' + cls }, hintG));
      (fc.edges || []).forEach((e) => edgeLine(e, 'lp-hedge ' + cls));
    }
    function showHint(step) {
      clearHint();
      shown = { set: (step.set || []).slice(), wrong: (step.wrong || []).slice(), els: {} };
      markFocus(step.focus, 'why');
      (step.ghost || []).forEach(([e, x]) => { if (step.set.some(([f]) => f === e)) return; if (x === 1) edgeLine(e, 'lp-ghostline'); else edgeCross(e, 'lp-ghostcross'); });
      markFocus(step.bad, 'bad');
      shown.wrong.forEach((e) => { shown.els['w' + e] = edgeLine(e, 'lp-hwrong'); });
      shown.set.forEach(([e, x]) => { shown.els[e] = x === 1 ? edgeLine(e, 'lp-gline') : edgeCross(e, 'lp-gcross'); });
    }
    function pruneHint() {
      shown.set = shown.set.filter(([e, x]) => { if (st[e] !== x) return true; if (shown.els[e]) shown.els[e].remove(); return false; });
      shown.wrong = shown.wrong.filter((e) => { if (st[e] !== -1 && st[e] !== m.sol[e]) return true; if (shown.els['w' + e]) shown.els['w' + e].remove(); return false; });
      if (!shown.set.length && !shown.wrong.length) clearHint();
    }
    function flash(edges) {
      const els = edges.map((e) => edgeLine(e, 'lp-flash'));
      T.later(() => els.forEach((el) => el.remove()), 1400);
    }
    function wrongEdges() { const out = []; for (let e = 0; e < E; e++) if (st[e] !== -1 && st[e] !== m.sol[e]) out.push(e); return out; }
    const describe = (set) => {
      const k1 = set.filter((x) => x[1] === 1).length, k0 = set.length - k1;
      return [k1 ? count(k1, 'line') : null, k0 ? count(k0, 'cross', 'crosses') : null].filter(Boolean).join(' and ');
    };

    /* ---------- gestures ---------- */

    // the dot (slither) or cell (masyu) a drag passes through
    function pathNode(pt) {
      if (SL) {
        const c = Math.round(pt[0] / S), r = Math.round(pt[1] / S);
        if (c < 0 || r < 0 || c > w || r > h) return -1;
        return Math.hypot(pt[0] - c * S, pt[1] - r * S) < S * 0.3 ? r * P.NW + c : -1;
      }
      const c = Math.floor(pt[0] / S), r = Math.floor(pt[1] / S);
      if (c < 0 || r < 0 || c >= w || r >= h) return -1;
      return Math.hypot(pt[0] - (c + 0.5) * S, pt[1] - (r + 0.5) * S) < S * 0.44 ? r * w + c : -1;
    }
    function cellOf(pt) {
      const c = Math.floor(pt[0] / S), r = Math.floor(pt[1] / S);
      return c < 0 || r < 0 || c >= w || r >= h ? -1 : r * w + c;
    }
    // the edge a click means
    function edgeAt(pt, tol) {
      let best = -1, bd = tol;
      for (let e = 0; e < E; e++) {
        const x1 = nx(P.ea[e]), y1 = ny(P.ea[e]), x2 = nx(P.eb[e]), y2 = ny(P.eb[e]);
        let dd;
        if (SL) {
          if (y1 === y2) dd = Math.hypot(pt[0] - Math.max(Math.min(pt[0], Math.max(x1, x2)), Math.min(x1, x2)), pt[1] - y1);
          else dd = Math.hypot(pt[0] - x1, pt[1] - Math.max(Math.min(pt[1], Math.max(y1, y2)), Math.min(y1, y2)));
        } else dd = Math.hypot(pt[0] - (x1 + x2) / 2, pt[1] - (y1 + y2) / 2);
        if (dd < bd) { bd = dd; best = e; }
      }
      return best;
    }
    function edgeBetween(a, b) { for (let dd = 0; dd < 4; dd++) if (P.nbrN[a * 4 + dd] === b) return P.nbrE[a * 4 + dd]; return -1; }
    // the steps of a straight run from node a to node b: [[edge, node]…], or null
    function stepsBetween(a, b) {
      const cols = SL ? P.NW : w;
      const ra = Math.floor(a / cols), ca = a % cols, rb = Math.floor(b / cols), cb = b % cols;
      if (ra !== rb && ca !== cb) return null;
      const dd = ra === rb ? (cb > ca ? 1 : 3) : (rb > ra ? 2 : 0);
      const out = [];
      let x = a;
      for (let guard = 0; guard < 64 && x !== b; guard++) {
        const e = P.nbrE[x * 4 + dd], y = P.nbrN[x * 4 + dd];
        if (e < 0) return null;
        out.push([e, y]);
        x = y;
      }
      return x === b ? out : null;
    }
    function firstEdge(e) {
      const right = drag.right || (drag.touch && ui.tapCross);
      const from = st[e], to = right ? (from === 0 ? -1 : 0) : (from === 1 ? -1 : 1);
      drag.mode = { from, to };
      st[e] = to;
      ctx.sfx('tap');
      refresh();
    }
    function applyEdge(e) {
      if (drag.orig[e] !== drag.mode.from || st[e] === drag.mode.to) return;
      st[e] = drag.mode.to;
      ctx.sfx('tap');
      refresh();
    }

    wb.handlers.board = {
      down(pt, ev) {
        const right = ev.button === 2, touch = ev.pointerType === 'touch';
        const n0 = pathNode(pt);
        const e0 = SL ? (n0 >= 0 ? -1 : edgeAt(pt, S * 0.38)) : edgeAt(pt, S * 0.25);
        const inside = pt[0] > -S * 0.3 && pt[1] > -S * 0.3 && pt[0] < W + S * 0.3 && pt[1] < H + S * 0.3;
        if (!inside) return false;
        cur.on = false;
        drawCursor();
        hover(null);
        drag = { right, touch, p0: pt, orig: st.slice(), nodes: [], edges: [], mode: null, e0, n0, moved: false };
        if (!SL) { const c0 = cellOf(pt); if (c0 >= 0) drag.nodes.push(c0); } else if (n0 >= 0) drag.nodes.push(n0);
        if (SL && e0 >= 0 && !touch) firstEdge(e0);
        if (touch) {
          const dg = drag;
          T.later(() => {
            if (drag !== dg || dg.moved || dg.mode) return;
            const e = dg.e0 >= 0 ? dg.e0 : edgeAt(dg.p0, SL ? S * 0.5 : S * 0.45);
            if (e < 0) return;
            dg.right = true;
            buzz();
            firstEdge(e);
            dg.done = true;
          }, 460);
        }
        return true;
      },
      move(pt) {
        if (!drag || drag.done) return;
        if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) > S * 0.14) drag.moved = true;
        if (SL && drag.touch && !drag.mode && drag.moved && drag.e0 >= 0) firstEdge(drag.e0);
        const n = pathNode(pt);
        if (n < 0) return;
        if (!drag.nodes.length) {
          // started on an edge: the path goes on from the end it reaches; started in a square: from the first dot
          if (drag.e0 < 0 || n === P.ea[drag.e0] || n === P.eb[drag.e0]) drag.nodes.push(n);
          return;
        }
        const last = drag.nodes[drag.nodes.length - 1];
        if (n === last) return;
        if (drag.nodes.length >= 2 && n === drag.nodes[drag.nodes.length - 2] && drag.edges.length) {
          const e = drag.edges.pop();
          drag.nodes.pop();
          if (st[e] !== drag.orig[e]) { st[e] = drag.orig[e]; refresh(); }
          return;
        }
        const steps = stepsBetween(last, n);
        if (!steps) return;
        for (const [e, y] of steps) {
          if (!drag.mode) firstEdge(e); else applyEdge(e);
          drag.edges.push(e);
          drag.nodes.push(y);
        }
      },
      up(pt) {
        if (!drag) return;
        if (!drag.mode && !drag.done) {
          let e = drag.e0;
          if (e < 0 && !SL && !drag.moved) e = edgeAt(pt, S * 0.25);
          if (e >= 0) firstEdge(e);
          else if (!tipShown && !drag.moved && (!SL || drag.n0 < 0)) { tipShown = true; ctx.toast(SL ? 'Click an edge between two dots for a line — or drag from dot to dot.' : 'Drag from cell to cell to draw the loop — or click between two cells.'); }
        }
        const changed = st.some((x, i) => x !== drag.orig[i]);
        drag = null;
        if (changed) ctx.changed('lines');
      },
      hover(pt) { hover(pt); }
    };
    function hover(pt) {
      let e = -1;
      if (pt && !drag) e = SL ? (pathNode(pt) >= 0 ? -1 : edgeAt(pt, S * 0.38)) : edgeAt(pt, S * 0.25);
      if (e === hovE) return;
      hovE = e;
      hovEl.style.display = e < 0 ? 'none' : '';
      if (e < 0) return;
      hovEl.setAttribute('x1', nx(P.ea[e])); hovEl.setAttribute('y1', ny(P.ea[e]));
      hovEl.setAttribute('x2', nx(P.eb[e])); hovEl.setAttribute('y2', ny(P.eb[e]));
    }
    const svg = wb.svg;
    const onLeave = () => hover(null);
    svg.addEventListener('pointerleave', onLeave);

    function drawCursor() {
      curEl.style.display = cur.on ? '' : 'none';
      curEl.setAttribute('cx', nx(cur.n));
      curEl.setAttribute('cy', ny(cur.n));
    }
    drawCursor();

    tapPanel(ctx, ['Line', 'Cross'], SL ? 'Right-click (or long-press) crosses an edge out. Drag from dot to dot to draw a run; drag back to take it up.' : 'Drag from cell to cell to draw. Right-click (or long-press) between two cells to cross that step out.', (on) => { ui.tapCross = on; });

    refresh();

    // the loop's edges in order, walking round from its first dot
    function loopOrder() {
      const out = [];
      let start = -1;
      for (let e = 0; e < E; e++) if (m.sol[e]) { start = P.ea[e]; break; }
      if (start < 0) return out;
      let n = start, prev = -1;
      for (let guard = 0; guard <= E; guard++) {
        let next = -1, via = -1;
        for (let dd = 0; dd < 4; dd++) { const e = P.nbrE[n * 4 + dd]; if (e >= 0 && m.sol[e] && e !== prev) { next = P.nbrN[n * 4 + dd]; via = e; break; } }
        if (via < 0) break;
        out.push(via);
        prev = via;
        n = next;
        if (n === start) break;
      }
      return out;
    }

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() {
        const wrong = wrongEdges();
        if (wrong.length) {
          if (pending && pending.fix) {
            wrong.forEach((e) => { st[e] = -1; });
            pending = null;
            clearHint();
            refresh();
            ctx.changed('hint');
            return 'I rubbed out ' + (wrong.length === 1 ? 'the wrong mark' : 'the ' + wrong.length + ' wrong marks') + '. Carry on from here.';
          }
          pending = { fix: true };
          return { text: (wrong.length === 1 ? 'One of your marks is wrong' : wrong.length + ' of your marks are wrong') + ' (shown in red). Look again — or ask for another hint and I will rub ' + (wrong.length === 1 ? 'it' : 'them') + ' out.', show() { showHint({ set: [], wrong }); } };
        }
        if (pending && pending.set) {
          const todo = pending.set.filter(([e, x]) => st[e] !== x);
          pending = null;
          if (todo.length) {
            todo.forEach(([e, x]) => { st[e] = x; });
            clearHint();
            refresh();
            ctx.changed('hint');
            return { text: 'Done: I put in ' + describe(todo) + ' from the last hint.', show() { flash(todo.map((x) => x[0])); } };
          }
        }
        const step = L.loopStep(P, st, 4, m.sol);
        if (!step) {
          const r = evaluate();
          return r.solved ? 'It is solved already!' : 'Nothing is left to deduce: ' + r.msg;
        }
        pending = { set: step.set };
        return { text: step.text + ' *(Another hint puts ' + (step.set.length === 1 ? 'it' : 'them') + ' in.)*', show() { showHint(step); } };
      },
      solve() {
        clearHint();
        pending = null;
        drag = null;
        for (let e = 0; e < E; e++) if (st[e] !== -1 && !(st[e] === 1 && m.sol[e] === 1)) st[e] = -1;
        const todo = loopOrder().filter((e) => st[e] !== 1);
        const per = Math.max(1, Math.ceil(todo.length / 45));
        let k = 0;
        const tick = () => {
          for (let t = 0; t < per && k < todo.length; t++, k++) st[todo[k]] = 1;
          refresh();
          if (k < todo.length) T.later(tick, C.anim(24));
          else ctx.changed('solve');
        };
        tick();
      },
      explain() { return explainGrade(kind, L.loopGrade(P, 3)); },
      getState() { let s0 = ''; for (let e = 0; e < E; e++) s0 += st[e] === 1 ? '1' : st[e] === 0 ? 'x' : '.'; return { e: s0 }; },
      setState(o) {
        if (!o || typeof o.e !== 'string' || o.e.length !== E) return;
        for (let e = 0; e < E; e++) st[e] = o.e[e] === '1' ? 1 : o.e[e] === 'x' ? 0 : -1;
        drag = null;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { pending = null; clearHint(); },
      key(ev) {
        const k = ev.key;
        if (k === 'x' || k === 'X') { xKey = ev.type === 'keydown'; return cur.on; }
        if (ev.type !== 'keydown') return false;
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const dirs = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
        if (k in dirs) {
          const dd = dirs[k];
          if (!cur.on) { cur.on = true; drawCursor(); return true; }
          const e = P.nbrE[cur.n * 4 + dd];
          if (ev.shiftKey || xKey) {
            if (e < 0) return true;
            st[e] = xKey ? (st[e] === 0 ? -1 : 0) : (st[e] === 1 ? -1 : 1);
            ctx.sfx('tap');
            refresh();
            ctx.changed('lines');
            if (!xKey) cur.n = P.nbrN[cur.n * 4 + dd];
          } else if (P.nbrN[cur.n * 4 + dd] >= 0) cur.n = P.nbrN[cur.n * 4 + dd];
          drawCursor();
          return true;
        }
        if (k === 'Escape' && cur.on) { cur.on = false; drawCursor(); }
        return false;
      },
      destroy() { T.clear(); svg.removeEventListener('pointerleave', onLeave); }
    };
  }

  /* =====================================================================
   *  BRIDGES
   * ===================================================================== */

  function mountHashi(ctx, p, m) {
    const wb = ctx.wb, L = LG(), s = ctx.s, P = m.P;
    const w = P.w, h = P.h, K = P.K, NB = P.NB, W = w * S, H = h * S;
    const cnt = new Int8Array(NB), no = new Uint8Array(NB);
    const ui = { tapNo: false };
    let won = false, pending = null, shown = null, drag = null, tipShown = false, xKey = false, hovA = -1;
    const T = timersFor();
    const cur = { a: 0, on: false };
    const ix = (a) => (P.isl[a].c + 0.5) * S, iy = (a) => (P.isl[a].r + 0.5) * S;
    const R = S * 0.37;

    ctx.setGoal(p.goal || GOALS.hashi);
    wb.setBounds({ x0: -S * 0.3, y0: -S * 0.3, x1: W + S * 0.3, y1: H + S * 0.3 }, 0.04);

    const G = s('g', { class: 'lp lp-hashi' }, wb.layer('board'));
    const bgG = s('g', null, G), laneG = s('g', { class: 'lp-nohit' }, G), noG = s('g', { class: 'lp-nohit' }, G);
    const bridgeG = s('g', { class: 'lp-nohit' }, G), islandG = s('g', null, G), textG = s('g', { class: 'lp-nohit' }, G);
    const topG = s('g', { class: 'lp-nohit' }, wb.layer('top'));
    const hintG = s('g', null, topG), prevG = s('g', null, topG);
    const curEl = s('circle', { r: R + 6, class: 'lp-cursor' }, topG);

    s('rect', { x: -S * 0.22, y: -S * 0.22, width: W + S * 0.44, height: H + S * 0.44, rx: 12, class: 'lp-water' }, bgG);
    for (let i = 0; i < w * h; i++) if (P.cellIsl[i] < 0) s('circle', { cx: (i % w + 0.5) * S, cy: (Math.floor(i / w) + 0.5) * S, r: 1.3, class: 'lp-wdot' }, bgG);
    // bridge ends, from rim to rim
    const ends = (b, off) => {
      const B = P.B[b], a = B.a, c = B.b;
      if (B.dir === 0) return [ix(a) + R * 0.92, iy(a) + off, ix(c) - R * 0.92, iy(c) + off];
      return [ix(a) + off, iy(a) + R * 0.92, ix(c) + off, iy(c) - R * 0.92];
    };
    const bEls = [], noEls = [];
    for (let b = 0; b < NB; b++) {
      const g = s('g', null, bridgeG);
      const mk = (off) => { const [x1, y1, x2, y2] = ends(b, off); return s('line', { x1, y1, x2, y2, class: 'lp-bridge' }, g); };
      const one = mk(0), a2 = mk(-S * 0.1), b2 = mk(S * 0.1);
      one.style.display = a2.style.display = b2.style.display = 'none';
      bEls.push({ one, a2, b2, sig: '' });
      const [x1, y1, x2, y2] = ends(b, 0), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, k = S * 0.1;
      const ng = s('g', { class: 'lp-no' }, noG);
      s('line', { x1, y1, x2, y2, class: 'lp-nolane' }, ng);
      s('path', { d: 'M' + (mx - k) + ' ' + (my - k) + 'L' + (mx + k) + ' ' + (my + k) + 'M' + (mx + k) + ' ' + (my - k) + 'L' + (mx - k) + ' ' + (my + k), class: 'lp-nox' }, ng);
      ng.style.display = 'none';
      noEls.push(ng);
    }
    const islEls = P.isl.map((I, a) => s('circle', { cx: ix(a), cy: iy(a), r: R, class: 'lp-isl', 'data-key': 'i' + a }, islandG));
    const islTxt = P.isl.map((I, a) => s('text', { x: ix(a), y: iy(a) + 1, class: 'lp-islnum', text: String(I.k) }, textG));

    /* ---------- what the bridges say ---------- */

    const blockedLane = (b) => P.cross[b].some((x) => cnt[x] > 0);
    let A = null;
    function analyse() {
      const sum = new Int32Array(K), room = new Int32Array(K);
      for (let b = 0; b < NB; b++) {
        const B = P.B[b];
        sum[B.a] += cnt[b]; sum[B.b] += cnt[b];
        if (!no[b] && !blockedLane(b)) { room[B.a] += 2 - cnt[b]; room[B.b] += 2 - cnt[b]; }
      }
      // groups joined by bridges
      const comp = new Int32Array(K).fill(-1), groups = [];
      for (let a = 0; a < K; a++) {
        if (comp[a] >= 0) continue;
        const list = [a];
        comp[a] = groups.length;
        for (let t = 0; t < list.length; t++) for (const b of P.islB[list[t]]) if (cnt[b]) { const o = P.B[b].a === list[t] ? P.B[b].b : P.B[b].a; if (comp[o] < 0) { comp[o] = groups.length; list.push(o); } }
        groups.push(list);
      }
      let done = 0, over = 0, stuck = 0, cut = 0;
      const state = new Array(K).fill('');
      for (let a = 0; a < K; a++) {
        const k = P.isl[a].k;
        if (sum[a] > k) { state[a] = 'over'; over++; } else if (sum[a] === k) { state[a] = 'done'; done++; } else if (sum[a] + room[a] < k) { state[a] = 'bad'; stuck++; }
      }
      if (groups.length > 1) for (const g of groups) if (g.every((a) => state[a] === 'done')) { g.forEach((a) => { state[a] = 'cut'; }); cut++; }
      A = { sum, state, done, over, stuck, cut, groups: groups.length };
      return A;
    }
    function evaluate() {
      if (L.hsValid(P, cnt)) return { solved: true, msg: solvedMsg('hashi', p) };
      const a = A || analyse();
      if (a.over) return { solved: false, msg: count(a.over, 'island has', 'islands have') + ' too many bridges.' };
      if (a.done < K) return { solved: false, msg: count(K - a.done, 'island still needs', 'islands still need') + ' bridges.' };
      return { solved: false, msg: 'Every island has its bridges, but they make ' + a.groups + ' separate groups: they must all be joined.' };
    }

    function refresh() {
      const a = analyse();
      for (let b = 0; b < NB; b++) {
        const key = cnt[b] + ':' + no[b];
        const el = bEls[b];
        if (el.sig === key) continue;
        el.sig = key;
        el.one.style.display = cnt[b] === 1 ? '' : 'none';
        el.a2.style.display = el.b2.style.display = cnt[b] === 2 ? '' : 'none';
        noEls[b].style.display = no[b] && !cnt[b] ? '' : 'none';
      }
      for (let i = 0; i < K; i++) {
        const cls = 'lp-isl' + (a.state[i] ? ' ' + a.state[i] : '');
        if (islEls[i].getAttribute('class') !== cls) islEls[i].setAttribute('class', cls);
        islTxt[i].setAttribute('class', 'lp-islnum' + (a.state[i] ? ' ' + a.state[i] : ''));
      }
      ctx.stat('Islands done', a.done + ' of ' + K);
      if (shown) pruneHint();
      if (won && !evaluate().solved) setWon(false);
    }
    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
      if (on) P.isl.forEach((I, a) => { islEls[a].style.animationDelay = (0.04 * (I.r + I.c)).toFixed(2) + 's'; });
    }

    /* ---------- hints ---------- */

    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    function laneLine(b, cls, off) { const [x1, y1, x2, y2] = ends(b, off || 0); return s('line', { x1, y1, x2, y2, class: cls }, hintG); }
    function ghostBridge(b, n, cls) {
      const g = s('g', { class: cls }, hintG);
      const offs = n === 2 ? [-S * 0.1, S * 0.1] : [0];
      offs.forEach((off) => { const [x1, y1, x2, y2] = ends(b, off); s('line', { x1, y1, x2, y2 }, g); });
      return g;
    }
    function showHint(step) {
      clearHint();
      shown = { lo: (step.lo || []).slice(), no: (step.no || []).slice(), wrong: (step.wrong || []).slice(), els: {} };
      const fc = step.focus || {};
      (fc.isl || []).forEach((a) => s('circle', { cx: ix(a), cy: iy(a), r: R + 5, class: 'lp-hring why' }, hintG));
      (fc.bridges || []).forEach((b) => laneLine(b, 'lp-hlane'));
      shown.wrong.forEach((b) => { shown.els['w' + b] = laneLine(b, 'lp-hwrong'); });
      shown.lo.forEach(([b, n]) => { shown.els[b] = ghostBridge(b, n, 'lp-gbridge'); });
      shown.no.forEach((b) => { const g = s('g', { class: 'lp-gno' }, hintG); const [x1, y1, x2, y2] = ends(b, 0), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, k = S * 0.12; s('path', { d: 'M' + (mx - k) + ' ' + (my - k) + 'L' + (mx + k) + ' ' + (my + k) + 'M' + (mx + k) + ' ' + (my - k) + 'L' + (mx - k) + ' ' + (my + k) }, g); shown.els['n' + b] = g; });
    }
    function pruneHint() {
      shown.lo = shown.lo.filter(([b, n]) => { if (cnt[b] < n) return true; if (shown.els[b]) shown.els[b].remove(); return false; });
      shown.no = shown.no.filter((b) => { if (!no[b]) return true; if (shown.els['n' + b]) shown.els['n' + b].remove(); return false; });
      shown.wrong = shown.wrong.filter((b) => { if (wrongLane(b)) return true; if (shown.els['w' + b]) shown.els['w' + b].remove(); return false; });
      if (!shown.lo.length && !shown.no.length && !shown.wrong.length) clearHint();
    }
    const wrongLane = (b) => cnt[b] > m.sol[b] || (no[b] && m.sol[b] > 0);

    /* ---------- gestures ---------- */

    function islandAt(pt) {
      const c = Math.floor(pt[0] / S), r = Math.floor(pt[1] / S);
      if (c < 0 || r < 0 || c >= w || r >= h) return -1;
      const a = P.cellIsl[r * w + c];
      return a >= 0 && Math.hypot(pt[0] - ix(a), pt[1] - iy(a)) < S * 0.5 ? a : -1;
    }
    function laneAt(pt) {
      const c = Math.floor(pt[0] / S), r = Math.floor(pt[1] / S);
      if (c < 0 || r < 0 || c >= w || r >= h) return -1;
      let best = -1, bd = S * 0.34;
      for (const b of P.through[r * w + c]) {
        const B = P.B[b], dd = B.dir === 0 ? Math.abs(pt[1] - iy(B.a)) : Math.abs(pt[0] - ix(B.a));
        if (dd < bd || (dd < S * 0.34 && cnt[b] && !cnt[best])) { bd = dd; best = b; }
      }
      return best;
    }
    function act(b, right) {
      if (right) {
        if (cnt[b]) cnt[b] = 0; else no[b] = no[b] ? 0 : 1;
      } else {
        if (!cnt[b] && blockedLane(b)) {
          ctx.toast('That bridge would cross another one.');
          ctx.sfx('wrong');
          const els = P.cross[b].filter((x) => cnt[x]).map((x) => laneLine(x, 'lp-flash'));
          T.later(() => els.forEach((el) => el.remove()), 1200);
          return;
        }
        no[b] = 0;
        cnt[b] = (cnt[b] + 1) % 3;
      }
      ctx.sfx('snap');
      refresh();
      ctx.changed('bridges');
    }
    function preview(b) {
      while (prevG.firstChild) prevG.removeChild(prevG.firstChild);
      if (b < 0) return;
      const n = drag && (drag.right || (drag.touch && ui.tapNo)) ? 0 : (cnt[b] + 1) % 3;
      if (n) ghostBridgeIn(b, n); else { const [x1, y1, x2, y2] = ends(b, 0); s('line', { x1, y1, x2, y2, class: 'lp-prevno' }, prevG); }
    }
    function ghostBridgeIn(b, n) { (n === 2 ? [-S * 0.1, S * 0.1] : [0]).forEach((off) => { const [x1, y1, x2, y2] = ends(b, off); s('line', { x1, y1, x2, y2, class: 'lp-prev' }, prevG); }); }
    function showLanes(a) {
      if (a === hovA) return;
      hovA = a;
      while (laneG.firstChild) laneG.removeChild(laneG.firstChild);
      if (a < 0) return;
      for (const b of P.islB[a]) { if (cnt[b] || no[b]) continue; const [x1, y1, x2, y2] = ends(b, 0); s('line', { x1, y1, x2, y2, class: 'lp-lane' + (blockedLane(b) ? ' blocked' : '') }, laneG); }
    }

    wb.handlers.board = {
      down(pt, ev) {
        const right = ev.button === 2, touch = ev.pointerType === 'touch';
        const a = islandAt(pt), b = a < 0 ? laneAt(pt) : -1;
        // open water: a finger pans the view; a mouse just does nothing (no lasso over the board)
        if (a < 0 && b < 0) return ev.pointerType !== 'touch' && ev.button !== 2 && pt[0] > 0 && pt[1] > 0 && pt[0] < W && pt[1] < H;
        cur.on = false;
        drawCursor();
        drag = { a, b, right, touch, p0: pt, target: -1, moved: false };
        if (a >= 0) showLanes(a);
        if (touch) {
          const dg = drag;
          T.later(() => {
            if (drag !== dg || dg.moved) return;
            if (dg.b >= 0) { buzz(); act(dg.b, true); dg.done = true; }
            else { dg.right = true; buzz(); }
          }, 460);
        }
        return true;
      },
      move(pt) {
        if (!drag || drag.done) return;
        if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) > S * 0.15) drag.moved = true;
        if (drag.a < 0) return;
        const dx = pt[0] - ix(drag.a), dy = pt[1] - iy(drag.a);
        let t = -1;
        if (Math.hypot(dx, dy) > S * 0.45) t = P.islDir[drag.a * 4 + (Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0))];
        if (t !== drag.target) { drag.target = t; preview(t); }
      },
      up() {
        if (!drag) return;
        const dg = drag;
        drag = null;
        preview(-1);
        if (dg.done) return;
        const right = dg.right || (dg.touch && ui.tapNo);
        if (dg.a >= 0) {
          if (dg.target >= 0) act(dg.target, right);
          else if (!dg.moved && !tipShown) { tipShown = true; ctx.toast('Drag from an island towards a neighbour to lay a bridge.'); }
        } else if (dg.b >= 0 && !dg.moved) act(dg.b, right);
      },
      hover(pt) { showLanes(pt ? islandAt(pt) : -1); }
    };
    const svg = wb.svg;
    const onLeave = () => showLanes(-1);
    svg.addEventListener('pointerleave', onLeave);

    function drawCursor() {
      curEl.style.display = cur.on ? '' : 'none';
      curEl.setAttribute('cx', ix(cur.a));
      curEl.setAttribute('cy', iy(cur.a));
    }
    drawCursor();
    tapPanel(ctx, ['Bridge', 'No bridge'], 'Drag from island to island (again for a double bridge, a third time to take them up). Right-drag or long-press marks a lane as empty.', (on) => { ui.tapNo = on; });
    refresh();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() {
        const wrong = [];
        for (let b = 0; b < NB; b++) if (wrongLane(b)) wrong.push(b);
        if (wrong.length) {
          if (pending && pending.fix) {
            wrong.forEach((b) => { if (cnt[b] > m.sol[b]) cnt[b] = m.sol[b]; if (no[b] && m.sol[b]) no[b] = 0; });
            pending = null;
            clearHint();
            refresh();
            ctx.changed('hint');
            return 'I took away ' + (wrong.length === 1 ? 'the wrong mark' : 'the ' + wrong.length + ' wrong marks') + '. Carry on from here.';
          }
          pending = { fix: true };
          return { text: (wrong.length === 1 ? 'One of your bridges or marks is wrong' : wrong.length + ' of your bridges or marks are wrong') + ' (shown in red). Look again — or ask for another hint and I will take ' + (wrong.length === 1 ? 'it' : 'them') + ' away.', show() { showHint({ wrong }); } };
        }
        if (pending && (pending.lo || pending.no)) {
          const lo = pending.lo.filter(([b, n]) => cnt[b] < n), nn = pending.no.filter((b) => !no[b] && !cnt[b]);
          pending = null;
          if (lo.length || nn.length) {
            lo.forEach(([b, n]) => { cnt[b] = n; no[b] = 0; });
            nn.forEach((b) => { no[b] = 1; });
            clearHint();
            refresh();
            ctx.changed('hint');
            return { text: 'Done: ' + (lo.length ? 'I built ' + count(lo.length, 'bridge lane') : '') + (lo.length && nn.length ? ' and ' : '') + (nn.length ? 'marked ' + count(nn.length, 'lane') + ' empty' : '') + '.', show() { const els = lo.map(([b]) => laneLine(b, 'lp-flash')).concat(nn.map((b) => laneLine(b, 'lp-flash'))); T.later(() => els.forEach((el) => el.remove()), 1400); } };
          }
        }
        const step = L.hsStep(P, cnt, no, 4, m.sol);
        if (!step) {
          const r = evaluate();
          return r.solved ? 'It is solved already!' : 'Nothing is left to deduce: ' + r.msg;
        }
        pending = { lo: step.lo || [], no: step.no || [] };
        const n = (step.lo || []).length + (step.no || []).length;
        return { text: step.text + ' *(Another hint ' + (step.no && step.no.length && !(step.lo || []).length ? 'marks ' + (n === 1 ? 'it' : 'them') : 'builds ' + (n === 1 ? 'it' : 'them')) + ' for you.)*', show() { showHint(step); } };
      },
      solve() {
        clearHint();
        pending = null;
        no.fill(0);
        for (let b = 0; b < NB; b++) if (cnt[b] > m.sol[b]) cnt[b] = 0;
        // bridges in order of spreading out from the first island
        const order = [], seen = new Uint8Array(K), q = [0];
        seen[0] = 1;
        for (let t = 0; t < q.length; t++) for (const b of P.islB[q[t]]) { if (!m.sol[b] || order.includes(b)) continue; order.push(b); const o = P.B[b].a === q[t] ? P.B[b].b : P.B[b].a; if (!seen[o]) { seen[o] = 1; q.push(o); } }
        const todo = order.filter((b) => cnt[b] !== m.sol[b]);
        let k = 0;
        const tick = () => {
          if (k < todo.length) { cnt[todo[k]] = m.sol[todo[k]]; k++; }
          refresh();
          if (k < todo.length) T.later(tick, C.anim(60)); else ctx.changed('solve');
        };
        tick();
      },
      explain() { return explainGrade('hashi', L.hsGrade(P)); },
      getState() { return { c: Array.from(cnt).join(''), n: Array.from(no).join('') }; },
      setState(o) {
        if (!o || typeof o.c !== 'string' || o.c.length !== NB) return;
        for (let b = 0; b < NB; b++) { cnt[b] = Math.max(0, Math.min(2, +o.c[b] || 0)); no[b] = o.n && o.n[b] === '1' ? 1 : 0; }
        drag = null;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { pending = null; clearHint(); },
      key(ev) {
        const k = ev.key;
        if (k === 'x' || k === 'X') { xKey = ev.type === 'keydown'; return cur.on; }
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const dirs = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
        if (k in dirs) {
          const dd = dirs[k];
          if (!cur.on) { cur.on = true; drawCursor(); return true; }
          const b = P.islDir[cur.a * 4 + dd];
          if (ev.shiftKey || xKey) { if (b >= 0) act(b, xKey); return true; }
          if (b >= 0) cur.a = P.B[b].a === cur.a ? P.B[b].b : P.B[b].a;
          else {
            // the nearest island that way
            const I = P.isl[cur.a];
            let best = -1, bd = 1e9;
            P.isl.forEach((J, a) => {
              const dr = J.r - I.r, dc = J.c - I.c;
              const ahead = [-dr, dc, dr, -dc][dd];
              if (ahead <= 0) return;
              const side = dd % 2 ? Math.abs(dr) : Math.abs(dc);
              const score = ahead + 2 * side;
              if (score < bd) { bd = score; best = a; }
            });
            if (best >= 0) cur.a = best;
          }
          drawCursor();
          return true;
        }
        if (k === 'Escape' && cur.on) { cur.on = false; drawCursor(); }
        return false;
      },
      destroy() { T.clear(); svg.removeEventListener('pointerleave', onLeave); }
    };
  }

  /* =====================================================================
   *  NURIKABE
   * ===================================================================== */

  function mountNurikabe(ctx, p, m) {
    const wb = ctx.wb, L = LG(), s = ctx.s, P = m.P;
    const w = P.w, h = P.h, N = P.N, W = w * S, H = h * S;
    const st = new Int8Array(N);                   // 0 empty, 1 sea, 2 land (a dot)
    const ui = { tapLand: false };
    let won = false, pending = null, shown = null, drag = null, hovI = -1, lastSet = null;
    const T = timersFor();
    const cur = { r: 0, c: 0, on: false };
    const rowOf = (i) => Math.floor(i / w), colOf = (i) => i % w;
    const cx = (i) => colOf(i) * S, cy = (i) => rowOf(i) * S;

    ctx.setGoal(p.goal || GOALS.nurikabe);
    wb.setBounds({ x0: -S * 0.3, y0: -S * 0.3, x1: W + S * 0.3, y1: H + S * 0.3 }, 0.04);

    const G = s('g', { class: 'lp lp-nurikabe' }, wb.layer('board'));
    const bgG = s('g', null, G), cellG = s('g', null, G), hovG = s('g', { class: 'lp-nohit' }, G), markG = s('g', { class: 'lp-nohit' }, G);
    const errG = s('g', { class: 'lp-nohit' }, G), lineG = s('g', { class: 'lp-nohit' }, G), textG = s('g', { class: 'lp-nohit' }, G);
    const topG = s('g', { class: 'lp-nohit' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const curEl = s('rect', { width: S, height: S, rx: 4, class: 'lp-ccursor' }, topG);
    const badge = s('g', { class: 'lp-badge' }, topG);
    const badgeBg = s('rect', { rx: 9, width: 30, height: 24 }, badge);
    const badgeTx = s('text', { x: 15, y: 12.5 }, badge);
    badge.style.display = 'none';

    s('rect', { x: -4, y: -4, width: W + 8, height: H + 8, rx: 7, class: 'lp-boardbg' }, bgG);
    const cellEls = [], markEls = [], sig = new Array(N).fill('');
    for (let i = 0; i < N; i++) {
      cellEls.push(s('rect', { x: cx(i), y: cy(i), width: S, height: S, class: 'lp-ncell', 'data-key': 'c' + i }, cellG));
      markEls.push(s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')' }, markG));
    }
    let thin = '';
    for (let c = 1; c < w; c++) thin += 'M' + c * S + ' 0V' + H;
    for (let r = 1; r < h; r++) thin += 'M0 ' + r * S + 'H' + W;
    s('path', { d: thin, class: 'lp-ngrid' }, lineG);
    s('rect', { x: 0, y: 0, width: W, height: H, rx: 2, class: 'lp-nframe' }, lineG);
    const numEls = {};
    for (const i of P.nums) numEls[i] = s('text', { x: cx(i) + S / 2, y: cy(i) + S / 2 + 1, class: 'lp-nnum', text: String(P.num[i]) }, textG);
    const hovR = s('rect', { class: 'lp-hovband', height: S, width: W, x: 0 }, hovG), hovC = s('rect', { class: 'lp-hovband', width: S, height: H, y: 0 }, hovG);
    hovR.style.display = hovC.style.display = 'none';

    /* ---------- what the shading says ---------- */

    const nbs = (i) => { const a = []; for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0) a.push(j); } return a; };
    const isLand = (i) => st[i] === 2 || P.num[i] > 0;
    function flood(start, pass) {
      const seen = new Uint8Array(N), out = [start];
      seen[start] = 1;
      for (let t = 0; t < out.length; t++) for (const j of nbs(out[t])) if (!seen[j] && pass(j)) { seen[j] = 1; out.push(j); }
      return out;
    }
    let A = null;
    function analyse() {
      const pools = [];
      for (let r = 0; r + 1 < h; r++) for (let c = 0; c + 1 < w; c++) {
        const i = r * w + c;
        if (st[i] === 1 && st[i + 1] === 1 && st[i + w] === 1 && st[i + w + 1] === 1) pools.push(i);
      }
      const numState = {};
      let happy = 0;
      for (const i of P.nums) {
        const k = P.num[i];
        const land = flood(i, isLand);
        const others = land.filter((j) => j !== i && P.num[j]).length;
        const room = flood(i, (j) => st[j] !== 1);
        const roomNums = room.filter((j) => P.num[j]).length;
        let stt = '';
        if (others || land.length > k || room.length < k) stt = 'bad';
        else if (room.length === k && roomNums === 1) { stt = 'done'; happy++; }
        numState[i] = stt;
      }
      // sea cut off by land
      let seaTotal = 0;
      for (let i = 0; i < N; i++) if (st[i] === 1) seaTotal++;
      const cut = [];
      const seen = new Uint8Array(N);
      for (let i = 0; i < N; i++) {
        if (st[i] !== 1 || seen[i]) continue;
        const reach = flood(i, (j) => !isLand(j));
        const seaHere = flood(i, (j) => st[j] === 1);
        seaHere.forEach((j) => { seen[j] = 1; });
        if (reach.every((j) => st[j] === 1) && seaHere.length < seaTotal) seaHere.forEach((j) => cut.push(j));
      }
      A = { pools, numState, happy, cut, seaTotal };
      return A;
    }
    function seaVals() { const v = new Int8Array(N); for (let i = 0; i < N; i++) v[i] = st[i] === 1 ? 1 : 0; return v; }
    function evaluate() {
      const v = seaVals();
      if (L.nkValid(P, v)) return { solved: true, msg: solvedMsg('nurikabe', p) };
      const a = A || analyse();
      if (a.pools.length) return { solved: false, msg: 'The sea has a 2×2 pool — that is not allowed.' };
      // islands as they stand (every unshaded cell counts as land)
      const seen = new Uint8Array(N);
      let noNum = 0, twoNums = 0, wrongSize = 0;
      for (let i = 0; i < N; i++) {
        if (v[i] || seen[i]) continue;
        const isl = flood(i, (j) => !v[j]);
        isl.forEach((j) => { seen[j] = 1; });
        const nums = isl.filter((j) => P.num[j]);
        if (!nums.length) noNum++; else if (nums.length > 1) twoNums++; else if (isl.length !== P.num[nums[0]]) wrongSize++;
      }
      const seaParts = (() => { const sn = new Uint8Array(N); let k = 0; for (let i = 0; i < N; i++) if (v[i] && !sn[i]) { k++; flood(i, (j) => v[j] === 1).forEach((j) => { sn[j] = 1; }); } return k; })();
      if (twoNums) return { solved: false, msg: 'Two numbers share one island (reading every unshaded cell as land).' };
      if (noNum) return { solved: false, msg: 'Some unshaded land belongs to no number: shade more of the sea.' };
      if (wrongSize) return { solved: false, msg: count(wrongSize, 'island is', 'islands are') + ' not the size of ' + (wrongSize === 1 ? 'its number' : 'their numbers') + '.' };
      if (seaParts > 1) return { solved: false, msg: 'The sea is in ' + seaParts + ' pieces; it must be all one.' };
      return { solved: false, msg: 'Not yet.' };
    }

    function glyph(g, i, x) {
      if (x === 1) {
        s('rect', { x: 0.5, y: 0.5, width: S - 1, height: S - 1, class: 'lp-sea' }, g);
        s('path', { d: 'M' + S * 0.24 + ' ' + S * 0.56 + 'q' + S * 0.065 + ' -' + S * 0.09 + ' ' + S * 0.13 + ' 0t' + S * 0.13 + ' 0t' + S * 0.13 + ' 0t' + S * 0.13 + ' 0', class: 'lp-wave' }, g);
      } else if (x === 2) s('circle', { cx: S / 2, cy: S / 2, r: 3.4, class: 'lp-land' }, g);
    }
    function refresh() {
      const a = analyse();
      for (let i = 0; i < N; i++) {
        const key = String(st[i]);
        if (sig[i] === key) continue;
        sig[i] = key;
        const g = markEls[i];
        while (g.firstChild) g.removeChild(g.firstChild);
        glyph(g, i, st[i]);
      }
      for (const i of P.nums) {
        numEls[i].classList.toggle('bad', a.numState[i] === 'bad');
        numEls[i].classList.toggle('done', a.numState[i] === 'done');
      }
      while (errG.firstChild) errG.removeChild(errG.firstChild);
      a.pools.forEach((i) => s('rect', { x: cx(i) + 2, y: cy(i) + 2, width: 2 * S - 4, height: 2 * S - 4, rx: 6, class: 'lp-pool' }, errG));
      a.cut.forEach((i) => s('rect', { x: cx(i) + 1, y: cy(i) + 1, width: S - 2, height: S - 2, class: 'lp-cut' }, errG));
      ctx.stat('Sea', a.seaTotal + ' of ' + P.totalBlack);
      if (shown) pruneHint();
      if (won && !evaluate().solved) setWon(false);
    }
    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
      cellEls.forEach((el, i) => { el.classList.toggle('sand', on && st[i] !== 1); if (on) el.style.animationDelay = (0.03 * (rowOf(i) + colOf(i))).toFixed(2) + 's'; });
    }

    /* ---------- hints ---------- */

    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    function showHint(step) {
      clearHint();
      shown = { set: (step.set || []).slice(), wrong: (step.wrong || []).slice(), els: {} };
      ((step.focus && step.focus.cells) || []).forEach((i) => s('rect', { x: cx(i) + 1, y: cy(i) + 1, width: S - 2, height: S - 2, rx: 4, class: 'lp-hzone' }, hintG));
      (step.ghost || []).forEach(([i, x]) => { if (step.set.some(([j]) => j === i)) return; const g = s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')', class: 'lp-ghostcell' }, hintG); glyph(g, i, x === 1 ? 1 : 2); });
      ((step.bad && step.bad.cells) || []).forEach((i) => s('rect', { x: cx(i) + 3, y: cy(i) + 3, width: S - 6, height: S - 6, rx: 5, class: 'lp-hbad' }, hintG));
      shown.wrong.forEach((i) => { shown.els['w' + i] = s('rect', { x: cx(i) + 2.5, y: cy(i) + 2.5, width: S - 5, height: S - 5, rx: 5, class: 'lp-hwrongc' }, hintG); });
      shown.set.forEach(([i, x]) => {
        const g = s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')', class: 'lp-gcell' }, hintG);
        s('rect', { x: 2.5, y: 2.5, width: S - 5, height: S - 5, rx: 5, class: 'lp-gbox' }, g);
        glyph(g, i, x === 1 ? 1 : 2);
        shown.els[i] = g;
      });
    }
    const target = (x) => (x === 1 ? 1 : 2);
    function pruneHint() {
      shown.set = shown.set.filter(([i, x]) => { if (st[i] !== target(x)) return true; if (shown.els[i]) shown.els[i].remove(); return false; });
      shown.wrong = shown.wrong.filter((i) => { if (wrongCell(i)) return true; if (shown.els['w' + i]) shown.els['w' + i].remove(); return false; });
      if (!shown.set.length && !shown.wrong.length) clearHint();
    }
    const wrongCell = (i) => (st[i] === 1 && !m.sol[i]) || (st[i] === 2 && m.sol[i] === 1);
    function flash(cells) {
      const els = cells.map((i) => s('rect', { x: cx(i) + 1, y: cy(i) + 1, width: S - 2, height: S - 2, rx: 5, class: 'lp-cflash' }, hintG));
      T.later(() => els.forEach((e) => e.remove()), 1400);
    }

    /* ---------- gestures ---------- */

    function cellAt(pt) {
      const c = Math.floor(pt[0] / S), r = Math.floor(pt[1] / S);
      return c >= 0 && c < w && r >= 0 && r < h ? r * w + c : -1;
    }
    const nextState = (s0, mark) => (mark ? (s0 === 2 ? 0 : 2) : (s0 === 1 ? 0 : 1));
    function startDrag(i, mark) {
      cur.on = false; cur.r = rowOf(i); cur.c = colOf(i);
      drawCursor();
      if (P.num[i]) { drag = null; return; }
      const from = st[i], to = nextState(from, mark);
      drag = { a: i, from, to, axis: null, orig: st.slice(), line: [i] };
      st[i] = to;
      lastSet = to;
      ctx.sfx('tap');
      refresh();
    }
    function moveDrag(pt) {
      if (!drag) return;
      const ar = rowOf(drag.a), ac = colOf(drag.a);
      const c = Math.max(0, Math.min(w - 1, Math.floor(pt[0] / S))), r = Math.max(0, Math.min(h - 1, Math.floor(pt[1] / S)));
      if (r === ar && c === ac) drag.axis = null;
      else if (!drag.axis) drag.axis = Math.abs(c - ac) >= Math.abs(r - ar) ? 'h' : 'v';
      const line = [];
      if (!drag.axis) line.push(drag.a);
      else if (drag.axis === 'h') for (let k = Math.min(ac, c); k <= Math.max(ac, c); k++) line.push(ar * w + k);
      else for (let k = Math.min(ar, r); k <= Math.max(ar, r); k++) line.push(k * w + ac);
      let changed = false;
      drag.line.forEach((j) => { if (!line.includes(j) && st[j] !== drag.orig[j]) { st[j] = drag.orig[j]; changed = true; } });
      line.forEach((j) => { if (!P.num[j] && drag.orig[j] === drag.from && st[j] !== drag.to) { st[j] = drag.to; changed = true; } });
      drag.line = line;
      if (changed) refresh();
      if (line.length > 1) {
        const k = wb.px(1);
        badge.style.display = '';
        badge.setAttribute('transform', 'translate(' + (pt[0] + 16 * k) + ' ' + (pt[1] - 36 * k) + ') scale(' + k + ')');
        badgeTx.textContent = String(line.length);
      } else badge.style.display = 'none';
    }
    function endDrag() {
      if (!drag) return;
      const changed = st.some((x, i) => x !== drag.orig[i]);
      drag = null;
      badge.style.display = 'none';
      if (changed) ctx.changed('cells');
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = cellAt(pt);
        if (i < 0) return false;
        const mark = (ev.button === 2) !== ui.tapLand;
        startDrag(i, mark);
        if (ev.pointerType === 'touch' && drag) {
          // a long press does the other thing (a dot instead of sea, or the other way round)
          const dg = drag;
          T.later(() => {
            if (drag !== dg || dg.axis) return;
            dg.to = nextState(dg.from, !mark);
            st[dg.a] = dg.to;
            lastSet = dg.to;
            buzz();
            refresh();
          }, 460);
        }
        return true;
      },
      move(pt) { moveDrag(pt); },
      up() { endDrag(); },
      hover(pt) { hover(pt); }
    };
    function hover(pt) {
      const i = pt ? cellAt(pt) : -1;
      if (i === hovI) return;
      hovI = i;
      hovR.style.display = hovC.style.display = i < 0 ? 'none' : '';
      if (i < 0) return;
      hovR.setAttribute('y', cy(i));
      hovC.setAttribute('x', cx(i));
    }
    const svg = wb.svg;
    const onLeave = () => hover(null);
    svg.addEventListener('pointerleave', onLeave);
    function drawCursor() {
      curEl.style.display = cur.on ? '' : 'none';
      curEl.setAttribute('x', cur.c * S);
      curEl.setAttribute('y', cur.r * S);
    }
    drawCursor();
    tapPanel(ctx, ['Sea', 'Land'], 'Right-click puts a dot (land). Drag along a row or column to do a whole run.', (on) => { ui.tapLand = on; });
    refresh();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() {
        const wrong = [];
        for (let i = 0; i < N; i++) if (wrongCell(i)) wrong.push(i);
        if (wrong.length) {
          if (pending && pending.fix) {
            wrong.forEach((i) => { st[i] = 0; });
            pending = null;
            clearHint();
            refresh();
            ctx.changed('hint');
            return 'I rubbed out ' + (wrong.length === 1 ? 'the wrong mark' : 'the ' + wrong.length + ' wrong marks') + '. Carry on from here.';
          }
          pending = { fix: true };
          return { text: (wrong.length === 1 ? 'One of your marks is wrong' : wrong.length + ' of your marks are wrong') + ' (outlined in red). Look again — or ask for another hint and I will rub ' + (wrong.length === 1 ? 'it' : 'them') + ' out.', show() { showHint({ set: [], wrong }); } };
        }
        if (pending && pending.set) {
          const todo = pending.set.filter(([i, x]) => st[i] !== target(x));
          pending = null;
          if (todo.length) {
            todo.forEach(([i, x]) => { st[i] = target(x); });
            clearHint();
            refresh();
            ctx.changed('hint');
            const sea = todo.filter((x) => x[1] === 1).length, land = todo.length - sea;
            return { text: 'Done: I marked ' + [sea ? count(sea, 'sea cell') : null, land ? count(land, 'land cell') : null].filter(Boolean).join(' and ') + ' from the last hint.', show() { flash(todo.map((x) => x[0])); } };
          }
        }
        const v = new Int8Array(N);
        for (let i = 0; i < N; i++) v[i] = P.num[i] ? 0 : st[i] === 1 ? 1 : st[i] === 2 ? 0 : -1;
        const step = L.nkStep(P, v, 4, m.sol);
        if (!step) {
          const r = evaluate();
          return r.solved ? 'It is solved already!' : 'Nothing is left to deduce: ' + r.msg;
        }
        pending = { set: step.set };
        return { text: step.text + ' *(Another hint marks ' + (step.set.length === 1 ? 'it' : 'them') + ' for you.)*', show() { showHint(step); } };
      },
      solve() {
        clearHint();
        pending = null;
        const order = [];
        for (let i = 0; i < N; i++) if (!P.num[i]) order.push(i);
        order.sort((a, b) => (rowOf(a) + colOf(a)) - (rowOf(b) + colOf(b)) || a - b);
        const per = Math.max(1, Math.ceil(order.length / 22));
        let k = 0;
        const tick = () => {
          for (let t = 0; t < per && k < order.length; t++, k++) st[order[k]] = m.sol[order[k]] ? 1 : 0;
          refresh();
          if (k < order.length) T.later(tick, C.anim(32)); else ctx.changed('solve');
        };
        tick();
      },
      explain() { return explainGrade('nurikabe', L.nkGrade(P)); },
      getState() { return { s: Array.from(st).join('') }; },
      setState(o) {
        if (!o || typeof o.s !== 'string' || o.s.length !== N) return;
        for (let i = 0; i < N; i++) st[i] = P.num[i] ? 0 : Math.max(0, Math.min(2, +o.s[i] || 0));
        drag = null;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { pending = null; clearHint(); },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return cur.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        if (dirs[k]) {
          if (!cur.on) { cur.on = true; drawCursor(); return true; }
          cur.r = Math.max(0, Math.min(h - 1, cur.r + dirs[k][0]));
          cur.c = Math.max(0, Math.min(w - 1, cur.c + dirs[k][1]));
          drawCursor();
          const i = cur.r * w + cur.c;
          if (ev.shiftKey && lastSet != null && !P.num[i] && st[i] !== lastSet) { st[i] = lastSet; refresh(); ctx.changed('cells'); }
          return true;
        }
        if (!cur.on) return false;
        const i = cur.r * w + cur.c;
        const set = (x) => { if (!P.num[i] && st[i] !== x) { st[i] = x; lastSet = x; ctx.sfx('tap'); refresh(); ctx.changed('cells'); } };
        if (k === 'Enter') { set(nextState(st[i], false)); return true; }
        if (k === ' ' || k === '.') { set(nextState(st[i], true)); return true; }
        if (k === 'Backspace' || k === 'Delete') { set(0); return true; }
        if (k === 'Escape') { cur.on = false; drawCursor(); }
        return false;
      },
      destroy() { T.clear(); svg.removeEventListener('pointerleave', onLeave); }
    };
  }

  /* =====================================================================
   *  KAKURO
   * ===================================================================== */

  function mountKakuro(ctx, p, m) {
    const wb = ctx.wb, L = LG(), s = ctx.s, P = m.P, hh = ctx.h;
    const w = P.w, h = P.h, N = P.N, KS = 54, W = w * KS, H = h * KS;
    const white = P.white;
    let vals = new Int8Array(N), marks = new Int16Array(N);
    let sel = [], cur = -1, pencil = false, busy = false, dead = false, dragging = false;
    let lastHint = null, won = false, timer = null;
    const hintEls = [];
    const opts = Object.assign({ light: true, combos: true }, C.store.get('kakuro-opts', {}) || {});
    const bit = (d) => 1 << (d - 1);
    const X = (i) => (i % w) * KS, Y = (i) => Math.floor(i / w) * KS;

    ctx.setGoal(p.goal || GOALS.kakuro);
    const narrow = !!(root.matchMedia && root.matchMedia('(max-width: 980px)').matches);
    wb.setBounds({ x0: -10, y0: -10, x1: W + 10, y1: H + 10 + (narrow ? 0 : 30) }, 0.04);

    const G = s('g', { class: 'lp lp-kakuro' }, wb.layer('board'));
    const cellG = s('g', null, G), hlG = s('g', { class: 'lp-nohit' }, G), lineG = s('g', { class: 'lp-nohit' }, G), textG = s('g', { class: 'lp-nohit' }, G);
    const topL = wb.layer('top');
    const cursorEl = s('rect', { width: KS - 5, height: KS - 5, rx: 4, class: 'lp-kcursor' }, G);
    const E = [];
    for (let i = 0; i < N; i++) {
      const x = X(i), y = Y(i);
      if (!white[i]) {
        s('rect', { x, y, width: KS, height: KS, class: 'lp-kblock' }, cellG);
        const cl = P.clueAt[i];
        E.push(null);
        if (!cl) continue;
        s('path', { d: 'M' + (x + 2) + ' ' + (y + 2) + 'L' + (x + KS - 2) + ' ' + (y + KS - 2), class: 'lp-kdiag' }, lineG);
        continue;
      }
      const rect = s('rect', { x, y, width: KS, height: KS, class: 'lp-kcell', 'data-key': 'c' + i }, cellG);
      const hl = s('rect', { x, y, width: KS, height: KS, class: 'lp-khl' }, hlG);
      const num = s('text', { x: x + KS / 2, y: y + KS * 0.54, class: 'lp-kdig' }, textG);
      const mk = [];
      for (let d = 1; d <= 9; d++) {
        const t = s('text', { x: x + KS * (0.2 + 0.3 * ((d - 1) % 3)), y: y + KS * (0.21 + 0.3 * Math.floor((d - 1) / 3)), class: 'lp-kmark', text: String(d) }, textG);
        t.style.display = 'none';
        mk.push(t);
      }
      E.push({ rect, hl, num, mk, hc: '', txt: '', nc: '', mkey: -1 });
    }
    let grid = '';
    for (let c = 1; c < w; c++) grid += 'M' + c * KS + ' 0V' + H;
    for (let r = 1; r < h; r++) grid += 'M0 ' + r * KS + 'H' + W;
    s('path', { d: grid, class: 'lp-kgrid' }, lineG);
    s('rect', { x: 0, y: 0, width: W, height: H, class: 'lp-kframe' }, lineG);
    // the totals: across above the diagonal (top right), down below it (bottom left)
    const runEls = P.runs.map((R) => {
      const i = R.clue, x = X(i), y = Y(i);
      return s('text', R.dir === 0 ? { x: x + KS * 0.7, y: y + KS * 0.3, class: 'lp-ksum', text: String(R.sum) } : { x: x + KS * 0.3, y: y + KS * 0.72, class: 'lp-ksum', text: String(R.sum) }, textG);
    });

    /* the panel: number pad, pencil, notes, combinations */
    const btn = (label, title, fn, cls) => {
      const b = hh('button.lp-b' + (cls ? '.' + cls : ''), { type: 'button', tabindex: '-1', title, 'aria-label': title });
      b.innerHTML = label;
      b.addEventListener('mousedown', (e) => e.preventDefault());
      b.addEventListener('click', (e) => { e.preventDefault(); fn(); });
      return b;
    };
    const keys = [];
    const keysEl = hh('div.lp-keys');
    for (let d = 1; d <= 9; d++) { const b = btn('<b>' + d + '</b>', 'Digit ' + d + ' (Shift+' + d + ' for a pencil mark)', () => input(d, false), 'lp-key'); keys.push(b); keysEl.appendChild(b); }
    const penBtn = btn(C.icon('pen') + '<span>Pencil</span>', 'Pencil marks on / off (Space)', () => togglePencil(), 'lp-pen');
    const optBtns = {};
    const opt = (key, label, title) => { optBtns[key] = btn('<i></i><span>' + label + '</span>', title, () => { opts[key] = !opts[key]; C.store.set('kakuro-opts', opts); draw(); }, 'lp-opt'); return optBtns[key]; };
    const comboEl = hh('div.lp-combos');
    ctx.panel.appendChild(hh('div.lp-kpanel', keysEl,
      hh('div.lp-row', penBtn, btn(C.icon('eraser') + '<span>Erase</span>', 'Rub out the selected cells (Backspace)', () => erase()), btn('<span>Fill notes</span>', 'Pencil in every digit the totals and the digits placed still allow', () => fillNotes()), btn('<span>Clear notes</span>', 'Rub out the pencil marks (of the selected cells, or all of them)', () => clearNotes())),
      hh('div.lp-row.lp-opts', opt('light', 'Highlight', 'Light up the runs of the selected cell and every copy of its digit'), opt('combos', 'Combinations', 'Show every way to make the runs through the selected cell')),
      comboEl));

    // a strip of keys under the grid on phones
    const strip = narrow ? (() => {
      const count2 = 11, gap = 5, kw = (W - gap * (count2 - 1)) / count2, kh = Math.min(56, kw * 1.15), y0 = H + 14;
      const gS = s('g', { class: 'lp-strip' }, G), out = [];
      for (let k = 0; k < count2; k++) {
        const x = k * (kw + gap), g = s('g', { class: 'lp-skey' }, gS);
        s('rect', { x, y: y0, width: kw, height: kh, rx: 9 }, g);
        s('text', { x: x + kw / 2, y: y0 + kh / 2, 'font-size': Math.min(26, kh * 0.5), text: k < 9 ? String(k + 1) : k === 9 ? '✎' : '⌫' }, g);
        out.push({ g, x, act: k < 9 ? k + 1 : k === 9 ? 'pen' : 'erase' });
      }
      wb.setBounds({ x0: -10, y0: -52, x1: W + 10, y1: y0 + kh + 8 }, 0.03);
      return { keys: out, at(pt) { if (pt[1] < y0 || pt[1] > y0 + kh) return null; const k = out.find((q) => pt[0] >= q.x && pt[0] <= q.x + kw); return k ? k.act : null; } };
    })() : null;

    /* ---------- drawing ---------- */

    function runStatus(k) {
      const R = P.runs[k];
      let sum = 0, filled = 0, seen = 0, dup = false;
      for (const x of R.cells) { const v = vals[x]; if (!v) continue; filled++; sum += v; if (seen & bit(v)) dup = true; seen |= bit(v); }
      const left = R.cells.length - filled;
      // the smallest and largest the empty cells could still add
      let lo = 0, hi = 0, t = 0;
      for (let d = 1; d <= 9 && t < left; d++) if (!(seen & bit(d))) { lo += d; t++; }
      t = 0;
      for (let d = 9; d >= 1 && t < left; d--) if (!(seen & bit(d))) { hi += d; t++; }
      const bad = dup || sum + lo > R.sum || sum + hi < R.sum;
      return { done: !left && !bad && sum === R.sum, bad: bad || (!left && sum !== R.sum), dup, seen };
    }
    function draw() {
      const bad = new Uint8Array(N);
      const status = P.runs.map((R, k) => runStatus(k));
      status.forEach((q, k) => {
        runEls[k].setAttribute('class', 'lp-ksum' + (q.bad ? ' bad' : q.done ? ' done' : ''));
        if (q.dup) {
          const R = P.runs[k], by = {};
          R.cells.forEach((x) => { if (vals[x]) (by[vals[x]] = by[vals[x]] || []).push(x); });
          Object.values(by).forEach((xs) => { if (xs.length > 1) xs.forEach((x) => { bad[x] = 1; }); });
        }
      });
      const selSet = new Set(sel), curV = cur >= 0 ? vals[cur] : 0;
      const near = new Uint8Array(N);
      if (opts.light && cur >= 0) for (const k of [P.runOf[cur * 2], P.runOf[cur * 2 + 1]]) if (k >= 0) P.runs[k].cells.forEach((x) => { near[x] = 1; });
      for (const i of P.whites) {
        const e = E[i], v = vals[i], on = selSet.has(i);
        const hc = 'lp-khl' + (on ? (pencil ? ' sel pen' : ' sel') : '') + (!on && opts.light && curV && v === curV ? ' same' : '') + (!on && near[i] ? ' near' : '') + (bad[i] ? ' bad' : '');
        if (e.hc !== hc) { e.hl.setAttribute('class', hc); e.hc = hc; }
        const txt = v ? String(v) : '';
        if (e.txt !== txt) { e.num.textContent = txt; e.txt = txt; }
        const nc = 'lp-kdig' + (bad[i] ? ' bad' : '');
        if (e.nc !== nc) { e.num.setAttribute('class', nc); e.nc = nc; }
        const mm = v ? 0 : marks[i], hiV = opts.light ? curV : 0, mkey = mm * 16 + hiV;
        if (e.mkey !== mkey) {
          e.mkey = mkey;
          for (let d = 1; d <= 9; d++) { const t = e.mk[d - 1], show = !!(mm & bit(d)); t.style.display = show ? '' : 'none'; if (show) t.setAttribute('class', 'lp-kmark' + (hiV === d ? ' hi' : '')); }
        }
      }
      if (cur >= 0) { cursorEl.style.display = ''; cursorEl.setAttribute('x', X(cur) + 2.5); cursorEl.setAttribute('y', Y(cur) + 2.5); cursorEl.setAttribute('class', 'lp-kcursor' + (pencil ? ' pen' : '')); } else cursorEl.style.display = 'none';
      keys.forEach((b, k) => b.classList.toggle('on', !!curV && curV === k + 1));
      penBtn.classList.toggle('on', pencil);
      for (const k in optBtns) optBtns[k].classList.toggle('on', !!opts[k]);
      if (strip) strip.keys.forEach((q) => q.g.setAttribute('class', 'lp-skey' + (q.act === 'pen' && pencil ? ' on' : '') + (typeof q.act === 'number' && curV === q.act ? ' cur' : '')));
      let empty = 0;
      for (const i of P.whites) if (!vals[i]) empty++;
      ctx.stat('Empty', empty);
      drawCombos();
    }
    function drawCombos() {
      comboEl.innerHTML = '';
      comboEl.style.display = opts.combos ? '' : 'none';
      if (!opts.combos) return;
      if (cur < 0 || !white[cur]) { comboEl.appendChild(hh('div.lp-ctip', 'Select a cell to see the ways to make its two runs.')); return; }
      for (const k of [P.runOf[cur * 2], P.runOf[cur * 2 + 1]]) {
        if (k < 0) continue;
        const R = P.runs[k];
        let placed = 0;
        R.cells.forEach((x) => { if (vals[x]) placed |= bit(vals[x]); });
        const list = hh('div.lp-clist');
        R.combos.forEach((mask) => { list.appendChild(hh('span.lp-combo' + ((mask & placed) === placed ? '' : '.out'), L.kkComboText(mask).replace(/\+/g, ' '))); });
        comboEl.appendChild(hh('div.lp-crun', hh('div.lp-chead', hh('b', (R.dir ? 'Down ' : 'Across ') + R.sum), ' in ' + R.cells.length + ' · ' + R.combos.length + (R.combos.length === 1 ? ' way' : ' ways')), list));
      }
    }

    /* ---------- choosing and writing ---------- */

    function cellAt(pt) {
      const c = Math.floor(pt[0] / KS), r = Math.floor(pt[1] / KS);
      if (c < 0 || r < 0 || c >= w || r >= h) return -1;
      return r * w + c;
    }
    function pick(i, add) {
      if (add) {
        const at = sel.indexOf(i);
        if (at >= 0 && sel.length > 1) { sel.splice(at, 1); cur = sel[sel.length - 1]; } else if (at < 0) { sel.push(i); cur = i; }
      } else { sel = [i]; cur = i; }
      clearHint();
      draw();
    }
    wb.handlers.board = {
      down(pt, ev) {
        const sk = strip && strip.at(pt);
        if (sk) { if (sk === 'pen') togglePencil(); else if (sk === 'erase') erase(); else input(sk, false); return true; }
        const i = cellAt(pt);
        if (i < 0 || !white[i]) { if (sel.length) { sel = []; cur = -1; draw(); } return i >= 0; }
        pick(i, ev.shiftKey || ev.ctrlKey || ev.metaKey);
        dragging = true;
        return true;
      },
      move(pt) {
        if (!dragging) return;
        const i = cellAt(pt);
        if (i >= 0 && white[i] && sel.indexOf(i) < 0) { sel.push(i); cur = i; draw(); }
      },
      up() { dragging = false; }
    };
    function commit(why) { clearHint(); draw(); ctx.changed(why); }
    function tidyAround(i, v) { for (const k of [P.runOf[i * 2], P.runOf[i * 2 + 1]]) if (k >= 0) P.runs[k].cells.forEach((x) => { marks[x] &= ~bit(v); }); }
    function input(v, asMark) {
      if (busy) return;
      if (!sel.length) { ctx.toast('Pick a cell first: click one, or use the arrow keys.'); return; }
      if (asMark || pencil || sel.length > 1) {
        const open = sel.filter((i) => !vals[i]);
        if (!open.length) { ctx.say('Pencil marks go in empty cells: rub out the digit first.'); return; }
        const all = open.every((i) => marks[i] & bit(v));
        open.forEach((i) => { if (all) marks[i] &= ~bit(v); else marks[i] |= bit(v); });
        commit('pencil');
        return;
      }
      const i = sel[0];
      if (vals[i] === v) vals[i] = 0; else { vals[i] = v; tidyAround(i, v); }
      ctx.sfx('tap');
      commit('digit');
    }
    function erase() {
      if (busy || !sel.length) return;
      if (sel.some((i) => vals[i])) sel.forEach((i) => { vals[i] = 0; });
      else if (sel.some((i) => marks[i])) sel.forEach((i) => { marks[i] = 0; });
      else return;
      commit('erase');
    }
    // every digit the totals still allow, given the digits in place (the simple way: each run on its own)
    function fillNotes() {
      if (busy) return;
      let any = false;
      for (const i of P.whites) {
        if (vals[i]) continue;
        let mm = 511;
        for (const k of [P.runOf[i * 2], P.runOf[i * 2 + 1]]) {
          if (k < 0) continue;
          const R = P.runs[k];
          let placed = 0;
          R.cells.forEach((x) => { if (vals[x]) placed |= bit(vals[x]); });
          let U = 0;
          R.combos.forEach((c) => { if ((c & placed) === placed) U |= c; });
          mm &= U & ~placed;
        }
        if (marks[i] !== mm) { marks[i] = mm; any = true; }
      }
      if (any) commit('notes'); else ctx.say('Your notes already hold every candidate.');
    }
    function clearNotes() {
      if (busy) return;
      const cells = sel.length > 1 ? sel : P.whites;
      if (!cells.some((i) => marks[i])) return;
      cells.forEach((i) => { marks[i] = 0; });
      commit('notes');
    }
    function togglePencil() { pencil = !pencil; ctx.toast(pencil ? 'Pencil marks: small digits' : 'Big digits'); draw(); }
    function moveCursor(dr, dc, extend) {
      if (cur < 0) { pick(P.whites[0], false); return; }
      let r = Math.floor(cur / w), c = cur % w;
      for (let t = 0; t < Math.max(w, h); t++) {
        r = (r + dr + h) % h; c = (c + dc + w) % w;
        const i = r * w + c;
        if (!white[i]) continue;
        if (!extend) { pick(i, false); return; }
        if (sel.indexOf(i) < 0) sel.push(i);
        cur = i;
        clearHint();
        draw();
        return;
      }
    }

    /* ---------- checking, hints ---------- */

    function evaluate() {
      let empty = 0, dup = 0, wrong = 0;
      for (const i of P.whites) if (!vals[i]) empty++;
      P.runs.forEach((R, k) => { const q = runStatus(k); if (q.dup) dup++; else if (q.bad) wrong++; });
      if (!empty && !dup && !wrong && L.kkValid(P, vals)) return { solved: true, msg: solvedMsg('kakuro', p) };
      if (dup) return { solved: false, msg: count(dup, 'run has', 'runs have') + ' a digit twice.' };
      if (wrong) return { solved: false, msg: count(wrong, 'total does', 'totals do') + ' not add up.' };
      return { solved: false, msg: empty === 1 ? 'One cell is still empty.' : empty + ' cells are still empty.' };
    }
    function clearHint() { hintEls.forEach((el) => el.remove()); hintEls.length = 0; }
    function markCells(cells, cls) { cells.forEach((i) => hintEls.push(s('rect', { x: X(i) + 2, y: Y(i) + 2, width: KS - 4, height: KS - 4, rx: 4, class: 'lp-khint ' + cls }, topL))); }
    function showStep(step) {
      clearHint();
      const runs = ((step.focus && step.focus.runs) || []).filter((k) => k >= 0);
      runs.forEach((k) => markCells(P.runs[k].cells.filter((x) => x !== step.cell), 'area'));
      runs.forEach((k) => hintEls.push(s('circle', { cx: X(P.runs[k].clue) + KS * (P.runs[k].dir ? 0.3 : 0.7), cy: Y(P.runs[k].clue) + KS * (P.runs[k].dir ? 0.72 : 0.3), r: KS * 0.2, class: 'lp-khint sum' }, topL)));
      if (step.cell != null) markCells([step.cell], 'target');
    }
    function hint() {
      if (busy) return null;
      const probs = [];
      P.runs.forEach((R, k) => { const q = runStatus(k); if (q.dup) probs.push(k); });
      if (probs.length) {
        const k = probs[0];
        return { text: 'There is a digit twice in ' + L.kkRunName(P, k) + ' — sort that out first (undo is on Ctrl+Z).', show() { clearHint(); markCells(P.runs[k].cells, 'area'); } };
      }
      const wrong = P.whites.filter((i) => vals[i] && vals[i] !== m.sol[i]);
      if (wrong.length) {
        const i = wrong[0];
        return { text: 'No clash yet, but the **' + vals[i] + '** at ' + L.cellName(i, w) + ' is not right' + (wrong.length > 1 ? ' (and ' + C.plural(wrong.length - 1, 'other digit') + ' too)' : '') + '. Rub it out and look again.', show() { pick(i, false); markCells([i], 'target'); } };
      }
      if (lastHint && !vals[lastHint.i]) {
        const { i, v } = lastHint;
        lastHint = null;
        vals[i] = v;
        tidyAround(i, v);
        sel = [i]; cur = i;
        commit('hint');
        return { text: 'Written in: **' + v + '** at ' + L.cellName(i, w) + '.', show() { markCells([i], 'target'); } };
      }
      if (P.whites.every((i) => vals[i])) return 'Every cell is filled. Press Check!';
      const step = L.kkStep(P, vals, 4, m.sol);
      if (!step) return 'Nothing is left to deduce from here.';
      lastHint = { i: step.cell, v: step.d };
      return { text: step.text + ' *Ask again and I will write it in.*', show() { sel = [step.cell]; cur = step.cell; draw(); showStep(step); } };
    }
    function solve() {
      if (busy) return;
      const todo = P.whites.filter((i) => vals[i] !== m.sol[i]);
      clearHint();
      lastHint = null;
      if (!todo.length) { ctx.changed('solve'); return; }
      busy = true;
      const waves = {};
      todo.forEach((i) => { const k = Math.floor(i / w) + (i % w); (waves[k] = waves[k] || []).push(i); });
      const order = Object.keys(waves).map(Number).sort((a, b) => a - b);
      let k = 0;
      const step = () => {
        if (dead) return;
        waves[order[k++]].forEach((i) => { vals[i] = m.sol[i]; });
        draw();
        if (k < order.length) timer = setTimeout(step, C.anim(55));
        else { busy = false; timer = null; ctx.changed('solve'); }
      };
      step();
    }
    function setWon(on) {
      if (on === won) return;
      won = on;
      G.classList.toggle('won', on);
    }

    draw();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        setWon(r.solved);
        return r;
      },
      hint,
      solve,
      explain() {
        const g = L.kkGrade(P);
        return 'This grid can be finished by reasoning alone' + (g.top >= 3 ? ', though a few steps need a "suppose this cell were…" check' : g.top === 2 ? ', weighing up which combinations of each run can really be placed' : ', reading off the combinations each total allows') + '.';
      },
      getState() {
        const mm = Array.from(marks);
        while (mm.length && !mm[mm.length - 1]) mm.pop();
        return { v: Array.from(vals).join(''), m: mm };
      },
      setState(o) {
        if (!o) return;
        if (timer) { clearTimeout(timer); timer = null; busy = false; }
        vals = new Int8Array(N);
        if (typeof o.v === 'string' && o.v.length === N) for (let i = 0; i < N; i++) vals[i] = white[i] ? +o.v[i] || 0 : 0;
        marks = new Int16Array(N);
        (o.m || []).forEach((x, i) => { if (i < N) marks[i] = x; });
        lastHint = null;
        clearHint();
        draw();
        setWon(evaluate().solved);
      },
      reset() { sel = []; cur = -1; pencil = false; lastHint = null; clearHint(); draw(); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        const mm = /^(?:Digit|Numpad)([0-9])$/.exec(ev.code || '');
        const dg = mm ? +mm[1] : /^[0-9]$/.test(k) ? +k : 0;
        if (dg >= 1 && dg <= 9) { input(dg, ev.shiftKey && !/^[0-9]$/.test(k)); return true; }
        if (k === ' ' || k === 'Spacebar') { togglePencil(); return true; }
        if (k === 'Backspace' || k === 'Delete') { erase(); return true; }
        const dir = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
        if (dir) { moveCursor(dir[0], dir[1], ev.shiftKey); return true; }
        if (k === 'Escape' && sel.length) { sel = []; cur = -1; clearHint(); draw(); return false; }
        return false;
      },
      destroy() { dead = true; if (timer) clearTimeout(timer); }
    };
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'loops',
    get name() { return KINDS[currentKind()] || 'Loops and regions'; },
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    deps: ['js/lib/loops-logic.js'],
    noMoves: true,
    get about() { return ABOUT[currentKind()] || ABOUT_ALL; },
    verify,
    generate,
    generates: ['slitherlink', 'masyu', 'bridges-hashi', 'nurikabe', 'kakuro'],
    mount(ctx, p) {
      const m = model(p.data);
      if (m.kind === 'slither' || m.kind === 'masyu') return mountLoop(ctx, p, m);
      if (m.kind === 'hashi') return mountHashi(ctx, p, m);
      if (m.kind === 'nurikabe') return mountNurikabe(ctx, p, m);
      return mountKakuro(ctx, p, m);
    },
    thumb,
    textFor,
    kinds: ABOUT,
    model
  });

  C.css('loops', `
    .lp-nohit, .lp-nohit * { pointer-events: none; }
    .lp-boardbg { fill: var(--board); stroke: var(--line); stroke-width: 1; }
    .lp-cell { fill: var(--cell); }
    .lp-grid { fill: none; stroke: var(--grid-2); stroke-width: 1; }
    .lp-frame { fill: none; stroke: var(--ink-2); stroke-width: 2.2; }
    .lp-line { stroke: var(--ink); stroke-width: 4.4; stroke-linecap: round; transition: stroke .2s; }
    .lp-masyu .lp-line { stroke-width: 5.2; }
    .lp-line.err { stroke: var(--red); }
    .lp-cross { fill: none; stroke: var(--muted); stroke-width: 1.9; stroke-linecap: round; }
    .lp-dot { fill: var(--ink-2); transition: fill .15s; }
    .lp-dot.on { fill: var(--ink); }
    .lp-dot.err { fill: var(--red); stroke: var(--red); stroke-width: 4; }
    .lp-centre { fill: var(--faint); opacity: .55; }
    .lp-clue { font: 600 22px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; dominant-baseline: central; transition: fill .2s, opacity .2s; }
    .lp-clue.done { fill: var(--faint); opacity: .7; }
    .lp-clue.bad { fill: var(--red); opacity: 1; }
    .lp-pearl { stroke-width: 2.4; transition: stroke .2s; }
    .lp-pearl.white { fill: #fbfbf7; stroke: #2b2e40; }
    .lp-pearl.black { fill: #15172a; stroke: #6e7597; }
    .lp-pearl.bad { stroke: var(--red); stroke-width: 3.6; }
    .lp-errnode { fill: none; stroke: var(--red); stroke-width: 2.6; }
    .lp-hov { stroke: var(--accent); stroke-width: 7; stroke-linecap: round; opacity: .22; }
    .lp-cursor { fill: none; stroke: var(--accent); stroke-width: 3; }
    .lp-in { fill: var(--accent); opacity: .17; animation: lpfill .45s ease-out both; }
    .lp.still .lp-in { animation: none; }
    @keyframes lpfill { from { opacity: 0; } }
    .lp.won .lp-line { stroke: var(--gold); }
    .lp-slither.won:not(.still) .lp-lines, .lp-masyu.won:not(.still) .lp-lines { animation: lpglow 1.2s ease-in-out 2; }
    @keyframes lpglow { 50% { filter: drop-shadow(0 0 5px var(--gold)); } }
    .lp-masyu.won:not(.still) .lp-pearl { transform-box: fill-box; transform-origin: center; animation: lppop .6s ease-out; }
    @keyframes lppop { 40% { transform: scale(1.18); } }
    /* hints */
    .lp-hcell.why { fill: var(--gold); opacity: .2; }
    .lp-hcell.bad { fill: var(--red); opacity: .22; }
    .lp-hring { fill: none; stroke-width: 3; }
    .lp-hring.why { stroke: var(--gold); }
    .lp-hring.bad { stroke: var(--red); }
    .lp-hedge { stroke-width: 10; stroke-linecap: round; opacity: .32; }
    .lp-hedge.why { stroke: var(--gold); }
    .lp-hedge.bad { stroke: var(--red); }
    .lp-ghostline { stroke: var(--teal); stroke-width: 3; stroke-dasharray: 5 5; stroke-linecap: round; opacity: .9; }
    .lp-ghostcross { fill: none; stroke: var(--teal); stroke-width: 2; opacity: .9; }
    .lp-gline { stroke: var(--gold); stroke-width: 5; stroke-dasharray: 7 5; stroke-linecap: round; animation: lppulse 1.3s ease-in-out infinite; }
    .lp-gcross { fill: none; stroke: var(--gold); stroke-width: 3.2; stroke-linecap: round; animation: lppulse 1.3s ease-in-out infinite; }
    .lp-hwrong { stroke: var(--red); stroke-width: 9; stroke-linecap: round; opacity: .5; }
    .lp-flash { stroke: var(--gold); stroke-width: 11; stroke-linecap: round; opacity: 0; animation: lpflash 1.3s ease-out; }
    @keyframes lppulse { 50% { opacity: .3; } }
    @keyframes lpflash { 15% { opacity: .5; } 100% { opacity: 0; } }
    /* bridges */
    .lp-water { fill: var(--water); opacity: .2; }
    .lp-wdot { fill: var(--ink-2); opacity: .16; }
    .lp-bridge { stroke: var(--ink); stroke-width: 3.4; stroke-linecap: round; }
    .lp-nolane { stroke: var(--muted); stroke-width: 1.3; stroke-dasharray: 3 5; opacity: .7; }
    .lp-nox { fill: none; stroke: var(--muted); stroke-width: 2.4; stroke-linecap: round; }
    .lp-isl { fill: var(--cell); stroke: var(--ink); stroke-width: 2.4; cursor: pointer; transition: fill .2s, stroke .2s; }
    .lp-isl.done { fill: #f3d77a; stroke: #b58a16; }
    [data-theme="dark"] .lp-isl.done { fill: #7a6423; stroke: #e0b84a; }
    .lp-isl.over, .lp-isl.cut { fill: #f6c3c3; stroke: var(--red); }
    [data-theme="dark"] .lp-isl.over, [data-theme="dark"] .lp-isl.cut { fill: #6b2b2b; }
    .lp-isl.bad { stroke: var(--red); stroke-dasharray: 4 3; }
    .lp-islnum { font: 700 19px "Segoe UI", system-ui, sans-serif; fill: var(--ink); text-anchor: middle; dominant-baseline: central; }
    .lp-islnum.over, .lp-islnum.bad { fill: var(--red); }
    .lp-lane { stroke: var(--accent); stroke-width: 2.2; stroke-dasharray: 2 5; stroke-linecap: round; opacity: .55; }
    .lp-lane.blocked { stroke: var(--red); opacity: .3; }
    .lp-prev { stroke: var(--accent); stroke-width: 3.4; stroke-dasharray: 6 4; stroke-linecap: round; opacity: .75; }
    .lp-prevno { stroke: var(--muted); stroke-width: 2; stroke-dasharray: 3 4; }
    .lp-hlane { stroke: var(--gold); stroke-width: 11; stroke-linecap: round; opacity: .28; }
    .lp-gbridge line { stroke: var(--gold); stroke-width: 3.6; stroke-dasharray: 6 4; stroke-linecap: round; }
    .lp-gbridge, .lp-gno { animation: lppulse 1.3s ease-in-out infinite; }
    .lp-gno path { fill: none; stroke: var(--gold); stroke-width: 3.2; stroke-linecap: round; }
    .lp-hashi.won:not(.still) .lp-isl { transform-box: fill-box; transform-origin: center; animation: lppop .6s ease-out both; }
    .lp-hashi.won .lp-bridge { stroke: #b58a16; }
    [data-theme="dark"] .lp-hashi.won .lp-bridge { stroke: var(--gold); }
    /* nurikabe */
    .lp-ncell { fill: var(--cell); transition: fill .4s; }
    .lp-ncell.sand { fill: #eedfb3; }
    [data-theme="dark"] .lp-ncell.sand { fill: #6b5a33; }
    .lp.won:not(.still) .lp-ncell.sand { animation: lpfill .5s ease-out both; }
    .lp-ngrid { fill: none; stroke: var(--grid-2); stroke-width: 1; }
    .lp-nframe { fill: none; stroke: var(--ink-2); stroke-width: 2.6; }
    .lp-sea { fill: #2f628f; }
    [data-theme="dark"] .lp-sea { fill: #265a88; }
    .lp-wave { fill: none; stroke: rgba(255,255,255,.38); stroke-width: 1.6; stroke-linecap: round; }
    .lp-nurikabe.won:not(.still) .lp-wave { animation: lpwave 1.6s ease-in-out 2; }
    @keyframes lpwave { 50% { transform: translateX(3px); } }
    .lp-land { fill: #c89b45; }
    .lp-nnum { font: 700 20px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; dominant-baseline: central; transition: opacity .2s, fill .2s; }
    .lp-nnum.done { opacity: .42; }
    .lp-nnum.bad { fill: var(--red); opacity: 1; }
    .lp-nurikabe.won .lp-nnum { opacity: 1; fill: #3b2a0e; }
    [data-theme="dark"] .lp-nurikabe.won .lp-nnum { fill: #fff3d6; }
    .lp-pool { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .lp-cut { fill: var(--red); opacity: .28; }
    .lp-hovband { fill: var(--accent); opacity: .06; }
    .lp-ccursor { fill: none; stroke: var(--accent); stroke-width: 3.2; }
    .lp-badge rect { fill: var(--accent); }
    .lp-badge text { font: 700 14px "Segoe UI", system-ui, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; }
    .lp-hzone { fill: var(--gold); opacity: .2; }
    .lp-hbad { fill: none; stroke: var(--red); stroke-width: 3; }
    .lp-hwrongc { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .lp-gcell { opacity: .65; animation: lppulse 1.3s ease-in-out infinite; }
    .lp-gbox { fill: none; stroke: var(--gold); stroke-width: 2.6; }
    .lp-ghostcell { opacity: .42; }
    .lp-cflash { fill: var(--gold); opacity: 0; animation: lpflash 1.3s ease-out; }
    /* kakuro */
    .lp-kblock { fill: #2d3148; }
    [data-theme="dark"] .lp-kblock { fill: #0b0d18; }
    .lp-kcell { fill: var(--cell); }
    .lp-kdiag { stroke: #8a90ab; stroke-width: 1.3; }
    .lp-kgrid { fill: none; stroke: var(--ink-2); stroke-opacity: .4; stroke-width: 1.2; }
    .lp-kframe { fill: none; stroke: var(--ink); stroke-width: 3.2; }
    .lp-ksum { font: 600 15px "Segoe UI", system-ui, sans-serif; fill: #f2f3f8; text-anchor: middle; dominant-baseline: central; transition: opacity .2s; }
    .lp-ksum.done { opacity: .35; }
    .lp-ksum.bad { fill: #ff7b7b; }
    .lp-kdig { font: 500 30px "Segoe UI", system-ui, sans-serif; fill: #7f8cff; text-anchor: middle; dominant-baseline: central; }
    [data-theme="light"] .lp-kdig { fill: #3a4bd8; }
    .lp-kdig.bad { fill: var(--red); }
    .lp-kakuro.won .lp-kdig { fill: var(--green); transition: fill .5s; }
    .lp-kmark { font: 600 12.5px "Segoe UI", system-ui, sans-serif; fill: var(--ink-2); text-anchor: middle; dominant-baseline: central; }
    .lp-kmark.hi { fill: var(--accent); font-weight: 800; }
    .lp-khl { fill: transparent; }
    .lp-khl.near { fill: var(--accent); fill-opacity: .07; }
    .lp-khl.same { fill: var(--accent); fill-opacity: .2; }
    .lp-khl.sel { fill: var(--accent); fill-opacity: .3; }
    .lp-khl.sel.pen { fill: var(--teal); fill-opacity: .26; }
    .lp-khl.bad { fill: var(--red); fill-opacity: .2; }
    .lp-kcursor { fill: none; stroke: var(--accent); stroke-width: 3.2; pointer-events: none; }
    .lp-kcursor.pen { stroke: var(--teal); stroke-dasharray: 7 4; }
    .lp-khint { fill: none; pointer-events: none; }
    .lp-khint.area { fill: var(--gold); fill-opacity: .15; }
    .lp-khint.target { stroke: var(--gold); stroke-width: 4; animation: lppulse 1.1s ease-in-out infinite; }
    .lp-khint.sum { stroke: var(--gold); stroke-width: 2.6; }
    .lp-skey { cursor: pointer; }
    .lp-skey rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 1.5; }
    .lp-skey text { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--text); text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .lp-skey.cur rect { fill: var(--accent); fill-opacity: .25; }
    .lp-skey.on rect { fill: var(--teal); stroke: var(--teal); }
    /* the side panel */
    .lp-panel, .lp-kpanel { display: grid; gap: 8px; margin: 10px 0; width: 100%; }
    .lp-seg { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .lp-segl { color: var(--muted); font-size: 13px; margin-right: 2px; }
    .lp-segb { border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: 8px; padding: 5px 12px; font: 600 13px "Segoe UI", system-ui, sans-serif; cursor: pointer; }
    .lp-segb.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .lp-tip { color: var(--muted); font-size: 12.5px; }
    .lp-keys { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 5px; }
    .lp-b { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 10px; border-radius: 10px; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); font: 600 .82rem "Segoe UI", system-ui, sans-serif; cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: manipulation; }
    .lp-b:hover { border-color: var(--accent); }
    .lp-b:active { transform: translateY(1px); }
    .lp-b .ico { width: 17px; height: 17px; }
    .lp-b.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .lp-key { padding: 8px 0; min-height: 42px; }
    .lp-key b { font-size: 1.25rem; }
    .lp-key.on { background: rgba(108, 123, 255, .22); color: var(--text); }
    .lp-row { display: flex; flex-wrap: wrap; gap: 6px; }
    .lp-row .lp-b { flex: 1 1 auto; }
    .lp-pen.on { background: var(--teal); border-color: var(--teal); color: #0b1a1a; }
    .lp-opts .lp-b { background: transparent; font-weight: 500; font-size: .76rem; padding: 5px 8px; color: var(--muted); }
    .lp-opts .lp-b i { width: 10px; height: 10px; border-radius: 3px; border: 1.5px solid var(--muted); }
    .lp-opts .lp-b.on { background: transparent; color: var(--text); border-color: var(--line); }
    .lp-opts .lp-b.on i { background: var(--accent); border-color: var(--accent); }
    .lp-combos { display: grid; gap: 8px; }
    .lp-ctip { color: var(--muted); font-size: 12.5px; }
    .lp-crun { border: 1px solid var(--line); border-radius: 10px; padding: 7px 9px; background: var(--panel-2); }
    .lp-chead { font-size: 12.5px; color: var(--muted); margin-bottom: 5px; }
    .lp-chead b { color: var(--text); }
    .lp-clist { display: flex; flex-wrap: wrap; gap: 5px 10px; font: 600 13px "Segoe UI", system-ui, sans-serif; font-variant-numeric: tabular-nums; }
    .lp-combo { color: var(--text); letter-spacing: .06em; }
    .lp-combo.out { color: var(--faint); text-decoration: line-through; }
    @media (prefers-reduced-motion: reduce) { .lp-in, .lp-gline, .lp-gcross, .lp-gcell, .lp-gbridge, .lp-gno { animation: none !important; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
