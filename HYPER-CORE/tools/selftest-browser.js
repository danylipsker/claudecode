/* In-browser self-test: open a Hyper app, then run this file's contents in the
 * console (or inject it). It visits every page, mounts every simulation for a
 * moment, and reports what went wrong. Resolves to a summary object.
 *
 *   await HyperSelfTest({ sims: true, delay: 40 })
 */
window.HyperSelfTest = async function (opts) {
  opts = Object.assign({ sims: true, delay: 40 }, opts || {});
  const H = window.Hyper;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const errors = [];
  const onErr = e => errors.push({ page: location.hash, msg: e.message || String(e.reason || e) });
  window.addEventListener('error', onErr);
  window.addEventListener('unhandledrejection', onErr);
  // simulation loops catch their own exceptions and log them: count those too
  const origError = console.error;
  console.error = function () { errors.push({ page: location.hash, msg: Array.from(arguments).map(a => a && a.message ? a.message : String(a)).join(' ').slice(0, 300) }); return origError.apply(console, arguments); };
  const report = { pages: 0, texErrors: [], missingLinks: [], failingFormulas: [], simFailures: [], crashes: [], errors };
  const view = document.querySelector('#view');
  for (const id of H.order) {
    const n = H.nodes.get(id);
    if (n.kind === 'root') continue;
    location.hash = '#/c/' + id;
    await wait(opts.delay);
    report.pages++;
    const pre = view.querySelector('pre');
    if (pre) report.crashes.push(id + ': ' + pre.textContent.slice(0, 200));
    view.querySelectorAll('.tex-err').forEach(e => report.texErrors.push(id + ': ' + e.title + ' — ' + e.textContent.slice(0, 80)));
    view.querySelectorAll('.clink.missing').forEach(e => report.missingLinks.push(id + ' → ' + e.dataset.ref));
    view.querySelectorAll('.fcard').forEach(c => {
      const w = c.querySelector('.warnmsg');
      if (w) report.failingFormulas.push(id + ' / ' + c.querySelector('h3').textContent + ': ' + w.textContent);
    });
    // hand constructions (Hyper Projections): every card must hold a drawn SVG with its steps
    if (n.constructions && n.constructions.length) {
      report.constructions = report.constructions || { pages: 0, failures: [] };
      report.constructions.pages++;
      view.querySelectorAll('.cxcard').forEach(card => {
        const bad = card.querySelector('.empty');
        if (bad) report.constructions.failures.push(id + ': ' + bad.textContent.slice(0, 160));
        else if (!card.querySelector('.cxstage svg g.step')) report.constructions.failures.push(id + ': ' + (card.querySelector('h3') || {}).textContent + ' drew no steps');
      });
      if (view.querySelectorAll('.cxcard').length < n.constructions.length) report.constructions.failures.push(id + ': ' + view.querySelectorAll('.cxcard').length + ' of ' + n.constructions.length + ' construction cards rendered');
    }
    if (opts.sims && n.sims.length) {
      for (const card of view.querySelectorAll('.simcard')) {
        card.scrollIntoView();
        view.dispatchEvent(new Event('scroll'));
        await wait(160);
        const fail = card.querySelector('.simstage .empty');
        if (fail) report.simFailures.push(id + ': ' + fail.textContent);
        else if (!card.querySelector('canvas')) report.simFailures.push(id + ': ' + card.querySelector('h3').textContent + ' did not mount');
      }
    }
  }
  window.removeEventListener('error', onErr);
  window.removeEventListener('unhandledrejection', onErr);
  console.error = origError;
  location.hash = '#/';
  return report;
};
