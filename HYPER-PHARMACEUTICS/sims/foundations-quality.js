/* HYPER-PHARMACEUTICS · sims/foundations-quality.js — simulations for Foundations and Quality.
 *   found-forms          a dosage-form chooser: the drug's properties, the patient and the setting score 17 dosage forms
 *   found-pipeline       a cohort of candidates through phases I–III and review, with the 2011–2020 success rates
 *   found-uniformity     uniformity of dosage units (USP <905> / Ph. Eur. 2.9.40): 10 (+20) tablets, the acceptance value
 *   found-control-chart  a tablet press on an X-bar chart: limits, Western Electric rules, drifts and shifts, Cpk
 *   found-hplc           an HPLC assay: separation (solvent strength, particle size, flow), calibration line and a sample
 *   found-design-space   quality by design: two process parameters, two CQAs, a design space and a 3x3 DoE fit
 *   found-screening      a market survey for falsified packs: detection probability 1 − (1 − p·Se)^n
 * Every drug and product here is hypothetical; the models are teaching models, not tools for real decisions.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
  const sdev = a => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (a.length - 1)); };
  const normal = rng => { const u = Math.max(1e-12, rng()), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  function erf(x) {                                   // Abramowitz and Stegun 7.1.26, |error| < 1.5e-7
    const s = x < 0 ? -1 : 1, a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
    return s * y;
  }
  const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  function rrect(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r); c.lineTo(x + w, y + h - r);
    c.arcTo(x + w, y + h, x + w - r, y + h, r); c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r); c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.closePath();
  }
  // word-wrapped text with kit.label; returns the y below the last line
  function wrap(kit, c, text, x, y, w, o) {
    const size = o.size || 12, lh = o.lh || size * 1.35, words = String(text).split(' ');
    c.save(); c.font = (o.weight || 500) + ' ' + size + 'px sans-serif';
    let line = '';
    for (const wd of words) {
      const test = line ? line + ' ' + wd : wd;
      if (line && c.measureText(test).width > w) { kit.label(c, line, x, y, o); y += lh; line = wd; } else line = test;
    }
    if (line) { kit.label(c, line, x, y, o); y += lh; }
    c.restore();
    return y;
  }
  // a grid of plot panels under the stage
  function panels(box, n, minW) {
    const gb = document.createElement('div');
    gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(' + (minW || 280) + 'px,1fr));gap:10px';
    box.stage.appendChild(gb);
    return Array.from({ length: n }, () => { const d = document.createElement('div'); gb.appendChild(d); return d; });
  }

  /* ================================================================ found-forms */
  const ORAL = ['tab', 'cap', 'mr', 'ec', 'odt', 'liq', 'susp'];
  const INJ = ['iv', 'inj', 'depot'];
  const FORMS = [
    { id: 'tab', name: 'Tablet', icon: 'tab' },
    { id: 'cap', name: 'Capsule', icon: 'cap' },
    { id: 'mr', name: 'Modified-release tablet', icon: 'tab' },
    { id: 'ec', name: 'Gastro-resistant tablet', icon: 'tab' },
    { id: 'odt', name: 'Orally disintegrating tablet', icon: 'tab' },
    { id: 'liq', name: 'Oral solution or syrup', icon: 'bottle' },
    { id: 'susp', name: 'Oral suspension', icon: 'bottle' },
    { id: 'sl', name: 'Sublingual or buccal tablet', icon: 'tab' },
    { id: 'iv', name: 'Intravenous injection', icon: 'bag' },
    { id: 'inj', name: 'IM or subcutaneous injection', icon: 'syringe' },
    { id: 'depot', name: 'Depot injection or implant', icon: 'syringe' },
    { id: 'inh', name: 'Inhaler or nebuliser', icon: 'inhaler' },
    { id: 'nasal', name: 'Nasal spray', icon: 'spray' },
    { id: 'patch', name: 'Transdermal patch', icon: 'patch' },
    { id: 'topical', name: 'Cream, ointment or gel', icon: 'tube' },
    { id: 'eye', name: 'Eye drops', icon: 'dropper' },
    { id: 'supp', name: 'Suppository', icon: 'supp' }
  ];
  // rule-based suitability: each rule multiplies the score and records why
  function scoreForms(V) {
    const prot = V.mol === 'protein', site = V.site;
    return FORMS.map(f => {
      const id = f.id, oral = ORAL.includes(id), inj = INJ.includes(id), why = [];
      let s = 1;
      const k = (fac, text) => { s *= fac; if (text) why.push({ fac, text }); };
      // small built-in preferences
      if (id === 'cap') k(0.97);
      else if (id === 'odt') k(0.9, 'costlier to make, and the drug must taste acceptable');
      else if (id === 'supp') k(0.8, 'less acceptable to many patients, and absorption can be erratic');
      if ((id === 'liq' || id === 'susp') && V.pat === 'adult') k(0.85, 'a measured liquid dose is less convenient for adults, and liquids keep less well');
      if (id === 'sl' && V.dose === 'mg') k(0.85, 'only a small, potent dose dissolves under the tongue');
      // where the drug must act
      if (site === 'sys') {
        if (id === 'topical' || id === 'eye') k(0.05, 'acts where it is applied: too little reaches the blood');
        else if (id === 'nasal') k(0.5, 'only a few small, potent molecules are absorbed well through the nose');
        else if (id === 'inh') k(0.4, 'the lungs absorb some drugs into the blood, but few are given this way');
      } else if (site === 'lung') {
        if (id === 'inh') k(1.3, 'delivers the drug straight to the airways: a small dose and fewer side effects');
        else if (oral || inj || id === 'sl') k(0.35, 'reaches the lungs only through the blood: a larger dose and more side effects');
        else k(0.05, 'cannot deliver the drug to the lungs');
      } else if (site === 'skin') {
        if (id === 'topical') k(1.3, 'applied exactly where it is needed');
        else if (id === 'patch') k(0.3, 'a patch delivers through the skin into the blood, not into a skin disease');
        else if (oral || inj) k(0.35, 'treats the whole body to reach the skin: kept for disease that creams cannot reach');
        else k(0.05, 'cannot deliver the drug to the skin');
      } else if (site === 'eye') {
        if (id === 'eye') k(1.3, 'drops reach the front of the eye directly');
        else if (oral || inj) k(0.25, 'the barriers between blood and eye keep most drugs out');
        else k(0.05, 'cannot deliver the drug to the eye');
      } else if (site === 'nose') {
        if (id === 'nasal') k(1.3, 'sprayed where it acts');
        else if (id === 'inh') k(0.4, 'an inhaler is designed to carry the drug past the nose');
        else if (oral) k(0.35, 'reaches the nose only through the blood');
        else k(0.1, 'a poor way to reach the nose');
      } else if (site === 'gut') {
        if (oral) k(1.15, 'swallowed, it reaches the gut directly — poor absorption is even an advantage');
        else if (id === 'supp') k(0.8, 'a rectal form reaches only the last part of the bowel');
        else if (inj) k(0.3, 'injected, it must reach the gut wall through the blood');
        else k(0.05, 'cannot reach the gut');
      }
      // what kind of molecule
      if (prot) {
        if (oral || id === 'sl') k(0.03, 'a protein is digested in the gut and too large to be absorbed');
        else if (id === 'patch') k(0.02, 'a protein is far too large to cross the skin');
        else if (id === 'supp') k(0.05, 'a protein is barely absorbed from the rectum');
        else if (id === 'nasal') k(0.4, 'only small peptides cross the nasal lining, and poorly');
        else if (id === 'inh' && site !== 'lung') k(0.5, 'a few proteins can be inhaled into the blood, inefficiently');
        else if (id === 'topical' || id === 'eye') k(0.5, 'large proteins barely penetrate the skin or the cornea');
        else if (inj) k(1.1, 'injection delivers the whole protein intact');
      }
      // how it behaves in the gut (small molecules acting on the whole body)
      if (!prot && site === 'sys') {
        if (V.gut === 'firstpass') {
          if (oral) k(0.3, 'most of a swallowed dose would be removed by the liver on its first pass');
          else if (id === 'sl') k(1.2, 'absorbed through the lining of the mouth into veins that bypass the liver');
          else if (id === 'patch') k(1.15, 'absorbed through the skin, bypassing the liver');
          else if (id === 'supp') k(1.05, 'partly bypasses the liver');
          else if (inj || id === 'nasal') k(1.1, 'bypasses the liver on its way to the circulation');
        } else if (V.gut === 'acid') {
          if (id === 'ec') k(1.25, 'the coating protects it through the stomach and dissolves in the intestine');
          else if (id === 'mr') k(0.6, 'protected only if the release coating also resists acid');
          else if (oral) k(0.25, 'stomach acid would destroy much of the dose');
          else if (id === 'sl') k(1.05, 'never meets stomach acid');
        } else if (V.gut === 'none') {
          if (oral) k(0.02, 'it is hardly absorbed from the gut');
          else if (id === 'sl') k(0.3, 'it crosses membranes poorly, in the mouth too');
          else if (id === 'supp' || id === 'patch' || id === 'nasal') k(0.1, 'a molecule that crosses the gut wall poorly crosses other linings poorly too');
          else if (inj) k(1.2, 'injection is the only reliable way into the blood');
        } else {
          if (id === 'ec') k(0.7, 'no need for an acid-resistant coating');
          else if (oral) k(1.1, 'well absorbed by mouth: the simplest route');
        }
      }
      // how much drug
      if (V.dose === 'ug') {
        if (id === 'patch' || id === 'sl' || id === 'inh' || id === 'nasal') k(1.1, 'potent enough for a small area or a tiny volume');
      } else if (V.dose === 'big') {
        if (id === 'patch') k(0.02, 'far too much drug to cross a patch-sized area of skin');
        else if (id === 'sl' || id === 'odt') k(0.15, 'too much to dissolve in the mouth');
        else if (id === 'inh' || id === 'nasal' || id === 'eye') k(0.08, 'far too much to inhale, spray or drop');
        else if (id === 'inj' || id === 'depot') k(0.3, 'the volume would be too large for a muscle or under the skin');
        else if (id === 'tab' || id === 'mr' || id === 'ec') k(0.85, 'a large tablet that some people find hard to swallow');
        else if (id === 'cap') k(0.7, 'several capsules may be needed for each dose');
      } else if (id === 'patch') k(0.5, 'only very potent drugs, a few mg a day, suit a patch');
      // how fast, how long
      if (V.onset === 'fast') {
        if (id === 'iv') k(1.3, 'reaches the blood in seconds');
        else if (id === 'inj') k(1.1, 'acts within minutes');
        else if (id === 'inh' || id === 'nasal' || id === 'sl') k(1.15, 'absorbed within minutes');
        else if (id === 'mr' || id === 'depot' || id === 'patch') k(0.05, 'releases slowly by design');
        else if (oral || id === 'supp') k(0.4, 'takes 20–60 minutes to be absorbed');
      } else if (V.onset === 'long') {
        if (id === 'mr') k(1.3, 'releases over 12–24 hours: one dose a day');
        else if (id === 'patch') k(1.3, 'steady delivery for one to seven days');
        else if (id === 'depot') k(1.35, 'weeks or months from a single injection');
        else if (id === 'iv') k(0.5, 'would need a continuous infusion');
        else if (id !== 'topical' && id !== 'eye') k(0.7, 'several doses a day would be needed');
      } else {
        if (id === 'depot') k(0.3, 'a depot is for months of treatment, not a single course');
        else if (id === 'mr') k(0.85, 'slow release is not needed');
      }
      // the patient
      if (V.pat === 'child') {
        if (id === 'tab' || id === 'cap' || id === 'mr' || id === 'ec') k(0.35, 'young children often cannot swallow tablets or capsules');
        else if (id === 'liq' || id === 'susp') k(1.25, 'easy to swallow, and the dose can be measured by body weight');
        else if (id === 'odt') k(1.1, 'melts in the mouth without water');
        else if (id === 'iv' || id === 'inj') k(0.75, 'injections are distressing and kept for when they are needed');
      } else if (V.pat === 'noswallow') {
        if (oral) k(0.04, 'cannot be swallowed');
        else if (id === 'sl') k(0.3, 'needs a cooperative patient');
        else if (id === 'iv') k(1.2, 'works without the patient\'s help');
        else if (id === 'inj' || id === 'supp' || id === 'patch') k(1.1, 'needs no swallowing');
        else if (id === 'inh') k(0.5, 'an inhaler needs a coordinated breath (a nebuliser helps)');
      } else if (V.pat === 'vomit') {
        if (oral && id !== 'odt') k(0.2, 'may be vomited before it is absorbed');
        else if (id === 'odt') k(0.5, 'partly swallowed, so partly lost by vomiting');
        else if (id === 'supp' || id === 'inj' || id === 'iv' || id === 'patch' || id === 'sl') k(1.15, 'avoids the stomach');
      }
      // where it is given
      if (V.set === 'home') {
        if (id === 'iv') k(0.15, 'needs trained staff and equipment');
        else if (id === 'depot') k(0.8, 'given by a nurse every few weeks or months');
        else if (id === 'inj') k(0.8, 'possible at home with a pen or prefilled syringe, after training');
      } else if (id === 'iv') k(1.1, 'staff and equipment are at hand');
      // stability in water
      if (V.wet) {
        if (id === 'liq') k(0.2, 'a solution would hydrolyse on the shelf');
        else if (id === 'susp') k(0.85, 'supplied as a dry powder, mixed just before use');
        else if (id === 'iv' || id === 'inj') k(0.8, 'supplied freeze-dried and dissolved just before use');
        else if (id === 'eye' || id === 'nasal') k(0.5, 'aqueous drops or sprays would degrade');
      }
      return { f, s, why };
    }).sort((a, b) => b.s - a.s);
  }
  function drawIcon(c, kind, x, y, s, col, line) {
    c.save(); c.lineWidth = Math.max(1.5, s / 22); c.strokeStyle = line; c.fillStyle = col;
    if (kind === 'tab') {
      c.beginPath(); c.ellipse(x, y, s * 0.45, s * 0.3, 0, 0, Math.PI * 2); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(x - s * 0.3, y); c.lineTo(x + s * 0.3, y); c.stroke();
    } else if (kind === 'cap') {
      rrect(c, x - s * 0.5, y - s * 0.18, s, s * 0.36, s * 0.18); c.stroke();
      c.save(); rrect(c, x - s * 0.5, y - s * 0.18, s, s * 0.36, s * 0.18); c.clip(); c.fillRect(x - s * 0.5, y - s * 0.18, s * 0.5, s * 0.36); c.restore();
    } else if (kind === 'bottle') {
      rrect(c, x - s * 0.28, y - s * 0.25, s * 0.56, s * 0.7, s * 0.08); c.stroke();
      c.fillRect(x - s * 0.24, y + s * 0.05, s * 0.48, s * 0.36);
      c.strokeRect(x - s * 0.12, y - s * 0.42, s * 0.24, s * 0.17);
    } else if (kind === 'bag') {
      rrect(c, x - s * 0.3, y - s * 0.5, s * 0.6, s * 0.62, s * 0.12); c.stroke();
      c.fillRect(x - s * 0.24, y - s * 0.25, s * 0.48, s * 0.32);
      c.beginPath(); c.moveTo(x, y + s * 0.12); c.lineTo(x, y + s * 0.5); c.stroke();
      c.strokeRect(x - s * 0.06, y + s * 0.2, s * 0.12, s * 0.16);
    } else if (kind === 'syringe') {
      c.strokeRect(x - s * 0.4, y - s * 0.12, s * 0.6, s * 0.24);
      c.fillRect(x - s * 0.05, y - s * 0.1, s * 0.23, s * 0.2);
      c.beginPath(); c.moveTo(x + s * 0.2, y); c.lineTo(x + s * 0.55, y); c.moveTo(x - s * 0.4, y); c.lineTo(x - s * 0.55, y);
      c.moveTo(x - s * 0.55, y - s * 0.14); c.lineTo(x - s * 0.55, y + s * 0.14); c.stroke();
    } else if (kind === 'inhaler') {
      rrect(c, x - s * 0.18, y - s * 0.5, s * 0.3, s * 0.7, s * 0.06); c.fill(); c.stroke();
      rrect(c, x - s * 0.24, y + s * 0.05, s * 0.66, s * 0.26, s * 0.06); c.stroke();
    } else if (kind === 'spray') {
      rrect(c, x - s * 0.22, y - s * 0.05, s * 0.44, s * 0.5, s * 0.08); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(x - s * 0.08, y - s * 0.05); c.lineTo(x - s * 0.05, y - s * 0.5); c.lineTo(x + s * 0.05, y - s * 0.5); c.lineTo(x + s * 0.08, y - s * 0.05); c.stroke();
    } else if (kind === 'patch') {
      rrect(c, x - s * 0.4, y - s * 0.4, s * 0.8, s * 0.8, s * 0.14); c.stroke();
      rrect(c, x - s * 0.24, y - s * 0.24, s * 0.48, s * 0.48, s * 0.06); c.fill();
    } else if (kind === 'tube') {
      c.beginPath(); c.moveTo(x - s * 0.5, y - s * 0.2); c.lineTo(x + s * 0.25, y - s * 0.14); c.lineTo(x + s * 0.25, y + s * 0.14); c.lineTo(x - s * 0.5, y + s * 0.2); c.closePath(); c.fill(); c.stroke();
      c.strokeRect(x + s * 0.25, y - s * 0.08, s * 0.2, s * 0.16);
    } else if (kind === 'dropper') {
      rrect(c, x - s * 0.2, y - s * 0.1, s * 0.4, s * 0.5, s * 0.08); c.stroke();
      c.beginPath(); c.moveTo(x - s * 0.08, y - s * 0.1); c.lineTo(x, y - s * 0.4); c.lineTo(x + s * 0.08, y - s * 0.1); c.stroke();
      c.beginPath(); c.arc(x + s * 0.32, y - s * 0.3, s * 0.07, 0, Math.PI * 2); c.fill();
    } else if (kind === 'supp') {
      c.beginPath(); c.moveTo(x - s * 0.4, y - s * 0.16); c.lineTo(x + s * 0.12, y - s * 0.16);
      c.quadraticCurveTo(x + s * 0.5, y, x + s * 0.12, y + s * 0.16); c.lineTo(x - s * 0.4, y + s * 0.16); c.closePath(); c.fill(); c.stroke();
    }
    c.restore();
  }

  Hyper.sim('found-forms', {
    title: 'Choosing a dosage form',
    blurb: `Describe a hypothetical drug, the patient and the setting; seventeen dosage forms are scored by simple rules that capture how formulators think — where the drug must act, whether it survives the gut and the liver, how much must be given, how fast or how long it must act, who takes it and where. A score of 100 means no objection, above 100 real advantages, near 0 unsuitable; the best fit is drawn with the reasons for and against. Real choices weigh much more (cost, taste, stability data, the patient's own preferences), and every medicine is used as its product information says.

**Try this**
- Start with the defaults — a well-absorbed small molecule for the whole body, taken at home: the ordinary tablet wins. Now make it "largely removed by the liver on first pass": what rises to the top, and why?
- Make the drug a protein or antibody: every oral form collapses. Then ask for action "for weeks": which form wins?
- Choose a young child, then someone who is vomiting, and watch liquids, suppositories and injections trade places.
- Set the site of action to the lungs, then the skin: local delivery gives a small dose exactly where it is needed.
- Tick "unstable in water" with a child patient: the suspension survives as a powder to be mixed just before use.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 400, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'site', type: 'select', label: 'Where must it act?', options: [['Whole body (systemic)', 'sys'], ['Lungs', 'lung'], ['Skin', 'skin'], ['Eye', 'eye'], ['Nose', 'nose'], ['Inside the gut', 'gut']], value: 'sys' },
        { id: 'mol', type: 'select', label: 'The molecule', options: [['Small molecule', 'small'], ['Protein or antibody', 'protein']], value: 'small' },
        { id: 'gut', type: 'select', label: 'Swallowed, it is…', options: [['well absorbed', 'good'], ['largely removed by the liver on first pass', 'firstpass'], ['destroyed by stomach acid', 'acid'], ['hardly absorbed at all', 'none']], value: 'good' },
        { id: 'dose', type: 'select', label: 'Dose', options: [['micrograms', 'ug'], ['1–100 mg', 'mg'], ['over 500 mg', 'big']], value: 'mg' },
        { id: 'onset', type: 'select', label: 'Effect needed', options: [['within minutes (emergency)', 'fast'], ['within an hour', 'normal'], ['steady for days or weeks', 'long']], value: 'normal' },
        { id: 'pat', type: 'select', label: 'Patient', options: [['adult who swallows tablets', 'adult'], ['young child', 'child'], ['cannot swallow or unconscious', 'noswallow'], ['vomiting', 'vomit']], value: 'adult' },
        { id: 'set', type: 'select', label: 'Given', options: [['at home, by the patient', 'home'], ['in hospital, by staff', 'hosp']], value: 'home' },
        { id: 'wet', type: 'check', label: 'Unstable in water (hydrolyses)', value: false }
      ], () => { ranked = scoreForms(V); report(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['best', 'Best fit'], ['second', 'Runner-up'], ['why', 'Main reason'], ['watch', 'Watch out for']]);
      let ranked = scoreForms(V), t = 0;
      const pts = s => Math.round(100 * s);
      function report() {
        const b = ranked[0], s2 = ranked[1];
        const plus = b.why.filter(w => w.fac > 1).sort((p, q) => q.fac - p.fac), minus = b.why.filter(w => w.fac < 1).sort((p, q) => p.fac - q.fac);
        ro.set('best', b.f.name + ' (score ' + pts(b.s) + ')');
        ro.set('second', s2.f.name + ' (score ' + pts(s2.s) + ')');
        ro.set('why', plus.length ? plus[0].text : 'no strong reason against it');
        ro.set('watch', minus.length ? minus[0].text : '—');
      }
      report();
      const loop = kit.loop((dt) => {
        t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const wide = W >= 600, cardW = wide ? Math.min(300, W * 0.38) : W - 24, cardH = wide ? Hh - 24 : 150;
        const bx = 12, by = wide ? 30 : cardH + 34, bw = wide ? W - cardW - 36 : W - 24, bh = Hh - by - 8;
        const rows = Math.max(4, Math.min(FORMS.length, Math.floor(bh / 21))), rh = bh / rows;
        const labW = Math.min(190, bw * 0.48), barX = bx + labW + 8, barW = Math.max(20, bw - labW - 48);
        kit.label(c, 'Suitability score (dashed line: 100)', bx, (wide ? 14 : cardH + 22), { size: 12.5, weight: 700, color: C.text });
        for (let i = 0; i < rows; i++) {
          const r = ranked[i], y = by + i * rh + rh / 2, sc = clamp(r.s / 1.5, 0, 1);
          const col = r.s >= 0.6 ? C.ok : r.s >= 0.25 ? C.warn : C.faint;
          kit.label(c, r.f.name, barX - 8, y, { align: 'right', size: 12, weight: i === 0 ? 700 : 500, color: r.s < 0.25 ? C.muted : C.text });
          c.fillStyle = C.grid; c.fillRect(barX, y - rh * 0.3, barW, rh * 0.6);
          c.fillStyle = col; c.fillRect(barX, y - rh * 0.3, barW * sc, rh * 0.6);
          if (i === 0) { c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(barX + barW / 1.5, by - 4); c.lineTo(barX + barW / 1.5, by + rows * rh); c.stroke(); c.setLineDash([]); }
          kit.label(c, String(pts(r.s)), barX + barW + 6, y, { size: 11.5, color: C.muted });
        }
        // the card for the best fit
        const cx = wide ? W - cardW - 12 : 12, cy = 12, b = ranked[0];
        c.strokeStyle = C.grid; c.lineWidth = 1.5; rrect(c, cx, cy, cardW, cardH, 10); c.stroke();
        const bob = Math.sin(t * 2) * 2, isz = wide ? 64 : 48;
        drawIcon(c, b.f.icon, cx + 16 + isz / 2, cy + 14 + isz / 2 + bob, isz, kit.hue(150, 0.55), C.text);
        const tx = cx + isz + 30, tw = cardW - isz - 40;
        let yy = wrap(kit, c, b.f.name, tx, cy + 26, tw, { size: 15, weight: 700, color: C.text });
        kit.label(c, 'best fit · score ' + pts(b.s), tx, yy + 2, { size: 12, color: C.ok, weight: 600 });
        yy = Math.max(yy + 22, cy + isz + 34);
        const plus = b.why.filter(w => w.fac > 1).sort((p, q) => q.fac - p.fac).slice(0, wide ? 4 : 2);
        const minus = b.why.filter(w => w.fac < 1).sort((p, q) => p.fac - q.fac).slice(0, wide ? 2 : 1);
        for (const w of plus) { if (yy > cy + cardH - 16) break; kit.label(c, '+', cx + 14, yy, { size: 13, weight: 700, color: C.ok }); yy = wrap(kit, c, w.text, cx + 28, yy, cardW - 40, { size: 12, color: C.text }) + 3; }
        for (const w of minus) { if (yy > cy + cardH - 16) break; kit.label(c, '−', cx + 14, yy, { size: 13, weight: 700, color: C.bad }); yy = wrap(kit, c, w.text, cx + 28, yy, cardW - 40, { size: 12, color: C.muted }) + 3; }
        if (!plus.length && !minus.length) wrap(kit, c, 'nothing for or against: a sensible default', cx + 14, yy, cardW - 28, { size: 12, color: C.muted });
        if (wide && yy < cy + cardH - 40) {
          const s2 = ranked[1];
          kit.label(c, 'Runner-up', cx + 14, cy + cardH - 44, { size: 11.5, color: C.muted });
          drawIcon(c, s2.f.icon, cx + 30, cy + cardH - 20, 26, kit.hue(210, 0.45), C.muted);
          kit.label(c, s2.f.name + ' · score ' + pts(s2.s), cx + 52, cy + cardH - 20, { size: 12, color: C.text });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ found-pipeline */
  const STAGES = [
    { name: 'Phase I', t0: 0, t1: 1.5 },
    { name: 'Phase II', t0: 1.5, t1: 4 },
    { name: 'Phase III', t0: 4, t1: 7 },
    { name: 'Review', t0: 7, t1: 8 }
  ];
  const AVG = { p1: 52, p2: 29, p3: 58, p4: 91 };

  Hyper.sim('found-pipeline', {
    title: 'From candidate to medicine: the attrition funnel',
    blurb: `A cohort of hypothetical candidates enters phase I over three years and moves through phases I, II, III and regulatory review. At the end of each stage every candidate passes or fails with the probability you set — the defaults are the 2011–2020 industry averages (BIO, Informa and QLS, 2021) — and failures drop into the tray below, coloured by an illustrative reason. The graph compares this cohort with the expected numbers; the readouts give the chance of approval, candidates per approval and an out-of-pocket clinical cost per approval built from average phase costs of about 25, 59 and 255 million US dollars per candidate (DiMasi and colleagues, 2016; illustrative).

**Try this**
- Run several new cohorts at the defaults: how much does the number of approvals from 100 candidates vary around the expected 8?
- Raise phase II success from 29 % to 45 % — as better biomarkers or human-genetic evidence might. How much does the cost per approval fall?
- Now instead raise the review success to 100 %: why does that change so little?
- Drop phase III to 35 %: late failures are the most expensive of all. Compare the cost with an equal fall in phase I.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 460 });
      const [g1] = panels(box, 1, 300);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Candidates entering phase I', min: 10, max: 200, step: 10, value: 100 },
        { id: 'p1', label: 'Phase I → phase II', min: 20, max: 95, step: 1, value: 52, unit: '%' },
        { id: 'p2', label: 'Phase II → phase III', min: 5, max: 80, step: 1, value: 29, unit: '%' },
        { id: 'p3', label: 'Phase III → submission', min: 20, max: 95, step: 1, value: 58, unit: '%' },
        { id: 'p4', label: 'Review → approval', min: 50, max: 100, step: 1, value: 91, unit: '%' },
        { id: 'speed', type: 'select', label: 'Speed', options: [['1 year per second', 1], ['2 years per second', 2], ['4 years per second', 4]], value: 2 },
        { type: 'buttons', items: [{ id: 'run', label: 'New cohort', primary: true }, { id: 'avg', label: 'Averages 2011–2020' }] }
      ], (id) => {
        if (id === 'avg') for (const k in AVG) ctl.set(k, AVG[k]);
        if (id !== 'speed') cohort(id === 'run');
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['loa', 'Chance of approval from phase I'], ['exp', 'Expected approvals'], ['got', 'Approved in this cohort'], ['need', 'Candidates per approval'], ['cost', 'Clinical cost per approval'], ['time', 'Discovery to approval']]);
      const pl = kit.plot(g1, { x: { label: 'years since entering phase I', min: 0, max: 9 }, y: { label: 'candidates still in development', min: 0 }, legend: true }, 180);
      const ENTRY = 3, END = ENTRY + 8.6;
      let cands = [], seed = 6, clock = 0, lastGot = '';          // seed 6: a typical first cohort (8 approvals of 100)
      function cohort(reseed) {
        if (reseed) seed++;
        const rng = B.rng(seed * 7919 + 13), p = [V.p1, V.p2, V.p3, V.p4].map(x => x / 100);
        cands = [];
        for (let i = 0; i < V.n; i++) {
          const u = [rng(), rng(), rng(), rng()], r = rng(), o = rng() * ENTRY, lane = rng();
          let fail = 4;
          for (let s = 0; s < 4; s++) if (u[s] >= p[s]) { fail = s; break; }
          const reason = fail === 4 ? null : fail === 0 ? (r < 0.7 ? 'safety' : 'strategy') : fail === 3 ? 'benefit' : (r < 0.55 ? 'efficacy' : r < 0.8 ? 'safety' : 'strategy');
          cands.push({ o, fail, reason, lane });
        }
        clock = 0;
        const P = p[0] * p[1] * p[2] * p[3];
        lastGot = '';
        ro.set('loa', (P * 100).toFixed(1) + ' %');
        ro.set('exp', (V.n * P).toFixed(1) + ' of ' + V.n);
        ro.set('need', (1 / P).toFixed(1));
        const perCand = 25 + p[0] * 59 + p[0] * p[1] * 255;
        ro.set('cost', '≈ ' + (perCand / P / 1000).toFixed(2) + ' billion US dollars');
        ro.set('time', 'about 13 years: ~4 discovery, ~1.5 preclinical, ~8 clinical and review');
        // survivors: expected and this cohort
        const expPts = [], actPts = [];
        let e = V.n, a = V.n;
        const alive = s => cands.filter(q => q.fail > s).length;
        for (let s = 0; s < 4; s++) {
          expPts.push([STAGES[s].t0, e], [STAGES[s].t1, e]); e *= p[s];
          actPts.push([STAGES[s].t0, a], [STAGES[s].t1, a]); a = alive(s);
        }
        expPts.push([8, e], [9, e]); actPts.push([8, a], [9, a]);
        pl.set({ series: [{ pts: expPts, label: 'expected', dash: [5, 4] }, { pts: actPts, label: 'this cohort', width: 2.6 }], y: { label: 'candidates still in development', min: 0, max: V.n * 1.05 } });
        loop.once();
      }
      const loop = kit.loop((dt) => {
        clock = Math.min(END, clock + dt * V.speed);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const m = 10, colW = (W - 2 * m) / 6, top = 44, flowB = Hh * 0.56, lgY = flowB + 16, trayT = flowB + 36, trayB = Hh - 34;
        const r = V.n > 120 ? 2.4 : V.n > 60 ? 3 : 3.8, step = 2 * r + 1.5;
        const heads = ['Preclinical', 'Phase I', 'Phase II', 'Phase III', 'Review', 'Approved'];
        const subs = ['waiting to enter', V.p1 + ' % pass · 1.5 y', V.p2 + ' % pass · 2.5 y', V.p3 + ' % pass · 3 y', V.p4 + ' % pass · 1 y', ''];
        for (let i = 0; i < 6; i++) {
          const x = m + i * colW;
          c.fillStyle = C.bg2; c.fillRect(x + 2, top - 4, colW - 4, flowB - top + 8);
          kit.label(c, heads[i], x + colW / 2, 14, { align: 'center', size: 12.5, weight: 700, color: i === 5 ? C.ok : C.text });
          kit.label(c, subs[i], x + colW / 2, 30, { align: 'center', size: 11, color: C.muted });
        }
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(m, trayT - 8); c.lineTo(W - m, trayT - 8); c.stroke();
        const RC = { efficacy: C.warn, safety: C.bad, strategy: C.muted, benefit: kit.hue(280) };
        const trayN = [0, 0, 0, 0], perRowT = Math.max(1, Math.floor((colW - 8) / step));
        let appN = 0;
        const perRowA = perRowT, flowH = flowB - top - 2 * r;
        for (const q of cands) {
          const tau = clock - q.o;
          let x, y, col;
          if (tau < 0) {
            x = m + 6 + (colW - 12) * clamp(1 + tau / ENTRY, 0, 1); y = top + r + q.lane * flowH; col = C.faint;
          } else if (q.fail < 4 && tau >= STAGES[q.fail].t1) {
            const k = trayN[q.fail]++, cx0 = m + (q.fail + 1) * colW + 6;
            x = cx0 + (k % perRowT) * step + r; y = trayT + r + Math.floor(k / perRowT) * step; col = RC[q.reason];
            if (y > trayB) continue;
          } else if (tau >= 8) {
            const k = appN++;
            x = m + 5 * colW + 6 + (k % perRowA) * step + r; y = top + r + Math.floor(k / perRowA) * step; col = C.ok;
          } else {
            let s = 0; while (s < 3 && tau >= STAGES[s].t1) s++;
            const f = (tau - STAGES[s].t0) / (STAGES[s].t1 - STAGES[s].t0);
            x = m + (s + 1) * colW + 6 + (colW - 12) * clamp(f, 0, 1); y = top + r + q.lane * flowH; col = C.accent;
          }
          kit.dot(c, x, y, r, col);
        }
        for (let s = 0; s < 4; s++) if (trayN[s]) kit.label(c, trayN[s] + ' failed', m + (s + 1.5) * colW, trayB + 10, { align: 'center', size: 11, color: C.muted });
        kit.label(c, appN + ' approved', m + 5.5 * colW, flowB - 8, { align: 'center', size: 12, weight: 700, color: C.ok });
        const gotTxt = appN + ' of ' + V.n + (clock >= END ? '' : ' so far');
        if (gotTxt !== lastGot) { lastGot = gotTxt; ro.set('got', gotTxt); }
        // legend of failure reasons, and the clock
        const legend = [['efficacy', 'lack of efficacy'], ['safety', 'safety'], ['strategy', 'strategic or commercial'], ['benefit', 'benefit–risk not shown']];
        let lx = m + 8;
        kit.label(c, 'year ' + Math.max(0, clock).toFixed(1) + ' of the clinical programme', W - m - 4, lgY, { align: 'right', size: 11.5, weight: 600, color: C.text });
        for (const [kk, txt] of legend) {
          if (lx + txt.length * 6.2 > W - 230) break;
          kit.dot(c, lx, lgY, 4, RC[kk]); kit.label(c, txt, lx + 8, lgY, { size: 11, color: C.muted }); lx += 22 + txt.length * 6.2;
        }
        kit.label(c, 'Discovery before this: ~5,000–10,000 compounds → ~250 preclinical → ~5 in trials for each approval', m + 4, Hh - 8, { size: 10.5, color: C.faint });
      }, box.stage);
      cohort(false);
      loop.start();
    }
  });

  /* ================================================================ found-uniformity */
  // the harmonised test for a target content of 100 %: stage 1 on 10 units, stage 2 on all 30
  function avTest(xs) {
    const n = xs.length, m = mean(xs), s = sdev(xs), M = m < 98.5 ? 98.5 : m > 101.5 ? 101.5 : m, k = n >= 30 ? 2.0 : 2.4;
    return { n, m, s, M, k, AV: Math.abs(M - m) + k * s };
  }
  function uduTest(units) {
    const a = avTest(units.slice(0, 10));
    if (a.AV <= 15) return { st1: a, pass: true, stage: 1, out: 0 };
    const b = avTest(units.slice(0, 30));
    const out = units.slice(0, 30).filter(x => Math.abs(x - b.M) > 0.25 * b.M).length;
    return { st1: a, st2: b, pass: b.AV <= 15 && out === 0, stage: 2, out };
  }
  function makeUnits(rng, mu, rsd, seg) {
    return Array.from({ length: 30 }, () => {
      const z = normal(rng), bad = seg && rng() < 0.04, side = rng() < 0.5 ? 0.72 : 1.28;
      return Math.max(0, bad ? mu * side * (1 + 0.02 * z) : mu * (1 + rsd / 100 * z));
    });
  }

  Hyper.sim('found-uniformity', {
    title: 'Uniformity of dosage units: the acceptance value',
    blurb: `A batch of a hypothetical tablet is sampled and ten tablets are assayed one by one, as in the harmonised pharmacopoeial test (USP <905>, Ph. Eur. 2.9.40). The acceptance value AV = |M − x̄| + k·s combines how far the mean is from the 98.5–101.5 % window with how much the tablets vary (k = 2.4 for 10 units). If AV exceeds 15, twenty more tablets are tested; the batch then passes only if the AV of all 30 (k = 2.0) is at most 15 and no tablet lies more than 25 % from M. The graph shows the chance that a batch passes, from 400 simulated tests at each spread.

**Try this**
- Keep the mean at 100 % and raise the spread: where does the chance of passing fall off a cliff? Compare with 6.25 %, where 2.4·s alone reaches 15.
- Move the mean to 95 %: the offset of 3.5 % from M = 98.5 % uses up part of the allowance, and the curve shifts left.
- Tick "poor mixing": a few tablets are 28 % off. Stage 1 may still pass, but when stage 2 runs, one stray tablet fails the whole batch.
- Test the same settings several times: at the edge, identical batches sometimes pass and sometimes fail — a pharmacopoeial test is a sample, not a guarantee.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300, maxH: 440 });
      const [g1] = panels(box, 1, 300);
      const ctl = kit.controls(box.side, [
        { id: 'mu', label: 'Batch mean content', min: 88, max: 112, step: 0.1, value: 100, unit: '%' },
        { id: 'rsd', label: 'Tablet-to-tablet variation (RSD)', min: 0.5, max: 12, step: 0.1, value: 3, unit: '%' },
        { id: 'seg', type: 'check', label: 'Poor mixing: a few tablets far off', value: false },
        { type: 'buttons', items: [{ id: 'test', label: 'Test a new batch', primary: true }] }
      ], (id) => {
        if (id === 'test') { seed++; draw(true); }
        else { if (id === 'mu' || id === 'seg') curves(); draw(false); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Mean x̄ of 10'], ['s', 'Standard deviation s'], ['M', 'Reference value M'], ['av', 'AV, stage 1 (10 tablets)'], ['av2', 'AV, stage 2 (30 tablets)'], ['res', 'Result'], ['p', 'Chance a batch like this passes']]);
      const pl = kit.plot(g1, { x: { label: 'tablet-to-tablet RSD (%)', min: 0, max: 12 }, y: { label: 'chance of passing (%)', min: 0, max: 100 }, legend: true }, 170);
      let seed = 1, units = [], res = null, shown = 30, pause = 0, curMu = [], cur100 = [];
      const passRate = (mu, rsd, seg, runs, rs) => { const rng = B.rng(rs); let ok = 0; for (let i = 0; i < runs; i++) if (uduTest(makeUnits(rng, mu, rsd, seg)).pass) ok++; return ok / runs; };
      function curves() {
        curMu = []; cur100 = [];
        for (let r = 0.5; r <= 12.01; r += 0.5) {
          curMu.push([r, 100 * passRate(V.mu, r, V.seg, 400, 99)]);
          if (Math.abs(V.mu - 100) > 0.05) cur100.push([r, 100 * passRate(100, r, V.seg, 400, 99)]);
        }
      }
      function draw(animate) {
        units = makeUnits(B.rng(seed * 104729 + 7), V.mu, V.rsd, V.seg);
        res = uduTest(units);
        shown = animate ? 0 : (res.stage === 2 ? 30 : 10); pause = 0;
        const p = passRate(V.mu, V.rsd, V.seg, 1000, 12345);
        const series = [{ pts: curMu, label: 'mean ' + V.mu.toFixed(1) + ' %', width: 2.6 }];
        if (cur100.length) series.push({ pts: cur100, label: 'mean 100 %', dash: [5, 4] });
        pl.set({ series, vlines: [{ x: V.rsd, label: 'your spread' }, { x: 6.25, label: '2.4·s = 15' }], marks: [{ x: V.rsd, y: 100 * p }] });
        ro.set('p', (100 * p).toFixed(1) + ' % (1,000 simulated batches)');
        report();
        loop.once();
      }
      function report() {
        const a = res.st1;
        if (shown < 10) { ['m', 's', 'M', 'av', 'av2', 'res'].forEach(k => ro.set(k, '…')); return; }
        ro.set('m', a.m.toFixed(2) + ' %'); ro.set('s', a.s.toFixed(2) + ' %'); ro.set('M', a.M.toFixed(2) + ' %');
        ro.set('av', a.AV.toFixed(2) + (a.AV <= 15 ? ' ≤ 15: pass' : ' > 15: test 20 more'));
        if (res.stage === 2 && shown >= 30) {
          ro.set('av2', res.st2.AV.toFixed(2) + (res.out ? ' · ' + res.out + ' tablet' + (res.out > 1 ? 's' : '') + ' beyond M ± 25 %' : ''));
          ro.set('res', res.pass ? 'PASSES at stage 2' : 'FAILS');
        } else if (res.stage === 2) { ro.set('av2', '…'); ro.set('res', 'testing 20 more…'); }
        else { ro.set('av2', 'not needed'); ro.set('res', 'PASSES at stage 1'); }
      }
      const loop = kit.loop((dt) => {
        const target = res.stage === 2 ? 30 : 10, before = shown;
        if (shown < target) {
          if (shown >= 10 && pause < 0.7) pause += dt;
          else shown = Math.min(target, shown + dt * 14);
        }
        if (Math.floor(before) !== Math.floor(shown) && (Math.floor(shown) === 10 || Math.floor(shown) === 30)) report();
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n = Math.floor(shown), cols = 10, cw = Math.min(64, (W - 40) / cols), rTab = Math.min(22, cw * 0.36), x0 = (W - cw * cols) / 2 + cw / 2;
        const M = shown >= 30 && res.st2 ? res.st2.M : res.st1.M;
        kit.label(c, 'Tablets assayed (% of label)', 14, 14, { size: 12.5, weight: 700, color: C.text });
        for (let i = 0; i < 30; i++) {
          const row = Math.floor(i / 10), x = x0 + (i % 10) * cw, y = 42 + row * (rTab * 2 + 16);
          if (i >= target) { if (row > 0 && res.stage === 1) continue; }
          if (i >= n) { c.strokeStyle = C.grid; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, rTab, rTab * 0.7, 0, 0, Math.PI * 2); c.stroke(); continue; }
          const d = Math.abs(units[i] - M) / M, col = d <= 0.15 ? C.ok : d <= 0.25 ? C.warn : C.bad;
          c.globalAlpha = 0.25; c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rTab, rTab * 0.7, 0, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
          c.strokeStyle = col; c.lineWidth = 2; c.stroke();
          kit.label(c, units[i].toFixed(1), x, y, { align: 'center', size: Math.min(12, rTab * 0.62), weight: 600, color: C.text });
        }
        // the number line
        const ly = Hh - 70, lx0 = 40, lx1 = W - 30, X = v => lx0 + (clamp(v, 60, 140) - 60) / 80 * (lx1 - lx0);
        c.fillStyle = C.bg2; c.fillRect(X(98.5), ly - 16, X(101.5) - X(98.5), 32);
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(lx0, ly); c.lineTo(lx1, ly); c.stroke();
        for (let v = 60; v <= 140; v += 10) { c.beginPath(); c.moveTo(X(v), ly - 4); c.lineTo(X(v), ly + 4); c.stroke(); kit.label(c, v + '', X(v), ly + 14, { align: 'center', size: 10.5, color: C.muted }); }
        c.setLineDash([4, 3]); c.strokeStyle = C.bad; c.beginPath(); c.moveTo(X(0.75 * M), ly - 20); c.lineTo(X(0.75 * M), ly + 20); c.moveTo(X(1.25 * M), ly - 20); c.lineTo(X(1.25 * M), ly + 20); c.stroke(); c.setLineDash([]);
        kit.label(c, 'M − 25 %', X(0.75 * M), ly - 26, { align: 'center', size: 10.5, color: C.bad });
        kit.label(c, 'M + 25 %', X(1.25 * M), ly - 26, { align: 'center', size: 10.5, color: C.bad });
        for (let i = 0; i < n; i++) kit.dot(c, X(units[i]), ly - 8 + (i % 3) * 4, 3, C.accent);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(M), ly - 18); c.lineTo(X(M), ly + 6); c.stroke();
        kit.label(c, 'M', X(M), ly - 26, { align: 'center', size: 11, weight: 700, color: C.text });
        // the AV gauge
        if (n >= 10) {
          const a = shown >= 30 && res.st2 ? res.st2 : res.st1, gy = Hh - 22, g0 = 40, gw = W - 70, S = v => g0 + clamp(v / 30, 0, 1) * gw;
          const off = Math.abs(a.M - a.m), sp = a.k * a.s;
          c.fillStyle = C.grid; c.fillRect(g0, gy - 7, gw, 14);
          c.fillStyle = C.warn; c.fillRect(g0, gy - 7, S(off) - g0, 14);
          c.fillStyle = C.accent; c.fillRect(S(off), gy - 7, S(off + sp) - S(off), 14);
          c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(S(15), gy - 11); c.lineTo(S(15), gy + 11); c.stroke();
          kit.label(c, 'AV ' + a.AV.toFixed(1) + ' = ' + off.toFixed(1) + ' (offset) + ' + sp.toFixed(1) + ' (k·s)', g0, gy - 16, { size: 11.5, weight: 600, color: C.text });
          kit.label(c, 'L1 = 15', S(15) + 4, gy - 16, { size: 11, color: C.bad });
        }
      }, box.stage);
      curves();
      draw(false);
      loop.start();
    }
  });

  /* ================================================================ found-control-chart */
  const C4 = { 2: 0.7979, 3: 0.8862, 4: 0.9213, 5: 0.94, 10: 0.9727 };
  const LSLw = 237.5, USLw = 262.5;

  Hyper.sim('found-control-chart', {
    title: 'A tablet press on a control chart',
    blurb: `A press makes hypothetical 250 mg tablets; every few seconds a subgroup of tablets is weighed and its mean plotted. The first 20 subgroups set the centre line and the control limits (±3 standard errors, the within-subgroup standard deviation estimated as s̄/c₄). After that, the four Western Electric rules watch every point: 1 — beyond 3σ; 2 — two of three beyond 2σ on one side; 3 — four of five beyond 1σ on one side; 4 — eight in a row on one side. The histogram shows the last 150 tablets against the specification of 237.5–262.5 mg (±5 %), with the capability Cpk.

**Try this**
- Let the chart run with no special cause: now and then a false alarm appears (rule 1 has about a 0.3 % chance per point) — so every signal is a question, not a verdict.
- Shift the mean by 3 mg: how many subgroups pass before a signal? Which rule usually fires first?
- Start a slow drift, like a wearing punch or a hopper emptying: rule 4 (eight in a row) often catches it long before any point crosses the limits — and long before tablets leave the specification.
- Double the variation: points stay near the centre on average but scatter beyond the limits, and Cpk collapses.
- Change the subgroup size from 5 to 2 and to 10: larger subgroups tighten the limits and detect small shifts sooner.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190, maxH: 300 });
      const [g1] = panels(box, 1, 300);
      const ctl = kit.controls(box.side, [
        { id: 'sigma', label: 'Tablet-to-tablet variation σ', min: 1, max: 6, step: 0.1, value: 3, unit: 'mg' },
        { id: 'n', type: 'select', label: 'Tablets per subgroup', options: [['2', 2], ['3', 3], ['5', 5], ['10', 10]], value: 5 },
        { id: 'speed', label: 'Subgroups per second', min: 1, max: 10, step: 1, value: 3 },
        { type: 'buttons', items: [{ id: 'shift', label: 'Shift +3 mg' }, { id: 'drift', label: 'Start a drift' }, { id: 'wide', label: 'Double the variation' }] },
        { type: 'buttons', items: [{ id: 'normal', label: 'Back to normal', primary: true }, { id: 'restart', label: 'Restart the chart' }] }
      ], (id) => {
        if (id === 'shift') { shift = 3; cause = 'mean shifted by +3 mg'; }
        else if (id === 'drift') { driftRate = 0.15; cause = 'drifting upwards 0.15 mg per subgroup'; }
        else if (id === 'wide') { varF = 2; cause = 'variation doubled'; }
        else if (id === 'normal') { shift = 0; drift = 0; driftRate = 0; varF = 1; cause = 'none (common-cause variation only)'; }
        else if (id === 'restart' || id === 'n') restart();
        refresh();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lim', 'Centre line and limits'], ['last', 'Last subgroup mean'], ['sig', 'Last signal'], ['cpk', 'Capability Cpk (last 25 subgroups)'], ['cause', 'Special cause introduced']]);
      const pl = kit.plot(g1, { x: { label: 'subgroup' }, y: { label: 'mean tablet weight (mg)' } }, 200);
      let rng = B.rng(2024), data = [], lim = null, signals = [], lastSig = '—', tablets = [];
      let shift = 0, drift = 0, driftRate = 0, varF = 1, cause = 'none (common-cause variation only)', acc = 0, turret = 0, pending = [];
      function restart() { data = []; lim = null; signals = []; lastSig = '—'; tablets = []; pending = []; }
      function rules(i) {
        const z = data.slice(Math.max(0, i - 7), i + 1).map(d => (d.xbar - lim.cl) / lim.sx), L = z.length, zi = z[L - 1];
        if (Math.abs(zi) > 3) return 1;
        const last = k => z.slice(Math.max(0, L - k));
        const same = (arr, thr, need) => arr.filter(v => v > thr).length >= need || arr.filter(v => v < -thr).length >= need;
        if (L >= 3 && Math.abs(zi) > 2 && same(last(3), 2, 2)) return 2;
        if (L >= 5 && Math.abs(zi) > 1 && same(last(5), 1, 4)) return 3;
        if (L >= 8 && (z.every(v => v > 0) || z.every(v => v < 0))) return 4;
        return 0;
      }
      function subgroup() {
        drift += driftRate;
        const n = V.n, xs = Array.from({ length: n }, () => Math.round((250 + shift + drift + V.sigma * varF * normal(rng)) * 10) / 10);
        const d = { i: data.length + 1, xs, xbar: mean(xs), s: sdev(xs) };
        data.push(d);
        for (const x of xs) { tablets.push(x); pending.push(x); }
        if (tablets.length > 150) tablets.splice(0, tablets.length - 150);
        if (pending.length > 12) pending.splice(0, pending.length - 12);
        if (!lim && data.length >= 20) {
          const base = data.slice(0, 20), cl = mean(base.map(q => q.xbar)), sw = mean(base.map(q => q.s)) / (C4[n] || 0.94);
          lim = { cl, sw, sx: sw / Math.sqrt(n), n };
        }
        if (lim) { const r = rules(data.length - 1); if (r) { signals.push({ i: d.i, r, y: d.xbar }); lastSig = 'rule ' + r + ' at subgroup ' + d.i; } }
      }
      function refresh() {
        const win = data.slice(-50), i0 = win.length ? win[0].i : 1;
        const hl = [], C = kit.colors();
        if (lim) {
          hl.push({ y: lim.cl + 3 * lim.sx, label: 'UCL', color: C.bad }, { y: lim.cl, label: 'centre', color: C.muted }, { y: lim.cl - 3 * lim.sx, label: 'LCL', color: C.bad });
          hl.push({ y: lim.cl + 2 * lim.sx, color: C.faint, dash: [2, 4] }, { y: lim.cl - 2 * lim.sx, color: C.faint, dash: [2, 4] });
          hl.push({ y: lim.cl + lim.sx, color: C.faint, dash: [1, 5] }, { y: lim.cl - lim.sx, color: C.faint, dash: [1, 5] });
        }
        const ys = win.map(d => d.xbar).concat(lim ? [lim.cl + 3.4 * lim.sx, lim.cl - 3.4 * lim.sx] : [250 + 4, 250 - 4]);
        const ymin = Math.min(...ys), ymax = Math.max(...ys);
        pl.set({
          series: [{ pts: win.map(d => [d.i, d.xbar]), label: 'subgroup mean', dots: 2.6, width: 1.4 }],
          marks: signals.filter(s => s.i >= i0).map(s => ({ x: s.i, y: s.y, color: C.bad, label: 'R' + s.r })),
          hlines: hl, x: { label: 'subgroup', min: i0, max: i0 + 49 }, y: { label: 'mean tablet weight (mg)', min: ymin - 0.5, max: ymax + 0.5 }
        });
        ro.set('lim', lim ? lim.cl.toFixed(2) + ' mg · ' + (lim.cl - 3 * lim.sx).toFixed(2) + ' to ' + (lim.cl + 3 * lim.sx).toFixed(2) + ' mg' : 'collecting ' + data.length + ' of 20 subgroups');
        ro.set('last', data.length ? data[data.length - 1].xbar.toFixed(2) + ' mg' : '—');
        ro.set('sig', lastSig);
        const rec = data.slice(-25);
        if (rec.length >= 5) {
          const mu = mean(rec.map(d => d.xbar)), sw = mean(rec.map(d => d.s)) / (C4[V.n] || 0.94), cpk = Math.min(USLw - mu, mu - LSLw) / (3 * Math.max(1e-6, sw));
          ro.set('cpk', cpk.toFixed(2) + ' (mean ' + mu.toFixed(1) + ' mg, σ ' + sw.toFixed(2) + ' mg)');
        } else ro.set('cpk', '—');
        ro.set('cause', cause);
      }
      const loop = kit.loop((dt) => {
        acc += dt * V.speed; turret += dt * 2.5;
        let added = false;
        while (acc >= 1) { acc -= 1; subgroup(); added = true; }
        if (added) refresh();
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the press: a rotating turret, a chute and a balance
        const tx = Math.min(90, W * 0.12), ty = Hh / 2, tr = Math.min(52, Hh * 0.3);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(tx, ty, tr, 0, Math.PI * 2); c.stroke();
        for (let k = 0; k < 10; k++) { const a = turret + k * Math.PI / 5; c.fillStyle = C.muted; c.fillRect(tx + Math.cos(a) * tr * 0.75 - 4, ty + Math.sin(a) * tr * 0.75 - 4, 8, 8); }
        kit.label(c, 'press', tx, ty, { align: 'center', size: 11, color: C.muted });
        const bx = tx + tr + Math.min(130, W * 0.18), byy = ty + tr * 0.5;
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(tx + tr, ty); c.lineTo(bx - 20, byy); c.stroke();
        const ph = acc;
        for (let k = 0; k < 3; k++) { const f = (ph + k / 3) % 1; c.fillStyle = kit.hue(200, 0.8); c.beginPath(); c.ellipse(tx + tr + (bx - 20 - tx - tr) * f, ty + (byy - ty) * f - 4, 6, 3.5, 0, 0, Math.PI * 2); c.fill(); }
        c.strokeStyle = C.text; c.strokeRect(bx - 22, byy, 64, 22); c.fillStyle = C.bg2; c.fillRect(bx - 16, byy + 4, 52, 14);
        const lastW = tablets.length ? tablets[tablets.length - 1] : 250;
        kit.label(c, lastW.toFixed(1) + ' mg', bx + 10, byy + 11, { align: 'center', size: 11, weight: 700, color: lastW < LSLw || lastW > USLw ? C.bad : C.ok });
        kit.label(c, 'balance', bx + 10, byy + 34, { align: 'center', size: 10.5, color: C.muted });
        // the histogram of the last 150 tablets against the specification
        const hx0 = bx + 70, hx1 = W - 16, hy1 = Hh - 24, hy0 = 22, lo = 230, hi = 270, bins = 40;
        if (hx1 - hx0 > 80) {
          const HX = v => hx0 + (clamp(v, lo, hi) - lo) / (hi - lo) * (hx1 - hx0), cnt = new Array(bins).fill(0);
          for (const w of tablets) cnt[clamp(Math.floor((w - lo) / (hi - lo) * bins), 0, bins - 1)]++;
          const mx = Math.max(4, ...cnt), bw = (hx1 - hx0) / bins;
          for (let k = 0; k < bins; k++) {
            const v = lo + (k + 0.5) * (hi - lo) / bins, h = cnt[k] / mx * (hy1 - hy0 - 14);
            c.fillStyle = v < LSLw || v > USLw ? C.bad : C.accent; c.fillRect(hx0 + k * bw + 1, hy1 - h, bw - 2, h);
          }
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(hx0, hy1); c.lineTo(hx1, hy1); c.stroke();
          for (const [v, t] of [[LSLw, 'LSL'], [USLw, 'USL']]) { c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(HX(v), hy0); c.lineTo(HX(v), hy1); c.stroke(); c.setLineDash([]); kit.label(c, t + ' ' + v, HX(v), hy0 - 8, { align: 'center', size: 10.5, color: C.bad }); }
          for (let v = lo; v <= hi; v += 10) kit.label(c, v + '', HX(v), hy1 + 11, { align: 'center', size: 10.5, color: C.muted });
          kit.label(c, 'last ' + tablets.length + ' tablets (mg)', hx1, hy0 + 8, { align: 'right', size: 11, color: C.muted });
        }
      }, box.stage);
      refresh();
      loop.start();
    }
  });

  /* ================================================================ found-hplc */
  // linear solvent strength: log k = log kw − S·φ (φ = acetonitrile fraction); rf = response relative to the drug
  const CMPDS = [
    { name: 'impurity A', logkw: 2.1, S: 3.4, rf: 0.8 },
    { name: 'drug', logkw: 2.6, S: 3.5, rf: 1.0 },
    { name: 'impurity B', logkw: 2.75, S: 3.75, rf: 1.0 }
  ];
  const RESP = 15.1;                                   // mAU·s per µg/mL of drug (10 µL injection, UV)
  function hplc(phi, dp, F) {
    const t0 = 1.5 / F, N0 = 60000 / dp, N = N0 / (1 + 0.3 * (F - 1) * (F - 1) * dp / 5);
    const peaks = CMPDS.map(q => { const k = Math.pow(10, q.logkw - q.S * phi), tR = t0 * (1 + k); return { q, k, tR, sig: tR / Math.sqrt(N) }; });
    const pressure = 110 * F * Math.pow(5 / dp, 2) * (1.1 - 0.6 * (phi - 0.3));
    return { t0, N, peaks, pressure };
  }
  // drug area as a data system would integrate it next to impurity B: below Rs ≈ 1 a small impurity is only a shoulder
  // and both are integrated as one peak; above that, a perpendicular drop line at the valley splits them
  function integrateDrug(ch, AD, AB) {
    const d = ch.peaks[1], b = ch.peaks[2], Rs = Math.abs(b.tR - d.tR) / (2 * (d.sig + b.sig));
    if (AB <= 0) return { area: AD, Rs, merged: false };
    if (Rs < 1) return { area: AD + AB, Rs, merged: true };
    const [e, l] = d.tR < b.tR ? [d, b] : [b, d], xv = e.tR + (l.tR - e.tR) * e.sig / (e.sig + l.sig);
    const area = d.tR < b.tR ? AD * Phi((xv - d.tR) / d.sig) + AB * Phi((xv - b.tR) / b.sig)
                             : AD * (1 - Phi((xv - d.tR) / d.sig)) + AB * (1 - Phi((xv - b.tR) / b.sig));
    return { area, Rs, merged: false, xv };
  }

  Hyper.sim('found-hplc', {
    title: 'An HPLC assay: separate, calibrate, measure',
    blurb: `A reversed-phase HPLC assay of a hypothetical 50 mg tablet. Above, the injected sample travels through the column and the three substances separate into bands; below, the UV detector draws the chromatogram. Retention follows the linear-solvent-strength model (log k falls linearly with the fraction of acetonitrile); peak width follows the plate number, set by the particle size. Five reference-standard solutions (50–150 µg/mL) build the calibration line in the graph, and the sample's drug peak is read from it as % of the label. The sample has been stored badly: it contains a degradant, impurity B, that elutes close to the drug.

**Try this**
- At 53 % acetonitrile with 5 µm particles, impurity B is only a shoulder on the drug peak (Rs below 1): the data system integrates both as one peak and the assay reads high. Compare "found" with "true" — and notice that the calibration line is excellent all the same.
- Switch to 3 µm and then 1.7 µm particles, or lower the acetonitrile to 48 %: resolution passes 1.5 and the bias vanishes — at the cost of pressure or run time.
- Raise the acetonitrile to 58 %: the two co-elute completely, and a method that looks fast and clean reports a degraded sample as good. This is why methods must be *stability-indicating*.
- Go to 70 %: the peaks separate again, but in the opposite order — the two molecules respond differently to solvent strength.
- Double the flow: everything elutes twice as fast and the pressure doubles, while the peaks broaden a little.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320, maxH: 480 });
      const [g1] = panels(box, 1, 300);
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Acetonitrile in the mobile phase', min: 40, max: 70, step: 1, value: 53, unit: '%' },
        { id: 'dp', type: 'select', label: 'Column particle size (150 mm column)', options: [['5 µm (HPLC)', 5], ['3 µm', 3], ['1.7 µm (UHPLC)', 1.7]], value: 5 },
        { id: 'F', label: 'Flow rate', min: 0.5, max: 2, step: 0.1, value: 1, unit: 'mL/min' },
        { id: 'deg', label: 'Impurity B in the sample', min: 0, max: 10, step: 0.5, value: 3, unit: '% of label' },
        { type: 'buttons', items: [{ id: 'inject', label: 'Inject again', primary: true }, { id: 'sample', label: 'New sample' }] }
      ], (id) => { if (id === 'inject') noiseSeed++; if (id === 'sample') { sampleSeed++; noiseSeed++; } run(true); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rs', 'Resolution, drug / impurity B'], ['n', 'Plate number N'], ['p', 'Pressure'], ['run', 'Run time'], ['cal', 'Calibration line'], ['res', 'Sample: found / true'], ['msg', '']]);
      const pl = kit.plot(g1, { x: { label: 'drug concentration (µg/mL)', min: 0, max: 160 }, y: { label: 'peak area (mAU·s)', min: 0 }, legend: true }, 190);
      let noiseSeed = 1, sampleSeed = 1, ch = null, sample = null, tau = 0, runT = 10, noise = [];
      function run(animate) {
        ch = hplc(V.phi / 100, V.dp, V.F);
        const rs = B.rng(sampleSeed * 31 + 5), rn = B.rng(noiseSeed * 977 + 3);
        const truePct = 96 + 6 * rs();
        const inj = () => 1 + 0.006 * normal(rn);
        // calibration standards (pure reference standard: no impurities)
        const stds = [50, 75, 100, 125, 150].map(Cc => [Cc, RESP * Cc * inj() + 2 * normal(rn)]);
        const xs = stds.map(p => p[0]), ys = stds.map(p => p[1]), mx = mean(xs), my = mean(ys);
        let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < 5; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
        const m = sxy / sxx, b = my - m * mx, r = sxy / Math.sqrt(sxx * syy);
        // the sample: nominal 100 µg/mL of drug, plus impurity A at 0.4 % and impurity B at the chosen level
        const conc = [0.4, truePct, V.deg], areas = conc.map((Cc, i) => RESP * CMPDS[i].rf * Cc * inj());
        const ig = integrateDrug(ch, areas[1], areas[2]), found = (ig.area - b) / m;
        sample = { truePct, areas, ig, found, m, b, r, stds };
        runT = Math.max(...ch.peaks.map(p => p.tR)) * 1.15 + 0.5;
        const nrng = B.rng(noiseSeed * 13 + 1); noise = Array.from({ length: 400 }, () => 0.15 * normal(nrng));
        tau = animate ? 0 : runT;
        const suit = ig.Rs >= 1.5;
        ro.set('rs', ig.Rs.toFixed(2) + (suit ? ' ≥ 1.5: system suitable' : ig.Rs < 1 ? ' < 1: integrated as one peak' : ' < 1.5: fails suitability'));
        ro.set('n', String(Math.round(ch.N)).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        ro.set('p', ch.pressure.toFixed(0) + ' bar' + (ch.pressure > 1000 ? ' — above most UHPLC pumps' : ch.pressure > 400 && V.dp >= 3 ? ' — above a standard HPLC pump' : ''));
        ro.set('run', runT.toFixed(1) + ' min');
        ro.set('cal', 'slope ' + m.toFixed(2) + ', intercept ' + b.toFixed(1) + ', r = ' + r.toFixed(5));
        ro.set('res', found.toFixed(1) + ' % / ' + truePct.toFixed(1) + ' % of label');
        const bias = found - truePct;
        ro.set('msg', Math.abs(bias) < 1 ? 'accurate to within 1 %' : 'bias ' + (bias > 0 ? '+' : '') + bias.toFixed(1) + ' %: ' + (bias > 0 ? 'impurity B counted as drug' : 'part of the drug given to impurity B'));
        pl.set({
          series: [
            { pts: [[0, b], [160, b + 160 * m]], label: 'fitted line', width: 1.6 },
            { pts: stds, label: 'reference standards', line: false, dots: 4 }
          ],
          marks: [{ x: found, y: ig.area, label: 'sample: ' + found.toFixed(1) + ' µg/mL' }],
          hlines: [{ y: ig.area }], vlines: [{ x: found }]
        });
        loop.once();
      }
      const signal = t => {
        let s = 0;
        sample.areas.forEach((A, i) => { const p = ch.peaks[i], sgs = p.sig * 60; s += A / (sgs * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((t - p.tR) / p.sig, 2)); });
        return s;
      };
      const loop = kit.loop((dt) => {
        tau = Math.min(runT, tau + dt * runT / 3.5);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cols = [kit.hue(35), C.accent, kit.hue(330)];
        // the instrument: pump, injector, column with separating bands, detector
        const sy = 30, colX0 = Math.min(200, W * 0.26), colX1 = W - Math.min(150, W * 0.2), Lc = colX1 - colX0;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(30, sy); c.lineTo(W - 30, sy); c.stroke();
        const boxes = [[16, 'pump'], [colX0 - 70, 'injector'], [colX1 + 18, 'UV detector']];
        for (const [bx0, t] of boxes) { c.fillStyle = C.bg2; c.fillRect(bx0, sy - 12, t.length * 7 + 12, 24); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(bx0, sy - 12, t.length * 7 + 12, 24); kit.label(c, t, bx0 + 6, sy, { size: 11, color: C.text }); }
        c.fillStyle = C.grid; c.fillRect(colX0, sy - 9, Lc, 18); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(colX0, sy - 9, Lc, 18);
        kit.label(c, 'column', colX0 + Lc / 2, sy + 22, { align: 'center', size: 10.5, color: C.muted });
        ch.peaks.forEach((p, i) => {
          const f = tau / p.tR;
          if (f > 1.02 || sample.areas[i] <= 0) return;
          const x = colX0 + Lc * f, w = Math.max(3, 4 * Lc / Math.sqrt(ch.N) * Math.sqrt(Math.max(0.02, f)) * 1.5);
          c.globalAlpha = clamp(0.25 + sample.areas[i] / 3000, 0.25, 0.85); c.fillStyle = cols[i]; c.fillRect(clamp(x - w / 2, colX0, colX1), sy - 8, Math.min(w, colX1 - clamp(x - w / 2, colX0, colX1)), 16); c.globalAlpha = 1;
        });
        // the chromatogram
        const gx0 = 50, gx1 = W - 16, gy0 = 70, gy1 = Hh - 26;
        const hmax = Math.max(...sample.areas.map((A, i) => A / (ch.peaks[i].sig * 60 * Math.sqrt(2 * Math.PI)))) * 1.18 + 1;
        const X = t => gx0 + t / runT * (gx1 - gx0), Y = v => gy1 - v / hmax * (gy1 - gy0);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(gx0, gy0); c.lineTo(gx0, gy1); c.lineTo(gx1, gy1); c.stroke();
        const tstep = Hyper.niceStep(runT, 8);
        for (let t = 0; t <= runT + 1e-9; t += tstep) kit.label(c, (+t.toFixed(2)) + '', X(t), gy1 + 11, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'time (min)', gx1, gy1 + 22, { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, 'mAU', gx0 - 8, gy0, { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, (hmax / 1.18).toFixed(0), gx0 - 8, Y(hmax / 1.18), { align: 'right', size: 10.5, color: C.faint });
        // shade the drug area as integrated
        const d = ch.peaks[1], ig = sample.ig;
        let a0 = d.tR - 4 * d.sig, a1 = d.tR + 4 * d.sig;
        if (ig.merged) { const bpk = ch.peaks[2]; a0 = Math.min(a0, bpk.tR - 4 * bpk.sig); a1 = Math.max(a1, bpk.tR + 4 * bpk.sig); }
        else if (ig.xv != null) { if (d.tR < ch.peaks[2].tR) a1 = Math.min(a1, ig.xv); else a0 = Math.max(a0, ig.xv); }
        a1 = Math.min(a1, tau);
        if (a1 > a0) {
          c.globalAlpha = 0.22; c.fillStyle = C.accent; c.beginPath(); c.moveTo(X(a0), gy1);
          for (let k = 0; k <= 60; k++) { const t = a0 + (a1 - a0) * k / 60; c.lineTo(X(t), Y(signal(t))); }
          c.lineTo(X(a1), gy1); c.closePath(); c.fill(); c.globalAlpha = 1;
          if (ig.xv != null && tau > ig.xv) { c.strokeStyle = C.accent; c.lineWidth = 1; c.beginPath(); c.moveTo(X(ig.xv), gy1); c.lineTo(X(ig.xv), Y(signal(ig.xv))); c.stroke(); }
        }
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath();
        const npts = 600;
        for (let k = 0; k <= npts; k++) {
          const t = runT * k / npts; if (t > tau) break;
          const v = signal(t) + noise[k % noise.length];
          if (k === 0) c.moveTo(X(t), Y(v)); else c.lineTo(X(t), Y(v));
        }
        c.stroke();
        ch.peaks.forEach((p, i) => {
          if (tau < p.tR || sample.areas[i] <= 0) return;
          const h = sample.areas[i] / (p.sig * 60 * Math.sqrt(2 * Math.PI));
          const lift = i === 2 && Math.abs(p.tR - ch.peaks[1].tR) < 3 * (p.sig + ch.peaks[1].sig) ? 16 : 0;
          kit.label(c, p.q.name + ' ' + p.tR.toFixed(2) + ' min', X(p.tR) + (i === 2 ? 6 : i === 1 ? -6 : 0), Math.max(gy0 + 6, Y(Math.max(h, signal(p.tR))) - 10 - lift), { align: i === 2 ? 'left' : i === 1 ? 'right' : 'center', size: 11, weight: 600, color: cols[i] });
        });
        kit.label(c, 'sample chromatogram · drug peak as integrated (shaded)', gx1, gy0 - 8, { align: 'right', size: 11, color: C.muted });
      }, box.stage);
      run(false);
      loop.start();
    }
  });

  /* ================================================================ found-design-space */
  // hypothetical wet-granulated tablet: coded water x1 = (W − 30)/10, coded force x2 = (F − 14)/6
  const dsD = (x1, x2) => 84 - 7 * x1 - 5 * x2 - 1.5 * x1 * x2 - 2 * x1 * x1 - 1 * x2 * x2;      // % dissolved at 30 min
  const dsH = (x1, x2) => 75 + 8 * x1 + 30 * x2 - 2 * x1 * x1 - 6 * x2 * x2;                     // hardness, N
  const quadTerms = (x1, x2) => [1, x1, x2, x1 * x2, x1 * x1, x2 * x2];
  function lsq(rows, ys) {                             // least squares by the normal equations (Gaussian elimination)
    const p = rows[0].length, A = Array.from({ length: p }, () => new Array(p + 1).fill(0));
    rows.forEach((r, n) => { for (let i = 0; i < p; i++) { for (let j = 0; j < p; j++) A[i][j] += r[i] * r[j]; A[i][p] += r[i] * ys[n]; } });
    for (let i = 0; i < p; i++) {
      let piv = i; for (let k = i + 1; k < p; k++) if (Math.abs(A[k][i]) > Math.abs(A[piv][i])) piv = k;
      [A[i], A[piv]] = [A[piv], A[i]];
      const d = A[i][i] || 1e-12;
      for (let k = 0; k < p; k++) if (k !== i) { const f = A[k][i] / d; for (let j = i; j <= p; j++) A[k][j] -= f * A[i][j]; }
    }
    return A.map((row, i) => row[p] / (row[i] || 1e-12));
  }
  // marching squares: the zero line of f(x, y) over a grid, drawn as segments
  function contour(c, f, nx, ny, X, Y, xa, xb, ya, yb) {
    const v = [];
    for (let j = 0; j <= ny; j++) { v.push([]); for (let i = 0; i <= nx; i++) v[j].push(f(xa + (xb - xa) * i / nx, ya + (yb - ya) * j / ny)); }
    const px = i => xa + (xb - xa) * i / nx, py = j => ya + (yb - ya) * j / ny;
    const lerp = (a, b) => a / (a - b);
    c.beginPath();
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const a = v[j][i], b = v[j][i + 1], cc = v[j + 1][i + 1], d = v[j + 1][i], pts = [];
      if ((a > 0) !== (b > 0)) pts.push([px(i + lerp(a, b)), py(j)]);
      if ((b > 0) !== (cc > 0)) pts.push([px(i + 1), py(j + lerp(b, cc))]);
      if ((d > 0) !== (cc > 0)) pts.push([px(i + lerp(d, cc)), py(j + 1)]);
      if ((a > 0) !== (d > 0)) pts.push([px(i), py(j + lerp(a, d))]);
      for (let k = 0; k + 1 < pts.length; k += 2) { c.moveTo(X(pts[k][0]), Y(pts[k][1])); c.lineTo(X(pts[k + 1][0]), Y(pts[k + 1][1])); }
    }
    c.stroke();
  }

  Hyper.sim('found-design-space', {
    title: 'Quality by design: finding the design space',
    blurb: `A hypothetical immediate-release tablet made by wet granulation. Two process parameters — the granulation water and the compression force — control two critical quality attributes: dissolution at 30 minutes (more water makes denser granules, more force a less porous tablet: both slow it) and hardness (which rises with force and water, and must be high enough for the tablet to survive packing). The map shows where each limit is met; green, where both are, is the **design space**. Drag the white set point; the rectangle around it is the process's normal variation. Then run a designed experiment — a 3 × 3 grid plus three centre points, with test noise — fit quadratic models and compare the fitted design space (dashed) with the truth.

**Try this**
- Drag the set point to the green region's edge: the centre is inside, but part of the normal-variation rectangle is not. A robust process sits well inside.
- Tighten the dissolution limit to 85 %: the design space shrinks towards low water and moderate force.
- Run the experiment several times with high test noise: the fitted edge wobbles. How many runs, or how little noise, would you want before drawing a design space from them?
- Find the "sweet spot" that tolerates ±3 % water and ±2 kN force. Is there one?`,
    mount(box, kit) {
      const Bi = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'dmin', label: 'Dissolution limit (30 min)', min: 70, max: 90, step: 1, value: 80, unit: '%' },
        { id: 'hmin', label: 'Minimum hardness', min: 40, max: 100, step: 1, value: 60, unit: 'N' },
        { id: 'nw', label: 'Normal variation of water (±)', min: 0, max: 5, step: 0.5, value: 2, unit: '%' },
        { id: 'nf', label: 'Normal variation of force (±)', min: 0, max: 3, step: 0.25, value: 1, unit: 'kN' },
        { id: 'noise', label: 'Test noise (dissolution SD)', min: 0, max: 5, step: 0.5, value: 1.5, unit: '%' },
        { type: 'buttons', items: [{ id: 'doe', label: 'Run the experiment (12 runs)', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], (id) => { if (id === 'doe') doe(); else if (id === 'clear') fit = null; report(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sp', 'Set point'], ['d', 'Dissolution at 30 min'], ['h', 'Hardness'], ['in', 'Inside the design space?'], ['rob', 'Normal variation inside?'], ['fit', 'Fitted design space']]);
      let Wsp = 25, Fsp = 14, fit = null, seed = 1, pulse = 0;
      const X1 = w => (w - 30) / 10, X2 = f => (f - 14) / 6;
      const margin = (Df, Hf) => (w, f) => Math.min(Df(X1(w), X2(f)) - V.dmin, (Hf(X1(w), X2(f)) - V.hmin) / 4);
      function doe() {
        const rng = Bi.rng(seed++ * 7 + 3), pts = [];
        for (const a of [-1, 0, 1]) for (const b of [-1, 0, 1]) pts.push([a, b]);
        pts.push([0, 0], [0, 0], [0, 0]);
        const runs = pts.map(([a, b]) => ({ a, b, d: dsD(a, b) + V.noise * normal(rng), h: dsH(a, b) + 2.5 * V.noise * normal(rng) }));
        const rows = runs.map(r => quadTerms(r.a, r.b));
        const cd = lsq(rows, runs.map(r => r.d)), chh = lsq(rows, runs.map(r => r.h));
        const ev = cf => (x1, x2) => quadTerms(x1, x2).reduce((s, t, i) => s + t * cf[i], 0);
        fit = { runs, D: ev(cd), H: ev(chh), cd };
      }
      function report() {
        const x1 = X1(Wsp), x2 = X2(Fsp), d = dsD(x1, x2), h = dsH(x1, x2), okD = d >= V.dmin, okH = h >= V.hmin;
        ro.set('sp', 'water ' + Wsp.toFixed(1) + ' % · force ' + Fsp.toFixed(1) + ' kN');
        ro.set('d', d.toFixed(1) + ' % (limit ' + V.dmin + ' %)');
        ro.set('h', h.toFixed(0) + ' N (minimum ' + V.hmin + ' N)');
        ro.set('in', okD && okH ? 'yes' : !okD && !okH ? 'no — both fail' : !okD ? 'no — dissolves too slowly' : 'no — too soft');
        let bad = 0, tot = 0;
        for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) {
          const w = Wsp - V.nw + 2 * V.nw * i / 8, f = Fsp - V.nf + 2 * V.nf * j / 8; tot++;
          if (dsD(X1(w), X2(f)) < V.dmin || dsH(X1(w), X2(f)) < V.hmin) bad++;
        }
        ro.set('rob', bad === 0 ? 'yes — the whole range is inside' : 'no — ' + Math.round(100 * bad / tot) + ' % of the range fails');
        if (fit) {
          let agree = 0, n = 0;
          for (let i = 0; i <= 30; i++) for (let j = 0; j <= 20; j++) {
            const a = -1.5 + 3 * i / 30, b = -1.5 + 3 * j / 20, t = dsD(a, b) >= V.dmin && dsH(a, b) >= V.hmin, g = fit.D(a, b) >= V.dmin && fit.H(a, b) >= V.hmin;
            n++; if (t === g) agree++;
          }
          ro.set('fit', 'agrees with the truth on ' + Math.round(100 * agree / n) + ' % of the map');
        } else ro.set('fit', 'run the experiment');
        loop.once();
      }
      let geo = null;
      kit.drag(st, {
        hit: p => geo && p.x >= geo.x0 - 10 && p.x <= geo.x1 + 10 && p.y >= geo.y0 - 10 && p.y <= geo.y1 + 10 ? 'sp' : null,
        move: (k, p) => { Wsp = clamp(geo.iw(p.x), 15, 45); Fsp = clamp(geo.jf(p.y), 5, 23); report(); },
        hover: true
      });
      const loop = kit.loop((dt) => {
        pulse += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const x0 = 58, x1 = W - (W > 560 ? 150 : 16), y0 = 16, y1 = Hh - 40;
        const X = w => x0 + (w - 15) / 30 * (x1 - x0), Y = f => y1 - (f - 5) / 18 * (y1 - y0);
        geo = { x0, x1, y0, y1, iw: px => 15 + (px - x0) / (x1 - x0) * 30, jf: py => 5 + (y1 - py) / (y1 - y0) * 18 };
        // status map, merged into runs along each row
        const nx = 90, ny = 54, cw = (x1 - x0) / nx, chh = (y1 - y0) / ny;
        const fills = [kit.hue(150, 0.4), kit.hue(35, 0.3), kit.hue(210, 0.3), kit.hue(0, 0.3)];
        for (let j = 0; j < ny; j++) {
          const f = 23 - 18 * (j + 0.5) / ny;
          let start = 0, prev = -1;
          for (let i = 0; i <= nx; i++) {
            let s = -2;
            if (i < nx) { const w = 15 + 30 * (i + 0.5) / nx, a = X1(w), b = X2(f), fd = dsD(a, b) < V.dmin, fh = dsH(a, b) < V.hmin; s = fd && fh ? 3 : fd ? 1 : fh ? 2 : 0; }
            if (s !== prev) { if (prev >= 0) { c.fillStyle = fills[prev]; c.fillRect(x0 + start * cw, y0 + j * chh, (i - start) * cw + 0.5, chh + 0.5); } start = i; prev = s; }
          }
        }
        // the true limit lines and the fitted edge
        c.lineWidth = 2; c.strokeStyle = kit.hue(35); contour(c, (w, f) => dsD(X1(w), X2(f)) - V.dmin, 60, 36, X, Y, 15, 45, 5, 23);
        c.strokeStyle = kit.hue(210); contour(c, (w, f) => dsH(X1(w), X2(f)) - V.hmin, 60, 36, X, Y, 15, 45, 5, 23);
        if (fit) {
          c.strokeStyle = C.text; c.lineWidth = 2; c.setLineDash([6, 4]);
          contour(c, margin(fit.D, fit.H), 60, 36, X, Y, 15, 45, 5, 23); c.setLineDash([]);
          for (const r of fit.runs) { const px = X(30 + 10 * r.a), py = Y(14 + 6 * r.b); c.fillStyle = C.text; c.fillRect(px - 3.5, py - 3.5, 7, 7); }
        }
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
        for (let w = 15; w <= 45; w += 5) kit.label(c, w + '', X(w), y1 + 12, { align: 'center', size: 10.5, color: C.muted });
        for (let f = 5; f <= 23; f += 3) kit.label(c, f + '', x0 - 6, Y(f), { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, 'granulation water (% w/w)', (x0 + x1) / 2, y1 + 28, { align: 'center', size: 11.5, color: C.text });
        kit.label(c, 'force (kN)', 6, y0 + 8, { size: 11, color: C.text });
        // the set point and its normal variation
        const rx0 = X(Wsp - V.nw), rx1 = X(Wsp + V.nw), ry0 = Y(Fsp + V.nf), ry1 = Y(Fsp - V.nf);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(rx0, ry0, Math.max(1, rx1 - rx0), Math.max(1, ry1 - ry0));
        kit.dot(c, X(Wsp), Y(Fsp), 6 + Math.sin(pulse * 3), '#ffffff', C.text);
        // legend
        if (W > 560) {
          const lx = x1 + 12;
          [[fills[0], 'both CQAs met (design space)'], [fills[1], 'dissolves too slowly'], [fills[2], 'too soft'], [fills[3], 'both fail']].forEach(([col, t], i) => {
            c.fillStyle = col; c.fillRect(lx, y0 + 6 + i * 36, 14, 14);
            wrap(kit, c, t, lx + 20, y0 + 13 + i * 36, W - lx - 26, { size: 11, color: C.text });
          });
          const ly = y0 + 160;
          c.lineWidth = 2; c.strokeStyle = kit.hue(35); c.beginPath(); c.moveTo(lx, ly); c.lineTo(lx + 16, ly); c.stroke(); kit.label(c, 'D30 = ' + V.dmin + ' %', lx + 22, ly, { size: 11, color: C.text });
          c.strokeStyle = kit.hue(210); c.beginPath(); c.moveTo(lx, ly + 20); c.lineTo(lx + 16, ly + 20); c.stroke(); kit.label(c, 'hardness = ' + V.hmin + ' N', lx + 22, ly + 20, { size: 11, color: C.text });
          if (fit) { c.strokeStyle = C.text; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(lx, ly + 40); c.lineTo(lx + 16, ly + 40); c.stroke(); c.setLineDash([]); kit.label(c, 'fitted edge', lx + 22, ly + 40, { size: 11, color: C.text }); }
        }
      }, box.stage);
      report();
      loop.start();
    }
  });

  /* ================================================================ found-screening */
  Hyper.sim('found-screening', {
    title: 'Screening a market for falsified packs',
    blurb: `A hypothetical market of 360 packs of an antimalarial, some of them falsified. A survey picks packs at random and tests each one; a test does not catch every falsified pack (its sensitivity Se). The chance that a survey finds at least one is 1 − (1 − p·Se)ⁿ — the curve in the graph. Run one survey to see which packs were picked, or 500 surveys (each on a fresh market) to compare the observed success rate with the formula.

**Try this**
- At 5 % falsified with a good test, how many packs give a 95 % chance of finding at least one? Check the curve, then run 500 surveys.
- Drop the prevalence to 1 %: the number needed jumps past 300 — nearly the whole market. Rare problems hide from small samples.
- Switch to a visual check of the pack (finds only half): it acts as if half as many packs were falsified.
- Tick "show the falsified packs" and run single surveys: count how often a survey of 20 packs misses them all.`,
    mount(box, kit) {
      const Bi = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260, maxH: 400 });
      const [g1] = panels(box, 1, 300);
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Falsified packs on the market', min: 0.5, max: 30, step: 0.5, value: 5, unit: '%' },
        { id: 'n', label: 'Packs tested', min: 1, max: 150, step: 1, value: 20 },
        { id: 'se', type: 'select', label: 'Test', options: [['Laboratory HPLC (finds 99 %)', 0.99], ['Hand-held Raman (finds 90 %)', 0.9], ['Visual check of the pack (finds 50 %)', 0.5]], value: 0.9 },
        { id: 'show', type: 'check', label: 'Show the falsified packs', value: false },
        { type: 'buttons', items: [{ id: 'one', label: 'Run one survey', primary: true }, { id: 'many', label: 'Run 500 surveys' }] }
      ], (id) => {
        if (id === 'one') { surveySeed++; survey(true); }
        else if (id === 'many') many();
        else { if (id !== 'show') emp = null; survey(false); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mkt', 'This market'], ['th', 'Chance of finding at least one'], ['n95', 'Packs needed for 95 %'], ['last', 'This survey'], ['emp', '500 surveys']]);
      const pl = kit.plot(g1, { x: { label: 'packs tested', min: 0, max: 150 }, y: { label: 'chance of finding at least one (%)', min: 0, max: 100 }, legend: true }, 170);
      const NP = 360, COLS = 24;
      let surveySeed = 4, market = [], picked = [], found = 0, missed = 0, emp = null, reveal = 0;   // seed 4: a first survey that finds one and misses one
      const u = (() => { const r = Bi.rng(4242); return Array.from({ length: NP }, () => [r(), r()]); })();   // fixed draws: raising p adds falsified packs
      function survey(animate) {
        market = u.map(([a]) => a < V.p / 100);
        const r = Bi.rng(surveySeed * 6151 + 17), idx = Array.from({ length: NP }, (_, i) => i);
        for (let i = NP - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        picked = idx.slice(0, V.n).map(i => ({ i, det: market[i] && u[i][1] < V.se }));
        found = picked.filter(q => q.det).length; missed = picked.filter(q => market[q.i] && !q.det).length;
        reveal = animate ? 0 : picked.length;
        const pe = V.p / 100 * V.se, th = 1 - Math.pow(1 - pe, V.n), n95 = Math.ceil(Math.log(0.05) / Math.log(1 - pe));
        ro.set('mkt', market.filter(Boolean).length + ' of ' + NP + ' packs falsified');
        ro.set('th', (100 * th).toFixed(1) + ' % (p·Se = ' + (100 * pe).toFixed(2) + ' %)');
        ro.set('n95', n95 + (n95 > NP ? ' — more than the whole market' : ''));
        ro.set('last', found ? 'found ' + found + ' falsified pack' + (found > 1 ? 's' : '') + (missed ? ', missed ' + missed : '') : missed ? 'found none — the test missed ' + missed : 'found none');
        ro.set('emp', emp ? emp.k + ' of 500 found at least one (' + (emp.k / 5).toFixed(1) + ' %)' : 'not run yet');
        const curve = Array.from({ length: 151 }, (_, n) => [n, 100 * (1 - Math.pow(1 - pe, n))]);
        const marks = [{ x: V.n, y: 100 * th, label: V.n + ' packs: ' + (100 * th).toFixed(0) + ' %' }];
        if (emp) marks.push({ x: V.n, y: emp.k / 5, color: kit.colors().warn });
        pl.set({ series: [{ pts: curve, label: '1 − (1 − p·Se)ⁿ' }].concat(emp ? [{ pts: [[V.n, emp.k / 5]], label: 'observed in 500 surveys', line: false, dots: 5 }] : []),
          marks, hlines: [{ y: 95, label: '95 %' }], vlines: n95 <= 150 ? [{ x: n95, label: 'n = ' + n95 }] : [] });
        loop.once();
      }
      function many() {
        const r = Bi.rng(surveySeed * 31 + 999), p = V.p / 100;
        let k = 0;
        for (let s = 0; s < 500; s++) {
          let hit = false;
          for (let t = 0; t < V.n && !hit; t++) if (r() < p && r() < V.se) hit = true;
          if (hit) k++;
        }
        emp = { k };
        survey(false);
      }
      const loop = kit.loop((dt) => {
        reveal = Math.min(picked.length, reveal + dt * Math.max(20, picked.length / 1.5));
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const rows = NP / COLS, gw = W - 24, gh = Hh - 50, cell = Math.min(gw / COLS, gh / rows), x0 = (W - cell * COLS) / 2, y0 = 26;
        const pickedSet = new Map(); picked.slice(0, Math.floor(reveal)).forEach(q => pickedSet.set(q.i, q));
        kit.label(c, 'The market: ' + NP + ' packs', x0, 12, { size: 12, weight: 700, color: C.text });
        for (let i = 0; i < NP; i++) {
          const x = x0 + (i % COLS) * cell, y = y0 + Math.floor(i / COLS) * cell, q = pickedSet.get(i), fals = market[i];
          let fill = C.grid;
          if (q) fill = q.det ? C.bad : fals ? C.warn : C.ok;
          c.globalAlpha = q ? 0.85 : 0.6; c.fillStyle = fill; rrect(c, x + 2, y + 2, cell - 4, cell - 4, 3); c.fill(); c.globalAlpha = 1;
          if (q) { c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke(); }
          else if (fals && V.show) { c.strokeStyle = C.bad; c.lineWidth = 2; c.stroke(); }
          if (q && q.det) kit.label(c, '!', x + cell / 2, y + cell / 2, { align: 'center', size: Math.min(13, cell * 0.6), weight: 800, color: '#ffffff' });
        }
        const ly = Hh - 8;
        const leg = [[C.ok, 'tested: genuine'], [C.bad, 'tested: falsified, caught'], [C.warn, 'tested: falsified, missed by the test']];
        let lx = x0;
        for (const [col, t] of leg) { if (lx + t.length * 6 > W - 10) break; c.fillStyle = col; c.fillRect(lx, ly - 5, 10, 10); kit.label(c, t, lx + 14, ly, { size: 11, color: C.muted }); lx += 30 + t.length * 6; }
      }, box.stage);
      survey(false);
      loop.start();
    }
  });

})();
