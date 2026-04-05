import { useMemo } from "react";
import { Vector3 } from "three";
import verb from "verb-nurbs";
import { Line } from "@react-three/drei";
import type { LineProps } from "@react-three/drei";
import { generateUniformKnots } from "../utils/nurbs";

export interface OffsetCurveProps
  extends Omit<LineProps, "points" | "resolution"> {
  /** Source curve to offset. Provide either this or sourceCurve. */
  sourcePoints?: number[][];
  sourceDegree?: number;
  sourceKnots?: number[];
  sourceWeights?: number[];
  /** Or provide a verb NurbsCurve directly */
  sourceCurve?: verb.geom.NurbsCurve;
  distance: number;
  planeNormal?: [number, number, number];
  samples?: number;
  degree?: number;
  resolution?: number;
  color?: string;
}

export const OffsetCurve = ({
  sourcePoints,
  sourceDegree = 3,
  sourceKnots,
  sourceWeights,
  sourceCurve: sourceCurveProp,
  distance,
  planeNormal = [0, 0, 1],
  samples = 50,
  degree = 3,
  resolution = 50,
  color = "black",
  ...lineProps
}: OffsetCurveProps) => {
  const curvePoints = useMemo(() => {
    try {
      // Build or use source curve
      let source = sourceCurveProp ?? null;
      if (!source && sourcePoints && sourcePoints.length >= 2) {
        const knots = sourceKnots ?? generateUniformKnots(sourcePoints.length, sourceDegree);
        source = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
          sourceDegree,
          knots,
          sourcePoints,
          sourceWeights ?? Array(sourcePoints.length).fill(1)
        );
      }
      if (!source || distance === 0) return [];

      const normal = new Vector3(...planeNormal).normalize();
      const offsetPoints: number[][] = [];

      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const pt = source.point(t);
        const tan = source.tangent(t);
        const tangentVec = new Vector3(tan[0], tan[1], tan[2]).normalize();
        const offsetDir = new Vector3().crossVectors(tangentVec, normal).normalize();

        offsetPoints.push([
          pt[0] + offsetDir.x * distance,
          pt[1] + offsetDir.y * distance,
          pt[2] + offsetDir.z * distance,
        ]);
      }

      const offsetCurve = verb.geom.NurbsCurve.byPoints(
        offsetPoints,
        Math.min(degree, offsetPoints.length - 1)
      );

      return Array.from({ length: resolution + 1 }, (_, i) => {
        const t = i / resolution;
        const pt = offsetCurve.point(t);
        return new Vector3(pt[0], pt[1], pt[2]);
      });
    } catch (error) {
      console.error("OffsetCurve: Error creating offset:", error);
      return [];
    }
  }, [sourcePoints, sourceDegree, sourceKnots, sourceWeights, sourceCurveProp, distance, planeNormal, samples, degree, resolution]);

  if (curvePoints.length === 0) return null;

  return <Line points={curvePoints} color={color} {...lineProps} />;
};
