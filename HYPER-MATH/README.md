# Hyper Math

The mathematics of science and engineering as a map of connected ideas — the companion
of Hyper Physics, built on the same engine (`../HYPER-CORE`). All text, questions and
simulations are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-MATH/>. No installation, no network.

## What is in it

**158 concepts** in 10 branches and 27 topics, with **367 formula calculators**, **53 simulations**
(used 125 times), **785 quiz questions** — many of them answered by typing an expression
(`3x^2 sin x`), which is checked for equivalence — **397 worked examples** and 76 problems.

| Branch | Concepts | Topics |
|---|---:|---|
| Algebra | 26 | numbers and powers · equations and inequalities · polynomials · functions · exponentials and logarithms |
| Geometry | 19 | plane geometry · solid geometry · coordinate geometry and conics |
| Trigonometry | 10 | trigonometric functions · identities and triangles |
| Vectors | 14 | vector algebra · vector calculus |
| Calculus | 32 | limits · derivatives · using derivatives · integrals · using integrals · several variables |
| Sequences & Series | 7 | sequences, convergence, power, Taylor and Fourier series |
| Differential Equations | 15 | first-order · second-order (the oscillators) · partial differential equations |
| Complex Numbers | 6 | the complex plane, Euler's formula, roots of unity, phasors |
| Linear Algebra | 13 | matrices, determinants, elimination, transformations, eigenvalues, orthogonal matrices, the SVD, low-rank approximation, the pseudoinverse and least squares, PCA |
| Probability & Statistics | 16 | probability · distributions · statistics and measurement uncertainty |

Every page links to the physics that uses it: a "Used in Hyper Physics" list and dashed
bubbles on its map (from `../HYPER-PHYSICS/catalog.js`).

The **function plotter** (Tools) draws typed functions; any letter other than x becomes a
parameter with its own slider, and it can add the derivatives, shade an integral and mark
the roots. Share a plot with the Link button.

The **SVD lab** (Tools → SVD lab, `#/tools/svdlab`) is a playground for the singular value
decomposition: type any matrix up to 8 × 8 and read U, Σ, Vᵀ, the rank, norms, condition number,
the four fundamental subspaces, the best rank-k approximation, the pseudoinverse and the solution
of A x = b; watch the one-sided Jacobi rotations that compute it; see the 2 × 2 case as rotate –
stretch – rotate; compress a built-in picture or your own file to rank k; fit data with the
pseudoinverse against the normal equations, truncation and Tikhonov; and run principal component
analysis on built-in or pasted data. The arithmetic is `../HYPER-CORE/js/linalg.js`
(`kit.linalg`, tested by `HYPER-CORE/tools/test-linalg.js`); the lab is checked headless by
`node HYPER-CORE/tools/labtest.js --app math`.

## Files and checks

Same layout as Hyper Physics: `content/outline.js`, one `content/*.js` per topic,
`sims/*.js`, and a generated `catalog.js`. See `../HYPER-CORE/AUTHORING.md`, and run

```bash
node HYPER-CORE/tools/validate.js HYPER-MATH
node HYPER-CORE/tools/simtest.js HYPER-MATH
```
