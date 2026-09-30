/* The Puzzle Cabinet · js/lib/ciphers.js
 *
 * The codes and ciphers behind engines/codes.js, with no page code: the
 * tables (Morse, Braille, semaphore, pigpen, Polybius, Bacon), the rules to
 * encipher and decipher, the short public-domain texts used for book codes,
 * a small vocabulary with message patterns for endless play, and a reader
 * that tells a real message from gibberish (to prove a hidden key can be found).
 *
 *   Cabinet.Ciphers.model(d)        the units, slots and cipher of a puzzle's data
 *   Cabinet.Ciphers.makeMessage(rng, lo, hi, opts)
 *   Cabinet.Ciphers.readable(text)  can the letters be split into known words?
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /* ---------- small helpers ---------- */

  const letters = (s) => String(s || '').toUpperCase().replace(/[^A-Z]/g, '');
  const mod = (a, n) => ((a % n) + n) % n;
  const idx = (ch) => ch.charCodeAt(0) - 65;
  // the message as words of letters (punctuation dropped, apostrophes closed up)
  const wordsOf = (s) => String(s || '').toUpperCase().replace(/'/g, '').split(/[^A-Z]+/).filter(Boolean);

  /* ---------- the tables ---------- */

  const MORSE = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..'
  };
  const MORSE_BACK = {};
  Object.keys(MORSE).forEach((k) => { MORSE_BACK[MORSE[k]] = k; });

  // Braille: dots 1-2-3 down the left column, 4-5-6 down the right
  const BRAILLE = {
    A: '1', B: '12', C: '14', D: '145', E: '15', F: '124', G: '1245', H: '125', I: '24', J: '245',
    K: '13', L: '123', M: '134', N: '1345', O: '135', P: '1234', Q: '12345', R: '1235', S: '234', T: '2345',
    U: '136', V: '1236', W: '2456', X: '1346', Y: '13456', Z: '1356'
  };

  // flag semaphore, as the watcher sees the signaller: the two flag directions
  // (S = straight down, then clockwise: SW, W, NW, N, NE, E, SE)
  const SEMA = {
    A: 'S SW', B: 'S W', C: 'S NW', D: 'S N', E: 'S NE', F: 'S E', G: 'S SE',
    H: 'SW W', I: 'SW NW', J: 'N E', K: 'SW N', L: 'SW NE', M: 'SW E', N: 'SW SE',
    O: 'W NW', P: 'W N', Q: 'W NE', R: 'W E', S: 'W SE',
    T: 'NW N', U: 'NW NE', V: 'N SE', W: 'NE E', X: 'NE SE', Y: 'NW E', Z: 'SE E'
  };
  // the angle of each direction in degrees, measured clockwise from straight up (screen: y down)
  const DIR = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };

  // pigpen (one common version): A-I in a noughts-and-crosses grid, J-R in a grid with dots,
  // S-V in an X (top, left, right, bottom), W-Z in an X with dots
  const PIGPEN = {};
  'ABCDEFGHI'.split('').forEach((ch, i) => { PIGPEN[ch] = { g: 'sq', r: Math.floor(i / 3), c: i % 3, dot: false }; });
  'JKLMNOPQR'.split('').forEach((ch, i) => { PIGPEN[ch] = { g: 'sq', r: Math.floor(i / 3), c: i % 3, dot: true }; });
  'STUV'.split('').forEach((ch, i) => { PIGPEN[ch] = { g: 'x', w: ['top', 'left', 'right', 'bottom'][i], dot: false }; });
  'WXYZ'.split('').forEach((ch, i) => { PIGPEN[ch] = { g: 'x', w: ['top', 'left', 'right', 'bottom'][i], dot: true }; });

  // Bacon's biliteral alphabet of 24 letters (I and J share, and so do U and V)
  const BACON_AZ = 'ABCDEFGHIKLMNOPQRSTUWXYZ';
  const BACON = {};
  BACON_AZ.split('').forEach((ch, i) => {
    let s = '';
    for (let b = 4; b >= 0; b--) s += (i >> b) & 1 ? 'B' : 'A';
    BACON[ch] = s;
  });
  BACON.J = BACON.I; BACON.V = BACON.U;
  const BACON_BACK = {};
  BACON_AZ.split('').forEach((ch) => { BACON_BACK[BACON[ch]] = ch; });
  const baconNorm = (s) => letters(s).replace(/J/g, 'I').replace(/V/g, 'U');

  // the Polybius square: 5 x 5, I and J share a cell; a keyword may be written in first
  function polySquare(keyword) {
    const seen = new Set();
    let out = '';
    (letters(keyword) + 'ABCDEFGHIKLMNOPQRSTUVWXYZ').replace(/J/g, 'I').split('').forEach((ch) => {
      if (!seen.has(ch)) { seen.add(ch); out += ch; }
    });
    return out; // 25 letters, row by row
  }

  /* ---------- the rules ---------- */

  function caesar(text, shift) {
    return String(text).toUpperCase().replace(/[A-Z]/g, (ch) => AZ[mod(idx(ch) + shift, 26)]);
  }
  function atbash(text) {
    return String(text).toUpperCase().replace(/[A-Z]/g, (ch) => AZ[25 - idx(ch)]);
  }
  // Vigenère: the keyword runs along the letters only (spaces and marks do not use it up)
  function vigenere(text, key, back) {
    const k = letters(key);
    let n = 0;
    return String(text).toUpperCase().replace(/[A-Z]/g, (ch) => {
      const s = idx(k[n++ % k.length]);
      return AZ[mod(idx(ch) + (back ? -s : s), 26)];
    });
  }
  // the rail (0-based) of each position on a fence of r rails
  function railOf(i, r) {
    if (r < 2) return 0;
    const cyc = 2 * (r - 1), m = i % cyc;
    return m < r ? m : cyc - m;
  }
  function railEncode(s, r) {
    const rails = Array.from({ length: r }, () => '');
    for (let i = 0; i < s.length; i++) rails[railOf(i, r)] += s[i];
    return rails.join('');
  }
  function railDecode(s, r) {
    const n = s.length, order = [];
    for (let k = 0; k < r; k++) for (let i = 0; i < n; i++) if (railOf(i, r) === k) order.push(i);
    const out = new Array(n);
    order.forEach((pos, j) => { out[pos] = s[j]; });
    return out.join('');
  }
  // the scytale: k letters go round the rod in one turn; the message is written along the rod
  function scytaleDims(len, k) { const m = Math.ceil(len / k); return { k, m, n: k * m }; }
  function scytaleEncode(s, k, pad) {
    const { m, n } = scytaleDims(s.length, k);
    const full = (s + (pad || 'X').repeat(n)).slice(0, n);
    let out = '';
    for (let t = 0; t < m; t++) for (let f = 0; f < k; f++) out += full[f * m + t];
    return out;
  }
  function scytaleDecode(s, k) {
    const m = Math.ceil(s.length / k);
    let out = '';
    for (let f = 0; f < k; f++) for (let t = 0; t < m; t++) out += s[t * k + f] || '';
    return out;
  }

  /* ---------- book codes: short public-domain texts, by lines ---------- */

  const BOOKS = {
    humpty: { title: 'Humpty Dumpty', by: 'a nursery rhyme', lines: [
      'Humpty Dumpty sat on a wall,',
      'Humpty Dumpty had a great fall.',
      'All the king\'s horses and all the king\'s men',
      'Couldn\'t put Humpty together again.'] },
    jack: { title: 'Jack and Jill', by: 'a nursery rhyme', lines: [
      'Jack and Jill went up the hill',
      'To fetch a pail of water.',
      'Jack fell down and broke his crown,',
      'And Jill came tumbling after.'] },
    lamb: { title: 'Mary\'s Lamb', by: 'Sarah Josepha Hale, 1830', lines: [
      'Mary had a little lamb,',
      'Its fleece was white as snow;',
      'And everywhere that Mary went',
      'The lamb was sure to go.'] },
    diddle: { title: 'Hey Diddle Diddle', by: 'a nursery rhyme', lines: [
      'Hey diddle diddle,',
      'The cat and the fiddle,',
      'The cow jumped over the moon;',
      'The little dog laughed',
      'To see such sport,',
      'And the dish ran away with the spoon.'] },
    star: { title: 'The Star', by: 'Jane Taylor, 1806', lines: [
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
      'Up above the world so high,',
      'Like a diamond in the sky.',
      'When the blazing sun is gone,',
      'When he nothing shines upon,',
      'Then you show your little light,',
      'Twinkle, twinkle, all the night.'] },
    genesis: { title: 'Genesis 1', by: 'the King James Bible, 1611', lines: [
      'In the beginning God created the heaven and the earth.',
      'And the earth was without form, and void;',
      'and darkness was upon the face of the deep.',
      'And the Spirit of God moved upon the face of the waters.',
      'And God said, Let there be light: and there was light.'] },
    psalm: { title: 'Psalm 23', by: 'the King James Bible, 1611', lines: [
      'The LORD is my shepherd; I shall not want.',
      'He maketh me to lie down in green pastures:',
      'he leadeth me beside the still waters.',
      'He restoreth my soul.'] },
    sonnet: { title: 'Sonnet 18', by: 'William Shakespeare, 1609', lines: [
      'Shall I compare thee to a summer\'s day?',
      'Thou art more lovely and more temperate:',
      'Rough winds do shake the darling buds of May,',
      'And summer\'s lease hath all too short a date;'] },
    hamlet: { title: 'Hamlet', by: 'William Shakespeare, about 1600', lines: [
      'To be, or not to be, that is the question:',
      'Whether \'tis nobler in the mind to suffer',
      'The slings and arrows of outrageous fortune,',
      'Or to take arms against a sea of troubles,',
      'And by opposing end them.'] },
    tyger: { title: 'The Tyger', by: 'William Blake, 1794', lines: [
      'Tyger Tyger, burning bright,',
      'In the forests of the night;',
      'What immortal hand or eye,',
      'Could frame thy fearful symmetry?'] },
    gettysburg: { title: 'The Gettysburg Address', by: 'Abraham Lincoln, 1863', lines: [
      'Four score and seven years ago our fathers',
      'brought forth on this continent, a new nation,',
      'conceived in Liberty, and dedicated to the',
      'proposition that all men are created equal.'] },
    jabber: { title: 'Jabberwocky', by: 'Lewis Carroll, 1871', lines: [
      '\'Twas brillig, and the slithy toves',
      'Did gyre and gimble in the wabe:',
      'All mimsy were the borogoves,',
      'And the mome raths outgrabe.'] },
    daffodils: { title: 'Daffodils', by: 'William Wordsworth, 1807', lines: [
      'I wandered lonely as a cloud',
      'That floats on high o\'er vales and hills,',
      'When all at once I saw a crowd,',
      'A host, of golden daffodils;'] }
  };

  // every word of a book with its place: { w (letters), line, word (in line), n (in the text), raw }
  const bookCache = {};
  function bookWords(id) {
    if (bookCache[id]) return bookCache[id];
    const b = BOOKS[id];
    if (!b) return null;
    const out = [];
    b.lines.forEach((ln, li) => {
      const raw = ln.split(/\s+/).filter((t) => /[A-Za-z]/.test(t));
      raw.forEach((t, wi) => out.push({ w: letters(t), raw: t, line: li + 1, word: wi + 1, n: out.length + 1 }));
    });
    return (bookCache[id] = out);
  }
  // a reference: 'n' (word number), 'lw' (line.word) or 'lwl' (line.word.letter)
  function bookRefText(ref, how) { return how === 'n' ? String(ref[0]) : ref.join('.'); }
  function bookLookup(id, ref, how) {
    const W = bookWords(id);
    if (!W) return null;
    let w = null;
    if (how === 'n') w = W[ref[0] - 1];
    else w = W.find((x) => x.line === ref[0] && x.word === ref[1]);
    if (!w) return null;
    if (how === 'lwl') return { w, ch: w.w[ref[2] - 1] || null };
    return { w, ch: w.w[0] };
  }
  // encipher: mode 'letter' (each reference gives one letter) or 'word' (each gives a whole word)
  function bookEncode(id, msg, how, mode, rng) {
    const W = bookWords(id);
    const pick = (list) => list[Math.floor((rng ? rng() : 0) * list.length)];
    const refOf = (w, li) => (how === 'n' ? [w.n] : how === 'lw' ? [w.line, w.word] : [w.line, w.word, li + 1]);
    const out = [];
    if (mode === 'word') {
      for (const word of wordsOf(msg)) {
        const c = W.filter((x) => x.w === word);
        if (!c.length) return null;
        out.push(refOf(pick(c)));
      }
      return out;
    }
    for (const ch of letters(msg)) {
      const c = [];
      if (how === 'lwl') W.forEach((x) => { for (let i = 0; i < x.w.length; i++) if (x.w[i] === ch) c.push([x, i]); });
      else W.forEach((x) => { if (x.w[0] === ch) c.push([x, 0]); });
      if (!c.length) return null;
      const [w, li] = pick(c);
      out.push(refOf(w, li));
    }
    return out;
  }
  function bookLetters(id, how) {
    const s = new Set();
    bookWords(id).forEach((x) => { if (how === 'lwl') x.w.split('').forEach((c) => s.add(c)); else s.add(x.w[0]); });
    return s;
  }

  /* ---------- the model: what the page shows and what the solver fills ---------- */

  const SUBST = new Set(['caesar', 'atbash', 'polybius', 'pigpen', 'morse', 'semaphore', 'braille', 'bacon']);
  const TRANS = new Set(['railfence', 'scytale']);
  const KEEP_PUNCT = new Set(['caesar', 'atbash', 'vigenere', 'polybius']);
  const CODES = ['caesar', 'atbash', 'polybius', 'pigpen', 'morse', 'semaphore', 'railfence', 'scytale', 'vigenere', 'book', 'braille', 'bacon'];

  /* model(d) -> {
   *   code, msg, plain (letters), tokens: [{ t: 'unit', slots: [i…], g: glyph, sig }, { t: 'gap' }, { t: 'punct', ch }],
   *   slots: [{ ans, unit, word }], words: [[slot…]], cipher (the cipher text for transpositions and Bacon's cover),
   *   err (when the data cannot be used)
   * } */
  function model(d) {
    const code = d.code;
    const out = { code, msg: String(d.msg || '').toUpperCase(), tokens: [], slots: [], words: [] };
    const msgWords = wordsOf(out.msg);
    out.plain = msgWords.join('');
    if (!out.plain) { out.err = 'empty message'; return out; }
    if (CODES.indexOf(code) < 0) { out.err = 'unknown code ' + code; return out; }
    // the answer slots, word by word
    msgWords.forEach((w, wi) => {
      const list = [];
      for (const ch of w) { list.push(out.slots.length); out.slots.push({ ans: code === 'bacon' ? baconNorm(ch) : ch, word: wi, unit: -1 }); }
      out.words.push(list);
    });
    const unit = (slots, g, sig) => {
      const u = { t: 'unit', slots, g, sig: sig == null ? null : String(sig) };
      slots.forEach((s) => { out.slots[s].unit = out.tokens.length; });
      out.tokens.push(u);
      return u;
    };
    if (code === 'railfence' || code === 'scytale' || (code === 'bacon' && d.cover)) {
      // the cipher is shown as a block of its own; the tokens are the answer slots only
      msgWords.forEach((w, wi) => {
        if (wi) out.tokens.push({ t: 'gap' });
        out.words[wi].forEach((s) => unit([s], null, null));
      });
      if (code === 'railfence') {
        const r = d.key | 0;
        if (r < 2 || r > 12) { out.err = 'rails must be 2..12'; return out; }
        out.cipher = railEncode(out.plain, r);
      } else if (code === 'scytale') {
        const k = d.key | 0;
        if (k < 2 || k > 12) { out.err = 'faces must be 2..12'; return out; }
        out.cipher = scytaleEncode(out.plain, k, d.pad || 'X');
      } else {
        const need = out.plain.length * 5;
        const cov = String(d.cover || '');
        const covLetters = letters(cov);
        if (covLetters.length < need) { out.err = 'the cover text has ' + covLetters.length + ' letters, ' + need + ' needed'; return out; }
        let bits = '';
        for (const ch of out.plain) bits += BACON[ch];
        out.cipher = cov;
        out.bits = bits + 'A'.repeat(covLetters.length - need);
      }
      return out;
    }
    // unit tokens with glyphs
    const plainText = out.msg;
    let si = 0; // slot index
    let wordNo = 0;
    let keyPos = 0;
    const key = code === 'vigenere' ? letters(d.key) : '';
    if (code === 'vigenere' && !key) { out.err = 'a keyword is needed'; return out; }
    const square = code === 'polybius' ? polySquare(d.key || '') : null;
    const refs = code === 'book' ? (d.refs || []) : null;
    if (code === 'book' && !BOOKS[d.book]) { out.err = 'unknown book ' + d.book; return out; }
    if (code === 'book' && d.mode === 'word') {
      if (refs.length !== msgWords.length) { out.err = 'one reference per word is needed'; return out; }
      msgWords.forEach((w, wi) => {
        if (wi) out.tokens.push({ t: 'gap' });
        const ref = refs[wi];
        unit(out.words[wi].slice(), { ref, txt: bookRefText(ref, d.how || 'n') }, 'r' + ref.join('.'));
      });
      return out;
    }
    let refI = 0;
    // walk the message text so punctuation can stay where it was
    const toks = plainText.replace(/'/g, '').split(/(\s+)/);
    let first = true;
    for (const tk of toks) {
      if (!tk || /^\s+$/.test(tk)) continue;
      if (!/[A-Z]/.test(tk)) { if (KEEP_PUNCT.has(code)) out.tokens.push({ t: 'punct', ch: tk }); continue; }
      if (!first) out.tokens.push({ t: 'gap' });
      first = false;
      for (const ch of tk) {
        if (!/[A-Z]/.test(ch)) { if (KEEP_PUNCT.has(code)) out.tokens.push({ t: 'punct', ch }); continue; }
        let g, sig;
        switch (code) {
          case 'caesar': g = { ch: caesar(ch, d.key | 0) }; sig = g.ch; break;
          case 'atbash': g = { ch: atbash(ch) }; sig = g.ch; break;
          case 'vigenere': { const k = key[keyPos % key.length]; keyPos++; g = { ch: vigenere(ch, k), k }; sig = null; break; }
          case 'polybius': { const p = square.indexOf(ch === 'J' ? 'I' : ch); g = { r: Math.floor(p / 5) + 1, c: p % 5 + 1 }; sig = g.r + '' + g.c; break; }
          case 'pigpen': g = { ch }; sig = ch; break; // drawn from the table
          case 'morse': g = { m: MORSE[ch] }; sig = g.m; break;
          case 'semaphore': g = { s: SEMA[ch] }; sig = ch; break;
          case 'braille': g = { b: BRAILLE[ch] }; sig = g.b; break;
          case 'bacon': g = { ab: BACON[ch] }; sig = g.ab; break;
          case 'book': {
            const ref = refs[refI++];
            if (!ref) { out.err = 'too few references'; return out; }
            g = { ref, txt: bookRefText(ref, d.how || 'n') };
            sig = 'r' + ref.join('.');
            break;
          }
          default: g = { ch }; sig = ch;
        }
        unit([si++], g, sig);
      }
      wordNo++;
    }
    if (code === 'book' && refI !== refs.length) { out.err = 'too many references'; return out; }
    return out;
  }

  // decode what the puzzle shows, with the key, the honest way (used by verify)
  function decode(d, M) {
    M = M || model(d);
    if (M.err) return null;
    const code = d.code;
    if (code === 'railfence') return railDecode(M.cipher, d.key | 0);
    if (code === 'scytale') return scytaleDecode(M.cipher, d.key | 0).slice(0, M.plain.length);
    if (code === 'bacon' && d.cover) {
      const cl = letters(d.cover);
      // which letters of the cover are in the second type: the engine draws them from bits
      let s = '';
      for (let i = 0; i + 5 <= M.plain.length * 5; i += 5) s += BACON_BACK[M.bits.slice(i, i + 5)] || '?';
      return cl.length ? s : null;
    }
    let s = '';
    for (const tk of M.tokens) {
      if (tk.t !== 'unit') continue;
      const g = tk.g;
      switch (code) {
        case 'caesar': s += caesar(g.ch, -(d.key | 0)); break;
        case 'atbash': s += atbash(g.ch); break;
        case 'vigenere': s += vigenere(g.ch, g.k, true); break;
        case 'polybius': s += polySquare(d.key || '')[(g.r - 1) * 5 + (g.c - 1)]; break;
        case 'pigpen': s += g.ch; break;
        case 'morse': s += MORSE_BACK[g.m] || '?'; break;
        case 'semaphore': s += Object.keys(SEMA).find((k) => SEMA[k] === g.s) || '?'; break;
        case 'braille': s += Object.keys(BRAILLE).find((k) => BRAILLE[k] === g.b) || '?'; break;
        case 'bacon': s += BACON_BACK[g.ab] || '?'; break;
        case 'book': {
          const how = d.how || 'n';
          const r = bookLookup(d.book, g.ref, how);
          if (!r) return null;
          s += d.mode === 'word' ? r.w.w : r.ch;
          break;
        }
        default: s += '?';
      }
    }
    return s;
  }

  // compare a typed answer with the message (letters only; Bacon: I = J, U = V; Polybius: I = J)
  function norm(code, s) {
    if (code === 'bacon') return baconNorm(s);
    if (code === 'polybius') return letters(s).replace(/J/g, 'I');
    return letters(s);
  }
  function same(code, a, b) { return norm(code, a) === norm(code, b); }
  // one typed letter against the letter wanted
  function eqLetter(code, typed, want) { return !!typed && norm(code, typed) === norm(code, want); }

  /* ---------- a vocabulary and message patterns ---------- */

  const V = {
    place: 'MILL BRIDGE HARBOUR LIBRARY STATION CHAPEL MARKET LIGHTHOUSE BAKERY GARDEN FOUNTAIN CASTLE TOWER MUSEUM THEATRE BOATHOUSE ORCHARD WINDMILL STABLES PIER INN FERRY QUAY OBSERVATORY GREENHOUSE BANDSTAND',
    time: 'NOON MIDNIGHT DAWN DUSK SIX SEVEN EIGHT NINE TEN ELEVEN TWO THREE FOUR FIVE',
    day: 'MONDAY TUESDAY WEDNESDAY THURSDAY FRIDAY SATURDAY SUNDAY',
    thing: 'KEY MAP BOOK LETTER RING CROWN LANTERN COMPASS LOCKET SCROLL COIN FEATHER MIRROR VIOLIN TEAPOT UMBRELLA TELESCOPE DIARY PARCEL MEDAL',
    container: 'BOX CHEST DRAWER BOOT CUPBOARD BARREL BASKET PIANO VASE SUITCASE HATBOX TEAPOT KETTLE',
    furniture: 'BED RUG STAIRS PIANO TABLE SOFA DOORMAT BOOKCASE WARDROBE FLOORBOARDS',
    prep: 'UNDER BEHIND BENEATH INSIDE',
    animal: 'OWL FOX CAT HORSE GOOSE BADGER RAVEN OTTER HERON TIGER EAGLE PARROT WHALE BEAR HARE MOUSE SWAN DUCK PIG DOG FROG ZEBRA WOLF',
    adj: 'OLD GREY SLEEPY CLEVER LITTLE BRAVE QUIET HUNGRY LAZY NOISY GOLDEN SILVER JOLLY',
    verb: 'SINGS SLEEPS DANCES HOWLS WAKES HUNTS FLIES SWIMS WAITS LAUGHS JUMPS',
    name: 'ALICE OSCAR MAX RUBY HUGO CLARA FELIX IVY JACK ZOE LEO NORA OTTO MAUD ELSA BRUNO VERA QUENTIN XAVIER YVONNE WALTER KATE',
    password: 'PELICAN MARMALADE BUTTERCUP THUNDER PUMPKIN NUTMEG PEPPERMINT GOOSEBERRY BISCUIT WALRUS HAZELNUT JELLYFISH ZEPPELIN KANGAROO QUIVER TOFFEE',
    number: 'TWO THREE FOUR FIVE SIX SEVEN EIGHT NINE TEN TWELVE TWENTY',
    dir: 'NORTH SOUTH EAST WEST',
    landmark: 'OAK WELL STATUE ROCK CHAPEL SCARECROW SUNDIAL WINDMILL LIGHTHOUSE',
    water: 'RIVER BROOK LAKE CANAL STREAM',
    colour: 'RED BLUE GREEN YELLOW BLACK WHITE PURPLE GOLDEN SILVER',
    plural: 'APPLES PIGEONS BISCUITS LANTERNS MAPS CANDLES BLANKETS ROPES BOATS HORSES SANDWICHES MARBLES',
    door: 'DOOR GATE CHEST VAULT SAFE CELLAR',
    path: 'PATH ROAD RIVER TRAIL LANE THREAD',
    calm: 'WELL QUIET CALM READY SAFE',
    person: 'BUTLER GARDENER BAKER CAPTAIN DUCHESS PROFESSOR COOK DRIVER'
  };
  const LIST = {};
  Object.keys(V).forEach((k) => { LIST[k] = V[k].split(' '); });

  const PATTERNS = [
    'MEET ME AT THE {place} AT {time}',
    'MEET AT THE {place} ON {day}',
    'THE {thing} IS {prep} THE {furniture}',
    'LOOK {prep} THE {furniture}',
    'BRING THE {thing} TO THE {place}',
    'HIDE THE {thing} IN THE {container}',
    'THE {adj} {animal} {verb} AT {time}',
    '{name} KNOWS THE SECRET',
    '{name} HAS THE {thing}',
    'THE PASSWORD IS {password}',
    'THE TREASURE IS {number} PACES {dir} OF THE {landmark}',
    'SEND {number} {plural} TO THE {place}',
    'WAIT FOR ME BY THE {place}',
    'DO NOT OPEN THE {container} UNTIL {day}',
    'THE {animal} WILL CROSS THE {water} AT {time}',
    'ALL IS {calm} AT THE {place}',
    'THE {thing} IS HIDDEN IN THE {container}',
    'RING THE BELL {number} TIMES',
    'THE {colour} KEY OPENS THE {door}',
    'FOLLOW THE {colour} {path}',
    'THE SHIP SAILS AT {time}',
    'LEAVE THE {thing} UNDER THE {landmark}',
    'THE {person} HAS THE {thing}',
    'DO NOT TRUST THE {person}',
    'ASK THE {person} ABOUT THE {thing}',
    'THE {animal} IS IN THE {place}',
    '{name} AND {name} MEET AT {time}',
    'CROSS THE {water} AT THE {place}',
    'THE {thing} IS AT THE {place}',
    'COUNT {number} STEPS FROM THE {landmark}',
    'THE {adj} {person} TOOK THE {thing}',
    'THE {thing} OPENS AT {time}'
  ];

  // traditional proverbs and sayings (public domain)
  const PROVERBS = [
    'A STITCH IN TIME SAVES NINE', 'LOOK BEFORE YOU LEAP', 'MANY HANDS MAKE LIGHT WORK',
    'THE EARLY BIRD CATCHES THE WORM', 'ALL THAT GLITTERS IS NOT GOLD', 'WHERE THERE IS A WILL THERE IS A WAY',
    'ACTIONS SPEAK LOUDER THAN WORDS', 'BETTER LATE THAN NEVER', 'TOO MANY COOKS SPOIL THE BROTH',
    'A BIRD IN THE HAND IS WORTH TWO IN THE BUSH', 'WHEN IN ROME DO AS THE ROMANS DO', 'FORTUNE FAVOURS THE BOLD',
    'HASTE MAKES WASTE', 'PRACTICE MAKES PERFECT', 'NO NEWS IS GOOD NEWS', 'SLOW AND STEADY WINS THE RACE',
    'EVERY CLOUD HAS A SILVER LINING', 'STILL WATERS RUN DEEP', 'ROME WAS NOT BUILT IN A DAY',
    'BIRDS OF A FEATHER FLOCK TOGETHER', 'TIME AND TIDE WAIT FOR NO MAN', 'HONESTY IS THE BEST POLICY',
    'CURIOSITY KILLED THE CAT', 'TWO HEADS ARE BETTER THAN ONE', 'MAKE HAY WHILE THE SUN SHINES',
    'THE PROOF OF THE PUDDING IS IN THE EATING', 'DO NOT COUNT YOUR CHICKENS BEFORE THEY HATCH',
    'LEAVE NO STONE UNTURNED', 'A PENNY SAVED IS A PENNY EARNED', 'OUT OF SIGHT OUT OF MIND',
    'ABSENCE MAKES THE HEART GROW FONDER', 'EASY COME EASY GO', 'TRUTH WILL OUT',
    'KNOWLEDGE IS POWER', 'FIRST COME FIRST SERVED', 'WASTE NOT WANT NOT', 'SEEING IS BELIEVING',
    'THE PEN IS MIGHTIER THAN THE SWORD', 'LAUGHTER IS THE BEST MEDICINE', 'GREAT MINDS THINK ALIKE',
    'BEAUTY IS IN THE EYE OF THE BEHOLDER', 'DO NOT JUDGE A BOOK BY ITS COVER', 'NECESSITY IS THE MOTHER OF INVENTION',
    'AN APPLE A DAY KEEPS THE DOCTOR AWAY', 'EVERY DOG HAS ITS DAY', 'LET SLEEPING DOGS LIE'
  ];

  // riddles whose answer can be hidden in a code: [question, answer]
  const RIDDLES = [
    ['What has keys but cannot open a single lock?', 'A PIANO'],
    ['What gets wetter the more it dries?', 'A TOWEL'],
    ['What has a neck but no head?', 'A BOTTLE'],
    ['What can go round the world while staying in a corner?', 'A STAMP'],
    ['The more of them you take, the more you leave behind. What are they?', 'FOOTSTEPS'],
    ['What has an eye but cannot see?', 'A NEEDLE'],
    ['What has plenty of teeth but never bites?', 'A COMB'],
    ['What goes up and never comes down?', 'YOUR AGE'],
    ['What runs all day but never walks?', 'A RIVER'],
    ['What has a head and a tail but no body?', 'A COIN'],
    ['Which building has the most stories?', 'A LIBRARY'],
    ['I am full of holes, yet I hold water. What am I?', 'A SPONGE'],
    ['What can you catch but never throw?', 'A COLD'],
    ['What has hands but can never clap?', 'A CLOCK'],
    ['What has to be broken before you can use it?', 'AN EGG'],
    ['What has words but never speaks?', 'A BOOK'],
    ['What has a bed but never sleeps?', 'A RIVER'],
    ['What has one eye and cannot see, and a mouth that never eats? It sails on the wind.', 'A STORM'],
    ['What belongs to you but other people use it more than you do?', 'YOUR NAME'],
    ['What has a thumb and four fingers but is not alive?', 'A GLOVE'],
    ['What comes down but never goes up?', 'RAIN'],
    ['What can fill a room but takes up no space?', 'LIGHT'],
    ['What is always in front of you but can never be seen?', 'THE FUTURE'],
    ['What kind of tree can you carry in your hand?', 'A PALM']
  ];

  // riddles whose one-word answer serves as a Vigenère keyword
  const KEY_RIDDLES = [
    ['What has keys but cannot open a single lock?', 'PIANO'],
    ['What has hands but can never clap?', 'CLOCK'],
    ['What has a neck but no head?', 'BOTTLE'],
    ['What gets wetter the more it dries?', 'TOWEL'],
    ['What has an eye but cannot see?', 'NEEDLE'],
    ['What has plenty of teeth but never bites?', 'COMB'],
    ['I am full of holes, yet I hold water. What am I?', 'SPONGE'],
    ['What has a thumb and four fingers but is not alive?', 'GLOVE'],
    ['What has words but never speaks?', 'BOOK'],
    ['What can go round the world while staying in a corner?', 'STAMP']
  ];

  // cover sentences for Bacon's cipher (our own, dull on purpose)
  const COVERS = [
    'Dear Aunt Mabel, the weather here has been lovely all week and the garden is full of roses.',
    'We walked along the river after lunch and watched the swans; the children fed them bread.',
    'Please remember to buy flour, sugar, butter and a dozen eggs, and do not forget the tea.',
    'The train was late again this morning, so I read my book on the platform in the sunshine.',
    'Uncle Harold says the apple harvest will be early this year, which pleases everybody.',
    'Our new kitten sleeps all day on the windowsill and plays with string all night long.',
    'I have planted beans, peas and carrots, and next spring I hope to try some pumpkins too.',
    'The village fete was a great success; the vicar won the prize for the largest marrow.',
    'Thank you for the kind letter and the recipe for plum jam, which we shall try on Sunday.',
    'It rained all afternoon, so we stayed indoors, mended the kite and played cards by the fire.'
  ];

  function fill(pattern, rng) {
    const used = {};
    return pattern.replace(/\{(\w+)\}/g, (m, k) => {
      let w, tries = 0;
      do { w = LIST[k][Math.floor(rng() * LIST[k].length)]; } while (used[w] && tries++ < 8);
      used[w] = 1;
      return w;
    });
  }

  /* a message with lo..hi letters: a pattern, a proverb or a riddle answer.
   * opts: { kinds: ['pattern', 'proverb'], allowed: Set of letters (book codes), no: Set of messages to avoid } */
  function makeMessage(rng, lo, hi, opts) {
    opts = opts || {};
    const kinds = opts.kinds || ['pattern', 'pattern', 'proverb'];
    for (let t = 0; t < 400; t++) {
      const kind = kinds[Math.floor(rng() * kinds.length)];
      let msg, riddle = null;
      if (kind === 'proverb') msg = PROVERBS[Math.floor(rng() * PROVERBS.length)];
      else if (kind === 'riddle') { riddle = RIDDLES[Math.floor(rng() * RIDDLES.length)]; msg = riddle[1]; }
      else msg = fill(PATTERNS[Math.floor(rng() * PATTERNS.length)], rng);
      const n = letters(msg).length;
      if (n < lo || n > hi) continue;
      if (opts.allowed && letters(msg).split('').some((c) => !opts.allowed.has(c))) continue;
      if (opts.no && opts.no.has(msg)) continue;
      return { msg, kind, riddle };
    }
    return null;
  }

  /* ---------- reading: is this real English (from our vocabulary)? ---------- */

  let vocab = null;
  const SMALL = 'A I AN AT AS BE BY DO GO HE IF IN IS IT ME MY NO OF ON OR SO TO UP US WE THE AND ARE BUT FOR NOT YOU ALL ANY CAN HAS HAD HER HIS ITS ONE OUR OUT WAS WHO WHY HOW NOW NEW OLD TWO SEE SAY SHE THEY THEM THIS THAT WITH FROM HAVE WILL WHAT WHEN WHERE THERE THEIR BEEN WERE YOUR INTO THAN THEN ONLY OVER SOME TIME ABOUT UNTIL ME TIMES';
  function vocabulary() {
    if (vocab) return vocab;
    vocab = new Set(SMALL.split(' '));
    Object.keys(LIST).forEach((k) => LIST[k].forEach((w) => vocab.add(w)));
    PATTERNS.forEach((p) => wordsOf(p.replace(/\{\w+\}/g, ' ')).forEach((w) => vocab.add(w)));
    PROVERBS.concat(RIDDLES.map((r) => r[1])).forEach((p) => wordsOf(p).forEach((w) => vocab.add(w)));
    Object.keys(BOOKS).forEach((b) => bookWords(b).forEach((x) => vocab.add(x.w)));
    if (C.words && C.words.list) for (let n = 3; n <= 7; n++) C.words.list(n).forEach((w) => vocab.add(w.toUpperCase()));
    return vocab;
  }
  // can the letters be cut into known words? (extra: more words to know)
  function readable(text, extra) {
    const s = letters(text);
    const V2 = vocabulary();
    const ok = new Uint8Array(s.length + 1);
    ok[0] = 1;
    for (let i = 1; i <= s.length; i++) {
      for (let j = Math.max(0, i - 16); j < i && !ok[i]; j++) {
        if (!ok[j]) continue;
        const w = s.slice(j, i);
        // one-letter words only as A and I, and never two one-letter words in a row
        if (w.length === 1 && w !== 'A' && w !== 'I') continue;
        if (V2.has(w) || (extra && extra.has(w))) ok[i] = 1;
      }
    }
    return !!ok[s.length];
  }
  // every word (with its spaces kept) is a known word
  function wordsKnown(text, extra) {
    const V2 = vocabulary();
    return wordsOf(text).every((w) => V2.has(w) || (extra && extra.has(w)));
  }

  C.Ciphers = {
    AZ, MORSE, MORSE_BACK, BRAILLE, SEMA, DIR, PIGPEN, BACON, BACON_AZ, BACON_BACK, BOOKS, CODES, SUBST, TRANS,
    letters, wordsOf, mod, caesar, atbash, vigenere, railOf, railEncode, railDecode,
    scytaleEncode, scytaleDecode, scytaleDims, polySquare, baconNorm,
    bookWords, bookLookup, bookEncode, bookLetters, bookRefText,
    model, decode, same, norm, eqLetter, makeMessage, readable, wordsKnown, vocabulary,
    LIST, PATTERNS, PROVERBS, RIDDLES, KEY_RIDDLES, COVERS
  };
})(typeof window !== 'undefined' ? window : globalThis);
