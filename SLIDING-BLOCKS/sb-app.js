/* Sliding Blocks · sb-app.js
 * The page: the board and its pieces, dragging, hints, the puzzle library.
 * The puzzles are in puzzles.js and the rules and the solver in sb-core.js.
 */
(function () {
  "use strict";

  const SB = window.SB;
  const LINES = window.SB_PUZZLES || [];
  const U = 100;                                   // SVG units to a cell
  const STAGES = ["Novice", "Beginner", "Apprentice", "Intermediate", "Skilled",
    "Advanced", "Expert", "Master", "Grandmaster", "Legend"];
  const FAM_ORDER = ["G", "K", "R", "O"];
  const FAM_COLOR = { G: "#ffd166", K: "#38d9d3", R: "#ffb057", O: "#6c7bff" };
  const CLASS_COLOR = { r: "#ff8a8a", b: "#9aa6ff", g: "#7be3a9", y: "#ffe29a" };
  const STORE_KEY = "sliding-blocks.progress.v1";

  const ABOUT = {
    all: "Every puzzle, easiest first, the four kinds dealt together. Ten stages from Novice to Legend.",
    G: "Gridlock: cars and trucks run only along their length. Clear a lane for the teal car to drive out through the gate, in the manner of Rush Hour.",
    K: "Klotski: rectangles in a tray, the big teal block to leave by the gate. The classic L'Âne Rouge is among them.",
    R: "Release: odd shapes on odd boards, in the manner of the old mechanical puzzles. Bring the teal piece to its outline.",
    O: "Order: put the pieces in order. Numbered tiles, colours that trade sides or sort into bands, and stepped towers."
  };

  const fmt = n => n.toLocaleString("en-US");
  const plural = (n, w, s) => n + " " + w + (n === 1 ? "" : (s || "s"));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // A short stable name for a puzzle, from its board and goal: progress is
  // kept under it, so it survives the library being reordered.
  function hashOf(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  /* ---------- the catalogue ---------- */

  const famCount = { G: 0, K: 0, R: 0, O: 0 };
  const PUZZLES = LINES.map((line, i) => {
    const p = line.split("|");
    return {
      i, line, fam: p[0], name: p[1], par: +p[4],
      pid: hashOf(p[0] + "|" + p[2] + "|" + p[3]),
      stage: Math.min(9, Math.floor(i * 10 / LINES.length)),
      famNo: ++famCount[p[0]]
    };
  });
  const LISTS = { all: PUZZLES.map(p => p.i) };
  for (const f of FAM_ORDER) LISTS[f] = PUZZLES.filter(p => p.fam === f).map(p => p.i);
  const listName = id => id === "all" ? "All puzzles" : SB.FAMILIES[id].name;

  /* ---------- progress ---------- */

  function loadProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE_KEY));
      return d && typeof d === "object" ? d : {};
    } catch (e) {
      return {};
    }
  }
  const progress = loadProgress();
  for (const k of ["solved", "at", "seen"]) if (!progress[k] || typeof progress[k] !== "object") progress[k] = {};
  if (!LISTS[progress.list]) progress.list = "all";
  let soundOn = progress.sound !== false;

  function saveProgress() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(progress));
    } catch (e) {
      /* private mode: play on without saving */
    }
  }
  const solvedOf = i => progress.solved[PUZZLES[i].pid];
  const countSolved = list => list.reduce((n, i) => n + (solvedOf(i) ? 1 : 0), 0);

  /* ---------- elements ---------- */

  const $ = id => document.getElementById(id);
  const el = {
    board: $("board"), grid: $("grid"), play: $("play"), marks: $("marks"), pieces: $("pieces"), zone: $("zone"),
    overlay: $("overlay"), winTitle: $("winTitle"), winStars: $("winStars"), winDetail: $("winDetail"),
    winMedal: $("winMedal"), nextUnsolved: $("nextUnsolved"),
    help: $("help"), helpFam: $("helpFam"), helpTitle: $("helpTitle"), helpBody: $("helpBody"),
    subtitle: $("subtitle"), goalFam: $("goalFam"), goalText: $("goalText"), hint: $("hint"),
    statLevel: $("statLevel"), statMoves: $("statMoves"), statPar: $("statPar"), statBest: $("statBest"), statStage: $("statStage"),
    undo: $("undo"), hintBtn: $("hintBtn"), sound: $("sound"),
    browser: $("browser"), chips: $("chips"), stages: $("stages"), about: $("about"), where: $("where"),
    jumpTo: $("jumpTo"), scroll: $("scroll"), thumbGrid: $("thumbGrid"), empty: $("empty"),
    packInfo: $("packInfo"), meter: $("meter"), wipe: $("wipe")
  };

  /* ---------- state ---------- */

  const state = {
    list: progress.list,
    index: 0,
    puz: null,
    model: null,
    pos: [],          // {x, y} of every piece
    occ: null,        // piece index in each cell, -1 free, -2 wall
    history: [],      // {i, from, to, counted}
    redo: [],
    moves: 0,
    hints: 0,
    won: false,
    busy: false,      // an animation is playing: input waits
    sel: -1,
    els: [],
    inPlace: [],
    goalAt: null,     // cell -> class, for pattern goals
    cell: 52
  };

  /* ---------- sound ---------- */

  let audio = null;
  function tone(freq, duration, type, gain, delay, slide) {
    if (!soundOn) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const t0 = audio.currentTime + (delay || 0);
      const osc = audio.createOscillator();
      const vol = audio.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, t0);
      if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + duration);
      vol.gain.setValueAtTime(0.0001, t0);
      vol.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
      vol.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(vol).connect(audio.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    } catch (e) {
      soundOn = false;
    }
  }
  const sfx = {
    tick: () => tone(260, 0.035, "triangle", 0.035),
    drop: () => tone(150, 0.07, "sine", 0.05),
    bump: () => tone(70, 0.09, "square", 0.03),
    place: () => tone(784, 0.16, "sine", 0.08),
    hint: () => { tone(660, 0.1, "sine", 0.06); tone(880, 0.12, "sine", 0.05, 0.08); },
    exit: () => tone(220, 0.45, "triangle", 0.07, 0, 880),
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.24, "sine", 0.09, i * 0.09 + 0.1))
  };

  /* ---------- the board ---------- */

  const idx = (x, y) => y * state.puz.w + x;

  function rebuildOcc() {
    const { w, h, wall, pieces } = state.puz;
    const occ = new Int16Array(w * h).fill(-1);
    for (let c = 0; c < w * h; c++) if (wall[c]) occ[c] = -2;
    pieces.forEach((p, i) => {
      const { x, y } = state.pos[i];
      for (const [sx, sy] of p.shape) occ[idx(x + sx, y + sy)] = i;
    });
    state.occ = occ;
  }

  // Can piece i stand with its corner at (x, y), other pieces as they are?
  function canPlace(i, x, y) {
    const p = state.puz.pieces[i];
    const { w, h } = state.puz;
    for (const [sx, sy] of p.shape) {
      const cx = x + sx, cy = y + sy;
      if (cx < 0 || cy < 0 || cx >= w || cy >= h) return false;
      const o = state.occ[cy * w + cx];
      if (o !== -1 && o !== i) return false;
      if (state.puz.zone && state.puz.zone[cy * w + cx] > p.level) return false;
    }
    return true;
  }

  function setPos(i, x, y) {
    const p = state.puz.pieces[i];
    const old = state.pos[i];
    for (const [sx, sy] of p.shape) state.occ[idx(old.x + sx, old.y + sy)] = -1;
    state.pos[i] = { x, y };
    for (const [sx, sy] of p.shape) state.occ[idx(x + sx, y + sy)] = i;
  }

  function place(node, x, y) {
    node.style.setProperty("--x", x);
    node.style.setProperty("--y", y);
  }

  // What each piece looks like.
  function lookOf(p, i) {
    const fam = state.puz.fam;
    if (fam === "G") return p.hero ? "piece car hero" : "piece car k" + (i % 8);
    if (p.hero) return "piece hero";
    if (p.cls && CLASS_COLOR[p.cls] && !p.label) return "piece c-" + p.cls;
    return "piece wood";
  }
  // The cell of a shape nearest its middle: where a label or the eyes go.
  function middleCell(p) {
    const mx = (p.w - 1) / 2, my = (p.h - 1) / 2;
    let best = p.shape[0], bd = Infinity;
    for (const c of p.shape) {
      const d = (c[0] - mx) ** 2 + (c[1] - my) ** 2;
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }

  function eyes(cx, cy, scale) {
    const dx = 17 * scale, r = 12 * scale, pr = 6.5 * scale;
    return `<g class="eyes"><circle class="eye" cx="${cx - dx}" cy="${cy}" r="${r}"/><circle class="eye" cx="${cx + dx}" cy="${cy}" r="${r}"/>` +
      `<circle class="pupil" cx="${cx - dx}" cy="${cy}" r="${pr}"/><circle class="pupil" cx="${cx + dx}" cy="${cy}" r="${pr}"/></g>`;
  }

  // Wheels under the body, glass and a roof on it; the front is at the right
  // (or bottom) end. Drawn along x, then turned for a vertical vehicle.
  function vehicle(p) {
    const L = Math.max(p.w, p.h), len = L * U, vert = p.h > p.w;
    let under = "", over = "";
    for (const wx of L === 2 ? [0.24, 0.76] : [0.16, 0.5, 0.84]) {
      under += `<rect class="wheel" x="${len * wx - 13}" y="2" width="26" height="12" rx="4"/><rect class="wheel" x="${len * wx - 13}" y="86" width="26" height="12" rx="4"/>`;
    }
    if (L === 2) {
      over += `<rect class="glass" x="${len * 0.19}" y="21" width="${len * 0.64}" height="58" rx="15"/>`;
      over += `<rect class="roof" x="${len * 0.31}" y="23" width="${len * 0.36}" height="54" rx="9"/>`;
    } else {
      over += `<rect class="roof" x="${len * 0.07}" y="15" width="${len * 0.6}" height="70" rx="9"/>`;
      for (let k = 1; k < 5; k++) {
        const x = len * 0.07 + k * len * 0.6 / 5;
        over += `<line class="rib" x1="${x}" y1="21" x2="${x}" y2="79"/>`;
      }
      over += `<rect class="glass" x="${len * 0.74}" y="21" width="${len * 0.13}" height="58" rx="9"/>`;
    }
    const turn = g => vert ? `<g transform="translate(${U},0) rotate(90)">${g}</g>` : g;
    return { under: turn(under), over: turn(over) };
  }

  // In a Panex tower a piece is a disk, as wide as its level is large.
  function diskPath(p) {
    const top = Math.max(...state.puz.pieces.map(q => q.level));
    const w = 34 + 62 * (p.level / top), h = 62;
    const x = (U - w) / 2, y = (U - h) / 2, r = 22;
    return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}` +
      `H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  }

  function pieceMarkup(p) {
    const car = state.puz.fam === "G";
    if (state.puz.zone) {
      const d = diskPath(p);
      return `<svg viewBox="0 0 ${U} ${U}"><path class="body hit" d="${d}"/><path class="shine" d="${d}"/>` +
        `<text class="label" x="${U / 2}" y="${U / 2 + 2}">${p.level}</text></svg>`;
    }
    const gap = car ? 7 : 5, r = car ? 24 : 15;
    const body = SB.roundedPath(p.shape, U, gap, r);
    let s = `<svg viewBox="0 0 ${p.w * U} ${p.h * U}" preserveAspectRatio="none">`;
    const v = car ? vehicle(p) : null;
    if (v) s += v.under;
    s += `<path class="body hit" d="${body}"/>`;
    if (v) s += v.over;
    else s += `<path class="bevel" d="${SB.roundedPath(p.shape, U, gap + 12, Math.max(3, r - 10))}"/>`;
    s += `<path class="shine" d="${SB.roundedPath(p.shape, U, gap + 5, Math.max(4, r - 5))}"/>`;
    if (p.label) {
      const [cx, cy] = middleCell(p);
      s += `<text class="label" x="${(cx + 0.5) * U}" y="${(cy + 0.5) * U + 2}">${esc(p.label)}</text>`;
    }
    if (p.hero) {
      if (car) s += eyes(p.w * U - 62, 50, 0.95);
      else {
        const scale = Math.min(p.w, p.h) >= 2 ? 1.5 : 1;
        if (p.w >= 2 && p.h >= 2 && p.shape.length === p.w * p.h) s += eyes(p.w * U / 2, p.h * U / 2 - 6, scale);
        else {
          const [cx, cy] = middleCell(p);
          s += eyes((cx + 0.5) * U, (cy + 0.5) * U - 2, 1);
        }
      }
    }
    return s + "</svg>";
  }

  function buildBoard() {
    const puz = state.puz;
    const W = puz.w, H = puz.h;
    const hero = puz.goal.hero >= 0 ? puz.pieces[puz.goal.hero] : null;

    // The rim is a ring of wall tiles, open where the gate is.
    const gateCells = new Map();
    if (puz.gate && hero) {
      const g = puz.gate;
      const len = g.side === "l" || g.side === "r" ? hero.h : hero.w;
      for (let k = 0; k < len; k++) {
        if (g.side === "r") gateCells.set((1 + g.at + k) * (W + 2) + W + 1, ["90deg", "0deg"]);
        if (g.side === "l") gateCells.set((1 + g.at + k) * (W + 2), ["270deg", "180deg"]);
        if (g.side === "b") gateCells.set((H + 1) * (W + 2) + 1 + g.at + k, ["180deg", "90deg"]);
        if (g.side === "t") gateCells.set(1 + g.at + k, ["0deg", "270deg"]);
      }
    }
    const grid = el.grid;
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${W + 2}, var(--cell))`;
    const frag = document.createDocumentFragment();
    for (let y = 0; y < H + 2; y++) {
      for (let x = 0; x < W + 2; x++) {
        const t = document.createElement("div");
        t.className = "tile";
        const inside = x > 0 && y > 0 && x <= W && y <= H;
        const gate = gateCells.get(y * (W + 2) + x);
        if (gate) {
          t.classList.add("gate");
          t.style.setProperty("--gate-dir", gate[0]);
          t.style.setProperty("--gate-rot", gate[1]);
          t.innerHTML = '<svg viewBox="0 0 100 100"><path d="M26 28 L46 50 L26 72"/><path d="M54 28 L74 50 L54 72"/></svg>';
        } else if (!inside || puz.wall[(y - 1) * W + x - 1]) t.classList.add("wall");
        else {
          t.classList.add("floor");
          if ((x + y) % 2) t.classList.add("alt");
        }
        frag.appendChild(t);
      }
    }
    grid.appendChild(frag);

    buildMarks();

    // Vehicles take colours in turn (pieces are numbered in reading order),
    // so neighbours differ.
    el.pieces.innerHTML = "";
    state.els = puz.pieces.map((p, i) => {
      const node = document.createElement("div");
      node.className = lookOf(p, i);
      node.dataset.i = i;
      node.style.setProperty("--w", p.w);
      node.style.setProperty("--h", p.h);
      node.innerHTML = pieceMarkup(p);
      el.pieces.appendChild(node);
      return node;
    });
    fitBoard();
    drawPieces(true);
  }

  // Where things must go: an outline for the goal piece, pads for patterns.
  function buildMarks() {
    const puz = state.puz;
    el.marks.innerHTML = "";
    state.goalAt = null;
    el.zone.innerHTML = "";
    const add = (x, y, w, h, inner, layer) => {
      const m = document.createElement("div");
      m.className = "mark";
      place(m, x, y);
      m.style.width = `calc(${w} * var(--cell))`;
      m.style.height = `calc(${h} * var(--cell))`;
      m.innerHTML = `<svg viewBox="0 0 ${w * U} ${h * U}">${inner}</svg>`;
      (layer || el.marks).appendChild(m);
    };
    if (puz.goal.type === "at") {
      // The outline glows on the floor, and a faint line of it shows over
      // any pieces standing in the way.
      const hero = puz.pieces[puz.goal.hero];
      const d = SB.roundedPath(hero.shape, U, 9, 15);
      add(puz.goal.x, puz.goal.y, hero.w, hero.h, `<path class="zone" d="${d}"/>`);
      add(puz.goal.x, puz.goal.y, hero.w, hero.h, `<path class="zone" d="${d}"/>`, el.zone);
      return;
    }
    state.goalAt = new Map(puz.goal.pattern);
    // Panex depths: each column cell says how large a disk must be to stand there.
    if (puz.zone) {
      for (let c = 0; c < puz.w * puz.h; c++) {
        if (puz.zone[c] < 2 || puz.wall[c]) continue;
        add(c % puz.w, Math.floor(c / puz.w), 1, 1, `<text class="depth" x="88" y="86">${puz.zone[c]}+</text>`);
      }
    }
    const labelled = puz.pieces.some(p => p.label);
    if (labelled) {
      // One outline per piece, where that piece must end, with its label.
      const byChar = new Map();
      for (const [c, k] of puz.goal.pattern) {
        if (!byChar.has(k)) byChar.set(k, []);
        byChar.get(k).push([c % puz.w, Math.floor(c / puz.w)]);
      }
      for (const [k, cells] of byChar) {
        const p = puz.pieces.find(q => q.ch === k);
        const minX = Math.min(...cells.map(c => c[0])), minY = Math.min(...cells.map(c => c[1]));
        const shape = cells.map(([x, y]) => [x - minX, y - minY]);
        const w = Math.max(...shape.map(c => c[0])) + 1, h = Math.max(...shape.map(c => c[1])) + 1;
        const color = CLASS_COLOR[k] || "#ffd166";
        let inner = `<path class="pad" fill="rgba(255,209,102,.06)" stroke="${color}" stroke-opacity=".55" d="${SB.roundedPath(shape, U, 10, 14)}"/>`;
        if (p && p.label) {
          const [cx, cy] = middleCell({ shape, w, h });
          inner += `<text class="pad-label" x="${(cx + 0.5) * U}" y="${(cy + 0.5) * U + 2}">${esc(p.label)}</text>`;
        }
        add(minX, minY, w, h, inner);
      }
    } else {
      for (const [c, k] of puz.goal.pattern) {
        const color = CLASS_COLOR[k] || "#ffd166";
        add(c % puz.w, Math.floor(c / puz.w), 1, 1,
          `<path class="pad" fill="${color}" fill-opacity=".13" stroke="${color}" stroke-opacity=".7" d="${SB.roundedPath([[0, 0]], U, 11, 14)}"/>`);
      }
    }
  }

  // Is piece i on its place in a pattern goal?
  function isInPlace(i) {
    if (!state.goalAt) return false;
    const p = state.puz.pieces[i];
    if (!p.cls) return false;
    const { x, y } = state.pos[i];
    return p.shape.every(([sx, sy]) => state.goalAt.get(idx(x + sx, y + sy)) === p.cls);
  }

  function drawPieces(instant) {
    if (instant) el.pieces.style.setProperty("--speed", "0ms");
    state.puz.pieces.forEach((p, i) => {
      const node = state.els[i];
      place(node, state.pos[i].x, state.pos[i].y);
      const on = isInPlace(i);
      const wasOn = state.inPlace[i];
      state.inPlace[i] = on;
      if (p.label || !p.cls || !CLASS_COLOR[p.cls]) node.classList.toggle("done", on);
      else node.classList.toggle("inplace", on);
      if (on && !wasOn && !instant) sfx.place();
      node.classList.toggle("sel", i === state.sel);
    });
    if (instant) requestAnimationFrame(() => el.pieces.style.removeProperty("--speed"));
  }

  // Cells sized so the whole board fits the window without scrolling.
  function fitBoard() {
    if (!state.puz) return;
    const app = document.querySelector(".app");
    const chrome = app.offsetHeight - el.board.offsetHeight + 40;
    const cols = state.puz.w + 2, rows = state.puz.h + 2;
    const availW = Math.min(document.body.clientWidth - 24, 640) - 22;
    const availH = Math.max(window.innerHeight - chrome, 200);
    const size = Math.floor(Math.min(availW / cols, availH / rows));
    state.cell = Math.max(24, Math.min(66, size));
    el.board.style.setProperty("--cell", state.cell + "px");
  }

  // The goal piece looks where it is heading.
  function lookToward(dx, dy) {
    const hero = state.puz.goal.hero;
    if (hero < 0) return;
    const node = state.els[hero];
    node.classList.remove("look-u", "look-d", "look-l", "look-r");
    if (!dx && !dy) {
      const g = state.puz.gate;
      if (g) return node.classList.add("look-" + { r: "r", l: "l", t: "u", b: "d" }[g.side]);
      const p = state.pos[hero];
      dx = state.puz.goal.x - p.x;
      dy = state.puz.goal.y - p.y;
      if (!dx && !dy) return;
    }
    node.classList.add(Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? "look-r" : "look-l") : (dy > 0 ? "look-d" : "look-u"));
  }

  /* ---------- the HUD ---------- */

  const GOALS = {
    G: "Clear a lane and drive the teal car out through the gold gate",
    K: "Slide the big teal block out through the gold gate",
    R: "Bring the teal piece onto its glowing outline",
    Rgate: "Bring the teal piece to its outline and out through the gate",
    On: "Put every numbered piece on its number",
    Oc: "Move every coloured piece onto a pad of its colour",
    Tower: "Move the tower to the right-hand column",
    Towers: "Trade the two towers"
  };

  function goalText() {
    const puz = state.puz;
    if (puz.zone) return (puz.pieces.some(p => p.label) ? GOALS.Tower : GOALS.Towers) + " · a disk goes only as deep as its number";
    if (puz.fam === "O") return puz.pieces.some(p => p.label) ? GOALS.On : GOALS.Oc;
    if (puz.fam === "R" && puz.gate) return GOALS.Rgate;
    return GOALS[puz.fam];
  }

  // A message that stands in the hint line until the next move.
  let notice = null;
  function say(text, kind) {
    notice = { text, kind };
    updateHud();
  }

  function starsFor(moves, par, hints) {
    if (hints) return 1;
    if (moves <= par) return 3;
    return moves <= par + Math.max(2, Math.ceil(par * 0.25)) ? 2 : 1;
  }
  const starText = n => `<span class="on">${"★".repeat(n)}</span><span class="off">${"★".repeat(3 - n)}</span>`;

  function updateHud() {
    const pz = PUZZLES[state.index];
    const best = solvedOf(state.index);
    el.statLevel.textContent = "#" + fmt(pz.i + 1);
    el.statMoves.textContent = state.moves;
    el.statMoves.classList.toggle("over", state.moves > pz.par);
    el.statPar.textContent = pz.par;
    el.statBest.innerHTML = best ? best.m + " " + starText(best.s) : "—";
    el.statStage.textContent = (pz.stage + 1) + " / 10";
    el.undo.disabled = state.won || !state.history.length;
    el.hintBtn.disabled = state.won;

    if (state.won) {
      el.hint.className = "good";
      el.hint.textContent = "Solved!";
    } else if (notice) {
      el.hint.className = notice.kind || "";
      el.hint.textContent = notice.text;
    } else {
      el.hint.className = "";
      el.hint.innerHTML = '<span class="keys">Drag a piece · or Tab to pick one and the arrow keys to slide it · H for a hint</span>';
    }
  }

  /* ---------- moves ---------- */

  const anchorsNow = () => state.pos.map(p => idx(p.x, p.y));

  // A move is one piece moved; moving the same piece again straight after
  // is still that one move, the usual count for sliding puzzles.
  function commit(i, from, to) {
    if (from.x === to.x && from.y === to.y) return;
    const last = state.history[state.history.length - 1];
    const counted = !(last && last.i === i);
    state.history.push({ i, from, to, counted });
    state.redo = [];
    if (counted) state.moves++;
    notice = null;
    afterMove();
  }

  function afterMove() {
    drawPieces(false);
    lookToward(0, 0);
    updateHud();
    const st = state.model.fromPieces(anchorsNow());
    if (state.model.goalTest(st)) win();
  }

  function undo() {
    if (state.won || state.busy || !state.history.length) return;
    stopAuto();
    const m = state.history.pop();
    setPos(m.i, m.from.x, m.from.y);
    if (m.counted) state.moves--;
    state.redo.push(m);
    notice = null;
    sfx.drop();
    drawPieces(false);
    lookToward(0, 0);
    updateHud();
  }

  function redo() {
    if (state.won || state.busy || !state.redo.length) return;
    const m = state.redo.pop();
    if (!canReach(m.i, m.to)) { state.redo = []; return; }
    const keep = state.redo;
    setPos(m.i, m.to.x, m.to.y);
    commit(m.i, m.from, m.to);
    state.redo = keep;
    sfx.drop();
  }

  // Cells piece i can reach in one move, as a path of corners to `to`.
  function pathTo(i, to) {
    const p = state.puz.pieces[i];
    const start = state.pos[i];
    const W = state.puz.w;
    const key = (x, y) => y * W + x;
    const prev = new Map([[key(start.x, start.y), null]]);
    const queue = [start];
    const dirs = p.axis === 1 ? [[1, 0], [-1, 0]] : p.axis === 2 ? [[0, 1], [0, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (queue.length) {
      const c = queue.shift();
      if (c.x === to.x && c.y === to.y) {
        const path = [];
        for (let q = c; q; q = prev.get(key(q.x, q.y))) path.push(q);
        return path.reverse();
      }
      for (const [dx, dy] of dirs) {
        const n = { x: c.x + dx, y: c.y + dy };
        const k = key(n.x, n.y);
        if (prev.has(k) || !canPlace(i, n.x, n.y)) continue;
        prev.set(k, c);
        queue.push(n);
      }
    }
    return null;
  }
  const canReach = (i, to) => !!pathTo(i, to);

  // Slides piece i along a path cell by cell, then counts the move.
  function glide(i, path, perCell) {
    return new Promise(resolve => {
      state.busy = true;
      const from = { ...state.pos[i] };
      let k = 1;
      const stepOnce = () => {
        if (k >= path.length || !state.busy) {
          state.busy = false;
          commit(i, from, { ...state.pos[i] });
          resolve();
          return;
        }
        const c = path[k++];
        const prev = state.pos[i];
        lookFor(i, c.x - prev.x, c.y - prev.y);
        setPos(i, c.x, c.y);
        place(state.els[i], c.x, c.y);
        sfx.tick();
        setTimeout(stepOnce, perCell);
      };
      stepOnce();
    });
  }
  const lookFor = (i, dx, dy) => { if (i === state.puz.goal.hero) lookToward(dx, dy); };

  /* ---------- dragging ---------- */

  let drag = null;
  let lastBump = 0;

  function select(i) {
    state.sel = i;
    state.els.forEach((n, j) => n.classList.toggle("sel", j === i));
  }

  el.board.addEventListener("pointerdown", e => {
    if (e.button > 0 || !state.puz) return;
    if (el.help.classList.contains("show") || el.overlay.classList.contains("show")) return;
    stopAuto();
    if (state.won || state.busy) return;
    const node = e.target.closest(".piece");
    if (!node) { select(-1); return; }
    e.preventDefault();
    const i = +node.dataset.i;
    select(i);
    const p = state.pos[i];
    drag = { i, id: e.pointerId, sx: e.clientX, sy: e.clientY, x0: p.x, y0: p.y, blockedX: 0, blockedY: 0 };
    try { el.board.setPointerCapture(e.pointerId); } catch (err) { /* old browsers */ }
    node.classList.add("drag");
  });

  el.board.addEventListener("pointermove", e => {
    if (!drag || e.pointerId !== drag.id) return;
    const i = drag.i;
    const p = state.puz.pieces[i];
    const C = state.cell;
    const tx = drag.x0 + (p.axis === 2 ? 0 : (e.clientX - drag.sx) / C);
    const ty = drag.y0 + (p.axis === 1 ? 0 : (e.clientY - drag.sy) / C);

    // Step cell by cell toward the pointer, turning corners where the way
    // straight on is shut.
    for (let guard = 0; guard < 64; guard++) {
      const cur = state.pos[i];
      const dx = tx - cur.x, dy = ty - cur.y;
      const sx = Math.sign(dx), sy = Math.sign(dy);
      const okX = Math.abs(dx) >= 0.5 && canPlace(i, cur.x + sx, cur.y);
      const okY = Math.abs(dy) >= 0.5 && canPlace(i, cur.x, cur.y + sy);
      let mx = 0, my = 0;
      if (Math.abs(dx) >= Math.abs(dy)) { if (okX) mx = sx; else if (okY) my = sy; } else if (okY) my = sy; else if (okX) mx = sx;
      if (!mx && !my) break;
      setPos(i, cur.x + mx, cur.y + my);
      lookFor(i, mx, my);
      sfx.tick();
    }

    // Between cells the piece follows the pointer, as far as there is room.
    const cur = state.pos[i];
    const dx = tx - cur.x, dy = ty - cur.y;
    const along = (d, ux, uy) => {
      if (Math.abs(d) < 0.02) return 0;
      if (canPlace(i, cur.x + Math.sign(d) * ux, cur.y + Math.sign(d) * uy)) return Math.max(-0.49, Math.min(0.49, d));
      // Pushing against something: a little give, and a knock once.
      if (Math.abs(d) > 0.3 && Date.now() - lastBump > 350) {
        lastBump = Date.now();
        sfx.bump();
      }
      return Math.max(-0.05, Math.min(0.05, d));
    };
    let ox = 0, oy = 0;
    if (Math.abs(dx) >= Math.abs(dy)) { ox = along(dx, 1, 0); if (!ox) oy = along(dy, 0, 1); } else { oy = along(dy, 0, 1); if (!oy) ox = along(dx, 1, 0); }
    place(state.els[i], cur.x + ox, cur.y + oy);
  });

  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const { i, x0, y0 } = drag;
    drag = null;
    const node = state.els[i];
    node.classList.remove("drag");
    const p = state.pos[i];
    place(node, p.x, p.y);
    if (p.x !== x0 || p.y !== y0) {
      sfx.drop();
      commit(i, { x: x0, y: y0 }, { ...p });
    }
  }
  el.board.addEventListener("pointerup", endDrag);
  el.board.addEventListener("pointercancel", endDrag);
  el.board.addEventListener("lostpointercapture", endDrag);

  // Keyboard: the selected piece slides a cell per arrow press.
  function nudge(dx, dy) {
    if (state.won || state.busy) return;
    stopAuto();
    if (state.sel < 0) select(state.puz.goal.hero >= 0 ? state.puz.goal.hero : 0);
    const i = state.sel;
    const p = state.puz.pieces[i];
    if ((p.axis === 1 && dy) || (p.axis === 2 && dx)) return knock(i);
    const from = { ...state.pos[i] };
    if (!canPlace(i, from.x + dx, from.y + dy)) return knock(i);
    setPos(i, from.x + dx, from.y + dy);
    lookFor(i, dx, dy);
    sfx.tick();
    commit(i, from, { ...state.pos[i] });
  }

  function knock(i) {
    sfx.bump();
    const n = state.els[i];
    n.classList.remove("nudge");
    void n.offsetWidth;
    n.classList.add("nudge");
  }

  function cycle(by) {
    const n = state.puz.pieces.length;
    // In reading order of where the pieces stand now.
    const order = state.puz.pieces.map((p, i) => i)
      .sort((a, b) => state.pos[a].y - state.pos[b].y || state.pos[a].x - state.pos[b].x);
    const at = order.indexOf(state.sel);
    select(order[((at < 0 ? (by > 0 ? -1 : 0) : at) + by + n) % n]);
  }

  /* ---------- hints ---------- */

  // The last solution found, followed while the player keeps to it.
  let plan = null;
  let searchToken = 0;

  function hint() {
    if (state.won || state.busy) return Promise.resolve(false);
    const model = state.model;
    const st = model.fromPieces(anchorsNow());
    const key = model.key(st);
    if (plan && plan.keys[plan.at] === key) return playStep();

    const mine = ++searchToken;
    const search = SB.Search(model, st, 3e6);
    const slow = setTimeout(() => say("Thinking…"), 180);
    return new Promise(resolve => {
      const run = () => {
        if (mine !== searchToken) { clearTimeout(slow); resolve(false); return; }
        const res = search.step(14);
        if (!res) { setTimeout(run, 0); return; }
        clearTimeout(slow);
        // The player moved while this was thinking: that answer is stale.
        if (state.won || model.key(model.fromPieces(anchorsNow())) !== key) { notice = null; updateHud(); resolve(false); return; }
        if (res.dist < 0) { say("No way to the goal from here. Undo or restart", "warn"); resolve(false); return; }
        plan = { path: res.path, keys: [key].concat(res.path.map(s => s[3])), at: 0 };
        resolve(playStep());
      };
      run();
    });
  }

  function playStep() {
    const model = state.model;
    const [slot, a, b] = plan.path[plan.at];
    // The piece of that group now standing at `a`.
    let piece = -1;
    for (let s = model.groupStart[slot]; s < model.groupEnd[slot]; s++) {
      const i = model.order[s];
      if (idx(state.pos[i].x, state.pos[i].y) === a) piece = i;
    }
    if (piece < 0) { plan = null; return Promise.resolve(false); }
    const W = state.puz.w;
    const path = pathTo(piece, { x: b % W, y: Math.floor(b / W) });
    if (!path) { plan = null; return Promise.resolve(false); }
    plan.at++;
    state.hints++;
    const left = plan.path.length - plan.at;
    sfx.hint();
    select(-1);
    const node = state.els[piece];
    node.classList.add("hinted");
    return glide(piece, path, 70).then(() => {
      node.classList.remove("hinted");
      if (!state.won) {
        say(left ? `Hint: ${plural(left, "more move")} to the goal from here · H again for the next · Shift+H plays them all` : "", "good");
      }
      return true;
    });
  }

  let auto = false;
  function autoSolve() {
    if (auto || state.won) return;
    auto = true;
    const next = () => {
      if (!auto || state.won) { auto = false; return; }
      hint().then(ok => {
        if (!ok) { auto = false; return; }
        setTimeout(next, 260);
      });
    };
    next();
  }
  function stopAuto() {
    auto = false;
  }

  /* ---------- winning ---------- */

  function win() {
    state.won = true;
    stopAuto();
    select(-1);
    const pz = PUZZLES[state.index];
    const stars = starsFor(state.moves, pz.par, state.hints);
    // A solve with hints counts as solved, but never stands in the way of a
    // later one without: that replaces it whatever its count.
    const prev = progress.solved[pz.pid];
    const clean = !state.hints;
    let better = false;
    if (!prev) better = true;
    else if (clean && (prev.h || state.moves < prev.m)) better = true;
    else if (!clean && prev.h && state.moves < prev.m) better = true;
    if (better) {
      progress.solved[pz.pid] = clean ? { m: state.moves, s: Math.max(stars, prev && !prev.h ? prev.s : 0) } : { m: state.moves, s: 1, h: 1 };
    }
    saveProgress();

    const puz = state.puz;
    const heroI = puz.goal.hero;
    let delay = 450;
    if (puz.gate && heroI >= 0) {
      // Out through the gate.
      const node = state.els[heroI];
      const p = state.pos[heroI];
      const hero = puz.pieces[heroI];
      const d = { r: [1, 0], l: [-1, 0], b: [0, 1], t: [0, -1] }[puz.gate.side];
      const dist = (d[0] ? hero.w : hero.h) + 1.3;
      node.classList.add("slow");
      requestAnimationFrame(() => {
        place(node, p.x + d[0] * dist, p.y + d[1] * dist);
        node.style.opacity = "0";
      });
      sfx.exit();
      delay = 620;
    } else if (heroI >= 0) {
      state.els[heroI].classList.add("cheer");
    }
    setTimeout(() => {
      sfx.win();
      showWin(stars, better && prev, prev);
    }, delay);
    updateHud();
  }

  function showWin(stars, improved, prev) {
    const pz = PUZZLES[state.index];
    el.winTitle.textContent = stars === 3 ? "Perfect!" : "Solved!";
    [...el.winStars.children].forEach((s, k) => s.classList.toggle("on", k < stars));
    el.winDetail.textContent = `${plural(state.moves, "move")} · par ${pz.par}`;
    // A stage whose last open puzzle this was gets a word of its own.
    const stage = listOf().filter(i => PUZZLES[i].stage === pz.stage);
    const stageDone = !prev && stage.every(i => solvedOf(i));
    el.winMedal.textContent =
      stageDone ? `Stage ${pz.stage + 1} · ${STAGES[pz.stage]} complete!` :
      state.hints ? `Solved with ${plural(state.hints, "hint")}` :
      state.moves <= pz.par ? "The fewest moves possible" :
      improved && prev ? "New personal best" :
      `${plural(state.moves - pz.par, "move")} over par`;
    const left = nextUnsolved(state.index);
    el.nextUnsolved.innerHTML = left === null ? "Every puzzle solved!" : "Next Puzzle";
    el.nextUnsolved.disabled = left === null;
    el.overlay.classList.add("show");
    el.nextUnsolved.focus({ preventScroll: true });
    if (el.browser.classList.contains("show")) markThumbs();
  }

  /* ---------- starting a puzzle ---------- */

  function start(index) {
    searchToken++;
    stopAuto();
    plan = null;
    state.index = index;
    const pz = PUZZLES[index];
    state.puz = SB.parse(pz.line);
    state.model = SB.Model(state.puz);
    state.pos = state.puz.pieces.map(p => ({ x: p.x, y: p.y }));
    state.history = [];
    state.redo = [];
    state.moves = 0;
    state.hints = 0;
    state.won = false;
    state.busy = false;
    state.sel = -1;
    state.inPlace = [];
    notice = null;
    rebuildOcc();

    el.overlay.classList.remove("show");
    buildBoard();
    lookToward(0, 0);

    const fam = SB.FAMILIES[pz.fam];
    el.subtitle.innerHTML = `<b>${esc(fam.name)} ${fmt(pz.famNo)}</b> · Stage ${pz.stage + 1} · ${STAGES[pz.stage]}` + (pz.name ? " · " + esc(pz.name) : "");
    el.goalFam.textContent = fam.name;
    el.goalFam.className = "fam fam-" + pz.fam;
    el.goalText.textContent = goalText();
    document.title = "Sliding Blocks · #" + (index + 1);
    updateHud();
    fitBoard();

    progress.at[state.list] = index;
    progress.list = state.list;
    saveProgress();
    try {
      history.replaceState(null, "", "#" + (index + 1));
    } catch (e) {
      /* file:// pages may refuse */
    }

    if (!progress.seen[pz.fam]) showHelp(pz.fam, true);
    else hideHelp();
  }

  const restart = () => start(state.index);

  function listOf() {
    return LISTS[state.list];
  }

  // The next puzzle of the current list after `from` that is not solved yet.
  function nextUnsolved(from) {
    const list = listOf();
    const at = list.indexOf(from);
    for (let k = 1; k <= list.length; k++) {
      const i = list[(at + k) % list.length];
      if (!solvedOf(i) && i !== from) return i;
    }
    return null;
  }

  function step(by) {
    const list = listOf();
    let at = list.indexOf(state.index);
    if (at < 0) { state.list = "all"; at = state.index; return start((state.index + by + LINES.length) % LINES.length); }
    start(list[(at + by + list.length) % list.length]);
  }

  function goNextUnsolved() {
    const i = nextUnsolved(state.index);
    if (i !== null) start(i);
  }

  /* ---------- help ---------- */

  const HELP = {
    G: ["Gridlock", "<p>Cars and trucks slide only <b>forward and back</b>, along their length.</p><p>Clear a lane so the <b>teal car</b> can drive out through the <b>gold gate</b>.</p>"],
    K: ["Klotski", "<p>Every block slides any way there is room, even round a corner in one move.</p><p>Get the big <b>teal block</b> out through the <b>gold gate</b>.</p>"],
    R: ["Release", "<p>Odd shapes on odd boards. Every piece slides any way there is room.</p><p>Bring the <b>teal piece</b> onto its <b>glowing outline</b>.</p>"],
    O: ["Order", "<p>Put the pieces in order: every numbered piece on its number, every coloured piece on a pad of its colour.</p><p>In the <b>towers</b> a disk may go only as deep as its number (the small figures on the floor), so the small disks always stay above the large, as in the Towers of Hanoi.</p><p>A piece in its place turns <b>green</b> or glows.</p>"]
  };
  const HELP_TAIL = "<p>Drag a piece with the mouse or a finger. A move is one piece moved, however far. <b>Par</b> is the fewest moves it can be done in.</p>";

  function showHelp(fam, first) {
    const [title, body] = HELP[fam];
    el.helpFam.textContent = first ? "New puzzle type" : "How to play";
    el.helpFam.className = "fam fam-" + fam;
    el.helpTitle.textContent = title;
    el.helpBody.innerHTML = body + HELP_TAIL + (first ? "" :
      '<p class="keys"><b>Keys:</b> Tab picks a piece, arrows slide it · U undo · Y redo · R restart · H hint · Shift+H solve · N / P next / previous · L library</p>');
    el.help.classList.add("show");
    document.getElementById("helpOk").focus({ preventScroll: true });
  }

  function hideHelp() {
    el.help.classList.remove("show");
    const fam = state.puz && state.puz.fam;
    if (fam && !progress.seen[fam]) {
      progress.seen[fam] = true;
      saveProgress();
    }
  }

  /* ---------- the library ---------- */

  const view = { list: "all", stage: 0 };
  let thumbIO = null;

  function openLibrary() {
    view.list = state.list;
    view.stage = PUZZLES[state.index].stage;
    el.browser.classList.add("show");
    renderLibrary();
  }

  function closeLibrary() {
    el.browser.classList.remove("show");
    disarmWipe();
  }

  function renderLibrary() {
    const list = LISTS[view.list];
    el.chips.innerHTML = "";
    for (const id of ["all"].concat(FAM_ORDER)) {
      const chip = document.createElement("button");
      chip.className = "chip" + (id === view.list ? " active" : "");
      chip.innerHTML = (id === "all" ? "" : `<span class="dot" style="background:${FAM_COLOR[id]}"></span>`) +
        esc(listName(id)) + `<small>${fmt(countSolved(LISTS[id]))} / ${fmt(LISTS[id].length)}</small>`;
      chip.addEventListener("click", () => {
        view.list = id;
        renderLibrary();
      });
      el.chips.appendChild(chip);
    }

    el.stages.innerHTML = "";
    for (let s = 0; s < 10; s++) {
      const inStage = list.filter(i => PUZZLES[i].stage === s);
      const done = countSolved(inStage);
      const b = document.createElement("button");
      b.className = "stagebtn" + (s === view.stage ? " active" : "") + (inStage.length && done === inStage.length ? " full" : "");
      b.title = `Stage ${s + 1} · ${STAGES[s]} · ${done} of ${inStage.length} solved`;
      b.innerHTML = `${s + 1}<i style="--p:${inStage.length ? Math.round(100 * done / inStage.length) : 0}%"></i>`;
      b.addEventListener("click", () => {
        view.stage = s;
        renderLibrary();
      });
      el.stages.appendChild(b);
    }

    el.about.textContent = ABOUT[view.list];
    const total = countSolved(LISTS.all);
    el.packInfo.textContent = fmt(total) + " / " + fmt(LINES.length) + " solved";
    el.meter.style.width = (100 * total / Math.max(1, LINES.length)).toFixed(1) + "%";
    el.jumpTo.max = LINES.length;
    el.jumpTo.placeholder = "# 1 – " + fmt(LINES.length);
    el.jumpTo.value = "";
    disarmWipe();
    renderThumbs();
  }

  function renderThumbs() {
    const items = LISTS[view.list].filter(i => PUZZLES[i].stage === view.stage);
    const first = items.length ? items[0] + 1 : 0, last = items.length ? items[items.length - 1] + 1 : 0;
    el.where.textContent = `Stage ${view.stage + 1} · ${STAGES[view.stage]} · ${plural(items.length, "puzzle")}` + (items.length ? ` (#${fmt(first)} – #${fmt(last)})` : "");

    if (thumbIO) thumbIO.disconnect();
    el.thumbGrid.innerHTML = "";
    el.empty.hidden = items.length > 0;
    el.empty.textContent = "No puzzles of this kind in this stage.";
    thumbIO = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        thumbIO.unobserve(en.target);
        drawThumb(en.target.querySelector("canvas"), PUZZLES[+en.target.dataset.i].line);
      }
    }, { root: el.scroll, rootMargin: "200px" });

    const frag = document.createDocumentFragment();
    for (const i of items) {
      const b = document.createElement("button");
      b.className = "thumb";
      b.dataset.i = i;
      const pz = PUZZLES[i];
      b.title = SB.FAMILIES[pz.fam].name + " " + pz.famNo + (pz.name ? " · " + pz.name : "") + " · par " + pz.par;
      b.innerHTML = `<div class="pic"><canvas></canvas></div><small></small>` +
        (view.list === "all" ? `<span class="tag" style="background:${FAM_COLOR[pz.fam]}"></span>` : "");
      thumbIO.observe(b);
      frag.appendChild(b);
    }
    el.thumbGrid.appendChild(frag);
    el.scroll.scrollTop = 0;
    markThumbs();
    const here = el.thumbGrid.querySelector(".current");
    if (here) here.scrollIntoView({ block: "center" });
  }

  function markThumbs() {
    for (const b of el.thumbGrid.children) {
      const i = +b.dataset.i;
      const best = solvedOf(i);
      b.classList.toggle("done", !!best);
      b.classList.toggle("current", i === state.index);
      b.querySelector("small").innerHTML = `<span>#${fmt(i + 1)}</span>` +
        (best ? `<em>${starText(best.s)}</em>` : `<span>par ${PUZZLES[i].par}</span>`);
    }
  }

  const THUMB_FILL = {
    wood: "#c98545", hero: "#38d9d3", r: "#e8646f", b: "#7280f7", g: "#4ecb8d", y: "#f0bf55",
    cars: ["#7280f7", "#f0bf55", "#4ecb8d", "#f5a24e", "#ec76b3", "#a57cf0", "#e8646f", "#c98545"]
  };

  // A miniature of a puzzle: rim, walls, gate, pieces in their colours.
  function drawThumb(canvas, line) {
    const puz = SB.parse(line);
    const s = 12, W = puz.w + 2, H = puz.h + 2;
    const scale = window.devicePixelRatio > 1 ? 2 : 1;
    canvas.width = W * s * scale;
    canvas.height = H * s * scale;
    canvas.style.width = W * s + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = "#3d4477";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(0, 0, W * s, H * s, 4) : ctx.rect(0, 0, W * s, H * s);
    ctx.fill();
    ctx.fillStyle = "#1e2342";
    ctx.fillRect(s, s, puz.w * s, puz.h * s);
    ctx.fillStyle = "#3d4477";
    for (let c = 0; c < puz.w * puz.h; c++) {
      if (puz.wall[c]) ctx.fillRect(s + (c % puz.w) * s, s + Math.floor(c / puz.w) * s, s, s);
    }
    const hero = puz.goal.hero >= 0 ? puz.pieces[puz.goal.hero] : null;
    if (puz.gate && hero) {
      const g = puz.gate, len = (g.side === "l" || g.side === "r" ? hero.h : hero.w) * s;
      ctx.fillStyle = "#ffd166";
      if (g.side === "r") ctx.fillRect(W * s - s + 2, s + g.at * s, s - 4, len);
      if (g.side === "l") ctx.fillRect(2, s + g.at * s, s - 4, len);
      if (g.side === "b") ctx.fillRect(s + g.at * s, H * s - s + 2, len, s - 4);
      if (g.side === "t") ctx.fillRect(s + g.at * s, 2, len, s - 4);
    }
    if (hero && puz.goal.type === "at") {
      ctx.strokeStyle = "rgba(255, 209, 102, .8)";
      ctx.lineWidth = 1;
      ctx.save();
      ctx.translate(s + puz.goal.x * s, s + puz.goal.y * s);
      ctx.stroke(new Path2D(SB.roundedPath(hero.shape, s, 1.5, 2)));
      ctx.restore();
    }
    puz.pieces.forEach((p, i) => {
      let fill = THUMB_FILL.wood;
      if (p.hero) fill = THUMB_FILL.hero;
      else if (puz.fam === "G") fill = THUMB_FILL.cars[i % 8];
      else if (p.cls && THUMB_FILL[p.cls] && !p.label) fill = THUMB_FILL[p.cls];
      ctx.save();
      ctx.translate(s + p.x * s, s + p.y * s);
      ctx.fillStyle = fill;
      ctx.fill(new Path2D(SB.roundedPath(p.shape, s, 0.8, 2.5)));
      ctx.restore();
    });
  }

  function play(i, list) {
    closeLibrary();
    if (list) state.list = list;
    if (!listOf().includes(i)) state.list = "all";
    start(i);
  }

  function jump() {
    const n = Math.round(Number(el.jumpTo.value));
    if (!(n >= 1 && n <= LINES.length)) {
      el.jumpTo.value = "";
      el.jumpTo.focus();
      return;
    }
    play(n - 1, view.list);
  }

  function playRandom() {
    const items = LISTS[view.list].filter(i => PUZZLES[i].stage === view.stage);
    const open = items.filter(i => !solvedOf(i));
    const from = open.length ? open : items;
    if (from.length) play(from[Math.floor(Math.random() * from.length)], view.list);
  }

  function playFirstUnsolved() {
    const list = LISTS[view.list];
    const i = list.find(j => !solvedOf(j));
    play(i === undefined ? list[0] : i, view.list);
  }

  // Forgetting progress takes two presses, and only touches the list on show.
  let wipeArmed = 0;
  function disarmWipe() {
    clearTimeout(wipeArmed);
    wipeArmed = 0;
    el.wipe.textContent = "Reset Progress";
  }
  function wipe() {
    if (!wipeArmed) {
      el.wipe.textContent = "Forget " + listName(view.list) + "?";
      wipeArmed = setTimeout(disarmWipe, 4000);
      return;
    }
    for (const i of LISTS[view.list]) delete progress.solved[PUZZLES[i].pid];
    if (view.list === "all") progress.seen = {};
    saveProgress();
    renderLibrary();
    updateHud();
  }

  /* ---------- input ---------- */

  const ARROWS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };

  document.addEventListener("keydown", e => {
    if (e.ctrlKey || e.altKey || e.metaKey) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      return;
    }
    if (el.browser.classList.contains("show")) {
      if (e.key === "Escape") closeLibrary();
      else if (e.key === "Enter" && e.target === el.jumpTo) jump();
      return;
    }
    if (el.help.classList.contains("show")) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); hideHelp(); }
      return;
    }
    if (e.key === "Enter" && state.won) {
      e.preventDefault();
      goNextUnsolved();
      return;
    }
    const arrow = ARROWS[e.key] || ARROWS[e.key.toLowerCase()];
    if (arrow && !state.won) {
      e.preventDefault();
      nudge(arrow[0], arrow[1]);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (!state.won) cycle(e.shiftKey ? -1 : 1);
      return;
    }
    switch (e.key.toLowerCase()) {
      case "u":
      case "z":
      case "backspace":
        e.preventDefault();
        undo();
        break;
      case "y":
        redo();
        break;
      case "r":
        restart();
        break;
      case "h":
        if (e.shiftKey) autoSolve();
        else { stopAuto(); hint(); }
        break;
      case "n":
        step(1);
        break;
      case "p":
        step(-1);
        break;
      case "l":
        openLibrary();
        break;
      case "?":
      case "/":
        showHelp(state.puz.fam, false);
        break;
      case "escape":
        stopAuto();
        select(-1);
        break;
    }
  });

  el.undo.addEventListener("click", undo);
  $("restart").addEventListener("click", restart);
  el.hintBtn.addEventListener("click", () => { stopAuto(); hint(); });
  $("prev").addEventListener("click", () => step(-1));
  $("next").addEventListener("click", () => step(1));
  $("levels").addEventListener("click", openLibrary);
  // The puzzle number and the stage open the library too.
  for (const id of ["statLevel", "statStage"]) {
    const box = $(id).parentNode;
    box.style.cursor = "pointer";
    box.title = "Browse every puzzle (L)";
    box.addEventListener("click", openLibrary);
  }
  $("helpBtn").addEventListener("click", () => showHelp(state.puz.fam, false));
  $("helpOk").addEventListener("click", hideHelp);
  $("replay").addEventListener("click", restart);
  el.nextUnsolved.addEventListener("click", goNextUnsolved);

  $("closeBrowser").addEventListener("click", closeLibrary);
  el.browser.addEventListener("click", e => {
    if (e.target === el.browser) closeLibrary();
  });
  el.thumbGrid.addEventListener("click", e => {
    const t = e.target.closest(".thumb");
    if (t) play(+t.dataset.i, view.list);
  });
  $("jumpGo").addEventListener("click", jump);
  $("random").addEventListener("click", playRandom);
  $("firstUnsolved").addEventListener("click", playFirstUnsolved);
  el.wipe.addEventListener("click", wipe);

  el.sound.addEventListener("click", () => {
    soundOn = !soundOn;
    progress.sound = soundOn;
    saveProgress();
    el.sound.textContent = soundOn ? "🔊" : "🔇";
    if (soundOn) sfx.place();
  });
  el.sound.textContent = soundOn ? "🔊" : "🔇";

  window.addEventListener("resize", fitBoard);

  /* ---------- go ---------- */

  // "#37" in the address names puzzle 37.
  function named() {
    const m = /^#(\d+)$/.exec(location.hash);
    return m && +m[1] >= 1 && +m[1] <= LINES.length ? +m[1] - 1 : null;
  }

  window.addEventListener("hashchange", () => {
    const i = named();
    if (i !== null && i !== state.index) {
      if (!listOf().includes(i)) state.list = "all";
      start(i);
    }
  });

  if (!LINES.length) {
    el.hint.textContent = "No puzzles found: puzzles.js is missing.";
    return;
  }

  // Open on the puzzle in the address, else where the player left off, else
  // the first one not solved.
  (function () {
    const i = named();
    if (i !== null) {
      if (!listOf().includes(i)) state.list = "all";
      return start(i);
    }
    // Left on a puzzle already solved: on to the next one that is not.
    const at = progress.at[state.list];
    if (at != null && PUZZLES[at] && listOf().includes(at)) {
      const next = solvedOf(at) ? nextUnsolved(at) : at;
      return start(next === null ? at : next);
    }
    const open = listOf().find(j => !solvedOf(j));
    start(open === undefined ? listOf()[0] : open);
  })();

  // Offline: a service worker keeps the page once it has been visited.
  if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !/[?&]nosw\b/.test(location.search)) {
    navigator.serviceWorker.register("sw.js").catch(() => { /* offline support is optional */ });
  }
})();
