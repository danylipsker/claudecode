using System;
using System.Collections.Generic;

namespace GearGen.Geometry
{
    /// <summary>Read-only derived values shown in the UI's info panel. The
    /// authoritative numbers come back from the Python engine with every
    /// "outline" response (see GearGen.PyEngine.OutlineResult); this class
    /// only provides a same-shape local fallback so the UI has something to
    /// show before the first engine round-trip completes.</summary>
    public class GearDerivedValues
    {
        public double PitchDiameterMm { get; set; }
        public double BaseDiameterMm { get; set; }
        public double AddendumDiameterMm { get; set; }
        public double DedendumDiameterMm { get; set; }
        public double CircularToothThicknessMm { get; set; }
        public double ModuleMm { get; set; }
        public double DiametralPitch { get; set; }
        public double ZMinNoUndercut { get; set; }

        public static GearDerivedValues QuickEstimate(GearParameters p)
        {
            double m = p.EffectiveModuleMm;
            double r = m * p.Teeth / 2.0;
            double alpha = p.PressureAngleDeg * Math.PI / 180.0;
            double rb = r * Math.Cos(alpha);
            double ra = r + m * (p.AddendumCoeff + p.ProfileShift);
            double rf = r - m * (p.DedendumCoeff - p.ProfileShift);
            double s = m * (Math.PI / 2.0 + 2 * p.ProfileShift * Math.Tan(alpha)) - p.BacklashMm;
            double zMin = 2.0 * Math.Max(p.AddendumCoeff - p.ProfileShift, 0.01) / (Math.Sin(alpha) * Math.Sin(alpha));

            return new GearDerivedValues
            {
                PitchDiameterMm = 2 * r,
                BaseDiameterMm = 2 * rb,
                AddendumDiameterMm = 2 * ra,
                DedendumDiameterMm = 2 * rf,
                CircularToothThicknessMm = s,
                ModuleMm = m,
                DiametralPitch = 25.4 / m,
                ZMinNoUndercut = zMin,
            };
        }

        public static List<string> QuickWarnings(GearParameters p)
        {
            var warnings = new List<string>();
            if (p.Teeth < 4)
                warnings.Add("Tooth count below 4 is not supported.");

            var d = QuickEstimate(p);
            if (p.Teeth < d.ZMinNoUndercut)
                warnings.Add($"z={p.Teeth} is below the undercut cutoff (~{d.ZMinNoUndercut:0.#} teeth at " +
                             $"{p.PressureAngleDeg:0.#}°, shift={p.ProfileShift:0.###}) — this gear WILL show real undercut at the tooth root.");
            if (d.DedendumDiameterMm <= 0)
                warnings.Add("Root (dedendum) circle radius is zero or negative — reduce dedendum or increase teeth/module.");
            if (p.BoreDiameterMm > 0 && p.BoreDiameterMm >= d.DedendumDiameterMm * 0.9)
                warnings.Add("Bore diameter is close to or exceeds the root diameter.");
            return warnings;
        }
    }
}
