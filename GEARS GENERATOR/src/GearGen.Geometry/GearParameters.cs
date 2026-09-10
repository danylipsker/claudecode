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
        Cycloidal
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

        /// <summary>A default file name that says what the part IS: the family
        /// and every property that determines its geometry, so a folder of
        /// exports is self-describing instead of a pile of "gear_z20"s. Same
        /// stem for STEP/DXF/SLDPRT, differing only by extension (DXF gets a
        /// "_profile" marker, since it's the 2D section, not the solid).
        /// Sizes follow the active unit: "m2.5" (module, mm) or "dp12"
        /// (diametral pitch, 1/in), with lengths in mm or "in" to match.
        /// Invariant culture throughout -- in a de-DE locale a 2.5 mm module
        /// would otherwise put a stray comma in the file name.</summary>
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
