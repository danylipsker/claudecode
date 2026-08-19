# 555 Timer Sims — compact rendition

Twenty-eight circuits from Forrest Mims III, *Engineer's Mini-Notebook: 555 Timer
IC Circuits*, named by the book page they come from (`p06`–`p32`).

**This is not the same set as `../Forrest Mims - 555 Timer IC Circuits/`.** Both
cover the same book; they are different renditions and both are worth keeping:

| | this folder | `../Forrest Mims - 555 Timer IC Circuits/` |
|---|---|---|
| File format | **legacy text** (`$ 1 5e-5 …`, numeric element codes) | **XML** (`<cir>…`) |
| Naming | by book page — `555-p07-basic-astable` | by sequence — `02-basic-astable` |
| Content | the working circuit only | the whole book page: numbered pins, designators, prose, formulas, data tables, scopes |
| Sharing | `555-sims-links.md` holds a `?cct=` link per circuit that opens each one running at falstad.com, no file needed | import the `.txt` in the simulator |
| Size | ~1 KB each | ~3–5 KB each |

Companion to the *555 Timer Circuit Atlas* artifact.

## A caveat on the legacy format

These files are in the older text format, which the simulator still reads but no
longer writes. It cannot store a switch's keyboard shortcut — `SwitchElm`'s text
dump has no field for `keyShortcut`, so any key binding is silently lost on a
round-trip. If a circuit here ever needs keyboard-operated switches, it has to be
converted to XML first. See `../FALSTAD-FORMAT-REFERENCE.md` §1.
