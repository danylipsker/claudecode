using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Media3D;
using System.Windows.Threading;
using GearGen.Geometry;
using GearGen.PyEngine;
using WpfGeometry = System.Windows.Media.Geometry;

namespace GearGen.UI
{
    public class GearViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnChanged([CallerMemberName] string name = null) =>
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));

        private readonly PyGearEngine _engine;
        private readonly DispatcherTimer _debounce;
        private readonly GearParameters _p = new GearParameters();

        public GearViewModel(PyGearEngine engine)
        {
            _engine = engine;
            _debounce = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(220) };
            _debounce.Tick += async (s, e) => { _debounce.Stop(); await RefreshPreviewAsync(); };

            ExportSolidWorksCommand = new RelayCommand(async _ => await ExportSolidWorksAsync(), _ => SolidWorksExportAsync != null);
            SetPressureAnglePresetCommand = new RelayCommand(v => PressureAngleDeg = Convert.ToDouble(v, CultureInfo.InvariantCulture));

            ScheduleRefresh();
        }

        // ---- host integration -------------------------------------------------

        /// <summary>Set by the host (standalone app or SolidWorks add-in) to
        /// actually perform the SolidWorks part-creation step. Takes the
        /// current parameters and a freshly generated STEP file path; returns
        /// a human-readable result message.</summary>
        public Func<GearParameters, string, Task<string>> SolidWorksExportAsync { get; set; }

        private string _solidWorksActionLabel = "Export to SolidWorks (.sldprt)";
        public string SolidWorksActionLabel
        {
            get => _solidWorksActionLabel;
            set { _solidWorksActionLabel = value; OnChanged(); }
        }

        // ---- unit system --------------------------------------------------

        public bool IsInch
        {
            get => _p.Unit == UnitSystem.Inch;
            set { _p.Unit = value ? UnitSystem.Inch : UnitSystem.Metric; OnChanged(); OnChanged(nameof(IsMetric)); OnChanged(nameof(ModuleOrDpLabel)); OnChanged(nameof(LengthSuffix)); RefreshDisplayFromModel(); ScheduleRefresh(); }
        }
        public bool IsMetric { get => !IsInch; set => IsInch = !value; }

        public string ModuleOrDpLabel =>
            (IsInch ? "Diametral pitch" : "Module") + (IsBevel ? " (outer/heel)" : IsWorm ? " (axial)" : "");
        public string FaceWidthLabel => IsWorm ? "Threaded length" : "Face width";
        public string BoreOrHoleLabel => IsRack ? "Mounting hole diameter (0 = none)" : "Bore diameter (0 = none)";
        public string LengthSuffix => IsInch ? "in" : "mm";

        // ---- gear family (cylindrical vs bevel) -----------------------------

        public bool IsCylindrical
        {
            get => _p.Family == GearFamily.Cylindrical;
            set { if (value) { _p.Family = GearFamily.Cylindrical; OnChanged(); FamilyChanged(); } }
        }
        public bool IsBevel
        {
            get => _p.Family == GearFamily.Bevel;
            set { if (value) { _p.Family = GearFamily.Bevel; OnChanged(); FamilyChanged(); } }
        }
        public bool IsWorm
        {
            get => _p.Family == GearFamily.Worm;
            set { if (value) { _p.Family = GearFamily.Worm; OnChanged(); FamilyChanged(); } }
        }
        public bool IsNotWorm => !IsWorm;
        public bool IsRack
        {
            get => _p.Family == GearFamily.Rack;
            set { if (value) { _p.Family = GearFamily.Rack; OnChanged(); FamilyChanged(); } }
        }
        public bool IsInternal
        {
            get => _p.Family == GearFamily.Internal;
            set { if (value) { _p.Family = GearFamily.Internal; OnChanged(); FamilyChanged(); } }
        }
        /// <summary>An internal gear has no separate "bore" -- its whole
        /// inner region already IS the toothed hole -- so the generic bore
        /// spinner is hidden for it entirely (rather than shown but silently
        /// ignored: server.py's internal_params_from_request doesn't even
        /// read a bore_diameter_mm field).</summary>
        public bool IsNotInternal => !IsInternal;
        public bool IsHerringbone
        {
            get => _p.Family == GearFamily.Herringbone;
            set { if (value) { _p.Family = GearFamily.Herringbone; OnChanged(); FamilyChanged(); } }
        }
        /// <summary>The HELIX section serves the cylindrical family (where
        /// 0deg means spur), the herringbone (each half's helix, must be
        /// nonzero) and the rack (0deg = straight rack, else a helical rack,
        /// docs/gear-math.md 10.4) -- one section, three headers.</summary>
        public bool ShowHelixSection => IsCylindrical || IsHerringbone || IsRack;
        public string HelixSectionHeader =>
            IsHerringbone ? "HELIX (each half)" : IsRack ? "HELIX (0° = straight rack)" : "HELIX (0° = spur gear)";

        /// <summary>Rack and Helical rack are separate cards over one
        /// GearFamily.Rack, split by HelixAngleDeg -- the same arrangement
        /// as the Spur/Helical cards over GearFamily.Cylindrical.</summary>
        public bool IsRackStraight => IsRack && !IsHelical;
        public bool IsRackHelical => IsRack && IsHelical;

        private void FamilyChanged()
        {
            OnChanged(nameof(IsCylindrical));
            OnChanged(nameof(IsBevel));
            OnChanged(nameof(IsWorm));
            OnChanged(nameof(IsNotWorm));
            OnChanged(nameof(IsRack));
            OnChanged(nameof(IsInternal));
            OnChanged(nameof(IsNotInternal));
            OnChanged(nameof(IsHerringbone));
            OnChanged(nameof(ShowHelixSection));
            OnChanged(nameof(HelixSectionHeader));
            OnChanged(nameof(IsRackStraight));
            OnChanged(nameof(IsRackHelical));
            OnChanged(nameof(IsCylindricalSpur));
            OnChanged(nameof(IsCylindricalHelical));
            OnChanged(nameof(ModuleOrDpLabel));
            OnChanged(nameof(FaceWidthLabel));
            OnChanged(nameof(BoreOrHoleLabel));
            ScheduleRefresh();
        }

        public void SelectWormCard()
        {
            IsWorm = true;
        }

        /// <summary>The Rack card is the straight rack: force the helix back
        /// to 0 (same reasoning as SelectSpurCard), and the Helical rack
        /// card jumps to a visibly inclined default from 0 (as SelectHelicalCard).</summary>
        public void SelectRackCard()
        {
            IsRack = true;
            HelixAngleDeg = 0.0;
        }

        public void SelectHelicalRackCard()
        {
            IsRack = true;
            if (!IsHelical) HelixAngleDeg = 20.0;
        }

        public void SelectInternalCard()
        {
            IsInternal = true;
        }

        /// <summary>A herringbone with a 0deg helix is a spur gear, so picking
        /// the card from a spur state jumps to a visibly V-shaped default
        /// (30deg) -- same reasoning as SelectHelicalCard's 25deg.</summary>
        public void SelectHerringboneCard()
        {
            IsHerringbone = true;
            if (!IsHelical) HelixAngleDeg = 30.0;
        }

        // ---- double-helical / herringbone (docs/gear-math.md section 7.4) -- Family == Herringbone only ----

        public double GapWidthDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.GapWidthMm) : _p.GapWidthMm;
            set { _p.GapWidthMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        // ---- worm (docs/gear-math.md section 9) -- Family == Worm only ------

        public int WormStarts
        {
            get => _p.WormStarts;
            set { _p.WormStarts = Math.Max(1, Math.Min(10, value)); OnChanged(); ScheduleRefresh(); }
        }

        public double PitchDiameterDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.PitchDiameterMm) : _p.PitchDiameterMm;
            set { _p.PitchDiameterMm = Math.Max(0.5, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        // ---- rack (docs/gear-math.md section 10) -- Family == Rack only -----

        public double BackingHeightDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.BackingHeightMm) : _p.BackingHeightMm;
            set { _p.BackingHeightMm = Math.Max(0.5, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        // ---- internal / ring gear (docs/gear-math.md section 11) -- Family == Internal only ----

        public int CutterTeeth
        {
            // 0 = let the Python engine pick a default (max(8, z/2)) -- a
            // construction parameter only, not a property of the finished
            // ring (the fundamental law of gearing guarantees the generated
            // flank doesn't depend on it).
            get => _p.CutterTeeth;
            set { _p.CutterTeeth = Math.Max(0, value); OnChanged(); ScheduleRefresh(); }
        }

        public double RimThicknessDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.RimThicknessMm) : _p.RimThicknessMm;
            set { _p.RimThicknessMm = Math.Max(0.5, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        /// <summary>The gear-family mosaic shows Spur and Helical as separate
        /// cards even though both are GearFamily.Cylindrical underneath
        /// (distinguished by HelixAngleDeg) -- these two just add that split
        /// for the card selection, they don't add a new underlying state.</summary>
        public bool IsCylindricalSpur => IsCylindrical && !IsHelical;
        public bool IsCylindricalHelical => IsCylindrical && IsHelical;

        /// <summary>Picking the Helical card when already at 0deg jumps to a
        /// visibly-helical default (25deg) so the user immediately sees a
        /// twisted gear, not a spur gear pretending to be the "helical" card.</summary>
        public void SelectHelicalCard()
        {
            IsCylindrical = true;
            if (!IsHelical) HelixAngleDeg = 25.0;
        }

        /// <summary>Picking the Spur card forces the helix angle back to 0 --
        /// otherwise "Spur" selected while HelixAngleDeg is still nonzero
        /// (from having just been on the Helical card) would show a twisted
        /// gear under the "Spur" label.</summary>
        public void SelectSpurCard()
        {
            IsCylindrical = true;
            HelixAngleDeg = 0.0;
        }

        public int MateTeeth
        {
            // 0 is allowed (meaning "skip" for a worm's center-distance info,
            // where there's no separate mate gear being built); for bevel,
            // where this drives the pitch-angle calculation, 0 lands on the
            // degenerate 90deg "crown gear" limit -- already caught and
            // explained by bevel_derived_values' own warning, not a crash.
            get => _p.MateTeeth;
            set { _p.MateTeeth = Math.Max(0, value); OnChanged(); ScheduleRefresh(); }
        }

        public double ShaftAngleDeg
        {
            get => _p.ShaftAngleDeg;
            set { _p.ShaftAngleDeg = Clamp(value, 10, 170); OnChanged(); ScheduleRefresh(); }
        }

        // ---- basic parameters ----------------------------------------------

        /// <summary>Default export file name describing the current part --
        /// family plus every geometry-determining property (see
        /// GearParameters.SuggestedFileName). Used by every save dialog so
        /// STEP, DXF and SLDPRT of the same part share one self-describing stem.</summary>
        public string SuggestedFileName(string extension) => _p.SuggestedFileName(extension);

        public int Teeth
        {
            get => _p.Teeth;
            set { _p.Teeth = Math.Max(4, value); OnChanged(); ScheduleRefresh(); }
        }

        public double ModuleMm
        {
            get => _p.ModuleMm;
            set { _p.ModuleMm = Math.Max(0.01, value); OnChanged(); ScheduleRefresh(); }
        }

        public double DiametralPitch
        {
            get => _p.DiametralPitch;
            set { _p.DiametralPitch = Math.Max(0.1, value); OnChanged(); ScheduleRefresh(); }
        }

        /// <summary>Single field the UI actually shows for "module / DP",
        /// switching meaning (and default step) with the unit system.</summary>
        public double ModuleOrDp
        {
            get => IsInch ? DiametralPitch : ModuleMm;
            set { if (IsInch) DiametralPitch = value; else ModuleMm = value; }
        }

        public double PressureAngleDeg
        {
            get => _p.PressureAngleDeg;
            set { _p.PressureAngleDeg = Clamp(value, 5, 45); OnChanged(); ScheduleRefresh(); }
        }

        public double ProfileShift
        {
            get => _p.ProfileShift;
            set { _p.ProfileShift = Clamp(value, -1.0, 1.0); OnChanged(); ScheduleRefresh(); }
        }

        public double AddendumCoeff
        {
            get => _p.AddendumCoeff;
            set { _p.AddendumCoeff = Clamp(value, 0.1, 2.0); OnChanged(); ScheduleRefresh(); }
        }

        public double DedendumCoeff
        {
            get => _p.DedendumCoeff;
            set { _p.DedendumCoeff = Clamp(value, 0.1, 3.0); OnChanged(); ScheduleRefresh(); }
        }

        public double RootFilletCoeff
        {
            get => _p.RootFilletCoeff;
            set { _p.RootFilletCoeff = Clamp(value, 0.0, 0.8); OnChanged(); ScheduleRefresh(); }
        }

        public double FaceWidthDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.FaceWidthMm) : _p.FaceWidthMm;
            set { _p.FaceWidthMm = Math.Max(0.1, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        public double BacklashDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.BacklashMm) : _p.BacklashMm;
            set { _p.BacklashMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        public double BoreDiameterDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.BoreDiameterMm) : _p.BoreDiameterMm;
            set { _p.BoreDiameterMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        // ---- helical (docs/gear-math.md section 7) ---------------------------

        public double HelixAngleDeg
        {
            get => _p.HelixAngleDeg;
            set
            {
                _p.HelixAngleDeg = Clamp(value, 0, 45); OnChanged();
                OnChanged(nameof(IsHelical));
                OnChanged(nameof(IsCylindricalSpur));
                OnChanged(nameof(IsCylindricalHelical));
                OnChanged(nameof(IsRackStraight));
                OnChanged(nameof(IsRackHelical));
                ScheduleRefresh();
            }
        }

        public bool IsHelical => _p.IsHelical;

        public bool IsRightHand
        {
            get => _p.Hand != "left";
            set { if (value) { _p.Hand = "right"; OnChanged(); OnChanged(nameof(IsLeftHand)); ScheduleRefresh(); } }
        }
        public bool IsLeftHand
        {
            get => _p.Hand == "left";
            set { if (value) { _p.Hand = "left"; OnChanged(); OnChanged(nameof(IsRightHand)); ScheduleRefresh(); } }
        }

        private static double Clamp(double v, double lo, double hi) => v < lo ? lo : (v > hi ? hi : v);

        private void RefreshDisplayFromModel()
        {
            OnChanged(nameof(ModuleOrDp));
            OnChanged(nameof(FaceWidthDisplay));
            OnChanged(nameof(BacklashDisplay));
            OnChanged(nameof(BoreDiameterDisplay));
            OnChanged(nameof(PitchDiameterDisplay));
            OnChanged(nameof(BackingHeightDisplay));
            OnChanged(nameof(RimThicknessDisplay));
            OnChanged(nameof(GapWidthDisplay));
        }

        // ---- preview / derived values ---------------------------------------

        private WpfGeometry _previewGeometry;
        public WpfGeometry PreviewGeometry
        {
            get => _previewGeometry;
            private set { _previewGeometry = value; OnChanged(); }
        }

        // ---- 3D model (the actual solid, tessellated -- see GetMeshStlPathAsync) ----

        private Model3DGroup _model3D;
        public Model3DGroup Model3D
        {
            get => _model3D;
            private set { _model3D = value; OnChanged(); }
        }

        private bool _isMeshBusy;
        public bool IsMeshBusy { get => _isMeshBusy; private set { _isMeshBusy = value; OnChanged(); } }

        /// <summary>Raised after Model3D is replaced, so the view can zoom-to-fit
        /// the new geometry (a bore, a big twist, or a very different gear size
        /// changes the model's bounds every time, unlike a fixed-size scene).</summary>
        public event Action ModelReplaced;

        private int _meshGeneration;

        private async Task RefreshMeshAsync()
        {
            int myGen = ++_meshGeneration;
            IsMeshBusy = true;
            try
            {
                string stlPath = await _engine.GetMeshStlPathAsync(_p).ConfigureAwait(true);
                if (myGen != _meshGeneration) return; // superseded by a newer parameter change

                var reader = new HelixToolkit.Wpf.StLReader();
                Model3DGroup loaded;
                using (var stream = File.OpenRead(stlPath))
                    loaded = reader.Read(stream);

                foreach (var child in loaded.Children)
                {
                    if (child is GeometryModel3D gm)
                    {
                        gm.Material = GearMaterial;
                        gm.BackMaterial = GearMaterial;
                    }
                }
                loaded.Freeze();

                if (myGen != _meshGeneration) return;
                Model3D = loaded;
                ModelReplaced?.Invoke();

                try { File.Delete(stlPath); } catch { /* best effort */ }
            }
            catch (Exception ex)
            {
                if (myGen != _meshGeneration) return;
                IsError = true;
                StatusMessage = "3D preview error: " + ex.Message;
            }
            finally
            {
                if (myGen == _meshGeneration) IsMeshBusy = false;
            }
        }

        private static readonly Material GearMaterial = BuildGearMaterial();

        private static Material BuildGearMaterial()
        {
            var diffuse = new DiffuseMaterial(new SolidColorBrush(Color.FromRgb(0x93, 0xC5, 0xFD)));
            var specular = new SpecularMaterial(new SolidColorBrush(Color.FromRgb(0xE5, 0xE7, 0xEB)), 60);
            var group = new MaterialGroup();
            group.Children.Add(diffuse);
            group.Children.Add(specular);
            group.Freeze();
            return group;
        }

        private bool _isBusy;
        public bool IsBusy { get => _isBusy; private set { _isBusy = value; OnChanged(); } }

        private string _statusMessage = "Ready.";
        public string StatusMessage { get => _statusMessage; private set { _statusMessage = value; OnChanged(); } }

        private bool _isError;
        public bool IsError { get => _isError; private set { _isError = value; OnChanged(); } }

        public ObservableCollection<string> Warnings { get; } = new ObservableCollection<string>();
        public bool HasWarnings => Warnings.Count > 0;

        private string _pitchDiaText = "-", _baseDiaText = "-", _addDiaText = "-", _dedDiaText = "-", _thickText = "-", _moduleDpText = "-";
        public string PitchDiameterText { get => _pitchDiaText; private set { _pitchDiaText = value; OnChanged(); } }
        public string BaseDiameterText { get => _baseDiaText; private set { _baseDiaText = value; OnChanged(); } }
        public string AddendumDiameterText { get => _addDiaText; private set { _addDiaText = value; OnChanged(); } }
        public string DedendumDiameterText { get => _dedDiaText; private set { _dedDiaText = value; OnChanged(); } }
        public string ToothThicknessText { get => _thickText; private set { _thickText = value; OnChanged(); } }
        public string ModuleOrDpEquivalentText { get => _moduleDpText; private set { _moduleDpText = value; OnChanged(); } }

        private string _transverseModuleText = "-", _leadText = "-", _twistText = "-";
        public string TransverseModuleText { get => _transverseModuleText; private set { _transverseModuleText = value; OnChanged(); } }
        public string LeadText { get => _leadText; private set { _leadText = value; OnChanged(); } }
        public string TwistText { get => _twistText; private set { _twistText = value; OnChanged(); } }

        private string _pitchAngleText = "-", _coneDistanceText = "-", _zVirtualText = "-";
        public string PitchAngleText { get => _pitchAngleText; private set { _pitchAngleText = value; OnChanged(); } }
        public string ConeDistanceText { get => _coneDistanceText; private set { _coneDistanceText = value; OnChanged(); } }
        public string ZVirtualText { get => _zVirtualText; private set { _zVirtualText = value; OnChanged(); } }

        private string _leadAngleText = "-", _centerDistanceText = "-", _wheelHintText = "-";
        public string LeadAngleText { get => _leadAngleText; private set { _leadAngleText = value; OnChanged(); } }
        public string CenterDistanceText { get => _centerDistanceText; private set { _centerDistanceText = value; OnChanged(); } }
        /// <summary>What to plug into the Helical card to build the matching
        /// wheel -- there's no separate "worm wheel" mode (see class remarks
        /// on WormStarts): the wheel IS just a helical gear with these values.</summary>
        public string WheelHintText { get => _wheelHintText; private set { _wheelHintText = value; OnChanged(); } }

        private string _circularPitchText = "-", _totalLengthText = "-", _addendumHeightText = "-", _dedendumHeightText = "-";
        public string CircularPitchText { get => _circularPitchText; private set { _circularPitchText = value; OnChanged(); } }
        public string TotalLengthText { get => _totalLengthText; private set { _totalLengthText = value; OnChanged(); } }
        public string AddendumHeightText { get => _addendumHeightText; private set { _addendumHeightText = value; OnChanged(); } }
        public string DedendumHeightText { get => _dedendumHeightText; private set { _dedendumHeightText = value; OnChanged(); } }

        private string _outerDiameterText = "-", _cutterTeethText = "-";
        public string OuterDiameterText { get => _outerDiameterText; private set { _outerDiameterText = value; OnChanged(); } }
        public string CutterTeethText { get => _cutterTeethText; private set { _cutterTeethText = value; OnChanged(); } }

        private void ScheduleRefresh()
        {
            _debounce.Stop();
            _debounce.Start();
        }

        private int _refreshGeneration;

        public async Task RefreshPreviewAsync()
        {
            int myGen = ++_refreshGeneration;
            IsBusy = true;
            // Fire-and-track the (slower) real-solid mesh fetch alongside the fast
            // outline call below, rather than after it -- the 3D viewer and the
            // derived-values panel update independently, each as soon as its own
            // data is ready, instead of the 3D view waiting on two round-trips.
            _ = RefreshMeshAsync();
            try
            {
                var result = await _engine.GetOutlineAsync(_p).ConfigureAwait(true);
                if (myGen != _refreshGeneration) return; // a newer request superseded this one

                PreviewGeometry = BuildGeometry(result);

                Warnings.Clear();
                foreach (var w in result.Warnings) Warnings.Add(w);
                OnChanged(nameof(HasWarnings));

                double dv(string k) => result.Derived.TryGetValue(k, out var v) ? v : 0;
                string L(double mm) => IsInch ? $"{UnitConversion.MmToInch(mm):0.####} in" : $"{mm:0.###} mm";

                if (IsBevel)
                {
                    // bevel_derived_values (server.py) returns a different key
                    // set entirely -- no base circle / tooth thickness / DP
                    // equivalent exposed, so those stay at their "-" default.
                    PitchDiameterText = L(dv("heel_pitch_diameter_mm"));
                    AddendumDiameterText = L(dv("heel_addendum_diameter_mm"));
                    DedendumDiameterText = L(dv("heel_dedendum_diameter_mm"));
                    PitchAngleText = $"{dv("pitch_angle_deg"):0.##}°";
                    ConeDistanceText = L(dv("outer_cone_distance_mm"));
                    ZVirtualText = dv("z_virtual").ToString("0.##");
                }
                else if (IsWorm)
                {
                    // worm_derived_values (server.py) returns yet another key
                    // set -- base circle / tooth thickness / DP equivalent
                    // stay at "-" here too, same reasoning as bevel above.
                    PitchDiameterText = L(dv("pitch_diameter_mm"));
                    AddendumDiameterText = L(dv("addendum_diameter_mm"));
                    DedendumDiameterText = L(dv("dedendum_diameter_mm"));
                    LeadText = L(dv("lead_mm"));
                    LeadAngleText = $"{dv("lead_angle_deg"):0.##}°";
                    CenterDistanceText = MateTeeth > 0 ? L(dv("center_distance_mm")) : "set wheel teeth";
                    WheelHintText = $"module {L(dv("wheel_module_mm"))}, helix {dv("wheel_helix_angle_deg"):0.##}°, {(_p.Hand == "left" ? "left" : "right")}-hand";
                }
                else if (IsRack)
                {
                    // rack_derived_values (server.py) returns yet another key
                    // set -- pitch/base/addendum/dedendum DIAMETER genuinely
                    // don't apply to a straight rack (infinite radius), so
                    // explicitly blanked rather than left showing a stale
                    // value from whatever family was selected before.
                    PitchDiameterText = "-";
                    BaseDiameterText = "-";
                    AddendumDiameterText = "-";
                    DedendumDiameterText = "-";
                    ToothThicknessText = L(dv("circular_tooth_thickness_mm"));
                    CircularPitchText = L(dv("circular_pitch_mm"));
                    AddendumHeightText = L(dv("addendum_height_mm"));
                    DedendumHeightText = L(dv("dedendum_height_mm"));
                    TotalLengthText = L(dv("total_length_mm"));
                    if (IsHelical)
                    {
                        // The shared helical block (transverse module / lead /
                        // twist) is visible whenever HelixAngleDeg > 0; a rack has
                        // no lead or twist, so say what applies instead.
                        TransverseModuleText = $"{L(dv("transverse_module_mm"))} ({dv("transverse_pressure_angle_deg"):0.##}° PA)";
                        LeadText = $"normal pitch {L(dv("normal_pitch_mm"))}, thickness {L(dv("normal_tooth_thickness_mm"))}";
                        TwistText = $"teeth at {dv("helix_angle_deg"):0.##}° to the face";
                    }
                }
                else if (IsInternal)
                {
                    PitchDiameterText = L(dv("pitch_diameter_mm"));
                    BaseDiameterText = L(dv("base_diameter_mm"));
                    AddendumDiameterText = L(dv("addendum_diameter_mm"));
                    DedendumDiameterText = L(dv("dedendum_diameter_mm"));
                    OuterDiameterText = L(dv("outer_diameter_mm"));
                    CutterTeethText = dv("cutter_teeth").ToString("0");
                    CenterDistanceText = MateTeeth > 0 ? L(dv("center_distance_mm")) : "set pinion teeth";
                }
                else
                {
                    PitchDiameterText = L(dv("pitch_diameter_mm"));
                    BaseDiameterText = L(dv("base_diameter_mm"));
                    AddendumDiameterText = L(dv("addendum_diameter_mm"));
                    DedendumDiameterText = L(dv("dedendum_diameter_mm"));
                    ToothThicknessText = L(dv("circular_tooth_thickness_mm"));
                    ModuleOrDpEquivalentText = IsInch
                        ? $"module {dv("module_mm"):0.####} mm"
                        : $"DP {dv("diametral_pitch"):0.###} /in";

                    if (IsHelical)
                    {
                        TransverseModuleText = $"{L(dv("transverse_module_mm"))} ({dv("transverse_pressure_angle_deg"):0.##}° PA)";
                        LeadText = L(dv("lead_mm"));
                        // herringbone_derived_values (server.py) adds the per-half
                        // twist the build actually uses; the whole-face figure
                        // would describe a gear that doesn't exist.
                        TwistText = IsHerringbone
                            ? $"{dv("twist_per_half_deg"):0.##}° per half, V apex at mid-face"
                            : $"{dv("twist_total_deg"):0.##}° across face width";
                    }
                }

                IsError = false;
                StatusMessage = "Ready.";
            }
            catch (Exception ex)
            {
                if (myGen != _refreshGeneration) return;
                IsError = true;
                StatusMessage = "Preview error: " + ex.Message;
            }
            finally
            {
                if (myGen == _refreshGeneration) IsBusy = false;
            }
        }

        private static WpfGeometry BuildGeometry(OutlineResult result)
        {
            if (result.Points.Count < 3) return WpfGeometry.Empty;
            var figure = new PathFigure { IsClosed = true, IsFilled = true };
            // flip Y: math frame is Y-up, WPF drawing is Y-down
            figure.StartPoint = new Point(result.Points[0].X, -result.Points[0].Y);
            for (int i = 1; i < result.Points.Count; i++)
                figure.Segments.Add(new LineSegment(new Point(result.Points[i].X, -result.Points[i].Y), true));
            var pg = new PathGeometry();
            pg.Figures.Add(figure);
            pg.Freeze();
            return pg;
        }

        // ---- export ---------------------------------------------------------

        public RelayCommand ExportSolidWorksCommand { get; }
        public RelayCommand SetPressureAnglePresetCommand { get; }

        /// <summary>The view (code-behind) owns file-save dialogs and calls
        /// these directly -- keeping file-picker UI out of the ViewModel.</summary>
        public async Task<string> DoExportStepAsync(string path)
        {
            IsBusy = true;
            StatusMessage = "Exporting STEP...";
            try
            {
                var result = await _engine.ExportStepAsync(_p, path).ConfigureAwait(true);
                StatusMessage = $"STEP exported: {Path.GetFileName(result)}";
                IsError = false;
                return result;
            }
            catch (Exception ex)
            {
                IsError = true;
                StatusMessage = "STEP export failed: " + ex.Message;
                throw;
            }
            finally { IsBusy = false; }
        }

        public async Task<string> DoExportDxfAsync(string path)
        {
            IsBusy = true;
            StatusMessage = "Exporting DXF...";
            try
            {
                var result = await _engine.ExportDxfAsync(_p, path).ConfigureAwait(true);
                StatusMessage = $"DXF exported: {Path.GetFileName(result)}";
                IsError = false;
                return result;
            }
            catch (Exception ex)
            {
                IsError = true;
                StatusMessage = "DXF export failed: " + ex.Message;
                throw;
            }
            finally { IsBusy = false; }
        }

        private async Task ExportSolidWorksAsync()
        {
            if (SolidWorksExportAsync == null) return;
            IsBusy = true;
            StatusMessage = "Building STEP for SolidWorks...";
            IsError = false;
            try
            {
                string tempStep = Path.Combine(Path.GetTempPath(), $"geargen_{Guid.NewGuid():N}.step");
                await _engine.ExportStepAsync(_p, tempStep).ConfigureAwait(true);

                StatusMessage = "Talking to SolidWorks...";
                string message = await SolidWorksExportAsync(_p.Clone(), tempStep).ConfigureAwait(true);
                StatusMessage = message ?? "Done.";

                try { File.Delete(tempStep); } catch { /* best effort */ }
            }
            catch (Exception ex)
            {
                IsError = true;
                StatusMessage = "SolidWorks export failed: " + ex.Message;
            }
            finally
            {
                IsBusy = false;
            }
        }

        public GearParameters SnapshotParameters() => _p.Clone();
    }
}
