// restore-sketch-settings: switches the sketch snap / inference options back on (an investigation run
// on 2026-11-03 had turned them off; they are the SOLIDWORKS defaults).
using System;
using System.Linq;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace Bearings.Cli
{
    internal static class Probe2
    {
        public static int Run(ISldWorks sw)
        {
            string[] wereTrue = {
                "swSketchAutomaticRelations", "swSketchInferFromModel", "swSketchInference", "swSketchSnapsPoints",
                "swSketchSnapsCenterPoints", "swSketchSnapsMidPoints", "swSketchSnapsQuadrantPoints", "swSketchSnapsIntersections",
                "swSketchSnapsNearest", "swSketchSnapsTangent", "swSketchSnapsPerpendicular", "swSketchSnapsParallel",
                "swSketchSnapsHVLines", "swSketchSnapsHVPoints", "swSketchSnapsLength", "swSketchSnapToGridIfDisplayed" };
            foreach (string n in wereTrue)
            {
                int val = (int)Enum.Parse(typeof(swUserPreferenceToggle_e), n);
                bool was = sw.GetUserPreferenceToggle(val);
                sw.SetUserPreferenceToggle(val, true);
                Console.WriteLine("   " + n + ": " + was + " -> " + sw.GetUserPreferenceToggle(val));
            }
            Console.WriteLine("sketch settings restored");
            return 0;
        }
    }
}
