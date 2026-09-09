using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using GearGen.Geometry;
using GearGen.PyEngine;
using Microsoft.Win32;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swpublished;

namespace GearGen.SolidWorksAddin
{
    /// <summary>
    /// The SolidWorks add-in entry point: implements ISwAddin (ConnectToSW /
    /// DisconnectFromSW, the two methods SolidWorks calls), registers itself
    /// under HKCU so it shows up in Tools > Add-Ins, and docks GearPanel (the
    /// exact same UI the standalone app uses -- see GearPanelHost) in a Task
    /// Pane. "Create Part in SolidWorks" here builds directly into THIS live
    /// SolidWorks session (no launch/attach needed, unlike the standalone
    /// app's SolidWorksExporter) since we're already running inside it.
    /// </summary>
    [ComVisible(true)]
    [Guid("A3D4E5F6-1B2C-4D3E-9F8A-7C6B5A4D3E2F")]
    [ClassInterface(ClassInterfaceType.None)]
    [ProgId("GearGen.SolidWorksAddin.SwAddin")]
    public class SwAddin : ISwAddin
    {
        private ISldWorks _swApp;
        private int _cookie;
        private PyGearEngine _engine;
        private ITaskpaneView _taskpaneView;
        private GearPanelHost _panelHost;

        public bool ConnectToSW(object ThisSW, int cookie)
        {
            _swApp = (ISldWorks)ThisSW;
            _cookie = cookie;

            _engine = new PyGearEngine();
            try { _engine.Start(); }
            catch (Exception ex)
            {
                System.Windows.Forms.MessageBox.Show(
                    "GEARS GENERATOR could not start its Python geometry engine:\n" + ex.Message +
                    "\n\nMake sure Python 3 with shapely/build123d/ezdxf is installed and on PATH.",
                    "GEARS GENERATOR", System.Windows.Forms.MessageBoxButtons.OK,
                    System.Windows.Forms.MessageBoxIcon.Warning);
            }

            string iconPath = Path.Combine(Path.GetDirectoryName(GetType().Assembly.Location) ?? ".", "icon.bmp");
            _taskpaneView = _swApp.CreateTaskpaneView2(iconPath, "Gears Generator");
            if (_taskpaneView != null)
            {
                object controlObj = _taskpaneView.AddControl(
                    "GearGen.SolidWorksAddin.GearPanelHost", "");
                _panelHost = controlObj as GearPanelHost;
                _panelHost?.Attach(_engine, InsertGearAsync);
            }

            return true;
        }

        public bool DisconnectFromSW()
        {
            try { _taskpaneView?.DeleteView(); } catch { /* best effort */ }
            _engine?.Dispose();
            _engine = null;
            _swApp = null;
            return true;
        }

        /// <summary>Builds the gear directly into this live SolidWorks
        /// session: import the STEP SolidWorks' own translator produced, then
        /// Save As wherever the user picks. No launch/attach dance needed --
        /// we ARE the SolidWorks session.</summary>
        private Task<string> InsertGearAsync(GearParameters parameters, string stepPath)
        {
            var dlg = new SaveFileDialog
            {
                Filter = "SolidWorks Part (*.sldprt)|*.sldprt",
                FileName = $"gear_z{parameters.Teeth}.sldprt",
            };
            if (dlg.ShowDialog() != true)
                return Task.FromResult("Cancelled.");

            int loadErrors = 0;
            ModelDoc2 model = _swApp.LoadFile4(stepPath, "r", null, ref loadErrors) as ModelDoc2;
            if (model == null)
                throw new InvalidOperationException($"SolidWorks could not import the STEP file (error code {loadErrors}).");

            int saveErrors = 0, saveWarnings = 0;
            bool saved = model.Extension.SaveAs(
                dlg.FileName, 0, 1, null, ref saveErrors, ref saveWarnings);
            if (!saved)
                throw new InvalidOperationException($"SolidWorks Save As failed (error code {saveErrors}).");

            _swApp.ActivateDoc2(model.GetTitle(), false, ref saveErrors);

            return Task.FromResult($"Created and opened {dlg.FileName} in this SolidWorks session.");
        }

        // ---- COM registration: writes the HKLM\...\AddIns\{GUID} entries
        // SolidWorks reads to list this in Tools > Add-Ins. This hook only
        // ever runs via regasm.exe (register-addin.ps1's own HKCU-only path
        // does its own, separate registry writes and never calls this
        // method at all -- see that script), and regasm's own CLSID/ProgId
        // registration under HKEY_CLASSES_ROOT already requires elevation to
        // succeed, so there's no non-elevated case here to preserve: LocalMachine
        // is the correct, unconditional target. Was Registry.CurrentUser --
        // changed after confirming SolidWorks' Tools > Add-Ins dialog didn't
        // list the add-in even with a CORRECTLY-formed HKCU registration
        // (register-addin.ps1's own two real bugs both fixed and verified
        // first), while the built-in add-ins that DO appear there (FeatureWorks
        // etc.) are all registered under HKLM:\SOFTWARE\SolidWorks\AddIns --
        // this is the fix to actually test that theory via the elevated path.
        [ComRegisterFunction]
        public static void RegisterFunction(Type t)
        {
            string guid = t.GUID.ToString("B").ToUpperInvariant();
            using (var key = Microsoft.Win32.Registry.LocalMachine.CreateSubKey(
                @"SOFTWARE\SolidWorks\AddIns\" + guid))
            {
                key.SetValue("Title", "GEARS GENERATOR", RegistryValueKind.String);
                key.SetValue("Description", "Parametric involute spur gears -- exact geometry, STEP/DXF/SolidWorks", RegistryValueKind.String);
            }
            using (var key = Microsoft.Win32.Registry.LocalMachine.CreateSubKey(
                @"SOFTWARE\SolidWorks\AddInsStartup\" + guid))
            {
                key.SetValue(null, 1, RegistryValueKind.DWord); // pre-checked / auto-load
            }
        }

        [ComUnregisterFunction]
        public static void UnregisterFunction(Type t)
        {
            string guid = t.GUID.ToString("B").ToUpperInvariant();
            try { Microsoft.Win32.Registry.LocalMachine.DeleteSubKeyTree(@"SOFTWARE\SolidWorks\AddIns\" + guid, false); } catch { }
            try { Microsoft.Win32.Registry.LocalMachine.DeleteSubKeyTree(@"SOFTWARE\SolidWorks\AddInsStartup\" + guid, false); } catch { }
        }
    }
}
