import { useMemo, isValidElement, Children } from "react";
import type { ReactElement } from "react";
import { NurbsCurve as NurbsCurveCore, NurbsSurface as NurbsSurfaceCore, createRevolvedSurface } from "../core";
import { NurbsCurve } from "./NurbsCurve";
import type { NurbsCurveProps } from "./NurbsCurve";
import { DoubleSide } from "three";
import type { MeshProps } from "@react-three/fiber";
import { generateUniformKnots } from "../utils/nurbs";
import { isMaterialElement } from "../utils/materials";

export interface RevolvedSurfaceProps extends Omit<MeshProps, "geometry"> {
  center?: [number, number, number];
  axis?: [number, number, number];
  angle?: number;
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  children: ReactElement<NurbsCurveProps> | ReactElement[];
}

export const RevolvedSurface = ({
  center = [0, 0, 0],
  axis = [1, 0, 0],
  angle = 2 * Math.PI,
  resolutionU = 20,
  resolutionV = 20,
  color = "#ff0000",
  wireframe = false,
  children,
  ...meshProps
}: RevolvedSurfaceProps) => {
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
      console.error("RevolvedSurface requires a NurbsCurve child");
      return null;
    }

    try {
      const { points, degree = 3, weights, knots } = profileChild.props;
      const defaultWeights = Array(points.length).fill(1);

      if (!points || points.length < 2) {
        console.error("Profile curve must have at least 2 points");
        return null;
      }

      // Normalize the axis vector
      const axisLength = Math.sqrt(
        axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]
      );
      if (axisLength === 0) {
        console.error("Axis vector cannot be zero");
        return null;
      }
      const normalizedAxis: [number, number, number] = [
        axis[0] / axisLength,
        axis[1] / axisLength,
        axis[2] / axisLength,
      ];

      const resolvedKnots = knots ?? generateUniformKnots(points.length, degree);
      const profileCurve = NurbsCurveCore.byKnotsControlPointsWeights(
        degree,
        resolvedKnots,
        points,
        weights ?? defaultWeights
      );

      const revolvedSurface = new NurbsSurfaceCore(
        createRevolvedSurface(profileCurve.asData(), center, normalizedAxis, angle)
      );

      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      for (let i = 0; i <= resolutionU; i++) {
        for (let j = 0; j <= resolutionV; j++) {
          const u = i / resolutionU;
          const v = j / resolutionV;
          const point = revolvedSurface.point(u, v);
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

      return { vertices, indices, uvs };
    } catch (error) {
      console.error("Error creating revolved surface:", error);
      return null;
    }
  }, [profileChild, center, axis, angle, resolutionU, resolutionV]);

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
