/* The Puzzle Cabinet · view3d.js
 *
 * A small 3D view for puzzle pieces: flat-shaded polygons with outlines,
 * drawn far to near on a 2D canvas (the painter's method). That is plenty for
 * cubes, nets, knots and polyhedra, needs no WebGL, and keeps every puzzle
 * working offline.
 *
 *   const v = new Cabinet.View3D(hostElement, { onPick(hit, ev) {} });
 *   v.voxels([{ x:0, y:0, z:0, color:'#6c7bff' }, ...], { id: 'piece-a' });
 *   v.tube(points, 0.15, '#ffb057', { closed: true });
 *   v.fit(); v.render();
 *
 * World axes: x to the right, y up, z toward the viewer. The camera orbits a
 * target point (drag), zooms (wheel or pinch) and pans (right drag or shift
 * drag). A tap without a drag reports the face under the pointer.
 */
(function (root) {
  'use strict';

  const C = root.Cabinet = root.Cabinet || {};

  /* ---------- 3-vectors and 3x4 matrices ---------- */

  const V = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    len: (a) => Math.hypot(a[0], a[1], a[2]),
    norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
    lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  };

  // a 3x4 matrix [r00 r01 r02 tx  r10 r11 r12 ty  r20 r21 r22 tz]
  const M4 = {
    id: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    apply(m, p) {
      return [
        m[0] * p[0] + m[1] * p[1] + m[2] * p[2] + m[3],
        m[4] * p[0] + m[5] * p[1] + m[6] * p[2] + m[7],
        m[8] * p[0] + m[9] * p[1] + m[10] * p[2] + m[11]
      ];
    },
    applyDir(m, p) {
      return [m[0] * p[0] + m[1] * p[1] + m[2] * p[2], m[4] * p[0] + m[5] * p[1] + m[6] * p[2], m[8] * p[0] + m[9] * p[1] + m[10] * p[2]];
    },
    mul(a, b) { // a after b
      const r = new Array(12);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
          r[i * 4 + j] = a[i * 4] * b[j] + a[i * 4 + 1] * b[4 + j] + a[i * 4 + 2] * b[8 + j] + (j === 3 ? a[i * 4 + 3] : 0);
        }
      }
      return r;
    },
    translate: (x, y, z) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z],
    scale: (s) => [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0],
    // rotation by deg about the axis through point p with direction d (right-hand rule)
    rotate(deg, d, p) {
      const [x, y, z] = V.norm(d), a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), t = 1 - c;
      const r = [
        t * x * x + c, t * x * y - s * z, t * x * z + s * y, 0,
        t * x * y + s * z, t * y * y + c, t * y * z - s * x, 0,
        t * x * z - s * y, t * y * z + s * x, t * z * z + c, 0
      ];
      if (!p) return r;
      return M4.mul(M4.translate(p[0], p[1], p[2]), M4.mul(r, M4.translate(-p[0], -p[1], -p[2])));
    }
  };

  C.V3 = V;
  C.M4 = M4;

  function parseColor(c) {
    if (Array.isArray(c)) return c;
    if (typeof c !== 'string') return [150, 160, 200];
    if (c[0] === '#') {
      let h = c.slice(1);
      if (h.length === 3) h = h.split('').map((x) => x + x).join('');
      const n = parseInt(h.slice(0, 6), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    const m = /rgba?\(([^)]+)\)/.exec(c);
    if (m) return m[1].split(',').slice(0, 3).map(Number);
    return [150, 160, 200];
  }
  const colorCache = {};
  function rgb(c) { return colorCache[c] || (colorCache[c] = parseColor(c)); }
  function shade(c, k, a) {
    const [r, g, b] = rgb(c);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return a == null || a >= 1 ? 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')' : 'rgba(' + f(r) + ',' + f(g) + ',' + f(b) + ',' + a + ')';
  }

  /* ---------- the view ---------- */

  function View3D(host, opts) {
    this.opts = opts || {};
    this.host = host;
    this.canvas = root.document.createElement('canvas');
    this.canvas.className = 'v3d';
    host.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.meshes = [];
    this.cam = { yaw: -35, pitch: 28, dist: 12, target: [0, 0, 0], fov: 40 };
    this.bg = this.opts.bg || null;
    this.light = V.norm([-0.45, 0.8, 0.55]);
    this.ambient = 0.42;
    this.pointers = new Map();
    this.faces = [];
    this.bindEvents();
    this.resize();
    this.ro = root.ResizeObserver ? new root.ResizeObserver(() => { this.resize(); this.render(); }) : null;
    if (this.ro) this.ro.observe(host);
  }

  View3D.prototype.destroy = function () {
    if (this.ro) this.ro.disconnect();
    this.canvas.remove();
    this.meshes = [];
  };

  View3D.prototype.resize = function () {
    const r = this.host.getBoundingClientRect();
    const dpr = Math.min(2.5, root.devicePixelRatio || 1);
    this.w = Math.max(10, r.width);
    this.h = Math.max(10, r.height);
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.dpr = dpr;
  };

  View3D.prototype.clear = function () { this.meshes = []; };

  /* mesh = { verts: [[x,y,z]], faces: [[i,j,k,...]], color, colors: [per face],
   *          stroke (outline colour or false), lw, alpha, doubleSided,
   *          m: 3x4 matrix, id, data, decals: { faceIndex: { text, color, draw(ctx) } },
   *          hidden, pickable (default true) } */
  View3D.prototype.add = function (mesh) {
    mesh.m = mesh.m || M4.id();
    if (mesh.pickable == null) mesh.pickable = true;
    this.meshes.push(mesh);
    return mesh;
  };
  View3D.prototype.remove = function (mesh) {
    const i = this.meshes.indexOf(mesh);
    if (i >= 0) this.meshes.splice(i, 1);
  };
  View3D.prototype.byId = function (id) { return this.meshes.find((m) => m.id === id); };

  // an axis-aligned box from (x, y, z) to (x+sx, y+sy, z+sz)
  View3D.prototype.box = function (x, y, z, sx, sy, sz, color, extra) {
    const v = [
      [x, y, z], [x + sx, y, z], [x + sx, y + sy, z], [x, y + sy, z],
      [x, y, z + sz], [x + sx, y, z + sz], [x + sx, y + sy, z + sz], [x, y + sy, z + sz]
    ];
    const f = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [3, 7, 6, 2], [0, 4, 7, 3], [1, 2, 6, 5]];
    return this.add(Object.assign({ verts: v, faces: f, color }, extra || {}));
  };

  /* Unit cubes as one mesh with only the outside faces kept.
   * cells: [{ x, y, z, color, decals: { px|nx|py|ny|pz|nz: {...} } }]
   * Each face knows its cell: mesh.faceCell[i] = index into cells, mesh.faceDir[i]. */
  const DIRS = {
    px: [1, 0, 0], nx: [-1, 0, 0], py: [0, 1, 0], ny: [0, -1, 0], pz: [0, 0, 1], nz: [0, 0, -1]
  };
  View3D.DIRS = DIRS;
  View3D.prototype.voxels = function (cells, extra) {
    extra = extra || {};
    const s = extra.size || 1, gap = extra.gap || 0;
    const key = (x, y, z) => x + ',' + y + ',' + z;
    const has = new Set(cells.map((c) => key(c.x, c.y, c.z)));
    const verts = [], faces = [], colors = [], faceCell = [], faceDir = [], decals = {};
    cells.forEach((c, ci) => {
      const x0 = c.x * s + gap, y0 = c.y * s + gap, z0 = c.z * s + gap, x1 = (c.x + 1) * s - gap, y1 = (c.y + 1) * s - gap, z1 = (c.z + 1) * s - gap;
      const quads = {
        px: [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]],
        nx: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]],
        py: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]],
        ny: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]],
        pz: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
        nz: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]]
      };
      for (const d in DIRS) {
        const n = DIRS[d];
        if (!extra.allFaces && has.has(key(c.x + n[0], c.y + n[1], c.z + n[2]))) continue;
        const base = verts.length;
        quads[d].forEach((p) => verts.push(p));
        faces.push([base, base + 1, base + 2, base + 3]);
        colors.push(c.colors && c.colors[d] || c.color || extra.color || '#8f9bff');
        faceCell.push(ci);
        faceDir.push(d);
        if (c.decals && c.decals[d]) decals[faces.length - 1] = c.decals[d];
      }
    });
    return this.add(Object.assign({ verts, faces, colors, faceCell, faceDir, decals, cells }, extra));
  };

  // a round tube along a polyline (closed: joins the ends)
  View3D.prototype.tube = function (pts, r, color, extra) {
    extra = extra || {};
    const sides = extra.sides || 8, closed = !!extra.closed, n = pts.length;
    if (n < 2) return null;
    const verts = [], faces = [], colors = [];
    const tan = [];
    for (let i = 0; i < n; i++) {
      const a = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], b = pts[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
      tan.push(V.norm(V.sub(b, a)));
    }
    // parallel-transported frame, so the tube does not twist
    let nrm = V.norm(V.cross(tan[0], Math.abs(tan[0][1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
    const frames = [];
    for (let i = 0; i < n; i++) {
      if (i > 0) {
        const b = V.cross(tan[i - 1], tan[i]);
        if (V.len(b) > 1e-6) {
          const ang = Math.acos(Math.max(-1, Math.min(1, V.dot(tan[i - 1], tan[i])))) * 180 / Math.PI;
          nrm = V.norm(M4.applyDir(M4.rotate(ang, b), nrm));
        }
      }
      const bin = V.cross(tan[i], nrm);
      frames.push([nrm, bin]);
    }
    for (let i = 0; i < n; i++) {
      const [u, w] = frames[i];
      for (let k = 0; k < sides; k++) {
        const a = k / sides * Math.PI * 2;
        verts.push(V.add(pts[i], V.add(V.mul(u, Math.cos(a) * r), V.mul(w, Math.sin(a) * r))));
      }
    }
    const segs = closed ? n : n - 1;
    const cols = extra.colors; // optional colour per point
    for (let i = 0; i < segs; i++) {
      const j = (i + 1) % n;
      for (let k = 0; k < sides; k++) {
        const k2 = (k + 1) % sides;
        faces.push([i * sides + k, i * sides + k2, j * sides + k2, j * sides + k]);
        colors.push(cols ? cols[i] : color);
      }
    }
    if (!closed) { // end caps
      const cap0 = [], cap1 = [];
      for (let k = sides - 1; k >= 0; k--) cap0.push(k);
      for (let k = 0; k < sides; k++) cap1.push((n - 1) * sides + k);
      faces.push(cap0, cap1);
      colors.push(cols ? cols[0] : color, cols ? cols[n - 2] : color);
    }
    return this.add(Object.assign({ verts, faces, colors, stroke: false, smooth: true }, extra));
  };

  // a flat polygon (any orientation), both sides visible
  View3D.prototype.poly = function (pts, color, extra) {
    return this.add(Object.assign({ verts: pts, faces: [pts.map((p, i) => i)], color, doubleSided: true }, extra || {}));
  };

  /* ---------- camera ---------- */

  View3D.prototype.eye = function () {
    const c = this.cam, y = c.yaw * Math.PI / 180, p = c.pitch * Math.PI / 180;
    return V.add(c.target, [c.dist * Math.cos(p) * Math.sin(y), c.dist * Math.sin(p), c.dist * Math.cos(p) * Math.cos(y)]);
  };
  View3D.prototype.basis = function () {
    const e = this.eye();
    const f = V.norm(V.sub(this.cam.target, e));
    let r = V.cross(f, [0, 1, 0]);
    if (V.len(r) < 1e-6) r = [1, 0, 0];
    r = V.norm(r);
    const u = V.cross(r, f);
    return { e, f, r, u };
  };

  // fit the camera to everything in the scene
  View3D.prototype.fit = function (pad) {
    let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    this.meshes.forEach((m) => {
      if (m.hidden) return;
      m.verts.forEach((p) => {
        const q = M4.apply(m.m, p);
        for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], q[i]); hi[i] = Math.max(hi[i], q[i]); }
      });
    });
    if (lo[0] === Infinity) return;
    this.cam.target = V.mul(V.add(lo, hi), 0.5);
    const rad = V.len(V.sub(hi, lo)) / 2 || 1;
    const fov = this.cam.fov * Math.PI / 180;
    const aspect = Math.min(1, this.freeW() / this.freeH());
    this.cam.dist = rad * (pad || 1.15) / Math.sin(fov / 2) / Math.max(0.55, aspect);
    this.fitDist = this.cam.dist;
  };

  /* screen margins the scene keeps clear of (a chip bar, a button pad): { l, r, t, b } in pixels */
  View3D.prototype.freeW = function () { const m = this.margins || {}; return Math.max(10, this.w - (m.l || 0) - (m.r || 0)); };
  View3D.prototype.freeH = function () { const m = this.margins || {}; return Math.max(10, this.h - (m.t || 0) - (m.b || 0)); };
  View3D.prototype.centreX = function () { const m = this.margins || {}; return (m.l || 0) + this.freeW() / 2; };
  View3D.prototype.centreY = function () { const m = this.margins || {}; return (m.t || 0) + this.freeH() / 2; };
  View3D.prototype.focal = function () { return (this.freeH() / 2) / Math.tan(this.cam.fov * Math.PI / 360); };

  // the ray under a screen point: { origin, dir } in world coordinates
  View3D.prototype.ray = function (x, y) {
    const B = this.basis(), focal = this.focal();
    if (this.cam.ortho) {
      const k = this.cam.dist / focal;
      return { origin: V.add(B.e, V.add(V.mul(B.r, (x - this.centreX()) * k), V.mul(B.u, (this.centreY() - y) * k))), dir: B.f };
    }
    const dir = V.norm(V.add(B.f, V.add(V.mul(B.r, (x - this.centreX()) / focal), V.mul(B.u, (this.centreY() - y) / focal))));
    return { origin: B.e, dir };
  };

  View3D.prototype.project = function (p, B) {
    B = B || this.basis();
    const d = V.sub(p, B.e);
    const z = V.dot(d, B.f);
    const focal = this.focal(), cx = this.centreX(), cy = this.centreY(), ortho = !!this.cam.ortho;
    return [cx + V.dot(d, B.r) * (ortho ? focal / this.cam.dist : focal / z), cy - V.dot(d, B.u) * (ortho ? focal / this.cam.dist : focal / z), z];
  };

  /* ---------- drawing ---------- */

  View3D.prototype.render = function () {
    const ctx = this.ctx, B = this.basis(), dpr = this.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    if (this.bg) { ctx.fillStyle = this.bg; ctx.fillRect(0, 0, this.w, this.h); }
    if (this.opts.before) this.opts.before(this);
    const focal = this.focal(), cx = this.centreX(), cy = this.centreY(), ortho = !!this.cam.ortho;
    const near = 0.05;
    const list = [];
    const L = this.light;
    // the light follows the camera a little, so the side you look at is lit
    const Lw = V.norm(V.add(V.add(V.mul(B.r, -0.45), V.mul(B.u, 0.75)), V.mul(B.f, -0.6)));
    this.meshes.forEach((mesh) => {
      if (mesh.hidden) return;
      const wv = mesh.verts.map((p) => M4.apply(mesh.m, p));
      const cv = wv.map((p) => {
        const d = V.sub(p, B.e);
        const z = V.dot(d, B.f);
        return [cx + V.dot(d, B.r) * (ortho ? focal / this.cam.dist : focal / z), cy - V.dot(d, B.u) * (ortho ? focal / this.cam.dist : focal / z), z];
      });
      mesh.faces.forEach((face, fi) => {
        let zsum = 0, zmax = -Infinity, bad = false;
        for (const i of face) { const z = cv[i][2]; if (z < near) { bad = true; break; } zsum += z; if (z > zmax) zmax = z; }
        if (bad) return;
        // Newell normal
        let nx = 0, ny = 0, nz = 0;
        for (let k = 0; k < face.length; k++) {
          const a = wv[face[k]], b = wv[face[(k + 1) % face.length]];
          nx += (a[1] - b[1]) * (a[2] + b[2]);
          ny += (a[2] - b[2]) * (a[0] + b[0]);
          nz += (a[0] - b[0]) * (a[1] + b[1]);
        }
        let n = V.norm([nx, ny, nz]);
        const toEye = V.sub(B.e, wv[face[0]]);
        let facing = V.dot(n, toEye) > 0;
        if (!facing) {
          if (!mesh.doubleSided) return;
          n = V.mul(n, -1);
        }
        const lit = this.ambient + (1 - this.ambient) * Math.max(0, V.dot(n, Lw)) * 0.95 + 0.05 * Math.max(0, V.dot(n, L));
        list.push({ mesh, fi, face, cv, z: zsum / face.length + (mesh.bias || 0) + (mesh.faceBias ? mesh.faceBias[fi] || 0 : 0), lit, back: !facing });
      });
    });
    list.sort((a, b) => b.z - a.z);
    this.faces = list;
    for (const it of list) {
      const { mesh, fi, face, cv } = it;
      const col = (mesh.colors && mesh.colors[fi]) || mesh.color || '#8f9bff';
      const sel = mesh.selected || (mesh.selFaces && mesh.selFaces[fi]);
      ctx.beginPath();
      ctx.moveTo(cv[face[0]][0], cv[face[0]][1]);
      for (let k = 1; k < face.length; k++) ctx.lineTo(cv[face[k]][0], cv[face[k]][1]);
      ctx.closePath();
      const k = it.back && mesh.backShade ? it.lit * mesh.backShade : it.lit;
      ctx.fillStyle = shade(it.back && mesh.backColor ? mesh.backColor : col, sel ? k * 1.25 : k, mesh.alpha);
      ctx.fill();
      if (mesh.stroke !== false) {
        ctx.strokeStyle = mesh.stroke || shade(col, 0.45, mesh.alpha == null ? 0.9 : mesh.alpha);
        ctx.lineWidth = mesh.lw || 1.2;
        ctx.lineJoin = 'round';
        ctx.stroke();
      } else if (mesh.smooth) { // hide the seams between tube facets
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      if (sel) {
        ctx.strokeStyle = mesh.selColor || '#ffd166';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
      const dec = mesh.decals && mesh.decals[fi];
      if (dec && face.length >= 4 && !it.back) this.drawDecal(dec, cv[face[0]], cv[face[1]], cv[face[3]], it.lit);
    }
    if (this.opts.after) this.opts.after(ctx, this);
  };

  // map the unit square onto a projected face (corner 0 -> u, corner 3 -> v) and draw
  View3D.prototype.drawDecal = function (dec, p0, p1, p3, lit) {
    const ctx = this.ctx, dpr = this.dpr;
    ctx.save();
    ctx.setTransform(
      dpr * (p1[0] - p0[0]), dpr * (p1[1] - p0[1]),
      dpr * (p3[0] - p0[0]), dpr * (p3[1] - p0[1]),
      dpr * p0[0], dpr * p0[1]
    );
    if (dec.draw) dec.draw(ctx, lit);
    else if (dec.text != null) {
      ctx.fillStyle = dec.color || '#1b2140';
      ctx.font = 'bold ' + (dec.size || 0.62) + 'px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // text is drawn in a flipped frame (v grows "up" the face); flip back
      ctx.translate(0.5, 0.5);
      ctx.scale(1, -1);
      ctx.fillText(String(dec.text), 0, 0.04);
    }
    ctx.restore();
  };

  /* ---------- picking ---------- */

  View3D.prototype.pick = function (x, y) {
    for (let i = this.faces.length - 1; i >= 0; i--) {
      const it = this.faces[i];
      if (!it.mesh.pickable) continue;
      const pts = it.face.map((k) => it.cv[k]);
      if (inside([x, y], pts)) {
        return { mesh: it.mesh, face: it.fi, cell: it.mesh.faceCell ? it.mesh.faceCell[it.fi] : null, dir: it.mesh.faceDir ? it.mesh.faceDir[it.fi] : null };
      }
    }
    return null;
  };
  function inside(pt, poly) {
    let ins = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins;
    }
    return ins;
  }

  /* ---------- controls ---------- */

  View3D.prototype.local = function (ev) {
    const r = this.canvas.getBoundingClientRect();
    return [ev.clientX - r.left, ev.clientY - r.top];
  };

  View3D.prototype.bindEvents = function () {
    const cv = this.canvas;
    cv.style.touchAction = 'none';
    let start = null, moved = false, handler = null, last = null, pinch = null;
    cv.addEventListener('pointerdown', (ev) => {
      if (this.disabled) return;
      cv.setPointerCapture(ev.pointerId);
      this.pointers.set(ev.pointerId, this.local(ev));
      if (this.pointers.size === 2) {
        const [a, b] = Array.from(this.pointers.values());
        pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), dist: this.cam.dist };
        // a second finger turns a drag into a pinch: tell the engine its drag is over
        if (handler && this.opts.cancel) { try { this.opts.cancel(); } catch (e) { console.error(e); } }
        handler = null;
        return;
      }
      start = last = this.local(ev);
      moved = false;
      handler = null;
      if (this.opts.down && ev.button === 0 && !ev.shiftKey) {
        const hit = this.pick(start[0], start[1]);
        if (this.opts.down(hit, ev, start) === true) handler = true;
      }
    });
    cv.addEventListener('pointermove', (ev) => {
      if (!this.pointers.has(ev.pointerId)) {
        if (this.opts.hover) this.opts.hover(this.pick.apply(this, this.local(ev)), ev);
        return;
      }
      const p = this.local(ev);
      this.pointers.set(ev.pointerId, p);
      if (pinch && this.pointers.size === 2) {
        const [a, b] = Array.from(this.pointers.values());
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        this.cam.dist = Math.max(0.5, pinch.dist * pinch.d / Math.max(10, d));
        this.render();
        return;
      }
      if (!start) return;
      if (Math.hypot(p[0] - start[0], p[1] - start[1]) > 4) moved = true;
      if (handler) { if (this.opts.move) this.opts.move(ev, p); last = p; return; }
      const dx = p[0] - last[0], dy = p[1] - last[1];
      last = p;
      if (ev.buttons & 2 || ev.shiftKey || ev.buttons & 4) {
        const B = this.basis(), k = this.cam.dist / (this.h * 0.9);
        this.cam.target = V.add(this.cam.target, V.add(V.mul(B.r, -dx * k), V.mul(B.u, dy * k)));
      } else {
        this.cam.yaw -= dx * 0.45;
        this.cam.pitch = Math.max(this.cam.minPitch == null ? -89 : this.cam.minPitch, Math.min(this.cam.maxPitch == null ? 89 : this.cam.maxPitch, this.cam.pitch + dy * 0.45));
      }
      this.render();
      if (this.opts.orbit) this.opts.orbit(this.cam);
    });
    const end = (ev) => {
      if (!this.pointers.has(ev.pointerId)) return;
      this.pointers.delete(ev.pointerId);
      if (pinch) { if (this.pointers.size < 2) pinch = null; start = null; return; }
      const p = this.local(ev);
      if (handler) { if (this.opts.up) this.opts.up(ev, p, moved); }
      else if (!moved && start && this.opts.onPick && ev.type === 'pointerup') this.opts.onPick(this.pick(p[0], p[1]), ev);
      start = null; handler = null;
    };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    cv.addEventListener('contextmenu', (ev) => ev.preventDefault());
    cv.addEventListener('wheel', (ev) => {
      if (this.disabled) return;
      ev.preventDefault();
      this.cam.dist = Math.max(0.5, this.cam.dist * Math.exp(ev.deltaY * 0.0012));
      this.render();
    }, { passive: false });
  };

  View3D.prototype.zoom = function (k) { this.cam.dist = Math.max(0.5, this.cam.dist / k); this.render(); };

  // animate: fn(t) with t from 0 to 1 over ms, then done()
  // animate: fn(t) with t from 0 to 1 (eased) over ms, rendering each step, then done();
  // always finishes (even in a hidden tab) and returns a function that stops it
  View3D.prototype.animate = function (ms, fn, done) {
    return C.tween(ms, (t) => { fn(t); this.render(); }, done);
  };

  C.View3D = View3D;
})(typeof window !== 'undefined' ? window : globalThis);
