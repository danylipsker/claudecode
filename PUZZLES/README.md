# The Puzzle Cabinet

Thousands of puzzles from three thousand years — matches, coins, pegs,
tangrams and polyominoes, paper folding and cutting, knots and burning ropes,
jugs and scales, river crossings and one-stroke drawings, alphametics and
magic figures, knights and knaves, Sudoku and nonograms, gears and pipes,
cards and clocks, compass-and-straightedge constructions, and the riddles of
the Sphinx, Alcuin, Fibonacci, Loyd, Dudeney and Carroll — each one playable
on the screen with real tools.

Open `index.html` through a web server (`node scripts/serve.js` from the repo
root, then http://localhost:8172/PUZZLES/), or online at
https://danylipsker.github.io/claudecode/PUZZLES/ . It installs as an app on a
phone and plays offline (Settings → keep every puzzle for offline play).

## What is inside

About 9,400 stored puzzles in 148 drawers on 18 shelves — every one checked
by its engine's solver — and 118 **Endless** drawers that make new, checked
puzzles on demand at five levels.

| Shelf | Drawers |
| --- | --- |
| Matches & Sticks | squares and triangles, matchstick classics, matchstick equations, Roman sums |
| Coins, Pegs & Counters | coins on the table, peg solitaire, frogs and toads, coins in pairs, turning glasses, tricks at the table |
| Shapes & Dissections | tangram and 108 tangram figures, pentominoes, polyomino packing, polyiamonds, polyhexes, cut into equal parts, rep-tiles, cut and rearrange, classic piece puzzles (T-puzzle, Stomachion), count the triangles / squares, geometry, area paradoxes |
| Paper: Fold & Cut | fold and cut, folding stamps, paper riddles |
| Ropes & Knots | knot or not, name that knot, untie it, burning ropes, rope riddles |
| Pour, Weigh & Time | water jugs, hourglasses, the false coin, weights and scales, mobiles |
| Crossings & Routes | river crossings, bridge and torch, one stroke, bridges of Königsberg, round trips, untangle, knights changing places, knight's tours, labyrinths and logic mazes |
| Numbers & Letters | alphametics, magic squares and figures, problems of the ancients, number riddles, sequences, numbers around the world, picture sums |
| Logic & Deduction | knights and knaves, logic grids, queens and guards, brainteasers, mini-mysteries, colour the map, visual reasoning (matrices, odd one out, what next, spot the difference, fold and punch) |
| Pencil Puzzles | Sudoku, KenKen, Futoshiki, Skyscrapers, nonograms, Light Up, Takuzu, Star Battle, Slitherlink, Masyu, Bridges, Nurikabe, Kakuro, Tents, Dominosa, Singles, Filling, Rectangles, Magnets, Tracks, Signpost, Range, Number path, Norinori, LITS, Heyawake, Yajilin |
| Space & 3D | cube nets, count the cubes, painted cubes, front/top/side views, same or mirror, the Soma cube, packing blocks |
| Physics & Phenomena | gears and belts, which cup fills first, pulleys and levers, moving paradoxes |
| Chance & Paradox | chance and paradox, with experiments to run |
| Cards, Dice & Clocks | cards in order, deals and shuffles, clock puzzles, dice, calendars |
| Compass & Straightedge | Euclid's constructions, only a compass |
| Riddles & Wordplay | the oldest riddles, Dudeney, Loyd, Carroll, riddles old and new, lateral thinking, wordplay, riddles of the world, riddles for young puzzlers, word ladders, cryptograms, anagrams, codes and ciphers |
| Games to Win | Nim and its cousins (take-away, Wythoff, Kayles, Northcott, Grundy), dots and boxes, Hackenbush, Chomp, mate in one, mate in two, helpmates, endgame lessons |
| Mechanical Classics | Lights Out, Towers of Hanoi, Chinese rings, counting out, Net, Twiddle and friends, Rubik's cube |

## The tools on the table

Every puzzle sits on the same workbench:

| Tool | What it does |
| --- | --- |
| Select (V) | pick up, drag, turn (handle, R / Shift+R, Shift+wheel), turn over (X, Shift+F), lasso several |
| Pan (H) | move the view; also Space+drag, right/middle drag, one finger on a phone |
| Zoom | wheel, pinch, + / − / 0 (fit), and a magnifying glass (L) |
| Paint (B) | colour a piece or a cell; name a colour to make a group ("heavier", "seen twice") |
| Pen (P), Highlighter (M), Eraser (E) | write and mark on the table |
| Note (N) | sticky notes; plus a notebook and a calculator (with variables) beside every puzzle |
| X-ray (Shift+X), see-through, hide, lock | look through pieces that are in the way (also in the Layers tab) |
| Front / back ([ ], Shift for all the way) | stacking order |
| Group (Ctrl+G) | move pieces together |
| Knife (C) | cut pieces along a stroke |
| Fold (F) | bring a point of the paper onto another; Shift draws the crease |
| Knot (K) | switch crossings of a rope (knot puzzles) |
| 3D (3) | turn solid puzzles around in space |
| Undo / Redo (Ctrl+Z / Ctrl+Y), Hint (?), Check (Enter) | |

Stars: three for a solve without hints, two with one or two hints, one with
more. Showing the solution marks a puzzle as seen.

## How it is built

Plain JavaScript and CSS, no build step. `js/` holds the core (registry,
geometry, paper folding, a small 3D view, the workbench, the player, the
library), `engines/` one file per kind of puzzle, `data/` the puzzles,
`tools/` the generators and checks. See **AUTHORING.md** for how to add an
engine or puzzles.

```
node tools/validate.js          # every puzzle checked by its engine's solver
node tools/catalog.js           # rebuild data/catalog.js after changing puzzles
node tools/gen/<name>.js        # regenerate a family
node tools/make-icons.js        # the app icons
```

In the browser, `tools/selftest-browser.js` opens puzzles one after another,
shows each solution and checks that it counts as solved (see AUTHORING.md).

## Sources

Classic puzzles are retold in our own words and credited on each puzzle:
the Rhind papyrus, the Greek Anthology, Sunzi, Alcuin of York, Fibonacci,
Bhaskara, Tartaglia, Bachet, Guarini, Euler, Lucas, Hoffmann, Lewis Carroll,
Sam Loyd and Henry Dudeney among others. Generated variants were each checked
by a solver before they went in. With thanks to Martin Gardner, whose
*Mathematical Games* column made so many of these puzzles famous.
