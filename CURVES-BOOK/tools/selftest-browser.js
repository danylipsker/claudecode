/* Curves Workshop · tools/selftest-browser.js
 *
 * Runs inside the app page. For every figure (or a chosen list) it opens the figure page
 * and checks the SVG renders, then opens the practice board and presses "Show" until the
 * construction is complete, checking that the board finishes. Results in window.__selftest.
 *
 *   load it from the console of index.html:
 *     await new Promise(ok => { const s = document.createElement('script'); s.src = 'tools/selftest-browser.js?' + Date.now(); s.onload = ok; document.head.appendChild(s); });
 *     CurvesSelfTest({ limit: 40 });            // or { ids: ['fig-009', 'fig-062'] } or { section: 'conics' }
 *     // poll: JSON.stringify(window.__selftest)
 */
window.CurvesSelfTest = async function (opts) {
  opts = opts || {};
  const C = window.Curves;
  const res = window.__selftest = { started: Date.now(), done: false, n: 0, ok: 0, failures: [], current: null };
  let ids = C.catalog.figures.map(f => f.id);
  if (opts.ids) ids = opts.ids;
  if (opts.section) ids = ids.filter(id => C.catalog.figures.find(f => f.id === id).section === opts.section);
  if (opts.limit) ids = ids.slice(0, opts.limit);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for (const id of ids) {
    res.current = id; res.n++;
    const problems = [];
    try {
      location.hash = '#/f/' + id;
      await sleep(120);
      const svg = document.querySelector('#stage svg');
      if (!svg) problems.push('figure page has no svg');
      else {
        if (svg.innerHTML.includes('NaN')) problems.push('NaN in svg');
        const box = svg.getBoundingClientRect(); if (box.width < 50) problems.push('svg not laid out');
        const nSteps = document.querySelectorAll('#steps li').length; if (!nSteps) problems.push('no steps listed');
        // play every step
        const btn = document.getElementById('pfirst'); if (btn) btn.click();
        for (let i = 0; i < nSteps; i++) { document.getElementById('pnext').click(); await sleep(30); }
      }
      const cat = C.catalog.figures.find(f => f.id === id);
      if (cat && cat.practice) {
        location.hash = '#/p/' + id;
        await sleep(150);
        const show = document.getElementById('bshow');
        if (!show) problems.push('no board');
        else {
          let guard = 0;
          while (!document.querySelector('#bdone .done') && guard < 400) { show.click(); guard++; await sleep(8); }
          if (!document.querySelector('#bdone .done')) problems.push('board did not finish after ' + guard + ' shows');
          const bad = document.querySelectorAll('#user .user.bad').length; if (bad) problems.push(bad + ' shown elements were not accepted');
        }
      }
    } catch (e) { problems.push('exception: ' + e.message); }
    if (problems.length) res.failures.push({ id, problems }); else res.ok++;
  }
  res.current = null; res.done = true; res.ms = Date.now() - res.started;
  location.hash = '#/';
  return res;
};
