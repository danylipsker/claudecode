using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Windows.Forms.Integration;
using GearGen.PyEngine;
using GearGen.UI;

namespace GearGen.SolidWorksAddin
{
    /// <summary>
    /// SolidWorks' Task Pane API hosts a COM-visible WinForms/ActiveX control,
    /// not a WPF UserControl directly. This wraps GearGen.UI.GearPanel (the
    /// exact same panel the standalone app uses) inside an ElementHost so it
    /// can be docked in the Task Pane -- one UI, two hosts.
    /// </summary>
    [ComVisible(true)]
    [Guid("6C6F0D3E-6E0B-4B9E-9C7D-6B6E9F4B2A11")]
    [ClassInterface(ClassInterfaceType.AutoDispatch)]
    [ProgId("GearGen.SolidWorksAddin.GearPanelHost")]
    public class GearPanelHost : UserControl
    {
        public GearPanel Panel { get; }

        public GearPanelHost()
        {
            var host = new ElementHost { Dock = DockStyle.Fill };
            Panel = new GearPanel();
            host.Child = Panel;
            Controls.Add(host);
        }

        public void Attach(PyGearEngine engine, Func<Geometry.GearParameters, string, System.Threading.Tasks.Task<string>> solidWorksHandler)
        {
            Panel.Attach(engine);
            Panel.ViewModel.SolidWorksExportAsync = solidWorksHandler;
            Panel.ViewModel.SolidWorksActionLabel = "Create Part in SolidWorks";
        }
    }
}
