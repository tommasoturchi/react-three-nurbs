import { useMemo } from "react";
import { Vector3 } from "three";
import { NurbsCurve as NurbsCurveCore, createEllipseArc } from "../core";
import { Line } from "@react-three/drei";
import type { LineProps } from "@react-three/drei";

export interface NurbsEllipseArcProps
  extends Omit<LineProps, "points" | "resolution"> {
  center?: [number, number, number];
  xaxis?: [number, number, number];
  yaxis?: [number, number, number];
  startAngle?: number;
  endAngle?: number;
  resolution?: number;
  color?: string;
}

export const NurbsEllipseArc = ({
  center = [0, 0, 0],
  xaxis = [1, 0, 0],
  yaxis = [0, 0.5, 0],
  startAngle = 0,
  endAngle = Math.PI,
  resolution = 50,
  color = "black",
  ...lineProps
}: NurbsEllipseArcProps) => {
  const curvePoints = useMemo(() => {
    try {
      const arc = new NurbsCurveCore(createEllipseArc(center, xaxis, yaxis, startAngle, endAngle));
      return Array.from({ length: resolution + 1 }, (_, i) => {
        const t = i / resolution;
        const pt = arc.point(t);
        return new Vector3(pt[0], pt[1], pt[2]);
      });
    } catch (error) {
      console.error("NurbsEllipseArc: Error creating ellipse arc:", error);
      return [];
    }
  }, [center, xaxis, yaxis, startAngle, endAngle, resolution]);

  if (curvePoints.length === 0) return null;

  return <Line points={curvePoints} color={color} {...lineProps} />;
};
