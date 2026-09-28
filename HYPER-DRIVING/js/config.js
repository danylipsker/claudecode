/* Hyper Driving · config.js — what a build of the app is: its name, the
 * jurisdictions it carries, where each one looks for content updates and which
 * keys it trusts to sign them.
 *
 * Everything a transport authority changes (laws, numbers, fines, texts, signs,
 * questions, diagrams) lives in the content packs under content/<jurisdiction>/,
 * never here. This file changes only when the app itself is rebuilt.
 */
(function (D) {
  'use strict';

  D.config = {
    app: 'Hyper Driving',
    appVersion: '0.1.0',
    contentFormat: 1,               // the pack format this build understands (manifest.format)

    // the languages the interface speaks; a pack may carry fewer or more
    languages: {
      he: { name: 'עברית', dir: 'rtl', locale: 'he-IL' },
      en: { name: 'English', dir: 'ltr', locale: 'en-GB' }
    },

    defaultJurisdiction: 'il',

    jurisdictions: {
      il: {
        name: { he: 'ישראל', en: 'Israel' },
        // the pack that ships inside the app (always available offline)
        bundled: 'content/il/',
        // where published updates are checked for. null = updates only by file
        // (Settings → Updates → "load an update file"), which is how a
        // transport authority tests a pack before it goes live.
        updateUrl: null,
        // public keys (JWK, ECDSA P-256) allowed to sign this jurisdiction's
        // manifests; made with tools/keygen.js. An empty list lets unsigned
        // updates in only when the reader has turned on editor mode.
        trustedKeys: [],
        // how often the app looks for an update on its own (hours)
        checkEveryHours: 24
      }
    },

    storagePrefix: 'drive:'
  };
})(globalThis.Drive = globalThis.Drive || {});
