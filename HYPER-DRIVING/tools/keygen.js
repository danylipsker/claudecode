#!/usr/bin/env node
/* Hyper Driving · tools/keygen.js — makes the key pair an authority signs its
 * content packs with.
 *
 *   node tools/keygen.js il            → keys/il.private.jwk (keep it secret, never in the app or
 *                                         the repository) and prints the public key to paste into
 *                                         js/config.js → jurisdictions.il.trustedKeys
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const jur = process.argv[2] || 'il';
const kid = jur + '-' + new Date().toISOString().slice(0, 10);
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' });
const priv = Object.assign(privateKey.export({ format: 'jwk' }), { kid });
const pub = publicKey.export({ format: 'jwk' });
const dir = path.resolve(__dirname, '..', 'keys');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, jur + '.private.jwk');
if (fs.existsSync(file) && !process.argv.includes('--force')) { console.error(file + ' exists (use --force to replace it)'); process.exit(1); }
fs.writeFileSync(file, JSON.stringify(priv, null, 1), { mode: 0o600 });
console.log('private key: ' + file + '  (keep it offline; keys/ is git-ignored)');
console.log('add to js/config.js → jurisdictions.' + jur + '.trustedKeys:');
console.log(JSON.stringify({ kid, jwk: { kty: pub.kty, crv: pub.crv, x: pub.x, y: pub.y } }));
