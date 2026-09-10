using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using GearGen.Geometry;
using Microsoft.Win32;
using SolidWorks.Interop.sldworks;

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

                int loadErrors = 0;
                ModelDoc2 model = swApp.LoadFile4(stepPath, "r", null, ref loadErrors) as ModelDoc2;
                if (model == null)
                    throw new InvalidOperationException(
                        $"SolidWorks could not import the generated STEP file (error code {loadErrors}).");

                int saveErrors = 0, saveWarnings = 0;
                bool saved = model.Extension.SaveAs(
                    sldprtPath, 0 /* current version -- see class remarks: no per-year native option exists */,
                    1 /* silent */, null, ref saveErrors, ref saveWarnings);

                if (!saved)
                    throw new InvalidOperationException($"SolidWorks Save As failed (error code {saveErrors}).");

                return $"Saved to {sldprtPath} -- used {versionNote}";
            }
            finally
            {
                if (swApp != null)
                    Marshal.ReleaseComObject(swApp);
            }
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
