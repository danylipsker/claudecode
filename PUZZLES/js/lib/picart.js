/* The Puzzle Cabinet · js/lib/picart.js
 *
 * The little pictures of engines/picsums.js: fruit, garden things, animal
 * faces, shapes, sweets, marbles and weights. Every picture is drawn in a
 * 100 × 100 box as an SVG string (so the board, the thumbnails and the hint
 * text can all use it).
 *
 *   C.picArt.svg(id, n, opts)   the elements (no <svg> around them)
 *   C.picArt.inline(id, n)      a small <svg> for text
 *   C.picArt.info[id]           { name, plural, main, theme }
 *       main: how many parts the usual picture shows (a bunch of 3 bananas, a
 *       flower with 5 petals); n draws a different number of them.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const f = (v) => Math.round(v * 100) / 100;
  const P = (d, fill, stroke, w, extra) => '<path d="' + d + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round" stroke-linecap="round"' : '') + (extra || '') + '/>';
  const Cc = (cx, cy, r, fill, stroke, w, extra) => '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (w || 3) + '"' : '') + (extra || '') + '/>';
  const El = (cx, cy, rx, ry, fill, stroke, w, rot) => '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (w || 3) + '"' : '') + (rot ? ' transform="rotate(' + rot + ' ' + f(cx) + ' ' + f(cy) + ')"' : '') + '/>';
  const Ln = (d, stroke, w) => '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const G = (tr, body) => '<g transform="' + tr + '">' + body + '</g>';
  const shine = (cx, cy, rx, ry, rot) => El(cx, cy, rx, ry, '#fff', null, 0, rot).replace('/>', ' opacity=".45"/>');
  const eye = (x, y, r) => Cc(x, y, r, '#2b1d14') + Cc(x - r * 0.35, y - r * 0.35, r * 0.35, '#fff');

  const ART = {};
  const INFO = {};
  function def(id, name, plural, theme, main, draw) { INFO[id] = { name, plural, theme, main: main || 1 }; ART[id] = draw; }

  /* ---------------- fruit ---------------- */

  def('apple', 'apple', 'apples', 'fruit', 2, (n) => {
    const leaf = P('M53 21C60 10 74 10 79 14C73 23 61 25 53 21Z', '#5cb85c', '#2e7d32', 2.5) + Ln('M50 31Q50 21 55 13', '#6b4226', 4);
    if (n === 1) {
      return P('M50 31C38 23 16 27 16 53C16 77 34 91 44 89C47 88.5 49 88 50 88Z', '#e5383b', '#9b1d20') +
        El(50, 59, 13, 29, '#fff3d6', '#9b1d20', 3) + P('M47 52C45 56 46 60 48 61C50 58 50 54 47 52Z', '#5a3a22') + P('M48 64C46 68 47 72 49 73C51 70 51 66 48 64Z', '#5a3a22') +
        shine(31, 46, 5, 10, -20) + leaf;
    }
    return P('M50 31C38 23 16 27 16 53C16 77 34 91 44 89C48 88 52 88 56 89C66 91 84 77 84 53C84 27 62 23 50 31Z', '#e5383b', '#9b1d20') +
      shine(33, 46, 6, 11, -20) + leaf;
  });

  def('banana', 'bunch of bananas', 'bunches of bananas', 'fruit', 3, (n) => {
    let s = '';
    const one = P('M24 32C25 62 52 86 86 75C89 74 89 70 86 69C60 73 38 57 33 30Z', '#ffd84d', '#b8860b', 3) + P('M86 69C89 70 90 73 86 75Z', '#5a4312', '#5a4312', 2) + Ln('M31 40C35 58 52 70 74 71', '#e6b52e', 2.5);
    for (let i = 0; i < n; i++) {
      const a = (i - (n - 1) / 2) * 17;
      s += G('rotate(' + a + ' 28 30)', one);
    }
    return s + P('M21 33L23 19L33 21L32 33Z', '#8a6a24', '#5a4312', 2.5);
  });

  def('cherries', 'pair of cherries', 'pairs of cherries', 'fruit', 2, (n) => {
    const pos = n === 1 ? [[50, 72]] : n === 2 ? [[33, 71], [67, 71]] : [[26, 72], [50, 79], [74, 70]];
    let s = P('M54 17C62 8 78 8 84 13C77 21 63 22 54 17Z', '#5cb85c', '#2e7d32', 2.5);
    pos.forEach((p) => { s += Ln('M53 16Q' + (p[0] * 0.5 + 26) + ' 30 ' + p[0] + ' ' + (p[1] - 15), '#5d7a2a', 3.5); });
    pos.forEach((p) => { s += Cc(p[0], p[1], 15, '#d62839', '#7b0d1e') + shine(p[0] - 5, p[1] - 5, 3.5, 5.5, -30); });
    return s;
  });

  def('grapes', 'bunch of grapes', 'bunches of grapes', 'fruit', 1, () => {
    let s = Ln('M50 22Q50 12 58 8', '#6b4226', 4) + P('M52 18C58 6 74 6 80 12C72 20 60 22 52 18Z', '#5cb85c', '#2e7d32', 2.5);
    [[4, 30], [3, 45], [2, 60], [1, 75]].forEach(([k, y]) => {
      for (let i = 0; i < k; i++) { const x = 50 + (i - (k - 1) / 2) * 17; s += Cc(x, y, 10, '#7b4bb3', '#4a2477', 2.5) + shine(x - 3, y - 3, 2.5, 3.5, -30); }
    });
    return s;
  });

  def('lemon', 'lemon', 'lemons', 'fruit', 1, () =>
    P('M12 54C18 28 82 28 88 54C82 80 18 80 12 54Z', '#ffe14d', '#c9a100') + P('M10 54L4 52L10 50Z', '#c9a100', '#c9a100', 2) + P('M90 54L96 56L90 58Z', '#c9a100', '#c9a100', 2) +
    shine(34, 44, 10, 4, -12) + P('M48 34C52 24 62 22 68 24C64 32 56 35 48 34Z', '#5cb85c', '#2e7d32', 2.5));

  def('strawberry', 'strawberry', 'strawberries', 'fruit', 1, () => {
    let s = P('M50 92C20 72 14 48 24 36C32 28 44 32 50 36C56 32 68 28 76 36C86 48 80 72 50 92Z', '#e63946', '#8f1d24');
    [[36, 48], [50, 46], [64, 48], [30, 60], [44, 60], [58, 60], [70, 60], [38, 72], [52, 73], [64, 71], [50, 84]].forEach((p) => { s += El(p[0], p[1], 1.8, 3, '#ffe38a'); });
    return s + P('M50 38L36 30L44 28L38 20L50 26L62 20L56 28L64 30Z', '#3fa34d', '#1f6e2c', 2.5) + Ln('M50 26V16', '#3f7a2e', 4);
  });

  def('pear', 'pear', 'pears', 'fruit', 1, () =>
    P('M50 22C58 22 60 32 62 42C66 54 82 60 80 77C78 90 62 94 50 94C38 94 22 90 20 77C18 60 34 54 38 42C40 32 42 22 50 22Z', '#b5d334', '#6d8a13') +
    shine(36, 70, 6, 11, 10) + Ln('M50 23Q50 13 56 9', '#6b4226', 4) + P('M54 16C60 8 70 8 74 12C69 18 61 19 54 16Z', '#5cb85c', '#2e7d32', 2.5));

  def('orange', 'orange', 'oranges', 'fruit', 1, () => {
    let s = Cc(50, 56, 34, '#ff9f1c', '#c46a00');
    [[40, 48], [58, 44], [66, 60], [46, 68], [34, 60], [56, 76]].forEach((p) => { s += Cc(p[0], p[1], 1.4, '#d98100'); });
    return s + shine(38, 42, 7, 11, -35) + Cc(50, 23, 3, '#6b8e23') + P('M52 22C58 12 72 12 76 17C70 24 60 26 52 22Z', '#5cb85c', '#2e7d32', 2.5);
  });

  def('watermelon', 'slice of watermelon', 'slices of watermelon', 'fruit', 1, () => {
    let s = P('M10 34H90C90 64 72 86 50 86C28 86 10 64 10 34Z', '#3f9b3a', '#1f5f1d') + P('M17 34H83C83 60 68 78 50 78C32 78 17 60 17 34Z', '#fff3d6') + P('M21 34H79C79 57 66 73 50 73C34 73 21 57 21 34Z', '#ff4d6d');
    [[34, 44], [50, 42], [66, 44], [42, 56], [58, 56], [50, 66]].forEach((p) => { s += El(p[0], p[1], 2.2, 3.6, '#2b1d14'); });
    return s;
  });

  /* ---------------- garden ---------------- */

  def('flower', 'flower', 'flowers', 'garden', 5, (n) => {
    let s = Ln('M50 58Q46 78 50 96', '#3f8f3a', 5) + P('M49 80C38 70 26 72 22 76C30 84 42 84 49 80Z', '#5cb85c', '#2e7d32', 2.5);
    for (let i = 0; i < n; i++) { const a = i * 360 / n; s += El(50, 23, 10, 16, '#ff7eb6', '#b83b76', 2.5, 0).replace('/>', ' transform="rotate(' + f(a) + ' 50 42)"/>'); }
    return s + Cc(50, 42, 11, '#ffd166', '#c98f00', 2.5) + Cc(47, 39, 3, '#fff', null, 0, ' opacity=".6"');
  });

  def('clover', 'clover leaf', 'clover leaves', 'garden', 4, (n) => {
    let s = Ln('M50 50Q54 76 64 94', '#2e7d32', 5);
    const heart = 'M0 -2C-4 -9 -18 -11 -18 -22C-18 -31 -7 -33 0 -25C7 -33 18 -31 18 -22C18 -11 4 -9 0 -2Z';
    for (let i = 0; i < n; i++) s += G('translate(50 46) rotate(' + f(i * 360 / n + (n === 3 ? 0 : 45)) + ')', P(heart, '#3fa34d', '#1f6e2c', 2.5) + Ln('M0 -4V-18', '#8fd18a', 2));
    return s + Cc(50, 46, 4, '#2e7d32');
  });

  def('mushroom', 'mushroom', 'mushrooms', 'garden', 1, () =>
    P('M38 56C36 72 36 84 40 91H60C64 84 64 72 62 56Z', '#f7ecd6', '#b89f7a') + P('M12 58C12 26 88 26 88 58C70 62 30 62 12 58Z', '#e63946', '#8f1d24') +
    Cc(34, 40, 6, '#fff') + Cc(56, 34, 5, '#fff') + Cc(70, 48, 4.5, '#fff') + Cc(46, 52, 3.5, '#fff') + shine(28, 38, 3, 7, -40));

  def('ladybird', 'ladybird', 'ladybirds', 'garden', 1, () =>
    Ln('M44 18L38 8M56 18L62 8', '#1a1a1a', 3) + Cc(50, 58, 33, '#e63946', '#1a1a1a') + P('M30 32C34 18 66 18 70 32C62 36 38 36 30 32Z', '#1a1a1a', '#1a1a1a', 3) +
    Ln('M50 34V90', '#1a1a1a', 3) + Cc(36, 50, 6, '#1a1a1a') + Cc(64, 50, 6, '#1a1a1a') + Cc(34, 70, 5, '#1a1a1a') + Cc(66, 70, 5, '#1a1a1a') + Cc(50, 80, 0.1, '#1a1a1a') +
    Cc(42, 27, 3, '#fff') + Cc(58, 27, 3, '#fff') + shine(64, 42, 4, 7, 35));

  def('snail', 'snail', 'snails', 'garden', 1, () =>
    P('M10 82C10 70 22 68 32 72L86 78C92 80 90 88 84 88H18C12 88 10 86 10 82Z', '#c2d6a8', '#6d8a53') + Ln('M20 70L14 52M28 70L28 50', '#6d8a53', 3) + Cc(14, 50, 3.5, '#2b1d14') + Cc(28, 48, 3.5, '#2b1d14') +
    Cc(60, 52, 27, '#e09f3e', '#8a5a1e') + Ln('M60 52m0 -4a4 4 0 1 1 -4 4a8 8 0 0 1 8 -8a12 12 0 0 1 12 12a16 16 0 0 1 -16 16a20 20 0 0 1 -20 -20', '#8a5a1e', 3));

  def('carrot', 'carrot', 'carrots', 'garden', 1, () =>
    P('M50 30L38 12M50 30L50 8M50 30L62 12', '#3fa34d', '#2e7d32', 5) +
    P('M36 32H64C67 32 67 36 65 42L53 92C52 95 48 95 47 92L35 42C33 36 33 32 36 32Z', '#ff8c1a', '#b35600') + Ln('M40 48H48M55 60H62M42 70H49M52 80H56', '#b35600', 2.5));

  /* ---------------- animals (faces) ---------------- */

  def('cat', 'cat', 'cats', 'animals', 1, () =>
    P('M20 40L24 12L42 30C47 29 53 29 58 30L76 12L80 40C86 50 86 66 78 76C70 86 30 86 22 76C14 66 14 50 20 40Z', '#f4a259', '#9c5a1c') +
    P('M27 32L28 20L37 29Z', '#ffc0cb') + P('M73 32L72 20L63 29Z', '#ffc0cb') + eye(38, 52, 5.5) + eye(62, 52, 5.5) +
    P('M46 62H54L50 67Z', '#ff8fab', '#b35c73', 2) + Ln('M50 67Q46 73 41 71M50 67Q54 73 59 71', '#6b3a14', 2.5) +
    Ln('M36 64L16 60M36 68L17 70M64 64L84 60M64 68L83 70', '#6b3a14', 2));

  def('dog', 'dog', 'dogs', 'animals', 1, () =>
    El(50, 55, 30, 32, '#c68b59', '#7a4b2a') + El(20, 50, 11, 24, '#7a4b2a', '#4d2e17', 3, 18) + El(80, 50, 11, 24, '#7a4b2a', '#4d2e17', 3, -18) +
    El(50, 70, 16, 12, '#f1d3b3', '#7a4b2a', 2.5) + El(50, 63, 7, 5, '#2b1d14') + eye(39, 48, 5) + eye(61, 48, 5) +
    Ln('M50 68V74M44 76Q50 80 56 76', '#4d2e17', 2.5) + P('M47 78Q50 88 53 78Z', '#ff6f91', '#c2185b', 1.5));

  def('owl', 'owl', 'owls', 'animals', 1, () =>
    P('M22 28L30 14L40 24C46 22 54 22 60 24L70 14L78 28C86 42 86 72 72 86C64 94 36 94 28 86C14 72 14 42 22 28Z', '#8d6e63', '#4e342e') +
    El(50, 72, 18, 16, '#d7ccc8') + Ln('M42 68Q46 72 50 68Q54 72 58 68M44 78Q48 82 52 78Q56 82 58 78', '#a1887f', 2) +
    Cc(37, 44, 13, '#fff', '#4e342e', 2.5) + Cc(63, 44, 13, '#fff', '#4e342e', 2.5) + eye(37, 45, 6.5) + eye(63, 45, 6.5) + P('M46 54H54L50 62Z', '#ff9f1c', '#c46a00', 2));

  def('fish', 'fish', 'fish', 'animals', 1, () =>
    P('M78 50L96 32V68Z', '#4fc3f7', '#0277bd') + El(48, 50, 34, 22, '#4fc3f7', '#0277bd') + P('M40 30Q50 16 62 30Z', '#29b6f6', '#0277bd', 2.5) +
    Ln('M56 36Q62 50 56 64M66 38Q71 50 66 62', '#0288d1', 2.5) + eye(28, 46, 5) + Ln('M16 56Q20 58 24 56', '#01579b', 2.5) + shine(40, 40, 8, 3, -10));

  def('frog', 'frog', 'frogs', 'animals', 1, () =>
    Cc(32, 34, 13, '#7bc043', '#3d7a1c') + Cc(68, 34, 13, '#7bc043', '#3d7a1c') + El(50, 62, 38, 28, '#7bc043', '#3d7a1c') +
    Cc(32, 33, 8, '#fff') + Cc(68, 33, 8, '#fff') + eye(33, 34, 4.5) + eye(67, 34, 4.5) +
    Ln('M30 66Q50 80 70 66', '#2e5f14', 3) + El(24, 70, 6, 4, '#ff9aa2') + El(76, 70, 6, 4, '#ff9aa2') + Cc(45, 56, 1.5, '#2e5f14') + Cc(55, 56, 1.5, '#2e5f14'));

  def('bunny', 'rabbit', 'rabbits', 'animals', 1, () =>
    El(36, 26, 9, 22, '#eeeeee', '#8e8e8e', 3, -10) + El(64, 26, 9, 22, '#eeeeee', '#8e8e8e', 3, 10) + El(36, 27, 4.5, 15, '#ffb3c6', null, 0, -10) + El(64, 27, 4.5, 15, '#ffb3c6', null, 0, 10) +
    Cc(50, 64, 28, '#f5f5f5', '#8e8e8e') + eye(40, 58, 4.5) + eye(60, 58, 4.5) + P('M46 66H54L50 71Z', '#ff8fab', '#b35c73', 2) +
    P('M46 74H54V81H46Z', '#fff', '#8e8e8e', 2) + Ln('M50 74V81', '#8e8e8e', 1.5) + El(32, 70, 5, 3, '#ffb3c6') + El(68, 70, 5, 3, '#ffb3c6'));

  def('pig', 'pig', 'pigs', 'animals', 1, () =>
    P('M22 34L20 16L38 26Z', '#f8a5c2', '#c2587e') + P('M78 34L80 16L62 26Z', '#f8a5c2', '#c2587e') + Cc(50, 56, 32, '#f8a5c2', '#c2587e') +
    El(50, 64, 14, 10, '#f27aa5', '#c2587e', 2.5) + El(45, 64, 3, 4, '#8c2f55') + El(55, 64, 3, 4, '#8c2f55') + eye(38, 48, 4.5) + eye(62, 48, 4.5) + Ln('M42 79Q50 83 58 79', '#8c2f55', 2.5));

  def('chick', 'chick', 'chicks', 'animals', 1, () =>
    Ln('M50 22Q46 12 52 8M50 22Q56 14 60 16', '#e0a800', 3) + Cc(50, 56, 34, '#ffd23f', '#d49b00') + P('M76 58C86 56 88 68 78 72', '#ffc300', '#d49b00', 3) +
    eye(40, 48, 5) + eye(60, 48, 5) + P('M44 58H56L50 67Z', '#ff9f1c', '#c46a00', 2) + El(32, 64, 6, 4, '#ffb38a') + El(68, 64, 6, 4, '#ffb38a'));

  def('hat', 'hat', 'hats', 'animals', 1, () =>
    El(50, 76, 40, 10, '#2b2b2b', '#111') + P('M28 76V30C28 24 72 24 72 30V76Z', '#2b2b2b', '#111') + P('M28 62H72V72H28Z', '#d62839', '#7b0d1e', 2) + shine(38, 44, 3, 12, 0));

  /* ---------------- shapes ---------------- */

  function starPath(n, R, r, cx, cy) {
    let d = '';
    for (let i = 0; i < 2 * n; i++) { const a = -Math.PI / 2 + i * Math.PI / n, q = i % 2 ? r : R; d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * q) + ' ' + f(cy + Math.sin(a) * q); }
    return d + 'Z';
  }
  def('circle', 'circle', 'circles', 'shapes', 1, () => Cc(50, 52, 34, '#4ea8de', '#1d6fa5') + shine(38, 40, 8, 12, -35));
  def('square', 'square', 'squares', 'shapes', 1, () => '<rect x="18" y="22" width="64" height="64" rx="8" fill="#6fcf97" stroke="#2e8b57" stroke-width="3.5"/>' + shine(32, 36, 6, 10, -30));
  def('triangle', 'triangle', 'triangles', 'shapes', 1, () => P('M50 14L88 84H12Z', '#f9a03f', '#b86a0d', 3.5) + shine(42, 44, 4, 11, 28));
  def('star', 'star', 'stars', 'shapes', 5, (n) => P(starPath(n, 40, n > 5 ? 20 : 17, 50, 54), '#ffd23f', '#c99a00', 3.5) + shine(40, 44, 4, 8, -30));
  def('heart', 'heart', 'hearts', 'shapes', 1, () => P('M50 88C20 66 10 50 12 36C14 20 34 14 50 30C66 14 86 20 88 36C90 50 80 66 50 88Z', '#ff5d8f', '#b3264f', 3.5) + shine(30, 36, 5, 9, -35));
  def('hexagon', 'hexagon', 'hexagons', 'shapes', 1, () => { let d = ''; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; d += (i ? 'L' : 'M') + f(50 + Math.cos(a) * 38) + ' ' + f(52 + Math.sin(a) * 38); } return P(d + 'Z', '#b388ff', '#6a3fc7', 3.5) + shine(36, 40, 5, 10, -30); });
  def('diamond', 'diamond', 'diamonds', 'shapes', 1, () => P('M50 12L84 52L50 92L16 52Z', '#38d9d3', '#138a85', 3.5) + shine(38, 44, 4, 10, 40));
  def('moon', 'moon', 'moons', 'shapes', 1, () => P('M62 14C38 16 22 34 22 54C22 76 40 92 62 92C48 84 40 70 40 54C40 36 48 22 62 14Z', '#ffe066', '#c9a100', 3.5));

  /* ---------------- sweets ---------------- */

  def('cupcake', 'cupcake', 'cupcakes', 'sweets', 1, () =>
    P('M24 58H76L68 92H32Z', '#4ea8de', '#1d6fa5') + Ln('M36 60L40 92M50 60V92M64 60L60 92', '#1d6fa5', 2.5) +
    P('M20 60C14 50 24 40 32 42C32 30 46 26 52 32C58 24 74 30 70 42C80 42 86 52 80 60Z', '#ffb3d1', '#c2587e') + Cc(52, 24, 7, '#d62839', '#7b0d1e', 2.5) + Ln('M52 17Q56 10 62 9', '#5d7a2a', 2.5));
  def('donut', 'doughnut', 'doughnuts', 'sweets', 1, () => {
    let s = Cc(50, 52, 36, '#d9a066', '#9c6a2f') + P('M20 50C16 30 40 16 58 20C76 22 88 38 82 54C78 62 70 58 64 62C58 66 50 60 42 64C34 68 22 62 20 50Z', '#ff8fb8', '#c2587e', 2.5) + Cc(50, 50, 11, 'var(--board, #fff)', '#9c6a2f');
    [[32, 38, '#ffd23f', 30], [44, 28, '#4ea8de', -20], [62, 30, '#7bc043', 60], [72, 44, '#fff', 10], [34, 54, '#b388ff', -50], [60, 60, '#ffd23f', 20]].forEach(([x, y, c, r]) => { s += '<rect x="' + (x - 4) + '" y="' + (y - 1.5) + '" width="8" height="3" rx="1.5" fill="' + c + '" transform="rotate(' + r + ' ' + x + ' ' + y + ')"/>'; });
    return s;
  });
  def('lollipop', 'lollipop', 'lollipops', 'sweets', 1, () =>
    P('M48 60H52V96H48Z', '#f4f1e8', '#b8b2a1', 2) + Cc(50, 38, 28, '#ff5d8f', '#b3264f') +
    Ln('M50 38m0 -3a3 3 0 1 1 -3 3a7 7 0 0 1 7 -7a11 11 0 0 1 11 11a15 15 0 0 1 -15 15a19 19 0 0 1 -19 -19', '#fff', 4) + shine(38, 26, 4, 7, -35));
  def('icecream', 'ice cream', 'ice creams', 'sweets', 1, () =>
    P('M30 50L50 96L70 50Z', '#e0a458', '#9c6a2f') + Ln('M36 58L62 58M40 68L58 68M44 78L55 78', '#9c6a2f', 2) +
    Cc(50, 36, 21, '#fff0f5', '#c2587e', 3) + Cc(36, 48, 10, '#fff0f5', '#c2587e', 3) + Cc(64, 48, 10, '#fff0f5', '#c2587e', 3) + P('M28 52H72V56H28Z', '#fff0f5') + Cc(50, 14, 6, '#d62839', '#7b0d1e', 2.5));

  /* ---------------- for the scales ---------------- */

  def('marble', 'marble', 'marbles', 'units', 1, () => Cc(50, 50, 40, '#5ec2d6', '#1f7a8c', 4) + P('M20 60C34 46 60 70 80 52', 'none', '#e8f7fb', 5) + shine(36, 34, 10, 14, -35));
  def('weight', 'weight', 'weights', 'units', 1, (n, o) =>
    P('M40 20C40 12 60 12 60 20V26H40Z', 'none', '#4a4f5c', 6) + P('M26 28H74L86 90H14Z', '#6b7280', '#3b3f48', 3.5) + shine(34, 50, 4, 16, 10) +
    '<text x="50" y="68" text-anchor="middle" dominant-baseline="central" font-family="Segoe UI, system-ui, sans-serif" font-weight="800" font-size="' + ((o && String(o.label).length > 2) ? 26 : 34) + '" fill="#fff">' + ((o && o.label) || '') + '</text>');

  const THEMES = {};
  Object.keys(INFO).forEach((id) => { const t = INFO[id].theme; (THEMES[t] = THEMES[t] || []).push(id); });

  // an animal (or anything) wearing a hat
  function withHat(id, n) {
    return ART[id](n) + G('translate(30 -8) rotate(14 50 76) scale(.5)', ART.hat(1));
  }

  C.picArt = {
    info: INFO,
    themes: THEMES,
    has: (id) => !!ART[id],
    svg(id, n, opts) {
      if (!ART[id]) return '';
      const nn = n == null ? INFO[id].main : n;
      if (opts && opts.hat) return withHat(id, nn);
      return ART[id](nn, opts || {});
    },
    inline(id, n, opts) {
      return '<svg class="ps-inl" viewBox="-4 -12 108 112" aria-label="' + (INFO[id] ? INFO[id].name : id) + '">' + C.picArt.svg(id, n, opts) + '</svg>';
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
