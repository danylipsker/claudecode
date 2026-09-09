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
