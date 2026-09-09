using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace GearGen.UI
{
    /// <summary>A numeric input with up/down spin buttons, mouse-wheel support,
    /// min/max clamping, and a decimal-places display format -- the "any widget
    /// with spinners for any parameter" control used throughout the app.</summary>
    public partial class NumericSpinner : UserControl
    {
        public static readonly DependencyProperty ValueProperty = DependencyProperty.Register(
            nameof(Value), typeof(double), typeof(NumericSpinner),
            new FrameworkPropertyMetadata(0.0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, OnValueChanged));

        public static readonly DependencyProperty MinimumProperty = DependencyProperty.Register(
            nameof(Minimum), typeof(double), typeof(NumericSpinner), new PropertyMetadata(double.MinValue));

        public static readonly DependencyProperty MaximumProperty = DependencyProperty.Register(
            nameof(Maximum), typeof(double), typeof(NumericSpinner), new PropertyMetadata(double.MaxValue));

        public static readonly DependencyProperty StepProperty = DependencyProperty.Register(
            nameof(Step), typeof(double), typeof(NumericSpinner), new PropertyMetadata(1.0));

        public static readonly DependencyProperty DecimalPlacesProperty = DependencyProperty.Register(
            nameof(DecimalPlaces), typeof(int), typeof(NumericSpinner), new PropertyMetadata(2, OnValueChanged));

        public static readonly DependencyProperty LabelProperty = DependencyProperty.Register(
            nameof(Label), typeof(string), typeof(NumericSpinner), new PropertyMetadata(""));

        public static readonly DependencyProperty SuffixProperty = DependencyProperty.Register(
            nameof(Suffix), typeof(string), typeof(NumericSpinner), new PropertyMetadata(""));

        public double Value { get => (double)GetValue(ValueProperty); set => SetValue(ValueProperty, Clamp(value)); }
        public double Minimum { get => (double)GetValue(MinimumProperty); set => SetValue(MinimumProperty, value); }
        public double Maximum { get => (double)GetValue(MaximumProperty); set => SetValue(MaximumProperty, value); }
        public double Step { get => (double)GetValue(StepProperty); set => SetValue(StepProperty, value); }
        public int DecimalPlaces { get => (int)GetValue(DecimalPlacesProperty); set => SetValue(DecimalPlacesProperty, value); }
        public string Label { get => (string)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }
        public string Suffix { get => (string)GetValue(SuffixProperty); set => SetValue(SuffixProperty, value); }
        public string SuffixDisplay => string.IsNullOrEmpty(Suffix) ? "" : Suffix;

        private bool _updatingText;

        public NumericSpinner()
        {
            InitializeComponent();
            Loaded += (s, e) => RefreshText();
        }

        private double Clamp(double v)
        {
            if (v < Minimum) v = Minimum;
            if (v > Maximum) v = Maximum;
            return v;
        }

        private static void OnValueChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            ((NumericSpinner)d).RefreshText();
        }

        private void RefreshText()
        {
            if (PART_TextBox == null) return;
            _updatingText = true;
            PART_TextBox.Text = Value.ToString("F" + DecimalPlaces, CultureInfo.InvariantCulture);
            _updatingText = false;
        }

        private void CommitText()
        {
            if (double.TryParse(PART_TextBox.Text, NumberStyles.Float, CultureInfo.InvariantCulture, out double v))
            {
                Value = Clamp(v);
            }
            else
            {
                RefreshText(); // revert to last valid value
            }
        }

        private void OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (_updatingText) return;
            // live-parse without clamping so the user can type freely; commit happens on Enter/blur
        }

        private void OnLostFocus(object sender, RoutedEventArgs e) => CommitText();

        private void OnKeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                CommitText();
                Keyboard.ClearFocus();
                FocusManager.SetFocusedElement(FocusManager.GetFocusScope(this), null);
                e.Handled = true;
            }
            else if (e.Key == Key.Up) { Value = Clamp(Value + Step); e.Handled = true; }
            else if (e.Key == Key.Down) { Value = Clamp(Value - Step); e.Handled = true; }
        }

        private void OnUpClick(object sender, RoutedEventArgs e) => Value = Clamp(Value + Step);
        private void OnDownClick(object sender, RoutedEventArgs e) => Value = Clamp(Value - Step);

        private void OnMouseWheel(object sender, MouseWheelEventArgs e)
        {
            if (!PART_TextBox.IsFocused) return;
            Value = Clamp(Value + (e.Delta > 0 ? Step : -Step));
            e.Handled = true;
        }
    }
}
