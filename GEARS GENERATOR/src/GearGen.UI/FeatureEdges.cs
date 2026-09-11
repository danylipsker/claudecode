using System;
using System.Collections.Generic;
using System.Windows.Media.Media3D;

namespace GearGen.UI
{
    /// <summary>
    /// Extracts the feature edges of a tessellated model -- the "shaded with
    /// edges" outline a CAD viewer draws -- as line segments (pairs of points).
    ///
    /// The mesh is a triangle soup from an STL (every triangle carries its own
    /// three vertices), so vertices are first welded by position. Then every
    /// edge shared by exactly two triangles is kept only where the two face
    /// normals differ by more than the crease angle, while an edge with one
    /// triangle (an open mesh) or more than two (bodies sharing an edge) is
    /// always kept.
    ///
    /// The crease angle is what separates real geometry from tessellation:
    /// adjacent facets of a smoothly curved flank, fillet or cylinder differ by
    /// a few degrees (the tightest curve this app previews, a 3 mm rack
    /// mounting hole at the 0.02 mm preview tolerance, reaches ~19deg), while a
    /// tooth tip's corner, a rack's flank-to-land corner or an end face's
    /// outline is 55deg or more. 30deg therefore draws the tooth outlines on
    /// both faces, the tip and root corners along the face width, a
    /// herringbone's V apex and the bevel cone's rims -- and stays silent on
    /// tangent-continuous joins (fillet to flank, fillet to root land), which
    /// is right: those are not edges of the part.
    /// </summary>
    public static class FeatureEdges
    {
        public const double DefaultCreaseAngleDeg = 30.0;

        public static Point3DCollection Compute(Model3DGroup model, double creaseAngleDeg = DefaultCreaseAngleDeg)
        {
            var result = new Point3DCollection();
            double cosCrease = Math.Cos(creaseAngleDeg * Math.PI / 180.0);
            foreach (var child in model.Children)
                if (child is GeometryModel3D gm && gm.Geometry is MeshGeometry3D mesh)
                    AppendMesh(mesh, gm.Transform, cosCrease, result);
            result.Freeze();
            return result;
        }

        private static void AppendMesh(MeshGeometry3D mesh, Transform3D transform, double cosCrease, Point3DCollection result)
        {
            var positions = mesh.Positions;
            int n = positions.Count;
            if (n < 3) return;

            // Weld by position: 0.1 um is far below any feature of a gear and
            // far above the float noise of an STL.
            var ids = new int[n];
            var welded = new List<Point3D>(n / 3);
            var lookup = new Dictionary<(long, long, long), int>(n / 3);
            for (int i = 0; i < n; i++)
            {
                var p = positions[i];
                var key = ((long)Math.Round(p.X * 1e4), (long)Math.Round(p.Y * 1e4), (long)Math.Round(p.Z * 1e4));
                if (!lookup.TryGetValue(key, out int id))
                {
                    id = welded.Count;
                    welded.Add(p);
                    lookup[key] = id;
                }
                ids[i] = id;
            }

            var tri = mesh.TriangleIndices;
            bool indexed = tri != null && tri.Count >= 3;
            int triCount = indexed ? tri.Count / 3 : n / 3;
            int Idx(int k) => indexed ? tri[k] : k;

            // edge (a < b, welded ids) -> the unit normals of the triangles using it
            var edges = new Dictionary<(int, int), List<Vector3D>>(triCount * 2);
            for (int t = 0; t < triCount; t++)
            {
                int i0 = ids[Idx(3 * t)], i1 = ids[Idx(3 * t + 1)], i2 = ids[Idx(3 * t + 2)];
                if (i0 == i1 || i1 == i2 || i0 == i2) continue;  // degenerate sliver
                var normal = Vector3D.CrossProduct(welded[i1] - welded[i0], welded[i2] - welded[i0]);
                if (normal.LengthSquared < 1e-18) continue;
                normal.Normalize();
                AddEdge(edges, i0, i1, normal);
                AddEdge(edges, i1, i2, normal);
                AddEdge(edges, i2, i0, normal);
            }

            bool hasTransform = transform != null && !transform.Value.IsIdentity;
            foreach (var kv in edges)
            {
                var normals = kv.Value;
                bool feature = normals.Count != 2 || Vector3D.DotProduct(normals[0], normals[1]) < cosCrease;
                if (!feature) continue;
                var a = welded[kv.Key.Item1];
                var b = welded[kv.Key.Item2];
                if (hasTransform)
                {
                    a = transform.Transform(a);
                    b = transform.Transform(b);
                }
                result.Add(a);
                result.Add(b);
            }
        }

        private static void AddEdge(Dictionary<(int, int), List<Vector3D>> edges, int a, int b, Vector3D normal)
        {
            var key = a < b ? (a, b) : (b, a);
            if (!edges.TryGetValue(key, out var list))
            {
                list = new List<Vector3D>(2);
                edges[key] = list;
            }
            list.Add(normal);
        }
    }
}
