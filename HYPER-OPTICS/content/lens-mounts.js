/* HYPER-OPTICS · content/lens-mounts.js — the topic "Lens mounts and lens data"
 *   lens-mounts-and-flange-distance  what a mount fixes; threads and bayonets; the mounts drawn to scale
 *   (c-mount is written in reference.js)
 *   cs-mount                         the same thread, 5 mm closer to the sensor
 *   s-mount-m12                      board lenses: no flange distance, focus by turning
 *   f-mount                          the three-lug bayonet of 1959 and its life in machine vision
 *   photographic-lens-mounts         EF, RF, E, Z, L, X, Micro Four Thirds, M, K: why mirrorless mounts are short and wide
 *   cine-and-large-format-mounts     PL, M42, T2, TFL, M58, M72
 *   lens-adapters-and-back-focus     adapters, glass adapters, shims, why a zoom loses focus
 *   image-circle-and-sensor-coverage the circle a lens lights against the sensor
 *   filter-threads-and-lens-accessories  filter threads, step rings, hoods, caps, locking screws
 *   reading-a-lens-datasheet         every line of a machine-vision lens datasheet
 * Every dimension comes from the engine's mount table (O.cam.MOUNTS) and sensor table (O.cam.SENSORS).
 */
Hyper.add(

/* ================================================================ what a mount fixes */
{
  id: 'lens-mounts-and-flange-distance', parent: 'lens-mounts', title: 'Lens mounts and the flange focal distance', level: 1,
  short: 'A lens mount is the agreement that lets any lens of one family fit, and focus on, any camera of that family: a thread or bayonet, an opening, and above all the flange focal distance — how far the image plane lies behind the mounting face. Mounts are threads or bayonets, from 12.5 mm (CS) to 55 mm (T2) of flange distance.',
  keywords: ['lens mount', 'flange focal distance', 'FFD', 'flange back', 'register', 'flange distance', 'bayonet', 'thread mount', 'throat', 'mount diameter', 'back focus', 'mirror box', 'interchangeable lens', 'screw mount'],
  prereq: ['focal-length-and-optical-power', 'depth-of-focus'],
  related: ['c-mount', 'cs-mount', 'f-mount', 'photographic-lens-mounts', 'lens-adapters-and-back-focus', 'image-circle-and-sensor-coverage', 'camera-families', 'the-interchangeable-lens-camera'],
  body: `
A lens does not float in front of a sensor: it is held, and held at one exact distance. The **lens mount** is the standard that lets any lens of one family fit any camera of that family *and* focus there. It fixes four things:

- the **fit**: how the lens is held, a thread or a bayonet, and its diameter (the 1"-32 UN thread of the C-mount);
- the **flange focal distance**: how far the image plane lies behind the mounting face (C 17.526 mm, F 46.5 mm, E 18 mm);
- the **opening**, or *throat*: the clear diameter through which light reaches the sensor (F 44 mm, Z 55 mm);
- the **couplings**: contacts or levers that carry the aperture setting, the focus and the stabilization.

What a mount does *not* say is how large an image the lens makes (that is the [[image-circle-and-sensor-coverage|image circle]]) or its focal length.

### The flange focal distance
Where a lens ends there is a flat ring of metal, the **flange**, that seats against the front face of the camera. With the lens set to infinity, its image of a distant scene forms a fixed distance behind that ring: the **flange focal distance**. The camera is built with its sensor the same distance behind the same face. If both makers keep to the number the image falls on the sensor with the focus ring at infinity.

The number is not forgiving. A cone of light of f-number $N$ has a [[depth-of-focus|depth of focus]] of $\\pm N c$, where $c$ is the largest blur you will accept. At f/2 on a full-frame camera ($c \\approx 0.03$ mm) that is ±0.06 mm; at f/1.4 on a camera with 3.45 µm pixels it is ±5 µm. Cameras for demanding work have an adjustment for it ([[lens-adapters-and-back-focus]]).

### Not the back focal length
The **back focal length** (BFL) runs from the last glass surface to the image plane; the flange focal distance runs from the flange. The difference is how far the rear of the lens is recessed inside the mount:

$$\\text{recess} = \\mathrm{FFD} - \\mathrm{BFL}$$

A 24 mm wide-angle for an SLR must have a BFL near the 44 to 46.5 mm of its mount, far more than its focal length, so it is built as a [[retrofocus-wide-angle|retrofocus]] design.

### Threads and bayonets
| | Thread | Bayonet |
|---|---|---|
| Examples | C, CS, M12, M42, T2, M58, M72 | F, EF, E, Z, K, M; PL is a breech lock |
| Orientation of the lens | arbitrary, so it needs a lock ring or a set screw | fixed by an index mark, so hoods, scales and contacts line up |
| Distance | adjustable: shims, rings, even focusing by screwing | fixed by the flange |

Machine vision favours threads for their simplicity and adjustability; photography favours bayonets for speed and for the contacts they carry.

### The mounts to scale
| Group | Mounts (flange focal distance) |
|---|---|
| Small threads for small sensors | CS 12.526 mm · C 17.526 mm |
| Mirrorless bayonets | Z 16 · X 17.7 · E 18 · Micro Four Thirds 19.25 · RF 20 · L 20 mm |
| Rangefinder | M 27.8 mm |
| SLR, cine and telescope | EF 44 · K and M42 45.46 · F 46.5 · PL 52 · T2 55 mm |

The SLR group is long because a mirror big enough to cover the viewfinder must swing up between lens and sensor; take the mirror away and the mount can be 25 to 30 mm shorter ([[photographic-lens-mounts]]).

> [!key] A mount fixes the fit, the opening and, above all, the flange focal distance: the distance from mounting face to sensor to which both lens and camera are built. A lens can be adapted to any body with a shorter flange distance, never to one with a longer.
`,
  ideas: [
    'A mount fixes the fit (thread or bayonet), the opening, the couplings and, most important, the flange focal distance.',
    'The flange focal distance is measured from the mounting face to the image plane; lens and camera are both built to it.',
    'The tolerance is the depth of focus, ±N·c: a few hundredths of a millimetre for photography, a few micrometres on small pixels.',
    'A lens adapts to a body with a shorter flange distance by a tube of the difference; to a longer one, not at all.',
    'Mirrorless mounts are short because there is no mirror to make room for; SLR mounts are long because there is.'
  ],
  pitfalls: [
    'If the lens fits the camera, it will focus — Fit and focus are separate: C and CS mounts have the same thread and differ by 5 mm of flange distance, so a CS lens screws into a C camera and cannot focus on anything far away.',
    'The flange focal distance is the lens\'s back focal length — The back focal length starts at the last glass, the flange distance at the mounting face; the difference is the recess of the rear element inside the mount.',
    'A longer flange distance means a better mount — It is a design choice: an SLR needs room for a mirror, a mirrorless camera does not. Short mounts do not make better glass, but they leave room for adapters.',
    'The mount tells you which sensor the lens covers — The mount fixes only the fit and the distance. Whether a lens covers a given sensor depends on its image circle, which the datasheet states separately.'
  ],
  terms: [
    { term: 'Lens mount', also: ['mount', 'lens interface'], def: 'The mechanical interface between a lens and a camera: how the lens is held, how wide the opening is, the flange focal distance, and in modern mounts the electrical contacts and couplings.' },
    { term: 'Flange focal distance', also: ['FFD', 'flange back', 'register', 'flange-to-sensor distance'], def: 'The distance from the mounting face (the flange) to the image plane, with the lens set to infinity. Lens and camera must be built to the same value.' },
    { term: 'Bayonet', also: ['bayonet mount'], def: 'A mount in which lugs on the lens slide past matching lugs on the camera and are locked by a short twist, usually a fraction of a turn.' },
    { term: 'Thread mount', also: ['screw mount'], def: 'A mount in which the lens screws into the camera on a standard thread (C, M12, M42, M58 …). The distance can be adjusted, and the lens must be locked in position.' },
    { term: 'Throat', also: ['mount opening', 'inside diameter'], def: 'The clear inner diameter of a mount, through which light travels from the rear of the lens to the sensor.' },
    { term: 'Recess', also: ['rear-element recess'], def: 'How far the last lens surface lies inside the flange: the flange focal distance minus the back focal length.' }
  ],
  formulas: [
    {
      name: 'Adapter thickness',
      expr: 'a = Fl - Fb', tex: 'a = F_{l} - F_{b}',
      vars: {
        a: { name: 'thickness of the adapter', q: 'length', unit: 'mm', signed: true },
        Fl: { name: 'flange focal distance of the lens\'s mount', q: 'length', unit: 'mm', value: 46.5, tex: 'F_{l}' },
        Fb: { name: 'flange focal distance of the camera\'s mount', q: 'length', unit: 'mm', value: 18, tex: 'F_{b}' }
      },
      note: 'Positive: a plain tube of this length joins them. Negative: the lens would have to sit inside the camera, which no tube can do.',
      stories: { a: 'A lens made for a mount with a flange distance of {Fl} is to be used on a camera whose mount has {Fb}. How thick must the adapter be?' }
    },
    {
      name: 'Tolerance on the flange distance',
      expr: 'dz = N*c', tex: '\\Delta z = N\\,c',
      vars: {
        dz: { name: 'allowed error of the flange distance (plus or minus)', q: 'length', unit: 'µm', tex: '\\Delta z' },
        N: { name: 'f-number', value: 2, min: 0.5, max: 64 },
        c: { name: 'largest acceptable blur circle', q: 'length', unit: 'µm', value: 30 }
      },
      note: 'The depth of focus: the sensor may sit this far in front of or behind the image plane before the blur exceeds c.',
      stories: { dz: 'A lens at f/{N} may blur a point to {c} at most. How far may the sensor be from the image plane?' }
    },
    {
      name: 'Recess of the rear element',
      expr: 'r = FFD - BFL', tex: 'r = \\mathrm{FFD} - \\mathrm{BFL}',
      vars: {
        r: { name: 'recess of the last surface behind the flange', q: 'length', unit: 'mm', signed: true },
        FFD: { name: 'flange focal distance', q: 'length', unit: 'mm', value: 44, tex: '\\mathrm{FFD}' },
        BFL: { name: 'back focal length', q: 'length', unit: 'mm', value: 38, tex: '\\mathrm{BFL}' }
      },
      note: 'Zero: the rear surface is level with the flange. A negative value would mean the glass stands out in front of the flange, towards the object.',
      stories: { r: 'A lens for a mount with a flange focal distance of {FFD} has a back focal length of {BFL}. How far is its rear surface inside the flange?' }
    }
  ],
  examples: [
    {
      title: 'An SLR lens on mirrorless bodies',
      q: 'A lens made for the F-mount (flange distance 46.5 mm) is to be used on a camera with an E-mount (18 mm), and on one with a Z-mount (16 mm). What adapters are needed? Could an E-mount lens be used on the F-mount camera?',
      steps: [
        { text: 'Adapter for E: the difference of the two distances.', tex: 'a = 46.5 - 18 = 28.5\\ \\mathrm{mm}' },
        { text: 'For Z the camera is 2 mm shallower still:', tex: 'a = 46.5 - 16 = 30.5\\ \\mathrm{mm}' },
        'The other way round the number is negative, $18 - 46.5 = -28.5$ mm: the E-mount lens would have to sit 28.5 mm inside the F-mount camera, where the mirror and the shutter are.'
      ],
      a: 'A plain 28.5 mm tube for E and 30.5 mm for Z; an E lens cannot be put on an F camera without extra glass in the adapter. A plain tube carries no electrical contacts, so aperture and focus are then set by hand unless the adapter has electronics.'
    },
    {
      title: 'How exact must the sensor be?',
      q: 'A machine-vision camera has 3.45 µm pixels and is used with a lens at f/2.8; a full-frame camera uses a lens at f/1.4 with a blur criterion of 30 µm. How accurately must each sensor be placed?',
      steps: [
        { text: 'Take the blur you will accept as one pixel in the first case:', tex: '\\Delta z = N\\,c = 2.8 \\times 3.45\\ \\mu\\mathrm{m} = 9.7\\ \\mu\\mathrm{m}' },
        { text: 'and 30 µm in the second:', tex: '\\Delta z = 1.4\\times 30\\ \\mu\\mathrm{m} = 42\\ \\mu\\mathrm{m}' }
      ],
      a: 'About ±10 µm for the small-pixel industrial camera and ±42 µm for the full-frame one, in spite of the faster lens: small pixels demand the more exact flange distance.'
    }
  ],
  quiz: [
    { q: 'What does the flange focal distance measure?', choices: ['From the mounting face to the image plane, lens set to infinity', 'From the last lens surface to the sensor', 'From the front of the lens to the object', 'The diameter of the opening of the mount'], a: 0, why: 'The flange is the mounting face. The distance from the last glass is the back focal length; the opening is the throat.' },
    { q: 'Which of these is **not** fixed by the lens mount?', choices: ['The flange focal distance', 'The diameter of the opening', 'The sensor format that the lens covers', 'How the lens is locked to the camera'], a: 2, why: 'The mount fixes the fit and the distance. The sensor size a lens covers is its image circle, a separate property of the optical design.' },
    { q: 'An EF-mount lens (flange distance 44 mm) is adapted to an RF-mount camera (20 mm). How thick, in millimetres, is the plain adapter?', answer: 24, unit: 'mm', why: '$a = F_l - F_b = 44 - 20 = 24$ mm. The camera is the shallower, so the tube makes up the difference.' },
    { q: 'A lens with a short flange distance can be adapted to a camera with a longer one by a plain tube.', a: false, why: 'The reverse is true: the adapter adds distance, so the lens\'s flange distance must be the *longer* one. A shorter-flange lens would have to sit inside the camera.' },
    { q: 'Machine-vision cameras often use thread mounts rather than bayonets mainly because…', choices: ['the distance can be adjusted and the lens locked in place', 'threads are always more accurate', 'bayonets cannot hold small lenses', 'threads carry electrical contacts'], a: 0, why: 'A thread can be shimmed, extended with rings, even focused by screwing; a set screw then locks it. A bayonet is quicker to change but fixed in distance.' }
  ],
  applications: [
    'Choosing lenses: the first question about any lens and camera is whether the mounts match, or whether an adapter of known thickness can join them.',
    'Adapting old lenses to new cameras: long-flange SLR and cine lenses are put on short mirrorless bodies by tubes of 20 to 35 mm.',
    'Camera design: the flange distance fixes how deep the camera body must be and whether it can have a mirror, a shutter and an optical finder.',
    'Service and calibration: a camera repair shop checks the flange focal distance with a gauge and shims it back to specification after a knock.'
  ],
  history: 'Early cameras had a lens screwed into a board. The Leica screw thread (M39 × 1) of the 1930s made lenses interchangeable on small cameras; bayonets followed, with the F-mount of 1959 setting the pattern for single-lens reflex cameras. The EF-mount of 1987 dropped mechanical linkages altogether and carried everything on electrical contacts. From 2008 the mirrorless mounts shortened the flange distance to under 20 mm.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the camera, the lens and the focal plane; depth of focus.',
    'W. J. Smith, *Modern Optical Engineering* — depth of focus and the geometry of the image plane.',
    'ISO 10935:2009, *Optics and photonics — Microscopes — Interface connection type C* — a mount defined by a thread and a flange distance.'
  ],
  sim: 'lm-flange-bars'
},

/* ================================================================ CS-mount */
{
  id: 'cs-mount', parent: 'lens-mounts', title: 'The CS-mount', level: 1,
  short: 'The CS-mount is the C-mount with the image plane 5 mm closer: the same 1-inch thread, but a flange focal distance of 12.526 mm instead of 17.526 mm. It exists so that short, wide-angle lenses for small sensors can be smaller and simpler.',
  keywords: ['CS-mount', 'CS mount', '12.526', 'C to CS adapter', '5 mm ring', 'security camera lens', 'CCTV lens', 'varifocal', 'flange focal distance', '1/3 inch', '1/2 inch', 'wide angle'],
  prereq: ['c-mount', 'lens-mounts-and-flange-distance'],
  related: ['lens-adapters-and-back-focus', 's-mount-m12', 'image-circle-and-sensor-coverage', 'retrofocus-wide-angle', 'varifocal-and-parfocal-lenses', 'field-of-view-and-focal-length', 'close-up-and-extension-tubes'],
  body: `
The **CS-mount** is the [[c-mount|C-mount]] with five millimetres taken out. The thread is the same, 1"-32 UN (25.4 mm across, 32 turns to the inch). The flange focal distance is **12.526 mm** instead of 17.526 mm.

| | C-mount | CS-mount |
|---|---|---|
| Thread | 1"-32 UN | 1"-32 UN |
| Flange focal distance | 17.526 mm | 12.526 mm |
| Sensors | up to about 1.1" (22 mm image circle) | up to about 1/2" |
| Typical use | microscopes, machine vision, 16 mm cine | security cameras, compact industrial cameras |
| On the other kind of camera | works with a 5 mm ring on a CS camera | cannot focus far on a C camera |

### Why five millimetres were taken out
A small sensor needs a short focal length to see a wide scene. A 2.8 mm lens on a 1/3" sensor (4.8 mm wide) sees 81° across, the view of a doorway camera. But that lens must put its image 17.5 mm behind its flange: six times its focal length. To keep the rear glass that far from the sensor the designer must build a [[retrofocus-wide-angle|retrofocus]] lens with extra elements. At 12.526 mm the distance is only 4.5 times the focal length, and the lens can be smaller, lighter and cheaper. When 1/2" and 1/3" sensors replaced camera tubes in the 1980s, the CS-mount gave security-camera lenses that room.

### One thread, two distances
The two mounts share a thread on purpose, so a C lens and a CS lens both *screw in* to either camera. What differs is where the image forms:

- **C lens on a CS camera**: the lens makes its image 5 mm behind the sensor. Fit the 5 mm C-to-CS ring and the image lands on the sensor.
- **CS lens on a C camera**: the lens makes its image 5 mm in front of the sensor. A ring only moves the lens farther away, so nothing helps: the focus ring can move the image *back* only for nearer objects, and the lens focuses on a single close distance.

That close distance is $s = f + f^2/x$, with $x = 5$ mm the error:

| Focal length of the CS lens | 4 mm | 8 mm | 12 mm | 16 mm | 25 mm |
|---|---|---|---|---|---|
| Only focuses at about | 7 mm | 21 mm | 41 mm | 67 mm | 150 mm |

So a CS lens on a C camera is a macro lens that cannot see across the room — and that is how the mistake shows up.

### The adjustable ring
Many security and compact industrial cameras are sold with the 5 mm ring in the box, or with a ring that screws in and out by 5 mm; the manual says "remove for CS lenses". Some varifocal lenses and cameras add a fine **back-focus** adjustment on top ([[lens-adapters-and-back-focus]]).

### What the lens covers
A CS lens is designed for a small sensor, usually 1/3" or 1/2" (image circle of 6 to 8 mm), and its [[image-circle-and-sensor-coverage|image circle]] is only just big enough. On a larger sensor the corners are dark. The mount says nothing about this: read the format on the lens.

> [!key] CS-mount = the C thread with a flange distance of 12.526 mm, 5 mm less. A C lens needs a 5 mm ring on a CS camera; a CS lens on a C camera cannot focus beyond a few centimetres, however it is turned.
`,
  ideas: [
    'CS-mount has the C-mount thread and a flange focal distance of 12.526 mm, exactly 5 mm shorter.',
    'The shorter distance lets wide-angle lenses for small sensors be smaller, because less standoff from the sensor is needed.',
    'A C lens works on a CS camera with a 5 mm ring; the reverse does not work at all.',
    'A CS lens on a C camera can focus only at one close distance, s = f + f²/x with x = 5 mm.',
    'CS lenses are made for small sensors: check the format against the sensor.'
  ],
  pitfalls: [
    'A CS lens will work on a C camera if I screw it in far enough — The thread cannot move the lens closer to the sensor than the camera face allows. The lens is 5 mm too far out, and no screw setting brings the image forward.',
    'The CS thread is smaller than the C thread — They are the same 1"-32 UN thread; only the flange focal distance differs.',
    'The 5 mm ring changes the focal length of the lens — It is an empty spacer with no glass: it only moves the lens 5 mm out, which restores the distance the lens was designed for.',
    'Every camera with a thread has a CS-mount — Cameras are C or CS (or neither: M12, TFL, F). Look for the marking, or measure the distance from the front face to the sensor.'
  ],
  terms: [
    { term: 'CS-mount', def: 'A lens mount with the 1"-32 UN thread of the C-mount and a flange focal distance of 12.526 mm. Standard on security cameras and compact industrial cameras with small sensors.' },
    { term: 'C-to-CS adapter ring', also: ['5 mm ring', 'CS ring', 'spacer ring'], def: 'A 5 mm threaded spacer that lets a C-mount lens work on a CS-mount camera by restoring the 17.526 mm flange distance.' },
    { term: 'Retrofocus', also: ['inverted telephoto', 'reverse telephoto'], def: 'A lens design whose back focal length is longer than its focal length, so that a short-focal-length lens can stand well away from the sensor. Both C and CS wide-angles use it.' },
    { term: 'Varifocal lens', def: 'A lens whose focal length can be changed by hand, but which needs refocusing afterwards. Common in security cameras with CS-mount.' }
  ],
  formulas: [
    {
      name: 'Where a CS lens on a C camera can focus',
      expr: 's = f + f^2/x', tex: 's = f + \\frac{f^2}{x}',
      vars: {
        s: { name: 'distance from the lens\'s principal plane to the one sharp plane', q: 'length', unit: 'mm' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 12, min: 1, max: 200 },
        x: { name: 'how far the lens sits too far from the sensor', q: 'length', unit: 'mm', value: 5, min: 0.01, max: 100 }
      },
      note: 'Thin-lens result: the lens behaves as if an extension tube of length e had been added, and can focus only on this one plane.',
      stories: { s: 'A {f} lens made for a flange distance 5 mm shorter than the camera\'s is put on the camera ({x} too far out). On what distance does it focus?' }
    },
    {
      name: 'Horizontal angle of view',
      expr: 'W = 2*atan(w/(2*f))', tex: 'W = 2\\arctan\\frac{w}{2f}',
      vars: {
        W: { name: 'horizontal angle of view', q: 'angle', unit: '°' },
        w: { name: 'width of the sensor', q: 'length', unit: 'mm', value: 4.8 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 2.8, min: 0.5, max: 500 }
      },
      note: 'For an object far away. A 1/3" sensor is 4.8 mm wide; see the sensor formats.',
      stories: { W: 'A {f} lens is used on a sensor {w} wide. What is the horizontal angle of view?', f: 'What focal length gives a {W} horizontal view on a sensor {w} wide?' }
    },
    {
      name: 'Flange distance relative to the focal length',
      expr: 'k = F/f', tex: 'k = \\frac{F}{f}',
      vars: {
        k: { name: 'flange distance in focal lengths' },
        F: { name: 'flange focal distance', q: 'length', unit: 'mm', value: 12.526, tex: 'F' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 2.8, min: 0.5, max: 500 }
      },
      note: 'A ratio well above 1 means the rear of the lens must stand off from the sensor: a retrofocus design.',
      stories: { k: 'A mount has a flange focal distance of {F}. How many focal lengths is that for a {f} lens?' }
    }
  ],
  examples: [
    {
      title: 'A close-up lens by mistake',
      q: 'An 8 mm CS-mount lens is screwed into a camera with a C-mount. What is the only distance on which it can focus, and why can nothing be done with a ring?',
      steps: [
        'The camera has the sensor 17.526 mm behind its face; the lens expects 12.526 mm. The lens sits $x = 5$ mm too far from the sensor.',
        { text: 'An extension of $x$ lets a lens focus only on the plane at', tex: 's = f + \\frac{f^2}{x} = 8 + \\frac{64}{5} = 20.8\\ \\mathrm{mm}' },
        'A ring would add distance, not take it away. The lens would have to move 5 mm *into* the camera to reach infinity focus.'
      ],
      a: 'About 21 mm in front of the lens: a lens that sees across the room on the right camera sees only a thing held against it on the wrong one.'
    },
    {
      title: 'A doorway camera',
      q: 'A doorway camera is to see 90° across its width using a 1/3" sensor (4.8 mm wide). What focal length is needed, and how large is its flange distance in focal lengths on a CS-mount?',
      steps: [
        { text: 'Solve the angle of view for the focal length:', tex: 'f = \\frac{w}{2\\tan(W/2)} = \\frac{4.8}{2\\tan 45°} = 2.4\\ \\mathrm{mm}' },
        { text: 'The flange distance in focal lengths:', tex: 'k = \\frac{12.526}{2.4} = 5.2' }
      ],
      a: 'A 2.4 mm lens, with the image 5.2 focal lengths behind its flange: an extreme retrofocus design — which is why such lenses are often M12 board lenses instead.'
    }
  ],
  quiz: [
    { q: 'What is the flange focal distance of a CS-mount?', choices: ['12.526 mm', '17.526 mm', '5 mm', '25.4 mm'], a: 0, why: '17.526 mm − 5 mm = 12.526 mm. 17.526 mm is the C-mount; 25.4 mm is the thread diameter; 5 mm is the ring.' },
    { q: 'Which combination can be repaired with a plain 5 mm spacer ring?', choices: ['A C lens on a CS camera', 'A CS lens on a C camera', 'A C lens on a C camera', 'Neither'], a: 0, why: 'The C lens needs 5 mm more distance than the CS camera gives. Spacing it out by 5 mm restores it; a CS lens on a C camera is already 5 mm too far out.' },
    { q: 'A 12 mm CS-mount lens is fitted to a C-mount camera. On what distance, in millimetres from the lens, does it focus?', answer: 40.8, unit: 'mm', why: '$s = f + f^2/x = 12 + 144/5 = 40.8$ mm.' },
    { q: 'The CS-mount has a smaller thread than the C-mount.', a: false, why: 'Both use the 1"-32 UN thread. They differ only in flange focal distance, by 5 mm.' },
    { q: 'Why was the CS-mount introduced?', choices: ['Small sensors need short, wide-angle lenses, which are easier to build with less standoff from the sensor', 'To use a smaller thread', 'To give lenses a larger image circle', 'To allow electrical contacts'], a: 0, why: 'A shorter flange distance lets a short-focal-length lens be built more compactly and cheaply; the thread was kept so that C lenses still fit.' }
  ],
  applications: [
    'Security and surveillance cameras, which use CS-mount lenses and varifocal lenses of 2.8 to 12 mm.',
    'Compact industrial and traffic cameras, often supplied with a ring so that either kind of lens can be used.',
    'Single-board-computer cameras with a C/CS mount, where a ring converts between the two.',
    'Lens swapping in the lab: knowing the 5 mm rule saves hours of looking for a faulty lens.'
  ],
  history: 'The C-mount of the 1920s was made for 16 mm film and later for television tubes. When solid-state sensors of 1/2 inch and 1/3 inch took over in the 1980s, lenses of 4 to 8 mm focal length needed to be short and cheap. The CS-mount kept the thread and lost 5 mm of flange distance, so that old C lenses could still be used with a ring.',
  sources: [
    'Japan Industrial Imaging Association (JIIA), lens-mount standards for machine-vision lenses — the C-, CS- and TFL-mounts.',
    'ASME/ANSI B1.1, *Unified Inch Screw Threads* — the 1-32 UN thread of both mounts.',
    'W. J. Smith, *Modern Optical Engineering* — the thin-lens relations behind the near-focus distance and the angle of view.'
  ],
  sim: [{ id: 'ref-cmount', params: { lens: 'CS', cam: 'C' } }]
},

/* ================================================================ S-mount / M12 */
{
  id: 's-mount-m12', parent: 'lens-mounts', title: 'The S-mount (M12) and board lenses', level: 1,
  short: 'The S-mount, or M12 lens, is a small lens in a 12 mm barrel with an M12 × 0.5 thread. It has no standard flange distance: it is screwed into a holder on the sensor board until the picture is sharp, then locked.',
  keywords: ['S-mount', 'M12', 'M12 x 0.5', 'board lens', 'mini lens', 'lens holder', 'embedded vision', 'IR-cut filter', 'focus by screwing', 'drone camera', 'security camera', 'automotive camera', 'fisheye'],
  prereq: ['lens-mounts-and-flange-distance', 'focusing-a-lens'],
  related: ['cs-mount', 'c-mount', 'image-circle-and-sensor-coverage', 'sensor-formats-and-pixel-size', 'microlenses-bsi-and-stacked-sensors', 'quantum-efficiency-and-spectral-response', 'the-phone-camera'],
  body: `
Inside a security camera, a drone, a doorbell or a car's driver-monitoring system there is a small circuit board with a sensor in the middle and a plastic or metal block on top. A lens barrel about the size of a thimble is screwed into the block. The thread is **M12 × 0.5**: 12 mm across and 0.5 mm from one turn to the next. Industrial catalogues call it the **S-mount**; everyone else says "M12 lens" or "board lens".

| | S-mount (M12) |
|---|---|
| Thread | M12 × 0.5, an ISO metric fine thread |
| Flange focal distance | none fixed: the lens is focused by turning it |
| One full turn | 0.5 mm of axial travel |
| Sensors | up to about 1/1.8"; most lenses are made for smaller ones |
| Focal lengths | from fisheyes under 2 mm to about 25 mm |
| Used in | board cameras, drones, cars, embedded vision |

### No flange distance: focus by turning
A C-mount camera is built to a flange distance and the focus ring does the rest. An M12 lens has no such standard. The lens sits in a **holder** glued or screwed to the board around the sensor, and its position along the thread is part of the assembly: the lens is screwed in or out until the image is sharp, and then **locked** with a set screw, a lock nut or a drop of adhesive. Production lines do this by turning the lens while looking at a test chart (*active alignment*).

How far? For an object at distance $s$ the lens must stand farther from the sensor than at infinity by $x = f^2/(s - f)$. With the thread's 0.5 mm per turn:

| Lens | Object at 100 mm | at 300 mm | at 1 m |
|---|---|---|---|
| f = 2.8 mm | 58° of turn | 19° | 6° |
| f = 4 mm | 120° | 39° | 12° |
| f = 8 mm | 501° | 158° | 46° |
| f = 12 mm | 1178° | 360° | 105° |

The focus ring of a C-mount lens does this work inside the lens; here it is the whole lens that moves. And it must be set to a few degrees: the depth of focus at f/2 with 3 µm pixels is ±6 µm, and one degree of turn is 1.4 µm of travel. A lens locked with a loose set screw drifts out of focus with vibration and temperature.

### Inside the holder: the infrared-cut filter
Silicon responds to light out to about 1100 nm, far into the infrared; a colour camera would show foliage pale and black cloth purple. A visible-light camera therefore needs an **IR-cut filter**, which cuts off at about 650 nm. In a board camera it sits in the lens barrel, in the holder or on the sensor's cover glass. A day-and-night camera swaps it out at night to see the infrared floodlight. A filter of thickness $t$ and index $n$ shifts the image by $t\\,(n-1)/n$ ([[c-mount]]), so a lens and holder are designed together.

### What a board lens is, and is not
Many board lenses are built with plastic elements, designed for one sensor and its microlens geometry ([[microlenses-bsi-and-stacked-sensors]]): a lens for another sensor may show coloured corners. Their [[image-circle-and-sensor-coverage|image circle]] is just big enough for the format on the datasheet. Lenses of 1.6 to 2.8 mm for 180° and wider views are fisheyes, not rectilinear designs, and are made in this mount.

> [!key] M12 × 0.5 is a thread, not a distance: there is no flange focal distance, the whole lens is screwed in until the image is sharp (1 turn = 0.5 mm; 1° = 1.4 µm), then locked. The IR-cut filter and the sensor format belong to the lens-and-holder pair.
`,
  ideas: [
    'An S-mount lens has an M12 × 0.5 thread and no fixed flange focal distance.',
    'It is focused by screwing it in the holder: one turn is 0.5 mm, one degree 1.4 µm.',
    'Once sharp, the lens is locked with a set screw, nut or adhesive; a loose lens drifts out of focus.',
    'An infrared-cut filter sits in the barrel, the holder or on the sensor, and shifts the image by t(n−1)/n.',
    'Board lenses are made for a given sensor format and chief-ray angle; check both before swapping.'
  ],
  pitfalls: [
    'An M12 lens has a flange focal distance like a C-mount — It has none: the position along the thread is set at assembly. Two holders from different makers can put the same lens at slightly different distances.',
    'Any M12 lens fits any M12 holder and works — The thread fits; whether the picture covers the sensor and the corners are not coloured depends on the lens format and the sensor microlenses.',
    'Once focused at the factory the lens is fixed — Only if it is locked. The depth of focus is a few micrometres, so a lens that can turn will drift.',
    'The infrared-cut filter is an optional extra — A visible-light camera on silicon needs it; without it the colours are wrong and the picture is hazy by infrared.'
  ],
  terms: [
    { term: 'S-mount', also: ['M12 mount', 'M12 × 0.5', 'M12 lens'], def: 'A lens mount in which the lens barrel has an M12 × 0.5 thread and is screwed into a holder on the sensor board. There is no standard flange distance.' },
    { term: 'Board lens', also: ['mini lens', 'miniature lens'], def: 'A small, light lens for a board-level camera, usually in a 12 mm threaded barrel, often with plastic elements.' },
    { term: 'Lens holder', also: ['lens mount block', 'M12 holder'], def: 'The block, glued or screwed around the sensor, with an M12 thread into which a board lens is screwed and locked.' },
    { term: 'Thread pitch', def: 'The distance between neighbouring thread crests; one full turn moves the lens along the axis by one pitch (0.5 mm for M12 × 0.5).' },
    { term: 'IR-cut filter', also: ['IRCF', 'infrared-blocking filter', 'hot mirror'], def: 'A filter that blocks wavelengths beyond about 650 nm so that a silicon sensor sees only what the eye sees.' },
    { term: 'Active alignment', def: 'Setting the lens position while watching the picture of a test chart, then fixing it; the usual way of focusing board lenses in production.' }
  ],
  formulas: [
    {
      name: 'Lens travel from the infinity position',
      expr: 'x = f^2/(s - f)', tex: 'x = \\frac{f^2}{s - f}',
      vars: {
        x: { name: 'how far the lens moves away from the sensor', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 4, min: 1, max: 100 },
        s: { name: 'object distance (from the lens)', q: 'length', unit: 'mm', value: 300, min: 1, max: 1e7 }
      },
      note: 'Thin lens, from the position of infinity focus. The lens must be farther from the sensor for a nearer object.',
      stories: { x: 'A {f} board lens is focused at infinity and then on an object {s} away. How far does it move?', s: 'A {f} lens is screwed out by {x} from its infinity position. On what distance is it focused?' }
    },
    {
      name: 'Turn of the lens',
      expr: 'a = 2*pi*x/p', tex: 'a = 2\\pi\\,\\frac{x}{p}',
      vars: {
        a: { name: 'angle through which the lens is turned', q: 'angle', unit: '°' },
        x: { name: 'axial travel', q: 'length', unit: 'mm', value: 0.1 },
        p: { name: 'thread pitch', q: 'length', unit: 'mm', value: 0.5, tex: 'p' }
      },
      note: 'One full turn (360°) advances the lens by the pitch. For M12 × 0.5 that is 0.5 mm, or 1.39 µm per degree.',
      stories: { a: 'A lens on a thread of {p} pitch has to move {x}. By what angle is it turned?' }
    },
    {
      name: 'Depth of focus in degrees of turn',
      expr: 'a = 360*N*c/p', tex: 'a = 360°\\,\\frac{N\\,c}{p}',
      vars: {
        a: { name: 'turn of the lens that keeps the blur below c, in degrees (plus or minus)' },
        N: { name: 'f-number', value: 2, min: 0.5, max: 64 },
        c: { name: 'largest acceptable blur (about one pixel)', q: 'length', unit: 'µm', value: 3 },
        p: { name: 'thread pitch', q: 'length', unit: 'mm', value: 0.5, tex: 'p' }
      },
      note: 'The answer is in degrees (a plain number): how far the lens may be off before the blur exceeds c.',
      stories: { a: 'A lens at f/{N} on a thread of {p} pitch may blur a point to {c} at most. Through how many degrees may it be off?' }
    }
  ],
  examples: [
    {
      title: 'Reading a label from close up',
      q: 'An 8 mm board lens is focused at infinity. It is then to read a label held 200 mm away. How far must it be screwed out, and through what angle on an M12 × 0.5 thread?',
      steps: [
        { text: 'The travel:', tex: 'x = \\frac{f^2}{s - f} = \\frac{64}{200 - 8} = 0.333\\ \\mathrm{mm}' },
        { text: 'The angle, with 0.5 mm per turn:', tex: 'a = 360° \\times \\frac{0.333}{0.5} = 240°' }
      ],
      a: '0.33 mm out, two thirds of a turn (240°). An 8 mm lens that can reach 200 mm needs a thread with room for that travel above the infinity position.'
    },
    {
      title: 'How tight a lock?',
      q: 'A lens at f/2 is used with 3 µm pixels. Through how many degrees of rotation may it drift before the blur on the sensor exceeds one pixel?',
      steps: [
        { text: 'The depth of focus is $N c = 2 \\times 3 = 6$ µm of travel; one turn is 500 µm:', tex: 'a = 360° \\times \\frac{6}{500} = 4.3°' }
      ],
      a: 'About ±4°. A lens that can be moved by hand by more than that — or loosens under vibration — will go out of focus.'
    }
  ],
  quiz: [
    { q: 'How far does an M12 × 0.5 lens move along its axis in one full turn?', choices: ['0.5 mm', '12 mm', '1 mm', '0.05 mm'], a: 0, why: 'The pitch of the thread is 0.5 mm: each full turn advances it by one pitch. 12 mm is the diameter.' },
    { q: 'An M12 lens has a standard flange focal distance of 17.526 mm like the C-mount.', a: false, why: 'It has none. The lens is screwed into a holder until the picture is sharp, and the position is part of the assembly.' },
    { q: 'A 4 mm lens, focused at infinity, is turned out to focus at 300 mm. How far, in millimetres, does it move?', answer: 0.054, unit: 'mm', why: '$x = f^2/(s - f) = 16/296 = 0.054$ mm, a little over a tenth of a turn (39°).' },
    { q: 'Why does a board camera need an IR-cut filter?', choices: ['Silicon responds to infrared out to about 1100 nm, which spoils colour and contrast', 'To protect the lens from dust', 'To make the image brighter', 'Because M12 lenses transmit no infrared'], a: 0, why: 'The eye sees only to about 700 nm; the sensor sees far further. The filter makes the camera see what the eye sees.' },
    { q: 'After focusing, the lens is locked with a set screw because…', choices: ['the depth of focus is a few micrometres, so a free lens drifts out of focus', 'the thread is too coarse', 'the lens would fall out otherwise', 'it prevents dust'], a: 0, why: 'One degree of turn is 1.4 µm; a lens that may rotate by a few degrees loses focus.' }
  ],
  applications: [
    'Security cameras, doorbells and webcams, where cost and size matter more than interchangeability.',
    'Drones and vehicles: surround-view cameras with fisheye M12 lenses, driver-monitoring cameras.',
    'Embedded vision: boards with a sensor and an M12 holder, with a lens chosen for the field of view and the sensor.',
    'Small industrial cameras on robot arms and handheld instruments, where size and weight matter.'
  ],
  history: 'M12 × 0.5 is an ordinary ISO metric fine thread. It became the de-facto standard for small camera lenses as cheap CMOS sensors spread into security cameras, webcams and embedded devices, and industrial catalogues gave the mount the name S-mount.',
  sources: [
    'ISO 261, *ISO general purpose metric screw threads — General plan*, and ISO 724 — the dimensions of the M12 × 0.5 fine thread.',
    'W. J. Smith, *Modern Optical Engineering* — thin-lens focusing and the image shift of a plane plate.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — thin-lens relations.'
  ],
  sim: 'lm-board-lens'
}

,

/* ================================================================ F-mount */
{
  id: 'f-mount', parent: 'lens-mounts', title: 'The F-mount', level: 2,
  short: 'The F-mount is a three-lug bayonet with a 44 mm throat and a flange focal distance of 46.5 mm. It was born on a single-lens reflex camera in 1959, and machine vision still uses it for large sensors and line-scan cameras, because its 43 mm image circle is more than any C-mount lens can give.',
  keywords: ['F-mount', 'F mount', 'Nikon F', 'bayonet', '46.5 mm', 'three lugs', 'SLR', 'line-scan', 'full frame', 'large sensor', 'F-mount adapter', 'aperture lever', 'machine vision lens'],
  prereq: ['lens-mounts-and-flange-distance', 'c-mount'],
  related: ['photographic-lens-mounts', 'cine-and-large-format-mounts', 'lens-adapters-and-back-focus', 'image-circle-and-sensor-coverage', 'area-scan-and-line-scan-cameras', 'sensor-formats-and-pixel-size', 'viewfinders-and-focusing-screens'],
  body: `
The **F-mount** is a bayonet with three lugs, a throat 44 mm across and a flange focal distance of **46.5 mm**. It was introduced in 1959 on a single-lens reflex camera and its dimensions have hardly changed since, so lenses of more than six decades fit bodies of today.

| | F-mount |
|---|---|
| Type | bayonet, three lugs |
| Flange focal distance | 46.5 mm |
| Throat | 44 mm |
| Image circle served | full frame (43.3 mm diagonal) |
| Born | 1959, SLR cameras |
| In machine vision | line-scan and large-sensor cameras |

### Why 46.5 mm: the mirror
A reflex camera has a mirror at 45° between lens and film, which throws the picture up to the viewfinder and swings out of the way for the exposure. The mirror, the shutter behind it and the lugs of the mount need room, and the room is the flange distance. At 46.5 mm the camera is a box thick enough for a mirror that covers a 36 × 24 mm frame, and the lens must form its image that far behind its flange. The throat of 44 mm is just wider than the diagonal of that frame, 43.3 mm. The same mount without a mirror would be 25 to 30 mm shorter, which is what [[photographic-lens-mounts|mirrorless]] makers did.

### What fits on it
Over its life the mount has carried lenses with a focus ring and an aperture ring on the barrel, autofocus lenses driven from the body, and lenses without an aperture ring whose diaphragm is closed by a lever or by electronics. The bayonet is the same; the couplings differ. A lens that depends on the camera to close its diaphragm needs the camera, or an adapter, to do it: in machine vision this is why lenses with a plain aperture ring are preferred.

### F-mount in machine vision
Industrial lenses with an F-mount appear where the sensor is bigger than a C-mount lens can cover. A C-mount lens lights a circle of at most about 22 mm; an F-mount lens, 43 mm. The cases are:

- **Line-scan cameras.** A 4096-pixel sensor of 7 µm pixels is 28.7 mm long; a 2048-pixel one 14.3 mm. Both fit inside the F-mount circle with room to spare. An 8192-pixel line, 57.3 mm, does not: it needs M58 or M72 ([[cine-and-large-format-mounts]]).
- **Large area sensors**, up to full frame (36 × 24 mm).
- Cameras where the bayonet is simply convenient: a photographic lens can be borrowed, though industrial versions add locking screws for focus and aperture and a lens made for flat fields rather than portraits.

### What an F lens adapts to
Because 46.5 mm is a long distance, an F lens can be adapted to almost every other mount in the table by a plain tube of the difference:

| Camera mount | Its flange distance | Adapter for an F lens |
|---|---|---|
| EF | 44.0 mm | 2.5 mm |
| MFT | 19.25 mm | 27.25 mm |
| C-mount | 17.526 mm | 28.97 mm |
| E | 18.0 mm | 28.5 mm |
| Z | 16.0 mm | 30.5 mm |

The reverse does not work: a lens from a shorter mount cannot be used on an F camera. A plain tube carries no contacts, so electronic lenses need adapters with electronics.

> [!key] The F-mount is a three-lug bayonet, 44 mm throat, flange focal distance 46.5 mm, long because an SLR needs room for its mirror. Its 43 mm image circle is why machine vision uses it for line-scan and large sensors.
`,
  ideas: [
    'The F-mount is a three-lug bayonet with a 44 mm throat and a flange focal distance of 46.5 mm.',
    'The long distance makes room for the mirror of a single-lens reflex camera.',
    'Its image circle serves full frame (43.3 mm diagonal), far more than a C-mount lens.',
    'Machine vision uses it for line-scan sensors up to about 4096 pixels of 7 µm and for large area sensors.',
    'An F lens adapts to almost any other mount by a tube of the difference of the flange distances.'
  ],
  pitfalls: [
    'An F-mount lens fits any camera with a three-lug bayonet — The bayonet fits only the F-mount; other makers\' bayonets have different lugs, throats or distances. Check the flange distance and the fit.',
    'F-mount lenses cover any sensor — They cover up to full frame, 43.3 mm diagonal. A line of 8192 pixels of 7 µm is 57.3 mm long, beyond them.',
    'A photographic F lens is as good as an industrial one on a machine-vision camera — It forms a good picture, but it may have no locking screws, a diaphragm that needs the camera, and distortion and shading tuned for pictures rather than measurements.',
    'The mirror is the only thing in the 46.5 mm — The mirror, shutter, viewfinder prism and the drive of the lens all share the camera box.'
  ],
  terms: [
    { term: 'F-mount', also: ['Nikon F', 'F bayonet'], def: 'A three-lug bayonet with a 44 mm throat and a flange focal distance of 46.5 mm, introduced on a single-lens reflex camera in 1959 and used since on lenses and industrial cameras.' },
    { term: 'Lug', also: ['bayonet lug', 'tab'], def: 'One of the tabs of a bayonet. The lugs of the lens slide past those of the camera and are held against them by a twist of the lens.' },
    { term: 'Aperture lever', also: ['diaphragm lever', 'aperture coupling'], def: 'A small lever at the rear of a lens that sets the diaphragm: the camera moves it to close the iris at the moment of exposure.' },
    { term: 'Mirror box', also: ['reflex mirror box'], def: 'The cavity between the lens mount and the sensor of a single-lens reflex camera, which holds the swinging mirror and sets the long flange distance.' },
    { term: 'Line-scan camera', also: ['linescan'], def: 'A camera whose sensor is a single row (or a few rows) of pixels, which builds a picture line by line as the object moves past. See area-scan and line-scan cameras.' }
  ],
  formulas: [
    {
      name: 'Diagonal of a sensor',
      expr: 'D = sqrt(w^2 + h^2)', tex: 'D = \\sqrt{w^2 + h^2}',
      vars: {
        D: { name: 'diagonal', q: 'length', unit: 'mm' },
        w: { name: 'width of the sensor', q: 'length', unit: 'mm', value: 36 },
        h: { name: 'height of the sensor', q: 'length', unit: 'mm', value: 24 }
      },
      note: 'The image circle of the lens must be at least this large, and the throat should be wider than it.',
      stories: { D: 'A sensor is {w} wide and {h} high. What is its diagonal?' }
    },
    {
      name: 'Length of a line-scan sensor',
      expr: 'L = n*p', tex: 'L = n\\,p',
      vars: {
        L: { name: 'length of the line', q: 'length', unit: 'mm' },
        n: { name: 'number of pixels', value: 4096, min: 1, max: 100000, int: true },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 7 }
      },
      note: 'The lens must light a circle at least this large.',
      stories: { L: 'A line-scan sensor has {n} pixels of {p} each. How long is the line?' }
    },
    {
      name: 'Adapter for a lens on a shorter mount',
      expr: 'a = F - Fb', tex: 'a = F - F_{b}',
      vars: {
        a: { name: 'thickness of the adapter', q: 'length', unit: 'mm', signed: true },
        F: { name: 'flange focal distance of the F-mount', q: 'length', unit: 'mm', value: 46.5, tex: 'F' },
        Fb: { name: 'flange focal distance of the camera', q: 'length', unit: 'mm', value: 17.526, tex: 'F_{b}' }
      },
      stories: { a: 'An F-mount lens (46.5 mm) is to be put on a camera whose flange focal distance is {Fb}. How thick is the adapter?' }
    }
  ],
  examples: [
    {
      title: 'Does the line fit the lens?',
      q: 'A line-scan camera offers a choice of sensors: 2048, 4096 and 8192 pixels, all with 7 µm pixels. Which can use an F-mount lens, whose image circle is 43 mm?',
      steps: [
        { text: 'The lengths:', tex: 'L = n\\,p = 14.3,\\ 28.7,\\ 57.3\\ \\mathrm{mm}' },
        'The first two lie inside the 43 mm circle, the 4096-pixel line with 14 mm to spare. The last is 57.3 mm, longer than the whole circle.'
      ],
      a: 'The 2048 and 4096 pixel versions. The 8192 pixel sensor needs a bigger image circle: M58 or M72.'
    },
    {
      title: 'An F lens on a C camera',
      q: 'An F-mount lens of 50 mm is put on a C-mount camera with a 1/1.8" sensor (7.18 mm wide) through a tube. How thick must the tube be, and what horizontal angle of view results, compared with the 39.6° the lens gives on full frame?',
      steps: [
        { text: 'The tube:', tex: 'a = 46.5 - 17.526 = 28.97\\ \\mathrm{mm}' },
        { text: 'The angle of view on the small sensor:', tex: 'W = 2\\arctan\\frac{7.18}{2 \\times 50} = 8.2°' }
      ],
      a: 'A 28.97 mm tube; the sensor sees only the middle 8.2° of the 39.6° the lens covers, so the field of a 50 mm lens shrinks to that of a lens of about 250 mm on full frame.'
    }
  ],
  quiz: [
    { q: 'What is the flange focal distance of the F-mount?', choices: ['46.5 mm', '44 mm', '17.526 mm', '55 mm'], a: 0, why: '46.5 mm. 44 mm is its throat (and the flange distance of the EF-mount); 17.526 mm is the C-mount; 55 mm is the T2.' },
    { q: 'Why is the flange distance of the F-mount so long?', choices: ['An SLR needs room for the swinging mirror between lens and sensor', 'To give a larger throat', 'Because the lugs are thick', 'To allow close focusing'], a: 0, why: 'The mirror that sends the picture to the viewfinder swings in the space between lens and film; mirrorless cameras, without it, are 25 to 30 mm shallower.' },
    { q: 'A line-scan sensor has 4096 pixels of 7 µm. How long is the line, in millimetres?', answer: 28.7, unit: 'mm', why: '$L = n p = 4096 \\times 7\\ \\mu\\mathrm{m} = 28.7$ mm, well inside the 43 mm circle of an F-mount lens.' },
    { q: 'An F-mount lens can be used on a C-mount camera with a tube about 29 mm long.', a: true, why: '46.5 − 17.526 = 28.97 mm: the camera is shallower, so the tube makes up the difference. A C lens on an F camera is the impossible direction.' },
    { q: 'Which of these sensors is **too large** for the image circle of an F-mount lens?', choices: ['A line of 8192 pixels of 7 µm', 'A line of 4096 pixels of 7 µm', 'An APS-C sensor', 'A 1.1" sensor'], a: 0, why: 'The line is 57.3 mm long; the F-mount circle is 43 mm. The other three have diagonals of 28.7, 28.3 and 17.6 mm.' }
  ],
  applications: [
    'Single-lens reflex cameras from 1959 on, and the huge stock of lenses made for them.',
    'Line-scan cameras for web and sheet inspection, where the sensor is a few centimetres long.',
    'Large-sensor industrial and scientific cameras, up to full frame, where C-mount lenses are too small.',
    'Astronomy and microscopy, where photographic lenses are borrowed through adapters (T2 rings).'
  ],
  history: 'The F-mount appeared in 1959 on the Nikon F, and its bayonet was kept through manual focus, autofocus and electronic apertures: a lens from the 1960s still fits a body of today. Its shorter successor, the Z-mount of 2018 (flange distance 16 mm), takes F lenses on a 30.5 mm adapter.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — camera lenses and the camera body that carries them.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the reflex camera and the image circle of its lenses.',
    'Camera makers\' published mount specifications — the 44 mm throat and 46.5 mm flange focal distance of the F-mount.'
  ],
  sim: 'lm-bayonet'
},

/* ================================================================ photographic bayonets */
{
  id: 'photographic-lens-mounts', parent: 'lens-mounts', title: 'Photographic bayonet mounts', level: 2,
  short: 'EF, RF, E, Z, L, X, Micro Four Thirds, M and K: the bayonets of cameras. The old SLR mounts (EF, K) have flange distances of 44 to 46 mm because a mirror needs room; the mirrorless mounts (Z, X, E, RF, L, MFT) have 16 to 20 mm and wider throats, which allows simpler wide-angle lenses and adapters for everything older.',
  keywords: ['EF', 'RF', 'E-mount', 'Z-mount', 'L-mount', 'X-mount', 'Micro Four Thirds', 'MFT', 'M-mount', 'K-mount', 'mirrorless', 'flange distance', 'throat', 'bayonet', 'adapter', 'SLR', 'rangefinder'],
  prereq: ['lens-mounts-and-flange-distance', 'f-mount'],
  related: ['lens-adapters-and-back-focus', 'cine-and-large-format-mounts', 'retrofocus-wide-angle', 'microlenses-bsi-and-stacked-sensors', 'crop-factor-and-equivalent-focal-length', 'camera-families', 'the-interchangeable-lens-camera'],
  body: `
Every camera maker has its own bayonet. The nine of the table below, with the [[f-mount|F-mount]], carry most of the world's interchangeable lenses. The numbers are the flange focal distance (mounting face to sensor) and the throat (clear diameter).

| Mount | Flange distance | Throat | Meant for | Kind of camera |
|---|---|---|---|---|
| EF | 44.0 mm | 54 mm | full frame | SLR (1987) |
| K | 45.46 mm | 44 mm | full frame | SLR (1975) |
| M | 27.8 mm | 44 mm | full frame | rangefinder (1954) |
| MFT | 19.25 mm | 38 mm | 4/3" | mirrorless (2008) |
| E | 18.0 mm | 46.1 mm | APS-C and full frame | mirrorless (2010) |
| X | 17.7 mm | 43.5 mm | APS-C | mirrorless (2012) |
| L | 20.0 mm | 51.6 mm | full frame, shared by several makers | mirrorless |
| RF | 20.0 mm | 54 mm | full frame | mirrorless (2018) |
| Z | 16.0 mm | 55 mm | full frame | mirrorless (2018) |

### Two generations
The flange distances fall into two groups. The SLR mounts, F, EF and K, are 44 to 46.5 mm: a mirror and a prism share the box. The rangefinder M-mount, 27.8 mm, has no mirror but a shutter, and the lens may stand out into the camera. The mirrorless mounts, 16 to 20 mm, have nothing between lens and sensor but a shutter and a filter pack: Z at 16 mm is the shortest of them.

### Short and wide: what it buys
- **Simple wide-angles.** An SLR wide-angle must put its rear glass far from the sensor, 38 mm and more behind a 24 mm lens, which forces a [[retrofocus-wide-angle|retrofocus]] design. With a flange distance of 16 to 20 mm the rear element can sit close, and the designer is free.
- **A wide cone of light.** The throat bounds the steepest ray that can reach the corner of the sensor: a ray from the far edge of the opening to the opposite corner of a 43.3 mm sensor. With the Z-mount that is 72° from the axis, with the F-mount 43°, and with the E-mount 68°. A wide opening lets a lens deliver a bright, evenly lit image to the corners.
- **Adapters for everything.** A plain tube joins any lens whose flange distance is longer: F to Z 30.5 mm, K to E 27.46 mm, the M-mount to E 9.8 mm, EF to RF 24 mm.

The price is the steep ray: it reaches the sensor at a large angle at the edge, where the microlenses over each pixel must be shifted to catch it ([[microlenses-bsi-and-stacked-sensors]]), and where a sensor's cover glass and filters start to matter.

### Crop mounts
X and Micro Four Thirds were made for smaller sensors: APS-C (28.3 mm diagonal) and 4/3" (21.6 mm). Their throats are smaller, 43.5 and 38 mm, and their lenses are smaller too; on a full-frame body they would show dark corners, and a full-frame lens fits their cameras at the cost of a narrower field ([[crop-factor-and-equivalent-focal-length]]).

### Contacts
The old mounts coupled lens and camera mechanically. From EF on, the mounts carry electrical contacts: the camera tells the lens which aperture to set and how far to move the focus, and the lens tells the camera its focal length, its distance setting and, in many, the corrections it needs. Autofocus ([[autofocus-methods]]) and stabilization ([[image-stabilization]]) ride on these contacts, which is why an adapter without electronics gives manual lenses only.

> [!key] SLR mounts (F, EF, K) are 44 to 46.5 mm deep because a mirror needs room; mirrorless mounts (Z, X, E, RF, L, MFT) are 16 to 20 mm with wider throats. A shorter mount makes wide-angle lenses simpler and accepts every longer mount through a plain tube.
`,
  ideas: [
    'SLR bayonets (F, EF, K) have flange distances of 44 to 46.5 mm; mirrorless ones (Z, X, E, RF, L, MFT) 16 to 20 mm.',
    'The throat bounds the steepest ray to the corner of the sensor: about 43° for an F-mount, 72° for the Z-mount.',
    'Short mounts allow simple wide-angle lenses and adapters for any longer mount.',
    'The cost is a steeper ray at the sensor edge, which microlenses and sensor design must cope with.',
    'Contacts carry aperture, focus and stabilization data: an adapter without electronics gives manual lenses.'
  ],
  pitfalls: [
    'Mirrorless lenses are small because their mounts are — The size of a lens follows its focal length and aperture. A fast telephoto for a mirrorless camera is as large as one for an SLR; only the camera body is smaller.',
    'A shorter flange distance makes better pictures — It gives the designer freedom; it does not by itself give sharpness. Each lens still has its own design and tolerances.',
    'All mirrorless mounts are the same — They differ in fit, throat, distance and electrical protocol. Only the flange distances are similar; no lens crosses between them without an adapter.',
    'A lens for a crop-sensor mount works on a full-frame body — It fits only if the mount does, and then it lights a smaller circle: the corners go dark unless the camera crops.'
  ],
  terms: [
    { term: 'Mirrorless camera', also: ['mirrorless', 'compact system camera'], def: 'A camera with no reflex mirror: the sensor looks straight through the lens at all times, and the image is viewed on a screen or in an electronic finder. Its mount has a short flange distance.' },
    { term: 'SLR', also: ['single-lens reflex', 'DSLR'], def: 'A camera in which a mirror sends the lens\'s picture to the viewfinder and swings out of the way for the exposure. The mirror forces a long flange distance.' },
    { term: 'Rangefinder camera', def: 'A camera with a separate optical viewfinder coupled to the focus of the lens; it has no mirror, and its mount (M) has a medium flange distance.' },
    { term: 'Crop sensor', also: ['APS-C', 'Micro Four Thirds sensor'], def: 'A sensor smaller than the 36 × 24 mm full frame. Its mount can be smaller, and a full-frame lens on it shows a narrower field.' },
    { term: 'Electronic contacts', also: ['lens contacts', 'CPU contacts'], def: 'A row of pins in the mount through which camera and lens exchange the aperture, focus and stabilization commands and the lens\'s data.' }
  ],
  formulas: [
    {
      name: 'The steepest ray through the throat',
      expr: 'a = atan((T + D)/(2*F))', tex: 'a = \\arctan\\frac{T + D}{2F}',
      vars: {
        a: { name: 'angle of the steepest ray from the axis', q: 'angle', unit: '°' },
        T: { name: 'throat diameter', q: 'length', unit: 'mm', value: 55, tex: 'T' },
        D: { name: 'diagonal of the sensor', q: 'length', unit: 'mm', value: 43.27, tex: 'D' },
        F: { name: 'flange focal distance', q: 'length', unit: 'mm', value: 16, tex: 'F' }
      },
      note: 'Geometry only: the ray from the far edge of the opening to the opposite corner of the sensor. It bounds what the mount allows, not what a lens does.',
      stories: { a: 'A mount has a throat of {T} and a flange distance of {F}; the sensor\'s diagonal is {D}. How steep is the steepest ray to the sensor\'s corner?' }
    },
    {
      name: 'Throat relative to the sensor',
      expr: 'r = T/D', tex: 'r = \\frac{T}{D}',
      vars: {
        r: { name: 'throat in sensor diagonals' },
        T: { name: 'throat diameter', q: 'length', unit: 'mm', value: 55, tex: 'T' },
        D: { name: 'diagonal of the sensor', q: 'length', unit: 'mm', value: 43.27, tex: 'D' }
      },
      note: 'A ratio near 1 (the F-mount: 1.02) leaves nothing to spare; wide mirrorless mounts give 1.1 to 1.3.',
      stories: { r: 'A mount has a throat of {T} and serves a sensor with a diagonal of {D}. What is the ratio?' }
    }
  ],
  examples: [
    {
      title: 'Why a wide throat helps',
      q: 'Compare the steepest ray through the Z-mount (throat 55 mm, flange distance 16 mm) and the F-mount (44 mm, 46.5 mm) for a full-frame sensor with a diagonal of 43.27 mm.',
      steps: [
        { text: 'The Z-mount:', tex: 'a = \\arctan\\frac{55 + 43.27}{2 \\times 16} = \\arctan 3.07 = 72.0°' },
        { text: 'The F-mount:', tex: 'a = \\arctan\\frac{44 + 43.27}{2 \\times 46.5} = \\arctan 0.938 = 43.2°' }
      ],
      a: '72° against 43°: the Z-mount lets light reach the corners at an angle of almost 30° steeper, so a lens can end in a large rear element close to the sensor.'
    },
    {
      title: 'Old lenses on a new camera',
      q: 'What plain adapters take a rangefinder M-mount lens (27.8 mm), an SLR K-mount lens (45.46 mm) and an EF lens (44.0 mm) to a camera with an E-mount (18.0 mm)?',
      steps: [
        { text: 'The difference of the flange distances in each case:', tex: '27.8 - 18 = 9.8\\ \\mathrm{mm}, \\quad 45.46 - 18 = 27.46\\ \\mathrm{mm}, \\quad 44 - 18 = 26\\ \\mathrm{mm}' }
      ],
      a: '9.8 mm, 27.46 mm and 26 mm. The M-mount adapter is a thin ring; the SLR ones are tubes, and the EF one also needs electronics to drive the lens.'
    }
  ],
  quiz: [
    { q: 'Why are SLR mounts 44 to 46.5 mm deep and mirrorless mounts 16 to 20 mm?', choices: ['The SLR needs room for the reflex mirror between lens and sensor', 'SLR lenses are bigger', 'The mirrorless sensors are smaller', 'SLR cameras have no shutter'], a: 0, why: 'The mirror (and the prism above it) share the space between lens and sensor. Without a mirror the mount can be 25 to 30 mm shorter.' },
    { q: 'An EF-mount lens (44.0 mm) is adapted to an RF-mount body (20.0 mm). What is the adapter\'s thickness, in millimetres?', answer: 24, unit: 'mm', why: '$44.0 - 20.0 = 24.0$ mm.' },
    { q: 'A Z-mount lens (16.0 mm) can be used on an E-mount camera (18.0 mm) through a plain tube.', a: false, why: 'The lens needs the sensor 16 mm behind its flange; the E camera has it 18 mm behind. The adapter would have to be −2 mm: the lens would have to sit 2 mm inside the camera.' },
    { q: 'Which mount has the **largest** throat in the table?', choices: ['Z, 55 mm', 'F, 44 mm', 'MFT, 38 mm', 'X, 43.5 mm'], a: 0, why: 'The Z-mount is 55 mm across; EF and RF are 54, L 51.6, E 46.1, F, K and M 44.' },
    { q: 'A shorter flange distance makes the steepest ray to the sensor corner…', choices: ['steeper', 'less steep', 'unchanged', 'parallel to the axis'], a: 0, why: 'With the same opening and sensor, the corner lies closer to the opening along the axis, so the line from the opening to the corner turns steeper: 43° at 46.5 mm, 72° at 16 mm.' }
  ],
  applications: [
    'Interchangeable-lens cameras, whose lens catalogues and adapter markets are built on these mounts.',
    'Mirrorless bodies used in cinema and on drones, where the short flange distance lets them adapt cine, SLR and machine-vision lenses.',
    'Machine vision: industrial cameras with these mounts, to use lenses of large sensors cheaply.',
    'Old-lens enthusiasts: rangefinder and SLR lenses adapted to mirrorless cameras by thin rings and tubes.'
  ],
  history: 'The Leica M-mount of 1954 is the oldest in the table; the Pentax K-mount of 1975 and the EF-mount of 1987 followed, the latter with no mechanical linkage between lens and body at all. From 2008 the mirrorless mounts arrived: Micro Four Thirds (2008), E (2010), X (2012), and in 2018 the full-frame RF and Z with the widest throats yet.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — camera types and the lenses that fit them.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — lens mounts, flange distance and the image circle.',
    'Camera makers\' published mount specifications — flange focal distances and throat diameters of the bayonets in the table.'
  ],
  sim: 'lm-short-and-wide'
},

/* ================================================================ cine and large-format */
{
  id: 'cine-and-large-format-mounts', parent: 'lens-mounts', title: 'Cine, line-scan and large-format mounts', level: 2,
  short: 'PL for cinema, M42 and T2 for old SLR lenses and telescopes, TFL (M35) for industrial cameras with large sensors, M58 and M72 for long line-scan sensors: the mounts for sensors that are bigger than a C-mount lens can cover.',
  keywords: ['PL mount', 'M42', 'T2', 'T-mount', 'TFL', 'M35', 'M58', 'M72', 'line scan', 'large format', 'cinema lens', 'Super 35', 'breech lock', 'image circle', 'flange distance'],
  prereq: ['lens-mounts-and-flange-distance', 'f-mount'],
  related: ['c-mount', 'photographic-lens-mounts', 'area-scan-and-line-scan-cameras', 'image-circle-and-sensor-coverage', 'sensor-formats-and-pixel-size', 'lens-adapters-and-back-focus', 'choosing-a-machine-vision-lens', 'projections:cinema-and-anamorphic-lenses'],
  body: `
Beyond the C-mount and the photographic bayonets, six mounts serve sensors that are too big for a C-mount lens (22 mm image circle at most) or work where the lens is hardly ever changed: the cinema **PL**, the threads **M42** and **T2**, the industrial **TFL** (M35) and the line-scan threads **M58** and **M72**.

| Mount | Fit | Flange distance | Throat | Meant for |
|---|---|---|---|---|
| PL | breech lock, four flanges | 52.0 mm | 54 mm | Super 35 cinema cameras |
| M42 | thread M42 × 1 | 45.46 mm | 42 mm | old SLR lenses, line-scan cameras |
| T2 | thread M42 × 0.75 | 55 mm | 42 mm | telescopes, microscopes, adapters |
| TFL | thread M35 × 0.75 | 17.526 mm | 35 mm | industrial cameras up to APS-C |
| M58 | thread M58 × 0.75 | set by the lens | 58 mm | line-scan, lines up to about 60 mm |
| M72 | thread M72 × 0.75 | set by the lens | 72 mm | line-scan, lines up to about 90 mm |

### PL: the cinema mount
The PL-mount holds a cine lens, heavy and long, without any play, because a focus puller turns the focus ring by hand while the camera runs. Its four flanges slide through the camera's and a locking ring then holds them: a *breech lock*, more like a bayonet than a thread. The flange distance of 52.0 mm and the 54 mm throat serve a Super 35 sensor (24.9 × 18.7 mm, 31.1 mm diagonal). Cine lenses are marked in **T-stops** ([[the-f-number]]) so that exposure matches from lens to lens, and their flange distance is checked with a gauge and shimmed. A PL lens adapts to a mirrorless body by a tube of the difference, 34 mm for the E-mount ([[lens-adapters-and-back-focus]]).

### M42 and T2: two threads of the same width
Both are 42 mm across, and they must not be mixed up: the M42 thread of old SLR lenses has a pitch of 1 mm, the T2 thread of telescope adapters 0.75 mm. A lens with one will not screw into the other. The M42 flange distance, 45.46 mm, is that of an SLR; T2 is 55 mm, with a T-ring turning a camera's bayonet into a T2 thread so that a telescope or microscope can serve as the lens. Both cover full frame (43.3 mm).

### TFL and the line-scan threads
**TFL** (M35 × 0.75) has the same flange distance as the C-mount, 17.526 mm, but a bigger thread: lenses for sensors up to APS-C. A C lens can sit on a TFL camera through a flush reducing ring; a TFL lens cannot go on a C camera, because there is no room for its thread.

**M58** and **M72** are for long line-scan sensors. A line of 8192 pixels of 7 µm is 57.3 mm long, and no F-mount lens covers it. They have no single flange distance: the lens datasheet gives the one it was built for, and the camera or the lens carries the adjustment.

| Line sensor | Length | Mount that covers it |
|---|---|---|
| 2048 × 7 µm | 14.3 mm | C |
| 4096 × 7 µm | 28.7 mm | F, M42, TFL |
| 8192 × 7 µm | 57.3 mm | M58 |
| longer, to about 90 mm | | M72 |

The bigger sensors in the table, 44 × 33 mm (54.8 mm diagonal) and 54 × 40 mm (67.1 mm), also need these bigger mounts.

### The thread rule
A thread is named by its diameter and its pitch: M42 × 1 and M42 × 0.75 differ only in pitch; M58 × 0.75 is a fine thread that gives a precise, backlash-free seating at that diameter. A lens must be locked once the distance has been adjusted.

> [!key] PL (cinema, 52 mm) is a breech lock; M42 and T2 are 42 mm threads of different pitch and distance (45.46 and 55 mm); TFL is a 17.526 mm thread of 35 mm; M58 and M72 hold the lenses of long line-scan sensors, with no fixed flange distance.
`,
  ideas: [
    'PL is a four-flange breech-lock mount with a 52.0 mm flange distance for Super 35 cinema sensors.',
    'M42 × 1 and T2 (M42 × 0.75) have the same diameter but different pitch and flange distance, 45.46 and 55 mm.',
    'TFL (M35 × 0.75) shares the C-mount\'s 17.526 mm flange distance; a C lens fits through a reducing ring, not the reverse.',
    'M58 and M72 carry long line-scan sensors; the flange distance is set by the lens and given on its datasheet.',
    'The mount must be wide enough for the sensor, and the lens must light a circle that covers the line.'
  ],
  pitfalls: [
    'M42 lenses fit T2 adapters — Both are 42 mm across, but the pitches (1 and 0.75 mm) and flange distances (45.46 and 55 mm) differ. They do not screw together.',
    'A PL lens covers any sensor — It is made for Super 35 (31 mm diagonal). A full-frame sensor shows dark corners.',
    'A C-mount lens fits any camera with a larger thread through a ring — Only if the flange distances agree: from C to TFL a flush reducing ring will do, but a TFL lens cannot go on a C camera.',
    'Line-scan lenses have a standard flange distance — M58 and M72 have none: the datasheet states it and the camera or lens is adjusted to it.'
  ],
  terms: [
    { term: 'PL-mount', also: ['positive lock', 'PL'], def: 'A cinema lens mount with four flanges and a locking ring (a breech lock), a 52.0 mm flange focal distance and a 54 mm throat, for Super 35 cameras.' },
    { term: 'M42 mount', also: ['Praktica thread', 'M42 × 1', 'universal thread mount'], def: 'A 42 mm × 1 mm thread used on SLR lenses of the 1950s to 1970s, with a flange distance of 45.46 mm; also used by line-scan cameras.' },
    { term: 'T2 mount', also: ['T-mount', 'T-thread', 'M42 × 0.75'], def: 'A 42 mm × 0.75 mm thread with a 55 mm flange distance, the standard of telescope and microscope camera adapters.' },
    { term: 'TFL mount', also: ['M35 × 0.75', 'thread for lens'], def: 'An industrial mount: an M35 × 0.75 thread with the C-mount\'s flange focal distance of 17.526 mm, for sensors up to APS-C size.' },
    { term: 'M58 and M72 mounts', also: ['M58 × 0.75', 'M72 × 0.75'], def: 'Thread mounts of 58 and 72 mm for long line-scan sensors and large-format sensors, whose flange distance is set by the lens.' },
    { term: 'Breech lock', def: 'A mount in which the flanges of the lens slide through those of the camera and a rotating ring then clamps them, giving a firm seat without play.' }
  ],
  formulas: [
    {
      name: 'Field covered by a line-scan camera',
      expr: 'W = L/m', tex: 'W = \\frac{L}{m}',
      vars: {
        W: { name: 'width of the field along the line', q: 'length', unit: 'mm' },
        L: { name: 'length of the sensor line', q: 'length', unit: 'mm', value: 57.3 },
        m: { name: 'magnification (image ÷ object)', value: 0.2, min: 0.01, max: 20 }
      },
      note: 'The object is imaged at magnification m: a larger field needs a lower m.',
      stories: { W: 'A line sensor is {L} long and the lens works at a magnification of {m}. How wide is the field?' }
    },
    {
      name: 'Focal length from distance and magnification',
      expr: 'f = s*m/(1 + m)', tex: 'f = \\frac{s\\,m}{1 + m}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm' },
        s: { name: 'distance from the lens to the object', q: 'length', unit: 'mm', value: 400 },
        m: { name: 'magnification', value: 0.2, min: 0.001, max: 20 }
      },
      note: 'Thin lens. For a line-scan lens the distance and the magnification are fixed by the job.',
      stories: { f: 'A line-scan lens works {s} from the object at a magnification of {m}. What is its focal length?' }
    }
  ],
  examples: [
    {
      title: 'Which mount for an 8k line sensor?',
      q: 'A line-scan camera has 8192 pixels of 7 µm. It must see a web 287 mm wide from 400 mm. Which mount is needed, what magnification does the job need and what focal length?',
      steps: [
        { text: 'The sensor length:', tex: 'L = 8192 \\times 7\\ \\mu\\mathrm{m} = 57.3\\ \\mathrm{mm}' },
        { text: 'The magnification:', tex: 'm = L/W = 57.3/287 = 0.2' },
        { text: 'The focal length with the object 400 mm away:', tex: 'f = \\frac{s\\,m}{1 + m} = \\frac{400 \\times 0.2}{1.2} = 66.7\\ \\mathrm{mm}' }
      ],
      a: 'An M58 lens (it covers lines to about 60 mm, F-mount does not), working at 0.2× with a focal length near 67 mm.'
    },
    {
      title: 'A PL lens on a mirrorless body',
      q: 'A cinema lens with a PL-mount (52.0 mm) is to be used on a camera with an E-mount (18.0 mm). Which adapter? What about a Super 35 lens covering a 31.1 mm image circle on a full-frame sensor (43.3 mm)?',
      steps: [
        { text: 'The tube:', tex: 'a = 52.0 - 18.0 = 34.0\\ \\mathrm{mm}' },
        'The sensor\'s diagonal is 43.3 mm, bigger than the 31.1 mm circle of the lens: the camera must crop to a Super 35 window, or the corners go dark.'
      ],
      a: 'A 34 mm tube, with the sensor cropped to Super 35 size (or a larger-circle lens).'
    }
  ],
  quiz: [
    { q: 'What is the flange focal distance of the PL-mount?', choices: ['52.0 mm', '45.46 mm', '17.526 mm', '55 mm'], a: 0, why: '52.0 mm; 45.46 mm is M42, 55 mm is T2 and 17.526 mm is C and TFL.' },
    { q: 'An M42 × 1 lens will screw into a T2 (M42 × 0.75) adapter.', a: false, why: 'The diameters are the same but the pitches (1 mm and 0.75 mm) differ, and so do the flange distances; the thread would jam.' },
    { q: 'A line sensor has 8192 pixels of 7 µm. How long is it, in millimetres?', answer: 57.3, unit: 'mm', why: '$8192 \\times 7\\ \\mu\\mathrm{m} = 57.3$ mm, longer than the 43 mm image circle of an F-mount lens, so an M58 lens is needed.' },
    { q: 'Which can be done with a flush reducing ring?', choices: ['A C lens on a TFL camera', 'A TFL lens on a C camera', 'An M42 lens on a T2 adapter', 'A PL lens on an F camera'], a: 0, why: 'C and TFL have the same flange distance, 17.526 mm; the smaller C thread can be reduced to the bigger TFL fitting but not the reverse.' },
    { q: 'M58 and M72 have a single standard flange focal distance like the C-mount.', a: false, why: 'The distance is set by the lens and given on its datasheet; the camera or lens carries the adjustment.' }
  ],
  applications: [
    'Cinema: PL lenses on film and digital cinema cameras, and on adapters for mirrorless bodies.',
    'Line-scan inspection of webs, sheets and flat panels, where M42, TFL, M58 and M72 lenses cover the long sensor.',
    'Telescopes and microscopes: T2 adapters carry cameras at a standard 55 mm.',
    'Large-sensor industrial cameras above 1.1", where C-mount lenses are too small.'
  ],
  history: 'The PL-mount was developed for 35 mm film cameras and carried over unchanged to digital cinema cameras. The M42 thread, first used on East German single-lens reflex cameras of the late 1940s, was taken up by many SLR makers in the 1950s and 1960s. TFL, M58 and M72 came with the industrial line-scan and large-sensor cameras of the last decades.',
  sources: [
    'Japan Industrial Imaging Association (JIIA), lens-mount standards for machine-vision lenses — the C-, CS- and TFL-mounts.',
    'ISO 261 and ISO 724 — metric screw threads: the diameter and pitch of M35, M42, M58 and M72 threads.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the image circle and angle of coverage of camera lenses.'
  ],
  sim: [{ id: 'lm-flange-bars', params: { view: 'faces', group: 'big' } }]
}

,

/* ================================================================ adapters and back focus */
{
  id: 'lens-adapters-and-back-focus', parent: 'lens-mounts', title: 'Adapters and back-focus adjustment', level: 2,
  short: 'A plain adapter is a tube that makes up the difference of two flange distances, so a lens can go on any body whose flange distance is shorter than its own. Adapters with glass change the focal length; back-focus adjustment sets the flange distance exactly, and a wrong one is why a zoom goes out of focus.',
  keywords: ['adapter', 'lens adapter', 'back focus', 'back-focus adjustment', 'shim', 'teleconverter', 'focal reducer', 'speed booster', 'flange distance', 'parfocal', 'zoom out of focus', 'infinity focus', 'C to CS', 'extension tube'],
  prereq: ['lens-mounts-and-flange-distance', 'c-mount', 'photographic-lens-mounts'],
  related: ['cs-mount', 'f-mount', 'cine-and-large-format-mounts', 'varifocal-and-parfocal-lenses', 'zoom-lens-principles', 'focusing-a-lens', 'close-up-and-extension-tubes', 'depth-of-focus'],
  body: `
An adapter is a tube with a mount at each end. It puts the lens the right distance from the new camera's sensor; with glass in it, it also changes the focal length.

### The rule of the plain tube
A lens made for flange distance $F_l$ must be $F_l$ in front of the sensor to focus at infinity. A camera whose sensor lies $F_b$ behind its face supplies $F_b$ of that, so the adapter must supply the rest:

$$a = F_l - F_b$$

The adapter can only add distance, so it works only when $a \\ge 0$: **the lens's mount must have the longer flange distance.**

| Lens | Camera | Adapter |
|---|---|---|
| C (17.526) | CS (12.526) | 5.00 mm |
| F (46.5) | E (18.0) | 28.5 mm |
| EF (44.0) | RF (20.0) | 24.0 mm |
| E (18.0) | F (46.5) | impossible: −28.5 mm |
| CS (12.526) | C (17.526) | impossible: −5.0 mm |

Two mounts with equal distances but different fittings, such as C and TFL (17.526 mm), need only a flush reducing ring, and only from the smaller fitting to the larger. A plain tube has no contacts: an electronic lens needs an adapter with electronics.

### Adapters with glass
- **Teleconverter** (1.4×, 2×): glass between lens and camera. It multiplies the focal length by $m$ and the f-number by the same $m$: a 2× on a 200 mm f/2.8 gives 400 mm at f/5.6, two stops darker.
- **Focal reducer** (about 0.71×, also called a speed booster): the opposite. It shrinks the image circle by $m$ so that a larger-format lens fills a smaller sensor: a full-frame circle of 43.3 mm becomes 30.7 mm, which covers APS-C (28.3 mm). Focal length and f-number both fall by $m$, a stop faster: a 50 mm f/1.8 behaves as 35.5 mm f/1.28.
- **Correcting adapters** that let a short-flange lens go on a long-flange body carry a corrector element that pushes the image back, at the cost of some magnification and of image quality.

### Back-focus adjustment
A camera is built to a tolerance of a few hundredths of a millimetre; a camera that must do better, or whose lenses vary, carries an adjustment. It can be a set of thin **shims** under the mount, a threaded mount ring locked by small screws (C-mount cameras), or a screw that moves the sensor. The usual test is a distant chart: with the sensor too far behind the flange the lens cannot reach infinity focus; with it too near, infinity is sharp with the ring short of its mark. (Most lenses focus a little beyond infinity to allow for heat and tolerance.)

### Why a zoom goes out of focus
Suppose the sensor sits a distance $\\delta$ too far back. The lens can then be sharp only for objects at about $f^2/\\delta$ and nearer: for $\\delta = 0.05$ mm, 200 m at $f = 100$ mm but only 2 m at $f = 10$ mm. The same error is harmless at the long end and fatal at the short end.

So you set the lens for a distant object at the long end, where the error is small, and then zoom out: the picture goes soft. The blur there is

$$b = \\frac{\\delta\\,(1 - f_w^2/f_t^2)}{N}$$

for wide and tele focal lengths $f_w$ and $f_t$. The cure is the standard drill: zoom in and focus on a far target; zoom out and adjust the back focus until sharp; repeat. A **parfocal** zoom ([[varifocal-and-parfocal-lenses]]) keeps its focus through the range only if its back focus is right.

> [!key] A plain adapter has thickness F_lens − F_camera and works only when that is positive; glass in an adapter changes focal length and f-number together. A zoom that loses focus when zoomed out has a back-focus error, which grows as 1/f² towards the wide end.
`,
  ideas: [
    'A plain adapter has thickness a = F_lens − F_camera; the lens\'s mount must have the longer flange distance.',
    'A negative value means the lens would have to sit inside the camera: impossible without extra glass.',
    'A teleconverter multiplies focal length and f-number by m; a focal reducer divides both and shrinks the image circle.',
    'Back-focus adjustment sets the flange distance with shims, a threaded ring or a moving sensor.',
    'A zoom that is sharp zoomed in and soft zoomed out has a back-focus error: the error matters as 1/f².'
  ],
  pitfalls: [
    'An adapter is just a spacer, it cannot change the picture — A plain tube cannot, but it can leave the lens off-axis or tilted if poorly made, and with glass it changes focal length, f-number and quality.',
    'Any lens can be adapted to any camera — Only to a camera with a shorter flange distance. Going the other way needs glass.',
    'A teleconverter makes a lens longer and costs nothing — It multiplies the f-number too: 2× costs two stops, and it magnifies the lens\'s defects as well.',
    'A zoom out of focus at the wide end is a faulty zoom — Often the camera\'s back focus is wrong; the error shows most at the wide end, where the focal length is shortest.'
  ],
  terms: [
    { term: 'Adapter', also: ['lens adapter', 'mount adapter', 'adapter ring'], def: 'A tube with the lens\'s mount at one end and the camera\'s at the other, of a thickness that restores the lens\'s flange focal distance. Some also carry glass or electronics.' },
    { term: 'Back-focus adjustment', also: ['flange adjustment', 'back focus'], def: 'A fine adjustment of the flange-to-sensor distance, by shims, a threaded ring or a sensor mount, so that a lens reaches infinity focus and a zoom keeps its focus through its range.' },
    { term: 'Teleconverter', also: ['extender', 'tele-extender'], def: 'An optical adapter between lens and camera that multiplies the focal length by a factor m (1.4 or 2) and the f-number by the same factor.' },
    { term: 'Focal reducer', also: ['speed booster', 'reducer'], def: 'An optical adapter that divides the focal length by m (about 0.7), shrinking the image circle to fit a smaller sensor and making the lens faster by the same factor.' },
    { term: 'Shim', also: ['spacer', 'flange shim'], def: 'A thin metal ring, typically 0.05 mm or more, placed under a mount to set the flange distance precisely.' },
    { term: 'Parfocal lens', also: ['parfocal zoom'], def: 'A zoom lens that stays in focus as the focal length is changed. Its sharpness depends on a correct back focus.' }
  ],
  formulas: [
    {
      name: 'Teleconverter or reducer: the new focal length and f-number',
      expr: 'f2 = m*f1', tex: 'f_2 = m\\,f_1',
      vars: {
        f2: { name: 'focal length with the adapter', q: 'length', unit: 'mm', tex: 'f_2' },
        m: { name: 'factor of the adapter (above 1 teleconverter, below 1 reducer)', value: 2, min: 0.3, max: 4 },
        f1: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 200, tex: 'f_1' }
      },
      note: 'The f-number is multiplied by the same factor: N₂ = m·N₁.',
      stories: { f2: 'A {m} adapter is fitted to a {f1} lens. What is the focal length now?' }
    },
    {
      name: 'Image circle behind a reducer',
      expr: 'C2 = m*C1', tex: 'C_2 = m\\,C_1',
      vars: {
        C2: { name: 'image circle with the reducer', q: 'length', unit: 'mm', tex: 'C_2' },
        m: { name: 'factor of the reducer', value: 0.71, min: 0.3, max: 1.5 },
        C1: { name: 'image circle of the lens', q: 'length', unit: 'mm', value: 43.27, tex: 'C_1' }
      },
      note: 'The reduced circle must still cover the diagonal of the sensor.',
      stories: { C2: 'A {m} reducer is put behind a lens with an image circle of {C1}. How large is the circle now?' }
    },
    {
      name: 'Blur at the wide end after focusing at the tele end',
      expr: 'b = d*(1 - fw^2/ft^2)/N', tex: 'b = \\frac{\\delta\\,(1 - f_w^2/f_t^2)}{N}',
      vars: {
        b: { name: 'blur circle at the wide end', q: 'length', unit: 'µm' },
        d: { name: 'error of the sensor position (back-focus error)', q: 'length', unit: 'µm', value: 50, tex: '\\delta' },
        fw: { name: 'wide-end focal length', q: 'length', unit: 'mm', value: 8, min: 1, max: 500, tex: 'f_w' },
        ft: { name: 'tele-end focal length', q: 'length', unit: 'mm', value: 40, min: 1, max: 500, tex: 'f_t' },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 }
      },
      note: 'Parfocal zoom, set for a distant object at the tele end; the wide end is shorter than the tele end.',
      stories: { b: 'A zoom of {fw} to {ft} at f/{N} is focused at the long end with its back focus off by {d}. How large is the blur at the wide end?' }
    }
  ],
  examples: [
    {
      title: 'A full-frame lens on an APS-C camera, made faster',
      q: 'A 50 mm f/1.8 lens with a full-frame image circle (43.27 mm) is put behind a 0.71× focal reducer on a camera with an APS-C sensor (23.6 × 15.7 mm, diagonal 28.35 mm). What focal length and f-number result, and does the circle cover the sensor?',
      steps: [
        { text: 'Focal length and f-number are both multiplied by 0.71:', tex: 'f_2 = 0.71 \\times 50 = 35.5\\ \\mathrm{mm}, \\qquad N_2 = 0.71 \\times 1.8 = 1.28' },
        { text: 'The image circle:', tex: 'C_2 = 0.71 \\times 43.27 = 30.7\\ \\mathrm{mm}' }
      ],
      a: '35.5 mm at f/1.28, and the 30.7 mm circle covers the 28.35 mm diagonal. On this sensor it frames like a 54 mm lens on full frame (35.5 mm × the 1.53 crop factor), close to the 50 mm\'s own field, and gathers the light of an f/1.28 lens.'
    },
    {
      title: 'The zoom that loses focus',
      q: 'A zoom of 8 to 40 mm at f/2.8 is mounted on a camera with 3.45 µm pixels. The sensor is 50 µm too far back. It is focused on a distant object at 40 mm. How blurred is it at 8 mm?',
      steps: [
        { text: 'Take the blur formula:', tex: 'b = \\frac{\\delta\\,(1 - f_w^2/f_t^2)}{N} = \\frac{50\\ \\mu\\mathrm{m}\\,(1 - 0.04)}{2.8} = 17\\ \\mu\\mathrm{m}' },
        'In pixels that is 17/3.45, about 5 pixels.'
      ],
      a: 'A blur of 17 µm, about five pixels: clearly soft. Had the lens been focused at the wide end, the blur at 40 mm would be 25 times worse.'
    }
  ],
  quiz: [
    { q: 'Which lens-and-camera pair can be joined by a plain tube?', choices: ['A lens with the longer flange distance on a camera with the shorter', 'A lens with the shorter flange distance on a camera with the longer', 'Any pair with the same thread', 'Only pairs with the same maker'], a: 0, why: 'A plain adapter adds distance; the lens must be built for more distance than the camera provides. The other way the lens would have to sit inside the camera.' },
    { q: 'A 2× teleconverter is fitted to a 200 mm f/2.8 lens. What is the f-number of the combination?', answer: 5.6, why: 'The focal length doubles to 400 mm, and the f-number doubles with it: f/5.6, two stops darker.' },
    { q: 'A 0.71× focal reducer makes a lens about one stop faster.', a: true, why: 'It divides both the focal length and the f-number by 1.41 (1/0.71), a stop of light. It also shrinks the image circle by the same factor.' },
    { q: 'A full-frame lens (image circle 43.27 mm) is used with a 0.71× reducer. How big is the image circle, in millimetres?', answer: 30.7, unit: 'mm', why: '$0.71 \\times 43.27 = 30.7$ mm, enough for APS-C (28.35 mm diagonal) but not for full frame.' },
    { q: 'A zoom is sharp at its long end, soft when zoomed out. The most likely cause is…', choices: ['a back-focus error of the camera', 'too small an aperture', 'dust on the sensor', 'the wrong thread on the lens'], a: 0, why: 'A sensor error shifts the focus by about δ/f² in reciprocal distance: harmless at the long end and bad at the short end.' }
  ],
  applications: [
    'Putting old SLR, cine and rangefinder lenses on mirrorless cameras with tubes of 10 to 37 mm.',
    'C- and CS-mount cameras: the 5 mm ring and the fine back-focus ring that come with them.',
    'Cinema: shims behind a PL mount and a collimator test of the flange distance at the start of a shoot.',
    'Telescope photography through T-rings and teleconverters.'
  ],
  history: 'Adapters became a market of their own with mirrorless cameras from 2008, whose short flange distances can take almost any lens ever made through a tube. Focal reducers, which squeeze a larger image circle onto a smaller sensor, arrived with the small-sensor video cameras of the 2010s.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — teleconverters and focusing.',
    'W. J. Smith, *Modern Optical Engineering* — the thin-lens relations behind the longitudinal shift of focus.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the camera back, extension and focusing.'
  ],
  sim: ['lm-adapter', 'lm-back-focus']
},

/* ================================================================ the image circle */
{
  id: 'image-circle-and-sensor-coverage', parent: 'lens-mounts', title: 'The image circle and sensor coverage', level: 2,
  short: 'A lens forms its image in a circle, the sensor is a rectangle inside it. The sensor\'s diagonal must not exceed the image circle, or the corners go dark. A lens made for a bigger format covers a smaller sensor and crops it, and its spare circle allows lens shift.',
  keywords: ['image circle', 'coverage', 'sensor coverage', 'format', 'vignetting', 'dark corners', 'lens shift', 'diagonal', 'image circle diameter', 'cos4', 'relative illumination', 'lens format', 'angle of coverage'],
  prereq: ['sensor-formats-and-pixel-size', 'lens-mounts-and-flange-distance'],
  related: ['c-mount', 'cs-mount', 's-mount-m12', 'f-mount', 'vignetting', 'relative-illumination-and-shading', 'field-stop-and-field-of-view', 'crop-factor-and-equivalent-focal-length', 'projections:tilt-shift-and-view-cameras', 'binning-roi-and-area-of-interest'],
  body: `
A lens does not form a rectangular picture. Its image is a **circle** of light, bright in the middle and fading towards the edge; the sensor is a rectangle placed in it. If the rectangle sticks out of the circle the corners are dark. The mount does not say how big the circle is: the lens datasheet does.

### Two circles
The **illuminated circle** is where any light at all arrives, set by the mechanical rims of the lens. The **image circle** of the datasheet is smaller: where the image is bright and sharp enough to meet the maker's specification. It is stated as a diameter (Ø 22 mm) or as a *format* ("2/3 inch", "1.1 inch", "full frame"), meaning the circle that sensor's diagonal makes:

| Format | Sensor width × height | Diagonal = circle needed |
|---|---|---|
| 1/2" | 6.4 × 4.8 mm | 8.0 mm |
| 2/3" | 8.8 × 6.6 mm | 11.0 mm |
| 1" | 12.8 × 9.6 mm | 16.0 mm |
| 1.1" | 14.2 × 10.4 mm | 17.6 mm |
| 4/3" | 17.3 × 13.0 mm | 21.6 mm |
| APS-C | 23.6 × 15.7 mm | 28.3 mm |
| Super 35 | 24.9 × 18.7 mm | 31.1 mm |
| Full frame | 36 × 24 mm | 43.3 mm |
| 44 × 33 | 43.8 × 32.9 mm | 54.8 mm |

### Does the sensor fit?
The rule is the diagonal $D = \\sqrt{w^2 + h^2}$ of the sensor against the circle $C$ of the lens:

- **$D \\le C$**: the sensor is inside the circle. The whole picture is lit; the corners are still fainter (below).
- **$D > C$**: the corners lie outside. A 1" lens (circle 16 mm) on a 1.1" sensor (17.6 mm) loses only 2 % of the area, but darkens the corners long before; a 2/3" lens on a 1" sensor loses 27 %.
- **$D \\ll C$**: a lens for a bigger format on a smaller sensor. It works, and crops: the sensor sees only the middle of the picture, the best part of the lens, so the field is narrower than the lens's nominal one ([[crop-factor-and-equivalent-focal-length]]) and the lens is bigger and dearer than the job needs.

### Fainter at the corners, even inside
Even inside the circle the picture dims towards the edge, for two reasons: the lens's own rims cut some of the cone of light (**mechanical vignetting**), and even a perfect lens delivers less light at an angle, in proportion to the fourth power of the cosine of the field angle ($\\cos^4\\theta$, *natural vignetting*; [[vignetting]]). A simple 8 mm lens on a 1/2" sensor sees $\\theta = 26.6°$ at the corner: 64 % of the centre; a 16 mm lens on a 2/3" sensor, 80 %; a 35 mm lens on a 1" sensor, 90 %. Real lenses differ; the datasheet gives the *relative illumination*. Flat-field correction in the camera removes what is left ([[relative-illumination-and-shading]]).

### The spare circle: shift
When the circle is larger than the diagonal the lens can be moved sideways of the axis. A full-frame lens (43.3 mm) on an APS-C sensor can be shifted by 8.4 mm along the long side before the corner leaves the circle: that is what a shift lens does, to keep verticals vertical in architecture ([[projections:tilt-shift-and-view-cameras|tilt and shift]]). A lens whose circle equals the diagonal allows none.

### Line-scan and windows
A line-scan sensor's diagonal is its length: 28.7 mm for 4096 pixels of 7 µm, and the circle must cover that. Reading only a window of a large sensor ([[binning-roi-and-area-of-interest|area of interest]]) lets a smaller circle do.

> [!key] The image circle must cover the sensor's diagonal, D ≤ C. A lens for a bigger format on a smaller sensor works and crops; a smaller one gives dark corners. Even inside the circle the corners are fainter, about cos⁴ of the field angle.
`,
  ideas: [
    'The image is a circle; the sensor is a rectangle inside it, and its diagonal must not exceed the circle.',
    'The datasheet gives the circle as a diameter or as a format: the sensor whose diagonal it equals.',
    'A lens for a bigger format covers a smaller sensor and crops it; a smaller one leaves dark corners.',
    'Inside the circle the picture dims towards the corners, about cos⁴ of the field angle.',
    'A spare circle allows the lens to be shifted: s = √((C/2)² − (h/2)²) − w/2 along the width.'
  ],
  pitfalls: [
    'The mount tells me which sensors the lens covers — A C-mount lens can have an image circle of 6 mm or 18 mm. The mount fixes only the fit and the distance.',
    'If the corners are covered the picture is evenly lit — Inside the circle the light still falls by cos⁴ and by the lens\'s own rims, so the corners can be a third darker.',
    'A bigger image circle always means a better lens — It costs size and money, and the sensor uses only the middle. It is the right choice only where the extra circle is wanted: shift, a larger sensor later, or the middle\'s better sharpness.',
    'The illuminated circle and the image circle are the same — The illuminated circle, where any light arrives, is bigger than the specified one; the edge of it is dark and soft.'
  ],
  terms: [
    { term: 'Image circle', also: ['covering circle', 'coverage', 'image circle diameter'], def: 'The circle in the image plane inside which a lens meets its specification of brightness and sharpness. A sensor whose diagonal fits inside is fully covered.' },
    { term: 'Lens format', also: ['designed for format', 'optical format'], def: 'The sensor format a lens was designed to cover, written as a sensor name ("2/3 inch", "1.1 inch", "full frame"): the circle is the diagonal of that sensor.' },
    { term: 'Mechanical vignetting', def: 'Darkening of the edge of the picture because the lens\'s barrel, rims or mounts cut part of the cone of light from off-axis points.' },
    { term: 'Natural vignetting', also: ['cos⁴ law', 'cosine-fourth falloff'], def: 'The fall of brightness towards the edge of the picture, as the fourth power of the cosine of the field angle, even in a perfect lens.' },
    { term: 'Relative illumination', also: ['RI', 'relative brightness'], def: 'The brightness at a point of the image as a percentage of the brightness in the centre; the datasheet quotes it at the corner.' },
    { term: 'Shift', also: ['lens shift', 'rise'], def: 'Moving a lens sideways of the sensor so that the sensor sees a different part of the larger image circle, without tilting the camera.' }
  ],
  formulas: [
    {
      name: 'Largest sensor that fits in a circle',
      expr: 'w = C*r/sqrt(1 + r^2)', tex: 'w = \\frac{C\\,r}{\\sqrt{1 + r^2}}',
      vars: {
        w: { name: 'width of the largest sensor', q: 'length', unit: 'mm' },
        C: { name: 'image circle', q: 'length', unit: 'mm', value: 22, tex: 'C' },
        r: { name: 'aspect ratio w ÷ h (4:3 is 1.33)', value: 1.333, min: 0.1, max: 50, tex: 'r' }
      },
      note: 'The sensor\'s diagonal equals the circle. For a line sensor take a large r.',
      stories: { w: 'A lens has an image circle of {C}. How wide is the widest sensor of aspect ratio {r} that it covers?' }
    },
    {
      name: 'Largest sideways shift along the width',
      expr: 's = sqrt((C/2)^2 - (h/2)^2) - w/2', tex: 's = \\sqrt{\\left(\\tfrac{C}{2}\\right)^2 - \\left(\\tfrac{h}{2}\\right)^2} - \\tfrac{w}{2}',
      vars: {
        s: { name: 'shift before the corner leaves the circle', q: 'length', unit: 'mm', signed: true },
        C: { name: 'image circle', q: 'length', unit: 'mm', value: 43.27, min: 1, max: 200, tex: 'C' },
        h: { name: 'height of the sensor', q: 'length', unit: 'mm', value: 15.7, min: 0.1, max: 100, tex: 'h' },
        w: { name: 'width of the sensor', q: 'length', unit: 'mm', value: 23.6, min: 0.1, max: 100, tex: 'w' }
      },
      note: 'Negative means the sensor is not covered even when centred.',
      stories: { s: 'A lens covers a circle of {C}. How far can it be shifted along the long side of a sensor {w} by {h}?' }
    },
    {
      name: 'Brightness at the corner (cos⁴ law)',
      expr: 'rel = cos(atan(D/(2*f)))^4', tex: '\\mathrm{RI} = \\cos^4\\!\\left(\\arctan\\frac{D}{2f}\\right)',
      vars: {
        rel: { name: 'brightness at the corner relative to the centre', q: 'ratio', unit: '%', tex: '\\mathrm{RI}' },
        D: { name: 'diagonal of the sensor', q: 'length', unit: 'mm', value: 11, min: 1, max: 100, tex: 'D' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 16, min: 1, max: 500, tex: 'f' }
      },
      note: 'For a simple lens with no vignetting beyond the cosine law; real lenses do better or worse.',
      stories: { rel: 'A {f} lens is used on a sensor with a diagonal of {D}. By the cos⁴ law, how bright are the corners compared with the centre?' }
    }
  ],
  examples: [
    {
      title: 'A 1-inch lens on a 1.1-inch sensor',
      q: 'A lens is marked "1 inch" (circle 16 mm). It is fitted to a camera with a 1.1" sensor (14.2 × 10.4 mm). What happens?',
      steps: [
        { text: 'The sensor\'s diagonal:', tex: 'D = \\sqrt{14.2^2 + 10.4^2} = 17.6\\ \\mathrm{mm} > C = 16\\ \\mathrm{mm}' },
        'The corners lie 0.8 mm beyond the circle, at a radius of 8.8 mm against 8.0 mm. Counting the area, about 2 % of the sensor is outside the circle; but the light is already fading as the edge of the circle approaches.'
      ],
      a: 'The corners are dark, and noticeably so well before the edge: a 1" lens is not for a 1.1" sensor. The lens would be fine on a 1" sensor.'
    },
    {
      title: 'Shifting a full-frame lens on APS-C',
      q: 'A full-frame lens (circle 43.27 mm) is used on an APS-C sensor (23.6 × 15.7 mm). How far can it be shifted along the long side?',
      steps: [
        { text: 'Apply the shift formula:', tex: 's = \\sqrt{\\left(\\tfrac{43.27}{2}\\right)^2 - \\left(\\tfrac{15.7}{2}\\right)^2} - \\tfrac{23.6}{2} = 20.16 - 11.8 = 8.4\\ \\mathrm{mm}' }
      ],
      a: 'About 8.4 mm either way before a corner leaves the circle. On a full-frame sensor the same lens would have no shift at all.'
    }
  ],
  quiz: [
    { q: 'A lens marked "2/3 inch" is put on a camera with a 1" sensor. What do you expect?', choices: ['Dark corners: the circle (11 mm) is smaller than the sensor\'s diagonal (16 mm)', 'A blurred picture: the flange distance is wrong', 'A sharper picture than a 1" lens', 'Nothing unusual'], a: 0, why: 'The mount can fit and the focus can be right, but the image circle of a 2/3" lens is 11 mm and the sensor\'s diagonal 16 mm. About 27 % of the sensor lies outside the circle.' },
    { q: 'What is the diagonal of a 2/3" sensor (8.8 × 6.6 mm), in millimetres?', answer: 11, unit: 'mm', why: '$\\sqrt{8.8^2 + 6.6^2} = 11.0$ mm. A lens marked 2/3 inch has an image circle of 11 mm.' },
    { q: 'A lens made for a bigger format can be used on a smaller sensor without dark corners.', a: true, why: 'Its circle is larger than the sensor\'s diagonal, so the sensor is inside it. The picture is cropped to the middle of the lens.' },
    { q: 'By the cos⁴ law, how bright (in per cent of the centre) are the corners of a 2/3" sensor (11 mm diagonal) behind a 16 mm lens?', answer: 80, why: 'The half-field angle is $\\arctan(5.5/16) = 19.0°$ and $\\cos^4 19.0° = 0.80$.' },
    { q: 'Why can a shift lens only shift when its circle is larger than the sensor\'s diagonal?', choices: ['The sensor must stay inside the circle as the lens moves', 'The sensor would overheat', 'The flange distance changes', 'The thread would jam'], a: 0, why: 'Shifting moves the circle relative to the sensor; the spare between the circle and the sensor is the room for the move.' }
  ],
  applications: [
    'Choosing a machine-vision lens: its format must be at least that of the sensor, or the corners will be dark.',
    'Architectural photography: shift lenses, whose circle is larger than the sensor, keep verticals vertical.',
    'Using a larger-format lens on a smaller sensor for its sharper middle, or in a camera that crops.',
    'Line-scan cameras, where the circle must cover the length of the line.'
  ],
  history: 'The inch names of sensor formats come from the outside diameter of the television pick-up tubes that sensors replaced; a "1-inch" tube gave a picture about 16 mm across, the diagonal of today\'s 1" sensor. Lens makers kept the names for the image circles of their lenses.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — vignetting, the cos⁴ law and the field of a lens.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — the angle of coverage and image illumination.',
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — sensor formats and their optical sizes.'
  ],
  sim: 'lm-image-circle'
}

,

/* ================================================================ filter threads and accessories */
{
  id: 'filter-threads-and-lens-accessories', parent: 'lens-mounts', title: 'Filter threads and lens accessories', level: 1,
  short: 'The thread on the front of a lens, written M52 × 0.75, holds filters, hoods and caps. Step rings join sizes, a hood may be only so long before it cuts the picture, and industrial lenses add locking screws that keep focus and iris from drifting.',
  keywords: ['filter thread', 'M52', 'M77', 'step-up ring', 'step-down ring', 'lens hood', 'lens shade', 'lens cap', 'locking screw', 'focus lock', 'iris lock', 'thread pitch', 'filter size', 'vignetting', 'petal hood', 'UV filter'],
  prereq: ['lens-mounts-and-flange-distance', 'entrance-and-exit-pupils'],
  related: ['ghosts-flare-and-stray-light', 'vignetting', 'interference-filters', 'neutral-density-and-optical-density', 'machine-vision-lighting', 'c-mount', 'optomechanics-and-mounts', 'cleaning-and-handling-optics'],
  body: `
The front of most lenses carries a thread: not for the lens itself but for the things that go in front of it — filters, hoods, caps, close-up lenses. It is written on the lens ring as a diameter ("Ø52") or as a full thread name, **M52 × 0.75**.

### Reading the thread
M52 × 0.75 is a metric thread of nominal diameter 52 mm and pitch 0.75 mm: one turn advances a filter by 0.75 mm. A thread that engages 3 mm takes four turns to seat. The diameter is that of the thread, not of the glass, which is a few millimetres smaller. Common sizes are

| Small (compact and industrial lenses) | Medium and large (photographic lenses) |
|---|---|
| M25.5, M27, M30.5, M37, M40.5, M43, M46 mm | M49, M52, M55, M58, M62, M67, M72, M77, M82 mm |

The pitch is 0.5 mm on the smallest sizes and 0.75 mm on most larger ones. A filter fits only if the diameter *and* the pitch match, so read both.

### Step rings
A **step-up ring** has the lens's thread on one side and a larger thread on the other, so that one set of big filters (say 77 mm) serves several lenses (52, 58, 67 mm). A **step-down ring** goes the other way, and works only for narrow-angle lenses: a filter smaller than the lens's front thread cuts the cone of light and vignettes. Step rings add length, so wide lenses vignette sooner.

### Hoods
A **hood** shields the lens from light that comes from outside the field of view and would scatter inside it as flare ([[ghosts-flare-and-stray-light]]). A longer hood shields better, but it must stay out of the picture. If the pupil of diameter $D = f/N$ lies a depth $p$ behind the front of the lens, the edge of the field (half-angle $\\alpha$ at the corner) passes the mouth of a hood of length $L$ and clear diameter $d_h$ only if

$$L \\le \\frac{d_h - D}{2\\tan\\alpha} - p$$

For a 50 mm f/1.8 lens on full frame ($\\alpha = 23.4°$, $D = 27.8$ mm), a hood mouth of 62 mm and a pupil 15 mm deep, that is 24.5 mm; for a 24 mm f/2.8 ($\\alpha = 42°$, $D = 8.6$ mm) with the same mouth and a pupil 12 mm deep, 17.6 mm. Wide lenses get short hoods, long lenses long ones. Because a sensor is a rectangle, the field is narrower along the sides than at the corners, and wide-angle hoods are cut into **petals**, long at the middle of each side and short at the corners.

### Filters in front
Every filter adds two glass–air surfaces. Uncoated, each pair loses about 8 %; a coated filter loses 1 to 2 %. Three uncoated filters in a stack pass only $0.96^6 = 78\\,\\%$ and make ghosts; three coated ones, 94 %. A stack also pushes the next filter and the hood outwards, and a thick stack vignettes a wide lens. A "protective" clear filter is therefore a trade of safety against image quality. In machine vision a front filter is often a band-pass matched to a coloured LED ([[machine-vision-lighting]]).

### Caps, locks and covers
- **Caps**: a front cap that pinches or snaps on, a rear cap that protects the mount and its contacts.
- **Locking screws**: industrial lenses have two small set screws that clamp the focus ring and the iris ring once set. On a production line a vibrating machine would otherwise move them by a fraction of a turn: the depth of focus is a few micrometres.

> [!key] A filter thread is a diameter and a pitch (M52 × 0.75), and both must match. Step-up rings are safe, step-down rings can vignette; a hood may be only (d_h − f/N)/(2 tan α) − p long; every filter costs two surfaces of light and adds ghosts; industrial lenses lock focus and iris with screws.
`,
  ideas: [
    'A filter thread is a diameter and a pitch (M52 × 0.75): both must match for a filter to fit.',
    'A step-up ring fits larger filters to a smaller lens without harm; a step-down ring can vignette.',
    'A hood\'s maximum length is (d_h − f/N)/(2 tan α) − p: short for wide lenses, long for tele lenses.',
    'Each filter adds two glass–air surfaces; a coated filter loses 1 to 2 % in all, an uncoated one about 8 %.',
    'Industrial lenses lock focus and iris with screws so that vibration cannot move them.'
  ],
  pitfalls: [
    'A UV filter on every lens is free protection — Each filter adds two surfaces to the lens: some light is lost and ghosts and flare can appear. A coated filter makes the loss small, a hood protects as well.',
    'Any 52 mm filter fits a 52 mm lens — Only if the pitch also agrees. Also check the filter\'s frame: a thick frame vignettes a wide lens.',
    'A longer hood is always better — Only until it cuts the field. On a wide-angle lens a hood that is too long darkens the corners.',
    'The filter size is the diameter of the glass — It is the thread diameter. The clear glass is a few millimetres smaller.'
  ],
  terms: [
    { term: 'Filter thread', also: ['filter size', 'front thread', 'M52 × 0.75'], def: 'The thread on the front of a lens, written as a metric thread (M52 × 0.75: 52 mm diameter, 0.75 mm pitch), onto which filters, hoods and close-up lenses are screwed.' },
    { term: 'Step ring', also: ['step-up ring', 'step-down ring', 'adapter ring'], def: 'A ring with a different thread on each side that lets filters of one size be used on a lens with another. Step-up rings go to a larger thread, step-down rings to a smaller.' },
    { term: 'Lens hood', also: ['lens shade', 'sun shade', 'petal hood', 'tulip hood'], def: 'A tube or petalled ring in front of a lens that blocks stray light from outside the field of view, reducing flare and increasing contrast.' },
    { term: 'Locking screw', also: ['lock screw', 'focus lock', 'iris lock'], def: 'A small set screw on an industrial lens that clamps the focus or iris ring in place so that vibration cannot move it.' },
    { term: 'Lens cap', also: ['front cap', 'rear cap'], def: 'A cover that protects the front element or the rear mount of a lens.' }
  ],
  formulas: [
    {
      name: 'Longest hood that stays out of the picture',
      expr: 'L = (dh - f/N)/(2*tan(a)) - p', tex: 'L = \\frac{d_h - f/N}{2\\tan\\alpha} - p',
      vars: {
        L: { name: 'longest hood', q: 'length', unit: 'mm', signed: true },
        dh: { name: 'clear diameter of the hood mouth', q: 'length', unit: 'mm', value: 62, tex: 'd_h' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50, min: 1, max: 1000 },
        N: { name: 'f-number', value: 1.8, min: 0.5, max: 64 },
        a: { name: 'half-angle of the field (to the corner)', q: 'angle', unit: '°', value: 23.4, min: 1, max: 80, tex: '\\alpha' },
        p: { name: 'depth of the entrance pupil behind the front of the lens', q: 'length', unit: 'mm', value: 15, tex: 'p' }
      },
      note: 'A model: the pupil taken as a point on the axis, the field as a cone to the corners of the sensor. A petal hood can be longer at the sides.',
      stories: { L: 'A {f} lens at f/{N} sees a half-angle of {a} to the corners. Its entrance pupil is {p} behind the front, and the hood mouth is {dh} clear. How long can the hood be?' }
    },
    {
      name: 'Turns to seat a filter',
      expr: 'n = t/p', tex: 'n = \\frac{t}{p}',
      vars: {
        n: { name: 'number of turns' },
        t: { name: 'depth of thread engaged', q: 'length', unit: 'mm', value: 3 },
        p: { name: 'thread pitch', q: 'length', unit: 'mm', value: 0.75, tex: 'p' }
      },
      stories: { n: 'A filter engages {t} of thread of {p} pitch. How many turns does it take to seat?' }
    },
    {
      name: 'Light passed by a stack of filters',
      expr: 'T = (1 - R)^(2*n)', tex: 'T = (1 - R)^{2n}',
      vars: {
        T: { name: 'fraction of light passed', q: 'ratio', unit: '%' },
        R: { name: 'reflectance of each glass–air surface', q: 'ratio', unit: '%', value: 4, min: 0, max: 50 },
        n: { name: 'number of filters', value: 3, min: 1, max: 20, int: true }
      },
      note: 'Each filter has two surfaces and the stack reflects back and forth too; this is the first-order result. A coated surface is 0.5 % or less.',
      stories: { T: 'Each surface of a filter reflects {R}. How much light do {n} filters in a stack pass?' }
    }
  ],
  examples: [
    {
      title: 'A hood for a standard lens',
      q: 'A 50 mm f/1.8 lens is used on full frame (diagonal 43.27 mm). Its entrance pupil lies about 15 mm behind the front of the lens, and a hood has a clear mouth of 62 mm. How long may the hood be?',
      steps: [
        { text: 'The half-angle to the corner and the pupil diameter:', tex: '\\alpha = \\arctan\\frac{21.6}{50} = 23.4°, \\qquad D = \\frac{50}{1.8} = 27.8\\ \\mathrm{mm}' },
        { text: 'The longest hood:', tex: 'L = \\frac{62 - 27.8}{2\\tan 23.4°} - 15 = 39.5 - 15 = 24.5\\ \\mathrm{mm}' }
      ],
      a: 'About 25 mm. A longer cylindrical hood starts to cut the corners of the picture; a petal hood can be longer at the sides, where the field is narrower.'
    },
    {
      title: 'Is the protective filter free?',
      q: 'A lens has three filters stacked on its front: a UV, a polarizer and a neutral-density filter. Compare the light lost if each surface reflects 4 % (uncoated) or 1 % (coated).',
      steps: [
        { text: 'Six surfaces. Uncoated:', tex: 'T = (1 - 0.04)^6 = 0.78' },
        { text: 'Coated:', tex: 'T = (1 - 0.01)^6 = 0.94' }
      ],
      a: 'Uncoated filters pass 78 % of the light and make ghosts; coated ones pass 94 %. Every filter you do not need is a surface you do not want.'
    }
  ],
  quiz: [
    { q: 'What does M52 × 0.75 mean?', choices: ['A metric thread of 52 mm diameter and 0.75 mm pitch', 'A lens with 52 mm focal length and f/0.75', 'A thread of 52 turns per inch', 'A filter 0.75 mm thick'], a: 0, why: 'M names a metric thread: the diameter is 52 mm and the pitch 0.75 mm, the advance of a turn.' },
    { q: 'A step-down ring lets any lens use smaller filters without harm.', a: false, why: 'A filter smaller than the lens\'s front thread cuts the cone of light from the edge of the field and vignettes; it works only for narrow-angle lenses.' },
    { q: 'A filter engages 3 mm of thread of pitch 0.75 mm. How many turns does it take to seat?', answer: 4, why: '$n = t/p = 3/0.75 = 4$ turns.' },
    { q: 'Why does a wide-angle lens have a short hood?', choices: ['A long hood would cut the wide field and darken the corners', 'Wide lenses have no stray light', 'Short hoods are cheaper', 'Hoods are for tele lenses only'], a: 0, why: 'The longest hood is $(d_h - D)/(2\\tan\\alpha) - p$: a big half-angle $\\alpha$ makes it short.' },
    { q: 'Industrial lenses have locking screws on the focus and iris rings because…', choices: ['vibration would otherwise move the rings by a fraction of a turn and spoil focus', 'they are required by law', 'they make the lens waterproof', 'they hold the filters'], a: 0, why: 'A few micrometres of focus error matter on small pixels, so the rings must not creep.' }
  ],
  applications: [
    'Photography: polarizers, neutral-density and close-up filters on step rings that suit several lenses.',
    'Machine vision: a band-pass filter matched to a coloured LED, in front of the lens, to suppress ambient light.',
    'Protecting a lens in dusty or wet places with a hood, a cap and a covering tube.',
    'Production lines: lenses with locking screws on a camera that shakes with the machine.'
  ],
  history: 'Filter sizes grew up alongside cameras: each maker used a few thread diameters for its own lenses, and the step ring became the way for a photographer to use one set of filters on lenses of many sizes.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — lens hoods, filters and stray light.',
    'ISO 261 and ISO 724 — metric screw threads: diameters and pitches such as M52 × 0.75.',
    'W. J. Smith, *Modern Optical Engineering* — the field of view, the entrance pupil and vignetting.'
  ],
  sim: 'lm-hood'
},

/* ================================================================ reading a datasheet */
{
  id: 'reading-a-lens-datasheet', parent: 'lens-mounts', title: 'Reading a lens datasheet', level: 2,
  short: 'A machine-vision lens datasheet lists focal length, aperture, format, mount, closest focus, field of view, distortion, relative illumination, resolution, back focal length, filter thread and chief-ray angle. Each line has a meaning and a check against the camera and the job.',
  keywords: ['lens datasheet', 'datasheet', 'specification', 'focal length', 'aperture', 'format', 'MOD', 'minimum object distance', 'distortion', 'relative illumination', 'megapixel rating', 'lp/mm', 'back focal length', 'chief ray angle', 'CRA', 'T-stop', 'field of view', 'machine vision lens'],
  prereq: ['lens-mounts-and-flange-distance', 'image-circle-and-sensor-coverage', 'the-f-number'],
  related: ['choosing-a-machine-vision-lens', 'magnification-and-working-distance', 'field-of-view-and-focal-length', 'lens-distortion-and-calibration', 'relative-illumination-and-shading', 'nyquist-sampling-and-aliasing', 'microlenses-bsi-and-stacked-sensors', 'reading-an-optics-catalogue'],
  body: `
Each line of a lens datasheet answers one question about the job: will it fit, will it cover, will it see the right field, will it resolve the pixels? Here is a typical one for a 16 mm lens.

| Line | Typical entry | What it tells you |
|---|---|---|
| **Focal length** | 16 mm | with the sensor, the angle of view |
| **Aperture** | F1.8 – F16 | the largest and smallest f-number; some lenses lock the iris |
| **Format** | 2/3" (image circle Ø 11 mm) | the biggest sensor the lens covers |
| **Mount** | C | the thread and flange distance ([[c-mount]]) |
| **Minimum object distance** | 0.1 m | the closest object that can be focused, measured from the front of the lens |
| **Field of view** | 156 × 117 mm at 300 mm | the scene a sensor of that format sees at that distance |
| **Distortion** | −0.1 % | the bend of straight lines near the edge |
| **Relative illumination** | 80 % | the brightness at the corner against the centre |
| **Resolution** | 5 MP (3.45 µm) or 145 lp/mm | the finest pixel pitch the lens is meant to resolve |
| **Back focal length** | 11.5 mm | from the last glass to the sensor |
| **Filter thread** | M27 × 0.5 | what screws on the front |
| **Chief ray angle** | 8° | the angle at which light from the corner reaches the sensor |
| **T-stop** | T2.0 | the aperture corrected for light lost in the glass |

### Line by line
**Format and mount** are pass-or-fail. The mount decides whether the lens fits ([[lens-adapters-and-back-focus]]); the format decides whether it covers: the sensor's diagonal must not exceed the image circle ([[image-circle-and-sensor-coverage]]).

**Field of view.** With a sensor of width $w$ and an object at distance $s$ the field is $W = w\\,(s - f)/f$. The 16 mm lens on a 2/3" sensor (8.8 mm wide) sees 156 mm across at 300 mm. The datasheet's value is for one sensor and one distance: for yours, compute it.

**Minimum object distance** limits how near the object may be; at 0.1 m a 16 mm lens works at $m = f/(s - f) = 0.19$. Closer needs extension ([[close-up-and-extension-tubes]]).

**Distortion** is given in per cent at the edge, $D = (r' - r)/r$ for an ideal image height $r$ and an actual $r'$: negative is barrel (lines bulge outwards), positive pincushion. For measurement even 0.1 % matters ([[lens-distortion-and-calibration]]).

**Resolution** is quoted as a megapixel rating or in line pairs per millimetre. The two are tied through the pixel pitch $p$: a sensor samples up to $\\nu_N = 1/(2p)$, which is 145 lp/mm for 3.45 µm pixels and 208 lp/mm for 2.4 µm ([[nyquist-sampling-and-aliasing]]). "5 MP" is meaningless without the pixel size it was tested for.

**Back focal length** against the flange distance gives the recess of the rear glass: 17.526 − 11.5 = 6.0 mm here.

**Chief ray angle** (CRA) is the angle between the axis and the central ray from the corner. A sensor's microlenses are made for a range of angles ([[microlenses-bsi-and-stacked-sensors]]); a lens with a larger CRA than the sensor expects gives dark, coloured corners.

### The small print
Resolution, distortion and illumination are quoted for a certain aperture, wavelength and field position. Read the conditions before comparing two makers.

> [!key] Each line is a check: mount and format pass or fail; field of view from W = w(s − f)/f; resolution from the pixel pitch, ν = 1/(2p); distortion and illumination at the corner; chief ray angle against the sensor's microlenses. Compute the numbers for your own sensor and distance.
`,
  ideas: [
    'Every line of a datasheet answers a check: mount and format pass or fail, the rest are numbers to compute for the job.',
    'The field of view is W = w(s − f)/f for sensor width w, focal length f and distance s.',
    'Resolution in megapixels means nothing without the pixel size; the pixel samples up to 1/(2p).',
    'Distortion is a signed percentage at the edge: negative is barrel, positive is pincushion.',
    'The chief ray angle of the lens must suit the microlenses of the sensor, or the corners go dark and coloured.'
  ],
  pitfalls: [
    'A lens rated "5 MP" suits any 5-megapixel sensor — The rating holds for a pixel size: the same 5 MP on a larger sensor has bigger pixels and is easy; 5 MP on a smaller one is harder. The lp/mm and the pixel pitch tell more.',
    'The datasheet field of view is the one I will get — It is for one sensor at one distance. Compute it from your sensor width, focal length and distance.',
    'The back focal length is the flange distance — The back focal length starts at the last glass, the flange distance at the mount: their difference is the recess.',
    'Low distortion means no calibration is needed — Distortion of 0.1 % at the edge is 0.1 % of the image height there: 5.5 µm on a 2/3" sensor, about 1.6 pixels of 3.45 µm. For measurement the lens is calibrated anyway.'
  ],
  terms: [
    { term: 'Minimum object distance', also: ['MOD', 'closest focus', 'near limit'], def: 'The shortest distance at which the lens can be focused, measured from the front of the lens (or from the sensor, as the sheet states).' },
    { term: 'Chief ray angle', also: ['CRA', 'principal ray angle'], def: 'The angle between the optical axis and the central ray of the beam from a point of the image, usually quoted at the corner. It must match the angle the sensor\'s microlenses expect.' },
    { term: 'Distortion', also: ['optical distortion', 'TV distortion'], def: 'The bending of straight lines by the lens, in per cent of the image height at the edge: (r′ − r)/r. Negative is barrel, positive is pincushion.' },
    { term: 'Resolution rating', also: ['megapixel rating', '5 MP lens', 'lp/mm rating'], def: 'The sensor resolution a lens is specified to support: a number of megapixels at a stated pixel size, or line pairs per millimetre.' },
    { term: 'Relative illumination', also: ['RI'], def: 'The brightness at the edge or corner of the image as a percentage of that in the centre.' },
    { term: 'Field of view', also: ['FOV', 'FoV'], def: 'The size of the scene a sensor sees through the lens at a stated distance, as an angle or as a width and height.' }
  ],
  formulas: [
    {
      name: 'Field of view at a distance',
      expr: 'W = w*(s - f)/f', tex: 'W = \\frac{w\\,(s - f)}{f}',
      vars: {
        W: { name: 'width of the scene', q: 'length', unit: 'mm' },
        w: { name: 'width of the sensor', q: 'length', unit: 'mm', value: 8.8 },
        s: { name: 'distance from the lens to the object', q: 'length', unit: 'mm', value: 300, min: 1, max: 1e7 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 16, min: 1, max: 1000 }
      },
      note: 'Thin lens, focused on that distance.',
      stories: { W: 'A {f} lens is focused on an object {s} away, on a sensor {w} wide. How wide is the scene?', f: 'A sensor {w} wide is to see a scene {W} wide at {s}. What focal length is needed?' }
    },
    {
      name: 'What a pixel can sample (Nyquist)',
      expr: 'nu = 1/(2*p)', tex: '\\nu_N = \\frac{1}{2p}',
      vars: {
        nu: { name: 'highest spatial frequency the pixels sample', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_N' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45, tex: 'p' }
      },
      note: 'The lens should still deliver useful contrast here: see the MTF pages.',
      stories: { nu: 'A sensor has pixels {p} wide. What spatial frequency do they sample up to?' }
    },
    {
      name: 'Distortion in per cent',
      expr: 'D = (rd - ru)/ru', tex: 'D = \\frac{r_d - r_u}{r_u}',
      vars: {
        D: { name: 'distortion', q: 'ratio', unit: '%', signed: true },
        rd: { name: 'actual distance of the image point from the centre', q: 'length', unit: 'mm', value: 5.45, tex: 'r_d' },
        ru: { name: 'ideal distance of the point', q: 'length', unit: 'mm', value: 5.5, tex: 'r_u' }
      },
      note: 'Negative: barrel (the point comes closer to the centre). Positive: pincushion.',
      stories: { D: 'A point that should be {ru} from the centre of the image falls {rd} from it. What is the distortion?' }
    },
    {
      name: 'Magnification at a given distance',
      expr: 'm = f/(s - f)', tex: 'm = \\frac{f}{s - f}',
      vars: {
        m: { name: 'magnification (image ÷ object)' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 16, min: 1, max: 1000 },
        s: { name: 'distance from the lens to the object', q: 'length', unit: 'mm', value: 100, min: 1, max: 1e7 }
      },
      stories: { m: 'A {f} lens is focused on an object {s} from it. What is its magnification?' }
    }
  ],
  examples: [
    {
      title: 'Which focal length for the job?',
      q: 'A camera with a 1/1.8" sensor (7.18 mm wide) must see a part 100 mm wide from a distance of 400 mm. The catalogue has lenses of 16, 25 and 35 mm. Which should be chosen, and what field does it give?',
      steps: [
        { text: 'The focal length needed, solving the field-of-view formula:', tex: 'f = \\frac{w\\,s}{W + w} = \\frac{7.18 \\times 400}{100 + 7.18} = 26.8\\ \\mathrm{mm}' },
        { text: 'The nearest choice is 25 mm. Its field at 400 mm:', tex: 'W = \\frac{7.18\\,(400 - 25)}{25} = 107.7\\ \\mathrm{mm}' }
      ],
      a: 'The 25 mm lens, giving a field 108 mm wide: the 100 mm part fits with a margin of 8 %. Check also that the lens format is at least 1/1.8" (diagonal 8.9 mm).'
    },
    {
      title: 'Does a "5 MP" lens suit this camera?',
      q: 'A lens is rated "5 MP, 3.45 µm". It is to be used on camera A with 3.45 µm pixels and camera B with 2.4 µm pixels. What does each sensor sample up to, and how do they compare with the rating?',
      steps: [
        { text: 'Camera A:', tex: '\\nu_N = \\frac{1}{2 \\times 3.45\\ \\mu\\mathrm{m}} = 145\\ \\mathrm{lp/mm}' },
        { text: 'Camera B:', tex: '\\nu_N = \\frac{1}{2 \\times 2.4\\ \\mu\\mathrm{m}} = 208\\ \\mathrm{lp/mm}' }
      ],
      a: 'Camera A matches the rating. Camera B samples out to 208 lp/mm, 43 % finer than the lens was designed for: its pixels outrun the lens, and its picture is not much sharper than camera A\'s.'
    }
  ],
  quiz: [
    { q: 'A lens datasheet says "format 2/3 inch". What does that tell you?', choices: ['The image circle covers a sensor with a diagonal of 11 mm', 'The lens has a 2/3 inch focal length', 'The lens is 2/3 inch long', 'The aperture is f/0.67'], a: 0, why: 'The format names the sensor whose diagonal equals the image circle: a 2/3" sensor, 11 mm.' },
    { q: 'Pixels of 2.4 µm sample up to how many lp/mm?', answer: 208, unit: 'lp/mm', why: '$1/(2p) = 1/(2 \\times 0.0024\\ \\mathrm{mm}) = 208$ lp/mm.' },
    { q: 'A distortion of −2 % at the edge means…', choices: ['barrel distortion: image points at the edge are 2 % closer to the centre than ideal', 'pincushion distortion', 'a loss of 2 % of the light', 'the lens is 2 % too long'], a: 0, why: 'Negative distortion is barrel: straight lines bulge outwards and points at the edge are drawn nearer to the centre.' },
    { q: 'A lens rated "5 MP" will resolve the pixels of any 5-megapixel sensor.', a: false, why: 'The rating is for one pixel size. A 5 MP sensor with smaller pixels asks for finer lens resolution.' },
    { q: 'A lens with a chief ray angle larger than the sensor\'s microlenses expect will show…', choices: ['dark and coloured corners', 'a blurred centre', 'a different flange distance', 'no change'], a: 0, why: 'The microlenses are shifted to catch light arriving at a given angle at each position; light at another angle is lost or goes to the wrong colour.' }
  ],
  applications: [
    'Choosing a lens for an inspection station: field of view, working distance, resolution and mount are all read off the sheet.',
    'Comparing two makers: the conditions under the table (aperture, wavelength, field position) make the numbers comparable.',
    'Replacing a discontinued lens: matching format, CRA and resolution to the sensor.',
    'Checking a camera upgrade: a sensor with smaller pixels may need a lens with a higher resolution rating.'
  ],
  sources: [
    'ISO 9039:2008, *Optics and photonics — Quality evaluation of optical systems — Determination of distortion* — how the distortion figure is measured.',
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — the sensor side of the match (pixel size, response).',
    'W. J. Smith, *Modern Optical Engineering* — thin-lens image formation and the field of view.'
  ],
  sim: 'lm-datasheet'
}

);
