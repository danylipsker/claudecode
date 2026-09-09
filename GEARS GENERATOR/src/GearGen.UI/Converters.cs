using System;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;

namespace GearGen.UI
{
    public class ErrorColorConverter : IValueConverter
    {
        private static readonly SolidColorBrush Error = new SolidColorBrush(Color.FromRgb(0xDC, 0x26, 0x26));
        private static readonly SolidColorBrush Normal = new SolidColorBrush(Color.FromRgb(0x6B, 0x72, 0x80));

        static ErrorColorConverter() { Error.Freeze(); Normal.Freeze(); }

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture) =>
            (value is bool b && b) ? Error : Normal;

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) =>
            throw new NotSupportedException();
    }
}
