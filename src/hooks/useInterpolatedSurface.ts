import { useMemo } from "react";
import verb from "verb-nurbs";
import type { SurfaceGeometry } from "./useNurbsSurface";

export interface UseInterpolatedSurfaceOptions {
  points: number[][][]; // grid[row][col] = [x,y,z]
  degreeU?: number;
  degreeV?: number;
  resolutionU?: number;
  resolutionV?: number;
}

export interface UseInterpolatedSurfaceResult {
  surface: verb.geom.NurbsSurface | null;
  geometry: SurfaceGeometry | null;
}

export function useInterpolatedSurface({
  points,
  degreeU = 3,
  degreeV = 3,
  resolutionU = 20,
  resolutionV = 20,
}: UseInterpolatedSurfaceOptions): UseInterpolatedSurfaceResult {
  const surface = useMemo(() => {
    if (!points || points.length < 2) return null;
    for (const row of points) {
      if (!row || row.length < 2) return null;
    }

    try {
      // Interpolate each row of points into a curve
      const rowCurves = points.map((row) =>
        verb.geom.NurbsCurve.byPoints(row, Math.min(degreeU, row.length - 1))
      );

      // Loft through all row curves
      return verb.geom.NurbsSurface.byLoftingCurves(
        rowCurves,
        Math.min(degreeV, rowCurves.length - 1)
      );
    } catch (error) {
      console.error("useInterpolatedSurface: Error creating surface:", error);
      return null;
    }
  }, [points, degreeU, degreeV]);

  const geometry = useMemo((): SurfaceGeometry | null => {
    if (!surface) return null;

    try {
      const vertCount = (resolutionU + 1) * (resolutionV + 1);
      const vertices = new Float32Array(vertCount * 3);
      const normals = new Float32Array(vertCount * 3);
      const uvs = new Float32Array(vertCount * 2);

      let vi = 0, ni = 0, ui = 0;
      for (let i = 0; i <= resolutionU; i++) {
        for (let j = 0; j <= resolutionV; j++) {
          const u = i / resolutionU;
          const v = j / resolutionV;
          const pt = surface.point(u, v);
          vertices[vi++] = pt[0];
          vertices[vi++] = pt[1];
          vertices[vi++] = pt[2];

          try {
            const n = surface.normal(u, v);
            const len = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
            if (len > 0) {
              normals[ni++] = n[0] / len;
              normals[ni++] = n[1] / len;
              normals[ni++] = n[2] / len;
            } else {
              normals[ni++] = 0; normals[ni++] = 1; normals[ni++] = 0;
            }
          } catch {
            normals[ni++] = 0; normals[ni++] = 1; normals[ni++] = 0;
          }

          uvs[ui++] = u;
          uvs[ui++] = v;
        }
      }

      const idxCount = resolutionU * resolutionV * 6;
      const indices = new Uint32Array(idxCount);
      let idx = 0;
      for (let i = 0; i < resolutionU; i++) {
        for (let j = 0; j < resolutionV; j++) {
          const a = i * (resolutionV + 1) + j;
          const b = a + 1;
          const c = (i + 1) * (resolutionV + 1) + j;
          const d = c + 1;
          indices[idx++] = a; indices[idx++] = b; indices[idx++] = c;
          indices[idx++] = b; indices[idx++] = d; indices[idx++] = c;
        }
      }

      return { vertices, normals, uvs, indices };
    } catch (error) {
      console.error("useInterpolatedSurface: Error generating geometry:", error);
      return null;
    }
  }, [surface, resolutionU, resolutionV]);

  return { surface, geometry };
}
