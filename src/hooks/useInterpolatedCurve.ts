import { useMemo, useCallback } from "react";
import { Vector3 } from "three";
import verb from "verb-nurbs";

export interface UseInterpolatedCurveOptions {
  throughPoints: number[][];
  degree?: number;
  resolution?: number;
}

export interface UseInterpolatedCurveResult {
  curve: verb.geom.NurbsCurve | null;
  points: Vector3[];
  point: (t: number) => Vector3 | null;
  tangent: (t: number) => Vector3 | null;
}

export function useInterpolatedCurve({
  throughPoints,
  degree = 3,
  resolution = 50,
}: UseInterpolatedCurveOptions): UseInterpolatedCurveResult {
  const curve = useMemo(() => {
    if (!throughPoints || throughPoints.length < 2) return null;
    try {
      return verb.geom.NurbsCurve.byPoints(throughPoints, degree);
    } catch (error) {
      console.error("useInterpolatedCurve: Error creating curve:", error);
      return null;
    }
  }, [throughPoints, degree]);

  const sampledPoints = useMemo(() => {
    if (!curve) return [];
    return Array.from({ length: resolution + 1 }, (_, i) => {
      const t = i / resolution;
      const pt = curve.point(t);
      return new Vector3(pt[0], pt[1], pt[2]);
    });
  }, [curve, resolution]);

  const point = useCallback(
    (t: number): Vector3 | null => {
      if (!curve) return null;
      const pt = curve.point(t);
      return new Vector3(pt[0], pt[1], pt[2]);
    },
    [curve]
  );

  const tangent = useCallback(
    (t: number): Vector3 | null => {
      if (!curve) return null;
      try {
        const tan = curve.tangent(t);
        return new Vector3(tan[0], tan[1], tan[2]).normalize();
      } catch {
        return null;
      }
    },
    [curve]
  );

  return { curve, points: sampledPoints, point, tangent };
}
