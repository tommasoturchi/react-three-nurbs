import { useMemo, useRef, forwardRef, Children, isValidElement } from "react";
import type { ReactElement } from "react";
import { DoubleSide } from "three";
import type { Mesh, BufferGeometry } from "three";
import type { MeshProps } from "@react-three/fiber";
import { NurbsCurve as NurbsCurveCore } from "../core";
import { NurbsCurve } from "./NurbsCurve";
import type { NurbsCurveProps } from "./NurbsCurve";
import { isMaterialElement } from "../utils/materials";
import { generateUniformKnots } from "../utils/nurbs";
import { computeCoonsPatch } from "../utils/coons";

export interface CoonsPatchProps extends Omit<MeshProps, "geometry" | "ref"> {
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  children: ReactElement | ReactElement[];
}

export const CoonsPatch = forwardRef<Mesh, CoonsPatchProps>(function CoonsPatch(
  {
    resolutionU = 20,
    resolutionV = 20,
    color = "#ff0000",
    wireframe = false,
    children,
    ...meshProps
  },
  ref,
) {
  const { curveChildren, materialChild } = useMemo(() => {
    const curveChildren: ReactElement<NurbsCurveProps>[] = [];
    let materialChild: ReactElement | null = null;
    const childArray = Children.toArray(children);
    for (const child of childArray) {
      if (isValidElement(child) && child.type === NurbsCurve) {
        curveChildren.push(child as ReactElement<NurbsCurveProps>);
      } else if (isMaterialElement(child)) {
        materialChild = child as ReactElement;
      }
    }
    return { curveChildren, materialChild };
  }, [children]);

  const geometryRef = useRef<BufferGeometry | null>(null);

  const geometry = useMemo(() => {
    if (curveChildren.length !== 4) {
      console.error("CoonsPatch requires exactly 4 NurbsCurve children (bottom, top, left, right)");
      return null;
    }

    try {
      const curves = curveChildren.map((child) => {
        const { points, degree = 3, weights, knots } = child.props;
        const resolvedKnots = knots ?? generateUniformKnots(points.length, degree);
        return NurbsCurveCore.byKnotsControlPointsWeights(
          degree,
          resolvedKnots,
          points,
          weights ?? Array(points.length).fill(1)
        );
      });

      const geo = computeCoonsPatch(
        curves[0], curves[1], curves[2], curves[3],
        resolutionU, resolutionV
      );

      // Dispose old geometry if we're reusing
      if (geometryRef.current && geometryRef.current !== geo) {
        geometryRef.current.dispose();
      }
      geometryRef.current = geo;

      return geo;
    } catch (error) {
      console.error("Error creating Coons patch:", error);
      return null;
    }
  }, [curveChildren, resolutionU, resolutionV]);

  if (!geometry) return null;

  return (
    <mesh ref={ref} {...meshProps} geometry={geometry}>
      {materialChild ? (
        materialChild
      ) : (
        <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      )}
    </mesh>
  );
});
