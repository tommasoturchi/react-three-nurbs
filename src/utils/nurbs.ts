import { Vector3 } from "three";
import verb from "verb-nurbs";

/**
 * Generates a clamped uniform knot vector for given number of control points and degree.
 */
export function generateUniformKnots(
  numControlPoints: number,
  degree: number
): number[] {
  const numKnots = numControlPoints + degree + 1;
  return Array(numKnots)
    .fill(0)
    .map((_, i) => {
      if (i < degree + 1) return 0;
      if (i >= numKnots - degree - 1) return 1;
      return (i - degree) / (numKnots - 2 * degree - 1);
    });
}

/**
 * Evaluates a surface point and wraps it in a Vector3.
 */
export function projectPointToSurface(
  surface: verb.geom.NurbsSurface,
  u: number,
  v: number
): Vector3 {
  const pt = surface.point(u, v);
  return new Vector3(pt[0], pt[1], pt[2]);
}

/**
 * Computes the surface normal at (u, v) using verb's analytical normal.
 */
export function computeNormal(
  surface: verb.geom.NurbsSurface,
  u: number,
  v: number
): Vector3 {
  try {
    const n = surface.normal(u, v);
    const vec = new Vector3(n[0], n[1], n[2]);
    const len = vec.length();
    return len > 0 ? vec.divideScalar(len) : new Vector3(0, 1, 0);
  } catch {
    // Fallback to finite differences at domain boundaries
    const epsilon = 0.0001;
    const p = surface.point(u, v);
    const pu = surface.point(Math.min(u + epsilon, 1), v);
    const pv = surface.point(u, Math.min(v + epsilon, 1));
    const du = new Vector3().subVectors(new Vector3(...pu), new Vector3(...p));
    const dv = new Vector3().subVectors(new Vector3(...pv), new Vector3(...p));
    const normal = new Vector3().crossVectors(du, dv).normalize();
    return normal.length() > 0 ? normal : new Vector3(0, 1, 0);
  }
}

/**
 * Uniformly samples a NURBS curve in 2D (UV space).
 */
export function sampleNurbsCurve2D(
  curve: verb.geom.NurbsCurve,
  numPoints = 100
): [number, number][] {
  return Array.from({ length: numPoints }, (_, i) => {
    const t = i / (numPoints - 1);
    const pt = curve.point(t);
    return [pt[0], pt[1]];
  });
}

/**
 * Adaptively samples a NURBS curve in 2D (UV space) based on angle threshold.
 */
export function adaptiveSampleNurbsCurve2D(
  curve: verb.geom.NurbsCurve,
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
    const angle = Math.acos(Math.max(-1, Math.min(1, dot / (magAB * magBC))));
    return angle * (180 / Math.PI);
  };

  function subdivide(t0: number, t1: number, depth: number): [number, number][] {
    const p0 = toVec2(curve.point(t0));
    const p1 = toVec2(curve.point((t0 + t1) / 2));
    const p2 = toVec2(curve.point(t1));
    const angle = angleBetween(p0, p1, p2);
    if (angle > maxAngleDeg && depth < maxDepth) {
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

/**
 * Projects a 3D point onto a surface, returning the closest UV parameters.
 * Uses verb's built-in closestParam for accuracy and performance.
 */
export function projectPointToSurfaceUV(
  surface: verb.geom.NurbsSurface,
  point: number[]
): [number, number] | null {
  try {
    const uv = surface.closestParam(point);
    return [uv[0], uv[1]];
  } catch {
    return null;
  }
}
