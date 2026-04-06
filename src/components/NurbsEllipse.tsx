import { useMemo } from "react";
import { Vector3 } from "three";
import { NurbsCurve as NurbsCurveCore, createEllipse } from "../core";
import { Line } from "@react-three/drei";
import type { LineProps } from "@react-three/drei";

export interface NurbsEllipseProps
  extends Omit<LineProps, "points" | "resolution"> {
  center?: [number, number, number];
  xaxis?: [number, number, number];
  yaxis?: [number, number, number];
  resolution?: number;
  color?: string;
}

export const NurbsEllipse = ({
  center = [0, 0, 0],
  xaxis = [1, 0, 0],
  yaxis = [0, 0.5, 0],
  resolution = 64,
  color = "black",
  ...lineProps
}: NurbsEllipseProps) => {
  const curvePoints = useMemo(() => {
    try {
      const ellipse = new NurbsCurveCore(createEllipse(center, xaxis, yaxis));
      return Array.from({ length: resolution + 1 }, (_, i) => {
        const t = i / resolution;
        const pt = ellipse.point(t);
        return new Vector3(pt[0], pt[1], pt[2]);
      });
    } catch (error) {
      console.error("NurbsEllipse: Error creating ellipse:", error);
      return [];
    }
  }, [center, xaxis, yaxis, resolution]);

  if (curvePoints.length === 0) return null;

  return <Line points={curvePoints} color={color} {...lineProps} />;
};
