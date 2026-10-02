/* HYPER-PROJECTIONS · content/art-and-photography.js — the topic "Art and photography" (branch Projections at Work).
 *
 *   photography-lenses-and-projections   what a rectilinear lens projects: r = f tan θ, angle of view, perspective and the position of the lens
 *   tilt-shift-and-view-cameras          shift keeps the picture plane vertical; tilt turns the plane of focus (Scheimpflug, the hinge rule)
 *   panoramas-and-360                    stitching frames onto a cylinder or a sphere; overlap, the nodal point, the strip formats
 *   cinema-and-anamorphic-lenses         the squeeze and the desqueeze, aspect ratios, the two focal lengths of an anamorphic lens
 *   stage-sets-and-trompe-loeil          forced perspective on a raked, tapered stage; Pozzo's ceiling; the single seat
 *   street-art-anamorphosis              a drawing on the ground projected from one eye: the sweet spot, the sensitivity
 * Each page says which projection the practice relies on, why that one, the conventions, a worked case and what goes wrong.
 */
Hyper.add(
{
  id: 'photography-lenses-and-projections',
  parent: 'art-and-photography',
  title: 'Photography: what a lens projects',
  level: 1,
  short: 'A photographic lens is built to project the scene onto the sensor by central projection, so that a ray at angle θ from the axis lands at f tan θ from the centre and straight lines stay straight. The focal length sets the angle of view; the perspective depends only on where the lens stands.',
  keywords: ['rectilinear lens', 'focal length', 'angle of view', 'field of view', 'crop factor', 'perspective', 'telephoto compression', 'wide angle', 'sensor', 'full frame', 'f tan theta'],
  prereq: ['rectilinear-lens', 'field-of-view-and-focal-length', 'two-point-perspective'],
  related: ['tilt-shift-and-view-cameras', 'panoramas-and-360', 'fisheye-projections', 'camera-obscura', 'the-camera-model', 'looking-at-the-horizon'],
  body: `A camera is a box with a hole. Through the hole every point of the scene sends a ray to the sensor, and the picture is the **central projection** of the scene onto the sensor plane: Alberti's window turned back to front ([[camera-obscura]], [[central-projection]]). A photographic lens is designed so that this projection is *rectilinear*: straight lines in the world stay straight on the sensor, which demands that a ray at the angle $\\theta$ from the axis lands at the distance
$$r = f\\tan\\theta$$
from the centre ([[rectilinear-lens]]). Everything below follows from that one formula.

### Focal length and angle of view
A full-frame sensor is 36 × 24 mm. The edge of the frame, 18 mm from the centre, is seen at the angle $\\arctan(18/f)$, so the horizontal angle of view is $2\\arctan(w/2f)$: 73.7° at 24 mm, 54.4° at 35 mm, 39.6° at 50 mm, 23.9° at 85 mm, 10.3° at 200 mm and 5.2° at 400 mm. The "normal" lens has a focal length close to the diagonal of the sensor, 43 mm: it sees about 47° across the diagonal. The **crop factor** of a smaller sensor is the ratio of the diagonals, and the full-frame-equivalent focal length is $f$ times it ([[field-of-view-and-focal-length]]).

### What the focal length does not change
Every ray passes through the centre of the lens, so the relation between the sizes and shapes of things in the picture, the **perspective**, depends only on *where the lens is*. Change the focal length without moving and you only crop and enlarge the same picture: the 200 mm picture is the middle 12 % (in width) of the 24 mm picture, enlarged 8.3 times. What people call "telephoto compression" and "wide-angle distortion" is the effect of standing far away to fill the frame, or close up. A face photographed at 0.52 m with a 50 mm lens has a nose 21 % larger than the ears; at 2.08 m with a 200 mm lens (the same size on the frame) only 5 %.

### The price of a wide rectilinear picture
Away from the axis a flat picture stretches shapes. A small sphere at the angle $\\theta$ off axis is imaged as an ellipse elongated along the radius by $\\sec\\theta$ compared with its width across, 1.35 at the corner of a 24 mm frame ($\\theta = 42°$), and its area grows as $\\sec^3\\theta$. Heads at the edge of a wide group portrait are fat, and a rectilinear picture of 120° or more is hopeless: the cure is a longer lens, a smaller crop, a different projection ([[fisheye-projections]]), or several pictures stitched together ([[panoramas-and-360]]).

### Vanishing points
Lines parallel to the axis meet at the centre of the picture. Lines at 45° to the axis meet at $\\pm f$ from the centre, along the horizon: only just outside the frame for a 24 mm lens, 200 mm away for a 200 mm lens, which is why long-lens pictures of buildings look flat, with nearly parallel receding edges.

> [!note] The construction below draws the cone of view of three lenses with the protractor, finds the 45° vanishing points on the film planes, and builds the 24 mm picture of a cube with the straightedge, with the crops of 50 and 200 mm inside it. In the simulation, change the lens and walk.`,
  ideas: [
    'A rectilinear lens projects a ray at angle θ to f tan θ from the centre: a central projection onto a flat sensor in which straight lines stay straight.',
    'The angle of view is 2 arctan(w / 2f): 73.7° at 24 mm, 39.6° at 50 mm, 10.3° at 200 mm on a 36 mm wide frame.',
    'Perspective depends only on where the lens stands; changing the focal length from one spot only crops and enlarges.',
    'Towards the corners a flat picture stretches shapes by sec θ along the radius; the 45° vanishing point lies at ±f from the centre.'
  ],
  pitfalls: [
    'A telephoto lens flattens perspective — The lens only enlarges the middle of the picture. The flattening comes from standing farther away to keep the same framing; from the same place a long lens gives the same relative sizes as a wide one, merely cropped.',
    'A wide-angle lens distorts faces because it is wide — Near the centre it is exact; the stretching grows towards the edge of the frame as sec θ, and the exaggerated nose comes from standing close. Moving back and cropping gives a natural face.',
    'The focal length is the length of the lens — It is the distance from the rear nodal point to the sensor when the lens is focused at infinity; a telephoto design is shorter than its focal length, a retrofocus wide-angle longer.'
  ],
  formulas: [
    {
      name: 'Angle of view',
      expr: 'fov = 2*atan(w/(2*f))',
      tex: '\\mathrm{AOV} = 2\\arctan\\frac{w}{2f}',
      vars: { fov: { name: 'angle of view', q: 'angle', unit: '°', tex: '\\mathrm{AOV}' }, w: { name: 'width of the frame (or the height, or the diagonal)', q: 'length', unit: 'mm', value: 36 }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 } },
      note: 'Use w = 36 for the horizontal angle on a full frame, 24 for the vertical, 43.3 for the diagonal.'
    },
    {
      name: 'Width of the scene covered',
      expr: 'W = d*w/f',
      tex: 'W = \\frac{d\\,w}{f}',
      vars: { W: { name: 'width of the scene that fills the frame', q: 'length', unit: 'm' }, d: { name: 'distance to the subject', q: 'length', unit: 'm', value: 12 }, w: { name: 'width of the frame', q: 'length', unit: 'mm', value: 36 }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 144 } },
      note: 'Good when the subject is much farther than the focal length (the usual case). Solve for f to choose a lens: f = d w / W.'
    },
    {
      name: 'Stretching towards the edge',
      expr: 'S = 1/cos(theta)',
      tex: 'S = \\sec\\theta',
      vars: { S: { name: 'radial stretch relative to the tangential' }, theta: { name: 'angle off the axis', q: 'angle', unit: '°', value: 42, min: 0, max: 80, tex: '\\theta' } },
      note: 'A small circle at that angle becomes an ellipse S times longer along the radius than across it; the area is multiplied by S³.'
    }
  ],
  examples: [
    {
      title: 'Choosing the lens for a building',
      q: 'You want a cube 3 m wide, 12 m away, to fill the width of the frame of a full-frame camera. Which lens, and what angle of view does it give?',
      steps: [
        { text: 'From $W = dw/f$:', tex: 'f = \\frac{d\\,w}{W} = \\frac{12 \\times 36}{3} = 144\\ \\text{mm}' },
        { text: 'The angle of view is', tex: '2\\arctan\\frac{18}{144} = 14.3°' },
        'The nearest common lens is 135 mm (the cube is then a little smaller than the frame width) or 150 mm.'
      ],
      a: 'About 144 mm, an angle of view of 14.3°; a 135 mm or 150 mm lens does the job.'
    },
    {
      title: 'Portrait distance',
      q: 'A head 250 mm high is to fill the 24 mm height of the frame. How far away must the lens be at 50 mm and at 200 mm? The nose tip is 50 mm nearer than the middle of the head and the ears 50 mm farther: how much larger does the nose look than the ears?',
      steps: [
        { text: 'Distance from $d = f H / h$:', tex: 'd_{50} = 50 \\times \\frac{250}{24} = 521\\ \\text{mm},\\qquad d_{200} = 2083\\ \\text{mm}' },
        { text: 'The size in the picture goes as 1/distance, so the nose at $d - 50$ mm against the ears at $d + 50$ mm:', tex: '\\frac{571}{471} = 1.21,\\qquad \\frac{2133}{2033} = 1.05' }
      ],
      a: 'At 50 mm the lens must be 0.52 m away and the nose looks 21 % larger than the ears; at 200 mm it must be 2.08 m away and only 5 %.'
    }
  ],
  quiz: [
    { q: 'A 50 mm lens on a 36 × 24 mm frame has a horizontal angle of view of about', answer: 39.6, unit: '°', why: '2 arctan(18 ÷ 50) = 2 × 19.8° = 39.6°.' },
    { q: 'You stand still and change from a 35 mm to a 70 mm lens. What happens to the relative sizes of a near and a far object in the picture?', choices: ['the far object gets larger relative to the near one', 'they stay the same; the picture is cropped and enlarged', 'the far object gets smaller relative to the near one', 'the perspective flattens'], a: 1, why: 'All rays pass through the same centre, so the perspective is that of the position; the longer lens only keeps the middle part of the same picture and enlarges it twice.' },
    { q: 'A wide-angle lens has its own perspective, different from a telephoto lens\'s even when both are used at the same spot.', a: false, why: 'From the same spot the perspective is the same; only the crop differs. The differences people see come from different shooting distances.' },
    { q: 'How many times is a small circle stretched radially compared with its width at the corner of a 24 mm frame, where the angle off axis is 42°?', answer: 1.35, why: 'sec 42° = 1/cos 42° = 1.346.' },
    { q: 'The "normal" lens for a 36 × 24 mm frame is about', choices: ['24 mm, the height', '36 mm, the width', '43 mm, the diagonal', '85 mm, twice the diagonal'], a: 2, why: 'A lens whose focal length is about the sensor diagonal (43.3 mm) sees about 47° across it, close to what we take in comfortably.' }
  ],
  applications: [
    'Portraiture: the choice of a 85–135 mm lens is a choice of distance. A head 250 mm high filling the 36 mm side of the frame is shot from 0.24 m at 35 mm (the nose then looks 1.5 times the size of the ears) and from 0.94 m at 135 mm (1.12 times).',
    'Architectural and real-estate photography: a rectilinear wide-angle keeps straight edges straight, so that walls and door frames look like walls and door frames; fisheyes would curve them.',
    'Photogrammetry and forensic reconstruction: knowing the focal length (the EXIF metadata) and that the lens is rectilinear, distances and sizes can be recovered from a single picture.',
    'Smartphone cameras: a set of fixed lenses of about 13, 26 and 77 mm equivalent, each rectilinear, with software choosing the crop between them.'
  ],
  history: 'Lenses that draw straight lines straight came in 1866 with the "rapid rectilinear" of John Dallmeyer and, independently, Adolph Steinheil. Joseph Petzval\'s fast portrait lens of 1840 curved the field; Zeiss\'s Protar (1890) and Goerz\'s Hypergon (1900) pushed the angle towards 100° and more, and Ludwig Bertele\'s Biogon design of the 1930s led to the 21 mm lens that covered a 35 mm frame evenly (1954). The retrofocus design of Pierre Angénieux (1950) allowed wide-angle lenses on single-lens reflex cameras, which need space for the mirror. Nikon\'s 8 mm Fisheye-Nikkor of 1962 broke the rectilinear rule on purpose.',
  sources: ['Rudolf Kingslake, *A History of the Photographic Lens* (1989).', 'Sidney F. Ray, *Applied Photographic Optics*, the chapters on perspective and angle of view.', 'Ansel Adams, *The Camera* (1980), on lenses, focal length and perspective.', 'Martin Kemp, *The Science of Art* (1990), on the camera and the window of perspective.'],
  construction: 'ap-focal-lengths',
  sim: 'ap-focal-street'
},

{
  id: 'tilt-shift-and-view-cameras',
  parent: 'art-and-photography',
  title: 'Tilt, shift and the view camera',
  level: 2,
  short: 'A view camera moves lens and film independently. Shifting the lens parallel to the film keeps the film plane vertical, so that vertical lines stay parallel; tilting the lens turns the plane of focus about a hinge line, so that a whole slanting plane such as the ground can be sharp. Both are rules of projection geometry.',
  keywords: ['view camera', 'tilt', 'shift', 'rising front', 'Scheimpflug', 'hinge rule', 'plane of focus', 'keystone', 'architectural photography', 'image circle', 'perspective control'],
  prereq: ['three-point-perspective', 'rectilinear-lens', 'vanishing-points'],
  related: ['photography-lenses-and-projections', 'panoramas-and-360', 'camera-calibration-and-homography', 'inclined-planes', 'horizon-and-eye-level'],
  body: `A view camera lets the lens and the film move independently. Two kinds of movement do two different jobs. **Shift** (rise, fall, lateral shift) slides the lens parallel to the film. The film plane stays where it was, and so does the lens centre relative to the scene, so *nothing about the perspective changes*: the same cone of rays through the same centre simply lands on a different part of the lens's image circle. **Tilt and swing** rotate the lens plane against the film plane, and that changes the geometry of focus.

### Shift: verticals stay vertical
To take in a tall building you either point the camera up or shift the lens up. Pointed up, the film plane leans away from the façade and the vertical edges converge: they have a third vanishing point above the picture (three-point perspective, [[three-point-perspective]]). A building 25 m high, 30 m away, photographed from 1.6 m, fits a 24 mm frame if the camera is tilted up 17.5°, but the top is then drawn 21 % narrower than the foot. Keep the film plane vertical and parallel to the façade, and slide the lens (or the film) so that the building falls inside the frame, and every vertical stays parallel to the edges of the picture. The shift needed to centre the building is $s = f(H_t - 2h)/2D$: 8.7 mm for a 24 mm lens. The lens must project a larger image circle than the frame: for a 36 × 24 mm frame with a 12 mm shift the circle must be 60 mm across.

### Tilt: the plane of focus
Without tilt the plane of focus is parallel to the film: a flat sheet at one distance, so for a ground view either the foreground or the horizon is sharp, never both. **Scheimpflug's rule**: the plane of the film, the plane of the lens and the plane of sharp focus meet in one line. **Merklinger's hinge rule** says the same differently: tilt the lens by $\\theta$ and the plane of focus passes through a line parallel to the film at the distance $J = f/\\sin\\theta$ from the lens centre; focusing swings the plane about that line. To lay the plane on the ground you need $\\sin\\theta = f/J$, with $J$ the height of the lens: 5.7° for a 150 mm lens 1.5 m above the ground, 3.4° for 90 mm.

### What the tilt does not do
A tilt gives a plane of sharp focus, not "everything". The sharp zone is a wedge about that plane, hinged on the same line, and it widens with the aperture number; a tall object standing on the ground is only sharp near its foot. The method works for ground, a table-top, a wall seen obliquely. Pushed to the extreme, a strong tilt on a landscape gives the "miniature" look: a very thin wedge of sharpness.

### Digital correction
Software can warp a leaning picture back to vertical: a **homography** stretches the top ([[camera-calibration-and-homography]]). It cannot create the pixels that were not recorded, and it cannot move the plane of focus; the optical movements remain the better tool where resolution and focus matter.`,
  ideas: [
    'Shift slides the lens parallel to the film: the perspective is unchanged, the film plane stays vertical, and vertical lines stay parallel.',
    'Tilting the camera instead leans the film plane: verticals converge to a third vanishing point and the top of a building is drawn narrower than its foot.',
    'Scheimpflug: the planes of film, lens and sharp focus meet in one line; the hinge rule puts that plane through the point at J = f ÷ sin θ below the lens.',
    'Tilt gives a plane of focus, not infinite depth of field; the sharp zone is a wedge hinged on that line.'
  ],
  pitfalls: [
    'Shifting the lens changes the perspective like moving the camera — The viewpoint, the centre of the lens, is where it was before the shift, so the perspective is the same; only a different part of the image is cut out of the image circle. Moving the camera up would change the perspective.',
    'Tilt brings everything into focus — It brings a plane into focus. Everything off that plane is out of focus by an amount that grows with the distance from it; a tall object on the ground is sharp only at its foot.',
    'A tilt-shift lens is for correcting verticals only — Shift corrects convergence; tilt controls the plane of focus, a quite different matter, and the two can be used together.'
  ],
  formulas: [
    {
      name: 'Shift to centre a building',
      expr: 's = f*(Ht - 2*h)/(2*D)',
      tex: 's = \\frac{f\\,(H_t - 2h)}{2D}',
      vars: { s: { name: 'shift of the lens', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 }, Ht: { name: 'height of the top of the building', q: 'length', unit: 'm', value: 25, tex: 'H_t' }, h: { name: 'height of the lens above the ground', q: 'length', unit: 'm', value: 1.6 }, D: { name: 'distance to the building', q: 'length', unit: 'm', value: 30 } },
      note: 'The image runs from f(−h)/D below the horizon to f(Ht − h)/D above; centring means shifting by the midpoint of those. 8.7 mm here; a smaller shift of 6.7 mm just brings the top in.'
    },
    {
      name: 'Tilt for a plane of focus on the ground',
      expr: 'theta = asin(f/J)',
      tex: '\\sin\\theta = \\frac{f}{J}',
      vars: { theta: { name: 'tilt of the lens', q: 'angle', unit: '°', tex: '\\theta' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 150 }, J: { name: 'height of the lens above the plane of focus', q: 'length', unit: 'm', value: 1.5 } },
      note: 'The hinge point of the plane of focus lies J = f ÷ sin θ below the lens, so to lie on the ground it must be at the height of the lens.'
    },
    {
      name: 'Image circle needed for a shift',
      expr: 'Dc = 2*sqrt((w/2)^2 + (h/2 + s)^2)',
      tex: 'D_c = 2\\sqrt{\\left(\\frac{w}{2}\\right)^2 + \\left(\\frac{h}{2} + s\\right)^2}',
      vars: { Dc: { name: 'diameter of the image circle needed', q: 'length', unit: 'mm', tex: 'D_c' }, w: { name: 'width of the frame', q: 'length', unit: 'mm', value: 36 }, h: { name: 'height of the frame', q: 'length', unit: 'mm', value: 24 }, s: { name: 'shift', q: 'length', unit: 'mm', value: 12 } },
      note: 'The farthest corner of the shifted frame sets the circle. Without shift it is the diagonal, 43.3 mm.'
    }
  ],
  examples: [
    {
      title: 'A tower from the ground',
      q: 'A building 25 m high stands 30 m away. A 24 mm lens is 1.6 m above the ground. What shift keeps the verticals parallel? How would a tilted camera compare?',
      steps: [
        { text: 'The image of the top is $24 \\times 23.4/30 = 18.7$ mm above the axis, that of the foot $24 \\times 1.6/30 = 1.3$ mm below. To centre it:', tex: 's = \\frac{24\\,(25 - 3.2)}{2 \\times 30} = 8.7\\ \\text{mm}' },
        'The image circle of the lens must reach a corner of the shifted frame, at 18 mm sideways and 12 + 8.7 = 20.7 mm up, i.e. 27.5 mm from the axis: a 55 mm circle (a 24 mm shift lens projects about 67 mm).',
        'Tilted up 17.5° instead, the film plane makes 17.5° with the façade. The distance along the new axis is 142.5 to the top and 112.5 to the foot, so the top of the building is drawn $112.5/142.5 = 0.79$ times as wide as its foot.'
      ],
      a: 'A shift of 8.7 mm keeps the verticals parallel; tilting the camera instead leaves the top 21 % narrower than the base.'
    },
    {
      title: 'Putting the ground in focus',
      q: 'A 90 mm lens is 1.5 m above the ground on a view camera. What tilt, and where is the hinge line?',
      steps: [
        { text: 'The hinge must lie on the ground, so', tex: '\\sin\\theta = \\frac{0.09}{1.5} = 0.06 \\;\\Rightarrow\\; \\theta = 3.4°' },
        'The hinge line is on the ground below the lens, 1.5 m down; the film plane sits at $f/\\cos\\theta = 90.2$ mm from the lens when focused to put the plane of focus exactly on the ground.'
      ],
      a: 'A tilt of 3.4°, with the hinge on the ground directly below the lens.'
    }
  ],
  quiz: [
    { q: 'Shifting the lens up by 8 mm, with the film plane kept vertical, changes the perspective of the picture.', a: false, why: 'The centre of the lens, which fixes the perspective, does not move relative to the scene; the picture is a different cut out of the same image.' },
    { q: 'What tilt in degrees puts the plane of focus on the ground for a 150 mm lens 1.5 m above it?', answer: 5.74, unit: '°', why: 'sin θ = f ÷ J = 0.15 ÷ 1.5 = 0.1, θ = 5.74°.' },
    { q: 'Scheimpflug\'s rule says that the plane of the film, the plane of the lens and the plane of sharp focus', choices: ['are parallel', 'meet in one line', 'are perpendicular to the axis', 'coincide'], a: 1, why: 'The three planes meet in a common line (a point in a side view); the construction in this page finds that point.' },
    { q: 'For a 36 × 24 mm frame and a shift of 12 mm, how large in millimetres must the image circle of the lens be?', answer: 60, unit: 'mm', why: '2 √(18² + (12 + 12)²) = 2 × 30 = 60 mm.' },
    { q: 'To keep the vertical lines of a tall building parallel in the photograph, the film plane must be', choices: ['perpendicular to the ground and parallel to the façade', 'tilted back until the whole building is in', 'perpendicular to the optical axis, whatever that is', 'parallel to the ground'], a: 0, why: 'Vertical lines are parallel on the film when the film plane is parallel to them, that is, vertical; the shift brings the building into the frame.' }
  ],
  applications: [
    'Architecture and interiors: shifted wide-angle lenses (24 mm shift lenses, view-camera rising fronts) keep walls and door frames parallel without the stretching that digital correction needs.',
    'Landscape and product photography: tilt puts a table-top or a field of flowers entirely in focus at a wide aperture, from the nearest petal to the horizon.',
    'Machine vision: cameras viewing a conveyor at an angle carry a tilted lens mount (a Scheimpflug mount) so that the whole belt is sharp, for barcode and inspection systems.',
    'Medicine: the Scheimpflug camera images the front of the eye in a plane that includes the optical axis, and measures the cornea and lens thickness.'
  ],
  history: 'Jules Carpentier described the tilting rule in 1901, and the Austrian naval officer Theodor Scheimpflug, who wanted to correct oblique aerial photographs by tilting the plate, patented his version in 1904. The practical hinge rule was published by Harold Merklinger in his *Focusing the View Camera* (1993). Shift lenses for 35 mm cameras began with the Nikon PC-Nikkor 35 mm of 1961, and combined tilt-and-shift lenses (the Canon TS-E series, from 1991) put both movements on a small camera.',
  sources: ['Leslie Stroebel, *View Camera Technique* (7th ed., 1999), on the movements.', 'Harold M. Merklinger, *Focusing the View Camera* (1996; available online), the hinge rule and depth of field with tilt.', 'Rudolf Kingslake, *Optics in Photography*; Sidney Ray, *Applied Photographic Optics*, on the Scheimpflug condition.', 'Martin Kemp, *The Science of Art*, on vertical convergence and the picture plane.'],
  construction: ['ap-shift-verticals', 'ap-scheimpflug'],
  sim: 'ap-plane-of-focus'
},

{
  id: 'panoramas-and-360',
  parent: 'art-and-photography',
  title: 'Panoramas and 360° imaging',
  level: 2,
  short: 'A flat picture cannot hold much more than 100° across, so wide views are built from many frames turned about the lens and joined on a cylinder or a sphere: verticals stay vertical, the horizon stays straight, every other line curves, and the overlap and the nodal point decide whether the seams hold.',
  keywords: ['panorama', 'stitching', 'cylindrical projection', 'equirectangular', '360', 'nodal point', 'parallax', 'overlap', 'cube map', 'pano head', 'swing lens', 'homography'],
  prereq: ['cylindrical-panoramas', 'equirectangular-images', 'rectilinear-lens'],
  related: ['four-point-perspective', 'fisheye-projections', 'cube-maps', 'photography-lenses-and-projections', 'camera-calibration-and-homography', 'augmented-and-virtual-reality', 'the-all-sky-view'],
  body: `A flat rectilinear picture cannot hold much more than 100° across: at 120° the edge of the frame is already stretched without mercy, and at 180° the sensor would have to be infinitely wide ([[wide-angle-and-the-limits-of-the-plane]]). Anyone who wants more has two choices: take several pictures and join them, or project the scene onto a surface that can hold the whole turn. Both put the world on a **cylinder** or a **sphere** and unroll it.

### Frames onto a cylinder
Turn the camera about a vertical axis through the lens's **nodal (no-parallax) point** and take frames 30° to 50° apart. Each frame is a rectilinear picture on its own flat film plane. Put a cylinder of radius $f$ about the lens and carry each point of each frame along its sight line to the cylinder: a point at $x$ on the film goes to the azimuth $\\arctan(x/f)$ from that frame's axis, and when the cylinder is unrolled the horizontal position is $f$ times the azimuth in radians ([[cylindrical-panoramas]]). In the result **verticals stay vertical, the horizon stays straight, and every other horizontal line becomes a cosine curve**, $y = fH\\cos(a - a_0)/D$ for the top of a straight wall of height $H$ at perpendicular distance $D$: the four vanishing points of [[four-point-perspective]].

### The whole sphere
For the full sphere the standard format is the **equirectangular** image: azimuth along $x$, elevation along $y$, twice as wide as high ([[equirectangular-images]]). The top and bottom rows are single points spread across the full width. The same data may be cut into a **cube map** ([[cube-maps]]), six rectilinear faces of 90° each, for a game engine or a headset.

### How many frames
Adjacent frames must overlap by 25–30 % so that the program can match features and put the seam where they agree. With the horizontal angle of view $\\alpha$ and the turn $\\Delta$ between frames the overlap is $o = 1 - \\Delta/\\alpha$, and a full turn needs $n = 360°/\\big(\\alpha(1 - o)\\big)$ frames, rounded up. A 24 mm lens (73.7° across) needs 7, a 35 mm lens (54.4°) 10. Resolution grows with the lens: with 6 µm pixels a 35 mm lens gives $35/0.006 \\times \\pi/180 = 102$ pixels per degree, a strip of 36 650 pixels all round.

### What can go wrong
**Parallax**: if the camera turns about the tripod screw instead of the nodal point, near objects shift against far ones between frames and the seams tear. Moving subjects at a seam are doubled or cut; exposure and white balance drift between frames; the sky and the ground need extra shots to complete the sphere. Alternatively a **swing-lens** or rotating-slit camera (Cirkut, Widelux, Noblex) makes the cylindrical projection directly on a moving film.

> [!note] The construction below takes four rectilinear frames 30° apart, swings them onto a cylinder with the compass and unrolls it with the dividers; the simulation shows overlap, seams and both strip formats.`,
  ideas: [
    'A rectilinear picture cannot hold more than about 100°; a panorama joins frames by carrying them onto a cylinder or sphere about the lens and unrolling it.',
    'In a cylindrical panorama verticals and the horizon stay straight; other horizontals become cosine curves; the strip is f × azimuth wide.',
    'Frames need 25–30 % overlap and must be turned about the nodal point, or parallax will tear the seams.',
    'The equirectangular image is the sphere unrolled (azimuth × elevation, 2 : 1); cube maps cut it into six rectilinear faces.'
  ],
  pitfalls: [
    'A panorama is just a very wide-angle picture — It is a different projection. A rectilinear wide-angle keeps straight lines straight and stretches the corners; a cylindrical panorama keeps verticals straight and spreads the angle evenly, at the cost of curving horizontals.',
    'The camera can turn about the tripod screw — The point that must stay fixed is the lens\'s entrance pupil (the nodal point). About the screw, near objects move against far ones between frames (parallax) and no software can make them join.',
    'Every straight line must stay straight — Only vertical lines and the horizon do. Lines such as the top of a wall bow, and bow more the wider the field; that is the nature of the projection, not an error of stitching.'
  ],
  formulas: [
    {
      name: 'Overlap of neighbouring frames',
      expr: 'ov = 1 - step/fov',
      tex: 'o = 1 - \\frac{\\Delta}{\\alpha}',
      vars: { ov: { name: 'overlap', q: 'ratio', unit: '%', tex: 'o' }, step: { name: 'turn between frames', q: 'angle', unit: '°', value: 36, tex: '\\Delta' }, fov: { name: 'horizontal angle of view of a frame', q: 'angle', unit: '°', value: 54.4, tex: '\\alpha' } },
      note: '25–30 % is the usual minimum for automatic matching; with less, the program has too few common features.'
    },
    {
      name: 'Frames for a full turn',
      expr: 'n = 2*pi/(fov*(1 - ov))',
      tex: 'n = \\frac{360°}{\\alpha\\,(1 - o)}',
      vars: { n: { name: 'number of frames (round up)' }, fov: { name: 'horizontal angle of view of a frame', q: 'angle', unit: '°', value: 54.4, tex: '\\alpha' }, ov: { name: 'overlap wanted', q: 'ratio', unit: '%', value: 30, min: 0, max: 80, tex: 'o' } },
      note: 'For 54.4° and 30 % this is 9.45 frames, so 10; the turn is then 36° and the overlap 34 %.'
    },
    {
      name: 'Width of a cylindrical strip',
      expr: 'Wp = f*A',
      tex: 'W = f\\,A',
      vars: { Wp: { name: 'width of the strip', q: 'length', unit: 'mm', tex: 'W' }, f: { name: 'radius of the cylinder (the focal length)', q: 'length', unit: 'mm', value: 35 }, A: { name: 'angle covered', q: 'angle', unit: '°', value: 360 } },
      note: 'The angle is taken in radians: a full turn at f = 35 mm is 219.9 mm of film, or 36 650 pixels at 6 µm.'
    }
  ],
  examples: [
    {
      title: 'How many frames for the full turn?',
      q: 'You want a 360° panorama with an overlap of at least 30 % between frames. Landscape frames (36 mm across) with a 24 mm lens and with a 35 mm lens: how many frames?',
      steps: [
        { text: '24 mm: the angle across is 2 arctan(18/24) = 73.7°, so each step may be at most', tex: '\\Delta = 73.7° \\times 0.7 = 51.6° \\;\\Rightarrow\\; n = \\frac{360}{51.6} = 6.98 \\to 7' },
        { text: '35 mm: 54.4°, so', tex: '\\Delta = 54.4° \\times 0.7 = 38.1° \\;\\Rightarrow\\; n = \\frac{360}{38.1} = 9.45 \\to 10' },
        'With 7 frames the turn is 51.4° and the overlap 30.2 %; with 10 frames 36° and 33.8 %. Add a frame up and one down for the zenith and nadir.'
      ],
      a: '7 frames with the 24 mm lens, 10 with the 35 mm lens (a ring of landscape frames).'
    },
    {
      title: 'Pixels all the way round',
      q: 'The sensor is 6000 px across 36 mm. How many pixels per degree does a 35 mm lens give, and how wide is a 360° strip?',
      steps: [
        'Pixel pitch: 36 mm ÷ 6000 = 6 µm.',
        { text: 'Angle per pixel and pixels per degree:', tex: '\\frac{0.006}{35} = 1.71\\times 10^{-4}\\ \\text{rad} = 0.0098°,\\qquad 102\\ \\text{px/°}' },
        'Around the circle: 360 × 101.8 = 36 650 pixels (a 36 650 × 18 300 px sphere, 670 megapixels, when the height is added).'
      ],
      a: '102 pixels per degree; a 360° strip 36 650 pixels wide.'
    }
  ],
  quiz: [
    { q: 'Frames of 54.4° angle of view are taken every 36°. What is the overlap, in per cent (give the number only)?', answer: 33.8, why: 'o = 1 − 36 ÷ 54.4 = 0.338.' },
    { q: 'In a cylindrical panorama every straight line of the scene remains straight.', a: false, why: 'Only vertical lines and the horizon do; the top of a wall, for instance, becomes a cosine-shaped curve.' },
    { q: 'Why must the camera turn about the nodal point?', choices: ['to keep the horizon level', 'so that near and far objects do not shift against each other between frames', 'to avoid vignetting', 'so that every frame has the same exposure'], a: 1, why: 'Rays through the nodal point are the only ones that keep their directions when the camera turns about it; elsewhere parallax separates near and far.' },
    { q: 'How long in millimetres is a cylindrical strip for a full turn at f = 35 mm?', answer: 219.9, unit: 'mm', why: 'f × 2π = 35 × 6.283 = 219.9 mm.' },
    { q: 'The equirectangular image of the whole sphere has the proportions', choices: ['1 : 1', '2 : 1', '4 : 3', '16 : 9'], a: 1, why: 'Longitude spans 360° along the width and latitude 180° along the height, at the same scale: twice as wide as high.' }
  ],
  applications: [
    'Landscape and architecture: a ring of frames stitched into a strip with the resolution of dozens of megapixels, and the horizon and the verticals true.',
    'Virtual tours and street-level mapping: a 360° camera records equirectangular images that a viewer re-projects as a rectilinear window anywhere on the sphere.',
    'Visual effects: an equirectangular high-dynamic-range picture of a set is wrapped round a CG scene to light it (image-based lighting), because it records the light from every direction.',
    'Astronomy: all-sky and Milky Way mosaics are cylindrical or equirectangular strips in celestial coordinates, from frames taken with a tracking mount.'
  ],
  history: 'Robert Barker patented the "panorama" in Edinburgh in 1787 and showed a view of London on a cylinder in the Rotunda in Leicester Square from 1793: a painting on the inside of a cylinder seen from the centre. Photographic panoramas followed: Joseph Puchberger\'s swing-lens daguerreotype camera of 1843 covered about 150°, the Cirkut camera (1904, later made by Kodak) rotated with a moving film, and Widelux (1959) and Noblex swing-lens cameras brought the cylindrical picture to the hand-held camera. Computer stitching of frames on a cylinder or sphere became general in the 1990s with Apple\'s QuickTime VR and its successors.',
  sources: ['Richard Szeliski, *Computer Vision: Algorithms and Applications*, the chapter on image stitching and panoramas.', 'Stephan Oettermann, *The Panorama: History of a Mass Medium* (1997), on Barker\'s Rotunda.', 'John Snyder, *Flattening the Earth* (1993), for the cylindrical and equirectangular mappings of the sphere.'],
  construction: 'ap-panorama-stitch',
  sim: 'ap-stitching'
},

{
  id: 'cinema-and-anamorphic-lenses',
  parent: 'art-and-photography',
  title: 'Cinema and anamorphic lenses',
  level: 2,
  short: 'A frame of 35 mm film has a fixed height, so a wide screen is obtained either by cropping it or by squeezing the picture horizontally in the camera and stretching it back in the projector. The anamorphic lens is a rectilinear lens with two focal lengths, f across and f/s along the width.',
  keywords: ['anamorphic', 'CinemaScope', 'squeeze', 'desqueeze', 'aspect ratio', '2.39:1', 'widescreen', 'Hypergonar', 'Panavision', 'anamorphic widescreen', 'pixel aspect ratio'],
  prereq: ['rectilinear-lens', 'anamorphosis', 'field-of-view-and-focal-length'],
  related: ['anamorphosis', 'mirror-anamorphosis', 'photography-lenses-and-projections', 'street-art-anamorphosis', 'equirectangular-images'],
  body: `A frame of 35 mm film is only about 18.7 mm tall, because the four perforations of the film pitch fix the height of the picture. To fill a wide screen you can **crop**: the 1.85 : 1 "flat" picture throws away the top and bottom of the negative. Or you can **squeeze**: compress the picture horizontally by a factor $s$ in the camera, so that a wide scene fits an almost square frame, and stretch it back by the same factor in the projector. The lens that does it is **anamorphic**, and the first successful system, CinemaScope (1953), had a squeeze of 2.

### A rectilinear picture with two focal lengths
An anamorphic lens combines spherical and cylindrical elements. It remains a central projection in which straight lines stay straight, but its scale along the width is $s$ times smaller than along the height: a ray at the horizontal angle $\\theta_x$ and the vertical angle $\\theta_y$ lands at
$$x' = \\frac{f}{s}\\tan\\theta_x,\\qquad y' = f\\tan\\theta_y.$$
Across the frame it acts as a lens of focal length $f/s$, up and down as one of $f$. For a film width $w$ the horizontal angle of view is $2\\arctan(s\\,w/2f)$: a squeeze of 2 doubles the width seen. A "50 mm" 2× lens on a gate 21.95 × 18.6 mm sees 47.4° across and 21.1° up: the width of a 25 mm spherical lens and the height of a 50 mm.

### The desqueeze
The 2.39 : 1 picture is recorded in a gate of about 1.2 : 1, since $2.39/2 = 1.195$, and projected through a lens with the inverse squeeze. Every circle in the scene is an ellipse twice as tall as wide on the film, and returns to a circle on the screen (the construction below). If the squeeze is not undone, everybody looks tall and thin; if it is undone twice, too wide.

### Why go to the trouble?
Squeezing uses the whole height of the negative. A 2.39 : 1 picture occupies 21.9 × 18.6 mm of film (about 407 mm²) against 24.9 × 10.4 mm (259 mm²) when the same shape is cropped from a spherical image: 58 % more area, finer grain, and a brighter, sharper projected picture. Digital cameras reuse the idea: a 1.33× adapter lets a 16 : 9 sensor record 2.39 : 1 using every pixel, and a 4 : 3 sensor with a 1.33× lens gives a full 16 : 9 frame.

### When it goes wrong
The wrong factor in post-production (1.33 applied to a 2× lens) leaves everybody off-proportion. Software that does not read the *pixel aspect ratio* shows the squeezed picture raw. DVDs of "anamorphic widescreen" store a 16 : 9 picture squeezed into a 4 : 3 pixel grid and flag it, which is the same idea applied to digital storage.

> [!note] Anamorphosis in painting, the stretched picture that is right from one viewpoint ([[anamorphosis]]), is a projection onto a surface; the cinema's squeeze is a change of aspect that is undone at the screen. Both are affine or projective maps with an inverse.`,
  ideas: [
    'Film frame height is fixed by the perforations, so a wide screen comes from cropping or from squeezing the picture horizontally and stretching it back at the projector.',
    'An anamorphic lens is rectilinear with two focal lengths: f up and down, f/s across; the horizontal angle of view is multiplied by s.',
    'A circle on the screen is a 2:1 ellipse on the film; the desqueeze must match the squeeze or everything is too thin or too wide.',
    'Squeezing uses the whole negative height, giving more film area, and in digital cameras more of the sensor.'
  ],
  pitfalls: [
    'An anamorphic lens curves straight lines — It is a rectilinear system: straight lines stay straight. What it changes is the aspect: the scale across the frame differs from the scale up and down.',
    'A 50 mm anamorphic lens has the angle of view of a 50 mm lens — Vertically yes, horizontally it sees what a 25 mm spherical lens would (for a squeeze of 2). It is named for its focal length along the height.',
    'The 2× squeeze gives 2.39 : 1 from a 2.39 : 1 gate — The gate is about 1.2 : 1 (21.95 × 18.6 mm, or 2.39 ÷ 2), and the projection doubles its width.'
  ],
  formulas: [
    {
      name: 'Aspect ratio on the screen',
      expr: 'A = a*s',
      tex: 'A = a\\,s',
      vars: { A: { name: 'aspect ratio of the projected picture (width ÷ height)' }, a: { name: 'aspect ratio of the film frame', value: 1.195 }, s: { name: 'squeeze factor', value: 2 } },
      note: '1.195 × 2 = 2.39. A 4:3 sensor (1.333) with a 1.33× adapter gives 1.78, i.e. 16:9; with 2× it gives 2.67.'
    },
    {
      name: 'Horizontal angle of view',
      expr: 'fov = 2*atan(s*w/(2*f))',
      tex: '\\mathrm{AOV}_h = 2\\arctan\\frac{s\\,w}{2f}',
      vars: { fov: { name: 'horizontal angle of view', q: 'angle', unit: '°', tex: '\\mathrm{AOV}_h' }, s: { name: 'squeeze factor', value: 2 }, w: { name: 'width of the film gate', q: 'length', unit: 'mm', value: 21.95 }, f: { name: 'focal length (the one that governs the vertical field)', q: 'length', unit: 'mm', value: 50 } },
      note: 'The vertical angle of view is the ordinary 2 arctan(h / 2f).'
    },
    {
      name: 'Horizontal equivalent focal length',
      expr: 'fx = f/s',
      tex: 'f_x = \\frac{f}{s}',
      vars: { fx: { name: 'focal length across the frame', q: 'length', unit: 'mm', tex: 'f_x' }, f: { name: 'marked focal length', q: 'length', unit: 'mm', value: 50 }, s: { name: 'squeeze factor', value: 2 } },
      note: 'A 40 mm 2× anamorphic gives the horizontal field of a 20 mm spherical lens and the vertical field of a 40.'
    }
  ],
  examples: [
    {
      title: 'The 50 mm anamorphic',
      q: 'A 50 mm lens with a 2× squeeze is used on a 21.95 × 18.6 mm gate. What angles of view does it give? Compare with a 50 mm spherical lens on the same gate.',
      steps: [
        { text: 'Anamorphic, horizontal:', tex: '2\\arctan\\frac{2 \\times 21.95}{2 \\times 50} = 47.4°' },
        { text: 'Vertical (the same as the spherical lens):', tex: '2\\arctan\\frac{18.6}{2 \\times 50} = 21.1°' },
        { text: 'The spherical 50 mm sees', tex: '2\\arctan\\frac{21.95}{100} = 24.8°\\ \\text{across}' }
      ],
      a: '47.4° × 21.1°, against 24.8° × 21.1° for the spherical lens: twice the width seen.'
    },
    {
      title: 'Squeezing a 16:9 sensor',
      q: 'A camera has a 16 : 9 sensor. Which squeeze fills the whole sensor with a 2.39 : 1 picture, and what is the film-gate equivalent?',
      steps: [
        { text: 'Needed:', tex: 's = \\frac{2.39}{16/9} = 1.34' },
        'This is the 1.33× adapter lens sold for the purpose; the recorded picture is 16 : 9 and is stretched to 2.39 : 1 in post-production, using all 1080 lines of the sensor instead of cropping to the 803 lines of a 2.39 : 1 strip.'
      ],
      a: 'A 1.33× squeeze; all 1080 sensor lines are used, against 803 for a crop.'
    }
  ],
  quiz: [
    { q: 'A 2.39 : 1 picture is shot with a 2× anamorphic lens. What is the aspect ratio of the film gate?', answer: 1.195, why: '2.39 ÷ 2 = 1.195, close to 1.2 : 1.' },
    { q: 'If the squeeze of the camera lens is 2 but the projector desqueezes by 1.33, circles on the screen look', choices: ['perfectly round', 'wider than they should be', 'taller and thinner than they should be', 'the same as in a flat picture'], a: 2, why: 'The picture is stretched by 1.33 instead of 2, so it is 0.67 as wide as it should be: everything looks thin.' },
    { q: 'An anamorphic lens makes straight lines bow.', a: false, why: 'It is a rectilinear system: lines remain straight. Only the ratio of the horizontal to the vertical scale differs from 1.' },
    { q: 'What horizontal angle of view in degrees does a 50 mm 2× anamorphic lens give on a gate 21.95 mm wide?', answer: 47.4, unit: '°', why: '2 arctan(2 × 21.95 ÷ 100) = 2 arctan 0.439 = 47.4°.' },
    { q: 'A 40 mm lens with a 2× squeeze has a horizontal field like that of a spherical lens of', choices: ['20 mm', '40 mm', '80 mm', '10 mm'], a: 0, why: 'f/s = 20 mm across the frame; the vertical field is that of 40 mm.' }
  ],
  applications: [
    'Feature films in 2.39 : 1 (from the Scope formats of the 1950s to the digital anamorphic lenses of today): a wide picture on a nearly square gate, using the film or the sensor to the full.',
    '"Anamorphic widescreen" in video: a 16 : 9 picture stored in a 4 : 3 pixel grid with a flag that tells the player to stretch it.',
    'Smartphone and action-camera video with anamorphic adapters, filming 2.39 : 1 on a 16 : 9 sensor with no loss in vertical resolution.',
    'Large-format film such as Ultra Panavision 70 (1.25× squeeze, 2.76 : 1) in the 1950s–60s, and its revival for modern films shot on 65 mm.'
  ],
  history: 'Henri Chrétien, a French astronomer, designed the Hypergonar anamorphic attachment in 1926; it was used by Claude Autant-Lara for his short *Construire un feu* (1928–30) and then forgotten for twenty years. Twentieth Century-Fox bought the rights in 1952 and released *The Robe* (1953) as the first CinemaScope feature, at 2.55 : 1 with magnetic sound; the ratio settled at 2.35 and later 2.39 : 1 when the optical track and splices were redefined in the 1970s. Panavision lenses (1950s) became the industry standard, and the 65 mm system with a 1.25× squeeze (MGM Camera 65, later Ultra Panavision 70) shot *Ben-Hur* (1959).',
  sources: ['John Belton, *Widescreen Cinema* (1992), on CinemaScope and its competitors.', 'Rudolf Kingslake, *Optics in Photography* (1992), the section on anamorphic systems.', 'SMPTE standards for 35 mm projection apertures (the 2.39 : 1 anamorphic aperture).'],
  construction: 'ap-anamorphic-squeeze',
  sim: 'ap-desqueeze'
},

{
  id: 'stage-sets-and-trompe-loeil',
  parent: 'art-and-photography',
  title: 'Stage sets, murals and trompe-l\'œil',
  level: 2,
  short: 'A stage is seen through a frame from a few seats, so a set can be a picture built in space: walls that narrow, a floor that rises and a ceiling that sinks all aim at one real point, and the eye reads a short stage as a long street; painted architecture on a ceiling does the same from a marked spot on the floor.',
  keywords: ['forced perspective', 'stage design', 'raked stage', 'Teatro Olimpico', 'Pozzo', 'trompe-l\'œil', 'quadratura', 'false vanishing point', 'scenery', 'Palazzo Spada', 'set design'],
  prereq: ['forced-perspective', 'one-point-perspective', 'anamorphosis'],
  related: ['street-art-anamorphosis', 'reverse-perspective', 'perspective-in-painting', 'plan-and-elevation-method', 'alberti-window'],
  body: `A theatre audience looks through a frame, the proscenium, at a stage from one side: Alberti's window ([[alberti-window]]) with the audience on the near side. The designer therefore knows where the eye is, or nearly, and can build a world that looks right from there and only from there. The set is not a place but a picture drawn in space. Renaissance designers found the rules at the same time as linear perspective.

### Forced perspective
In a real street the receding lines converge in the picture. Build the set so that the lines **really** converge: walls narrowing, a floor rising, a ceiling falling, all aimed at a point behind the back wall, and the eye cannot tell 8 m of depth from 42 m. At a depth $t$ behind the opening everything is scaled by $s(t) = 1 - t/L$, where $L$ is the distance of the real apex behind the opening. Seen from a seat $D$ in front of the opening, a flat at depth $t$ looks as far away as
$$z' = \\frac{D + t}{s(t)}.$$
For the stage of the construction ($D = 8$ m, depth 8 m, back wall 3/8 of the front, so $s = 0.375$ and $L = 12.8$ m) the back looks 42.7 m away. The floor must rise by $h(1 - s)$ at the back, 0.94 m for an eye height $h$ of 1.5 m, and the ceiling falls to $h + (H - h)s$.

### The rake and the single seat
A raked stage serves twice: it shows the actors higher up the picture as they walk upstage, and it points the floor lines at the same false vanishing point as the walls. Palladio began the Teatro Olimpico at Vicenza in 1580 and Scamozzi finished it in 1585 with seven streets behind the proscenium that rise and narrow, so that streets a few metres deep read as streets of 100 m. The picture is exact from the seat of honour, and falls apart from the sides.

### The actors give the trick away
Anything real placed in the forced zone shows the scale: an actor at the back of our set is $1/s = 2.7$ times too large for his apparent distance. Scamozzi filled the far streets with small figures; modern film sets use children, or place actors at different distances from the camera so that they appear equal in height.

### Painted architecture
On a flat or vaulted ceiling the painter does the same thing in reverse. Andrea Pozzo's nave ceiling in Sant'Ignazio in Rome (1685–94) continues the real columns and cornices upward in paint, and a disc in the floor marks the spot from which the painted columns seem to stand vertically and the roof to open onto the sky. Step off it and the columns lean, because the picture is a projection from that point onto the vault ([[anamorphosis]]). Borromini's colonnade in the Palazzo Spada in Rome (1653) reaches about 9 m but looks several times longer.

> [!tip] Both the stage and Pozzo's ceiling are the same geometry as street painting ([[street-art-anamorphosis]]): fix the eye, then place every point of the real surface where the sight line to the imagined point meets it.`,
  ideas: [
    'A set is a picture in space: with walls, floor and ceiling converging on one real point the eye reads a short stage as a long street.',
    'A flat at depth t has scale s(t) = 1 − t/L and looks (D + t)/s(t) away from a seat D in front of the opening.',
    'The illusion holds for one seat (or a small zone); from the side the converging set falls apart.',
    'Real things in the forced zone, such as actors, give away the true scale; designers use small figures or keep actors in front.'
  ],
  pitfalls: [
    'A forced perspective works from any seat — It is exact from one point only; from other seats the walls look like what they are, a tapering box, and the farther the seat is from the central axis, the worse.',
    'The rake is only for visibility — Its other job is geometric: the floor lines must aim at the same vanishing point as the walls and ceiling or the stage will not read as a level hall.',
    'The back of the set can be painted at full scale — Painting at full scale breaks the illusion: the figures or details at the back must be painted at the scale s(t) of the depth they sit at, not that of the distance they appear to be.'
  ],
  formulas: [
    {
      name: 'Apparent distance of a flat on a tapered stage',
      expr: 'za = (D + t)/s',
      tex: 'z\' = \\frac{D + t}{s}',
      vars: { za: { name: 'apparent distance from the seat', q: 'length', unit: 'm', tex: 'z\'' }, D: { name: 'distance from the seat to the opening', q: 'length', unit: 'm', value: 8 }, t: { name: 'depth of the flat behind the opening', q: 'length', unit: 'm', value: 8 }, s: { name: 'scale of the flat relative to the opening', value: 0.375 } },
      note: 'The eye sees angles: an object of size s times as large at a distance (D + t) subtends the angle of a full-size one at (D + t)/s.'
    },
    {
      name: 'Rise of the floor at the back',
      expr: 'yb = h*(1 - s)',
      tex: 'y_b = h\\,(1 - s)',
      vars: { yb: { name: 'height of the floor at the back above the front edge', q: 'length', unit: 'm', tex: 'y_b' }, h: { name: 'eye height above the front floor', q: 'length', unit: 'm', value: 1.5 }, s: { name: 'scale of the back wall', value: 0.375 } },
      note: 'The sight line from the eye to the back of the floor must reach the level floor of the imagined hall (height 0) at (D + t)/s.'
    },
    {
      name: 'Distance of the false vanishing point',
      expr: 'L = t/(1 - s)',
      tex: 'L = \\frac{t}{1 - s}',
      vars: { L: { name: 'distance of the apex behind the opening', q: 'length', unit: 'm' }, t: { name: 'depth of the stage', q: 'length', unit: 'm', value: 8 }, s: { name: 'scale of the back wall', value: 0.375 } },
      note: 'The apex of the converging walls, floor and ceiling; here 12.8 m behind the opening, 20.8 m from the seat.'
    }
  ],
  examples: [
    {
      title: 'The tapered stage of the construction',
      q: 'The audience seat is 8 m from an opening 8 m wide and 5 m high. The stage is 8 m deep and the back wall is 3 m wide. Eye height is 1.5 m. Find the scale, the apparent depth, the rise of the floor and the height of the ceiling at the back.',
      steps: [
        { text: 'Scale of the back wall:', tex: 's = \\frac{3}{8} = 0.375,\\qquad L = \\frac{8}{1 - 0.375} = 12.8\\ \\text{m}' },
        { text: 'The back wall looks as far as', tex: 'z\' = \\frac{8 + 8}{0.375} = 42.7\\ \\text{m}' },
        { text: 'The floor and ceiling at the back:', tex: 'y_b = 1.5\\,(1 - 0.375) = 0.94\\ \\text{m},\\qquad y_c = 1.5 + 3.5 \\times 0.375 = 2.81\\ \\text{m}' },
        'The back opening is thus 2.81 − 0.94 = 1.875 m high and 3 m wide: 0.375 times the front one, as it should be.'
      ],
      a: 's = 0.375; the back appears 42.7 m away; the floor rises 0.94 m and the ceiling sinks to 2.81 m.'
    },
    {
      title: 'A film street',
      q: 'A film street set is 20 m long, 6 m wide at the front and 3 m at the back; the camera is 10 m from the front. How far does the end of the street seem to be, and by what factor is an actor at the end too large?',
      steps: [
        { text: '', tex: 's = \\tfrac{3}{6} = 0.5,\\qquad z\' = \\frac{10 + 20}{0.5} = 60\\ \\text{m}' },
        'An actor at the end is 30 m from the camera but the street says 60 m, so he looks twice as tall as he should (1/s). The shot must use a child or a figure half-size, or keep the actor in front.'
      ],
      a: 'The end of the street seems 60 m away; an adult there is twice too large.'
    }
  ],
  quiz: [
    { q: 'A stage is 8 m deep, with the back wall at 0.375 of the front, and the seat is 8 m from the front. How far in metres does the back wall seem to be?', answer: 42.7, unit: 'm', why: '(D + t) ÷ s = 16 ÷ 0.375 = 42.7 m.' },
    { q: 'A forced-perspective set looks right from every seat.', a: false, why: 'It is a projection from one point; away from the central seat the converging walls are seen for what they are.' },
    { q: 'Why does the floor of a forced-perspective stage rise towards the back?', choices: ['to give the audience a better view of the actors', 'so that the floor lines point to the same vanishing point as the walls and ceiling', 'to hide the machinery', 'to make the back lighter'], a: 1, why: 'A level floor would run to the horizon while the walls converge on a nearer point; the rise makes all three aim at one apex.' },
    { q: 'An actor stands at the back of a stage whose back wall is at the scale s = 0.4. He looks too large by a factor of', answer: 2.5, why: '1 ÷ s = 2.5: the picture has put him 2.5 times too far away.' },
    { q: 'Pozzo\'s ceiling in Sant\'Ignazio shows the painted architecture correctly from', choices: ['anywhere in the nave', 'a marked disc in the floor of the nave', 'the pulpit', 'the dome'], a: 1, why: 'The painting is the projection of the imagined architecture onto the ceiling from one point; a disc in the floor marks it.' }
  ],
  applications: [
    'Theatre and opera: designers use a rake and tapering wings to make a shallow stage look deep, and shape the backcloth to the principal sight lines.',
    'Film and theme parks: tapering street sets, scaled storeys and shortened façades make buildings seem taller and streets longer, with the camera position as the single viewpoint.',
    'Church ceilings and domes: *quadratura* painting extends the real architecture upward from a marked point in the nave.',
    'Architecture itself: Borromini\'s colonnade in the Palazzo Spada and false vistas in garden design lengthen a short walk by reducing columns, statues and hedges with distance.'
  ],
  history: 'Sebastiano Serlio\'s *Architettura* (book II, Paris 1545) gave three standard scenes, tragic, comic and satyric, drawn in perspective on a raked stage with receding wings. Palladio began the Teatro Olimpico in Vicenza in 1580; Scamozzi completed it in 1585 with the permanent perspective streets behind the stage. Ferdinando Galli-Bibiena\'s *scena per angolo* (about 1700) turned the vanishing points to the side to give grander architecture. Andrea Pozzo painted the Sant\'Ignazio nave ceiling in 1685–94 and set out the method in his *Perspectiva pictorum et architectorum* (1693 and 1700).',
  sources: ['Martin Kemp, *The Science of Art* (1990), chapters on stage perspective and illusionism.', 'Sebastiano Serlio, *Architettura*, book II (1545).', 'Andrea Pozzo, *Perspectiva pictorum et architectorum* (1693, 1700).', 'Richard and Helen Leacroft, *Theatre and Playhouse* (1984), on the raked stage and perspective scenery.'],
  construction: 'ap-forced-stage'
},

{
  id: 'street-art-anamorphosis',
  parent: 'art-and-photography',
  title: 'Street art and sidewalk anamorphosis',
  level: 2,
  short: 'A cube, a chasm or a swimming pool painted on the pavement looks real from one place because the picture is the projection of the imagined object onto the ground from the viewer\'s eye: every point is where the sight line to it meets the ground. Away from that spot the picture slides and stretches.',
  keywords: ['anamorphosis', 'street art', '3D pavement art', 'sight line', 'projection onto the ground', 'sweet spot', 'Julian Beever', 'Kurt Wenner', 'road markings', 'plan and elevation', 'viewpoint'],
  prereq: ['anamorphosis', 'plan-and-elevation-method', 'central-projection'],
  related: ['stage-sets-and-trompe-loeil', 'mirror-anamorphosis', 'cinema-and-anamorphic-lenses', 'forced-perspective', 'perspective-shadows'],
  body: `Street painters draw a cube, a chasm or a swimming pool on the pavement that looks real from one place. The picture is an **anamorphosis**: not a drawing of the object, but its *projection onto the ground from the viewer's eye* ([[anamorphosis]]). Everything the artist needs is in the construction below: the eye, the ground plane, and the sight lines.

### The projection
Put the eye at height $h$ above the pavement. A point of the imagined object at height $y < h$, and at horizontal distance $x$ from the foot of the eye, is painted where the line from the eye through it meets the ground, which is at the distance
$$x_g = x\\,\\frac{h}{h - y}$$
from the foot of the eye, and the same factor applies to the sideways distance. A point on the ground ($y = 0$) stays where it is; a point at eye level would go to infinity, which is why such pictures are painted with every point below eye level. A cube 1 m on a side, 3.5 m ahead, seen from 1.6 m, has its top face enlarged by $1.6/0.6 = 2.67$ and pushed out to 9.3–12 m: the painting is about 8.5 m long for a cube 1 m high. In the elevation you draw the lines from the eye; in the plan you draw the lines from the foot of the eye through the plan points ([[plan-and-elevation-method]]).

### The sweet spot
The picture works from the point it was drawn for. Lower the eye by 0.2 m (to 1.4 m) and the sight line through the same painted point passes the cube's front edge at 0.875 m instead of 1 m: the cube is 12.5 % too short. Step 1 m to one side and it shears. The viewers therefore stand where the artist marks, or a camera stands for the eye, which is why photographs of street art look more convincing than the paintings do in the street: the camera is on the mark.

### Roads
Letters on a road are stretched along the road by the same geometry. A driver whose eye is 1.2 m above the surface sees a point 20 m ahead at an angle of $\\arctan(1.2/20) = 3.4°$ below the horizon, and a stretch of road along the line of sight appears shortened by the sine of that angle, 0.06: to look square at that distance a letter would have to be 17 times longer than wide. Road markings are stretched several times, a compromise that keeps them readable at the distances at which the driver needs them.

### What goes wrong
Eye height varies from 1.2 m (a child) to 1.9 m: a picture for one viewer is wrong by 10–20 % for another. The painter checks the work by photographing it from the mark, enlarges the picture from a distorted grid, and chooses subjects that tolerate error (a hole in the ground, a flat-topped box) over those that do not (a person standing upright).

> [!note] In the construction below the elevation gives the distances (A′, B′), the plan gives the sideways positions, and the three shapes are lined in. The simulation puts you on the pavement and lets you walk away from the spot.`,
  ideas: [
    'A street anamorphosis is the projection of the imagined object onto the ground from one eye position: each point lies where the sight line to it meets the ground.',
    'A point at height y is moved out by the factor h ÷ (h − y); points at or above eye level cannot be painted.',
    'The illusion holds only near the sweet spot; a change of eye height of 0.2 m changes the apparent height of the cube by 12.5 %.',
    'Road lettering is stretched along the road because a ground length seen at a grazing angle is shortened by the sine of the angle.'
  ],
  pitfalls: [
    'The painting is a stretched drawing of the cube — It is not a stretching; it is a projection from a point. Each of its points follows from a sight line, and a uniform stretch of a drawn cube would not give the right shapes of the faces.',
    'The cube looks right from anywhere on the street — It looks right from the sweet spot and for a few steps round it; elsewhere it shears and stretches, and from the side it is simply a pattern.',
    'Only the height of the camera matters, not its distance — Both matter: the factor h ÷ (h − y) depends on the eye height, and the sight lines depend on the horizontal distance from the foot of the eye to the picture.'
  ],
  formulas: [
    {
      name: 'Where a point is painted',
      expr: 'xg = x*h/(h - y)',
      tex: 'x_g = x\\,\\frac{h}{h - y}',
      vars: { xg: { name: 'distance of the painted point from the foot of the eye', q: 'length', unit: 'm', tex: 'x_g' }, x: { name: 'distance of the imagined point from the foot of the eye', q: 'length', unit: 'm', value: 3.5 }, h: { name: 'eye height', q: 'length', unit: 'm', value: 1.6 }, y: { name: 'height of the imagined point', q: 'length', unit: 'm', value: 1, min: 0 } },
      note: 'The same factor applies to the sideways distance. Valid only for y < h.'
    },
    {
      name: 'The enlargement factor',
      expr: 'k = h/(h - y)',
      tex: 'k = \\frac{h}{h - y}',
      vars: { k: { name: 'enlargement on the ground' }, h: { name: 'eye height', q: 'length', unit: 'm', value: 1.6 }, y: { name: 'height of the imagined point', q: 'length', unit: 'm', value: 1, min: 0 } },
      note: 'k = 1 at the ground, 2 at half the eye height, and it grows without limit as y approaches h.'
    },
    {
      name: 'Foreshortening of the ground seen at a distance',
      expr: 'fs = h/sqrt(h^2 + d^2)',
      tex: 'f_s = \\frac{h}{\\sqrt{h^2 + d^2}}',
      vars: { fs: { name: 'apparent length of a ground length along the line of sight, relative to its true length', tex: 'f_s' }, h: { name: 'eye height', q: 'length', unit: 'm', value: 1.2 }, d: { name: 'distance along the ground to the point seen', q: 'length', unit: 'm', value: 20 } },
      note: 'The sine of the angle at which the ground is seen, valid for a short length at distance d. A driver at 1.2 m sees the road 20 m ahead shortened to 6 %.'
    }
  ],
  examples: [
    {
      title: 'The cube on the pavement',
      q: 'The eye is 1.6 m above the ground. A cube 1 m on a side stands (in the imagination) with its near face at 3.5 m and its far face at 4.5 m, on the left of the line of sight 0.4 to 1.4 m. Where are the corners of the top face painted?',
      steps: [
        { text: 'The top is at $y = 1$, so', tex: 'k = \\frac{1.6}{1.6 - 1} = 2.67' },
        { text: 'The distances of the top face on the pavement:', tex: 'x_g = 3.5 \\times 2.67 = 9.33\\ \\text{m},\\qquad 4.5 \\times 2.67 = 12.0\\ \\text{m}' },
        { text: 'The sideways positions (0.4 and 1.4) become', tex: '0.4 \\times 2.67 = 1.07\\ \\text{m},\\qquad 1.4 \\times 2.67 = 3.73\\ \\text{m}' },
        'The top face is thus a square 2.67 m on a side, and the front face a trapezoid from the base edge at 3.5 m to the stretched top edge at 9.33 m.'
      ],
      a: 'The top face is painted as a 2.67 m square at 9.33 to 12.0 m, 1.07 to 3.73 m to the side.'
    },
    {
      title: 'A viewer 20 cm too short',
      q: 'The painting above is viewed with the eye at 1.4 m, at the same place on the ground. How high does the cube seem to be?',
      steps: [
        'The sight line from the eye at 1.4 m to the painted top edge on the ground at 9.33 m rises from the ground to 1.4 m at the viewer; at the cube\'s front face, 3.5 m from the viewer, it is at the height',
        { text: '', tex: 'y = 1.4\\left(1 - \\frac{3.5}{9.33}\\right) = 0.875\\ \\text{m}' }
      ],
      a: 'The cube looks 0.875 m high, 12.5 % too short.'
    }
  ],
  quiz: [
    { q: 'The eye is 1.6 m above the ground. A point of an imagined object 3.5 m away and 1 m high is painted at what distance in metres?', answer: 9.33, unit: 'm', why: 'x_g = 3.5 × 1.6 ÷ (1.6 − 1) = 9.33 m.' },
    { q: 'Which part of an imagined object can NOT be painted on the pavement by this method?', choices: ['a point at the eye\'s height or above', 'a point on the ground', 'a point 1 m high', 'a point to the side'], a: 0, why: 'The sight line from the eye to a point at or above eye level never meets the ground in front of the viewer.' },
    { q: 'A cube painted for an eye at 1.6 m looks right to a viewer who stands 2 m to one side.', a: false, why: 'The picture is a projection from one point; from elsewhere the sight lines meet the painted shapes in different places and the cube shears and stretches.' },
    { q: 'The painting is seen from the same ground position but with the eye at 1.4 m instead of 1.6 m. The cube\'s apparent height in metres is', answer: 0.875, unit: 'm', why: '1.4 × (1 − 3.5 ÷ 9.33) = 0.875 m.' },
    { q: 'Why are photographs of pavement art so convincing?', choices: ['cameras correct perspective', 'the camera stands at the one point for which the picture is drawn', 'photographs flatten depth', 'the paint is brighter in photographs'], a: 1, why: 'A photographer is placed at the mark, so the picture is projected through the camera\'s lens exactly as the artist designed.' }
  ],
  applications: [
    'Street painting festivals and advertising: chalk and paint pavements built for a marked viewing point, photographed from it.',
    'Road markings: words and arrows are elongated along the road so that a driver reads them at a shallow angle; the same applies to the stretched logos painted on sports fields for television cameras.',
    'Traffic calming: a floating three-dimensional pedestrian crossing, as painted in Ísafjörður in Iceland in 2017, uses the same projection to make drivers see an object in the road.',
    'Architecture and landscape: floor patterns and mosaics laid out to look level or raised from the entrance of a hall or the head of a garden walk.'
  ],
  history: 'Anamorphoses are old: Leonardo drew a stretched eye in the 1480s, Hans Holbein put a stretched skull at the foot of *The Ambassadors* in 1533, and Jean-François Niceron set out the geometry in *La perspective curieuse* (1638). Pavement painters (*madonnari*) have worked in Italy since the sixteenth century. The pavement as a surface for three-dimensional illusion came in the 1980s: Kurt Wenner, a former NASA illustrator, made his first anamorphic street paintings at Italian festivals from 1982, and Julian Beever became widely known for his chalk pictures in the 1990s.',
  sources: ['Jurgis Baltrušaitis, *Anamorphic Art* (1976).', 'Martin Kemp, *The Science of Art* (1990), on anamorphosis and its geometry.', 'Jean-François Niceron, *La perspective curieuse* (1638).', 'The traffic-sign manuals of national road authorities on elongated road markings.'],
  construction: 'ap-sidewalk-cube',
  sim: 'ap-sidewalk-view'
}
);
