/**
 * Tessellation quality metrics for comparing mesh outputs.
 */

import type { TessellationResult } from "../../tessellate";
import type { NurbsSurface } from "../../surface";

export interface MeshData {
  positions: number[][]; // [x,y,z][]
  normals: number[][];   // [nx,ny,nz][]
  uvs: number[][];       // [u,v][]
  faces: number[][];     // [i0,i1,i2][]
}

/** Convert our TessellationResult to MeshData. */
export function fromTessellationResult(r: TessellationResult): MeshData {
  const nVerts = r.vertices.length / 3;
  const positions: number[][] = [];
  const normals: number[][] = [];
  const uvs: number[][] = [];
  for (let i = 0; i < nVerts; i++) {
    positions.push([r.vertices[i * 3], r.vertices[i * 3 + 1], r.vertices[i * 3 + 2]]);
    normals.push([r.normals[i * 3], r.normals[i * 3 + 1], r.normals[i * 3 + 2]]);
    uvs.push([r.uvs[i * 2], r.uvs[i * 2 + 1]]);
  }
  const nFaces = r.indices.length / 3;
  const faces: number[][] = [];
  for (let i = 0; i < nFaces; i++) {
    faces.push([r.indices[i * 3], r.indices[i * 3 + 1], r.indices[i * 3 + 2]]);
  }
  return { positions, normals, uvs, faces };
}

/** Convert verb tessellation output to MeshData. */
export function fromVerbMesh(mesh: {
  points: number[][];
  normals: number[][];
  uvs: number[][];
  faces: number[][];
}): MeshData {
  return {
    positions: mesh.points,
    normals: mesh.normals,
    uvs: mesh.uvs,
    faces: mesh.faces,
  };
}

// --- Vector helpers ---

function sub(a: number[], b: number[]): number[] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: number[], b: number[]): number[] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function length(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

function normalize(a: number[]): number[] {
  const len = length(a);
  return len > 0 ? [a[0] / len, a[1] / len, a[2] / len] : [0, 0, 0];
}

// --- Metrics ---

export interface QualityReport {
  triangleCount: number;
  dihedralAngles: { mean: number; max: number; stdDev: number; above15deg: number; above30deg: number };
  surfaceDeviation: { max: number; mean: number; rms: number } | null;
  normalAccuracy: { meanDeg: number; maxDeg: number } | null;
  aspectRatio: { mean: number; max: number; above10: number };
}

/** Count triangles. */
export function triangleCount(mesh: MeshData): number {
  return mesh.faces.length;
}

/**
 * Compute dihedral angles between adjacent triangles.
 * Returns angles in degrees.
 */
export function dihedralAngles(mesh: MeshData): number[] {
  // Build edge → face adjacency
  const edgeToFaces = new Map<string, number[]>();
  for (let fi = 0; fi < mesh.faces.length; fi++) {
    const f = mesh.faces[fi];
    for (let e = 0; e < 3; e++) {
      const a = Math.min(f[e], f[(e + 1) % 3]);
      const b = Math.max(f[e], f[(e + 1) % 3]);
      const key = `${a},${b}`;
      const list = edgeToFaces.get(key);
      if (list) list.push(fi);
      else edgeToFaces.set(key, [fi]);
    }
  }

  // Compute face normals
  const faceNormals = mesh.faces.map((f) => {
    const p0 = mesh.positions[f[0]];
    const p1 = mesh.positions[f[1]];
    const p2 = mesh.positions[f[2]];
    return normalize(cross(sub(p1, p0), sub(p2, p0)));
  });

  const angles: number[] = [];
  for (const faces of edgeToFaces.values()) {
    if (faces.length === 2) {
      const n1 = faceNormals[faces[0]];
      const n2 = faceNormals[faces[1]];
      const cosAngle = Math.max(-1, Math.min(1, dot(n1, n2)));
      angles.push(Math.acos(cosAngle) * (180 / Math.PI));
    }
  }
  return angles;
}

/**
 * Measure how far the tessellated mesh deviates from the true surface.
 * Samples random UV points, evaluates the true surface, and finds the
 * closest vertex on the mesh.
 */
export function surfaceDeviation(
  mesh: MeshData,
  surface: NurbsSurface,
  numSamples = 200
): { max: number; mean: number; rms: number } {
  const deviations: number[] = [];

  // Use deterministic pseudo-random sampling
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (let s = 0; s < numSamples; s++) {
    const u = rand();
    const v = rand();
    const truePoint = surface.point(u, v);

    // Find closest point on mesh (brute force over triangles)
    let minDist = Infinity;
    for (const face of mesh.faces) {
      // Use centroid as a fast approximation
      const p0 = mesh.positions[face[0]];
      const p1 = mesh.positions[face[1]];
      const p2 = mesh.positions[face[2]];
      const centroid = [
        (p0[0] + p1[0] + p2[0]) / 3,
        (p0[1] + p1[1] + p2[1]) / 3,
        (p0[2] + p1[2] + p2[2]) / 3,
      ];
      const dist = length(sub(truePoint, centroid));
      if (dist < minDist) minDist = dist;
    }

    // Also check closest vertex (often tighter)
    for (const pos of mesh.positions) {
      const dist = length(sub(truePoint, pos));
      if (dist < minDist) minDist = dist;
    }

    deviations.push(minDist);
  }

  const mean = deviations.reduce((a, b) => a + b, 0) / deviations.length;
  const rms = Math.sqrt(deviations.reduce((a, b) => a + b * b, 0) / deviations.length);
  return { max: deviations.reduce((a, b) => Math.max(a, b), 0), mean, rms };
}

/**
 * Compare vertex normals against analytical surface normals.
 * Returns angular errors in degrees.
 */
export function normalAccuracy(
  mesh: MeshData,
  surface: NurbsSurface
): { meanDeg: number; maxDeg: number } {
  const errors: number[] = [];

  for (let i = 0; i < mesh.uvs.length; i++) {
    const [u, v] = mesh.uvs[i];
    // Clamp to avoid boundary issues
    const uc = Math.max(0.001, Math.min(0.999, u));
    const vc = Math.max(0.001, Math.min(0.999, v));

    try {
      const trueNormal = normalize(surface.normal(uc, vc));
      const meshNormal = normalize(mesh.normals[i]);
      const cosAngle = Math.max(-1, Math.min(1, dot(trueNormal, meshNormal)));
      errors.push(Math.acos(Math.abs(cosAngle)) * (180 / Math.PI));
    } catch {
      // Skip degenerate normals at boundaries
    }
  }

  if (errors.length === 0) return { meanDeg: 0, maxDeg: 0 };
  const meanDeg = errors.reduce((a, b) => a + b, 0) / errors.length;
  return { meanDeg, maxDeg: errors.reduce((a, b) => Math.max(a, b), 0) };
}

/**
 * Compute triangle aspect ratios.
 * Aspect ratio = longest edge / shortest altitude.
 */
export function aspectRatios(mesh: MeshData): number[] {
  return mesh.faces.map((f) => {
    const p0 = mesh.positions[f[0]];
    const p1 = mesh.positions[f[1]];
    const p2 = mesh.positions[f[2]];

    const e0 = length(sub(p1, p0));
    const e1 = length(sub(p2, p1));
    const e2 = length(sub(p0, p2));

    const longestEdge = Math.max(e0, e1, e2);
    const area = length(cross(sub(p1, p0), sub(p2, p0))) / 2;

    if (area < 1e-12) return Infinity;
    const shortestAltitude = (2 * area) / longestEdge;
    return longestEdge / shortestAltitude;
  });
}

/**
 * Compute a full quality report for a mesh.
 */
export function qualityReport(
  mesh: MeshData,
  surface?: NurbsSurface
): QualityReport {
  const angles = dihedralAngles(mesh);
  const mean = angles.length > 0 ? angles.reduce((a, b) => a + b, 0) / angles.length : 0;
  const variance = angles.length > 0
    ? angles.reduce((a, b) => a + (b - mean) ** 2, 0) / angles.length
    : 0;

  const ratios = aspectRatios(mesh);
  const finiteRatios = ratios.filter(r => isFinite(r));
  const ratioMean = finiteRatios.length > 0 ? finiteRatios.reduce((a, b) => a + b, 0) / finiteRatios.length : 0;
  const ratioMax = finiteRatios.reduce((a, b) => Math.max(a, b), 0);

  return {
    triangleCount: mesh.faces.length,
    dihedralAngles: {
      mean,
      max: angles.length > 0 ? angles.reduce((a, b) => Math.max(a, b), 0) : 0,
      stdDev: Math.sqrt(variance),
      above15deg: angles.filter((a) => a > 15).length,
      above30deg: angles.filter((a) => a > 30).length,
    },
    surfaceDeviation: surface ? surfaceDeviation(mesh, surface) : null,
    normalAccuracy: surface ? normalAccuracy(mesh, surface) : null,
    aspectRatio: {
      mean: ratioMean,
      max: ratioMax,
      above10: ratios.filter((r) => r > 10).length,
    },
  };
}
