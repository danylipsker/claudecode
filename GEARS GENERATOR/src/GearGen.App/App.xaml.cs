using System;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using GearGen.PyEngine;
using SolidWorks.Interop.sldworks;

namespace GearGen.App
{
    public partial class App : Application
    {
        public static PyGearEngine Engine { get; private set; }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            Engine = new PyGearEngine();
            try
            {
                Engine.Start();
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Could not start the Python geometry engine.\n\n" + ex.Message +
                    "\n\nMake sure Python 3 is installed and on PATH, and that the " +
                    "'shapely', 'build123d' and 'ezdxf' packages are installed " +
                    "(pip install shapely build123d ezdxf).",
                    "GEARS GENERATOR", MessageBoxButton.OK, MessageBoxImage.Error);
            }

            if (e.Args.Length >= 2 && e.Args[0] == "--swversions")
            {
                var lines = SolidWorksVersionHelper.FindInstalls()
                    .Select(i => $"{i.ExePath}  major={i.MajorVersion}  year={i.Year}");
                File.WriteAllText(e.Args[1], string.Join("\n", lines));
                Shutdown(0);
                return;
            }

            if (e.Args.Length >= 3 && e.Args[0] == "--swtest")
            {
                RunSolidWorksTest(e.Args[1], e.Args[2]);
                return;
            }

            if (e.Args.Length >= 2 && e.Args[0] == "--swaddincheck")
            {
                RunSolidWorksAddinCheck(e.Args[1]);
                return;
            }

            if (e.Args.Length >= 2 && e.Args[0] == "--swdialogsmoke")
            {
                RunSolidWorksDialogSmokeTest(e.Args[1]);
                return;
            }

            if (e.Args.Length >= 2 && e.Args[0] == "--uismoke")
            {
                int? teeth = null;
                if (e.Args.Length >= 3 && int.TryParse(e.Args[2], out int t)) teeth = t;
                bool exportTest = e.Args.Any(a => a == "--exporttest");
                double? helix = null;
                var helixArg = e.Args.FirstOrDefault(a => a.StartsWith("--helix="));
                if (helixArg != null && double.TryParse(helixArg.Substring(8), out double h)) helix = h;
                bool bevel = e.Args.Any(a => a == "--bevel");
                bool worm = e.Args.Any(a => a == "--worm");
                bool rack = e.Args.Any(a => a == "--rack");
                bool internalGear = e.Args.Any(a => a == "--internal");
                bool herringbone = e.Args.Any(a => a == "--herringbone");
                bool screw = e.Args.Any(a => a == "--screw");
                bool planetary = e.Args.Any(a => a == "--planetary");
                bool cycloidal = e.Args.Any(a => a == "--cycloidal");
                bool cycdrive = e.Args.Any(a => a == "--cycdrive");
                bool resetTest = e.Args.Any(a => a == "--resettest");
                bool tall = e.Args.Any(a => a == "--tall");
                bool spiralBevel = e.Args.Any(a => a == "--spiralbevel");
                bool zerol = e.Args.Any(a => a == "--zerol");
                bool faceGear = e.Args.Any(a => a == "--facegear");
                bool sprocket = e.Args.Any(a => a == "--sprocket");
                bool chainLink = e.Args.Any(a => a == "--chainlink");
                bool timingWheel = e.Args.Any(a => a == "--timingwheel");
                bool timingBelt = e.Args.Any(a => a == "--timingbelt");
                bool hypoid = e.Args.Any(a => a == "--hypoid");
                RunUiSmokeTest(e.Args[1], teeth, exportTest, helix, bevel, worm, rack, internalGear, herringbone, screw, planetary, cycloidal, cycdrive, resetTest, tall, spiralBevel, zerol, faceGear, sprocket, chainLink, timingWheel, timingBelt, hypoid);
                return;
            }

            var win = new MainWindow();
            MainWindow = win;
            win.Show();
        }

        private void RunSolidWorksTest(string stepPath, string sldprtPath)
        {
            string logPath = sldprtPath + ".log";
            try
            {
                string result = SolidWorksExporter.ImportStepAndSaveAsSldprtAsync(stepPath, sldprtPath)
                    .GetAwaiter().GetResult();
                File.WriteAllText(logPath, "OK: " + result);
            }
            catch (Exception ex)
            {
                File.WriteAllText(logPath, "FAIL: " + ex);
            }
            Shutdown(0);
        }

        /// <summary>Checks whether the GearGen.SolidWorksAddin is actually
        /// loaded and connected. Tries Marshal.GetActiveObject first (attach
        /// to whatever's already running); if that throws, falls back to
        /// launching a fresh instance from THIS process, exactly like
        /// SolidWorksExporter's own fallback -- found empirically that
        /// GetActiveObject reaching a SolidWorks instance launched by a
        /// SEPARATE process/tool invocation is not reliable in this
        /// environment (every prior successful COM connection this session
        /// was to an instance the SAME process either launched or was
        /// already polling), while the self-contained launch-then-poll
        /// pattern has worked consistently. Runs on a dedicated STA thread,
        /// matching SolidWorksExporter's established pattern (SolidWorks'
        /// automation objects are STA; a plain thread-pool thread fails).
        /// Logs whether ISldWorks.GetAddInObject(progId) returned a live
        /// object -- SolidWorks' own documented way to check an add-in's
        /// connection state -- to a file rather than Console.WriteLine
        /// (doesn't work for a WinExe subsystem app; see --uismoke's own
        /// remarks).</summary>
        private void RunSolidWorksAddinCheck(string logPath)
        {
            var thread = new Thread(() =>
            {
                ISldWorks swApp = null;
                string connectionNote;
                try
                {
                    try
                    {
                        swApp = (ISldWorks)Marshal.GetActiveObject("SldWorks.Application");
                        connectionNote = "attached to an already-running SolidWorks instance.";
                    }
                    catch (COMException)
                    {
                        var t = Type.GetTypeFromProgID("SldWorks.Application");
                        swApp = (ISldWorks)Activator.CreateInstance(t);
                        swApp.Visible = true;
                        connectionNote = "launched a fresh SolidWorks instance from this process (GetActiveObject on the externally-running one failed).";
                        for (int i = 0; i < 60; i++)
                        {
                            try { var _ = swApp.ActiveDoc; break; }
                            catch { Thread.Sleep(500); }
                        }
                        // give newly-loading add-ins (ConnectToSW runs during
                        // this same startup) a moment to finish connecting
                        Thread.Sleep(5000);
                    }

                    try
                    {
                        object addin = swApp.GetAddInObject("GearGen.SolidWorksAddin.SwAddin");
                        if (addin != null)
                        {
                            File.WriteAllText(logPath,
                                "OK: GetAddInObject returned a live object -- add-in is loaded and connected.\n" +
                                "Connection: " + connectionNote + "\n" +
                                "Runtime type: " + addin.GetType().FullName);
                            Marshal.ReleaseComObject(addin);
                        }
                        else
                        {
                            File.WriteAllText(logPath,
                                "NOT LOADED: connected to SolidWorks (" + connectionNote + "), but GetAddInObject " +
                                "returned null (add-in isn't checked in Tools > Add-Ins, or ConnectToSW hasn't completed).");
                        }
                    }
                    finally
                    {
                        Marshal.ReleaseComObject(swApp);
                    }
                }
                catch (Exception ex)
                {
                    File.WriteAllText(logPath, "FAIL: " + ex);
                }
            });
            thread.SetApartmentState(ApartmentState.STA);
            thread.IsBackground = false; // keep the process alive until this finishes
            thread.Start();
            thread.Join(TimeSpan.FromSeconds(90)); // fresh-launch fallback can take a while
            Shutdown(0);
        }

        /// <summary>Headless check of the SolidWorks version-picker dialog. The
        /// interactive export flow is the ONLY place it is shown, and every
        /// automated SolidWorks test (--swtest) bypasses it, so until this
        /// existed nothing had ever actually constructed it. Instantiates it
        /// off-screen, logs what the ComboBox really ended up selecting (its
        /// SelectedIndex is set in XAML while it is still empty), whether the
        /// content fits the fixed window height (where the Export button's
        /// bottom edge lands vs. the client area), and any exception -- then
        /// renders it to a PNG. Invoke as: GearsGenerator.exe --swdialogsmoke out.png</summary>
        private void RunSolidWorksDialogSmokeTest(string outputPngPath)
        {
            string logPath = outputPngPath + ".log";
            var log = new System.Text.StringBuilder();
            void Log(string s) { log.AppendLine(s); File.WriteAllText(logPath, log.ToString()); }
            try
            {
                var dlg = new SolidWorksVersionDialog
                {
                    WindowStartupLocation = WindowStartupLocation.Manual,
                    Left = -5000,
                    Top = -5000,
                    ShowInTaskbar = false,
                };
                Log("constructed OK");
                dlg.Show();
                // SizeToContent grows the window through a WM_SIZE round trip
                // that UpdateLayout() alone does not pump; without pumping,
                // every measurement below reads the PRE-resize layout. Found
                // the hard way: after the fix, this log still said "CLIPPED"
                // with numbers identical to the broken build, while the
                // rendered PNG showed the buttons fully inside the window.
                var settle = DateTime.UtcNow.AddMilliseconds(500);
                while (DateTime.UtcNow < settle)
                {
                    Dispatcher.CurrentDispatcher.Invoke(DispatcherPriority.Background, new Action(() => { }));
                    Thread.Sleep(20);
                }
                dlg.UpdateLayout();

                var combo = (System.Windows.Controls.ComboBox)dlg.FindName("VersionCombo");
                var avail = (System.Windows.Controls.TextBlock)dlg.FindName("AvailabilityText");
                var ok = (System.Windows.Controls.Button)dlg.FindName("OkButton");
                Log($"combo items={combo.Items.Count} selectedIndex={combo.SelectedIndex} text='{combo.Text}'");
                foreach (var it in combo.Items) Log("  item: " + it);
                Log($"availability='{avail.Text}'");

                var content = (FrameworkElement)dlg.Content;
                content.Measure(new Size(content.ActualWidth > 0 ? content.ActualWidth : dlg.ActualWidth, double.PositiveInfinity));
                // The visible area is the window's CLIENT rectangle, i.e. the
                // root visual under the Window (its ActualHeight excludes the
                // title bar and borders, which dlg.ActualHeight includes). The
                // button edge is transformed into that same frame, so the two
                // are directly comparable. An earlier version compared the
                // edge against dlg.Content's ActualHeight instead -- that's the
                // StackPanel's own height WITHOUT its 24px Margin, a different
                // frame, and it reported CLIPPED for a dialog whose render
                // plainly showed both buttons inside the window.
                var clientRoot = VisualTreeHelper.GetChildrenCount(dlg) > 0
                    ? VisualTreeHelper.GetChild(dlg, 0) as FrameworkElement : null;
                var clientHeight = clientRoot?.ActualHeight ?? double.NaN;
                var okBottom = ok.TransformToAncestor(dlg).Transform(new Point(0, ok.ActualHeight)).Y;
                Log($"window ActualHeight={dlg.ActualHeight}; client-area height={clientHeight}; content ActualHeight (excl. margin)={content.ActualHeight}; content DesiredHeight (unconstrained, incl. margin)={content.DesiredSize.Height}");
                Log($"Export button bottom edge at y={okBottom} in client coordinates" +
                    (okBottom > clientHeight ? "  <-- CLIPPED (below the visible client area)" : "  (visible)"));

                var rtb = new RenderTargetBitmap(
                    Math.Max(1, (int)dlg.ActualWidth), Math.Max(1, (int)dlg.ActualHeight), 96, 96, PixelFormats.Pbgra32);
                rtb.Render(dlg);
                var encoder = new PngBitmapEncoder();
                encoder.Frames.Add(BitmapFrame.Create(rtb));
                using (var fs = File.Create(outputPngPath))
                    encoder.Save(fs);
                Log("saved png");
                dlg.Close();
                Shutdown(0);
            }
            catch (Exception ex)
            {
                Log("EXCEPTION: " + ex);
                Shutdown(1);
            }
        }

        /// <summary>Self-contained visual smoke test: shows the window off-screen,
        /// pumps the dispatcher long enough for the first debounced preview
        /// round-trip to the Python engine to complete, renders it to a PNG via
        /// RenderTargetBitmap (screen capture is unavailable in this environment),
        /// then exits. Invoke as: GearsGenerator.exe --uismoke out.png</summary>
        private void RunUiSmokeTest(string outputPngPath, int? teethOverride = null, bool exportTest = false,
            double? helixOverride = null, bool bevel = false, bool worm = false, bool rack = false, bool internalGear = false,
            bool herringbone = false, bool screw = false, bool planetary = false, bool cycloidal = false,
            bool cycdrive = false, bool resetTest = false, bool tall = false, bool spiralBevel = false, bool zerol = false,
            bool faceGear = false, bool sprocket = false, bool chainLink = false,
            bool timingWheel = false, bool timingBelt = false, bool hypoid = false)
        {
            string logPath = outputPngPath + ".log";
            var log = new System.Text.StringBuilder();
            void Log(string s) { log.AppendLine(DateTime.Now.ToString("HH:mm:ss.fff") + " " + s); File.WriteAllText(logPath, log.ToString()); }

            try
            {
                Log("start");
                Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(outputPngPath)) ?? ".");

                var win = new MainWindow
                {
                    WindowStartupLocation = WindowStartupLocation.Manual,
                    Left = -5000,
                    Top = -5000,
                    ShowInTaskbar = false,
                };
                // --tall: a window high enough that the whole parameter form
                // (mosaic, reset button, unit toggle, every section) is on
                // screen, so a render shows controls that sit below the fold at
                // the default size.
                if (tall) win.Height = 1500;
                Log("window created");
                win.Show();
                Log("window shown");

                if (bevel)
                    win.Panel.ViewModel.IsBevel = true;
                if (worm)
                    win.Panel.ViewModel.IsWorm = true;
                if (rack)
                    win.Panel.ViewModel.IsRack = true;
                if (internalGear)
                    win.Panel.ViewModel.IsInternal = true;
                if (herringbone)
                    win.Panel.ViewModel.SelectHerringboneCard();
                if (screw)
                    win.Panel.ViewModel.SelectCrossedHelicalCard();
                if (planetary)
                    win.Panel.ViewModel.SelectPlanetaryCard();
                if (cycloidal)
                    win.Panel.ViewModel.SelectCycloidalCard();
                if (cycdrive)
                    win.Panel.ViewModel.SelectCycloidalDriveCard();
                if (spiralBevel)
                    win.Panel.ViewModel.SelectSpiralBevelCard();
                if (zerol)
                    win.Panel.ViewModel.SelectZerolBevelCard();
                if (faceGear)
                    win.Panel.ViewModel.SelectFaceGearCard();
                if (sprocket)
                    win.Panel.ViewModel.SelectSprocketCard();
                if (chainLink)
                    win.Panel.ViewModel.SelectChainLinkCard();
                if (timingWheel)
                    win.Panel.ViewModel.SelectTimingWheelCard();
                if (timingBelt)
                    win.Panel.ViewModel.SelectTimingBeltCard();
                if (hypoid)
                    win.Panel.ViewModel.SelectHypoidCard();
                if (teethOverride.HasValue)
                    win.Panel.ViewModel.Teeth = teethOverride.Value;
                if (helixOverride.HasValue)
                    win.Panel.ViewModel.HelixAngleDeg = helixOverride.Value;

                void PumpFor(int ms)
                {
                    var until = DateTime.UtcNow.AddMilliseconds(ms);
                    while (DateTime.UtcNow < until)
                    {
                        Dispatcher.CurrentDispatcher.Invoke(DispatcherPriority.Background, new Action(() => { }));
                        Thread.Sleep(20);
                    }
                }

                // Let the debounce timer fire and both the fast outline AND the
                // slower mesh round-trip finish. Not a fixed 9 s any more: the
                // Python engine pays its import cost on the first request and
                // a herringbone's two curved sweeps tessellate slower than a
                // spur gear, and a fixed pump rendered "Rebuilding 3D model..."
                // with every derived value still "-". Pump until the view
                // model reports idle with a 3D model in hand, capped at 40 s.
                void PumpUntilIdle()
                {
                    PumpFor(1500); // the 220 ms debounce must fire before "idle" means anything
                    var deadline = DateTime.UtcNow.AddSeconds(40);
                    while (DateTime.UtcNow < deadline)
                    {
                        var vm = win.Panel?.ViewModel;
                        if (vm != null && !vm.IsBusy && !vm.IsMeshBusy && vm.Model3D != null && vm.PreviewGeometry != null)
                            break;
                        PumpFor(100);
                    }
                    PumpFor(300); // one more layout/render pass after the last property change
                }

                PumpUntilIdle();
                // The viewer fits the camera with a 200 ms ZoomExtents animation
                // when the model is replaced; a heavy mesh (the hypoid pair,
                // 4000 feature edges) can arrive in the last pump tick, and the
                // render would catch the camera mid-flight -- zoomed in on a
                // corner of the part. Let it land.
                PumpFor(400);
                var geom = win.Panel?.ViewModel?.PreviewGeometry;
                Log("pumped; StatusMessage=" + win.Panel?.ViewModel?.StatusMessage +
                    "; geom bounds=" + geom?.Bounds + "; geom null=" + (geom == null) +
                    "; Model3D null=" + (win.Panel?.ViewModel?.Model3D == null) +
                    "; IsMeshBusy=" + win.Panel?.ViewModel?.IsMeshBusy +
                    "; feature edges=" + win.Panel?.ViewModel?.EdgeSegmentCount + " segments");
                // The default export file name for this family/parameters --
                // logged so every smoke run also checks the self-describing
                // naming (GearParameters.SuggestedFileName) for that family.
                Log("suggested file name: " + win.Panel?.ViewModel?.SuggestedFileName(".step"));

                if (resetTest)
                {
                    // "Reset <card> to default values": after the overrides above
                    // moved the parameters off the card's defaults, the button
                    // must bring the name (and so every parameter it encodes)
                    // back to exactly what GearParameters.CreateDefaults says
                    // for this card, and the preview must rebuild.
                    var vm = win.Panel.ViewModel;
                    var family = bevel ? GearGen.Geometry.GearFamily.Bevel
                        : worm ? GearGen.Geometry.GearFamily.Worm
                        : rack ? GearGen.Geometry.GearFamily.Rack
                        : internalGear ? GearGen.Geometry.GearFamily.Internal
                        : herringbone ? GearGen.Geometry.GearFamily.Herringbone
                        : screw ? GearGen.Geometry.GearFamily.CrossedHelical
                        : planetary ? GearGen.Geometry.GearFamily.Planetary
                        : cycloidal ? GearGen.Geometry.GearFamily.Cycloidal
                        : cycdrive ? GearGen.Geometry.GearFamily.CycloidalDrive
                        : (spiralBevel || zerol) ? GearGen.Geometry.GearFamily.SpiralBevel
                        : faceGear ? GearGen.Geometry.GearFamily.FaceGear
                        : sprocket ? GearGen.Geometry.GearFamily.Sprocket
                        : chainLink ? GearGen.Geometry.GearFamily.ChainLink
                        : timingWheel ? GearGen.Geometry.GearFamily.TimingWheel
                        : timingBelt ? GearGen.Geometry.GearFamily.TimingBelt
                        : hypoid ? GearGen.Geometry.GearFamily.Hypoid
                        : GearGen.Geometry.GearFamily.Cylindrical;
                    // the card split within a family: a helix for Spur/Helical and Rack/Helical rack, the spiral card for spiral/zerol
                    bool helical = (helixOverride.HasValue && helixOverride.Value > 0) || spiralBevel;
                    string expected = GearGen.Geometry.GearParameters
                        .CreateDefaults(family, helical, GearGen.Geometry.UnitSystem.Metric).SuggestedFileName(".step");
                    Log("reset test: label='" + vm.ResetLabel + "' before=" + vm.SuggestedFileName(".step"));
                    vm.ResetToDefaultsCommand.Execute(null);
                    PumpUntilIdle();
                    PumpFor(400);   // the same camera settle as above, for the render that follows
                    string after = vm.SuggestedFileName(".step");
                    Log("reset test: after=" + after + " expected=" + expected + " -> " +
                        (after == expected && vm.Model3D != null ? "RESET OK" : "RESET MISMATCH") +
                        "; StatusMessage=" + vm.StatusMessage);
                }

                // Force a fresh Measure/Arrange against the final (post-binding-update)
                // geometry -- otherwise the Viewbox can still be holding the scale
                // transform it computed against the initial empty/placeholder geometry.
                win.InvalidateMeasure();
                win.InvalidateArrange();
                win.UpdateLayout();
                win.UpdateLayout();
                var rtb = new RenderTargetBitmap(
                    Math.Max(1, (int)win.ActualWidth), Math.Max(1, (int)win.ActualHeight), 96, 96, PixelFormats.Pbgra32);
                rtb.Render(win);
                Log($"rendered {win.ActualWidth}x{win.ActualHeight}");

                var encoder = new PngBitmapEncoder();
                encoder.Frames.Add(BitmapFrame.Create(rtb));
                using (var fs = File.Create(outputPngPath))
                    encoder.Save(fs);
                Log("saved png");

                if (exportTest)
                {
                    string stepOut = outputPngPath + ".export-test.step";
                    string dxfOut = outputPngPath + ".export-test.dxf";
                    bool stepDone = false, dxfDone = false;
                    string stepErr = null, dxfErr = null;

                    win.Panel.ViewModel.DoExportStepAsync(stepOut)
                        .ContinueWith(t => { stepErr = t.Exception?.InnerException?.Message; stepDone = true; });
                    // 180 s, not 30: the hypoid pair is generated at export quality
                    // (240 sweep positions x 8 stations, ~55 s alone, longer with
                    // other work on the machine); the face gear's 25 s fitted the old
                    // cap and hid that this wait was a cap at all -- "done=False" with
                    // an empty error is what an expired wait looks like.
                    var untilStep = DateTime.UtcNow.AddSeconds(180);
                    while (!stepDone && DateTime.UtcNow < untilStep) PumpFor(100);
                    Log("STEP export done=" + stepDone + " err=" + stepErr + " exists=" + File.Exists(stepOut) +
                        " size=" + (File.Exists(stepOut) ? new FileInfo(stepOut).Length : -1));

                    win.Panel.ViewModel.DoExportDxfAsync(dxfOut)
                        .ContinueWith(t => { dxfErr = t.Exception?.InnerException?.Message; dxfDone = true; });
                    var untilDxf = DateTime.UtcNow.AddSeconds(30);
                    while (!dxfDone && DateTime.UtcNow < untilDxf) PumpFor(100);
                    Log("DXF export done=" + dxfDone + " err=" + dxfErr + " exists=" + File.Exists(dxfOut) +
                        " size=" + (File.Exists(dxfOut) ? new FileInfo(dxfOut).Length : -1));
                }

                win.Close();
                Shutdown(0);
            }
            catch (Exception ex)
            {
                Log("EXCEPTION: " + ex);
                Shutdown(1);
            }
        }

        protected override void OnExit(ExitEventArgs e)
        {
            Engine?.Dispose();
            base.OnExit(e);
        }
    }
}
