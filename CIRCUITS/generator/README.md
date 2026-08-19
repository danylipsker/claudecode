# Circuit generator

Source of truth for the 28 files in `../Forrest Mims - 555 Timer IC Circuits/`.
Those `.txt` files are **generated** — edit them here, not by hand, or the next
build silently overwrites your change.

```bash
python build_all.py          # writes all 28 circuits
python ../lint.py '../Forrest Mims - 555 Timer IC Circuits/*.txt'
python netlist.py '../Forrest Mims - 555 Timer IC Circuits/02-basic-astable.txt'
```

| File | What it holds |
|---|---|
| `lib.py` | element helpers, 555 pin geometry, XML emitters |
| `common.py` | rails, supply frame, page heading |
| `part1.py` | circuits 01–14, plus shared chip/probe helpers |
| `part2.py` | circuits 15–28 |
| `content.py` | each page's explanation, formulas and data tables |
| `build_all.py` | runs every builder and writes the `.txt` files |
| `netlist.py` | collapses wires into nodes, so a file can be diffed against the drawing |

## Two rules that are easy to break

**One `key` per linked switch group.** The dispatcher toggles *every* switch
matching a pressed key, and `Switch2Elm.toggle()` then reassigns position across
its whole `li` group — so two linked poles sharing a key cancel each other and the
key goes silently inert. Put the key on one pole and let `li` gang the rest.
Circuit 24 regressed this way six times; see the comment in `part2.py`.

**The 555 needs `f="14"`.** Flags 2 and 4 create the reset and ground pins; without
them the chip drops to six posts and wires to pins 4 and 1 dangle with no error.
Bit 8 labels the pins 1–8 as Mims draws them.
