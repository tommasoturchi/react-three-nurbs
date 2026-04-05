import { useMemo } from "react";
import { Vector3 } from "three";
import { NurbsCurve as NurbsCurveCore } from "../core";
import { Line } from "@react-three/drei";
import type { LineProps } from "@react-three/drei";

export interface InterpolatedCurveProps
  extends Omit<LineProps, "points" | "resolution"> {
  throughPoints: number[][];
  degree?: number;
  resolution?: number;
  color?: string;
}

export const InterpolatedCurve = ({
  throughPoints,
  degree = 3,
  resolution = 50,
  color = "black",
  ...lineProps
}: InterpolatedCurveProps) => {
  const curvePoints = useMemo(() => {
    if (!throughPoints || throughPoints.length < 2) return [];
    try {
      const curve = NurbsCurveCore.byPoints(throughPoints, degree);
      return Array.from({ length: resolution + 1 }, (_, i) => {
        const t = i / resolution;
        const pt = curve.point(t);
        return new Vector3(pt[0], pt[1], pt[2]);
      });
    } catch (error) {
      console.error("InterpolatedCurve: Error creating curve:", error);
      return [];
    }
  }, [throughPoints, degree, resolution]);

  if (curvePoints.length === 0) return null;

  return <Line points={curvePoints} color={color} {...lineProps} />;
};
