using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
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
    /// can be docked in the Task Pane -- one UI, two hosts -- and, under it,
    /// the LIBRARY: every part and assembly the add-in has created (the
    /// library folder, Documents\GEARS GENERATOR), listed so it can be
    /// DRAGGED straight into SolidWorks. A drag from the list is an OLE file
    /// drop (DataFormats.FileDrop), the same thing Windows Explorer does, and
    /// SolidWorks takes it the same way: dropped on an open assembly's
    /// graphics area the part or sub-assembly is inserted as a component;
    /// dropped on an empty window it is opened.
    /// </summary>
    [ComVisible(true)]
    [Guid("6C6F0D3E-6E0B-4B9E-9C7D-6B6E9F4B2A11")]
    [ClassInterface(ClassInterfaceType.AutoDispatch)]
    [ProgId("GearGen.SolidWorksAddin.GearPanelHost")]
    public class GearPanelHost : UserControl
    {
        public GearPanel Panel { get; }

        private readonly ListView _library;
        private readonly Label _libraryTitle;

        /// <summary>Where "Create in SolidWorks" saves by default and what the
        /// library lists: Documents\GEARS GENERATOR, created on first use.</summary>
        public static string LibraryFolder =>
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "GEARS GENERATOR");

        public GearPanelHost()
        {
            var host = new ElementHost { Dock = DockStyle.Fill };
            Panel = new GearPanel();
            host.Child = Panel;

            // the library strip, docked under the panel
            var strip = new System.Windows.Forms.Panel { Dock = DockStyle.Bottom, Height = 170, BackColor = Color.FromArgb(243, 244, 246), Padding = new Padding(8, 6, 8, 6) };
            _libraryTitle = new Label
            {
                Dock = DockStyle.Top, Height = 34, AutoSize = false,
                Text = "LIBRARY -- drag a part or an assembly from here into SolidWorks (onto an open assembly to insert it, onto an empty window to open it)",
                Font = new Font("Segoe UI", 8.0f), ForeColor = Color.FromArgb(107, 114, 128),
            };
            var buttons = new FlowLayoutPanel { Dock = DockStyle.Bottom, Height = 30, FlowDirection = FlowDirection.LeftToRight, WrapContents = false };
            var refresh = new Button { Text = "Refresh", Width = 80, Height = 24, Font = new Font("Segoe UI", 8.0f) };
            var openFolder = new Button { Text = "Open folder", Width = 90, Height = 24, Font = new Font("Segoe UI", 8.0f) };
            refresh.Click += (s, e) => RefreshLibrary();
            openFolder.Click += (s, e) =>
            {
                Directory.CreateDirectory(LibraryFolder);
                try { System.Diagnostics.Process.Start("explorer.exe", "\"" + LibraryFolder + "\""); } catch { /* best effort */ }
            };
            buttons.Controls.Add(refresh);
            buttons.Controls.Add(openFolder);
            _library = new ListView
            {
                Dock = DockStyle.Fill, View = View.Details, FullRowSelect = true, MultiSelect = false,
                HeaderStyle = ColumnHeaderStyle.Nonclickable, Font = new Font("Segoe UI", 8.5f), BorderStyle = BorderStyle.FixedSingle,
            };
            _library.Columns.Add("File", 260);
            _library.Columns.Add("Kind", 70);
            _library.Columns.Add("Saved", 110);
            _library.ItemDrag += OnLibraryItemDrag;
            _library.DoubleClick += (s, e) => { var f = SelectedFile(); if (f != null) try { System.Diagnostics.Process.Start(f); } catch { } };
            strip.Controls.Add(_library);
            strip.Controls.Add(buttons);
            strip.Controls.Add(_libraryTitle);

            Controls.Add(host);
            Controls.Add(strip);
            RefreshLibrary();
        }

        public void Attach(PyGearEngine engine, Func<Geometry.GearParameters, string, System.Threading.Tasks.Task<string>> solidWorksHandler)
        {
            Panel.Attach(engine);
            Panel.ViewModel.SolidWorksExportAsync = solidWorksHandler;
            Panel.ViewModel.SolidWorksActionLabel = "Create in SolidWorks (part or assembly)";
        }

        private string SelectedFile() => _library.SelectedItems.Count > 0 ? _library.SelectedItems[0].Tag as string : null;

        /// <summary>Re-read the library folder: parts and assemblies, newest first.</summary>
        public void RefreshLibrary()
        {
            _library.BeginUpdate();
            _library.Items.Clear();
            try
            {
                if (Directory.Exists(LibraryFolder))
                {
                    var files = Directory.GetFiles(LibraryFolder, "*.sld*")
                        .Where(f => f.EndsWith(".sldprt", StringComparison.OrdinalIgnoreCase) || f.EndsWith(".sldasm", StringComparison.OrdinalIgnoreCase))
                        .Where(f => !Path.GetFileName(f).StartsWith("~$"))
                        .OrderByDescending(File.GetLastWriteTime);
                    foreach (var f in files)
                    {
                        var item = new ListViewItem(Path.GetFileName(f)) { Tag = f };
                        item.SubItems.Add(f.EndsWith(".sldasm", StringComparison.OrdinalIgnoreCase) ? "assembly" : "part");
                        item.SubItems.Add(File.GetLastWriteTime(f).ToString("yyyy-MM-dd HH:mm"));
                        _library.Items.Add(item);
                    }
                }
            }
            finally { _library.EndUpdate(); }
            _libraryTitle.Text = _library.Items.Count == 0
                ? "LIBRARY (" + LibraryFolder + ") -- empty: 'Create in SolidWorks' saves here, then drag from this list into SolidWorks"
                : "LIBRARY -- drag a part or an assembly from here into SolidWorks (onto an open assembly to insert it, onto an empty window to open it)";
        }

        /// <summary>Select a file in the list (after creating it) so it is the obvious thing to drag.</summary>
        public void HighlightInLibrary(string path)
        {
            RefreshLibrary();
            foreach (ListViewItem item in _library.Items)
                if (string.Equals(item.Tag as string, path, StringComparison.OrdinalIgnoreCase)) { item.Selected = true; item.EnsureVisible(); }
        }

        private void OnLibraryItemDrag(object sender, ItemDragEventArgs e)
        {
            var item = e.Item as ListViewItem;
            var path = item?.Tag as string;
            if (path == null || !File.Exists(path)) return;
            var data = new DataObject(DataFormats.FileDrop, new[] { path });
            _library.DoDragDrop(data, DragDropEffects.Copy | DragDropEffects.Link);
        }
    }
}
