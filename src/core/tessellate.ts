/**
 * Adaptive surface tessellation.
 * Subdivides cells where the surface deviates from the bilinear approximation
 * by more than a tolerance, producing denser triangles in high-curvature areas.
 */

import { NurbsSurface } from "./surface";

export interface AdaptiveRefinementOptions {
  /** Maximum deviation from bilinear approximation before subdividing (world units). Default: 0.01 */
  tolerance?: number;
  /** Minimum number of initial divisions in U. Default: 4 */
  minDivsU?: number;
  /** Minimum number of initial divisions in V. Default: 4 */
  minDivsV?: number;
  /** Maximum recursion depth. Default: 6 */
  maxDepth?: number;
  /** Whether to compute normals. Default: true */
  normals?: boolean;
}

export interface TessellationResult {
  vertices: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
}

interface Vertex {
  pos: number[];
  normal: number[];
  uv: [number, number];
}

/**
 * Adaptively tessellate a NURBS surface.
 */
export function adaptiveTessellate(
  surface: NurbsSurface,
  options: AdaptiveRefinementOptions = {}
): TessellationResult {
  const {
    tolerance = 0.01,
    minDivsU = 4,
    minDivsV = 4,
    maxDepth = 6,
    normals: computeNormals = true,
  } = options;

  const vertices: Vertex[] = [];
  const indices: number[] = [];
  const vertexCache = new Map<string, number>();

  // Get or create a vertex at (u, v), caching by UV key
  function getVertex(u: number, v: number): number {
    const key = `${u.toFixed(10)},${v.toFixed(10)}`;
    const cached = vertexCache.get(key);
    if (cached !== undefined) return cached;

    const pos = surface.point(u, v);
    let normal = [0, 0, 1];
    if (computeNormals) {
      try {
        const n = surface.normal(u, v);
        const len = Math.sqrt(n[0] ** 2 + n[1] ** 2 + n[2] ** 2);
        if (len > 0) normal = [n[0] / len, n[1] / len, n[2] / len];
      } catch {
        // fallback normal
      }
    }

    const idx = vertices.length;
    vertices.push({ pos, normal, uv: [u, v] });
    vertexCache.set(key, idx);
    return idx;
  }

  // Check if a cell needs subdivision
  function needsSubdivision(
    u0: number, v0: number,
    u1: number, v1: number
  ): boolean {
    const uMid = (u0 + u1) / 2;
    const vMid = (v0 + v1) / 2;

    // Evaluate surface at midpoint
    const actual = surface.point(uMid, vMid);

    // Bilinear interpolation of corners
    const p00 = surface.point(u0, v0);
    const p10 = surface.point(u1, v0);
    const p01 = surface.point(u0, v1);
    const p11 = surface.point(u1, v1);

    const expected = [
      0.25 * (p00[0] + p10[0] + p01[0] + p11[0]),
      0.25 * (p00[1] + p10[1] + p01[1] + p11[1]),
      0.25 * (p00[2] + p10[2] + p01[2] + p11[2]),
    ];

    // Distance between actual and expected
    const dx = actual[0] - expected[0];
    const dy = actual[1] - expected[1];
    const dz = actual[2] - expected[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return dist > tolerance;
  }

  // Recursively subdivide a cell
  function subdivide(
    u0: number, v0: number,
    u1: number, v1: number,
    depth: number
  ): void {
    if (depth < maxDepth && needsSubdivision(u0, v0, u1, v1)) {
      const uMid = (u0 + u1) / 2;
      const vMid = (v0 + v1) / 2;

      // Subdivide into 4 cells
      subdivide(u0, v0, uMid, vMid, depth + 1);
      subdivide(uMid, v0, u1, vMid, depth + 1);
      subdivide(u0, vMid, uMid, v1, depth + 1);
      subdivide(uMid, vMid, u1, v1, depth + 1);
    } else {
      // Emit two triangles for this cell
      const i00 = getVertex(u0, v0);
      const i10 = getVertex(u1, v0);
      const i01 = getVertex(u0, v1);
      const i11 = getVertex(u1, v1);

      indices.push(i00, i10, i01);
      indices.push(i10, i11, i01);
    }
  }

  // Start with initial grid
  for (let i = 0; i < minDivsU; i++) {
    for (let j = 0; j < minDivsV; j++) {
      const u0 = i / minDivsU;
      const u1 = (i + 1) / minDivsU;
      const v0 = j / minDivsV;
      const v1 = (j + 1) / minDivsV;

      subdivide(u0, v0, u1, v1, 0);
    }
  }

  // Pack into typed arrays
  const nVerts = vertices.length;
  const posArr = new Float32Array(nVerts * 3);
  const normArr = new Float32Array(nVerts * 3);
  const uvArr = new Float32Array(nVerts * 2);

  for (let i = 0; i < nVerts; i++) {
    posArr[i * 3] = vertices[i].pos[0];
    posArr[i * 3 + 1] = vertices[i].pos[1];
    posArr[i * 3 + 2] = vertices[i].pos[2];
    normArr[i * 3] = vertices[i].normal[0];
    normArr[i * 3 + 1] = vertices[i].normal[1];
    normArr[i * 3 + 2] = vertices[i].normal[2];
    uvArr[i * 2] = vertices[i].uv[0];
    uvArr[i * 2 + 1] = vertices[i].uv[1];
  }

  return {
    vertices: posArr,
    normals: normArr,
    uvs: uvArr,
    indices: new Uint32Array(indices),
  };
}
