import { useMemo, useCallback } from "react";
import { Vector3 } from "three";
import { NurbsCurve } from "../core";
import { generateUniformKnots } from "../utils/nurbs";

export interface UseNurbsCurveOptions {
  points: number[][];
  degree?: number;
  weights?: number[];
  knots?: number[];
  resolution?: number;
}

export interface UseNurbsCurveResult {
  curve: NurbsCurve | null;
  points: Vector3[];
  point: (t: number) => Vector3 | null;
  tangent: (t: number) => Vector3 | null;
  length: () => number;
  closestParam: (point: Vector3) => number | null;
}

export function useNurbsCurve({
  points,
  degree = 3,
  weights,
  knots,
  resolution = 50,
}: UseNurbsCurveOptions): UseNurbsCurveResult {
  const curve = useMemo(() => {
    if (!points || points.length < 2) return null;
    try {
      const resolvedKnots = knots ?? generateUniformKnots(points.length, degree);
      const resolvedWeights = weights ?? Array(points.length).fill(1);
      return NurbsCurve.byKnotsControlPointsWeights(
        degree,
        resolvedKnots,
        points,
        resolvedWeights
      );
    } catch (error) {
      console.error("useNurbsCurve: Error creating curve:", error);
      return null;
    }
  }, [points, degree, weights, knots]);

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

  const length = useCallback((): number => {
    if (!curve) return 0;
    try {
      return curve.length();
    } catch {
      return 0;
    }
  }, [curve]);

  const closestParam = useCallback(
    (pt: Vector3): number | null => {
      if (!curve) return null;
      try {
        return curve.closestParam([pt.x, pt.y, pt.z]);
      } catch {
        return null;
      }
    },
    [curve]
  );

  return {
    curve,
    points: sampledPoints,
    point,
    tangent,
    length,
    closestParam,
  };
}
