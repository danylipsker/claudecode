using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Windows.Forms;
using GearGen.Geometry;
using GearGen.PyEngine;
using Microsoft.Win32;
using SolidWorks.Interop.sldworks;
using SolidWorks.Interop.swconst;
using SolidWorks.Interop.swpublished;

namespace System.Runtime.CompilerServices
{
    // C# 9 module initializers work on .NET Framework once the attribute exists
    [AttributeUsage(AttributeTargets.Method, Inherited = false)]
    internal sealed class ModuleInitializerAttribute : Attribute { }
}

namespace GearGen.SolidWorksAddin
{
    /// <summary>Runs when the runtime first executes anything in this
    /// assembly, before any class is constructed: a managed load of the
    /// DLL leaves this line even when the add-in class is never reached.</summary>
    internal static class AddInProbe
    {
        [System.Runtime.CompilerServices.ModuleInitializer]
        internal static void Init()
        {
            SwAddin.Log("module initializer: assembly executed in process " + System.Diagnostics.Process.GetCurrentProcess().ProcessName +
                        " (base " + AppDomain.CurrentDomain.BaseDirectory + ", domain '" + AppDomain.CurrentDomain.FriendlyName + "')");
        }
    }

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

        /// <summary>Runs when SolidWorks first touches the class, before any
        /// instance exists: logs it, and hooks AssemblyResolve so the add-in's
        /// own dependencies (GearGen.UI, GearGen.PyEngine, HelixToolkit...) are
        /// found in the add-in's folder when the host's probing -- SolidWorks'
        /// install folder -- does not find them.</summary>
        static SwAddin()
        {
            string here = Path.GetDirectoryName(typeof(SwAddin).Assembly.Location) ?? ".";
            Log("static ctor: assembly " + typeof(SwAddin).Assembly.Location + " in process " +
                System.Diagnostics.Process.GetCurrentProcess().ProcessName + " (CLR " + System.Environment.Version + ")");
            AppDomain.CurrentDomain.AssemblyResolve += (sender, args) =>
            {
                try
                {
                    // satellite resource probes (x.resources for the UI culture) are routine and not ours to answer
                    string name = new System.Reflection.AssemblyName(args.Name).Name;
                    if (name.EndsWith(".resources", StringComparison.OrdinalIgnoreCase)) return null;
                    string candidate = Path.Combine(here, name + ".dll");
                    if (!File.Exists(candidate)) return null;
                    Log("AssemblyResolve: " + args.Name + " -> " + candidate);
                    return System.Reflection.Assembly.LoadFrom(candidate);
                }
                catch (Exception ex) { Log("AssemblyResolve failed: " + ex.Message); return null; }
            };
        }

        public SwAddin()
        {
            Log("instance created");
        }

        /// <summary>Every step of the connection goes to %TEMP%\GearGen.SolidWorksAddin.log:
        /// SolidWorks says nothing when an add-in fails to connect (no dialog,
        /// no event), and this file is what told which step it was.</summary>
        internal static void Log(string text)
        {
            string line = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "  " + text + System.Environment.NewLine;
            try { System.Diagnostics.Trace.WriteLine("GearGen add-in: " + text); } catch { }
            try { File.AppendAllText(Path.Combine(Path.GetTempPath(), "GearGen.SolidWorksAddin.log"), line); } catch { }
            try
            {
                string here = Path.GetDirectoryName(typeof(SwAddin).Assembly.Location);
                if (!string.IsNullOrEmpty(here)) File.AppendAllText(Path.Combine(here, "GearGen.SolidWorksAddin.log"), line);
            }
            catch { /* logging never breaks the add-in */ }
        }

        /// <summary>Thin on purpose: this method's own body references nothing
        /// but Log, so it always compiles; the real work is in ConnectCore, whose
        /// JIT compilation is the point where a dependency that will not load
        /// throws -- inside this try, into the log, instead of out of the add-in.</summary>
        public bool ConnectToSW(object ThisSW, int cookie)
        {
            Log("ConnectToSW: entered (cookie " + cookie + ")");
            try
            {
                return ConnectCore(ThisSW, cookie);
            }
            catch (Exception ex)
            {
                Log("ConnectToSW: ConnectCore failed: " + ex);
                return false;
            }
        }

        private bool ConnectCore(object ThisSW, int cookie)
        {
            Log("ConnectCore: entered (host " + AppDomain.CurrentDomain.BaseDirectory + ")");
            try
            {
                _swApp = (ISldWorks)ThisSW;
                _cookie = cookie;
                Log("ConnectToSW: SolidWorks " + _swApp.RevisionNumber());
            }
            catch (Exception ex)
            {
                Log("ConnectToSW: the SolidWorks object: " + ex);
                return false;
            }

            // The engine's constructor locates the Python server and can throw
            // (it did, hosted in SolidWorks, until PyGearEngine.LocateServerScript
            // learnt to walk up from its own assembly): anything thrown out of
            // ConnectToSW makes SolidWorks drop the add-in without a word, so
            // the whole engine start sits inside the try and a missing engine
            // becomes a message, with the panel still docked.
            try
            {
                _engine = new PyGearEngine();
                _engine.Start();
                Log("ConnectToSW: Python engine started (" + PyGearEngine.LocateServerScript() + ")");
            }
            catch (Exception ex)
            {
                Log("ConnectToSW: Python engine failed: " + ex);
                MessageBox.Show(
                    "GEARS GENERATOR could not start its Python geometry engine:\n" + ex.Message +
                    "\n\nMake sure Python 3 with shapely/build123d/ezdxf is installed and on PATH.",
                    "GEARS GENERATOR", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }

            // The Task Pane: a view with our icon, and the WinForms host control
            // in it, created by SolidWorks through COM from its ProgID (it must
            // be registered as an ActiveX control -- see install-addin.ps1). A
            // failure here is logged and reported, and the add-in stays
            // connected: the engine and "Create in SolidWorks" do not need the pane.
            try
            {
                string iconPath = Path.Combine(Path.GetDirectoryName(GetType().Assembly.Location) ?? ".", "icon.bmp");
                Log("ConnectToSW: creating the Task Pane view (icon " + iconPath + (File.Exists(iconPath) ? "" : " MISSING") + ")");
                _taskpaneView = _swApp.CreateTaskpaneView2(iconPath, "Gears Generator");
                Log("ConnectToSW: view " + (_taskpaneView == null ? "null" : "created"));
                if (_taskpaneView != null)
                {
                    object controlObj = _taskpaneView.AddControl("GearGen.SolidWorksAddin.GearPanelHost", "");
                    Log("ConnectToSW: AddControl returned " + (controlObj == null ? "null" : controlObj.GetType().FullName));
                    _panelHost = controlObj as GearPanelHost;
                    if (_panelHost != null)
                    {
                        _panelHost.Attach(_engine, InsertGearAsync);
                        Log("ConnectToSW: panel attached");
                    }
                    else
                        Log("ConnectToSW: the control is not a GearPanelHost (" + (controlObj == null ? "null" : controlObj.GetType().FullName) + ")");
                }
            }
            catch (Exception ex)
            {
                Log("ConnectToSW: Task Pane failed: " + ex);
                MessageBox.Show("GEARS GENERATOR loaded, but its Task Pane could not be created:\n" + ex.Message,
                    "GEARS GENERATOR", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }

            // GEARGEN_ADDIN_SHOWPANE=1 opens our Task Pane on connect instead of
            // leaving it to a click on the gear tab -- used to bring it up on
            // demand; normal startups (no flag) leave SolidWorks' own pane choice alone.
            if (_taskpaneView != null && SelfTestSetting("GEARGEN_ADDIN_SHOWPANE", "showpane") == "1")
                StartShowPane();

            string selfTest = SelfTestSetting("GEARGEN_ADDIN_SELFTEST", "dir");
            if (!string.IsNullOrEmpty(selfTest) && _panelHost != null && _engine != null)
                StartSelfTest(selfTest);

            Log("ConnectToSW: done, returning true");
            return true;
        }

        // GEARGEN_ADDIN_SHOWPANE: re-assert our pane for a few seconds so it ends
        // up in front even when another startup add-in (the 3DEXPERIENCE
        // Marketplace shows an "Update Available" pane) fronts its own after us.
        private Timer _showPaneTimer;
        private int _showPaneCount;
        private void StartShowPane()
        {
            try { _taskpaneView.ShowView(); } catch { }
            _showPaneTimer = new Timer { Interval = 4000 };
            _showPaneTimer.Tick += (s, e) =>
            {
                try { _taskpaneView?.ShowView(); } catch { }
                if (++_showPaneCount >= 6) _showPaneTimer.Stop();
            };
            _showPaneTimer.Start();
            Log("ConnectToSW: ShowView (showpane; re-showing for ~24s past other add-ins' startup panes)");
        }

        public bool DisconnectFromSW()
        {
            try { _showPaneTimer?.Stop(); } catch { /* best effort */ }
            try { _selfTestTimer?.Stop(); } catch { /* best effort */ }
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
            string target;
            bool assembly;
            using (var dlg = new InsertDialog(parameters))
            {
                if (dlg.ShowDialog() != DialogResult.OK)
                    return Task.FromResult("Cancelled.");
                target = dlg.TargetPath;
                assembly = dlg.AsAssembly;
            }
            try
            {
                string message = InsertCore(_swApp, stepPath, target, assembly);
                _panelHost?.HighlightInLibrary(target);
                return Task.FromResult(message);
            }
            catch (Exception ex)
            {
                Log("insert: failed: " + ex);
                throw;
            }
        }

        /// <summary>SolidWorks' STEP translator runs a modal step that never
        /// returns unless SolidWorks is the foreground window -- it waits for an
        /// activation that never comes, with no visible dialog, when another app
        /// is in front (found by driving the import while the terminal had
        /// focus: the body imported but LoadFile4 hung forever; foregrounding
        /// SolidWorks first made it return in seconds). A user who just clicked
        /// the Task Pane button already has SolidWorks in front; this keeps it
        /// working when the call is driven programmatically.</summary>
        private void BringSolidWorksToFront(ISldWorks app)
        {
            try
            {
                object frameObj = app.Frame();
                if (!(frameObj is IFrame frame)) return;
                IntPtr h = new IntPtr(frame.GetHWndx64());
                ShowWindow(h, 9 /* SW_RESTORE */);
                // SetForegroundWindow alone is refused by Windows' foreground
                // lock when another process owns the foreground; attaching to
                // that thread's input first is the standard way through. A user
                // clicking the Task Pane button already has SolidWorks in front,
                // so this is belt-and-braces there and the real fix when the
                // call is driven programmatically.
                IntPtr fg = GetForegroundWindow();
                uint fgThread = GetWindowThreadProcessId(fg, out _);
                uint thisThread = GetCurrentThreadId();
                if (fgThread != thisThread) AttachThreadInput(thisThread, fgThread, true);
                bool ok;
                try { BringWindowToTop(h); ok = SetForegroundWindow(h); }
                finally { if (fgThread != thisThread) AttachThreadInput(thisThread, fgThread, false); }
                if (GetForegroundWindow() != h)
                    Log("insert: warning -- SolidWorks did not take the foreground (SetForegroundWindow=" + ok + "); the STEP import may block");
            }
            catch (Exception ex) { Log("insert: bring to front: " + ex.Message); }
        }

        /// <summary>The import itself, prepared the way the standalone app's
        /// SolidWorksExporter learnt to: "always use default templates" forced
        /// on with a real part and assembly template if none is configured
        /// (otherwise LoadFile4 pops the modal "New SOLIDWORKS Document" dialog
        /// in SolidWorks' own window and the import waits for a click --
        /// measured here in 2026), 3D Interconnect off (native bodies, no link
        /// to the temporary STEP), the neutral-file structure mapping and the
        /// older "import multiple bodies as parts" toggle (what 2020 reads) set
        /// for a multi-body part or an assembly of one component per solid.
        /// Every preference is put back. Saved as the target and left open.</summary>
        private string InsertCore(ISldWorks app, string stepPath, string target, bool assembly)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(target) ?? GearPanelHost.LibraryFolder);
            BringSolidWorksToFront(app);

            bool alwaysDefault = app.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAlwaysUseDefaultTemplates);
            string partTemplate = app.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplatePart);
            string asmTemplate = app.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplateAssembly);
            string stockPart = string.IsNullOrWhiteSpace(partTemplate) || !File.Exists(partTemplate) ? FindStockTemplate(app, "*.prtdot") : null;
            string stockAsm = string.IsNullOrWhiteSpace(asmTemplate) || !File.Exists(asmTemplate) ? FindStockTemplate(app, "*.asmdot") : null;
            int mapping = app.GetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping);
            // 0 = one component per solid (SolidWorks' default, an assembly); 2 = one multi-body part
            int wanted = assembly ? 0 : (int)swImportNeutralAssemblyStructureMapping_e.swImportNeutralAssemblyStructureMapping_MultibodyPart;
            bool interconnect = app.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect);
            bool multiAsParts = app.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportMultBodyAsPartData);
            bool autoDiag = app.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportAutoRunImportDiagnostics);
            bool forceDiag = app.GetUserPreferenceToggle((int)swUserPreferenceToggle_e.swForceEnableImportDiagnosis);
            try
            {
                if (!alwaysDefault)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAlwaysUseDefaultTemplates, true);
                if (stockPart != null)
                    app.SetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplatePart, stockPart);
                if (stockAsm != null)
                    app.SetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplateAssembly, stockAsm);
                if (mapping != wanted)
                    app.SetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping, wanted);
                if (multiAsParts != assembly)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportMultBodyAsPartData, assembly);
                if (interconnect)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect, false);
                // Interactive SolidWorks (2026 especially) stops on a modal "run
                // Import Diagnostics?" prompt after LoadFile4 has already brought
                // the bodies in -- the add-in's insert hung there (2020 never
                // asks; the standalone app never saw it because an automation-
                // launched SolidWorks suppresses it). Both the auto-run toggle
                // off AND a non-null import-data object (GetImportFileData) make
                // the translator run silently.
                if (autoDiag)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportAutoRunImportDiagnostics, false);
                if (forceDiag)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swForceEnableImportDiagnosis, false);

                object importData = null;
                try
                {
                    importData = app.GetImportFileData(stepPath);
                    if (importData is IImportStepData stepData) stepData.MapConfigurationData = false;
                }
                catch (Exception ex) { Log("insert: GetImportFileData: " + ex.Message + " (importing without it)"); }

                int loadErrors = 0;
                Log("insert: LoadFile4 " + stepPath + (importData != null ? " (silent, with import data)" : ""));
                ModelDoc2 model = app.LoadFile4(stepPath, "r", importData, ref loadErrors) as ModelDoc2;
                Log("insert: LoadFile4 returned " + (model == null ? "null" : model.GetTitle()) + " (errors " + loadErrors + ")");
                if (model == null)
                    throw new InvalidOperationException($"SolidWorks could not import the STEP file (error code {loadErrors}).");

                int saveErrors = 0, saveWarnings = 0;
                Log("insert: SaveAs " + target);
                bool saved = model.Extension.SaveAs(target, 0, (int)swSaveAsOptions_e.swSaveAsOptions_Silent, null, ref saveErrors, ref saveWarnings);
                Log("insert: SaveAs returned " + saved + " (errors " + saveErrors + ", warnings " + saveWarnings + ")");
                if (!saved)
                    throw new InvalidOperationException($"SolidWorks Save As failed (error code {saveErrors}).");

                string note = "";
                // SolidWorks 2020's translator opens a multi-solid STEP as an
                // assembly of components whatever the mapping says; saved under
                // a part name, SolidWorks converts each component into a body of
                // the part -- on disk. The open document is still that assembly
                // (titled after the temporary STEP), so it is closed and the
                // saved part opened in its place.
                if (!assembly && model.GetType() == (int)swDocumentTypes_e.swDocASSEMBLY)
                {
                    app.CloseDoc(model.GetTitle());
                    int openErrors = 0, openWarnings = 0;
                    model = app.OpenDoc6(target, (int)swDocumentTypes_e.swDocPART, (int)swOpenDocOptions_e.swOpenDocOptions_Silent, "", ref openErrors, ref openWarnings) as ModelDoc2;
                    if (model == null)
                        throw new InvalidOperationException($"The part was saved but could not be reopened (error code {openErrors}).");
                    note = "; this SolidWorks opened the STEP as components and turned them into bodies on saving";
                }

                int activateErrors = 0;
                app.ActivateDoc2(model.GetTitle(), false, ref activateErrors);
                Log("insert: activated " + model.GetTitle());
                string what = (assembly ? "an assembly, one component per gear" : "a part, one body per gear") + CountText(model, assembly) + note;
                return $"Created {Path.GetFileName(target)} ({what}) in this SolidWorks session and listed it in the library -- drag it from there into any assembly.";
            }
            finally
            {
                if (mapping != wanted)
                    app.SetUserPreferenceIntegerValue((int)swUserPreferenceIntegerValue_e.swImportNeutralAssemblyStructureMapping, mapping);
                if (multiAsParts != assembly)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportMultBodyAsPartData, multiAsParts);
                if (interconnect)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swMultiCAD_Enable3DInterconnect, true);
                if (autoDiag)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swImportAutoRunImportDiagnostics, true);
                if (forceDiag)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swForceEnableImportDiagnosis, true);
                if (stockPart != null)
                    app.SetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplatePart, partTemplate ?? "");
                if (stockAsm != null)
                    app.SetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swDefaultTemplateAssembly, asmTemplate ?? "");
                if (!alwaysDefault)
                    app.SetUserPreferenceToggle((int)swUserPreferenceToggle_e.swAlwaysUseDefaultTemplates, false);
            }
        }

        /// <summary>A template of the given kind (*.prtdot / *.asmdot) from the
        /// configured template folders, then every "SOLIDWORKS &lt;year&gt;\templates"
        /// under ProgramData (the same search as the standalone exporter).</summary>
        private static string FindStockTemplate(ISldWorks app, string pattern)
        {
            var folders = new System.Collections.Generic.List<string>();
            try
            {
                string configured = app.GetUserPreferenceStringValue((int)swUserPreferenceStringValue_e.swFileLocationsDocumentTemplates);
                if (!string.IsNullOrWhiteSpace(configured))
                    folders.AddRange(configured.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries));
            }
            catch { /* no configured folders: the stock ones */ }
            string programData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.CommonApplicationData);
            if (Directory.Exists(Path.Combine(programData, "SolidWorks")))
                folders.AddRange(Directory.GetDirectories(Path.Combine(programData, "SolidWorks"), "SOLIDWORKS *")
                    .OrderByDescending(d => d).Select(d => Path.Combine(d, "templates")));
            foreach (var folder in folders)
            {
                try
                {
                    if (!Directory.Exists(folder)) continue;
                    var hit = Directory.GetFiles(folder, pattern).FirstOrDefault();
                    if (hit != null) return hit;
                }
                catch (Exception) { /* unreadable folder: the next one */ }
            }
            return null;
        }

        /// <summary>": 6 bodies" / ": 6 components", counted from the feature
        /// tree: one BaseBody feature per imported solid of a part, one
        /// Reference feature per component of an assembly. (IPartDoc refuses
        /// the import document's wrapper with E_NOINTERFACE -- the features
        /// answer.) A courtesy: empty when it cannot be read.</summary>
        private static string CountText(ModelDoc2 model, bool assembly)
        {
            try
            {
                int bodies = 0, components = 0;
                Feature f = model.FirstFeature() as Feature;
                while (f != null)
                {
                    string tn = f.GetTypeName2();
                    if (tn == "BaseBody") bodies++;
                    else if (tn == "Reference") components++;
                    f = f.GetNextFeature() as Feature;
                }
                if (assembly && components > 0) return ": " + components + " components";
                if (!assembly && bodies > 0) return ": " + bodies + " bodies";
            }
            catch { /* the count is a courtesy */ }
            return "";
        }

        // ---- self-test: the ONLY way to exercise this add-in end to end.
        // A SolidWorks started through COM automation never loads startup
        // add-ins, and a normally started one is not reachable from outside (it
        // does not register in the running-object table), so the add-in has to
        // drive itself from inside. GEARGEN_ADDIN_SELFTEST=<folder> (or a
        // dir=<folder> line in %TEMP%\GearGen.selftest.txt, for an automation-
        // started instance that inherits no environment) makes it, a few
        // seconds after connecting: show the pane and capture it, select the
        // compound planetary card (or spur, with family=spur), create the set
        // as a part and as an assembly into the library, capture each, and log
        // every step. Never runs unless that variable or file is set.
        private string _selfTestDir;
        private int _selfTestStep;
        private Timer _selfTestTimer;

        /// <summary>A self-test setting: the environment variable, else the
        /// "key=value" line of %TEMP%\GearGen.selftest.txt (an automation-
        /// started SolidWorks inherits no environment of ours). The file is
        /// ignored once it is more than ten minutes old, so a forgotten trigger
        /// never fires.</summary>
        private static string SelfTestSetting(string variable, string key)
        {
            string value = System.Environment.GetEnvironmentVariable(variable);
            if (!string.IsNullOrEmpty(value)) return value;
            try
            {
                string file = Path.Combine(Path.GetTempPath(), "GearGen.selftest.txt");
                if (!File.Exists(file)) return null;
                if ((DateTime.Now - File.GetLastWriteTime(file)).TotalMinutes > 10) return null;
                foreach (string line in File.ReadAllLines(file))
                    if (line.StartsWith(key + "=", StringComparison.OrdinalIgnoreCase))
                        return line.Substring(key.Length + 1).Trim();
            }
            catch { /* no trigger file */ }
            return null;
        }

        private void StartSelfTest(string dir)
        {
            _selfTestDir = dir;
            Directory.CreateDirectory(dir);
            _selfTestTimer = new Timer { Interval = 8000 };
            _selfTestTimer.Tick += (s, e) =>
            {
                _selfTestTimer.Interval = 3000;
                try { SelfTestTick(); }
                catch (Exception ex) { Log("selftest: FAILED at step " + _selfTestStep + ": " + ex); _selfTestTimer.Stop(); }
            };
            _selfTestTimer.Start();
            Log("selftest: scheduled, output " + dir);
        }

        private bool _selfTestInStep;

        private void SelfTestTick()
        {
            // A create step's import runs a modal message loop that pumps this
            // very timer; without this guard the next tick would start a second
            // import on top of the first (two overlapping LoadFile4 calls, the
            // second failing). One step at a time.
            if (_selfTestInStep) return;
            var vm = _panelHost.Panel.ViewModel;
            if (vm.IsBusy) return; // a preview or an insert is still running
            _selfTestInStep = true;
            try
            {
            switch (_selfTestStep++)
            {
                case 0:
                    if (_taskpaneView != null) _taskpaneView.ShowView();
                    Log("selftest: ShowView");
                    break;
                case 1:
                    Capture("selftest_1_pane.png");
                    break;
                case 2:
                    if (string.Equals(SelfTestSetting("GEARGEN_ADDIN_SELFTEST_FAMILY", "family"), "spur", StringComparison.OrdinalIgnoreCase))
                    { vm.SelectSpurCard(); Log("selftest: spur card selected"); }
                    else
                    { vm.SelectCompoundPlanetaryCard(); Log("selftest: compound planetary card selected"); }
                    break;
                case 3:
                    SelfTestCreate(vm, false);
                    break;
                case 4:
                    Capture("selftest_2_part.png");
                    break;
                case 5:
                    SelfTestCreate(vm, true);
                    break;
                case 6:
                    Capture("selftest_3_assembly.png");
                    Log("selftest: done, the library lists " + _panelHost.LibraryCount + " files");
                    _selfTestTimer.Stop();
                    break;
            }
            }
            finally { _selfTestInStep = false; }
        }

        /// <summary>Create the current set into the library the same way the
        /// button's handler does (build the STEP, then InsertCore). Synchronous
        /// here (it blocks this timer tick), which is fine: the file is on disk
        /// before the next tick captures it.</summary>
        private void SelfTestCreate(GearGen.UI.GearViewModel vm, bool assembly)
        {
            string target = GearPanelHost.LibraryTargetFor(vm.SnapshotParameters().SuggestedFileName(assembly ? ".sldasm" : ".sldprt"), assembly);
            Log("selftest: creating the " + (assembly ? "assembly " : "part ") + target);
            try
            {
                string step = Path.Combine(Path.GetTempPath(), "geargen_selftest_" + Guid.NewGuid().ToString("N") + ".step");
                _engine.ExportStepAsync(vm.SnapshotParameters(), step).GetAwaiter().GetResult();
                string msg = InsertCore(_swApp, step, target, assembly);
                _panelHost.HighlightInLibrary(target);
                Log("selftest: " + msg);
                try { File.Delete(step); } catch { }
            }
            catch (Exception ex) { Log("selftest: create failed: " + ex); }
        }

        [DllImport("user32.dll")] private static extern bool PrintWindow(IntPtr hwnd, IntPtr hdc, uint flags);
        [DllImport("user32.dll")] private static extern bool GetWindowRect(IntPtr hwnd, out RECT rect);
        [DllImport("user32.dll")] private static extern bool SetForegroundWindow(IntPtr hwnd);
        [DllImport("user32.dll")] private static extern bool BringWindowToTop(IntPtr hwnd);
        [DllImport("user32.dll")] private static extern bool ShowWindow(IntPtr hwnd, int cmd);
        [DllImport("user32.dll")] private static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")] private static extern uint GetWindowThreadProcessId(IntPtr hwnd, out uint pid);
        [DllImport("kernel32.dll")] private static extern uint GetCurrentThreadId();
        [DllImport("user32.dll")] private static extern bool AttachThreadInput(uint attach, uint attachTo, bool doAttach);
        [StructLayout(LayoutKind.Sequential)] private struct RECT { public int Left, Top, Right, Bottom; }

        /// <summary>The SolidWorks frame as it is painted (PrintWindow with
        /// PW_RENDERFULLCONTENT): what the self-test leaves as evidence.</summary>
        private void Capture(string name)
        {
            IntPtr hwnd = IntPtr.Zero;
            try { object frameObj = _swApp.Frame(); if (frameObj is IFrame frame) hwnd = new IntPtr(frame.GetHWndx64()); } catch { /* the process's main window then */ }
            if (hwnd == IntPtr.Zero) hwnd = System.Diagnostics.Process.GetCurrentProcess().MainWindowHandle;
            GetWindowRect(hwnd, out RECT r);
            using (var bmp = new Bitmap(Math.Max(1, r.Right - r.Left), Math.Max(1, r.Bottom - r.Top)))
            {
                bool ok;
                using (var g = Graphics.FromImage(bmp))
                {
                    IntPtr hdc = g.GetHdc();
                    ok = PrintWindow(hwnd, hdc, 2);
                    g.ReleaseHdc(hdc);
                }
                string path = Path.Combine(_selfTestDir, name);
                bmp.Save(path, System.Drawing.Imaging.ImageFormat.Png);
                Log("selftest: captured " + bmp.Width + "x" + bmp.Height + " (ok=" + ok + ") -> " + path);
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
                _library.Text = _assembly.Checked
                    ? "Save into the library folder, in a subfolder of its own with its component parts (" + GearPanelHost.LibraryFolder + ")"
                    : "Save into the library folder (" + GearPanelHost.LibraryFolder + ")";
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
                    TargetPath = GearPanelHost.LibraryTargetFor(name, _assembly.Checked);
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
            // The layout of SolidWorks' own add-in template, value for value:
            // HKLM\SOFTWARE\SolidWorks\AddIns\{guid} with (Default) = DWORD 0
            // plus Title and Description (what Tools > Add-Ins lists), and
            // HKCU\Software\SolidWorks\AddInsStartup\{guid} (Default) = DWORD 1
            // (pre-checked for this user). The (Default) DWORD on the AddIns
            // key was missing here for a long time: every entry SolidWorks
            // itself loads carries one, and without it a correctly COM-
            // registered add-in was loaded into the process and never asked
            // to connect (its ConnectToSW log stayed empty).
            string guid = t.GUID.ToString("B").ToUpperInvariant();
            using (var key = Microsoft.Win32.Registry.LocalMachine.CreateSubKey(
                @"SOFTWARE\SolidWorks\AddIns\" + guid))
            {
                key.SetValue(null, 0, RegistryValueKind.DWord);
                key.SetValue("Title", "GEARS GENERATOR", RegistryValueKind.String);
                key.SetValue("Description", "23 gear families on exact geometry -- meshing sets as parts or assemblies, dragged in from the Task Pane", RegistryValueKind.String);
            }
            using (var key = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                @"Software\SolidWorks\AddInsStartup\" + guid))
            {
                key.SetValue(null, 1, RegistryValueKind.DWord); // pre-checked / auto-load for this user
            }
        }

        [ComUnregisterFunction]
        public static void UnregisterFunction(Type t)
        {
            string guid = t.GUID.ToString("B").ToUpperInvariant();
            try { Microsoft.Win32.Registry.LocalMachine.DeleteSubKeyTree(@"SOFTWARE\SolidWorks\AddIns\" + guid, false); } catch { }
            try { Microsoft.Win32.Registry.LocalMachine.DeleteSubKeyTree(@"SOFTWARE\SolidWorks\AddInsStartup\" + guid, false); } catch { }
            try { Microsoft.Win32.Registry.CurrentUser.DeleteSubKeyTree(@"Software\SolidWorks\AddInsStartup\" + guid, false); } catch { }
        }
    }
}
