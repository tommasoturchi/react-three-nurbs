import { useMemo } from "react";
import { Vector3 } from "three";
import verb from "verb-nurbs";
import { Line } from "@react-three/drei";
import type { LineProps } from "@react-three/drei";

export interface NurbsArcProps
  extends Omit<LineProps, "points" | "resolution"> {
  center?: [number, number, number];
  radius?: number;
  xaxis?: [number, number, number];
  yaxis?: [number, number, number];
  startAngle?: number;
  endAngle?: number;
  resolution?: number;
  color?: string;
}

export const NurbsArc = ({
  center = [0, 0, 0],
  radius = 1,
  xaxis = [1, 0, 0],
  yaxis = [0, 1, 0],
  startAngle = 0,
  endAngle = Math.PI / 2,
  resolution = 50,
  color = "black",
  ...lineProps
}: NurbsArcProps) => {
  const curvePoints = useMemo(() => {
    try {
      const arc = new verb.geom.Arc(center, xaxis, yaxis, radius, startAngle, endAngle);
      return Array.from({ length: resolution + 1 }, (_, i) => {
        const t = i / resolution;
        const pt = arc.point(t);
        return new Vector3(pt[0], pt[1], pt[2]);
      });
    } catch (error) {
      console.error("NurbsArc: Error creating arc:", error);
      return [];
    }
  }, [center, xaxis, yaxis, radius, startAngle, endAngle, resolution]);

  if (curvePoints.length === 0) return null;

  return <Line points={curvePoints} color={color} {...lineProps} />;
};
