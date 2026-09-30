/* The Puzzle Cabinet · tools/gen/shade-pictures.js
 *
 * Pixel pictures for the nonograms (tools/gen/shade-nonograms.js). One
 * letter per cell: '.' empty, any other letter filled, in the colour it names
 * (see PAL in engines/shade.js): K ink, R red, O orange, Y yellow, G green,
 * D dark green, B blue, L light blue, N brown, T tan, P pink, V violet,
 * W white, E grey, A dark grey, S skin, M maroon, C teal, F lime,
 * H dark brown, I coral, U navy, X cream.
 *
 * Only filled/empty matters for the puzzle, so every picture must read as a
 * silhouette; the colours are the reward. `title` is shown before solving
 * (a hint, never the answer); `name` is revealed after.
 */
'use strict';

const P = [];
const pic = (name, title, art) => P.push({ name, title, art: art.trim().split(/\s+/) });

/* ---------- tiny ones (5 × 5) ---------- */

pic('a heart', 'Be Mine', `
.R.R.
RRRRR
RRRRR
.RRR.
..R..`);

pic('a fir tree', 'Evergreen', `
..G..
.GGG.
GGGGG
..N..
.NNN.`);

pic('a little house', 'Home Sweet Home', `
..R..
.RRR.
RRRRR
.TNT.
.TNT.`);

pic('a toadstool', 'Room for One', `
.RRR.
RRWRR
RRRRR
..X..
.XXX.`);

pic('an arrow', 'This Way Up', `
..B..
.BBB.
B.B.B
..B..
..B..`);

/* ---------- small (about 10 × 10) ---------- */

pic('a teacup', 'Steeped in Tradition', `
...E..E...
..E..E....
...E..E...
.LLLLLLL..
.LLLLLLLLL
.LLLLLLL.L
.LLLLLLLLL
..LLLLL...
BBBBBBBBB.
.BBBBBBB..`);

pic('a cat', 'Nine Lives', `
O........O
OO......OO
OOO....OOO
OOOOOOOOOO
OO.OOOO.OO
OO.OOOO.OO
OOOOPPOOOO
.OOOOOOOO.
..OOOOOO..
...OOOO...`);

pic('a fish', 'Something Fishy', `
....OOOO....
..OOOOOOOO.O
.OO.OOOOOOOO
OOOOOOOOOOO.
.OOOOOOOOOOO
..OOOOOOOO.O
....OOOO....`);

pic('an apple', 'Keeps the Doctor Away', `
.....N....
....N.GG..
..RRNRRG..
.RRRRRRRR.
RRRRRRRRRR
RRRRRRRRRR
RRRRRRRRRR
.RRRRRRRR.
.RRRRRRRR.
..RR..RR..`);

pic('a spotted mushroom', 'Fun Guy', `
...RRRR...
.RRWRRRRR.
RRWWRRRWRR
RRRRRRWWRR
RWRRRRRRRR
RRRRRRRRRR
...XXXX...
...XXXX...
...XXXX...
..XXXXXX..`);

pic('an umbrella', 'Rainy Day Friend', `
....K....
..BBBBB..
.BBBBBBB.
BBBBBBBBB
B.B.K.B.B
....K....
....K....
....K....
..K.K....
...K.....`);

pic('an anchor', 'Ship Shape', `
....UU....
...U..U...
....UU....
..UUUUUU..
....UU....
....UU....
U...UU...U
UU..UU..UU
.UUUUUUUU.
...UUUU...`);

pic('a house with a chimney', 'Bricks and Mortar', `
....RR....
...RRRR.N.
..RRRRRRNN
.RRRRRRRR.
RRRRRRRRRR
.TTTTTTTT.
.T..TTNNT.
.T..TTNNT.
.TTTTTNNT.
.TTTTTNNT.`);

pic('a rocket', 'Countdown', `
....RR....
...RRRR...
...EEEE...
...E..E...
...EEEE...
...EEEE...
..REEEER..
.RREEEERR.
.R..OO..R.
....YY....`);

pic('a rubber duck', 'Bath Time', `
..YYY.....
.YYYYY....
.YY.YYOO..
.YYYYYOOO.
..YYYY....
.YYYYYY..Y
YYYYYYYYYY
YYYYYYYYYY
.YYYYYYYY.
..YYYYYY..`);

pic('a ghost', 'Boo!', `
...WWWW...
..WWWWWW..
.WWWWWWWW.
.WW.WW.WW.
.WW.WW.WW.
.WWWWWWWW.
.WWWWWWWW.
.WWW..WWW.
.WWWWWWWW.
.WW.WW.WW.`);

pic('a crescent moon and a star', 'Goodnight', `
...YYYY...
..YYY.....
.YYY......
.YY....Y..
YYY...YYY.
YYY....Y..
.YY.......
.YYY......
..YYY.....
...YYYY...`);

pic('a bell', 'Ding Dong', `
....Y....
...YYY...
..YYYYY..
..YYYYY..
..YYYYY..
.YYYYYYY.
YYYYYYYYY
.........
....O....`);

pic('a cactus', 'Prickly Customer', `
....GG....
....GG....
.G..GG....
.G..GG..G.
.GG.GG..G.
..GGGG.GG.
....GGGG..
....GG....
..NNNNNN..
...NNNN...`);

pic('a crown', 'Heavy Is the Head', `
Y...YY...Y
YY..YY..YY
YYY.YY.YYY
YYYYYYYYYY
YRYYBBYYRY
YYYYYYYYYY
YYYYYYYYYY`);

pic('a candle', 'Burning the Midnight Oil', `
...O...
..OYO..
..OYO..
...K...
.RRRRR.
.RRRRR.
.RRRRR.
.RRRRR.
.RRRRR.
NNNNNNN`);

pic('a light bulb', 'Eureka!', `
..YYYY..
.YYYYYY.
YYYYYYYY
YYY..YYY
YYY..YYY
.YYYYYY.
..YYYY..
..EEEE..
..EEEE..
...EE...`);

pic('two musical notes', 'Easy Listening', `
...VVVVVV.
...VVVVVV.
...V....V.
...V....V.
...V....V.
...V....V.
.VVV..VVV.
VVVV.VVVV.
VVV..VVV..
.V....V...`);

pic('a butterfly', 'Flutter By', `
...K...K...
....K.K....
VVV..K..VVV
VVVV.K.VVVV
VVYVVKVVYVV
.VVVVKVVVV.
..VVVKVVV..
.VVVVKVVVV.
VVVV.K.VVVV
.VV..K..VV.`);

pic('an envelope with a stamp', 'You\'ve Got Mail', `
WWWWWWWWWWWW
WW........WW
W.WW....WW.W
W...WWWW...W
W..........W
W.......RR.W
W.......RR.W
WWWWWWWWWWWW`);

pic('a padlock', 'Under Lock and Key', `
..EEEE..
.E....E.
.E....E.
.E....E.
YYYYYYYY
YYYYYYYY
YYY..YYY
YYY..YYY
YYYYYYYY
YYYYYYYY`);

pic('a trophy', 'Champion', `
YYYYYYYYYY
Y.YYYYYY.Y
Y.YYYYYY.Y
.YYYYYYYY.
...YYYY...
....YY....
....YY....
...YYYY...
..NNNNNN..
..NNNNNN..`);

pic('an ice-cream cone', 'Brain Freeze', `
...RR...
..PPPP..
.PPPPPP.
PPPPPPPP
PPPPPPPP
.TTTTTT.
.TTTTTT.
..TTTT..
..TTTT..
...TT...
...TT...`);

pic('a rabbit', 'Hare Today', `
.WW..WW.
.WW..WW.
.WW..WW.
.WWWWWW.
WWWWWWWW
WW.WW.WW
WWWWWWWW
WWWPPWWW
.WWWWWW.
..WWWW..`);

pic('an owl', 'Night Watch', `
N........N
NNN....NNN
NNNNNNNNNN
N..NNNN..N
N..NNNN..N
NNNNOONNNN
NNTTNNTTNN
.NTTTTTTN.
.NNTTTTNN.
..O.OO.O..`);

pic('a penguin', 'Dressed for Dinner', `
...KKKK...
..KKKKKK..
..K.KK.K..
..KKOOKK..
.KKWWWWKK.
KKKWWWWKKK
KKWWWWWWKK
.KWWWWWWK.
..WWWWWW..
.OO....OO.`);

pic('a spade', 'Call a Spade a Spade', `
...K...
..KKK..
.KKKKK.
KKKKKKK
KKKKKKK
.K.K.K.
...K...
..KKK..`);

pic('a tulip', 'Tiptoe', `
.R.R.R.
.RRRRR.
.RRRRR.
..RRR..
...G...
G..G..G
GG.G.GG
.GGGGG.
...G...
..NNN..`);

pic('the sun', 'Sunny Side Up', `
Y...Y...Y
.Y..Y..Y.
..YYYYY..
..YYYYY..
YYYYYYYYY
..YYYYY..
..YYYYY..
.Y..Y..Y.
Y...Y...Y`);

pic('a rain cloud', 'Under the Weather', `
...EEE....
.EEEEEEE..
EEEEEEEEEE
.EEEEEEEE.
..........
.B..B..B..
..B..B..B.
.B..B..B..`);

pic('a lightning bolt', 'Flash', `
....YYY
...YYY.
..YYY..
.YYYYYY
...YYY.
..YYY..
.YYY...
YY.....`);

pic('a car', 'Road Trip', `
...RRRR...
..R.RR.R..
.RRRRRRRRR
RRRRRRRRRR
RRRRRRRRRR
.KK....KK.`);

pic('a paw print', 'Pitter Patter', `
..NN..NN..
..NN..NN..
NN......NN
NN......NN
...NNNN...
..NNNNNN..
.NNNNNNNN.
.NNNNNNNN.
..NN..NN..`);

pic('a pair of glasses', 'Four Eyes', `
KKKKK..KKKKK
K...KKKK...K
K...K..K...K
K...K..K...K
KKKKK..KKKKK`);

pic('an hourglass', 'Time Flies', `
NNNNNNNN
.W....W.
.WYYYYW.
..WYYW..
...WW...
...WW...
..W..W..
.W.YY.W.
.WYYYYW.
NNNNNNNN`);

pic('a robot', 'Beep Boop', `
....R....
....E....
.EEEEEEE.
.E.EEE.E.
.EEEEEEE.
.EE...EE.
..EEEEE..
EEEEEEEEE
E.EEEEE.E
..E...E..`);

pic('a Christmas tree', 'Deck the Halls', `
....Y....
....G....
...GGG...
..GRGGG..
...GGG...
..GGGBG..
.GGGGGGG.
GGRGGGGRG
....N....
...NNN...`);

pic('a star', 'Twinkle Twinkle', `
....Y....
....Y....
...YYY...
YYYYYYYYY
.YYYYYYY.
..YYYYY..
..YYYYY..
.YYY.YYY.
.YY...YY.
YY.....YY`);

pic('a pear', 'Pear-Shaped', `
....N...
....NG..
...FF...
..FFFF..
..FFFF..
.FFFFFF.
FFFFFFFF
FFFFFFFF
.FFFFFF.
..FFFF..`);

pic('a strawberry', 'Summer Fruit', `
..G.G.G..
...GGG...
.RRRRRRR.
RRYRRRYRR
RRRRRYRRR
.RYRRRRR.
.RRRRYRR.
..RRRRR..
...RRR...
....R....`);

pic('a balloon', 'Up, Up and Away', `
..RRRR..
.RRRRRR.
RRRRRRRR
RRRRRRRR
RRRRRRRR
.RRRRRR.
..RRRR..
...RR...
....E...
...E....
....E...`);

pic('a key', 'Opens Doors', `
.YYYY.......
YY..YY......
Y....YYYYYYY
Y....YYYYYYY
YY..YY.Y.YY.
.YYYY..Y.YY.`);

pic('a sailboat', 'Plain Sailing', `
....K.....
....KW....
....KWW...
...WKWWW..
..WWKWWW..
.WWWKWWWW.
....K.....
NNNNNNNNNN
.NNNNNNNN.
LLLLLLLLLL`);

pic('a snowman', 'Frosty', `
...KKK...
...KKK...
.KKKKKKK.
..WWWWW..
..W.W.W..
..WWOWW..
...WWW...
..WWWWW..
.WWWKWWW.
WWWWWWWWW
WWWWKWWWW
.WWWWWWW.`);

/* ---------- medium (about 15 × 15) ---------- */

pic('a chess knight', 'Moves in an L', `
.......KK......
......KKKK.....
.....KKKKKK....
....KKK.KKKK...
...KKKKKKKKKK..
..KKKKKKKKKKK..
.KKKKKKKKKKKK..
KKKKK..KKKKKK..
KKKK...KKKKKK..
.KK...KKKKKKK..
.....KKKKKKK...
....KKKKKKKK...
....KKKKKKKK...
..KKKKKKKKKKK..
.KKKKKKKKKKKKK.`);

pic('a lighthouse and a gull', 'Keeper of the Light', `
.......Y.......
K.K...KKK......
.K...KYYYK.....
.....KKKKK.....
......RRR......
......WWW......
.....RRRRR.....
.....WWWWW.....
.....RRRRR.....
....WWWWWWW....
....RRRRRRR....
....WWW.WWW....
...NNNNNNNNN...
..NNNNNNNNNNN..
LLLLLLLLLLLLLLL`);

pic('a teapot', 'Short and Stout', `
......NN.......
....BBBBBB.....
B..BBBBBBBB....
BB.BBBBBBBBBBB.
.BBBBBBBBBBB..B
..BBBBBBBBBB..B
..BBBBBBBBBBBB.
...BBBBBBBBB...
....BBBBBBB....
..NNNNNNNNNNN..`);

pic('an owl on a branch', 'Who Goes There?', `
.N...........N.
.NN.........NN.
.NNNNNNNNNNNNN.
NNN...NNN...NNN
NN..K..N..K..NN
NNN...NON...NNN
NNNNNNNONNNNNNN
.NNNTTTTTTTNNN.
.NNTTTTTTTTTNN.
.NNTTTTTTTTTNN.
..NNTTTTTTTNN..
..NNNTTTTTNNN..
...NNNNNNNNN...
....OO...OO....
HHHHHHHHHHHHHHH`);

pic('a turtle', 'Slow and Steady', `
.....DDDDD.....
...DDFDDDFDD...
..DFFFDDDFFFD..
.DDDDDDDDDDDD..
DDDDDDDDDDDDDGG
GGGGGGGGGGGGGGG
.GG.GG..GG.GG..`);

pic('an elephant', 'Never Forgets', `
....EEEEE......
..EEEEEEEEE....
.EEEEEEEEEEEE..
EEE.EEEEEEEEEE.
EEEEEEEEEEEEEEE
EE.EEEEEEEEEEEE
E..EEEEEEEEEEEE
E..EEEEEEEEEEEE
E...EEEEEEEEEE.
EE..EEE...EEE..
.E..EEE...EEE..
....EEE...EEE..`);

pic('a whale', 'Having a Whale of a Time', `
..L..L..........
...LL...........
..BBBBBBB.......
.BBBBBBBBBBB..BB
BB.BBBBBBBBBBBB.
BBBBBBBBBBBBBB..
.WWWWWBBBBBBB...
..WWWWWWBB......`);

pic('a hot-air balloon', 'Up in the Air', `
....RRRRR....
..RRYYRYYRR..
.RRYYRRRYYRR.
RRYYRRRRRYYRR
RRYYRRRRRYYRR
RRYYRRRRRYYRR
.RRYYRRRYYRR.
..RRYYRYYRR..
...RRYRYRR...
....E...E....
....E...E....
.....E.E.....
....NNNNN....
....NNNNN....
.....NNN.....`);

pic('a guitar', 'Six Strings', `
...KKK...
...KKK...
....N....
....N....
....N....
....N....
...OOO...
..OOOOO..
..OOOOO..
...OOO...
..OOOOO..
.OOO.OOO.
.OO...OO.
.OOO.OOO.
.OOOOOOO.
..OOOOO..`);

pic('an apple tree', 'Orchard', `
.....GGGGG.....
...GGGGGGGGG...
..GGGRGGGGGGG..
.GGGGGGGGGRGGG.
GGGGGGGGGGGGGGG
GGRGGGGGRGGGGGG
GGGGGGGGGGGGRGG
.GGGGRGGGGGGGG.
..GGGGGGGGGGG..
....GGNNGG.....
......NN.......
......NN.......
......NNN......
.....NNNNN.....
DDDDDDDDDDDDDDD`);

pic('a sailing ship', 'Ahoy!', `
.......R.......
.......K.......
...WWWWKWWW....
...WWWWKWWWW...
....WWWKWWWW...
...WWWWKWWWWW..
...WWWWKWWWWW..
....WWWKWWWWW..
.......K.......
NNNNNNNNNNNNNNN
.NNNNNNNNNNNNN.
..NNNNNNNNNNN..
LLLLLLLLLLLLLLL`);

pic('a watering can', 'Green Fingers', `
...............
....GGGGG......
...G.....G.....
...G.....G.....
.GGGGGGGGGG....
.GGGGGGGGGGG...
.GGGGGGGGGG.G..
.GGGGGGGGGG..G.
.GGGGGGGGGG...G
.GGGGGGGGGG..GG
.GGGGGGGGGG....
..GGGGGGGG.....`);

pic('a steaming mug of cocoa', 'Hot Chocolate', `
...E...E...E...
..E...E...E....
...E...E...E...
..E...E...E....
...............
.NNNNNNNNNNN...
.NNNNNNNNNNNNN.
.NNNNNNNNNN..NN
.NNNNNNNNNN...N
.NNNNNNNNNN..NN
.NNNNNNNNNNNNN.
..NNNNNNNNN....
...NNNNNNN.....`);

pic('a castle', 'An Englishman\'s Home', `
.R...............R.
.E...............E.
E.E.............E.E
EEE.E.E.E.E.E.E.EEE
EEEEEEEEEEEEEEEEEEE
EE.EEEEEEEEEEEEE.EE
EE.EEEE.EEE.EEEE.EE
EEEEEEE.EEE.EEEEEEE
EEEEEEEEEEEEEEEEEEE
EE.EEEEEENEEEEEE.EE
EE.EEEEENNNEEEEE.EE
EEEEEEENNNNNEEEEEEE
EEEEEEENNNNNEEEEEEE
LLLLLLLNNNNNLLLLLLL
LLLLLLLLLLLLLLLLLLL`);

pic('a ringed planet', 'Ringmaster', `
.......OOOOOO.......
.....OOOOOOOOOO.....
TTT.OOOOOOOOOOOO.TTT
.TTTTOOOOOOOOOOTTTT.
...TTTTTTTTTTTTTT...
.....OOOOOOOOOO.....
.......OOOOOO.......`);

pic('a big heart', 'Sweetheart', `
..RRR.....RRR..
.RRRRR...RRRRR.
RRPPRRR.RRRRRRR
RPPRRRRRRRRRRRR
RPRRRRRRRRRRRRR
RRRRRRRRRRRRRRR
.RRRRRRRRRRRRR.
..RRRRRRRRRRR..
...RRRRRRRRR...
....RRRRRRR....
.....RRRRR.....
......RRR......
.......R.......`);

/* ---------- large (up to 20 × 20) ---------- */

pic('a long-necked dinosaur', 'Terrible Lizard', `
.GGG................
GG.GG...............
GGGGGG..............
....GG..............
.....GG.............
......GG............
......GGGGGGG.......
.....GGGGGGGGGG.....
.....GGGGGGGGGGGG...
.....GGGGGGGGGGGGGGG
.....GG.GG...GG.GG..
.....GG.GG...GG.GG..`);

pic('a giraffe', 'Head in the Clouds', `
...Y.Y........
...YYY........
.YYYYY........
YYYY.Y........
YYYYYY........
...YYY........
....YYY.......
....YNY.......
.....YYY......
.....YNY......
......YYY.....
......YNYYYYY.
.....YYYYNYYYY
.....YNYYYYNYY
.....YYYYYYYY.
.....Y.Y..Y.Y.
.....Y.Y..Y.Y.
.....Y.Y..Y.Y.
.....Y.Y..Y.Y.
.....N.N..N.N.`);

pic('a crab', 'Sideways Walker', `
.RR..............RR.
RR.R............R.RR
RRRR............RRRR
.RR..............RR.
..R....K....K....R..
..RR...R....R...RR..
...RRRRRRRRRRRRRR...
..RRRRRRRRRRRRRRRR..
R.RRRRRRRRRRRRRRRR.R
.RRRRRRRRRRRRRRRRRR.
R..R.R........R.R..R
..R...R......R...R..`);

pic('an octopus', 'All Hands on Deck', `
.....VVVVVV.....
...VVVVVVVVVV...
..VVVVVVVVVVVV..
..VVVVVVVVVVVV..
.VVV..VVVV..VVV.
.VVV..VVVV..VVV.
.VVVVVVVVVVVVVV.
..VVVVVVVVVVVV..
..VVVVVVVVVVVV..
.VV.VV.VV.VV.VV.
VV..VV.VV.VV..VV
V..VV..VV..VV..V
V..V..VV.VV..V.V
.V.V..V...V..V.V
..VV.VV...VV.VV.
......V.....V...`);

pic('a windmill', 'Tilting at Giants', `
N.............N
.N...........N.
..N.........N..
...N.......N...
....N.....N....
.....N.R.N.....
......RRR......
.....NRRRN.....
....N.RRR.N....
...N..RRR..N...
..N..RRRRR..N..
.N...RR.RR...N.
N....RRRRR....N
....RRRRRRR....
....RR.R.RR....
....RRRRRRR....
...RRRRRRRRR...
...RRRNNNRRR...
...RRRNNNRRR...
DDDDDDDDDDDDDDD`);

pic('a city skyline', 'Concrete Jungle', `
.............E......
....EE.......E......
....EE......EEE.....
....EE......EEE.....
.EE.EE..EEE.E.E.EE..
.EE.EE..EEE.EEE.EE..
.EE.EEE.E.E.EEE.EEE.
EEE.EEE.EEE.EEEEEEE.
E.E.E.EEEEE.E.E.E.EE
EEEEEEEEEEEEEEEEEEEE
EE.EEEE.EEE.EEEE.EEE
EEEEEEEEEEEEEEEEEEEE`);

pic('mountains under the sun', 'Top of the World', `
..................Y.
......W..........YYY
.....WWW..........Y.
....WWEEE...........
...EEEEEEE....W.....
..EEEEEEEEE..WWE....
.EEEEEEEEEEEEEEEE...
EEEEEEEEEEEEEEEEEE..
EEEEEEEEEEEEEEEEEEEE
DDG.DDDGD.DGDD.GDD.D
DDDDDDDDDDDDDDDDDDDD
DDDDDDDDDDDDDDDDDDDD`);

pic('a snail', 'Slowcoach', `
...........NNNNN....
.........NNN...NNN..
........NN..NNN..NN.
........N..N...N..N.
.......NN.N..N..N.NN
.......N..N.NN..N..N
.......N..N....N..NN
.......NN..NNNN..NN.
........NN......NN..
.T.T.....NNNNNNNN...
..TT.TTTTTTTTTTTTTTT
..TTTTTTTTTTTTTTTTT.`);

pic('a steam train', 'Full Steam Ahead', `
..EE................
.EEEE...............
..EE................
...KK......RRRRRRR..
...KK......R.R.R.R..
.KKKKKKKKKKRRRRRRR..
KKKKKKKKKKKRRRRRRRR.
KKKKKKKKKKKKKKKKKKKK
.KKKKKKKKKKKKKKKKKK.
..AA..AA..AA..AA.AA.
..AA..AA..AA..AA.AA.`);

pic('a camera', 'Say Cheese', `
...KKK............
..KKKKK.......RR..
KKKKKKKKKKKKKKKKKK
KKKKKKKEEEEKKKKKKK
KKKKKKEE..EEKKKKKK
KKKKKEE.LL.EEKKKKK
KKKKKE.LLLL.EKKKKK
KKKKKE.LLLL.EKKKKK
KKKKKEE.LL.EEKKKKK
KKKKKKEE..EEKKKKKK
KKKKKKKEEEEKKKKKKK
KKKKKKKKKKKKKKKKKK`);

pic('a fox', 'Sly', `
O..............O
OO............OO
OOO..........OOO
OOOO........OOOO
OOOOOOOOOOOOOOOO
OOOOOOOOOOOOOOOO
OOO.OOOOOOOO.OOO
.OO..OOOOOO..OO.
.OOOOOOOOOOOOOO.
..WWOOOOOOOOWW..
...WWWOOOOWWW...
....WWWWWWWW....
.....WWWWWW.....
.......KK.......`);

pic('a sitting cat', 'Night Prowler', `
...K....K.......
...KK..KK.......
...KKKKKK.......
...K.KK.K.......
...KKKKKK.......
....KKKK........
....KKKK........
...KKKKKK.......
..KKKKKKKK......
..KKKKKKKK......
.KKKKKKKKKK.....
.KKKKKKKKKK.....
.KKKKKKKKKKK....
.KKKKKKKKKKK....
.KKKKKKKKKKK....
..KKKKKKKKKK....
..KKKKKKKKKK...K
..KKK.KK.KKK..KK
..KKKKKKKKKKKKK.
...KKKKKKKKKK...`);

pic('a rocket on the launch pad', 'Blast Off', `
.....RR.....
....RRRR....
...RRRRRR...
...EEEEEE...
...EEEEEE...
...EE..EE...
...E....E...
...E....E...
...EE..EE...
...EEEEEE...
...EEEEEE...
...EEEEEE...
..REEEEEER..
.RREEEEEERR.
RRREEEEEERRR
RR.EEEEEE.RR
R...O..O...R
...OYOOYO...
....OYYO....
.....OO.....`);

module.exports = P;
