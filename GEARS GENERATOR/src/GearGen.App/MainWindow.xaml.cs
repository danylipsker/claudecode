using System.Windows;

namespace GearGen.App
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            Panel.Attach(App.Engine);
            Panel.ViewModel.SolidWorksExportAsync = SolidWorksExporter.ExportToSolidWorksAsync;
            Panel.ViewModel.SolidWorksActionLabel = "Export to SolidWorks (.sldprt)";
        }
    }
}
