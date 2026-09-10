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
            // The shared default camera direction looks along a diagonal that's
            // nearly edge-on to a rack's own length axis (its teeth march along
            // world X) -- fine for the other, roughly axisymmetric families, but
            // it puts the outermost tooth at a genuine grazing/silhouette angle
            // where WPF's rasterizer visibly mis-renders the fillet-to-backing
            // curve as a notch (confirmed: the underlying geometry is correct --
            // manifold, consistent winding, matches hand-calculated fillet points
            // exactly -- the artifact tracks the viewing angle, not any geometry
            // parameter). Nudging the view less edge-on to X fixes it cleanly, so
            // give Rack its own angle rather than compromising everyone else's.
            Viewport3D.ChangeCameraDirection(new Vector3D(-0.5, 1, -0.8), 300);
        }

        private void OnInternalChecked(object sender, RoutedEventArgs e)
        {
            ViewModel?.SelectInternalCard();
        }

        private async void OnExportStepClick(object sender, RoutedEventArgs e)
        {
            var dlg = new SaveFileDialog
            {
                Filter = "STEP files (*.step;*.stp)|*.step;*.stp",
                FileName = $"gear_z{ViewModel.Teeth}.step",
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
                FileName = $"gear_z{ViewModel.Teeth}_profile.dxf",
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
