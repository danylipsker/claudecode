/* The Puzzle Cabinet · data/phenomena.js
 * Moving paradoxes: riddles about the physical world, each with a figure on
 * the card that can be played — predict first, then run the experiment.
 * Figures: js/lib/figures.js (phys-*). All statements are our own words. */
Cabinet.concepts([
  { id: 'rolling', name: 'Rolling without slipping', see: ['relative-motion'],
    text: 'A wheel that rolls without slipping has its lowest point at rest for an instant: the tyre is laid on the road, not dragged. So the axle moves forward by one circumference for each turn, the top of the wheel moves at twice the axle\'s speed, and a coin rolled round another coin turns once for the length of edge it meets **and once more** for the trip round.\n\nMost wheel paradoxes — Aristotle\'s wheel, the coin that turns twice, the backward-moving flange of a train wheel — come from forgetting one of these two ideas.' },
  { id: 'relative-motion', name: 'Frames of reference', see: ['rolling'],
    text: 'How fast something moves depends on who is watching. A ball thrown straight up in a smooth train falls back into your hand; seen from the platform it flies in an arc. The laws of motion are the same for every observer moving steadily, so a hard problem is often easy in the right frame: follow the river, not the bank; ride on the belt, not the ground.' },
  { id: 'buoyancy', name: 'Archimedes\' principle', see: ['centre-of-mass'],
    text: 'A body in water is pushed up by a force equal to the weight of the water it displaces. A floating body therefore displaces **its own weight** of water; a sunken one displaces only **its own volume**.\n\nThat single distinction settles the ice cube in the glass (level unchanged), the stone thrown out of the boat (level falls) and the ice cube in salt water (level rises).' },
  { id: 'centre-of-mass', name: 'The centre of mass', see: ['torque'],
    text: 'Every body behaves, for balancing and for falling, as if its weight were gathered at one point: its **centre of mass**. A stack of books stands as long as the centre of mass of every part above each book lies over that book; two forks and a toothpick hang from a glass rim because their centre of mass lies below the point of support.' },
  { id: 'momentum', name: 'Momentum and impulse', see: ['energy'],
    text: 'Momentum is mass times velocity, and it changes only when a force acts: force is the rate of change of momentum. Nothing inside a closed system can change its total momentum. The hourglass on the scale, Newton\'s cradle and the rocket all run on this rule.' },
  { id: 'energy', name: 'Conservation of energy', see: ['momentum'],
    text: 'Energy changes form — height into speed, motion into heat — but the total stays the same. A frictionless bead sliding on a wire has the same speed at the same height, whatever the shape of the wire; this is why all that matters in the race of the balls is how soon each one gets its speed.' },
  { id: 'free-fall', name: 'Everything falls alike', see: ['relative-motion'],
    text: 'Without air, every body falls with the same acceleration, whatever it weighs: about 9.8 m/s² on Earth and 1.6 m/s² on the Moon. Galileo argued for it with a thought experiment about tying two stones together; in 1971 the astronaut David Scott showed it on the Moon with a hammer and a falcon feather. A body in free fall feels weightless — which is why water stops pouring from a falling cup.' },
  { id: 'friction', name: 'Friction',
    text: 'Friction between two dry surfaces is roughly proportional to how hard they are pressed together, and a surface at rest ("static" friction) grips a little harder than one already sliding ("kinetic" friction). Those two facts explain why two fingers sliding under a ruler always meet at its balance point.' },
  { id: 'cycloid', name: 'The cycloid', see: ['rolling'],
    text: 'The curve traced by a point on the rim of a rolling wheel. It has two famous properties, both found in the 17th century: a bead sliding down a cycloid arch reaches the bottom **faster than along any other curve** (the brachistochrone), and it takes **the same time wherever it starts** (the tautochrone). Huygens used the second to design a pendulum clock that keeps time whatever the swing.' },
  { id: 'air-pressure', name: 'The weight of the air', see: ['surface-tension'],
    text: 'We live at the bottom of an ocean of air that presses on every square centimetre with the weight of about a kilogram. Take the air away from one side of something — from under a card on an upside-down glass, from inside a glass that has cooled over a candle — and the air on the other side pushes, hard. Air that is moving fast along a surface presses on it less than still air, which is why a ball hovers in a jet of air and a sheet of paper rises when you blow over it.' },
  { id: 'harmonic-series', name: 'The harmonic series', see: ['geometric-series'],
    text: '1 + 1/2 + 1/3 + 1/4 + … grows without limit, though ever more slowly: the first hundred terms add up to only about 5.19, the first million to about 14.4. It measures how far a stack of books can lean over a table edge, and how long you must keep buying cereal to collect every toy.' }
]);

(function () {
  const COIN = (params, h) => ({ fig: 'phys-coin-roll', params, w: 620, h: h || 390 });
  const list = [
    /* ---------- rolling coins ---------- */
    {
      id: 'phen-coin-twice', title: 'The Coin That Turns Twice', diff: 2,
      source: 'The coin rotation paradox, a traditional puzzle.',
      text: 'Two identical coins lie flat on the table, touching. Hold one still, and roll the other round its edge — rolling, never sliding — until it is back where it started.\n\nSeen from above, how many complete **turns** has the rolling coin made?',
      hints: ['The two edges are the same length, so the answer looks like 1. Roll it half way to the far side and look at the arrow.', 'Half way round, the arrow already points straight up again.'],
      explain: 'It turns **twice**. Half way round it is already the right way up. Two turns add together: the coin turns once because it rolls along an edge as long as its own — as it would on a straight road — and once more because its road curls all the way round the fixed coin and brings it round with it. A coin rolling round the outside of a circle R times its own size turns R + 1 times.',
      data: {
        answer: { num: 2, unit: 'turns' },
        traps: [{ match: 1, msg: 'That is what the edges say — they are the same length. But the road itself goes round in a circle. Try it on the card.' }],
        glyph: '🪙', figure: COIN({ R: 1 })
      },
      concepts: ['rolling'], links: ['phen-coin-sat', 'phen-moon-spin']
    },
    {
      id: 'phen-coin-sat', title: 'The Exam With No Right Answer', diff: 3,
      source: 'After a question in the American SAT test of May 1982, whose answer key was wrong.',
      text: 'A small coin rolls, without slipping, round the outside of a big one whose radius is **three times** as large, until it is back at its start.\n\nHow many turns does the small coin make?',
      hints: ['The big coin\'s edge is three times as long as the small one\'s.', 'Now add the turn that comes from travelling once round a circle.'],
      explain: '**4** turns: three for the length of edge it rolls along, and one more for going round. In 1982 a question almost exactly like this was set in the American SAT exam. The answers on offer did not include 4 — the setters had forgotten the extra turn, and gave 3. A few sharp students wrote in, and the test had to be re-scored.',
      data: {
        answer: { num: 4, unit: 'turns' },
        traps: [{ match: 3, msg: 'That was the examiners\' answer in 1982 — and they were wrong. Roll it and count.' }],
        glyph: '4', figure: COIN({ R: 3 })
      },
      concepts: ['rolling'], links: ['phen-coin-twice', 'phen-coin-big']
    },
    {
      id: 'phen-coin-big', title: 'The Big Coin Goes Round', diff: 3,
      text: 'This time the **big** coin moves. Its diameter is twice the small coin\'s. Hold the small coin still, and roll the big one round it, without slipping, back to where it began.\n\nHow many turns does the big coin make?',
      hints: ['Use the rule from the other coins: rolling round the outside of a circle R times your own size gives R + 1 turns.', 'Here the fixed coin is only half the size of the rolling one: R = ½.'],
      explain: '**1½** turns. The big coin meets only half its own edge on the way round (the small coin\'s edge is half as long), which gives half a turn; the trip round adds one more. The formula R + 1 still works when R is less than 1.',
      data: {
        answer: { num: 1.5, show: '1 1/2', unit: 'turns' },
        traps: [{ match: 0.5, msg: 'That is just the length of edge it meets. The trip round the small coin adds another whole turn.' }, { match: 2, msg: 'That is right for equal coins. This one is twice as big as the coin it rolls round.' }],
        glyph: '1½', figure: COIN({ R: 0.5 })
      },
      concepts: ['rolling'], links: ['phen-coin-twice']
    },
    {
      id: 'phen-coin-inside', title: 'Round the Inside', diff: 3,
      text: 'A coin rolls round the **inside** of a circular hole whose radius is three times its own, keeping in contact with the edge and never slipping, until it is back at its starting point.\n\nHow many turns does it make?',
      hints: ['On the outside the trip round added a turn. What does travelling round the inside do?', 'The coin\'s centre travels round a circle of radius 2 — measured in coin radii.'],
      explain: '**2** turns — and backwards: the coin travels round anticlockwise but spins clockwise. Its centre goes round a circle of radius 2 (in coin radii), a road twice as long as the coin\'s own edge, so it turns twice. On the inside the trip round *takes away* a turn instead of adding one: 3 − 1 = 2. This is how the gears of a planetary gearbox, and the Spirograph toy, count their turns.',
      data: {
        answer: { num: 2, unit: 'turns' },
        traps: [{ match: 4, msg: 'That is the outside answer. On the inside the trip round takes a turn away.' }, { match: 3, msg: 'Three turns\' worth of edge — but going round the inside undoes one of them.' }],
        glyph: '◎', figure: COIN({ R: 3, inside: true })
      },
      concepts: ['rolling'], links: ['phen-coin-sat']
    },
    {
      id: 'phen-coin-six', title: 'Round a Ring of Six', diff: 4,
      text: 'Six equal coins lie in a ring, each touching its two neighbours, like the petals of a flower without its middle. A seventh coin rolls round the **outside** of the ring, touching one or two of them at every moment and never slipping, until it is back where it began.\n\nHow many turns does it make?',
      hints: ['The rolling coin\'s centre stays at distance 2 (in coin radii) from the centre of whichever coin it is rolling on. What angle does it sweep round each coin?', 'Round each of the six coins it sweeps 120°. What does that add up to?'],
      explain: 'It turns **4** times. Its centre sweeps 120° round each of the six coins at a distance of 2 radii, 720° in all — the same road as going twice round a single coin, which is 2 turns each time. In general, round a convex ring of n touching coins the count is 2 + n/3: 3 turns for a triangle of three, 4 for this ring of six.',
      data: {
        answer: { num: 4, unit: 'turns' },
        traps: [{ match: 6, msg: 'It does not go right round each coin: it only sweeps a third of the way round each one.' }, { match: 7, msg: 'Six coins and one more for the trip round? The edges it rolls on are only a third of each coin.' }],
        glyph: '❀', figure: COIN({ R: 1, fixed: [[2, 0], [1, 1.7320508], [-1, 1.7320508], [-2, 0], [-1, -1.7320508], [1, -1.7320508]], seconds: 12 }, 420)
      },
      concepts: ['rolling', 'symmetry'], links: ['phen-coin-twice']
    },
    {
      id: 'phen-moon-spin', title: 'Does the Moon Spin?', diff: 2,
      text: 'The Moon always shows the same face to the Earth: nobody saw its far side until a space probe photographed it in 1959. Some people conclude that the Moon does not spin at all.\n\nIn one trip round the Earth, how many times does the Moon turn on its axis, measured against the distant stars?',
      hints: ['Try the button that stops the Moon spinning, and watch which side faces the Earth.', 'To keep its face towards the Earth, the face must point in every direction in turn during one orbit.'],
      explain: '**Once** per orbit — about every 27.3 days. A Moon that did not spin would keep its face pointing at the same star, and we would see all its sides during a month. To keep one face towards us it must turn exactly once for each trip round, in the same direction: it is the coin paradox with the Earth as the fixed coin. The tides of the Earth long ago slowed the Moon\'s spin to exactly this rate.',
      data: {
        answer: { choice: 1, choices: ['Not at all', 'Once', 'Twice', 'About 27 times'] },
        traps: [{ match: 0, msg: 'Press "Stop it spinning" on the card and see which side the Earth would see.' }, { match: 3, msg: 'It takes about 27 days to go round, but it does not turn once a day.' }],
        glyph: '🌓', figure: { fig: 'phys-orbit', params: { mode: 'moon' }, w: 620, h: 400 }
      },
      concepts: ['rolling', 'relative-motion'], links: ['phen-coin-twice', 'phen-sidereal']
    },
    {
      id: 'phen-sidereal', title: 'Days Against the Stars', diff: 4,
      text: 'A day, noon to noon, is the time the Earth takes to turn once *as seen from the Sun*. A year has about 365¼ of these days.\n\nHow many times does the Earth turn on its axis in a year, measured against the distant stars?',
      hints: ['The card shows a toy year of only 4 days. Count the noons and count the turns against the stars.', 'The Earth goes round the Sun in the same direction as it spins, so the trip round adds one turn — as for the coins.'],
      explain: '**366¼** times. Going once round the Sun, in the same direction as it spins, costs the Earth one noon: the stars see one turn more than the Sun does. So a day measured against the stars, the *sidereal day*, is about 23 hours 56 minutes 4 seconds, and astronomers\' clocks run on it. It is the coin rotation paradox on the grandest scale.',
      data: {
        answer: { num: 366.25, show: '366 1/4', tol: 0.01, unit: 'turns' },
        traps: [{ match: 365.25, msg: 'That counts the noons — the turns seen from the Sun. The stars count one more.' }, { match: 364.25, msg: 'The Earth goes round the Sun the same way as it spins, so the stars count one more turn, not one fewer.' }],
        glyph: '✦', figure: { fig: 'phys-orbit', params: { mode: 'earth', days: 4 }, w: 620, h: 400 }
      },
      concepts: ['rolling', 'relative-motion'], links: ['phen-moon-spin']
    },

    /* ---------- wheels ---------- */
    {
      id: 'phen-aristotle', title: 'Aristotle\'s Wheel', diff: 3,
      source: 'The *Mechanica* (*Mechanical Problems*), a Greek text of the 4th or 3rd century BC long ascribed to Aristotle; taken up again by Galileo in 1638.',
      text: 'A wheel has a smaller hub fixed to it, and each rests on its own rail. The wheel rolls one whole turn without slipping, so it moves forward by exactly its own circumference. The hub also turns once — and it also moves forward by the *wheel\'s* circumference, although its own rim is only half as long.\n\nHow does the hub manage it?',
      hints: ['Roll it on the card and watch the tape each rim lays on its rail.', 'Can both circles roll without slipping at the same time?'],
      explain: 'The hub\'s rim **skids**. Only one of the two circles can roll without slipping; the other is dragged along its rail, sliding as it turns. With the hub half the size of the wheel, the point of the hub touching its rail always moves forward at half the axle\'s speed — rubbing along the rail the whole way. Switch the card to "Hub rolls" and the big rim skids backwards instead. The puzzle troubled thinkers for two thousand years; Galileo explained it with a polygon that makes tiny jumps, and let the jumps shrink to nothing.',
      data: {
        answer: { choice: 0, choices: ['Its rim slides along its rail as it turns', 'Its rim stretches as it rolls', 'It makes an extra turn on the way', 'The two distances are really the same'] },
        traps: [{ match: 1, msg: 'A wooden rim does not stretch, and nothing on the card stretches either.' }, { match: 2, msg: 'It is fixed to the wheel: it turns exactly as often as the wheel does.' }, { match: 3, msg: 'Measure them: a rim half as big is half as long.' }],
        glyph: '⊚', figure: { fig: 'phys-aristotle', params: { ratio: 0.5 }, w: 620, h: 340 }
      },
      concepts: ['rolling'], links: ['phen-wheel-top']
    },
    {
      id: 'phen-wheel-top', title: 'Which Part Is Fastest?', diff: 1,
      text: 'A cyclist rides along at 20 km/h. Measured from the road, which part of the tyre of the front wheel is moving **fastest**?',
      hints: ['From the bicycle, every part of the tyre moves at 20 km/h. From the road, the whole wheel is carried forward at 20 km/h as well.', 'Add the two motions at the top, and at the bottom.'],
      explain: 'The **top**: it moves at 40 km/h, twice the bicycle\'s speed, because its motion round the axle and the forward motion of the axle add up. At the bottom they cancel: the bit of tyre touching the road is at rest for that instant. That is why the spokes of a wheel in a photograph are blurred at the top and sharp at the bottom.',
      data: {
        answer: { choice: 0, choices: ['The top', 'The front', 'The bottom', 'All parts move equally fast'] },
        traps: [{ match: 3, msg: 'True as seen from the bicycle. From the road, add the forward motion of the whole wheel.' }, { match: 2, msg: 'The bottom is the one part that is not moving at all.' }],
        glyph: '🚲', figure: { fig: 'phys-cycloid', params: { mode: 'wheel' }, w: 620, h: 270 }
      },
      concepts: ['rolling', 'relative-motion'], links: ['phen-wheel-rest', 'phen-train-backwards']
    },
    {
      id: 'phen-wheel-rest', title: 'The Standing Tyre', diff: 2,
      text: 'A car drives along a motorway at 100 km/h without skidding.\n\nAt this instant, how fast (in km/h) is the bit of tyre that touches the road moving, relative to the road?',
      hints: ['If it were moving, would the tyre be rolling or sliding?', 'Watch the bottom arrow on the card.'],
      explain: '**0** km/h. Rolling without slipping means exactly this: the bit of tyre on the road is at rest while it is there — it is laid down and picked up, never dragged. That is also why a tyre\'s grip on the road is *static* friction, which is stronger than the friction of a skid, and why brakes that lock the wheels stop a car less well.',
      data: {
        answer: { num: 0, unit: 'km/h' },
        traps: [{ match: 100, msg: 'That is the speed of the axle. The tyre also turns round the axle — backwards at the bottom.' }, { match: 200, msg: 'That is the top of the tyre. The bottom is quite different.' }],
        glyph: '0', figure: { fig: 'phys-cycloid', params: { mode: 'wheel' }, w: 620, h: 270 }
      },
      concepts: ['rolling', 'friction'], links: ['phen-wheel-top']
    },
    {
      id: 'phen-train-backwards', title: 'The Train That Goes Backwards', diff: 3,
      text: 'A train is racing from London to Edinburgh at full speed.\n\nIs any part of the train moving, at some moment, **towards London**?',
      hints: ['A train wheel has a flange: a rim bigger than the part that runs on the rail, hanging down beside the rail to keep the train on the track.', 'The wheel rolls on the rail, so its point of contact is at rest. What about a point further out, below the rail\'s top?'],
      explain: 'Yes: the **bottom of each flange**. The wheel rolls on the rail, so its point of contact is momentarily at rest; the flange reaches below that point, and the bottom of the flange is further from the axle than the contact point, so its backward motion round the axle beats the forward motion of the train. Traced out, it makes a little backward loop (in red on the card). At every moment, some part of a speeding train is going the wrong way.',
      data: {
        answer: { choice: 1, choices: ['No: every part moves forward, or is still for an instant', 'Yes: the bottom of each wheel\'s flange', 'Yes: the top of each wheel', 'Only the smoke from the engine'] },
        traps: [{ match: 0, msg: 'True for the tread of the wheel, which touches the rail. But the flange reaches further down.' }, { match: 2, msg: 'The tops of the wheels move forward at twice the train\'s speed.' }, { match: 3, msg: 'Smoke is not part of the train — and it is a trick answer anyway.' }],
        glyph: '🚂', figure: { fig: 'phys-cycloid', params: { mode: 'flange' }, w: 620, h: 320 }
      },
      concepts: ['rolling', 'cycloid'], links: ['phen-wheel-top']
    },

    /* ---------- ladders, bicycles, spools ---------- */
    {
      id: 'phen-ladder-cat', title: 'The Cat on the Ladder', diff: 2,
      text: 'A ladder leans against a wall. A cat is asleep on the **middle rung**. The foot of the ladder starts to slide away from the wall, and the top slides down the wall, until the ladder lies flat on the floor. The cat sleeps on.\n\nWhat path does the sleeping cat follow?',
      hints: ['Try other rungs first with the slider, then come back to the middle.', 'The ladder, the wall and the floor make a rectangle with the corner of the room. The ladder is one diagonal. How long is the other one?'],
      explain: 'A **quarter of a circle** centred on the corner of the room, with radius half the ladder. The ladder is one diagonal of the rectangle made with the wall and floor; the two diagonals of a rectangle are equal and cross at their midpoints. So the middle of the ladder is always half a ladder-length from the corner. A cat on any other rung traces part of an ellipse — which is how the old "trammel of Archimedes" draws ellipses.',
      data: {
        answer: { choice: 2, choices: ['A straight line, slanting down', 'A curve bulging towards the corner', 'An arc of a circle round the corner of the room', 'A parabola, like a thrown ball'] },
        traps: [{ match: 0, msg: 'Slide the ladder and watch the red trace: it is not straight.' }, { match: 1, msg: 'It bulges the other way: it keeps the same distance from the corner.' }],
        glyph: '🐈', figure: { fig: 'phys-ladder', params: { cat: 0.5 }, w: 620, h: 380 }
      },
      concepts: ['symmetry'], links: ['phen-ladder-wall']
    },
    {
      id: 'phen-ladder-wall', title: 'Does the Ladder Leave the Wall?', diff: 5,
      text: 'A uniform ladder stands against a wall at a steep angle. The floor and the wall are both perfectly smooth — no friction at all — and it is let go. Its top slides down the wall while its foot slides out across the floor.\n\nDoes the top of the ladder stay against the wall all the way down?',
      hints: ['The wall can only push, never pull. What horizontal force does the ladder need as it falls?', 'The middle of the ladder moves on a circle round the corner (see the cat puzzle) and speeds up — but later it would have to slow down its sideways motion. Who could provide that force?', 'Energy gives the speed along the circle; the wall stops pushing when the middle\'s horizontal speed stops growing. That happens at a fixed fraction of the starting height.'],
      explain: 'No: the top **leaves the wall when it has fallen to two-thirds of its starting height**. While both ends touch, the middle of the ladder runs on a circle round the corner, and energy fixes its speed. The wall is the only thing pushing the ladder away from it, so the wall\'s push is what makes the middle gain horizontal speed. On the circle, the horizontal speed rises and would then have to fall again — which would need the wall to *pull*. The wall cannot pull, so the ladder parts company with it exactly when that horizontal speed peaks: at height ⅔ of the start, whatever the starting angle. After that it keeps sliding out at a steady pace while it falls.',
      data: {
        answer: { choice: 1, choices: ['Yes, it stays on the wall until the ladder lies flat', 'No: it leaves the wall at two-thirds of its starting height', 'No: it leaves the wall at half its starting height', 'No: it jumps off the wall at once'] },
        traps: [{ match: 0, msg: 'Watch the push of the wall on the card: it falls to zero long before the end.' }, { match: 2, msg: 'Close — but the push of the wall runs out a little sooner. Try several starting angles.' }, { match: 3, msg: 'At first the wall has to push, to get the foot moving outwards.' }],
        glyph: '🪜', figure: { fig: 'phys-ladder', params: { mode: 'dyn', start: 70 }, w: 620, h: 380 }
      },
      concepts: ['energy', 'centre-of-mass'], links: ['phen-ladder-cat']
    },
    {
      id: 'phen-bike-pedal', title: 'The Pedal Pulled Backwards', diff: 4,
      text: 'A bicycle stands upright on level ground (someone steadies the saddle lightly, without pushing). Its pedals are vertical, and a string is tied to the **lower pedal**. You pull the string **backwards**, horizontally, towards the back of the bike.\n\nWhich way does the bicycle move? (It has an ordinary gear.)',
      hints: ['Pulling the lower pedal backwards would turn the pedals forwards — which would drive the bike forwards. But the bike moving forwards would carry the pedal forwards too.', 'Compare how far the pedal moves with how far the bike moves. In an ordinary gear, a small turn of the crank sends the bike much further.', 'The pedal can only go where the string pulls it: backwards, over the ground.'],
      explain: 'The bicycle rolls **backwards** — towards you — and its cranks turn backwards. The pedal on the ground can only move the way the string pulls it. If the bike went forwards, the gear would make it travel several times further than the crank moves the pedal back, so the pedal would end up moving forwards over the ground: impossible. So the bike rolls back, the cranks turn backwards, and the pedal moves backwards over the ground — though a little less than the bike, so relative to the frame it creeps forwards. With the gear slider you can find the absurdly low gear (about 0.5) where the two effects cancel and the pedal will not move at all, and below it the bike really does go forwards.',
      data: {
        answer: { choice: 1, choices: ['Forwards, as if pedalled', 'Backwards, towards you', 'It does not move', 'It depends on how hard you pull'] },
        traps: [{ match: 0, msg: 'That is the trap. If the bike rolled forwards, the gear would carry the pedal forwards over the ground — against the string.' }, { match: 2, msg: 'Only in one very strange gear. Try the slider after you have answered.' }],
        glyph: '🚲', figure: { fig: 'phys-bike', params: { gear: 2.4 }, w: 620, h: 360 }
      },
      concepts: ['rolling', 'relative-motion'], links: ['phen-spool-toward']
    },
    {
      id: 'phen-spool-toward', title: 'The Obedient Spool', diff: 2,
      text: 'A cotton reel lies on its side on the table. The thread comes off the **bottom** of the middle of the reel and runs to your hand. You pull the thread gently and **horizontally**, away from the reel.\n\nWhich way does the reel roll?',
      hints: ['The reel pivots about the point where it touches the table.', 'The thread pulls on the reel along a line below the axle but above the table. Which way does that turn the reel about its point of contact?'],
      explain: 'It rolls **towards you**, winding up the thread as it comes. Think of the reel turning about the point where it touches the table: your pull acts along a line above that point, so it tips the reel over towards you. The reel comes towards you even though the thread is unwinding from its underside — it simply rolls faster than it unwinds. Raise the thread steeply enough and the reel rolls away instead.',
      data: {
        answer: { choice: 0, choices: ['Towards you, winding up the thread', 'Away from you, unwinding the thread', 'It spins on the spot', 'It slides without turning'] },
        traps: [{ match: 1, msg: 'The thread unwinds from underneath, so it looks as if the reel should turn away. But it turns about the point on the table, not about its axle.' }],
        glyph: '🧵', figure: { fig: 'phys-spool', params: { angle: 0, ratio: 0.5 }, w: 620, h: 360 }
      },
      concepts: ['torque', 'rolling'], links: ['phen-spool-angle']
    },
    {
      id: 'phen-spool-angle', title: 'The Reel That Will Not Roll', diff: 4,
      text: 'The same cotton reel: its axle has **half** the radius of its rims, and the thread comes off the bottom of the axle. Pulled flat, it rolls towards you; pulled nearly straight up, it rolls away.\n\nAt what angle above the horizontal (in degrees) must you pull so that it does **not roll** either way?',
      hints: ['It does not roll when the line of the thread passes exactly through the point where the rim touches the table.', 'That line touches the axle (radius r) and passes through the contact point (a distance R below the centre). Draw the right angle at the point where the thread leaves the axle.', 'The cosine of the angle is r/R.'],
      explain: 'At **60°**. The reel turns about its point of contact with the table, so it has no reason to roll when the thread\'s line passes right through that point. The thread leaves the axle at a right angle to a radius; with the contact point a distance R from the centre, the angle θ of the thread satisfies cos θ = r/R = ½, so θ = 60°. Pulled more steeply the reel rolls away; less steeply, towards you. At exactly 60° it just slides (or stays put).',
      data: {
        answer: { num: 60, unit: '°', tol: 0.5 },
        traps: [{ match: 30, msg: 'That is the angle from the vertical. The question asks from the horizontal.' }, { match: 45, msg: 'Try it on the card: at 45° it still rolls towards you.' }],
        glyph: '60°', figure: { fig: 'phys-spool', params: { angle: 30, ratio: 0.5 }, w: 620, h: 360 }
      },
      concepts: ['torque'], links: ['phen-spool-toward']
    },

    /* ---------- Archimedes ---------- */
    {
      id: 'phen-ice-brim', title: 'The Brimming Glass', diff: 1,
      text: 'An ice cube floats in a glass of water that is filled **exactly to the brim**; part of the cube sticks up above the rim. The ice melts.\n\nDoes the glass overflow?',
      hints: ['A floating body pushes aside exactly its own weight of water.', 'When the ice melts it becomes water weighing just what the ice weighed.'],
      explain: '**No** — the level stays exactly where it was. A floating cube pushes aside precisely its own weight of water. When it melts it turns into precisely that weight of water, which fills exactly the hole it used to make. The part sticking up above the surface is the extra volume ice has because it is less dense than water; it vanishes as the ice melts.',
      data: {
        answer: { choice: 2, choices: ['Yes, it overflows', 'No, the level drops a little', 'No, the level stays exactly the same'] },
        traps: [{ match: 0, msg: 'That is what the part above the rim suggests. But it melts into less than it looks.' }, { match: 1, msg: 'Ice is less dense than water, but the melt water fills the hole the ice made exactly.' }],
        glyph: '🧊', figure: { fig: 'phys-float', params: { scene: 'ice' }, w: 620, h: 410 }
      },
      concepts: ['buoyancy'], links: ['phen-ice-salt', 'phen-ice-pebble']
    },
    {
      id: 'phen-ice-salt', title: 'Ice in Salt Water', diff: 3,
      text: 'The same trick, but now the glass is full to the brim with **very salty** water, and the ice cube is made of fresh water. The ice melts.\n\nWhat happens?',
      hints: ['Salt water is denser than fresh water, so a floating cube needs to push aside less of it.', 'Melted, the cube becomes fresh water: the same weight as the ice, but taking more room than the salt water it pushed aside.'],
      explain: 'The glass **overflows**. Floating in salt water, the ice pushes aside its own weight of *salt* water, which takes up less room than the same weight of fresh water. When it melts it becomes fresh water, filling more than the hole it made. (This is one reason melting sea ice raises sea level very slightly — though far less than ice melting on land.)',
      data: {
        answer: { choice: 0, choices: ['It overflows a little', 'The level stays exactly the same', 'The level falls a little'] },
        traps: [{ match: 1, msg: 'That is the fresh-water answer. Here the melt water is lighter than the water it lands in.' }, { match: 2, msg: 'The fresh melt water takes more room than the salt water the ice pushed aside, not less.' }],
        glyph: '🧂', figure: { fig: 'phys-float', params: { scene: 'salt' }, w: 620, h: 410 }
      },
      concepts: ['buoyancy'], links: ['phen-ice-brim']
    },
    {
      id: 'phen-ice-pebble', title: 'The Pebble in the Ice', diff: 3,
      text: 'A pebble is frozen inside an ice cube, which still floats in a tank of water. The ice melts and the pebble sinks to the bottom.\n\nDoes the water level rise, fall or stay the same?',
      hints: ['While the pebble rides in the ice, it is afloat: it pushes aside its own **weight** of water.', 'On the bottom it pushes aside only its own **volume** of water — and a pebble is much denser than water.'],
      explain: 'The level **falls**. Afloat inside the ice, the pebble displaced its own weight of water — about 2.7 times its own volume. On the bottom it displaces only its own volume. The ice itself makes no difference, as in the brimming glass. So the water drops by the difference.',
      data: {
        answer: { choice: 1, choices: ['It rises', 'It falls', 'It stays the same'] },
        traps: [{ match: 0, msg: 'The pebble on the bottom takes up less room than the water it held down while afloat.' }, { match: 2, msg: 'That would be true for pure ice. The pebble changes from floating to sunk.' }],
        glyph: '🪨', figure: { fig: 'phys-float', params: { scene: 'stone' }, w: 620, h: 410 }
      },
      concepts: ['buoyancy'], links: ['phen-boat-anchor', 'phen-ice-brim']
    },
    {
      id: 'phen-boat-anchor', title: 'Archimedes\' Anchor', diff: 3,
      text: 'A boat floats on a small pond, carrying a heavy iron anchor. The boatman throws the anchor overboard, and it sinks to the bottom.\n\nDoes the level of the pond rise, fall or stay the same?',
      hints: ['In the boat, the anchor is afloat: the boat sinks deeper by enough water to match the anchor\'s weight.', 'On the bottom, the anchor pushes aside only its own volume. Iron is almost eight times as dense as water.'],
      explain: 'The level **falls**. In the boat, the anchor pushed aside its own **weight** of water, nearly eight times its own volume. At the bottom it pushes aside only its own **volume**. The boat rises a lot, the anchor takes back a little, and the pond ends lower. It is a famous catch for physicists, who tend to answer too quickly.',
      data: {
        answer: { choice: 1, choices: ['It rises', 'It falls', 'It stays the same'] },
        traps: [{ match: 0, msg: 'It feels as if the anchor, now in the water, should raise it. But it held more water aside while it was in the boat.' }, { match: 2, msg: 'It would stay the same for something that floats, or for a bucket of pond water. Iron sinks.' }],
        glyph: '⚓', figure: { fig: 'phys-float', params: { scene: 'boat-anchor' }, w: 620, h: 410 }
      },
      concepts: ['buoyancy'], links: ['phen-boat-bucket', 'phen-ice-pebble']
    },
    {
      id: 'phen-boat-bucket', title: 'Bailing Out', diff: 2,
      text: 'A boat on a small pond carries a full bucket of pond water. The boatman empties the bucket over the side.\n\nDoes the level of the pond rise, fall or stay the same? And if he had thrown a **log** overboard instead?',
      hints: ['In the boat, the bucket of water is afloat: it pushes aside its own weight of water.', 'In the pond, the water is just part of the pond. And a log floats, so it still pushes aside its own weight.'],
      explain: 'It **stays the same** — and it would for the log too. While they ride in the boat, the bucket of water and the log each make the boat push aside their own weight of water. Emptied into the pond, the water pushes aside exactly its own weight (it *is* that water); the log, floating, pushes aside its own weight too. Only something that sinks, like an anchor, changes the level.',
      data: {
        answer: { choice: 2, choices: ['It rises both times', 'It falls both times', 'It stays the same both times', 'The water: the same; the log: it rises'] },
        traps: [{ match: 3, msg: 'A floating log pushes aside its own weight of water, just as it did through the boat.' }],
        glyph: '🪣', figure: { fig: 'phys-float', params: { scene: 'boat-water' }, w: 620, h: 410 }
      },
      concepts: ['buoyancy'], links: ['phen-boat-anchor']
    },

    /* ---------- weighing, burning, falling ---------- */
    {
      id: 'phen-hourglass', title: 'The Hourglass on the Scale', diff: 4,
      text: 'An hourglass stands on a very sensitive kitchen scale. With all the sand in the top, the scale reads **400 grams**. You open the neck and the sand begins to trickle steadily down.\n\nWhile the sand is running, what does the scale read?',
      hints: ['Some sand is always in the air. Does it press on the scale?', 'The grains that land are being stopped. Stopping something that is moving takes more force than holding it still.', 'Compare the mass in the air (flow × fall time) with the extra push of the grains being stopped (flow × speed at landing).'],
      explain: 'It reads **400 g**, to within a hair. At any moment some sand is in the air, and it does not press on the scale; but the sand landing at the bottom is being stopped, and stopping it takes an extra push. In a steady flow the two cancel exactly: the mass in the air is the flow rate times the fall time, and the extra push is the flow rate times the landing speed, which is gravity times the same fall time. The difference shows only at the **start** (grains leaving, none landing yet: a dip) and at the **end** (grains still landing, none leaving: a bump). Strictly, while the pile grows the stream gets shorter and its downward momentum slowly shrinks, which makes the steady reading heavier by a few thousandths of a gram.',
      data: {
        answer: { choice: 2, choices: ['Less than 400 g: the grains in the air weigh nothing', 'More than 400 g: the grains hit the bottom hard', 'Just 400 g, as when it stands still'] },
        traps: [{ match: 0, msg: 'The grains in the air do not press — but the grains landing press harder than their weight. Look at the flat middle of the graph.' }, { match: 1, msg: 'They do hit harder than their weight — but there is always sand in the air that is not pressing at all.' }],
        glyph: '⏳', figure: { fig: 'phys-hourglass', params: {}, w: 620, h: 400 }
      },
      concepts: ['momentum'], links: ['phen-slinky']
    },
    {
      id: 'phen-candle', title: 'The Candle Under the Glass', diff: 3,
      text: 'A candle stands in a saucer of water. You light it and lower a glass upside down over it, until the rim is under the water. The flame soon goes out — and water rises up inside the glass.\n\nWhy does the water rise?',
      hints: ['Burning oxygen does not simply make it vanish: it turns into carbon dioxide and steam.', 'Watch the timing on the card: does the water rise while the candle burns, or after it goes out?'],
      explain: 'Mostly because **hot air cools**. As the glass comes down, the flame heats the air inside; it expands and some of it bubbles out under the rim. The flame dies when the oxygen falls to about 16 % — and burning the oxygen hardly changes the amount of gas, because the oxygen becomes carbon dioxide and steam. Then the air cools and shrinks, the steam condenses, and the air outside pushes water up into the glass. The give-away is the timing: the water barely moves while the candle burns, and rushes up just after it goes out. The story that "the oxygen was used up" is in many old schoolbooks, and it is mostly wrong.',
      data: {
        answer: { choice: 1, choices: ['The flame burnt up the oxygen, and the water took its place', 'The air heated by the flame cooled and shrank (and some had bubbled out)', 'The smoke is lighter than air and drew the water up', 'The candle burnt a vacuum into the glass'] },
        traps: [{ match: 0, msg: 'That is the schoolbook story. But burnt oxygen becomes carbon dioxide and steam, nearly as much gas. When does the water rise?' }, { match: 3, msg: 'A flame cannot make a vacuum: burning makes gas as well as using it up.' }],
        glyph: '🕯', figure: { fig: 'phys-candle', params: {}, w: 620, h: 400 }
      },
      concepts: ['air-pressure'], links: ['trick-coin-dry']
    },
    {
      id: 'phen-slinky', title: 'The Slinky That Hovers', diff: 3,
      text: 'You hold a slinky by its top coil and let it hang, stretched out long under its own weight. Then you let go of the top.\n\nWhat does the **bottom** of the slinky do in the first moment?',
      hints: ['Before you let go, what holds the bottom coil up?', 'Letting go of the top changes things at the top. How does the bottom find out?'],
      explain: 'It **hangs in mid-air** — for about a quarter of a second — until the collapsing top reaches it. The bottom coil was at rest because the spring above it pulled up exactly as hard as gravity pulled down. Letting go of the top changes nothing down there until the news arrives, and the news travels down the slinky as the coils slam together. Meanwhile the top plunges far faster than a falling stone, so the centre of mass (the purple cross) falls just as a stone would. Slow-motion films of this look like a trick, but they are not.',
      data: {
        answer: { choice: 2, choices: ['It falls at once, like everything else', 'It jumps upwards, pulled by the spring', 'It stays exactly where it is, for a moment', 'It falls faster than a dropped ball'] },
        traps: [{ match: 0, msg: 'Everything falls — but this coil is still held up by the spring above it, which does not yet know you let go.' }, { match: 1, msg: 'The spring above it pulls no harder than it did a moment ago. Nothing has changed down there yet.' }],
        glyph: '〰', figure: { fig: 'phys-slinky', params: {}, w: 620, h: 420 }
      },
      concepts: ['momentum', 'free-fall'], links: ['phen-hourglass']
    },
    {
      id: 'phen-plane-belt', title: 'The Aeroplane on the Treadmill', diff: 2,
      text: 'An aeroplane stands on an enormous conveyor belt as long as a runway. A computer runs the belt **backwards** at exactly the speed the plane is moving **forwards** over the ground. The pilot opens the throttle.\n\nDoes the plane take off?',
      hints: ['What pushes a plane forwards: its wheels on the ground, or its propeller on the air?', 'The wheels are not driven: they just roll. What does the belt do to them?'],
      explain: 'It **takes off** as usual. A plane is pushed forwards by its propeller or jets working on the **air**; its wheels are not driven, they just roll along. The belt makes the wheels spin twice as fast, but it cannot hold the plane back (apart from a little extra drag in the wheel bearings), so the plane reaches its flying speed at the usual time and place. The version that fills internet forums says the belt matches the speed of the *wheels*; that version cannot happen for a plane that moves at all, which is why the argument never ends.',
      data: {
        answer: { choice: 1, choices: ['No: the belt holds it in place', 'Yes, just as from an ordinary runway — its wheels simply spin twice as fast', 'Only if the belt is switched off', 'Yes, but it needs twice as long a run'] },
        traps: [{ match: 0, msg: 'A car on the belt would be held in place, because its wheels drive it. A plane\'s wheels drive nothing.' }, { match: 3, msg: 'The belt only turns the wheels faster. Nothing pushes the plane backwards.' }],
        glyph: '✈', figure: { fig: 'phys-conveyor', params: {}, w: 620, h: 330 }
      },
      concepts: ['relative-motion'], links: ['phen-train-ball']
    },
    {
      id: 'phen-drop-flick', title: 'Dropped or Flicked?', diff: 1,
      text: 'Two balls sit on a table 1.8 metres high. At the same instant, one is simply let go over the edge and the other is flicked off sideways, fast.\n\nWhich reaches the floor first?',
      hints: ['Does moving sideways make a ball fall faster, or slower?', 'Gravity only pulls down. Compare the two heights at the same moments on the card.'],
      explain: 'They land **together**. Gravity pulls both down in the same way, and sideways motion neither helps nor hinders the fall: the two motions are independent. The flicked ball travels further, but at every instant it is at the same height as the dropped one — the dashed lines join them every tenth of a second. A bullet fired level and a bullet dropped from the same height would land together too, on flat ground and without air.',
      data: {
        answer: { choice: 2, choices: ['The one let go', 'The one flicked sideways', 'They land together'] },
        traps: [{ match: 0, msg: 'The flicked ball travels further — but it has no further to fall.' }, { match: 1, msg: 'Its sideways speed does nothing for its fall: gravity acts only downwards.' }],
        glyph: '⚫', figure: { fig: 'phys-projectile', params: { mode: 'drop' }, w: 620, h: 380 }
      },
      concepts: ['free-fall'], links: ['phen-monkey-dart']
    },
    {
      id: 'phen-monkey-dart', title: 'The Monkey and the Dart', diff: 3,
      text: 'A zoo keeper wants to hit a monkey in a tree with a toy dart (it has a rubber sucker, and the monkey thinks it is a game). The monkey always lets go of its branch the instant it hears the dart fired.\n\nWhere should the keeper aim?',
      hints: ['Without gravity the dart would fly straight along the line of aim. How far below that line does gravity pull it after a time t?', 'How far does the monkey fall in the same time?'],
      explain: '**Straight at the monkey.** Without gravity the dart would fly along the line of aim and hit the monkey sitting still. With gravity, the dart drops below that line by ½gt² after a time t — and the monkey, falling from rest, drops by exactly the same ½gt². So they meet, however fast the dart, as long as it gets there before it reaches the ground. The "monkey and the hunter" is a favourite of physics lecturers, usually with a tin can in place of the monkey.',
      data: {
        answer: { choice: 0, choices: ['Straight at the monkey', 'A little below the monkey', 'A little above the monkey, to allow for the dart dropping', 'It depends on the dart\'s speed'] },
        traps: [{ match: 2, msg: 'That would be right if the monkey held on. But it falls — exactly as far as the dart does.' }, { match: 1, msg: 'The monkey falls, but so does the dart, by the same amount.' }, { match: 3, msg: 'Try slow and fast darts on the card: whenever the dart gets there in time, it hits.' }],
        glyph: '🐒', figure: { fig: 'phys-projectile', params: { mode: 'monkey', speed: 10 }, w: 620, h: 380 }
      },
      concepts: ['free-fall', 'relative-motion'], links: ['phen-drop-flick']
    },
    {
      id: 'phen-train-ball', title: 'A Ball in the Train', diff: 1,
      source: 'The idea goes back to Galileo\'s *Dialogue Concerning the Two Chief World Systems* (1632): a stone dropped from the mast of a moving ship lands at the foot of the mast.',
      text: 'You sit in a train running smoothly at 100 km/h along a straight, level track, and toss a ball straight up.\n\nWhere does it come down?',
      hints: ['How fast is the ball moving forwards at the moment it leaves your hand?', 'What could slow it down once it is in the air (ignoring the air in the carriage)?'],
      explain: 'Back in your **hand**. When you throw it, the ball is already moving forwards at 100 km/h with you and the train, and nothing slows it down, so it keeps pace with you. From your seat it goes straight up and down; from the platform it flies in a long curve. Galileo used a stone dropped from the mast of a moving ship to argue that a moving Earth would not leave falling things behind.',
      data: {
        answer: { choice: 0, choices: ['Back in your hand', 'Behind you, because the train moves on', 'In front of you'] },
        traps: [{ match: 1, msg: 'The ball moves forwards at 100 km/h with you when you let it go, and it keeps that speed.' }, { match: 2, msg: 'Nothing pushes it forwards more than the train. It keeps exactly your speed.' }],
        glyph: '🚆', figure: { fig: 'phys-projectile', params: { mode: 'train' }, w: 620, h: 330 }
      },
      concepts: ['relative-motion'], links: ['phen-plane-belt']
    },

    /* ---------- pendulums and clocks ---------- */
    {
      id: 'phen-pendulum-mass', title: 'Lead and Cork', diff: 1,
      text: 'Two pendulums hang side by side on strings of the same length. One bob is a lump of lead weighing 2 kg; the other is a cork of 20 grams. Both are pulled aside by the same small angle and let go together.\n\nWhich swings faster?',
      hints: ['Gravity pulls the lead a hundred times harder. Is it also harder to get moving?'],
      explain: 'They **keep in step** (until the air slows the cork a little). The time of a swing, 2π√(L/g), depends only on the length of the string and on gravity: a heavier bob is pulled harder, but is harder to move by exactly the same factor. Galileo is said to have noticed this rhythm watching a lamp swing in the cathedral of Pisa; whatever the truth of the story, the rule made the pendulum clock possible.',
      data: {
        answer: { choice: 2, choices: ['The lead one', 'The cork one', 'Neither: they keep in step'] },
        traps: [{ match: 0, msg: 'The lead is pulled harder, but it is also harder to get moving — by exactly the same factor.' }, { match: 1, msg: 'The cork is light, but light things are pulled more gently too. Try it on the card.' }],
        glyph: '⚖', figure: { fig: 'phys-pendulum', params: { mode: 'mass' }, w: 620, h: 380 }
      },
      concepts: ['free-fall'], links: ['phen-pendulum-double', 'phen-moon-hammer']
    },
    {
      id: 'phen-pendulum-double', title: 'Twice as Slow', diff: 2,
      text: 'A pendulum takes one second to swing from one side to the other. You want one that takes **two** seconds.\n\nHow many times longer must its string be?',
      hints: ['On the card, pendulum A is half a metre long. Find the length of B that takes twice as long.', 'The period grows with the square root of the length.'],
      explain: '**4** times as long. The period of a pendulum is 2π√(L/g), so it grows with the square root of the length: to double the time, quadruple the string. A "seconds pendulum" that ticks once a second each way is about 99.4 cm long; one with a two-second swing would need nearly 4 metres. That is why grandfather clocks are tall — and why they settle for the one-second swing.',
      data: {
        answer: { num: 4, unit: 'times' },
        traps: [{ match: 2, msg: 'Twice the length makes it only about 1.41 times as slow. Try it on the card.' }],
        glyph: '×4', figure: { fig: 'phys-pendulum', params: { mode: 'length', len2: 1.0 }, w: 620, h: 380 }
      },
      concepts: ['free-fall'], links: ['phen-pendulum-mass', 'phen-clock-mountain']
    },
    {
      id: 'phen-clock-mountain', title: 'The Clock on the Mountain', diff: 4,
      text: 'A pendulum clock keeps perfect time in a house by the sea. It is carried up to a hut 5 km high on a mountain, where gravity is a little weaker because the hut is further from the centre of the Earth (the Earth\'s radius is 6371 km). Nothing else changes.\n\nAbout how many seconds a day does the clock now lose?',
      hints: ['Gravity weakens as 1/r². Going 5 km further out of 6371 km weakens it by about twice 5/6371.', 'The period of a pendulum depends on 1/√g: so it lengthens by half of that fraction.', 'Multiply that fraction by the 86,400 seconds in a day.'],
      explain: 'About **68 seconds**. Gravity weakens as the square of the distance from the Earth\'s centre, so 5 km up it is weaker by about 2 × 5/6371 ≈ 0.157 %. The period depends on √g, so the pendulum swings slower by half that, about 0.0785 %, and in 86,400 seconds that comes to about 68 seconds. Pendulum clocks were used exactly like this to measure gravity: in 1672 the French astronomer Jean Richer found that his clock lost time near the equator, where gravity is weaker.',
      data: {
        answer: { num: 68, tol: 3, unit: 's' },
        traps: [{ match: 136, msg: 'That is the change in gravity. The pendulum\'s period depends on its square root, which halves the effect.' }, { match: 34, msg: 'You have halved once too often: gravity changes by twice 5/6371, the period by half of that.' }],
        glyph: '⛰', figure: { fig: 'phys-clock', params: { case: 'mountain' }, w: 620, h: 360 }
      },
      concepts: ['free-fall'], links: ['phen-clock-summer', 'phen-pendulum-double']
    },
    {
      id: 'phen-clock-summer', title: 'The Clock in Summer', diff: 3,
      text: 'A pendulum clock with a brass rod keeps perfect time in winter. In summer the room is 10 °C warmer. Brass grows by about 19 millionths of its length for each degree.\n\nWhat happens to the clock?',
      hints: ['Warmer brass is longer. Does a longer pendulum swing faster or slower?', 'The period grows by half the fraction the length grows. What fraction of a day is that?'],
      explain: 'It **loses about 8 seconds a day**. Ten degrees lengthens the rod by 0.019 %; the period grows by half that, 0.0095 %, which over the 86,400 seconds of a day is about 8 seconds. Clockmakers fought the seasons with pendulums that correct themselves: the gridiron of brass and steel rods, whose expansions cancel, and the mercury pendulum, whose mercury rises in its jar as the rod grows.',
      data: {
        answer: { choice: 1, choices: ['It gains about 8 seconds a day', 'It loses about 8 seconds a day', 'It loses about 8 minutes a day', 'Nothing changes'] },
        traps: [{ match: 0, msg: 'The warm rod is longer, and a longer pendulum swings more slowly.' }, { match: 2, msg: 'Nineteen millionths per degree is very little. It is seconds, not minutes.' }, { match: 3, msg: 'The rod grows, even if you cannot see it — and the clock counts every swing.' }],
        glyph: '☀', figure: { fig: 'phys-clock', params: { case: 'warm' }, w: 620, h: 360 }
      },
      concepts: ['free-fall'], links: ['phen-clock-mountain']
    },

    /* ---------- races ---------- */
    {
      id: 'phen-brachistochrone', title: 'The Race of the Beads', diff: 2, year: 1696,
      source: 'Johann Bernoulli\'s challenge in *Acta Eruditorum* (1696): the brachistochrone problem.',
      text: 'Four beads slide without friction down four wires from A to B: a straight wire, an arc of a circle, a wire that drops straight down and then runs level, and a **cycloid** — the curve traced by a point on the rim of a rolling wheel. They start from rest together.\n\nWhich bead reaches B first?',
      hints: ['The straight wire is the shortest — but its bead starts off very slowly.', 'The drop gets up speed at once — but then has a long way to go. The winner balances the two.'],
      explain: 'The **cycloid** wins. Its steep start builds speed quickly without wasting too much length; of all curves from A to B it is the fastest — the *brachistochrone*, or "shortest time" curve. Johann Bernoulli set the problem as a challenge in 1696, and Newton, Leibniz, l\'Hôpital and Jakob Bernoulli all solved it. On the card (a wheel of radius 1 m) the times are 1.003 s for the cycloid, 1.015 s for the circle, 1.116 s for the drop and 1.189 s for the straight line.',
      data: {
        answer: { choice: 3, choices: ['The straight wire: it is the shortest', 'The circle arc', 'The wire that drops first: it gets up speed at once', 'The cycloid'] },
        traps: [{ match: 0, msg: 'Shortest is not fastest: that bead dawdles at the start, where it is moving slowly.' }, { match: 2, msg: 'It is quick off the mark, but its road is far too long.' }, { match: 1, msg: 'A very close second. Race them on the card.' }],
        glyph: '⌒', figure: { fig: 'phys-race', params: { mode: 'brach' }, w: 620, h: 400 }
      },
      concepts: ['cycloid', 'energy'], links: ['phen-tautochrone']
    },
    {
      id: 'phen-tautochrone', title: 'Huygens\' Bowl', diff: 3, year: 1659,
      source: 'Christiaan Huygens found the tautochrone in 1659 and published it in *Horologium Oscillatorium* (1673).',
      text: 'A bowl is shaped like a cycloid arch turned upside down. Three beads are let go at the same moment from different heights on the same side — one just above the bottom, one halfway up, one near the rim. There is no friction.\n\nWhich reaches the bottom first?',
      hints: ['The bead near the rim has further to go, but its slope is steeper. Which effect wins?', 'On a cycloid the slope at each point is exactly proportional to the distance still to go along the curve.'],
      explain: 'They all arrive **together**. On a cycloid the steepness grows in exact proportion to the distance still to go, so a bead that starts further away also accelerates harder by just the right amount; each moves like a perfect pendulum and reaches the bottom after π√(a/g) — 1.003 s on the card. Christiaan Huygens discovered this *tautochrone* ("same time") property and designed a pendulum that swings along a cycloid, so that its beat would not depend on how widely it swings.',
      data: {
        answer: { choice: 2, choices: ['The one from the rim: it has the steepest start', 'The one nearest the bottom: it has least far to go', 'They arrive at the same moment', 'The one from halfway up'] },
        traps: [{ match: 0, msg: 'It is faster, but it also has further to go. Race them.' }, { match: 1, msg: 'It has least far to go, but it also starts on the gentlest slope.' }],
        glyph: '◡', figure: { fig: 'phys-race', params: { mode: 'tauto' }, w: 620, h: 400 }
      },
      concepts: ['cycloid'], links: ['phen-brachistochrone', 'phen-pendulum-mass']
    },
    {
      id: 'phen-rolling-race', title: 'Ring, Disc, Shell and Ball', diff: 3,
      text: 'Four things roll without slipping down the same slope, let go together: a hoop (a ring), a hollow ball, a solid disc and a solid ball. They all have different sizes and weights.\n\nWhich reaches the bottom first?',
      hints: ['Rolling down, each must share its energy between going forwards and spinning.', 'Mass far from the axis needs a lot of energy to spin. Which shape keeps its mass nearest the middle?'],
      explain: 'The **solid ball**, then the disc, then the hollow ball, with the hoop last — whatever their sizes and weights. Each must share its energy between moving forwards and spinning. The hoop has all its mass at the rim, so spinning takes a big share and it moves slowly; the solid ball keeps its mass nearest the middle, so the most is left for going forwards. The acceleration is g sin θ / (1 + k), with k = 1 for the hoop, 2/3 for the hollow ball, 1/2 for the disc and 2/5 for the solid ball.',
      data: {
        answer: { choice: 3, choices: ['The hoop', 'The hollow ball', 'The solid disc', 'The solid ball', 'Whichever is heaviest'] },
        traps: [{ match: 4, msg: 'Weight does not matter at all. Only the shape — how far the mass is from the axis.' }, { match: 0, msg: 'The hoop comes last: all its mass is at the rim, and spinning that takes half its energy.' }],
        glyph: '◯', figure: { fig: 'phys-race', params: { mode: 'roll', objects: ['hoop', 'shell', 'disc', 'ball'] }, w: 620, h: 440 }
      },
      concepts: ['energy', 'rolling'], links: ['phen-rolling-mass']
    },
    {
      id: 'phen-rolling-mass', title: 'Iron and Wood', diff: 2,
      text: 'A solid iron ball and a solid wooden ball roll side by side down the same slope, without slipping. The iron ball is a hundred times heavier (and a little bigger).\n\nWhich reaches the bottom first?',
      hints: ['Does weight make anything fall faster (without air)?', 'Both are solid balls. Only the shape matters for rolling.'],
      explain: 'They arrive **together** (so long as the air hardly matters). Weight makes no difference to falling or rolling — a heavier ball is pulled harder but is harder to get going, in the same proportion — and neither does size. Only the *shape* matters: how much of the mass lies far from the axis. Two solid balls have the same shape, so they keep pace all the way down.',
      data: {
        answer: { choice: 2, choices: ['The iron ball', 'The wooden ball', 'They arrive together'] },
        traps: [{ match: 0, msg: 'Heavier is pulled harder but is harder to move by the same factor. Race them.' }],
        glyph: '⚫', figure: { fig: 'phys-race', params: { mode: 'roll', objects: ['iron', 'wood'] }, w: 620, h: 330 }
      },
      concepts: ['free-fall', 'rolling'], links: ['phen-rolling-race', 'phen-pendulum-mass']
    },

    /* ---------- balance ---------- */
    {
      id: 'phen-overhang', title: 'Books Over the Edge', diff: 3,
      text: 'You have four identical books and a table. Stacking them one on top of another, one book to each layer, you push them out over the edge of the table.\n\nCan the **top** book stick out so far that no part of it is over the table? Drag the books on the card and try.',
      hints: ['Work from the top down: how far can the top book stick out beyond the one below it?', 'Now treat the top two books as one block. Where is their centre of mass? That is how far they can reach over the third.', 'The steps are ½, ¼, ⅙ and ⅛ of a book.'],
      explain: '**Yes**, just. Build from the top: the top book can reach half its length beyond the one below; the top two together can reach a quarter of a length beyond the third; the top three a sixth beyond the fourth; and all four an eighth beyond the table. That makes ½ + ¼ + ⅙ + ⅛ = 25/24 of a book — just over one whole length. Each book has to carry the centre of mass of everything above it, which is why the steps shrink as 1/2, 1/4, 1/6, 1/8. "Build the best stack" shows it (a hair short of the balance points, so it stays up).',
      data: {
        answer: { choice: 2, choices: ['No: at most half of it can stick out', 'No: some part of it must be over the table', 'Yes: with four books the top one can be entirely beyond the edge'] },
        traps: [{ match: 0, msg: 'Half a book is the limit for the top book alone. The books under it can stick out too.' }, { match: 1, msg: 'Try harder on the card: the steps ½, ¼, ⅙, ⅛ add up to more than one book.' }],
        glyph: '📚', figure: { fig: 'phys-overhang', params: { n: 4 }, w: 620, h: 380 }
      },
      concepts: ['centre-of-mass', 'harmonic-series'], links: ['phen-overhang-limit']
    },
    {
      id: 'phen-overhang-limit', title: 'The Leaning Tower of Books', diff: 3,
      text: 'With as many identical books as you like, stacked one per layer, how far out beyond the edge of a table can the top of the pile reach?',
      hints: ['With n books the best overhang is ½ + ¼ + ⅙ + … + 1/(2n) book lengths. Try the slider on the card.', 'That is half of 1 + ½ + ⅓ + … + 1/n. Does that sum ever stop growing?'],
      explain: '**As far as you like** — given enough books. The best overhang with n books is half the *harmonic series*, ½(1 + ½ + ⅓ + … + 1/n), and that sum grows without limit, though very slowly: 4 books reach just over one length, 31 books reach two, 227 reach three and 1,674 reach four. The pile gets very tall long before it gets very long. (If more than one book may lie in a layer, with counterweights, the overhang can be made to grow much faster — roughly like the cube root of the number of books.)',
      data: {
        answer: { choice: 2, choices: ['At most one book length', 'At most two book lengths', 'As far as you like, with enough books', 'At most half a book, however many'] },
        traps: [{ match: 0, msg: 'Four books already reach 25/24 of a length. Add more books on the card.' }, { match: 1, msg: 'Thirty-one books pass two lengths. The sum keeps growing.' }],
        glyph: '∞', figure: { fig: 'phys-overhang', params: { n: 6, adjust: true }, w: 620, h: 420 }
      },
      concepts: ['harmonic-series', 'centre-of-mass'], links: ['phen-overhang']
    },
    {
      id: 'phen-broom', title: 'The Sawn Broom', diff: 2,
      text: 'You balance a broom across one finger, exactly at its balance point. Then you saw it through at that point, and weigh the two pieces.\n\nWhich piece is heavier?',
      hints: ['Think of a see-saw: can a light child balance a heavy adult?', 'Balancing means equal turning effects, not equal weights.'],
      explain: 'The **brush end**. Balancing does not mean equal weights on each side; it means equal *turning effects* — weight times distance from the finger. The heavy brush sits close to the finger and the light handle stretches far away, so a small weight far out balances a big weight close in, exactly as on a see-saw. On the card the brush piece weighs 650 g and the handle piece 350 g.',
      data: {
        answer: { choice: 0, choices: ['The piece with the brush', 'The handle piece: it is longer', 'They weigh the same: it balanced'] },
        traps: [{ match: 2, msg: 'That is the trap. Balance means equal turning effects, and the long handle has leverage.' }, { match: 1, msg: 'It is longer, and that is exactly why it can balance a heavier piece.' }],
        glyph: '🧹', figure: { fig: 'phys-broom', params: {}, w: 620, h: 360 }
      },
      concepts: ['torque', 'centre-of-mass'], links: ['phen-fingers']
    },
    {
      id: 'phen-fingers', title: 'Fingers Under the Ruler', diff: 3,
      text: 'Hold a metre stick level on your two forefingers, one near each end — not at the same distances from the ends. Now slowly slide your fingers towards each other.\n\nWhere do they meet?',
      hints: ['Which finger carries more of the weight: the one nearer the middle, or the other?', 'The finger carrying more weight grips harder. What happens to the one that slides?'],
      explain: 'Always at the **balance point** — the middle, for a plain stick. The finger nearer the balance point carries more of the weight, so it grips harder, and the other one slides. As the sliding finger creeps inwards it carries more and more of the weight, until it grips harder than the first, which then starts to slide. So the fingers take turns, and neither can pass the balance point. (A finger that is already sliding grips a little less than one at rest — that is why they swap cleanly.) Drag the fingers to different starting places and try.',
      data: {
        answer: { choice: 1, choices: ['Wherever the faster finger pushes them', 'At the balance point of the stick, every time', 'At whichever finger started nearer the middle', 'Anywhere: it is random'] },
        traps: [{ match: 2, msg: 'That finger grips first — but not for ever. Watch them take turns.' }, { match: 3, msg: 'Try it with a real ruler: it is uncannily reliable.' }],
        glyph: '☝', figure: { fig: 'phys-fingers', params: {}, w: 620, h: 300 }
      },
      concepts: ['friction', 'centre-of-mass'], links: ['phen-broom']
    },

    /* ---------- odd forces ---------- */
    {
      id: 'phen-balloon-car', title: 'The Balloon in the Car', diff: 4,
      text: 'A child sits in the back of a car, holding a helium balloon on a string; the windows are shut. A small weight also hangs from the roof on a thread. The driver accelerates hard, and the weight swings backwards.\n\nWhich way does the balloon lean?',
      hints: ['What happens to the air in the car as the car speeds up?', 'The air piles up a little at the back. A balloon floats towards lower pressure — the way it floats up.'],
      explain: '**Forwards.** As the car speeds up, the air inside lags behind a little and presses slightly harder at the back than at the front — as if gravity in the car had tilted backwards. The weight hangs along that tilted "gravity", so it swings back. A helium balloon, lighter than air, floats *against* gravity: it floats up, and now it also floats forwards. When the car brakes it leans back. It is one of the most surprising things you can see in a car.',
      data: {
        answer: { choice: 1, choices: ['Backwards, like the weight and everything else', 'Forwards', 'It stays upright'] },
        traps: [{ match: 0, msg: 'Most things do lean back. But a balloon floats — it goes the opposite way to "gravity".' }, { match: 2, msg: 'The air in the car is pushed about too, and the balloon floats in the air.' }],
        glyph: '🎈', figure: { fig: 'phys-balloon', params: {}, w: 620, h: 360 }
      },
      concepts: ['buoyancy', 'relative-motion'], links: ['phen-ice-brim']
    },
    {
      id: 'phen-spring-scale', title: 'The Balance Between Two Weights', diff: 2,
      text: 'A spring balance hangs between two 10 kg weights: a rope runs from each hook over a pulley, and a weight hangs on each rope. Everything is still.\n\nWhat does the balance read?',
      hints: ['Hang the balance from a hook with one 10 kg weight on it. How hard does the hook pull up?', 'Replace the hook by the second weight. What has changed for the balance?'],
      explain: '**10 kg**. A spring balance always has two equal pulls on it, one at each end — even when it hangs from a hook, the hook pulls up just as hard as the weight pulls down. Replacing the hook by a second 10 kg weight changes nothing for the balance: it reads the pull in the rope, 10 kg. In a tug of war where each team pulls with 1,000 newtons, the rope\'s tension is 1,000 newtons — not 2,000, and not 0.',
      data: {
        answer: { choice: 1, choices: ['0 kg: the two weights cancel out', '10 kg', '20 kg: both weights pull on it'] },
        traps: [{ match: 0, msg: 'They do cancel — that is why nothing moves. But the spring is still being stretched between them.' }, { match: 2, msg: 'A balance on a hook also has two pulls on it: the weight and the hook. It still reads 10 kg.' }],
        glyph: '⚖', figure: { fig: 'phys-scale', params: {}, w: 620, h: 330 }
      },
      concepts: ['momentum'], links: ['phen-monkey-rope']
    },
    {
      id: 'phen-cradle', title: 'Two In, How Many Out?', diff: 3,
      text: 'A Newton\'s cradle has five steel balls hanging in a row, just touching. You pull back **two** balls together and let them go.\n\nWhat happens at the other end?',
      hints: ['Whatever comes out must carry the same momentum (mass × speed) as went in.', 'It must also carry the same energy (½ × mass × speed²). Can one ball at double speed do both?'],
      explain: '**Two balls** fly out, at the speed the two came in with. One ball at twice the speed would carry the same momentum, 1 × 2v = 2 × v — but twice the energy, ½ × (2v)² = 2v² instead of 2 × ½v² = v², which cannot come from nowhere. Only two balls at the same speed keep both the momentum and the energy. (Real cradles lose a little energy at each click, and slowly end up all swinging together.)',
      data: {
        answer: { choice: 1, choices: ['One ball flies out, twice as fast', 'Two balls fly out', 'All five swing together, slowly', 'The two bounce back'] },
        traps: [{ match: 0, msg: 'That keeps the momentum, but doubles the energy. Where would the extra come from?' }, { match: 2, msg: 'That keeps the momentum but loses much of the energy — steel balls are too bouncy for that.' }],
        glyph: '⚪', figure: { fig: 'phys-cradle', params: { lift: 2 }, w: 620, h: 350 }
      },
      concepts: ['momentum', 'energy'], links: ['phen-tennis-bounce']
    },
    {
      id: 'phen-moon-hammer', title: 'The Hammer and the Feather', diff: 1, year: 1971,
      source: 'Apollo 15: the astronaut David Scott\'s demonstration on the Moon, 2 August 1971.',
      text: 'Standing on the Moon in 1971, the astronaut David Scott held a geologist\'s hammer in one hand and a falcon feather in the other, and let them go at the same moment.\n\nWhat happened?',
      hints: ['What slows a feather down on the Earth?', 'The Moon has no air.'],
      explain: 'They **landed together**, a little over a second later, and Scott remarked that Mr Galileo had been right. On the Moon there is no air to hold the feather back, so both fall with the Moon\'s gravity, about a sixth of the Earth\'s. Switch the card to the Earth to see the difference the air makes.',
      data: {
        answer: { choice: 2, choices: ['The hammer landed first', 'The feather drifted down slowly', 'They landed together', 'Both floated away'] },
        traps: [{ match: 1, msg: 'It drifts on the Earth, because of the air. There is none on the Moon.' }, { match: 3, msg: 'The Moon\'s gravity is weak, but it is there: about a sixth of the Earth\'s.' }],
        glyph: '🪶', figure: { fig: 'phys-drop', params: { place: 'moon' }, w: 620, h: 360 }
      },
      concepts: ['free-fall'], links: ['phen-galileo-tied', 'phen-pendulum-mass']
    },
    {
      id: 'phen-galileo-tied', title: 'Galileo\'s Two Stones', diff: 3, year: 1638,
      source: 'Galileo Galilei, *Discourses and Mathematical Demonstrations Relating to Two New Sciences* (1638).',
      text: 'Suppose — as nearly everyone believed before Galileo — that heavy things fall faster than light ones. Now tie a heavy stone to a light one with a string, and drop them together.\n\nWhat does that belief predict for the pair?',
      hints: ['Is the pair heavier than the heavy stone alone?', 'Would the slow light stone hold the heavy one back?'],
      explain: 'It predicts **two opposite things at once**, so it must be wrong. The pair is heavier than the heavy stone, so it should fall faster; but the light stone, falling more slowly, should drag on the heavy one, so the pair should fall slower. A belief that predicts both cannot be true. Galileo gave this argument in his last book, in 1638: the only consistent answer is that, apart from the air, all bodies fall alike.',
      data: {
        answer: { choice: 2, choices: ['The pair falls faster than the heavy stone, being heavier', 'The pair falls slower, held back by the light stone', 'Both of those — so the belief contradicts itself', 'The string breaks'] },
        traps: [{ match: 0, msg: 'True on that belief — but the belief also says the opposite. Look at the other answer.' }, { match: 1, msg: 'True on that belief — but the belief also says the opposite. Look at the other answer.' }],
        glyph: '🪨', figure: { fig: 'phys-drop', params: { mode: 'galileo' }, w: 620, h: 360 }
      },
      concepts: ['free-fall'], links: ['phen-moon-hammer']
    },
    {
      id: 'phen-monkey-rope', title: 'Lewis Carroll\'s Monkey', diff: 4, year: 1893,
      source: 'Lewis Carroll (the Oxford mathematician Charles Dodgson), who put it to his colleagues in 1893.',
      text: 'A rope hangs over a light, frictionless pulley. On one end hangs a monkey; on the other, a weight exactly as heavy as the monkey, so that they balance. The monkey starts to climb the rope.\n\nWhat happens to the weight?',
      hints: ['The rope pulls up on the monkey and on the weight with the same force — the pulley just passes it round.', 'To climb, the monkey pulls down on the rope. What does that do to the pull on the weight?'],
      explain: 'The weight **rises with the monkey**, and the two stay level. The pulley passes the rope\'s tension round unchanged, so the rope pulls up on both ends equally. To climb, the monkey pulls down on the rope, raising that tension; the weight feels exactly the same extra pull, and since it is exactly as heavy as the monkey, it rises exactly as fast. The rope slides over the pulley so that the monkey climbs past the red ribbon while both go up. Carroll recorded that the mathematicians he asked gave very different answers.',
      data: {
        answer: { choice: 2, choices: ['It stays where it is', 'It goes down', 'It rises, keeping level with the monkey', 'It rises twice as fast as the monkey'] },
        traps: [{ match: 0, msg: 'The monkey pulls down on the rope to climb. The weight feels that pull too.' }, { match: 1, msg: 'The rope on the monkey\'s side slides down, but the weight\'s side goes up.' }],
        glyph: '🐵', figure: { fig: 'phys-monkey-rope', params: {}, w: 620, h: 400 }
      },
      concepts: ['momentum'], links: ['phen-spring-scale']
    },

    /* ---------- frames and mirrors ---------- */
    {
      id: 'phen-hat-river', title: 'The Rower\'s Hat', diff: 2,
      text: 'A rower sets off upstream from a bridge, and at that moment his hat falls into the river and floats away. Ten minutes later he notices, turns round (at once), and rows back downstream, working just as hard, to fetch it.\n\nHow many minutes after turning does he reach the hat?',
      hints: ['Look at it from a raft drifting with the river (the other view on the card).', 'In the water\'s own frame the hat does not move at all.'],
      explain: '**10 minutes**. Look at it from a raft drifting with the river: the water, the hat and the raft drift together, so to the raft the hat lies still. The rower rows away from it for 10 minutes and back towards it at the same speed through the water — so it takes 10 minutes to come back. The speed of the river does not come into it at all.',
      data: {
        answer: { num: 10, unit: 'minutes' },
        traps: [{ match: 20, msg: 'That is the whole time since the hat fell. How long after turning?' }, { match: 5, msg: 'The river helps him downstream — but it carries the hat away just as fast.' }],
        glyph: '🎩', figure: { fig: 'phys-river', params: {}, w: 620, h: 300 }
      },
      concepts: ['relative-motion'], links: ['phen-hat-speed']
    },
    {
      id: 'phen-hat-speed', title: 'How Fast the River Runs', diff: 3,
      text: 'The same rower (his hat fell in at the bridge; he turned back after 10 minutes) catches up with his hat exactly **1 km** downstream of the bridge.\n\nHow fast does the river flow, in km/h?',
      hints: ['How long was the hat in the water, from falling in to being caught?', 'The hat drifts with the river. It went 1 km in that time.'],
      explain: 'The hat was in the water for **20 minutes** — 10 while he rowed away and 10 more to come back — and drifted 1 km. So the river flows at 1 km per third of an hour: **3 km/h**. As in the last puzzle, the rower\'s own speed does not matter.',
      data: {
        answer: { num: 3, unit: 'km/h' },
        traps: [{ match: 6, msg: 'That assumes the hat drifted for 10 minutes. It drifted all the time he was rowing away, too.' }],
        glyph: '3', figure: { fig: 'phys-river', params: {}, w: 620, h: 300 }
      },
      concepts: ['relative-motion'], links: ['phen-hat-river']
    },
    {
      id: 'phen-mirror-half', title: 'A Mirror for the Whole of You', diff: 2,
      text: 'You want a mirror on your wall in which you can see yourself from head to toe. You are 180 cm tall.\n\nWhat is the shortest mirror (in cm) that will do, if you hang it at the right height? (Set the mirror on the card and see.)',
      hints: ['Light from your feet reaches your eyes by bouncing off the mirror. Where on the mirror does it bounce?', 'The bounce point is halfway up between your feet and your eyes — and halfway between the top of your head and your eyes.'],
      explain: '**90 cm** — half your height, hung with its top edge halfway between your eyes and the top of your head. Light from your feet bounces off the mirror halfway up between your feet and your eyes; light from the top of your head bounces halfway between it and your eyes; everything else bounces between those two points. Those two points are half your height apart — and, surprisingly, they do not depend on how far you stand from the wall.',
      data: {
        answer: { num: 90, unit: 'cm', tol: 1 },
        traps: [{ match: 180, msg: 'A full-length mirror works, but you only use half of it. Try shrinking it on the card.' }],
        glyph: '🪞', figure: { fig: 'phys-mirror', params: { dist: 1.2, mb: 0.6, mt: 1.3 }, w: 620, h: 400 }
      },
      concepts: ['symmetry'], links: ['phen-mirror-step']
    },
    {
      id: 'phen-mirror-step', title: 'Step Back from the Mirror', diff: 2,
      text: 'In a small wall mirror you can see yourself only from your head down to your waist. You step backwards, further from the mirror.\n\nDo you now see more of yourself?',
      hints: ['Which part of the mirror does light from your waist bounce off?', 'Move the distance slider on the card and watch the blue part of the figure.'],
      explain: '**No — exactly the same part.** Light from any point of your body reaches your eye by bouncing off the mirror halfway up between that point and your eye, whatever the distance. So the part you can see depends only on where the mirror\'s edges are, not on where you stand. As you step back your reflection shrinks, but so does the mirror as you see it. (People who "see more" when they step back are usually tilting the mirror, or bending down.)',
      data: {
        answer: { choice: 1, choices: ['Yes: the further back, the more you see', 'No: exactly the same part', 'No: you see less'] },
        traps: [{ match: 0, msg: 'It feels that way. Try the distance slider on the card.' }, { match: 2, msg: 'Your reflection is smaller, but it is all still there. Try the slider.' }],
        glyph: '↔', figure: { fig: 'phys-mirror', params: { dist: 0.6, mb: 1.3, mt: 1.74 }, w: 620, h: 400 }
      },
      concepts: ['symmetry'], links: ['phen-mirror-half']
    },

    /* ---------- spinning, bouncing, falling cups ---------- */
    {
      id: 'phen-eggs', title: 'Raw or Boiled?', diff: 2,
      text: 'Two eggs look exactly alike, but one is hard-boiled and one is raw. You spin them both on the table, then touch each one briefly with a fingertip to stop it — and let go at once.\n\nOne starts spinning again by itself. Which?',
      hints: ['Your finger stops the shell. Does it stop everything inside?'],
      explain: 'The **raw** egg. Your finger stops only the shell; the liquid inside keeps swirling, and as soon as you let go it drags the shell round again. The boiled egg is solid, so stopping the shell stops the lot. It is the kitchen way to tell them apart without breaking one. (A raw egg is also harder to set spinning in the first place, because its insides lag behind.)',
      data: {
        answer: { choice: 1, choices: ['The boiled one', 'The raw one', 'Neither: both stay stopped'] },
        traps: [{ match: 0, msg: 'The boiled egg is solid: stop the shell and you stop all of it.' }, { match: 2, msg: 'Try it on the card — or in the kitchen.' }],
        glyph: '🥚', figure: { fig: 'phys-eggs', params: {}, w: 620, h: 340 }
      },
      concepts: ['momentum'], links: ['phen-skater']
    },
    {
      id: 'phen-cup-hole', title: 'The Leaking Cup', diff: 2,
      text: 'Poke a hole near the bottom of a paper cup full of water: a jet spurts out sideways. Now drop the cup.\n\nWhat happens to the jet while the cup falls?',
      hints: ['What pushes the water out of the hole while you hold the cup?', 'In free fall, does the water still press down on the water below it?'],
      explain: 'It **stops**. The water spurts because the water above the hole presses down on it, and it presses only because gravity pulls it down against the cup. Dropped, the cup and the water fall together; the water weighs nothing in the cup and presses on nothing — so it stays in. (The drops already in the air carry on.) Astronauts in orbit live in this free fall all the time, which is why their drinks come in pouches.',
      data: {
        answer: { choice: 2, choices: ['It spurts just the same', 'It spurts harder', 'It stops', 'It squirts upwards'] },
        traps: [{ match: 0, msg: 'Watch closely on the card, or try it outside over the grass.' }, { match: 1, msg: 'The water has nothing pushing it out any more.' }],
        glyph: '🥤', figure: { fig: 'phys-cup', params: {}, w: 620, h: 380 }
      },
      concepts: ['free-fall'], links: ['phen-moon-hammer']
    },
    {
      id: 'phen-skater', title: 'The Spinning Skater', diff: 1,
      text: 'A skater spins slowly on one spot with her arms stretched out wide. Then she pulls her arms in tight to her body.\n\nWhat happens to her spin?',
      hints: ['Nothing twists her, so something about her spin stays the same.', 'Angular momentum is spin × how far the mass is spread from the axis.'],
      explain: 'She spins **faster** — about four times as fast on the card. Nothing twists her, so her *angular momentum* stays the same, and that is her spin times her moment of inertia (how far her mass is spread from the axis). Pulling in her arms shrinks the moment of inertia, so the spin must grow. Her spinning energy grows too: she does work pulling her arms in.',
      data: {
        answer: { choice: 0, choices: ['She spins faster', 'She spins slower', 'No change: nothing pushed her'] },
        traps: [{ match: 2, msg: 'Nothing twists her — and that is exactly why her spin has to change. Try the button on the card.' }],
        glyph: '⛸', figure: { fig: 'phys-skater', params: {}, w: 620, h: 340 }
      },
      concepts: ['momentum'], links: ['phen-eggs']
    },
    {
      id: 'phen-tennis-bounce', title: 'The Tennis Ball on the Basketball', diff: 4,
      text: 'Hold a tennis ball on top of a basketball and drop the two together onto a hard floor from a height of 1 metre. Imagine both balls are perfectly bouncy and the basketball is very much heavier.\n\nThe tennis ball flies up — to how many times the height it was dropped from?',
      hints: ['Both hit the floor at the same speed v. The basketball bounces first and comes back up at v, meeting the tennis ball still coming down at v.', 'Seen from the basketball, the tennis ball arrives at 2v and bounces off at 2v. Now add the basketball\'s own speed.', 'It leaves at 3v. Height grows with the square of the speed.'],
      explain: 'Up to **9 times** as high. Both balls reach the floor at speed v. The basketball bounces back up at v and meets the tennis ball still coming down at v: seen from the basketball, the tennis ball arrives at 2v and leaves at 2v — add the basketball\'s own v and it flies off at **3v**. Height grows with the square of speed: 3² = 9. With a real basketball, about ten times heavier than a tennis ball, the ideal is nearer 7 (try the slider), and real balls lose some bounce — still a startling leap.',
      data: {
        answer: { num: 9, unit: 'times' },
        traps: [{ match: 3, msg: 'That is the speed. Height grows with the square of the speed.' }, { match: 4, msg: 'Twice the speed would give four times the height — but it leaves at three times the speed.' }, { match: 2, msg: 'Twice as high? Look at the speeds: it leaves at three times the speed it arrived.' }],
        glyph: '🎾', figure: { fig: 'phys-bounce', params: { ratio: 40 }, w: 620, h: 400 }
      },
      concepts: ['momentum', 'energy', 'relative-motion'], links: ['phen-cradle']
    }
  ];

  Cabinet.family({
    id: 'phenomena', engine: 'question', cat: 'physics', name: 'Moving paradoxes', order: 10,
    blurb: 'Coins that turn twice, wheels that skid, ice that melts without spilling, a slinky that hovers in mid-air: make your prediction, then run the experiment on the card.',
    about: 'Read the riddle and **make a prediction** before you touch anything. Then play with the figure on the card: **Play**, **Step** and the sliders run the experiment (use the select tool; the pen and highlighter still write on the card). Answer in the panel — the explanation and the whole story open once you have.',
    origin: { year: -300, who: 'From Aristotle\'s wheel to the physics classroom', note: 'Puzzles about motion are as old as physics: the wheel paradox is in a Greek text credited to Aristotle, Galileo argued with thought experiments, and every generation of teachers has added a favourite that catches the intuition out.' },
    concepts: ['rolling', 'buoyancy', 'centre-of-mass', 'momentum', 'free-fall'],
    deps: ['js/lib/figures.js']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
