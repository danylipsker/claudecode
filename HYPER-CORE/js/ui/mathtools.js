/* HYPER-CORE · ui/mathtools.js — Tools → SVD lab of Hyper Math (#/tools/svdlab/<decompose|algorithm|geometry|image|fit|pca>)
 *
 *   decompose   type any matrix up to 8 × 8 (or pick a preset) and read A = U Σ Vᵀ, the singular values, rank, norms,
 *               condition number, determinant, the four fundamental subspaces, the best rank-k approximation, the
 *               pseudoinverse and the solution of A x = b (exact, least squares or minimum norm)
 *   algorithm   the one-sided Jacobi rotations that compute the decomposition, one step at a time
 *   geometry    the 2 × 2 picture: unit circle to ellipse, in three stages (the svd-geometry simulation, fed the matrix)
 *   image       a picture as a matrix: built-in pictures or the reader's own file, compressed to rank k, with its spectrum
 *   fit         least squares with the pseudoinverse against the normal equations, truncation and Tikhonov, on draggable points
 *   pca         principal components of built-in or pasted data: scores, loadings, scree plot, covariance matrix
 *
 * The arithmetic is HYPER-CORE/js/linalg.js (kit.linalg); the pictures of the image tab come from HYPER-MATH/sims/svd.js
 * (Hyper.svdDemo). The matrix typed in the first tab is kept (Hyper.mathTools.svdState) and used by the other tabs.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, L = H.linalg;
  const T = H.mathTools = H.mathTools || {};
  const TABS = [['decompose', 'Decompose a matrix'], ['algorithm', 'Watch the algorithm'], ['geometry', 'Geometry (2 × 2)'], ['image', 'Compress a picture'], ['fit', 'Fit data'], ['pca', 'Principal components']];
  const D2R = Math.PI / 180;

  /* ---------------------------------------------------------------- shared bits */
  function subtabs(el, base, tabs, sub, note) {
    const tab = tabs.some(t => t[0] === sub) ? sub : tabs[0][0];
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + tabs.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' + (note ? '<p class="small faint mt">' + note + '</p>' : '');
    return { tab, body: ui.$('.mbody', el) };
  }
  /* two columns: controls on the left, a stage (optional) and results on the right */
  function lab(el, intro, aspect, noStage) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') + '<div class="pjlab"><div class="pjside"></div><div>' + (noStage ? '' : '<div class="pjstage"></div>') + '<div class="pjunder"></div></div></div>';
    const stageEl = noStage ? null : ui.$('.pjstage', el);
    const st = stageEl ? K.stage(stageEl, { aspect: aspect || 0.6, minH: 280, maxH: 720 }) : null;
    return { side: ui.$('.pjside', el), stage: stageEl, under: ui.$('.pjunder', el), st };
  }
  const box = (title, html) => '<div class="boxy" style="margin-top:10px"><h3>' + title + '</h3>' + html + '</div>';
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';
  function more(ids) { const a = ids.filter(id => H.nodes.has(id)); return a.length ? '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + a.map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.titleOf(id)) + '</a>').join('') + '</div>' : ''; }
  function table(head, rows, opts) {
    return '<div class="tablewrap" style="' + (opts && opts.maxHeight ? 'max-height:' + opts.maxHeight + 'px;overflow:auto' : '') + '"><table class="optable"><thead><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
      rows.map(r => '<tr' + (r.hl ? ' class="hl"' : '') + '>' + (r.cells || r).map(c => '<td' + (typeof c === 'number' ? ' class="num"' : '') + '>' + (typeof c === 'number' ? L.fmt(c, 4) : c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  const tex = (src, display) => H.texSafe(src, display);
  const mtex = (M, d, o) => tex(L.toTex(M, d == null ? 3 : d, o), true);
  const vtex = (v, d) => tex(L.toTex(v.map(x => [x]), d == null ? 3 : d), true);
  const f = L.fmt;
  const row = (...parts) => '<div class="row" style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">' + parts.join('') + '</div>';
  const onTheme = (fn) => { document.addEventListener('hyper:theme', fn); ui.onLeave(() => document.removeEventListener('hyper:theme', fn)); };

  /* the matrix shared by the tabs */
  const PRESETS = [
    ['The hand example  [3 0; 4 5]', [[3, 0], [4, 5]]],
    ['Symmetric  [2 1; 1 2]', [[2, 1], [1, 2]]],
    ['Rotation by 30°', [[0.866, -0.5], [0.5, 0.866]]],
    ['Shear  [1 1; 0 1]', [[1, 1], [0, 1]]],
    ['Projection onto the line y = x', [[0.5, 0.5], [0.5, 0.5]]],
    ['Nearly singular  [1 1; 1 1.0001]', [[1, 1], [1, 1.0001]]],
    ['Rank one, 3 × 2  [1 2; 2 4; 3 6]', [[1, 2], [2, 4], [3, 6]]],
    ['Rank 2 of 3  [1 2 3; 4 5 6; 7 8 9]', [[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
    ['Magic square 3 × 3', [[8, 1, 6], [3, 5, 7], [4, 9, 2]]],
    ['Tall 4 × 2: a line-fit design matrix', [[1, 0], [1, 1], [1, 2], [1, 3]]],
    ['Wide 2 × 4', [[1, 2, 3, 4], [2, 0, 1, 3]]],
    ['Identity 3 × 3', [[1, 0, 0], [0, 1, 0], [0, 0, 1]]],
    ['Hilbert 4 × 4 (ill-conditioned)', L.hilbert(4)],
    ['Hilbert 6 × 6 (very ill-conditioned)', L.hilbert(6)],
    ['Random 5 × 4', (() => { const g = L.rng(42); return Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => Math.round(g.normal() * 20) / 10)); })()]
  ];
  const state = T.svdState = T.svdState || (function () {
    try { const s = JSON.parse(sessionStorage.getItem('hyper:svdlab') || 'null'); if (s && Array.isArray(s.A) && L.parse(L.toText(s.A))) return s; } catch (e) { /* no storage */ }
    return { A: PRESETS[0][1].map(r => r.slice()), preset: 0 };
  })();
  function remember() { try { sessionStorage.setItem('hyper:svdlab', JSON.stringify({ A: state.A, preset: state.preset })); } catch (e) { /* ignore */ } }

  /* a number box with ▲/▼ spinners: click steps ±0.1 (Shift: ±1), press-and-hold repeats, arrow keys work too;
     `commit` is called with the input after every step so the owner can re-read it */
  function spin(inp, commit) {
    const wrap = ui.el('<span class="mspin"><span class="sb"><button type="button" tabindex="-1" title="+0.1 (Shift: +1, hold to repeat)">▲</button><button type="button" tabindex="-1" title="−0.1 (Shift: −1, hold to repeat)">▼</button></span></span>');
    wrap.insertBefore(inp, wrap.firstChild);
    const step = (dir, big) => {
      const p = L.parse(inp.value), v = p ? p[0][0] : 0, s = big ? 1 : 0.1;
      inp.value = U.fmtInput(Math.round((v + dir * s) * 1e9) / 1e9, 6);
      commit(inp);
    };
    const hold = (btn, dir) => {
      let t = null, iv = null;
      const stop = () => { clearTimeout(t); clearInterval(iv); t = iv = null; };
      btn.addEventListener('pointerdown', e => { e.preventDefault(); const big = e.shiftKey; step(dir, big); t = setTimeout(() => { iv = setInterval(() => step(dir, big), 80); }, 400); });
      ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach(ev => btn.addEventListener(ev, stop));
    };
    const btns = wrap.querySelectorAll('button');
    if (btns[0]) { hold(btns[0], +1); hold(btns[1], -1); }
    inp.addEventListener('keydown', e => { if (e.key === 'ArrowUp') { e.preventDefault(); step(+1, e.shiftKey); } else if (e.key === 'ArrowDown') { e.preventDefault(); step(-1, e.shiftKey); } });
    return wrap;
  }

  /* the matrix editor: a grid of inputs, presets, size, transpose, random, and a text box for pasting */
  function editor(side, onChange) {
    const bx = ui.el('<div class="boxy"><h3>The matrix A</h3>' +
      '<select class="inp mpre" style="width:100%"><option value="-1">Preset…</option>' + PRESETS.map((p, i) => '<option value="' + i + '"' + (state.preset === i ? ' selected' : '') + '>' + esc(p[0]) + '</option>').join('') + '</select>' +
      '<div class="row mt" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span class="small muted">rows</span><select class="inp mrows">' + [1, 2, 3, 4, 5, 6, 7, 8].map(n => '<option' + (n === state.A.length ? ' selected' : '') + '>' + n + '</option>').join('') + '</select>' +
      '<span class="small muted">columns</span><select class="inp mcols">' + [1, 2, 3, 4, 5, 6, 7, 8].map(n => '<option' + (n === state.A[0].length ? ' selected' : '') + '>' + n + '</option>').join('') + '</select>' +
      '<button class="btn sm ghost mT" title="transpose">Aᵀ</button><button class="btn sm ghost mR" title="random entries">random</button></div>' +
      '<div class="mgrid mt" style="overflow:auto"></div>' +
      '<details class="mt"><summary class="small muted">Paste rows of numbers instead</summary><textarea class="inp mtext" rows="3" style="width:100%;margin-top:6px;font-family:monospace;font-size:12px"></textarea><div class="btnrow mt"><button class="btn sm mApply">Apply</button></div></details>' +
      '<p class="small faint mt" style="margin-bottom:0">Numbers, fractions such as 1/3, or 1e-3. Up to 8 × 8. The matrix is kept for the other tabs.</p></div>');
    side.appendChild(bx);
    const grid = ui.$('.mgrid', bx), text = ui.$('.mtext', bx), rowsSel = ui.$('.mrows', bx), colsSel = ui.$('.mcols', bx), preSel = ui.$('.mpre', bx);
    function drawGrid() {
      const A = state.A, m = A.length, n = A[0].length, w = n > 5 ? 52 : 64;
      grid.innerHTML = '<table style="border-collapse:separate;border-spacing:3px"><tbody>' + A.map(r => '<tr>' + r.map(() => '<td></td>').join('') + '</tr>').join('') + '</tbody></table>';
      const tds = grid.querySelectorAll('td');
      A.forEach((r, i) => r.forEach((x, j) => {
        const inp = ui.el('<input class="inp mcell" data-i="' + i + '" data-j="' + j + '" value="' + esc(U.fmtInput(x, 6)) + '" style="width:' + w + 'px;padding:4px 5px;text-align:right;font-size:12.5px">');
        const td = tds[i * n + j];
        if (td) td.appendChild(spin(inp, () => { if (readGrid()) changed(); }));
      }));
      text.value = L.toText(A);
      if (rowsSel.value !== undefined) { rowsSel.value = String(m); colsSel.value = String(n); }
    }
    function readGrid() {
      const cells = Array.from(grid.querySelectorAll('input'));
      if (!cells.length) return false;
      const A = state.A.map(r => r.slice());
      let ok = true;
      for (const c of cells) {
        const i = +c.dataset.i, j = +c.dataset.j;
        const p = L.parse(c.value);
        if (!p) { ok = false; c.style.borderColor = 'var(--bad, #e5484d)'; continue; }
        c.style.borderColor = '';
        A[i][j] = p[0][0];
      }
      if (!ok) return false;
      state.A = A; state.preset = -1; return true;
    }
    const changed = () => { remember(); text.value = L.toText(state.A); if (preSel.value !== undefined) preSel.value = String(state.preset); onChange(); };
    grid.addEventListener('change', () => { if (readGrid()) changed(); });
    grid.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (readGrid()) changed(); } });
    preSel.addEventListener('change', () => { const i = +preSel.value; if (i >= 0) { state.A = PRESETS[i][1].map(r => r.slice()); state.preset = i; drawGrid(); changed(); } });
    const resize = () => {
      const m = +rowsSel.value || state.A.length, n = +colsSel.value || state.A[0].length;
      const A = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => (state.A[i] && state.A[i][j] != null ? state.A[i][j] : 0)));
      state.A = A; state.preset = -1; drawGrid(); changed();
    };
    rowsSel.addEventListener('change', resize); colsSel.addEventListener('change', resize);
    ui.$('.mT', bx).onclick = () => { state.A = L.T(state.A); state.preset = -1; drawGrid(); changed(); };
    ui.$('.mR', bx).onclick = () => { const g = L.rng(Date.now() & 0xffff); state.A = state.A.map(r => r.map(() => Math.round(g.normal() * 20) / 10)); state.preset = -1; drawGrid(); changed(); };
    ui.$('.mApply', bx).onclick = () => { const P = L.parse(text.value); if (!P) { ui.toast('Could not read the matrix: rows of numbers, the same count on every row.'); return; } if (P.length > 8 || P[0].length > 8) { ui.toast('Up to 8 × 8 here.'); return; } state.A = P; state.preset = -1; drawGrid(); changed(); };
    drawGrid();
    return { redraw: drawGrid };
  }

  /* ---------------------------------------------------------------- the lab */
  T.svdlab = function (el, params, sub) {
    const t = subtabs(el, 'svdlab', TABS, sub, 'Every number here is computed in the browser by the one-sided Jacobi method (HYPER-CORE/js/linalg.js); nothing is looked up. Rounding shows in the last digit of a "zero".');
    ({ decompose, algorithm, geometry, image, fit, pca })[t.tab](t.body, params);
  };
  T.svdlab.tabs = TABS.map(t => t[0]);
  T.svdlab.dom = true;

  /* ================================================================ decompose */
  function decompose(el) {
    const Lb = lab(el, 'Type a matrix — any shape up to 8 × 8 — and read everything the singular value decomposition says about it. Click a column header of the grid to edit; press Enter or leave a cell to recompute.', 0, true);
    const main = Lb.under;
    main.innerHTML = '<div class="mdec"></div><div class="mplot" style="margin-top:10px"></div><div class="mrest"></div>';
    const dec = ui.$('.mdec', main), rest = ui.$('.mrest', main);
    const plot = K.plot(ui.$('.mplot', main), { x: { label: 'index i', min: 1, name: 'i' }, y: { label: 'σᵢ', min: 0, name: 'σ' } }, 150);
    const ctl = K.controls(Lb.side, [
      { id: 'dec', label: 'Decimals shown', min: 1, max: 6, step: 1, value: 3 },
      { id: 'full', type: 'check', label: 'Full U and V (not the thin form)', value: false },
      { id: 'log', type: 'check', label: 'Log scale for the spectrum', value: false },
      { id: 'k', label: 'Rank k of the approximation', min: 1, max: 8, step: 1, value: 1 },
      { id: 'reg', type: 'select', label: 'Pseudoinverse', options: [['Exact (zero σ dropped)', 'exact'], ['Truncated to rank k', 'trunc'], ['Tikhonov λ = 0.1', 'tikh']], value: 'exact' }
    ], () => render());
    const V = ctl.values;
    const bBox = ui.el('<div class="boxy"><h3>Right-hand side b</h3><div class="mb" style="display:flex;gap:4px;flex-wrap:wrap"></div><p class="small faint mt" style="margin-bottom:0">For A x = b: the solution x = A⁺ b below.</p></div>');
    Lb.side.appendChild(bBox);
    const bEl = ui.$('.mb', bBox);
    let b = [];
    function drawB() {
      const m = state.A.length;
      if (b.length !== m) b = Array.from({ length: m }, (_, i) => (i < 3 ? [1, 2, 2][i] : i + 1));
      bEl.innerHTML = '';
      b.forEach((x, i) => bEl.appendChild(spin(ui.el('<input class="inp" data-i="' + i + '" value="' + esc(U.fmtInput(x, 6)) + '" style="width:58px;padding:4px 5px;text-align:right;font-size:12.5px">'), readB)));
    }
    function readB() { for (const c of Array.from(bEl.querySelectorAll('input'))) { const p = L.parse(c.value); if (p) b[+c.dataset.i] = p[0][0]; } render(); }
    bEl.addEventListener('change', readB);
    editor(Lb.side, () => { drawB(); render(); });
    drawB();

    function render() {
      const A = state.A, [m, n] = L.shape(A), d = Math.round(V.dec);
      const sv = L.svd(A, { full: true });
      const p = Math.min(m, n), r = sv.rank;
      const Uu = V.full ? sv.Ufull : sv.U, Vv = V.full ? sv.Vfull : sv.V;
      const Sig = V.full ? L.diag(sv.S, m, n) : L.diag(sv.S, p, p);
      // the decomposition
      dec.innerHTML = box('A = U Σ Vᵀ' + (V.full ? '' : '  (thin form)'),
        row(mtex(A, d), '<span class="muted">=</span>', mtex(Uu, d), mtex(Sig, d, { blank: true }), mtex(L.T(Vv), d)) +
        '<p class="small muted mt">U is ' + Uu.length + ' × ' + Uu[0].length + ', Σ is ' + Sig.length + ' × ' + Sig[0].length + ', Vᵀ is ' + Vv[0].length + ' × ' + Vv.length + '. Columns of U: the output directions u₁, u₂, …; columns of V (rows of Vᵀ): the input directions v₁, v₂, …; A vᵢ = σᵢ uᵢ.</p>' +
        '<p class="small muted">Checks: ‖A − UΣVᵀ‖ = ' + f(L.fro(L.sub(A, L.mul(L.mul(Uu, Sig), L.T(Vv)))), 2) + ', ‖UᵀU − I‖ = ' + f(L.fro(L.sub(L.mul(L.T(Uu), Uu), L.eye(Uu[0].length))), 2) + ', ‖VᵀV − I‖ = ' + f(L.fro(L.sub(L.mul(L.T(Vv), Vv), L.eye(Vv[0].length))), 2) + ' (' + sv.sweeps + ' Jacobi sweeps, ' + sv.rotations + ' rotations).</p>');
      // the spectrum
      plot.set({ series: [{ pts: sv.S.map((s, i) => [i + 1, V.log ? Math.max(s, 1e-16) : s]), label: 'σᵢ', dots: true }], x: { label: 'index i', min: 1, max: Math.max(2, p), name: 'i' }, y: { label: 'σᵢ', log: !!V.log, min: V.log ? undefined : 0, name: 'σ' }, hlines: r < p ? [{ y: Math.max(sv.tol, 1e-16), label: 'rank tolerance' }] : [] });
      // facts
      const sq = m === n;
      const facts = [
        ['Shape', m + ' × ' + n + ' — ' + p + ' singular value' + (p > 1 ? 's' : '')],
        ['Singular values σ', sv.S.map(s => f(s, d)).join(', ')],
        ['Rank', r + (r < p ? ' — ' + (p - r) + ' singular value' + (p - r > 1 ? 's are' : ' is') + ' below the tolerance ' + f(sv.tol, 2) : ' (full)')],
        ['2-norm ‖A‖₂ = σ₁', f(sv.S[0], d)],
        ['Frobenius norm ‖A‖_F = √Σσ²', f(L.fro(A), d)],
        ['Nuclear norm Σσ', f(sv.S.reduce((a, s) => a + s, 0), d)],
        ['Condition number κ = σ₁/σ' + (p > 1 ? '<sub>' + p + '</sub>' : ''), r < p ? '∞ (rank-deficient)' : f(sv.S[0] / sv.S[p - 1], 4) + (sv.S[0] / sv.S[p - 1] > 1e3 ? ' — ill-conditioned: about ' + Math.round(Math.log10(sv.S[0] / sv.S[p - 1])) + ' digits lost in solving' : '')]
      ];
      if (sq) facts.push(['Determinant', f(L.det(A), d) + ' — |det| = Πσ = ' + f(sv.S.reduce((a, s) => a * s, 1), d)]);
      // four subspaces
      const S4 = L.fourSubspaces(A, sv);
      const vecs = list => list.length ? row(...list.map(v => vtex(v, d))) : '<span class="muted">{0} only</span>';
      // eigen comparison
      const E = L.eigSym(L.gram(A));
      const eigRows = sv.S.map((s, i) => [i + 1, f(E.values[i], d), f(Math.sqrt(Math.max(0, E.values[i])), d), f(s, d)]);
      // rank-k
      const k = Math.max(1, Math.min(Math.round(V.k), p));
      const lr = L.lowRank(A, k, sv);
      // pseudoinverse and the solution
      const opts = V.reg === 'trunc' ? { k } : V.reg === 'tikh' ? { lambda: 0.1 } : {};
      const P = L.pinv(A, opts);
      const bb = b.slice(0, m);
      const sol = L.lstsq(A, bb, opts);
      const inCol = sol.resid <= 1e-9 * (L.norm(bb) || 1);
      const kind = r === n && r === m ? 'A is square and invertible: x is the unique exact solution, A⁺ = A⁻¹.'
        : inCol && r < n ? 'b lies in the column space and the null space has dimension ' + (n - r) + ': infinitely many exact solutions, and this is the shortest of them (minimum norm).'
        : inCol ? 'b lies in the column space: an exact solution.'
        : r < n ? 'No exact solution and infinitely many least-squares solutions: this one has the smallest residual and, among those, the smallest length.'
        : 'No exact solution: x is the least-squares solution, with the residual perpendicular to every column of A.';
      let normal = '';
      if (r === n) { const xn = L.solve(L.gram(A), L.mv(L.T(A), bb)); if (xn) normal = '<p class="small muted mt">The normal equations AᵀA x = Aᵀb give x = (' + xn.map(x => f(x, d)).join(', ') + ')' + (V.reg === 'exact' ? ' — the same, to rounding (difference ' + f(L.norm(L.sub([xn], [sol.x])[0]), 2) + ')' : ' — without the regularisation') + '. Their condition number is κ² = ' + f((sv.S[0] / sv.S[p - 1]) ** 2, 3) + '.</p>'; }
      rest.innerHTML =
        box('What the singular values say', table(['Quantity', 'Value'], facts) + more(['singular-value-decomposition', 'determinants', 'matrix-inverse'])) +
        box('The four fundamental subspaces (orthonormal bases)',
          '<p class="small muted">rank ' + r + ' + nullity ' + (n - r) + ' = ' + n + ' columns; rank ' + r + ' + left nullity ' + (m - r) + ' = ' + m + ' rows.</p>' +
          table(['Subspace', 'Dimension', 'Basis'], [
            ['Column space of A (all A x) — first ' + r + ' columns of U', r, vecs(S4.col)],
            ['Row space of A — first ' + r + ' columns of V', r, vecs(S4.row)],
            ['Null space (A x = 0) — remaining columns of V', n - r, vecs(S4.nul)],
            ['Left null space (Aᵀ y = 0) — remaining columns of U', m - r, vecs(S4.leftNul)]
          ]) + more(['vector-spaces'])) +
        box('Singular values and the eigenvalues of AᵀA',
          table(['i', 'λᵢ(AᵀA)', '√λᵢ', 'σᵢ'], eigRows) + '<p class="small muted mt">The right singular vectors are the eigenvectors of AᵀA; σᵢ² are its eigenvalues. ' + (sq ? 'The eigenvalues of A itself are a different matter — see' + link('eigenvalues') + '.' : 'A is not square, so it has no eigenvalues of its own — but it always has singular values.') + '</p>') +
        box('Best rank-' + k + ' approximation (Eckart–Young)',
          row(mtex(lr.Ak, d), '<div class="small muted">A<sub>' + k + '</sub> = Σ<sub>i≤' + k + '</sub> σᵢ uᵢ vᵢᵀ<br>‖A − A<sub>k</sub>‖₂ = σ<sub>' + (k + 1) + '</sub> = ' + f(lr.err2, d) + '<br>‖A − A<sub>k</sub>‖_F = ' + f(lr.errF, d) + '<br>energy kept ' + f(100 * lr.energy, 2) + ' %<br>storage ' + lr.storage + ' numbers instead of ' + lr.full + '</div>') +
          (k < p ? '' : '<p class="small muted mt">k = ' + k + ' is the whole matrix.</p>') + more(['low-rank-approximation'])) +
        box('Pseudoinverse A⁺ = V Σ⁺ Uᵀ' + (V.reg === 'trunc' ? ' (truncated to rank ' + k + ')' : V.reg === 'tikh' ? ' (Tikhonov, λ = 0.1)' : ''),
          row(mtex(P, d), '<div class="small muted">' + n + ' × ' + m + '. A A⁺ projects onto the column space; A⁺ A onto the row space.<br>‖A A⁺ A − A‖ = ' + f(L.fro(L.sub(L.mul(L.mul(A, P), A), A)), 2) + (V.reg === 'exact' ? ' (zero for the exact pseudoinverse)' : ' (not zero: the regularised inverse is deliberately inexact)') + '</div>')) +
        box('Solving A x = b',
          row(mtex(A, d), vtex(sol.x, d), '<span class="muted">=</span>', vtex(L.mv(A, sol.x), d), '<span class="muted">against b =</span>', vtex(bb, d)) +
          '<p class="small mt"><b>x = A⁺ b = (' + sol.x.map(x => f(x, d)).join(', ') + ')</b>, residual |A x − b| = ' + f(sol.resid, d) + ', |x| = ' + f(L.norm(sol.x), d) + '.</p><p class="small muted">' + kind + '</p>' + normal + more(['pseudoinverse', 'gaussian-elimination'])) +
        box('Jacobi in numbers', '<p class="small muted" style="margin:0">' + sv.sweeps + ' sweep' + (sv.sweeps === 1 ? '' : 's') + ' over all column pairs, ' + sv.rotations + ' rotation' + (sv.rotations === 1 ? '' : 's') + ' in all, until every pair of columns was orthogonal to 10⁻¹⁵. Watch them one by one in the <a href="#/tools/svdlab/algorithm">Algorithm</a> tab.</p>');
      ctl.show('k', p > 1);
    }
    render();
    onTheme(render);
  }

  /* ================================================================ algorithm */
  function algorithm(el) {
    const Lb = lab(el, 'The one-sided Jacobi method: take the columns of A, pick a pair that is not perpendicular, and rotate the pair (the same rotation applied to V) until it is. Sweep over all pairs; repeat until nothing moves. The lengths of the columns are then the singular values, and the columns divided by their lengths are the uᵢ.', 0.5);
    let A0 = state.A;
    let note = '';
    if (A0.length > 8 || A0[0].length > 6) { A0 = A0.slice(0, 8).map(r => r.slice(0, 6)); note = 'Showing the first 8 × 6 block of the matrix.'; }
    const tr = L.svdTrace(A0, 300);
    const steps = tr.steps, last = steps.length - 1;
    const swap = tr.swap;
    let playing = false, acc = 0;
    const ctl = K.controls(Lb.side, [
      { id: 'step', label: 'Rotation', min: 0, max: Math.max(1, last), step: 1, value: 0 },
      { id: 'labels', type: 'check', label: 'Column labels', value: true },
      { type: 'buttons', items: [{ id: 'prev', label: '◀' }, { id: 'play', label: 'Play', primary: true }, { id: 'next', label: '▶' }, { id: 'end', label: 'To the end' }] }
    ], (id) => {
      if (id === 'prev') ctl.set('step', Math.max(0, Math.round(V.step) - 1));
      if (id === 'next') ctl.set('step', Math.min(last, Math.round(V.step) + 1));
      if (id === 'end') ctl.set('step', last);
      if (id === 'play') { playing = !playing; if (playing && V.step >= last) ctl.set('step', 0); }
      else if (id === 'step') playing = false;
      update();
    });
    const V = ctl.values;
    const ro = K.readout(Lb.side, [['pair', 'Columns rotated'], ['ang', 'Angle'], ['off', 'Orthogonality defect'], ['len', 'Column lengths']]);
    const under = Lb.under;
    under.innerHTML = '<div class="mplot"></div><div class="mtext2"></div>';
    const plot = K.plot(ui.$('.mplot', under), { x: { label: 'rotation', min: 0, max: Math.max(1, last), name: 'k' }, y: { label: 'Σ |cos| between column pairs', min: 0, name: 'defect' } }, 140);
    plot.set({ series: [{ pts: steps.map((s, i) => [i, s.off]), label: 'defect' }] });
    const textEl = ui.$('.mtext2', under);
    const st = Lb.st;
    const W0 = swap ? L.T(A0) : A0;
    const M = W0.length, N = W0[0].length;
    const names = i => (swap ? 'row ' : 'column ') + (i + 1);

    function draw() {
      const s = steps[Math.max(0, Math.min(last, Math.round(V.step)))];
      const C = K.colors(), c = st.begin();
      const cols = s.cols;
      // left: the Gram matrix of the current columns as |cos| cells; right: the columns as arrows when M == 2, else as bars
      const pad = 16, cell = Math.min(44, (st.H - 2 * pad - 24) / N, (st.W * 0.42 - pad) / N);
      const gx = pad + 30, gy = pad + 22;
      K.label(c, 'cos between columns', gx - 14, pad + 6, { size: 11.5, color: C.muted });
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const a = L.dot(cols[i], cols[i]), b2 = L.dot(cols[j], cols[j]), g = L.dot(cols[i], cols[j]);
        const cs = a > 0 && b2 > 0 ? g / Math.sqrt(a * b2) : 0;
        const hot = s.i >= 0 && ((i === s.i && j === s.j) || (i === s.j && j === s.i));
        c.save();
        c.fillStyle = i === j ? C.bg2 : K.hue(cs >= 0 ? 15 : 225, Math.min(1, Math.abs(cs)) * 0.85 + 0.05);
        c.fillRect(gx + j * cell, gy + i * cell, cell - 2, cell - 2);
        if (hot) { c.strokeStyle = C.warn; c.lineWidth = 2.5; c.strokeRect(gx + j * cell + 1, gy + i * cell + 1, cell - 4, cell - 4); }
        c.restore();
        K.label(c, i === j ? '1' : f(cs, 2), gx + j * cell + cell / 2 - 1, gy + i * cell + cell / 2 - 1, { align: 'center', size: Math.min(11, cell * 0.3), color: C.text });
      }
      for (let i = 0; i < N; i++) { K.label(c, String(i + 1), gx - 12, gy + i * cell + cell / 2 - 1, { align: 'center', size: 10.5, color: C.muted }); K.label(c, String(i + 1), gx + i * cell + cell / 2 - 1, gy + N * cell + 6, { align: 'center', size: 10.5, color: C.muted }); }
      // right panel
      const rx = Math.max(gx + N * cell + 30, st.W * 0.5), rw = st.W - rx - pad, cy = st.H / 2;
      if (M === 2 && rw > 80) {
        const span = Math.max(1e-9, ...cols.map(v => Math.hypot(v[0], v[1]))) * 1.25;
        const sc = Math.min(rw, st.H - 2 * pad) / (2 * span), cx = rx + rw / 2;
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(rx, cy); c.lineTo(rx + rw, cy); c.moveTo(cx, pad); c.lineTo(cx, st.H - pad); c.stroke(); c.restore();
        cols.forEach((v, i) => {
          const hot = i === s.i || i === s.j;
          K.arrow(c, cx, cy, cx + v[0] * sc, cy - v[1] * sc, hot ? C.warn : C.series[i % 7], hot ? 3 : 2.2);
          if (V.labels) K.label(c, 'w' + (i + 1), cx + v[0] * sc * 1.1 + 8, cy - v[1] * sc * 1.1, { size: 12, color: hot ? C.warn : C.series[i % 7], bg: C.bg2 });
        });
        K.label(c, 'columns as vectors', rx + rw / 2, pad + 6, { align: 'center', size: 11.5, color: C.muted });
      } else if (rw > 80) {
        const lens = cols.map(v => Math.sqrt(L.dot(v, v))), mx = Math.max(1e-9, ...lens);
        const bw = Math.min(40, (rw - 10) / N - 6), base = st.H - pad - 18, hmax = st.H - 2 * pad - 40;
        K.label(c, 'column lengths → σ', rx + rw / 2, pad + 6, { align: 'center', size: 11.5, color: C.muted });
        lens.forEach((l, i) => {
          const x = rx + 10 + i * (bw + 6), h = l / mx * hmax, hot = i === s.i || i === s.j;
          c.save(); c.fillStyle = hot ? C.warn : C.series[i % 7]; c.fillRect(x, base - h, bw, h); c.restore();
          K.label(c, f(l, 2), x + bw / 2, base - h - 9, { align: 'center', size: 10.5, color: C.text });
          if (V.labels) K.label(c, String(i + 1), x + bw / 2, base + 9, { align: 'center', size: 10.5, color: C.muted });
        });
      }
      // readouts and text
      const k = Math.round(V.step);
      ro.set('pair', s.i < 0 ? 'none yet — the matrix as it is' : names(s.i) + ' and ' + names(s.j) + ' (rotation ' + k + ' of ' + last + ')');
      ro.set('ang', s.i < 0 ? '—' : f(s.angle / D2R, 2) + '°');
      ro.set('off', f(s.off, 4) + (k === last ? ' — converged' : ''));
      ro.set('len', cols.map(v => f(Math.sqrt(L.dot(v, v)), 3)).join(', '));
      const Wcur = L.fromCols(s.cols, M), Vcur = L.fromCols(s.V, N);
      textEl.innerHTML = box(k === 0 ? 'Start: W = ' + (swap ? 'Aᵀ' : 'A') + ', V = I' : k === last ? 'Finished after ' + last + ' rotation' + (last === 1 ? '' : 's') + ' in ' + tr.sweeps + ' sweep' + (tr.sweeps === 1 ? '' : 's') : 'After rotation ' + k,
        (note ? '<p class="small warn">' + note + '</p>' : '') +
        (swap ? '<p class="small muted">A has more columns than rows, so the method runs on Aᵀ (its rows become the columns rotated here); U and V swap roles at the end.</p>' : '') +
        row('<div><div class="small muted">W = ' + (swap ? 'Aᵀ' : 'A') + ' V so far</div>' + mtex(Wcur, 3) + '</div>', '<div><div class="small muted">V so far</div>' + mtex(Vcur, 3) + '</div>') +
        (s.i >= 0 ? '<p class="small mt">Rotation ' + k + ': ' + names(s.i) + ' and ' + names(s.j) + ' were turned together by ' + f(s.angle / D2R, 2) + '° so that their dot product became zero. The same rotation was applied to the matching columns of V, so W = ' + (swap ? 'Aᵀ' : 'A') + 'V remains true throughout.</p>' : '<p class="small mt">Every rotation keeps W = ' + (swap ? 'Aᵀ' : 'A') + ' V. When all columns of W are mutually perpendicular, W = U Σ with σᵢ the column lengths — so ' + (swap ? 'Aᵀ' : 'A') + ' = U Σ Vᵀ.</p>') +
        (k === last ? '<p class="small mt">Singular values (sorted): ' + tr.S.map(s2 => f(s2, 4)).join(', ') + '. The orthogonality defect is ' + f(s.off, 2) + '; each column, divided by its length, is a left singular vector.</p>' : '') +
        more(['singular-value-decomposition', 'orthogonal-matrices']));
    }
    function update() { plot.set({ series: [{ pts: steps.map((s, i) => [i, s.off]), label: 'defect' }], vlines: [{ x: Math.round(V.step), label: 'now' }] }); loop.once(); }
    const loop = K.loop((dt) => {
      if (playing) { acc += dt; if (acc > 0.5) { acc = 0; if (V.step >= last) playing = false; else { ctl.set('step', Math.round(V.step) + 1); plot.set({ vlines: [{ x: Math.round(V.step), label: 'now' }] }); } } }
      draw();
    }, Lb.stage).start();
    st.onResize(() => loop.once());
    update();
  }

  /* ================================================================ geometry */
  function geometry(el) {
    const A = state.A;
    const is2 = A.length === 2 && A[0].length === 2;
    const Lb = lab(el, 'The 2 × 2 case drawn: the unit circle becomes an ellipse whose semi-axes are σ₁ and σ₂, along u₁ and u₂; they are the images of v₁ and v₂. Walk through the three stages Vᵀ, Σ, U with the slider.' + (is2 ? ' The sliders start at the matrix from the Decompose tab.' : ' (The matrix in the Decompose tab is not 2 × 2, so the simulation starts with its own example.)'), 0.64);
    const sim = H.sims && H.sims['svd-geometry'];
    if (!sim) { Lb.under.innerHTML = '<p class="muted">The simulation file sims/svd.js is not loaded.</p>'; return; }
    const params = is2 ? { a: Math.max(-3, Math.min(5, A[0][0])), b: Math.max(-3, Math.min(5, A[0][1])), c: Math.max(-3, Math.min(5, A[1][0])), d: Math.max(-3, Math.min(5, A[1][1])) } : {};
    sim.mount({ stage: Lb.stage, side: Lb.side }, K, params);
    const M = is2 ? A : [[1.5, 0.5], [0.25, 1]];
    const d2 = L.svd2(M), sv = L.svd(M);
    Lb.under.innerHTML = box('The matrix as two rotations and a stretch',
      row(mtex(M, 3), '<span class="muted">=</span>', mtex(d2.U, 3), mtex(L.diag([d2.s1, d2.s2]), 3, { blank: true }), mtex(L.T(d2.V), 3)) +
      '<p class="small muted mt">Vᵀ is a rotation by ' + f(-d2.thetaV / D2R, 1) + '°; Σ stretches by σ₁ = ' + f(d2.s1, 3) + ' and σ₂ = ' + f(d2.s2, 3) + '; U is a rotation by ' + f(d2.thetaU / D2R, 1) + '°' + (d2.mirror ? ' combined with a mirror (det A < 0)' : '') + '. The ellipse has area π σ₁ σ₂ = ' + f(Math.PI * d2.s1 * d2.s2, 3) + ' = π |det A|' + (sv.rank < 2 ? '; with σ₂ = 0 it is a segment' : '') + '.</p>' +
      '<p class="small muted">Edit the matrix in the <a href="#/tools/svdlab/decompose">Decompose</a> tab to bring another 2 × 2 here.</p>' + more(['singular-value-decomposition', 'linear-transformations', 'orthogonal-matrices']));
  }

  /* ================================================================ image */
  function image(el) {
    const Lb = lab(el, 'A grey picture is a matrix of brightnesses; a colour picture is three of them. Keep the first k layers σᵢ uᵢ vᵢᵀ and see what survives — with the built-in pictures or a file of your own (it never leaves your browser).', 0.5);
    const demo = H.svdDemo;
    if (!demo) { Lb.under.innerHTML = '<p class="muted">The simulation file sims/svd.js is not loaded.</p>'; return; }
    const SIZES = [['48 × 48', 48], ['64 × 64', 64], ['96 × 96', 96], ['128 × 128', 128]];
    let own = null;          // { grey: matrix, rgb: [R, G, B] } from the reader's file, at the chosen size
    let ownSrc = null;       // the loaded Image, resampled when the size changes
    const ctl = K.controls(Lb.side, [
      { id: 'img', type: 'select', label: 'Picture', options: demo.images.concat([['Your own file (below)', 'own']]), value: 'landscape' },
      { id: 'N', type: 'select', label: 'Size', options: SIZES, value: 64 },
      { id: 'k', label: 'Layers kept, k', min: 1, max: 64, step: 1, value: 8 },
      { id: 'view', type: 'select', label: 'Show', options: [['Original · rank k · difference', 'diff'], ['The first six layers', 'layers'], ['Layer k: u_k and v_k', 'vectors']], value: 'diff' },
      { id: 'colour', type: 'check', label: 'Colour (three channels, for your own file)', value: false },
      { id: 'log', type: 'check', label: 'Log scale for σ', value: true }
    ], (id) => { if (id === 'N') { cache = {}; if (ownSrc) resample(); const N = V.N; ctl.set('k', Math.min(Math.round(V.k), N)); } if (id === 'N' || id === 'img') refreshK(); draw(); });
    const V = ctl.values;
    const fileBox = ui.el('<div class="boxy"><h3>Your own picture</h3><input type="file" accept="image/*" class="inp mfile" style="width:100%"><p class="small faint mt" style="margin-bottom:0">Resampled to the chosen size and read as grey levels 0–1 (and as red, green and blue). Nothing is uploaded anywhere.</p></div>');
    Lb.side.appendChild(fileBox);
    const ro = K.readout(Lb.side, [['k', 'Rank kept'], ['en', 'Energy kept'], ['err', 'Relative error'], ['st', 'Numbers stored'], ['ratio', 'Compression ratio']]);
    const fileInp = ui.$('.mfile', fileBox);
    fileInp.addEventListener('change', () => {
      const file = fileInp.files && fileInp.files[0];
      if (!file || typeof FileReader === 'undefined') return;
      const rd = new FileReader();
      rd.onload = () => { const im = new Image(); im.onload = () => { ownSrc = im; resample(); ctl.set('img', 'own'); refreshK(); draw(); }; im.src = rd.result; };
      rd.readAsDataURL(file);
    });
    function resample() {
      const N = V.N, cv = document.createElement('canvas'); cv.width = N; cv.height = N;
      const cx = cv.getContext('2d');
      const s = Math.min(ownSrc.width, ownSrc.height), ox = (ownSrc.width - s) / 2, oy = (ownSrc.height - s) / 2;
      cx.drawImage(ownSrc, ox, oy, s, s, 0, 0, N, N);
      const px = cx.getImageData(0, 0, N, N).data;
      const grey = [], R = [], G = [], B = [];
      for (let i = 0; i < N; i++) { const rg = [], rr = [], rgg = [], rb = []; for (let j = 0; j < N; j++) { const o = 4 * (i * N + j), r = px[o] / 255, g = px[o + 1] / 255, b = px[o + 2] / 255; rg.push(0.299 * r + 0.587 * g + 0.114 * b); rr.push(r); rgg.push(g); rb.push(b); } grey.push(rg); R.push(rr); G.push(rgg); B.push(rb); }
      own = { grey, rgb: [R, G, B] };
      cache = {};
    }
    let cache = {};
    const under = Lb.under;
    under.innerHTML = '<div class="mplot"></div><div class="mtab"></div>';
    const plot = K.plot(ui.$('.mplot', under), { x: { label: 'index i', min: 1, name: 'i' }, y: { label: 'σᵢ', log: true, name: 'σ' } }, 150);
    const tabEl = ui.$('.mtab', under);
    function refreshK() { const N = V.N; ctl.rows.k && ctl.rows.k.row && (ctl.rows.k.row.querauto = null); const inp = ctl.rows.k && ctl.rows.k.row && ctl.rows.k.row.querySelector && ctl.rows.k.row.querySelector('input'); if (inp) inp.max = N; if (V.k > N) ctl.set('k', N); }
    function matrices() {
      const N = V.N, key = V.img + ':' + N + ':' + (V.colour ? 'c' : 'g');
      if (cache[key]) return cache[key];
      let chans;
      if (V.img === 'own') { if (!own) return null; chans = V.colour ? own.rgb : [own.grey]; }
      else chans = [demo.makeImage(V.img, N)];
      const out = chans.map(A => ({ A, sv: L.svd(A), fro: L.fro(A) }));
      cache[key] = out;
      return out;
    }
    function drawRGB(c, chans, x, y, w, h) {
      const N = chans[0].length, pw = w / N, ph = h / N;
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const r = Math.round(Math.max(0, Math.min(1, chans[0][i][j])) * 255), g = Math.round(Math.max(0, Math.min(1, chans[1][i][j])) * 255), b = Math.round(Math.max(0, Math.min(1, chans[2][i][j])) * 255);
        c.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'; c.fillRect(x + j * pw, y + i * ph, pw + 0.5, ph + 0.5);
      }
    }
    function draw() {
      const C = K.colors(), c = Lb.st.begin(), st = Lb.st;
      const ms = matrices();
      if (!ms) { K.label(c, 'Choose a file below the controls, or pick a built-in picture.', st.W / 2, st.H / 2, { align: 'center', size: 13, color: C.muted }); tabEl.innerHTML = ''; return; }
      const N = V.N, k = Math.max(1, Math.min(Math.round(V.k), N));
      const show = (mats, x, y, w, h) => (mats.length === 3 ? drawRGB(c, mats, x, y, w, h) : demo.drawImage(c, mats[0], x, y, w, h));
      const frame = (x, y, w, h, title) => { c.save(); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1); c.restore(); K.label(c, title, x + w / 2, y - 10, { align: 'center', size: 12, color: C.muted }); };
      const lrs = ms.map(m => L.lowRank(m.A, k, m.sv));
      if (V.view === 'diff') {
        const pad = 10, gap = 14, labelH = 24, size = Math.min((st.W - 2 * pad - 2 * gap) / 3, st.H - labelH - pad - 8), x0 = (st.W - (3 * size + 2 * gap)) / 2;
        show(ms.map(m => m.A), x0, labelH, size, size); frame(x0, labelH, size, size, 'original (rank ' + ms[0].sv.rank + ')');
        show(lrs.map(l => l.Ak), x0 + size + gap, labelH, size, size); frame(x0 + size + gap, labelH, size, size, 'rank ' + k);
        show(ms.map((m, i) => L.sub(m.A, lrs[i].Ak).map(r => r.map(v => 0.5 + 4 * v))), x0 + 2 * (size + gap), labelH, size, size); frame(x0 + 2 * (size + gap), labelH, size, size, 'difference × 4');
      } else if (V.view === 'layers') {
        const pad = 10, gap = 10, labelH = 24, cols = 6, size = Math.min((st.W - 2 * pad - (cols - 1) * gap) / cols, (st.H - 2 * labelH - gap) / 2), x0 = (st.W - (cols * size + (cols - 1) * gap)) / 2;
        for (let i = 0; i < cols; i++) {
          const x = x0 + i * (size + gap);
          show(ms.map(m => L.layer(m.sv, i).map(r => r.map(v => 0.5 + 2 * v))), x, labelH, size, size); frame(x, labelH, size, size, 'layer ' + (i + 1) + ' (σ = ' + f(ms[0].sv.S[i], 2) + ')');
          const part = ms.map(m => L.lowRank(m.A, i + 1, m.sv).Ak);
          show(part, x, labelH * 2 + size + gap, size, size); frame(x, labelH * 2 + size + gap, size, size, 'layers 1–' + (i + 1));
        }
      } else {
        // u_k as a column of bars at the left of a picture, v_k as a row of bars under it, and the layer itself
        const pad = 14, labelH = 24, size = Math.min(st.W * 0.45, st.H - labelH - pad - 60), x0 = st.W / 2 - size - 20, y0 = labelH;
        const m0 = ms[0], u = L.col(m0.sv.U, k - 1), v = L.col(m0.sv.V, k - 1), s = m0.sv.S[k - 1];
        show(ms.map(m => L.layer(m.sv, k - 1).map(r => r.map(x => 0.5 + 2 * x))), x0, y0, size, size); frame(x0, y0, size, size, 'layer ' + k + ' = σ' + k + ' u' + k + ' v' + k + 'ᵀ, σ = ' + f(s, 3));
        const bw = size / N, umax = Math.max(1e-9, ...u.map(Math.abs)), vmax = Math.max(1e-9, ...v.map(Math.abs));
        c.save();
        for (let i = 0; i < N; i++) { const h = u[i] / umax * 30; c.fillStyle = u[i] >= 0 ? C.accent : C.bad; c.fillRect(x0 - 36 - Math.max(0, h) + (h < 0 ? 0 : 0), y0 + i * bw, Math.abs(h), Math.max(1, bw - 0.5)); }
        for (let j = 0; j < N; j++) { const h = v[j] / vmax * 30; c.fillStyle = v[j] >= 0 ? C.accent : C.bad; c.fillRect(x0 + j * bw, y0 + size + 6 + (h < 0 ? 0 : 30 - h), Math.max(1, bw - 0.5), Math.abs(h)); }
        c.restore();
        K.label(c, 'u' + k + ' (one number per row)', x0 - 40, y0 - 10, { align: 'right', size: 11, color: C.muted });
        K.label(c, 'v' + k + ' (one number per column)', x0 + size / 2, y0 + size + 48, { align: 'center', size: 11, color: C.muted });
        const x1 = st.W / 2 + 20;
        show(lrs.map(l => l.Ak), x1, y0, size, size); frame(x1, y0, size, size, 'layers 1–' + k + ' together');
      }
      const S = ms[0].sv.S;
      plot.set({ series: ms.map((m, i) => ({ pts: m.sv.S.map((s, j) => [j + 1, V.log ? Math.max(s, 1e-6) : s]), label: ms.length === 3 ? ['red', 'green', 'blue'][i] : 'σᵢ', dots: ms.length === 1 })), x: { label: 'index i', min: 1, max: N, name: 'i' }, y: { label: 'σᵢ', log: !!V.log, min: V.log ? undefined : 0, name: 'σ' }, vlines: [{ x: k, label: 'k = ' + k }], legend: ms.length === 3 });
      const lr = lrs[0], chans = ms.length;
      ro.set('k', k + ' of ' + N);
      ro.set('en', f(100 * lr.energy, 2) + ' %');
      ro.set('err', f(100 * lr.errF / (ms[0].fro || 1), 2) + ' %');
      ro.set('st', (chans * lr.storage).toLocaleString('en') + ' of ' + (chans * lr.full).toLocaleString('en'));
      ro.set('ratio', f(lr.full / lr.storage, 2) + (lr.storage > lr.full ? ' — bigger than the original' : ''));
      const ks = [1, 2, 4, 8, 16, 32, 64, 96, 128].filter(x => x <= N);
      tabEl.innerHTML = box('Rank against quality for this picture',
        table(['k', 'σ<sub>k</sub>', 'energy kept', 'relative error', 'numbers stored', 'ratio'], ks.map(kk => { const l = L.lowRank(ms[0].A, kk, ms[0].sv); return { hl: kk === k, cells: [kk, f(S[kk - 1], 3), f(100 * l.energy, 2) + ' %', f(100 * l.errF / (ms[0].fro || 1), 2) + ' %', (chans * l.storage).toLocaleString('en'), f(l.full / l.storage, 2)] }; })) +
        '<p class="small muted mt">Energy is the share of Σσ² kept; the relative error is ‖A − A<sub>k</sub>‖<sub>F</sub>/‖A‖<sub>F</sub> = √(1 − energy). Storage counts k(m + n + 1) numbers per channel against mn.</p>' + more(['low-rank-approximation', 'singular-value-decomposition']));
    }
    refreshK();
    draw();
    Lb.st.onResize(draw);
    onTheme(draw);
  }

  /* ================================================================ fit */
  function fit(el) {
    const Lb = lab(el, 'Points with noise, a model with a few parameters, and four ways to find them. Drag the points, click in empty space to add one. The design matrix A has one row per point; its singular values decide how well the fit is determined.', 0.56);
    const MODELS = [['Straight line  c₀ + c₁x', 'poly1'], ['Parabola', 'poly2'], ['Cubic', 'poly3'], ['Quartic', 'poly4'], ['Quintic', 'poly5'], ['c₀ + c₁ sin x + c₂ cos x', 'trig'], ['c₀ + c₁ e^(−x/3) + c₂ e^(−x/4) (nearly collinear columns)', 'expo'], ['Line with a duplicated column (rank-deficient)', 'dup']];
    const RANGES = [['x from 0 to 10', 0], ['x from 1000 to 1010 (ill-conditioned columns)', 1000], ['x from 0 to 1', -1]];
    const METHODS = [['SVD pseudoinverse', 'svd'], ['Normal equations (elimination)', 'normal'], ['Truncated SVD', 'trunc'], ['Tikhonov (ridge)', 'tikh']];
    let seed = 2, pts = [];
    const ctl = K.controls(Lb.side, [
      { id: 'model', type: 'select', label: 'Model', options: MODELS, value: 'poly1' },
      { id: 'range', type: 'select', label: 'Range of x', options: RANGES, value: 0 },
      { id: 'n', label: 'Number of points', min: 4, max: 60, step: 1, value: 14 },
      { id: 'noise', label: 'Noise level', min: 0, max: 2, step: 0.05, value: 0.4 },
      { id: 'method', type: 'select', label: 'Curve drawn from', options: METHODS, value: 'svd' },
      { id: 'k', label: 'Singular values kept, k', min: 1, max: 6, step: 1, value: 2 },
      { id: 'lam', label: 'Tikhonov λ', min: 1e-4, max: 100, value: 0.1, log: true, sig: 2 },
      { id: 'res', type: 'check', label: 'Residual sticks', value: true },
      { type: 'buttons', items: [{ id: 'new', label: 'New points', primary: true }, { id: 'rm', label: 'Remove last point' }] }
    ], (id) => {
      if (id === 'new') seed++;
      if (id === 'rm') pts.pop();
      if (id === 'new' || id === 'model' || id === 'range' || id === 'n' || id === 'noise') makePoints();
      ctl.show('k', V.method === 'trunc'); ctl.show('lam', V.method === 'tikh');
      draw();
    });
    const V = ctl.values;
    ctl.show('k', false); ctl.show('lam', false);
    const ro = K.readout(Lb.side, [['c', 'Coefficients (drawn)'], ['r', 'Residual |Ac − y|'], ['k', 'Condition number κ'], ['rk', 'Rank of A']]);
    const under = Lb.under;
    under.innerHTML = '<div class="mcmp"></div><div class="mplot" style="margin-top:10px"></div><div class="mA"></div>';
    const plot = K.plot(ui.$('.mplot', under), { x: { label: 'index i', min: 1, name: 'i' }, y: { label: 'σᵢ of the design matrix', log: true, name: 'σ' } }, 140);
    const cmpEl = ui.$('.mcmp', under), AEl = ui.$('.mA', under);
    const x0 = () => (V.range > 0 ? V.range : 0);
    const span = () => (V.range < 0 ? 1 : 10);
    const truth = u => { const s = span(); const t = u / s * 10; return V.model === 'trig' ? 1 + 1.5 * Math.sin(t) - 0.8 * Math.cos(t) : V.model === 'expo' ? 0.5 + 3 * Math.exp(-t / 3) : V.model === 'poly1' || V.model === 'dup' ? 1 + 0.6 * t : V.model === 'poly2' ? 4 - 1.2 * t + 0.15 * t * t : 2 + 1.5 * t - 0.45 * t * t + 0.03 * t * t * t; };
    function makePoints() {
      const g = L.rng(seed * 7919 + 13), s = span();
      pts = [];
      for (let i = 0; i < Math.round(V.n); i++) { const u = s * (0.04 + 0.92 * (i + 0.5 * g.next()) / V.n); pts.push([u, truth(u) + V.noise * g.normal()]); }
    }
    makePoints();
    function design(u) {
      const x = u + x0();
      if (V.model === 'trig') return [1, Math.sin(u / span() * 10), Math.cos(u / span() * 10)];
      if (V.model === 'expo') return [1, Math.exp(-u / span() * 10 / 3), Math.exp(-u / span() * 10 / 4)];
      if (V.model === 'dup') return [1, x, x];
      const deg = +V.model.slice(4);
      const r = [1]; for (let j = 1; j <= deg; j++) r.push(Math.pow(x, j));
      return r;
    }
    function solveAll() {
      const A = pts.map(p => design(p[0])), y = pts.map(p => p[1]);
      const sv = L.svd(A);
      const p = sv.S.length;
      const res = {};
      const fin = (c, note) => ({ c, r: c ? L.mv(A, c).map((v, i) => v - y[i]) : null, resid: c ? L.norm(L.mv(A, c).map((v, i) => v - y[i])) : NaN, note: note || '' });
      res.svd = fin(L.lstsq(A, y).x);
      const xn = L.solve(L.gram(A), L.mv(L.T(A), y));
      res.normal = fin(xn, xn ? '' : 'AᵀA singular');
      res.trunc = fin(L.lstsq(A, y, { k: Math.min(Math.round(V.k), p) }).x);
      res.tikh = fin(L.lstsq(A, y, { lambda: V.lam }).x);
      return { A, y, sv, res, p };
    }
    const evalC = (c, u) => design(u).reduce((s, a, j) => s + a * c[j], 0);
    function frame() {
      const ys = pts.map(p => p[1]), s = span();
      let ymin = Math.min(0, ...ys) - 1, ymax = Math.max(1, ...ys) + 1;
      const pad = { l: 48, r: 14, t: 16, b: 30 }, st = Lb.st;
      const sx = (st.W - pad.l - pad.r) / s, sy = (st.H - pad.t - pad.b) / (ymax - ymin);
      return { ymin, ymax, pad, s, X: u => pad.l + u * sx, Y: y => st.H - pad.b - (y - ymin) * sy, u: px => (px - pad.l) / sx, y: py => ymin + (st.H - pad.b - py) / sy };
    }
    function draw() {
      const C = K.colors(), st = Lb.st, c = st.begin(), S = solveAll(), fr = frame(), ff = getComputedStyle(document.body).fontFamily;
      const xstep = fr.s >= 10 ? 1 : 0.1, ystep = H.niceStep(fr.ymax - fr.ymin, 6);
      c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
      for (let u = 0; u <= fr.s + 1e-9; u += xstep) { c.moveTo(fr.X(u), fr.pad.t); c.lineTo(fr.X(u), st.H - fr.pad.b); }
      for (let y = Math.ceil(fr.ymin / ystep) * ystep; y <= fr.ymax; y += ystep) { c.moveTo(fr.pad.l, fr.Y(y)); c.lineTo(st.W - fr.pad.r, fr.Y(y)); }
      c.stroke();
      c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(fr.pad.l, fr.pad.t); c.lineTo(fr.pad.l, st.H - fr.pad.b); c.lineTo(st.W - fr.pad.r, st.H - fr.pad.b); c.stroke();
      c.fillStyle = C.faint; c.font = '10.5px ' + ff; c.textAlign = 'center'; c.textBaseline = 'top';
      for (let u = 0; u <= fr.s + 1e-9; u += xstep * 2) c.fillText(f(u + x0(), fr.s >= 10 ? 0 : 1), fr.X(u), st.H - fr.pad.b + 4);
      c.textAlign = 'right'; c.textBaseline = 'middle';
      for (let y = Math.ceil(fr.ymin / ystep) * ystep; y <= fr.ymax; y += ystep) c.fillText(f(y, 1), fr.pad.l - 5, fr.Y(y));
      c.font = 'italic 12px ' + ff; c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText('x', st.W - fr.pad.r, st.H - fr.pad.b - 4);
      c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('y', fr.pad.l + 6, fr.pad.t);
      c.restore();
      // curves: the chosen method bold, the SVD solution thin for comparison
      const curve = (cc, color, width, dash) => {
        if (!cc) return;
        c.save(); c.strokeStyle = color; c.lineWidth = width; if (dash) c.setLineDash(dash); c.beginPath();
        let on = false;
        for (let i = 0; i <= 200; i++) { const u = fr.s * i / 200, y = evalC(cc, u); if (!Number.isFinite(y) || Math.abs(y) > 1e7) { on = false; continue; } const py = Math.max(-2000, Math.min(st.H + 2000, fr.Y(y))); if (on) c.lineTo(fr.X(u), py); else { c.moveTo(fr.X(u), py); on = true; } }
        c.stroke(); c.restore();
      };
      const drawn = S.res[V.method];
      if (V.method !== 'svd') curve(S.res.svd.c, C.faint, 1.4, [5, 4]);
      curve(drawn.c, C.accent, 2.4);
      pts.forEach((p, i) => {
        const px = fr.X(p[0]), py = fr.Y(p[1]);
        if (V.res && drawn.r && Number.isFinite(drawn.r[i])) { c.save(); c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px, py); c.lineTo(px, Math.max(-2000, Math.min(st.H + 2000, fr.Y(p[1] + drawn.r[i])))); c.stroke(); c.restore(); }
        K.dot(c, px, py, 6.5, C.bg2, C.series[1]); K.dot(c, px, py, 2.5, C.series[1]);
      });
      if (drawn.note) K.label(c, drawn.note + ' — nothing to draw', st.W / 2, fr.pad.t + 12, { align: 'center', size: 12, color: C.bad, bg: C.bg2 });
      K.label(c, METHODS.find(m => m[1] === V.method)[0] + (V.method !== 'svd' ? '  (dashed: the SVD solution)' : ''), fr.pad.l + 8, fr.pad.t + 12, { size: 11.5, color: C.muted, bg: C.bg2 });
      // readouts
      const p = S.p, kap = S.sv.rank < p ? Infinity : S.sv.S[0] / S.sv.S[p - 1];
      ro.set('c', drawn.c ? '(' + drawn.c.map(x => f(x, 3)).join(', ') + ')' : '—');
      ro.set('r', f(drawn.resid, 4));
      ro.set('k', S.sv.rank < p ? '∞ (rank-deficient)' : f(kap, 4) + (kap > 1e4 ? ' — ' + Math.round(Math.log10(kap)) + ' digits at risk' : ''));
      ro.set('rk', S.sv.rank + ' of ' + p + ' columns');
      plot.set({ series: [{ pts: S.sv.S.map((s, i) => [i + 1, Math.max(s, 1e-16)]), label: 'σᵢ', dots: true }], x: { label: 'index i', min: 1, max: Math.max(2, p), name: 'i' }, vlines: V.method === 'trunc' ? [{ x: Math.min(Math.round(V.k), p) + 0.5, label: 'kept | dropped' }] : [], hlines: V.method === 'tikh' ? [{ y: V.lam, label: 'λ' }] : [] });
      const rows = METHODS.map(([name, key]) => { const r = S.res[key]; return { hl: key === V.method, cells: [name + (key === 'trunc' ? ' (k = ' + Math.min(Math.round(V.k), p) + ')' : key === 'tikh' ? ' (λ = ' + f(V.lam, 3) + ')' : ''), r.c ? '(' + r.c.map(x => f(x, 4)).join(', ') + ')' : r.note, r.c ? f(r.resid, 4) : '—', r.c ? f(L.norm(r.c), 4) : '—'] }; });
      cmpEl.innerHTML = box('The four answers', table(['Method', 'Coefficients c', 'Residual |Ac − y|', '|c|'], rows) +
        '<p class="small muted mt">The SVD pseudoinverse and the normal equations agree when A has full rank and κ is modest. With κ large, the normal equations (whose condition number is κ² = ' + (Number.isFinite(kap) ? f(kap * kap, 3) : '∞') + ') drift or fail; truncation and Tikhonov give up a little residual for coefficients of sensible size.</p>' + more(['pseudoinverse', 'linear-regression', 'low-rank-approximation']));
      const show = Math.min(pts.length, 6);
      AEl.innerHTML = box('The design matrix (first ' + show + ' of ' + pts.length + ' rows)', row(mtex(S.A.slice(0, show), 3), '<span class="muted">c =</span>', vtex(S.y.slice(0, show), 3)) +
        '<p class="small muted mt">One row per point: the model\'s basis functions evaluated at that x. Singular values: ' + S.sv.S.map(s => f(s, 4)).join(', ') + '. Columns that are nearly multiples of one another (x and x² far from the origin; two similar exponentials; a duplicated column) make σ small — the data cannot tell those coefficients apart.</p>');
    }
    K.drag(Lb.st, {
      hit(p) { const fr = frame(); const i = pts.findIndex(q => Math.hypot(p.x - fr.X(q[0]), p.y - fr.Y(q[1])) < 14); return i >= 0 ? i : null; },
      move(i, p) { const fr = frame(); pts[i] = [Math.max(0, Math.min(fr.s, fr.u(p.x))), Math.max(fr.ymin - 50, Math.min(fr.ymax + 50, fr.y(p.y)))]; draw(); },
      hover: true
    });
    K.click(Lb.st, p => { const fr = frame(); if (pts.some(q => Math.hypot(p.x - fr.X(q[0]), p.y - fr.Y(q[1])) < 14)) return; if (p.x < fr.pad.l || p.y > Lb.st.H - fr.pad.b) return; if (pts.length >= 80) return; pts.push([Math.max(0, Math.min(fr.s, fr.u(p.x))), fr.y(p.y)]); draw(); }, () => true);
    draw();
    Lb.st.onResize(draw);
    onTheme(draw);
  }

  /* ================================================================ pca */
  function pca(el) {
    const Lb = lab(el, 'Rows are observations, columns are variables. PCA centres the columns, takes the SVD of the result, and reads off the directions of greatest spread (the loadings V), the spread along each (σᵢ²/(n − 1)) and the coordinates of every observation along them (the scores U Σ).', 0.56);
    const DATA = [['Height and weight (120 people, synthetic)', 'hw'], ['Three sensors watching one source (3 variables)', 'sensors'], ['Flowers: 3 species × 4 measurements (150, synthetic)', 'flowers'], ['Spectra: 40 samples × 12 wavelengths, 2 hidden factors', 'spectra'], ['Your own numbers (paste below)', 'own']];
    let own = null;
    const ctl = K.controls(Lb.side, [
      { id: 'data', type: 'select', label: 'Data', options: DATA, value: 'hw' },
      { id: 'std', type: 'check', label: 'Standardise (divide by standard deviations)', value: false },
      { id: 'px', type: 'select', label: 'Horizontal axis', options: [['PC1', 0], ['PC2', 1], ['PC3', 2], ['PC4', 3]], value: 0 },
      { id: 'py', type: 'select', label: 'Vertical axis', options: [['PC1', 0], ['PC2', 1], ['PC3', 2], ['PC4', 3]], value: 1 },
      { id: 'load', type: 'check', label: 'Loadings as arrows (biplot)', value: true },
      { id: 'groups', type: 'check', label: 'Colour the groups', value: true },
      { id: 'k', label: 'Components kept for the reconstruction', min: 1, max: 4, step: 1, value: 2 }
    ], () => draw());
    const V = ctl.values;
    const ownBox = ui.el('<div class="boxy"><h3>Your own data</h3><textarea class="inp mown" rows="5" style="width:100%;font-family:monospace;font-size:12px" placeholder="one observation per line, variables separated by spaces or commas&#10;170 65&#10;182 80&#10;…"></textarea><div class="btnrow mt"><button class="btn sm mUse">Use these</button></div><p class="small faint mt" style="margin-bottom:0">Up to 2000 rows and 12 columns. A first line of words is taken as the variable names.</p></div>');
    Lb.side.appendChild(ownBox);
    ui.$('.mUse', ownBox).onclick = () => {
      const txt = ui.$('.mown', ownBox).value || '';
      const lines = txt.split(/\n/).map(s => s.trim()).filter(Boolean);
      let names = null;
      if (lines.length && /[A-Za-z]/.test(lines[0]) && !/^[-+\d.eE,\s/]+$/.test(lines[0])) names = lines.shift().split(/[\s,]+/).filter(Boolean);
      const M = L.parse(lines.join('\n'));
      if (!M || M.length < 3) { ui.toast('Need at least three rows of numbers, the same count on every row.'); return; }
      if (M[0].length > 12 || M.length > 2000) { ui.toast('Up to 2000 rows and 12 columns.'); return; }
      own = { X: M, names: names && names.length === M[0].length ? names : M[0].map((_, j) => 'x' + (j + 1)), groups: null };
      ctl.set('data', 'own'); draw();
    };
    const ro = K.readout(Lb.side, [['n', 'Observations × variables'], ['l', 'Variances λᵢ'], ['ex', 'Explained'], ['cum', 'Cumulative']]);
    const under = Lb.under;
    under.innerHTML = '<div class="mplot"></div><div class="mtabs"></div>';
    const scree = K.plot(ui.$('.mplot', under), { x: { label: 'component', min: 0.5, name: 'PC' }, y: { label: 'share of the variance', min: 0, max: 1, name: 'share' }, legend: true }, 150);
    const tabsEl = ui.$('.mtabs', under);
    function dataset() {
      const g = L.rng(17), key = V.data;
      if (key === 'own') return own || { X: [[1, 2], [2, 4.1], [3, 5.9], [4, 8.2]], names: ['x1', 'x2'], groups: null, empty: true };
      if (key === 'hw') { const X = []; for (let i = 0; i < 120; i++) { const h = 170 + 9 * g.normal(); X.push([h, 70 + 0.9 * (h - 170) + 8 * g.normal()]); } return { X, names: ['height (cm)', 'weight (kg)'], groups: null }; }
      if (key === 'sensors') { const X = []; for (let i = 0; i < 100; i++) { const s = 3 * g.normal(); X.push([s + 0.5 * g.normal(), 2 * s + 0.5 * g.normal(), -s + 0.5 * g.normal()]); } return { X, names: ['sensor 1', 'sensor 2', 'sensor 3'], groups: null }; }
      if (key === 'flowers') {
        const X = [], groups = [];
        const C3 = [[5.0, 3.4, 1.5, 0.25], [5.9, 2.8, 4.3, 1.3], [6.6, 3.0, 5.6, 2.0]], S3 = [[0.35, 0.38, 0.17, 0.1], [0.5, 0.3, 0.47, 0.2], [0.63, 0.32, 0.55, 0.27]];
        for (let gI = 0; gI < 3; gI++) for (let i = 0; i < 50; i++) { const t = g.normal(); X.push(C3[gI].map((m, j) => m + S3[gI][j] * (0.7 * t + 0.7 * g.normal()))); groups.push(gI); }
        return { X, names: ['sepal length', 'sepal width', 'petal length', 'petal width'], groups, groupNames: ['species A', 'species B', 'species C'] };
      }
      // spectra: two hidden factors, 12 wavelengths
      const X = [], f1 = [], f2 = [];
      for (let w = 0; w < 12; w++) { f1.push(Math.exp(-((w - 3) ** 2) / 4)); f2.push(Math.exp(-((w - 8) ** 2) / 6)); }
      for (let i = 0; i < 40; i++) { const a = 1 + g.next() * 2, b = g.next() * 3; X.push(f1.map((v, w) => a * v + b * f2[w] + 0.05 * g.normal())); }
      return { X, names: f1.map((_, w) => 'λ' + (w + 1)), groups: null };
    }
    function draw() {
      const D = dataset(), X = D.X, [n, p] = L.shape(X);
      const P = L.pca(X, { standardise: !!V.std });
      const C = K.colors(), st = Lb.st, c = st.begin();
      const ix = Math.min(V.px, p - 1), iy = Math.min(V.py, p - 1);
      const sx = P.scores.map(r => r[ix]), sy = P.scores.map(r => r[iy]);
      const span = Math.max(1e-9, ...sx.map(Math.abs), ...sy.map(Math.abs)) * 1.15;
      const cx = st.W / 2, cy = st.H / 2, sc = Math.min(st.W, st.H) / (2 * span) * 0.92;
      c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(0, cy); c.lineTo(st.W, cy); c.moveTo(cx, 0); c.lineTo(cx, st.H); c.stroke(); c.restore();
      K.label(c, 'PC' + (ix + 1) + ' score (' + f(100 * P.ratio[ix], 1) + ' %)', st.W - 8, cy - 8, { align: 'right', size: 12, color: C.muted });
      K.label(c, 'PC' + (iy + 1) + ' score (' + f(100 * P.ratio[iy], 1) + ' %)', cx + 8, 10, { size: 12, color: C.muted });
      if (D.empty) K.label(c, 'Paste your numbers below the controls and press "Use these".', cx, 30, { align: 'center', size: 12.5, color: C.warn, bg: C.bg2 });
      const GC = [C.series[0], C.series[1], C.series[2], C.series[3], C.series[4]];
      X.forEach((r, i) => { const col = V.groups && D.groups ? GC[D.groups[i] % 5] : C.series[1]; K.dot(c, cx + sx[i] * sc, cy - sy[i] * sc, 3.2, col); });
      if (V.groups && D.groups && D.groupNames) D.groupNames.forEach((nm, gI) => { K.dot(c, 16, st.H - 14 - gI * 16, 4, GC[gI % 5]); K.label(c, nm, 26, st.H - 14 - gI * 16, { size: 11, color: C.muted }); });
      if (V.load && p <= 16) {
        const scaleL = span * 0.8 / Math.max(1e-9, ...P.V.map(r => Math.hypot(r[ix], r[iy])));
        P.V.forEach((r, j) => { const x = cx + r[ix] * scaleL * sc, y = cy - r[iy] * scaleL * sc; K.arrow(c, cx, cy, x, y, C.warn, 1.8); K.label(c, D.names[j], x + (r[ix] >= 0 ? 6 : -6), y - 8, { align: r[ix] >= 0 ? 'left' : 'right', size: 11, color: C.warn, bg: C.bg2 }); });
      }
      const total = P.variance.reduce((a, b) => a + b, 0) || 1;
      ro.set('n', n + ' × ' + p);
      ro.set('l', P.variance.slice(0, 6).map(v => f(v, 3)).join(', ') + (p > 6 ? ', …' : ''));
      ro.set('ex', P.ratio.slice(0, 6).map(v => f(100 * v, 1) + ' %').join(', ') + (p > 6 ? ', …' : ''));
      ro.set('cum', P.cum.slice(0, 6).map(v => f(100 * v, 1) + ' %').join(', ') + (p > 6 ? ', …' : ''));
      scree.set({ series: [{ pts: P.ratio.map((r, i) => [i + 1, r]), label: 'share', dots: true }, { pts: P.cum.map((r, i) => [i + 1, r]), label: 'cumulative', dash: true, dots: true }], x: { label: 'component', min: 0.5, max: p + 0.5, name: 'PC' } });
      const k = Math.max(1, Math.min(Math.round(V.k), p));
      const Xk = L.mul(P.scores.map(r => r.slice(0, k)), L.T(P.V).slice(0, k));
      const errF = L.fro(L.sub(P.Xc, Xk)), tot = L.fro(P.Xc) || 1;
      const Cov = L.scale(L.gram(P.Xc), 1 / Math.max(1, n - 1));
      const nPC = Math.min(p, 6);
      tabsEl.innerHTML =
        box('Loadings: how much of each variable goes into each component', table(['Variable', 'mean', V.std ? 'sd (divided out)' : 'sd'].concat(Array.from({ length: nPC }, (_, i) => 'PC' + (i + 1))), D.names.map((nm, j) => [nm, f(P.mean[j], 3), f(P.sd[j], 3)].concat(Array.from({ length: nPC }, (_, i) => f(P.V[j][i], 3))))) +
          '<p class="small muted mt">Each column is a unit vector (a right singular vector of the centred data). Its entries say which original variables a component mixes, with what signs.</p>') +
        box('Variances and the scree plot', table(['Component', 'σᵢ', 'variance λᵢ = σᵢ²/(n − 1)', 'share', 'cumulative'], P.S.slice(0, Math.min(p, 12)).map((s, i) => [i + 1, f(s, 3), f(P.variance[i], 4), f(100 * P.ratio[i], 2) + ' %', f(100 * P.cum[i], 2) + ' %'])) +
          '<p class="small muted mt">Total variance ' + f(total, 4) + (V.std ? ' = the number of variables (each has variance 1 after standardising)' : ' = the sum of the variances of the original variables') + '. Keeping ' + k + ' component' + (k > 1 ? 's' : '') + ' reproduces the centred data to a relative error of ' + f(100 * errF / tot, 2) + ' % (the rank-' + k + ' approximation).</p>') +
        (p <= 8 ? box((V.std ? 'Correlation' : 'Covariance') + ' matrix C = XᵀX/(n − 1)', row(mtex(Cov, 3), '<div class="small muted">Its eigenvectors are the loadings and its eigenvalues the variances λᵢ: C = V diag(λ) Vᵀ.</div>')) : '') +
        more(['principal-component-analysis', 'low-rank-approximation', 'standard-deviation']);
    }
    draw();
    Lb.st.onResize(draw);
    onTheme(draw);
  }
})();
