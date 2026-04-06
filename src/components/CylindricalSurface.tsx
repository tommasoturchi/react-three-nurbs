import { useMemo, useRef, forwardRef, Children } from "react";
import type { ReactElement } from "react";
import { NurbsSurface as NurbsSurfaceCore, createCylindricalSurface } from "../core";
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from "three";
import type { Mesh } from "three";
import type { MeshProps } from "@react-three/fiber";
import { isMaterialElement } from "../utils/materials";

export interface CylindricalSurfaceProps extends Omit<MeshProps, "geometry" | "ref"> {
  axis?: [number, number, number];
  xaxis?: [number, number, number];
  base?: [number, number, number];
  height?: number;
  radius?: number;
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  children?: ReactElement;
}

export const CylindricalSurface = forwardRef<Mesh, CylindricalSurfaceProps>(
  function CylindricalSurface(
    {
      axis = [0, 1, 0],
      xaxis = [1, 0, 0],
      base = [0, 0, 0],
      height = 2,
      radius = 1,
      resolutionU = 30,
      resolutionV = 10,
      color = "#ff0000",
      wireframe = false,
      children,
      ...meshProps
    },
    ref,
  ) {
    const materialChild = useMemo(() => {
      if (!children) return null;
      const childArray = Children.toArray(children);
      for (const child of childArray) {
        if (isMaterialElement(child)) return child as ReactElement;
      }
      return null;
    }, [children]);

    const geometryRef = useRef<BufferGeometry | null>(null);

    const geometry = useMemo(() => {
      try {
        const surfData = createCylindricalSurface(axis, xaxis, base, height, radius);
        const surf = new NurbsSurfaceCore(surfData);

        const vertices: number[] = [];
        const indices: number[] = [];
        const uvs: number[] = [];
        for (let i = 0; i <= resolutionU; i++) {
          for (let j = 0; j <= resolutionV; j++) {
            const u = i / resolutionU;
            const v = j / resolutionV;
            const pt = surf.point(u, v);
            vertices.push(pt[0], pt[1], pt[2]);
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

        if (geometryRef.current) geometryRef.current.dispose();
      const geo = new BufferGeometry();
        geo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
        geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
        geo.setIndex(indices);
        geo.computeVertexNormals();
        geo.computeBoundingSphere();
        geometryRef.current = geo;
        return geo;
      } catch (error) {
        console.error("Error creating cylindrical surface:", error);
        return null;
      }
    }, [axis, xaxis, base, height, radius, resolutionU, resolutionV]);

    if (!geometry) return null;

    return (
      <mesh ref={ref} {...meshProps} geometry={geometry}>
        {materialChild ? (
          materialChild
        ) : (
          <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        )}
      </mesh>
    );
  }
);
