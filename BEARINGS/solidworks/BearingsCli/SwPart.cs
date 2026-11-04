// SwPart: thin helpers over the SOLIDWORKS API for one new part (sketches on the Top plane, revolves
// about the Z axis, dimensions named and driven by equations), plus a watchdog that dismisses any
// message box SOLIDWORKS opens while the CLI drives it (and logs what it said).
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace Bearings.Cli
{
    internal sealed class SwPart
    {
        public const double MM = 0.001;
        public readonly ISldWorks Sw;
        public readonly IModelDoc2 Doc;
        public readonly IModelDocExtension Ext;
        public readonly ISketchManager Sm;
        public readonly IFeatureManager Fm;
        public readonly ISelectionMgr Sel;
        public readonly IEquationMgr Eq;
        public readonly IFeature Front, Top, Right;
        public readonly List<string> Log = new List<string>();

        public SwPart(ISldWorks sw)
        {
            Sw = sw;
            string tpl = sw.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplatePart);
            Doc = (IModelDoc2)sw.NewDocument(tpl, 0, 0, 0);
            if (Doc == null) throw new Exception("NewDocument failed (template " + tpl + ")");
            Ext = Doc.Extension; Sm = Doc.SketchManager; Fm = Doc.FeatureManager;
            Sel = (ISelectionMgr)Doc.SelectionManager; Eq = Doc.GetEquationMgr();
            Ext.SetUserPreferenceInteger((int)swUserPreferenceIntegerValue_e.swUnitSystem, 0, (int)swUnitSystem_e.swUnitSystem_MMGS);
            var planes = new List<IFeature>();
            var f = (IFeature)Doc.FirstFeature();
            while (f != null) { if (f.GetTypeName2() == "RefPlane") planes.Add(f); f = (IFeature)f.GetNextFeature(); }
            if (planes.Count < 3) throw new Exception("part template has no three reference planes");
            Front = planes[0]; Top = planes[1]; Right = planes[2];
        }

        // ---------------- sketches ----------------

        public ISketch BeginSketch(IFeature plane)
        {
            if (Sm.ActiveSketch != null) throw new Exception("BeginSketch while sketch " + ((IFeature)Sm.ActiveSketch).Name + " is still active");
            Doc.ClearSelection2(true);
            if (!plane.Select2(false, 0)) throw new Exception("plane not selected: " + plane.Name);
            Sm.InsertSketch(true);
            var sk = Sm.ActiveSketch;
            if (sk == null) throw new Exception("InsertSketch did not open a sketch on " + plane.Name);
            // straight into the database: no inferencing against other sketches (which made CreateLine
            // return null when a point lined up with skeleton geometry); end points still merge
            Sm.AddToDB = true;
            Log.Add("sketch opened on " + plane.Name + ": " + ((IFeature)sk).Name);
            return sk;
        }

        public IFeature EndSketch(string name)
        {
            ISketch sk = Sm.ActiveSketch;
            if (sk == null) throw new Exception("EndSketch(" + name + "): no active sketch");
            Sm.AddToDB = false;
            Sm.InsertSketch(true);
            if (Sm.ActiveSketch != null) throw new Exception("EndSketch(" + name + "): sketch still active after InsertSketch");
            var f = (IFeature)sk;
            Rename(f, name);
            Log.Add("sketch closed: " + name + " status " + Enum.GetName(typeof(swConstrainedStatus_e), sk.GetConstrainedStatus()) + ", relations " + sk.RelationManager.GetRelationsCount(0));
            Doc.ClearSelection2(true);
            foreach (string e in _pendingEquations) AddEquation(e);
            _pendingEquations.Clear();
            return f;
        }

        public ISketchSegment Circle(double dMm, bool construction)
        {
            var c = Sm.CreateCircleByRadius(0, 0, 0, dMm / 2 * MM);
            if (c == null) throw new Exception("circle not created");
            if (construction) c.ConstructionGeometry = true;
            Relation("sgCOINCIDENT", "origin", (ISketchPoint)((ISketchArc)c).GetCenterPoint2());
            return c;
        }

        public ISketchSegment Line(double x1, double y1, double x2, double y2) { return Sm.CreateLine(x1 * MM, y1 * MM, 0, x2 * MM, y2 * MM, 0); }
        public ISketchSegment CenterLine(double x1, double y1, double x2, double y2) { return Sm.CreateCenterLine(x1 * MM, y1 * MM, 0, x2 * MM, y2 * MM, 0); }

        public void SelectOrigin(bool append)
        {
            if (!Ext.SelectByID2("Point1@Origin", "EXTSKETCHPOINT", 0, 0, 0, append, 0, null, 0))
                throw new Exception("origin could not be selected");
        }

        private void SelectEntity(object e, bool append, int mark = 0)
        {
            SelectData sd = null;
            if (mark != 0) { sd = Sel.CreateSelectData(); sd.Mark = mark; }
            if (e is string && (string)e == "origin") { SelectOrigin(append); return; }
            var seg = e as ISketchSegment; if (seg != null) { if (!seg.Select4(append, sd)) throw new Exception("segment not selected"); return; }
            var pt = e as ISketchPoint; if (pt != null) { if (!pt.Select4(append, sd)) throw new Exception("point not selected"); return; }
            var feat = e as IFeature; if (feat != null) { if (!feat.Select2(append, mark)) throw new Exception("feature not selected: " + feat.Name); return; }
            var ent = e as IEntity; if (ent != null) { if (!ent.Select4(append, sd)) throw new Exception("entity not selected"); return; }
            throw new Exception("cannot select " + e);
        }

        /// <summary>Adds a sketch relation (SketchAddConstraints names: sgHORIZONTAL2D, sgVERTICAL2D, sgCOINCIDENT,
        /// sgATMIDDLE, sgHORIZONTALPOINTS2D ...). An unknown name is ignored silently by SOLIDWORKS, so the
        /// relation count is checked.</summary>
        public void Relation(string type, params object[] ents)
        {
            Doc.ClearSelection2(true);
            bool app = false;
            foreach (var e in ents) { SelectEntity(e, app); app = true; }
            int before = Sm.ActiveSketch.RelationManager.GetRelationsCount(0);
            Doc.SketchAddConstraints(type);
            int after = Sm.ActiveSketch.RelationManager.GetRelationsCount(0);
            Doc.ClearSelection2(true);
            if (after <= before)
            {
                // AddToDB merges points at the same place: the second circle centred on the origin shares the
                // first one's centre point, whose coincident relation already exists.
                if (type == "sgCOINCIDENT" || type == "sgMERGEPOINTS") { Log.Add("relation " + type + " already present (merged point)"); return; }
                throw new Exception("relation " + type + " was not added (" + ents.Length + " entities selected)");
            }
        }

        /// <summary>Merges the end points of the sketch's lines and arcs that sit at the same place: with AddToDB
        /// consecutive segments are not joined by themselves, which leaves a profile under-defined (every line
        /// end free to slide) even though it still revolves. Call it before dimensioning.</summary>
        public void JoinEnds()
        {
            var segs = (object[])Sm.ActiveSketch.GetSketchSegments();
            if (segs == null) return;
            var pts = new List<KeyValuePair<ISketchPoint, int>>();
            for (int i = 0; i < segs.Length; i++)
            {
                var s = (ISketchSegment)segs[i];
                if (s.ConstructionGeometry) continue;
                var ln = s as ISketchLine; var arc = s as ISketchArc;
                ISketchPoint a = null, b = null;
                if (ln != null) { a = (ISketchPoint)ln.GetStartPoint2(); b = (ISketchPoint)ln.GetEndPoint2(); }
                else if (arc != null && arc.IsCircle() == 0) { a = (ISketchPoint)arc.GetStartPoint2(); b = (ISketchPoint)arc.GetEndPoint2(); }
                if (a != null) pts.Add(new KeyValuePair<ISketchPoint, int>(a, i));
                if (b != null) pts.Add(new KeyValuePair<ISketchPoint, int>(b, i));
            }
            int joined = 0;
            for (int i = 0; i < pts.Count; i++)
                for (int j = i + 1; j < pts.Count; j++)
                {
                    if (pts[i].Value == pts[j].Value) continue;
                    var a = pts[i].Key; var b = pts[j].Key;
                    if (Math.Abs(a.X - b.X) > 1e-7 || Math.Abs(a.Y - b.Y) > 1e-7) continue;
                    int before = Log.Count;
                    Relation("sgMERGEPOINTS", a, b);
                    if (Log.Count == before) joined++;
                }
            Log.Add("JoinEnds: " + joined + " point pairs merged");
        }

        public enum DimKind { Any, Horizontal, Vertical, Diameter, Radius }

        /// <summary>Dimension the selected entities; the text goes at (tx, ty) mm. Returns the named IDimension.</summary>
        public IDimension Dim(string name, DimKind kind, double tx, double ty, params object[] ents)
        {
            Doc.ClearSelection2(true);
            bool app = false;
            foreach (var e in ents) { SelectEntity(e, app); app = true; }
            object o;
            switch (kind)
            {
                case DimKind.Horizontal: o = Doc.AddHorizontalDimension2(tx * MM, ty * MM, 0); break;
                case DimKind.Vertical: o = Doc.AddVerticalDimension2(tx * MM, ty * MM, 0); break;
                case DimKind.Diameter: o = Doc.AddDiameterDimension2(tx * MM, ty * MM, 0); break;
                case DimKind.Radius: o = Doc.AddRadialDimension2(tx * MM, ty * MM, 0); break;
                default: o = Doc.AddDimension2(tx * MM, ty * MM, 0); break;
            }
            var dd = o as IDisplayDimension;
            if (dd == null) throw new Exception("dimension " + name + " was not created");
            var d = (IDimension)dd.GetDimension2(0);
            d.Name = name;
            Doc.ClearSelection2(true);
            return d;
        }

        /// <summary>Equation "<dim>@<sketchOrFeature>" = rhs (rhs in mm / unitless, written in terms of "X@S").</summary>
        private readonly List<string> _pendingEquations = new List<string>();

        /// <summary>Equations cannot be added while a sketch is being edited: queued until EndSketch.</summary>
        public void Equation(string dimAtFeature, string rhs)
        {
            string text = "\"" + dimAtFeature + "\" = " + rhs;
            if (Sm.ActiveSketch != null) { _pendingEquations.Add(text); return; }
            AddEquation(text);
        }

        private void AddEquation(string text)
        {
            int i = Eq.Add2(-1, text, false);
            if (i < 0) throw new Exception("equation rejected: " + text);
        }

        /// <summary>Tries equation forms in order (after any open sketch is closed); logs the one accepted.</summary>
        public void EquationTry(string dimAtFeature, params string[] rhsForms)
        {
            if (Sm.ActiveSketch != null) throw new Exception("EquationTry while a sketch is open");
            foreach (string rhs in rhsForms)
            {
                string text = "\"" + dimAtFeature + "\" = " + rhs;
                int i = Eq.Add2(-1, text, true);
                if (i >= 0) { Log.Add("equation accepted: " + text); return; }
                Log.Add("equation rejected: " + text);
            }
            throw new Exception("no equation form accepted for " + dimAtFeature);
        }

        // ---------------- features ----------------

        public IFeature RevolveAbout(IFeature sketch, ISketchSegment axis, string name, bool merge)
        {
            Doc.ClearSelection2(true);
            sketch.Select2(false, 0);
            SelectEntity(axis, true, 16);
            var f = (IFeature)Fm.FeatureRevolve2(true, true, false, false, false, false, 0, 0, 2 * Math.PI, 0,
                false, false, 0, 0, 0, 0, 0, merge, false, false);
            if (f == null) throw new Exception("revolve failed for sketch " + sketch.Name);
            Doc.ClearSelection2(true);
            Rename(f, name);
            Doc.ClearSelection2(true);
            return f;
        }

        public IFeature AxisZ(string name)
        {
            Doc.ClearSelection2(true);
            Top.Select2(false, 0); Right.Select2(true, 0);
            if (!Doc.InsertAxis2(true)) throw new Exception("axis from Top and Right planes failed");
            var f = (IFeature)Doc.FeatureByPositionReverse(0);
            if (f.GetTypeName2() != "RefAxis") throw new Exception("axis feature not found after InsertAxis2 (last feature " + f.Name + ")");
            Rename(f, name);
            Doc.ClearSelection2(true);
            return f;
        }

        /// <summary>Circular pattern of the bodies made by the given features (a feature pattern of a revolve
        /// returns null on SOLIDWORKS 2020; a body pattern works) about the axis; the instance-count dimension
        /// is renamed to "N".</summary>
        public IFeature CircularPattern(object axis, IFeature[] feats, int count, string name)
        {
            Doc.ClearSelection2(true);
            SelectEntity(axis, false, 1);
            var sd = Sel.CreateSelectData(); sd.Mark = 256;
            foreach (var f in feats)
            {
                var faces = (object[])f.GetFaces();
                if (faces == null || faces.Length == 0) throw new Exception("feature " + f.Name + " has no faces to pattern");
                var body = (IBody2)((IFace2)faces[0]).GetBody();
                if (!body.Select2(true, sd)) throw new Exception("body of " + f.Name + " not selected");
            }
            var p = (IFeature)Fm.FeatureCircularPattern4(count, 2 * Math.PI, false, "NULL", false, true, false);
            if (p == null) throw new Exception("circular pattern failed (" + name + ")");
            Doc.ClearSelection2(true);
            // the object returned by FeatureCircularPattern4 would not take a new name; the same feature
            // fetched from the tree does
            var last = (IFeature)Doc.FeatureByPositionReverse(0);
            if (last.GetTypeName2() == p.GetTypeName2() && last.Name == p.Name) p = last;
            bool renamed = false;
            foreach (string cand in new[] { name, name + "Pattern", name + "1", "Pattern" + name })
            {
                try { Rename(p, cand); renamed = true; break; } catch { }
            }
            if (!renamed) Log.Add("pattern keeps its SOLIDWORKS name " + p.Name);
            var nd = FindDim(p, d => Math.Abs(d.SystemValue - count) < 1e-9);
            if (nd == null) throw new Exception("pattern count dimension not found on " + name);
            nd.Name = "N";
            Log.Add(p.Name + " dims: " + DimList(p));
            return p;
        }

        /// <summary>Renames a feature and checks that the name took (a pattern feature kept its old name once).</summary>
        public void Rename(IFeature f, string name)
        {
            f.Name = name;
            if (f.Name == name) return;
            Doc.ForceRebuild3(false);
            f.Name = name;
            if (f.Name == name) { Log.Add("renamed " + name + " after a rebuild"); return; }
            Doc.ClearSelection2(true);
            f.Select2(false, 0);
            f.Name = name;
            Doc.ClearSelection2(true);
            if (f.Name != name) throw new Exception("feature could not be renamed to " + name + " (still " + f.Name + ")");
            Log.Add("renamed " + name + " after selecting it");
        }

        /// <summary>Constant-radius fillet on all circular edges whose radius matches one of the given diameters / 2.</summary>
        public IFeature FilletEdgesAtDiameters(double[] diametersMm, double rMm, string name, string dimName)
        {
            // One fillet feature per body: a fillet only takes the edges of one body, the edges of the
            // other bodies are dropped with the warning swFeatureErrorFilletNoEdge. The first fillet is
            // <name> with the table-driven radius <dimName>; the others (F2, F3 ...) follow it by equation.
            // Bodies and edges are fetched again for every fillet: objects from before a feature went in
            // are stale (SOLIDWORKS disconnected when the second group was reused).
            var part = (IPartDoc)Doc;
            string prefix = name.TrimEnd("0123456789".ToCharArray());
            int number = int.Parse(name.Substring(prefix.Length));
            IFeature first = null;
            var done = new HashSet<string>();
            for (int g = 0; g < 20; g++)
            {
                string fname = prefix + (number + g);
                var bodies = (object[])part.GetBodies2((int)swBodyType_e.swSolidBody, true);
                List<IEdge> picked = null; string bodyName = null;
                if (bodies != null)
                    foreach (IBody2 b in bodies)
                    {
                        if (b.Name.Contains("[") || done.Contains(b.Name)) continue;   // pattern instances, bodies already filleted
                        var edges = (object[])b.GetEdges();
                        if (edges == null) continue;
                        var list = new List<IEdge>();
                        foreach (IEdge e in edges)
                        {
                            var c = (ICurve)e.GetCurve();
                            if (c == null || !c.IsCircle()) continue;
                            var cp = (double[])c.CircleParams;
                            double rad = cp[6] / MM;
                            if (diametersMm.Any(d => Math.Abs(d / 2 - rad) < 1e-4)) list.Add(e);
                        }
                        if (list.Count > 0) { picked = list; bodyName = b.Name; break; }
                    }
                if (picked == null)
                {
                    if (g == 0) throw new Exception("no edges found for fillet " + name);
                    break;
                }
                Log.Add(fname + " edges of body " + bodyName + ": " + string.Join("; ", picked.Select(e => { var cp = (double[])((ICurve)e.GetCurve()).CircleParams; return "r" + (cp[6] / MM).ToString("0.##") + "@z" + (cp[2] / MM).ToString("0.##"); })));
                Doc.ClearSelection2(true);
                bool app = false;
                var sd = Sel.CreateSelectData(); sd.Mark = 1;
                foreach (var e in picked) { ((IEntity)e).Select4(app, sd); app = true; }
                var f = (IFeature)Fm.FeatureFillet3(3, rMm * MM, 0, 0, 0, 0, 0, null, null, null, null, null, null, null);   // uniform radius + propagate
                if (f == null) throw new Exception("fillet " + fname + " failed (" + picked.Count + " edges)");
                Doc.ClearSelection2(true);
                Rename(f, fname);
                var rd = FindDim(f, d => Math.Abs(d.SystemValue - rMm * MM) < 1e-9);
                if (rd == null) throw new Exception("fillet radius dimension not found");
                rd.Name = dimName;
                if (g == 0) first = f;
                else Equation(dimName + "@" + fname, "\"" + dimName + "@" + name + "\"");
                done.Add(fname);   // the filleted body takes the fillet's name
                Log.Add(fname + ": " + picked.Count + " edges");
            }
            Doc.ClearSelection2(true);
            return first;
        }

        public static string DimList(IFeature f)
        {
            var items = new List<string>();
            var d = (IDisplayDimension)f.GetFirstDisplayDimension();
            while (d != null)
            {
                var dim = (IDimension)d.GetDimension2(0);
                items.Add(dim.FullName + "=" + dim.SystemValue.ToString("0.######") + " driven=" + dim.DrivenState + " type=" + d.Type2);
                d = (IDisplayDimension)f.GetNextDisplayDimension(d);
            }
            return string.Join("; ", items);
        }

        public static IDimension FindDim(IFeature f, Func<IDimension, bool> pred)
        {
            var d = (IDisplayDimension)f.GetFirstDisplayDimension();
            while (d != null)
            {
                var dim = (IDimension)d.GetDimension2(0);
                if (pred(dim)) return dim;
                d = (IDisplayDimension)f.GetNextDisplayDimension(d);
            }
            return null;
        }

        public string FeatureErrors()
        {
            var bad = new List<string>();
            var f = (IFeature)Doc.FirstFeature();
            while (f != null)
            {
                bool warn;
                int code = f.GetErrorCode2(out warn);
                if (code != 0 && warn) Log.Add("warning on " + f.Name + ": " + (Enum.GetName(typeof(swFeatureError_e), code) ?? code.ToString()));
                else if (code != 0) bad.Add(f.Name + ":" + (Enum.GetName(typeof(swFeatureError_e), code) ?? code.ToString()));
                f = (IFeature)f.GetNextFeature();
            }
            return bad.Count == 0 ? "" : string.Join(", ", bad);
        }

        public double[] BoxMm()
        {
            var box = (double[])((IPartDoc)Doc).GetPartBox(true);
            return box == null ? null : box.Select(v => v / MM).ToArray();
        }

        public int BodyCount()
        {
            var bodies = (object[])((IPartDoc)Doc).GetBodies2((int)swBodyType_e.swSolidBody, true);
            return bodies == null ? 0 : bodies.Length;
        }

        public void Save(string path)
        {
            int e = 0, w = 0;
            bool ok = Ext.SaveAs3(path, (int)swSaveAsVersion_e.swSaveAsCurrentVersion, (int)swSaveAsOptions_e.swSaveAsOptions_Silent, null, null, ref e, ref w);
            if (!ok) throw new Exception("save failed, error " + e + " warning " + w + ": " + path);
        }

        public void Close() { Sw.CloseDoc(Doc.GetTitle()); }
    }

    /// <summary>Clicks the default button of any message box SOLIDWORKS opens, and records its text.</summary>
    internal sealed class DialogWatch : IDisposable
    {
        private readonly int _pid;
        private readonly Thread _t;
        private volatile bool _stop;
        public readonly List<string> Seen = new List<string>();

        public DialogWatch(int pid)
        {
            _pid = pid;
            _t = new Thread(Loop) { IsBackground = true };
            _t.Start();
        }

        private void Loop()
        {
            while (!_stop)
            {
                try { Scan(); } catch { /* ignore */ }
                Thread.Sleep(400);
            }
        }

        private void Scan()
        {
            EnumWindows((h, l) =>
            {
                uint pid; GetWindowThreadProcessId(h, out pid);
                if (pid != _pid || !IsWindowVisible(h)) return true;
                var cls = new StringBuilder(64); GetClassName(h, cls, 64);
                if (cls.ToString() != "#32770") return true;
                var title = new StringBuilder(256); GetWindowText(h, title, 256);
                var texts = new List<string>();
                IntPtr firstButton = IntPtr.Zero;
                EnumChildWindows(h, (c, l2) =>
                {
                    var ccls = new StringBuilder(64); GetClassName(c, ccls, 64);
                    var ct = new StringBuilder(1024); GetWindowText(c, ct, 1024);
                    if (ccls.ToString() == "Static" && ct.Length > 0) texts.Add(ct.ToString());
                    if (ccls.ToString() == "Button" && firstButton == IntPtr.Zero) firstButton = c;
                    return true;
                }, IntPtr.Zero);
                string msg = title + " | " + string.Join(" / ", texts);
                lock (Seen) Seen.Add(msg);
                // default button first (Enter), then the first button as a fallback
                SendMessage(h, WM_KEYDOWN, (IntPtr)VK_RETURN, IntPtr.Zero);
                if (firstButton != IntPtr.Zero) SendMessage(firstButton, BM_CLICK, IntPtr.Zero, IntPtr.Zero);
                return true;
            }, IntPtr.Zero);
        }

        public void Dispose() { _stop = true; }

        private const uint WM_KEYDOWN = 0x0100, BM_CLICK = 0x00F5; private const int VK_RETURN = 0x0D;
        private delegate bool EnumProc(IntPtr h, IntPtr l);
        [DllImport("user32.dll")] private static extern bool EnumWindows(EnumProc p, IntPtr l);
        [DllImport("user32.dll")] private static extern bool EnumChildWindows(IntPtr h, EnumProc p, IntPtr l);
        [DllImport("user32.dll")] private static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
        [DllImport("user32.dll")] private static extern bool IsWindowVisible(IntPtr h);
        [DllImport("user32.dll", CharSet = CharSet.Unicode)] private static extern int GetClassName(IntPtr h, StringBuilder s, int n);
        [DllImport("user32.dll", CharSet = CharSet.Unicode)] private static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
        [DllImport("user32.dll")] private static extern IntPtr SendMessage(IntPtr h, uint msg, IntPtr w, IntPtr l);
    }
}
