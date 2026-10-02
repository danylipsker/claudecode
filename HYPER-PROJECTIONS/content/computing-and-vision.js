/* HYPER-PROJECTIONS · content/computing-and-vision.js — Projections at Work: computing and vision.
 *
 *   3d-graphics-pipeline, opengl-projection-matrices, depth-buffers-and-clipping, shadow-maps-and-projective-textures,
 *   game-cameras, camera-calibration-and-homography, photogrammetry, augmented-and-virtual-reality
 * Each page is a use page: which projection the practice relies on, why that one, the numbers, a worked case, what goes
 * wrong with the wrong projection, and a construction or a simulation (sims/computing-and-vision.js,
 * constructions/computing-and-vision.js).
 */
Hyper.add(
{
  id: '3d-graphics-pipeline',
  parent: 'computing-and-vision',
  title: 'The 3-D graphics pipeline',
  level: 1,
  short: 'Every corner of every triangle in a 3-D scene is carried through five spaces — model, world, camera, clip, window — by a chain of matrices and one division. The picture is what lands in the last of them.',
  keywords: ['graphics pipeline', 'model matrix', 'view matrix', 'projection matrix', 'clip space', 'NDC', 'viewport', 'perspective divide', 'rasterisation', 'vertex shader', 'GPU', 'MVP'],
  prereq: ['the-camera-model', 'composing-transformations', 'the-perspective-matrix'],
  related: ['opengl-projection-matrices', 'depth-buffers-and-clipping', 'homogeneous-coordinates', 'game-cameras'],
  body: `A game draws a million triangles sixty times a second, and every corner of every triangle makes the same short journey. The journey is a chain of the transformations this app is about: coordinate changes (the 4 × 4 matrices of [[the-4x4-matrix]]), then one perspective projection, then one division, then a scaling to pixels. Understanding it is understanding why a graphics card is, at heart, a machine for multiplying 4 × 4 matrices and filling straight-edged polygons.

### The five spaces
1. **Model space** — the numbers the artist typed: a cube from −1 to +1 about its own centre.
2. **World space** — the whole scene in one coordinate system. The **model matrix** $M$ moves, turns and scales each object into it.
3. **Camera (eye, view) space** — the world re-measured from the eye: the eye at the origin, looking down $-z$, with $y$ up. The **view matrix** $V$ is the inverse of the camera's own placement, built with a look-at ([[the-camera-model]]).
4. **Clip space** — the **projection matrix** $P$ turns the viewing frustum into a box, in homogeneous coordinates: a point is on screen when $-w \\le x, y, z \\le w$ ([[opengl-projection-matrices]]).
5. **Window space** — the **perspective divide** ($x/w$, $y/w$, $z/w$) gives normalised device coordinates in the cube $[-1, 1]^3$; the **viewport transform** stretches the cube's face onto the pixel grid and its depth onto the depth buffer's $[0, 1]$.

$$\\mathbf p_{\\text{clip}} = P\\,V\\,M\\,\\mathbf p_{\\text{model}}, \\qquad \\mathbf p_{\\text{ndc}} = \\frac{\\mathbf p_{\\text{clip}}}{w_{\\text{clip}}}, \\qquad x_{\\text{win}} = \\tfrac{W}{2}\\,(1 + x_{\\text{ndc}}).$$

The division is the only non-linear step. Everything before it is a matrix product, so $P V M$ is multiplied out once per object and applied to its million vertices. Because a projective map sends straight lines to straight lines, a triangle stays a triangle, and the rasteriser only ever has to fill polygons with straight edges.

### What happens around the matrices
The **vertex shader** does the product. **Clipping** trims triangles against the six faces of the clip box ([[depth-buffers-and-clipping]]). After the divide and the viewport transform the **rasteriser** finds the pixels each triangle covers, and the **fragment shader** colours them, using textures and shadows ([[shadow-maps-and-projective-textures]]). The **depth test** keeps the nearest.

Perspective hides one trap here. Across a triangle on screen, the *depth* $z$ and the texture coordinate $u$ do not vary linearly — their reciprocals $1/z$ and $u/z$ do. A rasteriser therefore interpolates $u/w$ and $1/w$ and divides per pixel (*perspective-correct interpolation*). Early consoles skipped it, and their floor textures wobbled.

### Conventions that cause bugs
OpenGL stores matrices column by column and multiplies column vectors on the right, so the product reads right to left, $PVM\\mathbf p$. Direct3D tradition writes row vectors, $\\mathbf p\\,M V P$ — the same numbers transposed. Eye space is right-handed with the camera looking down $-z$; NDC is left-handed (z grows into the screen). Vulkan's NDC has $y$ pointing down and $z$ running from 0 to 1.

> [!tip] The construction below carries one point through all five spaces with its numbers. Do it once by hand and the shader code stops being magic.`,
  ideas: [
    'Model → world → camera → clip → window: three matrices (M, V, P), one division by w, one viewport scaling.',
    'Only the divide by w is non-linear, so the three matrices are multiplied once per object and applied to every vertex.',
    'A projective map keeps lines straight, so triangles stay triangles and the GPU only fills straight-edged polygons.',
    'Depth and texture coordinates are not linear on the screen but 1/z and u/z are, hence perspective-correct interpolation.'
  ],
  pitfalls: [
    'The projection matrix already gives pixel positions — It gives clip coordinates. Only after the division by w and the viewport transform do you have pixels.',
    'The view matrix moves the camera — It moves the whole world the opposite way. It is the inverse of the camera\'s placement matrix, not the placement itself.',
    'Multiplying the matrices in any order works — Matrix products do not commute. With column vectors the order is P · V · M, and M acts first.'
  ],
  formulas: [
    {
      name: 'Window x from clip coordinates',
      expr: 'xw = W/2*(1 + xc/wc)',
      tex: 'x_{\\text{win}} = \\frac{W}{2}\\left(1 + \\frac{x_c}{w_c}\\right)',
      vars: {
        xw: { name: 'x in pixels', unit: 'px', tex: 'x_{\\text{win}}' },
        W: { name: 'viewport width', unit: 'px', value: 1200 },
        xc: { name: 'clip-space x', value: 1.1547, signed: true, tex: 'x_c' },
        wc: { name: 'clip-space w', value: 4, tex: 'w_c' }
      },
      solveFor: 'xw',
      note: 'The viewport transform after the perspective divide. A point is on screen when the clip x lies between −w and +w, i.e. when the fraction is between −1 and 1.'
    },
    {
      name: 'Normalised x of a point in front of a symmetric camera',
      expr: 'xn = x/(a*d*tan(fov/2))',
      tex: 'x_{\\text{ndc}} = \\frac{x}{a\\,d\\,\\tan(\\theta/2)}',
      vars: {
        xn: { name: 'x in NDC (−1 at the left edge, +1 at the right)', signed: true, tex: 'x_{\\text{ndc}}' },
        x: { name: 'x in camera space', q: 'length', unit: 'm', value: 1, signed: true },
        a: { name: 'aspect ratio (width / height)', value: 1.5 },
        d: { name: 'distance in front of the eye (−z)', q: 'length', unit: 'm', value: 4 },
        fov: { name: 'vertical field of view', q: 'angle', unit: '°', value: 60, min: 10, max: 170, tex: '\\theta' }
      },
      solveFor: 'xn',
      note: 'The first row of the projection matrix divided by w = −z. At distance d the frustum is a·d·tan(θ/2) wide on each side of the axis.'
    }
  ],
  examples: [{
    title: 'One corner through the pipeline',
    q: 'A cube of side 2 (model coordinates from −1 to 1) is placed 1 unit up by its model matrix. The camera is at (0, 1, 5) looking down −z with a vertical field of view of 60°, aspect 1.5, near plane 1, far plane 10. Where does the corner $(1, 1, 1)$ land on a 1200 × 800 window?',
    steps: [
      'Model → world: $M$ translates by $(0, 1, 0)$, so the corner is at $(1, 2, 1)$.',
      'World → camera: the eye is at $(0, 1, 5)$ looking down $-z$, so $V$ subtracts it: $(1, 1, -4)$. The corner is 4 units in front of the eye.',
      { text: 'Projection: $\\cot 30° = 1.7321$, so the first two rows scale $x$ by $1.7321/1.5 = 1.1547$ and $y$ by $1.7321$; the third row gives $-\\tfrac{11}{9}(-4) - \\tfrac{20}{9}$; the fourth copies $-z$ into $w$.', tex: '(x_c, y_c, z_c, w_c) = (1.1547,\\; 1.7321,\\; 2.6667,\\; 4)' },
      { text: 'Divide by $w = 4$:', tex: '(x_{\\text{ndc}}, y_{\\text{ndc}}, z_{\\text{ndc}}) = (0.2887,\\; 0.4330,\\; 0.6667)' },
      'Viewport (y downwards): $x_{\\text{win}} = 600\\,(1 + 0.2887) = 773.2$, $y_{\\text{win}} = 400\\,(1 - 0.4330) = 226.8$, and the stored depth is $(0.6667 + 1)/2 = 0.8333$.'
    ],
    a: 'The corner is drawn at pixel (773, 227) with depth 0.833 — a point inside the clip box, so it is not clipped.'
  }],
  quiz: [
    { q: 'Which single step of the pipeline is not a matrix product?', choices: ['The model matrix', 'The view matrix', 'The division by w', 'The projection matrix'], a: 2, why: 'Everything up to clip space is linear in homogeneous coordinates. Dividing by w is what makes far things smaller, and it is the only non-linear step.' },
    { q: 'With column vectors, which product takes a model-space point to clip space?', choices: ['$M\\,V\\,P\\,\\mathbf p$', '$P\\,V\\,M\\,\\mathbf p$', '$V\\,P\\,M\\,\\mathbf p$', '$P\\,M\\,V\\,\\mathbf p$'], a: 1, why: 'The matrix next to the point acts first: M places the object in the world, V re-measures the world from the eye, P squeezes the view into the clip box.' },
    { q: 'A point at eye-space $z = -8$ is seen through a standard OpenGL perspective matrix. What is its clip-space $w$?', answer: 8, why: 'The last row of the matrix is (0, 0, −1, 0), so w = −z = 8: the distance in front of the eye.' },
    { q: 'A point with clip coordinates $(3, 0, 1, 2)$ is inside the view volume.', a: false, why: 'It is visible only if −w ≤ x ≤ w. Here x = 3 exceeds w = 2, so the point is off the right side of the screen and will be clipped.' },
    { q: 'A rasteriser interpolates a texture coordinate linearly across the screen, without the division by w. What does the viewer see on a floor receding into the distance?', choices: ['Nothing unusual', 'The texture swims and bends — it is an affine, not a projective, mapping', 'The texture is mirrored', 'The floor disappears'], a: 1, why: 'On the screen u is not a linear function of position; only u/w and 1/w are. Without the correction the texture is mapped affinely — the wobble of early 3-D consoles.' }
  ],
  applications: [
    'Real-time games and simulators: the vertex shader of every renderer runs P·V·M. The reason it is a projective transformation: lines stay lines, so triangles stay triangles and the hardware only has to fill polygons.',
    'CAD and modelling viewports: the same chain with an orthographic P, so that parallel edges stay parallel and a part can be judged by eye.',
    'Web pages: the CSS declaration perspective(600px) is a projection matrix whose only change from the identity is an entry −1/600 in the last row, so elements rotated in 3-D shrink with distance.',
    'Offline renderers and film: ray tracers skip the pipeline but build their camera rays from the same view and projection matrices, so a scene can be previewed in real time and rendered later without the camera moving.'
  ],
  history: 'Larry Roberts introduced 4 × 4 homogeneous matrices into computer graphics in his 1963 MIT thesis, and Ivan Sutherland\'s Sketchpad (1963) and head-mounted display (1968) made the pipeline interactive. Sutherland and Hodgman published polygon clipping in 1974, the same year Edwin Catmull and Wolfgang Straßer devised the depth buffer. James Clark\'s Geometry Engine (1982) put the matrix chain into silicon, SGI\'s IRIS GL grew into OpenGL 1.0 in 1992, Direct3D arrived in 1995, programmable shaders around 2001, and Vulkan in 2016.',
  sources: ['Tomas Akenine-Möller, Eric Haines and Naty Hoffman, *Real-Time Rendering*, 4th ed. (2018), chapter 2 "The Graphics Rendering Pipeline" and chapter 4 "Transforms".', 'The Khronos Group, *OpenGL 4.6 Core Profile Specification*, the chapter on fixed-function vertex post-processing (clipping, coordinate transformations).', 'James D. Foley, Andries van Dam, Steven Feiner and John Hughes, *Computer Graphics: Principles and Practice*, 2nd ed. (1990), the chapters on viewing in three dimensions.'],
  sim: 'cv-pipeline-stages',
  construction: 'cv-pipeline-spaces'
},

{
  id: 'opengl-projection-matrices',
  parent: 'computing-and-vision',
  title: 'The OpenGL and Vulkan projection matrices',
  level: 2,
  short: 'The 4 × 4 matrices that squeeze the viewing frustum, or the viewing box, into the clip cube: where each entry comes from, what changes between OpenGL, Direct3D and Vulkan, and why the depth row looks the way it does.',
  keywords: ['glFrustum', 'gluPerspective', 'glOrtho', 'frustum', 'field of view', 'aspect ratio', 'near plane', 'far plane', 'clip space', 'Vulkan', 'Direct3D', 'reverse-Z', 'off-axis'],
  prereq: ['the-perspective-matrix', 'the-camera-model', '3d-graphics-pipeline'],
  related: ['depth-buffers-and-clipping', 'field-of-view-and-focal-length', 'augmented-and-virtual-reality', 'math:matrices'],
  body: `The projection matrix does two jobs in one product. It shapes the *picture*: the first two rows scale $x$ and $y$ so that the edges of the field of view land on $\\pm w$. And it shapes the *depth*: the third row maps the distance between the near and far planes onto the range of the depth buffer. The fourth row, $(0, 0, -1, 0)$, copies $-z$ into $w$, which is the whole of perspective.

### The matrix from the frustum
The visible volume is a truncated pyramid with near plane at distance $n$, far plane at $f$, and a near-plane window from $l$ to $r$ and $b$ to $t$. Requiring $x = l, r$ to land on $\\mp 1$ after the division, and the same for $y$, gives $\\mathtt{glFrustum}$:
$$P = \\begin{bmatrix} \\dfrac{2n}{r-l} & 0 & \\dfrac{r+l}{r-l} & 0 \\\\ 0 & \\dfrac{2n}{t-b} & \\dfrac{t+b}{t-b} & 0 \\\\ 0 & 0 & -\\dfrac{f+n}{f-n} & -\\dfrac{2fn}{f-n} \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}.$$
Choose a symmetric window from a vertical field of view $\\theta$ and an aspect ratio $a$ and it becomes the familiar $\\mathtt{gluPerspective}$, with $\\cot(\\theta/2)/a$ and $\\cot(\\theta/2)$ on the diagonal. With $\\theta = 60°$, $a = 16/9$, $n = 0.1$, $f = 100$ the entries are $0.9743$, $1.7321$, $-1.0020$ and $-0.2002$.

### The depth row
Write the third and fourth rows as $z_c = A z + B$, $w_c = -z$, and demand $z_{\\text{ndc}} = -1$ at $z = -n$ and $+1$ at $z = -f$. That fixes $A = -(f+n)/(f-n)$ and $B = -2fn/(f-n)$, and a point at distance $d$ gets
$$z_{\\text{ndc}} = \\frac{f+n}{f-n} - \\frac{2fn}{(f-n)\\,d}.$$
Depth is a function of $1/d$, not of $d$ — the reason, and the price, are on the next page ([[depth-buffers-and-clipping]]).

### The orthographic matrix
The box $[l, r] \\times [b, t] \\times [n, f]$ goes to the cube by scaling and translating only; the last row is $(0, 0, 0, 1)$, $w$ stays 1, and depth is linear: $\\mathtt{glOrtho}$ has $2/(r-l)$, $2/(t-b)$, $-2/(f-n)$ on the diagonal. Nothing shrinks with distance — the matrix of [[game-cameras]] and of CAD views.

### OpenGL, Direct3D, Vulkan
OpenGL's clip cube has $z \\in [-1, 1]$. Direct3D, Metal and Vulkan use $z \\in [0, 1]$, which changes the third row to $\\bigl(0, 0, \\tfrac{f}{n-f}, \\tfrac{nf}{n-f}\\bigr)$ in a right-handed setup; Vulkan also has $y$ pointing down in its NDC, so the second row is negated. **Reverse-Z** swaps the roles of near and far, so that the near plane lands on 1; with a floating-point depth buffer this spreads the precision evenly ([[depth-buffers-and-clipping]]).

### Off-axis frusta
Make $l \\ne -r$ and the picture is *off-axis*: the optical axis no longer passes through the middle of the window. It is how a stereo pair is rendered for a headset (each eye looks through the same window from its own position), how a lens-shift camera is imitated, and how a real camera's principal point is reproduced in augmented reality ([[augmented-and-virtual-reality]]).

> [!fact] Because the whole frustum is one matrix, its near plane can be replaced by any plane — a mirror, a water surface — by editing the third row (Lengyel's oblique near-plane clipping). One matrix keeps the geometry behind the mirror from ever being drawn.`,
  ideas: [
    'Rows 1 and 2 scale x and y so the field-of-view edges land on ±w; row 4 copies −z into w, which is perspective itself.',
    'Row 3 sets z_ndc = A + B/d from the two conditions z = −1 at the near plane and +1 at the far plane: depth is a function of 1/d.',
    'The orthographic matrix only scales and translates, keeps w = 1 and keeps depth linear.',
    'OpenGL: z in [−1, 1]. Direct3D, Metal, Vulkan: z in [0, 1], and Vulkan has y down. Reverse-Z swaps near and far.',
    'An off-axis frustum (l ≠ −r) is how stereo, lens shift and a camera\'s principal point are rendered.'
  ],
  pitfalls: [
    'The field of view is a property of the camera alone — It is the field of view for a given window shape. Fix the vertical angle and widen the aspect ratio from 4:3 to 16:9 and the horizontal angle grows from 75° to 91.5°; "FOV 90" can mean either.',
    'Depth runs linearly from the near to the far plane — Through a perspective matrix it does not: z_ndc is a function of 1/d, so most of its range is used up close to the near plane.',
    'The same matrix works in every API — Pasting an OpenGL matrix into Vulkan gives a picture upside down and a depth range half clipped away. The conversion is a flip in row 2 and a rescale in row 3.'
  ],
  formulas: [
    {
      name: 'Depth in normalised device coordinates',
      expr: 'zn = (f + n)/(f - n) - 2*f*n/((f - n)*d)',
      tex: 'z_{\\text{ndc}} = \\frac{f+n}{f-n} - \\frac{2fn}{(f-n)\\,d}',
      vars: {
        zn: { name: 'depth in NDC (−1 at the near plane, +1 at the far)', signed: true, tex: 'z_{\\text{ndc}}' },
        f: { name: 'far plane distance', q: 'length', unit: 'm', value: 100 },
        n: { name: 'near plane distance', q: 'length', unit: 'm', value: 0.1 },
        d: { name: 'distance of the point in front of the eye', q: 'length', unit: 'm', value: 1 }
      },
      solveFor: 'zn',
      note: 'The OpenGL convention. At d = n it gives −1, at d = f it gives +1; with n = 0.1 and f = 100 a point only 1 m away is already at 0.80.'
    },
    {
      name: 'Horizontal field of view from the vertical one',
      expr: 'fh = 2*atan(a*tan(fv/2))',
      tex: '\\theta_h = 2\\arctan\\!\\left(a\\,\\tan\\frac{\\theta_v}{2}\\right)',
      vars: {
        fh: { name: 'horizontal field of view', q: 'angle', unit: '°', tex: '\\theta_h' },
        fv: { name: 'vertical field of view', q: 'angle', unit: '°', value: 60, min: 5, max: 170, tex: '\\theta_v' },
        a: { name: 'aspect ratio (width / height)', value: 1.7778, min: 0.2, max: 6 }
      },
      solveFor: 'fh',
      note: 'The half-widths of the window at any distance are in the ratio a : 1, but angles are not. 60° vertical at 16:9 is 91.5° horizontal; at 4:3 it is 75.2°.'
    },
    {
      name: 'Half-height of the frustum at a distance',
      expr: 'h = d*tan(fv/2)',
      tex: 'h = d\\,\\tan\\frac{\\theta_v}{2}',
      vars: {
        h: { name: 'half-height of the visible window', q: 'length', unit: 'm' },
        d: { name: 'distance in front of the eye', q: 'length', unit: 'm', value: 10 },
        fv: { name: 'vertical field of view', q: 'angle', unit: '°', value: 60, min: 5, max: 170, tex: '\\theta_v' }
      },
      solveFor: 'h',
      note: 'The frustum is a wedge: its size grows in proportion to the distance. At 10 m a 60° view sees a strip 11.5 m high.'
    }
  ],
  examples: [{
    title: 'Which depth value does the floor get?',
    q: 'A perspective projection has near plane 0.1 m and far plane 100 m. The depth buffer stores the window depth $(z_{\\text{ndc}} + 1)/2$. What depth is stored for a surface 1 m away, 10 m away and 50 m away?',
    steps: [
      { text: 'Use the NDC depth formula with $f = 100$, $n = 0.1$: the constants are $\\tfrac{f+n}{f-n} = 1.002002$ and $\\tfrac{2fn}{f-n} = 0.200200$.', tex: 'z_{\\text{ndc}}(d) = 1.002002 - \\frac{0.200200}{d}' },
      '$d = 1$: $z_{\\text{ndc}} = 0.8018$, stored depth $0.9009$.',
      '$d = 10$: $z_{\\text{ndc}} = 0.9820$, stored depth $0.9910$.',
      '$d = 50$: $z_{\\text{ndc}} = 0.9980$, stored depth $0.9990$.'
    ],
    a: 'The depths are 0.901, 0.991 and 0.999: the whole range from 1 m to 100 m is squeezed into the last 10 % of the buffer.'
  }],
  quiz: [
    { q: 'Which entry of a perspective matrix is responsible for far things looking smaller?', choices: ['The 1,1 entry, cot(θ/2)/a', 'The −1 in the last row, which copies −z into w', 'The 3,3 entry, −(f+n)/(f−n)', 'The 3,4 entry, −2fn/(f−n)'], a: 1, why: 'The division by w = −z is what shrinks distant things. The other entries only decide the scale of x and y and the layout of depth.' },
    { q: 'The vertical field of view stays 60° while the window changes from 4:3 to 16:9. The horizontal field of view', choices: ['stays the same', 'narrows', 'widens, from about 75° to 91°', 'doubles'], a: 2, why: 'tan(θh/2) = a tan(θv/2): the aspect ratio multiplies the tangent, so the angle grows (75.2° at 4:3, 91.5° at 16:9).' },
    { q: 'In OpenGL\'s normalised device coordinates the near plane is at z = +1.', a: false, why: 'OpenGL maps the near plane to −1 and the far plane to +1. Direct3D, Metal and Vulkan map them to 0 and 1.' },
    { q: 'A vertical field of view of $2\\arctan(0.5) = 53.13°$ is used with aspect ratio 2. What is the horizontal field of view in degrees?', answer: 90, unit: '°', why: 'tan(θh/2) = a · tan(θv/2) = 2 × 0.5 = 1, so θh/2 = 45°.' },
    { q: 'What is true of the orthographic matrix glOrtho?', choices: ['It makes w proportional to distance', 'It leaves w equal to 1, so depth is linear and nothing shrinks', 'It has the same fourth row as the perspective matrix', 'It cannot be inverted'], a: 1, why: 'The box is mapped to the cube by scaling and translation alone, so the fourth row stays (0, 0, 0, 1) and the division changes nothing.' }
  ],
  applications: [
    'Engines and APIs: every renderer builds this matrix once per camera per frame; the choice of near and far planes is the one number an artist is expected to tune ([[depth-buffers-and-clipping]]).',
    'Stereo and VR headsets: each eye gets its own off-axis frustum through the same window, so the two pictures fuse without toe-in distortion.',
    'Planar reflections and portals: editing the near-plane row of P to coincide with the mirror clips away everything behind it at no extra cost.',
    'CAD, UI and 2-D games: an orthographic matrix with the window set to the pixel grid makes a screen coordinate the same as a world coordinate.'
  ],
  history: 'The 4 × 4 form comes from Larry Roberts\'s homogeneous coordinates (1963). IRIS GL at Silicon Graphics supplied the functions that OpenGL 1.0 standardised in 1992 as glFrustum, glOrtho and (in the GLU library) gluPerspective; Direct3D (1995) chose a left-handed system and a depth range of 0 to 1, a range that Metal and Vulkan share. Reverse-Z and the infinite far plane became common practice once floating-point depth buffers were widespread, in the late 2000s.',
  sources: ['The Khronos Group, *OpenGL 4.6 Core Profile Specification*, the chapter on fixed-function vertex post-processing; and the Vulkan specification, the section on coordinate systems (the Vulkan viewport transformation).', 'Tomas Akenine-Möller, Eric Haines and Naty Hoffman, *Real-Time Rendering*, 4th ed. (2018), chapter 4, the sections on orthographic and perspective projection.', 'Eric Lengyel, "Oblique View Frustum Depth Projection and Clipping", *Journal of Game Development* 1(2), 2005.'],
  sim: 'cv-frustum-ndc',
  construction: 'cv-frustum-to-cube'
},

{
  id: 'depth-buffers-and-clipping',
  parent: 'computing-and-vision',
  title: 'Depth, clipping and the near plane',
  level: 2,
  short: 'Perspective stores depth as a function of 1/distance, so almost all the depth buffer is spent near the camera. That is why a near plane exists, why distant surfaces flicker (z-fighting), and why clipping happens before the division.',
  keywords: ['z-buffer', 'depth buffer', 'z-fighting', 'near plane', 'far plane', 'clipping', 'Sutherland-Hodgman', 'reverse-Z', 'depth precision', 'homogeneous clipping', 'w-buffer'],
  prereq: ['opengl-projection-matrices', '3d-graphics-pipeline', 'points-at-infinity'],
  related: ['shadow-maps-and-projective-textures', 'the-perspective-matrix', 'foreshortening'],
  body: `The depth buffer keeps, for every pixel, the distance of the nearest surface drawn there so far; a new fragment is kept only if it is nearer. Simple and exact in principle — but the number stored is not the distance. After the perspective matrix and the division it is
$$z_w = \\frac{f}{f-n}\\left(1 - \\frac{n}{d}\\right) \\in [0, 1],$$
a function of $1/d$. This is not a flaw but a necessity: across a flat triangle on the screen, $1/d$ varies *linearly* (the same fact as perspective-correct texturing, [[3d-graphics-pipeline]]), so the rasteriser can step the depth along a scan line by adding a constant. A depth that was linear in $d$ would need a division per pixel.

### Where the precision goes
The price is that the buffer's steps are wildly unequal. The fraction $p$ of the whole depth range that is used up by distance $d$ is $p = z_w(d)$; solving for the distance,
$$d_p = \\frac{n f}{f - p\\,(f - n)},$$
and for $f \\gg n$, half of all depth values lie within $2n$ of the eye, and nine tenths within about $10n$. With $n = 0.1$ m and $f = 1000$ m, 99 % of the values are spent in the first 10 m.

A $b$-bit fixed-point buffer cannot tell two distances apart that differ by less than
$$\\Delta d \\approx \\frac{(f-n)\\,d^{2}}{f\\,n\\,2^{b}} \\;\\approx\\; \\frac{d^2}{n\\,2^b}.$$
The resolution worsens as the *square* of the distance and improves in proportion to $n$. At 24 bits with $n = 0.1$ m it is 0.06 mm at 10 m, 6 mm at 100 m and 0.6 m at 1 km. Two surfaces closer than that, such as a decal on a wall or a road marking, win the depth test pixel by pixel in an irregular pattern: **z-fighting**, a shimmering pattern that changes as the camera moves.

### What to do
- **Push the near plane out.** Moving $n$ from 0.1 to 1 improves everything by ten; the far plane hardly matters. The classic error is $n = 0.001$ "to be safe".
- **Reverse-Z with a floating-point buffer.** Map the near plane to 1 and the far plane to 0: $z_w = n/d$ with an infinite far plane. A float's precision is relative, so it is rich near zero, where the hyperbola now sends the far distances, and the two inequalities almost cancel.
- **Logarithmic depth**, or a **w-buffer** storing a linear function of $d$ directly, at the cost of per-pixel arithmetic.

### Clipping, before the division
At the eye itself $w = -z = 0$, and the division blows up; behind the eye $w < 0$ and the picture would be turned upside down. So the near plane is not a convenience but a necessity: triangles are cut against it *in clip space*, before the division, using the six inequalities $-w \\le x, y, z \\le w$ (Blinn and Newell, 1978). Each plane is cut by the Sutherland–Hodgman method: walk round the polygon, keep the inside vertices and insert a new vertex on every crossing edge. A triangle cut once becomes a quadrilateral, drawn as two triangles. Real GPUs clip only against the near and far planes, and let the rasteriser discard the rest (the *guard band*).

> [!warn] Moving the near plane out cuts the picture: anything nearer than $n$ vanishes. In a first-person game that means a wall that disappears when the player leans into it.`,
  ideas: [
    'Window depth is a function of 1/d because 1/d is linear across a triangle on the screen: the rasteriser can interpolate it cheaply.',
    'Half of the depth values lie within 2n of the camera; at 24 bits the resolution is about d²/(n·2²⁴), worse with the square of the distance.',
    'Z-fighting happens when two surfaces are closer together than the depth resolution at their distance.',
    'The near plane cannot be dropped: w = 0 at the eye. Clipping is done in clip space, before the division, against −w ≤ x, y, z ≤ w.',
    'Cures: a larger near plane; reverse-Z with a float depth buffer; logarithmic depth.'
  ],
  pitfalls: [
    'A far plane at infinity ruins the precision — The far plane hardly enters: for f ≫ n the resolution depends on n, d and the number of bits. Reverse-Z with an infinite far plane is standard.',
    'Depth buffer values are distances — They are 1/d-like numbers. Read a depth texture without converting back, and a surface 5 m away and one 500 m away differ in the fifth decimal place.',
    'Clipping can wait until after the division — Behind the eye w is negative, the division flips signs, and a point behind the camera lands on the screen. That is why clipping happens in clip space.'
  ],
  formulas: [
    {
      name: 'Window depth',
      expr: 'zw = f/(f - n)*(1 - n/d)',
      tex: 'z_w = \\frac{f}{f-n}\\left(1 - \\frac{n}{d}\\right)',
      vars: {
        zw: { name: 'stored depth (0 at the near plane, 1 at the far)', tex: 'z_w' },
        f: { name: 'far plane distance', q: 'length', unit: 'm', value: 1000 },
        n: { name: 'near plane distance', q: 'length', unit: 'm', value: 0.1 },
        d: { name: 'distance of the surface', q: 'length', unit: 'm', value: 10 }
      },
      solveFor: 'zw',
      note: 'Depth in the 0 to 1 convention of Direct3D and Vulkan (OpenGL\'s window depth is the same after its own conversion). With n = 0.1 and f = 1000, a surface 10 m away already has depth 0.99.'
    },
    {
      name: 'Smallest resolvable distance step',
      expr: 'dd = (f - n)*d^2/(f*n*2^b)',
      tex: '\\Delta d = \\frac{(f-n)\\,d^2}{f\\,n\\,2^{b}}',
      vars: {
        dd: { name: 'depth resolution at that distance', q: 'length', unit: 'm', tex: '\\Delta d' },
        f: { name: 'far plane distance', q: 'length', unit: 'm', value: 1000 },
        n: { name: 'near plane distance', q: 'length', unit: 'm', value: 0.1 },
        d: { name: 'distance of the surfaces', q: 'length', unit: 'm', value: 100 },
        b: { name: 'bits of the fixed-point depth buffer', value: 24, int: true, min: 8, max: 32 }
      },
      solveFor: 'dd',
      note: 'One least-significant step of the buffer, converted back to distance. Surfaces closer than this fight. With 24 bits, n = 0.1 m and d = 100 m: 6 mm.'
    },
    {
      name: 'Distance at which a share of the depth range is used up',
      expr: 'dp = n*f/(f - p*(f - n))',
      tex: 'd_p = \\frac{n\\,f}{f - p\\,(f-n)}',
      vars: {
        dp: { name: 'distance holding the first share p of the range', q: 'length', unit: 'm', tex: 'd_p' },
        n: { name: 'near plane distance', q: 'length', unit: 'm', value: 0.1 },
        f: { name: 'far plane distance', q: 'length', unit: 'm', value: 1000 },
        p: { name: 'share of the depth range (0 to 1)', value: 0.9, min: 0, max: 0.9999 }
      },
      solveFor: 'dp',
      note: 'With n = 0.1 m and f = 1000 m, half of the depth range ends at 0.2 m and 90 % at 1 m.'
    }
  ],
  examples: [{
    title: 'The decal that flickers',
    q: 'A road marking is drawn 5 mm above the tarmac. The camera has $n = 0.1$ m and $f = 1000$ m and a 24-bit depth buffer. At what distance does the marking start to z-fight, and what does moving the near plane to 1 m do?',
    steps: [
      { text: 'Solve $\\Delta d = 0.005$ m for $d$ in the resolution formula:', tex: 'd = \\sqrt{\\frac{\\Delta d\\; f\\,n\\,2^{24}}{f-n}} = \\sqrt{\\frac{0.005 \\times 100 \\times 16\\,777\\,216}{999.9}} = 91.6\\ \\text{m}' },
      'Beyond about 92 m the buffer cannot separate the marking from the road, and it flickers.',
      'With $n = 1$ m the denominator $f n$ is ten times larger, so $d = \\sqrt{10} \\times 91.6 = 290$ m: the flicker begins three times farther away.'
    ],
    a: 'The marking fights beyond about 92 m; with the near plane at 1 m it holds out to about 290 m.'
  }],
  quiz: [
    { q: 'Why does a perspective projection store depth as a function of 1/d rather than d?', choices: ['Because computers divide faster than they add', 'Because 1/d varies linearly across a triangle on the screen, so depth can be interpolated by adding a constant', 'Because distant objects need more precision', 'Because the far plane is at infinity'], a: 1, why: 'A plane in the scene is a plane in NDC, and across it 1/z is linear in screen position. The hyperbolic mapping is exactly what makes the interpolation cheap and exact.' },
    { q: 'With a near plane of 0.5 m, and a far plane much larger, about how far from the eye does half the depth range end?', answer: 1, unit: 'm', why: 'd = 2nf/(f+n) ≈ 2n = 1 m for f ≫ n.' },
    { q: 'You move the near plane from 0.1 m to 1 m, keeping the far plane at 1 km. How does the depth resolution at a fixed distance change?', choices: ['It gets ten times finer', 'It gets ten times coarser', 'It does not change', 'It gets a hundred times finer'], a: 0, why: 'Δd ≈ d²/(n 2^b): it is inversely proportional to n.' },
    { q: 'Clipping against the near plane can safely be done after the perspective division.', a: false, why: 'Behind the eye w is negative and at the eye it is zero, so the division gives wrong signs or infinity. Triangles are clipped in clip space, against −w ≤ z ≤ w.' },
    { q: 'Reverse-Z with a floating-point depth buffer is better than the usual mapping mainly because', choices: ['it makes depth linear in distance', 'a float has the most precision near zero, where the far distances now land, which balances the hyperbola', 'it removes the need for a far plane in every case', 'it halves the memory'], a: 1, why: 'The hyperbolic mapping crowds the far distances towards 1, where a float is coarse. Flipping it puts them near 0, where a float is fine.' }
  ],
  applications: [
    'Every real-time renderer: the z-buffer decides visibility without sorting triangles, and its near-plane setting is the first thing a graphics programmer checks when distant geometry shimmers.',
    'Open-world games and flight simulators, where the view runs from a cockpit instrument to the horizon: reverse-Z with a float buffer (or a logarithmic depth) is standard.',
    'CAD and architectural viewers, which fit the near and far planes to the model\'s bounding sphere every frame to keep the resolution in the part being examined.',
    'Depth-based effects (fog, soft particles, screen-space ambient occlusion), which must convert the stored 1/d-like number back to a distance before using it.'
  ],
  history: 'Edwin Catmull described the depth buffer in his 1974 Utah thesis, and Wolfgang Straßer proposed the same idea independently. Sutherland and Hodgman\'s polygon clipping appeared in 1974, and Blinn and Newell showed in 1978 that clipping is best done in homogeneous coordinates before the division. The reverse-Z trick was revived for floating-point buffers by several game developers around 2008–2012 and became standard on Vulkan and Direct3D 12.',
  sources: ['Tomas Akenine-Möller, Eric Haines and Naty Hoffman, *Real-Time Rendering*, 4th ed. (2018), sections on the z-buffer and on clipping.', 'Nathan Reed, "Depth Precision Visualized" (2015) and Brano Kemen, "Logarithmic Depth Buffer" (2009), game-development articles that compare the mappings.', 'James F. Blinn and Martin E. Newell, "Clipping Using Homogeneous Coordinates", *Computer Graphics* (SIGGRAPH \'78), 12(3), 1978.'],
  sim: 'cv-depth-precision',
  construction: 'cv-depth-curve'
},

{
  id: 'shadow-maps-and-projective-textures',
  parent: 'computing-and-vision',
  title: 'Shadow maps and projective textures',
  level: 3,
  short: 'A shadow is what a light cannot see. Render the scene from the light, keep the depth, and any point that is farther from the light than the stored depth is in shadow — the same matrix turns the light into a slide projector.',
  keywords: ['shadow map', 'shadow mapping', 'projective texture', 'light space', 'bias', 'shadow acne', 'peter panning', 'PCF', 'cascaded shadow maps', 'orthographic', 'slide projector'],
  prereq: ['the-camera-model', 'opengl-projection-matrices', 'shadows-by-projection'],
  related: ['perspective-shadows', 'depth-buffers-and-clipping', 'camera-calibration-and-homography', 'math:matrix-multiplication'],
  body: `Look at a scene from a lamp and everything you can see is lit; everything hidden behind something else is in shadow. A **shadow map** turns that into an algorithm: first render the scene as the *light* sees it, but keep only the depth — a picture of distances to the nearest lit surface. Then, when drawing from the camera, take each point $\\mathbf x$, find where it would appear in the light's picture, and compare its distance from the light with the number stored there. If it is farther, something nearer blocks the light: shadow.

### The light is a camera
A directional light (the Sun) is an orthographic camera looking along the light direction; a spotlight is a perspective one. Each has its own view and projection matrices $V_L$ and $P_L$ ([[opengl-projection-matrices]]). To look the point up, transform it into the light's clip space and rescale the cube $[-1, 1]^3$ to texture coordinates $[0, 1]^3$ with the *bias matrix* $B$:
$$\\begin{bmatrix} s \\\\ t \\\\ r \\\\ q \\end{bmatrix} = \\underbrace{\\begin{bmatrix} \\tfrac12 & 0 & 0 & \\tfrac12 \\\\ 0 & \\tfrac12 & 0 & \\tfrac12 \\\\ 0 & 0 & \\tfrac12 & \\tfrac12 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}}_{B} P_L V_L \\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix}, \\qquad \\text{in shadow if } \\frac{r}{q} > \\text{map}\\!\\left(\\frac{s}{q}, \\frac{t}{q}\\right) + \\text{bias}.$$
For the Sun $q = 1$; for a spotlight the divide by $q$ is the perspective division again. The whole lookup is one matrix product per fragment.

### Projective textures
Do not store depth but a *picture* and use the same matrix: $(s/q, t/q)$ is where the point falls in the light's image, so a texture looked up there appears projected onto every surface in the light's path — a slide projector, a flashlight cookie, the stripes on a car in a driving game, a decal. The idea is the one Alberti's window and Dürer's thread had: a picture on a plane, rays through a centre ([[central-projection]]).

### Acne, peter-panning and cures
The map is sampled in texels of world size $\\Delta = w/N$ ($w$ the width of the light's window, $N$ the resolution). A surface tilted by $\\theta$ from facing the light changes depth by $\\Delta \\tan\\theta$ across one texel, so a fragment can be farther than the texel's stored centre value and shadow *itself*: stripes of **shadow acne**. A bias of that size cures it, at the price of **peter-panning**, shadows that come loose from their casters. Practice: a slope-scaled bias, back-face rendering into the map, and **percentage-closer filtering** (comparing several neighbouring texels and averaging the verdicts) for soft edges. Because the camera's frustum is long and the map's texels uniform, **cascaded shadow maps** use several maps for slices at increasing distance.

> [!note] Everything here is the projection of depth onto the camera's view, in two drawings linked by a matrix. The construction below makes the two drawings by hand on a cross-section.`,
  ideas: [
    'Render depth from the light; a point farther from the light than the stored depth is in shadow.',
    'A directional light is an orthographic camera, a spotlight a perspective one; one matrix B·P_L·V_L takes a world point to the map.',
    'Store a colour instead of a depth and the same matrix is a slide projector: a projective texture.',
    'Across one texel a tilted surface changes depth by texel size × tan θ, so the comparison needs a bias; too little gives acne, too much peter-panning.',
    'Filtering (PCF) and cascades fight aliasing at the shadow edge and over long distances.'
  ],
  pitfalls: [
    'A shadow map is a picture of the shadow — It is a picture of distances from the light. The shadow appears only when the comparison with the camera\'s fragment is made.',
    'A bigger bias is always safer — Too large a bias lifts shadows off the objects that cast them (peter-panning) and loses contact shadows; the bias should follow the surface tilt.',
    'Projective texturing is a different technique from shadow mapping — It is the same matrix and the same lookup; shadow mapping only compares a depth where a projected texture would read a colour.'
  ],
  formulas: [
    {
      name: 'World size of one shadow-map texel',
      expr: 't = w/N',
      tex: '\\Delta = \\frac{w}{N}',
      vars: {
        t: { name: 'size of one texel in the world', q: 'length', unit: 'cm', tex: '\\Delta' },
        w: { name: 'width of the light\'s window (orthographic)', q: 'length', unit: 'm', value: 100 },
        N: { name: 'shadow map resolution (texels)', value: 2048, int: true, min: 16 }
      },
      solveFor: 't',
      note: 'A 100 m wide Sun window on a 2048 × 2048 map has texels 4.9 cm across: a shadow edge is jagged on that scale.'
    },
    {
      name: 'Depth change across one texel on a tilted surface',
      expr: 'b = t*tan(th)',
      tex: 'b = \\Delta\\,\\tan\\theta',
      vars: {
        b: { name: 'bias needed to avoid acne', q: 'length', unit: 'cm' },
        t: { name: 'size of one texel in the world', q: 'length', unit: 'cm', value: 4.9, tex: '\\Delta' },
        th: { name: 'angle between the surface normal and the light direction', q: 'angle', unit: '°', value: 75, min: 0, max: 89, tex: '\\theta' }
      },
      solveFor: 'b',
      note: 'At grazing light the required bias grows without limit: 18 cm at 75°, 56 cm at 85° for 4.9 cm texels. Hence slope-scaled bias.'
    }
  ],
  examples: [{
    title: 'Is the ground behind the box shadowed?',
    q: 'A directional light shines from the upper left, falling 35° from the vertical. A box 60 units high stands on level ground with its right face at $x = 140$. The ground point at $x = 160$ is being shaded. Is it in shadow, and how far does the shadow reach?',
    steps: [
      'The light ray through the top right corner $(140, 60)$ falls at 35° to the vertical, so it meets the ground $60\\tan 35° = 42.0$ units farther right, at $x = 182$. Everything on the ground between 140 and 182 is hidden from the light.',
      'Check the point $x = 160$ the way the map does: follow its ray back towards the light. It moves 20 units to the left to reach the box\'s right face while rising $20/\\tan 35° = 28.6$ units — below the top at 60 — so it meets the box.',
      'The texel of that ray in the shadow map holds the distance to the box face; the ground point is $20/\\sin 35° = 34.9$ units farther along the same ray. Its depth is larger than the stored depth, so the test "depth > stored + bias" is true.'
    ],
    a: 'Yes: the ground at x = 160 is in shadow, which covers x from 140 to 182.'
  }],
  quiz: [
    { q: 'A point is in shadow when, in the light\'s clip space,', choices: ['its depth is smaller than the stored depth', 'its depth is larger than the stored depth (plus a bias)', 'its x coordinate is outside the window', 'its w is zero'], a: 1, why: 'The map holds the distance to the nearest surface as seen by the light. A point farther away than that has something between it and the light.' },
    { q: 'What matrix turns the light\'s clip space into texture coordinates between 0 and 1?', choices: ['The inverse view matrix', 'The bias matrix: scale by 1/2, shift by 1/2', 'The viewport matrix of the camera', 'The identity'], a: 1, why: 'Clip space runs from −1 to 1; texture space from 0 to 1. Scaling by one half and adding one half in x, y and z does it.' },
    { q: 'Stripes of false self-shadowing across a lit floor are called shadow acne and are cured with a bias. Shadows that detach from the feet of the casters mean the bias is', choices: ['too small', 'too large', 'negative', 'perfect'], a: 1, why: 'Peter-panning is the symptom of an over-generous bias: the depth test is made to pass too easily near the caster.' },
    { q: 'A 2048-texel map covers 50 m. How many centimetres does a texel measure?', answer: 2.44, unit: 'cm', why: '50 m / 2048 = 0.0244 m.' },
    { q: 'A projective texture and a shadow map use the same transformation from the world to the light\'s image.', a: true, why: 'Both look up (s/q, t/q) from B·P_L·V_L·x. The shadow map reads a depth to compare; the projective texture reads a colour to display.' }
  ],
  applications: [
    'Games and real-time visualisation: sun and spotlight shadows are shadow maps, cascaded over the view distance; the technique has been the default since about 2000.',
    'Film rendering of the 1980s and 90s, before ray tracing was affordable: Pixar\'s production renderers used shadow maps with percentage-closer filtering.',
    'Projectors and cookies: a flashlight cone with a pattern, a window\'s light patch, a projected video wall in a game, or a decal gun painting marks onto a level.',
    'Architecture and solar studies: a sun-and-shadow check of a design over a day is a sequence of orthographic light cameras ([[sun-path-diagrams]]).'
  ],
  history: 'Lance Williams published "Casting curved shadows on curved surfaces" in 1978. William Reeves, David Salesin and Robert Cook added percentage-closer filtering in 1987 for Pixar\'s renderer. Mark Segal and his colleagues at SGI showed in 1992 how projective textures and shadow maps follow from the same texture-matrix hardware ("Fast shadows and lighting effects using texture mapping"). Frank Crow\'s shadow volumes (1977) are the main alternative.',
  sources: ['Lance Williams, "Casting Curved Shadows on Curved Surfaces", *Computer Graphics* (SIGGRAPH \'78), 12(3), 1978.', 'Mark Segal, Carl Korobkin, Rolf van Widenfelt, Jim Foran and Paul Haeberli, "Fast Shadows and Lighting Effects Using Texture Mapping", *Computer Graphics* (SIGGRAPH \'92), 26(2), 1992.', 'Tomas Akenine-Möller, Eric Haines and Naty Hoffman, *Real-Time Rendering*, 4th ed. (2018), the chapter on shadows.'],
  sim: 'cv-shadow-map',
  construction: 'cv-shadow-section'
},

{
  id: 'game-cameras',
  parent: 'computing-and-vision',
  title: 'Game cameras: orthographic, isometric and 2.5-D',
  level: 2,
  short: 'Games choose the camera for the job: a perspective camera for presence, an orthographic one for tiles that must not change size. The 2 : 1 pixel-art "isometric" is really a dimetric view at 30° elevation — chosen because its lines step cleanly through the pixel grid.',
  keywords: ['isometric game', 'orthographic camera', 'dimetric', '2:1', 'pixel art', 'tile map', 'depth sorting', 'parallax', '2.5D', 'top-down', 'oblique', 'tile picking'],
  prereq: ['isometric-projection', 'orthographic-projection', 'opengl-projection-matrices'],
  related: ['isometric-in-games', 'dimetric-projection', 'cabinet-projection', 'axonometric-projection'],
  body: `A perspective camera gives presence: things loom, the horizon recedes, a corridor feels long. It also costs something a strategy or building game cannot afford. A tile near the camera is larger than one far away, so the same tile has many sizes, every sprite would need many sizes, and clicking a cell means undoing a perspective. An **orthographic** camera has none of this: every tile is the same size wherever it is, the grid is a grid, and the picture can be assembled from one repeated sprite.

### The matrix
The camera looks at the ground from a fixed **elevation** $\\alpha$ above the horizontal and turned 45° about the vertical: $R_x(\\alpha)\\,R_y(-45°)$, followed by the orthographic matrix of [[opengl-projection-matrices]] with a window of constant height. For the *true isometric* of [[isometric-projection]] the elevation is $35.264°$ and the ground axes run at 30° on the screen. Generally a ground axis appears at the angle
$$\\gamma = \\arctan(\\sin\\alpha),$$
a square tile appears as a diamond of width $w$ and height $h = w \\sin\\alpha$, and a vertical edge of length $s$ is drawn $s\\cos\\alpha$ long.

### Why the games' "isometric" is 2 : 1
At $\\alpha = 35.264°$, $h/w = 0.577$ and the tile edges climb at 30° — a slope of 0.577, which on a pixel grid is 1.73 pixels across for every pixel up: an irregular staircase of runs of one and two pixels. Choose $\\alpha = 30°$ instead and $h/w = \\tfrac12$ exactly: the edges climb **one pixel for every two across**, a perfectly regular two-pixel step, the same on every tile; diamonds 64 × 32 tile without gaps and halve cleanly. The result is the **2 : 1 dimetric** of SimCity 2000 and most pixel-art worlds — loosely called "isometric", slightly different in its angles (26.57° edges, not 30°) and its proportions ([[dimetric-projection]]). A truly isometric 64-wide diamond would be 37 px tall; the pixel artist draws 32.

### Tiles, picking and drawing order
With the diamond's top corner at $(x_0, y_0)$, tile $(i, j)$ sits at $x = x_0 + (i - j)\\,w/2$, $y = y_0 + (i + j)\\,h/2$. A mouse click is undone by inverting the 2 × 2: $i - j = (x - x_0)/(w/2)$, $i + j = (y - y_0)/(h/2)$, then rounding down. Because nothing shrinks, objects are drawn **back to front** by $i + j$ (the painter's algorithm); a 3-D engine does the same with the depth buffer.

### 2.5-D: flat art, deep world
A side-scroller with flat sprites is made to look deep by **parallax**: a layer at depth $d$ scrolls at a rate proportional to $1/d$, the same law as the perspective divide, so the clouds move slowly and the foreground fast. Other games run a real perspective camera but keep the action on one plane, or put a 3-D world under a fixed oblique camera (the cabinet look, [[cabinet-projection]]) so that it can be drawn like a map.

> [!tip] Whenever a game needs "the same size everywhere", it reaches for an orthographic camera; whenever it needs "closer is bigger", for perspective. The hybrid is the rule: 3-D models under an orthographic isometric camera, or 2-D sprites in a 3-D world.`,
  ideas: [
    'An orthographic camera keeps every tile the same size, so a grid stays a grid and one sprite can be repeated.',
    'The ground axes of a camera at elevation α appear at arctan(sin α); the diamond tile has height w·sin α; a vertical edge s becomes s·cos α.',
    'True isometric needs α = 35.264° (30° edges). Games use α = 30°: edges climb 1 pixel per 2, which is clean on a pixel grid.',
    'Tile (i, j) is drawn at x = (i − j)·w/2, y = (i + j)·h/2; clicking inverts the same 2 × 2; draw back to front by i + j.',
    'Parallax scrolling applies the 1/d law of perspective to flat layers.'
  ],
  pitfalls: [
    'The 2 : 1 pixel-art view is isometric — It is a dimetric view: the camera is at 30° elevation, not 35.26°, the axes are at 26.57° to the horizontal, and the three axes are not foreshortened equally.',
    'Orthographic means top-down — Orthographic only means parallel projectors. A top-down view is one orthographic camera; an isometric one is another, tilted and turned.',
    'Any 3-D engine\'s orthographic camera gives clean pixel art — Only if the camera angles, the sprite scale and the pixel snapping are chosen to keep edges at 2 : 1; otherwise the 3-D rendering shimmers as it moves.'
  ],
  formulas: [
    {
      name: 'Angle of the ground axes on the screen',
      expr: 'g = atan(sin(a))',
      tex: '\\gamma = \\arctan(\\sin\\alpha)',
      vars: {
        g: { name: 'angle of the tile edges to the horizontal', q: 'angle', unit: '°', tex: '\\gamma' },
        a: { name: 'camera elevation above the horizontal', q: 'angle', unit: '°', value: 30, min: 1, max: 89, tex: '\\alpha' }
      },
      solveFor: 'g',
      note: 'For a camera turned 45° about the vertical. α = 35.264° gives γ = 30° (true isometric); α = 30° gives γ = 26.57°, the slope 1 : 2 of pixel art.'
    },
    {
      name: 'Height of a diamond tile',
      expr: 'h = w*sin(a)',
      tex: 'h = w\\,\\sin\\alpha',
      vars: {
        h: { name: 'height of the tile on the screen', q: 'length', unit: 'mm' },
        w: { name: 'width of the tile on the screen', q: 'length', unit: 'mm', value: 64 },
        a: { name: 'camera elevation', q: 'angle', unit: '°', value: 30, min: 1, max: 89, tex: '\\alpha' }
      },
      solveFor: 'h',
      note: 'A 64-wide diamond is 32 tall at 30° elevation (2 : 1) and 37.0 tall at the isometric 35.264°. The units are arbitrary; pixels work the same.'
    },
    {
      name: 'Drawn length of a vertical edge',
      expr: 'v = s*cos(a)',
      tex: 'v = s\\,\\cos\\alpha',
      vars: {
        v: { name: 'length of the vertical edge on the screen', q: 'length', unit: 'mm' },
        s: { name: 'true length of the edge in the world', q: 'length', unit: 'mm', value: 45.25 },
        a: { name: 'camera elevation', q: 'angle', unit: '°', value: 30, min: 0, max: 89, tex: '\\alpha' }
      },
      solveFor: 'v',
      note: 'A cube whose top is a 64-wide diamond has edge 64/√2 = 45.25; its vertical edges are drawn 39.2 long at 30° elevation.'
    }
  ],
  examples: [{
    title: 'Which tile did the player click?',
    q: 'A 2 : 1 map uses tiles 64 × 32 px, with the top corner of tile (0, 0) at screen position (400, 100). The player clicks at (530, 250). Which tile is that?',
    steps: [
      { text: 'Subtract the origin and divide by the half-tile steps:', tex: 'i - j = \\frac{530 - 400}{32} = 4.0625, \\qquad i + j = \\frac{250 - 100}{16} = 9.375' },
      'Add and subtract: $i = (4.0625 + 9.375)/2 = 6.72$ and $j = (9.375 - 4.0625)/2 = 2.66$.',
      'Round down: tile $(6, 2)$. Check: the top corner of tile $(6, 2)$ is at $x = 400 + 4 \\cdot 32 = 528$, $y = 100 + 8 \\cdot 16 = 228$, and the click is just below it.'
    ],
    a: 'The click is in tile (6, 2).'
  }],
  quiz: [
    { q: 'What camera elevation gives a diamond tile exactly twice as wide as tall?', answer: 30, unit: '°', why: 'h/w = sin α = 1/2 gives α = 30°, which is why pixel-art "isometric" uses 30° elevation rather than 35.264°.' },
    { q: 'In a true isometric view the tile edges climb at', choices: ['26.57°', '30°', '35.26°', '45°'], a: 1, why: 'arctan(sin 35.264°) = arctan(0.577) = 30°. The 26.57° of pixel art is arctan(1/2).' },
    { q: 'A 64-pixel-wide diamond seen in true isometric is how tall, in pixels?', answer: 37, why: '64 × sin 35.264° = 64 × 0.5774 = 36.95.' },
    { q: 'A parallax layer at twice the depth scrolls', choices: ['twice as fast', 'at the same speed', 'half as fast', 'not at all'], a: 2, why: 'The image shift is proportional to 1/d: doubling the depth halves it.' },
    { q: 'Orthographic cameras make distant tiles smaller than near tiles.', a: false, why: 'The projectors are parallel: size does not depend on distance. That is exactly why they suit tile maps.' }
  ],
  applications: [
    'City builders and strategy games (SimCity 2000, Age of Empires, Diablo): a 2 : 1 dimetric tile grid, so that terrain is a repeated sprite, picking is a 2 × 2 inverse, and every pixel step is regular.',
    'Modern 3-D games with an isometric camera (Monument Valley, many mobile titles): a true orthographic camera at 35.26° or 30° over 3-D models, so that perspective does not distort puzzles built on the parallel lines.',
    'Side-scrollers with depth: parallax layers moving at rates proportional to 1/d make a flat world feel deep without a perspective camera.',
    'Level editors, mini-maps and UI in 3-D engines, where a screen position must correspond to a unique place on a plane.'
  ],
  history: 'Isometric pictures predate computers by centuries in engineering drawing ([[isometric-projection]]); the first arcade games to use the view were in the early 1980s, Sega\'s Zaxxon (1982) being the one usually named. The 2 : 1 dimetric became the pixel-art standard through the 1990s games on small screens — Populous (1989), SimCity 2000 (1993), Diablo (1996) — because low resolutions made the clean pixel step more valuable than geometric correctness.',
  sources: ['Tomas Akenine-Möller, Eric Haines and Naty Hoffman, *Real-Time Rendering*, 4th ed. (2018), chapter 4, orthographic and oblique projections.', 'ISO 5456-3, Technical drawings — Projection methods — Part 3: Axonometric representations.', 'Hyper Projections, the pages on [[isometric-projection]] and [[dimetric-projection]].'],
  sim: 'cv-game-camera',
  construction: 'cv-iso-2to1'
},

{
  id: 'camera-calibration-and-homography',
  parent: 'computing-and-vision',
  title: 'Camera calibration and the homography',
  level: 3,
  short: 'A camera is a matrix K[R | t] with a few unknowns, found by photographing a flat chessboard; two pictures of a plane are tied together by a 3 × 3 homography, fixed by four points — enough to un-warp a tilted tile into a square.',
  keywords: ['camera calibration', 'intrinsic matrix', 'focal length in pixels', 'principal point', 'lens distortion', 'homography', 'DLT', 'rectification', 'Zhang', 'chessboard', 'vanishing points', 'bird\'s eye'],
  prereq: ['the-camera-model', 'projective-geometry', 'cross-ratio', 'points-at-infinity'],
  related: ['vanishing-points', 'photogrammetry', 'augmented-and-virtual-reality', 'math:gaussian-elimination'],
  body: `A real camera is the pinhole of [[the-camera-model]] plus a lens. For a point $\\mathbf X$ in the world, the pixel is
$$\\lambda\\begin{bmatrix} u \\\\ v \\\\ 1 \\end{bmatrix} = \\underbrace{\\begin{bmatrix} f_x & s & c_x \\\\ 0 & f_y & c_y \\\\ 0 & 0 & 1 \\end{bmatrix}}_{K}\\;[\\,R \\mid \\mathbf t\\,]\\begin{bmatrix} \\mathbf X \\\\ 1 \\end{bmatrix}.$$
The **extrinsics** $R, \\mathbf t$ say where the camera is and which way it points (6 numbers); the **intrinsics** $K$ say what the camera is: the focal length in pixels $f_x, f_y$ ($f = W/2\\tan(\\theta/2)$ for a horizontal field of view $\\theta$ across $W$ pixels), the principal point $(c_x, c_y)$ where the optical axis meets the sensor, and a skew $s$ that is zero in any modern camera. A lens adds **distortion**: points move radially, $r_d = r\\,(1 + k_1 r^2 + k_2 r^4)$, barrel when $k_1 < 0$.

### Calibrating with a flat target
To measure $K$ and the distortion, photograph a chessboard from a dozen angles (Zhang's method, 2000). For a plane $Z = 0$ the projection collapses: $[R \\mid \\mathbf t]$ loses its third column, and the map from board coordinates $(X, Y)$ to pixels is a 3 × 3 matrix
$$H = K\\,[\\,\\mathbf r_1\\;\\;\\mathbf r_2\\;\\;\\mathbf t\\,] \\quad(\\text{up to scale}),$$
the **homography**. Since $\\mathbf r_1$ and $\\mathbf r_2$ are perpendicular unit vectors, each view gives two equations on $K$; three views settle the five unknowns, and a dozen average out the noise. A good calibration reproduces its corners to a fraction of a pixel.

### The homography
Any two images of the same plane — and any two images taken by a camera that only rotates — are related by a homography: $\\mathbf x' = H\\mathbf x$ in homogeneous coordinates, 8 free numbers (the scale is arbitrary), so **four points**, no three in a line, determine it. It is the most general map that sends straight lines to straight lines: it keeps incidence and the cross-ratio ([[cross-ratio]]) and loses parallelism, lengths and angles. A pair of parallel lines in the plane meet in a vanishing point; the vanishing points of all the plane's directions lie on one line, the horizon of the plane.

### Unwarping a tile by hand
A square tile photographed from a corner gives a quadrilateral $ABCD$. The vanishing points are $V_1 = AB \\cap DC$ and $V_2 = AD \\cap BC$; the diagonals meet at the image $O$ of the tile's centre; a line from $V_1$ through $O$ cuts the sides at their *true* midpoints (not at the midpoints of the segments on the photograph). Repeat to subdivide the tile into a grid, and the quadrilateral becomes a square with a square grid: you have un-warped it. The construction below does so with straightedge and dividers.

> [!fact] Computer vision does the same arithmetic: it solves the four-point equations for $H$, then applies $H^{-1}$ to every pixel. Document scanners, the virtual first-down line on television, bird's-eye views from car cameras, and the rectification of a QR code are all this.`,
  ideas: [
    'A camera is K[R | t]: six extrinsic numbers for where it is and which way, five intrinsic numbers for focal lengths, principal point and skew, plus lens distortion.',
    'A flat target turns the projection into a 3 × 3 homography H = K[r₁ r₂ t]; a few views give K because r₁ and r₂ are perpendicular unit vectors.',
    'A homography has 8 degrees of freedom: four point pairs fix it. It keeps straight lines and the cross-ratio, not parallels, lengths or angles.',
    'The vanishing points of a tile\'s sides give the plane\'s horizon, and the diagonals give the centre: the whole grid can be rebuilt by hand.'
  ],
  pitfalls: [
    'Lengths on a photographed plane can be read off with a scale ruler — Only if the plane is parallel to the sensor. Otherwise the scale changes from point to point; undo it with the homography first.',
    'The midpoint of the picture of a segment is the picture of its midpoint — Perspective does not preserve ratios. The image of the midpoint lies nearer the far end; the diagonals\' intersection finds it.',
    'Calibration works on any four pictures — The views must tilt the target in different directions. Several views of a plane facing the camera give a singular system: K is not determined.'
  ],
  formulas: [
    {
      name: 'Pinhole projection of a point',
      expr: 'u = f*X/Z + c',
      tex: 'u = f\\,\\frac{X}{Z} + c_x',
      vars: {
        u: { name: 'pixel column', unit: 'px' },
        f: { name: 'focal length in pixels', unit: 'px', value: 800 },
        X: { name: 'sideways offset of the point', q: 'length', unit: 'm', value: 0.5, signed: true },
        Z: { name: 'depth of the point along the optical axis', q: 'length', unit: 'm', value: 4 },
        c: { name: 'principal point (column)', unit: 'px', value: 640, tex: 'c_x' }
      },
      solveFor: 'u',
      note: 'One row of K[R|t] for a camera looking straight along the axis: pixel = focal length × (X/Z) + principal point.'
    },
    {
      name: 'Focal length in pixels from the field of view',
      expr: 'f = W/(2*tan(fov/2))',
      tex: 'f = \\frac{W}{2\\tan(\\theta/2)}',
      vars: {
        f: { name: 'focal length', unit: 'px' },
        W: { name: 'image width', unit: 'px', value: 4032 },
        fov: { name: 'horizontal field of view', q: 'angle', unit: '°', value: 69.4, min: 5, max: 170, tex: '\\theta' }
      },
      solveFor: 'f',
      note: 'The half-width of the image is f·tan of the half-angle. A phone with a 69.4° horizontal view and a 4032-pixel width has f ≈ 2912 px.'
    },
    {
      name: 'Radial lens distortion',
      expr: 'rd = r*(1 + k1*r^2)',
      tex: 'r_d = r\\,(1 + k_1 r^2)',
      vars: {
        rd: { name: 'distorted radius (normalised)', tex: 'r_d' },
        r: { name: 'ideal radius from the principal point (normalised by f)', value: 0.5 },
        k1: { name: 'first radial coefficient', value: -0.2, signed: true, tex: 'k_1' }
      },
      solveFor: 'rd',
      note: 'Negative k₁ is barrel distortion (the edges are pulled in), positive is pincushion. Real calibrations add k₂r⁴ and tangential terms.'
    }
  ],
  examples: [{
    title: 'The true midpoint of a tile\'s edge',
    q: 'A 1 m square floor tile is photographed so that its corners appear at $A = (640, 450)$, $B = (790, 355)$, $C = (640, 324)$, $D = (490, 355)$ (pixels, $y$ downwards), corresponding to the floor points $(0,0), (1,0), (1,1), (0,1)$. Where is the midpoint of side $AB$ in the picture, and where on the floor is the pixel $(700, 380)$?',
    steps: [
      'The four pairs determine $H$ (the square-to-quadrilateral formula): $H = \\begin{bmatrix} 965.5 & 355.8 & 640 \\\\ 271.5 & 271.5 & 450 \\\\ 1.032 & 1.032 & 1 \\end{bmatrix}$.',
      { text: 'The midpoint of the side $AB$ is the floor point $(0.5, 0)$:', tex: 'x = \\frac{965.5 \\cdot 0.5 + 640}{1.032 \\cdot 0.5 + 1} = 740.5, \\qquad y = \\frac{271.5 \\cdot 0.5 + 450}{1.032 \\cdot 0.5 + 1} = 386.3' },
      'The naive midpoint of the picture of $AB$ is $(715, 402.5)$ — 30 pixels away. The true midpoint is nearer the end $B$ because that end of the tile is farther from the camera and is drawn smaller.',
      'Inverting $H$ for the pixel $(700, 380)$ gives the floor point $(0.447, 0.132)$: 45 cm along $AB$ and 13 cm along $AD$.'
    ],
    a: 'The midpoint of AB is at (740.5, 386.3); the pixel (700, 380) is at (0.45 m, 0.13 m) on the floor.'
  }],
  quiz: [
    { q: 'How many point correspondences are needed, at least, to determine a plane homography?', answer: 4, why: 'A homography has 8 degrees of freedom (nine entries up to scale) and each point pair gives two equations, so four pairs, no three collinear.' },
    { q: 'A homography of a plane in a photograph preserves', choices: ['parallel lines', 'lengths', 'straight lines and the cross-ratio', 'angles'], a: 2, why: 'It is a projective map: collinear points stay collinear and cross-ratios are kept. Parallels, lengths and angles are not.' },
    { q: 'A camera has a 4032-pixel-wide image and a 69.4° horizontal field of view. Its focal length in pixels is about', answer: 2912, unit: 'px', why: 'f = (W/2)/tan(θ/2) = 2016 / tan 34.7° = 2016 / 0.6923.' },
    { q: 'Why does a calibration use views of the chessboard from different angles?', choices: ['To average the lighting', 'Because views of the same orientation give the same constraints and K is not determined', 'To make the lens focus', 'To change the principal point'], a: 1, why: 'Each view of a plane gives two equations on K; parallel boards give the same ones again. The tilts must differ.' },
    { q: 'The vanishing points of the two side directions of a ground tile lie on the horizon line of the ground plane.', a: true, why: 'Every direction in the plane vanishes at a point of its vanishing line, which is the horizon of that plane.' }
  ],
  applications: [
    'Document and whiteboard scanning apps: find the four corners of the page, solve for H, and apply its inverse so the tilted photograph becomes a square-on scan.',
    'Sports broadcasting: the virtual first-down line and the offside lines of football are drawn on the pitch by finding the homography from the field markings, frame by frame.',
    'Driver assistance: the bird\'s-eye view of a car camera maps the road plane back through the homography, so lane lines become parallel again.',
    'Machine reading of codes: a QR code\'s three finder squares and its alignment mark give four reference points, and a homography straightens a code read at an angle.'
  ],
  history: 'The projective geometry behind it is that of Desargues and Poncelet; the homography as a tool of vision is a creation of the 1980s and 90s, with the direct linear transformation of the photogrammetrists (Abdel-Aziz and Karara, 1971) and the book of Hartley and Zisserman (2000, 2nd ed. 2003). Zhang\'s 2000 method — a printed chessboard and a few views — made accurate calibration a ten-minute job instead of a laboratory one.',
  sources: ['Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision*, 2nd ed. (2003), chapters 2, 4 and 6 on homographies, the DLT algorithm and camera models.', 'Zhengyou Zhang, "A Flexible New Technique for Camera Calibration", *IEEE Transactions on Pattern Analysis and Machine Intelligence* 22(11), 2000.', 'Gary Bradski and Adrian Kaehler, *Learning OpenCV* (2008), the chapters on camera models and calibration.'],
  sim: 'cv-homography',
  construction: 'cv-tile-unwarp'
},

{
  id: 'photogrammetry',
  parent: 'computing-and-vision',
  title: 'Photogrammetry and structure from motion',
  level: 3,
  short: 'A camera turns a point into a ray; two pictures from different places give two rays, and the point is where they cross. Everything — depth from disparity, the accuracy law, the aerial map, the software that turns a thousand photographs into a model — follows from that intersection.',
  keywords: ['photogrammetry', 'structure from motion', 'triangulation', 'disparity', 'baseline', 'epipolar', 'bundle adjustment', 'stereo', 'ground sample distance', 'relief displacement', 'orthophoto', 'SfM'],
  prereq: ['the-camera-model', 'camera-calibration-and-homography', 'central-projection', 'vanishing-points'],
  related: ['augmented-and-virtual-reality', 'surveying-and-site-plans', 'cross-ratio', 'math:similar-triangles'],
  body: `A camera does something to a point in space that cannot be undone from one picture: it turns the point into a *direction*, and the distance is lost. Take a second picture from somewhere else and the point is one more direction; the two lines of sight cross at the point. **Photogrammetry** is measuring by those crossings. It is central projection run backwards, and it needs no more than the geometry of [[central-projection]] and similar triangles.

### Two rays make a point
Put two cameras of focal length $f$ side by side, their axes parallel and their centres a **baseline** $B$ apart. A point at depth $Z$ falls at horizontal image positions $x_1$ and $x_2$ that differ by the **disparity** (parallax) $d = x_1 - x_2$. By similar triangles
$$Z = \\frac{f\\,B}{d}.$$
Near things shift a lot between the two views, far things hardly at all: hold up a finger and shut each eye in turn. Your eyes are a stereo pair with $B \\approx 63$ mm; a survey aircraft takes its second picture 30–100 m after the first.

### The accuracy law
A matching error of $\\delta d$ pixels gives a depth error
$$\\delta Z = \\frac{Z^2\\,\\delta d}{f\\,B}.$$
It grows as the *square* of the distance and falls in proportion to the baseline: a stereo rig that sees a wall 2 m away to a millimetre sees one 20 m away to a decimetre. The intersection angle $\\gamma = 2\\arctan(B/2Z)$ says the same: rays that cross at a shallow angle give a long, thin region of uncertainty. A drone at $H = 100$ m with a 20-megapixel camera ($f = 3651$ px) and pictures 30 m apart has $d = 1095$ px at the ground, $\\gamma = 17°$ and, for half-pixel matching, $\\delta Z \\approx 4.6$ cm. The ground sample distance of its pixels is $p\\,H/f = 2.7$ cm: vertical accuracy is about twice the pixel size and worse than the horizontal.

### From photographs to a model
In structure from motion nobody tells the software where the cameras were. It finds distinctive features in every picture (SIFT and its successors), matches them between overlapping pictures, estimates how each pair of cameras sits from the epipolar constraint $\\mathbf x_2^{\\top} F\\,\\mathbf x_1 = 0$ (robustly, with RANSAC), triangulates the matched points, adds pictures one at a time, and then runs **bundle adjustment**: a large sparse least-squares fit that moves every camera and every point until the total squared *reprojection error* is as small as possible. A dense matching step then fills in surfaces. The result is right up to a similarity transformation — position, orientation and, above all, **scale** — which is fixed with a known length or with surveyed ground control points.

### Aerial photographs and relief displacement
In a vertical air photograph a tower leans away from the nadir point: a point of height $h$ at radial distance $r$ in the photograph is displaced radially by $r\\,h/H$, with $H$ the flying height above its base. That is the signature of central projection. An **orthophoto** removes it, using the model of the terrain, and so becomes a map.

> [!tip] Overlap is accuracy. Survey flights are planned with 60–80 % forward overlap and 30–60 % side lap, so that every point is seen from several stations.`,
  ideas: [
    'One picture gives a ray; two pictures give two rays, and the point is where they cross: depth from disparity, Z = fB/d.',
    'The depth error δZ = Z²·δd/(fB) grows with the square of the distance and falls with the baseline: the intersection angle must not be shallow.',
    'Structure from motion finds features, matches them, estimates the camera poses from the epipolar constraint and refines everything by bundle adjustment.',
    'Pictures alone fix the shape but not the scale; a known length or surveyed control points do.',
    'Relief displacement r·h/H is how central projection shows in an air photograph; an orthophoto removes it.'
  ],
  pitfalls: [
    'More megapixels give more accurate depth — Depth accuracy depends on the baseline, the focal length in pixels and the matching, not on the megapixel count alone; a long baseline helps more than a larger sensor.',
    'The model comes out in metres — Photographs fix only the shape. The scale and orientation come from a known length, a control point or the GPS tags, not from the pictures.',
    'A vertical air photograph is a map — Heights are displaced radially from the nadir point by r·h/H, and the scale changes with relief. It must be orthorectified first.'
  ],
  formulas: [
    {
      name: 'Depth from disparity',
      expr: 'Z = f*B/d',
      tex: 'Z = \\frac{f\\,B}{d}',
      vars: {
        Z: { name: 'depth of the point', q: 'length', unit: 'm' },
        f: { name: 'focal length in pixels', unit: 'px', value: 3651 },
        B: { name: 'baseline between the camera centres', q: 'length', unit: 'm', value: 30 },
        d: { name: 'disparity', unit: 'px', value: 1095 }
      },
      solveFor: 'Z',
      note: 'For two cameras with parallel axes. A point 100 m below the aircraft moves 1095 pixels between pictures taken 30 m apart.'
    },
    {
      name: 'Depth error from a matching error',
      expr: 'dZ = Z^2*dd/(f*B)',
      tex: '\\delta Z = \\frac{Z^2\\,\\delta d}{f\\,B}',
      vars: {
        dZ: { name: 'depth error', q: 'length', unit: 'cm', tex: '\\delta Z' },
        Z: { name: 'depth', q: 'length', unit: 'm', value: 100 },
        dd: { name: 'matching error in pixels', unit: 'px', value: 0.5, tex: '\\delta d' },
        f: { name: 'focal length in pixels', unit: 'px', value: 3651 },
        B: { name: 'baseline', q: 'length', unit: 'm', value: 30 }
      },
      solveFor: 'dZ',
      note: 'Differentiating Z = fB/d. Doubling the distance quadruples the error; doubling the baseline halves it.'
    },
    {
      name: 'Ground sample distance',
      expr: 'g = p*H/f',
      tex: 'g = \\frac{p\\,H}{f}',
      vars: {
        g: { name: 'ground size of one pixel', q: 'length', unit: 'cm' },
        p: { name: 'pixel pitch on the sensor', q: 'length', unit: 'µm', value: 2.41 },
        H: { name: 'flying height above the ground', q: 'length', unit: 'm', value: 100 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 8.8 }
      },
      solveFor: 'g',
      note: 'Similar triangles between the sensor and the ground. A 1-inch sensor with 20 megapixels (2.41 µm pixels) and an 8.8 mm lens gives 2.7 cm per pixel at 100 m.'
    },
    {
      name: 'Relief displacement in an air photograph',
      expr: 'dr = r*h/H',
      tex: '\\delta r = \\frac{r\\,h}{H}',
      vars: {
        dr: { name: 'radial displacement of the top in the photograph', q: 'length', unit: 'mm', tex: '\\delta r' },
        r: { name: 'radial distance of the top from the nadir point in the photograph', q: 'length', unit: 'mm', value: 80 },
        h: { name: 'height of the object', q: 'length', unit: 'm', value: 50 },
        H: { name: 'flying height above the base of the object', q: 'length', unit: 'm', value: 1500 }
      },
      solveFor: 'e',
      note: 'A 50 m tower imaged 80 mm from the nadir point with the aircraft at 1500 m leans outwards by 2.7 mm on the print.'
    }
  ],
  examples: [{
    title: 'What does half a pixel cost?',
    q: 'A drone with an 8.8 mm lens and 2.41 µm pixels flies at 100 m and takes pictures 30 m apart. What is the ground sample distance, the disparity of the ground, and the height error for a 0.5-pixel matching error?',
    steps: [
      { text: 'The focal length in pixels is $f = 8.8\\ \\text{mm}/2.41\\ \\mu\\text{m} = 3651$ px. The ground sample distance is', tex: 'g = \\frac{p\\,H}{f} = \\frac{2.41\\times10^{-6} \\cdot 100}{8.8\\times10^{-3}} = 0.0274\\ \\text{m}' },
      { text: 'The disparity of the ground, from $Z = fB/d$:', tex: 'd = \\frac{f\\,B}{Z} = \\frac{3651 \\cdot 30}{100} = 1095\\ \\text{px}' },
      { text: 'The height error for $\\delta d = 0.5$ px:', tex: '\\delta Z = \\frac{Z^2\\,\\delta d}{f\\,B} = \\frac{100^2 \\cdot 0.5}{3651 \\cdot 30} = 0.046\\ \\text{m}' }
    ],
    a: 'The pixels are 2.7 cm on the ground, the ground moves 1095 px between pictures, and half a pixel of matching error is 4.6 cm in height.'
  }],
  quiz: [
    { q: 'The baseline of a stereo pair is doubled, everything else equal. The depth error becomes', choices: ['four times larger', 'twice as large', 'half as large', 'unchanged'], a: 2, why: 'δZ = Z²δd/(fB) is inversely proportional to B.' },
    { q: 'An object is moved from 10 m to 20 m from a stereo rig. By what factor does the depth error grow?', answer: 4, why: 'δZ is proportional to Z², and (20/10)² = 4.' },
    { q: 'A stereo pair has f = 1000 px, a baseline of 0.5 m, and a point with disparity 25 px. How far away is it, in metres?', answer: 20, unit: 'm', why: 'Z = fB/d = 1000 × 0.5 / 25 = 20 m.' },
    { q: 'A set of photographs alone, with no other information, determines the scale of the reconstructed model.', a: false, why: 'Shrinking the whole scene and moving the cameras closer gives identical pictures. Scale needs a known distance, a control point or GPS.' },
    { q: 'Bundle adjustment minimises', choices: ['the baseline', 'the sum of squared distances between the observed feature positions and the projections of the estimated points', 'the number of cameras', 'the focal length'], a: 1, why: 'The reprojection error: the gap, in the images, between where a feature was seen and where the current model says it should be.' }
  ],
  applications: [
    'Aerial and drone mapping: overlapping vertical pictures give orthophoto maps and elevation models to a few centimetres; a drone survey of a quarry\'s stockpile volume replaces a day with a total station.',
    'Heritage and architecture: facades, statues and whole sites are recorded as textured 3-D models, from a handful of photographs to tens of thousands.',
    'Film and games: photoscanned props, rocks and faces are captured with a camera and a turntable; the same code reconstructs sets.',
    'Planetary rovers: stereo pairs from cameras a fraction of a metre apart give the rover its map of the ground ahead, with the error law above deciding how far it can see safely.'
  ],
  history: 'Aimé Laussedat in France used photographs to map terrain from 1849 and is called the father of photogrammetry; Albrecht Meydenbauer in Prussia coined the German term in 1867 and founded an archive of building photographs in 1885. Stereo plotting machines (Zeiss, 1900s) turned pairs of aerial photographs into maps for the two world wars; computers took over in the 1950s and digital pictures in the 1990s. H. C. Longuet-Higgins\'s 1981 two-view algorithm, and Noah Snavely, Steven Seitz and Richard Szeliski\'s "Photo Tourism" (2006), started the modern structure-from-motion software.',
  sources: ['Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision*, 2nd ed. (2003), the chapters on two-view geometry and on triangulation and reconstruction.', 'Johannes L. Schönberger and Jan-Michael Frahm, "Structure-from-Motion Revisited", *IEEE Conference on Computer Vision and Pattern Recognition* (2016).', 'Paul R. Wolf, Bon A. Dewitt and Benjamin E. Wilkinson, *Elements of Photogrammetry with Applications in GIS*, 4th ed. (2014).'],
  sim: 'cv-triangulation',
  construction: 'cv-two-stations'
},

{
  id: 'augmented-and-virtual-reality',
  parent: 'computing-and-vision',
  title: 'Augmented and virtual reality',
  level: 3,
  short: 'Augmented reality makes the virtual camera equal to the real one — its lens from calibration, its pose from a marker or from tracking. Virtual reality renders two off-axis views through a lens, corrects the lens\'s distortion, and re-aims the finished picture at the last moment.',
  keywords: ['augmented reality', 'virtual reality', 'fiducial marker', 'ArUco', 'pose estimation', 'stereo rendering', 'off-axis frustum', 'IPD', 'timewarp', 'reprojection', 'lens distortion', 'latency', 'virtual production'],
  prereq: ['camera-calibration-and-homography', 'opengl-projection-matrices', 'the-camera-model'],
  related: ['photogrammetry', 'dome-projection', 'wide-angle-and-the-limits-of-the-plane', 'field-of-view-and-focal-length'],
  body: `Both technologies are the graphics pipeline of [[3d-graphics-pipeline]] with one new demand: the picture must be *registered* with something real — the camera's view of the room, or the position of your head.

### Augmented reality: copy the real camera
To draw a virtual cube onto a live video so that it sits on the table, the virtual camera must equal the real one. Two things are needed.

**The lens.** The camera's intrinsics $K$ (found as in [[camera-calibration-and-homography]]) become an off-axis frustum: with pixel origin at the top-left and $y$ down, at the near plane
$$l = -\\frac{c_x\\,n}{f_x},\\quad r = \\frac{(W - c_x)\\,n}{f_x},\\quad b = -\\frac{(H - c_y)\\,n}{f_y},\\quad t = \\frac{c_y\\,n}{f_y}$$
in the $\\mathtt{glFrustum}$ matrix of [[opengl-projection-matrices]].

**The pose.** Where is the camera? A printed square *marker* (an ArUco, AprilTag or QR-like code) is the cheapest answer. Its four corners in the image, against their known positions on the card, give a homography $H = \\lambda K[\\mathbf r_1\\ \\mathbf r_2\\ \\mathbf t]$ ([[camera-calibration-and-homography]]), from which
$$\\mathbf r_1 = \\lambda K^{-1}\\mathbf h_1,\\quad \\mathbf r_2 = \\lambda K^{-1}\\mathbf h_2,\\quad \\mathbf r_3 = \\mathbf r_1 \\times \\mathbf r_2,$$
$$\\mathbf t = \\lambda K^{-1}\\mathbf h_3,\\qquad \\lambda = 1\\big/\\left\\| K^{-1}\\mathbf h_1 \\right\\|,$$
refined by minimising the reprojection error. Draw the cube with $P\\,[R \\mid \\mathbf t]$ and it stands on the card. A distance check: a marker of side $L$ that appears $l$ pixels wide, face on, is at $Z = fL/l$. Without a marker, phones track image features and the inertial sensor together ("visual-inertial odometry").

### The geometry by hand
The marker's two edge directions are perpendicular, and their images are the vanishing points $V_1$, $V_2$. The eye $O$ sees them at a right angle, so $O$ lies on the Thales circle with diameter $V_1V_2$ — the focal length and the tilt of the card follow with a compass (the construction below).

### Virtual reality: two cameras, a lens, a clock
- **Stereo.** Each eye sits $\\pm e/2$ from the head's centre, $e \\approx 63$ mm on average. The two frusta pass through the *same* window — the headset's virtual screen at distance $D$ — so each is off-axis; turning the cameras inwards (toe-in) would produce vertical parallax. An object at distance $Z$ has screen parallax $p = e\\,(Z - D)/Z$.
- **The lens.** A magnifier makes a small panel fill the view and adds pincushion distortion and colour fringes. The renderer pre-warps each eye's picture with the opposite barrel distortion, per colour channel — the polynomial of the calibration page.
- **The clock.** Head turns reach several hundred degrees per second, and 20 ms of delay is a few degrees of error: at 20 pixels per degree, tens of pixels of swimming. So the finished picture is re-aimed just before display (*timewarp*): for a pure rotation the new view is a homography $K R K^{-1}$ of the old one, with no depth needed.

> [!fact] Virtual film sets use the same frustum trick backwards: the LED wall behind the actors shows the scene rendered as an off-axis frustum from the tracked camera's position to the plane of the wall, so that, through that camera, the perspective is right.`,
  ideas: [
    'AR means making the virtual camera equal the real one: the lens K as an off-axis frustum, the pose from a marker or tracking.',
    'A marker\'s four corners give a homography; r₁, r₂, t come from K⁻¹ times its columns, and r₃ = r₁ × r₂.',
    'The marker\'s two perpendicular edge directions give two vanishing points; the eye lies on the Thales circle over them.',
    'VR renders two off-axis frusta through a common window (never toe-in), pre-warps for the lens, and re-aims at the last moment.',
    'Latency turns head speed into misregistration: error = angular speed × delay; multiply by the pixels per degree for the error in pixels.'
  ],
  pitfalls: [
    'Stereo is two cameras pointed at the object — Rotating each eye\'s camera towards the object (toe-in) gives vertical parallax and a trapezoid distortion. The eyes\' windows must be parallel and the frusta off-axis.',
    'The virtual camera needs only the pose — If its focal length and principal point differ from the real camera\'s, the cube drifts off the card whenever the card moves away from the centre of the picture.',
    'Timewarp can fix any late head motion — Only rotation is a homography independent of depth; sideways head movement needs depth information, or the nearby objects judder.'
  ],
  formulas: [
    {
      name: 'Screen parallax of a virtual object',
      expr: 'p = ipd*(Z - D)/Z',
      tex: 'p = e\\,\\frac{Z - D}{Z}',
      vars: {
        p: { name: 'horizontal separation of the two images of the point (right eye − left eye)', q: 'length', unit: 'mm', signed: true },
        ipd: { name: 'interpupillary distance', q: 'length', unit: 'mm', value: 63, tex: 'e' },
        Z: { name: 'distance of the virtual object', q: 'length', unit: 'm', value: 10 },
        D: { name: 'distance of the screen (virtual image)', q: 'length', unit: 'm', value: 1.5 }
      },
      solveFor: 'p',
      note: 'Zero on the screen (Z = D), negative in front of it (crossed), approaching the eye separation e for a point at infinity.'
    },
    {
      name: 'Pixels per degree',
      expr: 'ppd = Wpx/fov',
      tex: '\\mathrm{ppd} = \\frac{W_{\\text{px}}}{\\theta}',
      vars: {
        ppd: { name: 'angular pixel density', unit: 'px/°' },
        Wpx: { name: 'pixels across one eye\'s picture', unit: 'px', value: 2000, tex: 'W_{\\text{px}}' },
        fov: { name: 'horizontal field of view', q: 'angle', unit: '°', value: 100, min: 10, max: 180, tex: '\\theta' }
      },
      solveFor: 'ppd',
      note: 'An average value; across a flat panel the density falls towards the edge. 20/20 vision resolves one minute of arc, i.e. 60 pixels per degree.'
    },
    {
      name: 'Misregistration from latency',
      expr: 'err = w*t',
      tex: '\\varepsilon = \\omega\\,t',
      vars: {
        err: { name: 'angular error', q: 'angle', unit: '°', tex: '\\varepsilon' },
        w: { name: 'angular velocity of the head', q: 'angvel', unit: '°/s', value: 100, tex: '\\omega' },
        t: { name: 'motion-to-photon delay', q: 'time', unit: 'ms', value: 20 }
      },
      solveFor: 'err',
      note: 'A casual head turn is about 100°/s: 20 ms of delay is 2°, 40 pixels at 20 px/°. A fast turn is three times that.'
    },
    {
      name: 'Distance of a face-on marker',
      expr: 'Z = f*L/l',
      tex: 'Z = \\frac{f\\,L}{l}',
      vars: {
        Z: { name: 'distance from the camera', q: 'length', unit: 'mm' },
        f: { name: 'focal length in pixels', unit: 'px', value: 800 },
        L: { name: 'side of the marker', q: 'length', unit: 'mm', value: 100 },
        l: { name: 'side as it appears', unit: 'px', value: 80 }
      },
      solveFor: 'Z',
      note: 'Similar triangles through the pinhole. For a tilted marker the width shrinks by the cosine of the tilt about a vertical axis; the full pose needs all four corners.'
    }
  ],
  examples: [{
    title: 'Where does a virtual object sit for the eyes?',
    q: 'A headset\'s virtual screen is 1.5 m away and the user\'s eyes are 63 mm apart. A virtual coin is placed 0.5 m from the eyes, and another at 10 m. What are the screen parallaxes, and which is easier to fuse?',
    steps: [
      { text: 'At 0.5 m:', tex: 'p = 63\\cdot\\frac{0.5 - 1.5}{0.5} = -126\\ \\text{mm}' },
      { text: 'At 10 m:', tex: 'p = 63\\cdot\\frac{10 - 1.5}{10} = +53.6\\ \\text{mm}' },
      'The near coin is 126 mm crossed — twice the eye separation — and the eyes must converge strongly while focusing at 1.5 m, a known cause of discomfort. The far coin has a parallax below the eye separation, so the eyes look almost parallel.'
    ],
    a: 'The parallaxes are −126 mm (near coin, crossed) and +54 mm (far coin); the far one is much more comfortable.'
  }],
  quiz: [
    { q: 'Why is "toe-in" a bad way to render a stereo pair?', choices: ['It makes the picture too bright', 'It introduces vertical parallax away from the centre of the picture', 'It halves the resolution', 'It removes depth'], a: 1, why: 'Two cameras rotated towards each other have image planes that are not parallel, so corresponding points differ vertically near the edges. Off-axis frusta through a common window avoid this.' },
    { q: 'A 100 mm marker appears 80 pixels wide face-on to a camera with f = 800 px. How far away is it, in millimetres?', answer: 1000, unit: 'mm', why: 'Z = fL/l = 800 × 100 / 80.' },
    { q: 'A head turns at 100°/s and the system has 20 ms of delay. The virtual world is wrongly placed by', answer: 2, unit: '°', why: 'ε = ω t = 100 × 0.02.' },
    { q: 'For a head rotation alone, the old picture can be re-aimed to the new orientation using a homography without knowing the depth of anything.', a: true, why: 'A pure rotation of the camera maps points by H = K R K⁻¹, independent of depth; translation does not.' },
    { q: 'For an object at infinity, the screen parallax approaches', choices: ['zero', 'the distance D of the screen', 'the interpupillary distance e', 'twice e'], a: 2, why: 'p = e (Z − D)/Z → e as Z → ∞: the two lines of sight are parallel, one eye-separation apart.' }
  ],
  applications: [
    'Phone AR (furniture placement, measuring apps, games): the camera\'s K gives the frustum, and visual-inertial tracking supplies a pose every frame; a flat table is found as a plane whose homography anchors the object.',
    'Industrial assembly and surgical navigation: tracked fiducials on tools and bodies give poses to a fraction of a millimetre, so overlays are registered with the part.',
    'Headsets (VR and mixed reality): two off-axis frusta, pre-warped through the lens, with late reprojection — this is why headset software is told a \'recommended\' per-eye render size and a field of view for each eye separately.',
    'Virtual production: the LED wall shows an off-axis frustum computed from the tracked film camera, so that through that camera, and only that one, the background has correct perspective and parallax.'
  ],
  history: 'Ivan Sutherland built the first head-mounted display with head tracking in 1968, showing wireframe rooms in stereo through half-silvered mirrors. Tom Caudell, at Boeing, coined "augmented reality" about 1990. Hirokazu Kato and Mark Billinghurst\'s ARToolKit (1999) made marker-based pose estimation freely available, followed by ARTag, ArUco and AprilTag. Consumer VR began with the Oculus prototypes of 2012; the late-reprojection idea came from the need to hide latency, and Pokémon Go (2016) brought AR to a mass audience.',
  sources: ['Steven M. LaValle, *Virtual Reality* (Cambridge University Press, 2019), the chapters on the geometry of virtual worlds, optics and rendering.', 'Hirokazu Kato and Mark Billinghurst, "Marker Tracking and HMD Calibration for a Video-based Augmented Reality Conferencing System", *Proceedings of the 2nd IEEE and ACM International Workshop on Augmented Reality* (1999).', 'Sergio Garrido-Jurado, Rafael Muñoz-Salinas and others, "Automatic Generation and Detection of Highly Reliable Fiducial Markers under Occlusion", *Pattern Recognition* 47(6), 2014.'],
  sim: 'cv-ar-marker',
  construction: 'cv-marker-pose'
}

);
