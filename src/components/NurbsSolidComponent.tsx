import { useMemo, useRef } from "react";
import type { ReactElement } from "react";
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from "three";
import type { MeshProps } from "@react-three/fiber";
import { NurbsSurface as NurbsSurfaceCore } from "../core";
import type { SolidData, FaceData } from "../core";
import { isMaterialElement } from "../utils/materials";

export interface NurbsSolidProps extends Omit<MeshProps, "geometry" | "ref"> {
  solid: SolidData;
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  children?: ReactElement;
}

/**
 * Tessellate a single face into vertices, normals, UVs, and indices.
 */
function tessellateFace(
  face: FaceData,
  resU: number,
  resV: number,
  indexOffset: number
) {
  const surf = new NurbsSurfaceCore(face.surface);
  const flip = face.orientation === "reversed" ? -1 : 1;

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= resU; i++) {
    for (let j = 0; j <= resV; j++) {
      const u = i / resU;
      const v = j / resV;
      const pt = surf.point(u, v);
      vertices.push(pt[0], pt[1], pt[2]);
      uvs.push(u, v);

      try {
        const n = surf.normal(u, v);
        const len = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
        if (len > 0) {
          normals.push(flip * n[0] / len, flip * n[1] / len, flip * n[2] / len);
        } else {
          normals.push(0, flip, 0);
        }
      } catch {
        normals.push(0, flip, 0);
      }
    }
  }

  for (let i = 0; i < resU; i++) {
    for (let j = 0; j < resV; j++) {
      const a = indexOffset + i * (resV + 1) + j;
      const b = a + 1;
      const c = indexOffset + (i + 1) * (resV + 1) + j;
      const d = c + 1;
      if (flip > 0) {
        indices.push(a, b, c);
        indices.push(b, d, c);
      } else {
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }
  }

  return { vertices, normals, uvs, indices };
}

/**
 * Renders all faces of a NurbsSolid as a single merged mesh.
 */
export const NurbsSolidComponent = ({
  solid,
  resolutionU = 20,
  resolutionV = 20,
  color = "#4488ff",
  wireframe = false,
  children,
  ...meshProps
}: NurbsSolidProps) => {
  const materialChild = useMemo(() => {
    if (!children) return null;
    if (isMaterialElement(children)) return children;
    return null;
  }, [children]);

  const geometryRef = useRef<BufferGeometry | null>(null);

  const geometry = useMemo(() => {
    if (!solid || !solid.faces || solid.faces.length === 0) return null;

    try {
      const allVertices: number[] = [];
      const allNormals: number[] = [];
      const allUVs: number[] = [];
      const allIndices: number[] = [];

      let indexOffset = 0;

      for (const face of solid.faces) {
        const tess = tessellateFace(face, resolutionU, resolutionV, indexOffset);
        allVertices.push(...tess.vertices);
        allNormals.push(...tess.normals);
        allUVs.push(...tess.uvs);
        allIndices.push(...tess.indices);
        indexOffset += (resolutionU + 1) * (resolutionV + 1);
      }

      if (geometryRef.current) geometryRef.current.dispose();
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(allVertices, 3));
      geo.setAttribute("normal", new Float32BufferAttribute(allNormals, 3));
      geo.setAttribute("uv", new Float32BufferAttribute(allUVs, 2));
      geo.setIndex(allIndices);
      geo.computeBoundingSphere();
      geometryRef.current = geo;

      return geo;
    } catch (error) {
      console.error("NurbsSolid: Error creating solid geometry:", error);
      return null;
    }
  }, [solid, resolutionU, resolutionV]);

  if (!geometry) return null;

  return (
    <mesh {...meshProps} geometry={geometry}>
      {materialChild ? (
        materialChild
      ) : (
        <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      )}
    </mesh>
  );
};
