import { useMemo, Children, isValidElement } from "react";
import type { ReactElement } from "react";
import verb from "verb-nurbs";
import { NurbsCurve } from "./NurbsCurve";
import type { NurbsCurveProps } from "./NurbsCurve";

export interface LoftedSurfaceProps {
  degreeV?: number;
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  children: ReactElement<NurbsCurveProps>[] | ReactElement[];
}

export const LoftedSurface = ({
  degreeV = 3,
  resolutionU = 20,
  resolutionV = 20,
  color = "#ff0000",
  wireframe = false,
  children,
}: LoftedSurfaceProps) => {
  // Memoize separation of curve children and material child
  const { curveChildren, materialChild } = useMemo(() => {
    const curveChildren: ReactElement<NurbsCurveProps>[] = [];
    let materialChild: ReactElement | null = null;
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === NurbsCurve) {
        curveChildren.push(child as ReactElement<NurbsCurveProps>);
      } else if (
        isValidElement(child) &&
        child.type &&
        (child.type as any).prototype &&
        "isMaterial" in (child.type as any).prototype
      ) {
        materialChild = child as ReactElement;
      }
    });
    return { curveChildren, materialChild };
  }, [children]);

  const geometry = useMemo(() => {
    if (curveChildren.length < 2) {
      console.error("LoftedSurface requires at least 2 NurbsCurve children");
      return null;
    }
    try {
      const nurbsCurves = curveChildren.map((curve) => {
        const { points, degree = 3, weights, knots } = curve.props;
        const defaultWeights = Array(points.length).fill(1);
        return verb.geom.NurbsCurve.byKnotsControlPointsWeights(
          degree,
          knots,
          points,
          weights ?? defaultWeights
        );
      });
      const loftedSurface = verb.geom.NurbsSurface.byLoftingCurves(
        nurbsCurves,
        degreeV
      );
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
      return {
        vertices,
        indices,
        uvs,
      };
    } catch (error) {
      console.error("Error creating lofted surface:", error);
      return null;
    }
  }, [curveChildren, degreeV, resolutionU, resolutionV]);

  if (!geometry) return null;

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={geometry.vertices.length / 3}
          array={new Float32Array(geometry.vertices)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uv"
          count={geometry.uvs.length / 2}
          array={new Float32Array(geometry.uvs)}
          itemSize={2}
        />
        <bufferAttribute
          attach="index"
          count={geometry.indices.length}
          array={new Uint32Array(geometry.indices)}
          itemSize={1}
        />
      </bufferGeometry>
      {materialChild ? (
        materialChild
      ) : (
        <meshStandardMaterial color={color} wireframe={wireframe} />
      )}
    </mesh>
  );
};
