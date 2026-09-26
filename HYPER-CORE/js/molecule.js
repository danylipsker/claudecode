/* HYPER-CORE · molecule.js
 *
 * Drawing molecules in 3-D on a canvas, for simulations (kit.mol, also Hyper.mol).
 *
 *   const mol = Hyper.chem.molecule('H2O');         // or your own { atoms: [{ el, x, y, z }], bonds: [[i, j, order]], lone: [{ atom, dir }] }
 *   const view = kit.mol.view({ rotX: -0.4, rotY: 0.6, scale: 70 });
 *   kit.mol.rotator(st, view, () => loop.once());   // drag on the canvas to turn it
 *   kit.mol.draw(ctx, mol, view, { cx: 300, cy: 200, style: 'ball' | 'space', labels: true, lone: true,
 *                                   highlight: [0], angle: [1, 0, 2] });
 *   kit.mol.angle(mol, 1, 0, 2)                     // degrees between bonds 0–1 and 0–2
 *   kit.mol.project([x, y, z], view, { cx, cy })    // a point (Å, from the drawing centre) on the canvas
 *
 * Coordinates are in ångström; `scale` is pixels per ångström. Nothing here uses the DOM.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const C = () => (H.ui && H.ui.colors) ? H.ui.colors() : { text: '#ccc', muted: '#999', accent: '#7b8cff', dark: true, bg2: '#111' };

  function rot(p, v) {
    // turn about y, then about x
    const cy = Math.cos(v.rotY), sy = Math.sin(v.rotY), cx = Math.cos(v.rotX), sx = Math.sin(v.rotX);
    const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
    const y2 = p[1] * cx - z1 * sx, z2 = p[1] * sx + z1 * cx;
    return [x1, y2, z2];
  }
  function project(p, v, o) {
    const d = v.dist || 12;
    const f = d / (d - p[2]);
    return { x: o.cx + p[0] * v.scale * f, y: o.cy - p[1] * v.scale * f, z: p[2], f };
  }
  function shade(hex, k) {
    // lighten (k > 0) or darken (k < 0) a #rrggbb colour
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = k > 0 ? 255 : 0, a = Math.abs(k);
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  const M = {
    view(o) { return Object.assign({ rotX: -0.35, rotY: 0.55, scale: 70, dist: 12 }, o || {}); },
    rotator(st, v, onChange) {
      let last = null;
      const cv = st.canvas;
      cv.style.touchAction = 'none';
      cv.addEventListener('pointerdown', e => { last = st.pos(e); if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId); v.dragging = true; });
      cv.addEventListener('pointermove', e => {
        if (!last) return;
        const p = st.pos(e);
        v.rotY += (p.x - last.x) * 0.01;
        v.rotX += (p.y - last.y) * 0.01;
        v.rotX = Math.max(-1.55, Math.min(1.55, v.rotX));
        last = p;
        onChange && onChange();
      });
      const up = () => { last = null; v.dragging = false; };
      cv.addEventListener('pointerup', up);
      cv.addEventListener('pointercancel', up);
      cv.addEventListener('pointerleave', up);
      return v;
    },
    angle(mol, i, j, k) {
      const a = mol.atoms[i], b = mol.atoms[j], c = mol.atoms[k];
      const u = [a.x - b.x, a.y - b.y, a.z - b.z], w = [c.x - b.x, c.y - b.y, c.z - b.z];
      const dot = u[0] * w[0] + u[1] * w[1] + u[2] * w[2];
      return Math.acos(Math.max(-1, Math.min(1, dot / (Math.hypot(...u) * Math.hypot(...w))))) * 180 / Math.PI;
    },
    /* where a point [x, y, z] (Å, relative to the centre used for drawing) lands on the canvas:
       for arrows, lobes and labels that must line up with a drawn molecule -> { x, y, z, f } */
    project(p, v, o) { return project(rot(p, v), v, o); },
    /* centre of the atoms, to rotate a molecule about its middle */
    centre(mol) {
      const n = mol.atoms.length || 1;
      const c = mol.atoms.reduce((s, a) => [s[0] + a.x / n, s[1] + a.y / n, s[2] + a.z / n], [0, 0, 0]);
      return c;
    },
    draw(ctx, mol, v, o) {
      o = o || {};
      const col = C();
      const chem = H.chem;
      const ctr = o.centre || M.centre(mol);
      const pts = mol.atoms.map(a => project(rot([a.x - ctr[0], a.y - ctr[1], a.z - ctr[2]], v), v, o));
      const space = o.style === 'space';
      const radius = (a, p) => {
        if (a.radius != null) return a.radius * v.scale * p.f;   // an atom may give its own drawn radius, Å (touching spheres in a crystal)
        const e = chem && chem.bySym[a.el];
        const r = (e && e.r ? e.r : 75) / 100;               // covalent radius, Å
        return (space ? r * 1.25 : 0.28 + r * 0.22) * v.scale * p.f;
      };
      const items = [];
      if (!space) for (const b of (mol.bonds || [])) {
        const [i, j, order] = b;
        items.push({ z: (pts[i].z + pts[j].z) / 2 - 0.001, draw: () => {
          const A = pts[i], B = pts[j];
          const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
          const nx = -dy / L, ny = dx / L;
          const n = order || 1, gap = 5.5 * A.f;
          const w = Math.max(2.5, 4.2 * (A.f + B.f) / 2);
          for (let k = 0; k < n; k++) {
            const off = (k - (n - 1) / 2) * gap;
            const ax = A.x + nx * off, ay = A.y + ny * off, bx = B.x + nx * off, by = B.y + ny * off;
            const mx = (ax + bx) / 2, my = (ay + by) / 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = col.dark ? 'rgba(0,0,0,.55)' : 'rgba(0,0,0,.35)'; ctx.lineWidth = w + 2;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
            ctx.lineWidth = w;
            const ea = chem && chem.bySym[mol.atoms[i].el], eb = chem && chem.bySym[mol.atoms[j].el];
            ctx.strokeStyle = shade(ea ? ea.color : '#cccccc', -0.1); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(mx, my); ctx.stroke();
            ctx.strokeStyle = shade(eb ? eb.color : '#cccccc', -0.1); ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(bx, by); ctx.stroke();
          }
        } });
      }
      if (o.lone !== false) for (const lp of (mol.lone || [])) {
        const a = mol.atoms[lp.atom];
        // reach past the drawn atom, so the lobe shows whatever the size of the atom
        const ea = chem && chem.bySym[a.el], ra = (ea && ea.r ? ea.r : 75) / 100;
        const reach = (space ? ra * 1.25 : 0.28 + ra * 0.22) + 0.5;
        const tip = rot([a.x - ctr[0] + lp.dir[0] * reach, a.y - ctr[1] + lp.dir[1] * reach, a.z - ctr[2] + lp.dir[2] * reach], v);
        const P = project(tip, v, o), A = pts[lp.atom];
        items.push({ z: tip[2], draw: () => {
          const ang = Math.atan2(P.y - A.y, P.x - A.x), len = Math.hypot(P.x - A.x, P.y - A.y);
          ctx.save(); ctx.translate((A.x + P.x) / 2, (A.y + P.y) / 2); ctx.rotate(ang);
          ctx.beginPath(); ctx.ellipse(0, 0, Math.max(6, len * 0.62), 0.28 * v.scale * P.f, 0, 0, Math.PI * 2);
          ctx.fillStyle = col.dark ? 'rgba(160,170,255,.22)' : 'rgba(80,90,200,.16)'; ctx.fill();
          ctx.strokeStyle = col.dark ? 'rgba(160,170,255,.45)' : 'rgba(80,90,200,.35)'; ctx.lineWidth = 1; ctx.stroke();
          // the two electrons
          ctx.fillStyle = col.accent;
          for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(len * 0.18, s * 4, 2.4, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        } });
      }
      mol.atoms.forEach((a, i) => {
        items.push({ z: pts[i].z, draw: () => {
          const p = pts[i], r = radius(a, p);
          const e = chem && chem.bySym[a.el];
          const base = e ? e.color : '#e070a0';
          const g = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.35, r * 0.1, p.x, p.y, r);
          g.addColorStop(0, shade(base, 0.55)); g.addColorStop(0.55, base); g.addColorStop(1, shade(base, -0.45));
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
          ctx.lineWidth = (o.highlight || []).includes(i) ? 3 : 1;
          ctx.strokeStyle = (o.highlight || []).includes(i) ? col.accent : 'rgba(0,0,0,.45)'; ctx.stroke();
          if (o.labels !== false && !space && r > 7) {
            ctx.font = '600 ' + Math.max(10, Math.min(16, r * 0.9)) + 'px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            const lum = parseInt(base.slice(1, 3), 16) * 0.3 + parseInt(base.slice(3, 5), 16) * 0.59 + parseInt(base.slice(5, 7), 16) * 0.11;
            ctx.fillStyle = lum > 150 ? '#111' : '#fff';
            ctx.fillText(a.label || a.el, p.x, p.y + 0.5);
          }
          if (a.charge) {
            ctx.font = '700 12px "Segoe UI", system-ui, sans-serif'; ctx.fillStyle = col.text;
            ctx.fillText(a.charge > 0 ? (a.charge > 1 ? a.charge : '') + '+' : (a.charge < -1 ? -a.charge : '') + '−', p.x + r * 0.9, p.y - r * 0.9);
          }
        } });
      });
      items.sort((a, b) => a.z - b.z);
      for (const it of items) it.draw();
      // a bond angle, drawn as an arc at the middle atom
      if (o.angle) {
        const [i, j, k] = o.angle;
        const A = pts[i], B = pts[j], K = pts[k];
        const a1 = Math.atan2(A.y - B.y, A.x - B.x), a2 = Math.atan2(K.y - B.y, K.x - B.x);
        let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        const R = 0.55 * v.scale;
        ctx.strokeStyle = col.accent; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(B.x, B.y, R, a1, a1 + d, d < 0); ctx.stroke();
        const mid = a1 + d / 2;
        ctx.font = '600 13px "Segoe UI", system-ui, sans-serif'; ctx.fillStyle = col.accent; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(M.angle(mol, i, j, k).toFixed(1) + '°', B.x + Math.cos(mid) * (R + 18), B.y + Math.sin(mid) * (R + 18));
      }
      return pts;
    }
  };
  H.mol = M;
})(typeof window !== 'undefined' ? window : globalThis);
