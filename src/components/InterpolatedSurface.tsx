import { useMemo, useRef, forwardRef, Children } from "react";
import type { ReactElement } from "react";
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from "three";
import type { Mesh } from "three";
import type { MeshProps } from "@react-three/fiber";
import { isMaterialElement } from "../utils/materials";
import { useInterpolatedSurface } from "../hooks/useInterpolatedSurface";

export interface InterpolatedSurfaceProps extends Omit<MeshProps, "geometry" | "ref"> {
  points: number[][][];
  degreeU?: number;
  degreeV?: number;
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  children?: ReactElement;
}

export const InterpolatedSurface = forwardRef<Mesh, InterpolatedSurfaceProps>(
  function InterpolatedSurface(
    {
      points,
      degreeU = 3,
      degreeV = 3,
      resolutionU = 20,
      resolutionV = 20,
      color = "#ffffff",
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

    const { geometry: geoData } = useInterpolatedSurface({
      points,
      degreeU,
      degreeV,
      resolutionU,
      resolutionV,
    });

    const geometryRef = useRef<BufferGeometry | null>(null);

    const geometry = useMemo(() => {
      if (!geoData) return null;

      if (geometryRef.current) geometryRef.current.dispose();
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(geoData.vertices, 3));
      geo.setAttribute("normal", new Float32BufferAttribute(geoData.normals, 3));
      geo.setAttribute("uv", new Float32BufferAttribute(geoData.uvs, 2));
      geo.setIndex(Array.from(geoData.indices));
      geo.computeBoundingSphere();
      geometryRef.current = geo;

      return geo;
    }, [geoData]);

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
  }
);
