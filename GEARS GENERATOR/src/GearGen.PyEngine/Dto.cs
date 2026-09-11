using System.Collections.Generic;
using Newtonsoft.Json;

namespace GearGen.PyEngine
{
    internal class EngineRequest
    {
        [JsonProperty("cmd")] public string Cmd;
        [JsonProperty("unit")] public string Unit;
        [JsonProperty("z")] public int Z;
        [JsonProperty("module_mm")] public double? ModuleMm;
        [JsonProperty("diametral_pitch")] public double? DiametralPitch;
        [JsonProperty("pressure_angle_deg")] public double PressureAngleDeg;
        [JsonProperty("profile_shift")] public double ProfileShift;
        [JsonProperty("addendum_coeff")] public double AddendumCoeff;
        [JsonProperty("dedendum_coeff")] public double DedendumCoeff;
        [JsonProperty("root_fillet_coeff")] public double RootFilletCoeff;
        [JsonProperty("face_width_mm")] public double FaceWidthMm;
        [JsonProperty("backlash_mm")] public double BacklashMm;
        [JsonProperty("bore_diameter_mm")] public double BoreDiameterMm;
        [JsonProperty("helix_angle_deg")] public double HelixAngleDeg;
        [JsonProperty("hand")] public string Hand;
        [JsonProperty("gear_type")] public string GearType;
        [JsonProperty("mate_teeth")] public int? MateTeeth;
        [JsonProperty("shaft_angle_deg")] public double? ShaftAngleDeg;
        [JsonProperty("pitch_angle_deg_override")] public double? PitchAngleOverrideDeg;
        [JsonProperty("starts")] public int? Starts;
        [JsonProperty("pitch_diameter_mm")] public double? PitchDiameterMm;
        [JsonProperty("path")] public string Path;
        [JsonProperty("simplify_tolerance_mm")] public double? SimplifyToleranceMm;
        [JsonProperty("backing_height_mm")] public double? BackingHeightMm;
        [JsonProperty("cutter_teeth")] public int? CutterTeeth;
        [JsonProperty("rim_thickness_mm")] public double? RimThicknessMm;
        [JsonProperty("gap_mm")] public double? GapMm;
        [JsonProperty("planet_count")] public int? PlanetCount;
        [JsonProperty("rolling_circle_diameter_mm")] public double? RollingCircleDiameterMm;
        [JsonProperty("pin_circle_diameter_mm")] public double? PinCircleDiameterMm;
        [JsonProperty("roller_diameter_mm")] public double? RollerDiameterMm;
        [JsonProperty("eccentricity_mm")] public double? EccentricityMm;
        [JsonProperty("output_pin_count")] public int? OutputPinCount;
        [JsonProperty("output_pin_diameter_mm")] public double? OutputPinDiameterMm;
        [JsonProperty("output_circle_diameter_mm")] public double? OutputCircleDiameterMm;
        [JsonProperty("spiral_angle_deg")] public double? SpiralAngleDeg;
        [JsonProperty("cutter_radius_mm")] public double? CutterRadiusMm;
        [JsonProperty("face_inner_radius_mm")] public double? FaceInnerRadiusMm;
        [JsonProperty("face_outer_radius_mm")] public double? FaceOuterRadiusMm;
    }

    internal class EngineResponse
    {
        [JsonProperty("ok")] public bool Ok;
        [JsonProperty("error")] public string Error;
        [JsonProperty("traceback")] public string Traceback;
        [JsonProperty("outline")] public List<List<double>> Outline;
        [JsonProperty("derived")] public Dictionary<string, double> Derived;
        [JsonProperty("warnings")] public List<string> Warnings;
        [JsonProperty("path")] public string Path;
        [JsonProperty("pong")] public bool Pong;
    }

    public class OutlinePoint
    {
        public double X;
        public double Y;
        public OutlinePoint(double x, double y) { X = x; Y = y; }
    }

    public class OutlineResult
    {
        public List<OutlinePoint> Points = new List<OutlinePoint>();
        public Dictionary<string, double> Derived = new Dictionary<string, double>();
        public List<string> Warnings = new List<string>();
    }

    public class EngineException : System.Exception
    {
        public string PythonTraceback { get; }
        public EngineException(string message, string pythonTraceback) : base(message)
        {
            PythonTraceback = pythonTraceback;
        }
    }
}
