/* HYPER-MEDICINE · sims/foundations.js — simulations for How the Body Works:
 * a clickable cell, a red cell in solutions (osmosis), the membrane potential (Nernst and Goldman),
 * a feedback loop with delay, the fluid compartments and infusions, acid–base on the pH–bicarbonate
 * diagram, the body's heat balance and fever, and DNA to protein with point mutations. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));

  function rrect(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }

  /* a small strip chart drawn on a stage: b = {x, y, w, h}; o = {xmin, xmax, ymin, ymax, series, hlines, xlabel, ylabel, ystep, fy} */
  function chart(c, kit, C, b, o) {
    const X = v => b.x + (v - o.xmin) / (o.xmax - o.xmin) * b.w;
    const Y = v => b.y + b.h - (clamp(v, o.ymin, o.ymax) - o.ymin) / (o.ymax - o.ymin) * b.h;
    c.save();
    c.fillStyle = C.surface; c.fillRect(b.x, b.y, b.w, b.h);
    c.strokeStyle = C.grid; c.lineWidth = 1;
    const ys = o.ystep || Hyper.niceStep(o.ymax - o.ymin, 4);
    c.font = '10px system-ui, sans-serif'; c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(o.ymin / ys) * ys; v <= o.ymax + 1e-9; v += ys) {
      c.beginPath(); c.moveTo(b.x, Y(v)); c.lineTo(b.x + b.w, Y(v)); c.stroke();
      c.fillText(o.fy ? o.fy(v) : String(+v.toFixed(2)), b.x - 4, Y(v));
    }
    for (const hl of o.hlines || []) {
      c.setLineDash(hl.dash || [4, 4]); c.strokeStyle = hl.color || C.faint; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(b.x, Y(hl.y)); c.lineTo(b.x + b.w, Y(hl.y)); c.stroke(); c.setLineDash([]);
      if (hl.label) kit.label(c, hl.label, b.x + b.w - 4, Y(hl.y) - 7, { size: 10, color: hl.color || C.muted, align: 'right' });
    }
    for (const s of o.series || []) {
      if (!s.pts || s.pts.length < 2) continue;
      c.strokeStyle = s.color || C.accent; c.lineWidth = s.width || 2; c.setLineDash(s.dash || []);
      c.beginPath();
      s.pts.forEach((p, i) => { const x = X(p[0]), y = Y(p[1]); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
      c.stroke(); c.setLineDash([]);
    }
    c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(b.x, b.y, b.w, b.h);
    if (o.xlabel) kit.label(c, o.xlabel, b.x + b.w / 2, b.y + b.h + 11, { size: 10.5, color: C.muted, align: 'center' });
    if (o.ylabel) kit.label(c, o.ylabel, b.x + 4, b.y + 9, { size: 10.5, color: C.muted });
    c.restore();
  }

  /* ================================================================ 1. THE CELL */
  const PARTS = {
    outside: { name: 'Outside the cell', job: 'Tissue fluid: salty water, rich in sodium and chloride, that brings oxygen, fuel and signals from the nearest capillary.', size: 'Most cells lie within a few tens of micrometres of a capillary', ill: 'Too much tissue fluid is oedema (swelling).' },
    membrane: { name: 'Plasma membrane', job: 'A double layer of lipids with proteins that work as channels, pumps, receptors and identity tags. It decides what enters and leaves.', size: 'About 5 nm thick', ill: 'Faulty channels cause disease — in cystic fibrosis the chloride channel CFTR.' },
    nucleus: { name: 'Nucleus', job: 'Keeps the DNA (46 chromosomes) and copies genes into messenger RNA, which leaves through pores in its double envelope.', size: 'About 6 µm across', ill: 'Mutations that remove the brakes on division can lead to cancer.' },
    nucleolus: { name: 'Nucleolus', job: 'A dense region of the nucleus where the parts of ribosomes are made and assembled.', size: '1–2 µm', ill: 'Large, prominent nucleoli are one sign pathologists look for in cancer cells.' },
    rer: { name: 'Rough endoplasmic reticulum', job: 'Membrane sheets studded with ribosomes, where proteins for export or for membranes are made and folded.', size: 'Spreads through much of the cell', ill: 'Misfolded proteins are held back here — as with the commonest cystic fibrosis mutation.' },
    ser: { name: 'Smooth endoplasmic reticulum', job: 'Makes lipids and steroid hormones, stores calcium (the trigger for muscle contraction) and, in liver cells, breaks down drugs and alcohol.', size: 'A network of tubes about 50 nm wide', ill: 'Grows with heavy alcohol use or some medicines, speeding the breakdown of other drugs — one source of interactions.' },
    golgi: { name: 'Golgi apparatus', job: 'Stacked sacs that finish proteins (adding sugar chains), then sort them and ship them in vesicles to their destination.', size: 'About 1–3 µm', ill: 'Rare inherited faults in adding sugar chains cause severe disease affecting many organs.' },
    mito: { name: 'Mitochondrion', job: 'Burns fuel with oxygen to make most of the cell\'s ATP. Has its own small DNA, inherited from the mother.', size: 'About 1–2 µm long', ill: 'Mitochondrial diseases hit brain, muscle, heart and eyes; cyanide and carbon monoxide stop its respiration.' },
    lyso: { name: 'Lysosome', job: 'An acid sac (pH about 4.5–5) of digestive enzymes that recycles worn-out parts and destroys what the cell swallows.', size: '0.1–1 µm', ill: 'A missing enzyme causes a lysosomal storage disease, such as Tay–Sachs or Gaucher disease.' },
    perox: { name: 'Peroxisome', job: 'Breaks down very long fatty acids and neutralises hydrogen peroxide.', size: '0.1–1 µm', ill: 'Faults cause rare disorders such as X-linked adrenoleukodystrophy.' },
    ribo: { name: 'Ribosomes', job: 'Molecular machines that read messenger RNA and join amino acids into proteins — free in the cytoplasm or on the rough ER.', size: 'About 25–30 nm: a thousandth of the cell', ill: 'Bacterial ribosomes differ from ours, so antibiotics such as the tetracyclines and macrolides can block theirs.' },
    vesicle: { name: 'Vesicles', job: 'Membrane bubbles that carry cargo from the ER to the Golgi and on to the surface, where they fuse and release it (exocytosis).', size: 'About 0.05–1 µm', ill: 'Faulty insulin release from pancreatic cells is part of type 2 diabetes.' },
    centro: { name: 'Centrosome', job: 'Organises the microtubules; its two centrioles duplicate before division and help pull the chromosomes apart.', size: 'About 0.5 µm', ill: 'Cancer cells often have extra centrosomes and divide unevenly.' },
    cyto: { name: 'Cytoskeleton (microtubules)', job: 'Protein tubes and filaments that give the cell its shape, act as rails for cargo, and pull chromosomes apart at division.', size: 'Microtubules are 25 nm wide', ill: 'Some cancer medicines (taxanes, vinca alkaloids) and colchicine for gout work by jamming microtubules.' },
    cilia: { name: 'Cilia (on airway cells)', job: 'Hair-like projections that beat about 10–20 times a second, sweeping mucus up and out of the airways.', size: 'About 6 µm long', ill: 'Slowed by smoking; in primary ciliary dyskinesia they barely beat, causing repeated chest infections.' },
    cytoplasm: { name: 'Cytoplasm (cytosol)', job: 'A crowded gel, mostly water, where glycolysis and much protein-making happen and the organelles sit.', size: 'Makes up about half of the cell\'s volume', ill: 'Enzyme defects in the cytosol cause many inherited disorders of metabolism.' }
  };
  const ORDER = ['membrane', 'nucleus', 'nucleolus', 'rer', 'ribo', 'golgi', 'vesicle', 'mito', 'lyso', 'perox', 'ser', 'centro', 'cyto', 'cilia', 'cytoplasm', 'outside'];

  Hyper.sim('fnd-cell', {
    title: 'Inside a cell',
    blurb: `A schematic animal cell — organelles are enlarged and simplified so you can find them. **Click any part** (or use *Next part*) to see what it does, how big it really is and what happens when it fails.

- Follow the **secretory pathway**: proteins made on the rough ER travel in vesicles to the Golgi, then to the surface, where they are released.
- Compare the real sizes: the whole cell is about 20 µm across, a mitochondrion 1–2 µm long, a ribosome only about 25 nm.
- Find the parts that antibiotics, some cancer medicines and inherited diseases act on.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      let sel = null, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'labels', type: 'check', label: 'Show labels', value: true },
        { id: 'flow', type: 'check', label: 'Animate the secretory pathway', value: true },
        { type: 'buttons', items: [{ id: 'next', label: 'Next part', primary: true }, { id: 'prev', label: 'Previous' }] }
      ], id => {
        const k = sel ? ORDER.indexOf(sel) : -1;
        if (id === 'next') pick(ORDER[(k + 1) % ORDER.length]);
        else if (id === 'prev') pick(ORDER[(k - 1 + ORDER.length) % ORDER.length]);
        loop.once();
      });
      const ro = kit.readout(box.side, [['name', 'Part'], ['job', 'What it does'], ['size', 'Real size'], ['ill', 'When it goes wrong']]);
      const V = ctl.values;
      function pick(id) {
        sel = id;
        const p = PARTS[id];
        ro.set('name', p ? p.name : '— click a part —');
        ro.set('job', p ? p.job : 'Click the cell, or press Next part.');
        ro.set('size', p ? p.size : '—');
        ro.set('ill', p ? p.ill : '—');
      }
      pick(null);

      // fixed random positions for free ribosomes
      const R = kit.fin.uniforms(11);
      const freeRibo = [];
      while (freeRibo.length < 46) {
        const u = R() * 1.8 - 0.9, v = R() * 1.8 - 0.9;
        if (Math.hypot(u, v) > 0.86) continue;
        if (Math.hypot((u + 0.30) * 1.55, v - 0.02) < 0.85) continue;           // clear of the nucleus and its ER
        if (u > 0.12 && u < 0.5 && Math.abs(v) < 0.3) continue;                   // clear of the Golgi
        freeRibo.push([u, v]);
      }
      const MITO = [[0.08, -0.74, 0.2], [0.64, 0.36, -0.7], [-0.74, -0.30, 1.3], [0.25, 0.66, 0.1], [-0.28, 0.78, -0.3], [0.74, -0.28, 1.2]];
      const LYSO = [[0.56, -0.24], [-0.45, -0.62], [0.40, -0.68]];

      function geo() {
        const W = st.W, H = st.H;
        const ry = Math.max(40, Math.min(H * 0.40, W * 0.27)), rx = ry * 1.55, s = ry;
        const cx = W * 0.5, cy = H * 0.53;
        const P = (u, v) => [cx + u * rx, cy + v * ry];
        const wob = th => 1 + 0.025 * Math.sin(3 * th + 0.5) + 0.018 * Math.cos(5 * th);
        const nuc = { x: cx - 0.30 * rx, y: cy + 0.02 * ry, a: 0.42 * s, b: 0.38 * s };
        const nr = (nuc.a + nuc.b) / 2;
        const gol = { x: cx + 0.30 * rx, y: cy - 0.02 * ry };
        const cen = P(0.18, 0.42);
        const memAt = th => [cx + rx * wob(th) * Math.cos(th), cy + ry * wob(th) * Math.sin(th)];
        const path = [[nuc.x + 1.62 * nr, nuc.y], [gol.x - 0.02 * s, gol.y], [gol.x + 0.34 * s, gol.y], memAt(0.12)];
        return { W, H, rx, ry, s, cx, cy, P, wob, nuc, nr, gol, cen, memAt, path };
      }
      function along(path, f) {
        const seg = path.length - 1, x = clamp(f, 0, 0.9999) * seg, k = Math.floor(x), u = x - k;
        return [lerp(path[k][0], path[k + 1][0], u), lerp(path[k][1], path[k + 1][1], u)];
      }
      function vesicles(g) {
        const out = [];
        for (let i = 0; i < 7; i++) {
          const f = ((V.flow ? t * 0.09 : 0) + i / 7) % 1;
          const p = along(g.path, f);
          out.push({ x: p[0] + Math.sin(i * 7.3 + t) * 2, y: p[1] + Math.cos(i * 3.1 + t * 1.3) * 3 + (i % 2 ? 6 : -6), f });
        }
        return out;
      }
      function hit(p) {
        const g = geo();
        const u = (p.x - g.cx) / g.rx, v = (p.y - g.cy) / g.ry, th = Math.atan2(v, u), rho = Math.hypot(u, v) / g.wob(th);
        if (rho > 1.03 && rho < 1.3 && th > -1.3 && th < -0.9) return 'cilia';
        if (Math.abs(rho - 1) < 0.045) return 'membrane';
        if (rho > 1) return 'outside';
        const dn = Math.hypot((p.x - g.nuc.x) / g.nuc.a, (p.y - g.nuc.y) / g.nuc.b);
        if (Math.hypot(p.x - (g.nuc.x + 0.10 * g.s), p.y - (g.nuc.y - 0.06 * g.s)) < 0.12 * g.s) return 'nucleolus';
        if (dn < 1.05) return 'nucleus';
        if (Math.hypot(p.x - g.cen[0], p.y - g.cen[1]) < 0.07 * g.s) return 'centro';
        for (const m of MITO) {
          const [mx, my] = g.P(m[0], m[1]), dx = p.x - mx, dy = p.y - my;
          const a = dx * Math.cos(m[2]) + dy * Math.sin(m[2]), b = -dx * Math.sin(m[2]) + dy * Math.cos(m[2]);
          if (Math.abs(a) < 0.17 * g.s && Math.abs(b) < 0.08 * g.s) return 'mito';
        }
        for (const l of LYSO) { const [lx, ly] = g.P(l[0], l[1]); if (Math.hypot(p.x - lx, p.y - ly) < 0.08 * g.s) return 'lyso'; }
        { const [px, py] = g.P(-0.82, 0.12); if (Math.hypot(p.x - px, p.y - py) < 0.07 * g.s) return 'perox'; }
        for (const ve of vesicles(g)) if (Math.hypot(p.x - ve.x, p.y - ve.y) < Math.max(6, 0.045 * g.s)) return 'vesicle';
        { const dx = p.x - (g.gol.x - 0.55 * g.s), dy = p.y - g.gol.y, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
          if (d > 0.5 * g.s && d < 0.86 * g.s && Math.abs(a) < 0.5) return 'golgi'; }
        for (const r of freeRibo) { const [x, y] = g.P(r[0], r[1]); if (Math.hypot(p.x - x, p.y - y) < 5) return 'ribo'; }
        { const dx = p.x - g.nuc.x, dy = p.y - g.nuc.y, d = Math.hypot(dx, dy) / g.nr, a = Math.atan2(dy, dx);
          if (d > 1.16 && d < 1.72 && Math.abs(a) < 1.2) return 'rer'; }
        { const [sx, sy] = g.P(-0.60, 0.60); if (Math.abs(p.x - sx) < 0.3 * g.s && Math.abs(p.y - sy) < 0.2 * g.s) return 'ser'; }
        for (let k = 0; k < 9; k++) {
          const th2 = k / 9 * Math.PI * 2 + 0.2, q = g.memAt(th2);
          const ax = g.cen[0], ay = g.cen[1], bx = lerp(ax, q[0], 0.95), by = lerp(ay, q[1], 0.95);
          const L2 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay) || 1;
          const tt = clamp(((p.x - ax) * (bx - ax) + (p.y - ay) * (by - ay)) / L2, 0, 1);
          if (Math.hypot(p.x - (ax + tt * (bx - ax)), p.y - (ay + tt * (by - ay))) < 4) return 'cyto';
        }
        return 'cytoplasm';
      }
      kit.click(st, p => { pick(hit(p)); loop.once(); }, () => true);

      function draw(dt) {
        t += dt || 0;
        const C = kit.colors(), c = st.begin(), g = geo();
        const on = id => sel === id;
        const lw = id => (on(id) ? 3.2 : 1.6);
        const hi = (id, col) => (on(id) ? C.accent : col);
        // the cell body
        c.beginPath();
        for (let k = 0; k <= 120; k++) { const q = g.memAt(k / 120 * Math.PI * 2); if (k) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }
        c.closePath();
        c.fillStyle = kit.hue(200, on('cytoplasm') ? 0.2 : 0.09); c.fill();
        // cytoskeleton
        c.strokeStyle = on('cyto') ? C.accent : kit.hue(215, 0.35); c.lineWidth = on('cyto') ? 2 : 1;
        for (let k = 0; k < 9; k++) {
          const q = g.memAt(k / 9 * Math.PI * 2 + 0.2);
          c.beginPath(); c.moveTo(g.cen[0], g.cen[1]); c.lineTo(lerp(g.cen[0], q[0], 0.95), lerp(g.cen[1], q[1], 0.95)); c.stroke();
        }
        // membrane (double line) and cilia
        c.strokeStyle = hi('membrane', kit.hue(30)); c.lineWidth = on('membrane') ? 5 : 3.2; c.stroke();
        c.save(); c.strokeStyle = C.bg2; c.lineWidth = 1; c.stroke(); c.restore();
        c.strokeStyle = hi('cilia', kit.hue(30)); c.lineWidth = on('cilia') ? 2.6 : 1.7; c.lineCap = 'round';
        for (let k = 0; k < 8; k++) {
          const th = -1.25 + k * 0.045, q = g.memAt(th), nx = Math.cos(th), ny = Math.sin(th), L = 0.17 * g.s;
          const sw = Math.sin(t * 7 - k * 0.8) * 0.35;
          c.beginPath(); c.moveTo(q[0], q[1]);
          c.quadraticCurveTo(q[0] + nx * L * 0.6 - ny * L * sw * 0.5, q[1] + ny * L * 0.6 + nx * L * sw * 0.5, q[0] + nx * L - ny * L * sw, q[1] + ny * L + nx * L * sw);
          c.stroke();
        }
        c.lineCap = 'butt';
        // smooth ER
        const [sx, sy] = g.P(-0.60, 0.60);
        c.strokeStyle = hi('ser', kit.hue(170)); c.lineWidth = on('ser') ? 3.5 : 2.4;
        for (let k = 0; k < 3; k++) {
          c.beginPath();
          for (let i = 0; i <= 24; i++) { const x = sx - 0.28 * g.s + i / 24 * 0.56 * g.s, y = sy - 0.12 * g.s + k * 0.12 * g.s + Math.sin(i * 0.9 + k) * 0.035 * g.s; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
          c.stroke();
        }
        // rough ER: arcs around the nucleus, studded with ribosomes
        for (let k = 0; k < 3; k++) {
          const r = (1.25 + k * 0.17) * g.nr;
          c.strokeStyle = hi('rer', kit.hue(200)); c.lineWidth = on('rer') ? 3.4 : 2.2;
          c.beginPath(); c.arc(g.nuc.x, g.nuc.y, r, -1.13, 1.13); c.stroke();
          for (let a = -1.1; a <= 1.1; a += 9 / r) kit.dot(c, g.nuc.x + Math.cos(a) * (r + 3), g.nuc.y + Math.sin(a) * (r + 3), 1.4, on('ribo') ? C.accent : C.text2);
        }
        // Golgi stack
        for (let k = 0; k < 5; k++) {
          const r = (0.56 + k * 0.065) * g.s;
          c.strokeStyle = hi('golgi', kit.hue(48)); c.lineWidth = on('golgi') ? 6 : 4.5; c.lineCap = 'round';
          c.beginPath(); c.arc(g.gol.x - 0.55 * g.s, g.gol.y, r, -0.42 + k * 0.02, 0.42 - k * 0.02); c.stroke();
        }
        c.lineCap = 'butt';
        // nucleus with pores and nucleolus
        c.beginPath(); c.ellipse(g.nuc.x, g.nuc.y, g.nuc.a, g.nuc.b, 0, 0, Math.PI * 2);
        c.fillStyle = kit.hue(265, on('nucleus') ? 0.32 : 0.2); c.fill();
        c.strokeStyle = hi('nucleus', kit.hue(265)); c.lineWidth = lw('nucleus') + 1; c.stroke();
        for (let a = 0; a < Math.PI * 2; a += 0.45) kit.dot(c, g.nuc.x + Math.cos(a) * g.nuc.a, g.nuc.y + Math.sin(a) * g.nuc.b, 1.8, C.bg2);
        c.strokeStyle = kit.hue(265, 0.35); c.lineWidth = 1;
        for (let k = 0; k < 5; k++) { c.beginPath(); for (let i = 0; i <= 16; i++) { const x = g.nuc.x - 0.3 * g.s + i / 16 * 0.55 * g.s, y = g.nuc.y - 0.2 * g.s + k * 0.1 * g.s + Math.sin(i + k * 2) * 0.03 * g.s; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); }
        kit.dot(c, g.nuc.x + 0.10 * g.s, g.nuc.y - 0.06 * g.s, 0.12 * g.s, on('nucleolus') ? C.accent : kit.hue(265, 0.7));
        // mitochondria
        for (const m of MITO) {
          const [mx, my] = g.P(m[0], m[1]), L = 0.16 * g.s, Wd = 0.07 * g.s;
          c.save(); c.translate(mx, my); c.rotate(m[2]);
          rrect(c, -L, -Wd, 2 * L, 2 * Wd, Wd); c.fillStyle = kit.hue(10, 0.3); c.fill();
          c.strokeStyle = hi('mito', kit.hue(10)); c.lineWidth = lw('mito'); c.stroke();
          c.beginPath(); for (let i = 0; i <= 8; i++) { const x = -L * 0.8 + i / 8 * 1.6 * L; c.lineTo(x, (i % 2 ? 1 : -1) * Wd * 0.62); } c.lineWidth = 1.2; c.stroke();
          c.restore();
        }
        // lysosomes, peroxisome, centrosome
        for (const l of LYSO) {
          const [lx, ly] = g.P(l[0], l[1]);
          kit.dot(c, lx, ly, 0.065 * g.s, kit.hue(140, 0.3), hi('lyso', kit.hue(140)));
          for (let i = 0; i < 5; i++) kit.dot(c, lx + Math.cos(i * 1.3) * 0.03 * g.s, ly + Math.sin(i * 2.1) * 0.03 * g.s, 1.3, kit.hue(140));
        }
        { const [px, py] = g.P(-0.82, 0.12); kit.dot(c, px, py, 0.055 * g.s, kit.hue(90, 0.3), hi('perox', kit.hue(90))); c.fillStyle = kit.hue(90); c.fillRect(px - 3, py - 3, 6, 6); }
        c.strokeStyle = hi('centro', C.text2); c.lineWidth = on('centro') ? 4 : 3;
        c.beginPath(); c.moveTo(g.cen[0] - 7, g.cen[1]); c.lineTo(g.cen[0] + 3, g.cen[1]); c.moveTo(g.cen[0] + 7, g.cen[1] - 6); c.lineTo(g.cen[0] + 7, g.cen[1] + 4); c.stroke();
        // free ribosomes and vesicles
        for (const r of freeRibo) { const [x, y] = g.P(r[0], r[1]); kit.dot(c, x, y, on('ribo') ? 2.4 : 1.6, on('ribo') ? C.accent : C.text2); }
        for (const ve of vesicles(g)) {
          kit.dot(c, ve.x, ve.y, Math.max(3.5, 0.035 * g.s), kit.hue(48, 0.55), hi('vesicle', kit.hue(48)));
          if (ve.f > 0.93) for (let i = 0; i < 4; i++) kit.dot(c, ve.x + 10 + (ve.f - 0.93) * 200 * Math.cos(i - 1.5), ve.y + (ve.f - 0.93) * 200 * Math.sin(i - 1.5) * 0.6, 1.5, kit.hue(48));
        }
        // labels
        if (V.labels) {
          const L = (txt, x, y, al) => kit.label(c, txt, x, y, { size: 11, color: C.text2, bg: C.surface, align: al || 'center' });
          L('nucleus', g.nuc.x - 0.12 * g.s, g.nuc.y + 0.22 * g.s);
          L('nucleolus', g.nuc.x + 0.10 * g.s, g.nuc.y - 0.24 * g.s);
          L('rough ER', g.nuc.x + 1.45 * g.nr * Math.cos(0.95), g.nuc.y + 1.45 * g.nr * Math.sin(0.95) + 12);
          L('Golgi', g.gol.x + 0.12 * g.s, g.gol.y - 0.42 * g.s);
          const m0 = g.P(MITO[1][0], MITO[1][1]); L('mitochondrion', m0[0], m0[1] + 0.2 * g.s);
          const l0 = g.P(LYSO[0][0], LYSO[0][1]); L('lysosome', l0[0] + 0.05 * g.s, l0[1] - 0.12 * g.s);
          L('smooth ER', sx, sy + 0.24 * g.s);
          const p0 = g.P(-0.82, 0.12); L('peroxisome', p0[0] + 0.02 * g.s, p0[1] - 0.12 * g.s);
          L('centrosome', g.cen[0] + 0.02 * g.s, g.cen[1] + 0.14 * g.s);
          const cq = g.memAt(-1.1); L('cilia', cq[0] + 0.28 * g.s, cq[1] - 0.12 * g.s);
          const vq = along(g.path, 0.8); L('vesicles', vq[0] - 0.02 * g.s, vq[1] + 0.2 * g.s);
          const mq = g.memAt(2.45); L('plasma membrane', mq[0] - 0.05 * g.s, mq[1] + 0.12 * g.s);
        }
        // scale bar: the cell is about 20 µm across
        const bar = g.rx / 2;
        c.strokeStyle = C.text2; c.lineWidth = 2; c.beginPath(); c.moveTo(12, g.H - 14); c.lineTo(12 + bar, g.H - 14); c.stroke();
        kit.label(c, '≈ 5 µm (organelles not to scale)', 12, g.H - 26, { size: 10.5, color: C.muted });
        if (sel && PARTS[sel]) kit.label(c, PARTS[sel].name, g.W - 10, 14, { size: 13, weight: 650, color: C.accent, align: 'right' });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2. OSMOSIS: A RED CELL IN SOLUTIONS */
  const SOLUTIONS = [
    ['0.9 % saline (plasma strength)', 'saline', 286, 0, 'Isotonic: the cell keeps its disc shape.'],
    ['Pure water', 'water', 0, 0, 'Strongly hypotonic: water rushes in and the cell bursts (haemolysis).'],
    ['0.45 % saline (half strength)', 'half', 143, 0, 'Hypotonic: the cell swells almost to bursting.'],
    ['3 % saline (strong)', 'hyper', 955, 0, 'Hypertonic: water leaves and the cell shrivels and puckers (crenation).'],
    ['5 % glucose', 'glucose', 0, 278, 'Iso-osmotic in the bag, but glucose enters the cell and water follows: the cell swells and bursts.'],
    ['Urea, 300 mOsm/kg', 'urea', 0, 300, 'Iso-osmotic but hypotonic: urea leaks in, water follows, the cell bursts.'],
    ['Saline + urea (the drip fluid of the past)', 'mix', 286, 150, 'Hyperosmotic but isotonic: the urea enters and the cell ends at normal size.'],
    ['Your own mixture', 'custom', null, null, 'Set the two sliders.']
  ];
  // Evans–Fung shape of a red cell: thickness (µm) at relative radius q
  const rbcT = q => Math.sqrt(Math.max(0, 1 - q * q)) * (0.81 + 7.83 * q * q - 4.39 * q * q * q * q);

  Hyper.sim('fnd-osmosis', {
    title: 'A red cell in different solutions',
    blurb: `A red blood cell, cut through its middle, sits in a solution. Orange dots are particles that **cannot** cross its membrane (like sodium and chloride), green dots are particles that **can** (urea, glucose). Blue arrows show water moving by osmosis. Time is slowed down many times: real red cells respond within about a second.

- Drop cells into **pure water**, **half-strength** and **3 % saline** and watch them burst, swell and shrivel.
- Try **urea at 300 mOsm/kg**: the same particle count as plasma, yet the cell bursts — tonicity (particles that stay outside) is what counts.
- **5 % glucose** is safe in a vein, but it bursts red cells in a tube: why a blood transfusion is never mixed with glucose solution.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const start = SOLUTIONS.find(s => s[1] === (params && params.sol)) || SOLUTIONS[0];
      const ctl = kit.controls(box.side, [
        { id: 'sol', type: 'select', label: 'Put a fresh cell into', options: SOLUTIONS.map(s => [s[0], s[1]]), value: start[1] },
        { id: 'imp', label: 'Particles that cannot enter', min: 0, max: 1000, step: 1, value: start[2] != null ? start[2] : 286, unit: 'mOsm/kg' },
        { id: 'perm', label: 'Particles that can enter (urea, glucose)', min: 0, max: 600, step: 1, value: start[3] != null ? start[3] : 0, unit: 'mOsm/kg' },
        { type: 'buttons', items: [{ id: 'fresh', label: 'Fresh cell', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], (id, v) => {
        if (id === 'sol') {
          const s = SOLUTIONS.find(x => x[1] === v);
          if (s && s[2] != null) { ctl.set('imp', s[2]); ctl.set('perm', s[3]); }
          fresh();
        } else if (id === 'imp' || id === 'perm') { ctl.set('sol', 'custom'); }
        else if (id === 'fresh') fresh();
        else if (id === 'pause') paused = !paused;
        report();
      });
      const ro = kit.readout(box.side, [['out', 'Outside: all particles'], ['ton', 'Tonicity (particles that stay out)'], ['vol', 'Cell volume'], ['water', 'Water'], ['state', 'The cell']]);
      const V = ctl.values;
      const b = 0.4, n = 290 * 0.6;             // osmotically inactive fraction; impermeant osmoles inside (normal water 0.6)
      let W = 0.6, p = 0, burst = false, t = 0, hist = [], flux = 0, paused = false, burstAt = 0;
      const R = kit.fin.uniforms(5);
      const pool = []; for (let i = 0; i < 200; i++) pool.push([R(), R(), R() * 6.28]);
      const inner = []; for (let i = 0; i < 60; i++) inner.push([R() * 2 - 1, R() * 1.6 - 0.8, R() * 6.28]);
      function fresh() { W = 0.6; p = 0; burst = false; hist = []; t = 0; flux = 0; }
      const vol = () => b + W;
      function stateText() {
        const v = vol();
        if (burst) return 'burst — haemoglobin has leaked out (haemolysis)';
        if (v > 1.5) return 'nearly a sphere — about to burst';
        if (v > 1.08) return 'swollen, rounding up';
        if (v < 0.9) return 'shrunken and crenated (puckered)';
        return 'normal biconcave disc';
      }
      function report() {
        const imp = V.imp, perm = V.perm;
        ro.set('out', Math.round(imp + perm) + ' mOsm/kg (plasma ≈ 290)');
        ro.set('ton', Math.round(imp) + ' mOsm/kg — ' + (imp < 265 ? 'hypotonic' : imp > 315 ? 'hypertonic' : 'isotonic'));
        ro.set('vol', burst ? '— (burst)' : Math.round(vol() * 100) + ' % of normal');
        ro.set('water', burst || paused ? (paused ? 'paused' : '—') : Math.abs(flux) < 0.004 ? 'in balance' : flux > 0 ? 'moving in' : 'moving out');
        ro.set('state', stateText());
      }
      function step(dt) {
        if (paused || burst) return;
        const sub = 0.005;
        for (let s = 0; s < dt; s += sub) {
          const cin = (n + p) / W, cout = V.imp + V.perm;
          flux = 0.35 * (cin - cout) / 290;
          W = Math.max(0.14, W + flux * sub);
          p = Math.max(0, p + 0.45 * (V.perm * W - p) * sub);
          t += sub;
          if (vol() >= 1.66) { burst = true; burstAt = t; break; }
        }
        hist.push([t, vol()]);
        hist = hist.filter(h => h[0] > t - 20);
      }
      function shape() {
        // returns radius (µm), a thickness function and crenation amplitude for the current volume
        const v = vol(), R0 = 3.91, Rs = 3.29;
        if (v >= 1) {
          const s = clamp((v - 1) / 0.66, 0, 1);
          const Rr = lerp(R0, Rs, s);
          return { R: Rr, T: q => lerp(rbcT(q), 2 * Rr * Math.sqrt(Math.max(0, 1 - q * q)), s), cren: 0, pallor: 1 - s };
        }
        const f = clamp(v, 0.45, 1);
        return { R: R0 * (0.94 + 0.06 * f), T: q => rbcT(q) * f, cren: clamp((1 - v) / 0.35, 0, 1), pallor: 1 };
      }
      function draw(dt) {
        step(Math.min(dt || 0, 0.05));
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H;
        const topH = Hh * 0.66, cx = Wd * 0.42, cy = topH * 0.52;
        const sc = Math.max(8, Math.min(Wd * 0.052, (topH - 50) / 7.2));   // px per µm
        const salt = kit.hue(28), perm = kit.hue(155), water = kit.hue(205), red = kit.hue(355);
        // background particles in the beaker
        c.fillStyle = burst ? kit.hue(355, 0.07) : C.surface; c.fillRect(8, 8, Wd - 16, topH - 8);
        const nImp = Math.round(V.imp / 1000 * 90), nPerm = Math.round(V.perm / 1000 * 90);
        const sh = shape(), halfW = sh.R * sc + 10, halfH = 3.6 * sc;
        for (let i = 0; i < Math.min(pool.length, nImp + nPerm); i++) {
          const q = pool[i];
          const x = 14 + q[0] * (Wd - 28) + Math.sin(t * 1.3 + q[2]) * 4, y = 14 + q[1] * (topH - 22) + Math.cos(t * 1.1 + q[2]) * 4;
          if (Math.abs(x - cx) < halfW && Math.abs(y - cy) < halfH) continue;
          kit.dot(c, x, y, 2.6, i < nImp ? salt : perm);
        }
        // the cell, cut through the middle
        const top = [], bot = [];
        for (let k = 0; k <= 80; k++) {
          const q = -1 + 2 * k / 80, x = cx + q * sh.R * sc, h = sh.T(Math.abs(q)) / 2 * sc;
          const bump = sh.cren * 0.22 * sc * Math.max(0, Math.sin(k / 80 * Math.PI * 9));
          top.push([x, cy - h - bump]); bot.push([x, cy + h + bump]);
        }
        c.beginPath(); top.forEach((pt, i) => (i ? c.lineTo(pt[0], pt[1]) : c.moveTo(pt[0], pt[1]))); for (let i = bot.length - 1; i >= 0; i--) c.lineTo(bot[i][0], bot[i][1]); c.closePath();
        if (burst) { c.setLineDash([5, 5]); c.strokeStyle = kit.hue(355, 0.5); c.lineWidth = 1.5; c.stroke(); c.setLineDash([]); }
        else { c.fillStyle = kit.hue(355, 0.42); c.fill(); c.strokeStyle = red; c.lineWidth = 2; c.stroke(); }
        // particles inside: a fixed number, so they crowd when the cell shrinks and thin out when it swells
        const nIn = 16, nPin = Math.min(40, Math.round(16 * p / n));
        for (let i = 0; i < nIn + nPin && i < inner.length; i++) {
          const q = inner[i], xq = clamp(q[0] * 0.85, -0.9, 0.9), h = sh.T(Math.abs(xq)) / 2 * sc;
          let x = cx + xq * sh.R * sc, y = cy + q[1] * Math.max(0, h - 3) * 0.9;
          if (burst) { const k = (t - burstAt + 0.2) * 40; x += Math.cos(q[2]) * k; y += Math.sin(q[2]) * k; }
          kit.dot(c, x, y, 2.4, i < nIn ? salt : perm);
        }
        if (burst) for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 20 + (i * 37 % 60) + (t - burstAt) * 18; kit.dot(c, cx + Math.cos(a) * r * 1.6, cy + Math.sin(a) * r * 0.8, 2, kit.hue(355, 0.6)); }
        // water arrows
        if (!burst && !paused && Math.abs(flux) > 0.004) {
          const L = clamp(Math.abs(flux) / 0.3, 0.25, 1) * 26, dir = flux > 0 ? 1 : -1;
          for (const [qx, side] of [[-0.55, -1], [0, -1], [0.55, -1], [-0.55, 1], [0, 1], [0.55, 1]]) {
            const x = cx + qx * sh.R * sc, yEdge = cy + side * (sh.T(Math.abs(qx)) / 2 * sc + 6), yOut = yEdge + side * L;
            if (dir > 0) kit.arrow(c, x, yOut, x, yEdge, water, 2); else kit.arrow(c, x, yEdge, x, yOut, water, 2);
          }
          for (const side of [-1, 1]) { const x0 = cx + side * (sh.R * sc + 6), x1 = x0 + side * L; if (dir > 0) kit.arrow(c, x1, cy, x0, cy, water, 2); else kit.arrow(c, x0, cy, x1, cy, water, 2); }
        }
        // top view inset
        const ix = Wd - 70, iy = 62, ir = 30 * sh.R / 3.91;
        c.beginPath();
        for (let k = 0; k <= 72; k++) { const a = k / 72 * Math.PI * 2, r = ir * (1 + (burst ? 0 : sh.cren * 0.13 * Math.max(0, Math.sin(a * 14)))); if (k) c.lineTo(ix + Math.cos(a) * r, iy + Math.sin(a) * r); else c.moveTo(ix + Math.cos(a) * r, iy + Math.sin(a) * r); }
        c.closePath();
        if (burst) { c.setLineDash([4, 4]); c.strokeStyle = kit.hue(355, 0.5); c.lineWidth = 1.2; c.stroke(); c.setLineDash([]); }
        else {
          c.fillStyle = kit.hue(355, 0.5); c.fill(); c.strokeStyle = red; c.lineWidth = 1.5; c.stroke();
          if (sh.pallor > 0.05) { c.beginPath(); c.arc(ix, iy, ir * 0.42 * sh.pallor, 0, Math.PI * 2); c.fillStyle = kit.hue(355, 0.2); c.fill(); }
        }
        kit.label(c, 'seen from above', ix, iy + 44, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'cut through the middle (1 µm = ' + Math.round(sc) + ' px)', 16, 22, { size: 10.5, color: C.muted });
        kit.label(c, '● cannot enter', 16, topH - 30, { size: 11, color: salt });
        kit.label(c, '● can enter', 16, topH - 14, { size: 11, color: perm });
        kit.label(c, '→ water', 120, topH - 14, { size: 11, color: water });
        if (burst) kit.label(c, 'haemolysis: the cell has burst', cx, 36, { size: 13, weight: 650, color: C.bad, align: 'center' });
        // volume over time
        const ch = { x: 52, y: topH + 16, w: Wd - 70, h: Hh - topH - 38 };
        chart(c, kit, C, ch, {
          xmin: t - 20, xmax: t, ymin: 0.4, ymax: 1.8, ystep: 0.2,
          series: [{ pts: hist, color: red, width: 2 }],
          hlines: [{ y: 1, color: C.ok, label: 'normal' }, { y: 1.66, color: C.bad, label: 'bursts' }],
          xlabel: 'last 20 seconds (slowed down)', ylabel: 'volume ÷ normal'
        });
        report();
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3. THE MEMBRANE POTENTIAL */
  const MP_PRESETS = {
    rest: { label: 'A resting nerve cell', Ko: 5, Ki: 140, Nao: 145, Nai: 12, pNa: 0.04, pCl: 0.45 },
    hyperK: { label: 'High blood potassium (7.5 mmol/L)', Ko: 7.5, Ki: 140, Nao: 145, Nai: 12, pNa: 0.04, pCl: 0.45 },
    hypoK: { label: 'Low blood potassium (2.5 mmol/L)', Ko: 2.5, Ki: 140, Nao: 145, Nai: 12, pNa: 0.04, pCl: 0.45 },
    peak: { label: 'Peak of an action potential', Ko: 5, Ki: 140, Nao: 145, Nai: 12, pNa: 20, pCl: 0.45 },
    Konly: { label: 'Only potassium channels open', Ko: 5, Ki: 140, Nao: 145, Nai: 12, pNa: 0.001, pCl: 0 }
  };
  Hyper.sim('fnd-membrane-potential', {
    title: 'The membrane potential',
    blurb: `A patch of cell membrane with the fluid outside (top) and inside (bottom). Dots are ions, drawn in proportion to their concentrations; moving dots cross through open channels. On the right, each ion's **equilibrium potential** (Nernst) and the **membrane potential** (Goldman), which settles where the flows of charge in and out balance.

- Start from rest, then raise **potassium outside**: the potential moves towards zero — the danger of high blood potassium for the heart.
- Raise **sodium permeability** to about 20: the voltage swings positive, as at the peak of a nerve impulse.
- Choose *Only potassium channels open*: the membrane sits exactly at the potassium equilibrium potential.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const p0 = MP_PRESETS[(params && params.preset)] ? params.preset : 'rest', P0 = MP_PRESETS[p0];
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Situation', options: Object.keys(MP_PRESETS).map(k => [MP_PRESETS[k].label, k]).concat([['Your own values', 'custom']]), value: p0 },
        { id: 'Ko', label: 'Potassium outside', min: 1, max: 12, step: 0.1, value: P0.Ko, unit: 'mmol/L' },
        { id: 'Ki', label: 'Potassium inside', min: 100, max: 160, step: 1, value: P0.Ki, unit: 'mmol/L' },
        { id: 'Nao', label: 'Sodium outside', min: 110, max: 165, step: 1, value: P0.Nao, unit: 'mmol/L' },
        { id: 'Nai', label: 'Sodium inside', min: 5, max: 40, step: 1, value: P0.Nai, unit: 'mmol/L' },
        { id: 'pNa', label: 'Sodium permeability ÷ potassium', min: 0.001, max: 30, value: P0.pNa, log: true, sig: 2 },
        { id: 'pCl', label: 'Chloride permeability ÷ potassium', min: 0, max: 2, step: 0.05, value: P0.pCl }
      ], (id, v) => {
        if (id === 'preset') { const P = MP_PRESETS[v]; if (P) for (const k of ['Ko', 'Ki', 'Nao', 'Nai', 'pNa', 'pCl']) ctl.set(k, P[k]); }
        else ctl.set('preset', 'custom');
        compute();
      });
      const ro = kit.readout(box.side, [['ek', 'E(K⁺) — potassium'], ['ena', 'E(Na⁺) — sodium'], ['ecl', 'E(Cl⁻) — chloride'], ['vm', 'Membrane potential'], ['shift', 'Compared with a normal resting cell'], ['what', 'What it means']]);
      const V = ctl.values, M = kit.med, Clo = 110, Cli = 10;
      const vRest = M.goldman({ pK: 1, pNa: 0.04, pCl: 0.45, Ko: 5, Ki: 140, Nao: 145, Nai: 12, Clo, Cli });
      let E = {}, fl = {}, t = 0;
      const RTF = M.nernst(1, Math.E, 1);                         // 26.7 mV at 37 °C
      // GHK flux of an ion outwards (arbitrary units): positive = ions leaving the cell
      function ghk(P, z, cin, cout, Vm) {
        const u = Vm / RTF;
        if (Math.abs(u) < 1e-6) return P * (cin - cout);
        const e = Math.exp(-z * u);
        return P * z * u * (cin - cout * e) / (1 - e);
      }
      function compute() {
        E.K = M.nernst(1, V.Ko, V.Ki); E.Na = M.nernst(1, V.Nao, V.Nai); E.Cl = M.nernst(-1, Clo, Cli);
        E.Vm = M.goldman({ pK: 1, pNa: V.pNa, pCl: V.pCl, Ko: V.Ko, Ki: V.Ki, Nao: V.Nao, Nai: V.Nai, Clo, Cli });
        fl.K = ghk(1, 1, V.Ki, V.Ko, E.Vm); fl.Na = ghk(V.pNa, 1, V.Nai, V.Nao, E.Vm); fl.Cl = ghk(V.pCl, -1, Cli, Clo, E.Vm);
        const f = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1) + ' mV';
        ro.set('ek', f(E.K)); ro.set('ena', f(E.Na)); ro.set('ecl', f(E.Cl));
        ro.set('vm', f(E.Vm));
        const d = E.Vm - vRest;
        ro.set('shift', Math.abs(d) < 0.5 ? 'about the same' : (d > 0 ? 'depolarised by ' : 'hyperpolarised by ') + Math.abs(d).toFixed(1) + ' mV');
        let w;
        if (V.pNa > 1) w = 'Sodium channels dominate: the voltage swings towards E(Na) — the upstroke of an action potential.';
        else if (V.Ko > 5.5) w = 'Potassium high: cells are depolarised. In the heart, sodium channels partly inactivate, conduction slows and dangerous rhythms can follow.';
        else if (V.Ko < 3.5) w = 'Potassium low: cells are hyperpolarised and harder to excite — weakness, cramps and rhythm disturbances.';
        else if (V.pNa < 0.005 && V.pCl < 0.05) w = 'Only potassium can cross, so the membrane sits at E(K).';
        else w = 'At rest the potassium leak dominates, so the voltage sits close to E(K), pulled a little towards E(Na).';
        ro.set('what', w);
      }
      // ion positions: counts in proportion to concentration (1 dot per 6 mmol/L)
      const R = kit.fin.uniforms(3);
      const pos = []; for (let i = 0; i < 90; i++) pos.push([R(), R(), R() * 6.28]);
      let movers = [], acc = { K: 0, Na: 0, Cl: 0 };
      compute();
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05); t += dt;
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const sceneW = W * (W < 560 ? 0.5 : 0.62), my = H * 0.5, mh = 30;
        const col = { K: kit.hue(275), Na: kit.hue(28), Cl: kit.hue(150) };
        c.fillStyle = C.surface; c.fillRect(0, 0, sceneW, my - mh / 2);
        c.fillStyle = kit.hue(200, 0.08); c.fillRect(0, my + mh / 2, sceneW, H - my - mh / 2);
        kit.label(c, 'outside the cell', 10, 14, { size: 11, color: C.muted });
        kit.label(c, 'inside the cell', 10, H - 12, { size: 11, color: C.muted });
        // the bilayer
        for (let x = 4; x < sceneW; x += 9) {
          for (const s of [-1, 1]) {
            const y = my + s * (mh / 2 - 4);
            c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - 1.5, y); c.lineTo(x - 1.5, my - s * 1); c.moveTo(x + 1.5, y); c.lineTo(x + 1.5, my - s * 1); c.stroke();
            kit.dot(c, x, y, 3.4, kit.hue(40, 0.7));
          }
        }
        // channels: K, Na, Cl
        const chans = [['K', 0.14], ['Na', 0.33], ['K', 0.52], ['Cl', 0.70], ['Na', 0.86]];
        const perm = { K: 1, Na: V.pNa, Cl: V.pCl };
        chans.forEach(([ion, fx]) => {
          const x = fx * sceneW, open = clamp(Math.log10(perm[ion] * 1000 + 1) / 4.5, 0.08, 1);
          c.fillStyle = C.bg2; c.fillRect(x - 11, my - mh / 2 - 2, 22, mh + 4);
          c.fillStyle = col[ion]; c.globalAlpha = 0.85;
          c.fillRect(x - 11, my - mh / 2 - 2, 7, mh + 4); c.fillRect(x + 4, my - mh / 2 - 2, 7, mh + 4);
          c.globalAlpha = 1;
          c.fillStyle = C.bg2; c.fillRect(x - 4, my - mh / 2 - 2, 8, mh + 4);
          if (open < 0.3) { c.fillStyle = col[ion]; c.fillRect(x - 4, my - 3, 8, 6); }
          kit.label(c, ion === 'K' ? 'K⁺' : ion === 'Na' ? 'Na⁺' : 'Cl⁻', x, my + mh / 2 + 12, { size: 10, color: col[ion], align: 'center', weight: 650 });
        });
        // resting ions
        let k = 0;
        const place = (ion, conc, side) => {
          const cnt = Math.min(30, Math.round(conc / 6));
          for (let i = 0; i < cnt; i++, k++) {
            const q = pos[k % pos.length];
            const y0 = side < 0 ? 26 : my + mh / 2 + 22, h = side < 0 ? my - mh / 2 - 36 : H - my - mh / 2 - 38;
            const x = 12 + q[0] * (sceneW - 24) + Math.sin(t * 1.2 + q[2]) * 3, y = y0 + q[1] * h + Math.cos(t + q[2]) * 3;
            kit.dot(c, x, y, 3.2, col[ion]);
          }
        };
        place('K', V.Ko, -1); place('Na', V.Nao, -1); place('Cl', Clo, -1);
        place('K', V.Ki, 1); place('Na', V.Nai, 1); place('Cl', Cli, 1);
        // ions crossing through channels: rate from the GHK flux at this voltage
        for (const ion of ['K', 'Na', 'Cl']) {
          const rate = Math.min(14, Math.abs(fl[ion]) * 0.22);
          acc[ion] += rate * dt;
          while (acc[ion] >= 1) {
            acc[ion] -= 1;
            const opts = chans.filter(ch => ch[0] === ion);
            const ch = opts[Math.floor(R() * opts.length)];
            movers.push({ ion, x: ch[1] * sceneW, out: fl[ion] > 0, s: 0 });
          }
        }
        movers.forEach(m => { m.s += dt / 0.9; });
        movers = movers.filter(m => m.s < 1);
        for (const m of movers) {
          const y = m.out ? lerp(my + mh / 2 + 16, my - mh / 2 - 16, m.s) : lerp(my - mh / 2 - 16, my + mh / 2 + 16, m.s);
          kit.dot(c, m.x, y, 3.6, col[m.ion], C.text);
        }
        // the voltage scale
        const x0 = sceneW + 44, yT = 22, yB = H - 22, vmax = 80, vmin = -120;
        const Y = v => yT + (vmax - clamp(v, vmin, vmax)) / (vmax - vmin) * (yB - yT);
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, yT); c.lineTo(x0, yB); c.stroke();
        c.font = '10px system-ui, sans-serif'; c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let v = vmin; v <= vmax; v += 20) { c.beginPath(); c.moveTo(x0 - 4, Y(v)); c.lineTo(x0, Y(v)); c.stroke(); c.fillText(String(v), x0 - 6, Y(v)); }
        kit.label(c, 'mV', x0 - 6, yT - 12, { size: 10, color: C.muted, align: 'right' });
        // chord conductances: how strongly each ion pulls the voltage towards its own E
        const g = { K: Math.abs(fl.K / ((E.Vm - E.K) || 1e-3)), Na: Math.abs(fl.Na / ((E.Vm - E.Na) || 1e-3)), Cl: Math.abs(fl.Cl / ((E.Vm - E.Cl) || 1e-3)) };
        const gmax = Math.max(g.K, g.Na, g.Cl, 1e-9);
        const xe = x0 + 70;
        for (const ion of ['Na', 'Cl', 'K']) {
          const y = Y(E[ion]);
          c.strokeStyle = col[ion]; c.lineWidth = 2; c.beginPath(); c.moveTo(xe - 12, y); c.lineTo(xe + 12, y); c.stroke();
          kit.label(c, 'E(' + (ion === 'K' ? 'K⁺' : ion === 'Na' ? 'Na⁺' : 'Cl⁻') + ') ' + Math.round(E[ion]), xe + 16, y, { size: 11, color: col[ion], weight: 600 });
          const wdt = 1 + 7 * Math.sqrt(fin(g[ion] / gmax));
          c.strokeStyle = col[ion]; c.globalAlpha = 0.5; c.lineWidth = wdt;
          c.beginPath(); c.moveTo(x0 + 10, Y(E.Vm)); c.lineTo(xe - 14, y); c.stroke(); c.globalAlpha = 1;
        }
        const yv = Y(E.Vm);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(x0 + 1, yv); c.lineTo(x0 + 13, yv - 7); c.lineTo(x0 + 13, yv + 7); c.closePath(); c.fill();
        kit.label(c, 'Vm ' + E.Vm.toFixed(0) + ' mV', x0 + 4, yv + (E.Vm > E.K + 14 || E.Vm > -40 ? 18 : -16), { size: 12, weight: 700, color: C.accent });
        kit.label(c, 'line thickness: how strongly each ion pulls', x0 - 30, H - 8, { size: 9.5, color: C.muted });
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4. A FEEDBACK LOOP */
  // the largest stable gain of a first-order loop (time constant tau) with a pure delay theta
  function criticalGain(tau, theta) {
    if (theta <= 1e-6) return Infinity;
    let lo = Math.PI / (2 * theta) + 1e-9, hi = Math.PI / theta - 1e-9;
    const f = w => Math.tan(w * theta) + w * tau;
    for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; }
    const w = (lo + hi) / 2;
    return Math.sqrt(1 + w * w * tau * tau);
  }
  Hyper.sim('fnd-feedback', {
    title: 'A feedback loop: gain, delay and overshoot',
    blurb: `A body-temperature loop drawn as a control system. A **disturbance** (a heat load, in °C it would add if nothing opposed it) pushes core temperature away from the 37 °C set point; sensors report it after a **delay**, and effectors (sweating, skin blood flow, shivering) push back with a strength set by the **gain**. Time runs at about two minutes per second.

- With no delay, raise the gain: the error left shrinks to D/(1 + G) and recovery gets faster.
- Now add a delay of 2–3 minutes: the loop overshoots and rings; past the *largest stable gain* the swings grow — like Cheyne–Stokes breathing.
- Switch to **positive feedback**: the response feeds the change until an end point switches the loop off, as in labour or clotting.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Kind of loop', options: [['Negative feedback', 'neg'], ['No control (loop cut)', 'none'], ['Positive feedback', 'pos']], value: 'neg' },
        { id: 'G', label: 'Gain of the loop', min: 0, max: 30, step: 0.5, value: 8 },
        { id: 'delay', label: 'Delay (sensing and response)', min: 0, max: 5, step: 0.1, value: 0.5, unit: 'min' },
        { id: 'D', label: 'Disturbance (effect without control)', min: -4, max: 4, step: 0.1, value: 3, unit: '°C' },
        { id: 'on', type: 'check', label: 'Disturbance switched on', value: true },
        { type: 'buttons', items: [{ id: 'kick', label: 'Brief kick' }, { id: 'reset', label: 'Start again', primary: true }] }
      ], id => {
        if (id === 'kick') kickUntil = tm + 2;
        else if (id === 'reset') reset();
        else if (id === 'mode' || id === 'G') ended = false;
        analyse();
      });
      const ro = kit.readout(box.side, [['temp', 'Core temperature'], ['err', 'Error now'], ['pred', 'Predicted steady error'], ['gc', 'Largest stable gain (this delay)'], ['beh', 'Behaviour']]);
      const V = ctl.values, tau = 10, dts = 0.02;
      let x = 0, tm = 0, buf = [], hist = [], kickUntil = -1, ended = false, u = 0, pulse = 0;
      function reset() { x = 0; tm = 0; buf = []; hist = []; kickUntil = -1; ended = false; }
      const sgn = () => (V.mode === 'neg' ? 1 : V.mode === 'pos' ? -1 : 0);
      function delayed(th) {
        if (th <= 0 || !buf.length) return x;
        const k = buf.length - 1 - Math.round(th / dts);
        return k >= 0 ? buf[k] : 0;
      }
      function analyse() {
        const D = V.D, G = V.G;
        const gc = criticalGain(tau, V.delay);
        ro.set('gc', V.mode !== 'neg' ? '—' : Number.isFinite(gc) ? gc.toFixed(1) : 'no limit without delay');
        if (V.mode === 'neg') ro.set('pred', (D / (1 + G)).toFixed(2) + ' °C (D ÷ (1 + G))');
        else if (V.mode === 'none') ro.set('pred', D.toFixed(2) + ' °C (all of it)');
        else ro.set('pred', G < 1 ? (D / (1 - G)).toFixed(2) + ' °C (amplified: D ÷ (1 − G))' : 'none — it runs away');
        let beh;
        if (V.mode === 'none') beh = 'no correction: the whole disturbance gets through, slowly';
        else if (V.mode === 'pos') beh = G < 1 ? 'weak positive feedback: the change is amplified but settles' : 'runaway: the change feeds itself until an end point stops it';
        else if (G >= gc) beh = 'unstable: each correction arrives too late and the swings grow';
        else {
          // simulate a step to measure the overshoot
          let y = 0, peak = 0; const b = [], n = Math.round(V.delay / 0.05);
          for (let i = 0; i < 6000; i++) { const yd = n > 0 ? (b.length >= n ? b[b.length - n] : 0) : y; y += 0.05 * (1 - y - G * yd) / tau; b.push(y); peak = Math.max(peak, y); }
          const fin0 = 1 / (1 + G), os = (peak - fin0) / fin0;
          beh = os > 0.02 ? 'overshoots by ' + Math.round(os * 100) + ' %, then settles' : 'settles smoothly';
        }
        ro.set('beh', beh);
      }
      function step(dt) {
        for (let s = 0; s < dt; s += dts) {
          const d = (V.on ? V.D : 0) + (tm < kickUntil ? 3 : 0);
          const xd = delayed(V.delay);
          u = ended ? 0 : sgn() * V.G * xd;
          x += dts * (d - x - u) / tau;
          if (V.mode === 'pos' && !ended && Math.abs(x) > 6) ended = true;
          x = clamp(x, -12, 12);
          tm += dts; buf.push(x);
          if (buf.length > 400) buf.splice(0, buf.length - 400);
          pulse += dts;
        }
        hist.push([tm, 37 + x]);
        if (hist.length > 2 && hist[0][0] < tm - 120) hist = hist.filter(h => h[0] > tm - 120);
      }
      analyse();
      function draw(dt) {
        step(Math.min(dt || 0, 0.05) * 2);           // 2 minutes per second
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const top = H * 0.46;
        // the loop diagram
        const bw = Math.min(150, W * 0.22), bh = 40, cx = W / 2, cy = top / 2 + 4, rx = Math.min(W * 0.3, 250), ry = top / 2 - 30;
        const boxes = [
          { id: 'var', x: cx, y: cy - ry, t1: 'Core temperature', t2: (37 + x).toFixed(2) + ' °C' },
          { id: 'sen', x: cx + rx, y: cy, t1: 'Sensors', t2: 'skin, blood, brain' },
          { id: 'ctl', x: cx, y: cy + ry, t1: 'Control centre', t2: 'set point 37 °C' },
          { id: 'eff', x: cx - rx, y: cy, t1: 'Effectors', t2: ended ? 'switched off' : V.mode === 'none' ? 'disconnected' : u > 0.05 ? 'sweating, skin flushed' : u < -0.05 ? 'shivering, skin pale' : 'resting' }
        ];
        // anchors: variable (top) → sensors (right) → control centre (bottom) → effectors (left) → variable
        const [bV, bS, bC, bE] = boxes;
        const links = [
          [bV.x + bw / 2, bV.y, bS.x, bS.y - bh / 2],
          [bS.x, bS.y + bh / 2, bC.x + bw / 2, bC.y],
          [bC.x - bw / 2, bC.y, bE.x, bE.y + bh / 2],
          [bE.x, bE.y - bh / 2, bV.x - bw / 2, bV.y]
        ];
        links.forEach(([x1, y1, x2, y2], i) => {
          const cut = V.mode === 'none' && i === 2;
          if (cut) { c.setLineDash([4, 5]); c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.setLineDash([]); kit.label(c, '✂ cut', (x1 + x2) / 2 - 10, (y1 + y2) / 2, { size: 11, color: C.bad }); return; }
          kit.arrow(c, x1, y1, x2, y2, i === 3 && V.mode === 'pos' ? C.bad : C.text2, 1.8);
          const f = (pulse * 0.35 + i * 0.25) % 1;
          kit.dot(c, lerp(x1, x2, f), lerp(y1, y2, f), 3, C.accent);
        });
        kit.label(c, 'delay ' + V.delay.toFixed(1) + ' min', (bS.x + bC.x) / 2 + 30, (bS.y + bC.y) / 2 + 10, { size: 11, color: C.warn, weight: 600 });
        kit.label(c, V.mode === 'pos' ? 'response adds to the change' : V.mode === 'neg' ? 'response opposes the change' : '', (bE.x + bV.x) / 2 - 24, (bE.y + bV.y) / 2 - 8, { size: 11, color: V.mode === 'pos' ? C.bad : C.ok, align: 'right' });
        for (const bx of boxes) {
          rrect(c, bx.x - bw / 2, bx.y - bh / 2, bw, bh, 8);
          c.fillStyle = C.surface; c.fill(); c.strokeStyle = bx.id === 'var' ? C.accent : C.border2; c.lineWidth = 1.5; c.stroke();
          kit.label(c, bx.t1, bx.x, bx.y - 8, { size: 11.5, weight: 650, align: 'center' });
          kit.label(c, bx.t2, bx.x, bx.y + 9, { size: 10.5, color: C.muted, align: 'center' });
        }
        // the disturbance arrow into the variable
        const dNow = (V.on ? V.D : 0) + (tm < kickUntil ? 3 : 0);
        if (Math.abs(dNow) > 0.01) {
          kit.arrow(c, cx + bw / 2 + 70, cy - ry - 26, cx + bw / 2 + 4, cy - ry - 6, C.warn, 2.2);
          kit.label(c, 'disturbance ' + (dNow > 0 ? '+' : '') + dNow.toFixed(1) + ' °C', cx + bw / 2 + 74, cy - ry - 30, { size: 11, color: C.warn });
        }
        if (ended) kit.label(c, 'End point reached: the loop has switched itself off', cx, top - 4, { size: 12, weight: 650, color: C.bad, align: 'center' });
        // the chart
        const ch = { x: 50, y: top + 14, w: W - 66, h: H - top - 40 };
        const ss = V.mode === 'neg' ? V.D / (1 + V.G) : V.mode === 'none' ? V.D : null;
        chart(c, kit, C, ch, {
          xmin: Math.max(0, tm - 120), xmax: Math.max(120, tm), ymin: 31, ymax: 43, ystep: 2,
          series: [{ pts: hist, color: C.accent, width: 2.2 }],
          hlines: [{ y: 37, color: C.ok, label: 'set point' }].concat(V.on && ss != null ? [{ y: 37 + ss, color: C.warn, label: 'predicted steady state' }] : []),
          xlabel: 'time (minutes)', ylabel: 'core temperature (°C)'
        });
        ro.set('temp', (37 + x).toFixed(2) + ' °C');
        ro.set('err', (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(2) + ' °C');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5. FLUID COMPARTMENTS */
  const PEOPLE = { man: ['Adult man, 70 kg (60 % water)', 70, 0.6], woman: ['Adult woman, 60 kg (50 % water)', 60, 0.5], older: ['Older adult, 60 kg (45 % water)', 60, 0.45], child: ['Child, 20 kg (65 % water)', 20, 0.65] };
  const DOSES = {
    saline: { label: '1 L of 0.9 % saline, into a vein', vol: 1, salt: 286.4, iv: true },
    glucose: { label: '1 L of 5 % glucose, into a vein', vol: 1, glu: 278, iv: true },
    water: { label: 'Drink 1 L of water', vol: 1 },
    albumin: { label: '500 mL of 5 % albumin, into a vein', vol: 0.5, salt: 145, held: 0.5, iv: true },
    hyper: { label: '250 mL of 3 % saline, into a vein', vol: 0.25, salt: 238.7, iv: true },
    sweat: { label: 'Lose 1 L of sweat', vol: -1, salt: -74.4 },
    diarrhoea: { label: 'Lose 1 L of watery diarrhoea', vol: -1, salt: -290 },
    blood: { label: 'Lose 500 mL of blood', vol: -0.275, salt: -79.75, bleed: 0.275 }
  };
  Hyper.sim('fnd-fluids', {
    title: 'Where does the water go?',
    blurb: `The body's water in three compartments, drawn to scale: inside cells, the tissue fluid between cells, and the plasma in the blood vessels. Choose a fluid to give (or a loss) and press **Give it**; press again to repeat. The shifts that take minutes to hours are sped up.

- Compare **1 L of saline** with **1 L of 5 % glucose**: about 250 mL against about 80 mL stays in the plasma.
- **3 % saline** is small in volume but pulls water *out of cells* — why it is used for dangerous brain swelling.
- **Drink water** several times and watch the sodium fall; **sweat** and it rises. **Diarrhoea** takes fluid only from outside the cells — why cholera empties the circulation so fast.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'person', type: 'select', label: 'Person', options: Object.keys(PEOPLE).map(k => [PEOPLE[k][0], k]), value: 'man' },
        { id: 'give', type: 'select', label: 'Fluid in or out', options: Object.keys(DOSES).map(k => [DOSES[k].label, k]), value: DOSES[params && params.give] ? params.give : 'saline' },
        { type: 'buttons', items: [{ id: 'go', label: 'Give it', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'go') apply(V.give);
        else if (id === 'reset' || id === 'person') init();
      });
      const ro = kit.readout(box.side, [['na', 'Plasma sodium (estimate)'], ['osm', 'Osmolality'], ['icf', 'Inside cells'], ['is', 'Tissue fluid'], ['pl', 'Plasma'], ['last', 'Where the last one went']]);
      const V = ctl.values;
      let S, base, disp, t = 0, last = '—', drip = 0, dripKind = '';
      function init() {
        const pp = PEOPLE[V.person] || PEOPLE.man, tbw = pp[1] * pp[2];
        S = { tbw, osmI: 290 * tbw * 2 / 3, osmE: 290 * tbw / 3, glu: 0, held: 0, def: 0 };
        base = targets(S);
        disp = { icf: base.icf, is: base.is, pl: base.pl };
        last = '—';
      }
      function targets(s) {
        const osm = (s.osmI + s.osmE + s.glu) / s.tbw, icf = s.osmI / osm, ecf = s.tbw - icf;
        const pl = (ecf - s.held) / 4 + s.held - s.def, is = ecf - pl;
        return { osm, icf, ecf, pl, is, tbw: s.tbw, na: 140 * (s.osmE / ecf) / 290 };
      }
      function apply(k) {
        const d = DOSES[k];
        if (!d) return;
        const before = targets(Object.assign({}, S, { glu: 0, def: 0 }));
        const n = Object.assign({}, S);
        n.tbw += d.vol; n.osmE += d.salt || 0; n.held += d.held || 0;
        if (d.glu) n.glu += d.glu * d.vol;
        if (d.bleed) n.def += 0.75 * d.bleed;
        const test = targets(n);
        if (test.ecf < 0.55 * base.ecf || test.pl < 0.5 * base.pl || test.na < 115 || test.na > 165 || n.tbw > 1.3 * base.tbw) { last = 'Stopped: going further would be life-threatening. Press Start again.'; report(); return; }
        S = n;
        const after = targets(Object.assign({}, S, { glu: 0, def: 0 }));
        const dI = after.icf - before.icf, dS = after.is - before.is, dP = after.pl - before.pl;
        const mL = v => (v >= 0 ? '+' : '−') + Math.round(Math.abs(v) * 1000) + ' mL';
        last = d.label + ': once settled, plasma ' + mL(dP) + ', tissue fluid ' + mL(dS) + ', cells ' + mL(dI) + '.';
        // where the fluid arrives first: a drip into the plasma, a drink half-way, losses from the tissue fluid (blood from the plasma)
        if (d.iv) { disp.pl += d.vol; dripKind = 'iv'; }
        else if (d.vol > 0) { disp.pl += d.vol * 0.5; dripKind = 'drink'; }
        else { dripKind = k === 'blood' ? 'blood' : 'loss'; if (k === 'blood') disp.pl += d.vol; }
        drip = 1;
        disp.is = S.tbw - disp.icf - disp.pl;
        report();
      }
      function report() {
        const T = targets(S);
        const L = v => v.toFixed(2) + ' L';
        const dv = (v, b0) => { const x = v - b0; return Math.abs(x) < 0.005 ? '' : ' (' + (x > 0 ? '+' : '−') + Math.abs(x).toFixed(2) + ')'; };
        ro.set('na', T.na.toFixed(1) + ' mmol/L' + (T.na < 135 ? ' — low' : T.na > 145 ? ' — high' : ''));
        ro.set('osm', Math.round(T.osm) + ' mOsm/kg');
        ro.set('icf', L(disp.icf) + dv(disp.icf, base.icf));
        ro.set('is', L(disp.is) + dv(disp.is, base.is));
        ro.set('pl', L(disp.pl) + dv(disp.pl, base.pl));
        ro.set('last', last);
      }
      init();
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05); t += dt;
        // glucose is burned and lost blood is refilled from the tissues, over "hours" (seconds here)
        S.glu *= Math.exp(-dt / 2.5); if (S.glu < 0.5) S.glu = 0;
        S.def *= Math.exp(-dt / 4); if (S.def < 0.001) S.def = 0;
        const T = targets(S);
        disp.pl += (T.pl - disp.pl) * (1 - Math.exp(-dt / 0.7));
        disp.icf += (T.icf - disp.icf) * (1 - Math.exp(-dt / 1.6));
        disp.is = Math.max(0.1, S.tbw - disp.icf - disp.pl);           // water is conserved while it moves
        drip = Math.max(0, drip - dt / 1.5);
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const yB = H - 46, maxL = base.icf * 1.35, hs = (yB - 70) / maxL;     // px per litre
        const cols = [
          { key: 'icf', name: 'inside cells', v: disp.icf, b: base.icf, hue: 275, ion: 'K⁺' },
          { key: 'is', name: 'tissue fluid', v: disp.is, b: base.is, hue: 28, ion: 'Na⁺' },
          { key: 'pl', name: 'plasma', v: disp.pl, b: base.pl, hue: 355, ion: 'Na⁺, albumin' }
        ];
        const gap = W * 0.06, cw = (W - 2 * gap - 60) / 3;
        cols.forEach((col, i) => {
          const x = 30 + i * (cw + gap), h = Math.max(2, col.v * hs), hb = col.b * hs;
          c.fillStyle = C.surface; c.fillRect(x, yB - maxL * hs, cw, maxL * hs);
          c.fillStyle = kit.hue(col.hue, 0.28); c.fillRect(x, yB - h, cw, h);
          c.strokeStyle = kit.hue(col.hue); c.lineWidth = 2; c.beginPath();
          for (let k = 0; k <= 30; k++) { const xx = x + k / 30 * cw, yy = yB - h + Math.sin(k * 0.6 + t * 3) * 1.5; if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); }
          c.stroke();
          c.strokeStyle = C.border2; c.lineWidth = 1.5; c.strokeRect(x, yB - maxL * hs, cw, maxL * hs);
          c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x, yB - hb); c.lineTo(x + cw, yB - hb); c.stroke(); c.setLineDash([]);
          kit.label(c, col.name, x + cw / 2, yB + 14, { size: 12, weight: 650, align: 'center' });
          kit.label(c, col.v.toFixed(2) + ' L', x + cw / 2, yB + 30, { size: 11.5, color: C.text2, align: 'center' });
          const dlt = col.v - col.b;
          if (Math.abs(dlt) > 0.005) kit.label(c, (dlt > 0 ? '+' : '−') + Math.round(Math.abs(dlt) * 1000) + ' mL', x + cw / 2, yB - h - 12, { size: 11.5, weight: 650, color: dlt > 0 ? C.ok : C.bad, align: 'center' });
          kit.label(c, col.ion, x + 6, yB - 10, { size: 10, color: kit.hue(col.hue) });
          if (col.key === 'pl' && S.held > 0.001) for (let k = 0; k < 6; k++) kit.dot(c, x + cw * (0.2 + 0.12 * k), yB - h * 0.5 + Math.sin(t + k) * 4, 4, kit.hue(215, 0.8));
        });
        // the walls between compartments
        const wx1 = 30 + cw + gap / 2, wx2 = 30 + 2 * cw + 1.5 * gap;
        c.strokeStyle = kit.hue(40); c.lineWidth = 3; c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(wx1, yB); c.lineTo(wx1, yB - maxL * hs * 0.8); c.stroke();
        c.strokeStyle = kit.hue(355, 0.6);
        c.beginPath(); c.moveTo(wx2, yB); c.lineTo(wx2, yB - maxL * hs * 0.8); c.stroke(); c.setLineDash([]);
        kit.label(c, 'cell membranes:', wx1, 16, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'water passes, sodium is pumped out', wx1, 30, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'capillary walls:', wx2, 46, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'salt water passes, proteins stay', wx2, 60, { size: 10.5, color: C.muted, align: 'center' });
        // the dose arriving
        if (drip > 0) {
          const x = 30 + 2 * (cw + gap) + cw / 2, y = yB - maxL * hs + 18;
          c.globalAlpha = drip;
          if (dripKind === 'iv') { rrect(c, x - 12, y - 16, 24, 28, 5); c.fillStyle = kit.hue(205, 0.35); c.fill(); c.strokeStyle = kit.hue(205); c.stroke(); kit.arrow(c, x, y + 14, x, y + 40, kit.hue(205), 2); kit.label(c, 'into a vein', x + 18, y, { size: 10.5, color: kit.hue(205) }); }
          else if (dripKind === 'drink') { kit.arrow(c, x, y - 8, x, y + 36, kit.hue(205), 2.5); kit.label(c, 'absorbed from the gut', x + 8, y - 4, { size: 10.5, color: kit.hue(205) }); }
          else { kit.arrow(c, x, y + 36, x, y - 8, C.bad, 2.5); kit.label(c, dripKind === 'blood' ? 'blood lost' : 'fluid lost', x + 8, y - 4, { size: 10.5, color: C.bad }); }
          c.globalAlpha = 1;
        }
        kit.label(c, 'dashed line: at the start', W - 12, H - 8, { size: 10, color: C.muted, align: 'right' });
        report();
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6. ACID–BASE */
  const AB = {
    normal: { label: 'Normal', p: [40, 24], c: [40, 24], note: 'pH 7.40: bicarbonate 24 mmol/L and PaCO₂ 40 mmHg, a ratio of 20 to 1.' },
    dka: { label: 'Diabetic ketoacidosis', p: [40, 8], c: [20, 8], note: 'Ketoacids use up bicarbonate. Deep, fast breathing (Kussmaul) lowers CO₂ to about 1.5 × HCO₃ + 8.' },
    diarrhoea: { label: 'Severe diarrhoea', p: [40, 15], c: [30.5, 15], note: 'Bicarbonate is lost in the stool: a normal-anion-gap metabolic acidosis, with breathing compensating.' },
    vomit: { label: 'Prolonged vomiting', p: [40, 34], c: [47, 34], note: 'Loss of stomach acid leaves bicarbonate behind; breathing slows a little to hold CO₂ (about +0.7 per mmol/L).' },
    opioid: { label: 'Opioid overdose (minutes)', p: [70, 24], c: [70, 27], note: 'Breathing is suppressed, CO₂ builds up. Only a small rise in bicarbonate from buffering: dangerous acidaemia.' },
    copd: { label: 'Severe COPD (for years)', p: [60, 24], c: [60, 31], note: 'Over days the kidneys keep bicarbonate (about +3.5 per 10 mmHg of CO₂), bringing pH close to normal.' },
    panic: { label: 'Panic attack (minutes)', p: [25, 24], c: [25, 21], note: 'Over-breathing washes out CO₂. The alkaline blood lowers ionised calcium: tingling lips and fingers.' },
    altitude: { label: 'High altitude (after days)', p: [30, 24], c: [30, 19.5], note: 'Low oxygen drives breathing and lowers CO₂; over days the kidneys shed bicarbonate (about −4.5 per 10 mmHg).' }
  };
  function classify(P, Hc) {
    const pH = 6.1 + Math.log10(Hc / (0.03 * P));
    const out = { pH, status: pH < 7.35 ? 'acidaemia' : pH > 7.45 ? 'alkalaemia' : 'normal pH', primary: '—', comp: '—' };
    const wBand = (meas, exp, tol, hiTxt, loTxt, okTxt) => (meas > exp + tol ? hiTxt : meas < exp - tol ? loTxt : okTxt);
    if (pH < 7.35) {
      if (Hc < 22 && P <= 45) {
        out.primary = 'metabolic acidosis';
        const e = 1.5 * Hc + 8;
        out.comp = 'expected PaCO₂ ' + e.toFixed(0) + ' ± 2: ' + wBand(P, e, 2, 'CO₂ higher than expected — breathing has not compensated yet, or a respiratory acidosis as well', 'CO₂ lower than expected — a respiratory alkalosis as well', 'appropriate breathing compensation');
      } else if (P > 45 && Hc >= 22) {
        out.primary = 'respiratory acidosis';
        const a = 24 + (P - 40) / 10, ch = 24 + 3.5 * (P - 40) / 10;
        out.comp = Hc > ch + 2 ? 'bicarbonate higher than compensation explains (also a metabolic alkalosis)' : Hc >= ch - 2 ? 'chronic: kidneys have compensated (expected HCO₃ ≈ ' + ch.toFixed(0) + ')' : Hc <= a + 2 ? 'acute: little compensation yet (expected HCO₃ ≈ ' + a.toFixed(0) + ')' : 'partly compensated (acute ≈ ' + a.toFixed(0) + ', chronic ≈ ' + ch.toFixed(0) + ')';
      } else if (P > 45 && Hc < 22) { out.primary = 'mixed respiratory and metabolic acidosis'; out.comp = 'no compensation possible: both systems are failing'; }
      else { out.primary = 'metabolic acidosis'; out.comp = '—'; }
    } else if (pH > 7.45) {
      if (Hc > 26 && P >= 35) {
        out.primary = 'metabolic alkalosis';
        const e = 40 + 0.7 * (Hc - 24);
        out.comp = 'expected PaCO₂ ≈ ' + e.toFixed(0) + ' ± 5: ' + wBand(P, e, 5, 'CO₂ higher than expected — a respiratory acidosis as well', 'CO₂ lower than expected — breathing has not compensated yet, or a respiratory alkalosis as well', 'appropriate compensation');
      } else if (P < 35 && Hc <= 26) {
        out.primary = 'respiratory alkalosis';
        const a = 24 - 2 * (40 - P) / 10, ch = 24 - 4.5 * (40 - P) / 10;
        out.comp = Hc < ch - 2 ? 'bicarbonate lower than compensation explains (also a metabolic acidosis)' : Hc <= ch + 2 ? 'chronic: kidneys have compensated (expected HCO₃ ≈ ' + ch.toFixed(0) + ')' : Hc >= a - 2 ? 'acute: little compensation yet (expected HCO₃ ≈ ' + a.toFixed(0) + ')' : 'partly compensated';
      } else if (P < 35 && Hc > 26) { out.primary = 'mixed respiratory and metabolic alkalosis'; out.comp = 'both push pH up'; }
      else { out.primary = 'metabolic alkalosis'; }
    } else {
      if (P >= 35 && P <= 45 && Hc >= 22 && Hc <= 26) { out.primary = 'none'; out.comp = 'normal acid–base status'; }
      else if (P < 35 && Hc < 22) {
        out.primary = pH >= 7.40 ? 'probably respiratory alkalosis (chronic)' : 'probably metabolic acidosis';
        out.comp = pH >= 7.40 ? 'fully compensated by the kidneys over days — or a mixed disorder' : 'unusually complete compensation: suspect a mixed disorder';
      } else if (P > 45 && Hc > 26) {
        out.primary = pH < 7.40 ? 'probably respiratory acidosis (chronic)' : 'probably metabolic alkalosis';
        out.comp = pH < 7.40 ? 'well compensated: the kidneys have kept bicarbonate over days — or a mixed disorder' : 'breathing has slowed to hold CO₂ — or a mixed disorder';
      } else { out.primary = 'abnormal values with a normal pH'; out.comp = 'suggests a mixed disorder'; }
    }
    return out;
  }
  Hyper.sim('fnd-acid-base', {
    title: 'Acid–base: the pH–bicarbonate diagram',
    blurb: `Each curve is one carbon dioxide pressure (PaCO₂); the dot is the blood, placed by the Henderson–Hasselbalch equation, pH = 6.1 + log(HCO₃⁻ / 0.03 PaCO₂). The green box is normal. **Drag the dot**, use the sliders, or pick a condition and compare it *before* and *after* compensation.

- The **lungs** move the dot across the curves by changing PaCO₂, within minutes; the **kidneys** move it along a curve by changing bicarbonate, over days.
- Diabetic ketoacidosis: bicarbonate collapses, and deep breathing drags the pH part of the way back.
- Opioid overdose versus COPD: the same CO₂, but only the chronic case has had time for the kidneys to compensate.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330 });
      const pr0 = AB[params && params.preset] ? params.preset : 'normal';
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Condition', options: Object.keys(AB).map(k => [AB[k].label, k]).concat([['Your own values', 'custom']]), value: pr0 },
        { id: 'P', label: 'PaCO₂ (carbon dioxide)', min: 10, max: 100, step: 0.5, value: AB[pr0].c[0], unit: 'mmHg' },
        { id: 'H', label: 'Bicarbonate', min: 4, max: 50, step: 0.5, value: AB[pr0].c[1], unit: 'mmol/L' },
        { type: 'buttons', items: [{ id: 'before', label: 'Before compensation' }, { id: 'after', label: 'After compensation', primary: true }] }
      ], (id, v) => {
        if (id === 'preset') { const a = AB[v]; if (a) { cur = a.p.slice(); goal = a.c.slice(); setSliders(); } }
        else if (id === 'before' || id === 'after') { const a = AB[V.preset]; if (a) goal = (id === 'before' ? a.p : a.c).slice(); }
        else if (id === 'P' || id === 'H') { cur = [V.P, V.H]; goal = null; ctl.set('preset', 'custom'); }
      });
      const ro = kit.readout(box.side, [['ph', 'pH'], ['h', 'Hydrogen ions'], ['co2', 'PaCO₂'], ['hco3', 'Bicarbonate'], ['status', 'Status'], ['primary', 'Primary disorder'], ['comp', 'Compensation'], ['note', 'What is happening']]);
      const V = ctl.values;
      let cur = AB[pr0].c.slice(), goal = null;
      function setSliders() { ctl.set('P', +cur[0].toFixed(1)); ctl.set('H', +cur[1].toFixed(1)); }
      const pHmin = 6.9, pHmax = 7.8, Hmax = 50;
      let lay = null;
      function layout() {
        const W = st.W, H = st.H, x0 = 52, x1 = W - 16, y0 = 16, y1 = H - 40;
        return { W, H, x0, x1, y0, y1, X: ph => x0 + (ph - pHmin) / (pHmax - pHmin) * (x1 - x0), Y: h => y1 - h / Hmax * (y1 - y0), iX: x => pHmin + (x - x0) / (x1 - x0) * (pHmax - pHmin), iY: y => (y1 - y) / (y1 - y0) * Hmax };
      }
      const phOf = (P, Hc) => 6.1 + Math.log10(Hc / (0.03 * P));
      kit.drag(st, {
        hit(p) { const L = layout(); const ph = phOf(cur[0], cur[1]); return Math.hypot(p.x - L.X(ph), p.y - L.Y(cur[1])) < 16 ? 'pt' : null; },
        move(k, p) {
          const L = layout();
          const ph = clamp(L.iX(p.x), pHmin, pHmax), Hc = clamp(L.iY(p.y), 4, 50);
          const P = clamp(Hc / (0.03 * Math.pow(10, ph - 6.1)), 10, 100);
          cur = [P, Hc]; goal = null; setSliders(); ctl.set('preset', 'custom');
        },
        hover: true
      });
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        if (goal) {
          const k = 1 - Math.exp(-dt / 0.45);
          cur = [Math.exp(lerp(Math.log(cur[0]), Math.log(goal[0]), k)), lerp(cur[1], goal[1], k)];
          if (Math.abs(cur[0] - goal[0]) < 0.05 && Math.abs(cur[1] - goal[1]) < 0.02) { cur = goal.slice(); goal = null; }
          setSliders();
        }
        const C = kit.colors(), c = st.begin(), L = layout();
        lay = L;
        // acidaemia / alkalaemia bands and the normal box
        c.fillStyle = kit.hue(355, 0.06); c.fillRect(L.x0, L.y0, L.X(7.35) - L.x0, L.y1 - L.y0);
        c.fillStyle = kit.hue(215, 0.06); c.fillRect(L.X(7.45), L.y0, L.x1 - L.X(7.45), L.y1 - L.y0);
        c.fillStyle = kit.hue(145, 0.22); c.fillRect(L.X(7.35), L.Y(26), L.X(7.45) - L.X(7.35), L.Y(22) - L.Y(26));
        kit.label(c, 'acidaemia', L.X(7.0), L.y0 + 12, { size: 11.5, color: kit.hue(355), align: 'center', weight: 600 });
        kit.label(c, 'alkalaemia', L.X(7.65), L.y0 + 12, { size: 11.5, color: kit.hue(215), align: 'center', weight: 600 });
        // axes and grid
        c.strokeStyle = C.grid; c.lineWidth = 1; c.font = '10px system-ui, sans-serif'; c.fillStyle = C.muted;
        c.textAlign = 'center'; c.textBaseline = 'top';
        for (let ph = 6.9; ph <= 7.8001; ph += 0.1) { c.beginPath(); c.moveTo(L.X(ph), L.y0); c.lineTo(L.X(ph), L.y1); c.stroke(); c.fillText(ph.toFixed(1), L.X(ph), L.y1 + 4); }
        c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let h = 0; h <= 50; h += 10) { c.beginPath(); c.moveTo(L.x0, L.Y(h)); c.lineTo(L.x1, L.Y(h)); c.stroke(); c.fillText(String(h), L.x0 - 5, L.Y(h)); }
        c.strokeStyle = C.axis; c.strokeRect(L.x0, L.y0, L.x1 - L.x0, L.y1 - L.y0);
        kit.label(c, 'pH', (L.x0 + L.x1) / 2, L.y1 + 26, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'HCO₃⁻ (mmol/L)', L.x0 + 4, L.y0 + 30, { size: 10.5, color: C.muted });
        // PaCO2 isobars
        for (const P of [20, 30, 40, 60, 80, 100]) {
          c.strokeStyle = P === 40 ? C.text2 : C.faint; c.lineWidth = P === 40 ? 1.6 : 1.1; c.beginPath();
          let started = false, lx = 0, ly = 0;
          for (let ph = pHmin; ph <= pHmax + 1e-9; ph += 0.005) {
            const h = 0.03 * P * Math.pow(10, ph - 6.1);
            if (h > Hmax) break;
            const x = L.X(ph), y = L.Y(h);
            if (started) c.lineTo(x, y); else { c.moveTo(x, y); started = true; }
            lx = x; ly = y;
          }
          c.stroke();
          kit.label(c, P + ' mmHg', Math.min(lx, L.x1 - 4), Math.max(ly, L.y0 + 30) - 8, { size: 10, color: C.muted, align: 'right' });
        }
        // hint arrows: lungs and kidneys
        const ph = phOf(cur[0], cur[1]), px = L.X(clamp(ph, pHmin, pHmax)), py = L.Y(cur[1]);
        c.globalAlpha = 0.55;
        kit.arrow(c, px, py, px + 34, py, kit.hue(200), 1.5); kit.arrow(c, px, py, px - 34, py, kit.hue(200), 1.5);
        const along = dh => { const h2 = clamp(cur[1] + dh, 1, Hmax); return [L.X(clamp(phOf(cur[0], h2), pHmin, pHmax)), L.Y(h2)]; };
        const up = along(6), dn = along(-6);
        kit.arrow(c, px, py, up[0], up[1], kit.hue(40), 1.5); kit.arrow(c, px, py, dn[0], dn[1], kit.hue(40), 1.5);
        c.globalAlpha = 1;
        kit.label(c, 'lungs (PaCO₂)', px + 38, py - 1, { size: 10, color: kit.hue(200) });
        kit.label(c, 'kidneys (HCO₃⁻)', up[0] + 6, up[1] - 6, { size: 10, color: kit.hue(40) });
        // the preset's path: primary -> compensated
        const a = AB[V.preset];
        if (a) {
          const p1 = [L.X(clamp(phOf(a.p[0], a.p[1]), pHmin, pHmax)), L.Y(a.p[1])], p2 = [L.X(clamp(phOf(a.c[0], a.c[1]), pHmin, pHmax)), L.Y(a.c[1])];
          if (Math.hypot(p1[0] - p2[0], p1[1] - p2[1]) > 4) {
            kit.dot(c, p1[0], p1[1], 4, C.faint);
            c.setLineDash([4, 4]); kit.arrow(c, p1[0], p1[1], p2[0], p2[1], C.muted, 1.2); c.setLineDash([]);
            kit.label(c, 'before', p1[0] + 6, p1[1] + 10, { size: 10, color: C.muted });
          }
        }
        kit.dot(c, px, py, 8, C.accent, C.bg2);
        kit.label(c, 'pH ' + ph.toFixed(2), px + 12, py - 14, { size: 12, weight: 700, color: C.accent });
        // readouts
        const cl = classify(cur[0], cur[1]);
        ro.set('ph', ph.toFixed(2));
        ro.set('h', (24 * cur[0] / cur[1]).toFixed(0) + ' nmol/L');
        ro.set('co2', cur[0].toFixed(0) + ' mmHg (' + (cur[0] * 0.13332).toFixed(1) + ' kPa)');
        ro.set('hco3', cur[1].toFixed(1) + ' mmol/L');
        ro.set('status', cl.status);
        ro.set('primary', cl.primary);
        ro.set('comp', cl.comp);
        ro.set('note', a ? a.note : 'Your own values. Normal: pH 7.35–7.45, PaCO₂ 35–45 mmHg, HCO₃⁻ 22–26 mmol/L (ranges vary by laboratory).');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7. HEAT BALANCE AND FEVER */
  const HEAT = {
    rest: { label: 'Resting indoors', M: 100, Ta: 22, rh: 50, v: 0.2, clo: 0.6, Tset: 37 },
    run: { label: 'Running on a warm day', M: 800, Ta: 24, rh: 50, v: 3, clo: 0.3, Tset: 37 },
    heatwave: { label: 'Hard work in a humid heatwave', M: 600, Ta: 34, rh: 70, v: 0.5, clo: 0.5, Tset: 37 },
    hotdry: { label: 'Resting in dry desert heat', M: 110, Ta: 42, rh: 15, v: 1, clo: 0.3, Tset: 37 },
    fever: { label: 'Fever: set point raised to 39.5 °C', M: 100, Ta: 22, rh: 50, v: 0.2, clo: 0.6, Tset: 39.5 },
    cold: { label: 'Cold, wet and windy', M: 100, Ta: 5, rh: 85, v: 5, clo: 0.5, Tset: 37 }
  };
  const psat = T => 0.61078 * Math.exp(17.27 * T / (T + 237.3));   // saturated vapour pressure, kPa
  Hyper.sim('fnd-heat-balance', {
    title: 'Heat balance, sweating and fever',
    blurb: `A single "core" whose temperature follows the heat made by metabolism and the heat lost from the skin by radiation and convection, evaporation of sweat and breathing. The brain compares the core with the **set point**: above it, skin vessels open and sweating starts; below it, vessels close and shivering begins. Time runs at about two minutes per second.

- **Running on a warm day**: sweat evaporation balances most of 800 W and the core settles near 38.5–39 °C.
- **Hard work in a humid heatwave**: sweat cannot evaporate fast enough — watch the core pass 40 °C (heatstroke). Then add wind or lower the humidity.
- **Fever**: the set point jumps to 39.5 °C, so the body shivers and the skin cools while the core climbs. Lower the set point back to 37 °C — the fever "breaks" with sweating and flushing.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const p0 = HEAT[params && params.preset] ? params.preset : 'rest', H0 = HEAT[p0];
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Situation', options: Object.keys(HEAT).map(k => [HEAT[k].label, k]).concat([['Your own settings', 'custom']]), value: p0 },
        { id: 'M', label: 'Heat made by the body (activity)', min: 70, max: 1200, value: H0.M, log: true, sig: 2, unit: 'W' },
        { id: 'Ta', label: 'Air temperature', min: -10, max: 45, step: 1, value: H0.Ta, unit: '°C' },
        { id: 'rh', label: 'Humidity', min: 5, max: 100, step: 1, value: H0.rh, unit: '%' },
        { id: 'v', label: 'Wind (or running speed)', min: 0, max: 10, step: 0.1, value: H0.v, unit: 'm/s' },
        { id: 'clo', label: 'Clothing (clo)', min: 0, max: 2.5, step: 0.1, value: H0.clo },
        { id: 'Tset', label: 'Set point (raised in fever)', min: 36.5, max: 41, step: 0.1, value: H0.Tset, unit: '°C' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again at 37 °C', primary: true }] }
      ], (id, v) => {
        if (id === 'preset') { const P = HEAT[v]; if (P) { for (const k of ['M', 'Ta', 'rh', 'v', 'clo', 'Tset']) ctl.set(k, P[k]); reset(); } }
        else if (id === 'reset') reset();
        else ctl.set('preset', 'custom');
      });
      const ro = kit.readout(box.side, [['core', 'Core temperature'], ['skin', 'Skin temperature'], ['made', 'Heat made'], ['dry', 'Radiation and convection'], ['evap', 'Evaporation of sweat'], ['sweat', 'Sweat'], ['state', 'What is happening']]);
      const V = ctl.values, A = 1.8, Cap = 70 * 3470;
      let Tc = 37, tm = 0, hist = [], F = {}, t = 0;
      function reset() { Tc = 37; tm = 0; hist = []; }
      function fluxes() {
        const e = Tc - V.Tset;
        const K = clamp(12 + 45 * e, 5, 60);                      // core-to-skin conductance: skin blood flow
        const Msh = clamp(250 * (-e - 0.1), 0, 450);                // shivering
        const Sw = clamp(400 * e, 0, 1100);                         // sweat drive, W if all of it evaporated
        const hc = Math.max(3.1, 8.3 * Math.pow(Math.max(V.v, 0.01), 0.6)), hr = 4.7, Rcl = 0.155 * V.clo;
        const U = 1 / (Rcl + 1 / (hc + hr));
        const he = 1 / (Rcl / (0.38 * 16.5) + 1 / (16.5 * hc));
        const Pa = V.rh / 100 * psat(V.Ta), Mt = V.M + Msh;
        const Res = 0.0014 * Mt * (34 - V.Ta) + 0.0173 * Mt * (5.87 - Pa);
        let Tsk = 33, E = 0, Emax = 0;
        for (let k = 0; k < 6; k++) {
          Emax = A * he * (psat(Tsk) - Pa);
          const w = Emax > 0 ? clamp(Sw / Emax, 0.06, 1) : 0;
          E = Math.max(0, w * Emax);
          Tsk = (K * Tc + U * V.Ta - E / A) / (K + U);
        }
        return { e, K, Msh, Sw, E, Emax: Math.max(0, Emax), Tsk, dry: U * A * (Tsk - V.Ta), Res, core: K * A * (Tc - Tsk), Mt };
      }
      function step(dt) {
        for (let s = 0; s < dt; s += 1) {                              // 1-second steps of body time
          F = fluxes();
          Tc = clamp(Tc + (F.Mt - F.Res - F.core) / Cap, 25, 45);
          tm += 1;
        }
        if (!hist.length || tm - hist[hist.length - 1][0] * 60 >= 20) hist.push([tm / 60, Tc]);
        if (hist.length > 2 && hist[0][0] < tm / 60 - 120) hist.shift();
      }
      function stateText() {
        if (Tc >= 40) return 'heatstroke range — an emergency: cool immediately';
        if (Tc < 35) return 'hypothermia';
        const fever = V.Tset > 37.8;
        if (fever && F.e < -0.3) return 'fever rising: feels cold, shivers, pale cold skin';
        if (fever && Math.abs(F.e) <= 0.3) return 'fever at its new set point: no longer shivering';
        if (F.e > 0.3 && Tc > 37.8 && V.M < 200 && V.Ta < 30) return 'warmer than the set point: flushed and sweating — as when a fever breaks';
        if (F.e > 0.3 && F.Sw > F.Emax * 1.05 && F.Sw > 150) return 'hot: sweating hard, but some sweat drips off unevaporated';
        if (F.e > 0.3) return 'warm for the set point: skin flushed, sweating';
        if (F.e < -0.3) return 'cold: skin vessels closed, shivering';
        return 'comfortable: heat made and lost are in balance';
      }
      F = fluxes();
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05); t += dt;
        step(dt * 120);                                              // 2 minutes of body time per second
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const hot = (T, lo, hi) => kit.hue(lerp(220, 0, clamp((T - lo) / (hi - lo), 0, 1)), 0.55);
        // the figure
        const fx = W * 0.2, fy = H * 0.46, s = Math.min(H / 300, W / 520);
        const jit = F.Msh > 20 ? Math.sin(t * 60) * 1.2 * Math.min(1, F.Msh / 200) : 0;
        c.save(); c.translate(fx + jit, fy);
        c.fillStyle = hot(F.Tsk, 20, 37); c.strokeStyle = C.text2; c.lineWidth = 1.5;
        c.beginPath(); c.arc(0, -95 * s, 20 * s, 0, Math.PI * 2); c.fill(); c.stroke();
        rrect(c, -30 * s, -70 * s, 60 * s, 95 * s, 16 * s); c.fill(); c.stroke();
        c.lineCap = 'round'; c.lineWidth = 15 * s; c.strokeStyle = hot(F.Tsk, 20, 37);
        c.beginPath(); c.moveTo(-26 * s, -58 * s); c.lineTo(-44 * s, 10 * s); c.moveTo(26 * s, -58 * s); c.lineTo(44 * s, 10 * s);
        c.moveTo(-14 * s, 22 * s); c.lineTo(-18 * s, 105 * s); c.moveTo(14 * s, 22 * s); c.lineTo(18 * s, 105 * s); c.stroke();
        c.lineCap = 'butt';
        c.fillStyle = hot(Tc, 35, 41); c.beginPath(); c.ellipse(0, -28 * s, 17 * s, 28 * s, 0, 0, Math.PI * 2); c.fill();
        kit.label(c, 'core', 0, -28 * s, { size: 10, color: C.text, align: 'center', weight: 650 });
        // sweat drops
        const drops = Math.round(clamp(F.Sw / 90, 0, 10));
        for (let k = 0; k < drops; k++) {
          const xx = (-24 + (k * 37) % 50) * s, yy = (-60 + (k * 53) % 80) * s + ((t * 30 + k * 13) % 20) * (F.Sw > F.Emax ? 1 : 0.2);
          kit.dot(c, xx, yy, 2.4, kit.hue(205, 0.9));
        }
        c.restore();
        const arr = (x1, y1, x2, y2, col, w, txt, tx, ty, al) => { kit.arrow(c, x1, y1, x2, y2, col, w); if (txt) kit.label(c, txt, tx, ty, { size: 10.5, color: col, align: al || 'left', weight: 600 }); };
        const wOf = P => clamp(1.2 + Math.abs(P) / 70, 1.2, 9);
        // heat made
        kit.label(c, 'made ' + Math.round(F.Mt) + ' W' + (F.Msh > 5 ? ' (shivering ' + Math.round(F.Msh) + ')' : ''), fx, fy + 125 * s, { size: 11, weight: 650, color: C.warn, align: 'center' });
        // dry exchange
        const dcol = F.dry >= 0 ? kit.hue(20) : kit.hue(0);
        if (F.dry >= 0) arr(fx + 52 * s, fy - 20 * s, fx + 52 * s + 22 + wOf(F.dry) * 4, fy - 20 * s, dcol, wOf(F.dry), 'radiation + convection ' + Math.round(F.dry) + ' W', fx + 58 * s, fy - 36 * s);
        else arr(fx + 52 * s + 22 + wOf(F.dry) * 4, fy - 20 * s, fx + 52 * s, fy - 20 * s, C.bad, wOf(F.dry), 'heat GAINED from hot air ' + Math.round(-F.dry) + ' W', fx + 58 * s, fy - 36 * s);
        // evaporation
        if (F.E > 1) {
          const ex = fx - 60 * s;
          c.strokeStyle = kit.hue(205); c.lineWidth = wOf(F.E);
          c.beginPath(); for (let k = 0; k <= 20; k++) { const yy = fy - 10 * s - k * 3, xx = ex + Math.sin(k * 0.8 + t * 5) * 4; if (k) c.lineTo(xx, yy); else c.moveTo(xx, yy); } c.stroke();
          kit.label(c, 'evaporation ' + Math.round(F.E) + ' W', ex - 6, fy - 10 * s - 70, { size: 10.5, color: kit.hue(205), align: 'right', weight: 600 });
        }
        kit.label(c, 'breath ' + Math.round(F.Res) + ' W', fx + 26 * s, fy - 118 * s, { size: 10, color: C.muted });
        // thermometer
        const tx = W * 0.44, ty0 = 26, ty1 = H - 50, tmin = 33, tmax = 42;
        const TY = T => ty1 - (clamp(T, tmin, tmax) - tmin) / (tmax - tmin) * (ty1 - ty0);
        rrect(c, tx - 7, ty0 - 6, 14, ty1 - ty0 + 12, 7); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1.5; c.stroke();
        c.fillStyle = Tc >= 40 ? C.bad : Tc >= 38 ? C.warn : C.accent; c.fillRect(tx - 4, TY(Tc), 8, ty1 - TY(Tc));
        kit.dot(c, tx, ty1 + 10, 10, Tc >= 40 ? C.bad : Tc >= 38 ? C.warn : C.accent);
        c.font = '10px system-ui, sans-serif'; c.fillStyle = C.muted; c.textAlign = 'left'; c.textBaseline = 'middle';
        for (let T = 34; T <= 42; T += 2) c.fillText(T + '°', tx + 11, TY(T));
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(tx - 12, TY(V.Tset)); c.lineTo(tx + 8, TY(V.Tset)); c.stroke();
        kit.label(c, 'set', tx - 14, TY(V.Tset), { size: 9.5, color: C.ok, align: 'right' });
        // the chart
        const ch = { x: W * 0.53, y: 24, w: W * 0.45 - 12, h: H - 70 };
        chart(c, kit, C, ch, {
          xmin: Math.max(0, tm / 60 - 120), xmax: Math.max(120, tm / 60), ymin: 33, ymax: 42, ystep: 1,
          series: [{ pts: hist.concat([[tm / 60, Tc]]), color: C.accent, width: 2.2 }],
          hlines: [{ y: V.Tset, color: C.ok, label: 'set point' }, { y: 40, color: C.bad, label: 'heatstroke' }, { y: 35, color: kit.hue(215), label: 'hypothermia' }],
          xlabel: 'time (minutes)', ylabel: 'core °C'
        });
        // readouts
        const sweatL = F.Sw / 675;
        ro.set('core', Tc.toFixed(1) + ' °C (' + (Tc * 1.8 + 32).toFixed(1) + ' °F)');
        ro.set('skin', F.Tsk.toFixed(1) + ' °C');
        ro.set('made', Math.round(F.Mt) + ' W' + (F.Msh > 5 ? ', incl. shivering ' + Math.round(F.Msh) + ' W' : ''));
        ro.set('dry', (F.dry >= 0 ? 'losing ' : 'GAINING ') + Math.abs(Math.round(F.dry)) + ' W');
        ro.set('evap', Math.round(F.E) + ' W (most possible here ' + Math.round(F.Emax) + ' W)');
        ro.set('sweat', sweatL < 0.02 ? 'little or none' : sweatL.toFixed(2) + ' L/h' + (F.Sw > F.E * 1.1 ? ', ' + Math.round((1 - F.E / F.Sw) * 100) + ' % dripping off' : ''));
        ro.set('state', stateText());
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8. DNA TO PROTEIN */
  const HBB = 'ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGG';
  const CODE = (() => {
    const B = 'TCAG', AA = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG', m = {};
    let i = 0; for (const a of B) for (const b of B) for (const c of B) m[a + b + c] = AA[i++];
    return m;
  })();
  const AA3 = { A: 'Ala', R: 'Arg', N: 'Asn', D: 'Asp', C: 'Cys', E: 'Glu', Q: 'Gln', G: 'Gly', H: 'His', I: 'Ile', L: 'Leu', K: 'Lys', M: 'Met', F: 'Phe', P: 'Pro', S: 'Ser', T: 'Thr', W: 'Trp', Y: 'Tyr', V: 'Val', '*': 'STOP' };
  const AAN = { A: 'alanine', R: 'arginine', N: 'asparagine', D: 'aspartate', C: 'cysteine', E: 'glutamate', Q: 'glutamine', G: 'glycine', H: 'histidine', I: 'isoleucine', L: 'leucine', K: 'lysine', M: 'methionine', F: 'phenylalanine', P: 'proline', S: 'serine', T: 'threonine', W: 'tryptophan', Y: 'tyrosine', V: 'valine', '*': 'stop' };
  const GENE = {
    normal: { label: 'Normal β-globin gene', edit: s => s, note: 'The start of the gene for β-globin, the protein that pairs with α-globin to make adult haemoglobin.' },
    sickle: { label: 'Sickle cell: codon 6 GAG → GTG', edit: s => s.slice(0, 19) + 'T' + s.slice(20), note: 'Glutamate becomes valine. Two copies cause sickle cell disease; one copy (sickle cell trait) partly protects against severe malaria.' },
    hbc: { label: 'Haemoglobin C: codon 6 GAG → AAG', edit: s => s.slice(0, 18) + 'A' + s.slice(19), note: 'Glutamate becomes lysine at the same place. Haemoglobin C is milder; combined with the sickle gene it causes HbSC disease.' },
    silent: { label: 'Silent: codon 6 GAG → GAA', edit: s => s.slice(0, 20) + 'A' + s.slice(21), note: 'GAA also means glutamate: the protein is unchanged.' },
    nonsense: { label: 'Nonsense: codon 17 AAG → TAG', edit: s => s.slice(0, 51) + 'T' + s.slice(52), note: 'An early stop codon: no working β-globin is made from this copy — a cause of β-thalassaemia, common in parts of Southeast Asia.' },
    frameshift: { label: 'Frameshift: two letters lost in codon 8', edit: s => s.slice(0, 24) + s.slice(26), note: 'Deleting two letters shifts the reading frame: every later codon is misread and a stop codon soon appears — another cause of β-thalassaemia.' }
  };
  Hyper.sim('fnd-genetic-code', {
    title: 'From DNA to protein: one letter at a time',
    blurb: `The first 31 codons of the human β-globin gene. Each box shows a DNA codon (coding strand), the messenger RNA copied from it (U in place of T) and the amino acid the ribosome adds. Codons are numbered the traditional way, from the first amino acid after the starting methionine (modern notation adds one: the sickle change is written p.Glu7Val).

- Pick a known mutation, or **click any letter** to change it (A → C → G → T), delete it, or insert an extra A before it.
- Changes in the third letter of a codon are often **silent**; a change to TAA, TAG or TGA **stops** the protein short.
- Delete one letter, then another, then a third nearby: after three deletions the frame is restored — why in-frame deletions are often milder.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const g0 = GENE[params && params.gene] ? params.gene : 'normal';
      const ctl = kit.controls(box.side, [
        { id: 'gene', type: 'select', label: 'Gene', options: Object.keys(GENE).map(k => [GENE[k].label, k]).concat([['Your own changes', 'custom']]), value: g0 },
        { id: 'mode', type: 'select', label: 'Clicking a letter will', options: [['change it (A → C → G → T)', 'sub'], ['delete it', 'del'], ['insert an extra A before it', 'ins']], value: 'sub' },
        { type: 'buttons', items: [{ id: 'undo', label: 'Back to normal', primary: true }] }
      ], (id, v) => {
        if (id === 'gene' && GENE[v]) { seq = GENE[v].edit(HBB); }
        else if (id === 'undo') { seq = HBB; ctl.set('gene', 'normal'); }
        update();
      });
      const ro = kit.readout(box.side, [['kind', 'Kind of change'], ['effect', 'Effect on the protein'], ['norm', 'Normal protein'], ['now', 'This protein'], ['note', 'What it means']]);
      const V = ctl.values;
      let seq = GENE[g0].edit(HBB), info = null;
      const normP = translate(HBB);
      function translate(s) {
        let p = '';
        for (let k = 0; k + 3 <= s.length; k += 3) { const a = CODE[s.slice(k, k + 3)] || '?'; p += a; if (a === '*') break; }
        return p;
      }
      function update() {
        const p = translate(seq), indel = seq.length !== HBB.length;
        let kind, effect;
        if (seq === HBB) { kind = 'none'; effect = 'normal β-globin'; }
        else if (indel) {
          const d = seq.length - HBB.length;
          kind = d % 3 ? 'frameshift (' + (d > 0 ? d + ' letter(s) inserted' : -d + ' letter(s) deleted') + ')' : 'in-frame ' + (d > 0 ? 'insertion' : 'deletion') + ' of ' + Math.abs(d / 3) + ' codon(s)';
          const stop = p.indexOf('*');
          effect = stop >= 0 && stop < 30 ? 'stops early, after ' + stop + ' amino acids' : d % 3 ? 'scrambled from the change onwards' : 'one or more amino acids missing or added';
        } else {
          const diffs = [];
          for (let k = 0; k < 31; k++) { const a = CODE[HBB.slice(3 * k, 3 * k + 3)], b = CODE[seq.slice(3 * k, 3 * k + 3)]; if (HBB.slice(3 * k, 3 * k + 3) !== seq.slice(3 * k, 3 * k + 3)) diffs.push([k, a, b]); }
          const stops = diffs.filter(d => d[2] === '*'), mis = diffs.filter(d => d[2] !== '*' && d[1] !== d[2]);
          if (stops.length) { kind = 'nonsense (point mutation)'; effect = 'a stop codon at codon ' + stops[0][0] + ': the protein ends after ' + p.slice(0, -1).length + ' amino acids'; }
          else if (mis.length) { kind = mis.length === 1 ? 'missense (point mutation)' : 'missense, ' + mis.length + ' codons'; effect = mis.map(d => AAN[d[1]] + ' → ' + AAN[d[2]] + ' at codon ' + d[0]).join('; '); }
          else { kind = 'silent'; effect = 'no change: the new codon codes for the same amino acid'; }
        }
        info = { p };
        ro.set('kind', kind); ro.set('effect', effect);
        ro.set('norm', normP);
        ro.set('now', p.replace('*', ' ■stop'));
        const gk = V.gene !== 'custom' && GENE[V.gene] && GENE[V.gene].edit(HBB) === seq ? V.gene : null;
        ro.set('note', gk ? GENE[gk].note : 'Your own change. One-letter amino-acid codes: M methionine, V valine, H histidine, L leucine, E glutamate, K lysine, and so on.');
        loop && loop.once();
      }
      let lay = null;
      function layout() {
        const W = st.W, H = st.H, cols = 8, rows = 4, pad = 8;
        const bw = (W - pad * 2) / cols, bh = (H - 44) / rows;
        return { W, H, cols, rows, bw, bh, pad, top: 34 };
      }
      function boxAt(L, k) { return { x: L.pad + (k % L.cols) * L.bw, y: L.top + Math.floor(k / L.cols) * L.bh }; }
      function letterRect(L, k, j) {
        const b = boxAt(L, k), lw = Math.min(16, L.bw / 4.2), x0 = b.x + L.bw / 2 - 1.5 * lw;
        return { x: x0 + j * lw, y: b.y + L.bh * 0.24, w: lw, h: Math.min(22, L.bh * 0.24) };
      }
      kit.click(st, p => {
        const L = layout();
        const n = Math.min(32, Math.ceil(seq.length / 3));
        for (let k = 0; k < n; k++) for (let j = 0; j < 3; j++) {
          const i = 3 * k + j; if (i >= seq.length) continue;
          const r = letterRect(L, k, j);
          if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
            if (V.mode === 'sub') { const nx = 'ACGT'['ACGT'.indexOf(seq[i]) + 1] || 'A'; seq = seq.slice(0, i) + nx + seq.slice(i + 1); }
            else if (V.mode === 'del') { if (seq.length > 60) seq = seq.slice(0, i) + seq.slice(i + 1); }
            else if (seq.length < 120) seq = seq.slice(0, i) + 'A' + seq.slice(i);
            ctl.set('gene', 'custom');
            update();
            return;
          }
        }
      }, p => {
        const L = layout();
        for (let k = 0; k < 32; k++) for (let j = 0; j < 3; j++) { const r = letterRect(L, k, j); if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) return true; }
        return false;
      });
      function draw() {
        const C = kit.colors(), c = st.begin(), L = layout();
        lay = L;
        kit.label(c, 'DNA codon  ·  mRNA  ·  amino acid', L.pad, 14, { size: 11, color: C.muted });
        kit.label(c, 'changed letters in orange, changed amino acids in red', L.W - L.pad, 14, { size: 10.5, color: C.muted, align: 'right' });
        let stopped = false;
        for (let k = 0; k < 32; k++) {
          const b = boxAt(L, k), cod = seq.slice(3 * k, 3 * k + 3);
          if (k >= 31 && cod.length === 0) continue;
          const a = cod.length === 3 ? CODE[cod] : null, a0 = CODE[HBB.slice(3 * k, 3 * k + 3)];
          const gone = stopped;
          rrect(c, b.x + 3, b.y + 3, L.bw - 6, L.bh - 6, 7);
          c.fillStyle = gone ? C.bg2 : a === '*' ? kit.hue(355, 0.18) : C.surface; c.fill();
          c.strokeStyle = !gone && a && a0 && a !== a0 ? C.bad : C.border2; c.lineWidth = !gone && a && a0 && a !== a0 ? 2 : 1; c.stroke();
          c.globalAlpha = gone ? 0.35 : 1;
          kit.label(c, k === 0 ? 'start' : String(k), b.x + 10, b.y + 13, { size: 9.5, color: C.muted });
          for (let j = 0; j < 3; j++) {
            const i = 3 * k + j, r = letterRect(L, k, j);
            if (i >= seq.length) continue;
            const changed = seq[i] !== HBB[i];
            kit.label(c, seq[i], r.x + r.w / 2, r.y + r.h / 2, { size: Math.min(15, L.bw / 5.5), weight: 700, align: 'center', color: changed ? C.warn : C.text, font: 'ui-monospace, monospace' });
            kit.label(c, seq[i] === 'T' ? 'U' : seq[i], r.x + r.w / 2, r.y + r.h / 2 + L.bh * 0.24, { size: Math.min(12.5, L.bw / 6.5), align: 'center', color: changed ? C.warn : C.text2, font: 'ui-monospace, monospace' });
          }
          const aTxt = cod.length < 3 ? '…' : a === '*' ? 'STOP' : AA3[a] + ' ' + a;
          kit.label(c, aTxt, b.x + L.bw / 2, b.y + L.bh * 0.8, { size: Math.min(12, L.bw / 7), weight: 650, align: 'center', color: a === '*' ? C.bad : a && a0 && a !== a0 ? C.bad : C.accent });
          c.globalAlpha = 1;
          if (a === '*') stopped = true;
        }
        if (stopped) kit.label(c, 'greyed codons after a stop are never translated', L.W / 2, L.H - 7, { size: 10.5, color: C.muted, align: 'center' });
      }
      const loop = kit.loop(() => draw(), box.stage);
      update();
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
