import { Vector3 } from "three";
import verb from "verb-nurbs";

export function projectPointToSurface(
  surface: verb.geom.NurbsSurface,
  u: number,
  v: number
): Vector3 {
  const pt = surface.point(u, v);
  return new Vector3(pt[0], pt[1], pt[2]);
}

export function computeNormal(
  surface: verb.geom.NurbsSurface,
  u: number,
  v: number,
  epsilon = 0.0001
): Vector3 {
  const p = surface.point(u, v);
  const pu = surface.point(u + epsilon, v);
  const pv = surface.point(u, v + epsilon);

  const du = new Vector3().subVectors(new Vector3(...pu), new Vector3(...p));
  const dv = new Vector3().subVectors(new Vector3(...pv), new Vector3(...p));

  return new Vector3().crossVectors(du, dv).normalize();
}

export function sampleNurbsCurve2D(
  curve: any,
  numPoints = 100
): [number, number][] {
  return Array.from({ length: numPoints }, (_, i) => {
    const t = i / (numPoints - 1);
    const pt = curve.point(t);
    return [pt[0], pt[1]];
  });
}

// Adaptive sampling for NURBS curve in 2D (UV space)
export function adaptiveSampleNurbsCurve2D(
  curve: any,
  maxAngleDeg = 5,
  maxDepth = 10
): [number, number][] {
  const toVec2 = (pt: number[]) => [pt[0], pt[1]] as [number, number];
  const angleBetween = (a: [number, number], b: [number, number], c: [number, number]) => {
    const ab = [b[0] - a[0], b[1] - a[1]];
    const bc = [c[0] - b[0], c[1] - b[1]];
    const dot = ab[0] * bc[0] + ab[1] * bc[1];
    const magAB = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]);
    const magBC = Math.sqrt(bc[0] * bc[0] + bc[1] * bc[1]);
    if (magAB === 0 || magBC === 0) return 0;
    let angle = Math.acos(Math.max(-1, Math.min(1, dot / (magAB * magBC))));
    return angle * (180 / Math.PI);
  };

  function subdivide(t0: number, t1: number, depth: number): [number, number][] {
    const p0 = toVec2(curve.point(t0));
    const p1 = toVec2(curve.point((t0 + t1) / 2));
    const p2 = toVec2(curve.point(t1));
    const angle = angleBetween(p0, p1, p2);
    if (angle > maxAngleDeg && depth < maxDepth) {
      // Subdivide further
      const left = subdivide(t0, (t0 + t1) / 2, depth + 1);
      const right = subdivide((t0 + t1) / 2, t1, depth + 1);
      return [...left.slice(0, -1), ...right];
    } else {
      return [p0, p2];
    }
  }

  const points: [number, number][] = [];
  const steps = 10;
  let last: [number, number] | null = null;
  for (let i = 0; i < steps; i++) {
    const seg = subdivide(i / steps, (i + 1) / steps, 0);
    for (const pt of seg) {
      if (!last || pt[0] !== last[0] || pt[1] !== last[1]) {
        points.push(pt);
        last = pt;
      }
    }
  }
  return points;
}

export function projectPointToSurfaceUV(
  surface: verb.geom.NurbsSurface,
  point: number[],
  resolution = 20
): [number, number] | null {
  // Grid search for initial guess
  let minDist = Infinity;
  let bestUV: [number, number] | null = null;

  // Search in UV space
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const u = i / resolution;
      const v = j / resolution;
      const surfacePoint = surface.point(u, v);
      const dist = Math.sqrt(
        Math.pow(surfacePoint[0] - point[0], 2) +
        Math.pow(surfacePoint[1] - point[1], 2) +
        Math.pow(surfacePoint[2] - point[2], 2)
      );
      if (dist < minDist) {
        minDist = dist;
        bestUV = [u, v];
      }
    }
  }

  if (!bestUV) return null;

  // Simple gradient descent to refine the solution
  const epsilon = 0.0001;
  const stepSize = 0.01;
  const maxIterations = 100;
  let [u, v] = bestUV;

  for (let iter = 0; iter < maxIterations; iter++) {
    const p = surface.point(u, v);
    const pu = surface.point(u + epsilon, v);
    const pv = surface.point(u, v + epsilon);

    // Compute gradients
    const du = [
      (pu[0] - p[0]) / epsilon,
      (pu[1] - p[1]) / epsilon,
      (pu[2] - p[2]) / epsilon,
    ];
    const dv = [
      (pv[0] - p[0]) / epsilon,
      (pv[1] - p[1]) / epsilon,
      (pv[2] - p[2]) / epsilon,
    ];

    // Compute distance gradients
    const distU = 2 * (
      du[0] * (p[0] - point[0]) +
      du[1] * (p[1] - point[1]) +
      du[2] * (p[2] - point[2])
    );
    const distV = 2 * (
      dv[0] * (p[0] - point[0]) +
      dv[1] * (p[1] - point[1]) +
      dv[2] * (p[2] - point[2])
    );

    // Update UV coordinates
    const newU = Math.max(0, Math.min(1, u - stepSize * distU));
    const newV = Math.max(0, Math.min(1, v - stepSize * distV));

    // Check convergence
    if (Math.abs(newU - u) < epsilon && Math.abs(newV - v) < epsilon) {
      return [newU, newV];
    }

    u = newU;
    v = newV;
  }

  return [u, v];
} 