import { useMemo } from "react";
import { Vector3 } from "three";
import verb from "verb-nurbs";

export interface UseOffsetCurveOptions {
  curve: verb.geom.NurbsCurve | null;
  distance: number;
  planeNormal?: [number, number, number];
  samples?: number;
  degree?: number;
  resolution?: number;
}

export interface UseOffsetCurveResult {
  curve: verb.geom.NurbsCurve | null;
  points: Vector3[];
}

export function useOffsetCurve({
  curve: sourceCurve,
  distance,
  planeNormal = [0, 0, 1],
  samples = 50,
  degree = 3,
  resolution = 50,
}: UseOffsetCurveOptions): UseOffsetCurveResult {
  const offsetCurve = useMemo(() => {
    if (!sourceCurve || distance === 0) return null;

    try {
      const normal = new Vector3(...planeNormal).normalize();
      const offsetPoints: number[][] = [];

      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const pt = sourceCurve.point(t);
        const tan = sourceCurve.tangent(t);

        const tangentVec = new Vector3(tan[0], tan[1], tan[2]).normalize();
        const offsetDir = new Vector3().crossVectors(tangentVec, normal).normalize();

        offsetPoints.push([
          pt[0] + offsetDir.x * distance,
          pt[1] + offsetDir.y * distance,
          pt[2] + offsetDir.z * distance,
        ]);
      }

      return verb.geom.NurbsCurve.byPoints(
        offsetPoints,
        Math.min(degree, offsetPoints.length - 1)
      );
    } catch (error) {
      console.error("useOffsetCurve: Error creating offset curve:", error);
      return null;
    }
  }, [sourceCurve, distance, planeNormal, samples, degree]);

  const points = useMemo(() => {
    if (!offsetCurve) return [];
    return Array.from({ length: resolution + 1 }, (_, i) => {
      const t = i / resolution;
      const pt = offsetCurve.point(t);
      return new Vector3(pt[0], pt[1], pt[2]);
    });
  }, [offsetCurve, resolution]);

  return { curve: offsetCurve, points };
}
