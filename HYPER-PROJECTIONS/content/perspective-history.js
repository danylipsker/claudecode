/* HYPER-PROJECTIONS · content/perspective-history.js — how perspective was found, and the instruments that drew it.
 *
 *   brunelleschi-experiment   the panel of the Baptistery, the peephole and the mirror
 *   alberti-window            the picture as a window, the visual pyramid, the veil
 *   durer-devices             the thread and the door, the glass and the sight
 *   camera-obscura            the dark room: the inverted image, its size, its blur, its history
 *   perspective-machines      the pantograph, the perspectograph and the camera lucida
 *   perspective-in-painting   Masaccio, Uccello, Piero, Leonardo, Vermeer, Pozzo, Hokusai
 * Constructions are in constructions/perspective-history.js, simulations in sims/perspective-history.js.
 */
Hyper.add(
{
  id: 'brunelleschi-experiment',
  parent: 'perspective-history',
  title: 'Brunelleschi\'s experiment',
  level: 1,
  short: 'A small panel of the Florentine Baptistery, painted with a peephole and viewed in a mirror, which matched the real building exactly: the demonstration, around 1413–1425, that a flat picture can be made to agree with the seen world from one point of view.',
  keywords: ['Brunelleschi', 'Baptistery', 'peephole', 'mirror', 'panel', 'Manetti', 'Florence', 'linear perspective', 'invention of perspective', 'viewing distance'],
  prereq: ['central-projection', 'station-point-and-cone-of-vision', 'horizon-and-eye-level'],
  related: ['alberti-window', 'alberti-construction', 'durer-devices', 'camera-obscura', 'perspective-in-painting'],
  body: `Sometime between about 1413 and 1425 the Florentine architect Filippo Brunelleschi (1377–1446) made a small painted panel of the Baptistery of San Giovanni, the octagonal building that stands opposite the cathedral, and a demonstration of how to look at it. The panel itself is lost; what we know is told by his biographer Antonio Manetti, writing some decades later. The story is the traditional beginning of **linear perspective**.

### The experiment
Brunelleschi painted the Baptistery as seen from a few paces inside the central door of the cathedral, on a panel a little over a quarter of a metre wide. He made a small hole in the panel at the very point of the picture where his own eye had been, polished silver for the sky so that real clouds drifted across it, and gave the viewer a flat mirror. The viewer stood with the **back** of the panel to the eye, looked through the hole, and held the mirror in front of the painted face, so that the eye saw the painting reflected. Then the mirror was taken away, and through the same hole the eye saw the real Baptistery. The two matched.

### The geometry
- The **hole is the eye**. The picture is a central projection from that point onto the panel, and the hole is the centric point, the foot of the perpendicular from the eye. The lines of the building that recede perpendicular to the panel meet at the hole.
- The **mirror doubles the distance**. The eye sees the image of the panel as far behind the mirror as the panel is in front of it. With the eye a distance $a$ from the panel and the mirror $m$ in front of it, the picture is seen at the distance
$$D = a + 2m.$$
With $a\\approx 3$ cm and the mirror held at arm\'s length, $m\\approx 25$ cm, $D\\approx 53$ cm: a distance at which a panel of 29 cm subtends about 31°, a natural view of a building across a square.
- The viewer\'s eye is held at the **one point** from which the projection was made. That is the central claim: a picture is correct for **one** eye position, and the hole and the mirror provide it.

### What was shown, and what is uncertain
The experiment showed that a flat picture can reproduce the visual field exactly, and that the match depends on a fixed viewpoint. It did not by itself give a rule for drawing: Alberti\'s *De pictura* (1435) did that. Whether Brunelleschi found the geometry or a method of tracing, why he used a mirror, and the date are still debated, and some scholars doubt parts of Manetti\'s account. Modern reconstructions confirm that the device works as described.

> [!note] Manetti describes a second panel, of the Piazza della Signoria with the Palazzo dei Signori (now the Palazzo Vecchio). According to him it was cut along the skyline of the buildings, so that the real sky, with its real clouds, showed above the painted ones.`,
  ideas: [
    'A picture matches the seen world exactly only from one eye position: the hole in the panel is that eye position.',
    'The mirror shows the panel as far behind it as it is in front, so the picture is seen from the distance D = a + 2m.',
    'The painted perspective is a central projection of the Baptistery from the hole onto the panel.',
    'The panel is lost; the account is Manetti\'s, written decades later, and parts of it are debated.'
  ],
  pitfalls: [
    'The mirror was used to flip the picture the right way round — Its function was to fix the viewing distance and to show the painted face to an eye behind it; the picture was painted the way the eye saw the building.',
    'Brunelleschi wrote down a perspective rule — No text by him survives; Alberti (1435) was the first to write the construction, and Brunelleschi\'s achievement is known only from the demonstration and Manetti\'s account.',
    'The painting looks right from anywhere — It matches the Baptistery only for an eye at the hole, at the distance the picture was made for.'
  ],
  formulas: [
    {
      name: 'Distance of the mirror image of the panel from the eye',
      expr: 'D = a + 2*m',
      tex: 'D = a + 2m',
      vars: {
        D: { name: 'distance from the eye to the picture as seen in the mirror', q: 'length', unit: 'cm' },
        a: { name: 'distance from the eye to the panel', q: 'length', unit: 'cm', value: 3 },
        m: { name: 'distance from the panel to the mirror', q: 'length', unit: 'cm', value: 25 }
      },
      note: 'The picture is seen as if it were a window at the distance D: this is the viewing distance of the painting.'
    },
    {
      name: 'Angle subtended by the panel at the viewing distance',
      expr: 'theta = 2*atan(w/(2*D))',
      tex: '\\theta = 2\\arctan\\frac{w}{2D}',
      vars: {
        theta: { name: 'angle of view', q: 'angle', unit: '°', tex: '\\theta' },
        w: { name: 'width of the panel', q: 'length', unit: 'cm', value: 29 },
        D: { name: 'distance from the eye to the picture as seen in the mirror', q: 'length', unit: 'cm', value: 53 }
      },
      note: 'For a panel half a Florentine braccio wide (about 29 cm) at 53 cm the angle is 30.6°.'
    }
  ],
  examples: [
    {
      title: 'The viewing distance and the angle',
      q: 'The eye is 3 cm behind a panel 29 cm wide, and the mirror is held 25 cm in front of the painted face. At what distance is the picture seen, and what angle does it fill?',
      steps: [
        { text: 'The image of the panel is behind the mirror:', tex: 'D = a + 2m = 3 + 2 \\times 25 = 53\\ \\text{cm}' },
        { text: 'The angle of view:', tex: '\\theta = 2\\arctan\\frac{29}{2 \\times 53} = 2\\arctan 0.274 = 30.6°' }
      ],
      a: 'The picture is seen from 53 cm and fills an angle of 30.6°.'
    },
    {
      title: 'How far should the mirror be held?',
      q: 'The panel is 29 cm wide and the Baptistery has to fill a 30° angle. The eye is 3 cm behind the panel. How far in front of the panel must the mirror be?',
      steps: [
        { text: 'The picture must be seen from', tex: 'D = \\frac{w}{2\\tan(\\theta/2)} = \\frac{29}{2\\tan 15°} = 54.1\\ \\text{cm}' },
        { text: 'So', tex: 'm = \\frac{D - a}{2} = \\frac{54.1 - 3}{2} = 25.5\\ \\text{cm}' }
      ],
      a: 'The mirror is held about 25 cm from the panel: an arm\'s length, which is why the demonstration works in the hand.'
    }
  ],
  quiz: [
    { q: 'Why was there a hole in Brunelleschi\'s panel?', choices: ['To hang it on the wall', 'To place the eye at the point from which the picture was projected', 'To let the sky show through', 'To let in light'], a: 1, why: 'The hole marks the position of the eye in the projection and held the viewer\'s eye there.' },
    { q: 'The eye is 4 cm behind the panel and the mirror is 30 cm in front of it. At what distance is the picture seen?', answer: 64, unit: 'cm', why: 'D = a + 2m = 4 + 60 = 64 cm.' },
    { q: 'A painting made by Brunelleschi\'s method looks correct from any position in front of it.', a: false, why: 'It is the projection from one eye position; from other positions the lines and proportions are those of a different view. The hole and the mirror hold the eye at that one point.' },
    { q: 'Which statement is best supported by the evidence?', choices: ['The panel survives in the Uffizi', 'The account comes from Manetti, writing decades later, and the panel is lost', 'Brunelleschi wrote a treatise on perspective', 'The mirror showed the Baptistery to the viewer'], a: 1, why: 'The panels are lost and no text by Brunelleschi on perspective survives. The account is Manetti\'s biography.' }
  ],
  applications: [
    'Understanding the correct viewing distance of photographs and paintings: the picture is "right" from one place, usually at about the diagonal of the picture.',
    'Perspective boxes and peepshows, from the 17th-century boxes of Samuel van Hoogstraten to museum dioramas, which fix the eye by a hole.',
    'Virtual reality headsets, in which the eye is held at the centre of projection of each display.',
    'Reconstructions and reproductions in museums, which let the visitor repeat the experiment with a panel and a mirror.'
  ],
  history: 'Filippo Brunelleschi (1377–1446) designed the dome of Florence cathedral (built 1420–36). Antonio Manetti\'s *Life of Brunelleschi*, written in the 1480s, is the source for the panels of the Baptistery and the Palazzo dei Signori; it gives no year, and the date has been put between about 1413 and 1425. Alberti, who knew Brunelleschi, dedicated the Italian version of *De pictura* (1436) to him. Samuel Edgerton\'s *The Renaissance Rediscovery of Linear Perspective* (1975) made the experiment well known to modern readers; Martin Kemp and Hubert Damisch have since examined what the panel could and could not have shown.',
  sources: [
    'Antonio di Tuccio Manetti, *The Life of Brunelleschi* (c. 1480s), edited and translated by Howard Saalman (1970).',
    'Samuel Y. Edgerton, *The Renaissance Rediscovery of Linear Perspective* (1975).',
    'Martin Kemp, *The Science of Art* (1990), chapter 2.',
    'Hubert Damisch, *The Origin of Perspective* (1987; English translation 1994).'
  ],
  construction: 'ph-brunelleschi-panel'
},

{
  id: 'alberti-window',
  parent: 'perspective-history',
  title: 'Alberti\'s window',
  level: 1,
  short: 'The picture as an open window through which the scene is seen: Alberti\'s definition of 1435 of a picture as the intersection of the visual pyramid with a plane, and the veil of threads that makes the window a copying grid.',
  keywords: ['Alberti', 'De pictura', 'window', 'visual pyramid', 'intersection', 'veil', 'velo', 'grid', 'centric ray', 'picture plane', 'finestra aperta'],
  prereq: ['central-projection', 'horizon-and-eye-level', 'brunelleschi-experiment'],
  related: ['alberti-construction', 'durer-devices', 'camera-obscura', 'perspective-machines', 'cross-ratio'],
  body: `In *De pictura* (1435), Leon Battista Alberti defines the painter\'s task in geometry. The painter draws a rectangle on the panel and treats it as an **open window** through which the scene is seen. The picture is then what you would see through the window with one eye. That sentence contains the whole theory of linear perspective.

### The visual pyramid
From the eye run rays to every point of the scene: a pyramid (or cone) with its apex at the eye. A picture is the **intersection** of that pyramid with a plane, the window: each ray meets the plane in one point, and the points together are the picture. Alberti calls the ray that meets the plane at right angles the **centric ray**, and its foot, the **centric point**. A different plane gives a different picture, but any two pictures of the same pyramid are related by simple geometry, and that is why the picture can be made at any size.

By similar triangles the height of an object on the window is
$$h' = H\\,\\frac{d}{z},$$
with $H$ the true height, $z$ its distance from the eye and $d$ the distance of the window from the eye: the same ratio, whatever the window\'s distance, so moving the window towards the eye shrinks the picture without changing its shape.

### The veil
Alberti also describes a practical aid, the **veil** (*velo*): a fine cloth stretched in a frame and divided into squares by thicker threads, set up between the eye and the thing to be painted. The painter keeps the eye fixed, then draws on the panel a grid of the same proportions and copies what appears in each square of the veil into the corresponding square. The veil is the window with a coordinate system on it. It teaches the beginner to see outlines as they are, not as the mind imagines them. The method is the same as the square-by-square copying of any drawing; what makes it perspective is that the veil stands between a *single eye* and the scene.

### Why the window matters
It turns the picture from a decoration into a **plane section of rays**. It makes the eye position a necessary part of the definition; it allows calculations (sizes, vanishing points) to be made from geometry; and it is the ancestor of the modern camera model, in which a sensor plane and a point of projection replace the window and the eye. Later critics, notably Panofsky and Damisch, have asked what such a window leaves out: the second eye, the moving head, the curvature of the visual field.`,
  ideas: [
    'A picture is the intersection of the visual pyramid with a plane: the window.',
    'The centric ray is the ray perpendicular to the window; its foot is the centric point.',
    'The height of an object on the window is H d/z, so the window can be moved nearer or farther and the picture only changes in size.',
    'The veil is the window with a net of threads: copy square by square from the veil to a grid on the panel, with the eye kept fixed.'
  ],
  pitfalls: [
    'Alberti\'s window is a real glass pane — It is a geometrical idea: a plane, imagined between the eye and the scene. The veil is the practical form.',
    'The veil makes the painting correct for any viewer — It fixes the eye of the painter; the picture is right only for an eye at the same place.',
    'A larger window gives a bigger scene — A larger window at the same distance shows a wider angle of the scene; moving the window nearer or farther only changes the size of the picture.'
  ],
  formulas: [
    {
      name: 'Height of an object on the window',
      expr: 'h = H*d/z',
      tex: 'h\' = H\\,\\frac{d}{z}',
      vars: {
        h: { name: 'height of the picture on the window', q: 'length', unit: 'cm', tex: 'h\'' },
        H: { name: 'true height of the object', q: 'length', unit: 'cm', value: 180 },
        d: { name: 'distance from the eye to the window', q: 'length', unit: 'cm', value: 40 },
        z: { name: 'distance from the eye to the object', q: 'length', unit: 'cm', value: 600 }
      },
      note: 'The same ratio for all objects at the same distance; two objects at different distances are in the ratio of their distances.'
    },
    {
      name: 'Angle of view of the window',
      expr: 'theta = 2*atan(w/(2*d))',
      tex: '\\theta = 2\\arctan\\frac{w}{2d}',
      vars: {
        theta: { name: 'angle of view', q: 'angle', unit: '°', tex: '\\theta' },
        w: { name: 'width of the window', q: 'length', unit: 'cm', value: 40 },
        d: { name: 'distance from the eye to the window', q: 'length', unit: 'cm', value: 40 }
      },
      note: 'A window as wide as it is far from the eye has a 53° view.'
    }
  ],
  examples: [
    {
      title: 'A figure on the veil',
      q: 'The veil is 40 cm from the painter\'s eye. A figure 1.8 m tall stands 6 m from the eye. How tall is its image on the veil?',
      steps: [
        { text: 'By similar triangles:', tex: 'h\' = 180 \\cdot \\frac{40}{600} = 12\\ \\text{cm}' },
        'If the painter now holds the veil 20 cm from the eye, the figure covers 6 cm, half as high and in exactly the same shape.'
      ],
      a: 'The image is 12 cm tall.'
    },
    {
      title: 'How much does the veil show?',
      q: 'A veil 40 cm wide and 30 cm high is held 40 cm from the eye. What angles does it cover?',
      steps: [
        { text: 'Horizontally:', tex: '\\theta_h = 2\\arctan\\frac{20}{40} = 53.1°' },
        { text: 'Vertically:', tex: '\\theta_v = 2\\arctan\\frac{15}{40} = 41.1°' }
      ],
      a: 'The window covers 53° across and 41° up and down.'
    }
  ],
  quiz: [
    { q: 'What is Alberti\'s picture, in geometry?', choices: ['A copy of the scene on a flat surface', 'The intersection of the visual pyramid with a plane', 'The shadow of the scene on a wall', 'A drawing made from the plan'], a: 1, why: 'Every ray from the eye to the scene meets the window in one point; the points are the picture.' },
    { q: 'A figure of 2 m stands 10 m from the eye, and the veil is 0.5 m from the eye. How tall is the image on the veil?', answer: 10, unit: 'cm', why: 'h\' = H d/z = 200 × 0.5/10 = 10 cm.' },
    { q: 'The veil gives a correct picture whatever the painter\'s eye position.', a: false, why: 'It fixes the picture to the eye position of the painter; moving the head shifts the squares against the scene.' },
    { q: 'If the window is moved twice as far from the eye (the scene and the eye staying where they are), the picture on it', choices: ['is twice as large and the same shape', 'is half as large', 'is the same size', 'changes shape'], a: 0, why: 'h\' = H d/z doubles with d; the shape is unchanged because every ray is cut at twice the distance.' }
  ],
  applications: [
    'Every camera: a sensor or film plane and a point of projection replace the window and the eye; the pixel grid is the veil.',
    'Drawing with a grid and squaring up: transferring a drawing to a wall or enlarging it by copying square by square.',
    'Tracing on glass: drawing a view on a window with one eye closed, a classroom exercise that teaches perspective in minutes.',
    'Interface design and rendering: a "viewport" is the window, a "camera" the eye, and clipping to the frame its edges.'
  ],
  history: 'Leon Battista Alberti (1404–1472) wrote *De pictura* in Latin in 1435 and in Italian (*Della pittura*) in 1436, dedicating the Italian text to Brunelleschi. The first book is geometry, the second the art of painting, the third the painter. The window and the veil are in the first two books. Leonardo da Vinci described a pane of glass on which to trace a view, and Dürer (1525) drew a net of threads in his woodcuts of the draughtsman and the reclining woman.',
  sources: [
    'Leon Battista Alberti, *De pictura* (1435), Book I; *On Painting*, translated by Cecil Grayson (Penguin, 1991).',
    'Martin Kemp, *The Science of Art* (1990), chapter 2.',
    'Erwin Panofsky, *Perspective as Symbolic Form* (1927; English translation 1991).',
    'Samuel Y. Edgerton, *The Mirror, the Window, and the Telescope* (2009).'
  ],
  construction: 'ph-alberti-veil'
},

{
  id: 'durer-devices',
  parent: 'perspective-history',
  title: 'Dürer\'s drawing devices',
  level: 1,
  short: 'The woodcuts of 1525: a thread from a hook in the wall to the object, passing through a frame whose two crossing threads record each point; and a glass pane viewed through a fixed sight. Two instruments that make the geometry visible.',
  keywords: ['Dürer', 'Underweysung der Messung', 'thread', 'door', 'frame', 'glass', 'sight', 'lute', 'draughtsman', 'perspective machine', 'woodcut'],
  prereq: ['alberti-window', 'plan-and-elevation-method', 'central-projection'],
  related: ['perspective-machines', 'camera-obscura', 'brunelleschi-experiment', 'monge-method'],
  body: `Albrecht Dürer (1471–1528), the painter and printmaker of Nuremberg, travelled twice to Italy, in 1494–95 and in 1505–07, and published what he learnt in the *Underweysung der Messung mit dem Zirckel und Richtscheyt* ("Instruction in measuring with compass and ruler", 1525): the first book in German on geometry, with a book on perspective and woodcuts of machines to draw it.

### The thread and the door
The best-known woodcut shows a draughtsman drawing a lute. A thread is fixed to a **hook in the wall**, the eye. It runs to a point on the lute where an assistant holds it. Between hook and lute stands a **frame like a hinged door**, over the drawing paper; across the frame two threads can be slid, one vertical and one horizontal, until both touch the long thread. Their crossing is where the thread passes the picture plane. The frame is swung shut on the paper and the point marked.

The geometry is the plan-and-elevation method made with string. The **vertical** thread records the *sideways* position of the crossing (what the plan gives), the **horizontal** thread the *height* (what the elevation gives): a point on a plane needs two coordinates, hence two threads. If the hook is at the height $h_e$ and the frame at the distance $d$, the thread to a point $(x, y, z)$ crosses the frame at
$$x_c = x\\,\\frac{d}{z},\\qquad y_c = h_e + (y - h_e)\\,\\frac{d}{z}.$$

### The glass and the sight
In the second device a **sight**, a fixed eyepiece on a post, holds the draughtsman\'s eye at one place; between the sight and the sitter stands a pane of glass in a frame. He traces the outlines on the glass with a grease pencil, or, in the other woodcut, copies square by square from a net of threads in the frame onto a paper ruled with the same squares ([[alberti-window|Alberti\'s veil]]). The tracing is the section of the visual pyramid by the glass: the farther the glass, the larger the tracing, in the same shape.

### What the machines are
They were taken by later writers for the draughtsman\'s everyday tools, but they are awkward, and no workshop is known to have used them in this form. They are better read as **teaching pictures**: Dürer shows in wood and string what the geometry of rays means, in the same way that a diagram does. The same book also draws solids and letters from a plan and an elevation, an ancestor of the two-view drawing that Monge formalised as descriptive geometry two and a half centuries later.`,
  ideas: [
    'The thread is a visual ray: from the hook (the eye) through the frame (the picture plane) to the object.',
    'Two crossing threads fix a point on the frame: the vertical one the sideways position (from the plan), the horizontal one the height (from the elevation).',
    'The glass and the sight trace the section of the visual pyramid; the fixed sight is the eye, and the glass is the window.',
    'The devices are best read as teaching pictures of the geometry of rays.'
  ],
  pitfalls: [
    'Dürer invented perspective — He learnt it in Italy and made it known north of the Alps; the geometry goes back to Brunelleschi and Alberti.',
    'The machines were standard workshop tools — They are demonstrations; no workshop is known to have used them as drawn.',
    'The thread gives the picture directly in three dimensions — It gives one point of the picture at a time: its crossing with the frame; the picture is the set of crossings.'
  ],
  formulas: [
    {
      name: 'Where the thread crosses the frame (height)',
      expr: 'yc = he + (y - he)*d/z',
      tex: 'y_c = h_e + (y - h_e)\\,\\frac{d}{z}',
      vars: {
        yc: { name: 'height of the crossing in the frame', q: 'length', unit: 'cm', tex: 'y_c' },
        he: { name: 'height of the hook (the eye)', q: 'length', unit: 'cm', value: 90, tex: 'h_e' },
        y: { name: 'height of the point of the object', q: 'length', unit: 'cm', value: 50 },
        d: { name: 'distance from the hook to the frame', q: 'length', unit: 'cm', value: 120 },
        z: { name: 'distance from the hook to the point (in depth)', q: 'length', unit: 'cm', value: 150 }
      },
      note: 'The sideways position is $x_c$ = x d/z, with the same factor d/z.'
    },
    {
      name: 'Sideways position of the crossing',
      expr: 'xc = x*d/z',
      tex: 'x_c = x\\,\\frac{d}{z}',
      vars: {
        xc: { name: 'sideways position of the crossing', q: 'length', unit: 'cm', signed: true, tex: 'x_c' },
        x: { name: 'sideways position of the point', q: 'length', unit: 'cm', value: -80, signed: true },
        d: { name: 'distance from the hook to the frame', q: 'length', unit: 'cm', value: 120 },
        z: { name: 'distance from the hook to the point (in depth)', q: 'length', unit: 'cm', value: 150 }
      },
      note: 'Measured from the line through the hook perpendicular to the frame.'
    }
  ],
  examples: [
    {
      title: 'One crossing of the door',
      q: 'The hook is 90 cm high and the frame is 120 cm from it. The nearest top corner of a box is 80 cm to the left of the line through the hook, 50 cm high and 150 cm from the hook (in depth). Where do the two threads cross in the frame?',
      steps: [
        { text: 'The factor:', tex: '\\frac{d}{z} = \\frac{120}{150} = 0.8' },
        { text: 'Sideways:', tex: '$x_c$ = -80 \\times 0.8 = -64\\ \\text{cm}' },
        { text: 'Height:', tex: '$y_c$ = 90 + (50 - 90) \\times 0.8 = 58\\ \\text{cm}' }
      ],
      a: 'The vertical thread goes 64 cm to the left, the horizontal thread to 58 cm: the crossing is at (−64, 58).'
    },
    {
      title: 'The glass',
      q: 'The sight is 80 cm above the ground, the glass 70 cm from it. A post 60 cm high stands 150 cm from the sight. How tall is its tracing on the glass?',
      steps: [
        { text: 'The ratio of the distances is $70/150$, so', tex: 'h\' = 60 \\times \\frac{70}{150} = 28\\ \\text{cm}' }
      ],
      a: '28 cm. At the glass moved to 105 cm it would be 42 cm.'
    }
  ],
  quiz: [
    { q: 'In the thread-and-door device, why are there two crossing threads?', choices: ['One for each eye', 'A point of a plane needs two coordinates, sideways and height', 'To hold the main thread', 'For symmetry'], a: 1, why: 'The vertical thread gives the x-position and the horizontal one the height; their crossing is the point of the picture.' },
    { q: 'The hook is at 90 cm. A point 30 cm high and 200 cm away is seen through a frame 100 cm from the hook. At what height does the thread cross the frame?', answer: 60, unit: 'cm', why: '$y_c$ = 90 + (30 − 90) × 100/200 = 60 cm.' },
    { q: 'Dürer\'s machines were everyday tools of the Renaissance workshop.', a: false, why: 'They are demonstrations of the geometry of rays; no workshop is known to have used them in this form.' },
    { q: 'If the glass is moved farther from the sight, the tracing', choices: ['gets smaller', 'gets larger, in the same shape', 'is unchanged', 'turns upside down'], a: 1, why: 'The ratio d/z grows in proportion to the distance of the glass; every length scales alike.' }
  ],
  applications: [
    'The thread through a frame is the model of every pinhole camera and of the ray-casting used in computer graphics.',
    'String pots, coordinate measuring arms and laser trackers place a point in space by one line from a fixed origin, like the thread.',
    'Teaching: the glass pane and the sight are still the clearest classroom demonstration of what a perspective drawing is.',
    'Drawing aids sold today for artists (viewing frames, grids, viewfinders) are the net and the sight.'
  ],
  history: 'Dürer published the *Underweysung der Messung* in Nuremberg in 1525, with a second edition in 1538, ten years after his death. The woodcuts of the lute and the reclining woman are among the best-known pictures of perspective instruments in the book. Dürer had visited Italy in 1494–95 and 1505–07 and met the work and the ideas of the Italian painters; the book does not claim the invention of perspective. Panofsky\'s *The Life and Art of Albrecht Dürer* (1943) is the classic study.',
  sources: [
    'Albrecht Dürer, *Underweysung der Messung mit dem Zirckel und Richtscheyt* (Nuremberg, 1525); *The Painter\'s Manual*, translated by Walter L. Strauss (1977).',
    'Erwin Panofsky, *The Life and Art of Albrecht Dürer* (1943).',
    'Martin Kemp, *The Science of Art* (1990).',
    'Samuel Y. Edgerton, *The Renaissance Rediscovery of Linear Perspective* (1975).'
  ],
  construction: ['ph-durer-door', 'ph-durer-glass'],
  sim: 'ph-durer-thread'
},

{
  id: 'camera-obscura',
  parent: 'perspective-history',
  title: 'The camera obscura',
  level: 2,
  short: 'A dark room with a small hole: the outside world appears upside down on the opposite wall, in exact perspective. Its image is the object scaled by $d_i / d_o$ and blurred by the hole; there is a best size of hole.',
  keywords: ['camera obscura', 'pinhole', 'dark chamber', 'inverted image', 'Alhazen', 'Kepler', 'Rayleigh', 'blur', 'diffraction', 'photography', 'Vermeer'],
  prereq: ['central-projection', 'brunelleschi-experiment', 'alberti-window'],
  related: ['perspective-machines', 'durer-devices', 'photography-lenses-and-projections', 'physics:geometric-optics', 'physics:the-eye'],
  body: `Close the shutters of a room and leave one small hole. On the wall opposite, upside down and left-right reversed, appears a **picture of the street outside**, in colour, and exactly in perspective. This is the *camera obscura* ("dark chamber"). The hole is a point through which every ray passes, so it is the **centre of projection**: the same point that the eye is in a perspective drawing. The picture on the screen is the ideal perspective picture, drawn by light.

### The size of the picture
A point of the scene sends a thin ray through the hole to one point of the screen, in a straight line. The two triangles on either side of the hole are similar, so an object of height $h_o$ at the distance $d_o$ from the hole makes an image of height
$$h_i = h_o\\,\\frac{d_i}{d_o},$$
where $d_i$ is the distance from the hole to the screen. The picture is inverted, and reduced when the screen is nearer to the hole than the scene is. A deeper room gives a larger, fainter picture.

### The hole decides the sharpness
A real hole has a width $a$, and each scene point lights a small **patch** on the screen, not a point. A bundle of rays through a hole of width $a$ widens to a patch of width
$$b_g = a\\left(1 + \\frac{d_i}{d_o}\\right),$$
so a smaller hole gives a sharper picture. But light bends round the edge of a very small hole (**diffraction**), and the patch has a width of about
$$b_d \\approx \\frac{2.44\\,\\lambda\\,d_i}{a},$$
which grows as the hole shrinks. The total blur is smallest when the two are equal, at
$$a \\approx \\sqrt{\\frac{2.44\\,\\lambda\\,d_i}{1 + d_i/d_o}},$$
close to Rayleigh\'s classical $1.9\\sqrt{\\lambda f}$ for a far scene. For a box 20 cm deep and green light (550 nm) that is about half a millimetre. A bigger hole gives a brighter, blurrier picture; a lens brings the rays from a point back to a point and so allows a large hole and a bright, sharp one.

### The camera obscura and perspective
The camera obscura gave painters a picture they could trace, and it gave scientists a way to watch the Sun: Gemma Frisius drew the eclipse of 1544 from its image. Its relation to the picture-window of Alberti is direct: the screen is a window, the hole is the eye. Whether particular artists, notably Canaletto and Vermeer, used it has been argued for decades; the geometry of Vermeer\'s rooms and the soft highlights of his paintings are cited for it, and many specialists remain unconvinced.

> [!warn] Never look at the Sun itself through the hole or through any lens. A camera obscura throws an image of the Sun on a screen, and it is a safe way to watch an eclipse only if you look at the screen, with your back to the Sun.`,
  ideas: [
    'Every ray passes through the hole, so the picture is a central projection with the hole as the centre: perspective drawn by light.',
    'The image is inverted and scaled by $d_i/d_o$: a deeper box makes a larger, fainter picture.',
    'A hole of width $a$ blurs each point into a patch of width $a(1 + d_i/d_o)$; diffraction adds about $2.44\\,\\lambda\\, d_i/a$.',
    'There is a best hole, where the two blurs are equal: about half a millimetre for a 20 cm box.'
  ],
  pitfalls: [
    'The picture is inverted because the hole flips it — The rays cross at the hole; a point high in the scene reaches a low point of the screen. The same happens in the eye and in any camera.',
    'The smaller the hole the sharper the picture — Down to a point only: below the best size diffraction blurs the picture again, and the exposure grows as the square of the width.',
    'A pinhole image is out of focus unless the screen is at the right distance — A pinhole has no focus: the picture is equally (un)sharp at every screen distance, but its size changes in proportion.'
  ],
  formulas: [
    {
      name: 'Image height',
      expr: 'hi = ho*di/do',
      tex: 'h_i = h_o\\,\\frac{d_i}{d_o}',
      vars: {
        hi: { name: 'height of the image on the screen', q: 'length', unit: 'cm', tex: 'h_i' },
        ho: { name: 'height of the object', q: 'length', unit: 'cm', value: 3000, tex: 'h_o' },
        di: { name: 'distance from the hole to the screen', q: 'length', unit: 'cm', value: 30, tex: 'd_i' },
        do: { name: 'distance from the hole to the object', q: 'length', unit: 'cm', value: 15000, tex: 'd_o' }
      },
      note: 'The ratio $d_i/d_o$ is the magnification; the image is inverted.'
    },
    {
      name: 'Geometric blur of a hole of width a',
      expr: 'b = a*(1 + di/do)',
      tex: 'b = a\\left(1 + \\frac{d_i}{d_o}\\right)',
      vars: {
        b: { name: 'width of the patch on the screen', q: 'length', unit: 'mm' },
        a: { name: 'width of the hole', q: 'length', unit: 'mm', value: 0.5 },
        di: { name: 'distance from the hole to the screen', q: 'length', unit: 'cm', value: 30, tex: 'd_i' },
        do: { name: 'distance from the hole to the object', q: 'length', unit: 'cm', value: 15000, tex: 'd_o' }
      },
      note: 'For a far scene the blur is nearly the width of the hole itself.'
    },
    {
      name: 'Best width of the hole',
      expr: 'a = sqrt(2.44*lam*di/(1 + di/do))',
      tex: 'a = \\sqrt{\\frac{2.44\\,\\lambda\\,d_i}{1 + d_i/d_o}}',
      vars: {
        a: { name: 'width of the best hole', q: 'length', unit: 'mm' },
        lam: { name: 'wavelength of the light', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        di: { name: 'distance from the hole to the screen', q: 'length', unit: 'cm', value: 30, tex: 'd_i' },
        do: { name: 'distance from the hole to the object', q: 'length', unit: 'cm', value: 15000, tex: 'd_o' }
      },
      note: 'Equating the geometric blur $a(1 + d_i/d_o)$ with the diffraction blur $2.44\\,\\lambda\\, d_i/a$. Rayleigh\'s $1.9\\sqrt{\\lambda\\, d_i}$ is the same idea with a different blur criterion.'
    }
  ],
  examples: [
    {
      title: 'A tower in a box',
      q: 'A tower 30 m high stands 150 m from a pinhole box 30 cm deep. How large is the picture, and what hole gives the sharpest picture in green light (550 nm)?',
      steps: [
        { text: 'The image height:', tex: 'h_i = 30 \\times \\frac{0.30}{150} = 0.06\\ \\text{m} = 6\\ \\text{cm}' },
        { text: 'The best hole:', tex: 'a = \\sqrt{\\frac{2.44 \\times 5.5\\times10^{-7} \\times 0.30}{1 + 0.002}} = 0.63\\ \\text{mm}' },
        'With that hole the geometric blur is $0.63$ mm and the diffraction blur about $0.63$ mm too, a total of $0.90$ mm, 1.5 % of the image.'
      ],
      a: 'The picture is 6 cm tall, upside down; a hole of 0.63 mm gives the least blur, about 0.9 mm.'
    },
    {
      title: 'A hole that is too big',
      q: 'The same box with a hole of 3 mm: what is the blur?',
      steps: [
        { text: 'Geometric blur:', tex: 'b_g = 3 \\times 1.002 = 3.0\\ \\text{mm}' },
        'Diffraction contributes only $2.44 \\times 5.5\\times10^{-7} \\times 0.3 / 0.003 = 0.13$ mm.',
        'The total is about $3.0$ mm, half the height of the picture (6 cm): the picture is soft, though bright.'
      ],
      a: 'A 3 mm hole blurs each point over about 3 mm of the 60 mm image.'
    }
  ],
  quiz: [
    { q: 'An object 30 m tall stands 150 m from a pinhole box 30 cm deep. How tall is the image?', answer: 6, unit: 'cm', why: '$h_i = 30 \\times 0.30/150 = 0.06$ m = 6 cm, upside down.' },
    { q: 'A smaller hole always gives a sharper picture.', a: false, why: 'Below the best size diffraction blurs the picture again; the diffraction blur $2.44\\,\\lambda\\, d_i/a$ grows as $a$ falls.' },
    { q: 'The box is made twice as deep (the same hole, a far scene). The picture is', choices: ['half as large', 'twice as large, with the geometric blur still about the width of the hole', 'twice as large, with the geometric blur doubled', 'the same size'], a: 1, why: 'The image scales with $d_i$. For a far scene the geometric blur $a(1 + d_i/d_o)$ stays close to $a$, so relative to the larger picture it is halved (the diffraction blur, $2.44\\,\\lambda\\, d_i/a$, does grow with $d_i$).' },
    { q: 'The picture in a camera obscura is inverted because', choices: ['the screen is behind the hole', 'rays from a high point reach a low point of the screen after crossing at the hole', 'the light is reflected', 'the eye reverses it'], a: 1, why: 'The straight rays cross at the hole, so top and bottom change places and left and right as well.' },
    { q: 'Gemma Frisius observed an eclipse with the image of a camera obscura in 1544.', a: true, why: 'He published a drawing of the 1544 eclipse as seen in the image of a camera obscura in 1545; later Kepler used the instrument for the same purpose.' }
  ],
  applications: [
    'Photography: the pinhole camera is the simplest camera, and every lens camera is a camera obscura with a lens in the hole.',
    'Astronomy and eclipses: projecting the Sun on a screen through a small hole, and X-ray and gamma-ray pinhole cameras in telescopes.',
    'The eye: the pupil is the hole, the retina the screen, and the image is inverted by the same geometry.',
    'Art: tracing devices from the portable boxes of the 17th century to the large camera obscura rooms built for tourists; and the study of the optical aids of painters.'
  ],
  history: 'The earliest known description is that of Mozi in China in the fifth century BC. Aristotle asked in the *Problems* why the Sun\'s image through a gap in leaves is round even through square holes. Ibn al-Haytham (Alhazen), in his *Book of Optics* (about 1011–21), studied the pinhole image by experiment and drew the right conclusions. Gemma Frisius published a picture of the eclipse of 1544 in 1545; Giambattista della Porta (*Magia naturalis*, 1558) and Daniele Barbaro (1568, a lens in the hole) taught painters to use it; Johannes Kepler named it *camera obscura* in 1604. Johann Zahn described portable and reflex versions (1685–86). Joseph Nicéphore Niépce fixed an image with it in 1826–27, the first photograph, and Lord Rayleigh found the best pinhole size in 1891.',
  sources: [
    'Ibn al-Haytham, *Kitab al-Manazir* (Book of Optics, about 1021); see A. Mark Smith\'s edition (2001).',
    'Johannes Kepler, *Ad Vitellionem paralipomena* (1604).',
    'Lord Rayleigh, "Some applications of photography", *Nature* 44 (1891), 249–254.',
    'Philip Steadman, *Vermeer\'s Camera* (2001); David Hockney, *Secret Knowledge* (2001), for the debated use by painters.'
  ],
  construction: 'ph-camera-obscura',
  sim: 'ph-camera-obscura'
},

{
  id: 'perspective-machines',
  parent: 'perspective-history',
  title: 'Perspective machines and the perspectograph',
  level: 2,
  short: 'From Scheiner\'s pantograph of 1603 to the perspectographs and camera lucidas of the 18th and 19th centuries: instruments that make the pencil follow the visual ray. The pantograph is the machine for the perspective of a plane parallel to the picture.',
  keywords: ['pantograph', 'Scheiner', 'perspectograph', 'perspective machine', 'camera lucida', 'Wollaston', 'linkage', 'homothety', 'drawing instrument', 'Taylor'],
  prereq: ['durer-devices', 'central-projection', 'plan-and-elevation-method'],
  related: ['camera-obscura', 'alberti-window', 'perspective-in-painting', 'projective-geometry'],
  body: `After Dürer\'s woodcuts, makers of instruments tried for three centuries to turn the visual ray into a machine: a pointer follows the object, and a pencil, tied to it by a linkage, draws the picture. Some of the devices are curiosities; the idea behind them is exact and simple.

### What any such machine must do
A perspective machine must keep the pencil **on the ray** from the fixed eye through the pointer, at the place where the ray crosses the picture plane. There are three ways to arrange this. Make the ray itself out of wood: a stiff rod or a thread pivoted at the eye, as in Dürer\'s door. Fix the eye with a sight and trace what lies behind a pane of glass. Or use a linkage that does the arithmetic of the scale $D/(z + D)$ for you. The name **perspectograph** (and other names such as perspective machine and perspective pantograph) was given to many instruments of the 18th and 19th centuries that did the last of these, with different mechanisms and the same geometry.

### The pantograph
Christoph Scheiner, a Jesuit astronomer and mathematician, invented the pantograph about 1603 to copy and scale drawings and described it in his *Pantographice* (1631). Four bars form a parallelogram $ABCD$. Bar I runs from the fixed pivot $O$ through $A$ to $D$ with $OA = AD$, and bar IV from $D$ through $C$ to the pencil $P$ with $DC = CP$. The tracer is at the joint $B$. Because $ABCD$ is a parallelogram, $O$, $B$ and $P$ stay on one line, and
$$\\frac{OP}{OB} = \\frac{OD}{OA} = k.$$
Whatever the shape of the parallelogram, the pencil is the **image of the tracer under the central scaling by $k$ about $O$**. This is, exactly, the perspective picture of a plane that is parallel to the picture plane, as seen from $O$: the ratio $D/(z + D)$ is the same for all points at the same depth. That is why the pantograph does not need a plan: when the object is flat and parallel to the picture, perspective is just scaling.

### The camera lucida
William Hyde Wollaston patented the *camera lucida* in 1806: a small prism on a stand that makes the draughtsman see, with one half of his pupil, the real scene reflected in the prism, and with the other half the paper and pencil. The two images are superimposed and the scene can be traced. It is a window with a fixed eye, in a pocket.

### The legacy
The pantograph is still used, in engraving, sign cutting and map reduction, and gave its name to the scissor-shaped current collectors of electric trains. The mathematics behind the perspective instruments, in particular that a perspective is a projective map, was set out by Brook Taylor (*Linear Perspective*, 1715) and Johann Heinrich Lambert (*Die freye Perspektive*, 1759), and in the 19th century by Poncelet and the projective geometers.`,
  ideas: [
    'A perspective machine keeps the pencil on the ray from a fixed eye through the pointer, where it meets the picture plane.',
    'The pantograph is a parallelogram linkage in which the pivot O, the tracer B and the pencil P stay on a line with OP = k·OB.',
    'It scales by k about O: the perspective of a plane parallel to the picture plane.',
    'The camera lucida superimposes the scene and the paper in the eye, so the draughtsman can trace it.'
  ],
  pitfalls: [
    'A pantograph copies a drawing in perspective — It scales by one factor everywhere, the perspective of a flat drawing parallel to the picture. For objects in depth the scale changes with depth and a perspectograph is needed.',
    'The pantograph\'s ratio depends on the position of the arms — It depends only on the lengths: k = OD/OA; the pose of the linkage changes nothing.',
    'Perspective machines made drawing with perspective easy for artists — Most were expensive curiosities; the tracing devices that survived are those, like the camera lucida, that were simple.'
  ],
  formulas: [
    {
      name: 'Scale of a pantograph',
      expr: 'k = (a + b)/a',
      tex: 'k = \\frac{a + b}{a}',
      vars: {
        k: { name: 'scale: pencil distance over tracer distance from the pivot' },
        a: { name: 'length OA from the pivot to the first joint', q: 'length', unit: 'cm', value: 40 },
        b: { name: 'length AD from the first joint to the end of bar I', q: 'length', unit: 'cm', value: 60 }
      },
      note: 'Bar I is O–A–D; the scale is OD/OA. Put the tracer at P and the pencil at B to reduce by the same factor.'
    },
    {
      name: 'Scale of a plane parallel to the picture',
      expr: 's = D/(z + D)',
      tex: 's = \\frac{D}{z + D}',
      vars: {
        s: { name: 'scale of the picture of the plane' },
        D: { name: 'distance of the eye from the picture plane', q: 'length', unit: 'cm', value: 50 },
        z: { name: 'depth of the plane behind the picture plane', q: 'length', unit: 'cm', value: 100 }
      },
      note: 'The scale at the depth z: one on the picture plane, and the factor by which the pantograph would have to reduce a drawing of that plane.'
    }
  ],
  examples: [
    {
      title: 'Setting the scale',
      q: 'A pantograph has OA = 40 cm and AD = 60 cm. By what factor does it enlarge, and what is the length of the copy of a line 24 mm long?',
      steps: [
        { text: 'The scale:', tex: 'k = \\frac{OD}{OA} = \\frac{40 + 60}{40} = 2.5' },
        'A line of 24 mm is copied as $24 \\times 2.5 = 60$ mm, and every area is multiplied by $2.5^2 = 6.25$.'
      ],
      a: 'The scale is 2.5, so the copy of a 24 mm line is 60 mm long.'
    },
    {
      title: 'A plane in perspective',
      q: 'The eye is 50 cm from the picture plane. A flat sign is parallel to the picture plane and 100 cm behind it. By what factor does the picture of the sign differ from the sign?',
      steps: [
        { text: 'The scale at that depth:', tex: 's = \\frac{50}{100 + 50} = \\frac{1}{3}' }
      ],
      a: 'One third: a pantograph set to reduce by 1:3 would copy the sign exactly as the eye sees it on the picture plane.'
    }
  ],
  quiz: [
    { q: 'In a pantograph with the parallelogram ABCD, which three points stay on one straight line?', choices: ['A, B, C', 'O, B and P (pivot, tracer, pencil)', 'A, D and C', 'O, A and C'], a: 1, why: 'O, B and P are collinear in every pose, and OP = k·OB, with k = OD/OA.' },
    { q: 'OA = 30 cm and AD = 45 cm. What is the scale k of the pantograph?', answer: 2.5, why: 'k = (OA + AD)/OA = 75/30 = 2.5.' },
    { q: 'A pantograph produces the perspective picture of any three-dimensional object.', a: false, why: 'It scales by one factor; the perspective of a flat object parallel to the picture plane is a single scaling, but for objects in depth the scale changes with depth.' },
    { q: 'Wollaston\'s camera lucida lets the draughtsman', choices: ['project the scene on a screen', 'see the scene and the paper superimposed through a prism and trace the scene', 'enlarge a drawing', 'measure distances'], a: 1, why: 'The prism sends the image of the scene to one half of the pupil while the other half sees the paper; the pencil can follow the scene.' }
  ],
  applications: [
    'Engraving machines, sign cutters, map reducers and copying lathes, which are pantographs.',
    'Electric trains and trams: the current collector is called a pantograph from its scissor-shaped, parallelogram frame.',
    'Camera lucida drawing, still used by botanical illustrators and microscopists to trace specimens.',
    'The same ray-keeping idea in digital form: plotting devices and 3-D digitisers that follow a probe and draw the result.'
  ],
  history: 'Christoph Scheiner (1573–1650) invented the pantograph about 1603 and published it in *Pantographice* (Rome, 1631). Brook Taylor\'s *Linear Perspective* (1715) and Johann Heinrich Lambert\'s *Die freye Perspektive* (1759) laid the mathematical foundation on which the perspective instruments of the 18th century were designed. William Hyde Wollaston patented the camera lucida in 1806. In the 19th century such instruments were made in large numbers for art schools and surveyors, and in the 20th the photograph and the computer replaced them.',
  sources: [
    'Christoph Scheiner, *Pantographice, seu ars delineandi res quaslibet per parallelogrammum lineare* (Rome, 1631).',
    'Brook Taylor, *Linear Perspective* (1715); Johann Heinrich Lambert, *Die freye Perspektive* (1759).',
    'Martin Kemp, *The Science of Art* (1990).',
    'Samuel Y. Edgerton, *The Mirror, the Window, and the Telescope* (2009).'
  ],
  construction: 'ph-pantograph',
  sim: 'ph-pantograph'
},

{
  id: 'perspective-in-painting',
  parent: 'perspective-history',
  title: 'Perspective in painting',
  level: 1,
  short: 'An illustrated tour from Masaccio\'s Trinity (about 1427) to Hokusai: the barrel vault in one-point perspective, the lances of Uccello, the treatise of Piero, the pinhole of Vermeer, the marble disc of Pozzo, and the other ways of picturing space.',
  keywords: ['Masaccio', 'Trinity', 'Uccello', 'Piero della Francesca', 'Leonardo', 'Last Supper', 'Vermeer', 'Hokusai', 'Pozzo', 'vanishing point', 'barrel vault', 'quadratura'],
  prereq: ['alberti-construction', 'one-point-perspective', 'brunelleschi-experiment'],
  related: ['durer-devices', 'camera-obscura', 'parallel-perspective-in-art', 'reverse-perspective', 'anamorphosis', 'atmospheric-perspective'],
  body: `Linear perspective was not a rule that all painters adopted at once but a tool that each used in his own way. A tour of famous pictures shows what the rules did in practice, and where the painters went beyond them.

### Masaccio\'s Trinity (about 1427)
In Santa Maria Novella, Florence, Masaccio painted a chapel, its barrel vault, its coffers, a niche with the Trinity and the Cross, as if it were cut into the wall. The picture is in one-point perspective with the vanishing point near the foot of the Cross, at about the eye level of a person standing before the fresco, so that for that person the painted space opens like a real one. The construction below draws the vault\'s scheme: the receding arches are circles, only smaller, and their sizes come from the floor and the distance point.

### Uccello and Piero
Paolo Uccello (1397–1475) filled his battle scenes with orthogonals: broken lances lie along them. Piero della Francesca (about 1415–1492) wrote the first treatise by a painter, *De prospectiva pingendi* (about 1474), with the plan-and-elevation construction of buildings and a human head, and put it to use in the *Flagellation* (about 1460), where the street and the floor pattern are measured out.

### Leonardo and Raphael
In the *Last Supper* (1495–98) Leonardo set the vanishing point at the head of Christ, with a nail hole at that point, the place where he stretched his cords to rule the orthogonals. In the *School of Athens* (1509–11) Raphael put the vanishing point between Plato and Aristotle, at the end of a barrel vault.

### Beyond Italy
Jan van Eyck (the *Arnolfini Portrait*, 1434) found a perspective by observation: the orthogonals of the room converge not on a point but along a short vertical axis. In the Dutch 17th century several of Vermeer\'s interiors have a small pinprick at the vanishing point, from which a string was probably stretched to rule the lines, and the church interiors of Saenredam are constructed from measured plans. In Japan, picture prints in Western perspective (*uki-e*) appeared in the 1740s, and Hokusai used converging lines in his *Thirty-six Views of Mount Fuji* (about 1830–32), alongside the older parallel projection of East Asian painting.

### Ceilings
Ceiling painters took the viewpoint to the extreme. Mantegna\'s oculus in the Camera degli Sposi at Mantua (1465–74) looks up through a painted opening, and Andrea Pozzo\'s ceiling in Sant\'Ignazio in Rome (1685–94) is correct from a **marble disc in the floor** of the nave: from it the painted architecture continues the real one; from anywhere else it leans and bends, like an [[anamorphosis]].

> [!tip] A painting with perspective has a horizon at the eye level of its painter, and often of its viewer: in the Trinity and the Last Supper the vanishing point is at about the height of a person\'s eyes, which is why the picture is hung low.`,
  ideas: [
    'Masaccio\'s Trinity (about 1427) is an early picture with a coherent one-point perspective, its vanishing point at the eye level of a person standing before it.',
    'The receding arches of a barrel vault are circles, only smaller, and their sizes follow from the floor lines and the distance point.',
    'Painters used the construction in their own ways: lances along orthogonals (Uccello), a measured treatise (Piero), a nail at the vanishing point (Leonardo), a pinhole (Vermeer).',
    'Ceiling painters made the viewpoint a place in the floor, and other cultures chose other projections.'
  ],
  pitfalls: [
    'Perspective was adopted by all painters after Brunelleschi — It spread over a century and was resisted, adapted or ignored; Van Eyck found a different way, and East Asian painting kept parallel projection.',
    'The vanishing point is where the painter happens to put it — It is at the horizon, at the eye level of the painter, and usually of the viewer.',
    'Masaccio\'s vault is a plan-and-elevation drawing — The arches are placed by the floor lines and the distance point, a procedure close to Alberti\'s.'
  ],
  formulas: [
    {
      name: 'Scale of the i-th arch of a barrel vault',
      expr: 's = D/(D + i*w)',
      tex: 's_i = \\frac{D}{D + i\\,w}',
      vars: {
        s: { name: 'scale of the arch compared with the front arch' },
        D: { name: 'distance of the eye from the picture plane', q: 'length', unit: 'cm', value: 240 },
        i: { name: 'number of the arch', value: 3, int: true, min: 0, max: 20 },
        w: { name: 'depth of one bay', q: 'length', unit: 'cm', value: 30 }
      },
      note: 'Each arch is a circle of radius s times the front arch, centred on the line from the vanishing point through the centre of the front arch.'
    },
    {
      name: 'The correct viewing distance of a picture',
      expr: 'D = w/(2*tan(theta/2))',
      tex: 'D = \\frac{w}{2\\tan(\\theta/2)}',
      vars: {
        D: { name: 'distance from the eye to the picture', q: 'length', unit: 'm' },
        w: { name: 'width of the picture', q: 'length', unit: 'm', value: 1.5 },
        theta: { name: 'angle of view the perspective was constructed for', q: 'angle', unit: '°', value: 50, min: 10, max: 120, tex: '\\theta' }
      },
      note: 'A picture constructed for the angle θ looks right from this distance; at a greater distance the space seems shallower.'
    }
  ],
  examples: [
    {
      title: 'The third arch of a vault',
      q: 'The front arch of a vault has radius 100 and the eye is 240 from the picture plane. Each bay is 30 deep. What are the radius and the height of the centre of the third arch above the horizon, if the front arch\'s centre is 120 above it?',
      steps: [
        { text: 'The scale:', tex: 's_3 = \\frac{240}{240 + 3\\times 30} = 0.727' },
        'Radius $100 \\times 0.727 = 72.7$; the centre lies on the line from the vanishing point through the front centre, at $120 \\times 0.727 = 87.3$ above the horizon.'
      ],
      a: 'Radius 72.7, centre 87.3 above the horizon: about three quarters of the size of the front arch.'
    },
    {
      title: 'Where to stand',
      q: 'A picture 1.5 m wide was constructed for an angle of view of 50°. From what distance should it be seen?',
      steps: [
        { text: '', tex: 'D = \\frac{1.5}{2\\tan 25°} = 1.61\\ \\text{m}' }
      ],
      a: 'From 1.6 m, a little more than the width of the picture.'
    }
  ],
  quiz: [
    { q: 'Where is the vanishing point in Masaccio\'s Trinity?', choices: ['At the top of the vault', 'Near the foot of the Cross, at about the eye level of a standing viewer', 'At the edge of the fresco', 'There is none'], a: 1, why: 'The orthogonals of the barrel vault converge at about the eye level of a person standing in front of the fresco, so that the painted chapel opens for that viewer.' },
    { q: 'In the Arnolfini Portrait (1434) the orthogonals converge on a single point.', a: false, why: 'Van Eyck\'s orthogonals converge on a short vertical axis, not a point: he used perspective by observation, not by the rule.' },
    { q: 'The eye is 240 from the picture plane and each bay of a vault is 30 deep. What is the scale of the fourth arch?', answer: 0.667, why: 's₄ = 240/(240 + 4 × 30) = 240/360 = 0.667.' },
    { q: 'Why is there a marble disc in the nave of Sant\'Ignazio?', choices: ['It marks a tomb', 'It marks the one place from which the painted ceiling is correct', 'It marks the centre of the church', 'It supports a column'], a: 1, why: 'Pozzo\'s ceiling is a projection from that point, so it looks right only from the disc.' }
  ],
  applications: [
    'Reading and dating pictures: the vanishing point, the horizon and the distance point reveal the viewpoint the painter had in mind and whether the picture was constructed.',
    'Reconstructing lost or damaged paintings and sets from their perspective, and computer models of painted architecture such as the Trinity vault.',
    'Hanging and lighting: the vanishing point at the eye level of the viewer decides how low a picture should be hung.',
    'Film and photography composition, where the horizon and vanishing point are chosen in the same way.'
  ],
  history: 'Masaccio (1401–1428) painted the Trinity about 1427. Paolo Uccello worked in Florence and Venice; Piero della Francesca wrote *De prospectiva pingendi* (about 1474) and painted the *Flagellation* (about 1460). Leonardo\'s *Last Supper* dates from 1495–98 and Raphael\'s *School of Athens* from 1509–11. Pozzo\'s Sant\'Ignazio ceiling was painted in 1685–94. The Japanese *uki-e* (floating pictures) appear in the 1740s; Hokusai\'s *Thirty-six Views of Mount Fuji* dates from about 1830–32. Panofsky (1927), White (1957) and Kemp (1990) tell the history in detail.',
  sources: [
    'Piero della Francesca, *De prospectiva pingendi* (about 1474).',
    'John White, *The Birth and Rebirth of Pictorial Space* (1957).',
    'Martin Kemp, *The Science of Art* (1990).',
    'Erwin Panofsky, *Perspective as Symbolic Form* (1927; English translation 1991).'
  ],
  construction: 'ph-masaccio-vault'
}
);
