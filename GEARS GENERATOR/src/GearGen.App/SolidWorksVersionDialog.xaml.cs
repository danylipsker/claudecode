using System.Linq;
using System.Windows;

namespace GearGen.App
{
    public partial class SolidWorksVersionDialog : Window
    {
        public int SelectedYear { get; private set; }
        public bool Confirmed { get; private set; }

        private static readonly int[] Years = { 2020, 2021, 2022, 2023, 2024, 2025, 2026 };

        public SolidWorksVersionDialog()
        {
            InitializeComponent();
            var installed = SolidWorksVersionHelper.FindInstalls();
            foreach (var year in Years)
            {
                var match = installed.FirstOrDefault(i => i.Year == year);
                VersionCombo.Items.Add($"SOLIDWORKS {year}" + (match != null ? "  (installed)" : ""));
            }
            VersionCombo.SelectionChanged += (s, e) => UpdateAvailability();
            UpdateAvailability();
        }

        private void UpdateAvailability()
        {
            int year = Years[VersionCombo.SelectedIndex];
            var match = SolidWorksVersionHelper.FindForYear(year);
            AvailabilityText.Text = match != null
                ? $"SOLIDWORKS {year} found on this machine -- will be used directly."
                : $"SOLIDWORKS {year} was not found on this machine -- the currently running (or default) SolidWorks will be used instead.";
        }

        private void OnOk(object sender, RoutedEventArgs e)
        {
            SelectedYear = Years[VersionCombo.SelectedIndex];
            Confirmed = true;
            DialogResult = true;
        }

        private void OnCancel(object sender, RoutedEventArgs e)
        {
            Confirmed = false;
            DialogResult = false;
        }
    }
}
