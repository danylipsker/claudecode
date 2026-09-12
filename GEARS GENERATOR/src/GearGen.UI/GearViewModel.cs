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
            ResetToDefaultsCommand = new RelayCommand(_ => ResetToDefaults());

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
            (IsInch ? "Diametral pitch" : "Module") + ((IsAnyBevel || IsHypoid) ? " (outer/heel)" : (IsWorm || IsGloboidWorm) ? " (axial, at the throat)" : "");
        public string FaceWidthLabel => IsWorm ? "Threaded length" : IsTimingBelt ? "Belt width" : "Face width";
        public string BoreOrHoleLabel =>
            IsRack ? "Mounting hole diameter (0 = none)"
            : IsCycloidalDrive ? "Eccentric bearing bore (0 = none)"
            : "Bore diameter (0 = none)";
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
        /// <summary>A chain link has no bore, teeth, or face-width concept
        /// of its own -- every dimension comes from the chain itself.</summary>
        public bool ShowBoreField => !IsInternal && !IsChainLink && !IsTimingBelt;
        public bool ShowFaceWidthField => !IsChainLink;
        public bool HasTeethField => !IsWorm && !IsChainLink && !IsTimingBelt && !IsGloboidWorm;
        /// <summary>The globoid worm's length follows from the wrap and its
        /// wheel's face width from the throat; neither is typed in.</summary>
        public bool HasFaceWidthSpinner => !IsGloboidWorm;
        public bool IsHerringbone
        {
            get => _p.Family == GearFamily.Herringbone;
            set { if (value) { _p.Family = GearFamily.Herringbone; OnChanged(); FamilyChanged(); } }
        }
        /// <summary>The HELIX section serves the cylindrical family (where
        /// 0deg means spur), the herringbone (each half's helix, must be
        /// nonzero) and the rack (0deg = straight rack, else a helical rack,
        /// docs/gear-math.md 10.4) -- one section, three headers.</summary>
        public bool ShowHelixSection => IsCylindrical || IsHerringbone || IsRack || IsCrossedHelical;
        public string HelixSectionHeader =>
            IsHerringbone ? "HELIX (each half)"
            : IsRack ? "HELIX (0° = straight rack)"
            : IsCrossedHelical ? "HELIX (gear 1; gear 2's follows from the shaft angle)"
            : "HELIX (0° = spur gear)";

        public bool IsCrossedHelical
        {
            get => _p.Family == GearFamily.CrossedHelical;
            set { if (value) { _p.Family = GearFamily.CrossedHelical; OnChanged(); FamilyChanged(); } }
        }
        public bool IsPlanetary
        {
            get => _p.Family == GearFamily.Planetary;
            set { if (value) { _p.Family = GearFamily.Planetary; OnChanged(); FamilyChanged(); } }
        }
        public bool IsCycloidal
        {
            get => _p.Family == GearFamily.Cycloidal;
            set { if (value) { _p.Family = GearFamily.Cycloidal; OnChanged(); FamilyChanged(); } }
        }
        /// <summary>"Has a pressure angle": a cycloidal gear's flanks are
        /// traced by a rolling circle (docs/gear-math.md 14) and a cycloidal
        /// drive's by its rollers (15), so the pressure-angle block is hidden
        /// for both rather than shown and ignored.</summary>
        public bool IsNotCycloidal => !IsCycloidal && !IsCycloidalDrive && !IsSprocket && !IsChainLink && !IsTimingWheel && !IsTimingBelt;

        public bool IsCycloidalDrive
        {
            get => _p.Family == GearFamily.CycloidalDrive;
            set { if (value) { _p.Family = GearFamily.CycloidalDrive; OnChanged(); FamilyChanged(); } }
        }

        // ---- face gear (docs/gear-math.md section 17) -- Family == FaceGear only ----

        public bool IsFaceGear
        {
            get => _p.Family == GearFamily.FaceGear;
            set { if (value) { _p.Family = GearFamily.FaceGear; OnChanged(); FamilyChanged(); } }
        }

        public double FaceInnerRadiusDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.FaceInnerRadiusMm) : _p.FaceInnerRadiusMm;
            set { _p.FaceInnerRadiusMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }
        public double FaceOuterRadiusDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.FaceOuterRadiusMm) : _p.FaceOuterRadiusMm;
            set { _p.FaceOuterRadiusMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        /// <summary>A 40/20 face gear: the pinion count comes from MateTeeth
        /// (shared with the other "mate" meanings), the shaper from
        /// CutterTeeth (shared with the internal gear's construction count,
        /// 0 = default in both).</summary>
        public void SelectFaceGearCard()
        {
            IsFaceGear = true;
            HelixAngleDeg = 0.0;
            if (MateTeeth < 4) MateTeeth = 20;
            if (Teeth <= MateTeeth) Teeth = 2 * MateTeeth;
        }

        private string _faceGearText = "-", _faceRingText = "-", _faceLimitsText = "-";
        public string FaceGearText { get => _faceGearText; private set { _faceGearText = value; OnChanged(); } }
        public string FaceRingText { get => _faceRingText; private set { _faceRingText = value; OnChanged(); } }
        public string FaceLimitsText { get => _faceLimitsText; private set { _faceLimitsText = value; OnChanged(); } }

        // ---- sprocket (docs/gear-math.md section 18) -- Family == Sprocket only ----

        public bool IsSprocket
        {
            get => _p.Family == GearFamily.Sprocket;
            set { if (value) { _p.Family = GearFamily.Sprocket; OnChanged(); FamilyChanged(); } }
        }

        /// <summary>ANSI B29.1 standard single-strand chain: (pitch_in,
        /// max_roller_diameter_in) -- the C# side's own copy of
        /// sprocket.py's ANSI_CHAIN_TABLE_IN, kept identical so the combo
        /// box's choice matches what the geometry engine assumes for the
        /// same chain number.</summary>
        public static readonly (string Number, double PitchIn, double RollerIn)[] AnsiChainTable =
        {
            ("25", 0.250, 0.130), ("35", 0.375, 0.200), ("40", 0.500, 0.312),
            ("41", 0.500, 0.306), ("50", 0.625, 0.400), ("60", 0.750, 0.469),
            ("80", 1.000, 0.625), ("100", 1.250, 0.750), ("120", 1.500, 0.875),
            ("140", 1.750, 1.000), ("160", 2.000, 1.125), ("180", 2.250, 1.406),
            ("200", 2.500, 1.562), ("240", 3.000, 1.875),
        };
        public string[] ChainNumbers => Array.ConvertAll(AnsiChainTable, e => e.Number);

        /// <summary>Picking a chain number sets ChainPitchMm/RollerDiameterMm
        /// from the standard table; both stay directly editable afterward
        /// (e.g. for a chain not in the table), same "standard default,
        /// freely overridable" pattern as every other family's parameters.</summary>
        public string ChainNumber
        {
            get => _p.ChainNumber;
            set
            {
                _p.ChainNumber = value;
                foreach (var e in AnsiChainTable)
                {
                    if (e.Number != value) continue;
                    _p.ChainPitchMm = e.PitchIn * 25.4;
                    _p.RollerDiameterMm = e.RollerIn * 25.4;
                    OnChanged(nameof(ChainPitchDisplay));
                    OnChanged(nameof(RollerDiameterDisplay));
                    break;
                }
                OnChanged();
                ScheduleRefresh();
            }
        }

        public double ChainPitchDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.ChainPitchMm) : _p.ChainPitchMm;
            set { _p.ChainPitchMm = Math.Max(0.1, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }
        public double OutsideDiameterDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.OutsideDiameterMm) : _p.OutsideDiameterMm;
            set { _p.OutsideDiameterMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        // ---- chain link (docs/gear-math.md section 19) -- Family == ChainLink only ----

        public bool IsChainLink
        {
            get => _p.Family == GearFamily.ChainLink;
            set { if (value) { _p.Family = GearFamily.ChainLink; OnChanged(); FamilyChanged(); } }
        }

        /// <summary>A chain link has no teeth, bore, profile shift,
        /// addendum/dedendum coefficients, or backlash -- reset every one
        /// so a stale value from whatever family was selected before
        /// cannot leak into this family's file name or (nonsensically)
        /// its geometry request.</summary>
        public void SelectChainLinkCard()
        {
            IsChainLink = true;
            ChainNumber = _p.ChainNumber;
            _p.BoreDiameterMm = 0.0; _p.ProfileShift = 0.0;
            _p.AddendumCoeff = 1.0; _p.DedendumCoeff = 1.25; _p.BacklashMm = 0.0;
            OnChanged(nameof(BoreDiameterDisplay));
        }

        // ---- globoid worm (docs/gear-math.md section 22) -- Family == GloboidWorm only ----

        public bool IsGloboidWorm
        {
            get => _p.Family == GearFamily.GloboidWorm;
            set { if (value) { _p.Family = GearFamily.GloboidWorm; OnChanged(); FamilyChanged(); } }
        }

        public double EnvelopeTeeth
        {
            get => _p.EnvelopeTeeth;
            set { _p.EnvelopeTeeth = Math.Max(1.0, value); OnChanged(); ScheduleRefresh(); }
        }

        /// <summary>A 1-start worm wrapping four pitches of a 30-tooth wheel:
        /// the wheel count is MateTeeth (shared with the other "mate"
        /// meanings), the starts and throat pitch diameter the cylindrical
        /// worm's own fields.</summary>
        public void SelectGloboidWormCard()
        {
            IsGloboidWorm = true;
            HelixAngleDeg = 0.0;
            if (WormStarts < 1) WormStarts = 1;
            if (MateTeeth < 12) MateTeeth = 30;
            if (_p.EnvelopeTeeth < 1) _p.EnvelopeTeeth = 4.0;
        }

        private string _globoidText = "-", _globoidWrapText = "-";
        public string GloboidText { get => _globoidText; private set { _globoidText = value; OnChanged(); } }
        public string GloboidWrapText { get => _globoidWrapText; private set { _globoidWrapText = value; OnChanged(); } }

        // ---- hypoid (docs/gear-math.md section 21) -- Family == Hypoid only ----

        public bool IsHypoid
        {
            get => _p.Family == GearFamily.Hypoid;
            set { if (value) { _p.Family = GearFamily.Hypoid; OnChanged(); FamilyChanged(); } }
        }

        public double OffsetDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.OffsetMm) : _p.OffsetMm;
            set { _p.OffsetMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        /// <summary>A 30/12 hypoid: the pinion count is MateTeeth (shared
        /// with the other "mate" meanings), the gear's spiral angle, cutter
        /// radius and hand are the spiral bevel's own fields.</summary>
        public void SelectHypoidCard()
        {
            IsHypoid = true;
            HelixAngleDeg = 0.0;
            if (MateTeeth < 4) MateTeeth = 12;
            if (Teeth <= MateTeeth) Teeth = 30;
            if (_p.OffsetMm <= 0) { _p.OffsetMm = 6.0; OnChanged(nameof(OffsetDisplay)); }
        }

        private string _hypoidPinionText = "-", _hypoidOffsetText = "-";
        public string HypoidPinionText { get => _hypoidPinionText; private set { _hypoidPinionText = value; OnChanged(); } }
        public string HypoidOffsetText { get => _hypoidOffsetText; private set { _hypoidOffsetText = value; OnChanged(); } }

        // ---- timing wheel / timing belt (docs/gear-math.md section 20) ----

        public bool IsTimingWheel
        {
            get => _p.Family == GearFamily.TimingWheel;
            set { if (value) { _p.Family = GearFamily.TimingWheel; OnChanged(); FamilyChanged(); } }
        }
        public bool IsTimingBelt
        {
            get => _p.Family == GearFamily.TimingBelt;
            set { if (value) { _p.Family = GearFamily.TimingBelt; OnChanged(); FamilyChanged(); } }
        }

        public double BeltPitchDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.BeltPitchMm) : _p.BeltPitchMm;
            set { _p.BeltPitchMm = Math.Max(0.1, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        public string[] BeltTypes => Array.ConvertAll(GearParameters.TimingBeltStandards, e => e.Name);

        /// <summary>Picking a standard sets BeltPitchMm and the trapezoidal/
        /// curvilinear profile from GearParameters.TimingBeltStandards; the
        /// pitch stays directly editable afterward (a non-standard belt keeps
        /// the last-picked profile style). Same pattern as ChainNumber.</summary>
        public string BeltType
        {
            get => _p.BeltType;
            set
            {
                _p.BeltType = value;
                foreach (var e in GearParameters.TimingBeltStandards)
                {
                    if (e.Name != value) continue;
                    _p.BeltPitchMm = e.PitchMm;
                    _p.BeltCurvilinear = e.Curvilinear;
                    OnChanged(nameof(BeltPitchDisplay));
                    break;
                }
                OnChanged();
                ScheduleRefresh();
            }
        }

        public void SelectTimingWheelCard()
        {
            IsTimingWheel = true;
            HelixAngleDeg = 0.0;
            if (Teeth < 8) Teeth = 20;
            // BeltType/BeltPitchMm/BeltCurvilinear are one matched set (the
            // sprocket card's chain-number lesson: a genuine cross-field
            // constraint, so re-run the lookup on entry) -- unlike, say,
            // FaceWidthMm, which is just "a width" and is left alone.
            BeltType = string.IsNullOrEmpty(_p.BeltType) ? "T5" : _p.BeltType;
            if (_p.BoreDiameterMm <= 0) { _p.BoreDiameterMm = 6.0; OnChanged(nameof(BoreDiameterDisplay)); }
        }

        /// <summary>Like ChainLink, a belt has no teeth/module/bore/profile-
        /// shift/addendum/backlash concept -- reset every one so a stale
        /// value from whatever family was open before cannot leak in.</summary>
        public void SelectTimingBeltCard()
        {
            IsTimingBelt = true;
            BeltType = string.IsNullOrEmpty(_p.BeltType) ? "T5" : _p.BeltType;
            if (_p.CutterTeeth < 3) _p.CutterTeeth = 12;
            _p.BoreDiameterMm = 0.0; _p.ProfileShift = 0.0;
            _p.AddendumCoeff = 1.0; _p.DedendumCoeff = 1.25; _p.BacklashMm = 0.0;
            OnChanged(nameof(BoreDiameterDisplay));
            OnChanged(nameof(CutterTeeth));
        }

        private string _timingWheelText = "-", _timingBeltText = "-";
        public string TimingWheelText { get => _timingWheelText; private set { _timingWheelText = value; OnChanged(); } }
        public string TimingBeltText { get => _timingBeltText; private set { _timingBeltText = value; OnChanged(); } }

        public void SelectSprocketCard()
        {
            IsSprocket = true;
            HelixAngleDeg = 0.0;
            if (Teeth < 6) Teeth = 20;
            // ChainPitchMm/RollerDiameterMm (the latter shared with the
            // cycloidal drive's own roller pins) can be left mutually
            // inconsistent with ChainNumber by whatever family was selected
            // before -- re-running the chain-number lookup fixes both to a
            // matched set, the same "arriving family gets consistent
            // defaults" fix SelectCycloidalDriveCard applies to its own bore.
            ChainNumber = _p.ChainNumber;
            if (_p.BoreDiameterMm <= 0) { _p.BoreDiameterMm = 10.0; OnChanged(nameof(BoreDiameterDisplay)); }
        }

        private string _sprocketChainText = "-", _sprocketDiametersText = "-";
        public string SprocketChainText { get => _sprocketChainText; private set { _sprocketChainText = value; OnChanged(); } }
        public string SprocketDiametersText { get => _sprocketDiametersText; private set { _sprocketDiametersText = value; OnChanged(); } }

        // ---- spiral / zerol bevel (docs/gear-math.md section 16) -- Family == SpiralBevel only ----

        public bool IsSpiralBevel
        {
            get => _p.Family == GearFamily.SpiralBevel;
            set { if (value) { _p.Family = GearFamily.SpiralBevel; OnChanged(); FamilyChanged(); } }
        }
        /// <summary>Straight and spiral bevel share the BEVEL CONE section
        /// (mate teeth, shaft angle) and the cone-derived values.</summary>
        public bool IsAnyBevel => _p.IsAnyBevel;
        /// <summary>Spiral bevel and Zerol bevel are two cards over one family,
        /// split by the spiral angle (0 = zerol) -- as Spur/Helical are.</summary>
        public bool IsSpiralBevelSpiral => IsSpiralBevel && !_p.IsZerol;
        public bool IsSpiralBevelZerol => IsSpiralBevel && _p.IsZerol;

        public double SpiralAngleDeg
        {
            get => _p.SpiralAngleDeg;
            set
            {
                _p.SpiralAngleDeg = Clamp(value, 0, 60); OnChanged();
                OnChanged(nameof(IsSpiralBevelSpiral));
                OnChanged(nameof(IsSpiralBevelZerol));
                OnChanged(nameof(CurrentCardName));
                OnChanged(nameof(ResetLabel));
                ScheduleRefresh();
            }
        }

        public double CutterRadiusDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.CutterRadiusMm) : _p.CutterRadiusMm;
            set { _p.CutterRadiusMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        public void SelectSpiralBevelCard()
        {
            IsSpiralBevel = true;
            HelixAngleDeg = 0.0;
            if (_p.IsZerol) SpiralAngleDeg = 35.0;
        }

        public void SelectZerolBevelCard()
        {
            IsSpiralBevel = true;
            HelixAngleDeg = 0.0;
            SpiralAngleDeg = 0.0;
        }

        private string _spiralText = "-", _cutterText = "-";
        public string SpiralText { get => _spiralText; private set { _spiralText = value; OnChanged(); } }
        public string CutterText { get => _cutterText; private set { _cutterText = value; OnChanged(); } }
        /// <summary>"Has a module": a cycloidal drive is sized by its pin
        /// circle, rollers and eccentricity instead.</summary>
        public bool IsNotCycloidalDrive => !IsCycloidalDrive;
        /// <summary>A sprocket, like a cycloidal drive, is sized without a
        /// module or diametral pitch at all (chain pitch takes that role).</summary>
        public bool HasModuleField => !IsCycloidalDrive && !IsSprocket && !IsChainLink && !IsTimingWheel && !IsTimingBelt;
        public string TeethLabel =>
            IsCycloidalDrive ? "Number of lobes (= reduction ratio)"
            : IsPlanetary ? "Sun teeth"
            : IsFaceGear ? "Face gear teeth"
            : IsSprocket ? "Sprocket teeth"
            : IsHypoid ? "Gear teeth"
            : IsCrossedHelical ? "Gear 1 teeth (z1)"
            : "Number of teeth (z)";

        // ---- cycloidal drive (docs/gear-math.md section 15) -- Family == CycloidalDrive only ----

        public double PinCircleDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.PinCircleDiameterMm) : _p.PinCircleDiameterMm;
            set { _p.PinCircleDiameterMm = Math.Max(1.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }
        public double RollerDiameterDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.RollerDiameterMm) : _p.RollerDiameterMm;
            set { _p.RollerDiameterMm = Math.Max(0.1, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }
        public double EccentricityDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.EccentricityMm) : _p.EccentricityMm;
            set { _p.EccentricityMm = Math.Max(0.01, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }
        public int OutputPinCount
        {
            get => _p.OutputPinCount;
            set { _p.OutputPinCount = Math.Max(0, Math.Min(24, value)); OnChanged(); ScheduleRefresh(); }
        }
        public double OutputPinDiameterDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.OutputPinDiameterMm) : _p.OutputPinDiameterMm;
            set { _p.OutputPinDiameterMm = Math.Max(0.1, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }
        public double OutputCircleDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.OutputCircleDiameterMm) : _p.OutputCircleDiameterMm;
            set { _p.OutputCircleDiameterMm = Math.Max(0.1, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        /// <summary>Land on a classic 10:1 unit: a 20 mm bearing seat if no
        /// bore was set (the disc needs one), lobes from Teeth.</summary>
        public void SelectCycloidalDriveCard()
        {
            IsCycloidalDrive = true;
            HelixAngleDeg = 0.0;
            if (_p.BoreDiameterMm <= 0) { _p.BoreDiameterMm = 20.0; OnChanged(nameof(BoreDiameterDisplay)); }
        }

        private string _driveRatioText = "-", _driveLimitsText = "-", _driveOutputText = "-";
        public string DriveRatioText { get => _driveRatioText; private set { _driveRatioText = value; OnChanged(); } }
        public string DriveLimitsText { get => _driveLimitsText; private set { _driveLimitsText = value; OnChanged(); } }
        public string DriveOutputText { get => _driveOutputText; private set { _driveOutputText = value; OnChanged(); } }

        // ---- cycloidal (docs/gear-math.md section 14) -- Family == Cycloidal only ----

        public double RollingCircleDisplay
        {
            get => IsInch ? UnitConversion.MmToInch(_p.RollingCircleDiameterMm) : _p.RollingCircleDiameterMm;
            set { _p.RollingCircleDiameterMm = Math.Max(0.0, IsInch ? UnitConversion.InchToMm(value) : value); OnChanged(); ScheduleRefresh(); }
        }

        public void SelectCycloidalCard()
        {
            IsCycloidal = true;
            HelixAngleDeg = 0.0;
        }

        private string _rollingCircleText = "-";
        public string RollingCircleText { get => _rollingCircleText; private set { _rollingCircleText = value; OnChanged(); } }

        // ---- planetary set (docs/gear-math.md section 11.4) -- Family == Planetary only ----

        public int PlanetCount
        {
            get => _p.PlanetCount;
            set { _p.PlanetCount = Math.Max(1, Math.Min(12, value)); OnChanged(); ScheduleRefresh(); }
        }

        /// <summary>Land on a set that can actually be assembled: keep the
        /// sun and the planet count, and if the current planet tooth count
        /// (MateTeeth, shared with the other families' "mate" meaning) fails
        /// the assembly condition (z_sun + z_ring) % n == 0, move it to the
        /// nearest count that satisfies it -- otherwise the very first thing
        /// the card shows is a warning about a set nobody chose.</summary>
        public void SelectPlanetaryCard()
        {
            IsPlanetary = true;
            HelixAngleDeg = 0.0;   // spur members only (the ring gear is spur)
            int n = Math.Max(1, PlanetCount);
            bool Assembles(int zp) => zp >= 4 && (2 * Teeth + 2 * zp) % n == 0;  // z_ring = z_sun + 2 z_planet
            if (!Assembles(MateTeeth))
            {
                int start = Math.Max(4, Math.Min(MateTeeth, 9));
                for (int d = 0; d < 24; d++)
                {
                    if (Assembles(start + d)) { MateTeeth = start + d; break; }
                    if (Assembles(start - d)) { MateTeeth = start - d; break; }
                }
            }
        }

        private string _ringText = "-", _ratiosText = "-";
        public string RingText { get => _ringText; private set { _ringText = value; OnChanged(); } }
        public string RatiosText { get => _ratiosText; private set { _ratiosText = value; OnChanged(); } }

        /// <summary>Rack and Helical rack are separate cards over one
        /// GearFamily.Rack, split by HelixAngleDeg -- the same arrangement
        /// as the Spur/Helical cards over GearFamily.Cylindrical.</summary>
        public bool IsRackStraight => IsRack && !IsHelical;
        public bool IsRackHelical => IsRack && IsHelical;

        // ---- reset to the selected card's defaults -----------------------------

        public RelayCommand ResetToDefaultsCommand { get; }

        /// <summary>The mosaic card the current parameters belong to, by name
        /// -- Spur/Helical and Rack/Helical rack are told apart by the helix
        /// angle, as the cards themselves are.</summary>
        public string CurrentCardName =>
            IsCylindrical ? (IsHelical ? "Helical" : "Spur")
            : IsHerringbone ? "Herringbone"
            : IsCrossedHelical ? "Screw gears"
            : IsPlanetary ? "Planetary"
            : IsCycloidal ? "Cycloidal"
            : IsCycloidalDrive ? "Cycloidal drive"
            : IsBevel ? "Bevel"
            : IsSpiralBevel ? (_p.IsZerol ? "Zerol bevel" : "Spiral bevel")
            : IsFaceGear ? "Face gear"
            : IsSprocket ? "Sprocket"
            : IsChainLink ? "Chain link"
            : IsTimingWheel ? "Timing wheel"
            : IsTimingBelt ? "Timing belt"
            : IsHypoid ? "Hypoid"
            : IsGloboidWorm ? "Globoid worm"
            : IsWorm ? "Worm"
            : IsRack ? (IsHelical ? "Helical rack" : "Rack")
            : "Internal";

        public string ResetLabel => $"Reset {CurrentCardName} to default values";

        /// <summary>Every parameter of the current card back to that card's
        /// canonical values (GearParameters.CreateDefaults). The unit system
        /// is kept: it is a preference, not a parameter. The view model binds
        /// to one long-lived GearParameters, so the defaults are copied INTO
        /// it and every binding is told to re-read (an empty property name
        /// means "all of them" to WPF), then the family-dependent state and a
        /// preview refresh follow as for any family change.</summary>
        public void ResetToDefaults()
        {
            // the card split within a family: helix angle for Spur/Helical and
            // Rack/Helical rack, spiral angle for Spiral bevel/Zerol bevel
            bool variant = _p.IsSpiralBevel ? !_p.IsZerol : _p.IsHelical;
            _p.CopyFrom(GearParameters.CreateDefaults(_p.Family, variant, _p.Unit));
            OnChanged(string.Empty);
            FamilyChanged();
        }

        private void FamilyChanged()
        {
            OnChanged(nameof(CurrentCardName));
            OnChanged(nameof(ResetLabel));
            OnChanged(nameof(IsCylindrical));
            OnChanged(nameof(IsBevel));
            OnChanged(nameof(IsWorm));
            OnChanged(nameof(IsNotWorm));
            OnChanged(nameof(IsRack));
            OnChanged(nameof(IsInternal));
            OnChanged(nameof(IsNotInternal));
            OnChanged(nameof(ShowBoreField));
            OnChanged(nameof(ShowFaceWidthField));
            OnChanged(nameof(HasTeethField));
            OnChanged(nameof(IsChainLink));
            OnChanged(nameof(IsHerringbone));
            OnChanged(nameof(ShowHelixSection));
            OnChanged(nameof(HelixSectionHeader));
            OnChanged(nameof(IsRackStraight));
            OnChanged(nameof(IsRackHelical));
            OnChanged(nameof(IsCrossedHelical));
            OnChanged(nameof(IsPlanetary));
            OnChanged(nameof(IsCycloidal));
            OnChanged(nameof(IsNotCycloidal));
            OnChanged(nameof(IsCycloidalDrive));
            OnChanged(nameof(IsNotCycloidalDrive));
            OnChanged(nameof(HasModuleField));
            OnChanged(nameof(TeethLabel));
            OnChanged(nameof(IsSpiralBevel));
            OnChanged(nameof(IsAnyBevel));
            OnChanged(nameof(IsSpiralBevelSpiral));
            OnChanged(nameof(IsSpiralBevelZerol));
            OnChanged(nameof(IsFaceGear));
            OnChanged(nameof(IsSprocket));
            OnChanged(nameof(IsTimingWheel));
            OnChanged(nameof(IsTimingBelt));
            OnChanged(nameof(IsHypoid));
            OnChanged(nameof(IsGloboidWorm));
            OnChanged(nameof(HasFaceWidthSpinner));
            OnChanged(nameof(HasModuleField));
            OnChanged(nameof(IsNotCycloidal));
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

        /// <summary>The classic screw-gear pair is 45deg/45deg on 90deg
        /// shafts; land there from a spur state, and give gear 2 the same
        /// tooth count as gear 1 if none was set (docs/gear-math.md 7.5).</summary>
        public void SelectCrossedHelicalCard()
        {
            IsCrossedHelical = true;
            if (!IsHelical) HelixAngleDeg = 45.0;
            if (MateTeeth < 4) MateTeeth = Teeth;
        }

        private string _gear2Text = "-", _ratioText = "-";
        public string Gear2Text { get => _gear2Text; private set { _gear2Text = value; OnChanged(); } }
        public string RatioText { get => _ratioText; private set { _ratioText = value; OnChanged(); } }

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
                OnChanged(nameof(CurrentCardName));  // Spur <-> Helical, Rack <-> Helical rack
                OnChanged(nameof(ResetLabel));
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
            OnChanged(nameof(RollingCircleDisplay));
            OnChanged(nameof(PinCircleDisplay));
            OnChanged(nameof(RollerDiameterDisplay));
            OnChanged(nameof(EccentricityDisplay));
            OnChanged(nameof(OutputPinDiameterDisplay));
            OnChanged(nameof(OutputCircleDisplay));
            OnChanged(nameof(CutterRadiusDisplay));
            OnChanged(nameof(FaceInnerRadiusDisplay));
            OnChanged(nameof(FaceOuterRadiusDisplay));
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
                EdgePoints = new Point3DCollection();  // never show the previous model's edges on this one
                Model3D = loaded;
                ModelReplaced?.Invoke();

                // The "shaded with edges" overlay (FeatureEdges): computed off
                // the UI thread from the frozen (thread-safe) mesh, so the model
                // shows as soon as it is read and its edges follow a moment later.
                var edges = await Task.Run(() => FeatureEdges.Compute(loaded)).ConfigureAwait(true);
                if (myGen != _meshGeneration) return;
                EdgePoints = edges;

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

        private Point3DCollection _edgePoints = new Point3DCollection();
        /// <summary>Feature edges of Model3D as line segments (consecutive
        /// pairs of points), drawn over the shaded model by the view's
        /// LinesVisual3D -- the CAD "shaded with edges" look. See FeatureEdges.</summary>
        public Point3DCollection EdgePoints
        {
            get => _edgePoints;
            private set { _edgePoints = value; OnChanged(); OnChanged(nameof(EdgeSegmentCount)); }
        }
        public int EdgeSegmentCount => _edgePoints == null ? 0 : _edgePoints.Count / 2;

        private static readonly Material GearMaterial = BuildGearMaterial();

        private static Material BuildGearMaterial()
        {
            // A mid-tone steel blue for the light viewport ground: enough
            // contrast for the shaded faces to read against the background AND
            // against the dark feature edges drawn over them. The previous pale
            // #93C5FD on a near-black ground shaded almost flat -- every face
            // the same tint, which is what made the teeth hard to make out.
            var diffuse = new DiffuseMaterial(new SolidColorBrush(Color.FromRgb(0x5B, 0x8F, 0xD6)));
            var specular = new SpecularMaterial(new SolidColorBrush(Color.FromRgb(0xFF, 0xFF, 0xFF)), 45);
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

                if (IsAnyBevel)
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
                    if (IsSpiralBevel)
                    {
                        // spiral_bevel_derived_values adds the trace (server.py)
                        SpiralText = $"{dv("spiral_angle_mean_deg"):0.#}° mean ({dv("spiral_angle_toe_deg"):0.#}° toe → {dv("spiral_angle_heel_deg"):0.#}° heel), {(dv("hand_is_left") > 0.5 ? "left" : "right")}-hand";
                        CutterText = $"{L(dv("cutter_radius_mm"))} ({(_p.CutterRadiusMm > 0 ? "set" : "auto = mean cone distance")}); transverse PA {dv("transverse_pressure_angle_deg"):0.##}°";
                    }
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
                else if (IsFaceGear)
                {
                    // face_gear_derived_values (server.py): the face gear has no
                    // pitch circle of its own -- a nominal radius where the
                    // pinion's pitch circle rolls, and a toothed ring.
                    PitchDiameterText = $"{L(2 * dv("nominal_radius_mm"))} (nominal)";
                    BaseDiameterText = "-";
                    AddendumDiameterText = "-";
                    DedendumDiameterText = "-";
                    ToothThicknessText = "-";
                    ModuleOrDpEquivalentText = IsInch
                        ? $"module {dv("module_mm"):0.####} mm"
                        : $"DP {dv("diametral_pitch"):0.###} /in";
                    FaceGearText = $"pinion z{dv("pinion_teeth"):0} (Ø{L(dv("pinion_pitch_diameter_mm"))}), shaper z{dv("shaper_teeth"):0}, ratio {dv("ratio"):0.###} : 1";
                    FaceRingText = $"{L(dv("inner_radius_mm"))} to {L(dv("outer_radius_mm"))} (face width {L(dv("face_width_mm"))}); teeth {L(dv("addendum_height_mm"))} above / {L(dv("dedendum_height_mm"))} below the pitch plane";
                    // Litvin's design limits by the rack-equivalent section
                    // (docs/gear-math.md 17): undercut inside L1, pointed
                    // beyond L2; the auto ring sits inside them.
                    FaceLimitsText = $"undercut inside {L(dv("undercut_radius_mm"))}, pointed beyond {L(dv("pointing_radius_mm"))}; top land {L(dv("top_land_inner_mm"))} at the inner end, {L(dv("top_land_outer_mm"))} at the outer end";
                }
                else if (IsGloboidWorm)
                {
                    // globoid_worm_derived_values (server.py)
                    PitchDiameterText = $"{L(dv("worm_throat_pitch_diameter_mm"))} (worm, throat)";
                    BaseDiameterText = "-";
                    AddendumDiameterText = $"{L(dv("worm_throat_tip_diameter_mm"))} (worm, throat)";
                    DedendumDiameterText = $"{L(dv("worm_throat_root_diameter_mm"))} (worm, throat)";
                    ToothThicknessText = "-";
                    ModuleOrDpEquivalentText = IsInch
                        ? $"module {dv("module_mm"):0.####} mm"
                        : $"DP {dv("diametral_pitch"):0.###} /in";
                    GloboidText = $"{dv("starts"):0} start(s) x wheel z{dv("wheel_teeth"):0}: ratio {dv("ratio"):0.##} : 1, centre distance {L(dv("centre_distance_mm"))}, "
                                + $"lead angle {dv("lead_angle_deg"):0.##}° at the throat, wheel Ø{L(dv("wheel_pitch_diameter_mm"))}";
                    GloboidWrapText = $"wraps {dv("envelope_teeth"):0.#} pitches ({dv("wrap_angle_deg"):0.#}°): worm length {L(dv("worm_length_mm"))}, "
                                    + $"wheel face {L(dv("wheel_face_width_mm"))}, wheel Ø{L(dv("wheel_throat_outer_diameter_mm"))} at the throat / Ø{L(dv("wheel_face_outer_diameter_mm"))} at the face edge";
                }
                else if (IsHypoid)
                {
                    // hypoid_derived_values (server.py): the gear is a spiral
                    // bevel gear; the pinion's numbers follow from the offset.
                    PitchDiameterText = $"{L(dv("gear_pitch_diameter_mm"))} (gear, heel)";
                    BaseDiameterText = "-";
                    AddendumDiameterText = "-";
                    DedendumDiameterText = "-";
                    ToothThicknessText = "-";
                    ModuleOrDpEquivalentText = IsInch
                        ? $"module {dv("module_mm"):0.####} mm"
                        : $"DP {dv("diametral_pitch"):0.###} /in";
                    HypoidPinionText = $"z{dv("pinion_teeth"):0}: pitch angle {dv("pinion_pitch_angle_deg"):0.##}° (gear {dv("gear_pitch_angle_deg"):0.##}°), "
                                     + $"spiral {dv("pinion_spiral_angle_deg"):0.#}° (gear {dv("spiral_angle_mean_deg"):0.#}°), "
                                     + $"mean radius {L(dv("pinion_mean_pitch_radius_mm"))} -- a bevel pinion would be {L(dv("bevel_pinion_mean_pitch_radius_mm"))}";
                    HypoidOffsetText = $"{L(dv("offset_mm"))} = {dv("offset_ratio"):0.###} of the gear pitch diameter, "
                                     + $"pinion {(dv("offset_below") > 0.5 ? "below" : "above")} centre for this hand; ratio {dv("ratio"):0.###} : 1";
                }
                else if (IsTimingWheel)
                {
                    // timing_wheel_derived_values (server.py): a belt-driven
                    // wheel, not an involute gear.
                    PitchDiameterText = L(dv("pitch_diameter_mm"));
                    BaseDiameterText = "n/a (belt-driven)";
                    AddendumDiameterText = L(dv("outside_diameter_mm"));
                    DedendumDiameterText = L(dv("root_diameter_mm"));
                    ToothThicknessText = "-";
                    ModuleOrDpEquivalentText = "-";
                    TimingWheelText = $"{_p.BeltType} ({(dv("curvilinear") > 0.5 ? "curvilinear" : "trapezoidal")}): "
                                    + $"belt pitch {L(dv("belt_pitch_mm"))}, groove depth {L(dv("tooth_height_mm"))}, "
                                    + $"tip fillet r{L(dv("tip_fillet_mm"))}, root fillet r{L(dv("root_fillet_mm"))}";
                }
                else if (IsTimingBelt)
                {
                    PitchDiameterText = "n/a (timing belt)";
                    BaseDiameterText = "-";
                    AddendumDiameterText = "-";
                    DedendumDiameterText = "-";
                    ToothThicknessText = "-";
                    ModuleOrDpEquivalentText = "-";
                    TimingBeltText = $"{_p.BeltType} ({(dv("curvilinear") > 0.5 ? "curvilinear" : "trapezoidal")}): "
                                    + $"belt pitch {L(dv("belt_pitch_mm"))}, tooth height {L(dv("tooth_height_mm"))}, "
                                    + $"backing {L(dv("belt_thickness_mm"))} thick, segment {L(dv("segment_length_mm"))} long, "
                                    + $"tip fillet r{L(dv("tip_fillet_mm"))}, root fillet r{L(dv("root_fillet_mm"))}";
                }
                else if (IsChainLink)
                {
                    // chain_link_derived_values (server.py): not a gear at
                    // all -- no pitch/base/addendum circle, no tooth
                    // thickness, no module.
                    PitchDiameterText = "n/a (chain link)";
                    BaseDiameterText = "-";
                    AddendumDiameterText = "-";
                    DedendumDiameterText = "-";
                    ToothThicknessText = "-";
                    ModuleOrDpEquivalentText = "-";
                    SprocketChainText = $"#{_p.ChainNumber} -- pitch {L(dv("chain_pitch_mm"))}, roller Ø{L(dv("roller_diameter_mm"))}";
                    SprocketDiametersText = $"pin Ø{L(dv("pin_diameter_mm"))}, bushing Ø{L(dv("bushing_outer_diameter_mm"))}, "
                                           + $"plate {L(dv("plate_thickness_mm"))} thick, {L(dv("total_width_mm"))} overall width";
                }
                else if (IsSprocket)
                {
                    // sprocket_derived_values (server.py): a chain-driven
                    // wheel, not an involute gear -- no base circle, tooth
                    // thickness, or module/pressure-angle-derived fields.
                    PitchDiameterText = L(dv("pitch_diameter_mm"));
                    BaseDiameterText = "n/a (chain-driven)";
                    AddendumDiameterText = L(dv("outside_diameter_mm"));
                    DedendumDiameterText = L(dv("root_diameter_mm"));
                    ToothThicknessText = "-";
                    ModuleOrDpEquivalentText = "-";
                    SprocketChainText = $"#{_p.ChainNumber} -- pitch {L(dv("chain_pitch_mm"))}, roller Ø{L(dv("roller_diameter_mm"))}";
                    SprocketDiametersText = $"root {L(dv("root_diameter_mm"))} / outside {L(dv("outside_diameter_mm"))} (clearance {L(dv("root_clearance_mm"))})";
                }
                else if (IsCycloidalDrive)
                {
                    // cycloidal_drive_derived_values (server.py): a disc, not a
                    // gear -- the generic gear fields don't apply except the
                    // disc's outer and root diameters.
                    PitchDiameterText = "-";
                    BaseDiameterText = "-";
                    ToothThicknessText = "-";
                    ModuleOrDpEquivalentText = "-";
                    AddendumDiameterText = L(dv("disc_outer_diameter_mm"));
                    DedendumDiameterText = L(dv("disc_root_diameter_mm"));
                    DriveRatioText = $"{dv("ratio"):0} : 1 ({dv("pin_count"):0} rollers, lobe height {L(2 * dv("eccentricity_mm"))})";
                    DriveLimitsText = $"eccentricity < {L(dv("max_eccentricity_mm"))}; flank radius min {L(dv("min_curvature_radius_mm"))} vs roller {L(dv("roller_diameter_mm") / 2)}";
                    DriveOutputText = OutputPinCount > 0
                        ? $"{OutputPinCount} pins Ø{L(_p.OutputPinDiameterMm)} in Ø{L(dv("output_hole_diameter_mm"))} holes on Ø{L(_p.OutputCircleDiameterMm)}"
                        : "none";
                }
                else if (IsCycloidal)
                {
                    // cycloidal_derived_values (server.py): no base circle (that's
                    // an involute concept) and no pressure angle.
                    PitchDiameterText = L(dv("pitch_diameter_mm"));
                    BaseDiameterText = "n/a (cycloidal)";
                    AddendumDiameterText = L(dv("addendum_diameter_mm"));
                    DedendumDiameterText = L(dv("dedendum_diameter_mm"));
                    ToothThicknessText = L(dv("circular_tooth_thickness_mm"));
                    ModuleOrDpEquivalentText = IsInch
                        ? $"module {dv("module_mm"):0.####} mm"
                        : $"DP {dv("diametral_pitch"):0.###} /in";
                    RollingCircleText = $"{L(dv("rolling_circle_diameter_mm"))}"
                        + (dv("dedendum_is_radial") > 0.5 ? " (radial dedendum flanks)" : "");
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
                    if (IsPlanetary)
                    {
                        // planetary_derived_values (server.py): the sun's values
                        // above, plus the set relationships
                        RingText = $"z{dv("ring_teeth"):0} internal, OD {L(dv("ring_outer_diameter_mm"))}";
                        CenterDistanceText = $"{L(dv("center_distance_mm"))} (sun-planet = ring-planet)";
                        RatiosText = $"{dv("ratio_ring_fixed"):0.###}:1 ring fixed, {dv("ratio_sun_fixed"):0.###}:1 sun fixed, {dv("ratio_carrier_fixed"):0.###}:1 star";
                    }
                    if (IsCrossedHelical)
                    {
                        // screw_derived_values (server.py): gear 1's values above,
                        // plus the pair relationship
                        Gear2Text = $"z{MateTeeth}, helix {dv("helix2_deg"):0.##}° {(dv("hand2_is_left") > 0.5 ? "left" : "right")}-hand, d {L(dv("pitch_diameter2_mm"))}";
                        CenterDistanceText = L(dv("center_distance_mm"));
                        RatioText = $"{dv("ratio"):0.###} : 1 at {dv("shaft_angle_deg"):0.#}° shafts";
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
