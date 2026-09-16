# GALAXIES

A browser implementation of **Galaxies**, the puzzle Nikoli publishes as
**Tentai Show** (天体ショー) and that Simon Tatham's Portable Puzzle Collection
calls Galaxies. Puzzles are generated on the fly, every one of them verified to
have exactly one solution.

No build step, no dependencies, no network. Open `index.html` and play.

## Play

Divide the grid into regions so that every region holds exactly one dot and is
unchanged by a 180° rotation about that dot. Every cell belongs to some region.

| Tool | What it does |
| --- | --- |
| **Paint** | Click a dot to pick its galaxy and claim the cells it touches, then click or drag over cells. The mirror cell fills itself. Click a cell of the current galaxy to clear it; right-click clears anywhere. |
| **Walls** | Click or drag along grid lines to draw region borders, the way the Nikoli and Tatham versions work. Click again to remove. |
| **Erase** | Removes paint and walls. |

Paint and walls describe the same thing, so they mix freely: the border between
two differently painted cells counts as a wall. A region that is closed,
symmetric and holds one dot lights up on its own.

`1` `2` `3` pick the tool, `Esc` drops the brush, `Ctrl+Z` / `Ctrl+Y` undo and
redo, `H` hints, `C` checks, `N` new, `D` daily, `R` restarts, `Space` pauses.

**Hint** finds one logical next step, explains the deduction in words and offers
to apply it. **Check** marks anything that contradicts the solution. Progress,
statistics and your unfinished board are kept in the browser.

## Puzzle codes

The status menu copies a code such as `10x10:bfbdcgbadcdfbbncabdbeadfaacfagbaacab`.
This is the same game-ID format Simon Tatham's Galaxies uses, so codes travel in
both directions: paste one of his into **Enter a puzzle code**, or take one of
these to his page. Difficulty suffixes like `10x10dn:` are accepted and ignored.
A share link carries the code in the URL fragment, and `#daily` opens the puzzle
of the day, which is the same for everyone on a given date.

## Difficulty

The rating describes the hardest kind of reasoning the puzzle needs, measured by
the solver itself.

| Rating | The hardest step it needs |
| --- | --- |
| Easy | A cell has only one possible galaxy, or a galaxy can only reach it one way. |
| Normal | A galaxy must pass through a particular cell to stay connected to a cell it already owns. |
| Hard | Assuming a cell belongs to one galaxy leads to a dead end, so it belongs to another. |
| Unreasonable | Nothing short of trial and error settles it. |

The generator grows random symmetric regions, splits whatever turns out
ambiguous, and keeps going until the rating matches the request. If it cannot
match it within its attempt budget it returns the closest puzzle it found and
says so.

## Files

| File | What is in it |
| --- | --- |
| `index.html` | Markup and dialogs. |
| `galaxies.css` | Styling, light and dark. |
| `galaxies-core.js` | Model, solver, generator, game-ID codec, board analysis, hints. Runs in the page, in a Web Worker and in Node. |
| `galaxies-ui.js` | Rendering, input, generation worker, timer, statistics, persistence. |
| `tools/bench.js` | Generator check: uniqueness, solution validity, ID round-trip, timings. |
| `tools/hints.js` | Solves puzzles using nothing but the hint engine and verifies every step. |
| `tools/serve.js` | Static server, for playing over `http://` instead of `file://`. |

```bash
node GALAXIES/tools/bench.js
```

```bash
node GALAXIES/tools/hints.js
```

```bash
node GALAXIES/tools/serve.js
```

Opening `index.html` straight from disk works too; the generator then runs on
the page instead of in a worker, which only matters for large grids.

## Credits

Galaxies was invented by [Nikoli](https://www.nikoli.co.jp/en/puzzles/tentai_show/)
as Tentai Show. It reached a wide audience through
[Simon Tatham's Portable Puzzle Collection](https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/galaxies.html),
where it was contributed by James Harvey, and through
[Chris Boyle's Android port](https://chris.boyle.name/puzzles) of that
collection ([sgtpuzzles](https://github.com/chrisboyle/sgtpuzzles)). The rules,
the controls and the game-ID format here follow that lineage; the solver,
generator and interface are new code written for this project.
