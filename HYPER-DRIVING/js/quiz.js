/* Hyper Driving · quiz.js — question pools, practice sessions, mock exams,
 * generated drills (signs, warning lights) and the reader's progress with
 * Leitner-box spaced repetition.
 *
 * A question (in <lang>/questions/<chapter>.json):
 *   { "id": "q-sd-001", "chapter": "speed-distance", "lesson": "sd-limits",
 *     "licence": ["B"] (omit = all classes), "q": "text", "sign": "302" (optional),
 *     "fig": "figure-id" (optional), "options": ["right", "wrong", "wrong", "wrong"],
 *     "answer": 0, "explain": "why", "fixed": false (true = keep option order),
 *     "difficulty": 1..3, "facts": ["speed.urban"] }
 * Question ids are shared by every language; option order and "answer" too.
 */
(function (D) {
  'use strict';
  const { shuffle, today } = D.util;
  const Q = D.quiz = {};

  // ---------- progress ----------
  const KEY = () => 'progress:' + ((D.data && D.data.jur) || 'il');
  const EMPTY = () => ({ q: {}, lessons: {}, exams: [], drills: { sign: {}, dash: {}, term: {} }, last: null });
  let prog = null;
  Q.progress = () => {
    if (!prog) prog = Object.assign(EMPTY(), D.store.get(KEY(), {}));
    ['sign', 'dash', 'term'].forEach((k) => { prog.drills[k] = prog.drills[k] || {}; });
    return prog;
  };
  let saveT = null;
  Q.save = () => { clearTimeout(saveT); saveT = setTimeout(() => D.store.set(KEY(), prog), 150); };
  Q.saveNow = () => { clearTimeout(saveT); D.store.set(KEY(), prog); };
  Q.reset = () => { prog = EMPTY(); Q.saveNow(); D.emit('progress'); };
  Q.replace = (p) => { prog = Object.assign(EMPTY(), p || {}); Q.saveNow(); D.emit('progress'); };
  D.on('content', () => { prog = null; });

  // Leitner boxes: days until the next review after a correct answer
  const INTERVAL = [0, 1, 3, 7, 16, 35];
  Q.INTERVAL = INTERVAL;
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

  function record(bucket, id, ok) {
    const r = bucket[id] || (bucket[id] = { c: 0, w: 0, box: 0, due: today() });
    if (ok) { r.c++; r.box = Math.min(5, r.box + 1); } else { r.w++; r.box = 0; }
    r.last = Date.now();
    r.lastOk = ok;
    r.due = addDays(today(), INTERVAL[r.box]);
    return r;
  }
  Q.recordQuestion = (id, ok) => { record(Q.progress().q, id, ok); Q.save(); };
  Q.recordDrill = (kind, id, ok) => { record(Q.progress().drills[kind], id, ok); Q.save(); };
  Q.markLesson = (id) => { const p = Q.progress(); p.lessons[id] = Date.now(); p.last = id; Q.save(); D.emit('progress'); };
  Q.lessonRead = (id) => !!Q.progress().lessons[id];

  // ---------- pools ----------
  Q.pool = (opts) => {
    opts = opts || {};
    let qs = D.content.questions().filter((q) => D.content.forLicence(q, opts.licence));
    if (opts.chapters && opts.chapters.length) qs = qs.filter((q) => opts.chapters.includes(q._chapter));
    if (opts.lesson) qs = qs.filter((q) => q.lesson === opts.lesson);
    return qs;
  };
  Q.stats = (pool) => {
    const p = Q.progress().q;
    let seen = 0, mastered = 0, wrong = 0, due = 0;
    const t = today();
    pool.forEach((q) => {
      const r = p[q.id];
      if (!r) return;
      seen++;
      if (r.box >= 3) mastered++;
      if (r.lastOk === false) wrong++;
      if (r.due <= t) due++;
    });
    return { total: pool.length, seen, mastered, wrong, due };
  };

  // ---------- exam parameters (from the facts, so the authority can change them) ----------
  Q.examRules = () => {
    const v = (id, d) => { const f = D.fact(id); const x = f ? D.content.factValue(f) : null; return typeof x === 'number' ? x : d; };
    const lic = D.settings.licence;
    const per = (D.data.exam && D.data.exam.perLicence && D.data.exam.perLicence[lic]) || {};
    return {
      questions: per.questions || v('theory.questions', 30),
      maxErrors: per.maxErrors != null ? per.maxErrors : v('theory.max_mistakes', 4),
      minutes: per.minutes || v('theory.time_limit', 40)
    };
  };

  // spread the exam over chapters: in proportion to each chapter's pool,
  // times its weight in exam.json, at least one question from every chapter
  // that has any (while there is room)
  Q.buildExam = (seed) => {
    const rules = Q.examRules();
    const pool = Q.pool();
    const rnd = D.util.rng(seed || Date.now());
    const byCh = new Map();
    pool.forEach((q) => { if (!byCh.has(q._chapter)) byCh.set(q._chapter, []); byCh.get(q._chapter).push(q); });
    const weights = (D.data.exam && D.data.exam.weights) || {};
    const chs = [...byCh.keys()];
    const w = chs.map((c) => byCh.get(c).length * (weights[c] != null ? weights[c] : 1));
    const W = w.reduce((a, b) => a + b, 0) || 1;
    const n = Math.min(rules.questions, pool.length);
    const take = chs.map((c, i) => Math.floor((w[i] / W) * n));
    let left = n - take.reduce((a, b) => a + b, 0);
    chs.forEach((c, i) => { if (left > 0 && take[i] === 0 && w[i] > 0) { take[i] = 1; left--; } });
    const order = shuffle(chs.map((c, i) => i), rnd);
    for (let k = 0; left > 0 && k < 1000; k++) { const i = order[k % order.length]; if (take[i] < byCh.get(chs[i]).length) { take[i]++; left--; } }
    let picked = [];
    chs.forEach((c, i) => { picked = picked.concat(shuffle(byCh.get(c), rnd).slice(0, take[i])); });
    return { questions: shuffle(picked, rnd).slice(0, n), rules };
  };

  // due for review first (lowest box first), then never-seen questions
  Q.smartSet = (n) => {
    const p = Q.progress().q, t = today();
    const pool = Q.pool();
    const due = pool.filter((q) => p[q.id] && p[q.id].due <= t).sort((a, b) => p[a.id].box - p[b.id].box);
    const fresh = shuffle(pool.filter((q) => !p[q.id]));
    return due.concat(fresh).slice(0, n || 20);
  };
  Q.mistakeSet = (n) => {
    const p = Q.progress().q;
    return shuffle(Q.pool().filter((q) => p[q.id] && p[q.id].lastOk === false)).slice(0, n || 30);
  };

  // ---------- generated drills ----------
  // sign drill: show a sign, choose its name; distractors from the same
  // category (then anywhere), never the same name twice
  Q.signDrill = (n, filter) => {
    const all = D.data.signs.filter((s) => s.name && D.tr(s.name));
    let pool = filter ? all.filter(filter) : all;
    const d = Q.progress().drills.sign, t = today();
    pool = shuffle(pool).sort((a, b) => ((d[a.num] ? (d[a.num].due <= t ? d[a.num].box : 9) : 5) - (d[b.num] ? (d[b.num].due <= t ? d[b.num].box : 9) : 5)));
    return pool.slice(0, n || 15).map((s) => {
      const name = D.tr(s.name);
      const same = shuffle(all.filter((o) => o.cat === s.cat && o.num !== s.num && D.tr(o.name) !== name));
      const other = shuffle(all.filter((o) => o.cat !== s.cat && D.tr(o.name) !== name));
      const seen = new Set([name]);
      const wrong = [];
      for (const o of same.concat(other)) { const nm = D.tr(o.name); if (!seen.has(nm)) { seen.add(nm); wrong.push(nm); } if (wrong.length === 3) break; }
      return { id: 'sign:' + s.num, gen: 'sign', drillId: String(s.num), sign: String(s.num), q: D.t('quiz.whatSign'), options: [name].concat(wrong), answer: 0, explain: D.tr(s.meaning), _link: '#/sign/' + s.num };
    });
  };
  // the reverse: a sign's name, four signs to choose from (same category first)
  Q.signReverseDrill = (n, filter) => {
    const all = D.data.signs.filter((s) => s.name && D.tr(s.name) && (s.draw && s.draw.length || s.svg || s.lamps || s.shape));
    const pool = D.util.shuffle(filter ? all.filter(filter) : all).slice(0, n || 8);
    return pool.map((s) => {
      const name = D.tr(s.name);
      const others = D.util.shuffle(all.filter((o) => o.num !== s.num && o.cat === s.cat && D.tr(o.name) !== name))
        .concat(D.util.shuffle(all.filter((o) => o.cat !== s.cat))).slice(0, 3);
      return { id: 'signr:' + s.num, gen: 'sign', drillId: String(s.num), optSigns: true, q: D.t('quiz.whichSign', { name }), options: [String(s.num)].concat(others.map((o) => String(o.num))), answer: 0, explain: D.tr(s.meaning), _link: '#/sign/' + s.num };
    });
  };

  Q.dashDrill = (n) => {
    const all = D.data.dash.filter((d) => D.tr(d.name));
    return shuffle(all).slice(0, n || 12).map((d) => {
      const name = D.tr(d.name);
      const wrong = shuffle(all.filter((o) => o.id !== d.id && D.tr(o.name) !== name)).slice(0, 3).map((o) => D.tr(o.name));
      return { id: 'dash:' + d.id, gen: 'dash', drillId: d.id, dash: d.id, q: D.t('quiz.whatLight'), options: [name].concat(wrong), answer: 0, explain: D.tr(d.meaning) + (d.action ? '\n\n**' + D.t('dash.action') + ':** ' + D.tr(d.action) : ''), _link: '#/vehicle/dash/' + d.id };
    });
  };

  // ---------- sessions ----------
  // mode: exam | topic | smart | mistakes | signs | dash | lesson
  Q.session = (mode, questions, opts) => {
    opts = opts || {};
    const s = {
      mode, opts,
      items: questions.map((q) => ({
        q,
        order: q.fixed ? q.options.map((_, i) => i) : shuffle(q.options.map((_, i) => i)),
        chosen: null, ok: null
      })),
      i: 0, started: Date.now(),
      instant: mode !== 'exam',
      deadline: mode === 'exam' && opts.minutes && D.settings.examTimer ? Date.now() + opts.minutes * 60000 : null,
      done: false
    };
    Q.current = s;
    return s;
  };
  Q.answer = (s, item, displayIndex) => {
    if (item.chosen != null && s.instant) return;
    item.chosen = item.order[displayIndex];
    item.ok = item.chosen === item.q.answer;
    if (s.instant) {
      if (item.q.gen) Q.recordDrill(item.q.gen, item.q.drillId, item.ok);
      else Q.recordQuestion(item.q.id, item.ok);
    }
  };
  Q.finish = (s) => {
    if (s.done) return s.result;
    s.done = true;
    const n = s.items.length;
    const correct = s.items.filter((it) => it.ok).length;
    const res = { n, correct, wrong: n - correct, secs: Math.round((Date.now() - s.started) / 1000) };
    if (s.mode === 'exam') {
      s.items.forEach((it) => Q.recordQuestion(it.q.id, !!it.ok));
      res.maxErrors = s.opts.maxErrors;
      res.passed = res.wrong <= s.opts.maxErrors;
      const p = Q.progress();
      p.exams.push({ date: new Date().toISOString(), lic: D.settings.licence, n, correct, passed: res.passed, secs: res.secs });
      if (p.exams.length > 60) p.exams = p.exams.slice(-60);
      Q.saveNow();
    }
    s.result = res;
    D.emit('progress');
    return res;
  };
})(globalThis.Drive = globalThis.Drive || {});
