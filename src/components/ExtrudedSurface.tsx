import { useMemo, Children, isValidElement } from "react";
import type { ReactElement } from "react";
import verb from "verb-nurbs";
import { NurbsCurve } from "./NurbsCurve";
import type { NurbsCurveProps } from "./NurbsCurve";
import { DoubleSide } from "three";
import type { MeshProps } from "@react-three/fiber";
import { generateUniformKnots } from "../utils/nurbs";
import { isMaterialElement } from "../utils/materials";

export interface ExtrudedSurfaceProps extends Omit<MeshProps, "geometry"> {
  direction: [number, number, number];
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  children: ReactElement<NurbsCurveProps> | ReactElement[];
}

export const ExtrudedSurface = ({
  direction,
  resolutionU = 20,
  resolutionV = 20,
  color = "#ff0000",
  wireframe = false,
  children,
  ...meshProps
}: ExtrudedSurfaceProps) => {
  const { profileChild, materialChild } = useMemo(() => {
    let profileChild: ReactElement<NurbsCurveProps> | null = null;
    let materialChild: ReactElement | null = null;
    const childArray = Children.toArray(children);
    for (const child of childArray) {
      if (isValidElement(child)) {
        if (child.type === NurbsCurve) {
          profileChild = child as ReactElement<NurbsCurveProps>;
        } else if (isMaterialElement(child)) {
          materialChild = child as ReactElement;
        }
      }
    }
    return { profileChild, materialChild };
  }, [children]);

  const geometry = useMemo(() => {
    if (!profileChild) {
      console.error("ExtrudedSurface requires a NurbsCurve child");
      return null;
    }

    try {
      const { points, degree = 3, weights, knots } = profileChild.props;
      const defaultWeights = Array(points.length).fill(1);
      const resolvedKnots = knots ?? generateUniformKnots(points.length, degree);

      const profileCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(
        degree,
        resolvedKnots,
        points,
        weights ?? defaultWeights
      );

      const extrudedSurface = new verb.geom.ExtrudedSurface(profileCurve, direction);

      const vertices: number[] = [];
      const normals: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      for (let i = 0; i <= resolutionU; i++) {
        for (let j = 0; j <= resolutionV; j++) {
          const u = i / resolutionU;
          const v = j / resolutionV;
          const point = extrudedSurface.point(u, v);
          vertices.push(point[0], point[1], point[2]);
          uvs.push(u, v);

          try {
            const n = extrudedSurface.normal(u, v);
            const len = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
            if (len > 0) {
              normals.push(n[0] / len, n[1] / len, n[2] / len);
            } else {
              normals.push(0, 1, 0);
            }
          } catch {
            normals.push(0, 1, 0);
          }
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

      return { vertices, normals, indices, uvs };
    } catch (error) {
      console.error("Error creating extruded surface:", error);
      return null;
    }
  }, [profileChild, direction, resolutionU, resolutionV]);

  if (!geometry) return null;

  return (
    <mesh {...meshProps}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={geometry.vertices.length / 3}
          array={new Float32Array(geometry.vertices)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-normal"
          count={geometry.normals.length / 3}
          array={new Float32Array(geometry.normals)}
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
        <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      )}
    </mesh>
  );
};
