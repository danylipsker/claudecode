#!/usr/bin/env node
/* Hyper Driving · tools/publish.js — builds a content pack's manifest, and
 * signs and publishes packs.
 *
 *   node tools/publish.js                         rewrite content/il/manifest.json (file list + hashes)
 *   node tools/publish.js --pack content/il --bump
 *                                                 same, with a new version number (YYYY.MM.DD-N)
 *   node tools/publish.js --pack content/il --key keys/il.private.jwk --out dist/il --bump
 *                                                 a signed release: copies the files and a signed
 *                                                 manifest to dist/il, ready for any web server
 *   node tools/publish.js --bundle update-il-2026.10.01-1.json --key keys/il.private.jwk --out dist/il
 *                                                 an update exported from the in-app editor → signed release
 *   node tools/publish.js --bundle <file> --key <key> --out-bundle signed.json
 *                                                 the same, as one signed update file (Updates → "Load an update file")
 *
 * Hashes are SHA-256 over canonical JSON (keys sorted, no spaces) — the same
 * function as js/update.js — so they do not depend on formatting. Signatures
 * are ECDSA P-256 / SHA-256 in IEEE P1363 form (what WebCrypto verifies).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf('--' + k); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : null; };
const ROOT = path.resolve(__dirname, '..');

const canon = (v) => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  return '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
};
const sha = (obj) => crypto.createHash('sha256').update(canon(obj), 'utf8').digest('hex');

function describePath(p) {
  let m = p.match(/^([a-z]{2})\/(lessons|questions|trees)\/[^/]+\.json$/);
  if (m) return { path: p, role: m[2], lang: m[1] };
  m = p.match(/^([a-z]{2})\/ui\.json$/);
  if (m) return { path: p, role: 'ui', lang: m[1] };
  return { path: p, role: p.replace(/\.json$/, '').replace(/^.*\//, '') };
}

function listPack(dir) {
  const out = [];
  const walk = (d, rel) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(path.join(d, e.name), r);
      else if (e.name.endsWith('.json') && r !== 'manifest.json') out.push(r);
    }
  };
  walk(dir, '');
  return out;
}

function nextVersion(prev) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
  const p = String(prev || '');
  const seq = p.startsWith(today) ? (+(p.split('-')[1] || 0) + 1) : 1;
  return today + '-' + seq;
}

function sign(manifest, keyFile) {
  const jwk = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  const key = crypto.createPrivateKey({ key: jwk, format: 'jwk' });
  const body = Object.assign({}, manifest); delete body.signature;
  const sig = crypto.sign('sha256', Buffer.from(canon(body), 'utf8'), { key, dsaEncoding: 'ieee-p1363' });
  manifest.signature = { alg: 'ES256', kid: jwk.kid || null, sig: sig.toString('base64') };
  return manifest;
}

function build(files, base) {
  const entries = Object.keys(files).sort().map((p) => Object.assign(describePath(p), { sha256: sha(files[p]), bytes: Buffer.byteLength(JSON.stringify(files[p])) }));
  const m = Object.assign({}, base);
  m.format = m.format || 1;
  m.files = entries;
  delete m.signature;
  return m;
}

function writeOut(outDir, manifest, files) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const [p, obj] of Object.entries(files)) {
    const f = path.join(outDir, p);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, JSON.stringify(obj));
  }
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 1));
}

function main() {
  const key = opt('key');
  const out = opt('out');
  if (opt('bundle')) {
    const b = JSON.parse(fs.readFileSync(opt('bundle'), 'utf8'));
    let m = build(b.files, b.manifest);
    if (opt('bump')) m.version = nextVersion(m.version);
    if (key) m = sign(m, key);
    if (out) writeOut(path.resolve(out), m, b.files);
    if (opt('out-bundle')) fs.writeFileSync(opt('out-bundle'), JSON.stringify({ bundle: 1, manifest: m, files: b.files }));
    console.log(`bundle ${m.jurisdiction} ${m.version}: ${m.files.length} files${key ? ', signed' : ', NOT signed'}${out ? ' → ' + out : ''}`);
    return;
  }
  const packDir = path.resolve(ROOT, opt('pack') || 'content/il');
  const mfPath = path.join(packDir, 'manifest.json');
  const prev = fs.existsSync(mfPath) ? JSON.parse(fs.readFileSync(mfPath, 'utf8')) : {};
  const files = {};
  for (const p of listPack(packDir)) {
    try { files[p] = JSON.parse(fs.readFileSync(path.join(packDir, p), 'utf8')); }
    catch (e) { console.error('✗ ' + p + ': ' + e.message); process.exitCode = 1; return; }
  }
  const base = Object.assign({
    format: 1, jurisdiction: path.basename(packDir),
    name: { he: 'ישראל', en: 'Israel' },
    authority: { he: 'משרד התחבורה והבטיחות בדרכים', en: 'Ministry of Transport and Road Safety' },
    version: nextVersion(), published: new Date().toISOString().slice(0, 10),
    defaultLanguage: 'he', languages: ['he', 'en']
  }, prev);
  if (opt('bump')) { base.version = nextVersion(prev.version); base.published = new Date().toISOString().slice(0, 10); }
  let m = build(files, base);
  // keep the key order readable: metadata first, files last
  const { files: fl, ...meta } = m;
  m = Object.assign(meta, { files: fl });
  if (key) m = sign(m, key);
  if (out) writeOut(path.resolve(out), m, files);
  else fs.writeFileSync(mfPath, JSON.stringify(m, null, 1) + '\n');
  const bytes = m.files.reduce((a, f) => a + f.bytes, 0);
  console.log(`${m.jurisdiction} ${m.version}: ${m.files.length} files, ${(bytes / 1024).toFixed(0)} KB${key ? ', signed' : ''} → ${out || path.relative(process.cwd(), mfPath)}`);
}

module.exports = { canon, sha, describePath, listPack };
if (require.main === module) main();
