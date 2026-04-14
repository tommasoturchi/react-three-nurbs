import { useMemo, useRef, forwardRef, Children } from "react";
import type { ReactElement } from "react";
import { NurbsSurface as NurbsSurfaceCore } from "../core";
import { adaptiveTessellate } from "../core/tessellate";
import type { AdaptiveRefinementOptions } from "../core/tessellate";
import { DoubleSide, BufferGeometry, Float32BufferAttribute } from "three";
import type { Mesh } from "three";
import type { MeshProps } from "@react-three/fiber";
import { generateUniformKnots } from "../utils/nurbs";
import { isMaterialElement } from "../utils/materials";

export interface NurbsSurfaceProps extends Omit<MeshProps, "geometry" | "ref"> {
  controlPoints: number[][][];
  weights: number[][];
  degreeU: number;
  degreeV: number;
  knotsU?: number[];
  knotsV?: number[];
  resolutionU?: number;
  resolutionV?: number;
  color?: string;
  wireframe?: boolean;
  /** Skip analytical normals and use computeVertexNormals for speed */
  fastNormals?: boolean;
  /** Enable adaptive tessellation — subdivides high-curvature areas automatically */
  adaptive?: AdaptiveRefinementOptions | boolean;
  children?: ReactElement;
}

export const NurbsSurface = forwardRef<Mesh, NurbsSurfaceProps>(function NurbsSurface(
  {
    controlPoints,
    weights,
    degreeU,
    degreeV,
    knotsU: knotsUProp,
    knotsV: knotsVProp,
    resolutionU = 20,
    resolutionV = 20,
    color = "#ffffff",
    wireframe = false,
    fastNormals = false,
    adaptive,
    children,
    ...meshProps
  },
  ref,
) {
  const materialChild = useMemo(() => {
    if (!children) return null;
    const childArray = Children.toArray(children);
    for (const child of childArray) {
      if (isMaterialElement(child)) {
        return child as ReactElement;
      }
    }
    console.warn("NurbsSurface children must be a material component");
    return null;
  }, [children]);

  const geometryRef = useRef<BufferGeometry | null>(null);

  const geometry = useMemo(() => {
    if (!controlPoints || controlPoints.length === 0) return null;

    try {
      const knotsU = knotsUProp ?? generateUniformKnots(controlPoints.length, degreeU);
      const knotsV = knotsVProp ?? generateUniformKnots(controlPoints[0].length, degreeV);

      const verbSurface = NurbsSurfaceCore.byKnotsControlPointsWeights(
        degreeU, degreeV, knotsU, knotsV, controlPoints, weights
      );

      let positions: Float32Array;
      let normals: Float32Array | null;
      let uvs: Float32Array;
      let indices: Uint32Array;

      if (adaptive) {
        // Adaptive tessellation — denser in high-curvature areas
        const opts = adaptive === true ? {} : adaptive;
        const tess = adaptiveTessellate(verbSurface, {
          normals: !fastNormals,
          ...opts,
        });
        positions = tess.vertices;
        normals = fastNormals ? null : tess.normals;
        uvs = tess.uvs;
        indices = tess.indices;
      } else {
        // Uniform grid tessellation
        const vertCount = (resolutionU + 1) * (resolutionV + 1);
        positions = new Float32Array(vertCount * 3);
        uvs = new Float32Array(vertCount * 2);

        let vi = 0, ui = 0;
        for (let i = 0; i <= resolutionU; i++) {
          for (let j = 0; j <= resolutionV; j++) {
            const u = i / resolutionU;
            const v = j / resolutionV;
            const point = verbSurface.point(u, v);
            positions[vi++] = point[0];
            positions[vi++] = point[1];
            positions[vi++] = point[2];
            uvs[ui++] = u;
            uvs[ui++] = v;
          }
        }

        normals = null;
        if (!fastNormals) {
          normals = new Float32Array(vertCount * 3);
          let ni = 0;
          for (let i = 0; i <= resolutionU; i++) {
            for (let j = 0; j <= resolutionV; j++) {
              const u = i / resolutionU;
              const v = j / resolutionV;
              try {
                const n = verbSurface.normal(u, v);
                const len = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
                if (len > 0) {
                  normals[ni++] = n[0] / len;
                  normals[ni++] = n[1] / len;
                  normals[ni++] = n[2] / len;
                } else {
                  normals[ni++] = 0; normals[ni++] = 1; normals[ni++] = 0;
                }
              } catch {
                normals[ni++] = 0; normals[ni++] = 1; normals[ni++] = 0;
              }
            }
          }
        }

        const idxCount = resolutionU * resolutionV * 6;
        indices = new Uint32Array(idxCount);
        let idx = 0;
        for (let i = 0; i < resolutionU; i++) {
          for (let j = 0; j < resolutionV; j++) {
            const a = i * (resolutionV + 1) + j;
            const b = a + 1;
            const c = (i + 1) * (resolutionV + 1) + j;
            const d = c + 1;
            indices[idx++] = a; indices[idx++] = b; indices[idx++] = c;
            indices[idx++] = b; indices[idx++] = d; indices[idx++] = c;
          }
        }
      }

      if (geometryRef.current) geometryRef.current.dispose();
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
      if (normals) {
        geo.setAttribute("normal", new Float32BufferAttribute(normals, 3));
      }
      geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
      geo.setIndex(Array.from(indices));
      if (!normals) {
        geo.computeVertexNormals();
      }
      geo.computeBoundingSphere();
      geometryRef.current = geo;

      return geo;
    } catch (error) {
      console.error("Error creating NURBS surface:", error);
      return null;
    }
  }, [controlPoints, weights, degreeU, degreeV, knotsUProp, knotsVProp, resolutionU, resolutionV, fastNormals, adaptive]);

  if (!geometry) return null;
  if (children && !materialChild) return null;

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
