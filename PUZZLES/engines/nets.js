/* The Puzzle Cabinet · engines/nets.js
 *
 * Nets of solids: flat patterns of squares (or triangles) that fold into a
 * cube (or a tetrahedron, an octahedron). Every net can be folded in 3D with
 * a slider, and turned by dragging it.
 *
 * data.kind:
 *   'fold'      { net, answer: true|false }              does this net fold into its solid?
 *   'pick'      { nets: [net…], answer: [i…] }           pick every net that folds
 *   'opposite'  { net, ask: i, answer: j }                which face is opposite face i?
 *   'pairs'     { net, answer: [[i, j]…] }                pair up all the opposite faces
 *   'match'     { net, cubes: [lab…], answer: k }         which cube can be folded from the net?
 *   'build'     { net, fixed: [i…], grid: [w, h] }        place the missing squares so the net folds into the die shown
 *   'all'       { solid: 'cube'|'octa', grid: [w, h] }    shade every net of the solid, one after another
 * net = { g: 's'|'t', c: [[x, y]…], l: [[symbol, quarterTurns] | symbol…] }  (see js/lib/space3d.js)
 * lab = six faces [[symbol, up]…] in the order +x −x +y −y +z −z (a cube as it is shown: +x right, +y up, +z front)
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const SW = { cube: 'cube', tetra: 'tetrahedron', octa: 'octahedron' };
  const LET = 'ABCDEFGHIJKL';

  /* ---------- symbol pools ---------- */

  const COLORS6 = ['c:r', 'c:o', 'c:y', 'c:g', 'c:b', 'c:p'];
  const SYM4 = ['dot', 'ring', 'plus', 'times', 'square', 'bar', 'diag'];
  const GLYPH1 = ['arrow', 'heart', 'star', 'flag', 'moon', 'bolt', 'tri', 'quarter', 'corner', 'half'];
  const LET1 = ['F', 'G', 'J', 'K', 'L', 'P', 'Q', 'R', 'E', 'T', 'Y', 'A'];
  const PIPS = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'];

  /* ---------- small helpers ---------- */

  const sp = () => C.space;
  const netOf = (d) => d.net;
  function foldInfo(net) { return sp().foldNet(net); }
  function labelWord(net, i) {
    const l = sp().labelOf(net, i)[0];
    if (l == null) return 'square ' + (i + 1);
    if (/^c:/.test(l)) return 'the ' + sp().COLOR_NAMES[l.slice(2)] + ' face';
    if (sp().SYM[l]) return 'the face with ' + sp().SYM[l].name;
    return 'face ' + l;
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const sortNum = (a) => a.slice().sort((x, y) => x - y);
  // the net's cells classified for grading: rows of four etc.
  function netType(cells) {
    // 1-4-1, 2-3-1, 2-2-2, 3-3 (cube nets), by the longest row
    const S = sp();
    const r = S.longRow(cells);
    if (r === 4) return '141';
    if (r === 3) {
      // 3-3 has two rows of three
      const rows = {};
      cells.forEach((c) => { rows[c[1]] = (rows[c[1]] || 0) + 1; });
      const cols = {};
      cells.forEach((c) => { cols[c[0]] = (cols[c[0]] || 0) + 1; });
      const n3 = Object.values(rows).filter((v) => v === 3).length + Object.values(cols).filter((v) => v === 3).length;
      return n3 >= 2 ? '33' : '231';
    }
    return '222';
  }

  /* ---------- checking ---------- */

  function checkNet(net, where) {
    if (!net || !Array.isArray(net.c) || !net.c.length) return where + ': no cells';
    const seen = new Set();
    for (const c of net.c) {
      const k = c[0] + ',' + c[1];
      if (seen.has(k)) return where + ': a cell twice';
      seen.add(k);
    }
    if (net.l && net.l.length !== net.c.length) return where + ': labels do not match the cells';
    return null;
  }

  function verify(p) {
    const d = p.data, S = sp();
    if (!S) return { ok: false, err: 'js/lib/space3d.js is not loaded' };
    if (!d || !d.kind) return { ok: false, err: 'no kind' };
    let e;
    switch (d.kind) {
      case 'fold': {
        if ((e = checkNet(d.net, 'net'))) return { ok: false, err: e };
        const ok = S.netFolds(d.net);
        if (ok !== !!d.answer) return { ok: false, err: 'the net ' + (ok ? 'folds' : 'does not fold') + ' but the answer says otherwise' };
        return { ok: true };
      }
      case 'pick': {
        if (!Array.isArray(d.nets) || d.nets.length < 2) return { ok: false, err: 'pick needs nets' };
        for (let i = 0; i < d.nets.length; i++) if ((e = checkNet(d.nets[i], 'net ' + i))) return { ok: false, err: e };
        const good = d.nets.map((n, i) => (S.netFolds(n) ? i : -1)).filter((i) => i >= 0);
        if (good.join() !== sortNum(d.answer).join()) return { ok: false, err: 'the nets that fold are ' + good.join(',') + ', not ' + d.answer.join(',') };
        if (!good.length) return { ok: false, err: 'none of them folds' };
        const keys = new Set(d.nets.map((n) => S.freeKey(n.g, n.c)));
        if (keys.size !== d.nets.length) return { ok: false, err: 'two nets are the same shape' };
        return { ok: true };
      }
      case 'opposite': {
        if ((e = checkNet(d.net, 'net'))) return { ok: false, err: e };
        const r = foldInfo(d.net);
        if (!r.ok) return { ok: false, err: 'the net does not fold' };
        if (r.opposite[d.ask] !== d.answer) return { ok: false, err: 'face ' + d.ask + ' is opposite ' + r.opposite[d.ask] + ', not ' + d.answer };
        return { ok: true };
      }
      case 'pairs': {
        if ((e = checkNet(d.net, 'net'))) return { ok: false, err: e };
        const r = foldInfo(d.net);
        if (!r.ok) return { ok: false, err: 'the net does not fold' };
        if (r.opposite.some((j) => j < 0)) return { ok: false, err: 'this solid has no opposite faces' };
        const used = new Set();
        for (const [a, b] of d.answer) {
          if (r.opposite[a] !== b) return { ok: false, err: 'faces ' + a + ' and ' + b + ' are not opposite' };
          used.add(a); used.add(b);
        }
        if (used.size !== d.net.c.length) return { ok: false, err: 'the pairs do not cover every face' };
        return { ok: true };
      }
      case 'match': {
        if ((e = checkNet(d.net, 'net'))) return { ok: false, err: e };
        const r = foldInfo(d.net);
        if (!r.ok || r.solid !== 'cube') return { ok: false, err: 'the net does not fold into a cube' };
        if (!Array.isArray(d.cubes) || d.cubes.length < 2) return { ok: false, err: 'no cubes to choose from' };
        const truth = S.canonLab(r.lab);
        const canon = d.cubes.map((c) => S.canonLab(c));
        if (canon[d.answer] !== truth) return { ok: false, err: 'cube ' + LET[d.answer] + ' is not the folded net' };
        for (let k = 0; k < d.cubes.length; k++) {
          if (k === d.answer) continue;
          const vis = { 0: d.cubes[k][0], 2: d.cubes[k][2], 4: d.cubes[k][4] };
          if (S.partialPossible(r.lab, vis)) return { ok: false, err: 'cube ' + LET[k] + ' shows three faces the net could make' };
          for (let j = 0; j < k; j++) if (canon[j] === canon[k]) return { ok: false, err: 'cubes ' + LET[j] + ' and ' + LET[k] + ' are the same' };
        }
        return { ok: true };
      }
      case 'build': {
        if ((e = checkNet(d.net, 'net'))) return { ok: false, err: e };
        const r = foldInfo(d.net);
        if (!r.ok || r.solid !== 'cube') return { ok: false, err: 'the solution net does not fold into a cube' };
        if (!Array.isArray(d.fixed) || !d.fixed.length || d.fixed.length >= d.net.c.length) return { ok: false, err: 'fixed must leave some squares to place' };
        const [w, h] = d.grid || [0, 0];
        if (d.net.c.some((c) => c[0] < 0 || c[1] < 0 || c[0] >= w || c[1] >= h)) return { ok: false, err: 'the net does not fit the grid' };
        return { ok: true };
      }
      case 'all': {
        const solid = d.solid || 'cube';
        const nets = S.solidNets(solid);
        const g = S.SOLIDS[solid].grid;
        const [w, h] = d.grid || [0, 0];
        for (const n of nets) {
          const fits = S.gridSyms(g, n.cells).some((s) => {
            const c = S.normNet(g, s.cells);
            return c.every((q) => q[0] < w && q[1] < h);
          });
          if (!fits) return { ok: false, err: 'a net does not fit the grid' };
        }
        return { ok: true, count: nets.length };
      }
      default: return { ok: false, err: 'unknown kind ' + d.kind };
    }
  }

  /* ---------- making puzzles (the generator and Endless) ---------- */

  function poseNet(rng, g, cells) { return sp().randomPose(rng, g, cells); }
  // all free hexominoes / polyiamonds of a solid, split into nets and non-nets with a rough "how sneaky" grade
  function catalogue(solid) {
    const S = sp(), s = S.SOLIDS[solid];
    const all = S.polyforms(s.grid, s.faces);
    return all.map((p) => {
      const net = { g: s.grid, c: p.cells };
      const ok = S.netFolds(net);
      let sneaky = 0;
      if (s.grid === 's') {
        if (ok) sneaky = netType(p.cells) === '141' ? 0 : 1;
        else sneaky = S.has2x2(p.cells) || S.longRow(p.cells) >= 5 ? 0 : 1;
      } else sneaky = 1;
      return { cells: p.cells, key: p.key, ok, sneaky };
    });
  }
  const catCache = {};
  const cat = (solid) => catCache[solid] || (catCache[solid] = catalogue(solid));

  function makePick(rng, level, opts) {
    opts = opts || {};
    const solid = opts.solid || 'cube';
    const all = cat(solid);
    const n = opts.n || [0, 3, 4, 5, 6, 8][level];
    const goodPool = rng.shuffle(all.filter((x) => x.ok && (level >= 3 || x.sneaky === 0 || solid !== 'cube')));
    const badPool = rng.shuffle(all.filter((x) => !x.ok && (level >= 3 ? true : x.sneaky === 0)));
    if (level >= 4 && solid === 'cube') badPool.sort((a, b) => b.sneaky - a.sneaky);
    const nGood = Math.max(1, Math.min(goodPool.length, opts.good != null ? opts.good : rng.range(1, Math.max(1, n - 1))));
    const nBad = Math.min(badPool.length, n - nGood);
    const pickList = goodPool.slice(0, nGood).concat(badPool.slice(0, nBad));
    rng.shuffle(pickList);
    const g = solid === 'cube' ? 's' : 't';
    const nets = pickList.map((x) => ({ g, c: poseNet(rng, g, x.cells) }));
    const answer = nets.map((net, i) => (sp().netFolds(net) ? i : -1)).filter((i) => i >= 0);
    const w = SW[solid];
    return {
      title: 'Which Ones Fold?',
      text: 'Here are ' + nets.length + ' flat patterns of ' + (solid === 'cube' ? 'six squares' : nets[0].c.length + ' triangles') + '. Which of them can be folded along their edges into a ' + w + '? Pick every one that can.',
      goal: 'Select each net that folds into a **' + w + '**, then press **Answer**.',
      diff: level,
      data: { kind: 'pick', nets, answer }
    };
  }

  function makeFold(rng, level) {
    const all = cat('cube');
    const yes = rng() < 0.5;
    const pool = all.filter((x) => x.ok === yes && (level >= 2 || x.sneaky === 0));
    const x = rng.pick(pool);
    const net = { g: 's', c: poseNet(rng, 's', x.cells) };
    return {
      title: 'Will It Fold?',
      text: 'Six squares joined edge to edge. Can this pattern be folded along the lines into a closed cube, with no gaps and no overlaps?',
      goal: 'Answer **Yes** or **No**.',
      diff: level,
      data: { kind: 'fold', net, answer: yes }
    };
  }

  function labelsFor(rng, n, kind) {
    if (kind === 'num') return Array.from({ length: n }, (_, i) => String(i + 1));
    if (kind === 'col') return rng.shuffle(Object.keys(sp().COLORS).slice(0, n).map((k) => 'c:' + k));
    if (kind === 'let') return rng.shuffle(LET.slice(0, n).split(''));
    return null;
  }

  function makeOpposite(rng, level, opts) {
    opts = opts || {};
    const solid = opts.solid || (level >= 4 ? 'octa' : 'cube');
    const all = cat(solid).filter((x) => x.ok && (solid !== 'cube' || (level <= 1 ? x.sneaky === 0 : level >= 3 ? x.sneaky === 1 : true)));
    const x = rng.pick(all);
    const g = solid === 'cube' ? 's' : 't';
    const cells = poseNet(rng, g, x.cells);
    const kinds = solid === 'cube' ? ['num', 'let', 'col'] : ['num'];
    const lab = labelsFor(rng, cells.length, rng.pick(kinds));
    const net = { g, c: cells, l: rng.shuffle(lab.slice()) };
    const r = foldInfo(net);
    // on easy puzzles ask about a face in a straight row (the "skip one" rule)
    let ask = rng.int(cells.length);
    if (level <= 1 && solid === 'cube') {
      const set = new Set(cells.map((c) => c[0] + ',' + c[1]));
      const cands = cells.map((c, i) => i).filter((i) => {
        const j = r.opposite[i], a = cells[i], b = cells[j];
        return (a[0] === b[0] && Math.abs(a[1] - b[1]) === 2 && set.has(a[0] + ',' + (a[1] + b[1]) / 2)) || (a[1] === b[1] && Math.abs(a[0] - b[0]) === 2 && set.has((a[0] + b[0]) / 2 + ',' + a[1]));
      });
      if (cands.length) ask = rng.pick(cands);
    }
    const w = SW[solid];
    return {
      title: 'Face to Face',
      text: 'When this net is folded into a' + (solid === 'octa' ? 'n ' : ' ') + w + ', which face ends up **opposite** ' + labelWord(net, ask) + '?',
      goal: 'Click the face that lands opposite ' + labelWord(net, ask) + ', then press **Answer**.',
      diff: level,
      data: { kind: 'opposite', net, ask, answer: r.opposite[ask] }
    };
  }

  function makePairs(rng, level, opts) {
    opts = opts || {};
    const solid = opts.solid || (level >= 5 ? 'octa' : 'cube');
    const all = cat(solid).filter((x) => x.ok && (solid !== 'cube' || (level <= 2 ? x.sneaky === 0 : x.sneaky === 1)));
    const x = rng.pick(all);
    const g = solid === 'cube' ? 's' : 't';
    const cells = poseNet(rng, g, x.cells);
    const lab = labelsFor(rng, cells.length, solid === 'cube' ? rng.pick(['num', 'let']) : 'num');
    const net = { g, c: cells, l: rng.shuffle(lab.slice()) };
    const r = foldInfo(net);
    const answer = [];
    r.opposite.forEach((j, i) => { if (i < j) answer.push([i, j]); });
    const w = SW[solid];
    return {
      title: 'Opposite Numbers',
      text: 'A' + (solid === 'octa' ? 'n ' : ' ') + w + ' has ' + answer.length + ' pairs of opposite faces. Fold this net in your head and pair up every face with the one opposite it.',
      goal: 'Click two faces to pair them. Pair up all ' + answer.length + ' pairs, then press **Answer**.',
      diff: level,
      data: { kind: 'pairs', net, answer }
    };
  }

  // a labelled cube from a folded net, turned by rotation R
  function turned(lab, R) { return sp().rotLab(lab, R); }
  // move the picture on face h to face f as a real turn of the cube would carry it
  function carry(e, h, f) {
    const S = sp();
    if (!e) return e;
    const nh = S.DIR6[h], nf = S.DIR6[f];
    for (const R of S.ROTS) {
      const a = S.mv(R, nh);
      if (S.dirIndex(a) !== f) continue;
      // prefer a turn about an axis along neither face (a quarter turn over the shared edge, or a half turn)
      const up = S.dirIndex(S.mv(R, S.DIR6[e[1]]));
      if (up === f || up === S.oppDir(f)) continue;
      return [e[0], up];
    }
    return [e[0], e[1]];
  }
  const VIS = [0, 2, 4];

  function makeMatch(rng, level, opts) {
    opts = opts || {};
    const S = sp();
    const pool = level <= 2 ? COLORS6 : level === 3 ? rng.pick([SYM4, PIPS]) : level === 4 ? GLYPH1 : LET1;
    const syms = rng.shuffle(pool.slice()).slice(0, 6);
    const nets = cat('cube').filter((x) => x.ok && (level <= 2 ? x.sneaky === 0 : true));
    const x = rng.pick(nets);
    const cells = poseNet(rng, 's', x.cells);
    const net = { g: 's', c: cells, l: syms.map((s) => [s, S.symOrder(s) === 4 ? 0 : rng.int(4)]) };
    const r = foldInfo(net);
    if (!r.ok) return null;
    const L = r.lab;
    const nCand = level <= 2 ? 3 : 4;
    const kinds = level <= 2 ? ['adjOpp'] : level === 3 ? ['adjOpp', 'mirror', 'mirror'] : level === 4 ? ['mirror', 'rot', 'swapVis', 'adjOpp'] : ['rot', 'mirror', 'rot', 'swapVis'];
    const cands = [], why = [];
    const truthKey = S.canonLab(L);
    const answer = rng.int(nCand);
    for (let k = 0; k < nCand; k++) {
      if (k === answer) { cands.push(turned(L, rng.pick(S.ROTS))); why.push(null); continue; }
      let made = null;
      for (let tries = 0; tries < 60 && !made; tries++) {
        const kind = rng.pick(kinds);
        const base = turned(L, rng.pick(S.ROTS));
        const c = base.map((e) => e.slice());
        const f = rng.pick(VIS);
        if (kind === 'adjOpp') {
          // put next to face g the symbol that really sits opposite it
          const g = rng.pick(VIS.filter((v) => v !== f));
          const h = S.oppDir(g);
          const a = c[f], b = c[h];
          c[f] = carry(b, h, f); c[h] = carry(a, f, h);
        } else if (kind === 'mirror') {
          const h = S.oppDir(f);
          const a = c[f], b = c[h];
          c[f] = carry(b, h, f); c[h] = carry(a, f, h);
        } else if (kind === 'swapVis') {
          const g = rng.pick(VIS.filter((v) => v !== f));
          const a = c[f], b = c[g];
          c[f] = carry(b, g, f); c[g] = carry(a, f, g);
        } else {
          if (S.symOrder(c[f][0]) === 4) continue;
          const turns = S.symOrder(c[f][0]) === 2 ? 1 : rng.pick([1, 2, 3]);
          c[f] = [c[f][0], S.turnUp(f, c[f][1], turns)];
        }
        const vis = { 0: c[0], 2: c[2], 4: c[4] };
        if (S.partialPossible(L, vis)) continue;
        const key = S.canonLab(c);
        if (key === truthKey || cands.some((q) => q && S.canonLab(q) === key)) continue;
        made = c;
        why.push(kind);
      }
      if (!made) return null;
      cands.push(made);
    }
    const what = level <= 2 ? 'coloured' : 'printed';
    return {
      title: 'Which Cube?',
      text: 'This net has ' + what + ' faces. Only one of the cubes can be made by folding it. Which one? (Each cube shows three of its faces to start with — you may turn them to see the others.)',
      goal: 'Click the cube that folds from the net, then press **Answer**.',
      diff: level,
      data: { kind: 'match', net, cubes: cands, answer, why }
    };
  }

  function makeBuild(rng, level, opts) {
    opts = opts || {};
    const S = sp();
    const k = opts.k || (level <= 2 ? 1 : level === 3 ? 2 : level === 4 ? 2 : 3);
    const useDie = level <= 3 || opts.die;
    for (let tries = 0; tries < 60; tries++) {
      const x = rng.pick(cat('cube').filter((q) => q.ok));
      const cells = poseNet(rng, 's', x.cells).map((c) => [c[0] + 1, c[1] + 1]);
      let l;
      if (useDie) {
        // place pips so that opposite faces add to 7
        const probe = S.foldNet({ g: 's', c: cells });
        const val = new Array(6).fill(0);
        const pairsDone = [];
        const vals = rng.shuffle([[1, 6], [2, 5], [3, 4]]);
        let pi = 0;
        cells.forEach((c, i) => {
          if (val[i]) return;
          const j = probe.opposite[i];
          const pr = vals[pi++];
          const flip = rng() < 0.5;
          val[i] = flip ? pr[0] : pr[1]; val[j] = flip ? pr[1] : pr[0];
          pairsDone.push([i, j]);
        });
        l = val.map((v) => ['d' + v, rng.int(4)]);
      } else {
        const pool = level >= 5 ? LET1 : GLYPH1;
        l = rng.shuffle(pool.slice()).slice(0, 6).map((s) => [s, rng.int(4)]);
      }
      const net = { g: 's', c: cells, l };
      if (!S.netFolds(net)) continue;
      // keep a joined part fixed, take k squares away (leaves of the net, so the rest stays in one piece)
      const idx = rng.shuffle(cells.map((c, i) => i));
      let fixed = null;
      for (let a = 0; a < 20 && !fixed; a++) {
        const out = rng.shuffle(idx.slice()).slice(0, k);
        const keep = cells.map((c, i) => i).filter((i) => !out.includes(i));
        if (S.netConnected({ g: 's', c: keep.map((i) => cells[i]) })) fixed = keep;
      }
      if (!fixed) continue;
      let w = 0, h = 0;
      cells.forEach((c) => { w = Math.max(w, c[0] + 2); h = Math.max(h, c[1] + 2); });
      w = Math.max(w, 5); h = Math.max(h, 5);
      return {
        title: useDie ? 'Mend the Die' : 'Finish the Net',
        text: useDie
          ? 'A die was unfolded and ' + C.plural(k, 'face') + ' cut off. Put ' + (k === 1 ? 'it' : 'them') + ' back on the grid so the net folds into exactly this die (on a real die, opposite faces add up to 7 — and the pips must point the right way).'
          : 'Complete the net: put the ' + C.plural(k, 'loose square') + ' on the grid, turned the right way, so that it folds into exactly the cube shown.',
        goal: 'Drag the loose squares onto the grid (tap one to turn it). The net must fold into the ' + (useDie ? 'die' : 'cube') + ' shown.',
        diff: level,
        data: { kind: 'build', net, fixed, grid: [w, h], die: !!useDie }
      };
    }
    return null;
  }

  function makeAll(solid) {
    const w = SW[solid];
    return {
      title: solid === 'cube' ? 'Eleven Ways to Wrap a Cube' : 'Eleven Ways to Wrap an Octahedron',
      text: solid === 'cube'
        ? 'There are exactly **eleven** different nets of a cube (turning a net round or over does not make a new one). Shade them on the grid one at a time: each time six shaded squares make a new net, it goes into your collection. Find all eleven.'
        : 'An octahedron has eight triangular faces, and — like the cube — exactly **eleven** different nets. Shade eight triangles at a time to collect them all.',
      goal: 'Collect all **11** nets of the ' + w + '. Click cells to shade them; ' + (solid === 'cube' ? 'six squares' : 'eight triangles') + ' are tested as soon as they are shaded.',
      data: { kind: 'all', solid, grid: solid === 'cube' ? [6, 6] : [13, 5] }
    };
  }

  // everything the Endless drawer can make, by level
  function generate(rng, level) {
    const r = rng();
    let p = null;
    if (level === 1) p = r < 0.5 ? makePick(rng, 1) : r < 0.8 ? makeOpposite(rng, 1) : makeFold(rng, 1);
    else if (level === 2) p = r < 0.3 ? makePick(rng, 2) : r < 0.55 ? makeOpposite(rng, 2) : r < 0.8 ? makeMatch(rng, 2) : makePairs(rng, 2);
    else if (level === 3) p = r < 0.25 ? makePick(rng, 3) : r < 0.55 ? makeMatch(rng, 3) : r < 0.75 ? makePairs(rng, 3) : makeBuild(rng, 3);
    else if (level === 4) p = r < 0.2 ? makePick(rng, 4, rng() < 0.4 ? { solid: 'octa', n: 5 } : null) : r < 0.55 ? makeMatch(rng, 4) : r < 0.8 ? makeBuild(rng, 4) : makeOpposite(rng, 4, { solid: 'octa' });
    else p = r < 0.2 ? makePick(rng, 5, rng() < 0.5 ? { solid: 'octa', n: 6 } : null) : r < 0.6 ? makeMatch(rng, 5) : r < 0.8 ? makeBuild(rng, 5) : makePairs(rng, 5, { solid: 'octa' });
    if (p) p.diff = level;
    return p;
  }

  /* ---------- words: explanations and reasons ---------- */

  // why a candidate cube cannot be the folded net
  function cubeReason(L, cube, k) {
    const S = sp();
    const vis = [0, 2, 4];
    const where = (sym) => L.findIndex((e) => e && e[0] === sym);
    for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) {
      const fa = where(cube[vis[a]][0]), fb = where(cube[vis[b]][0]);
      if (fa >= 0 && fb >= 0 && S.oppDir(fa) === fb) return 'Cube ' + LET[k] + ' shows ' + S.symName(cube[vis[a]][0]) + ' and ' + S.symName(cube[vis[b]][0]) + ' side by side, but when the net is folded they are **opposite** each other.';
    }
    const noUp = {};
    vis.forEach((f) => { noUp[f] = [cube[f][0], null]; });
    const L4 = L.map((e) => (e ? [e[0], null] : e));
    if (!S.partialPossible(L4, noUp)) return 'Cube ' + LET[k] + ' has the right three faces round a corner, but in the **wrong order** — it is the mirror image of the real cube.';
    for (const f of vis) {
      const part = {};
      vis.forEach((g) => { part[g] = g === f ? [cube[g][0], null] : cube[g]; });
      const Lx = L.map((e) => (e && e[0] === cube[f][0] ? [e[0], null] : e));
      if (S.partialPossible(Lx, part)) return 'On cube ' + LET[k] + ', ' + S.symName(cube[f][0]) + ' is **turned the wrong way** compared with its neighbours.';
    }
    return 'Cube ' + LET[k] + ' cannot be folded from the net.';
  }

  function explainText(d) {
    const S = sp();
    switch (d.kind) {
      case 'fold': {
        const net = d.net;
        return d.answer ? 'It folds: every square finds its own side of the cube, and no two land on the same side. Fold it in 3D to watch.' : 'It does not fold. ' + S.whyNot(net);
      }
      case 'pick': return d.nets.map((n, i) => '**' + LET[i] + '** ' + (S.netFolds(n) ? 'folds.' : 'does not fold: ' + S.whyNot(n).charAt(0).toLowerCase() + S.whyNot(n).slice(1))).join('<br>') +
        '<br><br>' + (d.nets[0].g === 's' ? 'Of the 35 shapes made of six squares, exactly 11 fold into a cube.' : 'Watch them fold in 3D.');
      case 'opposite': {
        const net = d.net;
        return cap(labelWord(net, d.ask)) + ' and ' + labelWord(net, d.answer) + ' are opposite. ' + (net.g === 's'
          ? 'A useful rule: two squares in a straight row with **one square between them** always end up opposite — the middle square wraps round between them. In a zigzag, the two ends of the Z are opposite too.'
          : 'On an octahedron, a face is opposite the one you reach by crossing three edges in a straight zigzag strip; folding it in 3D shows it best.');
      }
      case 'pairs': return 'The opposite pairs are ' + d.answer.map(([a, b]) => labelWord(d.net, a).replace(/^the face with |^face /, '') + ' & ' + labelWord(d.net, b).replace(/^the face with |^face /, '')).join(', ') + '. ' +
        (d.net.g === 's' ? 'Squares with one square between them in a row are always opposite — that settles most pairs at once.' : 'Fold it in 3D and turn it to check each pair.');
      case 'match': {
        const L = S.foldNet(d.net).lab;
        return 'Cube **' + LET[d.answer] + '** is the one. ' + d.cubes.map((c, k) => (k === d.answer ? '' : cubeReason(L, c, k))).filter(Boolean).join(' ');
      }
      case 'build': return 'Folded, the finished net makes exactly the ' + (d.die ? 'die' : 'cube') + ' shown. Squares with one square between them in a row are opposite; the pictures must also turn the right way.';
      case 'all': return 'The eleven nets come in four families: six with a row of four squares (1-4-1), three with a row of three and a step (2-3-1), one staircase (2-2-2) and one with two rows of three (3-3).';
      default: return '';
    }
  }

  /* ---------- drawing (browser) ---------- */

  const f3 = (v) => Math.round(v * 1000) / 1000;
  function netBox(net) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    sp().netPolys(net).forEach((poly) => poly.forEach((q) => { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); }));
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  }
  // the flat net as SVG: cells (keyed for the paint tool) with their pictures
  function netSVG(net, ox, oy, opts) {
    const S = sp();
    opts = opts || {};
    let s = '';
    net.c.forEach((c, i) => {
      const poly = S.cellPoly(net.g, c).map((q) => [q[0] + ox, q[1] + oy]);
      const lab = S.labelOf(net, i);
      const fill = (opts.fill && opts.fill(i)) || S.faceColor(lab[0]);
      s += '<path class="nt-cell' + (opts.cls ? ' ' + (opts.cls(i) || '') : '') + '" data-cell="' + i + '"' + (opts.key ? ' data-key="' + opts.key + '-' + i + '"' : '') + ' d="' + C.pathOf(poly) + '" fill="' + fill + '"' + (opts.sw ? ' stroke-width="' + opts.sw + '"' : '') + '/>';
      if (lab[0] && !/^c:/.test(lab[0])) {
        const cc = S.centroid2(poly);
        const k = net.g === 't' ? 0.0056 : 0.0088;
        s += '<g transform="translate(' + f3(cc[0]) + ' ' + f3(cc[1]) + ') scale(' + k + ')" pointer-events="none">' + S.symSVG(lab[0], lab[1] || 0) + '</g>';
      }
    });
    return s;
  }
  function cubeSVG(lab, cx, cy, scale, yaw, pitch) {
    const S = sp();
    return S.svgFaces(S.labFaces(lab), { R: S.ypMat(yaw == null ? -35 : yaw, pitch == null ? 24 : pitch), pivot: [0.5, 0.5, 0.5], scale, at: [cx, cy] }).svg;
  }
  function tag2(x, y, text, state) {
    return '<g class="nt-tag' + (state ? ' ' + state : '') + '" pointer-events="none"><rect x="' + f3(x - 0.36) + '" y="' + f3(y - 0.25) + '" width="0.72" height="0.5" rx="0.25"/><text x="' + f3(x) + '" y="' + f3(y + 0.012) + '" text-anchor="middle" dominant-baseline="central">' + text + '</text></g>';
  }
  // rows of boxes that suit the shape of the table
  function flow(items, aspect, gap) {
    let best = null;
    for (let rows = 1; rows <= items.length; rows++) {
      const per = Math.ceil(items.length / rows);
      const rr = [];
      for (let r = 0; r * per < items.length; r++) rr.push(items.slice(r * per, (r + 1) * per));
      if (rr.length !== rows) continue;
      const widths = rr.map((row) => row.reduce((s, it) => s + it.w + gap, -gap));
      const heights = rr.map((row) => Math.max.apply(null, row.map((it) => it.h)));
      const W = Math.max.apply(null, widths), H = heights.reduce((a, b) => a + b, 0) + gap * (rows - 1);
      const sc = Math.min(aspect / W, 1 / H);
      if (!best || sc > best.sc * 1.02) best = { rr, widths, heights, W, H, sc };
    }
    let y = 0;
    best.rr.forEach((row, r) => {
      let x = (best.W - best.widths[r]) / 2;
      row.forEach((it) => { it.x = x; it.y = y + (best.heights[r] - it.h) / 2; x += it.w + gap; });
      y += best.heights[r] + gap;
    });
    return { W: best.W, H: best.H };
  }
  function pointIn(pt, poly) {
    let ins = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins;
    }
    return ins;
  }

  /* ---------- 3D objects (browser) ---------- */

  // a paper net that folds: one mesh per face; o.setFold(t)
  function netObject(st, net, opts) {
    const S = sp(), M4 = C.M4;
    const plan = S.foldPlan(net);
    const box = netBox(net);
    const flatC = [(box.x0 + box.x1) / 2, 0, (box.y0 + box.y1) / 2];
    let solidC = flatC.slice();
    if (plan.complete) {
      const m1 = S.foldMats(plan, 1);
      solidC = [0, 0, 0];
      plan.polys.forEach((poly, i) => { const c2 = S.centroid2(poly); solidC = S.v.add(solidC, M4.apply(m1[i], [c2[0], 0, c2[1]])); });
      solidC = S.v.mul(solidC, 1 / plan.n);
    }
    const size = Math.max(1.2, Math.hypot(box.w, box.h) / 2 + 0.15);
    const o = st.add(Object.assign({ mode: 'table', yaw: -10, pitch: 60, pmin: -40, pmax: 89, size, pivot: flatC.slice() }, opts || {}));
    o.net = net; o.plan = plan; o.cells = []; o.t = 0;
    o.size0 = size;
    o.size1 = Math.max(plan.solid === 'cube' ? 1.05 : 0.95, size * 0.6);
    o.home0 = { yaw: o.yaw, pitch: o.pitch };
    const carriers = [];
    plan.polys.forEach((poly, i) => {
      const verts = poly.slice().reverse().map((q) => [q[0], 0, q[1]]);
      const lab = S.labelOf(net, i);
      const sym = lab[0] && !/^c:/.test(lab[0]) ? lab[0] : null;
      const col = S.faceColor(lab[0]);
      const spec = { verts, faces: [verts.map((_, k) => k)], color: col, baseColor: col, backColor: S.PAPER_BACK, backShade: 0.92, doubleSided: true, lw: 1.3, cellIndex: i, stroke: 'rgba(40,44,70,.75)' };
      if (sym && net.g !== 't') spec.decals = { 0: { draw: (c2, lit) => S.drawSym(c2, sym, lab[1], lit) } };
      o.cells.push(st.mesh(o, spec));
      if (sym && net.g === 't') {
        const c2 = S.centroid2(poly), h = 0.2;
        const cv = [[c2[0] - h, 0, c2[1] + h], [c2[0] + h, 0, c2[1] + h], [c2[0] + h, 0, c2[1] - h], [c2[0] - h, 0, c2[1] - h]];
        carriers.push({ i, m: st.mesh(o, { verts: cv, faces: [[0, 1, 2, 3]], color: '#000000', alpha: 0, stroke: false, pickable: false, bias: -0.03, decals: { 0: { draw: (c3, lit) => S.drawSym(c3, sym, lab[1], lit) } } }) });
      }
    });
    o.setFold = (t) => {
      if (!plan.complete) return;
      const mats = S.foldMats(plan, t);
      o.cells.forEach((m, i) => { m.lm = mats[i]; });
      carriers.forEach((c) => { c.m.lm = mats[c.i]; });
      o.pivot = S.v.add(S.v.mul(flatC, 1 - t), S.v.mul(solidC, t));
      o.t = t;
      o.size = o.size0 + (o.size1 - o.size0) * t;
      if (!o.touched && !o.noTilt) {
        o.pitch = o.home0.pitch + (26 - o.home0.pitch) * t;
        o.yaw = o.home0.yaw + (-35 - o.home0.yaw) * t;
      }
    };
    o.setFold(0);
    return o;
  }

  // a cube with a picture on every face
  function cubeObject(st, lab, opts) {
    const S = sp();
    const verts = [], fs = [], colors = [], decals = {};
    S.labFaces(lab).forEach((F, i) => {
      const b = verts.length;
      F.p.forEach((q) => verts.push(q));
      fs.push([b, b + 1, b + 2, b + 3]);
      colors.push(F.c);
      if (F.sym) decals[i] = { draw: (c2, lit) => S.drawSym(c2, F.sym[0], 0, lit) };
    });
    const o = st.add(Object.assign({ mode: 'table', yaw: -35, pitch: 24, size: 1.05, pivot: [0.5, 0.5, 0.5] }, opts || {}));
    o.lab = lab;
    st.mesh(o, { verts, faces: fs, colors, decals, lw: 1.5, stroke: 'rgba(40,44,70,.8)' });
    return o;
  }

  const PAIR_COLS = ['#ff9f80', '#8fdca0', '#8fbaff', '#e3a8ff'];
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

  // the fold slider and its buttons, shared by every kind
  function foldBar(ctx, opts) {
    const slider = ctx.h('input.nt-slider', { type: 'range', min: 0, max: 100, value: 0, 'aria-label': 'How far the net is folded' });
    const play = ctx.h('button.btn.small.primary', { type: 'button', title: 'Fold the net in 3D (or unfold it)' }, 'Fold ▶');
    const home = ctx.h('button.btn.small.ghost', { type: 'button', title: 'Turn everything back to where it started' }, 'Reset view');
    const note = ctx.h('div.nt-note', opts.note || '');
    const el = ctx.h('div.nt-fold',
      ctx.h('div.nt-foldhead', ctx.h('b', opts.title || 'Fold it in 3D'), home),
      ctx.h('div.nt-foldrow', play, ctx.h('span.nt-end', 'flat'), slider, ctx.h('span.nt-end', 'shut')),
      note);
    slider.addEventListener('input', () => opts.onSlide(slider.value / 100));
    play.addEventListener('click', () => opts.onPlay());
    home.addEventListener('click', () => opts.onHome());
    return {
      el, slider, play, note,
      set(t) { slider.value = Math.round(t * 100); play.textContent = t > 0.5 ? '◀ Unfold' : 'Fold ▶'; }
    };
  }

  // turn objects back to where they started (net objects: as suits how far they are folded)
  function homeAll(st, objs, foldT) {
    const from = objs.map((o) => ({ o, yaw: o.yaw, pitch: o.pitch, qi: o.qi.slice() }));
    st.animate(450, (t) => {
      from.forEach((f) => {
        const o = f.o;
        const hy = o.home0 ? o.home0.yaw + (-35 - o.home0.yaw) * foldT : o.home.yaw;
        const hp = o.home0 ? o.home0.pitch + (26 - o.home0.pitch) * foldT : o.home.pitch;
        o.yaw = f.yaw + (hy - f.yaw) * t;
        o.pitch = f.pitch + (hp - f.pitch) * t;
      });
    }, () => objs.forEach((o) => { o.touched = false; }));
  }

  /* ---------- the question kinds: fold, pick, opposite, pairs, match ---------- */

  function mountQuestion(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb, kind = d.kind;
    const nets = kind === 'pick' ? d.nets : [d.net];
    const solid = S.solidOf(nets[0]);
    const infos = nets.map((n) => S.foldNet(n));
    const L = kind === 'match' ? infos[0].lab : null;
    let sel = kind === 'pick' || kind === 'pairs' ? [] : kind === 'fold' ? null : -1;
    let first = -1, done = false, peeked = false, tries = 0, foldT = 0;
    let wrong = new Set(), hintMarks = new Set();
    const clash = nets.map(() => new Set());
    let items = [];

    /* the flat page */
    const g2 = ctx.s('g', { class: 'nt' }, wb.layer('board'));
    const gHint = ctx.s('g', { class: 'nt-hint' }, wb.layer('top'));
    function layout2() {
      const sz = wb.size();
      const aspect = Math.max(0.6, (sz.w - 70) / Math.max(120, sz.h - 70));
      items = [];
      nets.forEach((n, i) => { const b = netBox(n); items.push({ t: 'net', i, w: b.w, h: b.h + (kind === 'pick' ? 0.85 : 0), box: b }); });
      if (kind === 'match') items.push({ t: 'cubes', w: 5.2, h: Math.ceil(d.cubes.length / 2) * 2.95 });
      const r = flow(items, aspect, kind === 'pick' ? 1.0 : 1.4);
      wb.setBounds({ x0: -0.5, y0: -0.5, x1: r.W + 0.5, y1: r.H + 0.5 }, 0.05);
    }
    function pairOf(ci) { return sel.findIndex((pr) => pr.includes(ci)); }
    function cellFill(i, ci) {
      if (kind === 'pairs') { const k = pairOf(ci); if (k >= 0) return PAIR_COLS[k % PAIR_COLS.length]; }
      if (clash[i].has(ci)) return '#ff8a80';
      return null;
    }
    function cellCls(i, ci) {
      const c = [];
      if (kind === 'opposite') {
        if (ci === d.ask) c.push('ask');
        if (done && ci === d.answer) c.push('good');
        else if (ci === sel) c.push('on');
      }
      if (kind === 'pairs' && ci === first) c.push('on');
      return c.join(' ');
    }
    function netState(i) {
      if (kind === 'pick') {
        if (done || hintMarks.has(i)) return infos[i].ok ? 'good' : 'bad';
        return sel.includes(i) ? 'sel' : null;
      }
      if (kind === 'fold' && done) return infos[0].ok ? 'good' : 'bad';
      return null;
    }
    function cubeState(k) {
      if (done) return k === d.answer ? 'good' : (wrong.has(k) || hintMarks.has(k) ? 'bad' : null);
      if (wrong.has(k) || hintMarks.has(k)) return 'bad';
      return sel === k ? 'sel' : null;
    }
    function draw2() {
      let s = '';
      items.forEach((it) => {
        if (it.t === 'net') {
          const net = nets[it.i], ox = it.x - it.box.x0, oy = it.y - it.box.y0;
          it.ox = ox; it.oy = oy;
          const stt = netState(it.i);
          s += '<g class="nt-net' + (stt ? ' ' + stt : '') + (kind === 'pick' ? ' pickable' : '') + '">' +
            netSVG(net, ox, oy, { key: 'n' + it.i, cls: (ci) => cellCls(it.i, ci), fill: (ci) => cellFill(it.i, ci) }) + '</g>';
          if (kind === 'pick') s += tag2(it.x + it.w / 2, it.y + it.h - 0.3, LET[it.i], stt);
        } else {
          d.cubes.forEach((lab, k) => {
            const cx = it.x + 1.3 + (k % 2) * 2.6, cy = it.y + 1.2 + Math.floor(k / 2) * 2.95;
            it['c' + k] = [cx, cy];
            const stt = cubeState(k);
            s += '<g class="nt-cube' + (stt ? ' ' + stt : '') + '"><circle cx="' + f3(cx) + '" cy="' + f3(cy) + '" r="1.2" class="nt-cubehit"/>' + cubeSVG(lab, cx, cy, 1.2) + '</g>';
            s += tag2(cx, cy + 1.42, LET[k], stt);
          });
        }
      });
      g2.innerHTML = s;
      wb.applyPaints();
    }
    function hit2(pt) {
      for (const it of items) {
        if (it.t === 'net') {
          const net = nets[it.i];
          for (let ci = 0; ci < net.c.length; ci++) {
            const poly = S.cellPoly(net.g, net.c[ci]).map((q) => [q[0] + it.ox, q[1] + it.oy]);
            if (pointIn(pt, poly)) return { net: it.i, cell: ci };
          }
          if (kind === 'pick' && pt[0] >= it.x && pt[0] <= it.x + it.w && pt[1] >= it.y && pt[1] <= it.y + it.h) return { net: it.i, cell: -1 };
        } else {
          for (let k = 0; k < d.cubes.length; k++) { const c = it['c' + k]; if (c && Math.hypot(pt[0] - c[0], pt[1] - c[1]) < 1.3) return { cube: k }; }
        }
      }
      return null;
    }
    wb.handlers.board = {
      down(pt) { const h = hit2(pt); if (!h || done) return false; onHit(h); return true; },
      hover(pt) { wb.svg.style.cursor = !done && hit2(pt) && kind !== 'fold' ? 'pointer' : ''; }
    };

    /* the 3D scene */
    const st = new S.Stage(ctx, {
      onTap: (hit, obj) => {
        if (!obj || done) return;
        if (obj.cube != null) onHit({ cube: obj.cube });
        else if (obj.netI != null) onHit({ net: obj.netI, cell: hit.mesh.cellIndex != null ? hit.mesh.cellIndex : -1 });
      },
      cursor: (hit, obj) => (obj && !done && kind !== 'fold' ? 'pointer' : null),
      layout: kind === 'match' ? matchLayout : null
    });
    const nobjs = nets.map((n, i) => {
      const o = netObject(st, n, { id: 'net' + i, label: kind === 'pick' ? LET[i] : null, pitch: kind === 'match' ? 66 : 60 });
      o.netI = i;
      return o;
    });
    const cobjs = kind === 'match' ? d.cubes.map((lab, k) => { const o = cubeObject(st, lab, { id: 'cube' + k, label: LET[k] }); o.cube = k; return o; }) : [];
    function matchLayout(stg) {
      const net = nobjs[0], aspect = (stg.v.w || 600) / (stg.v.h || 400);
      const Rn = net.size, cell = 2.5, lab = 0.7, n = cobjs.length, rows = Math.ceil(n / 2);
      const wideW = 2 * Rn + 0.8 + 2 * cell, wideH = Math.max(2 * Rn, rows * (cell + lab) - 0.3);
      const tallW = Math.max(2 * Rn, n * cell), tallH = 2 * Rn + 0.5 + cell + lab;
      if (Math.min(aspect / wideW, 1 / wideH) >= Math.min(aspect / tallW, 1 / tallH)) {
        net.at = [-wideW / 2 + Rn, 0, 0];
        cobjs.forEach((o, k) => {
          const col = k % 2, row = Math.floor(k / 2);
          o.at = [wideW / 2 - 2 * cell + cell / 2 + col * cell, ((rows - 1) / 2 - row) * (cell + lab) + lab / 2, 0];
        });
        stg.extent = { W: wideW, H: wideH };
      } else {
        net.at = [0, tallH / 2 - Rn, 0];
        cobjs.forEach((o, k) => { o.at = [(-(n - 1) / 2 + k) * cell, -tallH / 2 + cell / 2 + lab, 0]; });
        stg.extent = { W: tallW, H: tallH };
      }
    }
    function sync3() {
      const th = st.theme;
      nobjs.forEach((o, i) => {
        o.state = netState(i);
        o.cells.forEach((m, ci) => {
          const cls = cellCls(i, ci);
          m.color = cellFill(i, ci) || m.baseColor;
          m.selected = kind === 'pick' ? sel.includes(i) && !done : /\b(on|ask|good)\b/.test(cls);
          m.selColor = /\bask\b/.test(cls) ? th.accent : /\bgood\b/.test(cls) ? th.green : null;
        });
      });
      cobjs.forEach((o, k) => { o.state = cubeState(k); o.meshes.forEach((m) => { m.selected = sel === k && !done; m.alpha = o.state === 'bad' ? 0.5 : undefined; }); });
      st.render();
    }

    /* the panel */
    const panel = ctx.h('div.nt-panel');
    ctx.panel.appendChild(panel);
    const ansRow = ctx.h('div.nt-ans');
    const status = ctx.h('div.nt-status');
    const chips = [];
    let answerBtn = null;
    if (kind === 'fold') {
      ansRow.append(
        ctx.h('button.btn.primary', { type: 'button', onclick: () => { sel = true; answerClick(); } }, 'Yes, it folds'),
        ctx.h('button.btn', { type: 'button', onclick: () => { sel = false; answerClick(); } }, 'No, it does not'));
    } else {
      if (kind === 'pick' || kind === 'match') {
        const n = kind === 'pick' ? nets.length : d.cubes.length;
        for (let i = 0; i < n; i++) {
          const b = ctx.h('button.nt-chip', { type: 'button', title: (kind === 'pick' ? 'Net ' : 'Cube ') + LET[i], onclick: () => onHit(kind === 'pick' ? { net: i, cell: -1 } : { cube: i }) }, LET[i]);
          chips.push(b);
          ansRow.appendChild(b);
        }
      }
      if (kind === 'pairs') ansRow.appendChild(ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => { if (done) return; sel = []; first = -1; refresh(); ctx.changed('select'); } }, 'Clear pairs'));
      answerBtn = ctx.h('button.btn.primary.nt-go', { type: 'button', onclick: () => answerClick() }, 'Answer');
      ansRow.appendChild(answerBtn);
    }
    const fb = foldBar(ctx, {
      note: 'You may fold it before you answer — but peeking makes the puzzle worth one star at most.',
      onSlide: (t) => { peek(); if (!wb.is3D) wb.set3D(true); setFold(t); },
      onPlay: () => { peek(); if (!wb.is3D) wb.set3D(true); foldTo(foldT > 0.5 ? 0 : 1, 1500); },
      onHome: () => homeAll(st, st.objs, foldT)
    });
    panel.append(ansRow, status, fb.el);
    function drawPanel() {
      chips.forEach((b, i) => {
        const stt = kind === 'pick' ? netState(i) : cubeState(i);
        b.className = 'nt-chip' + (stt ? ' ' + stt : '');
      });
      if (answerBtn) answerBtn.disabled = done;
      let t = '';
      if (kind === 'opposite') t = sel >= 0 ? 'Your choice: <b>' + C.esc(labelWord(d.net, sel)) + '</b>' : 'Click the face that lands opposite <b>' + C.esc(labelWord(d.net, d.ask)) + '</b>.';
      if (kind === 'pairs') {
        const n = nets[0].c.length / 2;
        t = sel.length ? 'Pairs so far: ' + sel.map(([a, b]) => '<b>' + C.esc(short(a)) + '–' + C.esc(short(b)) + '</b>').join(', ') + ' (' + sel.length + ' of ' + n + ')' : 'Click two faces to pair them; click a paired face to undo.';
        if (first >= 0) t += '<br>Now click the face opposite <b>' + C.esc(short(first)) + '</b>.';
      }
      if (kind === 'pick') t = sel.length ? 'Selected: <b>' + sortNum(sel).map((i) => LET[i]).join(', ') + '</b>' : 'Click every net that folds.';
      if (kind === 'match') t = sel >= 0 ? 'Your choice: cube <b>' + LET[sel] + '</b>' : 'Click the cube that folds from the net. Drag any cube to turn it.';
      if (done) t = '';
      status.innerHTML = t;
      status.hidden = !t;
    }
    function short(ci) {
      const l = S.labelOf(d.net, ci)[0];
      return l == null ? String(ci + 1) : /^c:/.test(l) ? S.COLOR_NAMES[l.slice(2)] : S.SYM[l] ? S.SYM[l].name.replace(/^an? /, '') : l;
    }
    function refresh() { draw2(); sync3(); drawPanel(); }

    /* clicking */
    function onHit(h) {
      if (!h || done) return;
      if (kind === 'pick' && h.net != null) {
        const k = sel.indexOf(h.net);
        if (k >= 0) sel.splice(k, 1); else sel.push(h.net);
      } else if (kind === 'match' && h.cube != null) {
        sel = sel === h.cube ? -1 : h.cube;
      } else if (kind === 'opposite' && h.cell >= 0) {
        if (h.cell === d.ask) { ctx.toast('That is the face in the question — click the one that lands opposite it.'); return; }
        sel = sel === h.cell ? -1 : h.cell;
      } else if (kind === 'pairs' && h.cell >= 0) {
        const c = h.cell, k = pairOf(c);
        if (k >= 0) { sel.splice(k, 1); first = -1; }
        else if (first < 0) first = c;
        else if (first === c) first = -1;
        else { sel.push([first, c]); first = -1; }
      } else return;
      ctx.sfx('tap');
      refresh();
      ctx.changed('select');
    }

    /* folding */
    function setFold(t, quiet) {
      foldT = t;
      nobjs.forEach((o) => o.setFold(t));
      fb.set(t);
      st.layout();
      st.frame(true);
      if (!quiet) st.render();
    }
    function foldTo(t1, ms, then) {
      const t0 = foldT;
      if (t1 < 0.5) clash.forEach((c) => c.clear());
      st.animate(ms, (e) => setFold(t0 + (t1 - t0) * e, true), then);
    }
    function peek() {
      if (done || peeked) return;
      peeked = true;
      ctx.toast('Peeking! Folding before you answer makes this one worth one star at most.');
      fb.note.textContent = 'You peeked: one star at most for this one.';
    }

    /* answering */
    function evaluate() {
      if (kind === 'fold') {
        if (sel == null) return null;
        if (sel === !!d.answer) return { ok: true, msg: d.answer ? 'Yes — it folds into a cube.' : 'Right — it cannot close up into a cube. ' + S.whyNot(d.net) };
        return { ok: false, msg: d.answer ? 'It does fold, as it happens.' : 'Look again: something goes wrong as it closes up.' };
      }
      if (kind === 'pick') {
        if (!sel.length) return null;
        const want = sortNum(d.answer), got = sortNum(sel);
        if (want.join() === got.join()) return { ok: true, msg: (want.length === 1 ? 'Only ' + LET[want[0]] + ' folds.' : 'Exactly: ' + want.map((i) => LET[i]).join(', ') + '.') };
        const bad = got.filter((i) => !want.includes(i)).length, miss = want.filter((i) => !got.includes(i)).length;
        return { ok: false, msg: bad ? (bad === 1 ? 'One of those does not fold.' : bad + ' of those do not fold.') + (miss ? ' And ' + (miss === 1 ? 'one that folds is' : miss + ' that fold are') + ' missing.' : '') : 'Those all fold — but ' + (miss === 1 ? 'one more does' : miss + ' more do') + '.' };
      }
      if (kind === 'opposite') {
        if (sel < 0) return null;
        if (sel === d.answer) return { ok: true, msg: cap(labelWord(d.net, sel)) + ' lands opposite ' + labelWord(d.net, d.ask) + '.' };
        return { ok: false, msg: cap(labelWord(d.net, sel)) + ' ends up beside ' + labelWord(d.net, d.ask) + ', not opposite it.' };
      }
      if (kind === 'pairs') {
        const n = nets[0].c.length / 2;
        if (sel.length < n) return { empty: 'Pair up all ' + n + ' pairs first (' + sel.length + ' so far).' };
        const bad = sel.filter(([a, b]) => infos[0].opposite[a] !== b).length;
        if (!bad) return { ok: true, msg: 'All ' + n + ' pairs are right.' };
        return { ok: false, msg: bad === 1 ? 'One pair is wrong — two of those faces end up side by side.' : bad + ' pairs are wrong.' };
      }
      if (kind === 'match') {
        if (sel < 0) return null;
        if (sel === d.answer) return { ok: true, msg: 'Cube ' + LET[sel] + ' it is.' };
        return { ok: false, msg: cubeReason(L, d.cubes[sel], sel), wrong: sel };
      }
      return null;
    }
    function submit() {
      if (done) return { solved: true };
      const r = evaluate();
      if (!r || r.empty) return { solved: false, msg: (r && r.empty) || (kind === 'fold' ? 'Answer yes or no.' : kind === 'pick' ? 'Select the nets that fold first.' : kind === 'match' ? 'Click a cube first.' : 'Click a face first.') };
      if (r.ok) {
        done = true;
        const stars = peeked ? 1 : Math.max(1, 3 - tries);
        refresh();
        setTimeout(() => showWhy(), 60);
        return { solved: true, msg: r.msg, stars: stars < 3 ? stars : undefined };
      }
      tries++;
      if (r.wrong != null) { wrong.add(r.wrong); sel = -1; }
      refresh();
      return { solved: false, msg: r.msg + (tries === 1 ? ' (Each wrong answer costs a star.)' : '') };
    }
    function answerClick() {
      const r = submit();
      if (r.solved) ctx.solved(r);
      else { ctx.say(r.msg, 'warn'); ctx.sfx('wrong'); }
    }

    // after the answer: fold everything in 3D and show why
    function showWhy() {
      if (st.dead) return;
      if (!wb.is3D) wb.set3D(true);
      nobjs.forEach((o) => { o.touched = false; });
      foldTo(1, 1700, () => {
        infos.forEach((inf, i) => inf.clash.forEach(([a, b]) => { clash[i].add(a); clash[i].add(b); }));
        refresh();
        if (kind === 'match') alignMatch();
      });
    }
    function alignMatch() {
      const o = nobjs[0], target = cobjs[d.answer];
      const k = S.labTurn(L, d.cubes[d.answer]);
      if (k < 0) return;
      const q1 = S.Q.fromMat(S.ROTS[k]);
      const f = { yaw: o.yaw, pitch: o.pitch, qi: o.qi.slice(), ty: target.yaw, tp: target.pitch };
      st.animate(1200, (t) => {
        o.qi = S.Q.slerp(f.qi, q1, t);
        o.yaw = f.yaw + (target.home.yaw - f.yaw) * t;
        o.pitch = f.pitch + (target.home.pitch - f.pitch) * t;
        target.yaw = f.ty + (target.home.yaw - f.ty) * t;
        target.pitch = f.tp + (target.home.pitch - f.tp) * t;
      });
    }

    /* hints */
    function flashCells(i, cells) {
      const it = items.find((x) => x.t === 'net' && x.i === i);
      gHint.innerHTML = '';
      if (it) cells.forEach((ci) => ctx.s('path', { d: C.pathOf(S.cellPoly(nets[i].g, nets[i].c[ci]).map((q) => [q[0] + it.ox, q[1] + it.oy])) }, gHint));
      const o = nobjs[i];
      cells.forEach((ci) => { o.cells[ci].selected = true; o.cells[ci].selColor = st.theme.gold; });
      st.render();
      clearTimeout(flashCells.t);
      flashCells.t = setTimeout(() => { gHint.innerHTML = ''; sync3(); }, 4500);
    }
    function ruleHint() {
      if (solid === 'cube') return 'A rule worth knowing: two squares in a straight row with **one square between them** always end up opposite each other (the middle square wraps round between them). The two ends of a Z-shaped zigzag are opposite too.';
      return 'On the octahedron, walk from a face across edges along a straight strip of triangles: the face three steps along the strip is opposite where you started.';
    }
    function hint(n) {
      switch (kind) {
        case 'fold':
          if (n === 0) return 'Choose one square to be the bottom and fold the others up round it in your mind. Watch for two squares that want the same side.';
          if (n === 1) return d.answer ? 'It folds: no two squares compete for the same side.' : S.whyNot(d.net);
          return null;
        case 'pick': {
          if (n === 0) return solid === 'cube' ? 'Two quick tests: four squares in a 2 × 2 block never fold, and neither do five squares in a row. Fold the rest in your head.' : 'Around each corner of a ' + SW[solid] + ' meet exactly ' + (solid === 'tetra' ? 'three' : 'four') + ' faces, so a net with more triangles round one point cannot fold.';
          const order = nets.map((_, i) => i).filter((i) => !infos[i].ok).concat(nets.map((_, i) => i).filter((i) => infos[i].ok));
          const i = order.find((x) => !hintMarks.has(x));
          if (i == null) return null;
          hintMarks.add(i);
          refresh();
          return { text: 'Net **' + LET[i] + '** ' + (infos[i].ok ? 'folds.' : 'does not fold: ' + lower(S.whyNot(nets[i]))), show() { flashCells(i, nets[i].c.map((_, k) => k)); } };
        }
        case 'opposite': {
          if (n === 0) return ruleHint();
          if (n === 1) return 'Fold it in your mind with ' + labelWord(d.net, d.ask) + ' as the bottom face: which square comes up to be the lid?';
          if (n === 2) {
            const others = d.net.c.map((_, i) => i).filter((i) => i !== d.ask && i !== d.answer);
            const other = others[(p.id.length + 3) % others.length];
            const two = [d.answer, other].sort((a, b) => a - b);
            return { text: 'It is one of these two: ' + labelWord(d.net, two[0]) + ' or ' + labelWord(d.net, two[1]) + '.', show() { flashCells(0, two); } };
          }
          return null;
        }
        case 'pairs': {
          if (n === 0) return ruleHint();
          const pr = d.answer[(n - 1) % d.answer.length];
          if (n - 1 >= d.answer.length - 1) return null;
          return { text: cap(labelWord(d.net, pr[0])) + ' and ' + labelWord(d.net, pr[1]) + ' are opposite.', show() { flashCells(0, pr); } };
        }
        case 'match': {
          if (n === 0) {
            const pairs = [];
            infos[0].opposite.forEach((j, i) => { if (i < j) pairs.push(short(i) + ' – ' + short(j)); });
            return 'Find the opposite pairs on the net first: **' + pairs.join('**, **') + '**. Two faces of an opposite pair can never be seen side by side on a cube.';
          }
          const left = d.cubes.map((_, k) => k).filter((k) => k !== d.answer && !wrong.has(k) && !hintMarks.has(k));
          if (left.length <= 1 && n > 1) return null;
          const k = left[0];
          if (k == null) return null;
          hintMarks.add(k);
          refresh();
          return cubeReason(L, d.cubes[k], k);
        }
        default: return null;
      }
    }

    /* start */
    layout2();
    wb.allow3D(true);
    const start3D = kind === 'match' || kind === 'pick' || kind === 'fold';
    wb.on('view3d', (on) => { if (on) { st.readTheme(); st.layout(); st.frame(); sync3(); } else { layout2(); draw2(); } });
    if (start3D) wb.set3D(true);
    st.layout();
    st.frame();
    refresh();

    return {
      noMoves: true,
      checkLabel: kind === 'fold' ? 'Check' : 'Answer',
      check(manual) {
        if (done) return { solved: true };
        if (!manual) return { solved: false };
        return submit();
      },
      hint,
      solve() {
        if (kind === 'pick') sel = d.answer.slice();
        else if (kind === 'fold') sel = !!d.answer;
        else if (kind === 'pairs') sel = d.answer.map((x) => x.slice());
        else sel = d.answer;
        first = -1;
        done = true;
        refresh();
        ctx.changed('solve');
        showWhy();
      },
      explain() { return explainText(d); },
      getState() { return { sel, first, done, peeked, tries, wrong: Array.from(wrong), hm: Array.from(hintMarks) }; },
      setState(s) {
        if (!s) return;
        sel = s.sel == null ? sel : C.clone(s.sel);
        first = s.first == null ? -1 : s.first;
        const wasDone = done;
        done = !!s.done;
        peeked = peeked || !!s.peeked;
        tries = Math.max(tries, s.tries || 0);
        wrong = new Set(s.wrong || []);
        hintMarks = new Set(s.hm || []);
        if (done && !wasDone) {
          setFold(1, true);
          infos.forEach((inf, i) => inf.clash.forEach(([a, b]) => { clash[i].add(a); clash[i].add(b); }));
        }
        if (!done) clash.forEach((c) => c.clear());
        refresh();
      },
      destroy() { st.destroy(); wb.handlers.board = null; clearTimeout(flashCells.t); }
    };
  }

  // the cells joined to cell `from` (indices)
  function component(net, from) {
    if (!net.c.length) return [];
    const adj = sp().netAdj(net), seen = new Set([from]), out = [from];
    for (let k = 0; k < out.length; k++) {
      const i = out[k];
      adj.forEach((e) => {
        const j = e.a === i ? e.b : e.b === i ? e.a : -1;
        if (j >= 0 && !seen.has(j)) { seen.add(j); out.push(j); }
      });
    }
    return out;
  }
  const subNet = (net, idx) => ({ g: net.g, c: idx.map((i) => net.c[i]), l: net.l ? idx.map((i) => net.l[i]) : undefined });

  // why a net that folds into a cube is not the cube wanted
  function mismatch(lab, target, die) {
    const S = sp();
    const where = (l, sym) => l.findIndex((e) => e && e[0] === sym);
    for (const e of target) {
      if (!e) continue;
      const a = where(target, e[0]), b = where(lab, e[0]);
      const oa = target[S.oppDir(a)], ob = lab[S.oppDir(b)];
      if (oa && ob && oa[0] !== ob[0]) return S.symName(e[0]) + ' should be opposite ' + S.symName(oa[0]) + (die ? ' (they add up to 7)' : '') + '.';
    }
    const t4 = target.map((e) => (e ? [e[0], null] : e)), l4 = lab.map((e) => (e ? [e[0], null] : e));
    if (!S.sameLab(t4, l4)) return 'the faces go round the wrong way: your net makes the mirror image.';
    return 'a picture is turned the wrong way. Fold it in 3D and compare the two side by side.';
  }

  /* ---------- build: put the missing squares back ---------- */

  function mountBuild(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb;
    const net = d.net, GW = d.grid[0], GH = d.grid[1];
    const fixedPos = new Set(d.fixed.map((i) => net.c[i].join(',')));
    const target = S.foldNet(net).lab;
    const loose = net.c.map((_, i) => i).filter((i) => !d.fixed.includes(i));
    const trayX = GW + 0.8, picX = GW + 2.9;
    const word = d.die ? 'die' : 'cube';
    let foldT = 0;

    // the page: grid, fixed squares, the tray and the finished die from two sides
    const g2 = ctx.s('g', { class: 'nt nt-build' }, wb.layer('bg'));
    const gHint = ctx.s('g', { class: 'nt-hint' }, wb.layer('top'));
    let s = '';
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) s += '<rect class="nt-gcell" x="' + x + '" y="' + y + '" width="1" height="1"/>';
    s += netSVG(subNet(net, d.fixed), 0, 0, { key: 'f' });
    s += '<rect class="nt-tray" x="' + (trayX - 0.15) + '" y="-0.15" width="1.3" height="' + (loose.length * 1.3 + 0.1) + '" rx="0.2"/>';
    s += '<text class="nt-cap" x="' + (picX + 1.35) + '" y="-0.2" text-anchor="middle">The ' + word + '…</text>';
    s += cubeSVG(target, picX + 1.35, 1.35, 1.25, -35, 24);
    s += '<text class="nt-cap" x="' + (picX + 1.35) + '" y="3.25" text-anchor="middle">…from the other side</text>';
    s += cubeSVG(target, picX + 1.35, 4.8, 1.25, 145, -24);
    g2.innerHTML = s;
    const H = Math.max(GH, 6.3, loose.length * 1.3);
    wb.setBounds({ x0: -0.4, y0: -0.8, x1: picX + 2.8, y1: H + 0.3 }, 0.05);

    wb.type('ntsq', {
      draw(g, o) {
        const lab = S.labelOf(net, o.data.i);
        g.innerHTML = '<rect x="-0.5" y="-0.5" width="1" height="1" rx="0.04" class="nt-sq" fill="' + S.faceColor(lab[0]) + '"/>' +
          '<g transform="scale(0.0088)" pointer-events="none">' + S.symSVG(lab[0], lab[1] || 0) + '</g>';
      },
      poly() { return [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]; }
    });
    const rng = ctx.rng;
    loose.forEach((i, k) => {
      const lab = S.labelOf(net, i);
      const o = S.symOrder(lab[0]);
      const rot = o === 4 ? 0 : o === 2 ? 90 : 90 * rng.range(1, 3);
      wb.add({ id: 'sq' + i, type: 'ntsq', kind: 'netsq', name: 'Square ' + (k + 1), x: trayX + 0.5, y: 0.5 + k * 1.3, rot, rotate: 90, move: true, snap: true, data: { i } });
    });
    const pieces = () => wb.all().filter((o) => o.type === 'ntsq');
    wb.handlers.snap = (o, at) => {
      const cx = Math.floor(at.x), cy = Math.floor(at.y);
      if (cx < 0 || cy < 0 || cx >= GW || cy >= GH) return null;
      if (Math.hypot(at.x - cx - 0.5, at.y - cy - 0.5) > 0.42) return null;
      if (fixedPos.has(cx + ',' + cy)) return null;
      if (pieces().some((q) => q !== o && Math.abs(q.x - cx - 0.5) < 0.01 && Math.abs(q.y - cy - 0.5) < 0.01)) return null;
      return { x: cx + 0.5, y: cy + 0.5 };
    };
    wb.on('tap', (e) => {
      const o = e && e.obj;
      if (!o || o.type !== 'ntsq') return;
      o.rot = ((o.rot || 0) + 90) % 360;
      wb.place(o);
      wb.drawSel();
      ctx.sfx('tap');
      ctx.changed('turn');
    });

    function attempt() {
      const cells = [], labs = [], placed = [];
      d.fixed.forEach((i) => { cells.push(net.c[i]); labs.push(S.labelOf(net, i)); });
      pieces().forEach((o) => {
        const i = o.data.i, fx = o.x - 0.5, fy = o.y - 0.5;
        const r = Math.round((o.rot || 0) / 90);
        if (Math.abs(fx - Math.round(fx)) > 0.02 || Math.abs(fy - Math.round(fy)) > 0.02 || Math.abs((o.rot || 0) - r * 90) > 1) return;
        const x = Math.round(fx), y = Math.round(fy);
        if (x < 0 || y < 0 || x >= GW || y >= GH) return;
        const lab = S.labelOf(net, i);
        cells.push([x, y]);
        labs.push([lab[0], ((lab[1] + r) % 4 + 4) % 4]);
        placed.push(i);
      });
      return { net: { g: 's', c: cells, l: labs }, placed };
    }
    function judge() {
      const a = attempt();
      if (a.placed.length < loose.length) return { solved: false, msg: 'Put every loose square on the grid first.' };
      if (!S.netConnected(a.net)) return { solved: false, msg: 'The squares must all join edge to edge.' };
      const r = S.foldNet(a.net);
      if (!r.ok) return { solved: false, msg: 'That does not fold into a cube: ' + lower(S.whyNot(a.net)) };
      if (!S.sameLab(r.lab, target)) return { solved: false, msg: 'It folds into a cube, but not into this ' + word + ': ' + lower(mismatch(r.lab, target, d.die)) };
      return { solved: true, msg: 'It folds into exactly this ' + word + '.' };
    }

    // 3D: your net (the part joined to the fixed squares) beside the finished die
    const st = new S.Stage(ctx, {});
    let aobj = null;
    const dobj = cubeObject(st, target, { id: 'die', label: 'The ' + word });
    function rebuild3() {
      if (aobj) st.remove(aobj);
      const a = attempt();
      const comp = component(a.net, 0);
      aobj = netObject(st, subNet(a.net, comp), { id: 'attempt', label: 'Your net' });
      st.objs = [aobj, dobj];
      aobj.setFold(foldT);
      st.layout();
      st.frame();
    }
    const fb = foldBar(ctx, {
      title: 'Test your net in 3D',
      note: 'Fold your net and hold it beside the ' + word + ' — as often as you like.',
      onSlide: (t) => { if (!wb.is3D) wb.set3D(true); setFold(t); },
      onPlay: () => { if (!wb.is3D) wb.set3D(true); foldTo(foldT > 0.5 ? 0 : 1, 1400); },
      onHome: () => homeAll(st, st.objs, foldT)
    });
    function setFold(t, quiet) { foldT = t; if (aobj) aobj.setFold(t); fb.set(t); st.layout(); st.frame(true); if (!quiet) st.render(); }
    function foldTo(t1, ms) { const t0 = foldT; st.animate(ms, (e) => setFold(t0 + (t1 - t0) * e, true)); }
    const panel = ctx.h('div.nt-panel', ctx.h('div.nt-status', { html: 'Drag each loose square onto the grid. <b>Tap</b> a square (or press R) to turn it a quarter turn.' }), fb.el);
    ctx.panel.appendChild(panel);
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) { st.readTheme(); rebuild3(); } else wb.fit(); });
    wb.on('change', () => { if (wb.is3D) rebuild3(); });
    wb.on('restore', () => { gHint.innerHTML = ''; if (wb.is3D) rebuild3(); });

    return {
      noMoves: true,
      check(manual) { const r = judge(); return r.solved ? r : { solved: false, msg: manual ? r.msg : '' }; },
      hint(n) {
        if (n === 0) return d.die ? 'On a die, opposite faces add up to 7: 1 is opposite 6, 2 opposite 5, 3 opposite 4. And squares with one square between them in a row end up opposite.' : 'Work out which faces must be opposite each other on the ' + word + ', then use the rule: squares with one square between them in a row end up opposite.';
        const i = loose[n - 1];
        if (i == null) return null;
        const lab = S.labelOf(net, i), c = net.c[i];
        return {
          text: cap(S.symName(lab[0])) + ' can go in the square marked on the grid, turned as shown there.',
          show() {
            gHint.innerHTML = '<rect x="' + c[0] + '" y="' + c[1] + '" width="1" height="1"/><g transform="translate(' + (c[0] + 0.5) + ' ' + (c[1] + 0.5) + ') scale(0.0088)" opacity=".55">' + S.symSVG(lab[0], lab[1] || 0) + '</g>';
            clearTimeout(this.t);
            setTimeout(() => { gHint.innerHTML = ''; }, 6000);
          }
        };
      },
      solve() {
        pieces().forEach((o) => { const c = net.c[o.data.i]; wb.update(o, { x: c[0] + 0.5, y: c[1] + 0.5, rot: 0 }); });
        ctx.changed('solve');
        if (wb.is3D) { rebuild3(); foldTo(1, 1400); }
      },
      explain() { return explainText(d); },
      getState() { return null; },
      setState() { if (wb.is3D) rebuild3(); },
      destroy() { st.destroy(); wb.handlers.snap = null; }
    };
  }

  /* ---------- all: collect every net ---------- */

  function mountAll(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb;
    const solid = d.solid || 'cube', sol = S.SOLIDS[solid], g = sol.grid, N = sol.faces;
    const all = S.solidNets(solid);
    const GW = d.grid[0], GH = d.grid[1];
    let shaded = [], found = [], foldT = 0;
    const keyOf = (c) => c[0] + ',' + c[1];

    const g2 = ctx.s('g', { class: 'nt nt-all' }, wb.layer('board'));
    const gHint = ctx.s('g', { class: 'nt-hint' }, wb.layer('top'));
    const cells = [];
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) cells.push([x, y]);
    let bx1 = 0, by1 = 0;
    cells.forEach((c) => S.cellPoly(g, c).forEach((q) => { bx1 = Math.max(bx1, q[0]); by1 = Math.max(by1, q[1]); }));
    wb.setBounds({ x0: -0.3, y0: -0.3, x1: bx1 + 0.3, y1: by1 + 0.3 }, 0.06);
    function draw2() {
      const on = new Set(shaded.map(keyOf));
      g2.innerHTML = cells.map((c) => '<path class="nt-gcell' + (on.has(keyOf(c)) ? ' on' : '') + '" data-key="g-' + c[0] + '-' + c[1] + '" d="' + C.pathOf(S.cellPoly(g, c)) + '"/>').join('');
      wb.applyPaints();
    }
    function cellAt(pt) { return cells.find((c) => pointIn(pt, S.cellPoly(g, c))); }
    function toggle(c) {
      const k = shaded.findIndex((q) => keyOf(q) === keyOf(c));
      if (k >= 0) shaded.splice(k, 1);
      else {
        if (shaded.length >= N) { ctx.toast('Only ' + N + ' at a time — clear one first.'); return; }
        shaded.push(c.slice());
      }
      ctx.sfx('tap');
      draw2();
      ctx.changed('shade');
      if (shaded.length === N) setTimeout(test, 250);
      if (wb.is3D) rebuild3();
      drawPanel();
    }
    function test() {
      if (shaded.length !== N) return;
      const net = { g, c: shaded };
      if (!S.netConnected(net)) { ctx.say('Those ' + N + ' do not all join edge to edge.', 'warn'); return; }
      if (!S.netFolds(net)) { ctx.say('That shape does not fold: ' + lower(S.whyNot(net)), 'warn'); ctx.sfx('wrong'); return; }
      const key = S.freeKey(g, shaded);
      if (found.includes(key)) { ctx.say('You have that one already — it is the same net turned round or over.', 'warn'); return; }
      found.push(key);
      shaded = [];
      ctx.sfx('snap');
      ctx.say('**Net ' + found.length + ' of ' + all.length + '!**' + (found.length < all.length ? ' The grid is clear for the next one.' : ''), 'good');
      draw2();
      drawPanel();
      if (wb.is3D) rebuild3();
      ctx.changed('found');
    }
    wb.handlers.board = {
      down(pt) { const c = cellAt(pt); if (!c) return false; toggle(c); return true; },
      hover(pt) { wb.svg.style.cursor = cellAt(pt) ? 'pointer' : ''; }
    };

    // the panel: the collection
    const counter = ctx.h('div.nt-status');
    const gallery = ctx.h('div.nt-gallery');
    const fb = foldBar(ctx, {
      title: 'Fold your shading in 3D',
      note: 'Test a shape before it counts: fold it and see whether it closes.',
      onSlide: (t) => { if (!wb.is3D) wb.set3D(true); setFold(t); },
      onPlay: () => { if (!wb.is3D) wb.set3D(true); foldTo(foldT > 0.5 ? 0 : 1, 1400); },
      onHome: () => homeAll(st, st.objs, foldT)
    });
    const clearBtn = ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => { shaded = []; draw2(); drawPanel(); if (wb.is3D) rebuild3(); ctx.changed('shade'); } }, 'Clear the grid');
    ctx.panel.appendChild(ctx.h('div.nt-panel', counter, gallery, ctx.h('div.nt-ans', clearBtn), fb.el));
    function miniNet(cells2) {
      const net = { g, c: cells2 };
      const b = netBox(net);
      return '<svg viewBox="' + f3(b.x0 - 0.2) + ' ' + f3(b.y0 - 0.2) + ' ' + f3(b.w + 0.4) + ' ' + f3(b.h + 0.4) + '">' + netSVG(net, 0, 0, { fill: () => '#9fb0ff' }) + '</svg>';
    }
    const cellsOfKey = (k) => k.split(';').map((q) => q.split(',').map(Number));
    function drawPanel() {
      counter.innerHTML = 'Found <b>' + found.length + '</b> of ' + all.length + '. Shaded now: ' + shaded.length + ' of ' + N + '.';
      let h = '';
      for (let i = 0; i < all.length; i++) h += '<div class="nt-slot' + (i < found.length ? ' got' : '') + '">' + (i < found.length ? miniNet(cellsOfKey(found[i])) : String(i + 1)) + '</div>';
      gallery.innerHTML = h;
    }

    // 3D: the shaded shape, ready to fold
    const st = new S.Stage(ctx, {});
    let sobj = null;
    function rebuild3() {
      if (sobj) st.remove(sobj);
      sobj = null;
      if (shaded.length) {
        const net = { g, c: shaded.slice() };
        sobj = netObject(st, subNet(net, component(net, 0)), { id: 'shape', label: shaded.length === N ? null : shaded.length + ' of ' + N });
        sobj.setFold(foldT);
      }
      st.layout();
      st.frame();
    }
    function setFold(t, quiet) { foldT = t; if (sobj) sobj.setFold(t); fb.set(t); st.layout(); st.frame(true); if (!quiet) st.render(); }
    function foldTo(t1, ms) { const t0 = foldT; st.animate(ms, (e) => setFold(t0 + (t1 - t0) * e, true)); }
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) { st.readTheme(); rebuild3(); } else wb.fit(); });

    draw2();
    drawPanel();
    return {
      noMoves: true,
      check(manual) {
        if (found.length >= all.length) return { solved: true, msg: 'All ' + all.length + ' nets!' };
        return { solved: false, msg: manual ? 'You have ' + found.length + ' of the ' + all.length + ' so far.' : '' };
      },
      hint(n) {
        if (n === 0) return solid === 'cube' ? 'Start with a row of four squares (the belt round the cube) and put one square above it and one below: that gives six of the eleven. The other five have no row of four.' : 'Many octahedron nets are a zigzag strip of six triangles with one more stuck on at each end; try the extra ones on the same side and on opposite sides.';
        const miss = all.filter((x) => !found.includes(x.key));
        if (!miss.length) return null;
        const m = miss[(n - 1) % miss.length];
        return {
          text: 'Here is the outline of one you have not found yet.',
          show() {
            gHint.innerHTML = '<g class="nt-ghost">' + m.cells.map((c) => '<path d="' + C.pathOf(S.cellPoly(g, c)) + '"/>').join('') + '</g>';
            setTimeout(() => { gHint.innerHTML = ''; }, 5000);
          }
        };
      },
      solve() {
        found = all.map((x) => x.key);
        shaded = [];
        draw2();
        drawPanel();
        ctx.changed('solve');
      },
      explain() { return explainText(d); },
      getState() { return { shaded: shaded.map((c) => c.slice()), found: found.slice() }; },
      setState(s) {
        if (!s) return;
        shaded = (s.shaded || []).map((c) => c.slice());
        found = (s.found || []).filter((k) => all.some((x) => x.key === k));
        draw2();
        drawPanel();
        if (wb.is3D) rebuild3();
      },
      destroy() { st.destroy(); wb.handlers.board = null; }
    };
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'nets',
    name: 'Nets of solids',
    deps: ['js/lib/space3d.js'],
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'A **net** is a flat pattern that folds along its edges into a solid. Click nets, faces or cubes to choose them, then press **Answer**. The **3D** button (or key 3) shows everything in 3D: **drag** a net or a cube to turn it, drag the empty table to turn them all, scroll to zoom. The **Fold** slider folds the nets up — watch the faces hinge round their edges. Folding before you answer is allowed, but it gives the game away, so the puzzle is then worth one star at most; each wrong answer costs a star too. In the flat view you can paint faces and write on the page.',

    verify,
    generate(rng, level) { return generate(rng, level); },

    mount(ctx, p) {
      const kind = p.data.kind;
      if (kind === 'build') return mountBuild(ctx, p);
      if (kind === 'all') return mountAll(ctx, p);
      return mountQuestion(ctx, p);
    },

    thumb(p) {
      const S = sp();
      if (!S) return '';
      const d = p.data;
      let nets = d.kind === 'pick' ? d.nets.slice(0, 3) : d.net ? [d.net] : [];
      if (d.kind === 'all') nets = [{ g: d.solid === 'octa' ? 't' : 's', c: S.solidNets(d.solid || 'cube')[3].cells, l: null }];
      let s = '', x = 0, y0 = Infinity, y1 = -Infinity;
      nets.forEach((net) => {
        const b = netBox(net);
        const show = d.kind === 'build' ? { g: net.g, c: net.c, l: net.l.map((l, i) => (d.fixed.includes(i) ? l : null)) } : net;
        s += netSVG(show, x - b.x0, -b.y0, { sw: 0.05, fill: d.kind === 'build' ? (i) => (d.fixed.includes(i) ? null : 'rgba(160,170,210,.35)') : null });
        x += b.w + 0.7;
        y0 = Math.min(y0, 0); y1 = Math.max(y1, b.h);
      });
      if (d.kind === 'match' || d.kind === 'build') {
        const lab = d.kind === 'match' ? d.cubes[d.answer] : S.foldNet(d.net).lab;
        s += cubeSVG(lab, x + 0.9, y1 / 2, 1.1);
        x += 2;
        y0 = Math.min(y0, y1 / 2 - 1.1); y1 = Math.max(y1, y1 / 2 + 1.1);
      }
      const w = Math.max(x - 0.7, 1);
      return '<svg viewBox="' + f3(-0.3) + ' ' + f3(y0 - 0.3) + ' ' + f3(w + 0.6) + ' ' + f3(y1 - y0 + 0.6) + '" preserveAspectRatio="xMidYMid meet"><g class="nt">' + s + '</g></svg>';
    }
  });

  C.nets = { verify, makePick, makeFold, makeOpposite, makePairs, makeMatch, makeBuild, makeAll, generate, catalogue: cat, netType, explainText, cubeReason };

  C.css('nets', `
    .nt-cell { stroke: #3a3f62; stroke-width: .035; stroke-linejoin: round; }
    .nt-net.pickable .nt-cell { cursor: pointer; }
    .nt-net.sel .nt-cell { stroke: var(--gold); stroke-width: .075; }
    .nt-net.good .nt-cell { stroke: var(--green); stroke-width: .075; }
    .nt-net.bad .nt-cell { stroke: var(--red); stroke-width: .075; }
    .nt-cell.ask { stroke: var(--accent); stroke-width: .1; }
    .nt-cell.on { stroke: var(--gold); stroke-width: .1; }
    .nt-cell.good { stroke: var(--green); stroke-width: .1; }
    .nt-cube { cursor: pointer; }
    .nt-cubehit { fill: transparent; stroke: none; }
    .nt-cube.sel .nt-cubehit { fill: rgba(255, 209, 102, .13); stroke: var(--gold); stroke-width: .05; }
    .nt-cube.good .nt-cubehit { fill: rgba(78, 203, 141, .14); stroke: var(--green); stroke-width: .05; }
    .nt-cube.bad { opacity: .42; }
    .nt-tag rect { fill: var(--panel-2); stroke: var(--line); stroke-width: .03; }
    .nt-tag text { font: 700 .32px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .nt-tag.sel rect { fill: var(--gold); stroke: none; } .nt-tag.sel text { fill: #1b2140; }
    .nt-tag.good rect { fill: var(--green); stroke: none; } .nt-tag.good text { fill: #10281c; }
    .nt-tag.bad rect { fill: var(--red); stroke: none; } .nt-tag.bad text { fill: #2a1010; }
    .nt-hint path, .nt-hint rect { fill: rgba(255, 209, 102, .16); stroke: var(--gold); stroke-width: .08; stroke-dasharray: .16 .1; animation: ntpulse 1s ease-in-out infinite; }
    .nt-ghost path { fill: rgba(108, 123, 255, .18); stroke: var(--accent); stroke-width: .06; stroke-dasharray: .14 .1; }
    @keyframes ntpulse { 50% { opacity: .45; } }
    .nt-gcell { fill: var(--cell); stroke: var(--grid-2); stroke-width: .025; cursor: pointer; }
    .nt-all .nt-gcell:hover { fill: var(--board-2); }
    .nt-gcell.on { fill: #8f9eff; stroke: #3a3f62; stroke-width: .04; }
    .nt-build .nt-gcell { cursor: default; }
    .nt-tray { fill: var(--board-2); stroke: var(--line); stroke-width: .03; stroke-dasharray: .1 .08; }
    .nt-cap { font: 600 .3px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .k-netsq .nt-sq { stroke: #3a3f62; stroke-width: .035; }
    .k-netsq.sel .nt-sq { stroke: var(--gold); stroke-width: .07; }
    .nt-panel { width: 100%; display: flex; flex-direction: column; gap: 10px; }
    .nt-ans { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .nt-chip { min-width: 38px; height: 34px; padding: 0 10px; border-radius: 10px; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); font: 700 .95rem "Segoe UI", system-ui, sans-serif; cursor: pointer; }
    .nt-chip:hover { border-color: var(--accent); }
    .nt-chip.sel { border-color: var(--gold); background: rgba(255, 209, 102, .2); }
    .nt-chip.good { border-color: var(--green); background: rgba(78, 203, 141, .2); }
    .nt-chip.bad { border-color: var(--red); color: var(--muted); text-decoration: line-through; }
    .nt-go { margin-left: auto; }
    .nt-status { font-size: .88rem; color: var(--muted); line-height: 1.45; }
    .nt-status b { color: var(--text); }
    .nt-fold { background: var(--panel-2); border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
    .nt-foldhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: .88rem; }
    .nt-foldrow { display: flex; align-items: center; gap: 8px; }
    .nt-slider { flex: 1; min-width: 60px; accent-color: var(--accent); }
    .nt-end { font-size: .74rem; color: var(--muted); }
    .nt-note { font-size: .78rem; color: var(--muted); line-height: 1.4; }
    .nt-gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .nt-slot { aspect-ratio: 1; border: 1px dashed var(--line); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--faint); font-size: .8rem; }
    .nt-slot.got { border-style: solid; border-color: var(--green); background: rgba(78, 203, 141, .08); }
    .nt-slot svg { width: 88%; height: 88%; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
