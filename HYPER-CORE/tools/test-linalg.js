/* Tests of HYPER-CORE/js/linalg.js (kit.linalg): the SVD and everything built on it.
 * Run: node HYPER-CORE/tools/test-linalg.js */
'use strict';
const L = require('./load.js');
const H = L.loadCore(), A = H.linalg;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');
const same = (M, N, tol, m) => ok(A.fro(A.sub(M, N)) <= tol, m + ' (difference ' + A.fro(A.sub(M, N)) + ')');
const isOrtho = (Q, tol, m) => { const [r, c] = A.shape(Q); same(A.mul(A.T(Q), Q), A.eye(c), tol, m + ': columns orthonormal (' + r + '×' + c + ')'); };

/* ---------------------------------------------------------------- SVD on matrices with known answers */
{
  // a symmetric 2×2: singular values are |eigenvalues| = 3 and 1
  const s = A.svd([[2, 1], [1, 2]]);
  near(s.S[0], 3, 1e-12, 'svd [[2,1],[1,2]]: σ1 = 3'); near(s.S[1], 1, 1e-12, 'σ2 = 1');
  same(A.mul(A.mul(s.U, A.diag(s.S)), A.T(s.V)), [[2, 1], [1, 2]], 1e-12, 'reconstruction');
  isOrtho(s.U, 1e-12, 'U'); isOrtho(s.V, 1e-12, 'V');
  near(Math.abs(s.V[0][0]), Math.SQRT1_2, 1e-12, 'v1 is along (1, 1)');
  ok(s.rank === 2, 'rank 2');
  // a rotation: both singular values 1, condition number 1
  const R = A.rotation(0.7), sr = A.svd(R);
  near(sr.S[0], 1, 1e-12, 'rotation: σ1 = 1'); near(sr.S[1], 1, 1e-12, 'rotation: σ2 = 1'); near(A.cond(R), 1, 1e-12, 'rotation: κ = 1');
  // a diagonal matrix with a negative entry: singular values are the absolute values, sorted
  const sd = A.svd([[-5, 0], [0, 2]]);
  near(sd.S[0], 5, 1e-12, 'diag(−5, 2): σ1 = 5'); near(sd.S[1], 2, 1e-12, 'σ2 = 2');
  // a shear: σ1 σ2 = |det| = 1, σ1 + ... known: singular values of [[1,1],[0,1]] are (1 ± √5)/2 in absolute value → φ and 1/φ
  const sh = A.svd([[1, 1], [0, 1]]);
  near(sh.S[0], (1 + Math.sqrt(5)) / 2, 1e-12, 'shear: σ1 = golden ratio'); near(sh.S[0] * sh.S[1], 1, 1e-12, 'shear: σ1 σ2 = |det| = 1');
  // rank one
  const r1 = A.svd([[1, 2], [2, 4], [3, 6]]);
  near(r1.S[0], Math.sqrt(70), 1e-12, 'rank-1 3×2: σ1 = √70'); ok(r1.rank === 1, 'rank-1 3×2: rank 1 (σ2 = ' + r1.S[1] + ', tol ' + r1.tol + ')');
  // zero matrix
  const z = A.svd([[0, 0], [0, 0]]);
  ok(z.rank === 0 && z.S[0] === 0, 'zero matrix: rank 0'); isOrtho(z.U, 1e-12, 'zero matrix U'); isOrtho(z.V, 1e-12, 'zero matrix V');
  // 1×1 and a row and a column
  ok(A.svd([[-3]]).S[0] === 3, '1×1: σ = |a|');
  const row = A.svd([[3, 4]]); near(row.S[0], 5, 1e-12, '1×2 row: σ = 5'); ok(row.U.length === 1 && row.V.length === 2 && row.V[0].length === 1, '1×2: U 1×1, V 2×1');
  const column = A.svd([[3], [4]]); near(column.S[0], 5, 1e-12, '2×1 column: σ = 5'); ok(column.U.length === 2 && column.U[0].length === 1, '2×1: U 2×1');
  // identity 3×3 and the full bases
  const I3 = A.svd(A.eye(3), { full: true });
  ok(I3.S.every(s => Math.abs(s - 1) < 1e-12) && I3.rank === 3, 'identity: all σ = 1');
  ok(I3.Ufull.length === 3 && I3.Vfull.length === 3, 'identity: full bases');
}

/* ---------------------------------------------------------------- random matrices of every shape */
{
  const g = A.rng(7);
  for (const [m, n] of [[5, 5], [8, 3], [3, 8], [12, 7], [40, 25], [25, 40], [60, 60]]) {
    const M = Array.from({ length: m }, () => Array.from({ length: n }, () => g.normal()));
    const s = A.svd(M, { full: true });
    const p = Math.min(m, n);
    ok(s.S.length === p && s.U.length === m && s.U[0].length === p && s.V.length === n && s.V[0].length === p, m + '×' + n + ': shapes');
    ok(s.S.every((x, i) => i === 0 || x <= s.S[i - 1] + 1e-12), m + '×' + n + ': singular values descending');
    same(A.mul(A.mul(s.U, A.diag(s.S)), A.T(s.V)), M, 1e-9 * A.fro(M), m + '×' + n + ': reconstruction');
    isOrtho(s.U, 1e-9, m + '×' + n + ' U'); isOrtho(s.V, 1e-9, m + '×' + n + ' V');
    isOrtho(s.Ufull, 1e-9, m + '×' + n + ' Ufull'); isOrtho(s.Vfull, 1e-9, m + '×' + n + ' Vfull');
    ok(s.Ufull.length === m && s.Ufull[0].length === m && s.Vfull.length === n && s.Vfull[0].length === n, m + '×' + n + ': full bases square');
    // the Frobenius norm is the root of the sum of the squares of the singular values
    near(Math.sqrt(s.S.reduce((a, x) => a + x * x, 0)), A.fro(M), 1e-9 * A.fro(M), m + '×' + n + ': ‖A‖_F = √Σσ²');
    // the singular values are the roots of the eigenvalues of AᵀA
    if (n <= 12) { const e = A.eigSym(A.gram(M)); for (let i = 0; i < p; i++) near(Math.sqrt(Math.max(0, e.values[i])), s.S[i], 1e-8, m + '×' + n + ': √λ(AᵀA) = σ ' + i); }
  }
  // the result does not depend on the run (deterministic signs)
  const M = [[1, 2, 0], [0, 1, 3], [4, 0, 1]];
  const a = A.svd(M), b = A.svd(M.map(r => r.slice()));
  same(a.U, b.U, 0, 'deterministic U'); same(a.V, b.V, 0, 'deterministic V');
  // the largest entry of every v is positive
  ok(a.V[0].every((_, j) => { const v = A.col(a.V, j); let big = 0; for (let k = 1; k < v.length; k++) if (Math.abs(v[k]) > Math.abs(v[big])) big = k; return v[big] > 0; }), 'sign convention: largest entry of each v positive');
}

/* ---------------------------------------------------------------- rank, condition number, norms, determinant */
{
  const M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  ok(A.rank(M) === 2, 'rank [[1..9]] = 2 (σ3 = ' + A.svd(M).S[2] + ')');
  ok(A.cond(M) === Infinity, 'singular: κ = ∞');
  near(A.det(M), 0, 1e-9, 'det [[1..9]] = 0');
  near(A.det([[2, 1], [1, 2]]), 3, 1e-12, 'det = 3');
  near(A.det([[0, 1], [1, 0]]), -1, 1e-12, 'det of a swap = −1');
  const Hb = A.hilbert(4);
  const k = A.cond(Hb);
  ok(k > 1.5e4 && k < 1.6e4, 'Hilbert 4×4: κ ≈ 15 514 (got ' + k + ')');
  near(A.norm2([[3, 0], [0, -4]]), 4, 1e-12, '2-norm = largest σ');
  near(A.nuclear([[3, 0], [0, -4]]), 7, 1e-12, 'nuclear norm = Σσ');
  // |det| = product of the singular values
  const N = [[2, 1, 0], [1, 3, 1], [0, 1, 4]];
  near(Math.abs(A.det(N)), A.svd(N).S.reduce((a, b) => a * b, 1), 1e-10, '|det| = σ1 σ2 σ3');
}

/* ---------------------------------------------------------------- pseudoinverse and least squares */
{
  // square invertible: the pseudoinverse is the inverse
  const M = [[4, 7], [2, 6]], Mi = [[0.6, -0.7], [-0.2, 0.4]];
  same(A.pinv(M), Mi, 1e-12, 'pinv of an invertible matrix is its inverse');
  // the four Moore–Penrose conditions on a rank-deficient matrix
  const R = [[1, 2], [2, 4], [3, 6]], P = A.pinv(R);
  same(A.mul(A.mul(R, P), R), R, 1e-10, 'A A⁺ A = A');
  same(A.mul(A.mul(P, R), P), P, 1e-10, 'A⁺ A A⁺ = A⁺');
  same(A.mul(R, P), A.T(A.mul(R, P)), 1e-10, 'A A⁺ symmetric');
  same(A.mul(P, R), A.T(A.mul(P, R)), 1e-10, 'A⁺ A symmetric');
  // least squares straight line through (0,1) (1,2) (2,2) (3,4): slope 0.9, intercept 0.9
  const X = [[1, 0], [1, 1], [1, 2], [1, 3]], y = [1, 2, 2, 4];
  const f = A.lstsq(X, y);
  near(f.x[0], 0.9, 1e-12, 'fit intercept 0.9'); near(f.x[1], 0.9, 1e-12, 'fit slope 0.9');
  // the same as the normal equations
  const xn = A.solve(A.gram(X), A.mv(A.T(X), y));
  near(xn[0], 0.9, 1e-12, 'normal equations intercept'); near(xn[1], 0.9, 1e-12, 'normal equations slope');
  ok(f.rank === 2 && Number.isFinite(f.cond), 'fit: full rank, finite κ');
  // residual is orthogonal to the columns
  near(A.dot(f.r, A.col(X, 0)), 0, 1e-10, 'residual ⟂ column 1'); near(A.dot(f.r, A.col(X, 1)), 0, 1e-10, 'residual ⟂ column 2');
  // a duplicated column: rank 2 of 3, the minimum-norm solution splits the coefficient equally
  const X2 = X.map(r => [r[0], r[1], r[1]]);
  const f2 = A.lstsq(X2, y);
  ok(f2.rank === 2, 'duplicate column: rank 2 (σ3 = ' + f2.S[2] + ')');
  near(f2.x[1], 0.45, 1e-10, 'duplicate column: coefficient shared, 0.45'); near(f2.x[2], 0.45, 1e-10, 'duplicate column: and 0.45');
  near(f2.resid, f.resid, 1e-10, 'duplicate column: same residual as the clean fit');
  // truncation and Tikhonov shrink the solution
  const ft = A.lstsq(X, y, { k: 1 });
  ok(ft.used === 1 && ft.resid > f.resid, 'truncated to k = 1: larger residual');
  const fr = A.lstsq(X, y, { lambda: 1 });
  ok(A.norm(fr.x) < A.norm(f.x), 'Tikhonov λ = 1: shorter solution');
  // the singular system has no Gaussian solution
  ok(A.solve([[1, 2], [2, 4]], [1, 2]) === null, 'solve: singular reported as null');
  const sx = A.solve([[2, 1], [1, 3]], [3, 5]);
  near(sx[0], 0.8, 1e-12, 'solve x'); near(sx[1], 1.4, 1e-12, 'solve y');
}

/* ---------------------------------------------------------------- low rank, layers, subspaces, polar */
{
  const g = A.rng(3);
  const M = Array.from({ length: 10 }, () => Array.from({ length: 7 }, () => g.normal()));
  const sv = A.svd(M);
  for (const k of [0, 1, 3, 7]) {
    const lr = A.lowRank(M, k, sv);
    near(A.norm2(A.sub(M, lr.Ak)), k < 7 ? sv.S[k] : 0, 1e-9, 'Eckart–Young: ‖A − A_k‖₂ = σ_{k+1} for k = ' + k);
    near(A.fro(A.sub(M, lr.Ak)), lr.errF, 1e-9, 'Frobenius error reported, k = ' + k);
    ok(lr.storage === k * (10 + 7 + 1) && lr.full === 70, 'storage count, k = ' + k);
    ok(k === 0 ? lr.energy === 0 : k === 7 ? Math.abs(lr.energy - 1) < 1e-12 : lr.energy > 0 && lr.energy < 1, 'energy fraction, k = ' + k);
    ok(A.rank(lr.Ak) === Math.min(k, 7), 'A_k has rank ' + k);
  }
  // any other rank-1 matrix is worse than the first layer
  const l1 = A.layer(sv, 0), other = A.outer(A.col(M, 0), A.col(A.T(M), 0));
  ok(A.fro(A.sub(M, l1)) < A.fro(A.sub(M, A.scale(other, A.dot(M.flat(), other.flat()) / A.dot(other.flat(), other.flat())))), 'the first layer beats another rank-one guess');
  // layers add up to A
  let sum = A.zeros(10, 7); for (let i = 0; i < 7; i++) sum = A.add(sum, A.layer(sv, i));
  same(sum, M, 1e-9, 'Σ layers = A');
  // four subspaces of a rank-2 3×3
  const S = A.fourSubspaces([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  ok(S.rank === 2 && S.col.length === 2 && S.row.length === 2 && S.nul.length === 1 && S.leftNul.length === 1, 'four subspaces: 2, 2, 1, 1');
  near(A.norm(A.mv([[1, 2, 3], [4, 5, 6], [7, 8, 9]], S.nul[0])), 0, 1e-9, 'A × (null vector) = 0');
  near(A.norm(A.mv(A.T([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), S.leftNul[0])), 0, 1e-9, 'Aᵀ × (left null vector) = 0');
  near(Math.abs(A.dot(S.nul[0], [1, -2, 1])) / Math.sqrt(6), 1, 1e-9, 'null vector ∝ (1, −2, 1)');
  // polar decomposition of a rotation-stretch
  const B = A.mul(A.rotation(0.4), [[2, 0], [0, 0.5]]);
  const { Q, P } = A.polar(B);
  isOrtho(Q, 1e-12, 'polar Q'); same(A.mul(Q, P), B, 1e-12, 'Q P = A'); same(P, A.T(P), 1e-12, 'P symmetric');
  same(Q, A.rotation(0.4), 1e-12, 'polar Q is the rotation part');
}

/* ---------------------------------------------------------------- 2 × 2 geometry */
{
  const B = A.mul(A.rotation(0.5), A.mul([[3, 0], [0, 1]], A.T(A.rotation(0.2))));
  const d = A.svd2(B);
  near(d.s1, 3, 1e-12, 'svd2: σ1 = 3'); near(d.s2, 1, 1e-12, 'svd2: σ2 = 1');
  ok(!d.mirror, 'svd2: no mirror for det > 0');
  near(Math.abs(Math.sin(d.thetaV - 0.2)), 0, 1e-9, 'svd2: V rotates by 0.2 (mod π)');
  near(Math.abs(Math.sin(d.thetaU - 0.5)), 0, 1e-9, 'svd2: U rotates by 0.5 (mod π)');
  near(d.V[0][0] * d.V[1][1] - d.V[0][1] * d.V[1][0], 1, 1e-12, 'svd2: det V = +1');
  const Rm = A.svd2([[1, 0], [0, -1]]);
  ok(Rm.mirror, 'svd2: a reflection is flagged as a mirror');
  same(A.mul(A.mul(Rm.U, A.diag([Rm.s1, Rm.s2])), A.T(Rm.V)), [[1, 0], [0, -1]], 1e-12, 'svd2: reconstruction with the mirror');
}

/* ---------------------------------------------------------------- symmetric eigenvalues and PCA */
{
  const e = A.eigSym([[2, 1], [1, 2]]);
  near(e.values[0], 3, 1e-12, 'eigSym: 3'); near(e.values[1], 1, 1e-12, 'eigSym: 1');
  near(Math.abs(e.vectors[0][0]), Math.SQRT1_2, 1e-12, 'eigSym: eigenvector along (1, 1)');
  const e3 = A.eigSym([[4, 1, 0], [1, 3, 1], [0, 1, 2]]);
  const Mt = [[4, 1, 0], [1, 3, 1], [0, 1, 2]];
  for (let i = 0; i < 3; i++) { const v = A.col(e3.vectors, i); near(A.fro(A.sub([A.mv(Mt, v)], [v.map(x => x * e3.values[i])])), 0, 1e-9, 'eigSym 3×3: A v = λ v, ' + i); }
  // PCA of points along a line of slope 2 with small noise
  const g = A.rng(11);
  const X = Array.from({ length: 200 }, () => { const t = g.normal() * 3; return [t + 0.05 * g.normal(), 2 * t + 0.05 * g.normal()]; });
  const p = A.pca(X);
  ok(p.ratio[0] > 0.99, 'PCA: first component carries > 99 % (got ' + p.ratio[0] + ')');
  near(Math.abs(p.V[1][0] / p.V[0][0]), 2, 0.02, 'PCA: first axis has slope 2');
  near(p.cum[1], 1, 1e-12, 'PCA: cumulative ratio ends at 1');
  near(p.variance[0] + p.variance[1], p.sd[0] ** 2 + p.sd[1] ** 2, 1e-9, 'PCA: total variance preserved');
  ok(p.scores.length === 200 && p.scores[0].length === 2, 'PCA: scores n×p');
  near(p.scores.reduce((s, r) => s + r[0], 0), 0, 1e-9, 'PCA: scores centred');
  const ps = A.pca(X, { standardise: true });
  near(ps.variance[0] + ps.variance[1], 2, 1e-9, 'PCA standardised: total variance = number of variables');
}

/* ---------------------------------------------------------------- text, TeX, parsing */
{
  ok(A.fmt(0) === '0' && A.fmt(-0) === '0' && A.fmt(1.5) === '1.5' && A.fmt(-2) === '−2' && A.fmt(1 / 3, 3) === '0.333', 'fmt basics');
  ok(A.fmt(1e-9, 3) === '1e−9' && A.fmt(12345678, 3) === '1.23e7' && A.fmtTex(1e-9, 3) === '1 \\times 10^{-9}', 'fmt small and large: ' + A.fmt(1e-9, 3) + ', ' + A.fmt(12345678, 3) + ', ' + A.fmtTex(1e-9, 3));
  ok(A.toTex([[1, -2], [0.5, 0]]) === '\\begin{pmatrix} 1 & -2 \\\\ 0.5 & 0 \\end{pmatrix}', 'toTex: ' + A.toTex([[1, -2], [0.5, 0]]));
  ok(A.toTex([[2, 0], [0, 0]], 2, { blank: true }).includes('& \\\\') || A.toTex([[2, 0], [0, 0]], 2, { blank: true }).includes('2 &  \\\\'), 'toTex blanks zeros');
  same(A.parse('1 2\n3 4'), [[1, 2], [3, 4]], 0, 'parse rows on lines');
  same(A.parse('1, 2; 3, 4'), [[1, 2], [3, 4]], 0, 'parse rows on semicolons');
  same(A.parse('1/2 -3'), [[0.5, -3]], 0, 'parse fractions');
  ok(A.parse('1 2\n3') === null && A.parse('') === null && A.parse('a b') === null, 'parse rejects ragged, empty, non-numeric');
  ok(A.parse(A.toText([[1, 2], [3, 4]])).length === 2, 'toText round-trips');
}

/* ---------------------------------------------------------------- the traced algorithm */
{
  const tr = A.svdTrace([[3, 1], [1, 3]]);
  ok(tr.steps.length >= 2 && tr.steps[0].i === -1, 'trace: starts with the matrix itself, then rotations');
  ok(tr.steps[tr.steps.length - 1].off < 1e-12, 'trace: columns orthogonal at the end (off = ' + tr.steps[tr.steps.length - 1].off + ')');
  near(tr.S[0], 4, 1e-12, 'trace: σ1 = 4'); near(tr.S[1], 2, 1e-12, 'trace: σ2 = 2');
  const t4 = A.svdTrace(A.hilbert(4));
  ok(!t4.stopped && t4.steps.every(s => s.cols.length === 4), 'trace: Hilbert 4×4 finishes, ' + t4.steps.length + ' steps in ' + t4.sweeps + ' sweeps');
  ok(t4.steps.every((s, i) => i === 0 || s.off <= t4.steps[0].off + 1e-9), 'trace: no step is worse than the start');
}

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
