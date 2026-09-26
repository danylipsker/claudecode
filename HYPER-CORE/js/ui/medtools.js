/* HYPER-CORE · ui/medtools.js
 *
 * The tools of Hyper Medicine:
 *   #/tools/body               a body map: organs drawn front-on, coloured by system; click one
 *                              for what it does, a few numbers, and the pages about it
 *   #/tools/clinical/<calc>    medical calculators: body size and energy, kidney function,
 *                              heart, blood chemistry and lab units, what a test result means
 *                              (1 000 people), treatment benefit (100 people), fluids and drips
 *
 * The formulas are HYPER-CORE/js/medicine.js (tested by tools/test-medicine.js). For learning:
 * the page says so, and never offers a diagnosis or a dose for a real person.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, M = () => H.med;
  const f1 = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';

  /* ================================================================ body map */
  const SYS = {
    nervous: ['Nervous system', '#e2b93b'], endocrine: ['Endocrine system', '#9b7fd6'], respiratory: ['Respiratory system', '#ef8fa6'],
    cardiovascular: ['Heart and circulation', '#d9384e'], digestive: ['Digestive system', '#c98a4f'], urinary: ['Urinary system', '#d0733a'],
    immune: ['Immune and lymphatic system', '#4fa89a'], skin: ['Skin', '#e3bfa0']
  };
  // [id, name, system, svg shape, facts, [concept ids]]
  const ORGANS = [
    ['skin', 'Skin', 'skin', null, 'The body\'s largest organ, about 1.5–2 m² in an adult: a waterproof, germ-proof barrier that also senses touch, pain and temperature, sweats to cool the body, and makes vitamin D in sunlight.', ['thermoregulation', 'burns', 'tissue-types']],
    ['brain', 'Brain', 'nervous', '<path d="M129 52C129 31 147 22 161 23C179 22 194 33 192 53C191 64 184 71 171 72L148 72C135 71 129 64 129 52Z"/><path class="fold" d="M146 30c4 6 4 12-2 17M160 26c-3 8 3 14 0 22M175 30c-5 6-4 13 3 18M140 58c8-4 16-3 22 3M166 60c7-5 15-4 20 1"/>',
      'About 1.3–1.4 kg and some 86 billion neurons. It uses roughly a fifth of the body\'s energy at rest, and runs movement, sensation, memory, emotion and thought.', ['brain-regions', 'neurons', 'stroke', 'dementia']],
    ['spinal', 'Spinal cord', 'nervous', '<path d="M158 96h4v300h-4z"/>', 'A cable about 45 cm long inside the spine, carrying signals between the brain and the body through 31 pairs of spinal nerves, and handling fast reflexes on its own.', ['nervous-system-organization', 'action-potential', 'pain']],
    ['thyroid', 'Thyroid', 'endocrine', '<path d="M150 111C145 108 145 121 152 122C156 123 158 119 160 117C162 119 164 123 168 122C175 121 175 108 170 111C166 115 162 115 160 114C158 115 154 115 150 111Z"/>',
      'A butterfly-shaped gland of about 20 g in the neck. From iodine it makes the hormones T4 and T3, which set the pace of metabolism in almost every cell.', ['thyroid', 'hormone-feedback', 'endocrine-system']],
    ['trachea', 'Windpipe (trachea)', 'respiratory', '<path d="M156 100h8v58h-8z"/><path d="M160 156l-14 16h5l9-10 9 10h5z"/>', 'A tube about 10–12 cm long, held open by C-shaped rings of cartilage, that divides into the two main bronchi. Its lining traps dust and microbes and sweeps them upwards.', ['respiratory-system', 'choking']],
    ['lungR', 'Right lung', 'respiratory', '<path d="M152 150C140 146 118 156 112 184C106 214 106 244 110 262C122 270 140 268 150 260C154 230 155 190 152 150Z"/>',
      'The right lung has three lobes, the left two (to make room for the heart). Together they hold some 300–500 million alveoli with a surface of roughly 70 m², where oxygen enters the blood.', ['gas-exchange', 'ventilation', 'asthma', 'copd']],
    ['lungL', 'Left lung', 'respiratory', '<path d="M168 150C180 146 202 156 208 184C214 214 214 244 210 262C198 270 184 268 176 262C179 250 182 241 186 233C177 229 171 221 170 211C168 191 168 171 168 150Z"/>',
      'Slightly smaller than the right, with a notch for the heart. At rest you breathe 12–20 times a minute, about half a litre each time.', ['respiratory-system', 'lung-function-tests', 'pneumonia']],
    ['vessels', 'Aorta and vena cava', 'cardiovascular', '<path class="vessel art" d="M167 204C166 186 181 184 179 200L171 250L169 388"/><path class="vessel vein" d="M153 204L153 388"/>',
      'The aorta, about 2.5 cm across, carries oxygen-rich blood from the heart down the body; the venae cavae bring used blood back. Together the vessels would stretch roughly 100 000 km.', ['blood-vessels', 'hemodynamics', 'blood-pressure']],
    ['heart', 'Heart', 'cardiovascular', '<path d="M160 202C152 194 138 198 140 214C142 230 160 242 170 250C178 242 192 230 192 214C192 198 178 196 170 206C167 202 164 201 160 202Z"/>',
      'A muscular pump of about 300 g that beats around 100 000 times a day and moves about 5 litres of blood a minute at rest — much more in exercise. Its own electrical system sets the beat.', ['heart-anatomy', 'cardiac-cycle', 'ecg', 'heart-attack']],
    ['liver', 'Liver', 'digestive', '<path d="M104 262C120 252 170 254 188 262C194 268 188 276 176 280C160 286 150 300 132 306C118 310 106 300 102 286C100 276 100 268 104 262Z"/>',
      'The largest internal organ, about 1.5 kg. It stores glucose as glycogen, makes proteins such as albumin and clotting factors, produces bile, breaks down alcohol and medicines, and can regrow after injury.', ['liver-function', 'liver-disease', 'pharmacokinetics']],
    ['gallbladder', 'Gallbladder', 'digestive', '<ellipse cx="146" cy="304" rx="7" ry="10" transform="rotate(-20 146 304)"/>', 'A small pouch under the liver that stores and concentrates bile — about 30–50 mL — and squeezes it into the gut after a fatty meal.', ['digestion-absorption', 'digestive-system']],
    ['pancreas', 'Pancreas', 'endocrine', '<path d="M150 316C164 308 188 306 206 303C211 305 211 312 204 314C188 318 172 322 160 324C152 326 146 320 150 316Z"/>',
      'Two organs in one: most of it makes digestive enzymes and bicarbonate, while scattered islets — about 1–2 % of its mass — make insulin and glucagon to control blood glucose.', ['glucose-regulation', 'type1-diabetes', 'type2-diabetes', 'digestion-absorption']],
    ['stomach', 'Stomach', 'digestive', '<path d="M176 262C176 256 184 252 192 256C212 264 218 284 210 302C202 318 182 320 170 312C164 306 170 298 180 298C192 298 198 288 192 278C186 270 176 272 176 262Z"/>',
      'A muscular bag that holds about a litre or more, churns food with acid (pH 1.5–3.5) and enzymes, and releases it bit by bit into the small intestine.', ['digestion-absorption', 'reflux-ulcers', 'digestive-system']],
    ['spleen', 'Spleen', 'immune', '<path d="M214 262C222 264 226 276 222 290C218 296 212 294 210 286C208 276 208 266 214 262Z"/>',
      'A fist-sized organ that filters the blood, removes worn-out red cells (they live about 120 days) and hosts immune cells that react to microbes in the blood.', ['blood-composition', 'innate-immunity', 'adaptive-immunity']],
    ['kidneyR', 'Right kidney', 'urinary', '<path d="M116 314C106 318 104 340 110 352C116 360 126 356 126 346C124 340 128 334 130 328C132 320 124 312 116 314Z"/>',
      'Each kidney weighs about 150 g and holds about a million nephrons. Together they filter some 180 litres of plasma a day and return all but 1–2 litres, setting the body\'s water, salts and acidity.', ['kidney-anatomy', 'glomerular-filtration', 'chronic-kidney-disease']],
    ['kidneyL', 'Left kidney', 'urinary', '<path d="M204 306C214 310 216 332 210 344C204 352 194 348 194 338C196 332 192 326 190 320C188 312 196 304 204 306Z"/>',
      'The left kidney sits a little higher than the right. The kidneys also make renin (blood pressure), erythropoietin (red cells) and the active form of vitamin D.', ['kidney-tests', 'tubular-function', 'kidney-stones']],
    ['adrenals', 'Adrenal glands', 'endocrine', '<path d="M111 315L120 304L129 314ZM191 307L200 296L209 306Z"/>', 'Small caps on the kidneys: the outer layer makes cortisol and aldosterone, the core makes adrenaline in response to stress.', ['adrenal-stress', 'endocrine-system']],
    ['bowel', 'Large intestine', 'digestive', '<path class="tube" d="M124 398L119 350C119 336 127 331 141 331L183 331C197 331 203 337 203 351L203 394C203 402 196 406 187 405C177 404 170 409 165 414"/>',
      'About 1.5 m long. It absorbs water and salts from what is left of food, and is home to the gut microbiome — trillions of bacteria, roughly as many cells as the body\'s own.', ['gut-microbiome', 'ibd', 'common-cancers']],
    ['intestine', 'Small intestine', 'digestive', '<path d="M134 344C150 338 176 338 190 346C196 362 194 384 186 396C170 402 150 402 138 396C130 382 128 358 134 344Z"/><path class="fold" d="M140 352c10 5 30 5 44 0M138 366c14 6 34 6 48 0M140 380c12 5 30 5 44 0"/>',
      'Several metres long (about 3–5 m in life). Here food is finally broken down and absorbed through villi that give it a surface of roughly 30 m².', ['digestion-absorption', 'celiac-disease', 'macronutrients']],
    ['bladder', 'Bladder', 'urinary', '<path d="M146 404C146 394 174 394 174 404C174 416 166 422 160 422C154 422 146 416 146 404Z"/>',
      'A stretchy muscular bag that stores urine. It usually holds 400–600 mL; the urge to pass urine starts at about 150–300 mL.', ['uti', 'kidney-anatomy']]
  ];
  const BODY = '<ellipse cx="160" cy="62" rx="36" ry="44"/><path d="M146 98h28v32h-28z"/>' +
    '<path d="M112 126C132 118 188 118 208 126L230 138C240 146 242 160 240 184L230 300C228 330 224 360 222 392C220 404 214 412 206 414L114 414C106 412 100 404 98 392C96 360 92 330 90 300L80 184C78 160 80 146 90 138Z"/>' +
    '<path class="limb" d="M92 146C80 200 72 260 70 300C68 330 66 360 64 392"/><path class="limb" d="M228 146C240 200 248 260 250 300C252 330 254 360 256 392"/>' +
    '<circle cx="64" cy="404" r="13"/><circle cx="256" cy="404" r="13"/>' +
    '<path class="limb leg" d="M134 408C132 470 130 540 130 608"/><path class="limb leg" d="M186 408C188 470 190 540 190 608"/>' +
    '<ellipse cx="124" cy="628" rx="21" ry="9"/><ellipse cx="196" cy="628" rx="21" ry="9"/>';

  function bodyMap(el) {
    const order = ['spinal', 'vessels', 'trachea', 'lungR', 'lungL', 'heart', 'thyroid', 'kidneyR', 'kidneyL', 'adrenals', 'pancreas', 'liver', 'gallbladder', 'stomach', 'spleen', 'intestine', 'bowel', 'bladder', 'brain'];
    const byId = Object.fromEntries(ORGANS.map(o => [o[0], o]));
    el.innerHTML = '<div class="toolbar"><span class="small muted">Colour by system:</span>' +
      '<button class="chip on" data-sys="">all</button>' + Object.entries(SYS).map(([k, [t, c]]) => '<button class="chip" data-sys="' + k + '"><i class="sdot" style="background:' + c + '"></i>' + esc(t) + '</button>').join('') + '</div>' +
      '<div class="bodygrid"><div class="bodyfig boxy"><svg viewBox="0 0 320 650" role="img" aria-label="The organs of the body, front view">' +
      '<g class="skin" data-o="skin" style="--c:' + SYS.skin[1] + '">' + BODY + '</g>' +
      order.map(id => { const o = byId[id]; return '<g class="organ" data-o="' + id + '" data-s="' + o[2] + '" style="--c:' + SYS[o[2]][1] + '" tabindex="0" role="button" aria-label="' + esc(o[1]) + '"><title>' + esc(o[1]) + '</title>' + o[3] + '</g>'; }).join('') +
      '</svg><div class="small faint" style="text-align:center">Front view: the body\'s right is on your left.</div></div><div class="bodycard boxy"></div></div>';
    const card = ui.$('.bodycard', el), svg = ui.$('svg', el);
    const show = id => {
      const o = byId[id] || byId.heart;
      svg.querySelectorAll('[data-o]').forEach(g => g.classList.toggle('sel', g.dataset.o === o[0]));
      const links = o[5].filter(c => H.nodes.has(c) || (H.catalogs.medicine && H.catalogs.medicine.has(c)))
        .map(c => '<a class="chip" href="#/c/' + c + '">' + esc(H.titleOf(c)) + '</a>').join(' ');
      card.innerHTML = '<div class="small muted"><i class="sdot" style="background:' + SYS[o[2]][1] + '"></i>' + esc(SYS[o[2]][0]) + '</div><h3 style="margin:4px 0 8px;font:650 24px var(--font-display)">' + esc(o[1]) + '</h3>' +
        '<p>' + esc(o[4]) + '</p>' + (links ? '<div class="small muted mt">Read more</div><div class="row" style="flex-wrap:wrap;gap:6px;margin-top:6px">' + links + '</div>' : '');
    };
    svg.addEventListener('click', e => { const g = e.target.closest('[data-o]'); if (g) show(g.dataset.o); });
    svg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { const g = e.target.closest('[data-o]'); if (g) { e.preventDefault(); show(g.dataset.o); } } });
    el.querySelectorAll('[data-sys]').forEach(b => b.onclick = () => {
      el.querySelectorAll('[data-sys]').forEach(x => x.classList.toggle('on', x === b));
      const s = b.dataset.sys;
      svg.querySelectorAll('.organ').forEach(g => g.classList.toggle('dim', !!s && g.dataset.s !== s));
      if (s) { const first = order.map(id => byId[id]).find(o => o[2] === s); if (first) show(first[0]); }
    });
    show('heart');
  }

  /* ================================================================ calculators */
  const TABS = [['body', 'Body size & energy'], ['kidney', 'Kidney function'], ['heart', 'Heart & blood pressure'], ['blood', 'Blood chemistry & lab units'],
    ['test', 'What a test result means'], ['risk', 'Treatment benefit'], ['fluids', 'Fluids & drips']];
  // fields: [id, label, value, kind, extra]; kind: 'n' (fixed unit in extra), 'q' (a quantity: extra = [q, unit]), 'sel' (extra = options), 'sep'
  function form(el, fields, onChange) {
    el.innerHTML = fields.map(([id, label, value, kind, extra]) => {
      if (kind === 'sep') return '<div class="msep">' + esc(label) + '</div>';
      if (kind === 'sel') return '<label class="mfield"><span>' + esc(label) + '</span><select class="inp" data-f="' + id + '">' + extra.map(([v, t]) => '<option value="' + esc(v) + '"' + (v === value ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
      const q = kind === 'q' ? H.units.Q[extra[0]] : null;
      const unit = kind === 'q' ? '<select class="munit" data-u="' + id + '">' + q.units.map(u => '<option' + (u[0] === extra[1] ? ' selected' : '') + '>' + esc(u[0]) + '</option>').join('') + '</select>' : (extra ? '<i>' + esc(extra) + '</i>' : '');
      return '<label class="mfield"><span>' + esc(label) + '</span><span class="minp"><input class="inp" inputmode="decimal" data-f="' + id + '" value="' + esc(String(value)) + '">' + unit + '</span></label>';
    }).join('');
    const kinds = Object.fromEntries(fields.map(f => [f[0], f]));
    const read = () => {
      const v = {};
      el.querySelectorAll('[data-f]').forEach(inp => {
        const id = inp.dataset.f, fdef = kinds[id];
        if (fdef[3] === 'sel') { v[id] = inp.value; return; }
        let x = NaN;
        try { x = H.expr.evaluate(H.expr.parse(U.cleanNum(inp.value) || 'nan'), {}); } catch (e) { x = NaN; }
        inp.classList.toggle('bad', !Number.isFinite(x));
        if (fdef[3] === 'q') {
          const u = el.querySelector('[data-u="' + id + '"]').value;
          x = H.units.toSI(x, fdef[4][0], u);                         // into the quantity's first (formula) unit
          x = H.units.fromSI(x, fdef[4][0], H.units.Q[fdef[4][0]].units[0][0]);
        }
        v[id] = x;
      });
      return v;
    };
    // changing a unit converts the number shown, so the value stays the same
    el.querySelectorAll('[data-u]').forEach(sel => {
      let prev = sel.value;
      sel.addEventListener('change', () => {
        const id = sel.dataset.u, q = kinds[id][4][0], inp = el.querySelector('[data-f="' + id + '"]');
        const x = parseFloat(U.cleanNum(inp.value));
        if (Number.isFinite(x)) inp.value = String(Number(H.units.convert(x, q, prev, sel.value).toPrecision(4)));
        prev = sel.value;
        onChange(read());
      });
    });
    el.addEventListener('input', () => onChange(read()));
    el.addEventListener('change', e => { if (!e.target.dataset.u) onChange(read()); });
    return read;
  }
  const stat = (label, value, sub, cls) => '<div class="mstat' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span><b>' + value + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
  function layout(el, intro) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') + '<div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mextra"></div></div></div>';
    return { form: ui.$('.mform', el), stats: ui.$('.mstats', el), extra: ui.$('.mextra', el) };
  }
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';

  function body(el) {
    const L = layout(el, 'Body mass index compares weight with height; body surface area is used to scale some doses and measurements; the Mifflin–St Jeor equation estimates the energy your body burns at rest. All three are population averages, not verdicts about one person.' + link('energy-balance', 'Energy balance'));
    const read = form(L.form, [['w', 'Weight', 70, 'q', ['mass', 'kg']], ['h', 'Height', 175, 'q', ['length', 'cm']], ['age', 'Age', 35, 'n', 'years'],
      ['sex', 'Sex', 'f', 'sel', [['f', 'female'], ['m', 'male']]], ['act', 'Activity', '1.55', 'sel', [['1.2', 'little or none'], ['1.375', 'light (1–3 days a week)'], ['1.55', 'moderate (3–5 days)'], ['1.725', 'hard (6–7 days)'], ['1.9', 'very hard or physical job']]]], v => calc(v));
    function calc(v) {
      const kg = v.w, cm = v.h / 1 * 100, fem = v.sex === 'f';               // height arrives in metres (the SI unit of length)
      const b = M().bmi(kg, cm / 100);
      const cat = b < 18.5 ? ['underweight', 'bad'] : b < 25 ? ['healthy range', 'good'] : b < 30 ? ['overweight', ''] : ['obesity', 'bad'];
      const rest = M().bmr(kg, cm, v.age, fem);
      L.stats.innerHTML = stat('Body mass index', f1(b), cat[0] + ' (WHO adult categories)', 'big') +
        stat('Body surface area', f1(M().bsa(kg, cm), 2) + ' m²', 'Mosteller; DuBois ' + f1(M().bsa(kg, cm, 'dubois'), 2) + ' m²') +
        stat('Ideal body weight', f1(M().ibw(cm, fem)) + ' kg', 'Devine formula, used for some drug doses') +
        stat('Energy at rest', Math.round(rest) + ' kcal/day', 'Mifflin–St Jeor') +
        stat('Daily energy use', Math.round(rest * +v.act) + ' kcal/day', 'rest × activity factor ' + v.act);
      L.extra.innerHTML = '<div class="boxy small muted">BMI does not tell fat from muscle and uses the same cut-offs for everyone; lower cut-offs are often used for people of Asian background, and waist size adds information about risk. Children use age- and sex-specific growth charts instead.</div>';
    }
    calc(read());
  }

  function kidney(el) {
    const L = layout(el, 'Creatinine is a waste product of muscle that the kidneys clear; the less they filter, the higher it rises. The CKD-EPI 2021 equation turns it into an estimated glomerular filtration rate (eGFR). Change the unit to match your laboratory (mg/dL in the US, µmol/L in most other countries).' + link('kidney-tests'));
    const read = form(L.form, [['scr', 'Serum creatinine', 1.0, 'q', ['creatinine', 'mg/dL']], ['age', 'Age', 60, 'n', 'years'], ['sex', 'Sex', 'm', 'sel', [['f', 'female'], ['m', 'male']]],
      ['s', 'For drug dosing (Cockcroft–Gault)', 0, 'sep'], ['w', 'Weight', 72, 'q', ['mass', 'kg']]], v => calc(v));
    function calc(v) {
      const e = M().egfr(v.scr, v.age, v.sex === 'f'), cg = M().cockcroftGault(v.age, v.w, v.scr, v.sex === 'f');
      const g = e >= 90 ? ['G1', 'normal or high', 'good'] : e >= 60 ? ['G2', 'mildly decreased', ''] : e >= 45 ? ['G3a', 'mildly to moderately decreased', ''] : e >= 30 ? ['G3b', 'moderately to severely decreased', 'bad'] : e >= 15 ? ['G4', 'severely decreased', 'bad'] : ['G5', 'kidney failure', 'bad'];
      L.stats.innerHTML = stat('eGFR (CKD-EPI 2021)', Math.round(e) + ' mL/min/1.73 m²', 'GFR category ' + g[0] + ': ' + g[1], 'big ' + g[2]) +
        stat('Creatinine clearance', Math.round(cg) + ' mL/min', 'Cockcroft–Gault, used in many drug labels') +
        stat('Creatinine', f1(v.scr, 2) + ' mg/dL', '= ' + Math.round(v.scr * 88.42) + ' µmol/L');
      L.extra.innerHTML = '<div class="boxy small muted">Chronic kidney disease is diagnosed only when a low eGFR or kidney damage (such as albumin in the urine) lasts more than three months. eGFR is less reliable at extremes of muscle mass, in pregnancy, in acute illness and in children.</div>';
    }
    calc(read());
  }

  function heart(el) {
    const L = layout(el, 'Blood pressure is written as systolic over diastolic, in millimetres of mercury. The mean arterial pressure is what perfuses the organs. Guidelines draw the line for high blood pressure differently: the American (2017) and European (2018/2024) systems are both shown. The QT interval of the ECG is corrected for heart rate, because it shortens as the heart speeds up.' + link('blood-pressure'));
    const read = form(L.form, [['sbp', 'Systolic pressure', 128, 'n', 'mmHg'], ['dbp', 'Diastolic pressure', 82, 'n', 'mmHg'], ['s1', 'ECG', 0, 'sep'], ['hr', 'Heart rate', 75, 'n', 'beats/min'], ['qt', 'QT interval', 390, 'n', 'ms'],
      ['s2', 'Exercise', 0, 'sep'], ['age', 'Age', 45, 'n', 'years'], ['rest', 'Resting heart rate', 65, 'n', 'beats/min']], v => calc(v));
    function calc(v) {
      const us = v.sbp >= 180 || v.dbp >= 120 ? ['hypertensive crisis range', 'bad'] : v.sbp >= 140 || v.dbp >= 90 ? ['stage 2 hypertension', 'bad'] : v.sbp >= 130 || v.dbp >= 80 ? ['stage 1 hypertension', ''] : v.sbp >= 120 ? ['elevated', ''] : ['normal', 'good'];
      const eu = v.sbp >= 180 || v.dbp >= 110 ? 'grade 3 hypertension' : v.sbp >= 160 || v.dbp >= 100 ? 'grade 2 hypertension' : v.sbp >= 140 || v.dbp >= 90 ? 'grade 1 hypertension' : v.sbp >= 130 || v.dbp >= 85 ? 'high normal' : v.sbp >= 120 || v.dbp >= 80 ? 'normal' : 'optimal';
      const mx = M().maxHR(v.age);
      const qb = M().qtc(v.qt, v.hr), qf = M().qtc(v.qt, v.hr, 'fridericia');
      L.stats.innerHTML = stat('Blood pressure', Math.round(v.sbp) + '/' + Math.round(v.dbp) + ' mmHg', 'US 2017: ' + us[0] + ' · Europe (2018 grades): ' + eu, 'big ' + us[1]) +
        stat('Mean arterial pressure', Math.round(M().map(v.sbp, v.dbp)) + ' mmHg', 'diastolic + a third of the pulse pressure') +
        stat('Pulse pressure', Math.round(v.sbp - v.dbp) + ' mmHg', 'systolic − diastolic') +
        stat('QTc (Bazett)', Math.round(qb) + ' ms', 'Fridericia ' + Math.round(qf) + ' ms; often considered long above about 450 (men) or 460–470 ms (women)', qb > 470 ? 'bad' : '') +
        stat('Maximum heart rate', Math.round(mx) + ' /min', 'Tanaka: 208 − 0.7 × age (an average; individuals vary)') +
        stat('Moderate exercise zone', Math.round(M().karvonen(v.rest, mx, 0.5)) + '–' + Math.round(M().karvonen(v.rest, mx, 0.7)) + ' /min', '50–70 % of heart-rate reserve (Karvonen)');
      L.extra.innerHTML = '<div class="boxy small muted">One reading is not a diagnosis: blood pressure varies from minute to minute, and high blood pressure is diagnosed from repeated measurements, ideally including readings at home. A very high reading with chest pain, breathlessness, weakness or confusion is an emergency.</div>';
    }
    calc(read());
  }

  function blood(el) {
    const L = layout(el, 'The anion gap helps sort out the cause of an acid build-up in the blood; calcium is corrected for a low albumin because much of it rides on albumin. Laboratories report many tests in either conventional (mg/dL) or SI (mmol/L) units — the converter translates between them.' + link('lab-tests'));
    const analytes = ['glucose', 'creatinine', 'cholesterol', 'triglycerides', 'urea', 'calcium', 'bilirubin', 'hemoglobin', 'albumin'];
    const read = form(L.form, [['na', 'Sodium', 140, 'n', 'mmol/L'], ['cl', 'Chloride', 104, 'n', 'mmol/L'], ['hco3', 'Bicarbonate', 24, 'n', 'mmol/L'],
      ['s1', 'Calcium', 0, 'sep'], ['ca', 'Total calcium', 8.4, 'q', ['calcium', 'mg/dL']], ['alb', 'Albumin', 3.0, 'q', ['albumin', 'g/dL']],
      ['s2', 'Unit converter', 0, 'sep'], ['an', 'Test', 'glucose', 'sel', analytes.map(a => [a, H.units.Q[a].name])], ['x', 'Value', 100, 'n', ''], ['from', 'From', '1', 'sel', [['0', 'first unit'], ['1', 'second unit']]]], v => calc(v));
    function calc(v) {
      const ag = M().anionGap(v.na, v.cl, v.hco3);
      const caMg = H.units.convert(v.ca, 'calcium', 'mmol/L', 'mg/dL'), cc = M().correctedCalcium(caMg, v.alb);
      const Q = H.units.Q[v.an], a = Q.units[+v.from] || Q.units[0], b = Q.units.filter(u => u !== a);
      L.stats.innerHTML = stat('Anion gap', f1(ag, 0) + ' mmol/L', 'Na − (Cl + HCO₃); commonly about 8–12, depending on the laboratory', ag > 12 ? 'bad' : 'big') +
        stat('Corrected calcium', f1(cc, 1) + ' mg/dL', '= ' + f1(H.units.convert(cc, 'calcium', 'mg/dL', 'mmol/L'), 2) + ' mmol/L; Ca + 0.8 × (4 − albumin)') +
        stat(Q.name + ': ' + f1(v.x, 2) + ' ' + a[0], b.map(u => f1(H.units.convert(v.x, v.an, a[0], u[0]), 2) + ' ' + u[0]).join(' · '), 'conversion factor from the molar mass', 'big');
      L.extra.innerHTML = '<div class="boxy small muted">Reference ranges differ between laboratories, methods, ages and sexes: always read a result against the range printed on the report. For the "Value" field choose which of the test\'s units you are typing in.</div>';
    }
    calc(read());
  }

  // an icon array: n dots coloured by groups [[count, colour, label], ...]
  function iconArray(canvas, groups, cols) {
    const n = groups.reduce((s, g) => s + g[0], 0), W = canvas.clientWidth || 520, rows = Math.ceil(n / cols), cell = Math.min(16, (W - 8) / cols);
    const dpr = window.devicePixelRatio || 1, Hh = rows * cell + 8;
    canvas.width = W * dpr; canvas.height = Hh * dpr; canvas.style.height = Hh + 'px';
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, Hh);
    let k = 0;
    for (const [count, col] of groups) for (let j = 0; j < Math.round(count); j++, k++) {
      const x = 4 + (k % cols) * cell + cell / 2, y = 4 + Math.floor(k / cols) * cell + cell / 2;
      c.beginPath(); c.arc(x, y, cell * 0.36, 0, Math.PI * 2); c.fillStyle = col; c.fill();
    }
  }
  const legend = groups => '<div class="row small" style="gap:12px;flex-wrap:wrap;margin-top:6px">' + groups.map(([n, col, t]) => '<span><i class="sdot" style="background:' + col + '"></i>' + Math.round(n) + ' ' + esc(t) + '</span>').join('') + '</div>';

  function test(el) {
    const L = layout(el, 'Whether a positive result means disease depends on how common the disease is among the people tested, not only on how good the test is. The picture shows 1 000 people tested: when a disease is rare, most positives are false alarms.' + link('bayes-diagnosis'));
    const read = form(L.form, [['prev', 'How common the disease is (prevalence)', 1, 'n', '%'], ['sens', 'Sensitivity (sick people who test positive)', 90, 'n', '%'], ['spec', 'Specificity (healthy people who test negative)', 91, 'n', '%']], v => calc(v));
    function calc(v) {
      const b = M().bayes({ prevalence: v.prev / 100, sensitivity: v.sens / 100, specificity: v.spec / 100, N: 1000 });
      const col = H.ui.colors();
      const g = [[b.counts.tp, col.bad, 'sick, test positive'], [b.counts.fn, col.warn, 'sick, missed (false negative)'], [b.counts.fp, 'hsl(215 70% 60%)', 'healthy, false alarm (false positive)'], [b.counts.tn, col.dark ? '#3a4262' : '#d5d9ea', 'healthy, test negative']];
      L.stats.innerHTML = stat('If the test is positive', U.pct(b.ppv, 1), 'chance of really having the disease (positive predictive value)', 'big') +
        stat('If the test is negative', U.pct(b.npv, 2), 'chance of really being free of it (negative predictive value)', 'good') +
        stat('Positive tests', Math.round(b.counts.tp + b.counts.fp) + ' of 1 000', Math.round(b.counts.tp) + ' true, ' + Math.round(b.counts.fp) + ' false') +
        stat('Likelihood ratios', '+ ' + f1(b.lrPos, 1) + ' / − ' + f1(b.lrNeg, 2), 'how much a result multiplies the odds');
      L.extra.innerHTML = '<div class="boxy"><canvas class="iconarr" style="width:100%"></canvas>' + legend(g) + '</div>';
      iconArray(ui.$('.iconarr', L.extra), g, 50);
    }
    calc(read());
  }

  function risk(el) {
    const L = layout(el, 'A treatment that "cuts the risk by 25 %" may prevent one event in forty people treated — or one in four hundred. The absolute numbers depend on how likely the event was to begin with. Each picture shows 100 people.' + link('risk-communication'));
    const read = form(L.form, [['cer', 'Risk without treatment', 10, 'n', '% over the study period'], ['eer', 'Risk with treatment', 7.5, 'n', '%']], v => calc(v));
    function calc(v) {
      const r = M().risk({ cer: v.cer / 100, eer: v.eer / 100 }), col = H.ui.colors();
      L.stats.innerHTML = stat('Relative risk reduction', U.pct(r.rrr, 0), 'the headline number', '') +
        stat('Absolute risk reduction', U.pct(r.arr, 1), 'per person treated', 'big') +
        stat('Number needed to treat', Number.isFinite(r.nnt) ? Math.ceil(r.nnt) : '—', 'people treated for one to benefit', 'good') +
        stat('Relative risk', f1(r.rr, 2), 'odds ratio ' + f1(r.or, 2));
      const people = (p, colr) => [[p * 100, colr, 'have the event'], [100 - p * 100, col.dark ? '#3a4262' : '#d5d9ea', 'do not']];
      L.extra.innerHTML = '<div class="cols2" style="margin:0"><div class="boxy"><b class="small">Without treatment</b><canvas class="ia1" style="width:100%"></canvas>' + legend(people(v.cer / 100, col.bad)) + '</div>' +
        '<div class="boxy"><b class="small">With treatment</b><canvas class="ia2" style="width:100%"></canvas>' + legend(people(v.eer / 100, col.warn)) + '</div></div>';
      iconArray(ui.$('.ia1', L.extra), people(v.cer / 100, col.bad), 10);
      iconArray(ui.$('.ia2', L.extra), people(v.eer / 100, col.warn), 10);
    }
    calc(read());
  }

  function fluids(el) {
    const L = layout(el, 'Standard teaching formulas for fluids: the Holliday–Segar "4-2-1" rule for maintenance, the drip rate of a gravity infusion, and the Parkland formula for the first day after a major burn. Real prescriptions are individual and adjusted by clinicians at the bedside.' + link('body-fluids'));
    const read = form(L.form, [['w', 'Weight', 70, 'q', ['mass', 'kg']], ['s1', 'A gravity drip', 0, 'sep'], ['vol', 'Volume to give', 1000, 'n', 'mL'], ['hours', 'Over', 8, 'n', 'hours'],
      ['df', 'Giving set', '20', 'sel', [['10', '10 drops/mL (blood set)'], ['15', '15 drops/mL'], ['20', '20 drops/mL (standard)'], ['60', '60 drops/mL (micro-drip)']]],
      ['s2', 'Burns (adults)', 0, 'sep'], ['tbsa', 'Burned area', 30, 'n', '% of body surface']], v => calc(v));
    function calc(v) {
      const m = M().maintenanceFluids(v.w), dr = M().dripRate(v.vol, v.hours * 60, +v.df), pk = M().parkland(v.w, v.tbsa);
      L.stats.innerHTML = stat('Maintenance fluid', Math.round(m) + ' mL/h', '≈ ' + Math.round(m * 24) + ' mL a day (4-2-1 rule)', 'big') +
        stat('Drip rate', Math.round(dr) + ' drops/min', f1(v.vol / v.hours, 0) + ' mL/h') +
        stat('Parkland, first 24 h', Math.round(pk) + ' mL', 'half (' + Math.round(pk / 2) + ' mL) in the first 8 hours from the burn');
      L.extra.innerHTML = '';
    }
    calc(read());
  }

  function clinical(el, sub) {
    const tab = TABS.some(t => t[0] === sub) ? sub : 'body';
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/clinical/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav>' +
      '<div class="mbody"></div><p class="small faint mt">For learning only: these are the standard published formulas, but they cannot diagnose, and they are not a substitute for a clinician who knows the patient. In an emergency, call your local emergency number.</p>';
    ({ body, kidney, heart, blood, test, risk, fluids })[tab](ui.$('.mbody', el));
  }

  H.medTools = { bodyMap, clinical, ORGANS, SYS };
})();
