// BearingsCli - builds the SOLIDWORKS bearing parts for the design tables in BEARINGS\design-tables.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace Bearings.Cli
{
    internal static class Program
    {
        [STAThread]
        private static int Main(string[] args)
        {
            try { Console.OutputEncoding = System.Text.Encoding.UTF8; } catch { /* redirected */ }
            try { return Run(args); }
            catch (Exception ex)
            {
                Console.Error.WriteLine("ERROR " + ex);
                return 1;
            }
        }

        private static void Usage()
        {
            Console.WriteLine("BearingsCli probe                                   API facts of the running SOLIDWORKS (nothing saved)");
            Console.WriteLine("BearingsCli build [-only <text>] [-dir <folder>] [-no-table] [-keep]   build the parts next to their tables");
            Console.WriteLine("BearingsCli check [-only <text>] [-dir <folder>]    open each part, rebuild every configuration, report");
            Console.WriteLine("BearingsCli dump <file.SLDPRT> [-config <name>]     feature tree / dimensions / equations / design table");
            Console.WriteLine("BearingsCli restore-sketch-settings                 switch the sketch snap/inference options back on");
        }

        private static Dictionary<string, string> Parse(string[] args, out string cmd, out List<string> rest)
        {
            var o = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            rest = new List<string>();
            cmd = args.Length > 0 ? args[0] : null;
            for (int i = 1; i < args.Length; i++)
            {
                string a = args[i];
                if (!a.StartsWith("-")) { rest.Add(a); continue; }
                string key = a.TrimStart('-');
                string val = i + 1 < args.Length && !args[i + 1].StartsWith("-") ? args[++i] : "";
                o[key] = val;
            }
            return o;
        }

        private static string Get(Dictionary<string, string> o, string k) { string v; return o.TryGetValue(k, out v) ? v : null; }

        public static string DefaultTablesDir()
        {
            // <repo>\BEARINGS\solidworks\BearingsCli\bin\Release\BearingsCli.exe -> <repo>\BEARINGS\design-tables
            string dir = AppDomain.CurrentDomain.BaseDirectory;
            for (int i = 0; i < 6 && dir != null; i++)
            {
                string cand = Path.Combine(dir, "design-tables");
                if (Directory.Exists(cand)) return cand;
                dir = Path.GetDirectoryName(dir.TrimEnd('\\'));
            }
            return Path.GetFullPath("design-tables");
        }

        private static int Run(string[] args)
        {
            string cmd; List<string> rest;
            var o = Parse(args, out cmd, out rest);
            if (cmd == null || cmd == "help" || cmd == "-h" || cmd == "--help") { Usage(); return 2; }

            ISldWorks sw = Connect();
            switch (cmd)
            {
                case "probe": return Probe.Run(sw, o);
                case "restore-sketch-settings": return Probe2.Run(sw);
                case "build": return Builder.BuildAll(sw, Get(o, "dir") ?? DefaultTablesDir(), Get(o, "only"), o.ContainsKey("no-table"), o.ContainsKey("keep"));
                case "check": return Checker.CheckAll(sw, Get(o, "dir") ?? DefaultTablesDir(), Get(o, "only"));
                case "dump":
                    if (rest.Count == 0) { Usage(); return 2; }
                    return Dump.Run(sw, Path.GetFullPath(rest[0]), Get(o, "config"));
                default: Usage(); return 2;
            }
        }

        private static ISldWorks Connect()
        {
            object obj = null;
            foreach (string progId in new[] { "SldWorks.Application.28", "SldWorks.Application" })
            {
                try { obj = Marshal.GetActiveObject(progId); } catch (COMException) { obj = null; }
                if (obj != null) { Console.WriteLine("SOLIDWORKS: running instance via " + progId); break; }
            }
            if (obj == null)
            {
                Console.WriteLine("SOLIDWORKS: not running, starting SOLIDWORKS 2020 (SldWorks.Application.28) ...");
                Type t = Type.GetTypeFromProgID("SldWorks.Application.28", true);
                obj = Activator.CreateInstance(t);
                var started = (ISldWorks)obj;
                started.Visible = true;
                started.UserControl = true;   // stays open after this process exits
            }
            var sw = (ISldWorks)obj;
            // no Modify box when a dimension is created through the API, no confirmation prompts
            sw.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swInputDimValOnCreate, false);
            Console.WriteLine("SOLIDWORKS revision " + sw.RevisionNumber() + ", open documents: " + sw.GetDocumentCount()
                + ", sketch inference/snap settings on: " + new[] { swUserPreferenceToggle_e.swSketchAutomaticRelations, swUserPreferenceToggle_e.swSketchInference, swUserPreferenceToggle_e.swSketchSnapsPoints, swUserPreferenceToggle_e.swSketchSnapsHVLines }.Count(t => sw.GetUserPreferenceToggle((int)t)) + "/4");
            return sw;
        }
    }

    /// <summary>Linear expression a*ID + b*OD + c*B + d*IDa + e*ODa + f*d1 + g*D1 + k over the skeleton dimensions (mm).</summary>
    internal sealed class Lin
    {
        public readonly Dictionary<string, double> K = new Dictionary<string, double>();
        public double C;
        public Lin(double c = 0) { C = c; }
        public static Lin Var(string name, double k = 1) { var l = new Lin(); l.K[name] = k; return l; }
        public static Lin operator +(Lin a, Lin b) { var l = new Lin(a.C + b.C); foreach (var kv in a.K) l.K[kv.Key] = kv.Value; foreach (var kv in b.K) l.K[kv.Key] = (l.K.ContainsKey(kv.Key) ? l.K[kv.Key] : 0) + kv.Value; return l; }
        public static Lin operator -(Lin a, Lin b) { return a + b * -1; }
        public static Lin operator *(Lin a, double s) { var l = new Lin(a.C * s); foreach (var kv in a.K) l.K[kv.Key] = kv.Value * s; return l; }
        public static Lin operator +(Lin a, double c) { var l = a * 1; l.C += c; return l; }
        public static Lin operator -(Lin a, double c) { return a + (-c); }
        public double Eval(IDictionary<string, double> v) { double s = C; foreach (var kv in K) s += kv.Value * v[kv.Key]; return s; }
        /// <summary>SOLIDWORKS equation text, e.g. 0.25*"IDa@S"+0.25*"ODa@S"</summary>
        public string Text()
        {
            var parts = new List<string>();
            foreach (var kv in K)
                if (Math.Abs(kv.Value) > 1e-12) parts.Add(F(kv.Value) + "*\"" + kv.Key + "@S\"");
            if (Math.Abs(C) > 1e-12 || parts.Count == 0) parts.Add(F(C));
            return string.Join("+", parts).Replace("+-", "-");
        }
        private static string F(double d) { return d.ToString("0.######", CultureInfo.InvariantCulture); }
    }
}
