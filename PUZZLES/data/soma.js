/* The Puzzle Cabinet · data/soma.js — made by tools/gen/soma.js */
Cabinet.family({
  id: "soma",
  engine: "soma",
  cat: "space",
  name: "The Soma cube",
  order: 3,
  blurb: "Seven pieces of three and four cubes. Build the cube, then the steps, the bathtub, the dog and dozens of other figures — some shown only by their shadows.",
  origin: {
    year: 1933,
    who: "Piet Hein",
    note: "The Danish poet and inventor Piet Hein thought of the seven pieces in 1933. Martin Gardner made the Soma cube famous in *Scientific American* in 1958, and readers sent in hundreds of figures to build."
  },
  concepts: [
    "exact-cover",
    "rotation-3d",
    "coloring-argument"
  ],
  deps: [
    "js/lib/dlx.js",
    "js/lib/polycube.js"
  ]
}, [
  {
    id: "soma-flat-start",
    title: "Flat Out",
    diff: 1,
    text: "Four of the seven Soma pieces are flat: the **V**, the **L**, the **T** and the **Z**. Lay them together into a slab of 5 × 3 cubes, one cube thick. A gentle start: you only need to slide and spin them (Q and E).",
    hints: ["The V is the only piece of three cubes. Try it in a corner of the slab."],
    explain: "Four of the Soma pieces lie flat — the V, L, T and Z. They are the shapes you can make from three or four squares, apart from the straight lines and the 2 × 2 square, which Piet Hein left out because they are too regular. The other three pieces never lie flat.",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z"],"sol":"22233|02331|00111"}
  },
  {
    id: "soma-which-two",
    title: "Which Two?",
    diff: 1,
    text: "The ghost is a 2 × 2 × 2 cube with one corner bitten off: seven cubes. Two of the seven Soma pieces fill it exactly. Which two? (The other five stay on the table.)",
    hints: ["Seven cubes: one piece of three and one of four.","The V is the only piece of three. Which four-cube piece fills what is left beside it?"],
    explain: "Seven is 3 + 4, so the V must be one of the two. The four cubes left beside it are not flat, so the partner is one of the twisted pieces — A, B or P — and only the right one fits the bite.",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"60|66/00|6.","any":true}
  },
  {
    id: "soma-three-twists",
    title: "Three Twisted Ones",
    diff: 1,
    text: "The three pieces that never lie flat — the twists **A** and **B** and the three-armed **P** — with the V, build a little tower two cubes square and four high, one cube short at the top.",
    hints: ["A and B are mirror images of each other: each fits inside a 2 × 2 × 2 box."],
    concepts: ["exact-cover"],
    data: {"pieces":["V","A","B","P"],"sol":"10|00/11|21/32|22/33|3."}
  },
  {
    id: "soma-last-three",
    title: "The Last Three",
    diff: 1,
    text: "The Soma cube, nearly done: four pieces are already in place and stay there (they are shown dimmer). Put in the last three.",
    hints: ["Look at the hole the three must fill. Which piece fits its lowest cubes?"],
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"550|330|233/451|450|226/111|446|266","given":[0,2,3,5]}
  },
  {
    id: "soma-four-to-go",
    title: "Four to Go",
    diff: 1,
    text: "Three pieces of the Soma cube are fixed in place at the bottom. Build the rest of the cube around them with the other four.",
    hints: ["Finish the bottom layer first, then read the shape of the hole that is left."],
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"665|655|443/625|043|143/222|003|111","given":[4,5,6]}
  },
  {
    id: "soma-half-built",
    title: "Half Built",
    diff: 1,
    text: "Two pieces are fixed at the bottom of the cube. Five to place — the cube is yours to finish.",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"661|644|004/651|355|304/311|325|222","given":[4,6]}
  },
  {
    id: "soma-cube",
    title: "The Soma Cube",
    diff: 2,
    year: 1933,
    source: "Piet Hein (1933); popularised by Martin Gardner in *Scientific American* (1958).",
    text: "The seven Soma pieces — every irregular shape that three or four cubes can make — fit together into a 3 × 3 × 3 cube. Build it.",
    hints: ["Place the awkward pieces first — the T and the P — and keep the small V for last: it fits into many corners.","Every layer of the cube has nine cubes. Try to finish the bottom layer before you worry about the top."],
    explain: "There are 240 essentially different ways to build the cube (turnings and mirror images of the whole cube counted once), which is why it makes a friendly start. Paint the 27 small cubes like a three-dimensional chessboard: 14 of one colour and 13 of the other. The T and the P always cover three cubes of one colour and one of the other, the V two and one, the other four pieces two and two. So the difference of one can only be made in a few ways — one of the T and the P must lean toward each colour, and the V toward the larger one. Such colour counts decide which figures can be built at all.",
    concepts: ["exact-cover","coloring-argument"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"110|100|133/445|455|336/245|226|266"}
  },
  {
    id: "soma-steps",
    title: "The Steps",
    diff: 2,
    text: "A wide flight of steps, climbing to four cubes high.",
    explain: "The computer finds 1173 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"530|550|644/330|654|664/31.|21.|11./2..|2..|2.."}
  },
  {
    id: "soma-wall",
    title: "The Garden Wall",
    diff: 2,
    text: "A wall two cubes thick and three high, with one end broken off.",
    explain: "The computer finds 1359 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"56222|5662./55111|4600./44331|4330."}
  },
  {
    id: "soma-skyscraper",
    title: "The Skyscraper",
    diff: 2,
    text: "Seven storeys on a 2 × 2 plot (one corner is a storey short — the roof garden).",
    hints: ["Every piece must fit inside a column two cubes wide: the flat ones stand on edge."],
    explain: "The computer finds 760 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"66|62/63|22/33|02/34|00/14|44/15|55/15|1."}
  },
  {
    id: "soma-loaf",
    title: "The Loaf",
    diff: 2,
    text: "A loaf of bread fresh from the oven, with a little crust sticking up.",
    explain: "The computer finds 708 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"06331|66111/04433|06255/.425.|.425./.....|..2.."}
  },
  {
    id: "soma-piano",
    title: "The Grand Piano",
    diff: 2,
    text: "A grand piano seen from above, with its lid propped up at the corner.",
    explain: "The computer finds 1657 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"4450|1166|126.|13../4550|4560|222.|33../....|....|....|3..."}
  },
  {
    id: "soma-bed",
    title: "The Bed",
    diff: 2,
    text: "A bed with a tall headboard and a deep mattress.",
    explain: "The computer finds 1289 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"550|662|642|442/150|650|332|433/111|...|...|..."}
  },
  {
    id: "soma-crystal",
    title: "The Crystal",
    diff: 2,
    text: "A chunky crystal: a pointed foot, a square body and a jagged crown.",
    explain: "Our first crystal had a diamond-shaped middle — and 17 cubes of one chessboard colour against 10 of the other. The Soma pieces can never make a difference of more than 5 (the V can tip the balance by one, the T and the P by two each), so it could not be built. This one is balanced. The computer finds 1511 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover","coloring-argument"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".2.|222|.1./660|655|315/600|354|311/.4.|344|..."}
  },
  {
    id: "soma-boot",
    title: "The Boot",
    diff: 2,
    text: "A tall boot, laced up to five cubes high, with its toe on the table.",
    explain: "The computer finds 749 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"51|51|21|22|2./55|44|41|..|../00|34|..|..|../60|33|..|..|../66|63|..|..|.."}
  },
  {
    id: "soma-armchair",
    title: "The Armchair",
    diff: 2,
    text: "A deep armchair: a high back, two arms and a soft seat.",
    explain: "The computer finds 665 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"660|600|211/644|554|221/533|5.4|2.1/33.|...|..."}
  },
  {
    id: "soma-pyramid",
    title: "The Pyramid",
    diff: 2,
    text: "A long stepped roof: a ridge three cubes high, sloping down on both sides.",
    explain: "The computer finds 82 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"66134|06144|00222/.633.|.514.|.552./..3..|..1..|..5.."}
  },
  {
    id: "soma-walled-garden",
    title: "The Walled Garden",
    diff: 2,
    text: "A garden inside a wall two cubes high, with a gap in the wall for the gate.",
    explain: "The computer finds 235 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"3355|0211|2241|6241/0335|0..5|6...|6644"}
  },
  {
    id: "soma-bridge",
    title: "The Bridge",
    diff: 2,
    text: "A bridge on two piers over a narrow stream, with a lamp in the middle of the parapet.",
    explain: "The computer finds 188 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"30.55|00.25/34.56|34.22/11166|34426/..1..|....."}
  },
  {
    id: "soma-tunnel",
    title: "The Tunnel",
    diff: 2,
    text: "A tunnel three cubes long with a ridge along its roof. The trains go through the hole.",
    explain: "The computer finds 84 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"366|336|132/1.6|1.2|1.2/055|005|442/.5.|.4.|.4."}
  },
  {
    id: "soma-tower",
    title: "The Tower",
    diff: 2,
    text: "A square tower, two cubes across, rising six high from a 3 × 3 base, with two battlements on top.",
    hints: ["The tower is two cubes wide: which pieces fit inside a 2 × 2 column?"],
    explain: "The computer finds 96 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"661|561|511/06.|55.|.../04.|04.|.../44.|32.|.../32.|32.|.../3..|.2.|..."}
  },
  {
    id: "soma-bathtub",
    title: "The Bathtub",
    diff: 2,
    text: "A bathtub for a small bather: five cubes long, three wide, two high, with a hollow of three cubes in the top.",
    hints: ["The rim around the hollow is one cube thick. The pieces that make it lie along it."],
    explain: "The computer finds 79 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"33661|20564|00544/23361|2...1|25541"}
  },
  {
    id: "soma-throne",
    title: "The Throne",
    diff: 2,
    text: "A throne with a very tall back — five cubes — and a deep seat.",
    explain: "The computer finds 130 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"660|600|554/631|541|544/331|...|.../321|...|.../222|...|..."}
  },
  {
    id: "soma-tee",
    title: "The Tee",
    diff: 2,
    text: "A big letter T, three cubes thick, with a little foot.",
    explain: "The computer finds 75 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"1344|.24.|.22.|.2../1364|.35.|.05.|.0../1166|.36.|.55.|.0.."}
  },
  {
    id: "soma-corner",
    title: "The Stepped Corner",
    diff: 2,
    text: "The corner of a stepped pyramid, five cubes high at the top.",
    explain: "This corner has 16 cubes of one chessboard colour and 11 of the other: a difference of five, the most the Soma pieces can manage. So the V must cover two cubes of the larger colour, and the T and the P three each. Knowing that, their places come quickly. The computer finds 1400 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover","coloring-argument"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"006|166|155/403|456|15./233|44.|1../23.|2..|.../2..|...|..."}
  },
  {
    id: "soma-snake",
    title: "The Snake",
    diff: 2,
    text: "A snake winding across the table, two cubes high, raising its head at the end.",
    explain: "The computer finds 90 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"66...|600..|.405.|..111|...31/62...|222..|.445.|..455|...33/.....|.....|.....|.....|....3"}
  },
  {
    id: "soma-hill",
    title: "The Hill",
    diff: 2,
    text: "A lumpy hill with a steep double peak.",
    explain: "The computer finds 504 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"3321|0331|0611/.22.|0644|.66./..2.|.54.|.54./....|.55.|...."}
  },
  {
    id: "soma-sphinx",
    title: "The Sphinx",
    diff: 2,
    text: "A sphinx lying on the sand, paws forward, head raised.",
    explain: "The computer finds 94 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"3442.|64522|6652./304..|30111|655../.....|301..|....."}
  },
  {
    id: "soma-anvil",
    title: "The Anvil",
    diff: 2,
    text: "An anvil: a square block, a narrow waist and a wide top with a horn.",
    explain: "The anvil has 16 cubes of one chessboard colour and 11 of the other — a difference of five, the most the Soma pieces can make. So the V, the T and the P must all lean the same way: the V covers two cubes of the larger colour, the T and the P three each. The computer finds 72 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover","coloring-argument"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".244.|.225.|.255./..4..|.645.|..0../.6311|66331|.0031"}
  },
  {
    id: "soma-g02",
    title: "The Azurite",
    diff: 2,
    text: "A rough lump of rock from the Soma quarry. Build it with all seven pieces.",
    explain: "The computer finds 60 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"2.33..|22633.|266111|.....1/..00..|..554.|..65..|....../..04..|..544.|......|......"}
  },
  {
    id: "soma-g08",
    title: "The Basalt",
    diff: 2,
    text: "A shape nobody designed — it grew one piece at a time. Put the seven pieces back together.",
    explain: "The computer finds 60 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"33...|03355|22265|..111/0....|0445.|.266.|..16./..4..|..4..|.....|....."}
  },
  {
    id: "soma-sofa",
    title: "The Sofa",
    diff: 3,
    text: "A sofa with a high back and two arms. Sit down when you have built it.",
    explain: "The computer finds 26 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"36615|02655|22244/33615|0...4|0...4/.311.|.....|....."}
  },
  {
    id: "soma-gateway",
    title: "The Gateway",
    diff: 3,
    text: "Two square gateposts, three high, joined by a lintel across the top.",
    hints: ["The lintel rests on both posts: the pieces at its ends must hook down into the posts."],
    explain: "The computer finds 32 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"53.44|55.24/33.26|05.24/31.66|00.26/.111.|....."}
  },
  {
    id: "soma-bench",
    title: "The Bench",
    diff: 3,
    text: "A park bench: a long seat on two sturdy legs, with a low back.",
    explain: "The computer finds 13 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"34...06|44...00/3351266|4552226/.35111.|......."}
  },
  {
    id: "soma-dog",
    title: "The Dog",
    diff: 3,
    text: "A dog on four short legs, with its head up, its ears pricked and a stub of a tail.",
    hints: ["Each leg is a single cube: the piece that makes it must reach up into the body."],
    explain: "The computer finds 17 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".4..0.|.4..0./.2221.|.4460./33261.|.3366./....11|....55/....5.|....5."}
  },
  {
    id: "soma-elephant",
    title: "The Elephant",
    diff: 3,
    text: "An elephant on four stout legs, with a round back and its trunk down to the ground.",
    explain: "The computer finds 14 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"4..2.|....3|6..0./4422.|64533|6600./.552.|.153.|.111."}
  },
  {
    id: "soma-giraffe",
    title: "The Giraffe",
    diff: 3,
    text: "A giraffe: a square body on four little legs, a long neck and a head looking along.",
    hints: ["The top of the neck is one cube wide: the piece that holds the head must run down through it."],
    explain: "The computer finds 12 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"6.4|...|1.3/664|644|133/222|125|135/...|...|.55/...|...|.0./...|...|.00"}
  },
  {
    id: "soma-duck",
    title: "The Duck",
    diff: 3,
    text: "A duck on the pond, tail up at one end, head and beak at the other.",
    explain: "The computer finds 12 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".336..|33111.|.500../.466..|44561.|.550../......|4...2.|....../......|...222|......"}
  },
  {
    id: "soma-cannon",
    title: "The Cannon",
    diff: 3,
    text: "A cannon on a carriage with four wheels, its barrel pointing out across the table.",
    explain: "The computer finds 16 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"6.1..|.....|2.5../661..|655..|225../001..|04133|24.../.....|4433.|....."}
  },
  {
    id: "soma-shell-seat",
    title: "The Window Seat",
    diff: 3,
    text: "A seat under a window, with a step in front. This time the figure is a smooth shell, without its cube lines: count the cubes by eye.",
    explain: "The computer finds 101 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"2644|2254|255./0661|0654|..../0331|....|..../3311|....|....","show":"shell"}
  },
  {
    id: "soma-shell-block",
    title: "The Notched Block",
    diff: 3,
    text: "A 3 × 3 × 3 block — nearly. One cube has been taken from the top and put back somewhere else. Smooth shell: where?",
    explain: "The computer finds 888 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"111|163|663/053|453|462/055|0.2|442/...|...|..2","show":"shell"}
  },
  {
    id: "soma-shell-l",
    title: "The Big L",
    diff: 3,
    text: "A big letter L lying on the table, two and three cubes high. Only the shell is shown.",
    explain: "The computer finds 550 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"00..|30..|6624|6222/31..|31..|6114|5544/3...|....|5...|5...","show":"shell"}
  },
  {
    id: "soma-shell-bath",
    title: "The Sunken Bath",
    diff: 3,
    text: "A bath sunk into a platform, shown as a smooth shell. Count its walls carefully — one corner is lower.",
    explain: "The computer finds 133 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"4433|6332|6652|0052/4111|4..1|6..2|055.","show":"shell"}
  },
  {
    id: "soma-shell-ramp",
    title: "The Twisted Ramp",
    diff: 3,
    text: "A ramp that rises two ways at once. The figure is a smooth shell, so look at it from several sides.",
    explain: "The computer finds 323 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"3366|5336|5111/...6|5544|0142/....|...4|0022/....|....|...2","show":"shell"}
  },
  {
    id: "soma-g05",
    title: "The Cinnabar",
    diff: 3,
    text: "A pebble of cubes, polished only on the outside. Build it.",
    explain: "The computer finds 13 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"661.2|63122|44112|.4.../63...|5300.|5.0..|.4.../.3...|55...|.....|....."}
  },
  {
    id: "soma-g06",
    title: "The Tourmaline",
    diff: 3,
    text: "No name and no story: 27 cubes the computer grew from the seven pieces. Build it.",
    explain: "The computer finds 13 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"..004.|..044.|113222|13352.|1355../......|...4..|...66.|...56.|....../......|......|....6.|......|......"}
  },
  {
    id: "soma-g07",
    title: "The Moonstone",
    diff: 3,
    text: "A rough lump of rock from the Soma quarry. Build it with all seven pieces.",
    explain: "The computer finds 14 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".11...|.655..|665222|..332./..1...|.440..|.650..|.33.../..1...|.4....|.4.0..|......"}
  },
  {
    id: "soma-g10",
    title: "The Peridot",
    diff: 3,
    text: "A pebble of cubes, polished only on the outside. Build it.",
    explain: "The computer finds 11 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"...33|2433.|22...|2..../.4455|.4.5.|66...|6..../.111.|.1.5.|6....|...../.00..|.0...|.....|....."}
  },
  {
    id: "soma-g16",
    title: "The Serpentine",
    diff: 3,
    text: "No name and no story: 27 cubes the computer grew from the seven pieces. Build it.",
    explain: "The computer finds 9 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"...111|.44331|046633|..6.../......|..45..|00655.|...2../......|......|...25.|...2../......|......|......|...2.."}
  },
  {
    id: "soma-footstool",
    title: "The Footstool",
    diff: 4,
    text: "A stool with a cross-shaped cushion. Its four legs stand under the middles of its sides — a strange place for legs, but there is a reason.",
    explain: "With the legs at the corners, as a real stool has them, the figure has 17 cubes of one chessboard colour and 10 of the other. The Soma pieces can never make a difference of more than 5, so that stool cannot be built. Moving the legs to the middles of the sides balances the colours. The computer finds 6 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover","coloring-argument"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".6.|1.0|.3./660|160|533/144|154|553/.2.|224|.2."}
  },
  {
    id: "soma-well",
    title: "The Well",
    diff: 4,
    text: "A well with a square shaft, three deep, and a beam across the top for the bucket.",
    hints: ["The beam across the top rests on the walls at its ends. The piece that makes its middle must hang onto one of them."],
    explain: "The computer finds 6 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"661|6.1|551/601|5.2|533/400|4.2|332/...|442|..."}
  },
  {
    id: "soma-arch",
    title: "The Arch",
    diff: 4,
    text: "A triumphal arch on two thin legs, with a keystone on top.",
    hints: ["The legs are one cube wide and two high: the pieces that make them must also help to make the arch above."],
    explain: "The computer finds 3 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"1...0|1...0/1...3|2...0/16.53|22.53/66455|26443/..4..|....."}
  },
  {
    id: "soma-fort",
    title: "The Fort",
    diff: 4,
    text: "A little fort: a square courtyard walled two high, with a tower at two of its corners.",
    hints: ["The walls are one cube thick: every piece must lie along them, bending round the corners."],
    explain: "The computer finds 2 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"1102|1..2|1..2|5544/6600|6..2|5..4|5334/6...|....|....|..33"}
  },
  {
    id: "soma-mushroom",
    title: "The Mushroom",
    diff: 4,
    text: "A mushroom: a stem of 2 × 2 cubes, a flat cap of 4 × 4, and a little knob on top.",
    hints: ["The cap is one cube thick. The pieces that hold its edges cannot reach anywhere but along the cap — or down into the stem."],
    explain: "The computer finds 2 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"....|.63.|.66.|..../....|.33.|.64.|..../1100|1350|1244|2224/....|.55.|.5..|...."}
  },
  {
    id: "soma-table",
    title: "The Table and Vase",
    diff: 4,
    text: "A square table on four legs, with a vase on it.",
    hints: ["Each leg is a single cube under a corner of the table top."],
    explain: "The computer finds 2 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"1..0|....|....|5..6/1320|1320|1526|5566/....|.32.|.34.|..../....|.4..|.44.|...."}
  },
  {
    id: "soma-shell-kennel",
    title: "The Kennel",
    diff: 4,
    text: "A kennel with an open door, a ridged roof and a little chimney. Smooth shell: the door is easy to miss from behind.",
    explain: "The computer finds 15 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"442|1.0|1.0/462|4.2|1.0/662|365|155/...|335|.../...|.3.|...","show":"shell"}
  },
  {
    id: "soma-shell-spiral",
    title: "The Spiral Stair",
    diff: 4,
    text: "Steps winding up around a hole, from one cube high to seven. Shown as a smooth shell — turn it round to count the steps.",
    hints: ["Around the hole, each column is one step higher than the one before it — nearly."],
    explain: "The computer finds 13 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"443|4.6|066/.43|0.3|026/...|5.3|222/...|5..|55./...|1..|1../...|1..|.../...|1..|...","show":"shell"}
  },
  {
    id: "soma-g01",
    title: "The Citrine",
    diff: 4,
    text: "No name and no story: 27 cubes the computer grew from the seven pieces. Build it. It is shown as a smooth shell, so count its cubes by eye.",
    explain: "The computer finds 9 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"...0..|22200.|533111|55.1../......|.2....|334...|65..../......|.4....|644...|66....","show":"shell"}
  },
  {
    id: "soma-g03",
    title: "The Gneiss",
    diff: 4,
    text: "A shape nobody designed — it grew one piece at a time. Put the seven pieces back together.",
    explain: "The computer finds 6 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".233..|22233.|.00.6.|.05566|...54./......|......|......|..546.|...44./......|......|......|..111.|....1."}
  },
  {
    id: "soma-g09",
    title: "The Coral",
    diff: 4,
    text: "Twenty-seven cubes in an odd heap. Every piece is used, every cube filled once.",
    explain: "The computer finds 5 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".0...5|00.155|.33144|...222/.....5|...1.4|..3364|....2./......|...1..|...66.|....6."}
  },
  {
    id: "soma-g11",
    title: "The Galena",
    diff: 4,
    text: "No name and no story: 27 cubes the computer grew from the seven pieces. Build it.",
    explain: "The computer finds 7 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"521.00|521340|.2144.|.6..../55....|.233..|.614..|66..../......|..3...|......|......"}
  },
  {
    id: "soma-g12",
    title: "The Schist",
    diff: 4,
    text: "A rough lump of rock from the Soma quarry. Build it with all seven pieces.",
    explain: "The computer finds 6 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".01.2.|001222|311554|33.5..|.3..../......|..6.4.|..6644|...5..|....../......|......|..6...|......|......"}
  },
  {
    id: "soma-g14",
    title: "The Topaz",
    diff: 4,
    text: "Twenty-seven cubes in an odd heap. Every piece is used, every cube filled once. It is shown as a smooth shell, so count its cubes by eye.",
    explain: "The computer finds 9 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"34...|34.20|66222|.6.5./44...|3...0|36550|...5./.....|1....|111..|.....","show":"shell"}
  },
  {
    id: "soma-v01",
    title: "Shadows of Quartz",
    diff: 4,
    text: "This time the figure itself is hidden. Its three shadows are shown instead: the front view on the back wall, the side view on the side wall, and the view from above on the table. Exactly one figure of 27 cubes casts all three — work it out and build it with the seven pieces. The side panel shows the three views flat, with dots for the shadows of your own cubes.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 15, 12 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 294 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"400|402|322|332|635/111|441|...|655|665","show":"views"}
  },
  {
    id: "soma-v02",
    title: "Shadows of Garnet",
    diff: 4,
    text: "Three shadows, one hidden figure. Work out its shape from the views, then build it.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 12, 9, 4, 2 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 32 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"5111|5001|6044/55.2|63.4|66.4/.3.2|.3.2|..../.3.2|....|....","show":"views"}
  },
  {
    id: "soma-v04",
    title: "Shadows of Fluorite",
    diff: 4,
    text: "Front, side and top: three views of one figure. Build it so that its shadows match all three.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 10, 9, 6, 2 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 56 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"664|634|..5|005/644|331|...|055/222|321|...|.../...|.11|...|...","show":"views"}
  },
  {
    id: "soma-v05",
    title: "Shadows of Amber",
    diff: 4,
    text: "Only the three shadows are given: front (on the back wall), side (on the side wall) and top (on the table). One figure casts them all. Build it.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 12, 9, 6 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 287 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"244|004|033|331/256|254|...|111/266|556|...|...","show":"views"}
  },
  {
    id: "soma-v06",
    title: "Shadows of Olivine",
    diff: 4,
    text: "Three shadows, one hidden figure. Work out its shape from the views, then build it.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 12, 12, 3 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 1131 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"233|255|245|644/330|251|641|661/..0|..0|...|..1","show":"views"}
  },
  {
    id: "soma-v07",
    title: "Shadows of Shale",
    diff: 4,
    text: "The figure is hidden; its shadows on the two walls and the table are all you get. Build the one figure that casts them.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 14, 9, 4 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 146 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"0.244|62224|66111/0..55|0..34|6..31/...35|...35|.....","show":"views"}
  },
  {
    id: "soma-v08",
    title: "Shadows of Chalk",
    diff: 4,
    text: "Front, side and top: three views of one figure. Build it so that its shadows match all three.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 14, 11, 2 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 52 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":".111|00.5|0255|3344/.661|.6.5|.224|.334/.6..|....|.2..|....","show":"views"}
  },
  {
    id: "soma-v10",
    title: "Shadows of Marble",
    diff: 4,
    text: "Three shadows, one hidden figure. Work out its shape from the views, then build it.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 14, 9, 4 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 97 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"1114|2544|233.|2.33/061.|054.|255.|..../66..|06..|....|....","show":"views"}
  },
  {
    id: "soma-v13",
    title: "Shadows of Tuff",
    diff: 4,
    text: "Only the three shadows are given: front (on the back wall), side (on the side wall) and top (on the table). One figure casts them all. Build it.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 15, 9, 3 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 71 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"55111|65331|66433/500..|240..|644../2....|2....|2....","show":"views"}
  },
  {
    id: "soma-g04",
    title: "The Porphyry",
    diff: 5,
    text: "Twenty-seven cubes in an odd heap. Every piece is used, every cube filled once. It is shown as a smooth shell, so count its cubes by eye.",
    explain: "The computer finds 3 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"0112..|00122.|..125.|....55/...3..|...33.|...63.|...665/...4..|...44.|......|...6../...4..|......|......|......","show":"shell"}
  },
  {
    id: "soma-g13",
    title: "The Talc",
    diff: 5,
    text: "A shape nobody designed — it grew one piece at a time. Put the seven pieces back together. It is shown as a smooth shell, so count its cubes by eye.",
    explain: "The computer finds 3 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"11125.|..1355|..3366|..3446/...22.|...005|....46|....4./...2..|...0..|......|......","show":"shell"}
  },
  {
    id: "soma-g15",
    title: "The Jet",
    diff: 5,
    text: "A pebble of cubes, polished only on the outside. Build it. It is shown as a smooth shell, so count its cubes by eye.",
    explain: "The computer finds 2 essentially different ways to build it (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"441...|111...|02223.|006633|..6..3/4.....|4.....|..25..|..65..|....../......|......|......|..55..|......","show":"shell"}
  },
  {
    id: "soma-v03",
    title: "Shadows of Zircon",
    diff: 5,
    text: "The figure is hidden; its shadows on the two walls and the table are all you get. Build the one figure that casts them.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 14, 10, 3 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 2 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"66410|6541.|25511/64400|.....|22533/.....|.....|2.33.","show":"views"}
  },
  {
    id: "soma-v09",
    title: "Shadows of Beryl",
    diff: 5,
    text: "Only the three shadows are given: front (on the back wall), side (on the side wall) and top (on the table). One figure casts them all. Build it.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 14, 11, 2 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 4 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"22241|325.1|36551/30.44|36..4|66.51/00...|.....|.....","show":"views"}
  },
  {
    id: "soma-v11",
    title: "Shadows of Gypsum",
    diff: 5,
    text: "The figure is hidden; its shadows on the two walls and the table are all you get. Build the one figure that casts them.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 20, 4, 3 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 1 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"5222|5523|4433|4630|6600/....|.5..|.4..|.1..|.6../....|.1..|.1..|.1..|....","show":"views"}
  },
  {
    id: "soma-v12",
    title: "Shadows of Hematite",
    diff: 5,
    text: "Front, side and top: three views of one figure. Build it so that its shadows match all three.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 19, 6, 2 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 2 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"4466|4261|22.1|0211|0033/.46.|.55.|....|....|.33./.5..|.5..|....|....|....","show":"views"}
  },
  {
    id: "soma-v14",
    title: "Shadows of Calcite",
    diff: 5,
    text: "Three shadows, one hidden figure. Work out its shape from the views, then build it.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 14, 11, 2 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds 6 essentially different ways to build it.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["V","L","T","Z","A","B","P"],"sol":"2220|.2.0|4453|4113/.660|.6.3|.453|.155/.6..|....|....|.1..","show":"views"}
  }
]);
