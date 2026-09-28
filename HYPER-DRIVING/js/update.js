/* Hyper Driving · update.js — how new laws reach the reader.
 *
 * The authority publishes a pack: manifest.json + the files it lists, on any
 * web server (tools/publish.js writes it). The manifest carries, for every
 * file, the SHA-256 of its canonical JSON, and the whole manifest is signed
 * (ECDSA P-256 / SHA-256) with the authority's private key. The app trusts
 * only the public keys in config.js, so a pack cannot be forged or altered on
 * the way.
 *
 * An update may also arrive as a single "update file" (one JSON holding the
 * manifest and every file) — for testing, or for places without a server.
 *
 * Canonical JSON = keys sorted at every level, no spaces; the same function
 * is in tools/publish.js, so hashes do not depend on formatting.
 */
(function (D) {
  'use strict';
  const U = D.update = {};

  // ---------- canonical JSON, hashing, signatures ----------
  const canon = (v) => {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    return '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  };
  U.canon = canon;
  const enc = (s) => new TextEncoder().encode(s);
  const hex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  const b64d = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  const subtle = () => (globalThis.crypto && globalThis.crypto.subtle) || null;

  U.sha256 = async (obj) => {
    if (!subtle()) throw new Error('WebCrypto is not available (the app must run over https or on localhost)');
    return hex(await subtle().digest('SHA-256', enc(canon(obj))));
  };

  U.verifyManifest = async (manifest, jur) => {
    const keys = (D.config.jurisdictions[jur] || {}).trustedKeys || [];
    const sig = manifest.signature;
    if (!keys.length) return { ok: false, reason: 'no-keys' };
    if (!sig || !sig.sig) return { ok: false, reason: 'unsigned' };
    const body = Object.assign({}, manifest); delete body.signature;
    const data = enc(canon(body));
    for (const k of keys) {
      if (sig.kid && k.kid && sig.kid !== k.kid) continue;
      try {
        const key = await subtle().importKey('jwk', k.jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
        const ok = await subtle().verify({ name: 'ECDSA', hash: 'SHA-256' }, key, b64d(sig.sig), data);
        if (ok) return { ok: true, kid: k.kid };
      } catch (e) { /* try the next key */ }
    }
    return { ok: false, reason: 'bad-signature' };
  };

  // ---------- checking and installing ----------
  const state = D.store.get('update', {});
  U.state = state;
  const saveState = () => D.store.set('update', state);

  U.current = () => D.data && D.data.manifest;

  // look at the server's manifest; resolves to { available, manifest } or throws
  U.check = async (jur) => {
    jur = jur || D.data.jur;
    const url = D.config.jurisdictions[jur].updateUrl;
    if (!url) return { available: false, noServer: true };
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const manifest = await r.json();
    state.lastCheck = new Date().toISOString(); saveState();
    const newer = D.content.compareVersions(manifest.version, U.current().version) > 0;
    return { available: newer, manifest, base: url.replace(/[^/]*$/, '') };
  };

  // install from a server: fetch every file whose hash differs from ours
  U.installFrom = async (found, jur) => {
    jur = jur || D.data.jur;
    const files = {};
    const ours = D.data.pack.files;
    const ourHash = {};
    (U.current().files || []).forEach((f) => { ourHash[f.path] = f.sha256; });
    for (const f of found.manifest.files) {
      if (ourHash[f.path] && ourHash[f.path] === f.sha256 && ours[f.path]) { files[f.path] = ours[f.path]; continue; }
      const r = await fetch(found.base + f.path, { cache: 'no-cache' });
      if (!r.ok) throw new Error(f.path + ': HTTP ' + r.status);
      files[f.path] = await r.json();
    }
    return U.install({ manifest: found.manifest, files }, jur, found.base + 'manifest.json');
  };

  // install a { manifest, files } bundle after verifying it
  U.install = async (bundle, jur, origin) => {
    jur = jur || D.data.jur;
    const m = bundle.manifest;
    if (!m || !Array.isArray(m.files)) throw new Error('not a content pack');
    if (m.jurisdiction !== jur) throw new Error('pack is for "' + m.jurisdiction + '"');
    if ((m.format || 1) > D.config.contentFormat) throw new Error('this pack needs a newer version of the app');
    const v = await U.verifyManifest(m, jur);
    if (!v.ok && !(D.settings.editor && (v.reason === 'no-keys' || v.reason === 'unsigned'))) throw new Error(D.t('upd.unsigned') + ' (' + v.reason + ')');
    for (const f of m.files) {
      const obj = bundle.files[f.path];
      if (obj === undefined) throw new Error('missing file ' + f.path);
      if (f.sha256 && (await U.sha256(obj)) !== f.sha256) throw new Error(D.t('upd.badHash', { f: f.path }));
    }
    const before = D.data;
    await D.idb.set('pack:' + jur, { manifest: m, files: bundle.files, installed: new Date().toISOString(), origin: origin || 'file', verified: v.ok });
    await D.content.load(jur);
    state.lastDiff = U.diff(before, D.data);
    state.lastInstalled = { version: m.version, at: new Date().toISOString(), verified: v.ok };
    saveState();
    D.emit('updated', state.lastDiff);
    return state.lastDiff;
  };

  U.revert = async (jur) => {
    jur = jur || D.data.jur;
    await D.idb.del('pack:' + jur);
    const before = D.data;
    await D.content.load(jur);
    state.lastDiff = U.diff(before, D.data);
    saveState();
    D.emit('updated', state.lastDiff);
  };

  // a file chosen by the reader: a bundle { manifest, files }
  U.installFile = async (file, jur) => {
    const text = await file.text();
    const bundle = JSON.parse(text);
    return U.install(bundle, jur, 'file:' + file.name);
  };

  // ---------- what changed between two loaded packs ----------
  U.diff = (a, b) => {
    const out = { from: a && a.manifest.version, to: b.manifest.version, facts: [], offences: [], signs: { added: [], changed: [], removed: [] }, lessons: { added: 0, changed: 0 }, questions: { added: 0, removed: 0, changed: 0 } };
    if (!a) return out;
    const val = (f) => D.content.factValue(f);
    b.facts.forEach((f, id) => {
      const o = a.facts.get(id);
      if (!o) out.facts.push({ id, new: val(f), unit: f.unit, label: f.label, added: true });
      else if (JSON.stringify(val(o)) !== JSON.stringify(val(f)) || JSON.stringify(o.changes || []) !== JSON.stringify(f.changes || [])) out.facts.push({ id, old: val(o), new: val(f), unit: f.unit, label: f.label, changes: f.changes });
    });
    b.offences.forEach((f, id) => {
      const o = a.offences.get(id);
      if (!o) out.offences.push({ id, title: f.title, fine: f.fine, points: f.points, added: true });
      else if (o.fine !== f.fine || o.points !== f.points) out.offences.push({ id, title: f.title, oldFine: o.fine, fine: f.fine, oldPoints: o.points, points: f.points });
    });
    const sa = a.signByNum, sb = b.signByNum;
    sb.forEach((s, n) => { if (!sa.has(n)) out.signs.added.push(n); else if (JSON.stringify(sa.get(n)) !== JSON.stringify(s)) out.signs.changed.push(n); });
    sa.forEach((s, n) => { if (!sb.has(n)) out.signs.removed.push(n); });
    Object.keys(b.text).forEach((l) => {
      const ta = a.text[l], tb = b.text[l];
      if (!ta) { out.lessons.added += tb.lessonById.size; out.questions.added += tb.questions.length; return; }
      tb.lessonById.forEach((ls, id) => { const o = ta.lessonById.get(id); if (!o) out.lessons.added++; else if (o.body !== ls.body || o.title !== ls.title) out.lessons.changed++; });
      tb.qById.forEach((q, id) => { const o = ta.qById.get(id); if (!o) out.questions.added++; else if (JSON.stringify(o.options) !== JSON.stringify(q.options) || o.q !== q.q || o.answer !== q.answer) out.questions.changed++; });
      ta.qById.forEach((q, id) => { if (!tb.qById.has(id)) out.questions.removed++; });
    });
    return out;
  };

  // look for an update on start, at most every checkEveryHours
  U.autoCheck = async () => {
    try {
      if (!D.settings.autoUpdate || !navigator.onLine) return;
      const j = D.config.jurisdictions[D.data.jur];
      if (!j.updateUrl) return;
      const last = state.lastCheck ? Date.parse(state.lastCheck) : 0;
      if (Date.now() - last < (j.checkEveryHours || 24) * 3600e3) return;
      const found = await U.check();
      if (found.available) { U.pending = found; D.emit('update-available', found); }
    } catch (e) { /* offline or server down: try again next start */ }
  };
})(globalThis.Drive = globalThis.Drive || {});
