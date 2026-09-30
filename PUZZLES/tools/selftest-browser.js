/* The Puzzle Cabinet · tools/selftest-browser.js
 *
 * Opens puzzles in the page one after another, shows each solution and checks
 * that the puzzle then counts as solved, collecting console errors on the way.
 * Your progress and saved games are put back afterwards.
 *
 * In the page (e.g. with the browser tool's javascript):
 *   await new Promise((ok) => { const s = document.createElement('script');
 *     s.src = 'tools/selftest-browser.js?' + Date.now(); s.onload = ok; document.head.appendChild(s); });
 *   PuzzleSelfTest({ family: 'jugs' });   // or { engine: 'tangram' }, { limit: 40 }, { ids: [...] }
 *   // then poll (a long run outlasts one javascript call):
 *   JSON.stringify(window.__selftest)      // { running: false, result: {...} } when done
 *
 * The harness runs animations with timers (a hidden pane pauses
 * requestAnimationFrame), answers the player's confirm cards (C.autoConfirm), and for puzzles answered
 * in the panel submits the engine's answerKey(p) (the question engine's
 * answer) through the real answer box.
 */
(function () {
  'use strict';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function waitFor(fn, ms) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      try { if (fn()) return true; } catch (e) { /* not yet */ }
      await sleep(40);
    }
    return false;
  }

  window.PuzzleSelfTest = async function (opts) {
    opts = opts || {};
    const C = window.Cabinet;
    // one run at a time: two runs would put back each other's storage
    if (window.__selftest && window.__selftest.running) return { refused: 'a self-test is already running in this page' };
    window.requestAnimationFrame = (f) => setTimeout(() => f(performance.now()), 16);
    const origScale = C.animScale;
    C.animScale = opts.animScale == null ? 0.05 : opts.animScale;
    window.__selftest = { running: true };
    const origConfirm = window.confirm;
    C.autoConfirm = true;
    window.confirm = () => true;
    const errors = [];
    const origErr = console.error;
    console.error = function () { errors.push(Array.prototype.map.call(arguments, (a) => (a && a.stack) ? a.stack.split('\n').slice(0, 2).join(' ') : String(a)).join(' ')); origErr.apply(console, arguments); };
    const onErr = (e) => errors.push('uncaught: ' + e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno);
    window.addEventListener('error', onErr);
    // keep the player's own records safe: only the records of the puzzles this run touches are
    // remembered and put back, so runs in other tabs are left alone
    const doneBefore = JSON.parse(localStorage.getItem('pc:done') || '{}');
    const keepSt = {}, keepDone = {};
    const remember = (id) => {
      if (id in keepSt) return;
      keepSt[id] = localStorage.getItem('pc:st:' + id);
      keepDone[id] = doneBefore[id] || null;
    };
    const statsBefore = localStorage.getItem('pc:xstat');
    const idxBefore = localStorage.getItem('pc:stidx');

    let rows = C.rows().filter((r) => {
      if (opts.ids) return opts.ids.includes(r.id);
      if (opts.family && r.family !== opts.family) return false;
      if (opts.engine && C.famInfo(r.family).engine !== opts.engine) return false;
      return true;
    });
    if (opts.limit && rows.length > opts.limit) {
      const step = rows.length / opts.limit;
      rows = Array.from({ length: opts.limit }, (_, i) => rows[Math.floor(i * step)]);
    }
    const out = { tested: 0, solved: 0, failed: [], errors: [], ms: 0 };
    const t0 = Date.now();
    for (const r of rows) {
      const e0 = errors.length;
      remember(r.id);
      localStorage.removeItem('pc:st:' + r.id);
      C.helpSeen = () => true;
      location.hash = '#/p/' + r.id;
      const opened = await waitFor(() => { const p = C.currentPlayer(); return p && p.p.id === r.id && p.inst; }, 10000);
      out.tested++;
      if (!opened) { out.failed.push(r.id + ': did not open'); continue; }
      const pl = C.currentPlayer();
      const eng = pl.engine;
      await sleep(opts.pause || 30);
      let ok = false;
      try {
        const box = pl.answerEl.querySelector('.ans');
        const key = eng.answerKey ? eng.answerKey(pl.p) : null;
        if (box && key != null) {
          const inp = box.querySelector('.ans-in');
          if (inp) {
            inp.value = String(Array.isArray(key) ? key.join(', ') : key);
            inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          } else {
            const btns = box.querySelectorAll('.ans-choice');
            (Array.isArray(key) ? key : [key]).forEach((i) => btns[i] && btns[i].click());
            const go = box.querySelector('.ans-go');
            if (go) go.click();
          }
          ok = await waitFor(() => pl.solvedNow, 3000);
          if (!ok) out.failed.push(r.id + ': the answer key was refused: ' + (box.querySelector('.ans-fb') || {}).textContent);
          // exercise the solution path too (figures' solve code)
          if (ok && pl.inst.solve) { try { pl.inst.solve(); await sleep(60); } catch (e) { out.failed.push(r.id + ': solve() threw after answering: ' + e.message); } }
        } else if (pl.inst.solve) {
          pl.reveal();
          ok = await waitFor(() => pl.solvedNow || (pl.inst.check && pl.inst.check(false) && pl.inst.check(false).solved), opts.wait || 12000);
          if (!ok) out.failed.push(r.id + ': after the solution, check() still says: ' + JSON.stringify(pl.inst.check ? pl.inst.check(false) : null));
        } else {
          out.failed.push(r.id + ': no solve() and no answerKey');
        }
      } catch (e) {
        out.failed.push(r.id + ': threw ' + e.message);
      }
      if (ok) out.solved++;
      if (errors.length > e0) out.errors.push(r.id + ': ' + errors.slice(e0).join(' | ').slice(0, 400));
    }
    out.ms = Date.now() - t0;
    // put everything back (close the last puzzle first, or it saves itself again)
    C.closePuzzle();
    location.hash = '#/';
    await sleep(400);
    Object.keys(keepSt).forEach((id) => {
      if (keepSt[id] == null) localStorage.removeItem('pc:st:' + id); else localStorage.setItem('pc:st:' + id, keepSt[id]);
    });
    const doneNow = JSON.parse(localStorage.getItem('pc:done') || '{}');
    Object.keys(keepDone).forEach((id) => { if (keepDone[id]) doneNow[id] = keepDone[id]; else delete doneNow[id]; });
    localStorage.setItem('pc:done', JSON.stringify(doneNow));
    if (statsBefore == null) localStorage.removeItem('pc:xstat'); else localStorage.setItem('pc:xstat', statsBefore);
    if (idxBefore == null) localStorage.removeItem('pc:stidx'); else localStorage.setItem('pc:stidx', idxBefore);
    C.progress.reload();
    console.error = origErr;
    window.confirm = origConfirm;
    C.autoConfirm = false;
    window.removeEventListener('error', onErr);
    C.animScale = origScale;
    location.hash = '#/';
    window.__selftest = { running: false, result: out };
    return out;
  };
})();
