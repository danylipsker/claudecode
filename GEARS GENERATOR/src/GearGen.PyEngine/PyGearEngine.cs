using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using GearGen.Geometry;

namespace GearGen.PyEngine
{
    /// <summary>
    /// Owns one persistent "python server.py" child process and talks to it
    /// with newline-delimited JSON (see py/gear_step/server.py). Starting the
    /// interpreter once and reusing it avoids ~150-200ms of Python/shapely
    /// import cost on every parameter tweak, which is what makes a debounced
    /// live preview feel responsive. All calls are serialized through a
    /// semaphore -- the protocol is strictly one request in flight at a time.
    /// </summary>
    public class PyGearEngine : IDisposable
    {
        private Process _proc;
        private readonly SemaphoreSlim _lock = new SemaphoreSlim(1, 1);
        private readonly string _pythonExe;
        private readonly string _serverScript;

        public bool IsRunning => _proc != null && !_proc.HasExited;

        public PyGearEngine(string pythonExe = null, string serverScriptPath = null)
        {
            _pythonExe = pythonExe ?? "python";
            _serverScript = serverScriptPath ?? LocateServerScript();
        }

        /// <summary>Walks up from this assembly's directory looking for
        /// py/gear_step/server.py -- works regardless of Debug/Release build
        /// depth as long as the repo layout stays intact.</summary>
        public static string LocateServerScript()
        {
            var dir = new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory);
            var envOverride = Environment.GetEnvironmentVariable("GEARGEN_PY_SERVER");
            if (!string.IsNullOrEmpty(envOverride) && File.Exists(envOverride))
                return envOverride;

            while (dir != null)
            {
                var candidate = Path.Combine(dir.FullName, "py", "gear_step", "server.py");
                if (File.Exists(candidate))
                    return candidate;
                dir = dir.Parent;
            }
            throw new FileNotFoundException(
                "Could not locate py/gear_step/server.py by walking up from " +
                AppDomain.CurrentDomain.BaseDirectory + ". Set GEARGEN_PY_SERVER to override.");
        }

        public void Start()
        {
            if (IsRunning) return;

            var psi = new ProcessStartInfo
            {
                FileName = _pythonExe,
                Arguments = "\"" + _serverScript + "\"",
                WorkingDirectory = Path.GetDirectoryName(_serverScript),
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                StandardOutputEncoding = System.Text.Encoding.UTF8,
            };
            _proc = Process.Start(psi);
        }

        public void Stop()
        {
            try
            {
                if (_proc != null && !_proc.HasExited)
                {
                    _proc.StandardInput.Close();
                    if (!_proc.WaitForExit(2000))
                        _proc.Kill();
                }
            }
            catch { /* best effort */ }
            finally
            {
                _proc?.Dispose();
                _proc = null;
            }
        }

        private async Task<EngineResponse> SendAsync(EngineRequest req)
        {
            if (!IsRunning) Start();

            await _lock.WaitAsync().ConfigureAwait(false);
            try
            {
                string json = JsonConvert.SerializeObject(req, Formatting.None,
                    new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                await _proc.StandardInput.WriteLineAsync(json).ConfigureAwait(false);
                await _proc.StandardInput.FlushAsync().ConfigureAwait(false);

                string line = await _proc.StandardOutput.ReadLineAsync().ConfigureAwait(false);
                if (line == null)
                {
                    string stderr = "";
                    try { stderr = _proc.StandardError.ReadToEnd(); } catch { }
                    throw new EngineException("Python engine process ended unexpectedly.", stderr);
                }
                return JsonConvert.DeserializeObject<EngineResponse>(line);
            }
            finally
            {
                _lock.Release();
            }
        }

        private static EngineRequest BuildRequest(string cmd, GearParameters p, string path = null)
        {
            var req = new EngineRequest
            {
                Cmd = cmd,
                Unit = p.Unit == UnitSystem.Inch ? "inch" : "metric",
                Z = p.Teeth,
                PressureAngleDeg = p.PressureAngleDeg,
                ProfileShift = p.ProfileShift,
                AddendumCoeff = p.AddendumCoeff,
                DedendumCoeff = p.DedendumCoeff,
                RootFilletCoeff = p.RootFilletCoeff,
                FaceWidthMm = p.FaceWidthMm,
                BacklashMm = p.BacklashMm,
                BoreDiameterMm = p.BoreDiameterMm,
                HelixAngleDeg = p.HelixAngleDeg,
                Hand = p.Hand,
                Path = path,
            };

            if (p.IsBevel)
            {
                // The Python side's BevelGearParams doesn't have a separate
                // inch constructor (v1 scope) -- convert to mm client-side so
                // bevel works correctly regardless of the UI's unit toggle.
                req.GearType = "bevel";
                req.ModuleMm = p.EffectiveModuleMm;
                req.MateTeeth = p.MateTeeth;
                req.ShaftAngleDeg = p.ShaftAngleDeg;
                req.PitchAngleOverrideDeg = p.PitchAngleOverrideDeg;
                return req;
            }

            if (p.IsWorm)
            {
                // Same reasoning as bevel: WormParams has no separate inch
                // constructor, so convert client-side. PitchDiameterMm is
                // NOT unit-converted here -- it's already stored in mm on
                // GearParameters regardless of Unit (see GearViewModel's
                // PitchDiameterDisplay, which does the inch<->mm conversion
                // at the UI-binding boundary, same pattern as FaceWidthMm).
                req.GearType = "worm";
                req.ModuleMm = p.EffectiveModuleMm;
                req.Starts = p.WormStarts;
                req.PitchDiameterMm = p.PitchDiameterMm;
                req.MateTeeth = p.MateTeeth; // wheel teeth, for center-distance info only
                return req;
            }

            if (p.IsRack)
            {
                // Same reasoning as bevel/worm: RackParams has no separate
                // inch constructor, so convert client-side.
                req.GearType = "rack";
                req.ModuleMm = p.EffectiveModuleMm;
                req.BackingHeightMm = p.BackingHeightMm;
                // BoreDiameterMm already set above: mounting holes through
                // the backing bar, one per tooth pitch, 0 = none.
                return req;
            }

            if (p.IsInternal)
            {
                // Same reasoning as bevel/worm: InternalGearParams has no
                // separate inch constructor, so convert client-side.
                req.GearType = "internal";
                req.ModuleMm = p.EffectiveModuleMm;
                req.CutterTeeth = p.CutterTeeth;
                req.RimThicknessMm = p.RimThicknessMm;
                req.MateTeeth = p.MateTeeth; // mating pinion teeth, for center-distance info only
                return req;
            }

            if (p.IsFaceGear)
            {
                // As bevel: FaceGearParams has no inch constructor, convert client-side.
                req.GearType = "face_gear";
                req.ModuleMm = p.EffectiveModuleMm;
                req.MateTeeth = p.MateTeeth;        // the pinion
                req.CutterTeeth = p.CutterTeeth;    // the shaper (0 = pinion's count)
                req.FaceInnerRadiusMm = p.FaceInnerRadiusMm;
                req.FaceOuterRadiusMm = p.FaceOuterRadiusMm;
                req.RimThicknessMm = p.RimThicknessMm;
                return req;
            }

            if (p.IsGloboidWorm)
            {
                // As the cylindrical worm: no inch constructor, convert client-side;
                // PitchDiameterMm is already in mm regardless of Unit.
                req.GearType = "globoid_worm";
                req.ModuleMm = p.EffectiveModuleMm;
                req.Starts = p.WormStarts;
                req.MateTeeth = p.MateTeeth;          // the wheel
                req.PitchDiameterMm = p.PitchDiameterMm;
                req.EnvelopeTeeth = p.EnvelopeTeeth;
                return req;
            }

            if (p.IsHypoid)
            {
                // As spiral bevel: HypoidParams has no inch constructor, convert
                // client-side. Hand is already in the base request (the gear's).
                req.GearType = "hypoid";
                req.ModuleMm = p.EffectiveModuleMm;
                req.MateTeeth = p.MateTeeth;          // the pinion
                req.SpiralAngleDeg = p.SpiralAngleDeg;
                req.CutterRadiusMm = p.CutterRadiusMm;
                req.OffsetMm = p.OffsetMm;
                return req;
            }

            if (p.IsTimingWheel)
            {
                // The displayed pitch is sent (not just the standard's name) so a
                // user's edited pitch wins; the name still selects the profile.
                req.GearType = "timing_wheel";
                req.BeltType = p.BeltType;
                req.BeltPitchMm = p.BeltPitchMm;
                req.Curvilinear = p.BeltCurvilinear;
                return req;
            }

            if (p.IsTimingBelt)
            {
                req.GearType = "timing_belt";
                req.BeltType = p.BeltType;
                req.BeltPitchMm = p.BeltPitchMm;
                req.Curvilinear = p.BeltCurvilinear;
                req.CutterTeeth = p.CutterTeeth;   // how many teeth the modelled segment shows
                return req;
            }

            if (p.IsChainLink)
            {
                // No teeth, no module: entirely sized by the chain itself.
                req.GearType = "chain_link";
                req.ChainPitchMm = p.ChainPitchMm;
                req.RollerDiameterMm = p.RollerDiameterMm;
                return req;
            }

            if (p.IsSprocket)
            {
                // No module/pressure angle: sized entirely by chain pitch
                // and roller diameter (both already in mm regardless of
                // Unit, same convention as PitchDiameterMm above).
                req.GearType = "sprocket";
                req.ChainPitchMm = p.ChainPitchMm;
                req.RollerDiameterMm = p.RollerDiameterMm;
                req.OutsideDiameterMm = p.OutsideDiameterMm;
                return req;
            }

            if (p.IsSpiralBevel)
            {
                // As bevel: SpiralBevelParams has no inch constructor, convert
                // client-side. Hand is already in the base request.
                req.GearType = "spiral_bevel";
                req.ModuleMm = p.EffectiveModuleMm;
                req.MateTeeth = p.MateTeeth;
                req.ShaftAngleDeg = p.ShaftAngleDeg;
                req.PitchAngleOverrideDeg = p.PitchAngleOverrideDeg;
                req.SpiralAngleDeg = p.SpiralAngleDeg;
                req.CutterRadiusMm = p.CutterRadiusMm;
                return req;
            }

            if (p.IsCycloidalDrive)
            {
                // No module: every length is already stored in mm on
                // GearParameters (the UI converts at the binding boundary).
                req.GearType = "cycloidal_drive";
                req.PinCircleDiameterMm = p.PinCircleDiameterMm;
                req.RollerDiameterMm = p.RollerDiameterMm;
                req.EccentricityMm = p.EccentricityMm;
                req.OutputPinCount = p.OutputPinCount;
                req.OutputPinDiameterMm = p.OutputPinDiameterMm;
                req.OutputCircleDiameterMm = p.OutputCircleDiameterMm;
                return req;
            }

            if (p.IsCycloidal)
            {
                // Same reasoning as bevel/worm: CycloidalGearParams has no
                // separate inch constructor, so convert client-side.
                req.GearType = "cycloidal";
                req.ModuleMm = p.EffectiveModuleMm;
                req.RollingCircleDiameterMm = p.RollingCircleDiameterMm;
                return req;
            }

            if (p.IsPlanetary)
            {
                // Same reasoning as bevel/worm: PlanetaryParams has no separate
                // inch constructor, so convert client-side.
                req.GearType = "planetary";
                req.ModuleMm = p.EffectiveModuleMm;
                req.MateTeeth = p.MateTeeth;          // planet teeth
                req.PlanetCount = p.PlanetCount;
                req.RimThicknessMm = p.RimThicknessMm; // the ring's rim
                return req;
            }

            if (p.IsCrossedHelical)
            {
                // Same reasoning as bevel/worm: CrossedHelicalPairParams has no
                // separate inch constructor, so convert client-side. Helix/hand
                // (gear 1) are already in the base request above.
                req.GearType = "screw";
                req.ModuleMm = p.EffectiveModuleMm;
                req.MateTeeth = p.MateTeeth;      // gear 2's tooth count
                req.ShaftAngleDeg = p.ShaftAngleDeg;
                return req;
            }

            // Cylindrical (spur/helical) and herringbone share params_from_
            // request on the Python side, which has its own inch constructor,
            // so these two send the raw unit-specific size unconverted.
            if (p.IsHerringbone)
            {
                req.GearType = "herringbone";
                req.GapMm = p.GapWidthMm;
            }
            if (p.Unit == UnitSystem.Inch)
                req.DiametralPitch = p.DiametralPitch;
            else
                req.ModuleMm = p.ModuleMm;
            return req;
        }

        public async Task<bool> PingAsync()
        {
            try
            {
                var resp = await SendAsync(new EngineRequest { Cmd = "ping" }).ConfigureAwait(false);
                return resp != null && resp.Ok && resp.Pong;
            }
            catch
            {
                return false;
            }
        }

        public async Task<OutlineResult> GetOutlineAsync(GearParameters p, double simplifyToleranceMm = 0.01)
        {
            var req = BuildRequest("outline", p);
            req.SimplifyToleranceMm = simplifyToleranceMm;
            var resp = await SendAsync(req).ConfigureAwait(false);
            if (resp == null || !resp.Ok)
                throw new EngineException(resp?.Error ?? "Unknown engine error.", resp?.Traceback);

            var result = new OutlineResult
            {
                Derived = resp.Derived ?? new System.Collections.Generic.Dictionary<string, double>(),
                Warnings = resp.Warnings ?? new System.Collections.Generic.List<string>(),
            };
            if (resp.Outline != null)
            {
                foreach (var pt in resp.Outline)
                    result.Points.Add(new OutlinePoint(pt[0], pt[1]));
            }
            return result;
        }

        /// <summary>Tessellates the ACTUAL 3D solid (not the flat 2D outline)
        /// to an STL file, for the live 3D viewer -- bore, helix twist, cone
        /// taper etc. all show exactly as they'll export, not just implied.
        /// Slower than GetOutlineAsync (a real solid build, ~1-6s depending
        /// on gear family/complexity), so the caller should keep this on its
        /// own debounce/generation-tracking, not block the fast outline-based
        /// derived-values update on it.</summary>
        public async Task<string> GetMeshStlPathAsync(GearParameters p)
        {
            string tempStl = Path.Combine(Path.GetTempPath(), $"geargen_mesh_{Guid.NewGuid():N}.stl");
            var resp = await SendAsync(BuildRequest("export_mesh", p, tempStl)).ConfigureAwait(false);
            if (resp == null || !resp.Ok)
                throw new EngineException(resp?.Error ?? "Unknown engine error.", resp?.Traceback);
            return resp.Path;
        }

        public async Task<string> ExportStepAsync(GearParameters p, string path)
        {
            var resp = await SendAsync(BuildRequest("export_step", p, path)).ConfigureAwait(false);
            if (resp == null || !resp.Ok)
                throw new EngineException(resp?.Error ?? "Unknown engine error.", resp?.Traceback);
            return resp.Path;
        }

        public async Task<string> ExportDxfAsync(GearParameters p, string path)
        {
            var resp = await SendAsync(BuildRequest("export_dxf", p, path)).ConfigureAwait(false);
            if (resp == null || !resp.Ok)
                throw new EngineException(resp?.Error ?? "Unknown engine error.", resp?.Traceback);
            return resp.Path;
        }

        public void Dispose() => Stop();
    }
}
