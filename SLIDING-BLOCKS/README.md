# Sliding Blocks

Slide the blocks until the way is clear. 1,250 puzzles in ten stages, from Novice to Legend,
easiest first. It is drawn in the colours and shapes of the [Sokoban](../sokoban/sokoban.html) page:
the same navy tray and wall tiles, wooden blocks, gold goals and the teal hero with eyes.

Open [index.html](index.html): from disk, from the repository's apps page, or from GitHub Pages.
There is no build step.

## The four kinds

| Kind | Puzzles | The goal |
|---|---:|---|
| **Gridlock** | 340 | Cars and trucks slide only along their length. Clear a lane for the teal car to drive out through the gate, as in Rush Hour. |
| **Klotski** | 330 | Rectangles in a tray; the big teal block leaves by the gate. L'Âne Rouge (1932, 81 moves) is among them. |
| **Release** | 300 | Odd shapes (L, T, S, P pieces) on boards with walls, as in the old mechanical puzzles on Nick Baxter's pages: bring the teal piece to its outline, and out through the gate when there is one. |
| **Order** | 280 | Put the pieces in order: numbered tiles (some of them dominoes), colours that sort into bands or trade sides (like IPP19), and towers after Panex and the Towers of Hanoi: disks in walled columns under a channel, where disk *k* may go only *k* levels deep (the small figures on the floor), so the small disks always stay above the large. Move the tower across, or trade two towers. |

The library deals the four kinds together by difficulty, so every stage has all of them; the chips
in the library show one kind alone.

## Playing

- Drag a piece with the mouse or a finger. It follows as far as there is room and turns corners.
- Or pick a piece with **Tab** and slide it with the **arrow keys** (or WASD).
- A **move** is one piece moved, however far and round however many corners; moving the same piece
  again straight after is still the same move. This is the usual count for sliding block puzzles.
- **Par** is the fewest moves the puzzle can be done in. Three stars for par, two for close to it,
  one for any solution. A solution that used hints earns one star; a later one without replaces it.
- **H** makes the next move of a shortest solution (the solver works from wherever the pieces are
  now), **Shift+H** plays the rest. **U** undo, **Y** redo, **R** restart, **N** / **P** next and
  previous, **L** the library, **?** how to play.
- After a win, **Enter** or **Next Puzzle** goes to the next puzzle not solved yet.

The library (key **L**) shows every puzzle as a miniature: chips choose the kind, the buttons 1–10
the stage (their bars fill as you solve), **Go** jumps to a puzzle number, **Random** picks an
unsolved one in the stage and **Next Unsolved** the first unsolved one in the list. Progress is kept
in the browser. The address names the puzzle (`index.html#123`), so a bookmark returns to it.

## Phones and offline

Served over http(s) (GitHub Pages, or `node scripts/serve.js` from the repository root), the page
registers [sw.js](sw.js), which keeps it for offline use, and [pwa.json](pwa.json), which lets a
phone add it to the home screen. Every puzzle is in [puzzles.js](puzzles.js), so after one visit it
plays with no connection. Add `?nosw` to the address to skip the service worker while developing.

## Files

- [sb-core.js](sb-core.js): the puzzle format, the rules and the solver (breadth-first search over
  positions, with alike pieces counted as one). The page and the tools share it.
- [sb-app.js](sb-app.js): the page: board, pieces, dragging, hints, the library.
- [puzzles.js](puzzles.js): the library, one line a puzzle, written by the generator.

A puzzle line is `family|name|board|goal|par|options`; the format is described at the top of
sb-core.js. For example L'Âne Rouge is `K|L'Âne Rouge|BAAC/BAAC/DEEF/DGHF/I..J|A@1,3|81|x:b1`.

## Tools

- `node tools/generate.js [minutes]` samples random boards of every kind on every core
  ([tools/families.js](tools/families.js)): the solver explores all that can be reached from a
  board and keeps the position farthest from the goal, which becomes a puzzle with that distance as
  its par. Hard Gridlock boards are rare at random, so most of them are grown by small changes that
  keep a board only when it gets no easier. The candidates collect in `tools/cache/` (not in git);
  building then picks each kind's puzzles along a rising ramp of par and deals the kinds together.
  `node tools/generate.js build` rebuilds from the cache alone.
- `node tools/check.js` solves every puzzle again from its start and confirms its par is the true
  fewest moves; it also reports the largest search a hint can need.
- `node tools/make-icons.js` draws icon.svg and the PNG icons from one list of shapes.

## Credits

The puzzle kinds are old and belong to everyone; every puzzle here was generated for this page
except L'Âne Rouge (J. H. Fleming, 1932, after the older Klotski). Gridlock plays like ThinkFun's
Rush Hour, and the towers borrow from Panex and the Towers of Hanoi; Nick Baxter's sliding block
pages (puzzleworld.org) were the reference for the classic and modern styles.
