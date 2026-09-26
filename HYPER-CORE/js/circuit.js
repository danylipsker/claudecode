/* HYPER-CORE · circuit.js
 *
 * A small circuit simulator (modified nodal analysis), so electronics simulations
 * compute what a real circuit does instead of approximating it by hand.
 *
 *   const c = new Hyper.Circuit();
 *   const V1 = c.V('in', 'gnd', 12);              // + terminal first; value or function of time t
 *   const R1 = c.R('in', 'out', 10e3);
 *   const R2 = c.R('out', 'gnd', 10e3);
 *   c.dc();                                       // operating point
 *   c.v('out')  -> 6        R1.i -> 0.6 mA (from its first node to its second)   V1.i -> current out of +
 *
 *   transient:  c.reset(); for (...) c.step(1e-5);  c.t, c.v('out')      (C and L keep their state)
 *   AC sweep:   c.ac(1000) -> { v(name) -> {re, im, mag, phase} }        (sources with {ac: amplitude})
 *
 * Elements: R, C, L, V, I, D (diode, LED, Zener), SW (switch), NPN, PNP, NMOS, PMOS,
 * OPAMP (rails, optional gain–bandwidth), VCVS. Nonlinear parts are solved by Newton's
 * method with voltage limiting; AC analysis linearises them at the DC operating point.
 * Ground is '0', 'gnd' or 'GND'. Nothing here touches the DOM.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const VT = 0.025852;          // thermal voltage at 300 K
  const GMIN = 1e-12;

  /* ---------------------------------------------------------------- linear algebra */
  function solveReal(A, b, n) {
    // A: Float64Array n*n (row-major), b: Float64Array n; Gaussian elimination, partial pivoting
    for (let k = 0; k < n; k++) {
      let p = k, max = Math.abs(A[k * n + k]);
      for (let r = k + 1; r < n; r++) { const v = Math.abs(A[r * n + k]); if (v > max) { max = v; p = r; } }
      if (max < 1e-300) return null;
      if (p !== k) {
        for (let c = k; c < n; c++) { const t = A[k * n + c]; A[k * n + c] = A[p * n + c]; A[p * n + c] = t; }
        const t = b[k]; b[k] = b[p]; b[p] = t;
      }
      const d = A[k * n + k];
      for (let r = k + 1; r < n; r++) {
        const f = A[r * n + k] / d;
        if (f === 0) continue;
        for (let c = k; c < n; c++) A[r * n + c] -= f * A[k * n + c];
        b[r] -= f * b[k];
      }
    }
    const x = new Float64Array(n);
    for (let r = n - 1; r >= 0; r--) {
      let s = b[r];
      for (let c = r + 1; c < n; c++) s -= A[r * n + c] * x[c];
      x[r] = s / A[r * n + r];
    }
    return x;
  }
  function solveComplex(Ar, Ai, br, bi, n) {
    for (let k = 0; k < n; k++) {
      let p = k, max = Math.hypot(Ar[k * n + k], Ai[k * n + k]);
      for (let r = k + 1; r < n; r++) { const v = Math.hypot(Ar[r * n + k], Ai[r * n + k]); if (v > max) { max = v; p = r; } }
      if (max < 1e-300) return null;
      if (p !== k) {
        for (let c = k; c < n; c++) {
          let t = Ar[k * n + c]; Ar[k * n + c] = Ar[p * n + c]; Ar[p * n + c] = t;
          t = Ai[k * n + c]; Ai[k * n + c] = Ai[p * n + c]; Ai[p * n + c] = t;
        }
        let t = br[k]; br[k] = br[p]; br[p] = t; t = bi[k]; bi[k] = bi[p]; bi[p] = t;
      }
      const dr = Ar[k * n + k], di = Ai[k * n + k], dd = dr * dr + di * di;
      for (let r = k + 1; r < n; r++) {
        const ar = Ar[r * n + k], ai = Ai[r * n + k];
        if (ar === 0 && ai === 0) continue;
        const fr = (ar * dr + ai * di) / dd, fi = (ai * dr - ar * di) / dd;       // f = a / d
        for (let c = k; c < n; c++) {
          const xr = Ar[k * n + c], xi = Ai[k * n + c];
          Ar[r * n + c] -= fr * xr - fi * xi; Ai[r * n + c] -= fr * xi + fi * xr;
        }
        const yr = br[k], yi = bi[k];
        br[r] -= fr * yr - fi * yi; bi[r] -= fr * yi + fi * yr;
      }
    }
    const xr = new Float64Array(n), xi = new Float64Array(n);
    for (let r = n - 1; r >= 0; r--) {
      let sr = br[r], si = bi[r];
      for (let c = r + 1; c < n; c++) {
        const ar = Ar[r * n + c], ai = Ai[r * n + c];
        sr -= ar * xr[c] - ai * xi[c]; si -= ar * xi[c] + ai * xr[c];
      }
      const dr = Ar[r * n + r], di = Ai[r * n + r], dd = dr * dr + di * di;
      xr[r] = (sr * dr + si * di) / dd; xi[r] = (si * dr - sr * di) / dd;
    }
    return { re: xr, im: xi };
  }

  /* limit a junction voltage step so exp() cannot explode (SPICE's pnjlim, simplified) */
  function limit(vnew, vold, nvt) {
    const vcrit = nvt * Math.log(nvt / (Math.SQRT2 * 1e-14));
    if (vnew > vcrit && Math.abs(vnew - vold) > 2 * nvt) {
      if (vold > 0) {
        const arg = 1 + (vnew - vold) / nvt;
        vnew = arg > 0 ? vold + nvt * Math.log(arg) : vcrit;
      } else vnew = nvt * Math.log(vnew / nvt);
    }
    return vnew;
  }
  const expc = x => x > 80 ? Math.exp(80) * (1 + x - 80) : Math.exp(x);   // exp that stops growing wildly
  const dexpc = x => x > 80 ? Math.exp(80) : Math.exp(x);

  /* ---------------------------------------------------------------- the circuit */
  class Circuit {
    /* opts.method: 'euler' (backward Euler, the default: robust with switches and diodes) or
       'trap' (trapezoidal: no artificial damping, for ringing LC and RLC circuits) */
    constructor(opts) {
      this.method = (opts && opts.method) || 'euler';
      this.names = new Map([['0', 0], ['gnd', 0], ['GND', 0]]);
      this.count = 1;
      this.els = [];
      this.t = 0;
      this.x = null;            // last solution: node voltages then branch currents
      this.mode = 'dc';
      this.ok = true;
    }
    node(name) {
      if (name === 0 || name === '0' || name === 'gnd' || name === 'GND') return 0;
      name = String(name);
      if (!this.names.has(name)) this.names.set(name, this.count++);
      return this.names.get(name);
    }
    add(e) { e.i = 0; e.p = 0; this.els.push(e); this.x = null; return e; }
    R(a, b, r, name) { return this.add({ type: 'R', a: this.node(a), b: this.node(b), r: r, name }); }
    C(a, b, c, v0, name) { return this.add({ type: 'C', a: this.node(a), b: this.node(b), c: c, v0: v0 || 0, vprev: v0 || 0, name }); }
    L(a, b, l, i0, name) { return this.add({ type: 'L', a: this.node(a), b: this.node(b), l: l, i0: i0 || 0, iprev: i0 || 0, branch: true, name }); }
    V(p, n, v, o) { o = o || {}; return this.add({ type: 'V', a: this.node(p), b: this.node(n), v: v, ac: o.ac || 0, phase: o.phase || 0, r: o.r || 0, branch: true, name: o.name }); }
    I(from, to, i, o) { o = o || {}; return this.add({ type: 'I', a: this.node(from), b: this.node(to), iv: i, ac: o.ac || 0, name: o.name }); }
    /* diode anode→cathode. o: {is, n, vz (Zener voltage: ibv = 1 mA flows backwards at vz), ibv} . LED: {is: 1e-18, n: 2} ≈ 1.8–2 V */
    D(a, k, o, name) {
      o = o || {};
      // series resistance {rs}: an internal node between the resistance and the junction
      let an = a;
      if (o.rs) { an = '#d' + this.els.length + '_' + this.count; this.R(a, an, o.rs); }
      return this.add({ type: 'D', a: this.node(an), b: this.node(k), is: o.is || 1e-14, n: o.n || 1, vz: o.vz || 0, ibv: o.ibv || 1e-3, rs: o.rs || 0, vd: 0, name });
    }
    /* ideal transformer: primary p1–n1, secondary p2–n2, v2 = ratio · v1 (ratio = N2/N1).
       Add winding resistance or magnetising inductance as ordinary R and L elements. */
    XFMR(p1, n1, p2, n2, ratio, name) {
      return this.add({ type: 'X', a: this.node(p2), b: this.node(n2), p1: this.node(p1), n1: this.node(n1), ratio, branch: true, name });
    }
    SW(a, b, closed, o) { o = o || {}; return this.add({ type: 'SW', a: this.node(a), b: this.node(b), closed: !!closed, ron: o.ron || 1e-3, roff: o.roff || 1e12, name: o.name }); }
    NPN(c, b, e, o) { return this.bjt(c, b, e, o, 1); }
    PNP(c, b, e, o) { return this.bjt(c, b, e, o, -1); }
    bjt(c, b, e, o, pol) {
      o = o || {};
      return this.add({ type: 'Q', c: this.node(c), bn: this.node(b), e: this.node(e), pol, is: o.is || 1e-14, bf: o.beta || o.bf || 100, br: o.br || 1, vbe: 0, vbc: 0, ic: 0, ib: 0, ie: 0, name: o.name });
    }
    /* MOSFET, square law: {vt: threshold (positive number for both kinds), k: transconductance parameter A/V², lambda} */
    NMOS(d, g, s, o) { return this.mos(d, g, s, o, 1); }
    PMOS(d, g, s, o) { return this.mos(d, g, s, o, -1); }
    mos(d, g, s, o, pol) {
      o = o || {};
      return this.add({ type: 'M', d: this.node(d), g: this.node(g), s: this.node(s), pol, vt: o.vt != null ? o.vt : 2, k: o.k || 0.5, lambda: o.lambda != null ? o.lambda : 0.01, id: 0, name: o.name });
    }
    /* op-amp: output out, inputs + and −. o: {gain: 1e5, vpos: 15, vneg: -15, gbw: Hz (optional, adds the dominant pole), rout: 10} */
    OPAMP(inp, inn, out, o) {
      o = o || {};
      return this.add({ type: 'OA', inp: this.node(inp), inn: this.node(inn), out: this.node(out), gain: o.gain || 1e5, vpos: o.vpos != null ? o.vpos : 15, vneg: o.vneg != null ? o.vneg : -15,
                        gbw: o.gbw || 0, sr: o.sr || 0, rout: o.rout != null ? o.rout : 1, vint: 0, state: -1, branch: true, name: o.name });
    }
    VCVS(op, on, ip, inn, gain, name) { return this.add({ type: 'E', a: this.node(op), b: this.node(on), inp: this.node(ip), inn: this.node(inn), gain, branch: true, name }); }

    /* ---------------------------------------------------------------- building the equations */
    index() {
      let k = this.count - 1;
      for (const e of this.els) if (e.branch) e.k = k++;
      this.size = k;
    }
    vof(x, node) { return node === 0 ? 0 : x[node - 1]; }
    valueOf(e) { return typeof e.v === 'function' ? e.v(this.t) : e.v; }
    ivalueOf(e) { return typeof e.iv === 'function' ? e.iv(this.t) : e.iv; }

    stamp(A, b, x, dt) {
      const n = this.size;
      const G = (i, j, g) => { if (i && j) A[(i - 1) * n + (j - 1)] += g; };
      const cond = (a, c, g) => { G(a, a, g); G(c, c, g); G(a, c, -g); G(c, a, -g); };
      const Ib = (node, i) => { if (node) b[node - 1] += i; };        // current injected into node
      const Bk = (row, col, v) => { A[row * n + col] += v; };
      for (let i = 1; i < this.count; i++) G(i, i, GMIN);
      for (const e of this.els) {
        switch (e.type) {
          case 'R': cond(e.a, e.b, 1 / Math.max(e.r, 1e-9)); break;
          case 'SW': cond(e.a, e.b, 1 / (e.closed ? e.ron : e.roff)); break;
          case 'C':
            if (dt) {
              const trap = this._trap, g = (trap ? 2 : 1) * e.c / dt, ieq = g * e.vprev + (trap ? e.iprev || 0 : 0);
              cond(e.a, e.b, g); Ib(e.a, ieq); Ib(e.b, -ieq);
            }
            break;                                                    // open in DC
          case 'L': {
            const k = e.k;
            if (e.a) { Bk(e.a - 1, k, 1); Bk(k, e.a - 1, 1); }
            if (e.b) { Bk(e.b - 1, k, -1); Bk(k, e.b - 1, -1); }
            if (dt) {
              const trap = this._trap, z = (trap ? 2 : 1) * e.l / dt;
              Bk(k, k, -z); b[k] += -z * e.iprev - (trap ? e.vprevL || 0 : 0);
            }
            break;                                                    // DC: v = 0 (a short)
          }
          case 'V': {
            const k = e.k;
            if (e.a) { Bk(e.a - 1, k, 1); Bk(k, e.a - 1, 1); }
            if (e.b) { Bk(e.b - 1, k, -1); Bk(k, e.b - 1, -1); }
            if (e.r) Bk(k, k, -e.r);                                  // internal resistance: v_a − v_b = V − r·i
            b[k] += this.valueOf(e);
            break;
          }
          case 'I': { const i = this.ivalueOf(e); Ib(e.a, -i); Ib(e.b, i); break; }
          case 'E': {
            const k = e.k;
            if (e.a) { Bk(e.a - 1, k, 1); Bk(k, e.a - 1, 1); }
            if (e.b) { Bk(e.b - 1, k, -1); Bk(k, e.b - 1, -1); }
            if (e.inp) Bk(k, e.inp - 1, -e.gain);
            if (e.inn) Bk(k, e.inn - 1, e.gain);
            break;
          }
          case 'X': {
            // secondary is a controlled source v2 = n·v1; the primary draws −n times its current
            const k = e.k, n = e.ratio;
            if (e.a) { Bk(e.a - 1, k, 1); Bk(k, e.a - 1, 1); }
            if (e.b) { Bk(e.b - 1, k, -1); Bk(k, e.b - 1, -1); }
            if (e.p1) { Bk(k, e.p1 - 1, -n); Bk(e.p1 - 1, k, -n); }
            if (e.n1) { Bk(k, e.n1 - 1, n); Bk(e.n1 - 1, k, n); }
            break;
          }
          case 'D': {
            const nvt = e.n * VT;
            const vd = e.vd;
            let i = e.is * (expc(vd / nvt) - 1), g = e.is / nvt * dexpc(vd / nvt);
            if (e.vz) { const u = -(vd + e.vz) / VT; i -= e.ibv * expc(u); g += e.ibv / VT * dexpc(u); }
            g += GMIN;
            cond(e.a, e.b, g);
            const ieq = i - g * vd;
            Ib(e.a, -ieq); Ib(e.b, ieq);
            e.g = g;
            break;
          }
          case 'Q': {
            const p = e.pol, vbe = e.vbe, vbc = e.vbc;
            const eF = expc(vbe / VT), eR = expc(vbc / VT), dF = dexpc(vbe / VT) / VT, dR = dexpc(vbc / VT) / VT;
            const ic = e.is * (eF - eR) - e.is / e.br * (eR - 1);
            const ib = e.is / e.bf * (eF - 1) + e.is / e.br * (eR - 1);
            const icF = e.is * dF, icR = -e.is * dR - e.is / e.br * dR;      // dIc/dvbe, dIc/dvbc
            const ibF = e.is / e.bf * dF, ibR = e.is / e.br * dR;
            // currents leaving nodes C, B into the device (times polarity); vbe = p(vB − vE), vbc = p(vB − vC)
            const row = (node, i0, dF_, dR_) => {
              if (!node) return;
              const r = node - 1;
              // i = p·[i0 + dF(vbe − vbe0) + dR(vbc − vbc0)],  vbe = p(vB − vE)
              if (e.bn) A[r * n + e.bn - 1] += (dF_ + dR_);
              if (e.e) A[r * n + e.e - 1] -= dF_;
              if (e.c) A[r * n + e.c - 1] -= dR_;
              b[r] -= p * (i0 - dF_ * vbe - dR_ * vbc);
            };
            row(e.c, ic, icF, icR);
            row(e.bn, ib, ibF, ibR);
            row(e.e, -(ic + ib), -(icF + ibF), -(icR + ibR));
            e.gm = icF; e.gpi = ibF;
            break;
          }
          case 'M': {
            const p = e.pol;
            let vd = this.vof(x, e.d), vs = this.vof(x, e.s);
            const vg = this.vof(x, e.g);
            // source is the lower terminal (for NMOS; higher for PMOS)
            let D = e.d, S = e.s;
            if (p * (vd - vs) < 0) { D = e.s; S = e.d; const t = vd; vd = vs; vs = t; }
            const vgs = p * (vg - vs), vds = p * (vd - vs);
            // smooth overdrive (softplus) so the switch-on is differentiable
            const s = 2 * VT, u = (vgs - e.vt) / s;
            const vov = u > 30 ? vgs - e.vt : s * Math.log1p(Math.exp(u));
            const dvov = u > 30 ? 1 : 1 / (1 + Math.exp(-u));
            let id, gm, gds;
            const cl = 1 + e.lambda * vds;
            if (vds < vov) { id = e.k * (vov * vds - vds * vds / 2) * cl; gm = e.k * vds * cl * dvov; gds = e.k * (vov - vds) * cl + e.k * (vov * vds - vds * vds / 2) * e.lambda; }
            else { id = e.k / 2 * vov * vov * cl; gm = e.k * vov * cl * dvov; gds = e.k / 2 * vov * vov * e.lambda; }
            gds += GMIN;
            // current leaving node D = p·id; linearised in vgs = p(vg − vs), vds = p(vd − vs)
            const rowM = (node, sign) => {
              if (!node) return;
              const r = node - 1;
              if (e.g) A[r * n + e.g - 1] += sign * gm;
              if (D) A[r * n + D - 1] += sign * gds;
              if (S) A[r * n + S - 1] -= sign * (gm + gds);
              b[r] -= sign * p * (id - gm * vgs - gds * vds);
            };
            rowM(D, 1);
            rowM(S, -1);
            e.id = p * id * (D === e.d ? 1 : -1); e.gm = gm; e.gds = gds; e.vgs = vgs; e.vds = vds;
            break;
          }
          case 'OA': {
            // piecewise: linear (v = c0 + c1·vd) or held at a bound; solve() picks the consistent state
            const k = e.k, pw = this.oaPiece(e, dt);
            if (e.out) { Bk(e.out - 1, k, 1); Bk(k, e.out - 1, 1); }
            Bk(k, k, -e.rout);                                        // v_out − rout·i = …
            if (e.state === 0) {
              if (e.inp) Bk(k, e.inp - 1, -pw.c1);
              if (e.inn) Bk(k, e.inn - 1, pw.c1);
              b[k] += pw.c0;
            } else b[k] += e.state > 0 ? pw.hi : pw.lo;
            break;
          }
        }
      }
    }

    /* the op-amp's output as a function of its differential input, in pieces:
       linear v = c0 + c1·vd between the bounds lo and hi (the rails, and the slew limit) */
    oaPiece(e, dt) {
      if (dt && e.sr) {
        // integrator macro-model: dv/dt = ωt·vd − v/τ (finite DC gain), slewing at most sr
        const wt = 2 * Math.PI * (e.gbw || 1e6), a = dt * wt / e.gain;
        return { c0: e.vint / (1 + a), c1: dt * wt / (1 + a), lo: Math.max(e.vneg, e.vint - e.sr * dt), hi: Math.min(e.vpos, e.vint + e.sr * dt) };
      }
      if (dt && e.gbw) {
        // dominant pole: τ dv/dt = A·vd − v, backward Euler
        const a = dt * 2 * Math.PI * e.gbw / e.gain;
        return { c0: e.vint / (1 + a), c1: e.gain * a / (1 + a), lo: e.vneg, hi: e.vpos };
      }
      return { c0: 0, c1: e.gain, lo: e.vneg, hi: e.vpos };
    }

    /* Newton iterations at the present time; dt = 0 for DC */
    solve(dt) {
      if (this.size == null || this.x === null || this.x.length !== this.size) { this.index(); this.x = new Float64Array(this.size); }
      const n = this.size;
      let x = this.x, ok = false;
      const nonlinear = this.els.some(e => e.type === 'D' || e.type === 'Q' || e.type === 'M' || e.type === 'OA');
      for (let it = 0; it < (nonlinear ? 200 : 1); it++) {
        const A = new Float64Array(n * n), b = new Float64Array(n);
        this.stamp(A, b, x, dt);
        const nx = solveReal(A, b, n);
        if (!nx) { this.ok = false; return false; }
        // update junction voltages with limiting
        let conv = true;
        for (const e of this.els) {
          if (e.type === 'D') {
            const vnew = this.vof(nx, e.a) - this.vof(nx, e.b);
            let lim = limit(vnew, e.vd, e.n * VT);
            if (e.vz) lim = -limit(-(lim + e.vz), -(e.vd + e.vz), VT) - e.vz;
            if (Math.abs(lim - e.vd) > 1e-6 + 1e-6 * Math.abs(lim)) conv = false;
            e.vd = lim;
          } else if (e.type === 'OA') {
            // is the assumed state consistent with the solution? A saturated op-amp only leaves
            // saturation through the linear state, never straight to the other rail
            const vd = this.vof(nx, e.inp) - this.vof(nx, e.inn);
            const pw = this.oaPiece(e, dt), lin = pw.c0 + pw.c1 * vd, tol = 1e-9 * (1 + Math.abs(pw.hi) + Math.abs(pw.lo));
            let st = e.state;
            if (st === 0) { if (lin > pw.hi + tol) st = 1; else if (lin < pw.lo - tol) st = -1; }
            else if (st === 1) { if (lin < pw.hi - tol) st = 0; }
            else if (lin > pw.lo + tol) st = 0;
            if (st !== e.state) { e.state = st; conv = false; e.flips = (e.flips || 0) + 1; }
          } else if (e.type === 'Q') {
            const vbe = e.pol * (this.vof(nx, e.bn) - this.vof(nx, e.e)), vbc = e.pol * (this.vof(nx, e.bn) - this.vof(nx, e.c));
            const lbe = limit(vbe, e.vbe, VT), lbc = limit(vbc, e.vbc, VT);
            if (Math.abs(lbe - e.vbe) > 1e-6 || Math.abs(lbc - e.vbc) > 1e-6) conv = false;
            e.vbe = lbe; e.vbc = lbc;
          }
        }
        let dmax = 0;
        for (let k = 0; k < n; k++) dmax = Math.max(dmax, Math.abs(nx[k] - x[k]) / (1 + Math.abs(nx[k])));
        x = nx;
        if (!nonlinear || (conv && dmax < 1e-9)) { ok = true; break; }
      }
      this.x = x;
      this.ok = ok;
      this.currents(dt);
      return ok;
    }

    currents(dt) {
      const x = this.x, v = n => this.vof(x, n);
      for (const e of this.els) {
        switch (e.type) {
          case 'R': e.i = (v(e.a) - v(e.b)) / e.r; e.p = e.i * (v(e.a) - v(e.b)); break;
          case 'SW': e.i = (v(e.a) - v(e.b)) / (e.closed ? e.ron : e.roff); break;
          case 'C': {
            const vc = v(e.a) - v(e.b);
            e.i = !dt ? 0 : this._trap ? 2 * e.c * (vc - e.vprev) / dt - (e.iprev || 0) : e.c * (vc - e.vprev) / dt;
            e.vc = vc; break;
          }
          case 'L': e.i = x[e.k]; break;
          case 'V': e.i = -x[e.k]; e.p = e.i * (v(e.a) - v(e.b)); break;        // out of the + terminal
          case 'E': e.i = -x[e.k]; break;
          case 'X': e.i = -x[e.k]; e.i1 = -e.ratio * x[e.k]; break;   // i: out of the secondary +; i1: into the primary + (v1·i1 = v2·i)
          case 'OA': e.i = -x[e.k]; e.vout = v(e.out); break;
          case 'I': e.i = this.ivalueOf(e); break;
          case 'D': {
            const vd = v(e.a) - v(e.b), nvt = e.n * VT;
            e.i = e.is * (expc(vd / nvt) - 1) - (e.vz ? e.ibv * expc(-(vd + e.vz) / VT) : 0);
            e.vd = vd; e.p = e.i * vd; break;
          }
          case 'Q': {
            const p = e.pol, vbe = p * (v(e.bn) - v(e.e)), vbc = p * (v(e.bn) - v(e.c));
            const eF = expc(vbe / VT), eR = expc(vbc / VT);
            e.ic = p * (e.is * (eF - eR) - e.is / e.br * (eR - 1));
            e.ib = p * (e.is / e.bf * (eF - 1) + e.is / e.br * (eR - 1));
            e.ie = -(e.ic + e.ib);
            e.vce = v(e.c) - v(e.e);
            e.p = e.ic * (v(e.c) - v(e.e)) + e.ib * (v(e.bn) - v(e.e));
            e.i = e.ic;
            break;
          }
          case 'M': e.i = e.id; e.p = Math.abs(e.id * (v(e.d) - v(e.s))); break;
        }
      }
    }

    /* ---------------------------------------------------------------- analyses */
    /* the DC operating point (capacitors open, inductors shorted) */
    dc() {
      this.mode = 'dc';
      this._trap = false;
      this.nsteps = 0;
      this.solve(0);
      for (const e of this.els) {
        if (e.type === 'C') { e.vprev = this.vof(this.x, e.a) - this.vof(this.x, e.b); e.iprev = 0; }
        if (e.type === 'L') { e.iprev = this.x[e.k]; e.vprevL = 0; }
        if (e.type === 'OA') e.vint = this.vof(this.x, e.out);
      }
      return this;
    }
    /* back to the initial conditions (capacitor voltages v0, inductor currents i0), t = 0 */
    reset() {
      this.t = 0;
      this.nsteps = 0;
      for (const e of this.els) {
        if (e.type === 'C') { e.vprev = e.v0; e.iprev = 0; }
        if (e.type === 'L') { e.iprev = e.i0; e.vprevL = 0; }
        if (e.type === 'OA') { e.vint = 0; e.state = -1; }
        if (e.type === 'D') e.vd = 0;
        if (e.type === 'Q') { e.vbe = 0; e.vbc = 0; }
      }
      this.x = null;
      return this;
    }
    /* one time step (backward Euler); call repeatedly with a small dt */
    step(dt) {
      this.mode = 'tran';
      this.t += dt;
      // trapezoidal after the first step: the first one is backward Euler, so a source that
      // switches on at t = 0 does not leave the method assuming the old current (SPICE does the same)
      this._trap = this.method === 'trap' && this.nsteps > 0;
      this.solve(dt);
      this.nsteps = (this.nsteps || 0) + 1;
      for (const e of this.els) {
        if (e.type === 'C') { e.iprev = e.i; e.vprev = this.vof(this.x, e.a) - this.vof(this.x, e.b); }
        if (e.type === 'L') { e.iprev = this.x[e.k]; e.vprevL = this.vof(this.x, e.a) - this.vof(this.x, e.b); }
        if (e.type === 'OA') e.vint = this.vof(this.x, e.out) - e.rout * this.x[e.k];
      }
      return this;
    }
    v(name) { const k = this.names.get(String(name)); return k ? this.vof(this.x || [], k) || 0 : 0; }

    /* small-signal AC at frequency f (Hz), linearised at the last operating point.
       Sources with {ac: amplitude, phase: degrees} drive it. -> {v(name) -> {re, im, mag, phase}} */
    ac(f) {
      if (!this.x) this.dc();
      const n = this.size, w = 2 * Math.PI * f;
      const Ar = new Float64Array(n * n), Ai = new Float64Array(n * n), br = new Float64Array(n), bi = new Float64Array(n);
      const Y = (i, j, gr, gi) => { if (i && j) { Ar[(i - 1) * n + j - 1] += gr; Ai[(i - 1) * n + j - 1] += gi; } };
      const adm = (a, c, gr, gi) => { Y(a, a, gr, gi); Y(c, c, gr, gi); Y(a, c, -gr, -gi); Y(c, a, -gr, -gi); };
      const B = (r, c, vr, vi) => { Ar[r * n + c] += vr; Ai[r * n + c] += vi || 0; };
      for (let i = 1; i < this.count; i++) Y(i, i, GMIN, 0);
      for (const e of this.els) {
        switch (e.type) {
          case 'R': adm(e.a, e.b, 1 / e.r, 0); break;
          case 'SW': adm(e.a, e.b, 1 / (e.closed ? e.ron : e.roff), 0); break;
          case 'C': adm(e.a, e.b, 0, w * e.c); break;
          case 'L': {
            const k = e.k;
            if (e.a) { B(e.a - 1, k, 1); B(k, e.a - 1, 1); }
            if (e.b) { B(e.b - 1, k, -1); B(k, e.b - 1, -1); }
            B(k, k, 0, -w * e.l);
            break;
          }
          case 'X': {
            const k = e.k, n = e.ratio;
            if (e.a) { B(e.a - 1, k, 1); B(k, e.a - 1, 1); }
            if (e.b) { B(e.b - 1, k, -1); B(k, e.b - 1, -1); }
            if (e.p1) { B(k, e.p1 - 1, -n); B(e.p1 - 1, k, -n); }
            if (e.n1) { B(k, e.n1 - 1, n); B(e.n1 - 1, k, n); }
            break;
          }
          case 'V': case 'E': {
            const k = e.k;
            if (e.a) { B(e.a - 1, k, 1); B(k, e.a - 1, 1); }
            if (e.b) { B(e.b - 1, k, -1); B(k, e.b - 1, -1); }
            if (e.type === 'V') {
              if (e.r) B(k, k, -e.r);
              const ph = (e.phase || 0) * Math.PI / 180;
              br[k] += e.ac * Math.cos(ph); bi[k] += e.ac * Math.sin(ph);
            } else { if (e.inp) B(k, e.inp - 1, -e.gain); if (e.inn) B(k, e.inn - 1, e.gain); }
            break;
          }
          case 'I': { if (e.ac) { if (e.a) br[e.a - 1] -= e.ac; if (e.b) br[e.b - 1] += e.ac; } break; }
          case 'D': adm(e.a, e.b, e.g || GMIN, 0); break;
          case 'Q': {
            const p = e.pol;
            const eF = dexpc(e.vbe / VT) / VT, eR = dexpc(e.vbc / VT) / VT;
            const icF = e.is * eF, icR = -e.is * eR - e.is / e.br * eR, ibF = e.is / e.bf * eF, ibR = e.is / e.br * eR;
            const row = (node, dF, dR) => {
              if (!node) return;
              const r = node - 1;
              if (e.bn) Ar[r * n + e.bn - 1] += dF + dR;
              if (e.e) Ar[r * n + e.e - 1] -= dF;
              if (e.c) Ar[r * n + e.c - 1] -= dR;
            };
            row(e.c, icF, icR); row(e.bn, ibF, ibR); row(e.e, -(icF + ibF), -(icR + ibR));
            void p;
            break;
          }
          case 'M': {
            // small signal: gm from gate–source, gds drain–source (drain/source as last solved)
            const D = e.d, S = e.s;
            const rowM = (node, sign) => {
              if (!node) return;
              const r = node - 1;
              if (e.g) Ar[r * n + e.g - 1] += sign * e.gm;
              if (D) Ar[r * n + D - 1] += sign * e.gds;
              if (S) Ar[r * n + S - 1] -= sign * (e.gm + e.gds);
            };
            rowM(D, 1); rowM(S, -1);
            break;
          }
          case 'OA': {
            const k = e.k;
            // A(jω) = s / (1 + jω/ωp) with the pole from the gain–bandwidth product
            let gr = e.state === 0 ? e.gain : 0, gi = 0;
            if (e.gbw) { const wp = 2 * Math.PI * e.gbw / e.gain, q = w / wp, d = 1 + q * q; const r0 = gr; gr = r0 / d; gi = -r0 * q / d; }
            if (e.out) { B(e.out - 1, k, 1); B(k, e.out - 1, 1); }
            B(k, k, -e.rout);
            if (e.inp) B(k, e.inp - 1, -gr, -gi);
            if (e.inn) B(k, e.inn - 1, gr, gi);
            break;
          }
        }
      }
      const sol = solveComplex(Ar, Ai, br, bi, n);
      const self = this;
      return {
        ok: !!sol,
        v(name) {
          const k = self.names.get(String(name));
          if (!sol || !k) return { re: 0, im: 0, mag: 0, phase: 0 };
          const re = sol.re[k - 1], im = sol.im[k - 1];
          return { re, im, mag: Math.hypot(re, im), phase: Math.atan2(im, re) * 180 / Math.PI };
        },
        /* current of an element, the same direction as its DC .i (a→b; out of + for sources) */
        i(el) {
          if (!sol) return { re: 0, im: 0, mag: 0, phase: 0 };
          const V = n => n ? [sol.re[n - 1], sol.im[n - 1]] : [0, 0];
          let re = 0, im = 0;
          if (el.k != null) { const s = el.type === 'L' ? 1 : -1; re = s * sol.re[el.k]; im = s * sol.im[el.k]; }
          else {
            const [ar, ai] = V(el.a), [br, bi] = V(el.b), dr = ar - br, di = ai - bi;
            if (el.type === 'R') { re = dr / el.r; im = di / el.r; }
            else if (el.type === 'SW') { const r = el.closed ? el.ron : el.roff; re = dr / r; im = di / r; }
            else if (el.type === 'C') { re = -w * el.c * di; im = w * el.c * dr; }
            else if (el.type === 'D') { re = (el.g || 0) * dr; im = (el.g || 0) * di; }
          }
          return { re, im, mag: Math.hypot(re, im), phase: Math.atan2(im, re) * 180 / Math.PI };
        }
      };
    }
  }

  /* nearest standard value in an E-series: eSeries(4700, 'E12') -> 4700; eSeries(5000, 'E24') -> 5100 */
  const E = {
    E6: [1.0, 1.5, 2.2, 3.3, 4.7, 6.8],
    E12: [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2],
    E24: [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1]
  };
  function eSeries(v, series) {
    const list = E[series || 'E12'];
    if (!(v > 0)) return v;
    const dec = Math.pow(10, Math.floor(Math.log10(v)));
    let best = list[0] * dec, bd = Infinity;
    for (const m of list.concat([10])) {
      const c = m * dec, d = Math.abs(Math.log(c / v));
      if (d < bd) { bd = d; best = c; }
    }
    return Number(best.toPrecision(3));
  }

  H.Circuit = Circuit;
  H.circuit = { Circuit, eSeries, E_SERIES: E, VT };
})(typeof window !== 'undefined' ? window : globalThis);
