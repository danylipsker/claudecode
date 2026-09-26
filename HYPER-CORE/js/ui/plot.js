/* HYPER-CORE · ui/plot.js
 *
 * A small, crisp 2-D plotter on a canvas: nice ticks, linear or log axes,
 * several series, marker points and a hover read-out. Theme aware.
 *
 *   const p = new Hyper.Plot(canvas, {
 *     x: { label: 'θ (°)', min: 0, max: 90 },
 *     y: { label: 'R (m)' },                         // min/max left out: fitted to the data
 *     series: [{ pts: [[x, y], ...], color, width, dash, label }],
 *     marks:  [{ x, y, color, label }],
 *     vlines: [{ x, color, label }], hlines: [...],
 *     fmtX, fmtY                                      // read-out formatting
 *   });
 *   p.set({ series: [...] });                         // merge and redraw
 */
(function () {
  'use strict';
  const H = window.Hyper;

  const niceStep = H.niceStep;
  function tickLabel(v, step) {
    if (Math.abs(v) < step * 1e-9) return '0';
    const a = Math.abs(v);
    if (a >= 1e5 || a < 1e-3) {
      const e = Math.floor(Math.log10(a));
      const m = v / Math.pow(10, e);
      return (Math.abs(m - Math.round(m)) < 1e-9 ? Math.round(m) : m.toFixed(1)) + 'e' + e;
    }
    const dec = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
    return v.toFixed(Math.min(dec, 6)).replace('-', '−');
  }

  class Plot {
    constructor(canvas, opts) {
      this.cv = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({ x: {}, y: {}, series: [], marks: [], vlines: [], hlines: [], pad: [14, 16, 38, 58] }, opts || {});
      this.hover = null;
      this.ro = new ResizeObserver(() => this.draw());
      this.ro.observe(canvas);
      this.onTheme = () => this.draw();
      document.addEventListener('hyper:theme', this.onTheme);
      canvas.addEventListener('pointermove', e => { this.hover = this.local(e); this.draw(); });
      canvas.addEventListener('pointerleave', () => { this.hover = null; this.draw(); });
      this.draw();
    }
    destroy() { this.ro.disconnect(); document.removeEventListener('hyper:theme', this.onTheme); }
    set(o) { Object.assign(this.o, o); this.draw(); }
    local(e) { const r = this.cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

    range() {
      const o = this.o;
      let xmin = o.x.min, xmax = o.x.max, ymin = o.y.min, ymax = o.y.max;
      if (xmin == null || xmax == null || ymin == null || ymax == null) {
        let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
        for (const s of o.series) for (const p of s.pts || []) {
          if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) continue;
          if (o.y.log && p[1] <= 0) continue;
          a = Math.min(a, p[0]); b = Math.max(b, p[0]); c = Math.min(c, p[1]); d = Math.max(d, p[1]);
        }
        for (const m of o.marks) if (Number.isFinite(m.y)) { c = Math.min(c, m.y); d = Math.max(d, m.y); }
        if (xmin == null) xmin = Number.isFinite(a) ? a : 0;
        if (xmax == null) xmax = Number.isFinite(b) ? b : 1;
        if (ymin == null || ymax == null) {
          if (!Number.isFinite(c)) { c = 0; d = 1; }
          if (!o.y.log) {
            if (c > 0 && c < 0.45 * d && !o.y.noZero) c = 0;
            if (d < 0 && d > 0.45 * c && !o.y.noZero) d = 0;
            if (c === d) { c -= Math.abs(c) * 0.5 || 1; d += Math.abs(d) * 0.5 || 1; }
            const pad = (d - c) * 0.06;
            if (ymin == null) ymin = c === 0 ? 0 : c - pad;
            if (ymax == null) ymax = d === 0 ? 0 : d + pad;
          } else {
            if (ymin == null) ymin = c / 1.3;
            if (ymax == null) ymax = d * 1.3;
          }
        }
      }
      if (xmin === xmax) { xmin -= 1; xmax += 1; }
      if (ymin === ymax) { ymin -= 1; ymax += 1; }
      return { xmin, xmax, ymin, ymax };
    }

    draw() {
      const cv = this.cv, ctx = this.ctx, o = this.o;
      const dpr = window.devicePixelRatio || 1;
      const W = cv.clientWidth, Hh = cv.clientHeight;
      if (!W || !Hh) return;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(Hh * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const C = H.ui.colors();
      ctx.clearRect(0, 0, W, Hh);
      const [pt, pr, pb, pl] = o.pad;
      const x0 = pl, x1 = W - pr, y0 = pt, y1 = Hh - pb;
      const r = this.range();
      const lx = !!o.x.log && r.xmin > 0, ly = !!o.y.log && r.ymin > 0;
      // x: { reverse: true } runs the axis from right to left (IR spectra, 4000 → 400 cm⁻¹)
      const rev = !!o.x.reverse, fx = f => rev ? x1 - f * (x1 - x0) : x0 + f * (x1 - x0);
      const tx = lx ? v => fx((Math.log(v) - Math.log(r.xmin)) / (Math.log(r.xmax) - Math.log(r.xmin)))
                    : v => fx((v - r.xmin) / (r.xmax - r.xmin));
      const ty = ly ? v => y1 - (Math.log(v) - Math.log(r.ymin)) / (Math.log(r.ymax) - Math.log(r.ymin)) * (y1 - y0)
                    : v => y1 - (v - r.ymin) / (r.ymax - r.ymin) * (y1 - y0);
      this.map = { tx, ty, r, x0, x1, y0, y1, lx, ly };
      ctx.font = '11.5px ' + getComputedStyle(document.body).fontFamily;
      // grid and ticks
      const ticks = (lo, hi, log, n) => {
        if (log) {
          const out = [];
          for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++) { const v = Math.pow(10, e); if (v >= lo * 0.999 && v <= hi * 1.001) out.push(v); }
          return { vals: out, step: 1 };
        }
        const st = niceStep(hi - lo, n);
        const out = [];
        for (let v = Math.ceil(lo / st) * st; v <= hi + st * 1e-9; v += st) out.push(Math.abs(v) < st * 1e-9 ? 0 : v);
        return { vals: out, step: st };
      };
      const XT = ticks(r.xmin, r.xmax, lx, Math.max(3, Math.floor((x1 - x0) / 80)));
      const YT = ticks(r.ymin, r.ymax, ly, Math.max(3, Math.floor((y1 - y0) / 45)));
      ctx.lineWidth = 1;
      ctx.strokeStyle = C.grid;
      ctx.fillStyle = C.muted;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (const v of XT.vals) {
        const X = Math.round(tx(v)) + 0.5;
        ctx.beginPath(); ctx.moveTo(X, y0); ctx.lineTo(X, y1); ctx.stroke();
        ctx.fillText(lx ? tickLabel(v, v) : tickLabel(v, XT.step), X, y1 + 5);
      }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (const v of YT.vals) {
        const Y = Math.round(ty(v)) + 0.5;
        ctx.beginPath(); ctx.moveTo(x0, Y); ctx.lineTo(x1, Y); ctx.stroke();
        ctx.fillText(ly ? tickLabel(v, v) : tickLabel(v, YT.step), x0 - 6, Y);
      }
      // axes through zero when visible, else the frame
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1.2;
      const zx = !lx && r.xmin < 0 && r.xmax > 0 ? tx(0) : x0;
      const zy = !ly && r.ymin < 0 && r.ymax > 0 ? ty(0) : y1;
      ctx.beginPath(); ctx.moveTo(x0, zy); ctx.lineTo(x1, zy); ctx.moveTo(zx, y0); ctx.lineTo(zx, y1); ctx.stroke();
      // labels
      ctx.fillStyle = C.text2;
      ctx.font = '600 12px ' + getComputedStyle(document.body).fontFamily;
      if (o.x.label) { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(o.x.label, x1, Hh - 2); }
      if (o.y.label) { ctx.save(); ctx.translate(12, y0); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'right'; ctx.textBaseline = 'top'; ctx.fillText(o.y.label, 0, -8); ctx.restore(); }
      // clip to the plot area
      ctx.save();
      ctx.beginPath(); ctx.rect(x0, y0 - 2, x1 - x0, y1 - y0 + 4); ctx.clip();
      const font = getComputedStyle(document.body).fontFamily;
      for (const L of o.hlines) {
        if (!Number.isFinite(L.y)) continue;
        ctx.strokeStyle = L.color || C.faint; ctx.setLineDash(L.dash || [5, 4]); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x0, ty(L.y)); ctx.lineTo(x1, ty(L.y)); ctx.stroke();
        if (L.label) { ctx.fillStyle = L.color || C.muted; ctx.font = '11.5px ' + font; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(L.label, x1 - 4, ty(L.y) - 3); }
      }
      for (const L of o.vlines) {
        if (!Number.isFinite(L.x)) continue;
        ctx.strokeStyle = L.color || C.faint; ctx.setLineDash(L.dash || [5, 4]); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(tx(L.x), y0); ctx.lineTo(tx(L.x), y1); ctx.stroke();
        if (L.label) { ctx.fillStyle = L.color || C.muted; ctx.font = '11.5px ' + font; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(L.label, tx(L.x) + 4, y0 + 3); }
      }
      ctx.setLineDash([]);
      o.series.forEach((s, i) => {
        const col = s.color || C.series[i % C.series.length];
        ctx.strokeStyle = col;
        ctx.lineWidth = s.width || 2.2;
        ctx.setLineDash(s.dash || []);
        ctx.lineJoin = 'round';
        if (s.line !== false) {
          ctx.beginPath();
          let pen = false, py = null;
          for (const p of s.pts || []) {
            const ok = Number.isFinite(p[0]) && Number.isFinite(p[1]) && (!ly || p[1] > 0) && (!lx || p[0] > 0);
            if (!ok) { pen = false; continue; }
            const X = tx(p[0]), Y = ty(p[1]);
            // break the line across a jump (an asymptote)
            if (pen && py != null && Math.abs(Y - py) > (y1 - y0) * 3) pen = false;
            if (pen) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
            pen = true; py = Y;
          }
          ctx.stroke();
        }
        if (s.fill) {
          const pts = (s.pts || []).filter(p => Number.isFinite(p[1]));
          if (pts.length) {
            const base = ty(ly ? r.ymin : Math.max(r.ymin, Math.min(r.ymax, 0)));
            ctx.globalAlpha = 0.16; ctx.fillStyle = col; ctx.beginPath();
            ctx.moveTo(tx(pts[0][0]), base);
            for (const p of pts) ctx.lineTo(tx(p[0]), ty(Math.max(r.ymin - (r.ymax - r.ymin), Math.min(r.ymax + (r.ymax - r.ymin), p[1]))));
            ctx.lineTo(tx(pts[pts.length - 1][0]), base);
            ctx.fill(); ctx.globalAlpha = 1;
          }
        }
        if (s.dots) { ctx.fillStyle = col; for (const p of s.pts) if (Number.isFinite(p[1])) { ctx.beginPath(); ctx.arc(tx(p[0]), ty(p[1]), s.dots, 0, 7); ctx.fill(); } }
      });
      ctx.setLineDash([]);
      ctx.restore();
      for (const m of o.marks) {
        if (!Number.isFinite(m.x) || !Number.isFinite(m.y)) continue;
        const X = tx(m.x), Y = ty(m.y);
        if (X < x0 - 1 || X > x1 + 1 || Y < y0 - 1 || Y > y1 + 1) continue;
        ctx.fillStyle = m.color || C.accent;
        ctx.strokeStyle = C.surface;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(X, Y, m.r || 5.5, 0, 7); ctx.fill(); ctx.stroke();
        if (m.label) { ctx.fillStyle = C.text; ctx.font = '600 12px ' + getComputedStyle(document.body).fontFamily; ctx.textAlign = X > (x0 + x1) / 2 ? 'right' : 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(m.label, X + (X > (x0 + x1) / 2 ? -9 : 9), Y - 6); }
      }
      // legend
      const named = o.series.filter(s => s.label);
      if (named.length > 1 || (named.length === 1 && o.legend)) {
        ctx.font = '12px ' + getComputedStyle(document.body).fontFamily;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        let lyy = y0 + 10;
        named.forEach(s => {
          const i = o.series.indexOf(s);
          ctx.strokeStyle = s.color || C.series[i % C.series.length];
          ctx.lineWidth = 3; ctx.setLineDash(s.dash || []);
          ctx.beginPath(); ctx.moveTo(x0 + 10, lyy); ctx.lineTo(x0 + 28, lyy); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = C.text2; ctx.fillText(s.label, x0 + 34, lyy);
          lyy += 17;
        });
      }
      // hover: a vertical line and the value of each series there
      if (this.hover && this.hover.x >= x0 && this.hover.x <= x1 && o.hoverRead !== false) {
        const hx = this.hover.x;
        const hf = rev ? (x1 - hx) / (x1 - x0) : (hx - x0) / (x1 - x0);
        const xv = lx ? Math.exp(Math.log(r.xmin) + hf * (Math.log(r.xmax) - Math.log(r.xmin))) : r.xmin + hf * (r.xmax - r.xmin);
        ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(hx, y0); ctx.lineTo(hx, y1); ctx.stroke(); ctx.setLineDash([]);
        const lines = [(o.x.name || 'x') + ' = ' + (o.fmtX ? o.fmtX(xv) : H.util.fmt(xv, 4))];
        o.series.forEach((s, i) => {
          const pts = s.pts || [];
          if (!pts.length || s.line === false || s.hover === false) return;
          // nearest sample
          let best = null, bd = Infinity;
          for (const p of pts) { const d = Math.abs(p[0] - xv); if (d < bd) { bd = d; best = p; } }
          if (!best || !Number.isFinite(best[1])) return;
          const Y = ty(best[1]);
          ctx.fillStyle = s.color || C.series[i % C.series.length];
          ctx.beginPath(); ctx.arc(tx(best[0]), Y, 4, 0, 7); ctx.fill();
          lines.push((s.label || o.y.name || 'y') + ' = ' + (o.fmtY ? o.fmtY(best[1]) : H.util.fmt(best[1], 4)));
        });
        ctx.font = '12px ' + getComputedStyle(document.body).fontFamily;
        const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 16;
        const bh = lines.length * 17 + 8;
        let bx = hx + 12;
        if (bx + bw > x1) bx = hx - 12 - bw;
        ctx.fillStyle = C.surface; ctx.strokeStyle = C.border2; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, y0 + 4, bw, bh, 7) : ctx.rect(bx, y0 + 4, bw, bh); ctx.fill(); ctx.stroke();
        ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        lines.forEach((l, i) => ctx.fillText(l, bx + 8, y0 + 9 + i * 17));
      }
    }
  }
  H.Plot = Plot;
})();
