/* HYPER-CORE · linalg.js — dense linear algebra for the pages, simulations and the SVD lab (kit.linalg, Hyper.linalg).
 *
 * Matrices are arrays of rows of numbers; vectors are arrays. Nothing here uses the DOM.
 *
 *   L.svd(A, { full, tol })  -> { U, S, V, Ufull, Vfull, rank, tol, sweeps, rotations, m, n }
 *        A = U diag(S) Vᵀ with U m×p, V n×p, p = min(m, n), S descending; Ufull (m×m) and Vfull (n×n) complete the
 *        bases (always computed for n ≤ 12 or when full is set). One-sided Jacobi (Hestenes): columns are rotated in
 *        pairs until they are all orthogonal; their lengths are the singular values. Every singular vector is signed
 *        so that its largest entry (of v) is positive, so the result is the same from run to run.
 *   L.svdTrace(A, maxSteps)  -> { steps: [{ i, j, angle, off, cols, V }], ... }  the same sweeps, one rotation at a time
 *   L.svd2(A)                -> { s1, s2, U, V, thetaU, thetaV, mirror }  the 2 × 2 case as two rotations and a stretch
 *   L.rank(A, tol)  L.cond(A)  L.norm2(A)  L.nuclear(A)  L.fro(A)  L.det(A)  L.pinv(A, { tol, k, lambda })
 *   L.lstsq(A, b, { tol, k, lambda })  -> { x, r, resid, rank, S, cond }      L.solve(A, b) Gaussian elimination (null if singular)
 *   L.lowRank(A, k)  -> { Ak, k, err2, errF, energy, storage, full }           L.layer(svd, k) the k-th rank-one piece σₖ uₖ vₖᵀ
 *   L.fourSubspaces(A)  -> { rank, col, row, nul, leftNul }  orthonormal bases, as lists of vectors
 *   L.polar(A)  -> { Q, P }  (A = QP, Q orthogonal, P symmetric positive semi-definite)
 *   L.eigSym(S) -> { values, vectors }  Jacobi for a symmetric matrix (vectors are columns, values descending)
 *   L.pca(X, { standardise })  -> { mean, sd, Xc, S, variance, ratio, cum, scores, V }
 *   L.T  L.mul  L.mv  L.add  L.sub  L.scale  L.outer  L.dot  L.norm  L.eye  L.zeros  L.diag  L.clone  L.shape  L.gram
 *   L.hilbert(n)  L.rotation(θ)  L.rng(seed)  L.parse(text)  L.toText(A)  L.toTex(A, d, opts)  L.fmt(v, d)
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const EPS = 2.220446049250313e-16;

  /* ---------------------------------------------------------------- basics */
  const shape = A => [A.length, A.length ? A[0].length : 0];
  const zeros = (m, n) => Array.from({ length: m }, () => new Array(n).fill(0));
  const eye = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  const clone = A => A.map(r => r.slice());
  const T = A => { const [m, n] = shape(A); const B = zeros(n, m); for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) B[j][i] = A[i][j]; return B; };
  function mul(A, B) {
    const [m, k] = shape(A), n = B.length ? B[0].length : 0;
    const C = zeros(m, n);
    for (let i = 0; i < m; i++) for (let p = 0; p < k; p++) { const a = A[i][p]; if (a === 0) continue; const Bp = B[p], Ci = C[i]; for (let j = 0; j < n; j++) Ci[j] += a * Bp[j]; }
    return C;
  }
  const mv = (A, x) => A.map(r => r.reduce((s, a, j) => s + a * x[j], 0));
  const add = (A, B) => A.map((r, i) => r.map((a, j) => a + B[i][j]));
  const sub = (A, B) => A.map((r, i) => r.map((a, j) => a - B[i][j]));
  const scale = (A, s) => A.map(r => r.map(a => a * s));
  const outer = (u, v) => u.map(a => v.map(b => a * b));
  const dot = (x, y) => x.reduce((s, a, i) => s + a * y[i], 0);
  const norm = x => Math.sqrt(dot(x, x));
  const fro = A => Math.sqrt(A.reduce((s, r) => s + r.reduce((t, a) => t + a * a, 0), 0));
  const diag = (s, m, n) => { m = m == null ? s.length : m; n = n == null ? s.length : n; const D = zeros(m, n); for (let i = 0; i < Math.min(m, n, s.length); i++) D[i][i] = s[i]; return D; };
  const gram = A => mul(T(A), A);
  const col = (A, j) => A.map(r => r[j]);
  const fromCols = (cols, m) => Array.from({ length: m }, (_, i) => cols.map(c => c[i]));
  const hilbert = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => 1 / (i + j + 1)));
  const rotation = th => [[Math.cos(th), -Math.sin(th)], [Math.sin(th), Math.cos(th)]];

  /* a small, reproducible random source: uniform in [0, 1) and standard normal */
  function rng(seed) {
    let a = (seed == null ? 12345 : seed) >>> 0, spare = null;
    const next = () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const normal = () => { if (spare != null) { const s = spare; spare = null; return s; } let u, v, r; do { u = 2 * next() - 1; v = 2 * next() - 1; r = u * u + v * v; } while (r >= 1 || r === 0); const f = Math.sqrt(-2 * Math.log(r) / r); spare = v * f; return u * f; };
    return { next, normal };
  }

  /* ---------------------------------------------------------------- the one-sided Jacobi SVD */
  /* rotate columns i and j of the column lists so that they become orthogonal; returns the angle (0 when nothing to do) */
  function rotatePair(cols, vcols, i, j, tol) {
    const ci = cols[i], cj = cols[j], M = ci.length;
    let alpha = 0, beta = 0, gamma = 0;
    for (let k = 0; k < M; k++) { alpha += ci[k] * ci[k]; beta += cj[k] * cj[k]; gamma += ci[k] * cj[k]; }
    if (gamma === 0 || alpha === 0 || beta === 0 || Math.abs(gamma) <= tol * Math.sqrt(alpha * beta)) return 0;
    const zeta = (beta - alpha) / (2 * gamma);
    const t = (zeta >= 0 ? 1 : -1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
    const c = 1 / Math.sqrt(1 + t * t), s = c * t;
    for (let k = 0; k < M; k++) { const x = ci[k], y = cj[k]; ci[k] = c * x - s * y; cj[k] = s * x + c * y; }
    const vi = vcols[i], vj = vcols[j], N = vi.length;
    for (let k = 0; k < N; k++) { const x = vi[k], y = vj[k]; vi[k] = c * x - s * y; vj[k] = s * x + c * y; }
    return Math.atan2(s, c);
  }
  /* complete an orthonormal list of vectors (length M, some may be missing) to a full basis of R^M, with Gram–Schmidt */
  function completeBasis(vecs, M) {
    const out = vecs.map(v => Array.from(v));
    for (let e = 0; e < M && out.length < M; e++) {
      const v = new Array(M).fill(0); v[e] = 1;
      for (let pass = 0; pass < 2; pass++) for (const q of out) { const d = dot(q, v); for (let k = 0; k < M; k++) v[k] -= d * q[k]; }
      const L = norm(v);
      if (L > 1e-8) out.push(v.map(x => x / L));
    }
    return out;
  }
  /* the core: A (m×n) -> column lists of U (thin), S, V; records each rotation when `trace` is given */
  function jacobi(A, opts, trace) {
    opts = opts || {};
    const m = A.length, n = m ? A[0].length : 0;
    const swap = m < n;
    const W = swap ? T(A) : A;
    const M = W.length, N = W[0].length;
    const cols = [], vcols = [];
    for (let j = 0; j < N; j++) { const c = new Float64Array(M); for (let i = 0; i < M; i++) c[i] = W[i][j]; cols.push(c); const v = new Float64Array(N); v[j] = 1; vcols.push(v); }
    const rtol = opts.rtol || 1e-15;
    let sweeps = 0, rotations = 0;
    const maxSweeps = opts.maxSweeps || 80;
    const off = () => { let s = 0; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = dot(cols[i], cols[i]), b = dot(cols[j], cols[j]), g = dot(cols[i], cols[j]); if (a > 0 && b > 0) s += Math.abs(g) / Math.sqrt(a * b); } return s; };
    if (trace) trace.push({ i: -1, j: -1, angle: 0, off: off(), cols: cols.map(c => Array.from(c)), V: vcols.map(c => Array.from(c)) });
    for (sweeps = 0; sweeps < maxSweeps; sweeps++) {
      let changed = false;
      for (let i = 0; i < N - 1; i++) for (let j = i + 1; j < N; j++) {
        const ang = rotatePair(cols, vcols, i, j, rtol);
        if (ang !== 0) {
          changed = true; rotations++;
          if (trace) { trace.push({ i, j, angle: ang, off: off(), cols: cols.map(c => Array.from(c)), V: vcols.map(c => Array.from(c)) }); if (trace.length > (opts.maxSteps || 400)) return { cols, vcols, M, N, swap, sweeps: sweeps + 1, rotations, stopped: true }; }
        }
      }
      if (!changed) break;
    }
    return { cols, vcols, M, N, swap, sweeps, rotations };
  }
  /* turn the rotated columns into U, S, V (sorted, signed, completed) */
  function finish(J, A, opts) {
    opts = opts || {};
    const { cols, vcols, M, N, swap } = J;
    const order = cols.map((c, j) => [Math.sqrt(dot(c, c)), j]).sort((a, b) => b[0] - a[0]);
    const S = order.map(o => o[0]);
    const s1 = S[0] || 0;
    const tol = opts.tol != null ? opts.tol : Math.max(M, N) * EPS * s1 * 8;
    const Ucols = [], Vcols = [];
    for (const [s, j] of order) {
      const v = Array.from(vcols[j]);
      let u = s > tol ? Array.from(cols[j]).map(x => x / s) : null;
      // sign: the largest entry of v positive
      let big = 0; for (let k = 1; k < v.length; k++) if (Math.abs(v[k]) > Math.abs(v[big])) big = k;
      if (v[big] < 0) { for (let k = 0; k < v.length; k++) v[k] = -v[k]; if (u) for (let k = 0; k < u.length; k++) u[k] = -u[k]; }
      Vcols.push(v); Ucols.push(u);
    }
    // missing u's (zero singular values): any orthonormal completion
    const present = Ucols.filter(u => u);
    const filled = completeBasis(present, M);
    let p = present.length;
    for (let j = 0; j < Ucols.length; j++) if (!Ucols[j]) Ucols[j] = filled[p++];
    const rank = S.filter(s => s > tol).length;
    const wantFull = opts.full || M <= 12;
    const Ufull = wantFull ? completeBasis(Ucols, M) : null;
    const U = fromCols(Ucols, M), V = fromCols(Vcols, N);
    const res = swap
      ? { U: V, S, V: U, Ufull: V, Vfull: Ufull ? fromCols(Ufull, M) : null, m: N, n: M }
      : { U, S, V, Ufull: Ufull ? fromCols(Ufull, M) : null, Vfull: V, m: M, n: N };
    res.rank = rank; res.tol = tol; res.sweeps = J.sweeps; res.rotations = J.rotations;
    return res;
  }
  function svd(A, opts) {
    const [m, n] = shape(A);
    if (!m || !n) return { U: [], S: [], V: [], Ufull: [], Vfull: [], rank: 0, tol: 0, sweeps: 0, rotations: 0, m, n };
    for (const r of A) for (const a of r) if (!Number.isFinite(a)) throw new Error('svd: the matrix has a non-finite entry');
    return finish(jacobi(A, opts), A, opts);
  }
  /* the same, with every rotation recorded (for small matrices): steps[k] holds the columns and V after rotation k */
  function svdTrace(A, maxSteps) {
    const [m, n] = shape(A);
    const trace = [];
    const J = jacobi(A, { maxSteps: maxSteps || 300 }, trace);
    const res = finish(J, A, {});
    return Object.assign(res, { steps: trace, swap: J.swap, stopped: !!J.stopped });
  }

  /* ---------------------------------------------------------------- derived quantities */
  const rank = (A, tol) => svd(A, { tol }).rank;
  function cond(A) { const sv = svd(A), s = sv.S, p = s.length; return p && sv.rank === p ? s[0] / s[p - 1] : Infinity; }
  const norm2 = A => (svd(A).S[0] || 0);
  const nuclear = A => svd(A).S.reduce((a, b) => a + b, 0);
  /* Gaussian elimination with partial pivoting: x with A x = b, or null when A is singular (to working precision) */
  function solve(A, b) {
    const n = A.length;
    const M = A.map((r, i) => r.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      if (Math.abs(M[p][c]) < 1e-13 * (fro(A) || 1)) return null;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = 0; r < n; r++) { if (r === c) continue; const f = M[r][c] / M[c][c]; if (f) for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
    }
    return M.map((r, i) => r[n] / r[i]);
  }
  function det(A) {
    const n = A.length; if (!n || A[0].length !== n) return NaN;
    const M = clone(A); let d = 1;
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      if (M[p][c] === 0) return 0;
      if (p !== c) { [M[c], M[p]] = [M[p], M[c]]; d = -d; }
      d *= M[c][c];
      for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; if (f) for (let k = c; k < n; k++) M[r][k] -= f * M[c][k]; }
    }
    return d;
  }
  /* the filter factor of each singular value: 1/σ (kept), 0 (cut), or σ/(σ² + λ²) (Tikhonov) */
  function invFactors(sv, opts) {
    opts = opts || {};
    const tol = opts.tol != null ? opts.tol : sv.tol;
    return sv.S.map((s, i) => {
      if (opts.lambda) return s / (s * s + opts.lambda * opts.lambda);
      if (opts.k != null ? i >= opts.k : s <= tol) return 0;
      return 1 / s;
    });
  }
  /* the Moore–Penrose pseudoinverse V Σ⁺ Uᵀ; opts.k keeps only the first k singular values, opts.lambda regularises */
  function pinv(A, opts) {
    const sv = svd(A, opts), f = invFactors(sv, opts);
    const [m, n] = shape(A);
    const P = zeros(n, m);
    for (let i = 0; i < f.length; i++) { if (!f[i]) continue; const vi = col(sv.V, i), ui = col(sv.U, i); for (let r = 0; r < n; r++) for (let c = 0; c < m; c++) P[r][c] += f[i] * vi[r] * ui[c]; }
    return P;
  }
  /* least squares: the x of smallest length that makes |Ax − b| as small as possible */
  function lstsq(A, b, opts) {
    const sv = svd(A, opts), f = invFactors(sv, opts);
    const [m, n] = shape(A);
    const x = new Array(n).fill(0);
    const coef = [];
    for (let i = 0; i < f.length; i++) {
      const ub = dot(col(sv.U, i), b);
      coef.push(ub);
      if (!f[i]) continue;
      const vi = col(sv.V, i), c = f[i] * ub;
      for (let r = 0; r < n; r++) x[r] += c * vi[r];
    }
    const r = mv(A, x).map((v, i) => v - b[i]);
    const p = sv.S.length, used = f.filter(Boolean).length;
    return { x, r, resid: norm(r), rank: sv.rank, used, S: sv.S, coef, cond: p && sv.S[p - 1] > sv.tol ? sv.S[0] / sv.S[p - 1] : Infinity, svd: sv };
  }
  /* the k-th rank-one piece σₖ uₖ vₖᵀ of a decomposition */
  function layer(sv, k) { return scale(outer(col(sv.U, k), col(sv.V, k)), sv.S[k]); }
  /* the best rank-k approximation (Eckart–Young) and how far it is from A */
  function lowRank(A, k, sv) {
    sv = sv || svd(A);
    const [m, n] = shape(A);
    k = Math.max(0, Math.min(k, sv.S.length));
    let Ak = zeros(m, n);
    for (let i = 0; i < k; i++) { const s = sv.S[i], ui = col(sv.U, i), vi = col(sv.V, i); for (let r = 0; r < m; r++) { const a = s * ui[r]; if (a === 0) continue; const row = Ak[r]; for (let c = 0; c < n; c++) row[c] += a * vi[c]; } }
    const tail = sv.S.slice(k), total = sv.S.reduce((a, s) => a + s * s, 0);
    return { Ak, k, err2: tail[0] || 0, errF: Math.sqrt(tail.reduce((a, s) => a + s * s, 0)), energy: total ? 1 - tail.reduce((a, s) => a + s * s, 0) / total : 1, storage: k * (m + n + 1), full: m * n, S: sv.S };
  }
  /* orthonormal bases of the four fundamental subspaces, from the SVD */
  function fourSubspaces(A, sv) {
    sv = sv || svd(A, { full: true });
    const r = sv.rank, Uf = sv.Ufull || sv.U, Vf = sv.Vfull || sv.V;
    const cols = (M, from, to) => { const out = []; for (let j = from; j < to; j++) out.push(col(M, j)); return out; };
    return { rank: r, col: cols(Uf, 0, r), row: cols(Vf, 0, r), nul: cols(Vf, r, Vf.length ? Vf[0].length : 0), leftNul: cols(Uf, r, Uf.length ? Uf[0].length : 0), svd: sv };
  }
  function polar(A) {
    const sv = svd(A);
    const Q = mul(sv.U, T(sv.V)), P = mul(mul(sv.V, diag(sv.S)), T(sv.V));
    return { Q, P, svd: sv };
  }
  /* 2 × 2: A = U Σ Vᵀ with V a pure rotation (det V = +1); U is a rotation, or a rotation after a mirror when det A < 0 */
  function svd2(A) {
    const sv = svd(A);
    const U = clone(sv.U), V = clone(sv.V);
    if (U.length === 2 && U[0].length === 1) { U.forEach((r, i) => r.push(i ? 1 : 0)); }   // (cannot happen for 2×2, kept for safety)
    if (V[0][0] * V[1][1] - V[0][1] * V[1][0] < 0) { V[0][1] = -V[0][1]; V[1][1] = -V[1][1]; U[0][1] = -U[0][1]; U[1][1] = -U[1][1]; }
    const detU = U[0][0] * U[1][1] - U[0][1] * U[1][0];
    const mirror = detU < 0;
    // with a mirror, U = R(θ) · diag(1, −1): the first column still gives the angle
    return { s1: sv.S[0], s2: sv.S[1], U, V, thetaV: Math.atan2(V[1][0], V[0][0]), thetaU: Math.atan2(U[1][0], U[0][0]), mirror, rank: sv.rank, tol: sv.tol };
  }
  /* Jacobi eigenvalues of a symmetric matrix: values descending, vectors as columns (signed like the SVD) */
  function eigSym(S) {
    const n = S.length, A = clone(S), V = eye(n);
    for (let sweep = 0; sweep < 100; sweep++) {
      let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
      if (off < 1e-30) break;
      for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
        for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
      }
    }
    const order = A.map((r, i) => [r[i], i]).sort((a, b) => b[0] - a[0]);
    const vectors = zeros(n, n);
    order.forEach(([, j], c) => { const v = col(V, j); let big = 0; for (let k = 1; k < n; k++) if (Math.abs(v[k]) > Math.abs(v[big])) big = k; const sg = v[big] < 0 ? -1 : 1; for (let k = 0; k < n; k++) vectors[k][c] = sg * v[k]; });
    return { values: order.map(o => o[0]), vectors };
  }
  /* principal components of a data matrix X (one row per observation, one column per variable) */
  function pca(X, opts) {
    opts = opts || {};
    const [n, p] = shape(X);
    if (!n || !p) return { mean: [], sd: [], Xc: [], S: [], variance: [], ratio: [], cum: [], scores: [], V: [] };
    const mean = Array.from({ length: p }, (_, j) => X.reduce((s, r) => s + r[j], 0) / n);
    const sd = Array.from({ length: p }, (_, j) => Math.sqrt(X.reduce((s, r) => s + (r[j] - mean[j]) ** 2, 0) / Math.max(1, n - 1)));
    const Xc = X.map(r => r.map((x, j) => (x - mean[j]) / (opts.standardise && sd[j] > 0 ? sd[j] : 1)));
    const sv = svd(Xc);
    const variance = sv.S.map(s => s * s / Math.max(1, n - 1));
    const total = variance.reduce((a, b) => a + b, 0) || 1;
    const ratio = variance.map(v => v / total);
    const cum = []; ratio.reduce((a, r) => { cum.push(a + r); return a + r; }, 0);
    const scores = mul(Xc, sv.V);
    return { mean, sd, Xc, S: sv.S, variance, ratio, cum, scores, V: sv.V, svd: sv, n, p };
  }

  /* ---------------------------------------------------------------- text and TeX */
  function fmt(v, d) {
    if (!Number.isFinite(v)) return v > 0 ? '∞' : v < 0 ? '−∞' : '—';
    d = d == null ? 3 : d;
    const a = Math.abs(v);
    let s;
    if (a !== 0 && (a < Math.pow(10, -d) / 2 || a >= 1e6)) s = v.toExponential(Math.max(1, d - 1)).replace(/\.?0+e/, 'e').replace('e+', 'e');
    else { s = v.toFixed(d).replace(/\.?0+$/, ''); if (/^-0$/.test(s) || s === '') s = '0'; }
    return s.replace(/-/g, '−');
  }
  const fmtTex = (v, d) => fmt(v, d).replace(/−/g, '-').replace(/e(-?\d+)/, (m, e) => ' \\times 10^{' + e + '}');
  function toTex(A, d, opts) {
    opts = opts || {};
    const env = opts.env || 'pmatrix';
    const body = A.map(r => r.map(x => (opts.blank && x === 0 ? '' : fmtTex(x, d))).join(' & ')).join(' \\\\ ');
    return '\\begin{' + env + '} ' + body + ' \\end{' + env + '}';
  }
  const toText = A => A.map(r => r.map(x => fmt(x, 4).replace('−', '-')).join('  ')).join('\n');
  /* rows on lines (or after ";"), entries by spaces or commas; "1/3" allowed; null when ragged or empty */
  function parse(text) {
    const rows = String(text || '').split(/[\n;]+/).map(l => l.trim()).filter(Boolean).map(l => l.split(/[\s,]+/).filter(Boolean).map(tok => {
      const f = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)\/([-+]?\d*\.?\d+)$/i.exec(tok);
      return f ? +f[1] / +f[2] : Number(tok);
    }));
    if (!rows.length || rows.some(r => !r.length || r.length !== rows[0].length || r.some(x => !Number.isFinite(x)))) return null;
    return rows;
  }

  H.linalg = { EPS, shape, zeros, eye, clone, T, mul, mv, add, sub, scale, outer, dot, norm, fro, diag, gram, col, fromCols, hilbert, rotation, rng,
    svd, svdTrace, svd2, rank, cond, norm2, nuclear, solve, det, pinv, lstsq, layer, lowRank, fourSubspaces, polar, eigSym, pca, fmt, fmtTex, toTex, toText, parse, completeBasis };
})(typeof window !== 'undefined' ? window : globalThis);
