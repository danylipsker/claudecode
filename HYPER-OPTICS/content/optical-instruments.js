/* HYPER-OPTICS · content/optical-instruments.js — the topic "Optical instruments":
 * angular magnification, the magnifier, eyepieces, the compound microscope and its objectives, illumination and
 * contrast, fluorescence and confocal microscopy, refracting and reflecting telescopes, binoculars, exit pupil
 * and eye relief, periscopes and endoscopes, projectors, spectrometers and monochromators.
 * Simulations: sims/optical-instruments.js (prefix oi-).
 */
Hyper.add(

/* ================================================================ angular magnification */
{
  id: 'angular-magnification', parent: 'optical-instruments', title: 'Angular magnification', level: 1,
  short: 'How large something looks is set by the angle it subtends at the eye, not by its height. An instrument made to be looked into does not have to build a bigger image in space; it has to enlarge that angle. The factor is its angular magnification M: the retinal image becomes M times taller.',
  keywords: ['angular magnification', 'magnifying power', 'visual angle', 'apparent size', 'retinal image', 'M', 'near point', '250 mm', 'lateral magnification', 'telescope magnification', 'subtended angle', 'empty magnification'],
  prereq: ['lateral-and-longitudinal-magnification', 'the-eye-as-a-camera', 'real-and-virtual-images'],
  related: ['the-magnifier', 'the-compound-microscope', 'refracting-telescopes', 'binoculars', 'accommodation', 'the-fovea-and-visual-acuity', 'low-vision-and-magnification', 'physics:magnification', 'physics:optical-instruments'],
  body: `
Hold a coin at arm's length and it hides a thumbnail; leave the same coin on a table across the room and a grain of rice would hide it. The coin did not change. What changed is the **visual angle**: the angle between the two lines of sight to its edges. That angle, not the coin's height, decides how large the coin's picture is on the retina.

### Size on the retina
Light from the two edges of an object crosses at the eye's nodal point, about 17 mm in front of the retina, and keeps its angle on the way in. So the image is

$$h' = L\\,\\tan\\theta \\approx 17\\ \\mathrm{mm}\\times\\theta$$

with $\\theta$ the visual angle and $L$ the nodal distance. One arc-minute (1/60°) makes a retinal image 4.9 µm tall; the foveal cones are about half an arc-minute apart, 2.5 µm. A 1 mm detail held 250 mm from the eye subtends 13.8′ and paints a retinal image 68 µm tall — some 27 cones.

### Angular magnification
A magnifier, microscope, telescope or pair of binoculars is meant to be *looked into*. It does not need to make a large image in space (a telescope's image of the Moon is a few millimetres wide); it needs to make the image *subtend a larger angle*. Its **angular magnification** or magnifying power is

$$M = \\frac{\\tan\\theta'}{\\tan\\theta}$$

where $\\theta'$ is the angle the image subtends at the eye through the instrument and $\\theta$ the angle the object subtends without it. With $M = 10$ the retinal image is ten times taller.

### Lateral or angular?
| Instrument | The number quoted | How it is found |
|---|---|---|
| Magnifier, loupe | angular, against the object at 250 mm | 250 mm ÷ $f$ |
| Microscope | angular, objective × eyepiece | $m_{obj}\\times 250\\ \\mathrm{mm}/f_{eye}$ |
| Telescope, binoculars | angular, against the naked eye at the same object | $f_{obj}/f_{eye}$ |
| Camera, projector, scanner | lateral $m$: image size ÷ object size | $-s_i/s_o$ |

Lateral magnification ([[lateral-and-longitudinal-magnification]]) belongs to instruments that put a real image on a sensor or screen. Angular magnification belongs to those that feed the eye.

### The reference matters
For a magnifier or microscope the "unaided" view is the object at the **conventional near point**, 250 mm: a standard distance, near the closest at which a young adult sees sharply ([[accommodation]]). A telescope needs no convention: the sky is where it is, and M compares the view with and without the instrument.

### What magnification cannot do
Enlarging the angle helps only if the instrument delivers detail to enlarge. The eye resolves about 1′. A 100 mm telescope can just separate stars 1.16″ apart; magnifying by $60/1.16 \\approx 52$ brings that separation to the eye's limit, and a lot more only makes a bigger blur. Beyond about two times the aperture in millimetres, a telescope's extra magnification is **empty**; the same holds for a microscope ([[the-compound-microscope]]).

> [!key] The retinal image is $17\\ \\mathrm{mm}\\times\\tan\\theta$; angular magnification $M = \\tan\\theta'/\\tan\\theta$ multiplies it. Quoted for the eye, it is an angle ratio, not a size ratio, and it is empty when the instrument cannot supply the detail.
`,
  ideas: [
    'The size of the retinal image is 17 mm × tan θ: it depends on the visual angle only.',
    'Angular magnification M = tan θ′ / tan θ compares the angle seen through the instrument with the angle seen without it.',
    'Magnifiers and microscopes compare against an object at 250 mm; a telescope compares against the same distant object.',
    'Lateral magnification is for real images on sensors and screens; angular magnification is for instruments used with the eye.',
    'Magnification beyond what the aperture can resolve is empty: it enlarges blur, not detail.'
  ],
  pitfalls: [
    'A 10× instrument makes the object ten times bigger — It makes the visual angle ten times larger. A telescope\'s real image of a mountain is a few millimetres across; the eye sees it ten times closer in angle, not ten times bigger in space.',
    'Magnifying power is a size ratio like lateral magnification — Lateral $m$ compares image size with object size; angular $M$ compares two angles. The two coincide only by accident of the viewing distance.',
    'The number on a loupe or an eyepiece is a property of the glass alone — It is defined against a 250 mm reference (or, for a telescope, against the naked eye), so it changes if the reference does.',
    'More magnification always shows more — Only up to the resolution limit set by the aperture (diffraction) and the aberrations. Beyond it the image grows larger and fainter without any new detail.'
  ],
  terms: [
    { term: 'Visual angle', also: ['subtended angle', 'apparent size'], def: 'The angle at the eye between the lines of sight to the two ends of an object. It fixes the size of the retinal image: 17 mm × tan θ.' },
    { term: 'Angular magnification', also: ['magnifying power', 'M', 'visual magnification'], def: 'The ratio of the angle subtended at the eye by the image seen through an instrument to the angle subtended by the object without it. The number engraved on loupes, eyepieces, binoculars and telescopes.' },
    { term: 'Conventional near point', also: ['least distance of distinct vision', '250 mm'], def: 'The closest distance at which the eye can focus. For comparing magnifiers and microscopes the conventional value is 250 mm.' },
  ],
  formulas: [
    {
      name: 'Visual angle',
      expr: 'tan(theta) = h/d', tex: '\\tan\\theta = \\frac{h}{d}',
      vars: {
        theta: { name: 'visual angle', q: 'angle', unit: '°', min: 0, max: 89, tex: '\\theta' },
        h: { name: 'size of the object', q: 'length', unit: 'mm', value: 1 },
        d: { name: 'distance from the eye', q: 'length', unit: 'mm', value: 250 }
      },
      solveFor: 'theta',
      note: 'Distance and size in the same units give the angle. Small angles: θ ≈ h/d in radians.',
      stories: { theta: 'A detail {h} across is held {d} from the eye. What visual angle does it subtend?', h: 'At {d} from the eye an object subtends {theta}. How large is it?' }
    },
    {
      name: 'Height of the retinal image',
      expr: 'hr = L*tan(theta)', tex: 'h\' = L\\tan\\theta',
      vars: {
        hr: { name: 'height of the retinal image', q: 'length', unit: 'µm', tex: 'h\'' },
        L: { name: 'nodal point to retina', q: 'length', unit: 'mm', value: 17, fixed: true },
        theta: { name: 'visual angle', q: 'angle', unit: '°', value: 0.2292, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'A schematic-eye value: 17 mm from the rear nodal point to the retina.',
      stories: { hr: 'An object subtends {theta} at the eye. How tall is its image on the retina?' }
    },
    {
      name: 'Angular magnification',
      expr: 'M = tan(tp)/tan(t)', tex: 'M = \\frac{\\tan\\theta\'}{\\tan\\theta}',
      vars: {
        M: { name: 'angular magnification' },
        tp: { name: 'angle seen through the instrument', q: 'angle', unit: '°', value: 2.29, min: 0, max: 89, tex: '\\theta\'' },
        t: { name: 'angle seen without it', q: 'angle', unit: '°', value: 0.2292, min: 0, max: 89, tex: '\\theta' }
      },
      solveFor: 'M',
      note: 'The two angles describe the same object; the second is measured at the reference distance (250 mm for a magnifier, the real distance for a telescope).'
    }
  ],
  examples: [
    {
      title: 'A watchmaker\'s detail',
      q: 'A 0.2 mm feature on a watch movement is held at 250 mm. How large is its retinal image, and how large through a 10× loupe?',
      steps: [
        { text: 'The visual angle without the loupe:', tex: '\\theta = \\arctan\\frac{0.2}{250} = 0.0458^\\circ = 2.75\'' },
        { text: 'The retinal image:', tex: 'h\' = 17\\ \\mathrm{mm}\\times\\tan\\theta = 13.6\\ \\mu\\mathrm{m}' },
        'That is about 5.5 cone spacings (2.5 µm each): barely a blob. Through the 10× loupe $\\tan\\theta\'$ is ten times larger: 27.5′ and a retinal image 136 µm tall, spanning some 55 cones, enough to see the shape.'
      ],
      a: '13.6 µm unaided, 136 µm through the loupe.'
    },
    {
      title: 'The Moon through binoculars',
      q: 'The Moon subtends 0.52°. What size is its retinal image, with the naked eye and with 10× binoculars?',
      steps: [
        { text: 'Naked eye:', tex: 'h\' = 17\\ \\mathrm{mm}\\times\\tan 0.52^\\circ = 0.154\\ \\mathrm{mm}' },
        { text: 'Through the binoculars $\\tan\\theta\'$ is ten times larger, $\\theta\' = 5.19^\\circ$:', tex: 'h\' = 17\\ \\mathrm{mm}\\times 0.0909 = 1.54\\ \\mathrm{mm}' }
      ],
      a: '0.154 mm unaided; 1.54 mm through the binoculars, ten times taller.'
    }
  ],
  quiz: [
    { q: 'A telescope of angular magnification 20 is pointed at a tree. Compared with the naked eye, the tree\'s retinal image is…', choices: ['20 times taller', '20 times brighter', '20 times closer to the retina', 'unchanged in size but sharper'], a: 0, why: 'The retinal image height is 17 mm × tan θ, and M multiplies tan θ. Brightness is a different matter (it does not rise for an extended object), and the retina does not move.' },
    { q: 'Binoculars marked 8× form on the retina an image of a distant bird that is eight times taller than with the naked eye.', a: true, why: 'That is exactly what the angular magnification states: the visual angle (to first order) is eight times larger, so the retinal image is.' },
    { q: 'A 2 mm detail is held 250 mm from the eye. Through how many arc-minutes does it extend? (answer in arc-minutes)', answer: 27.5, why: '$\\arctan(2/250) = 0.458^\\circ = 27.5\'$.' },
    { q: 'The "10×" engraved on a hand loupe is only meaningful because…', choices: ['it is measured against an object at the conventional near point, 250 mm', 'the image is exactly ten times larger in height', 'ten lenses are cemented together', 'the focal length is always 10 mm'], a: 0, why: 'Angular magnification compares two angles; for a magnifier the unaided view is fixed by convention at 250 mm. A 10× loupe has $f = 250/10 = 25$ mm.' },
    { q: 'A 60 mm telescope is used at 300×. What is wrong?', choices: ['The magnification is empty: about 2 per mm of aperture, 120×, is the most that shows new detail', 'Nothing; more magnification is always better', 'A 60 mm lens cannot be focused above 100×', 'The eye cannot see through a 300× eyepiece'], a: 0, why: 'The aperture limits resolution to about 2.3″ (Rayleigh) in green light. Magnification beyond about two per millimetre of aperture merely enlarges the diffraction blur.' }
  ],
  applications: [
    'Aids for low vision: stand magnifiers and spectacle-mounted telescopes enlarge the visual angle so that the retinal image falls on more receptors.',
    'Binoculars and spotting scopes at sports and wildlife: 8× to 10× brings a distant bird or a player into a comfortable visual angle.',
    'Loupes of watchmakers, jewellers, printers and dentists: 2.5× to 10× for work at arm\'s-reach.',
    'Rifle sights and surveying telescopes: the angular scale of the reticle is tied to the instrument\'s magnification.',
    'Microscope and telescope catalogues: the quoted "total magnification" is always an angular magnification against the 250 mm convention.'
  ],
  history: 'The first telescopes appeared in the Netherlands in 1608. Galileo built his own in 1609 from a magnification of about 3 and soon reached some 20 to 30, and used them to see the craters of the Moon and the moons of Jupiter.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the simple magnifier, the microscope and the telescope in terms of angular magnification.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — magnifier, microscope and telescope pages with the defining ratios.',
    'W. J. Smith, *Modern Optical Engineering* — the chapter on optical instruments and visual systems.'
  ],
  sim: 'oi-visual-angle'
},

/* ================================================================ the magnifier */
{
  id: 'the-magnifier', parent: 'optical-instruments', title: 'The magnifier', level: 1,
  short: 'A single converging lens, with the object just inside its focal length, gives an upright virtual image that the eye sees at a larger angle. With the image at infinity the angular magnification is 250 mm / f; with the image at the near point it is one more. A 10× loupe has a focal length of 25 mm.',
  keywords: ['magnifier', 'magnifying glass', 'loupe', 'simple microscope', 'hand lens', 'magnifying power', '250/f', 'virtual image', 'reading glass', 'M = P/4', 'Hastings triplet', 'jeweller'],
  prereq: ['angular-magnification', 'the-thin-lens-equation', 'real-and-virtual-images'],
  related: ['eyepieces', 'focal-length-and-optical-power', 'low-vision-and-magnification', 'presbyopia', 'how-spectacle-lenses-correct-vision', 'physics:magnification'],
  body: `
A magnifying glass does not make a bigger thing; it lets the eye come closer to a small one. You cannot hold a stamp much nearer than 250 mm and still see it sharply, because the eye cannot focus nearer ([[accommodation]]). A converging lens held at the eye removes that limit: the stamp can sit close, where it subtends a large angle, and the lens delivers the light as if it came from farther away.

### Where the object goes
Put the object **inside the focal length**. The lens equation (real is positive, $1/s_o + 1/s_i = 1/f$) then gives a negative image distance: a **virtual**, upright, enlarged image on the same side as the object ([[real-and-virtual-images]]). Two positions matter:

- **Object at the focal point**, $s_o = f$. The rays leave the lens parallel; the virtual image is at infinity and the eye views it relaxed. This is how a loupe is used for long work.
- **Image at the near point**, $s_i = -250$ mm. The object is a little inside $f$, at $s_o = 250 f/(250 + f)$, and the eye must focus fully.

### The magnification
The unaided reference is the object at 250 mm, $\\theta = h/250$. Through the lens the image subtends $h/f$ (image at infinity) or $h(250+f)/(250 f)$ (image at 250 mm):

$$M_\\infty = \\frac{250\\ \\mathrm{mm}}{f} \\qquad M_{\\mathrm{near}} = 1 + \\frac{250\\ \\mathrm{mm}}{f}$$

Because the power is $P = 1/f$, this is $M_\\infty = P/4$ with $P$ in dioptres.

| $f$ | power | $M$, image at infinity | $M$, image at near point | object at near-point setting |
|---|---|---|---|---|
| 100 mm | 10 D | 2.5× | 3.5× | 71.4 mm |
| 50 mm | 20 D | 5× | 6× | 41.7 mm |
| 25 mm | 40 D | 10× | 11× | 22.7 mm |
| 10 mm | 100 D | 25× | 26× | 9.6 mm |
| 5 mm | 200 D | 50× | 51× | 4.9 mm |

### Things that surprise people
- **Stronger means smaller and closer.** A 10× loupe has $f = 25$ mm: the object sits about 25 mm away, and the lens is a centimetre or two across.
- **Hold it close to the eye.** For an image at infinity the angle $h/f$ does not depend on where the eye is, but the *field of view* does: the rim of the lens is the field stop, and the field is widest with the eye at the lens.
- **Aberrations cap a single lens** at about 10× to 15×. Loupes of 10× to 20× use cemented doublets or triplets (a Hastings triplet is the classic); more than that is a job for a [[the-compound-microscope|microscope]].
- **It is a real image if you go the wrong way.** With the object *outside* the focal length the lens makes a real, inverted image on a card: it has become a projector or a burning glass.

> [!warn] Never look at the Sun through a magnifier, and never leave one in sunlight: it concentrates sunlight to a spot hot enough to ignite paper, cloth and skin in seconds, and it can start fires through a window.

> [!key] A magnifier puts a virtual image at a larger angle: $M = 250\\ \\mathrm{mm}/f$ with the image at infinity, one more at the near point, and equal to $P/4$ for power $P$ in dioptres. Stronger lenses are smaller and must be held closer.
`,
  ideas: [
    'The object goes just inside the focal length; the image is virtual, upright and enlarged.',
    'M = 250 mm / f for an image at infinity (relaxed eye); M = 1 + 250 mm / f with the image at the near point.',
    'Power and magnification are linked by M = P / 4 (P in dioptres): +20 D is a 5× lens.',
    'The field of view is limited by the lens rim: it is widest when the eye is close to the lens.',
    'A single lens is limited by aberrations to roughly 10× to 15×; doublets and triplets reach 20×.'
  ],
  pitfalls: [
    'A magnifier makes a bigger image you could catch on paper — The image is virtual: no screen can receive it. Held beyond the focal length the same lens does make a real image, but then it is not working as a magnifier.',
    'A lens has one magnifying power — The number depends on where the image is: 250/f for an image at infinity, 1 + 250/f at the near point, and it is always against the 250 mm convention.',
    'Moving the lens away from the eye magnifies more — For an image at infinity the magnification does not change; only the field of view shrinks. Hold the lens close to the eye.',
    'More power is always better — A stronger lens is smaller, must sit closer to the object, shows a smaller field and is limited by aberrations.'
  ],
  terms: [
    { term: 'Magnifier', also: ['magnifying glass', 'hand lens', 'simple microscope'], def: 'A converging lens used with the object inside its focal length so that the eye sees a larger virtual image.' },
    { term: 'Loupe', also: ['jeweller\'s loupe', 'eye loupe'], def: 'A small magnifier held at the eye or clipped to spectacles, usually marked 2.5× to 20×; stronger ones are cemented doublets or triplets.' },
    { term: 'Magnifying power of a magnifier', also: ['M', 'angular magnification of a magnifier'], def: '250 mm divided by the focal length (image at infinity), against an unaided view at 250 mm.' },
    { term: 'Field of view of a magnifier', def: 'The part of the object that can be seen through the lens; set by the lens rim and largest when the eye is at the lens.' }
  ],
  formulas: [
    {
      name: 'Magnifying power, image at infinity',
      expr: 'M = Lnp/f', tex: 'M = \\frac{L_{\\mathrm{np}}}{f}',
      vars: {
        M: { name: 'angular magnification' },
        Lnp: { name: 'conventional near point', q: 'length', unit: 'mm', value: 250, fixed: true, tex: 'L_{\\mathrm{np}}' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 25 }
      },
      solveFor: 'M',
      stories: { M: 'A loupe has a focal length of {f}. What is its magnifying power with the image at infinity?', f: 'A hand lens is marked {M}. What is its focal length?' }
    },
    {
      name: 'Magnifying power, image at the near point',
      expr: 'M = 1 + Lnp/f', tex: 'M = 1 + \\frac{L_{\\mathrm{np}}}{f}',
      vars: {
        M: { name: 'angular magnification' },
        Lnp: { name: 'conventional near point', q: 'length', unit: 'mm', value: 250, fixed: true, tex: 'L_{\\mathrm{np}}' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 25 }
      },
      solveFor: 'M',
      note: 'The eye is at the lens and the virtual image is 250 mm away.'
    },
    {
      name: 'Magnification from the power',
      expr: 'M = P*Lnp', tex: 'M = P\\,L_{\\mathrm{np}}',
      vars: {
        M: { name: 'angular magnification' },
        P: { name: 'power of the lens', q: 'optpower', unit: 'D', value: 40 },
        Lnp: { name: 'conventional near point', q: 'length', unit: 'mm', value: 250, fixed: true, tex: 'L_{\\mathrm{np}}' }
      },
      solveFor: 'M',
      note: 'With 250 mm = 0.25 m this is M = P / 4.'
    },
    {
      name: 'Object distance for an image at the near point',
      expr: 'so = Lnp*f/(Lnp + f)', tex: 's_o = \\frac{L_{\\mathrm{np}}\\,f}{L_{\\mathrm{np}} + f}',
      vars: {
        so: { name: 'distance from lens to object', q: 'length', unit: 'mm', tex: 's_o' },
        Lnp: { name: 'conventional near point', q: 'length', unit: 'mm', value: 250, fixed: true, tex: 'L_{\\mathrm{np}}' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 25 }
      },
      solveFor: 'so'
    }
  ],
  examples: [
    {
      title: 'A 10× loupe at both settings',
      q: 'A loupe marked 10× has $f = 25$ mm. Where must the object be, and what is the magnification, if the image is at infinity and if it is at the near point?',
      steps: [
        'Image at infinity: the object is at the focal point, $s_o = 25$ mm, and $M = 250/25 = 10$.',
        { text: 'Image at the near point: the lens equation with $s_i = -250$ gives', tex: 's_o = \\frac{250 \\times 25}{250 + 25} = 22.7\\ \\mathrm{mm} \\qquad M = 1 + \\frac{250}{25} = 11' },
        'The two settings differ by 2.3 mm of object distance and by one unit of magnification.'
      ],
      a: '25 mm and 10× (relaxed eye); 22.7 mm and 11× (eye focused at 250 mm).'
    },
    {
      title: 'Choosing a hand lens',
      q: 'A stamp collector wants a lens of "3×". What focal length and power is that, and how far from the stamp is it held?',
      steps: [
        { text: 'With the image at infinity:', tex: 'f = \\frac{250\\ \\mathrm{mm}}{3} = 83\\ \\mathrm{mm}, \\qquad P = \\frac{1}{0.083\\ \\mathrm{m}} = 12\\ \\mathrm{D}' },
        'The stamp lies at the focal point, 83 mm from the lens; the lens, held near the eye, shows a field about as wide as the lens itself.'
      ],
      a: 'f = 83 mm, a +12 D lens held about 83 mm above the stamp.'
    }
  ],
  quiz: [
    { q: 'A hand lens is marked 8×. Its focal length is about…', choices: ['31 mm', '8 mm', '250 mm', '2000 mm'], a: 0, why: '$M = 250/f$, so $f = 250/8 = 31$ mm. The 250 mm in the formula is the conventional near point.' },
    { q: 'For an image at infinity, holding the magnifier farther from your eye increases its angular magnification.', a: false, why: 'The angle the image subtends is $h/f$ wherever the eye is; M does not change. What shrinks is the field of view, because the lens rim limits it.' },
    { q: 'What is the magnifying power, image at infinity, of a +16 D lens?', answer: 4, why: '$M = P/4 = 16/4 = 4$. Equivalently, $f = 62.5$ mm and $250/62.5 = 4$.' },
    { q: 'For a magnifier to give an upright, enlarged, virtual image the object must be…', choices: ['inside the focal length', 'exactly at twice the focal length', 'beyond twice the focal length', 'at infinity'], a: 0, why: 'Inside $f$ the lens equation gives a negative image distance and $m > 1$. At $2f$ the image is real and the same size; beyond it, real and smaller.' },
    { q: 'At what distance from an $f = 50$ mm lens must a stamp lie so that its virtual image is 250 mm from the lens, in millimetres?', answer: 41.67, why: '$s_o = 250 \\times 50/(250 + 50) = 41.7$ mm; the magnification is $1 + 250/50 = 6$.' }
  ],
  applications: [
    'Watchmakers\', jewellers\' and printers\' loupes, 3× to 20×; dentists\' and surgeons\' loupes mounted on spectacle frames at about 2.5× to 4×.',
    'Reading aids for people with low vision: stand magnifiers and illuminated hand lenses, with the image at a comfortable distance.',
    'Philately, geology and field biology: the 10× hand lens is the standard tool of a field geologist and botanist.',
    'Every eyepiece of a microscope or telescope is a magnifier used on the real image made by the objective.',
    'Photographers\' loupes for viewing slides, negatives and contact sheets, and the viewfinder magnifiers of cameras.'
  ],
  history: 'Ibn al-Haytham (Alhazen), writing about 1021, described how a segment of a glass sphere magnifies; the "reading stones" of medieval Europe were such glass hemispheres laid on a page. Spectacles followed in Italy in the late 13th century. In the 1670s Antoni van Leeuwenhoek made single-bead microscopes of some 200 to 300 times and saw bacteria and blood cells with them.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the simple magnifier and its angular magnification.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — the chapter on optical instruments, the simple magnifier.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — the magnifier page, with the two limiting values of M.'
  ],
  sim: 'oi-magnifier'
},

/* ================================================================ eyepieces */
{
  id: 'eyepieces', parent: 'optical-instruments', title: 'Eyepieces', level: 2,
  short: 'The eyepiece is a magnifier for the real image made by the objective of a microscope or telescope — a magnifier that must also give a wide, flat field and a comfortable place for the eye. Its focal length sets the magnification, its field stop the apparent field of view, and its eye relief how far from the glass the eye may sit.',
  keywords: ['eyepiece', 'ocular', 'Huygens', 'Ramsden', 'Kellner', 'Plössl', 'Erfle', 'orthoscopic', 'field stop', 'field number', 'apparent field of view', 'AFOV', 'eye relief', 'reticle', 'graticule', 'wide-field eyepiece', '10x/22'],
  prereq: ['the-magnifier', 'field-stop-and-field-of-view', 'combining-thin-lenses'],
  related: ['exit-pupil-and-eye-relief', 'the-compound-microscope', 'refracting-telescopes', 'lateral-chromatic-aberration', 'field-curvature', 'cemented-and-air-spaced-doublets'],
  body: `
The objective of a microscope or telescope makes a small, real, aerial image. The **eyepiece** (ocular) is a magnifier used to inspect it. It is asked for much more than a loupe: a wide and flat field with little colour fringing, a place for the eye that is not painfully close, and often a reticle or a camera port.

### Four numbers
- **Focal length** $f_e$. Used alone it magnifies $250\\ \\mathrm{mm}/f_e$; in a telescope $M = f_o/f_e$.
- **Field stop**, the ring in the eyepiece's focal plane that cuts off the picture. Its diameter in a microscope is the **field number** (FN, in mm; 18 to 26.5 is the usual range).
- **Apparent field of view**, the angle the picture subtends at the eye:
$$\\tan\\frac{\\mathrm{AFOV}}{2} = \\frac{D_{\\mathrm{fs}}}{2 f_e}$$
A 27 mm stop in a 25 mm eyepiece gives 56.7°. The *true* field of a telescope is AFOV/$M$; the field on a microscope specimen is FN divided by the objective magnification: FN 22 with a 40× objective shows 0.55 mm.
- **Eye relief**, the distance from the last glass surface to the [[exit-pupil-and-eye-relief|exit pupil]], where the eye must be. Spectacle wearers need 15 to 20 mm or more.

### The classical designs
Two thin lenses already give a usable eyepiece. In the thin-lens model below, every design is scaled to one equivalent focal length $f$:

| Design | Elements | Typical apparent field | Eye relief (thin-lens model) | Where the real image sits |
|---|---|---|---|---|
| Huygens | two plano-convex lenses, focal lengths 3:1, 1.33 $f$ apart | 30° to 40° | 0.33 $f$ | between the lenses: no usable reticle |
| Ramsden | two equal plano-convex lenses, 0.94 $f$ apart | 30° to 40° | 0.25 $f$ | just in front of the field lens: a reticle fits |
| Kellner | Ramsden layout, cemented-doublet eye lens | 40° to 50° | a little better than Ramsden | in front of the field lens |
| Plössl | two identical doublets, 0.36 $f$ apart | about 50° to 55° | about 0.8 $f$ | outside, in front of the first lens |
| Wide-field (Erfle and kin) | five or six elements | 60° to 70° | long | outside |
| Ultra-wide | seven or more elements | 80° and more | varies | outside |

The eye-relief column comes from a thin-lens calculation with the ratios and spacings shown; real eyepieces, with thick glass, give somewhat different values. The apparent fields are the usual catalogue ranges.

### Why so many lenses
A single lens off axis suffers from lateral colour, astigmatism, field curvature and distortion ([[lateral-chromatic-aberration]], [[field-curvature]], [[distortion]]), and the angles in an eyepiece are large. Cemented doublets cure colour; extra elements flatten the field and push the eye relief out. The price is weight, cost and, in wide designs, a small exit pupil range where the picture is clean.

### Reading the markings
A microscope eyepiece is engraved **10×/22**: magnification 10 and field number 22 mm. A spectacle symbol marks a high eye-point design. Each ocular of a binocular head has a ±5 D focusing ring so that the two eyes can be made sharp at once. Telescope eyepieces are sold by focal length (6 to 40 mm) and barrel size (1.25 or 2 inch).

> [!key] An eyepiece is a magnifier for a real image: $f_e$ gives the magnification, the field stop sets $\\tan(\\mathrm{AFOV}/2) = D_{\\mathrm{fs}}/2f_e$, and eye relief tells whether you can keep your glasses on. Wider fields need more lenses.
`,
  ideas: [
    'The eyepiece is a magnifier applied to the objective\'s real image; its focal length sets the magnification.',
    'The field stop sets the apparent field of view: tan(AFOV/2) = D_fs / (2 f_e). In a microscope its diameter is the field number.',
    'The true field of a telescope is AFOV / M; the field on a microscope specimen is FN / M_objective.',
    'Eye relief is the distance from the last lens to the exit pupil: at least 15 to 20 mm for eyeglass wearers.',
    'Huygens and Ramsden eyepieces are two lenses; Plössl uses two doublets; wide fields need five or more elements.'
  ],
  pitfalls: [
    'A higher-power eyepiece shows a bigger picture of the sky — It shows a smaller piece of the sky, magnified. The apparent field stays about the same while M rises, so the true field falls as 1/M.',
    'Apparent field of view and true field are the same — Apparent field is the angle at the eye; the true field is that divided by the magnification (for a telescope) or FN divided by the objective power (for a microscope).',
    'A long eye relief is a luxury — For someone who wears spectacles it decides whether the whole field is visible at all; and rifle scopes need very long relief for safety.',
    'The two eyepieces of a binocular microscope should be set to the same value — The diopter rings correct each eye separately; they are set one after the other so that both eyes see sharply.'
  ],
  terms: [
    { term: 'Eyepiece', also: ['ocular'], def: 'The lens group nearest the eye in a microscope, telescope or binocular. It magnifies the real image formed by the objective and delivers the light to the exit pupil.' },
    { term: 'Field number', also: ['FN', 'field of view number'], def: 'The diameter in millimetres of the field stop of a microscope eyepiece, engraved after the slash: 10×/22 means FN 22 mm.' },
    { term: 'Apparent field of view', also: ['AFOV', 'apparent field'], def: 'The angle the picture subtends at the eye through the eyepiece: 2 arctan(D_fs / 2f_e). 50° to 60° is wide; 80° or more is ultra-wide.' },
  ],
  formulas: [
    {
      name: 'Apparent field of view',
      expr: 'tan(a/2) = Dfs/(2*fe)', tex: '\\tan\\frac{a}{2} = \\frac{D_{\\mathrm{fs}}}{2 f_e}',
      vars: {
        a: { name: 'apparent field of view', q: 'angle', unit: '°', min: 0, max: 170, tex: 'a' },
        Dfs: { name: 'field-stop diameter', q: 'length', unit: 'mm', value: 27, tex: 'D_{\\mathrm{fs}}' },
        fe: { name: 'focal length of the eyepiece', q: 'length', unit: 'mm', value: 25, tex: 'f_e' }
      },
      solveFor: 'a',
      stories: { a: 'An eyepiece of focal length {fe} has a field stop {Dfs} across. How wide is its apparent field?' }
    },
    {
      name: 'True field of a telescope',
      expr: 'TF = AF/M', tex: 'T = \\frac{A}{M}',
      vars: {
        TF: { name: 'true field of view', q: 'angle', unit: '°', tex: 'T' },
        AF: { name: 'apparent field of view', q: 'angle', unit: '°', value: 56.7, tex: 'A' },
        M: { name: 'magnification of the telescope', value: 40, min: 1, max: 1000 }
      },
      solveFor: 'TF',
      note: 'The usual small-angle rule; the exact relation is tan(true) = tan(apparent) / M, valid when the eyepiece has no distortion.'
    },
    {
      name: 'Field on the specimen of a microscope',
      expr: 'Fs = FN/Mo', tex: 'F_s = \\frac{\\mathrm{FN}}{M_o}',
      vars: {
        Fs: { name: 'diameter of the field on the specimen', q: 'length', unit: 'mm', tex: 'F_s' },
        FN: { name: 'field number of the eyepiece', q: 'length', unit: 'mm', value: 22, tex: '\\mathrm{FN}' },
        Mo: { name: 'magnification of the objective', value: 40, min: 1, max: 150, tex: 'M_o' }
      },
      solveFor: 'Fs',
      stories: { Fs: 'A microscope has eyepieces of field number {FN} and a {Mo} objective. How wide is the specimen field?' }
    }
  ],
  examples: [
    {
      title: 'A 25 mm Plössl on a telescope',
      q: 'A telescope of 1000 mm focal length carries a 25 mm eyepiece whose field stop is 27 mm across. Find the magnification, the apparent field and the true field.',
      steps: [
        'Magnification: $M = f_o/f_e = 1000/25 = 40$.',
        { text: 'Apparent field:', tex: '\\mathrm{AFOV} = 2\\arctan\\frac{27}{2\\times 25} = 56.7^\\circ' },
        { text: 'True field:', tex: '56.7^\\circ / 40 = 1.42^\\circ' },
        'That is about 2.7 times the width of the full Moon (0.52°).'
      ],
      a: '40×, 56.7° apparent, 1.42° true.'
    },
    {
      title: 'How much of the specimen is in view?',
      q: 'A microscope has 10×/22 eyepieces. What width of specimen is visible with a 4× objective, and with a 40× objective?',
      steps: [
        'Specimen field = FN / $M_o$.',
        { text: 'With 4×:', tex: '22/4 = 5.5\\ \\mathrm{mm}' },
        { text: 'With 40×:', tex: '22/40 = 0.55\\ \\mathrm{mm}' }
      ],
      a: '5.5 mm with the 4× objective, 0.55 mm with the 40×: ten times the magnification, a tenth of the field.'
    }
  ],
  quiz: [
    { q: 'Which property of an eyepiece matters most to someone who keeps spectacles on while looking in?', choices: ['A long eye relief (15 to 20 mm or more)', 'A short focal length', 'A Huygens design', 'A small field stop'], a: 0, why: 'The glasses hold the eye away from the lens by 12 mm or more; an eyepiece whose exit pupil lies closer than that cuts the field off.' },
    { q: 'What apparent field does an eyepiece of 20 mm focal length with a 20 mm field stop give, in degrees?', answer: 53.13, why: '$2\\arctan(20/40) = 2\\times 26.57 = 53.1^\\circ$.' },
    { q: 'A 10×/22 eyepiece is used with a 20× objective. The specimen field is 1.1 mm wide.', a: true, why: 'FN / $M_o$ = 22/20 = 1.1 mm; the total magnification is 200×.' },
    { q: 'Why does a wide-field eyepiece contain five or more elements?', choices: ['Large angles bring lateral colour, astigmatism, field curvature and distortion that more elements must correct', 'To make the image upright', 'To lengthen the telescope tube', 'To increase the objective aperture'], a: 0, why: 'The rays pass through an eyepiece at steep angles, so every off-axis aberration is large; extra and cemented elements correct them and keep the eye relief long.' },
    { q: 'A telescope with an apparent field of 50° is used at 100×. The true field of view, in degrees, is…', answer: 0.5, why: 'True field ≈ apparent field / $M$ = 50/100 = 0.5°, about the size of the full Moon.' }
  ],
  applications: [
    'Telescopes: eyepieces of different focal lengths change magnification; the same barrel size lets one telescope use a whole set.',
    'Microscopes: paired 10×/22 eyepieces with ±5 D adjustment on a binocular head; wider 10×/26.5 ones for large-field work.',
    'Rifle scopes and sights: long eye relief eyepieces keep the optics away from the eye under recoil.',
    'Binoculars, in which the eyepieces set the apparent field (about 50° to 65°) and whether glasses can be kept on.',
    'Measuring microscopes and alignment telescopes: a reticle in the real-image plane lets one read a scale in focus with the object.'
  ],
  history: 'Christiaan Huygens designed his two-lens ocular in the 1660s to reduce colour in telescopes; Jesse Ramsden\'s eyepiece of the 1780s put the focal plane outside the glass so that a micrometer could be used. Carl Kellner (1849) added a cemented eye lens, and Georg Simon Plössl\'s design of about 1860 became the standard of the 20th century.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the chapter on eyepieces and their aberrations, with the classical two-lens forms.',
    'R. Kingslake, *Optical System Design* — eyepiece types and their performance.',
    'ISO 8578, *Microscopes — Marking of objectives and eyepieces* — the engraving of magnification and field number.'
  ],
  sim: 'oi-eyepiece'
},

/* ================================================================ the compound microscope */
{
  id: 'the-compound-microscope', parent: 'optical-instruments', title: 'The compound microscope', level: 2,
  short: 'An objective forms a real, enlarged intermediate image of the specimen; the eyepiece magnifies that image like a magnifier, so the total magnification is the product of the two. What a microscope can resolve is set not by its magnification but by its numerical aperture: d = λ / (2 NA).',
  keywords: ['compound microscope', 'microscope', 'objective', 'eyepiece', 'tube length', '160 mm', 'infinity-corrected', 'tube lens', 'total magnification', 'Abbe', 'resolution', 'empty magnification', 'useful magnification', 'intermediate image', 'light microscope'],
  prereq: ['the-magnifier', 'eyepieces', 'numerical-aperture'],
  related: ['microscope-objectives', 'microscope-illumination-and-contrast', 'resolution-limits', 'the-airy-disk', 'condensers-and-kohler-illumination', 'physics:optical-instruments', 'biology:microscopy'],
  body: `
A magnifier runs out of road near 20×. The **compound microscope** goes further by working in two stages. The **objective**, a strong lens very close to the specimen, forms a real, inverted, enlarged *intermediate image*. The **eyepiece** then magnifies that image exactly as a magnifier would. The stages multiply:

$$M = m_{\\mathrm{obj}}\\times M_{\\mathrm{eye}}$$

A 40× objective with a 10× eyepiece gives 400×.

### Finite and infinity-corrected
- **Finite tube length.** The specimen lies just outside the objective's focal length and the intermediate image forms at a fixed distance, the *tube length*, 160 mm in the old DIN standard. The objective magnification is about the tube length over its focal length: a 10× objective has $f = 16$ mm, a 40× has 4 mm, a 100× has 1.6 mm.
- **Infinity-corrected.** The specimen sits at the objective's focal point, so the light leaves it parallel. A **tube lens** of focal length $f_t$ forms the image, and $m_{\\mathrm{obj}} = f_t/f_{\\mathrm{obj}}$; makers use $f_t$ between about 165 and 200 mm. The parallel *infinity space* in between is the point of the design: filters, beam splitters and prisms can be inserted there without moving the focus or adding aberration.

### Resolution is set by NA
Magnification is not what limits detail; diffraction is. Abbe showed in 1873 that the smallest period a microscope can resolve is

$$d = \\frac{\\lambda}{2\\,\\mathrm{NA}}$$

In green light (550 nm): NA 0.25 resolves 1.10 µm, NA 0.65 resolves 0.42 µm, NA 1.40 resolves 0.20 µm. No visible-light microscope does much better than 0.2 µm: bacteria (about 1 µm) are seen, a virus (about 0.1 µm) is not.

### Useful magnification
The eye separates details 1′ apart, 73 µm at 250 mm. To make the finest detail the objective passes comfortably visible, the total magnification should be about 500 to 1000 times the NA: lower and detail is lost to the eye; higher and the image is **empty magnification**, larger and no sharper.

| Objective | NA | focal length (160 mm tube) | resolves (550 nm) | useful total magnification |
|---|---|---|---|---|
| 4× | 0.10 | 40 mm | 2.75 µm | 50 to 100 |
| 10× | 0.25 | 16 mm | 1.10 µm | 125 to 250 |
| 40× | 0.65 | 4 mm | 0.42 µm | 325 to 650 |
| 100× oil | 1.25 | 1.6 mm | 0.22 µm | 625 to 1250 |

### The parts of the stand
A stand with coarse and fine focus; a stage; a nosepiece carrying four to six *parfocal* objectives (focus hardly changes when you switch); a **condenser** with a field and an aperture diaphragm under the stage, set by Köhler's method ([[condensers-and-kohler-illumination]]); and eyepieces, often one camera port too. The image is inverted and reversed, so the specimen seems to move the wrong way when the stage is pushed. The depth of field is tiny, about $\\lambda n/\\mathrm{NA}^2$: roughly a micrometre at 40×.

> [!key] Two stages multiply, $M = m_{\\mathrm{obj}}\\times M_{\\mathrm{eye}}$, but detail is fixed by the objective's NA: $d = \\lambda/2\\mathrm{NA}$. Magnification beyond about $1000\\times\\mathrm{NA}$ is empty.
`,
  ideas: [
    'The objective makes a real, enlarged intermediate image; the eyepiece magnifies it: M = m_obj × M_eye.',
    'Finite-tube objectives image onto a fixed tube length (160 mm); infinity-corrected ones need a tube lens and leave a parallel space for filters and prisms.',
    'The smallest resolvable period is d = λ / (2 NA): resolution belongs to the objective, not to the eyepiece.',
    'Useful total magnification runs from about 500 × NA to 1000 × NA; above that it is empty.',
    'The image is inverted and reversed, and the depth of field is about a micrometre at high NA.'
  ],
  pitfalls: [
    'A stronger eyepiece shows finer detail — Resolution is fixed by the objective\'s NA and the wavelength. A stronger eyepiece only enlarges what is already there, up to the limit of useful magnification.',
    'The objective magnification is a property of the objective alone — For an infinity-corrected objective it is $f_t/f_{obj}$, so it depends on the tube lens it is used with, and it is only right with the one it was designed for.',
    'A 2000× microscope sees more than a 1000× one — Not if the objective\'s NA is the same: both are limited to the same resolution, and past about $1000\\times$NA the extra is empty magnification.',
    'Light microscopes could see atoms with enough magnification — Diffraction makes detail finer than about 0.2 µm unresolvable in visible light, however high the magnification.'
  ],
  terms: [
    { term: 'Microscope objective', also: ['objective'], def: 'The lens system next to the specimen. It sets the resolution (through its NA) and forms the first, real, enlarged image.' },
    { term: 'Intermediate image', def: 'The real, inverted, enlarged image formed by the objective (and tube lens), which the eyepiece then examines.' },
    { term: 'Tube length', also: ['mechanical tube length', '160 mm'], def: 'In a finite-tube microscope the distance from the objective\'s shoulder to the eyepiece\'s shoulder over which the objective is designed to work: 160 mm in the DIN standard.' },
    { term: 'Infinity-corrected', also: ['infinity optics', '∞ objective'], def: 'An objective that sends parallel light from an in-focus specimen. A tube lens forms the image; the space between is free for filters and prisms.' },
    { term: 'Tube lens', def: 'The lens that, in an infinity-corrected microscope, focuses the parallel light from the objective into the intermediate image; its focal length (about 165 to 200 mm) sets the objective magnification.' },
    { term: 'Total magnification', def: 'The product of objective magnification and eyepiece magnification, quoted against the 250 mm near point.' },
    { term: 'Useful magnification', also: ['useful range'], def: 'The range, about 500 to 1000 times the NA, in which magnifying shows more detail; above it the image only gets larger.' }
  ],
  formulas: [
    {
      name: 'Total magnification',
      expr: 'M = Mo*Me', tex: 'M = M_o\\,M_e',
      vars: {
        M: { name: 'total magnification' },
        Mo: { name: 'objective magnification', value: 40, min: 1, max: 150, tex: 'M_o' },
        Me: { name: 'eyepiece magnification', value: 10, min: 1, max: 40, tex: 'M_e' }
      },
      solveFor: 'M',
      stories: { M: 'A microscope has a {Mo} objective and a {Me} eyepiece. What is its total magnification?' }
    },
    {
      name: 'Objective magnification, infinity-corrected',
      expr: 'Mo = ft/fo', tex: 'M_o = \\frac{f_t}{f_o}',
      vars: {
        Mo: { name: 'objective magnification', tex: 'M_o' },
        ft: { name: 'focal length of the tube lens', q: 'length', unit: 'mm', value: 200, tex: 'f_t' },
        fo: { name: 'focal length of the objective', q: 'length', unit: 'mm', value: 5, tex: 'f_o' }
      },
      solveFor: 'Mo',
      note: 'Tube lens focal lengths differ from make to make (about 165 to 200 mm): an objective is correct only with its own.'
    },
    {
      name: 'Abbe resolution limit',
      expr: 'd = lambda/(2*NA)', tex: 'd = \\frac{\\lambda}{2\\,\\mathrm{NA}}',
      vars: {
        d: { name: 'smallest resolvable period', q: 'length', unit: 'nm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 0.65, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' }
      },
      solveFor: 'd',
      note: 'For incoherent imaging with a condenser of the same NA as the objective, the Rayleigh form is 0.61 λ/NA, nearly the same.',
      stories: { d: 'An objective of NA {NA} images with light of {lambda}. What is the smallest period it can resolve?', NA: 'A microscope must resolve a period of {d} in light of {lambda}. What NA does it need?' }
    },
    {
      name: 'Useful magnification',
      expr: 'Mu = k*NA', tex: 'M_u = k\\,\\mathrm{NA}',
      vars: {
        Mu: { name: 'total magnification', tex: 'M_u' },
        k: { name: 'rule-of-thumb factor (500 minimum, 1000 maximum)', value: 1000, min: 500, max: 1000 },
        NA: { name: 'numerical aperture of the objective', value: 1.25, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' }
      },
      solveFor: 'Mu',
      note: 'The usual guide: stay between 500 and 1000 times NA.'
    }
  ],
  examples: [
    {
      title: 'A 400× view',
      q: 'A 40×/0.65 objective is used with a 10× eyepiece in green light (550 nm). Find the total magnification, the resolution and whether the magnification is useful.',
      steps: [
        'Total magnification: $40\\times 10 = 400$.',
        { text: 'Resolution:', tex: 'd = \\frac{550\\ \\mathrm{nm}}{2\\times 0.65} = 423\\ \\mathrm{nm}' },
        'Useful range for NA 0.65: $500\\times 0.65 = 325$ to $1000\\times 0.65 = 650$. At 400× the picture is comfortably inside it.'
      ],
      a: '400×, resolving 0.42 µm, a useful magnification.'
    },
    {
      title: 'The 2000× microscope',
      q: 'A department-store microscope is sold as "2000×": a 100×/1.25 oil objective with a 20× eyepiece. Is the magnification useful?',
      steps: [
        'Useful range for NA 1.25: 625× to 1250×.',
        'The microscope reaches $100\\times 20 = 2000$×, 1.6 times the upper limit. Resolution is fixed by the objective at $550/(2\\times 1.25) = 220$ nm.'
      ],
      a: 'No: beyond about 1250× the image is empty magnification. A 10× eyepiece (1000×) shows everything the objective can resolve.'
    }
  ],
  quiz: [
    { q: 'What most directly sets the smallest detail a light microscope can resolve?', choices: ['The numerical aperture of the objective (and the wavelength)', 'The magnification of the eyepiece', 'The length of the tube', 'The brightness of the lamp'], a: 0, why: 'Abbe\'s limit $d = \\lambda/2\\mathrm{NA}$ contains only the wavelength and NA. The eyepiece and tube only enlarge what the objective already resolved; light brightness changes the signal, not the limit.' },
    { q: 'A 60× objective and a 12.5× eyepiece give a total magnification of…', answer: 750, why: '$M = M_o M_e = 60\\times 12.5 = 750$.' },
    { q: 'In an infinity-corrected microscope a filter or a prism can be placed between the objective and the tube lens without disturbing the focus.', a: true, why: 'The light there is parallel, so a plane plate or prism shifts nothing in the image plane and adds no aberration. That is the reason for the design.' },
    { q: 'What is the smallest period resolved at 450 nm by an objective of NA 1.4, in nanometres?', answer: 160.7, why: '$d = 450/(2\\times 1.4) = 160.7$ nm.' },
    { q: 'You double the eyepiece power from 10× to 20× on a 40×/0.65 objective. What happens to the resolution?', choices: ['Nothing: it is set by the objective', 'It doubles', 'It halves', 'It improves a little because the image is larger'], a: 0, why: 'The eyepiece enlarges the intermediate image, but the detail it contains was fixed by the objective. 800× lies beyond the useful range for NA 0.65 (325 to 650×), so the image would only look larger and softer.' }
  ],
  applications: [
    'Biology and medicine: tissue sections, blood films and cultured cells, mostly at 4× to 100×; inverted microscopes look at cells through the bottom of a dish.',
    'Metallurgy and materials: reflected-light microscopes examine polished metal and rock sections that light cannot pass through.',
    'Semiconductor and electronics inspection with long-working-distance objectives.',
    'Teaching and field work: the school microscope, with four objectives on a turret.',
    'Digital microscopes and cameras: a camera tube lens and a sensor take the place of the eyepiece; the useful-magnification limit then becomes a limit on pixel size.'
  ],
  history: 'Compound microscopes appeared in the Netherlands around 1600. Robert Hooke\'s *Micrographia* (1665) showed what they could do and gave the "cell" its name. Ernst Abbe\'s 1873 theory of image formation set the limit $\\lambda/2\\mathrm{NA}$; with the new glasses of Otto Schott, he and Carl Zeiss produced the first apochromatic objectives in 1886.',
  sources: [
    'E. Abbe, "Beiträge zur Theorie des Mikroskops und der mikroskopischen Wahrnehmung", *Archiv für mikroskopische Anatomie* 9 (1873) — the diffraction theory of microscope resolution.',
    'M. Bass (ed.), *Handbook of Optics* — the chapter on microscopes.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the compound microscope as two lenses in series.'
  ],
  sim: 'oi-microscope'
},

/* ================================================================ microscope objectives */
{
  id: 'microscope-objectives', parent: 'optical-instruments', title: 'Microscope objectives', level: 2,
  short: 'The engraving on an objective — Plan Apo 40×/0.95 ∞/0.17 — states its correction class, magnification, numerical aperture, tube-length system and the cover glass it expects. NA = n sin θ sets the light gathered and the resolution; immersion liquids raise n and so raise the NA above 1.',
  keywords: ['objective', 'microscope objective', 'NA', 'numerical aperture', 'achromat', 'apochromat', 'plan', 'fluorite', 'immersion', 'oil immersion', 'cover glass', '0.17', 'working distance', 'WD', 'correction collar', 'RMS thread', 'infinity', 'Plan Apo'],
  prereq: ['the-compound-microscope', 'numerical-aperture', 'apochromats-and-ed-glass'],
  related: ['microscope-illumination-and-contrast', 'fluorescence-and-confocal-microscopy', 'critical-angle-and-total-internal-reflection', 'the-airy-disk', 'depth-of-focus', 'biology:microscopy'],
  body: `
Read the barrel of a microscope objective and it states, in a few characters, nearly everything about it:

**Plan Apo 40×/0.95 ∞/0.17 WD 0.14**

### Reading the engraving
| Marking | Meaning |
|---|---|
| 40× | magnification with the tube lens it was designed for; also a coloured ring |
| 0.95 | numerical aperture, NA = $n\\sin\\theta$: light gathered and resolution |
| ∞ / 0.17 | infinity-corrected (a figure such as 160 would mean a finite tube); the cover glass it is corrected for, 0.17 mm thick (a dash: none needed) |
| WD 0.14 | working distance in millimetres, often left off |
| Plan, Achromat, Fluor, Apo | the correction class |
| Oil, W, Gly | the immersion liquid: oil, water, glycerol |
| Ph, DIC, Pol, Corr, Iris | phase ring, differential interference contrast, strain-free for polarized light, correction collar, built-in iris |

Most makers colour-code the magnification ring (typically red 4×, yellow 10×, green 20×, light blue 40×, dark blue 60×, white 100×) and a second ring for the immersion (black for oil, white for water, orange for glycerol).

### Correction classes
- **Achromat**: two colours (red and blue) brought to one focus, spherical aberration corrected for one (green); the field is curved. The workhorse.
- **Plan achromat**: the same with a flat field.
- **Fluorite** ("Fluor", semi-apochromat): fluorite or low-dispersion glass raises the colour correction and the NA; a favourite for fluorescence.
- **Apochromat** ("Apo"): three colours at one focus, spherical aberration corrected for two; the highest NA and the clearest colour. **Plan Apo** adds a flat field and is the top of the range.

### Immersion and NA
NA cannot exceed the refractive index of the medium between specimen and lens. In air, the sine is at most 1: the practical maximum is about 0.95, a half-angle of 72°. Rays leaving the cover glass at steeper angles are totally reflected at its back surface (the critical angle at a glass-to-air surface is 41°) and never reach the lens. Fill the gap with **immersion oil**, whose index (about 1.515) matches glass, and those rays are collected: NA 1.25 to 1.4 is routine, a half-angle of 67° in the medium for NA 1.4. Water (1.333) suits living specimens in aqueous medium, with NA up to about 1.2; glycerol (about 1.47) lies between.

| NA | medium | resolves at 550 nm | diffraction depth of field $n\\lambda/\\mathrm{NA}^2$ |
|---|---|---|---|
| 0.25 | air | 1.10 µm | 8.8 µm |
| 0.65 | air | 0.42 µm | 1.3 µm |
| 0.95 | air | 0.29 µm | 0.6 µm |
| 1.40 | oil | 0.20 µm | 0.43 µm |

### The cover glass and the working distance
The specimen is covered with a glass about 0.17 mm thick (the "No. 1.5" coverslip), and the objective is designed with it in its path. A different thickness, or a different mounting medium, adds spherical aberration that grows steeply with NA: a dry objective of NA 0.9 or more is upset by a ten-micrometre error, which is what the **correction collar** compensates. The **working distance**, from the front lens to the cover glass when in focus, shrinks as magnification and NA grow: millimetres to centimetres at 4×, about 0.5 mm at 40×, 0.1 to 0.2 mm at 100× oil. Focus away from the slide, never towards it, while watching.

> [!key] NA = $n\\sin\\theta$ tells how much light the objective gathers and how fine a detail it resolves, $d = \\lambda/2\\mathrm{NA}$. Immersion raises $n$ and so lifts NA above 1; the cover-glass figure and the class (Achromat to Plan Apo) tell what it was corrected for.
`,
  ideas: [
    'The engraving states class, magnification, NA, tube-length system (∞ or 160) and the cover glass thickness (0.17 mm).',
    'NA = n sin θ; in air it cannot exceed 1, and practical dry objectives stop near 0.95.',
    'Immersion oil (n ≈ 1.515) removes the glass-to-air boundary, so rays at steep angles reach the lens and NA reaches 1.25 to 1.4.',
    'Achromats correct two colours, apochromats three; "Plan" means a flat field.',
    'Working distance shrinks with magnification and NA; cover-glass thickness errors damage high-NA dry objectives.'
  ],
  pitfalls: [
    'A higher magnification means a better objective — Resolution depends on NA. A 40×/0.65 resolves finer detail than a 100×/0.25 would; magnification only decides the scale.',
    'An oil objective works the same dry — Without oil the NA is capped below 1 and the light is lost at the cover glass; the image is dim and poor.',
    'The cover glass does not matter — High-NA dry objectives are very sensitive to its thickness; a correction collar exists for just that reason.',
    'Immersion oil is only there to keep the objective clean — It matches the index of the glass, so that rays at steep angles are not turned back at the glass-to-air surface.'
  ],
  terms: [
    { term: 'Working distance of an objective', also: ['WD'], def: 'The distance between the front lens of the objective and the cover glass (or specimen) when the image is in focus.' },
    { term: 'Achromatic objective', also: ['achromat'], def: 'An objective corrected for colour at two wavelengths and spherical aberration at one; the basic class.' },
    { term: 'Apochromatic objective', also: ['Apo'], def: 'An objective corrected for colour at three wavelengths and for spherical aberration at two; the highest class, with the greatest NA.' },
    { term: 'Plan', also: ['Plano', 'flat-field'], def: 'Marks an objective corrected for field curvature, so that the whole field is in focus at once.' },
    { term: 'Cover glass correction', also: ['coverslip thickness', '0.17'], def: 'The thickness of cover glass (usually 0.17 mm) for which the objective\'s spherical aberration is corrected; a dash means it is used without cover glass.' }
  ],
  formulas: [
    {
      name: 'Numerical aperture',
      expr: 'NA = n*sin(th)', tex: '\\mathrm{NA} = n\\sin\\theta',
      vars: {
        NA: { name: 'numerical aperture', tex: '\\mathrm{NA}' },
        n: { name: 'refractive index of the medium', value: 1.515, min: 1, max: 1.8 },
        th: { name: 'half-angle of the collected cone', q: 'angle', unit: '°', value: 67.5, min: 0, max: 90, tex: '\\theta' }
      },
      solveFor: 'NA',
      stories: { NA: 'An objective collects a cone of half-angle {th} in a medium of index {n}. What is its NA?', th: 'An oil objective of index {n} has NA {NA}. What is the half-angle of its cone?' }
    },
    {
      name: 'Focal length of a finite-tube objective',
      expr: 'fo = Lt/Mo', tex: 'f_o = \\frac{L_t}{M_o}',
      vars: {
        fo: { name: 'focal length of the objective', q: 'length', unit: 'mm', tex: 'f_o' },
        Lt: { name: 'tube length', q: 'length', unit: 'mm', value: 160, tex: 'L_t' },
        Mo: { name: 'magnification of the objective', value: 40, min: 1, max: 150, tex: 'M_o' }
      },
      solveFor: 'fo',
      note: 'An approximation that neglects the small difference between the tube length and the image distance.'
    },
    {
      name: 'Diffraction depth of field',
      expr: 'dz = lambda*n/NA^2', tex: 'd_z = \\frac{\\lambda\\,n}{\\mathrm{NA}^2}',
      vars: {
        dz: { name: 'diffraction depth of field', q: 'length', unit: 'µm', tex: 'd_z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        n: { name: 'refractive index of the medium', value: 1, min: 1, max: 1.8 },
        NA: { name: 'numerical aperture', value: 0.65, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' }
      },
      solveFor: 'dz',
      note: 'The wave-optical part of the depth of field; the detector adds a term of its own.'
    }
  ],
  examples: [
    {
      title: 'Reading Plan Apo 60×/1.20 W ∞/0.17',
      q: 'What does this engraving tell you, and what is its resolution at 550 nm?',
      steps: [
        'Plan Apo: flat field, three colours corrected. 60×: magnification with its own tube lens. 1.20 W: NA 1.2 with water immersion. ∞/0.17: infinity-corrected, expects 0.17 mm of cover glass.',
        { text: 'Half-angle of the cone in water:', tex: '\\theta = \\arcsin\\frac{1.20}{1.333} = 64.2^\\circ' },
        { text: 'Resolution:', tex: 'd = \\frac{550}{2\\times 1.20} = 229\\ \\mathrm{nm}' }
      ],
      a: 'A top-class water-immersion objective for live cells: NA 1.2, a 64° half-angle in water, resolving 0.23 µm.'
    },
    {
      title: 'Why a dry objective stops below NA 1',
      q: 'A ray leaves a point in the specimen, crosses a cover glass of $n = 1.52$ and meets air. At what angle in the glass does it stop emerging?',
      steps: [
        { text: 'The critical angle for glass to air:', tex: '\\theta_c = \\arcsin\\frac{1}{1.52} = 41.1^\\circ' },
        'Rays steeper than 41° in the glass are totally reflected; in air, a ray emerging at 90° has $\\sin\\theta = 1$, the largest NA a dry lens can ever have. With oil in the gap the glass, oil and lens are one medium, and the rays are not turned back.'
      ],
      a: 'At 41.1° in the glass; with oil the cone can reach 67° and NA 1.4.'
    }
  ],
  quiz: [
    { q: 'An engraving reads 100×/1.25 Oil ∞/0.17. Which statement is right?', choices: ['It needs immersion oil and a 0.17 mm cover glass, and is infinity-corrected', 'It is a dry objective with NA 1.25', 'It works at a tube length of 170 mm', 'It cannot resolve below 1 µm'], a: 0, why: '"Oil" is the immersion, ∞ the tube-length system, 0.17 the cover glass in mm. Resolution is 550/(2 × 1.25) = 0.22 µm. A dry objective cannot have NA above 1.' },
    { q: 'A cone of half-angle 60° in immersion oil of index 1.515 has a numerical aperture of…', answer: 1.312, why: 'NA = $n\\sin\\theta$ = 1.515 × sin 60° = 1.312.' },
    { q: 'An oil-immersion objective can be used dry with no loss of performance.', a: false, why: 'Dry, rays steeper than the glass–air critical angle (41°) are turned back, the NA is capped below 1 and spherical aberration appears; the image is dim and poor.' },
    { q: 'Which class brings three colours to a common focus?', choices: ['Apochromat', 'Achromat', 'Plan achromat', 'Eyepiece'], a: 0, why: 'Achromats correct red and blue only; apochromats correct red, green and blue and also spherical aberration for two colours.' },
    { q: 'What is the smallest period resolved by NA 1.25 at 500 nm, in nanometres?', answer: 200, why: '$d = \\lambda/2\\mathrm{NA} = 500/2.5 = 200$ nm.' }
  ],
  applications: [
    'Pathology and haematology: 40× dry and 100× oil objectives for stained smears.',
    'Live-cell imaging: Plan Apo water-immersion 40× to 63× objectives, with a correction collar for the thickness of the dish.',
    'Fluorescence research: 60×/1.4 and 100×/1.45 oil objectives for the highest NA and brightest images.',
    'Industry: long-working-distance objectives engraved ∞/0 for inspecting wafers and metal, which have no cover glass.',
    'Cameras and machine vision use microscope objectives as high-NA lenses for very small fields.'
  ],
  history: 'Giovanni Battista Amici introduced water immersion in the 1840s. Ernst Abbe and Carl Zeiss brought out homogeneous oil immersion in 1878, and in 1886, with new glasses from Otto Schott, the first apochromats.',
  sources: [
    'ISO 8578, *Microscopes — Marking of objectives and eyepieces* — what the engraving states.',
    'ISO 19012, *Microscopes — Designation of microscope objectives* — correction classes and their designations.',
    'M. Bass (ed.), *Handbook of Optics* — the chapter on microscopes, objectives and immersion.'
  ],
  sim: 'oi-objective'
},

/* ================================================================ illumination and contrast */
{
  id: 'microscope-illumination-and-contrast', parent: 'optical-instruments', title: 'Microscope illumination and contrast methods', level: 2,
  short: 'Most specimens are transparent and show almost no contrast in plain light. Köhler illumination gives even, controllable light; dark field, phase contrast, differential interference contrast and polarized light each turn a different thing the specimen does to light — scattering, a delay, a slope of delay, a rotation — into differences of brightness.',
  keywords: ['Köhler', 'bright field', 'dark field', 'phase contrast', 'Zernike', 'DIC', 'differential interference contrast', 'Nomarski', 'polarized light', 'condenser', 'aperture diaphragm', 'field diaphragm', 'contrast', 'transparent specimen', 'oblique illumination', 'phase ring'],
  prereq: ['the-compound-microscope', 'microscope-objectives', 'condensers-and-kohler-illumination'],
  related: ['polarization-states', 'wave-plates', 'birefringence', 'fluorescence-and-confocal-microscopy', 'thin-film-interference', 'spatial-filtering', 'fourier-optics'],
  body: `
Most of what a microscope looks at is transparent: living cells, thin sections, bacteria in water. Such a specimen absorbs almost no light, so in plain illumination its image has almost no contrast. The cure is not more light but a different kind: methods that turn what the specimen does to light — scatters it, delays it, rotates its polarization — into differences of brightness.

### Köhler illumination first
In Köhler's arrangement ([[condensers-and-kohler-illumination]]) the field diaphragm is imaged in the specimen plane and the aperture diaphragm sits in the focal plane of the condenser. The field diaphragm sets the size of the lit patch; the aperture diaphragm sets the **NA of the illumination**. Opened to about 70 to 80 % of the objective NA it gives a good trade of contrast against resolution: the resolution is about $1.22\\lambda/(\\mathrm{NA}_{obj} + \\mathrm{NA}_{cond})$, so closing the diaphragm gains contrast and costs detail.

### The methods
| Method | What makes the contrast | What you see | Needs |
|---|---|---|---|
| Bright field | absorption | dark stained structures on a bright ground | stains |
| Dark field | only scattered light enters the objective | bright specimen on black: edges, particles | condenser NA above the objective NA, a ring stop |
| Phase contrast | phase delay turned into brightness | transparent cells, dark or bright with halos | phase ring in the objective, matching annulus in the condenser |
| DIC (Nomarski) | interference of two slightly sheared beams: the slope of the delay | a shaded relief, in full aperture | polarizers, two prisms |
| Polarized light | birefringence between crossed polarizers | bright fibres and crystals on black, colours with a compensator | polarizer, analyser, strain-free optics |

### Why a cell is invisible and how phase contrast sees it
A cell 4 µm thick whose index exceeds its surroundings by 0.02 delays light by $\\Delta n\\,t$ = 80 nm, a phase of

$$\\varphi = \\frac{2\\pi\\,\\Delta n\\,t}{\\lambda} = 0.91\\ \\mathrm{rad}\\quad(550\\ \\mathrm{nm})$$

The eye and the camera record intensity only, so a pure delay is invisible. **Phase contrast** (Zernike, Nobel Prize 1953) separates the light that passed straight through from the light diffracted by the specimen, advances or retards the direct light by a quarter wave and dims it. The two now interfere with an intensity that depends on $\\varphi$: for a weak object and a direct amplitude $a$, $I/I_0 \\approx (1 - \\varphi/a)^2$. With $a = 0.5$ and $\\varphi = 0.1$ rad the object is 36 % darker than the ground. In bright field the same object has zero contrast.

### Polarized light
A birefringent object (starch, crystals, muscle fibres, plastic under stress) between crossed polarizers passes

$$I = I_0\\,\\sin^2 2\\alpha\\,\\sin^2\\frac{\\delta}{2}$$

with $\\alpha$ the angle of its axes to the polarizer and $\\delta$ the retardance it introduces. Four dark directions appear where the axes line up with a polarizer: the **Maltese cross** of a starch grain or spherulite.

> [!key] Most specimens change the phase of light, not its amplitude. Köhler lighting sets the NA of the illumination; contrast methods translate scattering, phase, the slope of phase or birefringence into brightness. The price is usually some resolution or an artefact such as a halo.
`,
  ideas: [
    'Transparent specimens change the phase of light, which no eye or camera can see; contrast methods turn it into brightness.',
    'Köhler illumination sets the field with one diaphragm and the NA of the illumination with the other: about 70 to 80 % of the objective NA.',
    'Dark field shows only scattered light and needs a condenser NA larger than the objective NA.',
    'Phase contrast shifts the direct light by a quarter wave and dims it; DIC shows the gradient of optical path as relief.',
    'Polarized light turns birefringence into brightness and colour: I = I₀ sin²2α sin²(δ/2).'
  ],
  pitfalls: [
    'A transparent cell is invisible because it is clear — It is invisible in bright field because it changes the phase of light and not the intensity; phase contrast and DIC turn that into brightness.',
    'The aperture diaphragm controls the brightness — It controls the NA of the illumination (contrast and resolution); brightness is set by the lamp. Closing it to dim the image costs resolution.',
    'The halo in phase contrast is a real structure — It is an artefact of the method: the phase ring also passes some diffracted light.',
    'The 3-D shaded relief in DIC is the true shape — It shows the slope of the optical path, which mixes thickness with refractive index.'
  ],
  terms: [
    { term: 'Bright-field microscopy', also: ['bright field'], def: 'Plain transmitted light: contrast arises only from absorption, so transparent specimens need staining.' },
    { term: 'Dark-field microscopy', also: ['dark field'], def: 'A hollow cone of light too wide to enter the objective, so that only light scattered by the specimen reaches the eye: bright objects on black.' },
    { term: 'Phase contrast', also: ['Zernike phase contrast', 'Ph'], def: 'A method that advances or retards the direct light by a quarter wave and dims it, so that phase differences of the specimen become differences of brightness.' },
    { term: 'Differential interference contrast', also: ['DIC', 'Nomarski contrast'], def: 'Two polarized beams slightly displaced across the specimen interfere after it; the result shows the slope of the optical path as a shaded relief.' },
  ],
  formulas: [
    {
      name: 'Phase shift of a transparent specimen',
      expr: 'phi = 2*pi*dn*t/lambda', tex: '\\varphi = \\frac{2\\pi\\,\\Delta n\\,t}{\\lambda}',
      vars: {
        phi: { name: 'phase shift', q: 'angle', unit: 'rad', tex: '\\varphi' },
        dn: { name: 'index difference to the surroundings', value: 0.02, tex: '\\Delta n' },
        t: { name: 'thickness of the specimen', q: 'length', unit: 'µm', value: 4 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'phi',
      stories: { phi: 'A cell {t} thick has an index {dn} above its surroundings. What phase shift does it cause at {lambda}?' }
    },
    {
      name: 'Birefringent sample between crossed polarizers',
      expr: 'I = I0*sin(2*a)^2*sin(d/2)^2', tex: 'I = I_0\\sin^2 2\\alpha\\,\\sin^2\\frac{\\delta}{2}',
      vars: {
        I: { name: 'transmitted intensity' },
        I0: { name: 'intensity with parallel polarizers', value: 100, tex: 'I_0' },
        a: { name: 'angle of the sample axes to the polarizer', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\alpha' },
        d: { name: 'retardance of the sample', q: 'angle', unit: '°', value: 180, min: 0, max: 360, tex: '\\delta' }
      },
      solveFor: 'I',
      note: 'Full brightness needs the axes at 45° and a half-wave retardance; at 0° or 90° the sample looks dark.'
    },
    {
      name: 'Resolution with a partly closed condenser',
      expr: 'r = 1.22*lambda/(NAo + NAc)', tex: 'r = \\frac{1.22\\,\\lambda}{\\mathrm{NA}_o + \\mathrm{NA}_c}',
      vars: {
        r: { name: 'smallest resolvable distance', q: 'length', unit: 'nm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        NAo: { name: 'NA of the objective', value: 0.65, min: 0.05, max: 1.6, tex: '\\mathrm{NA}_o' },
        NAc: { name: 'NA of the illumination (condenser)', value: 0.5, min: 0.05, max: 1.6, tex: '\\mathrm{NA}_c' }
      },
      solveFor: 'r',
      note: 'With the illumination NA equal to the objective NA this is 0.61 λ/NA.'
    }
  ],
  examples: [
    {
      title: 'Seeing a nearly invisible cell',
      q: 'In positive phase contrast the direct light is dimmed to amplitude $a = 0.5$. A weak object delays light by $\\varphi = 0.1$ rad. How much darker than the background is it, and what contrast does bright field give?',
      steps: [
        { text: 'In phase contrast the relative intensity is', tex: '\\frac{I}{I_0} = \\left(1 - \\frac{\\varphi}{a}\\right)^2 = (1 - 0.2)^2 = 0.64' },
        'The object is 36 % darker than its surroundings.',
        'In bright field a pure phase object leaves the intensity unchanged ($|e^{i\\varphi}|^2 = 1$): zero contrast.'
      ],
      a: '36 % contrast in phase contrast, none in bright field.'
    },
    {
      title: 'A crystal between crossed polarizers',
      q: 'A crystal of retardance 180° has its axes at 22.5° to the polarizer. What fraction of the light passes?',
      steps: [
        { text: 'Insert into the formula:', tex: '\\frac{I}{I_0} = \\sin^2(45^\\circ)\\,\\sin^2(90^\\circ) = 0.5\\times 1 = 0.5' }
      ],
      a: 'Half. At 45° it would be fully bright; at 0° or 90°, dark.'
    }
  ],
  quiz: [
    { q: 'Why is a living cell almost invisible in bright-field microscopy?', choices: ['It changes the phase of light, not its intensity', 'It is too small', 'It reflects all the light', 'It scatters light into the objective'], a: 0, why: 'A thin, nearly colourless cell absorbs very little but delays light by a fraction of a wavelength; detectors respond to intensity, so the delay is invisible until a method turns it into brightness.' },
    { q: 'Dark-field illumination needs a condenser whose NA exceeds that of the objective.', a: true, why: 'The hollow cone of light must miss the objective entirely; only light scattered into the objective by the specimen then reaches the eye.' },
    { q: 'A birefringent sample with $\\delta = 180°$ has its axes at 22.5° to the polarizer, between crossed polarizers. What fraction $I/I_0$ passes?', answer: 0.5, why: '$\\sin^2 45°\\times\\sin^2 90° = 0.5$.' },
    { q: 'Which method gives a shaded-relief picture that is brightest where the optical path rises fastest?', choices: ['Differential interference contrast', 'Dark field', 'Bright field', 'Phase contrast'], a: 0, why: 'DIC compares the phase of two beams sheared by a fraction of the resolution, so the brightness follows the slope of the optical path.' },
    { q: 'Opening the aperture diaphragm of the condenser fully, compared with setting it to about 75 % of the objective NA, usually gives…', choices: ['more resolution but lower contrast and some glare', 'less resolution and more contrast', 'a brighter image of exactly the same quality', 'a darker field'], a: 0, why: 'The wider the illumination NA, the finer the detail that can be resolved ($1.22\\lambda/(\\mathrm{NA}_o + \\mathrm{NA}_c)$), but stray light and flare reduce contrast.' }
  ],
  applications: [
    'Cell culture: phase contrast lets one watch living, unstained cells grow in a dish.',
    'Pathology and bacteriology: bright field with stains; dark field to see spirochaetes and particles too thin to image otherwise.',
    'Mineralogy and materials: polarized light identifies minerals by their colours and shows strain in plastics and glass.',
    'Semiconductors and polished surfaces: DIC shows steps of a few nanometres in height.',
    'Developmental biology: DIC of embryos and oocytes without stain.'
  ],
  history: 'August Köhler published his illumination method in 1893. Frits Zernike devised phase contrast in the 1930s, the first commercial phase microscopes appeared in the early 1940s, and he received the Nobel Prize in Physics in 1953. Georges Nomarski developed differential interference contrast in the 1950s.',
  sources: [
    'M. Bass (ed.), *Handbook of Optics* — the chapter on microscopes, with contrast methods.',
    'M. Born and E. Wolf, *Principles of Optics* — the section on phase-contrast observation (Zernike).',
    'ISO 10934, *Optics and optical instruments — Vocabulary for microscopy* — the terms for illumination and contrast.'
  ],
  sim: 'oi-contrast'
},

/* ================================================================ fluorescence and confocal microscopy */
{
  id: 'fluorescence-and-confocal-microscopy', parent: 'optical-instruments', title: 'Fluorescence and confocal microscopy', level: 3,
  short: 'A fluorescent dye absorbs light of one colour and re-emits a longer wavelength; a filter cube with an excitation filter, a dichroic mirror and an emission filter shows it against black. A confocal microscope adds a pinhole that blocks the out-of-focus light, so that it images one thin plane at a time.',
  keywords: ['fluorescence', 'fluorescence microscope', 'filter cube', 'dichroic mirror', 'excitation filter', 'emission filter', 'barrier filter', 'Stokes shift', 'GFP', 'DAPI', 'epifluorescence', 'confocal', 'pinhole', 'optical section', 'Airy unit', 'photobleaching', 'laser scanning'],
  prereq: ['the-compound-microscope', 'dichroic-filters-and-mirrors', 'interference-filters'],
  related: ['microscope-objectives', 'laser-scanning-microscopes', 'microscope-illumination-and-contrast', 'photon-energy', 'the-airy-disk', 'biology:microscopy'],
  body: `
### Fluorescence
A **fluorophore** absorbs a photon and, a few nanoseconds later, emits a photon of *longer* wavelength: some of the energy goes into heat and vibration (the **Stokes shift**). Because the emitted light has a different colour from the exciting light, a filter can separate the two even though the excitation is a million times stronger. The labelled structure then shines against a black background.

| Dye | Excitation (nm) | Emission (nm) | Shift (nm) |
|---|---|---|---|
| DAPI, bound to DNA | 358 | 461 | 103 |
| Green fluorescent protein (EGFP) | 488 | 507 | 19 |
| Rhodamine type (TRITC) | 557 | 576 | 19 |
| Far-red cyanine (Cy5 type) | 650 | 670 | 20 |

### The filter cube
Light comes down through the objective, which acts as its own condenser (epi-illumination). A cube holds three parts:
1. an **excitation filter** passing only the band the dye absorbs;
2. a **dichroic mirror** at 45° that reflects the excitation light into the objective and transmits the longer emission ([[dichroic-filters-and-mirrors]]);
3. an **emission (barrier) filter** that passes the emission and stops any excitation light that leaks back. Together the filters must block the excitation to an optical density of 6 or more.

Dyes fade (**photobleaching**) and illumination can harm living cells, so exposure is kept short.

> [!warn] Fluorescence lamp houses emit ultraviolet and intense blue light. Never look into the lamp house, the objective or the open light path without the filters in place, and follow the shielding of the instrument. Mercury lamps can burst when hot and are disposed of as hazardous waste.

### Confocal: one plane at a time
In a wide-field fluorescence microscope the camera collects light from the whole depth of the specimen, in focus or not. A **confocal** microscope focuses a laser to a diffraction-limited spot in the specimen and places a **pinhole** in the image plane in front of the detector. Light from the spot comes to a point at the pinhole and passes; light from above or below arrives as a wide disc and mostly misses. The spot is scanned over the specimen (mirrors, or a spinning disc of many pinholes), building an image of a thin plane: an **optical section**. A stack of sections gives a volume.

The pinhole is usually set to one **Airy unit**, the diameter of the first dark ring of the Airy pattern as seen in the specimen, $1.22\\lambda/\\mathrm{NA}$. The thickness of the optical section is about

$$\\Delta z \\approx \\frac{1.4\\,\\lambda\\,n}{\\mathrm{NA}^2}$$

0.53 µm for 488 nm with an NA 1.4 oil objective, 1.6 µm for NA 0.65 in air. Closing the pinhole further gives a thinner section and up to about 1.4 times finer lateral resolution but costs signal.

### Related methods
Spinning-disc systems image many points at once, faster and gentler on the specimen; **two-photon** microscopy gets sectioning from the nonlinear excitation without any pinhole; a light sheet illuminates only the plane that is imaged. Scanning confocal instruments are described in [[laser-scanning-microscopes]].

> [!key] Fluorescence turns colour into contrast: excitation filter, dichroic mirror and emission filter separate the faint longer-wavelength glow from the exciting light. A confocal pinhole, set near one Airy unit, rejects out-of-focus light and gives optical sections about $1.4\\lambda n/\\mathrm{NA}^2$ thick.
`,
  ideas: [
    'A fluorophore emits at a longer wavelength than it absorbs (the Stokes shift), so a filter can separate emission from excitation.',
    'A filter cube holds an excitation filter, a dichroic mirror at 45° and an emission filter; together they block the exciting light to OD 6 or more.',
    'In epi-fluorescence the objective is also the condenser, so the specimen is lit and imaged through the same lens.',
    'A confocal pinhole passes light from the focal spot and blocks most of the out-of-focus light.',
    'The optical section is about 1.4 λ n / NA² thick; a smaller pinhole thins it but costs signal.'
  ],
  pitfalls: [
    'Fluorescence is just reflected light of a different colour — The dye absorbs a photon and later emits another, with some of the energy lost: it is emission, and it continues for nanoseconds after the light is removed.',
    'A confocal microscope has better resolution because of its extra magnification — It rejects out-of-focus light and so gives sections; the lateral resolution improves only a little (up to about 1.4 times) and only with a tiny pinhole.',
    'A smaller pinhole is always better — It gives thinner sections but less signal; a pinhole of about one Airy unit is the usual compromise.',
    'Fluorescence imaging is harmless to living cells — The excitation light bleaches dyes and can damage cells; exposure and intensity are kept as low as the signal allows.'
  ],
  terms: [
    { term: 'Fluorescence', def: 'Emission of a photon of longer wavelength a few nanoseconds after a molecule has absorbed one; it stops when the exciting light stops.' },
    { term: 'Stokes shift', def: 'The difference in wavelength between the peaks of absorption and emission of a fluorophore, 19 nm for EGFP and over 100 nm for DAPI.' },
    { term: 'Filter cube', also: ['filter set', 'filter block'], def: 'The assembly of excitation filter, dichroic mirror and emission filter, that selects one dye in a fluorescence microscope.' },
    { term: 'Confocal pinhole', def: 'A small aperture in the image plane in front of the detector, conjugate to the illuminated spot, that blocks light from out-of-focus planes.' },
    { term: 'Optical section', also: ['optical sectioning'], def: 'The thin plane of a thick specimen that a confocal or similar microscope images, with light from other planes rejected.' },
    { term: 'Airy unit', also: ['AU'], def: 'The diameter of the first dark ring of the Airy pattern, 1.22 λ/NA in the specimen; the usual size of a confocal pinhole.' }
  ],
  formulas: [
    {
      name: 'Photon energy',
      expr: 'E = h*c/lambda', tex: 'E = \\frac{h\\,c}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 488, tex: '\\lambda' }
      },
      solveFor: 'E',
      note: 'Emission at 507 nm carries 0.1 eV less than excitation at 488 nm: the lost energy is the Stokes shift.'
    },
    {
      name: 'Airy unit in the specimen',
      expr: 'AU = 1.22*lambda/NA', tex: '\\mathrm{AU} = \\frac{1.22\\,\\lambda}{\\mathrm{NA}}',
      vars: {
        AU: { name: 'diameter of one Airy unit', q: 'length', unit: 'nm', tex: '\\mathrm{AU}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 488, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 1.4, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' }
      },
      solveFor: 'AU'
    },
    {
      name: 'Confocal optical section',
      expr: 'dz = 1.4*lambda*n/NA^2', tex: '\\Delta z = \\frac{1.4\\,\\lambda\\,n}{\\mathrm{NA}^2}',
      vars: {
        dz: { name: 'thickness of the optical section', q: 'length', unit: 'µm', tex: '\\Delta z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 488, tex: '\\lambda' },
        n: { name: 'refractive index of the immersion', value: 1.515, min: 1, max: 1.8 },
        NA: { name: 'numerical aperture', value: 1.4, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' }
      },
      solveFor: 'dz',
      note: 'An approximation for a small pinhole; a pinhole larger than about one Airy unit thickens the section.'
    }
  ],
  examples: [
    {
      title: 'How much energy does a GFP molecule keep?',
      q: 'EGFP is excited at 488 nm and emits at 507 nm. What fraction of the photon\'s energy is lost?',
      steps: [
        { text: 'Energy goes as $1/\\lambda$, so the emitted photon has', tex: '\\frac{488}{507} = 0.962' },
        'of the energy of the absorbed one: 2.541 eV in, 2.445 eV out.'
      ],
      a: 'About 3.7 % of the energy, 0.1 eV, goes into heat; the dichroic edge must lie between 488 and 507 nm.'
    },
    {
      title: 'Planes for a 10 µm slab',
      q: 'A confocal microscope with a 488 nm laser and an NA 1.4 oil objective sections to 0.53 µm. How many planes should be recorded through a 10 µm thick specimen, if the spacing is half a section thickness?',
      steps: [
        'Spacing: $0.53/2 = 0.26$ µm, so that every feature appears in at least two planes.',
        { text: 'Number of planes:', tex: '\\frac{10}{0.26} \\approx 38 \\;\\Rightarrow\\; 39\\ \\text{planes}' }
      ],
      a: 'About 39 planes; the stack also records 39 times the light dose, which is why exposure is rationed.'
    }
  ],
  quiz: [
    { q: 'In a fluorescence microscope the emission has…', choices: ['a longer wavelength than the excitation', 'a shorter wavelength than the excitation', 'exactly the same wavelength', 'a wavelength that depends only on the filter'], a: 0, why: 'Part of the absorbed photon energy is lost as heat, so the emitted photon has less energy and a longer wavelength: the Stokes shift.' },
    { q: 'What does the dichroic mirror in a filter cube do?', choices: ['Reflects the excitation light towards the specimen and transmits the longer-wavelength emission to the eye', 'Dims all light equally', 'Polarizes the excitation light', 'Focuses the light on the pinhole'], a: 0, why: 'A dichroic edge lies between the excitation and emission bands; at 45° it folds the exciting light down the objective and lets the emission pass.' },
    { q: 'Closing a confocal pinhole below one Airy unit gives a thinner optical section but less signal.', a: true, why: 'A smaller pinhole rejects more out-of-focus light and also some in-focus light, so sections get thinner and the signal drops.' },
    { q: 'What is the thickness of a confocal optical section at 561 nm with an NA 1.4 oil objective (n = 1.515), in micrometres?', answer: 0.607, why: '$1.4\\lambda n/\\mathrm{NA}^2 = 1.4\\times 0.561\\times 1.515/1.96 = 0.607$ µm.' },
    { q: 'What does a confocal pinhole block?', choices: ['Light from planes above and below the focal plane', 'Light from the focal spot', 'All fluorescent light', 'The laser light entering the objective'], a: 0, why: 'Light from the focal spot is focused into the pinhole; light from out-of-focus planes reaches the pinhole plane as a large blur and mostly misses it.' }
  ],
  applications: [
    'Cell biology: proteins tagged with green fluorescent protein and its relatives, imaged live in several colours.',
    'Pathology: immunofluorescence on tissue sections, with DAPI marking the nuclei.',
    'Developmental biology and neuroscience: confocal stacks of embryos, brain slices and organoids reconstructed in three dimensions.',
    'Materials: fluorescence of polymers, coatings and fibres; inspection of paper and security features under ultraviolet.',
    'Flow cytometers and gene-chip readers, which use the same excitation, dichroic and emission filter sets.'
  ],
  history: 'George Gabriel Stokes named fluorescence and described the longer-wavelength emission in 1852. Marvin Minsky patented the confocal principle in 1957. Green fluorescent protein, found in the jellyfish *Aequorea victoria* by Osamu Shimomura in 1962, became the universal label after it was cloned and expressed in the 1990s; Shimomura, Martin Chalfie and Roger Tsien shared the 2008 Nobel Prize in Chemistry.',
  sources: [
    'J. R. Lakowicz, *Principles of Fluorescence Spectroscopy* — fluorescence, the Stokes shift and the filter sets.',
    'J. B. Pawley (ed.), *Handbook of Biological Confocal Microscopy* — pinhole, optical section and the Airy unit.',
    'M. Bass (ed.), *Handbook of Optics* — the chapter on microscopes.'
  ],
  sim: ['oi-fluorescence', 'oi-confocal']
},

/* ================================================================ refracting telescopes */
{
  id: 'refracting-telescopes', parent: 'optical-instruments', title: 'Refracting telescopes', level: 2,
  short: 'A long-focus objective lens makes a small real image of a distant scene and a short-focus eyepiece magnifies it, so that M = f_objective / f_eyepiece. In the Keplerian form the view is inverted; in the Galilean form, with a negative eyepiece, it is upright and short. Whatever the magnification, it is the aperture that decides what can be seen.',
  keywords: ['refracting telescope', 'refractor', 'Kepler', 'Galileo', 'Galilean telescope', 'opera glasses', 'objective', 'eyepiece', 'magnification', 'achromat', 'apochromat', 'aperture', 'Rayleigh', 'Dawes', 'exit pupil', 'light grasp', 'afocal', 'focal ratio'],
  prereq: ['angular-magnification', 'eyepieces', 'combining-thin-lenses'],
  related: ['reflecting-telescopes', 'binoculars', 'exit-pupil-and-eye-relief', 'achromatic-doublet', 'apochromats-and-ed-glass', 'the-airy-disk', 'resolution-limits', 'physics:optical-instruments'],
  body: `
A refractor is two lenses. A long-focus **objective** collects light from a distant scene and forms a small real image at its focal plane; a short-focus **eyepiece** magnifies that image. The two focal points coincide, so parallel rays enter and leave parallel: an *afocal* system, whose job is to turn the angle of the incoming rays into a larger one.

### Two forms
- **Keplerian** (1611): positive objective and positive eyepiece, separated by $f_o + f_e$. The view is inverted, $M = -f_o/f_e$. There is a real intermediate image, so a field stop or a reticle can be placed in it. A 1000 mm objective with a 25 mm eyepiece makes 40× in a tube a little over a metre long.
- **Galilean** (1609): positive objective, *negative* eyepiece, separated by $f_o - |f_e|$. The view is upright, $M = +f_o/|f_e|$, and the tube is short: 150 mm with $-50$ mm gives 3× in 100 mm. There is no real intermediate image, so no reticle, and the field is narrow. Opera glasses and cheap toy telescopes are Galilean, at 2× to 4×.

Telescopes for land use add a prism or a relay lens to the Keplerian form to turn the image upright.

### Magnification is not the point
$M$ is easy to raise: fit a shorter eyepiece. What a telescope can show is set by its aperture $D$:
- **Light grasp** goes as $D^2$. A 100 mm objective collects $(100/7)^2 = 204$ times as much light as a 7 mm night pupil.
- **Resolution** is set by diffraction: the Rayleigh angle $1.22\\lambda/D$ is 1.38″ at 100 mm in green light; the Dawes limit for double stars is 1.16″.
- **Exit pupil** $D/M$ should not exceed about 7 mm, so $M \\ge D/7$: 14× for 100 mm. And $M$ above about $2D$ in millimetres is empty magnification ([[angular-magnification]]).

| Aperture | Rayleigh limit | lowest useful $M$ | highest useful $M$ |
|---|---|---|---|
| 60 mm | 2.3″ | 9× | 120× |
| 100 mm | 1.4″ | 14× | 200× |
| 200 mm | 0.7″ | 29× | 400× |

### Colour and focal ratio
A single glass lens bends blue more than red, so a simple objective fringes bright objects with colour. An **achromat** doublet ([[achromatic-doublet]]) reduces it; **apochromats** with low-dispersion glass ([[apochromats-and-ed-glass]]) nearly remove it. For a given type of glass, a longer focal ratio $f_o/D$ also lessens the fringing, which is why classic achromats were slow (f/12 to f/15). A refractor has a sealed tube, no central obstruction and holds its alignment well.

> [!warn] Never point any telescope at the Sun without a certified solar filter fixed over the *front* of the objective. Focused sunlight burns the retina in a fraction of a second, painlessly. Filters at the eyepiece can crack from the heat, and a finder scope must be capped or filtered too.

> [!key] $M = f_o/f_e$ (inverted in the Keplerian form, upright and short in the Galilean). The aperture, not $M$, sets light grasp ($\\propto D^2$) and resolution ($1.22\\lambda/D$); stay between $D/7$ and $2D$ millimetres of magnification.
`,
  ideas: [
    'A refractor is an afocal pair: objective and eyepiece share a focal point, and M = f_o / f_e.',
    'Kepler: two positive lenses, inverted view, real intermediate image (reticle possible). Galileo: negative eyepiece, upright, short, narrow field.',
    'Light grasp goes as D²; resolution as λ/D; neither depends on the eyepiece.',
    'Useful magnification runs from D/7 (exit pupil 7 mm) to about 2D (millimetres); beyond that it is empty.',
    'Never view the Sun through any telescope without a certified filter on the front.'
  ],
  pitfalls: [
    'Magnification is what makes a telescope good — It is the aperture: light grasp goes as D² and resolution as 1/D. A cheap small telescope with a very short eyepiece gives a large dim blur.',
    'A Galilean telescope has an inverted image like all telescopes — The negative eyepiece keeps the image upright, which is why opera glasses need no prism.',
    'The telescope\'s image of a distant object is the same size as the object — The real image in the focal plane is tiny (the Moon is 9 mm wide in a 1000 mm objective); magnification is an angle ratio.',
    'A stronger eyepiece makes the sky brighter — For an extended object, the image can never be brighter than with the naked eye; high power only makes it dimmer.'
  ],
  terms: [
    { term: 'Telescope objective', also: ['objective lens', 'primary lens'], def: 'The large lens at the front of a refracting telescope. Its diameter sets the light collected and the resolution; its focal length sets the image scale.' },
    { term: 'Keplerian telescope', also: ['astronomical telescope'], def: 'A telescope with a positive objective and a positive eyepiece; it forms a real intermediate image and an inverted view.' },
    { term: 'Galilean telescope', also: ['opera-glass type'], def: 'A telescope with a positive objective and a negative eyepiece; the view is upright and the tube short, but the field is narrow.' },
    { term: 'Focal ratio', also: ['f/number of a telescope', 'f/ratio'], def: 'The objective\'s focal length divided by its diameter: a 1000 mm lens of 100 mm aperture is f/10. It sets image scale and brightness of extended images.' },
    { term: 'Dawes limit', def: 'An empirical resolution limit for double stars, 116/D arc-seconds for a telescope of D millimetres; close to the Rayleigh limit.' },
    { term: 'Light grasp', also: ['light-gathering power'], def: 'The light collected by the objective, proportional to D²; usually quoted relative to a 7 mm eye pupil.' }
  ],
  formulas: [
    {
      name: 'Magnification of a telescope',
      expr: 'M = fo/fe', tex: 'M = \\frac{f_o}{f_e}',
      vars: {
        M: { name: 'angular magnification' },
        fo: { name: 'focal length of the objective', q: 'length', unit: 'mm', value: 1000, tex: 'f_o' },
        fe: { name: 'focal length of the eyepiece', q: 'length', unit: 'mm', value: 25, tex: 'f_e' }
      },
      solveFor: 'M',
      note: 'Magnitude only: the sign (inverted for a Keplerian telescope) is left out.',
      stories: { M: 'A telescope has an objective of focal length {fo} and an eyepiece of {fe}. What is its magnification?', fe: 'A telescope with a {fo} objective must magnify {M}. What eyepiece focal length does it need?' }
    },
    {
      name: 'Exit pupil',
      expr: 'dp = D/M', tex: 'd_p = \\frac{D}{M}',
      vars: {
        dp: { name: 'diameter of the exit pupil', q: 'length', unit: 'mm', tex: 'd_p' },
        D: { name: 'diameter of the objective', q: 'length', unit: 'mm', value: 100 },
        M: { name: 'angular magnification', value: 40, min: 1, max: 1000 }
      },
      solveFor: 'dp'
    },
    {
      name: 'Rayleigh resolution limit',
      expr: 'theta = 1.22*lambda/D', tex: '\\theta = \\frac{1.22\\,\\lambda}{D}',
      vars: {
        theta: { name: 'smallest resolvable angle', q: 'angle', unit: '″', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        D: { name: 'diameter of the objective', q: 'length', unit: 'mm', value: 100 }
      },
      solveFor: 'theta',
      note: 'For a circular aperture and a point source; the Dawes limit, 116″ ÷ D(mm), is slightly smaller.'
    },
    {
      name: 'Length of the tube',
      expr: 'Lt = fo + fe', tex: 'L = f_o + f_e',
      vars: {
        Lt: { name: 'distance between objective and eyepiece', q: 'length', unit: 'mm', tex: 'L' },
        fo: { name: 'focal length of the objective', q: 'length', unit: 'mm', value: 150, tex: 'f_o' },
        fe: { name: 'focal length of the eyepiece (negative for a Galilean telescope)', q: 'length', unit: 'mm', value: -50, signed: true, tex: 'f_e' }
      },
      solveFor: 'Lt',
      note: 'A negative fe gives the short Galilean tube.'
    },
    {
      name: 'Light grasp relative to the eye',
      expr: 'G = (D/de)^2', tex: 'G = \\left(\\frac{D}{d_e}\\right)^2',
      vars: {
        G: { name: 'light gathered relative to the eye' },
        D: { name: 'diameter of the objective', q: 'length', unit: 'mm', value: 100 },
        de: { name: 'diameter of the eye pupil', q: 'length', unit: 'mm', value: 7, tex: 'd_e' }
      },
      solveFor: 'G'
    }
  ],
  examples: [
    {
      title: 'A 100 mm refractor at 40×',
      q: 'A refractor has a 100 mm objective of 1000 mm focal length and a 25 mm eyepiece. Find the magnification, exit pupil, tube length, resolution and the highest useful magnification.',
      steps: [
        'Magnification: $M = 1000/25 = 40$.',
        'Exit pupil: $100/40 = 2.5$ mm, comfortable (the dark-adapted pupil is up to 7 mm).',
        'Tube: $1000 + 25 = 1025$ mm.',
        { text: 'Resolution:', tex: '\\theta = \\frac{1.22\\times 550\\ \\mathrm{nm}}{100\\ \\mathrm{mm}} = 1.38\'\'' },
        'Highest useful magnification about $2\\times 100 = 200$; lowest $100/7 = 14$.'
      ],
      a: '40×, a 2.5 mm exit pupil, 1025 mm tube, 1.38″ resolution; useful up to about 200×.'
    },
    {
      title: 'Kepler against Galileo at 3×',
      q: 'Two telescopes have a 150 mm objective and give 3×: one Galilean with a $-50$ mm eyepiece, one Keplerian with $+50$ mm. Compare the lengths and the views.',
      steps: [
        'Both give $M = 150/50 = 3$.',
        { text: 'Galilean tube: $150 - 50 = 100$ mm; Keplerian tube:', tex: '150 + 50 = 200\\ \\mathrm{mm}' },
        'The Galilean view is upright; the Keplerian is inverted but has a real image plane for a reticle and a wider true field.'
      ],
      a: 'Galilean: 100 mm, upright; Keplerian: 200 mm, inverted, with a reticle plane.'
    }
  ],
  quiz: [
    { q: 'Which telescope form gives an upright view with no prism and a short tube?', choices: ['Galilean, with a negative eyepiece', 'Keplerian, with a positive eyepiece', 'Either, if the eyepiece is long', 'Neither'], a: 0, why: 'The diverging eyepiece in a Galilean telescope intercepts the converging beam before the image forms, leaving it upright and shortening the tube by twice |f_e|.' },
    { q: 'A telescope has an objective of 900 mm focal length and an 18 mm eyepiece. Its magnification is…', answer: 50, why: '$M = f_o/f_e = 900/18 = 50$.' },
    { q: 'Doubling the diameter of the objective doubles the light it collects.', a: false, why: 'Light grasp goes as the area, $D^2$: doubling $D$ gathers four times the light.' },
    { q: 'An 80 mm telescope is used at 40×. What is the exit pupil, in millimetres?', answer: 2, why: '$d_p = D/M = 80/40 = 2$ mm.' },
    { q: 'A 60 mm telescope is fitted with a 4 mm eyepiece and a long focal length for 300×. The image is large but fuzzy because…', choices: ['the aperture limits resolution (about 2.3″) and 300× is far beyond the 120× useful maximum', 'the eyepiece is too short to focus', 'the telescope is Galilean', 'the exit pupil is too large'], a: 0, why: 'Resolution is set by the aperture; enlarging beyond about two times the aperture in millimetres only magnifies the diffraction blur and the aberrations.' }
  ],
  applications: [
    'Amateur and school astronomy with refractors from 60 to 150 mm; apochromatic refractors are favoured for planetary and astrophotographic work.',
    'Spotting scopes for birdwatching, shooting ranges and surveillance: a refractor with a prism in a sealed tube.',
    'Surveyors\' theodolites and levels, whose telescopes carry a reticle in the intermediate image.',
    'Rifle sights and the finder scopes of larger telescopes.',
    'Opera glasses and simple binoculars of Galilean form, at 2× to 4×.'
  ],
  history: 'The telescope appeared in the Netherlands in 1608 (Hans Lipperhey applied for a patent) and Galileo made his own improved versions in 1609. Johannes Kepler described the two-convex-lens form in his *Dioptrice* of 1611. The achromatic doublet was made by Chester Moor Hall about 1733 and brought to market by John Dollond from 1758. The largest refractor ever built has a 1 m lens, at Yerkes Observatory (1897).',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the telescope as an afocal lens pair.',
    'R. Kingslake, *Optical System Design* — telescope objectives and the achromat.',
    'ISO 14132, *Optics and optical instruments — Vocabulary for telescopic systems* — the terms used for telescopes and their parts.'
  ],
  sim: 'oi-refractor'
},

/* ================================================================ reflecting telescopes */
{
  id: 'reflecting-telescopes', parent: 'optical-instruments', title: 'Reflecting telescopes', level: 2,
  short: 'A concave mirror gathers the light and brings it to a focus with no colour error; a small second mirror places the focus where the observer can reach it. Newtonian, Cassegrain, Ritchey–Chrétien and catadioptric designs differ in how they fold the beam and which off-axis aberrations they cancel.',
  keywords: ['reflecting telescope', 'reflector', 'Newtonian', 'Cassegrain', 'Ritchey-Chrétien', 'Schmidt-Cassegrain', 'Maksutov', 'primary mirror', 'secondary mirror', 'parabola', 'coma', 'obstruction', 'catadioptric', 'Gregorian', 'focal ratio'],
  prereq: ['refracting-telescopes', 'parabolic-and-elliptical-mirrors', 'spherical-mirror-aberration'],
  related: ['coma', 'catadioptric-lenses', 'aspheric-surfaces', 'strehl-ratio-and-diffraction-limited', 'astronomical-observatories-and-adaptive-optics', 'the-f-number'],
  body: `
A mirror bends every colour by the same law, can be supported along its whole back, and works well into the ultraviolet and the infrared. Every large telescope built since the late 19th century is a reflector. The difficulty is that a mirror brings the light back to where it came from: something has to be put in the beam to get at the image.

### The primary: why a parabola
A spherical mirror focuses only rays close to its axis; a wide beam suffers spherical aberration. A **paraboloid** brings parallel light from the axis to a perfect point. In a ray trace of a 200 mm, f/5 mirror the spherical form gives a blur of 25 µm rms on axis, against an Airy-disc radius of 3.4 µm; the paraboloid gives zero. A paraboloid of that size is only $r^2/4f = 2.5$ mm deep at its edge.

### Where does the focus go?
- **Prime focus**: the observer or a camera sits in the beam. Large telescopes do this.
- **Newtonian**: a small flat mirror at 45° sends the beam out through the side of the tube. Simple and cheap; focal ratios of f/4 to f/8.
- **Cassegrain**: a small convex secondary returns the beam through a hole in the primary. A primary of f/4 and a secondary that magnifies 4× make a telescope of focal length 3200 mm for a 200 mm mirror — f/16 — in a tube little longer than the primary's own focal length.

| Type | Mirrors | What it cures | Typical focal ratio |
|---|---|---|---|
| Newtonian | paraboloid + flat | spherical aberration | f/4 to f/8 |
| Classical Cassegrain | paraboloid + convex hyperboloid | spherical aberration | f/10 to f/20 |
| Ritchey–Chrétien | two hyperboloids | spherical aberration and coma | f/8 to f/24 |
| Schmidt–Cassegrain | two spherical mirrors + aspheric corrector plate | spherical aberration, coma | about f/10 |
| Maksutov–Cassegrain | two spherical mirrors + thick meniscus | spherical aberration | f/12 to f/15 |

### Coma and the field
Off axis a paraboloid shows **coma**, a comet-shaped flare that grows with the field angle and shrinks as the focal ratio grows. In the model, the f/5 Newtonian has an rms blur of 4.1 µm at 0.1° off axis and 10.3 µm at 0.25°; at f/10 it is half that. The Ritchey–Chrétien's two hyperboloids cancel coma as well as spherical aberration: in the f/16 model its blur at 0.1° is 0.44 µm, against 1.34 µm for the classical Cassegrain. That is why almost every professional telescope, the Hubble Space Telescope included, is of this form.

### The price of the second mirror
The secondary blocks part of the aperture; the fraction of area lost is $(d/D)^2$. A secondary a quarter of the diameter takes only 6 % of the area, but it moves light from the Airy disc into the rings and reduces contrast in fine detail, and its supports add diffraction spikes.

> [!warn] Never point a telescope at the Sun without a certified solar filter over the front aperture. A reflector concentrates sunlight just as a refractor does, and the secondary mirror and focus can burn.

> [!key] A paraboloid focuses a distant point perfectly on axis; the second mirror places the focus and, as two hyperboloids, can also cancel coma. Mirrors carry no colour error but a secondary costs area and contrast.
`,
  ideas: [
    'A mirror has no colour error, can be supported from behind and works in the ultraviolet and infrared.',
    'A paraboloid focuses parallel rays from its axis without spherical aberration; a sphere does not.',
    'Newtonian: parabola and a flat at 45°. Cassegrain: parabola and a convex secondary, with a long focal length in a short tube.',
    'Ritchey–Chrétien: two hyperboloids cancel spherical aberration and coma, and give a wide field.',
    'The secondary obstructs a fraction (d/D)² of the area and lowers contrast somewhat.'
  ],
  pitfalls: [
    'A reflector\'s secondary mirror makes a black hole in the image — It lies near the pupil, far from the image plane, so it only removes a little light from every part of the picture and slightly reduces contrast.',
    'Mirrors cannot suffer aberrations — They have no colour error, but a spherical mirror has spherical aberration, a paraboloid has coma off axis, and all have astigmatism and field curvature.',
    'A bigger mirror always gives a bigger image — The image scale depends on the focal length; the aperture sets the light and the resolution.',
    'A Cassegrain is just a long tube — The secondary folds the light path so that a long focal length lives in a short tube; that is the reason for its shape.'
  ],
  terms: [
    { term: 'Primary mirror', def: 'The large concave mirror at the back of a reflecting telescope that gathers the light; its diameter is the aperture.' },
    { term: 'Secondary mirror', def: 'The smaller mirror in front of the primary that redirects the light to the eyepiece or camera: a flat in a Newtonian, a convex hyperboloid in a Cassegrain.' },
    { term: 'Newtonian telescope', def: 'A reflector with a paraboloid primary and a flat diagonal mirror at 45° that sends the beam out through the side of the tube.' },
    { term: 'Cassegrain telescope', def: 'A reflector with a paraboloid primary and a convex hyperboloid secondary that returns the beam through a hole in the primary; the focal length is the primary\'s times the secondary\'s magnification.' },
    { term: 'Ritchey–Chrétien telescope', also: ['RC'], def: 'A Cassegrain-type telescope with two hyperboloid mirrors that cancels spherical aberration and coma and gives a wide field; used by most large observatories.' },
    { term: 'Catadioptric telescope', also: ['Schmidt–Cassegrain', 'Maksutov'], def: 'A telescope that combines mirrors with a refracting corrector plate at the front to fix the aberrations of spherical mirrors.' }
  ],
  formulas: [
    {
      name: 'Focal ratio',
      expr: 'N = f/D', tex: 'N = \\frac{f}{D}',
      vars: {
        N: { name: 'focal ratio' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 1000 },
        D: { name: 'diameter of the primary mirror', q: 'length', unit: 'mm', value: 200 }
      },
      solveFor: 'N'
    },
    {
      name: 'Focal length of a Cassegrain',
      expr: 'f = m*f1', tex: 'f = m\\,f_1',
      vars: {
        f: { name: 'focal length of the telescope', q: 'length', unit: 'mm' },
        m: { name: 'magnification of the secondary mirror', value: 4, min: 1, max: 20 },
        f1: { name: 'focal length of the primary', q: 'length', unit: 'mm', value: 800, tex: 'f_1' }
      },
      solveFor: 'f'
    },
    {
      name: 'Depth of a paraboloid',
      expr: 'z = r^2/(4*f)', tex: 'z = \\frac{r^2}{4 f}',
      vars: {
        z: { name: 'depth of the surface at radius r', q: 'length', unit: 'mm' },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 100 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 1000 }
      },
      solveFor: 'z'
    },
    {
      name: 'Area lost to the secondary',
      expr: 'A = (d/D)^2', tex: 'A = \\left(\\frac{d}{D}\\right)^2',
      vars: {
        A: { name: 'fraction of the aperture area blocked' },
        d: { name: 'diameter of the central obstruction', q: 'length', unit: 'mm', value: 50 },
        D: { name: 'diameter of the primary mirror', q: 'length', unit: 'mm', value: 200 }
      },
      solveFor: 'A'
    }
  ],
  examples: [
    {
      title: 'A compact Cassegrain',
      q: 'A 200 mm primary of focal length 800 mm is paired with a secondary of magnification 4. What are the focal length and focal ratio of the telescope, and how deep is the primary at its edge?',
      steps: [
        'Focal length: $4\\times 800 = 3200$ mm.',
        'Focal ratio: $3200/200 = 16$ (the primary alone is f/4).',
        { text: 'The primary\'s depth at its rim:', tex: 'z = \\frac{100^2}{4\\times 800} = 3.1\\ \\mathrm{mm}' }
      ],
      a: '3200 mm, f/16, with a primary only 3.1 mm deep at its edge.'
    },
    {
      title: 'How much does the diagonal take?',
      q: 'A Newtonian with a 200 mm mirror has a flat 50 mm across. What fraction of the aperture area does it block?',
      steps: [
        { text: 'Area fraction:', tex: '\\left(\\frac{50}{200}\\right)^2 = 0.0625' }
      ],
      a: '6.3 % of the area: the image is only slightly dimmer, but contrast in fine detail drops a little.'
    }
  ],
  quiz: [
    { q: 'Why is the primary mirror of a good telescope a paraboloid rather than a sphere?', choices: ['A paraboloid has no spherical aberration for light from a distant point on its axis', 'It is cheaper to make', 'It removes coma off axis', 'It is lighter'], a: 0, why: 'A sphere brings rays at different heights to different foci. A paraboloid brings all parallel rays from its axis to the same point. Off axis the paraboloid still has coma.' },
    { q: 'A Cassegrain has a primary of 800 mm focal length and a secondary that magnifies 4×. Its focal length in millimetres is…', answer: 3200, why: '$f = m f_1 = 4\\times 800 = 3200$ mm.' },
    { q: 'A Ritchey–Chrétien telescope has no spherical aberration and no coma.', a: true, why: 'Its two hyperboloid mirrors are shaped so that both aberrations cancel; astigmatism and field curvature remain.' },
    { q: 'A secondary mirror 25 % of the primary\'s diameter blocks what percentage of the aperture area?', answer: 6.25, why: '$(0.25)^2 = 0.0625$, that is 6.25 %.' },
    { q: 'Which statement about a reflecting telescope is true?', choices: ['The mirror has no chromatic aberration because reflection does not depend on the index of glass', 'A mirror has no aberrations of any kind', 'The focal length of a Newtonian is longer than its tube by the secondary\'s magnification', 'A reflector cannot have a larger aperture than a refractor'], a: 0, why: 'The law of reflection has no wavelength in it: all colours focus together. Mirrors still have spherical aberration (if spherical), coma and astigmatism.' }
  ],
  applications: [
    'Amateur astronomy: Newtonians (the cheapest large aperture), Schmidt–Cassegrains (compact, sealed) and Maksutovs (sharp at long focal lengths).',
    'Professional observatories: Ritchey–Chrétien telescopes from 1 m to 10 m, with segmented mirrors for the largest.',
    'Space telescopes: the Hubble Space Telescope\'s 2.4 m mirror is a Ritchey–Chrétien at f/24.',
    'Solar telescopes, with mirrors that tolerate the heat, and infrared telescopes, which need mirrors that transmit nothing and emit little.',
    'Laser beam expanders and collimators that cannot use glass lenses at ultraviolet or far-infrared wavelengths.'
  ],
  history: 'Isaac Newton built the first working reflecting telescope in 1668. Laurent Cassegrain proposed his two-mirror form in 1672. Bernhard Schmidt\'s corrector plate dates from 1930, and Maksutov\'s meniscus from the early 1940s. The Ritchey–Chrétien form was devised by George Ritchey and Henri Chrétien in the 1910s and became the standard for large telescopes in the second half of the century.',
  sources: [
    'D. J. Schroeder, *Astronomical Optics* — Newtonian, Cassegrain and Ritchey–Chrétien designs and their aberrations.',
    'H. Rutten and M. van Venrooij, *Telescope Optics* — the evaluation and design of reflecting and catadioptric telescopes.',
    'M. Bass (ed.), *Handbook of Optics* — the chapter on telescopes.'
  ],
  sim: 'oi-reflector'
},

/* ================================================================ binoculars */
{
  id: 'binoculars', parent: 'optical-instruments', title: 'Binoculars', level: 1,
  short: 'Two telescopes side by side, with prisms to turn the image upright and fold the light path. "8 × 42" means 8× magnification and a 42 mm objective, which gives an exit pupil of 42 / 8 = 5.25 mm. The exit pupil, the field of view and the eye relief decide how a binocular is used.',
  keywords: ['binoculars', '8x42', '10x50', 'Porro prism', 'roof prism', 'Schmidt-Pechan', 'exit pupil', 'twilight factor', 'field of view', '1000 m', 'eye relief', 'diopter', 'interpupillary distance', 'phase coating', 'objective diameter', 'prism binoculars'],
  prereq: ['refracting-telescopes', 'eyepieces', 'prism-types'],
  related: ['exit-pupil-and-eye-relief', 'critical-angle-and-total-internal-reflection', 'binocular-vision-and-stereopsis', 'the-pupil', 'image-stabilization', 'angular-magnification'],
  body: `
A pair of binoculars is two Keplerian telescopes side by side, one for each eye, with **prisms** inside to turn the inverted image upright and to fold the long light path into a short body. The engraving on the barrel carries the key numbers.

### Reading "8 × 42"
- **8** is the angular magnification.
- **42** is the diameter of each objective lens in millimetres.
- The **exit pupil** is $42/8 = 5.25$ mm, the diameter of the bright disc of light that leaves each eyepiece.
- The **twilight factor** $\\sqrt{M D} = \\sqrt{336} = 18.3$, a rough guide to how much detail the glass shows in poor light.
- The **field of view**, quoted as a width in metres at 1000 m or as an angle. A true field of 7.5° is 131 m at 1000 m; the *apparent* field is about $M\\times$ the true field: 60° here.

| Binocular | Exit pupil | Twilight factor | Typical use |
|---|---|---|---|
| 8 × 25 | 3.1 mm | 14.1 | compact, daylight |
| 8 × 32 | 4.0 mm | 16.0 | light all-round |
| 8 × 42 | 5.25 mm | 18.3 | general, birdwatching |
| 10 × 42 | 4.2 mm | 20.5 | birdwatching, more reach |
| 7 × 50 | 7.1 mm | 18.7 | marine, dusk |
| 10 × 50 | 5.0 mm | 22.4 | long viewing, astronomy |
| 12 × 50 | 4.2 mm | 24.5 | needs a rest or stabilization |

### Prisms
**Porro** prisms (1854): two right-angle prisms, each reflecting the light twice by total internal reflection; the light path zigzags and the objectives sit farther apart than the eyepieces. **Roof** prisms (Schmidt–Pechan and Abbe–König forms) keep the light in a straight line for a slim body, but the roof edge needs very precise manufacture, and the Schmidt–Pechan roof faces change the phase of the light, which a *phase-correction coating* repairs.

### Using them
- **Brightness.** For an extended scene the picture is never brighter than with the naked eye. If the exit pupil exceeds the eye's pupil (2 to 3 mm in daylight, up to 7 mm in the dark in youth, smaller with age) the extra light is wasted; if smaller, the picture is dimmer by $(d_p/d_e)^2$.
- **Shake.** Above about 10× a hand-held view trembles; heavier glasses steady better; image stabilization removes it.
- **Eye relief.** Spectacle wearers need 15 mm or more ([[exit-pupil-and-eye-relief]]).
- **Set-up.** Set the hinge to your eye separation, then the diopter ring on one eyepiece: focus with the other eye alone, then adjust the first.

> [!warn] Never look at the Sun through binoculars, not even briefly. Concentrated sunlight can destroy part of the retina in a fraction of a second without pain.

> [!key] "M × D" gives magnification and objective diameter in millimetres; exit pupil = D/M. Prisms erect the image, field is width at 1000 m, and a larger exit pupil than the eye's is wasted.
`,
  ideas: [
    'Binoculars are two prism telescopes: M × D means magnification and objective diameter in millimetres.',
    'The exit pupil is D/M; for brightness it should match the eye\'s pupil, which varies from 2 to 7 mm.',
    'Field of view is quoted as metres at 1000 m or in degrees; the apparent field is about M times the true field.',
    'Porro prisms zigzag the path; roof prisms keep it straight and need phase-correction coatings.',
    'An extended scene is never brighter in the binocular than to the naked eye.'
  ],
  pitfalls: [
    'A bigger number on the left is always better — Magnification costs field of view, steadiness and exit pupil: a 12× glass trembles in the hand and has a 4 mm exit pupil.',
    'Large objectives make a brighter image for any user — Only up to the eye\'s pupil: with a 3 mm pupil in daylight an 8×42 and an 8×25 look equally bright.',
    'The twilight factor measures brightness — It is a rule-of-thumb figure for detail in poor light; brightness is given by the exit pupil.',
    'The two eyepieces should be focused the same — The diopter ring compensates for the difference between your two eyes: each glass is focused separately.'
  ],
  terms: [
    { term: 'Binoculars', also: ['field glasses', 'prism binoculars'], def: 'A pair of telescopes mounted side by side for use with both eyes, with prisms that erect the image.' },
    { term: 'Objective diameter', def: 'The diameter of the front lens in millimetres: the second number in "8 × 42". It sets light grasp and resolution.' },
    { term: 'Twilight factor', also: ['twilight index'], def: 'The square root of magnification times objective diameter (in mm), a rough guide to detail visible at dusk.' },
    { term: 'Field of view of binoculars', also: ['true field', 'width at 1000 m'], def: 'The angle (or width at 1000 m, in metres) of the scene visible through the binoculars; the apparent field is about M times larger.' },
  ],
  formulas: [
    {
      name: 'Exit pupil',
      expr: 'dp = D/M', tex: 'd_p = \\frac{D}{M}',
      vars: {
        dp: { name: 'exit pupil diameter', q: 'length', unit: 'mm', tex: 'd_p' },
        D: { name: 'objective diameter', q: 'length', unit: 'mm', value: 42 },
        M: { name: 'magnification', value: 8, min: 1, max: 40 }
      },
      solveFor: 'dp',
      stories: { dp: 'A binocular is marked {M} × {D}. How wide is its exit pupil?', D: 'A 10× binocular must have a 5 mm exit pupil. What objective diameter does it need?' }
    },
    {
      name: 'Twilight factor',
      expr: 'Tw = sqrt(M*D)', tex: 'T = \\sqrt{M\\,D}',
      vars: {
        Tw: { name: 'twilight factor', tex: 'T' },
        M: { name: 'magnification', value: 8, min: 1, max: 40 },
        D: { name: 'objective diameter in millimetres', value: 42, min: 10, max: 120 }
      },
      solveFor: 'Tw',
      note: 'D here is the number of millimetres, not a length with a unit.'
    },
    {
      name: 'Field of view at a distance',
      expr: 'W = 2*L*tan(th/2)', tex: 'W = 2L\\tan\\frac{\\theta}{2}',
      vars: {
        W: { name: 'width of the scene', q: 'length', unit: 'm' },
        L: { name: 'distance', q: 'length', unit: 'm', value: 1000, fixed: true },
        th: { name: 'true field of view', q: 'angle', unit: '°', value: 7.5, min: 0.1, max: 30, tex: '\\theta' }
      },
      solveFor: 'W',
      stories: { W: 'A binocular has a true field of {th}. How wide is the scene at {L}?', th: 'A binocular shows a scene 105 m wide at 1000 m. What is its true field?' }
    },
    {
      name: 'Apparent field',
      expr: 'AF = M*TF', tex: 'A = M\\,T',
      vars: {
        AF: { name: 'apparent field of view', q: 'angle', unit: '°', tex: 'A' },
        M: { name: 'magnification', value: 8, min: 1, max: 40 },
        TF: { name: 'true field of view', q: 'angle', unit: '°', value: 7.5, tex: 'T' }
      },
      solveFor: 'AF',
      note: 'The usual small-angle rule; real eyepieces have distortion, so the exact relation is tan(apparent) ≈ M tan(true) only approximately.'
    }
  ],
  examples: [
    {
      title: 'Decoding 10 × 50',
      q: 'Binoculars are marked 10 × 50 with a field of 105 m at 1000 m. Find the exit pupil, twilight factor and true and apparent fields.',
      steps: [
        'Exit pupil: $50/10 = 5$ mm.',
        'Twilight factor: $\\sqrt{10\\times 50} = 22.4$.',
        { text: 'True field:', tex: '\\theta = 2\\arctan\\frac{105}{2000} = 6.0^\\circ' },
        'Apparent field: $10\\times 6.0^\\circ = 60^\\circ$.'
      ],
      a: '5 mm, 22.4, 6.0° true, about 60° apparent.'
    },
    {
      title: 'At dusk: 7 × 50 or 8 × 42?',
      q: 'At dusk the eye\'s pupil is 7 mm. Compare how bright an extended scene appears in a 7 × 50 and in an 8 × 42, ignoring light losses.',
      steps: [
        '7 × 50: exit pupil $50/7 = 7.1$ mm, at least as large as the eye\'s; the whole pupil is filled and the scene is as bright as the naked eye gives.',
        { text: '8 × 42: exit pupil 5.25 mm, smaller than the pupil:', tex: '\\left(\\frac{5.25}{7}\\right)^2 = 0.56' }
      ],
      a: 'The 8 × 42 shows an extended scene 56 % as bright, the 7 × 50 fully bright.'
    }
  ],
  quiz: [
    { q: 'Binoculars marked 10 × 50 have an exit pupil of…', answer: 5, why: '$d_p = D/M = 50/10 = 5$ mm.' },
    { q: 'Which has the larger exit pupil, an 8 × 32 or a 10 × 42?', choices: ['The 10 × 42 (4.2 mm against 4.0 mm)', 'The 8 × 32 (the lower power gives a bigger pupil)', 'They are equal', 'Neither has an exit pupil'], a: 0, why: '$d_p = D/M$: 32/8 = 4.0 mm and 42/10 = 4.2 mm. It is the ratio of objective to magnification that counts.' },
    { q: 'A binocular has a true field of 6.5°. How wide a scene does it show at 1000 m, in metres?', answer: 113.6, why: '$W = 2\\times 1000\\times\\tan(3.25°) = 113.6$ m.' },
    { q: 'An extended scene looks brighter through any binocular than to the naked eye.', a: false, why: 'The picture\'s luminance cannot exceed that seen directly; it is equal when the exit pupil is at least as large as the eye\'s pupil and lower otherwise, before light losses.' },
    { q: 'Why are the objectives of Porro-prism binoculars farther apart than the eyepieces?', choices: ['The prism pair shifts the optical axis sideways', 'To make the instrument heavier', 'To widen the exit pupil', 'To increase the magnification'], a: 0, why: 'Each Porro prism pair folds the light twice, offsetting the axis. Roof prisms keep it in line, which is why they give a slim straight body.' }
  ],
  applications: [
    'Birdwatching and wildlife: 8 × 42 and 10 × 42 with good close focus.',
    'Marine navigation: 7 × 50 with a wide exit pupil that tolerates the motion of a boat, often with a built-in compass.',
    'Sport, theatre and travel: compact 8 × 25 and 10 × 25.',
    'Stargazing: 10 × 50 to 15 × 70, usually on a tripod, for sweeping the Milky Way.',
    'Hunting, surveying and military use with a rangefinding reticle.'
  ],
  history: 'Ignazio Porro patented his prism system in 1854. Carl Zeiss introduced the first prism binoculars built with it in 1894. Roof-prism binoculars followed in the early 20th century; the phase-correction coatings that make them match Porro glasses in sharpness came much later.',
  sources: [
    'ISO 14132, *Optics and optical instruments — Vocabulary for telescopic systems* — terms for binoculars and monoculars.',
    'ISO 14490, *Optics and optical instruments — Test methods for telescopic systems* — how the field, exit pupil and eye relief are measured.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — prisms and the telescope.'
  ],
  sim: { id: 'oi-exit-pupil', params: { view: 'binocular' } }
},

/* ================================================================ exit pupil and eye relief */
{
  id: 'exit-pupil-and-eye-relief', parent: 'optical-instruments', title: 'Exit pupil and eye relief', level: 2,
  short: 'Behind every eyepiece floats a bright disc of light, the exit pupil: the image of the objective, formed by the eyepiece. All the light that gets through the instrument passes through it, so the eye\'s pupil belongs there. Its size is D / M and the distance from the last glass to it is the eye relief.',
  keywords: ['exit pupil', 'eye relief', 'eye point', 'Ramsden disc', 'eye ring', 'blackout', 'kidney beaning', 'eyecup', 'spectacles', 'rifle scope', 'aperture stop', 'pupil matching', 'D/M'],
  prereq: ['entrance-and-exit-pupils', 'eyepieces', 'refracting-telescopes'],
  related: ['binoculars', 'the-pupil', 'radiance-and-its-conservation', 'the-compound-microscope', 'field-stop-and-field-of-view', 'chief-and-marginal-rays', 'vignetting'],
  body: `
Every instrument you look into has a small bright disc of light just behind its eyepiece. It is the **exit pupil**: the image of the objective (the aperture stop) formed by the eyepiece. Every ray that passes through the instrument goes through it. Put the pupil of your eye there and you see the whole field; put it anywhere else and part of the picture is lost.

### Size
Magnification is $M = D/d_p$, the ratio of the objective's diameter to the exit pupil's, so

$$d_p = \\frac{D}{M}$$

8 × 42 binoculars: 5.25 mm; a 3–9 × 40 rifle scope: 13.3 mm at 3×, 4.4 mm at 9×. In a microscope the exit pupil is under a millimetre: $d_p = 2\\,\\mathrm{NA}\\times 250\\ \\mathrm{mm}/M$ is 0.81 mm for a 40×/0.65 objective with a 10× eyepiece.

### Position: the eye relief
The eyepiece, of focal length $f_e$, forms the image of the objective just beyond its own focal point, at a distance

$$f_e\\,(1 + 1/M)$$

from the eyepiece: 25.6 mm for a 1000 mm telescope with a 25 mm eyepiece, 22.5 mm for an 8× binocular with 20 mm eyepieces (thin-lens values; the real **eye relief**, from the last glass surface, is somewhat less). Bare-eyed use is easy at 8 to 10 mm. Spectacle wearers, whose glasses sit 12 mm or so in front of the eye plus the frame and eyecup, need 15 to 20 mm or more. A rifle scope has 75 to 100 mm so that recoil does not drive it into the eye.

### When the pupils do not match
- **Exit pupil larger than the eye's pupil**: some light is wasted; the picture is as bright as the eye can use, and alignment is forgiving (marine and night glasses).
- **Smaller**: the picture of an extended scene is dimmer by $(d_p/d_e)^2$, but the eye's position matters less in daylight when its pupil is small.
- **Eye off the exit pupil**: the beam from the edge of the field is shifted sideways, part of it misses the pupil, and the field edge darkens — the black crescent or *kidney-bean* shadow, or a *blackout* of the whole picture when the eye is far off. A small exit pupil, a long eye relief and a wide field make it worse.

### What cannot happen
The picture of an extended scene is never brighter than the scene to the naked eye ([[radiance-and-its-conservation]]). A point source such as a star can be brighter: the pupil collects a factor $(D/d_e)^2$ more light and the image is still a point.

> [!key] The exit pupil is the image of the objective: $d_p = D/M$, at a distance $f_e(1 + 1/M)$ behind the eyepiece. The eye pupil should sit in it; eye relief is how far from the glass that is, and glasses need 15 to 20 mm.
`,
  ideas: [
    'The exit pupil is the image of the objective formed by the eyepiece; all the light passes through it.',
    'Its diameter is d_p = D / M; for a microscope it is d_p = 2 NA × 250 mm / M, under a millimetre.',
    'Its position, f_e (1 + 1/M) behind the eyepiece, gives the eye relief; spectacles need 15 to 20 mm or more.',
    'A larger exit pupil than the eye pupil wastes light and forgives misalignment; a smaller one dims extended scenes by (d_p/d_e)².',
    'Away from the exit pupil, the edge of the field darkens (kidney-bean shadow) and finally blacks out.'
  ],
  pitfalls: [
    'The exit pupil is a hole in the eyepiece — It is an image, in the air behind the eyepiece, of the objective: a disc of light with no material at that place.',
    'A larger exit pupil gives a brighter image — Only until it matches the eye\'s pupil; beyond that the extra light is wasted. Extended scenes are never brighter than to the naked eye.',
    'Eye relief is the distance from the eye to the eyepiece in use — It is a design figure: the distance from the last glass surface to the exit pupil, measured with the eyecup extended or folded.',
    'The eye can be anywhere behind the eyepiece — Only at the exit pupil is the whole field visible; elsewhere the field edge is cut off.'
  ],
  terms: [
    { term: 'Exit pupil', also: ['Ramsden disc', 'eye ring', 'eye point'], def: 'The image of the objective (the aperture stop) formed by the eyepiece. All light that passes through the instrument goes through it; the eye\'s pupil should be placed there.' },
    { term: 'Eye relief', def: 'The distance from the last surface of the eyepiece to the exit pupil. 8 to 10 mm suits the bare eye, 15 to 20 mm and more suits spectacles.' },
    { term: 'Eyecup', def: 'A rubber or twist-up ring around the eyepiece that holds the eye at the exit pupil and blocks stray light.' },
    { term: 'Blackout', also: ['kidney beaning', 'rolling blackout'], def: 'A dark crescent or total loss of the picture when the eye is not at the exit pupil, so that the beam misses its pupil.' },
    { term: 'Pupil matching', def: 'Choosing an instrument whose exit pupil is about equal to the eye\'s pupil under the lighting in use.' }
  ],
  formulas: [
    {
      name: 'Exit pupil',
      expr: 'dp = D/M', tex: 'd_p = \\frac{D}{M}',
      vars: {
        dp: { name: 'exit pupil diameter', q: 'length', unit: 'mm', tex: 'd_p' },
        D: { name: 'objective diameter', q: 'length', unit: 'mm', value: 40 },
        M: { name: 'magnification', value: 9, min: 1, max: 100 }
      },
      solveFor: 'dp'
    },
    {
      name: 'Position of the exit pupil behind the eyepiece',
      expr: 'ER = fe*(1 + 1/M)', tex: '\\mathrm{ER} = f_e\\left(1 + \\frac{1}{M}\\right)',
      vars: {
        ER: { name: 'distance from the eyepiece to the exit pupil', q: 'length', unit: 'mm', tex: '\\mathrm{ER}' },
        fe: { name: 'focal length of the eyepiece', q: 'length', unit: 'mm', value: 20, tex: 'f_e' },
        M: { name: 'magnification', value: 8, min: 1, max: 100 }
      },
      solveFor: 'ER',
      note: 'The thin-lens value; the eye relief measured from the last glass is somewhat shorter.'
    },
    {
      name: 'Exit pupil of a microscope',
      expr: 'dp = 2*NA*Lnp/M', tex: 'd_p = \\frac{2\\,\\mathrm{NA}\\,L_{\\mathrm{np}}}{M}',
      vars: {
        dp: { name: 'exit pupil diameter', q: 'length', unit: 'mm', tex: 'd_p' },
        NA: { name: 'numerical aperture of the objective', value: 0.65, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' },
        Lnp: { name: 'conventional near point', q: 'length', unit: 'mm', value: 250, fixed: true, tex: 'L_{\\mathrm{np}}' },
        M: { name: 'total magnification', value: 400, min: 10, max: 2000 }
      },
      solveFor: 'dp'
    },
    {
      name: 'Brightness of an extended scene relative to the eye',
      expr: 'B = (dp/de)^2', tex: 'B = \\left(\\frac{d_p}{d_e}\\right)^2',
      vars: {
        B: { name: 'brightness relative to the naked eye (before light losses)' },
        dp: { name: 'exit pupil diameter', q: 'length', unit: 'mm', value: 4, tex: 'd_p' },
        de: { name: 'diameter of the eye\'s pupil', q: 'length', unit: 'mm', value: 5, tex: 'd_e' }
      },
      solveFor: 'B',
      note: 'Valid when the exit pupil is smaller than the eye pupil; when it is larger the scene is as bright as the naked eye shows it (B = 1).'
    }
  ],
  examples: [
    {
      title: 'A 3–9 × 40 rifle scope at dusk',
      q: 'At dusk the eye\'s pupil is 5 mm. What is the scope\'s exit pupil at 3× and at 9×, and how bright is an extended scene at 9×?',
      steps: [
        { text: 'Exit pupils:', tex: '40/3 = 13.3\\ \\mathrm{mm} \\qquad 40/9 = 4.4\\ \\mathrm{mm}' },
        'At 3× the exit pupil exceeds the eye\'s: the picture is as bright as possible and the eye need not be exactly placed.',
        { text: 'At 9× the exit pupil is 4.44 mm:', tex: '\\left(\\frac{4.44}{5}\\right)^2 = 0.79' }
      ],
      a: '13.3 mm and 4.4 mm; at 9× the scene is about 79 % as bright as the eye could make it.'
    },
    {
      title: 'Where must the eye be?',
      q: 'A telescope of 1000 mm focal length has a 25 mm eyepiece. How far behind the eyepiece is the exit pupil, and can someone wearing spectacles use it?',
      steps: [
        'The magnification is $1000/25 = 40$.',
        { text: 'Position:', tex: '25\\ \\mathrm{mm}\\times\\left(1 + \\tfrac{1}{40}\\right) = 25.6\\ \\mathrm{mm}' },
        'The thin-lens value of 25.6 mm leaves room for glasses (15 to 20 mm needed); a real eyepiece gives somewhat less.'
      ],
      a: '25.6 mm behind the eyepiece (thin-lens value): enough for most spectacle wearers.'
    }
  ],
  quiz: [
    { q: 'The exit pupil of an instrument is…', choices: ['the image of the objective formed by the eyepiece', 'the hole in the eyecup', 'the field stop seen from the eye', 'the eye\'s pupil seen through the instrument'], a: 0, why: 'The objective is the aperture stop of a telescope; its image through the eyepiece is the exit pupil, the disc through which all the light leaves.' },
    { q: 'What is the exit pupil of a 15 × 70 binocular, in millimetres?', answer: 4.667, why: '$d_p = 70/15 = 4.67$ mm.' },
    { q: 'A larger exit pupil than the eye\'s pupil makes the view of an extended scene brighter.', a: false, why: 'The eye can only use as much light as enters its pupil. A larger exit pupil wastes the rest and merely makes the position of the eye less critical.' },
    { q: 'The exit pupil is 2 mm and the eye\'s pupil 4 mm. By what factor is an extended scene dimmer than it could be?', answer: 0.25, why: '$(d_p/d_e)^2 = (2/4)^2 = 0.25$.' },
    { q: 'Someone who wears spectacles at the telescope should look for…', choices: ['a long eye relief, 15 to 20 mm or more', 'a short eye relief', 'a very small exit pupil', 'a Galilean eyepiece'], a: 0, why: 'The glasses keep the eye 12 mm or more behind the eyepiece. If the exit pupil lies closer to the eyepiece than that, the field is cut off.' }
  ],
  applications: [
    'Binoculars and spotting scopes: choosing between a 7 mm exit pupil for dusk and 4 mm for compact daylight use.',
    'Rifle scopes: eye relief of 75 to 100 mm for recoil safety, and a forgiving exit pupil at low power.',
    'Microscopes: the eye must be placed at the (tiny) exit pupil; eyecups and high eye-point eyepieces help.',
    'Head-up displays and viewfinders: the "eye box" is the same idea, the region in which the eye sees the whole image.',
    'Virtual-reality headsets: the eyebox and eye relief decide whether glasses can be worn.'
  ],
  history: 'The bright disc behind an eyepiece is sometimes called the Ramsden disc or Ramsden circle, after the 18th-century instrument maker Jesse Ramsden, whose eyepiece bears his name. Makers of telescopes and binoculars have long chosen the exit pupil to suit the pupil of the eye in the light the instrument is meant for.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the chapter on stops, apertures and pupils (the entrance and exit pupils, eye relief).',
    'R. Kingslake, *Optical System Design* — telescope and eyepiece pupils.',
    'ISO 14490, *Optics and optical instruments — Test methods for telescopic systems* — measurement of exit pupil and eye relief.'
  ],
  sim: 'oi-exit-pupil'
},

/* ================================================================ periscopes and endoscopes */
{
  id: 'periscopes-and-endoscopes', parent: 'optical-instruments', title: 'Periscopes, borescopes and endoscopes', level: 2,
  short: 'These instruments carry a view round a corner or along a narrow tube. A periscope uses two parallel mirrors; a rigid borescope or endoscope hands the image on through a train of relay lenses or glass rods; a flexible fibrescope uses a coherent bundle of fibres; a video endoscope puts a tiny sensor at the tip.',
  keywords: ['periscope', 'borescope', 'endoscope', 'laparoscope', 'relay lens', 'rod lens', 'Hopkins', 'fibrescope', 'coherent bundle', 'chip-on-tip', 'video endoscope', 'direction of view', 'image guide', 'submarine periscope', 'inspection'],
  prereq: ['plane-mirror-images', 'combining-thin-lenses', 'fibre-bundles-and-image-guides'],
  related: ['fibre-optic-light-guides', 'prism-types', 'oct-in-eye-care', 'cmos-sensors', 'lens-ray-diagrams', 'distortion', 'the-eye-examination'],
  body: `
Some views are blocked by a wall, a corner or a hole too narrow to put the eye into. Four generations of instruments carry the picture out.

### The periscope
Two plane mirrors (or prisms) parallel to one another, each at 45°, displace the line of sight sideways by their separation $L$. Two reflections leave the image upright, unreversed and the same size: a simple periscope does not magnify. Its field of view is limited by the width of the tube against its length, so long periscopes need lenses. A submarine periscope is a long telescope with mirrors or prisms at both ends, with a low-power wide view and a high-power narrow one.

### Relay lenses: borescopes and rigid endoscopes
An objective at the tip forms an inverted real image. A **relay** (a pair of lenses, or in modern designs a long glass rod) reforms that image 1:1 a few centimetres farther down the tube, and each relay inverts it again. A chain of relays carries the image along a tube of 4 to 10 mm and perhaps 30 cm to a metre long, and an eyepiece or camera at the end examines the last image. Field lenses at the image planes steer the cone of light back to the axis so that the tube wall does not clip it. An odd number of relays leaves the view upright, since the objective's image was inverted.

Harold Hopkins's rod-lens design replaced the air gaps between thin lenses with long glass rods separated by short air gaps, so that the glass itself became the lens. It passes far more light, and nearly all rigid endoscopes are built so. The tip views at 0°, 30°, 45° or 70° to the axis; the wide-angle objective covers 60° to 120° with deliberate barrel distortion.

### The fibrescope
A **coherent bundle** of thousands of thin glass fibres, each carrying one picture element, keeps its neighbours in the same order at both ends, so it transmits an image along a flexible route. The number of fibres is the number of pixels: a 1 mm bundle of 8 µm fibres holds about 14 000, a picture of roughly 120 × 120 elements with a honeycomb pattern and, over time, black dots where a fibre has broken. Bundles of random order, with no image, carry only light ([[fibre-bundles-and-image-guides]]).

### Chip-on-the-tip
Video endoscopes put a small image sensor and a lens at the distal tip and send the signal electrically. Each pixel is a few micrometres and the picture has no fibre pattern, so the image is sharper and brighter than any bundle gives; sensors about a millimetre across exist.

| Instrument | Image carried by | Flexible | Typical tube |
|---|---|---|---|
| Periscope | two mirrors or prisms (plus telescope) | no | 50 mm and up |
| Borescope, rigid endoscope | relay lenses or rod lenses | no | 2 to 10 mm |
| Fibrescope | coherent fibre bundle | yes | 1 to 10 mm |
| Video endoscope | sensor at the tip | yes | 1.5 to 15 mm |

A ring of fibres around the objective carries light in from a lamp ([[fibre-optic-light-guides]]).

> [!key] A periscope shifts the sight line with two parallel mirrors and does not magnify. Longer, narrower tubes need relays that pass the image on and invert it each time (odd count: upright), flexible ones need a coherent fibre bundle whose fibre count sets the pixels, and modern video endoscopes put the sensor itself at the tip.
`,
  ideas: [
    'A periscope is two parallel 45° mirrors: it shifts the line of sight and leaves the image upright and unmagnified.',
    'A relay lens passes a real image on 1:1 and inverts it; an odd number of relays leaves the view upright.',
    'Rod-lens endoscopes use glass rods as the lenses with short air gaps, and carry far more light than thin lenses in air.',
    'In a coherent fibre bundle the number of fibres is the number of pixels; broken fibres show as black dots.',
    'A chip-on-tip endoscope puts the sensor at the distal end and carries the picture electrically.'
  ],
  pitfalls: [
    'A periscope magnifies the view — Plain mirrors leave the size unchanged; any magnification is added by lenses in the tube.',
    'Any bundle of optical fibres can carry a picture — Only a coherent bundle, whose fibres keep the same order at both ends, can; a random bundle carries only light.',
    'The image in a fibre bundle is as sharp as the lens at its end — The resolution is limited by the fibre spacing: the number of fibres is the number of picture elements.',
    'A wide-angle endoscope with curved straight lines is faulty — The strong barrel distortion is a deliberate trade for a wide field in a very small objective; it is usually corrected in software or accepted.'
  ],
  terms: [
    { term: 'Borescope', also: ['boroscope', 'industrial endoscope'], def: 'A rigid or flexible tube with an objective at one end for inspecting the inside of engines, pipes and castings.' },
    { term: 'Endoscope', also: ['laparoscope', 'arthroscope', 'cystoscope'], def: 'A narrow instrument for viewing inside the body or a machine; named for the cavity it examines.' },
    { term: 'Relay lens train', also: ['Hopkins rod-lens system'], def: 'A lens system that re-forms a real image one-to-one farther along; a chain of them carries an image down a long tube. A rod lens uses a glass cylinder as the lens.' },
    { term: 'Coherent fibre bundle', also: ['image guide', 'fibrescope bundle'], def: 'A bundle of optical fibres kept in the same order at both ends, so that each fibre carries one picture element of an image.' },
    { term: 'Chip-on-tip', also: ['video endoscope', 'distal-tip sensor'], def: 'An endoscope with a miniature image sensor and lens at its tip and an electrical connection to the viewer.' },
    { term: 'Direction of view', def: 'The angle (0°, 30°, 45°, 70°) between the axis of an endoscope and the centre of its field of view.' }
  ],
  formulas: [
    {
      name: 'Number of fibres in a bundle',
      expr: 'N = pi*D^2/(4*0.866*p^2)', tex: 'N = \\frac{\\pi D^2}{4\\times 0.866\\,p^2}',
      vars: {
        N: { name: 'number of fibres (picture elements)' },
        D: { name: 'diameter of the bundle', q: 'length', unit: 'mm', value: 1 },
        p: { name: 'centre-to-centre spacing of the fibres', q: 'length', unit: 'µm', value: 8 }
      },
      solveFor: 'N',
      note: 'Fibres packed in a hexagonal array; each occupies an area 0.866 p².',
      stories: { N: 'A coherent bundle {D} across has fibres {p} apart. How many picture elements does it carry?' }
    },
    {
      name: 'Smallest feature a bundle can show',
      expr: 'x = 2*p/mo', tex: 'x = \\frac{2\\,p}{m_o}',
      vars: {
        x: { name: 'smallest feature resolved on the object', q: 'length', unit: 'mm' },
        p: { name: 'centre-to-centre spacing of the fibres', q: 'length', unit: 'µm', value: 8 },
        mo: { name: 'magnification of the objective at the bundle face (image ÷ object)', value: 0.05, min: 0.001, max: 5, tex: 'm_o' }
      },
      solveFor: 'x',
      note: 'Two fibre spacings per smallest period (the sampling limit). A mixture of fibre spacing and objective magnification, not of magnification alone.',
      stories: { x: 'A bundle with {p} fibre spacing sits behind an objective that forms the image at a magnification of {mo}. What is the smallest feature on the object it can show?' }
    },
    {
      name: 'Width of the scene at the tip',
      expr: 'W = 2*d*tan(th/2)', tex: 'W = 2d\\tan\\frac{\\theta}{2}',
      vars: {
        W: { name: 'width of the scene seen at that distance', q: 'length', unit: 'mm' },
        d: { name: 'distance from the tip to the object', q: 'length', unit: 'mm', value: 20 },
        th: { name: 'field of view of the endoscope', q: 'angle', unit: '°', value: 70, min: 1, max: 170, tex: '\\theta' }
      },
      solveFor: 'W',
      note: 'Ignores the strong barrel distortion of wide-angle tips, which squeezes the edge of the field.'
    }
  ],
  examples: [
    {
      title: 'How sharp is a fibrescope?',
      q: 'A flexible fibrescope has a coherent bundle 1.0 mm across with 8 µm fibre spacing. How many picture elements does it have, and how does that compare with a 1-megapixel sensor?',
      steps: [
        { text: 'Hexagonal packing:', tex: 'N = \\frac{\\pi\\,(1000\\ \\mu\\mathrm{m})^2}{4\\times 0.866\\times (8\\ \\mu\\mathrm{m})^2} \\approx 14\\,000' },
        'About 14 000 elements, roughly a 120 × 120 picture: 1.4 % of a megapixel, with a honeycomb pattern.'
      ],
      a: 'About 14 000 picture elements; a chip-on-tip sensor of 1 megapixel carries about seventy times more.'
    },
    {
      title: 'Which way up?',
      q: 'A rigid borescope has an objective, followed by three relay stages. Is the view upright?',
      steps: [
        'The objective inverts once; each relay inverts again: $1 + 3 = 4$ inversions.',
        'An even number of inversions leaves the image upright; the eyepiece, working as a magnifier, does not invert.'
      ],
      a: 'Upright. An odd number of relays (1, 3, 5) is the common choice for this reason.'
    }
  ],
  quiz: [
    { q: 'A simple periscope of two plane mirrors parallel at 45°…', choices: ['shifts the line of sight and leaves the image upright and unmagnified', 'inverts the image and magnifies it', 'reverses left and right', 'works only with a prism'], a: 0, why: 'Two reflections cancel the mirror reversal, the image stays upright and the same size, and the sight line is moved sideways by the mirror separation.' },
    { q: 'How many fibres (picture elements) does a coherent bundle 2 mm across have with a fibre spacing of 10 µm?', answer: 36300, why: '$N = \\pi D^2/(4\\times 0.866\\,p^2) = \\pi (2000)^2/(3.464\\times 100) = 36\\,300$.' },
    { q: 'A bundle of randomly arranged optical fibres can carry a picture.', a: false, why: 'Each fibre carries the brightness at one point, but without a fixed correspondence between the two ends the picture is scrambled; only a coherent bundle keeps the order.' },
    { q: 'A borescope has an objective and two relay stages. Is the view upright?', choices: ['No, it is inverted (three inversions)', 'Yes, upright (two inversions)', 'It depends on the eyepiece', 'It is reversed but not inverted'], a: 0, why: 'The objective inverts once, each relay inverts again: 1 + 2 = 3 inversions, an odd number, so the picture is inverted.' },
    { q: 'What does a chip-on-tip endoscope have that a fibrescope lacks?', choices: ['A sensor at the tip whose pixels are only a few micrometres, so no fibre pattern', 'A longer optical path', 'A larger bundle of fibres', 'No need for light'], a: 0, why: 'The sensor itself replaces the bundle; the picture is limited by the sensor\'s pixels rather than by the fibre count, and the signal travels as electricity.' }
  ],
  applications: [
    'Minimally invasive surgery and diagnosis: laparoscopes, arthroscopes and cystoscopes, rigid rod-lens types, and flexible video endoscopes for the digestive tract; used by trained clinicians.',
    'Industrial inspection: borescopes in jet engines, pipework, welds and casting cavities.',
    'Submarine and armoured-vehicle periscopes; simple periscopes for crowds and trench-like viewing.',
    'Forensic and building inspection: looking inside walls, vents and machinery without taking them apart.',
    'Dental and ENT cameras, built on the same objective and light-guide principles.'
  ],
  history: 'Narinder Kapany and Harold Hopkins reported in 1954 that a bundle of aligned glass fibres carries an image; Basil Hirschowitz and colleagues made the first flexible fibre gastroscope in the late 1950s. Hopkins\'s rod-lens system, developed in the 1950s and 1960s, made the bright, thin rigid endoscope possible. Video endoscopes with a sensor at the tip followed in the 1980s.',
  sources: [
    'H. H. Hopkins and N. S. Kapany, "A flexible fibrescope, using static scanning", *Nature* 173 (1954) — the first coherent bundle image.',
    'M. Bass (ed.), *Handbook of Optics* — the chapters on fibre optics and on medical optical instruments.',
    'ISO 8600, *Endoscopes — Medical endoscopes and endotherapy devices* — terms and requirements for medical endoscopes.'
  ],
  sim: 'oi-relay'
},

/* ================================================================ projectors */
{
  id: 'projectors', parent: 'optical-instruments', title: 'Projectors', level: 2,
  short: 'A projector is a camera run backwards: a small, bright, flat object just outside the focal length of a lens throws a large real image on a distant screen. A condenser puts the lamp\'s light through the lens, the throw ratio ties lens, screen width and distance together, and the lumens are spread over the screen area.',
  keywords: ['projector', 'slide projector', 'data projector', 'throw ratio', 'throw distance', 'condenser', 'projection lens', 'lumens', 'ANSI lumens', 'keystone', 'lens shift', 'screen', 'panel', 'magic lantern', 'cinema projector'],
  prereq: ['the-thin-lens-equation', 'real-and-virtual-images', 'lateral-and-longitudinal-magnification'],
  related: ['projector-illumination', 'the-data-projector', 'condensers-and-kohler-illumination', 'etendue', 'illuminance-levels-in-practice', 'lumens-candelas-lux-and-nits', 'fresnel-lenses'],
  body: `
A projector is a camera run backwards. A small, bright, flat object (a slide, a liquid-crystal panel, an array of micromirrors) sits just outside the focal length of a lens; the lens throws a large real image on a screen far away. With the thin-lens equation (real is positive, $1/s_o + 1/s_i = 1/f$) and the magnification $m = s_i/s_o$:

$$s_o = f\\left(1 + \\frac{1}{m}\\right) \\qquad s_i = f\\,(1 + m)$$

A 36 mm slide to fill a screen 1.8 m wide needs $m = 50$. With a 100 mm lens the slide sits 102 mm from the lens and the screen 5.1 m away. **Focusing** is moving the lens a fraction of a millimetre: from a 3 m throw to a 6 m throw the same lens moves only 1.75 mm.

### Lighting the panel
The picture can be no brighter than the light that goes through the lens. A **condenser** collects the light from a small lamp and images the lamp into the entrance pupil of the projection lens, so that every point of the panel sends its light through the lens aperture. Without it, the light misses the lens, and the corners go dark ([[projector-illumination]], [[etendue]]).

### Throw ratio
The **throw ratio** is the throw distance divided by the image width. For a large magnification it is nearly $f/w$, the lens focal length over the panel width: a 25 mm lens on a panel 14.1 mm wide gives 1.77. Ordinary lenses lie between 1.5 and 2; short-throw lenses 0.4 to 1.0; ultra-short-throw systems, below 0.4, add a curved mirror. A zoom lens spans a range (1.2 to 1.8, say) at one distance. A projector set above or below the screen centre tilts its image into a trapezoid (**keystone** distortion); **lens shift**, moving the lens sideways against the panel, puts the image where it is wanted without tilting.

### How bright
The lumens ($\\Phi$) fall on the screen area $A$: $E = \\Phi/A$. A 3000 lm projector on a 2.0 m wide 16:9 screen (2.25 m²) gives 1333 lx; a matt white screen of unit gain turns that into $E/\\pi = 424$ cd/m². On a 3 m wide screen the same projector gives 593 lx: widening the picture by 1.5 times cuts the illuminance by $1.5^2$. **ANSI lumens** are averaged over nine points on the screen, the common honest rating; manufacturers' other figures can be higher. Digital cinema is set to about 48 cd/m², far below what a data projector can reach, because it is watched in the dark.

> [!warn] The lamp or laser of a projector is bright enough to harm the eye at the lens: never look into the beam. Lamp housings of discharge types hold high pressure and mercury; follow the maker's instructions for replacement.

> [!key] A projector places a bright object just outside $f$: $s_i = f(1 + m)$. The condenser images the lamp into the lens, the throw ratio is about $f/w$, and the lumens divided by the screen area give the lux.
`,
  ideas: [
    'The object is just outside the focal length: s_o = f (1 + 1/m) and s_i = f (1 + m).',
    'Focusing moves the lens by a fraction of a millimetre because s_o is close to f.',
    'A condenser images the lamp into the projection lens so that the whole panel is lit evenly and no light misses the lens.',
    'Throw ratio = throw distance / image width, about f / w for the panel width w.',
    'Screen illuminance is lumens divided by screen area; double the width, quarter the lux.'
  ],
  pitfalls: [
    'A bigger lens makes a bigger picture — The image size depends on the magnification, the focal length and the throw distance; a bigger lens only passes more light.',
    'Lumens measure how bright the picture looks — They measure the light output; the lux on the screen is the lumens divided by the screen area, and the picture looks dimmer on a bigger screen.',
    'A projector tilted up simply moves the picture up — The image becomes a trapezoid (keystone distortion); lens shift keeps the geometry right.',
    'The condenser is a second lens to make the picture sharper — It serves only the illumination: it images the lamp into the projection lens and has nothing to do with the sharpness of the picture.'
  ],
  terms: [
    { term: 'Projector', def: 'An instrument that forms a magnified real image of an illuminated flat object (slide, panel) on a distant screen.' },
    { term: 'Projection lens', def: 'The lens that images the panel on the screen; its focal length, with the panel width, sets the throw ratio.' },
    { term: 'Keystone distortion', also: ['keystoning'], def: 'The trapezoid shape of an image projected onto a screen that is not square to the beam.' },
  ],
  formulas: [
    {
      name: 'Object distance',
      expr: 'so = f*(1 + 1/m)', tex: 's_o = f\\left(1 + \\frac{1}{m}\\right)',
      vars: {
        so: { name: 'distance from panel to lens', q: 'length', unit: 'mm', tex: 's_o' },
        f: { name: 'focal length of the projection lens', q: 'length', unit: 'mm', value: 100 },
        m: { name: 'magnification (picture width ÷ panel width)', value: 50, min: 1, max: 1000 }
      },
      solveFor: 'so'
    },
    {
      name: 'Image distance',
      expr: 'si = f*(1 + m)', tex: 's_i = f\\,(1 + m)',
      vars: {
        si: { name: 'distance from lens to screen', q: 'length', unit: 'm', tex: 's_i' },
        f: { name: 'focal length of the projection lens', q: 'length', unit: 'mm', value: 100 },
        m: { name: 'magnification', value: 50, min: 1, max: 1000 }
      },
      solveFor: 'si',
      stories: { si: 'A {f} lens throws a picture {m} times the width of its panel. How far is the screen?', m: 'A {f} lens is focused on a screen {si} away. What magnification does it give?' }
    },
    {
      name: 'Throw ratio',
      expr: 'TR = L/W', tex: '\\mathrm{TR} = \\frac{L}{W}',
      vars: {
        TR: { name: 'throw ratio', tex: '\\mathrm{TR}' },
        L: { name: 'throw distance', q: 'length', unit: 'm', value: 3.6 },
        W: { name: 'picture width', q: 'length', unit: 'm', value: 2 }
      },
      solveFor: 'TR',
      note: 'For a large magnification, TR is about f ÷ panel width.'
    },
    {
      name: 'Screen illuminance',
      expr: 'E = Phi/A', tex: 'E = \\frac{\\Phi}{A}',
      vars: {
        E: { name: 'illuminance on the screen', q: 'illuminance', unit: 'lx' },
        Phi: { name: 'luminous flux of the projector', q: 'luminousflux', unit: 'lm', value: 3000, tex: '\\Phi' },
        A: { name: 'area of the picture', q: 'area', unit: 'm²', value: 2.25 }
      },
      solveFor: 'E'
    },
    {
      name: 'Luminance of a matt screen',
      expr: 'L = g*E/pi', tex: 'L = \\frac{g\\,E}{\\pi}',
      vars: {
        L: { name: 'luminance of the screen', q: 'luminance', unit: 'cd/m²' },
        g: { name: 'screen gain (1 for matt white)', value: 1, min: 0.1, max: 3 },
        E: { name: 'illuminance on the screen', q: 'illuminance', unit: 'lx', value: 1333 }
      },
      solveFor: 'L',
      note: 'An ideal diffuse screen of reflectance 1; real white screens are a little lower.'
    }
  ],
  examples: [
    {
      title: 'A 36 mm slide on a 1.8 m screen',
      q: 'A slide 36 mm wide must fill a screen 1.8 m wide, with a 100 mm lens. Where does the lens go, and how far is the screen?',
      steps: [
        'Magnification $m = 1800/36 = 50$.',
        { text: 'Slide to lens:', tex: 's_o = 100\\times(1 + \\tfrac{1}{50}) = 102\\ \\mathrm{mm}' },
        { text: 'Lens to screen:', tex: 's_i = 100\\times 51 = 5100\\ \\mathrm{mm} = 5.1\\ \\mathrm{m}' },
        'Moving the screen from 3 m to 6 m would take the lens from 103.4 mm to 101.7 mm: 1.75 mm of travel.'
      ],
      a: 'Lens 102 mm from the slide, screen 5.1 m away; focusing from 3 m to 6 m takes only 1.75 mm.'
    },
    {
      title: 'How bright is a data projector?',
      q: 'A 3000 lm projector fills a 16:9 screen 2.0 m wide. What are the illuminance and the screen luminance? What happens at 3 m width?',
      steps: [
        'Area: $2.0\\times 1.125 = 2.25\\ \\mathrm{m^2}$, so $E = 3000/2.25 = 1333$ lx.',
        { text: 'Matt white screen (gain 1):', tex: 'L = \\frac{1333}{\\pi} = 424\\ \\mathrm{cd/m^2}' },
        'At 3 m wide, the area is 5.06 m² and $E = 593$ lx.'
      ],
      a: '1333 lx and 424 cd/m² at 2 m width; 593 lx at 3 m.'
    }
  ],
  quiz: [
    { q: 'In a slide projector the slide stands…', choices: ['just outside the focal length of the lens', 'at the focal point exactly', 'inside the focal length', 'at twice the focal length'], a: 0, why: 'To get a large real image far away, the object must be just beyond $f$: $s_o = f(1 + 1/m)$, a little more than $f$ for large $m$. At $f$ exactly the image is at infinity; inside $f$ it is virtual.' },
    { q: 'A 50 mm lens gives a magnification of 40. How far is the slide from the lens, in millimetres?', answer: 51.25, why: '$s_o = f(1 + 1/m) = 50\\times 1.025 = 51.25$ mm.' },
    { q: 'A projector 3.6 m from the screen gives a picture 2.0 m wide. What is the throw ratio?', answer: 1.8, why: 'TR = distance ÷ width = 3.6/2.0 = 1.8.' },
    { q: 'Doubling the width of the picture from the same projector halves the screen illuminance.', a: false, why: 'The area grows with the square of the width, so the illuminance falls to a quarter.' },
    { q: 'What does the condenser of a projector do?', choices: ['Images the lamp into the pupil of the projection lens so that the panel is lit evenly', 'Sharpens the picture on the screen', 'Cools the lamp', 'Enlarges the panel'], a: 0, why: 'Without the condenser the light from the lamp would miss the lens or fall unevenly on the panel; with it each panel point sends its light through the lens aperture.' }
  ],
  applications: [
    'Data and home-cinema projectors: LCD, micromirror (DLP) and LCoS panels with zoom lenses and lens shift.',
    'Cinema projection: film with xenon lamps, and digital with xenon or laser sources, onto screens of tens of metres.',
    'Slide projectors and overhead projectors, now rare; enlargers in photography, which use the same optics.',
    'Short-throw projectors for classrooms and interactive boards.',
    'Headlights and stage lights that project a patterned gate, such as gobo projectors.'
  ],
  history: 'The magic lantern, a candle or oil lamp and a lens that projected painted glass slides, was in use by the 1650s and is often credited to Christiaan Huygens. The Lumière brothers\' cinematograph of 1895 projected film. Larry Hornbeck at Texas Instruments invented the digital micromirror device in 1987; projectors using it reached the market in the late 1990s.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — projection and illumination systems.',
    'M. Bass (ed.), *Handbook of Optics* — the chapters on optical system design and illumination.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the thin-lens equation and magnification used in projection.'
  ],
  sim: 'oi-projector'
},

/* ================================================================ spectrometers and monochromators */
{
  id: 'spectrometers-and-monochromators', parent: 'optical-instruments', title: 'Spectrometers and monochromators', level: 2,
  short: 'A spectrometer sorts light by wavelength. In the Czerny–Turner layout an entrance slit, a collimating mirror, a diffraction grating and a focusing mirror put a separate image of the slit at each wavelength; an exit slit passes one band (a monochromator) or an array records all of them (a spectrograph). The slit width sets the resolution.',
  keywords: ['spectrometer', 'monochromator', 'spectrograph', 'Czerny-Turner', 'grating', 'entrance slit', 'exit slit', 'bandpass', 'resolution', 'reciprocal linear dispersion', 'order sorting', 'collimating mirror', 'detector array', 'Littrow', 'sodium doublet'],
  prereq: ['the-grating-equation', 'grating-spectrometers-and-resolving-power', 'parabolic-and-elliptical-mirrors'],
  related: ['grating-types-and-blaze', 'spectrophotometers', 'spectroscopy-in-industry', 'prism-deviation', 'cmos-sensors', 'interference-filters', 'chemistry:atomic-spectra'],
  body: `
A **spectrometer** spreads light into its wavelengths and measures how much there is at each. The classic arrangement is the **Czerny–Turner**:

1. a narrow **entrance slit**, which is the object;
2. a concave **collimating mirror** that makes the light from the slit parallel;
3. a **diffraction grating**, which sends each wavelength off at its own angle;
4. a concave **focusing mirror** that images the slit onto the focal plane, one slit image per wavelength;
5. an **exit slit** with one detector (a **monochromator**: turning the grating scans the wavelength past the slit) or an **array detector** that records all wavelengths at once (a **spectrograph**).

Mirrors, not lenses, because they have no colour error and work from the ultraviolet to the infrared. Used off axis, the coma of the two mirrors can partly cancel.

### The grating
The grating equation for light incident at $\\alpha$ and diffracted at $\\beta$, both on the same side of the normal, is $\\sin\\alpha + \\sin\\beta = m\\lambda/d$ ([[the-grating-equation]]). For a 1200 lines/mm grating at 500 nm in first order the sum is 0.6: for example $\\alpha = 29.9°$ and $\\beta = 5.9°$ in an instrument whose beams make 24° with each other. The focal length $f$ of the second mirror turns angle into position on the detector, so the **reciprocal linear dispersion** is

$$\\frac{d\\lambda}{dx} = \\frac{\\cos\\beta}{m\\,N_d\\,f}$$

with $N_d$ the lines per unit length: 2.76 nm per mm for 1200 lines/mm and $f = 300$ mm, 11 nm/mm for 300 lines/mm and 1.05 to 1.25 nm/mm for 2400.

### Slit and resolution
The slit has a finite width $w$, so each monochromatic line is an image of it; the **bandpass** is

$$\\Delta\\lambda = w\\,\\frac{d\\lambda}{dx}$$

A 100 µm slit with 2.76 nm/mm gives 0.28 nm. Two lines closer than about the bandpass blur together. The sodium D doublet (588.995 and 589.592 nm, 0.60 nm apart) needs a bandpass of well under 0.6 nm. The grating's own limit, $\\lambda/\\Delta\\lambda = mN$, is 60 000 for 60 000 lines (50 mm of 1200 lines/mm), 0.009 nm at 550 nm; in practice the slit decides. Narrowing the slit raises resolution and cuts the light in proportion, until diffraction and aberrations stop the gain.

### Practical points
- **Order sorting**: the second order of 300 nm lands where the first order of 600 nm does; long-pass filters remove it.
- **Stray light** limits the dark end of the dynamic range: double monochromators put two in series.
- **Calibration** uses line lamps (mercury, neon, argon) of known wavelengths.
- **Blaze** shapes the grooves so that most light goes into the order used ([[grating-types-and-blaze]]).
- **Detectors**: photomultipliers behind an exit slit, silicon arrays for 200 to 1100 nm, InGaAs arrays for the near infrared.

> [!key] A Czerny–Turner spectrometer is slit, mirror, grating, mirror, detector. The grating and the focal length give the dispersion (nm per mm); the slit width times that is the bandpass, which sets how close two lines can be and still be separated.
`,
  ideas: [
    'Czerny–Turner: entrance slit, collimating mirror, grating, focusing mirror, exit slit or array detector.',
    'A monochromator passes one wavelength band and scans by turning the grating; a spectrograph records all wavelengths at once on an array.',
    'The reciprocal linear dispersion is cos β / (m N_d f): longer focal length and more lines per millimetre give finer dispersion.',
    'Bandpass = slit width × reciprocal linear dispersion; the slit usually limits resolution, not the grating.',
    'A narrower slit resolves better and passes less light.'
  ],
  pitfalls: [
    'A bigger grating always gives better resolution — The grating sets a ceiling (mN); with a wide slit the resolution is slit-limited. Past the grating\'s limit nothing helps.',
    'The slit only controls how much light enters — It also sets the resolution, since the output is a set of images of the slit; narrowing it sharpens the lines.',
    'A spectrometer uses a prism — Most use a grating; a prism\'s dispersion is nonlinear and weaker, though older instruments used it.',
    'The grating has one useful order — Several orders overlap at the detector; order-sorting filters remove the unwanted ones.'
  ],
  terms: [
    { term: 'Monochromator', def: 'A spectrometer with an exit slit that passes a single narrow band of wavelengths; turning the grating moves the band.' },
    { term: 'Spectrograph', also: ['array spectrometer'], def: 'A spectrometer that images the whole spectrum on an array detector, so that all wavelengths are recorded at once.' },
    { term: 'Reciprocal linear dispersion', also: ['dispersion in nm/mm', 'plate factor'], def: 'The change of wavelength per unit distance along the focal plane, in nm per mm; smaller means finer dispersion.' },
    { term: 'Bandpass', also: ['spectral resolution', 'slit function'], def: 'The width in wavelength of the band passed or recorded for one wavelength setting; the slit width times the reciprocal linear dispersion.' },
    { term: 'Order sorting', def: 'Removing the overlapping higher orders of a grating (for example the second order of 300 nm at 600 nm) with filters.' }
  ],
  formulas: [
    {
      name: 'Grating equation',
      expr: 'sin(al) + sin(be) = m*lambda*lpm', tex: '\\sin\\alpha + \\sin\\beta = m\\,\\lambda\\,N_d',
      vars: {
        al: { name: 'angle of incidence on the grating', q: 'angle', unit: '°', value: 29.86, signed: true, min: -89, max: 89, tex: '\\alpha' },
        be: { name: 'angle of diffraction', q: 'angle', unit: '°', signed: true, min: -89, max: 89, tex: '\\beta' },
        m: { name: 'order', value: 1, int: true, min: 1, max: 5 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' },
        lpm: { name: 'grating lines per unit length', q: 'wavenumber', unit: 'lines/mm', value: 1200, tex: 'N_d' }
      },
      solveFor: 'be',
      note: 'Both angles on the same side of the normal, as in a reflection grating.'
    },
    {
      name: 'Bandpass',
      expr: 'dl = w*cos(be)/(lpm*m*f)', tex: '\\Delta\\lambda = \\frac{w\\,\\cos\\beta}{m\\,N_d\\,f}',
      vars: {
        dl: { name: 'bandpass', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        w: { name: 'slit width', q: 'length', unit: 'µm', value: 100 },
        be: { name: 'angle of diffraction', q: 'angle', unit: '°', value: 5.86, min: -89, max: 89, signed: true, tex: '\\beta' },
        lpm: { name: 'grating lines per unit length', q: 'wavenumber', unit: 'lines/mm', value: 1200, tex: 'N_d' },
        m: { name: 'order', value: 1, int: true, min: 1, max: 5 },
        f: { name: 'focal length of the focusing mirror', q: 'length', unit: 'mm', value: 300 }
      },
      solveFor: 'dl',
      stories: { dl: 'A spectrometer has a {lpm} grating, a {f} focusing mirror and a {w} slit. What bandpass does it give?', w: 'A spectrometer with a {f} mirror and a {lpm} grating must give a bandpass of {dl}. What slit width is needed?' }
    },
    {
      name: 'Resolving power of the grating',
      expr: 'R = m*lpm*W', tex: 'R = m\\,N_d\\,W',
      vars: {
        R: { name: 'resolving power λ/Δλ' },
        m: { name: 'order', value: 1, int: true, min: 1, max: 5 },
        lpm: { name: 'grating lines per unit length', q: 'wavenumber', unit: 'lines/mm', value: 1200, tex: 'N_d' },
        W: { name: 'illuminated width of the grating', q: 'length', unit: 'mm', value: 50 }
      },
      solveFor: 'R',
      note: 'The ceiling set by the grating; the slit usually gives a lower resolving power.'
    }
  ],
  examples: [
    {
      title: 'Bandpass of a small spectrometer',
      q: 'A Czerny–Turner has a 1200 lines/mm grating, a 300 mm focusing mirror and beams 24° apart. At 500 nm in first order, what is the reciprocal linear dispersion, and the bandpass for a 100 µm slit?',
      steps: [
        'The grating angles: $\\sin\\alpha + \\sin\\beta = 0.6$ with $\\alpha - \\beta = 24^\\circ$ gives $\\alpha = 29.86^\\circ$, $\\beta = 5.86^\\circ$.',
        { text: 'Dispersion:', tex: '\\frac{d\\lambda}{dx} = \\frac{\\cos 5.86^\\circ}{1200\\ \\mathrm{mm^{-1}}\\times 300\\ \\mathrm{mm}} = 2.76\\ \\mathrm{nm/mm}' },
        { text: 'Bandpass:', tex: '\\Delta\\lambda = 0.100\\ \\mathrm{mm}\\times 2.76\\ \\mathrm{nm/mm} = 0.28\\ \\mathrm{nm}' }
      ],
      a: '2.76 nm/mm and 0.28 nm bandpass.'
    },
    {
      title: 'Splitting the sodium doublet',
      q: 'At 589 nm the same instrument has 2.74 nm/mm. Can it resolve the sodium doublet (0.60 nm apart) with a 100 µm slit? With a 300 µm slit?',
      steps: [
        { text: '100 µm slit:', tex: '\\Delta\\lambda = 0.100\\times 2.74 = 0.27\\ \\mathrm{nm}' },
        { text: '300 µm slit:', tex: '\\Delta\\lambda = 0.300\\times 2.74 = 0.82\\ \\mathrm{nm}' },
        'The lines are 0.60 nm apart: a bandpass of 0.27 nm shows two peaks; 0.82 nm, wider than the separation, merges them.'
      ],
      a: 'Resolved with 100 µm (bandpass 0.27 nm), not with 300 µm (0.82 nm).'
    }
  ],
  quiz: [
    { q: 'Which part of a Czerny–Turner spectrometer separates the wavelengths?', choices: ['The diffraction grating', 'The entrance slit', 'The collimating mirror', 'The detector'], a: 0, why: 'The grating sends each wavelength at its own angle. The mirrors only collimate and refocus; the slit sets the object and the resolution.' },
    { q: 'A spectrometer has a reciprocal linear dispersion of 2.7 nm/mm. A slit 0.1 mm wide gives a bandpass of (in nm)…', answer: 0.27, why: 'Bandpass = slit width × dispersion = 0.1 mm × 2.7 nm/mm = 0.27 nm.' },
    { q: 'Narrowing the entrance slit improves resolution but reduces the light.', a: true, why: 'The output is an image of the slit for each wavelength, so a narrower slit gives narrower lines; the light passed is proportional to the slit width.' },
    { q: 'What is the resolving power of a grating of 1200 lines/mm with 50 mm illuminated, in the first order?', answer: 60000, why: '$R = mN = 1\\times 1200\\times 50 = 60\\,000$.' },
    { q: 'Why do spectrometers use mirrors rather than lenses to collimate and focus?', choices: ['Mirrors have no chromatic aberration and work from the ultraviolet to the infrared', 'Mirrors are cheaper than any lens', 'Lenses cannot be used with slits', 'Mirrors increase the dispersion'], a: 0, why: 'A lens\'s focal length changes with wavelength, so a lens would focus each colour in a different place; a mirror focuses all wavelengths together.' }
  ],
  applications: [
    'Chemical analysis: UV–visible and infrared spectrophotometers measure how much light a sample absorbs at each wavelength.',
    'Astronomy: spectrographs on telescopes measure composition, temperature and velocity of stars and galaxies.',
    'Fluorescence and Raman spectroscopy, where a monochromator or spectrograph reads the emission.',
    'Colour and lighting measurement: compact fibre-fed spectrometers measure LED spectra, colour temperature and colour rendering.',
    'Calibration of detectors and filters with a scanning monochromator as a tunable light source.'
  ],
  history: 'Joseph von Fraunhofer mapped the dark lines of the solar spectrum with a prism spectrometer in 1814; Gustav Kirchhoff and Robert Bunsen turned it into an analytical instrument in 1859. Marianus Czerny and Arthur Turner described the two-mirror layout that bears their names in 1930.',
  sources: [
    'J. James, *Spectrograph Design Fundamentals* — slit, collimator, grating and camera, resolution and the Czerny–Turner layout.',
    'C. Palmer (ed.), *Diffraction Grating Handbook* — dispersion, resolution, order overlap and blaze.',
    'E. Hecht, *Optics*, ch. 10 (Diffraction) — the grating and its resolving power.'
  ],
  sim: 'oi-spectrometer'
}
);
