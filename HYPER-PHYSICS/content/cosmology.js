/* HYPER-PHYSICS · content/cosmology.js — the universe as a whole: expansion, the big
 * bang, its afterglow, and the dark matter and dark energy that dominate it. */
Hyper.add(

{
  id: 'hubbles-law', parent: 'cosmology', title: 'Hubble\'s law and redshift', level: 2,
  short: 'Distant galaxies recede from us at speeds proportional to their distance, v = H₀d — the signature of a universe whose space is expanding.',
  keywords: ['Hubble\'s law', 'Hubble–Lemaître law', 'Hubble constant', 'redshift', 'expanding universe', 'recession velocity', 'Hubble time', 'Hubble tension', 'megaparsec', 'cosmological redshift'],
  prereq: ['doppler-effect', 'stellar-magnitude', 'math:linear-functions'],
  related: ['big-bang', 'relativistic-doppler', 'cosmic-microwave-background', 'dark-matter-energy'],
  body: `
In the 1910s Vesto Slipher measured the spectra of the faint "spiral nebulae" and found most of them redshifted — moving away from us, some at over 1000 km/s. In 1924 Edwin Hubble used Cepheid variable stars as standard candles ([[stellar-magnitude|luminosity and magnitude]]) to show that these nebulae are galaxies far outside our own. Then came the surprise. Georges Lemaître in 1927 and Hubble in 1929 found that the farther away a galaxy is, the faster it recedes:

$$v = H_0\\, d$$

The **Hubble constant** $H_0$ is measured today at about 70 km/s per megaparsec (1 Mpc = $10^6$ pc = 3.26 million light-years). A galaxy 100 Mpc away recedes at about 7000 km/s; one 200 Mpc away, twice as fast. The relation is a straight line through the origin ([[math:linear-functions|a linear function]]).

### Redshift
The speed is read from the **redshift** of the galaxy's spectral lines:

$$z = \\frac{\\lambda_\\text{obs} - \\lambda_\\text{emit}}{\\lambda_\\text{emit}}$$

For nearby galaxies $z \\ll 1$ and $v \\approx cz$, as for an ordinary [[doppler-effect|Doppler shift]].

### Space is stretching
Hubble's law is exactly what you get if **space itself expands uniformly**. Picture a loaf of raisin bread rising in the oven: every raisin moves away from every other, and a raisin twice as far away moves away twice as fast — whichever raisin you sit on. So the law does not put us at a centre: observers in every galaxy see the same thing, and the universe has no centre and no edge to expand into. The galaxies are not rushing through space; they are carried apart as the space between them grows.

That also explains the redshift better. Light travelling between galaxies has its wavelength stretched along with space, so

$$1 + z = \\frac{\\text{size of the universe now}}{\\text{size of the universe when the light set out}}$$

Light from a galaxy at $z = 1$ set out when all cosmic distances were half what they are today. At large $z$ this is not the [[relativistic-doppler|relativistic Doppler formula]], and very distant galaxies recede faster than light: nothing moves *through* space faster than light, but space can grow faster.

### The Hubble time
If the galaxies had always receded at their present speeds, they would all have been together a time $d/v = 1/H_0$ ago. For $H_0 = 70$ km/s/Mpc, $1/H_0 = 14.0$ billion years — close to the age of the universe found by more careful methods, 13.8 billion years ([[big-bang|the big bang]]).

### The Hubble tension
Two kinds of measurement of $H_0$ disagree. The [[cosmic-microwave-background|cosmic microwave background]], interpreted with the standard model of cosmology, gives $67.4 \\pm 0.5$ km/s/Mpc; the distance ladder of [[stellar-parallax|parallax]], Cepheids and supernovae gives about $73 \\pm 1$. Whether this "Hubble tension" hides new physics or an unrecognised error is one of the open questions of cosmology.

> [!warn] Hubble's law describes the smooth expansion. Galaxies also have motions of their own of a few hundred km/s, which dominate close by: the Andromeda galaxy is approaching us at about 110 km/s and will merge with the Milky Way in about five billion years.
`,
  ideas: [
    'Galaxies recede with speeds proportional to their distance: v = H₀d, with H₀ ≈ 70 km/s/Mpc.',
    'Redshift z = (λ_obs − λ_emit)/λ_emit; for small z, v ≈ cz.',
    'The law means space itself is expanding uniformly; every observer sees the same pattern, and there is no centre.',
    '1 + z is the factor by which the universe has grown since the light was emitted.',
    '1/H₀ ≈ 14 billion years gives the rough age of the universe.'
  ],
  pitfalls: [
    'Galaxies recede from us because we are at the centre of the universe — Every galaxy sees all the others receding in the same way.',
    'The expansion means galaxies fly apart through space like shrapnel — Space between them grows; galaxies and everything bound by gravity keep their own size.',
    'Cosmological redshift is an ordinary Doppler shift — Only for small z; in general it measures how much space has stretched while the light travelled.'
  ],
  formulas: [
    {
      name: 'Hubble\'s law',
      expr: 'v = H0*d', tex: 'v = H_0\\, d',
      vars: {
        v: { name: 'recession speed', q: 'speed', unit: 'km/s' },
        H0: { name: 'Hubble constant', q: 'hubble', unit: 'km/s/Mpc', value: 70, tex: 'H_0' },
        d: { name: 'distance', q: 'length', unit: 'pc', value: 1e8 }
      },
      note: 'Distances in parsecs: 1 Mpc = $10^6$ pc, so the default is 100 Mpc. Valid for galaxies far enough away that their own motions are small in comparison.',
      stories: {
        v: 'A galaxy is {d} away. At what speed does it recede, if H₀ = {H0}?',
        d: 'A galaxy recedes at {v}. How far away is it, taking H₀ = {H0}?',
        H0: 'A galaxy {d} away recedes at {v}. What value of the Hubble constant does this give?'
      }
    },
    {
      name: 'Redshift from wavelengths',
      expr: 'z = (lamo - lame)/lame', tex: 'z = \\frac{\\lambda_\\mathrm{obs} - \\lambda_\\mathrm{emit}}{\\lambda_\\mathrm{emit}}',
      vars: {
        z: { name: 'redshift', signed: true },
        lamo: { name: 'observed wavelength', q: 'length', unit: 'nm', value: 700, tex: '\\lambda_\\mathrm{obs}' },
        lame: { name: 'emitted (laboratory) wavelength', q: 'length', unit: 'nm', value: 656.3, tex: '\\lambda_\\mathrm{emit}' }
      },
      stories: {
        z: 'The hydrogen line at {lame} appears at {lamo} in a galaxy\'s spectrum. What is the galaxy\'s redshift?',
        lamo: 'A galaxy has redshift {z}. Where does a line emitted at {lame} appear in its spectrum?'
      }
    },
    {
      name: 'Distance from a small redshift',
      expr: 'c*z = H0*d', tex: 'c\\, z = H_0\\, d', solveFor: 'd',
      vars: {
        z: { name: 'redshift', value: 0.0233 },
        H0: { name: 'Hubble constant', q: 'hubble', unit: 'km/s/Mpc', value: 70, tex: 'H_0' },
        d: { name: 'distance', q: 'length', unit: 'pc' },
        c: { const: 'c' }
      },
      note: 'Only for $z \\ll 1$ (below about 0.1); beyond that the distance depends on how the expansion rate has changed.',
      stories: {
        d: 'A galaxy shows a redshift of {z}. Taking H₀ = {H0}, how far away is it?',
        z: 'What redshift would a galaxy {d} away show, if H₀ = {H0}?'
      }
    },
    {
      name: 'Hubble time',
      expr: 't = 1/H0', tex: 't_H = \\frac{1}{H_0}',
      vars: {
        t: { name: 'Hubble time', q: 'time', unit: 'Gyr', tex: 't_H' },
        H0: { name: 'Hubble constant', q: 'hubble', unit: 'km/s/Mpc', value: 70, tex: 'H_0' }
      },
      note: 'The age the universe would have if it had always expanded at today\'s rate.',
      stories: {
        t: 'If H₀ = {H0}, what is the Hubble time?',
        H0: 'What Hubble constant corresponds to a Hubble time of {t}?'
      }
    }
  ],
  examples: [
    {
      title: 'A galaxy 100 Mpc away',
      q: 'How fast does a galaxy 100 Mpc away recede, and what redshift does it show? (Take $H_0 = 70$ km/s/Mpc.)',
      steps: [
        '$v = H_0 d = 70 \\times 100 = 7000$ km/s.',
        '$z \\approx v/c = 7000/299\\,792 = 0.023$.',
        'A hydrogen line at 656.3 nm would appear at $656.3 \\times 1.023 = 671.6$ nm.'
      ],
      a: '7000 km/s, z ≈ 0.023.'
    },
    {
      title: 'The Hubble time',
      q: 'Convert $H_0 = 70$ km/s/Mpc into SI units and find $1/H_0$ in years.',
      steps: [
        '1 Mpc $= 3.086\\times10^{19}$ km, so $H_0 = 70/3.086\\times10^{19} = 2.27\\times10^{-18}\\ \\mathrm{s^{-1}}$.',
        '$1/H_0 = 4.41\\times10^{17}$ s.',
        'Divide by $3.156\\times10^{7}$ s per year: 14.0 billion years.'
      ],
      a: '2.27 × 10⁻¹⁸ s⁻¹; 1/H₀ ≈ 14 billion years.'
    }
  ],
  quiz: [
    { q: 'A galaxy twice as far away as another recedes…', choices: ['at the same speed', 'twice as fast', 'four times as fast', 'half as fast'], a: 1,
      why: 'Hubble\'s law is a direct proportion: $v = H_0 d$.' },
    { q: 'Almost every galaxy is receding from the Milky Way. This shows that the Milky Way is…', choices: ['at the centre of the universe', 'not special: observers in any galaxy see the same', 'moving faster than other galaxies', 'at the edge of the universe'], a: 1,
      why: 'In a uniformly expanding universe every observer sees every other galaxy receding according to the same law.' },
    { q: 'With $H_0 = 70$ km/s/Mpc, a galaxy receding at 14 000 km/s is about…', choices: ['20 Mpc away', '200 Mpc away', '2000 Mpc away', '0.2 Mpc away'], a: 1,
      why: '$d = v/H_0 = 14\\,000/70 = 200$ Mpc.' },
    { q: 'Very distant galaxies recede faster than light, which contradicts special relativity.', a: false,
      why: 'Special relativity limits motion through space. The growth of space between distant galaxies is not such a motion, and no signal outruns light locally.' }
  ],
  applications: [
    'Measuring distances to faraway galaxies from their redshifts.',
    'Estimating the age of the universe.',
    'Mapping the large-scale structure of the universe with redshift surveys.'
  ],
  history: 'Vesto Slipher measured the first galaxy redshifts from 1912. Lemaître derived the expansion from general relativity and estimated its rate in 1927; Hubble published his distance–velocity plot in 1929. In 2018 the International Astronomical Union recommended the name "Hubble–Lemaître law".',
  sim: 'ra-hubble'
},

{
  id: 'big-bang', parent: 'cosmology', title: 'The big bang', level: 2,
  short: 'The universe has been expanding and cooling for 13.8 billion years from an extremely hot, dense early state — an event that happened everywhere, not at a point.',
  keywords: ['big bang', 'age of the universe', 'nucleosynthesis', 'primordial helium', 'inflation', 'recombination', 'cosmic timeline', 'Lemaître', 'Gamow', 'expanding universe', 'early universe'],
  prereq: ['hubbles-law', 'blackbody-radiation', 'fusion'],
  related: ['cosmic-microwave-background', 'dark-matter-energy', 'standard-model', 'antimatter'],
  body: `
If the galaxies are all moving apart ([[hubbles-law|Hubble's law]]), then in the past they were closer together. Run the expansion backwards and everything was once packed together, far denser and hotter than anything today. The **big bang** theory says that our universe has been expanding and cooling from such a hot, dense state for about 13.8 billion years.

> [!warn] The big bang was not an explosion at a point, flinging matter out into empty space. It happened everywhere at once: every point of today's universe was part of the hot, dense early state, and space itself has been stretching ever since. There is no centre, and no "outside" for the universe to expand into.

### Cooling as it grows
Light travelling through the expanding universe is stretched with it, so the radiation that fills space cools as the universe grows. When distances were smaller by a factor $1 + z$ (at redshift $z$), the radiation was hotter by the same factor:

$$T = T_0\\,(1 + z)$$

where $T_0 = 2.725$ K is its temperature today. Going backwards the universe becomes a furnace — and the physics at each stage is physics that can be tested in laboratories and colliders.

### A timeline
| Time after the start | Temperature | What happens |
|---|---|---|
| before about $10^{-32}$ s | — | **Inflation** (a leading hypothesis): a brief burst of enormous expansion that smoothed and flattened the universe and seeded its lumps |
| about a millionth of a second | $\\sim 10^{12}$ K | Quarks bind into protons and neutrons ([[quarks|quarks and hadrons]]) |
| 1 second | $10^{10}$ K | Neutrinos stop interacting; about one neutron is left for every six protons |
| 3–20 minutes | $10^{9}$ K | **Big bang nucleosynthesis**: protons and neutrons fuse into helium-4, with traces of deuterium, helium-3 and lithium |
| 380 000 years | 3000 K | Electrons join nuclei to form atoms; the universe becomes transparent and releases the [[cosmic-microwave-background|cosmic microwave background]] |
| 100–400 million years | — | The first stars and galaxies light up |
| 9.2 billion years | — | The Sun and the Earth form |
| 13.8 billion years | 2.725 K | Today |

### The evidence
1. **The expansion** itself, measured in the redshifts of galaxies.
2. **The cosmic microwave background**, the cooled glow of the hot early universe, arriving from every direction with an almost perfect [[blackbody-radiation|blackbody]] spectrum.
3. **The light elements.** About a quarter of the mass of the oldest stars and gas is helium, with deuterium and lithium in the proportions nuclear physics predicts for the first minutes. [[fusion|Fusion]] in stars could never have made that much helium.
4. **Evolution.** Looking far away is looking back in time: distant galaxies are younger, smaller and more irregular, and no star has been found that is older than the universe.

### What we do not know
The theory describes the universe from a tiny fraction of a second onwards extremely well. It does not say what, if anything, came "before", or what happened at the very first instant, where the density becomes so high that general relativity must give way to a quantum theory of gravity that we do not yet have.
`,
  ideas: [
    'The universe has been expanding and cooling for 13.8 billion years from a hot, dense state.',
    'The big bang happened everywhere; it was not an explosion from a point into space.',
    'The radiation temperature scales as T = T₀(1 + z): hotter in the past.',
    'The first minutes made about 25% helium by mass, plus traces of deuterium and lithium.',
    'The evidence: expansion, the microwave background, light-element abundances and cosmic evolution.'
  ],
  pitfalls: [
    'The big bang happened at a particular place, which we could point to — It happened everywhere; every point in space was part of it.',
    'The big bang theory explains how the universe began from nothing — It describes the universe from a tiny fraction of a second onwards; the very beginning remains unknown.',
    'The universe expands into something outside it — Expansion means distances within the universe grow; nothing outside is needed.'
  ],
  formulas: [
    {
      name: 'Temperature of the cosmic radiation at a redshift',
      expr: 'T = T0*(1 + z)', tex: 'T = T_0\\,(1 + z)',
      vars: {
        T: { name: 'temperature then', q: 'temperature', unit: 'K' },
        T0: { name: 'temperature of the background radiation today', q: 'temperature', unit: 'K', value: 2.725, tex: 'T_0' },
        z: { name: 'redshift', value: 1100 }
      },
      stories: {
        T: 'Light from redshift {z} set out when the universe was smaller by a factor 1 + z. How hot was the background radiation then (today it is {T0})?',
        z: 'At what redshift was the background radiation at {T}, given that it is {T0} today?'
      }
    },
    {
      name: 'Helium from the neutron-to-proton ratio',
      expr: 'Y = 2*r/(1 + r)', tex: 'Y = \\frac{2r}{1 + r}',
      vars: {
        Y: { name: 'fraction of the mass in helium-4' },
        r: { name: 'neutrons per proton when nucleosynthesis starts', value: 0.1429, min: 0, max: 1 }
      },
      note: 'Assumes every neutron ends up in helium-4 (two neutrons and two protons), which is nearly true.',
      stories: {
        Y: 'When nucleosynthesis starts there are {r} neutrons per proton, and nearly all neutrons end up in helium-4. What fraction of the mass becomes helium?',
        r: 'The early universe made {Y} of its mass into helium. How many neutrons per proton were there?'
      }
    },
    {
      name: 'Age of a universe containing only matter',
      expr: 't = 2/(3*H0)', tex: 't = \\frac{2}{3 H_0}',
      vars: {
        t: { name: 'age', q: 'time', unit: 'Gyr' },
        H0: { name: 'Hubble constant', q: 'hubble', unit: 'km/s/Mpc', value: 70, tex: 'H_0' }
      },
      note: 'For a flat universe with only matter, whose expansion has always been slowing. Dark energy makes the real universe older: 13.8 billion years.',
      stories: {
        t: 'If the universe held only matter and H₀ = {H0}, how old would it be?'
      }
    }
  ],
  examples: [
    {
      title: 'When the universe became transparent',
      q: 'The cosmic microwave background was released at redshift about 1100. How hot was the universe then?',
      steps: [
        '$T = T_0(1 + z) = 2.725 \\times 1101 = 3000$ K.',
        'That is the temperature at which hydrogen atoms hold on to their electrons — the moment the fog cleared.'
      ],
      a: 'About 3000 K.'
    },
    {
      title: 'Why a quarter helium',
      q: 'When nucleosynthesis began there was about one neutron for every seven protons. If nearly every neutron ends up in helium-4, what fraction of the mass is helium?',
      steps: [
        'Take 2 neutrons and 14 protons. The 2 neutrons join 2 protons to make one helium-4 nucleus.',
        'That leaves 12 protons as hydrogen. Helium carries 4 of the 16 mass units.',
        'Mass fraction $Y = 4/16 = 0.25$, or from the formula $Y = 2(1/7)/(1 + 1/7) = 0.25$.'
      ],
      a: '25% — as observed in the oldest stars and gas.'
    },
    {
      title: 'An age puzzle',
      q: 'A universe containing only matter would have age $2/(3H_0)$. With $H_0 = 70$ km/s/Mpc, how old is that, and why is it a problem?',
      steps: [
        '$1/H_0 = 14.0$ billion years, so $2/(3H_0) = 9.3$ billion years.',
        'But the oldest stars are 12–13 billion years old — older than such a universe.',
        'The expansion has not only been slowing: dark energy has sped it up for the last few billion years, and the true age comes out at 13.8 billion years ([[dark-matter-energy|dark matter and dark energy]]).'
      ],
      a: '9.3 billion years — too young; dark energy resolves it.'
    }
  ],
  quiz: [
    { q: 'Where did the big bang happen?', choices: ['At the centre of the universe', 'Everywhere', 'Near the Milky Way', 'At the edge of the observable universe'], a: 1,
      why: 'Every point in space took part; the expansion stretches all of space, not matter moving out from a centre.' },
    { q: 'When the universe was half its present size ($z = 1$), the background radiation had a temperature of about…', choices: ['1.4 K', '2.7 K', '5.4 K', '2700 K'], a: 2,
      why: '$T = 2.725 \\times (1 + 1) = 5.45$ K.' },
    { q: 'Which of these is NOT evidence for the big bang?', choices: ['The redshifts of distant galaxies', 'The cosmic microwave background', 'The abundance of helium', 'The Earth\'s magnetic field'], a: 3,
      why: 'The Earth\'s field comes from its liquid iron core and has nothing to do with cosmology.' },
    { q: 'Most of the helium in the universe was made in the first few minutes, not in stars.', a: true,
      why: 'Stars have added only a few per cent to the 25% made by big bang nucleosynthesis.' }
  ],
  applications: [
    'Testing particle and nuclear physics under conditions no laboratory can reach.',
    'Predicting the abundances of the light elements, a check on the density of ordinary matter.',
    'Framing the search for the first stars and galaxies with the James Webb Space Telescope.'
  ],
  history: 'Georges Lemaître proposed in 1931 that the universe began from a "primeval atom". George Gamow, Ralph Alpher and Robert Herman worked out nucleosynthesis and predicted the relic radiation in 1948. Fred Hoyle, a supporter of the rival steady-state theory, coined the name "big bang" on the radio in 1949; the discovery of the microwave background in 1965 settled the argument.',
  sim: 'ra-hubble'
},

{
  id: 'cosmic-microwave-background', parent: 'cosmology', title: 'The cosmic microwave background', level: 2,
  short: 'The oldest light in the universe: a faint glow of microwaves from every direction, the cooled radiation of the hot young universe 380 000 years after the big bang.',
  keywords: ['cosmic microwave background', 'CMB', 'relic radiation', 'Penzias and Wilson', 'COBE', 'WMAP', 'Planck', '2.725 K', 'recombination', 'anisotropy', 'dipole', 'acoustic peaks'],
  prereq: ['big-bang', 'blackbody-radiation', 'em-spectrum'],
  related: ['hubbles-law', 'dark-matter-energy', 'relativistic-doppler', 'thermal-radiation'],
  body: `
Point a radio telescope at any part of the sky, away from stars and galaxies, and you still pick up a faint hiss of microwaves. This **cosmic microwave background** (CMB) is the oldest light in the universe: the afterglow of the [[big-bang|hot early universe]], released 380 000 years after it began.

### Where it comes from
For its first few hundred thousand years the universe was a hot plasma of nuclei, free electrons and light. Photons could not travel far before scattering off an electron, so the universe was opaque, like the inside of a cloud. As it expanded it cooled, and at about 3000 K the electrons combined with nuclei into neutral atoms — **recombination**. Neutral hydrogen hardly scatters light, so the universe became transparent, and the light of that moment has travelled freely ever since.

Since then the universe has expanded about 1100 times, stretching every wavelength by the same factor ([[hubbles-law|redshift]]). A 3000 K glow has become a 2.725 K glow, peaking at a wavelength of about 1 mm, in the microwave band ([[em-spectrum|electromagnetic spectrum]]):

$$\\lambda_\\mathrm{max} = \\frac{b}{T} = \\frac{2.898\\times10^{-3}\\ \\mathrm{m\\,K}}{2.725\\ \\mathrm{K}} = 1.06\\ \\mathrm{mm}$$

### Discovery
In 1964 Arno Penzias and Robert Wilson, testing a horn antenna at Bell Labs in New Jersey, found a stubborn noise of about 3 K that came from every direction at every hour — even after they had evicted the pigeons nesting in the antenna. Nearby at Princeton, Robert Dicke's group was building an experiment to look for exactly this relic radiation, which Ralph Alpher and Robert Herman had predicted in 1948. The discovery sank the rival steady-state theory and won Penzias and Wilson the 1978 Nobel Prize.

### A perfect blackbody
In 1990 the COBE satellite measured the spectrum and found the most perfect [[blackbody-radiation|blackbody]] ever observed: $T = 2.725$ K, with deviations below 50 parts per million. Only a hot, dense early universe in thermal equilibrium could have produced it.

### The ripples
The CMB is almost, but not quite, the same in every direction:

- A **dipole** — warmer by 3.4 mK in one direction and cooler in the opposite one — is our own motion, at about 370 km/s relative to the CMB, Doppler-shifting it: $\\Delta T = T\\,v/c$.
- Tiny **fluctuations** of about 1 part in 100 000, first seen by COBE in 1992 and mapped in detail by the WMAP and Planck satellites, are the imprint of slightly denser and thinner regions — the seeds from which gravity later grew galaxies and clusters.

The fluctuations have preferred sizes, set by sound waves that rang through the early plasma. The largest, about one degree across, shows that space is geometrically **flat**; the pattern of the smaller ones measures how much ordinary matter and [[dark-matter-energy|dark matter]] the universe contains, its age (13.8 billion years) and its expansion rate.

> [!fact] Every cubic centimetre of space holds about 411 CMB photons — over a billion for every atom in the universe. Before digital broadcasting, about one per cent of the "snow" on an untuned analogue television came from the big bang.
`,
  ideas: [
    'The CMB was released when the universe became transparent, 380 000 years after the big bang, at about 3000 K.',
    'Stretched about 1100 times by the expansion, it is now a 2.725 K blackbody peaking near 1 mm.',
    'Its spectrum is the most perfect blackbody known — strong evidence for a hot early universe.',
    'A dipole of 3.4 mK reveals our motion; fluctuations of 1 part in 10⁵ are the seeds of galaxies.',
    'The pattern of the fluctuations measures the geometry, contents and age of the universe.'
  ],
  pitfalls: [
    'The CMB comes from a particular place, the spot where the big bang happened — It comes from every direction, because the big bang happened everywhere.',
    'The CMB is emitted by our galaxy or by stars — Its perfect blackbody spectrum and uniformity show it fills the whole universe and predates all stars.',
    'The universe has always been transparent — Before recombination it was an opaque plasma; the CMB is the first light we can see.'
  ],
  formulas: [
    {
      name: 'Peak wavelength of the background',
      expr: 'lam = bW/T', tex: '\\lambda_\\mathrm{max} = \\frac{b}{T}',
      vars: {
        lam: { name: 'wavelength of peak emission', q: 'length', unit: 'mm', tex: '\\lambda_\\mathrm{max}' },
        bW: { const: 'bW' },
        T: { name: 'temperature of the radiation', q: 'temperature', unit: 'K', value: 2.725 }
      },
      stories: {
        lam: 'The background radiation has a temperature of {T}. At what wavelength does its spectrum peak?',
        T: 'The background radiation\'s spectrum peaks at {lam}. What is its temperature?'
      }
    },
    {
      name: 'Dipole from our motion',
      expr: 'dT = T*v/c', tex: '\\Delta T = T\\,\\frac{v}{c}',
      vars: {
        dT: { name: 'temperature excess ahead of us', q: 'dtemp', unit: 'K', tex: '\\Delta T' },
        T: { name: 'mean temperature', q: 'temperature', unit: 'K', value: 2.725 },
        v: { name: 'our speed relative to the background', q: 'speed', unit: 'km/s', value: 370 },
        c: { const: 'c' }
      },
      note: 'First-order Doppler effect, valid for $v \\ll c$. 0.00336 K = 3.36 mK.',
      stories: {
        dT: 'We move at {v} relative to the background radiation, which averages {T}. How much warmer does it look straight ahead?',
        v: 'The background looks {dT} warmer in one direction than its average of {T}. How fast are we moving relative to it?'
      }
    },
    {
      name: 'Number of background photons per unit volume',
      expr: 'n = 2*1.2020569/pi^2*(kB*T/(hbar*c))^3', tex: 'n = \\frac{2\\zeta(3)}{\\pi^2}\\left(\\frac{k_B T}{\\hbar c}\\right)^3',
      vars: {
        n: { name: 'photons per unit volume', q: 'numberdensity', unit: '1/cm³' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 2.725 },
        kB: { const: 'kB' },
        hbar: { const: 'hbar' },
        c: { const: 'c' }
      },
      note: 'For blackbody radiation; $\\zeta(3) = 1.202$. The number grows as $T^3$.',
      stories: {
        n: 'How many photons of blackbody radiation at {T} fill each cubic centimetre?',
        T: 'At what temperature does blackbody radiation contain {n} photons?'
      }
    }
  ],
  examples: [
    {
      title: 'Why microwaves?',
      q: 'The background was emitted at about 3000 K and is 2.725 K today. Compare the peak wavelengths then and now.',
      steps: [
        'Then: $\\lambda_\\mathrm{max} = 2.898\\times10^{-3}/3000 = 966$ nm, in the near infrared — the gas glowed a dull orange-red.',
        'Now: $\\lambda_\\mathrm{max} = 2.898\\times10^{-3}/2.725 = 1.06$ mm, in the microwaves.',
        'The ratio, $1.06\\ \\mathrm{mm}/966\\ \\mathrm{nm} = 1100$, is the factor by which the universe has expanded since.'
      ],
      a: 'From about 1 µm to about 1 mm — stretched 1100 times.'
    },
    {
      title: 'Our speed through the universe',
      q: 'The CMB is 3.36 mK warmer than average in one direction. How fast are we moving relative to it?',
      steps: [
        '$v = c\\,\\Delta T/T = 3.00\\times10^{5}\\ \\mathrm{km/s} \\times 3.36\\times10^{-3}/2.725$.',
        '$v = 370$ km/s, towards the constellation Leo — the combined motion of the Sun round the galaxy and of the galaxy through space.'
      ],
      a: '370 km/s'
    }
  ],
  quiz: [
    { q: 'The CMB was emitted by gas at about 3000 K, which glows orange. Why do we receive it as microwaves?', choices: ['It was emitted as microwaves', 'The expansion of the universe has stretched its wavelengths about 1100 times', 'Dust has absorbed the visible part', 'The photons lost energy colliding with galaxies'], a: 1,
      why: 'Cosmological redshift stretches every wavelength by $1 + z \\approx 1100$, turning a 3000 K glow into a 2.7 K one.' },
    { q: 'The CMB dipole tells us…', choices: ['that the universe is rotating', 'our own motion relative to the CMB', 'where the centre of the universe is', 'the size of the first galaxies'], a: 1,
      why: 'Moving at 370 km/s, we see the radiation slightly blueshifted ahead and redshifted behind.' },
    { q: 'The tiny temperature fluctuations in the CMB matter because they…', choices: ['show that the Earth is warming', 'are the seeds from which galaxies and clusters grew', 'come from our own galaxy', 'are errors of measurement'], a: 1,
      why: 'Slightly denser regions pulled in more matter over billions of years and became galaxies and clusters.' },
    { q: 'Before recombination the universe was transparent to light.', a: false,
      why: 'Free electrons scattered photons constantly, making the plasma opaque; the universe became transparent only when atoms formed.' }
  ],
  applications: [
    'Precision cosmology: the age, geometry and contents of the universe.',
    'Measuring our velocity relative to the universe as a whole.',
    'Searches for the imprint of inflation in the polarisation of the CMB.'
  ],
  history: 'Alpher and Herman predicted a background of about 5 K in 1948. Penzias and Wilson found it in 1964–65 (Nobel Prize 1978). COBE measured its blackbody spectrum and first fluctuations (Nobel Prize 2006 for John Mather and George Smoot), followed by WMAP (2001–2010) and Planck (2009–2013).'
},

{
  id: 'dark-matter-energy', parent: 'cosmology', title: 'Dark matter and dark energy', level: 2,
  short: 'Most of the universe is invisible: dark matter, whose gravity holds galaxies together, and dark energy, which is speeding up the expansion. Ordinary matter is only 5%.',
  keywords: ['dark matter', 'dark energy', 'rotation curve', 'galaxy halo', 'Vera Rubin', 'Zwicky', 'Bullet Cluster', 'WIMP', 'axion', 'cosmological constant', 'accelerating universe', 'critical density'],
  prereq: ['circular-orbits', 'newtons-law-of-gravitation', 'hubbles-law'],
  related: ['gravitational-lensing', 'cosmic-microwave-background', 'big-bang', 'compact-stars'],
  body: `
Add up everything we can see — stars, gas, dust, planets — and it falls far short of what gravity tells us is there. Measure how the expansion of the universe changes over time, and it turns out to be speeding up. Two unknown ingredients, **dark matter** and **dark energy**, together make up about 95% of the universe.

### The evidence for dark matter
- **Spinning galaxies.** If most of a galaxy's mass were in its bright centre, stars far out would orbit more slowly than those further in, just as the outer planets orbit the Sun more slowly ([[circular-orbits|circular orbits]]). In the 1970s Vera Rubin and Kent Ford measured the rotation of galaxies and found their **rotation curves are flat**: stars far out orbit as fast as those further in. For a circular orbit $v^2 = GM(r)/r$, so a constant $v$ means the enclosed mass $M(r) = v^2 r/G$ keeps growing in proportion to $r$, far beyond the visible stars. Each galaxy sits inside a much larger, invisible **halo**.
- **Galaxy clusters.** In 1933 Fritz Zwicky found that the galaxies of the Coma cluster move far too fast to be held together by their visible mass. The hot X-ray gas in clusters and the [[gravitational-lensing|gravitational lensing]] of background galaxies tell the same story: about five to six times more matter than all the ordinary matter present.
- **The Bullet Cluster.** In this pair of colliding clusters, the hot gas — which holds most of their ordinary matter — was slowed by the collision and left in the middle, but lensing shows that most of the mass sailed on with the galaxies. Whatever dominates the mass does not collide like ordinary gas.
- **The early universe.** The pattern of ripples in the [[cosmic-microwave-background|cosmic microwave background]] and the growth of galaxies both need matter that does not interact with light; without it, galaxies would not have formed by now.

### What could it be?
Not ordinary matter in some dim form: the light elements from the [[big-bang|big bang]] and the CMB both limit ordinary ("baryonic") matter to about 5% of the total. Not neutrinos, which are too light and fast to gather into galaxy halos. The leading ideas are new particles — weakly interacting massive particles (WIMPs), or very light axions — but decades of searches, from detectors deep underground to the [[particle-accelerators|Large Hadron Collider]], have not found them. A minority view holds that gravity itself behaves differently on galactic scales; so far such theories struggle to explain clusters and the CMB.

### Dark energy
In 1998 two teams measuring distant **Type Ia supernovae** — exploding white dwarfs that make excellent standard candles ([[compact-stars|compact stars]]) — found them fainter, and so farther away, than expected if the expansion were slowing down. The expansion has been **accelerating** for about the last five billion years (Nobel Prize 2011). Whatever drives it is called dark energy. The simplest explanation is Einstein's **cosmological constant**: an energy belonging to empty space itself, the same everywhere and never diluting as space expands. Recent survey results hint that it might slowly weaken over time; whether that holds up is an open question.

### The cosmic budget
Cosmologists compare densities with the **critical density**, the density a flat universe must have:

$$\\rho_c = \\frac{3H_0^2}{8\\pi G} \\approx 9\\times10^{-27}\\ \\mathrm{kg/m^3}$$

— about five hydrogen atoms per cubic metre. The CMB shows the universe is flat, so its total density is critical, and it is made of:

| Ingredient | Share |
|---|---|
| Dark energy | 68% |
| Dark matter | 27% |
| Ordinary matter (atoms) | 5% |

Everything ever seen through a telescope belongs to the last 5%.
`,
  ideas: [
    'Flat rotation curves mean galaxies are embedded in large halos of unseen matter: M(r) = v²r/G.',
    'Clusters, lensing, the Bullet Cluster and the CMB all point to dark matter, about five times as much as ordinary matter.',
    'Dark matter is not ordinary matter, and its particle nature is unknown.',
    'Supernova distances show the expansion is accelerating, driven by dark energy.',
    'The universe is about 68% dark energy, 27% dark matter and 5% ordinary matter.'
  ],
  pitfalls: [
    'Dark matter is just ordinary gas and dust too cold to see — The abundances of light elements and the CMB limit ordinary matter to about 5%, far too little.',
    'Dark energy and dark matter are the same thing — Dark matter pulls, clumping into halos; dark energy is smooth and drives the expansion faster.',
    'Dark matter is antimatter — Antimatter would annihilate with ordinary matter and produce gamma rays we do not see; it also interacts with light.'
  ],
  formulas: [
    {
      name: 'Mass inside an orbit from the rotation speed',
      expr: 'M = v^2*r/G', tex: 'M = \\frac{v^2 r}{G}',
      vars: {
        M: { name: 'mass enclosed within the orbit', q: 'mass', unit: 'M☉' },
        v: { name: 'orbital speed', q: 'speed', unit: 'km/s', value: 230 },
        r: { name: 'orbital radius', q: 'length', unit: 'pc', value: 8200 },
        G: { const: 'G' }
      },
      note: 'For a circular orbit and a roughly spherical mass distribution. The defaults are the Sun\'s orbit round the Milky Way.',
      stories: {
        M: 'Stars {r} from a galaxy\'s centre orbit at {v}. How much mass lies inside their orbit?',
        v: 'A galaxy has {M} within {r} of its centre. How fast do stars orbit at that radius?'
      }
    },
    {
      name: 'Critical density',
      expr: 'rho = 3*H^2/(8*pi*G)', tex: '\\rho_c = \\frac{3 H_0^2}{8\\pi G}',
      vars: {
        rho: { name: 'critical density', q: 'density', unit: 'kg/m³', tex: '\\rho_c' },
        H: { name: 'Hubble constant', q: 'hubble', unit: 'km/s/Mpc', value: 70, tex: 'H_0' },
        G: { const: 'G' }
      },
      stories: {
        rho: 'What is the critical density of the universe if H₀ = {H}?',
        H: 'For what value of the Hubble constant would the critical density be {rho}?'
      }
    }
  ],
  examples: [
    {
      title: 'Weighing the Milky Way',
      q: 'The Sun orbits the centre of the Milky Way at about 230 km/s, 8.2 kpc from the centre. How much mass lies inside its orbit?',
      steps: [
        '$r = 8.2\\times10^{3} \\times 3.086\\times10^{16} = 2.53\\times10^{20}$ m; $v = 2.3\\times10^{5}$ m/s.',
        '$M = \\dfrac{v^2 r}{G} = \\dfrac{(2.3\\times10^{5})^2 \\times 2.53\\times10^{20}}{6.67\\times10^{-11}} = 2.0\\times10^{41}$ kg.',
        'In solar masses: $2.0\\times10^{41}/1.99\\times10^{30} = 1.0\\times10^{11}\\ M_\\odot$.'
      ],
      a: 'About 10¹¹ solar masses.'
    },
    {
      title: 'A flat rotation curve',
      q: 'Suppose the rotation speed stays at 230 km/s out to 50 kpc. How much mass lies within 50 kpc? The stars and gas of the Milky Way total about $6\\times10^{10}\\ M_\\odot$.',
      steps: [
        'With constant $v$, $M \\propto r$: $M(50\\ \\mathrm{kpc}) = 1.0\\times10^{11} \\times 50/8.2 = 6.1\\times10^{11}\\ M_\\odot$.',
        'That is about ten times the visible mass: the rest is dark matter.'
      ],
      a: 'About 6 × 10¹¹ M☉ — roughly ten times what we can see.'
    },
    {
      title: 'How empty is the universe?',
      q: 'Find the critical density for $H_0 = 70$ km/s/Mpc, and express it as hydrogen atoms per cubic metre.',
      steps: [
        '$H_0 = 2.27\\times10^{-18}\\ \\mathrm{s^{-1}}$.',
        '$\\rho_c = \\dfrac{3 \\times (2.27\\times10^{-18})^2}{8\\pi \\times 6.67\\times10^{-11}} = 9.2\\times10^{-27}\\ \\mathrm{kg/m^3}$.',
        'A hydrogen atom has mass $1.67\\times10^{-27}$ kg, so this is about 5.5 atoms per cubic metre — and ordinary matter is only 5% of it.'
      ],
      a: '9.2 × 10⁻²⁷ kg/m³, about 5.5 hydrogen atoms per m³.'
    }
  ],
  quiz: [
    { q: 'The rotation curves of spiral galaxies stay flat far from the centre. This means…', choices: ['most of the mass is concentrated at the centre', 'the enclosed mass keeps growing with radius, beyond the visible stars', 'gravity becomes repulsive at large distances', 'the outer stars are younger'], a: 1,
      why: 'From $v^2 = GM(r)/r$, a constant $v$ requires $M(r) \\propto r$.' },
    { q: 'About what fraction of the universe\'s content is ordinary matter made of atoms?', choices: ['5%', '27%', '68%', '95%'], a: 0,
      why: 'Dark energy is about 68% and dark matter about 27%, leaving about 5% for all the atoms.' },
    { q: 'What did observations of distant Type Ia supernovae reveal in 1998?', choices: ['The universe is shrinking', 'The expansion of the universe is accelerating', 'Dark matter is made of neutrinos', 'The universe is 20 billion years old'], a: 1,
      why: 'The supernovae were fainter, so farther, than a decelerating expansion allows.' },
    { q: 'Dark matter could simply be ordinary gas and dust too cold to see.', a: false,
      why: 'The amount of ordinary matter is fixed at about 5% by big bang nucleosynthesis and the CMB, and cold gas would still absorb or emit detectable radiation.' }
  ],
  applications: [
    'Mapping dark matter with gravitational lensing surveys such as Euclid.',
    'Underground and collider experiments searching for dark-matter particles.',
    'Supernova and galaxy surveys that measure how dark energy changes over time.'
  ],
  history: 'Fritz Zwicky inferred "dunkle Materie" in the Coma cluster in 1933. Vera Rubin and Kent Ford\'s rotation curves (1970s) made the case compelling. The accelerating expansion was found in 1998 by teams led by Saul Perlmutter, Brian Schmidt and Adam Riess (Nobel Prize 2011).'
}

);
