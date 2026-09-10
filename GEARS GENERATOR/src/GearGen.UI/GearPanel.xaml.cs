using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Media3D;
using GearGen.PyEngine;
using Microsoft.Win32;

namespace GearGen.UI
{
    public partial class GearPanel : UserControl
    {
        public GearViewModel ViewModel { get; private set; }

        public GearPanel()
        {
            InitializeComponent();
        }

        /// <summary>Call once after construction, from the host (standalone
        /// app or SolidWorks add-in), passing an already-started engine.</summary>
        public void Attach(PyGearEngine engine)
        {
            ViewModel = new GearViewModel(engine);
            DataContext = ViewModel;
            // Every parameter change can change the model's size drastically
            // (a bigger module, a wider face, a bore) -- re-fit the camera
            // each time rather than leaving the user zoomed into empty space
            // or with the gear spilling off-screen.
            ViewModel.ModelReplaced += () => Viewport3D.ZoomExtents(200);
        }

        // ---- 3D view controls: this project's gear axis is always Z (see
        // docs/gear-math.md throughout), so these presets are defined against
        // Z-up, not WPF/Helix's more common Y-up convention. ----

        private void OnViewFront(object sender, RoutedEventArgs e) =>
            Viewport3D.ChangeCameraDirection(new Vector3D(0, -1, -0.001), 300);

        private void OnViewTop(object sender, RoutedEventArgs e) =>
            Viewport3D.ChangeCameraDirection(new Vector3D(0.001, 0, -1), 300);

        private void OnViewRight(object sender, RoutedEventArgs e) =>
            Viewport3D.ChangeCameraDirection(new Vector3D(-1, 0, -0.001), 300);

        private void OnViewIso(object sender, RoutedEventArgs e) =>
            Viewport3D.ChangeCameraDirection(new Vector3D(-1, 1, -0.8), 300);

        private void OnZoomExtents(object sender, RoutedEventArgs e) =>
            Viewport3D.ZoomExtents(300);

        private void OnMetricChecked(object sender, RoutedEventArgs e)
        {
            if (ViewModel != null) ViewModel.IsMetric = true;
        }

        private void OnInchChecked(object sender, RoutedEventArgs e)
        {
            if (ViewModel != null) ViewModel.IsInch = true;
        }

        private void OnRightHandChecked(object sender, RoutedEventArgs e)
        {
            if (ViewModel != null) ViewModel.IsRightHand = true;
        }

        private void OnLeftHandChecked(object sender, RoutedEventArgs e)
        {
            if (ViewModel != null) ViewModel.IsLeftHand = true;
        }

        private void OnCylindricalChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectSpurCard();
        }

        private void OnHelicalCardChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectHelicalCard();
        }

        private void OnWormChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectWormCard();
            // The live preview now shows the worm together with its matching
            // wheel (server.py's export_mesh, whenever MateTeeth > 0 -- true
            // by default) so it actually looks like a worm gear SET, the way
            // every reference illustration of one draws it, not the worm
            // alone. The wheel's own axis lands on Y (perpendicular to the
            // worm's Z), and the shared default camera looks nearly straight
            // down Y -- fine for a lone worm, but it stares the wheel dead
            // in the face and buries the (much smaller) worm in front of it.
            // Nudge toward a 3/4 view that reads as two distinct meshing
            // parts, matching the rack card's own precedent of a
            // family-specific camera nudge instead of changing the shared
            // default for everyone else.
            Viewport3D.ChangeCameraDirection(new Vector3D(0.55, 0.8, -0.35), 300);
        }

        private void OnBevelChecked(object sender, RoutedEventArgs e)
        {
            if (ViewModel != null) ViewModel.IsBevel = true;
        }

        private void OnRackChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectRackCard();
            // No camera nudge here any more. There used to be one, justified as
            // working around a "rasterizer artifact": a notch where each end
            // tooth's fillet met the backing bar, visible only at the default
            // camera's near-grazing angle to the rack's length axis. The notch
            // was real geometry -- rack.py's root fillet arc was inverted (its
            // centre inside the tooth), curling back under every tooth and
            // leaving a quarter-round groove that the end teeth showed in
            // silhouette. The grazing angle didn't create it, it just made it
            // the one place the eye could read the profile. With the fillet
            // fixed the shared default view is fine for racks too, so racks no
            // longer get a special angle (the worm keeps its nudge below for an
            // unrelated, still-valid reason: it previews two mating parts).
        }

        private void OnInternalChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectInternalCard();
        }

        private void OnHerringboneChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectHerringboneCard();
        }

        private void OnHelicalRackChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectHelicalRackCard();
        }

        private void OnPlanetaryChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectPlanetaryCard();
        }

        private void OnCycloidalChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectCycloidalCard();
        }

        private void OnCycloidalDriveChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectCycloidalDriveCard();
        }

        private void OnScrewChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectCrossedHelicalCard();
            // Two mating parts on crossed shafts (gear 2 sits along +Y with its
            // axis tilted in XZ): the same 3/4 nudge the worm+wheel preview
            // uses, for the same reason -- the shared default looks nearly
            // down one of the two axes.
            Viewport3D.ChangeCameraDirection(new Vector3D(0.55, 0.8, -0.35), 300);
        }

        private async void OnExportStepClick(object sender, RoutedEventArgs e)
        {
            var dlg = new SaveFileDialog
            {
                Filter = "STEP files (*.step;*.stp)|*.step;*.stp",
                FileName = ViewModel.SuggestedFileName(".step"),
            };
            if (dlg.ShowDialog() == true)
            {
                try
                {
                    await ViewModel.DoExportStepAsync(dlg.FileName);
                    MessageBox.Show("STEP file exported:\n" + dlg.FileName, "Export complete",
                        MessageBoxButton.OK, MessageBoxImage.Information);
                }
                catch (Exception ex)
                {
                    MessageBox.Show("STEP export failed:\n" + ex.Message, "Export failed",
                        MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        private async void OnExportDxfClick(object sender, RoutedEventArgs e)
        {
            var dlg = new SaveFileDialog
            {
                Filter = "DXF files (*.dxf)|*.dxf",
                FileName = ViewModel.SuggestedFileName(".dxf"),
            };
            if (dlg.ShowDialog() == true)
            {
                try
                {
                    await ViewModel.DoExportDxfAsync(dlg.FileName);
                    MessageBox.Show("DXF profile exported:\n" + dlg.FileName, "Export complete",
                        MessageBoxButton.OK, MessageBoxImage.Information);
                }
                catch (Exception ex)
                {
                    MessageBox.Show("DXF export failed:\n" + ex.Message, "Export failed",
                        MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }
    }
}
