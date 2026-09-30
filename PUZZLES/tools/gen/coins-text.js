/* The words for tools/gen/coins.js: statements, hints and explanations,
 * and the order the puzzles stand in the drawer (easiest first). */
'use strict';
module.exports = {
  _family: {
    blurb: 'Lift, slide and stack coins: turn one figure into another in the fewest moves, and make rows, squares and loops.',
    origin: { year: 1893, who: 'Victorian parlour puzzles', note: 'Coin puzzles fill the Victorian puzzle books — Professor Hoffmann gathered many in *Puzzles Old and New* (1893) — and the puzzle columns of the twentieth century. They need nothing but a handful of pennies and a table, which is exactly what is on the table here.' }
  },
  _order: [
    'coin-tri-3', 'coin-tri-6', 'coin-t-turn', 'coin-plus-x', 'coin-cross-rows', 'coin-eight-rows', 'coin-three-rows', 'coin-nine-eight', 'coin-nine-triangle', 'coin-touch-four',
    'coin-tri-10', 'coin-rhombus', 'coin-trapezoid', 'coin-row-flower', 'coin-tri-hexagon', 'coin-tall-h', 'coin-arrow', 'coin-l-j', 'coin-pyramid-9', 'coin-ring-triangle', 'coin-ring-para', 'coin-square-five', 'coin-square-six', 'coin-touch-ring', 'coin-touch-pairs',
    'coin-tri-15', 'coin-chevron', 'coin-h-to-o', 'coin-stairs', 'coin-para-ring', 'coin-row-triangle', 'coin-tri10-slide', 'coin-seven-six', 'coin-six-four', 'coin-star', 'coin-hexagram', 'coin-touch-loop8',
    'coin-tri-21', 'coin-pyramid-16', 'coin-triangle-ring', 'coin-row-flower-slide',
    'coin-row-ring', 'coin-orchard'
  ],

  /* ---- turning figures upside down ---- */
  'coin-tri-3': {
    text: 'Three coins lie in a little triangle, point at the top. Make the triangle point **down** by moving just one coin.',
    hints: ['Two of the coins are already a side of the upside-down triangle.'],
    explain: 'The bottom two coins stay; the top coin goes underneath them, into the dip between the two. Two thirds of the work was done before you started.',
    links: ['coin-tri-6', 'coin-tri-10']
  },
  'coin-tri-6': {
    text: 'Six coins make a triangle: one, two, three. Turn it upside down — three, two, one — by moving **two** coins.',
    hints: ['The top coin can stay exactly where it is: it becomes the middle of the new top row.', 'The coins that have least to do with the new triangle are the two bottom corners.'],
    explain: 'Lift the two bottom corners and lay them on either side of the top coin. The four coins in the middle — a little diamond — belong to both triangles and never move.',
    links: ['coin-tri-3', 'coin-tri-10']
  },
  'coin-tri-10': {
    source: 'A classic penny puzzle, reprinted in puzzle columns for a century.',
    text: 'Ten coins make a triangle pointing up — one, two, three, four, like bowling pins. Make it point **down** by moving only **three** coins.',
    hints: ['Seven coins can stay where they are.', 'Only the three corner coins move.'],
    explain: 'Move just the corners. The two bottom corners go to the ends of the second row, which becomes the new top row of four; the top coin goes underneath the middle of the old bottom row, where it becomes the new point. The seven coins in the middle — a little flower, six round one — belong to both triangles.',
    links: ['coin-tri-6', 'coin-tri-15', 'coin-tri10-slide'],
    tags: ['classic']
  },
  'coin-tri-15': {
    text: 'Fifteen coins make a triangle with five on its bottom row. Turn it upside down in **five** moves.',
    hints: ['Ten coins can stay put — find the biggest piece the two triangles can share.', 'The new top row of five sits on the old second row, stretched out at both ends.'],
    explain: 'Put the new triangle so that its top row of five lies along the old second row (two coins already there, three more added), and its point lands one row below the old base. Then ten coins sit in both triangles, and only five — the old point and four from the bottom and the right-hand side — have to move.',
    links: ['coin-tri-10', 'coin-tri-21']
  },
  'coin-tri-21': {
    text: 'Twenty-one coins, six on the bottom row. Turn the triangle upside down in **seven** moves.',
    hints: ['Fourteen coins can stay.', 'As with the smaller triangles, the new top row lies along one of the old rows near the top, stretched out at both ends.'],
    explain: 'Place the upside-down triangle to overlap the old one as much as possible — fourteen coins — and move the other seven. For the triangles here, with 2 to 6 rows, the fewest moves are 1, 2, 3, 5 and 7: the whole number part of n(n+1)/6 for n rows.',
    links: ['coin-tri-15', 'coin-tri-10']
  },
  'coin-rhombus': {
    text: 'Nine coins make a lozenge: three rows of three, each row set half a coin to the right of the one above. Make it lean the other way — each row half a coin to the **left** of the one above — by moving two coins.',
    hints: ['Only the two sharp corners of the lozenge are in the wrong place.'],
    explain: 'The top-left coin moves to the left end of the bottom row, and the bottom-right coin to the right end of the top row. The seven that stay make a flower — six round one — which leans neither way.',
    links: ['coin-tri-hexagon']
  },
  'coin-trapezoid': {
    text: 'Nine coins stand like a table seen from the side: two on top, three below them, four on the floor. Turn the table upside down — four, three, two — by moving two coins.',
    hints: ['The middle row of three can stay.'],
    explain: 'Lift the two ends of the long bottom row and set them at the two ends of the short top row. The top row grows to four, the bottom shrinks to two, and the middle row never notices.',
    links: ['coin-tri-10']
  },
  'coin-chevron': {
    text: 'Eight coins fly in a V like a skein of geese: two arms of four meeting at the bottom. Make the V point **up** — keep the same shape — moving only four coins.',
    hints: ['Half the geese need not move at all.', 'Look at one arm of the V: which way does it slope? The upside-down V has an arm sloping the same way.'],
    explain: 'The left arm of the V slopes down to the right — exactly like the right arm of the upturned V. So leave that arm where it is and fly the four geese of the other arm round to make the new left arm.',
    links: ['coin-arrow']
  },
  'coin-row-flower': {
    text: 'Seven coins lie in a straight row. Make a flower — six coins in a ring around a seventh — in four moves.',
    hints: ['The flower has a straight line of three through its middle.'],
    explain: 'Any three neighbours of the row can stay as the middle line of the flower; the other four become the petals, two above and two below. Four moves is the least, since no four coins of a flower lie in a straight row.',
    links: ['coin-row-flower-slide']
  },
  'coin-tri-hexagon': {
    text: 'Ten coins make a triangle: one, two, three, four. Make a fat hexagon of rows three, four, three by moving just two coins.',
    hints: ['Take coins off two corners and put them back on the other side.'],
    explain: 'Take the top coin off the point and one corner off the bottom row, and add them at the far ends of the second and third rows on the other side. Rows 2, 3, 4 become 3, 4, 3.',
    links: ['coin-tri-10', 'coin-rhombus']
  },

  /* ---- square lattice ---- */
  'coin-t-turn': {
    text: 'Seven coins make a T: a bar of five with a stem of two below its middle. Turn the T upside down by moving two coins.',
    hints: ['Which is shorter to move: the bar or the stem?'],
    explain: 'The bar stays; the two stem coins go above its middle. Moving the bar would take five moves.',
    links: ['coin-arrow']
  },
  'coin-plus-x': {
    text: 'Five coins make a plus sign. Turn it into a **times** sign — a coin in the middle and one at each corner — by moving two coins.',
    hints: ['The × does not have to be centred where the + was.', 'Could one arm of the plus be the middle of the ×?'],
    explain: 'Keep three coins: the top, the bottom and one side arm of the plus. The side arm becomes the middle of the ×, the top and bottom coins its two corners on one side, and the two coins you move make the corners on the other side.'
  },
  'coin-h-to-o': {
    text: 'Eight coins spell an **H**: two legs of three joined by a bar of two. Rearrange them into an **O** — a square ring of eight around an empty middle, three by three — in four moves.',
    hints: ['The O is narrower than the H: one leg of the H can be one side of the O.', 'One of the crossbar coins already sits exactly where the far side of the O goes.'],
    explain: 'Keep the left leg and the crossbar coin next to the right leg: they are the left side and the middle of the right side of the O. The other four — the whole right leg and the other crossbar coin — move to finish the top and bottom.',
    links: ['coin-tall-h']
  },
  'coin-tall-h': {
    text: 'Ten coins make a tall H: legs of four with the bar across the third row. Turn it into an O — a ring of ten, three one way and four the other — by moving just two coins. The O may lie any way round.',
    hints: ['An O lying on its side is four wide — as wide as the H.'],
    explain: 'Lay the O on its side: the top of the legs and the bar already make three sides of it. Move the two feet up to fill the gap in the top row.',
    links: ['coin-h-to-o']
  },
  'coin-arrow': {
    text: 'Nine coins make an arrow pointing up: a tip, a row of three below it, a wide row of three, and a shaft of two. Make it point **down** by moving two coins.',
    hints: ['Seven of the nine coins can stay: look at the arrow upside down in your mind.'],
    explain: 'The upright line of five coins — tip, middle, shaft — is the same either way up, and so is the wide row across its middle. Only the two outer coins of the row of three below the tip must cross to the other side of the wide row.',
    links: ['coin-t-turn', 'coin-chevron']
  },
  'coin-l-j': {
    text: 'Six coins make an **L**: an upright of four with a foot of two to the right. Make it face the other way — foot to the left — by moving two coins.',
    hints: ['The upright can stay.'],
    explain: 'Keep the upright and swing the two foot coins round to the left side of its bottom coin. (Turning the whole letter over would be much more work.)'
  },
  'coin-pyramid-9': {
    text: 'Nine coins make a stepped pyramid on the square lattice: one on top, then three, then five. Stand it on its head — five on top, then three, then one — in three moves.',
    hints: ['The new pyramid does not have to be centred where the old one was.', 'Six coins can stay: the old row of three and three coins of the base.'],
    explain: 'Build the new pyramid one place to the side. The old row of three, stretched by two coins, becomes the new top row of five; three coins of the old base are its middle row; one more coin goes underneath as the point. Six stay, three move.',
    links: ['coin-pyramid-16', 'coin-tri-10']
  },
  'coin-pyramid-16': {
    text: 'Sixteen coins make a bigger stepped pyramid: one, three, five, seven. Stand it on its head in five moves.',
    hints: ['The old rows of three and five can both stay.'],
    explain: 'Keep the middle rows. Take two coins from each end of the base to stretch the row of three into a new top row of seven; the old row of five stays as the next row; the three coins left of the base are the row of three; and the old tip goes underneath to be the new point.',
    links: ['coin-pyramid-9']
  },
  'coin-stairs': {
    text: 'Ten coins make a staircase climbing to the left: rows of one, two, three and four, lined up on the left. Make it go the other way — rows of four, three, two, one, still lined up on the left — in three moves.',
    hints: ['Move the whole staircase down one row in your mind.'],
    explain: 'Let the new staircase start one row lower. The old row of three stays as it is. The two right-hand coins of the bottom step go up to lengthen the old row of two into the new top step of four; the bottom step keeps its two left coins; and the old top coin goes underneath them all.'
  },

  /* ---- sliding ---- */
  'coin-ring-triangle': {
    text: 'Six coins lie in a ring around an empty space. Make a triangle — one, two, three — in two moves. Coins may only **slide** along the table, never jump over or push others, and each coin you move must come to rest **touching at least two** others.',
    hints: ['One coin must end up in the middle of the ring.', 'First open a way into the middle.'],
    explain: 'First slide a coin round the outside of the ring to settle in a notch on the far side. That opens a gap, and the coin beside the gap can slide into the empty middle. Three rows: one, two, three.',
    links: ['coin-triangle-ring', 'coin-ring-para']
  },
  'coin-ring-para': {
    text: 'Six coins lie in a ring. Slide them into a lozenge of two rows of three in two moves, each moved coin coming to rest against at least two others.',
    hints: ['Again, a coin has to get into the middle of the ring.'],
    explain: 'Slide a top coin along the top to rest beyond the other one; the ring opens, and the coin at the side can slide into the middle. The six now make three rows of two leaning over — a lozenge of two by three.',
    links: ['coin-para-ring']
  },
  'coin-para-ring': {
    source: 'A classic sliding-coin puzzle.',
    text: 'Six coins lie in a lozenge: two rows of three, the lower row set half a coin to the left. Slide them into a **ring** of six around an empty space in three moves. A coin may only slide on the table — no lifting, no pushing others — and must come to rest touching at least two others.',
    hints: ['The empty middle of the ring will be where a coin of the top row is now.', 'That coin — the middle of the top row — has to get out of the way, and it needs somewhere to go first.'],
    explain: '1: slide the top-left coin over the top to rest above the second and third coins. 2: now the middle coin of the top row can slide left into the place just freed. 3: slide the bottom-left coin round to the top, between the two coins you moved. The empty middle of the ring is where the middle top coin was.',
    links: ['coin-ring-para', 'coin-triangle-ring'],
    tags: ['classic']
  },
  'coin-row-triangle': {
    text: 'Six coins lie in a straight row. Slide them into a triangle of six in three moves, each moved coin coming to rest against at least two others.',
    hints: ['Three neighbours of the row can be the long side of the triangle.'],
    explain: 'Keep the second, third and fourth coins as the long side. Slide the left end underneath them into the first notch; then a coin from the right end into the next notch; then the last coin underneath the two you placed.',
    links: ['coin-row-ring', 'coin-ring-triangle']
  },
  'coin-tri10-slide': {
    text: 'The ten-coin triangle again — but now coins may only **slide**, and each must come to rest against at least two others. Turn it upside down in three moves.',
    hints: ['The same three coins move as when you may lift them.', 'Think about the order: which corner must go first so the others can still get past?'],
    explain: 'The three corners move, as in [[coin-tri-10]], and they can all get there by sliding: the top coin slides down the left side to the end of the second row; the bottom-left coin travels all the way round the bottom and up to the other end of that row; and the bottom-right coin slides under the middle of the base.',
    links: ['coin-tri-10']
  },
  'coin-triangle-ring': {
    text: 'Six coins make a triangle: one, two, three. Slide them into a **ring** around an empty space in four moves, each moved coin coming to rest against at least two others.',
    hints: ['The empty middle of the ring will be where one of the two middle-row coins is now.', 'That coin is boxed in: two other coins must move before it can escape.'],
    explain: 'The hole opens where the left coin of the middle row sits. 1: the top coin slides down the left side. 2: the right coin of the middle row slides out round the top to the top left. 3: the boxed-in coin can now slide right, into the place just left. 4: the bottom-right coin slides up the right side and closes the ring.',
    links: ['coin-ring-triangle', 'coin-para-ring']
  },
  'coin-row-flower-slide': {
    text: 'Seven coins in a row. Slide them into a flower — six round one — in four moves, each moved coin coming to rest against at least two others.',
    hints: ['Three neighbouring coins of the row can stay as the middle line of the flower.', 'Start from the end that is left over on its own.'],
    explain: 'Keep the second, third and fourth coins. The left end slides under them into a notch; then the three coins at the right end slide one by one into the notches above and below, each always finding two neighbours to rest against.',
    links: ['coin-row-flower']
  },
  'coin-row-ring': {
    text: 'Six coins in a row. Slide them into a ring around an empty space, each moved coin coming to rest against at least two others. It can be done in five slides — and in sliding puzzles every slide counts, even of a coin that has moved before.',
    hints: ['The ring has two coins from the row in its top edge.', 'One coin has to move twice.'],
    explain: '1: the left end slides under the row, between the second and third coins. 2: the second coin follows, into the next notch. 3: the right end slides all the way round underneath. 4: the coin from the second move steps one place to the right, out of what will be the hole. 5: the coin that was fifth in the row slides down and closes the ring.',
    links: ['coin-row-triangle', 'coin-para-ring']
  },

  /* ---- rows ---- */
  'coin-cross-rows': {
    source: 'A traditional trick puzzle.',
    text: 'Six coins make a cross: an upright row of four, with one coin on each side of the second coin from the top. That is one row of four. Move **one** coin so that there are **two** rows of four.',
    hints: ['Nobody said the coins must lie side by side.'],
    explain: 'Put the bottom coin on top of the coin where the rows cross. The pile of two counts in both rows: up and down 1 + 2 + 1 = 4, across 1 + 2 + 1 = 4.',
    links: ['coin-eight-rows', 'coin-square-five'],
    tags: ['trick', 'stacking']
  },
  'coin-eight-rows': {
    text: 'Eight coins lie in a cross: an upright row of five, and a row of four across it through its middle coin. Move one coin so that both rows hold **five**.',
    hints: ['Remember the cross of six.'],
    explain: 'Lift the top coin onto the crossing coin. Up and down: 1 + 2 + 1 + 1 = 5; across: 1 + 2 + 1 + 1 = 5.',
    links: ['coin-cross-rows'],
    tags: ['stacking']
  },
  'coin-three-rows': {
    text: 'Six coins lie in two rows of three. Rearrange them into **three** straight rows with three coins in each.',
    hints: ['Some coins will have to count in two rows at once.', 'Three rows can meet in pairs at three corners.'],
    explain: 'A triangle: a coin at each corner and one in the middle of each side. Each side is a row of three, and each corner coin serves two rows.',
    links: ['coin-seven-six', 'coin-six-four']
  },
  'coin-nine-eight': {
    text: 'Nine coins. Arrange them so that there are **eight** straight rows of three.',
    hints: ['Think of a noughts-and-crosses board.'],
    explain: 'A square, three by three: three rows, three columns and two diagonals — eight lines of three, the ones you win noughts and crosses with.',
    links: ['coin-orchard']
  },
  'coin-nine-triangle': {
    text: 'Nine coins. Arrange them in **three** straight rows with **four** coins in each.',
    hints: ['Share the corners.'],
    explain: 'A triangle with four coins on each side: the three corner coins each count in two sides, so 3 × 4 − 3 = 9.',
    links: ['coin-three-rows']
  },
  'coin-seven-six': {
    text: 'Seven coins. Arrange them in **six** straight rows of three.',
    hints: ['Start from the triangle of [[coin-three-rows]] and use the seventh coin well.', 'A triangle has three lines from its corners to the middles of the opposite sides, and they meet in one point.'],
    explain: 'A triangle with a coin at each corner, one at the middle of each side and one in the very middle. The sides give three rows; the three lines from each corner, through the middle coin, to the middle of the opposite side give three more.',
    links: ['coin-three-rows', 'coin-six-four']
  },
  'coin-six-four': {
    text: 'Six coins. Arrange them in **four** straight rows of three.',
    hints: ['Draw four straight lines, none parallel and no three through the same point. How many crossings are there?'],
    explain: 'Four straight lines, no two parallel and no three through one point, cross in exactly six places — one for each pair of lines — and every line passes through three of the crossings. Put a coin on each crossing.',
    links: ['coin-seven-six', 'coin-star']
  },
  'coin-star': {
    source: 'A traditional tree-planting puzzle.',
    text: 'Ten coins. Arrange them in **five** straight rows with **four** coins in each.',
    hints: ['Each coin must be in two rows.', 'Draw a star without lifting the pencil.'],
    explain: 'Draw a five-pointed star. Its five lines cross each other ten times — at the five points and at the five corners of the pentagon inside — and each line passes through four of those places.',
    links: ['coin-hexagram', 'coin-six-four'],
    tags: ['classic']
  },
  'coin-hexagram': {
    text: 'Twelve coins. Arrange them in **six** straight rows with **four** coins in each.',
    hints: ['Every coin in two rows, again.', 'Two triangles, one upside down over the other.'],
    explain: 'The six-pointed star. Each of its six lines — the sides of the two big triangles — passes through two points of the star and crosses the other triangle twice, so it holds four coins; every coin is in two rows.',
    links: ['coin-star']
  },
  'coin-orchard': {
    year: 1821,
    source: 'John Jackson, *Rational Amusement for Winter Evenings* (1821), where it is a verse about planting nine trees.',
    text: 'A gardener has nine trees to plant — here, nine coins — and wants **ten** straight rows with **three** in each row.',
    hints: ['Start with two parallel rows of three, one above the other.', 'The third row of three goes halfway between them — squeezed to half the width.'],
    explain: 'Put three coins in a row, three more in a parallel row above them, and the last three halfway between, squeezed to half the width. The three rows across make three lines; the upright line through the middle makes four; the two long diagonals through the centre make six; and four more lines run from each corner through a coin of the squeezed row to the middle coin of the far row — ten in all.',
    links: ['coin-nine-eight', 'coin-star'],
    tags: ['classic']
  },

  /* ---- squares ---- */
  'coin-square-five': {
    source: 'An old parlour puzzle.',
    text: 'Twelve coins outline a square, four on each side — the corner coins count for both their sides. Make a square with **five** on each side, in four moves.',
    hints: ['A coin on a corner counts twice. A pile on a corner counts all its coins twice.'],
    explain: 'Move one middle coin from each side onto a corner. Every corner is now a pile of two, and each side counts 2 + 1 + 2 = 5. Twelve coins, five a side, and nobody stole one.',
    links: ['coin-square-six', 'coin-cross-rows'],
    tags: ['stacking']
  },
  'coin-square-six': {
    text: 'The same twelve coins, four on each side. Now make **six** on each side, in eight moves.',
    hints: ['The more coins on the corners, the more each side counts.'],
    explain: 'Put every middle coin on a corner: four piles of three, and each side counts 3 + 3 = 6. With twelve coins no square can have more — and none can have fewer than four a side, since the corners must hold coins.',
    links: ['coin-square-five'],
    tags: ['stacking']
  },

  /* ---- touching ---- */
  'coin-touch-four': {
    text: 'Four coins lie in a row, each touching its neighbours. Move two so that **every coin touches exactly two others**.',
    hints: ['The two coins at the ends touch only one other each.'],
    explain: 'Make a square — or any diamond that is not too squashed: each coin touches its two neighbours round the edge but not the coin across the diagonal. On the honeycomb it cannot be done, which is why this table has no lattice.'
  },
  'coin-touch-ring': {
    text: 'Six coins make a triangle on the honeycomb. Move two so that **every coin touches exactly two others**.',
    hints: ['On the honeycomb, six coins can only do this as a ring round an empty space.', 'Four coins of the triangle are already part of such a ring.'],
    explain: 'The ring\'s empty middle is where the left coin of the middle row sits. Move that coin out to the left of the ring, and the bottom-right corner round to the top left. Each coin of a ring touches its two neighbours and nothing else.',
    links: ['coin-triangle-ring', 'coin-touch-loop8']
  },
  'coin-touch-pairs': {
    text: 'Six coins make a triangle. Move as few as you can so that **every coin touches exactly one other** — three separate pairs. Three moves will do.',
    hints: ['No four coins of the triangle can stay: every coin in the middle of a side touches two corners.', 'The top pair can stay together.'],
    explain: 'Keep the top coin with the left coin below it as one pair, and the bottom-right corner as half of another. Move the right coin of the middle row one place out to partner that corner, and put the other two bottom coins together below as the third pair. Three moves is the least, because at most three coins of the triangle can stay.',
    links: ['coin-touch-ring']
  },
  'coin-touch-loop8': {
    text: 'Eight coins lie in two rows of four. Move three so that **every coin touches exactly two others**.',
    hints: ['Make a loop around an empty space two coins long.', 'Five coins can stay where they are.'],
    explain: 'The answer is a closed loop of eight round a hole the size of two coins. It can be placed so that five of the coins are already in it; the other three move to close it.',
    links: ['coin-touch-ring']
  }
};
