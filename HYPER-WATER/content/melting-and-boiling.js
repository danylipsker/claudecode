/* HYPER-WATER · content/melting-and-boiling.js — "Why it is liquid" (branch: The Hydrogen Bond).
 * Eight concepts: the boiling point anomaly · the latent heat of vaporisation · melting and the latent heat of fusion ·
 * vapour pressure and evaporation · boiling at altitude and under pressure · the phase diagram · supercritical water ·
 * the triple point as a standard. Simulations: sims/melting-and-boiling.js (ids mb-*). Numbers come from kit.water
 * (IAPWS vapour-pressure, sublimation and melting curves) wherever the engine has them. */
Hyper.add(

/* ================================================================ 1 */
{
  id: 'the-boiling-point-anomaly', parent: 'melting-and-boiling', title: 'The boiling point anomaly', level: 1,
  short: 'Line up the hydrides of oxygen\'s column — H₂Te, H₂Se, H₂S — and the trend says water should boil near −80 °C and melt near −100 °C. It boils at +100 °C: 180 kelvin too high. The extra heat is the price of pulling a molecule out of a net of four hydrogen bonds.',
  keywords: ['boiling point anomaly', 'hydride', 'H2S', 'H2Te', 'why water boils at 100', 'group 16', 'chalcogen', 'hydrogen bonding', 'boiling point trend', 'Trouton', 'ladder', 'water should be a gas', 'extrapolated boiling point'],
  prereq: ['what-a-hydrogen-bond-is', 'the-hydride-ladder'],
  related: ['latent-heat-of-vaporisation', 'melting-and-the-latent-heat-of-fusion', 'three-siblings', 'two-donors-two-acceptors', 'the-list-of-anomalies', 'chemistry:hydrogen-bonding', 'chemistry:intermolecular-forces'],
  body: `
Hydrogen sulfide, the gas of rotten eggs, boils at −60 °C: at any ordinary temperature it is a gas, drifting up out of a swamp or a sewer and into your nose. Its molecule is built like water's — a central atom from the same column of the periodic table, two hydrogens, a bent shape — and it is nearly twice as heavy, 34 mass units against 18. Yet water, the lighter molecule, boils 160 degrees higher. Of all the strange facts about water this was the first to be noticed, and it is the one that makes the others possible. At the temperature of the sea, a water without hydrogen bonds would simply be a gas.

### The trend that water breaks
In a family of similar molecules held together only by weak, non-directional attractions (the dispersion or van der Waals force), boiling point climbs with size: a heavier molecule has more electrons, is easier to distort, sticks to its neighbours harder and boils higher. The three heavier hydrides of oxygen's column obey it exactly:

| Molecule | Mass (u) | Boils at | Melts at |
|---|---|---|---|
| H₂Te | 129.6 | −2.2 °C | −49 °C |
| H₂Se | 81.0 | −41.3 °C | −65.7 °C |
| H₂S | 34.1 | −60.3 °C | −85.5 °C |
| H₂O, if it followed the trend | 18.0 | about −80 °C | about −100 °C |
| **H₂O, measured** | 18.0 | **+100 °C** | **0 °C** |

Extend the line down one place and it lands at about −80 °C for boiling and −100 °C for melting (about −70 to −90 °C, depending on whether you draw the line against period or against mass; the size of the miss does not depend on the choice). The measured values miss by **180 K** for boiling and **100 K** for melting. A water that followed the trend would be liquid only between −100 and −80 °C, a 20-degree window in the deep cold. Real water is liquid across a hundred degrees, from the freezer to the kettle.

### One bond per molecule, two, four
Do the same for the other columns and you see where the excess comes from. Methane (the top of column 14) boils at −161.5 °C and sits about 30 K *below* the trend of its heavier relatives: carbon makes no hydrogen bonds, so there is no anomaly at all. Ammonia is 79 K too high, hydrogen fluoride 121 K too high, water 180 K. The ranking follows the number of hydrogen bonds each molecule can make: ammonia has three hydrogens but one lone pair, hydrogen fluoride one hydrogen and three lone pairs, so each ends up with about one good bond per molecule and a chain or a ring. Water has two of each, in a tetrahedron, and builds a three-dimensional net.

The heat tells the same story. Vaporising a mole of H₂S takes 18.7 kJ; a mole of water takes 40.7. The extra 22 kJ/mol is about one hydrogen bond's worth, and it is the energy a molecule must find to leave the net.

### Boiling point is a ratio
A liquid boils when the entropy gained by becoming a gas pays for the enthalpy spent: $T_b = \\Delta H_{vap}/\\Delta S_{vap}$. For most simple liquids the entropy of vaporisation is about 88 J/(mol·K) (**Trouton's rule**; H₂S gives 87.7). If water obeyed it, its 40.7 kJ/mol would put the boiling point at 462 K, 189 °C. Water boils at 373 K because its entropy of vaporisation is bigger, 109 J/(mol·K): the liquid is more ordered than a simple liquid, so there is more disorder to gain by escaping. The hydrogen bonds raise the boiling point twice over, once through the enthalpy and — in the other direction, partly cancelling — through the entropy.

### Same formula, different boiling point
Ethanol and dimethyl ether are both C₂H₆O: same atoms, same mass of 46. Ethanol, with an O–H that can donate and a lone pair that can accept, boils at 78 °C; dimethyl ether, whose oxygen can only accept, boils at −25 °C. One hydrogen on the right atom is worth 100 kelvin.

> [!key] Water boils 180 K above the trend of its heavier cousins because every molecule must break free of four hydrogen bonds, and melts 100 K above it for the same reason. Without the hydrogen bond the oceans would be a gas, and the 100-degree liquid range of water would shrink to a 20-degree sliver in the deep cold.`,
  ideas: ['In a family of similar molecules boiling point rises with mass; H₂S, H₂Se and H₂Te obey, and extending their line puts water near −80 °C.', 'Real water boils at +100 °C and melts at 0 °C: 180 K and 100 K above the trend, a liquid range five times longer than the trend allows.', 'The excess grows with the number of hydrogen bonds a molecule can make: methane none (no anomaly), ammonia 79 K, hydrogen fluoride 121 K, water 180 K.', 'Boiling point is enthalpy over entropy of vaporisation; water\'s hydrogen bonds raise the enthalpy to 40.7 kJ/mol and partly offset it with a higher entropy.'],
  pitfalls: ['"Water boils high because it is heavy" — It is the lightest of its family and the highest boiling; within a family without hydrogen bonds, mass does set the order, and water is the exception that proves it.', '"The −80 °C figure is a measurement" — It is an extrapolation along a trend, and −70 to −90 °C are equally fair; the point is the size of the miss, about 100–200 K, not its exact value.', '"Any molecule with hydrogen boils high" — Hydrogen must sit on nitrogen, oxygen or fluorine to be positive enough to bond; methane, whose hydrogens sit on carbon, is a gas to −161 °C.'],
  terms: [
    { term: 'Boiling point anomaly', also: ['hydride anomaly', 'boiling-point excess'], def: 'The amount by which a substance boils above the trend of its chemical family. For water the trend of H₂S, H₂Se and H₂Te gives about −80 °C; the measured value is 100 °C, an excess of 180 K.' },
    { term: 'Hydride', also: ['binary hydrogen compound'], def: 'A compound of hydrogen with one other element. Water is the hydride of oxygen; H₂S, H₂Se and H₂Te are the hydrides of the three elements below it, and CH₄, NH₃ and HF are the neighbours of water in the second row.' },
    { term: 'Dispersion force', also: ['London force', 'van der Waals attraction'], def: 'The weak attraction between any two molecules, caused by momentary uneven distributions of electrons. It grows with the number of electrons, which is why heavier hydrides boil higher; in methane it is worth about 1 kJ/mol.' },
    { term: 'Trouton\'s rule', also: ['Trouton\'s constant'], def: 'The observation that the entropy of vaporisation of most simple liquids at their boiling point is about 88 J/(mol·K). Liquids with strong structure, such as water at 109 J/(mol·K), are above it.' },
    { term: 'Entropy of vaporisation', also: ['ΔS_vap'], def: 'The entropy gained when a mole of liquid becomes vapour at its boiling point: the enthalpy of vaporisation divided by the boiling temperature in kelvin.' }
  ],
  formulas: [
    { name: 'Boiling point from enthalpy and entropy of vaporisation', expr: 'Tb = dH/dS', tex: 'T_b = \\frac{\\Delta H_{vap}}{\\Delta S_{vap}}',
      vars: { Tb: { name: 'boiling point', q: 'temperature', unit: '°C', tex: 'T_b' }, dH: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 40.66, tex: '\\Delta H_{vap}', hint: 'Water 40.66 kJ/mol at 100 °C, hydrogen sulfide 18.7 at −60 °C, ammonia 23.3 at −33 °C.' }, dS: { name: 'entropy of vaporisation', unit: 'J/(mol·K)', value: 109, tex: '\\Delta S_{vap}', hint: 'About 88 for simple liquids (Trouton\'s rule); water 109, because its liquid is more ordered.' } },
      solveFor: 'Tb', note: 'Both quantities taken at the boiling point and at one atmosphere. Try 88 for the entropy to see where water would boil if it were an ordinary liquid.',
      stories: { Tb: 'A liquid has an enthalpy of vaporisation of {dH} and an entropy of vaporisation of {dS}. Where does it boil?', dS: 'A liquid boils at {Tb} with an enthalpy of vaporisation of {dH}. What is its entropy of vaporisation?' } },
    { name: 'The size of the anomaly', expr: 'dT = Tobs - Texp', tex: '\\Delta T = T_{obs} - T_{exp}',
      vars: { dT: { name: 'boiling-point excess', q: 'dtemp', unit: 'K', signed: true, tex: '\\Delta T' }, Tobs: { name: 'measured boiling point', q: 'temperature', unit: '°C', value: 100, tex: 'T_{obs}' }, Texp: { name: 'boiling point expected from the trend', q: 'temperature', unit: '°C', value: -80, tex: 'T_{exp}', hint: 'Extrapolated from the heavier members of the family: about −80 °C for water, −112 °C for ammonia, −102 °C for hydrogen fluoride, −132 °C for methane.' } },
      solveFor: 'dT', note: 'Negative where there is no anomaly: methane lies below the trend of silane, germane and stannane.',
      stories: { dT: 'Ammonia boils at {Tobs}; the trend of phosphine, arsine and stibine puts it at {Texp}. By how much is it anomalous?' } },
    { name: 'Share of the heat of vaporisation that is hydrogen bonding', expr: 'f = (H - H0)/H', tex: 'f = \\frac{H_{vap} - H_0}{H_{vap}}',
      vars: { f: { name: 'share due to hydrogen bonds', q: 'ratio', unit: '%', tex: 'f' }, H: { name: 'enthalpy of vaporisation of water', q: 'molarenergy', unit: 'kJ/mol', value: 40.66, tex: 'H_{vap}' }, H0: { name: 'enthalpy of a comparable liquid without the bond', q: 'molarenergy', unit: 'kJ/mol', value: 18.7, tex: 'H_0', hint: 'Hydrogen sulfide, 18.7 kJ/mol, is the stand-in: dipole and dispersion but only the faintest hydrogen bonds.' } },
      solveFor: 'f', note: 'A crude estimate: a lighter molecule would have a smaller dispersion share, so the true hydrogen-bond share is a little larger than the answer.',
      stories: { f: 'Water needs {H} to vaporise, a bond-free liquid of similar shape {H0}. What share of the heat is the hydrogen bonds\' doing?' } }
  ],
  examples: [
    { title: 'Drawing the ladder', q: 'Using only the boiling points of H₂S (34.1 u, −60.3 °C) and H₂Te (129.6 u, −2.2 °C), where would water boil if it followed the trend, drawing the line first against period and then against mass?',
      steps: ['H₂S is in period 3 and H₂Te in period 5, so the line rises $(−2.2 − (−60.3))/2 = 29$ K per period. One period down from H₂S is period 2: $−60.3 − 29 = −89$ °C.', { text: 'Against mass the slope is', tex: '\\frac{-2.2 - (-60.3)}{129.6 - 34.1} = 0.61\\ \\mathrm{K/u}' }, 'Water is 16.1 u lighter than H₂S: $−60.3 − 0.61 \\times 16.1 = −70$ °C.', 'The two lines bracket the answer between −89 and −70 °C, centred at −80 °C. The measured 100 °C is 170 to 190 K above.'],
      a: 'Between −89 and −70 °C, about −80 °C on average; the measured 100 °C is roughly 180 K higher.' },
    { title: 'What water gains on boiling', q: 'Water boils at 373.15 K with an enthalpy of vaporisation of 40.66 kJ/mol. Compare its entropy of vaporisation with Trouton\'s 88 J/(mol·K), and say where it would boil if it matched.',
      steps: [{ text: 'Entropy of vaporisation:', tex: '\\Delta S = \\frac{40\\,660}{373.15} = 109\\ \\mathrm{J/(mol\\,K)}' }, 'That is 24 % above Trouton\'s value: the liquid is more ordered than a simple liquid, so there is more disorder to gain.', { text: 'With 88 J/(mol·K) the same enthalpy would give', tex: 'T_b = \\frac{40\\,660}{88} = 462\\ \\mathrm{K} = 189\\ ^{\\circ}\\mathrm{C}' }],
      a: '109 J/(mol·K), 24 % above Trouton. An ordinary liquid with water\'s enthalpy would boil at 189 °C; the extra entropy pulls water back to 100 °C.' }
  ],
  quiz: [
    { q: 'Which of these hydrides shows the largest boiling-point excess over the trend of its own column?', choices: ['Methane', 'Ammonia', 'Hydrogen fluoride', 'Water'], a: 3, why: 'Water: about 180 K, against 121 K for hydrogen fluoride and 79 K for ammonia. Methane has no excess at all — it boils 30 K below its column\'s trend, because carbon makes no hydrogen bonds.' },
    { q: 'Methane\'s boiling point (−161.5 °C) is anomalously high for its column.', a: false, why: 'It is slightly lower than the trend of silane, germane and stannane predicts. The anomaly belongs to the molecules whose hydrogens sit on N, O or F.' },
    { q: 'Water follows the trend of H₂S, H₂Se and H₂Te and would boil near −80 °C. The measured boiling point is 100 °C. By how many kelvin does it miss?', answer: 180, unit: 'K', why: 'The difference is 100 − (−80) = 180 K (a difference in °C is the same as a difference in kelvin).' },
    { q: 'Ethanol (C₂H₆O) boils at 78 °C and dimethyl ether (also C₂H₆O) at −25 °C. The reason is', choices: ['ethanol is heavier', 'ethanol has an O–H that makes hydrogen bonds', 'dimethyl ether is a ring', 'ethanol has more electrons'], a: 1, why: 'The two have identical formulas and masses, so dispersion forces are the same. Ethanol\'s hydroxyl hydrogen can bond to a neighbour\'s oxygen; dimethyl ether has no hydrogen on oxygen to give.' },
    { q: 'Suppose water\'s hydrogen bonds were switched off but its mass and shape kept. At the temperature of the oceans (15 °C) at one atmosphere it would be', choices: ['a liquid, as now', 'a gas', 'ice', 'a liquid, but much thicker'], a: 1, why: 'The trend puts the boiling point near −80 °C, so water would be a gas everywhere on the Earth\'s surface except the poles in the dead of winter, and there would be no oceans, rain or rivers.' }
  ],
  applications: ['Refrigeration: ammonia (−33 °C) and water in absorption chillers work because their boiling and condensation temperatures are set by hydrogen bonding.', 'Choosing solvents and fuels: alcohols boil far above ethers and hydrocarbons of the same mass, which is why ethanol can be distilled out of water mixtures but dimethyl ether is a propellant gas.', 'Chemical safety: hydrogen sulfide, a gas at room temperature, escapes from sewers and swamps and poisons at low concentration, whereas water of the same shape stays in the pipe.', 'Drying and cooking: every kitchen and laundry relies on a liquid that stays put near 20 °C and leaves only when we heat it.'],
  history: 'The puzzle of the first members of the nitrogen, oxygen and fluorine columns was noticed in the nineteenth century and explained by Latimer and Rodebush at Berkeley in 1920, who proposed that a hydrogen atom could be shared between two electronegative atoms. Linus Pauling built the idea into his theory of the chemical bond in the 1930s.',
  sources: ['Latimer and Rodebush, "Polarity and ionization from the standpoint of the Lewis theory of valence", *Journal of the American Chemical Society* 42, 1419 (1920).', 'CRC *Handbook of Chemistry and Physics*, physical constants of inorganic compounds (boiling and melting points of the hydrides).', 'Eisenberg and Kauzmann, *The Structure and Properties of Water* (Oxford, 1969).', 'Atkins and de Paula, *Physical Chemistry*, the sections on intermolecular forces and on Trouton\'s rule.'],
  sim: 'mb-hydride-ladder'
},

/* ================================================================ 2 */
{
  id: 'latent-heat-of-vaporisation', parent: 'melting-and-boiling', title: 'Latent heat of vaporisation', level: 1,
  short: 'Turning a kilogram of water at 100 °C into steam at 100 °C takes 2,257 kJ (40.7 kJ/mol) — more than five times the heat that raised it from 0 to 100 °C, and the most of any common liquid. The heat goes into pulling hydrogen-bonded molecules apart, and it comes back when the steam condenses.',
  keywords: ['latent heat of vaporisation', 'enthalpy of vaporisation', '2257', '2442', '40.7 kJ/mol', 'steam', 'boiling', 'steam burn', 'sweat', 'heating curve', 'plateau', 'evaporation heat', 'heat of evaporation'],
  prereq: ['what-a-hydrogen-bond-is', 'the-boiling-point-anomaly', 'specific-heat-of-water'],
  related: ['melting-and-the-latent-heat-of-fusion', 'vapour-pressure-and-evaporation', 'evaporative-cooling', 'hurricanes-and-latent-heat', 'water-in-the-kitchen', 'physics:latent-heat', 'chemistry:calorimetry'],
  body: `
Switch on a 2-kilowatt kettle holding a litre and a half of water at 20 °C. Four minutes later it boils. If it did not switch itself off, the temperature would then stand still at 100 °C for twenty-eight more minutes while the water turned to steam and left. Heating the water by 80 degrees cost 500 kilojoules; turning it to vapour costs 3,400. That second number, **2,257 kJ for every kilogram**, is the latent heat of vaporisation, and it is the largest of any common liquid.

### What the number is
The word *latent* means hidden: the heat goes in and the thermometer does not move. It is spent not on making molecules move faster but on pulling them out of the liquid against the attraction of their neighbours. The heat that makes a kilogram of liquid into a kilogram of vapour *at the same temperature* is the latent heat of vaporisation. Per mole it is the **enthalpy of vaporisation**, 40.7 kJ/mol for water at 100 °C. About 3.1 kJ of that is the work of pushing back the atmosphere as a litre of water swells to 1,700 litres of steam; the other 37.6 kJ/mol is internal energy, almost all of it the hydrogen bonds. At 100 °C a molecule still holds about three bonds, each shared by two molecules and worth about 20 kJ/mol, which is 30 kJ/mol, and the dispersion attraction supplies the rest.

### How it compares
| Liquid | Boils at | Latent heat, kJ/kg | kJ/mol |
|---|---|---|---|
| **water** | 100 °C | **2,257** | **40.7** |
| ammonia | −33 °C | 1,370 | 23.3 |
| methanol | 65 °C | 1,100 | 35.2 |
| ethanol | 78 °C | 841 | 38.7 |
| acetone | 56 °C | 518 | 30.1 |
| benzene | 80 °C | 394 | 30.8 |
| hexane | 69 °C | 335 | 28.9 |
| mercury | 357 °C | 295 | 59.2 |

Per kilogram water is ahead of everything common: 2.7 times ethanol, nearly seven times hexane. Per *mole* it is not the champion — mercury and glycerol need more — but a mole of water is only 18 grams. Light molecules with strong bonds make the best latent-heat store.

### It falls as the water warms
The latent heat is 2,501 kJ/kg at 0 °C, about 2,442 at 25 °C, 2,411 at body temperature and 2,257 at 100 °C: it falls by 2.4 kJ/kg for every degree. Warmer water has fewer intact bonds to break, and at the critical point (374 °C), where liquid and vapour become the same, the latent heat falls to zero. The 2,442 kJ/kg at skin temperature is the figure for sweat.

### What follows
- **Sweat cools.** A litre of sweat that evaporates takes about 2.4 MJ from the body, enough to cool a 70-kilogram person by 10 K if it was not replaced. At 1 litre an hour a hard-working body sheds 0.67 kW this way.
- **Steam burns.** One gram of steam at 100 °C condensing on skin gives up 2,257 J and then cools as water to skin temperature, 2,540 J in all; a gram of boiling water gives up only 280 J. Steam delivers nine times the heat.
- **Weather carries heat.** The sun's heat that evaporates a kilogram of sea water is released as 2.5 MJ over a town when it condenses as rain: the engine of storms ([[hurricanes-and-latent-heat]]).
- **Distillation is expensive.** Boiling off a litre of sea water takes 0.63 kWh; desalination plants recover most of it by passing the heat from one stage to the next.

### Why not just heat?
Compare the two kinds of heat on the heating curve: the slope (sensible heat, 4.19 kJ/kg per kelvin) lifts the temperature; the plateau at 100 °C (latent heat) turns the liquid into a gas. The plateau is more than five times longer than the slope from 0 to 100 °C. The ratio of the two bills is 2,257/419 = 5.4, and it is the reason a kettle left on keeps boiling long after it has "got hot".

> [!key] Boiling water to steam costs 2,257 kJ/kg at 100 °C — 5.4 times the heat that brought it from freezing — because every molecule must leave about three hydrogen bonds behind. The heat is returned whenever vapour condenses: cooling a body with sweat, scalding it with steam, and driving the weather.`,
  ideas: ['Latent heat is heat that changes the state, not the temperature: 2,257 kJ/kg (40.7 kJ/mol) to turn water at 100 °C into steam at 100 °C.', 'It is the largest of any common liquid per kilogram because water has strong hydrogen bonds and a small molar mass of 18 g/mol.', 'It falls with temperature, 2,501 kJ/kg at 0 °C to 2,257 at 100 °C and zero at the critical point, since warmer water has fewer bonds left to break.', 'The heat returns on condensation, which is why steam burns nine times as hard as boiling water and why storms are powered by it.'],
  pitfalls: ['"Boiling water gets hotter if you turn up the heat" — At one atmosphere the water stays at 100 °C; the extra heat only boils it away faster, because the temperature is fixed by the pressure.', '"Latent heat is heat that is lost" — It is stored, as energy of separation, and returned in full on condensation; nothing is lost.', '"Steam is hotter than boiling water" — At 100 °C they are equally hot. Steam burns worse because condensing deposits 2,257 kJ/kg on the skin as well as the sensible heat.'],
  terms: [
    { term: 'Latent heat of vaporisation', also: ['enthalpy of vaporisation', 'heat of evaporation', 'L_v', 'ΔH_vap'], def: 'The heat needed to turn a unit mass of liquid into vapour at constant temperature: 2,257 kJ/kg (40.7 kJ/mol) for water at 100 °C, 2,442 kJ/kg at 25 °C — the highest of any common liquid per kilogram.' },
    { term: 'Latent heat', also: ['heat of transformation'], def: 'Heat absorbed or released by a substance in changing its state at constant temperature. "Latent" means hidden: the thermometer does not move while it flows.' },
    { term: 'Sensible heat', def: 'Heat that changes the temperature of a substance without changing its state, as measured by a thermometer: the mass times the specific heat times the temperature change.' },
    { term: 'Condensation', also: ['liquefaction of a vapour'], def: 'The change of a vapour to a liquid. It returns the latent heat of vaporisation to the surroundings: 2,257 kJ for every kilogram of steam condensed at 100 °C.' },
    { term: 'Heating curve', also: ['warming curve'], def: 'A graph of temperature against heat added at constant power. It rises in sloped sections where one phase warms and stands still in plateaus where the phase changes: melting at 0 °C, boiling at 100 °C.' }
  ],
  formulas: [
    { name: 'Heat to vaporise', expr: 'Q = m*L', tex: 'Q = m\\,L_v',
      vars: { Q: { name: 'heat', q: 'energy', unit: 'MJ' }, m: { name: 'mass vaporised', q: 'mass', unit: 'kg', value: 1.5, tex: 'm' }, L: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2257, tex: 'L_v', hint: '2,257 kJ/kg at 100 °C, 2,442 at 25 °C, 2,501 at 0 °C.' } },
      solveFor: 'Q', note: 'The temperature does not change while this heat flows; at one atmosphere the water stays at 100 °C.',
      stories: { Q: 'A kettle boils away {m} of water at 100 °C. How much heat does that take?', m: '{Q} of heat boils water at 100 °C. How much water turns to steam?' } },
    { name: 'Latent heat at another temperature', expr: 'L = Lb + k*(Tb - T)', tex: 'L_T = L_b + k\\,(T_b - T)',
      vars: { L: { name: 'latent heat at T', q: 'latent', unit: 'kJ/kg', tex: 'L_T' }, Lb: { name: 'latent heat at the boiling point', q: 'latent', unit: 'kJ/kg', value: 2257, fixed: true, tex: 'L_b' }, k: { name: 'rate of fall with temperature', q: 'specificheat', unit: 'J/(kg·K)', value: 2420, tex: 'k', hint: 'The latent heat falls by about 2.4 kJ/kg for each kelvin of warming, between 0 and 100 °C.' }, Tb: { name: 'boiling point', q: 'temperature', unit: '°C', value: 100, fixed: true, tex: 'T_b' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0, max: 100 } },
      solveFor: 'L', note: 'A straight-line fit good to 0.2 % between 0 and 100 °C; it fails near the critical point, where L falls steeply to zero.',
      stories: { L: 'Water evaporates at {T}. What is its latent heat of vaporisation?', T: 'The latent heat of vaporisation of water is {L}. At what temperature is the water?' } },
    { name: 'Cooling by sweat', expr: 'dT = m*L/(M*c)', tex: '\\Delta T = \\frac{m\\,L_v}{M\\,c}',
      vars: { dT: { name: 'temperature drop of the body', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, m: { name: 'sweat evaporated', q: 'mass', unit: 'g', value: 100, tex: 'm' }, L: { name: 'latent heat at skin temperature', q: 'latent', unit: 'kJ/kg', value: 2420, tex: 'L_v' }, M: { name: 'mass of the body', q: 'mass', unit: 'kg', value: 70, tex: 'M' }, c: { name: 'specific heat of the body', q: 'specificheat', unit: 'J/(kg·K)', value: 3470, tex: 'c', hint: 'About 3.5 kJ/(kg·K) for a human body, lower than water\'s 4.18 because of fat, bone and protein.' } },
      solveFor: 'dT', note: 'The fall the body would suffer if the heat were not being replaced by metabolism and by blood from the core; it is the size of the cooling, not a real fall.',
      stories: { dT: 'A {M} person evaporates {m} of sweat. By how much would the heat removed cool the body if nothing replaced it?' } },
    { name: 'Heat delivered by condensing steam', expr: 'Q = m*(L + c*(Ts - Tf))', tex: 'Q = m\\,\\left[L_v + c_w\\,(T_s - T_f)\\right]',
      vars: { Q: { name: 'heat given to the skin', q: 'energy', unit: 'kJ' }, m: { name: 'mass of steam', q: 'mass', unit: 'g', value: 1, tex: 'm' }, L: { name: 'latent heat', q: 'latent', unit: 'kJ/kg', value: 2257, tex: 'L_v' }, c: { const: 'cW' }, Ts: { name: 'steam temperature', q: 'temperature', unit: '°C', value: 100, tex: 'T_s' }, Tf: { name: 'final temperature of the condensed water', q: 'temperature', unit: '°C', value: 33, tex: 'T_f', hint: 'Skin surface temperature, about 33 °C.' } },
      solveFor: 'Q', note: 'Set the latent heat to 0 to see what the same mass of boiling water would do: about one ninth of the steam.',
      stories: { Q: '{m} of steam at {Ts} condenses on skin and cools to {Tf}. How much heat does it give up?' } }
  ],
  examples: [
    { title: 'The kettle that boils dry', q: 'A 2 kW kettle holds 1.5 L (1.5 kg) of water at 20 °C and nothing switches it off. How long to reach 100 °C, and how long then to boil it all away?',
      steps: [{ text: 'Heating:', tex: 'Q_1 = 1.5 \\times 4.186 \\times 80 = 502\\ \\mathrm{kJ}, \\quad t_1 = \\frac{502}{2} = 251\\ \\mathrm{s}' }, { text: 'Vaporising:', tex: 'Q_2 = 1.5 \\times 2257 = 3\\,386\\ \\mathrm{kJ}, \\quad t_2 = \\frac{3386}{2} = 1\\,693\\ \\mathrm{s}' }, 'The second stage takes 6.7 times as long as the first: 28 minutes, during which the temperature stays at 100 °C.'],
      a: 'About four minutes to reach 100 °C, and 28 minutes more to boil dry (ignoring losses to the room, which make both a little longer).' },
    { title: 'Why steam scalds', q: 'One gram of steam at 100 °C and one gram of boiling water both land on skin at 33 °C. Compare the heat each gives up.',
      steps: [{ text: 'Boiling water cools 67 K:', tex: 'Q_w = 1\\times 4.19 \\times 67 = 281\\ \\mathrm{J}' }, { text: 'Steam first condenses, then cools:', tex: 'Q_s = 2257 + 281 = 2\\,538\\ \\mathrm{J}' }, 'Ratio: $2538/281 = 9.0$.'],
      a: 'Steam gives up 2,540 J against 281 J — nine times as much, almost all of it the latent heat.' }
  ],
  quiz: [
    { q: 'Which takes more heat: warming a kilogram of water from 0 to 100 °C, or turning it to steam once it is at 100 °C?', choices: ['Warming it, because the temperature range is bigger', 'They take the same', 'Boiling it, about five times more', 'Boiling it, about fifty times more'], a: 2, why: 'Warming takes 419 kJ; vaporising takes 2,257 kJ, a ratio of 5.4. The plateau on the heating curve is that much longer than the slope.' },
    { q: 'The latent heat of vaporisation of water is larger at 25 °C than at 100 °C.', a: true, why: '2,442 kJ/kg against 2,257. At 25 °C a molecule holds about 3.7 intact bonds against 3.1 at 100 °C, so more must be broken; it falls to zero at the critical point.' },
    { q: 'How much heat is needed to evaporate 100 g of sweat on skin at 35 °C, where the latent heat is about 2,417 kJ/kg?', answer: 242, unit: 'kJ', why: 'Q = 0.1 kg × 2,417 kJ/kg = 242 kJ — enough to cool a 70 kg body by 1 K, since its heat capacity is about 243 kJ/K.' },
    { q: 'Steam at 100 °C scalds far worse than boiling water at 100 °C because', choices: ['steam is hotter', 'condensing releases the latent heat on the skin', 'steam moves faster', 'steam is denser than water'], a: 1, why: 'Both are at 100 °C. Condensation hands over 2,257 kJ/kg on top of the sensible heat, nine times the heat in all.' },
    { q: 'Per mole, mercury (59 kJ/mol) has a larger enthalpy of vaporisation than water (40.7), yet water has the larger latent heat per kilogram. This is because', choices: ['mercury is a metal', 'a mole of water weighs only 18 g while a mole of mercury weighs 201 g', 'mercury boils lower', 'water has a lower density'], a: 1, why: 'Per kilogram you divide the molar figure by the molar mass: 40.7/0.018 = 2,260 kJ/kg for water and 59/0.2 = 295 kJ/kg for mercury. Light molecules with strong bonds win.' }
  ],
  applications: ['Cooking: boiling vegetables, steaming and pressure cooking all use steam as a carrier of 2.26 MJ/kg of heat, delivered where it condenses on cold food.', 'Power stations: a coal, gas or nuclear plant boils water to run a turbine, then recovers the latent heat in the condenser; the condenser\'s cooling water carries away more energy than the electricity produced.', 'Sweating, panting and swamp coolers: evaporation as the body\'s and the building\'s air conditioner ([[evaporative-cooling]]).', 'Fire fighting: water on a fire absorbs 2.26 MJ/kg of latent heat as well as the sensible heat, and the steam smothers the flames.', 'Distillation and desalination: the energy bill of making fresh water from the sea is largely this number.'],
  history: 'Joseph Black at Glasgow noticed in the 1760s that a kettle took far longer to boil away than to reach the boil, and named the hidden heat "latent". James Watt, who was working for the university, used the observation to improve the steam engine by condensing the steam in a separate vessel, so as not to waste the latent heat warming the cylinder.',
  sources: ['Eisenberg and Kauzmann, *The Structure and Properties of Water*, on the heat of vaporisation and the structure of the liquid.', 'IAPWS release on the thermodynamic properties of ordinary water substance (latent heat along the saturation line); CRC *Handbook of Chemistry and Physics*, the table of enthalpies of vaporisation.', 'Atkins and de Paula, *Physical Chemistry*, the sections on enthalpies of vaporisation and Trouton\'s rule.'],
  sim: 'mb-heating-curve'
},

/* ================================================================ 3 */
{
  id: 'melting-and-the-latent-heat-of-fusion', parent: 'melting-and-boiling', title: 'Melting and the latent heat of fusion', level: 1,
  short: 'Melting a kilogram of ice takes 334 kJ (6.01 kJ/mol) — the heat that would warm the same water by 80 kelvin, and one of the highest fusion heats of any common liquid. Yet it is only an eighth of the energy that holds the ice together: melting loosens the net, boiling dismantles it.',
  keywords: ['latent heat of fusion', 'enthalpy of fusion', '334 kJ/kg', '6.01 kJ/mol', 'melting ice', 'ice in a drink', 'freezing', 'heat of fusion', 'sublimation', 'melting point', 'ice cools'],
  prereq: ['what-a-hydrogen-bond-is', 'latent-heat-of-vaporisation', 'why-ice-floats'],
  related: ['the-phase-diagram', 'the-structure-of-liquid-water', 'cooperativity', 'icebergs-and-sea-ice', 'supercooling-and-nucleation', 'physics:latent-heat', 'chemistry:phase-diagrams'],
  body: `
A glass of cola at 25 °C holds a quarter of a litre. Drop in three ice cubes of 20 grams each and the drink falls to about 5 °C. Where did the cold come from? Not from the ice getting warmer; most of it came from the ice *melting*. Melting 60 grams of ice at 0 °C takes 20 kJ, and that heat has to come from the drink. The **latent heat of fusion** of water is **333.55 kJ/kg**, or 6.01 kJ/mol: to melt a kilogram of ice takes as much heat as it takes to warm the same mass of water by 80 degrees.

### The number in company
| Substance | Melts at | Fusion heat, kJ/kg | kJ/mol |
|---|---|---|---|
| aluminium | 660 °C | 397 | 10.7 |
| **water** | **0 °C** | **334** | **6.01** |
| ammonia | −78 °C | 332 | 5.66 |
| iron | 1,538 °C | 247 | 13.8 |
| ethanol | −114 °C | 108 | 4.9 |
| lead | 327 °C | 23 | 4.8 |
| mercury | −39 °C | 11 | 2.3 |

Per kilogram only a few metals come close, and water is the most of any common liquid. Per mole it is middling. The sheer size comes again from water's low molar mass and strong bonds.

### How much of the net is undone?
Melting is gentle compared with boiling. Take the energy to remove a molecule completely from ice, the heat of **sublimation**: 2,834 kJ/kg, or 51.1 kJ/mol. Melting takes 6.01 of it, **12 %**; the rest, 45.1 kJ/mol at 0 °C, is the vaporisation of the liquid that has formed. (Add them: 6.01 + 45.05 = 51.06, the same energy by whichever path, which is Hess's law of 1840.) Calorimetry says melting spends an eighth of the energy of cohesion. Counting bonds gives a different-looking answer, because it depends on what one calls a bond: every molecule in ice holds exactly four neighbours, and on a geometric count the liquid at 0 °C still holds about 3.9 of four (3.7 at room temperature), while some spectroscopic readings give far fewer. The energies are not in doubt: the net survives melting, bent and disordered.

What melting spends is mostly *order* rather than *bonds*. The tetrahedral lattice with its channels is replaced by a jumbled network in which bonds are bent and stretched, no longer along perfect straight lines, and neighbours crowd into the gaps (the 9 % increase in density, [[why-ice-floats]]). Its entropy of fusion is $6\\,010/273.15 = 22$ J/(mol·K), one of the larger values among small molecules.

### The same heat, two ways
Because the numbers are so large, ice is an astonishingly efficient coolant. Per kilogram, **ice at 0 °C absorbs 334 kJ as it melts, and the water it makes absorbs 4.19 kJ for every further degree**: a kilogram of ice warming to 20 °C takes up 418 kJ, four fifths of it in the melting. A kilogram of cold water at 0 °C only takes 84 kJ to reach the same 20 °C. That is why ice, not cold water, goes into the cooler.

### Where it matters
- **A tenth of a metre of Arctic ice.** A heat flow of 1 W/m² applied for a year melts $3.16\\times10^7/3.34\\times10^5 = 95$ kg of ice, a layer 10 cm thick.
- **Frost protection.** When water freezes it *gives back* 334 kJ/kg; orchard growers spray their blossoms with water on frosty nights so that the film of freezing water keeps the buds at 0 °C instead of letting them fall to −3 °C.
- **Winter's brake.** The same heat is why lakes freeze slowly and snow melts slowly: a snowpack that must absorb 334 kJ/kg for every kilogram melts over weeks, not hours ([[icebergs-and-sea-ice]]).
- **Ice storage.** Some buildings freeze water at night with cheap electricity and melt it by day to cool the building.

> [!key] Melting a kilogram of ice takes 334 kJ — enough to warm the water formed by 80 K — but only an eighth of the energy that holds the ice together. Melting loosens the lattice, boiling unties it, and the 6.01 kJ/mol and 40.7 kJ/mol are the two bills.`,
  ideas: ['The latent heat of fusion of ice is 333.55 kJ/kg (6.01 kJ/mol), the heat that would warm the water formed by 80 K.', 'It is the highest of any common liquid per kilogram, and is why ice cools drinks so effectively.', 'Melting is 12 % of the energy of sublimation (51.1 kJ/mol): the lattice is loosened and disordered, but most of the hydrogen bonds survive.', 'The same heat is released on freezing, which protects crops and slows the freezing of lakes.'],
  pitfalls: ['"Ice cools a drink because it is cold" — Ice at 0 °C is only 25 K colder than the drink: warming 60 g of it by 25 K would absorb 6 kJ, melting it absorbs 20 kJ. Most of the cooling is latent heat.', '"Melting breaks all the hydrogen bonds" — It spends about an eighth of the cohesive energy: ice at 0 °C and water at 0 °C differ in order and in density, but both are mostly hydrogen-bonded.', '"Nothing happens while ice melts, since the temperature stays at 0 °C" — The heat goes into reorganising the lattice: 334 kJ for every kilogram, as much as it takes to warm the water that forms by 80 K.'],
  terms: [
    { term: 'Latent heat of fusion', also: ['enthalpy of fusion', 'heat of melting', 'L_f', 'ΔH_fus'], def: 'The heat needed to turn a unit mass of solid into liquid at its melting point, with no change of temperature: 333.55 kJ/kg (6.01 kJ/mol) for ice at 0 °C. The same heat is released when the liquid freezes.' },
    { term: 'Melting point', also: ['freezing point', 'fusion point'], def: 'The temperature at which the solid and the liquid of a pure substance are in equilibrium at a given pressure. For water at one atmosphere it is 0 °C, and it falls by 0.0075 K for each atmosphere of added pressure.' },
    { term: 'Sublimation', def: 'The change of a solid directly to a vapour without passing through the liquid. For ice it takes 2,834 kJ/kg (51.1 kJ/mol): the total cohesive energy of the crystal.' },
    { term: 'Hess\'s law', also: ['additivity of enthalpies'], def: 'The total heat of a change of state is the same whichever path leads to it. For water, melting plus vaporising at 0 °C equals subliming: 6.01 + 45.05 = 51.06 kJ/mol.' }
  ],
  formulas: [
    { name: 'Heat to melt', expr: 'Q = m*Lf', tex: 'Q = m\\,L_f',
      vars: { Q: { name: 'heat absorbed', q: 'energy', unit: 'kJ' }, m: { name: 'mass of ice melted', q: 'mass', unit: 'kg', value: 1, tex: 'm' }, Lf: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55, tex: 'L_f', hint: '333.55 kJ/kg, or 80 cal/g.' } },
      solveFor: 'Q', note: 'The ice is at its melting point of 0 °C; the temperature does not change until it has all melted.',
      stories: { Q: 'A snowpack melts {m} of ice. How much heat does that absorb?', m: '{Q} of heat melts how much ice at 0 °C?' } },
    { name: 'Ice in a drink', expr: 'mw*c*(T0 - Tf) = mi*(Lf + c*(Tf - Tm))', tex: 'm_w\\,c_w\\,(T_0 - T_f) = m_i\\,[L_f + c_w\\,(T_f - T_m)]',
      vars: { mw: { name: 'mass of the drink', q: 'mass', unit: 'g', value: 250, tex: 'm_w' }, c: { const: 'cW' }, T0: { name: 'starting temperature of the drink', q: 'temperature', unit: '°C', value: 25, tex: 'T_0' }, Tf: { name: 'final temperature', q: 'temperature', unit: '°C', value: 4.7, min: 0, max: 100, tex: 'T_f' }, mi: { name: 'mass of ice', q: 'mass', unit: 'g', value: 60, tex: 'm_i' }, Lf: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55, fixed: true, tex: 'L_f' }, Tm: { name: 'temperature of the ice', q: 'temperature', unit: '°C', value: 0, fixed: true, tex: 'T_m' } },
      solveFor: 'Tf', note: 'Valid while some warm water remains, that is, while the ice all melts: the drink must hold enough heat. Ignores the glass and the room.',
      stories: { Tf: 'A {mw} drink at {T0} receives {mi} of ice at {Tm}. What is the temperature when the ice has melted?', mi: 'A {mw} drink at {T0} is cooled to {Tf} by ice at {Tm}. How much ice?' } },
    { name: 'Fusion as a share of the cohesive energy', expr: 'f = Hf/Hs', tex: 'f = \\frac{\\Delta H_{fus}}{\\Delta H_{sub}}',
      vars: { f: { name: 'share of the cohesive energy spent in melting', q: 'ratio', unit: '%', tex: 'f' }, Hf: { name: 'enthalpy of fusion', q: 'molarenergy', unit: 'kJ/mol', value: 6.01, tex: '\\Delta H_{fus}' }, Hs: { name: 'enthalpy of sublimation', q: 'molarenergy', unit: 'kJ/mol', value: 51.06, tex: '\\Delta H_{sub}', hint: 'The energy to take a molecule out of ice entirely, 2,834 kJ/kg at 0 °C.' } },
      solveFor: 'f', note: 'About 12 % for water. For most substances the share is near 10 %, so water is not unusual here: what is unusual is the size of the sublimation heat itself.',
      stories: { f: 'Ice needs {Hf} to melt and {Hs} to sublime. What share is melting?' } },
    { name: 'Ice melted by a heat flow', expr: 'h = P*t/(rho*Lf)', tex: 'h = \\frac{P\\,t}{\\rho\\,L_f}',
      vars: { h: { name: 'thickness melted per square metre', q: 'length', unit: 'cm' }, P: { name: 'heat flux', q: 'intensity', unit: 'W/m²', value: 1, tex: 'P', hint: 'Sunlight on a clear summer day delivers hundreds of W/m²; a sea-ice surface absorbs perhaps a tenth of that on average.' }, t: { name: 'time', q: 'time', unit: 'day', value: 365, tex: 't' }, rho: { name: 'density of ice', q: 'density', unit: 'kg/m³', value: 916.7, tex: '\\rho' }, Lf: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55, fixed: true, tex: 'L_f' } },
      solveFor: 'h', note: 'All the heat goes into melting ice that is already at 0 °C; ice colder than that must first be warmed.',
      stories: { h: 'A heat flux of {P} reaches the ice for {t}. How thick a layer melts?' } }
  ],
  examples: [
    { title: 'Three ice cubes in a cola', q: 'A quarter litre (250 g) of cola at 25 °C receives three ice cubes of 20 g, at 0 °C. What is the temperature when all have melted? Take the cola\'s specific heat as water\'s and neglect the glass.',
      steps: [{ text: 'Heat the cola can give up in falling to 0 °C:', tex: '0.25 \\times 4.186 \\times 25 = 26.2\\ \\mathrm{kJ}' }, { text: 'Heat needed to melt 60 g:', tex: '0.06 \\times 333.55 = 20.0\\ \\mathrm{kJ}' }, 'Left over: 6.2 kJ, which warms all the 310 g of water: $6.2/(0.31 \\times 4.186) = 4.8$ K above 0 °C.'],
      a: 'About 5 °C. Four fifths of the cooling was done by melting, not by warming the ice.' },
    { title: 'Ice or cold water?', q: 'You have 1 kg of ice at 0 °C and 1 kg of water at 0 °C to put in a cooler. How much more heat can the ice absorb before reaching 10 °C?',
      steps: ['The water absorbs $4.19 \\times 10 = 41.9$ kJ in warming to 10 °C.', 'The ice first melts, absorbing 333.55 kJ, then warms to 10 °C like the water: $333.55 + 41.9 = 375$ kJ.', 'Ratio $375/41.9 = 9.0$.'],
      a: 'Nine times as much: the ice absorbs 375 kJ against 42 kJ. Latent heat does the work.' }
  ],
  quiz: [
    { q: 'One kilogram of ice at 0 °C is added to one kilogram of water at 80 °C. Ignoring the container, the result is', choices: ['2 kg of water at 40 °C', '2 kg of water at about 0 °C', '2 kg of water at 20 °C', '1 kg of ice and 1 kg of water at 0 °C'], a: 1, why: 'The water\'s 80 K × 4.19 = 335 kJ is almost exactly the 333.55 kJ needed to melt the ice, so everything ends as water at 0 °C. The average of the two temperatures, 40 °C, would be right only if ice had no latent heat.' },
    { q: 'Melting takes a larger fraction of the energy that holds ice together than boiling does.', a: false, why: 'Melting takes 6.01 of the 51.1 kJ/mol (12 %); boiling the liquid takes 45 kJ/mol at 0 °C, 88 %. Melting loosens the lattice, boiling pulls the molecules out of the net.' },
    { q: 'How much heat in kilojoules does it take to melt 0.5 kg of ice at 0 °C?', answer: 167, unit: 'kJ', why: 'Q = 0.5 × 333.55 = 166.8 kJ. At 2 kW a heater would need 83 seconds.' },
    { q: 'Orchard growers spray water on blossoms when a frost is forecast. This helps because', choices: ['water is a good insulator', 'freezing water gives up 334 kJ/kg and keeps the bud near 0 °C', 'the spray warms the air to 5 °C', 'ice reflects the cold'], a: 1, why: 'As long as water is turning to ice on the bud, the latent heat released holds the surface at 0 °C. Dry buds fall below it and freeze inside.' },
    { q: 'Which has a larger latent heat of fusion per kilogram?', choices: ['Water', 'Iron', 'Ethanol', 'Mercury'], a: 0, why: 'Water 334 kJ/kg, iron 247, ethanol 108, mercury 11. Small light molecules with strong bonds beat heavy ones even when the latter are hot enough to be molten.' }
  ],
  applications: ['Coolers, ice packs and ice baths: melting ice holds a temperature at 0 °C for hours while absorbing 334 kJ/kg.', 'Frost protection by sprinkling, and the way a wet bud survives a few degrees of frost.', 'Snowmelt and glacier runoff: the rate at which a snowpack melts is set by the heat reaching it divided by 334 kJ/kg, which governs spring floods and summer river flow.', 'Thermal storage: ice tanks that freeze at night and cool buildings by day, and phase-change materials designed to copy water\'s latent heat.'],
  history: 'Black measured the latent heat of fusion in the 1760s by leaving equal masses of ice and water in a warm room and noting how long each took to rise a few degrees: the ice took many times as long. The unit "calorie per gram" survives in 80 cal/g for ice.',
  sources: ['CRC *Handbook of Chemistry and Physics*, enthalpies of fusion and sublimation (water 6.01 and 51.1 kJ/mol).', 'Petrenko and Whitworth, *Physics of Ice* (Oxford, 1999), on the thermodynamic properties of ice Ih.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, on the melting of ice and the structure of the liquid.'],
  sim: [{ id: 'mb-bond-ledger' }, { id: 'mb-heating-curve', params: { focus: 'melting' } }]
},

/* ================================================================ 4 */
{
  id: 'vapour-pressure-and-evaporation', parent: 'melting-and-boiling', title: 'Vapour pressure and evaporation', level: 2,
  short: 'Water at any temperature fills the space above it with vapour until the vapour pushes back as hard as it is leaving: 2.34 kPa at 20 °C, 101.4 kPa at 100 °C. Boiling is the moment that pressure matches the air\'s, and the rise is so steep — about 6 % per kelvin at room temperature — that every ten degrees of warmth roughly doubles it.',
  keywords: ['vapour pressure', 'saturation vapour pressure', 'evaporation', 'Clausius-Clapeyron', 'Antoine equation', 'wet clothes', 'drying', 'wet bulb', '7 percent per kelvin', 'dynamic equilibrium', 'why evaporation cools'],
  prereq: ['latent-heat-of-vaporisation', 'what-a-hydrogen-bond-is', 'chemistry:vapor-pressure'],
  related: ['boiling-at-altitude', 'the-phase-diagram', 'evaporative-cooling', 'humidity-and-dew-point', 'water-vapour-greenhouse', 'cavitation-and-embolism', 'chemistry:clausius-clapeyron', 'hydraulics:vapour-pressure', 'physics:latent-heat'],
  body: `
Hang a wet shirt on a line on a cold, windy March day and it dries. Nothing is boiling; the water is at 10 °C, ninety degrees below its boiling point. It leaves anyway, molecule by molecule, because even a cold liquid has molecules at its surface moving fast enough to break their hydrogen bonds and escape, and nothing stops them going. Evaporation is boiling's quiet cousin, and the quantity that governs both is the **vapour pressure**.

### What vapour pressure is
Put water in a closed dish and wait. Molecules leave the surface; some of those in the vapour hit it again and stay. At first more leave than return, so the vapour thickens. It stops thickening when the traffic is equal both ways, and then the vapour presses on its surroundings with a fixed pressure: the **saturation vapour pressure**. It depends on the temperature of the liquid and on nothing else — not on how much water there is, not on the size of the dish, not on whether other gases are present.

| Temperature | Vapour pressure | Note |
|---|---|---|
| −20 °C (over ice) | 103 Pa | frost forms below this |
| 0.01 °C | 611.657 Pa | triple point |
| 20 °C | 2.34 kPa | a room: 2.3 % of an atmosphere |
| 37 °C | 6.28 kPa | body temperature; lung air is saturated |
| 60 °C | 19.9 kPa | |
| 80 °C | 47.4 kPa | |
| 100 °C | 101.4 kPa | equals the atmosphere: boiling |
| 150 °C | 476 kPa | |
| 200 °C | 1.55 MPa | |
| 373.9 °C | 22.06 MPa | the critical point |

### Evaporation and boiling
Evaporation goes on at the surface at any temperature. Boiling is different: it happens when the vapour pressure equals the pressure outside, because only then can a bubble of vapour form inside the liquid and not be crushed. At 100 °C the vapour pressure reaches 101.4 kPa, about one atmosphere; that temperature is the **normal boiling point**, and with a different outside pressure the boiling point moves ([[boiling-at-altitude]]). Below the boiling point nothing stops evaporation from the surface, but the rate depends on how far the vapour in the air above is from saturation — roughly on $p_{sat}(T_{surface}) - p_{vapour}$. A wind that sweeps vapour away keeps that gap open; at 100 % relative humidity there is no net evaporation at all.

### Why evaporation cools
The molecules that escape are the fastest, and each carries off the latent heat — about 2.4 MJ/kg at room temperature. What remains is cooler. A wet surface in unsaturated air settles at the **wet-bulb temperature**, below the air's: at 30 °C and 50 % humidity a wet cloth falls to 22.3 °C, 7.7 K below the air, and at 20 °C and 30 % humidity to 10.8 °C. That is why wet clothes feel cold, why a breeze chills a swimmer and why sweat is a cooling system that works best in dry air ([[evaporative-cooling]], [[humidity-and-dew-point]]).

### The steep curve and the 6 % rule
The vapour pressure rises 166-fold between the triple point and the boiling point. Clausius and Clapeyron showed why: the fractional rise per kelvin is

$$\\frac{1}{p}\\frac{dp}{dT} = \\frac{L\\,M}{R\\,T^{2}}$$

which is 7.3 % per kelvin at 0 °C, 6.2 % at 20 °C and 3.5 % at 100 °C. The pressure doubles every 9.5 K near freezing and every 11.6 K at 25 °C. The same arithmetic runs the climate: air that is a degree warmer can hold roughly 7 % more water vapour, and a warming ocean evaporates faster ([[water-vapour-greenhouse]]).

A compact fit that engineers use is the **Antoine equation**, $\\log_{10} p = A - B/(C + T)$. For water between 1 and 100 °C, with $p$ in mmHg and $T$ in °C, $A = 8.07131$, $B = 1730.63$, $C = 233.426$; it reproduces the true curve to within 1 %.

### Why water is slow to evaporate
Hydrogen bonds keep water in. At 20 °C ethanol, a molecule of similar size with one hydrogen bond per molecule instead of four, has a vapour pressure about 2.5 times water's, and acetone, with none, about ten times. That is why a puddle lasts hours and a spill of acetone seconds, and why a drop of water on a hot plate lingers.

> [!key] A liquid always fills the space above it with vapour until the vapour pushes back as hard as it is leaving: at 20 °C that is 2.34 kPa, at 100 °C a full atmosphere. The pressure climbs about 6 % per kelvin, so ten degrees double it, and every molecule that escapes takes 2.4 MJ/kg of heat with it.`,
  ideas: ['The vapour pressure is the pressure of the vapour in equilibrium with the liquid; it depends on temperature alone: 2.34 kPa at 20 °C, 101.4 kPa at 100 °C.', 'Boiling is the temperature at which the vapour pressure equals the outside pressure; evaporation goes on at the surface at every temperature, at a rate set by the gap between the saturation pressure and the vapour already in the air.', 'Evaporation cools because the escaping molecules take the latent heat with them; a wet surface falls to the wet-bulb temperature, 22.3 °C in air at 30 °C and 50 % humidity.', 'The vapour pressure grows by about 7 % per kelvin near freezing and 6 % at room temperature, doubling every 10–12 K; Clausius–Clapeyron gives the rate as $LM/(RT^2)$.'],
  pitfalls: ['"Water only evaporates when it is heated" — It evaporates at every temperature, at a rate that depends on the vapour pressure at the surface and on how dry the air is; it is the net outward flow that is small, not zero.', '"Air holds water like a sponge" — The vapour pressure at a given temperature is the same in a vacuum: the air is only a crowd that slows the vapour\'s escape. Humid air does not dissolve the water; it already contains vapour at a pressure near saturation.', '"A big puddle has a higher vapour pressure than a drop" — The vapour pressure is the same for a drop and for a lake at the same temperature; the puddle loses more water in total only because it has more surface.'],
  terms: [
    { term: 'Vapour pressure', also: ['saturation vapour pressure', 'equilibrium vapour pressure', 'p_sat'], def: 'The pressure of the vapour in equilibrium with its liquid (or solid) at a given temperature. For water 611.657 Pa at 0.01 °C, 2.34 kPa at 20 °C and 101.4 kPa at 100 °C.' },
    { term: 'Evaporation', def: 'The escape of molecules from the surface of a liquid into a vapour below the boiling point. It happens at every temperature, and cools the liquid because the fastest molecules leave.' },
    { term: 'Clausius–Clapeyron equation', also: ['Clapeyron equation for vapour', 'CC equation'], def: 'The relation $d\\ln p/dT = L M/(RT^2)$ between the slope of the vapour-pressure curve and the latent heat; with L roughly constant it gives $\\ln(p_2/p_1) = (L M/R)(1/T_1 - 1/T_2)$.' },
    { term: 'Antoine equation', also: ['Antoine constants'], def: 'A three-constant empirical fit to the vapour-pressure curve, $\\log_{10} p = A - B/(C + T)$, accurate to about 1 % for water between 1 and 100 °C.' },
    { term: 'Wet-bulb temperature', also: ['wet bulb'], def: 'The lowest temperature a wet surface can reach by evaporation in air that is not saturated; it lies between the dew point and the air temperature. In air at 30 °C and 50 % humidity it is 22.3 °C.' }
  ],
  formulas: [
    { name: 'Antoine estimate of vapour pressure', expr: 'p = 10^(A - B/(C + T))', tex: 'p = 10^{A - B/(C + T)}',
      vars: { p: { name: 'vapour pressure', q: 'pressure', unit: 'kPa' }, A: { name: 'Antoine constant A (for pressure in Pa)', value: 10.19625, fixed: true, tex: 'A' }, B: { name: 'Antoine constant B', value: 1730.63, fixed: true, tex: 'B' }, C: { name: 'Antoine constant C', value: 233.426, fixed: true, tex: 'C' }, T: { name: 'temperature in degrees Celsius', value: 25, min: 1, max: 100, tex: 'T', hint: 'A plain number in °C, not converted to kelvin: Antoine constants are empirical.' } },
      solveFor: 'p', note: 'The constants given are for pressure in pascals (A = 8.07131 for mmHg). Valid from 1 to 100 °C to within about 1 %; at 25 °C it gives 3.16 kPa against the true 3.17.',
      stories: { p: 'Estimate the vapour pressure of water at {T} degrees Celsius.', T: 'At what temperature (in °C) is the vapour pressure of water {p}?' } },
    { name: 'Clausius–Clapeyron, integrated', expr: 'p2 = p1*exp(Hv/R*(1/T1 - 1/T2))', tex: 'p_2 = p_1 \\exp\\left[\\frac{\\Delta H_{vap}}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)\\right]',
      vars: { p2: { name: 'vapour pressure at the second temperature', q: 'pressure', unit: 'kPa', tex: 'p_2' }, p1: { name: 'vapour pressure at the first temperature', q: 'pressure', unit: 'kPa', value: 2.339, tex: 'p_1' }, Hv: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 43.8, tex: '\\Delta H_{vap}', hint: 'Use the value at the middle of the range: about 44 kJ/mol near 25 °C, 42 near 70 °C, 40.7 at 100 °C.' }, R: { const: 'R' }, T1: { name: 'first temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' }, T2: { name: 'second temperature', q: 'temperature', unit: '°C', value: 40, tex: 'T_2' } },
      solveFor: 'p2', note: 'Assumes a constant latent heat, which is good to a few per cent over a 30 K range. Between 20 and 40 °C it gives 7.37 kPa against the true 7.39.',
      stories: { p2: 'Water at {T1} has a vapour pressure of {p1}. What is it at {T2}, taking {Hv} for the enthalpy of vaporisation?', T2: 'Water\'s vapour pressure rises from {p1} at {T1} to {p2}. At what temperature?' } },
    { name: 'Temperature rise that doubles the vapour pressure', expr: 'dT = ln(2)*R*T^2/Hv', tex: '\\Delta T_{2} = \\frac{R\\,T^2 \\ln 2}{\\Delta H_{vap}}',
      vars: { dT: { name: 'rise that doubles the pressure', q: 'dtemp', unit: 'K', tex: '\\Delta T_{2}' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T' }, Hv: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 44, tex: '\\Delta H_{vap}' } },
      solveFor: 'dT', note: '11.6 K at 25 °C, 9.5 K at 0 °C and 19.7 K at 100 °C: the pressure doubles more slowly as the water warms, because the 1/T² factor outweighs the lower latent heat.',
      stories: { dT: 'By how many kelvin must water at {T} be warmed to double its vapour pressure?' } },
    { name: 'Relative humidity', expr: 'RH = pv/ps', tex: '\\mathrm{RH} = \\frac{p_v}{p_s}',
      vars: { RH: { name: 'relative humidity', q: 'ratio', unit: '%', tex: '\\mathrm{RH}' }, pv: { name: 'partial pressure of water vapour in the air', q: 'pressure', unit: 'kPa', value: 1.17, tex: 'p_v' }, ps: { name: 'saturation vapour pressure at the air temperature', q: 'pressure', unit: 'kPa', value: 2.339, tex: 'p_s', hint: '2.34 kPa at 20 °C, 3.17 at 25 °C, 4.25 at 30 °C.' } },
      solveFor: 'RH', note: 'The dew point is the temperature at which this ratio would reach 100 %: the temperature whose saturation pressure equals the partial pressure of vapour in the air.',
      stories: { RH: 'Air at 20 °C holds water vapour at {pv}; its saturation vapour pressure is {ps}. What is the relative humidity?' } }
  ],
  examples: [
    { title: 'Twenty degrees warmer', q: 'A puddle warms from 20 °C to 40 °C. By what factor does the vapour pressure at its surface rise, and what does that do to its drying rate in the same air?',
      steps: [{ text: 'From the Clausius–Clapeyron form with $\\Delta H_{vap} = 43.8$ kJ/mol:', tex: '\\frac{p_2}{p_1} = \\exp\\left[\\frac{43\\,800}{8.314}\\left(\\frac{1}{293.15} - \\frac{1}{313.15}\\right)\\right] = e^{1.148} = 3.15' }, 'Tabulated: 7.39 kPa against 2.34 kPa, a ratio of 3.16.', 'In dry air the evaporation rate follows the gap between the surface\'s pressure and the air\'s, so the rate rises by about the same factor: three times faster.'],
      a: 'Three times as high a vapour pressure (3.16), and in dry air about three times as fast a drying rate.' },
    { title: 'Wet clothes feel cold', q: 'Air is at 30 °C and 50 % relative humidity. What is the vapour pressure in the air, how cold can a wet cloth get, and why is the cold less than the dew point would suggest?',
      steps: ['The saturation pressure at 30 °C is 4.25 kPa, so the vapour pressure in the air is $0.5 \\times 4.25 = 2.12$ kPa.', 'That pressure is saturation at 18.4 °C: the dew point. A surface cooled to that temperature would just start to gain water by condensation.', 'The wet cloth cools by evaporation until the cooling is balanced by heat arriving from the warmer air; the balance lies at the wet-bulb temperature, 22.3 °C — between the dew point (18.4) and the air (30).'],
      a: 'The air holds 2.12 kPa of vapour; the cloth falls to the wet-bulb temperature, 22.3 °C — 7.7 K below the air, and above the dew point of 18.4 °C.' }
  ],
  quiz: [
    { q: 'A sealed bottle is half full of water at 20 °C and the air has been pumped out. The pressure of the vapour above the water is about', choices: ['0.2 kPa, because there is little vapour', '2.34 kPa', '101 kPa, because the bottle is sealed', 'it grows until the water is all gone'], a: 1, why: 'The pressure is set by temperature alone: 2.34 kPa at 20 °C, whether the bottle is half full or a tenth full, so long as some liquid remains.' },
    { q: 'Water cannot evaporate at 5 °C; it has to boil first.', a: false, why: 'Water evaporates at every temperature; its vapour pressure is 0.87 kPa at 5 °C. What changes at the boiling point is that bubbles can form inside the liquid.' },
    { q: 'By what factor does water\'s vapour pressure rise when it is warmed from 20 °C to 40 °C?', answer: 3.16, why: 'From 2.34 kPa to 7.39 kPa, a factor of 3.16: a little more than doubling for each ten degrees.' },
    { q: 'A breeze dries wet washing faster mainly because it', choices: ['warms the washing', 'raises the vapour pressure of the water', 'carries away the vapour near the surface, keeping the gap to saturation wide', 'adds heat by friction'], a: 2, why: 'The rate of evaporation follows the gap between the saturation pressure at the surface and the vapour pressure in the air. Wind replaces the damp air at the surface with drier air.' },
    { q: 'On a day when the air is saturated (100 % humidity) at 25 °C, a wet cloth', choices: ['cools to the dew point, below the air temperature', 'stays at the air temperature, as there is no net evaporation', 'warms above the air temperature', 'dries fastest'], a: 1, why: 'The wet-bulb temperature equals the air temperature at saturation: evaporation and condensation balance, and nothing cools the cloth. This is why humid heat is so hard to bear: sweat cannot evaporate.' }
  ],
  applications: ['Drying: laundry, timber, grain, paint, food dehydration — all are limited by the vapour-pressure gap, so heat and wind speed the job.', 'Weather and climate: saturation pressure sets how much water vapour air can hold, the 7 % per kelvin rule that makes warm air carry heavier rain.', 'Vacuum technology and freeze-drying: pumping to below 611.657 Pa makes the ice sublime and leaves a dry, intact solid.', 'Cavitation in pumps and propellers: when the local pressure falls to the vapour pressure the water boils cold ([[cavitation-and-embolism]]).', 'Breathing: air in the lungs is saturated at 37 °C, 6.3 kPa, 44 g of water vapour per cubic metre, which is why breath mists in the cold.'],
  history: 'John Dalton showed in 1801 that the vapour of a liquid in a gas has the same pressure it would have alone. Émile Clapeyron derived the relation between the slope of the curve and the latent heat in 1834, and Rudolf Clausius put it on a thermodynamic footing in 1850. Louis Antoine published his three-constant fit in 1888.',
  sources: ['Wagner and Pruß, "The IAPWS formulation 1995 for the thermodynamic properties of ordinary water substance", *Journal of Physical and Chemical Reference Data* 31, 387 (2002) — the vapour-pressure curve used on this page.', 'Atkins and de Paula, *Physical Chemistry*, the sections on vapour pressure and the Clausius–Clapeyron equation.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, on evaporation and the properties of the vapour.', 'IPCC AR6 (2021), Working Group I, chapter 8, on the scaling of atmospheric water vapour with temperature.'],
  sim: 'mb-vapour-pressure'
},

/* ================================================================ 5 */
{
  id: 'boiling-at-altitude', parent: 'melting-and-boiling', title: 'Boiling at altitude and under pressure', level: 1,
  short: 'Water boils when its vapour pressure equals the pressure around it. On Everest, at 33.7 kPa, that happens at 72 °C; in Denver at 95 °C; in a pressure cooker at two atmospheres at 120 °C. The temperature of boiling water is not a property of the water but of the place.',
  keywords: ['boiling point altitude', 'boiling on Everest', 'pressure cooker', 'Denver', 'autoclave', 'boiling temperature pressure', 'high altitude cooking', 'standard atmosphere', 'Armstrong limit', 'absolute pressure', 'gauge pressure', 'steam sterilisation'],
  prereq: ['vapour-pressure-and-evaporation', 'latent-heat-of-vaporisation'],
  related: ['the-phase-diagram', 'the-triple-point-standard', 'water-in-the-kitchen', 'desalination', 'colligative-properties', 'the-moon-and-mars', 'physics:latent-heat', 'chemistry:clausius-clapeyron', 'chemistry:phase-diagrams'],
  body: `
At Everest base camp, 5,364 metres up, a kettle boils at 82 °C. A cup of tea made with it is weak; rice cooked in it stays hard. High on the mountain, where the pressure is a third of sea level's, the water boils at 72 °C and will cook very little. Down in a kitchen with a pressure cooker the boiling water is at 120 °C and the lentils are done in ten minutes. None of this changes the water. What changes is the pressure, and boiling is a negotiation between the two.

### The rule
A liquid boils when its vapour pressure equals the pressure pressing on its surface. At sea level the pressure is 101.3 kPa and water reaches that at 99.97 °C — not quite 100, a detail we meet again in [[the-triple-point-standard]]. Take away some of the pressure and the vapour pressure catches up sooner; add pressure and it has to climb farther. The boiling point follows the pressure along the vaporisation curve of the phase diagram.

| Place | Pressure | Boils at |
|---|---|---|
| sea level | 101.3 kPa | 99.97 °C |
| Denver, 1,609 m | 83.4 kPa | 94.6 °C |
| Mexico City, 2,240 m | 77.2 kPa | 92.5 °C |
| La Paz, 3,640 m | 64.6 kPa | 87.8 °C |
| Everest base camp, 5,364 m | 51.4 kPa | 82.0 °C |
| Everest summit, 8,849 m | 33.7 kPa (measured) | 71.8 °C |
| 18.9 km, the Armstrong limit | 6.3 kPa | 37 °C |
| pressure cooker, 1 atm gauge | 203 kPa | 120.6 °C |
| the surface of Mars | about 610 Pa | about 0 °C |

(Pressures up to 11 km follow the standard atmosphere, $p = 101\\,325\\,(1 - 2.25577\\times 10^{-5}h)^{5.25588}$ Pa with $h$ in metres; the 33.7 kPa on Everest's summit was measured in 1981, a little above the standard's 31.4 kPa.) A good rule of thumb: **the boiling point falls by about one kelvin for every 300 metres of climb**, and the weather moves it too — a deep low of 960 hPa boils water at 98.5 °C, a strong high of 1040 hPa at 100.7 °C.

### The edge of the body
At 18.9 kilometres the pressure is 6.3 kPa, equal to the vapour pressure of water at body temperature. Above that height, the **Armstrong limit**, the fluids of an unprotected person's mouth and eyes would boil at 37 °C; pilots wear pressure suits above it. On Mars the surface pressure is about 610 Pa, close to the triple point of water, and the water that is not frozen is either ice or boiling away: in the thin air any liquid water is on the edge of boiling at the freezing point ([[the-moon-and-mars]]).

### Why cooking slows, and why a pressure cooker speeds it
Cooking is chemistry: starch grains gelatinise, proteins denature, the cement between plant cells dissolves, collagen turns to gelatine. Such reactions typically go two to three times faster for every ten degrees of warmth, and the boiling temperature caps how hot a pan of water can get. At 94.6 °C (Denver) a reaction that doubles every ten degrees runs 1.45 times slower; at 82 °C, 3.5 times slower. Turn up the stove and the water only boils away faster, at the same temperature. The cure is a lid that holds the steam in, as in a **pressure cooker**: the pressure rises to about two atmospheres absolute, the boiling point to 120 °C, and the same rule gives a speed-up of about four, though in practice food is not cooked that quickly because heat must still diffuse into the middle. The same device on a larger scale, the **autoclave**, sterilises instruments at 121 °C: bacterial spores that survive hours of boiling at 100 °C die in minutes at 121 °C.

### Gauge or absolute
A pressure cooker's gauge reading is pressure *above* the atmosphere. A reading of 100 kPa (about 15 psi) means 201 kPa absolute, two atmospheres, and it is the absolute pressure that sets the boiling point. The same trap awaits in tyres, boilers and scuba tanks.

### The estimate from Clausius–Clapeyron
Integrating the Clausius–Clapeyron relation gives the boiling point at any pressure from one known point:

$$\\frac{1}{T_b} = \\frac{1}{T_0} - \\frac{R}{\\Delta H_{vap}}\\ln\\frac{p}{p_0}$$

With $T_0 = 373.15$ K at $p_0 = 101.325$ kPa and a mean $\\Delta H_{vap} = 41.5$ kJ/mol it gives 71.6 °C at 33.7 kPa and 120.2 °C at 201 kPa, within a fraction of a degree of the tabulated values of 71.8 and 120.6. Dissolved salt shifts the boiling point only a little (0.5 K per mole of dissolved particles per kilogram, [[colligative-properties]]); the pressure is what matters.

> [!key] Water boils when its vapour pressure equals the pressure around it, so the boiling point falls about 1 K per 300 m of altitude — 95 °C in Denver, 72 °C on Everest — and rises to 120 °C at two atmospheres in a pressure cooker. Cooking and sterilising are governed by the temperature of the boiling water, which the pressure sets.`,
  ideas: ['Water boils when its vapour pressure equals the surrounding pressure; the boiling point is a property of the pressure as much as of the water.', 'It falls about 1 K per 300 m of altitude: 94.6 °C in Denver, 82 °C at Everest base camp, 72 °C at the summit (33.7 kPa measured).', 'At two atmospheres absolute the boiling point is 120.6 °C: the principle of the pressure cooker and the autoclave, which sterilises at 121 °C.', 'Use absolute pressure, not gauge pressure: a cooker\'s 100 kPa gauge is 201 kPa absolute.'],
  pitfalls: ['"Water always boils at 100 °C" — Only at one standard atmosphere (and really 99.97 °C). It is a property of the pressure; the boiling water on a mountain is cooler, in a cooker hotter.', '"A hotter stove makes the boiling water hotter" — At a given pressure boiling water stays at the boiling point; more heat just makes more steam. Only a higher pressure raises the temperature.', '"Food cooks slowly at altitude because the water is slow to boil" — The water boils sooner, at a lower temperature, and a kettle is quicker on a mountain; it is because the boiling water is cooler that the rice cooks slower.'],
  terms: [
    { term: 'Normal boiling point', also: ['boiling point at one atmosphere', 'standard boiling point'], def: 'The temperature at which the vapour pressure of a liquid equals one standard atmosphere (101.325 kPa): 99.97 °C for water, a hair below the 100 °C of the old Celsius definition.' },
    { term: 'Standard atmosphere', also: ['International Standard Atmosphere', 'ISA'], def: 'A reference model of the atmosphere with sea-level pressure 101.325 kPa and a temperature falling 6.5 K per kilometre up to 11 km. It gives the pressure at altitude as $p = 101\\,325\\,(1 - 2.25577\\times10^{-5}h)^{5.25588}$ Pa.' },
    { term: 'Absolute pressure', also: ['gauge pressure'], def: 'Absolute pressure is measured from zero (vacuum); gauge pressure is measured relative to the surrounding atmosphere. Absolute equals gauge plus about 101.3 kPa near sea level, and the boiling point depends on the absolute value.' },
    { term: 'Autoclave', also: ['pressure steriliser'], def: 'A closed vessel that heats steam under pressure, typically 121 °C at 203 kPa absolute for 15–20 minutes, to sterilise instruments and media by killing even bacterial spores.' },
    { term: 'Armstrong limit', also: ['Armstrong line'], def: 'The altitude, about 18–19 km, where the atmospheric pressure (6.3 kPa) equals the vapour pressure of water at body temperature, so that exposed body fluids would boil at 37 °C.' }
  ],
  formulas: [
    { name: 'Pressure at altitude (standard atmosphere)', expr: 'p = p0*(1 - 2.25577e-5*h)^5.25588', tex: 'p = p_0\\,\\left(1 - 2.25577\\times10^{-5}\\,h\\right)^{5.25588}',
      vars: { p: { name: 'air pressure', q: 'pressure', unit: 'kPa' }, p0: { const: 'atm', tex: 'p_0' }, h: { name: 'altitude', q: 'length', unit: 'm', value: 1609, min: 0, max: 11000, tex: 'h' } },
      solveFor: 'p', note: 'The International Standard Atmosphere, valid from sea level to 11 km. Real pressure varies by about ±5 % with the weather, which moves the boiling point by about ±1.5 K.',
      stories: { p: 'Denver lies at {h} above sea level. What is the standard air pressure there?', h: 'The air pressure is {p}. At what altitude in the standard atmosphere?' } },
    { name: 'Boiling point at another pressure', expr: 'Tb = 1/(1/T0 - R*ln(p/p0)/Hv)', tex: 'T_b = \\frac{1}{\\dfrac{1}{T_0} - \\dfrac{R}{\\Delta H_{vap}}\\ln\\dfrac{p}{p_0}}',
      vars: { Tb: { name: 'boiling point at pressure p', q: 'temperature', unit: '°C', tex: 'T_b' }, T0: { name: 'boiling point at one atmosphere', q: 'temperature', unit: '°C', value: 100, fixed: true, tex: 'T_0' }, R: { const: 'R' }, p: { name: 'pressure (absolute)', q: 'pressure', unit: 'kPa', value: 33.7, tex: 'p' }, p0: { const: 'atm', tex: 'p_0' }, Hv: { name: 'mean enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 41.5, tex: '\\Delta H_{vap}', hint: '40.7 kJ/mol at 100 °C; the average over 70–120 °C is about 41.5.' } },
      solveFor: 'Tb', note: 'A constant ΔH makes this good to a degree between 40 and 150 °C. For the full range use the vapour-pressure curve, as the simulation does.',
      stories: { Tb: 'On the summit of Everest the measured pressure is {p}. At what temperature does water boil?', p: 'Water boils at {Tb}. What is the pressure?' } },
    { name: 'Cooking time at another temperature', expr: 't2 = t1*q10^((T1 - T2)/10)', tex: 't_2 = t_1\\,Q_{10}^{\\,(T_1 - T_2)/10}',
      vars: { t2: { name: 'cooking time at T₂', q: 'time', unit: 'min', tex: 't_2' }, t1: { name: 'cooking time at T₁', q: 'time', unit: 'min', value: 10, tex: 't_1' }, q10: { name: 'speed-up per 10 K (Q₁₀)', value: 2, min: 1, max: 6, tex: 'Q_{10}', hint: 'Typical cooking reactions: 2–3; the denaturation of egg and muscle proteins can be 10 or more over narrow ranges.' }, T1: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 100, tex: 'T_1' }, T2: { name: 'temperature of the cooking water', q: 'temperature', unit: '°C', value: 94.6, tex: 'T_2' } },
      solveFor: 't2', note: 'A rule of thumb, not a law: it treats cooking as one reaction with a fixed Q₁₀ and ignores the time heat takes to reach the middle of the food.',
      stories: { t2: 'Pasta takes {t1} at {T1}. How long does it take in water at {T2}, if cooking speeds up {q10} times per ten kelvin?' } },
    { name: 'Absolute pressure from a gauge', expr: 'pa = pg + p0', tex: 'p_{abs} = p_{gauge} + p_0',
      vars: { pa: { name: 'absolute pressure', q: 'pressure', unit: 'kPa', tex: 'p_{abs}' }, pg: { name: 'gauge pressure', q: 'pressure', unit: 'kPa', value: 100, tex: 'p_{gauge}', hint: 'A pressure cooker\'s 15 psi weight lifts at about 103 kPa gauge.' }, p0: { const: 'atm', tex: 'p_0' } },
      solveFor: 'pa', note: 'Always convert before reading a boiling point off a vapour-pressure curve.',
      stories: { pa: 'A cooker\'s gauge reads {pg}. What is the absolute pressure inside?' } }
  ],
  examples: [
    { title: 'Tea on the summit', q: 'On the summit of Everest the measured pressure is 33.7 kPa. Estimate the boiling point from the Clausius–Clapeyron relation with a mean enthalpy of vaporisation of 41.5 kJ/mol, and compare with the tabulated 71.8 °C.',
      steps: [{ text: 'The pressure ratio:', tex: '\\ln\\frac{33.7}{101.325} = -1.101' }, { text: 'Inverse boiling point:', tex: '\\frac{1}{T_b} = \\frac{1}{373.15} + \\frac{8.314\\times1.101}{41\\,500} = 2.6798\\times10^{-3} + 2.206\\times10^{-4} = 2.9004\\times10^{-3}\\ \\mathrm{K^{-1}}' }, 'So $T_b = 344.8$ K, 71.6 °C.'],
      a: '71.6 °C — within 0.2 K of the tabulated 71.8 °C. A mountaineer\'s tea is brewed at 72 °C, below the 80–95 °C a good cup wants.' },
    { title: 'Inside a pressure cooker', q: 'A cooker has a regulator that opens at a gauge pressure of 100 kPa. What is the temperature of the boiling water, and, if a stew takes 60 min at 100 °C and cooking speeds up fourfold for each 20 K (Q₁₀ = 2), how long should it take?',
      steps: ['Absolute pressure: $100 + 101.3 = 201$ kPa, twice the atmosphere.', { text: 'Boiling point:', tex: '\\frac{1}{T_b} = 2.6798\\times10^{-3} - \\frac{8.314\\times\\ln(1.987)}{41\\,500} = 2.5424\\times10^{-3}, \\quad T_b = 393.3\\ \\mathrm{K} = 120.2\\ ^{\\circ}\\mathrm{C}' }, { text: 'Time:', tex: 't_2 = 60\\times 2^{-(120.2-100)/10} = 60\\times 0.247 = 14.8\\ \\mathrm{min}' }],
      a: 'About 120 °C, and the stew should be ready in 15 minutes on the rule of thumb; in practice 20 to 25, since heat still has to reach the middle of the pot.' }
  ],
  quiz: [
    { q: 'On the top of a high mountain a pot of rice cooks slowly because', choices: ['the air is cold', 'the water boils at a lower temperature', 'steam carries less heat', 'water is lighter there'], a: 1, why: 'The pressure is low, so water boils at 72–95 °C instead of 100. The water boils sooner but is cooler, and the chemistry of cooking slows with the temperature.' },
    { q: 'A stronger flame under a pot of boiling water at sea level makes the water hotter than 100 °C.', a: false, why: 'The boiling temperature is fixed by the pressure. More heat only turns water to steam faster; to get hotter water you need a lid that raises the pressure.' },
    { q: 'At two atmospheres absolute, water boils at about (in °C)', answer: 120.6, why: 'The vapour pressure of water reaches 202.65 kPa at 120.6 °C. This is the temperature of a pressure cooker and an autoclave.' },
    { q: 'A pressure gauge on a boiler reads 400 kPa. At what pressure does the water boil?', choices: ['400 kPa', 'about 500 kPa', 'about 300 kPa', 'it cannot be known'], a: 1, why: 'A gauge reads above the atmosphere. The absolute pressure is 400 + 101 = 501 kPa, and the water boils at about 152 °C.' },
    { q: 'Above the Armstrong limit (about 19 km) an unprotected person\'s saliva would boil because', choices: ['the air is cold enough to freeze it', 'the pressure falls below 6.3 kPa, the vapour pressure of water at 37 °C', 'the person is too hot', 'oxygen is missing'], a: 1, why: 'Boiling needs only the vapour pressure to reach the ambient pressure. At 37 °C that is 6.3 kPa, so at lower pressures body fluids boil at body temperature.' }
  ],
  applications: ['Mountaineering and high-altitude cooking: adding time, using pressure cookers, and understanding why altitude baking charts exist.', 'Pressure cookers, canning and autoclaves in kitchens and hospitals, where 121 °C steam sterilises equipment and low-acid food.', 'Power stations and boilers, where water is held at 15–25 MPa so that it boils at 340–370 °C and the steam carries more energy to the turbine.', 'Vacuum evaporation, from milk concentrate and fruit juice to desalination: boiling at 40–60 °C by lowering the pressure to preserve flavour and save heat.', 'Spacesuits and pressurised cabins: the Armstrong limit is why high-altitude flight needs pressurisation.'],
  history: 'Denis Papin demonstrated his "steam digester", a sealed pot with a safety valve, to the Royal Society in London in 1679; he cooked bones soft in it and saw at once that higher pressure meant hotter water. The autoclave was developed for sterilising by Charles Chamberland, Pasteur\'s collaborator, in 1879. The 33.7 kPa on the summit of Everest was measured by John West and colleagues of the American Medical Research Expedition in 1981.',
  sources: ['West, Lahiri, Maret, Peters and Pizzo, "Barometric pressures at extreme altitudes on Mt. Everest", *Journal of Applied Physiology* 54, 1188 (1983).', 'U.S. Standard Atmosphere 1976 (NOAA/NASA/USAF), the source of the pressure formula.', 'Wagner and Pruß, *Journal of Physical and Chemical Reference Data* 31, 387 (2002), and IAPWS releases, for the vapour-pressure curve.', 'Atkins and de Paula, *Physical Chemistry*, on Clausius–Clapeyron and the effect of pressure on the boiling point.'],
  sim: 'mb-altitude'
},

/* ================================================================ 6 */
{
  id: 'the-phase-diagram', parent: 'melting-and-boiling', title: 'The phase diagram', level: 2,
  short: 'A map of where ice, liquid and vapour are stable: three curves that meet at the triple point (0.01 °C, 611.657 Pa), a boiling curve that ends at the critical point (373.946 °C, 22.064 MPa), and a melting curve that leans the wrong way — each atmosphere lowers the melting point by 0.0075 K — before it climbs through ice III, V, VI and VII.',
  keywords: ['phase diagram', 'triple point', 'critical point', 'melting curve', 'sublimation', 'negative slope', 'ice III', 'ice VI', 'ice VII', 'Clapeyron', 'phase rule', 'freeze-drying', 'water phase diagram', 'pressure melting'],
  prereq: ['vapour-pressure-and-evaporation', 'melting-and-the-latent-heat-of-fusion', 'why-ice-floats'],
  related: ['boiling-at-altitude', 'supercritical-water', 'the-triple-point-standard', 'high-pressure-ices', 'why-ice-is-slippery', 'glaciers-flow', 'supercooled-water-and-no-mans-land', 'chemistry:phase-diagrams', 'chemistry:clausius-clapeyron'],
  body: `
A phase diagram is a map. Temperature runs across, pressure up, and every point shows what water does at that temperature and pressure: where it is ice, where liquid, where vapour. Where two phases can live together the map draws a line; where three can, a point. For water, whose phases at ordinary pressures are the kitchen's three, the map has more in it than a first look suggests — and it explains why water behaves the way it does when squeezed, warmed or pumped out.

### The three curves and two points
- **The vaporisation curve** leaves the triple point and climbs steeply: 101.4 kPa at 100 °C, 1.55 MPa at 200 °C, and then ends abruptly at the **critical point**, 373.946 °C and 22.064 MPa, where liquid and vapour become one fluid ([[supercritical-water]]). Every point on it is a boiling point at that pressure.
- **The sublimation curve** runs down and to the left from the triple point: 103 Pa at −20 °C, 12.8 Pa at −40 °C, 1.08 Pa at −60 °C. Below it, ice turns straight into vapour, which is how frost disappears from a cold dry day and how freeze-dried coffee is made.
- **The melting curve** leaves the triple point almost vertically, leaning slightly left. Everything about water's strangeness is in that lean.
- **The triple point** is the one pressure and temperature, 611.657 Pa and 273.16 K (0.01 °C), at which ice, liquid and vapour coexist. Below 611.657 Pa liquid water cannot exist: there is only ice and vapour. That is why liquid water does not exist on the Moon or, mostly, on Mars ([[the-moon-and-mars]]).

### The melting curve leans left
For nearly every substance, pressure forces the liquid into the denser solid, so pressure *raises* the melting point and the curve leans right. For water the solid is *less* dense than the liquid ([[why-ice-floats]]), so pressure favours the liquid: the melting curve leans the other way, at $dT/dp = -7.4\\times10^{-8}$ K/Pa. That is 0.0075 K per atmosphere, 13.5 MPa for each kelvin. At 100 MPa (1,000 atmospheres, the pressure 10 km down in the sea) ice melts at −8.9 °C; the curve reaches its lowest point, −21.985 °C, at 208.6 MPa. The fact was predicted in 1849 by James Thomson from the Clapeyron equation and confirmed in the laboratory the next year by his brother William, later Lord Kelvin. Glaciers show it: beneath 3.7 km of ice (33 MPa) the base melts at −2.5 °C, which is why the bottom of the Antarctic ice sheet can be wet while the surface is at −50 °C. (The idea that a skater's blade melts the ice by pressure is another matter: see [[why-ice-is-slippery]].)

### Above 208.6 MPa: other ices
At 208.566 MPa and 251.165 K the ordinary ice Ih gives way to the denser **ice III**, and the melting curve turns upward, as for any normal substance. Ice V takes over near 350 MPa, ice VI above 632 MPa and ice VII above 2.2 GPa. At room temperature, 25 °C, water freezes if squeezed to 0.97 GPa (9,500 atmospheres), into ice VI; ice VII at 3 GPa melts at 139 °C and at 10 GPa at 341 °C. This is "hot ice", the kind that probably lines the floors of the oceans of Ganymede and Titan and of water-rich planets elsewhere. More than a dozen further crystal forms fill the cold part of the map ([[high-pressure-ices]]).

### The phase rule
Gibbs's phase rule counts how many variables you can change independently: $F = C - P + 2$, with $C$ components and $P$ phases present. For water ($C = 1$): in one phase, two freedoms (a region: choose T and p); on a line, two phases coexist and one freedom remains (choose T, and p is fixed); at the triple point, three phases and no freedom — a *fixed* point. That is why the triple point makes a thermometer standard ([[the-triple-point-standard]]).

### Where water is odd
Compare water with carbon dioxide, a molecule of similar size and a much simpler diagram. Its triple point is at 5.18 bar, above atmospheric pressure, so at 1 atm solid CO₂ sublimes ("dry ice") and no liquid can exist; and its melting curve leans right. Water's triple point lies far below an atmosphere, so we get a liquid at every ordinary pressure, and the lean of its melting curve is the same fact as the floating of icebergs.

> [!key] The map of water has three curves meeting at the triple point (0.01 °C, 611.657 Pa), a boiling curve that ends at the critical point (373.946 °C, 22.064 MPa), and a melting curve that leans left because ice is less dense than water — each atmosphere lowers the melting point by 0.0075 K. Squeeze hard enough and the curve turns, through ice III, V, VI and VII, to "hot ice" at 3 GPa and 139 °C.`,
  ideas: ['The map has regions (one phase), curves (two phases coexist) and points (three, or the critical point where two merge).', 'The triple point is at 611.657 Pa and 273.16 K (0.01 °C); the critical point at 22.064 MPa and 373.946 °C. Below the triple-point pressure there is no liquid water.', 'The melting curve leans left, −7.4×10⁻⁸ K/Pa or −0.0075 K per atmosphere, because ice is less dense than water; it turns at 208.6 MPa and −22 °C into the ice III branch, then rises through ice V, VI and VII.', 'The phase rule $F = C - P + 2$ gives two freedoms in a region, one on a line and none at the triple point.'],
  pitfalls: ['"The melting curve of ice leans left, so pressure melts ice at a skating rink" — The shift is 0.0075 K per atmosphere; a skater\'s weight on a blade lowers the melting point by a few kelvin at best, which does not explain skating at −20 °C ([[why-ice-is-slippery]]).', '"Every substance has a triple point at a low pressure like water\'s" — The triple-point pressure of CO₂ is 5.18 bar, above atmospheric, so solid CO₂ sublimes in the open air.', '"Beyond the critical point it is a gas" — It is neither: a supercritical fluid has no boundary between liquid and gas and can be taken from liquid-like to gas-like density with no phase change ([[supercritical-water]]).'],
  terms: [
    { term: 'Phase diagram', also: ['pT diagram', 'phase map'], def: 'A graph of the stable phase of a substance against temperature and pressure, with curves where two phases coexist and points where three do, or where two merge.' },
    { term: 'Triple point', def: 'The unique temperature and pressure at which a substance\'s solid, liquid and vapour coexist in equilibrium. For water: 273.16 K (0.01 °C) and 611.657 Pa.' },
    { term: 'Critical point', also: ['critical temperature', 'critical pressure'], def: 'The end of the vaporisation curve, where liquid and vapour become identical: 373.946 °C (647.096 K), 22.064 MPa and 322 kg/m³ for water.' },
    { term: 'Melting curve', also: ['fusion curve', 'solid–liquid line'], def: 'The line on the phase diagram where solid and liquid coexist. Water\'s leans to the left, with slope −7.4×10⁻⁸ K/Pa, up to 208.6 MPa.' },
    { term: 'Sublimation curve', also: ['solid–vapour line', 'frost line'], def: 'The line on the phase diagram where solid and vapour coexist; below the triple-point pressure a solid turns directly into vapour on warming.' },
    { term: 'Gibbs phase rule', also: ['phase rule'], def: 'The number of freely variable intensive quantities (temperature, pressure, concentrations) in equilibrium is $F = C - P + 2$. For pure water it is 2 in one phase, 1 on a coexistence line and 0 at the triple point.' }
  ],
  formulas: [
    { name: 'Clapeyron: melting point under pressure', expr: 'dT = T*(1/rl - 1/rs)*dp/Lf', tex: '\\Delta T = \\frac{T\\left(\\dfrac{1}{\\rho_l} - \\dfrac{1}{\\rho_s}\\right)\\Delta p}{L_f}',
      vars: { dT: { name: 'change in melting temperature', q: 'dtemp', unit: 'K', signed: true, tex: '\\Delta T' }, T: { name: 'melting temperature', q: 'temperature', unit: '°C', value: 0, tex: 'T' }, rl: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 999.84, tex: '\\rho_l' }, rs: { name: 'density of the solid', q: 'density', unit: 'kg/m³', value: 916.7, tex: '\\rho_s' }, dp: { name: 'increase in pressure', q: 'pressure', unit: 'atm', value: 100, tex: '\\Delta p' }, Lf: { name: 'latent heat of fusion', q: 'latent', unit: 'kJ/kg', value: 333.55, tex: 'L_f' } },
      solveFor: 'dT', note: 'Negative for water because the solid is lighter than the liquid; for nearly every other substance the solid is denser and the melting point rises with pressure. Valid up to about 200 MPa.',
      stories: { dT: 'Ice at {T} is put under an extra {dp}. By how much does the melting point shift?', dp: 'What extra pressure lowers the melting point of ice by {dT}?' } },
    { name: 'Slope of the vaporisation curve', expr: 'dpdT = Hv*p/(R*T^2)', tex: 'S_p = \\frac{\\Delta H_{vap}\\,p}{R\\,T^2}',
      vars: { dpdT: { name: 'slope dp/dT of the vapour-pressure curve', unit: 'Pa/K', tex: 'S_p' }, Hv: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 40.66, tex: '\\Delta H_{vap}' }, p: { name: 'vapour pressure', q: 'pressure', unit: 'kPa', value: 101.325, tex: 'p' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 100, tex: 'T' } },
      solveFor: 'dpdT', note: 'The Clausius–Clapeyron slope treating the vapour as an ideal gas and neglecting the liquid\'s volume. At 100 °C it gives 3.57 kPa/K, 3.5 % per kelvin: the boiling point shifts 1 K for every 3.6 kPa.',
      stories: { dpdT: 'Water at {T} has vapour pressure {p} and enthalpy of vaporisation {Hv}. How fast does the vapour pressure rise with temperature?' } },
    { name: 'Vapour pressure of ice', expr: 'p = ptp*exp(Hs/R*(1/Ttp - 1/T))', tex: 'p = p_{tp}\\,\\exp\\left[\\frac{\\Delta H_{sub}}{R}\\left(\\frac{1}{T_{tp}} - \\frac{1}{T}\\right)\\right]',
      vars: { p: { name: 'vapour pressure over ice', q: 'pressure', unit: 'Pa' }, ptp: { name: 'triple-point pressure', q: 'pressure', unit: 'Pa', value: 611.657, fixed: true, tex: 'p_{tp}' }, Hs: { name: 'enthalpy of sublimation', q: 'molarenergy', unit: 'kJ/mol', value: 51.06, tex: '\\Delta H_{sub}' }, R: { const: 'R' }, Ttp: { name: 'triple-point temperature', q: 'temperature', unit: '°C', value: 0.01, fixed: true, tex: 'T_{tp}' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: -20, max: 0.01, tex: 'T' } },
      solveFor: 'p', note: 'Clausius–Clapeyron for the solid, anchored at the triple point. At −20 °C it gives 103.5 Pa against the true 103.2.',
      stories: { p: 'What is the vapour pressure of ice at {T}?', T: 'Ice has a vapour pressure of {p}. What is its temperature?' } },
    { name: 'The phase rule', expr: 'F = C - P + 2', tex: 'F = C - P + 2',
      vars: { F: { name: 'degrees of freedom', int: true, tex: 'F' }, C: { name: 'number of components', int: true, value: 1, tex: 'C' }, P: { name: 'number of phases present', int: true, value: 3, min: 1, tex: 'P' } },
      solveFor: 'F', note: 'Pure water has C = 1: two phases coexisting on a line leave F = 1, and three at the triple point leave F = 0.',
      stories: { F: 'Pure water has {C} component and {P} phases are in equilibrium. How many variables can be set freely?' } }
  ],
  examples: [
    { title: 'A hundred atmospheres on ice', q: 'By how much does 100 atm lower the melting point of ice at 0 °C? Check with the melting curve of the IAPWS equation.',
      steps: [{ text: 'The volume change on melting per kilogram:', tex: '\\frac{1}{999.84} - \\frac{1}{916.7} = -9.07\\times10^{-5}\\ \\mathrm{m^3/kg}' }, { text: 'Clapeyron:', tex: '\\Delta T = \\frac{273.15\\times(-9.07\\times10^{-5})\\times 1.013\\times10^{7}}{3.3355\\times10^{5}} = -0.75\\ \\mathrm{K}' }, 'The melting curve of the standard formulation gives a fall of 0.77 K between 1 atm (0.0025 °C) and 101 atm; the straight-line estimate is 3 % low because the curve bends.'],
      a: 'About −0.75 K: ice under 100 atmospheres melts at −0.75 °C. Each atmosphere lowers the melting point by 0.0075 K.' },
    { title: 'Squeezing water into ice at room temperature', q: 'At what pressure does water at 25 °C freeze, and into what?',
      steps: ['On the melting curve of ice VI, $p = 632.4\\ \\mathrm{MPa}\\times\\left[1 - 1.07476\\left(1 - (T/273.31)^{4.6}\\right)\\right]$.', 'At $T = 298.15$ K: $(298.15/273.31)^{4.6} = 1.492$, so $p = 632.4\\times[1 + 1.07476\\times0.492] = 632.4\\times1.529 = 967$ MPa.', 'That is 9,500 atmospheres, about 1 GPa, found in the deep interior of a large moon but also in a diamond anvil in a laboratory.'],
      a: 'At about 0.97 GPa (9,500 atm) water at 25 °C freezes into ice VI. It is ice, but at room temperature.' }
  ],
  quiz: [
    { q: 'Liquid water cannot exist at a pressure of 100 Pa, at any temperature.', a: true, why: 'The triple-point pressure is 611.657 Pa. Below it, ice warms into vapour without ever becoming liquid; there is no liquid region at all.' },
    { q: 'Compared with most substances, the melting curve of ice Ih leans the opposite way because', choices: ['ice is denser than water', 'ice is less dense than water', 'ice has a greater latent heat', 'ice has a higher specific heat'], a: 1, why: 'Clapeyron\'s relation makes the slope proportional to 1/(volume change on melting). Water shrinks on melting, so the slope is negative.' },
    { q: 'By how much does an extra 100 atmospheres lower the melting point of ice, in kelvin?', answer: 0.75, unit: 'K', why: '0.0075 K per atmosphere times 100 = 0.75 K. Even a thousand atmospheres only lowers it by about 7.5 K.' },
    { q: 'A sample of water at −10 °C and 1 atmosphere is', choices: ['liquid, supercooled', 'ice Ih', 'vapour', 'ice III'], a: 1, why: 'At 1 atmosphere the stable phase below 0 °C is ice Ih. (Liquid water can persist there only if supercooled — metastable, not a stable region of the diagram.)' },
    { q: 'How many phases coexist at the triple point of pure water, and how many variables can be changed freely?', choices: ['3 and 0', '3 and 1', '2 and 1', '3 and 2'], a: 0, why: 'Three phases, ice, liquid and vapour, with $F = 1 - 3 + 2 = 0$: temperature and pressure are both fixed.' }
  ],
  applications: ['Freeze-drying coffee, pharmaceuticals and museum paper: freeze, then pump below 611.657 Pa so the ice sublimes without melting.', 'Glaciology: the pressure-melting temperature at the base of an ice sheet decides whether the ice slides on a film of water or is frozen to the bedrock.', 'High-pressure science: diamond-anvil cells produce ice VI, VII and X to study the interiors of Ganymede, Titan and the ice giants ([[high-pressure-ices]]).', 'Steam power: the boiler operating conditions are chosen from the vaporisation curve, up to and beyond the critical point.', 'Cooking and vacuum-cooling: the lines of the diagram tell you at what temperature water boils at any pressure from a vacuum chamber to a cooker.'],
  history: 'James Thomson, brother of William Thomson (Lord Kelvin), predicted in 1849 from Clapeyron\'s equation that pressure should lower the melting point of ice, and William confirmed 0.0075 K per atmosphere the next year. Josiah Willard Gibbs gave the phase rule in 1876. Percy Bridgman, whose high-pressure work won him the Nobel Prize in Physics in 1946, discovered ices III, V, VI and VII between 1900 and 1912.',
  sources: ['Wagner, Riethmann, Feistel and Harvey, "New equations for the sublimation pressure and melting pressure of H₂O ice Ih", *Journal of Physical and Chemical Reference Data* 40, 043103 (2011); IAPWS release R14-08 (2011).', 'Bridgman, "Water, in the liquid and five solid forms, under pressure", *Proceedings of the American Academy of Arts and Sciences* 47, 441 (1912).', 'Petrenko and Whitworth, *Physics of Ice* (Oxford, 1999), on the phase diagram of water.', 'Atkins and de Paula, *Physical Chemistry*, on phase diagrams and the Clapeyron equation.'],
  sim: 'mb-phase-diagram'
},

/* ================================================================ 7 */
{
  id: 'supercritical-water', parent: 'melting-and-boiling', title: 'Supercritical water', level: 3,
  short: 'Heat water in a sealed tube and at 373.946 °C the surface between liquid and vapour fades and vanishes: both have reached 322 kg/m³. Above that temperature and 22.064 MPa the fluid has no boiling, no surface and no latent heat; its hydrogen-bond net is in tatters, it dissolves oil and gases and rejects salt, and it burns waste at 99.99 % efficiency.',
  keywords: ['supercritical water', 'critical point', 'critical opalescence', 'SCWO', 'supercritical water oxidation', 'black smoker', 'hydrothermal vent', 'near-critical water', 'dielectric constant', 'supercritical steam', 'ultra-supercritical power plant', '374 degrees'],
  prereq: ['the-phase-diagram', 'latent-heat-of-vaporisation', 'the-dielectric-constant'],
  related: ['the-triple-point-standard', 'water-and-volcanoes', 'surface-tension', 'cooperativity', 'the-structure-of-liquid-water', 'like-dissolves-like', 'the-list-of-anomalies', 'chemistry:phase-diagrams', 'chemistry:solubility'],
  body: `
Seal a quarter of a tube with water, the rest empty of air, and heat it slowly in a strong chamber. At 100 °C a little more vapour; at 300 °C the liquid has swollen and the surface is still sharp and bright. At 370 °C the surface begins to blur, and the whole tube turns a milky brown. At 373.9 °C the surface is gone. The liquid has expanded and thinned, the vapour has compressed and thickened, and the two have met at the same density, **322 kg/m³**, less than a third of water's density at room temperature and more than five hundred times that of steam at the boil. There is no longer a boundary, no longer a difference, and no way of saying which is liquid and which is gas. This is the **critical point**: 373.946 °C, 22.064 MPa (218 atmospheres).

### What happens at the point
As the point nears, everything about the liquid–vapour boundary vanishes:
- **Surface tension falls to zero**: 72.7 mN/m at 20 °C, 14.4 at 300 °C, 3.7 at 350 °C, 0.4 at 370 °C and nothing at 374 °C. Without surface tension there is no meniscus.
- **The latent heat falls to zero**: 2,257 kJ/kg at 100 °C and nothing at the critical point; the two phases are the same fluid.
- **The density differences close up**: liquid and vapour meet at 322 kg/m³, far from the ideal-gas value of 74 kg/m³ for that temperature and pressure. The compressibility factor $Z = pM/(\\rho RT)$ is only 0.23; water is as far from a perfect gas as a vapour gets.
- **Fluctuations grow**: patches of denser and thinner fluid appear on all sizes up to the wavelength of light, which scatters strongly, so the tube becomes opaque. This is **critical opalescence**, first seen in carbon dioxide by Thomas Andrews.

If the tube is filled to exactly 322 kg/m³ the surface fades in the middle. If it holds more, the liquid rises to the top before the critical temperature and the tube is full of liquid; if less, the liquid evaporates entirely and the tube is full of vapour. Only at the critical filling does the meniscus melt away in place.

### Beyond the point: a tunable solvent
Above both 373.9 °C and 22.06 MPa, water is a **supercritical fluid**. It can be taken from gas-like to liquid-like density by raising the pressure a little, with no boiling and no boundary at any stage: near 400 °C, an increase from 25 to 30 MPa roughly doubles the density. Everything that depends on the hydrogen-bond net changes with it:
- **Structure.** The tetrahedral net is broken into small clusters, chains and lone molecules; a good share of molecules still hold a bond at the critical density, but none belongs to a network that spans the fluid.
- **Dielectric constant.** The 78 of room-temperature water falls to roughly 6 at 400 °C and 25 MPa, like an organic solvent such as chloroform. The force between charges that water divides by 78 is divided by a number a dozen times smaller ([[the-dielectric-constant]]).
- **Solvent power.** So hot dense water, a poor solvent for oil at 25 °C, becomes a good one at 400: hexane, benzene and oils mix with it in all proportions, and so do oxygen, nitrogen and carbon dioxide. Salts, which need water's high dielectric constant to dissolve, are rejected: sodium chloride, a third of a kilogram per litre at room temperature, falls to tens or hundreds of milligrams per litre at 25 MPa and 450 °C and precipitates as a fine powder.
- **Chemistry.** The ion product of water peaks near 10⁻¹¹ at about 300 °C (a thousand times 10⁻¹⁴), then collapses by many orders of magnitude in the dilute supercritical fluid.

### Where it is used
- **Supercritical water oxidation.** An organic waste stream is pumped to 25 MPa, mixed with air or oxygen and heated to 400–650 °C. Because organics and oxygen dissolve completely in one phase, they burn in seconds to minutes, without flame, to carbon dioxide, water and nitrogen; destruction efficiencies above 99.99 % are reported for chlorinated solvents, sewage sludge and chemical-weapons hydrolysates. The salts fall out as solids, which can plug and corrode the reactor and is the engineering difficulty.
- **Power stations.** Supercritical boilers run steam at 24–30 MPa and 565–600 °C. Because the working fluid passes smoothly from water to steam there is no boiling stage, and the plant reaches 42–47 % efficiency against 33–38 % for subcritical steam.
- **Chemical synthesis and conversion.** Biomass is gasified to hydrogen and methane; nanoparticles of oxides are made by precipitating metal salts in hot dense water.

### Black smokers: nature\'s version
Water 3 km below the sea carries a pressure of 30 MPa, above the critical pressure of pure water. At mid-ocean ridges, sea water heated by magma returns to the seafloor at 350–400 °C and sometimes more — more than 400 °C has been measured about 3,000 m down on the Mid-Atlantic Ridge by Koschinsky and colleagues (2008) — and where it is hot and deep enough it is supercritical (the critical point of sea water is a little higher than pure water's, 407 °C and 29.8 MPa). It leaves the vent black with precipitated metal sulfides, as a "black smoker". Vents shallower than about 2.2 km are below the critical pressure of pure water, and their fluid boils: the vapour and the brine separate, which is why the salinity of vent fluids varies so much ([[water-and-volcanoes]]).

> [!key] At 373.946 °C and 22.064 MPa the surface between liquid and vapour vanishes at 322 kg/m³, leaving a supercritical fluid whose hydrogen-bond net is in pieces: it dissolves oil and gases, rejects salt, burns waste in a single phase and fills black smokers three kilometres down. Water has a single fluid state above the critical point and no boiling, surface or latent heat.`,
  ideas: ['The critical point of water is 373.946 °C, 22.064 MPa, 322 kg/m³: liquid and vapour become identical, and the surface tension and latent heat fall to zero.', 'Above it water is a supercritical fluid with a continuous range of densities and no boiling; its density, dielectric constant (about 6 near 400 °C and 25 MPa) and solvent power can be tuned with pressure.', 'Hot dense water dissolves oil and gases, but not salt; supercritical water oxidation and supercritical steam plants exploit this.', 'Black smokers at about 3 km depth and 400 °C and above are natural supercritical water, the sea-floor heat engine that feeds deep-sea ecosystems.'],
  pitfalls: ['"Supercritical water is a very hot gas" — Its density can be that of a liquid (hundreds of kg/m³ or more); it is neither a gas nor a liquid, and you can go from one to the other round the critical point without ever boiling.', '"Supercritical fluids cannot be seen" — Near the critical point critical opalescence makes the fluid milky; what vanishes is the meniscus, not the fluid.', '"Squeeze steam hard enough and it condenses" — Only below 373.9 °C. Above it no pressure produces a liquid with a surface; the fluid only gets steadily denser.'],
  terms: [
    { term: 'Supercritical fluid', def: 'A fluid above both its critical temperature and its critical pressure: neither a gas nor a liquid, with no boiling and no surface, whose density can be varied continuously from gas-like to liquid-like.' },
    { term: 'Critical opalescence', def: 'The milky cloudiness of a fluid near its critical point, caused by density fluctuations on the scale of the wavelength of light scattering it strongly.' },
    { term: 'Supercritical water oxidation', also: ['SCWO', 'hydrothermal oxidation'], def: 'Destruction of organic waste by oxygen dissolved in water above 374 °C and 22 MPa. Organics and oxygen form one phase and burn in seconds to carbon dioxide, water and nitrogen.' },
    { term: 'Black smoker', also: ['hydrothermal vent'], def: 'A chimney on the sea floor, often 2–4 km deep at a mid-ocean ridge, from which water at 350–400 °C or more, black with metal sulfide particles, flows out of the rock.' },
    { term: 'Near-critical water', also: ['hot compressed water', 'subcritical water'], def: 'Liquid water at 250–374 °C under enough pressure to keep it liquid. Its ion product is about a thousand times that of cold water, so it acts as a mild acid and base catalyst for reactions in food and biomass chemistry.' }
  ],
  formulas: [
    { name: 'Compressibility factor', expr: 'Z = p*M/(rho*R*T)', tex: 'Z = \\frac{p\\,M}{\\rho\\,R\\,T}',
      vars: { Z: { name: 'compressibility factor', tex: 'Z', hint: 'Exactly 1 for an ideal gas; 0.23 for water at its critical point.' }, p: { name: 'pressure', q: 'pressure', unit: 'MPa', value: 22.064, tex: 'p' }, M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015, tex: 'M' }, rho: { name: 'density', q: 'density', unit: 'kg/m³', value: 322, tex: '\\rho' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 373.946, tex: 'T' } },
      solveFor: 'Z', note: 'At the critical point of water Z = 0.229; the ideal gas law would give the density 74 kg/m³ instead of 322, a factor 4.4.',
      stories: { Z: 'Water at {p} and {T} has density {rho}. What is its compressibility factor?', rho: 'Water at {p} and {T} has compressibility factor {Z}. What is its density?' } },
    { name: 'Pressure at depth', expr: 'p = p0 + rho*g*h', tex: 'p = p_0 + \\rho\\,g\\,h',
      vars: { p: { name: 'absolute pressure', q: 'pressure', unit: 'MPa' }, p0: { const: 'atm', tex: 'p_0' }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, g: { const: 'g' }, h: { name: 'depth', q: 'length', unit: 'm', value: 3000, tex: 'h' } },
      solveFor: 'p', note: 'Treats the water as incompressible, which slightly underestimates the pressure at several kilometres. The critical pressure of pure water is reached at 2.2 km, that of sea water (29.8 MPa) at about 2.95 km.',
      stories: { p: 'A hydrothermal vent lies {h} under the sea. What is the pressure there?', h: 'At what depth does sea water of density {rho} reach {p}?' } },
    { name: 'Self-heating of a waste stream', expr: 'dT = w*Hc/c', tex: '\\Delta T = \\frac{w\\,H_c}{c}',
      vars: { dT: { name: 'adiabatic temperature rise', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, w: { name: 'mass fraction of organic material', q: 'ratio', unit: '%', value: 8, tex: 'w' }, Hc: { name: 'heat of combustion of the organics', q: 'latent', unit: 'MJ/kg', value: 19.9, tex: 'H_c', hint: 'Methanol 19.9 MJ/kg, ethanol 26.8, glucose 15.6, sewage sludge solids 10–20.' }, c: { name: 'mean specific heat of the water', q: 'specificheat', unit: 'kJ/(kg·K)', value: 6, tex: 'c', hint: 'About 6 kJ/(kg·K) averaged from room temperature to 500 °C at 25 MPa: it peaks far higher near the critical point.' } },
      solveFor: 'dT', note: 'Illustrative: the temperature rise if all the combustion heat stays in the stream. A stream of more than about 6–8 % organics heats itself; weaker streams need fuel or a heat exchanger.',
      stories: { dT: 'A waste stream is {w} organic matter with a heating value of {Hc}, and is fully oxidised in supercritical water. By how much does it self-heat, with {c} as the mean specific heat?' } }
  ],
  examples: [
    { title: 'Is the vent supercritical?', q: 'A vent at 2,500 m depth discharges fluid at 380 °C. Treating it as pure water, is it boiling, liquid or supercritical? What if the vent is at 3,000 m and 410 °C?',
      steps: [{ text: 'Pressure at 2,500 m:', tex: 'p = 101\\,325 + 1025\\times9.807\\times2500 = 25.2\\ \\mathrm{MPa}' }, 'That exceeds the critical pressure 22.06 MPa, and the boiling point of water at 25 MPa does not exist: the vaporisation curve ended at 373.9 °C. So 380 °C is above the critical temperature and the fluid is supercritical.', { text: 'At 3,000 m:', tex: 'p = 101\\,325 + 1025\\times9.807\\times3000 = 30.3\\ \\mathrm{MPa}' }, '410 °C at 30.3 MPa is also supercritical. (Sea water has a higher critical point, 407 °C and 29.8 MPa, so the 410 °C fluid is only just beyond it, and the 380 °C fluid at 2,500 m is on the two-phase side of it.)'],
      a: 'Supercritical in both cases for pure water. For sea water, whose critical point is higher, only the second case is, and only just.' },
    { title: 'Burning methanol in water', q: 'A waste stream is 8 % methanol by mass (heating value 19.9 MJ/kg) and the rest water, oxidised completely in supercritical water, with mean specific heat 6 kJ/(kg·K). How much does it heat itself?',
      steps: [{ text: 'Heat released per kilogram of stream:', tex: '0.08\\times19.9\\ \\mathrm{MJ} = 1.59\\ \\mathrm{MJ}' }, { text: 'Temperature rise:', tex: '\\Delta T = \\frac{1.59\\times10^{6}}{6000} = 265\\ \\mathrm{K}' }, 'A feed preheated to 300–400 °C by the hot effluent rises to 550–650 °C on oxidation: self-sustaining.'],
      a: 'About 265 K, enough for the stream to heat itself from a preheat of a few hundred degrees to the 500–650 °C of the reactor, with no fuel.' }
  ],
  quiz: [
    { q: 'A sealed tube is filled with water to exactly its critical density and heated slowly. At 373.9 °C', choices: ['the liquid boils away', 'the meniscus fades and vanishes in the middle of the tube', 'the tube fills with liquid', 'the water freezes'], a: 1, why: 'At the critical density the liquid and vapour densities converge on the same value, so the surface between them blurs, the fluid turns milky and the boundary disappears where it stood.' },
    { q: 'Supercritical water has no surface tension.', a: true, why: 'Surface tension is a property of the interface between liquid and vapour; above the critical point there is none, and in practice it reaches zero at the critical temperature.' },
    { q: 'What is the absolute pressure at 3,000 m below the sea (sea-water density 1,025 kg/m³), in MPa?', answer: 30.3, unit: 'MPa', why: 'p = 101 325 + 1025 × 9.81 × 3000 = 30.3 MPa, or about 300 bar. That is above the critical pressure of pure water, 22.06 MPa.' },
    { q: 'Why does supercritical water dissolve oil but reject salt?', choices: ['it is denser than ice', 'its dielectric constant falls to about 6, so it favours nonpolar molecules over ions', 'its pH is neutral', 'its surface tension is high'], a: 1, why: 'Dissolving ions needs a high dielectric constant to screen the attraction between them; at around 6, water behaves like an organic solvent, mixing with hydrocarbons but unable to separate salt.' },
    { q: 'A vent at 2,000 m depth emits 380 °C fluid. Taking the pressure as 20.2 MPa and the fluid as pure water, it is', choices: ['a liquid at 380 °C', 'steam: the boiling point at 20.2 MPa is 366 °C', 'supercritical', 'a solid'], a: 1, why: 'The critical pressure is 22.06 MPa and 20.2 is below it, so the vaporisation curve applies: water boils at 366 °C at 20.2 MPa, and at 380 °C it is a vapour. This boiling at shallow vents separates brine from steam.' }
  ],
  applications: ['Supercritical water oxidation plants for sewage sludge, industrial solvents and military waste, where a closed reactor destroys organics without a flame.', 'Supercritical and ultra-supercritical steam boilers in coal, gas and nuclear plants, which gain several points of efficiency by going beyond 22 MPa.', 'Biomass conversion: gasification to hydrogen, liquefaction of algae and sludge in near-critical water.', 'Geology and the origin of life: black smokers, ore deposition and the chemistry at the sea floor, where water at 400 °C leaches metals from the rock ([[water-and-volcanoes]]).', 'Nuclear reactor design: Generation IV supercritical-water reactors use water above the critical point as coolant and moderator.'],
  history: 'Charles Cagniard de la Tour discovered the critical state in 1822: heating alcohol, ether and water in a sealed gun barrel with a flint ball rolling inside, he heard the sound of the ball change at a certain temperature, and saw in glass tubes the surface vanish. Thomas Andrews named the "critical point" in 1869 from his work on carbon dioxide. Supercritical water oxidation was developed from the 1980s by Michael Modell, then at MIT, as a way of destroying hazardous waste without incinerating it.',
  sources: ['Marcus, *Supercritical Water: A Green Solvent: Properties and Uses* (Wiley, 2012).', 'Wagner and Pruß, "The IAPWS formulation 1995 for the thermodynamic properties of ordinary water substance", *Journal of Physical and Chemical Reference Data* 31, 387 (2002) — critical constants and density.', 'Bischoff and Rosenbauer, "The critical point and two-phase boundary of seawater, 200–500 °C", *Earth and Planetary Science Letters* 68, 172 (1984).', 'Koschinsky et al., "Hydrothermal venting at pressure–temperature conditions above the critical point of seawater, 5°S on the Mid-Atlantic Ridge", *Geology* 36, 615 (2008).'],
  sim: 'mb-supercritical'
},

/* ================================================================ 8 */
{
  id: 'the-triple-point-standard', parent: 'melting-and-boiling', title: 'The triple point as a standard', level: 2,
  short: 'For 65 years the kelvin was one 273.16th of the temperature at which ice, water and vapour coexist. A glass cell of pure water of the right isotopic mix held that temperature to a tenth of a millikelvin; since 2019 the kelvin is defined by the Boltzmann constant, and the triple point of water is something we measure, at 273.1600 K.',
  keywords: ['triple point of water', 'kelvin definition', '273.16 K', 'triple-point cell', 'ice point', 'VSMOW', 'ITS-90', 'Boltzmann constant', '2019 redefinition', 'fixed point', 'temperature standard', 'isotopic composition'],
  prereq: ['the-phase-diagram', 'isotopes-and-heavy-water', 'melting-and-the-latent-heat-of-fusion'],
  related: ['water-as-a-standard', 'boiling-at-altitude', 'ultrapure-water', 'colligative-properties', 'water-in-numbers', 'chemistry:isotopes', 'chemistry:phase-diagrams'],
  body: `
Inside a laboratory fridge at a national standards institute there is a glass cylinder the size of a thermos flask, sealed, holding a few hundred grams of the purest water on Earth and nothing else, not even air. A narrow well runs down its middle, and around the well sits a mantle of ice. In the thin layer where the ice has begun to melt, the cylinder holds ice, liquid water and water vapour together, at one temperature and one pressure, and it keeps them there for weeks. From 1954 to 2019 that temperature was the definition of the kelvin.

### Why a point, and why water
To define a temperature scale you need a fixed point that anyone can reproduce. The old Celsius scale used two: ice melting at 0 °C and water boiling at 100 °C. Both depend on conditions: the boiling point moves 1 K for every 3.6 kPa of pressure, so ordinary weather shifts it by ±1.5 K; even the melting point of ice moves with pressure and with dissolved air. The triple point has none of these troubles. By the phase rule ([[the-phase-diagram]]), three phases of a pure substance in equilibrium leave no freedom at all: the temperature and the pressure are fixed by nature. Water's triple point lies at 611.657 Pa and 273.16 K, easily reached, and the pure substance is easy to make.

The 10th General Conference on Weights and Measures chose it in 1954: **the kelvin is 1/273.16 of the thermodynamic temperature of the triple point of water** (the unit was named in 1967). The number 273.16 was picked so that the new kelvin was the same size as the old Celsius degree: a Celsius thermometer reads 0.01 °C at the triple point.

### Why 0.01 °C?
The triple point is 0.01 K above the ice point, and the two reasons are physical:
- **Pressure.** At the triple point the pressure is 611.657 Pa; at 1 atm it is 101 325 Pa. The melting curve leans left at $-7.4\\times10^{-8}$ K/Pa, so the extra pressure lowers the melting point by 7.5 mK.
- **Dissolved air.** Water exposed to air at 0 °C holds about 1.2 millimoles of nitrogen, oxygen and argon per kilogram. Each dissolved particle lowers the freezing point by 1.86 K per mole per kilogram: 2.3 mK.

Together 9.8 mK, which is 0.01 K to the precision of the old thermometers. The ice point (0 °C, 273.15 K) is a point on the melting curve at one atmosphere in air-saturated water; the triple point is a different place in the diagram.

### A triple-point cell
The cell is made of borosilicate or fused silica, filled with water distilled many times under vacuum and sealed off. Cooled from the inside with a cold rod, it grows a mantle of ice; the rod is withdrawn and a thin layer of the ice around the central well melts, leaving ice, liquid and vapour in contact. A standard platinum thermometer slipped into the well reads the triple point with a reproducibility of 50 microkelvins — a few parts in 10⁷ of the temperature. The International Temperature Scale of 1990 (ITS-90) is anchored on it, together with the triple points of argon (83.8058 K) and mercury (234.3156 K) and the melting point of gallium (302.9146 K).

### The isotope problem
Water is not one substance but a family: $\\ce{H2O}$ with a little $\\ce{HDO}$ and $\\ce{H2^{18}O}$, and the molecules differ in their triple points. Pure heavy water, $\\ce{D2O}$, has its triple point at 276.97 K, 3.82 K higher. Natural water differs by a few parts in ten thousand in its deuterium, and since the triple point shifts roughly in proportion, the temperature of a cell depends on where its water came from: about 0.6 mK per unit of relative change in deuterium. Antarctic snow, with 43 % less deuterium than the oceans, would give a triple point about a quarter of a millikelvin lower. In 2005 the definition of the kelvin was therefore tied to water of the composition of **Vienna Standard Mean Ocean Water (VSMOW)**: 0.00015576 mole of deuterium per mole of hydrogen, and the specified ratios of the oxygen isotopes.

### 2019: the kelvin gets a new definition
On 20 May 2019 the kelvin was redefined by fixing the value of the Boltzmann constant, $k_B = 1.380\\,649\\times10^{-23}$ J/K exactly. Temperature is now an energy per particle, and the triple point of water, no longer a definition, became a measurement: the best value is 273.1600 K, with an uncertainty of about 0.1 mK. The change was designed to make no difference to ordinary thermometry, and none occurred. The triple-point cell is still used to calibrate thermometers every day.

> [!key] Three phases of a pure substance leave no freedom, so the triple point of water at 273.16 K (0.01 °C) is a temperature that nature fixes. It defined the kelvin from 1954 to 2019, sits 10 mK above the ice point because of pressure and dissolved air, and demands water of ocean-average isotopic composition; today the kelvin is defined by the Boltzmann constant and the triple point is measured at 273.1600 K.`,
  ideas: ['At the triple point (611.657 Pa, 273.16 K) the phase rule leaves no freedom: temperature and pressure are fixed by nature, so it makes a perfect reproducible standard.', 'From 1954 to 2019 the kelvin was 1/273.16 of the thermodynamic temperature of the triple point; 273.16 was chosen so that a kelvin is the size of the old Celsius degree.', 'The ice point (0 °C) is 9.8 mK below the triple point: 7.5 mK from the pressure of 1 atmosphere and 2.3 mK from dissolved air.', 'Isotopic composition changes the triple point by fractions of a millikelvin, so the definition specified VSMOW water; since 2019 the kelvin is defined by fixing the Boltzmann constant.'],
  pitfalls: ['"Water freezes at exactly 0 °C and boils at exactly 100 °C by definition" — Not since 1954: the Celsius degree is defined from the kelvin, and at one atmosphere water boils at 99.97 °C and (air-free) melts at 0.0025 °C.', '"The 2019 redefinition changed the temperature of the triple point" — It changed what is fixed: the Boltzmann constant now, the triple point of water before. The triple point is still at 273.16 K to within 0.1 mK.', '"All pure water has the same triple point" — A sample from Antarctic snow differs from ocean water by a quarter of a millikelvin, and heavy water by 3.8 K.'],
  terms: [
    { term: 'Kelvin', also: ['K', 'thermodynamic temperature unit'], def: 'The SI unit of thermodynamic temperature. From 1954 to 2019 it was 1/273.16 of the temperature of the triple point of water; since 20 May 2019 it is defined by fixing the Boltzmann constant at 1.380649×10⁻²³ J/K.' },
    { term: 'Triple-point cell', also: ['water triple-point cell', 'TPW cell'], def: 'A sealed glass cell of highly purified water, with a well for a thermometer and an ice mantle, in which ice, liquid and vapour coexist at 273.16 K; the primary calibration reference for thermometers.' },
    { term: 'Ice point', also: ['melting point of ice', '0 °C'], def: 'The temperature at which ice and air-saturated water coexist at one atmosphere: 0.0000 °C (273.15 K) by definition of the Celsius scale, 9.8 mK below the triple point.' },
    { term: 'Vienna Standard Mean Ocean Water', also: ['VSMOW', 'VSMOW2'], def: 'The reference water defined by the International Atomic Energy Agency whose isotopes match the average ocean: deuterium to hydrogen 1.5576×10⁻⁴, oxygen-18 to oxygen-16 2.0052×10⁻³. It specifies the composition of the water of the triple-point definition.' },
    { term: 'International Temperature Scale of 1990', also: ['ITS-90'], def: 'The practical temperature scale agreed in 1990, defined by the temperatures of 17 fixed points (including the triple point of water at 273.16 K) and by interpolating thermometers between them.' },
    { term: 'Boltzmann constant', also: ['k_B'], def: 'The constant linking temperature to energy per particle, 1.380649×10⁻²³ J/K, exactly, since 2019; the definition of the kelvin rests on it.' }
  ],
  formulas: [
    { name: 'The ice point from the triple point', expr: 'T = Ttp - s*(p - ptp) - Kf*m', tex: 'T_{ice} = T_{tp} - s\\,(p - p_{tp}) - K_f\\,m',
      vars: { T: { name: 'melting temperature of ice', q: 'temperature', unit: '°C', tex: 'T_{ice}' }, Ttp: { name: 'triple-point temperature', q: 'temperature', unit: '°C', value: 0.01, fixed: true, tex: 'T_{tp}' }, s: { name: 'slope of the melting curve (lowering per pascal)', unit: 'K/Pa', value: 7.445e-8, tex: 's', hint: '7.4×10⁻⁸ K/Pa, or 7.5 mK per atmosphere.' }, p: { name: 'pressure on the ice', q: 'pressure', unit: 'Pa', value: 101325, tex: 'p' }, ptp: { name: 'triple-point pressure', q: 'pressure', unit: 'Pa', value: 611.657, fixed: true, tex: 'p_{tp}' }, Kf: { name: 'freezing-point constant of water', unit: 'K·kg/mol', value: 1.86, fixed: true, tex: 'K_f' }, m: { name: 'dissolved gas', q: 'molality', unit: 'mmol/kg', value: 1.24, tex: 'm', hint: 'Water saturated with air at 0 °C holds about 1.24 mmol/kg: nitrogen 0.76, oxygen 0.46, argon 0.02.' } },
      solveFor: 'T', note: 'At one atmosphere with air-saturated water it gives 0.0002 °C, within 0.2 mK of the ice point. Remove the gas and the ice melts 2.3 mK warmer; reduce the pressure to 611.657 Pa and you are at the triple point.',
      stories: { T: 'Ice at a pressure of {p} contains {m} of dissolved gas. At what temperature does it melt?', p: 'Ice with {m} of dissolved gas melts at {T}. What is the pressure?' } },
    { name: 'Isotopic shift of the triple point', expr: 'dT = dTD*xV*dlt', tex: '\\Delta T = \\Delta T_D\\; x_V\\; \\delta',
      vars: { dT: { name: 'shift of the triple point', q: 'dtemp', unit: 'mK', signed: true, tex: '\\Delta T' }, dTD: { name: 'triple point of D₂O minus that of H₂O', q: 'dtemp', unit: 'K', value: 3.82, fixed: true, tex: '\\Delta T_D' }, xV: { name: 'deuterium to hydrogen ratio of VSMOW', q: 'ratio', unit: 'ppm', value: 155.76, fixed: true, tex: 'x_V' }, dlt: { name: 'relative deuterium content compared with VSMOW', q: 'ratio', unit: '%', value: -43, signed: true, tex: '\\delta', hint: 'Negative for waters with less deuterium than the oceans: −43 % is Antarctic snow, 0 is ocean water.' } },
      solveFor: 'dT', note: 'A linear estimate: it takes the triple point to rise in proportion to the deuterium fraction, from 273.16 K for ordinary water to 276.97 K for D₂O. It gives 0.6 mK for a doubling of deuterium; oxygen isotopes add a smaller effect.',
      stories: { dT: 'Water has a deuterium content {dlt} relative to VSMOW. By how much is its triple point shifted?', dlt: 'The triple point of a sample lies {dT} from the VSMOW value. What is its relative deuterium content?' } },
    { name: 'Thermal energy at the triple point', expr: 'E = kB*T', tex: 'E = k_B\\,T',
      vars: { E: { name: 'thermal energy per particle', q: 'energy', unit: 'J' }, kB: { const: 'kB', tex: 'k_B' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 0.01, tex: 'T' } },
      solveFor: 'E', note: 'The 2019 definition fixes kB; a temperature is therefore an energy per particle, 3.77×10⁻²¹ J (0.0235 eV, 2.27 kJ/mol) at the triple point.',
      stories: { E: 'What is the thermal energy per particle at the triple point of water, {T}?', T: 'What temperature has a thermal energy per particle of {E}?' } }
  ],
  examples: [
    { title: 'Why the ice point is 0.01 K below the triple point', q: 'Account for the 9.8 mK gap between the triple point (273.16 K) and the ice point (273.15 K).',
      steps: [{ text: 'Pressure: the extra pressure of one atmosphere over the triple point,', tex: 'p - p_{tp} = 101\\,325 - 612 = 100\\,713\\ \\mathrm{Pa}, \\quad \\Delta T = -7.445\\times10^{-8}\\times100\\,713 = -7.50\\ \\mathrm{mK}' }, { text: 'Dissolved air: 0.76 + 0.46 + 0.02 = 1.24 mmol/kg of gas at saturation,', tex: '\\Delta T = -1.86\\times1.24\\times10^{-3} = -2.3\\ \\mathrm{mK}' }, 'Together: $-9.8$ mK.'],
      a: 'The ice point lies 9.8 mK below the triple point — 7.5 mK from pressure and 2.3 mK from the air in the water — which the Celsius scale rounds to 0.01 K.' },
    { title: 'Antarctic snow in a cell', q: 'A cell is filled with water melted from Antarctic snow, whose deuterium content is 43 % below that of VSMOW. How far is its triple point from the standard, and is that significant for a thermometer calibrated to 0.1 mK?',
      steps: [{ text: 'Triple point of D₂O above that of H₂O: 3.82 K; deuterium fraction of VSMOW: $1.5576\\times10^{-4}$.', tex: 'S = 3.82\\times1.5576\\times10^{-4} = 0.595\\ \\mathrm{mK\\ per\\ unit\\ of\\ relative\\ change}' }, { text: 'The snow is 43 % lower:', tex: '\\Delta T = 0.595\\times(-0.43) = -0.26\\ \\mathrm{mK}' }, 'The shift is 2.5 times larger than the 0.1 mK of the best measurements, so a cell of such water would calibrate every thermometer 0.26 mK low.'],
      a: 'The triple point would be about 0.26 mK lower, which is why the definition specifies the isotopic composition of ocean water.' }
  ],
  quiz: [
    { q: 'Since 2019 the kelvin is defined by', choices: ['the triple point of water', 'the boiling point of water at 1 atmosphere', 'fixing the numerical value of the Boltzmann constant', 'the melting point of ice'], a: 2, why: 'The Boltzmann constant is fixed at 1.380649×10⁻²³ J/K, so a temperature is an energy per particle. The triple point of water, formerly the definition, is now a measured value, 273.1600 K ± 0.0001.' },
    { q: 'By the present definition of the kelvin the triple point of water is exactly 273.16 K.', a: false, why: 'It was exactly 273.16 K until 2019. Now it is measured: 273.1600 K with an uncertainty of about 0.1 mK. The old and new values agree to that accuracy by design.' },
    { q: 'By how many millikelvin does the triple point of water (273.16 K) lie above the ice point (273.15 K)?', answer: 10, unit: 'mK', why: '0.01 K = 10 mK; the physical sum is 9.8 mK (7.5 from pressure plus 2.3 from dissolved air), rounded to 10 when the scale was defined.' },
    { q: 'The triple point makes a better standard than the boiling point because', choices: ['it is hotter', 'at three phases the phase rule leaves no free variable, so pressure and temperature are fixed', 'it is easier to measure with a mercury thermometer', 'water boils at different temperatures in different countries'], a: 1, why: 'With three phases in equilibrium F = 1 − 3 + 2 = 0: neither temperature nor pressure can be altered. The boiling point shifts 1 K with every 3.6 kPa of pressure.' },
    { q: 'Why does the definition of the kelvin from 2005 to 2019 specify "water of the isotopic composition of VSMOW"?', choices: ['to ensure the water is safe to drink', 'because the triple point shifts by fractions of a millikelvin with the deuterium and oxygen-18 content', 'because heavy water boils lower', 'to fix the pressure'], a: 1, why: 'Natural waters differ in their deuterium and oxygen-18 content; heavy water has its triple point at 276.97 K. Without a specified composition the unit would depend on where the sample was collected.' }
  ],
  applications: ['Thermometer calibration: platinum resistance thermometers are checked in triple-point cells in national laboratories, and by them in everyone else\'s.', 'Climate records: every long-term temperature series rests on thermometers whose scale is anchored at 273.16 K.', 'Isotope science: VSMOW is the zero of the delta scales used to date ice cores, trace the origin of water and study climate ([[isotopes-and-heavy-water]]).', 'Metrology: the redefinition of the kelvin was one of four SI changes in 2019 that tied the units to constants of nature ([[water-as-a-standard]]).'],
  history: 'Kelvin proposed in 1854 that a thermodynamic scale needs only a single fixed point. The 10th General Conference on Weights and Measures chose the triple point of water as that point in 1954 and the name "kelvin" followed in 1967. In 2005 the International Committee for Weights and Measures specified the isotopic composition of VSMOW for the definition, and on 20 May 2019 the kelvin was redefined by the Boltzmann constant.',
  sources: ['BIPM, *The International System of Units (SI)*, 9th edition (2019), the definition of the kelvin and its appendix on the 2019 change.', 'Preston-Thomas, "The International Temperature Scale of 1990 (ITS-90)", *Metrologia* 27, 3 (1990).', 'Fellmuth et al., "The Kelvin redefinition and its mise en pratique", *Philosophical Transactions of the Royal Society A* 374, 20150037 (2016).', 'Nicholas and White, *Traceable Temperatures* (2nd ed., Wiley, 2001), on triple-point cells and the isotopic effect.'],
  sim: 'mb-triple-point'
}

);
