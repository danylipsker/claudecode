using System;

namespace GearGen.Geometry
{
    public enum UnitSystem
    {
        Metric,
        Inch
    }

    public enum GearFamily
    {
        /// <summary>Spur (HelixAngleDeg == 0) or helical -- cylindrical, straight axis.</summary>
        Cylindrical,
        /// <summary>Straight bevel gear, conical -- see docs/gear-math.md section 8.</summary>
        Bevel,
        /// <summary>Worm (the screw member) -- see docs/gear-math.md section 9.</summary>
        Worm,
        /// <summary>Linear gear track -- see docs/gear-math.md section 10.</summary>
        Rack,
        /// <summary>Internal (ring) gear, teeth pointing inward -- see docs/gear-math.md section 11.</summary>
        Internal,
        /// <summary>Double-helical (herringbone): two opposite-hand helical
        /// halves on one blank, mirror-symmetric about the mid-face so the
        /// axial thrust cancels -- see docs/gear-math.md section 7.4. Uses
        /// the cylindrical family's parameters (HelixAngleDeg must be > 0;
        /// Hand is the half at z=0) plus GapWidthMm.</summary>
        Herringbone,
        /// <summary>Crossed-helical (screw) gear PAIR: two helical gears on
        /// non-parallel, non-intersecting shafts -- see docs/gear-math.md
        /// section 7.5. Teeth/HelixAngleDeg/Hand describe gear 1; MateTeeth
        /// is gear 2's tooth count and ShaftAngleDeg the angle between the
        /// shafts, from which gear 2's helix and hand follow. Exports both
        /// members in mesh as a two-body STEP.</summary>
        CrossedHelical,
        /// <summary>Planetary (epicyclic) SET: sun + n planets + ring, all in
        /// mesh -- see docs/gear-math.md section 11.4. Teeth = sun,
        /// MateTeeth = planet, PlanetCount, RimThicknessMm = the ring's rim;
        /// the ring's tooth count follows (z_s + 2 z_p). Exports every member
        /// as one multi-body STEP.</summary>
        Planetary,
        /// <summary>Cycloidal gear (epicycloid addendum / hypocycloid dedendum
        /// traced by one rolling circle -- clock and instrument gearing), see
        /// docs/gear-math.md section 14. No pressure angle; the tooth form is
        /// set by RollingCircleDiameterMm.</summary>
        Cycloidal,
        /// <summary>Cycloidal drive / hypocycloid speed reducer: a lobed disc
        /// (Teeth = lobes = the reduction ratio) rolling inside a ring of
        /// lobes+1 rollers on an eccentric -- see docs/gear-math.md section
        /// 15. No module or pressure angle; sized by PinCircleDiameterMm,
        /// RollerDiameterMm and EccentricityMm, with optional output pins.
        /// Exports disc + rollers + output pins as one multi-body STEP.</summary>
        CycloidalDrive,
        /// <summary>Spiral bevel gear (curved, Gleason circular-arc tooth
        /// trace), and zerol bevel when SpiralAngleDeg == 0 -- see
        /// docs/gear-math.md section 16. The straight bevel's parameters plus
        /// SpiralAngleDeg, CutterRadiusMm and Hand.</summary>
        SpiralBevel,
        /// <summary>Face gear: teeth cut into the face of a disc, meshing
        /// with a spur pinion on a perpendicular axis -- see docs/gear-math.md
        /// section 17. Teeth = the face gear's, MateTeeth = the pinion's,
        /// CutterTeeth = the shaper's (0 = pinion's), FaceInnerRadiusMm /
        /// FaceOuterRadiusMm (0 = auto), RimThicknessMm, BoreDiameterMm.</summary>
        FaceGear,
        /// <summary>Sprocket wheel for roller chain, per ANSI B29.1 / ISO 606
        /// -- see docs/gear-math.md section 18. No module/pressure angle;
        /// sized by ChainPitchMm and RollerDiameterMm (ChainNumber sets both
        /// from the standard table), OutsideDiameterMm (0 = auto).
        /// FaceWidthMm, BoreDiameterMm as usual.</summary>
        Sprocket,
        /// <summary>One pitch length of roller chain (an outer link pinned
        /// into an inner link -- ten parts) built to seat in a Sprocket of
        /// the same chain -- see docs/gear-math.md section 19. No teeth;
        /// ChainNumber/ChainPitchMm/RollerDiameterMm as Sprocket.</summary>
        ChainLink,
        /// <summary>Timing pulley for a toothed belt -- see docs/gear-math.md
        /// section 20. Teeth = groove count, BeltPitchMm the belt's own
        /// pitch, FaceWidthMm/BoreDiameterMm as usual.</summary>
        TimingWheel,
        /// <summary>A modelled segment of timing belt -- see docs/gear-math.md
        /// section 20. No teeth count (CutterTeeth is how many teeth the
        /// segment shows); BeltPitchMm as TimingWheel; FaceWidthMm is the
        /// belt's own width.</summary>
        TimingBelt,
        /// <summary>Hypoid pair: a spiral bevel gear (Teeth, SpiralAngleDeg,
        /// CutterRadiusMm, Hand -- the gear's) driven by a pinion (MateTeeth)
        /// whose axis passes the gear's at OffsetMm -- see docs/gear-math.md
        /// section 21. The pinion's spiral angle, pitch angle and size
        /// follow from the offset; its teeth are generated from the gear.
        /// Exports the pair as one multi-body STEP.</summary>
        Hypoid,
        /// <summary>Double-enveloping (globoid, Hindley) worm and its throated
        /// wheel -- see docs/gear-math.md section 22. WormStarts, MateTeeth =
        /// the wheel's teeth, ModuleMm = the axial module at the throat,
        /// PitchDiameterMm = the worm's throat pitch diameter, EnvelopeTeeth
        /// = how many wheel pitches the worm wraps (sets its length), Hand,
        /// PressureAngleDeg, BoreDiameterMm (the worm's). The wheel is
        /// generated from the worm. Exports the pair as one multi-body STEP.</summary>
        GloboidWorm,
        /// <summary>Eccentrically-cycloidal (EC) gearing -- see docs/gear-math.md
        /// section 23. A one-tooth pinion whose sections are circles set
        /// EccentricityMm off its axis, turning along a helix of LeadMm, and a
        /// wheel of Teeth lobes whose profile is the envelope of that circle
        /// (an equidistant of an epitrochoid, as the cycloidal drive's disc).
        /// CentreDistanceMm, PinionDiameterMm, Hand, FaceWidthMm, BoreDiameterMm
        /// (the wheel's), PinionBoreDiameterMm. Exports the pair as one
        /// multi-body STEP.</summary>
        EccentricCycloidal
    }

    /// <summary>
    /// Mirrors py/gear_step/involute.py's GearParams. This is the C#-side model
    /// bound by the UI; it is serialized (see GearGen.PyEngine) and sent to the
    /// Python engine, which is the single source of truth for actual geometry.
    /// All angles here are DEGREES.
    /// </summary>
    public class GearParameters
    {
        public UnitSystem Unit { get; set; } = UnitSystem.Metric;

        public int Teeth { get; set; } = 20;

        /// <summary>Module, mm. Used when Unit == Metric.</summary>
        public double ModuleMm { get; set; } = 2.0;

        /// <summary>Diametral pitch, 1/in. Used when Unit == Inch.</summary>
        public double DiametralPitch { get; set; } = 12.0;

        public double PressureAngleDeg { get; set; } = 20.0;

        public double ProfileShift { get; set; } = 0.0;

        public double AddendumCoeff { get; set; } = 1.0;

        public double DedendumCoeff { get; set; } = 1.25;

        public double RootFilletCoeff { get; set; } = 0.38;

        /// <summary>Face width. Stored in mm internally regardless of Unit;
        /// the UI converts to/from inches for display when Unit == Inch.</summary>
        public double FaceWidthMm { get; set; } = 10.0;

        public double BacklashMm { get; set; } = 0.0;

        /// <summary>0 = no bore.</summary>
        public double BoreDiameterMm { get; set; } = 0.0;

        /// <summary>0 = spur gear (no twist). Otherwise a helical gear --
        /// see docs/gear-math.md section 7.</summary>
        public double HelixAngleDeg { get; set; } = 0.0;

        /// <summary>"right" or "left". Ignored when HelixAngleDeg == 0.</summary>
        public string Hand { get; set; } = "right";

        public bool IsHelical => Math.Abs(HelixAngleDeg) > 1e-9;

        // ---- bevel (docs/gear-math.md section 8) -- Family == Bevel only ----

        public GearFamily Family { get; set; } = GearFamily.Cylindrical;

        public bool IsBevel => Family == GearFamily.Bevel;

        /// <summary>The mating gear's tooth count -- used with ShaftAngleDeg
        /// to compute the pitch angle, unless PitchAngleOverrideDeg is set.</summary>
        public int MateTeeth { get; set; } = 20;

        public double ShaftAngleDeg { get; set; } = 90.0;

        /// <summary>Set to skip the mate-teeth/shaft-angle calculation and
        /// specify the pitch angle directly. Null = compute it.</summary>
        public double? PitchAngleOverrideDeg { get; set; } = null;

        // ---- worm (docs/gear-math.md section 9) -- Family == Worm only ----
        // Reuses several existing fields for their worm-equivalent meaning:
        // ModuleMm/DiametralPitch = AXIAL module/DP, PressureAngleDeg, Hand,
        // FaceWidthMm = threaded length, BoreDiameterMm, and MateTeeth =
        // the wheel's tooth count (for center-distance/lead-angle info only
        // -- building the actual wheel means switching to the Cylindrical/
        // Helical family with the matching module+helix angle+hand).

        public bool IsWorm => Family == GearFamily.Worm;

        /// <summary>z1, number of thread starts.</summary>
        public int WormStarts { get; set; } = 2;

        /// <summary>d1, the worm's own pitch diameter -- specified directly
        /// (unlike a normal gear, a worm's pitch diameter isn't derived from
        /// module*teeth).</summary>
        public double PitchDiameterMm { get; set; } = 20.0;

        // ---- rack (docs/gear-math.md section 10) -- Family == Rack only ------
        // Reuses Teeth (a rack has a finite number of teeth along its length),
        // ModuleMm/DiametralPitch, PressureAngleDeg, Addendum/Dedendum/
        // RootFilletCoeff, BacklashMm, FaceWidthMm (extrusion depth, same
        // meaning as any other gear), and BoreDiameterMm (mounting holes
        // through the backing bar, one per tooth pitch, 0 = none).

        public bool IsRack => Family == GearFamily.Rack;

        /// <summary>Solid material below the root land, for mounting/rigidity.</summary>
        public double BackingHeightMm { get; set; } = 5.0;

        // ---- internal / ring gear (docs/gear-math.md section 11) -- Family == Internal only ----
        // Reuses Teeth (the ring's own tooth count), ModuleMm/DiametralPitch,
        // PressureAngleDeg, Addendum/Dedendum/RootFilletCoeff, BacklashMm,
        // FaceWidthMm, and MateTeeth (the mating pinion's tooth count, for
        // center-distance info only -- same "info only, no separate wheel
        // mode" pattern worm gears already use for MateTeeth).

        public bool IsInternal => Family == GearFamily.Internal;

        /// <summary>Shaper-cutter tooth count -- a construction parameter
        /// only (the fundamental law of gearing guarantees the generated
        /// flank doesn't depend on it), not a property of the finished ring.
        /// 0 = let the Python engine pick a sensible default.</summary>
        public int CutterTeeth { get; set; } = 0;

        /// <summary>Solid rim material beyond the root (dedendum) circle,
        /// out to the ring's outer diameter.</summary>
        public double RimThicknessMm { get; set; } = 6.0;

        // ---- double-helical / herringbone (docs/gear-math.md section 7.4) -- Family == Herringbone only ----

        public bool IsHerringbone => Family == GearFamily.Herringbone;

        // ---- crossed-helical / screw pair (docs/gear-math.md section 7.5) -- Family == CrossedHelical only ----
        // Reuses Teeth/HelixAngleDeg/Hand (gear 1), MateTeeth (gear 2) and
        // ShaftAngleDeg (the bevel field, same meaning: angle between shafts).

        public bool IsCrossedHelical => Family == GearFamily.CrossedHelical;

        // ---- planetary set (docs/gear-math.md section 11.4) -- Family == Planetary only ----
        // Reuses Teeth (sun), MateTeeth (planet), RimThicknessMm (ring rim),
        // BoreDiameterMm (sun and planets), FaceWidthMm (all members).

        public bool IsPlanetary => Family == GearFamily.Planetary;

        // ---- cycloidal (docs/gear-math.md section 14) -- Family == Cycloidal only ----

        public bool IsCycloidal => Family == GearFamily.Cycloidal;

        /// <summary>Diameter of the rolling (generating) circle that traces the
        /// tooth flanks. 0 = auto: this gear's own pitch radius (r_g = R/2),
        /// which makes the dedendum flanks straight radial lines -- the classic
        /// clock pinion. A mating pair must share one rolling circle. Stored in
        /// mm regardless of Unit.</summary>
        public double RollingCircleDiameterMm { get; set; } = 0.0;

        // ---- cycloidal drive (docs/gear-math.md section 15) -- Family == CycloidalDrive only ----
        // Reuses Teeth (= lobes = ratio), FaceWidthMm (disc thickness = roller
        // length) and BoreDiameterMm (the eccentric bearing's seat). All in mm.

        public bool IsCycloidalDrive => Family == GearFamily.CycloidalDrive;

        // ---- spiral / zerol bevel (docs/gear-math.md section 16) -- Family == SpiralBevel only ----
        // Reuses every straight-bevel field (MateTeeth, ShaftAngleDeg,
        // PitchAngleOverrideDeg) and Hand.

        public bool IsSpiralBevel => Family == GearFamily.SpiralBevel;

        /// <summary>Straight or spiral: the families that share the cone geometry.</summary>
        public bool IsAnyBevel => IsBevel || IsSpiralBevel;

        /// <summary>Mean spiral angle psi_m at the middle of the face. 0 = a
        /// zerol bevel gear (curved teeth, zero mean spiral angle).</summary>
        public double SpiralAngleDeg { get; set; } = 35.0;

        /// <summary>Gleason cutter radius, which sets the tooth trace's
        /// curvature. 0 = automatic: the mean cone distance.</summary>
        public double CutterRadiusMm { get; set; } = 0.0;

        public bool IsZerol => IsSpiralBevel && Math.Abs(SpiralAngleDeg) < 1e-9;

        // ---- face gear (docs/gear-math.md section 17) -- Family == FaceGear only ----

        public bool IsFaceGear => Family == GearFamily.FaceGear;

        /// <summary>Radial extent of the toothed ring; 0 = automatic
        /// (nominal radius m z/2 minus / plus five modules).</summary>
        public double FaceInnerRadiusMm { get; set; } = 0.0;
        public double FaceOuterRadiusMm { get; set; } = 0.0;

        // ---- sprocket (docs/gear-math.md section 18) -- Family == Sprocket only ----

        public bool IsSprocket => Family == GearFamily.Sprocket;

        // ---- chain link (docs/gear-math.md section 19) -- Family == ChainLink only ----

        public bool IsChainLink => Family == GearFamily.ChainLink;

        // ---- timing wheel / timing belt (docs/gear-math.md section 20) ----

        public bool IsTimingWheel => Family == GearFamily.TimingWheel;
        public bool IsTimingBelt => Family == GearFamily.TimingBelt;

        /// <summary>Named standard timing-belt sizes -- the C# side's own copy
        /// of timing_belt.py's TIMING_BELT_STANDARDS (name, pitch in mm,
        /// curvilinear profile?), kept identical so the combo box's choice
        /// matches what the geometry engine assumes for the same name.
        /// Trapezoidal: the classic inch series and ISO 5296 T-series;
        /// curvilinear: GT2 and HTD.</summary>
        public static readonly (string Name, double PitchMm, bool Curvilinear)[] TimingBeltStandards =
        {
            ("MXL", 2.032, false), ("XL", 5.08, false), ("L", 9.525, false), ("H", 12.7, false),
            ("XH", 22.225, false), ("XXH", 31.75, false),
            ("T2.5", 2.5, false), ("T5", 5.0, false), ("T10", 10.0, false), ("T20", 20.0, false),
            ("GT2", 2.0, true), ("HTD 3M", 3.0, true), ("HTD 5M", 5.0, true), ("HTD 8M", 8.0, true), ("HTD 14M", 14.0, true),
        };

        /// <summary>A TimingBeltStandards name; picking one sets BeltPitchMm and
        /// BeltCurvilinear from the table (GearViewModel.BeltType). The pitch
        /// stays directly editable afterward for a non-standard belt.</summary>
        public string BeltType { get; set; } = "T5";
        public double BeltPitchMm { get; set; } = 5.0;
        /// <summary>Rounded (GT2/HTD) rather than flat-sided (T/XL/L/H) tooth --
        /// sets the engine's fillet radius; docs/gear-math.md 20.2.</summary>
        public bool BeltCurvilinear { get; set; } = false;

        // ---- hypoid (docs/gear-math.md section 21) -- Family == Hypoid only ----

        public bool IsHypoid => Family == GearFamily.Hypoid;

        /// <summary>The hypoid offset E: the distance the pinion axis passes
        /// the gear axis at (0 = an ordinary spiral bevel pair). Which side
        /// follows from the gear's hand.</summary>
        public double OffsetMm { get; set; } = 6.0;

        // ---- globoid worm (docs/gear-math.md section 22) -- Family == GloboidWorm only ----

        public bool IsGloboidWorm => Family == GearFamily.GloboidWorm;

        /// <summary>How many wheel pitches the double-enveloping worm wraps
        /// (4 is usual); its length follows: 2 r_g sin(wrap/2).</summary>
        public double EnvelopeTeeth { get; set; } = 4.0;

        // ---- eccentrically-cycloidal gear (docs/gear-math.md section 23) -- Family == EccentricCycloidal only ----

        public bool IsEccentricCycloidal => Family == GearFamily.EccentricCycloidal;

        /// <summary>Axis to axis. The pitch radii follow from the ratio Teeth : 1.</summary>
        public double CentreDistanceMm { get; set; } = 50.0;

        /// <summary>The eccentric circle's diameter; 0 = auto (0.8 of the largest
        /// the wheel profile allows before its tips go sharp). EccentricityMm
        /// is shared with the cycloidal drive; here 0 = auto (0.6 of the
        /// pinion's pitch radius).</summary>
        public double PinionDiameterMm { get; set; } = 0.0;

        /// <summary>The eccentric direction's lead along the axis; 0 = the face
        /// width, one full turn of the eccentric across the face.</summary>
        public double LeadMm { get; set; } = 0.0;

        /// <summary>A bore on the pinion's axis, inside the eccentric (0 = none).</summary>
        public double PinionBoreDiameterMm { get; set; } = 0.0;

        /// <summary>ANSI B29.1 standard chain number ("40", "60", ...) --
        /// picking one sets ChainPitchMm and RollerDiameterMm from the
        /// standard table (GearViewModel's own copy of sprocket.py's); both
        /// stay directly editable afterward for a non-standard chain.</summary>
        public string ChainNumber { get; set; } = "40";
        public double ChainPitchMm { get; set; } = 12.7;

        /// <summary>0 = automatic (pitch diameter + 0.8 roller diameters).</summary>
        public double OutsideDiameterMm { get; set; } = 0.0;

        /// <summary>The rollers' centre circle.</summary>
        public double PinCircleDiameterMm { get; set; } = 60.0;

        public double RollerDiameterMm { get; set; } = 6.0;

        /// <summary>Input eccentricity E (= half the lobe height). Must stay
        /// below (pin circle radius)/(lobes+1) or the profile cusps.</summary>
        public double EccentricityMm { get; set; } = 1.5;

        /// <summary>Output pins fixed to the output shaft, running in holes of
        /// (pin diameter + 2E) in the disc. 0 = no output holes.</summary>
        public int OutputPinCount { get; set; } = 6;

        public double OutputPinDiameterMm { get; set; } = 6.0;

        public double OutputCircleDiameterMm { get; set; } = 30.0;

        /// <summary>Number of equally spaced planets. (z_sun + z_ring) must
        /// divide by it for them all to mesh -- the engine warns otherwise.</summary>
        public int PlanetCount { get; set; } = 3;

        /// <summary>Centre groove between the two helical halves, at the root
        /// diameter: 0 = a true herringbone (the halves meet at a sharp V
        /// apex); > 0 = the hob-runout clearance a machined double-helical
        /// gear usually has. Stored in mm regardless of Unit.</summary>
        public double GapWidthMm { get; set; } = 0.0;

        public double ModuleFromDiametralPitch => 25.4 / DiametralPitch;

        public double EffectiveModuleMm => Unit == UnitSystem.Inch ? ModuleFromDiametralPitch : ModuleMm;

        public GearParameters Clone()
        {
            return (GearParameters)MemberwiseClone();
        }

        /// <summary>The canonical starting point for one card of the family
        /// mosaic -- what "Reset to default values" restores. The class's own
        /// property initialisers are the spur defaults; each card overrides
        /// the handful that make its kind of gear sensible (the same values
        /// the card-selection methods in GearViewModel jump to, plus the ones
        /// they leave alone). Spur/Helical and Rack/Helical rack are separate
        /// cards over one family, split by 'helical'. The unit system is a
        /// preference, not a parameter, so it is passed through unchanged.</summary>
        public static GearParameters CreateDefaults(GearFamily family, bool helical, UnitSystem unit)
        {
            var p = new GearParameters { Unit = unit, Family = family };
            switch (family)
            {
                case GearFamily.Cylindrical:
                    p.HelixAngleDeg = helical ? 25.0 : 0.0;
                    break;
                case GearFamily.Herringbone:
                    p.HelixAngleDeg = 30.0; p.GapWidthMm = 0.0;
                    break;
                case GearFamily.CrossedHelical:
                    p.HelixAngleDeg = 45.0; p.MateTeeth = 20; p.ShaftAngleDeg = 90.0;   // the classic 45/45 at 90deg
                    break;
                case GearFamily.Planetary:
                    p.Teeth = 12; p.MateTeeth = 9; p.PlanetCount = 3; p.RimThicknessMm = 6.0;  // 12/9/30, (12+30)/3 = 14
                    break;
                case GearFamily.Cycloidal:
                    p.Teeth = 12; p.RollingCircleDiameterMm = 0.0;  // automatic rolling circle: radial flanks
                    break;
                case GearFamily.CycloidalDrive:
                    p.Teeth = 10; p.PinCircleDiameterMm = 60.0; p.RollerDiameterMm = 6.0; p.EccentricityMm = 1.5;
                    p.BoreDiameterMm = 20.0; p.OutputPinCount = 6; p.OutputPinDiameterMm = 6.0; p.OutputCircleDiameterMm = 30.0;
                    break;
                case GearFamily.Bevel:
                    p.MateTeeth = 20; p.ShaftAngleDeg = 90.0; p.PitchAngleOverrideDeg = null;
                    break;
                case GearFamily.FaceGear:
                    p.Teeth = 40; p.MateTeeth = 20; p.CutterTeeth = 0; p.FaceInnerRadiusMm = 0.0; p.FaceOuterRadiusMm = 0.0;
                    p.RimThicknessMm = 6.0;
                    break;
                case GearFamily.Sprocket:
                    p.Teeth = 20; p.ChainNumber = "40"; p.ChainPitchMm = 12.7; p.RollerDiameterMm = 7.9248;
                    p.OutsideDiameterMm = 0.0; p.FaceWidthMm = 6.0; p.BoreDiameterMm = 10.0;
                    break;
                case GearFamily.ChainLink:
                    p.ChainNumber = "40"; p.ChainPitchMm = 12.7; p.RollerDiameterMm = 7.9248;
                    break;
                case GearFamily.TimingWheel:
                    p.Teeth = 20; p.BeltType = "T5"; p.BeltPitchMm = 5.0; p.BeltCurvilinear = false;
                    p.FaceWidthMm = 8.0; p.BoreDiameterMm = 6.0;
                    break;
                case GearFamily.TimingBelt:
                    p.BeltType = "T5"; p.BeltPitchMm = 5.0; p.BeltCurvilinear = false;
                    p.CutterTeeth = 12; p.FaceWidthMm = 8.0;
                    break;
                case GearFamily.EccentricCycloidal:
                    p.Teeth = 20; p.CentreDistanceMm = 50.0; p.EccentricityMm = 0.0; p.PinionDiameterMm = 0.0; p.LeadMm = 0.0;
                    p.FaceWidthMm = 20.0; p.BoreDiameterMm = 0.0; p.PinionBoreDiameterMm = 0.0; p.Hand = "right";
                    break;
                case GearFamily.GloboidWorm:
                    p.WormStarts = 1; p.MateTeeth = 30; p.ModuleMm = 2.0; p.PitchDiameterMm = 24.0; p.EnvelopeTeeth = 4.0;
                    p.PressureAngleDeg = 20.0; p.Hand = "right"; p.BoreDiameterMm = 0.0;
                    break;
                case GearFamily.Hypoid:
                    // 30/12 at module 2, offset a tenth of the gear's pitch diameter: the pinion comes out
                    // 20 % larger than the bevel pinion with a 47 deg spiral (docs/gear-math.md 21.1)
                    p.Teeth = 30; p.MateTeeth = 12; p.ModuleMm = 2.0; p.ShaftAngleDeg = 90.0; p.PitchAngleOverrideDeg = null;
                    p.SpiralAngleDeg = 35.0; p.CutterRadiusMm = 0.0; p.Hand = "right"; p.OffsetMm = 6.0;
                    p.FaceWidthMm = 8.0; p.BoreDiameterMm = 10.0;
                    break;
                case GearFamily.SpiralBevel:
                    // 'helical' here means the Spiral card (35deg, the common choice); false = the Zerol card
                    p.MateTeeth = 20; p.ShaftAngleDeg = 90.0; p.PitchAngleOverrideDeg = null;
                    p.SpiralAngleDeg = helical ? 35.0 : 0.0; p.CutterRadiusMm = 0.0;
                    break;
                case GearFamily.Worm:
                    p.WormStarts = 2; p.PitchDiameterMm = 20.0; p.FaceWidthMm = 30.0; p.MateTeeth = 20;  // 30 mm: ~5 threads, not the 10 mm stub the shared default gives
                    break;
                case GearFamily.Rack:
                    p.Teeth = 10; p.BackingHeightMm = 5.0; p.HelixAngleDeg = helical ? 20.0 : 0.0;
                    break;
                case GearFamily.Internal:
                    p.Teeth = 40; p.MateTeeth = 20; p.RimThicknessMm = 6.0; p.CutterTeeth = 0;  // a ring must be bigger than its pinion
                    break;
            }
            return p;
        }

        /// <summary>Overwrite every parameter from another instance. The view
        /// model binds to one long-lived instance, so a reset copies values
        /// INTO it rather than swapping it out. Reflection over the public
        /// settable properties, so a parameter added later can't be forgotten
        /// here (they are all plain values and strings).</summary>
        public void CopyFrom(GearParameters other)
        {
            foreach (var prop in typeof(GearParameters).GetProperties())
                if (prop.CanRead && prop.CanWrite && prop.GetIndexParameters().Length == 0)
                    prop.SetValue(this, prop.GetValue(other));
        }

        /// <summary>A default file name that says what the part IS: the family
        /// and every property that determines its geometry, so a folder of
        /// exports is self-describing instead of a pile of "gear_z20"s. Same
        /// stem for STEP/DXF/SLDPRT, differing only by extension (DXF gets a
        /// "_profile" marker, since it's the 2D section, not the solid).
        /// Sizes follow the active unit: "m2.5" (module, mm) or "dp12"
        /// (diametral pitch, 1/in), with lengths in mm or "in" to match.
        /// Invariant culture throughout -- in a de-DE locale a 2.5 mm module
        /// would otherwise put a stray comma in the file name.</summary>
        /// <summary>"HTD 8M" -> "htd8m": a file-name-safe form of the belt
        /// standard's name (no spaces; the dot in "T2.5" is fine in a stem).</summary>
        private string BeltTypeSlug =>
            string.IsNullOrWhiteSpace(BeltType) ? "custom" : BeltType.Replace(" ", "").ToLowerInvariant();

        public string SuggestedFileName(string extension)
        {
            var inv = System.Globalization.CultureInfo.InvariantCulture;
            bool inch = Unit == UnitSystem.Inch;
            string N(double v) => v.ToString("0.###", inv);
            string Len(double mm) => inch ? N(UnitConversion.MmToInch(mm)) + "in" : N(mm);
            string size = inch ? "dp" + N(DiametralPitch) : "m" + N(ModuleMm);
            string hand = Hand == "left" ? "L" : "R";

            var parts = new System.Collections.Generic.List<string>();
            switch (Family)
            {
                case GearFamily.Bevel:
                    parts.Add("bevel"); parts.Add("z" + Teeth); parts.Add(size);
                    parts.Add("pa" + N(PressureAngleDeg));
                    parts.Add("mate" + MateTeeth); parts.Add("shaft" + N(ShaftAngleDeg));
                    if (PitchAngleOverrideDeg.HasValue) parts.Add("pitchang" + N(PitchAngleOverrideDeg.Value));
                    parts.Add("fw" + Len(FaceWidthMm));
                    break;
                case GearFamily.Worm:
                    parts.Add("worm"); parts.Add("starts" + WormStarts); parts.Add(size);
                    parts.Add("pd" + Len(PitchDiameterMm)); parts.Add("pa" + N(PressureAngleDeg));
                    parts.Add("len" + Len(FaceWidthMm)); parts.Add(hand + "H");
                    if (MateTeeth > 0) parts.Add("wheel" + MateTeeth);
                    break;
                case GearFamily.Rack:
                    parts.Add(IsHelical ? "helicalrack" : "rack"); parts.Add("z" + Teeth); parts.Add(size);
                    parts.Add("pa" + N(PressureAngleDeg));
                    if (IsHelical) parts.Add("helix" + N(Math.Abs(HelixAngleDeg)) + hand);
                    parts.Add("fw" + Len(FaceWidthMm)); parts.Add("backing" + Len(BackingHeightMm));
                    if (BoreDiameterMm > 0) parts.Add("holes" + Len(BoreDiameterMm));
                    break;
                case GearFamily.Internal:
                    parts.Add("internal"); parts.Add("z" + Teeth); parts.Add(size);
                    parts.Add("pa" + N(PressureAngleDeg));
                    parts.Add("rim" + Len(RimThicknessMm)); parts.Add("fw" + Len(FaceWidthMm));
                    if (MateTeeth > 0) parts.Add("pinion" + MateTeeth);
                    break;
                case GearFamily.FaceGear:
                    parts.Add("facegear"); parts.Add("z" + Teeth); parts.Add("pinion" + MateTeeth); parts.Add(size);
                    parts.Add("pa" + N(PressureAngleDeg));
                    if (CutterTeeth > 0) parts.Add("shaper" + CutterTeeth);
                    parts.Add("ring" + (FaceInnerRadiusMm > 0 ? Len(FaceInnerRadiusMm) : "auto") + "to" + (FaceOuterRadiusMm > 0 ? Len(FaceOuterRadiusMm) : "auto"));
                    parts.Add("rim" + Len(RimThicknessMm));
                    break;
                case GearFamily.Sprocket:
                    // bore is added by the shared trailing rule below, like every
                    // other non-Rack family -- not repeated here.
                    parts.Add("sprocket"); parts.Add("z" + Teeth); parts.Add("chain" + ChainNumber);
                    parts.Add("pitch" + Len(ChainPitchMm)); parts.Add("roller" + Len(RollerDiameterMm));
                    parts.Add("od" + (OutsideDiameterMm > 0 ? Len(OutsideDiameterMm) : "auto"));
                    parts.Add("fw" + Len(FaceWidthMm));
                    break;
                case GearFamily.ChainLink:
                    parts.Add("chainlink"); parts.Add("chain" + ChainNumber);
                    parts.Add("pitch" + Len(ChainPitchMm)); parts.Add("roller" + Len(RollerDiameterMm));
                    break;
                case GearFamily.TimingWheel:
                    // the standard's name ("htd8m", "gt2", "t5") says the profile; the pitch is
                    // still spelled out because it stays editable independently of the name
                    parts.Add("timingwheel"); parts.Add(BeltTypeSlug); parts.Add("z" + Teeth);
                    parts.Add("beltpitch" + Len(BeltPitchMm)); parts.Add("fw" + Len(FaceWidthMm));
                    break;
                case GearFamily.TimingBelt:
                    parts.Add("timingbelt"); parts.Add(BeltTypeSlug); parts.Add("beltpitch" + Len(BeltPitchMm));
                    parts.Add("teeth" + CutterTeeth); parts.Add("w" + Len(FaceWidthMm));
                    break;
                case GearFamily.EccentricCycloidal:
                    parts.Add("ecgear"); parts.Add("z" + Teeth); parts.Add("a" + Len(CentreDistanceMm));
                    parts.Add(EccentricityMm > 0 ? "e" + Len(EccentricityMm) : "eauto");
                    parts.Add(PinionDiameterMm > 0 ? "dp" + Len(PinionDiameterMm) : "dpauto");
                    parts.Add("fw" + Len(FaceWidthMm));
                    if (LeadMm > 0) parts.Add("lead" + Len(LeadMm));
                    parts.Add(hand + "H");
                    break;
                case GearFamily.GloboidWorm:
                    parts.Add("globoidworm"); parts.Add("starts" + WormStarts); parts.Add("wheel" + MateTeeth); parts.Add(size);
                    parts.Add("pd" + Len(PitchDiameterMm)); parts.Add("wrap" + N(EnvelopeTeeth)); parts.Add("pa" + N(PressureAngleDeg));
                    parts.Add(hand + "H");
                    break;
                case GearFamily.Hypoid:
                    parts.Add("hypoid"); parts.Add("z" + Teeth + "x" + MateTeeth); parts.Add(size);
                    parts.Add("e" + Len(OffsetMm)); parts.Add("psi" + N(SpiralAngleDeg) + hand);
                    parts.Add("pa" + N(PressureAngleDeg));
                    if (CutterRadiusMm > 0) parts.Add("rc" + Len(CutterRadiusMm));
                    parts.Add("fw" + Len(FaceWidthMm));
                    break;
                case GearFamily.SpiralBevel:
                    parts.Add(IsZerol ? "zerolbevel" : "spiralbevel"); parts.Add("z" + Teeth); parts.Add(size);
                    parts.Add("pa" + N(PressureAngleDeg));
                    parts.Add("mate" + MateTeeth); parts.Add("shaft" + N(ShaftAngleDeg));
                    if (PitchAngleOverrideDeg.HasValue) parts.Add("pitchang" + N(PitchAngleOverrideDeg.Value));
                    if (!IsZerol) parts.Add("spiral" + N(SpiralAngleDeg));
                    parts.Add(hand + "H");
                    if (CutterRadiusMm > 0) parts.Add("cutter" + Len(CutterRadiusMm));
                    parts.Add("fw" + Len(FaceWidthMm));
                    break;
                case GearFamily.CycloidalDrive:
                    parts.Add("cycdrive"); parts.Add("lobes" + Teeth);
                    parts.Add("pcd" + Len(PinCircleDiameterMm)); parts.Add("roller" + Len(RollerDiameterMm));
                    parts.Add("e" + Len(EccentricityMm)); parts.Add("fw" + Len(FaceWidthMm));
                    if (OutputPinCount > 0) parts.Add("out" + OutputPinCount + "x" + Len(OutputPinDiameterMm) + "on" + Len(OutputCircleDiameterMm));
                    break;
                case GearFamily.Cycloidal:
                    parts.Add("cycloidal"); parts.Add("z" + Teeth); parts.Add(size);
                    parts.Add("roll" + (RollingCircleDiameterMm > 0 ? Len(RollingCircleDiameterMm) : "auto"));
                    parts.Add("fw" + Len(FaceWidthMm));
                    break;
                case GearFamily.Planetary:
                    parts.Add("planetary"); parts.Add("s" + Teeth + "_p" + MateTeeth + "x" + PlanetCount + "_r" + (Teeth + 2 * MateTeeth));
                    parts.Add(size); parts.Add("pa" + N(PressureAngleDeg));
                    parts.Add("rim" + Len(RimThicknessMm)); parts.Add("fw" + Len(FaceWidthMm));
                    break;
                case GearFamily.CrossedHelical:
                    // gear 1's helix/hand; gear 2's follow from the shaft angle (docs/gear-math.md 7.5)
                    parts.Add("screwpair"); parts.Add("z" + Teeth + "x" + MateTeeth); parts.Add(size);
                    parts.Add("pa" + N(PressureAngleDeg));
                    parts.Add("helix" + N(Math.Abs(HelixAngleDeg)) + hand);
                    parts.Add("shaft" + N(ShaftAngleDeg));
                    parts.Add("fw" + Len(FaceWidthMm));
                    break;
                case GearFamily.Herringbone:
                    // hand letter = the half at z=0 (the other half is the opposite by construction)
                    parts.Add("herringbone"); parts.Add("z" + Teeth); parts.Add(size);
                    parts.Add("pa" + N(PressureAngleDeg));
                    parts.Add("helix" + N(Math.Abs(HelixAngleDeg)) + hand);
                    parts.Add("fw" + Len(FaceWidthMm));
                    if (GapWidthMm > 0) parts.Add("gap" + Len(GapWidthMm));
                    break;
                default:
                    parts.Add(IsHelical ? "helical" : "spur"); parts.Add("z" + Teeth); parts.Add(size);
                    parts.Add("pa" + N(PressureAngleDeg));
                    if (IsHelical) parts.Add("helix" + N(Math.Abs(HelixAngleDeg)) + hand);
                    parts.Add("fw" + Len(FaceWidthMm));
                    break;
            }
            if (Family != GearFamily.Rack && BoreDiameterMm > 0) parts.Add("bore" + Len(BoreDiameterMm));
            if (Family != GearFamily.Worm && Math.Abs(ProfileShift) > 1e-9) parts.Add("x" + N(ProfileShift));
            if (Math.Abs(AddendumCoeff - 1.0) > 1e-9 || Math.Abs(DedendumCoeff - 1.25) > 1e-9)
                parts.Add("ha" + N(AddendumCoeff) + "hf" + N(DedendumCoeff));
            if (BacklashMm > 1e-9) parts.Add("bl" + Len(BacklashMm));

            string ext = extension.StartsWith(".") ? extension : "." + extension;
            if (ext.Equals(".dxf", StringComparison.OrdinalIgnoreCase)) parts.Add("profile");
            return string.Join("_", parts) + ext;
        }
    }

    public static class UnitConversion
    {
        public const double MmPerInch = 25.4;

        public static double MmToInch(double mm) => mm / MmPerInch;

        public static double InchToMm(double inch) => inch * MmPerInch;

        public static double ModuleToDiametralPitch(double moduleMm) => MmPerInch / moduleMm;

        public static double DiametralPitchToModule(double dp) => MmPerInch / dp;
    }
}
