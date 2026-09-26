/* HYPER-CORE · ui/map.js
 *
 * Concept maps, the way HyperPhysics works: every page opens with its own
 * neighbourhood, and the whole discipline can be explored as one map.
 *
 *   Hyper.ui.localMap(node)  the page's map: what it is part of (above), what it
 *                            builds on (left), what it leads to (right), what it
 *                            contains (below). Every bubble is a link.
 *   #/map                    the radial map of everything, zoomable, searchable,
 *                            prerequisite links drawn for whatever you point at.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc;

  let mctx = null;
  function textW(s, size, weight) {
    if (!mctx) mctx = document.createElement('canvas').getContext('2d');
    mctx.font = (weight || 500) + ' ' + (size || 12.8) + 'px "Segoe UI", system-ui, sans-serif';
    return mctx.measureText(s).width;
  }
  function fit(s, max, size, weight) {
    if (textW(s, size, weight) <= max) return s;
    let t = s;
    while (t.length > 3 && textW(t + '…', size, weight) > max) t = t.slice(0, -1);
    return t.replace(/\s+$/, '') + '…';
  }

  /* ================================================================ local map */
  ui.localMap = function (node) {
    const VW = 940, PH = 30, GAP = 10, SLOT = PH + GAP;
    const item = (ref, kind) => {
      const r = H.ref(ref);
      if (r.local) {
        const n = H.nodes.get(r.id);
        if (!n) return null;
        return { ref, title: n.title, hue: n.hue, href: '#/c/' + n.id, local: true, kind, m: H.store.mastery(n.id) };
      }
      const d = H.DISCIPLINES[r.disc];
      return { ref, title: H.titleOf(ref), hue: d ? d.hue : 0, href: H.href(ref), local: false, kind, tag: d ? d.short.toUpperCase() : r.disc };
    };
    const uniq = arr => { const s = new Set(); return arr.filter(x => x && !s.has(x.ref) && s.add(x.ref)); };
    const parent = node.parent && H.nodes.has(node.parent) ? item(node.parent, 'parent') : null;
    const left = uniq(node.prereq.map(p => item(p, 'pre')));
    const leads = uniq(node.leadsTo.map(p => item(p, 'lead')).concat(H.usedIn(node.id).map(p => item(p, 'lead'))));
    const rel = uniq(node.related.concat(node.relatedBy).map(p => item(p, 'rel'))).filter(x => !leads.some(l => l.ref === x.ref) && !left.some(l => l.ref === x.ref));
    const kids = uniq(node.children.map(p => item(p, 'kid')));
    const MAXS = 7;
    const L = left.slice(0, MAXS), moreL = left.length - L.length;
    let R = leads.slice(0, 6);
    R = R.concat(rel.slice(0, Math.max(0, MAXS - R.length)));
    const moreR = leads.length + rel.length - R.length;
    const K = kids.slice(0, 12), moreK = kids.length - K.length;

    const pillW = it => Math.min(214, textW(it.title, 12.8) + (it.tag ? textW(it.tag + ' · ', 9.5, 600) : 0) + 34);
    // "see also" pills sit a little apart from "leads to" ones, under their own label
    const firstRel = R.findIndex(x => x.kind === 'rel');
    const relGap = firstRel > 0 ? 20 : 0;
    const leftH = (L.length + (moreL ? 1 : 0)) * SLOT, rightH = (R.length + (moreR ? 1 : 0)) * SLOT + relGap;
    const nSide = Math.max(leftH, rightH, SLOT) / SLOT;
    const topH = parent ? 64 : 14;
    const sideTop = topH + 26;
    const sideH = nSide * SLOT;
    const cy = sideTop + sideH / 2 - GAP / 2;
    const cx = VW / 2;
    const cw = Math.min(330, textW(node.title, 14.5, 700) + 48), ch = 40;
    // children in rows
    const rows = [];
    {
      let row = [], w = 0;
      for (const k of K) {
        const pw = pillW(k);
        if (row.length && w + pw + 12 > VW - 40) { rows.push(row); row = []; w = 0; }
        row.push(k); w += pw + 12;
      }
      if (row.length) rows.push(row);
    }
    const kidTop = sideTop + sideH + 36;
    const Htot = (rows.length ? kidTop + rows.length * SLOT + (moreK ? SLOT : 0) : sideTop + sideH) + 8;

    let edges = '', pills = '', hdr = '';
    const pill = (it, x, y, w) => {
      const title = fit(it.title, w - (it.tag ? textW(it.tag + ' · ', 9.5, 600) : 0) - 30, 12.8);
      return '<a href="' + esc(it.href) + '" data-ref="' + esc(it.ref) + '"><g class="pill' + (it.local ? '' : ' xd') + '" style="--h:' + it.hue + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')">' +
        '<rect width="' + w.toFixed(1) + '" height="' + PH + '" rx="' + PH / 2 + '"/>' +
        (it.local ? '<circle class="vd" cx="14" cy="' + PH / 2 + '" r="3.6" style="fill:' + (it.m >= 3 ? 'var(--ok)' : it.m >= 1 ? 'var(--bc)' : 'none') + ';stroke:' + (it.m >= 3 ? 'var(--ok)' : 'var(--bc)') + ';stroke-width:1.3"/>' : '') +
        '<text x="' + (it.local ? 24 : 13) + '" y="' + (PH / 2 + 4.5) + '">' + (it.tag ? '<tspan class="tag">' + esc(it.tag) + ' · </tspan>' : '') + esc(title) + '</text>' +
        '<title>' + esc(it.title) + '</title></g></a>';
    };
    const more = (n, x, y, anchor) => '<a href="#/c/' + node.id + '?s=links"><g class="more"><text x="' + x + '" y="' + (y + PH / 2 + 4) + '" text-anchor="' + anchor + '">+ ' + n + ' more</text></g></a>';
    const curve = (x1, y1, x2, y2, cls, arrow) => '<path class="edge ' + cls + '" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C' + ((x1 + x2) / 2).toFixed(1) + ' ' + y1.toFixed(1) + ' ' + ((x1 + x2) / 2).toFixed(1) + ' ' + y2.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"' + (arrow ? ' marker-end="url(#ah-' + node.id + ')"' : '') + '/>';
    const vcurve = (x1, y1, x2, y2, cls) => '<path class="edge ' + cls + '" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' C' + x1.toFixed(1) + ' ' + ((y1 + y2) / 2).toFixed(1) + ' ' + x2.toFixed(1) + ' ' + ((y1 + y2) / 2).toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '"/>';

    // left: builds on
    if (L.length) hdr += '<text class="hdr" x="' + 250 + '" y="' + (sideTop - 10) + '" text-anchor="end">Builds on</text>';
    L.forEach((it, i) => {
      const w = pillW(it), x = 250 - w, y = sideTop + i * SLOT + (sideH - leftH) / 2;
      pills += pill(it, x, y, w);
      edges += curve(250, y + PH / 2, cx - cw / 2 - 2, cy + ch / 2, it.local ? '' : 'x', true);
    });
    if (moreL) pills += more(moreL, 250, sideTop + L.length * SLOT + (sideH - leftH) / 2, 'end');
    // right: leads to, then see also
    const RX = VW - 250;
    if (R.length) {
      hdr += '<text class="hdr" x="' + RX + '" y="' + (sideTop - 10) + '">' + (leads.length ? 'Leads to' : 'See also') + '</text>';
    }
    R.forEach((it, i) => {
      const w = pillW(it), y = sideTop + i * SLOT + (firstRel > 0 && i >= firstRel ? relGap : 0) + (sideH - rightH) / 2;
      pills += pill(it, RX, y, w);
      edges += curve(cx + cw / 2, cy + ch / 2, RX - 2, y + PH / 2, it.kind === 'rel' ? 'rel' : (it.local ? '' : 'x'), it.kind !== 'rel');
      if (i === firstRel && i > 0) hdr += '<text class="hdr" x="' + RX + '" y="' + (y - 6) + '">See also</text>';
    });
    if (moreR) pills += more(moreR, RX, sideTop + R.length * SLOT + relGap + (sideH - rightH) / 2, 'start');
    // top: part of
    if (parent) {
      const w = pillW(parent);
      hdr += '<text class="hdr" x="' + cx + '" y="' + 12 + '" text-anchor="middle">Part of</text>';
      pills += pill(parent, cx - w / 2, 20, w);
      edges += vcurve(cx, 20 + PH, cx, cy, '');
    }
    // bottom: contains
    if (rows.length) {
      hdr += '<text class="hdr" x="' + cx + '" y="' + (kidTop - 12) + '" text-anchor="middle">Includes</text>';
      rows.forEach((row, ri) => {
        const ws = row.map(pillW);
        const total = ws.reduce((a, b) => a + b, 0) + 12 * (row.length - 1);
        let x = cx - total / 2;
        const y = kidTop + ri * SLOT;
        row.forEach((k, i) => {
          if (ri === 0) edges += vcurve(cx, cy + ch, x + ws[i] / 2, y, '');
          pills += pill(k, x, y, ws[i]);
          x += ws[i] + 12;
        });
      });
      if (moreK) pills += more(moreK, cx, kidTop + rows.length * SLOT, 'middle');
    }
    // centre
    const centre = '<g class="pill center" style="--h:' + node.hue + '" transform="translate(' + (cx - cw / 2).toFixed(1) + ' ' + cy.toFixed(1) + ')">' +
      '<rect width="' + cw.toFixed(1) + '" height="' + ch + '" rx="' + ch / 2 + '"/>' +
      '<text x="' + (cw / 2).toFixed(1) + '" y="' + (ch / 2 + 5) + '" text-anchor="middle">' + esc(fit(node.title, cw - 30, 14.5, 700)) + '</text></g>';
    const svg = '<svg viewBox="0 0 ' + VW + ' ' + Htot.toFixed(0) + '" role="img" aria-label="Concept map around ' + esc(node.title) + '">' +
      '<defs><marker id="ah-' + node.id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" style="fill:var(--faint)"/></marker></defs>' +
      edges + hdr + pills + centre + '</svg>';
    const card = ui.el('<div class="card cmap" style="--h:' + node.hue + '">' + svg +
      '<div class="cmap-legend"><a href="#/map?focus=' + node.id + '">' + H.icon('map', 13) + ' on the full map</a><a href="#/path/' + node.id + '">' + H.icon('route', 13) + ' path to here</a></div></div>');
    return card;
  };

  /* ================================================================ the whole map */
  H.views.map = function (parts, params) {
    ui.setTitle('Map');
    const view = ui.$('#view');
    const store = H.store;
    const root = H.root;
    // ---------- radial tree layout
    const leaves = new Map();
    (function count(id) {
      const n = H.nodes.get(id);
      let c = 0;
      for (const k of n.children) c += count(k);
      c = Math.max(1, c);
      leaves.set(id, c);
      return c;
    })(root.id);
    const maxDepth = Math.max(...H.list.map(n => n.depth));
    const RAD = d => d === 0 ? 0 : 170 + (d - 1) * Math.max(170, 230 - maxDepth * 10);
    const pos = new Map();
    (function place(id, a0, a1) {
      const n = H.nodes.get(id);
      const a = (a0 + a1) / 2, r = RAD(n.depth);
      pos.set(id, { x: r * Math.cos(a), y: r * Math.sin(a), a, r });
      let s = a0;
      const tot = leaves.get(id) - (n.children.length ? 0 : 1) || 1;
      for (const k of n.children) {
        const span = (a1 - a0) * leaves.get(k) / Math.max(1, n.children.reduce((q, c) => q + leaves.get(c), 0));
        place(k, s, s + span);
        s += span;
      }
    })(root.id, -Math.PI / 2, 3 * Math.PI / 2);
    const R = n => n.kind === 'root' ? 30 : n.kind === 'branch' ? 17 : n.kind === 'topic' ? 8.5 : 5.2;
    const P = id => pos.get(id);
    let edges = '', nodes = '';
    for (const n of H.list) {
      if (!n.parent || !pos.has(n.parent) || !pos.has(n.id)) continue;
      const p = P(n.parent), c = P(n.id);
      const rm = (p.r + c.r) / 2;
      const c1x = rm * Math.cos(p.a), c1y = rm * Math.sin(p.a), c2x = rm * Math.cos(c.a), c2y = rm * Math.sin(c.a);
      const d = n.depth === 1 ? 'M0 0L' + c.x.toFixed(1) + ' ' + c.y.toFixed(1)
        : 'M' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + c.x.toFixed(1) + ' ' + c.y.toFixed(1);
      edges += '<path class="e" data-e="' + n.id + '" style="--h:' + n.hue + '" d="' + d + '"/>';
    }
    for (const n of H.list) {
      const p = P(n.id);
      if (!p) continue;
      const r = R(n);
      let label;
      if (n.kind === 'root') label = '<text x="0" y="8" text-anchor="middle">' + esc(H.discipline.short) + '</text>';
      else if (n.kind === 'branch') {
        const out = r + 12;
        const lx = Math.cos(p.a) * out, ly = Math.sin(p.a) * out;
        const anchor = Math.abs(Math.cos(p.a)) < 0.3 ? 'middle' : Math.cos(p.a) > 0 ? 'start' : 'end';
        label = '<text x="' + lx.toFixed(1) + '" y="' + (ly + (Math.sin(p.a) > 0.3 ? 14 : Math.sin(p.a) < -0.3 ? -4 : 5)).toFixed(1) + '" text-anchor="' + anchor + '">' + esc(n.title) + '</text>';
      } else {
        // along the radius, never upside down
        let deg = p.a * 180 / Math.PI;
        const flip = Math.cos(p.a) < 0;
        if (flip) deg += 180;
        label = '<text transform="rotate(' + deg.toFixed(1) + ')" x="' + (flip ? -(r + 5) : r + 5) + '" y="4" text-anchor="' + (flip ? 'end' : 'start') + '">' + esc(fit(n.title, 170, n.kind === 'topic' ? 12.5 : 11, n.kind === 'topic' ? 600 : 500)) + '</text>';
      }
      nodes += '<g class="n k-' + n.kind + (n.kind === 'concept' ? ' m' + store.mastery(n.id) : '') + '" data-n="' + n.id + '" style="--h:' + n.hue + '" transform="translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')"><circle r="' + r + '"/>' + label + '</g>';
    }
    const ext = RAD(maxDepth) + 200;
    view.innerHTML =
      '<div class="mapview"><div class="mapstage"><svg class="gm z1"><g class="world"><g class="edges">' + edges + '</g><g class="xl"></g><g class="nodes">' + nodes + '</g></g></svg>' +
        '<div class="mapzoom"><button data-z="in" title="Zoom in">+</button><button data-z="out" title="Zoom out">−</button><button data-z="fit" title="Fit everything" style="font-size:13px">⤢</button></div>' +
        '<div class="maptip"></div></div>' +
      '<aside class="mapside">' +
        '<div><h3>Find on the map</h3><input type="search" class="msearch" placeholder="Type a concept…"></div>' +
        '<div><h3>Branches</h3><div class="legend">' + H.branches.map(b => '<label style="--h:' + b.hue + '"><input type="checkbox" checked data-b="' + b.id + '"><i></i><span>' + esc(b.title) + '</span><span class="faint small" style="margin-left:auto">' + H.conceptsUnder(b.id).length + '</span></label>').join('') + '</div></div>' +
        '<div><h3>Colour</h3><div class="legend"><label><input type="radio" name="mc" value="branch" checked> by branch</label><label><input type="radio" name="mc" value="progress"> by my progress</label></div></div>' +
        '<p class="small muted">Scroll to zoom, drag to move. Point at a concept to see what it builds on and what it leads to; click to open it.</p>' +
        '<p class="small faint">Filled rings are concepts you have visited, green ones you have mastered.</p>' +
      '</aside></div>';
    const stage = ui.$('.mapstage', view), svg = ui.$('svg', stage), world = ui.$('.world', svg), tip = ui.$('.maptip', stage), xl = ui.$('.xl', svg);
    // ---------- pan and zoom
    let k = 1, tx = 0, ty = 0;
    const apply = () => {
      world.setAttribute('transform', 'translate(' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ') scale(' + k.toFixed(4) + ')');
      svg.classList.toggle('z0', k < 0.5);
      svg.classList.toggle('z2', k >= 1.25);
    };
    const fitAll = () => {
      const W = stage.clientWidth, Hh = stage.clientHeight;
      k = Math.min(W, Hh) / (2 * ext);
      tx = W / 2; ty = Hh / 2;
      apply();
    };
    const zoomAt = (f, px, py) => {
      const nk = U.clamp(k * f, 0.12, 6);
      tx = px - (px - tx) * nk / k; ty = py - (py - ty) * nk / k; k = nk;
      apply();
    };
    const centreOn = (id, zk) => {
      const p = P(id);
      if (!p) return;
      const W = stage.clientWidth, Hh = stage.clientHeight;
      k = zk || Math.max(k, 1.4);
      tx = W / 2 - p.x * k; ty = Hh / 2 - p.y * k;
      apply();
    };
    stage.addEventListener('wheel', e => {
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    const ptrs = new Map();
    let dragged = false, pinch0 = null;
    stage.addEventListener('pointerdown', e => {
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stage.setPointerCapture(e.pointerId);
      dragged = false;
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), k }; }
    });
    stage.addEventListener('pointermove', e => {
      const prev = ptrs.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.clientX, y: e.clientY };
      if (ptrs.size === 1) {
        const dx = cur.x - prev.x, dy = cur.y - prev.y;
        if (Math.abs(dx) + Math.abs(dy) > 1) { dragged = true; stage.classList.add('drag'); }
        tx += dx; ty += dy; apply();
      } else if (ptrs.size === 2 && pinch0) {
        ptrs.set(e.pointerId, cur);
        const [a, b] = [...ptrs.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const r = stage.getBoundingClientRect();
        zoomAt((pinch0.k * d / pinch0.d) / k, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
        dragged = true;
      }
      ptrs.set(e.pointerId, cur);
    });
    const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null; stage.classList.remove('drag'); };
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    ui.$('.mapzoom', stage).addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      const W = stage.clientWidth, Hh = stage.clientHeight;
      if (b.dataset.z === 'in') zoomAt(1.4, W / 2, Hh / 2);
      else if (b.dataset.z === 'out') zoomAt(1 / 1.4, W / 2, Hh / 2);
      else fitAll();
    });
    // ---------- pointing at a node: its tree neighbours and prerequisite links
    const nodeEls = new Map(ui.$$('.n', svg).map(g => [g.dataset.n, g]));
    const edgeEls = new Map(ui.$$('.e', svg).map(p => [p.dataset.e, p]));
    const focus = id => {
      ui.$$('.hot', svg).forEach(x => x.classList.remove('hot'));
      xl.innerHTML = '';
      if (!id) { svg.classList.remove('focus'); tip.style.display = 'none'; return; }
      const n = H.nodes.get(id);
      svg.classList.add('focus');
      const hot = new Set([id]);
      n.path.forEach(x => hot.add(x));
      n.children.forEach(x => hot.add(x));
      const pre = n.prereq.map(H.ref).filter(r => r.local && pos.has(r.id)).map(r => r.id);
      const post = n.leadsTo.filter(x => pos.has(x));
      pre.concat(post).forEach(x => hot.add(x));
      hot.forEach(x => { const g = nodeEls.get(x); if (g) g.classList.add('hot'); const ed = edgeEls.get(x); if (ed && (n.path.includes(x) || n.children.includes(x) || x === id)) ed.classList.add('hot'); });
      const p = P(id);
      let h = '';
      for (const [list, col] of [[pre, 'var(--warn)'], [post, 'var(--accent)']]) {
        for (const x of list) {
          const q = P(x);
          const mx = (p.x + q.x) * 0.3, my = (p.y + q.y) * 0.3;
          h += '<path class="x hot" style="stroke:' + col + '" d="M' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + 'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + '"/>';
        }
      }
      xl.innerHTML = h;
      const br = n.branch && n.branch !== n.id ? H.nodes.get(n.branch).title + ' · ' : '';
      tip.innerHTML = '<b>' + esc(n.title) + '</b><span>' + esc(br) + H.inline(n.short || '') + '</span>' +
        (pre.length || post.length ? '<div class="small" style="margin-top:5px"><span style="color:var(--warn)">━</span> builds on ' + pre.length + ' &nbsp; <span style="color:var(--accent)">━</span> leads to ' + post.length + '</div>' : '');
      tip.style.display = 'block';
    };
    let hoverId = null;
    svg.addEventListener('pointerover', e => {
      const g = e.target.closest('.n');
      if (!g || ptrs.size) return;
      hoverId = g.dataset.n;
      focus(hoverId);
    });
    svg.addEventListener('pointermove', e => {
      if (tip.style.display === 'block') {
        const r = stage.getBoundingClientRect();
        let x = e.clientX - r.left + 16, y = e.clientY - r.top + 14;
        if (x + 290 > r.width) x -= 310;
        tip.style.left = x + 'px'; tip.style.top = y + 'px';
      }
    });
    svg.addEventListener('pointerout', e => {
      const g = e.target.closest('.n');
      if (g && !(e.relatedTarget && g.contains(e.relatedTarget))) { hoverId = null; focus(selected); }
    });
    let selected = null;
    svg.addEventListener('click', e => {
      if (dragged) return;
      const g = e.target.closest('.n');
      if (g) H.go('#/c/' + g.dataset.n);
    });
    // ---------- side panel
    const ms = ui.$('.msearch', view);
    ms.addEventListener('input', () => {
      const q = ms.value.trim().toLowerCase();
      nodeEls.forEach((g, id) => g.classList.toggle('match', !!q && H.nodes.get(id).title.toLowerCase().includes(q)));
    });
    ms.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const g = ui.$('.n.match', svg);
      if (g) { selected = g.dataset.n; centreOn(selected, 1.6); focus(selected); }
    });
    ui.$$('.legend input[data-b]', view).forEach(cb => cb.addEventListener('change', () => {
      const ids = new Set();
      (function walk(x) { ids.add(x); H.nodes.get(x).children.forEach(walk); })(cb.dataset.b);
      ids.forEach(x => { const g = nodeEls.get(x); if (g) g.classList.toggle('hide', !cb.checked); const ed = edgeEls.get(x); if (ed) ed.classList.toggle('hide', !cb.checked); });
      cb.closest('label').classList.toggle('off', !cb.checked);
    }));
    ui.$$('input[name=mc]', view).forEach(r => r.addEventListener('change', () => {
      const prog = ui.$('input[name=mc]:checked', view).value === 'progress';
      nodeEls.forEach((g, id) => {
        if (!prog) { g.style.removeProperty('--h'); g.style.setProperty('--h', H.nodes.get(id).hue); return; }
        const m = H.nodes.get(id).kind === 'concept' ? H.store.mastery(id) : -1;
        g.style.setProperty('--h', m === 3 ? 150 : m === 2 ? 48 : m === 1 ? 200 : m === 0 ? 230 : H.nodes.get(id).hue);
      });
    }));
    fitAll();
    const f = params.get('focus');
    if (f && pos.has(f)) { selected = f; centreOn(f, 1.5); focus(f); }
    const ro = new ResizeObserver(() => { if (!f) fitAll(); });
    ro.observe(stage);
    ui.onLeave(() => ro.disconnect());
  };
})();
