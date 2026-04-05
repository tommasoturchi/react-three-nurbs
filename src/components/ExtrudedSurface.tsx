import { useMemo, useRef, Children, isValidElement } from "react";
import type { ReactElement } from "react";
import { NurbsCurve as NurbsCurveCore, NurbsSurface as NurbsSurfaceCore, createExtrudedSurface } from "../core";
import { NurbsCurve } from "./NurbsCurve";
import type { NurbsCurveProps } from "./NurbsCurve";
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from "three";
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

  const geometryRef = useRef<BufferGeometry | null>(null);

  const geometry = useMemo(() => {
    if (!profileChild) {
      console.error("ExtrudedSurface requires a NurbsCurve child");
      return null;
    }
    try {
      const { points, degree = 3, weights, knots } = profileChild.props;
      const defaultWeights = Array(points.length).fill(1);
      const resolvedKnots = knots ?? generateUniformKnots(points.length, degree);

      const profileCurve = NurbsCurveCore.byKnotsControlPointsWeights(
        degree, resolvedKnots, points, weights ?? defaultWeights
      );
      const extrudedSurface = new NurbsSurfaceCore(
        createExtrudedSurface(profileCurve.asData(), direction)
      );

      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];
      for (let i = 0; i <= resolutionU; i++) {
        for (let j = 0; j <= resolutionV; j++) {
          const u = i / resolutionU;
          const v = j / resolutionV;
          const point = extrudedSurface.point(u, v);
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
      console.error("Error creating extruded surface:", error);
      return null;
    }
  }, [profileChild, direction, resolutionU, resolutionV]);

  if (!geometry) return null;

  return (
    <mesh {...meshProps} geometry={geometry}>
      {materialChild ? (
        materialChild
      ) : (
        <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      )}
    </mesh>
  );
};
