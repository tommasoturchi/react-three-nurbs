import { Float32BufferAttribute, BufferGeometry } from "three";
import type { NurbsCurve } from "../core";

/**
 * Computes a bilinear Coons patch from 4 boundary curves.
 *
 * S(u,v) = (1-v)*bottom(u) + v*top(u)
 *        + (1-u)*left(v)   + u*right(v)
 *        - [(1-u)(1-v)*P00 + u(1-v)*P10 + (1-u)v*P01 + u*v*P11]
 *
 * Boundary layout:
 *   bottom: u=0..1, v=0  (bottom edge)
 *   top:    u=0..1, v=1  (top edge)
 *   left:   v=0..1, u=0  (left edge)
 *   right:  v=0..1, u=1  (right edge)
 *
 * Corner points: P00=bottom(0), P10=bottom(1), P01=top(0), P11=top(1)
 */
export function computeCoonsPatch(
  bottom: NurbsCurve,
  top: NurbsCurve,
  left: NurbsCurve,
  right: NurbsCurve,
  resolutionU: number,
  resolutionV: number,
): BufferGeometry {
  const P00 = bottom.point(0);
  const P10 = bottom.point(1);
  const P01 = top.point(0);
  const P11 = top.point(1);

  const vertCount = (resolutionU + 1) * (resolutionV + 1);
  const positions = new Float32Array(vertCount * 3);
  const uvs = new Float32Array(vertCount * 2);

  let vi = 0;
  let ui = 0;

  for (let i = 0; i <= resolutionU; i++) {
    for (let j = 0; j <= resolutionV; j++) {
      const u = i / resolutionU;
      const v = j / resolutionV;

      const b = bottom.point(u);
      const t = top.point(u);
      const l = left.point(v);
      const r = right.point(v);

      // Bilinear Coons interpolation
      for (let k = 0; k < 3; k++) {
        const ruled_u = (1 - v) * b[k] + v * t[k];
        const ruled_v = (1 - u) * l[k] + u * r[k];
        const bilinear =
          (1 - u) * (1 - v) * P00[k] +
          u * (1 - v) * P10[k] +
          (1 - u) * v * P01[k] +
          u * v * P11[k];

        positions[vi++] = ruled_u + ruled_v - bilinear;
      }

      uvs[ui++] = u;
      uvs[ui++] = v;
    }
  }

  // Build indices
  const idxCount = resolutionU * resolutionV * 6;
  const indices = new Uint32Array(idxCount);
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

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geo.setIndex(Array.from(indices));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();

  return geo;
}
