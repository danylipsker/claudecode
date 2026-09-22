I am studying Claude Code and all it can do for a person like me who does not have enough skills to deal with software writting and all the rest of the tasks involved.
I am playing with it and It is more than supperb

## What is in here

### Engineering tools - their own repositories, checked out inside this one

| Folder | Repository | What it is |
|---|---|---|
| `SPRINGS/` | [springs-generator](https://github.com/danylipsker/springs-generator) (private) | Metric spring generator for SOLIDWORKS: compression (DIN 2098), tight-space conical, extension, torsion, ISO 10243 die, EN 16983 disc (single or stacked) and Smalley wave springs - 2276 standard sizes and any custom one. Each spring is calculated to its standard and built as true 3D geometry at every load state: STEP files, an interactive data sheet, and one SOLIDWORKS part with a configuration per load state (its springiness). A **Springs** task-pane add-in puts it all inside SOLIDWORKS 2020 and newer. |
| `GEARS GENERATOR/` | [gears-generator](https://github.com/danylipsker/gears-generator) (private) | 23 gear families on exact geometry: meshing pairs and sets, a live 3D preview, STEP / DXF / SOLIDWORKS export - a Windows desktop app, a Python geometry engine and a SOLIDWORKS task-pane add-in. |
| `FASTENERS/` | [fasteners-catalog](https://github.com/danylipsker/fasteners-catalog) (private) | Metric fasteners catalog: 7932 STEP models in 119 families (ISO / DIN screws, nuts, washers, pins, rings and general hardware), a browsable HTML catalog, a CSV index and a SOLIDWORKS add-in that inserts them. |
| `GASKETS AND SEALS/` | [gaskets-seals-profiles](https://github.com/danylipsker/gaskets-seals-profiles) (private) | Edge seal and gasket profiles as SOLIDWORKS weldment profiles: the McMaster-Carr edge seals and the DIRAK sealing profile systems as `Standard/Type/Size.sldlfp` files with the catalogue data as properties, a browsable catalogue with previews, DXF copies, and the generator (Python) plus the SOLIDWORKS command-line builder (C#) that made them. |
| `wpfCalculator/` | [wpfCalculator](https://github.com/danylipsker/wpfCalculator) | A WPF desktop calculator with the features of a high-end graphing and financial calculator, in eight tabs. |

This repository ignores these folders (see `.gitignore`); each has its own history and README.

### Browser apps - open `index.html`, the apps page

Serve the folder with `node scripts/serve.js 8172` and open http://localhost:8172/.

| App | What it is |
|---|---|
| [Galaxies](GALAXIES/index.html) | Nikoli's Tentai Show: puzzles generated on the spot, each with a single solution, and a hint that explains its reasoning. |
| [Sokoban](sokoban/sokoban.html) | Push every crate onto a glowing pad: level picker, move and push counters, saved progress. |
| [Tic Tac Toe](tic-tac-toe/tic-tac-toe.html) | Play a friend or the computer, at three levels, as either side. |
| [VectorLab](VECTOR-EDITOR/vector-editor.html) | A vector graphics editor: shape tools, corner rounding, transforms and boolean corners. |
| [CURVES](CURVES/CURVES.html) | A parametric curve lab: drive a curve from its parameters and domain, then trace and fit the result. |
| [Affine Transformations](afine%20transformations/afine-transformations.html) | Stack matrices, multiply them into a composite, and watch what each step does to the figure. |
| [Linear Half Toner](Linear%20Half%20Tone/LinearHalfToner.html) | Turns a picture into a line halftone where line width carries the tone, then into V-bit cut depths for a CNC router. |
| [Unique Gears](UNIQUE-GEARS-GENERATOR/index.html) | Pick a shape - a square, an ellipse, a star, your own formula or a freehand sketch - and it works out the gear that meshes with it: the centre distance that makes the pair close, the pitch curves that roll on each other, and the conjugate outline itself as an envelope. Ten illustrated chapters, three labs (the envelope condition, rack generation and undercut, inverse ratio design) and SVG / DXF / JSON export. |
| [555 Timer Sims](CIRCUITS/555-circuitjs-sims/index.html) | Twenty-eight circuits from Forrest Mims's 555 notebook, each opening live in CircuitJS1 with its sliders and switches working. |
| [G-code Viewer](GCODE-VIEWER/gcode-viewer.html) | Open or paste a program and inspect the toolpath, coloured by move type, with a run-time estimate. |
| [G-code Simulator](GCODE-SIMULATOR/GCODE%20SIMULATOR.html) | Run a program against a block of stock in 3D, from orthographic or perspective views. |

### Other folders

* `scripts/` - `serve.js` (the local server for the apps page) and the SOLIDWORKS 2020 helper scripts
  that keep its resource monitor quiet.
* `sessions/` - records of the Claude Code sessions that built these projects.
* `NOVELTECH/` - a separate checkout (ignored here): documents on platforms, 3D engines and a
  mechanical-arm cutting simulator.
