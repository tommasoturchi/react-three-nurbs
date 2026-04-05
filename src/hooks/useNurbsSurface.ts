import { useMemo, useCallback } from "react";
import { Vector3 } from "three";
import verb from "verb-nurbs";
import { generateUniformKnots } from "../utils/nurbs";

export interface UseNurbsSurfaceOptions {
  controlPoints: number[][][];
  weights: number[][];
  degreeU: number;
  degreeV: number;
  knotsU?: number[];
  knotsV?: number[];
  resolutionU?: number;
  resolutionV?: number;
}

export interface SurfaceGeometry {
  vertices: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
}

export interface UseNurbsSurfaceResult {
  surface: verb.geom.NurbsSurface | null;
  geometry: SurfaceGeometry | null;
  point: (u: number, v: number) => Vector3 | null;
  normal: (u: number, v: number) => Vector3 | null;
  closestParam: (point: Vector3) => [number, number] | null;
}

export function useNurbsSurface({
  controlPoints,
  weights,
  degreeU,
  degreeV,
  knotsU,
  knotsV,
  resolutionU = 20,
  resolutionV = 20,
}: UseNurbsSurfaceOptions): UseNurbsSurfaceResult {
  const surface = useMemo(() => {
    if (!controlPoints || controlPoints.length === 0) return null;
    try {
      const resolvedKnotsU = knotsU ?? generateUniformKnots(controlPoints.length, degreeU);
      const resolvedKnotsV = knotsV ?? generateUniformKnots(controlPoints[0].length, degreeV);
      return verb.geom.NurbsSurface.byKnotsControlPointsWeights(
        degreeU,
        degreeV,
        resolvedKnotsU,
        resolvedKnotsV,
        controlPoints,
        weights
      );
    } catch (error) {
      console.error("useNurbsSurface: Error creating surface:", error);
      return null;
    }
  }, [controlPoints, weights, degreeU, degreeV, knotsU, knotsV]);

  const geometry = useMemo((): SurfaceGeometry | null => {
    if (!surface) return null;
    try {
      const vertCount = (resolutionU + 1) * (resolutionV + 1);
      const vertices = new Float32Array(vertCount * 3);
      const normals = new Float32Array(vertCount * 3);
      const uvs = new Float32Array(vertCount * 2);

      let vi = 0;
      let ni = 0;
      let ui = 0;

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
              normals[ni++] = 0;
              normals[ni++] = 1;
              normals[ni++] = 0;
            }
          } catch {
            normals[ni++] = 0;
            normals[ni++] = 1;
            normals[ni++] = 0;
          }

          uvs[ui++] = u;
          uvs[ui++] = v;
        }
      }

      const indexCount = resolutionU * resolutionV * 6;
      const indices = new Uint32Array(indexCount);
      let idx = 0;
      for (let i = 0; i < resolutionU; i++) {
        for (let j = 0; j < resolutionV; j++) {
          const a = i * (resolutionV + 1) + j;
          const b = a + 1;
          const c = (i + 1) * (resolutionV + 1) + j;
          const d = c + 1;
          indices[idx++] = a;
          indices[idx++] = b;
          indices[idx++] = c;
          indices[idx++] = b;
          indices[idx++] = d;
          indices[idx++] = c;
        }
      }

      return { vertices, normals, uvs, indices };
    } catch (error) {
      console.error("useNurbsSurface: Error generating geometry:", error);
      return null;
    }
  }, [surface, resolutionU, resolutionV]);

  const point = useCallback(
    (u: number, v: number): Vector3 | null => {
      if (!surface) return null;
      const pt = surface.point(u, v);
      return new Vector3(pt[0], pt[1], pt[2]);
    },
    [surface]
  );

  const normal = useCallback(
    (u: number, v: number): Vector3 | null => {
      if (!surface) return null;
      try {
        const n = surface.normal(u, v);
        return new Vector3(n[0], n[1], n[2]).normalize();
      } catch {
        return null;
      }
    },
    [surface]
  );

  const closestParam = useCallback(
    (pt: Vector3): [number, number] | null => {
      if (!surface) return null;
      try {
        const uv = surface.closestParam([pt.x, pt.y, pt.z]);
        return [uv[0], uv[1]];
      } catch {
        return null;
      }
    },
    [surface]
  );

  return { surface, geometry, point, normal, closestParam };
}
