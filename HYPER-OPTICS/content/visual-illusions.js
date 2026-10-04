/* HYPER-OPTICS · content/visual-illusions.js — the topic "Visual illusions" (twelve concepts, twelve simulations in sims/visual-illusions.js).
 * Every page explains the figure, says what is really drawn, and points to the control that lets the reader prove it.
 * Accounts of the causes are given as the leading ones: several illusions are still debated. */
Hyper.add(

/* ================================================================ what an optical illusion is */
{
  id: 'what-an-optical-illusion-is', parent: 'visual-illusions', title: 'What an optical illusion is', level: 1,
  short: 'An optical illusion is a systematic, repeatable mismatch between what you see and what can be measured. There are three kinds: physical (the light itself misleads), physiological (the eye\'s own response creates the effect) and cognitive (the brain misreads the picture).',
  keywords: ['optical illusion', 'visual illusion', 'perception', 'physical illusion', 'physiological illusion', 'cognitive illusion', 'hallucination', 'apparent depth', 'afterimage', 'Mach bands', 'Müller-Lyer', 'Gregory'],
  prereq: ['the-eye-as-a-camera', 'the-retina-rods-and-cones', 'refraction-at-a-flat-surface'],
  related: ['size-and-length-illusions', 'brightness-and-contrast-illusions', 'colour-illusions-and-afterimages', 'ambiguous-and-impossible-figures', 'mirages-and-looming', 'camera-artefacts-as-illusions', 'the-moon-illusion-and-size-constancy', 'physics:the-eye'],
  body: `
Put a straight pencil in a glass of water and it looks bent. Look at two identical grey squares and one seems lighter. Stare at a red disc, look away, and a blue-green ghost of it floats on the wall. All three are *illusions*, with different causes, and telling the causes apart is the first step to understanding any of them.

### What counts as an illusion
An **optical illusion** (or visual illusion) is a *systematic* and *repeatable* mismatch between what you perceive and what a measurement says is there. Systematic: nearly everyone with ordinary vision sees it the same way. Repeatable: it comes back every time. That separates it from a **hallucination** (a percept with no cause), a lapse of attention or a defect of the eye.

Illusions are clues to how vision works. It must build a three-dimensional world from two flat, noisy images, and it relies on assumptions that are right nearly all the time: light comes from above, surfaces that look alike are alike, lines that converge in the distance are parallel. An illusion is a picture built so that a sound assumption gives a wrong answer.

### Three kinds
| Kind | Where the mismatch arises | Example | A camera would |
|---|---|---|---|
| Physical | in the light, before the eye | a pencil in water, a mirage | record it |
| Physiological | in the response of the retina and early pathways | afterimages, Mach bands | not show it |
| Cognitive | in the brain's reading of the picture | Müller-Lyer lines, the Necker cube | not show it |

- **Physical.** The optics really deliver a misleading image. Light from the immersed half of the pencil is refracted at the surface, so its image lies higher than the pencil itself, and a camera in the same place records exactly that. Looking straight down, the apparent depth is the real depth times $n_v/n_o$, about three quarters for water: a pool 1.20 m deep seems 0.90 m deep. From a slant the ratio is smaller, 0.68 at 35° from the vertical and 0.49 at 60°. So are mirages ([[mirages-and-looming]]).
- **Physiological.** The picture is drawn plainly, but the retina does not report brightness point by point: cells compare each spot with its neighbours and tire when stimulated for long. So a grey ramp seems to have a bright and a dark line at its ends ([[brightness-and-contrast-illusions]]) and a long look at a colour leaves a ghost of the opposite one ([[colour-illusions-and-afterimages]]).
- **Cognitive.** The retinal image is faithful; its interpretation goes astray. In the Müller-Lyer figure both lines are equally long, but the fins make the brain read them as corners at different distances ([[size-and-length-illusions]]).

### Sorting an illusion
Ask three questions. *Would a camera record it?* Then it is physical. *Does it depend on how long you look or where your eyes rest?* That points to the retina. *Does it change when the picture's meaning changes, though no mark does?* That is interpretation. Most illusions involve several levels, and many explanations are still argued.

### Proving it yourself
Each simulation in this topic draws a figure and gives you a control that removes its context, lays a ruler on it or reads the true value. The [illusion lab](#/tools/illusions) gathers them in one place.

> [!key] An illusion is a repeatable gap between what you see and what is measured. It can arise in the light (physical), in the eye's response (physiological) or in the brain's reading of the picture (cognitive); only the first kind is recorded by a camera.
`,
  ideas: [
    'An illusion is a systematic, repeatable gap between percept and measurement; it is neither a hallucination nor a defect of the eye.',
    'Physical illusions arise in the light itself and are recorded by a camera; physiological ones in the eye\'s response; cognitive ones in the brain\'s reading of the picture.',
    'Perception relies on assumptions that are right almost all the time; an illusion is a picture that makes one of them wrong.',
    'Knowing the truth does not remove an illusion; measuring it, or removing its context, does.',
    'The three kinds overlap, and the explanation of many illusions is still debated.'
  ],
  pitfalls: [
    'An illusion means the eyes are faulty — The eyes and brain work as designed. The figure is built so that a sound assumption gives the wrong answer, and everyone with ordinary vision sees the same effect.',
    'An illusion is a kind of hallucination — A hallucination has no stimulus. An illusion is a misreading of a real stimulus and it is repeatable.',
    'Illusions are all in the head — Some are in the light: a camera records the bent pencil and the mirage as well.',
    'If I understand it, it will go away — Knowing the Müller-Lyer lines are equal does not shorten the arrowed one. Only measuring, or removing the fins, does.'
  ],
  terms: [
    { term: 'Optical illusion', also: ['visual illusion'], def: 'A systematic, repeatable mismatch between what is perceived and what can be measured in the stimulus.' },
    { term: 'Physical illusion', def: 'An illusion created by the optics of the scene (refraction, reflection, scattering) before the light reaches the eye. A camera records it too.' },
    { term: 'Physiological illusion', def: 'An illusion that arises in the response of the eye\'s receptors and early neural pathways, such as adaptation and lateral inhibition.' },
    { term: 'Cognitive illusion', def: 'An illusion that arises in the brain\'s inference about the scene, from its assumptions about depth, light and objects.' },
    { term: 'Hallucination', def: 'A percept with no external stimulus behind it. It is not an illusion, which misreads a real stimulus.' },
    { term: 'Apparent depth', also: ['virtual depth'], def: 'The depth at which something under water seems to lie when seen from above: the real depth times n_viewer / n_object, about 0.75 for water seen from air straight down.' }
  ],
  formulas: [
    {
      name: 'Apparent depth (looking straight down)',
      expr: 'da = d*nv/no', tex: 'd_a = d\\,\\frac{n_v}{n_o}',
      vars: {
        da: { name: 'apparent depth', q: 'length', unit: 'm', tex: 'd_a' },
        d: { name: 'real depth', q: 'length', unit: 'm', value: 1.2, tex: 'd' },
        no: { name: 'index of the medium the object is in', value: 1.334, min: 1, max: 3, tex: 'n_o' },
        nv: { name: 'index of the medium the viewer is in', value: 1.0, min: 1, max: 3, tex: 'n_v' }
      },
      solveFor: 'da',
      note: 'Paraxial: for a viewer looking almost straight down. At a slant the apparent depth is smaller still.',
      stories: { da: 'A swimming pool is {d} deep and the water has an index of {no}. How deep does the bottom seem to someone looking straight down into it from air?' }
    }
  ],
  examples: [
    {
      title: 'The pool that is not as deep as it looks',
      q: 'A pool is 1.20 m deep (water, $n = 1.334$). How deep does the bottom seem looking straight down, and looking from 60° from the vertical?',
      steps: [
        { text: 'Straight down, apply the apparent-depth rule:', tex: 'd_a = d\\,\\frac{n_v}{n_o} = 1.20 \\times \\frac{1.000}{1.334} = 0.90\\ \\mathrm{m}' },
        'At 60° the ray in the water makes an angle $\\theta_w$ with $\\sin\\theta_w = \\sin 60° / 1.334 = 0.649$, so $\\theta_w = 40.5°$.',
        { text: 'The ratio of seen to real depth for a slanted line of sight is the ratio of the tangents:', tex: '\\frac{d_a}{d} = \\frac{\\tan\\theta_w}{\\tan\\theta_a} = \\frac{0.853}{1.732} = 0.49' }
      ],
      a: '0.90 m straight down, about 0.59 m (a ratio of 0.49) from 60° off the vertical: the pool looks shallower the lower you look.'
    },
    {
      title: 'Which kind is it?',
      q: 'A bright line seems to run along the edge where a grey ramp meets its light plateau. A photograph of the ramp shows no such line, and it vanishes when you cover the edge with a thin strip. Which kind of illusion is it?',
      steps: [
        'A photograph records no line, so the light carries none: it is not physical.',
        'Covering a few pixels at the edge removes it, so it depends on the stimulus at the edge and on how neighbouring regions are compared, not on any story the picture tells.',
        'That is the signature of the retina and early pathways comparing each point with its surroundings.'
      ],
      a: 'Physiological: a Mach band, produced by lateral inhibition.'
    }
  ],
  quiz: [
    { q: 'A straight pencil in a glass of water looks bent in a photograph taken from the side. What kind of illusion is this?', choices: ['Physical', 'Physiological', 'Cognitive', 'A hallucination'], a: 0, why: 'The bending is made by refraction at the water surface, in the light itself, so a camera records it too.' },
    { q: 'Once you know that the two Müller-Lyer lines are equal, they stop looking different.', a: false, why: 'Cognitive illusions survive knowledge. The effect comes from the way the figure is read, not from a belief you can change at will. Measuring the lines, or removing the fins, is what works.' },
    { q: 'You stare at a green disc for half a minute, then look at a white wall and see a pinkish disc. Which statement fits best?', choices: ['The wall has changed colour', 'The cones that signalled green have adapted, so the white seems pink: a physiological effect', 'The brain has misjudged the distance of the disc', 'The eye is damaged'], a: 1, why: 'The pink ghost is an afterimage, produced by adaptation in the visual pathway; nothing on the wall has changed and the eye is healthy.' },
    { q: 'A fish tank is 40 cm deep and full of water ($n = 1.33$). How deep does the bottom seem looking straight down, in centimetres?', answer: 30, unit: 'cm', why: '$d_a = 40 \\times 1.000 / 1.33 = 30$ cm.' },
    { q: 'Which question best separates a physical illusion from a cognitive one?', choices: ['Would a camera or instrument record it?', 'Is it colourful?', 'Does it appear quickly?', 'Do most people agree about it?'], a: 0, why: 'A physical illusion is in the light and shows up on a camera; a cognitive one is in the viewer\'s reading of the picture. Many people agreeing is true of all three kinds.' }
  ],
  applications: [
    'Underwater work, angling and spear fishing: submerged objects are shallower than they look, and the correction must be applied when aiming or judging a depth.',
    'The design of signs, displays and road markings, which are made for how people see rather than for what a ruler reads.',
    'Magic and stagecraft, which combine physical, physiological and cognitive effects.',
    'Vision research, where illusions are the standard way to find which assumptions the visual system makes.',
    'Photography and film, where cameras record physical illusions but not afterimages or Mach bands.'
  ],
  history: 'The study of illusions is as old as the study of vision. Ptolemy wrote on refraction and on the apparent size of the Moon in the second century, and Ibn al-Haytham discussed errors of vision in his book on optics in the eleventh. The nineteenth century gave most of the named figures (Necker 1832, Mach 1865, Müller-Lyer 1889). In 1997 Richard Gregory proposed sorting illusions into ambiguities, distortions, paradoxes and fictions.',
  sources: [
    'R. L. Gregory, *Eye and Brain: The Psychology of Seeing* — the chapters on illusions and on perception as inference.',
    'S. E. Palmer, *Vision Science: Photons to Phenomenology* — perception as inference.',
    'N. J. Wade, *Perception and Illusion: Historical Perspectives* — the history of the named illusions.'
  ],
  sim: 'vi-three-kinds'
},

/* ================================================================ size and length */
{
  id: 'size-and-length-illusions', parent: 'visual-illusions', title: 'Illusions of size and length', level: 1,
  short: 'Equal lengths and sizes that look unequal: the Müller-Lyer arrows, the Ponzo railway lines, the Ebbinghaus circles, the upright line that looks longer than the flat one, and the Delboeuf rings. A ruler cures them; knowing better does not.',
  keywords: ['Müller-Lyer', 'Ponzo', 'Ebbinghaus', 'Titchener circles', 'Delboeuf', 'vertical-horizontal illusion', 'size illusion', 'length illusion', 'visual angle', 'size constancy', 'Emmert\'s law', 'carpentered world'],
  prereq: ['what-an-optical-illusion-is', 'the-eye-as-a-camera', 'the-fovea-and-visual-acuity'],
  related: ['line-and-angle-illusions', 'depth-and-perspective-illusions', 'the-moon-illusion-and-size-constancy', 'perspective-and-focal-length', 'illusions-in-design-and-safety', 'projections:field-of-view-and-focal-length'],
  body: `
Two things of the same size should look the same size. These figures show that often they do not, and that the reason is the company they keep.

### What the eye has to work with
The eye does not measure size. It receives an image whose size on the retina is set by the **visual angle**

$$\\theta = 2\\arctan\\frac{s}{2d}$$

of an object of size $s$ at distance $d$. A 10 cm line at 50 cm subtends 11.4°; at 1 m, 5.7°. To get from an angle back to a size the brain must allow for distance, and this is where the figures interfere.

### Five classic figures
| Figure | What you see | What is drawn |
|---|---|---|
| Müller-Lyer | the line with fins pointing in looks shorter than the one with fins pointing out | two equal lines |
| Ponzo | the bar nearer the meeting point of two rails looks longer | two equal bars |
| Ebbinghaus (Titchener) | a circle among small circles looks larger than one among large circles | two equal circles |
| Vertical–horizontal | an upright line looks longer than a flat one of equal length, more so when it stands on the middle of the flat one | equal lines |
| Delboeuf | a disc in a close ring looks larger than the same disc in a far ring | two equal discs |

### How large are the effects?
In laboratory matching tasks the Müller-Lyer effect is of the order of a tenth to a quarter of the length, depending on the length and angle of the fins; the vertical–horizontal effect is a few per cent up to about a tenth. They vary from person to person. The simulation measures yours: set the comparison until the two look equal, then read how far from 100 % you landed.

### Why they happen
No single account is accepted. The leading ones are these.
- **Size–distance scaling.** Fins and converging rails look like corners and receding roads. The part that seems farther away is judged larger for the same visual angle, which is *Emmert's law*: perceived size is visual angle times perceived distance. It is clearest for Ponzo. For Müller-Lyer it is argued over, and studies of people in very different surroundings have found differences in susceptibility whose meaning is still debated.
- **Contrast and averaging.** A size is judged against its neighbours, so a circle among small ones seems big and among large ones small (Ebbinghaus, Delboeuf).
- **Early image processing.** The way neurons pool nearby edges shifts where the end of a line seems to be.

### Proving it
You need not take anyone's word. A ruler, or the red guides in the simulation, shows the lines equal; take the context away and the pull goes. The illusion lives in the surroundings, not in the figure.

> [!key] Equal visual angles are not equal sizes to the eye: size is judged against context and apparent distance. A ruler measures; the eye compares.
`,
  ideas: [
    'The eye receives a visual angle, θ = 2 arctan(s / 2d), and must infer size by allowing for distance.',
    'In the classic figures, equal lines or circles look unequal because of the fins, rails, circles or rings around them.',
    'Leading accounts: size–distance scaling (Ponzo, perhaps Müller-Lyer) and size contrast (Ebbinghaus, Delboeuf); none explains all.',
    'The effects are tens of per cent at most and differ between people; a matching task measures your own.',
    'A ruler, or removing the context, shows the truth at once.'
  ],
  pitfalls: [
    'The lines really differ and the ruler is fooling me — The ruler is the check. The lines are equal; the surroundings change how they are judged.',
    'Everyone sees the same size of effect — The effect varies between people, with the figure and with the viewing condition, which is why the matching task reports your own.',
    'A farther object always looks smaller — Size constancy makes a distant object look nearly its true size; it is when distance cues are misleading (Ponzo) that the brain over-corrects.'
  ],
  terms: [
    { term: 'Visual angle', also: ['angular size'], def: 'The angle an object subtends at the eye: θ = 2 arctan(s / 2d). It fixes the size of the retinal image.' },
    { term: 'Müller-Lyer illusion', def: 'Two equal lines look unequal when one ends in fins pointing outwards and the other in fins pointing inwards.' },
    { term: 'Ponzo illusion', also: ['railway lines illusion'], def: 'Two equal bars between converging lines look unequal: the one nearer the apex looks longer.' },
    { term: 'Ebbinghaus illusion', also: ['Titchener circles'], def: 'A circle surrounded by large circles looks smaller than an identical one surrounded by small circles.' },
    { term: 'Size constancy', def: 'The tendency to see an object as having the same size as it moves farther or nearer, although its retinal image changes. It works by allowing for perceived distance.' },
    { term: 'Emmert\'s law', def: 'Perceived size is proportional to the retinal size times the perceived distance: an afterimage looks larger on a farther surface.' }
  ],
  formulas: [
    {
      name: 'Visual angle',
      expr: 'th = 2*atan(s/(2*d))', tex: '\\theta = 2\\arctan\\frac{s}{2d}',
      vars: {
        th: { name: 'visual angle', q: 'angle', unit: '°', min: 0, max: 170, tex: '\\theta' },
        s: { name: 'size of the object', q: 'length', unit: 'cm', value: 10, tex: 's' },
        d: { name: 'distance to the object', q: 'length', unit: 'cm', value: 50, tex: 'd' }
      },
      solveFor: 'th',
      note: 'For small angles, θ ≈ s/d in radians; 1 cm at 57 cm subtends about 1°.',
      stories: { th: 'A line {s} long is held {d} from the eye. What visual angle does it subtend?', d: 'A line {s} long subtends {th}. How far away is it?' }
    }
  ],
  examples: [
    {
      title: 'A door at two distances',
      q: 'A door 2.0 m high is seen from 4 m and from 8 m. What visual angle does it subtend each time?',
      steps: [
        { text: 'From 4 m:', tex: '\\theta = 2\\arctan\\frac{2.0}{2 \\times 4} = 2\\arctan 0.25 = 28.1°' },
        { text: 'From 8 m:', tex: '\\theta = 2\\arctan\\frac{2.0}{2 \\times 8} = 2\\arctan 0.125 = 14.3°' }
      ],
      a: '28.1° and 14.3°. Doubling the distance halves the angle (almost exactly, for small angles), and the brain must undo that to see the same door.'
    },
    {
      title: 'Size from angle and judged distance',
      q: 'Two bars each subtend 5.0°. The Ponzo rails make one seem 3 m away and the other 4 m away. What sizes does size–distance scaling give?',
      steps: [
        { text: 'Size from angle and perceived distance:', tex: 's = 2 d \\tan\\frac{\\theta}{2}' },
        'At 3 m: $2 \\times 3 \\times \\tan 2.5° = 0.262$ m. At 4 m: $2 \\times 4 \\times \\tan 2.5° = 0.349$ m.',
        'The ratio is 4 ÷ 3 = 1.33.'
      ],
      a: '0.26 m and 0.35 m: the bar that seems a third farther is judged a third larger, though both subtend the same angle.'
    }
  ],
  quiz: [
    { q: 'You measure the two lines of a Müller-Lyer figure and find them equal, yet they still look different. What follows?', choices: ['The ruler is wrong', 'The effect is in how the figure is perceived, not in the figure', 'You are not looking properly', 'The fins are bending the lines'], a: 1, why: 'The lines are equal; perception, not the figure, is at fault. Looking harder does not help, and a figure drawn with ink cannot bend.' },
    { q: 'A 10 cm line seen from 1 m subtends twice the visual angle of the same line seen from 2 m.', a: true, why: '2 arctan(0.05) = 5.72° and 2 arctan(0.025) = 2.86°: for small angles the angle is inversely proportional to the distance.' },
    { q: 'Which account fits the Ponzo illusion best?', choices: ['The converging rails suggest distance, and the bar that seems farther is judged larger', 'The lens of the eye focuses the two bars differently', 'The rails bend the bars', 'The upper bar makes a larger image on the retina'], a: 0, why: 'Both bars make the same retinal image. The rails are a perspective cue, and scaling by apparent distance makes the upper bar look larger.' },
    { q: 'A person 1.8 m tall stands 6 m away. What visual angle do they subtend, in degrees?', answer: 17.06, unit: '°', why: '$\\theta = 2\\arctan(1.8 / 12) = 2\\arctan 0.15 = 17.06°$.' },
    { q: 'How do you show that the two central circles in an Ebbinghaus figure are equal?', choices: ['Remove the surrounding circles, or lay a circle of the true size over each', 'Look from further away', 'Close one eye', 'Make the figure larger'], a: 0, why: 'The effect comes from the surround. Removing it, or comparing each circle with a drawn copy of the true size, removes the comparison that fools you.' }
  ],
  applications: [
    'Technical drawings: dimension lines end in arrowheads, just the kind of fin that biases a length judged by eye, so dimensions are read from the figures and never scaled off the drawing.',
    'Graphic design and data display: circles among other circles and bars among distractors are misjudged, which is why charts need a baseline and values on them.',
    'Interior and clothing design: vertical lines and tall features are used to alter apparent proportions, with real but modest effects.',
    'Film and stage: size cues of the Ponzo kind are used to make sets and objects look larger or smaller ([[depth-and-perspective-illusions]]).'
  ],
  history: 'Joseph Delboeuf described his rings in 1865. Franz Carl Müller-Lyer published his figure in 1889, and Mario Ponzo described his in 1911. The circles that bear Ebbinghaus\'s name were made widely known by Edward Titchener in an 1901 textbook. The vertical–horizontal illusion was already familiar to nineteenth-century physiologists.',
  sources: [
    'J. O. Robinson, *The Psychology of Visual Illusion* — the geometrical illusions and their measurement.',
    'S. Coren and J. S. Girgus, *Seeing Is Deceiving: The Psychology of Visual Illusions* — the explanations of the classic figures.',
    'F. C. Müller-Lyer, "Optische Urteilstäuschungen" (1889) — the original description of the arrows.'
  ],
  sim: { id: 'vi-size', params: { fig: 'muller' } }
},

/* ================================================================ lines and angles */
{
  id: 'line-and-angle-illusions', parent: 'visual-illusions', title: 'Illusions of lines and angles', level: 2,
  short: 'Straight, parallel and collinear lines that look bent, tilted or out of line: Zöllner, Hering, Wundt, Poggendorff, the café wall and the Fraser spiral. A straightedge settles each; the causes lie in how neighbouring orientations affect one another.',
  keywords: ['Zöllner', 'Hering', 'Wundt', 'Poggendorff', 'café wall', 'Fraser spiral', 'twisted cord', 'tilt illusion', 'orientation', 'angle illusion', 'parallel lines', 'straightedge'],
  prereq: ['what-an-optical-illusion-is', 'size-and-length-illusions', 'contrast-sensitivity'],
  related: ['brightness-and-contrast-illusions', 'motion-illusions', 'moire-patterns', 'illusions-in-design-and-safety', 'spatial-frequency-and-line-pairs'],
  body: `
Of all the illusions these are the easiest to check: lay a ruler along the line and see. The lines are straight, and the eye insists they are not.

### The figures
| Figure | What you see | What is drawn |
|---|---|---|
| Zöllner | long parallel lines lean, each opposite to its neighbour | exactly parallel lines crossed by short hatches slanted alternately |
| Hering | two straight lines bow outwards, away from where the spokes meet | two straight lines on a fan of spokes |
| Wundt | the reverse: the lines bow inwards | the same lines on fans that meet at the sides |
| Poggendorff | an oblique line behind a bar comes out at the wrong height | a line that continues exactly, hidden by the bar |
| Café wall | the mortar lines between shifted rows of black and white tiles slope in wedges | exactly horizontal, parallel lines |
| Fraser spiral | circles look like a spiral | closed concentric circles of twisted cords |

### A common thread
Most of these involve **orientation**. Neurons in the visual cortex are tuned to the direction of a line, and neighbouring directions influence one another. A line next to lines of a slightly different direction is pushed to look more different from them: this is the *tilt illusion*, and in general small acute angles are exaggerated. In the Zöllner figure each long line leans away from its hatches; in Hering and Wundt the spokes act in the same way along the length of the line. In the Poggendorff figure the acute angle between the oblique line and the edge of the bar is overestimated, which displaces the apparent continuation. In the café wall and the Fraser spiral, small black and white tile edges or twisted cords set out of step produce oriented signals running along the lines at a small angle to them. These accounts fit part of the data; none covers every case, and the details are still researched.

### Where the line should come out
For a line at angle $\\phi$ to the horizontal that passes behind a bar of width $w$, the continuation emerges a height $w\\tan\\phi$ above the point where it went in: for a 4 cm bar and a line at 35°, 2.8 cm. Reported effects grow as the bar is widened, because the gap that the eye must bridge grows with it.

### What changes the effect
- Take the context away (hatches, spokes, the bar, the tile shift, the cords) and the lines look straight at once.
- For the café wall the effect is reported strongest when each row is shifted by about half a tile, a quarter of the black–white period, and the mortar lines are mid-grey; with no shift it vanishes.
- Hatches and spokes must be close to the line to act on it.

### Proving it
The simulation lays a red straightedge on each figure. The long lines of the Zöllner figure, the two lines of the Hering and Wundt figures, the mortar lines and one ring of the spiral all lie exactly under it.

> [!key] These lines are straight: the tilt and bow come from how neighbouring orientations bias one another. A straightedge shows it, and removing the context makes it go.
`,
  ideas: [
    'In these figures the lines are exactly straight, parallel or collinear; the eye is pushed by neighbouring orientations.',
    'Neighbouring orientations repel in the tilt illusion, and small acute angles are exaggerated.',
    'The Poggendorff continuation emerges at a height w tan φ above where the line enters the bar.',
    'Removing the hatches, spokes, bar or tile shift removes the effect; a straightedge shows the truth.',
    'The leading accounts fit part of the data; the details are still debated.'
  ],
  pitfalls: [
    'The lines in a Zöllner figure really converge — They are exactly parallel; a ruler laid along them shows the gaps equal at both ends.',
    'The café wall is a spiral or wedge of tiles — The tiles are the same everywhere; only the mortar lines seem to slope, and they are exactly horizontal.',
    'These illusions are errors of the eye\'s optics — The retinal image is a faithful picture of the figure. The effect arises in how orientations are compared afterwards.'
  ],
  terms: [
    { term: 'Zöllner illusion', def: 'Parallel lines crossed by short slanted hatches, with the slant alternating from line to line, seem to lean and to converge or diverge.' },
    { term: 'Hering illusion', def: 'Two straight parallel lines drawn over a fan of radiating lines seem to bow outwards, away from the centre of the fan.' },
    { term: 'Poggendorff illusion', def: 'An oblique line interrupted by a bar seems to emerge at a different height from where it would have if it continued straight.' },
    { term: 'Café wall illusion', def: 'Rows of alternating black and white tiles, each row shifted along, with mid-grey mortar lines: the horizontal lines seem to slope in wedges.' },
    { term: 'Fraser spiral illusion', also: ['twisted cord illusion'], def: 'Concentric circles made of twisted cords look like a spiral, though each circle is closed.' },
    { term: 'Tilt illusion', def: 'A line seems tilted away from the direction of lines around it, because neighbouring orientations influence each other.' }
  ],
  formulas: [
    {
      name: 'Height at which a line emerges from behind a bar',
      expr: 'dy = w*tan(phi)', tex: '\\Delta y = w\\tan\\phi',
      vars: {
        dy: { name: 'rise across the bar', q: 'length', unit: 'cm', tex: '\\Delta y' },
        w: { name: 'width of the bar', q: 'length', unit: 'cm', value: 4, tex: 'w' },
        phi: { name: 'angle of the line to the horizontal', q: 'angle', unit: '°', value: 35, min: 0, max: 85, tex: '\\phi' }
      },
      solveFor: 'dy',
      note: 'Where an exactly continuing line comes out; the Poggendorff effect is the difference between this and where it seems to.',
      stories: { dy: 'A line rises at {phi} to the horizontal and passes behind a bar {w} wide. How far above its entry point does it emerge on the other side?' }
    }
  ],
  examples: [
    {
      title: 'Where a hidden line comes out',
      q: 'A line at 60° to the horizontal passes behind a bar 3 cm wide. Where, relative to where it went in, does it come out?',
      steps: [
        { text: 'It keeps its slope across the bar, so it rises:', tex: '\\Delta y = w\\tan\\phi = 3 \\times \\tan 60° = 3 \\times 1.732' }
      ],
      a: '5.2 cm higher on the far side. The steeper the line, the more it climbs behind the bar, and the greater the room for error.'
    },
    {
      title: 'A check with a ruler',
      q: 'A ruler laid along the five long lines of a Zöllner figure touches each line at the top and at the bottom of the figure and leaves the gaps between neighbours equal. What does that show?',
      steps: [
        'Parallel lines keep the same distance from each other everywhere.',
        'The gaps are equal at both ends, so the lines are parallel.'
      ],
      a: 'The lines are parallel; the lean is in the viewer\'s perception, produced by the hatching.'
    }
  ],
  quiz: [
    { q: 'You lay a ruler along each long line of a Zöllner figure and find the gaps equal at the top and at the bottom. What does that tell you?', choices: ['The lines are parallel and the lean is an illusion', 'The ruler is slightly bent', 'The lines converge a little', 'The hatching is not exactly slanted'], a: 0, why: 'Equal gaps at both ends mean parallel lines. The figure is exactly drawn; the lean is perceptual.' },
    { q: 'In the Hering illusion the straight lines bow towards the point where the spokes meet.', a: false, why: 'They seem to bow away from it, outwards. In the Wundt figure, where the fans meet at the sides, the lines seem to bow inwards.' },
    { q: 'A line at 45° passes behind a bar 6 cm wide. How far above its entry point does it emerge on the far side?', choices: ['3 cm', '4.2 cm', '6 cm', '8.5 cm'], a: 2, why: '$\\Delta y = w\\tan 45° = 6 \\times 1 = 6$ cm.' },
    { q: 'A line at 30° to the horizontal passes behind a bar 10 cm wide. By how many centimetres does it rise across the bar?', answer: 5.77, unit: 'cm', why: '$\\Delta y = 10 \\tan 30° = 5.77$ cm.' },
    { q: 'What happens to the café wall effect if the rows of tiles are not shifted?', choices: ['It vanishes: the mortar lines look level', 'It gets stronger', 'It reverses', 'It stays the same'], a: 0, why: 'The effect comes from tile edges set out of step. Aligned tiles give plain parallel lines.' }
  ],
  applications: [
    'Tiled floors, wall tilings, fabrics and paving: repeating offset patterns can look warped, a point designers avoid or use.',
    'Engineering drawing and graphic design: lines that cross hatching or patterned fills can look bent, so linework through shaded areas is checked with a straightedge.',
    'Op art and decorative architecture, which use these figures on purpose.',
    'Vision science: the figures are used to probe how the visual cortex processes orientation.'
  ],
  history: 'Johann Karl Friedrich Zöllner noticed his pattern in 1860 on a printed fabric. Ewald Hering described his figure in 1861 and Wilhelm Wundt his in 1898. The Poggendorff figure takes its name from the editor Johann Christian Poggendorff, to whom Zöllner wrote about it in 1860. James Fraser published the twisted-cord spiral in 1908. Richard Gregory and Priscilla Heard gave the café wall its name in 1979, after a tiled café front in Bristol.',
  sources: [
    'R. L. Gregory and P. F. Heard, "Border locking and the café wall illusion", *Perception* 8 (1979).',
    'J. O. Robinson, *The Psychology of Visual Illusion* — the geometrical illusions of angle and direction.',
    'S. Coren and J. S. Girgus, *Seeing Is Deceiving: The Psychology of Visual Illusions*.'
  ],
  sim: { id: 'vi-lines', params: { fig: 'zollner' } }
},

/* ================================================================ brightness and contrast */
{
  id: 'brightness-and-contrast-illusions', parent: 'visual-illusions', title: 'Illusions of brightness and contrast', level: 2,
  short: 'The same grey made to look lighter or darker by its surroundings: simultaneous contrast, the checker shadow, White\'s illusion, Mach bands, the Hermann grid and the Cornsweet edge. They show that vision reports the lightness of surfaces, not the luminance of light, by comparing neighbours and sorting out shadows.',
  keywords: ['simultaneous contrast', 'checker shadow', 'Adelson', 'White\'s illusion', 'Mach bands', 'Hermann grid', 'Cornsweet', 'Craik-O\'Brien-Cornsweet', 'lateral inhibition', 'lightness', 'brightness', 'luminance', 'contrast', 'Michelson contrast', 'Weber contrast'],
  prereq: ['what-an-optical-illusion-is', 'the-retina-rods-and-cones', 'contrast-sensitivity', 'light-and-dark-adaptation'],
  related: ['colour-illusions-and-afterimages', 'line-and-angle-illusions', 'photometric-quantities', 'lumens-candelas-lux-and-nits', 'the-modulation-transfer-function', 'colour-appearance-and-constancy'],
  body: `
A grey patch has one luminance. Whether it looks light or dark depends on what is round it, and the visual system has good reasons for that.

### Luminance, brightness and lightness
**Luminance** is what a meter reads ([[photometric-quantities]]). **Brightness** is how bright something seems. **Lightness** is how light a *surface* seems: white paper or grey paper, whatever the lamp. Vision is built to report lightness, because the colour of the paper matters and the strength of the light usually does not. To do it the eye must discount the lighting, which it does by comparing each region with its neighbours. The illusions are the price of that shortcut.

A screen code of 128 out of 255 gives only 21.6 % of the luminance of white, because the encoding is not linear.

### The figures
| Figure | What you see | What is drawn |
|---|---|---|
| Simultaneous contrast | a grey square looks lighter on a dark ground, darker on a light one | two identical squares |
| Checker shadow | a light tile in shadow looks lighter than a dark tile in the light | the two tiles have the same grey |
| White's illusion | grey bars set into black stripes look lighter than those in white stripes | one grey for every bar |
| Cornsweet edge | one half of a stripe looks darker than the other | the halves are the same; only a thin cusp at the join differs |
| Mach bands | a light band and a dark band at the ends of a soft ramp | a straight ramp or flat steps |
| Hermann grid | grey spots at the crossings of white streets | every crossing is as white as the streets |

### Lateral inhibition and its limits
A retinal cell responds to the difference between a spot and its surround: bright centre excites, bright surround inhibits. At an edge the cell just inside the bright side is inhibited less than one in the middle of a bright field, and the one just inside the dark side is inhibited more than one in the middle of a dark field. That exaggerates edges (the model in the simulation is each point minus the average of its neighbourhood) and gives Mach bands, and it makes a patch on a dark ground look lighter. But it cannot be the whole story: White's illusion goes the *other way* (the bar touching more white looks lighter), the Hermann grid spots follow the streets' straightness and weaken or vanish when they curve, and the checker shadow depends on the shadow's soft edge. Those point to later stages that sort the scene into surfaces and lights.

### Seeing the shadow
In the checker-shadow figure the brain splits the picture into tile *reflectances* and a smooth change of *illumination*. The ratio of a light tile to a dark one is the same in the shadow as outside it (2 : 1 in the simulation), and that ratio is what is judged. A bar of the same grey between the two tiles removes the shadow's context and they match.

### Measuring contrast
$$C_M = \\frac{L_{\\max} - L_{\\min}}{L_{\\max} + L_{\\min}}$$

is the Michelson contrast of a pattern of bars; the Weber contrast of a patch against its ground is $(L - L_b)/L_b$.

> [!key] Vision reports the lightness of surfaces by comparing neighbours and discounting lighting, so the same luminance can look different. Probe the pixels, or join or cover the patches, to see what is drawn.
`,
  ideas: [
    'Luminance is measured; lightness is how light a surface seems, found by comparing each region with its neighbours and discounting the lighting.',
    'Lateral inhibition exaggerates edges and explains Mach bands and simultaneous contrast in part, but not White\'s illusion or all of the Hermann grid.',
    'In the checker shadow the ratio of a light tile to a dark one is unchanged by the shadow, and that ratio is what is judged.',
    'Michelson contrast (Lmax − Lmin)/(Lmax + Lmin) describes a pattern; Weber contrast (L − Lb)/Lb describes a patch on its ground.',
    'Joining the patches, covering the context or probing a pixel shows that the figure is exactly as drawn.'
  ],
  pitfalls: [
    'The squares really are different greys — The read-out says they are identical. The surround changes how light each one looks.',
    'Lateral inhibition explains all brightness illusions — It explains Mach bands well and simultaneous contrast in part. White\'s illusion goes the opposite way and the checker shadow needs the shadow to be seen as a shadow.',
    'A screen grey of 128 is half as bright as white — On a screen with the usual encoding it is about 22 % of the luminance of white.'
  ],
  terms: [
    { term: 'Lightness', def: 'How light a surface seems, judged as a property of the surface rather than of the light falling on it.' },
    { term: 'Simultaneous contrast', def: 'A patch looks lighter on a dark surround and darker on a light one, though its luminance is the same.' },
    { term: 'Mach bands', def: 'A bright band seen on the light side and a dark band on the dark side of a gradual change in brightness, though none is in the stimulus.' },
    { term: 'Lateral inhibition', def: 'The way a receptor\'s signal is reduced by activity in its neighbours. It exaggerates edges and makes the response depend on the surround.' },
    { term: 'Michelson contrast', also: ['C_M', 'visibility'], def: '(L_max − L_min) / (L_max + L_min): the contrast of a pattern of bars, between 0 and 1.' },
    { term: 'Weber contrast', def: '(L − L_b) / L_b: the luminance difference of a patch from its background as a fraction of the background.' }
  ],
  formulas: [
    {
      name: 'Michelson contrast',
      expr: 'CM = (Lmax - Lmin)/(Lmax + Lmin)', tex: 'C_M = \\frac{L_{\\mathrm{max}} - L_{\\mathrm{min}}}{L_{\\mathrm{max}} + L_{\\mathrm{min}}}',
      vars: {
        CM: { name: 'Michelson contrast', min: 0, max: 1, tex: 'C_M' },
        Lmax: { name: 'highest luminance', q: 'luminance', unit: 'cd/m²', value: 90, tex: 'L_{\\mathrm{max}}' },
        Lmin: { name: 'lowest luminance', q: 'luminance', unit: 'cd/m²', value: 30, tex: 'L_{\\mathrm{min}}' }
      },
      solveFor: 'CM',
      note: 'For a periodic pattern of bars; 0 means no pattern and 1 means the dark bars are black.',
      stories: { CM: 'A pattern of bars has luminances of {Lmax} and {Lmin}. What is its Michelson contrast?' }
    },
    {
      name: 'Weber contrast',
      expr: 'CW = (L - Lb)/Lb', tex: 'C_W = \\frac{L - L_b}{L_b}',
      vars: {
        CW: { name: 'Weber contrast', signed: true, tex: 'C_W' },
        L: { name: 'luminance of the patch', q: 'luminance', unit: 'cd/m²', value: 50, tex: 'L' },
        Lb: { name: 'luminance of the background', q: 'luminance', unit: 'cd/m²', value: 10, tex: 'L_b' }
      },
      solveFor: 'CW',
      note: 'Positive for a patch lighter than its ground, between −1 and 0 for a darker one.'
    }
  ],
  examples: [
    {
      title: 'The same patch on two grounds',
      q: 'A patch of screen grey 128 (relative luminance 0.216) lies first on a ground of grey 40 (0.021) and then on grey 215 (0.680). What is its Weber contrast each time?',
      steps: [
        { text: 'On the dark ground:', tex: 'C_W = \\frac{0.216 - 0.021}{0.021} = +9.2' },
        { text: 'On the light ground:', tex: 'C_W = \\frac{0.216 - 0.680}{0.680} = -0.68' }
      ],
      a: '+9.2 on the dark ground and −0.68 on the light one: the same luminance has opposite contrast against the two surrounds, and looks lighter on one and darker on the other.'
    },
    {
      title: 'Why a shadow does not change the ratio',
      q: 'A light tile has relative luminance 0.432 and a dark tile 0.216 in the open. A shadow lets through half of the light. What is the Michelson contrast between the tiles in the open and in the shadow?',
      steps: [
        { text: 'In the open:', tex: 'C_M = \\frac{0.432 - 0.216}{0.432 + 0.216} = 0.33' },
        'In the shadow both luminances are halved: 0.216 and 0.108.',
        { text: 'The factors cancel:', tex: 'C_M = \\frac{0.216 - 0.108}{0.216 + 0.108} = 0.33' }
      ],
      a: '0.33 in both places. A shadow multiplies every luminance by the same factor, so ratios survive it; the visual system relies on that and judges the ratio, which is why the light tile in the shadow looks light.'
    }
  ],
  quiz: [
    { q: 'Two squares have exactly the same grey. One lies on a dark ground and the other on a light one. Which looks lighter, and why?', choices: ['The one on the dark ground: each region is judged against its surround', 'The one on the light ground: it receives more light', 'Neither: they look the same', 'The one on the left'], a: 0, why: 'This is simultaneous contrast. The squares are identical; the surround changes the comparison.' },
    { q: 'In the checker-shadow figure, squares A and B have different luminances.', a: false, why: 'They are exactly the same grey. A is a dark tile in the light and B a light tile in the shadow, which is why the shadow\'s cue matters.' },
    { q: 'Where do Mach bands arise?', choices: ['In the pixels at the ends of the ramp', 'In the response of the eye\'s cells to the start and end of a brightness change', 'Only on colour screens', 'In the lens of the eye'], a: 1, why: 'The ramp is straight and has no bands. The response of cells that compare each spot with its surround overshoots at the ends of the ramp.' },
    { q: 'A pattern of bars has luminances of 90 and 30 cd/m². What is its Michelson contrast?', answer: 0.5, why: '$C_M = (90 - 30)/(90 + 30) = 60/120 = 0.5$.' },
    { q: 'What shows most directly that the grey spots in the Hermann grid are not in the picture?', choices: ['Reading the value at a crossing: it is as white as the street', 'Making the squares bigger', 'Looking from further away', 'Printing the grid in colour'], a: 0, why: 'A probe on a crossing gives the same white as the streets. Nothing grey is drawn there.' }
  ],
  applications: [
    'Image processing: unsharp masking and edge enhancement imitate lateral inhibition to make pictures look sharper.',
    'Photography, printing and display: local-contrast adjustments, dodging and burning, and tone mapping work with, and around, the way lightness is judged.',
    'Signs and lighting: legibility depends on the contrast of the sign against its surround, not on its luminance alone.',
    'Radiology and proofing: images are read in a controlled surround because the surround changes the apparent grey of a feature.',
    'Painting and drawing: painters exaggerate edges and set tones against their neighbours to suggest lightness.'
  ],
  history: 'Ernst Mach described the bands at the ends of a ramp in 1865, and Ludimar Hermann reported his grid in 1870. Craik and O\'Brien described the edge effect in the middle of the twentieth century and Tom Cornsweet analysed it in 1970. Michael White published his illusion in 1979 and Edward Adelson the checker shadow in 1995.',
  sources: [
    'E. H. Adelson, "Lightness perception and lightness illusions", in M. Gazzaniga (ed.), *The New Cognitive Neurosciences*, 2nd ed. (2000).',
    'F. A. A. Kingdom, "Lightness, brightness and transparency: a quarter century of new ideas, captivating demonstrations and unrelenting controversy", *Vision Research* 51 (2011).',
    'T. N. Cornsweet, *Visual Perception* (1970) — lateral inhibition and edge effects.',
    'S. E. Palmer, *Vision Science: Photons to Phenomenology* — lightness and contrast.'
  ],
  sim: { id: 'vi-brightness', params: { fig: 'contrast' } }
},

/* ================================================================ colour illusions and afterimages */
{
  id: 'colour-illusions-and-afterimages', parent: 'visual-illusions', title: 'Colour illusions and afterimages', level: 2,
  short: 'Colours that change with what surrounds them or with what you have just been looking at: the negative afterimage, Bezold spreading, the Munker–White tint of neutral bars, and colour constancy, including the dress that was blue and black or white and gold.',
  keywords: ['afterimage', 'negative afterimage', 'complementary colour', 'Bezold', 'spreading effect', 'Munker', 'Munker–White', 'colour constancy', 'the dress', 'adaptation', 'chromatic adaptation', 'simultaneous colour contrast', 'retinex', 'von Kries'],
  prereq: ['trichromatic-colour-vision', 'opponent-colours', 'brightness-and-contrast-illusions'],
  related: ['colour-appearance-and-constancy', 'white-balance-and-chromatic-adaptation', 'metamerism', 'additive-and-subtractive-mixing', 'colour-wheels-and-harmony', 'physics:color-vision'],
  body: `
Colour is not a property of light alone. It is the visual system's answer to a question about surfaces, and the answer depends on what was seen a moment ago and on what is nearby.

### Afterimages
Stare at a colour for twenty seconds, then look at a plain grey or white field: a ghost of the shape appears in roughly the opposite colour. Red leaves a blue-green ghost, green a pinkish one, blue a yellowish one. The leading account is **adaptation**: the cones that signalled the colour tire, so when a neutral light arrives they answer less than their neighbours and the balance tips the other way. Part of this happens in the photoreceptors and part at later, opponent stages. The swatch in the simulation is a simple model, each channel's gain lowered in proportion to how strongly it was stimulated, in the manner of von Kries; it is schematic, and the exact hue varies with the person and the light.

### Spreading and tinting
- **Bezold spreading.** Thin white lines over a colour make it look lighter and thin black lines make it look darker, though the colour between the lines is the same. The colour seems to spread towards the lightness of the lines: assimilation, not contrast.
- **Munker–White.** Neutral grey bars set into stripes of two colours look tinted, each towards the colour of the stripes along its long edges. The bars are identical. Like White's illusion it runs against simultaneous contrast and is still argued over.

### Colour constancy
A white page in blue shade and in warm lamplight sends very different light to the eye, yet looks white in both. The visual system estimates the light and divides it out. In each channel the light from a surface is the illumination times its reflectance, $L = E\\rho$, and the brain works with $\\rho = L/E$. The rule works when the estimate of $E$ is good, and misleads when the scene allows two estimates.

The photograph of a dress that spread across the internet in 2015 is the best-known case. The same pixels could be a blue-and-black fabric in warm light or a white-and-gold one in blue shade, and people differed in which light they assumed. The dress itself was blue and black. In the simulation, the left picture is fixed; the right one divides out a light of your choosing. With the pale stripe (118, 134, 190) and the dark one (112, 92, 62), a bluish shade gives (159, 154, 187) and (151, 107, 61), a pale lilac and a gold-brown; a yellowish lamp gives (94, 120, 213), a clear blue, and (89, 82, 71), almost black. The colours are chosen here in the manner of the photograph, not measured from it.

### Proving it
Read the colours off the readout, hide the stripes or the lines, isolate the two colours on a plain ground: on their own they look as they are.

> [!key] Colour is a judgement about surfaces: it depends on adaptation, on neighbours and on the light the brain assumes. The stimulus can stay fixed while the colour you see changes.
`,
  ideas: [
    'A negative afterimage is the opposite colour, produced by adaptation of the cones and later stages; nothing coloured is on the screen afterwards.',
    'In Bezold spreading the colour between thin lines is unchanged; the lines pull it towards their own lightness.',
    'In the Munker–White figure the neutral bars are identical; the stripes along their long edges tint them.',
    'Colour constancy divides out an estimate of the light: ρ = L / E. It fails when two lights are equally plausible.',
    'The dress was blue and black; people differed in the light they assumed.'
  ],
  pitfalls: [
    'The afterimage is a colour left on the wall — Nothing is on the wall. The effect is in the viewer\'s visual pathway and moves with the eyes.',
    'The same colour value always looks the same colour — It looks different against different surrounds and under different assumed lights; the dress is the extreme case.',
    'People who saw the dress differently have defective colour vision — They saw the same pixels; they differed in the light they assumed, which is a normal difference in how constancy is applied.'
  ],
  terms: [
    { term: 'Negative afterimage', def: 'The ghost, in roughly the opposite colour and lightness, seen on a neutral field after looking at a colour for some time.' },
    { term: 'Adaptation', def: 'The reduction of a receptor\'s response to a steady stimulus, so that the response to the next stimulus depends on what came before.' },
    { term: 'Bezold spreading', also: ['Bezold effect', 'assimilation'], def: 'A colour seems lighter or darker when thin lines of white or black are laid over it, spreading towards the lines.' },
    { term: 'Munker–White illusion', def: 'Identical bars look differently tinted according to the colours of the stripes along their long edges.' },
    { term: 'Colour constancy', def: 'The tendency of a surface to keep the same apparent colour under a change of illumination, because the illumination is estimated and discounted.' },
    { term: 'Reflectance', also: ['ρ'], def: 'The fraction of the incident light that a surface returns, at each wavelength; the property that colour constancy tries to recover.' }
  ],
  formulas: [
    {
      name: 'Reflectance from received light and assumed illumination',
      expr: 'rho = L/E', tex: '\\rho = \\frac{L}{E}',
      vars: {
        rho: { name: 'estimated reflectance', min: 0, max: 1, tex: '\\rho' },
        L: { name: 'light received from the patch in one channel (relative)', value: 0.3, min: 0, max: 2, tex: 'L' },
        E: { name: 'illumination assumed in that channel (relative)', value: 0.6, min: 0.01, max: 2, tex: 'E' }
      },
      solveFor: 'rho',
      note: 'Applied separately in each colour channel. The same L gives different colours for different assumed E.'
    }
  ],
  examples: [
    {
      title: 'The same light, two assumed illuminants',
      q: 'A patch sends the relative light $(L_R, L_G, L_B) = (0.30, 0.30, 0.45)$ to the eye. The brain first assumes a bluish light $E = (0.60, 0.60, 0.90)$ and then a neutral light $E = (0.60, 0.60, 0.60)$. What reflectance does it infer each time?',
      steps: [
        { text: 'Bluish light, channel by channel:', tex: '\\rho = \\left(\\frac{0.30}{0.60}, \\frac{0.30}{0.60}, \\frac{0.45}{0.90}\\right) = (0.50, 0.50, 0.50)' },
        { text: 'Neutral light:', tex: '\\rho = \\left(\\frac{0.30}{0.60}, \\frac{0.30}{0.60}, \\frac{0.45}{0.60}\\right) = (0.50, 0.50, 0.75)' }
      ],
      a: 'A neutral grey under a bluish light, or a bluish surface under a neutral light. The light received is the same; the colour seen depends on the assumed illumination.'
    },
    {
      title: 'Predict the ghost',
      q: 'You stare at a magenta disc for half a minute and then look at a plain white wall. What colour is the afterimage, roughly?',
      steps: [
        'Magenta is a mix of red and blue light, so the cones that respond to long and short wavelengths are strongly stimulated and adapt.',
        'On the white wall the middle-wavelength cones, which were stimulated much less, answer more strongly than the other two.'
      ],
      a: 'A greenish ghost: the opposite of magenta.'
    }
  ],
  quiz: [
    { q: 'You stare at a blue disc and then look at a plain white wall. The afterimage is…', choices: ['blue again, but fainter', 'yellowish', 'black', 'red'], a: 1, why: 'The cones that signalled blue have adapted, so white seems to lack blue: its complement, yellow.' },
    { q: 'In Bezold spreading, the colour between thin white lines is lighter on the screen than between thin black lines.', a: false, why: 'It is the same colour. The lines make it look lighter or darker; the readout gives the identical value for the field in every zone.' },
    { q: 'Why can one photograph look blue-and-black to one person and white-and-gold to another?', choices: ['Their cones have different peak wavelengths', 'They assume different illuminants and discount different lights', 'The screen shows each of them different pixels', 'Colour perception is random'], a: 1, why: 'The pixels are the same. The brain divides out the light it assumes, and two assumed lights give two colours.' },
    { q: 'A patch sends 0.24 (relative) of red light to the eye, and the red component of the illumination is estimated at 0.80. What reflectance in red does the brain infer?', answer: 0.3, why: '$\\rho = L/E = 0.24/0.80 = 0.30$.' },
    { q: 'How do you show that the bars in the Munker–White figure are identical in colour?', choices: ['Hide the stripes, or read the value of a bar', 'Look from further away', 'Make the stripes brighter', 'Turn the figure upside down'], a: 0, why: 'On a plain ground the bars match; the value read off each bar is the same.' }
  ],
  applications: [
    'Photography and video: automatic white balance estimates the light the way vision does, and it fails on the same scenes, such as mixed lighting.',
    'Colour matching in printing, textiles and paint: colours are judged under a standard light and against a neutral surround, because both change how a colour looks.',
    'Glare and flashes: a bright light leaves an afterimage that blots out vision for a moment, which matters for driving at night and after a camera flash.',
    'Interface design: colours on a coloured ground shift in apparent hue and lightness, so a design is checked on the ground it will be used on.'
  ],
  history: 'Aristotle noted afterimages, and Goethe described afterimages and coloured shadows in his Theory of Colours of 1810. Wilhelm von Bezold, who studied colour in the design of carpets, described the spreading effect in the 1870s. Edwin Land and John McCann put forward the retinex theory of colour constancy in 1971. The photograph of the dress went around the world in 2015.',
  sources: [
    'M. D. Fairchild, *Color Appearance Models* — adaptation, constancy and simultaneous contrast.',
    'R. Lafer-Sousa, K. L. Hermann and B. R. Conway, "Striking individual differences in color perception uncovered by \'the dress\' photograph", *Current Biology* 25 (2015).',
    'E. H. Land and J. J. McCann, "Lightness and retinex theory", *Journal of the Optical Society of America* 61 (1971).',
    'G. Wyszecki and W. S. Stiles, *Color Science* — chromatic adaptation.'
  ],
  sim: { id: 'vi-colour', params: { fig: 'after' } }
},

/* ================================================================ motion illusions */
{
  id: 'motion-illusions', parent: 'visual-illusions', title: 'Illusions of motion', level: 2,
  short: 'Movement that is not there, or goes the wrong way: apparent (phi and beta) motion from two flashes, the barber pole, the peripheral drift of still rings and the motion after-effect. Motion is computed from change over space and time, and the computation can be fooled.',
  keywords: ['apparent motion', 'phi phenomenon', 'beta movement', 'motion after-effect', 'waterfall illusion', 'barber pole', 'aperture problem', 'peripheral drift', 'rotating snakes', 'Fraser–Wilcox', 'motion detectors', 'correspondence problem', 'terminator'],
  prereq: ['what-an-optical-illusion-is', 'eye-movements', 'flicker-and-persistence-of-vision'],
  related: ['stroboscopic-effects', 'ambiguous-and-impossible-figures', 'the-visual-field', 'light-and-dark-adaptation', 'line-and-angle-illusions'],
  body: `
Vision has no motion sensor in the way a camera has a sensor for light. Movement is *computed*, from the way the image changes from place to place and from moment to moment, and a pattern that fools the computation produces motion where nothing moves.

### Apparent motion
Flash a dot here, then a dot there, with the right gap between them, and one dot seems to cross the space. Film and television rest on this: a film is a series of stills, 24 a second. Max Wertheimer separated the *beta movement*, in which a seen object seems to jump, from the *phi phenomenon*, a pure impression of movement with nothing seen moving. With a gap shorter than about 30 ms the two flashes look simultaneous; from about 30 to 200 ms one dot seems to move; beyond about 300 ms they are separate flashes. The limits shift with the distance between the dots, their brightness and the viewer.

### The barber pole and the aperture problem
Stripes that slide sideways inside a tall narrow window seem to rise. Through a small window a moving straight edge gives only the part of its motion that is perpendicular to itself: this is the **aperture problem**. For stripes at an angle $\\beta$ to their direction of motion, sliding at speed $v$, the speed across the stripes is only $v\\sin\\beta$, while the points where the stripes meet the long edges of the window run along the edge at $v\\tan\\beta$. In a tall window those edge points, the *terminators*, dominate, and the stripes seem to climb. A wide window weakens the effect.

### Peripheral drift
Rings of still sectors that repeat the greys black, dark grey, white, light grey seem to turn when you look around the figure. The effect depends on the order of the steps (reverse the order and the drift reverses), is strongest away from the centre of gaze and with small eye movements, and stops when the contrast is taken out. Its cause is not settled: leading accounts say that dark and light steps are processed at slightly different speeds, which gives small signals that the motion detectors read as movement.

### The motion after-effect
Watch steady motion for twenty seconds and a still scene seems to drift the other way. Rings that expanded seem to shrink. The usual account is adaptation: cells tuned to one direction tire, and when the motion stops the balance with cells tuned to the opposite direction is upset, so that they signal a drift with nothing moving.

### Proving it
In each figure the picture is exactly known: two dots that never move, stripes whose points all go sideways, sectors that never change, a pattern that is still during the test. The read-outs say so.

> [!key] Motion is computed from change in space and time; two flashes, a window, a sequence of greys or a long adaptation can make the computation report motion that is not there.
`,
  ideas: [
    'Two flashes at the right spacing in space and time look like one moving dot (beta motion); film is built on this.',
    'Through an aperture a moving edge gives only its perpendicular component, the aperture problem.',
    'In the barber pole the stripe ends at the long edges move at v tan β and dominate in a tall window, so sideways stripes seem to rise.',
    'Peripheral drift depends on the order of the greys and vanishes when the contrast is removed; the cause is not settled.',
    'After long watching of motion, direction-tuned cells adapt and a still pattern seems to drift the other way.'
  ],
  pitfalls: [
    'The stripes of a barber pole really move upwards — Every point moves sideways as the pole turns. The rise is the motion of the stripe ends along the window\'s edge.',
    'The still rings in peripheral drift are really rotating — Nothing moves; take the contrast out and the effect stops.',
    'The motion after-effect needs eye movements — It occurs when the eyes stay still on a fixation point; the adaptation is in the motion-sensitive cells.'
  ],
  terms: [
    { term: 'Apparent motion', also: ['phi phenomenon', 'beta movement'], def: 'The impression of movement from two stationary stimuli shown in turn at the right spacing in space and time.' },
    { term: 'Aperture problem', def: 'Seen through a small window, a moving edge shows only the component of its motion perpendicular to itself, so its true motion is ambiguous.' },
    { term: 'Terminator', def: 'The point where a moving line ends or meets the edge of the window. Its motion is unambiguous and can dominate the perceived direction.' },
    { term: 'Barber-pole illusion', def: 'Stripes sliding sideways inside a tall narrow window seem to move along the window.' },
    { term: 'Motion after-effect', also: ['waterfall illusion'], def: 'After watching steady motion, a still scene seems to move the opposite way for several seconds.' },
    { term: 'Peripheral drift illusion', def: 'A still pattern of repeated luminance steps seems to move, most strongly in the periphery of the visual field.' }
  ],
  formulas: [
    {
      name: 'Speed of the stripe ends in the barber pole',
      expr: 'vt = v*tan(b)', tex: 'v_t = v\\tan\\beta',
      vars: {
        vt: { name: 'speed of the stripe ends along the window\'s edge', q: 'speed', unit: 'm/s', tex: 'v_t' },
        v: { name: 'sideways speed of the stripes', q: 'speed', unit: 'm/s', value: 0.19, tex: 'v' },
        b: { name: 'angle of the stripes to their motion', q: 'angle', unit: '°', value: 40, min: 1, max: 85, tex: '\\beta' }
      },
      solveFor: 'vt',
      note: 'The steeper the stripes, the faster their ends run along the edge.',
      stories: { vt: 'A barber pole\'s surface moves sideways at {v} and its stripes make {b} with that direction. How fast do the stripe ends rise?' }
    },
    {
      name: 'Speed across the stripes',
      expr: 'vn = v*sin(b)', tex: 'v_n = v\\sin\\beta',
      vars: {
        vn: { name: 'speed perpendicular to the stripes', q: 'speed', unit: 'm/s', tex: 'v_n' },
        v: { name: 'sideways speed of the stripes', q: 'speed', unit: 'm/s', value: 0.19, tex: 'v' },
        b: { name: 'angle of the stripes to their motion', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\beta' }
      },
      solveFor: 'vn',
      note: 'The only component of the motion that a small aperture measures.'
    }
  ],
  examples: [
    {
      title: 'A real barber pole',
      q: 'A pole 12 cm across turns once every 2 s, and its stripes make 40° with the sideways direction. How fast does the surface at the centre of the visible face move, and how fast do the stripes appear to rise?',
      steps: [
        { text: 'The surface speed is the circumference over the period:', tex: 'v = \\frac{\\pi \\times 0.12}{2} = 0.19\\ \\mathrm{m/s}' },
        { text: 'The stripe ends run along the pole at', tex: 'v_t = v\\tan\\beta = 0.19 \\times \\tan 40° = 0.16\\ \\mathrm{m/s}' }
      ],
      a: 'The surface moves sideways at 0.19 m/s and the stripes seem to rise at about 0.16 m/s.'
    },
    {
      title: 'Steeper stripes in the simulation',
      q: 'Stripes sliding at 50 px/s are tilted at 70° to their motion. What are the speeds of the stripe ends and across the stripes?',
      steps: [
        'Ends: $50 \\times \\tan 70° = 50 \\times 2.75 = 137$ px/s.',
        'Across the stripes: $50 \\times \\sin 70° = 50 \\times 0.94 = 47$ px/s.'
      ],
      a: '137 px/s along the edge and 47 px/s across: the edge motion is nearly three times the sideways speed, so steep stripes seem to rise quickly.'
    }
  ],
  quiz: [
    { q: 'Two dots 5° apart flash in turn with 100 ms of darkness between. What do most viewers see?', choices: ['One dot that seems to move across and back', 'Two dots that are steadily on', 'Nothing at all', 'A single dot that does not move'], a: 0, why: 'A gap of this order, for dots this close, usually gives apparent motion. The limits depend on separation, brightness and the viewer.' },
    { q: 'In the motion after-effect the still pattern is really moving slowly.', a: false, why: 'The pattern is perfectly still during the test. The drift is the result of adaptation in direction-tuned cells.' },
    { q: 'Why do sideways-sliding stripes in a tall narrow window seem to rise?', choices: ['The stripe ends at the long edges move along the window and dominate there', 'The stripes really move upwards', 'The eye drifts upwards', 'The window moves'], a: 0, why: 'Every point moves sideways, but where a stripe meets the long edge the meeting point moves vertically, and in a tall window those terminators determine the seen direction.' },
    { q: 'Stripes at 60° to their sideways motion slide at 0.2 m/s. At what speed do the stripe ends travel along the window edge, in m/s?', answer: 0.346, unit: 'm/s', why: '$v_t = v\\tan\\beta = 0.2 \\times \\tan 60° = 0.2 \\times 1.732 = 0.346$ m/s.' },
    { q: 'How do you show that nothing moves in the peripheral-drift rings?', choices: ['Reduce the contrast of the greys to zero: the effect stops though no ring ever moved', 'Look at them for longer', 'Make the figure larger', 'Close one eye'], a: 0, why: 'The rings never change. Removing the luminance steps removes the signals that give the impression of drift.' }
  ],
  applications: [
    'Film, television and animation: moving pictures are series of stills shown fast enough to give apparent motion.',
    'Signs and displays: scrolling text, chasing lights and illuminated arrows depend on apparent motion.',
    'Graphic and interface design: still patterns with repeated luminance steps can seem to shimmer or drift in the periphery and may distract or tire the viewer.',
    'Vision research: adaptation experiments with moving patterns reveal the direction-tuned channels of the visual system.'
  ],
  history: 'Max Wertheimer described the phi phenomenon in 1912. Robert Addams recorded the motion after-effect in 1834 after looking at the Falls of Foyers in Scotland, hence the waterfall illusion. Hans Wallach analysed the barber pole in 1935. The peripheral drift illusion was described by Fraser and Wilcox in 1979, studied by Faubert and Herbert in 1999 and made famous by Akiyoshi Kitaoka\'s rotating snakes.',
  sources: [
    'M. Wertheimer, "Experimentelle Studien über das Sehen von Bewegung", *Zeitschrift für Psychologie* 61 (1912).',
    'S. E. Palmer, *Vision Science: Photons to Phenomenology* — the perception of motion and the aperture problem.',
    'N. J. Wade, *Perception and Illusion: Historical Perspectives* — the history of the motion after-effect.'
  ],
  sim: { id: 'vi-motion', params: { fig: 'phi' } }
},

/* ================================================================ ambiguous and impossible figures */
{
  id: 'ambiguous-and-impossible-figures', parent: 'visual-illusions', title: 'Ambiguous and impossible figures', level: 2,
  short: 'Pictures with more than one reading, or with none that could be built: the Necker cube, Rubin\'s vase, the duck–rabbit, the Penrose triangle and stairs. A picture underdetermines the scene, so the brain picks one reading at a time, and sometimes picks parts that cannot fit together.',
  keywords: ['Necker cube', 'Rubin vase', 'figure and ground', 'duck-rabbit', 'Jastrow', 'Penrose triangle', 'tribar', 'impossible figure', 'Reutersvärd', 'Escher', 'multistable perception', 'bistable', 'ambiguous figure', 'reversal'],
  prereq: ['what-an-optical-illusion-is', 'size-and-length-illusions', 'binocular-vision-and-stereopsis'],
  related: ['depth-and-perspective-illusions', 'motion-illusions', 'the-blind-spot-and-filling-in', 'perspective-and-focal-length', 'projections:the-camera-model'],
  body: `
A picture is flat; the scene it stands for is not. Many different scenes make the same picture, and the brain has to choose one. Ambiguous figures make the choice visible; impossible ones show what happens when no choice works.

### Ambiguous figures
| Figure | The readings | What is drawn |
|---|---|---|
| Necker cube | the lower-left face in front, or the upper-right face | twelve equal lines |
| Rubin's vase | a vase, or two faces in profile | one contour between black and white |
| Duck–rabbit | a duck facing left, or a rabbit facing right | one outline |

You see one reading at a time, and after a few seconds it flips by itself: **multistable perception**. The flips can be slowed or hurried by attention, and their rate differs between people; the simulation counts yours. The usual account is competition between two interpretations, in which the active one tires until the other takes over. Any cue that favours one reading stops the flipping: in the Necker cube, drawing the farther square smaller, as perspective would, or tinting a face or dashing the hidden lines.

In Rubin's figure the question is *which side of the edge is the object*. An edge is taken to belong to the figure, while the other side is ground that seems to run on behind it. Smaller, enclosed, convex, symmetric or coloured regions are favoured as figure.

### Impossible figures
The Penrose triangle is three square bars, each at right angles to the next, that seem to close into a loop. Every corner is plausible; the whole cannot exist. The visual system builds the three-dimensional structure piece by piece and does not check that the pieces fit into one space.

Yet the figure can be *built*. Three straight bars along the three axes of space, open at one corner, look closed from exactly one viewpoint: the end of the third bar lies on the same line of sight as the start of the first, though nearer to you, by $5\\sqrt{3} = 8.7$ cube widths in the model of the simulation. Turn the model and the gap opens. The Penrose stairs, a staircase that climbs for ever, and Escher's *Waterfall* use the same trick of a viewpoint and local consistency.

### Proving it
Count your own flips, then pin the cube with a perspective cue; swap black and white in the vase, colour one side, or draw the single shared contour in red; turn the Penrose model and watch the closed triangle open into three separate bars.

> [!key] A picture fits many scenes, so perception chooses one at a time and can accept parts that cannot be joined. Cues, colour or a change of viewpoint decide the reading.
`,
  ideas: [
    'A flat picture underdetermines the scene; the brain chooses one reading at a time and may flip between equally good ones.',
    'Any cue that favours one reading, such as perspective, a tint or dashed hidden edges, stops the flipping.',
    'In figure and ground, an edge is taken to belong to the figure; the other side seems to continue behind it.',
    'An impossible figure is locally consistent but globally impossible; the brain builds it piece by piece without checking.',
    'The Penrose triangle can be built as an open model that looks closed from one viewpoint.'
  ],
  pitfalls: [
    'The cube really flips in the picture — Nothing changes in the drawing; the two readings fit the lines equally well, and your interpretation alternates.',
    'An impossible figure is a bad drawing — Each corner is drawn correctly. Only the combination cannot exist, and it is built, as an open model, in exhibits.',
    'You can see both readings at once — Not in practice: perception holds one reading at a time and switches between them.'
  ],
  terms: [
    { term: 'Multistable perception', also: ['bistable perception'], def: 'The alternation between two or more readings of an unchanging ambiguous stimulus.' },
    { term: 'Necker cube', def: 'A line drawing of a cube with no depth cues: either of two faces can be seen as the front one.' },
    { term: 'Figure and ground', def: 'The division of a scene into the object (figure), to which an edge is taken to belong, and the background (ground) that seems to continue behind it.' },
    { term: 'Rubin\'s vase', def: 'A figure that can be seen as a vase or as two faces in profile, depending on which side of the shared contour is taken as the figure.' },
    { term: 'Impossible figure', def: 'A drawing that looks like a three-dimensional object but cannot exist as one, such as the Penrose triangle.' },
    { term: 'Penrose triangle', also: ['tribar'], def: 'An impossible figure of three square bars at right angles that seem to form a closed triangle.' }
  ],
  examples: [
    {
      title: 'Counting flips',
      q: 'A viewer counts 14 reversals of a Necker cube in one minute. What is the rate, and how long does an average reading last?',
      steps: [
        'The rate is 14 reversals a minute.',
        { text: 'The mean duration of a reading:', tex: '\\frac{60\\ \\mathrm{s}}{14} = 4.3\\ \\mathrm{s}' }
      ],
      a: '14 a minute, about 4.3 s per reading. Rates differ a good deal between people and fall when attention is held on one reading.'
    },
    {
      title: 'How far in front is the end of the bar?',
      q: 'In the Penrose model each bar is six cubes long, so the end of the third bar is displaced by five cube widths along each of the three axes from the start of the first. How much nearer to you is it from the one viewpoint where it looks closed?',
      steps: [
        'That viewpoint looks along the diagonal $(1, 1, 1)/\\sqrt{3}$ of the cube, so the displacement $(5, 5, 5)$ is parallel to the line of sight.',
        { text: 'Its length along the line of sight is', tex: '5\\sqrt{3} = 8.66' }
      ],
      a: 'About 8.7 cube widths nearer: with cubes 10 cm across, 87 cm. It lies exactly in line with the start, which is why the loop seems closed.'
    }
  ],
  quiz: [
    { q: 'Which cue most reliably stops a Necker cube from flipping?', choices: ['Drawing the farther square smaller, as perspective would', 'Looking at it for longer', 'Making the lines thicker', 'Making the cube larger'], a: 0, why: 'A perspective cue favours one reading, so the ambiguity is gone. Looking longer only makes it flip again.' },
    { q: 'The Penrose triangle can be built as a real three-dimensional object that looks closed from one viewpoint.', a: true, why: 'Three straight bars at right angles, open at one corner, can be arranged so that the end of the third bar lies exactly in line with the start of the first.' },
    { q: 'In Rubin\'s figure, to which side does the shared contour belong?', choices: ['Whichever side is seen as the figure at that moment', 'Always the vase', 'Always the faces', 'Neither'], a: 0, why: 'An edge belongs to the figure. The reading alternates, so the contour changes sides.' },
    { q: 'A viewer reports 21 reversals of a Necker cube in 90 s. What is the average time between reversals, in seconds?', answer: 4.29, unit: 's', why: '$90/21 = 4.29$ s.' },
    { q: 'Why are the corners of a Penrose triangle plausible but the whole impossible?', choices: ['Each junction is read locally, and the brain does not check that all the parts fit one space', 'The corners are drawn wrongly', 'The figure is three-dimensional', 'The lines are curved'], a: 0, why: 'Every corner is a valid right angle in perspective; only the loop of three of them cannot be placed in one space.' }
  ],
  applications: [
    'Art and graphic design: the prints of M. C. Escher, logos and optical art use ambiguous and impossible figures.',
    'Perception research: bistable stimuli are used to study how the brain resolves ambiguity and how attention affects what is seen.',
    'Engineering drawing: a bare line drawing of a part has several three-dimensional readings, which shading, hidden lines and isometric conventions remove.',
    'Computer vision: recovering three-dimensional structure from a line drawing is ambiguous, so programs need assumptions like those the brain uses.'
  ],
  history: 'Louis Albert Necker, a Swiss crystallographer, described the cube in 1832 after noticing that drawings of crystals seemed to flip. The duck–rabbit, from a German humorous magazine of 1892, was used by Joseph Jastrow in 1899. Edgar Rubin published his vase in 1915. Oscar Reutersvärd drew an impossible triangle in 1934, and Lionel and Roger Penrose published the tribar in 1958. Escher used these figures in his prints of 1960 and 1961.',
  sources: [
    'L. S. Penrose and R. Penrose, "Impossible objects: a special type of visual illusion", *British Journal of Psychology* 49 (1958).',
    'R. L. Gregory, *Eye and Brain: The Psychology of Seeing* — ambiguous figures and perception as inference.',
    'S. E. Palmer, *Vision Science: Photons to Phenomenology* — figure and ground and organization.',
    'E. Rubin, *Synsoplevede Figurer* (1915) — the study of figure and ground.'
  ],
  sim: { id: 'vi-ambiguous', params: { fig: 'necker' } }
},

/* ================================================================ depth and perspective */
{
  id: 'depth-and-perspective-illusions', parent: 'visual-illusions', title: 'Illusions of depth', level: 2,
  short: 'Flat pictures and tricks of geometry that make the brain misjudge distance and so size: the Ames room, the crater and hollow-face illusions that rest on assumed lighting, and forced perspective in film and architecture.',
  keywords: ['Ames room', 'hollow face', 'crater illusion', 'shading', 'light from above', 'forced perspective', 'size constancy', 'depth cues', 'monocular cues', 'perspective', 'trompe l\'oeil', 'anamorphosis'],
  prereq: ['size-and-length-illusions', 'ambiguous-and-impossible-figures', 'binocular-vision-and-stereopsis'],
  related: ['the-moon-illusion-and-size-constancy', 'perspective-and-focal-length', 'stereoscopic-3d-displays', 'autostereograms-and-lenticular-images', 'illusions-in-design-and-safety', 'projections:anamorphosis', 'projections:the-camera-model'],
  body: `
Judging distance is a guess made from clues. Where the clues are faked the guess fails, and size goes wrong with it, because size is judged from the visual angle *and* the assumed distance.

### Depth cues
Two eyes give *disparity* and convergence, which work best within a few metres to a few tens of metres ([[binocular-vision-and-stereopsis]]). One eye is enough for the rest: perspective, relative size, texture, shading, overlap, haze and motion parallax. A flat picture can carry all the monocular cues, and that is how it suggests depth.

### The Ames room
Through a peephole the room looks rectangular, and two people standing in its back corners seem equally far away, yet one looks much larger than the other. The room is built as a trapezoid: each point lies on the same line of sight as a point of a rectangular room, so a single eye at the peephole receives the same picture. In the simulation at full slant one corner is 7.6 m from the peephole and the other 3.8 m, and two people 1.7 m tall subtend 12.6° and 24.1°. The brain prefers an unusual person to an unusual room, having seen many rectangular rooms. From another viewpoint, or with both eyes close up, the slant shows and the effect fails.

### Light from above
Shading is a depth cue that rests on a prior: light comes from above. A disc light at the top and dark below looks like a dome; turned through 180° the same picture looks like a dent. David Brewster described the reversal of cameos and intaglios in 1826. The *hollow-face illusion* adds a stronger prior, that faces are convex: the hollow side of a mask looks like an ordinary protruding face and seems to follow you.

### Forced perspective
An object twice as far away subtends half the angle. To make a distant figure look as big as a near one it must be bigger in proportion to its distance. For small angles

$$h_2 = h_1\\,\\frac{d_2}{d_1}$$

so a figure 3 times as far must be 3 times as tall. Films, theme-park façades with smaller upper floors, and stage scenery use this. It works best with one eye or a fixed camera, because binocular cues and motion parallax betray it. When the picture is made to look right from one point only, it is *anamorphosis* ([[projections:anamorphosis]]).

### Proving it
Slide the Ames room's slant to zero: the room is square and the people look equal. Turn the light through 180° and every bump swaps. Press *Make them look equal* to see the height that forced perspective needs.

> [!key] Size is judged from visual angle and assumed distance. Fake the distance cues, the light direction or the room, and size and shape are misjudged; a second viewpoint exposes the trick.
`,
  ideas: [
    'Perceived size comes from visual angle and assumed distance; faked distance cues change perceived size.',
    'The Ames room is a trapezoid built so that one eye at the peephole receives the picture of a rectangular room.',
    'Shading is read with the assumption that light comes from above; turning a shaded disc by 180° swaps dome and dent.',
    'Forced perspective: h₂ = h₁ d₂ / d₁ makes a farther object look the same size (for small angles).',
    'A second viewpoint or both eyes at close range betrays all of these effects.'
  ],
  pitfalls: [
    'The people in the Ames room are really different sizes — They are the same height. Their distances differ, and the visual system assumes equal distance.',
    'Depth illusions fool only people who do not know the trick — Knowing the trick does not remove the effect, only a change of viewpoint does.',
    'Forced perspective needs the far object to be the same size as the near one — It must be larger in proportion to its distance to subtend the same angle.'
  ],
  terms: [
    { term: 'Ames room', def: 'A distorted room built to look rectangular from one viewpoint, so that people standing in it seem to change size.' },
    { term: 'Depth cue', def: 'Any feature of an image that tells about distance: perspective, relative size, shading, overlap, disparity and others.' },
    { term: 'Forced perspective', def: 'A trick that makes something look nearer, farther, bigger or smaller by choosing sizes and positions that give the visual angle wanted from one viewpoint.' },
    { term: 'Hollow-face illusion', def: 'The concave side of a face mask looks like an ordinary convex face, because the brain expects faces to be convex.' },
    { term: 'Crater illusion', def: 'A shaded disc looks like a dome or a dent according to the direction of the shading, because the brain assumes the light comes from above.' },
    { term: 'Size-distance invariance', def: 'The idea that perceived size follows from visual angle and perceived distance together.' }
  ],
  formulas: [
    {
      name: 'Forced perspective',
      expr: 'h2 = h1*d2/d1', tex: 'h_2 = h_1\\,\\frac{d_2}{d_1}',
      vars: {
        h2: { name: 'height of the far figure', q: 'length', unit: 'm', tex: 'h_2' },
        h1: { name: 'height of the near figure', q: 'length', unit: 'm', value: 1.8, tex: 'h_1' },
        d1: { name: 'distance to the near figure', q: 'length', unit: 'm', value: 4, tex: 'd_1' },
        d2: { name: 'distance to the far figure', q: 'length', unit: 'm', value: 12, tex: 'd_2' }
      },
      solveFor: 'h2',
      note: 'Small-angle rule for equal visual angles; the exact height also depends on the eye height.',
      stories: { h2: 'A person {h1} tall stands {d1} from a camera. How tall must a figure {d2} away be to look the same size in the picture?' }
    }
  ],
  examples: [
    {
      title: 'A giant behind a person',
      q: 'A person 1.8 m tall stands 4 m from a camera and a second figure stands 12 m away. How tall must the second figure be to look the same size?',
      steps: [
        { text: 'The distance ratio is 12 ÷ 4 = 3, so', tex: 'h_2 = 1.8 \\times \\frac{12}{4} = 5.4\\ \\mathrm{m}' },
        'With an eye height of 1.6 m the exact figure for equal angles is 5.3 m.'
      ],
      a: 'About 5.4 m (5.3 m exactly): three times as far, three times as tall.'
    },
    {
      title: 'Two people in an Ames room',
      q: 'In an Ames room the two back corners are 7.6 m and 3.8 m from the peephole. Two people, each 1.7 m tall, stand there. What visual angle does each subtend?',
      steps: [
        { text: 'Far corner:', tex: '\\arctan\\frac{1.7}{7.6} = 12.6°' },
        { text: 'Near corner:', tex: '\\arctan\\frac{1.7}{3.8} = 24.1°' }
      ],
      a: '12.6° and 24.1°, a ratio of about 2. The brain takes the corners as equally far and the nearer person as twice the size.'
    }
  ],
  quiz: [
    { q: 'In an Ames room, why does the nearer person look larger?', choices: ['The room looks rectangular, so both seem equally far away; the larger visual angle is read as a larger person', 'The nearer person is taller', 'The lens of the eye magnifies near objects', 'The light is brighter on the near side'], a: 0, why: 'The people are the same height. The room is built so that the distances look equal, and size is then judged from the visual angle alone.' },
    { q: 'A shaded disc that looks like a dome with light from above looks like a dent when the picture is turned through 180°.', a: true, why: 'The same picture, rotated, has the shading reversed, and the brain assumes light from above.' },
    { q: 'A figure is 3 times as far from the camera as another. To look the same size in the picture it must be…', choices: ['3 times as tall', 'The same height', '9 times as tall', 'A third as tall'], a: 0, why: 'Visual angle is height divided by distance, so equal angles need heights in proportion to the distances.' },
    { q: 'A model 0.30 m tall is 2 m from a camera. How tall must a second model 10 m away be to look the same size, in metres?', answer: 1.5, unit: 'm', why: '$h_2 = 0.30 \\times 10/2 = 1.5$ m.' },
    { q: 'What breaks the Ames room illusion?', choices: ['Looking with both eyes from close up, or from another viewpoint', 'Looking for longer', 'Closing the other eye', 'Making the room brighter'], a: 0, why: 'The picture is only right for one eye at the peephole. Disparity and a different viewpoint reveal the slant of the walls.' }
  ],
  applications: [
    'Film sets and photography: forced perspective makes figures and props look larger or smaller, now often combined with digital methods.',
    'Architecture and theme parks: upper storeys built smaller make a façade look taller; stage scenery and slanted floors make a stage look deeper.',
    'Interface design: buttons and icons are lit from above so that they read as raised and can be pressed.',
    'Street art: pavement pictures are drawn as anamorphic images that look three-dimensional from one spot.',
    'Aviation: the same misjudgements of size and distance underlie runway illusions ([[illusions-in-design-and-safety]]).'
  ],
  history: 'David Brewster described the reversal of cameos and intaglios in 1826. Adelbert Ames Jr., an American painter and ophthalmologist, devised his distorted room in the 1930s, and it was built and demonstrated in the 1940s. Richard Gregory studied the hollow mask from the 1970s.',
  sources: [
    'W. H. Ittelson, *The Ames Demonstrations in Perception* (1952).',
    'R. L. Gregory, *Eye and Brain: The Psychology of Seeing* — depth cues and the hollow mask.',
    'S. E. Palmer, *Vision Science: Photons to Phenomenology* — depth perception and size constancy.'
  ],
  sim: { id: 'vi-depth', params: { fig: 'ames' } }
},

/* ================================================================ the blind spot and filling-in */
{
  id: 'the-blind-spot-and-filling-in', parent: 'visual-illusions', title: 'The blind spot and filling-in', level: 2,
  short: 'Where the optic nerve leaves the eye there are no receptors: a blind spot about 15° to the side of where you look, which you never notice because the brain fills it in. Troxler fading and the Kanizsa triangle show the same filling-in at work.',
  keywords: ['blind spot', 'optic disc', 'scotoma', 'Mariotte', 'filling-in', 'Troxler fading', 'Kanizsa triangle', 'illusory contours', 'perceptual completion', 'optic nerve head', 'visual field'],
  prereq: ['anatomy-of-the-eye', 'the-retina-rods-and-cones', 'the-visual-field'],
  related: ['perimetry', 'glaucoma-and-the-visual-field', 'eye-movements', 'ambiguous-and-impossible-figures', 'motion-illusions', 'physics:the-eye'],
  body: `
Each eye has a place where it cannot see, and you have never noticed it. Finding it is one of the quickest ways to meet your own visual system.

### Where it is
The fibres of the optic nerve gather and leave the eye through the **optic disc**, 1.5 to 2 mm across, which has no photoreceptors. It lies about 15° to the *temporal* side of the fovea, so in the visual field the right eye's blind spot is to the right of where you look. It subtends about 5° across and 7° high: nearly ten Moons would fit across it.

At viewing distance $d$ its centre is a distance $x = d\\tan 15°$ from the point you fixate, 10.7 cm at 40 cm and 16.1 cm at 60 cm. Its width at 40 cm is about 3.5 cm.

### Find yours
Cover the left eye, look at the cross with the right and move towards or away from the screen until the dot vanishes. The simulation lets you calibrate the screen with a bank card so that the distance it asks for is true. The spot differs a little between people, so adjust the angle or the distance.

### Why you do not see it
- **Two eyes.** The blind spots are in different places in the visual field, so each eye sees what the other misses.
- **Filling-in.** With one eye the brain completes the gap from its surroundings: a line runs on across it, a pattern continues, a plain colour spreads in. The percept is neither a hole nor black. Ramachandran and Gregory showed in 1991 that artificial gaps in a pattern are filled in after a few seconds of steady viewing.

### Troxler fading
Fixate a cross: a faint, soft-edged ring in the periphery fades to the background within seconds. Cells away from the centre respond mainly to change and adapt to a steady image, and the tiny movements of the eye that normally refresh the signal are not enough for a faint, blurred patch. The simulation times yours: a fainter, softer, more distant ring fades sooner.

### The Kanizsa triangle
Three notched discs seem to lie behind a white triangle that is as white as the page and has sharp edges. The brain explains the notches as the corners of a triangle lying in front, and fills in the edges and the surface. Cells in early visual cortex respond to such illusory contours as to real ones. Turn the notches and the triangle goes.

> [!warn] The blind spot is normal, and nothing on this page tests vision. A new dark patch, a curtain or shadow over part of the view, or sudden flashes and floaters are not the normal blind spot: seek urgent eye care.

> [!key] A normal eye has a blind spot of about 5° by 7° some 15° from the point of gaze, hidden by the other eye and by filling-in. Troxler fading and illusory contours show that what we see is partly completed by the brain.
`,
  ideas: [
    'The optic disc has no receptors, so each eye has a blind spot about 15° temporal to the fovea, about 5° wide and 7° high.',
    'At distance d the blind spot is d tan 15° from the point of fixation: 10.7 cm at 40 cm.',
    'It is hidden by the other eye and by filling-in of the surroundings, so a line runs across it and a pattern continues.',
    'Troxler fading: a steady, faint, blurred patch in the periphery fades because peripheral cells adapt.',
    'In the Kanizsa triangle the brain supplies edges and a surface that are not drawn.'
  ],
  pitfalls: [
    'The blind spot is a dark hole in the view — It is not seen as dark or empty; the brain fills it in from its surroundings, which is why you must look for it.',
    'The blind spot is where you see best — The fovea does that. The blind spot is the one place on the retina with no receptors at all.',
    'Finding the blind spot tests your eyes — It is a demonstration of normal anatomy, not a test. Changes in vision should be seen by an eye-care professional.'
  ],
  terms: [
    { term: 'Blind spot', also: ['optic disc', 'optic nerve head'], def: 'The part of the retina where the optic nerve leaves the eye and which has no photoreceptors, about 15° temporal to the fovea.' },
    { term: 'Filling-in', also: ['perceptual completion'], def: 'The completion by the brain of a part of the visual field that is missing or faded, from the surrounding pattern and colour.' },
    { term: 'Troxler fading', also: ['Troxler effect'], def: 'The fading of a steady, faint, blurred stimulus in the periphery of vision when the eyes stay fixed.' },
    { term: 'Illusory contour', also: ['subjective contour'], def: 'An edge seen where none is drawn, as in the Kanizsa triangle, because the surroundings suggest an occluding shape.' },
    { term: 'Scotoma', def: 'A region of the visual field in which vision is reduced or absent. The normal blind spot is a physiological scotoma.' }
  ],
  formulas: [
    {
      name: 'Distance of the blind spot from the point of fixation',
      expr: 'x = d*tan(a)', tex: 'x = d\\tan\\alpha',
      vars: {
        x: { name: 'distance on the screen', q: 'length', unit: 'cm', tex: 'x' },
        d: { name: 'distance from the eye to the screen', q: 'length', unit: 'cm', value: 40, tex: 'd' },
        a: { name: 'angle from the line of sight to the blind spot', q: 'angle', unit: '°', value: 15, min: 1, max: 80, tex: '\\alpha' }
      },
      solveFor: 'x',
      note: 'Measured on a flat screen straight in front of the eye; the angle varies a little between people.',
      stories: { x: 'You look at a screen {d} away. At an angle of {a} from your line of sight, how far from the point of fixation is the blind spot?', d: 'The blind spot is {x} from the fixation point and {a} from the line of sight. How far is the screen?' }
    },
    {
      name: 'Size on the screen that subtends a given angle',
      expr: 'w = 2*d*tan(t/2)', tex: 'w = 2d\\tan\\frac{\\theta}{2}',
      vars: {
        w: { name: 'width on the screen', q: 'length', unit: 'cm', tex: 'w' },
        d: { name: 'distance from the eye to the screen', q: 'length', unit: 'cm', value: 40, tex: 'd' },
        t: { name: 'angular width', q: 'angle', unit: '°', value: 5, min: 0.1, max: 120, tex: '\\theta' }
      },
      solveFor: 'w',
      note: 'With 5° the width of the blind spot.'
    }
  ],
  examples: [
    {
      title: 'Where to put the dot',
      q: 'You sit 50 cm from the screen. How far from the cross must you put a dot to land on the blind spot of your right eye, and how wide is the blind spot there?',
      steps: [
        { text: 'The blind spot lies at 15° from the line of sight:', tex: 'x = 50 \\times \\tan 15° = 13.4\\ \\mathrm{cm}' },
        { text: 'Its width, about 5°:', tex: 'w = 2 \\times 50 \\times \\tan 2.5° = 4.4\\ \\mathrm{cm}' }
      ],
      a: 'About 13.4 cm to the right of the cross for the right eye, and the spot is about 4.4 cm wide at that distance.'
    },
    {
      title: 'Will the dot vanish?',
      q: 'The simulation\'s default dot is 12 mm across and you sit 40 cm away. What angle does it subtend, and is it smaller than the blind spot?',
      steps: [
        { text: 'The angle subtended:', tex: '\\theta = 2\\arctan\\frac{1.2}{2 \\times 40} = 1.7°' },
        'The blind spot is about 5° wide.'
      ],
      a: '1.7°, well inside a blind spot of about 5°: it vanishes once its image falls on the spot.'
    }
  ],
  quiz: [
    { q: 'Which eye\'s blind spot lies to the right of the point you are looking at?', choices: ['The right eye\'s', 'The left eye\'s', 'Both eyes\'', 'Neither'], a: 0, why: 'The optic disc is on the nasal side of the retina, which looks at the temporal side of the visual field: for the right eye, to the right.' },
    { q: 'The blind spot is the same place as the fovea.', a: false, why: 'The fovea is the centre of sharpest vision. The blind spot is about 15° away from it and has no receptors at all.' },
    { q: 'You sit 50 cm from a screen. At 15° from the line of sight, how far from the point of fixation is the blind spot, in centimetres?', answer: 13.4, unit: 'cm', why: '$x = d\\tan 15° = 50 \\times 0.268 = 13.4$ cm.' },
    { q: 'Why does the view show no black hole at the blind spot?', choices: ['The other eye covers it and the brain fills it in from the surroundings', 'There is nothing to see there', 'The lens focuses around it', 'The eye turns constantly'], a: 0, why: 'The blind spots are at different places in the field, and with one eye the brain completes the gap from the surrounding pattern and colour.' },
    { q: 'What best explains Troxler fading?', choices: ['Adaptation of peripheral cells to a steady, faint stimulus; eye movements normally refresh the signal', 'The ring really gets fainter', 'The screen dims', 'The blind spot moves'], a: 0, why: 'The ring is drawn at a constant strength. Peripheral cells adapt to an unvarying input, and the response to a faint blurred patch falls to the level of its surroundings.' }
  ],
  applications: [
    'Perimetry maps the visual field, and the blind spot is a landmark on the map; this page explains the anatomy and is not a test (see [[perimetry]]).',
    'Warning displays: steady, faint items in the periphery fade from view, so alarms are made to change, flash or move.',
    'Image and video processing: filling a gap from its surroundings imitates what the visual system does.',
    'Neuroscience: filling-in studies show that visual cortex represents surfaces and edges, not only points of light.'
  ],
  history: 'Edme Mariotte described the blind spot in the 1660s. Ignaz Troxler described the fading of peripheral stimuli in 1804. Gaetano Kanizsa published his triangle in 1955, and V. S. Ramachandran and Richard Gregory showed in 1991 that artificial gaps in a pattern are filled in.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the optic disc and the visual field.',
    'G. Kanizsa, "Subjective contours", *Scientific American* 234 (1976).',
    'V. S. Ramachandran and R. L. Gregory, "Perceptual filling in of artificially induced scotomas in human vision", *Nature* 350 (1991).',
    'S. E. Palmer, *Vision Science: Photons to Phenomenology* — perceptual completion.'
  ],
  sim: { id: 'vi-blindspot', params: { fig: 'spot' } }
},

/* ================================================================ stroboscopic effects */
{
  id: 'stroboscopic-effects', parent: 'visual-illusions', title: 'Stroboscopic effects and the wagon wheel', level: 2,
  short: 'When something moving is seen only at regular instants, by film, video or a flickering lamp, it can seem to stand still or turn backwards: the wagon-wheel effect is sampling in time, the same aliasing as in a digitized signal. Rotating machinery under flickering light can look stopped, a real workshop hazard.',
  keywords: ['stroboscopic effect', 'wagon wheel', 'aliasing', 'temporal sampling', 'flicker', 'stroboscope', 'phenakistoscope', 'Plateau', 'Faraday', 'frame rate', 'apparent speed', 'rotating machinery', 'mains flicker'],
  prereq: ['motion-illusions', 'flicker-and-persistence-of-vision', 'nyquist-sampling-and-aliasing'],
  related: ['drivers-dimming-and-flicker', 'rolling-and-global-shutter', 'camera-artefacts-as-illusions', 'shutter-speed-and-motion', 'triggering-and-strobing', 'moire-patterns', 'electronics:sampling-nyquist'],
  body: `
A wheel turns steadily, yet on film it seems to stand still or to creep backwards. The wheel is not at fault: the film sees it only 24 times a second.

### Sampling in time
A camera, a display or a flickering lamp shows the world at instants, not continuously. If the thing repeats (spokes, blades, the marks on a drum), the eye, comparing one view with the next, takes each spoke to have moved to the *nearest* spoke position. With $N$ spokes the pattern repeats every $p = 360°/N$, and between views a wheel at $f$ turns a second, seen $f_s$ times a second, turns $\\Delta\\theta = 360°\\,f/f_s$. Reduce $\\Delta\\theta$ to the range $-p/2$ to $+p/2$ and that is the step you see.
- Less than half a spoke gap: the motion is seen correctly.
- Exactly a whole number of gaps: the wheel seems to stand still.
- More than half a gap: it seems to go backwards.

In terms of rates, the seen rate is $f_a = f - k f_s/N$, with the whole number $k$ chosen to make $|f_a|$ smallest. It stands still when $N f = k f_s$.

| True speed (8 spokes, 24 frames/s) | Step between frames | What is seen |
|---|---|---|
| 1.0 turns/s | 15° | 1.0 forwards |
| 2.0 turns/s | 30° | 1.0 backwards |
| 2.8 turns/s | 42° | 0.2 backwards |
| 3.0 turns/s | 45° | still |
| 3.2 turns/s | 48° | 0.2 forwards |
| 4.0 turns/s | 60° | 1.0 forwards |

Marking one spoke makes the pattern repeat once a turn, so the true direction is seen until the step exceeds half a turn.

### Mains light and machines
A lamp on the mains pulses at twice the mains frequency, 100 Hz at 50 Hz and 120 Hz at 60 Hz, and some lamps modulate deeply. Anything that repeats at a multiple of that rate looks still. A four-bladed fan at 1500 rpm (25 turns a second) passes 100 blades a second and seems to stand still under 100 Hz flicker; at 1470 rpm the seen rate is $24.5 - 100/4 = -0.5$ turns a second, a slow turn *backwards* of 30 rpm.

> [!warn] Never judge by eye that a machine has stopped. Under flickering light a fast-turning part can look still or slow. Isolate and lock out before reaching near it, and use stroboscope-free, high-frequency or flicker-free lighting where machinery turns.

### Without a strobe
Under steady light people sometimes see brief reversals of a fast wheel. This suggests that the visual system itself works in steps; the cause is debated.

### The effect at work
A **stroboscope** flashing at an adjustable rate stops a turning mark when the rate is a multiple of its speed, which measures the speed. Plateau's phenakistoscope of 1832 used the same effect to make drawings move.

> [!key] A wheel seen at instants is read as having moved to the nearest spoke: the seen speed is the true speed folded into plus or minus half a spoke gap per frame. Aliasing in time makes wheels stand still or turn backwards.
`,
  ideas: [
    'Seen at instants, a repeating pattern is read as having moved to the nearest repeat, so fast motion can look slow, still or backwards.',
    'The seen rate is f_a = f − k f_s / N, with k the whole number that makes |f_a| smallest; the wheel stands still when N f = k f_s.',
    'It is aliasing in time, the same arithmetic as sampling a signal below the Nyquist rate.',
    'Marking one spoke makes the pattern repeat once a turn and removes most of the confusion.',
    'Flickering mains light makes turning machinery look still or slow; never judge by sight that a machine has stopped.'
  ],
  pitfalls: [
    'The wagon-wheel effect needs the wheel to turn faster than the frame rate — It needs only a step of more than half a spoke gap: 2 turns a second of an 8-spoke wheel at 24 frames a second already goes backwards.',
    'If a part looks still under a lamp, it has stopped — It may be turning at a speed that the lamp\'s flicker samples exactly. Check with a steady light or isolate it.',
    'The effect lies in the camera only — Steady-light viewing can show it too, and it is the same sampling effect whether the sampler is a camera, a display or a lamp.'
  ],
  terms: [
    { term: 'Stroboscopic effect', def: 'The change in the apparent motion of something moving, caused by seeing it only at regular instants, as under flickering light.' },
    { term: 'Wagon-wheel effect', def: 'A wheel seen at regular instants seems to stand still or turn the wrong way or the wrong speed, because the step between views is read as the nearest spoke position.' },
    { term: 'Temporal aliasing', def: 'The appearance of a false, slower frequency when a rapidly repeating pattern is sampled too slowly in time.' },
    { term: 'Stroboscope', def: 'A lamp that flashes at an adjustable, known rate, used to stop or slow apparent motion and so to measure speeds and to inspect moving machinery.' },
    { term: 'Mains flicker', def: 'The pulsing of a lamp\'s light at twice the mains frequency (100 or 120 Hz), because the power in the lamp rises and falls twice a cycle.' }
  ],
  formulas: [
    {
      name: 'Seen rate of a wheel sampled at regular instants',
      expr: 'fa = f - k*fs/N', tex: 'f_a = f - k\\,\\frac{f_s}{N}',
      vars: {
        fa: { name: 'seen rate (negative: backwards)', q: 'frequency', unit: 'Hz', signed: true, tex: 'f_a' },
        f: { name: 'true turns per second', q: 'frequency', unit: 'Hz', value: 3.2, tex: 'f' },
        k: { name: 'whole number that makes the seen rate smallest', int: true, signed: true, value: 1, tex: 'k' },
        fs: { name: 'frames or flashes per second', q: 'frequency', unit: 'Hz', value: 24, tex: 'f_s' },
        N: { name: 'number of identical spokes or blades', int: true, value: 8, min: 1, max: 100, tex: 'N' }
      },
      solveFor: 'fa',
      note: 'Choose k so that |fa| is the smallest; with one spoke marked, N is 1.',
      stories: { fa: 'A wheel with {N} spokes turns at {f} and is filmed at {fs}. With k = {k}, at what rate does it seem to turn?' }
    },
    {
      name: 'Speeds at which a wheel seems to stand still',
      expr: 'f = k*fs/N', tex: 'f = k\\,\\frac{f_s}{N}',
      vars: {
        f: { name: 'true turns per second', q: 'frequency', unit: 'Hz', tex: 'f' },
        k: { name: 'whole number of spoke gaps passed between views', int: true, value: 1, min: 1, tex: 'k' },
        fs: { name: 'frames or flashes per second', q: 'frequency', unit: 'Hz', value: 24, tex: 'f_s' },
        N: { name: 'number of identical spokes or blades', int: true, value: 8, min: 1, max: 100, tex: 'N' }
      },
      solveFor: 'f',
      note: 'The wheel advances exactly k spoke gaps between views, so every view shows the same picture.'
    }
  ],
  examples: [
    {
      title: 'An 8-spoke wheel on film',
      q: 'A wheel with 8 spokes turns at 3.2 turns a second and is filmed at 24 frames a second. How does it seem to turn?',
      steps: [
        { text: 'The step between frames:', tex: '\\Delta\\theta = 360° \\times \\frac{3.2}{24} = 48°' },
        'The spokes are 360° ÷ 8 = 45° apart, and 48° is one whole gap plus 3°. Each spoke is read as having moved on by just that 3°.',
        { text: 'Seen step 3° per frame, forwards:', tex: 'f_a = 3° \\times \\frac{24}{360°} = 0.2\\ \\mathrm{turns/s}' }
      ],
      a: 'It seems to turn slowly forwards, at 0.2 turns a second, instead of 3.2. At 2.8 turns a second it would seem to turn backwards at 0.2.'
    },
    {
      title: 'A fan under a mains lamp',
      q: 'A fan with four blades turns at 1470 rpm under a lamp that flickers at 100 Hz. How does it appear to turn?',
      steps: [
        { text: '1470 rpm is 24.5 turns a second, so blades pass at', tex: '4 \\times 24.5 = 98\\ \\mathrm{per\\ second}' },
        { text: 'The lamp samples at 100 Hz, so the seen rate is', tex: 'f_a = 24.5 - \\frac{100}{4} = -0.5\\ \\mathrm{turns/s}' }
      ],
      a: 'It seems to turn slowly backwards at 0.5 turns a second (30 rpm), though it is running at 1470 rpm.'
    }
  ],
  quiz: [
    { q: 'A wheel with 12 spokes turns at 2 turns a second and is filmed at 24 frames a second. What does the film show?', choices: ['The wheel stands still', 'It turns forwards at 2 turns a second', 'It turns backwards at 2 turns a second', 'It turns at 24 turns a second'], a: 0, why: '12 spokes × 2 turns = 24 spokes a second, one spoke gap per frame, so every frame shows the same picture.' },
    { q: 'The wagon-wheel effect needs the wheel to turn faster than the camera\'s frame rate.', a: false, why: 'It needs only a step of more than half a spoke gap per frame. An 8-spoke wheel turning 2 times a second at 24 frames a second already seems to go backwards.' },
    { q: 'A wheel with 6 spokes turns at 4.2 turns a second and is filmed at 24 frames a second. At what rate, in turns per second, does it seem to turn (forwards positive)?', answer: 0.2, why: '$f_a = 4.2 - 1 \\times 24/6 = 0.2$ turns a second, forwards.' },
    { q: 'Why can a fan seem still under a fluorescent lamp?', choices: ['The lamp\'s light pulses at twice the mains frequency, and the blades pass at a multiple of that rate, so each flash finds a blade in the same place', 'The fan really stops', 'The lamp is too bright', 'The blades are transparent'], a: 0, why: 'The lamp samples the fan 100 or 120 times a second, and blade positions that repeat at that rate look frozen.' },
    { q: 'What is the safe rule for a machine under flickering light?', choices: ['Never judge by sight that it has stopped; isolate it first', 'If it looks still, it is safe', 'Look at it for longer', 'Dim the lamp'], a: 0, why: 'A fast part can look still or slow under flicker, so only isolation (lock-out) shows that it is safe.' }
  ],
  applications: [
    'Stroboscopic tachometers: a flash rate is tuned until a mark seems to stand still, which gives the speed.',
    'Film and video: frame rates and shutter angles are chosen with the wagon-wheel effect and motion blur in mind.',
    'Lighting design: high-frequency ballasts and flicker-free drivers remove the stroboscopic effect in workshops ([[drivers-dimming-and-flicker]]).',
    'Machine vision: strobed illumination freezes a moving part for the camera ([[triggering-and-strobing]]).',
    'Signal processing: the same folding of rates is aliasing in sampled data ([[electronics:sampling-nyquist]]).'
  ],
  history: 'Michael Faraday described deceptions produced by rotating toothed wheels in 1831. Joseph Plateau\'s phenakistoscope of 1832 and Simon Stampfer\'s stroboscopic discs of 1833 used the effect to make drawings move, and led to the cinema. The wagon-wheel effect under steady light was studied by Schouten in 1967 and by Purves and colleagues in 1996.',
  sources: [
    'D. Purves, B. Paydarfar and T. J. Andrews, "The wagon wheel illusion in movies and reality", *Proceedings of the National Academy of Sciences* 93 (1996).',
    'A. V. Oppenheim and R. W. Schafer, *Discrete-Time Signal Processing* — sampling and aliasing.',
    'M. Faraday, "On a peculiar class of optical deceptions", *Journal of the Royal Institution* (1831).'
  ],
  sim: 'vi-wheel'
},

/* ================================================================ moiré patterns */
{
  id: 'moire-patterns', parent: 'visual-illusions', title: 'Moiré patterns', level: 2,
  short: 'Two fine gratings laid over each other make a coarse pattern of fringes that neither has. The fringe period is d₁d₂ ÷ |d₁ − d₂| for parallel lines and d ÷ (2 sin θ/2) for lines of equal pitch turned by θ: the beat between two close notes, and the arithmetic of aliasing.',
  keywords: ['moiré', 'moire fringes', 'beat', 'grating', 'superposed gratings', 'fringe spacing', 'rotation', 'aliasing', 'screen angles', 'halftone', 'moiré interferometry', 'rosette', 'moiré magnification'],
  prereq: ['what-an-optical-illusion-is', 'spatial-frequency-and-line-pairs', 'superposition-and-phase'],
  related: ['nyquist-sampling-and-aliasing', 'camera-artefacts-as-illusions', 'line-and-angle-illusions', 'the-grating-equation', 'colour-filter-arrays-and-demosaicing', 'stroboscopic-effects', 'electronics:sampling-nyquist'],
  body: `
Lay one fine comb across another and a coarse pattern of bands appears that is in neither. The word *moiré* is French and names watered silk, which shows the pattern where two layers of the fabric are pressed together.

### Two gratings
A grating of pitch $d$ has the spatial frequency $1/d$. Overlay two (two transparencies, two screens, two rows of dots) and the picture contains the sum $1/d_1 + 1/d_2$, too fine to notice, and the difference $|1/d_1 - 1/d_2|$, coarse and plain to see: a *beat*, as two close notes make a slow throb. The period of the fringes is the reciprocal of the beat. For parallel gratings

$$L = \\frac{d_1 d_2}{|d_1 - d_2|}$$

and for two gratings of the same pitch $d$ turned against each other by an angle $\\theta$

$$L = \\frac{d}{2\\sin(\\theta/2)} \\approx \\frac{d}{\\theta}\\ \\text{(small } \\theta,\\ \\text{in radians)}.$$

The general case is $L = d_1 d_2 / \\sqrt{d_1^2 + d_2^2 - 2 d_1 d_2\\cos\\theta}$. With pitches 0.50 mm and 0.52 mm the period is 13 mm, 26 line pitches; turning two 0.50 mm gratings by 2° gives 14.3 mm. For parallel gratings the fringes run parallel to the lines; for a rotation they run across the lines, almost at right angles for a small angle. Identical parallel gratings give no fringes at all, only a uniformly lighter or darker field.

### Magnification
Slide one grating a distance $\\delta$ and the fringes move about $\\delta L/d$, 25 times as far in the 0.50 and 0.52 mm case. A tiny movement becomes a large one, which is the idea behind moiré methods for measuring displacement, strain and shape.

### Circles, print and fabric
Two sets of concentric circles with their centres apart give fringes shaped like hyperbolas. In printing, the inks are laid down as dot screens at different angles, conventionally 15°, 75°, 0° and 45° for cyan, magenta, yellow and black, so that the beat between screens makes a fine rosette instead of a coarse moiré. Two layers of a fabric, or a striped shirt on television, give the unwanted kind.

### Moiré and sampling
A camera sensor is a grating of pixels. A fine regular pattern in the scene (a shirt, a window screen, brickwork) beats with it and makes false coarse bands: aliasing, the same formula with the pixel pitch as one of the two pitches ([[nyquist-sampling-and-aliasing]]). Some cameras put an optical low-pass filter before the sensor to blur detail finer than the pixels can sample. Your own screen is a grating too: lines close to its pixel pitch beat against it.

### Proving it
Set the pitches in the simulation and read the period from the formula; the red bracket marks one period on the picture. Slide the second grating and watch the fringes run faster.

> [!key] Two plain gratings make a coarse beat whose period is d₁d₂ ÷ |d₁ − d₂| or d ÷ (2 sin θ/2). A small shift of one grating moves the fringes many times as far, and sampling by pixels produces the same beat.
`,
  ideas: [
    'Overlaying two gratings gives sum and difference frequencies; the coarse difference is the moiré.',
    'Parallel gratings: L = d₁d₂ / |d₁ − d₂|. Equal pitch turned by θ: L = d / (2 sin θ/2).',
    'A small shift of one grating moves the fringes about L/d times as far: moiré magnifies displacement.',
    'Print screens are set at different angles (15°, 75°, 0°, 45°) to turn a coarse moiré into a fine rosette.',
    'Aliasing in sensors and displays is the same beat between a pattern and the pixel grid.'
  ],
  pitfalls: [
    'Moiré fringes exist in the pattern — Neither grating has them. They appear only where the two overlap, and they move when either one moves.',
    'Moiré is a defect of poor equipment — Any two regular patterns make it, in a perfect image too. It is a defect only when it is unwanted.',
    'The fringes always run parallel to the lines — For parallel gratings they do; when one grating is rotated they run across the lines.'
  ],
  terms: [
    { term: 'Moiré pattern', also: ['moiré fringes'], def: 'A coarse pattern of light and dark bands made by two fine regular patterns, such as gratings or screens, laid over one another.' },
    { term: 'Pitch', also: ['period', 'line spacing'], def: 'The distance from one line of a grating to the next. Its reciprocal is the spatial frequency.' },
    { term: 'Fringe period', also: ['moiré period'], def: 'The distance from one moiré band to the next: d₁d₂ / |d₁ − d₂| for parallel gratings, d / (2 sin θ/2) for rotated ones of equal pitch.' },
    { term: 'Beat', def: 'The slow variation produced by two nearby frequencies added or multiplied, whose frequency is their difference.' },
    { term: 'Screen angle', def: 'The angle at which a halftone dot screen is laid; the four process inks use different angles to avoid coarse moiré.' }
  ],
  formulas: [
    {
      name: 'Moiré period of two parallel gratings',
      expr: 'L = d1*d2/abs(d1 - d2)', tex: 'L = \\frac{d_1 d_2}{|d_1 - d_2|}',
      vars: {
        L: { name: 'moiré period', q: 'length', unit: 'mm', tex: 'L' },
        d1: { name: 'pitch of the first grating', q: 'length', unit: 'mm', value: 0.5, tex: 'd_1' },
        d2: { name: 'pitch of the second grating', q: 'length', unit: 'mm', value: 0.52, tex: 'd_2' }
      },
      solveFor: 'L',
      note: 'The fringes run parallel to the lines. Equal pitches give no fringes (an infinite period).',
      stories: { L: 'Two parallel gratings have pitches of {d1} and {d2}. How far apart are the moiré fringes?' }
    },
    {
      name: 'Moiré period of two gratings of equal pitch, turned by an angle',
      expr: 'L = d/(2*sin(t/2))', tex: 'L = \\frac{d}{2\\sin(\\theta/2)}',
      vars: {
        L: { name: 'moiré period', q: 'length', unit: 'mm', tex: 'L' },
        d: { name: 'pitch of both gratings', q: 'length', unit: 'mm', value: 0.5, tex: 'd' },
        t: { name: 'angle between the gratings', q: 'angle', unit: '°', value: 2, min: 0.1, max: 90, tex: '\\theta' }
      },
      solveFor: 'L',
      note: 'The fringes run nearly at right angles to the lines when the angle is small.'
    }
  ],
  examples: [
    {
      title: 'Two nearly equal gratings',
      q: 'Two parallel gratings have pitches of 0.50 mm and 0.52 mm. How far apart are the fringes, and how far do they move when the second grating is slid by 1 mm?',
      steps: [
        { text: 'Period:', tex: 'L = \\frac{0.50 \\times 0.52}{0.02} = 13\\ \\mathrm{mm}' },
        { text: 'Magnification of a displacement:', tex: '\\frac{L}{d_2} = \\frac{13}{0.52} = 25' }
      ],
      a: 'Fringes 13 mm apart; a 1 mm slide moves them about 25 mm, so the grating\'s motion is magnified 25 times.'
    },
    {
      title: 'Turned gratings',
      q: 'Two gratings of pitch 0.50 mm are turned by 2° against each other. What is the period of the fringes?',
      steps: [
        { text: 'The rotated-gratings formula:', tex: 'L = \\frac{0.50}{2\\sin 1°} = \\frac{0.50}{0.0349} = 14.3\\ \\mathrm{mm}' }
      ],
      a: '14.3 mm, running nearly at right angles to the lines. For small angles $d/\\theta$ gives the same, with $\\theta$ in radians.'
    }
  ],
  quiz: [
    { q: 'Two parallel gratings have pitches 0.40 mm and 0.44 mm. What is the moiré period, in millimetres?', answer: 4.4, unit: 'mm', why: '$L = 0.40 \\times 0.44/0.04 = 4.4$ mm.' },
    { q: 'Two identical gratings laid exactly parallel produce moiré fringes.', a: false, why: 'With equal pitch and no rotation the period is infinite: the field is uniformly lighter or darker, with no bands.' },
    { q: 'In the case of pitches 0.50 and 0.52 mm, the second grating is slid by 1 mm. About how far do the fringes move?', choices: ['25 mm', '1 mm', '13 mm', '0.5 mm'], a: 0, why: 'The fringes move by the displacement times L/d₂ = 13/0.52 = 25.' },
    { q: 'Why do some cameras put an optical low-pass filter before the sensor?', choices: ['To blur detail finer than the pixels can sample, so that it cannot beat with the pixel grid', 'To make the picture warmer', 'To filter out infrared', 'To increase the resolution'], a: 0, why: 'Fine regular detail beats with the pixel grid and makes false coarse bands; blurring it first prevents that.' },
    { q: 'Two gratings of pitch 0.20 mm are turned against each other by 3°. What is the period of the fringes, in millimetres?', answer: 3.82, unit: 'mm', why: '$L = 0.20/(2\\sin 1.5°) = 0.20/0.05235 = 3.82$ mm.' }
  ],
  applications: [
    'Printing: dot screens for the four inks are laid at 15°, 75°, 0° and 45° so that moiré turns into a fine rosette.',
    'Photography and video: patterned cloth, screens and brickwork beat against the sensor, which is why anti-aliasing filters and moiré removal exist.',
    'Engineering measurement: moiré fringe methods read displacement, strain and shape by magnifying small movements of a grating.',
    'Position scales and encoders: two gratings sliding past each other make fringes that a detector can count (see [[motors:incremental-encoders]]).',
    'Textiles: the watered finish of moiré silk and the pattern of two layers of net curtain.'
  ],
  history: 'The word comes from the French name of a watered silk. Lord Rayleigh described the fringes of superposed gratings in 1874. Moiré methods for measuring strain and shape were developed in engineering from the 1940s onwards.',
  sources: [
    'I. Amidror, *The Theory of the Moiré Phenomenon* — the fringes of superposed gratings.',
    'D. Post, B. Han and P. Ifju, *High Sensitivity Moiré* — moiré interferometry and measurement.',
    'R. W. G. Hunt, *The Reproduction of Colour* — screen angles in halftone printing.',
    'Lord Rayleigh, "On the manufacture and theory of diffraction-gratings", *Philosophical Magazine* 47 (1874).'
  ],
  sim: { id: 'vi-moire', params: { type: 'par' } }
},

/* ================================================================ design and safety */
{
  id: 'illusions-in-design-and-safety', parent: 'visual-illusions', title: 'Illusions in design, driving and flying', level: 2,
  short: 'Illusions at work: road markings that change the feel of speed, runway and "black hole" approach illusions that have caught pilots, the size of letters on signs and screens, and camouflage. Design uses what the visual system does; safety respects what it gets wrong.',
  keywords: ['optical speed bars', 'transverse bars', 'road markings', 'black hole approach', 'runway illusion', 'glide slope', 'PAPI', 'visual illusions in aviation', 'sign legibility', 'visual angle', 'screen size', 'dazzle camouflage', 'ergonomics'],
  prereq: ['what-an-optical-illusion-is', 'size-and-length-illusions', 'depth-and-perspective-illusions', 'motion-illusions'],
  related: ['stroboscopic-effects', 'moire-patterns', 'visual-acuity-charts', 'the-fovea-and-visual-acuity', 'glare-and-uniformity', 'car-headlamps-and-driver-cameras', 'ergonomics:visual-ergonomics', 'ergonomics:glare-colour'],
  body: `
The visual system's shortcuts are harmless in daily life and sometimes dangerous at speed. Designers use them; safety rules guard against them.

### Speed bars on roads
Bars painted across a lane at spacings that shrink towards a hazard (a roundabout, a bend, a work zone) raise the rate at which bars pass the driver: rate = speed ÷ spacing. At 60 km/h (16.7 m/s) bars 8 m apart pass 2.1 times a second; once the gap has shrunk to 4 m, 4.2 times a second. The aim is that the driver *feels* faster, since the flow of the scene past the eye is a large part of how speed is judged, and eases off. Reported effects are modest, differ between sites and may fade with familiarity: the bars support signs and physical measures and do not replace them. Rumble strips act through vibration and noise instead.

### Pilots and runways
At night a lit runway beyond dark terrain or water gives few cues for height, the *black hole approach*: pilots feel too high and may descend below the usual 3° glide path. Slope and width illusions have the same effect. An upsloping runway, or a narrower one than the pilot is used to, makes the aircraft seem higher than it is, so a lower approach is flown; a wider one gives the opposite. The defences are instrument guidance, a check of height against distance and visual approach slope lights such as PAPI, whose red and white lamps tell the pilot above or below the slope.

### Letters, screens and signs
A letter of height $h$ subtends the angle $\\alpha$ at distance $D = h/\\tan\\alpha$. A reader with 20/20 acuity needs letters of 5 arc-minutes, so 100 mm letters can at best be read from 69 m, 150 mm letters from 103 m. Reading comfortably wants a margin, say twice the angle, which halves the distance: 150 mm letters then give 52 m, and at 80 km/h (22 m/s) that is 2.3 s to read the sign. On a screen the angle depends on the viewing distance: characters 2.5 mm high at 35 cm on a phone subtend 24.6 arc-minutes. Check the standard that applies to the work.

### Hiding
In 1917 Norman Wilkinson proposed *dazzle* patterns for ships: bold stripes and angles meant to confuse an observer's estimate of speed and heading. How well they worked is uncertain. Ordinary camouflage breaks outlines by contrast and colour.

### Proving it
The simulation gives the rate of bars and the plot of rate against distance, and the reading distances for letters. The same arithmetic of visual angle and rate applies to any design.

> [!key] Speed is partly judged from how fast the scene flows past, size from visual angle and assumed distance. Roads, signs and cockpits are designed around these judgements, and around where they fail.
`,
  ideas: [
    'Bars at shrinking spacing raise the rate at which bars pass (speed ÷ spacing) and make a driver feel faster; real effects are modest.',
    'Black hole, slope and width illusions make a pilot feel too high and fly too low; instruments and approach lights guard against them.',
    'A letter of height h subtends α at the distance D = h / tan α; 20/20 vision needs 5 arc-minutes.',
    'The same visual-angle arithmetic sizes signs, text on screens and markings.',
    'Camouflage and dazzle work on the same assumptions about outline, size and speed.'
  ],
  pitfalls: [
    'Optical bars are a sure way to slow every driver — Reported effects are modest, differ between sites and may fade, so they are used with other measures.',
    'A pilot can trust the visual impression of a glide path at night — The impression can be wrong, which is why approach lights and instruments are used.',
    'A sign legible at 5 arc-minutes is legible enough — That is the limit of 20/20 acuity. Signs are made larger to leave a margin for age, light and the time to read.'
  ],
  terms: [
    { term: 'Optical speed bars', also: ['transverse bars'], def: 'Lines painted across a road at spacings that decrease towards a hazard, raising the rate at which bars pass the driver.' },
    { term: 'Black hole approach', def: 'An approach to a lit runway over dark, featureless ground in which a pilot loses height cues, feels too high and tends to fly too low.' },
    { term: 'PAPI', also: ['precision approach path indicator'], def: 'A row of lights beside a runway that show red and white according to whether the aircraft is below or above the approach slope.' },
    { term: 'Legibility distance', def: 'The greatest distance at which a letter of a given height can just be read: its height divided by the tangent of the smallest angle the reader needs.' },
    { term: 'Dazzle camouflage', def: 'Bold geometric patterns painted on ships in the First World War to confuse an observer\'s estimate of speed and heading.' }
  ],
  formulas: [
    {
      name: 'Rate at which bars pass the driver',
      expr: 'f = v/s', tex: 'f = \\frac{v}{s}',
      vars: {
        f: { name: 'bars passing per second', q: 'frequency', unit: 'Hz', tex: 'f' },
        v: { name: 'speed', q: 'speed', unit: 'km/h', value: 60, tex: 'v' },
        s: { name: 'spacing of the bars', q: 'length', unit: 'm', value: 8, tex: 's' }
      },
      solveFor: 'f',
      note: 'The rate seen at the driver\'s eye; shrinking the spacing raises it.',
      stories: { f: 'You drive at {v} over bars spaced {s} apart. How many bars pass each second?' }
    },
    {
      name: 'Greatest distance at which a letter can be read',
      expr: 'D = h/tan(a)', tex: 'D = \\frac{h}{\\tan\\alpha}',
      vars: {
        D: { name: 'distance', q: 'length', unit: 'm', tex: 'D' },
        h: { name: 'height of the letters', q: 'length', unit: 'mm', value: 100, tex: 'h' },
        a: { name: 'angle the letters must subtend', q: 'angle', unit: '′', value: 5, min: 0.5, max: 600, tex: '\\alpha' }
      },
      solveFor: 'D',
      note: 'Five arc-minutes is the letter size of 20/20 acuity; use a larger angle for a margin.',
      stories: { D: 'Letters {h} high must subtend {a} to be read. From how far away can they be read?' }
    }
  ],
  examples: [
    {
      title: 'Bars that shrink',
      q: 'At 60 km/h, how many bars a second pass the driver when the gap is 8 m, and when it has shrunk to 4 m?',
      steps: [
        'The speed is $60/3.6 = 16.7$ m/s.',
        { text: 'At the first gap and the last:', tex: 'f = \\frac{16.7}{8} = 2.1\\ \\mathrm{s^{-1}} \\qquad f = \\frac{16.7}{4} = 4.2\\ \\mathrm{s^{-1}}' }
      ],
      a: '2.1 bars a second, then 4.2: halving the gap doubles the rate, which is why shrinking gaps feel like acceleration.'
    },
    {
      title: 'How big must the letters be?',
      q: 'A road sign has letters 150 mm high. A reader with 20/20 vision needs 5 arc-minutes. From how far can they be read at best, and how long does a driver at 80 km/h have between the comfortable distance (half the limit) and the sign?',
      steps: [
        { text: 'The limit:', tex: 'D = \\frac{0.150}{\\tan 5\'} = \\frac{0.150}{0.001454} = 103\\ \\mathrm{m}' },
        'Half of that is 52 m. At 80 km/h, 22.2 m/s, the time is $52/22.2 = 2.3$ s.'
      ],
      a: 'At best 103 m; reading comfortably from 52 m leaves 2.3 s at 80 km/h. The time available sets the letter size, not looks.'
    }
  ],
  quiz: [
    { q: 'Optical speed bars are meant to slow drivers mainly because…', choices: ['the rate at which bars pass rises as the spacing shrinks, which makes speed feel higher', 'the bars physically slow the car', 'the bars are brighter than the road', 'they warn of police'], a: 0, why: 'Rate = speed ÷ spacing. Shrinking gaps raise the rate, and a higher flow past the eye feels like higher speed.' },
    { q: 'Bars are 5 m apart and a car travels at 90 km/h (25 m/s). How many bars a second pass the driver?', answer: 5, unit: 'Hz', why: '$f = v/s = 25/5 = 5$ per second.' },
    { q: 'In a black hole approach a pilot tends to feel…', choices: ['too high, and so may fly too low', 'too low, and so may fly too high', 'exactly on the glide path', 'faster than the aircraft is flying'], a: 0, why: 'With no ground cues between the pilot and the lit runway the picture suggests a greater height than the real one, and the pilot descends to correct it.' },
    { q: 'Letters 60 mm high must subtend 5 arc-minutes to be read. From what distance, in metres?', answer: 41.3, unit: 'm', why: '$D = 0.060/\\tan 5\' = 0.060/0.001454 = 41.3$ m.' },
    { q: 'An upsloping runway makes the aircraft seem higher than it is, so a pilot who is not aware of it tends to fly too low.', a: true, why: 'The slope changes the shape the runway makes in the pilot\'s view in the same way as being higher would.' }
  ],
  applications: [
    'Road design: transverse bars at roundabouts, bends and work zones, with signs and physical measures.',
    'Aviation: approach lighting, glide-slope indicators and training in visual illusions guard against black hole, slope and width illusions.',
    'Signs and displays: letter heights are set from the reading distance and the time available, using the visual-angle rule.',
    'Interfaces and workplaces: text size on screens, glare and contrast follow the angle subtended and the surround (see [[ergonomics:visual-ergonomics]]).',
    'Defence: camouflage patterns work on outline and assumed size and speed.'
  ],
  history: 'Transverse bars were tried on British roads from the 1970s. Norman Wilkinson proposed dazzle camouflage for ships in 1917. Visual illusions are taught to pilots as part of aeromedical training, and approach slope lights were introduced to replace judgement by eye.',
  sources: [
    'FAA, *Pilot\'s Handbook of Aeronautical Knowledge*, the chapter on aeromedical factors — visual illusions in flight.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — visual acuity and the angular size of letters.',
    'S. E. Palmer, *Vision Science: Photons to Phenomenology* — perception of speed and size.'
  ],
  sim: { id: 'vi-road', params: { fig: 'bars' } }
}

);
