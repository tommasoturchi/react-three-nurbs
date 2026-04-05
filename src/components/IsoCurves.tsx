import { useMemo } from "react";
import { Vector3 } from "three";
import type { NurbsSurface as NurbsSurfaceCore } from "../core";
import { Line } from "@react-three/drei";

export interface IsoCurvesProps {
  surface: NurbsSurfaceCore;
  countU?: number;
  countV?: number;
  color?: string;
  lineWidth?: number;
  resolution?: number;
}

export const IsoCurves = ({
  surface,
  countU = 10,
  countV = 10,
  color = "#666666",
  lineWidth = 1,
  resolution = 50,
}: IsoCurvesProps) => {
  const curves = useMemo(() => {
    if (!surface) return [];

    const result: { points: Vector3[]; key: string }[] = [];

    // U iso-curves (constant U, varying V)
    for (let i = 0; i <= countU; i++) {
      const u = i / countU;
      try {
        const isoCurve = surface.isocurve(u, false);
        const points = Array.from({ length: resolution + 1 }, (_, j) => {
          const t = j / resolution;
          const pt = isoCurve.point(t);
          return new Vector3(pt[0], pt[1], pt[2]);
        });
        result.push({ points, key: `u-${i}` });
      } catch {
        // skip failed iso-curves
      }
    }

    // V iso-curves (constant V, varying U)
    for (let i = 0; i <= countV; i++) {
      const v = i / countV;
      try {
        const isoCurve = surface.isocurve(v, true);
        const points = Array.from({ length: resolution + 1 }, (_, j) => {
          const t = j / resolution;
          const pt = isoCurve.point(t);
          return new Vector3(pt[0], pt[1], pt[2]);
        });
        result.push({ points, key: `v-${i}` });
      } catch {
        // skip failed iso-curves
      }
    }

    return result;
  }, [surface, countU, countV, resolution]);

  return (
    <group>
      {curves.map((c) => (
        <Line
          key={c.key}
          points={c.points}
          color={color}
          lineWidth={lineWidth}
        />
      ))}
    </group>
  );
};
