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
            // Default to the newest year actually installed on this machine,
            // falling back to the newest year listed. This used to be a
            // hard-coded SelectedIndex="6" (= 2026) in the XAML -- which WPF
            // does honor even though it's set before the items exist
            // (checked headlessly, not assumed) -- but it meant a machine with
            // only, say, 2025 installed opened on "2026 -- not found". The
            // selection is made here, explicitly, BEFORE the availability
            // text is first computed, so SelectedIndex is never -1 when read.
            int defaultIndex = Years.Length - 1;
            for (int i = Years.Length - 1; i >= 0; i--)
            {
                if (installed.Any(inst => inst.Year == Years[i])) { defaultIndex = i; break; }
            }
            VersionCombo.SelectedIndex = defaultIndex;
            VersionCombo.SelectionChanged += (s, e) => UpdateAvailability();
            UpdateAvailability();
        }

        /// <summary>The year for the current selection, never indexing with
        /// -1 (a cleared selection falls back to the newest year listed).</summary>
        private int CurrentYear()
        {
            int idx = VersionCombo.SelectedIndex;
            if (idx < 0 || idx >= Years.Length) idx = Years.Length - 1;
            return Years[idx];
        }

        private void UpdateAvailability()
        {
            int year = CurrentYear();
            var match = SolidWorksVersionHelper.FindForYear(year);
            AvailabilityText.Text = match != null
                ? $"SOLIDWORKS {year} found on this machine -- will be used directly."
                : $"SOLIDWORKS {year} was not found on this machine -- the currently running (or default) SolidWorks will be used instead.";
        }

        private void OnOk(object sender, RoutedEventArgs e)
        {
            SelectedYear = CurrentYear();
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
