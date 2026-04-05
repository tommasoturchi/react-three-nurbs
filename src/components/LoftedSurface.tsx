import React, { useMemo, useRef, Children, isValidElement } from "react";
import type { ReactElement } from "react";
import { NurbsCurve as NurbsCurveCore, NurbsSurface as NurbsSurfaceCore } from "../core";
import { NurbsCurve } from "./NurbsCurve";
import type { NurbsCurveProps } from "./NurbsCurve";
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from "three";
import { generateUniformKnots } from "../utils/nurbs";
import { isMaterialElement } from "../utils/materials";

export interface LoftedSurfaceProps {
  degreeV?: number;
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  children: React.ReactNode;
}

export const LoftedSurface = ({
  degreeV = 3,
  resolutionU = 20,
  resolutionV = 20,
  color = "#ff0000",
  wireframe = false,
  children,
}: LoftedSurfaceProps) => {
  const { curveChildren, materialChild } = useMemo(() => {
    const curveChildren: ReactElement<NurbsCurveProps>[] = [];
    let materialChild: ReactElement | null = null;
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === NurbsCurve) {
        curveChildren.push(child as ReactElement<NurbsCurveProps>);
      } else if (isMaterialElement(child)) {
        materialChild = child as ReactElement;
      }
    });
    return { curveChildren, materialChild };
  }, [children]);

  const geometryRef = useRef<BufferGeometry | null>(null);

  const geometry = useMemo(() => {
    if (curveChildren.length < 2) {
      console.error("LoftedSurface requires at least 2 NurbsCurve children");
      return null;
    }
    try {
      const nurbsCurves = curveChildren.map((curve) => {
        const { points, degree = 3, weights, knots } = curve.props;
        const defaultWeights = Array(points.length).fill(1);
        const resolvedKnots = knots ?? generateUniformKnots(points.length, degree);
        return NurbsCurveCore.byKnotsControlPointsWeights(
          degree, resolvedKnots, points, weights ?? defaultWeights
        );
      });
      const loftedSurface = NurbsSurfaceCore.byLoftingCurves(nurbsCurves, degreeV);

      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];
      for (let i = 0; i <= resolutionU; i++) {
        for (let j = 0; j <= resolutionV; j++) {
          const u = i / resolutionU;
          const v = j / resolutionV;
          const point = loftedSurface.point(u, v);
          vertices.push(point[0], point[1], point[2]);
          uvs.push(u, v);
        }
      }
      for (let i = 0; i < resolutionU; i++) {
        for (let j = 0; j < resolutionV; j++) {
          const a = i * (resolutionV + 1) + j;
          const b = a + 1;
          const c = (i + 1) * (resolutionV + 1) + j;
          const d = c + 1;
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }

      const geo = geometryRef.current ?? new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
      geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
      geometryRef.current = geo;
      return geo;
    } catch (error) {
      console.error("Error creating lofted surface:", error);
      return null;
    }
  }, [curveChildren, degreeV, resolutionU, resolutionV]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry}>
      {materialChild ? (
        materialChild
      ) : (
        <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      )}
    </mesh>
  );
};
