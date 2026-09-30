/* The Puzzle Cabinet · data/polycube-packing.js — made by tools/gen/soma.js */
Cabinet.family({
  id: "polycube-packing",
  engine: "soma",
  cat: "space",
  name: "Packing blocks",
  order: 4,
  blurb: "Tetracubes, pentacubes, bricks and blocks: pack every piece into the box, cube for cube — from two twists to Conway's notorious 5 × 5 × 5.",
  origin: {
    who: "Slothouber and Graatsma, John Conway and others",
    note: "After the Soma cube came a whole family of box-packing puzzles in three dimensions, some of them devilishly tight: the Slothouber–Graatsma cube, Conway's 5 × 5 × 5 box and the sets of pentacubes."
  },
  concepts: [
    "exact-cover",
    "rotation-3d"
  ],
  deps: [
    "js/lib/dlx.js",
    "js/lib/polycube.js"
  ]
}, [
  {
    id: "pack-three-into-eight",
    title: "Three into Eight",
    diff: 1,
    text: "Two V pieces (three cubes in a corner) and a pair of cubes make a 2 × 2 × 2 cube. Put them together.",
    hints: ["Stand one V upright."],
    concepts: ["exact-cover"],
    data: {"pieces":["V","V","D2"],"sol":"01|01/01|22"}
  },
  {
    id: "pack-twin-twists",
    title: "Twin Twists",
    diff: 1,
    text: "Two copies of the same twisted piece make a 2 × 2 × 2 cube. Fit them together.",
    explain: "Two twists of the same hand make the cube. A twist and its mirror image cannot: try it with the Soma set's A and B and they always leave a gap. Handedness matters in three dimensions — which is why the Soma set needs both.",
    concepts: ["exact-cover","rotation-3d"],
    data: {"pieces":["A","A"],"sol":"01|01/11|00"}
  },
  {
    id: "pack-two-tripods",
    title: "Two Tripods",
    diff: 1,
    text: "The tripod is a cube with three arms, one along each direction. Two tripods make a 2 × 2 × 2 cube.",
    hints: ["The two corner cubes — where the arms meet — end up at opposite corners of the cube."],
    concepts: ["exact-cover"],
    data: {"pieces":["P","P"],"sol":"01|00/11|01"}
  },
  {
    id: "pack-rods",
    title: "Nine Rods",
    diff: 1,
    text: "Nine rods of three cubes fill a 3 × 3 × 3 box. The obvious way works — but can you also do it with the rods pointing in all three directions?",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    data: {"pieces":["I3","I3","I3","I3","I3","I3","I3","I3","I3"],"sol":"012|012|012/333|444|555/678|678|678"}
  },
  {
    id: "pack-abl",
    title: "A Brick of Three",
    diff: 1,
    text: "The two twists, A and B, and the L make a brick of 2 × 2 × 3 cubes.",
    concepts: ["exact-cover"],
    data: {"pieces":["A","B","L"],"sol":"22|02|12/00|01|11"}
  },
  {
    id: "pack-bpt",
    title: "The Awkward Squad",
    diff: 1,
    text: "The twist B, the tripod P and the T: three awkward pieces that make a tidy 2 × 2 × 3 brick.",
    concepts: ["exact-cover"],
    data: {"pieces":["B","P","T"],"sol":"12|22|02/11|10|00"}
  },
  {
    id: "pack-g01",
    title: "The Walnut Block",
    diff: 1,
    text: "Build the figure of 7 cubes with these two pieces.",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["I3","Z"],"sol":"1.0|110|.10"}
  },
  {
    id: "pack-g02",
    title: "The Oak Block",
    diff: 1,
    text: "A figure of 10 cubes, sawn into three pieces. Put it back together.",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["I3","V","T"],"sol":"11.|12.|222/...|...|000"}
  },
  {
    id: "pack-g03",
    title: "The Olive Block",
    diff: 1,
    text: "Two pieces, 7 cubes, one figure. Every cube filled exactly once.",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["I3","A"],"sol":"..1|000/..1|.11"}
  },
  {
    id: "pack-g04",
    title: "The Mahogany Block",
    diff: 1,
    text: "The two pieces fit together into this figure of 8 cubes. Show how.",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["A","B"],"sol":"00|11|1./0.|0.|1."}
  },
  {
    id: "pack-g05",
    title: "The Acacia Block",
    diff: 1,
    text: "Build the figure of 6 cubes with these two pieces.",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["D2","T"],"sol":".1.|111|00."}
  },
  {
    id: "pack-slab",
    title: "The Paving Slab",
    diff: 2,
    text: "Two V pieces, the L, the T and the Z make a slab of 3 × 3 cubes, two deep.",
    explain: "The computer finds 13 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","V","L","T","Z"],"sol":"103|133|443/100|222|244"}
  },
  {
    id: "pack-nine-corners",
    title: "Nine Corners",
    diff: 2,
    text: "Nine V pieces — three cubes in a corner — fill a 3 × 3 × 3 cube.",
    hints: ["Three V's can never fill a flat 3 × 3 layer — try it and a gap is always left — so some V's must stand upright across two layers."],
    explain: "The computer finds 111 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["V","V","V","V","V","V","V","V","V"],"sol":"001|871|873/502|671|833/552|642|644"}
  },
  {
    id: "pack-tetra-tower",
    title: "The Tetracube Tower",
    diff: 2,
    text: "Four tetracubes — the L, the Z and the two twists — make a tower two cubes square and four high.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    data: {"pieces":["L","Z","A","B"],"sol":"31|33/11|03/12|02/22|00"}
  },
  {
    id: "pack-six-tetra",
    title: "Six in a Box",
    diff: 2,
    text: "Six tetracubes — pieces of four cubes — fill a box of 4 × 3 × 2.",
    explain: "The computer finds 21 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["I4","O4","L","T","Z","P"],"sol":"1134|1154|0000/2333|2554|2254"}
  },
  {
    id: "pack-tetra-half",
    title: "Eight Tetracubes, Half Done",
    diff: 2,
    text: "There are eight tetracubes — every way of joining four cubes face to face, with the mirror twists counted apart. Together they fill a 4 × 4 × 2 box. Four are in place; put in the other four.",
    explain: "The computer finds 695 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["I4","O4","L","T","Z","A","B","P"],"sol":"3115|3355|3662|7222/4110|4450|7460|7760","given":[1,2,3,5]}
  },
  {
    id: "pack-g06",
    title: "The Hickory Block",
    diff: 2,
    text: "A figure of 16 cubes, sawn into four pieces. Put it back together.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["T","A","B","P"],"sol":".11|331|.30/.22|.31|.00/..2|..2|..0"}
  },
  {
    id: "pack-g07",
    title: "The Birch Block",
    diff: 2,
    text: "Four pieces, 16 cubes, one figure. Every cube filled exactly once.",
    explain: "The computer finds 5 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["L","T","Z","A"],"sol":".200|220.|230./..1.|311.|331."}
  },
  {
    id: "pack-g08",
    title: "The Chestnut Block",
    diff: 2,
    text: "The four pieces fit together into this figure of 16 cubes. Show how.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["O4","L","Z","A"],"sol":"3221|3111/2200|3300"}
  },
  {
    id: "pack-g09",
    title: "The Beech Block",
    diff: 2,
    text: "Build the figure of 16 cubes with these four pieces.",
    explain: "The computer finds 4 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["T","Z","A","B"],"sol":"10|00|20/11|22|23/.1|33|.3"}
  },
  {
    id: "pack-g10",
    title: "The Elm Block",
    diff: 2,
    text: "A figure of 16 cubes, sawn into four pieces. Put it back together.",
    explain: "The computer finds 2 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["I4","O4","A","P"],"sol":".133|.132|...2/.13.|.122|..../....|0000|...."}
  },
  {
    id: "pack-g11",
    title: "The Juniper Block",
    diff: 2,
    text: "Five pieces, 19 cubes, one figure. Every cube filled exactly once.",
    explain: "The computer finds 9 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["O4","T","A","P","I3"],"sol":"444|200|.00/22.|23.|33./1..|11.|13."}
  },
  {
    id: "pack-g13",
    title: "The Ash Block",
    diff: 2,
    text: "Build the figure of 18 cubes with these five pieces.",
    explain: "The computer finds 12 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["T","A","P","V","I3"],"sol":"0..|011|033|23./...|014|214|224"}
  },
  {
    id: "pack-g14",
    title: "The Cherry Block",
    diff: 2,
    text: "A figure of 18 cubes, sawn into five pieces. Put it back together.",
    explain: "The computer finds 10 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["O4","T","A","V","I3"],"sol":"4442|3300|..00/1112|3122|...."}
  },
  {
    id: "pack-tetra-two",
    title: "Eight Tetracubes, Two in Place",
    diff: 3,
    text: "The eight tetracubes into a 4 × 4 × 2 box, with two already in place.",
    explain: "The computer finds 695 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["I4","O4","L","T","Z","A","B","P"],"sol":"1105|4305|4406|7406/1155|3332|7222|7766","given":[0,4]}
  },
  {
    id: "pack-tetracubes",
    title: "The Eight Tetracubes",
    diff: 3,
    text: "All eight tetracubes — the straight I, the square O, the L, T and Z, the two twists and the tripod — fill a box of 4 × 4 × 2 cubes. Pack them.",
    hints: ["The straight I and the square O are the easiest to fit: leave them for the end.","The three pieces that do not lie flat — the twists and the tripod — each need both layers of the box."],
    explain: "The computer finds 695 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["I4","O4","L","T","Z","A","B","P"],"sol":"0711|0664|0654|0333/7711|2755|2654|2234"}
  },
  {
    id: "pack-penta-brick",
    title: "The Pentacube Brick",
    diff: 3,
    text: "Six pentacubes — pieces of five cubes — fill a brick of 5 × 3 × 2.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    data: {"pieces":["N5","U5","Q3","Q4","Q5","Q6"],"sol":"10002|00432|14445/13222|13335|14555"}
  },
  {
    id: "pack-g12",
    title: "The Ebony Block",
    diff: 3,
    text: "The six pieces fit together into this figure of 24 cubes. Show how.",
    explain: "The computer finds 10 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["I4","O4","L","Z","B","P"],"sol":"340|330|230|110/24.|244|255|115/...|...|..5|..."}
  },
  {
    id: "pack-g15",
    title: "The Sycamore Block",
    diff: 3,
    text: "Five pieces, 19 cubes, one figure. Every cube filled exactly once.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["I4","O4","L","P","I3"],"sol":"0000|211.|211./.444|.3..|233./....|....|23.."}
  },
  {
    id: "pack-g18",
    title: "The Poplar Block",
    diff: 3,
    text: "A figure of 35 cubes, sawn into seven pieces. Put it back together.",
    explain: "The computer finds 6 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["F5","P5","V5","Q6","Q8","Q11","Q15"],"sol":"11124|3332.|3222./11444|3645.|6665./.055.|0005.|.60.."}
  },
  {
    id: "pack-g19",
    title: "The Cypress Block",
    diff: 3,
    text: "Seven pieces, 35 cubes, one figure. Every cube filled exactly once.",
    explain: "The computer finds 10 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["P5","Y5","Q1","Q6","Q9","Q10","Q15"],"sol":"63000|33002|.1111/66222|63552|...14/6.554|.3544|....4"}
  },
  {
    id: "pack-g21",
    title: "The Willow Block",
    diff: 3,
    text: "Build the figure of 45 cubes with these nine pieces.",
    explain: "The computer finds 200 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["P5","T5","V5","Q5","Q6","Q7","Q10","Q14","Q15"],"sol":"557.|5566|1862|1112|1222/.57.|.876|8886|3334|3444/....|..77|..00|.300|..04"}
  },
  {
    id: "pack-g27",
    title: "The Pear Block",
    diff: 3,
    text: "Seven pieces, 31 cubes, one figure. Every cube filled exactly once. The figure is shown as a smooth shell: count its cubes yourself.",
    explain: "The computer finds 100 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["L","T","A","B","Q1","Q3","Q4"],"sol":"5546|5000|.210|.111/.546|3226|3266|..../.54.|3344|....|....","show":"shell"}
  },
  {
    id: "pack-long-box",
    title: "The Long Box",
    diff: 4,
    text: "The eight tetracubes again, this time into a long box of 8 × 2 × 2.",
    hints: ["Everything must fit into a column two cubes wide: the flat pieces stand on edge."],
    explain: "The computer finds 112 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["I4","O4","L","T","Z","A","B","P"],"sol":"63715544|33310000/67715442|66715222"}
  },
  {
    id: "pack-slothouber",
    title: "The Slothouber–Graatsma Cube",
    diff: 4,
    source: "Named after the Dutch designers Jan Slothouber and William Graatsma.",
    text: "Six flat blocks of 1 × 2 × 2 and three single cubes fill a 3 × 3 × 3 cube. It looks easy.",
    hints: ["Think about where the three single cubes can go: any 2 × 2 × 1 block placed next to the centre blocks a lot.","The three single cubes lie on one long diagonal of the cube — corner, centre, opposite corner."],
    explain: "Apart from turning the cube over, there is only one way: the three single cubes sit on a long diagonal of the cube, and the six blocks wind around them in a pinwheel. The computer confirms it is the only solution.",
    concepts: ["exact-cover"],
    data: {"pieces":["O4","O4","O4","O4","O4","O4","M1","M1","M1"],"sol":"700|100|122/334|164|122/334|554|558"}
  },
  {
    id: "pack-flat-twelve",
    title: "The Flat Twelve",
    diff: 4,
    text: "The twelve pentominoes, given the thickness of one cube, fill a box of 5 × 4 × 3. On paper they are flat shapes; here you may stand them on edge and turn them any way at all.",
    hints: ["The X (the plus sign) fits in very few places. Put it in first.","Stand some pieces upright: a flat layer of the box cannot hold whole pieces everywhere."],
    explain: "The computer finds 25 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["F5","I5","L5","N5","P5","T5","U5","V5","W5","X5","Y5","Z5"],"sol":"66944|69997|66927|22227/35844|35887|55588|11111/00bb4|300b7|30abb|3aaaa"}
  },
  {
    id: "pack-flat-wide",
    title: "The Wide Twelve",
    diff: 4,
    text: "The twelve flat pentacubes again, this time into a box of 6 × 5 × 2.",
    explain: "The computer finds 25 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["F5","I5","L5","N5","P5","T5","U5","V5","W5","X5","Y5","Z5"],"sol":"444883|278803|278003|277700|211111/44b666|bbb656|b95553|999a53|29aaaa"}
  },
  {
    id: "pack-penta-nine",
    title: "Nine Pentacubes",
    diff: 4,
    text: "Nine pentacubes, some flat and some twisted, fill a box of 5 × 3 × 3.",
    explain: "The computer finds 13 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["P5","U5","V5","W5","X5","Q3","Q5","Q15","Q16"],"sol":"15300|14600|26660/15338|44478|26777/15533|14588|22278"}
  },
  {
    id: "pack-penta-ten",
    title: "Ten in a Tray",
    diff: 4,
    text: "Ten pentacubes pack into a square tray of 5 × 5, two cubes deep.",
    explain: "The computer finds 13 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["L5","P5","U5","W5","Q2","Q4","Q7","Q10","Q15","Q17"],"sol":"88894|08994|07634|07331|03351/28299|22244|77661|75661|05551"}
  },
  {
    id: "pack-g16",
    title: "The Cedar Block",
    diff: 4,
    text: "The six pieces fit together into this figure of 30 cubes. Show how.",
    explain: "The computer finds 2 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["I5","Q8","Q9","Q10","Q12","Q14"],"sol":"00000|.4412|3344.|.3.../...22|.1112|31452|.3.../.....|.55..|..55.|....."}
  },
  {
    id: "pack-g17",
    title: "The Larch Block",
    diff: 4,
    text: "Build the figure of 30 cubes with these six pieces.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["L5","X5","Q10","Q13","Q14","Q17"],"sol":"..02|3302|4301|400./..22|4421|4331|.551/....|....|55.1|.5.."}
  },
  {
    id: "pack-g20",
    title: "The Hornbeam Block",
    diff: 4,
    text: "The six pieces fit together into this figure of 30 cubes. Show how.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["L5","P5","T5","U5","X5","Q8"],"sol":"..353|.2333|.2111|22211/...5.|.4.5.|44455|.4.../.....|.0...|.0000|....."}
  },
  {
    id: "pack-g23",
    title: "The Alder Block",
    diff: 4,
    text: "Eight pieces, 40 cubes, one figure. Every cube filled exactly once.",
    explain: "The computer finds 17 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["F5","L5","U5","W5","Y5","Q10","Q11","Q14"],"sol":".201.|11115|3275.|3776./.20..|32055|3205.|7766./.4...|340..|446..|.46.."}
  },
  {
    id: "pack-g25",
    title: "The Boxwood Block",
    diff: 4,
    text: "Build the figure of 31 cubes with these seven pieces. The figure is shown as a smooth shell: count its cubes yourself.",
    explain: "The computer finds 36 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["O4","L","T","A","Q1","Q3","Q5"],"sol":"0055|245.|2256|2666/0015|441.|431.|436./....|....|..1.|.33.","show":"shell"}
  },
  {
    id: "pack-g26",
    title: "The Aspen Block",
    diff: 4,
    text: "A figure of 32 cubes, sawn into seven pieces. Put it back together. The figure is shown as a smooth shell: count its cubes yourself.",
    explain: "The computer finds 51 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["Z","A","P","Q3","Q4","Q5","Q6"],"sol":"451|451|446|666/411|355|220|.26/333|350|.20|.../...|..0|...|...","show":"shell"}
  },
  {
    id: "pack-v02",
    title: "Shadows of Plum",
    diff: 4,
    text: "Three shadows, one hidden figure. Work out its shape from the views, then build it. (All eight tetracubes, 32 cubes.)",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 10, 10, 10, 2 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it: it is the only figure of 32 cubes that casts them.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["I4","O4","L","T","Z","A","B","P"],"sol":"55|56|66|11|11/05|06|02|07|77/42|42|32|33|37/..|4.|4.|..|..","show":"views"}
  },
  {
    id: "pack-v03",
    title: "Shadows of Pine",
    diff: 4,
    text: "The figure is hidden; its shadows on the two walls and the table are all you get. Build the one figure that casts them. (All eight tetracubes, 32 cubes.)",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 15, 11, 6 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it: it is the only figure of 32 cubes that casts them.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["I4","O4","L","T","Z","A","B","P"],"sol":"2110|2110|6440|66.0/....|2553|4433|76.3/....|25..|75..|77..","show":"views"}
  },
  {
    id: "pack-flat-long",
    title: "The Long Twelve",
    diff: 5,
    text: "The twelve flat pentacubes into a long box of 10 × 3 × 2 — the tightest of the three boxes.",
    hints: ["The X needs room around its middle: the box is only three wide and two high, so the X must lie across it."],
    explain: "The computer finds 12 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["F5","I5","L5","N5","P5","T5","U5","V5","W5","X5","Y5","Z5"],"sol":"6533300777|65553300a7|6522220447/69bb811111|999b88aaaa|692bb88444"}
  },
  {
    id: "pack-thirteen",
    title: "Thirteen Pieces, Sixty-Four Cubes",
    diff: 5,
    text: "Twelve pentacubes and one tetracube fill a 4 × 4 × 4 cube. Commercial puzzles such as the Bedlam cube pack thirteen pieces into the same box; this set is our own.",
    hints: ["Start with the pieces that do not lie flat: they are hardest to fit once the box fills up."],
    explain: "The computer finds 4 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    data: {"pieces":["F5","L5","U5","V5","W5","X5","Y5","Q2","Q5","Q8","Q11","Q12","T"],"sol":"8881|0899|000a|6022/b581|5559|45aa|6aa2/bb71|4b79|4c79|6622/4b11|4773|ccc3|6333"}
  },
  {
    id: "pack-conway",
    title: "Conway's Box",
    diff: 5,
    source: "A packing puzzle of John Horton Conway.",
    text: "Thirteen bricks of 1 × 2 × 4, one 2 × 2 × 2 cube, one 2 × 2 × 1 block and three rods of 1 × 1 × 3 fill a 5 × 5 × 5 box. Conway's puzzle is famous for being much harder than it looks.",
    hints: ["The small pieces — the three rods, the cube and the square block — decide everything. Place them first; the bricks will follow.","Try the three rods pointing in three different directions, well apart from each other."],
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    data: {"pieces":["K8","K8","K8","K8","K8","K8","K8","K8","K8","K8","K8","K8","K8","C8","O4","I3","I3","I3"],"sol":"fff00|2dd00|2dd00|2ee00|21111/33445|2ddh5|2ddh6|2eeh6|21111/33445|789a5|789a6|789a6|789ag/33445|789a5|789a6|789a6|789ag/33445|bbbb5|bbbb6|cccc6|ccccg"}
  },
  {
    id: "pack-g22",
    title: "The Holly Block",
    diff: 5,
    text: "A figure of 40 cubes, sawn into eight pieces. Put it back together.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["P5","T5","V5","W5","Q2","Q4","Q6","Q15"],"sol":"3000.|3357.|13377|1117.|1444./500..|555..|2227.|264..|2.4../.....|.6...|.6...|66...|....."}
  },
  {
    id: "pack-g24",
    title: "The Yew Block",
    diff: 5,
    text: "The nine pieces fit together into this figure of 45 cubes. Show how.",
    explain: "As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).",
    concepts: ["exact-cover"],
    tags: ["grown"],
    data: {"pieces":["L5","T5","X5","Y5","Q8","Q9","Q11","Q12","Q15"],"sol":"...2.|.3222|63825|3388.|.38../...4.|.0000|60555|6685.|.67../...4.|1..4.|11144|1.77.|.77.."}
  },
  {
    id: "pack-g28",
    title: "The Spruce Block",
    diff: 5,
    text: "The seven pieces fit together into this figure of 31 cubes. Show how. The figure is shown as a smooth shell: count its cubes yourself.",
    explain: "The computer finds 2 essentially different ways (turnings and mirror images of the whole figure counted once).",
    concepts: ["exact-cover"],
    tags: ["grown","shell"],
    data: {"pieces":["I4","T","B","P","Q1","Q2","Q3"],"sol":".663|444.|5552|.522/.633|.643|.642|.5../.01.|.011|.01.|.0..","show":"shell"}
  },
  {
    id: "pack-v01",
    title: "Shadows of Linden",
    diff: 5,
    text: "The eight tetracubes build a figure of 32 cubes — but only its three shadows are shown: front on the back wall, side on the side wall, top on the table. Exactly one figure casts them all. Build it.",
    hints: ["The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.","Counting from the table up, the layers have 24, 8 cubes."],
    explain: "Every cube the three shadows allow is part of the figure, so the shadows fix it: it is the only figure of 32 cubes that casts them.",
    concepts: ["exact-cover","projection"],
    tags: ["views"],
    data: {"pieces":["I4","O4","L","T","Z","A","B","P"],"sol":"00002|37552|37752|344.6|11446/.....|.....|37.52|.....|11.66","show":"views"}
  }
]);
