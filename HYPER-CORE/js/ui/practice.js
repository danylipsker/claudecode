/* HYPER-CORE · ui/practice.js
 *
 * Practice, in four kinds of question:
 *   mcq   multiple choice             {q, choices: [...], a: index, why}
 *   tf    true or false               {q, a: true|false, why}
 *   expr  type an expression          {q, answer: '3x^2 + 2', vars: ['x'], why}
 *   num   a number with a unit        {q, answer: 12.5, unit: 'm/s', tol: 0.02, steps: [...], hint}
 * plus problems generated from every formula (a fresh one each time, with the
 * worked solution). Results feed the mastery rings and the daily review.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc;
  const store = () => H.store;

  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const today = () => iso(new Date());
  function tally(correct) {
    const d = store().data;
    d.days = d.days || {};
    const t = today();
    d.days[t] = (d.days[t] || 0) + 1;
    d.total = (d.total || 0) + 1;
    if (correct) d.right = (d.right || 0) + 1;
    store().save();
  }
  function record(node, correct) {
    if (node) store().record(node.id, correct);
    tally(correct);
  }
  function shuffle(a, rnd) {
    rnd = rnd || Math.random;
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  /* ---------------------------------------------------------------- questions */
  function fromItem(item, node) {
    if (Array.isArray(item.choices)) return { type: 'mcq', q: item.q, choices: item.choices, a: item.a, why: item.why, node };
    if (typeof item.a === 'boolean') return { type: 'tf', q: item.q, a: item.a, why: item.why, node };
    if (typeof item.answer === 'string') return { type: 'expr', q: item.q, answer: item.answer, vars: item.vars || ['x'], positive: !!item.positive, why: item.why, hint: item.hint, node };
    if (typeof item.answer === 'number') {
      const ru = H.resolveUnit({ unit: item.unit, q: item.qty });
      const si = ru.q ? H.units.toSI(item.answer, ru.q, ru.unit) : item.answer;
      return { type: 'num', q: item.q, answer: si, qty: ru.q, unit: ru.unit, tol: item.tol || 0.02, steps: item.steps || [], hint: item.hint, why: item.why, node };
    }
    return null;
  }
  function generated(f, node, opts) {
    if (!f || f.def.practice === false || !f.eq) return null;
    const p = f.problem({ seed: (Math.random() * 1e9) | 0, mixedUnits: opts && opts.mixed });
    if (!p) return null;
    return { type: 'num', gen: true, q: f.problemText(p), answer: p.answer, qty: p.unknown.q, unit: p.unit, tol: 0.02, steps: f.solutionSteps(p),
             hint: 'Start from ' + '$' + f.displayTex + '$' + (f.rearrangedTex(p.unknown.id) && !(f.eq.l.t === 'var' && f.eq.l.n === p.unknown.id) ? ' and solve it for $' + p.unknown.tex + '$.' : '.'),
             signed: p.unknown.signed, node, formula: f, alts: p.alternatives };
  }
  function questionsFor(node, kind, opts) {
    const out = [];
    if (!kind || kind === 'quiz') for (const q of node.quiz) { const x = fromItem(q, node); if (x) out.push(x); }
    if (!kind || kind === 'problems') for (const q of node.problems) { const x = fromItem(q, node); if (x) out.push(x); }
    if (!kind || kind === 'gen') for (const f of H.formulasOf(node)) { const x = generated(f, node, opts); if (x) out.push(x); }
    return out;
  }
  function anyQuestion(node) {
    const pool = [];
    node.quiz.forEach(q => pool.push(() => fromItem(q, node)));
    node.problems.forEach(q => pool.push(() => fromItem(q, node)));
    H.formulasOf(node).filter(f => f.def.practice !== false).forEach(f => { pool.push(() => generated(f, node)); });
    if (!pool.length) return null;
    for (let k = 0; k < 5; k++) { const q = pool[Math.floor(Math.random() * pool.length)](); if (q) return q; }
    return null;
  }

  /* ---------------------------------------------------------------- one question */
  /* render(el, q, done(correct)) — returns nothing; calls done once answered */
  function render(el, q, done) {
    const from = q.node ? '<div class="qfrom">' + esc(q.node.title) + (q.formula ? ' · ' + esc(q.formula.name) : '') + '</div>' : '';
    el.innerHTML = from + '<div class="qtext">' + H.text(q.q) + '</div><div class="qans"></div><div class="qfb"></div>';
    const ans = ui.$('.qans', el), fb = ui.$('.qfb', el);
    let finished = false;
    const finish = (ok, html) => {
      if (finished) return;
      finished = true;
      fb.innerHTML = '<div class="feedback ' + (ok ? 'ok' : 'no') + '"><div class="fh">' + (ok ? pick(['Correct!', 'Right!', 'Exactly.', 'Well done.']) : 'Not this time') + '</div>' + (html || '') + '</div>';
      record(q.node, ok);
      done && done(ok);
    };
    const why = () => q.why ? H.text(q.why) : '';

    if (q.type === 'mcq' || q.type === 'tf') {
      const choices = q.type === 'tf' ? [['True', q.a === true], ['False', q.a === false]] : q.choices.map((c, i) => [c, i === q.a]);
      const order = q.type === 'tf' ? choices : shuffle(choices.slice());
      ans.innerHTML = '<div class="choices">' + order.map((c, i) => '<button class="choice" data-i="' + i + '"><span class="k">' + (i + 1) + '</span><span>' + H.inline(String(c[0])) + '</span></button>').join('') + '</div>';
      const pickIt = i => {
        if (finished) return;
        const btns = ui.$$('.choice', ans);
        btns.forEach((b, j) => { b.disabled = true; if (order[j][1]) b.classList.add('right'); });
        if (!order[i][1]) btns[i].classList.add('wrong');
        finish(order[i][1], why());
      };
      ans.addEventListener('click', e => { const b = e.target.closest('.choice'); if (b) pickIt(+b.dataset.i); });
      el._key = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= order.length) { pickIt(n - 1); return true; } };
      return;
    }

    if (q.type === 'num') {
      const Q = q.qty && H.units.Q[q.qty];
      ans.innerHTML = '<div class="ansrow"><input class="ans" inputmode="decimal" placeholder="your answer" autocomplete="off" spellcheck="false">' +
        (Q && Q.units.length > 1 ? '<select>' + Q.units.map(u => '<option' + (u[0] === q.unit ? ' selected' : '') + '>' + esc(u[0]) + '</option>').join('') + '</select>' : (q.unit ? '<span class="muted">' + esc(q.unit) + '</span>' : '')) +
        '<button class="btn pri" data-a="check">Check</button><button class="btn ghost" data-a="hint">Hint</button><button class="btn ghost" data-a="show">Show solution</button></div>';
      const inp = ui.$('input', ans), sel = ui.$('select', ans);
      let tries = 0;
      const solution = () => {
        const steps = (q.steps || []).map(s => '<li>' + (typeof s === 'string' ? H.text(s) : (s.text ? H.text(s.text) : '') + (s.tex ? '<div class="stex">' + H.texSafe(s.tex, true) + '</div>' : '')) + '</li>').join('');
        const shown = H.Formula.show(q.answer, { q: q.qty, unit: q.unit }, q.unit);
        return (steps ? '<ol class="steps">' + steps + '</ol>' : '<p>The answer is <b>' + esc(shown) + '</b>.</p>') + why();
      };
      const check = () => {
        if (finished) return;
        const s = inp.value.trim();
        if (!s) { inp.focus(); return; }
        let x;
        try { x = H.expr.evaluate(H.expr.parse(s), {}); } catch (e) { x = NaN; }
        if (!Number.isFinite(x)) { fb.innerHTML = '<div class="feedback no"><p>That is not a number I can read. Use digits, a decimal point and e for powers of ten (6.4e-3).</p></div>'; return; }
        const unit = sel ? sel.value : q.unit;
        const si = q.qty ? H.units.toSI(x, q.qty, unit) : x;
        const good = [q.answer].concat(q.alts || []).some(a => Math.abs(si - a) <= (q.tol || 0.02) * Math.abs(a) + 1e-300);
        if (good) { finish(true, '<p>' + esc(H.Formula.show(q.answer, { q: q.qty, unit: q.unit }, unit)) + '</p><details class="deriv"><summary>See the working</summary><div class="dbody">' + solution() + '</div></details>'); lock(); return; }
        tries++;
        const close = Math.abs(si - q.answer) <= 0.1 * Math.abs(q.answer);
        const factor = Math.abs(q.answer) > 0 ? Math.abs(si / q.answer) : 0;
        let tip = close ? 'Close, but outside 2 %. Check your rounding and the value of constants.' : '';
        if (!close && factor > 0) {
          const lg = Math.log10(factor);
          if (Math.abs(lg - Math.round(lg)) < 0.02 && Math.round(lg) !== 0) tip = 'Off by a factor of 10' + U.sup(Math.round(lg)) + ' — a unit conversion or a power of ten?';
          else if (Math.abs(si + q.answer) <= 0.02 * Math.abs(q.answer)) tip = 'The size is right but the sign is not.';
          else if (Math.abs(factor - 2) < 0.04 || Math.abs(factor - 0.5) < 0.02) tip = 'Off by a factor of 2 — a ½ or a 2 missing somewhere?';
        }
        if (tries < 2) {
          fb.innerHTML = '<div class="feedback no"><div class="fh">Not quite — try again</div>' + (tip ? '<p>' + esc(tip) + '</p>' : '') + (q.hint ? '<p class="small">Hint: ' + H.inline(q.hint) + '</p>' : '') + '</div>';
          inp.select();
        } else { finish(false, (tip ? '<p>' + esc(tip) + '</p>' : '') + solution()); lock(); }
      };
      const lock = () => { inp.disabled = true; if (sel) sel.disabled = true; ui.$$('button', ans).forEach(b => b.disabled = true); };
      ans.addEventListener('click', e => {
        const a = e.target.closest('[data-a]');
        if (!a) return;
        if (a.dataset.a === 'check') check();
        else if (a.dataset.a === 'hint') { fb.innerHTML = '<div class="feedback" style="border:1px solid var(--border2)"><p>' + (q.hint ? H.inline(q.hint) : q.steps && q.steps[0] ? H.inline(typeof q.steps[0] === 'string' ? q.steps[0] : (q.steps[0].text || '')) + (q.steps[0].tex ? ' ' + H.texSafe(q.steps[0].tex, false) : '') : 'Write down what you know and what you want, then pick the relation that links them.') + '</p></div>'; tries = Math.max(tries, 1); }
        else if (a.dataset.a === 'show') { finish(false, solution()); lock(); }
      });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); check(); } });
      setTimeout(() => inp.focus({ preventScroll: true }), 30);
      return;
    }

    if (q.type === 'expr') {
      const known = new Set(q.vars);
      ans.innerHTML = '<div class="ansrow"><input class="ans wide" placeholder="type an expression, e.g. 3x^2 + 2" autocomplete="off" spellcheck="false"><button class="btn pri" data-a="check">Check</button><button class="btn ghost" data-a="show">Show answer</button></div><div class="preview"></div>' +
        '<div class="hint">Write powers with ^, products as 2x or 2*x, and functions as sin(x), sqrt(x), ln(x), e^x.</div>';
      const inp = ui.$('input', ans), pv = ui.$('.preview', ans);
      let tries = 0;
      const parse = s => H.expr.parse(s, { known });
      inp.addEventListener('input', () => {
        const s = inp.value.trim();
        if (!s) { pv.innerHTML = ''; return; }
        try { pv.innerHTML = 'You typed: ' + H.tex(H.expr.toTex(parse(s)), false); }
        catch (e) { pv.innerHTML = '<span class="faint">…</span>'; }
      });
      const right = () => '<p>One way to write it: ' + H.texSafe(H.expr.toTex(H.expr.parse(q.answer, { known })), false) + '</p>' + why();
      const check = () => {
        if (finished) return;
        let t;
        try { t = parse(inp.value); } catch (e) { fb.innerHTML = '<div class="feedback no"><p>I cannot read that: ' + esc(e.message) + '</p></div>'; return; }
        const extra = [...H.expr.vars(t)].filter(v => !known.has(v));
        if (extra.length) { fb.innerHTML = '<div class="feedback no"><p>Only ' + [...known].join(', ') + ' should appear, not ' + esc(extra.join(', ')) + '.</p></div>'; return; }
        const ok = H.expr.equivalent(t, q.answer, q.vars, { positive: q.positive });
        if (ok) { finish(true, right()); inp.disabled = true; return; }
        tries++;
        if (tries < 2) fb.innerHTML = '<div class="feedback no"><div class="fh">Not equivalent — try again</div>' + (q.hint ? '<p>' + H.inline(q.hint) + '</p>' : '') + '</div>';
        else { finish(false, right()); inp.disabled = true; }
      };
      ans.addEventListener('click', e => {
        const a = e.target.closest('[data-a]');
        if (!a) return;
        if (a.dataset.a === 'check') check(); else { finish(false, right()); inp.disabled = true; }
      });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); check(); } });
      setTimeout(() => inp.focus({ preventScroll: true }), 30);
    }
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------------------------------------------------------------- a session */
  function session(el, make, opts) {
    opts = opts || {};
    let qs = typeof make === 'function' ? make() : make;
    let i = 0;
    const res = [];
    const box = ui.el('<div class="card qbox"></div>');
    el.innerHTML = '';
    el.appendChild(box);
    const keyh = e => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      const body = ui.$('.qbody', box);
      if (body && body._key && res.length === i && body._key(e)) { e.preventDefault(); return; }
      if (e.key === 'Enter') { const n = ui.$('[data-a=next]', box); if (n && !n.disabled) { e.preventDefault(); n.click(); } }
    };
    document.addEventListener('keydown', keyh);
    ui.onLeave(() => document.removeEventListener('keydown', keyh));
    const show = () => {
      if (!qs.length) { box.innerHTML = '<div class="empty">Nothing to practise here yet.</div>'; return; }
      if (i >= qs.length) return summary();
      const q = qs[i];
      box.innerHTML = '<div class="qhead"><span>' + esc(opts.title || 'Practice') + '</span><span class="qprog"><i style="width:' + (100 * i / qs.length) + '%"></i></span><span>' + (i + 1) + ' / ' + qs.length + '</span></div>' +
        '<div class="qbody"></div><div class="qfoot"><button class="btn ghost" data-a="skip">Skip</button><button class="btn pri" data-a="next" disabled>' + (i + 1 < qs.length ? 'Next' : 'Finish') + '  <kbd>Enter</kbd></button></div>';
      const body = ui.$('.qbody', box);
      render(body, q, ok => {
        res[i] = ok;
        const n = ui.$('[data-a=next]', box);
        n.disabled = false;
        ui.$('[data-a=skip]', box).remove();
        setTimeout(() => n.focus({ preventScroll: true }), 20);
      });
      box.onclick = e => {
        const a = e.target.closest('[data-a]');
        if (!a) return;
        if (a.dataset.a === 'next') { i++; show(); }
        else if (a.dataset.a === 'skip') { res[i] = null; i++; show(); }
      };
    };
    const summary = () => {
      const answered = res.filter(x => x != null);
      const good = answered.filter(Boolean).length;
      const pct = answered.length ? Math.round(100 * good / answered.length) : 0;
      const missed = [];
      qs.forEach((q, k) => { if (res[k] === false && q.node && !missed.includes(q.node.id)) missed.push(q.node.id); });
      box.innerHTML = '<div class="summary"><div class="big">' + pct + '%</div><div class="muted">' + good + ' of ' + answered.length + ' right' + (res.length - answered.length ? ', ' + (res.length - answered.length) + ' skipped' : '') + '</div>' +
        '<div class="dots">' + res.map(x => '<i class="' + (x === true ? 'ok' : x === false ? 'no' : '') + '"></i>').join('') + '</div>' +
        '<p>' + (pct >= 90 ? 'Excellent. This is sinking in.' : pct >= 70 ? 'Good work — a little more and it is yours.' : pct >= 40 ? 'Getting there. Re-read the key ideas, then try again.' : 'A tough set. Go back over the explanation and the worked examples first.') + '</p>' +
        (missed.length ? '<div class="small muted">Worth another look: ' + missed.map(id => '<a href="#/c/' + id + '">' + esc(H.nodes.get(id).title) + '</a>').join(', ') + '</div>' : '') +
        '<div class="btnrow" style="justify-content:center;margin-top:16px">' + (typeof make === 'function' ? '<button class="btn pri" data-a="again">Another set</button>' : '<button class="btn pri" data-a="again">Try again</button>') +
        (opts.back ? '<button class="btn" data-a="back">Done</button>' : '') + '</div></div>';
      box.onclick = e => {
        const a = e.target.closest('[data-a]');
        if (!a) return;
        if (a.dataset.a === 'again') { qs = typeof make === 'function' ? make() : shuffle(qs.slice()); i = 0; res.length = 0; show(); }
        else if (a.dataset.a === 'back') opts.back();
      };
      opts.onFinish && opts.onFinish(good, answered.length);
    };
    show();
  }

  /* ---------------------------------------------------------------- flashcards */
  function flashcards(el, formulas, opts) {
    opts = opts || {};
    let deck = shuffle(formulas.slice());
    let i = 0, flipped = false, known = 0;
    const box = ui.el('<div class="card qbox"></div>');
    el.innerHTML = '';
    el.appendChild(box);
    const show = () => {
      if (i >= deck.length) {
        box.innerHTML = '<div class="summary"><div class="big">' + known + ' / ' + deck.length + '</div><p class="muted">formulas you knew</p><div class="btnrow" style="justify-content:center"><button class="btn pri" data-a="again">Shuffle and go again</button>' + (opts.back ? '<button class="btn" data-a="back">Done</button>' : '') + '</div></div>';
        return;
      }
      const f = deck[i];
      const legend = f.vars.map(v => H.texSafe(v.tex, false) + ' ' + esc(v.name) + (v.unit ? ' <span class="faint">(' + esc(v.unit) + ')</span>' : '')).join(' · ');
      box.innerHTML = '<div class="qhead"><span>Flashcards</span><span class="qprog"><i style="width:' + (100 * i / deck.length) + '%"></i></span><span>' + (i + 1) + ' / ' + deck.length + '</span></div>' +
        '<div class="flash" data-a="flip">' + (!flipped
          ? '<div><div class="fq">' + H.inline(f.name) + '</div><div class="fsub">' + esc(f.node ? f.node.title : '') + '</div><div class="fsub mt">Recall the formula, then click to check.</div></div>'
          : '<div><div class="fa">' + H.texSafe(f.displayTex, true) + '</div><div class="small muted mt">' + legend + '</div></div>') + '</div>' +
        '<div class="qfoot">' + (flipped ? '<button class="btn" data-a="no">' + H.icon('x', 15) + 'Did not know it</button><button class="btn pri" data-a="yes">' + H.icon('check', 15) + 'Knew it</button>' : '<button class="btn pri" data-a="flip">Show the formula</button>') + '</div>';
    };
    box.onclick = e => {
      const a = e.target.closest('[data-a]');
      if (!a) return;
      const k = a.dataset.a;
      if (k === 'flip') { flipped = !flipped; show(); }
      else if (k === 'yes' || k === 'no') {
        const f = deck[i];
        if (k === 'yes') known++;
        const c = store().data.cards;
        c[f.key] = { ok: k === 'yes', t: Date.now() };
        store().save();
        tally(k === 'yes');
        i++; flipped = false; show();
      } else if (k === 'again') { deck = shuffle(formulas.slice()); i = 0; known = 0; flipped = false; show(); }
      else if (k === 'back') opts.back();
    };
    show();
  }

  /* ---------------------------------------------------------------- the concept's practice panel */
  function panel(el, node) {
    const fs = H.formulasOf(node);
    const nq = node.quiz.length, np = node.problems.length;
    const statLine = () => {
      const s = store().data.stats[node.id];
      const m = store().mastery(node.id);
      const acc = store().accuracy(node.id);
      return (s ? s.n + ' answered · ' + Math.round(100 * acc) + '% of the last ' + s.h.length + ' right · ' : 'Not practised yet · ') +
        ['', 'visited', 'practised', '<b style="color:var(--ok)">mastered ✓</b>'][m];
    };
    el.innerHTML = '<div class="pgrid">' +
      (nq ? '<button class="pcard" data-p="quiz"><div class="pt">' + H.icon('practice', 18) + 'Quick check</div><div class="pd">' + U.plural(nq, 'question') + ' on the ideas, each with an explanation.</div></button>' : '') +
      (fs.length ? '<button class="pcard" data-p="gen"><div class="pt">' + H.icon('shuffle', 18) + 'Formula problems</div><div class="pd">Fresh numbers every time, from ' + U.plural(fs.length, 'formula') + ', with the full worked solution.</div></button>' : '') +
      (np ? '<button class="pcard" data-p="problems"><div class="pt">' + H.icon('bulb', 18) + 'Problems</div><div class="pd">' + U.plural(np, 'word problem') + ' to reason through.</div></button>' : '') +
      (fs.length ? '<button class="pcard" data-p="cards"><div class="pt">' + H.icon('cards', 18) + 'Flashcards</div><div class="pd">Recall each formula from its name.</div></button>' : '') +
      '</div><div class="row mt small muted"><span class="pstat">' + statLine() + '</span><span class="grow"></span>' +
      '<label class="row" style="gap:6px"><input type="checkbox" class="und"' + (store().data.understood[node.id] ? ' checked' : '') + '> I understand this</label></div><div class="prun mt"></div>';
    const run = ui.$('.prun', el);
    const back = () => { run.innerHTML = ''; ui.$('.pstat', el).innerHTML = statLine(); };
    el.addEventListener('click', e => {
      const c = e.target.closest('[data-p]');
      if (!c) return;
      const k = c.dataset.p;
      ui.$$('.pcard', el).forEach(x => x.classList.toggle('on', x === c));
      if (k === 'quiz') session(run, () => shuffle(questionsFor(node, 'quiz')), { title: 'Quick check', back, onFinish: back2 });
      else if (k === 'problems') session(run, questionsFor(node, 'problems'), { title: 'Problems', back, onFinish: back2 });
      else if (k === 'gen') session(run, () => { const out = []; for (let j = 0; j < 5; j++) { const f = fs[j % fs.length]; const q = generated(f, node, { mixed: j >= 3 }); if (q) out.push(q); } return out; }, { title: 'Formula problems', back, onFinish: back2 });
      else if (k === 'cards') flashcards(run, fs, { back });
      run.scrollIntoView({ block: 'nearest' });
    });
    function back2() { ui.$('.pstat', el).innerHTML = statLine(); }
    ui.$('.und', el).addEventListener('change', e => {
      if (e.target.checked) store().data.understood[node.id] = Date.now(); else delete store().data.understood[node.id];
      store().save();
      back2();
      ui.refreshDots(node.id);
    });
  }

  /* one generated question inside a formula card */
  function formulaInline(el, f) {
    const next = () => {
      const q = generated(f, f.node);
      el.innerHTML = '<div style="padding:14px 16px"><div class="qbody"></div><div class="qfoot"><button class="btn sm" data-a="another">Another one</button></div></div>';
      if (!q) { ui.$('.qbody', el).innerHTML = '<p class="muted">No problem could be generated from this formula.</p>'; return; }
      render(ui.$('.qbody', el), q, () => {});
      ui.$('[data-a=another]', el).onclick = next;
    };
    next();
  }

  /* ---------------------------------------------------------------- review scheduling */
  function dueList() {
    const d = store().data;
    const now = Date.now(), DAY = 864e5;
    const out = [];
    for (const id of Object.keys(d.visited)) {
      const n = H.nodes.get(id);
      if (!n || n.kind !== 'concept') continue;
      if (!n.quiz.length && !n.formulas.length && !n.problems.length) continue;
      const s = d.stats[id];
      const m = store().mastery(id);
      const age = s ? (now - s.last) / DAY : (now - d.visited[id]) / DAY;
      const interval = !s ? 0 : m >= 3 ? 5 : store().accuracy(id) >= 0.6 ? 1.5 : 0.5;
      if (!s || age >= interval) out.push({ id, pri: (s ? store().accuracy(id) : 0.3) - Math.min(age, 30) / 60 });
    }
    out.sort((a, b) => a.pri - b.pri);
    return out.map(x => x.id);
  }

  H.practice = { render, session, flashcards, panel, formulaInline, questionsFor, anyQuestion, generated, fromItem, dueCount: () => dueList().length, dueList };

  /* ================================================================ #/practice */
  H.views.practice = function (parts) {
    ui.setTitle('Practice');
    const mode = parts[0], arg = parts[1];
    const d = store().data;
    const days = d.days || {};
    let streak = 0;
    const t = new Date();
    if (!days[iso(t)]) t.setDate(t.getDate() - 1);          // today may still be to come
    while (days[iso(t)] && streak < 3650) { streak++; t.setDate(t.getDate() - 1); }
    const due = dueList();
    const back = () => H.go('#/practice');
    if (mode) {
      const page = ui.page('<nav class="crumbs"><a href="#/practice">Practice</a></nav><div class="run"></div>');
      const run = ui.$('.run', page);
      const within = id => id ? H.conceptsUnder(id).map(x => H.nodes.get(x)) : H.list.filter(n => n.kind === 'concept');
      if (mode === 'review') {
        page.insertAdjacentHTML('afterbegin', '<h1 class="h2" style="margin-top:0">Daily review</h1>');
        session(run, () => { const ids = dueList().slice(0, 10); const pool = ids.length ? ids : Object.keys(d.visited); return shuffle(pool.slice()).slice(0, 10).map(id => anyQuestion(H.nodes.get(id))).filter(Boolean); }, { title: 'Review', back });
      } else if (mode === 'mix') {
        const b = arg && H.nodes.get(arg);
        page.insertAdjacentHTML('afterbegin', '<h1 class="h2" style="margin-top:0">' + esc(b ? b.title : 'Everything') + ' · mixed practice</h1>');
        session(run, () => shuffle(within(arg).filter(n => n.quiz.length || n.formulas.length || n.problems.length)).slice(0, 10).map(anyQuestion).filter(Boolean), { title: b ? b.title : 'Mixed', back });
      } else if (mode === 'drill') {
        const b = arg && H.nodes.get(arg);
        page.insertAdjacentHTML('afterbegin', '<h1 class="h2" style="margin-top:0">' + esc(b ? b.title : 'Everything') + ' · formula drill</h1>');
        session(run, () => shuffle(within(arg).filter(n => n.formulas.length)).slice(0, 8).map(n => generated(pick(H.formulasOf(n)), n, { mixed: Math.random() < 0.4 })).filter(Boolean), { title: 'Formula drill', back });
      } else if (mode === 'cards') {
        const b = arg && H.nodes.get(arg);
        page.insertAdjacentHTML('afterbegin', '<h1 class="h2" style="margin-top:0">' + esc(b ? b.title : 'Everything') + ' · flashcards</h1>');
        flashcards(run, [].concat(...within(arg).map(n => H.formulasOf(n))).filter(f => f.eq), { back });
      }
      return;
    }
    const scope = H.branches.map(b => {
      const nq = H.conceptsUnder(b.id).reduce((a, x) => { const n = H.nodes.get(x); return a + n.quiz.length + n.problems.length; }, 0);
      const nf = H.conceptsUnder(b.id).reduce((a, x) => a + H.nodes.get(x).formulas.length, 0);
      const p = H.progressOf(b.id);
      return '<div class="bcard" style="--h:' + b.hue + '"><div class="bh"><div class="bi">' + H.badge(b) + '</div><div><div class="bt">' + esc(b.title) + '</div><div class="bn">' + nq + ' questions · ' + nf + ' formulas</div></div></div>' +
        '<div class="bar"><i class="ok" style="width:' + (p.total ? 100 * p.mastered / p.total : 0) + '%"></i><i style="width:' + (p.total ? 100 * (p.practised - p.mastered) / p.total : 0) + '%;opacity:.5"></i></div>' +
        '<div class="btnrow"><a class="btn sm" href="#/practice/mix/' + b.id + '">' + H.icon('shuffle', 14) + 'Mixed</a>' + (nf ? '<a class="btn sm" href="#/practice/drill/' + b.id + '">' + H.icon('formulas', 14) + 'Formula drill</a><a class="btn sm" href="#/practice/cards/' + b.id + '">' + H.icon('cards', 14) + 'Flashcards</a>' : '') + '</div></div>';
    }).join('');
    ui.page('<h1 class="h2" style="margin-top:6px;font-size:30px">Practice</h1>' +
      '<div class="stats"><div class="stat"><b>' + (d.total || 0) + '</b><span>answered</span></div><div class="stat"><b>' + (d.total ? Math.round(100 * (d.right || 0) / d.total) : 0) + '%</b><span>right</span></div>' +
      '<div class="stat"><b>' + streak + '</b><span>day streak</span></div><div class="stat"><b>' + H.list.filter(n => n.kind === 'concept' && store().mastery(n.id) === 3).length + '</b><span>mastered</span></div></div>' +
      '<div class="pgrid mt">' +
        '<a class="pcard" href="#/practice/review"><div class="pt">' + H.icon('refresh', 18) + 'Daily review</div><div class="pd">' + (due.length ? due.length + ' concepts are due: the ones you visited or practised a while ago, weakest first.' : 'Nothing is due. Visit or practise a few concepts and they will come back here to be refreshed.') + '</div></a>' +
        '<a class="pcard" href="#/practice/mix"><div class="pt">' + H.icon('shuffle', 18) + 'Surprise me</div><div class="pd">Ten questions from anywhere in ' + esc(H.discipline.title) + '.</div></a>' +
        '<a class="pcard" href="#/practice/drill"><div class="pt">' + H.icon('formulas', 18) + 'Formula drill</div><div class="pd">Numeric problems from random formulas, with units to convert.</div></a>' +
        '<a class="pcard" href="#/practice/cards"><div class="pt">' + H.icon('cards', 18) + 'All flashcards</div><div class="pd">Every formula, name to equation.</div></a>' +
      '</div><h2 class="h2">By branch</h2><div class="branches">' + scope + '</div>');
  };
})();
