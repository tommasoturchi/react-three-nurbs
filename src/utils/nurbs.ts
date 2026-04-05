import { Vector3 } from "three";
import type { NurbsCurve } from "../core";
import type { NurbsSurface } from "../core";

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
  surface: NurbsSurface,
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
  surface: NurbsSurface,
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
  curve: NurbsCurve,
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
  curve: NurbsCurve,
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
 */
export function projectPointToSurfaceUV(
  surface: NurbsSurface,
  point: number[]
): [number, number] | null {
  try {
    const uv = surface.closestParam(point);
    return [uv[0], uv[1]];
  } catch {
    return null;
  }
}

/**
 * Projects an entire 3D curve onto a surface, returning UV-space points.
 * Uses marching approach: each projected point uses the previous result as
 * initial guess for Newton iteration, ensuring continuity and speed.
 *
 * This is significantly more robust than projecting points independently,
 * especially for curves that run near surface boundaries or along near-tangent
 * directions. Based on the approach described in Section 6.1 of The NURBS Book.
 */
export function projectCurveOntoSurface(
  surface: NurbsSurface,
  curve: NurbsCurve,
  numSamples = 100
): [number, number][] {
  const projectedUVs: [number, number][] = [];

  // Project first point with full search (no prior guess)
  const firstPt = curve.point(0);
  const firstUV = surface.closestParam(firstPt);
  projectedUVs.push([firstUV[0], firstUV[1]]);

  // March along the curve, using previous UV as initial guess
  for (let i = 1; i <= numSamples; i++) {
    const t = i / numSamples;
    const pt3d = curve.point(t);

    // Use previous UV as starting point for a local Newton refinement
    const prevUV = projectedUVs[projectedUVs.length - 1];
    const uv = localSurfaceProjection(surface, pt3d, prevUV[0], prevUV[1]);
    projectedUVs.push(uv);
  }

  return projectedUVs;
}

/**
 * Newton iteration for surface point projection starting from a given (u0, v0).
 * Used by the marching curve projection for fast local convergence.
 */
function localSurfaceProjection(
  surface: NurbsSurface,
  point: number[],
  u0: number,
  v0: number
): [number, number] {
  const dim = point.length;
  const eps1 = 1e-8;
  const eps2 = 1e-6;

  let u = u0;
  let v = v0;

  for (let iter = 0; iter < 20; iter++) {
    const ders = surface.derivatives(u, v, 1);
    const S = ders[0][0];
    const Su = ders[1][0];
    const Sv = ders[0][1];
    const diff = S.map((s, d) => s - point[d]);

    // Check convergence (same 4 criteria as closestParam)
    let distSq = 0;
    for (let d = 0; d < dim; d++) distSq += diff[d] ** 2;
    if (Math.sqrt(distSq) < eps1) break;

    let dotSuDiff = 0, dotSvDiff = 0, SuLen = 0, SvLen = 0;
    for (let d = 0; d < dim; d++) {
      dotSuDiff += Su[d] * diff[d];
      dotSvDiff += Sv[d] * diff[d];
      SuLen += Su[d] ** 2;
      SvLen += Sv[d] ** 2;
    }
    SuLen = Math.sqrt(SuLen);
    SvLen = Math.sqrt(SvLen);
    const dist = Math.sqrt(distSq);
    if (SuLen > 0 && SvLen > 0 && dist > 0) {
      if (Math.abs(dotSuDiff) / (SuLen * dist) < eps2 &&
          Math.abs(dotSvDiff) / (SvLen * dist) < eps2) break;
    }

    // Newton step
    let j00 = 0, j01 = 0, j11 = 0;
    for (let d = 0; d < dim; d++) {
      j00 += Su[d] * Su[d];
      j01 += Su[d] * Sv[d];
      j11 += Sv[d] * Sv[d];
    }
    const det = j00 * j11 - j01 * j01;
    if (Math.abs(det) < 1e-14) break;

    const du = -(j11 * dotSuDiff - j01 * dotSvDiff) / det;
    const dv = -(j00 * dotSvDiff - j01 * dotSuDiff) / det;

    // Clamp to [0,1] domain (standard for most surfaces)
    u = Math.max(0, Math.min(1, u + du));
    v = Math.max(0, Math.min(1, v + dv));
  }

  return [u, v];
}
