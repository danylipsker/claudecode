/* HYPER-BIOLOGY · sims/diversity-methods.js — simulations for the diversity of life and for how biology is done.
 *   div-key       a dichotomous key game: identify specimens from their field notes by yes/no questions
 *                 (common animals, or the major groups of life)
 *   div-tree      the tree of life explorer: domains down to classes and orders, bars of named species,
 *                 traditional groups highlighted with a verdict — clade, or not?
 *   div-sampling  repeated samples from a population: the standard error shrinking as σ/√n, and confidence
 *                 intervals that cover the true mean 95 % of the time
 *   div-ttest     two groups, an effect and noise: Welch's t, the p-value, power, and the dance of p-values
 *   div-chisq     counts in categories (a woodlouse choice chamber or a pea cross): chi-square with kit.bio.chiSquare,
 *                 and the distribution of chi-square when the null hypothesis is true
 *   div-dilution  a serial dilution in tubes, with plate counts (colony-forming units) or a dye fading from the tubes
 *   div-standard  a spectrophotometer and a Beer–Lambert standard curve to fit by hand and by least squares
 * Student's t distribution (incomplete beta) and a few formatting helpers are written here, inside the IIFE.
 */
(function () {
  'use strict';

  /* ================================================================ shared helpers */
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const group = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const pow10 = e => '10' + String(e).split('').map(ch => SUP[ch] || ch).join('');
  // a number with about s significant figures, digits grouped when large
  function sig(v, s) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e4) return group(v);
    const d = Math.max(0, (s || 3) - 1 - Math.floor(Math.log10(a)));
    return v.toFixed(Math.min(6, d));
  }
  // scientific notation with a superscript exponent: 1.56 × 10⁹
  function sci(v, s) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(v)));
    if (e >= -2 && e <= 3) return sig(v, s || 3);
    let m = (v / Math.pow(10, e)).toPrecision(s || 3);
    if (Math.abs(+m) >= 10) { e++; m = (v / Math.pow(10, e)).toPrecision(s || 3); }
    return m + ' × ' + pow10(e);
  }
  const fmtP = p => !Number.isFinite(p) ? '—' : p < 0.0001 ? '< 0.0001' : p < 0.01 ? p.toFixed(4) : p.toFixed(3);
  let fontFam = null;
  const FONT = () => fontFam || (fontFam = (document.body && getComputedStyle(document.body).fontFamily) || 'sans-serif');
  function text(c, s, x, y, o) {
    o = o || {};
    c.font = (o.weight || 400) + ' ' + (o.size || 12) + 'px ' + FONT();
    c.textAlign = o.align || 'left';
    c.textBaseline = o.base || 'middle';
    if (o.halo) { c.lineWidth = 3; c.lineJoin = 'round'; c.strokeStyle = o.halo; c.strokeText(s, x, y); }
    c.fillStyle = o.color || '#888';
    c.fillText(s, x, y);
  }
  // split text into lines no wider than maxW at the current font
  function wrap(c, s, maxW, size, weight) {
    c.font = (weight || 400) + ' ' + (size || 12) + 'px ' + FONT();
    const words = String(s).split(' '), lines = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (line && c.measureText(t).width > maxW) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }
  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
  }
  const inside = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;

  /* ---------------------------------------------------------------- statistics */
  // continued fraction for the regularised incomplete beta function (Lentz's method)
  function betacf(a, b, x) {
    const FP = 1e-300, qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FP) d = FP;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FP) d = FP;
      c = 1 + aa / c; if (Math.abs(c) < FP) c = FP;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FP) d = FP;
      c = 1 + aa / c; if (Math.abs(c) < FP) c = FP;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 3e-14) break;
    }
    return h;
  }
  function ibeta(x, a, b, lg) {
    if (!(x > 0)) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lg(a + b) - lg(a) - lg(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  // two-sided p-value of Student's t with df degrees of freedom
  const tP2 = (t, df, lg) => Number.isFinite(t) ? ibeta(df / (df + t * t), df / 2, 0.5, lg) : 0;
  // the critical |t| for a two-sided level alpha
  function tCrit(alpha, df, lg) {
    let lo = 0, hi = 700;
    for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; if (tP2(m, df, lg) > alpha) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  const tDens = (t, df, lg) => Math.exp(lg((df + 1) / 2) - lg(df / 2) - 0.5 * Math.log(df * Math.PI) - (df + 1) / 2 * Math.log(1 + t * t / df));
  const chiDens = (x, k, lg) => x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - lg(k / 2));
  function chiCrit(alpha, df, B) {
    let lo = 0, hi = 300;
    for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; if (B.chiP(m, df) > alpha) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  // standard normal distribution function (Abramowitz–Stegun 7.1.26, error below 1e-7)
  function ncdf(z) {
    const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
    const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
  }
  // standard normal draws from a seeded uniform source (Box–Muller)
  function normals(R) {
    let spare = null;
    return () => {
      if (spare != null) { const s = spare; spare = null; return s; }
      let u = R(); while (u <= 1e-12) u = R();
      const v = R(), r = Math.sqrt(-2 * Math.log(u));
      spare = r * Math.sin(2 * Math.PI * v);
      return r * Math.cos(2 * Math.PI * v);
    };
  }
  function poisson(lam, R, gauss) {
    if (!(lam > 0)) return 0;
    if (lam < 40) { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= R(); } while (p > L); return k - 1; }
    return Math.max(0, Math.round(lam + Math.sqrt(lam) * gauss()));
  }
  function shuffle(a, R) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function meanSd(xs) {
    const n = xs.length;
    if (!n) return { m: 0, s: 0 };
    const m = xs.reduce((a, b) => a + b, 0) / n;
    const s = n > 1 ? Math.sqrt(xs.reduce((a, x) => a + (x - m) * (x - m), 0) / (n - 1)) : 0;
    return { m, s };
  }

  /* ================================================================ div-key */
  const KEYS = {
    animals: {
      start: 'q1',
      nodes: {
        q1: { q: 'Does it have a backbone — an internal skeleton of bone or cartilage?', s: 'backbone?', yes: 'q10', no: 'q2' },
        q2: { q: 'Does it have jointed legs?', s: 'jointed legs?', yes: 'q3', no: 'q7' },
        q3: { q: 'Does it have exactly six legs?', s: 'six legs?', yes: 'q4', no: 'q5' },
        q4: { q: 'Are the front wings hardened into cases that cover the hind wings?', s: 'hard fore-wings?', yes: 'beetle', no: 'q4b' },
        q4b: { q: 'Are the wings covered in tiny coloured scales?', s: 'scaly wings?', yes: 'butterfly', no: 'q4c' },
        q4c: { q: 'Does it have only one pair of wings?', s: 'one pair of wings?', yes: 'housefly', no: 'honeybee' },
        q5: { q: 'Does it have eight legs?', s: 'eight legs?', yes: 'q6', no: 'q5b' },
        q6: { q: 'Is the body in two parts joined by a narrow waist, and does it spin silk?', s: 'waist and silk?', yes: 'spider', no: 'harvestman' },
        q5b: { q: 'Is its body long and made of many similar segments, with more than 20 legs in all?', s: 'over 20 legs?', yes: 'q5c', no: 'q5d' },
        q5c: { q: 'Are there two pairs of legs on most of its segments?', s: '2 pairs per segment?', yes: 'millipede', no: 'centipede' },
        q5d: { q: 'Does it have ten legs, the front pair ending in large pincers?', s: 'pincers?', yes: 'crab', no: 'woodlouse' },
        q7: { q: 'Does it have a soft, unsegmented body that glides on a muscular foot or grips with suckered arms?', s: 'foot or suckers?', yes: 'q8', no: 'q9' },
        q8: { q: 'Does it carry a coiled shell?', s: 'coiled shell?', yes: 'snail', no: 'q8b' },
        q8b: { q: 'Does it have eight arms with suckers?', s: 'eight arms?', yes: 'octopus', no: 'slug' },
        q9: { q: 'Is its body a long tube divided into ring-like segments?', s: 'ringed tube?', yes: 'earthworm', no: 'q9b' },
        q9b: { q: 'Does it have five arms around a central disc, with tube feet underneath?', s: 'five arms?', yes: 'starfish', no: 'q9c' },
        q9c: { q: 'Is it a soft, floating bell with stinging tentacles?', s: 'bell, tentacles?', yes: 'jellyfish', no: 'sponge' },
        q10: { q: 'Does it have fins, and breathe with gills all its life?', s: 'fins and gills?', yes: 'q11', no: 'q12' },
        q11: { q: 'Is its skeleton made of cartilage, with five to seven separate gill slits on each side?', s: 'cartilage?', yes: 'shark', no: 'salmon' },
        q12: { q: 'Does it have feathers?', s: 'feathers?', yes: 'q13', no: 'q14' },
        q13: { q: 'Can it fly?', s: 'flies?', yes: 'robin', no: 'penguin' },
        q14: { q: 'Does it have hair, and do the females feed their young on milk?', s: 'hair and milk?', yes: 'q15', no: 'q16' },
        q15: { q: 'Are its front limbs wings made of skin?', s: 'skin wings?', yes: 'bat', no: 'q15b' },
        q15b: { q: 'Does it live all its life in water, with flippers and a blowhole?', s: 'blowhole?', yes: 'dolphin', no: 'mouse' },
        q16: { q: 'Is its skin dry and covered with scales?', s: 'dry scales?', yes: 'q17', no: 'frog' },
        q17: { q: 'Does it have legs?', s: 'legs?', yes: 'lizard', no: 'snake' }
      },
      leaves: {
        beetle: { name: 'Beetle', group: 'Arthropoda › Insecta › Coleoptera', notes: 'Found under loose bark. Body 8 mm long, in three parts; six jointed legs; two antennae. Its back is covered by two shiny, hard cases that meet in a straight line; it lifts them to unfold a pair of thin wings for flight.', fact: 'About 390 000 species of beetle are named — roughly one named animal in four.' },
        butterfly: { name: 'Butterfly', group: 'Arthropoda › Insecta › Lepidoptera', notes: 'Visiting garden flowers. Six thin jointed legs, a coiled tongue and clubbed antennae. Two pairs of broad, brightly patterned wings; touching them leaves a coloured dust of tiny scales on your finger.', fact: 'Butterflies and moths number about 160 000 species; the caterpillar and the adult lead entirely different lives.' },
        housefly: { name: 'Housefly', group: 'Arthropoda › Insecta › Diptera', notes: 'On a kitchen window. Six jointed legs, large red compound eyes, short antennae. A single pair of clear wings; behind them two tiny knobbed stalks that wobble in flight.', fact: 'True flies turned their hind wings into those knobs, the halteres — gyroscopes that steady their flight.' },
        honeybee: { name: 'Honeybee', group: 'Arthropoda › Insecta › Hymenoptera', notes: 'On lavender, with yellow pollen packed on its hind legs. Six jointed legs, a narrow waist, a hairy striped body. Two pairs of clear wings that hook together in flight; a sting at the tip of the abdomen.', fact: 'Ants, bees and wasps: about 150 000 species. Honeybees tell nestmates where flowers are by dancing.' },
        spider: { name: 'Garden spider', group: 'Arthropoda › Arachnida › Araneae', notes: 'Sitting in a web in the shed. Eight jointed legs; the body in two parts linked by a thin waist; no antennae; silk comes out of spinnerets at the rear.', fact: 'About 50 000 spider species, all predators; weight for weight, some spider silk is tougher than steel.' },
        harvestman: { name: 'Harvestman', group: 'Arthropoda › Arachnida › Opiliones', notes: 'Walking through long grass. Eight very long, thin jointed legs; a small oval body all in one piece, with no waist; no antennae; it makes no silk.', fact: 'Harvestmen are arachnids but not spiders: one fused body, no silk and no venom.' },
        millipede: { name: 'Millipede', group: 'Arthropoda › Myriapoda › Diplopoda', notes: 'Under a log. A long, rounded body of about 40 segments; most segments carry two pairs of short jointed legs, which ripple in waves as it walks. Curls into a spiral when touched.', fact: '"Thousand-legs" exaggerates for most species — but one found in Australia in 2021 has 1 306 legs.' },
        centipede: { name: 'Centipede', group: 'Arthropoda › Myriapoda › Chilopoda', notes: 'Under a stone, running fast. A flattened body of many segments, each with one pair of long jointed legs — 30 legs in all; long antennae; a pair of poison claws beneath the head.', fact: 'Every centipede species has an odd number of pairs of legs, from 15 to 191.' },
        crab: { name: 'Shore crab', group: 'Arthropoda › Crustacea › Decapoda', notes: 'Under seaweed on a rocky shore. A hard, broad shell; ten jointed legs, the front pair ending in large pincers; eyes on stalks; two pairs of antennae.', fact: 'Crabs are crustaceans, the arthropods of the sea: about 7 000 species of true crab.' },
        woodlouse: { name: 'Woodlouse', group: 'Arthropoda › Crustacea › Isopoda', notes: 'Under a flowerpot. A grey, flattened oval body 12 mm long, covered in overlapping plates; fourteen short jointed legs; two antennae. Some kinds roll into a ball.', fact: 'A woodlouse is a crustacean — a land-living cousin of crabs and shrimps — and still breathes with gill-like organs that must stay moist.' },
        snail: { name: 'Garden snail', group: 'Mollusca › Gastropoda', notes: 'On a wet wall at night. A soft, slimy body gliding on a single muscular foot; two pairs of tentacles, with eyes on the longer pair; it carries a coiled shell.', fact: 'Snails, slugs, clams, squid and octopuses are molluscs — about 85 000 species.' },
        octopus: { name: 'Octopus', group: 'Mollusca › Cephalopoda', notes: 'Hiding in a rock pool. A soft body with no shell; eight arms lined with suckers; large, intelligent-looking eyes; changes colour in a second.', fact: 'An octopus has about 500 million neurons, two thirds of them in its arms.' },
        slug: { name: 'Slug', group: 'Mollusca › Gastropoda', notes: 'On lettuce leaves after rain. A soft, slimy body gliding on one muscular foot; two pairs of tentacles; no outer shell and no arms.', fact: 'Slugs have evolved from snails several separate times, by shrinking or losing the shell.' },
        earthworm: { name: 'Earthworm', group: 'Annelida › Clitellata', notes: 'In garden soil. A long, soft, moist body of more than 100 ring-like segments; no legs, no shell, no arms; a pale, saddle-like band part of the way along.', fact: 'Darwin\'s last book (1881) showed that earthworms turn over tonnes of soil per hectare every year.' },
        starfish: { name: 'Starfish', group: 'Echinodermata › Asteroidea', notes: 'On a sandy shore at low tide. No legs, head or shell; five thick arms around a central disc; rows of tiny tube feet under each arm; rough, spiny skin.', fact: 'Starfish are echinoderms — deuterostomes, like us — and can regrow lost arms.' },
        jellyfish: { name: 'Jellyfish', group: 'Cnidaria › Scyphozoa', notes: 'Washed up on a beach. A soft, clear bell of jelly with no legs, shell or segments; long tentacles armed with stinging cells hang from its edge.', fact: 'Cnidarian stinging capsules fire in under a microsecond — one of the fastest movements in biology.' },
        sponge: { name: 'Sponge', group: 'Porifera', notes: 'Attached to a rock under water. No legs, arms, head or organs; a soft, porous body riddled with holes and channels through which it pumps water.', fact: 'Sponges have no nerves or muscles; they filter bacteria from the water with collared cells.' },
        shark: { name: 'Shark', group: 'Chordata › Chondrichthyes', notes: 'In the open sea. Fins and gills; breathes water all its life; five gill slits on each side of the head; skin rough with tiny tooth-like scales; a skeleton of cartilage.', fact: 'About 1 300 species of sharks, rays and chimaeras; their jaws evolved from gill arches over 400 million years ago.' },
        salmon: { name: 'Salmon', group: 'Chordata › Actinopterygii', notes: 'Swimming up a river. Fins and gills; breathes water all its life; a bony skeleton; its gills hide under a single bony flap on each side; smooth, overlapping scales.', fact: 'Ray-finned fish are half of all vertebrate species — about 34 500.' },
        robin: { name: 'Robin', group: 'Chordata › Aves', notes: 'On a bird table. Covered in feathers; two scaly legs; a toothless beak; flies up into a tree when disturbed.', fact: 'Birds are living dinosaurs: about 11 000 species.' },
        penguin: { name: 'Penguin', group: 'Chordata › Aves', notes: 'On an icy shore. Covered in short, dense feathers; two legs; stiff flipper-like wings that it uses to "fly" under water; it cannot fly in air.', fact: 'Feathers, not flight, define birds; penguins gave up flying in air some 60 million years ago.' },
        bat: { name: 'Bat', group: 'Chordata › Mammalia › Chiroptera', notes: 'Hanging in a barn by day. A furry body; the females suckle their young; its front limbs are wings of thin skin stretched between very long fingers.', fact: 'About 1 400 bat species — one mammal species in five — and the only mammals that truly fly.' },
        dolphin: { name: 'Dolphin', group: 'Chordata › Mammalia › Cetacea', notes: 'At sea, surfacing every few minutes to breathe. Smooth skin with a few bristles at birth; the females feed their calves on milk; flippers and a tail fluke; breathes air through a blowhole; no gills.', fact: 'Whales and dolphins are mammals whose ancestors walked on land; their closest living relatives are hippos.' },
        mouse: { name: 'House mouse', group: 'Chordata › Mammalia › Rodentia', notes: 'In a grain store. Furry, with four legs, long whiskers and a long tail; the females feed their young on milk; no wings, no flippers.', fact: 'Rodents make up about two in five mammal species.' },
        lizard: { name: 'Lizard', group: 'Chordata › Reptilia › Squamata', notes: 'Basking on a warm wall. Dry, scaly skin; four legs with clawed toes; a long tail; no hair or feathers; lays eggs with leathery shells.', fact: 'Lizards and snakes together number about 11 800 species.' },
        snake: { name: 'Snake', group: 'Chordata › Reptilia › Squamata', notes: 'In long grass on a sunny day. Dry, scaly skin; no legs at all; a very long body; flicks a forked tongue; no hair or feathers.', fact: 'Snakes are legless lizards; pythons still carry tiny remnants of hind legs.' },
        frog: { name: 'Frog', group: 'Chordata › Amphibia › Anura', notes: 'By a pond. Smooth, moist skin with no scales, hair or feathers; four legs, the hind pair long for jumping; lays jelly-covered eggs in water.', fact: 'About 7 700 of the 8 700 amphibian species are frogs; many breathe partly through their skin.' }
      }
    },
    life: {
      start: 'l1',
      nodes: {
        l1: { q: 'Is its DNA free in the cell, with no nucleus?', s: 'no nucleus?', yes: 'l2', no: 'l3' },
        l2: { q: 'Does its cell wall contain peptidoglycan, with membrane lipids that are fatty acids joined by ester bonds?', s: 'peptidoglycan?', yes: 'bacterium', no: 'archaeon' },
        l3: { q: 'Does it have chloroplasts and make its own food by photosynthesis?', s: 'photosynthesis?', yes: 'l4', no: 'l6' },
        l4: { q: 'Is it a many-celled land organism whose young embryo is protected and fed by the parent plant?', s: 'land plant?', yes: 'l5', no: 'l4b' },
        l4b: { q: 'Is it a single cell living inside a two-part glass (silica) shell?', s: 'glass shell?', yes: 'diatom', no: 'kelp' },
        l5: { q: 'Does it have vessels (xylem) that carry water?', s: 'xylem?', yes: 'l5b', no: 'moss' },
        l5b: { q: 'Does it make seeds?', s: 'seeds?', yes: 'l5c', no: 'fern' },
        l5c: { q: 'Are its seeds enclosed in a fruit that develops from a flower?', s: 'flowers, fruit?', yes: 'sunflower', no: 'pine' },
        l6: { q: 'Does it feed by absorbing food, through cell walls made of chitin?', s: 'chitin walls?', yes: 'l7', no: 'l8' },
        l7: { q: 'Is it a single cell that reproduces by budding?', s: 'budding cell?', yes: 'yeast', no: 'mushroom' },
        l8: { q: 'Is it many-celled, with no cell walls, eating other organisms and moving with muscles?', s: 'animal?', yes: 'bee', no: 'l9' },
        l9: { q: 'Does it crawl and engulf its food with flowing pseudopodia?', s: 'pseudopodia?', yes: 'amoeba', no: 'l9b' },
        l9b: { q: 'Is it covered in thousands of beating cilia?', s: 'cilia?', yes: 'paramecium', no: 'plasmodium' }
      },
      leaves: {
        bacterium: { name: 'Escherichia coli, a bacterium', group: 'Domain Bacteria', notes: 'From a gut sample. Rod-shaped cells about 2 µm long; the electron microscope shows no nucleus. The wall contains peptidoglycan; the membrane lipids are fatty acids joined by ester bonds. Divides every 20 minutes in warm broth.', fact: 'Bacteria have peptidoglycan walls and ester-linked lipids, like the membranes of our own cells.' },
        archaeon: { name: 'A methanogen, an archaeon', group: 'Domain Archaea', notes: 'From a cow\'s rumen, where there is no oxygen. Short rods about 1 µm long, with no nucleus. No peptidoglycan in the wall; membrane lipids are branched chains held by ether bonds. Gives off methane.', fact: 'Only archaea make methane; their ether-linked lipids set them apart from all other life.' },
        diatom: { name: 'A diatom', group: 'Eukarya › SAR › stramenopiles (a protist)', notes: 'From a pond, under the microscope. A single golden-brown cell 40 µm long, with a nucleus and chloroplasts, living inside a glass box of two overlapping halves patterned with fine pores.', fact: 'Diatoms fix about a fifth of the world\'s carbon; their chloroplasts came from an engulfed red alga.' },
        kelp: { name: 'Kelp, a brown alga', group: 'Eukarya › SAR › stramenopiles (a protist)', notes: 'On a rocky shore at low tide. A brown, leathery seaweed 3 m long, made of many cells with chloroplasts, anchored by a holdfast; no roots, flowers or seeds; it lives in the sea and releases swimming spores.', fact: 'Giant kelp can grow half a metre a day, yet it is closer to diatoms than to any plant.' },
        moss: { name: 'A moss', group: 'Eukarya › Archaeplastida › land plants (bryophytes)', notes: 'On a damp wall. Soft green cushions of tiny leafy stems 1 cm tall, full of chloroplasts. The young spore-bearing stalks grow on the parent and are fed by it; no water-conducting vessels, roots, flowers or seeds.', fact: 'In mosses the green plant is the haploid generation; the capsule on its stalk is the diploid one.' },
        fern: { name: 'A fern', group: 'Eukarya › Archaeplastida › land plants (vascular)', notes: 'In a shady wood. Large, divided green leaves that unroll from tight coils; rows of brown spore cases under the leaves; stems with water-conducting vessels; the young plant grows from an embryo on a tiny parent sheet; no flowers or seeds.', fact: 'Ferns spread by spores, not seeds; their sperm swim through a film of water.' },
        pine: { name: 'A pine tree', group: 'Eukarya › Archaeplastida › land plants (gymnosperms)', notes: 'On a sandy hill. A tree with green needle-like leaves and woody, water-conducting tissue. Its seeds lie naked on the scales of woody cones; it has no flowers or fruits.', fact: 'Gymnosperms — "naked seeds" — number only about 1 100 species, but dominate the northern forests.' },
        sunflower: { name: 'A sunflower', group: 'Eukarya › Archaeplastida › land plants (flowering plants)', notes: 'In a field. A tall green plant with water-conducting vessels; big yellow flower heads that turn into hundreds of seeds, each enclosed in a hard fruit wall — the "seed" you eat is a fruit.', fact: 'Flowering plants are about nine in ten land plant species; the daisy family alone has some 32 000.' },
        yeast: { name: 'Baker\'s yeast, a fungus', group: 'Eukarya › Opisthokonts › Fungi', notes: 'From a bakery. Single oval cells 5–10 µm across, each with a nucleus but no chloroplasts; walls containing chitin; small buds pinch off their sides. Absorbs sugar and gives off carbon dioxide.', fact: 'Yeast was the first eukaryote to have its genome sequenced, in 1996.' },
        mushroom: { name: 'A field mushroom, a fungus', group: 'Eukarya › Opisthokonts › Fungi', notes: 'In a meadow after rain. A white cap and stalk that appeared overnight from a web of fine threads in the soil; no chloroplasts; cell walls of chitin; gills under the cap shed millions of spores.', fact: 'The mushroom is only the fruiting body; the fungus is the web of hyphae in the soil.' },
        bee: { name: 'A honeybee, an animal', group: 'Eukarya › Opisthokonts › Animals', notes: 'On a flower. Many cells with no cell walls; eats nectar and pollen; moves with muscles; has a nervous system and six jointed legs.', fact: 'Animals and fungi are sister groups: both are opisthokonts.' },
        amoeba: { name: 'Amoeba, a protist', group: 'Eukarya › Amoebozoa (a protist)', notes: 'From pond mud, under the microscope. A single cell about 0.5 mm long, with a nucleus, no chloroplasts and no wall; it changes shape constantly, flowing out blunt lobes to crawl and to surround its food.', fact: 'Amoebae engulf food by phagocytosis, just as our white blood cells engulf bacteria.' },
        paramecium: { name: 'Paramecium, a protist', group: 'Eukarya › SAR › alveolates (a protist)', notes: 'From a jar of pond water with hay, under the microscope. A single slipper-shaped cell 0.2 mm long, with no wall or chloroplasts; covered in thousands of beating hairs; spins as it swims; a star-shaped vacuole pumps out water.', fact: 'A ciliate keeps two kinds of nucleus: a big working one and a small one for sex.' },
        plasmodium: { name: 'Plasmodium, the malaria parasite', group: 'Eukarya › SAR › alveolates (a protist)', notes: 'Seen in a stained blood film under the microscope. A tiny single cell with a nucleus, living inside a red blood cell; no chloroplasts, no wall, no cilia or pseudopodia. Carried between people by mosquitoes.', fact: 'Plasmodium keeps a relic chloroplast, the apicoplast — a clue to its algal ancestry and a drug target.' }
      }
    }
  };

  Hyper.sim('div-key', {
    title: 'A dichotomous key',
    blurb: `Each specimen comes with its field notes. Answer the key's questions from the notes — yes or no — and the key leads you to a name. A key splits the possibilities in two at every step, so twenty-seven kinds of animal can be told apart in at most six questions.

**Try this**
- Identify a few animals, then tick *Show the whole key*: your path is highlighted, and you can see how each question divides what is left.
- Watch for the traps: a woodlouse is not an insect, a harvestman is not a spider, a dolphin is not a fish, and a penguin cannot fly.
- Switch to *The major groups of life*: now the questions use the microscope and the chemistry of walls and membranes — the traits that separate domains and kingdoms.
- Notice that a key is a tool for identification, not a family tree: "can it fly?" separates robins from penguins, though both are birds.`,
    mount(box, kit, params) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      let keyName = params && params.key === 'life' ? 'life' : 'animals', K, order, idx, node, path, done, scored, score, showTree = false, lay, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'key', type: 'select', label: 'Key', options: [['Some common animals', 'animals'], ['The major groups of life', 'life']], value: keyName },
        { type: 'buttons', items: [{ id: 'yes', label: 'Yes', primary: true }, { id: 'no', label: 'No' }, { id: 'back', label: 'Back' }] },
        { type: 'buttons', items: [{ id: 'next', label: 'Next specimen' }, { id: 'restart', label: 'Start again' }] },
        { id: 'tree', type: 'check', label: 'Show the whole key', value: false }
      ], (id, v) => {
        if (id === 'key') reset(v);
        else if (id === 'yes') answer(true);
        else if (id === 'no') answer(false);
        else if (id === 'back') back();
        else if (id === 'next') next();
        else if (id === 'restart') reset(keyName);
        else if (id === 'tree') showTree = !!v;
      });
      const ro = kit.readout(box.side, [['score', 'Identified correctly'], ['spec', 'Specimen'], ['steps', 'Questions answered']]);

      function layout() {
        const rows = [], pos = {};
        let maxD = 0;
        (function walk(id, d) {
          maxD = Math.max(maxD, d);
          if (K.leaves[id]) { pos[id] = { d, r: rows.length }; rows.push(id); return; }
          const q = K.nodes[id];
          walk(q.yes, d + 1); walk(q.no, d + 1);
          pos[id] = { d, r: (pos[q.yes].r + pos[q.no].r) / 2 };
        })(K.start, 0);
        return { rows, pos, maxD };
      }
      function reset(k) {
        keyName = k === 'life' ? 'life' : 'animals';
        K = KEYS[keyName];
        order = shuffle(Object.keys(K.leaves), B.rng(keyName === 'life' ? 23 : 11));
        idx = 0; score = { right: 0, tried: 0 };
        lay = layout();
        startSpecimen();
      }
      function startSpecimen() { node = K.start; path = []; done = null; scored = false; }
      function answer(yes) {
        if (done) return;
        const q = K.nodes[node];
        path.push({ id: node, ans: yes });
        const nx = yes ? q.yes : q.no;
        node = nx;
        if (K.leaves[nx]) {
          done = nx;
          if (!scored) { score.tried++; if (nx === order[idx]) score.right++; scored = true; }
        }
      }
      function back() { if (!path.length) return; node = path.pop().id; done = null; }
      function next() { idx = (idx + 1) % order.length; startSpecimen(); }
      reset(keyName);
      kit.click(st, p => { for (const h of hits) if (inside(p, h)) { h.act(); break; } }, p => hits.some(h => inside(p, h)));

      function button(c, C, x, y, w, h, label, act, primary) {
        rrect(c, x, y, w, h, 8);
        c.fillStyle = primary ? C.accent : C.surface; c.fill();
        c.strokeStyle = primary ? C.accent : C.border2 || C.faint; c.lineWidth = 1.2; c.stroke();
        text(c, label, x + w / 2, y + h / 2, { size: 14, weight: 600, align: 'center', color: primary ? (C.dark ? '#0b0d18' : '#ffffff') : C.text });
        hits.push({ x, y, w, h, act });
      }
      function drawTree(c, C) {
        const W = st.W, H = st.H, top = 26, n = lay.rows.length;
        const rh = (H - top - 12) / Math.max(1, n - 1), leafW = W < 520 ? 92 : 128, dx = (W - 24 - leafW) / Math.max(1, lay.maxD);
        const size = clamp(rh * 0.72, 8.5, 11.5);
        const P = id => ({ x: 12 + lay.pos[id].d * dx, y: top + lay.pos[id].r * rh });
        const onPath = new Set(path.map(s => s.id)); onPath.add(node);
        text(c, 'The whole key — yes branches upward, no branches downward', 12, 12, { size: 11.5, color: C.muted });
        // branches
        for (const id of Object.keys(K.nodes)) {
          const q = K.nodes[id], a = P(id);
          for (const [child, yes] of [[q.yes, true], [q.no, false]]) {
            const b = P(child), taken = path.some(s => s.id === id && s.ans === yes);
            c.strokeStyle = taken ? C.accent : C.faint; c.lineWidth = taken ? 2.6 : 1;
            c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(a.x, b.y); c.lineTo(b.x, b.y); c.stroke();
          }
        }
        for (const id of Object.keys(K.nodes)) {
          const a = P(id), here = id === node && !done;
          kit.dot(c, a.x, a.y, here ? 5 : 3.2, onPath.has(id) ? C.accent : C.muted);
          text(c, K.nodes[id].s, a.x + 5, a.y - 6, { size: size - 0.5, color: onPath.has(id) ? C.text : C.muted, halo: C.bg2 });
        }
        for (const id of lay.rows) {
          const a = P(id), isAns = done && id === done, isTrue = done && id === order[idx];
          const col = isTrue ? C.ok : isAns ? C.bad : C.text2 || C.text;
          text(c, K.leaves[id].name, a.x + 6, a.y, { size, weight: isAns || isTrue ? 700 : 400, color: col });
        }
      }
      function drawCards(c, C) {
        const W = st.W, H = st.H, wide = W >= 560, pad = 12;
        const L = wide ? { x: pad, y: pad, w: W * 0.44 - pad, h: H - 2 * pad } : { x: pad, y: pad, w: W - 2 * pad, h: H * 0.46 };
        const Rr = wide ? { x: W * 0.44 + pad, y: pad, w: W * 0.56 - 2 * pad, h: H - 2 * pad } : { x: pad, y: H * 0.46 + 2 * pad, w: W - 2 * pad, h: H * 0.54 - 3 * pad };
        const spec = K.leaves[order[idx]];
        // the specimen card
        rrect(c, L.x, L.y, L.w, L.h, 10); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.stroke();
        text(c, 'Specimen ' + (idx + 1) + ' of ' + order.length, L.x + 14, L.y + 20, { size: 12, weight: 700, color: C.accent });
        text(c, 'Field notes', L.x + L.w - 14, L.y + 20, { size: 11, color: C.muted, align: 'right' });
        const fs = wide ? 13.5 : 12, lh = wide ? fs + 5 : fs + 4, lines = wrap(c, spec.notes, L.w - 28, fs);
        lines.forEach((ln, i) => text(c, ln, L.x + 14, L.y + 42 + i * lh, { size: fs, color: C.text }));
        // the key panel
        let y = Rr.y + 8;
        if (!done) {
          text(c, 'Question ' + (path.length + 1), Rr.x + 4, y + 8, { size: 11.5, color: C.muted, weight: 600 });
          const ql = wrap(c, K.nodes[node].q, Rr.w - 8, 16, 600);
          ql.forEach((ln, i) => text(c, ln, Rr.x + 4, y + 32 + i * 22, { size: 16, weight: 600, color: C.text }));
          y += 32 + ql.length * 22 + 6;
          const bw = Math.min(120, (Rr.w - 16) / 2);
          button(c, C, Rr.x + 4, y, bw, 34, 'Yes', () => answer(true), true);
          button(c, C, Rr.x + 12 + bw, y, bw, 34, 'No', () => answer(false), false);
          y += 50;
        } else {
          const right = done === order[idx], leaf = K.leaves[done];
          text(c, 'The key says:', Rr.x + 4, y + 8, { size: 11.5, color: C.muted, weight: 600 });
          text(c, leaf.name, Rr.x + 4, y + 32, { size: 18, weight: 700, color: right ? C.ok : C.bad });
          text(c, leaf.group, Rr.x + 4, y + 54, { size: 11.5, color: C.muted });
          y += 72;
          const verdict = right ? 'Correct! ' + leaf.fact : 'Not this time: the field notes do not fit this answer. Press Back and check each of your answers against the notes.';
          const vl = wrap(c, verdict, Rr.w - 8, 13);
          vl.forEach((ln, i) => text(c, ln, Rr.x + 4, y + i * 18, { size: 13, color: right ? C.text : C.bad }));
          y += vl.length * 18 + 8;
          button(c, C, Rr.x + 4, y, Math.min(170, Rr.w - 8), 32, right ? 'Next specimen' : 'Back', right ? next : back, true);
          y += 46;
        }
        // the path so far
        if (path.length && y < Rr.y + Rr.h - 16) {
          text(c, 'Your answers', Rr.x + 4, y, { size: 11, color: C.muted, weight: 600 });
          y += 16;
          for (const s of path) {
            if (y > Rr.y + Rr.h - 6) break;
            text(c, (s.ans ? 'yes  ' : 'no    ') + K.nodes[s.id].s, Rr.x + 4, y, { size: 12, color: s.ans ? C.ok : C.warn });
            y += 16;
          }
        }
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        hits = [];
        if (showTree) drawTree(c, C); else drawCards(c, C);
        ro.set('score', score.right + ' of ' + score.tried);
        ro.set('spec', (idx + 1) + ' of ' + order.length);
        ro.set('steps', String(path.length) + (done ? ' — done' : ''));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ div-tree */
  // a group: its name, species named (for tips; inner groups are summed), a note, sub-groups, tags of traditional groups
  const G = (name, c, note, kids, tags) => ({ name, c, note, kids: kids || [], tags: tags || [] });
  function lifeTree() {
    return G('Life', null, 'All cellular life: about 2.1 million species named so far. Estimates of the total run to some 8.7 million eukaryotes (Mora and colleagues, 2011), plus untold millions of bacteria and archaea.', [
      G('Bacteria', 20000, 'About 20 000 validly named species, out of perhaps millions; most have never been grown in a laboratory.', [
        G('Pseudomonadota', null, 'Formerly Proteobacteria: E. coli, Salmonella, the nitrogen-fixing rhizobia — and the ancestors of mitochondria.'),
        G('Bacillota', null, 'Formerly Firmicutes: Bacillus, Staphylococcus, Clostridium and the lactic-acid bacteria; a major gut phylum.'),
        G('Actinomycetota', null, 'Streptomyces and relatives: soil bacteria that make most natural antibiotics.'),
        G('Cyanobacteria', null, 'Inventors of oxygen-producing photosynthesis and ancestors of chloroplasts — once called "blue-green algae".', [], ['alga']),
        G('Bacteroidota', null, 'Bacteroides and relatives: fibre digesters that dominate the human colon.')
      ]),
      G('Archaea', 700, 'Fewer than a thousand named species: record-holders for heat, acid and salt, but also common in oceans, soils and guts.', [
        G('Methanogens and salt-lovers', null, 'Methane makers of rumens, rice paddies and our guts; Halobacterium in saturated brine.'),
        G('Thermoproteota', null, 'Heat-lovers of hot springs, and the ammonia oxidisers that abound in the deep ocean.'),
        G('Asgard archaea', null, 'Found in 2015 in sea-floor mud: the closest known relatives of eukaryotes.'),
        G('DPANN', null, 'Tiny cells with tiny genomes, many living on other archaea.')
      ]),
      G('Eukarya', null, 'Cells with a nucleus and, almost always, mitochondria. They probably branched from within the archaea, near the Asgard group.', [
        G('Opisthokonts', null, 'Animals, fungi and their single-celled relatives — named for the single rear flagellum of their sperm and spores.', [
          G('Animals', null, 'About 1.5 million named species, perhaps 7.8 million in all (Mora and colleagues, 2011); about 95 % are invertebrates.', [
            G('Sponges', 9000, 'No true tissues: they pump water through their bodies and filter it with collared cells.'),
            G('Cnidarians', 10000, 'Jellyfish, corals and sea anemones: radial symmetry and stinging cells.'),
            G('Flatworms', 30000, 'Planarians, flukes and tapeworms: flat bodies with no body cavity.'),
            G('Nematodes', 25000, 'Roundworms, including C. elegans. Perhaps a million species exist, and about four in five animals on Earth are nematodes.'),
            G('Annelids', 17000, 'Segmented worms: earthworms, leeches and ragworms.'),
            G('Molluscs', 85000, 'Snails, slugs, clams, squid and octopuses.'),
            G('Arthropods', null, 'Jointed legs and an exoskeleton that must be moulted: by far the richest phylum in species.', [
              G('Insects', null, 'About a million named, perhaps 5.5 million in all: six legs, three body parts, usually wings.', [
                G('Beetles', 387000, 'About one named animal species in four is a beetle.'),
                G('Butterflies and moths', 158000, 'Wings covered in scales; caterpillars that feed on plants.'),
                G('Flies', 155000, 'One pair of wings; the hind pair became the balancing halteres.'),
                G('Ants, bees and wasps', 153000, 'The social insects, and a host of tiny parasitoid wasps.'),
                G('True bugs', 104000, 'Aphids, cicadas and shield bugs: mouthparts that pierce and suck.'),
                G('Other insects', 65000, 'Grasshoppers, dragonflies, termites, lice, fleas, caddisflies and more.')
              ]),
              G('Arachnids', 112000, 'Spiders, scorpions, harvestmen, mites and ticks: eight legs, no antennae.'),
              G('Crustaceans', 67000, 'Crabs, shrimps, krill, barnacles and woodlice.'),
              G('Myriapods', 12000, 'Centipedes and millipedes.')
            ]),
            G('Echinoderms', 7500, 'Starfish, sea urchins and sea cucumbers: deuterostomes, like us.'),
            G('Chordates', null, 'A notochord, a nerve cord along the back, gill slits and a tail at some stage of life.', [
              G('Tunicates and lancelets', 3100, 'Sea squirts and amphioxus: chordates without a backbone.'),
              G('Vertebrates', null, 'About 74 000 species with a backbone and a skull.', [
                G('Jawless fish', 130, 'Hagfish and lampreys.', [], ['fish']),
                G('Cartilaginous fish', 1300, 'Sharks, rays and chimaeras: jaws, and a skeleton of cartilage.', [], ['fish']),
                G('Ray-finned fish', 34500, 'Half of all vertebrates: a bony skeleton and a swim bladder.', [], ['fish']),
                G('Lobe-finned vertebrates', null, 'Fleshy fins with bones — and the four-limbed animals that grew from them.', [
                  G('Coelacanths and lungfish', 8, 'Two coelacanths and six lungfish: the closest living fish relatives of tetrapods.', [], ['fish']),
                  G('Tetrapods', null, 'Four limbs, from about 365 million years ago.', [
                    G('Amphibians', 8700, 'Frogs, salamanders and caecilians: moist skin, eggs laid in water.'),
                    G('Amniotes', null, 'The amniotic egg freed reproduction from water, about 320 million years ago.', [
                      G('Mammals', 6600, 'Hair, milk and three middle-ear bones; bats and rodents are more than half of them.'),
                      G('Reptiles (with birds)', null, 'The clade of turtles, lizards and snakes, crocodilians — and birds, the living dinosaurs.', [
                        G('Turtles', 360, 'Reptiles with a shell grown from their ribs.', [], ['reptile']),
                        G('Lizards and snakes', 11800, 'Snakes are legless lizards.', [], ['reptile']),
                        G('Crocodilians', 27, 'Closer to birds than to lizards.', [], ['reptile']),
                        G('Birds', 11000, 'Feathered theropod dinosaurs.')
                      ])
                    ])
                  ])
                ])
              ])
            ]),
            G('Other animal phyla', 20000, 'Rotifers, bryozoans, tardigrades, comb jellies, velvet worms and some twenty more phyla.')
          ]),
          G('Choanoflagellates', 350, 'Collared single cells: the closest living relatives of animals.', [], ['protist']),
          G('Fungi', null, 'About 150 000 named of an estimated 2–4 million: absorptive, with chitin walls, and closer to animals than to plants.', [
            G('Sac fungi', 90000, 'Ascomycota: yeasts, Penicillium, Aspergillus, morels, truffles and most lichen fungi.'),
            G('Club fungi', 50000, 'Basidiomycota: mushrooms, bracket fungi, rusts and smuts.'),
            G('Other fungi', 10000, 'Bread moulds, the arbuscular mycorrhizal fungi, chytrids and more.')
          ])
        ]),
        G('Amoebozoa', 2400, 'Amoebae and slime moulds such as Dictyostelium.', [], ['protist']),
        G('Archaeplastida', null, 'Eukaryotes whose chloroplast came directly from a cyanobacterium: red algae, green algae and land plants.', [
          G('Red algae', 7500, 'Seaweeds that give us agar, carrageenan and nori.', [], ['protist', 'alga']),
          G('Green algae', 10000, 'From single cells such as Chlamydomonas to sea lettuce; land plants arose from among them.', [], ['protist', 'alga']),
          G('Land plants', null, 'About 380 000 species; unlike animals, most have probably been named already.', [
            G('Bryophytes', null, 'Land plants without vessels; the green plant is the haploid gametophyte.', [
              G('Liverworts', 7300, 'Flat or leafy; among the earliest branches of land plants.'),
              G('Mosses', 12700, 'Including Sphagnum, whose peat bogs store vast amounts of carbon.'),
              G('Hornworts', 220, 'Named for their horn-shaped sporophytes.')
            ]),
            G('Vascular plants', null, 'Lignified water-conducting tissue: height.', [
              G('Lycophytes', 1300, 'Clubmosses, spikemosses and quillworts; their Carboniferous giants became coal.'),
              G('Ferns and horsetails', 10500, 'Spores on the leaves, and sperm that swim.'),
              G('Seed plants', null, 'Seeds and pollen: reproduction without open water.', [
                G('Gymnosperms', 1100, 'Conifers, cycads, Ginkgo and gnetophytes: naked seeds.'),
                G('Flowering plants', 350000, 'Flowers and fruits; estimates run from 300 000 to 370 000 species.')
              ])
            ])
          ])
        ]),
        G('SAR', null, 'Stramenopiles, alveolates and rhizarians: a supergroup made entirely of "protists".', [
          G('Diatoms', 12000, 'Single cells in glass boxes that fix about a fifth of the world\'s carbon.', [], ['protist', 'alga']),
          G('Brown algae', 2000, 'Kelps and wracks, with chloroplasts borrowed from a red alga.', [], ['protist', 'alga']),
          G('Water moulds', 1000, 'Oomycetes such as Phytophthora, the potato blight.', [], ['protist']),
          G('Ciliates', 8000, 'Paramecium and relatives: cilia and two kinds of nucleus.', [], ['protist']),
          G('Dinoflagellates', 2500, 'Red tides, and the algal partners of reef corals.', [], ['protist', 'alga']),
          G('Apicomplexans', 6000, 'Parasites, including Plasmodium (malaria) and Toxoplasma.', [], ['protist']),
          G('Forams and radiolarians', 11000, 'Shelled amoebae of the plankton, whose fossils record past climates.', [], ['protist'])
        ]),
        G('Excavates', null, 'Flagellates with a feeding groove, and their relatives.', [
          G('Euglenids', 1000, 'Euglena and relatives; some carry chloroplasts from an engulfed green alga.', [], ['protist', 'alga']),
          G('Trypanosomes and relatives', 700, 'Kinetoplastids, among them the parasites of sleeping sickness and leishmaniasis.', [], ['protist']),
          G('Giardia and relatives', 300, 'Gut flagellates with much-reduced mitochondria.', [], ['protist'])
        ]),
        G('Haptophytes', 400, 'Coccolithophores, whose chalk plates built the white cliffs of Dover.', [], ['protist', 'alga'])
      ])
    ]);
  }
  const TREE_HL = {
    protists: { label: 'protists', tag: 'protist', why: 'Their common ancestor is the ancestor of all eukaryotes, yet animals, fungi and land plants are left out.' },
    algae: { label: 'algae', tag: 'alga', poly: true, why: 'Photosynthesis spread by engulfing a cyanobacterium, or an alga, several times over; algae sit on many separate branches.' },
    invertebrates: { label: 'invertebrates', inv: true, why: 'The vertebrates evolved from among them but are left out.' },
    fish: { label: 'fish', tag: 'fish', why: 'Tetrapods descend from lobe-finned fish but are left out.' },
    reptiles: { label: 'reptiles (old sense)', tag: 'reptile', why: 'Birds descend from dinosaurs, inside the reptile clade, but are left out.' }
  };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  Hyper.sim('div-tree', {
    title: 'The tree of life explorer',
    blurb: `The tree of life from the three domains down to classes and orders. Click a group to open or close it; the bars show how many species have been **named** in each group (not how many exist). Highlight a traditional group to see whether it is a true branch — a clade — or not.

**Try this**
- Open Animals, then Arthropods and Insects, on the linear scale: beetles alone outweigh all the vertebrates five times over. Switch to the log scale to see the small groups at all.
- Open Bacteria and Archaea: two whole domains with barely 21 000 named species between them — not because they are few, but because most cannot be grown and named the classical way.
- Highlight the *protists*: they are scattered across every eukaryotic supergroup. The verdict box names the groups the word leaves out.
- Highlight *fish* and *reptiles*: both are paraphyletic, because tetrapods and birds sit inside their branches.
- Highlight *algae*: polyphyletic, even taking in bacteria (cyanobacteria were once "blue-green algae").`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360, maxH: 560 });
      const root = lifeTree();
      const all = [];
      (function prep(n, parent, depth) {
        n.parent = parent; n.depth = depth; n.open = false; n.x = n.y = n.tx = n.ty = null; all.push(n);
        n.kids.forEach(k => prep(k, n, depth + 1));
        n.leaves = n.kids.length ? n.kids.reduce((a, k) => a.concat(k.leaves), []) : [n];
        const sub = n.kids.map(k => k.total).filter(v => v != null);
        n.total = sub.length ? sub.reduce((a, b) => a + b, 0) : n.c;
      })(root, null, 0);
      root.open = true;
      const byName = name => all.find(n => n.name === name);
      const isIn = (n, anc) => { for (let p = n; p; p = p.parent) if (p === anc) return true; return false; };
      let selected = root, hl = TREE_HL[params.highlight] ? params.highlight : 'none', scale = 'lin', rowsMax = 30, hits = [], infoKey = '';
      function openPath(n) { for (let p = n; p; p = p.parent) p.open = true; }
      function collapseAll() { all.forEach(n => { n.open = false; }); root.open = true; }
      function show(names) { collapseAll(); names.forEach(nm => { const n = byName(nm); if (n) openPath(n); }); fit(null); }
      function tips() { const out = []; (function walk(n) { if (n.open && n.kids.length) n.kids.forEach(walk); else out.push(n); })(root); return out; }
      // keep the tree within the rows the stage can show, closing the deepest groups off the path of `keep`
      function fit(keep) {
        let guard = 0;
        while (tips().length > rowsMax && guard++ < 60) {
          const cands = all.filter(n => n.open && n !== root && n.kids.length && !(keep && isIn(keep, n)) && n.kids.every(k => !k.open || !k.kids.length));
          if (!cands.length) break;
          cands.sort((a, b) => b.depth - a.depth || a.leaves.length - b.leaves.length);
          cands[0].open = false;
        }
      }
      const initial = Array.isArray(params.open) ? params.open : ['Eukarya', 'Opisthokonts'];
      initial.forEach(nm => { const n = byName(nm); if (n) openPath(n); });

      const ctl = kit.controls(box.side, [
        { id: 'scale', type: 'select', label: 'Bars: species named', options: [['linear scale', 'lin'], ['logarithmic scale', 'log']], value: 'lin' },
        { id: 'hl', type: 'select', label: 'Highlight a traditional group', options: [['none', 'none'], ['protists', 'protists'], ['algae', 'algae'], ['invertebrates', 'invertebrates'], ['fish', 'fish'], ['reptiles, without birds', 'reptiles']], value: hl },
        { type: 'buttons', items: [{ id: 'animals', label: 'Animals' }, { id: 'plants', label: 'Plants' }, { id: 'microbes', label: 'Microbes' }, { id: 'collapse', label: 'Collapse all' }] },
        { id: 'info', type: 'html', html: '' }
      ], (id, v) => {
        if (id === 'scale') scale = v;
        else if (id === 'hl') hl = v;
        else if (id === 'animals') { show(['Arthropods', 'Vertebrates']); selected = byName('Animals'); }
        else if (id === 'plants') { show(['Seed plants', 'Bryophytes']); selected = byName('Land plants'); }
        else if (id === 'microbes') { show(['Bacteria', 'Archaea', 'SAR']); selected = root; }
        else if (id === 'collapse') { collapseAll(); selected = root; }
      });
      const ro = kit.readout(box.side, [['sel', 'Selected'], ['n', 'Species named'], ['share', 'Share of all named species'], ['hl', 'Highlighted group']]);

      function tagged(leaf) {
        const h = TREE_HL[hl];
        if (!h) return false;
        if (h.inv) return isIn(leaf, byName('Animals')) && !isIn(leaf, byName('Vertebrates'));
        return leaf.tags.indexOf(h.tag) >= 0;
      }
      // is the highlighted set a clade? find its most recent common ancestor and the branches it leaves out
      function verdict() {
        const h = TREE_HL[hl];
        if (!h) return null;
        const set = new Set(root.leaves.filter(tagged));
        const holds = n => { let k = 0; for (const l of n.leaves) if (set.has(l)) k++; return k; };
        let m = root;
        for (;;) { const ch = m.kids.find(k => holds(k) === set.size); if (!ch) break; m = ch; }
        let out = [];
        (function ex(n) { if (!holds(n)) { out.push(n); return; } n.kids.forEach(ex); })(m);
        out = out.sort((a, b) => b.leaves.length - a.leaves.length).map(n => n.name);   // the biggest omissions first
        const species = [...set].reduce((a, l) => a + (l.total || 0), 0);
        return { species, mrca: m.name, out, kind: !out.length ? 'a clade' : h.poly ? 'polyphyletic' : 'paraphyletic', why: h.why, label: h.label };
      }
      kit.click(st, p => {
        for (const h of hits) if (inside(p, h)) {
          const n = h.node;
          selected = n;
          if (n.kids.length && n !== root) { n.open = !n.open; if (n.open) fit(n); }
          return;
        }
      }, p => hits.some(h => inside(p, h)));

      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, narrow = W < 560;
        const top = 34, bottom = 8;
        rowsMax = Math.max(8, Math.floor((H - top - bottom) / 11));
        fit(selected);
        const tp = tips(), nRows = tp.length, rh = Math.min(22, (H - top - bottom) / Math.max(1, nRows));
        const maxD = Math.max(1, ...tp.map(n => n.depth));
        const tipX = W * (narrow ? 0.3 : 0.36), labelX = tipX + 8, labelW = W * (narrow ? 0.34 : 0.25);
        const barX = labelX + labelW, barW = Math.max(30, W - barX - (narrow ? 8 : 64));
        // targets: tips in rows, inner groups at the mean of their children
        tp.forEach((n, i) => { n.ty = top + (i + 0.5) * rh; n.tx = tipX; });
        (function place(n) {
          if (!(n.open && n.kids.length)) return;
          n.kids.forEach(place);
          n.ty = (n.kids[0].ty + n.kids[n.kids.length - 1].ty) / 2;
          n.tx = 12 + n.depth / maxD * (tipX - 22);
        })(root);
        const k = Math.min(1, (dt || 0.016) * 9);
        const vis = [];
        (function walk(n, px, py) {
          if (n.x == null) { n.x = px; n.y = py; }
          n.x += (n.tx - n.x) * k; n.y += (n.ty - n.y) * k;
          vis.push(n);
          if (n.open && n.kids.length) n.kids.forEach(ch => walk(ch, n.x, n.y));
        })(root, 12, H / 2);
        const visSet = new Set(vis);
        all.forEach(n => { if (!visSet.has(n)) n.x = n.y = null; });
        const hlOn = !!TREE_HL[hl], frac = n => { if (!hlOn) return 0; let t = 0; for (const l of n.leaves) if (tagged(l)) t++; return t / n.leaves.length; };
        const hlCol = C.warn;
        // header
        const maxV = Math.max(1, ...tp.map(n => n.total || 0));
        text(c, 'Click a group to open or close it', 12, 14, { size: 11.5, color: C.muted });
        text(c, scale === 'log' ? 'species named (log scale)' : 'species named (longest bar ' + group(maxV) + ')', barX, 14, { size: 11.5, color: C.muted });
        if (scale === 'log') {
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let e = 1; e <= 6; e++) {
            const x = barX + barW * e / 6.4;
            c.beginPath(); c.moveTo(x, top - 4); c.lineTo(x, H - bottom); c.stroke();
            if (e % 2 === 0 || !narrow) text(c, pow10(e), x, top - 10, { size: 9.5, color: C.faint, align: 'center' });
          }
        }
        // branches
        c.lineWidth = 1.4;
        for (const n of vis) {
          if (!(n.open && n.kids.length)) continue;
          c.strokeStyle = C.faint;
          c.beginPath(); c.moveTo(n.x, n.kids[0].y); c.lineTo(n.x, n.kids[n.kids.length - 1].y); c.stroke();
          for (const ch of n.kids) {
            c.strokeStyle = hlOn && frac(ch) > 0 ? hlCol : C.muted;
            c.beginPath(); c.moveTo(n.x, ch.y); c.lineTo(ch.x, ch.y); c.stroke();
          }
        }
        hits = [];
        // inner groups
        for (const n of vis) {
          if (!(n.open && n.kids.length)) continue;
          const sel = n === selected;
          kit.dot(c, n.x, n.y, sel ? 5.5 : 4, sel ? C.accent : C.muted);
          const lab = n.name, fs = narrow ? 9.5 : 10.5;
          text(c, lab, n.x + 5, n.y - 7, { size: fs, color: sel ? C.accent : C.muted, halo: C.bg2, weight: sel ? 700 : 400 });
          c.font = '400 ' + fs + 'px ' + FONT();
          hits.push({ x: n.x - 8, y: n.y - 16, w: c.measureText(lab).width + 16, h: 22, node: n });
        }
        // tips: label, bar, count
        const fsz = clamp(rh * 0.62, 9, 12.5);
        for (const n of tp) {
          const f = frac(n), sel = n === selected, y = n.y, closed = n.kids.length > 0;
          kit.dot(c, n.x, y, closed ? 3.8 : 2.6, closed ? C.accent : C.muted);
          if (closed) text(c, '▸', n.x - 11, y, { size: 10, color: C.accent });
          let lab = n.name;
          c.font = (sel ? 700 : 400) + ' ' + fsz + 'px ' + FONT();
          while (lab.length > 4 && c.measureText(lab).width > labelW - 6) lab = lab.slice(0, -2) + '…';
          const col = f === 1 ? hlCol : sel ? C.accent : C.text;
          text(c, lab, labelX, y, { size: fsz, weight: sel || f === 1 ? 700 : 400, color: col });
          const v = n.total;
          if (v != null && v > 0) {
            const w = scale === 'log' ? barW * Math.max(0.02, Math.log10(Math.max(1, v)) / 6.4) : Math.max(1.5, barW * v / maxV);
            const bh = Math.max(3, Math.min(12, rh * 0.55));
            c.fillStyle = f > 0 ? hlCol : (closed ? C.accent : kit.hue(200, 0.8));
            c.globalAlpha = f > 0 && f < 1 ? 0.5 : 0.9;
            c.fillRect(barX, y - bh / 2, w, bh);
            c.globalAlpha = 1;
            if (!narrow) text(c, group(v), barX + w + 5, y, { size: 10, color: C.muted });
          } else text(c, 'not counted here', barX, y, { size: 9.5, color: C.faint });
          hits.push({ x: n.x - 14, y: y - rh / 2, w: W - n.x + 14, h: rh, node: n });
        }
        // the side panel and readouts
        const vd = verdict();
        const key = selected.name + '|' + hl;
        if (key !== infoKey) {
          infoKey = key;
          let h = '<b>' + esc(selected.name) + '</b> — ' + esc(selected.note);
          if (vd) h += '<br><br><b>' + esc(vd.label.charAt(0).toUpperCase() + vd.label.slice(1)) + ': ' + esc(vd.kind) + '.</b> ' + esc(vd.why);
          ctl.set('info', h);
        }
        ro.set('sel', selected.name);
        ro.set('n', selected.total != null ? group(selected.total) : 'not counted');
        ro.set('share', selected.total != null ? (100 * selected.total / root.total).toFixed(selected.total / root.total < 0.01 ? 2 : 1) + ' %' : '—');
        ro.set('hl', vd ? group(vd.species) + ' species; ' + vd.kind + (vd.out.length ? ' — leaves out ' + vd.out.slice(0, 3).join(', ') + (vd.out.length > 3 ? ' and ' + (vd.out.length - 3) + ' more' : '') : '') : 'none');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ div-sampling */
  Hyper.sim('div-sampling', {
    title: 'Samples, standard errors and confidence intervals',
    blurb: `A population of wheat seedlings has a true mean height of 120 mm — but you only ever see samples. Each sample gives a mean and a confidence interval: green intervals contain the true mean, red ones miss it. Below, the means of all the samples so far pile up into a histogram, next to the curve the theory predicts, $\\mathrm{SE} = \\sigma/\\sqrt{n}$.

**Try this**
- Let it run with samples of 5: about one interval in twenty misses the truth. That — and only that — is what "95 % confidence" promises.
- Change the sample size from 5 to 20 to 80: the histogram of means narrows as σ/√n; four times the sample halves the spread. The intervals shrink too, but still miss one time in twenty.
- For samples of 3–5, choose *z · s/√n*: using 1.96 with a standard deviation estimated from so few values makes the intervals too narrow, and they miss far more often than 5 %. That is why Gosset needed the t distribution.
- Compare the read-outs: the SD of the sample means matches the theoretical standard error.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio, lg = B.lgamma, MU = 120;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Sample size n', min: 2, max: 100, step: 1, value: params.n || 5 },
        { id: 'sd', label: 'Spread of the population σ', min: 5, max: 40, step: 1, value: 20, unit: 'mm' },
        { id: 'conf', type: 'select', label: 'Confidence level', options: [['90 %', 0.9], ['95 %', 0.95], ['99 %', 0.99]], value: 0.95 },
        { id: 'meth', type: 'select', label: 'Interval', options: [['mean ± t* · s/√n (correct)', 't'], ['mean ± z* · s/√n (σ guessed from the sample)', 'zs'], ['mean ± z* · σ/√n (σ known)', 'z']], value: 't' },
        { id: 'rate', label: 'Samples per second', min: 0.5, max: 30, step: 0.5, value: 3 },
        { type: 'buttons', items: [{ id: 'one', label: 'One sample' }, { id: 'hundred', label: '100 samples', primary: true }, { id: 'pause', label: 'Pause / run' }, { id: 'clear', label: 'Clear' }] }
      ], (id) => {
        if (id === 'one') draw(1);
        else if (id === 'hundred') draw(100);
        else if (id === 'pause') running = !running;
        else if (id !== 'rate') clear();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Samples drawn'], ['last', 'Last sample: mean ± SD'], ['se', 'Standard error σ/√n (theory)'], ['sdm', 'SD of the sample means (observed)'], ['cov', 'Intervals containing the true mean'], ['w', 'Average width of the intervals']]);
      const plot = kit.plot(gb, { x: { label: 'sample mean (mm)' }, y: { label: 'density (per mm)', min: 0 }, legend: true }, 170);
      const R = B.rng(2024), gauss = normals(R);
      let means = [], ivs = [], covered = 0, widthSum = 0, last = null, acc = 0, running = true;
      function clear() { means = []; ivs = []; covered = 0; widthSum = 0; last = null; acc = 0; }
      function crit() {
        if (V.meth === 't') return tCrit(1 - V.conf, Math.round(V.n) - 1, lg);
        return V.conf === 0.9 ? 1.6449 : V.conf === 0.99 ? 2.5758 : 1.9600;
      }
      function draw(k) {
        const n = Math.max(2, Math.round(V.n)), cc = crit();
        for (let j = 0; j < k; j++) {
          const xs = [];
          for (let i = 0; i < n; i++) xs.push(MU + V.sd * gauss());
          const ms = meanSd(xs), se = (V.meth === 'z' ? V.sd : ms.s) / Math.sqrt(n), h = cc * se;
          const iv = { m: ms.m, lo: ms.m - h, hi: ms.m + h, ok: ms.m - h <= MU && MU <= ms.m + h };
          means.push(ms.m); ivs.push(iv);
          if (ivs.length > 50) ivs.shift();
          if (iv.ok) covered++;
          widthSum += 2 * h;
          last = { xs, m: ms.m, s: ms.s, iv };
        }
      }
      draw(1);
      const dens = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) * ((x - m) / s)) / (s * Math.sqrt(2 * Math.PI));
      const loop = kit.loop(dt => {
        if (running) { acc += dt * V.rate; const k = Math.floor(acc); if (k > 0) { acc -= k; draw(Math.min(k, 40)); } }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n = Math.max(2, Math.round(V.n)), se = V.sd / Math.sqrt(n), lo = MU - 3.3 * V.sd, hi = MU + 3.3 * V.sd;
        const x0 = 16, x1 = W - 16, X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
        // the population and the latest sample
        const pTop = 22, pBot = Math.round(Hh * 0.36);
        text(c, W < 560 ? 'Population (μ = ' + MU + ' mm, σ = ' + V.sd + ' mm) and the latest sample' : 'Population: true mean ' + MU + ' mm, σ = ' + V.sd + ' mm — dots: the latest sample of ' + n, 12, 11, { size: 11.5, color: C.muted });
        c.beginPath();
        for (let i = 0; i <= 120; i++) { const v = lo + (hi - lo) * i / 120, y = pBot - (pBot - pTop) * dens(v, MU, V.sd) / dens(MU, MU, V.sd); i ? c.lineTo(X(v), y) : c.moveTo(X(v), y); }
        c.lineTo(X(hi), pBot); c.lineTo(X(lo), pBot); c.closePath();
        c.fillStyle = kit.hue(140, 0.18); c.fill();
        c.strokeStyle = kit.hue(140, 0.9); c.lineWidth = 1.5; c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, pBot); c.lineTo(x1, pBot); c.stroke();
        if (last) {
          last.xs.forEach((v, i) => kit.dot(c, X(clamp(v, lo, hi)), pBot - 5 - (i % 4) * 4, 2.6, C.text));
          const iv = last.iv, yb = pBot + 10;
          c.strokeStyle = iv.ok ? C.ok : C.bad; c.lineWidth = 3;
          c.beginPath(); c.moveTo(X(clamp(iv.lo, lo, hi)), yb); c.lineTo(X(clamp(iv.hi, lo, hi)), yb); c.stroke();
          kit.dot(c, X(clamp(iv.m, lo, hi)), yb, 4, iv.ok ? C.ok : C.bad);
        }
        // the stack of recent intervals, newest on top
        const sTop = pBot + 24, sBot = Hh - 18, rowH = (sBot - sTop) / 50;
        c.setLineDash([5, 4]); c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(X(MU), pTop - 4); c.lineTo(X(MU), sBot + 4); c.stroke(); c.setLineDash([]);
        text(c, 'true mean', X(MU) + 5, sBot + 9, { size: 11, color: C.muted });
        text(c, 'the last ' + ivs.length + ' intervals', 12, sBot + 9, { size: 11, color: C.muted });
        for (let i = 0; i < ivs.length; i++) {
          const iv = ivs[ivs.length - 1 - i], y = sTop + (i + 0.5) * rowH;
          c.strokeStyle = iv.ok ? C.ok : C.bad; c.lineWidth = Math.max(1, Math.min(2.5, rowH * 0.55));
          c.beginPath(); c.moveTo(X(clamp(iv.lo, lo, hi)), y); c.lineTo(X(clamp(iv.hi, lo, hi)), y); c.stroke();
          c.fillStyle = C.text; c.fillRect(X(clamp(iv.m, lo, hi)) - 1, y - rowH * 0.4, 2, rowH * 0.8);
        }
        // histogram of all sample means against the theory
        const N = means.length, bw = Math.max(se / 3, (hi - lo) / 150), nb = Math.ceil((hi - lo) / bw), cnt = new Array(nb).fill(0);
        for (const m of means) { const b = Math.floor((m - lo) / bw); if (b >= 0 && b < nb) cnt[b]++; }
        const hist = [];
        if (N) for (let b = 0; b < nb; b++) { const d = cnt[b] / (N * bw); hist.push([lo + b * bw, d], [lo + (b + 1) * bw, d]); }
        const theo = [], pop = [];
        for (let i = 0; i <= 200; i++) { const v = lo + (hi - lo) * i / 200; theo.push([v, dens(v, MU, se)]); pop.push([v, dens(v, MU, V.sd)]); }
        plot.set({
          x: { label: 'sample mean (mm)', min: lo, max: hi }, y: { label: 'density (per mm)', min: 0, max: 1.15 * dens(MU, MU, se) },
          series: [{ pts: hist, label: 'means of your samples', fill: true, width: 1.2 }, { pts: theo, label: 'theory: SE = σ/√n = ' + sig(se, 3) + ' mm', dash: [6, 4] }, { pts: pop, label: 'individuals (σ = ' + V.sd + ' mm)', dash: [2, 3], width: 1.2 }],
          vlines: [{ x: MU, label: 'true mean' }]
        });
        const sdm = meanSd(means).s;
        ro.set('k', String(N));
        ro.set('last', last ? sig(last.m, 4) + ' ± ' + sig(last.s, 3) + ' mm' : '—');
        ro.set('se', sig(se, 3) + ' mm');
        ro.set('sdm', N > 2 ? sig(sdm, 3) + ' mm' : '—');
        ro.set('cov', N ? covered + ' of ' + N + ' (' + (100 * covered / N).toFixed(1) + ' %; aim ' + Math.round(V.conf * 100) + ' %)' : '—');
        ro.set('w', N ? sig(widthSum / N, 3) + ' mm' : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ div-ttest */
  Hyper.sim('div-ttest', {
    title: 'A two-group experiment and its t-test',
    blurb: `Two groups of plants, one given a fertiliser. The treatment adds a true effect Δ to every plant's height, but plants also differ from one another by σ. Each experiment measures n plants per group and runs Welch's t-test: the p-value is the shaded area under the t distribution beyond the observed t. The histogram below collects the p-values of every experiment so far.

**Try this**
- Set the effect to 0 and run 1 000 experiments: about 5 % come out "significant" anyway, and the p-values spread evenly from 0 to 1. Those are false positives.
- Set Δ = 10 mm, σ = 15 mm, n = 8: the power is only about one in five, so most experiments miss a real effect. Raise n until about 80 % are significant (around 36 per group).
- With low power, look at *Average |difference| among significant results*: nearly 19 mm, although the true effect is 10 mm. Underpowered studies that do reach significance exaggerate the effect.
- Watch single experiments with auto-repeat on: the p-value dances wildly from one identical experiment to the next. One p-value is a noisy thing.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio, lg = B.lgamma, BASE = 100;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'eff', label: 'True effect of the treatment Δ', min: -20, max: 20, step: 0.5, value: params.effect != null ? params.effect : 10, unit: 'mm' },
        { id: 'sd', label: 'Variation between plants σ', min: 2, max: 40, step: 1, value: params.sd || 15, unit: 'mm' },
        { id: 'n', label: 'Plants per group n', min: 2, max: 60, step: 1, value: params.n || 8 },
        { id: 'bars', type: 'select', label: 'Error bars show', options: [['95 % confidence interval', 'ci'], ['standard error', 'se'], ['standard deviation', 'sd']], value: 'ci' },
        { id: 'auto', type: 'check', label: 'Repeat the experiment every second', value: true },
        { type: 'buttons', items: [{ id: 'new', label: 'New experiment', primary: true }, { id: 'many', label: 'Run 1 000' }, { id: 'clear', label: 'Clear tally' }] }
      ], (id) => {
        if (id === 'new') experiment();
        else if (id === 'many') { for (let i = 0; i < 1000; i++) experiment(true); experiment(); }
        else if (id === 'clear') clearTally();
        else if (id === 'eff' || id === 'sd' || id === 'n') { clearTally(); experiment(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['diff', 'Difference of means (treated − control)'], ['t', 't (Welch) and degrees of freedom'], ['p', 'p-value, two-sided'], ['d', 'Cohen\'s d, observed'], ['k', 'Experiments so far'], ['sig', 'Significant (p < 0.05)'], ['pow', 'Power in theory'], ['ex', 'Average |difference| among significant results']]);
      const plot = kit.plot(gb, { x: { label: 'p-value', min: 0, max: 1 }, y: { label: 'experiments', min: 0 } }, 150);
      const R = B.rng(1908), gauss = normals(R);
      let cur = null, pvals = [], nsig = 0, sigDiff = 0, acc = 0;
      function clearTally() { pvals = []; nsig = 0; sigDiff = 0; }
      function experiment(quiet) {
        const n = Math.max(2, Math.round(V.n)), a = [], b = [];
        for (let i = 0; i < n; i++) { a.push(BASE + V.sd * gauss()); b.push(BASE + V.eff + V.sd * gauss()); }
        const A = meanSd(a), Bm = meanSd(b), va = A.s * A.s / n, vb = Bm.s * Bm.s / n, se = Math.sqrt(va + vb) || 1e-9;
        const t = (Bm.m - A.m) / se;
        const df = clamp((va + vb) * (va + vb) / (((va * va + vb * vb) / (n - 1)) || 1e-12), 1, 2 * n - 2);
        const p = tP2(t, df, lg), diff = Bm.m - A.m;
        pvals.push(p);
        if (p < 0.05) { nsig++; sigDiff += Math.abs(diff); }
        if (!quiet) cur = { a, b, A, Bm, t, df, p, diff, n, d: diff / (Math.sqrt((A.s * A.s + Bm.s * Bm.s) / 2) || 1e-9), ja: a.map(() => R() - 0.5), jb: b.map(() => R() - 0.5) };
      }
      experiment();
      const tTail = (x, df) => x >= 0 ? tP2(x, df, lg) / 2 : 1 - tP2(-x, df, lg) / 2;
      function power() {
        const n = Math.max(2, Math.round(V.n)), df = 2 * n - 2, tc = tCrit(0.05, df, lg), ncp = Math.abs(V.eff) / (V.sd * Math.sqrt(2 / n));
        return tTail(tc - ncp, df) + tTail(tc + ncp, df);
      }
      let powCache = { key: '', v: 0 };
      const loop = kit.loop(dt => {
        if (V.auto) { acc += dt; if (acc >= 1) { acc = 0; experiment(); } }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, e = cur;
        if (!e) return;
        // left: the two groups
        const L = { x: 10, y: 24, w: W * 0.52, h: Hh - 50 };
        const yMin = BASE + Math.min(0, V.eff) - 3.2 * V.sd, yMax = BASE + Math.max(0, V.eff) + 3.2 * V.sd;
        const Y = v => L.y + (yMax - clamp(v, yMin, yMax)) / (yMax - yMin) * L.h;
        const step = Hyper.niceStep(yMax - yMin, 5);
        c.lineWidth = 1;
        for (let v = Math.ceil(yMin / step) * step; v <= yMax; v += step) {
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(L.x + 34, Y(v)); c.lineTo(L.x + L.w, Y(v)); c.stroke();
          text(c, String(Math.round(v)), L.x + 30, Y(v), { size: 10, color: C.muted, align: 'right' });
        }
        text(c, 'plant height (mm)', L.x, 11, { size: 11, color: C.muted });
        const cols = [{ xs: e.a, j: e.ja, S: e.A, x: L.x + 34 + (L.w - 34) * 0.3, col: C.series[0], name: 'control', tru: BASE }, { xs: e.b, j: e.jb, S: e.Bm, x: L.x + 34 + (L.w - 34) * 0.72, col: C.series[1], name: 'fertilised', tru: BASE + V.eff }];
        const tc1 = tCrit(0.05, Math.max(1, e.n - 1), lg);
        for (const g of cols) {
          c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
          c.beginPath(); c.moveTo(g.x - 44, Y(g.tru)); c.lineTo(g.x + 44, Y(g.tru)); c.stroke(); c.setLineDash([]);
          g.xs.forEach((v, i) => kit.dot(c, g.x - 16 + g.j[i] * 22, Y(v), 3, g.col));
          const half = V.bars === 'sd' ? g.S.s : V.bars === 'se' ? g.S.s / Math.sqrt(e.n) : tc1 * g.S.s / Math.sqrt(e.n);
          const bx = g.x + 22;
          c.strokeStyle = C.text; c.lineWidth = 1.8;
          c.beginPath(); c.moveTo(bx, Y(g.S.m - half)); c.lineTo(bx, Y(g.S.m + half));
          c.moveTo(bx - 5, Y(g.S.m - half)); c.lineTo(bx + 5, Y(g.S.m - half)); c.moveTo(bx - 5, Y(g.S.m + half)); c.lineTo(bx + 5, Y(g.S.m + half)); c.stroke();
          c.strokeStyle = g.col; c.lineWidth = 3;
          c.beginPath(); c.moveTo(g.x - 30, Y(g.S.m)); c.lineTo(bx + 8, Y(g.S.m)); c.stroke();
          text(c, g.name, g.x, L.y + L.h + 14, { size: 12, weight: 600, color: g.col, align: 'center' });
        }
        text(c, 'dashed: true means', L.x + L.w, 11, { size: 10.5, color: C.faint, align: 'right' });
        // right: the t distribution with the observed t
        const Rr = { x: W * 0.56, y: 30, w: W * 0.42, h: Hh - 76 };
        const tMax = Math.max(5, Math.min(12, Math.abs(e.t) * 1.15)), TX = v => Rr.x + (v + tMax) / (2 * tMax) * Rr.w;
        const dmax = tDens(0, e.df, lg), TY = d => Rr.y + Rr.h - d / dmax * Rr.h * 0.9;
        const tc = tCrit(0.05, e.df, lg), at = Math.abs(e.t);
        // shaded tails: the p-value
        for (const sgn of [-1, 1]) {
          const a0 = Math.min(at, tMax), pts = [];
          for (let i = 0; i <= 40; i++) { const v = a0 + (tMax - a0) * i / 40; pts.push([sgn * v, tDens(v, e.df, lg)]); }
          c.beginPath(); c.moveTo(TX(sgn * a0), TY(0));
          for (const q of pts) c.lineTo(TX(q[0]), TY(q[1]));
          c.lineTo(TX(sgn * tMax), TY(0)); c.closePath();
          c.fillStyle = e.p < 0.05 ? kit.hue(0, 0.35) : kit.hue(210, 0.3); c.fill();
        }
        c.beginPath();
        for (let i = 0; i <= 160; i++) { const v = -tMax + 2 * tMax * i / 160; i ? c.lineTo(TX(v), TY(tDens(v, e.df, lg))) : c.moveTo(TX(v), TY(tDens(v, e.df, lg))); }
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(Rr.x, TY(0)); c.lineTo(Rr.x + Rr.w, TY(0)); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.muted;
        for (const s of [-1, 1]) { c.beginPath(); c.moveTo(TX(s * tc), TY(0)); c.lineTo(TX(s * tc), Rr.y + 6); c.stroke(); }
        c.setLineDash([]);
        text(c, '±' + tc.toFixed(2), TX(tc) + 3, Rr.y + 10, { size: 10.5, color: C.muted });
        const tx = TX(clamp(e.t, -tMax, tMax));
        c.strokeStyle = e.p < 0.05 ? C.bad : C.accent; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(tx, TY(0) + 4); c.lineTo(tx, Rr.y + 16); c.stroke();
        text(c, 't = ' + e.t.toFixed(2), tx, Rr.y + 6, { size: 11.5, weight: 700, color: e.p < 0.05 ? C.bad : C.accent, align: tx > Rr.x + Rr.w * 0.75 ? 'right' : tx < Rr.x + Rr.w * 0.25 ? 'left' : 'center' });
        for (const v of [-4, -2, 0, 2, 4]) if (Math.abs(v) < tMax) text(c, String(v), TX(v), TY(0) + 10, { size: 10, color: C.muted, align: 'center' });
        text(c, 'Student\'s t, ' + e.df.toFixed(1) + ' degrees of freedom', Rr.x, 12, { size: 11, color: C.muted });
        text(c, 'p = ' + fmtP(e.p) + (e.p < 0.05 ? ' — significant at 5 %' : ' — not significant'), Rr.x + Rr.w / 2, Hh - 16, { size: 13, weight: 700, color: e.p < 0.05 ? C.bad : C.text, align: 'center' });
        // the tally of p-values
        const bins = new Array(20).fill(0);
        for (const p of pvals) bins[Math.min(19, Math.floor(p * 20))]++;
        const pts = [];
        bins.forEach((k, i) => { pts.push([i / 20, k], [(i + 1) / 20, k]); });
        plot.set({ series: [{ pts, fill: true, label: 'p-values of all experiments', width: 1.2 }], hlines: pvals.length ? [{ y: pvals.length / 20, label: 'even spread: what Δ = 0 gives' }] : [], vlines: [{ x: 0.05, label: '0.05' }] });
        const key = V.eff + '|' + V.sd + '|' + Math.round(V.n);
        if (powCache.key !== key) powCache = { key, v: power() };
        const K = pvals.length;
        ro.set('diff', (e.diff >= 0 ? '+' : '−') + sig(Math.abs(e.diff), 3) + ' mm (true ' + V.eff + ' mm)');
        ro.set('t', e.t.toFixed(2) + ', df = ' + e.df.toFixed(1));
        ro.set('p', fmtP(e.p));
        ro.set('d', e.d.toFixed(2) + ' (true ' + (V.eff / V.sd).toFixed(2) + ')');
        ro.set('k', String(K));
        ro.set('sig', K ? nsig + ' (' + (100 * nsig / K).toFixed(1) + ' %)' : '—');
        ro.set('pow', (100 * powCache.v).toFixed(1) + ' %' + (V.eff === 0 ? ' (= the false-positive rate)' : ''));
        ro.set('ex', nsig ? sig(sigDiff / nsig, 3) + ' mm (true |Δ| = ' + Math.abs(V.eff) + ' mm)' : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ div-chisq */
  const CHI_SCEN = {
    woodlice: { unit: 'woodlice', cats: ['dry, light', 'dry, dark', 'damp, light', 'damp, dark'], h0: [1, 1, 1, 1], alt: [0.08, 0.17, 0.25, 0.5], n: 60, hyp: 'H₀: no preference, a quarter in each zone' },
    mendel: { unit: 'seeds', cats: ['round', 'wrinkled'], h0: [3, 1], alt: [0.62, 0.38], n: 200, hyp: 'H₀: round and wrinkled in a 3 : 1 ratio' },
    dihybrid: { unit: 'seeds', cats: ['round yellow', 'round green', 'wrinkled yellow', 'wrinkled green'], h0: [9, 3, 3, 1], alt: [0.66, 0.09, 0.09, 0.16], n: 160, hyp: 'H₀: 9 : 3 : 3 : 1 (independent assortment)' }
  };
  Hyper.sim('div-chisq', {
    title: 'Counting categories: the chi-square test',
    blurb: `A sample is sorted into categories and the counts are compared with what the null hypothesis predicts, using $\\chi^2 = \\sum (O - E)^2/E$ (computed with the same routine as the genetics calculators). Set how far the truth really departs from the hypothesis — at 0, the hypothesis is exactly true — and repeat the trial many times: the histogram below collects the χ² values, next to the χ² distribution that the p-values come from.

**Try this**
- With the truth equal to H₀, run 1 000 trials: about 5 % exceed the critical value and "reject" a hypothesis that is true — the false-positive rate, fixed by the 5 % level.
- Slide the departure up a little with a small sample: the test usually misses it. Raise the sample size and the same departure is detected almost every time.
- Try the dihybrid cross with linked genes (a departure near 1): the parental classes (round yellow, wrinkled green) are too common — the pattern that revealed linkage.
- With the choice chamber and only 10–15 woodlice, the smallest expected count drops below 5 and the χ² approximation becomes unreliable.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio, lg = B.lgamma;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let scen = CHI_SCEN[params.scenario] ? params.scenario : 'woodlice', S = CHI_SCEN[scen];
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Experiment', options: [['Woodlice in a choice chamber', 'woodlice'], ['Peas: a monohybrid cross (3 : 1)', 'mendel'], ['Peas: a dihybrid cross (9 : 3 : 3 : 1)', 'dihybrid']], value: scen },
        { id: 'n', label: 'Sample size', min: 10, max: 500, step: 5, value: S.n },
        { id: 'dev', label: 'How far the truth departs from H₀', min: 0, max: 1, step: 0.05, value: params.dev || 0 },
        { id: 'auto', type: 'check', label: 'Repeat the trial every second', value: true },
        { type: 'buttons', items: [{ id: 'new', label: 'New trial', primary: true }, { id: 'many', label: 'Run 1 000' }, { id: 'clear', label: 'Clear tally' }] }
      ], (id, v) => {
        if (id === 'scen') { scen = v; S = CHI_SCEN[scen]; ctl.set('n', S.n); clearTally(); trial(); }
        else if (id === 'n' || id === 'dev') { clearTally(); trial(); }
        else if (id === 'new') trial();
        else if (id === 'many') { for (let i = 0; i < 1000; i++) trial(true); trial(); }
        else if (id === 'clear') clearTally();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['chi', 'χ² and degrees of freedom'], ['p', 'p-value'], ['verdict', 'Verdict at the 5 % level'], ['k', 'Trials so far'], ['rej', 'Trials rejecting H₀'], ['emin', 'Smallest expected count']]);
      const plot = kit.plot(gb, { x: { label: 'χ²' }, y: { label: 'density', min: 0 }, legend: true }, 150);
      const R = B.rng(1900);
      let cur = null, chis = [], nrej = 0, acc = 0;
      function clearTally() { chis = []; nrej = 0; }
      function probs() {
        const s0 = S.h0.reduce((a, b) => a + b, 0), p0 = S.h0.map(x => x / s0);
        const pt = p0.map((p, i) => (1 - V.dev) * p + V.dev * S.alt[i]), st2 = pt.reduce((a, b) => a + b, 0);
        return { p0, pt: pt.map(p => p / st2) };
      }
      function trial(quiet) {
        const n = Math.max(2, Math.round(V.n)), P = probs(), k = S.cats.length, obs = new Array(k).fill(0), who = [];
        for (let i = 0; i < n; i++) {
          let u = R(), j = 0;
          while (j < k - 1 && u >= P.pt[j]) { u -= P.pt[j]; j++; }
          obs[j]++;
          if (!quiet && i < 400) who.push({ j, u: R(), v: R() });
        }
        const exp = P.p0.map(p => p * n), res = B.chiSquare(obs, exp);
        chis.push(res.chi2);
        if (res.p < 0.05) nrej++;
        if (!quiet) cur = { obs, exp, res, who, n };
      }
      trial();
      const peaCol = (j) => scen === 'dihybrid' ? (j % 2 === 0 ? 'hsl(48 90% 55%)' : 'hsl(95 55% 45%)') : 'hsl(48 90% 55%)';
      const wrinkled = j => scen === 'mendel' ? j === 1 : scen === 'dihybrid' ? j >= 2 : false;
      const catCol = j => scen === 'woodlice' ? ['hsl(40 70% 60%)', 'hsl(30 35% 45%)', 'hsl(200 60% 60%)', 'hsl(215 45% 40%)'][j] : peaCol(j);
      function pea(c, x, y, r, j, C) {
        c.beginPath();
        if (wrinkled(j)) { for (let i = 0; i <= 28; i++) { const a = i / 28 * Math.PI * 2, rr = r * (1 + 0.13 * Math.sin(7 * a)); i ? c.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)) : c.moveTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } }
        else c.arc(x, y, r, 0, Math.PI * 2);
        c.fillStyle = peaCol(j); c.fill(); c.strokeStyle = C.dark ? 'rgba(0,0,0,.45)' : 'rgba(0,0,0,.3)'; c.lineWidth = 0.8; c.stroke();
      }
      const loop = kit.loop(dt => {
        if (V.auto) { acc += dt; if (acc >= 1) { acc = 0; trial(); } }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, e = cur;
        if (!e) return;
        const k = S.cats.length, df = k - 1, crit = chiCrit(0.05, df, B);
        // left: the sample
        const Lw = W * 0.38, cx = Lw / 2 + 6, cy = Hh / 2 + 6, rad = Math.min(Lw * 0.45, Hh * 0.42);
        text(c, 'One trial: ' + e.n + ' ' + S.unit, 12, 12, { size: 11.5, color: C.muted });
        if (scen === 'woodlice') {
          const zones = [[Math.PI, 1.5 * Math.PI], [1.5 * Math.PI, 2 * Math.PI], [0.5 * Math.PI, Math.PI], [0, 0.5 * Math.PI]];
          zones.forEach((z, j) => {
            c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, rad, z[0], z[1]); c.closePath();
            c.fillStyle = catCol(j); c.globalAlpha = 0.35; c.fill(); c.globalAlpha = 1;
          });
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, rad, 0, Math.PI * 2); c.stroke();
          c.beginPath(); c.moveTo(cx - rad, cy); c.lineTo(cx + rad, cy); c.moveTo(cx, cy - rad); c.lineTo(cx, cy + rad); c.stroke();
          for (const w of e.who) {
            const z = zones[w.j], a = z[0] + (0.12 + 0.76 * w.u) * (z[1] - z[0]), rr = rad * (0.18 + 0.74 * Math.sqrt(w.v));
            const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
            c.save(); c.translate(x, y); c.rotate(a * 3 + w.u * 6);
            c.beginPath(); c.ellipse ? c.ellipse(0, 0, 4.2, 2.6, 0, 0, Math.PI * 2) : c.arc(0, 0, 3, 0, Math.PI * 2);
            c.fillStyle = C.dark ? 'hsl(220 8% 72%)' : 'hsl(220 8% 38%)'; c.fill(); c.restore();
          }
          const lab = [['dry, light', -1, -1], ['dry, dark', 1, -1], ['damp, light', -1, 1], ['damp, dark', 1, 1]];
          lab.forEach(([s, sx, sy]) => text(c, s, cx + sx * rad * 0.55, cy + sy * (rad + 9), { size: 10.5, color: C.muted, align: 'center' }));
        } else {
          const show = e.who.length, cols = Math.max(1, Math.ceil(Math.sqrt(show * (Lw - 20) / (Hh - 50)))), rows = Math.ceil(show / cols);
          const cell = Math.min((Lw - 20) / cols, (Hh - 50) / Math.max(1, rows)), order = e.who.slice().sort((a, b) => a.j - b.j);
          order.forEach((w, i) => pea(c, 14 + (i % cols + 0.5) * cell, 28 + (Math.floor(i / cols) + 0.5) * cell, Math.max(1.5, cell * 0.38), w.j, C));
          if (e.n > show) text(c, '(first ' + show + ' shown)', 12, Hh - 10, { size: 10.5, color: C.muted });
        }
        // right: observed against expected, and each category's share of χ²
        const Bx = W * 0.42, Bw = W - Bx - 12, top = 40, base = Hh - 58, gw = Bw / k;
        const ymax = Math.max(...e.obs, ...e.exp) * 1.15 || 1, Yb = v => base - v / ymax * (base - top);
        text(c, S.hyp, Bx, 12, { size: 11.5, color: C.muted });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(Bx, base); c.lineTo(Bx + Bw, base); c.stroke();
        for (let j = 0; j < k; j++) {
          const x = Bx + j * gw + gw * 0.18, w = gw * 0.3, O = e.obs[j], E = e.exp[j];
          c.fillStyle = catCol(j); c.fillRect(x, Yb(O), w, base - Yb(O));
          c.setLineDash([4, 3]); c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(x + w + 3, Yb(E), w, base - Yb(E)); c.setLineDash([]);
          text(c, String(O), x + w / 2, Yb(O) - 8, { size: 11.5, weight: 700, color: C.text, align: 'center' });
          text(c, E.toFixed(1), x + w * 1.5 + 3, Yb(E) - 8, { size: 10.5, color: C.muted, align: 'center' });
          text(c, S.cats[j], x + w + 1.5, base + 12, { size: 10.5, color: C.text, align: 'center' });
          const part = E > 0 ? (O - E) * (O - E) / E : 0;
          text(c, '+' + part.toFixed(2), x + w + 1.5, base + 27, { size: 10.5, color: part > crit / k ? C.warn : C.muted, align: 'center' });
        }
        text(c, 'solid: observed O    dashed: expected E    under each: (O − E)²/E', Bx, 27, { size: 10, color: C.faint });
        const rj = e.res.p < 0.05;
        text(c, 'χ² = ' + e.res.chi2.toFixed(2) + ',  df = ' + df + ',  p = ' + fmtP(e.res.p) + (rj ? '  → reject H₀' : '  → no evidence against H₀'), Bx + Bw / 2, Hh - 12, { size: 12.5, weight: 700, color: rj ? C.bad : C.ok, align: 'center' });
        // the tally against the χ² distribution
        const xmax = Math.max(crit * 2.4, 10), nb = 40, bw = xmax / nb, cnt = new Array(nb).fill(0);
        let over = 0;
        for (const x of chis) { const b = Math.floor(x / bw); if (b < nb) cnt[b]++; else over++; }
        const N = chis.length, hist = [], dens = [];
        if (N) for (let b = 0; b < nb; b++) { const d = cnt[b] / (N * bw); hist.push([b * bw, d], [(b + 1) * bw, d]); }
        for (let i = 0; i <= 160; i++) { const x = bw / 2 + (xmax - bw / 2) * i / 160; dens.push([x, chiDens(x, df, lg)]); }
        const hmax = Math.max(0, ...hist.map(q => q[1])), ytop = Math.max(hmax, chiDens(Math.max(bw, 0.6), df, lg)) * 1.15;
        plot.set({
          x: { label: 'χ²', min: 0, max: xmax }, y: { label: 'density', min: 0, max: ytop || 1 },
          series: [{ pts: hist, fill: true, label: 'χ² of your trials', width: 1.2 }, { pts: dens, dash: [6, 4], label: 'χ² distribution, ' + df + ' df (H₀ true)' }],
          vlines: [{ x: crit, label: '5 %: ' + crit.toFixed(2) }, { x: Math.min(e.res.chi2, xmax), label: 'this trial', color: rj ? C.bad : C.accent }]
        });
        ro.set('chi', e.res.chi2.toFixed(2) + ' with ' + df + ' df (critical ' + crit.toFixed(2) + ')');
        ro.set('p', fmtP(e.res.p));
        ro.set('verdict', rj ? 'reject H₀' : 'do not reject H₀');
        ro.set('k', String(N) + (over ? ' (' + over + ' beyond the graph)' : ''));
        ro.set('rej', N ? nrej + ' (' + (100 * nrej / N).toFixed(1) + ' %)' : '—');
        const em = Math.min(...e.exp);
        ro.set('emin', em.toFixed(1) + (em < 5 ? ' — below 5: unreliable' : ''));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ div-dilution */
  const SCHEMES = {
    s10a: { t: 0.1, d: 0.9, label: '1 : 10 — 0.1 mL into 0.9 mL' },
    s10b: { t: 1, d: 9, label: '1 : 10 — 1 mL into 9 mL' },
    s2: { t: 0.5, d: 0.5, label: '1 : 2 — 0.5 mL into 0.5 mL' },
    s5: { t: 0.2, d: 0.8, label: '1 : 5 — 0.2 mL into 0.8 mL' },
    s100: { t: 0.1, d: 9.9, label: '1 : 100 — 0.1 mL into 9.9 mL' }
  };
  const DYE_EPS = 130000;          // L/(mol·cm): a blue food dye (Brilliant Blue FCF) near 630 nm
  function fmtConcM(M) {           // mol/L -> a readable concentration
    if (!(M > 0)) return '0';
    if (M >= 1e-3) return sig(M * 1e3, 2) + ' mM';
    if (M >= 1e-6) return sig(M * 1e6, 2) + ' µM';
    if (M >= 1e-9) return sig(M * 1e9, 2) + ' nM';
    return sig(M * 1e12, 2) + ' pM';
  }
  Hyper.sim('div-dilution', {
    title: 'A serial dilution',
    blurb: `A stock is diluted step by step: a small volume goes from each tube into fresh diluent, is mixed, and the next transfer is taken from the new tube. After n steps of factor D the concentration has fallen by Dⁿ. In the yeast mode, a small volume from each of the last three tubes is spread on an agar plate; every colony grew from one cell, and only plates with 30–300 colonies are counted: CFU per mL = colonies ÷ (dilution × volume plated).

**Try this**
- With tenfold steps, find the tube whose plate has 30–300 colonies, and check the estimate against the true concentration. Press *Plate again*: counts vary by about ±√(count) — the reason very small counts are not trusted.
- Change the culture to 10⁷ cells per mL: now only the early tubes give countable plates. Choose how many tubes a culture really needs.
- Switch to 1 : 2 steps: eight tubes dilute only 256-fold — fine for making a set of standards, useless for counting bacteria or yeast.
- In the dye mode, watch the blue fade and look for the tubes whose absorbance lies between 0.1 and 1 — the range a spectrophotometer reads best.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What is being diluted', options: [['A yeast culture — count by plating', 'cells'], ['A blue dye — watch the colour', 'dye']], value: params.mode === 'dye' ? 'dye' : 'cells' },
        { id: 'stock', label: 'Cells in the culture', min: 1e6, max: 1e10, value: 2.4e9, log: true, sig: 2, fmt: v => sci(v, 2) + ' per mL' },
        { id: 'dye', label: 'Dye in the stock', min: 0.01, max: 10, value: 1, log: true, sig: 2, unit: 'mM' },
        { id: 'scheme', type: 'select', label: 'Each step', options: Object.keys(SCHEMES).map(k => [SCHEMES[k].label, k]), value: 's10a' },
        { id: 'tubes', label: 'Number of tubes', min: 1, max: 8, step: 1, value: 7 },
        { id: 'plated', type: 'select', label: 'Volume spread on each plate', options: [['0.1 mL', 0.1], ['0.2 mL', 0.2], ['1 mL (pour plate)', 1]], value: 0.1 },
        { type: 'buttons', items: [{ id: 'plate', label: 'Plate again', primary: true }] }
      ], (id) => { if (id === 'mode') showMode(); plate(id === 'plate'); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['df', 'Dilution factor per step'], ['tot', 'Total dilution in the last tube'], ['last', 'Concentration in the last tube'], ['est', 'Estimate from the countable plates'], ['true', 'True concentration of the stock']]);
      const R = B.rng(1887), gauss = normals(R);
      let plates = [], phase = 0;
      const scheme = () => SCHEMES[V.scheme] || SCHEMES.s10a;
      const factor = () => { const s = scheme(); return (s.t + s.d) / s.t; };
      const nT = () => Math.max(1, Math.round(V.tubes));
      // concentration in tube i (0 = the stock): cells per mL, or mol/L of dye
      const conc = i => (V.mode === 'dye' ? V.dye * 1e-3 : V.stock) / Math.pow(factor(), i);
      function dilLabel(i) {
        const D = factor(), e = Math.log10(D);
        if (i === 0) return 'undiluted';
        if (Math.abs(e - Math.round(e)) < 1e-9) return pow10(-Math.round(e) * i);
        return '1/' + group(Math.pow(D, i));
      }
      function showMode() { const cells = V.mode !== 'dye'; ctl.show('stock', cells); ctl.show('dye', !cells); ctl.show('plated', cells); ctl.show('plate', cells); }
      function plate(fresh) {
        if (!fresh && plates.length && plates.key === V.stock + '|' + V.scheme + '|' + nT() + '|' + V.plated) return;
        plates = [];
        const n = nT();
        for (let i = Math.max(1, n - 2); i <= n; i++) {
          const lam = conc(i) * V.plated, k = poisson(lam, R, gauss), pts = [];
          for (let j = 0; j < Math.min(k, 420); j++) { const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 0.92; pts.push([r * Math.cos(a), r * Math.sin(a), 0.7 + 0.6 * R()]); }
          plates.push({ i, lam, k, pts });
        }
        plates.key = V.stock + '|' + V.scheme + '|' + nT() + '|' + V.plated;
      }
      showMode();
      plate(true);
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, n = nT(), s = scheme(), D = factor(), dye = V.mode === 'dye';
        plate(false);
        phase = (phase + dt / 1.8) % n;
        // tubes: the stock and n dilution tubes
        const tTop = 34, tH = Math.min(96, Hh * 0.26), tW = Math.min(28, W / (n + 2) * 0.45), gap = (W - 60) / (n + 1), X = i => 34 + i * gap;
        const cap = (s.t + s.d) * 1.3;
        text(c, dye ? 'Brilliant blue dye, ε ≈ 130 000 L mol⁻¹ cm⁻¹' : 'A yeast culture and its tenfold (or other) dilutions', 12, 12, { size: 11.5, color: C.muted });
        for (let i = 0; i <= n; i++) {
          const x = X(i), vol = i === 0 ? cap * 0.85 : i === n ? s.t + s.d : s.d, lvl = clamp(vol / cap, 0.08, 0.95);
          const cc = conc(i);
          let col, alpha;
          if (dye) { const A = DYE_EPS * cc * 1.2; alpha = clamp(1 - Math.pow(10, -A), 0, 0.95); col = 'hsl(222 85% 45%)'; }
          else { alpha = clamp((Math.log10(Math.max(cc, 1)) - 6) / 3.5, 0, 0.85); col = C.dark ? 'hsl(45 45% 80%)' : 'hsl(42 40% 62%)'; }
          const w = i === 0 ? tW * 1.5 : tW, y0 = tTop, y1 = tTop + tH, ly = y1 - (y1 - y0) * lvl;
          // liquid
          c.save();
          rrect(c, x - w / 2, y0, w, tH, [2, 2, w / 2, w / 2]); c.clip();
          c.fillStyle = C.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; c.fillRect(x - w / 2, ly, w, y1 - ly);
          c.globalAlpha = alpha; c.fillStyle = col; c.fillRect(x - w / 2, ly, w, y1 - ly); c.globalAlpha = 1;
          c.restore();
          rrect(c, x - w / 2, y0, w, tH, [2, 2, w / 2, w / 2]); c.strokeStyle = C.text; c.lineWidth = 1.3; c.stroke();
          text(c, i === 0 ? 'stock' : String(i), x, y0 - 8, { size: 10.5, color: C.muted, align: 'center' });
          text(c, dilLabel(i), x, y1 + 12, { size: 11, weight: 600, color: C.text, align: 'center' });
          text(c, dye ? fmtConcM(cc) : sci(cc, 2), x, y1 + 27, { size: 10, color: C.muted, align: 'center' });
        }
        text(c, dye ? '' : 'cells per mL', X(0) - 22, tTop + tH + 27, { size: 10, color: C.faint, align: 'right' });
        // the pipette making the current transfer
        const k = Math.floor(phase), f = phase - k, xa = X(k), xb = X(Math.min(n, k + 1)), tipY = tTop - 4;
        const px = f < 0.35 ? xa : f < 0.65 ? xa + (xb - xa) * (f - 0.35) / 0.3 : xb, py = tipY - 30 + (f < 0.2 || f > 0.8 ? 12 : 0);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py - 26); c.stroke();
        c.fillStyle = C.accent; c.fillRect(px - 4, py - 34, 8, 9);
        if (f > 0.1 && f < 0.85) kit.dot(c, px, py + 3, 3, dye ? 'hsl(222 85% 55%)' : (C.dark ? 'hsl(45 45% 80%)' : 'hsl(42 40% 55%)'));
        const cap2 = 'Transfer ' + s.t + ' mL from ' + (k === 0 ? 'the stock' : 'tube ' + k) + ' into tube ' + (k + 1) + ' (' + s.d + ' mL), mix → ' + dilLabel(k + 1);
        text(c, cap2, W / 2, tTop + tH + 46, { size: 11.5, color: C.accent, align: 'center' });
        // bottom: plates (cells) or absorbances (dye)
        const bTop = tTop + tH + 62, bH = Hh - bTop - 8;
        if (!dye) {
          const np = plates.length, pr = Math.max(20, Math.min(bH / 2 - 16, (W - 30) / np / 2 - 12));
          plates.forEach((p, j) => {
            const cx = W * (j + 0.5) / np, cy = bTop + pr + 2;
            c.beginPath(); c.arc(cx, cy, pr, 0, Math.PI * 2);
            c.fillStyle = C.dark ? 'hsl(40 25% 22%)' : 'hsl(40 45% 88%)'; c.fill();
            c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke();
            c.fillStyle = C.dark ? 'hsl(45 60% 85%)' : 'hsl(35 35% 45%)';
            for (const q of p.pts) { c.beginPath(); c.arc(cx + q[0] * pr, cy + q[1] * pr, Math.max(1, pr / 40) * q[2], 0, Math.PI * 2); c.fill(); }
            const ok = p.k >= 30 && p.k <= 300, many = p.k > 300;
            const lab = many ? 'too many to count' : p.k < 30 ? p.k + ' colonies — too few' : p.k + ' colonies ✓';
            text(c, 'tube ' + p.i + ' (' + dilLabel(p.i) + '), ' + V.plated + ' mL', cx, cy + pr + 11, { size: 10.5, color: C.muted, align: 'center' });
            text(c, lab, cx, cy + pr + 25, { size: 11.5, weight: 700, color: ok ? C.ok : many ? C.warn : C.bad, align: 'center' });
          });
        } else {
          const x0 = X(1) - tW, x1 = X(n) + tW, Ay = v => bTop + bH - 14 - clamp(v, 0, 2.5) / 2.5 * (bH - 28);
          c.fillStyle = kit.hue(140, 0.15); c.fillRect(x0, Ay(1), x1 - x0, Ay(0.1) - Ay(1));
          text(c, 'absorbance in a 1 cm cuvette — the shaded band (0.1–1) reads most accurately', x0, bTop + 4, { size: 10.5, color: C.muted });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, Ay(0)); c.lineTo(x1, Ay(0)); c.stroke();
          for (let i = 1; i <= n; i++) {
            const A = DYE_EPS * conc(i), x = X(i), good = A >= 0.1 && A <= 1;
            c.fillStyle = good ? C.ok : C.faint; c.fillRect(x - tW * 0.35, Ay(A), tW * 0.7, Ay(0) - Ay(A));
            text(c, A > 2.5 ? '> 2.5' : A < 0.001 ? '≈ 0' : sig(A, 2), x, Ay(Math.min(A, 2.5)) - 8, { size: 10, color: good ? C.ok : C.muted, align: 'center' });
          }
        }
        // read-outs
        const tot = Math.pow(D, n);
        ro.set('df', sig(D, 3) + ' (' + s.t + ' mL + ' + s.d + ' mL)');
        ro.set('tot', (Math.abs(Math.log10(D) - Math.round(Math.log10(D))) < 1e-9 ? pow10(Math.round(Math.log10(tot))) + '-fold' : group(tot) + '-fold'));
        ro.set('last', dye ? fmtConcM(conc(n)) : sci(conc(n), 3) + ' cells per mL');
        if (dye) {
          const good = [];
          for (let i = 1; i <= n; i++) { const A = DYE_EPS * conc(i); if (A >= 0.1 && A <= 1) good.push(i); }
          ro.set('est', good.length ? (good.length > 1 ? 'tubes ' + good.join(' and ') + ' are' : 'tube ' + good[0] + ' is') + ' in the reading range' : 'no tube in the reading range (A 0.1–1)');
          ro.set('true', fmtConcM(V.dye * 1e-3));
        } else {
          const cnt = plates.filter(p => p.k >= 30 && p.k <= 300);
          if (cnt.length) {
            // all countable plates together: total colonies over the total volume of original culture plated
            // (for a single plate this is exactly kit.bio.cfu)
            const est = cnt.length === 1 ? B.cfu(cnt[0].k, 1 / Math.pow(D, cnt[0].i), V.plated)
              : cnt.reduce((a, p) => a + p.k, 0) / cnt.reduce((a, p) => a + V.plated / Math.pow(D, p.i), 0);
            ro.set('est', sci(est, 3) + ' CFU per mL (' + ((est / V.stock - 1) * 100 >= 0 ? '+' : '−') + Math.abs((est / V.stock - 1) * 100).toFixed(0) + ' %)');
          } else ro.set('est', 'no plate with 30–300 colonies');
          ro.set('true', sci(V.stock, 3) + ' cells per mL');
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ div-standard */
  Hyper.sim('div-standard', {
    title: 'A standard curve with the Beer–Lambert law',
    blurb: `p-Nitrophenol is yellow in alkaline solution and absorbs strongly at 405 nm (ε ≈ 18 000 L mol⁻¹ cm⁻¹) — enzyme assays measure it to follow phosphatases. A set of standards of known concentration is measured, with a little pipetting and reading error. Fit a straight line through them yourself with the two sliders, then compare it with the least-squares line, and use it to find the concentration of the unknown sample.

**Try this**
- Adjust the slope and intercept until your sum of squared residuals is as small as you can make it, then tick *Show the least-squares line* — how close did you get?
- Put each tube in the beam: absorbance doubles when the concentration doubles, but the light transmitted falls from 10 % to 1 % between A = 1 and A = 2.
- Include the two high standards: the points bend below the line, because stray light reaching the detector caps the absorbance. The fitted slope drops and every reading is skewed — keep standards in the linear range, and dilute samples that read too high.
- Raise the pipetting error and make new sets: the fitted ε wobbles, and R² falls. Reveal the unknown to see how far off each line was.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio, EPS = 18000, PATH = 1, STRAY = 0.004;
      const STD = [0, 10, 20, 40, 60, 80], HIGH = [120, 160];
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const tubeOpts = [['blank (0 µM)', 0]].concat(STD.slice(1).concat(HIGH).map((v, i) => [v + ' µM standard', i + 1]), [['the unknown sample', 99]]);
      const ctl = kit.controls(box.side, [
        { id: 'slope', label: 'Your line: slope (A per µM)', min: 0.004, max: 0.03, step: 0.0002, value: 0.012, sig: 3 },
        { id: 'icpt', label: 'Your line: intercept (A)', min: -0.2, max: 0.2, step: 0.005, value: 0.05 },
        { id: 'fit', type: 'check', label: 'Show the least-squares line', value: false },
        { id: 'high', type: 'check', label: 'Include two high standards (120 and 160 µM)', value: false },
        { id: 'noise', label: 'Pipetting error', min: 0, max: 10, step: 0.5, value: 3, unit: '%' },
        { id: 'tube', type: 'select', label: 'Tube in the beam', options: tubeOpts, value: 99 },
        { type: 'buttons', items: [{ id: 'new', label: 'New set of measurements', primary: true }, { id: 'reveal', label: 'Reveal the unknown' }] }
      ], (id) => {
        if (id === 'new' || id === 'noise') measure();
        else if (id === 'reveal') revealed = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['user', 'Your line'], ['ssr', 'Sum of squared residuals: yours / best'], ['ls', 'Least-squares line'], ['r2', 'R² of the least-squares line'], ['eps', 'ε from the least-squares slope'], ['au', 'The unknown: absorbance'], ['cu', 'The unknown from your line'], ['cl', 'The unknown from the least-squares line'], ['true', 'The unknown, true concentration']]);
      const plot = kit.plot(gb, { x: { label: 'concentration (µM)', min: 0 }, y: { label: 'absorbance at 405 nm', min: 0 }, legend: true }, 220);
      const R = B.rng(405), gauss = normals(R);
      let set = null, revealed = false, hits = [];
      // what the instrument reads for a true absorbance: stray light s caps it near −log10(s)
      const reading = A => -Math.log10((Math.pow(10, -A) + STRAY) / (1 + STRAY));
      const trueA = cM => EPS * PATH * cM * 1e-6;
      function measure() {
        const err = V.noise / 100, one = cM => Math.max(-0.02, reading(trueA(Math.max(0, cM * (1 + err * gauss())))) + 0.004 * gauss());
        const cu = 15 + 60 * R();
        set = { std: STD.map(cM => ({ c: cM, A: cM === 0 ? 0.004 * gauss() : one(cM) })), high: HIGH.map(cM => ({ c: cM, A: one(cM) })), cu, Au: one(cu) };
        revealed = false;
      }
      measure();
      function lsq(pts) {
        const n = pts.length, mx = pts.reduce((a, p) => a + p.c, 0) / n, my = pts.reduce((a, p) => a + p.A, 0) / n;
        let sxy = 0, sxx = 0, syy = 0;
        for (const p of pts) { sxy += (p.c - mx) * (p.A - my); sxx += (p.c - mx) * (p.c - mx); syy += (p.A - my) * (p.A - my); }
        const m = sxx > 0 ? sxy / sxx : 0, b = my - m * mx;
        return { m, b, r2: syy > 0 && sxx > 0 ? sxy * sxy / (sxx * syy) : 1 };
      }
      kit.click(st, p => { for (const h of hits) if (inside(p, h)) { ctl.set('tube', h.v); return; } }, p => hits.some(h => inside(p, h)));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const pts = set.std.concat(V.high ? set.high : []), L = lsq(pts);
        const ssr = (m, b) => pts.reduce((a, p) => a + (p.A - (m * p.c + b)) * (p.A - (m * p.c + b)), 0);
        const tubes = [{ v: 0, c: 0, A: set.std[0].A, name: 'blank' }].concat(set.std.slice(1).map((p, i) => ({ v: i + 1, c: p.c, A: p.A, name: String(p.c) })), set.high.map((p, i) => ({ v: STD.length + i, c: p.c, A: p.A, name: String(p.c) })), [{ v: 99, c: set.cu, A: set.Au, name: '?' }]);
        const sel = tubes.find(t => t.v === V.tube) || tubes[tubes.length - 1];
        // the spectrophotometer
        const midY = Hh * 0.5, T = Math.pow(10, -Math.max(0, sel.A)), narrow = W < 560, sx = narrow ? 0.62 : 0.56;
        const lampX = W * 0.06, filtX = W * 0.17, cuvX = W * 0.3, detX = W * 0.42;
        const glow = c.createRadialGradient ? c.createRadialGradient(lampX, midY, 2, lampX, midY, 26) : null;
        if (glow && glow.addColorStop) { glow.addColorStop(0, 'hsl(50 100% 75%)'); glow.addColorStop(1, 'hsla(50, 100%, 60%, 0)'); c.fillStyle = glow; c.beginPath(); c.arc(lampX, midY, 26, 0, Math.PI * 2); c.fill(); }
        kit.dot(c, lampX, midY, 8, 'hsl(50 100% 65%)', C.text);
        c.fillStyle = 'hsla(275, 90%, 60%, 0.5)'; c.fillRect(lampX + 10, midY - 4, cuvX - lampX - 10, 8);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(filtX - 6, midY - 26, 12, 52); c.strokeRect(filtX - 6, midY - 26, 12, 52);
        text(c, '405 nm', filtX, midY + 38, { size: 10.5, color: C.muted, align: 'center' });
        c.globalAlpha = 0.15 + 0.85 * T; c.fillStyle = 'hsla(275, 90%, 60%, 0.5)'; c.fillRect(cuvX + 22, midY - 4, detX - cuvX - 22, 8); c.globalAlpha = 1;
        c.fillStyle = 'hsl(52 95% 50%)'; c.globalAlpha = clamp(1 - T, 0.03, 0.95); c.fillRect(cuvX - 20, midY - 34, 40, 68); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(cuvX - 20, midY - 34, 40, 68);
        text(c, 'cuvette, 1 cm', cuvX, midY + 46, { size: 10.5, color: C.muted, align: 'center' });
        rrect(c, detX, midY - 30, W * sx - detX, 60, 6); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.stroke();
        text(c, 'T = ' + (100 * T).toFixed(1) + ' %', detX + 10, midY - 11, { size: narrow ? 11 : 13, weight: 700, color: C.text });
        text(c, 'A = ' + sel.A.toFixed(3), detX + 10, midY + 11, { size: narrow ? 11 : 13, weight: 700, color: C.accent });
        text(c, 'In the beam: ' + (sel.v === 99 ? 'the unknown' : sel.v === 0 ? 'the blank' : sel.c + ' µM standard'), 12, 12, { size: 11.5, color: C.muted });
        // the rack: click a tube to measure it
        hits = [];
        const rx0 = W * (sx + 0.03), rw = W - rx0 - 8, show = tubes.filter(t => V.high || t.v < STD.length || t.v === 99), tw = Math.min(22, rw / show.length * 0.7), gapR = rw / show.length;
        text(c, 'click a tube to measure it', rx0, Hh - 10, { size: 10, color: C.faint });
        show.forEach((t, i) => {
          const x = rx0 + (i + 0.5) * gapR, y0 = midY - 34, h = 62, isSel = t.v === sel.v, Tt = Math.pow(10, -Math.max(0, trueA(t.c)));
          c.fillStyle = 'hsl(52 95% 50%)'; c.globalAlpha = clamp(1 - Tt, 0.03, 0.95); c.fillRect(x - tw / 2, y0 + 14, tw, h - 14); c.globalAlpha = 1;
          c.strokeStyle = isSel ? C.accent : C.muted; c.lineWidth = isSel ? 2.4 : 1.1; c.strokeRect(x - tw / 2, y0, tw, h);
          text(c, t.name, x, y0 + h + 11, { size: 10, color: isSel ? C.accent : C.muted, align: 'center', weight: isSel ? 700 : 400 });
          hits.push({ x: x - gapR / 2, y: y0 - 4, w: gapR, h: h + 22, v: t.v });
        });
        // the graph
        const xmax = V.high ? 170 : 100, ymax = V.high ? 2.4 : 1.7;
        const line = (m, b) => [[0, b], [xmax, m * xmax + b]];
        const stdPts = set.std.map(p => [p.c, p.A]), highPts = set.high.map(p => [p.c, p.A]);
        const cUser = V.slope > 0 ? (set.Au - V.icpt) / V.slope : NaN, cLs = L.m > 0 ? (set.Au - L.b) / L.m : NaN;
        const series = [{ pts: stdPts, line: false, dots: 4.5, label: 'standards' }, { pts: line(V.slope, V.icpt), label: 'your line', width: 2 }];
        if (V.fit) series.push({ pts: line(L.m, L.b), dash: [6, 4], label: 'least squares', width: 1.8 });
        if (V.high) series.push({ pts: highPts, line: false, dots: 4.5, label: 'high standards' });
        const curve = [];
        for (let i = 0; i <= 60; i++) { const cc = xmax * i / 60; curve.push([cc, reading(trueA(cc))]); }
        if (V.high) series.push({ pts: curve, dash: [2, 3], width: 1.2, label: 'what the instrument reads (no errors)' });
        const marks = [];
        if (Number.isFinite(cUser)) marks.push({ x: cUser, y: set.Au, label: 'your reading', color: C.series[1] });
        if (V.fit && Number.isFinite(cLs)) marks.push({ x: cLs, y: set.Au, color: C.series[2] });
        plot.set({ x: { label: 'concentration (µM)', min: 0, max: xmax }, y: { label: 'absorbance at 405 nm', min: 0, max: ymax }, series, marks, hlines: [{ y: set.Au, label: 'the unknown, A = ' + set.Au.toFixed(3) }], vlines: revealed ? [{ x: set.cu, label: 'true ' + set.cu.toFixed(1) + ' µM', color: C.ok }] : [] });
        ro.set('user', 'A = ' + V.slope.toFixed(4) + ' c ' + (V.icpt >= 0 ? '+ ' : '− ') + Math.abs(V.icpt).toFixed(3));
        ro.set('ssr', ssr(V.slope, V.icpt).toFixed(4) + ' / ' + ssr(L.m, L.b).toFixed(4));
        ro.set('ls', V.fit ? 'A = ' + L.m.toFixed(4) + ' c ' + (L.b >= 0 ? '+ ' : '− ') + Math.abs(L.b).toFixed(3) : 'tick the box to show');
        ro.set('r2', V.fit ? L.r2.toFixed(4) : '—');
        ro.set('eps', V.fit ? group(L.m * 1e6 / PATH) + ' L mol⁻¹ cm⁻¹ (true 18 000)' : '—');
        ro.set('au', set.Au.toFixed(3));
        ro.set('cu', Number.isFinite(cUser) ? cUser.toFixed(1) + ' µM' : '—');
        ro.set('cl', V.fit && Number.isFinite(cLs) ? cLs.toFixed(1) + ' µM' : '—');
        ro.set('true', revealed ? set.cu.toFixed(1) + ' µM' : 'press Reveal');
      }, box.stage);
      loop.start();
    }
  });

})();
