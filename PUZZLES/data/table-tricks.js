/* The Puzzle Cabinet · data/table-tricks.js
 * Tricks at the table: the classic challenges with everyday things — coins,
 * glasses, corks, forks, nails and cigarettes. Say how it is done; then the
 * card shows it (js/lib/figures.js, TRICK scenes; three of them also in 3D). */
Cabinet.concepts([
  { id: 'inertia', name: 'Inertia', see: ['momentum'],
    text: 'A body at rest stays at rest, and a moving body keeps moving, unless a force acts on it — and a force needs *time* to change its motion. Pull a tablecloth or flick a card fast enough, and friction has almost no time to act on what sits on it: the plates, the coin, the stack of coins stay where they were.' },
  { id: 'surface-tension', name: 'Surface tension', see: ['air-pressure'],
    text: 'The molecules at the surface of water pull on one another, so the surface behaves like a thin stretched skin. It can carry a steel paper clip, heap up above the rim of a brim-full glass, and hold water in a glass covered with a handkerchief. Soap weakens the skin, which is why pepper on water flees from a soapy finger.' }
]);

(function () {
  const TR = (scene, h) => ({ fig: 'trick', params: { scene }, w: 620, h: h || 340 });
  const list = [
    /* ---------- the great classics ---------- */
    {
      id: 'trick-six-cig', title: 'Six Cigarettes', diff: 3,
      source: 'A classic of the puzzle books; any six equal sticks will do — pencils, crayons, dowels.',
      text: 'Arrange **six** identical cigarettes (or new pencils) so that **each one touches every one of the other five**. No bending, breaking or stacking them on end.\n\nHow?',
      hints: ['Six lying flat on the table cannot do it: try two layers.', 'Can three sticks lying on the table all touch each other? Let each rest one end on the next.'],
      explain: 'In **two layers of three**. In each layer the three cigarettes form a little pinwheel, each resting one end on the next, so all three touch. The second pinwheel goes on top of the first, turned round, so that each upper cigarette lies across all three below. Each cigarette then touches its two partners in its own layer and the three in the other: five in all.',
      data: {
        answer: { choice: 1, choices: ['In a flat ring on the table', 'In two layers of three, each layer a little pinwheel, one on top of the other turned round', 'In a bundle, all side by side', 'It cannot be done'] },
        traps: [{ match: 2, msg: 'In a bundle of parallel sticks, three can all touch — but not six.' }, { match: 3, msg: 'It can. Think in two layers.' }, { match: 0, msg: 'In a flat ring each touches only its neighbours.' }],
        glyph: '🚬', figure: TR('six-cig', 380)
      },
      concepts: ['lateral', 'topology'], links: ['trick-seven-cig']
    },
    {
      id: 'trick-seven-cig', title: 'Seven Cigarettes', diff: 5,
      source: 'The seven-cigarette solution is mentioned by Martin Gardner.',
      text: 'Six cigarettes can each touch all the others. Can **seven**? (They may be long and thin, like real cigarettes; no bending or breaking.)',
      hints: ['Start from the six in two layers of three. Is there room in the middle?', 'Make each layer\'s pinwheel a little looser, so that a hole opens in the centre of both.'],
      explain: '**Yes.** Build the two layers of three as for six, but loosely enough to leave a small hole running down the middle of both layers. Stand the seventh cigarette upright through the hole: it touches all six lying round it. It only works if the cigarettes are long enough compared with their thickness — ordinary cigarettes, about ten times as long as they are thick, are.',
      data: {
        answer: { choice: 1, choices: ['No: six is the most', 'Yes: two layers of three with a hole in the middle, and the seventh standing upright in it', 'Only if some are broken in half', 'Yes: all seven lying in a star'] },
        traps: [{ match: 0, msg: 'Surprisingly, seven is possible. Look for a hole in the middle of the six.' }, { match: 3, msg: 'A star of seven on the table: each touches only a few of the others.' }],
        glyph: '7', figure: TR('seven-cig', 380)
      },
      concepts: ['lateral'], links: ['trick-six-cig']
    },
    {
      id: 'trick-nails', title: 'Twelve Nails on One', diff: 4,
      source: 'A classic of the parlour-trick books.',
      text: 'A nail is hammered upright into a block of wood. You have **twelve** more nails, all the same.\n\nHow can you balance all twelve on the head of the upright nail, so that none touches the wood or the table?',
      hints: ['Lay one nail down; the others can hang from it by their heads.', 'Lay ten nails across the first, heads resting on it, alternately from each side, and the last nail on top of them.', 'When you lift the bottom nail by its ends, the hanging nails swing inwards and lock the top nail in place. Where is the weight then?'],
      explain: 'Lay one nail flat. Lay ten across it, heads resting on it, alternately from each side, so their points spread out on both sides. Lay the twelfth on top, in the groove between the heads. Lift the bottom nail by its ends: the ten hanging nails swing in under it and pinch the top nail between their heads, making one rigid bundle. Set the middle of the bottom nail on the head of the upright nail. Nearly all the weight hangs **below** the point of support, so the bundle is stable — like the forks on the glass rim.',
      data: {
        answer: { choice: 2, choices: ['Balance them one at a time on the head, criss-cross', 'Lay them all in a star on the head', 'Hang ten by their heads over one nail, lock them with the twelfth on top, and set the bundle on the upright', 'It cannot be done without glue'] },
        traps: [{ match: 0, msg: 'The head of a nail is far too small: they must hang, not stand.' }, { match: 3, msg: 'It can — the trick is to make the weight hang below the head.' }],
        glyph: '📌', figure: TR('nails', 400)
      },
      concepts: ['centre-of-mass', 'lateral'], links: ['trick-forks']
    },
    {
      id: 'trick-forks', title: 'Forks on the Rim of a Glass', diff: 3,
      text: 'Two forks are pushed together at the prongs so that they lock, handles spread in a V. A toothpick is wedged between the middle prongs, and its tip is rested on the rim of a glass. It balances there, the heavy forks hanging out beside the glass.\n\nWhy does it not fall?',
      hints: ['Where is the centre of mass of the forks and the toothpick together?', 'The handles curve back towards the glass, and down.'],
      explain: 'Because the **centre of mass is below the point of support**: the curved handles bring most of the weight back under the rim of the glass, below the tip of the toothpick. Tip it a little and the weight swings back underneath, like a pendulum — the balance is stable. (You can even burn away the part of the toothpick inside the glass, and it still hangs there.)',
      data: {
        answer: { choice: 1, choices: ['The toothpick is glued by the forks’ grip', 'The centre of mass of the whole thing lies below the point of support', 'The glass pulls it by suction', 'It is only just balanced, and will soon fall'] },
        traps: [{ match: 3, msg: 'Nudge it: it swings back. The balance is stable.' }],
        glyph: '🍴', figure: TR('forks', 360)
      },
      concepts: ['centre-of-mass'], links: ['trick-nails']
    },

    /* ---------- coins, cards, glasses ---------- */
    {
      id: 'trick-card-flick', title: 'Into the Glass', diff: 1,
      text: 'A playing card lies on top of an empty glass, and a coin sits on the card, over the middle of the glass.\n\nHow do you get the coin into the glass without touching the coin or the glass?',
      hints: ['What happens to the coin if the card leaves very quickly?'],
      explain: '**Flick the card** away sharply, sideways, with a finger. The card shoots off so fast that friction has almost no time to drag the coin with it; left behind, the coin drops straight into the glass. It is inertia at work — the same as whipping away a tablecloth.',
      data: {
        answer: { text: ['flick the card', 'flick', 'flick it', 'flick the card away', 'hit the card', 'knock the card away', 'snap the card', 'pull the card away quickly', 'yank the card', 'pull the card', 'strike the card'] },
        traps: [{ match: ['tip the glass', 'tilt the card', 'slide the card slowly'], msg: 'Slowly, the coin goes with the card. It must be fast.' }],
        glyph: '🃏', figure: TR('card-flick', 320)
      },
      concepts: ['inertia'], links: ['trick-tablecloth', 'trick-coin-stack']
    },
    {
      id: 'trick-tablecloth', title: 'The Tablecloth Trick', diff: 1,
      text: 'A magician whips the cloth off a table laid with plates, glasses and a vase — and everything stays where it was.\n\nWhat makes it work?',
      hints: ['Friction does pull the dishes, but only while the cloth is moving under them.', 'How long is that?'],
      explain: '**Speed** (and inertia). Friction from the moving cloth does tug on every dish, but the pull lasts only a small fraction of a second, too short to give the heavy dishes any real speed; they shift a millimetre or two and stay put. A cloth without a hem helps, and so does pulling slightly downwards, so the cloth slides out flat instead of lifting the dishes.',
      data: {
        answer: { choice: 2, choices: ['The dishes are secretly glued down', 'The cloth is slippery silk with no friction at all', 'The pull is so quick that friction has no time to get the dishes moving', 'The magician holds the dishes down with the other hand'] },
        traps: [{ match: 1, msg: 'Even silk has friction — it just does not act for long.' }],
        glyph: '🍽', figure: TR('tablecloth', 320)
      },
      concepts: ['inertia', 'friction'], links: ['trick-card-flick']
    },
    {
      id: 'trick-coin-stack', title: 'The Bottom Coin', diff: 1,
      text: 'A tall stack of coins stands on the table. How do you take out the **bottom** coin without touching the stack?',
      hints: ['You may touch another coin.', 'Send another coin sliding across the table, hard.'],
      explain: '**Flick another coin** hard along the table at the bottom of the stack. It strikes the bottom coin and knocks it clean out; the blow is so short that the coins above hardly feel it, and the stack drops down by one coin. With practice you can take the coins out one by one from the bottom.',
      data: {
        answer: { text: ['flick a coin at it', 'flick another coin', 'flick a coin', 'hit it with another coin', 'slide a coin at it', 'shoot a coin at it', 'knock it out with another coin', 'strike it with a coin', 'another coin'] },
        glyph: '🪙', figure: TR('coin-stack', 300)
      },
      concepts: ['inertia', 'momentum'], links: ['trick-card-flick']
    },
    {
      id: 'trick-coin-glass', title: 'The Coin Under the Glass', diff: 2,
      text: 'A small coin lies on a tablecloth under an upturned glass, which rests on two larger coins. Get the small coin out from under the glass without touching the glass or any of the coins, and using nothing but one finger.',
      hints: ['You may touch the tablecloth.', 'Scratch it.'],
      explain: '**Scratch the tablecloth** with a fingernail, just in front of the glass, over and over. Each scratch drags the springy threads of the cloth a little towards you and lets them spring back; the coin rides them, creeping out under the rim towards your finger.',
      data: {
        answer: { text: ['scratch the tablecloth', 'scratch the cloth', 'scratch', 'scratching', 'scratch the table', 'scratch the tablecloth with a fingernail', 'rub the cloth', 'scrape the cloth', 'scratch the cloth in front of the glass'] },
        traps: [{ match: ['blow', 'blow on it', 'blow under the glass'], msg: 'The glass is too close to the cloth to blow under. Use a fingernail.' }],
        glyph: '🥃', figure: TR('coin-glass', 330)
      },
      concepts: ['friction', 'lateral'], links: ['trick-coin-dry']
    },
    {
      id: 'trick-note-bottle', title: 'The Bottle on the Banknote', diff: 3,
      text: 'A bottle stands upside down, balanced on its narrow neck, on top of a banknote on the table. Get the note out without touching the bottle and without knocking it over.',
      hints: ['A quick yank might work, but might not. There is a slow way that always works.', 'Roll it.'],
      explain: '**Roll the note up** from the far end, slowly and tightly. As the roll reaches the bottle it pushes gently against the neck and edges the note out from under it, without any jerk. The bottle is left standing on the table. (A sharp yank also works when the note is flat and the bottle steady — but the roll never fails.)',
      data: {
        answer: { text: ['roll it up', 'roll the note up', 'roll up the note', 'roll the banknote', 'roll', 'rolling it up', 'roll the note', 'roll it slowly'] },
        traps: [{ match: ['pull it', 'pull the note', 'pull slowly'], msg: 'Pulled slowly, the note drags the bottle with it and it topples.' }],
        glyph: '💵', figure: TR('note-bottle', 360)
      },
      concepts: ['friction', 'lateral'], links: ['trick-tablecloth']
    },
    {
      id: 'trick-coin-note', title: 'A Coin on a Knife-Edge', diff: 3,
      text: 'Balance a coin on its rim on the **edge** of a banknote.',
      hints: ['A banknote folded in half and opened into a V makes a groove.', 'Stand the coin in the groove of the V, and then…'],
      explain: 'Fold the note in half and open it into a **V**, standing on its long edges. Stand the coin in the crease. Now pull the two ends of the note apart very slowly and evenly: the crease flattens into a straight edge, and the coin is left balanced on it. The narrowing groove keeps the coin centred all the way.',
      data: {
        answer: { choice: 1, choices: ['Balance it on the flat note and fold the note around it', 'Stand it in the crease of the note folded into a V, then slowly straighten the note', 'Wet the coin so it sticks', 'It cannot be done'] },
        glyph: '🪙', figure: TR('coin-note', 320)
      },
      concepts: ['centre-of-mass', 'lateral'], links: ['trick-forks']
    },
    {
      id: 'trick-coin-dry', title: 'A Coin From the Water, Dry', diff: 4,
      text: 'A coin lies in a plate of shallow water. You have a glass, a short candle and matches. Get the coin out without wetting your fingers — and without pouring the water away or tipping the plate.',
      hints: ['Remember the candle under the glass that makes water rise.', 'Stand the candle in the plate, away from the coin.'],
      explain: 'Stand the candle in the plate, light it, and put the **glass over it**. The flame soon dies; the hot air inside cools and shrinks, and the air pressing on the water outside pushes the water up into the glass — nearly all of it, if the glass is big enough. The coin is left on a dry plate. (The water rises mainly because the air cools, not because the oxygen is used up: see the candle puzzle.)',
      data: {
        answer: { choice: 2, choices: ['Blow the water off the coin', 'Heat the plate until the water boils away', 'Light the candle in the plate and cover it with the glass: the water is drawn up into the glass', 'Drop the matches in to soak up the water'] },
        traps: [{ match: 1, msg: 'That would take a very long time — and a very hot plate.' }],
        glyph: '🕯', figure: TR('coin-dry', 340)
      },
      concepts: ['air-pressure'], links: ['phen-candle', 'trick-coin-glass']
    },

    /* ---------- water and air ---------- */
    {
      id: 'trick-glass-card', title: 'The Upside-Down Glass', diff: 1,
      text: 'Fill a glass to the brim with water, lay a postcard over it, hold the card in place and turn the glass upside down. Take your hand away: the water stays in the glass.\n\nWhat holds it up?',
      hints: ['What is under the card?'],
      explain: '**The air.** The air below presses up on the card with about a kilogram on every square centimetre — far more than the weight of the water above it. A thin film of water makes a seal at the rim, so no air gets in to take the water\'s place. Tilt it and let a bubble in, and it all comes down.',
      data: {
        answer: { choice: 0, choices: ['The pressure of the air under the card', 'The card sticks to the glass by static electricity', 'The water is too cold to flow', 'A vacuum sucks the card up'] },
        traps: [{ match: 3, msg: 'There is no vacuum — just water. It is the air below that pushes.' }],
        glyph: '🥛', figure: TR('glass-card', 360)
      },
      concepts: ['air-pressure', 'surface-tension'], links: ['trick-hanky-glass']
    },
    {
      id: 'trick-hanky-glass', title: 'Water in a Sieve', diff: 3,
      text: 'Stretch a handkerchief tightly over the mouth of a half-full glass of water and hold it round the sides. Turn the glass upside down. Water can pass through the cloth — you poured it in through the cloth, after all — yet now none comes out.\n\nWhy?',
      hints: ['Look at the tiny holes in the weave, each filled with water.', 'Each hole holds a little curved surface of water.'],
      explain: 'Each hole in the weave is filled with a tiny curved skin of water, and **surface tension** holds those skins in place, while the **air pressure** below holds up the water above, as with the card. The cloth acts like a card full of holes too small for air to bubble through. Poke the cloth, or tilt the glass, and the spell breaks.',
      data: {
        answer: { choice: 1, choices: ['The cloth swells shut when it is wet', 'Surface tension spans each hole of the weave, and the air below holds the water up', 'The water freezes onto the cloth', 'The cloth is waterproof'] },
        traps: [{ match: 0, msg: 'Cotton does swell a little, but the holes stay open — you poured the water through them.' }, { match: 3, msg: 'You could pour water through it. Something else stops it now.' }],
        glyph: '🧣', figure: TR('hanky-glass', 360)
      },
      concepts: ['surface-tension', 'air-pressure'], links: ['trick-glass-card']
    },
    {
      id: 'trick-brim-coins', title: 'Room for More', diff: 2,
      text: 'A glass is filled with water right up to the brim — not one more drop, you would think. You slide coins in, one at a time, gently and edge first.\n\nAbout how many can you add before the water spills?',
      hints: ['Look at the surface of the water from the side as the coins go in.'],
      explain: '**Dozens** — often thirty or more, depending on the glass. Each coin adds only a little volume, and the water rises above the rim in a dome, held together by **surface tension** like a skin. The dome can stand several millimetres above the glass before it finally bursts.',
      data: {
        answer: { choice: 2, choices: ['Not one: it is full', 'One or two', 'Dozens', 'Hundreds'] },
        traps: [{ match: 0, msg: 'Try it: the surface can bulge above the rim.' }, { match: 1, msg: 'Far more than that — the water heaps up in a dome.' }],
        glyph: '🪙', figure: TR('brim-coins', 340)
      },
      concepts: ['surface-tension'], links: ['trick-cork-middle']
    },
    {
      id: 'trick-cork-middle', title: 'The Cork in the Middle', diff: 4,
      text: 'Drop a cork into a half-full glass of water: it always drifts to the side and sticks to the glass. Make it float in the **middle** of the glass, without touching it.',
      hints: ['Look at the water’s surface: near the glass it curves up.', 'A floating cork drifts to the highest part of the surface. How can you make the middle the highest?'],
      explain: '**Fill the glass to overflowing.** In a part-filled glass the water creeps up the glass wall, so the surface is highest at the edge, and the cork floats "uphill" to it. Top the glass up until the water bulges above the rim: now the surface is a dome, highest in the middle — and the cork moves to the centre and stays there.',
      data: {
        answer: { text: ['fill the glass to the brim', 'fill it to the brim', 'fill it up', 'fill the glass', 'overfill', 'overfill the glass', 'fill to overflowing', 'fill it until it overflows', 'top it up', 'add more water', 'fill it right up', 'fill to the top'] },
        traps: [{ match: ['stir it', 'spin the water'], msg: 'A stir sends it round and round — and back to the side.' }],
        glyph: '🍾', figure: TR('cork-middle', 320)
      },
      concepts: ['surface-tension'], links: ['trick-brim-coins']
    },
    {
      id: 'trick-paperclip', title: 'The Floating Paper Clip', diff: 2,
      text: 'Steel is nearly eight times as dense as water, yet you can make a steel paper clip **float** on a bowl of water. How?',
      hints: ['Dropped in, it sinks at once. Laid down very gently, it can rest on the surface.', 'Use something to lower it gently — something that then goes away by itself.'],
      explain: 'Lay a small piece of **tissue paper** on the water and put the clip on it. The tissue soon soaks and sinks, leaving the clip lying on the surface, held up by **surface tension**: the water\'s skin bends under it like a trampoline. A drop of washing-up liquid weakens the skin — and the clip sinks.',
      data: {
        answer: { text: ['tissue paper', 'tissue', 'on a piece of tissue', 'a piece of paper', 'paper', 'blotting paper', 'toilet paper', 'kitchen paper', 'on tissue paper', 'lower it on a fork', 'fork'] },
        glyph: '📎', figure: TR('paperclip', 300)
      },
      concepts: ['surface-tension'], links: ['trick-pepper']
    },
    {
      id: 'trick-pepper', title: 'Pepper Runs Away', diff: 1,
      text: 'Sprinkle ground pepper over a plate of water. Dip a fingertip in washing-up liquid and touch the middle of the water.\n\nWhat happens?',
      hints: ['Soap weakens the "skin" of the water where it touches.'],
      explain: 'The pepper **rushes to the rim**, as if scared of the finger. Soap weakens the surface tension where it lands; the stronger surface all around pulls away from the weak spot, carrying the floating pepper with it. (Without soap, a dry finger does nothing.)',
      data: {
        answer: { choice: 1, choices: ['The pepper sinks', 'The pepper flies to the edge of the plate', 'The pepper gathers round the finger', 'Nothing'] },
        traps: [{ match: 2, msg: 'The opposite — it flees.' }],
        glyph: '🧂', figure: TR('pepper', 300)
      },
      concepts: ['surface-tension'], links: ['trick-paperclip']
    },
    {
      id: 'trick-cork-bottle', title: 'The Cork in the Bottle', diff: 3,
      text: 'A cork has been pushed right down into an empty wine bottle, and rolls about inside. Get it out without breaking the bottle or the cork.',
      hints: ['Something soft, pushed in through the neck, could wrap round the cork.', 'A large handkerchief, or a loop of string.'],
      explain: 'Feed a **handkerchief** (a large thin one) into the bottle, leaving a corner outside. Tip the bottle until the cork rolls into the cloth, lying lengthwise in the neck. Pull slowly: the cloth wraps the cork and squeezes it out through the neck. A loop of string, or a thin plastic bag blown up inside, does the same.',
      data: {
        answer: { text: ['a handkerchief', 'handkerchief', 'hanky', 'cloth', 'a cloth', 'napkin', 'a napkin', 'scarf', 'string', 'a loop of string', 'cord', 'rag', 'towel', 'plastic bag', 'a bag'] },
        traps: [{ match: ['shake it', 'turn it upside down', 'tip it out'], msg: 'It is wider than the neck lying sideways — it will not drop out alone.' }],
        glyph: '🍷', figure: TR('cork-bottle', 360)
      },
      concepts: ['lateral'], links: ['trick-cork-middle']
    },
    {
      id: 'trick-siphon', title: 'Empty It Without Tipping', diff: 3,
      text: 'A glass full of water stands on a pile of books. Get the water into an empty glass on the table, without lifting, tipping or touching the full glass.',
      hints: ['Water can flow uphill for a while, if it ends up lower than it started.', 'A bendy straw, or a strip of cloth.'],
      explain: 'Make a **siphon**: fill a bendy straw (or a length of tube) with water, keep the ends closed with your fingers, and put one end in the full glass and the other in the lower glass. Let go: the water climbs over the top and runs down into the lower glass until the upper glass is empty. The weight of the longer, lower column of water pulls the rest along. (A strip of cloth or paper towel does the same, much more slowly, by soaking it up.)',
      data: {
        answer: { text: ['a siphon', 'siphon', 'syphon', 'a straw', 'straw', 'bendy straw', 'a tube', 'tube', 'a hose', 'hose', 'a wick', 'wick', 'a cloth', 'paper towel', 'cloth'] },
        glyph: '🥤', figure: TR('siphon', 360)
      },
      concepts: ['air-pressure', 'lateral'], links: ['trick-coin-dry']
    },
    {
      id: 'trick-ice-thread', title: 'Fishing for Ice', diff: 2,
      text: 'An ice cube floats in a glass of water. Using a piece of thread — without tying it round the cube — lift the ice cube out. You may use one thing from the kitchen.',
      hints: ['Lay the thread on the ice. What could freeze it there?', 'Something from the salt cellar.'],
      explain: 'Lay the thread across the cube and sprinkle a pinch of **salt** over it. Salt makes ice melt at a lower temperature, so the ice under the salt melts; melting takes heat from the ice around, which gets colder still. The meltwater, diluted, then freezes again — round the thread. After a minute, lift: the cube comes up on the thread.',
      data: {
        answer: { text: ['salt', 'with salt', 'sprinkle salt', 'a pinch of salt', 'table salt', 'sprinkle salt on it'] },
        traps: [{ match: ['sugar'], msg: 'Sugar does melt ice a little, but salt is the trick.' }],
        glyph: '🧊', figure: TR('ice-thread', 330)
      },
      concepts: ['lateral'], links: ['trick-egg']
    },
    {
      id: 'trick-bottle-ball', title: 'Blowing a Ball Into a Bottle', diff: 2,
      text: 'Lay an empty bottle on its side and put a small ball of paper just inside its mouth. Now try to blow the ball into the bottle.\n\nWhat happens?',
      hints: ['Where does the air you blow in have to go?'],
      explain: 'The paper ball **flies out at you**. Blowing into the bottle raises the pressure inside it, and the air has only one way out — back past the ball, which it shoots out of the mouth. The harder you blow, the faster it comes back. (The way to get it in is with a straw, blowing only at the ball.)',
      data: {
        answer: { choice: 2, choices: ['It shoots into the bottle', 'It rolls in slowly', 'It flies out towards you', 'It stays exactly where it is'] },
        traps: [{ match: 0, msg: 'Try it! The bottle is already full — of air.' }],
        glyph: '🍾', figure: TR('bottle-ball', 300)
      },
      concepts: ['air-pressure'], links: ['trick-funnel-ball']
    },
    {
      id: 'trick-funnel-ball', title: 'The Ball in the Funnel', diff: 2,
      text: 'Put a ping-pong ball in a funnel held mouth up, and blow hard up through the stem.\n\nWhat happens to the ball?',
      hints: ['Where does the air go once it reaches the ball?', 'Fast-moving air presses less than still air.'],
      explain: 'The ball **stays in the funnel**, jiggling, however hard you blow — you can even turn the funnel upside down while blowing and it will not fall. The air rushes round the ball and out between it and the funnel wall; that fast stream presses on the ball less than the still air above it, which pushes the ball back down.',
      data: {
        answer: { choice: 1, choices: ['It is blown high into the air', 'It stays in the funnel, jiggling', 'It spins but lifts off', 'It is sucked down into the stem'] },
        traps: [{ match: 0, msg: 'That is what everyone expects. Try it.' }],
        glyph: '🏓', figure: TR('funnel-ball', 340)
      },
      concepts: ['air-pressure'], links: ['trick-blow-between']
    },
    {
      id: 'trick-blow-between', title: 'Blow Them Apart?', diff: 1,
      text: 'Two balloons hang on threads, a hand’s width apart. You blow hard into the gap between them.\n\nWhat do they do?',
      hints: ['Moving air presses less than still air.'],
      explain: 'They **swing together**, not apart. The fast stream of air between them presses on their inner sides less than the still air presses on their outer sides, so they are pushed towards each other. Two sheets of paper held up and blown between do the same, and so do two boats passing close on a river.',
      data: {
        answer: { choice: 1, choices: ['They fly apart', 'They swing together', 'They spin round', 'Nothing'] },
        traps: [{ match: 0, msg: 'The obvious answer — and wrong. Try it with two sheets of paper.' }],
        glyph: '🎈', figure: TR('blow-between', 330)
      },
      concepts: ['air-pressure'], links: ['trick-funnel-ball', 'trick-bottle-candle']
    },
    {
      id: 'trick-bottle-candle', title: 'Blowing Round a Bottle', diff: 2,
      text: 'A lit candle stands just behind a round bottle. You blow hard at the front of the bottle.\n\nWhat happens to the candle?',
      hints: ['Air flowing along a curved surface tends to follow the curve.'],
      explain: 'It **goes out**. The stream of air clings to the curved glass and flows round both sides of the bottle, meeting again behind it — right on the flame. It works best with a round bottle; a flat-sided box blocks the stream.',
      data: {
        answer: { choice: 0, choices: ['It goes out', 'Nothing: the bottle shields it', 'It flares up towards you'] },
        traps: [{ match: 1, msg: 'The air does not stop at the bottle: it hugs the glass and goes round.' }],
        glyph: '🕯', figure: TR('bottle-candle', 320)
      },
      concepts: ['air-pressure'], links: ['trick-blow-between']
    },

    /* ---------- lifting and balancing ---------- */
    {
      id: 'trick-egg', title: 'Columbus’s Egg', diff: 1,
      source: 'The story of Columbus and the egg is told by Girolamo Benzoni in his *History of the New World* (1565).',
      text: 'Make a raw egg stand upright on its end on a bare table, and stay there.',
      hints: ['Columbus is said to have tapped the end of his egg on the table. There is a gentler way using the kitchen.', 'A few grains of something from the salt cellar.'],
      explain: 'Pour a little heap of **salt**, stand the egg in it, then blow the loose salt away gently: a few hidden grains under the egg hold it up. The legend is that Columbus, told that anyone could have discovered America, challenged the company to stand an egg on its end — and when nobody could, tapped his egg on the table, flattening its end, and stood it up. Easy once you have been shown.',
      data: {
        answer: { text: ['salt', 'a pinch of salt', 'on salt', 'stand it in salt', 'crack the end', 'tap the end', 'break the end', 'flatten the end', 'crack it', 'tap it'] },
        glyph: '🥚', figure: TR('egg', 320)
      },
      concepts: ['centre-of-mass', 'lateral'], links: ['trick-ice-thread']
    },
    {
      id: 'trick-matchbox', title: 'The Matchbox That Stands', diff: 3,
      text: 'Drop a matchbox on its end onto the table from a hand’s height: it bounces and falls over. Make it land and stay standing on its end — every time.',
      hints: ['The trouble is the bounce. Something must soak it up.', 'The box has a tray that slides.'],
      explain: 'Push the **tray out** a third of the way and drop the box with the tray end upwards. When it lands, the tray slams shut, and the jolt of it closing soaks up the energy of the bounce; the box stays standing. A little shock absorber, built into every matchbox.',
      data: {
        answer: { choice: 2, choices: ['Wet the bottom so it sticks', 'Drop it from much higher', 'Slide the tray a third of the way out first', 'Spin it as you drop it'] },
        traps: [{ match: 1, msg: 'Higher means a bigger bounce.' }],
        glyph: '▮', figure: TR('matchbox', 340)
      },
      concepts: ['energy', 'lateral'], links: ['trick-egg']
    },
    {
      id: 'trick-bottle-straw', title: 'Lifting a Bottle With a Straw', diff: 2,
      text: 'Lift an empty glass bottle off the table using only a drinking straw — without touching the bottle with your hands.',
      hints: ['The straw can bend.', 'Something bent inside the bottle could catch under its shoulders.'],
      explain: '**Bend the straw** sharply about a third of the way along and push the bent end down into the bottle, folded. Inside, it springs open into a V and jams under the shoulder of the bottle. Lift the straw, and the bottle comes with it.',
      data: {
        answer: { text: ['bend the straw', 'bend it', 'fold the straw', 'fold it', 'bend it inside the bottle', 'bend it and push it in', 'kink it', 'bend the straw and put it in the bottle'] },
        glyph: '🥤', figure: TR('bottle-straw', 360)
      },
      concepts: ['lateral'], links: ['trick-glass-balloon', 'trick-rice']
    },
    {
      id: 'trick-glass-balloon', title: 'Lifting a Glass With a Balloon', diff: 1,
      text: 'Pick up a glass using a balloon, without your hands touching the glass.',
      hints: ['Put the balloon inside the glass first.'],
      explain: 'Put the balloon inside the glass and **blow it up**. It swells until it presses hard against the inside of the glass; hold the balloon’s neck and lift, and the glass comes too, gripped by friction.',
      data: {
        answer: { text: ['blow it up inside the glass', 'blow up the balloon inside', 'inflate it inside', 'inflate the balloon inside the glass', 'put it in and blow it up', 'blow it up', 'inflate it'] },
        glyph: '🎈', figure: TR('glass-balloon', 340)
      },
      concepts: ['friction', 'lateral'], links: ['trick-bottle-straw']
    },
    {
      id: 'trick-rice', title: 'The Chopstick in the Rice', diff: 2,
      text: 'A jar is filled to the top with dry rice. Lift the jar with a single chopstick, touching nothing else.',
      hints: ['Push the chopstick in and pull it out again, many times. What happens to the rice?'],
      explain: 'Push the chopstick into the rice and pull it out, again and again, pressing the rice down. The grains **pack tighter** — the level sinks — until they grip the stick on every side. Then the friction of thousands of grains is enough to lift the whole jar on the chopstick.',
      data: {
        answer: { text: ['pack the rice', 'jab it in many times', 'push it in and out', 'pack it down', 'keep stabbing', 'jab it repeatedly', 'press the rice down', 'compact the rice', 'stab it many times', 'poke it many times'] },
        glyph: '🍚', figure: TR('rice', 360)
      },
      concepts: ['friction'], links: ['trick-books']
    },
    {
      id: 'trick-books', title: 'Two Books That Will Not Part', diff: 2,
      text: 'Riffle the pages of two paperbacks together, one leaf over the other, so they overlap all the way. Now two strong people pull on the spines.\n\nWhat happens?',
      hints: ['Each overlap has only a little friction. How many overlaps are there?', 'And what does pulling do to how hard the pages press together?'],
      explain: 'They **cannot pull them apart** — in television tests the books have held out against cars pulling them apart. Each pair of touching pages adds a little friction, and there are hundreds of them; worse, pulling tilts the pages slightly and squeezes the stack tighter, so the harder you pull the harder they grip. Push the spines together to loosen them, and they slide apart easily.',
      data: {
        answer: { choice: 1, choices: ['They slide apart easily', 'They will not come apart, however hard they pull', 'The pages tear at once', 'They come apart only if pulled slowly'] },
        traps: [{ match: 0, msg: 'Each page barely holds — but there are hundreds of them.' }],
        glyph: '📚', figure: TR('books', 320)
      },
      concepts: ['friction'], links: ['trick-rice']
    },
    {
      id: 'trick-paper-bridge', title: 'The Paper Bridge', diff: 2,
      text: 'Two glasses stand a little apart. Make a bridge between them out of a single sheet of paper that will carry a third glass.',
      hints: ['Flat paper sags under its own weight. How do builders make thin sheet metal stiff?', 'Fold it.'],
      explain: 'Fold the paper into narrow lengthwise **pleats**, like a fan, and lay it across. The folds stand the paper on edge, where it is far stiffer, and the bridge carries the glass. It is how corrugated cardboard and iron roofs get their strength.',
      data: {
        answer: { text: ['fold it into pleats', 'pleat it', 'pleats', 'fold it like a fan', 'fan fold', 'corrugate it', 'concertina', 'fold it into a concertina', 'accordion', 'zigzag', 'fold it zigzag', 'fold it'] },
        glyph: '🌉', figure: TR('paper-bridge', 330)
      },
      concepts: ['lateral'], links: ['trick-coin-note']
    },
    {
      id: 'trick-balloon', title: 'The Skewer and the Balloon', diff: 2,
      text: 'Push a long wooden skewer right through an inflated balloon — in one side and out the other — without popping it.',
      hints: ['Where is the rubber stretched least?', 'Near the knot, and at the dark patch on the opposite end.'],
      explain: 'Oil the point and push it in, gently twisting, **through the thick rubber next to the knot**, and out through the **dark patch at the opposite end**. Those are the two places where the rubber is stretched least; there it can close round the skewer instead of tearing. Anywhere else, where the rubber is stretched thin, it bursts.',
      data: {
        answer: { choice: 2, choices: ['Very fast, in one quick stab', 'Through the middle of the sides', 'In beside the knot and out at the dark patch opposite', 'It cannot be done'] },
        traps: [{ match: 1, msg: 'That is where the rubber is stretched thinnest: bang.' }, { match: 0, msg: 'Speed does not help rubber that is stretched thin.' }],
        glyph: '🎈', figure: TR('balloon', 340)
      },
      concepts: ['lateral'], links: ['trick-straw-potato']
    },
    {
      id: 'trick-straw-potato', title: 'A Straw Through a Potato', diff: 3,
      text: 'Push a thin plastic drinking straw into a raw potato. Jab it, and it just crumples. What makes the difference?',
      hints: ['The straw is weak because it is hollow and can buckle.', 'Trap something inside it.'],
      explain: 'Put your **thumb over the top** of the straw before you jab. The air trapped inside can\'t escape, so as the straw hits the potato the air is squeezed and pushes out on the walls, stiffening the straw so it cannot buckle. Jabbed fast and straight, it goes deep into the potato — and comes out with a potato plug inside.',
      data: {
        answer: { text: ['thumb over the top', 'cover the top with your thumb', 'cover the top', 'block the top', 'put your thumb over it', 'thumb', 'seal the top', 'close the top', 'cover the end', 'block the end'] },
        glyph: '🥔', figure: TR('straw-potato', 320)
      },
      concepts: ['air-pressure'], links: ['trick-balloon']
    },
    {
      id: 'trick-candle-seesaw', title: 'The Candle See-Saw', diff: 3,
      text: 'Push a needle through the middle of a candle, trim the bottom so both ends have a wick, and rest the needle across two glasses so the candle can rock. Light both ends.\n\nWhat happens?',
      hints: ['The lower end drips more. What happens to its weight?'],
      explain: 'It **rocks up and down by itself**, for as long as it burns. Whichever end dips lower drips wax faster, gets lighter and rises; then the other end is lower and drips — and the swings keep going. A little engine running on gravity and a flame.',
      data: {
        answer: { choice: 1, choices: ['It stays level', 'It rocks up and down, again and again', 'It tips once and stays tipped', 'It spins round the needle'] },
        traps: [{ match: 0, msg: 'It never stays level for long. Watch the drips.' }],
        glyph: '🕯', figure: TR('candle-seesaw', 330)
      },
      concepts: ['centre-of-mass'], links: ['trick-forks']
    },

    /* ---------- a game of reflexes ---------- */
    {
      id: 'trick-catch-note', title: 'Catch the Banknote', diff: 2,
      text: 'A friend holds a banknote hanging down, its middle between your open finger and thumb (not touching). "If you catch it when I let go, you can keep it." They let go without warning.\n\nIs the note safe? Play the game on the card before you answer.',
      hints: ['How long does it take you to react? Try it.', 'In about a fifth of a second a falling thing drops about 20 cm.'],
      explain: 'The note is **safe**: nearly nobody catches it. Your reaction time — seeing the fall, deciding, closing your fingers — is typically around 0.2 seconds, and in that time the note falls ½gt² ≈ 20 cm. But you only have half the note, about 8 cm, to catch; that falls past in about 0.13 s. Only with luck or a guess can you win.',
      data: {
        answer: { choice: 0, choices: ['Yes: it falls past before you can close your fingers', 'No: anyone quick can catch it', 'It depends on how much the note is worth'] },
        traps: [{ match: 1, msg: 'Try it on the card — and count your catches honestly.' }, { match: 2, msg: 'Heavier or lighter, notes fall alike. It depends on your reaction time.' }],
        glyph: '💶', figure: { fig: 'trick-catch', params: {}, w: 620, h: 380 }
      },
      concepts: ['free-fall'], links: ['trick-ruler-drop']
    },
    {
      id: 'trick-ruler-drop', title: 'The Ruler Test', diff: 3,
      text: 'A friend holds a ruler hanging down, its zero mark between your open finger and thumb, and lets go without warning. You catch it after it has fallen **15 cm**.\n\nWhat is your reaction time, in milliseconds? (Take g = 9.81 m/s².)',
      hints: ['A dropped thing falls d = ½gt².', 'Solve t = √(2d/g) with d = 0.15 m.'],
      explain: 't = √(2 × 0.15 / 9.81) ≈ 0.175 s: about **175 ms**. The ruler is a stopwatch: the further it falls, the slower you were, and because the distance grows with the square of the time, the marks for 0.1 s, 0.2 s and 0.3 s are at about 5 cm, 20 cm and 44 cm.',
      data: {
        answer: { num: 175, tol: 3, unit: 'ms' },
        traps: [{ match: 150, msg: 'The ruler does not fall at a steady speed: it speeds up. Use d = ½gt².' }],
        glyph: '📏', figure: { fig: 'trick-catch', params: {}, w: 620, h: 380 }
      },
      concepts: ['free-fall'], links: ['trick-catch-note']
    }
  ];

  Cabinet.family({
    id: 'table-tricks', engine: 'question', cat: 'coins', name: 'Tricks at the table', order: 30,
    blurb: 'Six cigarettes that all touch, twelve nails balanced on one, a coin that leaves a glass untouched: the after-dinner challenges with everyday things — say how, then watch it done.',
    about: 'Each card sets a challenge with ordinary things from the table. **Say how it is done** (type it in a few words, or pick an answer). Once you have answered, press **Show me how** on the card to watch it — and for the cigarettes and nails, **turn it in 3D**. Then try it for real.',
    origin: { year: 1893, who: 'The parlour-trick books', note: 'Victorian and Edwardian books of "science in sport" and after-dinner tricks — Tom Tit\'s *La science amusante* in France, Hoffmann\'s puzzle books in England — filled whole chapters with glasses, coins, corks and forks. Most of these tricks come from that tradition.' },
    concepts: ['inertia', 'surface-tension', 'air-pressure', 'centre-of-mass', 'friction'],
    deps: ['js/lib/figures.js']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
