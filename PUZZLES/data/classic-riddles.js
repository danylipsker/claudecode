/* The Puzzle Cabinet · data/classic-riddles.js
 * Folk riddles and brain-teasers, old and new, retold or newly made in our own words.
 * (The idea of a folk riddle belongs to everyone; the wording of every riddle here is ours.) */
Cabinet.family({
  id: 'classic-riddles', engine: 'question', cat: 'riddles', name: 'Riddles old and new', order: 5,
  blurb: 'What has keys but opens no lock? The riddles children have traded for generations: things, animals, weather, families and small tricks of logic.',
  origin: { who: 'Folk tradition', note: 'Nobody knows who first asked what has hands and cannot clap. Riddles were passed from mouth to mouth for longer than anyone wrote them down; the ones here are told again in fresh words, with a few new verses in the old manner.' },
  concepts: ['lateral']
}, [

  /* ---------- the easiest ---------- */
  {
    id: 'rid-keys', title: 'Keys That Open Nothing', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `Here is a riddle as old as the first lock (or at least as old as the first piano):\n\n*What has keys, and yet cannot open a single lock?*`,
    hints: [`These keys are pressed, not turned.`, `Its keys are usually black and white, and it can play a tune.`],
    explain: `A **piano**: eighty-eight keys, and not one of them will open your front door. A computer keyboard, a typewriter or an organ is just as good an answer — all of them are crowded with keys that never meet a lock.`,
    data: {
      answer: { text: ['piano', 'keyboard', 'typewriter', 'organ', 'keypad', 'synthesizer', 'synthesiser'] },
      traps: [{ match: ['key', 'keys', 'lock', 'a key ring', 'key ring', 'keyring', 'locksmith'], msg: `Those are the wrong sort of key. The keys in this riddle are pressed, not turned.` }],
      glyph: '🔑'
    },
    tags: ['objects', 'music', 'classic'], links: ['rid-hands', 'rid-neck']
  },
  {
    id: 'rid-towel', title: 'The Wetter It Gets', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `An object has a curious career: the more things it dries, the wetter it becomes. What is it?`,
    hints: [`You will find one near the bath or the shower.`, `You wrap it around yourself when you step out of the water.`],
    explain: `A **towel**. Whatever water it takes off you or the dishes has to go somewhere, and the somewhere is the towel. The riddle is a small lesson in how things work: drying is only moving the wet to a new address.`,
    data: {
      answer: { text: ['towel', 'flannel', 'washcloth', 'dishcloth'] },
      traps: [{ match: ['sponge', 'a sponge', 'cloth', 'a cloth', 'rag', 'a rag'], msg: `Nearly, but think of something you use on yourself after a bath.` }],
      glyph: '💦'
    },
    tags: ['objects', 'home', 'classic'], links: ['rid-sponge']
  },
  {
    id: 'rid-hands', title: 'Hands That Never Clap', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `It has a face with no eyes and hands that can never clap. It does not talk, but it tells you the truth every time you glance at it (unless its battery is tired).\n\nWhat is it?`,
    hints: [`Its hands point at numbers and go round and round.`, `You look at it when you are afraid of being late.`],
    explain: `A **clock** (or a watch). Its two hands sweep the face all day, the short one crawling and the long one hurrying, and the pair of them meet once in a while as if to shake hands.`,
    data: {
      answer: { text: ['clock', 'watch', 'wristwatch', 'wrist watch', 'alarm clock', 'grandfather clock', 'timepiece', 'stopwatch', 'pocket watch', 'wall clock'], exact: true },
      traps: [{ match: ['person', 'a person', 'man', 'a man', 'monkey', 'a monkey', 'statue', 'a statue', 'robot'], msg: `A person has hands too, but they can clap. Something on your wall (or your wrist) has two that cannot.` }],
      glyph: '👏'
    },
    tags: ['objects', 'time', 'classic'], links: ['rid-keys', 'rid-coin']
  },
  {
    id: 'rid-coin', title: 'Head and Tail, Nothing Between', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `I have a head and a tail, but no body in between. People toss me into the air to settle arguments, and they always let me fall on the ground.\n\nWhat am I?`,
    hints: [`I am small, round and made of metal.`, `You will find some of me in a pocket or a piggy bank.`],
    explain: `A **coin**. "Heads" is the side with the portrait; "tails" is simply the other side of it. Tossing one is the oldest way of deciding who goes first, and it is a fair way, if the coin is.`,
    data: {
      answer: { text: ['coin', 'penny', 'euro', 'cent', 'dime', 'nickel'] },
      traps: [{ match: ['comet', 'a comet', 'tadpole', 'a tadpole', 'cat', 'a cat', 'snake', 'a snake'], msg: `A head and a tail, yes — but you would not toss one of those in the air. What do people flip to decide who goes first?` }],
      glyph: '🤞'
    },
    tags: ['objects', 'money', 'classic'], links: ['rid-hands']
  },
  {
    id: 'rid-sponge', title: 'Full of Holes', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `I am riddled with holes, yet I hold water. Squeeze me and I give it back.\n\nWhat am I?`,
    hints: [`Lots of small holes usually let water run straight through. Not here.`, `You will find one by the kitchen sink or on the side of the bath.`],
    explain: `A **sponge**. Its holes are tiny pockets, so small that water clings to the walls of each one and cannot fall out until you squeeze. A natural sponge is an animal that lived on the sea floor, and its body was always mostly holes.`,
    data: {
      answer: { text: ['sponge', 'loofah'] },
      traps: [{ match: ['net', 'a net', 'sieve', 'a sieve', 'colander', 'a colander', 'strainer', 'a strainer', 'bucket', 'a bucket'], msg: `A sieve is full of holes too, but it lets the water straight through. This one *holds* it.` }],
      glyph: '💧'
    },
    tags: ['objects', 'home', 'classic'], links: ['rid-towel']
  },
  {
    id: 'rid-age', title: 'Only Ever Up', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `Every birthday it goes up by one. It has never once gone down, though a few people are not entirely honest about it.\n\nWhat is it?`,
    hints: [`It goes up whether you want it to or not.`, `It is the number of candles on the cake.`],
    explain: `**Your age.** It climbs one step at every birthday, and nobody has ever found the staircase down — although many have tried saying the same number for years.`,
    data: {
      answer: { text: ['your age', 'age', 'my age', 'ones age', 'a persons age', 'human age', 'how old you are'] },
      traps: [{ match: ['balloon', 'a balloon', 'smoke', 'a rocket', 'rocket', 'kite', 'a kite', 'helium balloon', 'temperature', 'the temperature'], msg: `Those all come down in the end. What goes up by one on your birthday?` }],
      glyph: '📈'
    },
    tags: ['time', 'people', 'classic'], links: ['rid-tomorrow']
  },
  {
    id: 'rid-catch', title: 'Catch, Do Not Throw', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `There is something you can catch, but never throw, however good your aim. A ball, a frisbee or a fish would not do, for you can throw all three.\n\nNobody wants to catch this one, and yet nearly everyone does, most often in winter.\n\nWhat is it?`,
    hints: [`You catch it from other people, without meaning to.`, `It comes with sneezes, a runny nose and a handkerchief.`],
    explain: `A **cold**. You can catch one from a sneeze, but there is no way to pitch one to a friend. (A bus, a train and a breath can all be caught but not thrown. This riddle's clue about winter points to the one with a runny nose.)`,
    data: {
      answer: { text: ['a cold', 'the flu', 'influenza', 'a virus', 'a bug', 'illness', 'a cough'] },
      traps: [{ match: ['ball', 'a ball', 'frisbee', 'a frisbee', 'fish', 'a fish', 'baseball', 'a baseball'], msg: `You can throw a ball as well as catch it. What do you catch in winter and can never throw?` }],
      glyph: '👐'
    },
    tags: ['health', 'classic'], links: ['rid-yawn']
  },
  {
    id: 'rid-rain', title: 'Down but Never Up', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `It comes down and never goes back up (or so it seems), it arrives in drops that make a drumming on the roof, and it makes gardens grow and picnics fail.\n\nWhat is it?`,
    hints: [`It comes from clouds.`, `When it comes, people put up their umbrellas.`],
    explain: `**Rain.** It does go up again, of course — as invisible vapour, on its way to becoming a cloud — but never in the shape of rain.`,
    data: {
      answer: { text: ['rain', 'raindrops', 'rainfall', 'a shower', 'drizzle', 'rainwater'] },
      traps: [{ match: ['snow', 'hail', 'sleet', 'a cloud', 'cloud'], msg: `Close — but this one is wet, not white, and it makes puddles.` }],
      glyph: '⬇'
    },
    tags: ['weather', 'nature', 'classic'], links: ['rid-umbrella']
  },
  {
    id: 'rid-stars', title: 'Lamps Nobody Lit', diff: 1,
    source: 'A verse of our own in the old manner.',
    text: `A million lamps hang overhead,<br>Though no one lit them, no one fed.<br>They hide all day behind the blue<br>And come out when the night comes through.\n\nWhat are they?`,
    hints: [`They are very far away, and they twinkle.`, `Each one is a sun, seen from a very long way off.`],
    explain: `The **stars**. Every one of them is a sun, so distant that it looks like a lamp. By day they have not gone anywhere; our own sun is simply too bright for us to see them.`,
    data: {
      answer: { text: ['stars', 'starlight', 'constellations', 'the night sky'] },
      traps: [{ match: ['moon', 'the moon', 'fireflies', 'glow worms', 'planets', 'the planets', 'streetlights', 'street lamps'], msg: `Close to the night, but this riddle has a million of them, and nobody switches them on.` }],
      glyph: '🏮'
    },
    tags: ['night', 'nature', 'verse'], links: ['rid-shadow']
  },
  {
    id: 'rid-snowman', title: 'Built, Not Born', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `I am built, not born, out of one main ingredient and a few odds and ends. My nose is a carrot and my eyes are pieces of coal. I like a very cold day, and in spring I simply vanish.\n\nWhat am I?`,
    hints: [`I stand in a garden in winter and never feel the cold.`, `I am made of what falls from the sky in January.`],
    explain: `A **snowman**, the only citizen who welcomes freezing weather and dreads the first warm afternoon.`,
    data: {
      answer: { text: ['snowman', 'snow man', 'snow person', 'snowmen'] },
      traps: [{ match: ['scarecrow', 'a scarecrow', 'ice sculpture', 'an ice sculpture', 'igloo', 'an igloo'], msg: `Good guess, but this one has a carrot for a nose and is at its best in a snowfall.` }],
      glyph: '🥕'
    },
    tags: ['winter', 'nature'], links: ['rid-rain']
  },
  {
    id: 'rid-window', title: 'A Hole in the Wall', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `Make a hole in a wall and fill it with me, and you can see out, but the wind cannot get in. I let the light in, and I keep the rain out. At night people cover me with curtains.\n\nWhat am I?`,
    hints: [`You can look through me, but you cannot walk through me.`, `Open me on a hot day, and you get a breeze.`],
    explain: `A **window**: a wall with a see-through gap. A house without one would be a very tidy cave.`,
    data: {
      answer: { text: ['window', 'windowpane'] },
      traps: [{ match: ['glass', 'a pane of glass', 'glass pane', 'a glass pane'], msg: `Nearly! What do you call a sheet of glass set into a wall?` }, { match: ['door', 'a door', 'gap', 'a gap', 'hole', 'a hole'], msg: `A door lets the wind in. This one lets the light in and keeps the wind out.` }],
      glyph: '🌬'
    },
    tags: ['objects', 'home'], links: ['rid-greenhouse']
  },
  {
    id: 'rid-umbrella', title: 'Up When It Rains', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `As soon as the rain comes down, it goes up. When the rain stops, it folds itself small and goes back into the hall.\n\nWhat is it?`,
    hints: [`You carry it by the handle, and you hold it over your head.`, `In a shower it turns into a small round roof.`],
    explain: `An **umbrella**. The word comes from the Latin *umbra*, "shade": the first umbrellas were made to keep off the sun, and only later did anyone think of using them against rain.`,
    data: {
      answer: { text: ['umbrella', 'brolly'] },
      traps: [{ match: ['parasol', 'a parasol', 'hat', 'a hat', 'raincoat', 'a raincoat', 'hood'], msg: `Nearly. What is it that opens up over your head, on a handle, when the rain begins?` }],
      glyph: '⬆'
    },
    tags: ['objects', 'weather', 'classic'], links: ['rid-rain']
  },
  {
    id: 'rid-spider', title: 'The Silk Spinner', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `I have eight legs and no needle, yet I weave. I make my house out of thread that comes out of my own body, and I catch my dinner without ever running after it.\n\nWhat am I?`,
    hints: [`I am small, and some people jump when they see me.`, `I hang in the corner of a room, in the middle of a net.`],
    explain: `A **spider**. It spins silk from its own body and hangs a web that is a trap as well as a home. Not an insect, incidentally: an insect has six legs, and a spider has eight.`,
    data: {
      answer: { text: ['spider', 'tarantula'] },
      traps: [{ match: ['insect', 'an insect', 'bug', 'a bug', 'ant', 'an ant', 'silkworm', 'a silkworm', 'caterpillar'], msg: `A silkworm spins too, but it has no web, and this one has eight legs, not six.` }],
      glyph: '🧶'
    },
    tags: ['animals', 'nature'], links: ['rid-snail']
  },
  {
    id: 'rid-snail', title: 'Home on the Back', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `I carry my house on my back and never pay rent. I leave a silver road behind me, though I am in no hurry to get anywhere.\n\nWhat am I?`,
    hints: [`I am slow and soft, and I like lettuce leaves.`, `My house is a spiral shell, and I pull all of me into it when I am frightened.`],
    explain: `A **snail**. The silver road is a trail of slime that the snail lays down to glide over. (A slug is a snail that has given up on the house.)`,
    data: {
      answer: { text: ['snail'] },
      traps: [{ match: ['tortoise', 'a tortoise', 'turtle', 'a turtle'], msg: `A tortoise carries its house too, but it leaves no silver road behind it.` }, { match: ['slug', 'a slug'], msg: `A slug is the very cousin — but this one *has* a house.` }, { match: ['hermit crab', 'a hermit crab', 'crab', 'a crab'], msg: `A hermit crab borrows a house, but it does not leave a silver trail.` }],
      glyph: '🏠'
    },
    tags: ['animals', 'nature'], links: ['rid-spider']
  },
  {
    id: 'rid-tree', title: 'Four Suits of Clothes', diff: 1,
    source: 'A verse of our own in the old manner.',
    text: `I dress in green when the days are long,<br>In gold and red when the winds grow strong;<br>I drop it all when the frost is near,<br>And grow it again the following year.<br>I have no legs, but I stand my ground,<br>And every year I add a ring around.\n\nWhat am I?`,
    hints: [`My clothes are leaves.`, `Cut me down, and my age is written in my rings.`],
    explain: `A **tree** (a deciduous one, which drops its leaves in autumn). Each year it adds a fresh ring of wood under the bark, so a stump is a book with one page for every year of its life.`,
    data: {
      answer: { text: ['tree', 'oak', 'maple', 'beech', 'birch', 'elm'] },
      traps: [{ match: ['plant', 'a plant', 'bush', 'a bush', 'shrub', 'flower', 'forest', 'a forest'], msg: `Nearly! But which plant adds a ring of wood every year, and can stand for hundreds of them?` }],
      glyph: '🍂'
    },
    tags: ['plants', 'nature', 'verse'], links: ['rid-acorn']
  },
  {
    id: 'rid-greenhouse', title: 'Red House, Yellow House', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `The red house is built of red bricks. The yellow house is built of yellow bricks. So what is the greenhouse built of?`,
    hints: [`Do not look at the colour. Look at what a greenhouse is *for*.`, `Plants inside need plenty of light.`],
    explain: `**Glass**, of course, so that the sun can get in to the tomatoes. (Some modern ones use clear plastic instead, which is just as good an answer.)`,
    data: {
      answer: { text: ['glass', 'panes of glass', 'glass panes', 'glass and wood', 'glass and metal', 'plastic', 'clear plastic', 'polycarbonate', 'polythene', 'glass and frames', 'glass and steel', 'glass and aluminium', 'glass windows', 'glass walls', 'sheets of glass', 'plastic sheeting', 'plastic sheets', 'glass and plastic', 'plastic and glass', 'wood and glass', 'metal and glass', 'glass panels', 'panels of glass', 'plastic panels'], exact: true },
      traps: [{ match: ['green bricks', 'green', 'bricks', 'brick', 'green brick'], msg: `Ha — that is what the pattern suggests. But does anyone build a greenhouse with bricks?` }],
      glyph: '🧱'
    },
    tags: ['objects', 'garden', 'classic'], links: ['rid-window']
  },
  {
    id: 'rid-library', title: 'Stories Upon Stories', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `A skyscraper has a great many *storeys*, one on top of another. But which building in a town has more *stories* than any skyscraper?`,
    hints: [`This is a pun: a storey is a floor, and a story is something you read.`, `You can borrow the stories in it for free with a card.`],
    explain: `The **library**. Each floor of a tower is a *storey*, but every book in a library holds at least one *story*, and no tower has as many as that.`,
    data: {
      answer: { text: ['library', 'bookshop', 'book shop', 'bookstore', 'book store', 'libraries'] },
      traps: [{ match: ['skyscraper', 'a skyscraper', 'tower', 'a tower', 'high rise', 'a high rise', 'tall building'], msg: `A skyscraper has floors, and floors are one kind of storey. Which building has the *other* kind?` }],
      glyph: '🏢'
    },
    tags: ['puns', 'buildings', 'classic'], links: ['rid-greenhouse']
  },
  {
    id: 'rid-neck', title: 'A Very Odd Neck', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `It has a neck, but not a trace of a head anywhere. What can it be?\n\nThere is more than one good answer, so once you have found one, look for another.`,
    hints: [`Think of things with a narrow part at the top, or a place where the collar goes.`, `A cork sits where the head would be, or a stopper.`],
    explain: `A **bottle** is the usual answer, but a shirt, a jumper, a guitar and a violin all have a neck and not a hint of a head, and each is as right as any.`,
    data: {
      answer: { text: ['bottle', 'shirt', 'jumper', 'sweater', 'guitar', 'violin', 'cello', 'vase', 'jug', 'flask'] },
      traps: [{ match: ['giraffe', 'a giraffe', 'swan', 'a swan', 'person', 'a person', 'man', 'a man', 'woman', 'a woman', 'human', 'ostrich'], msg: `Has a neck, yes — and a head at the top of it. What has a neck and no head at all?` }],
      glyph: '🦒'
    },
    tags: ['objects', 'classic'], links: ['rid-keys', 'rid-hands']
  },
  {
    id: 'rid-nose', title: 'Middle of the Face', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `I sit between two eyes, and I never see a thing. I run when there is nowhere to run to, and I am blocked when nothing is in my way. I can find a cake in the kitchen from three rooms away.\n\nWhat am I?`,
    hints: [`I am part of the face, and I cannot see, only smell.`, `When you have a cold, people say I am running.`],
    explain: `A **nose**. It "runs" with a cold and is "blocked" although nothing stands in the way, and it is the part of you that finds the cake first.`,
    data: {
      answer: { text: ['nose'] },
      traps: [{ match: ['mouth', 'a mouth', 'eyes', 'ears', 'chin', 'a chin', 'ear', 'an ear'], msg: `Right part of the head! But which one sits between the eyes and smells the cake?` }],
      glyph: '🍰'
    },
    tags: ['body', 'senses'], links: ['rid-eyes']
  },
  {
    id: 'rid-comb', title: 'Teeth That Never Bite', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `It has a whole row of teeth, and it has never bitten anybody. What is it?\n\n(The teeth in your own mouth, of course, do not count. Neither does a dentist's drill.)`,
    hints: [`You may use one every morning, on your head.`, `Some of these are in a tool box or in a jacket, and most of them are in a drawer in the bathroom.`],
    explain: `A **comb**, most likely. A saw, a zip, a rake and the wheel of a cog have teeth as well, and none of them has ever bitten anyone (a saw comes closest).`,
    data: {
      answer: { text: ['comb', 'saw', 'zip', 'zipper', 'zip fastener', 'gear', 'cog', 'rake'] },
      traps: [{ match: ['dentist', 'a dentist', 'dentures', 'false teeth', 'a shark', 'shark', 'crocodile', 'a crocodile', 'dog', 'a dog'], msg: `Those bite! Find something with teeth that never does.` }],
      glyph: '🦷'
    },
    tags: ['objects', 'classic'], links: ['rid-neck', 'rid-keys']
  },
  {
    id: 'rid-bed', title: 'A Crowded Anatomy', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `It has one head, one foot and four legs, yet it has never taken a step. You spend about a third of your life on top of it.\n\nWhat is it?`,
    hints: [`It is a piece of furniture.`, `The head is where your own head goes, and the foot is at the other end.`],
    explain: `A **bed**: a head where your head goes, a foot where your feet go, and four legs to stand on. It goes nowhere, and yet it is where you spend a third of your life.`,
    data: {
      answer: { text: ['bed', 'cot', 'bunk', 'four poster'] },
      traps: [{ match: ['table', 'a table', 'chair', 'a chair', 'stool', 'a stool', 'sofa', 'a sofa', 'couch', 'a couch', 'dog', 'a dog'], msg: `A table has legs but no head. What piece of furniture has a head *and* a foot?` }],
      glyph: '🦶'
    },
    tags: ['objects', 'home', 'classic'], links: ['rid-neck']
  },
  {
    id: 'rid-map', title: 'Cities Without Houses', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `I show you deserts with no sand, seas with no water and towns with nobody in them. You cannot live in me, but I can help you find your way across the whole world.\n\nWhat am I?`,
    hints: [`I am flat and can be folded, and nothing on me is real.`, `You can look up the road to the sea on me, but you cannot swim in it.`],
    explain: `A **map**. Everything on it is a little sign standing for a real thing, and the whole world fits in your pocket. Some of the oldest maps we still have are clay tablets from Babylonia, several thousand years old.`,
    data: {
      answer: { text: ['map', 'atlas', 'globe', 'road map', 'chart', 'sea chart', 'world map', 'street map', 'treasure map', 'a map of the world'], exact: true },
      traps: [{ match: ['picture', 'a picture', 'painting', 'a painting', 'photo', 'a photo', 'photograph', 'a photograph'], msg: `A picture shows what things look like. What shows you *where* they are?` }],
      glyph: '🏜'
    },
    tags: ['objects', 'places', 'classic'], links: ['rid-stamp']
  },
  {
    id: 'rid-heart', title: 'The Worker Who Never Rests', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `I have never had a day off. I am about the size of your fist, and I sit behind your ribs. I beat something like a hundred thousand times a day; when you run I go faster, and when you sleep I slow down, but I never stop.\n\nWhat am I?`,
    hints: [`You can feel me by putting a hand on your chest.`, `I pump blood all around you.`],
    explain: `Your **heart**. In a long life it beats some three billion times, without a rest, and the only holiday it ever takes is the last one.`,
    data: {
      answer: { text: ['heart', 'your heart', 'my heart', 'human heart'], exact: true },
      traps: [{ match: ['lungs', 'the lungs', 'brain', 'the brain', 'pulse', 'clock', 'a clock', 'a drum', 'drum', 'stomach'], msg: `A drum beats too, but it has days off. What organ beats inside you?` }],
      glyph: '⏱'
    },
    tags: ['body'], links: ['rid-eyes']
  },
  {
    id: 'rid-moon', title: 'The Nibbled Lamp', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `Every night I look a little different. I start as a thin curve, grow fat and round, and then shrink again, as though somebody were nibbling me away. I have no light of my own, and yet I light up the night.\n\nWhat am I?`,
    hints: [`I am up in the sky, and I do not always stay the same shape.`, `I go round the Earth about once a month.`],
    explain: `The **moon**. It shines only by the sun's light, and what we call its phases are the changing views of the sunlit half, from new to full and back, about every 29½ days.`,
    data: {
      answer: { text: ['moon', 'crescent'] },
      traps: [{ match: ['sun', 'the sun', 'star', 'a star', 'comet', 'a comet', 'cloud', 'a cloud'], msg: `The sun always looks the same. Which lamp of the night waxes and wanes?` }],
      glyph: '🍪'
    },
    tags: ['night', 'nature', 'classic'], links: ['rid-stars']
  },
  {
    id: 'rid-tadpole', title: 'Legs Instead of a Tail', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `When I am young I live in a pond, with a tail and no legs, and I breathe with gills. When I am grown up I have four legs and no tail, and I hop about on the land.\n\nWhat am I, at the end of the story?`,
    hints: [`I begin life as an egg in a blob of jelly.`, `My cry is a croak.`],
    explain: `A **frog** (or a toad), which starts out as a tadpole. The tail is not thrown away: it is absorbed into the growing body, which feeds the young frog while it changes.`,
    data: {
      answer: { text: ['frog', 'toad', 'tadpole', 'bullfrog'] },
      traps: [{ match: ['fish', 'a fish', 'newt', 'a newt', 'salamander', 'a salamander', 'lizard', 'a lizard'], msg: `A newt keeps its tail all its life. Which pond creature gives it up and hops?` }],
      glyph: '🔁'
    },
    tags: ['animals', 'nature'], links: ['rid-butterfly']
  },
  {
    id: 'rid-butterfly', title: 'Wings at Last', diff: 1,
    source: 'A new riddle in the old manner.',
    text: `I begin as a crawling, hungry thing that eats leaves all day. Then I hang up in a little case and sleep, and nobody can guess what is going on inside. When I come out I have wings, and I sip from flowers.\n\nWhat am I, at the end of the story?`,
    hints: [`I start out as a caterpillar.`, `I am colourful, and I flutter from flower to flower.`],
    explain: `A **butterfly** (or a moth: the story is the same). Inside the case the caterpillar almost dissolves and builds itself again into a winged creature, one of the strangest changes in all of nature.`,
    data: {
      answer: { text: ['butterfly', 'butterflies', 'moth'] },
      traps: [{ match: ['caterpillar', 'a caterpillar', 'chrysalis', 'a chrysalis', 'cocoon', 'a cocoon', 'larva', 'a larva', 'grub', 'a grub'], msg: `That is where I *begin*. What do I turn into at the end?` }],
      glyph: '🐛'
    },
    tags: ['animals', 'nature'], links: ['rid-tadpole']
  },
  {
    id: 'rid-blackboard', title: 'Black When Clean', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `I am black when I am clean, and I turn white when I get dirty. Teachers write on me all day, and children queue up to wipe me.\n\nWhat am I?`,
    hints: [`You find me in a classroom.`, `I am written on with chalk.`],
    explain: `A **blackboard** (or chalkboard): black when clean, white with chalk when "dirty". In many classrooms the whiteboard has taken over, which spoils the riddle for anyone who has never smelled chalk.`,
    data: {
      answer: { text: ['blackboard', 'chalkboard', 'slate', 'black board'] },
      traps: [{ match: ['whiteboard', 'a whiteboard', 'white board', 'paper', 'a page', 'page', 'a wall', 'wall'], msg: `A whiteboard is the other way about: it is white when clean. This one is black when clean.` }],
      glyph: '🏫'
    },
    tags: ['objects', 'school', 'classic'], links: ['rid-pencil']
  },
  {
    id: 'rid-shoe', title: 'A Tongue That Cannot Talk', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `I have a tongue, but I cannot speak. I have eyes, but I cannot see. I get trodden on all day, and I am tied up every morning, and nobody calls it unkind.\n\nWhat am I?`,
    hints: [`I come in pairs and I live at the end of your legs.`, `Laces pass through my eyes.`],
    explain: `A **shoe**: the tongue lies under the laces, the eyelets are its "eyes", and the sole is what gets walked on. It is one of the few things that is tied up every morning with the owner's full consent.`,
    data: {
      answer: { text: ['shoe', 'boot', 'trainer', 'sneaker', 'plimsoll', 'wellington'] },
      traps: [{ match: ['sock', 'a sock', 'socks', 'slipper', 'a slipper', 'foot', 'a foot', 'feet'], msg: `A sock has no tongue, no laces and no eyes. What goes over a sock?` }],
      glyph: '👅'
    },
    tags: ['objects', 'clothes', 'classic'], links: ['rid-glove']
  },
  {
    id: 'rid-humpty', title: 'A Great Fall', diff: 1,
    source: 'A nursery rhyme, told again as the riddle it is usually taken to be.',
    text: `Somebody sat up high on a wall and toppled off it, and all the king's horses and all the king's men could never put him together again.\n\nWho was he — or what?`,
    hints: [`This is a nursery rhyme, and its hero has a name that rhymes with itself.`, `He is round and fragile, and he is served at breakfast.`],
    explain: `**Humpty Dumpty**, who is generally taken to be an **egg**: a riddle whose answer is a shell that cannot be mended once cracked. In Lewis Carroll's *Through the Looking-Glass* (1871), Alice takes one look at Humpty Dumpty sitting on his wall and thinks he looks exactly like an egg.`,
    data: {
      answer: { text: ['egg', 'humpty', 'hens egg'] },
      traps: [{ match: ['a man', 'man', 'a king', 'king', 'a soldier', 'soldier', 'a boy', 'boy', 'a child', 'a knight'], msg: `He is a character in a rhyme, and he is not exactly a man. What is round and fragile and sits on a wall?` }],
      glyph: '🏰'
    },
    tags: ['nursery rhyme', 'food', 'verse']
  },
  {
    id: 'rid-kangaroo', title: 'Jumps When It Walks', diff: 1,
    source: 'A traditional riddle, told again.',
    text: `It walks by jumping and stands by sitting. It has a pocket, but it never wears a coat.\n\nWhat is it?`,
    hints: [`It lives on the other side of the world, in Australia.`, `Its baby is called a joey.`],
    explain: `A **kangaroo**: it gets about by hopping on its big hind legs, and when it stands still it props itself up on its thick tail as a third leg, so it seems to be sitting. The pocket is the pouch in which a baby joey grows.`,
    data: {
      answer: { text: ['kangaroo', 'wallaby', 'roo'] },
      traps: [{ match: ['rabbit', 'a rabbit', 'frog', 'a frog', 'hare', 'a hare', 'koala', 'a koala', 'cricket', 'a cricket', 'grasshopper', 'a grasshopper'], msg: `A rabbit jumps, but it has no pocket. Which animal from Australia carries its baby in a pouch?` }],
      glyph: '🧥'
    },
    tags: ['animals', 'classic'], links: ['rid-owl']
  },

  /* ---------- fair ---------- */
  {
    id: 'rid-footsteps', title: 'Leaving Things Behind', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `Take one, and you leave one behind. Take a hundred, and you leave a hundred behind. The more of these you take, the longer the trail you leave.\n\nWhat are they?`,
    hints: [`You take them without picking anything up.`, `They are left in sand, in mud and in fresh snow.`],
    explain: `**Footsteps** (or footprints): you *take* steps, but they stay where you made them. A traveller's "take" and "leave" are the same act seen from the front and from behind.`,
    data: {
      answer: { text: ['footsteps', 'steps', 'footprints', 'paces', 'strides', 'tracks'] },
      traps: [{ match: ['photographs', 'photos', 'pictures', 'photo', 'photograph', 'memories', 'a memory'], msg: `You can take photos and keep them. What do you take on a walk that stays behind you in the sand?` }],
      glyph: '🥾'
    },
    tags: ['walking', 'classic'], links: ['rid-shadow']
  },
  {
    id: 'rid-echo', title: 'The Voice in the Canyon', diff: 2,
    source: 'A verse of our own in the old manner.',
    text: `I have no mouth, and yet I answer you;<br>I have no ears, and yet I hear.<br>I never start, but I always end,<br>And every word I use is yours.\n\nWhat am I?`,
    hints: [`I need a wall, a cliff or an empty hall.`, `Call out in a big empty space, and I reply with your own words.`],
    explain: `An **echo**: sound that bounces off a wall or a hillside and comes back to you a moment late. The Greeks told of a nymph, Echo, who lost her own voice and could only repeat the last words of others.`,
    data: {
      answer: { text: ['echo', 'echoes'] },
      traps: [{ match: ['voice', 'a voice', 'parrot', 'a parrot', 'ghost', 'a ghost', 'mirror', 'a mirror', 'sound', 'a sound'], msg: `Warm — but this one has no body at all, and needs a hillside or a wall to work.` }],
      glyph: '👂'
    },
    tags: ['sound', 'nature', 'verse'], links: ['rid-shadow']
  },
  {
    id: 'rid-shadow', title: 'Always Behind Me', diff: 2,
    source: 'A verse of our own in the old manner.',
    text: `I am with you when the sun is bright,<br>But I am gone in the dead of night.<br>I copy every move you make,<br>But leave no footprint in your wake.<br>I'm long at sunrise, short at noon.\n\nWhat am I?`,
    hints: [`You cannot lose me, but a cloud or the dark can hide me.`, `I am made whenever something stands between you and the light.`],
    explain: `A **shadow**. It copies you exactly, is long when the sun is low, shortest at noon, and vanishes when there is no light for it to be made from. Peter Pan managed to lose his; the rest of us never have.`,
    data: {
      answer: { text: ['shadow', 'silhouette'] },
      traps: [{ match: ['reflection', 'a reflection', 'mirror', 'a mirror', 'echo', 'an echo', 'ghost', 'a ghost'], msg: `A reflection copies you, but it does not get long at sunset, and it does not follow you round a corner.` }],
      glyph: '☀'
    },
    tags: ['light', 'nature', 'verse'], links: ['rid-echo', 'rid-stars']
  },
  {
    id: 'rid-candle', title: 'The Lady in the White Gown', diff: 2,
    source: 'A new verse in the manner of the old English nursery riddle of Little Nancy Etticoat.',
    text: `A lady in a long white gown<br>Wears a little flame for a crown.<br>She has no hands and she has no feet,<br>Yet she comes to every birthday treat;<br>She stands up straight and lights the night,<br>But every hour she is a smaller sight.\n\nWho is she?`,
    hints: [`Her crown is not gold; it flickers, and it is hot.`, `You blow her out before you cut the cake.`],
    explain: `A **candle**: white wax for the gown, a flame for the crown, and she gives light by burning herself away. English children have long been told riddles of this shape about a small white lady who gets shorter the longer she stands.`,
    data: {
      answer: { text: ['candle', 'tea light', 'tealight'] },
      traps: [{ match: ['lamp', 'a lamp', 'torch', 'a torch', 'match', 'a match', 'lantern', 'a lantern', 'fire', 'a fire', 'flame', 'a flame'], msg: `Close — but this one is made of wax, and she burns *down* as she works.` }],
      glyph: '👗'
    },
    tags: ['objects', 'light', 'verse'], links: ['rid-shadow', 'rid-stars']
  },
  {
    id: 'rid-stamp', title: 'The Traveller in the Corner', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `I sit quietly in a corner, but I travel all over the world. I am licked, I am stuck down fast, and I pay the whole fare for a journey that I never steer.\n\nWhat am I?`,
    hints: [`I am small and I cost a few coins.`, `I am stuck onto a letter or a parcel, and a machine marks me with an inky pattern.`],
    explain: `A **postage stamp**. It is stuck in the corner of an envelope, and the envelope goes round the world while the stamp stays put. The first sticky stamp, the Penny Black, went on sale in Britain in 1840.`,
    data: {
      answer: { text: ['stamp', 'postage', 'penny black'] },
      traps: [{ match: ['letter', 'a letter', 'envelope', 'an envelope', 'parcel', 'a parcel', 'postcard', 'a postcard', 'postman', 'a postman'], msg: `That is what travels. What sits in its corner and pays for the trip?` }],
      glyph: '🌍'
    },
    tags: ['objects', 'post', 'classic'], links: ['rid-map']
  },
  {
    id: 'rid-hole', title: 'The More You Take', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `Take a spoonful out of me, and I am bigger than I was before. Take a shovelful, and I am bigger still.\n\nWhat am I?`,
    hints: [`You make me by taking something away, not by adding anything.`, `Dig one, and you have made one; fill it in, and it is gone.`],
    explain: `A **hole**: it *is* the missing earth (or cheese, or sock), so every scoop you remove makes it larger. A hole is a thing made entirely of what is not there.`,
    data: {
      answer: { text: ['hole', 'pit', 'ditch', 'trench', 'crater'] },
      traps: [{ match: ['nothing', 'space', 'emptiness', 'void', 'a void', 'debt', 'a debt', 'appetite', 'hunger'], msg: `Warm — you could dig it with a spade. What is it called?` }],
      glyph: '🥄'
    },
    tags: ['paradox', 'classic'], concepts: ['lateral'], links: ['rid-darkness']
  },
  {
    id: 'rid-darkness', title: 'The More of It', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `You cannot see it. But the more of it there is, the less you can see of everything else. It does not help to open your eyes wider, and a flick of a switch is all it takes to send it away.\n\nWhat is it?`,
    hints: [`It comes every evening, and it goes when the sun comes back.`, `It is really the lack of light.`],
    explain: `**Darkness**. Strictly speaking it is not a thing but the lack of one, light, which is why a single candle is enough to make a whole room of it disappear.`,
    data: {
      answer: { text: ['darkness', 'dark', 'night', 'blackness', 'gloom', 'nightfall', 'pitch dark', 'pitch black', 'nighttime', 'night time', 'total darkness'], exact: true },
      traps: [{ match: ['fog', 'mist', 'smoke', 'a fog', 'a mist', 'eyes', 'blindness', 'cloud', 'clouds'], msg: `Fog hides things, but it does not vanish when you flip a switch. What does?` }],
      glyph: '👁'
    },
    tags: ['light', 'paradox', 'classic'], links: ['rid-hole', 'rid-candle']
  },
  {
    id: 'rid-tomorrow', title: 'Always Coming', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `It is always on its way to you, and yet it never arrives. When at last it does get here, it has changed its name.\n\nWhat is it?`,
    hints: [`It is a day, or the idea of one.`, `When it comes, everyone calls it "today".`],
    explain: `**Tomorrow**: always one day away, and as soon as it arrives it is *today*, and there is a new tomorrow on the horizon. This is why "I will do it tomorrow" is so comfortable to say.`,
    data: {
      answer: { text: ['tomorrow', 'the next day', 'the day after'] },
      traps: [{ match: ['future', 'the future', 'time', 'christmas', 'the weekend', 'weekend', 'friday'], msg: `Near — but this one changes its name the moment it arrives. Which day is it?` }],
      glyph: '🚶'
    },
    tags: ['time', 'paradox', 'classic'], links: ['rid-age']
  },
  {
    id: 'rid-acorn', title: 'A Giant in a Cup', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I am no bigger than your thumb, and I wear a little wooden cap. Squirrels bury me for the winter and forget where they put me. But if I am lucky, I turn into something that will stand for three hundred years.\n\nWhat am I?`,
    hints: [`I am a seed, and I grow on a very large tree.`, `The tree I become is a famous one for building ships.`],
    explain: `An **acorn**, the seed of the oak. It is small enough to lose in a pocket, and inside it is everything needed to make a tree that may stand for centuries. Squirrels and jays bury far more acorns than they dig up again, and so plant a good part of every oak wood.`,
    data: {
      answer: { text: ['acorn', 'oak seed', 'oak nut'], exact: true },
      traps: [{ match: ['seed', 'a seed', 'nut', 'a nut', 'chestnut', 'a chestnut', 'conker', 'a conker', 'pine cone', 'a pine cone', 'walnut', 'hazelnut'], msg: `Warm — which seed comes in a little wooden cup, and grows into an oak?` }],
      glyph: '🧢'
    },
    tags: ['plants', 'nature'], links: ['rid-tree']
  },
  {
    id: 'rid-eyes', title: 'Two Sisters Who Never Meet', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `Two sisters live in the same house and look at the same world all day long. They work as a pair, and they go to sleep at the very same moment. Yet they can never see each other, unless they stand in front of a mirror.\n\nWho are they?`,
    hints: [`They open in the morning and close at night.`, `You have two of them on your face.`],
    explain: `Your **eyes**. They look at the same world side by side and can never look at each other; that takes a mirror. Having two of them also gives you a sense of depth, since each sees the world from a slightly different place.`,
    data: {
      answer: { text: ['eyes', 'your eyes', 'two eyes', 'a pair of eyes', 'my eyes', 'eyeballs'] },
      traps: [{ match: ['ears', 'your ears', 'the ears', 'hands', 'your hands', 'lips', 'twins', 'sisters', 'nostrils'], msg: `Ears never meet either — but which pair *looks at* the world?` }],
      glyph: '👭'
    },
    tags: ['body', 'senses'], links: ['rid-nose']
  },
  {
    id: 'rid-bubble', title: 'A Skin Full of Breath', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I am a thin skin with nothing inside me but a breath. I float on the breeze, I wear all the colours of the rainbow, and if you poke me I am gone with a *pop*.\n\nWhat am I?`,
    hints: [`You make me with soapy water and a ring.`, `Children chase me across the garden.`],
    explain: `A **bubble**: a skin of soapy water wrapped around a bit of air. The colours come from light bouncing off the front and the back of that very thin skin and the two reflections mixing.`,
    data: {
      answer: { text: ['bubble'] },
      traps: [{ match: ['balloon', 'a balloon', 'ball', 'a ball', 'cloud', 'a cloud'], msg: `A balloon pops too — but it is not made of soap, and it does not wear all the colours of the rainbow.` }],
      glyph: '🌀'
    },
    tags: ['objects', 'play'], links: ['rid-kite']
  },
  {
    id: 'rid-kite', title: 'Held by a String', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I have a tail, but I am not an animal. I fly without wings, and I stay up only because someone is holding me back. On a windy day I am the happiest thing in the sky.\n\nWhat am I?`,
    hints: [`You need a windy day and a hill.`, `I fly on the end of a long string.`],
    explain: `A **kite**. It rises because the wind pushes against it, and the string keeps it at the right slant, which is why it seems to fly against the pull. Kites were flown in China more than two thousand years ago.`,
    data: {
      answer: { text: ['kite'] },
      traps: [{ match: ['bird', 'a bird', 'balloon', 'a balloon', 'plane', 'a plane', 'aeroplane', 'glider', 'a glider', 'paper plane'], msg: `A glider flies without wings too — but no one holds it by a string. What does?` }],
      glyph: '🌤'
    },
    tags: ['objects', 'play', 'wind'], links: ['rid-bubble']
  },
  {
    id: 'rid-bridge', title: 'A Road Over Water', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I take you over the river with dry feet, and I have never taken a step myself. People walk on my back, and boats pass under my arms.\n\nWhat am I?`,
    hints: [`I connect one bank with the other.`, `Some of me are made of stone and some of iron; a few of me are in London.`],
    explain: `A **bridge**. The oldest ones were tree trunks laid across streams. A stone arch stands because each stone is held in place by the weight of its neighbours pressing it into the curve.`,
    data: {
      answer: { text: ['bridge', 'footbridge', 'viaduct'] },
      traps: [{ match: ['boat', 'a boat', 'ferry', 'a ferry', 'ship', 'a ship'], msg: `A ferry takes you across too, but it moves. This one has never taken a step.` }, { match: ['tunnel', 'a tunnel'], msg: `A tunnel goes *under* the river. This one goes over it.` }],
      glyph: '🛶'
    },
    tags: ['objects', 'places'], links: ['rid-map']
  },
  {
    id: 'rid-bell', title: 'The Louder You Hit', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `The harder you strike me, the louder I cry out, and yet I never complain. I hang high in the air, and I call people to church, to school and to dinner.\n\nWhat am I?`,
    hints: [`I hang from a frame, and I have a clapper inside me.`, `I go *ding-dong*.`],
    explain: `A **bell**. Strike it and it rings. A good bell sings several notes at once, and bell-founders spend as long over its shape as over its metal.`,
    data: {
      answer: { text: ['bell', 'gong', 'drum', 'doorbell', 'cowbell', 'chime'] },
      traps: [{ match: ['cat', 'a cat', 'dog', 'a dog', 'child', 'a child', 'baby', 'a baby', 'person', 'a person'], msg: `Ha — they cry out too. But I hang up high, and I am struck.` }],
      glyph: '⛪'
    },
    tags: ['objects', 'sound', 'classic'], links: ['rid-echo']
  },
  {
    id: 'rid-cloud', title: 'Wings and Tears', diff: 2,
    source: 'A verse of our own in the old manner.',
    text: `I have no wings, and yet I fly;<br>I have no eyes, and yet I cry.<br>I never walk, but travel far,<br>And shade the ground from sun and star.\n\nWhat am I?`,
    hints: [`I float up high, and sometimes I am grey and heavy.`, `My tears are rain.`],
    explain: `A **cloud**: a drifting mass of tiny droplets of water. The "tears" are the rain it lets fall. Riddle-makers in many languages have played with the same picture: something that flies without wings and weeps without eyes.`,
    data: {
      answer: { text: ['cloud', 'raincloud'] },
      traps: [{ match: ['bird', 'a bird', 'wind', 'the wind', 'fog', 'smoke', 'a kite', 'kite', 'plane'], msg: `Fog and smoke drift too, but which drifter weeps rain?` }],
      glyph: '😢'
    },
    tags: ['weather', 'nature', 'verse'], links: ['rid-rain']
  },
  {
    id: 'rid-rainbow', title: 'The Bridge Nobody Crosses', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I come after the rain, when the sun is behind you, and I stretch across the sky in many colours. I have two ends, but nobody has ever found either one. Every step you take toward me, I take one away.\n\nWhat am I?`,
    hints: [`I appear when it rains in one place and the sun shines in another.`, `Red is on my outer edge, and violet on my inner edge.`],
    explain: `A **rainbow**. Sunlight is bent and reflected inside raindrops, and each colour leaves at its own angle. So it is not a thing in a place at all: you and your rainbow are a pair, and someone standing next to you sees a slightly different one. That is why nobody can reach its end.`,
    data: {
      answer: { text: ['rainbow'] },
      traps: [{ match: ['sun', 'the sun', 'bridge', 'a bridge', 'arch', 'an arch', 'cloud', 'a cloud', 'sunset', 'a sunset'], msg: `Close — a bridge of colour that only comes after rain. What is it called?` }],
      glyph: '🌦'
    },
    tags: ['weather', 'nature', 'light', 'classic'], links: ['rid-rain', 'rid-cloud']
  },
  {
    id: 'rid-snowflake', title: 'No Two Alike', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I fall from the sky in company with millions, and yet each one of us is different. I am six-armed, a single scrap of frozen lace, and when I land on your warm glove I am gone in a few seconds.\n\nWhat am I?`,
    hints: [`I am not the whole of the snowfall, only one bit of it.`, `I am a tiny ice crystal with six points.`],
    explain: `A **snowflake**. Its six-fold shape comes from the way water molecules lock together into ice, and the exact pattern depends on the temperature and the damp along its fall, so it is unlikely that two big flakes have ever been alike. Wilson Bentley, a Vermont farmer, began photographing them in 1885.`,
    data: {
      answer: { text: ['snowflake', 'snow flake', 'snow crystal', 'ice crystal'] },
      traps: [{ match: ['snow', 'hail', 'sleet', 'ice', 'frost', 'snowball', 'a snowball', 'hailstone', 'a hailstone'], msg: `Snow is the crowd. Which *one* of them has six arms?` }],
      glyph: '🥶'
    },
    tags: ['weather', 'nature', 'winter'], links: ['rid-snowman', 'rid-rain']
  },
  {
    id: 'rid-owl', title: 'The Night Question', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I sleep by day and wake by night, and all night long I ask the same question of anyone who will listen, though nobody has ever answered me. I have big round eyes, soft feathers and a face like a dish.\n\nWhat am I?`,
    hints: [`I am a bird of the night, and my question is a single word.`, `The word is "Who?"`],
    explain: `An **owl**. The question is the hoot of the tawny owl. An owl's eyes are fixed in its skull and cannot swivel, so it turns its whole head, up to about 270 degrees, to see what is behind it.`,
    data: {
      answer: { text: ['owl', 'barn owl', 'tawny owl', 'snowy owl'] },
      traps: [{ match: ['bat', 'a bat', 'bird', 'a bird', 'cat', 'a cat', 'nightingale', 'a nightingale', 'hawk', 'a hawk'], msg: `A bird of the night, yes, but which one is famous for asking "who"?` }],
      glyph: '❓'
    },
    tags: ['animals', 'nature', 'night'], links: ['rid-moon']
  },
  {
    id: 'rid-glove', title: 'Fingers Without Bones', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `I have four fingers and a thumb, but I am not alive. I have never held anything of my own. I keep the cold out, or the ball in.\n\nWhat am I?`,
    hints: [`People wear me on their hands.`, `I come in pairs, and I often get lost singly.`],
    explain: `A **glove**. It does everything a hand does, when a hand is inside, and nothing at all when it is not.`,
    data: {
      answer: { text: ['glove', 'a pair of gloves', 'baseball glove', 'mitt', 'oven glove', 'gauntlet', 'boxing glove', 'leather glove'], exact: true },
      traps: [{ match: ['hand', 'a hand', 'hands'], msg: `A hand is alive and has bones. What do people *wear* on one?` }, { match: ['mitten', 'a mitten', 'mittens'], msg: `A mitten has a thumb, but the four fingers share one space. This one has a room for each finger.` }],
      glyph: '✋'
    },
    tags: ['objects', 'clothes', 'classic'], links: ['rid-neck']
  },
  {
    id: 'rid-pencil', title: 'The Shrinking Writer', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I live in a wooden coat, and I have a "lead" heart that is not lead. The more I work, the shorter I get. Yet I can undo my own mistakes, if you turn me over.\n\nWhat am I?`,
    hints: [`I am a writing tool that comes to a point, and I need sharpening, not ink.`, `I have a little rubber on my other end.`],
    explain: `A **pencil**. The "lead" in the middle is really graphite, a form of carbon, and it got its name because people once mistook graphite for lead. The rubber at the other end lets it unwrite what it has written.`,
    data: {
      answer: { text: ['pencil'] },
      traps: [{ match: ['pen', 'a pen', 'biro', 'ballpoint', 'a ballpoint', 'crayon', 'a crayon', 'chalk', 'a piece of chalk', 'marker', 'a marker', 'felt tip'], msg: `A pen does not shrink as it writes, and it cannot be rubbed out. Which writer can?` }],
      glyph: '📝'
    },
    tags: ['objects', 'school'], links: ['rid-blackboard', 'rid-hole']
  },
  {
    id: 'rid-pillow', title: 'Head Lost by Day', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `Every night it gets its head back, and every morning it loses it again. It is soft, it never complains, and children like to throw it at each other.\n\nWhat is it?`,
    hints: [`It lives on a bed.`, `It is stuffed with feathers or foam, and your head rests on it.`],
    explain: `A **pillow**: the head is yours, and you leave it on the pillow at night and take it away in the morning. A pillow fight is a very mild sort of battle, and one of the few in which nobody minds losing.`,
    data: {
      answer: { text: ['pillow', 'cushion'] },
      traps: [{ match: ['bed', 'a bed', 'blanket', 'a blanket', 'duvet', 'a duvet', 'mattress', 'a mattress', 'hat', 'a hat', 'sheet', 'a sheet'], msg: `That is on the bed — but what on the bed does your head rest on?` }],
      glyph: '💭'
    },
    tags: ['objects', 'home', 'classic'], links: ['rid-bed']
  },
  {
    id: 'rid-fence', title: 'All the Way Round', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `It goes all the way around the garden, and yet it has never moved an inch. It keeps some things in and other things out, and it says "keep off" without ever opening its mouth.\n\nWhat is it?`,
    hints: [`It is made of posts and boards, or of wire.`, `Neighbours chat over it.`],
    explain: `A **fence**, though a hedge or a wall would run round a garden just as well. All three "go" everywhere without ever taking a step.`,
    data: {
      answer: { text: ['fence', 'hedge', 'wall', 'railings'] },
      traps: [{ match: ['dog', 'a dog', 'path', 'a path', 'gate', 'a gate', 'gardener', 'a gardener'], msg: `A dog can run around a garden, but this one never moves an inch.` }],
      glyph: '🌷'
    },
    tags: ['objects', 'garden', 'classic'], links: ['rid-stairs']
  },
  {
    id: 'rid-stairs', title: 'Up and Down and Nowhere', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I go up and I go down, yet I never leave the house. I have hundreds of steps, but I have never been anywhere. People hold my rail when they climb me, and I creak when they sneak.\n\nWhat am I?`,
    hints: [`I am found in nearly every house of more than one floor.`, `You climb me to get to the bedroom.`],
    explain: `A **staircase**. It goes up and down, and never stirs from its spot; and everybody knows which step is the one that creaks.`,
    data: {
      answer: { text: ['stairs', 'staircase', 'stairway', 'steps', 'a flight of stairs'] },
      traps: [{ match: ['ladder', 'a ladder', 'lift', 'a lift', 'elevator', 'an elevator', 'escalator', 'an escalator', 'hill', 'a hill', 'ramp', 'a ramp'], msg: `Close — but this one has steps, and *you* do the climbing.` }],
      glyph: '🚪'
    },
    tags: ['objects', 'home'], links: ['rid-fence']
  },
  {
    id: 'rid-river', title: 'A Bed, a Mouth and Two Banks', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `I have a mouth, but I never speak. I have a bed, but I never sleep. I have banks, yet I have no money. I run all day and never grow tired, and I have never once walked.\n\nWhat am I?`,
    hints: [`I flow from the hills to the sea.`, `My mouth is at the sea, and my source is in the hills.`],
    explain: `A **river**: its *mouth* is where it enters the sea, its *bed* is the channel the water lies in, its *banks* are its two sides, and it "runs" without a single leg.`,
    data: {
      answer: { text: ['river', 'stream'] },
      traps: [{ match: ['lake', 'a lake', 'sea', 'the sea', 'ocean', 'the ocean', 'pond', 'a pond', 'bank', 'a bank'], msg: `A lake has a bed, but it lies still. Which one *runs* all the way to the sea?` }],
      glyph: '👄'
    },
    tags: ['nature', 'places', 'classic'], links: ['rid-bridge']
  },
  {
    id: 'rid-hourglass', title: 'Always Running Out', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I am made of glass and sand, and I am always running out. When my top is empty, someone must turn me over, and then I start again. I have no hands, and yet I tell the time.\n\nWhat am I?`,
    hints: [`I am shaped like a figure eight standing upright.`, `Sand trickles through my narrow waist.`],
    explain: `An **hourglass**: sand trickling through a narrow neck, grain by grain. Some measure an hour, others (egg timers) only three minutes. Sailors once used a half-hour glass to keep time on watch.`,
    data: {
      answer: { text: ['hourglass', 'hour glass', 'sand timer', 'egg timer', 'sandglass', 'sand clock'] },
      traps: [{ match: ['clock', 'a clock', 'watch', 'a watch', 'sundial', 'a sundial', 'timer', 'a timer', 'stopwatch'], msg: `A clock has hands, and I have none. Which timepiece is made of glass and sand?` }],
      glyph: '🏖'
    },
    tags: ['objects', 'time'], links: ['rid-hands']
  },
  {
    id: 'rid-circle', title: 'No Beginning, No End', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `I have no beginning, no end and not a single corner. Follow me with your finger, and you come back to where you started.\n\nWhat am I?`,
    hints: [`A ring or a wheel is one of me, and so is the rim of a plate.`, `A compass draws me in a single turn.`],
    explain: `A **circle**, whose edge has no start and no finish. A ring, a loop and a wedding band are all circles in disguise, which is why the ring has been the sign of something that lasts for ever.`,
    data: {
      answer: { text: ['circle', 'ring', 'loop', 'wheel', 'disc'] },
      traps: [{ match: ['square', 'a square', 'line', 'a line', 'triangle', 'a triangle', 'rectangle', 'a rectangle', 'sphere', 'a sphere', 'ball', 'a ball'], msg: `A square has four corners, and a line has two ends. Which shape has neither?` }],
      glyph: '📐'
    },
    tags: ['shapes', 'classic'], links: ['rid-coin']
  },
  {
    id: 'rid-battery', title: 'Lifeless, Yet It Dies', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `It has never been alive, and yet it can die. It goes flat when it is used up, and sometimes it can be brought back to life with a cable and a socket. It gives your phone, your torch and your toy car the strength to work.\n\nWhat is it?`,
    hints: [`You have to charge it or change it.`, `It sits inside a torch, a phone or a remote control.`],
    explain: `A **battery**, which "dies" when its chemicals are spent. A rechargeable one can be "revived" many hundreds of times, though a little less well each time.`,
    data: {
      answer: { text: ['battery', 'batteries', 'accumulator', 'power pack'] },
      traps: [{ match: ['phone', 'a phone', 'torch', 'a torch', 'remote', 'a remote', 'remote control', 'plug', 'a plug', 'charger', 'a charger', 'toy', 'a toy'], msg: `That is what it is put *in*. What gives it the power?` }],
      glyph: '💀'
    },
    tags: ['objects', 'technology'], links: ['rid-light']
  },
  {
    id: 'rid-light', title: 'It Fills a Room and Takes No Space', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `I can fill a whole room to the corners, and yet I take up no space at all. You cannot touch me, but without me you cannot see. I arrive the moment you press a switch.\n\nWhat am I?`,
    hints: [`I weigh nothing, and nothing in the world travels faster than I do.`, `A single candle makes me, and the sun makes far more.`],
    explain: `**Light**. A single candle can fill a large room with it, and adding a second, a third and a hundredth never uses up any of the room.`,
    data: {
      answer: { text: ['light', 'sunlight', 'daylight', 'lamplight', 'candlelight', 'a beam of light', 'brightness', 'starlight', 'moonlight', 'light rays', 'bright light', 'electric light', 'artificial light', 'natural light', 'white light', 'warm light', 'just light', 'light itself', 'pure light', 'a light', 'the light of a lamp', 'the light of a candle', 'the sunlight'], exact: true },
      traps: [{ match: ['air', 'the air', 'sound', 'music', 'smell', 'a smell', 'heat', 'warmth', 'gas', 'a gas', 'water', 'darkness'], msg: `Air takes up space, and you cannot see by it. What do you switch on?` }],
      glyph: '🔘'
    },
    tags: ['light', 'paradox', 'classic'], links: ['rid-darkness', 'rid-battery']
  },
  {
    id: 'rid-cards', title: 'Thirteen Hearts', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `I have thirteen hearts, but no blood. I have four kings, but no kingdom. I am shuffled, cut and dealt many times a day, and people bluff with a straight face when they hold me.\n\nWhat am I?`,
    hints: [`I am played with, and sometimes I am cheated with.`, `I have four suits, and fifty-two of me make a set.`],
    explain: `A **pack of cards**: thirteen hearts (ace to king), four kings, and not a drop of blood among them. The hearts, spades, diamonds and clubs of the modern pack took their shape in France in the late fifteenth century, and have spread almost everywhere since.`,
    data: {
      answer: { text: ['deck of cards', 'cards', 'a deck', 'a pack'] },
      traps: [{ match: ['chess', 'chess set', 'a chess set', 'chessboard', 'tarot', 'dominoes', 'a set of dominoes'], msg: `Chess has kings too, but no hearts. What has thirteen of those?` }, { match: ['heart', 'a heart', 'king', 'a king', 'hearts'], msg: `Those are things I *have*. What am I?` }],
      glyph: '💔'
    },
    tags: ['objects', 'games', 'classic']
  },
  {
    id: 'rid-bank', title: 'Branches without Leaves', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `I have branches on nearly every high street, yet I have never had a leaf, a trunk or a root. People keep their savings with me, and one of my branches has a hole in the wall that hands out money, a fruit no orchard grows.\n\nWhat am I?`,
    hints: [`Think of a place, not a plant.`, `You can open an account with me.`],
    explain: `A **bank**. It has "branches" (its offices in other towns), and not one of them is a tree.`,
    data: {
      answer: { text: ['bank', 'building society'] },
      traps: [{ match: ['tree', 'a tree', 'oak', 'an oak', 'shop', 'a shop', 'post office', 'a post office', 'store', 'a store', 'cash machine', 'an atm', 'atm'], msg: `A tree has branches and leaves. This one has branches and money.` }],
      glyph: '🌿'
    },
    tags: ['puns', 'money', 'classic'], links: ['rid-coin']
  },
  {
    id: 'rid-brain', title: 'Sharper with Use', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `A knife grows blunter with use, a pencil grows shorter, a shoe grows thinner. But there is one thing that only gets sharper the more you use it. You have exactly one, and you are using it right now.\n\nWhat is it?`,
    hints: [`It is not a tool, and it is not sharp in the ordinary sense.`, `It sits inside your head.`],
    explain: `Your **brain** (or your mind, or your wits). Practice, puzzles and curiosity keep it keen; the wits of a puzzle-lover need no whetstone.`,
    data: {
      answer: { text: ['brain', 'your brain', 'mind', 'your mind', 'wits', 'your wits', 'intellect', 'my brain', 'intelligence', 'memory', 'the human brain', 'my mind', 'my wits'], exact: true },
      traps: [{ match: ['knife', 'a knife', 'blade', 'a blade', 'sword', 'a sword', 'axe', 'an axe', 'pencil', 'a pencil', 'razor', 'a razor', 'scissors'], msg: `Those grow *blunter* with use. What grows sharper?` }],
      glyph: '🗡'
    },
    tags: ['body', 'paradox', 'classic'], links: ['rid-eyes']
  },
  {
    id: 'rid-future', title: 'In Front but Unseen', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `It is always in front of you, and yet you can never see it. Everybody walks into it, and nobody knows what it holds.\n\nWhat is it?`,
    hints: [`It is not a place on any map.`, `Fortune tellers claim to be able to see it, and weather forecasters try.`],
    explain: `The **future**, always ahead of us and always out of sight. The horizon is in front of you too, but you can see the horizon.`,
    data: {
      answer: { text: ['future', 'what lies ahead', 'the days ahead', 'destiny', 'fate'] },
      traps: [{ match: ['horizon', 'the horizon', 'nose', 'your nose', 'air', 'the air', 'road', 'the road', 'path', 'the path'], msg: `You can see the horizon; this one cannot be seen at all. What lies in front of us in time?` }, { match: ['tomorrow', 'a day', 'next year'], msg: `Tomorrow is a small part of it. What is the whole called?` }],
      glyph: '🔭'
    },
    tags: ['time', 'paradox', 'classic'], links: ['rid-tomorrow']
  },
  {
    id: 'rid-silence', title: 'Broken by Its Own Name', diff: 2,
    source: 'A traditional riddle, told again.',
    text: `I am so fragile that the moment you say my name, I am gone.\n\nWhat am I?`,
    hints: [`You cannot hear me, but you notice me when I am gone.`, `A library is full of me, and a rock concert is not.`],
    explain: `**Silence.** Once you say the word, silence has been broken. It is one of the rare riddles that cheats and tells the truth at the same time.`,
    data: {
      answer: { text: ['silence', 'quiet', 'quietness', 'hush'] },
      traps: [{ match: ['glass', 'a glass', 'egg', 'an egg', 'promise', 'a promise', 'heart', 'a heart', 'ice', 'vase', 'a vase', 'mirror', 'a mirror', 'a secret', 'secret'], msg: `Those break when you drop them. This one breaks when you *speak*.` }],
      glyph: '💬'
    },
    tags: ['paradox', 'sound', 'classic'], links: ['rid-word', 'rid-echo']
  },
  {
    id: 'rid-tide', title: 'Twice a Day', diff: 2,
    source: 'A new riddle in the old manner.',
    text: `I come in twice a day, and I go out twice a day, and I keep to my timetable without a watch. I cover the beach and I uncover it, and the moon has something to do with me.\n\nWhat am I?`,
    hints: [`Look at the sea, not the sky.`, `A sandcastle built too low will be gone by the time I return.`],
    explain: `The **tide**, the slow rise and fall of the sea, chiefly caused by the pull of the Moon (and the Sun). In most places there are two high tides a day, roughly twelve and a half hours apart.`,
    data: {
      answer: { text: ['tide', 'ebb and flow'] },
      traps: [{ match: ['waves', 'a wave', 'wave', 'the sea', 'sea', 'the ocean', 'ocean', 'water', 'the water', 'current', 'a current'], msg: `Waves come every few seconds. This one keeps a timetable of hours.` }],
      glyph: '🐚'
    },
    tags: ['nature', 'sea', 'time'], links: ['rid-moon', 'rid-river']
  },
  {
    id: 'rid-lock', title: 'Does Not Bark, Does Not Bite', diff: 2,
    source: 'A traditional Russian riddle, told again in our own words.',
    text: `It never barks and it never bites, yet it keeps strangers out of the house better than any guard dog.\n\nWhat is it?`,
    hints: [`It is small and made of metal, and it sits on the door.`, `The key is its master.`],
    explain: `A **lock**. A well-known Russian riddle says of it that it neither barks nor bites and yet will not let anyone into the house.`,
    data: {
      answer: { text: ['lock', 'padlock', 'deadbolt'] },
      traps: [{ match: ['dog', 'a dog', 'guard dog'], msg: `The dog is exactly what it is *not* — a dog barks and bites.` }, { match: ['door', 'a door', 'gate', 'a gate', 'fence', 'a fence', 'wall', 'a wall', 'alarm', 'an alarm', 'burglar alarm', 'key', 'a key'], msg: `That is what needs guarding, or what opens it. What fastens the door shut?` }],
      glyph: '🐕'
    },
    tags: ['objects', 'russian', 'classic'], links: ['rid-keys', 'rid-scissors']
  },
  {
    id: 'rid-fir', title: 'Winter and Summer, One Colour', diff: 2,
    source: 'A traditional Russian riddle, told again in our own words.',
    text: `It is the same colour in winter and in summer. While its neighbours drop their leaves and stand bare, it keeps every one of its needles.\n\nWhat is it?`,
    hints: [`It is a tree with needles instead of leaves.`, `One of them comes indoors in December and wears lights.`],
    explain: `A **fir** (or a spruce or pine: any evergreen conifer). In the old Russian riddle it is a single line: "the same colour winter and summer".`,
    data: {
      answer: { text: ['fir', 'fir tree', 'spruce', 'pine', 'evergreen', 'conifer', 'christmas tree'] },
      traps: [{ match: ['oak', 'an oak', 'tree', 'a tree', 'maple', 'a maple', 'birch', 'a birch', 'beech', 'grass'], msg: `An oak drops its leaves in autumn. Which tree keeps its needles?` }],
      glyph: '🍃'
    },
    tags: ['plants', 'russian', 'classic'], links: ['rid-tree']
  },

  /* ---------- tricky ---------- */
  {
    id: 'rid-dog-woods', title: 'How Far Into the Wood', diff: 3,
    source: 'A traditional brain-teaser, told again.',
    text: `A dog runs straight into a thick wood, never turning aside and never stopping to sniff.\n\nHow far into the wood can it possibly go?`,
    hints: [`Think about what happens to the dog when it reaches the middle.`, `After a certain point every step it takes is a step *out* of the wood.`],
    explain: `**Halfway.** After the middle of the wood, each step takes it nearer the far edge — that is, out. The dog is the one character in the riddle who is having a good time.`,
    data: {
      answer: { text: ['halfway', 'half', 'to the middle', 'in the middle', 'the middle of the wood', 'to the centre', 'to the center'] },
      traps: [{ match: ['all the way', 'the whole way', 'to the other side', 'as far as it likes', 'as far as it wants', 'forever', 'a mile', 'all the way through', 'as far as it can'], msg: `To go all the way in, it would have to come out the other side — and then it is not in the wood any more.` }],
      glyph: '🌲'
    },
    tags: ['trick', 'animals', 'classic'], concepts: ['lateral']
  },
  {
    id: 'rid-yawn', title: 'Catching, but Not a Cold', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `It is catching, but it is not an illness. One person starts it and half the room joins in, even those who were not tired a moment ago. It is said that reading about it is enough.\n\nWhat is it?`,
    hints: [`It comes with a wide-open mouth and a deep breath.`, `It is a sign of being sleepy or bored.`],
    explain: `A **yawn**. Scientists still argue about why yawns spread from one person to the next; dogs seem to catch them from people, and reading about one is often enough. Have you yawned yet?`,
    data: {
      answer: { text: ['yawn', 'yawning'] },
      traps: [{ match: ['laughter', 'a laugh', 'laugh', 'laughing', 'a smile', 'smile', 'smiling'], msg: `Laughter is catching too, but this one is a sign of being tired or bored.` }, { match: ['cold', 'a cold', 'flu', 'the flu', 'sneeze', 'a sneeze', 'a virus', 'virus'], msg: `The riddle says it is *not* an illness.` }],
      glyph: '📖'
    },
    tags: ['body', 'people', 'classic'], links: ['rid-catch']
  },
  {
    id: 'rid-today', title: 'Yesterday\'s Tomorrow', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `Yesterday, it was tomorrow. Tomorrow, it will be yesterday.\n\nWhat is it right now?`,
    hints: [`Put the three days in a row: yesterday, ?, tomorrow.`, `You are in the middle of it.`],
    explain: `**Today.** Yesterday's tomorrow is today, and tomorrow's yesterday is today as well. The three days are always the same three days, seen from a different side.`,
    data: {
      answer: { text: ['today', 'this day', 'this very day', 'the present', 'now'] },
      traps: [{ match: ['tomorrow', 'yesterday'], msg: `That is one of the two names in the riddle. What is the name of the day *between* them?` }],
      glyph: '📆'
    },
    tags: ['time', 'paradox', 'classic'], links: ['rid-tomorrow']
  },
  {
    id: 'rid-name', title: 'Yours, but Others Use It More', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `It belongs to you from the day you are born, but everybody else uses it a great deal more than you do.\n\nWhat is it?`,
    hints: [`You seldom say it aloud, but other people say it all day.`, `You write it at the bottom of a letter.`],
    explain: `Your **name**. You hear it much more than you say it, and hearing it is the whole point of having one.`,
    data: {
      answer: { text: ['name', 'surname'] },
      traps: [{ match: ['address', 'your address', 'phone number', 'your phone number', 'face', 'your face', 'voice', 'your voice', 'money', 'your money', 'car', 'your car'], msg: `Good thought. But which of your things do others use to *call* you across a room?` }],
      glyph: '🏷'
    },
    tags: ['people', 'classic'], links: ['rid-word']
  },
  {
    id: 'rid-word', title: 'Give It and Keep It', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `You can give it away and still keep it. If you give it and then break it, nobody trusts you again.\n\nWhat is it?`,
    hints: [`It is not something you can hold in your hand.`, `People say "I give you my ___" when they promise something.`],
    explain: `Your **word**: when you give it (in a promise) you must also keep it, and giving it away does not lessen it. It is one of the few things that can be handed over and still be in your pocket.`,
    data: {
      answer: { text: ['your word', 'word', 'a promise', 'a pledge', 'an oath', 'a vow'] },
      traps: [{ match: ['love', 'your love', 'a gift', 'gift', 'heart', 'your heart', 'advice', 'a smile', 'smile', 'a secret', 'secret'], msg: `A kind thought — but what is it that you give when you *promise* something?` }],
      glyph: '🤝'
    },
    tags: ['people', 'paradox', 'classic'], links: ['rid-name', 'rid-silence']
  },
  {
    id: 'rid-corn', title: 'Ears but No Hearing', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `It has ears, and you can shout at it all day without a reply. It stands in fields in summer, in tidy rows, and is often as tall as a person.\n\nWhat is it?`,
    hints: [`It is a plant, and it grows in fields.`, `Its ears are golden, and you can eat them with butter.`],
    explain: `**Corn** (maize). Each cob is an *ear*, a word for a head of grain that comes from a different old word than the ear you hear with. Wheat and barley have ears too, so they are also good answers.`,
    data: {
      answer: { text: ['corn', 'maize', 'sweetcorn', 'cornfield', 'wheat', 'barley', 'rye', 'oats', 'cobs', 'a wheatfield'] },
      traps: [{ match: ['rabbit', 'a rabbit', 'elephant', 'an elephant', 'donkey', 'a donkey', 'person', 'a person', 'dog', 'a dog', 'mouse', 'a mouse'], msg: `That one has ears, and can hear! What has ears but cannot?` }],
      glyph: '🦻'
    },
    tags: ['plants', 'puns', 'classic'], links: ['rid-tree']
  },
  {
    id: 'rid-paint', title: 'A Coat Nobody Wears', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `There is a kind of coat that has no sleeves and is never worn by anyone. You put it on wet, and you must not touch it until it is dry. Walls and doors wear it.\n\nWhat is it?`,
    hints: [`It comes in a tin and goes on with a brush or a roller.`, `The sign says "wet" until it is dry.`],
    explain: `A **coat of paint**, put on wet and left to dry. Anyone who touches it too early wears some, too.`,
    data: {
      answer: { text: ['paint', 'varnish', 'emulsion', 'whitewash'] },
      traps: [{ match: ['raincoat', 'a raincoat', 'overcoat', 'an overcoat', 'coat', 'a coat', 'mac', 'a mac', 'waterproof', 'jacket', 'a jacket'], msg: `A raincoat is worn wet too, but it never dries into a hard skin. What do doors wear?` }],
      glyph: '⚠'
    },
    tags: ['objects', 'puns', 'classic'], links: ['rid-blackboard']
  },
  {
    id: 'rid-breath', title: 'Lighter Than a Feather', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `I weigh less than a feather, but the strongest athlete in the world cannot hold me for more than a few minutes. You take me in and let me out all day, without a thought.\n\nWhat am I?`,
    hints: [`You have me inside you right now.`, `Swimmers and divers have to think about me.`],
    explain: `Your **breath**. Most of us are in trouble after a minute or two, and even trained divers manage only a few minutes. That is one of the reasons a breath is a good symbol of how little of life we control.`,
    data: {
      answer: { text: ['breath', 'breathing'] },
      traps: [{ match: ['air', 'the air', 'wind', 'a puff of wind', 'smoke', 'a balloon', 'balloon', 'a bubble', 'bubble'], msg: `Nearly. But you cannot hold *air* for long, whereas *this* is air you have taken in yourself.` }],
      glyph: '🏊'
    },
    tags: ['body', 'paradox', 'classic'], links: ['rid-heart']
  },
  {
    id: 'rid-night-day', title: 'What Falls and What Breaks', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `Two things happen every single day. One of them falls, but never breaks. The other breaks, but never falls.\n\nWhat are they?`,
    hints: [`You know both from a poem or from the weather report, not from a kitchen floor.`, `One arrives with the dark, and the other with the light.`],
    explain: `**Night** falls and **day** breaks: two ordinary English phrases that a riddle can take literally. Neither is harmed, which is the comforting part.`,
    data: {
      answer: { text: ['night and day', 'day and night', 'night falls and day breaks', 'day breaks and night falls', 'nightfall and daybreak', 'daybreak and nightfall', 'dusk and dawn', 'dawn and dusk', 'night and morning', 'evening and morning', 'night and dawn'] },
      traps: [{ match: ['rain and glass', 'rain and a glass', 'rain and a plate', 'rain and a vase', 'water and glass', 'a glass and rain', 'glass and rain', 'a plate', 'a glass', 'rain', 'snow', 'a vase'], msg: `Those would be the literal answers, but the riddle is not about glass. Think of ordinary phrases in which something *falls* and something else *breaks*.` }],
      glyph: '🍽'
    },
    tags: ['time', 'puns', 'classic'], links: ['rid-tomorrow', 'rid-today']
  },
  {
    id: 'rid-legs', title: 'A Bottom at the Top', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `It has a bottom, but the bottom is at the top. You have two of them, and they are fond of walking.\n\nWhat are they?`,
    hints: [`Think of parts of the body, not of furniture.`, `Where do they start? Which part of you rests on a chair?`],
    explain: `**Legs.** They start at your bottom (your seat) and end at your feet, so the bottom is at the top of them. The riddle plays on the two meanings of "bottom": the lowest part, and the part you sit on.`,
    data: {
      answer: { text: ['legs', 'your legs', 'two legs', 'a pair of legs', 'my legs'] },
      traps: [{ match: ['mountain', 'a mountain', 'hill', 'a hill', 'page', 'a page', 'stairs', 'the stairs', 'staircase', 'ladder', 'a ladder', 'well', 'a well', 'trousers', 'a pair of trousers', 'pants', 'a pair of pants'], msg: `Not quite. Think of what starts at your bottom and carries you around.` }],
      glyph: '🍑'
    },
    tags: ['body', 'puns', 'classic'], links: ['rid-neck', 'rid-nose']
  },
  {
    id: 'rid-left-hand', title: 'In Your Left Hand, Never Your Right', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `Something can be held in your left hand but never in your right, however hard you try.\n\nWhat is it?`,
    hints: [`It is something that belongs to your right side.`, `It is a part of you. Try to hold it with each hand in turn.`],
    explain: `Your **right hand** (or any part of your right arm: your right elbow, wrist, forearm). Your left hand can hold it, but your right hand cannot hold itself.`,
    data: {
      answer: { text: ['right hand', 'right elbow', 'right arm', 'right wrist', 'right forearm', 'right shoulder'] },
      traps: [{ match: ['left hand', 'your left hand', 'the left hand', 'my left hand'], msg: `Your left hand is doing the holding. What is it holding?` }, { match: ['ball', 'a ball', 'glove', 'a glove', 'pen', 'a pen', 'book', 'a book', 'cup', 'a cup', 'bag', 'a bag'], msg: `You could hold that in either hand. What can *only* go in the left?` }],
      glyph: '👈'
    },
    tags: ['body', 'trick', 'classic'], concepts: ['lateral'], links: ['rid-legs']
  },
  {
    id: 'rid-sieve', title: 'A Bowl That Cannot Be Filled', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `I am shaped like a bowl, but you could pour the whole sea into me and I would never be full. I am hopeless at holding water, and yet nearly every kitchen has one of me. I keep back the lumps.\n\nWhat am I?`,
    hints: [`I am a kitchen tool, full of tiny holes.`, `Cooks shake their flour through me, or drain their pasta in me.`],
    explain: `A **sieve** (a colander would do as well): it lets the small things fall through and keeps the big ones behind. "A memory like a sieve" is an old saying for the same idea.`,
    data: {
      answer: { text: ['sieve', 'colander', 'strainer', 'sifter', 'flour sieve', 'a tea strainer', 'a metal sieve', 'a kitchen sieve', 'a kitchen strainer'], exact: true },
      traps: [{ match: ['sponge', 'a sponge'], msg: `A sponge is full of holes too, but it *holds* water. This one lets it all go.` }, { match: ['bucket', 'a bucket', 'bowl', 'a bowl', 'well', 'a well', 'basin', 'a basin', 'pot', 'a pot', 'sink', 'a sink', 'cup', 'a cup'], msg: `A bucket can be filled. This one never fills, however much you pour into it.` }],
      glyph: '🥣'
    },
    tags: ['objects', 'kitchen', 'classic'], links: ['rid-sponge', 'rid-hole']
  },
  {
    id: 'rid-lobster', title: 'Dark Going In, Red Coming Out', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `It goes into the boiling water dark, bluish and greenish, and comes out bright red. It has claws but no fists, and on a restaurant menu it is usually the most expensive item.\n\nWhat is it?`,
    hints: [`It lives in the sea, and it walks sideways or backwards.`, `Its shell hides a red colour that heat brings out.`],
    explain: `A **lobster** (a crab or a prawn changes colour the same way). Its shell holds a red pigment that is locked up in a protein and looks dark blue-green; cooking breaks the protein, and the red is left showing.`,
    data: {
      answer: { text: ['lobster', 'crab', 'crayfish', 'prawn', 'shrimp', 'langoustine', 'crawfish', 'crustacean'] },
      traps: [{ match: ['tomato', 'a tomato', 'beetroot', 'a beetroot', 'beet', 'a beet', 'cherry', 'a cherry', 'strawberry'], msg: `Those are red already. This one *turns* red in the pot.` }],
      glyph: '♨'
    },
    tags: ['animals', 'food', 'classic'], links: ['rid-snail']
  },
  {
    id: 'rid-artichoke', title: 'A Heart That Does Not Beat', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `It has a heart, but the heart has never beaten. It grows in the ground, wears a coat of green scales, and to get to its best part you have to strip its leaves off one by one.\n\nWhat is it?`,
    hints: [`It is a vegetable, and it is really the bud of a huge thistle-like flower.`, `The heart is what lies under the prickly "choke".`],
    explain: `An **artichoke**: the "heart" is the tender base of the flower bud, reached by peeling off the scaly leaves and scraping out the prickly choke. Lettuce, cabbage and celery have hearts as well, but none of them wears green scales.`,
    data: {
      answer: { text: ['artichoke'] },
      traps: [{ match: ['cabbage', 'a cabbage', 'lettuce', 'a lettuce', 'celery', 'palm', 'a palm', 'heart of palm', 'hearts of palm', 'pineapple', 'a pineapple', 'cauliflower', 'onion', 'an onion'], msg: `Those have hearts too, but which one wears a coat of green scales?` }],
      glyph: '💓'
    },
    tags: ['food', 'plants', 'classic'], links: ['rid-heart', 'rid-corn']
  },
  {
    id: 'rid-joke', title: 'Cracked, Made, Told and Played', diff: 3,
    source: 'A traditional riddle, told again.',
    text: `People crack me, make me, tell me and play me. I am not a nut, a bed, a story or a game, though I fit all four verbs. I am at my best when the whole room laughs.\n\nWhat am I?`,
    hints: [`Think of the four verbs first: which single thing goes with all of them?`, `I should get a laugh, or at least a groan.`],
    explain: `A **joke**: you *crack* one, *make* one, *tell* one and *play* one (on somebody). English has a different verb for nearly every way to use a joke, and that is more than it has for most tools.`,
    data: {
      answer: { text: ['joke', 'gag', 'jest'] },
      traps: [{ match: ['nut', 'a nut', 'egg', 'an egg', 'story', 'a story', 'game', 'a game', 'code', 'a code', 'riddle', 'a riddle', 'song', 'a song', 'tune', 'a tune'], msg: `That fits some of the four verbs, but which single thing goes with all of them?` }],
      glyph: '🥜'
    },
    tags: ['puns', 'language', 'classic'], links: ['rid-word']
  },
  {
    id: 'rid-coals', title: 'Black and Much Admired', diff: 3,
    source: 'A new verse in the manner of an old English riddle about coals.',
    text: `Black we are, and men dig deep<br>To bring us up from where we sleep.<br>Horses haul us down the lane;<br>We warm the house through wind and rain.\n\nWhat are we?`,
    hints: [`We are dug out of the ground, and we burn.`, `Our fire once drove the steam engines.`],
    explain: `**Coal**: dug from deep mines, hauled home by horse and cart, and burned in the grate to warm the house. Riddle-makers loved it for being black, dug up from beneath, and yet welcome in every home.`,
    data: {
      answer: { text: ['coal', 'anthracite'] },
      traps: [{ match: ['charcoal', 'wood', 'firewood', 'logs', 'peat', 'oil', 'coke', 'diamonds', 'diamond'], msg: `Close to the fire — but what do miners dig from deep in the ground and burn in the grate?` }],
      glyph: '⛏'
    },
    tags: ['materials', 'verse', 'classic'], links: ['rid-candle']
  },
  {
    id: 'rid-twitchett', title: 'The One-Eyed Lady with a Long Tail', diff: 3,
    source: 'After the English nursery riddle of Old Mother Twitchett, told again in our own words.',
    text: `I have a single eye and a long, thin tail. Every time I dive through the cloth and out again, I leave a bit of my tail behind me.\n\nWhat am I?`,
    hints: [`My one eye is not for seeing.`, `I am made of steel, and my tail is a thread.`],
    explain: `A **needle and thread**: the needle's one eye is the hole for the thread, and each stitch leaves a length of the thread behind in the cloth. An old English nursery rhyme, about Old Mother Twitchett, has a riddle of just this shape.`,
    data: {
      answer: { text: ['needle'] },
      traps: [{ match: ['thread', 'a thread', 'cotton', 'string', 'a piece of string', 'wool', 'yarn', 'a snake', 'snake', 'a comet', 'comet'], msg: `The thread is the tail, but who has the eye?` }],
      glyph: '➰'
    },
    tags: ['objects', 'nursery rhyme', 'classic'], links: ['rid-shoe', 'rid-pencil']
  },
  {
    id: 'rid-dew', title: 'Pearls by Morning', diff: 3,
    source: 'A verse of our own in the old manner.',
    text: `I come by night and make no sound,<br>And hang my pearls on grass and thorn;<br>By noon there's not a trace of me,<br>And no one sees me being born.\n\nWhat am I?`,
    hints: [`You may find me on the grass on a summer morning.`, `The sun makes me disappear.`],
    explain: `**Dew**: water from the air that condenses on cool grass, leaves and spider webs overnight, then dries up in the morning sun. It does not fall from the sky; it gathers on the surfaces that have grown colder than the air.`,
    data: {
      answer: { text: ['dew', 'morning dew', 'dewdrops', 'dew drops', 'drops of dew'] },
      traps: [{ match: ['frost', 'hoar frost', 'hoarfrost', 'ice'], msg: `Frost is the frozen cousin. These pearls are liquid.` }, { match: ['rain', 'raindrops', 'mist', 'fog', 'tears', 'snow', 'the rain'], msg: `Rain makes a sound, and it comes from the sky. This one gathers on the grass by itself.` }],
      glyph: '🌅'
    },
    tags: ['nature', 'weather', 'verse'], links: ['rid-cloud', 'rid-snowflake']
  },
  {
    id: 'rid-scissors', title: 'Two Rings and a Nail', diff: 3,
    source: 'A traditional Russian riddle, told again in our own words.',
    text: `I have two rings, two ends, and one nail through my middle. Anybody can hold me, but I only get to work when my two halves close.\n\nWhat am I?`,
    hints: [`Your fingers go into the rings.`, `The two ends are blades, and the "nail" is the screw that joins them.`],
    explain: `A pair of **scissors**: two finger-rings, two blades (the "ends") and the pivot screw (the "nail") between them. The riddle is a favourite in Russia, where it is a single short line.`,
    data: {
      answer: { text: ['scissors', 'shears', 'secateurs'] },
      traps: [{ match: ['pliers', 'a pair of pliers', 'tongs', 'a pair of tongs', 'handcuffs', 'pincers', 'a pair of pincers', 'tweezers'], msg: `Close — but which tool has two *rings* for your fingers and blades at the other end?` }],
      glyph: '💍'
    },
    tags: ['objects', 'russian', 'classic'], links: ['rid-lock', 'rid-comb']
  },
  {
    id: 'rid-bulb', title: 'A Pear Nobody Eats', diff: 3,
    source: 'A traditional Russian riddle, told again in our own words.',
    text: `A pear hangs from the ceiling, and nobody dares to eat it. It never ripens, but it can burn out, and when it does, the whole room goes dark.\n\nWhat is it?`,
    hints: [`It only looks like a pear: round at the bottom, with a narrow neck.`, `It screws into a socket, and you turn it on with a switch.`],
    explain: `A **light bulb**, whose rounded glass and slim neck really do look like a pear. In the Russian riddle it is just this: a pear hangs there, and you cannot eat it.`,
    data: {
      answer: { text: ['light bulb', 'bulb', 'lightbulb', 'lamp'] },
      traps: [{ match: ['pear', 'a pear', 'fruit', 'a fruit', 'apple', 'an apple', 'chandelier', 'a chandelier', 'lantern', 'a lantern'], msg: `It only looks like a pear. What hangs from the ceiling and gives light?` }],
      glyph: '🍐'
    },
    tags: ['objects', 'russian', 'classic'], links: ['rid-light', 'rid-battery']
  },
  {
    id: 'rid-cabbage', title: 'A Hundred Coats', diff: 3,
    source: 'A traditional Russian riddle, told again in our own words.',
    text: `It wears a hundred coats, one on top of another, and not one of them has a button or a zip. It sits in the garden all summer, round and heavy, and by winter it has turned into soup.\n\nWhat is it?`,
    hints: [`Its coats are leaves, and you peel them off one at a time.`, `It is round and green or white; in Russia they make *shchi*, a soup, from it.`],
    explain: `A **cabbage**: layer over layer of leaves, all without a single fastener. (An onion also wears a good many coats, and so it is an acceptable answer, but the Russian riddle means the cabbage.)`,
    data: {
      answer: { text: ['cabbage', 'onion'] },
      traps: [{ match: ['tree', 'a tree', 'man', 'a man', 'coat', 'a coat', 'wardrobe', 'a wardrobe', 'snowman', 'a snowman'], msg: `Something wears the coats — but where does it grow?` }],
      glyph: '👘'
    },
    tags: ['food', 'plants', 'russian'], links: ['rid-cucumber', 'rid-artichoke']
  },
  {
    id: 'rid-cucumber', title: 'A House Full of Tenants', diff: 3,
    source: 'A traditional Russian riddle, told again in our own words.',
    text: `It is a little room with no windows and no doors, and yet it is crowded with tenants. They sit in rows, side by side, all waiting to be let out.\n\nWhat is it?`,
    hints: [`The tenants are small, pale and flat, and each could grow into another one of the same.`, `It grows on a vine along the ground, and it is often green.`],
    explain: `A **cucumber** (a pumpkin, a melon or a marrow would fit as well): a room without windows or doors whose crowd of tenants are the seeds. Russian collections give cucumber or pumpkin as the answer.`,
    data: {
      answer: { text: ['cucumber', 'pumpkin', 'melon', 'watermelon', 'marrow', 'squash', 'gourd', 'courgette', 'zucchini', 'cantaloupe'] },
      traps: [{ match: ['house', 'a house', 'room', 'a room', 'egg', 'an egg', 'box', 'a box', 'cage', 'a cage', 'apple', 'an apple', 'pomegranate', 'a pomegranate'], msg: `Not a real house, but something that only looks like one. What grows on a vine and is full of seeds?` }],
      glyph: '🏘'
    },
    tags: ['food', 'plants', 'russian'], links: ['rid-cabbage']
  },
  {
    id: 'rid-banana', title: 'Gold, But Not Silver', diff: 3,
    source: 'A traditional Spanish adivinanza (riddle), told again in our own words.',
    text: `In Spanish there is a riddle that goes: *It looks like gold, but it is not silver; draw back the curtain, and you will see what it is.*\n\nWhat is it?`,
    hints: [`The curtain is a peel, and it comes off in strips.`, `It is yellow and curved, and monkeys are said to like it.`],
    explain: `A **banana**. In Spanish the riddle says *oro parece, plata no es* ("gold it seems, silver it is not"), and *plata no* ("silver, no") sounds like *plátano*, the Spanish word for banana. So the answer is hidden in the words that say what the thing is not.`,
    data: {
      answer: { text: ['banana', 'platano', 'plantain'] },
      traps: [{ match: ['gold', 'silver', 'a coin', 'coin', 'a gold coin', 'gold coin', 'money', 'treasure', 'lemon', 'a lemon', 'corn', 'a corn cob', 'honey'], msg: `It only *looks* like gold. Draw the curtain back, and what do you find inside?` }],
      glyph: '🥇'
    },
    tags: ['food', 'puns', 'spanish'], links: ['rid-corn', 'rid-acorn']
  },
  {
    id: 'rid-caskets', title: 'Gold, Silver or Lead', diff: 3,
    source: 'Shakespeare, *The Merchant of Venice* (about 1597), Act 2 scenes 7 and 9 and Act 3 scene 2; the inscriptions are paraphrased.',
    text: `In Shakespeare's *The Merchant of Venice*, the rich Portia's dead father has left a test for her suitors. Three caskets stand in the hall, and her portrait is in only one of them. Each casket bears an inscription:\n\n**Gold:** *Choose me, and you will win what most men long for.*\n\n**Silver:** *Choose me, and you will get exactly what you deserve.*\n\n**Lead:** *Choose me, and you must give up everything and risk it all.*\n\nWhich casket holds the portrait?`,
    hints: [`The test is about character. Who would pick the shiny metals, and why?`, `A wise suitor is the one who is ready to give and to risk everything.`],
    explain: `The **lead** casket. The Prince of Morocco chose gold, and found a skull; the Prince of Aragon chose silver, sure that he deserved the best, and found the portrait of a fool; Bassanio, who loved Portia and was ready to risk all, chose lead and found her picture. The riddle is a test of character in disguise: the greedy and the vain go for the gleam.`,
    data: {
      answer: { choice: 2, choices: ['The gold casket', 'The silver casket', 'The lead casket', 'None: the portrait is in her pocket'] },
      traps: [{ match: 0, msg: `That was the choice of the Prince of Morocco, drawn by what many men desire. It did not end well for him.` }, { match: 1, msg: `That was the choice of the Prince of Aragon, sure that he deserved the best. He got a surprise.` }, { match: 3, msg: `A witty thought, but the test is in the caskets. Which inscription would a *true* lover choose?` }],
      glyph: '🎭'
    },
    tags: ['literature', 'shakespeare'], concepts: ['lateral'], links: ['rid-raven-desk']
  },

  /* ---------- hard ---------- */
  {
    id: 'rid-coffin', title: 'Three People, One Object', diff: 4,
    source: 'A traditional riddle, told again.',
    text: `A carpenter makes one and sells it, though he does not want it for himself. The man who buys it will never use it. And the one who does use it never knows.\n\nWhat is it?`,
    hints: [`The one who uses it is in no position to notice.`, `It is made of wood, and it is very much a made-to-measure job.`],
    explain: `A **coffin**. The carpenter sells it and has no use for it, the family buys it but will not lie in it, and the person who does lie in it will not know. It is a grim subject for a riddle, but a neat piece of construction: three people, and each has a different relation to one and the same thing.`,
    data: {
      answer: { text: ['coffin', 'casket', 'sarcophagus'] },
      traps: [{ match: ['bed', 'a bed', 'shroud', 'a shroud', 'urn', 'an urn', 'grave', 'a grave', 'gravestone', 'a gravestone', 'tombstone', 'a tombstone', 'wardrobe', 'a wardrobe'], msg: `Nearer — think of what is made to measure for the person who will lie in it.` }],
      glyph: '🔨'
    },
    tags: ['objects', 'classic'], links: ['rid-nothing', 'rid-bed']
  },
  {
    id: 'rid-nothing', title: 'Greater Than the Gods', diff: 4,
    source: 'A traditional riddle, told again.',
    text: `It is greater than the gods and worse than the devil. The poor have it, and the rich want none of it. And if you eat it, you die.\n\nWhat is it?`,
    hints: [`Test every clue against your answer, one by one. Each must come out *true*.`, `Read the answer as "no thing" and try the first clue: is there anything greater than the gods?`],
    explain: `**Nothing.** Nothing is greater than the gods; nothing is worse than the devil; the poor have nothing; the rich want nothing; and if you eat nothing for long enough, you die. Variants of this riddle are told in many countries.`,
    data: {
      answer: { text: ['nothing', 'nothing at all', 'nothingness', 'zero', 'naught', 'nought', 'not a thing', 'nowt', 'nil', 'nobody', 'no thing'], exact: true },
      traps: [{ match: ['air', 'death', 'hunger', 'love', 'money', 'poison', 'sin', 'time', 'fate', 'fear', 'evil', 'a poison', 'god', 'the devil'], msg: `A clever thought, but test it against every clue. What is there that could be greater than a god *and* worse than the devil?` }],
      glyph: '🙏'
    },
    tags: ['paradox', 'classic'], concepts: ['lateral'], links: ['rid-silence', 'rid-coffin']
  },
  {
    id: 'rid-raven-desk', title: 'The Mad Hatter\'s Question', diff: 4,
    source: 'Lewis Carroll, *Alice\'s Adventures in Wonderland* (1865), chapter 7, and the preface to the 1896 edition.',
    text: `At the Mad Hatter's tea party, the Hatter suddenly asks Alice: "Why is a raven like a writing desk?" Alice gives it up, and the Hatter admits that he has not the slightest idea either. Readers kept writing to Lewis Carroll to ask what the answer was.\n\nIn a new preface, in 1896, Carroll finally offered one. Which of these is it?`,
    hints: [`Carroll called it an afterthought, and said the riddle had been invented with no answer at all.`, `His answer mentions notes, and something about which end goes in front.`],
    explain: `Carroll's own answer was: *because it can produce a few notes, though they are very flat; and it is never put with the wrong end in front.* He admitted this was only an afterthought — the riddle "as originally invented had no answer at all". He even spelled "never" as "nevar", which is "raven" backwards.`,
    data: {
      answer: { choice: 0, choices: ['It makes only a few notes, and flat ones, and is never put the wrong way round', 'Poe wrote on both', 'Both have inky quills', 'There is no answer, and Carroll never gave one'] },
      traps: [{ match: 1, msg: `A popular answer, suggested later by someone else. It is not the one Carroll gave.` }, { match: 2, msg: `Another popular guess, made by other people since. It is not in Carroll's preface.` }, { match: 3, msg: `He did, in 1896 — though he said the riddle had no answer when he first made it up.` }],
      glyph: '🎩'
    },
    tags: ['literature', 'carroll', 'classic'], concepts: ['lateral'], links: ['rid-caskets']
  },
  {
    id: 'rid-mutton', title: 'Two Legs, Three Legs, Four', diff: 4,
    source: 'A traditional English riddle, told again in our own words.',
    text: `An old English riddle is told in legs alone:\n\n*Two legs sit on three legs, with one leg in his lap. In comes four legs and snatches away one leg. Up jumps two legs, seizes three legs, and throws it at four legs — who drops one leg and runs off.*\n\nWhich scene is being described?`,
    hints: [`Count only the legs: how many legs does each character have?`, `A stool has three legs, and a dog has four. A joint of meat can be called a leg, too.`],
    explain: `A man on a three-legged stool has a leg of mutton in his lap. A dog snatches the meat and runs off; the man throws the stool at it, and the dog drops the meat. (Two legs, three legs, one leg and four legs.)`,
    data: {
      answer: { choice: 3, choices: ['A man on a horse holds a chicken drumstick; a fox snatches it and he hurls his saddle at the thief', 'A milkmaid on a three-legged stool has a pail at her feet; a cow kicks it over and she throws the stool', 'A boy on a swing holds a kite; a bird pecks at it and he throws his cap after the bird', 'A man on a stool has a leg of mutton on his lap; a dog snatches it and he throws the stool at the dog'] },
      traps: [{ match: 0, msg: `Count the legs: a rider and his horse make six between them, and there is no leg lying in a lap.` }, { match: 1, msg: `A cow has four legs and a stool has three, but nothing here is a *leg* lying in a lap.` }, { match: 2, msg: `A swing and a kite have no legs to count.` }],
      glyph: '🦵'
    },
    tags: ['folk', 'logic', 'classic'], concepts: ['lateral']
  },

  /* ---------- fiendish ---------- */

]);
