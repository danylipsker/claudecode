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
        Internal
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

        public double ModuleFromDiametralPitch => 25.4 / DiametralPitch;

        public double EffectiveModuleMm => Unit == UnitSystem.Inch ? ModuleFromDiametralPitch : ModuleMm;

        public GearParameters Clone()
        {
            return (GearParameters)MemberwiseClone();
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
