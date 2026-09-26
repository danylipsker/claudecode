/* HYPER-CORE · units.js
 *
 * Quantities with their units, and the physical constants.
 *
 * Every calculator works in SI internally. A variable names its quantity
 * (q: 'speed') and the reader may type it in any unit of that quantity; the
 * value is converted on the way in and on the way out:
 *
 *     SI value = typed value × factor + offset      (offset only for °C and °F)
 *
 *   Hyper.units.Q.speed.units      [[symbol, factor, offset?], ...]  SI unit first
 *   Hyper.units.toSI(v, q, u), fromSI(v, q, u), convert(v, q, from, to)
 *   Hyper.units.C.c                {v, u, name, tex, q}
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};

  const Q = {
    none:        { name: 'dimensionless', units: [['', 1]] },
    ratio:       { name: 'ratio', units: [['', 1], ['%', 0.01], ['‰', 0.001], ['ppm', 1e-6]] },
    count:       { name: 'count', units: [['', 1]] },
    length:      { name: 'length', units: [['m', 1], ['km', 1e3], ['cm', 1e-2], ['mm', 1e-3], ['µm', 1e-6], ['nm', 1e-9], ['pm', 1e-12], ['fm', 1e-15], ['Å', 1e-10],
                   ['in', 0.0254], ['ft', 0.3048], ['yd', 0.9144], ['mi', 1609.344], ['nmi', 1852], ['AU', 1.495978707e11], ['ly', 9.4607304725808e15], ['pc', 3.0856775814913673e16], ['kpc', 3.0856775814913673e19], ['Mpc', 3.0856775814913673e22], ['Gpc', 3.0856775814913673e25], ['R⊕', 6.371e6], ['R☉', 6.957e8]] },
    area:        { name: 'area', units: [['m²', 1], ['cm²', 1e-4], ['mm²', 1e-6], ['µm²', 1e-12], ['nm²', 1e-18], ['km²', 1e6], ['ha', 1e4], ['in²', 6.4516e-4], ['ft²', 0.09290304], ['acre', 4046.8564224], ['barn', 1e-28]] },
    volume:      { name: 'volume', units: [['m³', 1], ['L', 1e-3], ['mL', 1e-6], ['cm³', 1e-6], ['mm³', 1e-9], ['dm³', 1e-3], ['in³', 1.6387064e-5], ['ft³', 0.028316846592], ['gal', 3.785411784e-3], ['qt', 9.46352946e-4]] },
    mass:        { name: 'mass', units: [['kg', 1], ['g', 1e-3], ['mg', 1e-6], ['µg', 1e-9], ['t', 1e3], ['lb', 0.45359237], ['oz', 0.028349523125], ['u', 1.66053906660e-27], ['MeV/c²', 1.78266192e-30], ['M⊕', 5.9722e24], ['M☉', 1.98847e30]] },
    time:        { name: 'time', units: [['s', 1], ['ms', 1e-3], ['µs', 1e-6], ['ns', 1e-9], ['ps', 1e-12], ['min', 60], ['h', 3600], ['day', 86400], ['yr', 3.15576e7], ['kyr', 3.15576e10], ['Myr', 3.15576e13], ['Gyr', 3.15576e16]] },
    frequency:   { name: 'frequency', units: [['Hz', 1], ['kHz', 1e3], ['MHz', 1e6], ['GHz', 1e9], ['THz', 1e12], ['PHz', 1e15], ['1/min', 1 / 60], ['rpm', 1 / 60]] },
    angle:       { name: 'angle', units: [['rad', 1], ['°', Math.PI / 180], ['rev', 2 * Math.PI], ['mrad', 1e-3], ['′', Math.PI / 10800], ['″', Math.PI / 648000]] },
    solidangle:  { name: 'solid angle', units: [['sr', 1], ['deg²', Math.pow(Math.PI / 180, 2)]] },
    angvel:      { name: 'angular velocity', units: [['rad/s', 1], ['°/s', Math.PI / 180], ['rpm', 2 * Math.PI / 60], ['rev/s', 2 * Math.PI]] },
    angacc:      { name: 'angular acceleration', units: [['rad/s²', 1], ['°/s²', Math.PI / 180], ['rpm/s', 2 * Math.PI / 60]] },
    speed:       { name: 'speed', units: [['m/s', 1], ['km/h', 1 / 3.6], ['km/s', 1e3], ['cm/s', 1e-2], ['mm/s', 1e-3], ['µm/s', 1e-6], ['mph', 0.44704], ['ft/s', 0.3048], ['knot', 1852 / 3600], ['c', 299792458]] },
    accel:       { name: 'acceleration', units: [['m/s²', 1], ['cm/s²', 1e-2], ['ft/s²', 0.3048], ['g₀', 9.80665]] },
    force:       { name: 'force', units: [['N', 1], ['kN', 1e3], ['MN', 1e6], ['mN', 1e-3], ['µN', 1e-6], ['dyn', 1e-5], ['lbf', 4.4482216152605], ['kgf', 9.80665]] },
    energy:      { name: 'energy', units: [['J', 1], ['kJ', 1e3], ['MJ', 1e6], ['GJ', 1e9], ['mJ', 1e-3], ['eV', 1.602176634e-19], ['keV', 1.602176634e-16], ['MeV', 1.602176634e-13], ['GeV', 1.602176634e-10],
                   ['cal', 4.184], ['kcal', 4184], ['Wh', 3600], ['kWh', 3.6e6], ['BTU', 1055.05585262], ['erg', 1e-7], ['ft·lbf', 1.3558179483314], ['Mt TNT', 4.184e15]] },
    power:       { name: 'power', units: [['W', 1], ['mW', 1e-3], ['µW', 1e-6], ['kW', 1e3], ['MW', 1e6], ['GW', 1e9], ['hp', 745.69987158227], ['BTU/h', 0.29307107], ['L☉', 3.828e26]] },
    pressure:    { name: 'pressure', units: [['Pa', 1], ['hPa', 100], ['kPa', 1e3], ['MPa', 1e6], ['GPa', 1e9], ['mPa', 1e-3], ['µPa', 1e-6], ['bar', 1e5], ['mbar', 100], ['atm', 101325], ['mmHg', 133.322387415], ['torr', 101325 / 760], ['psi', 6894.757293168], ['N/m²', 1], ['N/mm²', 1e6]] },
    momentum:    { name: 'momentum', units: [['kg·m/s', 1], ['N·s', 1], ['g·cm/s', 1e-5], ['MeV/c', 5.34428599e-22]] },
    torque:      { name: 'torque', units: [['N·m', 1], ['kN·m', 1e3], ['N·mm', 1e-3], ['lbf·ft', 1.3558179483314], ['lbf·in', 0.1129848290276]] },
    inertia:     { name: 'moment of inertia', units: [['kg·m²', 1], ['g·cm²', 1e-7], ['kg·cm²', 1e-4]] },
    angmom:      { name: 'angular momentum', units: [['kg·m²/s', 1], ['J·s', 1], ['ħ', 1.054571817e-34]] },
    density:     { name: 'density', units: [['kg/m³', 1], ['g/cm³', 1e3], ['g/L', 1], ['g/mL', 1e3], ['lb/ft³', 16.018463374]] },
    lindensity:  { name: 'linear density', units: [['kg/m', 1], ['g/m', 1e-3], ['g/cm', 0.1]] },
    arealdensity:{ name: 'areal density', units: [['kg/m²', 1], ['g/cm²', 10], ['g/m²', 1e-3]] },
    stiffness:   { name: 'spring constant', units: [['N/m', 1], ['kN/m', 1e3], ['N/mm', 1e3], ['N/cm', 100], ['lbf/in', 175.12683524647636]] },
    surfacetension: { name: 'surface tension', units: [['N/m', 1], ['mN/m', 1e-3], ['dyn/cm', 1e-3]] },
    temperature: { name: 'temperature', units: [['K', 1, 0], ['°C', 1, 273.15], ['°F', 5 / 9, 273.15 - 32 * 5 / 9], ['°R', 5 / 9, 0], ['mK', 1e-3, 0], ['MK', 1e6, 0]] },
    dtemp:       { name: 'temperature difference', units: [['K', 1], ['mK', 1e-3], ['µK', 1e-6], ['°C', 1], ['°F', 5 / 9]] },
    charge:      { name: 'charge', units: [['C', 1], ['mC', 1e-3], ['µC', 1e-6], ['nC', 1e-9], ['pC', 1e-12], ['e', 1.602176634e-19], ['A·h', 3600], ['mA·h', 3.6]] },
    current:     { name: 'current', units: [['A', 1], ['mA', 1e-3], ['µA', 1e-6], ['nA', 1e-9], ['pA', 1e-12], ['kA', 1e3]] },
    voltage:     { name: 'voltage', units: [['V', 1], ['mV', 1e-3], ['µV', 1e-6], ['kV', 1e3], ['MV', 1e6]] },
    resistance:  { name: 'resistance', units: [['Ω', 1], ['mΩ', 1e-3], ['kΩ', 1e3], ['MΩ', 1e6], ['GΩ', 1e9]] },
    resistivity: { name: 'resistivity', units: [['Ω·m', 1], ['Ω·cm', 1e-2], ['µΩ·cm', 1e-8], ['Ω·mm²/m', 1e-6]] },
    conductance: { name: 'conductance', units: [['S', 1], ['mS', 1e-3], ['µS', 1e-6]] },
    conductivity:{ name: 'conductivity', units: [['S/m', 1], ['MS/m', 1e6], ['µS/cm', 1e-4]] },
    capacitance: { name: 'capacitance', units: [['F', 1], ['mF', 1e-3], ['µF', 1e-6], ['nF', 1e-9], ['pF', 1e-12]] },
    inductance:  { name: 'inductance', units: [['H', 1], ['mH', 1e-3], ['µH', 1e-6], ['nH', 1e-9]] },
    bfield:      { name: 'magnetic field', units: [['T', 1], ['mT', 1e-3], ['µT', 1e-6], ['nT', 1e-9], ['G', 1e-4], ['mG', 1e-7]] },
    hfield:      { name: 'magnetizing field', units: [['A/m', 1], ['kA/m', 1e3], ['Oe', 1000 / (4 * Math.PI)]] },
    flux:        { name: 'magnetic flux', units: [['Wb', 1], ['mWb', 1e-3], ['µWb', 1e-6], ['T·m²', 1], ['Mx', 1e-8]] },
    efield:      { name: 'electric field', units: [['V/m', 1], ['N/C', 1], ['kV/m', 1e3], ['V/cm', 100], ['kV/cm', 1e5], ['MV/m', 1e6]] },
    eflux:       { name: 'electric flux', units: [['V·m', 1], ['N·m²/C', 1]] },
    dipole:      { name: 'electric dipole moment', units: [['C·m', 1], ['D', 3.33564e-30], ['e·Å', 1.602176634e-29]] },
    mdipole:     { name: 'magnetic moment', units: [['A·m²', 1], ['J/T', 1], ['µB', 9.2740100783e-24]] },
    chargedensity: { name: 'charge density', units: [['C/m³', 1], ['µC/m³', 1e-6]] },
    surfacecharge: { name: 'surface charge density', units: [['C/m²', 1], ['µC/m²', 1e-6], ['nC/m²', 1e-9], ['µC/cm²', 1e-2]] },
    linecharge:  { name: 'line charge density', units: [['C/m', 1], ['µC/m', 1e-6], ['nC/m', 1e-9]] },
    currentdensity: { name: 'current density', units: [['A/m²', 1], ['A/mm²', 1e6], ['A/cm²', 1e4]] },
    specificheat:{ name: 'specific heat', units: [['J/(kg·K)', 1], ['kJ/(kg·K)', 1e3], ['J/(g·K)', 1e3], ['cal/(g·°C)', 4184], ['BTU/(lb·°F)', 4186.8]] },
    heatcap:     { name: 'heat capacity', units: [['J/K', 1], ['kJ/K', 1e3], ['cal/K', 4.184]] },
    molarheat:   { name: 'molar heat capacity', units: [['J/(mol·K)', 1], ['cal/(mol·K)', 4.184]] },
    entropy:     { name: 'entropy', units: [['J/K', 1], ['kJ/K', 1e3], ['cal/K', 4.184], ['k_B', 1.380649e-23]] },
    latent:      { name: 'specific latent heat', units: [['J/kg', 1], ['kJ/kg', 1e3], ['MJ/kg', 1e6], ['J/g', 1e3], ['cal/g', 4184]] },
    thermcond:   { name: 'thermal conductivity', units: [['W/(m·K)', 1], ['BTU/(h·ft·°F)', 1.730735]] },
    heattransfer:{ name: 'heat transfer coefficient', units: [['W/(m²·K)', 1]] },
    thermres:    { name: 'thermal resistance (R-value)', units: [['m²·K/W', 1], ['ft²·°F·h/BTU', 0.1761101838]] },
    expansion:   { name: 'expansion coefficient', units: [['1/K', 1], ['1/°C', 1], ['ppm/K', 1e-6], ['1/°F', 1.8]] },
    intensity:   { name: 'intensity', units: [['W/m²', 1], ['mW/m²', 1e-3], ['µW/m²', 1e-6], ['pW/m²', 1e-12], ['mW/cm²', 10], ['W/cm²', 1e4], ['kW/m²', 1e3]] },
    soundlevel:  { name: 'sound level', units: [['dB', 1]] },
    amount:      { name: 'amount of substance', units: [['mol', 1], ['mmol', 1e-3], ['µmol', 1e-6], ['kmol', 1e3]] },
    molarmass:   { name: 'molar mass', units: [['kg/mol', 1], ['g/mol', 1e-3]] },
    concentration: { name: 'concentration', units: [['mol/m³', 1], ['mol/L', 1e3], ['mmol/L', 1]] },
    numberdensity: { name: 'number density', units: [['1/m³', 1], ['1/cm³', 1e6]] },
    viscosity:   { name: 'dynamic viscosity', units: [['Pa·s', 1], ['mPa·s', 1e-3], ['P', 0.1], ['cP', 1e-3]] },
    kinvisc:     { name: 'kinematic viscosity', units: [['m²/s', 1], ['mm²/s', 1e-6], ['St', 1e-4], ['cSt', 1e-6]] },
    flowrate:    { name: 'volume flow rate', units: [['m³/s', 1], ['L/s', 1e-3], ['L/min', 1e-3 / 60], ['m³/h', 1 / 3600], ['mL/s', 1e-6], ['gal/min', 3.785411784e-3 / 60], ['cm³/s', 1e-6]] },
    massflow:    { name: 'mass flow rate', units: [['kg/s', 1], ['g/s', 1e-3], ['kg/h', 1 / 3600], ['t/h', 1 / 3.6]] },
    wavenumber:  { name: 'wave number', units: [['1/m', 1], ['1/cm', 100], ['1/mm', 1e3], ['lines/mm', 1e3], ['1/µm', 1e6], ['1/nm', 1e9], ['rad/m', 1]] },
    optpower:    { name: 'optical power', units: [['D', 1], ['1/m', 1]] },
    activity:    { name: 'activity', units: [['Bq', 1], ['kBq', 1e3], ['MBq', 1e6], ['GBq', 1e9], ['TBq', 1e12], ['Ci', 3.7e10], ['mCi', 3.7e7], ['µCi', 3.7e4]] },
    decayconst:  { name: 'decay constant', units: [['1/s', 1], ['1/min', 1 / 60], ['1/h', 1 / 3600], ['1/day', 1 / 86400], ['1/yr', 1 / 3.15576e7]] },
    dose:        { name: 'absorbed dose', units: [['Gy', 1], ['mGy', 1e-3], ['µGy', 1e-6], ['rad', 1e-2]] },
    doseeq:      { name: 'equivalent dose', units: [['Sv', 1], ['mSv', 1e-3], ['µSv', 1e-6], ['rem', 1e-2], ['mrem', 1e-5]] },
    luminousflux:{ name: 'luminous flux', units: [['lm', 1]] },
    illuminance: { name: 'illuminance', units: [['lx', 1], ['fc', 10.763910417]] },
    luminousint: { name: 'luminous intensity', units: [['cd', 1]] },
    stress:      { name: 'stress / modulus', units: [['Pa', 1], ['kPa', 1e3], ['MPa', 1e6], ['GPa', 1e9], ['N/mm²', 1e6], ['psi', 6894.757293168], ['ksi', 6894757.293168]] },
    strain:      { name: 'strain', units: [['', 1], ['%', 0.01], ['µε', 1e-6]] },
    energydensity: { name: 'energy density', units: [['J/m³', 1], ['kJ/m³', 1e3], ['MJ/m³', 1e6]] },
    specificenergy: { name: 'specific energy', units: [['J/kg', 1], ['kJ/kg', 1e3], ['MJ/kg', 1e6], ['kWh/kg', 3.6e6]] },
    pressureGrad:{ name: 'pressure gradient', units: [['Pa/m', 1], ['kPa/m', 1e3]] },
    gain:        { name: 'gain in decibels', units: [['dB', 1]] },
    apparentpower: { name: 'apparent power', units: [['VA', 1], ['kVA', 1e3], ['MVA', 1e6]] },
    reactivepower: { name: 'reactive power', units: [['var', 1], ['kvar', 1e3], ['Mvar', 1e6]] },
    datarate:    { name: 'data rate', units: [['bit/s', 1], ['kbit/s', 1e3], ['Mbit/s', 1e6], ['Gbit/s', 1e9], ['baud', 1], ['B/s', 8], ['kB/s', 8e3], ['MB/s', 8e6]] },
    slewrate:    { name: 'slew rate', units: [['V/s', 1], ['V/ms', 1e3], ['V/µs', 1e6]] },
    thermalres:  { name: 'thermal resistance', units: [['K/W', 1], ['°C/W', 1]] },
    rate:        { name: 'rate', units: [['1/s', 1], ['1/min', 1 / 60], ['1/h', 1 / 3600], ['kHz', 1e3]] },
    hubble:      { name: 'Hubble parameter', units: [['km/s/Mpc', 1e3 / 3.0856775814913673e22], ['1/s', 1]] },
    gravparam:   { name: 'gravitational parameter', units: [['m³/s²', 1], ['km³/s²', 1e9]] }
  };

  /* A variable given only `unit` finds its quantity through this table */
  const UNIT_INDEX = {};
  for (const [q, def] of Object.entries(Q)) {
    def.id = q;
    for (const u of def.units) if (u[0] && !(u[0] in UNIT_INDEX)) UNIT_INDEX[u[0]] = q;
  }

  function unitRow(q, u) {
    const d = Q[q];
    if (!d) return null;
    return d.units.find(r => r[0] === u) || null;
  }
  function toSI(v, q, u) {
    const r = unitRow(q, u);
    if (!r) return v;
    return v * r[1] + (r[2] || 0);
  }
  function fromSI(v, q, u) {
    const r = unitRow(q, u);
    if (!r) return v;
    return (v - (r[2] || 0)) / r[1];
  }
  function convert(v, q, from, to) { return fromSI(toSI(v, q, from), q, to); }

  /* A unit as TeX: m/s² -> \mathrm{m/s^{2}} */
  function unitTex(u) {
    if (!u) return '';
    if (u === '°' || u === '′' || u === '″') return u === '°' ? '^{\\circ}' : u;
    let s = u.replace(/²/g, '^{2}').replace(/³/g, '^{3}').replace(/⁴/g, '^{4}').replace(/⁻¹/g, '^{-1}')
      .replace(/·/g, '\\cdot ').replace(/µ/g, '\\mu ').replace(/Ω/g, '\\Omega ').replace(/°/g, '^{\\circ}\\!')
      .replace(/₀/g, '_{0}').replace(/☉/g, '_{\\odot}').replace(/⊕/g, '_{\\oplus}').replace(/ħ/g, '\\hbar ').replace(/Å/g, '\\AA ').replace(/‰/g, '\\text{‰}');
    return '\\mathrm{' + s + '}';
  }

  /* ---------------------------------------------------------------- constants
     (CODATA 2018 / SI 2019 exact values where defined) */
  const C = {
    c:     { v: 299792458, u: 'm/s', q: 'speed', name: 'speed of light in vacuum', tex: 'c', exact: true },
    g:     { v: 9.80665, u: 'm/s²', q: 'accel', name: 'standard gravity (Earth surface)', tex: 'g' },
    G:     { v: 6.67430e-11, u: 'N·m²/kg²', name: 'gravitational constant', tex: 'G' },
    h:     { v: 6.62607015e-34, u: 'J·s', name: 'Planck constant', tex: 'h', exact: true },
    hbar:  { v: 1.054571817e-34, u: 'J·s', name: 'reduced Planck constant', tex: '\\hbar' },
    qe:    { v: 1.602176634e-19, u: 'C', q: 'charge', name: 'elementary charge', tex: 'e', exact: true },
    me:    { v: 9.1093837015e-31, u: 'kg', q: 'mass', name: 'electron mass', tex: 'm_e' },
    mp:    { v: 1.67262192369e-27, u: 'kg', q: 'mass', name: 'proton mass', tex: 'm_p' },
    mn:    { v: 1.67492749804e-27, u: 'kg', q: 'mass', name: 'neutron mass', tex: 'm_n' },
    amu:   { v: 1.66053906660e-27, u: 'kg', q: 'mass', name: 'atomic mass unit', tex: 'u' },
    kB:    { v: 1.380649e-23, u: 'J/K', name: 'Boltzmann constant', tex: 'k_B', exact: true },
    NA:    { v: 6.02214076e23, u: '1/mol', name: 'Avogadro constant', tex: 'N_A', exact: true },
    R:     { v: 8.314462618, u: 'J/(mol·K)', q: 'molarheat', name: 'molar gas constant', tex: 'R' },
    eps0:  { v: 8.8541878128e-12, u: 'F/m', name: 'vacuum permittivity', tex: '\\varepsilon_0' },
    mu0:   { v: 1.25663706212e-6, u: 'N/A²', name: 'vacuum permeability', tex: '\\mu_0' },
    ke:    { v: 8.9875517923e9, u: 'N·m²/C²', name: 'Coulomb constant 1/(4πε₀)', tex: 'k' },
    sigma: { v: 5.670374419e-8, u: 'W/(m²·K⁴)', name: 'Stefan–Boltzmann constant', tex: '\\sigma' },
    bW:    { v: 2.897771955e-3, u: 'm·K', name: 'Wien displacement constant', tex: 'b' },
    a0:    { v: 5.29177210903e-11, u: 'm', q: 'length', name: 'Bohr radius', tex: 'a_0' },
    Rinf:  { v: 10973731.568160, u: '1/m', q: 'wavenumber', name: 'Rydberg constant', tex: 'R_\\infty' },
    alpha: { v: 7.2973525693e-3, u: '', name: 'fine-structure constant', tex: '\\alpha' },
    muB:   { v: 9.2740100783e-24, u: 'J/T', q: 'mdipole', name: 'Bohr magneton', tex: '\\mu_B' },
    eV:    { v: 1.602176634e-19, u: 'J', q: 'energy', name: 'electronvolt', tex: '\\mathrm{eV}', exact: true },
    Ry:    { v: 13.605693122994, u: 'eV', name: 'Rydberg energy', tex: '\\mathrm{Ry}' },
    atm:   { v: 101325, u: 'Pa', q: 'pressure', name: 'standard atmosphere', tex: 'p_0', exact: true },
    T0:    { v: 273.15, u: 'K', q: 'temperature', name: 'ice point (0 °C)', tex: 'T_0', exact: true },
    Vm:    { v: 22.41396954e-3, u: 'm³/mol', name: 'molar volume of ideal gas at 0 °C, 1 atm', tex: 'V_m' },
    F:     { v: 96485.33212, u: 'C/mol', name: 'Faraday constant', tex: 'F' },
    lambdaC: { v: 2.42631023867e-12, u: 'm', q: 'length', name: 'Compton wavelength of the electron', tex: '\\lambda_C' },
    Msun:  { v: 1.98847e30, u: 'kg', q: 'mass', name: 'solar mass', tex: 'M_\\odot' },
    Rsun:  { v: 6.957e8, u: 'm', q: 'length', name: 'solar radius', tex: 'R_\\odot' },
    Lsun:  { v: 3.828e26, u: 'W', q: 'power', name: 'solar luminosity', tex: 'L_\\odot' },
    Mearth:{ v: 5.9722e24, u: 'kg', q: 'mass', name: 'Earth mass', tex: 'M_\\oplus' },
    Rearth:{ v: 6.371e6, u: 'm', q: 'length', name: 'Earth mean radius', tex: 'R_\\oplus' },
    AU:    { v: 1.495978707e11, u: 'm', q: 'length', name: 'astronomical unit', tex: '\\mathrm{AU}', exact: true },
    ly:    { v: 9.4607304725808e15, u: 'm', q: 'length', name: 'light-year', tex: '\\mathrm{ly}', exact: true },
    pc:    { v: 3.0856775814913673e16, u: 'm', q: 'length', name: 'parsec', tex: '\\mathrm{pc}' },
    H0:    { v: 2.27e-18, u: '1/s', name: 'Hubble constant (≈ 70 km/s/Mpc)', tex: 'H_0' },
    rhoW:  { v: 1000, u: 'kg/m³', q: 'density', name: 'density of water', tex: '\\rho_w' },
    cW:    { v: 4186, u: 'J/(kg·K)', q: 'specificheat', name: 'specific heat of water', tex: 'c_w' },
    vs:    { v: 343, u: 'm/s', q: 'speed', name: 'speed of sound in air at 20 °C', tex: 'v_s' },
    I0:    { v: 1e-12, u: 'W/m²', q: 'intensity', name: 'threshold of hearing', tex: 'I_0' },
    gMoon: { v: 1.62, u: 'm/s²', q: 'accel', name: 'gravity on the Moon', tex: 'g_\\text{Moon}' }
  };
  // quantity of a constant, from its unit when not given
  for (const k in C) if (!C[k].q && UNIT_INDEX[C[k].u]) C[k].q = UNIT_INDEX[C[k].u];

  H.units = { Q, C, UNIT_INDEX, unitRow, toSI, fromSI, convert, unitTex };
})(typeof window !== 'undefined' ? window : globalThis);
