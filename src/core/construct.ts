/**
 * Geometric construction: circles, arcs, revolved/extruded/swept surfaces.
 * Implements algorithms from "The NURBS Book" Chapters 7-8.
 */

import type { CurveData, SurfaceData } from "./types";

// --- Vector helpers ---

function vecAdd(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + b[i]);
}

function vecSub(a: number[], b: number[]): number[] {
  return a.map((v, i) => v - b[i]);
}

function vecScale(a: number[], s: number): number[] {
  return a.map(v => v * s);
}

function vecDot(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function vecCross(a: number[], b: number[]): number[] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function vecNormalize(a: number[]): number[] {
  const len = Math.sqrt(vecDot(a, a));
  return len > 0 ? vecScale(a, 1 / len) : a;
}

function vecLength(a: number[]): number {
  return Math.sqrt(vecDot(a, a));
}

// --- Circle / Arc (Chapter 7) ---

/**
 * Create a NURBS arc (rational quadratic Bézier segments).
 * Algorithm: split arc into segments of ≤90°, each a rational quadratic
 * with weight = cos(halfAngle).
 */
export function createArc(
  center: number[],
  xaxis: number[],
  yaxis: number[],
  radius: number,
  startAngle: number,
  endAngle: number
): CurveData {
  const X = vecNormalize(xaxis);
  const Y = vecNormalize(yaxis);

  let theta = endAngle - startAngle;
  if (theta < 0) theta += 2 * Math.PI;

  // Number of arc segments (each ≤ 90°)
  let narcs: number;
  if (theta <= Math.PI / 2) narcs = 1;
  else if (theta <= Math.PI) narcs = 2;
  else if (theta <= 3 * Math.PI / 2) narcs = 3;
  else narcs = 4;

  const dtheta = theta / narcs;
  const w1 = Math.cos(dtheta / 2);

  // Starting point
  let P0 = vecAdd(center, vecAdd(vecScale(X, radius * Math.cos(startAngle)), vecScale(Y, radius * Math.sin(startAngle))));
  let T0 = vecAdd(vecScale(X, -Math.sin(startAngle)), vecScale(Y, Math.cos(startAngle)));

  const controlPoints: number[][] = [P0];
  const weights: number[] = [1];

  let angle = startAngle;
  for (let i = 0; i < narcs; i++) {
    angle += dtheta;
    const P2 = vecAdd(center, vecAdd(vecScale(X, radius * Math.cos(angle)), vecScale(Y, radius * Math.sin(angle))));
    const T2 = vecAdd(vecScale(X, -Math.sin(angle)), vecScale(Y, Math.cos(angle)));

    // Intersect tangent lines to find P1
    // P1 = P0 + a*T0 = P2 + b*T2
    // Solve for a using the intersection
    const dP = vecSub(P2, P0);
    const denom = T0[0] * T2[1] - T0[1] * T2[0];
    let a: number;
    if (Math.abs(denom) > 1e-14) {
      a = (dP[0] * T2[1] - dP[1] * T2[0]) / denom;
    } else {
      // Fallback for parallel tangents (180° arc)
      const denom2 = T0[0] * T2[2] - T0[2] * T2[0];
      if (Math.abs(denom2) > 1e-14) {
        a = (dP[0] * T2[2] - dP[2] * T2[0]) / denom2;
      } else {
        a = (dP[1] * T2[2] - dP[2] * T2[1]) / (T0[1] * T2[2] - T0[2] * T2[1]);
      }
    }
    const P1 = vecAdd(P0, vecScale(T0, a));

    controlPoints.push(P1, P2);
    weights.push(w1, 1);

    P0 = P2;
    T0 = T2;
  }

  // Build knot vector for degree 2
  const knots: number[] = [];
  // Clamped at start
  knots.push(0, 0, 0);
  // Interior knots
  for (let i = 1; i < narcs; i++) {
    const knotVal = i / narcs;
    knots.push(knotVal, knotVal);
  }
  // Clamped at end
  knots.push(1, 1, 1);

  return { degree: 2, knots, controlPoints, weights };
}

/**
 * Create a full NURBS circle.
 */
export function createCircle(
  center: number[],
  xaxis: number[],
  yaxis: number[],
  radius: number
): CurveData {
  return createArc(center, xaxis, yaxis, radius, 0, 2 * Math.PI);
}

/**
 * Create a NURBS elliptical arc.
 * xaxis and yaxis define the semi-axes (their lengths are the radii).
 */
export function createEllipseArc(
  center: number[],
  xaxis: number[],
  yaxis: number[],
  startAngle: number,
  endAngle: number
): CurveData {
  const rx = vecLength(xaxis);
  const ry = vecLength(yaxis);
  const X = vecNormalize(xaxis);
  const Y = vecNormalize(yaxis);

  let theta = endAngle - startAngle;
  if (theta < 0) theta += 2 * Math.PI;

  let narcs: number;
  if (theta <= Math.PI / 2) narcs = 1;
  else if (theta <= Math.PI) narcs = 2;
  else if (theta <= 3 * Math.PI / 2) narcs = 3;
  else narcs = 4;

  const dtheta = theta / narcs;
  const w1 = Math.cos(dtheta / 2);

  let P0 = vecAdd(center, vecAdd(vecScale(X, rx * Math.cos(startAngle)), vecScale(Y, ry * Math.sin(startAngle))));
  let T0 = vecAdd(vecScale(X, -rx * Math.sin(startAngle)), vecScale(Y, ry * Math.cos(startAngle)));

  const controlPoints: number[][] = [P0];
  const weights: number[] = [1];

  let angle = startAngle;
  for (let i = 0; i < narcs; i++) {
    angle += dtheta;
    const P2 = vecAdd(center, vecAdd(vecScale(X, rx * Math.cos(angle)), vecScale(Y, ry * Math.sin(angle))));
    const T2 = vecAdd(vecScale(X, -rx * Math.sin(angle)), vecScale(Y, ry * Math.cos(angle)));

    const dP = vecSub(P2, P0);
    const denom = T0[0] * T2[1] - T0[1] * T2[0];
    let a: number;
    if (Math.abs(denom) > 1e-14) {
      a = (dP[0] * T2[1] - dP[1] * T2[0]) / denom;
    } else {
      const denom2 = T0[0] * T2[2] - T0[2] * T2[0];
      if (Math.abs(denom2) > 1e-14) {
        a = (dP[0] * T2[2] - dP[2] * T2[0]) / denom2;
      } else {
        a = (dP[1] * T2[2] - dP[2] * T2[1]) / (T0[1] * T2[2] - T0[2] * T2[1]);
      }
    }
    const P1 = vecAdd(P0, vecScale(T0, a));

    controlPoints.push(P1, P2);
    weights.push(w1, 1);

    P0 = P2;
    T0 = T2;
  }

  const knots: number[] = [];
  knots.push(0, 0, 0);
  for (let i = 1; i < narcs; i++) {
    const knotVal = i / narcs;
    knots.push(knotVal, knotVal);
  }
  knots.push(1, 1, 1);

  return { degree: 2, knots, controlPoints, weights };
}

/**
 * Create a full NURBS ellipse.
 */
export function createEllipse(
  center: number[],
  xaxis: number[],
  yaxis: number[]
): CurveData {
  return createEllipseArc(center, xaxis, yaxis, 0, 2 * Math.PI);
}

/**
 * Create a cylindrical surface.
 */
export function createCylindricalSurface(
  axis: number[],
  xaxis: number[],
  base: number[],
  height: number,
  radius: number
): SurfaceData {
  const axisNorm = vecNormalize(axis);
  const xNorm = vecNormalize(xaxis);
  const yNorm = vecCross(axisNorm, xNorm);

  // Circle at base, extruded along axis
  const bottomCircle = createArc(base, xNorm, yNorm, radius, 0, 2 * Math.PI);

  // Extrude along axis
  const direction = vecScale(axisNorm, height);
  return createExtrudedSurface(bottomCircle, direction);
}

// --- Extruded Surface ---

/**
 * Create an extruded surface by translating a profile curve along a direction.
 * Degree 1 in the extrusion direction.
 */
export function createExtrudedSurface(
  profile: CurveData,
  direction: number[]
): SurfaceData {
  const cp0 = profile.controlPoints;
  const cp1 = cp0.map(pt => vecAdd(pt, direction));

  return {
    degreeU: profile.degree,
    degreeV: 1,
    knotsU: [...profile.knots],
    knotsV: [0, 0, 1, 1],
    controlPoints: cp0.map((pt, i) => [pt, cp1[i]]),
    weights: profile.weights.map(w => [w, w]),
  };
}

// --- Revolved Surface (Algorithm A8.1) ---

/**
 * Create a surface of revolution by rotating a profile curve around an axis.
 */
export function createRevolvedSurface(
  profile: CurveData,
  center: number[],
  axis: number[],
  angle: number
): SurfaceData {
  // Create the circular arc data for the revolution
  const axisNorm = vecNormalize(axis);

  // For each profile control point, create a circular arc
  const arcData = createArc(
    [0, 0, 0], [1, 0, 0], [0, 1, 0], 1, 0, angle
  );
  const numArcPts = arcData.controlPoints.length;

  // Build surface control points
  const surfCP: number[][][] = [];
  const surfW: number[][] = [];

  for (let j = 0; j < profile.controlPoints.length; j++) {
    const P = profile.controlPoints[j];
    const wProf = profile.weights[j];

    // Project P onto axis to find the rotation center for this point
    const OP = vecSub(P, center);
    const proj = vecDot(OP, axisNorm);
    const onAxis = vecAdd(center, vecScale(axisNorm, proj));
    const radVec = vecSub(P, onAxis);
    const radius = vecLength(radVec);

    if (radius < 1e-14) {
      // Point is on the axis — all arc points are the same
      surfCP[j] = [];
      surfW[j] = [];
      for (let i = 0; i < numArcPts; i++) {
        surfCP[j][i] = [...P];
        surfW[j][i] = wProf * arcData.weights[i];
      }
      continue;
    }

    // Local coordinate frame for the arc
    const X = vecScale(radVec, 1 / radius);
    const Y = vecCross(axisNorm, X);

    // Create arc control points for this profile point
    const localArc = createArc(onAxis, X, Y, radius, 0, angle);

    surfCP[j] = [];
    surfW[j] = [];
    for (let i = 0; i < localArc.controlPoints.length; i++) {
      surfCP[j][i] = localArc.controlPoints[i];
      surfW[j][i] = wProf * localArc.weights[i];
    }
  }

  // Transpose: surface is [arc_direction][profile_direction]
  // but we built it as [profile][arc], need to transpose for U=arc, V=profile convention
  const cpT: number[][][] = [];
  const wT: number[][] = [];
  for (let i = 0; i < numArcPts; i++) {
    cpT[i] = [];
    wT[i] = [];
    for (let j = 0; j < profile.controlPoints.length; j++) {
      cpT[i][j] = surfCP[j][i];
      wT[i][j] = surfW[j][i];
    }
  }

  return {
    degreeU: 2, // arc degree
    degreeV: profile.degree,
    knotsU: arcData.knots,
    knotsV: [...profile.knots],
    controlPoints: cpT,
    weights: wT,
  };
}

// --- Swept Surface (translational) ---

/**
 * Create a swept surface by translating a profile along a rail.
 * Simple translational sweep: at each rail point, place the profile.
 */
export function createSweptSurface(
  profile: CurveData,
  rail: CurveData
): SurfaceData {
  const numProf = profile.controlPoints.length;
  const numRail = rail.controlPoints.length;
  const origin = rail.controlPoints[0];

  const cp: number[][][] = [];
  const w: number[][] = [];

  for (let i = 0; i < numRail; i++) {
    cp[i] = [];
    w[i] = [];
    const offset = vecSub(rail.controlPoints[i], origin);
    for (let j = 0; j < numProf; j++) {
      cp[i][j] = vecAdd(profile.controlPoints[j], offset);
      w[i][j] = rail.weights[i] * profile.weights[j];
    }
  }

  return {
    degreeU: rail.degree,
    degreeV: profile.degree,
    knotsU: [...rail.knots],
    knotsV: [...profile.knots],
    controlPoints: cp,
    weights: w,
  };
}
