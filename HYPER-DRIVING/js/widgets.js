/* Hyper Driving · widgets.js — interactive diagrams a lesson can place with
 * [[widget:name a=1 b=2]] or through a figure of kind "widget".
 *
 *   D.widgets.register(name, { mount(el, params) { … return { destroy() } } })
 *
 * Widgets take their labels from the interface language and their legal
 * numbers from the facts, so a law change reaches them too.
 */
(function (D) {
  'use strict';
  const { h, clamp } = D.util;
  const W = D.widgets = { reg: {} };
  W.register = (name, def) => { W.reg[name] = def; };
  W.has = (name) => !!W.reg[name];
  W.mount = (name, el, params) => {
    const def = W.reg[name];
    if (!def) throw new Error('no widget ' + name);
    el.classList.add('w-' + name);
    return def.mount(el, params || {});
  };

  const L = (he, en) => (D.lang() === 'he' ? he : en);
  const num = (x, d) => D.fmtNum(x, { maximumFractionDigits: d == null ? 0 : d });
  const factNum = (id, dflt) => { const f = D.fact(id); const v = f ? D.content.factValue(f) : null; return typeof v === 'number' ? v : dflt; };

  // a labelled range input
  function slider(label, min, max, step, value, fmt, onInput) {
    const out = h('output', { class: 'w-val' }, fmt(value));
    const inp = h('input', { type: 'range', min, max, step, value });
    inp.addEventListener('input', () => { out.textContent = fmt(+inp.value); onInput(+inp.value); });
    return { el: h('label', { class: 'w-slider' }, h('span', { class: 'w-lab' }, label), inp, out), input: inp };
  }
  function seg(options, value, onPick) {
    const wrap = h('div', { class: 'seg', role: 'radiogroup' });
    options.forEach(([v, lab]) => {
      const b = h('button', { type: 'button', class: 'seg-btn' + (v === value ? ' on' : ''), role: 'radio', 'aria-checked': v === value ? 'true' : 'false' }, lab);
      b.addEventListener('click', () => { wrap.querySelectorAll('.seg-btn').forEach((x) => { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); }); b.classList.add('on'); b.setAttribute('aria-checked', 'true'); onPick(v); });
      wrap.appendChild(b);
    });
    return wrap;
  }
  // an animation loop that stops when its element leaves the page
  function loop(el, step) {
    let last = performance.now(), id = 0, alive = true;
    const tick = (t) => {
      if (!alive) return;
      if (!el.isConnected) { alive = false; return; }
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      step(dt);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return { stop() { alive = false; cancelAnimationFrame(id); } };
  }

  // ------------------------------------------------------------------
  // stopping distance = reaction distance + braking distance
  //   reaction: v·t      braking: v² / (2·μ·g)   (g = 9.81 m/s²)
  // ------------------------------------------------------------------
  W.register('stopping-distance', {
    mount(el, p) {
      const SURF = [
        ['dry', L('יבש', 'Dry'), 0.8], ['wet', L('רטוב', 'Wet'), 0.5],
        ['gravel', L('חצץ', 'Gravel'), 0.4], ['ice', L('קרח', 'Ice'), 0.1]
      ];
      let v = p.speed || 90, t = p.reaction || 1, surf = p.surface || 'dry';
      const gap = factNum('following.recommended_gap', 2);
      const view = h('div', { class: 'w-stage' });
      const read = h('div', { class: 'w-readout' });
      const draw = () => {
        const mu = SURF.find((s) => s[0] === surf)[2];
        const ms = v / 3.6;
        const dr = ms * t, db = (ms * ms) / (2 * mu * 9.81), tot = dr + db;
        const follow = ms * gap;
        const maxD = Math.max(260, tot * 1.08, follow * 1.08);
        const X = (m) => 30 + (m / maxD) * 640;
        const tick = [];
        for (let m = 0; m <= maxD; m += maxD > 200 ? 50 : 20) tick.push(`<line x1="${X(m)}" y1="96" x2="${X(m)}" y2="102" class="ax"/><text x="${X(m)}" y="114" class="axl">${num(m)}</text>`);
        view.innerHTML = `<svg viewBox="0 0 700 150" class="w-svg" role="img" aria-label="${L('מרחק עצירה', 'Stopping distance')}">
          <rect x="30" y="40" width="640" height="46" rx="4" class="road"/>
          <line x1="30" y1="63" x2="670" y2="63" class="lane" stroke-dasharray="14 10"/>
          <rect x="${X(0)}" y="46" width="${X(dr) - X(0)}" height="34" class="bar-react"/>
          <rect x="${X(dr)}" y="46" width="${X(tot) - X(dr)}" height="34" class="bar-brake"/>
          <line x1="${X(follow)}" y1="30" x2="${X(follow)}" y2="92" class="follow"/>
          <text x="${X(follow)}" y="24" class="followl" text-anchor="middle">${L(`מרחק ${gap} שניות`, `${gap}-second gap`)}</text>
          <g transform="translate(${X(0) - 26} 49)"><rect width="24" height="28" rx="5" class="car"/></g>
          <line x1="${X(tot)}" y1="40" x2="${X(tot)}" y2="86" class="stop"/>
          <line x1="30" y1="96" x2="670" y2="96" class="ax"/>${tick.join('')}
          <text x="686" y="114" class="axl">${L('מ׳', 'm')}</text>
        </svg>`;
        read.innerHTML = `<div><span class="k react"></span>${L('מרחק תגובה', 'Reaction distance')}: <b>${num(dr)} ${L('מ׳', 'm')}</b></div>
          <div><span class="k brake"></span>${L('מרחק בלימה', 'Braking distance')}: <b>${num(db)} ${L('מ׳', 'm')}</b></div>
          <div><span class="k total"></span>${L('מרחק עצירה', 'Stopping distance')}: <b>${num(tot)} ${L('מ׳', 'm')}</b></div>
          <div class="w-note">${tot > follow ? L('מרחק העצירה ארוך מהמרווח שלפניכם — אם הרכב שמלפנים ייעצר בבת אחת, תידרש לו גם בלימה משלו; לכן המרווח נמדד בזמן, ובתנאים קשים מגדילים אותו.', 'The stopping distance is longer than the gap ahead — the car in front also needs its own braking distance, which is why the gap is measured in time and made longer in poor conditions.') : L('המרווח שלפניכם ארוך ממרחק העצירה.', 'Your gap is longer than your stopping distance.')}</div>`;
      };
      const s1 = slider(L('מהירות', 'Speed'), 10, 130, 5, v, (x) => `${x} ${L('קמ״ש', 'km/h')}`, (x) => { v = x; draw(); });
      const s2 = slider(L('זמן תגובה', 'Reaction time'), 0.5, 3, 0.1, t, (x) => `${num(x, 1)} ${L('שנ׳', 's')}`, (x) => { t = x; draw(); });
      const sg = seg(SURF.map((s) => [s[0], s[1]]), surf, (x) => { surf = x; draw(); });
      el.append(view, h('div', { class: 'w-controls' }, s1.el, s2.el, h('div', { class: 'w-row' }, h('span', { class: 'w-lab' }, L('פני הדרך', 'Road surface')), sg)), read);
      draw();
    }
  });

  // ------------------------------------------------------------------
  // speed and energy: a crash at speed v is like a fall from height v²/2g
  // ------------------------------------------------------------------
  W.register('speed-energy', {
    mount(el, p) {
      let v = p.speed || 50;
      const view = h('div', { class: 'w-stage' });
      const read = h('div', { class: 'w-readout' });
      const draw = () => {
        const ms = v / 3.6, hgt = (ms * ms) / (2 * 9.81), floors = hgt / 3;
        const ratio = (v / 50) ** 2;
        const H = 170, maxH = 70;
        const y = (m) => 180 - (Math.min(m, maxH) / maxH) * H;
        let bld = '';
        for (let f = 0; f < Math.min(24, Math.ceil(maxH / 3)); f++) bld += `<rect x="60" y="${y((f + 1) * 3)}" width="70" height="${y(f * 3) - y((f + 1) * 3) - 1.5}" class="floor"/>`;
        view.innerHTML = `<svg viewBox="0 0 700 200" class="w-svg">
          ${bld}
          <line x1="40" y1="${y(hgt)}" x2="220" y2="${y(hgt)}" class="stop"/>
          <text x="226" y="${y(hgt) + 5}" class="followl">${L('גובה נפילה שקול', 'equivalent fall')}: ${num(hgt, 1)} ${L('מ׳', 'm')} ≈ ${num(floors, 1)} ${L('קומות', 'storeys')}</text>
          <line x1="40" y1="180" x2="660" y2="180" class="ax"/>
          <rect x="420" y="${180 - Math.min(160, ratio * 40)}" width="60" height="${Math.min(160, ratio * 40)}" class="bar-brake"/>
          <rect x="520" y="140" width="60" height="40" class="bar-react"/>
          <text x="450" y="194" text-anchor="middle" class="axl">${v} ${L('קמ״ש', 'km/h')}</text>
          <text x="550" y="194" text-anchor="middle" class="axl">50 ${L('קמ״ש', 'km/h')}</text>
        </svg>`;
        read.innerHTML = `<div>${L('אנרגיית התנועה', 'Kinetic energy')}: <b>×${num(ratio, 2)}</b> ${L('לעומת 50 קמ״ש', 'compared with 50 km/h')}</div>
          <div class="w-note">${L('האנרגיה גדלה עם ריבוע המהירות: פי 2 במהירות — פי 4 באנרגיה, פי 4 במרחק הבלימה ופי 4 בעוצמת הפגיעה.', 'Energy grows with the square of speed: twice the speed means four times the energy, the braking distance and the force of the impact.')}</div>`;
      };
      el.append(view, h('div', { class: 'w-controls' }, slider(L('מהירות', 'Speed'), 10, 140, 5, v, (x) => `${x} ${L('קמ״ש', 'km/h')}`, (x) => { v = x; draw(); }).el), read);
      draw();
    }
  });

  // ------------------------------------------------------------------
  // following distance in seconds: watch the gap pass a landmark
  // ------------------------------------------------------------------
  W.register('following-distance', {
    mount(el, p) {
      let v = p.speed || 80, gapS = p.gap || factNum('following.recommended_gap', 2);
      let t = 0, playing = true;
      const view = h('div', { class: 'w-stage' });
      const read = h('div', { class: 'w-readout' });
      const draw = () => {
        const ms = v / 3.6, gapM = ms * gapS;
        const scale = 560 / Math.max(120, gapM * 1.6);
        const lead = 600, follow = lead - gapM * scale;
        const pole = 700 - ((t * ms * scale) % 700);
        const lp = pole, passedLead = pole < lead;
        const secsSince = passedLead ? (lead - pole) / (ms * scale) : 0;
        view.innerHTML = `<svg viewBox="0 0 700 120" class="w-svg">
          <rect x="0" y="40" width="700" height="50" class="road"/>
          <line x1="0" y1="65" x2="700" y2="65" class="lane" stroke-dasharray="${14} 10" stroke-dashoffset="${(t * ms * scale) % 24}"/>
          <line x1="${lp}" y1="18" x2="${lp}" y2="40" class="pole"/><circle cx="${lp}" cy="16" r="5" class="pole-top"/>
          <rect x="${lead - 36}" y="47" width="36" height="16" rx="4" class="car lead"/>
          <rect x="${follow - 36}" y="47" width="36" height="16" rx="4" class="car"/>
          <line x1="${follow}" y1="100" x2="${lead - 36}" y2="100" class="ax"/>
          <text x="${(follow + lead - 36) / 2}" y="114" text-anchor="middle" class="axl">${num(gapM)} ${L('מ׳', 'm')}</text>
          ${passedLead && pole > follow ? `<text x="${lp}" y="34" text-anchor="middle" class="followl">${num(secsSince, 1)}</text>` : ''}
        </svg>`;
        read.innerHTML = `<div>${L('מרווח', 'Gap')}: <b>${num(gapS, 1)} ${L('שניות', 's')}</b> = <b>${num(gapM)} ${L('מ׳', 'm')}</b> ${L('ב-', 'at ')}${v} ${L('קמ״ש', 'km/h')}</div>
          <div class="w-note">${L('בוחרים נקודת ציון קבועה (עמוד, תמרור). כשהרכב שלפנים חולף על פניה סופרים „אחת ועשרים, שתיים ועשרים”. אם הגעתם אליה לפני שסיימתם — אתם קרובים מדי.', 'Pick a fixed landmark (a pole, a sign). When the car ahead passes it, count "one thousand and one, one thousand and two". Reach it before you finish and you are too close.')}</div>`;
      };
      const loopH = loop(el, (dt) => { if (playing) { t += dt; draw(); } });
      const btn = h('button', { type: 'button', class: 'btn small' }, D.t('fig.pause'));
      btn.addEventListener('click', () => { playing = !playing; btn.textContent = D.t(playing ? 'fig.pause' : 'fig.play'); });
      el.append(view, h('div', { class: 'w-controls' },
        slider(L('מהירות', 'Speed'), 30, 120, 10, v, (x) => `${x} ${L('קמ״ש', 'km/h')}`, (x) => { v = x; draw(); }).el,
        slider(L('מרווח', 'Gap'), 0.5, 4, 0.5, gapS, (x) => `${num(x, 1)} ${L('שנ׳', 's')}`, (x) => { gapS = x; draw(); }).el,
        btn), read);
      draw();
      return { destroy: () => loopH.stop() };
    }
  });

  // ------------------------------------------------------------------
  // the Israeli traffic-light sequence
  // ------------------------------------------------------------------
  W.register('traffic-light', {
    mount(el) {
      const PH = [
        { lamps: [1, 0, 0], he: 'אדום — עוצרים לפני קו העצירה.', en: 'Red — stop before the stop line.', d: 3 },
        { lamps: [1, 1, 0], he: 'אדום וצהוב יחד — עדיין אסור לנסוע; מתכוננים, האור עומד להתחלף לירוק.', en: 'Red and amber together — you still may not go; get ready, green is coming.', d: 1.5 },
        { lamps: [0, 0, 1], he: 'ירוק — מותר לנסוע אם הצומת פנוי ואפשר לחצות אותו בלי להיעצר בתוכו.', en: 'Green — go if the junction is clear and you can cross without stopping inside it.', d: 3 },
        { lamps: [0, 0, 2], he: 'ירוק מהבהב — האור עומד להתחלף לצהוב. מי שעדיין לא הגיע לצומת מתכונן לעצור.', en: 'Flashing green — amber is coming. If you have not reached the junction, prepare to stop.', d: 2 },
        { lamps: [0, 1, 0], he: 'צהוב — עוצרים, אלא אם אי אפשר לעצור בבטחה לפני הצומת.', en: 'Amber — stop, unless you cannot stop safely before the junction.', d: 1.5 }
      ];
      let i = 0, t = 0, playing = false, blink = 0;
      const view = h('div', { class: 'w-stage tl-stage' });
      const text = h('div', { class: 'w-readout' });
      const draw = () => {
        const ph = PH[i];
        const on = (k) => ph.lamps[k] === 1 || (ph.lamps[k] === 2 && Math.floor(blink * 2) % 2 === 0);
        const c = ['#FF3B30', '#FFC400', '#1FD37A'];
        view.innerHTML = `<svg viewBox="0 0 120 300" class="w-svg tl" role="img">
          <rect x="20" y="10" width="80" height="280" rx="18" fill="#22252b" stroke="#000" stroke-width="3"/>
          ${[0, 1, 2].map((k) => `<circle cx="60" cy="${60 + k * 90}" r="32" fill="${on(k) ? c[k] : '#3a3d44'}"/>${on(k) ? `<circle cx="50" cy="${50 + k * 90}" r="9" fill="#fff" opacity=".35"/>` : ''}`).join('')}
        </svg>`;
        text.innerHTML = `<div class="tl-step">${i + 1} / ${PH.length}</div><div>${D.util.esc(L(ph.he, ph.en))}</div>`;
      };
      const loopH = loop(el, (dt) => {
        blink += dt;
        if (playing) { t += dt; if (t > PH[i].d) { t = 0; i = (i + 1) % PH.length; } }
        draw();
      });
      const bPlay = h('button', { type: 'button', class: 'btn small' }, D.t('fig.play'));
      bPlay.addEventListener('click', () => { playing = !playing; bPlay.textContent = D.t(playing ? 'fig.pause' : 'fig.play'); });
      const bStep = h('button', { type: 'button', class: 'btn small' }, D.t('fig.step'));
      bStep.addEventListener('click', () => { playing = false; bPlay.textContent = D.t('fig.play'); t = 0; i = (i + 1) % PH.length; draw(); });
      el.append(h('div', { class: 'w-split' }, view, text), h('div', { class: 'w-controls' }, bPlay, bStep));
      draw();
      return { destroy: () => loopH.stop() };
    }
  });

  // ------------------------------------------------------------------
  // the four-stroke cycle
  // ------------------------------------------------------------------
  W.register('four-stroke', {
    mount(el, p) {
      const diesel = p.type === 'diesel';
      const ST = [
        { he: 'יניקה', en: 'Intake', dhe: diesel ? 'הבוכנה יורדת ושסתום היניקה פתוח: הצילינדר מתמלא באוויר בלבד.' : 'הבוכנה יורדת ושסתום היניקה פתוח: תערובת אוויר ודלק נכנסת לצילינדר.', den: diesel ? 'The piston goes down with the intake valve open: the cylinder fills with air only.' : 'The piston goes down with the intake valve open: air and fuel enter the cylinder.' },
        { he: 'דחיסה', en: 'Compression', dhe: diesel ? 'שני השסתומים סגורים; הבוכנה עולה ודוחסת את האוויר עד שהוא מתחמם מאוד.' : 'שני השסתומים סגורים; הבוכנה עולה ודוחסת את התערובת.', den: diesel ? 'Both valves closed; the piston rises and squeezes the air until it is very hot.' : 'Both valves closed; the piston rises and squeezes the mixture.' },
        { he: 'עבודה (התפשטות)', en: 'Power', dhe: diesel ? 'דלק מוזרק לאוויר הלוהט ונדלק מעצמו; הגזים מתפשטים ודוחפים את הבוכנה למטה.' : 'המצת יוצר ניצוץ, התערובת בוערת, והגזים המתפשטים דוחפים את הבוכנה למטה.', den: diesel ? 'Fuel is injected into the hot air and ignites by itself; the gases expand and push the piston down.' : 'The spark plug fires, the mixture burns and the expanding gases push the piston down.' },
        { he: 'פליטה', en: 'Exhaust', dhe: 'שסתום הפליטה פתוח; הבוכנה עולה ודוחפת את הגזים השרופים אל מערכת הפליטה.', den: 'The exhaust valve is open; the piston rises and pushes the burnt gases into the exhaust.' }
      ];
      let a = 0, playing = true, speed = 0.6;
      const view = h('div', { class: 'w-stage' });
      const read = h('div', { class: 'w-readout' });
      const draw = () => {
        const cyc = ((a % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI);
        const stroke = Math.floor(cyc / Math.PI);
        const crank = cyc % (2 * Math.PI);
        const r = 26, lrod = 70, cx = 150, cy = 230;
        const px = cx + r * Math.sin(crank), py = cy - r * Math.cos(crank);
        const pistonY = py - Math.sqrt(lrod * lrod - (px - cx) ** 2);
        const inOpen = stroke === 0, exOpen = stroke === 3;
        const fire = stroke === 2 && (cyc % Math.PI) < 0.5;
        const gas = ['#6fb7ff', '#9fd0ff', '#ffb347', '#9a9a9a'][stroke];
        view.innerHTML = `<svg viewBox="0 0 300 290" class="w-svg fs">
          <rect x="96" y="34" width="108" height="${pistonY - 34 - 18}" fill="${gas}" opacity="${fire ? 0.95 : 0.55}"/>
          ${fire ? `<circle cx="150" cy="${diesel ? 60 : 46}" r="22" fill="#ffdd55" opacity=".9"/>` : ''}
          <path d="M90 20 L90 ${cy - 40} M210 20 L210 ${cy - 40}" stroke="var(--text2)" stroke-width="6"/>
          <path d="M90 20 L118 20 M182 20 L210 20" stroke="var(--text2)" stroke-width="6"/>
          <path d="M40 40 L110 40 L110 26" stroke="#6fb7ff" stroke-width="10" fill="none" opacity=".7"/>
          <path d="M260 40 L190 40 L190 26" stroke="#9a9a9a" stroke-width="10" fill="none" opacity=".7"/>
          <line x1="118" y1="${inOpen ? 40 : 26}" x2="118" y2="${inOpen ? 4 : -10}" stroke="var(--text)" stroke-width="4"/>
          <rect x="106" y="${inOpen ? 38 : 24}" width="24" height="5" fill="var(--text)"/>
          <line x1="182" y1="${exOpen ? 40 : 26}" x2="182" y2="${exOpen ? 4 : -10}" stroke="var(--text)" stroke-width="4"/>
          <rect x="170" y="${exOpen ? 38 : 24}" width="24" height="5" fill="var(--text)"/>
          ${diesel ? '<rect x="144" y="10" width="12" height="22" fill="#c7a100"/>' : '<rect x="145" y="8" width="10" height="22" fill="#c9c9c9"/><path d="M150 30 L150 36" stroke="#fff" stroke-width="2"/>'}
          <rect x="98" y="${pistonY - 18}" width="104" height="36" rx="4" fill="#b9bfca" stroke="#6b717d" stroke-width="2"/>
          <line x1="150" y1="${pistonY}" x2="${px}" y2="${py}" stroke="#8d949f" stroke-width="10" stroke-linecap="round"/>
          <circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="none" stroke="var(--border2)" stroke-width="3"/>
          <line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" stroke="#6b717d" stroke-width="10" stroke-linecap="round"/>
          <circle cx="${cx}" cy="${cy}" r="7" fill="#6b717d"/>
          <text x="40" y="60" class="axl">${L('יניקה', 'in')}</text><text x="250" y="60" class="axl" text-anchor="end">${L('פליטה', 'out')}</text>
        </svg>`;
        const s = ST[stroke];
        read.innerHTML = `<div class="fs-steps">${ST.map((x, k) => `<span class="fs-step${k === stroke ? ' on' : ''}">${k + 1}. ${D.util.esc(L(x.he, x.en))}</span>`).join('')}</div><div>${D.util.esc(L(s.dhe, s.den))}</div>`;
      };
      const loopH = loop(el, (dt) => { if (playing) { a += dt * speed * 2 * Math.PI; draw(); } });
      const bPlay = h('button', { type: 'button', class: 'btn small' }, D.t('fig.pause'));
      bPlay.addEventListener('click', () => { playing = !playing; bPlay.textContent = D.t(playing ? 'fig.pause' : 'fig.play'); });
      const bStep = h('button', { type: 'button', class: 'btn small' }, D.t('fig.step'));
      bStep.addEventListener('click', () => { playing = false; bPlay.textContent = D.t('fig.play'); a = (Math.floor(a / Math.PI) + 1) * Math.PI + 0.3; draw(); });
      el.append(h('div', { class: 'w-split' }, view, read), h('div', { class: 'w-controls' }, bPlay, bStep,
        slider(L('מהירות ההדגמה', 'Animation speed'), 0.1, 2, 0.1, speed, (x) => '×' + num(x, 1), (x) => { speed = x; }).el));
      draw();
      return { destroy: () => loopH.stop() };
    }
  });

  // ------------------------------------------------------------------
  // blind spots around a car, a truck or a bus (top view)
  // ------------------------------------------------------------------
  W.register('blind-spots', {
    mount(el, p) {
      let kind = p.vehicle || 'car';
      const view = h('div', { class: 'w-stage' });
      const read = h('div', { class: 'w-readout' });
      const TXT = {
        car: [L('ברכב פרטי השטחים המתים העיקריים נמצאים בצדדים, מעט מאחורי הנהג — ביניהם רוכב אופנוע או רכב שלם יכולים להיעלם מהמראות.', 'In a car the main blind spots are beside and just behind the driver — a motorcycle or even a car can vanish from the mirrors there.'), L('לפני החלפת נתיב: מראה פנימית, מראת צד ומבט מהיר מעבר לכתף.', 'Before changing lanes: inside mirror, side mirror and a quick look over the shoulder.')],
        truck: [L('למשאית שטחים מתים גדולים: צמוד לפני התא, לכל אורך הצד הימני ומאחור. אם אינכם רואים את המראות של הנהג — הוא אינו רואה אתכם.', 'A truck has large blind spots: right in front of the cab, all along the right side and behind. If you cannot see the driver\'s mirrors, the driver cannot see you.'), L('לעולם אל תעמדו מימין למשאית בצומת כשהיא עומדת לפנות ימינה.', 'Never wait on the right of a truck at a junction when it may turn right.')],
        bus: [L('לאוטובוס שטח מת גדול לפני החזית ומימין לדלתות, ובעיקר מאחור.', 'A bus has a large blind area in front, to the right of the doors and above all behind.'), L('הולכי רגל שיורדים מאוטובוס וחוצים לפניו אינם נראים לנהגים העוקפים אותו.', 'People stepping off a bus and crossing in front of it are hidden from drivers passing it.')]
      };
      const draw = () => {
        const V = { car: { w: 44, l: 90 }, truck: { w: 56, l: 220 }, bus: { w: 56, l: 190 } }[kind];
        const cx = 350, top = 150 - V.l / 2;
        const zones = kind === 'car'
          ? `<path d="M${cx - V.w / 2} ${top + 40} L${cx - V.w / 2 - 70} ${top + 70} L${cx - V.w / 2 - 70} ${top + 130} L${cx - V.w / 2} ${top + 95} Z" class="blind"/>
             <path d="M${cx + V.w / 2} ${top + 40} L${cx + V.w / 2 + 70} ${top + 70} L${cx + V.w / 2 + 70} ${top + 130} L${cx + V.w / 2} ${top + 95} Z" class="blind"/>
             <path d="M${cx - V.w / 2 + 4} ${top + V.l} L${cx + V.w / 2 - 4} ${top + V.l} L${cx + 14} ${top + V.l + 34} L${cx - 14} ${top + V.l + 34} Z" class="blind"/>`
          : `<rect x="${cx - V.w / 2 - 6}" y="${top - 46}" width="${V.w + 12}" height="44" class="blind"/>
             <path d="M${cx + V.w / 2} ${top + 30} L${cx + V.w / 2 + 110} ${top + 70} L${cx + V.w / 2 + 110} ${top + V.l + 20} L${cx + V.w / 2} ${top + V.l} Z" class="blind"/>
             <path d="M${cx - V.w / 2} ${top + 50} L${cx - V.w / 2 - 50} ${top + 90} L${cx - V.w / 2 - 50} ${top + 150} L${cx - V.w / 2} ${top + 120} Z" class="blind"/>
             <rect x="${cx - V.w / 2}" y="${top + V.l + 2}" width="${V.w}" height="60" class="blind"/>`;
        const mirrors = `<path d="M${cx - V.w / 2 - 4} ${top + 32} L${cx - V.w / 2 - 170} ${top + V.l + 40} L${cx - V.w / 2 - 90} ${top + V.l + 60} Z" class="seen"/>
          <path d="M${cx + V.w / 2 + 4} ${top + 32} L${cx + V.w / 2 + 170} ${top + V.l + 40} L${cx + V.w / 2 + 90} ${top + V.l + 60} Z" class="seen"/>`;
        view.innerHTML = `<svg viewBox="0 -20 700 360" class="w-svg">
          <rect x="0" y="-20" width="700" height="360" class="road"/>
          <line x1="${cx - 90}" y1="-20" x2="${cx - 90}" y2="340" class="lane" stroke-dasharray="16 12"/>
          <line x1="${cx + 90}" y1="-20" x2="${cx + 90}" y2="340" class="lane" stroke-dasharray="16 12"/>
          ${mirrors}${zones}
          <rect x="${cx - V.w / 2}" y="${top}" width="${V.w}" height="${V.l}" rx="${kind === 'car' ? 10 : 5}" class="car"/>
          ${kind === 'truck' ? `<line x1="${cx - V.w / 2}" y1="${top + 50}" x2="${cx + V.w / 2}" y2="${top + 50}" stroke="var(--bg)" stroke-width="4"/>` : ''}
          <rect x="${cx - V.w / 2 + 6}" y="${top + (kind === 'car' ? 22 : 8)}" width="${V.w - 12}" height="${kind === 'car' ? 14 : 16}" rx="3" class="glass"/>
          <text x="${cx}" y="${top - 56}" text-anchor="middle" class="axl">▲ ${L('כיוון הנסיעה', 'direction of travel')}</text>
        </svg>
        <div class="w-legend"><span class="k blind"></span>${L('שטח מת', 'Blind spot')} <span class="k seen"></span>${L('נראה במראות הצד', 'Seen in side mirrors')}</div>`;
        read.innerHTML = TXT[kind].map((x) => `<p>${D.util.esc(x)}</p>`).join('');
      };
      el.append(h('div', { class: 'w-controls' }, seg([['car', L('רכב פרטי', 'Car')], ['truck', L('משאית', 'Truck')], ['bus', L('אוטובוס', 'Bus')]], kind, (x) => { kind = x; draw(); })), view, read);
      draw();
    }
  });

  // ------------------------------------------------------------------
  // reading a tyre's sidewall: 205/55 R16 91V
  // ------------------------------------------------------------------
  const SPEED = { L: 120, M: 130, N: 140, P: 150, Q: 160, R: 170, S: 180, T: 190, U: 200, H: 210, V: 240, W: 270, Y: 300 };
  const LOAD = (li) => {
    // ETRTO load index → kg, from the standard table's formula fit (exact at listed points)
    const T = { 60: 250, 65: 290, 70: 335, 75: 387, 80: 450, 82: 475, 84: 500, 85: 515, 86: 530, 87: 545, 88: 560, 89: 580, 90: 600, 91: 615, 92: 630, 93: 650, 94: 670, 95: 690, 96: 710, 97: 730, 98: 750, 99: 775, 100: 800, 101: 825, 102: 850, 103: 875, 104: 900, 105: 925, 106: 950, 107: 975, 108: 1000, 109: 1030, 110: 1060, 112: 1120, 115: 1215, 120: 1400, 125: 1650, 130: 1900, 140: 2500, 150: 3350, 156: 4000 };
    if (T[li]) return T[li];
    const ks = Object.keys(T).map(Number).sort((a, b) => a - b);
    for (let i = 0; i < ks.length - 1; i++) if (li > ks[i] && li < ks[i + 1]) return Math.round(T[ks[i]] + (T[ks[i + 1]] - T[ks[i]]) * (li - ks[i]) / (ks[i + 1] - ks[i]));
    return null;
  };
  W.register('tyre-code', {
    mount(el, p) {
      const inp = h('input', { type: 'text', class: 'w-input', value: p.code || '205/55 R16 91V', dir: 'ltr', spellcheck: 'false', 'aria-label': L('הקוד שעל דופן הצמיג', 'The code on the tyre sidewall') });
      const view = h('div', { class: 'w-stage' });
      const read = h('div', { class: 'w-readout' });
      const draw = () => {
        const m = inp.value.toUpperCase().replace(/\s+/g, ' ').match(/(\d{3})\s*\/\s*(\d{2})\s*(Z?R|D|B)?\s*(\d{2}(?:\.\d)?)\s*(?:(\d{2,3})(?:\/\d{2,3})?\s*([A-Z]))?/);
        if (!m) { read.innerHTML = `<div class="w-note">${L('הקלידו קוד כמו 205/55 R16 91V', 'Type a code like 205/55 R16 91V')}</div>`; view.innerHTML = ''; return; }
        const w = +m[1], ar = +m[2], rim = +m[4], li = m[5] ? +m[5] : null, sp = m[6] || null;
        const side = w * ar / 100, dia = rim * 25.4 + 2 * side;
        const R = 120 / dia * 2;
        const cx = 170, cy = 130;
        view.innerHTML = `<svg viewBox="0 0 700 260" class="w-svg">
          <circle cx="${cx}" cy="${cy}" r="${dia / 2 * R}" fill="#26282d"/>
          <circle cx="${cx}" cy="${cy}" r="${rim * 25.4 / 2 * R}" fill="#9aa1ab"/>
          <circle cx="${cx}" cy="${cy}" r="${rim * 25.4 / 2 * R * 0.3}" fill="#6b717d"/>
          <line x1="${cx}" y1="${cy - dia / 2 * R}" x2="${cx}" y2="${cy - rim * 25.4 / 2 * R}" stroke="#ffb347" stroke-width="3"/>
          <rect x="400" y="${cy - dia / 2 * R}" width="${w * R}" height="${dia * R}" rx="${w * R / 4}" fill="#26282d"/>
          <text x="${400 + w * R / 2}" y="${cy + dia / 2 * R + 20}" text-anchor="middle" class="axl">${w} ${L('מ״מ', 'mm')}</text>
          <text x="${cx + 10}" y="${cy - (dia / 2 * R + rim * 25.4 / 2 * R) / 2}" class="followl">${num(side)} ${L('מ״מ', 'mm')}</text>
        </svg>`;
        const rows = [
          [m[1], L('רוחב הצמיג במילימטרים', 'Tyre width in millimetres'), `${w} ${L('מ״מ', 'mm')}`],
          [m[2], L('יחס גובה הדופן לרוחב (%)', 'Sidewall height as % of the width'), `${num(side)} ${L('מ״מ', 'mm')}`],
          [m[3] || 'R', L('מבנה רדיאלי', 'Radial construction'), ''],
          [m[4], L('קוטר החישוק באינצ׳ים', 'Rim diameter in inches'), `${num(rim * 25.4)} ${L('מ״מ', 'mm')}`],
          li ? [m[5], L('מדד עומס — המשקל המרבי לצמיג', 'Load index — the most weight per tyre'), LOAD(li) ? `${num(LOAD(li))} ${L('ק״ג', 'kg')}` : '?'] : null,
          sp ? [sp, L('מדד מהירות — המהירות המרבית שהצמיג תוכנן לה', 'Speed rating — the top speed it is built for'), SPEED[sp] ? `${SPEED[sp]} ${L('קמ״ש', 'km/h')}` : '?'] : null
        ].filter(Boolean);
        read.innerHTML = `<table class="w-table"><tbody>${rows.map((r) => `<tr><td dir="ltr"><b>${D.util.esc(r[0])}</b></td><td>${D.util.esc(r[1])}</td><td>${D.util.esc(r[2])}</td></tr>`).join('')}</tbody></table>
          <div>${L('קוטר חיצוני', 'Overall diameter')}: <b>${num(dia)} ${L('מ״מ', 'mm')}</b></div>
          <div class="w-note">${L('מחליפים רק במידה ובמדדים שיצרן הרכב קבע (מופיעים בספר הרכב ובמדבקה בפתח הדלת או במכסה הדלק).', 'Replace only with the size and ratings the vehicle maker specifies (in the handbook and on the label in the door frame or fuel flap).')}</div>`;
      };
      inp.addEventListener('input', draw);
      el.append(h('div', { class: 'w-controls' }, h('label', { class: 'w-row' }, h('span', { class: 'w-lab' }, L('קוד הצמיג', 'Tyre code')), inp)), view, read);
      draw();
    }
  });

  W.helpers = { slider, seg, loop, L, num, factNum, clamp };
})(globalThis.Drive = globalThis.Drive || {});
