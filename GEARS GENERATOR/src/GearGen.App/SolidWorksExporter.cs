using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using GearGen.Geometry;
using Microsoft.Win32;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;

namespace GearGen.App
{
    /// <summary>
    /// Drives SolidWorks via its COM automation interface to turn a freshly
    /// generated STEP file into a real, native .sldprt: attach to a running
    /// SolidWorks instance if there is one, otherwise launch one (optionally
    /// a specific installed year -- see SolidWorksVersionHelper and its
    /// remarks on why "Save As an older version" isn't actually an option
    /// SolidWorks' API offers); import the STEP (SolidWorks' own built-in
    /// translator); Save As .sldprt.
    ///
    /// Two things were discovered only by actually running this against a
    /// live SolidWorks instance, not assumed:
    ///  1) SolidWorks' automation objects are STA (single-threaded apartment) --
    ///     calling in from a thread-pool thread (plain Task.Run, MTA) fails.
    ///     All COM work here runs on a dedicated STA thread.
    ///  2) C#'s `dynamic` keyword, and even reflection-based Type.InvokeMember
    ///     late binding, misbehave against ISldWorks (the former fails outright
    ///     with TYPE_E_ELEMENTNOTFOUND; the latter got further but hit
    ///     DISP_E_TYPEMISMATCH on IModelDocExtension.SaveAs's ExportData
    ///     parameter no matter what stand-in value was passed for "nothing").
    ///     Early-bound calls through the real SolidWorks.Interop.sldworks
    ///     interfaces (this file) work correctly and are what's used here.
    ///     GetActiveObject/CreateInstance still come back as plain COM
    ///     objects, so those two calls are cast to ISldWorks explicitly.
    /// </summary>
    public static class SolidWorksExporter
    {
        public static async Task<string> ExportToSolidWorksAsync(GearParameters parameters, string stepPath)
        {
            var versionDlg = new SolidWorksVersionDialog();
            if (versionDlg.ShowDialog() != true)
                return "Cancelled.";

            var saveDlg = new SaveFileDialog
            {
                Filter = "SolidWorks Part (*.sldprt)|*.sldprt",
                FileName = parameters.SuggestedFileName(".sldprt"),
            };
            if (saveDlg.ShowDialog() != true)
                return "Cancelled.";

            return await ImportStepAndSaveAsSldprtAsync(stepPath, saveDlg.FileName, versionDlg.SelectedYear).ConfigureAwait(false);
        }

        /// <summary>The actual SolidWorks automation, with an explicit output
        /// path -- no dialogs, so this is what's covered by automated testing.
        /// Runs on a dedicated STA thread (see class remarks). targetYear:
        /// null = don't care which installed version (attach to whatever's
        /// running, else launch the default); a year = prefer that specific
        /// installed version if SolidWorksVersionHelper finds it, else fall
        /// back and say so in the result message.</summary>
        public static Task<string> ImportStepAndSaveAsSldprtAsync(string stepPath, string sldprtPath, int? targetYear = null)
        {
            var tcs = new TaskCompletionSource<string>();
            var thread = new Thread(() =>
            {
                try
                {
                    tcs.SetResult(DoImportAndSave(stepPath, sldprtPath, targetYear));
                }
                catch (Exception ex)
                {
                    tcs.SetException(ex);
                }
            });
            thread.SetApartmentState(ApartmentState.STA);
            thread.IsBackground = true;
            thread.Start();
            return tcs.Task;
        }

        private static string DoImportAndSave(string stepPath, string sldprtPath, int? targetYear)
        {
            ISldWorks swApp = null;
            bool weLaunchedIt = false;
            string versionNote = "";
            try
            {
                var targetInstall = targetYear.HasValue ? SolidWorksVersionHelper.FindForYear(targetYear.Value) : null;

                // A specific, installed year was requested: launch THAT exe
                // directly (bypassing the "SldWorks.Application" ProgID,
                // which only ever resolves to whichever version registered
                // itself most recently) so we actually get the requested one,
                // not just whichever happens to be default.
                if (targetInstall != null)
                {
                    Process.Start(targetInstall.ExePath);
                    swApp = WaitForActiveObject(TimeSpan.FromSeconds(90));
                    if (swApp == null)
                        throw new InvalidOperationException(
                            $"Launched SOLIDWORKS {targetYear} but it never became ready for automation.");
                    weLaunchedIt = true;
                    versionNote = $"SOLIDWORKS {targetYear} (as requested).";
                }
                else
                {
                    try
                    {
                        swApp = (ISldWorks)Marshal.GetActiveObject("SldWorks.Application");
                        versionNote = targetYear.HasValue
                            ? $"SOLIDWORKS {targetYear} isn't installed on this machine -- used your already-running SolidWorks instead."
                            : "your already-running SolidWorks session.";
                    }
                    catch (COMException)
                    {
                        var t = Type.GetTypeFromProgID("SldWorks.Application");
                        if (t == null)
                            throw new InvalidOperationException(
                                "SolidWorks is not installed (or not registered) on this machine.");
                        swApp = (ISldWorks)Activator.CreateInstance(t);
                        swApp.Visible = true;
                        weLaunchedIt = true;
                        versionNote = targetYear.HasValue
                            ? $"SOLIDWORKS {targetYear} isn't installed on this machine -- launched the default installed version instead."
                            : "a newly launched SolidWorks session (default installed version).";

                        for (int i = 0; i < 60; i++)
                        {
                            try { var _ = swApp.ActiveDoc; break; }
                            catch { Thread.Sleep(500); }
                        }
                    }
                }

                // Importing a STEP creates a new part from the default part
                // template, and on this machine every fresh-launched (and
                // every attached) SolidWorks answered LoadFile4 with a modal
                // "New SOLIDWORKS Document" dialog -- in ITS window, not ours
                // -- blocking the import until someone clicked it (four runs
                // in a row through the headless harness; interactively it
                // looks like the export hanging while a dialog waits in
                // another app). Two things are done about it, both restored
                // afterwards so the user's own options are untouched:
                //  1) "Always use default templates" is forced on, with a real
                //     part template if none is configured. Measured: this
                //     alone did NOT stop the prompt here (the toggle was
                //     already on and the template valid -- see the diagnostic
                //     in the result message), so:
                //  2) 3D Interconnect is turned off for the import. With it
                //     on, SolidWorks opens a STEP by creating a new part and
                //     inserting the STEP as a LINKED feature -- the new-part
                //     step is what pops the template dialog -- and the saved
                //     .sldprt then references our temporary STEP file instead
                //     of owning a native body. Off, the classic translator
                //     imports a plain body, which is what "export to
                //     SolidWorks" should mean anyway.
                bool alwaysDefault = swApp.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAlwaysUseDefaultTemplates);
                string partTemplate = swApp.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplatePart);
                bool interconnect = swApp.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect);
                // How a neutral file with several solids comes in: SolidWorks' default made
                // an ASSEMBLY of one part per solid out of every pair this app exports
                // (measured: components "SOLID-1", "SOLID-0-1" and a mate group, saved
                // under a .sldprt name). The app promises a multi-body part, so the
                // mapping is set to that for the import and put back afterwards.
                const int multibody = (int)swImportNeutralAssemblyStructureMapping_e.swImportNeutralAssemblyStructureMapping_MultibodyPart;
                int mapping = swApp.GetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping);
                string stockTemplate = null;
                if (string.IsNullOrWhiteSpace(partTemplate) || !File.Exists(partTemplate))
                    stockTemplate = FindStockPartTemplate(swApp);
                string templateNote = $" [defaults toggle was {(alwaysDefault ? "on" : "off")}, part template '{partTemplate}', 3D Interconnect was {(interconnect ? "on" : "off")}]";
                try
                {
                    if (!alwaysDefault)
                    {
                        swApp.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAlwaysUseDefaultTemplates, true);
                        templateNote += " Suppressed SolidWorks' document-template prompt for the import.";
                    }
                    if (stockTemplate != null)
                    {
                        swApp.SetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplatePart, stockTemplate);
                        templateNote += $" Used part template {stockTemplate} (none was configured).";
                    }
                    if (interconnect)
                    {
                        swApp.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect, false);
                        templateNote += " 3D Interconnect switched off for the import (native body, no link to the STEP).";
                    }
                    if (mapping != multibody)
                    {
                        swApp.SetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping, multibody);
                        templateNote += $" Multiple solids mapped to one multi-body part for the import (the setting was {mapping}).";
                    }

                    int loadErrors = 0;
                    ModelDoc2 model = swApp.LoadFile4(stepPath, "r", null, ref loadErrors) as ModelDoc2;
                    if (model == null)
                        throw new InvalidOperationException(
                            $"SolidWorks could not import the generated STEP file (error code {loadErrors}).");

                    int saveErrors = 0, saveWarnings = 0;
                    // What came in: one body per gear, named as the STEP names them
                    // (build_gear.labelled_solids) -- the evidence the review asked for
                    // What came in: the bodies under the feature tree's Solid Bodies folder
                    // (their names are what SolidWorks shows; IPartDoc itself refuses this
                    // document's wrapper with E_NOINTERFACE, and late binding lands on
                    // DISP_E_BADINDEX -- the feature interfaces answer).
                    string bodiesNote;
                    try
                    {
                        var names = new System.Collections.Generic.List<string>();
                        var all = new System.Collections.Generic.List<string>();
                        Feature f = model.FirstFeature() as Feature;
                        while (f != null)
                        {
                            string tn = f.GetTypeName2();
                            all.Add(f.Name + ":" + tn);
                            // a multi-body part lists one BaseBody feature per imported solid
                            // ("Imported1", "Imported2"); an assembly lists Reference components instead
                            if (tn == "BaseBody" || tn == "Reference")
                                names.Add(f.Name + (tn == "Reference" ? " (component)" : ""));
                            f = f.GetNextFeature() as Feature;
                        }
                        bodiesNote = $" bodies: {names.Count} [{string.Join(", ", names)}] features: [{string.Join(", ", all)}]";
                    }
                    catch (Exception bodiesEx)
                    {
                        bodiesNote = " bodies: could not list (" + bodiesEx.GetType().Name + ": " + bodiesEx.Message + ")";
                    }
                    bool saved = model.Extension.SaveAs(
                        sldprtPath, 0 /* current version -- see class remarks: no per-year native option exists */,
                        1 /* silent */, null, ref saveErrors, ref saveWarnings);

                    if (!saved)
                        throw new InvalidOperationException($"SolidWorks Save As failed (error code {saveErrors}).");

                    return $"Saved to {sldprtPath} -- used {versionNote}{templateNote}{bodiesNote}";
                }
                finally
                {
                    if (mapping != multibody)
                        swApp.SetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping, mapping);
                    if (!alwaysDefault)
                        swApp.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAlwaysUseDefaultTemplates, false);
                    if (stockTemplate != null)
                        swApp.SetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplatePart, partTemplate ?? "");
                    if (interconnect)
                        swApp.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect, true);
                }
            }
            finally
            {
                if (swApp != null)
                    Marshal.ReleaseComObject(swApp);
            }
        }

        /// <summary>Opens a native part in a VISIBLE SolidWorks -- the running
        /// one, else a newly launched one that is left running under the
        /// user's control -- and describes its solid bodies: count, names,
        /// face/edge/vertex counts, volume, surface area, centroid and
        /// bounding box (IPartDoc.GetBodies2, IBody2.GetMassProperties and
        /// GetBodyBox, SI units converted to mm). The check to make after an
        /// export: is each gear ONE body, and is it the body the generator
        /// built. Late binding cannot do this on this machine (SolidWorks'
        /// dispatch interface answers TYPE_E_ELEMENTNOTFOUND to everything,
        /// even `Visible`, from either PowerShell), so it lives here, early-
        /// bound through the interop like the import. STA thread, as the
        /// import.</summary>
        public static Task<string> OpenPartAndDescribeBodiesAsync(string sldprtPath)
        {
            var tcs = new TaskCompletionSource<string>();
            var thread = new Thread(() =>
            {
                try
                {
                    tcs.SetResult(DoOpenAndDescribe(sldprtPath));
                }
                catch (Exception ex)
                {
                    tcs.SetException(ex);
                }
            });
            thread.SetApartmentState(ApartmentState.STA);
            thread.IsBackground = true;
            thread.Start();
            return tcs.Task;
        }

        private static string DoOpenAndDescribe(string sldprtPath)
        {
            ISldWorks swApp = null;
            try
            {
                string note;
                try
                {
                    swApp = (ISldWorks)Marshal.GetActiveObject("SldWorks.Application");
                    note = "the running SolidWorks";
                }
                catch (COMException)
                {
                    var t = Type.GetTypeFromProgID("SldWorks.Application");
                    if (t == null)
                        throw new InvalidOperationException("SolidWorks is not installed (or not registered) on this machine.");
                    swApp = (ISldWorks)Activator.CreateInstance(t);
                    note = "a newly launched SolidWorks";
                }
                swApp.Visible = true;
                swApp.UserControl = true;   // ours to open, the user's to keep: it does not quit when we let go
                int errors = 0, warnings = 0;
                ModelDoc2 model = swApp.OpenDoc6(sldprtPath, (int)swDocumentTypes_e.swDocPART,
                    (int)swOpenDocOptions_e.swOpenDocOptions_Silent, "", ref errors, ref warnings) as ModelDoc2;
                if (model == null)
                    throw new InvalidOperationException($"SolidWorks could not open {sldprtPath} (error code {errors}).");
                model.ViewZoomtofit2();

                var sb = new System.Text.StringBuilder();
                sb.Append($"Opened {Path.GetFileName(sldprtPath)} in {note} (SolidWorks {swApp.RevisionNumber()}, process {swApp.GetProcessID()}).");
                PartDoc part = model as PartDoc;
                if (part == null)
                {
                    sb.Append(" The document is not a part (IPartDoc refused) -- an assembly?");
                    return sb.ToString();
                }
                object[] bodies = part.GetBodies2((int)swBodyType_e.swSolidBody, true) as object[];
                int n = bodies?.Length ?? 0;
                sb.Append($" Solid bodies: {n}.");
                double total = 0.0;
                for (int i = 0; i < n; i++)
                {
                    Body2 b = bodies[i] as Body2;
                    double[] mp = b.GetMassProperties(0.0) as double[];   // cx, cy, cz, volume, area, mass, ...
                    double[] box = b.GetBodyBox() as double[];           // xmin, ymin, zmin, xmax, ymax, zmax
                    double vol = mp[3] * 1e9, area = mp[4] * 1e6;
                    total += vol;
                    sb.Append($"\n  body {i + 1}: '{b.Name}'  faces {b.GetFaceCount()}  edges {b.GetEdgeCount()}  vertices {b.GetVertexCount()}");
                    sb.Append($"\n    volume {vol:F1} mm^3  area {area:F1} mm^2  centroid ({mp[0] * 1e3:F2}, {mp[1] * 1e3:F2}, {mp[2] * 1e3:F2}) mm");
                    sb.Append($"\n    box x [{box[0] * 1e3:F2}, {box[3] * 1e3:F2}]  y [{box[1] * 1e3:F2}, {box[4] * 1e3:F2}]  z [{box[2] * 1e3:F2}, {box[5] * 1e3:F2}] mm");
                }
                sb.Append($"\n  all bodies together: {total:F1} mm^3. SolidWorks stays open on the part.");
                return sb.ToString();
            }
            finally
            {
                if (swApp != null)
                    Marshal.ReleaseComObject(swApp);
            }
        }

        /// <summary>The first *.prtdot in SolidWorks' own configured template
        /// folders (Tools > Options > File Locations > Document Templates),
        /// falling back to the stock ProgramData location; null if none.</summary>
        private static string FindStockPartTemplate(ISldWorks swApp)
        {
            var folders = new System.Collections.Generic.List<string>();
            string configured = swApp.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swFileLocationsDocumentTemplates);
            if (!string.IsNullOrWhiteSpace(configured))
                folders.AddRange(configured.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries));
            // System.Environment spelled out: the sldworks interop has its own Environment type.
            string programData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.CommonApplicationData);
            if (Directory.Exists(Path.Combine(programData, "SolidWorks")))
                folders.AddRange(Directory.GetDirectories(Path.Combine(programData, "SolidWorks"), "SOLIDWORKS *")
                    .Select(d => Path.Combine(d, "templates")));
            foreach (var folder in folders)
            {
                try
                {
                    if (!Directory.Exists(folder)) continue;
                    var hit = Directory.GetFiles(folder, "*.prtdot").FirstOrDefault();
                    if (hit != null) return hit;
                }
                catch (Exception) { /* unreadable folder: try the next one */ }
            }
            return null;
        }

        private static ISldWorks WaitForActiveObject(TimeSpan timeout)
        {
            var deadline = DateTime.UtcNow + timeout;
            while (DateTime.UtcNow < deadline)
            {
                try
                {
                    var obj = (ISldWorks)Marshal.GetActiveObject("SldWorks.Application");
                    var _ = obj.ActiveDoc; // confirm it actually answers, not just registered
                    return obj;
                }
                catch { Thread.Sleep(1000); }
            }
            return null;
        }
    }
}
