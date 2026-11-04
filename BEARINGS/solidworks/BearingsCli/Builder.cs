// Builder: one SOLIDWORKS part per design table. Sketch "S" on the Front plane is the skeleton that the
// table drives (construction circles ID, OD, IDa, ODa, d1, D1h and a construction line B, all named);
// the geometry sketches lie on the Top plane (x = radius, y = axis) and are driven from S by equations;
// fillet "F1" carries r_min. Then the table is inserted from its Excel file and the part is saved
// next to it.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Xml.Linq;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace Bearings.Cli
{
    internal enum Kind { DeepGroove, DoubleRowBall, Cylindrical, SphericalRoller, Tapered, Thrust }

    internal sealed class TableInfo
    {
        public string Path, Name;
        public List<string> Headers = new List<string>();                 // header block up to the first empty cell
        public List<KeyValuePair<string, Dictionary<string, string>>> Rows = new List<KeyValuePair<string, Dictionary<string, string>>>();
        public Kind Kind;

        public static Kind KindOf(string name)
        {
            string n = name.ToLowerInvariant();
            if (n.Contains("thrust")) return Kind.Thrust;
            if (n.Contains("tapered")) return Kind.Tapered;
            if (n.Contains("cylindrical")) return Kind.Cylindrical;
            if (n.Contains("spherical roller")) return Kind.SphericalRoller;
            if (n.Contains("self-aligning")) return Kind.DoubleRowBall;
            return Kind.DeepGroove;
        }

        /// <summary>Skeleton dimension names (header "X@S" -> "X") in table order.</summary>
        public List<string> SkeletonDims { get { return Headers.Where(h => h.EndsWith("@S")).Select(h => h.Substring(0, h.Length - 2)).ToList(); } }

        public double Num(Dictionary<string, string> row, string header, double fallback)
        {
            string s; double d;
            if (row.TryGetValue(header, out s) && double.TryParse(s, NumberStyles.Float, CultureInfo.InvariantCulture, out d)) return d;
            return fallback;
        }

        public static List<TableInfo> Load(string dir, string only)
        {
            var list = new List<TableInfo>();
            foreach (string f in Directory.GetFiles(dir, "*.xlsx").OrderBy(x => x, StringComparer.OrdinalIgnoreCase))
            {
                string name = System.IO.Path.GetFileNameWithoutExtension(f);
                if (name.StartsWith("~$") || name.Equals("README", StringComparison.OrdinalIgnoreCase)) continue;
                if (!string.IsNullOrEmpty(only) && !only.Split('|').Any(o => name.IndexOf(o.Trim(), StringComparison.OrdinalIgnoreCase) >= 0)) continue;
                var t = new TableInfo { Path = f, Name = name, Kind = KindOf(name) };
                var rows = Xlsx.ReadFirstSheet(f);
                if (rows.Count < 3) throw new Exception(name + ": fewer than three rows");
                var hdr = rows[1];
                for (int c = 1; c < hdr.Length; c++) { if (string.IsNullOrEmpty(hdr[c])) break; t.Headers.Add(hdr[c]); }
                for (int r = 2; r < rows.Count; r++)
                {
                    var row = rows[r];
                    if (row.Length == 0 || string.IsNullOrEmpty(row[0])) continue;
                    var d = new Dictionary<string, string>();
                    for (int c = 0; c < t.Headers.Count; c++) d[t.Headers[c]] = c + 1 < row.Length ? row[c + 1] : "";
                    t.Rows.Add(new KeyValuePair<string, Dictionary<string, string>>(row[0], d));
                }
                list.Add(t);
            }
            return list;
        }
    }

    /// <summary>Minimal .xlsx reader (first worksheet, cached values, shared strings).</summary>
    internal static class Xlsx
    {
        private static readonly XNamespace NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";

        public static List<string[]> ReadFirstSheet(string path)
        {
            var result = new List<string[]>();
            using (var zip = ZipFile.OpenRead(path))
            {
                var shared = new List<string>();
                var sse = zip.GetEntry("xl/sharedStrings.xml");
                if (sse != null)
                    using (var s = sse.Open())
                        foreach (var si in XDocument.Load(s).Root.Elements(NS + "si"))
                            shared.Add(string.Concat(si.Descendants(NS + "t").Select(t => t.Value)));
                var sheet = zip.GetEntry("xl/worksheets/sheet1.xml");
                if (sheet == null) throw new Exception("no xl/worksheets/sheet1.xml in " + path);
                XDocument doc;
                using (var s = sheet.Open()) doc = XDocument.Load(s);
                foreach (var row in doc.Descendants(NS + "row"))
                {
                    var cells = new Dictionary<int, string>();
                    int max = -1;
                    foreach (var c in row.Elements(NS + "c"))
                    {
                        string r = (string)c.Attribute("r");
                        int col = ColIndex(r);
                        string type = (string)c.Attribute("t");
                        string v = null;
                        var ve = c.Element(NS + "v");
                        if (type == "s" && ve != null) v = shared[int.Parse(ve.Value, CultureInfo.InvariantCulture)];
                        else if (type == "inlineStr") v = string.Concat(c.Descendants(NS + "t").Select(t => t.Value));
                        else if (ve != null) v = ve.Value;
                        if (v != null) { cells[col] = v; if (col > max) max = col; }
                    }
                    var arr = new string[max + 1];
                    for (int i = 0; i <= max; i++) arr[i] = cells.ContainsKey(i) ? cells[i] : "";
                    result.Add(arr);
                }
            }
            return result;
        }

        private static int ColIndex(string cellRef)
        {
            int n = 0;
            foreach (char ch in cellRef) { if (ch < 'A' || ch > 'Z') break; n = n * 26 + (ch - 'A' + 1); }
            return n - 1;
        }
    }

    internal static class Builder
    {
        private static readonly double Ki = Math.Tan(10 * Math.PI / 180);   // tapered: cone raceway half-angle
        private static readonly double Ko = Math.Tan(16 * Math.PI / 180);   // tapered: cup raceway half-angle

        public static int BuildAll(ISldWorks sw, string dir, string only, bool noTable, bool keep)
        {
            var tables = TableInfo.Load(dir, only);
            if (tables.Count == 0) { Console.WriteLine("no tables match in " + dir); return 2; }
            Console.WriteLine(tables.Count + " table(s) in " + dir);
            int pid = SwPid();
            int failed = 0;
            using (var watch = new DialogWatch(pid))
            {
                foreach (var t in tables)
                {
                    string target = Path.Combine(dir, t.Name + ".SLDPRT");
                    Console.WriteLine("=== " + t.Name + "  [" + t.Kind + "]  " + t.Rows.Count + " rows, skeleton " + string.Join(" ", t.SkeletonDims));
                    SwPart p = null;
                    try
                    {
                        p = new SwPart(sw);
                        var v = Defaults(t);
                        BuildPart(p, t, v);
                        p.Doc.ForceRebuild3(false);
                        string err = p.FeatureErrors();
                        if (err != "") throw new Exception("feature errors before the table: " + err);
                        var box = p.BoxMm();
                        Console.WriteLine("    model: " + p.BodyCount() + " bodies, box x " + F(box[0]) + ".." + F(box[3]) + " z " + F(box[2]) + ".." + F(box[5]) + " (OD " + v["OD"] + ", B " + v["B"] + "), equations " + p.Eq.GetCount());
                        foreach (var l in p.Log) Console.WriteLine("    " + l);
                        if (!noTable)
                        {
                            int before = watch.Seen.Count;
                            bool ok = p.Doc.InsertFamilyTableOpen(t.Path);
                            try { p.Doc.CloseFamilyTable(); } catch (Exception ex) { Console.WriteLine("    CloseFamilyTable: " + ex.Message); }
                            p.Doc.ForceRebuild3(false);
                            int configs = p.Doc.GetConfigurationCount();
                            var dt = (IDesignTable)p.Doc.GetDesignTable();
                            string dtInfo = "no design table object";
                            if (dt != null)
                            {
                                // link the table to its Excel file so the file stays the source of the part
                                try { dt.FileName = t.Path; dt.LinkToFile = true; } catch (Exception ex) { Console.WriteLine("    link to file: " + ex.Message); }
                                dtInfo = "source " + dt.SourceType + " (2 from file, 3 linked), linked " + dt.LinkToFile + ", file '" + dt.FileName + "'";
                            }
                            Console.WriteLine("    table: insert=" + ok + ", " + dtInfo + ", configurations " + configs + " (table rows " + t.Rows.Count + ")");
                            lock (watch.Seen) for (int i = before; i < watch.Seen.Count; i++) Console.WriteLine("    SOLIDWORKS said: " + watch.Seen[i]);
                            if (!ok) throw new Exception("InsertFamilyTableOpen returned false");
                            if (configs < t.Rows.Count + 1) throw new Exception("only " + configs + " configurations for " + t.Rows.Count + " rows");
                            err = p.FeatureErrors();
                            if (err != "") Console.WriteLine("    feature errors after the table (active configuration): " + err);
                        }
                        p.Doc.ShowConfiguration2(t.Rows[0].Key);
                        p.Doc.ForceRebuild3(false);
                        p.Doc.ShowNamedView2("*Isometric", (int)swStandardViews_e.swIsometricView);
                        p.Doc.ViewZoomtofit2();
                        p.Save(target);
                        Console.WriteLine("    saved " + target);
                        if (!keep) p.Close();
                    }
                    catch (Exception ex)
                    {
                        failed++;
                        Console.WriteLine("    FAILED: " + ex.Message);
                        if (p != null) { foreach (var l in p.Log) Console.WriteLine("    " + l); if (!keep) { try { p.Close(); } catch { } } }
                    }
                }
                if (watch.Seen.Count > 0) { Console.WriteLine("message boxes dismissed: " + watch.Seen.Count); }
            }
            Console.WriteLine(failed == 0 ? "all parts built" : failed + " part(s) failed");
            return failed == 0 ? 0 : 1;
        }

        private static int SwPid()
        {
            var ps = System.Diagnostics.Process.GetProcessesByName("SLDWORKS");
            return ps.Length > 0 ? ps[0].Id : 0;
        }

        private static string F(double d) { return d.ToString("0.###", CultureInfo.InvariantCulture); }

        /// <summary>Values of the skeleton for the first table row (the part's Default configuration).</summary>
        internal static Dictionary<string, double> Defaults(TableInfo t)
        {
            var row = t.Rows[0].Value;
            var v = new Dictionary<string, double>();
            foreach (string d in t.SkeletonDims)
            {
                double x = t.Num(row, d + "@S", double.NaN);
                if (double.IsNaN(x)) throw new Exception("first row has no value for " + d + "@S");
                v[d] = x;
            }
            double r = t.Num(row, "r_min@F1", double.NaN);
            if (double.IsNaN(r)) r = Math.Max(0.1, Math.Min(1.5, 0.015 * (v["OD"] - v["ID"])));   // table cell blank: a plausible edge radius
            v["r"] = r;
            return v;
        }

        private static Lin L(string name, double k = 1) { return Lin.Var(name, k); }

        // ------------------------------------------------------------------ parts

        internal static void BuildPart(SwPart p, TableInfo t, Dictionary<string, double> v)
        {
            Skeleton(p, t, v);
            // pattern axis: a reference axis on Z (a sketch line selected as the pattern axis made SOLIDWORKS
            // use the sketch's first line instead); the ring sketches keep their own centreline for the revolve
            IFeature axis = p.AxisZ("Z");
            ISketchSegment unusedAxis;
            switch (t.Kind)
            {
                case Kind.DeepGroove:
                    Ring(p, v, "Inner", L("ID", 0.5), L("IDa", 0.5), L("B", -0.5), L("B", 0.5), out unusedAxis);
                    Ring(p, v, "Outer", L("ODa", 0.5), L("OD", 0.5), L("B", -0.5), L("B", 0.5));
                    BallRow(p, v, axis, "Ball", (L("IDa") + L("ODa")) * 0.25, (L("ODa") - L("IDa")) * 0.2375, null, 1.3);
                    break;
                case Kind.DoubleRowBall:
                    Ring(p, v, "Inner", L("ID", 0.5), L("IDa", 0.5), L("B", -0.5), L("B", 0.5), out unusedAxis);
                    Ring(p, v, "Outer", L("ODa", 0.5), L("OD", 0.5), L("B", -0.5), L("B", 0.5));
                    BallRow(p, v, axis, "Ball1", (L("IDa") + L("ODa")) * 0.25, L("B", 0.2), L("B", 0.25), 1.3);
                    BallRow(p, v, axis, "Ball2", (L("IDa") + L("ODa")) * 0.25, L("B", 0.2), L("B", -0.25), 1.3);
                    break;
                case Kind.Cylindrical:
                    Ring(p, v, "Inner", L("ID", 0.5), L("IDa", 0.5), L("B", -0.5), L("B", 0.5), out unusedAxis);
                    Ring(p, v, "Outer", L("ODa", 0.5), L("OD", 0.5), L("B", -0.5), L("B", 0.5));
                    RollerRow(p, v, axis, "Roller", (L("IDa") + L("ODa")) * 0.25, (L("ODa") - L("IDa")) * 0.475, L("B", 0.6), new Lin(0), 1.25);
                    break;
                case Kind.SphericalRoller:
                    Ring(p, v, "Inner", L("ID", 0.5), L("IDa", 0.5), L("B", -0.5), L("B", 0.5), out unusedAxis);
                    Ring(p, v, "Outer", L("ODa", 0.5), L("OD", 0.5), L("B", -0.5), L("B", 0.5));
                    RollerRow(p, v, axis, "Roller1", (L("IDa") + L("ODa")) * 0.25, L("B", 0.38), L("B", 0.4), L("B", 0.25), 1.25);
                    RollerRow(p, v, axis, "Roller2", (L("IDa") + L("ODa")) * 0.25, L("B", 0.38), L("B", 0.4), L("B", -0.25), 1.25);
                    break;
                case Kind.Thrust:
                    // B = H; shaft washer at the bottom (bore ID, outside d1), housing washer at the top (bore D1h, outside OD)
                    Ring(p, v, "ShaftWasher", L("ID", 0.5), L("d1", 0.5), L("B", -0.5), L("B", -0.21), out unusedAxis);
                    Ring(p, v, "HousingWasher", L("D1h", 0.5), L("OD", 0.5), L("B", 0.21), L("B", 0.5));
                    BallRow(p, v, axis, "Ball", (L("IDa") + L("ODa")) * 0.25, L("B", 0.21), null, 1.3);
                    break;
                case Kind.Tapered:
                    Tapered(p, v, axis);
                    break;
            }
            p.FilletEdgesAtDiameters(new[] { v["ID"], v["OD"] }, v["r"], "F1", "r_min");
        }

        /// <summary>Sketch S on the Front plane: construction circles and the width line, named after the table headers.</summary>
        private static void Skeleton(SwPart p, TableInfo t, Dictionary<string, double> v)
        {
            p.BeginSketch(p.Front);
            double big = v["OD"];
            int i = 0;
            // circles first: a centreline drawn as the first entity of a sketch makes the next sketch's
            // first CreateLine return null (SOLIDWORKS 2020, seen in probe2)
            foreach (string d in t.SkeletonDims)
            {
                if (d == "B") continue;
                var c = p.Circle(v[d], true);
                if (c == null) throw new Exception("skeleton circle " + d + " not created");
                p.Dim(d, SwPart.DimKind.Diameter, big * 0.6 + 2 * i, big * 0.6 + 2 * i, c);
                i++;
            }
            var line = p.CenterLine(-v["B"] / 2, 0, v["B"] / 2, 0);
            if (line == null) throw new Exception("skeleton width line not created");
            p.Relation("sgHORIZONTAL2D", line);
            p.Relation("sgATMIDDLE", "origin", line);
            p.Dim("B", SwPart.DimKind.Any, 0, -big * 0.7, line);
            p.EndSketch("S");
        }

        /// <summary>Rectangle profile [x1,x2] x [y1,y2] revolved about the Z axis (sketch "<name>S", feature "<name>Ring" or the name itself).</summary>
        private static IFeature Ring(SwPart p, Dictionary<string, double> v, string name, Lin x1, Lin x2, Lin y1, Lin y2)
        {
            ISketchSegment axis;
            return Ring(p, v, name, x1, x2, y1, y2, out axis);
        }

        private static IFeature Ring(SwPart p, Dictionary<string, double> v, string name, Lin x1, Lin x2, Lin y1, Lin y2, out ISketchSegment axisOut)
        {
            string sk = name + "S";
            p.BeginSketch(p.Top);
            var rd = Rect(p, v, sk, x1, x2, y1, y2);
            double ax = Math.Max(Math.Abs(y1.Eval(v)), Math.Abs(y2.Eval(v))) * 1.5 + 1;
            var axis = p.CenterLine(0, -ax, 0, ax);
            if (axis != null) p.Relation("sgFIXED", axis);   // the axis has no other relation: fix it so the sketch is fully defined
            if (axis == null) throw new Exception("centreline not created in " + sk);
            axisOut = axis;
            var f = p.EndSketch(sk);
            return p.RevolveAbout(f, axis, name.EndsWith("Washer") ? name : name + "Ring", false);
        }

        private sealed class RectLines { public ISketchSegment Left, Right, Bottom, Top; }

        /// <summary>Corner rectangle with four dimensions from the origin (r1, r2, z1, z2) driven by equations.</summary>
        private static RectLines Rect(SwPart p, Dictionary<string, double> v, string sketchName, Lin x1, Lin x2, Lin y1, Lin y2)
        {
            double X1 = x1.Eval(v), X2 = x2.Eval(v), Y1 = y1.Eval(v), Y2 = y2.Eval(v);
            // four lines (consecutive lines merge their end points; the H/V relations are made explicit)
            var r = new RectLines();
            r.Bottom = p.Line(X1, Y1, X2, Y1);
            r.Right = p.Line(X2, Y1, X2, Y2);
            r.Top = p.Line(X2, Y2, X1, Y2);
            r.Left = p.Line(X1, Y2, X1, Y1);
            if (r.Bottom == null || r.Right == null || r.Top == null || r.Left == null) throw new Exception("rectangle lines not created in " + sketchName);
            p.JoinEnds();
            p.Relation("sgHORIZONTAL2D", r.Bottom); p.Relation("sgHORIZONTAL2D", r.Top);
            p.Relation("sgVERTICAL2D", r.Left); p.Relation("sgVERTICAL2D", r.Right);
            double tx = (X1 + X2) / 2, ty = (Y1 + Y2) / 2;
            p.Dim("r1", SwPart.DimKind.Any, X1 / 2, ty + 1, "origin", r.Left);
            p.Dim("r2", SwPart.DimKind.Any, X2 / 2, ty - 1, "origin", r.Right);
            p.Dim("z1", SwPart.DimKind.Any, tx + 1, Y1 / 2, "origin", r.Bottom);
            p.Dim("z2", SwPart.DimKind.Any, tx - 1, Y2 / 2, "origin", r.Top);
            p.Equation("r1@" + sketchName, "abs(" + x1.Text() + ")");
            p.Equation("r2@" + sketchName, "abs(" + x2.Text() + ")");
            p.Equation("z1@" + sketchName, "abs(" + y1.Text() + ")");
            p.Equation("z2@" + sketchName, "abs(" + y2.Text() + ")");
            return r;
        }

        /// <summary>A sphere (semicircle revolved about its chord) at radius p, axial position z (null = on the Front plane), patterned about Z.</summary>
        private static void BallRow(SwPart p, Dictionary<string, double> v, IFeature axis, string name, Lin pitchR, Lin ballR, Lin z, double spacing)
        {
            string sk = name + "S";
            double P = pitchR.Eval(v), R = ballR.Eval(v), Z = z == null ? 0 : z.Eval(v);
            p.BeginSketch(p.Top);
            var chord = p.Line(P - R, Z, P + R, Z);
            var arc = p.Sm.CreateArc(P * SwPart.MM, Z * SwPart.MM, 0, (P - R) * SwPart.MM, Z * SwPart.MM, 0, (P + R) * SwPart.MM, Z * SwPart.MM, 0, 1);
            var centre = (ISketchPoint)((ISketchArc)arc).GetCenterPoint2();
            p.JoinEnds();
            p.Relation("sgHORIZONTAL2D", chord);
            p.Relation("sgATMIDDLE", centre, chord);
            p.Dim("r", SwPart.DimKind.Radius, P, Z - R * 1.5, arc);
            p.Dim("p", SwPart.DimKind.Horizontal, P / 2, Z + R * 2, "origin", centre);
            if (z == null) p.Relation("sgHORIZONTALPOINTS2D", "origin", centre);
            else p.Dim("z", SwPart.DimKind.Vertical, P + R * 2, Z / 2, "origin", centre);
            var f = p.EndSketch(sk);
            var ball = p.RevolveAbout(f, chord, name, false);
            p.Equation("r@" + sk, "abs(" + ballR.Text() + ")");
            p.Equation("p@" + sk, "abs(" + pitchR.Text() + ")");
            if (z != null) p.Equation("z@" + sk, "abs(" + z.Text() + ")");
            int n = Math.Max(3, (int)(Math.PI * 2 * P / (2 * R * spacing)));
            var pat = p.CircularPattern(axis, new[] { ball }, n, name + "s");
            string expr = F(Math.PI / spacing) + "*(" + pitchR.Text() + ")/(" + ballR.Text() + ")";
            p.EquationTry("N@" + pat.Name, "int(" + expr + ")", n.ToString());
        }

        /// <summary>A cylinder (rectangle revolved about its own centreline) of diameter d and length len at radius p, axial centre z, patterned about Z.</summary>
        private static void RollerRow(SwPart p, Dictionary<string, double> v, IFeature axis, string name, Lin pitchR, Lin dia, Lin len, Lin z, double spacing)
        {
            string sk = name + "S";
            // half section: from the roller axis (x = pitch radius) out to its surface, revolved about its own
            // left edge (a profile that crosses its axis is refused)
            Lin x1 = pitchR, x2 = pitchR + dia * 0.5, y1 = z - len * 0.5, y2 = z + len * 0.5;
            double P = pitchR.Eval(v);
            p.BeginSketch(p.Top);
            var r = Rect(p, v, sk, x1, x2, y1, y2);
            var f = p.EndSketch(sk);
            var roller = p.RevolveAbout(f, r.Left, name, false);
            double D = dia.Eval(v);
            int n = Math.Max(3, (int)(Math.PI * 2 * P / (D * spacing)));
            var pat = p.CircularPattern(axis, new[] { roller }, n, name + "s");
            string expr = F(2 * Math.PI / spacing) + "*(" + pitchR.Text() + ")/(" + dia.Text() + ")";
            p.EquationTry("N@" + pat.Name, "int(" + expr + ")", n.ToString());
        }

        /// <summary>Tapered roller bearing: cone (inner ring) and cup with inclined raceways, frustum rollers on an inclined axis.</summary>
        private static void Tapered(SwPart p, Dictionary<string, double> v, IFeature axis)
        {
            ISketchSegment unused;
            Lin T = L("B"), ID = L("ID"), OD = L("OD"), IDa = L("IDa"), ODa = L("ODa");
            // cone: z from -0.5T to 0.4T, raceway r = IDa/2 + Ki*z
            Polygon(p, v, "Cone", "Cone", new[] {
                Pt(ID * 0.5, T * -0.5), Pt(IDa * 0.5 + T * (-0.5 * Ki), T * -0.5), Pt(IDa * 0.5 + T * (0.4 * Ki), T * 0.4), Pt(ID * 0.5, T * 0.4) }, null, out unused);
            // cup: z from -0.28T to 0.5T, raceway r = ODa/2 + Ko*z
            Polygon(p, v, "Cup", "Cup", new[] {
                Pt(ODa * 0.5 + T * (-0.28 * Ko), T * -0.28), Pt(OD * 0.5, T * -0.28), Pt(OD * 0.5, T * 0.5), Pt(ODa * 0.5 + T * (0.5 * Ko), T * 0.5) }, null, out unused);
            // roller: frustum between the raceways, z from -0.25T to 0.35T, revolved about its own inclined centreline
            double m = (Ki + Ko) / 2, s = 1 / Math.Sqrt(1 + m * m), delta = (Ko - Ki) / 2;
            double z1 = -0.25, z2 = 0.35;
            Lin cx1 = (IDa + ODa) * 0.25 + T * (m * z1), cz1 = T * z1, rho1 = (ODa - IDa) * 0.25 + T * (delta * z1);
            Lin cx2 = (IDa + ODa) * 0.25 + T * (m * z2), cz2 = T * z2, rho2 = (ODa - IDa) * 0.25 + T * (delta * z2);
            // unit normal to the centreline in (x, z): (s, -m*s)
            // half section of the frustum: centreline points c1, c2 and the outer side; revolved about the c2->c1 edge
            var pts = new[] {
                Pt(cx1, cz1),
                Pt(cx1 + rho1 * s, cz1 - rho1 * (m * s)),
                Pt(cx2 + rho2 * s, cz2 - rho2 * (m * s)),
                Pt(cx2, cz2) };
            var roller = Polygon(p, v, "Roller", "Roller", pts, 3, out unused);
            double P = ((IDa + ODa) * 0.25).Eval(v), D = ((ODa - IDa) * 0.5).Eval(v);
            int n = Math.Max(3, (int)(Math.PI * 2 * P / (D * 1.3)));
            var pat = p.CircularPattern(axis, new[] { roller }, n, "Rollers");
            string expr = F(2 * Math.PI / 1.3) + "*(" + ((IDa + ODa) * 0.25).Text() + ")/(" + ((ODa - IDa) * 0.5).Text() + ")";
            p.EquationTry("N@" + pat.Name, "int(" + expr + ")", n.ToString());
        }

        private static KeyValuePair<Lin, Lin> Pt(Lin x, Lin y) { return new KeyValuePair<Lin, Lin>(x, y); }

        /// <summary>Closed polygon on the Top plane, every free vertex coordinate dimensioned from the origin and driven by
        /// an equation; revolved about the Z axis (centreline through the origin) or, when axisEnds is given, about the
        /// construction line between those two points (whose ends sit at the middles of the first and third edges).</summary>
        private static IFeature Polygon(SwPart p, Dictionary<string, double> v, string sketchName, string featureName, KeyValuePair<Lin, Lin>[] pts, KeyValuePair<Lin, Lin>[] axisEnds, out ISketchSegment axisOut)
        {
            return Polygon(p, v, sketchName, featureName, pts, -1, out axisOut);
        }

        /// <summary>axisEdge: index of the polygon edge to revolve about (-1 = a centreline through the origin along the sketch y axis).</summary>
        private static IFeature Polygon(SwPart p, Dictionary<string, double> v, string sketchName, string featureName, KeyValuePair<Lin, Lin>[] pts, int axisEdge, out ISketchSegment axisOut)
        {
            string sk = sketchName + "S";
            int n = pts.Length;
            var X = pts.Select(q => q.Key.Eval(v)).ToArray();
            var Y = pts.Select(q => q.Value.Eval(v)).ToArray();
            p.BeginSketch(p.Top);
            ISketchSegment axisSeg = null;
            var lines = new ISketchSegment[n];
            for (int i = 0; i < n; i++)
            {
                int j = (i + 1) % n;
                lines[i] = p.Line(X[i], Y[i], X[j], Y[j]);
                if (lines[i] == null) throw new Exception("line " + i + " not created in " + sk);
            }
            p.JoinEnds();
            if (axisEdge < 0)
            {
                double ax = Y.Select(Math.Abs).Max() * 1.5 + 1;
                axisSeg = p.CenterLine(0, -ax, 0, ax);
                if (axisSeg != null) p.Relation("sgFIXED", axisSeg);
            }
            else axisSeg = lines[axisEdge];
            var fixedX = new bool[n]; var fixedY = new bool[n];
            // explicit H/V relations where an edge is axis-parallel (never duplicated by SOLIDWORKS)
            for (int i = 0; i < n; i++)
            {
                int j = (i + 1) % n;
                if (Math.Abs(X[i] - X[j]) < 1e-9) p.Relation("sgVERTICAL2D", lines[i]);
                else if (Math.Abs(Y[i] - Y[j]) < 1e-9) p.Relation("sgHORIZONTAL2D", lines[i]);
            }
            for (int i = 0; i < n; i++)
            {
                var pt = (ISketchPoint)((ISketchLine)lines[i]).GetStartPoint2();
                if (!fixedX[i]) { p.Dim("x" + i, SwPart.DimKind.Horizontal, X[i] / 2, Y[i] + 1.5 * (i + 1), "origin", pt); p.Equation("x" + i + "@" + sk, "abs(" + pts[i].Key.Text() + ")"); }
                if (!fixedY[i]) { p.Dim("y" + i, SwPart.DimKind.Vertical, X[i] + 1.5 * (i + 1), Y[i] / 2, "origin", pt); p.Equation("y" + i + "@" + sk, "abs(" + pts[i].Value.Text() + ")"); }
                fixedX[i] = fixedY[i] = true;
                foreach (int j in new[] { (i + 1) % n, (i + n - 1) % n })
                {
                    if (Math.Abs(X[i] - X[j]) < 1e-9) fixedX[j] = true;
                    if (Math.Abs(Y[i] - Y[j]) < 1e-9) fixedY[j] = true;
                }
            }
            if (axisSeg == null) throw new Exception("axis line not created in " + sk);
            axisOut = axisSeg;
            var f = p.EndSketch(sk);
            return p.RevolveAbout(f, axisSeg, featureName, false);
        }
    }

    internal static class Checker
    {
        public static int CheckAll(ISldWorks sw, string dir, string only)
        {
            var tables = TableInfo.Load(dir, only);
            int problems = 0;
            var ps = System.Diagnostics.Process.GetProcessesByName("SLDWORKS");
            using (var watch = new DialogWatch(ps.Length > 0 ? ps[0].Id : 0))
            foreach (var t in tables)
            {
                int seen = watch.Seen.Count;
                string path = Path.Combine(dir, t.Name + ".SLDPRT");
                if (!File.Exists(path)) { Console.WriteLine("=== " + t.Name + ": no part file"); problems++; continue; }
                int e = 0, w = 0;
                var doc = (IModelDoc2)sw.OpenDoc6(path, (int)swDocumentTypes_e.swDocPART, (int)swOpenDocOptions_e.swOpenDocOptions_Silent, "", ref e, ref w);
                if (doc == null) { Console.WriteLine("=== " + t.Name + ": open failed " + e); problems++; continue; }
                try
                {
                    var names = ((object[])doc.GetConfigurationNames()).Cast<string>().ToList();
                    int ok = 0; var bad = new List<string>();
                    foreach (var kv in t.Rows)
                    {
                        if (!names.Contains(kv.Key)) { bad.Add(kv.Key + ": no configuration"); continue; }
                        doc.ShowConfiguration2(kv.Key);
                        doc.ForceRebuild3(false);
                        string err = Errors(doc);
                        var box = (double[])((IPartDoc)doc).GetPartBox(true);
                        double od = (box[3] - box[0]) / SwPart.MM, b = (box[5] - box[2]) / SwPart.MM;
                        double eod = t.Num(kv.Value, "OD@S", double.NaN), eb = t.Num(kv.Value, "B@S", double.NaN);
                        var notes = new List<string>();
                        if (err != "") notes.Add("errors " + err);
                        if (Math.Abs(od - eod) > 0.01) notes.Add("OD " + od.ToString("0.###") + " vs " + eod);
                        if (Math.Abs(b - eb) > 0.01) notes.Add("B " + b.ToString("0.###") + " vs " + eb);
                        if (notes.Count == 0) ok++; else bad.Add(kv.Key + ": " + string.Join(", ", notes));
                    }
                    Console.WriteLine("=== " + t.Name + ": " + ok + "/" + t.Rows.Count + " configurations rebuild and measure right" + (names.Count != t.Rows.Count + 1 ? " (" + names.Count + " configurations in the part)" : ""));
                    foreach (var b in bad.Take(12)) Console.WriteLine("    " + b);
                    if (bad.Count > 12) Console.WriteLine("    ... " + (bad.Count - 12) + " more");
                    lock (watch.Seen) for (int i = seen; i < watch.Seen.Count; i++) Console.WriteLine("    SOLIDWORKS said: " + watch.Seen[i]);
                    problems += bad.Count;
                }
                finally { sw.CloseDoc(doc.GetTitle()); }
            }
            Console.WriteLine(problems == 0 ? "all configurations good" : problems + " problem(s)");
            return problems == 0 ? 0 : 1;
        }

        private static string Errors(IModelDoc2 doc)
        {
            var bad = new List<string>();
            var f = (IFeature)doc.FirstFeature();
            while (f != null)
            {
                bool warn; int code = f.GetErrorCode2(out warn);
                if (code != 0 && !warn) bad.Add(f.Name + ":" + code);
                f = (IFeature)f.GetNextFeature();
            }
            return string.Join(" ", bad);
        }
    }
}
