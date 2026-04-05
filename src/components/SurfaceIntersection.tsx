import { useMemo, isValidElement, Children } from "react";
import type { ReactElement } from "react";
import { NurbsSurface } from "./NurbsSurface";
import type { NurbsSurfaceProps } from "./NurbsSurface";
import { Line } from "@react-three/drei";
import {
  useSurfaceIntersection,
  type SurfaceDefinition,
} from "../hooks/useSurfaceIntersection";

export interface SurfaceIntersectionProps {
  tolerance?: number;
  lineColor?: string;
  lineWidth?: number;
  children: ReactElement[];
}

export const SurfaceIntersection = ({
  tolerance = 1e-3,
  lineColor = "#ff0000",
  lineWidth = 2,
  children,
}: SurfaceIntersectionProps) => {
  const surfaceDefs = useMemo(() => {
    const defs: SurfaceDefinition[] = [];
    Children.forEach(children, (child) => {
      if (
        isValidElement(child) &&
        (child.type === NurbsSurface || child.type === "NurbsSurface")
      ) {
        const props = child.props as NurbsSurfaceProps;
        defs.push({
          controlPoints: props.controlPoints,
          weights: props.weights,
          degreeU: props.degreeU,
          degreeV: props.degreeV,
          knotsU: props.knotsU,
          knotsV: props.knotsV,
        });
      }
    });
    return defs;
  }, [children]);

  const { curves } = useSurfaceIntersection({
    surface0: surfaceDefs[0] ?? null,
    surface1: surfaceDefs[1] ?? null,
    tolerance,
  });

  if (surfaceDefs.length < 2) {
    console.warn("SurfaceIntersection requires exactly 2 NurbsSurface children");
    return null;
  }

  return (
    <group>
      {children}
      {curves.map((curve, i) =>
        curve.points.length >= 2 ? (
          <Line
            key={i}
            points={curve.points}
            color={lineColor}
            lineWidth={lineWidth}
          />
        ) : null
      )}
    </group>
  );
};
