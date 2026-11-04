// Dump: feature tree, dimensions, equations, custom properties and design table of a part.
using System;
using System.Collections.Generic;
using System.Linq;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace Bearings.Cli
{
    internal static class Dump
    {
        public static int Run(ISldWorks sw, string path, string config)
        {
            int e = 0, w = 0;
            var doc = (IModelDoc2)sw.OpenDoc6(path, (int)swDocumentTypes_e.swDocPART, (int)swOpenDocOptions_e.swOpenDocOptions_ReadOnly, "", ref e, ref w);
            if (doc == null) { Console.WriteLine("open failed, error " + e); return 1; }
            try
            {
                if (config != null)
                    foreach (string cfg in config.Split('|'))
                    {
                        if (!doc.ShowConfiguration2(cfg)) { Console.WriteLine("no configuration " + cfg); return 1; }
                        for (int k = 1; k <= 2; k++)
                        {
                            doc.ForceRebuild3(false);
                            Console.WriteLine("configuration " + cfg + " rebuild " + k + ":");
                            Boxes((IPartDoc)doc);
                        }
                    }
                Console.WriteLine("opened: " + doc.GetTitle() + "  configurations: " + doc.GetConfigurationCount() + "  active: " + doc.ConfigurationManager.ActiveConfiguration.Name);
                Console.WriteLine("--- feature tree");
                var f = (IFeature)doc.FirstFeature();
                while (f != null)
                {
                    int faces = 0; try { faces = f.GetFaceCount(); } catch { }
                    bool warn = false; int code = 0; try { code = f.GetErrorCode2(out warn); } catch { }
                    Console.WriteLine("{0,-28} {1}{2}{3}", f.Name, f.GetTypeName2(), faces > 0 ? "  faces " + faces : "", code != 0 ? "  " + (warn ? "warning " : "ERROR ") + (Enum.GetName(typeof(swFeatureError_e), code) ?? code.ToString()) : "");
                    Dims(f, "      ");
                    if (f.GetTypeName2() == "ProfileFeature") Relations(f, "      ");
                    var sub = (IFeature)f.GetFirstSubFeature();
                    while (sub != null)
                    {
                        Console.WriteLine("   {0,-25} {1}", sub.Name, sub.GetTypeName2());
                        Dims(sub, "      ");
                        sub = (IFeature)sub.GetNextSubFeature();
                    }
                    f = (IFeature)f.GetNextFeature();
                }
                Console.WriteLine("--- equations");
                var eq = doc.GetEquationMgr();
                for (int i = 0; i < eq.GetCount(); i++) Console.WriteLine("  " + eq.Equation[i]);
                Console.WriteLine("--- custom properties (document)");
                Props(doc, "");
                Console.WriteLine("--- custom properties (active configuration)");
                Props(doc, doc.ConfigurationManager.ActiveConfiguration.Name);
                Console.WriteLine("--- design table");
                var dt = (IDesignTable)doc.GetDesignTable();
                if (dt == null) Console.WriteLine("  none");
                else
                {
                    Console.WriteLine("  rows=" + dt.GetRowCount() + " columns=" + dt.GetColumnCount());
                    int cols = dt.GetColumnCount();
                    for (int r = 0; r <= Math.Min(2, dt.GetRowCount()); r++)
                    {
                        var cells = new List<string>();
                        for (int c = 0; c <= cols; c++) cells.Add(dt.GetEntryText(r, c));
                        Console.WriteLine("  row " + r + ": " + string.Join(" | ", cells));
                    }
                }
                var part = (IPartDoc)doc;
                var bodies = (object[])part.GetBodies2((int)swBodyType_e.swSolidBody, true);
                Console.WriteLine("--- solid bodies: " + (bodies == null ? 0 : bodies.Length));
                Boxes(part);
            }
            finally { sw.CloseDoc(doc.GetTitle()); }
            return 0;
        }

        private static void Boxes(IPartDoc part)
        {
            var bodies = (object[])part.GetBodies2((int)swBodyType_e.swSolidBody, true);
            if (bodies != null)
                foreach (IBody2 b in bodies)
                {
                    if (b.Name.Contains("[")) continue;   // pattern instances
                    var bb = (double[])b.GetBodyBox();
                    Console.WriteLine("    " + b.Name + ": x " + F(bb[0]) + ".." + F(bb[3]) + "  y " + F(bb[1]) + ".." + F(bb[4]) + "  z " + F(bb[2]) + ".." + F(bb[5]));
                }
            var box = (double[])part.GetPartBox(true);
            if (box != null) Console.WriteLine("    box mm: x " + F(box[0]) + ".." + F(box[3]) + "  y " + F(box[1]) + ".." + F(box[4]) + "  z " + F(box[2]) + ".." + F(box[5]));
        }

        private static string F(double m) { return (m * 1000).ToString("0.###"); }

        public static void Dims(IFeature f, string indent)
        {
            var d = (IDisplayDimension)f.GetFirstDisplayDimension();
            var items = new List<string>();
            while (d != null)
            {
                var dim = (IDimension)d.GetDimension2(0);
                items.Add(dim.FullName + "=" + (dim.SystemValue * 1000).ToString("0.####"));
                d = (IDisplayDimension)f.GetNextDisplayDimension(d);
            }
            if (items.Count > 0) Console.WriteLine(indent + "[" + string.Join(", ", items) + "]");
        }

        private static void Relations(IFeature f, string indent)
        {
            var sk = f.GetSpecificFeature2() as ISketch;
            if (sk == null) return;
            var items = new List<string>();
            var rels = (object[])sk.RelationManager.GetRelations((int)swSketchRelationFilterType_e.swAll);
            if (rels != null)
                foreach (ISketchRelation r in rels)
                {
                    var ents = (object[])r.GetEntities();
                    var names = new List<string>();
                    if (ents != null)
                        foreach (object o in ents)
                        {
                            var seg = o as ISketchSegment; var pt = o as ISketchPoint;
                            if (seg != null) names.Add("seg(" + seg.GetName() + ")");
                            else if (pt != null) names.Add("pt(" + (pt.X * 1000).ToString("0.##") + "," + (pt.Y * 1000).ToString("0.##") + ")");
                            else names.Add(o.GetType().Name);
                        }
                    items.Add((Enum.GetName(typeof(swConstraintType_e), r.GetRelationType()) ?? r.GetRelationType().ToString()) + "[" + string.Join(" ", names) + "]");
                }
            Console.WriteLine(indent + "status " + (Enum.GetName(typeof(swConstrainedStatus_e), sk.GetConstrainedStatus()) ?? sk.GetConstrainedStatus().ToString()) + ", relations: " + string.Join(", ", items));
            var segs = (object[])sk.GetSketchSegments();
            if (segs != null)
            {
                var ss = new List<string>();
                foreach (ISketchSegment s in segs)
                {
                    var ln = s as ISketchLine;
                    if (ln == null) { ss.Add(s.GetName() + ":" + s.GetType()); continue; }
                    var a = (ISketchPoint)ln.GetStartPoint2(); var b = (ISketchPoint)ln.GetEndPoint2();
                    ss.Add(s.GetName() + "(" + (a.X * 1000).ToString("0.##") + "," + (a.Y * 1000).ToString("0.##") + ")-(" + (b.X * 1000).ToString("0.##") + "," + (b.Y * 1000).ToString("0.##") + ")" + (s.ConstructionGeometry ? "c" : ""));
                }
                Console.WriteLine(indent + "segments: " + string.Join(" ", ss));
            }
        }

        private static void Props(IModelDoc2 doc, string config)
        {
            var cp = doc.Extension.CustomPropertyManager[config];
            var names = (object[])cp.GetNames();
            if (names == null) { Console.WriteLine("  none"); return; }
            foreach (string n in names)
            {
                string v, r; cp.Get4(n, false, out v, out r);
                Console.WriteLine("  " + n + " = " + v + "  -> " + r);
            }
        }
    }
}
