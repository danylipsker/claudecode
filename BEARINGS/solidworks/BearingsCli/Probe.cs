// Probe: prints API facts needed by the builder (signatures by reflection, sketch-plane mapping,
// inference behaviour, dimension-name case rule, extrude direction). Nothing is saved.
using System;
using System.Linq;
using System.Reflection;
using System.Collections.Generic;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace Bearings.Cli
{
    internal static class Probe
    {
        public static int Run(ISldWorks sw, Dictionary<string, string> o)
        {
            Console.WriteLine("=== interop signatures");
            Sig(typeof(IFeatureManager), "FeatureFillet", "FeatureCircularPattern", "InsertAxis", "InsertRefPlane", "FeatureRevolve", "InsertMirrorFeature");
            Sig(typeof(IFeature), "GetErrorCode", "GetFirstDisplayDimension");
            Sig(typeof(IDesignTable), "");
            Sig(typeof(ISketchManager), "Rectangle", "CreateArc", "CreateCenterLine");
            Sig(typeof(IModelDoc2), "InsertFamilyTable", "AddDimension2", "AddHorizontalDimension2", "AddVerticalDimension2", "AddDiameterDimension2", "AddRadialDimension2", "CloseFamilyTable");
            Sig(typeof(IModelDocExtension), "SaveAs3", "SelectByID2");
            Sig(typeof(ISketch), "ModelToSketchTransform", "GetConstrainedStatus", "RelationManager");
            Sig(typeof(ISketchRelationManager), "GetRelationsCount");

            Console.WriteLine("=== live tests in a new part (closed without saving)");
            string tpl = sw.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplatePart);
            Console.WriteLine("part template: " + tpl);
            var doc = (IModelDoc2)sw.NewDocument(tpl, 0, 0, 0);
            if (doc == null) { Console.WriteLine("NewDocument failed"); return 1; }
            try
            {
                doc.Extension.SetUserPreferenceInteger((int)swUserPreferenceIntegerValue_e.swUnitSystem, 0, (int)swUnitSystem_e.swUnitSystem_MMGS);
                var planes = new List<IFeature>();
                var f = (IFeature)doc.FirstFeature();
                while (f != null) { if (f.GetTypeName2() == "RefPlane") planes.Add(f); f = (IFeature)f.GetNextFeature(); }
                Console.WriteLine("planes: " + string.Join(", ", planes.Select(p => p.Name)));
                var front = planes[0]; var top = planes[1]; var right = planes[2];
                var sm = doc.SketchManager;
                var mu = (IMathUtility)sw.GetMathUtility();

                // (a) Top-plane sketch axes -> model directions
                doc.ClearSelection2(true); top.Select2(false, 0); sm.InsertSketch(true);
                var sk = sm.ActiveSketch;
                var xf = sk.ModelToSketchTransform; var inv = xf.Inverse();
                foreach (var pt in new[] { new double[] { 1, 0, 0 }, new double[] { 0, 1, 0 } })
                {
                    var mp = (IMathPoint)mu.CreatePoint(pt); var mm = (IMathPoint)mp.MultiplyTransform(inv); var a = (double[])mm.ArrayData;
                    Console.WriteLine("Top sketch (" + pt[0] + "," + pt[1] + ") -> model (" + a[0].ToString("0.###") + ", " + a[1].ToString("0.###") + ", " + a[2].ToString("0.###") + ")");
                }
                // (b) inference on CreateLine (AddToDB false): relation counts
                var rm = sk.RelationManager;
                int n0 = rm.GetRelationsCount(0);
                var l1 = sm.CreateLine(0.01, 0.02, 0, 0.03, 0.02, 0);
                int n1 = rm.GetRelationsCount(0);
                doc.ClearSelection2(true); l1.Select4(false, null); doc.SketchAddConstraints("sgHORIZONTAL2");
                int n2 = rm.GetRelationsCount(0);
                Console.Out.Flush(); Console.WriteLine("relations: empty=" + n0 + " after horizontal CreateLine=" + n1 + " after explicit sgHORIZONTAL2=" + n2 + " constrained status=" + sk.GetConstrainedStatus());
                // (c) corner rectangle relations
                var rect = (object[])sm.CreateCornerRectangle(0.04, 0.01, 0, 0.06, 0.03, 0);
                Console.Out.Flush(); Console.WriteLine("CreateCornerRectangle: " + (rect == null ? "null" : rect.Length + " segments") + ", relations now=" + rm.GetRelationsCount(0));
                // (d) dimension names: a rename to an existing name opens a message box, so the case rule is
                //     tested through name lookup instead (after the sketch is renamed, below).
                var rl = (ISketchSegment)rect[0];
                doc.ClearSelection2(true); rl.Select4(false, null);
                var dd1 = (IDisplayDimension)doc.AddDimension2(0.05, 0.005, 0);
                var d1 = (IDimension)dd1.GetDimension2(0);
                Console.Out.Flush(); Console.WriteLine("dim auto name: " + d1.FullName + " value(m)=" + d1.SystemValue);
                d1.Name = "dcase";
                var rl2 = (ISketchSegment)rect[1];
                doc.ClearSelection2(true); rl2.Select4(false, null);
                var dd2 = (IDisplayDimension)doc.AddDimension2(0.065, 0.02, 0);
                var d2 = (IDimension)dd2.GetDimension2(0);
                Console.WriteLine("second dim auto name: " + d2.FullName);
                // (e) point-line dimension from origin, horizontal/vertical point dims
                doc.ClearSelection2(true);
                doc.Extension.SelectByID2("Point1@Origin", "EXTSKETCHPOINT", 0, 0, 0, false, 0, null, 0);
                rl.Select4(true, null);
                var dd3 = (IDisplayDimension)doc.AddDimension2(0.02, -0.01, 0);
                Console.WriteLine("origin->line dim: " + (dd3 == null ? "null" : ((IDimension)dd3.GetDimension2(0)).FullName + " = " + ((IDimension)dd3.GetDimension2(0)).SystemValue));
                sm.InsertSketch(true);
                var skf = (IFeature)sk; skf.Name = "ProbeS";
                Console.WriteLine("sketch renamed: " + skf.Name + "; dim full names now e.g. " + d1.FullName);
                doc.ClearSelection2(true);
                bool selExact = doc.Extension.SelectByID2("dcase@ProbeS", "DIMENSION", 0, 0, 0, false, 0, null, 0);
                doc.ClearSelection2(true);
                bool selUpper = doc.Extension.SelectByID2("DCASE@ProbeS", "DIMENSION", 0, 0, 0, false, 0, null, 0);
                doc.ClearSelection2(true);
                Console.WriteLine("name lookup: exact case=" + selExact + "  upper case=" + selUpper + "  (both true => names are case-insensitive)");
                Console.Out.Flush();

                // (f) semicircle revolve about its chord -> sphere body count
                doc.ClearSelection2(true); top.Select2(false, 0); sm.InsertSketch(true);
                var sk2 = sm.ActiveSketch;
                double p = 0.02, r = 0.004;
                var chord = sm.CreateLine(p - r, 0, 0, p + r, 0, 0);
                var arc = sm.CreateArc(p, 0, 0, p - r, 0, 0, p + r, 0, 0, 1);
                var arcc = (ISketchArc)arc;
                var cpt = (ISketchPoint)arcc.GetCenterPoint2();
                doc.ClearSelection2(true); cpt.Select4(false, null); chord.Select4(true, null); doc.SketchAddConstraints("sgATMIDDLE");
                doc.ClearSelection2(true); doc.Extension.SelectByID2("Point1@Origin", "EXTSKETCHPOINT", 0, 0, 0, false, 0, null, 0); cpt.Select4(true, null); doc.SketchAddConstraints("sgHORIZONTALPOINTS2D");
                doc.ClearSelection2(true); arc.Select4(false, null);
                var ddr = (IDisplayDimension)doc.AddDimension2(p, r * 1.5, 0);
                doc.ClearSelection2(true); doc.Extension.SelectByID2("Point1@Origin", "EXTSKETCHPOINT", 0, 0, 0, false, 0, null, 0); cpt.Select4(true, null);
                var ddp = (IDisplayDimension)doc.AddHorizontalDimension2(p / 2, -0.01, 0);
                Console.WriteLine("ball sketch dims: " + (ddr == null ? "null" : ((IDimension)ddr.GetDimension2(0)).FullName + "=" + ((IDimension)ddr.GetDimension2(0)).SystemValue) + ", " + (ddp == null ? "null" : ((IDimension)ddp.GetDimension2(0)).FullName + "=" + ((IDimension)ddp.GetDimension2(0)).SystemValue) + " status=" + sk2.GetConstrainedStatus());
                sm.InsertSketch(true);
                var sk2f = (IFeature)sk2; sk2f.Name = "BallS";
                doc.ClearSelection2(true); sk2f.Select2(false, 0);
                var sel = (ISelectionMgr)doc.SelectionManager; var sd = sel.CreateSelectData(); sd.Mark = 16; chord.Select4(true, sd);
                var rev = (IFeature)doc.FeatureManager.FeatureRevolve2(true, true, false, false, false, false, 0, 0, 2 * Math.PI, 0, false, false, 0, 0, 0, 0, 0, false, false, false);
                var part = (IPartDoc)doc;
                var bodies = (object[])part.GetBodies2((int)swBodyType_e.swSolidBody, true);
                Console.WriteLine("revolve: " + (rev == null ? "null" : rev.Name) + ", solid bodies=" + (bodies == null ? 0 : bodies.Length));
                if (bodies != null && bodies.Length > 0)
                {
                    var mpr = doc.Extension.CreateMassProperty(); var com = (double[])mpr.CenterOfMass;
                    Console.WriteLine("sphere centre of mass (model): " + string.Join(", ", com.Select(c => (c * 1000).ToString("0.###"))) + " mm   (expected radius " + p * 1000 + " along the Top-plane sketch x axis)");
                }
                // (g) reference axis from Top+Right, circular pattern with count dim
                doc.ClearSelection2(true); top.Select2(false, 0); right.Select2(true, 0);
                bool axOk = doc.InsertAxis2(true);
                var ax = (IFeature)doc.FeatureByPositionReverse(0);
                Console.WriteLine("axis: " + axOk + " " + (ax == null ? "null" : ax.Name + " " + ax.GetTypeName2()));
                if (rev != null && ax != null)
                {
                    doc.ClearSelection2(true); ax.Select2(false, 1); rev.Select2(true, 4);
                    var pat = (IFeature)doc.FeatureManager.FeatureCircularPattern4(6, 2 * Math.PI, false, "", false, true, false);
                    Console.WriteLine("pattern: " + (pat == null ? "null" : pat.Name));
                    if (pat != null) Dump.Dims(pat, "   ");
                    bodies = (object[])part.GetBodies2((int)swBodyType_e.swSolidBody, true);
                    Console.WriteLine("bodies after pattern: " + (bodies == null ? 0 : bodies.Length));
                }
                // (h) equation on the radius dim, then rebuild and read back
                var eq = doc.GetEquationMgr();
                int ei = eq.Add2(-1, "\"" + ((IDimension)ddr.GetDimension2(0)).Name + "@BallS\" = 0.006", true);
                doc.ForceRebuild3(false);
                Console.WriteLine("equation index " + ei + " -> radius now " + ((IDimension)ddr.GetDimension2(0)).SystemValue * 1000 + " mm; equations: " + eq.GetCount());
                // (i) fillet on sphere? skip; fillet signature printed above
                Console.WriteLine("feature errors check: " + FeatureErrors(doc));
            }
            finally
            {
                sw.CloseDoc(doc.GetTitle());
                Console.WriteLine("probe part closed; open documents: " + sw.GetDocumentCount());
            }
            return 0;
        }

        public static string FeatureErrors(IModelDoc2 doc)
        {
            var bad = new List<string>();
            var f = (IFeature)doc.FirstFeature();
            while (f != null)
            {
                try
                {
                    var m = typeof(IFeature).GetMethod("GetErrorCode2");
                    var a = new object[] { null };
                    int code = (int)m.Invoke(f, a);
                    if (code != 0) bad.Add(f.Name + ":" + code + "/" + a[0]);
                }
                catch (Exception ex) { bad.Add(f.Name + ":?" + ex.Message); }
                f = (IFeature)f.GetNextFeature();
            }
            return bad.Count == 0 ? "none" : string.Join(", ", bad);
        }

        private static void Sig(Type t, params string[] filters)
        {
            foreach (var m in t.GetMethods().OrderBy(m => m.Name))
            {
                if (filters.Length > 0 && !filters.Any(x => x == "" || m.Name.IndexOf(x, StringComparison.OrdinalIgnoreCase) >= 0)) continue;
                if (m.Name.StartsWith("get_") || m.Name.StartsWith("set_")) { if (filters.All(x => x != "" && m.Name.IndexOf(x, StringComparison.OrdinalIgnoreCase) < 0)) continue; }
                Console.WriteLine("  " + t.Name + "." + m.Name + "(" + string.Join(", ", m.GetParameters().Select(p => p.ParameterType.Name + " " + p.Name)) + ") : " + m.ReturnType.Name);
            }
        }
    }
}
