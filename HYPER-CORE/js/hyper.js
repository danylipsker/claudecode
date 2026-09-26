/* HYPER-CORE · hyper.js
 *
 * The namespace, the concept registry and the graph built from it.
 *
 *   Content files call  Hyper.add({...})       one or more concept nodes
 *                       Hyper.sim(id, {...})   an interactive simulation
 *                       Hyper.catalog(disc, [...])  titles of another discipline
 *   The app then calls  Hyper.build()          children, "leads to", branches, order
 *
 * Nothing here touches the DOM, so tools/validate.js can load it under Node.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};

  H.version = '1.0';
  H.nodes = new Map();      // id -> node, this discipline only
  H.list = [];              // nodes in the order they were added
  H.order = [];             // ids in reading order (pre-order walk of the tree)
  H.sims = {};              // id -> simulation definition
  H.catalogs = {};          // other discipline id -> Map(id -> {title, short, branch})
  H.errors = [];            // problems found while registering content
  H.discipline = null;      // set by Hyper.use(...) from the discipline's index.html

  /* The family of apps. `folder` is the sibling folder in the repository root,
     so a link into another discipline is ../FOLDER/index.html#/c/<id>. */
  H.DISCIPLINES = {
    physics:     { id: 'physics',     title: 'Hyper Physics',     short: 'Physics',     folder: 'HYPER-PHYSICS',     hue: 228, ready: true },
    math:        { id: 'math',        title: 'Hyper Math',        short: 'Math',        folder: 'HYPER-MATH',        hue: 168, ready: true },
    electronics: { id: 'electronics', title: 'Hyper Electronics', short: 'Electronics', folder: 'HYPER-ELECTRONICS', hue: 38,  ready: true },
    chemistry:   { id: 'chemistry',   title: 'Hyper Chemistry',   short: 'Chemistry',   folder: 'HYPER-CHEMISTRY',   hue: 320, ready: false }
  };

  H.use = function (id) {
    const d = H.DISCIPLINES[id];
    if (!d) throw new Error('Unknown discipline ' + id);
    H.discipline = d;
    return d;
  };

  const ARRAYS = ['prereq', 'related', 'keywords', 'formulas', 'examples', 'quiz',
                  'problems', 'ideas', 'pitfalls', 'applications'];

  /* Register concept nodes. Accepts nodes, arrays of nodes, or both. */
  H.add = function () {
    const flat = [];
    (function walk(a) { for (const x of a) Array.isArray(x) ? walk(x) : flat.push(x); })(arguments);
    for (const n of flat) {
      if (!n || typeof n.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(n.id)) {
        H.errors.push('Node with a missing or malformed id: ' + JSON.stringify(n && n.id));
        continue;
      }
      if (H.nodes.has(n.id)) { H.errors.push('Duplicate id: ' + n.id); continue; }
      if (!n.title) H.errors.push(n.id + ': missing title');
      n.kind = n.kind || 'concept';
      for (const k of ARRAYS) if (n[k] == null) n[k] = []; else if (!Array.isArray(n[k])) n[k] = [n[k]];
      n.sims = normSims(n.sim);
      n.level = n.level || 1;
      H.nodes.set(n.id, n);
      H.list.push(n);
    }
  };

  function normSims(s) {
    if (!s) return [];
    const a = Array.isArray(s) ? s : [s];
    return a.map(x => typeof x === 'string' ? { id: x, params: {} } : { id: x.id, params: x.params || {}, title: x.title });
  }

  /* Register a simulation: { title, blurb, mount(el, kit, params) -> cleanup fn } */
  H.sim = function (id, def) {
    if (H.sims[id]) H.errors.push('Duplicate simulation id: ' + id);
    def.id = id;
    H.sims[id] = def;
  };

  /* Titles of another discipline, so links into it read properly and search can find them.
     rows: [[id, title, short, branchTitle], ...] — written by tools/catalog.js */
  H.catalog = function (disc, rows) {
    const m = new Map();
    for (const r of rows) m.set(r[0], { id: r[0], title: r[1], short: r[2] || '', branch: r[3] || '', refs: r[4] || [] });
    H.catalogs[disc] = m;
  };

  /* Concepts of other disciplines that name `id` (of this discipline) as a prerequisite
     or related concept: "used in physics" on a maths page. -> ['physics:projectile-motion', ...] */
  H.usedIn = function (id) {
    const me = H.discipline && H.discipline.id + ':' + id;
    const out = [];
    for (const [disc, cat] of Object.entries(H.catalogs)) {
      if (H.discipline && disc === H.discipline.id) continue;
      for (const e of cat.values()) if (e.refs.includes(me)) out.push(disc + ':' + e.id);
    }
    return out;
  };

  /* ------------------------------------------------------------ references */

  /* 'math:derivative' -> {disc:'math', id:'derivative', local:false}; 'force' -> local */
  H.ref = function (s) {
    const i = s.indexOf(':');
    if (i < 0) return { disc: H.discipline ? H.discipline.id : null, id: s, local: true };
    const disc = s.slice(0, i), id = s.slice(i + 1);
    return { disc, id, local: !!H.discipline && disc === H.discipline.id };
  };

  H.href = function (s) {
    const r = H.ref(s);
    if (r.local) return '#/c/' + r.id;
    const d = H.DISCIPLINES[r.disc];
    return '../' + (d ? d.folder : r.disc) + '/index.html#/c/' + r.id;
  };

  /* What a reference is called: the node's title, the catalog's, or a tidied id. */
  H.titleOf = function (s) {
    const r = H.ref(s);
    if (r.local) { const n = H.nodes.get(r.id); return n ? n.title : H.util.prettyId(r.id); }
    const c = H.catalogs[r.disc];
    const e = c && c.get(r.id);
    return e ? e.title : H.util.prettyId(r.id);
  };

  H.exists = function (s) {
    const r = H.ref(s);
    if (r.local) return H.nodes.has(r.id);
    const c = H.catalogs[r.disc];
    return c ? c.has(r.id) : null;   // null: cannot tell, that discipline is not loaded
  };

  /* ------------------------------------------------------------ the graph */

  H.build = function () {
    for (const n of H.list) { n.children = []; n.leadsTo = []; n.relatedBy = []; }
    for (const n of H.list) {
      if (n.parent) {
        const p = H.nodes.get(n.parent);
        if (p) p.children.push(n.id); else H.errors.push(n.id + ': parent "' + n.parent + '" does not exist');
      }
    }
    for (const n of H.list) {
      for (const p of n.prereq) {
        const r = H.ref(p);
        if (!r.local) continue;
        const pn = H.nodes.get(r.id);
        if (pn) { if (!pn.leadsTo.includes(n.id)) pn.leadsTo.push(n.id); }
        else H.errors.push(n.id + ': prerequisite "' + p + '" does not exist');
      }
      for (const q of n.related) {
        const r = H.ref(q);
        if (!r.local) continue;
        const qn = H.nodes.get(r.id);
        if (qn) { if (!qn.related.includes(n.id) && !qn.relatedBy.includes(n.id)) qn.relatedBy.push(n.id); }
        else H.errors.push(n.id + ': related "' + q + '" does not exist');
      }
    }
    // children keep the order they were added in unless a node gives `order`
    const pos = new Map(H.list.map((n, i) => [n.id, i]));
    for (const n of H.list) {
      n.children.sort((a, b) => {
        const A = H.nodes.get(a), B = H.nodes.get(b);
        const oa = A.order != null ? A.order : 1e6, ob = B.order != null ? B.order : 1e6;
        return oa - ob || pos.get(a) - pos.get(b);
      });
    }
    // depth, branch, path
    for (const n of H.list) {
      const path = [];
      let c = n, guard = 0;
      while (c && guard++ < 50) { path.unshift(c.id); c = c.parent ? H.nodes.get(c.parent) : null; }
      if (guard >= 50) H.errors.push(n.id + ': parent chain loops');
      n.path = path;
      n.depth = path.length - 1;
      const b = path.map(id => H.nodes.get(id)).find(x => x.kind === 'branch');
      n.branch = b ? b.id : null;
    }
    // reading order: pre-order from every root
    H.order = [];
    const seen = new Set();
    (function walk(ids) {
      for (const id of ids) {
        if (seen.has(id)) continue;
        seen.add(id); H.order.push(id);
        walk(H.nodes.get(id).children);
      }
    })(H.list.filter(n => !n.parent || !H.nodes.has(n.parent)).map(n => n.id));
    H.root = H.list.find(n => n.kind === 'root') || H.list[0];
    H.branches = H.root ? H.root.children.map(id => H.nodes.get(id)).filter(n => n.kind === 'branch') : [];
    H.branches.forEach((b, i) => { if (b.hue == null) b.hue = (i * 360 / Math.max(1, H.branches.length) + 210) % 360; });
    for (const n of H.list) n.hue = n.branch ? H.nodes.get(n.branch).hue : (n.hue != null ? n.hue : (H.discipline ? H.discipline.hue : 220));
    return H;
  };

  /* Every local prerequisite of `id`, transitively, in an order that can be studied
     front to back (a prerequisite always comes before what needs it). */
  H.pathTo = function (id) {
    const out = [], state = new Map();
    (function visit(x) {
      if (state.get(x) === 2) return;
      if (state.get(x) === 1) return;          // a cycle in the content: ignore the back edge
      state.set(x, 1);
      const n = H.nodes.get(x);
      if (n) {
        const pre = n.prereq.map(H.ref).filter(r => r.local && H.nodes.has(r.id)).map(r => r.id);
        pre.sort((a, b) => H.order.indexOf(a) - H.order.indexOf(b));
        pre.forEach(visit);
      }
      state.set(x, 2);
      out.push(x);
    })(id);
    return out;
  };

  /* A round spacing for about n grid lines across a span: 1, 2 or 5 times a power of ten */
  H.niceStep = function (span, n) {
    const raw = Math.abs(span) / (n || 6) || 1;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  };

  /* ------------------------------------------------------------ utilities */

  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺' };

  H.util = {
    esc(s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    prettyId(id) {
      const s = id.replace(/-/g, ' ');
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    clamp(x, a, b) { return x < a ? a : x > b ? b : x; },
    /* A number to `sig` significant figures, trailing zeros removed.
       Very large or small numbers use "1.23 × 10⁻⁵" (plain text). */
    fmt(v, sig) {
      sig = sig || 4;
      if (v == null || Number.isNaN(v)) return '—';
      if (!Number.isFinite(v)) return v > 0 ? '∞' : '−∞';
      if (v === 0) return '0';
      const a = Math.abs(v);
      if (a >= 1e-3 && a < 1e6) {
        let s = Number(v.toPrecision(sig)).toString();
        if (/e/.test(s)) s = v.toPrecision(sig);
        return s.replace('-', '−');
      }
      const e = Math.floor(Math.log10(a));
      let m = v / Math.pow(10, e);
      m = Number(m.toPrecision(sig));
      if (Math.abs(m) >= 10) { m /= 10; return H.util.fmtMant(m, sig) + ' × 10' + H.util.sup(e + 1); }
      return H.util.fmtMant(m, sig) + ' × 10' + H.util.sup(e);
    },
    fmtMant(m, sig) { return Number(m.toPrecision(sig)).toString().replace('-', '−'); },
    sup(n) { return String(n).split('').map(c => SUP[c] || c).join(''); },
    /* The same number as TeX */
    fmtTex(v, sig) {
      sig = sig || 4;
      if (v == null || Number.isNaN(v)) return '?';
      if (!Number.isFinite(v)) return v > 0 ? '\\infty' : '-\\infty';
      if (v === 0) return '0';
      const a = Math.abs(v);
      if (a >= 1e-3 && a < 1e6) return Number(v.toPrecision(sig)).toString();
      let e = Math.floor(Math.log10(a));
      let m = Number((v / Math.pow(10, e)).toPrecision(sig));
      if (Math.abs(m) >= 10) { m /= 10; e += 1; }
      return Number(m.toPrecision(sig)) + ' \\times 10^{' + e + '}';
    },
    /* A number as a plain editable string (for input boxes) */
    fmtInput(v, sig) {
      sig = sig || 6;
      if (v == null || !Number.isFinite(v)) return '';
      if (v === 0) return '0';
      const a = Math.abs(v);
      if (a >= 1e-4 && a < 1e9) return String(Number(v.toPrecision(sig)));
      return v.toExponential(sig - 1).replace(/\.?0+e/, 'e');
    },
    /* Round to a "nice" value with `sig` significant figures (for generated problems) */
    nice(v, sig) {
      if (!v) return 0;
      const e = Math.floor(Math.log10(Math.abs(v))) - (sig - 1);
      const f = Math.pow(10, e);
      return Math.round(v / f) * f;
    },
    /* Deterministic random numbers (mulberry32) so a problem can be rebuilt from its seed */
    rng(seed) {
      let a = seed >>> 0;
      return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    },
    hash(s) {
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
      return h >>> 0;
    },
    debounce(fn, ms) {
      let t = 0;
      return function () { clearTimeout(t); const a = arguments, self = this; t = setTimeout(() => fn.apply(self, a), ms); };
    },
    plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
