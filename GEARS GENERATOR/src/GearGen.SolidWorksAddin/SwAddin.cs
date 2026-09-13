using System;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Windows.Forms;
using GearGen.Geometry;
using GearGen.PyEngine;
using Microsoft.Win32;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;
using SolidWorks.Interop.swpublished;

namespace GearGen.SolidWorksAddin
{
    /// <summary>
    /// The SolidWorks add-in entry point: implements ISwAddin (ConnectToSW /
    /// DisconnectFromSW, the two methods SolidWorks calls), registers itself
    /// so it shows up in Tools > Add-Ins, and docks GearPanel (the exact same
    /// UI the standalone app uses -- see GearPanelHost) in a Task Pane with
    /// the LIBRARY under it. "Create in SolidWorks" here builds directly into
    /// THIS live SolidWorks session (no launch/attach needed, unlike the
    /// standalone app's SolidWorksExporter) since we're already running
    /// inside it: the generated STEP is imported either as ONE multi-body
    /// part (one body per gear) or as an ASSEMBLY (one component per gear),
    /// saved into the library folder, and listed there to be dragged into
    /// any SolidWorks window.
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
                MessageBox.Show(
                    "GEARS GENERATOR could not start its Python geometry engine:\n" + ex.Message +
                    "\n\nMake sure Python 3 with shapely/build123d/ezdxf is installed and on PATH.",
                    "GEARS GENERATOR", MessageBoxButtons.OK, MessageBoxIcon.Warning);
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

        /// <summary>Builds the gear (or the whole set) directly into this live
        /// SolidWorks session: asks part or assembly and the file name, imports
        /// the STEP SolidWorks' own translator produced with the neutral-file
        /// structure mapping set for that choice (multi-body part, or an
        /// assembly of one component per solid), 3D Interconnect off so the
        /// result is native bodies with no link to the temporary STEP, saves
        /// into the library folder (or wherever the user picks), opens it and
        /// lists it in the library for dragging.</summary>
        private Task<string> InsertGearAsync(GearParameters parameters, string stepPath)
        {
            using (var dlg = new InsertDialog(parameters))
            {
                if (dlg.ShowDialog() != DialogResult.OK)
                    return Task.FromResult("Cancelled.");

                string target = dlg.TargetPath;
                bool assembly = dlg.AsAssembly;
                Directory.CreateDirectory(Path.GetDirectoryName(target) ?? GearPanelHost.LibraryFolder);

                int mapping = _swApp.GetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping);
                // 0 = one component per solid (SolidWorks' default, an assembly); 2 = one multi-body part
                int wanted = assembly ? 0 : (int)swImportNeutralAssemblyStructureMapping_e.swImportNeutralAssemblyStructureMapping_MultibodyPart;
                bool interconnect = _swApp.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect);
                // the older "Import multiple bodies as parts" toggle is what SolidWorks 2020 reads
                bool multiAsParts = _swApp.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportMultBodyAsPartData);
                try
                {
                    if (mapping != wanted)
                        _swApp.SetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping, wanted);
                    if (multiAsParts != assembly)
                        _swApp.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportMultBodyAsPartData, assembly);
                    if (interconnect)
                        _swApp.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect, false);

                    int loadErrors = 0;
                    ModelDoc2 model = _swApp.LoadFile4(stepPath, "r", null, ref loadErrors) as ModelDoc2;
                    if (model == null)
                        throw new InvalidOperationException($"SolidWorks could not import the STEP file (error code {loadErrors}).");

                    int saveErrors = 0, saveWarnings = 0;
                    bool saved = model.Extension.SaveAs(target, 0, (int)swSaveAsOptions_e.swSaveAsOptions_Silent, null, ref saveErrors, ref saveWarnings);
                    if (!saved)
                        throw new InvalidOperationException($"SolidWorks Save As failed (error code {saveErrors}).");

                    int activateErrors = 0;
                    _swApp.ActivateDoc2(model.GetTitle(), false, ref activateErrors);
                    _panelHost?.HighlightInLibrary(target);
                    string what = assembly ? "an assembly, one component per gear" : "a part, one body per gear";
                    return Task.FromResult($"Created {Path.GetFileName(target)} ({what}) in this SolidWorks session and listed it in the library -- drag it from there into any assembly.");
                }
                finally
                {
                    if (mapping != wanted)
                        _swApp.SetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping, mapping);
                    if (multiAsParts != assembly)
                        _swApp.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportMultBodyAsPartData, multiAsParts);
                    if (interconnect)
                        _swApp.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect, true);
                }
            }
        }

        /// <summary>Part or assembly, and where: the library folder by default
        /// (Documents\GEARS GENERATOR, what the Task Pane lists), or a folder
        /// of the user's choosing.</summary>
        private sealed class InsertDialog : Form
        {
            private readonly RadioButton _part, _assembly;
            private readonly TextBox _name;
            private readonly CheckBox _library;
            private readonly GearParameters _parameters;

            public string TargetPath { get; private set; }
            public bool AsAssembly => _assembly.Checked;

            public InsertDialog(GearParameters parameters)
            {
                _parameters = parameters;
                Text = "Create in SolidWorks";
                FormBorderStyle = FormBorderStyle.FixedDialog;
                StartPosition = FormStartPosition.CenterScreen;
                MaximizeBox = false; MinimizeBox = false; ShowInTaskbar = false;
                ClientSize = new Size(460, 210);
                Font = new Font("Segoe UI", 9.0f);

                var title = new Label { Left = 14, Top = 12, Width = 430, Height = 20, Text = "Bring the generated geometry into this SolidWorks session as:" };
                _part = new RadioButton { Left = 14, Top = 38, Width = 430, Checked = true, Text = "A part -- one solid body per gear (meshing sets become multi-body parts)" };
                _assembly = new RadioButton { Left = 14, Top = 62, Width = 430, Text = "An assembly -- one component per gear (each gear its own part inside it)" };
                var nameLabel = new Label { Left = 14, Top = 96, Width = 80, Height = 20, Text = "File name" };
                _name = new TextBox { Left = 96, Top = 92, Width = 348 };
                _library = new CheckBox { Left = 14, Top = 124, Width = 430, Checked = true, Text = "Save into the library folder (" + GearPanelHost.LibraryFolder + ")" };
                var ok = new Button { Text = "Create", Left = 270, Top = 166, Width = 84, Height = 28, DialogResult = DialogResult.None };
                var cancel = new Button { Text = "Cancel", Left = 360, Top = 166, Width = 84, Height = 28, DialogResult = DialogResult.Cancel };
                _part.CheckedChanged += (s, e) => UpdateName();
                _assembly.CheckedChanged += (s, e) => UpdateName();
                ok.Click += (s, e) => Accept();
                AcceptButton = ok; CancelButton = cancel;
                Controls.AddRange(new Control[] { title, _part, _assembly, nameLabel, _name, _library, ok, cancel });
                UpdateName();
            }

            private void UpdateName()
            {
                string ext = _assembly.Checked ? ".sldasm" : ".sldprt";
                string current = _name.Text;
                string suggested = _parameters.SuggestedFileName(ext);
                if (string.IsNullOrWhiteSpace(current) || current.EndsWith(".sldprt", StringComparison.OrdinalIgnoreCase) || current.EndsWith(".sldasm", StringComparison.OrdinalIgnoreCase))
                    _name.Text = suggested;
            }

            private void Accept()
            {
                string ext = _assembly.Checked ? ".sldasm" : ".sldprt";
                string name = _name.Text.Trim();
                if (name.Length == 0) name = _parameters.SuggestedFileName(ext);
                if (!name.EndsWith(ext, StringComparison.OrdinalIgnoreCase))
                    name = Path.GetFileNameWithoutExtension(name) + ext;
                foreach (char c in Path.GetInvalidFileNameChars()) name = name.Replace(c, '_');
                if (_library.Checked)
                {
                    TargetPath = Path.Combine(GearPanelHost.LibraryFolder, name);
                }
                else
                {
                    using (var save = new System.Windows.Forms.SaveFileDialog
                    {
                        Filter = _assembly.Checked ? "SolidWorks Assembly (*.sldasm)|*.sldasm" : "SolidWorks Part (*.sldprt)|*.sldprt",
                        FileName = name,
                    })
                    {
                        if (save.ShowDialog(this) != DialogResult.OK) return;
                        TargetPath = save.FileName;
                    }
                }
                DialogResult = DialogResult.OK;
                Close();
            }
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
                key.SetValue("Description", "23 gear families on exact geometry -- meshing sets as parts or assemblies, dragged in from the Task Pane", RegistryValueKind.String);
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
