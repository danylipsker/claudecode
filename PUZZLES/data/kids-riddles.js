/* The Puzzle Cabinet · data/kids-riddles.js
 * Riddles and small puzzles for children of about six to eleven, and for grown-ups who like them gentle.
 * Every riddle here is written fresh; the old riddles they remind you of belong to everybody. */
(function () {
  'use strict';
  const C = Cabinet;

  // a choice answer: the right one goes to a place that cycles from puzzle to puzzle; each wrong one may carry the message shown when it is picked
  let mcCount = 0;
  function mc(right, wrongs, extra) {
    const at = (mcCount++ * 7 + 2) % (wrongs.length + 1);
    const choices = wrongs.map((w) => (Array.isArray(w) ? w[0] : w));
    choices.splice(at, 0, right);
    const msgs = wrongs.map((w) => (Array.isArray(w) ? w[1] : null));
    msgs.splice(at, 0, null);
    const idx = choices.map((_, i) => i);
    const ex = Object.assign({}, extra || {});
    if (ex.order) {
      const key = (c) => { const i = ex.order.findIndex((k) => c.indexOf(k) >= 0); return i < 0 ? 99 : i; };
      idx.sort((a, b) => key(choices[a]) - key(choices[b]));
    }
    delete ex.order;
    const traps = [];
    idx.forEach((oldI, newI) => { if (msgs[oldI]) traps.push({ match: newI, msg: msgs[oldI] }); });
    return Object.assign({ answer: { choice: idx.indexOf(at), choices: idx.map((i) => choices[i]) }, traps }, ex);
  }

  const INK = '#3a3020', CREAM = '#fbf8ef', RED = '#b0472f', BLUE = '#3a6ea5', GREEN = '#5a8a3a', GOLD = '#c9a24a';
  const el = (tag, at, inner) => '<' + tag + Object.keys(at).map((k) => ' ' + k + '="' + at[k] + '"').join('') + (inner == null ? '/>' : '>' + inner + '</' + tag + '>');
  const txt = (x, y, s, size, o) => el('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': size || 14, 'font-family': 'Georgia,serif', fill: INK }, o || {}), s);
  const ball = (x, y, r, fill, o) => el('circle', Object.assign({ cx: x, cy: y, r, fill: fill || 'none', stroke: INK, 'stroke-width': 3 }, o || {}));
  const ln = (x1, y1, x2, y2, o) => el('line', Object.assign({ x1, y1, x2, y2, stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, o || {}));
  const box = (x, y, w, h, fill, o) => el('rect', Object.assign({ x, y, width: w, height: h, fill: fill || 'none', stroke: INK, 'stroke-width': 3, rx: 4 }, o || {}));

  // a clock face showing h:m
  function clockFig(h, m) {
    let g = ball(130, 110, 88, CREAM);
    for (let i = 1; i <= 12; i++) {
      const a = i * Math.PI / 6;
      g += txt((130 + 68 * Math.sin(a)).toFixed(1), (117 - 68 * Math.cos(a)).toFixed(1), i, 17, { 'font-weight': 700 });
    }
    const ha = (h % 12) * 30 + m * 0.5, ma = m * 6;
    const tip = (deg, len) => [(130 + len * Math.sin(deg * Math.PI / 180)).toFixed(1), (110 - len * Math.cos(deg * Math.PI / 180)).toFixed(1)];
    const mt = tip(ma, 58), ht = tip(ha, 40);
    g += ln(130, 110, mt[0], mt[1], { 'stroke-width': 4 }) + ln(130, 110, ht[0], ht[1], { 'stroke-width': 7, stroke: RED }) + ball(130, 110, 6, INK);
    return { w: 260, h: 220, svg: g };
  }

  const F = {
    shapes: {
      w: 420, h: 130, svg: (function () {
        const kinds = ['c', 's', 't', 'c', 's'];
        const cols = [RED, BLUE, GREEN, RED, BLUE];
        let s = '';
        kinds.forEach((k, i) => {
          const x = 45 + i * 72, y = 65;
          if (k === 'c') s += ball(x, y, 24, cols[i]);
          else if (k === 's') s += box(x - 24, y - 24, 48, 48, cols[i], { rx: 3 });
          else s += el('polygon', { points: x + ',' + (y - 28) + ' ' + (x - 27) + ',' + (y + 22) + ' ' + (x + 27) + ',' + (y + 22), fill: cols[i], stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' });
        });
        s += box(378 - 24, 41, 48, 48, 'none', { 'stroke-dasharray': '6 5', rx: 6 }) + txt(378, 78, '?', 34, { 'font-weight': 700 });
        return s;
      })()
    },
    clock3: clockFig(3, 0),
    clockHalf: clockFig(4, 30),
    legs: {
      w: 440, h: 190, svg: (function () {
        let s = '';
        const dog = (x) => el('ellipse', { cx: x, cy: 105, rx: 26, ry: 14, fill: '#d9a066', stroke: INK, 'stroke-width': 3 }) + ball(x + 30, 88, 12, '#d9a066') + ln(x + 20, 76, x + 22, 66, { 'stroke-width': 3 }) +
          [-16, -6, 10, 20].map((d) => ln(x + d, 116, x + d, 142, { 'stroke-width': 4 })).join('') + ln(x - 26, 100, x - 38, 88, { 'stroke-width': 4 });
        const bird = (x) => ball(x, 100, 15, '#6ea5d9') + ball(x + 14, 90, 8, '#6ea5d9') + el('polygon', { points: (x + 21) + ',89 ' + (x + 30) + ',92 ' + (x + 21) + ',95', fill: GOLD, stroke: INK, 'stroke-width': 2 }) + ln(x - 4, 114, x - 4, 134, { 'stroke-width': 3 }) + ln(x + 5, 114, x + 5, 134, { 'stroke-width': 3 });
        [60, 165, 270].forEach((x) => { s += dog(x); });
        [370, 415].forEach((x) => { s += bird(x - 10); });
        s += ln(20, 143, 420, 143, { 'stroke-width': 2, stroke: '#b0a070' }) + txt(220, 175, 'three dogs and two birds', 14, { 'font-style': 'italic' });
        return s;
      })()
    }
  };

  Cabinet.family({
    id: 'kids-riddles', engine: 'question', cat: 'riddles', name: 'Riddles for young puzzlers', order: 7,
    blurb: 'Friendly riddles and easy puzzles for children of about six to eleven: animals, kitchen things, counting and a little logic.',
    concepts: ['lateral', 'deduction']
  }, [

    /* ============================ WARM-UPS ============================ */
    {
      id: 'kid-egg', title: 'The House With No Door', diff: 1,
      text: 'I have no door and no windows, but somebody lives inside me until it is ready to come out. I am white or brown and I am smooth all over. You may have me for breakfast, boiled, with toast to dip in it.\n\n*What am I?*',
      hints: ['Somebody lives inside, and one day it will peck its way out.', 'A hen makes me.'],
      explain: 'An **egg**. A chick grows inside, safe in its shell house, until it is ready to peck its way out. If nobody is home, you can have it for breakfast.',
      data: { answer: { text: ['egg', 'an egg', 'a hen’s egg', 'a chicken egg', 'hen’s egg', 'chicken’s egg', 'eggs'] }, glyph: '🥚' },
      concepts: ['lateral'], links: ['kid-bee', 'kid-cow']
    },
    {
      id: 'kid-bee', title: 'The Buzzing Baker', diff: 1,
      text: 'I make something sweet, but I am not a baker. I can fly, but I am not a bird. I only sting if you make me cross. I live in a hive with thousands of my sisters.\n\n*What am I?*',
      hints: ['You may hear me before you see me: bzzzz.', 'I visit the flowers, and what I bring home ends up on your toast.'],
      explain: 'A **bee**. Honeybees visit flowers to collect sweet nectar, and turn it into honey. One bee makes only about a twelfth of a teaspoonful of honey in her whole life, so next time you have it on toast, say thank you.',
      data: { answer: { text: ['bee', 'a bee', 'honeybee', 'honey bee', 'bumblebee', 'bumble bee', 'bees', 'a honeybee', 'a bumblebee'] }, glyph: '🐝' },
      concepts: ['lateral'], links: ['kid-cow']
    },
    {
      id: 'kid-cow', title: 'The Milk Machine', diff: 1,
      text: 'I eat grass all day long. Breakfast, lunch and tea are always the same, and I never seem to mind. Yet I give you milk to pour on your cereal, and the cheese for your sandwich. I say *moo*.\n\n*What am I?*',
      hints: ['I live on a farm and have four legs and a tail with a tuft on the end.', 'The farmer milks me in the morning.'],
      explain: 'A **cow**. She eats grass (and hay in winter), and her body turns it into milk. Milk gives us cheese, butter, yoghurt and ice cream.',
      data: { answer: { text: ['cow', 'a cow', 'cows', 'cattle', 'a dairy cow', 'dairy cow'] }, glyph: '🐄' },
      concepts: ['lateral'], links: ['kid-bee']
    },
    {
      id: 'kid-elephant', title: 'A Nose Like a Hand', diff: 1,
      text: 'I am the biggest animal that walks on land. My nose is very long, and it is also my hand: I use it to pick things up, to squirt water over my back and to say hello to my friends. People say I never forget.\n\n*What am I?*',
      hints: ['I have grey skin, huge ears and two long white tusks.', 'A zoo keeper keeps peanuts for me. Trumpet!'],
      explain: 'An **elephant**. The trunk is a nose and a hand in one: it has thousands of tiny muscles, and an elephant can pick up a single peanut with it, or a whole tree trunk.',
      data: { answer: { text: ['elephant', 'an elephant', 'elephants', 'the elephant'] }, glyph: '🐘' },
      concepts: ['lateral']
    },
    {
      id: 'kid-frog', title: 'The Pond Jumper', diff: 1,
      text: 'I sit on a lily pad and say *ribbit*. My skin is green and a bit slimy, and I have long back legs for jumping. I catch flies with my sticky tongue: *zap!*\n\n*What am I?*',
      hints: ['I began life as a tadpole with a tail.', 'A prince, in one fairy tale, was one of me until he got a kiss.'],
      explain: 'A **frog**. Frogs start life in the water as tadpoles, and grow legs and lose their tails as they turn into frogs. Their tongue is sticky, and it flicks out faster than you can blink.',
      data: { answer: { text: ['frog', 'a frog', 'frogs', 'the frog', 'a toad', 'toad', 'tree frog'] }, glyph: '🐸' },
      concepts: ['lateral']
    },
    {
      id: 'kid-penguin', title: 'The Dressed-Up Bird', diff: 1,
      text: 'I wear a black and white suit all year round, as if I were on my way to a party. I am a bird, but I cannot fly. Instead I swim like a torpedo, and on the ice I slide along on my tummy.\n\n*What am I?*',
      hints: ['I live where it is very, very cold: at the bottom of the world.', 'My family waddles about together in a big crowd.'],
      explain: 'A **penguin**. Penguins cannot fly, but they are wonderful swimmers: their wings have become flippers. On the ice they slide on their bellies, which is faster than waddling.',
      data: { answer: { text: ['penguin', 'a penguin', 'penguins', 'the penguin'] }, glyph: '🐧' },
      concepts: ['lateral']
    },
    {
      id: 'kid-sun', title: 'Up in the Morning', diff: 1,
      text: 'I get up early and go to bed late in the summer, and in the winter I am lazy and stay in bed. I warm your face and make the flowers grow, but you must never look straight at me.\n\n*What am I?*',
      hints: ['You see me in the sky in the daytime, and never at night.', 'I rise in the east and set in the west.'],
      explain: 'The **sun**. It rises earlier and sets later in summer, and it is a huge ball of hot gas. Its light takes eight minutes to reach us. Never look straight at it: it can hurt your eyes.',
      data: { answer: { text: ['sun', 'the sun', 'sunshine', 'the sunshine', 'sunlight', 'the sunlight'] }, glyph: '☀' },
      concepts: ['lateral']
    },
    {
      id: 'kid-wind', title: 'Nobody Has Ever Seen Me', diff: 1,
      text: 'I can push a sailing boat across the sea and blow your hat down the street. I can make a kite fly and the trees wave. You can hear me and feel me, but nobody has ever seen me.\n\n*What am I?*',
      hints: ['You feel me on your face on a blustery day.', 'I go *whoosh* in the trees.'],
      explain: 'The **wind**. It is only air on the move, and air is invisible. We see what the wind does (the waving trees, the kite in the sky), but never the wind itself.',
      data: { answer: { text: ['wind', 'the wind', 'a breeze', 'breeze', 'the breeze', 'a gust', 'air', 'moving air'] }, glyph: '🌬' },
      concepts: ['lateral'], links: ['kid-sun']
    },
    {
      id: 'kid-ice-cream', title: 'Eat Me Quickly', diff: 1,
      text: 'I am cold and sweet, and I come in scoops. You can have me in a cone or in a dish, with sprinkles on top. If you do not hurry up and eat me, I turn into a puddle.\n\n*What am I?*',
      hints: ['I am best on a hot summer day, at the seaside.', 'The van that sells me plays a tune.'],
      explain: '**Ice cream**. It is made of cream or milk, sugar and flavours, and frozen. In the sun it melts fast, which is why you have to eat it quickly.',
      data: { answer: { text: ['ice cream', 'ice-cream', 'icecream', 'an ice cream', 'ice cream cone', 'an ice cream cone', 'an ice-cream', 'ice lolly', 'a cone'] }, glyph: '🍦' },
      concepts: ['lateral']
    },
    {
      id: 'kid-toothbrush', title: 'Twice a Day', diff: 1,
      text: 'I have bristles, but I am not a hedgehog. I live in a cup or a holder in the bathroom. You should use me every morning and every night, and I keep your smile bright.\n\n*What am I?*',
      hints: ['You put me in your mouth, but you do not eat me.', 'I go with the toothpaste.'],
      explain: 'A **toothbrush**. Brushing your teeth for two minutes, twice a day, scrubs away the sticky stuff called plaque that would otherwise make holes in your teeth.',
      data: { answer: { text: ['toothbrush', 'tooth brush', 'a toothbrush', 'a tooth brush', 'my toothbrush'] }, glyph: '🪥' },
      concepts: ['lateral']
    },
    {
      id: 'kid-mirror', title: 'The Copycat', diff: 1,
      text: 'Stand in front of me and I show you your face. Wave, and I wave back. Stick out your tongue, and I stick mine out too. But I never say a single word.\n\n*What am I?*',
      hints: ['You look at me when you brush your hair.', 'I am made of glass, and I hang on the wall.'],
      explain: 'A **mirror**. It shows you a picture of yourself, but the picture is a copy the wrong way round: when you lift your right hand, the mirror-you lifts what looks like its left.',
      data: { answer: { text: ['mirror', 'a mirror', 'mirrors', 'the mirror', 'looking glass', 'a looking glass'] }, glyph: '🪞' },
      concepts: ['lateral']
    },
    {
      id: 'kid-sock', title: 'Always Losing My Partner', diff: 1,
      text: 'I come in pairs, but I am always losing my partner. I go into the washing machine with a friend, and I come out on my own. You put me on your feet, and I keep your toes warm inside your shoes.\n\n*What am I?*',
      hints: ['You wear me under your shoes.', 'I am often found under the bed, all by myself.'],
      explain: 'A **sock**. Every family has odd ones. Where do they go? Some people say the washing machine eats them; most of the time they are simply behind the radiator.',
      data: { answer: { text: ['sock', 'a sock', 'socks', 'odd sock', 'an odd sock', 'a sock'] }, glyph: '🧦' },
      concepts: ['lateral']
    },
    {
      id: 'kid-bicycle', title: 'Two Wheels and No Engine', diff: 1,
      text: 'I have two wheels, a saddle and a bell, but no engine. I only go if you push my pedals. You have to balance on me, and when you first learn, somebody has to hold on to the back.\n\n*What am I?*',
      hints: ['You ride me to school or to the park.', 'A helmet goes on your head when you ride me.'],
      explain: 'A **bicycle**. It has no engine at all: you are the engine. The balance comes from steering into the lean, and once you can ride you never forget how.',
      data: { answer: { text: ['bicycle', 'a bicycle', 'bike', 'a bike', 'cycle', 'a cycle', 'push bike', 'pushbike', 'a push bike', 'pushbike'] }, glyph: '🚲' },
      concepts: ['lateral']
    },
    {
      id: 'kid-piggy-bank', title: 'Round and Pink', diff: 1,
      text: 'I am round and pink and I have a curly tail, but I never say *oink*. I have a slot in my back and my tummy is full of coins. If you want what is inside me, I have to be opened.\n\n*What am I?*',
      hints: ['You feed me money a little at a time.', 'I am not a real animal: I am for saving.'],
      explain: 'A **piggy bank**. A coin goes in through the slot, and it stays until you shake it out or open it. Saving a few pennies a week is a good way to buy something big.',
      data: { answer: { text: ['piggy bank', 'a piggy bank', 'piggybank', 'money box', 'moneybox', 'a money box', 'a moneybox', 'pig bank', 'savings box'] }, glyph: '🐷' },
      concepts: ['lateral']
    },
    {
      id: 'kid-flag', title: 'Waving Without Hands', diff: 1,
      text: 'I wave, but I do not have any hands. I hang on a pole in the wind, and I wear the colours of my country, or of my football team, or of the pirates. I am made of cloth, and I am not a towel.\n\n*What am I?*',
      hints: ['You see me flying at the top of a tall pole.', 'A pirate ship has a black one.'],
      explain: 'A **flag**. It waves when the wind blows it, and the colours and pictures on it tell you who it belongs to: a country, a club, a ship.',
      data: { answer: { text: ['flag', 'a flag', 'flags', 'banner', 'a banner', 'the flag'] }, glyph: '🏴' },
      concepts: ['lateral']
    },
    {
      id: 'kid-teapot', title: 'Short and Warm', diff: 1,
      text: 'I have a lid on my head, a spout for a nose and a handle on my side. I am full of hot water and leaves. Grown-ups pour something out of my nose into their cups, and they call it a cuppa.\n\n*What am I?*',
      hints: ['I live on the table at tea-time.', 'I pour out something warm and brown.'],
      explain: 'A **teapot**. The hot water is poured on the tea leaves, and after a few minutes the tea is ready to pour out of the spout.',
      data: { answer: { text: ['teapot', 'tea pot', 'a teapot', 'a tea pot', 'kettle', 'a kettle'] }, glyph: '🫖' },
      concepts: ['lateral']
    },
    {
      id: 'kid-tooth', title: 'Loose at Last', diff: 1,
      text: 'I am small and white and hard as a rock. When you are about six I get wobbly, and one day I fall out, and you put me under the pillow. In the morning there is a shiny coin instead.\n\n*What am I?*',
      hints: ['You have quite a few of me, all in a row.', 'A fairy visits at night to collect me.'],
      explain: 'A **tooth** (a milk tooth or baby tooth, to be exact). You have 20 baby teeth, and they fall out one by one to make room for the 32 grown-up teeth.',
      data: { answer: { text: ['tooth', 'a tooth', 'teeth', 'milk tooth', 'a milk tooth', 'baby tooth', 'a baby tooth', 'wobbly tooth', 'a wobbly tooth', 'a loose tooth', 'loose tooth'] }, glyph: '🦷' },
      concepts: ['lateral']
    },
    {
      id: 'kid-popcorn', title: 'Jump When You’re Hot', diff: 1,
      text: 'I begin as a tiny, hard little seed, yellow and dull. But put me in a hot pan and I jump about, and *pop!* I turn into something white, fluffy and delicious. You eat me at the cinema.\n\n*What am I?*',
      hints: ['I am a kind of corn.', 'You can hear me in the pan going pop, pop, pop.'],
      explain: '**Popcorn**. Each tiny seed has a drop of water inside. When it gets hot, the water turns into steam and the seed bursts open: *pop!*',
      data: { answer: { text: ['popcorn', 'pop corn', 'a popcorn', 'popping corn', 'popcorn kernel', 'a popcorn kernel', 'corn kernel'] }, glyph: '🍿' },
      concepts: ['lateral']
    },
    {
      id: 'kid-pizza', title: 'Round, Then Triangles', diff: 1,
      text: 'I come out of the oven round, but you eat me in triangles. I am covered in tomato and cheese, and people put all sorts of things on top of me, from pepperoni to pineapple, which makes some people very cross.\n\n*What am I?*',
      hints: ['I come from Italy, and I come in a flat box.', 'You eat me with your fingers, one slice at a time.'],
      explain: 'A **pizza**. It comes round, and you cut it into slices, each one a triangle with a rounded end. A pizza cut in six slices has six triangles, which is a very good number to share.',
      data: { answer: { text: ['pizza', 'a pizza', 'pizzas'] }, glyph: '🍕' },
      concepts: ['lateral']
    },

    /* ============================ COUNTING AND THINKING ============================ */
    {
      id: 'kid-legs-count', title: 'Legs in the Garden', diff: 1,
      text: 'Three dogs and two birds are playing in the garden. Count every leg you can see.\n\n*How many legs are there altogether?*',
      hints: ['A dog has four legs. How many legs do three dogs have?', 'A bird has two legs. Add the birds’ legs to the dogs’ legs.'],
      explain: 'Three dogs have 3 × 4 = 12 legs. Two birds have 2 × 2 = 4 legs. In all that makes 12 + 4 = **16** legs. If you counted 16, you can go and give the dogs a biscuit.',
      data: { answer: { num: 16 }, ask: 'How many legs?', traps: [{ match: 10, msg: 'Careful: that counts the five animals, not the legs. A dog has four legs!' }, { match: 14, msg: 'Nearly. Check the birds: each bird has two legs.' }], figure: F.legs, glyph: '🐕' },
      concepts: ['rates'], links: ['kid-spider-legs']
    },
    {
      id: 'kid-spider-legs', title: 'Eight Legs Each', diff: 1,
      text: 'A spider has eight legs. Three spiders are having a tea party on the ceiling.\n\n*How many legs do the three spiders have between them?*',
      hints: ['Count in eights: 8, 16, …', 'Three lots of eight.'],
      explain: 'Three lots of eight: 8 + 8 + 8 = **24** legs. It is a big tea party, but at least they have plenty of hands (legs) for holding cups.',
      data: { answer: { num: 24 }, ask: 'How many legs?', traps: [{ match: 16, msg: 'That is two spiders. There are three.' }], glyph: '🕷' },
      concepts: ['rates'], links: ['kid-legs-count']
    },
    {
      id: 'kid-tallest', title: 'Who Is the Smallest?', diff: 1,
      text: 'Four friends stand in a line to have their photograph taken.\n\nTom is taller than Ben. Ben is taller than Sam. Nell is shorter than Sam.\n\n*Who is the shortest of the four?*',
      hints: ['Put them in order, tallest first: start with Tom and Ben.', 'Where does Sam go? And where does Nell go?'],
      explain: 'Tom is taller than Ben, and Ben is taller than Sam, so the order is Tom, Ben, Sam. Nell is shorter than Sam, so she goes last: Tom, Ben, Sam, **Nell**. She is the shortest, and she gets to stand at the front of the photograph.',
      data: mc('Nell', [['Tom', 'Tom is taller than Ben, so he is not the shortest.'], ['Ben', 'Ben is taller than Sam, so he cannot be the shortest.'], ['Sam', 'Nell is shorter than Sam.']], { order: ['Tom','Ben','Sam','Nell'], glyph: '📏' }),
      concepts: ['deduction']
    },
    {
      id: 'kid-day-after', title: 'What Day Is It?', diff: 1,
      text: 'Sam says: “The day after tomorrow is Saturday.”\n\n*What day is it today?*',
      hints: ['Count backwards from Saturday: what day comes just before it?', 'Saturday, then the day before that (that is tomorrow), and then the day before that (today).'],
      explain: 'The day after tomorrow is two days after today. Saturday is two days after **Thursday** (Friday, then Saturday). Today is Thursday, tomorrow is Friday, and the day after tomorrow is Saturday.',
      data: { answer: { text: ['thursday', 'thu', 'it is thursday', 'today is thursday'], exact: true }, ask: 'A day of the week.', traps: [{ match: ['friday', 'fri'], msg: 'Friday is tomorrow. The day after tomorrow is Saturday, so today is a day earlier still.' }], glyph: '📅' },
      concepts: ['modular']
    },
    {
      id: 'kid-zero-product', title: 'A Very Long Sum', diff: 1,
      text: 'Look at this very long multiplication:\n\n**1 × 2 × 3 × 4 × 5 × 6 × 7 × 8 × 9 × 0**\n\n*What is the answer?* (You do not need a calculator.)',
      hints: ['Read the whole sum before you start. What is the last number?', 'Whatever you multiply by nought, what do you get?'],
      explain: 'The answer is **0**. Anything multiplied by nought is nought, so you can stop after reading the last number, and save yourself a great deal of work.',
      data: { answer: { num: 0 }, traps: [{ match: 362880, msg: 'That is what you get without the last number. But the last number is 0!' }], glyph: '0' },
      concepts: ['lateral']
    },
    {
      id: 'kid-odd-one', title: 'The Odd One Out', diff: 1,
      text: 'Here are four things from the market stall: **an apple**, **a banana**, **a carrot** and **an orange**.\n\n*Which one is the odd one out?*',
      hints: ['Think about what kind of food each one is.', 'Three of them are fruits. What is the other?'],
      explain: 'The apple, the banana and the orange are all **fruits**. The **carrot** is a vegetable, and it grows underground, so it is the odd one out. (There is more than one way to sort things: if you sorted them by colour, the banana would be the odd one out, and that is also a good answer.)',
      data: mc('The carrot', [['The apple', 'The apple is a fruit, like the banana and the orange.'], ['The banana', 'A banana is a fruit, like the apple and the orange. (It is the only yellow thing, but the puzzle is asking about the kind of food.)'], ['The orange', 'The orange is a fruit, like the apple and the banana.']], { order: ['apple','banana','carrot','orange'], glyph: '🥕' }),
      concepts: ['deduction']
    },
    {
      id: 'kid-t-days', title: 'Days That Start With T', diff: 1,
      text: 'There are seven days in the week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday.\n\n*How many of them begin with the letter T?*',
      hints: ['Say the days slowly, and listen for the *t* at the start.', 'Not Wednesday: that begins with a W.'],
      explain: 'Two days begin with T: **Tuesday** and **Thursday**. Which is why, when you are learning to write the days, you have to remember which is which.',
      data: { answer: { num: 2 }, ask: 'How many days?', glyph: 'T' },
      concepts: ['deduction']
    },
    {
      id: 'kid-clock-three', title: 'What Time Is It?', diff: 1,
      text: 'Look at the clock. The long hand, the minute hand, points to the 12. The short, fat hand, the hour hand, points to the 3.\n\n*What time is it?*',
      hints: ['When the long hand is on the 12, it is exactly “o’clock”.', 'The short hand tells you which hour.'],
      explain: 'When the long hand points to 12, it is exactly on the hour. The short hand shows the hour: it points to the 3. So it is **3 o’clock**: time for tea, perhaps.',
      data: { answer: { text: ['3 o’clock', '3 oclock', 'three o’clock', 'three oclock', '3:00', '3.00', '3', 'three', 'three o clock', '3 o clock', '3pm', '3 pm', '3 am', '3am', 'it is three'], exact: true }, ask: 'What time is it?', figure: F.clock3, glyph: '🕒' },
      concepts: ['modular']
    },
    {
      id: 'kid-clock-half', title: 'Half Past What?', diff: 2,
      text: 'Look at the clock. The long hand, the minute hand, points straight down, to the 6. The short, fat hand, the hour hand, has gone past the 4 and is half way to the 5.\n\n*What time is it?*',
      hints: ['When the long hand is on the 6, it is exactly half way round the clock: “half past”.', 'The short hand is half way between the 4 and the 5. It has left the 4, but not arrived at the 5, so the hour is still four.'],
      explain: 'The long hand on the 6 means **half past**. The short hand is half way between the 4 and the 5, so it is not yet five, and the hour is four: **half past four** (4:30), the time for a snack.',
      data: { answer: { text: ['half past four', 'half past 4', '4:30', '4.30', '4 30', 'four thirty', 'four 30', '4 30 pm', 'half four', 'half-past four', 'half past four o clock', '4:30pm', '4 30pm', '4:30 pm', '4.30pm', 'half past 4 pm'], exact: true }, ask: 'What time is it?', traps: [{ match: ['half past five', 'half past 5', '5:30', '5.30', 'five thirty'], msg: 'The short hand has not yet reached the 5: it is half way between the 4 and the 5, so the hour is still four.' }], figure: F.clockHalf, glyph: '🕟' },
      concepts: ['modular'], links: ['kid-clock-three']
    },
    {
      id: 'kid-shapes-pattern', title: 'What Comes Next?', diff: 1,
      text: 'A row of shapes makes a pattern: a red circle, a blue square, a green triangle, then a red circle and a blue square again.\n\n*Which shape comes next, in the box with the question mark?*',
      hints: ['Look for the part that repeats: circle, square, …', 'The pattern goes circle, square, triangle, circle, square … and then?'],
      explain: 'The pattern is circle, square, triangle, over and over. After the circle and the square comes the **green triangle**. Patterns are everywhere: on wallpaper, in music, on a zebra crossing.',
      data: { answer: { text: ['triangle', 'a triangle', 'green triangle', 'a green triangle', 'the triangle'] }, ask: 'Which shape?', figure: F.shapes, glyph: '△' },
      concepts: ['sequence']
    },
    {
      id: 'kid-who-owns-cat', title: 'Who Has the Cat?', diff: 1,
      text: 'Ali, Bea and Cal each have a different pet: a cat, a dog and a goldfish.\n\nAli sneezes when he is near anything furry. Bea’s pet barks at the postman.\n\n*Who has the cat?*',
      hints: ['Which pet does Bea have? And which pets are furry?', 'Ali sneezes near fur, so Ali does not have a cat or a dog.'],
      explain: 'Bea’s pet barks, so it is the dog. Ali sneezes near furry things, so he cannot have the cat or the dog: his pet is the goldfish. That leaves the cat for **Cal**.',
      data: mc('Cal', [['Ali', 'Ali sneezes near fur. A cat is furry, so he has the goldfish.'], ['Bea', 'Bea’s pet barks at the postman: that is a dog.']], { order: ['Ali','Bea','Cal'], glyph: '🐈' }),
      concepts: ['deduction']
    },
    {
      id: 'kid-number-riddle', title: 'Think of a Number', diff: 1,
      text: 'I am thinking of a number. I double it, then add 1, and I get **15**.\n\n*What was my number?*',
      hints: ['Work backwards: take away the 1 first.', '15 take away 1 is 14. And 14 is what you get when you double my number.'],
      explain: 'Undo what I did, in the opposite order. I added 1 last, so take 1 away from 15 to get 14. Before that I doubled the number, so halve 14: **7**. Check: 7 doubled is 14, and 14 plus 1 is 15.',
      data: { answer: { num: 7 }, ask: 'What was the number?', traps: [{ match: 14, msg: 'That is the number after doubling. Halve it to find the number I began with.' }], glyph: '7' },
      concepts: ['working-backwards']
    },
    {
      id: 'kid-pattern-numbers', title: 'Doubling Up', diff: 1,
      text: 'Here is a row of numbers: **2, 4, 8, 16, …**\n\n*What number comes next?*',
      hints: ['How do you get from 2 to 4? And from 4 to 8?', 'Each number is double the one before.'],
      explain: 'Each number is **double** the one before: 2, 4, 8, 16, and then 16 × 2 = **32**. Doubling grows quickly: the next ones are 64, 128, 256 …',
      data: { answer: { num: 32 }, traps: [{ match: 24, msg: 'That would be adding 8 each time, but the gaps are 2, 4, 8: they double too.' }], glyph: '×2' },
      concepts: ['sequence', 'geometric-series'], links: ['kid-letters-months']
    },
    {
      id: 'kid-ladder-jump', title: 'A Very Tall Ladder', diff: 1,
      text: 'Sasha jumps off a very tall ladder onto the hard pavement, and she is not hurt one bit. She has no parachute, and there is no soft mat.\n\n*How is that possible?*',
      hints: ['Perhaps it is not the top rung that matters.', 'Think about which rung of a ladder is the lowest.'],
      explain: 'She jumped off the **bottom rung**! A ladder can be very tall, but its lowest rung is only a step above the ground, like stepping off a kerb. It is a joke, but a good one: when a riddle makes something sound scary, look for the part that it did not say.',
      data: mc('She jumped off the bottom rung', [['She was wearing a very good parachute', 'The riddle says there was no parachute.'], ['She is very good at jumping', 'A jump from the top of a really tall ladder would hurt anybody.'], ['The pavement was made of feathers', 'The riddle says the pavement was hard.']], { glyph: '🪜' }),
      concepts: ['lateral']
    },
    {
      id: 'kid-breakfast', title: 'Never for Breakfast', diff: 1,
      text: 'You can eat lots of things for breakfast: toast, porridge, cereal, an egg.\n\n*What two things can you never eat for breakfast?*',
      hints: ['Think of other meals of the day.', 'What do you have after breakfast?'],
      explain: '**Lunch and dinner**, of course. If you eat them at breakfast time, they are simply breakfast.',
      data: { answer: { text: ['lunch and dinner', 'lunch', 'dinner', 'lunch and supper', 'lunch and tea', 'dinner and lunch', 'supper', 'tea'] }, ask: 'Which two?', glyph: '🍳' },
      concepts: ['lateral']
    },
    {
      id: 'kid-pizza-slices', title: 'Slices Left Over', diff: 1,
      text: 'A pizza is cut into **8 slices**. Three friends sit down and each eats **2 slices**.\n\n*How many slices are left for the cat?*',
      hints: ['How many slices do the three friends eat in all?', '3 friends, 2 slices each. Take that away from 8.'],
      explain: 'Three friends with two slices each eat 3 × 2 = 6 slices. There were 8, so 8 − 6 = **2** slices are left. (The cat will not be having pizza, but it would like to.)',
      data: { answer: { num: 2 }, ask: 'How many slices?', traps: [{ match: 6, msg: 'That is how many the friends ate. How many are left over?' }], glyph: '🍕' },
      concepts: ['deduction']
    },

    /* ============================ A LITTLE HARDER ============================ */
    {
      id: 'kid-giraffe', title: 'Head in the Clouds', diff: 2,
      text: 'I am the tallest animal in the world. I have a very long neck, but here is a surprise: I have exactly the same number of bones in my neck as you do, only mine are much, much longer. I eat leaves from the tops of the trees, and my tongue is dark purple.\n\n*What am I?*',
      hints: ['I live on the African plains, and I have brown patches on my coat.', 'My name starts with G.'],
      explain: 'A **giraffe**. It has seven neck bones (vertebrae), just like a person, a mouse or a whale, but each one of a giraffe’s is about a quarter of a metre long. Its long, dark tongue reaches around thorny branches.',
      data: { answer: { text: ['giraffe', 'a giraffe', 'giraffes', 'the giraffe'] }, glyph: '🦒' },
      concepts: ['lateral']
    },
    {
      id: 'kid-bat', title: 'Upside-Down Sleeper', diff: 2,
      text: 'I am not a bird, although I fly. I have fur and I feed my babies with milk. I sleep hanging upside down by my feet, and I come out at night. I cannot see very well, but I do not need to: I find my way by listening to the echoes of my own squeaks.\n\n*What am I?*',
      hints: ['I live in caves and old attics, and I come out at dusk.', 'There is a saying “as blind as a …”, but I am not really blind at all.'],
      explain: 'A **bat**. It is the only mammal that can really fly. It sends out very high squeaks, and by listening to the echoes it can tell where a moth is, in the dark, and catch it.',
      data: { answer: { text: ['bat', 'a bat', 'bats', 'the bat'] }, glyph: '🦇' },
      concepts: ['lateral']
    },
    {
      id: 'kid-spoon', title: 'A Bowl That Is Not a Bowl', diff: 2,
      text: 'I have a bowl, but nobody puts soup in me to eat. I go in your mouth, but I am not food. I am in the kitchen drawer with my friends the knife and the fork, and I stir the tea and carry the porridge.\n\n*What am I?*',
      hints: ['You use me for eating soup and ice cream.', 'I am a kind of cutlery.'],
      explain: 'A **spoon**. The round part is called the bowl, and the long part is the handle. Nobody eats a spoon, but plenty of people lick one.',
      data: { answer: { text: ['spoon', 'a spoon', 'spoons', 'teaspoon', 'a teaspoon', 'tablespoon', 'a tablespoon', 'soup spoon', 'a soup spoon', 'wooden spoon', 'a wooden spoon'] }, glyph: '🥄' },
      concepts: ['lateral']
    },
    {
      id: 'kid-ladder', title: 'Many Steps, No Journey', diff: 2,
      text: 'I have many steps, but I never go anywhere. I lean on the wall and hold still, while a person goes up and down on me. The painter needs me, and so does the man who cleans the windows.\n\n*What am I?*',
      hints: ['I am not a staircase: I am much thinner, and you can carry me.', 'I have rungs.'],
      explain: 'A **ladder**. Its steps are called rungs, and it is far too sensible to walk about, but it does like leaning.',
      data: { answer: { text: ['ladder', 'a ladder', 'ladders', 'step ladder', 'a step ladder', 'stepladder', 'a stepladder'] }, glyph: '🪜' },
      concepts: ['lateral']
    },
    {
      id: 'kid-drum', title: 'Beat Me and I Sing', diff: 2,
      text: 'The harder you hit me, the louder I shout, and I never complain. I am round and I am hollow, and I have a skin stretched tight across my top. Marching bands love me, and so do noisy children with two wooden sticks.\n\n*What am I?*',
      hints: ['I go *boom* or *rat-a-tat-tat*.', 'You play me with sticks.'],
      explain: 'A **drum**. When you hit the skin, it shakes, and the hollow body makes the sound bigger. A big drum makes a deep boom and a small drum a higher tap.',
      data: { answer: { text: ['drum', 'a drum', 'drums', 'snare drum', 'a snare drum', 'bass drum', 'a bass drum', 'drum kit', 'a drum kit'] }, glyph: '🥁' },
      concepts: ['lateral']
    },
    {
      id: 'kid-envelope', title: 'A House for a Letter', diff: 2,
      text: 'I am a little paper house that has a flap for a door. A letter lives inside me, and when I am sealed nobody can peek. I have a stamp on my front, and I travel all over the country in a sack.\n\n*What am I?*',
      hints: ['You put your letter inside me, and lick my flap.', 'The postman brings me to your door.'],
      explain: 'An **envelope**. It keeps your letter clean and private on its journey. A letter posted in one town can arrive in another town the next morning.',
      data: { answer: { text: ['envelope', 'an envelope', 'envelopes', 'the envelope'] }, glyph: '✉' },
      concepts: ['lateral']
    },
    {
      id: 'kid-anchor', title: 'The Heavy Thing That Keeps Ships Still', diff: 2,
      text: 'I am very heavy and I sink to the bottom of the sea on purpose. I am tied to a boat on a long chain, and when I dig into the seabed, the boat cannot drift away. When the boat wants to sail, I am hauled up again.\n\n*What am I?*',
      hints: ['I am made of iron, and I look a bit like a hook with two arms.', 'A sailor drops me over the side.'],
      explain: 'An **anchor**. Its weight and its sharp arms grip the seabed, so a ship stays where it is instead of drifting away with the tide.',
      data: { answer: { text: ['anchor', 'an anchor', 'anchors', 'ship’s anchor', 'a ship’s anchor', 'boat anchor', 'a boat anchor'] }, glyph: '⚓' },
      concepts: ['lateral']
    },
    {
      id: 'kid-calendar', title: 'Losing a Page Each Month', diff: 2,
      text: 'I hang on the wall, and I have twelve pages. Every month I lose one, and at the end of the year I am finished. I know when your birthday is, and when Christmas is, and which days you have no school.\n\n*What am I?*',
      hints: ['You look at me to find out what day it is.', 'Twelve pages, one for each month.'],
      explain: 'A **calendar**. It has a page for each of the twelve months, and a small square for each day. A whole year has 365 days (or 366 in a leap year, every four years).',
      data: { answer: { text: ['calendar', 'a calendar', 'calendars', 'wall calendar', 'a wall calendar', 'diary', 'a diary'] }, glyph: '📅' },
      concepts: ['lateral']
    },
    {
      id: 'kid-bread', title: 'Sliced but Never Hurt', diff: 2,
      text: 'I rise in the oven, but I do not have legs. I start as flour and water and a pinch of yeast. I am sliced and buttered, and I am toasted for breakfast, but I never complain. I am the *best thing since* somebody invented slicing me.\n\n*What am I?*',
      hints: ['You make a sandwich out of two slices of me.', 'The baker bakes me in the morning.'],
      explain: '**Bread**. Yeast is a tiny living thing that eats the sugar in the dough and makes bubbles of gas. The bubbles make the dough puff up, which is why bread is light and soft inside.',
      data: { answer: { text: ['bread', 'a loaf', 'loaf', 'a loaf of bread', 'loaf of bread', 'toast', 'a slice of bread', 'sliced bread'] }, glyph: '🍞' },
      concepts: ['lateral']
    },
    {
      id: 'kid-hiccups', title: 'The Noise You Cannot Stop', diff: 2,
      text: 'I sneak up on you when you have eaten too fast. I make you go *hic!*, and I make your whole body jump a little. You cannot stop me by wanting to, but people say a glass of water, or holding your breath, or a sudden fright will make me go away.\n\n*What am I?*',
      hints: ['A little noise in your throat, again and again.', 'It begins with an H, and it ends with an S.'],
      explain: '**Hiccups**. A muscle under your lungs, the diaphragm, gives a little jerk, and your voice box snaps shut, and out comes *hic!* Nobody knows why we have them, and nobody has found a cure that always works.',
      data: { answer: { text: ['hiccups', 'hiccup', 'the hiccups', 'hicups', 'the hiccup', 'hic'] }, glyph: '😲' },
      concepts: ['lateral']
    },
    {
      id: 'kid-letters-months', title: 'The Letters of the Year', diff: 2,
      text: 'Look at these letters: **J, F, M, A, M, J, J, A, S, O, N, …**\n\nThey are not in the alphabet order, and they are not random. Each one stands for something you know very well.\n\n*What letter comes next?*',
      hints: ['They are the first letters of something that comes in a long list of twelve.', 'January, February, March …'],
      explain: 'They are the first letters of the months: **J**anuary, **F**ebruary, **M**arch, **A**pril, **M**ay, **J**une, **J**uly, **A**ugust, **S**eptember, **O**ctober, **N**ovember, and the last is **D**ecember: the letter **D**.',
      data: { answer: { text: ['d', 'the letter d', 'letter d', 'december'] }, ask: 'A letter.', glyph: 'J·F·M' },
      concepts: ['sequence']
    },
    {
      id: 'kid-months-30', title: 'Thirty Days Hath …', diff: 2,
      text: 'Some months have 31 days, some have 30, and one poor month has only 28 (or 29).\n\n*How many of the twelve months have exactly 30 days?*',
      hints: ['Say the old rhyme: “Thirty days hath September, April, June and …”', 'September, April, June and November. Are there any others?'],
      explain: 'Four months have exactly thirty days: **April, June, September and November**. Seven have 31 days (January, March, May, July, August, October, December), and February has 28 or 29.',
      data: { answer: { num: 4 }, ask: 'How many months?', traps: [{ match: 5, msg: 'Nearly. Count them on your fingers: September, April, June, …' }, { match: 11, msg: 'Eleven months have at least 30 days, but the question is about exactly 30.' }, { match: 7, msg: 'Seven months have 31 days. We are looking for the months with exactly 30.' }], glyph: '30' },
      concepts: ['sequence']
    },
    {
      id: 'kid-magic-number', title: 'The Magic Number Trick', diff: 2,
      text: 'Here is a trick. Follow the steps in your head:\n\n1. Think of any number.<br>2. Double it.<br>3. Add 10.<br>4. Halve the result.<br>5. Take away the number you started with.\n\nWhatever number you thought of, the answer is always the same.\n\n*What is the answer?*',
      hints: ['Try it with a small number, like 3, and then with another, like 10.', 'With 3: double is 6, plus 10 is 16, half is 8, take away 3 leaves what?'],
      explain: 'The answer is always **5**. Doubling and then halving cancel out, so you end up with your number plus half of 10; and then you take your number away, and only the 5 is left. Try it on your friends: “Think of a number …”.',
      data: { answer: { num: 5 }, ask: 'What is the answer?', glyph: '🎩' },
      concepts: ['working-backwards']
    },
    {
      id: 'kid-two-digit', title: 'A Secret Number', diff: 2,
      text: 'I am a number between 20 and 40. I am an even number. If you add my two digits together, you get 8.\n\n*What number am I?*',
      hints: ['List the numbers between 20 and 40 whose two digits make 8. There are only two of them.', 'Which of those is even?'],
      explain: 'Numbers between 20 and 40 with digits that add up to 8 are 26 (2 + 6) and 35 (3 + 5). Only one of them is even: **26**.',
      data: { answer: { num: 26 }, ask: 'What number am I?', traps: [{ match: 35, msg: 'The digits of 35 do add up to 8, but 35 is an odd number.' }], glyph: '26' },
      concepts: ['deduction']
    },
    {
      id: 'kid-mushroom', title: 'A Room With No Doors', diff: 2,
      text: 'Here is a riddle that is really a joke.\n\n*What kind of room has no doors, no windows, no floor and no walls?*',
      hints: ['It is not a room in a house.', 'You might find it growing in a forest, or on your pizza.'],
      explain: 'A **mushroom**! It is a joke about the word *room*: it hides at the end of *mush-room*. The best riddles sometimes turn on the sound of a word.',
      data: mc('A mushroom', [['A cellar', 'A cellar has walls, a floor and a door.'], ['A cupboard', 'A cupboard has a door, and walls, and a floor.'], ['A garden shed', 'A shed has a door and a window and four walls.']], { glyph: '🍄' }),
      concepts: ['lateral']
    },
    {
      id: 'kid-bald-grandad', title: 'Rain on Grandad’s Head', diff: 2,
      text: 'Grandad Joe walks all the way home in the pouring rain. He has no hat, no umbrella and no hood, and yet, when he gets in, not a single hair on his head is wet.\n\n*How can that be?*',
      hints: ['Think about what is on top of Grandad’s head.', 'Read the riddle again: it says not a single hair is wet. Does he have any?'],
      explain: 'Grandad Joe is **bald**. He has no hair to get wet: the rain fell on his head, but not a single hair on it was wet. A riddle often lets you believe something the words never said: it did not say that Grandad had hair.',
      data: mc('Grandad Joe is bald, so he has no hair to get wet', [['Grandad Joe ran so fast that the raindrops could not catch him', 'The riddle says he walked all the way home.'], ['Grandad Joe walked between the raindrops without touching any', 'Nobody, not even a grandad, can dodge every raindrop in a downpour.'], ['Grandad Joe wore a hat made of water-proof hair', 'The riddle says he had no hat. It says nothing of any waterproof hair.']], { glyph: '🌧' }),
      concepts: ['lateral']
    },
    {
      id: 'kid-ages-three', title: 'Three Birthdays', diff: 2,
      text: 'Cy is 3 years old. His brother Ben is 4 years older than Cy. His big sister Ann is twice as old as Ben.\n\n*How old is Ann?*',
      hints: ['First find out how old Ben is.', 'Ben is 3 + 4 = 7. Ann is twice as old as that.'],
      explain: 'Ben is 4 years older than 3-year-old Cy: 3 + 4 = **7**. Ann is twice as old as Ben: 2 × 7 = **14**. Ann is fourteen: old enough to be the boss of the birthday cake.',
      data: { answer: { num: 14 }, ask: 'How old is Ann?', traps: [{ match: 7, msg: 'That is Ben’s age. Ann is twice as old as Ben.' }, { match: 6, msg: 'Careful: Ann is twice as old as *Ben*, not as Cy.' }], glyph: '🎂' },
      concepts: ['deduction']
    },
    {
      id: 'kid-fruit-bowl', title: 'Apples and Pears', diff: 2,
      text: 'A fruit bowl holds apples and pears, twelve pieces of fruit in all. There are **three times as many apples as pears**.\n\n*How many apples are in the bowl?*',
      hints: ['If there is one pear, there are three apples, that is four fruits in all. How many groups of “one pear and three apples” can you make from twelve fruits?', 'Four fruits make one group. Twelve fruits make three groups.'],
      explain: 'For every pear there are three apples, so the fruit comes in groups of one pear and three apples, four fruits in each group. Twelve fruits make 12 ÷ 4 = 3 groups: **3 pears** and 3 × 3 = **9 apples**.',
      data: { answer: { num: 9 }, ask: 'How many apples?', traps: [{ match: 3, msg: 'That is the number of pears. There are three times as many apples.' }, { match: 8, msg: 'Try checking: if there were 8 apples and 4 pears, would there be three times as many apples as pears?' }], glyph: '🍎' },
      concepts: ['deduction']
    },
    {
      id: 'kid-pocket-money', title: 'Saving for the Toy', diff: 2,
      text: 'Ella wants a toy that costs **15 pounds**. She has **5 pounds** already, and she saves **2 pounds** of pocket money every week.\n\n*How many weeks does she have to wait until she can buy the toy?*',
      hints: ['How much more money does Ella still need?', 'She needs 10 pounds more, and she saves 2 pounds a week.'],
      explain: 'Ella needs 15 − 5 = 10 more pounds. She saves 2 pounds a week, so 10 ÷ 2 = **5 weeks**. After the fifth week she has 5 + 10 = 15 pounds.',
      data: { answer: { num: 5, unit: 'weeks' }, ask: 'How many weeks?', traps: [{ match: 8, msg: 'That would be right if she had to save the whole 15 pounds. But she has 5 pounds already.' }], glyph: '💷' },
      concepts: ['rates']
    },
    {
      id: 'kid-marbles-twice', title: 'Marbles for Two', diff: 2,
      text: 'Sam and Tim have **18 marbles** between them. Sam has **twice as many marbles as Tim**.\n\n*How many marbles does Tim have?*',
      hints: ['Imagine Tim’s marbles in one pile. How many piles like that does Sam have?', 'Sam has two piles and Tim has one: three piles in all.'],
      explain: 'Tim has one pile and Sam has two piles of the same size, so there are three equal piles in all. 18 ÷ 3 = **6** marbles in a pile: Tim has 6 and Sam has 12.',
      data: { answer: { num: 6 }, ask: 'How many marbles has Tim?', traps: [{ match: 12, msg: 'That is how many Sam has. Tim has half of that.' }, { match: 9, msg: 'That would be if they had the same. But Sam has twice as many as Tim.' }], glyph: '🔮' },
      concepts: ['deduction']
    },
    {
      id: 'kid-day-before-yesterday', title: 'Yesterday’s Yesterday', diff: 2,
      text: 'Mo says: “The day before yesterday was Wednesday.”\n\n*What day is tomorrow?*',
      hints: ['Start from Wednesday and go forward two days: that is today.', 'Wednesday, Thursday (yesterday), and then today. And after today comes tomorrow.'],
      explain: 'The day before yesterday was Wednesday, so yesterday was Thursday and today is **Friday**. That makes tomorrow **Saturday**: the weekend!',
      data: { answer: { text: ['saturday', 'sat', 'tomorrow is saturday'], exact: true }, ask: 'What day is tomorrow?', traps: [{ match: ['friday', 'fri'], msg: 'Friday is today. What day comes after it?' }], glyph: '📆' },
      concepts: ['modular']
    },
    {
      id: 'kid-time-flies', title: 'Fast Without Wings', diff: 2,
      text: 'I fly, but I have no wings. I run, but I have no legs. You can save me, waste me, spend me and lose me, and yet you can never hold me in your hand. When you are having fun, I go quickly, and when you are bored, I go so slowly.\n\n*What am I?*',
      hints: ['Everybody has some of me each day, and it is the same amount for everybody.', 'I am counted by the clock.'],
      explain: '**Time**. People say “time flies” and “time runs out”, but time has no wings and no legs. We measure it with clocks and calendars, and we all get 24 hours in every day.',
      data: { answer: { text: ['time', 'the time'] }, glyph: '⏳' },
      concepts: ['lateral']
    },

    /* ============================ TRICKY FOR YOUNG SOLVERS ============================ */
    {
      id: 'kid-handshakes', title: 'Four Friends Say Hello', diff: 3,
      text: 'Four friends meet at the park: Ava, Ben, Cara and Dan. Every one of them shakes hands **once** with each of the others, and nobody shakes the same hand twice.\n\n*How many handshakes are there altogether?*',
      hints: ['How many hands does Ava shake? Then Ben, who has already shaken Ava’s hand: how many new ones?', 'Ava shakes 3 hands. Ben has 2 more to shake, Cara has 1. Add them up.'],
      explain: 'Ava shakes hands with Ben, Cara and Dan: **3**. Ben has already shaken Ava’s hand and has **2** left (Cara and Dan). Cara has only Dan left: **1**. Dan has shaken them all. 3 + 2 + 1 = **6** handshakes. (If you said 12, you counted each handshake twice: once from each side.)',
      data: { answer: { num: 6 }, ask: 'How many handshakes?', traps: [{ match: 12, msg: 'That counts every handshake twice, once from each friend. A handshake belongs to two people.' }, { match: 4, msg: 'Each friend shakes more than one hand. Count the handshakes for Ava, then Ben, then Cara.' }], glyph: '🤝' },
      concepts: ['combinatorics'], links: ['kid-legs-count']
    },
    {
      id: 'kid-hens-cows', title: 'Hens and Cows', diff: 3,
      text: 'A farmer has some hens and some cows in the yard. She counts **10 heads** and **28 legs** altogether.\n\n*How many hens are there?*',
      hints: ['A hen has 2 legs and a cow has 4. Imagine all 10 animals stood on two legs. How many legs would you have?', 'That would be 20 legs, but the farmer counted 28. The extra 8 legs are the cows’ other two legs: each cow adds two more.'],
      explain: 'If all 10 animals were hens, there would be 20 legs. The farmer counted 28, so there are 8 legs too many: 8 ÷ 2 = 4 cows (each cow has two more legs than a hen). So there are **4 cows** and **6 hens**: 6 × 2 + 4 × 4 = 12 + 16 = 28 legs.',
      data: { answer: { num: 6 }, ask: 'How many hens?', traps: [{ match: 4, msg: 'That is the number of cows. How many hens are left, out of 10 heads?' }], glyph: '🐔' },
      concepts: ['diophantine']
    },
    {
      id: 'kid-cake-cuts', title: 'Eight Pieces, Three Cuts', diff: 3,
      text: 'A round cake is to be shared by eight children, and everybody must get a piece of exactly the same size. You may use a knife **only three times**, and each cut goes straight down through the whole cake or straight across it.\n\n*Which way of cutting works?*',
      hints: ['Three straight cuts from top to bottom through the same cake make at most seven pieces. But a cake is a solid thing, not a flat picture.', 'What if one of the cuts goes sideways, as when you slice a bun in half to butter it?'],
      explain: 'Two cuts straight down through the middle, crossing like a plus sign, make **four** equal wedges. The third cut goes **flat across, sideways**, through the middle of the cake, like slicing a bun. Every wedge is cut into a top piece and a bottom piece, so there are 4 × 2 = **eight** equal pieces (though only some of them have the icing!).',
      data: mc('Two cuts from the top crossing at the middle like a plus sign, and one cut sideways through the middle of the cake', [['Three cuts from the top, all through the middle of the cake, like the spokes of a wheel or the rays of a star', 'Three cuts through the middle from the top make only six pieces, not eight.'], ['Three straight cuts from the top, side by side and parallel, spaced so that every slice is the same width', 'Three parallel cuts make only four pieces, and they would not all be the same size.'], ['It cannot be done, because three cuts can make at most seven pieces, however you arrange them', 'From the top, yes; but a cake is solid. Use all three directions: two down and one across.']], { glyph: '🎂' }),
      concepts: ['lateral', 'symmetry']
    },

  ].sort((a, b) => a.diff - b.diff));
})();
