/* The Puzzle Cabinet · quips.js — the Sphinx's remarks, and a few sounds. */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  C.quips = {
    solve: [
      'The Sphinx nods slowly. From her, that is a standing ovation.',
      'Solved! Somewhere a puzzle-maker quietly puts down his pencil.',
      'Eureka! Running down the street in a towel is optional.',
      'Neat. Very neat. Suspiciously neat.',
      'That one had your name on it.',
      'The pieces agree with you. So does the Sphinx.',
      'Solved, and not a single match was harmed.',
      'Your brain just did a little victory lap.',
      'Elegant. Put that one in the cabinet of good ideas.',
      'The riddle is answered and nobody got eaten. A good day.',
      'Three thousand years of puzzlers would shake your hand.',
      'Done! You may now look smug for up to five minutes.',
      'Q.E.D., as the Greeks liked to say when they felt pleased with themselves.',
      'Well reasoned. The Sphinx scratches your name into the stone.'
    ],
    perfect: [
      'And in the fewest moves possible. Show-off.',
      'Not a move wasted. Machines take notes on you.',
      'Minimum moves! The Sphinx raises an eyebrow, which is a lot of stone to lift.'
    ],
    wrong: [
      'Not yet. The Sphinx is patient; she has been waiting since the Bronze Age.',
      'Close, but the universe politely disagrees.',
      'Hmm. The pieces are not convinced.',
      'Not quite. Try looking at it upside down. Or sideways. Or from Tuesday.',
      'A fine attempt, just not the right one.',
      'The Sphinx taps her claw. Gently. Mostly.',
      'Almost. Puzzles are like jam jars: the lid gives on the next try.',
      'That is an answer. It is not the answer.'
    ],
    hint: [
      'A whisper from the Sphinx:',
      'Psst… don\'t tell anyone I told you:',
      'Here is a thread to pull:',
      'A small push in the right direction:',
      'Look over here:',
      'Between you and me:'
    ],
    noHints: [
      'The Sphinx has no more hints for this one. Only the answer is left.',
      'That was the last hint. From here on it is you and the puzzle.'
    ],
    reveal: [
      'The Sphinx sighs and turns over the answer card.',
      'Here is how it goes. Next time, you will get it first.',
      'Looking at the answer is also a way to learn. Every puzzler keeps a drawer of peeked answers.'
    ],
    welcome: [
      'Three thousand years of puzzles, and the kettle is on.',
      'Pick a drawer. Every drawer has something that bites.',
      'Puzzles are the gym of the mind. No sweat, only the occasional groan.',
      'The Sphinx is in a good mood today. Probably.'
    ]
  };

  C.quip = function (kind, seed) {
    const list = C.quips[kind] || [''];
    const i = seed == null ? Math.floor(Math.random() * list.length) : Math.abs(seed) % list.length;
    return list[i];
  };

  /* ---------- tiny synthesized sounds (off in settings) ---------- */

  let ac = null;
  function actx() {
    if (!ac) {
      const A = root.AudioContext || root.webkitAudioContext;
      if (!A) return null;
      ac = new A();
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tone(freq, t0, dur, type, vol, slide) {
    const a = actx();
    if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, a.currentTime + t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, a.currentTime + t0 + dur);
    g.gain.setValueAtTime(0.0001, a.currentTime + t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, a.currentTime + t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(a.currentTime + t0);
    o.stop(a.currentTime + t0 + dur + 0.02);
  }
  function noise(t0, dur, vol, hp) {
    const a = actx();
    if (!a) return;
    const n = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = a.createBufferSource(), g = a.createGain(), f = a.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = hp || 1500;
    s.buffer = buf; g.gain.value = vol || 0.05;
    s.connect(f).connect(g).connect(a.destination);
    s.start(a.currentTime + t0);
  }

  C.sfx = function (name) {
    if (!C.settings || !C.settings.sound) return;
    try {
      switch (name) {
        case 'snap': tone(880, 0, 0.05, 'triangle', 0.05); break;
        case 'tap': tone(620, 0, 0.04, 'sine', 0.04); break;
        case 'cut': noise(0, 0.12, 0.06, 2500); break;
        case 'fold': noise(0, 0.22, 0.035, 700); break;
        case 'pour': for (let i = 0; i < 5; i++) tone(300 + Math.random() * 500, i * 0.05, 0.06, 'sine', 0.03); break;
        case 'hint': tone(660, 0, 0.12, 'sine', 0.05); tone(990, 0.08, 0.18, 'sine', 0.04); break;
        case 'wrong': tone(220, 0, 0.18, 'square', 0.025, 150); break;
        case 'solve': [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.32, 'triangle', 0.06)); break;
        case 'reveal': tone(440, 0, 0.3, 'sine', 0.04, 330); break;
        default: tone(700, 0, 0.05, 'sine', 0.03);
      }
    } catch (e) { /* no sound is fine */ }
  };
})(typeof window !== 'undefined' ? window : globalThis);
