import { useMemo } from "react";
import { Vector3 } from "three";
import verb from "verb-nurbs";
import { Line } from "@react-three/drei";
import type { LineProps } from "@react-three/drei";

export interface NurbsCircleProps
  extends Omit<LineProps, "points" | "resolution"> {
  center?: [number, number, number];
  radius?: number;
  xaxis?: [number, number, number];
  yaxis?: [number, number, number];
  resolution?: number;
  color?: string;
}

export const NurbsCircle = ({
  center = [0, 0, 0],
  radius = 1,
  xaxis = [1, 0, 0],
  yaxis = [0, 1, 0],
  resolution = 64,
  color = "black",
  ...lineProps
}: NurbsCircleProps) => {
  const curvePoints = useMemo(() => {
    try {
      const circle = new verb.geom.Circle(center, xaxis, yaxis, radius);
      return Array.from({ length: resolution + 1 }, (_, i) => {
        const t = i / resolution;
        const pt = circle.point(t);
        return new Vector3(pt[0], pt[1], pt[2]);
      });
    } catch (error) {
      console.error("NurbsCircle: Error creating circle:", error);
      return [];
    }
  }, [center, xaxis, yaxis, radius, resolution]);

  if (curvePoints.length === 0) return null;

  return <Line points={curvePoints} color={color} {...lineProps} />;
};
