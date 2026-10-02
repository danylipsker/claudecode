/* Curves Workshop · data/manifest.js
 *
 * The book, as a list: every section of Yates' Handbook with its pages, and every
 * numbered figure with the page it is printed on. tools/validate.js checks that each
 * figure number has at least one figure file (fig-NNN, or fig-NNNa, fig-NNNb, ...).
 * Panels: how many parts the figure has in the book when it is more than one drawing
 * (a, b, c ...). A writer who finds a different count on the page follows the page.
 */
(function (root) {
  const C = root.Curves = root.Curves || {};
  C.manifest = {
    groups: {
      analysis: 'Analysis and systems',
      curves: 'Curves'
    },
    sections: [
      { id: 'astroid', title: 'Astroid', pages: [1, 3], group: 'curves', figs: [1, 2] },
      { id: 'cardioid', title: 'Cardioid', pages: [4, 7], group: 'curves', figs: [3, 5] },
      { id: 'cassinian', title: 'Cassinian Curves', pages: [8, 11], group: 'curves', figs: [6, 9] },
      { id: 'catenary', title: 'Catenary', pages: [12, 14], group: 'curves', figs: [10, 11] },
      { id: 'caustics', title: 'Caustics', pages: [15, 20], group: 'analysis', figs: [12, 17] },
      { id: 'circle', title: 'Circle', pages: [21, 25], group: 'curves', figs: [18, 22] },
      { id: 'cissoid', title: 'Cissoid', pages: [26, 30], group: 'curves', figs: [23, 26] },
      { id: 'conchoid', title: 'Conchoid', pages: [31, 33], group: 'curves', figs: [27, 29] },
      { id: 'cones', title: 'Cones', pages: [34, 35], group: 'curves', figs: [30, 30] },
      { id: 'conics', title: 'Conics', pages: [36, 55], group: 'curves', figs: [31, 55] },
      { id: 'cubic-parabola', title: 'Cubic Parabola', pages: [56, 59], group: 'curves', figs: [56, 59] },
      { id: 'curvature', title: 'Curvature', pages: [60, 64], group: 'analysis', figs: [60, 61] },
      { id: 'cycloid', title: 'Cycloid', pages: [65, 70], group: 'curves', figs: [62, 68] },
      { id: 'deltoid', title: 'Deltoid', pages: [71, 74], group: 'curves', figs: [69, 69] },
      { id: 'envelopes', title: 'Envelopes', pages: [75, 80], group: 'analysis', figs: [70, 77] },
      { id: 'epi-hypo-cycloids', title: 'Epi- and Hypo-Cycloids', pages: [81, 85], group: 'curves', figs: [78, 79] },
      { id: 'evolutes', title: 'Evolutes', pages: [86, 92], group: 'analysis', figs: [80, 85] },
      { id: 'exponential', title: 'Exponential Curves', pages: [93, 97], group: 'curves', figs: [86, 88] },
      { id: 'folium', title: 'Folium of Descartes', pages: [98, 99], group: 'curves', figs: [89, 89] },
      { id: 'discontinuous', title: 'Functions with Discontinuous Properties', pages: [100, 107], group: 'analysis', figs: [90, 103] },
      { id: 'glissettes', title: 'Glissettes', pages: [108, 112], group: 'analysis', figs: [104, 110] },
      { id: 'hyperbolic', title: 'Hyperbolic Functions', pages: [113, 118], group: 'curves', figs: [111, 112] },
      { id: 'instantaneous-center', title: 'Instantaneous Center of Rotation and the Construction of Some Tangents', pages: [119, 122], group: 'analysis', figs: [113, 120] },
      { id: 'intrinsic', title: 'Intrinsic Equations', pages: [123, 126], group: 'analysis', figs: [121, 121] },
      { id: 'inversion', title: 'Inversion', pages: [127, 134], group: 'analysis', figs: [122, 133] },
      { id: 'involutes', title: 'Involutes', pages: [135, 137], group: 'analysis', figs: [134, 135] },
      { id: 'isoptic', title: 'Isoptic Curves', pages: [138, 140], group: 'analysis', figs: [136, 137] },
      { id: 'kieroid', title: 'Kieroid', pages: [141, 142], group: 'curves', figs: [138, 139] },
      { id: 'lemniscate', title: 'Lemniscate of Bernoulli', pages: [143, 147], group: 'curves', figs: [140, 142] },
      { id: 'limacon', title: 'Limacon of Pascal', pages: [148, 151], group: 'curves', figs: [143, 145] },
      { id: 'nephroid', title: 'Nephroid', pages: [152, 154], group: 'curves', figs: [146, 146] },
      { id: 'parallel', title: 'Parallel Curves', pages: [155, 159], group: 'analysis', figs: [147, 150] },
      { id: 'pedal-curves', title: 'Pedal Curves', pages: [160, 165], group: 'analysis', figs: [151, 153] },
      { id: 'pedal-equations', title: 'Pedal Equations', pages: [166, 169], group: 'analysis', figs: [154, 155] },
      { id: 'pursuit', title: 'Pursuit Curve', pages: [170, 171], group: 'curves', figs: [156, 156] },
      { id: 'radial', title: 'Radial Curves', pages: [172, 174], group: 'analysis', figs: [157, 158] },
      { id: 'roulettes', title: 'Roulettes', pages: [175, 185], group: 'analysis', figs: [159, 169] },
      { id: 'semi-cubic-parabola', title: 'Semi-Cubic Parabola', pages: [186, 187], group: 'curves', figs: [170, 170] },
      { id: 'sketching', title: 'Sketching', pages: [188, 205], group: 'analysis', figs: [171, 182] },
      { id: 'spirals', title: 'Spirals', pages: [206, 216], group: 'curves', figs: [183, 194] },
      { id: 'strophoid', title: 'Strophoid', pages: [217, 220], group: 'curves', figs: [195, 198] },
      { id: 'tractrix', title: 'Tractrix', pages: [221, 224], group: 'curves', figs: [199, 200] },
      { id: 'trigonometric', title: 'Trigonometric Functions', pages: [225, 232], group: 'curves', figs: [201, 206] },
      { id: 'trochoids', title: 'Trochoids', pages: [233, 236], group: 'analysis', figs: [207, 210] },
      { id: 'witch', title: 'Witch of Agnesi', pages: [237, 238], group: 'curves', figs: [211, 211] }
    ],
    /* figure number -> [book page, panels seen on the page] (panels 1 = a single drawing) */
    figures: {
      1: [1, 2], 2: [2, 2], 3: [4, 2], 4: [6, 1], 5: [6, 1], 6: [8, 1], 7: [9, 1], 8: [9, 1], 9: [10, 1], 10: [12, 1],
      11: [13, 2], 12: [15, 1], 13: [16, 6], 14: [17, 2], 15: [18, 1], 16: [19, 1], 17: [19, 1], 18: [22, 2], 19: [23, 1], 20: [23, 1],
      21: [24, 1], 22: [25, 1], 23: [26, 1], 24: [27, 1], 25: [28, 1], 26: [28, 1], 27: [31, 1], 28: [31, 1], 29: [33, 1], 30: [34, 1],
      31: [36, 3], 32: [37, 1], 33: [38, 3], 34: [39, 1], 35: [40, 1], 36: [41, 1], 37: [42, 1], 38: [43, 2], 39: [44, 2], 40: [45, 1],
      41: [46, 1], 42: [46, 1], 43: [47, 1], 44: [47, 1], 45: [48, 1], 46: [48, 1], 47: [49, 3], 48: [49, 3], 49: [50, 3], 50: [50, 3],
      51: [51, 1], 52: [51, 1], 53: [52, 1], 54: [53, 3], 55: [55, 1], 56: [56, 4], 57: [57, 1], 58: [58, 1], 59: [58, 1], 60: [60, 1],
      61: [61, 1], 62: [65, 1], 63: [66, 1], 64: [67, 1], 65: [68, 1], 66: [68, 1], 67: [69, 1], 68: [70, 1], 69: [71, 2], 70: [75, 1],
      71: [76, 1], 72: [76, 1], 73: [77, 1], 74: [78, 1], 75: [78, 3], 76: [80, 1], 77: [80, 1], 78: [81, 2], 79: [82, 2], 80: [86, 1],
      81: [87, 1], 82: [88, 3], 83: [89, 4], 84: [90, 6], 85: [92, 1], 86: [93, 2], 87: [95, 2], 88: [96, 1], 89: [98, 1], 90: [100, 1],
      91: [100, 1], 92: [101, 1], 93: [101, 1], 94: [102, 1], 95: [102, 1], 96: [103, 1], 97: [103, 1], 98: [104, 1], 99: [104, 1], 100: [105, 1],
      101: [106, 1], 102: [106, 1], 103: [107, 1], 104: [108, 3], 105: [109, 1], 106: [109, 1], 107: [110, 1], 108: [110, 1], 109: [111, 1], 110: [112, 1],
      111: [113, 3], 112: [115, 2], 113: [119, 1], 114: [119, 1], 115: [120, 1], 116: [120, 1], 117: [121, 1], 118: [121, 1], 119: [122, 1], 120: [122, 1],
      121: [124, 1], 122: [127, 1], 123: [128, 2], 124: [129, 1], 125: [129, 1], 126: [130, 1], 127: [130, 3], 128: [131, 1], 129: [131, 2], 130: [132, 2],
      131: [133, 1], 132: [133, 1], 133: [134, 1], 134: [135, 2], 135: [137, 1], 136: [138, 1], 137: [139, 1], 138: [141, 1], 139: [142, 3], 140: [143, 2],
      141: [145, 1], 142: [146, 2], 143: [148, 2], 144: [150, 2], 145: [151, 1], 146: [152, 1], 147: [155, 1], 148: [156, 1], 149: [157, 8], 150: [158, 1],
      151: [160, 2], 152: [161, 1], 153: [162, 1], 154: [166, 1], 155: [167, 1], 156: [170, 1], 157: [172, 2], 158: [173, 3], 159: [175, 1], 160: [176, 1],
      161: [177, 1], 162: [178, 1], 163: [180, 1], 164: [180, 1], 165: [181, 1], 166: [181, 1], 167: [182, 1], 168: [183, 2], 169: [184, 2], 170: [187, 4],
      171: [188, 2], 172: [189, 3], 173: [190, 2], 174: [191, 1], 175: [192, 3], 176: [193, 1], 177: [195, 2], 178: [196, 2], 179: [197, 2], 180: [199, 6],
      181: [200, 6], 182: [201, 1], 183: [206, 1], 184: [207, 1], 185: [208, 1], 186: [209, 1], 187: [210, 2], 188: [211, 1], 189: [211, 1], 190: [212, 1],
      191: [213, 1], 192: [213, 1], 193: [215, 1], 194: [215, 1], 195: [217, 1], 196: [217, 2], 197: [218, 2], 198: [219, 1], 199: [221, 1], 200: [223, 1],
      201: [225, 1], 202: [226, 1], 203: [229, 2], 204: [230, 1], 205: [231, 4], 206: [232, 1], 207: [233, 1], 208: [234, 1], 209: [235, 2], 210: [236, 2],
      211: [237, 1]
    }
  };
  C.sectionOfFig = function (n) {
    return C.manifest.sections.find(s => n >= s.figs[0] && n <= s.figs[1]) || null;
  };
})(typeof window !== 'undefined' ? window : globalThis);
