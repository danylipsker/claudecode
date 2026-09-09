using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace GearGen.App
{
    /// <summary>
    /// SolidWorks' own internal major-version numbers map to release years
    /// one-to-one (SW2020=28 ... SW2026=34), confirmed against this machine's
    /// two actual installs (SLDWORKS.exe file version 33.x under "SOLIDWORKS"
    /// = 2025, 34.x under "SOLIDWORKS (2)" = 2026) rather than assumed from
    /// the public numbering alone. There is no SolidWorks API to "Save As" an
    /// older year's native .sldprt format from a newer running session (the
    /// swSaveAsVersion_e enum has no such options -- checked directly, not
    /// assumed) -- the only real way to produce a given year's file is to run
    /// that year's own SolidWorks and save from inside it. So: find every
    /// SLDWORKS.exe actually installed, match by this version number, and be
    /// explicit if the requested year isn't one of them.
    /// </summary>
    public static class SolidWorksVersionHelper
    {
        private static readonly Dictionary<int, int> YearToMajorVersion = new Dictionary<int, int>
        {
            { 2020, 28 }, { 2021, 29 }, { 2022, 30 }, { 2023, 31 },
            { 2024, 32 }, { 2025, 33 }, { 2026, 34 },
        };

        public class Install
        {
            public string ExePath;
            public int MajorVersion;
            public int? Year => YearToMajorVersion.FirstOrDefault(kv => kv.Value == MajorVersion).Key is int y && y != 0 ? y : (int?)null;
        }

        /// <summary>Scans the standard SolidWorks Corp install root for every
        /// SLDWORKS.exe and reads its real file version -- does not assume
        /// folder names encode the year (they don't, on this machine: plain
        /// "SOLIDWORKS" and "SOLIDWORKS (2)").</summary>
        public static List<Install> FindInstalls()
        {
            var results = new List<Install>();
            string root = @"C:\Program Files\SOLIDWORKS Corp";
            if (!Directory.Exists(root)) return results;

            foreach (var dir in Directory.GetDirectories(root))
            {
                string exe = Path.Combine(dir, "SLDWORKS.exe");
                if (!File.Exists(exe)) continue;
                try
                {
                    var vi = FileVersionInfo.GetVersionInfo(exe);
                    results.Add(new Install { ExePath = exe, MajorVersion = vi.FileMajorPart });
                }
                catch { /* skip unreadable */ }
            }
            return results;
        }

        /// <summary>Best match for a requested release year: exact install if
        /// present, else null (caller decides the fallback -- e.g. attach to
        /// whatever's already running -- and must say so to the user).</summary>
        public static Install FindForYear(int year)
        {
            if (!YearToMajorVersion.TryGetValue(year, out int major)) return null;
            return FindInstalls().FirstOrDefault(i => i.MajorVersion == major);
        }
    }
}
