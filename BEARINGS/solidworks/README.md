# SOLIDWORKS parts for the bearing design tables

`BearingsCli` builds one SOLIDWORKS part for each Excel design table in `BEARINGS\design-tables`
and saves it next to the table with the same name (`DGBB 6000 Timken.xlsx` -> `DGBB 6000 Timken.SLDPRT`).
The part's dimensions carry the names of the table headers, so the table drives the part: one
configuration per catalogue bearing.

## What is in a part

| Feature | Purpose |
|---|---|
| `S` (sketch, Front plane) | The skeleton the table drives: construction circles `ID`, `OD`, `IDa`, `ODa` (thrust: also `d1`, `D1h`) and a construction line `B`. Change these and everything follows. |
| `Z` (axis) | Bearing axis, used by the circular patterns. |
| `InnerS` -> `InnerRing`, `OuterS` -> `OuterRing` | Ring cross-sections on the Top plane, revolved about Z. Driven by equations from `S`. |
| `BallS` -> `Ball` -> `CirPattern1` | One ball (a semicircle revolved about its chord) at the pitch radius, patterned about Z. The count `N@CirPattern1` is an equation. |
| `RollerS` -> `Roller` -> pattern | Cylindrical / spherical roller families: a cylinder instead of a ball (two rows for spherical and self-aligning). |
| `ConeS` -> `Cone`, `CupS` -> `Cup`, `RollerS` -> `Roller` | Tapered roller families: inclined raceways (10 deg cone, 16 deg cup), frustum rollers on an inclined axis. |
| `ShaftWasherS`, `HousingWasherS`, `BallS` | Thrust families: two washers and a ball row; `B` is the height H. |
| `F1`, `F2` (fillets) | Edge radius `r_min` on the bore and outside edges. A fillet only takes the edges of one body, so the outer ring gets `F1` (the table column `r_min@F1`) and the inner ring `F2`, whose radius follows `F1` by equation. |
| Design table | Inserted from the Excel file and linked to it. |

Every sketch is fully defined (profile end points merged, horizontal/vertical relations, the revolve
axis fixed), so a configuration change moves every vertex where the equations say.

All shapes are proportions of the catalogue values (ball diameter 0.95 of the radial gap between the
ring shoulders, rollers 0.6 B long, and so on); they are visual bearings for assemblies, not
manufacturing geometry. The skeleton values are exactly the catalogue's.

## Building

SOLIDWORKS 2020 and Excel must be installed. The tool starts SOLIDWORKS 2020 itself when it is not
running (each run restarts it, which takes about 40 s).

```
dotnet build BEARINGS\solidworks\BearingsCli\BearingsCli.csproj -c Release
BEARINGS\solidworks\BearingsCli\bin\Release\BearingsCli.exe build              # all tables
BEARINGS\solidworks\BearingsCli\bin\Release\BearingsCli.exe build -only Thrust  # a subset
BEARINGS\solidworks\BearingsCli\bin\Release\BearingsCli.exe check              # rebuild every configuration, compare OD and B
BEARINGS\solidworks\BearingsCli\bin\Release\BearingsCli.exe dump "BEARINGS\design-tables\DGBB 6000 Timken.SLDPRT"
BEARINGS\solidworks\BearingsCli\bin\Release\BearingsCli.exe dump "BEARINGS\design-tables\Tapered roller SKF.SLDPRT" -config "30203 J2|30302 J2"
```

`dump` prints the feature tree with face counts and errors, every dimension, the sketch relations and
constrained status, the equations, and the box of every body; with `-config` it switches through the
named configurations (separated by `|`), rebuilding twice and printing the body boxes each time.

## Known data issue

`NSK 600 miniature`, row `MR 93`: `r_min@F1` is 2 in the source workbook (the ring is 0.8 mm thick), so
the fillet fails in that configuration only. The NSK catalogue value is 0.15.

## Rules a table must follow (SOLIDWORKS 2020)

- A workbook-level name `Family` must point at the header row's first cell (`='Sheet name'!$A$2`).
  SOLIDWORKS writes this name into tables it generates and uses it to find a table it opens; without it
  "insert from file" silently creates no configurations. Renaming the sheet in a tool that does not
  update names breaks it.
- Row 1 is a title, row 2 the headers (`B@S`, `ID@S`, `r_min@F1`, `$DESCRIPTION`, ...), configuration
  names from A3 down. SOLIDWORKS stops reading at the first empty header cell, so notes go to the right
  of an empty column.
- Dimension names are case-insensitive: `d1@S` and `D1@S` cannot coexist (the thrust tables use `D1h@S`).
- Blank cells in a dimension column keep the model's value; a blank `$SW-MASS` column is accepted.
- A configuration name may not contain `/`; SOLIDWORKS stops creating configurations at the first such
  row. The catalogue designations `618/3`, `W 618/1`, `60/22-2RS`, `30204 J2/Q` are therefore written
  `618_3`, `W 618_1`, `60_22-2RS`, `30204 J2_Q` in `Miniature 600 Timken`, `SKF web page`,
  `AllBalls size chart` and `Tapered roller SKF` (column A only; the `$DESCRIPTION` and notes are untouched).
- Thrust tables: `d1@S` is the shaft washer outside diameter, `D1h@S` the housing washer bore
  (catalogue `D1`, renamed because of the case rule).

## SOLIDWORKS 2020 API notes (what cost time)

- `SketchAddConstraints` wants `sgHORIZONTAL2D` / `sgVERTICAL2D` (not `sgHORIZONTAL2`); an unknown name
  is ignored without any error. The tool now checks the relation count after every call.
- With `SketchManager.AddToDB = true` consecutive lines do not merge their end points; the profile still
  revolves (the contour is closed geometrically) but it is under-defined and a configuration change can
  leave a corner behind (the tapered cup kept its old width). `JoinEnds` merges them (`sgMERGEPOINTS`).
- A construction centreline used as the revolve axis has no relation of its own: `sgFIXED`.
- A fillet feature takes the edges of one body only; the rest come back as `swFeatureErrorFilletNoEdge`.
  One fillet per body, and body/edge objects must be fetched again after every feature (reusing them
  disconnected SOLIDWORKS).
- `swInputDimValOnCreate` must be off, otherwise every dimension opens the Modify box and the call hangs.
- A feature circular pattern of a revolve returns null; pattern the body (mark 256) about a reference axis.
- The pattern feature refuses `Name =`; equations use its own name (`N@BallsPattern`).
- Equations cannot be added while a sketch is open.
