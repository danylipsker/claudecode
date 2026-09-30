/* The Puzzle Cabinet · data/rope-riddles.js
 * Riddles and problems about ropes, strings and tethers, retold in our own words.
 * Figures are small inline drawings on the paper card (real colours, not theme tokens). */
(function () {
  'use strict';
  const INK = '#3a2e1c', ROPE = '#9a6a30', ROPE2 = '#d6a562';
  // a rope drawn along a path: dark edge, light twisted core
  const rope = (d, w) => '<path d="' + d + '" fill="none" stroke="' + ROPE + '" stroke-width="' + (w || 5) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + ROPE2 + '" stroke-width="' + ((w || 5) * 0.45).toFixed(1) + '" stroke-dasharray="3 2.5" stroke-linecap="round"/>';
  const txt = (x, y, s, o) => '<text x="' + x + '" y="' + y + '" font-family="Georgia, serif" font-size="' + ((o && o.size) || 14) + '" fill="' + ((o && o.fill) || INK) + '"' + (o && o.anchor ? ' text-anchor="' + o.anchor + '"' : '') + (o && o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>';
  const line = (d, o) => '<path d="' + d + '" fill="none" stroke="' + ((o && o.stroke) || INK) + '" stroke-width="' + ((o && o.w) || 2) + '"' + (o && o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + ' stroke-linecap="round" stroke-linejoin="round"/>';
  const arrow = (x1, y1, x2, y2, col) => { const a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a); return line('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2, { stroke: col || INK, w: 1.6 }) + '<path d="M' + x2 + ' ' + y2 + 'l' + (-8 * c + 4 * s).toFixed(1) + ' ' + (-8 * s - 4 * c).toFixed(1) + 'l' + (-8 * s).toFixed(1) + ' ' + (8 * c).toFixed(1) + 'z" fill="' + (col || INK) + '" transform="translate(0 0)"/>'; };
  const person = (x, y, s) => { s = s || 1; return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"><circle cx="0" cy="-58" r="10" fill="#f3e3c3"/><path d="M0 -48V-8M0 -8L-12 28M0 -8L12 28"/></g>'; };

  const earth = '<path d="M0 125A340 340 0 0 1 400 125V160H0Z" fill="#a9cfe9"/><path d="M235 80Q280 71 330 84Q322 110 272 112Q242 104 235 80Z" fill="#a7c985"/><path d="M0 125A340 340 0 0 1 400 125" fill="none" stroke="' + INK + '" stroke-width="2"/>';

  const goat = (x, y) => '<g transform="translate(' + x + ' ' + y + ')"><ellipse cx="0" cy="0" rx="13" ry="8" fill="#f4f1e8" stroke="' + INK + '" stroke-width="1.6"/><circle cx="13" cy="-7" r="5.5" fill="#f4f1e8" stroke="' + INK + '" stroke-width="1.6"/><path d="M11 -12l-3 -6M15 -12l2 -6M-7 7v8M6 7v8" stroke="' + INK + '" stroke-width="1.6" fill="none"/></g>';

  const RIDDLES = [
    // ---------- easy ----------
    {
      id: 'rope-cutting', title: 'Ten Metres, Ten Pieces', diff: 1,
      text: 'A ten-metre rope is to be cut into ten pieces a metre long. Each cut takes the rope-maker one minute. How many minutes does the whole job take?',
      hints: ['How many cuts make ten pieces?'],
      explain: '**9 minutes**: nine cuts make ten pieces — the last metre is already a piece when the ninth cut is made. It is the fence-post mistake in rope form.',
      data: {
        answer: { num: 9, unit: 'minutes' },
        traps: [{ match: 10, msg: 'Count the cuts, not the pieces.' }],
        figure: { w: 400, h: 90, svg: rope('M20 45H380', 8) + [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => line('M' + (20 + i * 36) + ' 28V62', { stroke: '#c0392b', w: 1.6, dash: '3 3' })).join('') + txt(200, 84, '10 m', { anchor: 'middle' }) }
      }
    },
    {
      id: 'rope-ladder-tide', title: 'The Ladder and the Tide', diff: 1,
      text: 'A rope ladder hangs over the side of a ship at anchor, its rungs 30 cm apart, and the lowest rung just touches the water. The tide is coming in at 20 cm an hour. After four hours, how many rungs are under water?',
      hints: ['What else rises with the tide?'],
      explain: '**None.** The ship floats, so the ship, the ladder and every rung rise with the water. The arithmetic (80 cm, so two rungs and a bit) is the trap.',
      data: {
        answer: { num: 0, unit: 'rungs' },
        traps: [{ match: [2, 3], msg: 'The arithmetic is fine, but the ship does not stand still.' }],
        figure: { w: 400, h: 200, svg: '<rect x="0" y="150" width="400" height="50" fill="#a9cfe9"/><path d="M60 60H340L310 158H90Z" fill="#8a5a2e" stroke="' + INK + '" stroke-width="2"/><path d="M200 60V10M200 18L150 55M200 18L250 55" stroke="' + INK + '" stroke-width="2.5" fill="none"/>' + rope('M300 62C305 90 305 120 306 150', 3) + rope('M326 62C331 90 331 120 332 150', 3) + [0, 1, 2, 3].map((i) => line('M' + (304 + 0.5 * i) + ' ' + (150 - i * 26) + 'H' + (330 + 0.5 * i), { stroke: ROPE, w: 3 })).join('') + line('M0 150H400', { stroke: '#4d8fc1', w: 2 }) }
      }
    },
    {
      id: 'rope-dog-bone', title: 'The Dog and the Bone', diff: 1,
      text: 'A dog on a five-metre lead spots a bone eight metres away, and trots straight to it and eats it. The lead did not break or stretch, and the dog did not slip its collar. How?',
      hints: ['Where is the other end of the lead?'],
      explain: 'The lead was **not tied to anything**: the dog simply took it along. A riddle that trips up anyone who draws the picture too quickly.',
      data: {
        answer: { choice: 2, choices: ['It chewed through the lead', 'The lead was tied to a tree that happened to be in the way', 'The other end of the lead was not tied to anything', 'It walked round and round until the lead unwound'] },
        figure: { w: 400, h: 120, svg: '<g transform="translate(90 70)"><ellipse cx="0" cy="0" rx="26" ry="13" fill="#c99a58" stroke="' + INK + '" stroke-width="1.8"/><circle cx="28" cy="-12" r="11" fill="#c99a58" stroke="' + INK + '" stroke-width="1.8"/><path d="M34 -21l6 -8M-16 10v14M14 10v14M-26 -4l-10 -8" stroke="' + INK + '" stroke-width="2" fill="none"/></g>' + rope('M110 60C80 40 50 90 20 70', 3) + '<path d="M300 78c-8 -8 -2 -16 6 -10l30 0c8 -6 14 2 6 10c8 8 2 16 -6 10l-30 0c-8 6 -14 -2 -6 -10z" fill="#f4f1e8" stroke="' + INK + '" stroke-width="1.8"/>' + line('M130 104H300', { dash: '4 4', w: 1.5 }) + txt(215, 118, '8 m', { anchor: 'middle', size: 13 }) }
      }
    },
    // ---------- fair ----------
    {
      id: 'rope-earth-gap', title: 'A Rope Round the Earth', diff: 2,
      source: 'A classic of popular mathematics, told in many versions since the eighteenth century.',
      text: 'A rope is tied snugly round the Earth along the equator, 40 000 km of it. Now one extra metre is spliced in, and the rope is lifted evenly all the way round until it is taut again. How far above the ground does it float — in centimetres?',
      hints: ['Call the Earth\'s radius R and the gap h. The rope\'s length goes from 2πR to 2π(R + h).', 'The extra metre is 2πh. R has dropped out altogether!'],
      explain: 'The length grows from 2πR to 2π(R + h), so the extra metre is 2πh and **h = 1/2π m ≈ 15.9 cm** — enough for a cat to crawl under. The size of the Earth does not matter: the same metre round an orange lifts the rope just as far.',
      links: ['rope-earth-tent'],
      data: {
        answer: { num: 15.915, tol: 0.25, unit: 'cm', show: '15.9' },
        traps: [{ match: 0, msg: 'Not nothing at all — work it out: the extra length is 2π times the gap.' }],
        figure: { w: 400, h: 160, svg: earth + rope('M0 105.5A356 356 0 0 1 400 105.5', 5) + arrow(200, 52, 200, 44, '#c0392b') + arrow(200, 52, 200, 60, '#c0392b') + txt(210, 50, '?', { size: 18, fill: '#c0392b' }) + txt(200, 150, 'the equator: 40 000 km', { anchor: 'middle', size: 13, italic: true }) }
      }
    },
    {
      id: 'rope-no-letting-go', title: 'A Knot Without Letting Go', diff: 2,
      text: 'Pick up a rope by its two ends, one end in each hand. Without letting go of either end, tie an overhand knot in the rope. How?',
      hints: ['With the ends held, the rope, your arms and your body make one closed loop — and a closed loop cannot knot or unknot itself.', 'So the knot has to be somewhere before you pick the rope up.'],
      explain: '**Cross your arms first**, then take one end in each hand and unfold your arms: the knot slides from your arms onto the rope. Rope, arms and body form a closed loop whose knottedness cannot change while you hold on — so the knot must already be in your folded arms.',
      concepts: ['topology', 'knot-theory'], links: ['knot-or-001'],
      data: {
        answer: { choice: 2, choices: ['It cannot be done', 'Flick the rope in the air so that it loops over itself', 'Fold your arms first, pick up the ends, then unfold your arms', 'Tie it with your teeth'] },
        traps: [{ match: 0, msg: 'It can — though not after you have picked the rope up.' }, { match: 1, msg: 'However you flick it, the loop of rope, arms and body stays unknotted.' }],
        figure: { w: 400, h: 170, svg: person(200, 110, 1.2) + line('M200 55L150 70M200 55L250 70', { w: 3 }) + rope('M150 70C140 150 260 150 250 70', 5) + txt(200, 165, 'both ends held, all the time', { anchor: 'middle', size: 13, italic: true }) }
      }
    },
    {
      id: 'rope-two-strings', title: 'Two Strings from the Ceiling', diff: 2,
      source: 'Norman Maier\'s "two-string problem" (1931), a famous experiment on how people get stuck on the usual use of things.',
      text: 'Two strings hang from the ceiling of a bare room, so far apart that holding the end of one you cannot reach the other. Your task is to tie their ends together. All you have is a pair of pliers. What do you do?',
      hints: ['The pliers need not be used as pliers.', 'Something heavy on the end of a string…'],
      explain: '**Tie the pliers to one string and set it swinging** like a pendulum; take the other string, walk towards the middle and catch the swinging one. In Maier\'s experiment many people never thought of the pliers as a weight — they were pliers.',
      data: {
        answer: { choice: 1, choices: ['Stand on the pliers to reach higher', 'Tie the pliers to one string and set it swinging', 'Cut one string with the pliers and join the pieces', 'Grip one string in the pliers and stretch'] },
        figure: { w: 400, h: 190, svg: line('M20 12H380', { w: 4 }) + rope('M100 12V150', 3) + rope('M300 12V150', 3) + line('M20 178H380', { w: 2.5 }) + '<g transform="translate(190 170)"><path d="M0 0l30 -4M0 0l30 4" stroke="#555" stroke-width="3.5"/><path d="M30 -4l14 -6M30 4l14 6" stroke="#b03a2e" stroke-width="5" stroke-linecap="round"/></g>' }
      }
    },
    {
      id: 'rope-coil', title: 'The Coil on the Deck', diff: 2,
      text: 'A rope lies coiled flat on the deck in 20 turns, the turns touching. The outermost turn is 2 m round and the innermost is 40 cm round. About how long is the rope?',
      hints: ['The turns grow evenly from the inside out.', 'Twenty turns, each on average halfway between the smallest and the largest.'],
      explain: 'The turns grow by the same amount each time, so their average is halfway between 0.4 m and 2 m, i.e. 1.2 m, and 20 turns make **24 m**. It is Gauss\'s trick for adding a row of evenly growing numbers, rolled up.',
      data: {
        answer: { num: 24, tol: 0.3, unit: 'm' },
        figure: { w: 400, h: 200, svg: rope((function () { let s = ''; for (let k = 0; k <= 400; k++) { const a = k / 400 * 20 * 2 * Math.PI, r = 12 + k / 400 * 78; s += (k ? 'L' : 'M') + (200 + r * Math.cos(a)).toFixed(1) + ' ' + (100 + r * Math.sin(a)).toFixed(1); } return s; })(), 3.2) }
      }
    },
    {
      id: 'rope-egyptian-triangle', title: 'The Rope-Stretchers\' Knots', diff: 2,
      source: 'The idea that Egyptian surveyors, the "rope-stretchers", laid out right angles this way is an old tradition rather than a documented fact.',
      text: 'A loop of rope has 12 knots tied in it at equal spacing, dividing it into 12 equal parts. Holding it at three of the knots and pulling it taut, you can make a triangle with a perfect right angle. How many parts go into each of its three sides?',
      hints: ['The sides must add up to 12.', 'Which three whole numbers with a total of 12 satisfy Pythagoras?'],
      explain: '**3, 4 and 5**: 3 + 4 + 5 = 12 and 3² + 4² = 5², so by the converse of Pythagoras\'s theorem the angle between the 3 and the 4 is a right angle. A knotted rope is a very portable set square.',
      data: {
        answer: { nums: [3, 4, 5], ordered: false },
        figure: { w: 400, h: 200, svg: rope('M110 170L290 170L110 35Z', 4) + (function () { let s = ''; const P = [[110, 170], [290, 170], [110, 35]]; const seg = [[0, 1, 4], [1, 2, 5], [2, 0, 3]]; seg.forEach(([a, b, n]) => { for (let k = 0; k < n; k++) { const x = P[a][0] + (P[b][0] - P[a][0]) * k / n, y = P[a][1] + (P[b][1] - P[a][1]) * k / n; s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" fill="' + ROPE + '" stroke="' + INK + '" stroke-width="1.4"/>'; } }); return s; })() + '<path d="M110 156h14v14" fill="none" stroke="#c0392b" stroke-width="2"/>' }
      }
    },
    {
      id: 'rope-prisoner', title: 'Half a Rope Short', diff: 2,
      source: 'A traditional puzzle; versions appear in Victorian and Edwardian puzzle books.',
      text: 'A prisoner in a tower cell finds a rope — but it reaches only halfway down to the ground, and a fall from the halfway point would be fatal. He halves the rope, ties the two halves together, and climbs safely down to the ground. How can halving the rope make it long enough?',
      hints: ['There is more than one way to halve a rope.'],
      explain: 'He **split the rope lengthwise**, unlaying its strands into two thinner ropes, each as long as the original, and tied them end to end: twice the length, half the strength — enough for one careful prisoner.',
      data: {
        answer: { choice: 1, choices: ['He cut it in the middle and hung the pieces side by side', 'He unlaid it lengthwise into two thinner ropes and tied them end to end', 'He tied the halves to the bars and swung', 'He stretched it by soaking it in water'] },
        figure: { w: 400, h: 220, svg: '<rect x="150" y="10" width="100" height="210" fill="#c9b99a" stroke="' + INK + '" stroke-width="2"/><rect x="185" y="30" width="30" height="40" fill="#3a2e1c"/>' + rope('M200 70V140', 4) + line('M0 218H400', { w: 2 }) + txt(275, 110, 'half way', { size: 13, italic: true }) }
      }
    },
    {
      id: 'rope-block-tackle', title: 'The Block and Tackle', diff: 2,
      text: 'A heavy crate hangs from a pulley block that is held up by four strands of rope, which run up to a second block fixed to a beam and back again. You pull 2 metres of rope through your hands. How many centimetres does the crate rise?',
      hints: ['Every one of the four supporting strands has to get shorter by the same amount.'],
      explain: 'The 2 m you pull out is shared among the four strands that hold the lower block, so each shortens by 50 cm and the crate rises **50 cm** — in return, you pull with only a quarter of its weight (friction aside). Work in = work out.',
      data: {
        answer: { num: 50, unit: 'cm' },
        traps: [{ match: 200, msg: 'Each of the four strands has to take up its share.' }, { match: 100, msg: 'Count the strands holding up the lower block.' }],
        figure: { w: 400, h: 230, svg: line('M100 12H300', { w: 5 }) + '<rect x="170" y="18" width="60" height="30" rx="8" fill="#a4733c" stroke="' + INK + '" stroke-width="2"/><rect x="170" y="128" width="60" height="30" rx="8" fill="#a4733c" stroke="' + INK + '" stroke-width="2"/>' + [178, 193, 207, 222].map((x) => rope('M' + x + ' 48V128', 3)).join('') + rope('M226 30C260 30 280 80 290 200', 3) + '<rect x="160" y="175" width="80" height="50" fill="#c9a36b" stroke="' + INK + '" stroke-width="2"/>' + line('M200 158V175', { w: 3 }) + arrow(300, 170, 300, 210, '#c0392b') + txt(308, 196, 'pull 2 m', { size: 13 }) }
      }
    },
    {
      id: 'rope-nine-chapters', title: 'The Rope on the Post', diff: 2,
      source: '*The Nine Chapters on the Mathematical Art* (China, about the first century AD), chapter 9 on right triangles; the numbers here are the ones usually quoted.',
      text: 'A rope hangs from the top of a post, and 3 chi of it lie coiled on the ground. Pulled away from the post until it is taut, its end just reaches the ground 8 chi from the foot of the post. How long is the rope?',
      hints: ['The post, the ground and the taut rope make a right triangle.', 'If the post is h, the rope is h + 3 and h² + 8² = (h + 3)².'],
      explain: 'From h² + 64 = h² + 6h + 9 the post is h = 55/6 = 9⅙ chi and the rope **12⅙ chi**. The *Nine Chapters* is full of such problems — reeds in ponds, broken bamboo, ropes on posts — all solved with the right-triangle rule long before Europe knew them.',
      data: {
        answer: { num: 73 / 6, tol: 0.01, unit: 'chi', show: '12 1/6' },
        traps: [{ match: 55 / 6, msg: 'That is the height of the post. The rope is 3 chi longer.' }],
        figure: { w: 400, h: 200, svg: line('M20 185H380', { w: 2 }) + '<rect x="96" y="30" width="10" height="155" fill="#a4733c" stroke="' + INK + '" stroke-width="1.6"/>' + rope('M101 32C104 90 104 150 104 183C112 186 130 186 140 183', 3) + rope('M101 32L330 185', 3) + txt(122, 200, '3', { anchor: 'middle', size: 13 }) + line('M101 195H330', { dash: '4 4', w: 1.2 }) + txt(215, 200, '8', { anchor: 'middle', size: 13 }) }
      }
    },
    // ---------- tricky ----------
    {
      id: 'rope-goat-barn', title: 'The Goat and the Barn', diff: 3,
      text: 'A goat is tethered by a 10-metre rope to one corner of a barn that measures 6 m by 4 m and stands in the middle of a large meadow. The goat cannot get into the barn, but the rope can bend round its corners. How many square metres of grass can the goat reach?',
      hints: ['Three quarters of a circle of radius 10 are free.', 'Going round the 4-metre wall leaves 6 m of rope, going round the 6-metre wall leaves 4 m: two more quarter circles.', 'Do the two small quarter circles overlap behind the barn?'],
      explain: 'Three quarters of a 10 m circle, 75π, plus a quarter circle of radius 6 round one corner, 9π, plus a quarter circle of radius 4 round the other, 4π. The two small ones just touch at the far corner of the barn without overlapping, so the goat grazes **88π ≈ 276.5 m²**. (A goat has opinions about barns.)',
      concepts: ['area'], links: ['rope-goat-half'],
      data: {
        answer: { num: 88 * Math.PI, tol: 0.6, unit: 'm²', show: '276.5' },
        traps: [{ match: 75 * Math.PI, msg: 'That is only the three-quarter circle: the rope also bends round the corners of the barn.' }, { match: 100 * Math.PI, msg: 'The barn is in the way.' }],
        figure: { w: 420, h: 290, svg: '<path d="M200 28A120 120 0 1 0 320 148A48 48 0 0 0 272 100A72 72 0 0 0 200 28Z" fill="#b9d99a" stroke="#6f9c4a" stroke-width="1.5"/><rect x="200" y="100" width="72" height="48" fill="#b0463a" stroke="' + INK + '" stroke-width="2"/><path d="M196 100L236 76L276 100" fill="#7a3027" stroke="' + INK + '" stroke-width="2"/>' + rope('M200 148C185 165 165 180 150 196', 2.5) + goat(140, 204) + txt(236, 162, '6 m', { anchor: 'middle', size: 12 }) + txt(286, 128, '4 m', { size: 12 }) + txt(150, 230, 'rope 10 m', { anchor: 'middle', size: 12, italic: true }) }
      }
    },
    {
      id: 'rope-linked-wrists', title: 'Tied Together', diff: 3,
      source: 'An old parlour puzzle, often shown to children at parties.',
      text: 'Anna has a rope tied to both of her wrists. Ben\'s rope is tied to both of his wrists too — but it was threaded through Anna\'s before it was tied, so the two of them are linked together. Without cutting a rope, untying a knot or slipping a loop over a hand, can they get free of each other?',
      hints: ['Take away the bodies: are the two ropes really linked?', 'Each wrist loop has a gap in it: the hand. A rope can pass through the loop round a wrist.'],
      explain: '**Yes.** The two ropes are not truly linked, because each one is closed off by a body, and a wrist loop can be passed through. Ben takes a bight of his rope, pushes it under the loop round one of Anna\'s wrists (from the forearm side), over her hand and back out under the loop: the ropes come apart. Topology first, then the knot comes free.',
      concepts: ['topology'],
      data: {
        answer: { choice: 0, choices: ['Yes', 'No: they are linked for good'] },
        traps: [{ match: 1, msg: 'The ropes look linked, but think about what closes each loop.' }],
        figure: { w: 420, h: 200, svg: person(110, 150, 1.25) + person(310, 150, 1.25) + line('M110 88L70 110M110 88L150 110', { w: 3 }) + line('M310 88L270 110M310 88L350 110', { w: 3 }) + rope('M70 112C60 190 160 190 150 112', 4) + rope('M270 112C255 175 120 190 112 150', 4) + rope('M112 150C104 118 200 205 350 112', 4) }
      }
    },
    {
      id: 'rope-two-poles', title: 'Between Two Poles', diff: 3,
      text: 'Two poles, each 10 m high, stand upright on level ground. A rope 16 m long hangs between their tops, and at its lowest point it is 2 m above the ground. How far apart are the poles? (The picture is not to scale.)',
      hints: ['How far down does the rope sag from the tops?', 'Half the rope is 8 m — and the sag is 8 m.'],
      explain: 'The rope dips 8 m below the tops, and each half of it is only 8 m long: it hangs straight down. **The poles stand touching — 0 m apart.** No catenary needed.',
      data: {
        answer: { num: 0, unit: 'm' },
        figure: { w: 400, h: 200, svg: line('M20 190H380', { w: 2 }) + '<rect x="96" y="30" width="10" height="160" fill="#a4733c"/><rect x="294" y="30" width="10" height="160" fill="#a4733c"/>' + rope('M101 32C150 170 250 170 299 32', 3) + line('M200 160V190', { dash: '4 4', w: 1.2 }) + txt(208, 180, '2 m', { size: 12 }) + txt(200, 26, 'rope 16 m, poles 10 m, not to scale', { anchor: 'middle', size: 12, italic: true }) }
      }
    },
    {
      id: 'rope-wound-string', title: 'String Round a Rod', diff: 3,
      source: 'A well-known problem of the unrolled cylinder, told in many forms.',
      text: 'A string is wound evenly round a rod 12 cm long, making exactly four turns from one end to the other. The rod\'s circumference is 4 cm. How long is the string?',
      hints: ['Cut the rod along its length and unroll it flat.', 'Each turn becomes the long side of a right triangle with legs 3 cm and 4 cm.'],
      explain: 'Unrolled, the rod\'s surface is a 12 × 4 rectangle and each turn becomes a straight line across a 3 × 4 piece of it: 5 cm, the hypotenuse of a 3-4-5 triangle. Four turns: **20 cm**.',
      data: {
        answer: { num: 20, unit: 'cm' },
        traps: [{ match: 16, msg: 'That would be four flat rings — but the string also travels along the rod.' }],
        figure: { w: 400, h: 150, svg: '<rect x="60" y="45" width="280" height="60" fill="#e2c79a" stroke="' + INK + '" stroke-width="2"/><ellipse cx="340" cy="75" rx="10" ry="30" fill="#d4b27a" stroke="' + INK + '" stroke-width="2"/>' + rope('M60 105L95 45', 3) + rope('M130 105L165 45', 3) + rope('M200 105L235 45', 3) + rope('M270 105L305 45', 3) + line('M95 45L130 105M165 45L200 105M235 45L270 105M305 45L340 105', { stroke: ROPE, w: 2, dash: '3 4' }) + txt(200, 135, '12 cm long, 4 cm round, 4 turns', { anchor: 'middle', size: 13, italic: true }) }
      }
    },
    {
      id: 'rope-dido', title: 'Dido\'s Oxhide', diff: 3,
      source: 'The story is in Virgil\'s *Aeneid*, book 1; the best shape is the oldest isoperimetric problem.',
      text: 'Queen Dido, landing in Africa, was promised as much land as an oxhide could enclose. She cut the hide into one thin strip 1 km long and laid it on the ground, using the straight sea shore as part of the boundary. What is the largest area she could claim, in square metres?',
      hints: ['Of all curves of a given length, the circle encloses the most. What if a straight shore is free?', 'Reflect the land in the shore line.'],
      explain: 'Reflect the land in the shore: the strip and its mirror image enclose twice the land with 2 km of boundary, which is best as a circle. So Dido\'s strip should be a **semicircle** of radius 1000/π ≈ 318 m, enclosing ½·π·(1000/π)² = 1000²/2π ≈ **159 155 m²** — about 16 hectares, the founding of Carthage.',
      concepts: ['area'],
      data: {
        answer: { num: 1e6 / (2 * Math.PI), rel: 0.004, unit: 'm²', show: '159155' },
        traps: [{ match: 125000, msg: 'That is the best rectangle against the shore. A curve does better.' }, { match: 1e6 / (4 * Math.PI), msg: 'That is a full circle of strip, away from the shore. Let the sea do some of the work.' }],
        figure: { w: 400, h: 180, svg: '<rect x="0" y="130" width="400" height="50" fill="#a9cfe9"/>' + line('M0 130H400', { stroke: '#4d8fc1', w: 2 }) + '<path d="M90 130A110 110 0 0 1 310 130Z" fill="#e4d2a4"/>' + rope('M90 130A110 110 0 0 1 310 130', 4) + txt(200, 105, 'Carthage?', { anchor: 'middle', size: 15, italic: true }) + txt(200, 160, 'the sea', { anchor: 'middle', size: 13, fill: '#245a86', italic: true }) }
      }
    },
    // ---------- hard ----------
    {
      id: 'rope-earth-tent', title: 'The Rope Round the Earth, Pulled Up', diff: 4,
      text: 'Back to the rope round the equator, made one metre longer. This time, instead of lifting it evenly all round, you take hold of it at one point and pull it straight up as high as it will go, so that it runs off the Earth in two straight lines to your hand. How high can you lift it — in metres?',
      hints: ['The rope leaves the Earth along two tangents and follows the equator elsewhere.', 'If the tangent points are at angle θ from your hand, the extra length is 2R tan θ − 2Rθ = 1 m. With R ≈ 6 366 km, θ is tiny: tan θ − θ ≈ θ³/3.', 'θ ≈ (3/2R)^{1/3} ≈ 0.0062 radians, and the height is R(1/cos θ − 1) ≈ Rθ²/2.'],
      explain: 'The tangents meet the Earth at an angle θ with tan θ − θ = 1/(2R); since tan θ − θ ≈ θ³/3, θ ≈ (3/2R)^{1/3} ≈ 0.00618, and the height is R(sec θ − 1) ≈ Rθ²/2 ≈ **121 m** — you could hang the rope over a tall church spire. The evenly lifted rope rises 16 cm; the pulled one, taller than a lighthouse.',
      links: ['rope-earth-gap'],
      data: {
        answer: { num: 121.4, rel: 0.03, unit: 'm', show: '121' },
        traps: [{ match: [0.159, 0.16, 15.9, 16], msg: 'That is the gap when the rope is lifted evenly all round. Pulled up at one point, it goes much higher.' }],
        figure: { w: 400, h: 160, svg: earth + rope('M0 124.5A341 341 0 0 1 33.7 104L200 12L366.3 104A341 341 0 0 1 400 124.5', 4) + line('M200 16V58', { dash: '4 4', w: 1.3, stroke: '#c0392b' }) + txt(210, 44, '?', { size: 18, fill: '#c0392b' }) }
      }
    },
    {
      id: 'rope-carroll-monkey', title: 'The Monkey and the Weight', diff: 4, year: 1893,
      source: 'Posed by Lewis Carroll (Charles Dodgson) in 1893; he recorded that the mathematicians he asked gave different answers.',
      text: 'A rope runs over a light, frictionless pulley fixed to the ceiling. On one end hangs a monkey; on the other, a weight that exactly balances it. The monkey starts to climb the rope. What happens to the weight?',
      hints: ['The rope pulls up on the monkey and on the weight with the same force.', 'They have the same mass, and the same forces act on each.'],
      explain: 'The rope\'s tension is the same on both sides, and both the monkey and the weight feel that tension upward and their equal weights downward. So they get exactly the same acceleration: **the weight rises with the monkey, at the same speed**, and stays level with it — however it climbs (with the rope and pulley weightless and frictionless). Carroll found the experts divided; Newton would not have been.',
      data: {
        answer: { choice: 2, choices: ['It goes down', 'It stays where it is', 'It rises, level with the monkey', 'It rises faster than the monkey'] },
        traps: [{ match: 1, msg: 'Something must supply the monkey\'s climb: the rope pulls harder — on both sides.' }, { match: 0, msg: 'Think about the tension in the rope: does it get smaller or larger when the monkey climbs?' }],
        figure: { w: 400, h: 230, svg: line('M110 10H290', { w: 5 }) + line('M200 10V26', { w: 3 }) + '<circle cx="200" cy="40" r="16" fill="#c9cfdd" stroke="' + INK + '" stroke-width="2"/>' + rope('M184 40V150M216 40V160', 3) + '<g transform="translate(184 158)"><ellipse cx="0" cy="10" rx="14" ry="18" fill="#8a5a2e" stroke="' + INK + '" stroke-width="1.8"/><circle cx="0" cy="-14" r="10" fill="#8a5a2e" stroke="' + INK + '" stroke-width="1.8"/><circle cx="0" cy="-12" r="5.5" fill="#e8c9a0"/><path d="M-8 -2L-2 -12M8 -2L2 -12M-8 26l-6 14M8 26l6 14M12 16c14 4 14 22 4 26" stroke="' + INK + '" stroke-width="2" fill="none"/></g><rect x="198" y="160" width="36" height="44" rx="4" fill="#5b6275" stroke="' + INK + '" stroke-width="2"/>' + txt(216, 188, '?', { anchor: 'middle', size: 18, fill: '#fff' }) }
      }
    },
    // ---------- fiendish ----------
    {
      id: 'rope-goat-half', title: 'Half the Meadow', diff: 5, year: 1748,
      source: 'First posed in *The Ladies\' Diary* (1748); it has no neat answer and is still a favourite test for numerical methods.',
      text: 'A round meadow has a radius of 100 m and a fence all the way round. A goat is tethered to a post in the fence. How long must its rope be for the goat to graze exactly half of the meadow? Give the length to the nearest ten centimetres.',
      hints: ['The grazed part is where two circles overlap: the meadow, and a circle round the post.', 'The overlap of two circles is two circular segments. Write its area as a function of the rope length r and set it equal to half the meadow.', 'The equation has no neat solution: try values. The answer is a little more than 115 m.'],
      explain: 'With the meadow\'s radius 1, the overlap of the meadow with a circle of radius r centred on its edge has area r²·arccos(r/2) + arccos(1 − r²/2) − (r/2)·√(4 − r²). Setting that equal to π/2 and solving numerically gives r ≈ 1.15873, so the rope must be **115.9 m** long. Only in 2020 was the goat problem given an exact (if unwieldy) solution in closed form.',
      concepts: ['area'], links: ['rope-goat-barn'],
      data: {
        answer: { num: 115.873, tol: 0.13, unit: 'm', show: '115.9' },
        traps: [{ match: [100, 70.7, 141.4, 141.42], msg: 'A natural guess, but not right: work out the overlap of the two circles.' }],
        figure: { w: 400, h: 300, svg: '<circle cx="200" cy="150" r="100" fill="#d9ecc4" stroke="#6f4a24" stroke-width="3" stroke-dasharray="7 4"/><path d="M167.13 55.56A115.87 115.87 0 0 1 167.13 244.44A100 100 0 0 1 167.13 55.56Z" fill="#9fcb74" stroke="#6f9c4a" stroke-width="1.5"/>' + '<rect x="95" y="144" width="10" height="12" fill="#6f4a24"/>' + rope('M100 150L175 128', 2.5) + goat(186, 124) + txt(200, 292, 'meadow radius 100 m', { anchor: 'middle', size: 12, italic: true }) }
      }
    },
    {
      id: 'rope-picture-nails', title: 'The Picture on Two Nails', diff: 5,
      source: 'A modern puzzle, much passed around since the 1990s; its answer is a *commutator* from group theory.',
      text: 'Hang a picture from two nails with its string, so that it stays up while both nails are in the wall, but falls if **either** nail is pulled out. Write A for once round the left nail clockwise and a for once round it anticlockwise, B and b for the right nail. Reading from the left end of the string to the right end, which winding works?',
      hints: ['Pulling out the left nail simply deletes every A and a from the word; the picture falls if what is left cancels out (like b after B).', 'You need a word that does not cancel with both nails in, but cancels completely when either letter pair is removed.'],
      explain: '**A B a b.** Pull out the left nail and the A\'s vanish, leaving B b, which undoes itself: the picture falls. Pull out the right nail and A a is left: it falls again. But with both nails in, A B a b does not cancel — which is exactly the statement that going round two holes in different orders is not the same, the *commutator* of group theory.',
      concepts: ['topology'],
      data: {
        answer: { choice: 2, choices: ['A B', 'A B a', 'A B a b', 'A A B B'] },
        traps: [{ match: 0, msg: 'Pull out the left nail and B still holds it up.' }, { match: 1, msg: 'Pull out the right nail: A a cancels and it falls, good — but pull out the left one and B still holds.' }, { match: 3, msg: 'With the right nail out, A A still holds it.' }],
        figure: { w: 400, h: 240, svg: '<circle cx="130" cy="40" r="6" fill="#555"/><circle cx="270" cy="40" r="6" fill="#555"/>' + txt(130, 26, 'A', { anchor: 'middle', size: 14 }) + txt(270, 26, 'B', { anchor: 'middle', size: 14 }) + rope('M110 150C100 60 150 20 140 50C125 80 250 20 262 48C280 70 300 120 290 150', 2.5) + '<rect x="90" y="150" width="220" height="80" fill="#e8d9b4" stroke="#6f4a24" stroke-width="5"/><path d="M110 210l40 -35 30 22 35 -40 50 53z" fill="#9cc47a"/><circle cx="265" cy="175" r="10" fill="#f2c55c"/>' }
      }
    }
  ];

  // a paper backing, so the pictures also read on the dark shelves
  RIDDLES.forEach((p) => { const f = p.data.figure; if (f) f.svg = '<rect width="' + f.w + '" height="' + f.h + '" rx="10" fill="#fbf8ef"/>' + f.svg; });

  Cabinet.family({
    id: 'rope-riddles', engine: 'question', cat: 'ropes', name: 'Rope riddles', order: 5,
    blurb: 'A rope round the Earth, a goat on a tether, a monkey on a pulley, two people tied together: problems with rope in them, from the Nine Chapters to Lewis Carroll.',
    origin: { who: 'Many hands', note: 'Rope is in the oldest problem books — the Chinese *Nine Chapters* measured posts with it — and in the newest, where a picture hung on two nails turns out to be group theory.' },
    concepts: ['topology']
  }, RIDDLES);
})();

